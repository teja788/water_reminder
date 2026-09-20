import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme';
import { Units } from '../types';
import { formatAmount } from '../logic/hydration';
import {
  DAILY_NOTICE_ML,
  IntakeNotice as Notice,
  PACE_LIMIT_ML,
} from '../logic/intake';

const LEARN_MORE_URL =
  'https://teja788.github.io/water_reminder/hydration.html';

/** Adequate-intake range quoted in the daily notice: EFSA's 2.0–2.5 L and the
 *  US IOM's 2.7–3.7 L, total water including food. */
const GUIDANCE_LOW_ML = 2000;
const GUIDANCE_HIGH_ML = 3700;

interface Copy {
  title: string;
  body: string;
  /** Second line, only where the medicine warrants one. */
  tail?: string;
}

function copyFor(notice: 'pace' | 'daily', units: Units): Copy {
  if (notice === 'pace') {
    return {
      title: 'Ease off a little',
      body: `That's over ${formatAmount(PACE_LIMIT_ML, units)} in the past hour. Kidneys clear only about that much an hour, and drinking faster thins the sodium in your blood. Sipping steadily is kinder than gulping.`,
      tail: 'Feeling headachy, queasy or foggy? Talk to a doctor.',
    };
  }
  return {
    title: "That's a big day",
    body: `Over ${formatAmount(DAILY_NOTICE_ML, units)} logged today. Most guidance lands between ${formatAmount(GUIDANCE_LOW_ML, units)} and ${formatAmount(GUIDANCE_HIGH_ML, units)} a day, food included — more is fine if you have been sweating hard. From here, let thirst lead.`,
  };
}

export default function IntakeNotice(props: {
  theme: Theme;
  notice: Notice;
  units: Units;
}): React.JSX.Element | null {
  const { theme, notice, units } = props;
  if (notice === null) {
    return null;
  }
  const copy = copyFor(notice, units);
  return (
    <View
      // One label for the whole card so VoiceOver reads it as a single thought
      // instead of three disconnected fragments.
      accessible
      accessibilityLabel={[copy.title, copy.body, copy.tail].filter(Boolean).join('. ')}
      style={[
        styles.card,
        { backgroundColor: theme.cautionSoft, borderColor: theme.caution },
      ]}
    >
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.title, { color: theme.caution }]}
      >
        {copy.title}
      </Text>
      <Text maxFontSizeMultiplier={1.5} style={[styles.body, { color: theme.text }]}>
        {copy.body}
      </Text>
      {copy.tail !== undefined && (
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.body, styles.tail, { color: theme.text }]}
        >
          {copy.tail}
        </Text>
      )}
      <Pressable
        onPress={() => {
          // Nothing to recover if the browser won't open — no error UI for it.
          void Linking.openURL(LEARN_MORE_URL).catch(() => {});
        }}
        accessibilityRole="link"
        accessibilityLabel="Why this matters — opens a web page"
        style={styles.linkHit}
      >
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.link, { color: theme.caution }]}
        >
          Why this matters
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  title: { fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
  body: { fontSize: 13, fontWeight: '500', lineHeight: 19, marginTop: 6 },
  tail: { marginTop: 8 },
  // 44pt tall so the link clears the minimum touch target the rest of the app
  // holds to, without a button's worth of visual weight.
  linkHit: { minHeight: 44, justifyContent: 'flex-end', paddingBottom: 2 },
  link: { fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
});
