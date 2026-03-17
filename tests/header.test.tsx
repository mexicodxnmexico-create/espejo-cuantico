import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Header } from '../components/Header';

(global as any).React = React;

test('Header component', async (t) => {
  let mockStorage: Record<string, string> = {};

  t.beforeEach(() => {
    mockStorage = {};
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
      },
      configurable: true,
    });
  });

  t.afterEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: undefined,
      configurable: true,
    });
  });

  await t.test('initializes with default value when localStorage is empty', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<Header />);
    });

    const idDiv = root!.root.findAllByType('div')[1];
    assert.ok(idDiv.children.join('').includes('Identificando...'));

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('initializes with ID from localStorage when present', () => {
    mockStorage['quantum_user_id'] = 'quantum-12345';

    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<Header />);
    });

    const idDiv = root!.root.findAllByType('div')[1];
    assert.ok(idDiv.children.join('').includes('quantum-12345'));

    TestRenderer.act(() => {
      root!.unmount();
    });
  });
});
