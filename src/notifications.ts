import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Settings } from './types';

const CHANNEL_ID = 'water-reminders';

// How an incoming reminder behaves while the app is open in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MESSAGES: { title: string; body: string }[] = [
  { title: 'Water break 💧', body: 'A few sips now keeps the energy up!' },
  { title: 'Gentle nudge 🫧', body: 'Your bottle misses you. Quick sip?' },
  { title: "Sip o'clock 💙", body: 'Small sips, big difference.' },
  { title: 'Hydration check 💧', body: 'How about a glass of water?' },
  { title: 'Stay glowing ✨', body: 'Water keeps skin happy and minds fresh.' },
  { title: 'Tiny pause 🌿', body: 'Stretch, breathe, and take a sip.' },
  { title: 'Hello! 👋', body: 'Just checking in — had some water recently?' },
  { title: 'Refresh time 🧊', body: 'A cool glass of water sounds nice right now.' },
  { title: 'Your body says thanks 💙', body: 'Every sip counts toward your goal.' },
  { title: 'Friendly reminder 💧', body: 'Headaches hate water. Have a sip!' },
];

function randomMessage() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

/** Creates the Android channel and asks for permission. Returns true if granted. */
export async function setupNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Water reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 200],
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Picks the times of day to remind at, always inside the active window
 * so nights and early mornings stay quiet.
 */
function reminderTimes(settings: Settings): { hour: number; minute: number }[] {
  const startMin = settings.activeStartHour * 60;
  const endMin = settings.activeEndHour * 60;
  const times: { hour: number; minute: number }[] = [];

  if (settings.mode === 'random') {
    // One reminder at a random moment inside each ~2 hour block of the day.
    const BLOCK = 120;
    for (let blockStart = startMin; blockStart < endMin; blockStart += BLOCK) {
      const blockEnd = Math.min(blockStart + BLOCK, endMin);
      if (blockEnd - blockStart < 30) continue;
      const at = blockStart + Math.floor(Math.random() * (blockEnd - blockStart));
      times.push({ hour: Math.floor(at / 60), minute: at % 60 });
    }
  } else {
    // Evenly spaced, with a few minutes of jitter so it feels human.
    for (let at = startMin + settings.intervalMinutes; at <= endMin; at += settings.intervalMinutes) {
      const jitter = Math.floor(Math.random() * 21) - 10;
      const clamped = Math.max(startMin, Math.min(endMin, at + jitter));
      times.push({ hour: Math.floor(clamped / 60), minute: clamped % 60 });
    }
  }
  return times;
}

/** Expected reminders per day for the current settings (for display in Settings). */
export function remindersPerDay(settings: Settings): number {
  if (!settings.remindersEnabled) return 0;
  return reminderTimes(settings).length;
}

/**
 * Clears everything scheduled and re-creates daily repeating reminders.
 * Called on app launch and whenever settings change, which also re-rolls
 * the random times and messages so they stay fresh.
 */
export async function rescheduleReminders(settings: Settings): Promise<number> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.remindersEnabled) return 0;

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') return 0;

  const times = reminderTimes(settings);
  for (const t of times) {
    const message = randomMessage();
    await Notifications.scheduleNotificationAsync({
      content: { title: message.title, body: message.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: CHANNEL_ID,
        hour: t.hour,
        minute: t.minute,
      },
    });
  }
  return times.length;
}

/** Fires a sample reminder a few seconds from now, so it can be previewed. */
export async function sendTestNotification(): Promise<void> {
  const message = randomMessage();
  await Notifications.scheduleNotificationAsync({
    content: { title: message.title, body: message.body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: CHANNEL_ID,
      seconds: 3,
    },
  });
}
