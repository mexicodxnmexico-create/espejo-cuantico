# Bolt's Performance Journal ⚡

## 2025-02-04 - State Mutation and O(n) rendering
**Learning:** Found that `QuantumEngine.transition` was mutating the `history` array in place. This is a critical React anti-pattern that breaks `useMemo` dependencies, as the array reference remains the same. Additionally, `PersonalInsight` was performing an O(n) filter on the history array on every render to calculate a count that could be easily pre-calculated.
**Action:** Implement immutable state updates and move expensive calculations to the state transition logic to achieve O(1) render performance for those values.

## 2025-02-05 - Efficient History Rendering
**Learning:** Found that using `reverse()` on an array before mapping it in React causes O(n) computation and, more importantly, breaks key stability if using indices, leading to O(n) DOM updates.
**Action:** Use `display: flex; flex-direction: column-reverse;` on the container to achieve visual reversal without array modification. Use absolute indices from the original array as keys to maintain stability, resulting in O(1) updates when new items are appended. Additionally, slice the history to a reasonable limit (e.g., last 50) to avoid DOM bloat.

## 2025-02-06 - Unbounded State Growth
**Learning:** The `QuantumSystemState.history` array was growing indefinitely, causing increased memory usage and slower `localStorage` serialization (blocking the main thread) as the session duration increased.
**Action:** Cap the history array to a fixed size (e.g., 100 items) within the state transition logic to ensure constant-time (O(1)) memory usage and serialization performance, regardless of session length.

## 2025-05-22 - Debounced State Persistence
**Learning:** Frequent synchronous calls to `localStorage.setItem` and `JSON.stringify` during rapid user interactions (e.g., clicking 'Observe' multiple times) can block the main thread and cause UI stuttering.
**Action:** Implement a debounced persistence mechanism (e.g., 500ms) to consolidate state updates and reduce expensive I/O operations. Also, memoize the context provider value to prevent redundant re-renders of components that don't depend on the state itself.

## 2025-06-21 - Render Loop O(n) Date Parsing
**Learning:** Found that invoking `new Date().toLocaleDateString()` inside a `map` function during the render cycle of a list (e.g., in `ProgressDashboard.tsx`) causes significant O(n) overhead due to repetitive string and object instantiations.
**Action:** Extract expensive formatting operations into a `useMemo` hook that pre-calculates the formatted values. Then map over the memoized array, reducing the cost to O(1) for re-renders where the source array hasn't changed.

## 2025-06-22 - Single-pass Progress Calculation
**Learning:** Found that `MeditationEngine.calculateProgress` used multiple `reduce` passes and frequent `new Date()` allocations within the loop. This pattern increases algorithmic complexity and garbage collection pressure unnecessarily.
**Action:** Replace multiple array iterations with a single `for...of` loop and use `Date.now()` for timestamp comparisons to achieve $O(1pass)$ performance and zero per-iteration object allocations.

## 2025-06-23 - Squared Distance and Single-pass Loop Optimization
**Learning:** Found that `ParticulasCuanticas.tsx` was performing redundant `Math.sqrt` and trigonometric calls inside a 1000-iteration `useFrame` loop. In most frames, particles are within bounds, so calculating the true distance is unnecessary.
**Action:** Implemented squared distance checks (`nextDistSq > 64 || nextDistSq < 9`) to avoid `Math.sqrt` in the common path. Pre-calculated loop invariants and used local variables to minimize TypedArray overhead. Also refactored `MeditationEngine` to use a single-pass loop and `Date.now()`, reducing complexity from $O(2pass)$ to $O(1pass)$.

## 2025-06-24 - Efficient Fixed-Size Array Updates
**Learning:** Using `[...arr, item].slice(-N)` for maintaining a fixed-size buffer causes two array allocations (one for the spread and one for the final slice). While `shift()` is O(n), using `slice()` followed by `push()` and `shift()` is significantly faster because it minimizes heap pressure by avoiding the intermediate array allocation.
**Action:** Prefer `slice()` + `push()` + `shift()` for more efficient memory management in state transitions.

## 2025-06-25 - Internalizing 3D Animation State
**Learning:** Updating variables (like `intensidad`) via `useState` and `setInterval` in a parent component (`EscenaMeditacion3D`) triggers cascading React re-renders of the `<Canvas>` and all its 3D children every time the interval ticks. This causes severe CPU and GPU performance drops during prolonged animations.
**Action:** Internalize animation logic within the child component (`GeometriaSagrada3D`) by utilizing `useRef` to store target values and last execution timestamps. Update these variables and apply them directly to the Three.js objects (e.g., `material.emissiveIntensity`) inside the `useFrame` loop. This bypasses React's reconciliation cycle completely while maintaining synchronized visuals.
