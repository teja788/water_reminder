/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goalInputToMl } from '../hydration';

test('goal input: litres only with a decimal separator', () => {
  assert.equal(goalInputToMl('2.5'), 2500);
  assert.equal(goalInputToMl('2,5'), 2500);
  assert.equal(goalInputToMl('3.'), 3000);
  assert.equal(goalInputToMl('2500'), 2500);
  assert.equal(goalInputToMl('8'), 8); // half of "800": rejected by the range check
});
