/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DrinkEntry, Settings } from '../../types';
import {
  computeTodayReminderTimes,
  computeTomorrowReminderTimes,
  learnedCutoffMinutes,
} from '../reminders';

const SETTINGS: Settings = {
  weightKg: 70,
  activity: 'moderate',
  goalMl: 2500,
  units: 'ml',
  wakeMinutes: 7 * 60,
  sleepMinutes: 22 * 60,
  cupSizesMl: [150, 250, 500],
  defaultCupMl: 250,
  remindersEnabled: true,
};

const at = (day: number, h: number, m = 0) => new Date(2026, 9, day, h, m);
const hhmm = (d: Date) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const drink = (d: Date, amountMl = 250): DrinkEntry => ({
  id: String(d.getTime()),
  timestamp: d.getTime(),
  amountMl,
});
/** One drink a day at h:m for the `days` days before Oct 14. */
const history = (days: number, h: number, m = 0) =>
  Array.from({ length: days }, (_, i) => drink(at(13 - i, h, m)));

test('gaps double after BACKOFF_AFTER unanswered reminders', () => {
  const times = computeTodayReminderTimes(at(14, 8), SETTINGS, []);
  const gaps = times.slice(1).map((d, i) => d.getTime() - times[i].getTime());
  assert.ok(times.length >= 3);
  assert.equal(gaps[1], gaps[0] * 2);
  for (const g of gaps.slice(2)) assert.equal(g, gaps[1]);
  // Far fewer than the 10 cups left: ignored reminders get rarer.
  assert.ok(times.length < 10);
  assert.ok(times.every((d) => d <= at(14, 21, 30)));
});

test('no reminders once the goal is met', () => {
  assert.deepEqual(computeTodayReminderTimes(at(14, 12), SETTINGS, [drink(at(14, 11), 2500)]), []);
});

test('snooze holds the next reminder back', () => {
  const [first] = computeTodayReminderTimes(at(14, 10), SETTINGS, [], at(14, 12).getTime());
  assert.equal(hhmm(first), '12:00');
});

test('cutoff: none until a week of history', () => {
  assert.equal(learnedCutoffMinutes(history(6, 19), at(14, 9)), null);
  assert.equal(learnedCutoffMinutes(history(7, 19), at(14, 9)), 19 * 60 + 30);
});

test('cutoff follows the latest drink, ignores today and old days', () => {
  const entries = [...history(10, 19), drink(at(10, 20, 15)), drink(at(14, 21)), drink(new Date(2026, 8, 25, 21, 45))];
  assert.equal(learnedCutoffMinutes(entries, at(14, 22)), 20 * 60 + 45);
});

test('reminders stop at the learned cutoff, today and tomorrow', () => {
  const entries = history(10, 19);
  const today = computeTodayReminderTimes(at(14, 8), SETTINGS, entries);
  const tomorrow = computeTomorrowReminderTimes(at(14, 8), SETTINGS, entries);
  assert.ok(today.length > 0 && tomorrow.length > 0);
  assert.ok(today.every((d) => d <= at(14, 19, 30)));
  assert.ok(tomorrow.every((d) => d <= at(15, 19, 30)));
});

test('a cutoff later than bedtime changes nothing', () => {
  const late = computeTodayReminderTimes(at(14, 8), SETTINGS, history(10, 23));
  assert.deepEqual(late, computeTodayReminderTimes(at(14, 8), SETTINGS, []));
});

test('morning-only history cannot end reminders before 4 h ahead of bedtime', () => {
  const times = computeTodayReminderTimes(at(14, 9), SETTINGS, history(10, 8));
  assert.ok(times.length > 0);
  assert.ok(times.every((d) => d <= at(14, 18)));
  assert.ok(times.some((d) => d > at(14, 12)));
});

test('the last reminder reaches the end of the window, whatever the count', () => {
  // 1 to 6 cups left at 14:00: the backed-off pattern must still cover the
  // evening instead of stopping a whole gap short of 21:30.
  for (let cups = 2; cups <= 6; cups++) {
    const logged = drink(at(14, 9), SETTINGS.goalMl - cups * 250);
    const times = computeTodayReminderTimes(at(14, 14), SETTINGS, [logged]);
    assert.equal(hhmm(times[times.length - 1]), '21:30', `${cups} cups`);
  }
});

test("tomorrow's cutoff counts today's drinks", () => {
  const entries = [...history(10, 19), drink(at(14, 21))];
  const tomorrow = computeTomorrowReminderTimes(at(14, 22), SETTINGS, entries);
  assert.ok(tomorrow.some((d) => d > at(15, 19, 30)));
});
