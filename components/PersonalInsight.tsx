"use client";

import { memo } from "react";

export const PersonalInsight = memo(function PersonalInsight({ reflectionCount }: { reflectionCount: number }) {
  let message = "";
  if (reflectionCount === 0) message = "Aún no has proyectado tu intención en el espejo.";
  else if (reflectionCount < 3) message = "Tus primeros reflejos muestran una búsqueda de equilibrio.";
  else if (reflectionCount < 6) message = "La profundidad de tus proyecciones está alterando el tejido del sistema.";
  else message = "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.";

  return (
    <div style={{ marginTop: "3rem", padding: "1.5rem", borderRadius: "12px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", textAlign: "center" }}>
      <h4 style={{ margin: "0 0 0.5rem 0", textTransform: "uppercase", fontSize: "0.75rem", color: "#666" }}>Insight Personal</h4>
      <p style={{ margin: 0, fontWeight: "500", color: "#333" }}>{message}</p>
    </div>
  );
});
