import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProfileForm, { ProfileDraft } from '../components/ProfileForm';
import { dailyGoalMl, formatMl } from '../hydration';
import { colors } from '../theme';
import { Profile } from '../types';

interface Props {
  onDone: (profile: Profile) => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const [draft, setDraft] = useState<ProfileDraft>({ age: null, gender: null, exercise: null });

  const complete =
    draft.age != null && draft.gender != null && draft.exercise != null
      ? ({ age: draft.age, gender: draft.gender, exercise: draft.exercise } as Profile)
      : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.emoji}>💧</Text>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Three quick questions and we'll set a daily water goal that fits you.
      </Text>

      <ProfileForm value={draft} onChange={setDraft} />

      {complete && (
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Your daily goal</Text>
          <Text style={styles.goalValue}>{formatMl(dailyGoalMl(complete))}</Text>
          <Text style={styles.goalHint}>
            Based on your age, gender and activity level. You can adjust these anytime in Settings.
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.button, !complete && styles.buttonDisabled]}
        disabled={!complete}
        onPress={() => complete && onDone(complete)}
      >
        <Text style={styles.buttonText}>Start tracking 💙</Text>
      </Pressable>

      <Text style={styles.permissionNote}>
        We'll ask permission to send gentle reminders — never at night or early morning.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 22,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: 18,
    marginTop: 20,
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  goalValue: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 4,
  },
  goalHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  permissionNote: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
});
