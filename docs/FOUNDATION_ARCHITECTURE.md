# Foundation Architecture Documentation

## Overview

This document describes the foundation architecture of the Indian Income Tax Calculator built during Phase 1 (TAX-001).

## Architecture Principles

The application follows these core principles:

1. **Separation of Concerns**: UI, Application Logic, Tax Domain, and Rules are strictly separated
2. **Immutable State**: Application state is immutable and managed through pure functions
3. **Pure Functions**: Tax calculations, validators, and formatters have no side effects
4. **Rules as Data**: Tax rules are defined as data structures, not embedded in algorithms
5. **Static-Only**: No backend, no database - completely client-side computation

## Project Structure

```
src/
├── app/                          # Application logic layer
│   ├── state/
│   │   └── appState.js          # Immutable state management
│   ├── validation/
│   │   └── validators.js        # Input validation functions
│   ├── input-normalization/
│   │   └── normalizers.js       # Input cleaning and normalization
│   ├── tax-orchestration/
│   │   └── coordinator.js       # Workflow orchestration
│   └── main.js                  # Application entry point
│
├── domain/                       # Business domain logic
│   ├── tax/
│   │   ├── types/
│   │   │   ├── income.js        # Income type definition
│   │   │   └── calculation-result.js  # Result type definition
│   │   └── calculations/
│   │       └── calculation-engine.js  # Tax calculation algorithms
│   └── rules/
│       └── financial-years/
│           ├── fy-2024-25.js    # FY 2024-25 tax rules
│           └── index.js         # Rules index and exports
│
├── ui/                          # User interface layer
│   ├── components/
│   │   └── form-handler.js      # Form event handling
│   ├── views/
│   │   └── appView.js           # DOM updates from state
│   └── styles/
│       ├── base.css             # Base styles
│       ├── layout.css           # Layout utilities
│       ├── utilities.css        # Utility classes
│       ├── components.css       # Component styles
│       └── main.css             # Main entry point
│
└── shared/                      # Reusable utilities
    ├── constants/
    │   └── financial-years.js   # Financial year constants
    ├── formatting/
    │   └── formatters.js        # Currency and number formatting
    └── utils/
        └── helpers.js           # General utility functions

tests/
├── setup/
│   └── test-helpers.js          # Testing utilities
├── fixtures/
│   └── sample-incomes.js        # Test data
├── unit/
│   ├── shared/
│   │   ├── formatting/
│   │   │   └── formatters.test.js
│   │   ├── constants/
│   │   └── utils/
│   └── app/
│       ├── validation/
│       │   └── validators.test.js
│       └── input-normalization/
│           └── normalizers.test.js
└── integration/
    └── app/
        └── app-flow.test.js

index.html                       # Application entry point HTML
package.json                     # Dependencies and scripts
vitest.config.js                 # Test configuration
.eslintrc.js                     # Linting configuration
```

## Layer Responsibilities

### 1. UI Layer (`src/ui/`)

**Responsibility**: Present data to user and collect input

- `form-handler.js`: Manages form events, collects user input
- `appView.js`: Updates DOM based on application state
- CSS files: Style and layout

**Key Principle**: UI components never contain tax logic or perform calculations directly.

### 2. Application Layer (`src/app/`)

**Responsibility**: Orchestrate workflow and manage state

- `appState.js`: Immutable state container with observers
- `validators.js`: Validate user input before processing
- `normalizers.js`: Clean and normalize input data
- `coordinator.js`: Orchestrate the full calculation workflow
- `main.js`: Initialize application

**Key Principle**: Application layer is pure DOM-free business logic.

### 3. Domain Layer (`src/domain/`)

**Responsibility**: Tax calculation and comparison logic

- `tax/types/`: Define data structures (Income, CalculationResult)
- `tax/calculations/`: Implement calculation algorithms
- `rules/financial-years/`: Store tax rules by financial year

**Key Principle**: Calculations consume rules as data and produce results. No DOM access.

### 4. Shared Layer (`src/shared/`)

**Responsibility**: Reusable utilities and constants

- `constants/`: Financial year definitions
- `formatting/`: Currency and number formatting with Indian locale
- `utils/`: Helper functions (type checking, safe access, etc.)

**Key Principle**: No dependencies on other layers. Purely functional.

## Data Flow

```
User Input
    ↓
HTML Form Capture (UI)
    ↓
Validation (App)
    ↓
Normalization (App)
    ↓
State Update (App)
    ↓
Tax Calculation (Domain)
    ↓
State Update with Results (App)
    ↓
View Update (UI)
    ↓
Display Results
```

## State Management

Application state is centralized in `appState.js`:

```javascript
{
  income: { salary, otherIncome },
  financialYear: '2024-25',
  validationErrors: [],
  calculations: { oldRegime, newRegime, comparison },
  isCalculating: false,
  lastCalculatedAt: ISO8601String
}
```

**Key Features**:
- Immutable (getState returns frozen copy)
- Observable (subscribe to changes)
- Pure functions (setters create new state, don't mutate)

## Type Definitions

### Income
```javascript
{
  salary: number,        // >= 0
  otherIncome: number    // >= 0
}
```

### CalculationResult
```javascript
{
  grossIncome: number,
  taxableIncome: number,
  incomeTax: number,
  surcharge: number,
  cess: number,
  totalTax: number,
  regime: 'old' | 'new',
  financialYear: string
}
```

### ComparisonResult
```javascript
{
  oldRegime: CalculationResult,
  newRegime: CalculationResult,
  taxDifference: number,
  beneficialRegime: 'old' | 'new' | 'same',
  savingsPercentage: number
}
```

## Validation Pipeline

1. **Input Validation** (`validateFormSubmission`)
   - Check required fields
   - Validate numeric inputs
   - Validate financial year
   - Check business rules (at least one income > 0)

2. **Input Normalization** (`cleanInputForCalculation`)
   - Parse currency formats
   - Handle multiple year format variations
   - Ensure non-negative values

3. **Business Logic Validation** (in calculations)
   - Verify income objects
   - Verify tax rules exist

## Calculation Flow

1. Get rules for selected financial year
2. Create Income object from normalized input
3. For each regime (Old, New):
   - Calculate gross income
   - Apply standard deduction (if applicable)
   - Calculate taxable income
   - Apply tax slabs to get income tax
   - Calculate surcharge (based on gross income)
   - Calculate cess (4% of tax + surcharge)
4. Compare results and determine beneficial regime

## Testing Strategy

### Unit Tests (80%+ coverage target)

- **formatters.test.js**: Currency formatting with Indian locale
- **validators.test.js**: Input validation logic
- **normalizers.test.js**: Input normalization
- **app-flow.test.js**: Full calculation workflow

### Test Coverage Achieved

- `src/shared/formatting/formatters.js`: 100%
- `src/app/validation/validators.js`: 100%
- `src/app/input-normalization/normalizers.js`: 86.85%
- `src/app/state/appState.js`: 85.79%
- `src/app/tax-orchestration/coordinator.js`: 88.03%
- `src/domain/tax/types/`: 86-91%
- `src/domain/rules/financial-years/`: 76-92%

### Test Scenarios

1. **Zero Income**: Validation fails (at least one income required)
2. **Small Income**: Below tax-free threshold
3. **Boundary Values**: At and around tax slab boundaries
4. **High Income**: With surcharge and cess
5. **Mixed Income**: Salary + other income
6. **Format Variations**: Different input formats (₹, commas, etc.)
7. **Error Cases**: Invalid input, unsupported years

## Financial Year Rules

Each financial year has rules defined as data:

```javascript
{
  financialYear: '2024-25',
  regime: 'old' | 'new',
  standardDeduction: number,
  taxSlabs: [{ min, max, rate }, ...],
  surcharge: [{ min, max, rate }, ...],
  cess: { rate },
  rebates: [{ condition, rebateAmount, description }, ...],
  notes: [...]
}
```

New years can be added by:
1. Creating `fy-YYYY-YY.js` with rules
2. Adding to `rulesMap` in `index.js`
3. Adding year to `SUPPORTED_YEARS` in `financial-years.js`

## Error Handling

Errors are collected during validation and passed to the user:

1. **Validation Errors**: Fields that fail validation
2. **Business Logic Errors**: At least one income required
3. **Calculation Errors**: Missing rules, invalid data

All errors are stored in `state.validationErrors` for UI display.

## Performance Considerations

- No caching (calculations are fast)
- No API calls (all client-side)
- Immutable state creates copies (acceptable for small state)
- No virtual DOM (plain DOM updates)

## Security Considerations

- No external dependencies for tax rules
- No server communication (no data privacy concerns)
- Input sanitization through normalization
- No eval or dynamic code execution

## Assumptions

1. User is in India (uses Indian currency and tax system)
2. Applicable laws are the Indian Income Tax Act
3. User is an individual (not corporate/HUF)
4. User is resident of India
5. No specific deductions are claimed (uses default calculations)
6. Calculations are for informational purposes only

## Future Enhancements

1. Add support for deductions (80C, 80D, etc.)
2. Add support for different taxpayer categories (Senior Citizens, NRI)
3. Add historical year comparisons
4. Export results to PDF
5. Dark mode / accessibility improvements
6. Multi-language support

## Development Workflow

### Running Locally
```bash
npm install
npm run dev          # Start local server on port 8080
npm test            # Run tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
npm run lint        # Check code
npm run lint:fix    # Fix linting issues
```

### Adding a New Financial Year

1. Create `src/domain/rules/financial-years/fy-YYYY-YY.js`
2. Define `oldRegimeRules` and `newRegimeRules` objects
3. Export them with same structure as `fy-2024-25.js`
4. Add to `rulesMap` in `src/domain/rules/financial-years/index.js`
5. Add year string to `SUPPORTED_YEARS` in `src/shared/constants/financial-years.js`
6. Write tests in `tests/integration/app/app-flow.test.js`

### Adding a New Feature

1. Identify which layer(s) it belongs to
2. Write tests first (TDD)
3. Implement in the appropriate layer
4. Integrate with coordinator if needed
5. Update UI/views if necessary
6. Update this documentation

## Code Quality Standards

- All functions have JSDoc comments
- Maximum function length: ~50 lines
- No side effects in pure functions
- Meaningful variable names
- No unused variables
- Consistent formatting with ESLint
- Comprehensive test coverage

## Resources

- `copilot-instructions.md`: AI development guidelines
- `ARCHITECTURE.md`: High-level architecture overview
- `REQUIREMENTS.md`: Product requirements
- `PRD.md`: Product requirements document
