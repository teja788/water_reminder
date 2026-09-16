import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { Theme } from '../theme';
import { ActivityLevel, Settings } from '../types';
import { HydrationState } from '../state';
import { calcGoalMl, formatAmount } from '../logic/hydration';
import { requestNotificationPermission } from '../notifications';

/** Whole hours only — these ranges guarantee sleep > wake by construction. */
const WAKE_HOURS = [5, 6, 7, 8, 9, 10, 11, 12];
const SLEEP_HOURS = [18, 19, 20, 21, 22, 23];
const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 300;
// Commits happen per valid keystroke, so an abandoned intermediate value must
// not be a plausible amount — a 2 ml goal would mark every day as met.
const MIN_GOAL_ML = 500;
const MAX_GOAL_ML = 8000;
const MIN_CUP_ML = 50;
const MAX_CUP_ML = 5000;
const APP_VERSION = '1.0.0';

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

function Section(props: {
  theme: Theme;
  title: string;
  children: ReactNode;
}): React.JSX.Element {
  const { theme, title, children } = props;
  return (
    <View style={styles.section}>
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        {title}
      </Text>
      <View
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen(props: {
  theme: Theme;
  hydration: HydrationState;
  settings: Settings;
}): React.JSX.Element {
  const { theme, hydration, settings } = props;
  // Drafts seed from the persisted settings ONCE. Re-syncing them on every
  // prop change would fight the user's keystrokes on each committed render.
  const [weightDraft, setWeightDraft] = useState(() => String(settings.weightKg));
  const [goalDraft, setGoalDraft] = useState(() => String(settings.goalMl));
  const [cupDrafts, setCupDrafts] = useState<string[]>(() =>
    settings.cupSizesMl.map((ml) => String(ml))
  );
  const [permissionDenied, setPermissionDenied] = useState(false);
  // If the user follows the hint to iOS Settings and grants permission there,
  // clear the hint when they come back — it would otherwise claim a problem
  // that no longer exists. Ref-gated so the listener only does work while the
  // hint is actually showing.
  const permissionDeniedRef = useRef(permissionDenied);
  permissionDeniedRef.current = permissionDenied;
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !permissionDeniedRef.current) {
        return;
      }
      void (async () => {
        try {
          const perm = await Notifications.getPermissionsAsync();
          if (perm.granted) {
            setPermissionDenied(false);
          }
        } catch {
          // Best-effort; keep the hint if the check itself fails.
        }
      })();
    });
    return () => sub.remove();
  }, []);

  // Screens unmount on tab switch, so commit on every VALID change rather
  // than on blur — blur never fires on unmount and the edit would be lost.
  //
  // Text-field commits are additionally DEBOUNCED (400 ms): every committed
  // settings change rebuilds the notification schedule (~100 native calls in
  // a keystroke burst otherwise). All refs so the flush-on-unmount effect can
  // stay mounted once and never fire early on re-renders.
  const pendingRef = useRef<Partial<Settings> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const updateSettingsRef = useRef(hydration.updateSettings);
  updateSettingsRef.current = hydration.updateSettings;

  const flushPending = (): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const patch = pendingRef.current;
    if (patch) {
      pendingRef.current = null;
      updateSettingsRef.current({ ...settingsRef.current, ...patch });
    }
  };
  const flushRef = useRef(flushPending);
  flushRef.current = flushPending;

  // Flush on unmount so a just-typed edit survives a tab switch.
  useEffect(() => () => flushRef.current(), []);

  /** Immediate commit (chips, switches). Folds in any pending typed patch so
   *  a chip tap 200 ms after a keystroke can't discard the typed value. */
  const commit = (patch: Partial<Settings>): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const merged = { ...pendingRef.current, ...patch };
    pendingRef.current = null;
    hydration.updateSettings({ ...settings, ...merged });
  };

  /** Debounced commit for text fields. */
  const commitDebounced = (patch: Partial<Settings>): void => {
    pendingRef.current = { ...pendingRef.current, ...patch };
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => flushRef.current(), 400);
  };

  /** Settings as they will be once any pending debounce lands — the base for
   *  edits that derive from current values (cup sizes / default cup). */
  const effectiveSettings = (): Settings => ({
    ...settings,
    ...pendingRef.current,
  });

  const draftWeight = parseNumber(weightDraft);
  const draftWeightValid =
    Number.isFinite(draftWeight) &&
    draftWeight >= MIN_WEIGHT_KG &&
    draftWeight <= MAX_WEIGHT_KG;
  // A typed goal the app will not accept — explained rather than ignored.
  const draftGoal = parseNumber(goalDraft);
  const goalOutOfRange =
    goalDraft.trim() !== '' &&
    !(
      Number.isFinite(draftGoal) &&
      draftGoal >= MIN_GOAL_ML &&
      draftGoal <= MAX_GOAL_ML
    );
  const suggestedMl = calcGoalMl(
    draftWeightValid ? draftWeight : settings.weightKg,
    settings.activity
  );

  const onWeightChange = (text: string): void => {
    setWeightDraft(text);
    const value = parseNumber(text);
    if (
      !Number.isFinite(value) ||
      value < MIN_WEIGHT_KG ||
      value > MAX_WEIGHT_KG
    ) {
      return;
    }
    commitDebounced({ weightKg: value });
  };

  const onGoalChange = (text: string): void => {
    setGoalDraft(text);
    const value = parseNumber(text);
    if (!Number.isFinite(value) || value < MIN_GOAL_ML || value > MAX_GOAL_ML) {
      return;
    }
    commitDebounced({ goalMl: Math.round(value) });
  };

  const useSuggested = (): void => {
    setGoalDraft(String(suggestedMl));
    commit({ goalMl: suggestedMl });
  };

  const onCupChange = (index: number, text: string): void => {
    setCupDrafts((prev) => prev.map((d, i) => (i === index ? text : d)));
    const value = parseNumber(text);
    if (!Number.isFinite(value) || value < MIN_CUP_ML || value > MAX_CUP_ML) {
      return;
    }
    const ml = Math.round(value);
    // Base on effective (pending-inclusive) settings: editing cup 1 then cup 2
    // inside one debounce window must not lose cup 1's edit.
    const base = effectiveSettings();
    const previous = base.cupSizesMl[index];
    const cupSizesMl = base.cupSizesMl.map((s, i) => (i === index ? ml : s));
    // The default cup follows its own size edit, or it would point at an
    // amount that is no longer on any button.
    const defaultCupMl =
      previous === base.defaultCupMl ? ml : base.defaultCupMl;
    commitDebounced({ cupSizesMl, defaultCupMl });
  };

  const onToggleReminders = async (value: boolean): Promise<void> => {
    if (!value) {
      setPermissionDenied(false);
      commit({ remindersEnabled: false });
      return;
    }
    let granted = false;
    try {
      granted = await requestNotificationPermission();
    } catch {
      // Treat a native failure exactly like a denial: the inline hint below
      // points the user at iOS Settings, which is the only real recovery.
    }
    setPermissionDenied(!granted);
    commit({ remindersEnabled: granted });
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <Text maxFontSizeMultiplier={1.5} style={[styles.title, { color: theme.text }]}>
        Settings
      </Text>

      <Section theme={theme} title="DAILY GOAL">
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Your weight (kg)
        </Text>
        <TextInput
          value={weightDraft}
          onChangeText={onWeightChange}
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
              selected={settings.activity === a.id}
              onPress={() => commit({ activity: a.id })}
            />
          ))}
        </View>

        <View style={styles.suggestionRow}>
          <View style={styles.suggestionText}>
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.label, { color: theme.textSecondary }]}
            >
              Suggested
            </Text>
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.suggestion, { color: theme.accent }]}
            >
              {formatAmount(suggestedMl, settings.units)}
            </Text>
          </View>
          <Pressable
            onPress={useSuggested}
            accessibilityRole="button"
            accessibilityLabel="Use suggested goal"
            style={({ pressed }) => [
              styles.softButton,
              {
                backgroundColor: pressed
                  ? theme.accentSoftPressed
                  : theme.accentSoft,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.5}
              style={[styles.softButtonLabel, { color: theme.accent }]}
            >
              Use suggested
            </Text>
          </Pressable>
        </View>

        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, styles.labelSpaced, { color: theme.textSecondary }]}
        >
          Daily goal (ml)
        </Text>
        <TextInput
          value={goalDraft}
          onChangeText={onGoalChange}
          keyboardType="number-pad"
          maxLength={5}
          maxFontSizeMultiplier={1.5}
          placeholder="2500"
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel="Daily goal in millilitres"
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
        />
        {goalOutOfRange && (
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.note, { color: theme.danger }]}
          >
            {`Enter a goal between ${MIN_GOAL_ML.toLocaleString()} and ${MAX_GOAL_ML.toLocaleString()} ml`}
          </Text>
        )}
      </Section>

      <Section theme={theme} title="UNITS">
        <View style={styles.chipRowTight}>
          <Chip
            theme={theme}
            label="ml"
            selected={settings.units === 'ml'}
            accessibilityLabel="Show amounts in millilitres"
            onPress={() => commit({ units: 'ml' })}
          />
          <Chip
            theme={theme}
            label="oz"
            selected={settings.units === 'oz'}
            accessibilityLabel="Show amounts in ounces"
            onPress={() => commit({ units: 'oz' })}
          />
        </View>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.note, { color: theme.textSecondary }]}
        >
          Changes how amounts are shown. Everything is stored in ml.
        </Text>
      </Section>

      <Section theme={theme} title="SCHEDULE">
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
              selected={settings.wakeMinutes === h * 60}
              accessibilityLabel={`Wake up at ${hourLabel(h)}`}
              onPress={() => commit({ wakeMinutes: h * 60 })}
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
              selected={settings.sleepMinutes === h * 60}
              accessibilityLabel={`Go to sleep at ${hourLabel(h)}`}
              onPress={() => commit({ sleepMinutes: h * 60 })}
            />
          ))}
        </View>
      </Section>

      <Section theme={theme} title="CUPS">
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Preset sizes (ml)
        </Text>
        <View style={styles.cupRow}>
          {cupDrafts.map((draft, index) => (
            <TextInput
              key={index}
              value={draft}
              onChangeText={(text) => onCupChange(index, text)}
              keyboardType="number-pad"
              maxLength={4}
              maxFontSizeMultiplier={1.5}
              placeholder="250"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel={`Cup ${index + 1} size in millilitres`}
              style={[
                styles.input,
                styles.cupInput,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            />
          ))}
        </View>

        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.label, styles.labelSpaced, { color: theme.textSecondary }]}
        >
          Default cup
        </Text>
        <View style={styles.chipRow}>
          {settings.cupSizesMl.map((size, index) => (
            <Chip
              key={`${size}-${index}`}
              theme={theme}
              label={formatAmount(size, settings.units)}
              selected={settings.defaultCupMl === size}
              accessibilityLabel={`Default cup ${formatAmount(size, settings.units)}`}
              onPress={() => commit({ defaultCupMl: size })}
            />
          ))}
        </View>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.note, { color: theme.textSecondary }]}
        >
          Logged when you tap the quick-log button on a reminder.
        </Text>
      </Section>

      <Section theme={theme} title="REMINDERS">
        <View style={styles.switchRow}>
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.switchLabel, { color: theme.text }]}
          >
            Reminders
          </Text>
          <Switch
            value={settings.remindersEnabled}
            onValueChange={onToggleReminders}
            accessibilityLabel="Reminders"
            trackColor={{ false: theme.border, true: theme.accent }}
          />
        </View>
        {permissionDenied && (
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.note, { color: theme.danger }]}
          >
            Enable notifications in iOS Settings
          </Text>
        )}
      </Section>

      <Section theme={theme} title="ABOUT">
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.aboutLine, { color: theme.text }]}
        >
          {`Version ${APP_VERSION}`}
        </Text>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.note, { color: theme.textSecondary }]}
        >
          Your data never leaves this device.
        </Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingTop: 64,
    paddingHorizontal: 22,
    paddingBottom: 40,
    // Tablets: keep the column readable instead of stretching it across a
    // 1024pt-wide iPad.
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  title: { fontSize: 27, fontWeight: '700', letterSpacing: 0.2, marginBottom: 18 },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
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
  chipRowTight: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 18,
  },
  suggestionText: { flexShrink: 1 },
  suggestion: { fontSize: 24, fontWeight: '700', marginTop: 2 },
  softButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  softButtonLabel: { fontSize: 14, fontWeight: '700' },
  cupRow: { flexDirection: 'row', gap: 10 },
  cupInput: { flex: 1, fontSize: 18 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchLabel: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  note: { fontSize: 12, fontWeight: '500', marginTop: 10, lineHeight: 17 },
  aboutLine: { fontSize: 15, fontWeight: '600' },
});
