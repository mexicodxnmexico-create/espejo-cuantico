import { CSSProperties } from "react";
import { QuantumSystemState } from "@/lib/quantum-engine";

const GRID_STYLE: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" };
const CARD_STYLE: CSSProperties = { padding: "2rem", borderRadius: "16px", border: "1px solid #eaeaea", textAlign: "center" };
const CARD_LABEL_STYLE: CSSProperties = { fontSize: "0.8rem", textTransform: "uppercase", color: "#555", fontWeight: "bold" };
const OBSERVE_BTN_STYLE: CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #000", background: "none", cursor: "pointer", fontWeight: "bold" };
const REFLECT_BTN_STYLE: CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "12px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" };
const OBSERVE_BTN_DISABLED_STYLE: CSSProperties = { ...OBSERVE_BTN_STYLE, opacity: 0.5, cursor: "not-allowed" };
const REFLECT_BTN_DISABLED_STYLE: CSSProperties = { ...REFLECT_BTN_STYLE, opacity: 0.5, cursor: "not-allowed" };

interface ControlPanelProps {
  state: QuantumSystemState;
  dispatch: (action: "OBSERVE" | "REFLECT" | "RESET") => void;
}

export function ControlPanel({ state, dispatch }: ControlPanelProps) {
  return (
    <div style={GRID_STYLE}>
      <div style={CARD_STYLE}>
        <span style={CARD_LABEL_STYLE}>Coherencia</span>
        <div style={{ fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0", color: state.coherence > 30 ? "#000" : "#ff0000" }}>
          {state.coherence}%
        </div>
        <button
          onClick={() => dispatch("OBSERVE")}
          disabled={state.phase === "COLLAPSED"}
          style={state.phase === "COLLAPSED" ? OBSERVE_BTN_DISABLED_STYLE : OBSERVE_BTN_STYLE}
          aria-disabled={state.phase === "COLLAPSED"}
          title={state.phase === "COLLAPSED" ? "Acción no disponible: Sistema colapsado" : undefined}
        >
          Observar
        </button>
      </div>

      <div style={CARD_STYLE}>
        <span style={CARD_LABEL_STYLE}>Entropía</span>
        <div style={{ fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0" }}>
          {state.entropy}
        </div>
        <button
          onClick={() => dispatch("REFLECT")}
          disabled={state.phase === "COLLAPSED"}
          style={state.phase === "COLLAPSED" ? REFLECT_BTN_DISABLED_STYLE : REFLECT_BTN_STYLE}
          aria-disabled={state.phase === "COLLAPSED"}
          title={state.phase === "COLLAPSED" ? "Acción no disponible: Sistema colapsado" : undefined}
        >
          Reflejar
        </button>
      </div>
    </div>
  );
}
