import * as Notifications from 'expo-notifications';
import { DrinkEntry, Settings, Units } from './types';
import { formatAmount } from './logic/hydration';
import { t } from './i18n';
import {
  BACKOFF_AFTER,
  computeTodayReminderTimes,
  computeTomorrowReminderTimes,
} from './logic/reminders';

// No '-' or ':' in the category identifier — the SDK docs warn categories
// might not work as expected with them. (Action identifiers are unconstrained.)
export const REMINDER_CATEGORY = 'waterReminder';
export const ACTION_LOG_DEFAULT = 'log-default';
export const ACTION_SNOOZE = 'snooze';
export const SNOOZE_MS = 60 * 60 * 1000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * iOS denial is terminal: after the user denies once, requestPermissionsAsync
 * keeps returning denied without showing the prompt again. Recovery is only
 * via iOS Settings — callers should surface that hint when this returns false.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const result = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return result.granted;
}

/**
 * Registers the quick-log and snooze actions so the user can log their default cup
 * straight from the notification without opening the app.
 * Re-run whenever defaultCupMl or units change (button title shows the amount).
 */
export async function setupQuickLogCategory(
  defaultCupMl: number,
  units: Units
): Promise<void> {
  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY, [
    {
      identifier: ACTION_LOG_DEFAULT,
      buttonTitle: t.notifications.quickLog(formatAmount(defaultCupMl, units)),
      options: { opensAppToForeground: false },
    },
    {
      identifier: ACTION_SNOOZE,
      buttonTitle: t.notifications.snooze,
      options: { opensAppToForeground: false },
    },
  ]);
}

const MESSAGES = t.notifications.messages;
const SOFT_MESSAGES = t.notifications.softMessages;

let rescheduleQueue: Promise<void> = Promise.resolve();

/**
 * Cancel-and-reschedule everything from current state. Called on app open,
 * every foreground, every log/undo, and after settings changes. Calls are
 * serialized through a queue so two rapid logs can't interleave their
 * cancel/schedule phases (which would leave duplicate or missing reminders).
 * Schedules the rest of today (progress-aware) plus tomorrow (baseline),
 * staying far under the 64-notification iOS limit.
 * The returned promise always resolves — failures are swallowed to protect
 * the queue, so callers cannot observe success/failure by awaiting it.
 */
export function rescheduleReminders(
  settings: Settings,
  entries: DrinkEntry[],
  snoozedUntil = 0,
  now: Date = new Date()
): Promise<void> {
  rescheduleQueue = rescheduleQueue
    .then(() => doReschedule(settings, entries, snoozedUntil, now))
    .catch(() => {
      // A failed reschedule must not poison the queue for later calls.
    });
  return rescheduleQueue;
}

async function doReschedule(
  settings: Settings,
  entries: DrinkEntry[],
  snoozedUntil: number,
  now: Date
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.remindersEnabled) {
    return;
  }
  // Each batch assumes nothing gets logged from its start, so its index is
  // also how many reminders in a row have gone unanswered by then.
  const batches = [
    computeTodayReminderTimes(now, settings, entries, snoozedUntil),
    computeTomorrowReminderTimes(now, settings, entries),
  ];
  const times = batches.flatMap((batch) =>
    batch.map((date, i) => ({ date, i, soft: i >= BACKOFF_AFTER }))
  );
  await Promise.all(
    times.map(({ date, i, soft }) => {
      // Key the message off the target hour, not the array index. The times
      // array is rebuilt on every reschedule, so an index key would pin the
      // soonest reminder — the one users actually see — to MESSAGES[0] forever.
      // `+ i` because backed-off gaps are often exactly 4 or 8 hours, which
      // would land every soft reminder on the same one of SOFT_MESSAGES' four.
      const slot = Math.floor(date.getTime() / (60 * 60 * 1000));
      const pool = soft ? SOFT_MESSAGES : MESSAGES;
      const [title, body] = pool[(slot + i) % pool.length];
      return Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          categoryIdentifier: REMINDER_CATEGORY,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
        },
      });
    })
  );
}
