/**
 * When to ask for an App Store rating.
 *
 * Rating count is one of the strongest App Store search-ranking inputs, and
 * iOS grants only three system prompts per user per year — so the policy is to
 * spend them while the app has visibly just done its job: a drink logged on a
 * day already at goal, once the user has reached the goal on a few days.
 */

export interface ReviewState {
  /** Epoch ms of the last time the system prompt was requested, or null. */
  lastPromptedAt: number | null;
}

export const EMPTY_REVIEW_STATE: ReviewState = { lastPromptedAt: null };

/** Days at goal (any days, not in a row) before asking is fair. It was 3 in a
 *  row, but users met the goal on only ~1 day in 4 (Nov 2026 counts), so that
 *  almost never fired: 1 rating after 3 months. */
export const MIN_GOAL_DAYS = 2;

/** iOS caps the prompt at 3 per 365 days and silently swallows the rest, so
 *  this gap only has to stop us burning all three inside one good week. */
export const MIN_GAP_MS = 120 * 24 * 60 * 60 * 1000;

export function shouldRequestReview(args: {
  /** Today's total including the drink just logged. */
  todayTotalMl: number;
  goalMl: number;
  /** Days in the whole history at or over goal, today included. */
  goalDays: number;
  state: ReviewState;
  now: number;
}): boolean {
  const { todayTotalMl, goalMl, goalDays, state, now } = args;
  // A 0/NaN goal from a corrupt settings blob would make every day "at goal".
  if (!(goalMl > 0) || todayTotalMl < goalMl || goalDays < MIN_GOAL_DAYS) {
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
