import test from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from '../lib/quantum-engine.ts';
import type { QuantumSystemState } from '../lib/quantum-engine.ts';

test('QuantumEngine transitions', async (t) => {

    await t.test('OBSERVE - reduces coherence and increases entropy', () => {
        const initialState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 10,
            phase: 'IDLE',
        };

        const newState = QuantumEngine.transition(initialState, 'OBSERVE');

        assert.strictEqual(newState.phase, 'OBSERVING');
        assert.strictEqual(newState.coherence, 49); // 50 - 1
        assert.strictEqual(newState.entropy, 12); // 10 + 2
        assert.strictEqual(newState.history[newState.history.length - 1], 'Observación registrada. La entropía aumenta.');
    });

    await t.test('OBSERVE - coherence does not drop below 0', () => {
        const initialState = {
            ...INITIAL_STATE,
            coherence: 0,
            entropy: 10,
            phase: 'IDLE',
        };

        const newState = QuantumEngine.transition(initialState, 'OBSERVE');

        assert.strictEqual(newState.phase, 'COLLAPSED');
        assert.strictEqual(newState.coherence, 0); // Math.max(0, 0 - 1)
        assert.strictEqual(newState.entropy, 12); // 10 + 2
        assert.strictEqual(newState.history[newState.history.length - 1], 'Observación registrada. La entropía aumenta.');
    });

    await t.test('REFLECT - high coherence (> 20)', () => {
        const initialState: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 10,
            phase: 'OBSERVING',
            reflectionCount: 0,
        };

        const newState = QuantumEngine.transition(initialState, 'REFLECT');

        assert.strictEqual(newState.phase, 'REFLECTING');
        assert.strictEqual(newState.coherence, 45); // 50 - 5
        assert.strictEqual(newState.entropy, 15); // 10 + 5
        assert.strictEqual(newState.reflectionCount, 1);
        assert.strictEqual(newState.history[newState.history.length - 1], 'Reflexión proyectada. El sistema se recalibra.');
    });

    await t.test('REFLECT - exact threshold coherence (20)', () => {
        const initialState: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 20,
            entropy: 10,
            phase: 'OBSERVING',
            reflectionCount: 0,
        };

        const newState = QuantumEngine.transition(initialState, 'REFLECT');

        assert.strictEqual(newState.phase, 'COLLAPSED');
        assert.strictEqual(newState.coherence, 20); // Unchanged when collapsing due to low coherence in REFLECT
        assert.strictEqual(newState.entropy, 10); // Unchanged
        assert.strictEqual(newState.reflectionCount, 0); // Unchanged
        assert.strictEqual(newState.history[newState.history.length - 1], 'Colapso detectado. Coherencia insuficiente para reflejar.');
    });

    await t.test('REFLECT - low coherence (< 20)', () => {
        const initialState: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 15,
            entropy: 10,
            phase: 'OBSERVING',
            reflectionCount: 0,
        };

        const newState = QuantumEngine.transition(initialState, 'REFLECT');

        assert.strictEqual(newState.phase, 'COLLAPSED');
        assert.strictEqual(newState.coherence, 15);
        assert.strictEqual(newState.entropy, 10);
        assert.strictEqual(newState.reflectionCount, 0);
        assert.strictEqual(newState.history[newState.history.length - 1], 'Colapso detectado. Coherencia insuficiente para reflejar.');
    });

    await t.test('REFLECT - caps history at 100 items', () => {
        const initialState: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 10,
            phase: 'OBSERVING',
            reflectionCount: 0,
            history: Array(100).fill('Previous history item') // 100 items
        };

        const newState = QuantumEngine.transition(initialState, 'REFLECT');

        assert.strictEqual(newState.history.length, 100);
        assert.strictEqual(newState.history[0], 'Previous history item'); // Second item shifted to first
        assert.strictEqual(newState.history[99], 'Reflexión proyectada. El sistema se recalibra.'); // New item at the end
    });

    await t.test('RESET - restores initial state and history', () => {
        const initialState: QuantumSystemState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 10,
            phase: 'OBSERVING',
            reflectionCount: 5,
            history: ['History item 1', 'History item 2']
        };

        const newState = QuantumEngine.transition(initialState, 'RESET');

        assert.strictEqual(newState.phase, 'IDLE');
        assert.strictEqual(newState.coherence, 100);
        assert.strictEqual(newState.entropy, 0);
        assert.strictEqual(newState.reflectionCount, 0);
        assert.strictEqual(newState.history.length, 1);
        assert.strictEqual(newState.history[0], 'Sistema reiniciado manualmente.');
    });
});
