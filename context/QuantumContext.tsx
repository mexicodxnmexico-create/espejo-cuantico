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
  const stateRef = useRef(state);

  // Keep ref in sync for beforeunload listener
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quantum_state_v2");
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load quantum state", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ⚡ BOLT OPTIMIZATION: Debounced persistence (500ms) to reduce main thread blocking
  // and O(n) JSON.stringify calls during rapid user interactions.
  useEffect(() => {
    if (loading) return;

    const handler = setTimeout(() => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save quantum state", e);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [state, loading]);

  // ⚡ BOLT OPTIMIZATION: Ensure immediate save on tab closure to prevent data loss
  // while using the debounce mechanism.
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
      } catch (e) {
        console.error("Failed to save quantum state on unload", e);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const dispatch = useCallback((action: "OBSERVE" | "REFLECT" | "RESET") => {
    setState((prev) => QuantumEngine.transition(prev, action));
  }, []);

  // ⚡ BOLT OPTIMIZATION: Memoize context value to prevent unnecessary re-renders
  // of consumers when the provider itself re-renders.
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
