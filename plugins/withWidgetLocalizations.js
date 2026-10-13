/**
 * Translates the widget's gallery description. expo-widgets writes it into
 * Swift as a string literal (`.description("…")`), which SwiftUI looks up in
 * the extension's Localizable.strings — so this adds <lang>.lproj files and a
 * Resources phase to the widget target. Keep KEY equal to the `description`
 * of SipWidget in app.json. The display name ("Sip") is a brand: not translated.
 */
const { withDangerousMod, withXcodeProject } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TARGET = 'ExpoWidgetsTarget'; // expo-widgets' extension target name
const DIR = 'SipWidgetStrings'; // outside TARGET: expo-widgets wipes that folder
const KEY = "Today's water at a glance. Tap to log a cup.";
const STRINGS = {
  en: KEY,
  de: 'Dein Wasser heute auf einen Blick. Tippen, um ein Glas einzutragen.',
  es: 'Tu agua de hoy de un vistazo. Toca para registrar un vaso.',
  fr: 'Ton eau du jour en un coup d’œil. Touche pour ajouter un verre.',
  it: 'L’acqua di oggi a colpo d’occhio. Tocca per registrare un bicchiere.',
  ja: '今日の水分をひと目で。タップで1杯記録。',
  ko: '오늘 마신 물을 한눈에. 탭해서 한 잔 기록하세요.',
  nl: 'Je water van vandaag in één oogopslag. Tik om een glas te noteren.',
  pl: 'Dzisiejsza woda w skrócie. Stuknij, aby zapisać szklankę.',
  'pt-BR': 'Sua água de hoje num relance. Toque para registrar um copo.',
  tr: 'Bugünkü suyun bir bakışta. Bir bardak eklemek için dokun.',
  'zh-Hant': '今天的飲水一目了然。點一下即可記錄一杯。',
};

const quote = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

function withStringsFiles(config) {
  return withDangerousMod(config, [
    'ios',
    async (c) => {
      for (const [lang, text] of Object.entries(STRINGS)) {
        const dir = path.join(c.modRequest.platformProjectRoot, DIR, `${lang}.lproj`);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'Localizable.strings'), `${quote(KEY)} = ${quote(text)};\n`);
      }
      return c;
    },
  ]);
}

function withResources(config) {
  return withXcodeProject(config, (c) => {
    const proj = c.modResults;
    const objects = proj.hash.project.objects;
    const targetKey = proj.findTargetKey(TARGET);
    if (!targetKey) {
      throw new Error(`withWidgetLocalizations: no "${TARGET}" target (list this plugin BEFORE expo-widgets: later plugins edit the project first)`);
    }
    const target = objects.PBXNativeTarget[targetKey];
    if (target.buildPhases.some((p) => p.comment === 'Resources')) {
      return c; // already added (prebuild without --clean)
    }
    const add = (section, obj, comment) => {
      const id = proj.generateUuid();
      objects[section] = objects[section] ?? {};
      objects[section][id] = obj;
      objects[section][`${id}_comment`] = comment;
      return id;
    };
    const langs = Object.keys(STRINGS);
    const refs = langs.map((lang) => ({
      value: add('PBXFileReference', { isa: 'PBXFileReference', lastKnownFileType: 'text.plist.strings',
        name: lang, path: `${lang}.lproj/Localizable.strings`, sourceTree: '"<group>"' }, lang),
      comment: lang,
    }));
    const variant = add('PBXVariantGroup', { isa: 'PBXVariantGroup', children: refs,
      name: 'Localizable.strings', sourceTree: '"<group>"' }, 'Localizable.strings');
    const group = add('PBXGroup', { isa: 'PBXGroup', children: [{ value: variant, comment: 'Localizable.strings' }],
      path: DIR, sourceTree: '"<group>"' }, DIR);
    const root = objects.PBXProject[proj.hash.project.rootObject];
    objects.PBXGroup[root.mainGroup].children.push({ value: group, comment: DIR });
    const buildFile = add('PBXBuildFile', { isa: 'PBXBuildFile', fileRef: variant,
      fileRef_comment: 'Localizable.strings' }, 'Localizable.strings in Resources');
    const phase = add('PBXResourcesBuildPhase', { isa: 'PBXResourcesBuildPhase', buildActionMask: 2147483647,
      files: [{ value: buildFile, comment: 'Localizable.strings in Resources' }],
      runOnlyForDeploymentPostprocessing: 0 }, 'Resources');
    target.buildPhases.push({ value: phase, comment: 'Resources' });
    root.knownRegions = [...new Set([...(root.knownRegions ?? []), ...langs])];
    return c;
  });
}

module.exports = (config) => withResources(withStringsFiles(config));
