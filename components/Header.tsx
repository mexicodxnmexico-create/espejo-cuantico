"use client";

import { useEffect, useState, memo, useCallback } from "react";

export const Header = memo(function Header() {
  const [uid, setUid] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("quantum_user_id");
    if (!id) {
       id = crypto.randomUUID();
       localStorage.setItem("quantum_user_id", id);
    }
    setUid(id);
  }, []);

  const handleCopy = useCallback(() => {
    if (!uid) return;
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [uid]);

  return (
    <header style={{ padding: "1.5rem 0", borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Espejo Cuántico</div>
      <button
        onClick={handleCopy}
        disabled={!uid}
        aria-label={copied ? "ID copiado" : "Copiar ID de usuario"}
        title="Copiar ID"
        style={{
          fontSize: "0.8rem",
          color: "#555",
          fontFamily: "monospace",
          backgroundColor: "#f5f5f5",
          padding: "0.4rem 0.8rem",
          borderRadius: "20px",
          border: "none",
          cursor: !uid ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
      >
        <span>ID: {uid || "Identificando..."}</span>
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "green" }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
    </header>
  );
});
