/**
 * Anonymous usage counts: daily totals with no ID (counts.ts, copied from the
 * ship-ios-app skill's app-counts). Set at build time:
 *
 *   EXPO_PUBLIC_COUNTS_URL  the counts Worker's POST address; unset = nothing is counted or sent
 *
 * Keys (one per fact, never anything about the person): drink, drink.reminder,
 * drink.widget, goal, undo, snooze, onboard, secs.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { AppState, Platform } from 'react-native';
import { lang } from './i18n';
import { createCounts, type Counts } from './counts';

const URL = process.env.EXPO_PUBLIC_COUNTS_URL ?? '';

let counts: Counts | null = null;

/** Safe to call twice (React runs effects twice in development): one counter. */
export function startAnalytics(): () => void {
  if (!URL) return () => {};
  counts ??= createCounts({
    app: 'sip',
    url: URL,
    storage: AsyncStorage,
    version: Application.nativeApplicationVersion ?? '?',
    platform: Platform.OS === 'ios' ? (Platform.isPad ? 'ios-pad' : 'ios-phone') : Platform.OS,
    lang,
    // web: a first visit with nothing stored counts as the install
    installedAt: async () =>
      Platform.OS === 'web' ? Date.now() : ((await Application.getInstallationTimeAsync())?.getTime() ?? null),
  });
  const c = counts;
  c.foreground(true);
  const sub = AppState.addEventListener('change', (s) => c.foreground(s === 'active'));
  return () => sub.remove();
}

export function count(n: Record<string, number>): void {
  try {
    counts?.add(n);
  } catch {
    /* counting must never break the app */
  }
}
