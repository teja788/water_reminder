import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const BENEFITS = [
  { emoji: '⚡', title: 'Steady energy', body: 'Even mild dehydration (1-2%) shows up as tiredness and poor concentration.' },
  { emoji: '🧠', title: 'Sharper mind', body: 'Your brain is about 75% water — hydration supports memory and mood.' },
  { emoji: '✨', title: 'Healthy skin', body: 'Water helps keep skin supple and supports its natural glow.' },
  { emoji: '🍽️', title: 'Smooth digestion', body: 'Fluids keep digestion moving and help prevent constipation.' },
  { emoji: '🫘', title: 'Happy kidneys', body: 'Plenty of water dilutes urine, lowering the risk of kidney stones and UTIs.' },
  { emoji: '💪', title: 'Joints & muscles', body: 'Water cushions joints and helps prevent cramps during activity.' },
  { emoji: '🌡️', title: 'Temperature control', body: 'Sweating only works as a cooling system when you are hydrated.' },
];

const RISKS = [
  { emoji: '🤕', title: 'Headaches & dizziness', body: 'One of the earliest and most common signs of drinking too little.' },
  { emoji: '😴', title: 'Fatigue & low mood', body: 'Dehydration is a sneaky cause of afternoon slumps and irritability.' },
  { emoji: '👄', title: 'Dry skin & lips', body: 'Skin loses elasticity when the body is short on fluids.' },
  { emoji: '🚽', title: 'Constipation', body: 'Too little water is a leading cause of sluggish digestion.' },
  { emoji: '🪨', title: 'Kidney stones', body: 'Chronic low intake makes stones and urinary infections more likely.' },
  { emoji: '🟡', title: 'Dark urine', body: 'A handy self-check: pale straw = hydrated, dark yellow = drink up.' },
];

const TIPS = [
  'Start the day with a glass of water before tea or coffee.',
  'Keep a filled bottle where you can see it — visibility beats willpower.',
  'Take a few sips before every meal and snack.',
  'Add lemon, mint or cucumber if plain water gets boring.',
  'Drink a little extra on hot days and after exercise.',
];

export default function InfoScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Why water helps 💙</Text>
      {BENEFITS.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.body}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.heading}>When you're running low 😟</Text>
      {RISKS.map((item) => (
        <View key={item.title} style={[styles.card, styles.riskCard]}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.body}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.heading}>Easy habits 🌿</Text>
      <View style={styles.tipsCard}>
        {TIPS.map((tip) => (
          <Text key={tip} style={styles.tip}>
            💧 {tip}
          </Text>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        General wellness information, not medical advice. If you have a kidney, heart or other
        condition that affects fluid intake, follow your doctor's guidance.
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
    padding: 20,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
  },
  riskCard: {
    borderColor: '#F2DFC8',
  },
  cardEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 19,
  },
  tipsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  tip: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 20,
    lineHeight: 17,
    textAlign: 'center',
  },
});
