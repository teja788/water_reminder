# Water Reminder 💧

A gentle hydration companion. It learns a daily water goal from three quick
questions (age, gender, activity level), shows progress as a filling bottle,
and sends soft reminders during the day — never at night or early in the
morning.

## Run it on a phone (quick test)

```bash
npm install
npx expo start
```

Install **Expo Go** from the Play Store on the phone, then scan the QR code
shown in the terminal. Local scheduled reminders work in Expo Go; for the most
reliable notification behavior use a real build (below).

## Build an installable APK

```bash
npm install -g eas-cli
eas login          # free Expo account
eas build -p android --profile preview
```

When the build finishes, Expo gives a link to download the APK. Install it on
the phone (allow "install from unknown sources") and the app runs standalone —
no PC or dev server needed.

## How the daily goal is calculated

| Input | Effect |
| --- | --- |
| Gender | Base: 2000 ml (female) / 2500 ml (male) |
| Age | ≤30: +100 ml · 31–55: no change · ≥56: −100 ml |
| Activity | Relaxed +0 · Light +350 · Active +700 · Very active +1000 ml |

The result is clamped between 1500 and 4000 ml. Based on EFSA adequate-intake
guidance plus the common "~350 ml per 30 minutes of exercise" rule. This is
general wellness guidance, not medical advice.

## How reminders behave

- **Quiet hours**: reminders only fire inside the active window
  (default 09:00–21:00, adjustable in Settings).
- **Two modes**: a fixed rhythm (every 1/1.5/2/3 hours) or **Surprise me**,
  which picks one random moment in each ~2-hour block.
- **Always a little random**: times get a few minutes of jitter and the
  message is picked from a pool of friendly texts, re-rolled every time the
  app opens — so it never feels robotic.
- Reminder texts live in `src/notifications.ts` (`MESSAGES`) — edit freely.
- Quick-add button sizes live in `src/hydration.ts` (`QUICK_ADDS_ML`).

## The bottle image

The bottle is drawn in code (`src/components/BottleGauge.tsx`) with
`react-native-svg`, so the water level animates to match real progress — no
image file needed. If you ever want a decorative illustration instead (e.g.
for the app icon or splash screen), this prompt works well in an image
generator:

> Cute flat-design illustration of a tall transparent water bottle with a dark
> blue cap, two-thirds full of bright blue water with a gentle wave on the
> surface and a soft shine highlight on the glass, light pastel blue
> background, minimal modern mobile-app style, centered, no text.

## Project layout

```
App.tsx                        root: loads data, onboarding gate, tab bar
src/hydration.ts               goal formula, quick-add sizes, date helpers
src/notifications.ts           reminder scheduling, quiet hours, message pool
src/storage.ts                 AsyncStorage persistence
src/components/BottleGauge.tsx animated SVG bottle
src/components/ProfileForm.tsx age/gender/activity form (onboarding + settings)
src/screens/                   Onboarding, Home, Info (Learn), Settings
```
