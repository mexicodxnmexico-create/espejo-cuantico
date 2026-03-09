## 2024-05-23 - Accessibility in Custom Modals
**Learning:** The application uses custom `div` overlays for modals (like `Onboarding`) without native `dialog` elements or ARIA attributes. This completely hides context from screen readers and traps keyboard focus in the underlying page.
**Action:** When encountering custom overlays, immediately check for `role="dialog"`, `aria-modal="true"`, and focus management. Simple `useEffect` focus on the primary action is a high-value, low-effort fix for these patterns.

## 2024-05-23 - Clear Visual Indication for State-Driven Disabled Buttons
**Learning:** The application extensively uses a state machine (`COLLAPSED` phase) where primary interaction buttons are disabled via the HTML `disabled` attribute. However, standard browser rendering of `disabled` does not natively provide sufficient visual distinctiveness (like reduced opacity or the `not-allowed` cursor) in completely custom-styled elements. Additionally, users were left confused as to *why* the buttons became unclickable without explicit context provided by tooltips.
**Action:** When implementing disabled states on custom-styled buttons tied to complex application states, always ensure explicit CSS overrides for opacity and cursor, and add an informative `title` attribute explaining the reason for the disabled state to enhance accessibility and user comprehension.
