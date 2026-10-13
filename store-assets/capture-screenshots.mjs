/**
 * App Store screenshots for Sip: five shots, iPhone 6.9" + 6.5" + iPad 12.9", in every
 * UI language, then captioned per store locale from captions.json.
 *
 *   CI=1 npx expo start --web --port 8091      # in another terminal
 *   node store-assets/capture-screenshots.mjs [--lang=de,ja] [--device=iphone-6.9] [--no-compose]
 *   node store-assets/capture-screenshots.mjs compose   # captions only
 *
 * Needs the shared Playwright Chromium (`npx playwright@1.47.0 install chromium`).
 *   (react-native-web and playwright-core are devDependencies)
 *
 * Stage 1 drives the Expo web build in headless Chromium: the browser locale
 * picks the app's catalog, demo data is seeded into localStorage (the web
 * AsyncStorage backend), the clock is frozen on a Thursday afternoon. Frames go
 * to screenshot-frames/<lang>/<device>/ (en: screenshot-frames/<device>/).
 * - 03-reminder overlays an iOS-style notification, drawn in HTML from the
 *   catalog's own notification strings, over Home.
 * - 02-widget is drawn in HTML too, mirroring src/widgets/SipWidget.tsx.
 *   ponytail: a render, not a capture (no iOS 17 simulator here); swap in a
 *   real iPad capture from TestFlight if the layout drifts.
 * Stage 2 is the ship-ios-app skill's compose-screenshots.mjs ->
 * screenshots/<locale>/<device>/, ready for `release.mjs screenshots`.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright-core';
import { require as tsxRequire } from 'tsx/cjs/api';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SIP_URL ?? 'http://localhost:8091';
const COMPOSE = path.join(os.homedir(), '.claude/skills/ship-ios-app/compose-screenshots.mjs');

const LANGS = { en: 'en-US', de: 'de-DE', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', ja: 'ja-JP',
  ko: 'ko-KR', nl: 'nl-NL', pl: 'pl-PL', pt: 'pt-BR', tr: 'tr-TR', zh: 'zh-TW' };
const DEVICES = {
  'iphone-6.9': { viewport: { width: 440, height: 956 }, deviceScaleFactor: 3 },
  'iphone-6.5': { viewport: { width: 428, height: 926 }, deviceScaleFactor: 3 },
  'ipad-12.9': { viewport: { width: 1024, height: 1366 }, deviceScaleFactor: 2 },
};

/** Thursday 15 Oct 2026, 14:20 local. */
const NOW = new Date(2026, 9, 15, 14, 20);
const SETTINGS = { weightKg: 72, activity: 'moderate', goalMl: 2600, units: 'ml',
  wakeMinutes: 420, sleepMinutes: 1320, cupSizesMl: [150, 250, 500], defaultCupMl: 250,
  remindersEnabled: true };
const TODAY = [[8, 5, 250], [9, 40, 500], [11, 15, 250], [12, 30, 250], [13, 50, 500]]; // 1,750 ml
/** Totals for yesterday backwards: 9 days met (the streak), then a miss. */
const PAST = [2650, 2900, 2750, 3100, 2600, 2800, 2900, 2700, 2650, 2100, 2800, 2600, 1900,
  2750, 2650, 2400, 2900, 2600, 2300, 2700, 2650, 2800, 2200];

function entries() {
  const out = [];
  const add = (d, h, m, ml) => {
    const ts = new Date(2026, 9, 15 - d, h, m).getTime();
    out.push({ id: `${ts}-demo`, timestamp: ts, amountMl: ml });
  };
  TODAY.forEach(([h, m, ml]) => add(0, h, m, ml));
  PAST.forEach((total, i) => {
    for (let left = total, h = 8; left > 0; h += 1.5) {
      const ml = Math.min(left, 500);
      add(i + 1, Math.floor(h), (h % 1) * 60, ml);
      left -= ml;
    }
  });
  return out.sort((a, b) => a.timestamp - b.timestamp);
}

const catalog = (lang) => tsxRequire(`../src/i18n/${lang}.ts`, import.meta.url)[lang];
const ICON = `data:image/png;base64,${readFileSync(path.join(HERE, '../assets/icon.png')).toString('base64')}`;

/** iOS-style expanded notification with the app's two actions. */
function bannerHtml(t, locale) {
  const [title, body] = t.notifications.messages[0];
  const action = (label) =>
    `<div style="border-top:1px solid rgba(60,60,67,.18);padding:13px 0;text-align:center;color:#0A6CD6;font-size:17px">${label}</div>`;
  return `<div id="sip-banner" style="position:fixed;top:14px;left:12px;right:12px;max-width:420px;margin:0 auto;z-index:9999;
    background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);border-radius:22px;box-shadow:0 10px 34px rgba(13,42,69,.22);
    font-family:-apple-system,system-ui,sans-serif;color:#000;overflow:hidden">
    <div style="display:flex;gap:12px;padding:14px 16px;align-items:center">
      <img src="${ICON}" style="width:40px;height:40px;border-radius:9px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;gap:8px">
          <b style="font-size:16px">${title}</b>
          <span style="font-size:14px;color:#8a8a8e">${new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'second')}</span>
        </div>
        <div style="font-size:15px;margin-top:2px">${body}</div>
      </div>
    </div>
    ${action(t.notifications.quickLog('250 ml'))}${action(t.notifications.snooze)}
  </div>`;
}

/** Lock Screen + Home Screen widgets, mirroring SipWidget.tsx. */
function widgetHtml(t, locale, tablet) {
  const amount = (ml) => `${ml.toLocaleString(locale)} ml`;
  const total = 1750;
  const goal = 2600;
  const pct = Math.round((total / goal) * 100);
  const status = t.widget.toGo('{n}').replace('{n}', amount(goal - total));
  const date = NOW.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const ring = (r, w) => {
    const c = 2 * Math.PI * r;
    return `<svg width="${2 * r + w}" height="${2 * r + w}" style="position:absolute;inset:0">
      <circle cx="${r + w / 2}" cy="${r + w / 2}" r="${r}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="${w}"/>
      <circle cx="${r + w / 2}" cy="${r + w / 2}" r="${r}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round"
        stroke-dasharray="${(c * pct) / 100} ${c}" transform="rotate(-90 ${r + w / 2} ${r + w / 2})"/></svg>`;
  };
  const bar = (bg, fg) =>
    `<div style="height:6px;border-radius:3px;background:${bg}"><div style="width:${pct}%;height:100%;border-radius:3px;background:${fg}"></div></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;height:100vh;overflow:hidden;font-family:-apple-system,system-ui,sans-serif;
    background:radial-gradient(120% 70% at 30% 10%,#7CC4F2 0%,#2F86D0 45%,#0D3B6E 100%);color:#fff">
  <div style="width:428px;margin:0 auto;padding-top:64px;zoom:${tablet ? 1.9 : 1};display:flex;flex-direction:column;align-items:center">
    <div style="font-size:21px;font-weight:600;opacity:.9">${date}</div>
    <div style="font-size:100px;font-weight:700;letter-spacing:-2px;line-height:1.05;font-feature-settings:'tnum'">9:41</div>
    <div style="display:flex;gap:14px;margin-top:14px;align-items:center">
      <div style="position:relative;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center">
        ${ring(29, 6)}<span style="font-size:17px;font-weight:700">${pct}%</span>
      </div>
      <div style="width:176px;height:70px;border-radius:16px;background:rgba(255,255,255,.14);padding:8px 12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
        <b style="font-size:17px">${amount(total)}</b>
        <span style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${status}</span>
        ${bar('rgba(255,255,255,.3)', '#fff')}
      </div>
    </div>
    <div style="margin-top:72px;width:170px;height:170px;zoom:1.6;border-radius:22px;background:#F7FAFD;color:#0D1B2A;
      box-shadow:0 18px 40px rgba(0,0,0,.28);padding:16px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
      <div>
        <div style="font-size:26px;font-weight:700;font-family:ui-rounded,-apple-system,system-ui;line-height:1">${amount(total)}</div>
        <div style="font-size:12px;color:#6B7785;margin-top:2px;white-space:nowrap;overflow:hidden">${t.bottle.ofGoal(amount(goal))}</div>
      </div>
      ${bar('rgba(30,136,229,.2)', '#1E88E5')}
      <div style="font-size:11px;white-space:nowrap;overflow:hidden">${status}</div>
      <div style="align-self:flex-start;background:#1E88E5;color:#fff;font-size:15px;font-weight:600;border-radius:999px;padding:6px 14px">${t.widget.add('250 ml')}</div>
    </div>
  </div></body></html>`;
}

async function shoot(browser, lang, device) {
  const t = catalog(lang);
  const locale = LANGS[lang];
  const dir = path.join(HERE, 'screenshot-frames', lang === 'en' ? '' : lang, device);
  await mkdir(dir, { recursive: true });
  const ctx = await browser.newContext({ ...DEVICES[device], locale, colorScheme: 'light' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error(`${lang}/${device}: ${e.message}`));
  await page.clock.setFixedTime(NOW);
  const seed = { 'wr:settings': JSON.stringify(SETTINGS), 'wr:entries': JSON.stringify(entries()),
    'wr:review': JSON.stringify({ lastPromptedAt: NOW.getTime() }) };
  // Headless Chromium reports notifications as denied; the app would then
  // switch reminders off and Home would read "Reminders are off".
  await page.addInitScript(() => Object.defineProperty(Notification, 'permission', { get: () => 'granted' }));
  await page.addInitScript((s) => Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)), seed);
  await page.goto(BASE, { timeout: 300_000 });
  const tabs = page.getByRole('tab');
  await tabs.first().waitFor({ timeout: 120_000 });
  // <input> keeps its intrinsic width as a flex item, so the three cup fields
  // overflow their card on web; iOS lays them out as flex: 1.
  await page.addStyleTag({ content: 'input { min-width: 0; }' });
  const snap = async (name) => {
    await page.waitForTimeout(2500); // bottle fill animation
    // react-native-web ignores adjustsFontSizeToFit and ellipsizes "67%" to
    // "6…"; shrink it the way iOS does.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('div[dir="auto"]')) {
        if (!/^\d+%$/.test(el.textContent)) continue;
        let size = parseFloat(getComputedStyle(el).fontSize);
        while (el.scrollWidth > el.clientWidth && size > 12) el.style.fontSize = `${(size -= 2)}px`;
      }
    });
    await page.screenshot({ path: path.join(dir, `${name}.png`) });
  };

  await snap('01-home');
  await page.evaluate((html) => document.body.insertAdjacentHTML('beforeend', html), bannerHtml(t, locale));
  await snap('03-reminder');
  await page.evaluate(() => document.getElementById('sip-banner').remove());
  await tabs.nth(1).click();
  await snap('04-history');
  await tabs.nth(2).click();
  await snap('05-settings');
  await page.setContent(widgetHtml(t, locale, device.startsWith('ipad')));
  await snap('02-widget');
  await ctx.close();
  console.log(`${lang}/${device} done`);
}

function compose() {
  execFileSync('node', [COMPOSE, '--frames', path.join(HERE, 'screenshot-frames'),
    '--captions', path.join(HERE, 'captions.json'), '--out', path.join(HERE, 'screenshots')],
  { stdio: 'inherit' });
}

if (process.argv[2] === 'compose') {
  compose();
} else {
  const only = process.argv.find((a) => a.startsWith('--lang='))?.slice(7).split(',');
  const browser = await chromium.launch();
  for (const lang of only ?? Object.keys(LANGS)) {
    const devices = process.argv.find((a) => a.startsWith('--device='))?.slice(9).split(',');
    for (const device of devices ?? Object.keys(DEVICES)) {
      await shoot(browser, lang, device);
    }
  }
  await browser.close();
  if (!process.argv.includes('--no-compose')) compose();
}
