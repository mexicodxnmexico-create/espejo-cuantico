"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
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

  // ⚡ BOLT: Track state in a ref to allow safe access from debounced persistence and beforeunload listeners
  const stateRef = useRef(state);
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

  // ⚡ BOLT: Debounce localStorage persistence by 500ms to avoid blocking the main thread on every state change.
  // This reduces synchronous JSON.stringify and I/O overhead.
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

  // ⚡ BOLT: Ensure state is saved immediately when the user leaves the page to prevent data loss from debouncing.
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem("quantum_state_v2", JSON.stringify(stateRef.current));
      } catch (e) {
        console.error("Failed to save quantum state on exit", e);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const dispatch = useCallback((action: "OBSERVE" | "REFLECT" | "RESET") => {
    setState((prev) => QuantumEngine.transition(prev, action));
  }, []);

  // ⚡ BOLT: Memoize context value to prevent unnecessary re-renders of consumers.
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
