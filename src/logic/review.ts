/**
 * When to ask for an App Store rating.
 *
 * Rating count is one of the strongest App Store search-ranking inputs, and
 * iOS grants only three system prompts per user per year — so the policy is to
 * spend them at the one moment the app has visibly just done its job: the
 * drink that completes the daily goal, on a day that extends a streak.
 */

export interface ReviewState {
  /** Epoch ms of the last time the system prompt was requested, or null. */
  lastPromptedAt: number | null;
}

export const EMPTY_REVIEW_STATE: ReviewState = { lastPromptedAt: null };

/** Days in a row at goal before asking is fair. Below this the user has not
 *  had enough out of the app to hold an opinion worth collecting. */
export const MIN_STREAK = 3;

/** iOS caps the prompt at 3 per 365 days and silently swallows the rest, so
 *  this gap only has to stop us burning all three inside one good week. */
export const MIN_GAP_MS = 120 * 24 * 60 * 60 * 1000;

export function shouldRequestReview(args: {
  /** Today's total BEFORE the drink being logged. */
  prevTotalMl: number;
  /** Today's total AFTER it. */
  newTotalMl: number;
  goalMl: number;
  /** Streak including today, computed after the drink. */
  streak: number;
  state: ReviewState;
  now: number;
}): boolean {
  const { prevTotalMl, newTotalMl, goalMl, streak, state, now } = args;
  // A 0/NaN goal from a corrupt settings blob would make every log a
  // "crossing" — the same guard currentStreak needs, for the same reason.
  if (!(goalMl > 0)) {
    return false;
  }
  // Only the drink that crosses the goal: never on a missed day, and never
  // again on a day the user keeps logging past it.
  if (!(prevTotalMl < goalMl && newTotalMl >= goalMl)) {
    return false;
  }
  if (streak < MIN_STREAK) {
    return false;
  }
  if (state.lastPromptedAt === null) {
    return true;
  }
  const elapsed = now - state.lastPromptedAt;
  // A backwards clock change (travel, manual set) would otherwise park
  // lastPromptedAt in the future and mute the prompt for good.
  return elapsed < 0 || elapsed >= MIN_GAP_MS;
}
