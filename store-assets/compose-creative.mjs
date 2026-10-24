/**
 * App Store creative assets (Oct 2026): product page header + search results.
 *
 *   node store-assets/compose-creative.mjs [locale ...]
 *
 * With locales given, only those search images are written (header untouched).
 *
 * header.png           3840x1646 (21:9), the bottle from the iPad Home frame, no text, all locales.
 * search-<locale>.png  3840x2560 (3:2), localized headline (captions "01-home") over
 *                      Home / widget / reminder frames in that language's UI.
 * Output: store-assets/creative/. Alpha is flattened (Apple rejects alpha).
 * Upload: APP=6801325939 VERSION=x.y.z node ~/.claude/skills/ship-ios-app/upload-creative.mjs
 * (only while that version is editable; once approved, submit them from the Asset Library).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright-core';

const root = path.dirname(fileURLToPath(import.meta.url));
const captions = JSON.parse(readFileSync(path.join(root, 'captions.json'), 'utf8'));
const { style } = captions;
const out = path.join(root, 'creative');
mkdirSync(out, { recursive: true });

const b64 = f => `data:image/png;base64,${readFileSync(f).toString('base64')}`;
const frames = path.join(root, 'screenshot-frames');
// caption locale -> translated-UI frames folder (en lives at the top level)
const frame = (locale, shot) => {
  const own = path.join(frames, locale.split('-')[0], 'iphone-6.5', shot + '.png');
  return existsSync(own) ? own : path.join(frames, 'iphone-6.5', shot + '.png');
};
const bg = `linear-gradient(${style.background[0]},${style.background[1]})`;

// iPad Home frame is 2048x2732; the bottle spans y ~435-1860, "1,750 ml" starts ~1900.
// Exact crop on the frame's own background colour, so no mask/fade is needed.
const header = `<style>
body{margin:0;width:3840px;height:1646px;overflow:hidden;background:rgb(247,250,253)}
div{position:absolute;left:896px;top:83px;width:2048px;height:1480px;
  background:url(${b64(path.join(frames, 'ipad-12.9', '01-home.png'))}) 0 -400px/2048px 2732px}
</style><div></div>`;

const search = locale => `<style>
body{margin:0;width:3840px;height:2560px;overflow:hidden;background:${bg};
  font-family:-apple-system,'Helvetica Neue','Hiragino Sans','Apple SD Gothic Neo','PingFang TC',sans-serif;color:${style.text}}
h1{position:absolute;top:220px;width:100%;margin:0;text-align:center;font-size:210px;font-weight:800;letter-spacing:-2px;white-space:nowrap}
.row{position:absolute;top:560px;width:100%;display:flex;justify-content:center;gap:170px}
img{height:1900px;border-radius:110px;border:22px solid ${style.text};box-shadow:0 40px 90px rgba(13,42,69,.28)}
</style>
<h1>${captions.captions[locale]['01-home']}</h1>
<div class=row>${['01-home', '02-widget', '03-reminder'].map(s => `<img src="${b64(frame(locale, s))}">`).join('')}</div>`;

const browser = await chromium.launch();
const shoot = async (html, w, h, file) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // one line, never over the phones: shrink a long headline until it fits
  await page.evaluate(() => {
    const h = document.querySelector('h1');
    for (let fs = 210; h && h.scrollWidth > 3600 && fs > 100; fs -= 6) h.style.fontSize = `${fs}px`;
  });
  await page.screenshot({ path: file });
  await page.close();
  execFileSync('python3', ['-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).convert("RGB").save(sys.argv[1])', file]);
};
const only = process.argv.slice(2);
for (const l of only) if (!captions.captions[l]) throw new Error(`no captions for ${l}`);
const locales = only.length ? only : Object.keys(captions.captions);
if (!only.length) await shoot(header, 3840, 1646, path.join(out, 'header.png'));
for (const locale of locales) await shoot(search(locale), 3840, 2560, path.join(out, `search-${locale}.png`));
await browser.close();
console.log(`wrote ${only.length ? '' : 'header + '}${locales.length} search assets to ${out}`);
