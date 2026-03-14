"use client";

import { useQuantum } from "@/context/QuantumContext";
import { QuantumEngine } from "@/lib/quantum-engine";
import { Onboarding } from "@/components/Onboarding";
import { PersonalInsight } from "@/components/PersonalInsight";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { CSSProperties } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { CollapsedState } from "@/components/CollapsedState";
import { HistorySection } from "@/components/HistorySection";

// ⚡ BOLT OPTIMIZATION: Extract static styles to module-level constants
// This prevents object re-creation on every render, reducing garbage collection pressure.
const CONTAINER_STYLE: CSSProperties = { maxWidth: "800px", margin: "0 auto", padding: "0 1rem" };
const LOADING_STYLE: CSSProperties = { padding: "2rem", textAlign: "center" };
const MAIN_STYLE: CSSProperties = { padding: "4rem 0" };
const HEADER_SECTION_STYLE: CSSProperties = { textAlign: "center", marginBottom: "4rem" };
const H1_STYLE: CSSProperties = { fontSize: "3.5rem", marginBottom: "1rem", letterSpacing: "-0.05em" };
const STATUS_STYLE: CSSProperties = { fontSize: "1.25rem", color: "#666", maxWidth: "600px", margin: "0 auto" };
const FOOTER_STYLE: CSSProperties = { padding: "4rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#555", fontSize: "0.8rem" };

export default function Home() {
  const { state, loading, dispatch } = useQuantum();
  const [showOnboarding, setShowOnboarding] = useState(false);

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
        <section style={HEADER_SECTION_STYLE}>
          <h1 style={H1_STYLE}>Espejo Cuántico</h1>
          <p role="status" aria-live="polite" style={STATUS_STYLE}>
            {statusMessage}
          </p>
        </section>

        <ControlPanel state={state} dispatch={dispatch} />

        <PersonalInsight reflectionCount={state.reflectionCount} />

        {state.phase === "COLLAPSED" && (
          <CollapsedState dispatch={dispatch} />
        )}

        <HistorySection historyToRender={historyToRender} startIndex={startIndex} />
      </main>

      <footer style={FOOTER_STYLE}>
        FASE ACTUAL: {state.phase} | ÚLTIMA SINCRONIZACIÓN: {lastUpdateString}
      </footer>
    </div>
  );
}
