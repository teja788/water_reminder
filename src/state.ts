import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DrinkEntry, Settings, makeEntryId } from './types';
import { loadEntries, loadSettings, saveEntries, saveSettings } from './storage';
import { currentStreak, totalForDay } from './logic/hydration';
import { computeTodayReminderTimes } from './logic/reminders';
import {
  ACTION_LOG_DEFAULT,
  rescheduleReminders,
  setupQuickLogCategory,
} from './notifications';

export interface HydrationState {
  /** False until AsyncStorage has been read. */
  ready: boolean;
  /** null = onboarding not completed yet. */
  settings: Settings | null;
  entries: DrinkEntry[];
  todayTotalMl: number;
  streak: number;
  /** First upcoming reminder today, or null. */
  nextReminder: Date | null;
  logDrink: (amountMl: number, timestampMs?: number) => void;
  undoLast: () => void;
  updateSettings: (next: Settings) => void;
}

export function useHydration(): HydrationState {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  // Bumped on every return to foreground. It is ONLY a dependency that forces
  // the day-based memos below to recompute — without it, an app backgrounded
  // over midnight would keep showing yesterday's totals.
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    (async () => {
      let [s, e] = await Promise.all([loadSettings(), loadEntries()]);
      if (s?.remindersEnabled) {
        // The user may have revoked notification permission in iOS Settings
        // since last launch; don't keep pretending reminders are on.
        const perm = await Notifications.getPermissionsAsync();
        if (!perm.granted) {
          s = { ...s, remindersEnabled: false };
          void saveSettings(s);
        }
      }
      setSettings(s);
      setEntries(e);
      setReady(true);
      if (s) {
        await setupQuickLogCategory(s.defaultCupMl, s.units);
        await rescheduleReminders(s, totalForDay(e, Date.now()));
      }
    })();
  }, []);

  // On foreground: refresh "today" and re-sync scheduled notifications with
  // reality (they were computed against stale progress if the app slept over
  // midnight, and tomorrow's batch needs to keep rolling forward).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }
      setNowTick(Date.now());
      if (settings) {
        void rescheduleReminders(settings, totalForDay(entries, Date.now()));
      }
    });
    return () => sub.remove();
  }, [settings, entries]);

  const todayTotalMl = useMemo(
    () => totalForDay(entries, Date.now()),
    [entries, nowTick]
  );

  const streak = useMemo(
    () => (settings ? currentStreak(entries, settings.goalMl, new Date()) : 0),
    [entries, settings, nowTick]
  );

  const nextReminder = useMemo(() => {
    if (!settings) {
      return null;
    }
    const times = computeTodayReminderTimes(new Date(), settings, todayTotalMl);
    return times.length > 0 ? times[0] : null;
  }, [settings, todayTotalMl, nowTick]);

  const persistEntries = useCallback(
    (next: DrinkEntry[], s: Settings | null) => {
      setEntries(next);
      void saveEntries(next);
      if (s) {
        void rescheduleReminders(s, totalForDay(next, Date.now()));
      }
    },
    []
  );

  const logDrink = useCallback(
    (amountMl: number, timestampMs?: number) => {
      const ts = timestampMs ?? Date.now();
      const entry: DrinkEntry = {
        id: makeEntryId(ts),
        timestamp: ts,
        amountMl,
      };
      persistEntries([...entries, entry], settings);
    },
    [entries, settings, persistEntries]
  );

  const undoLast = useCallback(() => {
    if (entries.length === 0) {
      return;
    }
    // Backdated quick-log entries mean the last array element isn't
    // necessarily the most recent drink — remove the max-timestamp entry.
    let latest = 0;
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].timestamp > entries[latest].timestamp) {
        latest = i;
      }
    }
    persistEntries(entries.filter((_, i) => i !== latest), settings);
  }, [entries, settings, persistEntries]);

  const updateSettings = useCallback(
    (next: Settings) => {
      setSettings(next);
      void saveSettings(next);
      void setupQuickLogCategory(next.defaultCupMl, next.units);
      void rescheduleReminders(next, totalForDay(entries, Date.now()));
    },
    [entries]
  );

  // Quick-log action tapped on a notification (works from background; if the
  // app was killed, the response arrives on next launch). The entry is
  // backdated to when the notification was acted on so an overnight-delayed
  // response still lands on the correct day. Known v1 limitation: only the
  // most recent response survives an app kill.
  const lastResponse = Notifications.useLastNotificationResponse();
  const processedResponses = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!lastResponse || !settings) {
      return;
    }
    if (lastResponse.actionIdentifier !== ACTION_LOG_DEFAULT) {
      return;
    }
    const id = lastResponse.notification.request.identifier;
    if (processedResponses.current.has(id)) {
      return;
    }
    processedResponses.current.add(id);
    // Notification.date is Unix ms (SDK 56 docs) — safe to use as a timestamp.
    logDrink(settings.defaultCupMl, lastResponse.notification.date);
    Notifications.clearLastNotificationResponse();
  }, [lastResponse, settings, logDrink]);

  return {
    ready,
    settings,
    entries,
    todayTotalMl,
    streak,
    nextReminder,
    logDrink,
    undoLast,
    updateSettings,
  };
}
