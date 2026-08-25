---
name: Frontend Development
description: Build the static tax calculator UI with accessible, maintainable frontend practices.
---

# Frontend Development Skill

Use this skill when building or modifying the frontend of the static Indian Income Tax Calculator.

## Core Principle

Keep presentation, interaction, and tax/business logic separate.

Tax calculation logic must not live directly inside UI code.

## 1. Semantic HTML

- Use semantic elements such as `header`, `main`, `section`, `form`, `fieldset`, `legend`, `label`, `button`, and `output` where appropriate.
- Use headings in a logical order.
- Associate every form control with a visible label.
- Use semantic structure to make the tax calculator easy to understand and navigate.

## 2. Modern JavaScript

- Use modern JavaScript syntax and APIs.
- Prefer small, focused functions.
- Avoid global state where possible.
- Keep event handlers simple and readable.
- Use clear data flow from input → validation → normalized values → results → UI update.

## 3. ES Modules

- Prefer ES modules for organizing frontend code.
- Split UI concerns, formatting helpers, validation helpers, and orchestration logic into separate modules.
- Import only what each module needs.
- Avoid mixing unrelated behavior in a single file.

## 4. Responsive CSS

- Build layouts that adapt to desktop and mobile screens.
- Prefer flexible layouts, fluid spacing, and readable typography.
- Avoid fixed dimensions that break on small screens.
- Keep the tax comparison summary readable at narrow widths.

## 5. Form Design

- Group related inputs logically.
- Use clear labels and helper text.
- Make numeric inputs easy to scan and edit.
- Keep income inputs separate from deduction inputs.
- Make the financial year selection obvious and prominent.

## 6. Form Validation

- Validate required fields before calculation.
- Reject negative values unless the requirement explicitly allows them.
- Show inline, specific error messages near the relevant control.
- Preserve user-entered data when validation fails.
- Do not silently coerce invalid values into different tax assumptions.

## 7. Indian Currency Formatting

- Format monetary values consistently for Indian users.
- Use Indian numbering conventions where appropriate.
- Display amounts with the correct currency context.
- Keep raw numeric values separate from formatted display values.

## 8. Separation of UI and Business Logic

- UI code should read inputs, display errors, and render results.
- Tax calculations should happen in domain or utility code outside the DOM layer.
- UI components may call calculation functions, but should not contain tax formulas.
- Do not duplicate tax rules in event handlers or render functions.

## 9. DOM Manipulation Practices

- Keep DOM queries centralized where practical.
- Update only the parts of the page that changed.
- Avoid unnecessary re-renders or repeated DOM work.
- Prefer predictable state updates over ad hoc DOM edits.
- Do not let DOM code become the place where calculation rules are encoded.

## 10. Error Handling

- Surface clear messages for invalid input, missing data, and unsupported scenarios.
- Distinguish validation issues from calculation issues.
- Avoid silent failures.
- Keep the form usable even when one section contains errors.

## 11. Accessibility

- Support keyboard navigation.
- Use readable contrast.
- Provide accessible labels, instructions, and error messages.
- Ensure the comparison result is understandable without color alone.
- Use ARIA only when native semantics are insufficient.

## 12. Mobile Responsiveness

- Design for small screens first or ensure graceful shrinking.
- Keep controls large enough for touch interaction.
- Avoid dense layouts that require horizontal scrolling.
- Make the tax summary easy to read on phones.

## 13. Browser Compatibility

- Support current versions of major modern browsers.
- Prefer well-supported platform features.
- Avoid unnecessary browser-specific behavior.
- Test layout and interaction in common evergreen browsers.

## 14. Avoiding Unnecessary Dependencies

- Prefer built-in browser APIs and simple helpers.
- Do not introduce libraries unless they solve a real problem.
- Avoid frameworks or packages that add complexity without clear benefit.
- Keep the frontend lightweight for a static site.

## Practical Guidance

- Start from the product requirements and architecture.
- Keep the UI focused on input, validation, formatting, and display.
- Call calculation logic from outside the DOM layer.
- Use reusable helpers for formatting and validation.
- Keep files small and purpose-driven.

## Common Mistakes

- Putting tax formulas inside click handlers.
- Mixing formatting logic with business logic.
- Using unlabeled inputs.
- Breaking mobile layouts with fixed widths.
- Hiding validation errors or overwriting user input.
- Adding dependencies for tasks the platform can already handle.

## Validation Checklist

- Inputs are labeled and grouped logically.
- Validation messages are specific and accessible.
- Tax results are formatted clearly.
- UI remains responsive on mobile and desktop.
- Browser support is consistent across major modern browsers.
- Tax logic remains outside the UI layer.

## Implementation Reminder

This skill is for frontend guidance only.
Do not implement application code here.
