# Implementation Plan: TAX-010 — Complete Income & Deduction Form

## 1. Requirement Understanding

### Scope

TAX-010 expands the tax calculator form to support:
1. **Detailed Capital Gains** — Replace generic Capital Gains with STCG (equity/other) and LTCG (equity/other)
2. **Speculative Gains** — Add speculative business gains section
3. **F&O Gains/Losses** — Add Futures & Options income/loss section
4. **Expanded Other Income** — Break into Interest Income, Dividend Income, Other Taxable Income
5. **Comprehensive Deductions** — Add Standard Deduction, 80C, 80CCD(1B), 80D, 80E, 80G, 80TTA, 80TTB, HRA, and more
6. **Regime-Aware Visibility** — Deductions show/hide based on regime selection

### Constraints from Repository Instructions

- Tax rules must be versioned by financial year
- UI must not contain tax calculation logic
- Domain model must preserve categories separately (no aggregation at input time)
- All monetary values use INR formatting
- Follow three-layer architecture: `domain/`, `app/`, `ui/`
- Keep state management immutable
- Hidden/disabled fields must not contribute to calculations
- Deductions limited by statutory caps per section

### Product Requirements (from PRD)

- Allow users to enter income and deduction details in a structured way
- Clearly indicate that eligibility depends on the selected financial year and tax regime
- Deductions include: Standard deduction, 80C, 80D, 80CCD(1B), 80E, 80G, Home loan interest, HRA, LTA

---

## 2. Current Implementation Analysis

### Existing Income Structure (`src/domain/tax/types/income.js`)
```javascript
{
  salary: number,        // TAX-004
  houseProperty: number, // TAX-005 (can be negative)
  business: number,      // TAX-006
  capitalGains: number,  // TAX-007 (generic)
  otherIncome: number,   // TAX-008 (generic)
}
```

**Gap**: Capital gains and other income are single fields, not granular categories.

### Existing State Structure (`src/app/state/appState.js`)
```javascript
{
  income: { ... },
  financialYear: '2024-25',
  selectedRegime: 'compare',
  validationErrors: [],
  calculations: null,
}
```

**Gap**: No `deductions` object exists in state.

### Existing Field Applicability (`src/domain/rules/field-applicability.js`)
```javascript
{
  salary: { old: true, new: true },
  houseProperty: { old: true, new: true },
  business: { old: true, new: true },
  capitalGains: { old: true, new: true },
  otherIncome: { old: true, new: true },
  // Commented out deductions placeholders
}
```

**Gap**: Deduction fields not defined; capital gains not granular.

### Existing HTML Form (`index.html`)
- Single `#capital-gains` input
- Single `#other-income` input
- No deduction section
- No collapsible sections

**Gap**: Needs expansion for granular income and deductions.

---

## 3. Proposed Design

### 3.1 Domain Model Expansion

#### Capital Gains Model
```javascript
capitalGains: {
  stcgEquity: number,    // STCG on listed equity (15%)
  stcgOther: number,     // STCG on other assets (slab rates)
  ltcgEquity: number,    // LTCG on listed equity (10% > ₹1L)
  ltcgOther: number,     // LTCG on other assets (20% with indexation)
}
```

#### Speculative & F&O Income Model
```javascript
speculativeIncome: {
  gains: number,         // Speculative business gains
  losses: number,        // Speculative business losses (carry-forward)
},
fnoIncome: {
  gains: number,         // F&O gains
  losses: number,        // F&O losses
}
```

#### Expanded Other Income Model
```javascript
otherIncome: {
  interestIncome: number,   // Savings, FD, RD interest
  dividendIncome: number,   // Dividend income (taxable from 2020)
  otherTaxable: number,     // Any other taxable income
}
```

#### Deductions Model
```javascript
deductions: {
  standardDeduction: number,  // Auto-applied for salaried (₹75,000 new, ₹50,000 old)
  section80C: number,         // PPF, ELSS, LIC, etc. (max ₹1.5L)
  section80CCD1B: number,     // NPS additional (max ₹50,000)
  section80D: number,         // Medical insurance (max ₹25,000/₹50,000)
  section80E: number,         // Education loan interest (no limit)
  section80G: number,         // Donations (50%/100% of eligible)
  section80TTA: number,       // Savings interest <60y (max ₹10,000)
  section80TTB: number,       // Interest for seniors (max ₹50,000)
  hra: number,                // House Rent Allowance
  lta: number,                // Leave Travel Allowance
  homeLoanInterest: number,   // Section 24b (max ₹2L self-occupied)
  otherDeductions: number,    // Any other Chapter VI-A deductions
}
```

### 3.2 Regime-Specific Deduction Applicability (FY 2024-25)

| Deduction | Old Regime | New Regime | Notes |
|-----------|------------|------------|-------|
| Standard Deduction | ✓ (₹50,000) | ✓ (₹75,000) | Different limits |
| Section 80C | ✓ | ✗ | Not allowed in new |
| Section 80CCD(1B) | ✓ | ✗ | Not allowed in new |
| Section 80D | ✓ | ✗ | Not allowed in new |
| Section 80E | ✓ | ✗ | Not allowed in new |
| Section 80G | ✓ | ✗ | Not allowed in new |
| Section 80TTA | ✓ | ✗ | Not allowed in new |
| Section 80TTB | ✓ | ✗ | Not allowed in new |
| HRA | ✓ | ✗ | Not allowed in new |
| LTA | ✓ | ✗ | Not allowed in new |
| Home Loan Interest | ✓ | ✗ | Not allowed in new |

### 3.3 UI Design — Collapsible Sections

```
┌─────────────────────────────────────────────────────────┐
│ [▼] Income Details                                       │
│   ├── Salary Income (existing)                          │
│   ├── House Property Income (existing)                  │
│   └── Business/Professional Income (existing)           │
├─────────────────────────────────────────────────────────┤
│ [▼] Capital Gains                                        │
│   ├── Short-Term Capital Gains (Listed Equity)          │
│   ├── Short-Term Capital Gains (Other Assets)           │
│   ├── Long-Term Capital Gains (Listed Equity)           │
│   └── Long-Term Capital Gains (Other Assets)            │
├─────────────────────────────────────────────────────────┤
│ [▼] Trading Income                                       │
│   ├── Speculative Gains                                 │
│   ├── Speculative Losses                                │
│   ├── F&O Gains                                         │
│   └── F&O Losses                                        │
├─────────────────────────────────────────────────────────┤
│ [▼] Other Income                                         │
│   ├── Interest Income                                   │
│   ├── Dividend Income                                   │
│   └── Other Taxable Income                              │
├─────────────────────────────────────────────────────────┤
│ [▼] Deductions (Old Regime Only - some fields hidden)    │
│   ├── Standard Deduction (read-only, auto-calculated)   │
│   ├── Section 80C                                       │
│   ├── Section 80CCD(1B)                                 │
│   ├── Section 80D                                       │
│   ├── Section 80E                                       │
│   ├── Section 80G                                       │
│   ├── Section 80TTA / 80TTB                             │
│   ├── HRA Exemption                                     │
│   ├── LTA Exemption                                     │
│   ├── Home Loan Interest                                │
│   └── Other Deductions                                  │
└─────────────────────────────────────────────────────────┘
```

### 3.4 State Management Flow

```
User Input → Validation → Normalize → Update appState
                                           │
                               ┌───────────┴───────────┐
                               │ income: { ... }       │
                               │ deductions: { ... }   │
                               │ selectedRegime        │
                               │ financialYear         │
                               └───────────┬───────────┘
                                           │
                    Regime Change ─────────┤
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │ form-visibility-controller.js               │
                    │ - Reads field-applicability rules           │
                    │ - Shows/hides deduction fields              │
                    │ - Stores/restores hidden values             │
                    └─────────────────────────────────────────────┘
```

---

## 4. Files To Create

| File Path | Purpose |
|-----------|---------|
| `src/domain/tax/types/capital-gains.js` | Capital gains type with STCG/LTCG breakdown |
| `src/domain/tax/types/speculative-income.js` | Speculative and F&O income type definitions |
| `src/domain/tax/types/other-income.js` | Expanded other income (interest, dividend, etc.) |
| `src/domain/tax/types/deductions.js` | Deductions type with all sections and limits |
| `src/domain/rules/deduction-limits.js` | Statutory limits per deduction section per FY |
| `src/ui/components/collapsible-section.js` | Reusable collapsible section UI component |
| `src/ui/components/deduction-input.js` | Deduction input with limit display and validation |
| `src/ui/styles/sections.css` | Styles for collapsible sections |
| `tests/unit/domain/types/capital-gains.test.js` | Unit tests for capital gains model |
| `tests/unit/domain/types/deductions.test.js` | Unit tests for deductions model |
| `tests/unit/domain/rules/deduction-limits.test.js` | Unit tests for deduction limits |
| `tests/unit/app/validation/deduction-validators.test.js` | Deduction validation tests |
| `tests/integration/form-deductions.test.js` | Integration tests for deduction form |

---

## 5. Files To Modify

| File Path | Changes Required |
|-----------|------------------|
| `index.html` | Add collapsible sections, granular capital gains, trading income, other income, deductions |
| `src/domain/tax/types/income.js` | Refactor to use nested capital gains and other income objects |
| `src/domain/rules/field-applicability.js` | Add all new income fields and deduction fields with regime applicability |
| `src/app/state/appState.js` | Add `deductions` to state, expand `income` structure, add setters |
| `src/app/validation/validators.js` | Add validators for new income fields and all deductions (with limits) |
| `src/app/form-visibility/form-visibility-controller.js` | Handle new field types, section visibility |
| `src/app/input-normalization/normalizers.js` | Normalize new income and deduction fields |
| `src/ui/components/form-handler.js` | Handle new form fields, extract nested values |
| `src/ui/styles/components.css` | Add styles for deduction fields, limit indicators |
| `src/domain/tax/calculations/calculation-engine.js` | Process granular capital gains, apply deductions |
| `src/domain/rules/financial-years/fy-2024-25.js` | Add deduction limits, capital gains rates |
| `tests/unit/domain/rules/field-applicability.test.js` | Add tests for new fields |
| `tests/unit/app/state/appState.test.js` | Add tests for deductions state |

---

## 6. Implementation Tasks

### Phase 1: Domain Model Expansion (Foundation)

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T1.1 | Create `src/domain/tax/types/capital-gains.js` with STCG/LTCG breakdown | None | 1h |
| T1.2 | Create `src/domain/tax/types/speculative-income.js` for spec/F&O | None | 30m |
| T1.3 | Create `src/domain/tax/types/other-income.js` for interest/dividend/other | None | 30m |
| T1.4 | Create `src/domain/tax/types/deductions.js` with all Chapter VI-A sections | None | 1.5h |
| T1.5 | Create `src/domain/rules/deduction-limits.js` with FY 2024-25 limits | T1.4 | 1h |
| T1.6 | Refactor `income.js` to import and compose new types | T1.1-T1.3 | 1h |
| T1.7 | Write unit tests for all new domain types | T1.1-T1.6 | 2h |

### Phase 2: Field Applicability & State

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T2.1 | Expand `field-applicability.js` with all new income fields | T1.6 | 1h |
| T2.2 | Add deduction fields to `field-applicability.js` with regime rules | T1.4 | 1.5h |
| T2.3 | Expand `appState.js` with `deductions` and nested income structures | T1.6, T1.4 | 1.5h |
| T2.4 | Add state setters for all new fields | T2.3 | 1h |
| T2.5 | Write unit tests for field applicability | T2.1, T2.2 | 1h |
| T2.6 | Write unit tests for expanded state | T2.3, T2.4 | 1h |

### Phase 3: Validation Rules

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T3.1 | Add validators for capital gains (non-negative for each type) | T1.1 | 30m |
| T3.2 | Add validators for speculative/F&O (gains non-negative, losses allowed) | T1.2 | 30m |
| T3.3 | Add validators for other income (non-negative each) | T1.3 | 30m |
| T3.4 | Add validators for deductions with statutory limits | T1.5 | 2h |
| T3.5 | Update `validateFormSubmission` for new structure | T3.1-T3.4 | 1h |
| T3.6 | Write unit tests for all new validators | T3.1-T3.5 | 2h |

### Phase 4: UI Components

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T4.1 | Create `collapsible-section.js` component | None | 1.5h |
| T4.2 | Create `deduction-input.js` with limit indicator | T1.5 | 1h |
| T4.3 | Add collapsible section styles to `sections.css` | T4.1 | 1h |
| T4.4 | Add deduction input styles | T4.2 | 30m |

### Phase 5: HTML Form Expansion

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T5.1 | Refactor Capital Gains section with 4 granular fields | T4.1 | 1h |
| T5.2 | Add Trading Income section (Speculative + F&O) | T4.1 | 1h |
| T5.3 | Refactor Other Income section with 3 granular fields | T4.1 | 1h |
| T5.4 | Add Deductions section with all 12 deduction fields | T4.1, T4.2 | 2h |
| T5.5 | Add `data-field` attributes to all new form groups | T5.1-T5.4 | 30m |
| T5.6 | Update help text with INR limits where applicable | T5.4 | 30m |

### Phase 6: Form Handler & Visibility

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T6.1 | Update `form-handler.js` to extract nested income values | T5.1-T5.3 | 1h |
| T6.2 | Update `form-handler.js` to extract deduction values | T5.4 | 1h |
| T6.3 | Update `form-visibility-controller.js` for section visibility | T2.2 | 1.5h |
| T6.4 | Add "section" visibility (hide entire Deductions section in new regime) | T6.3 | 1h |
| T6.5 | Update normalizers for new field structure | T6.1, T6.2 | 1h |

### Phase 7: Calculation Engine Updates

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T7.1 | Update calculation engine to process granular capital gains | T1.1 | 2h |
| T7.2 | Add deduction processing logic (apply limits, regime rules) | T1.4, T1.5 | 2h |
| T7.3 | Update gross/taxable income calculations | T7.1, T7.2 | 1.5h |
| T7.4 | Write unit tests for updated calculations | T7.1-T7.3 | 2h |

### Phase 8: Integration Testing

| ID | Task | Depends On | Estimate |
|----|------|------------|----------|
| T8.1 | Write integration tests for form input flow | T6.1-T6.5 | 2h |
| T8.2 | Write integration tests for regime switching (deduction visibility) | T6.3-T6.4 | 1.5h |
| T8.3 | Write integration tests for deduction limit enforcement | T3.4 | 1.5h |
| T8.4 | Write E2E scenario tests (salaried with deductions, compare regimes) | All | 2h |

---

## 7. Testing Strategy

### 7.1 Unit Tests

#### Domain Types
- `capital-gains.test.js`: Create/validate STCG/LTCG objects, sum functions
- `deductions.test.js`: Create/validate deductions, enforce limits
- `other-income.test.js`: Create/validate interest/dividend/other
- `speculative-income.test.js`: Gains/losses, net calculations

#### Rules
- `deduction-limits.test.js`: Verify limits for FY 2024-25 per section
- `field-applicability.test.js`: Test visibility rules for all new fields

#### Validation
- Test each deduction against statutory max
- Test negative value rejection
- Test boundary values (exactly at limit, 1 rupee over)

#### State
- Test setDeductions(), setCapitalGains() methods
- Test immutability of state updates

### 7.2 Integration Tests

#### Form Flow Tests
- Enter granular capital gains → verify state has all 4 values
- Enter deductions → verify state has all deduction values
- Submit with mix of income and deductions → verify calculation

#### Regime Switching Tests
- Start in Compare → all fields visible
- Switch to New → deduction section hidden (except standard deduction)
- Switch to Old → deduction section visible
- Verify hidden field values don't contribute to calculations

#### Limit Enforcement Tests
- Enter 80C = ₹2,00,000 → enforce cap at ₹1,50,000
- Enter 80D = ₹60,000 → enforce cap at ₹25,000 (or ₹50,000 for senior)

### 7.3 Boundary Scenarios

| Scenario | Input | Expected |
|----------|-------|----------|
| Zero deductions | All deductions = 0 | Calculate without errors |
| Max deductions | All at statutory max | Apply all limits correctly |
| Over limit 80C | ₹2,00,000 | Cap at ₹1,50,000 or warn |
| Mixed capital gains | STCG + LTCG | Separate tax rates applied |
| F&O loss carryforward | Losses > Gains | Net loss preserved |
| Regime switch with values | Old→New with 80C filled | 80C hidden, value stored |

### 7.4 Accessibility Tests
- Collapsible sections keyboard navigable
- ARIA labels on all inputs
- Error messages announced to screen readers
- Focus management when sections expand/collapse

---

## 8. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex form may overwhelm users | User abandonment | Use collapsible sections, show only relevant fields |
| Statutory limits change per FY | Incorrect calculations | Version limits in `deduction-limits.js` per FY |
| Capital gains special tax rates not implemented | Inaccurate tax | Phase 7 implements granular rates; document limitation if deferred |
| Hidden field values lost on regime switch | Data loss frustration | Existing shadow storage mechanism preserves values |
| Form handler becomes complex | Maintenance burden | Extract field mapping to separate config |
| Backward compatibility with existing data | Broken state | Provide migration/default values for missing fields |

---

## 9. Acceptance Criteria

### Income Inputs
- [ ] Capital Gains section shows 4 separate fields (STCG equity, STCG other, LTCG equity, LTCG other)
- [ ] Trading Income section shows Speculative Gains/Losses and F&O Gains/Losses
- [ ] Other Income section shows Interest, Dividend, Other Taxable
- [ ] All monetary inputs accept non-negative numbers (losses allowed where applicable)
- [ ] Values display with INR formatting in results

### Deductions
- [ ] Deductions section shows Standard Deduction (auto), 80C, 80CCD(1B), 80D, 80E, 80G, 80TTA, 80TTB, HRA, LTA, Home Loan Interest
- [ ] Each deduction field shows statutory limit hint
- [ ] Values exceeding limits are capped or warned
- [ ] Standard Deduction auto-fills based on regime (₹75,000 new, ₹50,000 old)

### Regime Visibility
- [ ] In Old Regime: All deduction fields visible
- [ ] In New Regime: Only Standard Deduction visible (others hidden)
- [ ] In Compare Mode: All fields visible (user enters once, applies per regime rules)
- [ ] Hidden field values restored when field becomes visible again

### State Management
- [ ] State includes `income.capitalGains.{stcgEquity, stcgOther, ltcgEquity, ltcgOther}`
- [ ] State includes `deductions` object with all section fields
- [ ] State updates are immutable
- [ ] Validation errors per field are tracked

### Form UX
- [ ] Collapsible sections work via click/keyboard
- [ ] ARIA attributes on all sections and inputs
- [ ] Help text explains each field purpose
- [ ] Form submits successfully with all new fields

### Calculations
- [ ] Granular capital gains contribute correctly to gross income
- [ ] Deductions reduce taxable income per regime rules
- [ ] Comparison shows different totals when deductions apply to old regime only

---

## 10. Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | Should capital gains have separate tax rate calculations in this ticket, or is that a follow-on? | Calculation accuracy | **Assumption**: TAX-010 collects granular data; separate rates deferred to TAX-011 |
| 2 | Should we support senior citizen age input for different 80D/80TTB limits? | Deduction accuracy | **Assumption**: Use non-senior limits; senior support is future enhancement |
| 3 | Should speculative/F&O losses allow carryforward tracking? | Multi-year feature | **Assumption**: Collect data; carryforward is out of scope for single-year calculator |
| 4 | Should 80G support donation type selection (50% vs 100% eligible)? | Accuracy | **Assumption**: Use simple percentage input; detailed donation rules deferred |
| 5 | How to handle Standard Deduction — auto-apply or user-editable? | UX | **Recommendation**: Auto-calculated, displayed read-only with regime-specific value |
| 6 | Should HRA calculate based on rent/city or accept final exemption amount? | Complexity | **Assumption**: Accept final exemption amount; HRA calculator is separate feature |

---

## 11. Dependencies Map

```
TAX-010 Dependencies:

TAX-009 (Regime Selection) ─── DONE ───┐
                                        │
TAX-004 to TAX-008 (Income) ── DONE ───┤
                                        │
                               ┌────────▼────────┐
                               │    TAX-010      │
                               │  Income & Deductions │
                               └────────┬────────┘
                                        │
                               ┌────────▼────────┐
                               │    TAX-011      │
                               │  Capital Gains  │
                               │  Special Rates  │
                               └────────┬────────┘
                                        │
                               ┌────────▼────────┐
                               │    TAX-012      │
                               │  Enhanced       │
                               │  Calculations   │
                               └─────────────────┘
```

---

## 12. Summary

TAX-010 significantly expands the form to capture detailed income sources and comprehensive deductions. The implementation:

1. **Expands the domain model** with granular capital gains, speculative/F&O income, and a full deductions structure
2. **Updates field applicability** so deductions are regime-aware (old regime has most; new regime has only standard deduction)
3. **Enhances the UI** with collapsible sections for organized data entry
4. **Preserves backward compatibility** by extending existing structures rather than replacing them
5. **Prepares for future enhancements** like special capital gains tax rates and senior citizen rules

The estimated total effort is **35-45 hours** across 8 phases.

---

## 13. Related Documents

- [PRD](/docs/PRD.md) — Section 7: Deduction Inputs
- [Architecture](/docs/ARCHITECTURE.md) — Layer separation principles
- [TAX-009 Plan](/docs/plans/PLAN-TAX-009-regime-selection.md) — Field visibility patterns
- [TAX-007 Plan](/docs/plans/PLAN-TAX-007-capital-gains.md) — Capital gains architecture decision

---

**Plan Created**: 2026-08-23  
**Plan Status**: READY FOR REVIEW  
**Next Step**: Developer reviews plan, confirms open questions, begins Phase 1
