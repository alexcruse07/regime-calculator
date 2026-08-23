---
name: Accessibility
description: Build and review accessible UI for the static Indian Income Tax Calculator.
---

# Accessibility Skill

Use this skill when building or reviewing accessible UI for the Indian Income Tax Calculator.

This skill is intended to guide both Developer and Reviewer agents.

## Core Principle

Accessibility is a first-class requirement.

The UI must be understandable, operable, and perceivable with keyboard, assistive technology, and small screens.

## 1. Semantic HTML

- Use semantic elements instead of generic containers when a native element exists.
- Prefer `form`, `fieldset`, `legend`, `label`, `button`, `main`, `section`, `header`, `footer`, `nav`, `h1`-`h6`, and `output` where appropriate.
- Use headings in a logical document order.
- Do not use div-based structure when semantic HTML can describe the same content.

## 2. Labels

- Every form control must have a visible, programmatic label.
- Label text should describe the input clearly and specifically.
- Placeholder text must not replace labels.
- Helper text may supplement a label, but not replace it.

## 3. Form Accessibility

- Group related controls with `fieldset` and `legend` when appropriate.
- Make financial-year selection easy to find and understand.
- Present income and deduction inputs in clear sections.
- Keep required fields clearly indicated.
- Preserve user input after validation failures.

## 4. Keyboard Navigation

- Every interactive control must be reachable and usable with the keyboard.
- Tab order should follow the visual and logical order of the page.
- Do not trap keyboard focus.
- Ensure buttons, links, inputs, and selects can be activated without a mouse.

## 5. Focus Management

- Move focus deliberately only when it improves usability.
- After a validation error, focus should help the user find the first problem.
- When displaying results, avoid stealing focus unless the user explicitly triggered the calculation.
- Maintain a visible focus indicator.

## 6. Error Messages

- Error messages must be clear, specific, and linked to the relevant control.
- Do not rely on color alone to show errors.
- If an error affects a group of fields, explain the issue at the group level as well as near the field when needed.
- Keep error language actionable and respectful.

## 7. Accessible Headings

- Use one clear page heading.
- Maintain a logical heading hierarchy.
- Do not skip heading levels without a reason.
- Headings should help users scan the page and understand the calculator sections.

## 8. ARIA Usage

- Prefer native HTML semantics before adding ARIA.
- Use ARIA only when native elements cannot express the needed relationship.
- Do not add unnecessary ARIA attributes.
- If ARIA is used, ensure it matches the real UI behavior exactly.

## 9. Responsive Design

- Ensure layouts work on small and large screens.
- Avoid horizontal scrolling for the main calculator experience.
- Keep interactive controls large enough for touch use.
- Preserve readability of the tax summary and comparison output at narrow widths.

## 10. Color and Contrast

- Maintain sufficient contrast for text, controls, borders, and error states.
- Do not communicate meaning through color alone.
- Ensure focus indicators are visible against the background.
- Verify contrast in both normal and error states.

## Practical Guidance for Developers

- Use semantic elements first.
- Label every control.
- Group related tax inputs clearly.
- Keep focus behavior predictable.
- Make errors easy to find and fix.
- Test the interface with keyboard only.
- Check contrast on all important states.

## Practical Guidance for Reviewers

- Confirm every control is labeled.
- Confirm keyboard navigation works end-to-end.
- Confirm focus is visible and logical.
- Confirm errors are specific and connected to the right input.
- Confirm headings make sense in context.
- Confirm ARIA is used only when needed.
- Confirm the layout remains usable on mobile screens.
- Confirm color is not the only signal for state or status.

## Common Mistakes

- Using placeholder text instead of labels.
- Hiding labels visually without preserving accessibility.
- Skipping heading levels.
- Overusing ARIA on native elements.
- Moving focus unexpectedly.
- Making error text too vague to act on.
- Breaking keyboard navigation with custom controls.
- Designing only for desktop widths.

## Review Checklist

- Semantic structure is correct.
- All inputs have labels.
- Keyboard operation works.
- Focus is visible and sensible.
- Errors are clear and accessible.
- Headings are organized.
- ARIA is minimal and correct.
- Responsive behavior is usable.
- Contrast is sufficient.

## Implementation Reminder

This skill is for accessibility guidance only.
Do not modify application code here.
