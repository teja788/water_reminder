import { getCalendars, getLocales } from 'expo-localization';
import { Units } from '../types';
import { Strings, en } from './en';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { hi } from './hi';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { nl } from './nl';
import { pl } from './pl';
import { pt } from './pt';
import { tr } from './tr';
import { zh } from './zh';

/** zh is Traditional Chinese (zh-Hant), used for every Chinese locale. */
export const CATALOGS: Record<string, Strings> = {
  en, de, es, fr, hi, it, ja, ko, nl, pl, pt, tr, zh,
};
const FALLBACK = 'en';

function pickLanguage(): string {
  try {
    // getLocales() is the device's preference order, so the first catalog we
    // hold a translation for is the one the user most wants.
    for (const locale of getLocales()) {
      const code = locale.languageCode;
      if (code !== null && code in CATALOGS) {
        return code;
      }
    }
  } catch {
    // Never let locale detection stop the app from rendering.
  }
  return FALLBACK;
}

/**
 * The active catalog. Resolved once at import: iOS relaunches the app when its
 * language is changed, so this cannot go stale while the app is running, and
 * keeping it a plain constant spares every screen a context or a hook.
 */
/** Active catalog's language code, e.g. "de". */
export const lang: string = pickLanguage();
export const t: Strings = CATALOGS[lang] ?? en;

function deviceSetting<T>(read: () => T, fallback: T): T {
  try {
    return read();
  } catch {
    return fallback;
  }
}

/** oz (with weight in lb) for US-measurement devices, ml otherwise. */
export const defaultUnits: Units = deviceSetting(
  () => (getLocales()[0]?.measurementSystem === 'us' ? 'oz' : 'ml'),
  'ml'
);

const uses24h = deviceSetting(() => getCalendars()[0]?.uses24hourClock !== false, true);

/** "07:00", or "7 AM" (in the device's language) on a 12-hour clock. */
export function hourLabel(hour: number): string {
  return uses24h
    ? `${String(hour).padStart(2, '0')}:00`
    : new Date(2000, 0, 1, hour).toLocaleTimeString(undefined, { hour: 'numeric' });
}
