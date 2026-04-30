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

  const [posiciones, colores, tamaños, preSin, preCos] = useMemo(() => {
    const pos = new Float32Array(cantidad * 3);
    const col = new Float32Array(cantidad * 3);
    const tam = new Float32Array(cantidad);
    const psin = new Float32Array(cantidad);
    const pcos = new Float32Array(cantidad);

    const colorBase = COLORES_SOLFEGGIO[frecuencia] || { r: 0.02, g: 0.84, b: 0.63 };

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;

      const radio = Math.random() * 5 + 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos[i3] = radio * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radio * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radio * Math.cos(phi);

      col[i3] = colorBase.r + (Math.random() - 0.5) * 0.2;
      col[i3 + 1] = colorBase.g + (Math.random() - 0.5) * 0.2;
      col[i3 + 2] = colorBase.b + (Math.random() - 0.5) * 0.2;

      tam[i] = Math.random() * 0.05 + 0.02;

      // ⚡ BOLT: Pre-calculate sin(i) and cos(i) for trigonometric expansion
      psin[i] = Math.sin(i);
      pcos[i] = Math.cos(i);
    }

    return [pos, col, tam, psin, pcos];
  }, [cantidad, frecuencia]);

  useFrame((_state, delta) => {
    if (!particulasRef.current || cantidad === 0) return;

    tiempo.current += delta;
    const t = tiempo.current;
    const velocidad = (frecuencia / 500) * delta;
    const posicionesArray = particulasRef.current.geometry.attributes.position.array as Float32Array;

    // ⚡ BOLT: Calculate frame-wide trig values once to use in expansion
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const sinT2 = Math.sin(t * 0.5);
    const cosT2 = Math.cos(t * 0.5);

    for (let i = 0; i < cantidad; i++) {
      const i3 = i * 3;
      const si = preSin[i];
      const ci = preCos[i];

      const x = posicionesArray[i3];
      const y = posicionesArray[i3 + 1];
      const z = posicionesArray[i3 + 2];

      // ⚡ BOLT: Trigonometric expansion reduces 3N calls to 4 per frame
      // sin(t + i) = sin(t)cos(i) + cos(t)sin(i)
      // cos(t + i) = cos(t)cos(i) - sin(t)sin(i)
      // sin(t*0.5 + i) = sin(t*0.5)cos(i) + cos(t*0.5)sin(i)
      const nextX = x + (sinT * ci + cosT * si) * velocidad;
      const nextY = y + (cosT * ci - sinT * si) * velocidad;
      const nextZ = z + (sinT2 * ci + cosT2 * si) * velocidad;

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
