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

## 2025-05-23 - Stable Event Listeners with useRef
**Learning:** Found that `beforeunload` event listeners were depending on the entire `state` object (conceptually, though implementation was broken), which would cause them to be removed and re-added on every state change. Also discovered a critical `ReferenceError` where `stateRef` was accessed but not defined.
**Action:** Use `useRef` to store the latest state for event handlers. This allows the effect dependency to remain static, stabilizing the event listener and preventing unnecessary DOM operations while ensuring data persistence on unload.
