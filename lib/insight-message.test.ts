import { test } from 'node:test';
import assert from 'node:assert';
import { getInsightMessage } from './insight-message.ts';

test('getInsightMessage handles valid inputs correctly', () => {
  assert.strictEqual(getInsightMessage(0), "Aún no has proyectado tu intención en el espejo.");
  assert.strictEqual(getInsightMessage(1), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
  assert.strictEqual(getInsightMessage(2), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
  assert.strictEqual(getInsightMessage(3), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
  assert.strictEqual(getInsightMessage(5), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
  assert.strictEqual(getInsightMessage(6), "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
  assert.strictEqual(getInsightMessage(100), "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
});

test('getInsightMessage handles invalid inputs gracefully', () => {
  assert.strictEqual(getInsightMessage(-1), "Datos corruptos: no se puede leer el espejo.");
  assert.strictEqual(getInsightMessage(NaN), "Datos corruptos: no se puede leer el espejo.");
  // @ts-expect-error testing invalid type
  assert.strictEqual(getInsightMessage("3"), "Datos corruptos: no se puede leer el espejo.");
  // @ts-expect-error testing invalid type
  assert.strictEqual(getInsightMessage(null), "Datos corruptos: no se puede leer el espejo.");
  // @ts-expect-error testing invalid type
  assert.strictEqual(getInsightMessage(undefined), "Datos corruptos: no se puede leer el espejo.");
});
