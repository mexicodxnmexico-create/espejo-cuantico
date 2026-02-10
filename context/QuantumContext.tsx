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

  useEffect(() => {
    if (!loading) {
      // ⚡ BOLT: Debounce localStorage saves to reduce blocking synchronous I/O
      const timeout = setTimeout(() => {
        localStorage.setItem("quantum_state_v2", JSON.stringify(state));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [state, loading]);

  const dispatch = useCallback((action: "OBSERVE" | "REFLECT" | "RESET") => {
    setState((prev) => QuantumEngine.transition(prev, action));
  }, []);

  // ⚡ BOLT: Memoize provider value to prevent unnecessary re-renders of all consumers
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
