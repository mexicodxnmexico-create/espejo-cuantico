import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { QuantumMirror } from '../src/components/QuantumMirror';

test('QuantumMirror deviceorientation logic', async (t) => {
  const originalWindow = global.window;
  const listeners: Record<string, Function[]> = {};
  const rafCallbacks: Function[] = [];

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
        },
        requestAnimationFrame: (cb: Function) => {
          rafCallbacks.push(cb);
          return rafCallbacks.length;
        },
        cancelAnimationFrame: (id: number) => {
          rafCallbacks.splice(id - 1, 1);
        }
      },
      configurable: true
    });

    // ⚡ BOLT: Ensure requestAnimationFrame is globally available for the component
    (global as any).requestAnimationFrame = (global.window as any).requestAnimationFrame;
    (global as any).cancelAnimationFrame = (global.window as any).cancelAnimationFrame;
  });

  t.afterEach(() => {
    // Restore original window
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      configurable: true
    });
    delete (global as any).requestAnimationFrame;
    delete (global as any).cancelAnimationFrame;

    // Clear listeners and callbacks
    for (const key in listeners) delete listeners[key];
    rafCallbacks.length = 0;
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

  await t.test('throttles multiple events within a single frame', () => {
    let root: TestRenderer.ReactTestRenderer | undefined;

    TestRenderer.act(() => {
      root = TestRenderer.create(<QuantumMirror />);
    });

    // Dispatch multiple events
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: 10, beta: 10, gamma: 10 });
          listener({ alpha: 20, beta: 20, gamma: 20 });
          listener({ alpha: 30, beta: 30, gamma: 30 });
        });
      }
    });

    // Verify only one RAF is scheduled
    assert.strictEqual(rafCallbacks.length, 1);

    // Trigger RAF
    TestRenderer.act(() => {
      rafCallbacks.forEach(cb => cb());
      rafCallbacks.length = 0;
    });

    const freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    // Should be based on the LAST event: 432 + Math.round(30/10) = 435
    assert.strictEqual(freqDiv.children[0], '435');

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

    // ⚡ BOLT: Verify state HAS NOT updated yet because of throttling
    let freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
    assert.strictEqual(freqDiv.children[0], '432');

    // ⚡ BOLT: Trigger RAF callback to apply the update
    TestRenderer.act(() => {
      rafCallbacks.forEach(cb => cb());
      rafCallbacks.length = 0;
    });

    freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
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

    // Trigger RAF
    TestRenderer.act(() => {
      rafCallbacks.forEach(cb => cb());
      rafCallbacks.length = 0;
    });

    let freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
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

    // Trigger RAF
    TestRenderer.act(() => {
      rafCallbacks.forEach(cb => cb());
      rafCallbacks.length = 0;
    });

    freqDiv = root!.root.findByProps({ 'data-testid': 'frequency' });
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

    // Dispatch mock deviceorientation event with null/undefined values
    TestRenderer.act(() => {
      const orientationListeners = listeners['deviceorientation'];
      if (orientationListeners) {
        orientationListeners.forEach(listener => {
          listener({ alpha: null, beta: null, gamma: null });
        });
      }
    });

    // Trigger RAF
    TestRenderer.act(() => {
      rafCallbacks.forEach(cb => cb());
      rafCallbacks.length = 0;
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
