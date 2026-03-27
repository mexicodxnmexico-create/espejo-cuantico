import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Header } from '../components/Header';

(global as any).React = React;

test('Header component', async (t) => {
  const originalLocalStorage = global.localStorage;

  t.afterEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      configurable: true
    });
  });

  await t.test('initializes with quantum_user_id from localStorage', () => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (key: string) => {
          if (key === 'quantum_user_id') return 'test-uid-123';
          return null;
        }
      },
      configurable: true
    });

    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<Header />);
    });

    const str = JSON.stringify(root!.toJSON());
    assert.ok(str.includes('test-uid-123'), 'Should contain the mocked UID');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('initializes with fallback text when localStorage is empty', () => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (key: string) => null
      },
      configurable: true
    });

    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<Header />);
    });

    const str = JSON.stringify(root!.toJSON());
    assert.ok(str.includes('Identificando...'), 'Should contain the fallback text');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });
});
