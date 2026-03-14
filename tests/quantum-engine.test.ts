import test from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from '../lib/quantum-engine.ts';
import type { QuantumSystemState } from '../lib/quantum-engine.ts';

test('QuantumEngine transitions', async (t) => {
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

test('QuantumEngine getStatusMessage', async (t) => {
    await t.test('returns correct message for COLLAPSED phase', () => {
        const state: QuantumSystemState = { ...INITIAL_STATE, phase: 'COLLAPSED' };
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'El espejo se ha quebrado. Reinicia para restaurar la armonía.'
        );
    });

    await t.test('returns correct message for ENTANGLED phase', () => {
        const state: QuantumSystemState = { ...INITIAL_STATE, phase: 'ENTANGLED' };
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'Estás entrelazado con el sistema. Tus acciones tienen consecuencias globales.'
        );
    });

    await t.test('returns correct message for low coherence (< 50)', () => {
        const state: QuantumSystemState = { ...INITIAL_STATE, phase: 'OBSERVING', coherence: 49 };
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'La señal es débil. El ruido está ganando.'
        );
    });

    await t.test('returns correct message for stable system (high coherence, not collapsed/entangled)', () => {
        const state: QuantumSystemState = { ...INITIAL_STATE, phase: 'IDLE', coherence: 100 };
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'Sistema estable. El espejo aguarda tu intención.'
        );
    });

    await t.test('prioritizes COLLAPSED over low coherence', () => {
        const state: QuantumSystemState = { ...INITIAL_STATE, phase: 'COLLAPSED', coherence: 10 };
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'El espejo se ha quebrado. Reinicia para restaurar la armonía.'
        );
    });

    await t.test('prioritizes ENTANGLED over low coherence', () => {
        const state: QuantumSystemState = { ...INITIAL_STATE, phase: 'ENTANGLED', coherence: 10 };
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'Estás entrelazado con el sistema. Tus acciones tienen consecuencias globales.'
        );
    });
});
