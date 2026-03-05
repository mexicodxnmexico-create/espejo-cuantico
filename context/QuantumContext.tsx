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

    // ⚡ BOLT OPTIMIZATION: Debounce localStorage persistence to reduce main-thread load
    // during frequent state updates.
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to persist state", e);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, loading]);

  // ⚡ BOLT OPTIMIZATION: Ensure latest state is saved on tab close/refresh or backgrounding
  useEffect(() => {
    const persist = () => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
      } catch (e) {
        console.error("Failed to persist state on exit", e);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persist();
      }
    };

    window.addEventListener("beforeunload", persist);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", persist);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
