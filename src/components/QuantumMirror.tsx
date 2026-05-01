import React, { useEffect, useState, useRef } from 'react';

export const QuantumMirror: React.FC = () => {
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [frequency, setFrequency] = useState(432);
  const rafRef = useRef<number | null>(null);

  // 1. Lógica de Sensores y Frecuencia
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // ⚡ BOLT OPTIMIZATION: Throttle deviceorientation events using requestAnimationFrame
      // to synchronize with display refresh rate and minimize React re-renders.
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        setRotation({
          alpha: e.alpha || 0,
          beta: e.beta || 0,
          gamma: e.gamma || 0
        });
        // La frecuencia cambia sutilmente con la inclinación
        setFrequency(432 + (e.beta ? Math.round(e.beta / 10) : 0));
        rafRef.current = null;
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
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
