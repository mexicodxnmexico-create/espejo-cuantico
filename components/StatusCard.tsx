"use client";

import { useQuantum } from "@/context/QuantumContext";

export function StatusCard() {
  const { state, reflect, reset } = useQuantum();

  return (
    <div style={{ padding: "2rem", borderRadius: "12px", border: "1px solid #eaeaea", backgroundColor: "#fafafa", textAlign: "center", margin: "2rem 0" }}>
      <h3>Estado Cuántico Actual</h3>
      <div style={{ fontSize: "2rem", fontWeight: "bold", margin: "1rem 0", color: state.coherence > 50 ? "#0070f3" : "#ff0000" }}>
        {state.coherence}% Coherencia
      </div>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Reflejos realizados: {state.reflections}
      </p>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button
          onClick={reflect}
          style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#0070f3", color: "#fff", cursor: "pointer" }}
        >
          Reflejar Intención
        </button>
        <button
          onClick={reset}
          style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #eaeaea", backgroundColor: "#fff", color: "#666", cursor: "pointer" }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
