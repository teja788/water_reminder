// Streak grace day + rating-prompt policy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak } from '../hydration';
import { MIN_GAP_MS, shouldRequestReview } from '../review';
import { DrinkEntry } from '../../types';

const NOW = new Date(2026, 10, 27, 12); // Fri 27 Nov 2026, noon
const GOAL = 2000;

/** pattern[0] = today, pattern[1] = yesterday, …; 'x' = goal met, '.' = missed. */
function history(pattern: string): DrinkEntry[] {
  return [...pattern].flatMap((c, i) =>
    c === 'x'
      ? [{ id: String(i), amountMl: GOAL, timestamp: new Date(2026, 10, 27 - i, 10).getTime() }]
      : []
  );
}
const streak = (p: string) => currentStreak(history(p), GOAL, NOW);

test('streak: plain run, today in progress does not break it', () => {
  assert.equal(streak('xxx.'), 3);
  assert.equal(streak('.xxx..'), 3);
});

test('streak: one missed day is forgiven and not counted', () => {
  assert.equal(streak('xx.xx..'), 4);
  // Missed yesterday, today still in progress: the streak survives.
  assert.equal(streak('..xxx..'), 3);
});

test('streak: two misses in a row end it', () => {
  assert.equal(streak('xx..xx'), 2);
});

test('streak: at most one forgiven miss per 7 days', () => {
  assert.equal(streak('xx.xx.xx'), 4); // second miss only 3 days after the first
  assert.equal(streak('xx.xxxxxx.xx'), 10); // 6 met days between misses: forgiven
  assert.equal(streak('.'), 0);
  assert.equal(streak(''), 0);
});

const ask = (todayTotalMl: number, goalDays: number, lastPromptedAt: number | null = null) =>
  shouldRequestReview({ todayTotalMl, goalMl: GOAL, goalDays, state: { lastPromptedAt }, now: 1e12 });

test('review: needs today at goal and 2 goal days, not in a row', () => {
  assert.equal(ask(GOAL, 2), true);
  assert.equal(ask(GOAL, 1), false);
  assert.equal(ask(GOAL - 1, 5), false);
});

test('review: 120-day gap, and a backwards clock never mutes it', () => {
  assert.equal(ask(GOAL, 3, 1e12 - MIN_GAP_MS + 1), false);
  assert.equal(ask(GOAL, 3, 1e12 - MIN_GAP_MS), true);
  assert.equal(ask(GOAL, 3, 1e12 + 1000), true);
  assert.equal(shouldRequestReview({ todayTotalMl: 0, goalMl: 0, goalDays: 9, state: { lastPromptedAt: null }, now: 1 }), false);
});
