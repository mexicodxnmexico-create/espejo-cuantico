🎯 **What:** The `RESET` action in `QuantumEngine.transition` was previously untested, leaving a coverage gap for this critical edge case.
📊 **Coverage:** The new test validates that when `RESET` is invoked on a modified state, it correctly clears accumulated entropy, resets coherence, returns the phase to `IDLE`, and assigns the specific `"Sistema reiniciado manualmente."` history message, while also verifying that `lastUpdate` is correctly updated.
✨ **Result:** Test coverage for `QuantumEngine` is improved, ensuring reliability when resetting the system.
