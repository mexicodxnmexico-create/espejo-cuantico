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

  // ⚡ BOLT OPTIMIZATION: Debounce localStorage writes (500ms) to prevent main thread blocking
  // on every state update, while ensuring data safety with beforeunload.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);

  // Keep stateRef in sync for the event listener without re-binding it
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Debounced save effect
  useEffect(() => {
    if (loading) return;

    // Clear any pending save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save quantum state", e);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, loading]);

  // Immediate save on unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!loading) {
        try {
          // Use ref to get latest state without adding state as dependency
          localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
        } catch (e) {
          console.error("Failed to save quantum state on unload", e);
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
