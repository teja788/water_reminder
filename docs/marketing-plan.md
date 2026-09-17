# Marketing plan — free-first (written 2026-09-17)

Ranked by return on effort for a solo dev with a $0 budget. Do them in order;
item 1 is worth more than 2–5 combined.

Companion to [v1.1-plan.md](v1.1-plan.md), which holds the positioning wedge
("the water app that doesn't nag"), the competitive read, and the feature work.
This file is the *distribution* side and supersedes that file's short "Growth
playbook" section where the two disagree.

State when written: v1.0.1 submitted, Waiting for Review. Free app, no IAP.

---

## 1. Add a rating prompt — the app has none

Verified 2026-09-17: no `expo-store-review`, `requestReview`, or
`SKStoreReviewController` anywhere in `src/` or `App.tsx`.

Rating **count** is one of the strongest App Store search ranking inputs, and it
compounds with conversion — a listing with 50 ratings converts far better than
one with 3. Going 0 → 50 moves the needle more than any external channel on this
list, and it costs a few hours of code and nothing in cash.

- Trigger on **earned satisfaction**, not app open: hitting a **3-day streak**
  is the natural moment (`currentStreak` in `src/logic/hydration.ts` already
  computes it).
- Never prompt after a missed goal, and never on first launch.
- iOS caps the system prompt at 3 per user per year, so it cannot be abused —
  no custom throttling needed beyond picking the right moment.
- Use `expo-store-review`; it is a JS-only wrapper over StoreKit, so no new
  permissions and no privacy-label change.

**This is the only item here that is also a code change. Ship it with v1.1.**

## 2. Fill in Promotional Text — free, instant, currently blank

Promotional Text is the **one** store field editable without shipping a new
version. As of 2026-09-17 it is empty, which is wasted space at the top of the
listing.

Copy already drafted in v1.1-plan.md:

> The water reminder that respects your attention. No mascots, no guilt, no
> spam — it stops when you hit your goal.

Because it needs no release, treat it as a live A/B slot: change it whenever
positioning sharpens.

## 3. ASO on long-tail terms, not head terms

We will not outrank WaterMinder for "water tracker". We can plausibly own
"calm water reminder", "gentle hydration reminder", "water reminder no ads".

**Constraint that drives scheduling:** app name, subtitle and the keyword field
only change **with a new version**. So ASO edits must ride along with v1.1 —
there is no way to push them separately. Promotional Text (item 2) is the sole
exception.

Keyword set is drafted in v1.1-plan.md. Before finalising, mine 1-star reviews
of Waterllama / WaterMinder / Plant Nanny for the exact words people use when
they complain about nagging, and reuse that phrasing verbatim.

## 4. Reddit — once per community, as a story

r/HydroHomies (1M+), r/ADHD, r/productivity.

Post the **problem**, not the app: "every water app nagged me until I deleted
it, so I built one that stops." The anti-nag angle is genuinely differentiated,
and these subs punish ads while rewarding builder stories.

Realistic expectation: a few hundred installs from a good post, not thousands.
You get roughly **one shot per community** — don't spend it before the rating
prompt (item 1) is live, or the traffic arrives at a listing with no social
proof and converts badly.

## 5. Skip paid ads

At $0–50/month Apple Search Ads buys noise, not signal. Revisit only when there
is conversion data worth optimising — and with a free app and no IAP there is
currently nothing to optimise *toward*.

Same verdict for influencers and cross-promo: not now.

---

## Open question that changes everything above

The app is free with no monetisation, so all of this buys **users, not revenue**.

Decide what Sip is for:

- **Portfolio piece / side project** — then items 1–4 are the whole plan, and
  that is a perfectly good answer.
- **A business** — then the ~$9.99 Pro IAP (`src/pro.ts` seam, currently
  deferred to v1.2 behind widgets/HealthKit) should land **before** the growth
  push, not after. Driving installs to a product with no revenue path means
  paying the acquisition cost twice.

This decision is worth making deliberately before spending effort on items 3–4.
