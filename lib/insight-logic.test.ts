import { test } from 'node:test';
import assert from 'node:assert';
import { getInsightMessage } from './insight-logic.ts';

test('getInsightMessage returns correct message for 0 reflections', () => {
  assert.strictEqual(getInsightMessage(0), "Aún no has proyectado tu intención en el espejo.");
});

test('getInsightMessage returns correct message for 1 reflection', () => {
  assert.strictEqual(getInsightMessage(1), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
});

test('getInsightMessage returns correct message for 2 reflections', () => {
  assert.strictEqual(getInsightMessage(2), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
});

test('getInsightMessage returns correct message for 3 reflections', () => {
  assert.strictEqual(getInsightMessage(3), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
});

test('getInsightMessage returns correct message for 5 reflections', () => {
  assert.strictEqual(getInsightMessage(5), "La profundidad de tus proyecciones está alterando el tejido del sistema.");
});

test('getInsightMessage returns correct message for 6 reflections', () => {
  assert.strictEqual(getInsightMessage(6), "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
});

test('getInsightMessage returns correct message for 10 reflections', () => {
  assert.strictEqual(getInsightMessage(10), "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
});

test('getInsightMessage returns correct message for negative reflections', () => {
  assert.strictEqual(getInsightMessage(-1), "Tus primeros reflejos muestran una búsqueda de equilibrio.");
});
