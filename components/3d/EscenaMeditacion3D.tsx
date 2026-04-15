"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { Suspense, useState, useEffect, memo } from "react";
import { GeometriaSagrada3D } from "./GeometriaSagrada3D";
import { ParticulasCuanticas } from "./ParticulasCuanticas";

interface EscenaMeditacion3DProps {
  frecuencia: number;
  activo: boolean;
  tipoGeometria: "flor-vida" | "merkaba" | "metatron" | "torus";
}

// ⚡ BOLT: Wrap in React.memo to prevent massive 3D canvas re-renders caused by parent 1-second timers
export const EscenaMeditacion3D = memo(function EscenaMeditacion3D({ frecuencia, activo, tipoGeometria }: EscenaMeditacion3DProps) {
  // ⚡ BOLT: Removed 'intensidad' state as it's now handled internally by GeometriaSagrada3D
  // to prevent re-renders of the entire 3D canvas every 2 seconds.

  return (
    <div style={{ width: "100%", height: "600px", borderRadius: "20px", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0a1a"]} />

          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8338ec" />

          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <GeometriaSagrada3D
            frecuencia={frecuencia}
            activo={activo}
            tipo={tipoGeometria}
          />

          <ParticulasCuanticas
            frecuencia={frecuencia}
            cantidad={activo ? 1000 : 0}
          />

          <Environment preset="night" />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            autoRotate={activo}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});
