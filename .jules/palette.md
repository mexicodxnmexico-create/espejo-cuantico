# Palette's Journal

## 2025-02-18 - Focus Management in Multi-Step Modals
**Learning:** In multi-step wizards (like Onboarding), simply updating state isn't enough for screen readers. Users might miss that the content has changed.
**Action:** Use a `useEffect` to programmatically focus the section heading (`tabIndex={-1}`) whenever the step index changes. This forces the screen reader to announce the new title immediately.
