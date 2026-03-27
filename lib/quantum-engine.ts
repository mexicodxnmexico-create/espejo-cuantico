export type QuantumPhase = "IDLE" | "OBSERVING" | "REFLECTING" | "ENTANGLED" | "COLLAPSED";

export interface QuantumSystemState {
  phase: QuantumPhase;
  coherence: number; // 0 to 100
  entropy: number;   // 0 to 100
  history: string[];
  reflectionCount: number; // ⚡ BOLT: Pre-calculated to avoid O(n) filtering during render
  lastUpdate: number;
}



export function isValidQuantumPhase(phase: any): phase is QuantumPhase {
  return ["IDLE", "OBSERVING", "REFLECTING", "ENTANGLED", "COLLAPSED"].includes(phase);
}

export function isValidQuantumState(state: any): state is QuantumSystemState {
  if (!state || typeof state !== 'object') return false;

  return (
    isValidQuantumPhase(state.phase) &&
    typeof state.coherence === 'number' &&
    typeof state.entropy === 'number' &&
    Array.isArray(state.history) &&
    state.history.every((item: any) => typeof item === 'string') &&
    typeof state.reflectionCount === 'number' &&
    typeof state.lastUpdate === 'number'
  );
}
export const INITIAL_STATE: QuantumSystemState = {
  phase: "IDLE",
  coherence: 100,
  entropy: 0,
  history: ["Sistema inicializado."],
  reflectionCount: 0,
  lastUpdate: Date.now(),
};

/**
 * ⚡ BOLT: Helper to update a fixed-size array efficiently.
 * While shift() is O(n), this pattern avoids double-allocation compared to [...arr, item].slice(-cap).
 */
function pushWithCap(history: string[], entry: string, cap: number = 100): string[] {
  const newHistory = history.slice();
  newHistory.push(entry);
  if (newHistory.length > cap) {
    newHistory.shift();
  }
  return newHistory;
}

export class QuantumEngine {
  static transition(state: QuantumSystemState, action: "OBSERVE" | "REFLECT" | "RESET"): QuantumSystemState {
    // ⚡ BOLT: Fix mutation bug by ensuring history is updated immutably
    const newState: QuantumSystemState = { ...state, lastUpdate: Date.now() };

    switch (action) {
      case "OBSERVE":
        newState.phase = "OBSERVING";
        newState.entropy += 2;
        newState.coherence = Math.max(0, newState.coherence - 1);
        // ⚡ BOLT: Optimized fixed-size array update
        newState.history = pushWithCap(state.history, "Observación registrada. La entropía aumenta.");
        break;

      case "REFLECT":
        if (state.coherence > 20) {
          newState.phase = "REFLECTING";
          newState.coherence = Math.max(0, newState.coherence - 5);
          newState.entropy += 5;
          newState.reflectionCount += 1;
          // ⚡ BOLT: Optimized fixed-size array update
          newState.history = pushWithCap(state.history, "Reflexión proyectada. El sistema se recalibra.");
        } else {
          newState.phase = "COLLAPSED";
          // ⚡ BOLT: Optimized fixed-size array update
          newState.history = pushWithCap(state.history, "Colapso detectado. Coherencia insuficiente para reflejar.");
        }
        break;

      case "RESET":
        return { ...INITIAL_STATE, history: ["Sistema reiniciado manualmente."] };
    }

    // Secondary Rules
    if (newState.entropy > 50 && newState.phase !== "COLLAPSED") {
      newState.phase = "ENTANGLED";
    }

    if (newState.coherence <= 0) {
      newState.phase = "COLLAPSED";
    }

    return newState;
  }

  static getStatusMessage(state: QuantumSystemState): string {
    if (state.phase === "COLLAPSED") return "El espejo se ha quebrado. Reinicia para restaurar la armonía.";
    if (state.phase === "ENTANGLED") return "Estás entrelazado con el sistema. Tus acciones tienen consecuencias globales.";
    if (state.coherence < 50) return "La señal es débil. El ruido está ganando.";
    return "Sistema estable. El espejo aguarda tu intención.";
  }
}
