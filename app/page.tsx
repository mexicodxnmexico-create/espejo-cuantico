"use client";

import { useQuantum } from "@/context/QuantumContext";
import { QuantumEngine } from "@/lib/quantum-engine";
import { Onboarding } from "@/components/Onboarding";
import { PersonalInsight } from "@/components/PersonalInsight";
import { QuantumField } from "@/components/QuantumField";
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

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Sincronizando con el núcleo...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <Header />

      <main style={{ padding: "4rem 0" }}>
        <section style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", letterSpacing: "-0.05em" }}>Espejo Cuántico</h1>
          <p style={{ fontSize: "1.25rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            {QuantumEngine.getStatusMessage(state)}
          </p>
        </section>

        <QuantumField coherence={state.coherence} entropy={state.entropy} phase={state.phase} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" }}>
          <div style={{ padding: "2rem", borderRadius: "16px", border: "1px solid #eaeaea", textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#999", fontWeight: "bold" }}>Coherencia</span>
            <div style={{ fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0", color: state.coherence > 30 ? "#000" : "#ff0000" }}>
              {state.coherence}%
            </div>
            <button
              onClick={() => dispatch("OBSERVE")}
              disabled={state.phase === "COLLAPSED"}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #000", background: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              Observar
            </button>
          </div>

          <div style={{ padding: "2rem", borderRadius: "16px", border: "1px solid #eaeaea", textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#999", fontWeight: "bold" }}>Entropía</span>
            <div style={{ fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0" }}>
              {state.entropy}
            </div>
            <button
              onClick={() => dispatch("REFLECT")}
              disabled={state.phase === "COLLAPSED"}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              Reflejar
            </button>
          </div>
        </div>

        <PersonalInsight reflectionCount={state.reflectionCount} />

        {state.phase === "COLLAPSED" && (
          <div style={{ padding: "2rem", backgroundColor: "#fff0f0", borderRadius: "12px", border: "1px solid #ff0000", textAlign: "center", marginBottom: "4rem", marginTop: "4rem" }}>
            <h3 style={{ color: "#ff0000", margin: 0 }}>SISTEMA COLAPSADO</h3>
            <p style={{ margin: "1rem 0" }}>La incoherencia ha alcanzado el punto crítico.</p>
            <button onClick={() => dispatch("RESET")} style={{ padding: "0.5rem 2rem", backgroundColor: "#ff0000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
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
