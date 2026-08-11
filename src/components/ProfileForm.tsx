import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EXERCISE_OPTIONS } from '../hydration';
import { colors } from '../theme';
import { ExerciseLevel, Gender } from '../types';

/** Profile while it is being filled in — fields stay null until valid. */
export interface ProfileDraft {
  age: number | null;
  gender: Gender | null;
  exercise: ExerciseLevel | null;
}

interface Props {
  value: ProfileDraft;
  onChange: (draft: ProfileDraft) => void;
}

export default function ProfileForm({ value, onChange }: Props) {
  const [ageText, setAgeText] = useState(value.age != null ? String(value.age) : '');

  const handleAge = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '');
    setAgeText(digits);
    const n = parseInt(digits, 10);
    onChange({ ...value, age: Number.isFinite(n) && n >= 10 && n <= 100 ? n : null });
  };

  return (
    <View>
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={ageText}
        onChangeText={handleAge}
        keyboardType="number-pad"
        maxLength={3}
        placeholder="e.g. 32"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {(['female', 'male'] as Gender[]).map((g) => (
          <Pressable
            key={g}
            style={[styles.chip, value.gender === g && styles.chipActive]}
            onPress={() => onChange({ ...value, gender: g })}
          >
            <Text style={[styles.chipText, value.gender === g && styles.chipTextActive]}>
              {g === 'female' ? 'Female' : 'Male'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>How active are you?</Text>
      {EXERCISE_OPTIONS.map((opt) => {
        const active = value.exercise === opt.value;
        return (
          <Pressable
            key={opt.value}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange({ ...value, exercise: opt.value as ExerciseLevel })}
          >
            <Text style={[styles.optionLabel, active && styles.chipTextActive]}>{opt.label}</Text>
            <Text style={styles.optionHint}>{opt.hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: '#DDF0FF',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primary,
  },
  option: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: '#DDF0FF',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  optionHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
