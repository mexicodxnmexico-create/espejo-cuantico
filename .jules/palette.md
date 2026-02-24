## 2024-05-23 - Custom Modal Accessibility
**Learning:** Custom modals (e.g., in 'components/Onboarding.tsx') require explicit 'role="dialog"', 'aria-modal="true"', and focus management using 'useEffect' and 'useRef' to ensure accessibility, as they are implemented with 'div' overlays.
**Action:** Always wrap custom modal content in semantic containers with ARIA attributes and manage focus programmatically on mount and step changes.
