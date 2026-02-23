## 2024-05-23 - Custom Modal Accessibility
**Learning:** Custom modals (e.g., in 'components/Onboarding.tsx') require explicit 'role="dialog"', 'aria-modal="true"', and focus management using 'useEffect' and 'useRef' to ensure accessibility, as they are implemented with 'div' overlays.
**Action:** Always wrap custom modal content in semantic containers with ARIA attributes and manage focus programmatically on mount and step changes.

## 2026-02-23 - Accessible Status & Semantic Logs
**Learning:** Live regions (`role="status"`, `aria-live="polite"`) are critical for announcing dynamic text changes like system status updates that occur outside the user's focus. For appending lists like event logs, `<ul>` with `role="log"` provides semantic structure and automatic announcements for screen readers.
**Action:** Always wrap dynamic status text in a live region and convert list-based logs to semantic `<ul>` structures.
