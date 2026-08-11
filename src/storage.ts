import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayKey } from './hydration';
import { DayLog, Profile, Settings } from './types';

const KEYS = {
  profile: 'profile',
  settings: 'settings',
  dayLog: 'dayLog',
} as const;

export const DEFAULT_SETTINGS: Settings = {
  remindersEnabled: true,
  mode: 'interval',
  intervalMinutes: 120,
  activeStartHour: 9,
  activeEndHour: 21,
};

async function loadJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function loadProfile(): Promise<Profile | null> {
  return loadJson<Profile>(KEYS.profile);
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function loadSettings(): Promise<Settings> {
  const stored = await loadJson<Partial<Settings>>(KEYS.settings);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

/** Returns today's log, starting fresh if the stored one is from a previous day. */
export async function loadTodayLog(): Promise<DayLog> {
  const stored = await loadJson<DayLog>(KEYS.dayLog);
  if (stored && stored.date === todayKey()) {
    return stored;
  }
  return { date: todayKey(), entries: [] };
}

export async function saveDayLog(log: DayLog): Promise<void> {
  await AsyncStorage.setItem(KEYS.dayLog, JSON.stringify(log));
}
