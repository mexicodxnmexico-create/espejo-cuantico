"use client";

import { useEffect, useState, memo, CSSProperties } from "react";

// ⚡ BOLT OPTIMIZATION: Extract static styles to module-level constants
// This prevents object re-creation on every render, reducing garbage collection pressure.
const HEADER_STYLE: CSSProperties = {
  padding: "1.5rem 0",
  borderBottom: "1px solid #eaeaea",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const HEADER_TITLE_STYLE: CSSProperties = { fontSize: "1.2rem", fontWeight: "bold" };

const UID_BADGE_STYLE: CSSProperties = {
  fontSize: "0.8rem",
  color: "#555",
  fontFamily: "monospace",
  backgroundColor: "#f5f5f5",
  padding: "0.4rem 0.8rem",
  borderRadius: "20px"
};

export const Header = memo(function Header() {
  const [uid, setUid] = useState("");

  useEffect(() => {
    setUid(localStorage.getItem("quantum_user_id") || "Identificando...");
  }, []);

  return (
    <header style={HEADER_STYLE}>
      <div style={HEADER_TITLE_STYLE}>Espejo Cuántico</div>
      <div style={UID_BADGE_STYLE}>
        ID: {uid}
      </div>
    </header>
  );
});
