# PLAN-TAX-005: Create House Property Income Input

## Requirement

TAX-005 - Create House Property Income Input

## Objective

Create an input field for house property income that uniquely supports negative values (losses).

## Context

House property income in India can be:
- **Positive**: Rental income from property
- **Negative**: Loss from house property (interest on home loan exceeds rental income)

This is the **only income type that can be negative** because:
- Section 24(b) allows deduction of home loan interest
- Interest deduction can exceed rental income, creating a loss
- Loss can be set off against other income (with limits)

## Files Created/Modified

### Modified
- `index.html` - Added house property input (allows negative)
- `src/domain/tax/types/income.js` - Added houseProperty to income type
- `src/app/state/appState.js` - Added houseProperty to state
- `src/app/validation/validators.js` - Added validation with `allowNegative: true`
- `src/app/input-normalization/normalizers.js` - Added normalization with `allowNegative: true`

## Implementation Details

### Input HTML Structure
```html
<div class="form-group">
  <label for="house-property">House Property Income (₹):</label>
  <input 
    type="number" 
    id="house-property" 
    name="house-property" 
    placeholder="0"
    step="1"
    aria-describedby="house-property-help"
  >
  <small id="house-property-help" class="form-help">
    Net income from house property (can be negative for loss)
  </small>
</div>
```

Note: No `min="0"` attribute because negative values are allowed.

### Validation Rules
- Must be numeric
- **Can be negative** (loss scenario)
- Empty value treated as 0
- Supports currency formatting removal

### Special Handling
```javascript
// Validation allows negative
validateNumericIncome(input.houseProperty, 'House property income', { 
  allowNegative: true, 
  allowEmpty: true 
});

// Normalization preserves negative
normalizeNumericInput(value, { allowNegative: true });
```

### Income Type Integration
```javascript
export function createIncome({
  houseProperty = 0,  // Can be negative
  // ...
} = {}) {
  return Object.freeze({
    // houseProperty is the ONLY field that can be negative
    houseProperty: Number(houseProperty) || 0,
    // ...
  });
}
```

## Tasks Completed

1. ✅ Add house property input to HTML (no min attribute)
2. ✅ Add help text explaining negative values
3. ✅ Implement validation allowing negative
4. ✅ Implement normalization preserving negative
5. ✅ Add houseProperty to income type (no Math.max)
6. ✅ Connect to application state

## Key Difference from Other Income Types

| Aspect | House Property | Other Income Types |
|--------|---------------|-------------------|
| Negative allowed | ✅ Yes | ❌ No |
| HTML min attribute | None | min="0" |
| Validation option | allowNegative: true | allowNegative: false |
| Math.max(0, value) | Not applied | Applied |

## Status

**COMPLETED**

## Implemented By

Developer Agent

## Date

2026-08-23

## Related

- Requirement: [TAX-005](/docs/REQUIREMENTS.md)
- Depends on: TAX-001, TAX-003
