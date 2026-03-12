"use client";

import { useEffect, useState, memo } from "react";

export const sanitizeUserId = (id: string | null): string => {
  if (!id) return "Identificando...";
  const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  return sanitized || "Identificando...";
};

export const Header = memo(function Header() {
  const [uid, setUid] = useState("");

  useEffect(() => {
    setUid(sanitizeUserId(localStorage.getItem("quantum_user_id")));
  }, []);

  return (
    <header style={{ padding: "1.5rem 0", borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Espejo Cuántico</div>
      <div style={{ fontSize: "0.8rem", color: "#555", fontFamily: "monospace", backgroundColor: "#f5f5f5", padding: "0.4rem 0.8rem", borderRadius: "20px" }}>
        ID: {uid}
      </div>
    </header>
  );
});
