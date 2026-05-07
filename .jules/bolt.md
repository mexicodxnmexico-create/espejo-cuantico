## 2025-05-15 - Trig Identity Optimization in R3F useFrame
**Learning:** In high-frequency 3D animation loops (useFrame), replacing multiple per-particle `Math.sin`/`Math.cos` calls with pre-computed lookup tables and trigonometric expansion identities (`sin(t+i) = sin(t)cos(i) + cos(t)sin(i)`) significantly reduces CPU overhead for transcendental functions.
**Action:** Use pre-computed `sin(i)` and `cos(i)` tables and trig expansion in any particle-based system or vertex-heavy procedural animation.

## 2025-05-15 - Decoupling Attribute Memoization
**Learning:** Keeping static attributes (initial positions, sizes) and dynamic attributes (colors based on frequency) in the same `useMemo` causes the entire particle field to re-randomize on every frequency change, which is both a performance bottleneck and visually jarring.
**Action:** Always split static (structural) and dynamic (visual/state-based) attributes into separate `useMemo` hooks or refs to preserve spatial stability and minimize re-computation.
