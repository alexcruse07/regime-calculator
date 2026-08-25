# Product Requirements Document

## 1. Product Overview

The Indian Income Tax Calculator is a static website that helps users estimate income tax liability under the Old Tax Regime and New Tax Regime and compare the results side by side.

The product is intended as an estimation and comparison tool only. It must present financial-year-specific tax outcomes based on verified Indian tax rules.

## 2. Problem Statement

Taxpayers often find it difficult to compare the old and new tax regimes because the outcome depends on income type, deductions, exemptions, and the applicable financial year. Users need a simple way to estimate tax payable and identify which regime may be more favorable.

## 3. Product Goals

- Help users estimate tax under both regimes for a chosen financial year.
- Allow users to enter income and deduction details in a structured way.
- Show a clear comparison of tax liability between regimes.
- Provide transparent calculation outputs and validation feedback.
- Avoid presenting incorrect or year-inappropriate tax rules.

## 4. Target Users

- Salaried individuals
- Self-employed individuals
- Taxpayers comparing regimes before filing returns
- Users seeking a quick tax estimate without professional software

## 5. Functional Requirements

- The application must allow users to enter income details.
- The application must allow users to enter deduction and exemption details.
- The application must allow users to select a financial year.
- The application must calculate tax under both regimes separately.
- The application must present a comparison between regimes.
- The application must show which regime results in lower tax payable.
- The application must display key intermediate values used in the estimate.

## 6. Income Inputs

The application must support the following income categories:

- Salary
- House property
- Business/professional income
- Capital gains
- Other income

The application must allow users to enter income amounts for each supported category.

## 7. Deduction Inputs

The application must support deduction and exemption inputs including:

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

The application must allow users to enter applicable deduction amounts and must clearly indicate that eligibility depends on the selected financial year and tax regime.

## 8. Financial Year Selection

- The application must let users select a financial year before viewing tax results.
- The application must apply only the tax rules relevant to the selected financial year.
- The application must not reuse tax slabs, rebates, deduction limits, or surcharge rules across financial years unless they are verified for that year.

## 9. Old Regime Calculation

The application must calculate old-regime tax using the financial-year-specific rules applicable to the selected year.

The old-regime calculation must account for:

- Gross income
- Eligible deductions and exemptions
- Taxable income
- Income tax
- Rebate, where applicable
- Surcharge, where applicable
- Health and education cess
- Total tax payable

## 10. New Regime Calculation

The application must calculate new-regime tax using the financial-year-specific rules applicable to the selected year.

The new-regime calculation must account for:

- Gross income
- Eligible deductions and exemptions permitted under the selected year and regime
- Taxable income
- Income tax
- Rebate, where applicable
- Surcharge, where applicable
- Health and education cess
- Total tax payable

## 11. Tax Comparison

The application must display:

- Old regime tax
- New regime tax
- Difference between the two amounts
- The regime with the lower tax liability

The application must clearly indicate when results are estimates and when a rule or limit is dependent on the selected financial year.

## 12. Validation Requirements

- The application must validate required inputs before calculation.
- The application must prevent negative income or deduction values.
- The application must validate that selected values are compatible with the chosen financial year.
- The application must surface missing or inconsistent data before computing results.
- The application must avoid silently correcting user input in ways that could affect the tax estimate.

## 13. User Experience Requirements

- The application must present income and deduction inputs in a clear, organized format.
- The application must make it easy to compare both regimes at a glance.
- The application must show calculation results in a readable summary.
- The application must communicate assumptions, limitations, and estimated values clearly.
- The application must work well on common desktop and mobile screen sizes.

## 14. Accessibility Requirements

- The application must be usable with keyboard navigation.
- The application must provide readable contrast for text and controls.
- The application must support screen-reader-friendly labels and error messages.
- The application must not rely on color alone to communicate tax comparison outcomes.

## 15. Privacy Requirements

- The application must not require account creation.
- The application must not request unnecessary personal information.
- The application should treat user-entered financial data as sensitive.
- The application must clearly state whether entered data is stored or remains local to the browser.

## 16. Performance Requirements

- The application must load quickly as a static website.
- Tax calculations must feel immediate after valid input is provided.
- The application must remain responsive during input and comparison updates.

## 17. Browser Support

The application must support current versions of major modern browsers, including:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## 18. Error Handling

- The application must show clear messages when inputs are missing, invalid, or unsupported.
- The application must distinguish between input validation errors and calculation issues.
- The application must not display misleading tax outputs when required data is incomplete.
- The application must preserve user-entered values when an error occurs, where feasible.

## 19. Future Enhancements

Potential future enhancements may include:

- More detailed financial-year rule coverage
- Additional income and deduction categories
- Downloadable tax summaries
- Saving comparison scenarios locally
- Guidance for regime selection based on user profile

## 20. Tax Calculation Disclaimer

The application must include a clear disclaimer that:

- It is an estimation tool only
- Tax rules change by financial year
- Users should verify rates, slab rules, rebates, deductions, and surcharge applicability against authoritative Indian tax sources
- The product does not replace advice from a qualified tax professional