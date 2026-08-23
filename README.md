# Indian Income Tax Calculator

A static web application to compare income tax liability between the old and new Indian tax regimes.

## 🚀 Quick Start for New Developers / AI Sessions

**First time working on this project?** Read these documents:

1. **[docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)** - Complete development history
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
3. **[docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)** - What's built and pending
4. **[docs/plans/](docs/plans/)** - Implementation plans for each feature

### Getting Started in 60 Seconds

```bash
# Install dependencies
npm install

# Run tests (192 tests, all should pass)
npm test

# Start development server
npm run serve
# Open http://localhost:8080
```

---

## Project Status

**Version**: 0.1.0 (Foundation Complete)  
**Last Updated**: 2026-08-23

### ✅ Completed (TAX-001 to TAX-008)
- Static website foundation with three-layer architecture
- Application header with dynamic financial year display
- Financial year selection (2024-25)
- 5 income input types (salary, house property, business, capital gains, other)
- Input validation and normalization
- 192 passing tests

### 🔲 Pending
- Tax calculation logic (Old vs New regime)
- Results display UI
- AWS deployment

---

## Project Type

Static website (no backend, no database).

## Technologies

- HTML5 with semantic markup
- CSS3 with responsive design
- Modern JavaScript (ES modules)
- Vitest for testing
- ESLint for code quality

## Quick Start

### Prerequisites

- Node.js 18+ (for development)
- npm 9+

### Installation

```bash
# Clone repository and navigate to project
cd regime-calculator

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server on http://localhost:8080
npm run serve
```

Then open your browser to `http://localhost:8080`.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current test stats:
- **Total Tests**: 192 passing ✅
- **Test Files**: 5
- **Coverage Target**: 80%+ for business logic

Test breakdown:
- Validators: 35 tests
- Normalizers: 41 tests  
- Formatters: 30 tests
- Header Component: 61 tests
- Integration: 25 tests

## Code Quality

```bash
# Check code with ESLint
npm run lint

# Automatically fix linting issues
npm run lint:fix
```

## Project Structure

See [docs/FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md) for complete architecture documentation.

Key directories:
- `src/` - Application source code
- `tests/` - Test files
- `docs/` - Documentation
- `index.html` - Application entry point

## Features

### Implemented (Phase 1)
- ✅ Static website with semantic HTML
- ✅ Responsive CSS layout
- ✅ Application header with dynamic FY display
- ✅ Financial year selection dropdown
- ✅ 5 income input fields:
  - Salary Income (non-negative)
  - House Property Income (can be negative for loss)
  - Business/Professional Income (non-negative)
  - Capital Gains (non-negative, kept separate)
  - Other Income (non-negative)
- ✅ Input validation and normalization
- ✅ Indian currency formatting
- ✅ Immutable state management
- ✅ Comprehensive test suite (192 tests)

### Pending (Phase 2)
- 🔲 Old regime tax calculation
- 🔲 New regime tax calculation
- 🔲 Side-by-side comparison UI
- 🔲 Tax savings recommendations
- 🔲 Deductions support (80C, 80D, etc.)

### Architecture Highlights
- **Separation of Concerns**: UI, App, Domain, and Shared layers
- **Pure Functions**: All calculations are side-effect free
- **Immutable State**: State updates create new objects
- **Tax Rules as Data**: Easy to add new financial years
- **Test-Friendly**: Business logic runs in Node without DOM

## How to Use

1. Open the application in your browser (http://localhost:8080)
2. Enter your salary income and other income (if applicable)
3. Select the financial year (2024-25 supported)
4. Click "Calculate" to see the tax comparison
5. View results showing:
   - Old regime tax calculation
   - New regime tax calculation
   - Which regime is beneficial
   - Tax savings potential

## Financial Years Supported

- FY 2024-25 (Current)

Future years can be added by creating new rule files in `src/domain/rules/financial-years/`.

## Assumptions & Limitations

### Assumptions
- User is an individual resident of India
- No specific deductions claimed (uses standard deduction)
- All income is from salary and other sources
- Calculations are for informational purposes only

### Known Limitations
- No support for specific deductions (80C, 80D, etc.)
- No support for special taxpayer categories (Senior Citizens, NRI)
- No export functionality (copy results manually)
- Web-only (no mobile app)

## Documentation

### For New Developers / AI Sessions
- **[PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)** - Complete development history and context
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[REQUIREMENTS.md](docs/REQUIREMENTS.md)** - Working requirement index

### Technical Documentation
- [FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md) - Detailed architecture
- [DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) - AI agent workflow
- [PRD.md](docs/PRD.md) - Product requirements
- [CHANGELOG.md](CHANGELOG.md) - Version history

### Implementation Plans
- [PLAN-TAX-001](docs/plans/PLAN-TAX-001-static-website-foundation.md) - Foundation
- [PLAN-TAX-002](docs/plans/PLAN-TAX-002-application-header.md) - Header
- [PLAN-TAX-003](docs/plans/PLAN-TAX-003-financial-year-selection.md) - FY Selection
- [PLAN-TAX-004](docs/plans/PLAN-TAX-004-salary-income-input.md) - Salary Input
- [PLAN-TAX-005](docs/plans/PLAN-TAX-005-house-property-income.md) - House Property
- [PLAN-TAX-006](docs/plans/PLAN-TAX-006-business-income.md) - Business Income
- [PLAN-TAX-007](docs/plans/PLAN-TAX-007-capital-gains.md) - Capital Gains
- [PLAN-TAX-008](docs/plans/PLAN-TAX-008-other-income.md) - Other Income

### Architectural Decisions
- [ADR-001](docs/decisions/ADR-001-use-plain-javascript.md) - Use Plain JavaScript

## AI Development Framework

This project uses an AI-native development approach with specialized agents:

| Agent | Purpose |
|-------|---------|
| **Orchestrator** | Coordinates overall workflow |
| **Planner** | Creates implementation plans |
| **Developer** | Implements features |
| **Tester** | Validates with tests |
| **Builder** | Creates production builds |
| **Deployer** | Handles AWS deployment |

Agent definitions: `.github/agents/`  
Skills: `.github/skills/`

## Development Notes

### Adding a New Financial Year

1. Create rule file: `src/domain/rules/financial-years/fy-YYYY-YY.js`
2. Define tax rules (slabs, surcharge, cess) as data
3. Export `oldRegimeRules` and `newRegimeRules`
4. Update `src/domain/rules/financial-years/index.js`
5. Add year to `SUPPORTED_YEARS` constant
6. Write tests

See [docs/FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md) for detailed guidance.

### Code Standards

- **ES Modules**: All files use `import`/`export`
- **JSDoc**: All functions documented with parameters and return types
- **Pure Functions**: No side effects in business logic
- **Error Handling**: Explicit validation with error messages
- **Testing**: Minimum 80% coverage for business logic

## Security & Privacy

- **No Backend**: All calculations happen in your browser
- **No Data Collection**: No tracking, analytics, or data transmission
- **No External Dependencies**: All tax rules are hardcoded (not fetched)
- **Open Source**: All code is visible and auditable

## Troubleshooting

### Tests failing after changes
```bash
npm run lint:fix  # Fix any linting issues first
npm test          # Run tests to identify problems
```

### CSS not loading
- Ensure all CSS files are in `src/ui/styles/`
- Check that `main.css` imports them in the correct order
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)

### Form not responding
- Open browser console (F12) and check for errors
- Ensure `src/app/main.js` has initialized (no errors on page load)
- Check that event listeners are attached with `npm run serve`

## Support

For issues or suggestions:
1. Check the documentation in `docs/`
2. Review test files for usage examples
3. Check browser console for error messages

## License

[Project license information to be added]

## Version

0.1.0 - Foundation Phase Complete