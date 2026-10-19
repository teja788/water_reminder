/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goalInputToMl } from '../hydration';

test('goal input: litres up to 8, ml above', () => {
  assert.equal(goalInputToMl(2.5), 2500);
  assert.equal(goalInputToMl(8), 8000);
  assert.equal(goalInputToMl(2500), 2500);
  assert.equal(goalInputToMl(25), 25); // mid-typing "2500": rejected by the range check
  assert.equal(goalInputToMl(0), 0);
});
