## 2026-02-10 - Focus Management in Custom Modals
**Learning:** Custom modals implemented as `div` overlays require explicit focus management (moving focus to the modal or its content) and accessible attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`) to be usable by screen readers.
**Action:** Always use a `ref` to focus the modal content on mount, and ensure `tabIndex={-1}` is set on the target element if it's not natively focusable.
