"use client";

import { useQuantum } from "@/context/QuantumContext";
import { QuantumEngine } from "@/lib/quantum-engine";
import { Onboarding } from "@/components/Onboarding";
import { PersonalInsight } from "@/components/PersonalInsight";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";

export default function Home() {
  const { state, loading, dispatch } = useQuantum();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // ⚡ BOLT OPTIMIZATION: Limit rendering to last 50 items and use CSS for reversal.
  // This keeps keys stable (O(1) updates) and avoids O(n) reverse() calls.
  const historyToRender = useMemo(() => state.history.slice(-50), [state.history]);
  const startIndex = Math.max(0, state.history.length - 50);

  useEffect(() => {
    const hasSeen = localStorage.getItem("quantum_onboarded");
    if (!hasSeen) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem("quantum_onboarded", "true");
  }, []);

  if (loading) return <div style={LOADING_STYLE}>Sincronizando con el núcleo...</div>;

  return (
    <div style={CONTAINER_STYLE}>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <Header />

      <main style={MAIN_STYLE}>
        <section style={HEADER_SECTION_STYLE}>
          <h1 style={H1_STYLE}>Espejo Cuántico</h1>
          <p role="status" aria-live="polite" style={STATUS_STYLE}>
            {statusMessage}
          </p>
        </section>

        <div style={GRID_STYLE}>
          <div style={CARD_STYLE}>
            <span style={CARD_LABEL_STYLE}>Coherencia</span>
            <div style={{ fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0", color: state.coherence > 30 ? "#000" : "#ff0000" }}>
              {state.coherence}%
            </div>
            <button
              onClick={() => dispatch("OBSERVE")}
              disabled={state.phase === "COLLAPSED"}
              style={OBSERVE_BTN_STYLE}
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
              style={REFLECT_BTN_STYLE}
            >
              Reflejar
            </button>
          </div>
        </div>

        <PersonalInsight reflectionCount={state.reflectionCount} />

        {state.phase === "COLLAPSED" && (
          <div style={COLLAPSED_STYLE}>
            <h3 style={COLLAPSED_H3_STYLE}>SISTEMA COLAPSADO</h3>
            <p style={COLLAPSED_P_STYLE}>La incoherencia ha alcanzado el punto crítico.</p>
            <button onClick={() => dispatch("RESET")} style={RESET_BTN_STYLE}>
              Restaurar Espejo
            </button>
          </div>
        )}

        <section>
          <h2 style={{ marginBottom: "1.5rem" }}>Historial de Eventos</h2>
          <div style={{
            backgroundColor: "#fafafa",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #eaeaea",
            height: "200px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "0.9rem"
          }}>
            <div style={{ display: "flex", flexDirection: "column-reverse" }}>
              {historyToRender.map((entry, i) => {
                const isLatest = i === historyToRender.length - 1;
                const absoluteIndex = startIndex + i;
                return (
                  <div key={absoluteIndex} style={{ marginBottom: "0.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem", color: isLatest ? "#000" : "#999" }}>
                    {isLatest ? "> " : "  "} {entry}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: "4rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#999", fontSize: "0.8rem" }}>
        FASE ACTUAL: {state.phase} | ÚLTIMA SINCRONIZACIÓN: {new Date(state.lastUpdate).toLocaleTimeString()}
      </footer>
    </div>
  );
}
