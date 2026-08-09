import { View } from 'react-native';
import { Theme } from '../theme';
import { Settings } from '../types';

export default function OnboardingScreen(props: {
  theme: Theme;
  onComplete: (settings: Settings) => void;
}): React.JSX.Element {
  return <View />;
}
