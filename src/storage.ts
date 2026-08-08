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
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadEntries(): Promise<DrinkEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as DrinkEntry[]) : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: DrinkEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}
