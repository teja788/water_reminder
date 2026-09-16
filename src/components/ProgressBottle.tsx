import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { Theme } from '../theme';
import { Units } from '../types';
import { formatAmount } from '../logic/hydration';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// Bottle silhouette: neck, sloped shoulders, straight body, rounded base.
// Authored against a 220x430 grid; the viewBox below crops it to the artwork.
const BOTTLE_PATH =
  'M 92 38 L 92 64 C 92 82 60 92 60 124 L 60 370 ' +
  'Q 60 398 88 398 L 132 398 Q 160 398 160 370 ' +
  'L 160 124 C 160 92 128 82 128 64 L 128 38 Z';

const TOP_Y = 70; // water surface when the bottle is full
const BOTTOM_Y = 396; // water surface when empty

// Cropped to the artwork (x 55-165, y 5-401) so the bottle fills the box
// instead of sitting in the empty margins the original grid left for text.
const VIEW_BOX = '55 5 110 396';
const VIEW_BOX_WIDTH = 110;
const VIEW_BOX_HEIGHT = 396;
/** The bottle grows to fill whatever Home gives it, within these bounds. */
const MIN_BOTTLE_HEIGHT = 200;
const MAX_BOTTLE_HEIGHT = 460;
/** Room the amount + subtitle below the bottle need, so the bottle claims the
 *  rest rather than pushing them into the log buttons. */
const TEXT_BLOCK_HEIGHT = 84;
/** The body is 100 of the viewBox's 110 units wide, so ~12% of the box on each
 *  side is outside the glass. Padding the overlay by that much lets
 *  `adjustsFontSizeToFit` shrink the percent to the body rather than the box. */
const OVERLAY_INSET = '12%';

export default function ProgressBottle(props: {
  theme: Theme;
  totalMl: number;
  goalMl: number;
  units: Units;
  /** Height Home measured for the gauge area; 0 until the first layout pass. */
  availableHeight: number;
}): React.JSX.Element {
  const { theme, totalMl, goalMl, units, availableHeight } = props;
  const { height: windowHeight } = useWindowDimensions();
  // Before the first onLayout there is nothing to measure against, so start
  // from the window and let the measured value take over on the next pass.
  const budget =
    availableHeight > 0 ? availableHeight - TEXT_BLOCK_HEIGHT : windowHeight * 0.42;
  const bottleHeight = Math.round(
    Math.min(MAX_BOTTLE_HEIGHT, Math.max(MIN_BOTTLE_HEIGHT, budget)),
  );
  const bottleWidth = Math.round(
    VIEW_BOX_WIDTH * (bottleHeight / VIEW_BOX_HEIGHT),
  );
  // Scales with the glass so the percent stays the same size *relative to the
  // bottle* on every device; adjustsFontSizeToFit trims it for "100%".
  const percentSize = Math.max(28, Math.round(bottleWidth * 0.45));
  // The goalMl > 0 term agrees with the corrupt-goal guard below: a 0/NaN goal
  // must not read as "reached".
  const goalReached = goalMl > 0 && totalMl >= goalMl;
  // A corrupt persisted goal (0/NaN) would otherwise animate toward NaN.
  const ratio = goalMl > 0 ? Math.min(totalMl / goalMl, 1) : 0;
  const percent = Math.round(ratio * 100);

  // SVG attributes cannot use the native driver.
  const fillAnim = useRef(new Animated.Value(ratio)).current;

  useEffect(() => {
    const anim = Animated.timing(fillAnim, {
      toValue: ratio,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start();
    // Switching tabs unmounts this screen mid-animation.
    return () => {
      anim.stop();
    };
  }, [ratio, fillAnim]);

  const waterY = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_Y, TOP_Y],
  });
  const waterHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BOTTOM_Y - TOP_Y],
  });

  const topStop = goalReached ? theme.waterDoneLight : theme.waterLight;
  const deepStop = goalReached ? theme.waterDoneDeep : theme.waterDeep;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${formatAmount(totalMl, units)} of ${formatAmount(goalMl, units)}`}
      accessibilityValue={{ min: 0, max: goalMl > 0 ? goalMl : 0, now: totalMl }}
      style={styles.container}
    >
      <View style={[styles.bottleWrap, { width: bottleWidth, height: bottleHeight }]}>
        <Svg width={bottleWidth} height={bottleHeight} viewBox={VIEW_BOX}>
          <Defs>
            <LinearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={topStop} />
              <Stop offset="1" stopColor={deepStop} />
            </LinearGradient>
            <ClipPath id="bottleClip">
              <Path d={BOTTLE_PATH} />
            </ClipPath>
          </Defs>

          {/* Cap */}
          <Rect x={86} y={8} width={48} height={30} rx={9} fill={theme.bottleOutline} />

          {/* Frosted glass body */}
          <Path d={BOTTLE_PATH} fill={theme.bottleGlass} opacity={0.55} />

          {/* Water, clipped to the bottle interior */}
          <AnimatedRect
            x={56}
            width={108}
            y={waterY}
            height={waterHeight}
            fill="url(#water)"
            clipPath="url(#bottleClip)"
          />
          {ratio > 0 && (
            <AnimatedEllipse
              cx={110}
              cy={waterY}
              rx={52}
              ry={6}
              fill={topStop}
              opacity={0.9}
              clipPath="url(#bottleClip)"
            />
          )}

          {/* Level marks at 25 / 50 / 75% */}
          {[0.25, 0.5, 0.75].map((f) => (
            <Path
              key={f}
              d={`M 146 ${BOTTOM_Y - f * (BOTTOM_Y - TOP_Y)} H 157`}
              stroke={theme.accent}
              strokeWidth={2}
              opacity={0.3}
            />
          ))}

          {/* Glass shine */}
          <Path
            d="M 71 132 L 71 356"
            stroke="#FFFFFF"
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.5}
          />

          {/* Outline */}
          <Path
            d={BOTTLE_PATH}
            fill="none"
            stroke={theme.bottleOutline}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </Svg>

        {/* The percent is short enough to sit on the bottle; the amount line
            below is not, and would land on the water at low contrast. */}
        <View style={styles.overlay} pointerEvents="none">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.5}
            style={[styles.percent, { fontSize: percentSize, color: theme.text }]}
          >
            {percent}%
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.5}
        style={[styles.amount, { color: theme.text }]}
      >
        {formatAmount(totalMl, units)}
      </Text>
      <Text
        maxFontSizeMultiplier={1.5}
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        {goalReached ? 'Goal reached! 🎉' : `of ${formatAmount(goalMl, units)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bottleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: OVERLAY_INSET,
  },
  percent: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 14,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 2,
  },
});
