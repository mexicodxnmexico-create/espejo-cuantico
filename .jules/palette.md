## 2026-02-11 - Accessible Modals: Beyond Visibility
**Learning:** Custom modals implemented as `div` overlays are completely invisible to screen readers unless explicitly marked with `role="dialog"` and `aria-modal="true"`. Focusing the container on mount is crucial for context.
**Action:** Always wrap custom modal content in a focusable container with correct ARIA roles and manage initial focus using `useEffect`.
