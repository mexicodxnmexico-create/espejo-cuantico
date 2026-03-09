"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useRef, memo, CSSProperties } from "react";
import * as THREE from "three";

// ⚡ BOLT OPTIMIZATION: Extract static styles to module-level constants
const CANVAS_CONTAINER_STYLE: CSSProperties = {
  height: "24rem",
  width: "100%",
  backgroundColor: "black",
  borderRadius: "0.75rem",
  overflow: "hidden",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  marginBottom: "2rem"
};

const QuantumSphere = memo(function QuantumSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sphereRef.current) {
      // Organic sphere movement
      sphereRef.current.rotation.x = t * 0.2;
      sphereRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.1);
    }
  });

  return (
    // ⚡ BOLT OPTIMIZATION: Reduced segments from 100 to 64 to improve vertex processing performance
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#4f46e5"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0}
      />
    </Sphere>
  );
});
QuantumSphere.displayName = "QuantumSphere";

export const QuantumCanvas = memo(function QuantumCanvas() {
  return (
    <div style={CANVAS_CONTAINER_STYLE}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <QuantumSphere />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
});

QuantumCanvas.displayName = "QuantumCanvas";
