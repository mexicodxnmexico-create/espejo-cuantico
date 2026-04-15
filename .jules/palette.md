## 2024-05-23 - Custom Modal Accessibility
**Learning:** Custom modals (e.g., in 'components/Onboarding.tsx') require explicit 'role="dialog"', 'aria-modal="true"', and focus management using 'useEffect' and 'useRef' to ensure accessibility, as they are implemented with 'div' overlays.
**Action:** Always wrap custom modal content in semantic containers with ARIA attributes and manage focus programmatically on mount and step changes.

## 2024-05-24 - Scrollable Region Accessibility
**Learning:** Scrollable regions (like history logs) require 'tabIndex={0}' and an accessible name to be navigable via keyboard.
**Action:** Always add 'tabIndex={0}', 'role="region"' (or semantic role like 'log'), and 'aria-label' to custom scrollable containers.

## 2024-05-24 - Text Contrast Standards
**Learning:** Text color '#999' on light backgrounds (e.g., '#fafafa') fails WCAG AA contrast ratio (approx 2.9:1).
**Action:** Use '#555' (approx 7.5:1) or darker for secondary text to ensure readability for all users.

## 2025-03-15 - Critical Error State Accessibility
**Learning:** When a system enters a critical error or collapsed state that disables primary UI interactions, simply rendering the state is insufficient. It requires 'role="alert"' to announce the critical state and explicit focus shifting (via 'autoFocus' or 'useEffect' with 'useRef') to the primary recovery action to maintain accessibility.
**Action:** Always add 'role="alert"' to error containers and explicitly shift focus to the recovery button or primary text when a disruptive error state mounts.

## 2025-04-15 - Input Labels with Implicit Headers
**Learning:** Re-purposing header tags (like `<h3>`) as visual labels for inputs is a common anti-pattern that breaks screen reader accessibility since the input is unassociated with a `<label>`. However, you can perfectly replace them with `<label htmlFor="id">` and retain the exact visual styling (e.g., `display: "block"`, `fontWeight: "bold"`).
**Action:** Always replace visual-only headers used to label inputs with explicit `<label>` elements linked via `id` and `htmlFor`, mimicking the old display styles if necessary to avoid design regressions.
