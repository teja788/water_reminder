import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme';
import { Units } from '../types';
import { formatAmount } from '../logic/hydration';

const GLASS_WIDTH = 200;
const GLASS_HEIGHT = 260;
/** 85% opacity as a hex alpha suffix (0.85 * 255 ≈ 217 = 0xD9). */
const FILL_ALPHA = 'D9';

export default function ProgressGlass(props: {
  theme: Theme;
  totalMl: number;
  goalMl: number;
  units: Units;
}): React.JSX.Element {
  const { theme, totalMl, goalMl, units } = props;
  const goalReached = totalMl >= goalMl;

  // Percentage heights cannot use the native driver, so this stays on the JS
  // driver and interpolates to a '0%'–'100%' string (a raw 0–100 number bound
  // to `height` would be read as points).
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // A corrupt persisted goal (0/NaN) would otherwise animate toward NaN.
    const ratio = goalMl > 0 ? Math.min(totalMl / goalMl, 1) : 0;
    Animated.timing(fillAnim, {
      toValue: ratio,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [totalMl, goalMl, fillAnim]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const fillColor = goalReached
    ? `${theme.success}${FILL_ALPHA}`
    : `${theme.accent}${FILL_ALPHA}`;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${formatAmount(totalMl, units)} of ${formatAmount(goalMl, units)}`}
      style={[
        styles.glass,
        { borderColor: theme.border, backgroundColor: theme.card },
      ]}
    >
      <Animated.View
        style={[styles.fill, { height: fillHeight, backgroundColor: fillColor }]}
      />
      <View style={styles.overlay}>
        <Text style={[styles.total, { color: theme.text }]}>
          {formatAmount(totalMl, units)}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {goalReached ? 'Goal reached! 🎉' : `of ${formatAmount(goalMl, units)}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    width: GLASS_WIDTH,
    height: GLASS_HEIGHT,
    borderRadius: 34,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  total: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
  },
});
