import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { QuantumMirror } from '../src/components/QuantumMirror';

test('QuantumMirror deviceorientation logic', async (t) => {
  const originalWindow = global.window;
  const listeners: Record<string, Function[]> = {};

  t.beforeEach(() => {
    // Mock global window and its event listeners
    Object.defineProperty(global, 'window', {
      value: {
        addEventListener: (event: string, callback: Function) => {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(callback);
        },
        removeEventListener: (event: string, callback: Function) => {
          if (!listeners[event]) return;
          listeners[event] = listeners[event].filter(cb => cb !== callback);
        }
      },
      configurable: true
    });
  });

  t.afterEach(() => {
    // Restore original window
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      configurable: true
    });
    // Clear listeners
    for (const key in listeners) delete listeners[key];
  });

  await t.test('initializes with default frequency and rotation', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    const alphaDiv = root!.root.findByProps({ 'data-testid': 'rotation-alpha' });
    const betaDiv = root!.root.findByProps({ 'data-testid': 'rotation-beta' });
    const gammaDiv = root!.root.findByProps({ 'data-testid': 'rotation-gamma' });

    assert.strictEqual(freqDiv.children[0], '432');
    assert.strictEqual(alphaDiv.children[0], '0');
    assert.strictEqual(betaDiv.children[0], '0');
    assert.strictEqual(gammaDiv.children[0], '0');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('updates frequency and rotation when deviceorientation event is dispatched', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    // Dispatch mock deviceorientation event
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 90, beta: 45, gamma: 180 });
        });
      }
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    const alphaDiv = root!.root.findByProps({ 'data-testid': 'rotation-alpha' });
    const betaDiv = root!.root.findByProps({ 'data-testid': 'rotation-beta' });
    const gammaDiv = root!.root.findByProps({ 'data-testid': 'rotation-gamma' });

    // 432 + Math.round(45 / 10) = 432 + 5 = 437
    assert.strictEqual(freqDiv.children[0], '437');
    assert.strictEqual(alphaDiv.children[0], '90');
    assert.strictEqual(betaDiv.children[0], '45');
    assert.strictEqual(gammaDiv.children[0], '180');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('handles fractional rounding of beta values correctly', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });

    // Math.round(44 / 10) = 4 -> 436
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 0, beta: 44, gamma: 0 });
        });
      }
    });
    assert.strictEqual(freqDiv.children[0], '436');

    // Math.round(45 / 10) = 5 -> 437
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 0, beta: 45, gamma: 0 });
        });
      }
    });
    assert.strictEqual(freqDiv.children[0], '437');

    // Math.round(-44 / 10) = -4 -> 428
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 0, beta: -44, gamma: 0 });
        });
      }
    });
    assert.strictEqual(freqDiv.children[0], '428');

    // Math.round(-45 / 10) = -4 (in JS, Math.round(-4.5) is -4) -> 428
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 0, beta: -45, gamma: 0 });
        });
      }
    });
    assert.strictEqual(freqDiv.children[0], '428');

    // Math.round(-46 / 10) = -5 -> 427
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 0, beta: -46, gamma: 0 });
        });
      }
    });
    assert.strictEqual(freqDiv.children[0], '427');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('handles negative and zero beta values correctly', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 10, beta: -45, gamma: -10 });
        });
      }
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    const alphaDiv = root!.root.findByProps({ 'data-testid': 'rotation-alpha' });
    const betaDiv = root!.root.findByProps({ 'data-testid': 'rotation-beta' });
    const gammaDiv = root!.root.findByProps({ 'data-testid': 'rotation-gamma' });

    // 432 + Math.round(-45 / 10) = 432 - 4 = 428
    assert.strictEqual(freqDiv.children[0], '428');
    assert.strictEqual(alphaDiv.children[0], '10');
    assert.strictEqual(betaDiv.children[0], '-45');
    assert.strictEqual(gammaDiv.children[0], '-10');

    // Dispatch another event with beta: 0
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 20, beta: 0, gamma: 20 });
        });
      }
    });

    // 432 + Math.round(0 / 10) = 432
    assert.strictEqual(freqDiv.children[0], '432');
    assert.strictEqual(alphaDiv.children[0], '20');
    assert.strictEqual(betaDiv.children[0], '0');
    assert.strictEqual(gammaDiv.children[0], '20');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('handles missing event values gracefully', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    // Dispatch mock deviceorientation event with null values
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: null, beta: null, gamma: null });
        });
      }
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    const alphaDiv = root!.root.findByProps({ 'data-testid': 'rotation-alpha' });
    const betaDiv = root!.root.findByProps({ 'data-testid': 'rotation-beta' });
    const gammaDiv = root!.root.findByProps({ 'data-testid': 'rotation-gamma' });

    assert.strictEqual(freqDiv.children[0], '432');
    assert.strictEqual(alphaDiv.children[0], '0');
    assert.strictEqual(betaDiv.children[0], '0');
    assert.strictEqual(gammaDiv.children[0], '0');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('handles undefined event values gracefully', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    // Dispatch mock deviceorientation event with undefined values
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: undefined, beta: undefined, gamma: undefined });
        });
      }
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    const alphaDiv = root!.root.findByProps({ 'data-testid': 'rotation-alpha' });
    const betaDiv = root!.root.findByProps({ 'data-testid': 'rotation-beta' });
    const gammaDiv = root!.root.findByProps({ 'data-testid': 'rotation-gamma' });

    assert.strictEqual(freqDiv.children[0], '432');
    assert.strictEqual(alphaDiv.children[0], '0');
    assert.strictEqual(betaDiv.children[0], '0');
    assert.strictEqual(gammaDiv.children[0], '0');

    TestRenderer.act(() => {
      root!.unmount();
    });
  });

  await t.test('removes event listener on unmount', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    assert.strictEqual(listeners['deviceorientation'].length, 1);

    TestRenderer.act(() => {
      root!.unmount();
    });

    assert.strictEqual(listeners['deviceorientation'].length, 0);
  });
});
