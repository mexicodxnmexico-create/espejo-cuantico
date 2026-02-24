"use client";

import { useState, memo, useRef, useEffect } from "react";

// ⚡ BOLT: Define static data outside component to avoid object recreation on every render
const ONBOARDING_STEPS = [
  {
    title: "Bienvenido al Espejo Cuántico",
    content: "Has entrado en un espacio de observación y reflejo. Aquí, cada acción altera la coherencia del sistema.",
  },
  {
    title: "Observar es Modificar",
    content: "En el mundo cuántico, el observador no es neutral. Al mirar el estado del sistema, introduces entropía.",
  },
  {
    title: "Tu Propósito",
    content: "Mantén la coherencia mientras exploras tus propios reflejos digitales. El colapso es el final, pero también un nuevo comienzo.",
  },
];

export const Onboarding = memo(function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Shift focus to the heading when the step changes to announce new content
    headingRef.current?.focus();
  }, [step]);

  if (step >= ONBOARDING_STEPS.length) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-desc"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
    >
      <div style={{
        backgroundColor: "white",
        padding: "2.5rem",
        borderRadius: "16px",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center"
      }}>
        <h2
          id="onboarding-title"
          ref={headingRef}
          tabIndex={-1}
          style={{ marginBottom: "1rem", fontSize: "1.5rem", outline: "none" }}
        >
          {ONBOARDING_STEPS[step].title}
        </h2>
        <p
          id="onboarding-desc"
          style={{ color: "#666", lineHeight: "1.6", marginBottom: "2rem" }}
        >
          {ONBOARDING_STEPS[step].content}
        </p>

        <div style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "#888", fontWeight: 500 }}>
          Paso {step + 1} de {ONBOARDING_STEPS.length}
        </div>

        <button
          onClick={() => {
            if (step === ONBOARDING_STEPS.length - 1) {
              onComplete();
            }
            setStep(s => s + 1);
          }}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {step === ONBOARDING_STEPS.length - 1 ? "Entrar al Espejo" : "Siguiente"}
        </button>
      </div>
    </div>
  );
});
