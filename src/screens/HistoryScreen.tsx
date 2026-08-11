import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme';
import { Settings } from '../types';
import { HydrationState } from '../state';
import { DayTotal, dailyTotals, formatAmount } from '../logic/hydration';

/** Fixed drawing area for the 7-day chart, in points. */
const CHART_HEIGHT = 140;
/** So a small-but-nonzero day is still visible as a bar. */
const MIN_BAR_HEIGHT = 4;

function weekdayInitial(dayStart: number): string {
  return new Date(dayStart).toLocaleDateString(undefined, { weekday: 'narrow' });
}

function shortDate(dayStart: number): string {
  return new Date(dayStart).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
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

function Bar(props: {
  theme: Theme;
  day: DayTotal;
  goalMl: number;
  /** Tallest value the chart area represents; always > 0. */
  scaleMl: number;
  isToday: boolean;
  units: Settings['units'];
}): React.JSX.Element {
  const { theme, day, goalMl, scaleMl, isToday, units } = props;
  const ratio = day.totalMl / scaleMl;
  // A corrupt goal (NaN from a bad persisted blob) must not produce a NaN
  // height, which React Native would reject at layout time.
  const safeRatio = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
  const height =
    day.totalMl > 0
      ? Math.max(MIN_BAR_HEIGHT, Math.round(safeRatio * CHART_HEIGHT))
      : 0;
  const met = goalMl > 0 && day.totalMl >= goalMl;
  const label = weekdayInitial(day.dayStart);

  return (
    <View
      accessible
      accessibilityLabel={`${shortDate(day.dayStart)}${
        isToday ? ', today' : ''
      }: ${formatAmount(day.totalMl, units)}${met ? ', goal met' : ''}`}
      style={[
        styles.column,
        isToday && { backgroundColor: theme.accentSoft },
      ]}
    >
      <View style={styles.plot}>
        <View
          style={[
            styles.bar,
            {
              height,
              backgroundColor: met ? theme.success : theme.accent,
            },
          ]}
        />
      </View>
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.5}
        style={[
          styles.dayLabel,
          {
            color: isToday ? theme.accent : theme.textSecondary,
            fontWeight: isToday ? '800' : '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function HistoryScreen(props: {
  theme: Theme;
  hydration: HydrationState;
  settings: Settings;
}): React.JSX.Element {
  const { theme, hydration, settings } = props;
  const { entries, streak } = hydration;

  // Deliberately NOT memoized: a memo keyed on [entries] would cache this
  // `new Date()`, so backgrounding on this tab over midnight would leave the
  // chart pointing at yesterday as "today" while the streak banner above it
  // refreshes. O(entries + 30) per render is cheaper than that inconsistency.
  // One pass covers both views: the chart is just the last 7 of the 30.
  const days30 = dailyTotals(entries, 30, new Date());
  const days7 = days30.slice(-7);

  const highest = days7.reduce((max, d) => Math.max(max, d.totalMl), 0);
  // Settings gates keep goalMl >= 500, but a corrupt persisted value must not
  // divide by zero. Degrade to the data: a NaN goal drops out of the max and
  // the bars stay proportional to the week's own highest day.
  const scaleMl = Math.max(highest, settings.goalMl > 0 ? settings.goalMl : 0) || 1;
  const todayKey = days30[days30.length - 1].key;
  const weekIsEmpty = highest === 0;

  const loggedDays = days30.filter((d) => d.totalMl > 0).reverse();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text maxFontSizeMultiplier={1.5} style={[styles.title, { color: theme.text }]}>
        History
      </Text>

      <View
        style={[
          styles.card,
          styles.streakCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.streakText, { color: streak > 0 ? theme.text : theme.textSecondary }]}
        >
          {streak > 0 ? `🔥 ${streak}-day streak` : 'Start your streak today'}
        </Text>
      </View>

      <Section theme={theme} title="LAST 7 DAYS">
        {weekIsEmpty ? (
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.empty, { color: theme.textSecondary }]}
          >
            No drinks logged this week
          </Text>
        ) : (
          <>
            <View style={styles.chart}>
              {days7.map((day) => (
                <Bar
                  key={day.key}
                  theme={theme}
                  day={day}
                  goalMl={settings.goalMl}
                  scaleMl={scaleMl}
                  isToday={day.key === todayKey}
                  units={settings.units}
                />
              ))}
            </View>
            {/* Color is the only encoding of "met", and one outlier day pushes
                the goal off the top of the scale — so the caption has to tie
                the color back to the number. */}
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.note, { color: theme.textSecondary }]}
            >
              {`Green = daily goal ${formatAmount(
                settings.goalMl,
                settings.units
              )} met`}
            </Text>
          </>
        )}
      </Section>

      <Section theme={theme} title="LAST 30 DAYS">
        {loggedDays.length === 0 ? (
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.empty, { color: theme.textSecondary }]}
          >
            Nothing logged yet. Your days will show up here.
          </Text>
        ) : (
          loggedDays.map((day, index) => {
            const met = settings.goalMl > 0 && day.totalMl >= settings.goalMl;
            return (
              <View
                key={day.key}
                accessible
                accessibilityLabel={`${shortDate(day.dayStart)}: ${formatAmount(
                  day.totalMl,
                  settings.units
                )}${met ? ', goal met' : ''}`}
                style={[
                  styles.row,
                  index > 0 && { borderTopWidth: StyleSheet.hairlineWidth },
                  { borderTopColor: theme.border },
                ]}
              >
                <Text
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.5}
                  style={[styles.rowDate, { color: theme.text }]}
                >
                  {shortDate(day.dayStart)}
                </Text>
                <View style={styles.rowRight}>
                  <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.5}
                    style={[
                      styles.rowAmount,
                      { color: met ? theme.success : theme.textSecondary },
                    ]}
                  >
                    {formatAmount(day.totalMl, settings.units)}
                  </Text>
                  {met && (
                    <Text
                      maxFontSizeMultiplier={1.5}
                      style={[styles.check, { color: theme.success }]}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
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
  streakCard: {
    marginBottom: 18,
    alignItems: 'center',
  },
  streakText: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  plot: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  bar: {
    width: '62%',
    minWidth: 8,
    borderRadius: 6,
  },
  dayLabel: { fontSize: 12, marginTop: 8 },
  note: { fontSize: 12, fontWeight: '500', marginTop: 14 },
  empty: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  rowDate: { fontSize: 15, fontWeight: '600', flexShrink: 1 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowAmount: { fontSize: 15, fontWeight: '600' },
  check: { fontSize: 15, fontWeight: '700' },
});
