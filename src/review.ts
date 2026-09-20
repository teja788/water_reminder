import { AppState } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { loadReviewState, saveReviewState } from './storage';
import { shouldRequestReview } from './logic/review';

/** Let the goal-reached UI land before the system sheet covers it. */
const PROMPT_DELAY_MS = 1800;

/**
 * Show the App Store rating prompt if this drink earned it. Safe to call on
 * every logged drink — the policy in ./logic/review decides.
 */
export async function maybeRequestReview(args: {
  prevTotalMl: number;
  newTotalMl: number;
  goalMl: number;
  streak: number;
}): Promise<void> {
  try {
    const state = await loadReviewState();
    if (!shouldRequestReview({ ...args, state, now: Date.now() })) {
      return;
    }
    // False on TestFlight and on web, where requestReview is a no-op we would
    // still have recorded as a spent ask.
    if (!(await StoreReview.isAvailableAsync())) {
      return;
    }
    // A quick-log tapped on a notification can cross the goal with the app in
    // the background, where StoreKit drops the sheet and the ask is wasted.
    if (AppState.currentState !== 'active') {
      return;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, PROMPT_DELAY_MS));
    if (AppState.currentState !== 'active') {
      return;
    }
    // Record BEFORE asking: iOS never reports whether the sheet appeared, so a
    // write ordered after it could be lost to a kill and we would ask again
    // tomorrow. One skipped ask beats a nagging loop.
    if (!(await saveReviewState({ lastPromptedAt: Date.now() }))) {
      return;
    }
    await StoreReview.requestReview();
  } catch {
    // Asking for a rating must never interfere with logging water.
  }
}
