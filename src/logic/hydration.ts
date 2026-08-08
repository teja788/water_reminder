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
  // 0/negative goals would make the while-loop below walk back forever
  // (0 >= 0 every day). Written negated so null/NaN from a corrupt persisted
  // settings blob also bail out to 0 instead of hanging the render.
  if (!(goalMl > 0)) {
    return 0;
  }
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
