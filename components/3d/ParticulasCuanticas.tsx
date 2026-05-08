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

  // ⚡ BOLT: Decouple static geometry attributes from dynamic ones (like color/frecuencia)
  // This prevents resetting particle positions and visual jarring when frequency changes.
  const [posiciones, tamaños, sinI, cosI] = useMemo(() => {
    const pos = new Float32Array(cantidad * 3);
    const tam = new Float32Array(cantidad);
    const sI = new Float32Array(cantidad);
    const cI = new Float32Array(cantidad);

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;

      const radio = Math.random() * 5 + 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos[i3] = radio * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radio * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radio * Math.cos(phi);

      tam[i] = Math.random() * 0.05 + 0.02;

      // Pre-calculate trig identities for the loop optimization
      sI[i] = Math.sin(i);
      cI[i] = Math.cos(i);
    }

    return [pos, tam, sI, cI];
  }, [cantidad]); // Solo depende de la cantidad

  // ⚡ BOLT: Separated color recalculation so it runs only when frequency/cantidad changes
  const colores = useMemo(() => {
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

  useFrame((_state, delta) => {
    if (!particulasRef.current || cantidad === 0) return;

    tiempo.current += delta;
    const t = tiempo.current;
    const tHalf = t * 0.5;
    const velocidad = (frecuencia / 500) * delta;
    const posicionesArray = particulasRef.current.geometry.attributes.position.array as Float32Array;

    // ⚡ BOLT: Pre-calculate trig identities for 't' outside the loop
    // Reduces Math.sin/cos calls from ~3000 to just 4 per frame
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const sinTHalf = Math.sin(tHalf);
    const cosTHalf = Math.cos(tHalf);

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;

      const x = posicionesArray[i3];
      const y = posicionesArray[i3 + 1];
      const z = posicionesArray[i3 + 2];

      // ⚡ BOLT: Use pre-computed lookups and trigonometric addition formulas:
      // sin(t + i) = sin(t)cos(i) + cos(t)sin(i)
      // cos(t + i) = cos(t)cos(i) - sin(t)sin(i)
      const sinPhase = sinT * cosI[i] + cosT * sinI[i];
      const cosPhase = cosT * cosI[i] - sinT * sinI[i];
      const sinPhaseZ = sinTHalf * cosI[i] + cosTHalf * sinI[i];

      const nextX = x + sinPhase * velocidad;
      const nextY = y + cosPhase * velocidad;
      const nextZ = z + sinPhaseZ * velocidad;

      const nextDistSq = nextX * nextX + nextY * nextY + nextZ * nextZ;

      // Range [3, 8] -> Squared Range [9, 64]
      if (nextDistSq > 64 || nextDistSq < 9) {
        const prevDistSq = x * x + y * y + z * z;
        const scale = Math.sqrt(prevDistSq / nextDistSq);
        posicionesArray[i3] = nextX * scale;
        posicionesArray[i3 + 1] = nextY * scale;
        posicionesArray[i3 + 2] = nextZ * scale;
      } else {
        posicionesArray[i3] = nextX;
        posicionesArray[i3 + 1] = nextY;
        posicionesArray[i3 + 2] = nextZ;
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
          array={posiciones}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={cantidad}
          array={colores}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={cantidad}
          array={tamaños}
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
