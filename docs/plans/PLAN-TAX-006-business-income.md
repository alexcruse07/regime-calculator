# PLAN-TAX-006: Create Business/Professional Income Input

## Requirement

TAX-006 - Create Business/Professional Income Input

## Objective

Create an input field for income from business or profession. This covers self-employed individuals, freelancers, and business owners.

## Context

Business/Professional income in India includes:
- Income from sole proprietorship
- Professional fees (doctors, lawyers, consultants, etc.)
- Freelance income
- Partnership firm income (share of profit)

For simplicity, users enter their net business income (after deducting business expenses).

## Files Created/Modified

### Modified
- `index.html` - Added business income input
- `src/domain/tax/types/income.js` - Added business to income type
- `src/app/state/appState.js` - Added business to state
- `src/app/validation/validators.js` - Added business validation
- `src/app/input-normalization/normalizers.js` - Added business normalization

## Implementation Details

### Input HTML Structure
```html
<div class="form-group">
  <label for="business-income">Business/Professional Income (₹):</label>
  <input 
    type="number" 
    id="business-income" 
    name="business-income" 
    placeholder="0"
    min="0"
    step="1"
    aria-describedby="business-help"
  >
  <small id="business-help" class="form-help">Income from business or profession</small>
</div>
```

### Validation Rules
- Must be numeric
- Must be non-negative (≥ 0)
- Empty value treated as 0
- Supports currency formatting removal

### Field Name Mapping
- HTML: `business-income`
- State: `business`
- Form handler converts between these

## Tasks Completed

1. ✅ Add business income input to HTML
2. ✅ Add aria-describedby for accessibility
3. ✅ Add help text
4. ✅ Implement validation (non-negative)
5. ✅ Implement normalization
6. ✅ Add business to income type
7. ✅ Connect to application state
8. ✅ Handle name mapping in form handler

## Status

**COMPLETED**

## Implemented By

Developer Agent

## Date

2026-08-23

## Related

- Requirement: [TAX-006](/docs/REQUIREMENTS.md)
- Depends on: TAX-001, TAX-003
