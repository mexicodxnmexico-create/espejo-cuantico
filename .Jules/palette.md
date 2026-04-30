## 2024-04-30 - Structural Elements as Labels
**Learning:** This app frequently uses block-level structural elements like `<h3>` as pseudo-labels for form controls, which breaks screen reader association. Replacing them with `<label>` tags can cause visual regressions since labels are inline elements by default.
**Action:** When converting structural elements to semantic `<label>` tags for accessibility, explicitly apply `display: 'block'` and `fontWeight: 'bold'` in the inline styles to maintain the original design layout.
