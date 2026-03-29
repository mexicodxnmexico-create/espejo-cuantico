import test from 'node:test';
import assert from 'node:assert';
import React from 'react';

// Use ReactTestRenderer which runs hooks to properly test QuantumContext
import TestRenderer from 'react-test-renderer';
import { QuantumProvider, useQuantum } from '../context/QuantumContext.tsx';
import { INITIAL_STATE } from '../lib/quantum-engine.ts';

function TestComponent() {
  const { state, loading } = useQuantum();
  return <div id="phase">{loading ? 'loading' : state.phase}</div>;
}

test('QuantumContext test suite', async (t) => {
  const originalConsoleError = console.error;
  let loggedError: unknown = null;
  // Store original globals to restore later
  const originalLocalStorage = (global as unknown as { localStorage: Storage }).localStorage;
  const originalWindow = (global as unknown as { window: Window }).window;

  t.beforeEach(() => {
    loggedError = null;
    console.error = (msg: string, e: unknown) => {
      if (typeof msg === 'string' && (msg.includes('Failed to parse quantum state') || msg.includes('Failed to save quantum state'))) {
        loggedError = e;
      }
    };

    // Provide a mock window object to avoid "Cannot read properties of undefined (reading 'addEventListener')"
    // when the unloading hook runs.
    Object.defineProperty(global, 'window', {
      value: {
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      configurable: true
    });
  });

  t.afterEach(() => {
    console.error = originalConsoleError;
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      configurable: true
    });
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      configurable: true
    });
    loggedError = null;
  });

  await t.test('handles localStorage getItem error gracefully', () => {
    const err = new Error('Simulated localStorage access error');

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: () => { throw err; },
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null
      },
      configurable: true
    });

    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(
        <QuantumProvider>
          <TestComponent />
        </QuantumProvider>
      );
    });

    // Assert it gracefully caught and logged the error without crashing
    assert.ok(loggedError !== null, "Expected loggedError to not be null");
    assert.strictEqual((loggedError as Error).message, 'Simulated localStorage access error');

    // Assert it provided the default initial state
    const phaseDiv = root!.root.findByProps({ id: 'phase' });
    assert.strictEqual(phaseDiv.children[0], INITIAL_STATE.phase);

    // Unmount safely
    TestRenderer.act(() => {
        root!.unmount();
    });
  });

  await t.test('handles localStorage setItem error gracefully on timer', async () => {
    // This tests the setItem logic in the 500ms timeout
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: () => JSON.stringify(INITIAL_STATE),
        setItem: () => { throw new Error('Quota exceeded'); },
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null
      },
      configurable: true
    });

    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(
        <QuantumProvider>
          <TestComponent />
        </QuantumProvider>
      );
    });

    // Wait for the 500ms timeout to trigger the effect that saves to localStorage
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Assert it gracefully caught and logged the quota exceeded error
    assert.ok(loggedError !== null, "Expected Quota exceeded error to be logged");
    assert.strictEqual((loggedError as Error).message, 'Quota exceeded');

    // Unmount safely
    TestRenderer.act(() => {
        root!.unmount();
    });
  });
});
