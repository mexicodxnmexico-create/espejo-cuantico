import test from 'node:test';
import assert from 'node:assert';
import { reducer, initialState } from '../context/MeditationContext.tsx';

test('MeditationContext reducer test suite', async (t) => {
    await t.test('ADD_SESSION adds a session to the state', () => {
        const action = { type: 'ADD_SESSION', payload: { id: 1, duration: 10 } };
        const newState = reducer(initialState, action);
        assert.deepStrictEqual(newState.sessions, [{ id: 1, duration: 10 }]);
        assert.strictEqual(newState.progress, 0);
        assert.strictEqual(newState.consciousnessLevel, 0);
    });

    await t.test('UPDATE_PROGRESS updates progress in the state', () => {
        const action = { type: 'UPDATE_PROGRESS', payload: 50 };
        const newState = reducer(initialState, action);
        assert.strictEqual(newState.progress, 50);
        assert.deepStrictEqual(newState.sessions, []);
    });

    await t.test('SET_CONSCIOUSNESS_LEVEL updates consciousnessLevel', () => {
        const action = { type: 'SET_CONSCIOUSNESS_LEVEL', payload: 7 };
        const newState = reducer(initialState, action);
        assert.strictEqual(newState.consciousnessLevel, 7);
        assert.deepStrictEqual(newState.sessions, []);
    });

    await t.test('default returns current state for unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' } as any;
        const newState = reducer(initialState, action);
        assert.strictEqual(newState, initialState); // Reference equality
    });
});
