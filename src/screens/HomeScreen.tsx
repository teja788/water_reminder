import { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Theme } from '../theme';
import { Settings } from '../types';
import { HydrationState } from '../state';
import { t } from '../i18n';
import { loadWidgetTipDone, saveWidgetTipDone } from '../storage';
import ProgressBottle from '../components/ProgressBottle';
import LogButtons from '../components/LogButtons';
import IntakeNotice from '../components/IntakeNotice';

function reminderHint(hydration: HydrationState, settings: Settings): string {
  if (settings.remindersEnabled === false) {
    return t.home.remindersOff;
  }
  if (hydration.todayTotalMl >= settings.goalMl) {
    return t.home.doneForToday;
  }
  if (hydration.nextReminder) {
    const time = hydration.nextReminder.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return t.home.nextReminder(time);
  }
  return t.home.noneTonight;
}

export default function HomeScreen(props: {
  theme: Theme;
  hydration: HydrationState;
  settings: Settings;
}): React.JSX.Element {
  const { theme, hydration, settings } = props;
  // The bottle sizes itself to this, so it grows on a big screen and stays
  // clear of the log buttons on a small one.
  const [gaugeHeight, setGaugeHeight] = useState(0);
  const onGaugeLayout = (e: LayoutChangeEvent): void => {
    setGaugeHeight(e.nativeEvent.layout.height);
  };
  // Nobody had used the widget as of Nov 2026, so point it out once, after
  // the second drink (the app has proved useful by then). iOS only: there is
  // no widget anywhere else.
  const [tipDone, setTipDone] = useState(true);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      void loadWidgetTipDone().then(setTipDone);
    }
  }, []);
  const showTip = !tipDone && hydration.entries.length >= 2 && hydration.notice === null;
  const dismissTip = (): void => {
    setTipDone(true);
    saveWidgetTipDone();
  };
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

      <View style={styles.gaugeArea} onLayout={onGaugeLayout}>
        <ProgressBottle
          theme={theme}
          totalMl={hydration.todayTotalMl}
          goalMl={settings.goalMl}
          units={settings.units}
          availableHeight={gaugeHeight}
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

      <IntakeNotice
        theme={theme}
        notice={hydration.notice}
        units={settings.units}
      />

      {showTip && (
        <View
          style={[
            styles.tip,
            { backgroundColor: theme.accentSoft, borderColor: theme.accent },
          ]}
        >
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.tipTitle, { color: theme.accent }]}
          >
            {t.home.widgetTipTitle}
          </Text>
          <Text maxFontSizeMultiplier={1.5} style={[styles.tipBody, { color: theme.text }]}>
            {t.home.widgetTipBody}
          </Text>
          <Pressable
            onPress={dismissTip}
            accessibilityRole="button"
            accessibilityLabel={t.home.widgetTipDismiss}
            style={styles.tipButton}
          >
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.tipButtonLabel, { color: theme.accent }]}
            >
              {t.home.widgetTipDismiss}
            </Text>
          </Pressable>
        </View>
      )}

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
    // Tablets: keep the column readable instead of stretching the log buttons
    // across a 1024pt-wide iPad.
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  gaugeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tip: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginTop: 16,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
  tipBody: { fontSize: 13, fontWeight: '500', lineHeight: 19, marginTop: 6 },
  tipButton: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-end' },
  tipButtonLabel: { fontSize: 14, fontWeight: '700' },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
});
