## 2024-06-25 - React Three Fiber Animation Optimization
**Learning:** High-frequency state updates (like `setInterval` updating an intensity value every few seconds) in parent components wrapping `<Canvas>` cause expensive React reconciliation of the entire 3D scene.
**Action:** Move high-frequency animation logic into child components. Use `useRef` for tracking state and update Three.js properties directly inside the `useFrame` loop to bypass React's render cycle completely.
