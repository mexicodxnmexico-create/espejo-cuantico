## 2024-05-23 - Accessibility in Custom Modals
**Learning:** The application uses custom `div` overlays for modals (like `Onboarding`) without native `dialog` elements or ARIA attributes. This completely hides context from screen readers and traps keyboard focus in the underlying page.
**Action:** When encountering custom overlays, immediately check for `role="dialog"`, `aria-modal="true"`, and focus management. Simple `useEffect` focus on the primary action is a high-value, low-effort fix for these patterns.

## 2025-02-12 - Disabled states with custom styles
**Learning:** Relying purely on a `disabled={true}` prop on a button and custom styles completely bypasses the native browser styling for a disabled state, leaving the button looking perfectly active. Custom styling for the `disabled` state with `opacity` or `cursor` adjustments is often strictly necessary to clearly convey status and usability.
**Action:** When working with buttons using custom styling, always implement corresponding disabled visual styles (`opacity`, `cursor`) and consider adding descriptive elements (e.g. `title` attributes) so users know why an element is disabled.
