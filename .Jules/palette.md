## 2024-05-11 - Use semantic labels for form accessibility
**Learning:** In React functional components (like `MeditacionAudioVisual3D`), using `<h3>` tags as visual-only titles for inputs and selects prevents screen readers from correctly associating the form control with its label.
**Action:** Always replace visual-only heading tags above inputs/selects with proper semantic `<label>` elements. Ensure that `htmlFor` matches the `id` of the respective `<input>` or `<select>` control to maintain both visual structure and full accessibility.
