# Water Reminder Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the empty Expo starter into a shippable v1 water tracker: one-tap logging, smart reminders that stop when the goal is met, goal calculation, local history/streaks, dark mode.

**Architecture:** Local-first, no accounts, no backend. All state lives in AsyncStorage and flows through one custom hook (`useHydration`) owned by `App.tsx`. Pure logic (goal math, streaks, reminder scheduling times) is separated from impure modules (storage, notifications) so it can be reasoned about and reviewed in isolation. Screens are switched with plain component state — no navigation library.

**Tech Stack:** Expo SDK 56 (React Native 0.85, React 19, TypeScript). New dependencies: `expo-notifications`, `@react-native-async-storage/async-storage` — nothing else. Animations use React Native's built-in `Animated`. Exact expo-notifications API shapes below were verified against https://docs.expo.dev/versions/v56.0.0/sdk/notifications/ — use them as written; consult those docs for anything not covered here (required by AGENTS.md).

**Verification policy (project convention, overrides default TDD):** This project has no test framework and a hard minimal-dependencies constraint (owner preference). Do NOT add jest or any test dependency. Verification per task = `npx tsc --noEmit` passing, plus `npx expo export --platform ios` at integration checkpoints (Tasks 5 and 7). Pure-logic modules must additionally be desk-checked against the worked examples given in their task.

**Constraints:**
- Sequential tasks; each ends in a commit on branch `claude/iphone-app-store-improvements-548841`.
- YAGNI applies: build exactly what each task specifies. No extra features, no speculative props/config.
- Sleep time must be later than wake time on the same day (guaranteed by the UI's chip ranges: wake ≤ 12:00 < 18:00 ≤ sleep). Overnight (past-midnight) schedules are out of scope for v1.
- iOS caps scheduled local notifications at 64; our max is ~2 days × ~16 = well under.
- **Known v1 limitations (accepted, do not "fix"):** reminders are scheduled for today + tomorrow only, so if the app isn't foregrounded for 2+ days they pause until the next open (mitigated by rescheduling on every foreground). A quick-log action tapped while the app is killed records at most the latest response — earlier untapped ones are lost.

**File structure (locked in — do not restructure):**

```
App.tsx                        — root: theme selection, screen switching, renders hook state
src/types.ts                   — shared domain types + DEFAULTS
src/theme.ts                   — light/dark palettes
src/pro.ts                     — isPro flag (scaffold only)
src/storage.ts                 — AsyncStorage load/save (settings, entries)
src/logic/hydration.ts         — pure: goal calc, day totals, streaks, unit formatting
src/logic/reminders.ts         — pure: compute reminder Date[]s from settings + progress
src/notifications.ts           — impure: permissions, category/actions, (re)scheduling
src/state.ts                   — useHydration() hook: state + actions + notification wiring
src/screens/OnboardingScreen.tsx
src/screens/HomeScreen.tsx
src/screens/HistoryScreen.tsx
src/screens/SettingsScreen.tsx
src/components/ProgressGlass.tsx — animated fill visualization
src/components/LogButtons.tsx    — preset cups + custom amount modal + undo
```

---

## Chunk 1: Foundation & Logic (Tasks 1–3)

### Task 1: Dependencies, app config, types, theme, storage, pro scaffold

**Files:**
- Modify: `app.json`
- Create: `src/types.ts`, `src/theme.ts`, `src/storage.ts`, `src/pro.ts`

- [ ] **Step 0: Install existing dependencies** (this worktree has no `node_modules` — nothing, including `npx expo` and `npx tsc`, works until this runs)

Run: `npm install`
Expected: exit 0, `node_modules/` created.

- [ ] **Step 1: Install new dependencies** (from repo root)

Run: `npx expo install expo-notifications @react-native-async-storage/async-storage`
Expected: both added to `package.json` at SDK-56-compatible versions.

- [ ] **Step 2: Update `app.json`**

Change only these fields inside `"expo"` (leave everything else as-is):

```json
"name": "Water Reminder",
"userInterfaceStyle": "automatic",
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.teja788.waterreminder"
},
"plugins": ["expo-notifications"]
```

- [ ] **Step 3: Create `src/types.ts`** — complete file:

```typescript
export type ActivityLevel = 'sedentary' | 'moderate' | 'active';
export type Units = 'ml' | 'oz';

export interface Settings {
  weightKg: number;
  activity: ActivityLevel;
  /** Daily goal in ml. Suggested from weight/activity but user-overridable. */
  goalMl: number;
  units: Units;
  /** Minutes from local midnight, e.g. 420 = 07:00. */
  wakeMinutes: number;
  /** Minutes from local midnight, e.g. 1320 = 22:00. Must be > wakeMinutes. */
  sleepMinutes: number;
  /** Preset one-tap log amounts shown on Home. Exactly 3 values. */
  cupSizesMl: number[];
  /** Amount logged by the notification quick-log action. */
  defaultCupMl: number;
  remindersEnabled: boolean;
}

export interface DrinkEntry {
  id: string;
  /** Epoch ms, local device time. */
  timestamp: number;
  amountMl: number;
}

export const DEFAULT_CUP_SIZES_ML = [150, 250, 500];
export const DEFAULT_CUP_ML = 250;
export const DEFAULT_WAKE_MINUTES = 7 * 60;
export const DEFAULT_SLEEP_MINUTES = 22 * 60;

export function makeEntryId(timestamp: number): string {
  return `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
}
```

- [ ] **Step 4: Create `src/theme.ts`** — complete file:

```typescript
export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  border: string;
}

export const lightTheme: Theme = {
  background: '#F7FAFD',
  card: '#FFFFFF',
  text: '#10222E',
  textSecondary: '#5B7386',
  accent: '#1E88E5',
  accentSoft: '#DEEFFB',
  success: '#2E9E6B',
  danger: '#D64545',
  border: '#E1EAF2',
};

export const darkTheme: Theme = {
  background: '#0E1620',
  card: '#18232F',
  text: '#EAF2F8',
  textSecondary: '#8FA7B8',
  accent: '#4DA8F0',
  accentSoft: '#17324A',
  success: '#4CC38A',
  danger: '#E5686B',
  border: '#243342',
};
```

- [ ] **Step 5: Create `src/storage.ts`** — complete file:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkEntry, Settings } from './types';

const SETTINGS_KEY = 'wr:settings';
const ENTRIES_KEY = 'wr:entries';

export async function loadSettings(): Promise<Settings | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as Settings) : null;
  } catch {
    return null;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadEntries(): Promise<DrinkEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as DrinkEntry[]) : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: DrinkEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}
```

- [ ] **Step 6: Create `src/pro.ts`** — complete file (scaffold for future monetization; nothing reads it yet except future gated features):

```typescript
/**
 * Monetization scaffold. Phase 1 ships fully free; when the one-time
 * "Pro" unlock is added, this flag becomes IAP-driven. Gate any future
 * pro feature by checking isProUnlocked() so the seam already exists.
 */
export function isProUnlocked(): boolean {
  return false;
}
```

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 8: Commit**

```bash
git add app.json package.json package-lock.json src/
git commit -m "feat: add deps, app config, types, theme, storage, pro scaffold"
```

---

### Task 2: Pure hydration + reminder logic

**Files:**
- Create: `src/logic/hydration.ts`, `src/logic/reminders.ts`

- [ ] **Step 1: Create `src/logic/hydration.ts`** — complete file:

```typescript
import { ActivityLevel, DrinkEntry, Units } from '../types';

const ACTIVITY_BONUS_ML: Record<ActivityLevel, number> = {
  sedentary: 0,
  moderate: 350,
  active: 700,
};

/** ~32 ml per kg body weight + activity bonus, clamped to a sane range. */
export function calcGoalMl(weightKg: number, activity: ActivityLevel): number {
  const raw = weightKg * 32 + ACTIVITY_BONUS_ML[activity];
  const clamped = Math.min(4000, Math.max(1500, raw));
  return Math.round(clamped / 50) * 50;
}

export function mlToOz(ml: number): number {
  return ml / 29.5735;
}

export function formatAmount(ml: number, units: Units): string {
  if (units === 'oz') {
    return `${Math.round(mlToOz(ml))} oz`;
  }
  return `${ml.toLocaleString()} ml`;
}

/** Local-time day key, e.g. "2026-08-08". */
export function dayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function totalForDay(entries: DrinkEntry[], dayTimestamp: number): number {
  const key = dayKey(dayTimestamp);
  return entries.reduce(
    (sum, e) => (dayKey(e.timestamp) === key ? sum + e.amountMl : sum),
    0
  );
}

export interface DayTotal {
  key: string;
  /** Local midnight of the day, epoch ms. */
  dayStart: number;
  totalMl: number;
}

/** Totals for the last `days` days, oldest first, including today. */
export function dailyTotals(entries: DrinkEntry[], days: number, now: Date): DayTotal[] {
  const totals = new Map<string, number>();
  for (const e of entries) {
    const k = dayKey(e.timestamp);
    totals.set(k, (totals.get(k) ?? 0) + e.amountMl);
  }
  const result: DayTotal[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const k = dayKey(d.getTime());
    result.push({ key: k, dayStart: d.getTime(), totalMl: totals.get(k) ?? 0 });
  }
  return result;
}

/**
 * Consecutive days meeting the goal, counting back from today.
 * Today not yet meeting the goal does not break the streak (the day
 * is still in progress); it just doesn't count yet.
 */
export function currentStreak(entries: DrinkEntry[], goalMl: number, now: Date): number {
  const totals = new Map<string, number>();
  for (const e of entries) {
    const k = dayKey(e.timestamp);
    totals.set(k, (totals.get(k) ?? 0) + e.amountMl);
  }
  let streak = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if ((totals.get(dayKey(cursor.getTime())) ?? 0) < goalMl) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while ((totals.get(dayKey(cursor.getTime())) ?? 0) >= goalMl) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
```

- [ ] **Step 2: Desk-check `hydration.ts` against these worked examples** (fix code if any fail):
- `calcGoalMl(60, 'moderate')` → 60×32+350 = 2270 → rounds to **2250**
- `calcGoalMl(40, 'sedentary')` → 1280 → clamps to **1500**
- `calcGoalMl(120, 'active')` → 4540 → clamps to **4000**
- `formatAmount(500, 'oz')` → 16.9 oz → **"17 oz"**
- `currentStreak` with goal met yesterday and day before, today at 0 → **2**

- [ ] **Step 3: Create `src/logic/reminders.ts`** — complete file:

```typescript
import { Settings } from '../types';

const MINUTE_MS = 60 * 1000;
/** Never schedule two reminders closer than this. */
const MIN_GAP_MS = 45 * MINUTE_MS;
/** Give the user breathing room after "now" before the next nudge. */
const START_DELAY_MS = 45 * MINUTE_MS;
/** Stop nudging shortly before sleep time. */
const END_BUFFER_MS = 30 * MINUTE_MS;

/** The given day at `minutes` past local midnight. */
function atMinutes(day: Date, minutes: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
}

function spread(startMs: number, endMs: number, wanted: number): Date[] {
  if (wanted <= 0 || startMs > endMs) {
    return [];
  }
  const maxFit = Math.floor((endMs - startMs) / MIN_GAP_MS) + 1;
  const count = Math.min(wanted, maxFit);
  if (count === 1) {
    return [new Date(startMs)];
  }
  const gap = (endMs - startMs) / (count - 1);
  return Array.from({ length: count }, (_, i) => new Date(startMs + i * gap));
}

/**
 * Reminders for the rest of today. The core "smart" behavior:
 * - none if the goal is already met (the top complaint about competitors)
 * - count scales with how much is left (remaining / default cup)
 * - evenly spread between now+delay and sleep-buffer, never closer than MIN_GAP
 */
export function computeTodayReminderTimes(
  now: Date,
  settings: Settings,
  todayTotalMl: number
): Date[] {
  if (!settings.remindersEnabled) {
    return [];
  }
  const remainingMl = settings.goalMl - todayTotalMl;
  if (remainingMl <= 0) {
    return [];
  }
  const start = Math.max(
    now.getTime() + START_DELAY_MS,
    atMinutes(now, settings.wakeMinutes).getTime()
  );
  const end = atMinutes(now, settings.sleepMinutes).getTime() - END_BUFFER_MS;
  const wanted = Math.ceil(remainingMl / settings.defaultCupMl);
  return spread(start, end, wanted);
}

/**
 * Tomorrow's full-day schedule, assuming zero progress. Scheduled ahead so
 * reminders fire even if the app isn't opened tomorrow. Recomputed on every
 * app open / foreground / log, so it self-corrects.
 *
 * Intentional asymmetry with today: tomorrow's first nudge waits an hour
 * after wake, while today's can start right at wake (the user is already
 * awake if the app computed a plan for today).
 */
export function computeTomorrowReminderTimes(now: Date, settings: Settings): Date[] {
  if (!settings.remindersEnabled) {
    return [];
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = atMinutes(tomorrow, settings.wakeMinutes).getTime() + 60 * MINUTE_MS;
  const end = atMinutes(tomorrow, settings.sleepMinutes).getTime() - END_BUFFER_MS;
  const wanted = Math.ceil(settings.goalMl / settings.defaultCupMl);
  return spread(start, end, wanted);
}
```

- [ ] **Step 4: Desk-check `reminders.ts`** (fix code if any fail). Settings: goal 2500, defaultCup 250, wake 420 (07:00), sleep 1320 (22:00), remindersEnabled true.
- Goal met (`todayTotalMl` 2500): today → **[]** (no nagging after goal — this is the product's centerpiece)
- `remindersEnabled: false`: both functions → **[]**
- Now = 20:00, total 0: start = 20:45, end = 21:30, wanted 10, maxFit = floor(45/45)+1 = 2 → **2 reminders** at 20:45 and 21:30
- Now = 21:30, total 0: start 22:15 > end 21:30 → **[]** (never pings near bedtime)
- Now = 09:00, total 1250: wanted 5, window 09:45–21:30 → **5 evenly spread**, first 09:45, last 21:30
- Tomorrow: 10 reminders between 08:00 and 21:30

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/logic/
git commit -m "feat: pure hydration and smart reminder scheduling logic"
```

---

### Task 3: Notifications module

**Files:**
- Create: `src/notifications.ts`

The expo-notifications API shapes below are verified against the SDK 56 docs. Use them exactly.

- [ ] **Step 1: Create `src/notifications.ts`** — complete file:

```typescript
import * as Notifications from 'expo-notifications';
import { Settings, Units } from './types';
import { formatAmount } from './logic/hydration';
import {
  computeTodayReminderTimes,
  computeTomorrowReminderTimes,
} from './logic/reminders';

export const REMINDER_CATEGORY = 'water-reminder';
export const ACTION_LOG_DEFAULT = 'log-default';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const result = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return result.granted;
}

/**
 * Registers the quick-log action so the user can log their default cup
 * straight from the notification without opening the app.
 * Re-run whenever defaultCupMl or units change (button title shows the amount).
 */
export async function setupQuickLogCategory(
  defaultCupMl: number,
  units: Units
): Promise<void> {
  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY, [
    {
      identifier: ACTION_LOG_DEFAULT,
      buttonTitle: `Log ${formatAmount(defaultCupMl, units)}`,
      options: { opensAppToForeground: false },
    },
  ]);
}

const MESSAGES: Array<[string, string]> = [
  ['Time for water 💧', 'A quick glass now keeps you on track.'],
  ['Hydration check', 'Your body will thank you for a sip.'],
  ['Water break', 'Small sips, big difference.'],
  ['Thirsty yet?', 'A glass of water sounds good right about now.'],
  ['Keep it flowing', "You're closer to today's goal than you think."],
  ['Sip reminder', 'Take a moment — have some water.'],
  ["Water o'clock", 'One glass now beats catching up later.'],
  ['Stay refreshed', 'A little water goes a long way.'],
];

let rescheduleQueue: Promise<void> = Promise.resolve();

/**
 * Cancel-and-reschedule everything from current state. Called on app open,
 * every foreground, every log/undo, and after settings changes. Calls are
 * serialized through a queue so two rapid logs can't interleave their
 * cancel/schedule phases (which would leave duplicate or missing reminders).
 * Schedules the rest of today (progress-aware) plus tomorrow (baseline),
 * staying far under the 64-notification iOS limit.
 */
export function rescheduleReminders(
  settings: Settings,
  todayTotalMl: number,
  now: Date = new Date()
): Promise<void> {
  rescheduleQueue = rescheduleQueue
    .then(() => doReschedule(settings, todayTotalMl, now))
    .catch(() => {
      // A failed reschedule must not poison the queue for later calls.
    });
  return rescheduleQueue;
}

async function doReschedule(
  settings: Settings,
  todayTotalMl: number,
  now: Date
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.remindersEnabled) {
    return;
  }
  const times = [
    ...computeTodayReminderTimes(now, settings, todayTotalMl),
    ...computeTomorrowReminderTimes(now, settings),
  ];
  await Promise.all(
    times.map((date, i) => {
      const [title, body] = MESSAGES[i % MESSAGES.length];
      return Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          categoryIdentifier: REMINDER_CATEGORY,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
        },
      });
    })
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0. If any expo-notifications type doesn't match (e.g. trigger or category shapes), check https://docs.expo.dev/versions/v56.0.0/sdk/notifications/ and adjust to the documented API — do not cast to `any`.

- [ ] **Step 3: Commit**

```bash
git add src/notifications.ts
git commit -m "feat: notification permissions, quick-log action, smart rescheduling"
```

---

## Chunk 2: State & UI (Tasks 4–7)

### Task 4: useHydration hook + App shell

**Files:**
- Create: `src/state.ts`
- Create (stubs): `src/screens/OnboardingScreen.tsx`, `src/screens/HomeScreen.tsx`, `src/screens/HistoryScreen.tsx`, `src/screens/SettingsScreen.tsx`
- Modify: `App.tsx` (replace entirely)

- [ ] **Step 1: Create `src/state.ts`** — complete file:

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DrinkEntry, Settings, makeEntryId } from './types';
import { loadEntries, loadSettings, saveEntries, saveSettings } from './storage';
import { currentStreak, totalForDay } from './logic/hydration';
import { computeTodayReminderTimes } from './logic/reminders';
import {
  ACTION_LOG_DEFAULT,
  rescheduleReminders,
  setupQuickLogCategory,
} from './notifications';

export interface HydrationState {
  /** False until AsyncStorage has been read. */
  ready: boolean;
  /** null = onboarding not completed yet. */
  settings: Settings | null;
  entries: DrinkEntry[];
  todayTotalMl: number;
  streak: number;
  /** First upcoming reminder today, or null. */
  nextReminder: Date | null;
  logDrink: (amountMl: number, timestampMs?: number) => void;
  undoLast: () => void;
  updateSettings: (next: Settings) => void;
}

export function useHydration(): HydrationState {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  // Bumped on every return to foreground. It is ONLY a dependency that forces
  // the day-based memos below to recompute — without it, an app backgrounded
  // over midnight would keep showing yesterday's totals.
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    (async () => {
      let [s, e] = await Promise.all([loadSettings(), loadEntries()]);
      if (s?.remindersEnabled) {
        // The user may have revoked notification permission in iOS Settings
        // since last launch; don't keep pretending reminders are on.
        const perm = await Notifications.getPermissionsAsync();
        if (!perm.granted) {
          s = { ...s, remindersEnabled: false };
          void saveSettings(s);
        }
      }
      setSettings(s);
      setEntries(e);
      setReady(true);
      if (s) {
        await setupQuickLogCategory(s.defaultCupMl, s.units);
        await rescheduleReminders(s, totalForDay(e, Date.now()));
      }
    })();
  }, []);

  // On foreground: refresh "today" and re-sync scheduled notifications with
  // reality (they were computed against stale progress if the app slept over
  // midnight, and tomorrow's batch needs to keep rolling forward).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }
      setNowTick(Date.now());
      if (settings) {
        void rescheduleReminders(settings, totalForDay(entries, Date.now()));
      }
    });
    return () => sub.remove();
  }, [settings, entries]);

  const todayTotalMl = useMemo(
    () => totalForDay(entries, Date.now()),
    [entries, nowTick]
  );

  const streak = useMemo(
    () => (settings ? currentStreak(entries, settings.goalMl, new Date()) : 0),
    [entries, settings, nowTick]
  );

  const nextReminder = useMemo(() => {
    if (!settings) {
      return null;
    }
    const times = computeTodayReminderTimes(new Date(), settings, todayTotalMl);
    return times.length > 0 ? times[0] : null;
  }, [settings, todayTotalMl, nowTick]);

  const persistEntries = useCallback(
    (next: DrinkEntry[], s: Settings | null) => {
      setEntries(next);
      void saveEntries(next);
      if (s) {
        void rescheduleReminders(s, totalForDay(next, Date.now()));
      }
    },
    []
  );

  const logDrink = useCallback(
    (amountMl: number, timestampMs?: number) => {
      const ts = timestampMs ?? Date.now();
      const entry: DrinkEntry = {
        id: makeEntryId(ts),
        timestamp: ts,
        amountMl,
      };
      persistEntries([...entries, entry], settings);
    },
    [entries, settings, persistEntries]
  );

  const undoLast = useCallback(() => {
    if (entries.length === 0) {
      return;
    }
    // Backdated quick-log entries mean the last array element isn't
    // necessarily the most recent drink — remove the max-timestamp entry.
    let latest = 0;
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].timestamp > entries[latest].timestamp) {
        latest = i;
      }
    }
    persistEntries(entries.filter((_, i) => i !== latest), settings);
  }, [entries, settings, persistEntries]);

  const updateSettings = useCallback(
    (next: Settings) => {
      setSettings(next);
      void saveSettings(next);
      void setupQuickLogCategory(next.defaultCupMl, next.units);
      void rescheduleReminders(next, totalForDay(entries, Date.now()));
    },
    [entries]
  );

  // Quick-log action tapped on a notification (works from background; if the
  // app was killed, the response arrives on next launch). The entry is
  // backdated to when the notification was acted on so an overnight-delayed
  // response still lands on the correct day. Known v1 limitation: only the
  // most recent response survives an app kill.
  const lastResponse = Notifications.useLastNotificationResponse();
  const processedResponses = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!lastResponse || !settings) {
      return;
    }
    if (lastResponse.actionIdentifier !== ACTION_LOG_DEFAULT) {
      return;
    }
    const id = lastResponse.notification.request.identifier;
    if (processedResponses.current.has(id)) {
      return;
    }
    processedResponses.current.add(id);
    // Notification.date is Unix ms (SDK 56 docs) — safe to use as a timestamp.
    logDrink(settings.defaultCupMl, lastResponse.notification.date);
    void Notifications.clearLastNotificationResponseAsync();
  }, [lastResponse, settings, logDrink]);

  return {
    ready,
    settings,
    entries,
    todayTotalMl,
    streak,
    nextReminder,
    logDrink,
    undoLast,
    updateSettings,
  };
}
```

- [ ] **Step 2: Replace `App.tsx`** — complete file:

```typescript
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { darkTheme, lightTheme } from './src/theme';
import { useHydration } from './src/state';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Tab = 'home' | 'history' | 'settings';

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'home', label: 'Today', icon: '💧' },
  { id: 'history', label: 'History', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const hydration = useHydration();
  const [tab, setTab] = useState<Tab>('home');

  if (!hydration.ready) {
    return <View style={[styles.root, { backgroundColor: theme.background }]} />;
  }

  if (!hydration.settings) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <OnboardingScreen theme={theme} onComplete={hydration.updateSettings} />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        {tab === 'home' && (
          <HomeScreen theme={theme} hydration={hydration} settings={hydration.settings} />
        )}
        {tab === 'history' && (
          <HistoryScreen theme={theme} hydration={hydration} settings={hydration.settings} />
        )}
        {tab === 'settings' && (
          <SettingsScreen theme={theme} hydration={hydration} settings={hydration.settings} />
        )}
      </View>
      <View style={[styles.tabBar, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
        {TABS.map((t) => (
          <Pressable key={t.id} style={styles.tabButton} onPress={() => setTab(t.id)}>
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                { color: tab === t.id ? theme.accent : theme.textSecondary },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 28,
    paddingTop: 10,
  },
  tabButton: { flex: 1, alignItems: 'center', gap: 2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 12, fontWeight: '600' },
});
```

- [ ] **Step 3: Create minimal placeholder screens so tsc passes** — each of the four screen files exports a default component with the correct final props signature rendering an empty `<View />`. Props contracts (final, used by Tasks 5–7):

```typescript
// OnboardingScreen
export default function OnboardingScreen(props: {
  theme: Theme;
  onComplete: (settings: Settings) => void;
}): React.JSX.Element;

// HomeScreen / HistoryScreen / SettingsScreen all share this shape.
// `settings` is passed separately (already null-narrowed by App.tsx) so the
// screens never have to handle `hydration.settings`'s null case under strict.
export default function HomeScreen(props: {
  theme: Theme;
  hydration: HydrationState;
  settings: Settings;
}): React.JSX.Element;
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add App.tsx src/state.ts src/screens/
git commit -m "feat: hydration state hook, app shell with tabs, screen stubs"
```

---

### Task 5: Home screen — progress glass + one-tap logging

**Files:**
- Create: `src/components/ProgressGlass.tsx`, `src/components/LogButtons.tsx`
- Modify: `src/screens/HomeScreen.tsx` (replace stub)

Behavior below is mandatory; exact spacing/typography within the theme is implementer judgment. Use only React Native core (`Animated` from 'react-native', no reanimated).

- [ ] **Step 1: Create `ProgressGlass`**

Props: `{ theme: Theme; totalMl: number; goalMl: number; units: Units }`.
- A tall rounded-rectangle "glass" (approx 200×260, border from theme, overflow hidden) with an `Animated.View` water fill anchored to the bottom. Drive a 0–1 `useRef(new Animated.Value(0))` with `Animated.timing` (500ms, `useNativeDriver: false` — percentage heights can't use the native driver) toward `min(totalMl / goalMl, 1)` in a `useEffect` on `totalMl`/`goalMl`, and set the fill's height to `fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })` — do NOT bind a raw 0–100 value to `height` (RN would read it as points, not percent).
- Fill color `theme.accent` at 85% opacity; goal-reached state switches fill to `theme.success`.
- Centered overlay text: big `formatAmount(totalMl, units)`, below it `of {formatAmount(goalMl, units)}` in `textSecondary`; when goal reached, replace the subtitle with `Goal reached! 🎉`.

- [ ] **Step 2: Create `LogButtons`**

Props: `{ theme: Theme; cupSizesMl: number[]; units: Units; canUndo: boolean; onLog: (ml: number) => void; onUndo: () => void }`.
- A row of one `Pressable` per cup size, labeled `formatAmount(size, units)`, accent-soft background, pressed state darkens. Tapping calls `onLog(size)`.
- A fourth button `Custom…` opens a `Modal` with a numeric `TextInput` (amount in the current units — convert oz input to ml with `Math.round(oz * 29.5735)` before calling `onLog`), Cancel/Log buttons. Reject empty/zero/negative/NaN input by disabling Log.
- Below the row: `Undo last` text button in `theme.danger`, rendered only when `canUndo`, calls `onUndo`.

- [ ] **Step 3: Replace `HomeScreen` stub**

Layout top to bottom, safe-area padded (paddingTop ~70): date header (`new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })` in `textSecondary`), `ProgressGlass` centered, `LogButtons`, then a reminder hint line with exactly these four branches, checked in this order:
1. `settings.remindersEnabled === false` → `Reminders are off`
2. goal met (`hydration.todayTotalMl >= settings.goalMl`) → `Done for today — no more reminders`
3. `hydration.nextReminder` non-null → `Next reminder around {time formatted h:mm}`
4. otherwise (evenings: goal unmet but too late to schedule) → `No more reminders tonight — back tomorrow`

`canUndo` = `hydration.todayTotalMl > 0`.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → exit 0.
Run: `npx expo export --platform ios` → completes without errors (proves the bundle builds).

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/screens/HomeScreen.tsx
git commit -m "feat: home screen with animated progress glass and one-tap logging"
```

---

### Task 6: Onboarding + Settings screens

**Files:**
- Modify: `src/screens/OnboardingScreen.tsx`, `src/screens/SettingsScreen.tsx` (replace stubs)

Both screens edit the same fields — extract nothing into shared files (two screens, different flows; duplication is acceptable at this size). Small single-file helper components (e.g. a `Chip` or `Section`) inside each screen are fine to keep them readable. Use only RN core components. All numeric inputs: `TextInput` with `keyboardType="number-pad"`, validated (reject NaN/≤0). Text inputs bind to local draft state and commit via `updateSettings` (or `onComplete`) with a full `Settings` object on blur/tap — never drive a `TextInput` directly from `hydration.settings`. Time selection: whole hours only — a row of `Pressable` chips per hour, wake 05:00–12:00, sleep 18:00–23:00, stored as minutes from midnight (hour × 60). These ranges themselves guarantee sleep > wake (max wake 12:00 < min sleep 18:00), so write no extra validation for it.

- [ ] **Step 1: Replace `OnboardingScreen` stub**

Single scrollable screen, welcome header ("Let's set your daily goal"), then:
1. Weight input (kg) + activity picker (three chips: Sedentary / Moderate / Active).
2. Live suggested goal via `calcGoalMl`, displayed prominently, with an editable goal field prefilled from the suggestion (typing a custom value keeps it).
3. Units toggle (ml / oz) — affects display only; storage stays ml.
4. Wake hour chips (default 07:00) and sleep hour chips (default 22:00).
5. `Start` button: requests notification permission via `requestNotificationPermission()`, then calls `onComplete` with a full `Settings` object: entered values + `cupSizesMl: DEFAULT_CUP_SIZES_ML`, `defaultCupMl: DEFAULT_CUP_ML`, `remindersEnabled: <permission result>`.

- [ ] **Step 2: Replace `SettingsScreen` stub**

Sections (card per section, section titles in `textSecondary`):
1. **Daily goal** — weight, activity chips, suggested goal with `Use suggested` button, manual goal input. Changes call `updateSettings` on field commit (onEndEditing / chip tap), not per keystroke.
2. **Units** — ml/oz toggle.
3. **Schedule** — wake/sleep hour chips as in onboarding, same sleep > wake rule.
4. **Cups** — three numeric inputs for the preset sizes; a "default cup" selector (chip per size) controlling `defaultCupMl` (used by notification quick-log; note this under the selector in small text). If the user edits a preset size that is currently the default cup, `defaultCupMl` follows the new value (otherwise it would silently point at an amount no longer on any button).
5. **Reminders** — `Switch` for `remindersEnabled`; when turning on, call `requestNotificationPermission()` first and only enable if granted; when denied show inline hint `Enable notifications in iOS Settings`.
6. **About** — app version 1.0.0, one line: `Your data never leaves this device.`

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/screens/OnboardingScreen.tsx src/screens/SettingsScreen.tsx
git commit -m "feat: onboarding flow and settings screen"
```

---

### Task 7: History screen + final verification

**Files:**
- Modify: `src/screens/HistoryScreen.tsx` (replace stub)

- [ ] **Step 1: Replace `HistoryScreen` stub**

Top to bottom, safe-area padded, scrollable:
1. Streak banner card: `🔥 {streak}-day streak` (or `Start your streak today` when 0).
2. **Last 7 days** bar chart built from `dailyTotals(entries, 7, new Date())`: one column per day (flex row), bar height proportional to `totalMl / max(goalMl, highest total)` of a fixed 140px chart area, bar color `success` when total ≥ goal else `accent`, weekday initial under each bar, today highlighted. Pure `View`s — no chart lib.
3. **Last 30 days** list from `dailyTotals(entries, 30, ...)` reversed (newest first), skipping zero days: date, `formatAmount(totalMl, units)`, and a ✓ when goal met. Plain `.map` inside the ScrollView (30 rows max — no FlatList needed).

- [ ] **Step 2: Verify (full integration checkpoint)**

Run: `npx tsc --noEmit` → exit 0.
Run: `npx expo export --platform ios` → completes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/HistoryScreen.tsx
git commit -m "feat: history screen with 7-day chart and streaks"
```
