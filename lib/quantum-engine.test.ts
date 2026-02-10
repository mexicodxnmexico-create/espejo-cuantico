import { test } from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from './quantum-engine';

test('history capping should limit history to 100 items', () => {
  let state = INITIAL_STATE;

  // Perform 150 observations
  for (let i = 0; i < 150; i++) {
    state = QuantumEngine.transition(state, 'OBSERVE');
  }

  assert.strictEqual(state.history.length, 100, 'History should be capped at 100 items');
  assert.ok(state.history[0].includes('Observación registrada'), 'First item should be an observation (since initial state was sliced out)');
});

test('history capping should work with REFLECT', () => {
  let state = INITIAL_STATE;

  // Perform 20 observations to reduce coherence enough but not collapse
  for (let i = 0; i < 20; i++) {
    state = QuantumEngine.transition(state, 'OBSERVE');
  }

  // Perform 100 reflections (this will eventually collapse the system, but we want to check history)
  for (let i = 0; i < 100; i++) {
    state = QuantumEngine.transition(state, 'REFLECT');
  }

  assert.strictEqual(state.history.length, 100, 'History should be capped at 100 items even after many reflections');
});

test('RESET should restore history to 1 item', () => {
  let state = INITIAL_STATE;
  for (let i = 0; i < 150; i++) {
    state = QuantumEngine.transition(state, 'OBSERVE');
  }

  state = QuantumEngine.transition(state, 'RESET');
  assert.strictEqual(state.history.length, 1, 'History should be reset to 1 item');
  assert.strictEqual(state.history[0], 'Sistema reiniciado manualmente.');
});
