## 2024-05-23 - Custom Modal Accessibility
**Learning:** Custom modals (e.g., in 'components/Onboarding.tsx') require explicit 'role="dialog"', 'aria-modal="true"', and focus management using 'useEffect' and 'useRef' to ensure accessibility, as they are implemented with 'div' overlays.
**Action:** Always wrap custom modal content in semantic containers with ARIA attributes and manage focus programmatically on mount and step changes.

## 2024-05-24 - Scrollable Region Accessibility
**Learning:** Scrollable regions (like history logs) require 'tabIndex={0}' and an accessible name to be navigable via keyboard.
**Action:** Always add 'tabIndex={0}', 'role="region"' (or semantic role like 'log'), and 'aria-label' to custom scrollable containers.

## 2024-05-24 - Text Contrast Standards
**Learning:** Text color '#999' on light backgrounds (e.g., '#fafafa') fails WCAG AA contrast ratio (approx 2.9:1).
**Action:** Use '#555' (approx 7.5:1) or darker for secondary text to ensure readability for all users.

## 2024-05-25 - Disabled Button States
**Learning:** To clearly communicate disabled states for accessibility and UX, buttons should visually reflect their state using CSS styles like `opacity: 0.5` and `cursor: not-allowed` instead of retaining normal pointers, and should provide context using a `title` attribute or tooltip explaining why the action is restricted.
**Action:** Always verify disabled buttons have both visual distinction and contextual explanation for screen readers and pointer-users alike.
