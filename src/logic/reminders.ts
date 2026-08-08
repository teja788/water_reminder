import { Settings } from '../types';

const MINUTE_MS = 60 * 1000;
/**
 * Never schedule two reminders closer than this. Also load-bearing for the
 * iOS 64-scheduled-notification cap: at the widest wake/sleep window it bounds
 * the schedule to ~47 (24 today + 23 tomorrow) — don't lower it casually.
 */
const MIN_GAP_MS = 45 * MINUTE_MS;
/** Give the user breathing room after "now" before the next nudge. */
const START_DELAY_MS = 45 * MINUTE_MS;
/** Stop nudging shortly before sleep time. */
const END_BUFFER_MS = 30 * MINUTE_MS;

/** The given day at `minutes` past local midnight. */
function atMinutes(day: Date, minutes: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
}

function spread(startMs: number, endMs: number, wanted: number): Date[] {
  if (wanted <= 0 || startMs > endMs) {
    return [];
  }
  const maxFit = Math.floor((endMs - startMs) / MIN_GAP_MS) + 1;
  const count = Math.min(wanted, maxFit);
  if (count === 1) {
    return [new Date(startMs)];
  }
  const gap = (endMs - startMs) / (count - 1);
  return Array.from({ length: count }, (_, i) => new Date(startMs + i * gap));
}

/**
 * Reminders for the rest of today. The core "smart" behavior:
 * - none if the goal is already met (the top complaint about competitors)
 * - count scales with how much is left (remaining / default cup)
 * - evenly spread between now+delay and sleep-buffer, never closer than MIN_GAP
 */
export function computeTodayReminderTimes(
  now: Date,
  settings: Settings,
  todayTotalMl: number
): Date[] {
  if (!settings.remindersEnabled) {
    return [];
  }
  const remainingMl = settings.goalMl - todayTotalMl;
  if (remainingMl <= 0) {
    return [];
  }
  const start = Math.max(
    now.getTime() + START_DELAY_MS,
    atMinutes(now, settings.wakeMinutes).getTime()
  );
  const end = atMinutes(now, settings.sleepMinutes).getTime() - END_BUFFER_MS;
  const wanted = Math.ceil(remainingMl / settings.defaultCupMl);
  return spread(start, end, wanted);
}

/**
 * Tomorrow's full-day schedule, assuming zero progress. Scheduled ahead so
 * reminders fire even if the app isn't opened tomorrow. Recomputed on every
 * app open / foreground / log, so it self-corrects.
 *
 * Intentional asymmetry with today: tomorrow's first nudge waits an hour
 * after wake, while today's can start right at wake (the user is already
 * awake if the app computed a plan for today).
 */
export function computeTomorrowReminderTimes(now: Date, settings: Settings): Date[] {
  if (!settings.remindersEnabled) {
    return [];
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = atMinutes(tomorrow, settings.wakeMinutes).getTime() + 60 * MINUTE_MS;
  const end = atMinutes(tomorrow, settings.sleepMinutes).getTime() - END_BUFFER_MS;
  const wanted = Math.ceil(settings.goalMl / settings.defaultCupMl);
  return spread(start, end, wanted);
}
