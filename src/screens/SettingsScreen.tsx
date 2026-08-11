import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import ProfileForm from '../components/ProfileForm';
import { dailyGoalMl, formatMl } from '../hydration';
import { remindersPerDay, sendTestNotification, setupNotifications } from '../notifications';
import { colors } from '../theme';
import { Profile, Settings } from '../types';

const MODE_OPTIONS = [
  { label: 'Every 1h', mode: 'interval' as const, intervalMinutes: 60 },
  { label: '1.5h', mode: 'interval' as const, intervalMinutes: 90 },
  { label: '2h', mode: 'interval' as const, intervalMinutes: 120 },
  { label: '3h', mode: 'interval' as const, intervalMinutes: 180 },
  { label: 'Surprise me 🎲', mode: 'random' as const, intervalMinutes: 120 },
];

interface Props {
  profile: Profile;
  settings: Settings;
  onProfileChange: (profile: Profile) => void;
  onSettingsChange: (settings: Settings) => void;
}

function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          style={[styles.stepperButton, value <= min && styles.stepperButtonDisabled]}
          disabled={value <= min}
          onPress={() => onChange(value - 1)}
        >
          <Text style={styles.stepperButtonText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{hourLabel(value)}</Text>
        <Pressable
          style={[styles.stepperButton, value >= max && styles.stepperButtonDisabled]}
          disabled={value >= max}
          onPress={() => onChange(value + 1)}
        >
          <Text style={styles.stepperButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SettingsScreen({ profile, settings, onProfileChange, onSettingsChange }: Props) {
  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await setupNotifications();
      if (!granted) {
        Alert.alert(
          'Notifications blocked',
          'Please allow notifications for Water Reminder in your phone settings, then try again.'
        );
        return;
      }
    }
    onSettingsChange({ ...settings, remindersEnabled: enabled });
  };

  const handleTest = async () => {
    const granted = await setupNotifications();
    if (!granted) {
      Alert.alert(
        'Notifications blocked',
        'Please allow notifications for Water Reminder in your phone settings, then try again.'
      );
      return;
    }
    await sendTestNotification();
    Alert.alert('Test sent', 'A sample reminder will pop up in a few seconds.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Reminders</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Gentle reminders</Text>
          <Switch
            value={settings.remindersEnabled}
            onValueChange={handleToggle}
            trackColor={{ true: colors.waterLight, false: colors.border }}
            thumbColor={settings.remindersEnabled ? colors.primary : '#FFFFFF'}
          />
        </View>

        {settings.remindersEnabled && (
          <>
            <Text style={styles.sectionLabel}>How often?</Text>
            <View style={styles.chipWrap}>
              {MODE_OPTIONS.map((opt) => {
                const active =
                  settings.mode === opt.mode &&
                  (opt.mode === 'random' || settings.intervalMinutes === opt.intervalMinutes);
                return (
                  <Pressable
                    key={opt.label}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() =>
                      onSettingsChange({ ...settings, mode: opt.mode, intervalMinutes: opt.intervalMinutes })
                    }
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Quiet outside these hours</Text>
            <Stepper
              label="First reminder after"
              value={settings.activeStartHour}
              min={5}
              max={12}
              onChange={(v) => onSettingsChange({ ...settings, activeStartHour: v })}
            />
            <Stepper
              label="No reminders after"
              value={settings.activeEndHour}
              min={16}
              max={23}
              onChange={(v) => onSettingsChange({ ...settings, activeEndHour: v })}
            />

            <Text style={styles.note}>
              About {remindersPerDay(settings)} reminders a day. Times shuffle slightly every time the
              app opens, so it never feels robotic. Nights and early mornings stay silent.
            </Text>

            <Pressable style={styles.testButton} onPress={handleTest}>
              <Text style={styles.testButtonText}>Send a test reminder</Text>
            </Pressable>
          </>
        )}
      </View>

      <Text style={styles.heading}>Your goal</Text>
      <View style={styles.card}>
        <View style={styles.goalRow}>
          <Text style={styles.goalLabel}>Daily goal</Text>
          <Text style={styles.goalValue}>{formatMl(dailyGoalMl(profile))}</Text>
        </View>
        <ProfileForm
          value={profile}
          onChange={(draft) => {
            if (draft.age != null && draft.gender != null && draft.exercise != null) {
              onProfileChange({ age: draft.age, gender: draft.gender, exercise: draft.exercise });
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 18,
    marginBottom: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: '#DDF0FF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primary,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepperLabel: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DDF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.35,
  },
  stepperButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 24,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    width: 56,
    textAlign: 'center',
  },
  note: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 14,
  },
  testButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  testButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  goalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
});
