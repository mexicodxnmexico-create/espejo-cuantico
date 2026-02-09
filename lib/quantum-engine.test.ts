import test from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from './quantum-engine';

test('QuantumEngine.transition should cap history at 100 items', () => {
  let state = { ...INITIAL_STATE, history: Array(100).fill('old entry') };

  // Perform an action
  const newState = QuantumEngine.transition(state, 'OBSERVE');

  assert.strictEqual(newState.history.length, 100);
  assert.strictEqual(newState.history[99], 'Observación registrada. La entropía aumenta.');
  assert.strictEqual(newState.history[0], 'old entry');
});

test('QuantumEngine.transition should cap history at 100 items even when starting from more', () => {
    let state = { ...INITIAL_STATE, history: Array(150).fill('old entry') };

    const newState = QuantumEngine.transition(state, 'OBSERVE');

    assert.strictEqual(newState.history.length, 100);
});
