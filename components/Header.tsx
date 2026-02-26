"use client";

import { useEffect, useState, memo, useCallback } from "react";

export const Header = memo(function Header() {
  const [uid, setUid] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("quantum_user_id");
    if (!id) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        // Fallback for older environments that support crypto.getRandomValues but not randomUUID
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        id = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
      }
      localStorage.setItem("quantum_user_id", id);
    }
    setUid(id);
  }, []);

  const handleCopy = useCallback(() => {
    if (uid && uid !== "Identificando...") {
      navigator.clipboard.writeText(uid).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });
    }
  }, [uid]);

  return (
    <header style={{ padding: "1.5rem 0", borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Espejo Cuántico</div>
      <button
        onClick={handleCopy}
        title="Copiar ID"
        aria-label="Copiar ID de usuario al portapapeles"
        disabled={uid === "Identificando..." || !uid}
        style={{
          fontSize: "0.8rem",
          color: copied ? "#2e7d32" : "#555",
          fontFamily: "monospace",
          backgroundColor: copied ? "#e8f5e9" : "#f5f5f5",
          padding: "0.4rem 0.8rem",
          borderRadius: "20px",
          border: "none",
          cursor: (uid && uid !== "Identificando...") ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "all 0.2s ease"
        }}
      >
        <span>ID: {uid || "Identificando..."}</span>
        <span aria-hidden="true" style={{ opacity: 0.6 }}>
          {copied ? "✓" : "📋"}
        </span>
      </button>
    </header>
  );
});
