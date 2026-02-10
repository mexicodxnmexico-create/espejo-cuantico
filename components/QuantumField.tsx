"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface QuantumFieldProps {
  coherence: number;
  entropy: number;
  phase?: string;
}

function Field({ coherence, entropy, phase }: QuantumFieldProps) {
  const points = useRef<THREE.Points>(null!);
  const count = 3000;

  // Initial positions
  const initialPositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;     // x
      positions[i3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return positions;
  }, []);

  const geometryArgs = useMemo(() => [new Float32Array(initialPositions), 3] as [Float32Array, number], [initialPositions]);
  const targetColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.getElapsedTime();

    // Animation parameters derived from props
    const coherenceFactor = Math.max(0, Math.min(1, coherence / 100));
    const entropyFactor = Math.max(0, entropy / 20);

    const positions = points.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ix = initialPositions[i3];
      const iy = initialPositions[i3 + 1];
      const iz = initialPositions[i3 + 2];

      // Wave motion (Coherence)
      const waveX = Math.sin(time * 0.5 + iy) * (coherenceFactor * 0.5);
      const waveY = Math.cos(time * 0.3 + ix) * (coherenceFactor * 0.5);

      // Random Noise (Entropy)
      const jitter = (1 - coherenceFactor) * 0.2 + (entropyFactor * 0.05);
      // Use index-based pseudo-randomness for stable jitter
      const noiseX = Math.sin(time * 5 + i) * jitter;
      const noiseY = Math.cos(time * 7 + i) * jitter;
      const noiseZ = Math.sin(time * 3 + i) * jitter;

      positions[i3] = ix + waveX + noiseX;
      positions[i3 + 1] = iy + waveY + noiseY;
      positions[i3 + 2] = iz + noiseZ;
    }

    points.current.geometry.attributes.position.needsUpdate = true;

    // Rotation
    points.current.rotation.y = time * 0.1 * (1 + entropyFactor * 0.2);

    // Color update based on phase
    const material = points.current.material as THREE.PointsMaterial;
    if (phase === "COLLAPSED") {
        targetColor.set("#ff0000");
    } else if (phase === "ALIGNING") {
        targetColor.set("#00ff00");
    } else {
        targetColor.set("#000000");
    }
    material.color.lerp(targetColor, 0.1);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={geometryArgs}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#000000"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function QuantumField(props: QuantumFieldProps) {
  return (
    <div style={{ width: '100%', height: '300px', background: '#fafafa', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, fontSize: '0.8rem', color: '#999', pointerEvents: 'none' }}>
            CAMPO CUÁNTICO // {props.phase || "ESTABLE"}
        </div>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Field {...props} />
      </Canvas>
    </div>
  );
}
