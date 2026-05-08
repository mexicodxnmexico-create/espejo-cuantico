"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticulasCuanticasProps {
  frecuencia: number;
  cantidad: number;
}

// ⚡ BOLT: Move static color mapping out of the render loop to avoid re-creation
const COLORES_SOLFEGGIO: Record<number, { r: number; g: number; b: number }> = {
  396: { r: 0.9, g: 0.22, b: 0.27 },
  417: { r: 0.97, g: 0.5, b: 0 },
  528: { r: 0.02, g: 0.84, b: 0.63 },
  639: { r: 0.07, g: 0.54, b: 0.7 },
  741: { r: 0.03, g: 0.23, b: 0.3 },
  852: { r: 0.51, g: 0.22, b: 0.93 }
};

export function ParticulasCuanticas({ frecuencia, cantidad }: ParticulasCuanticasProps) {
  const particulasRef = useRef<THREE.Points>(null);
  const tiempo = useRef(0);

  // ⚡ BOLT: Decouple static attributes from dynamic ones to prevent re-randomizing
  // the field when only props like frequency change.
  const staticAttributes = useMemo(() => {
    const pos = new Float32Array(cantidad * 3);
    const tam = new Float32Array(cantidad);

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;
      const radio = Math.random() * 5 + 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos[i3] = radio * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radio * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radio * Math.cos(phi);

      tam[i] = Math.random() * 0.05 + 0.02;
    }
    return { pos, tam };
  }, [cantidad]);

  // ⚡ BOLT: Memoize colors separately
  const particleColors = useMemo(() => {
    const col = new Float32Array(cantidad * 3);
    const colorBase = COLORES_SOLFEGGIO[frecuencia] || { r: 0.02, g: 0.84, b: 0.63 };

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;
      col[i3] = colorBase.r + (Math.random() - 0.5) * 0.2;
      col[i3 + 1] = colorBase.g + (Math.random() - 0.5) * 0.2;
      col[i3 + 2] = colorBase.b + (Math.random() - 0.5) * 0.2;
    }
    return col;
  }, [cantidad, frecuencia]);

  // ⚡ BOLT: Precompute lookup tables for trigonometric expansion
  const trigLookup = useMemo(() => {
    const sinTable = new Float32Array(cantidad);
    const cosTable = new Float32Array(cantidad);
    for (let i = 0; i < cantidad; i++) {
      sinTable[i] = Math.sin(i);
      cosTable[i] = Math.cos(i);
    }
    return { sinTable, cosTable };
  }, [cantidad]);

  useFrame((_state, delta) => {
    if (!particulasRef.current || cantidad === 0) return;

    tiempo.current += delta;
    const t = tiempo.current;
    const tHalf = t * 0.5;
    const velocidad = (frecuencia / 500) * delta;
    const positions = particulasRef.current.geometry.attributes.position.array as Float32Array;

    // ⚡ BOLT: Precompute frame-wide trig values for expansion identity
    // sin(t + i) = sin(t)cos(i) + cos(t)sin(i)
    // cos(t + i) = cos(t)cos(i) - sin(t)sin(i)
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const sinTHalf = Math.sin(tHalf);
    const cosTHalf = Math.cos(tHalf);

    const { sinTable, cosTable } = trigLookup;

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;

      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // ⚡ BOLT: Replace expensive Math.sin/cos calls with arithmetic using identities
      const sinPhase = sinT * cosTable[i] + cosT * sinTable[i];
      const cosPhase = cosT * cosTable[i] - sinT * sinTable[i];
      const sinPhaseHalf = sinTHalf * cosTable[i] + cosTHalf * sinTable[i];

      const nextX = x + sinPhase * velocidad;
      const nextY = y + cosPhase * velocidad;
      const nextZ = z + sinPhaseHalf * velocidad;

      const nextDistSq = nextX * nextX + nextY * nextY + nextZ * nextZ;

      // Range [3, 8] -> Squared Range [9, 64]
      if (nextDistSq > 64 || nextDistSq < 9) {
        const prevDistSq = x * x + y * y + z * z;
        const scale = Math.sqrt(prevDistSq / nextDistSq);
        positions[i3] = nextX * scale;
        positions[i3 + 1] = nextY * scale;
        positions[i3 + 2] = nextZ * scale;
      } else {
        positions[i3] = nextX;
        positions[i3 + 1] = nextY;
        positions[i3 + 2] = nextZ;
      }
    }

    particulasRef.current.geometry.attributes.position.needsUpdate = true;
    particulasRef.current.rotation.y += delta * 0.05;
  });

  if (cantidad === 0) return null;

  return (
    <points ref={particulasRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={cantidad}
          array={staticAttributes.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={cantidad}
          array={particleColors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={cantidad}
          array={staticAttributes.tam}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
