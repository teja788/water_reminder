import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { dailyGoalMl, todayKey } from './src/hydration';
import { rescheduleReminders, setupNotifications } from './src/notifications';
import {
  DEFAULT_SETTINGS,
  loadProfile,
  loadSettings,
  loadTodayLog,
  saveDayLog,
  saveProfile,
  saveSettings,
} from './src/storage';
import HomeScreen from './src/screens/HomeScreen';
import InfoScreen from './src/screens/InfoScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme';
import { DayLog, Profile, Settings } from './src/types';

type Tab = 'home' | 'learn' | 'settings';

const TABS: { key: Tab; emoji: string; label: string }[] = [
  { key: 'home', emoji: '💧', label: 'Today' },
  { key: 'learn', emoji: '📖', label: 'Learn' },
  { key: 'settings', emoji: '⚙️', label: 'Settings' },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [log, setLog] = useState<DayLog>({ date: todayKey(), entries: [] });
  const [tab, setTab] = useState<Tab>('home');

  useEffect(() => {
    (async () => {
      const [storedProfile, storedSettings, storedLog] = await Promise.all([
        loadProfile(),
        loadSettings(),
        loadTodayLog(),
      ]);
      setProfile(storedProfile);
      setSettings(storedSettings);
      setLog(storedLog);
      setReady(true);
      if (storedProfile) {
        // Re-rolls reminder times and messages so they stay fresh each day.
        rescheduleReminders(storedSettings);
      }
    })();
  }, []);

  // When the app comes back to the foreground on a new day, start a fresh bottle.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        loadTodayLog().then(setLog);
      }
    });
    return () => sub.remove();
  }, []);

  const addWater = (ml: number) => {
    setLog((prev) => {
      const base = prev.date === todayKey() ? prev : { date: todayKey(), entries: [] };
      const next = { ...base, entries: [...base.entries, ml] };
      saveDayLog(next);
      return next;
    });
  };

  const undo = () => {
    setLog((prev) => {
      if (prev.entries.length === 0) return prev;
      const next = { ...prev, entries: prev.entries.slice(0, -1) };
      saveDayLog(next);
      return next;
    });
  };

  const handleProfileChange = (next: Profile) => {
    setProfile(next);
    saveProfile(next);
  };

  const handleSettingsChange = (next: Settings) => {
    setSettings(next);
    saveSettings(next);
    rescheduleReminders(next);
  };

  const completeOnboarding = async (newProfile: Profile) => {
    setProfile(newProfile);
    await saveProfile(newProfile);
    await setupNotifications();
    await rescheduleReminders(settings);
  };

  if (!ready) {
    return (
      <View style={[styles.app, styles.loading]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        <OnboardingScreen onDone={completeOnboarding} />
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.body}>
        {tab === 'home' && (
          <HomeScreen goalMl={dailyGoalMl(profile)} log={log} onAdd={addWater} onUndo={undo} />
        )}
        {tab === 'learn' && <InfoScreen />}
        {tab === 'settings' && (
          <SettingsScreen
            profile={profile}
            settings={settings}
            onProfileChange={handleProfileChange}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
              <Text style={[styles.tabEmoji, !active && styles.tabInactive]}>{t.emoji}</Text>
              <Text style={[styles.tabLabel, active ? styles.tabLabelActive : styles.tabInactive]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 56,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabInactive: {
    opacity: 0.45,
    color: colors.textMuted,
  },
});
