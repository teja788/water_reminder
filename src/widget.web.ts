import { DrinkEntry, Settings } from './types';
import type { WidgetDrink } from './widgets/SipWidget';

// No widgets on web: @expo/ui's native views throw at import there, which
// would blank the iPad Safari test build. Same signatures as widget.ts.

export function syncWidget(
  _settings: () => Settings | null,
  _entries: () => DrinkEntry[],
  _add: (drinks: WidgetDrink[]) => void
): Promise<void> {
  return Promise.resolve();
}

export function onWidgetTap(_listener: () => void): { remove(): void } {
  return { remove() {} };
}
