import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkEntry, Settings } from './types';
import { EMPTY_REVIEW_STATE, ReviewState } from './logic/review';

const SETTINGS_KEY = 'wr:settings';
const ENTRIES_KEY = 'wr:entries';
const REVIEW_KEY = 'wr:review';

export async function loadSettings(): Promise<Settings | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as Settings) : null;
  } catch {
    return null;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Persistence is best-effort; in-memory state stays authoritative.
  }
}

export async function loadEntries(): Promise<DrinkEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    // A non-array here would crash every render downstream (entries.reduce),
    // permanently, since the bad value persists. Degrade to empty instead.
    return Array.isArray(parsed) ? (parsed as DrinkEntry[]) : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: DrinkEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // Persistence is best-effort; in-memory state stays authoritative.
  }
}

export async function loadReviewState(): Promise<ReviewState> {
  try {
    const raw = await AsyncStorage.getItem(REVIEW_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    const value =
      parsed && typeof parsed === 'object'
        ? (parsed as ReviewState).lastPromptedAt
        : null;
    // A non-finite value here would make every elapsed-time comparison false
    // and permanently suppress the prompt; fall back to "never asked".
    return typeof value === 'number' && Number.isFinite(value)
      ? { lastPromptedAt: value }
      : EMPTY_REVIEW_STATE;
  } catch {
    return EMPTY_REVIEW_STATE;
  }
}

/** Unlike the other writers this reports failure: the caller must not show the
 *  rating prompt it cannot record, or it would ask again the next day. */
export async function saveReviewState(state: ReviewState): Promise<boolean> {
  try {
    await AsyncStorage.setItem(REVIEW_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
