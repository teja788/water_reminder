/**
 * Custom product pages: the same captioned screenshots as the default page,
 * reordered to lead with what a search is looking for, plus the en-US keywords
 * that route that search to the page.
 *
 *   node store-assets/custom-pages.mjs build              # screenshots/ -> custom-pages/<page>/
 *   node store-assets/custom-pages.mjs push [--dry-run]   # create/update the pages in ASC
 *
 * Run capture-screenshots.mjs first. push creates drafts only: a page goes
 * live after App Review, so submit it with the version that ships its
 * features (the widget page shows 1.2.0's widget). Keywords must be in the
 * locale's keyword field; ASC rejects any that are not. Locales the app's
 * listing doesn't have yet are skipped: push the listing, then rerun push.
 */

import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const { createClient, scanShots } = await import(path.join(os.homedir(), '.claude/skills/ship-ios-app/release.mjs'));

const APP = '6801325939';
const PAGES = {
  widget: { name: 'Widget', order: ['02-widget', '01-home', '03-reminder', '04-history', '05-settings'], keywords: ['widget'] },
  reminder: { name: 'Reminder', order: ['03-reminder', '01-home', '02-widget', '04-history', '05-settings'], keywords: ['alarm', 'remind'] },
  habit: { name: 'Habit', order: ['04-history', '01-home', '02-widget', '03-reminder', '05-settings'], keywords: ['habit', 'streak'] },
};
const SRC = path.join(HERE, 'screenshots');
const OUT = path.join(HERE, 'custom-pages');

function build() {
  rmSync(OUT, { recursive: true, force: true });
  for (const [key, page] of Object.entries(PAGES)) {
    for (const locale of readdirSync(SRC).filter((n) => !n.startsWith('.'))) {
      for (const device of readdirSync(path.join(SRC, locale)).filter((n) => !n.startsWith('.'))) {
        const dir = path.join(OUT, key, locale, device);
        mkdirSync(dir, { recursive: true });
        page.order.forEach((shot, i) =>
          copyFileSync(path.join(SRC, locale, device, `${shot}.png`), path.join(dir, `${String(i + 1).padStart(2, '0')}-${shot.slice(3)}.png`)));
      }
    }
    const { sets, errors } = scanShots(path.join(OUT, key));
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`${key}: ${sets.length} sets`);
  }
}

async function waitForAsset(client, id, label) {
  if (client.dryRun) return;
  for (let i = 0; i < 200; i++) {
    const st = (await client.get(`/v1/appScreenshots/${id}?fields[appScreenshots]=assetDeliveryState`)).data.attributes.assetDeliveryState?.state;
    if (st === 'COMPLETE') return;
    if (st === 'FAILED') throw new Error(`${label}: processing FAILED`);
    await client.sleep(3000);
  }
  throw new Error(`${label}: still processing after 10 min`);
}

async function push(dryRun) {
  const client = createClient({ dryRun });
  const existing = (await client.getAll(`/v1/apps/${APP}/appCustomProductPages?limit=50`)).data;
  for (const [key, page] of Object.entries(PAGES)) {
    const { sets } = scanShots(path.join(OUT, key));
    const locales = [...new Set(sets.map((s) => s.locale))];
    let cpp = existing.find((p) => p.attributes.name === page.name);
    let versionId;
    if (cpp) {
      // Only a draft version takes edits; after approval, add a new version in ASC first.
      const draft = (await client.getAll(`/v1/appCustomProductPages/${cpp.id}/appCustomProductPageVersions`)).data
        .find((v) => v.attributes.state === 'PREPARE_FOR_SUBMISSION');
      if (!draft) throw new Error(`${page.name}: no editable (PREPARE_FOR_SUBMISSION) version`);
      versionId = draft.id;
    } else {
      const r = await client.write('POST', '/v1/appCustomProductPages', {
        data: { type: 'appCustomProductPages', attributes: { name: page.name },
          relationships: { app: { data: { type: 'apps', id: APP } },
            appCustomProductPageVersions: { data: [{ type: 'appCustomProductPageVersions', id: '${v}' }] } } },
        included: [
          { type: 'appCustomProductPageVersions', id: '${v}',
            relationships: { appCustomProductPageLocalizations: { data: [{ type: 'appCustomProductPageLocalizations', id: '${l}' }] } } },
          { type: 'appCustomProductPageLocalizations', id: '${l}', attributes: { locale: 'en-US' } },
        ],
      });
      cpp = r.data;
      versionId = dryRun ? 'DRYRUN-version' : r.data.relationships.appCustomProductPageVersions.data[0].id;
    }
    console.log(`${page.name}: ${cpp.attributes?.url ?? '(dry-run)'}`);
    const locs = dryRun && versionId.startsWith('DRYRUN') ? []
      : (await client.getAll(`/v1/appCustomProductPageVersions/${versionId}/appCustomProductPageLocalizations?limit=50`)).data;
    for (const locale of locales) {
      let loc = locs.find((l) => l.attributes.locale === locale);
      if (!loc) {
        try {
          const r = await client.write('POST', '/v1/appCustomProductPageLocalizations', { data: { type: 'appCustomProductPageLocalizations',
            attributes: { locale }, relationships: { appCustomProductPageVersion: { data: { type: 'appCustomProductPageVersions', id: versionId } } } } });
          loc = dryRun ? { id: `DRYRUN-${locale}` } : r.data;
        } catch (e) {
          // A page can only use locales the app's listing already has: push the listing, then rerun.
          if (e.status !== 409 || !/not available in your app/.test(e.message)) throw e;
          console.log(`  ${locale}: skipped, not an app localization yet`);
          continue;
        }
      }
      for (const s of sets.filter((x) => x.locale === locale)) {
        const remote = loc.id.startsWith('DRYRUN') ? []
          : (await client.getAll(`/v1/appCustomProductPageLocalizations/${loc.id}/appScreenshotSets?limit=50`)).data;
        let set = remote.find((x) => x.attributes.screenshotDisplayType === s.displayType);
        const shots = set ? (await client.getAll(`/v1/appScreenshotSets/${set.id}/appScreenshots?limit=50`)).data : [];
        if (shots.length === s.files.length && shots.every((e, i) => e.attributes.sourceFileChecksum === s.files[i].md5)) continue;
        // Our own draft page: replacing its screenshots touches nothing live.
        for (const e of shots) await client.write('DELETE', `/v1/appScreenshots/${e.id}`);
        if (!set) {
          const r = await client.write('POST', '/v1/appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: s.displayType },
            relationships: { appCustomProductPageLocalization: { data: { type: 'appCustomProductPageLocalizations', id: loc.id } } } } });
          set = r.data;
        }
        const ids = [];
        for (const f of s.files) {
          const buf = readFileSync(f.path);
          const shot = (await client.write('POST', '/v1/appScreenshots', { data: { type: 'appScreenshots', attributes: { fileName: f.name, fileSize: f.size },
            relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: set.id } } } } })).data;
          for (const op of shot.attributes.uploadOperations ?? []) await client.upload(op, buf, f.name);
          await client.write('PATCH', `/v1/appScreenshots/${shot.id}`, { data: { type: 'appScreenshots', id: shot.id, attributes: { uploaded: true, sourceFileChecksum: f.md5 } } });
          await waitForAsset(client, shot.id, `${key}/${locale}/${s.device}/${f.name}`);
          ids.push(shot.id);
        }
        await client.write('PATCH', `/v1/appScreenshotSets/${set.id}/relationships/appScreenshots`, { data: ids.map((id) => ({ type: 'appScreenshots', id })) });
        console.log(`  ${locale}/${s.device}: ${s.files.length} uploaded`);
      }
      if (locale === 'en-US') {
        try {
          await client.write('POST', `/v1/appCustomProductPageLocalizations/${loc.id}/relationships/searchKeywords`,
            { data: page.keywords.map((id) => ({ type: 'appKeywords', id })) });
          console.log(`  en-US keywords: ${page.keywords.join(', ')}`);
        } catch (e) {
          console.log(`  !! en-US keywords ${page.keywords.join(', ')} not assigned: ${e.message.slice(0, 300)}`);
          process.exitCode = 1;
        }
      }
    }
  }
}

const cmd = process.argv[2];
if (cmd === 'build') build();
else if (cmd === 'push') await push(process.argv.includes('--dry-run'));
else throw new Error('usage: custom-pages.mjs build | push [--dry-run]');
