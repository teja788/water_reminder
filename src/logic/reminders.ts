import { DrinkEntry, Settings } from '../types';
import { dayKey, totalForDay } from './hydration';

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
/**
 * Every schedule assumes no drink is logged from now on (any log reschedules
 * from scratch), so reminder N in a batch is also the Nth one ignored in a row.
 * After this many go unanswered, the gaps double and the copy softens.
 */
export const BACKOFF_AFTER = 2;
/** Evening cutoff: learn from this many past days, once this many have logs. */
const CUTOFF_LOOKBACK_DAYS = 14;
const CUTOFF_MIN_DAYS = 7;
/** Keep nudging this long after the latest drink ever logged in that window. */
const CUTOFF_GRACE_MINUTES = 30;
/** The learned cutoff never comes earlier than this before bedtime: a week of
 *  morning-only logging must not end every day's reminders at breakfast. */
const CUTOFF_FLOOR_BEFORE_SLEEP_MINUTES = 4 * 60;

/** The given day at `minutes` past local midnight. */
function atMinutes(day: Date, minutes: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
}

function spread(startMs: number, endMs: number, wanted: number): Date[] {
  if (wanted <= 0 || startMs > endMs) {
    return [];
  }
  // Even spacing for the first BACKOFF_AFTER, then double gaps: ignored
  // reminders get rarer instead of piling up toward bedtime. Keep as many as
  // fit at the even spacing, then stretch them so the last still lands on
  // `end` (`units` = the window measured in single gaps).
  const maxFit = Math.floor((endMs - startMs) / MIN_GAP_MS) + 1;
  const evenCount = Math.min(wanted, maxFit);
  if (evenCount === 1) {
    return [new Date(startMs)];
  }
  const units = (n: number) =>
    Math.min(n - 1, BACKOFF_AFTER - 1) + 2 * Math.max(0, n - BACKOFF_AFTER);
  let count = evenCount;
  while (units(count) > evenCount - 1) {
    count--;
  }
  // Three cups left must not shrink to "now and bedtime": keep one reminder
  // past the even pair whenever it still fits the minimum gap.
  const floor = Math.min(evenCount, BACKOFF_AFTER + 1);
  if (count < floor && units(floor) <= maxFit - 1) {
    count = floor;
  }
  const gap = (endMs - startMs) / units(count);
  const times: Date[] = [];
  for (let at = startMs, i = 0; i < count; i++) {
    times.push(new Date(at));
    at += i + 1 < BACKOFF_AFTER ? gap : gap * 2;
  }
  return times;
}

/**
 * Minutes past midnight after which this person never drinks, learned from
 * recent history: the latest log across the last CUTOFF_LOOKBACK_DAYS days,
 * plus a grace period. null until there are enough days to trust it.
 * The latest (not a typical) log keeps it conservative: it only moves earlier
 * after two weeks with no drink that late, and a drink logged in answer to the
 * last reminder holds it where it is.
 */
export function learnedCutoffMinutes(entries: DrinkEntry[], now: Date): number | null {
  const today = dayKey(now.getTime());
  const since = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - CUTOFF_LOOKBACK_DAYS
  ).getTime();
  const latestByDay = new Map<string, number>();
  for (const e of entries) {
    const key = dayKey(e.timestamp);
    if (e.timestamp < since || key === today) {
      continue;
    }
    const d = new Date(e.timestamp);
    const minutes = d.getHours() * 60 + d.getMinutes();
    latestByDay.set(key, Math.max(latestByDay.get(key) ?? 0, minutes));
  }
  if (latestByDay.size < CUTOFF_MIN_DAYS) {
    return null;
  }
  return Math.max(...latestByDay.values()) + CUTOFF_GRACE_MINUTES;
}

/** Last moment to nudge on `day`: before sleep, and before the learned cutoff. */
function endOfReminders(day: Date, settings: Settings, entries: DrinkEntry[]): number {
  const sleepEnd = atMinutes(day, settings.sleepMinutes).getTime() - END_BUFFER_MS;
  // Learned as of `day`, so tomorrow's plan counts today's drinks too.
  const learned = learnedCutoffMinutes(entries, day);
  if (learned === null) {
    return sleepEnd;
  }
  const cutoff = Math.max(learned, settings.sleepMinutes - CUTOFF_FLOOR_BEFORE_SLEEP_MINUTES);
  return Math.min(sleepEnd, atMinutes(day, cutoff).getTime());
}

/**
 * Reminders for the rest of today. The core "smart" behavior:
 * - none if the goal is already met (the top complaint about competitors)
 * - count scales with how much is left (remaining / default cup)
 * - evenly spread between now+delay and the end, never closer than MIN_GAP
 * - backs off once reminders go unanswered, stops at the learned cutoff
 * - nothing before `snoozedUntil` (the notification's "Not now" action)
 */
export function computeTodayReminderTimes(
  now: Date,
  settings: Settings,
  entries: DrinkEntry[],
  snoozedUntil = 0
): Date[] {
  if (!settings.remindersEnabled) {
    return [];
  }
  const remainingMl = settings.goalMl - totalForDay(entries, now.getTime());
  if (remainingMl <= 0) {
    return [];
  }
  const start = Math.max(
    now.getTime() + START_DELAY_MS,
    atMinutes(now, settings.wakeMinutes).getTime(),
    snoozedUntil
  );
  const end = endOfReminders(now, settings, entries);
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
export function computeTomorrowReminderTimes(
  now: Date,
  settings: Settings,
  entries: DrinkEntry[]
): Date[] {
  if (!settings.remindersEnabled) {
    return [];
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = atMinutes(tomorrow, settings.wakeMinutes).getTime() + 60 * MINUTE_MS;
  const end = endOfReminders(tomorrow, settings, entries);
  const wanted = Math.ceil(settings.goalMl / settings.defaultCupMl);
  return spread(start, end, wanted);
}
