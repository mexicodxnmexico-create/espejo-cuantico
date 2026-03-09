import test from 'node:test';
import assert from 'node:assert';
import { MeditationEngine } from '../lib/meditation-engine.ts';

test('MeditationEngine', async (t) => {
    await t.test('initializes correctly', () => {
        const engine = new MeditationEngine();
        assert.deepStrictEqual(engine.sessions, []);
        assert.strictEqual(engine.progress, 0);
        assert.strictEqual(engine.getProgress(), 0);
    });

    await t.test('startSession creates a new session and pushes to sessions array', () => {
        const engine = new MeditationEngine();
        const duration = 600;

        const now = Date.now();
        const session = engine.startSession(duration);

        assert.strictEqual(session.duration, duration);
        assert.strictEqual(session.endTime, null);
        assert.ok(session.startTime instanceof Date);

        // Ensure the startTime is close to 'now'
        assert.ok(Math.abs(session.startTime.getTime() - now) < 100);

        assert.strictEqual(engine.sessions.length, 1);
        assert.strictEqual(engine.sessions[0], session);
    });

    await t.test('endSession sets endTime and updates progress', () => {
        const engine = new MeditationEngine();
        const duration = 600; // 600 seconds = 10 minutes
        const session = engine.startSession(duration);

        // Simulate some time passed (e.g., 60 seconds)
        // Since we can't easily mock Date directly in node:test without extra tools,
        // we'll manually adjust startTime to simulate time passed
        session.startTime = new Date(Date.now() - 60000);

        const beforeEnd = Date.now();
        engine.endSession(session);
        const afterEnd = Date.now();

        assert.ok(session.endTime instanceof Date);
        assert.ok(session.endTime.getTime() >= beforeEnd && session.endTime.getTime() <= afterEnd);

        // Progress should be approx (60 / 600) * 100 = 10%
        const progress = engine.getProgress();
        assert.ok(progress >= 9.9 && progress <= 10.1);
    });

    await t.test('calculateProgress returns 0 when totalDuration is 0', () => {
        const engine = new MeditationEngine();
        // Start a session with 0 duration
        const session = engine.startSession(0);

        // End it immediately
        engine.endSession(session);

        assert.strictEqual(engine.getProgress(), 0);
    });

    await t.test('calculateProgress calculates correctly for multiple sessions', () => {
        const engine = new MeditationEngine();

        const session1 = engine.startSession(100);
        session1.startTime = new Date(Date.now() - 50000); // 50 seconds passed
        engine.endSession(session1);

        const session2 = engine.startSession(200);
        session2.startTime = new Date(Date.now() - 40000); // 40 seconds passed
        engine.endSession(session2);

        // Total duration: 300
        // Completed duration: 50 + 40 = 90
        // Expected progress: (90 / 300) * 100 = 30

        const progress = engine.getProgress();
        assert.ok(progress >= 29.9 && progress <= 30.1);
    });

    await t.test('calculateProgress calculates correctly while a session is active', () => {
        const engine = new MeditationEngine();

        const session1 = engine.startSession(100);
        session1.startTime = new Date(Date.now() - 50000); // 50 seconds passed
        engine.endSession(session1); // Completed 50s

        const session2 = engine.startSession(200);
        session2.startTime = new Date(Date.now() - 40000); // 40 seconds passed
        // Don't end session 2

        engine.calculateProgress();

        // Total duration: 300
        // Completed duration: 50 (session1) + ~40 (session2) = ~90
        // Expected progress: (90 / 300) * 100 = 30

        const progress = engine.getProgress();
        assert.ok(progress >= 29.9 && progress <= 30.1);
    });
});
