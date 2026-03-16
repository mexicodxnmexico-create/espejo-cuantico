"use client";

import { CSSProperties, useEffect, useRef } from "react";

const COLLAPSED_STYLE: CSSProperties = { padding: "2rem", backgroundColor: "#fff0f0", borderRadius: "12px", border: "1px solid #ff0000", textAlign: "center", marginBottom: "4rem", marginTop: "4rem" };
const COLLAPSED_H3_STYLE: CSSProperties = { color: "#ff0000", margin: 0 };
const COLLAPSED_P_STYLE: CSSProperties = { margin: "1rem 0" };
const RESET_BTN_STYLE: CSSProperties = { padding: "0.5rem 2rem", backgroundColor: "#ff0000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };

interface CollapsedStateProps {
  dispatch: (action: "OBSERVE" | "REFLECT" | "RESET") => void;
}

export function CollapsedState({ dispatch }: CollapsedStateProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div role="alert" style={COLLAPSED_STYLE}>
      <h3 style={COLLAPSED_H3_STYLE}>SISTEMA COLAPSADO</h3>
      <p style={COLLAPSED_P_STYLE}>La incoherencia ha alcanzado el punto crítico.</p>
      <button ref={buttonRef} onClick={() => dispatch("RESET")} style={RESET_BTN_STYLE}>
        Restaurar Espejo
      </button>
    </div>
  );
}
