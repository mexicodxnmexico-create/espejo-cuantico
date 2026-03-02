export function getInsightMessage(reflectionCount: number): string {
  if (typeof reflectionCount !== 'number' || Number.isNaN(reflectionCount) || reflectionCount < 0) {
    return "Datos corruptos: no se puede leer el espejo.";
  }

  if (reflectionCount === 0) return "Aún no has proyectado tu intención en el espejo.";
  if (reflectionCount < 3) return "Tus primeros reflejos muestran una búsqueda de equilibrio.";
  if (reflectionCount < 6) return "La profundidad de tus proyecciones está alterando el tejido del sistema.";
  return "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.";
}
