## 2025-05-21 - [Zero-Dependency Copy Feedback]
**Learning:** React's state-driven UI updates can feel sluggish for micro-interactions like clipboard feedback if not optimized. Using `navigator.clipboard` directly with a simple boolean state toggle is cleaner and lighter than importing a library.
**Action:** For simple copy interactions, always use `navigator.clipboard` + `setTimeout` for feedback instead of external packages. Ensure `aria-label` updates dynamically to inform screen readers of the success state.
