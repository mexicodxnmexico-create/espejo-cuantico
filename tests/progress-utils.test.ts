import test from 'node:test';
import assert from 'node:assert';
import { calculateProgressPercentage } from '../lib/progress-utils.ts';

test('calculateProgressPercentage', async (t) => {
    await t.test('calculates correctly for normal values', () => {
        assert.strictEqual(calculateProgressPercentage(2, 4), 50);
        assert.strictEqual(calculateProgressPercentage(0, 5), 0);
        assert.strictEqual(calculateProgressPercentage(5, 5), 100);
        assert.strictEqual(calculateProgressPercentage(10, 5), 200);
    });

    await t.test('handles zero target to prevent NaN/Infinity', () => {
        assert.strictEqual(calculateProgressPercentage(0, 0), 0);
        assert.strictEqual(calculateProgressPercentage(5, 0), 0);
    });

    await t.test('handles negative target', () => {
        assert.strictEqual(calculateProgressPercentage(5, -2), 0);
    });
});
