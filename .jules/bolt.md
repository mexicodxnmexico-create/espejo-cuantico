# Bolt's Performance Journal ⚡

## 2025-02-04 - State Mutation and O(n) rendering
**Learning:** Found that `QuantumEngine.transition` was mutating the `history` array in place. This is a critical React anti-pattern that breaks `useMemo` dependencies, as the array reference remains the same. Additionally, `PersonalInsight` was performing an O(n) filter on the history array on every render to calculate a count that could be easily pre-calculated.
**Action:** Implement immutable state updates and move expensive calculations to the state transition logic to achieve O(1) render performance for those values.

## 2025-02-05 - Efficient History Rendering
**Learning:** Found that using `reverse()` on an array before mapping it in React causes O(n) computation and, more importantly, breaks key stability if using indices, leading to O(n) DOM updates.
**Action:** Use `display: flex; flex-direction: column-reverse;` on the container to achieve visual reversal without array modification. Use absolute indices from the original array as keys to maintain stability, resulting in O(1) updates when new items are appended. Additionally, slice the history to a reasonable limit (e.g., last 50) to avoid DOM bloat.

## 2025-02-12 - State Persistence & Context Efficiency
**Learning:** Identifed that synchronous `localStorage` writes on every state change can block the main thread, especially with `JSON.stringify` on growing objects. Also, unmemoized Context Provider values cause unnecessary re-renders for all consumers even if the provider re-renders for non-state reasons.
**Action:** Implement 500ms debouncing for `localStorage` persistence and wrap the provider value in `useMemo`. Additionally, enforce a 100-item cap on the `history` array in the engine logic to keep the state size (and serialization time) constant and small.
