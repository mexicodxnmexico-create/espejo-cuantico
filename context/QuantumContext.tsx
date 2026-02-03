"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface QuantumState {
  coherence: number;
  reflections: number;
  history: { timestamp: number; value: number }[];
}

interface QuantumContextType {
  state: QuantumState;
  reflect: () => void;
  reset: () => void;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export function QuantumProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuantumState>({
    coherence: 100,
    reflections: 0,
    history: [],
  });

  // Persistence (Addressing Point #4 Backend/Persistence)
  useEffect(() => {
    const saved = localStorage.getItem("quantum_state");
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quantum_state", JSON.stringify(state));
  }, [state]);

  const reflect = () => {
    setState((prev) => {
      const newValue = Math.max(0, prev.coherence - Math.floor(Math.random() * 5));
      return {
        coherence: newValue,
        reflections: prev.reflections + 1,
        history: [...prev.history, { timestamp: Date.now(), value: newValue }].slice(-10),
      };
    });
  };

  const reset = () => {
    setState({
      coherence: 100,
      reflections: 0,
      history: [],
    });
  };

  return (
    <QuantumContext.Provider value={{ state, reflect, reset }}>
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
