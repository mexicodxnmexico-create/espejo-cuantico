"use client";

import { useQuantum } from "@/context/QuantumContext";

export function Journey() {
  const { state } = useQuantum();

  const steps = [
    { threshold: 0, label: "Despertar", desc: "Has iniciado tu observación cuántica." },
    { threshold: 5, label: "Sintonía", desc: "Tus reflejos comienzan a crear un patrón." },
    { threshold: 15, label: "Conciencia", desc: "La coherencia es ahora una variable bajo tu control." },
  ];

  const currentStep = steps.filter(s => state.reflections >= s.threshold).pop();

  return (
    <section style={{ margin: "4rem 0" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Tu Progreso en el Espejo</h2>
      <div style={{ position: "relative", padding: "1rem 0" }}>
        <div style={{ height: "4px", backgroundColor: "#eaeaea", width: "100%", position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: -1 }}></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {steps.map((step, i) => {
            const isActive = state.reflections >= step.threshold;
            return (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#0070f3" : "#fff",
                  border: "2px solid #0070f3",
                  margin: "0 auto",
                  transition: "background-color 0.3s"
                }}></div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", fontWeight: isActive ? "bold" : "normal" }}>{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {currentStep && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", borderLeft: "4px solid #0070f3", backgroundColor: "#f0f7ff" }}>
          <h4 style={{ margin: 0 }}>{currentStep.label}</h4>
          <p style={{ margin: "0.5rem 0 0", color: "#666" }}>{currentStep.desc}</p>
        </div>
      )}
    </section>
  );
}
