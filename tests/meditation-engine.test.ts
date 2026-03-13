import test from 'node:test';
import assert from 'node:assert';
import { MeditationEngine } from '../lib/meditation-engine.ts';

test('MeditationEngine', async (t) => {
    await t.test('initializes with default values', () => {
        const engine = new MeditationEngine();
        assert.strictEqual(engine.sessions.length, 0);
        assert.strictEqual(engine.getProgress(), 0);
    });

    await t.test('startSession creates a new session and adds it to sessions array', () => {
        const engine = new MeditationEngine();
        const duration = 600;

        const session = engine.startSession(duration);

        assert.strictEqual(session.duration, duration);
        assert.ok(session.startTime instanceof Date);
        assert.strictEqual(session.endTime, null);

        assert.strictEqual(engine.sessions.length, 1);
        assert.strictEqual(engine.sessions[0], session);
    });

    await t.test('endSession ends the given session and calculates progress', () => {
        const engine = new MeditationEngine();
        const duration = 600;

        const session = engine.startSession(duration);

        // Simulate some time passed
        const startTime = new Date(Date.now() - 5000); // 5 seconds ago
        session.startTime = startTime;

        engine.endSession(session);

        assert.ok(session.endTime instanceof Date);

        // Expected progress: (5 seconds / 600 seconds) * 100
        // Because of the slight delay in test execution for new Date(), allow some small error margin.
        const progress = engine.getProgress();
        assert.ok(progress > 0 && progress < 100, `Progress ${progress} should be greater than 0 and less than 100`);
    });

    await t.test('calculateProgress properly handles progress logic when duration is reached', () => {
        const engine = new MeditationEngine();
        const duration = 10; // 10 seconds

        const session = engine.startSession(duration);

        // Simulate fully completed
        const startTime = new Date(Date.now() - 10000); // 10 seconds ago
        session.startTime = startTime;

        engine.endSession(session);

        const progress = engine.getProgress();
        assert.ok(progress >= 100, `Progress ${progress} should be around 100%`);
    });

    await t.test('calculateProgress safely handles 0 total duration to avoid NaN', () => {
        const engine = new MeditationEngine();
        const duration = 0;

        const session = engine.startSession(duration);
        engine.endSession(session);

        assert.strictEqual(engine.getProgress(), 0);
    });

    await t.test('calculateProgress works well on ongoing sessions', () => {
        const engine = new MeditationEngine();
        const duration = 100; // 100 seconds

        const session = engine.startSession(duration);

        // Simulate 50 seconds passed
        session.startTime = new Date(Date.now() - 50000);

        engine.calculateProgress();

        const progress = engine.getProgress();
        // roughly 50%
        assert.ok(progress >= 49 && progress <= 51, `Progress ${progress} should be around 50%`);
    });
});
