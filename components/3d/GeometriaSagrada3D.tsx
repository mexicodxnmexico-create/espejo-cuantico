"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GeometriaSagrada3DProps {
  frecuencia: number;
  activo: boolean;
  tipo: "flor-vida" | "merkaba" | "metatron" | "torus";
}

export function GeometriaSagrada3D({ frecuencia, activo, tipo }: GeometriaSagrada3DProps) {
  const grupoRef = useRef<THREE.Group>(null);
  const tiempo = useRef(0);
  // ⚡ BOLT: Move state updates for visual effects to a ref to avoid expensive React reconciliation
  const intensidadRef = useRef(50);
  const ultimoUpdateRef = useRef(0);

  // ⚡ OPTIMIZACIÓN: Calcular color basado en frecuencia solo cuando cambia
  const colorFrecuencia = useMemo(() => {
    const colores = {
      396: "#e63946",
      417: "#f77f00",
      528: "#06d6a0",
      639: "#118ab2",
      741: "#073b4c",
      852: "#8338ec"
    };
    return colores[frecuencia as keyof typeof colores] || "#06d6a0";
  }, [frecuencia]);

  // ⚡ OPTIMIZACIÓN: Crear geometrías complejas solo una vez
  const geometrias = useMemo(() => {
    if (tipo === "flor-vida") {
      return crearFlorDeLaVida();
    } else if (tipo === "merkaba") {
      return crearMerkaba();
    } else if (tipo === "metatron") {
      return crearCuboMetatron();
    } else {
      return crearTorus();
    }
  }, [tipo]);

  // ⚡ BOLT: Dispose geometries to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      const seen = new Set<THREE.BufferGeometry>();
      geometrias.forEach(geo => {
        if (!seen.has(geo.geometria)) {
          geo.geometria.dispose();
          seen.add(geo.geometria);
        }
      });
    };
  }, [geometrias]);

  // ⚡ BOLT: Memoize a single material and update it to avoid redundant allocations
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
  }), []);

  useEffect(() => {
    material.color.set(colorFrecuencia);
    material.emissive.set(colorFrecuencia);
  }, [material, colorFrecuencia]);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  // Animación continua
  useFrame((state, delta) => {
    if (!grupoRef.current) return;

    tiempo.current += delta;

    // ⚡ BOLT: Simulate the 2-second throttled update interval for intensidad within the frame loop
    // using purely imperative calculations. This avoids React state updates entirely.
    if (activo && state.clock.elapsedTime - ultimoUpdateRef.current > 2) {
      const nuevo = intensidadRef.current + (Math.random() - 0.5) * 10;
      intensidadRef.current = Math.max(30, Math.min(70, nuevo));
      ultimoUpdateRef.current = state.clock.elapsedTime;
    } else if (!activo) {
        intensidadRef.current = 50;
    }

    material.emissiveIntensity = intensidadRef.current / 100;

    // Rotación suave basada en la frecuencia
    const velocidad = frecuencia / 10000;
    grupoRef.current.rotation.y += velocidad;
    grupoRef.current.rotation.x = Math.sin(tiempo.current * 0.3) * 0.2;

    // Pulsación basada en intensidad
    const escala = 1 + Math.sin(tiempo.current * 2) * (intensidadRef.current / 200);
    grupoRef.current.scale.setScalar(escala);
  });

  return (
    <group ref={grupoRef}>
      {geometrias.map((geo, index) => (
        <mesh key={index} geometry={geo.geometria} material={material} position={geo.posicion} />
      ))}
    </group>
  );
}

interface GeoData {
  geometria: THREE.BufferGeometry;
  posicion: THREE.Vector3;
}

// ⚡ OPTIMIZACIÓN: Funciones de generación de geometría memoizadas
// ⚡ BOLT: Reusing identical geometry instances to reduce memory pressure
function crearFlorDeLaVida(): GeoData[] {
  const geometrias: GeoData[] = [];
  const radio = 1;
  const numCirculos = 6;
  const torusGeo = new THREE.TorusGeometry(radio, 0.05, 16, 100);

  // Círculo central
  geometrias.push({
    geometria: torusGeo,
    posicion: new THREE.Vector3(0, 0, 0)
  });

  // Círculos exteriores
  for (let i = 0; i < numCirculos; i++) {
    const angulo = (Math.PI * 2 * i) / numCirculos;
    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio;

    geometrias.push({
      geometria: torusGeo,
      posicion: new THREE.Vector3(x, y, 0)
    });
  }

  // Segunda capa
  for (let i = 0; i < numCirculos; i++) {
    const angulo = (Math.PI * 2 * i) / numCirculos + Math.PI / numCirculos;
    const x = Math.cos(angulo) * radio * 1.732;
    const y = Math.sin(angulo) * radio * 1.732;

    geometrias.push({
      geometria: torusGeo,
      posicion: new THREE.Vector3(x, y, 0)
    });
  }

  return geometrias;
}

function crearMerkaba(): GeoData[] {
  const geometrias: GeoData[] = [];
  const tamaño = 1.5;
  const tetraGeo = new THREE.TetrahedronGeometry(tamaño);

  // Tetraedro superior
  geometrias.push({
    geometria: tetraGeo,
    posicion: new THREE.Vector3(0, 0, 0)
  });

  // Tetraedro inferior (invertido)
  geometrias.push({
    geometria: tetraGeo,
    posicion: new THREE.Vector3(0, 0, 0)
  });

  return geometrias;
}

function crearCuboMetatron(): GeoData[] {
  const geometrias: GeoData[] = [];
  const vertices = [
    [1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1],
    [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]
  ];

  const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);

  // Esferas en cada vértice
  vertices.forEach(([x, y, z]) => {
    geometrias.push({
      geometria: sphereGeo,
      posicion: new THREE.Vector3(x, y, z)
    });
  });

  // Conexiones principales
  const conexiones = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];

  // Reuse a single cylinder geometry for all edges of the cube (length 2.0)
  const cylinderGeo = new THREE.CylinderGeometry(0.03, 0.03, 2, 8);

  conexiones.forEach(([i, j]) => {
    const inicio = new THREE.Vector3(...vertices[i]);
    const fin = new THREE.Vector3(...vertices[j]);
    const direccion = new THREE.Vector3().subVectors(fin, inicio);

    geometrias.push({
      geometria: cylinderGeo,
      posicion: inicio.clone().add(direccion.multiplyScalar(0.5))
    });
  });

  return geometrias;
}

function crearTorus(): GeoData[] {
  const geometrias: GeoData[] = [];
  const torusGeo = new THREE.TorusGeometry(1.5, 0.3, 16, 100);

  // Torus principal
  geometrias.push({
    geometria: torusGeo,
    posicion: new THREE.Vector3(0, 0, 0)
  });

  // Torus secundario perpendicular
  geometrias.push({
    geometria: torusGeo,
    posicion: new THREE.Vector3(0, 0, 0)
  });

  return geometrias;
}
