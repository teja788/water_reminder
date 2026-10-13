import { Button, Gauge, Text, VStack } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  buttonStyle,
  containerBackground,
  font,
  foregroundStyle,
  gaugeStyle,
  lineLimit,
  minimumScaleFactor,
  monospacedDigit,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type WidgetDrink = { t: number; ml: number };

export type SipWidgetProps = {
  totalMl: number;
  goalMl: number;
  cupMl: number;
  oz: boolean;
  /** Drinks tapped on the widget that the app has not imported yet. */
  pending: WidgetDrink[];
  /** Set by a tap, read by native code: drop reminders due before this (ms). */
  cancelRemindersUntil?: number;
  /** Pre-translated by the app: the widget runtime cannot import the catalog. */
  goalText: string;
  addText: string;
  /** Contains `{n}`, replaced with the amount left. */
  toGoTemplate: string;
  doneText: string;
};

/**
 * Runs in WidgetKit's own JS runtime, not the app's: no imports, hooks or
 * module-level values — only its props, `env`, and the SwiftUI globals.
 */
const SipWidget = (props: SipWidgetProps, env: WidgetEnvironment) => {
  'widget';
  // Mirrors formatAmount in src/logic/hydration.ts.
  const amount = (ml: number) =>
    props.oz ? `${Math.round(ml / 29.5735)} oz` : `${ml.toLocaleString()} ml`;
  const done = props.totalMl >= props.goalMl;
  const fraction = Math.min(1, props.totalMl / props.goalMl);
  const status = done
    ? props.doneText
    : props.toGoTemplate.replace('{n}', amount(props.goalMl - props.totalMl));
  const label = `${amount(props.totalMl)} ${props.goalText}`;
  const blue = '#1E88E5';
  // iOS 17+ shows a "Please adopt containerBackground API" placeholder for any
  // widget without one, lock-screen sizes included; there iOS draws its own.
  const clear = containerBackground('#00000000', 'widget');

  if (env.widgetFamily === 'accessoryCircular') {
    return (
      <Gauge
        value={fraction}
        modifiers={[gaugeStyle('circularCapacity'), accessibilityLabel(label), clear]}
        currentValueLabel={<Text>{`${Math.round(fraction * 100)}%`}</Text>}
      >
        <Text>💧</Text>
      </Gauge>
    );
  }

  if (env.widgetFamily === 'accessoryRectangular') {
    return (
      <VStack alignment="leading" spacing={2} modifiers={[accessibilityLabel(label), clear]}>
        <Text modifiers={[font({ weight: 'bold', textStyle: 'headline' }), monospacedDigit()]}>
          {amount(props.totalMl)}
        </Text>
        <Text modifiers={[lineLimit(1), minimumScaleFactor(0.7)]}>{status}</Text>
        <Gauge value={fraction} modifiers={[gaugeStyle('linearCapacity')]} />
      </VStack>
    );
  }

  return (
    <VStack
      alignment="leading"
      spacing={6}
      modifiers={[
        containerBackground(env.colorScheme === 'dark' ? '#0E1620' : '#F7FAFD', 'widget'),
      ]}
    >
      <VStack alignment="leading" spacing={0} modifiers={[accessibilityLabel(label)]}>
        <Text
          modifiers={[
            font({ size: 26, weight: 'bold', design: 'rounded' }),
            monospacedDigit(),
            minimumScaleFactor(0.6),
            lineLimit(1),
          ]}
        >
          {amount(props.totalMl)}
        </Text>
        <Text
          modifiers={[
            font({ textStyle: 'caption' }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            lineLimit(1),
            minimumScaleFactor(0.7),
          ]}
        >
          {props.goalText}
        </Text>
      </VStack>
      <Gauge value={fraction} modifiers={[gaugeStyle('linearCapacity'), tint(blue)]} />
      <Text modifiers={[font({ textStyle: 'caption2' }), lineLimit(1), minimumScaleFactor(0.7)]}>
        {status}
      </Text>
      <Button
        label={props.addText}
        target="log"
        modifiers={[buttonStyle('borderedProminent'), tint(blue)]}
        onPress={() => {
          // Like a log in the app: no reminder for the next 45 min (reminders.ts
          // START_DELAY_MS), none for the rest of today once the goal is met.
          // Native code (patches/expo-widgets*.patch) cancels them.
          const totalMl = props.totalMl + props.cupMl;
          const midnight = new Date();
          midnight.setHours(24, 0, 0, 0);
          return {
            totalMl,
            pending: [...props.pending, { t: Date.now(), ml: props.cupMl }],
            cancelRemindersUntil:
              totalMl >= props.goalMl ? midnight.getTime() : Date.now() + 45 * 60 * 1000,
          };
        }}
      />
    </VStack>
  );
};

export default createWidget('SipWidget', SipWidget);
