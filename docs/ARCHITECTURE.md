# Technical Architecture Document

## 1. Architecture Overview

The Indian Income Tax Calculator is a static, client-side web application. All user interaction, validation, normalization, tax calculation, and result comparison happen in the browser. No backend or database is required for the initial version.

The architecture is intentionally simple and separates presentation from tax logic so that calculations remain testable and tax rules can vary by financial year without affecting the UI.

## 2. Architectural Principles

- Keep the application static and client-side only.
- Keep UI concerns separate from calculation concerns.
- Keep tax rules separate from tax calculation algorithms.
- Represent old and new regimes independently.
- Version rules by financial year.
- Avoid unnecessary dependencies and framework complexity.
- Make calculation functions easy to test independently.

## 3. Logical Layers

### 3.1 Presentation / UI

Responsible for:

- Rendering forms, controls, and comparison output
- Collecting user inputs
- Showing validation errors and calculation summaries
- Updating the screen from computed results only

UI code must not contain tax formulas, slab logic, or rule decisions.

### 3.2 Application Logic

Responsible for:

- Reading raw user input
- Validating required fields
- Normalizing values into a consistent shape
- Selecting the relevant financial year rules
- Coordinating old-regime and new-regime calculations
- Preparing results for display

### 3.3 Tax Domain / Calculation Logic

Responsible for:

- Calculating gross income
- Applying deductions and exemptions according to the selected regime
- Computing taxable income
- Calculating income tax, rebate, surcharge, cess, and total tax payable
- Producing comparison-ready outputs

This layer must not access the DOM or UI state directly.

### 3.4 Financial-Year-Specific Tax Rules

Responsible for:

- Storing rule sets by financial year
- Defining regime-specific applicability for deductions, slabs, rebates, and surcharge behavior
- Allowing new financial years to be added without changing calculation code

Rules must be versioned independently for each financial year.

## 4. Conceptual Flow

User Input  
→ Validation  
→ Normalize Input  
→ Select Financial Year  
→ Calculate Old Regime  
→ Calculate New Regime  
→ Compare Results  
→ Display Results

## 5. Recommended Project Structure

```text
src/
  app/
    state/
    validation/
    input-normalization/
    tax-orchestration/
  domain/
    tax/
      calculations/
      comparison/
      types/
    rules/
      financial-years/
        fy-2024-25/
        fy-2025-26/
  ui/
    components/
    views/
    styles/
  shared/
    formatting/
    constants/
    utils/
tests/
docs/
```

### Structure Notes

- `ui/` contains presentation components and view logic.
- `app/` contains orchestration, validation, and input shaping.
- `domain/tax/` contains tax computation and comparison logic.
- `domain/rules/` contains financial-year-specific rule definitions.
- `shared/` contains reusable utilities and formatting helpers.
- `tests/` contains unit tests for calculation and rule behavior.

## 6. Rule and Calculation Separation

The application should treat tax rules as data and tax calculations as behavior.

- Rule definitions should describe what applies for a financial year.
- Calculation functions should consume those rules and produce outputs.
- Old regime and new regime should each have their own rule set.

This separation ensures that rule changes do not require rewriting the calculation flow.

## 7. Testing Strategy

The architecture should allow independent testing of:

- Input validation
- Input normalization
- Financial-year rule selection
- Old regime calculation
- New regime calculation
- Comparison logic

Tests should be able to run without the browser UI.

## 8. Future Deployment Architecture

The intended deployment path for the static site is:

User  
→ CloudFront  
→ S3

### Deployment Notes

- S3 stores the compiled static website assets.
- CloudFront serves the assets to users with low latency.
- No backend services are required in the initial deployment model.

## 9. Non-Goals

The initial architecture does not include:

- Microservices
- Kubernetes
- Server-side APIs
- Databases
- Authentication
- Background jobs

## 10. Summary

This architecture keeps the application simple, testable, and appropriate for a learning project while preserving clear separation between UI, application flow, calculation logic, and financial-year-specific tax rules.