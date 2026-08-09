import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { darkTheme, lightTheme } from './src/theme';
import { useHydration } from './src/state';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Tab = 'home' | 'history' | 'settings';

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'home', label: 'Today', icon: '💧' },
  { id: 'history', label: 'History', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const hydration = useHydration();
  const [tab, setTab] = useState<Tab>('home');

  if (!hydration.ready) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  if (!hydration.settings) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <OnboardingScreen theme={theme} onComplete={hydration.updateSettings} />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        {tab === 'home' && (
          <HomeScreen theme={theme} hydration={hydration} settings={hydration.settings} />
        )}
        {tab === 'history' && (
          <HistoryScreen theme={theme} hydration={hydration} settings={hydration.settings} />
        )}
        {tab === 'settings' && (
          <SettingsScreen theme={theme} hydration={hydration} settings={hydration.settings} />
        )}
      </View>
      <View style={[styles.tabBar, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            style={styles.tabButton}
            onPress={() => setTab(t.id)}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: tab === t.id }}
          >
            <Text style={styles.tabIcon} maxFontSizeMultiplier={1.5}>
              {t.icon}
            </Text>
            <Text
              maxFontSizeMultiplier={1.5}
              style={[
                styles.tabLabel,
                { color: tab === t.id ? theme.accent : theme.textSecondary },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 28,
    paddingTop: 10,
  },
  tabButton: { flex: 1, alignItems: 'center', gap: 2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 12, fontWeight: '600' },
});
