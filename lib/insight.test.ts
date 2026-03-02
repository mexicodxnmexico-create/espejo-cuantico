import { test } from 'node:test';
import assert from 'node:assert';
import { getInsightMessage } from './insight.ts';

test('getInsightMessage returns correct message for 0 reflections', () => {
  assert.strictEqual(getInsightMessage(0), "Aún no has proyectado tu intención en el espejo.");
});

test('getInsightMessage returns correct message for 1 or 2 reflections', () => {
  assert.strictEqual(getInsightMessage(1), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
  assert.strictEqual(getInsightMessage(2), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
});

test('getInsightMessage returns correct message for 3 to 5 reflections', () => {
  assert.strictEqual(getInsightMessage(3), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
  assert.strictEqual(getInsightMessage(4), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
  assert.strictEqual(getInsightMessage(5), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
});

test('getInsightMessage returns correct message for 6 or more reflections', () => {
  assert.strictEqual(getInsightMessage(6), "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
  assert.strictEqual(getInsightMessage(10), "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
});

test('getInsightMessage returns null for invalid inputs', () => {
  assert.strictEqual(getInsightMessage(-1), null);
  assert.strictEqual(getInsightMessage(-10), null);
  assert.strictEqual(getInsightMessage(NaN), null);

  // @ts-expect-error Testing invalid runtime types
  assert.strictEqual(getInsightMessage("not a number"), null);
  // @ts-expect-error Testing invalid runtime types
  assert.strictEqual(getInsightMessage(null), null);
  // @ts-expect-error Testing invalid runtime types
  assert.strictEqual(getInsightMessage(undefined), null);
});
