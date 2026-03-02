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

test('Engine should transition to COLLAPSED state when coherence drops to 0 or below', (t) => {
    let state = { ...INITIAL_STATE, coherence: 1 };

    // Perform transition that reduces coherence by 1
    state = QuantumEngine.transition(state, "OBSERVE");

    assert.strictEqual(state.coherence, 0, 'Coherence should be 0');
    assert.strictEqual(state.phase, 'COLLAPSED', 'Phase should transition to COLLAPSED when coherence is <= 0');

    // Test going below 0 (though logic caps at 0, if it was possible)
    let stateBelow0 = { ...INITIAL_STATE, coherence: 0 };
    // Force coherence to something negative before secondary rules
    // (We test REFLECT with coherence <= 20 since it goes directly to COLLAPSED)
    let stateReflectCollapse = QuantumEngine.transition({ ...INITIAL_STATE, coherence: 20 }, "REFLECT");

    assert.strictEqual(stateReflectCollapse.phase, 'COLLAPSED', 'Phase should transition to COLLAPSED directly via REFLECT on low coherence');
});
