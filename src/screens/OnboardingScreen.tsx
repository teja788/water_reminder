import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Theme } from '../theme';
import {
  ActivityLevel,
  DEFAULT_CUP_ML,
  DEFAULT_CUP_SIZES_ML,
  DEFAULT_SLEEP_MINUTES,
  DEFAULT_WAKE_MINUTES,
  Settings,
  Units,
} from '../types';
import { calcGoalMl, formatAmount, mlToOz } from '../logic/hydration';
import { requestNotificationPermission } from '../notifications';

const ML_PER_OZ = 29.5735;
/** Whole hours only — these ranges guarantee sleep > wake by construction. */
const WAKE_HOURS = [5, 6, 7, 8, 9, 10, 11, 12];
const SLEEP_HOURS = [18, 19, 20, 21, 22, 23];
const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 300;
// Commits happen per valid keystroke, so an abandoned intermediate value must
// not be a plausible goal — a 2 ml goal would mark every day as met.
const MIN_GOAL_ML = 500;
const MAX_GOAL_ML = 8000;

const ACTIVITIES: Array<{ id: ActivityLevel; label: string }> = [
  { id: 'sedentary', label: 'Sedentary' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'active', label: 'Active' },
];

function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

/** Number('') is 0, not NaN — every caller also range-checks the result. */
function parseNumber(text: string): number {
  return Number(text.trim().replace(',', '.'));
}

/** The goal field is typed in the selected units; storage is always ml. */
function toMl(value: number, units: Units): number {
  return units === 'oz' ? Math.round(value * ML_PER_OZ) : Math.round(value);
}

function fromMl(ml: number, units: Units): number {
  return units === 'oz' ? Math.round(mlToOz(ml)) : ml;
}

/** Shown instead of silently ignoring a goal the app will not accept. */
function goalRangeHint(units: Units): string {
  const min = fromMl(MIN_GOAL_ML, units).toLocaleString();
  const max = fromMl(MAX_GOAL_ML, units).toLocaleString();
  return `Enter a goal between ${min} and ${max} ${units}`;
}

function Chip(props: {
  theme: Theme;
  label: string;
  selected: boolean;
  accessibilityLabel?: string;
  onPress: () => void;
}): React.JSX.Element {
  const { theme, label, selected, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: pressed
            ? theme.accentSoftPressed
            : selected
              ? theme.accentSoft
              : 'transparent',
          borderColor: selected ? theme.accent : theme.border,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.5}
        style={[
          styles.chipLabel,
          { color: selected ? theme.accent : theme.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function OnboardingScreen(props: {
  theme: Theme;
  onComplete: (settings: Settings) => void;
}): React.JSX.Element {
  const { theme, onComplete } = props;
  const [weightText, setWeightText] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [units, setUnits] = useState<Units>('ml');
  // null = "still following the suggestion"; a string = user-typed override.
  const [goalDraft, setGoalDraft] = useState<string | null>(null);
  const [wakeHour, setWakeHour] = useState(DEFAULT_WAKE_MINUTES / 60);
  const [sleepHour, setSleepHour] = useState(DEFAULT_SLEEP_MINUTES / 60);
  const [submitting, setSubmitting] = useState(false);

  const weightKg = parseNumber(weightText);
  const weightValid =
    Number.isFinite(weightKg) &&
    weightKg >= MIN_WEIGHT_KG &&
    weightKg <= MAX_WEIGHT_KG;
  // NaN while the weight is empty/invalid — validated below like typed input.
  const suggestedMl = weightValid ? calcGoalMl(weightKg, activity) : NaN;
  const goalMl =
    goalDraft === null ? suggestedMl : toMl(parseNumber(goalDraft), units);
  const goalValid =
    Number.isFinite(goalMl) && goalMl >= MIN_GOAL_ML && goalMl <= MAX_GOAL_ML;
  // A typed goal the app will not accept (goalDraft is null when the field
  // is empty, so this only fires on real input).
  const goalOutOfRange = goalDraft !== null && !goalValid;
  // Weight is part of the persisted Settings, so it must be valid too —
  // otherwise a NaN weightKg would round-trip to null in storage.
  const canStart = weightValid && goalValid && !submitting;

  const goalFieldValue =
    goalDraft ?? (weightValid ? String(fromMl(suggestedMl, units)) : '');

  const changeUnits = (next: Units): void => {
    if (next === units) {
      return;
    }
    if (goalDraft !== null) {
      // Keep the typed override at the same real amount across the toggle.
      const ml = toMl(parseNumber(goalDraft), units);
      if (Number.isFinite(ml) && ml > 0) {
        setGoalDraft(String(fromMl(ml, next)));
      }
    }
    setUnits(next);
  };

  const start = async (): Promise<void> => {
    if (!canStart) {
      return;
    }
    setSubmitting(true);
    let granted = false;
    try {
      granted = await requestNotificationPermission();
    } catch {
      // Permission plumbing must never block onboarding — reminders start
      // off and the Settings switch is the recovery path.
    } finally {
      setSubmitting(false);
    }
    onComplete({
      weightKg,
      activity,
      goalMl,
      units,
      wakeMinutes: wakeHour * 60,
      sleepMinutes: sleepHour * 60,
      // Spread: never alias the module constant, or later edits corrupt it.
      cupSizesMl: [...DEFAULT_CUP_SIZES_ML],
      defaultCupMl: DEFAULT_CUP_ML,
      remindersEnabled: granted,
    });
  };

  const goalUnitLabel = units === 'oz' ? 'ounces' : 'millilitres';

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <Text maxFontSizeMultiplier={1.5} style={[styles.title, { color: theme.text }]}>
        Let's set your daily goal
      </Text>
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        A few details and you're ready to drink.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Your weight (kg)
        </Text>
        <TextInput
          value={weightText}
          onChangeText={setWeightText}
          keyboardType="number-pad"
          maxLength={3}
          maxFontSizeMultiplier={1.5}
          placeholder="65"
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel="Your weight in kilograms"
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
        />

        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, styles.labelSpaced, { color: theme.textSecondary }]}
        >
          Activity level
        </Text>
        <View style={styles.chipRow}>
          {ACTIVITIES.map((a) => (
            <Chip
              key={a.id}
              theme={theme}
              label={a.label}
              selected={activity === a.id}
              onPress={() => setActivity(a.id)}
            />
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Suggested daily goal
        </Text>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.suggestion, { color: theme.accent }]}
        >
          {weightValid ? formatAmount(suggestedMl, units) : '—'}
        </Text>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[
            styles.hint,
            { color: goalOutOfRange ? theme.danger : theme.textSecondary },
          ]}
        >
          {goalOutOfRange
            ? goalRangeHint(units)
            : weightValid
              ? 'Change it below if you prefer your own target.'
              : 'Enter your weight to see a suggestion.'}
        </Text>

        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, styles.labelSpaced, { color: theme.textSecondary }]}
        >
          {`Daily goal (${units})`}
        </Text>
        <TextInput
          value={goalFieldValue}
          onChangeText={(t) => setGoalDraft(t.trim() === '' ? null : t)}
          keyboardType="number-pad"
          maxLength={5}
          maxFontSizeMultiplier={1.5}
          placeholder={units === 'oz' ? '85' : '2500'}
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel={`Daily goal in ${goalUnitLabel}`}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Units
        </Text>
        <View style={styles.chipRow}>
          <Chip
            theme={theme}
            label="ml"
            selected={units === 'ml'}
            accessibilityLabel="Show amounts in millilitres"
            onPress={() => changeUnits('ml')}
          />
          <Chip
            theme={theme}
            label="oz"
            selected={units === 'oz'}
            accessibilityLabel="Show amounts in ounces"
            onPress={() => changeUnits('oz')}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          I wake up around
        </Text>
        <View style={styles.chipRow}>
          {WAKE_HOURS.map((h) => (
            <Chip
              key={h}
              theme={theme}
              label={hourLabel(h)}
              selected={wakeHour === h}
              accessibilityLabel={`Wake up at ${hourLabel(h)}`}
              onPress={() => setWakeHour(h)}
            />
          ))}
        </View>

        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, styles.labelSpaced, { color: theme.textSecondary }]}
        >
          I go to sleep around
        </Text>
        <View style={styles.chipRow}>
          {SLEEP_HOURS.map((h) => (
            <Chip
              key={h}
              theme={theme}
              label={hourLabel(h)}
              selected={sleepHour === h}
              accessibilityLabel={`Go to sleep at ${hourLabel(h)}`}
              onPress={() => setSleepHour(h)}
            />
          ))}
        </View>
      </View>

      <Pressable
        onPress={start}
        disabled={!canStart}
        accessibilityRole="button"
        accessibilityLabel="Start"
        accessibilityState={{ disabled: !canStart }}
        style={({ pressed }) => [
          styles.startButton,
          {
            backgroundColor: theme.accent,
            opacity: !canStart ? 0.4 : pressed ? 0.75 : 1,
          },
        ]}
      >
        <Text maxFontSizeMultiplier={1.5} style={styles.startLabel}>
          Start
        </Text>
      </Pressable>
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.footNote, { color: theme.textSecondary }]}
      >
        We'll ask for notification permission so reminders can reach you.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingTop: 72,
    paddingHorizontal: 22,
    paddingBottom: 48,
    gap: 14,
  },
  title: { fontSize: 27, fontWeight: '700', letterSpacing: 0.2 },
  subtitle: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  card: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
  },
  label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  labelSpaced: { marginTop: 18 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    minHeight: 48,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { fontSize: 15, fontWeight: '600' },
  suggestion: { fontSize: 34, fontWeight: '700', marginTop: 6 },
  hint: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  startButton: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startLabel: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  footNote: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
});
