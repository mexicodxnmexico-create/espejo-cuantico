import { test } from 'node:test';
import assert from 'node:assert';
import { QuantumEngine, INITIAL_STATE } from './quantum-engine';

test('History should be capped at 100 items', (t) => {
  let state = { ...INITIAL_STATE };
  // Start with empty history to be clean
  state.history = [];

  // Fill history with more than 100 items via transitions
  for (let i = 0; i < 150; i++) {
    state = QuantumEngine.transition(state, "OBSERVE");
  }

  assert.strictEqual(state.history.length, 100, 'History should be capped at 100 items');
});

test('History should keep the most recent items when capped', (t) => {
    // Create state with 100 items: "Older 1" ... "Older 100"
    const oldHistory = Array.from({ length: 100 }, (_, i) => `Older ${i + 1}`);
    let state = { ...INITIAL_STATE, history: oldHistory };

    // Perform transition. This adds 1 item ("Observación...").
    // Logic should cap to 100, removing "Older 1".
    state = QuantumEngine.transition(state, "OBSERVE");

    assert.strictEqual(state.history.length, 100);
    assert.strictEqual(state.history[0], "Older 2");
    assert.strictEqual(state.history[99], "Observación registrada. La entropía aumenta.");
});
