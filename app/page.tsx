"use client";

import { useQuantum } from "@/context/QuantumContext";
import { QuantumEngine } from "@/lib/quantum-engine";
import { Onboarding } from "@/components/Onboarding";
import { PersonalInsight } from "@/components/PersonalInsight";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Header } from "@/components/Header";

// ⚡ BOLT OPTIMIZATION: Extract static styles to module-scope constants
// to avoid redundant object creation and maintain referential stability for memoized components.
const CONTAINER_STYLE: React.CSSProperties = { maxWidth: "800px", margin: "0 auto", padding: "0 1rem" };
const MAIN_STYLE: React.CSSProperties = { padding: "4rem 0" };
const HERO_SECTION_STYLE: React.CSSProperties = { textAlign: "center", marginBottom: "4rem" };
const H1_STYLE: React.CSSProperties = { fontSize: "3.5rem", marginBottom: "1rem", letterSpacing: "-0.05em" };
const STATUS_STYLE: React.CSSProperties = { fontSize: "1.25rem", color: "#666", maxWidth: "600px", margin: "0 auto" };
const GRID_STYLE: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" };
const CARD_STYLE: React.CSSProperties = { padding: "2rem", borderRadius: "16px", border: "1px solid #eaeaea", textAlign: "center" };
const LABEL_STYLE: React.CSSProperties = { fontSize: "0.8rem", textTransform: "uppercase", color: "#555", fontWeight: "bold" };
const VALUE_STYLE: React.CSSProperties = { fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0" };
const BUTTON_OBSERVE_STYLE: React.CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #000", background: "none", cursor: "pointer", fontWeight: "bold" };
const BUTTON_REFLECT_STYLE: React.CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "12px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" };
const COLLAPSE_BANNER_STYLE: React.CSSProperties = { padding: "2rem", backgroundColor: "#fff0f0", borderRadius: "12px", border: "1px solid #ff0000", textAlign: "center", marginBottom: "4rem", marginTop: "4rem" };
const COLLAPSE_TITLE_STYLE: React.CSSProperties = { color: "#ff0000", margin: 0 };
const COLLAPSE_BUTTON_STYLE: React.CSSProperties = { padding: "0.5rem 2rem", backgroundColor: "#ff0000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };
const LOG_CONTAINER_STYLE: React.CSSProperties = {
  backgroundColor: "#fafafa",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #eaeaea",
  height: "200px",
  overflowY: "auto",
  fontFamily: "monospace",
  fontSize: "0.9rem"
};
const LIST_STYLE: React.CSSProperties = { display: "flex", flexDirection: "column-reverse", listStyle: "none", padding: 0, margin: 0 };
const FOOTER_STYLE: React.CSSProperties = { padding: "4rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#555", fontSize: "0.8rem" };

// ⚡ BOLT OPTIMIZATION: Extract and memoize individual history items.
// This ensures O(1) render performance for the log list when new entries are added,
// as existing items will not re-render.
const HistoryItem = memo(({ entry, isLatest }: { entry: string; isLatest: boolean }) => {
  const style = useMemo(() => ({
    marginBottom: "0.5rem",
    borderBottom: "1px solid #eee",
    paddingBottom: "0.5rem",
    color: isLatest ? "#000" : "#555"
  }), [isLatest]);

  return (
    <li style={style}>
      {isLatest ? "> " : "  "} {entry}
    </li>
  );
});
HistoryItem.displayName = "HistoryItem";

export default function Home() {
  const { state, loading, dispatch } = useQuantum();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // ⚡ BOLT OPTIMIZATION: Limit rendering to last 50 items and use CSS for reversal.
  // This keeps keys stable (O(1) updates) and avoids O(n) reverse() calls.
  const historyToRender = useMemo(() => state.history.slice(-50), [state.history]);
  const startIndex = Math.max(0, state.history.length - 50);

  // ⚡ BOLT OPTIMIZATION: Memoize status message to avoid O(1) re-calculation
  // (though fast, it's good practice for consistency).
  const statusMessage = useMemo(() => QuantumEngine.getStatusMessage(state), [state]);

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
    <div style={CONTAINER_STYLE}>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <Header />

      <main style={MAIN_STYLE}>
        <section style={HERO_SECTION_STYLE}>
          <h1 style={H1_STYLE}>Espejo Cuántico</h1>
          <p role="status" aria-live="polite" style={STATUS_STYLE}>
            {statusMessage}
          </p>
        </section>

        <div style={GRID_STYLE}>
          <div style={CARD_STYLE}>
            <span style={LABEL_STYLE}>Coherencia</span>
            <div style={{ ...VALUE_STYLE, color: state.coherence > 30 ? "#000" : "#ff0000" }}>
              {state.coherence}%
            </div>
            <button
              onClick={() => dispatch("OBSERVE")}
              disabled={state.phase === "COLLAPSED"}
              style={BUTTON_OBSERVE_STYLE}
            >
              Observar
            </button>
          </div>

          <div style={CARD_STYLE}>
            <span style={LABEL_STYLE}>Entropía</span>
            <div style={VALUE_STYLE}>
              {state.entropy}
            </div>
            <button
              onClick={() => dispatch("REFLECT")}
              disabled={state.phase === "COLLAPSED"}
              style={BUTTON_REFLECT_STYLE}
            >
              Reflejar
            </button>
          </div>
        </div>

        <PersonalInsight reflectionCount={state.reflectionCount} />

        {state.phase === "COLLAPSED" && (
          <div style={COLLAPSE_BANNER_STYLE}>
            <h3 style={COLLAPSE_TITLE_STYLE}>SISTEMA COLAPSADO</h3>
            <p style={{ margin: "1rem 0" }}>La incoherencia ha alcanzado el punto crítico.</p>
            <button onClick={() => dispatch("RESET")} style={COLLAPSE_BUTTON_STYLE}>
              Restaurar Espejo
            </button>
          </div>
        )}

        <section>
          <h2 style={{ marginBottom: "1.5rem" }}>Historial de Eventos</h2>
          <div
            role="log"
            aria-label="Historial de eventos"
            tabIndex={0}
            style={LOG_CONTAINER_STYLE}
          >
            <ul style={LIST_STYLE}>
              {historyToRender.map((entry, i) => {
                const isLatest = i === historyToRender.length - 1;
                const absoluteIndex = startIndex + i;
                return (
                  <HistoryItem key={absoluteIndex} entry={entry} isLatest={isLatest} />
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer style={FOOTER_STYLE}>
        FASE ACTUAL: {state.phase} | ÚLTIMA SINCRONIZACIÓN: {new Date(state.lastUpdate).toLocaleTimeString()}
      </footer>
    </div>
  );
}
