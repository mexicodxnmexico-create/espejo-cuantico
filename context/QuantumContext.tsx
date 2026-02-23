"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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

  // ⚡ BOLT: Keep a ref to the latest state for event listeners and timeouts
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ⚡ BOLT: Debounce localStorage writes to avoid blocking the main thread with synchronous I/O
  useEffect(() => {
    if (loading) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save state", e);
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

  return (
    <QuantumContext.Provider value={{ state, dispatch, loading }}>
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
