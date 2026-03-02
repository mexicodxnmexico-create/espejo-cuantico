import test from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from '../lib/quantum-engine';

test('QuantumEngine.transition', async (t) => {
    await t.test('transitions to ENTANGLED when entropy > 50 and phase is not COLLAPSED', () => {
        const initialState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 49,
            phase: 'IDLE' as any,
        };

        const newState = QuantumEngine.transition(initialState, 'OBSERVE');

        assert.strictEqual(newState.entropy, 51);
        assert.strictEqual(newState.phase, 'ENTANGLED');
    });

    await t.test('transitions to COLLAPSED instead of ENTANGLED when coherence <= 0', () => {
        const initialState = {
            ...INITIAL_STATE,
            coherence: 1,
            entropy: 49,
            phase: 'IDLE' as any,
        };

        const newState = QuantumEngine.transition(initialState, 'OBSERVE');

        assert.strictEqual(newState.entropy, 51);
        assert.strictEqual(newState.coherence, 0);
        assert.strictEqual(newState.phase, 'COLLAPSED');
    });

    await t.test('does not transition to ENTANGLED if entropy <= 50', () => {
        const initialState = {
            ...INITIAL_STATE,
            coherence: 50,
            entropy: 48,
            phase: 'IDLE' as any,
        };

        const newState = QuantumEngine.transition(initialState, 'OBSERVE');

        assert.strictEqual(newState.entropy, 50);
        assert.strictEqual(newState.phase, 'OBSERVING');
    });
});
