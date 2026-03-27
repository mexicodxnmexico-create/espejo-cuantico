import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import module from 'node:module';

// Inject React globally to avoid ReferenceError: React is not defined
(global as any).React = React;

// Define a full window object to prevent ReferenceError: window is not defined
const mockWindow = {
  addEventListener: () => {},
  removeEventListener: () => {},
  matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
  navigator: { userAgent: 'node' },
  document: {
    createElement: () => ({ style: {} }),
    body: { clientWidth: 1024, clientHeight: 768 }
  }
};
(global as any).window = mockWindow;
(global as any).document = mockWindow.document;

// Replace the original require intercepting `@react-three` imports
const originalRequire = module.Module.prototype.require;
(module.Module.prototype.require as any) = function(id: string) {
  if (id === '@react-three/fiber' || id.endsWith('react-three-fiber.cjs.js') || id.endsWith('react-three-fiber.cjs.dev.js') || id.includes('@react-three/fiber/dist/index')) {
    return {
      Canvas: function Canvas(props: any) {
        return React.createElement('div', { 'data-testid': 'mock-canvas', ...props }, props.children);
      },
      useFrame: () => {},
      useThree: () => ({ size: { width: 100, height: 100 } }),
      useStore: () => ({ getState: () => ({}) })
    };
  }

  if (id === '@react-three/drei' || id.includes('@react-three/drei')) {
    return {
      Stars: function Stars(props: any) {
        return React.createElement('div', { 'data-testid': 'mock-stars', ...props });
      },
      OrbitControls: function OrbitControls(props: any) {
        return React.createElement('div', { 'data-testid': 'mock-controls', ...props });
      }
    };
  }

  return originalRequire.apply(this, arguments as any);
};

// Import the component AFTER mocking
const { QuantumCanvas } = require('../components/QuantumCanvas');

describe('QuantumCanvas Component', () => {
  it('renders correctly', () => {
    let renderer: any;

    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(React.createElement(QuantumCanvas));
    });

    const root = renderer.root;

    const container = root.findByProps({ 'data-testid': 'quantum-canvas-container' });
    assert.ok(container);
    assert.strictEqual(container.props.style.height, '400px');

    const mockCanvas = root.findByProps({ 'data-testid': 'mock-canvas' });
    assert.ok(mockCanvas);
    assert.deepStrictEqual(mockCanvas.props.camera, { position: [0, 0, 4] });

    const mockStars = root.findByProps({ 'data-testid': 'mock-stars' });
    assert.ok(mockStars);
    assert.strictEqual(mockStars.props.count, 5000);
    assert.strictEqual(mockStars.props.depth, 50);

    const mockControls = root.findByProps({ 'data-testid': 'mock-controls' });
    assert.ok(mockControls);
    assert.strictEqual(mockControls.props.enableZoom, false);

    const lights = root.findAllByType('ambientLight');
    assert.strictEqual(lights.length, 1);
    assert.strictEqual(lights[0].props.intensity, 0.5);

    const pointLights = root.findAllByType('pointLight');
    assert.strictEqual(pointLights.length, 1);
    assert.deepStrictEqual(pointLights[0].props.position, [10, 10, 10]);
  });
});
