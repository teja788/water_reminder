# Pre-submission checklist (App Store)

Compiled from the Phase 1 review process (2026-08-11). Items are owner decisions
or need a physical device — none block local device testing.

## App config / assets
- [ ] Replace the Expo template `assets/icon.png` and splash asset with real branding.
- [ ] Add `ios.infoPlist.ITSAppUsesNonExemptEncryption: false` to app.json (avoids the export-compliance prompt on every upload).
- [ ] Configure a splash screen with a dark-mode-aware background (`expo-splash-screen` plugin); today a dark-mode user gets a white launch flash into the dark theme.
- [ ] Decide `ios.supportsTablet` (currently `true`, which promises a reviewed iPad layout; the Home layout is phone-shaped). Setting it `false` is the low-effort option.
- [ ] Confirm the display name ("Water Reminder") and bundle id (`com.teja788.waterreminder`) before the first build — the bundle id is permanent after first upload.

## Code polish (small, non-blocking)
- [ ] Debounce the Settings text-field commits (~400 ms) — each valid keystroke currently rebuilds the notification schedule (serialized and correct, but ~100 native calls in a burst).
- [ ] Decide whether Settings numeric inputs should follow the units toggle (Onboarding edits in the selected units; Settings edits in ml with honest labels).
- [ ] Light-mode contrast pass on accent-on-accentSoft text (selected chips, today column label): ~3.1:1, below AA's 4.5:1. Fix once at theme level.
- [ ] Optional: day-over-day message rotation (`slot = floor(t/3.6e6) + floor(t/8.64e7)`) so a given clock hour doesn't always show the same message.
- [ ] Optional: clear the "Enable notifications in iOS Settings" hint after permission is granted externally.

## Device testing (cannot be verified statically)
- [ ] EAS development build on a real iPhone (`eas build --profile development --platform ios`); Expo Go cannot exercise the notification actions.
- [ ] Quick-log action from a killed app: tap "Log 250 ml" on a reminder without opening the app, then launch later — entry must land on the day the notification fired.
- [ ] Tab-bar bottom padding on a home-button device (SE): `paddingBottom: 28` is a notch-era approximation.
- [ ] Reminder schedule sanity: goal met → no more reminders today; late evening → "back tomorrow" hint.

## Store setup
- [ ] Apple Developer Program enrollment ($99/yr); Small Business Program application (15% commission).
- [ ] Create `eas.json`; set an `ios.buildNumber` strategy.
- [ ] Privacy policy URL (required even with no data collection) + "Data Not Collected" nutrition label.
- [ ] Screenshots for required device sizes; App Store description positioning: free, private, reminders that stop when you're done.
