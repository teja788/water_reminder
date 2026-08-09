import { View } from 'react-native';
import { Theme } from '../theme';
import { Settings } from '../types';
import { HydrationState } from '../state';

export default function SettingsScreen(props: {
  theme: Theme;
  hydration: HydrationState;
  settings: Settings;
}): React.JSX.Element {
  return <View />;
}
