import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Onboarding } from '../components/Onboarding.tsx';

test('Onboarding component test suite', async (t) => {
  // Ensure React is in scope globally for tsx
  (global as any).React = React;

  await t.test('renders initial step and progresses on click', () => {
    let completed = false;
    const onComplete = () => { completed = true; };

    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<Onboarding onComplete={onComplete} />);
    });

    const instance = root!.root;

    // Check step 1 content
    let title = instance.findByProps({ id: 'onboarding-title' }).children[0];
    assert.strictEqual(title, 'Bienvenido al Espejo Cuántico');

    let button = instance.findByType('button');
    assert.strictEqual(button.children[0], 'Siguiente');

    // Click next -> Step 2
    TestRenderer.act(() => {
      button.props.onClick();
    });

    title = instance.findByProps({ id: 'onboarding-title' }).children[0];
    assert.strictEqual(title, 'Observar es Modificar');

    // Click next -> Step 3
    TestRenderer.act(() => {
      button.props.onClick();
    });

    title = instance.findByProps({ id: 'onboarding-title' }).children[0];
    assert.strictEqual(title, 'Tu Propósito');

    // Check button text changed
    button = instance.findByType('button');
    assert.strictEqual(button.children[0], 'Entrar al Espejo');

    // Click next -> Complete
    TestRenderer.act(() => {
      button.props.onClick();
    });

    assert.strictEqual(completed, true);

    // Check it returns null after completion
    assert.strictEqual(root!.toJSON(), null);
  });
});
