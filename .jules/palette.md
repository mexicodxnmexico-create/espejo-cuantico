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

## 2025-03-27 - Form Accessibility using Semantic Labels
**Learning:** Using heading tags like `<h3>` as makeshift labels above form inputs breaks screen reader accessibility by failing to associate the description with the form control.
**Action:** Always use semantic `<label>` tags with a proper `htmlFor` attribute that matches the `id` of the form element. Visual formatting (e.g., heading-like appearance) should be applied via CSS (e.g., `display: "block"`, `fontWeight: "bold"`) while maintaining semantic correctness.
