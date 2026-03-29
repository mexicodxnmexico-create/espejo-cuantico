## 2024-05-24 - Internalize 3D random walk intensity to prevent parent re-renders
**Learning:** In React Three Fiber applications, managing continuous animations (like random walks) using React state and intervals in parent components forces the entire 3D Canvas wrapper to undergo expensive React tree reconciliations, which can cause significant performance degradation.
**Action:** Always migrate high-frequency animation state out of React `useState`/`useEffect` hooks and into `useRef` references, updating the actual visual properties directly within R3F's `useFrame` render loop.
