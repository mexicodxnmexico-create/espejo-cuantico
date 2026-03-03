## 2024-05-23 - Custom Modal Accessibility
**Learning:** Custom modals (e.g., in 'components/Onboarding.tsx') require explicit 'role="dialog"', 'aria-modal="true"', and focus management using 'useEffect' and 'useRef' to ensure accessibility, as they are implemented with 'div' overlays.
**Action:** Always wrap custom modal content in semantic containers with ARIA attributes and manage focus programmatically on mount and step changes.

## 2024-05-24 - Scrollable Region Accessibility
**Learning:** Scrollable regions (like history logs) require 'tabIndex={0}' and an accessible name to be navigable via keyboard.
**Action:** Always add 'tabIndex={0}', 'role="region"' (or semantic role like 'log'), and 'aria-label' to custom scrollable containers.

## 2024-05-24 - Text Contrast Standards
**Learning:** Text color '#999' on light backgrounds (e.g., '#fafafa') fails WCAG AA contrast ratio (approx 2.9:1).
**Action:** Use '#555' (approx 7.5:1) or darker for secondary text to ensure readability for all users.

## 2024-03-03 - Disabled Button States in Inline Styled Apps
**Learning:** In applications relying heavily on inline styles (like this one), standard HTML `disabled` attributes don't automatically confer visual disabled styling. Furthermore, standard disabled pointers don't explicitly explain the restriction.
**Action:** When working with inline styles, ensure `opacity: 0.5` and `cursor: not-allowed` are explicitly added to disabled buttons. Pair this with a `title` attribute explaining exactly *why* the action is restricted for better accessibility and user context.
