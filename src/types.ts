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
