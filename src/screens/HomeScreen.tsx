import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottleGauge from '../components/BottleGauge';
import { QUICK_ADDS_ML, formatMl, totalMl } from '../hydration';
import { colors } from '../theme';
import { DayLog } from '../types';

interface Props {
  goalMl: number;
  log: DayLog;
  onAdd: (ml: number) => void;
  onUndo: () => void;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  return 'Good evening 🌙';
}

function encouragement(fraction: number): string {
  if (fraction <= 0) return "Let's start with a first sip!";
  if (fraction < 0.5) return 'Nice start — keep sipping!';
  if (fraction < 1) return "Over halfway. You're doing great!";
  return 'Goal reached — wonderful! 🎉';
}

export default function HomeScreen({ goalMl, log, onAdd, onUndo }: Props) {
  const current = totalMl(log.entries);
  const fraction = goalMl > 0 ? current / goalMl : 0;
  const remaining = Math.max(0, goalMl - current);
  const lastEntry = log.entries[log.entries.length - 1];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{greeting()}</Text>
      <Text style={styles.encouragement}>{encouragement(fraction)}</Text>

      <BottleGauge currentMl={current} goalMl={goalMl} />

      <Text style={[styles.remaining, fraction >= 1 && styles.remainingDone]}>
        {fraction >= 1 ? 'Daily goal complete 💙' : `${formatMl(remaining)} to go`}
      </Text>

      <View style={styles.addRow}>
        {QUICK_ADDS_ML.map((ml) => (
          <Pressable key={ml} style={styles.addButton} onPress={() => onAdd(ml)}>
            <Text style={styles.addButtonBig}>+{ml}</Text>
            <Text style={styles.addButtonSmall}>ml</Text>
          </Pressable>
        ))}
      </View>

      {lastEntry != null && (
        <Pressable style={styles.undo} onPress={onUndo}>
          <Text style={styles.undoText}>↩︎ Undo last (+{lastEntry}ml)</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  encouragement: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  remaining: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 10,
  },
  remainingDone: {
    color: colors.success,
  },
  addRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    width: 92,
    alignItems: 'center',
  },
  addButtonBig: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  addButtonSmall: {
    color: '#DDF0FF',
    fontSize: 12,
    fontWeight: '600',
  },
  undo: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  undoText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
