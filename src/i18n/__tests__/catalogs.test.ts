/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { en } from '../en';
import { de } from '../de';
import { es } from '../es';
import { fr } from '../fr';
import { it } from '../it';
import { ja } from '../ja';
import { ko } from '../ko';
import { nl } from '../nl';
import { pl } from '../pl';
import { pt } from '../pt';
import { tr } from '../tr';
import { zh } from '../zh';

// index.ts imports expo-localization, which needs the native runtime.
const CATALOGS = { en, de, es, fr, it, ja, ko, nl, pl, pt, tr, zh };

/** Distinct, greppable sample arguments; numbers sweep the plural forms. */
const NUMBERS = [0, 1, 2, 3, 5, 12, 22, 25, 101];
const STR = 'ARG_X';

function check(lang: string, path: string, value: unknown, base: unknown): void {
  const where = `${lang} ${path}`;
  if (typeof base === 'string') {
    assert.equal(typeof value, 'string', where);
    assert.ok((value as string).trim(), `${where} is empty`);
  } else if (typeof base === 'function') {
    assert.equal(typeof value, 'function', where);
    const fn = value as (...a: unknown[]) => string;
    const arity = (base as () => string).length;
    // Arguments are typed by name in en.ts: numbers for counts, booleans for
    // flags, strings for everything already formatted.
    const src = String(base);
    // esbuild drops the parens on one-argument arrows: `days => ...`.
    const params = /^\(?([^)=]*)\)?\s*=>/.exec(src)![1].split(',').map((p) => p.trim());
    const isNum = (p: string) => /^(days|hidden|index)$/.test(p);
    const isBool = (p: string) => /^(isToday|met)$/.test(p);
    const variants: unknown[][] = isNum(params[0])
      ? NUMBERS.map((n) => [n])
      : [[true, true], [false, false], [true, false]].map((flags) =>
          params.map((p, i) => (isBool(p) ? flags[i % 2] : `${STR}${i}`))
        );
    for (const args of variants) {
      const out = fn(...args.slice(0, arity));
      assert.equal(typeof out, 'string', where);
      assert.ok(out.trim(), `${where} empty for ${JSON.stringify(args)}`);
      args.forEach((a, i) => {
        if (typeof a === 'string') assert.ok(out.includes(a), `${where} drops argument ${params[i]}: ${out}`);
        if (typeof a === 'number') assert.ok(out.includes(String(a)), `${where} drops ${a}: ${out}`);
      });
    }
  } else if (Array.isArray(base)) {
    assert.ok(Array.isArray(value), where);
    assert.equal((value as unknown[]).length, base.length, `${where} length`);
    base.forEach((b, i) => check(lang, `${path}[${i}]`, (value as unknown[])[i], b));
  } else if (base && typeof base === 'object') {
    assert.deepEqual(Object.keys(value as object).sort(), Object.keys(base).sort(), `${where} keys`);
    for (const k of Object.keys(base)) {
      check(lang, path ? `${path}.${k}` : k, (value as Record<string, unknown>)[k], (base as Record<string, unknown>)[k]);
    }
  }
}

test('every catalog matches English: keys, non-empty, keeps every argument', () => {
  for (const [lang, catalog] of Object.entries(CATALOGS)) {
    check(lang, '', catalog, en);
  }
});

test('the widget template survives a placeholder round trip', () => {
  for (const [lang, catalog] of Object.entries(CATALOGS)) {
    assert.ok(catalog.widget.toGo('{n}').includes('{n}'), lang);
  }
});
