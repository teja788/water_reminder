import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme';
import { Settings } from '../types';
import { HydrationState } from '../state';
import ProgressGlass from '../components/ProgressGlass';
import LogButtons from '../components/LogButtons';

function reminderHint(hydration: HydrationState, settings: Settings): string {
  if (settings.remindersEnabled === false) {
    return 'Reminders are off';
  }
  if (hydration.todayTotalMl >= settings.goalMl) {
    return 'Done for today — no more reminders';
  }
  if (hydration.nextReminder) {
    const time = hydration.nextReminder.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `Next reminder around ${time}`;
  }
  return 'No more reminders tonight — back tomorrow';
}

export default function HomeScreen(props: {
  theme: Theme;
  hydration: HydrationState;
  settings: Settings;
}): React.JSX.Element {
  const { theme, hydration, settings } = props;
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.date, { color: theme.textSecondary }]}
      >
        {dateLabel}
      </Text>

      <View style={styles.glassArea}>
        <ProgressGlass
          theme={theme}
          totalMl={hydration.todayTotalMl}
          goalMl={settings.goalMl}
          units={settings.units}
        />
      </View>

      <LogButtons
        theme={theme}
        cupSizesMl={settings.cupSizesMl}
        units={settings.units}
        canUndo={hydration.todayTotalMl > 0}
        onLog={hydration.logDrink}
        onUndo={hydration.undoLast}
      />

      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.hint, { color: theme.textSecondary }]}
      >
        {reminderHint(hydration, settings)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  glassArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
});
