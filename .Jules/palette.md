## 2024-03-20 - Missing aria-label for inputs and selects
## 2024-03-20 - Semantic Form Controls
**Learning:** Found a pattern of using `<h3>` tags for visual labels above form controls instead of semantic `<label>` elements. This breaks screen reader associations and reduces clickable hit areas.
**Action:** Always replace visual-only heading labels with semantic `<label htmlFor="...">` linked to the input's `id`.
