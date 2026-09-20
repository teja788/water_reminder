import { DrinkEntry } from '../types';
import { totalForDay } from './hydration';

/**
 * How fast someone drinks — not how much they drink in a day — is what
 * actually hurts them. Healthy kidneys clear only about 0.8–1.0 L of water an
 * hour; drinking past that dilutes the sodium in the blood (hyponatremia), and
 * symptoms have been reported after 3–4 L inside an hour or two. The
 * Cleveland Clinic draws the practical line at "more than about a litre an
 * hour", which is the threshold used here.
 */
export const PACE_WINDOW_MS = 60 * 60 * 1000;
export const PACE_LIMIT_ML = 1000;

/**
 * Daily volume is a far weaker signal, so this one is a nudge rather than a
 * warning. No health authority publishes an upper limit on water; adequate
 * intake is 2.0–2.5 L (EFSA) or 2.7–3.7 L (US IOM) including water from food,
 * and someone working or racing in heat may legitimately drink well past that.
 * It is therefore set high AND has to clear the user's own goal — otherwise a
 * 6 L goal would be scolded for being met.
 */
export const DAILY_NOTICE_ML = 5000;
export const DAILY_NOTICE_GOAL_MULTIPLE = 1.5;

export type IntakeNotice = 'pace' | 'daily' | null;

/** Which gentle notice, if any, today's log has earned. */
export function intakeNotice(args: {
  entries: DrinkEntry[];
  goalMl: number;
  now: number;
}): IntakeNotice {
  const { entries, goalMl, now } = args;

  let windowMl = 0;
  for (const e of entries) {
    // Entries are not sorted — notification quick-logs are backdated to when
    // the reminder fired — so the whole list has to be scanned. Future
    // timestamps are skipped rather than counted: a clock change forward and
    // back should not manufacture a warning.
    const age = now - e.timestamp;
    if (age >= 0 && age <= PACE_WINDOW_MS) {
      windowMl += e.amountMl;
    }
  }
  if (windowMl > PACE_LIMIT_ML) {
    return 'pace';
  }

  // A corrupt goal drops the goal half of the test rather than disabling the
  // notice outright (goalMl * 1.5 would be NaN, and NaN loses every compare).
  const goalFloor = goalMl > 0 ? goalMl * DAILY_NOTICE_GOAL_MULTIPLE : 0;
  if (totalForDay(entries, now) >= Math.max(DAILY_NOTICE_ML, goalFloor)) {
    return 'daily';
  }

  return null;
}
