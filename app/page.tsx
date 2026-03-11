"use client";

import { useQuantum } from "@/context/QuantumContext";
import { QuantumEngine } from "@/lib/quantum-engine";
import { Onboarding } from "@/components/Onboarding";
import { PersonalInsight } from "@/components/PersonalInsight";
import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { Header } from "@/components/Header";
import { CSSProperties } from "react";
import dynamic from "next/dynamic";

// ⚡ BOLT OPTIMIZATION: Lazy-load the heavy 3D component
// This keeps the initial bundle light and speeds up the first paint.
const QuantumCanvas = dynamic(
  () => import("@/components/QuantumCanvas").then((mod) => mod.QuantumCanvas),
  {
    ssr: false,
    loading: () => <div style={{ height: "24rem", backgroundColor: "#000", borderRadius: "0.75rem", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Cargando núcleo visual...</div>
  }
);

// ⚡ BOLT OPTIMIZATION: Extract static styles to module-level constants
// This prevents object re-creation on every render, reducing garbage collection pressure.
const CONTAINER_STYLE: CSSProperties = { maxWidth: "800px", margin: "0 auto", padding: "0 1rem" };
const LOADING_STYLE: CSSProperties = { padding: "2rem", textAlign: "center" };
const MAIN_STYLE: CSSProperties = { padding: "4rem 0" };
const HEADER_SECTION_STYLE: CSSProperties = { textAlign: "center", marginBottom: "4rem" };
const H1_STYLE: CSSProperties = { fontSize: "3.5rem", marginBottom: "1rem", letterSpacing: "-0.05em" };
const STATUS_STYLE: CSSProperties = { fontSize: "1.25rem", color: "#666", maxWidth: "600px", margin: "0 auto" };
const GRID_STYLE: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" };
const CARD_STYLE: CSSProperties = { padding: "2rem", borderRadius: "16px", border: "1px solid #eaeaea", textAlign: "center" };
const CARD_LABEL_STYLE: CSSProperties = { fontSize: "0.8rem", textTransform: "uppercase", color: "#555", fontWeight: "bold" };
const COHERENCE_VALUE_STYLE: CSSProperties = { fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0" };
const COHERENCE_STABLE_STYLE: CSSProperties = { ...COHERENCE_VALUE_STYLE, color: "#000" };
const COHERENCE_CRITICAL_STYLE: CSSProperties = { ...COHERENCE_VALUE_STYLE, color: "#ff0000" };
const ENTROPY_VALUE_STYLE: CSSProperties = { fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0" };
const OBSERVE_BTN_STYLE: CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #000", background: "none", cursor: "pointer", fontWeight: "bold" };
const REFLECT_BTN_STYLE: CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "12px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" };
const OBSERVE_BTN_DISABLED_STYLE: CSSProperties = { ...OBSERVE_BTN_STYLE, opacity: 0.5, cursor: "not-allowed" };
const REFLECT_BTN_DISABLED_STYLE: CSSProperties = { ...REFLECT_BTN_STYLE, opacity: 0.5, cursor: "not-allowed" };

const COLLAPSED_STYLE: CSSProperties = { padding: "2rem", backgroundColor: "#fff0f0", borderRadius: "12px", border: "1px solid #ff0000", textAlign: "center", marginBottom: "4rem", marginTop: "4rem" };
const COLLAPSED_H3_STYLE: CSSProperties = { color: "#ff0000", margin: 0 };
const COLLAPSED_P_STYLE: CSSProperties = { margin: "1rem 0" };
const RESET_BTN_STYLE: CSSProperties = { padding: "0.5rem 2rem", backgroundColor: "#ff0000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };
const HISTORY_SECTION_STYLE: CSSProperties = { marginBottom: "1.5rem" };
const LOG_CONTAINER_STYLE: CSSProperties = {
  backgroundColor: "#fafafa",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #eaeaea",
  height: "200px",
  overflowY: "auto",
  fontFamily: "monospace",
  fontSize: "0.9rem"
};
const LIST_STYLE: CSSProperties = { display: "flex", flexDirection: "column-reverse", listStyle: "none", padding: 0, margin: 0 };
const FOOTER_STYLE: CSSProperties = { padding: "4rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#555", fontSize: "0.8rem" };
const HISTORY_ITEM_STYLE_BASE: CSSProperties = { marginBottom: "0.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" };

// ⚡ BOLT OPTIMIZATION: Static style constants for HistoryItem
// Replaces useMemo hook to eliminate hook overhead and object creation during renders.
const LATEST_HISTORY_ITEM_STYLE: CSSProperties = { ...HISTORY_ITEM_STYLE_BASE, color: "#000" };
const NORMAL_HISTORY_ITEM_STYLE: CSSProperties = { ...HISTORY_ITEM_STYLE_BASE, color: "#555" };

// ⚡ BOLT OPTIMIZATION: Memoized HistoryItem component
// Prevents re-rendering of existing history items when a new one is added.
const HistoryItem = memo(function HistoryItem({ entry, isLatest }: { entry: string; isLatest: boolean }) {
  return (
    <li style={isLatest ? LATEST_HISTORY_ITEM_STYLE : NORMAL_HISTORY_ITEM_STYLE}>
      {isLatest ? "> " : "  "} {entry}
    </li>
  );
});
HistoryItem.displayName = "HistoryItem";

export default function Home() {
  const { state, loading, dispatch } = useQuantum();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const restoreBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state.phase === "COLLAPSED") {
      restoreBtnRef.current?.focus();
    }
  }, [state.phase]);


  // ⚡ BOLT OPTIMIZATION: Limit rendering to last 50 items and use CSS for reversal.
  // This keeps keys stable (O(1) updates) and avoids O(n) reverse() calls.
  const historyToRender = useMemo(() => state.history.slice(-50), [state.history]);
  const startIndex = Math.max(0, state.history.length - 50);

  // ⚡ BOLT OPTIMIZATION: Memoize status message
  // Prevents string allocation and calculation on every render.
  const statusMessage = useMemo(() => QuantumEngine.getStatusMessage(state), [state]);

  // ⚡ BOLT OPTIMIZATION: Memoize date string
  // toLocaleTimeString is expensive to call in render loop if not needed
  const lastUpdateString = useMemo(() => new Date(state.lastUpdate).toLocaleTimeString(), [state.lastUpdate]);

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
        <QuantumCanvas />

        <section style={HEADER_SECTION_STYLE}>
          <h1 style={H1_STYLE}>Espejo Cuántico</h1>
          <p role="status" aria-live="polite" style={STATUS_STYLE}>
            {statusMessage}
          </p>
        </section>

        <div style={GRID_STYLE}>
          <div style={CARD_STYLE}>
            <span style={CARD_LABEL_STYLE}>Coherencia</span>
            <div style={state.coherence > 30 ? COHERENCE_STABLE_STYLE : COHERENCE_CRITICAL_STYLE}>
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
            <div style={ENTROPY_VALUE_STYLE}>
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

        <PersonalInsight reflectionCount={state.reflectionCount} />

        {state.phase === "COLLAPSED" && (
          <div style={COLLAPSED_STYLE} role="alert">
            <h3 style={COLLAPSED_H3_STYLE}>SISTEMA COLAPSADO</h3>
            <p style={COLLAPSED_P_STYLE}>La incoherencia ha alcanzado el punto crítico.</p>
            <button ref={restoreBtnRef} onClick={() => dispatch("RESET")} style={RESET_BTN_STYLE}>
              Restaurar Espejo
            </button>
          </div>
        )}

        <section>
          <h2 style={HISTORY_SECTION_STYLE}>Historial de Eventos</h2>
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
                  <HistoryItem
                    key={absoluteIndex}
                    entry={entry}
                    isLatest={isLatest}
                  />
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer style={FOOTER_STYLE}>
        FASE ACTUAL: {state.phase} | ÚLTIMA SINCRONIZACIÓN: {lastUpdateString}
      </footer>
    </div>
  );
}
