import { getLocales } from 'expo-localization';
import { Strings, en } from './en';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
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
  en, de, es, fr, it, ja, ko, nl, pl, pt, tr, zh,
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
