---
name: Tax Calculation
description: Design and implement safe, financial-year-specific tax calculation logic for the Indian Income Tax Calculator.
---

# Tax Calculation Skill

Use this skill when designing or implementing tax calculation logic for the Indian Income Tax Calculator.

## Core Principle

Never invent tax rules.
Never assume rules from one financial year apply to another.
Verify tax rates, slabs, rebate behavior, surcharge thresholds, cess, and deductions against authoritative Indian tax sources before implementation.

If financial-year rules are unavailable or unclear, stop and resolve the rule source before coding.

## 1. Financial-Year-Specific Rules

- Treat each financial year as a separate rule set.
- Keep rule definitions versioned by financial year.
- Do not share slabs, rebates, deduction limits, or surcharge rules across years unless verified for that year.
- Prefer explicit rule objects over hard-coded inline values.
- When a new year is introduced, confirm every affected rule category again.

## 2. Old Regime

- The old regime must be modeled independently from the new regime.
- Apply only deductions and exemptions permitted for the selected financial year under the old regime.
- Calculate taxable income from gross income minus eligible deductions/exemptions.
- Apply the correct slab, rebate, surcharge, and cess logic for that year.

## 3. New Regime

- The new regime must have its own rule set and calculation path.
- Apply only the deductions and exemptions permitted for the selected year under the new regime.
- Do not assume old-regime deductions carry over.
- Apply the correct slab, rebate, surcharge, and cess logic for that year.

## 4. Income Calculation

- Start with category-wise income inputs.
- Support special treatment where required by law for each income category.
- Keep category-specific adjustments inside tax-domain logic, not in the UI.
- Be explicit about whether an income category increases gross income, net income, or taxable income.

Common income categories:

- Salary
- House property
- Business/professional income
- Capital gains
- Other income

## 5. Eligible Deductions

- Model deductions as regime- and year-aware eligibility rules.
- Do not treat every deduction input as universally applicable.
- Validate caps, eligibility conditions, and regime restrictions separately.
- Standard deduction, section-based deductions, and exemptions may differ by regime and year.

Common deduction inputs:

- Standard deduction
- Section 80C
- Section 80D
- Section 80CCD(1B)
- Section 80E
- Section 80G
- Home loan interest
- HRA
- LTA
- Other applicable deductions

## 6. Taxable Income

- Compute gross income first.
- Subtract only eligible deductions and exemptions.
- Prevent taxable income from becoming negative unless the rule source explicitly allows a carry-forward or special treatment.
- Keep intermediate values visible for debugging and testing.

## 7. Tax Slabs

- Use the slab structure for the selected financial year only.
- Keep slab boundaries and rates in rule data, not scattered through algorithm code.
- Handle boundary values explicitly.
- Ensure calculations are deterministic at exact slab limits.

## 8. Rebate

- Model rebate as a distinct calculation step.
- Apply only when the selected financial-year rule set allows it.
- Verify thresholds, caps, and eligibility before applying rebate.
- Do not hard-code rebate assumptions across years.

## 9. Surcharge

- Treat surcharge as a separate step after base tax and rebate logic.
- Use the correct income thresholds for the selected financial year.
- Confirm applicability for the regime and year before applying it.
- Do not assume surcharge thresholds remain stable across years.

## 10. Health and Education Cess

- Apply cess only according to the selected financial-year rules.
- Keep cess calculation separate from slab and surcharge logic.
- Ensure the final payable tax includes cess in the documented order of operations.

## 11. Special Treatment of Applicable Income Categories

- Some income categories may require special inclusion, exclusion, or adjustment rules.
- Keep those rules in the domain layer, close to the calculation logic.
- Do not let the UI interpret special treatment rules.
- Verify treatment of capital gains, house property, and business/professional income for the selected year before implementation.

## 12. Boundary Conditions

Test and verify:

- zero income
- normal income
- just below slab boundaries
- exactly at slab boundaries
- just above slab boundaries
- deduction caps reached exactly
- rebate threshold boundaries
- surcharge threshold boundaries
- cess on final tax amount

Boundary handling must be deterministic and documented.

## 13. Deterministic Calculations

- Tax calculations must be pure and predictable for the same inputs and rule set.
- Avoid hidden state, random behavior, and direct DOM access.
- Prefer small pure functions with explicit inputs and outputs.
- Return structured results that include intermediate values and final payable tax.

## 14. Unit Testing

Tax-related changes must include tests.

Tests should cover:

- zero income
- normal income
- boundary values
- just below tax slab boundaries
- exactly at boundaries
- just above boundaries
- deductions
- rebates
- cess
- surcharge
- Old Regime
- New Regime

Also test:

- financial-year rule selection
- regime-specific deduction eligibility
- taxable income computation
- final tax payable computation
- deterministic output for repeated runs

## 15. Separation of Rules from Algorithms

- Rules should describe what applies.
- Algorithms should describe how the tax is computed.
- Do not mix rule definitions with computation flow.
- Do not duplicate tax constants in multiple files.
- Keep old-regime and new-regime rule sets independent.

## Practical Guidance

- Read the approved requirement and architecture first.
- Confirm the financial year before calculating.
- Validate input before normalization.
- Normalize values into a consistent calculation shape.
- Calculate old and new regimes separately.
- Compare the results only after both calculations are complete.
- Report assumptions when a rule is ambiguous or missing.

## Common Mistakes

- Reusing a previous year’s slabs or thresholds.
- Hard-coding tax rates inside UI code.
- Applying deductions that are not allowed under the selected regime.
- Ignoring boundary values.
- Combining validation, calculation, and display logic in one function.
- Failing to test exact threshold cases.
- Returning a result without surfacing the intermediate values used.

## Validation Requirements

- Reject negative income and deduction values.
- Reject missing required inputs.
- Reject financial-year/rule combinations that are not defined.
- Verify regime eligibility for each deduction and exemption.
- Surface inconsistent data instead of guessing.

## Implementation Reminder

This skill is for planning and safe implementation guidance only.
Do not introduce application code here.
