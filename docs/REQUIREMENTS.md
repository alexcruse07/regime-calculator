# Tax Calculator --- Requirements

**Project:** Tax Calculator\
**Application Type:** Static website\
**Primary Purpose:** Calculate and compare Indian income tax under the
Old Tax Regime and New Tax Regime.\
**Source of Truth:** This document defines the functional and UI
requirements for the AI-agent development workflow.

------------------------------------------------------------------------

# 1. Project Objective

Build a modern, responsive, production-quality static website named
**Tax Calculator**.

The application must allow a user to:

1.  Select a Financial Year.
2.  Select:
    -   Old Tax Regime
    -   New Tax Regime
    -   Compare Both Regimes
3.  Enter income details.
4.  Enter applicable deductions and exemptions.
5.  Calculate tax.
6.  Compare Old Regime vs New Regime.
7.  Show the tax payable under each regime.
8.  Show estimated savings.
9.  Show a detailed tax breakdown.
10. Explain which regime results in lower tax.

The complete calculation must run in the browser. No application backend
is required.

Tax rules must be financial-year-specific and data-driven.

------------------------------------------------------------------------

# 2. Important Development Principles

The AI agents must follow these principles:

-   `docs/BACKLOG.md` is the detailed source of truth when both files
    exist.
-   Every requirement must be planned before implementation.
-   Requirements must be implemented in dependency order.
-   Do not invent Indian tax rules.
-   Do not invent tax slabs, rates, rebate limits, deduction limits,
    surcharge rules, cess rules, or capital-gain rates.
-   Tax rules must be verified before implementation.
-   If a required tax rule cannot be verified, mark the requirement as
    `BLOCKED` rather than guessing.
-   Keep the tax calculation engine independent from the UI.
-   Keep financial-year tax rules configurable.
-   Do not store AWS credentials or secrets in source code.
-   Do not deploy until the production build has passed testing and
    review.
-   Human approval is required at the workflow approval gates defined by
    the Orchestrator.

------------------------------------------------------------------------

# 3. Existing Completed Requirements

The following requirements have already been completed.

  ID        Requirement                                 Status
  --------- ------------------------------------------- --------
  TAX-001   Create Static Website Foundation            DONE
  TAX-002   Create Application Header                   DONE
  TAX-003   Create Financial Year Selection             DONE
  TAX-004   Create Salary Income Input                  DONE
  TAX-005   Create House Property Income Input          DONE
  TAX-006   Create Business/Professional Income Input   DONE
  TAX-007   Create Capital Gains Input                  DONE
  TAX-008   Create Other Income Input                   DONE

The existing generic Capital Gains implementation must be
replaced/restructured by TAX-010.

------------------------------------------------------------------------

# 4. Remaining Requirements

The remaining project is intentionally consolidated into eight major
requirements.

  ---------------------------------------------------------------------------
  ID             Title           Priority       Status         Dependencies
  -------------- --------------- -------------- -------------- --------------
  TAX-009        Regime          P0             TODO           TAX-003
                 Selection &                                   
                 Dynamic Form                                  

  TAX-010        Complete Income P0             TODO           TAX-009
                 & Deduction                                   
                 Form                                          

  TAX-011        Tax Calculation P0             TODO           TAX-010
                 Engine                                        

  TAX-012        Tax Comparison  P0             TODO           TAX-011
                 & Results                                     

  TAX-013        Professional    P0             TODO           TAX-009,
                 UI/UX                                         TAX-012

  TAX-014        Validation &    P0             TODO           TAX-012,
                 Comprehensive                                 TAX-013
                 Testing                                       

  TAX-015        Production      P0             TODO           TAX-014
                 Build & Quality                               
                 Review                                        

  TAX-016        AWS             P1             TODO           TAX-015
                 S3/CloudFront                                 
                 Deployment                                    
  ---------------------------------------------------------------------------

------------------------------------------------------------------------

# 5. TAX-009 --- Regime Selection & Dynamic Form

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-003

## Objective

The user must select the tax regime before entering detailed tax
information.

Support:

-   Old Tax Regime
-   New Tax Regime
-   Compare Both Regimes

## Requirements

The regime selection must be displayed prominently near the beginning of
the calculator.

### Old Regime

When Old Regime is selected:

-   Display applicable Old Regime income inputs.
-   Display applicable Old Regime exemptions.
-   Display applicable Old Regime deductions.

### New Regime

When New Regime is selected:

-   Display only inputs applicable to the New Regime for the selected
    financial year.
-   Do not show irrelevant Old Regime deductions.

### Compare Both

When Compare Both is selected:

-   Display all inputs required to calculate both regimes.
-   Clearly identify regime-specific deductions.

Use labels such as:

-   `Old Regime`
-   `New Regime`
-   `Both Regimes`

## Behaviour

Changing the regime must dynamically update the form without a page
reload.

Hidden or disabled fields must not accidentally contribute to the
calculation.

Existing values must be handled safely when the user switches regimes.

## Acceptance Criteria

-   Regime selection appears before detailed inputs.
-   User can select Old Regime.
-   User can select New Regime.
-   User can select Compare Both.
-   Selected regime is visually highlighted.
-   Input sections dynamically change.
-   Compare Both provides all required inputs.
-   Inapplicable values are not included accidentally.
-   Financial Year and Regime are required before calculation.

------------------------------------------------------------------------

# 6. TAX-010 --- Complete Income & Deduction Form

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-009

## Objective

Create a comprehensive Indian income-tax input form.

The existing generic `Capital Gains` field must be removed or replaced.

Do not keep a single generic Capital Gains field alongside the new
detailed fields unless there is a documented backward-compatibility
reason.

## Income Categories

### 6.1 Salary Income

Support:

-   Gross Salary
-   Applicable salary components required for the calculation
-   Salary-related exemptions where applicable

The architecture must allow additional salary fields to be introduced
later.

### 6.2 House Property

Support:

-   House Property Income
-   House Property Loss where applicable
-   Home Loan Interest where applicable

### 6.3 Business / Professional Income

Support:

-   Business Income
-   Professional Income
-   Business/Professional Loss where applicable

### 6.4 Short-Term Capital Gains

Provide a dedicated STCG section.

Where different tax treatment applies, maintain separate categories so
the tax engine can distinguish them.

### 6.5 Long-Term Capital Gains

Provide a dedicated LTCG section.

Where different tax treatment applies, maintain separate categories.

### 6.6 Speculative Gains

Provide a separate input for:

-   Speculative Business Gains/Losses

Do not merge speculative income into normal income unless the applicable
tax rule explicitly requires it.

### 6.7 Futures & Options

Provide a separate section for:

-   F&O Gains/Losses

F&O must not be represented as a capital-gains field.

### 6.8 Other Income

Support:

-   Interest Income
-   Dividend Income
-   Other Taxable Income

## Deductions

Support applicable deductions including, where permitted for the
selected financial year and regime:

-   Standard Deduction
-   Section 80C
-   Section 80CCD(1B)
-   Section 80D
-   Section 80E
-   Section 80G
-   Section 80TTA
-   Section 80TTB
-   Home Loan Interest
-   HRA where applicable
-   Other applicable deductions

The final list and limits must be controlled by verified financial-year
tax rules.

## Data Model

The domain model must preserve income categories separately.

Conceptually:

``` text
Income
├── Salary
├── House Property
├── Business / Professional
├── Short-Term Capital Gains
├── Long-Term Capital Gains
├── Speculative Gains
├── F&O Gains
└── Other Income
```

## Acceptance Criteria

-   All major income categories have separate fields.
-   STCG and LTCG are separate.
-   Speculative gains are separate.
-   F&O is separate.
-   Deductions are separated according to regime applicability.
-   Monetary values use Indian Rupee formatting.
-   Validation exists for every input.
-   Internal calculations use numeric values, not formatted strings.
-   The tax engine receives structured data rather than reading values
    directly from DOM elements.

------------------------------------------------------------------------

# 7. TAX-011 --- Tax Calculation Engine

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-010

## Objective

Implement a reliable, testable tax calculation engine supporting:

-   Old Regime
-   New Regime
-   Compare Both

## Architecture

Separate these responsibilities:

1.  Income collection
2.  Income classification
3.  Taxable-income calculation
4.  Deduction calculation
5.  Normal slab calculation
6.  Special-rate calculation
7.  Rebate
8.  Surcharge
9.  Health & Education Cess
10. Final tax calculation
11. Comparison

The UI must not contain the tax calculation logic.

## Normal Income

Handle applicable:

-   Salary
-   House Property
-   Business/Professional Income
-   Other Income

## Special-Rate Income

Handle separately:

-   Applicable STCG
-   Applicable LTCG
-   Other income subject to special rates

Do not automatically apply normal slab rates to every capital gain.

## Old Regime

Calculate, where applicable:

1.  Gross Income
2.  Exemptions
3.  Eligible Deductions
4.  Taxable Normal Income
5.  Normal Slab Tax
6.  Special-Rate Tax
7.  Rebate
8.  Surcharge
9.  Health & Education Cess
10. Final Tax Payable

## New Regime

Calculate the equivalent components using the verified rules for the
selected financial year.

## Financial-Year Rules

Tax rules must be data-driven.

Conceptually:

``` text
financialYear
    ├── oldRegime
    │     ├── slabs
    │     ├── deductions
    │     ├── rebates
    │     └── rates
    │
    └── newRegime
          ├── slabs
          ├── deductions
          ├── rebates
          └── rates
```

The implementation must make it possible to add a new financial year
without rewriting the calculation engine.

## Critical Rule

Never guess:

-   tax slabs
-   tax rates
-   rebate limits
-   deduction limits
-   surcharge thresholds
-   cess
-   special capital-gain rates
-   exemption rules

If a rule cannot be verified, the agent must mark the affected
requirement `BLOCKED`.

## Acceptance Criteria

-   Old Regime calculation works.
-   New Regime calculation works.
-   Compare Both works.
-   Normal income is calculated separately from special-rate income.
-   Tax engine is independent of UI.
-   Tax calculation functions are unit-testable.
-   Financial-year rules are configurable.
-   Calculation results expose enough information for a detailed tax
    breakdown.

------------------------------------------------------------------------

# 8. TAX-012 --- Tax Comparison & Results

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-011

## Objective

Present the calculation in a clear and understandable manner.

## Tax Summary

Display:

-   Gross Total Income
-   Total Exemptions
-   Total Deductions
-   Taxable Income
-   Normal Income Tax
-   Special-Rate Tax
-   Rebate
-   Surcharge
-   Health & Education Cess
-   Total Tax Payable

## Old vs New Comparison

Display:

  Component            Old Regime   New Regime
  ------------------ ------------ ------------
  Taxable Income                ₹            ₹
  Income Tax                    ₹            ₹
  Special-Rate Tax              ₹            ₹
  Rebate                        ₹            ₹
  Surcharge                     ₹            ₹
  Cess                          ₹            ₹
  Total Tax                     ₹            ₹

## Savings

Clearly show the better result.

Example:

`You save ₹XX,XXX with the New Tax Regime`

or:

`You save ₹XX,XXX with the Old Tax Regime`

If both are equal:

`Both regimes result in the same estimated tax.`

## Detailed Breakdown

Allow the user to inspect:

1.  Gross income
2.  Exemptions
3.  Deductions
4.  Taxable income
5.  Normal slab tax
6.  Special-rate tax
7.  Rebate
8.  Surcharge
9.  Cess
10. Final tax payable

## Acceptance Criteria

-   Results update after calculation.
-   Old and New results are visually separated.
-   Savings is clearly highlighted.
-   Recommended/lower-tax regime is shown.
-   Detailed breakdown is available.
-   Indian currency formatting is used.
-   Result calculations reconcile with the tax engine.

------------------------------------------------------------------------

# 9. TAX-013 --- Professional UI/UX

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-009, TAX-012

## Objective

Transform the current basic form into a modern, professional financial
calculator website.

The website must not look like a plain HTML form.

## Visual Reference

A visual reference image must be stored in:

``` text
docs/design/tax-calculator-reference.png
```

The UI/UX agent must inspect this image before implementation.

The image is the visual design reference for:

-   overall layout
-   visual hierarchy
-   spacing
-   typography
-   color direction
-   card structure
-   form presentation
-   result presentation
-   navigation
-   footer

The implementation should follow the design direction without performing
pixel-perfect copying.

Functionality, accessibility and maintainability take precedence over
exact pixel matching.

## Branding

Application name:

**Tax Calculator**

Primary hero heading:

**Calculate Your Income Tax**

Supporting message:

**Compare Old vs New Tax Regime and find which option saves you more.**

## Header

Create a professional navigation header containing:

-   Tax Calculator branding/logo
-   Calculator
-   Old vs New
-   Tax Guide
-   About

The active section should be visually identifiable.

## Hero

Create an attractive hero area containing:

-   Main heading
-   Supporting description
-   Relevant informational messaging
-   Primary calculator CTA

## Progress Indicator

Use a clear step indicator:

``` text
1. Regime
2. Income
3. Deductions
4. Review
```

The active step must be visually highlighted.

## Calculator Layout

On desktop use a two-column layout.

### Left Side

-   Financial Year
-   Regime Selection
-   Income
-   Deductions
-   Calculate button

### Right Side

-   Tax Summary
-   Old vs New comparison
-   Savings
-   Recommended regime
-   Tax breakdown

On mobile, stack sections vertically.

## Form Design

Use:

-   modern input controls
-   clear labels
-   helper text
-   radio cards or segmented controls for regime selection
-   appropriate icons where useful
-   clear validation messages
-   card-based sections
-   consistent spacing

Avoid:

-   plain browser form appearance
-   excessive borders
-   cramped fields
-   inconsistent spacing
-   overly dense forms
-   unstyled tables

## Visual Design

Use:

-   professional financial color palette
-   blue/purple accent direction where appropriate
-   subtle gradients where useful
-   rounded cards
-   subtle shadows
-   clear typography hierarchy
-   large, readable headings
-   strong primary CTA
-   consistent border radius
-   responsive grid

Do not overuse animations.

Animations must not interfere with accessibility or performance.

## Result Design

Make the final result visually prominent.

Display:

-   Total Tax
-   Recommended Regime
-   Savings
-   Old vs New comparison
-   Detailed breakdown

## Feature / Information Section

Add supporting sections such as:

-   Instant Results
-   Easy Comparison
-   Financial-Year Based Rules
-   Mobile Friendly

Do not make unsupported claims such as guaranteed accuracy.

Use wording such as:

`Calculation based on the tax rules configured for the selected financial year.`

## Disclaimer

Display:

`Tax calculations are estimates based on the tax rules configured for the selected financial year. Please verify your final tax liability with official government resources or a qualified tax professional.`

## Footer

Create a professional footer.

### Brand

Tax Calculator

Description:

`Smart tax calculation and comparison tool for Indian taxpayers.`

### Quick Links

-   Calculator
-   Old vs New Regime
-   Tax Guide
-   About
-   Disclaimer

### Developer

Display:

`Developed by`

`Rajesh Jaiswal`

Email and phone must be read from configuration.

Do not invent contact information.

Do not hard-code contact information in multiple files.

## Responsive Design

Support:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

No horizontal scrolling should occur on normal mobile screens.

## Accessibility

Follow WCAG-oriented practices:

-   semantic HTML
-   keyboard navigation
-   visible focus states
-   labels for every input
-   accessible validation messages
-   sufficient contrast
-   accessible buttons
-   accessible form controls

## Visual Review

After implementation, the UI/UX agent must:

1.  Run the application.
2.  Inspect the rendered page.
3.  Compare it against the reference image.
4.  Identify obvious visual differences.
5.  Improve spacing, hierarchy and presentation.
6.  Verify responsive layouts.

## Acceptance Criteria

-   The website no longer looks like a basic HTML form.
-   The application looks like a polished consumer financial product.
-   Reference image was inspected.
-   Desktop layout is polished.
-   Mobile layout is polished.
-   Regime selection is visually prominent.
-   Tax result is visually prominent.
-   Footer is professional.
-   Accessibility requirements are satisfied.

------------------------------------------------------------------------

# 10. TAX-014 --- Validation & Comprehensive Testing

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-012, TAX-013

## Objective

Ensure the calculator is functionally, mathematically and visually
reliable.

## Functional Tests

Test:

-   Financial Year
-   Regime selection
-   Old Regime
-   New Regime
-   Compare Both
-   Salary
-   House Property
-   Business/Professional income
-   STCG
-   LTCG
-   Speculative gains
-   F&O
-   Other income
-   Deductions
-   Calculate
-   Tax comparison
-   Savings
-   Detailed breakdown

## Boundary Tests

Test:

-   Zero income
-   Just below slab boundaries
-   Exactly at slab boundaries
-   Just above slab boundaries
-   Deduction limits
-   Rebate threshold
-   Surcharge threshold
-   Eligible negative values
-   Invalid values

## UI Tests

Test:

-   Desktop
-   Tablet
-   Mobile
-   Regime switching
-   Conditional field visibility
-   Form validation
-   Calculation
-   Results
-   Footer
-   Keyboard navigation

## Tax Tests

Expected tax values must come from verified tax rules.

Never invent expected tax values.

## Acceptance Criteria

-   Critical functionality has automated tests.
-   Tax calculation tests pass.
-   UI tests pass.
-   Validation tests pass.
-   Responsive checks pass.
-   No critical or high-severity defect remains.

------------------------------------------------------------------------

# 11. TAX-015 --- Production Build & Quality Review

**Priority:** P0\
**Status:** TODO\
**Dependencies:** TAX-014

## Objective

Prepare the website for production deployment.

## Checks

Run:

-   Unit tests
-   Integration/component tests where applicable
-   UI tests
-   Lint
-   Production build
-   Accessibility checks where available

## Review

Review:

-   Functionality
-   Tax calculation correctness
-   UI quality
-   Responsive behaviour
-   Accessibility
-   Performance
-   Security
-   Maintainability
-   Browser compatibility

## Requirements

The production website must:

-   work without a backend
-   contain no secrets
-   contain no AWS credentials
-   contain no debug code
-   contain no blocking browser console errors
-   have optimized production assets

## Acceptance Criteria

-   All tests pass.
-   Production build succeeds.
-   No CRITICAL/HIGH issues remain.
-   Static production files are ready for S3.
-   Reviewer approves production readiness.

------------------------------------------------------------------------

# 12. TAX-016 --- AWS S3/CloudFront Deployment

**Priority:** P1\
**Status:** TODO\
**Dependencies:** TAX-015

## Objective

Deploy the production static Tax Calculator website to AWS.

## Deployment

Use the configured AWS MCP.

Deploy production assets to:

**Amazon S3**

Optionally serve through:

**Amazon CloudFront**

## Deployment Safety

Before deployment:

1.  Verify AWS identity.
2.  Verify AWS account.
3.  Verify target S3 bucket.
4.  Verify target environment.
5.  Show deployment plan.
6.  Require human approval before destructive or production actions.

Never:

-   expose AWS credentials
-   commit credentials
-   delete unrelated resources
-   overwrite unrelated files
-   deploy an untested build

## Deployment Verification

After deployment verify:

-   Website loads.
-   CSS loads.
-   JavaScript loads.
-   Images/assets load.
-   Financial Year selection works.
-   Regime selection works.
-   Dynamic form works.
-   Income inputs work.
-   Deductions work.
-   Tax calculation works.
-   Old vs New comparison works.
-   Savings works.
-   Mobile layout works.
-   Footer works.
-   No browser console errors exist.

## Acceptance Criteria

-   Production static website is deployed successfully.
-   S3 deployment is verified.
-   CloudFront is verified if configured.
-   End-to-end production verification passes.

------------------------------------------------------------------------

# 13. Orchestrator Workflow

The Orchestrator must process the requirements in dependency order.

## Workflow

``` text
TAX-009
   ↓
TAX-010
   ↓
TAX-011
   ↓
TAX-012
   ↓
TAX-013
   ↓
TAX-014
   ↓
TAX-015
   ↓
TAX-016
```

## Agent Sequence

For each requirement:

``` text
Planner
   ↓
Human Approval
   ↓
Developer
   ↓
Tester
   ↓
Human Approval
   ↓
Reviewer
   ↓
Human Approval
   ↓
DONE
```

If tests fail:

``` text
Tester
   ↓
Developer
   ↓
Tester
```

If review fails:

``` text
Reviewer
   ↓
Developer
   ↓
Tester
   ↓
Reviewer
```

Do not mark a requirement `DONE` until its Definition of Done is
satisfied.

## Deployment Approval

TAX-016 requires explicit human approval before production deployment.

------------------------------------------------------------------------

# 14. Definition of Done

A requirement is `DONE` only when:

-   Requirement is implemented.
-   Relevant tests exist.
-   Tests pass.
-   No critical or high-severity defects remain.
-   Code follows project architecture.
-   Documentation is updated where necessary.
-   Reviewer approves the implementation.
-   Requirement status is updated in the working index.

For TAX-016, the deployed website must also pass production
verification.

------------------------------------------------------------------------

# 15. Non-Functional Requirements

## Performance

-   Fast initial load.
-   Minified production assets.
-   Avoid unnecessary dependencies.
-   Avoid unnecessary network requests.
-   Tax calculation must execute quickly in the browser.

## Security

-   No secrets in source code.
-   No AWS credentials in the repository.
-   No unnecessary external APIs.
-   Validate and sanitize user input.
-   Do not send personal financial data to a backend.

## Privacy

The application should perform calculations locally in the browser.

User financial inputs should not be transmitted to external servers
unless a future requirement explicitly introduces such functionality.

## Maintainability

Separate:

``` text
UI
↓
Application Logic
↓
Tax Calculation Engine
↓
Financial-Year Tax Rules
```

Do not put tax calculation logic directly into UI components.

------------------------------------------------------------------------

# 16. Future Extensibility

The architecture should make it easy to add:

-   New Financial Years
-   New tax rules
-   New deductions
-   New special tax rates
-   New income categories
-   PDF tax reports
-   Downloadable calculation summary
-   Saved calculations
-   Tax planning recommendations

These are future enhancements and should not be implemented unless
explicitly added to the backlog.

------------------------------------------------------------------------

# 17. Final Product Vision

The final website should feel like a modern financial product rather
than an internal developer tool.

The user journey should be:

``` text
Open Tax Calculator
       ↓
Select Financial Year
       ↓
Select Regime
       ↓
Enter Income
       ↓
Enter Applicable Deductions
       ↓
Calculate Tax
       ↓
View Old vs New
       ↓
See Savings
       ↓
Inspect Tax Breakdown
       ↓
Understand Recommended Regime
```

The primary goal is:

**Make Indian tax comparison simple, understandable, visually attractive
and maintainable while keeping the tax calculation rules accurate and
financial-year-specific.**
