## 2026-02-03 - Component Memoization

**Learning:** Calculating derived state (like filtering or reversing an array) inside the render body can be expensive as the data grows. Memoizing these calculations with `useMemo` prevents unnecessary work on every re-render.

**Action:** Use `useMemo` for derived data like `reflectionCount` and reversed `history` arrays.

## 2026-02-03 - Unified Client-Side State

**Learning:** In serverless environments like Vercel, the backend file system is ephemeral. For applications requiring simple "memory" without a database, `localStorage` on the client provides a more reliable and simpler persistence mechanism than ephemeral backend files. Unifying state management into a single React Context avoids synchronization bugs between different state hooks.

**Action:** Unified state in `QuantumContext` with `localStorage` persistence and removed conflicting API-based state.
