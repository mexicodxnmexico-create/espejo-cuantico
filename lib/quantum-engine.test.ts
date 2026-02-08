import { test, describe, it } from "node:test";
import assert from "node:assert";
import { QuantumEngine, INITIAL_STATE, QuantumSystemState } from "./quantum-engine";

describe("QuantumEngine", () => {
  it("should have initial state", () => {
    assert.strictEqual(INITIAL_STATE.coherence, 100);
    assert.strictEqual(INITIAL_STATE.entropy, 0);
    assert.strictEqual(INITIAL_STATE.phase, "IDLE");
  });

  it("should increase entropy when OBSERVE is called", () => {
    const newState = QuantumEngine.transition(INITIAL_STATE, "OBSERVE");
    assert.strictEqual(newState.entropy, 2);
    assert.strictEqual(newState.coherence, 99);
    assert.strictEqual(newState.phase, "OBSERVING");
    assert.strictEqual(newState.history.length, 2);
  });

  it("should decrease coherence significantly when REFLECT is called", () => {
    // Need coherence > 20
    const startState: QuantumSystemState = { ...INITIAL_STATE, coherence: 50 };
    const newState = QuantumEngine.transition(startState, "REFLECT");
    assert.strictEqual(newState.coherence, 45);
    assert.strictEqual(newState.entropy, 5);
    assert.strictEqual(newState.phase, "REFLECTING");
    assert.strictEqual(newState.reflectionCount, 1);
  });

  it("should collapse if coherence drops to 0", () => {
    const startState: QuantumSystemState = { ...INITIAL_STATE, coherence: 1 };
    const newState = QuantumEngine.transition(startState, "OBSERVE");
    // Coherence becomes 0
    assert.strictEqual(newState.coherence, 0);
    assert.strictEqual(newState.phase, "COLLAPSED");
  });

  it("should enter ENTANGLED phase if entropy > 50", () => {
    const startState: QuantumSystemState = { ...INITIAL_STATE, entropy: 49 };
    const newState = QuantumEngine.transition(startState, "OBSERVE");
    // Entropy becomes 51
    assert.strictEqual(newState.entropy, 51);
    assert.strictEqual(newState.phase, "ENTANGLED");
  });

  it("should restore coherence and reduce entropy when ALIGN is called", () => {
    // Need entropy > 20
    const startState: QuantumSystemState = { ...INITIAL_STATE, entropy: 30, coherence: 50 };
    const newState = QuantumEngine.transition(startState, "ALIGN");
    assert.strictEqual(newState.entropy, 20); // 30 - 10
    assert.strictEqual(newState.coherence, 55); // 50 + 5
    assert.strictEqual(newState.phase, "ALIGNING");
    assert.ok(newState.history[newState.history.length - 1].includes("Alineación"));
  });

  it("should do nothing when ALIGN is called if entropy <= 20", () => {
    const startState: QuantumSystemState = { ...INITIAL_STATE, entropy: 20 };
    const newState = QuantumEngine.transition(startState, "ALIGN");
    assert.strictEqual(newState.entropy, 20);
    assert.strictEqual(newState.phase, "IDLE"); // Should remain IDLE
    assert.strictEqual(newState.history.length, startState.history.length);
  });
});
