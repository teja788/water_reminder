# Monetization options

Written 2026-09-20, in answer to: *can I ship free now, add ads later, and sell a
99¢ "remove ads" upgrade?*

**Short answer: Apple allows it. It would be a bad trade for this app.**

---

## Is it permitted?

Yes. Going free → ad-supported → ad-supported-with-a-remove-ads IAP is a normal,
allowed path. Nothing in the guidelines prevents it. The obligations that come
with it:

- **The privacy label has to change.** Sip currently declares *Data Not
  Collected* in every category. Any ad SDK collects — identifiers, device data,
  usage — and since Apple's privacy-manifest rules, third-party SDKs ship a
  `PrivacyInfo.xcprivacy` that folds into the app's privacy report. The label
  would go from "Data Not Collected" to declaring collection, and likely *Data
  Used to Track You*.
- **App Tracking Transparency.** If the SDK tracks across apps, the ATT prompt is
  mandatory. Opt-in has plateaued around **27% globally** (US 31%, EU 22%) and
  has not moved since 2021. Untrackable impressions sell for roughly half as
  much, so most of the inventory is the cheap kind.
- **Commission.** 15% under $1M/year via the Small Business Program, so a 99¢
  purchase nets about **$0.84**.
- Existing users cannot be charged retroactively, but an IAP can be added to an
  app they already have.

## Would it pay?

Run the numbers before the philosophy.

A water reminder gets short, infrequent sessions — a few taps a day. That is
banner inventory, not rewarded video. iOS US banner eCPM is roughly **$0.50–2**;
rewarded video ($12–20) does not fit an app with nothing to reward. Outside the
US it is lower. Post-ATT, industry ad revenue fell 15–25%.

At a generous 4 impressions per user per day and a $1 eCPM, **1,000 daily active
users earns about $4 a day.** Sip currently has zero ratings and near-zero
installs.

The 99¢ side: remove-ads conversion for a utility runs about 1–3%. At 5,000
lifetime installs that is 50–150 buyers — **$42 to $126, total, ever.**

So the realistic ceiling at this app's scale is a few hundred dollars a year.

## What it would cost

Sip's entire differentiator is the absence of ads. That promise is not a
footnote; it is written into every surface:

| Where | What it says |
|---|---|
| App Store description | "No account. No ads. No analytics. No cloud." · "PRIVATE BY DESIGN" |
| Promotional text | "no ads, no account, no nagging" |
| Keyword field | `private` |
| Settings screen | "Your data never leaves this device." |
| `site/privacy.html` | "No analytics, tracking, or advertising SDKs." |
| Privacy label | Data Not Collected, all categories |
| Positioning (v1.1 plan) | "the water app that doesn't nag" |

Introducing ads does not just change the business model — it **retracts a promise
made to the people who downloaded on the strength of it**. The predictable
response is one-star reviews, and reviews are permanent.

That lands on the worst possible pressure point: ratings are already this app's
single binding constraint. Every other item in `marketing-plan.md` and
`aso-plan.md` is gated on getting the rating count off zero.

**And "99¢ to remove ads" is the weakest form of the idea**, because it sells the
removal of a harm you introduced, on a listing that used to promise the harm
would never exist. That reads as bait-and-switch even when it is not meant as
one.

## Better options, in order

*(Written before the business decision below; the ordering still holds, and the
price has since been revised down from $9.99 to $4.99-7.99.)*

1. **The Pro IAP already seamed into `src/pro.ts`.** Sell *additions*, not the
   removal of an annoyance. Keeps "no ads, no tracking" as the brand instead of
   spending it, and earns far more per paying user than the 99¢ route.
2. **A tip jar** — a consumable IAP. Earns little, costs the positioning
   nothing. Pairs with option 1 rather than competing with it; see the dedicated
   section at the end.
3. **Stay free forever.** Ruled out by the business decision below, but it was a
   legitimate answer and it is the one the current listing is honest about.
4. **Ads.** Only if the app becomes something other than what it currently
   claims to be.

## If you do it anyway

Not a recommendation, but the way to do it with the least damage:

1. **Grandfather existing users.** Record an install/version marker and never
   show ads to anyone who arrived under the no-ads promise. This is the single
   biggest protection for the rating average.
2. **Rewrite every "no ads" claim first**, in the same version — description,
   promotional text, Settings copy, privacy page. Shipping ads against a listing
   that still says "No ads" is both a broken promise and an inaccurate-metadata
   problem.
3. **Update the privacy label before the build goes live**, not after.
4. **Ship it as a major version** with a clear What's New note, rather than
   sliding it in quietly.


---

# DECIDED 2026-09-20: Sip is a commercial business

Owner's call, resolving the open question in `marketing-plan.md`. Not a
portfolio piece. That changes several things on this page and elsewhere.

## What stays true

The case against ads is unchanged, and is in fact stronger. A business needs a
revenue model that scales with value delivered; banner ads on a
four-taps-a-day utility do not, and they spend the differentiator to earn a few
hundred dollars a year. Ads remain the wrong instrument.

## The model: one-time unlock, and make it the pitch

Every serious competitor in this category — Waterllama, WaterMinder,
Plant Nanny — puts you on a subscription. Subscription fatigue is real, and it
is loudest exactly where this app has positioned itself: people who resent being
nagged also resent being billed monthly for a reminder.

So the recommendation is a **one-time Pro unlock around $4.99–7.99**, and to put
the model itself in the marketing:

> Pay once. No subscription, no ads, no account.

That turns pricing into a third differentiator alongside "doesn't nag" and
"nothing leaves your device". In a category where every alternative subscribes
you, it is a genuine wedge and it costs nothing to claim, because it is true.

**The honest counterpoint:** one-time purchases do not compound. A subscription
business grows on its back catalogue of subscribers; a one-time business earns
once per customer and has to keep finding new ones. That makes volume — and
therefore ASO and ratings — the whole game rather than half of it. Accept that
trade deliberately, or price a subscription and give up the wedge.

## Realistic scale, stated plainly

At 2–5% conversion on a one-time utility unlock, 10,000 lifetime installs is
200–500 buyers, netting roughly **$1,000–2,500**. That is side income, not a
business. A business in this category needs installs in the hundreds of
thousands, which means ASO, ratings and localization are not marketing garnish —
they are the product work.

This is a crowded category with entrenched incumbents holding 100,000+ ratings
and a decade of head start. The differentiator is real but narrow. Worth doing
with eyes open.

## Sequencing — what actually changes

The instinct is "monetize before growth", and `marketing-plan.md` warns that
driving installs to a product with no revenue path pays the acquisition cost
twice. That warning stands, but it does **not** mean stopping v1.1:

1. **v1.1 ships as planned.** The rating prompt is already built and costs
   nothing more. Ratings gate discovery, which gates everything commercial.
2. **Build the Pro tier during the v1.1 review cycle**, not after it. Review is
   dead time — roughly a week of work fits inside it (HealthKit 1–2 days,
   widgets 2–3 days, IAP with restore-purchases 1–2 days).
3. **Paid acquisition becomes possible** once there is an LTV number to optimise
   toward — but not before. There is still nothing to optimise today.

## Things a business needs that a side project does not

- **Support that is not GitHub issues.** Paying customers need an email address.
  The current support page points at GitHub, which is fine for free users and
  not fine once money changes hands.
- **Analytics without breaking the privacy label.** App Store Connect's own
  analytics is free, aggregate, needs no SDK, and changes nothing about "Data
  Not Collected". Use that. Do not add an analytics SDK — the privacy label is a
  store asset and part of the pitch.
- **IAP infrastructure.** Nothing is installed; `expo-in-app-purchases` is gone.
  RevenueCat is free under $2.5k/month and handles restore-purchases and receipt
  validation, which are the fiddly parts.


---

## Asked 2026-09-20: what about a $1 optional subscription?

**You can create the product. It is likely to be rejected, and the reason is
structural rather than fixable by pricing.**

### Guideline 3.1.2 requires ongoing value

Apple's rule for auto-renewable subscriptions: *"you must provide ongoing value
to the customer, and the subscription period must last at least seven days and
be available across all of the user's devices."* The examples Apple gives are
new game levels, episodic content, multiplayer support, apps offering
consistent substantive updates, continually updated media, SaaS, and cloud
support.

A static feature unlock — widgets, HealthKit sync — is not that, and developers
do get rejected for exactly this shape. At least one documented case only passed
review after switching from auto-renewing to non-renewing.

### The conflict is with the product, not the price

Sip has no server, no account and no cloud **by design**. That is the
differentiator, it is what the "Data Not Collected" label is built on, and it is
half the App Store description. It is also precisely what leaves nothing
ongoing to sell.

The only credible ongoing value for an app like this is cloud sync or backup —
which means a server, which breaks the privacy wedge and the privacy label. The
thing that makes Sip distinctive is the thing that disqualifies it from a
subscription. Pricing cannot solve that; only a different product can.

### The economics are worse anyway

- **Price floor** is $0.49 for subscriptions (900 price points, $0.29 minimum
  for paid apps), so $0.99 is not even the cheapest option available.
- **Commission** is 15% under the Small Business Program, so $0.99 nets ~$0.84.
- **Churn** is the killer. Low-priced monthly consumer subscriptions retain
  badly; a realistic lifetime is a handful of months, so ~$3-5 per subscriber.
- **"Optional" makes it far worse.** A subscription that gates nothing converts
  at a fraction of one percent, not the 2-5% of a real unlock. At 10,000
  installs that is tens of subscribers, decaying.

A one-time $5.99 unlock nets $5.09 immediately, with no churn, no 3.1.2
exposure, and no ongoing obligation to keep shipping "substantive updates" to
justify a recurring charge.

### If recurring revenue is the goal

It is a legitimate ambition — recurring compounds and one-time does not, which
is the trade already recorded above. But Sip cannot honestly sell recurring
today. Getting there means building something genuinely ongoing, and every
candidate (sync, backup, an account) costs the privacy positioning.

That is a real strategic fork, and it should be taken deliberately rather than
arrived at by picking a price.

### Allowed alternatives, if a small recurring-feeling option is wanted

- **Consumable tip jar.** Permitted, must go through IAP, Apple takes its cut.
  Earns little and only works once there are fans. Costs the positioning
  nothing.
- **Non-renewing subscription.** Allowed and sidesteps 3.1.2, but the user has
  to repurchase manually, which is worse UX than a one-time unlock for no gain.

**Recommendation unchanged: one-time unlock, ~$4.99-7.99.**


---

## The tip jar, properly considered

Kept as a live option at the owner's request. It is **additive, not a strategy** —
it will not carry a business on its own, but it is the cheapest thing on this
page and it is the only monetization that costs the positioning nothing at all.

### Why it fits this app specifically

A tip jar speaks in the same voice as the rest of Sip. "If this is useful, you
can support it" sits naturally beside "reminders stop when you hit your goal"
and "nothing leaves your device". An app that has spent its whole listing
promising not to extract from you can ask, once, without contradicting itself.

It also cannot cause the problems the other options do:

- **No Guideline 3.1.2 exposure.** Consumables carry no ongoing-value obligation,
  unlike auto-renewable subscriptions.
- **No paywall.** Nothing is gated, so no user is worse off and no review is
  provoked.
- **No privacy-label change.** Unlike ads, which would force the label off
  "Data Not Collected".
- **No promise retracted.** The listing says no ads, no account, no tracking. A
  tip jar contradicts none of it.

### Mechanics

- **Consumable IAP**, not non-consumable — the point is that someone can tip
  more than once. Consumables are not restorable, which is correct here: there
  is nothing to restore.
- **Three tiers** is the usual shape; something like $2.99 / $5.99 / $11.99,
  named in the app's own voice rather than as "Small / Medium / Large".
- **15% commission** under the Small Business Program, so a $2.99 tip nets about
  $2.54.
- Must go through IAP. External payment links (Buy Me a Coffee, Ko-fi, PayPal)
  are **not** permitted for this — only reader and e-commerce apps may link out.
- Frame it as supporting development, not as a charitable donation; donations to
  nonprofits have their own separate rules.

### Cost to build: close to zero, if sequenced right

The expensive part of any IAP is the plumbing — StoreKit or RevenueCat, the
purchase flow, receipt handling, error states. **That work is already required
for the one-time Pro unlock.** Adding three consumable product IDs on top is an
afternoon, not a project.

So: build the Pro unlock first, then add the tip jar to the same paywall
infrastructure. Doing the tip jar *first*, alone, would mean paying the full
plumbing cost for the option that earns least.

### What it will actually earn

Little. Tip conversion in a free utility runs well under one percent — at 10,000
lifetime installs, expect tens of tips, not hundreds. Call it a hundred dollars
or two across the life of the app.

That is a rounding error against the one-time unlock, and it is still worth
shipping, because the marginal cost once the plumbing exists is an afternoon and
the marginal risk is zero.

### Where it goes in the app

Settings → ABOUT, next to the existing "Rate Sip" row. Not on Home, not after a
goal is reached, and never as an interstitial. The moment it interrupts, it stops
being on-brand and starts being the thing the listing promised it would not be.
