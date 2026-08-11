import { ExerciseLevel, Profile } from './types';

export const EXERCISE_OPTIONS: {
  value: ExerciseLevel;
  label: string;
  hint: string;
}[] = [
  { value: 'sedentary', label: 'Relaxed', hint: 'Mostly sitting, little exercise' },
  { value: 'light', label: 'Light', hint: 'Walks or light activity 1-2x a week' },
  { value: 'moderate', label: 'Active', hint: 'Exercise 3-5x a week' },
  { value: 'heavy', label: 'Very active', hint: 'Intense exercise most days' },
];

const EXERCISE_BONUS_ML: Record<ExerciseLevel, number> = {
  sedentary: 0,
  light: 350,
  moderate: 700,
  heavy: 1000,
};

/**
 * Daily drinking-water goal in ml.
 * Base follows EFSA adequate-intake guidance for fluids (2.0L women / 2.5L men),
 * adjusted slightly for age, plus roughly 350ml per 30 min of regular exercise.
 */
export function dailyGoalMl(profile: Profile): number {
  const base = profile.gender === 'male' ? 2500 : 2000;
  const ageAdjust = profile.age <= 30 ? 100 : profile.age >= 56 ? -100 : 0;
  const exercise = EXERCISE_BONUS_ML[profile.exercise];
  return Math.max(1500, Math.min(4000, base + ageAdjust + exercise));
}

export const QUICK_ADDS_ML = [100, 250, 500];

export function totalMl(entries: number[]): number {
  return entries.reduce((sum, ml) => sum + ml, 0);
}

/** Local date as YYYY-MM-DD (not UTC, so the day flips at local midnight). */
export function todayKey(): string {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatMl(ml: number): string {
  if (ml >= 1000) {
    const liters = ml / 1000;
    return `${Number.isInteger(liters) ? liters : liters.toFixed(1)}L`;
  }
  return `${ml}ml`;
}
