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

1. **The Pro IAP already seamed into `src/pro.ts`** (~$9.99, currently deferred
   to v1.2 behind widgets/HealthKit). Sell *additions*, not the removal of an
   annoyance. Keeps "no ads, no tracking" as the brand instead of spending it,
   and earns roughly ten times more per paying user than the 99¢ route.
2. **A tip jar** — a consumable "buy me a coffee" IAP. Earns little, costs the
   positioning nothing, and suits a portfolio app.
3. **Stay free forever** and treat Sip as a portfolio piece. This is a legitimate
   answer, and it is the one the current listing is honest about.
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
