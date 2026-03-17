import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';

const CANVAS_CONTAINER_STYLE = { height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' };

// Mocked QuantumSphere for this file, assuming it's usually imported
const QuantumSphere = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="hotpink" />
  </mesh>
);

export const QuantumCanvas = memo(function QuantumCanvas() {
  return (
    <div style={CANVAS_CONTAINER_STYLE} data-testid="quantum-canvas-container">
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
