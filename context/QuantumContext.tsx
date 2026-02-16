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

  // Update ref to always have the latest state for the beforeunload listener
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
    if (loading) return;

    // ⚡ BOLT OPTIMIZATION: Debounce localStorage persistence to reduce main-thread load
    // during frequent state updates.
    const timer = setTimeout(() => {
      localStorage.setItem("quantum_state_v2", JSON.stringify(state));
    }, 500);

    return () => clearTimeout(timer);
  }, [state, loading]);

  // ⚡ BOLT OPTIMIZATION: Ensure latest state is saved on tab close/refresh
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
