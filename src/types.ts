export type Gender = 'female' | 'male';

export type ExerciseLevel = 'sedentary' | 'light' | 'moderate' | 'heavy';

export interface Profile {
  age: number;
  gender: Gender;
  exercise: ExerciseLevel;
}

export type ReminderMode = 'interval' | 'random';

export interface Settings {
  remindersEnabled: boolean;
  mode: ReminderMode;
  /** Gap between reminders when mode is 'interval'. */
  intervalMinutes: number;
  /** Reminders only fire between these hours (24h clock). */
  activeStartHour: number;
  activeEndHour: number;
}

export interface DayLog {
  /** Local date as YYYY-MM-DD. Log resets when the day changes. */
  date: string;
  /** Each drink logged today, in ml. Kept as a list so the last one can be undone. */
  entries: number[];
}
