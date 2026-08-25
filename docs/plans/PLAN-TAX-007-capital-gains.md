# PLAN-TAX-007: Create Capital Gains Input

## Requirement

TAX-007 - Create Capital Gains Input

## Objective

Create an input field for capital gains that is architecturally separated from ordinary income to allow for future special tax treatment.

## Context

Capital gains in India have special tax treatment:
- **Short-term capital gains (STCG)**: Assets held < specified period
  - Listed equity: 15% flat rate
  - Other assets: Added to income, taxed at slab rates
- **Long-term capital gains (LTCG)**: Assets held ≥ specified period
  - Listed equity: 10% above ₹1 lakh
  - Other assets: 20% with indexation

For MVP, we collect total capital gains. Future versions may split STCG/LTCG.

## Architectural Decision

Capital gains is kept **separate from ordinary income** in calculations:

```javascript
// Ordinary income excludes capital gains
export function calculateOrdinaryIncome(income) {
  return income.salary + 
         income.houseProperty + 
         income.business + 
         income.otherIncome;
  // Note: capitalGains NOT included
}

// Separate accessor for capital gains
export function getCapitalGains(income) {
  return income.capitalGains;
}
```

This separation allows future implementation of:
- Different tax rates for capital gains
- Exemption limits (₹1 lakh for LTCG)
- Separate STCG and LTCG handling

## Files Created/Modified

### Modified
- `index.html` - Added capital gains input
- `src/domain/tax/types/income.js` - Added capitalGains with special handling
- `src/app/state/appState.js` - Added capitalGains to state
- `src/app/validation/validators.js` - Added capital gains validation
- `src/app/input-normalization/normalizers.js` - Added capital gains normalization

## Implementation Details

### Input HTML Structure
```html
<div class="form-group">
  <label for="capital-gains">Capital Gains (₹):</label>
  <input 
    type="number" 
    id="capital-gains" 
    name="capital-gains" 
    placeholder="0"
    min="0"
    step="1"
    aria-describedby="capital-gains-help"
  >
  <small id="capital-gains-help" class="form-help">
    Total capital gains (taxed separately if applicable)
  </small>
</div>
```

### Income Type Functions
```javascript
// Get gross income (includes capital gains)
export function calculateGrossIncome(income) {
  return calculateOrdinaryIncome(income) + income.capitalGains;
}

// Get ordinary income (excludes capital gains)
export function calculateOrdinaryIncome(income) {
  return income.salary + income.houseProperty + 
         income.business + income.otherIncome;
}

// Get capital gains separately
export function getCapitalGains(income) {
  return income.capitalGains;
}
```

## Tasks Completed

1. ✅ Add capital gains input to HTML
2. ✅ Add help text noting separate taxation
3. ✅ Implement validation (non-negative)
4. ✅ Add capitalGains to income type
5. ✅ Create calculateOrdinaryIncome (excludes capital gains)
6. ✅ Create getCapitalGains accessor
7. ✅ Connect to application state

## Future Enhancements

- [ ] Split into STCG and LTCG fields
- [ ] Implement special tax rates
- [ ] Add exemption limit handling (₹1 lakh LTCG)
- [ ] Support asset type selection

## Status

**COMPLETED**

## Implemented By

Developer Agent

## Date

2026-08-23

## Related

- Requirement: [TAX-007](/docs/REQUIREMENTS.md)
- Depends on: TAX-001, TAX-003
