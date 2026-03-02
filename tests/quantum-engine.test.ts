import test from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from '../lib/quantum-engine';
import type { QuantumSystemState } from '../lib/quantum-engine';

test('QuantumEngine.getStatusMessage', async (t) => {
    const createState = (overrides: Partial<QuantumSystemState>): QuantumSystemState => ({
        ...INITIAL_STATE,
        ...overrides,
    });

    await t.test('returns collapsed message when phase is COLLAPSED', () => {
        const state = createState({ phase: 'COLLAPSED' });
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'El espejo se ha quebrado. Reinicia para restaurar la armonía.'
        );
    });

    await t.test('returns entangled message when phase is ENTANGLED', () => {
        const state = createState({ phase: 'ENTANGLED' });
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'Estás entrelazado con el sistema. Tus acciones tienen consecuencias globales.'
        );
    });

    await t.test('returns weak signal message when coherence is < 50', () => {
        const state = createState({ phase: 'IDLE', coherence: 49 });
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state),
            'La señal es débil. El ruido está ganando.'
        );
    });

    await t.test('returns stable system message when phase is normal and coherence >= 50', () => {
        const state50 = createState({ phase: 'IDLE', coherence: 50 });
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state50),
            'Sistema estable. El espejo aguarda tu intención.'
        );

        const state100 = createState({ phase: 'IDLE', coherence: 100 });
        assert.strictEqual(
            QuantumEngine.getStatusMessage(state100),
            'Sistema estable. El espejo aguarda tu intención.'
        );
    });
});
