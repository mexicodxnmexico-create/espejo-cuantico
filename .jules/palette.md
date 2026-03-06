## 2024-05-23 - Accessibility in Custom Modals
**Learning:** The application uses custom `div` overlays for modals (like `Onboarding`) without native `dialog` elements or ARIA attributes. This completely hides context from screen readers and traps keyboard focus in the underlying page.
**Action:** When encountering custom overlays, immediately check for `role="dialog"`, `aria-modal="true"`, and focus management. Simple `useEffect` focus on the primary action is a high-value, low-effort fix for these patterns.

## 2025-02-18 - Disabled Button Context
**Learning:** In highly interactive or 'game-like' components (e.g., QuantumEngine controls), users may become confused when core actions are abruptly disabled without visual cues or explanation.
**Action:** Whenever a button is dynamically disabled, always implement a distinct visual style (e.g., `opacity: 0.5`, `cursor: not-allowed`) and a `title` attribute or tooltip explaining *why* the action is restricted.
