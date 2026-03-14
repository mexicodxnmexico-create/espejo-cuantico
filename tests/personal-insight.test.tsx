import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { PersonalInsight } from '../components/PersonalInsight.tsx';

// Ensure React is globally available for testing, as required by the setup.
(global as any).React = React;

test('PersonalInsight component', async (t) => {
  await t.test('renders correct message for reflectionCount 0', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={0} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "Aún no has proyectado tu intención en el espejo.");
  });

  await t.test('renders correct message for reflectionCount 1', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={1} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "Tus primeros reflejos muestran una búsqueda de equilibrio.");
  });

  await t.test('renders correct message for reflectionCount 2', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={2} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "Tus primeros reflejos muestran una búsqueda de equilibrio.");
  });

  await t.test('renders correct message for reflectionCount 3', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={3} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "La profundidad de tus proyecciones está alterando el tejido del sistema.");
  });

  await t.test('renders correct message for reflectionCount 5', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={5} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "La profundidad de tus proyecciones está alterando el tejido del sistema.");
  });

  await t.test('renders correct message for reflectionCount 6', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={6} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
  });

  await t.test('renders correct message for reflectionCount 10', () => {
    const root = TestRenderer.create(<PersonalInsight reflectionCount={10} />);
    const p = root.root.findByType('p');
    assert.strictEqual(p.children[0], "Eres un maestro de la realidad reflejada. El espejo y tú sois uno.");
  });
});
