# Indian Income Tax Calculator

A static web application to compare income tax liability between the old and new Indian tax regimes for a single financial year.

## Project Type

Static website (no backend, no database).

## Technologies

- HTML5 with semantic markup
- CSS3 with responsive design
- Modern JavaScript (ES modules)
- Vitest for testing
- ESLint for code quality

## Current Stage

Phase 1 Complete - Static website foundation established with core architecture, validation, formatting, and calculation engine.

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

Current coverage (80%+ target for business logic layers):
- **Formatters**: 100% ✓
- **Validators**: 100% ✓
- **Normalizers**: 86.85% ✓
- **App State**: 85.79% ✓
- **Coordinator**: 88.03% ✓
- **Tax Types**: 86-91% ✓
- **Tax Rules**: 76-92% ✓

**Total**: 131 tests passing, 57% overall coverage (UI layer untested in Node)

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

### Core Functionality (Phase 1)
- ✓ Static website with semantic HTML
- ✓ Responsive CSS layout
- ✓ Input validation and normalization
- ✓ Tax calculations for FY 2024-25
- ✓ Old vs New regime comparison
- ✓ Indian currency formatting
- ✓ Immutable state management
- ✓ Comprehensive test suite

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

- [FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md) - Detailed architecture and structure
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes

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