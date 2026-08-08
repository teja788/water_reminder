import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkEntry, Settings } from './types';

const SETTINGS_KEY = 'wr:settings';
const ENTRIES_KEY = 'wr:entries';

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
