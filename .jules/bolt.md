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

## 2025-03-05 - Provider Re-renders
**Learning:** In React, if a Context Provider's value prop is an object literal (e.g., `value={{ state, dispatch }}`), it will create a new object reference on every render of the Provider's parent component. This forces all components consuming that context to re-render, even if `state` and `dispatch` haven't changed.
**Action:** Always memoize the value passed to a Context Provider using `useMemo` (e.g., `const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);`) to prevent unnecessary re-renders of consumer components.

## 2025-06-22 - Loop Fusion and Date.now() Optimization
**Learning:** Found that `MeditationEngine.calculateProgress` was performing O(2n) array reductions and instantiating `new Date()` inside the loop for ongoing sessions. This caused redundant traversals and unnecessary object allocation/GC pressure.
**Action:** Combined multiple reductions into a single O(n) loop and captured a single timestamp using `Date.now()` outside the loop, ensuring both better performance and calculation consistency.
