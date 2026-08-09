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
  // Synchronous mirror of `entries` so same-tick updates (double-tapping a
  // cup button, or a manual log racing the quick-log effect) can't build
  // from a stale closure and silently drop a drink.
  const entriesRef = useRef<DrinkEntry[]>([]);
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
      entriesRef.current = e;
      setEntries(e);
      setReady(true);
      if (s) {
        // Enqueue synchronously, before yielding: this baseline reschedule
        // must be ordered ahead of any reschedule a pending quick-log effect
        // enqueues, so the quick-log's (higher) total is the queue's last word.
        void rescheduleReminders(s, totalForDay(e, Date.now()));
        void setupQuickLogCategory(s.defaultCupMl, s.units);
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
    (update: (prev: DrinkEntry[]) => DrinkEntry[], s: Settings | null) => {
      const next = update(entriesRef.current);
      entriesRef.current = next;
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
      persistEntries((prev) => [...prev, entry], settings);
    },
    [settings, persistEntries]
  );

  const undoLast = useCallback(() => {
    if (entriesRef.current.length === 0) {
      return;
    }
    persistEntries((prev) => {
      // Backdated quick-log entries mean the last array element isn't
      // necessarily the most recent drink — remove the max-timestamp entry.
      let latest = 0;
      for (let i = 1; i < prev.length; i++) {
        if (prev[i].timestamp > prev[latest].timestamp) {
          latest = i;
        }
      }
      return prev.filter((_, i) => i !== latest);
    }, settings);
  }, [settings, persistEntries]);

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
  // backdated to when the notification FIRED (not when it was tapped), so an
  // overnight-delayed response lands on the day the reminder belonged to.
  // Known v1 limitation: only the most recent response survives an app kill.
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
    // expo-notifications serializes Notification.date as SECONDS on iOS
    // (timeIntervalSince1970 in NotificationRecords.swift) but MILLISECONDS
    // on Android, with no JS-side normalization. 1e11 sits unambiguously
    // between the two for any plausible date.
    const rawDate = lastResponse.notification.date;
    const firedAtMs = Math.round(rawDate < 1e11 ? rawDate * 1000 : rawDate);
    logDrink(settings.defaultCupMl, firedAtMs);
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
