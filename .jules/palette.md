## 2024-05-23 - Accessibility in Custom Modals
**Learning:** The application uses custom `div` overlays for modals (like `Onboarding`) without native `dialog` elements or ARIA attributes. This completely hides context from screen readers and traps keyboard focus in the underlying page.
**Action:** When encountering custom overlays, immediately check for `role="dialog"`, `aria-modal="true"`, and focus management. Simple `useEffect` focus on the primary action is a high-value, low-effort fix for these patterns.

## 2024-05-23 - Accessibility in Inline Styled Disabled States
**Learning:** Native CSS stylesheets usually apply visual changes automatically when an element receives the `disabled` attribute. However, when using inline styles (or custom components relying solely on inline styles), setting `disabled` does not change the appearance. This creates a confusing UX where interactive elements appear active but are unclickable. Furthermore, screen reader context is enhanced by explicit `aria-disabled` and `title` attributes.
**Action:** When applying custom or inline styles to interactive elements like buttons, always explicitly include conditional visual styles (e.g., `opacity`, `cursor: "not-allowed"`) alongside the standard `disabled` property, and pair it with accessibility attributes (`aria-disabled`, `title`) to ensure states are clearly conveyed visually and semantically.

## 2024-05-23 - Accessibility in Critical State Changes
**Learning:** When an application enters a critical state that disables primary interactive elements (like the "COLLAPSED" state disabling main actions), users relying on keyboards or screen readers can lose their place or miss the context of the failure. Simply rendering a new div is insufficient because focus remains on the now-disabled element.
**Action:** When implementing critical error or collapsed states that interrupt the user flow, always wrap the alert container with `role="alert"` so screen readers announce it immediately, and use a `useEffect` hook to explicitly shift keyboard focus (`ref.current?.focus()`) to the primary recovery action (e.g., a "Restore" or "Reset" button).
