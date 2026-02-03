export type QuantumPhase = "IDLE" | "OBSERVING" | "REFLECTING" | "ENTANGLED" | "COLLAPSED";

export interface QuantumSystemState {
  phase: QuantumPhase;
  coherence: number; // 0 to 100
  entropy: number;   // 0 to 100
  history: string[];
  lastUpdate: number;
}

export const INITIAL_STATE: QuantumSystemState = {
  phase: "IDLE",
  coherence: 100,
  entropy: 0,
  history: ["Sistema inicializado."],
  lastUpdate: Date.now(),
};

export class QuantumEngine {
  static transition(state: QuantumSystemState, action: "OBSERVE" | "REFLECT" | "RESET"): QuantumSystemState {
    const newState = { ...state, lastUpdate: Date.now() };

    switch (action) {
      case "OBSERVE":
        newState.phase = "OBSERVING";
        newState.entropy += 2;
        newState.coherence = Math.max(0, newState.coherence - 1);
        newState.history.push("Observación registrada. La entropía aumenta.");
        break;

      case "REFLECT":
        if (state.coherence > 20) {
          newState.phase = "REFLECTING";
          newState.coherence = Math.max(0, newState.coherence - 5);
          newState.entropy += 5;
          newState.history.push("Reflexión proyectada. El sistema se recalibra.");
        } else {
          newState.phase = "COLLAPSED";
          newState.history.push("Colapso detectado. Coherencia insuficiente para reflejar.");
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
