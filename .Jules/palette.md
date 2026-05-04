## 2024-05-18 - Semantic Labels in Forms
**Learning:** Found instances where `<h3>` tags were being used as visual-only titles for form elements without proper semantic association. This breaks screen reader accessibility since the input is orphaned from its description.
**Action:** Always replace visual-only heading elements (like `<h3>`) that label form fields with semantic `<label>` tags. Ensure the `htmlFor` attribute on the label explicitly matches the `id` of the form control (`<select>`, `<input>`) and use `display: block` to preserve the visual layout.
