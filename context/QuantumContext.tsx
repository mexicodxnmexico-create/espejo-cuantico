"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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
