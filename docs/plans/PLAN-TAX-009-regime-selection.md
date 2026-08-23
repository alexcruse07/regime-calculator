Now I have a complete understanding of the codebase. Let me create the comprehensive implementation plan for TAX-009:

---

# Implementation Plan: TAX-009 — Regime Selection & Dynamic Form

## 1. Requirement Understanding

### Scope
TAX-009 introduces regime selection functionality that allows users to choose between:
1. **Old Tax Regime** — Shows all deductions/exemptions applicable under the old regime
2. **New Tax Regime** — Shows only inputs applicable to the new regime
3. **Compare Both** — Shows all inputs needed for both calculations

### Constraints from Repository Instructions
- Regime selection must appear **before** income inputs (prominently near the beginning)
- Changing regime must **dynamically update** the form without page reload
- Hidden/disabled fields must **not accidentally contribute** to calculations
- Existing values must be handled safely when switching regimes
- Tax rules and regime logic must be versioned by financial year
- UI must not contain tax calculation logic
- Keep state management immutable
- Follow three-layer architecture: `domain/`, `app/`, `ui/`

### Dependencies
- **TAX-003** (Financial Year Selection) — DONE ✓
- Existing state management in `src/app/state/appState.js`
- Existing form handling in `src/ui/components/form-handler.js`

---

## 2. Current Implementation Analysis

### Existing State Structure (`appState.js`)
```javascript
{
  income: { salary, houseProperty, business, capitalGains, otherIncome },
  financialYear: '2024-25',
  validationErrors: [],
  calculations: null,
  isCalculating: false,
  lastCalculatedAt: null,
}
```
**Gap**: No `selectedRegime` field exists.

### Existing Form Structure (`index.html`)
- Financial year dropdown exists
- Income inputs exist (TAX-004 to TAX-008)
- **Gap**: No regime selection UI element

### Existing Rules Structure (`domain/rules/financial-years/`)
- `oldRegimeRules` and `newRegimeRules` already defined per FY
- `getAvailableRegimes(financialYear)` function exists
- **Gap**: No regime-specific field visibility metadata

### Existing Tax Orchestration (`coordinator.js`)
- Always calculates **both** regimes via `compareRegimes()`
- **Gap**: Does not respect user's regime selection for form display

---

## 3. Proposed Design

### Architecture Approach
Following the existing three-layer architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Layer                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ regime-selector │  │  form-handler.js │  │   appView.js   │ │
│  │   (new file)    │  │    (modified)    │  │   (modified)   │ │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬────────┘ │
│           │                    │                    │           │
├───────────┼────────────────────┼────────────────────┼───────────┤
│           │          Application Layer              │           │
│  ┌────────▼────────────────────▼────────────────────▼────────┐ │
│  │                    appState.js (modified)                  │ │
│  │  + selectedRegime: 'old' | 'new' | 'compare'              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         form-visibility.js (new) - Regime-aware          │   │
│  │         field visibility controller                       │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                        Domain Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  field-applicability.js (new) - Pure logic mapping       │   │
│  │  which fields apply to which regime                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Regime Selection Options
| Option | Calculation Behavior | Form Fields Shown |
|--------|---------------------|-------------------|
| `old` | Calculate old regime only | Old-regime applicable fields |
| `new` | Calculate new regime only | New-regime applicable fields |
| `compare` | Calculate both regimes | All fields (union of both) |

### State Update Flow
```
User selects regime → appState.setSelectedRegime()
                    → notifyListeners()
                    → formVisibilityController.updateFieldVisibility()
                    → DOM show/hide without page reload
```

### Field Value Safety
When hiding a field:
1. Store the current value in a shadow state
2. Set field value to 0 for calculations
3. When showing again, restore the shadow value

---

## 4. Files To Create

| File | Purpose |
|------|---------|
| `src/ui/components/regime-selector.js` | UI component for regime radio buttons/toggle |
| `src/app/form-visibility/form-visibility-controller.js` | Controls dynamic show/hide of form sections |
| `src/domain/rules/field-applicability.js` | Maps which fields apply to which regime |
| `src/shared/constants/regimes.js` | Regime enum/constants |
| `tests/unit/ui/components/regimeSelector.test.js` | Unit tests for regime selector component |
| `tests/unit/app/form-visibility.test.js` | Unit tests for form visibility controller |
| `tests/unit/domain/field-applicability.test.js` | Unit tests for field applicability logic |

---

## 5. Files To Modify

| File | Changes Required |
|------|------------------|
| `src/app/state/appState.js` | Add `selectedRegime` to state, add `setSelectedRegime()` |
| `index.html` | Add regime selector UI between FY dropdown and income inputs |
| `src/ui/components/form-handler.js` | Include regime in form data collection |
| `src/ui/views/appView.js` | Subscribe to regime changes, update field visibility |
| `src/app/main.js` | Initialize regime selector component |
| `src/app/validation/validators.js` | Add regime validation |
| `src/app/tax-orchestration/coordinator.js` | Respect selected regime in calculation flow |
| `src/ui/styles/components.css` | Add regime selector styles |
| `src/app/input-normalization/normalizers.js` | Handle regime-filtered income values |

---

## 6. Component Structure for Regime Selection

### HTML Structure (to add in `index.html`)
```html
<div class="form-group regime-selection" id="regime-selection-group">
  <fieldset>
    <legend>Select Tax Regime:</legend>
    <div class="regime-options" role="radiogroup" aria-label="Tax regime selection">
      <label class="regime-option">
        <input type="radio" name="tax-regime" value="old" id="regime-old">
        <span class="regime-label">Old Regime</span>
        <span class="regime-hint">With deductions & exemptions</span>
      </label>
      <label class="regime-option">
        <input type="radio" name="tax-regime" value="new" id="regime-new">
        <span class="regime-label">New Regime</span>
        <span class="regime-hint">Lower rates, fewer deductions</span>
      </label>
      <label class="regime-option">
        <input type="radio" name="tax-regime" value="compare" id="regime-compare" checked>
        <span class="regime-label">Compare Both</span>
        <span class="regime-hint">See which is better for you</span>
      </label>
    </div>
  </fieldset>
</div>
```

### Component API (`regime-selector.js`)
```javascript
/**
 * Initializes regime selector event listeners
 * @param {Function} onRegimeChange - Callback when regime changes
 * @returns {Function} Cleanup function
 */
export function initializeRegimeSelector(onRegimeChange);

/**
 * Gets currently selected regime
 * @returns {string} 'old' | 'new' | 'compare'
 */
export function getSelectedRegime();

/**
 * Sets the selected regime programmatically
 * @param {string} regime - 'old' | 'new' | 'compare'
 */
export function setSelectedRegime(regime);

/**
 * Updates regime selector based on available regimes for FY
 * @param {string[]} availableRegimes - Array of regime identifiers
 */
export function updateAvailableRegimes(availableRegimes);
```

---

## 7. State Management for Selected Regime

### Updated State Shape
```javascript
{
  income: { salary, houseProperty, business, capitalGains, otherIncome },
  financialYear: '2024-25',
  selectedRegime: 'compare',  // NEW: 'old' | 'new' | 'compare'
  hiddenFieldValues: {},      // NEW: Shadow storage for hidden field values
  validationErrors: [],
  calculations: null,
  isCalculating: false,
  lastCalculatedAt: null,
}
```

### New AppState Methods
```javascript
/**
 * Sets the selected tax regime
 * @param {string} regime - 'old' | 'new' | 'compare'
 */
setSelectedRegime(regime) {
  const validRegimes = ['old', 'new', 'compare'];
  if (!validRegimes.includes(regime)) {
    console.warn(`Invalid regime: ${regime}`);
    return;
  }
  this.state = {
    ...this.state,
    selectedRegime: regime,
  };
  this.notifyListeners();
}

/**
 * Stores a hidden field's value for later restoration
 * @param {string} fieldName - Field identifier
 * @param {number} value - Value to store
 */
storeHiddenFieldValue(fieldName, value) {
  this.state = {
    ...this.state,
    hiddenFieldValues: {
      ...this.state.hiddenFieldValues,
      [fieldName]: value,
    },
  };
  // No notify - this is internal bookkeeping
}

/**
 * Retrieves a stored hidden field value
 * @param {string} fieldName - Field identifier
 * @returns {number|null} Stored value or null
 */
getHiddenFieldValue(fieldName) {
  return this.state.hiddenFieldValues?.[fieldName] ?? null;
}

/**
 * Clears stored hidden field value
 * @param {string} fieldName - Field identifier
 */
clearHiddenFieldValue(fieldName) {
  const { [fieldName]: _, ...rest } = this.state.hiddenFieldValues || {};
  this.state = {
    ...this.state,
    hiddenFieldValues: rest,
  };
}
```

---

## 8. Dynamic Show/Hide of Form Sections

### Field Applicability Data Structure (`field-applicability.js`)
```javascript
/**
 * Field applicability by regime for FY 2024-25
 * Pure data - no DOM logic
 */
export const FIELD_APPLICABILITY_FY_2024_25 = {
  // Income fields - both regimes
  salary: { old: true, new: true },
  houseProperty: { old: true, new: true },
  business: { old: true, new: true },
  capitalGains: { old: true, new: true },
  otherIncome: { old: true, new: true },
  
  // Deductions - varies by regime (future TAX-010)
  section80C: { old: true, new: false },
  section80D: { old: true, new: false },
  hra: { old: true, new: false },
  standardDeduction: { old: false, new: true },
  // ... etc
};

/**
 * Gets fields applicable for a given regime and financial year
 * @param {string} regime - 'old' | 'new' | 'compare'
 * @param {string} financialYear - e.g., '2024-25'
 * @returns {Object} Map of field → visible boolean
 */
export function getFieldVisibility(regime, financialYear);

/**
 * Gets all field names for a financial year
 * @param {string} financialYear
 * @returns {string[]} Array of field names
 */
export function getAllFields(financialYear);
```

### Form Visibility Controller (`form-visibility-controller.js`)
```javascript
/**
 * Updates form field visibility based on selected regime
 * @param {string} regime - Selected regime
 * @param {string} financialYear - Selected financial year
 */
export function updateFieldVisibility(regime, financialYear) {
  const visibility = getFieldVisibility(regime, financialYear);
  
  Object.entries(visibility).forEach(([fieldName, isVisible]) => {
    const container = document.querySelector(`[data-field="${fieldName}"]`);
    if (!container) return;
    
    if (isVisible) {
      showField(container, fieldName);
    } else {
      hideField(container, fieldName);
    }
  });
}

/**
 * Shows a form field, restoring its previous value
 */
function showField(container, fieldName) {
  container.style.display = '';
  container.setAttribute('aria-hidden', 'false');
  
  const input = container.querySelector('input, select');
  if (input) {
    input.disabled = false;
    input.removeAttribute('aria-disabled');
    
    // Restore value if we have a stored one
    const storedValue = appState.getHiddenFieldValue(fieldName);
    if (storedValue !== null) {
      input.value = storedValue;
      appState.clearHiddenFieldValue(fieldName);
    }
  }
}

/**
 * Hides a form field, storing its value for safety
 */
function hideField(container, fieldName) {
  const input = container.querySelector('input, select');
  if (input && input.value) {
    // Store current value before hiding
    appState.storeHiddenFieldValue(fieldName, parseFloat(input.value) || 0);
    input.value = '';
  }
  
  container.style.display = 'none';
  container.setAttribute('aria-hidden', 'true');
  
  if (input) {
    input.disabled = true;
    input.setAttribute('aria-disabled', 'true');
  }
}
```

---

## 9. Implementation Tasks

### Phase 1: Foundation (Domain Layer)
| Task | Description | Estimated Effort |
|------|-------------|------------------|
| T1.1 | Create `src/shared/constants/regimes.js` with regime enum constants | Small |
| T1.2 | Create `src/domain/rules/field-applicability.js` with field→regime mappings | Medium |
| T1.3 | Write unit tests for field-applicability logic | Medium |

### Phase 2: State Management (App Layer)
| Task | Description | Estimated Effort |
|------|-------------|------------------|
| T2.1 | Add `selectedRegime` to initial state in `appState.js` | Small |
| T2.2 | Add `setSelectedRegime()` method with validation | Small |
| T2.3 | Add `hiddenFieldValues` shadow storage methods | Small |
| T2.4 | Add regime validation to `validators.js` | Small |
| T2.5 | Write unit tests for new state methods | Medium |

### Phase 3: Form Visibility (App Layer)
| Task | Description | Estimated Effort |
|------|-------------|------------------|
| T3.1 | Create `src/app/form-visibility/form-visibility-controller.js` | Medium |
| T3.2 | Implement `updateFieldVisibility()` with show/hide logic | Medium |
| T3.3 | Implement value preservation on hide/restore on show | Medium |
| T3.4 | Write unit tests for form visibility controller | Medium |

### Phase 4: UI Component (UI Layer)
| Task | Description | Estimated Effort |
|------|-------------|------------------|
| T4.1 | Create `src/ui/components/regime-selector.js` component | Medium |
| T4.2 | Add regime selector HTML to `index.html` (after FY, before income) | Small |
| T4.3 | Add data-field attributes to existing form groups in HTML | Small |
| T4.4 | Add regime selector CSS styles to `components.css` | Small |
| T4.5 | Write unit tests for regime selector component | Medium |

### Phase 5: Integration (UI/App Layer)
| Task | Description | Estimated Effort |
|------|-------------|------------------|
| T5.1 | Update `form-handler.js` to include regime in form data | Small |
| T5.2 | Update `appView.js` to subscribe to regime changes | Medium |
| T5.3 | Update `main.js` to initialize regime selector | Small |
| T5.4 | Update `coordinator.js` to filter income based on visible fields | Medium |

### Phase 6: Testing & Validation
| Task | Description | Estimated Effort |
|------|-------------|------------------|
| T6.1 | Write integration tests for regime selection flow | Medium |
| T6.2 | Test regime switching preserves/clears values correctly | Medium |
| T6.3 | Test hidden fields don't contribute to calculations | Medium |
| T6.4 | Manual accessibility testing (keyboard nav, screen reader) | Small |

---

## 10. Testing Strategy

### Unit Tests

#### `tests/unit/domain/field-applicability.test.js`
```javascript
describe('Field Applicability', () => {
  describe('getFieldVisibility', () => {
    it('should return all fields visible for compare mode');
    it('should return only old-regime fields for old regime');
    it('should return only new-regime fields for new regime');
    it('should throw for unsupported financial year');
    it('should throw for invalid regime');
  });
});
```

#### `tests/unit/app/state/appState.test.js` (extend)
```javascript
describe('AppState - Regime Selection', () => {
  it('should have compare as default selectedRegime');
  it('should update selectedRegime via setSelectedRegime');
  it('should reject invalid regime values');
  it('should notify listeners on regime change');
  it('should store and retrieve hidden field values');
  it('should clear hidden field values');
});
```

#### `tests/unit/ui/components/regimeSelector.test.js`
```javascript
describe('Regime Selector Component', () => {
  it('should render three regime options');
  it('should have compare selected by default');
  it('should call onRegimeChange when selection changes');
  it('should highlight selected regime visually');
  it('should be accessible via keyboard');
  it('should have proper ARIA attributes');
});
```

#### `tests/unit/app/form-visibility.test.js`
```javascript
describe('Form Visibility Controller', () => {
  it('should show all fields when regime is compare');
  it('should hide new-regime-only fields when regime is old');
  it('should hide old-regime-only fields when regime is new');
  it('should store field value before hiding');
  it('should restore field value when showing');
  it('should set aria-hidden on hidden containers');
  it('should disable inputs in hidden containers');
});
```

### Integration Tests

#### `tests/integration/regime-selection.test.js`
```javascript
describe('Regime Selection Integration', () => {
  describe('Regime change flow', () => {
    it('should update form fields when regime changes from compare to old');
    it('should update form fields when regime changes from compare to new');
    it('should restore all fields when changing back to compare');
    it('should not reload page on regime change');
  });

  describe('Value preservation', () => {
    it('should preserve values when hiding and re-showing fields');
    it('should not include hidden field values in calculations');
    it('should clear hidden values on form reset');
  });

  describe('Calculation behavior', () => {
    it('should calculate only old regime when old is selected');
    it('should calculate only new regime when new is selected');
    it('should calculate both when compare is selected');
  });
});
```

### Key Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Default state | "Compare Both" selected, all fields visible |
| Select "Old Regime" | Hide new-regime-only fields, show old-regime fields |
| Select "New Regime" | Hide old-regime-only fields, show new-regime fields |
| Switch Old → Compare | Restore all fields, restore stored values |
| Enter value, hide field, show field | Value should be preserved |
| Submit with hidden field | Hidden field value should be 0 in calculation |
| Keyboard navigation | Tab through regime options, Enter/Space to select |
| Screen reader | Announces regime options and selection state |

---

## 11. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Hidden field values accidentally included in calculation | High | Zero hidden fields before calculation; test coverage |
| Race condition between regime change and state update | Medium | Use synchronous state updates; avoid async gaps |
| Lost user data when switching regimes | Medium | Shadow storage for hidden values; restore on re-show |
| Accessibility regression | Medium | ARIA attributes; keyboard testing; semantic HTML |
| Complex state with multiple hidden fields | Medium | Keep shadow storage simple; clear on reset |
| FY-specific field visibility differs | Low | Data-driven applicability per FY; extensible design |
| Current income inputs have no `data-field` attribute | Low | Add during HTML modifications in T4.3 |

---

## 12. Acceptance Criteria

### Functional
- [ ] Regime selection appears **after** Financial Year and **before** income inputs
- [ ] User can select "Old Regime"
- [ ] User can select "New Regime"
- [ ] User can select "Compare Both"
- [ ] Selected regime is visually highlighted
- [ ] "Compare Both" is selected by default
- [ ] Changing regime **dynamically updates** form sections (no page reload)
- [ ] Hidden fields are **not included** in calculations
- [ ] Values entered in fields are **preserved** when hiding/showing
- [ ] Form reset clears regime to default ("Compare Both")
- [ ] Financial Year and Regime are **both required** before calculation

### Accessibility
- [ ] Regime selection uses semantic `<fieldset>` and `<legend>`
- [ ] Radio buttons have associated labels
- [ ] Keyboard navigation works (Tab, Arrow keys, Enter/Space)
- [ ] Hidden containers have `aria-hidden="true"`
- [ ] Disabled inputs have `aria-disabled="true"`
- [ ] Focus is managed appropriately on regime change

### Code Quality
- [ ] All new code follows existing architecture patterns
- [ ] Field applicability logic is in domain layer (testable without DOM)
- [ ] UI component is in ui/components (presentation only)
- [ ] State management is immutable
- [ ] All new functions have JSDoc comments
- [ ] Unit tests pass with > 80% coverage on new code
- [ ] Integration tests verify end-to-end regime selection flow

---

## 13. Open Questions

| # | Question | Impact | Suggested Resolution |
|---|----------|--------|----------------------|
| 1 | Should results section update immediately when regime changes, or only after "Calculate" is clicked? | UX | Recommend: Results clear on regime change; recalculate required |
| 2 | For TAX-009, are the current income fields (salary, houseProperty, etc.) regime-specific, or all visible for all regimes? | Scope | Based on REQUIREMENTS.md, income fields are same for both regimes; **deductions** vary. For TAX-009, show all current income fields regardless of regime. |
| 3 | Should we show a confirmation when switching regimes if values will be hidden? | UX | Recommend: No confirmation for MVP; silently preserve values |
| 4 | What happens if user selects FY that doesn't support a regime? | Edge case | Recommend: Disable unavailable regime options; fall back to "Compare Both" |
| 5 | Should regime selection sync with URL (deep linking)? | Feature scope | Recommend: Out of scope for TAX-009; consider for TAX-013 (Professional UI/UX) |

---

## 14. Complexity Estimate

| Area | Effort | Notes |
|------|--------|-------|
| Domain layer (field-applicability) | 2 hours | Pure data + logic |
| State management extensions | 2 hours | 3 new methods + tests |
| Form visibility controller | 3 hours | Show/hide + value preservation |
| Regime selector UI component | 3 hours | HTML + CSS + JS |
| Integration & wiring | 2 hours | main.js, appView.js, form-handler.js |
| Testing | 4 hours | Unit + integration tests |
| **Total** | **~16 hours** | ~2 developer days |

---

## 15. Summary

TAX-009 introduces regime selection as a foundational feature. The design:

1. **Extends existing state** with `selectedRegime` and `hiddenFieldValues`
2. **Adds domain-layer logic** for field applicability per regime
3. **Creates a reusable UI component** for regime selection
4. **Implements safe value preservation** when hiding/showing fields
5. **Maintains architectural separation** (domain → app → ui)

This sets the foundation for TAX-010 (Complete Income & Deduction Form) where regime-specific deductions will be added.