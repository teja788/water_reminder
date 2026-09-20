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
