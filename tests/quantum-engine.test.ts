import test from 'node:test';
import assert from 'node:assert';
import type { QuantumSystemState } from '../lib/quantum-engine.ts';
import { QuantumEngine, INITIAL_STATE } from '../lib/quantum-engine.ts';

test('QuantumEngine.transition', async (t) => {
    await t.test('REFLECT with coherence > 20', () => {
        const state: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 10,
            reflectionCount: 2,
            history: ['Event 1']
        };
        const newState = QuantumEngine.transition(state, 'REFLECT');

        assert.strictEqual(newState.phase, 'REFLECTING');
        assert.strictEqual(newState.coherence, 45); // 50 - 5
        assert.strictEqual(newState.entropy, 15); // 10 + 5
        assert.strictEqual(newState.reflectionCount, 3); // 2 + 1
        assert.deepStrictEqual(newState.history, ['Event 1', 'Reflexión proyectada. El sistema se recalibra.']);
    });

    await t.test('REFLECT with coherence <= 20', () => {
        const state: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 20,
            entropy: 10,
            history: ['Event 1']
        };
        const newState = QuantumEngine.transition(state, 'REFLECT');

        assert.strictEqual(newState.phase, 'COLLAPSED');
        assert.deepStrictEqual(newState.history, ['Event 1', 'Colapso detectado. Coherencia insuficiente para reflejar.']);
    });

    await t.test('RESET', () => {
        const state: QuantumSystemState = {
            phase: 'COLLAPSED',
            coherence: 0,
            entropy: 100,
            reflectionCount: 5,
            history: ['Event 1', 'Event 2'],
            lastUpdate: Date.now() - 1000
        };
        const newState = QuantumEngine.transition(state, 'RESET');

        assert.strictEqual(newState.phase, 'IDLE');
        assert.strictEqual(newState.coherence, 100);
        assert.strictEqual(newState.entropy, 0);
        assert.strictEqual(newState.reflectionCount, 0);
        assert.deepStrictEqual(newState.history, ['Sistema reiniciado manualmente.']);
    });

    await t.test('REFLECT secondary rule: entropy > 50 becomes ENTANGLED', () => {
        const state: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 48,
            history: ['Event 1']
        };
        const newState = QuantumEngine.transition(state, 'REFLECT');

        assert.strictEqual(newState.phase, 'ENTANGLED');
        assert.strictEqual(newState.entropy, 53);
    });

    await t.test('REFLECT history capping at 100 items', () => {
        const longHistory = Array.from({ length: 100 }, (_, i) => `Event ${i}`);

        const state: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 10,
            history: longHistory
        };
        const newState = QuantumEngine.transition(state, 'REFLECT');

        assert.strictEqual(newState.history.length, 100);
        assert.strictEqual(newState.history[99], 'Reflexión proyectada. El sistema se recalibra.');
        assert.strictEqual(newState.history[0], 'Event 1');
    });

    await t.test('REFLECT history capping for <= 20', () => {
        const longHistory = Array.from({ length: 100 }, (_, i) => `Event ${i}`);

        const state: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 20,
            entropy: 10,
            history: longHistory
        };
        const newState = QuantumEngine.transition(state, 'REFLECT');

        assert.strictEqual(newState.history.length, 100);
        assert.strictEqual(newState.history[99], 'Colapso detectado. Coherencia insuficiente para reflejar.');
        assert.strictEqual(newState.history[0], 'Event 1');
    });
});
