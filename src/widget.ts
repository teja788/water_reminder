import { addUserInteractionListener } from 'expo-widgets';
import { DrinkEntry, Settings } from './types';
import { formatAmount, totalForDay } from './logic/hydration';
import { t } from './i18n';
import SipWidget, { SipWidgetProps, WidgetDrink } from './widgets/SipWidget';

/** Midnights scheduled ahead, so the widget resets even if the app is not opened. */
const DAYS_AHEAD = 30;

/**
 * Show today's progress on the widget. One timeline entry per day: a tap
 * writes into the entry on screen, so each day's taps stay in their own entry
 * until syncWidget collects them — none are lost at midnight.
 * (No-op off iOS: expo-widgets ships stubs.)
 */
function pushWidget(settings: Settings, entries: DrinkEntry[], now = new Date()): void {
  const base: Omit<SipWidgetProps, 'totalMl'> = {
    goalMl: settings.goalMl,
    cupMl: settings.defaultCupMl,
    oz: settings.units === 'oz',
    pending: [],
    goalText: t.bottle.ofGoal(formatAmount(settings.goalMl, settings.units)),
    addText: t.widget.add(formatAmount(settings.defaultCupMl, settings.units)),
    toGoTemplate: t.widget.toGo('{n}'),
    doneText: t.widget.done,
  };
  const days = Array.from({ length: DAYS_AHEAD + 1 }, (_, i) =>
    i === 0 ? now : new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
  );
  try {
    SipWidget.updateTimeline(
      days.map((date, i) => ({
        date,
        props: { ...base, totalMl: i === 0 ? totalForDay(entries, now.getTime()) : 0 },
      }))
    );
  } catch {
    // A widget failure must never break logging.
  }
}

/** Drinks tapped on the widget since the last push, past days' entries
 *  included. null when the read fails — the caller must then not push, or the
 *  push would clear taps it never saw. */
async function readWidgetDrinks(): Promise<WidgetDrink[] | null> {
  try {
    const timeline = await SipWidget.getTimeline();
    return timeline.flatMap((entry) => entry.props.pending ?? []);
  } catch {
    return null;
  }
}

let syncQueue: Promise<void> = Promise.resolve();

/**
 * Collect the widget's taps, hand the new ones to `add`, then show the current
 * total (which clears the taps). Every widget write goes through here, queued
 * like rescheduleReminders: a bare push could otherwise clear taps that an
 * earlier sync had not read yet. `settings` and `entries` are read after the
 * await, so a settings change or log made meanwhile is not overwritten.
 * ponytail: a tap landing between the read and the push is dropped; a native
 * append-only queue would close it if it ever shows up.
 */
export function syncWidget(
  settings: () => Settings | null,
  entries: () => DrinkEntry[],
  add: (drinks: WidgetDrink[]) => void
): Promise<void> {
  syncQueue = syncQueue
    .then(async () => {
      const drinks = await readWidgetDrinks();
      const current = settings();
      if (drinks === null || current === null) {
        return;
      }
      const known = new Set(entries().map((e) => e.timestamp));
      const fresh = drinks.filter((d) => !known.has(d.t));
      if (fresh.length > 0) {
        add(fresh);
      }
      pushWidget(current, entries());
    })
    .catch(() => {
      // A failed sync must not poison the queue for later calls.
    });
  return syncQueue;
}

/** Fires on a widget tap if iOS runs the tap's intent in the app's process.
 *  It may not (widget intents usually run in the extension); the import on
 *  launch and foreground is the path that is relied on. */
export function onWidgetTap(listener: () => void): { remove(): void } {
  try {
    return addUserInteractionListener(listener);
  } catch {
    return { remove() {} };
  }
}
