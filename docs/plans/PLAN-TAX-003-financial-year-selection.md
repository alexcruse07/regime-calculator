# PLAN-TAX-003: Create Financial Year Selection

## Requirement

TAX-003 - Create Financial Year Selection

## Objective

Create a dropdown selector allowing users to choose the financial year for tax calculation. Tax rules vary by year, so this selection determines which tax slabs and deductions apply.

## Context

Indian tax rules change frequently. The financial year selection:
- Determines which tax regime rules to apply
- Updates the header context display
- Triggers recalculation when changed
- Currently supports FY 2024-25 (expandable to future years)

## Files Created/Modified

### Created
- `src/shared/constants/financial-years.js` - Financial year constants and validation
- `src/domain/rules/financial-years/index.js` - Year rule registry
- `src/domain/rules/financial-years/fy-2024-25.js` - FY 2024-25 specific rules

### Modified
- `index.html` - Added financial year dropdown
- `src/app/state/appState.js` - Added financialYear to state
- `src/ui/components/form-handler.js` - Handle year selection changes
- `src/app/validation/validators.js` - Added validateFinancialYear function

## Implementation Details

### Dropdown HTML Structure
```html
<div class="form-group">
  <label for="financial-year">Financial Year:</label>
  <select id="financial-year" name="financial-year" required>
    <option value="">Select a financial year</option>
    <option value="2024-25">2024-25 (FY 2024-2025)</option>
  </select>
</div>
```

### Financial Year Constants
```javascript
export const SUPPORTED_YEARS = ['2024-25'];
export const DEFAULT_FINANCIAL_YEAR = '2024-25';
export const FINANCIAL_YEAR_PATTERN = /^\d{4}-\d{2}$/;

export function isSupportedYear(year) {
  return SUPPORTED_YEARS.includes(year);
}
```

### Year Rule Registry
```javascript
// Get tax rules for a specific year
export function getRulesForYear(year) {
  const rules = yearRules[year];
  if (!rules) {
    throw new Error(`No rules found for financial year: ${year}`);
  }
  return rules;
}
```

## Tasks Completed

1. ✅ Create financial year constants module
2. ✅ Create year validation function
3. ✅ Create dropdown HTML element
4. ✅ Add year to application state
5. ✅ Handle year change events
6. ✅ Update header when year changes
7. ✅ Create year rule registry architecture
8. ✅ Implement FY 2024-25 rules placeholder
9. ✅ Add validation for year format

## Extensibility

To add a new financial year:
1. Add year to `SUPPORTED_YEARS` array
2. Create `fy-YYYY-YY.js` rule file
3. Register in `financial-years/index.js`
4. Add option to dropdown in `index.html`

## Status

**COMPLETED**

## Implemented By

Developer Agent

## Date

2026-08-23

## Related

- Requirement: [TAX-003](/docs/REQUIREMENTS.md)
- Depends on: TAX-001, TAX-002
