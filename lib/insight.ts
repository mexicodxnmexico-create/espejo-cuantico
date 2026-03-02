export function getInsightMessage(reflectionCount: number): string | null {
  if (typeof reflectionCount !== 'number' || isNaN(reflectionCount) || reflectionCount < 0) {
    return null;
  }

  if (reflectionCount === 0) return "Aún no has proyectado tu intención en el espejo.";
  if (reflectionCount < 3) return "Tus primeros reflejos muestran una búsqueda de equilibrio.";
  if (reflectionCount < 6) return "La profundidad de tus proyecciones está alterando el tejido del sistema.";

  return "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.";
}
