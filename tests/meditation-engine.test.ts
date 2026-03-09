import test from 'node:test';
import assert from 'node:assert';
import { MeditationEngine } from '../lib/meditation-engine.ts';

test('MeditationEngine', async (t) => {
    await t.test('initializes with zero progress', () => {
        const engine = new MeditationEngine();
        assert.strictEqual(engine.getProgress(), 0);
    });

    await t.test('calculates progress correctly for completed sessions', () => {
        const engine = new MeditationEngine();
        const duration = 60; // 60 seconds
        const session = engine.startSession(duration);

        // Mock session timing for testing
        session.startTime = Date.now() - 30000; // Started 30s ago
        session.endTime = Date.now(); // Ended now

        engine.calculateProgress();
        const progress = engine.getProgress();

        // Expected: (30 / 60) * 100 = 50%
        assert.ok(progress >= 49 && progress <= 51, `Progress should be ~50%, got ${progress}`);
    });

    await t.test('handles multiple sessions', () => {
        const engine = new MeditationEngine();

        const s1 = engine.startSession(100);
        s1.startTime = 1000;
        s1.endTime = 2000; // 1s completed

        const s2 = engine.startSession(100);
        s2.startTime = 3000;
        s2.endTime = 5000; // 2s completed

        engine.calculateProgress();
        // Total duration: 200, Total completed: 3
        // (3 / 200) * 100 = 1.5%
        assert.strictEqual(engine.getProgress(), 1.5);
    });

    await t.test('prevents NaN with zero total duration', () => {
        const engine = new MeditationEngine();
        engine.calculateProgress();
        assert.strictEqual(engine.getProgress(), 0);
    });

    await t.test('handles ongoing sessions', () => {
        const engine = new MeditationEngine();
        const duration = 100;
        const session = engine.startSession(duration);

        session.startTime = Date.now() - 10000; // 10s ago
        session.endTime = null; // Still ongoing

        engine.calculateProgress();
        const progress = engine.getProgress();
        assert.ok(progress >= 9 && progress <= 11, `Ongoing progress should be ~10%, got ${progress}`);
    });
});
