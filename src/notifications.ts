import * as Notifications from 'expo-notifications';
import { Settings, Units } from './types';
import { formatAmount } from './logic/hydration';
import {
  computeTodayReminderTimes,
  computeTomorrowReminderTimes,
} from './logic/reminders';

// No '-' or ':' in the category identifier — the SDK docs warn categories
// might not work as expected with them. (Action identifiers are unconstrained.)
export const REMINDER_CATEGORY = 'waterReminder';
export const ACTION_LOG_DEFAULT = 'log-default';

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
 * Registers the quick-log action so the user can log their default cup
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
      buttonTitle: `Log ${formatAmount(defaultCupMl, units)}`,
      options: { opensAppToForeground: false },
    },
  ]);
}

const MESSAGES: Array<[string, string]> = [
  ['Time for water 💧', 'A quick glass now keeps you on track.'],
  ['Hydration check', 'Your body will thank you for a sip.'],
  ['Water break', 'Small sips, big difference.'],
  ['Thirsty yet?', 'A glass of water sounds good right about now.'],
  ['Keep it flowing', "You're closer to today's goal than you think."],
  ['Sip reminder', 'Take a moment — have some water.'],
  ["Water o'clock", 'One glass now beats catching up later.'],
  ['Stay refreshed', 'A little water goes a long way.'],
];

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
  todayTotalMl: number,
  now: Date = new Date()
): Promise<void> {
  rescheduleQueue = rescheduleQueue
    .then(() => doReschedule(settings, todayTotalMl, now))
    .catch(() => {
      // A failed reschedule must not poison the queue for later calls.
    });
  return rescheduleQueue;
}

async function doReschedule(
  settings: Settings,
  todayTotalMl: number,
  now: Date
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.remindersEnabled) {
    return;
  }
  const times = [
    ...computeTodayReminderTimes(now, settings, todayTotalMl),
    ...computeTomorrowReminderTimes(now, settings),
  ];
  await Promise.all(
    times.map((date) => {
      // Key the message off the target hour, not the array index. The times
      // array is rebuilt on every reschedule, so an index key would pin the
      // soonest reminder — the one users actually see — to MESSAGES[0] forever.
      const slot = Math.floor(date.getTime() / (60 * 60 * 1000));
      const [title, body] = MESSAGES[slot % MESSAGES.length];
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
