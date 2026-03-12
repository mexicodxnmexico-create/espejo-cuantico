## 2024-05-23 - Accessibility in Custom Modals
**Learning:** The application uses custom `div` overlays for modals (like `Onboarding`) without native `dialog` elements or ARIA attributes. This completely hides context from screen readers and traps keyboard focus in the underlying page.
**Action:** When encountering custom overlays, immediately check for `role="dialog"`, `aria-modal="true"`, and focus management. Simple `useEffect` focus on the primary action is a high-value, low-effort fix for these patterns.

## 2024-05-23 - Accessibility in Inline Styled Disabled States
**Learning:** Native CSS stylesheets usually apply visual changes automatically when an element receives the `disabled` attribute. However, when using inline styles (or custom components relying solely on inline styles), setting `disabled` does not change the appearance. This creates a confusing UX where interactive elements appear active but are unclickable. Furthermore, screen reader context is enhanced by explicit `aria-disabled` and `title` attributes.
**Action:** When applying custom or inline styles to interactive elements like buttons, always explicitly include conditional visual styles (e.g., `opacity`, `cursor: "not-allowed"`) alongside the standard `disabled` property, and pair it with accessibility attributes (`aria-disabled`, `title`) to ensure states are clearly conveyed visually and semantically.

## 2024-05-23 - Accessibility of Critical Error States
**Learning:** When a system enters a critical "collapsed" or "error" state that disables primary UI interactions, simply rendering a visual message is insufficient. Screen reader users may not be notified of the state change, and keyboard focus remains on now-disabled elements or gets lost.
**Action:** Always add \`role="alert"\` or \`aria-live="assertive"\` to critical error state containers. More importantly, explicitly manage focus by shifting it to the primary recovery action (e.g., a "Reset" or "Retry" button) to maintain keyboard accessibility and immediately guide the user on how to proceed.
