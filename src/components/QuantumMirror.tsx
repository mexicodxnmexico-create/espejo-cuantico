import React, { useEffect, useState, useRef } from 'react';

export const QuantumMirror: React.FC = () => {
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [frequency, setFrequency] = useState(432);

  // ⚡ BOLT: Use refs to throttle high-frequency orientation events
  const nextOrientation = useRef<{ alpha: number | null, beta: number | null, gamma: number | null } | null>(null);
  const rafId = useRef<number | null>(null);

  // 1. Lógica de Sensores y Frecuencia
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // ⚡ BOLT: Capture the latest orientation data
      nextOrientation.current = {
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      };

      // ⚡ BOLT: Schedule state update for the next animation frame if not already scheduled
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          if (nextOrientation.current) {
            const { alpha, beta, gamma } = nextOrientation.current;
            setRotation({
              alpha: alpha || 0,
              beta: beta || 0,
              gamma: gamma || 0
            });
            // La frecuencia cambia sutilmente con la inclinación
            setFrequency(432 + (beta ? Math.round(beta / 10) : 0));
          }
          rafId.current = null;
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div data-testid="quantum-mirror">
      <div data-testid="frequency">{frequency}</div>
      <div data-testid="rotation-alpha">{rotation.alpha}</div>
      <div data-testid="rotation-beta">{rotation.beta}</div>
      <div data-testid="rotation-gamma">{rotation.gamma}</div>
    </div>
  );
};
