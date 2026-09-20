# ASO plan — Sip (App ID 6801325939)

Written 2026-09-20 using the `aso-audit`, `keyword-research` and
`metadata-optimization` skills (appeeky/aso-skills, already installed at
`~/.claude/skills/`). Companion to [marketing-plan.md](marketing-plan.md);
listing copy of record stays [store-listing.md](store-listing.md).

Live state pulled from the iTunes lookup API on 2026-09-20:
v1.0.1, released 2026-09-18, **0 ratings**, Health & Fitness / Lifestyle, free.

---

## ASO score: 42/100

```
Title:              5/10  █████░░░░░
Subtitle:           4/10  ████░░░░░░
Keyword Field:      3/10  ███░░░░░░░
Description:        8/10  ████████░░
Screenshots:        8/10  ████████░░
Preview Video:      0/10  ░░░░░░░░░░
Ratings & Reviews:  0/10  ░░░░░░░░░░
Icon:               7/10  ███████░░░
Keyword Rankings:   1/10  █░░░░░░░░░
Conversion Signals: 2/10  ██░░░░░░░░
```

### Where the points are lost

**Keyword cannibalisation is the biggest self-inflicted wound.** The keyword
field repeats seven words already in the title and subtitle — `water`,
`tracker`, `drink`, `reminder`, `hydration`, `goal`, `daily`. Apple indexes
title + subtitle + keyword field as one pool, so those repeats buy nothing.
About 55 of the 93 characters are dead. `no ads` also wastes a character on the
space and uses a plural.

**"Calm" has no search volume.** It is the one differentiating word in the
title and nobody types it. Meanwhile `tracker` — present in 5 of the top 8
results for every head term — is missing from the title entirely.

**Zero ratings, and not ranked for anything.** Checked against the search API:
Sip is not in the top 25 for `calm water reminder`, `gentle water reminder`,
`water reminder private`, `simple water tracker` — or for `sip water`, where
five *other* apps named Sip take the top five slots.

**The brand name is not ownable.** "Sip - Water Tracker", "Sip: Water Tracker &
Reminder", "Sip Water: Drink Reminder", "Daily Sip - Water Tracker" and
"Sip - Water Reminder" all already exist and all outrank us on our own name.
Sip cannot be a brand-search asset. Treat it as a label and spend the title's
characters on keywords instead.

---

## Recommended metadata

All three fields need a new version — they ride with v1.1.

### Title — 29/30

```
Sip: Water Tracker & Reminder
```

Covers `sip`, `water`, `tracker`, `reminder`. Drops `calm` (zero volume), gains
`tracker` (highest-volume co-word in the niche), uses 4 more characters.

- Alt A — `Sip: Water Reminder Tracker` (27) — same words, no ampersand.
- Alt B — `Water Reminder & Tracker: Sip` (29) — keyword-first. Slightly better
  for search, worse for brand recall. Worth it only if the brand is abandoned.

### Subtitle — 29/30

```
Drink up: daily hydration log
```

Adds `drink`, `daily`, `hydration`, `log` with zero overlap against the title.
The current subtitle repeats `reminder` from the title outright.

- Alt A — `Daily drink goals, no nagging` (29) — keeps the positioning wedge,
  trades `hydration` and `log` for `goals` and `nagging`.
- Alt B — `Hydration log & drink goals` (27).

### Keyword field — 100/100

```
intake,hydrate,thirst,habit,streak,bottle,glass,cup,h2o,aqua,oz,ml,ounce,alarm,remind,health,private
```

No repeats against title or subtitle, all singular, no spaces, no brand or
category names, exactly 100 characters.

### Keyword coverage

| Keyword | Title | Subtitle | Field |
|---|---|---|---|
| water, tracker, reminder | ✓ | | |
| drink, daily, hydration, log | | ✓ | |
| intake, hydrate, thirst, habit, streak | | | ✓ |
| bottle, glass, cup, h2o, aqua, oz, ml, ounce | | | ✓ |
| alarm, remind, health, private | | | ✓ |

### Before / after

| Field | Current | Recommended | Gain |
|---|---|---|---|
| Title | Sip — Calm Water Reminder (25) | Sip: Water Tracker & Reminder (29) | +`tracker`, −dead `calm` |
| Subtitle | Reminders that stop at goal (27) | Drink up: daily hydration log (29) | +4 words, −1 duplicate |
| Keyword field | 93 chars, ~55 wasted | 100 chars, 0 wasted | ~17 new indexed terms |

---

## Localization: cross-localize, don't chase English variants

Only Promotional Text is editable on a live version. Keywords, subtitle and
description all force a new version, so every field below rides with v1.1.

**Do not add en-GB / en-AU / en-CA.** The US storefront does not index them, so
they buy nothing in the biggest market — and UK/AU/CA searchers already fall
back to the en-US metadata. (An earlier draft of this plan recommended them.
It was wrong.)

**Add Spanish (Mexico) instead.** The US storefront indexes English (US) *plus*
Spanish (Mexico), Russian, Chinese (Simplified), Arabic, French, Korean,
Portuguese (Brazil) and Vietnamese. So an es-MX localization gives you a second
100-character keyword field indexed *in the US*, free.

**Write the es-MX title, subtitle and description in English.** A Spanish-locale
user already falls back to the en-US listing today, so an English es-MX listing
is not a regression — while the keyword field, which no user ever sees, gets
indexed in the US. This sidesteps the usual localization trap, where localized
metadata over an English-only UI earns one-star reviews from people who
downloaded something they cannot read.

### How many locales to add: three, not eight

Eight locales are US-indexed, but **you run out of keywords long before you run
out of fields.** Counting every term this app can honestly claim, the inventory
fills four fields and no more. The fifth onward would be padded with words that
do not describe the app — and Apple weights relevance, so irrelevant terms pull
in traffic that does not convert, and conversion feeds back into rank.

So: **es-MX with v1.1, then pt-BR and fr with v1.2.** For US indexing the eight
are interchangeable; the tiebreak is which also serve a real market. `fr` is
indexed in Canada too (Canada indexes English + French) and covers France,
Belgium and Switzerland. `pt-BR` is Brazil, large by install volume. Arabic,
Korean, Vietnamese and Chinese are real markets that need the app actually
translated, not just the metadata — and Arabic is RTL, so English metadata there
renders awkwardly.

Per-locale effort is about ten minutes: adding a localization copies screenshots
and every other property from the primary language, leaving only the description
and keyword field to fill. Set the description to the English one.

### The four keyword fields

Each is exactly at or under 100 characters with **zero overlap against the
title, the subtitle, or any other field** — overlap is what wastes the trick.
73 distinct indexed terms in total, against 26 from the en-US listing alone.

**en-US — 100/100**
```
intake,hydrate,thirst,habit,streak,bottle,glass,cup,h2o,aqua,oz,ml,ounce,alarm,remind,health,private
```

**es-MX — 100/100** · measurement and positioning
```
counter,journal,liter,gallon,refill,hourly,timer,chart,goal,weight,fitness,wellness,diet,calm,gentle
```
`calm` and `gentle` live here rather than in the title: they carry the
positioning but too little search volume to spend title characters on, and cost
nothing in a field that would otherwise go unused.

**pt-BR — 98/100** · benefit and context
```
soda,quit,sugar,detox,kidney,skin,energy,workout,gym,sport,run,summer,heat,fatigue,hike,yoga,focus
```

**fr — 100/100** · behaviour and measurement
```
morning,night,schedule,routine,minimal,simple,clean,offline,nag,quiet,diary,monitor,litre,pint,quart
```

Deliberately left out as padding: `hydrated`, `drinking`, `reminders`,
`tracking` are inflections Apple already indexes from the singulars above, and
`widget`, `watch`, `siri` name features the app does not have.

**Keep the order.** Ship es-MX alone first. If it moves nothing, the other two
will not either, and you will have spent twenty minutes instead of an hour.

### The honest caveat

None of this fixes the actual bottleneck. Keyword fields decide what the app is
*eligible* to rank for; ratings and downloads decide *where* it ranks. At zero
ratings, 400 characters of keywords rank the same as 100. Do this because it is
cheap, not because it is the lever — the rating prompt is the lever.

Cross-localization is also an indexing artifact rather than a documented Apple
feature. It has been stable for years, but it is not a contract.

Localizing the **app UI** is a separate, larger job (~100 strings) and is not
required for any of the above.

---

## Do now (no App Review needed)

1. **Fill Promotional Text.** The only store field editable without a new
   version, and it is still blank. Draft:
   > The water reminder that respects your attention. No mascots, no guilt, no
   > spam — reminders stop the moment you hit your goal.

## Ship with v1.1

2. Rating prompt on a 3-day streak (`expo-store-review`). Zero ratings is worth
   more than every metadata change on this page combined — see marketing-plan
   item 1.
3. The three metadata fields above.
4. A 15–25s App Preview video. Zero of ten on that factor today, and it is the
   only remaining free conversion lever.
5. Screenshots 5 and 6 (4 of 10 slots used).
