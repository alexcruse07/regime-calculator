---
name: Testing
description: Test tax calculations, rules, UI behavior, and regression scenarios for the static Indian Income Tax Calculator.
---

# Testing Skill

Use this skill when adding, updating, or reviewing tests for the Indian Income Tax Calculator.

## Core Principle

Tax-related changes must be tested.

Tests must verify behavior against the selected financial year and must not assume rules from another year.

## 1. What to Test

Test the following areas:

- Tax calculations
- Financial-year rules
- Old regime
- New regime
- Income inputs
- Deductions
- Rebates
- Cess
- Surcharge
- Boundary conditions
- Invalid input
- UI behavior
- Regression scenarios

## 2. Tax Calculation Tests

- Verify total tax payable for representative income mixes.
- Verify taxable income is computed correctly before tax is applied.
- Verify intermediate values when the implementation exposes them.
- Verify deterministic output for the same inputs and rule set.

## 3. Financial-Year Rule Tests

- Test rule selection by financial year.
- Test that each year uses its own slabs, thresholds, and deduction rules.
- Test that rules do not leak across years.
- Test old-regime and new-regime rule sets independently.

## 4. Old Regime and New Regime Tests

- Verify old regime calculations with eligible deductions.
- Verify new regime calculations with its allowed deductions only.
- Verify regime-specific treatment of the same input data.
- Verify comparison outputs when one regime is lower than the other.

## 5. Income Input Tests

- Test salary, house property, business/professional income, capital gains, and other income.
- Test zero income.
- Test normal income values.
- Test combinations of multiple income categories.

## 6. Deduction Tests

- Test standard deduction.
- Test section-based deductions.
- Test deduction caps.
- Test regime-restricted deductions.
- Test that ineligible deductions are not applied.

## 7. Rebate, Cess, and Surcharge Tests

- Test rebate eligibility and thresholds.
- Test cess on the final tax amount.
- Test surcharge thresholds and applicability.
- Test exact boundary values for each of these rules.

## 8. Boundary Conditions

Boundary testing is essential.

Test:

- just below tax slab boundaries
- exactly at tax slab boundaries
- just above tax slab boundaries
- just below rebate thresholds
- exactly at rebate thresholds
- just above rebate thresholds
- just below surcharge thresholds
- exactly at surcharge thresholds
- just above surcharge thresholds

Boundary tests should confirm rounding, inclusivity, and ordering of calculations.

## 9. Invalid Input Tests

- Reject negative income values.
- Reject negative deduction values.
- Reject missing required fields.
- Reject unsupported financial years.
- Reject incompatible combinations of inputs and selected rules.
- Verify useful error messages when validation fails.

## 10. UI Behavior Tests

- Verify the form accepts and preserves user input.
- Verify validation errors are shown clearly.
- Verify calculation results render correctly.
- Verify comparison output updates after input changes.
- Verify the UI does not calculate tax inside the DOM layer.

## 11. Regression Scenarios

Regression tests should protect against:

- accidental changes to tax slabs
- wrong financial-year rule selection
- deductions being applied in the wrong regime
- broken boundary handling
- missing cess or surcharge application
- incorrect comparison results
- UI changes that break validation or results display

## 12. Good Unit-Testing Practices

- Test pure calculation functions directly where possible.
- Keep tests small and focused on one behavior.
- Use explicit expected values.
- Name tests to describe the scenario clearly.
- Prefer readable fixtures over large shared setup.
- Cover both happy paths and error paths.
- Avoid brittle tests that depend on implementation details unrelated to behavior.
- Keep rule data in the test setup aligned with the selected financial year.

## 13. Testing Strategy Guidance

- Start with unit tests for pure tax logic.
- Add tests for rule selection and calculation orchestration.
- Add UI tests only for form behavior, validation, and result display.
- Add regression tests whenever a bug is fixed.
- Re-run boundary tests whenever a slab, rebate, surcharge, or cess rule changes.

## Common Mistakes

- Reusing one year’s expected values for another year.
- Ignoring exact slab boundaries.
- Testing only happy paths.
- Asserting UI details instead of behavior.
- Removing tests to make changes easier.
- Forgetting to test invalid input.

## Implementation Reminder

This skill is for testing guidance only.
Do not implement application tests here.
