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
import dynamic from 'next/dynamic';

const MeditacionAudioVisual3D = dynamic(
  () => import("@/components/meditacion/MeditacionAudioVisual3D").then(mod => mod.MeditacionAudioVisual3D),
  { ssr: false }
);

// ⚡ BOLT OPTIMIZATION: Extract static styles to module-level constants
// This prevents object re-creation on every render, reducing garbage collection pressure.
const CONTAINER_STYLE: CSSProperties = { maxWidth: "800px", margin: "0 auto", padding: "0 1rem" };
const LOADING_STYLE: CSSProperties = { padding: "2rem", textAlign: "center" };
const MAIN_STYLE: CSSProperties = { padding: "4rem 0" };
const HEADER_SECTION_STYLE: CSSProperties = { textAlign: "center", marginBottom: "4rem" };
const H1_STYLE: CSSProperties = { fontSize: "3.5rem", marginBottom: "1rem", letterSpacing: "-0.05em" };
const STATUS_STYLE: CSSProperties = { fontSize: "1.25rem", color: "#666", maxWidth: "600px", margin: "0 auto" };
const FOOTER_STYLE: CSSProperties = { padding: "4rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#555", fontSize: "0.8rem" };
const TABS_STYLE: CSSProperties = { display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" };
const TAB_BUTTON_STYLE: CSSProperties = { padding: "0.5rem 1rem", borderStyle: "solid", borderWidth: "1px", borderColor: "#ccc", borderRadius: "4px", background: "none", cursor: "pointer", fontSize: "1rem" };
const TAB_BUTTON_ACTIVE_STYLE: CSSProperties = { ...TAB_BUTTON_STYLE, background: "#000", color: "#fff", borderColor: "#000" };

export default function Home() {
  const { state, loading, dispatch } = useQuantum();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<"espejo" | "meditacion">("espejo");

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

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const nextTab = activeTab === "espejo" ? "meditacion" : "espejo";
      setActiveTab(nextTab);

      // Wait for React to render the new active tab, then focus it
      setTimeout(() => {
        const nextButton = document.getElementById(`tab-${nextTab}`);
        if (nextButton) nextButton.focus();
      }, 0);
    }
  };

  return (
    <div style={CONTAINER_STYLE}>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <Header />

      <div style={TABS_STYLE} role="tablist" aria-label="Modos de la aplicación">
        <button
          id="tab-espejo"
          role="tab"
          aria-selected={activeTab === "espejo"}
          aria-controls="panel-espejo"
          tabIndex={activeTab === "espejo" ? 0 : -1}
          style={activeTab === "espejo" ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_STYLE}
          onClick={() => setActiveTab("espejo")}
          onKeyDown={handleTabKeyDown}
        >
          Espejo Cuántico
        </button>
        <button
          id="tab-meditacion"
          role="tab"
          aria-selected={activeTab === "meditacion"}
          aria-controls="panel-meditacion"
          tabIndex={activeTab === "meditacion" ? 0 : -1}
          style={activeTab === "meditacion" ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_STYLE}
          onClick={() => setActiveTab("meditacion")}
          onKeyDown={handleTabKeyDown}
        >
          Meditación 3D
        </button>
      </div>

      <main style={MAIN_STYLE}>
        {activeTab === "espejo" ? (
          <div id="panel-espejo" role="tabpanel" aria-labelledby="tab-espejo" tabIndex={0}>
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
          </div>
        ) : (
          <div id="panel-meditacion" role="tabpanel" aria-labelledby="tab-meditacion" tabIndex={0}>
            <MeditacionAudioVisual3D onCompletarMeditacion={() => setActiveTab("espejo")} />
          </div>
        )}
      </main>

      <footer style={FOOTER_STYLE}>
        FASE ACTUAL: {state.phase} | ÚLTIMA SINCRONIZACIÓN: {lastUpdateString}
      </footer>
    </div>
  );
}
