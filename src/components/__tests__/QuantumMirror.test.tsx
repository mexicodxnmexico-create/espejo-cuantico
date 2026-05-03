import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { QuantumMirror } from '../QuantumMirror.js';

const { act } = TestRenderer;

test('QuantumMirror component deviceorientation logic', async (t) => {
  const listeners: Record<string, EventListener> = {};

  // Create a minimal mock window if it doesn't exist, otherwise just spy on the methods
  const originalWindow = (global as any).window;
  const originalAddEventListener = originalWindow?.addEventListener;
  const originalRemoveEventListener = originalWindow?.removeEventListener;

  if (!(global as any).window) {
    (global as any).window = {};
  }

  (global as any).window.addEventListener = (event: string, callback: EventListener) => {
    listeners[event] = callback;
  };
  (global as any).window.removeEventListener = (event: string, callback: EventListener) => {
    if (listeners[event] === callback) {
      delete listeners[event];
    }
  };

  try {
    await t.test('initializes with default values', () => {
      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(<QuantumMirror />);
      });
      const root = renderer!.root;

      assert.strictEqual(root.findByProps({ 'data-testid': 'frequency' }).children[0], '432');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-alpha' }).children[0], '0');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-beta' }).children[0], '0');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-gamma' }).children[0], '0');
    });

    await t.test('updates state on deviceorientation event', () => {
      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(<QuantumMirror />);
      });
      const root = renderer!.root;

      // Simulate deviceorientation event
      act(() => {
        if (listeners['deviceorientation']) {
          listeners['deviceorientation']({ alpha: 10, beta: 25, gamma: 30 } as unknown as Event);
        }
      });

      // 432 + Math.round(25 / 10) = 432 + 3 = 435
      assert.strictEqual(root.findByProps({ 'data-testid': 'frequency' }).children[0], '435');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-alpha' }).children[0], '10');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-beta' }).children[0], '25');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-gamma' }).children[0], '30');
    });

    await t.test('handles missing values with fallback', () => {
      let renderer: TestRenderer.ReactTestRenderer;
      act(() => {
        renderer = TestRenderer.create(<QuantumMirror />);
      });
      const root = renderer!.root;

      // Simulate deviceorientation event missing fields
      act(() => {
        if (listeners['deviceorientation']) {
          listeners['deviceorientation']({} as unknown as Event);
        }
      });

      // 432 + 0 = 432
      assert.strictEqual(root.findByProps({ 'data-testid': 'frequency' }).children[0], '432');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-alpha' }).children[0], '0');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-beta' }).children[0], '0');
      assert.strictEqual(root.findByProps({ 'data-testid': 'rotation-gamma' }).children[0], '0');
    });
  } finally {
    // Cleanup
    if (originalWindow === undefined) {
      delete (global as any).window;
    } else {
      (global as any).window.addEventListener = originalAddEventListener;
      (global as any).window.removeEventListener = originalRemoveEventListener;
    }
  }
});
