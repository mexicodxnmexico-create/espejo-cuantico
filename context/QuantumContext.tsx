"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { QuantumSystemState, INITIAL_STATE, QuantumEngine } from "@/lib/quantum-engine";

interface QuantumContextType {
  state: QuantumSystemState;
  dispatch: (action: "OBSERVE" | "REFLECT" | "RESET") => void;
  loading: boolean;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export function QuantumProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuantumSystemState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  // ⚡ BOLT OPTIMIZATION: Use a ref for the latest state to ensure stable access
  // in debounced effects and event listeners without re-binding.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem("quantum_state_v2");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse quantum state", e);
      }
    }
    setLoading(false);
  }, []);

  // ⚡ BOLT OPTIMIZATION: Debounce localStorage writes (500ms) to prevent
  // main-thread blocking during frequent state updates.
  useEffect(() => {
    if (loading) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
      } catch (e) {
        console.error("Failed to save quantum state", e);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, loading]);

  // ⚡ BOLT OPTIMIZATION: Ensure the latest state is saved immediately on tab closure
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const dispatch = useCallback((action: "OBSERVE" | "REFLECT" | "RESET") => {
    setState((prev) => QuantumEngine.transition(prev, action));
  }, []);

  // ⚡ BOLT OPTIMIZATION: Memoize provider value to prevent unnecessary re-renders
  // of consumer components when state, dispatch, or loading hasn't changed.
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    loading
  }), [state, dispatch, loading]);

  return (
    <QuantumContext.Provider value={contextValue}>
      {children}
    </QuantumContext.Provider>
  );
}

export function useQuantum() {
  const context = useContext(QuantumContext);
  if (context === undefined) {
    throw new Error("useQuantum must be used within a QuantumProvider");
  }
  return context;
}
