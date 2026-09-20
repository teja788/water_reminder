import { getLocales } from 'expo-localization';
import { Strings, en } from './en';

const CATALOGS: Record<string, Strings> = { en };
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
export const t: Strings = CATALOGS[pickLanguage()] ?? en;
