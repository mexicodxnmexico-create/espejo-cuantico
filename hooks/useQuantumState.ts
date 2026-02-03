"use client";

import { useState, useEffect, useCallback } from "react";
import { QuantumSystemState, INITIAL_STATE } from "@/lib/quantum-engine";
import { fetchQuantumState, updateQuantumState } from "@/lib/quantum-service";

export function useQuantumState() {
  const [state, setState] = useState<QuantumSystemState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchQuantumState();
      setState(data);
    } catch (err) {
      setError("No se pudo conectar con el núcleo cuántico.");
    } finally {
      setLoading(false);
    }
  }, []);

  const dispatch = async (action: "OBSERVE" | "REFLECT" | "RESET") => {
    try {
      const updated = await updateQuantumState(action);
      setState(updated);
    } catch (err) {
      setError("Error al procesar la acción.");
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return { state, loading, error, dispatch, reload: load };
}
