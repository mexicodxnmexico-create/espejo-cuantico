"use client";

import { useQuantum } from "@/context/QuantumContext";
import { QuantumEngine } from "@/lib/quantum-engine";
import { Onboarding } from "@/components/Onboarding";
import { PersonalInsight } from "@/components/PersonalInsight";
import { useState, useEffect, useMemo, useCallback, memo, CSSProperties } from "react";
import { Header } from "@/components/Header";

// ⚡ BOLT OPTIMIZATION: Extract to memoized component to prevent O(n) re-renders
// Static styles extracted to module scope to prevent allocation overhead
const HISTORY_ITEM_STYLE: CSSProperties = {
  marginBottom: "0.5rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "0.5rem",
};

const HistoryItem = memo(function HistoryItem({
  entry,
  isLatest,
  absoluteIndex
}: {
  entry: string,
  isLatest: boolean,
  absoluteIndex: number
}) {
  const style = useMemo(() => ({
    ...HISTORY_ITEM_STYLE,
    color: isLatest ? "#000" : "#555" // #555 used for WCAG contrast compliance
  }), [isLatest]);

  return (
    <div key={absoluteIndex} style={style}>
      {isLatest ? "> " : "  "} {entry}
    </div>
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

  // ⚡ BOLT OPTIMIZATION: Memoize expensive date parsing/formatting in render body
  const formattedLastUpdate = useMemo(
    () => new Date(state.lastUpdate).toLocaleTimeString(),
    [state.lastUpdate]
  );

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
    <div style={ROOT_CONTAINER_STYLE}>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <Header />

      <main style={MAIN_STYLE}>
        <section style={HEADER_SECTION_STYLE}>
          <h1 style={H1_STYLE}>Espejo Cuántico</h1>
          <p style={H1_SUBTITLE_STYLE}>
            {statusMessage}
          </p>
        </section>

        <div style={GRID_CONTAINER_STYLE}>
          <div style={CARD_STYLE}>
            <span style={CARD_LABEL_STYLE}>Coherencia</span>
            <div style={{ ...VALUE_STYLE, color: state.coherence > 30 ? "#000" : "#ff0000" }}>
              {state.coherence}%
            </div>
            <button
              onClick={() => dispatch("OBSERVE")}
              disabled={state.phase === "COLLAPSED"}
              style={OBSERVE_BUTTON_STYLE}
            >
              Observar
            </button>
          </div>

          <div style={CARD_STYLE}>
            <span style={CARD_LABEL_STYLE}>Entropía</span>
            <div style={VALUE_STYLE}>
              {state.entropy}
            </div>
            <button
              onClick={() => dispatch("REFLECT")}
              disabled={state.phase === "COLLAPSED"}
              style={REFLECT_BUTTON_STYLE}
            >
              Reflejar
            </button>
          </div>
        </div>

        <PersonalInsight reflectionCount={state.reflectionCount} />

        {state.phase === "COLLAPSED" && (
          <div style={COLLAPSED_BANNER_STYLE}>
            <h3 style={COLLAPSED_TITLE_STYLE}>SISTEMA COLAPSADO</h3>
            <p style={{ margin: "1rem 0" }}>La incoherencia ha alcanzado el punto crítico.</p>
            <button onClick={() => dispatch("RESET")} style={COLLAPSED_BUTTON_STYLE}>
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
              {historyToRender.map((entry, i) => (
                <HistoryItem
                  key={startIndex + i}
                  entry={entry}
                  isLatest={i === historyToRender.length - 1}
                  absoluteIndex={startIndex + i}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: "4rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#999", fontSize: "0.8rem" }}>
        FASE ACTUAL: {state.phase} | ÚLTIMA SINCRONIZACIÓN: {formattedLastUpdate}
      </footer>
    </div>
  );
}
