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

  // ⚡ BOLT: Keep a ref to the latest state to avoid re-binding event listeners
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Persistence (Addressing "memory" requirement)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quantum_state_v2");
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse quantum state", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ⚡ BOLT OPTIMIZATION: Debounce localStorage saves to reduce main-thread blockage
  // during rapid state updates. JSON.stringify and setItem are synchronous and expensive.
  useEffect(() => {
    if (loading) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(state));
      } catch (e) {
        // Handle QuotaExceededError or other storage issues gracefully
        console.error("Failed to save quantum state", e);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, loading]);

  // ⚡ BOLT: Ensure state is saved immediately when the tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!loading && stateRef.current) {
        try {
          localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
        } catch (e) {
          console.error("Failed to save state on unload", e);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [loading]);

  const dispatch = useCallback((action: "OBSERVE" | "REFLECT" | "RESET") => {
    setState((prev) => QuantumEngine.transition(prev, action));
  }, []);

  // ⚡ BOLT OPTIMIZATION: Memoize context value to prevent unnecessary re-renders
  // of components that only need dispatch or loading status.
  const value = useMemo(() => ({ state, dispatch, loading }), [state, dispatch, loading]);

  return (
    <QuantumContext.Provider value={value}>
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
