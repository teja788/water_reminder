# Localization plan

Written 2026-09-20. Companion to [aso-plan.md](aso-plan.md), which covers the
*cross-localization* trick (English metadata parked in a foreign locale slot for
keyword indexing). **This file is about real localization**: a translated app
and a translated listing, for people who actually speak the language.

The two are unrelated jobs with unrelated payoffs. Don't confuse them:

| | Cross-localization | Real localization |
|---|---|---|
| Purpose | Extra indexed keyword field | Serve a market |
| Metadata language | English | The target language |
| App UI | Untouched | Translated |
| Effort per locale | ~10 min | ~half a day |
| Covered in | `aso-plan.md` | this file |

---

## The steps, in order

Worked through with German as the example. Every step is the same for any
language; only step 6 varies in difficulty.

### 1. Write the catalog — ~2 hours

Create `src/i18n/de.ts` implementing the `Strings` type, then add it to
`CATALOGS` in `src/i18n/index.ts`:

```ts
import { de } from './de';
const CATALOGS: Record<string, Strings> = { en, de };
```

108 entries. TypeScript refuses to compile an incomplete catalog, so there is no
way to half-finish this silently. Device language resolves at import via
`getLocales()`; nothing else in the app changes.

### 2. Declare the language to iOS — 5 minutes, and easy to miss

JS-side i18n is invisible to iOS. Without this step the App Store product page
still reads **Languages: English**, and German users never see German offered in
iOS Settings → Sip → Language.

The `expo-localization` config plugin takes `supportedLocales` and writes it to
`CFBundleLocalizations` (confirmed in the installed plugin source,
`node_modules/expo-localization/plugin/build/withExpoLocalization.js`):

```json
["expo-localization", { "supportedLocales": ["en", "de"] }]
```

Native change — needs a build, cannot ship over OTA.

### 3. German metadata in App Store Connect — ~1 hour

Name, subtitle, keyword field, description, What's New — actually in German.

The keyword field here is **real German search terms**, not the English padding
used for es-MX/pt-BR/fr. German users type German. Same rules otherwise: 100
characters, comma-separated, no spaces, singular, no overlap with the German
name and subtitle.

### 4. German screenshot captions — ~1 hour

Optional: a locale with no screenshots inherits the primary language's. But
captions are the highest-converting text on a product page, and English captions
under a German listing undercut everything else on it.

The pipeline is `compose.js` in `~/Downloads/water-reminder-screenshots-v2/`.
Captions render as SVG text, so this is a string swap and a re-run. Note the
pipeline needs `sharp` installed into a temp dir and passed as `argv[2]`, and
that composed SVG cannot carry emoji (librsvg has no colour emoji font).

### 5. Decide about the linked web page — 30 minutes or skip

The intake notice links to `hydration.html` on GitHub Pages. A German user
tapping "Why this matters" lands in English. Either add `hydration.de.html` and
branch the URL on the active language, or accept the English page. Remember the
site is served from the **`gh-pages` branch root**, not `site/`.

### 6. Get a native speaker to read two blocks — the real gate

Everything mechanical (`Einstellungen`, `Tagesziel`, `Aktivitätslevel`)
translates fine. Two blocks do not:

- **`notifications.messages`** — eight idiomatic pairs. "Water o'clock" and
  "Keep it flowing" have no German equivalent. They need rewriting so the app
  has a voice in German instead of a translation accent. These are also the
  strings users see most often, because they arrive as notifications.
- **`notice.*`** — the hyponatremia copy. Medical guidance rendered clumsily is
  worse than a clumsy button label.

Both are commented as such in `src/i18n/en.ts`.

---

## Already handled — no work needed

Dates, times and number formatting all follow the device locale already. Every
call site passes `undefined` as the locale argument:

- `toLocaleDateString(undefined, { weekday: 'long', … })` — `src/screens/HomeScreen.tsx`, `HistoryScreen.tsx`
- `toLocaleTimeString(undefined, { hour: 'numeric', … })` — `src/screens/HomeScreen.tsx`
- `toLocaleString()` on amounts — `src/logic/hydration.ts`

A German device already renders "Samstag, 20. September" and "2.600 ml" with the
right separator. This was not deliberate foresight, but it is correct, and it
should stay that way — never hardcode `'en-US'` into these calls.

---

## German metadata — first draft

Drafted 2026-09-20. **Every line here needs a native speaker's eye before it
ships** — these are plausible, not verified.

**Name — 29/30**
```
Sip: Wasser & Trinkerinnerung
```
Alternatives: `Sip: Trinkerinnerung Tracker` (28), `Sip: Wassertracker & Wecker` (27).

**Subtitle — 28/30**
```
Trinkmenge täglich verfolgen
```
Alternative carrying the anti-nag positioning: `Dein Trinkziel, ohne Nerven`
(27). That one is the most idiomatic and therefore the one most likely to be
subtly wrong — check it first.

**Keyword field — 97/100**
```
durst,glas,flasche,liter,ziel,gesundheit,protokoll,hydration,flüssigkeit,tracker,alarm,gewohnheit
```
Zero overlap with the German name and subtitle. Unlike the es-MX/pt-BR/fr
fields, these are genuine German search terms — German users type German, so
there is no English-padding trick to play here.

Description and What's New still to write.

# Which languages to target — analysis

Researched 2026-09-20 from Apple's own locale table, AppTweak/Sensor Tower
market data, StatCounter OS share, and the EF English Proficiency Index 2025.

## First, what is actually known — and what isn't

**There is no trustworthy number for what localization buys you.** The figure
everyone quotes (+128% downloads) comes from a single Distimo study from 2012
with no control group, and it measured *app* localization, not listing-only.
Its iPad half — never quoted by anyone — showed **zero** download growth.
Everything else in circulation (+767%, +38%, "up to 30% higher installs") is a
single-app anecdote or untraceable vendor marketing. Distimo's own caveat:
"whether the increase … is caused by the introduction of the native languages
only is hard to tell."

So: decide this on market structure and English proficiency, which *are*
measured, and ignore anyone's lift percentage.

**What is solidly established:** Japan, China and South Korea reject
English-only apps far more strongly than European markets do. That is the one
claim where the 2012 per-country data, the CSA Research consumer survey, and the
EF index all agree independently.

## The table

iOS download share is Nov 2024–Nov 2025 (AppTweak, iOS only). EPI is EF 2025 —
lower means an English-only app blocks more people. iOS share is StatCounter
Aug 2026, pageview-weighted so it over-reads iPhone somewhat.

| Language | iOS downloads | EPI | iOS share | Addressable? |
|---|---|---|---|---|
| Chinese (Simp.) | 13.8% (#2) | 464 Low | 28.6% | **No** — needs ICP filing + a Chinese legal entity |
| Japanese | 4.7% (#3) | **446 Very Low** | 64.7% | Yes |
| Portuguese (BR) | 4.5% (#4, +18%) | 482 Low | 24.5% | Yes |
| Russian | 3.6% (#7) | 521 Moderate | 30.8% | Yes for a *free* app — Apple switched off App Store payments in Russia in April 2026, downloads continue |
| German | 2.9% (#8) | **615 Very High** | 27.5% | Yes |
| Vietnamese | 2.8% (#9, +18%) | 500 Moderate | 42.6% | Yes |
| French | 2.8% (#10) | 539 Moderate | 36.3% | Yes — also covers Belgium, Switzerland, Canada, much of Africa |
| Spanish (MX) | outside top 10 | **440 Very Low** | 34.0% | Yes — and doubles as the US keyword slot |
| Spanish (ES) | outside top 10 | 540 Moderate | 31.4% | Yes |
| Italian | outside top 10 | 513 Moderate | 35.0% | Yes |
| Korean | outside top 10 | 522 Moderate | 35.5% | Yes — #4 by revenue |
| Hindi + 10 Indic | 3.7% (#6, +22%) | 484 Low | **7.2%** | Yes, but India's storefront default is English (U.K.) already |

## What this means for Sip specifically

**Sip is free with no IAP, so revenue rankings do not apply.** Every revenue
argument for a language — Germany's price tolerance, Japan's spend per user,
Korea's ARPU — is irrelevant until there is something to sell. What
localization buys this app is *users*, and the ranking for users is different.

That inverts the conventional answer:

**German is a weak first choice for this app.** Germany sits in the EF index's
Very High band (615, 4th in the world) — German users read an English UI
perfectly well. The standard reason to prioritise German is willingness to pay,
and this app has nothing to charge for. It is a fine third or fourth language;
it is not the obvious first one.

**Ranked for a free app, by reach per afternoon:**

1. **Spanish** — widest reach of any single language. Mexico is Very Low EPI
   (440), so the English listing is genuinely failing there today, and es-MX is
   already going in for keyword reasons. Doing it properly costs one extra
   afternoon and serves a real market rather than parking English in the slot.
2. **Portuguese (Brazil)** — 4.5% of iOS downloads and growing 18% a year, Low
   EPI, also already going in for keyword reasons. Same argument as Spanish.
3. **Japanese** — the highest-value single localization by market structure:
   #3 in downloads, 64.7% iOS share, and the lowest English proficiency of any
   large market. Also the hardest to do well, and the market least forgiving of
   a bad job. Only worth attempting with a real Japanese speaker.
4. **French** — one catalog covers France, Belgium, Switzerland, Canada and
   much of Africa. Best coverage-per-unit-of-work in Europe.
5. **German** — do it when there is something to monetise.

**Rule out Chinese** despite it being #2 by downloads: the mainland App Store
has required an ICP filing since 2023, which needs a Chinese legal entity. Keep
zh-Hans as a US keyword slot only.

**India is a special case** — #6 in iOS downloads and growing fastest (+22%),
but iOS share is 7.2%, and Apple changed India's storefront default to English
(U.K.) in 2026 while adding 11 Indic localizations. English already works there.

## Ship the first language in v1.2, not v1.1

Recommendation, and the reasoning matters more than the verdict:

1. **v1.1's payload is the rating prompt.** Zero ratings is the actual
   bottleneck — it gates Reddit, it gates conversion, it gates ranking. Anything
   that delays v1.1 delays that.
2. **A native-speaker review is an unbounded dependency.** There is nobody lined
   up. Blocking the release on finding one trades a known win for an unknown
   wait.
3. **Nothing is wasted by waiting.** `supportedLocales` is a native change that
   needs a build — but v1.2 needs a build anyway. Deferring costs one extra
   review cycle, which is free and automatic.
4. **v1.1 is already a five-variable change** — rating prompt, intake notices,
   new title, new subtitle, new keyword field, three new localizations. Adding a
   first foreign language makes the result unreadable.
5. **App Review surface.** v1.1 already adds three localizations whose visible
   fields need care under Guideline 2.3.7. Do not stack a fourth on a version
   you want approved quickly.

**Sequence:** v1.1 ships the rating prompt and the metadata. v1.2 ships Spanish
and Portuguese properly — both listings are already being created for keyword
reasons, so the marginal cost is translating what is already there plus one
catalog file each. v1.3 or later: French, Japanese, German.
