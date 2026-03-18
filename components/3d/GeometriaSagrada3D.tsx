"use client";

import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GeometriaSagrada3DProps {
  frecuencia: number;
  intensidad: number;
  tipo: "flor-vida" | "merkaba" | "metatron" | "torus";
}

export const GeometriaSagrada3D = memo(function GeometriaSagrada3D({ frecuencia, intensidad, tipo }: GeometriaSagrada3DProps) {
  const grupoRef = useRef<THREE.Group>(null);
  const tiempo = useRef(0);

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

  // Animación continua
  useFrame((_state, delta) => {
    if (!grupoRef.current) return;

    tiempo.current += delta;

    // Rotación suave basada en la frecuencia
    const velocidad = frecuencia / 10000;
    grupoRef.current.rotation.y += velocidad;
    grupoRef.current.rotation.x = Math.sin(tiempo.current * 0.3) * 0.2;

    // Pulsación basada en intensidad
    const escala = 1 + Math.sin(tiempo.current * 2) * (intensidad / 200);
    grupoRef.current.scale.setScalar(escala);
  });

  return (
    <group ref={grupoRef}>
      {geometrias.map((geo, index) => (
        <mesh key={index} geometry={geo.geometria} position={geo.posicion}>
          <meshStandardMaterial
            color={colorFrecuencia}
            emissive={colorFrecuencia}
            emissiveIntensity={intensidad / 100}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

interface GeoData {
  geometria: THREE.BufferGeometry;
  posicion: THREE.Vector3;
}

// ⚡ OPTIMIZACIÓN: Funciones de generación de geometría memoizadas
function crearFlorDeLaVida(): GeoData[] {
  const geometrias: GeoData[] = [];
  const radio = 1;
  const numCirculos = 6;

  // Círculo central
  geometrias.push({
    geometria: new THREE.TorusGeometry(radio, 0.05, 16, 100),
    posicion: new THREE.Vector3(0, 0, 0)
  });

  // Círculos exteriores
  for (let i = 0; i < numCirculos; i++) {
    const angulo = (Math.PI * 2 * i) / numCirculos;
    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio;

    geometrias.push({
      geometria: new THREE.TorusGeometry(radio, 0.05, 16, 100),
      posicion: new THREE.Vector3(x, y, 0)
    });
  }

  // Segunda capa
  for (let i = 0; i < numCirculos; i++) {
    const angulo = (Math.PI * 2 * i) / numCirculos + Math.PI / numCirculos;
    const x = Math.cos(angulo) * radio * 1.732;
    const y = Math.sin(angulo) * radio * 1.732;

    geometrias.push({
      geometria: new THREE.TorusGeometry(radio, 0.05, 16, 100),
      posicion: new THREE.Vector3(x, y, 0)
    });
  }

  return geometrias;
}

function crearMerkaba(): GeoData[] {
  const geometrias: GeoData[] = [];
  const tamaño = 1.5;

  // Tetraedro superior
  const geometriaTetra = new THREE.TetrahedronGeometry(tamaño);
  geometrias.push({
    geometria: geometriaTetra,
    posicion: new THREE.Vector3(0, 0, 0)
  });

  // Tetraedro inferior (invertido)
  const geometriaTetra2 = new THREE.TetrahedronGeometry(tamaño);
  geometrias.push({
    geometria: geometriaTetra2,
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

  // Esferas en cada vértice
  vertices.forEach(([x, y, z]) => {
    geometrias.push({
      geometria: new THREE.SphereGeometry(0.15, 16, 16),
      posicion: new THREE.Vector3(x, y, z)
    });
  });

  // Conexiones principales
  const conexiones = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];

  conexiones.forEach(([i, j]) => {
    const inicio = new THREE.Vector3(...vertices[i]);
    const fin = new THREE.Vector3(...vertices[j]);
    const direccion = new THREE.Vector3().subVectors(fin, inicio);
    const longitud = direccion.length();

    geometrias.push({
      geometria: new THREE.CylinderGeometry(0.03, 0.03, longitud, 8),
      posicion: inicio.clone().add(direccion.multiplyScalar(0.5))
    });
  });

  return geometrias;
}

function crearTorus(): GeoData[] {
  const geometrias: GeoData[] = [];

  // Torus principal
  geometrias.push({
    geometria: new THREE.TorusGeometry(1.5, 0.3, 16, 100),
    posicion: new THREE.Vector3(0, 0, 0)
  });

  // Torus secundario perpendicular
  geometrias.push({
    geometria: new THREE.TorusGeometry(1.5, 0.3, 16, 100),
    posicion: new THREE.Vector3(0, 0, 0)
  });

  return geometrias;
}
