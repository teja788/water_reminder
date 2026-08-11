import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { formatMl } from '../hydration';
import { colors } from '../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// Bottle silhouette: neck, sloped shoulders, straight body, rounded base.
const BOTTLE_PATH =
  'M 92 38 L 92 64 C 92 82 60 92 60 124 L 60 370 ' +
  'Q 60 398 88 398 L 132 398 Q 160 398 160 370 ' +
  'L 160 124 C 160 92 128 82 128 64 L 128 38 Z';

const TOP_Y = 70; // water surface when the bottle is full
const BOTTOM_Y = 396; // water surface when empty

interface Props {
  currentMl: number;
  goalMl: number;
}

export default function BottleGauge({ currentMl, goalMl }: Props) {
  const fraction = goalMl > 0 ? Math.min(1, currentMl / goalMl) : 0;
  const anim = useRef(new Animated.Value(fraction)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: fraction,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // SVG attributes cannot use the native driver
    }).start();
  }, [fraction, anim]);

  const waterY = anim.interpolate({ inputRange: [0, 1], outputRange: [BOTTOM_Y, TOP_Y] });
  const waterHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, BOTTOM_Y - TOP_Y] });
  const percent = goalMl > 0 ? Math.round((currentMl / goalMl) * 100) : 0;

  return (
    <View style={styles.wrap}>
      <Svg width={205} height={400} viewBox="0 0 220 430">
        <Defs>
          <LinearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.waterLight} />
            <Stop offset="1" stopColor={colors.waterDeep} />
          </LinearGradient>
          <ClipPath id="bottleClip">
            <Path d={BOTTLE_PATH} />
          </ClipPath>
        </Defs>

        {/* Cap */}
        <Rect x={86} y={8} width={48} height={30} rx={9} fill={colors.primaryDark} />

        {/* Glass body */}
        <Path d={BOTTLE_PATH} fill="#FFFFFF" opacity={0.55} />

        {/* Water, clipped to the bottle interior */}
        <AnimatedRect
          x={56}
          width={108}
          y={waterY}
          height={waterHeight}
          fill="url(#water)"
          clipPath="url(#bottleClip)"
        />
        {fraction > 0 && (
          <AnimatedEllipse
            cx={110}
            cy={waterY}
            rx={52}
            ry={6}
            fill={colors.waterLight}
            opacity={0.9}
            clipPath="url(#bottleClip)"
          />
        )}

        {/* Level marks at 25 / 50 / 75% */}
        {[0.25, 0.5, 0.75].map((f) => (
          <Path
            key={f}
            d={`M 146 ${BOTTOM_Y - f * (BOTTOM_Y - TOP_Y)} H 157`}
            stroke={colors.primary}
            strokeWidth={2}
            opacity={0.3}
          />
        ))}

        {/* Glass shine */}
        <Path d="M 71 132 L 71 356" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.5} />

        {/* Outline */}
        <Path d={BOTTLE_PATH} fill="none" stroke={colors.primaryDark} strokeWidth={5} strokeLinejoin="round" />
      </Svg>

      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.percent}>{percent}%</Text>
        <Text style={styles.amount}>
          {formatMl(currentMl)} of {formatMl(goalMl)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
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
  },
  percent: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
});
