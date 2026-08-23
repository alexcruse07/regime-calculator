# Indian Income Tax Calculator — Implementation Backlog

This document contains all implementation requirements, organized by epic and priority.

## EPIC 1 — Project Foundation

### TAX-001 — Create Static Website Foundation

**Priority:** P0  
**Status:** DONE  
**Dependencies:** None

**Description:**  
Create the basic static website structure for the Indian Income Tax Calculator.

**User Story:**  
As a user, I want to open the website in a browser so that I can use the tax calculator.

**Requirements:**

Create:
- `index.html`
- CSS structure
- JavaScript structure
- Test structure

The application must run without a backend.

**Acceptance Criteria:**
- Website opens successfully in a modern browser
- No backend is required
- No database is required
- JavaScript loads successfully
- CSS loads successfully
- No console errors occur on initial page load
- Basic responsive layout exists

**Testing:**
Verify:
- Page loads
- CSS loads
- JavaScript loads
- No console errors

---

## EPIC 2 — Application Layout

### TAX-002 — Create Application Header

**Priority:** P1  
**Status:** IN_PROGRESS  
**Dependencies:** TAX-001

**Description:**  
Create the website header.

**User Story:**  
As a user, I want to understand what the website does when I open it.

**Requirements:**

Display:
- Application name
- Short description
- Tax year context

**Acceptance Criteria:**
- Header is clearly visible
- Application name is displayed
- Description explains that the application compares Old and New Tax Regimes
- Header works on desktop and mobile

**Testing:**
Verify:
- Header renders correctly
- Responsive behavior works

---

### TAX-003 — Create Financial Year Selection

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-002

**Description:**  
Allow the user to select the financial year.

**User Story:**  
As a user, I want to select the financial year so that my tax calculation uses the correct tax rules.

**Requirements:**

Create a financial-year selector. The architecture must support adding future financial years. The tax engine must receive the selected financial year.

**Acceptance Criteria:**
- Financial year can be selected
- A default financial year is provided
- Selected financial year is available to the tax calculation engine
- The application does not assume that all financial years have identical tax rules
- Unsupported financial years cannot be selected

**Testing:**
Test:
- Default year
- Changing year
- Unsupported year
- Correct year passed to calculation engine

---

## EPIC 3 — Income Inputs

### TAX-004 — Create Salary Income Input

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-003

**Description:**  
Allow the user to enter salary income.

**Requirements:**  
Provide an input for annual salary income.

**Acceptance Criteria:**
- User can enter salary income
- Only valid numeric values are accepted
- Negative values are rejected
- Empty value is handled correctly
- Value is stored in the application model
- Value is available to the tax engine

**Testing:**
Test:
- Zero
- Positive amount
- Negative amount
- Decimal input if applicable
- Very large amount
- Empty input
- Invalid text

---

### TAX-005 — Create House Property Income Input

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-004

**Description:**  
Allow the user to enter income or applicable loss from house property.

**Acceptance Criteria:**
- User can enter the applicable value
- Negative values are handled according to the tax model
- Input is validated
- Value is available to the tax engine

**Testing:**
Test:
- Zero
- Positive value
- Negative value
- Invalid input

---

### TAX-006 — Create Business/Professional Income Input

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-005

**Description:**  
Allow the user to enter business or professional income.

**Acceptance Criteria:**
- User can enter the value
- Input is validated
- Value is available to the tax engine

**Testing:**
Test:
- Zero
- Positive value
- Invalid input

---

### TAX-007 — Create Capital Gains Input

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-006

**Description:**  
Allow the user to enter applicable capital gains information.

**Important:**  
Capital gains may have tax treatment different from normal slab-based income. Do not treat all capital gains as normal salary income. The design must allow separate capital-gains calculation in the future.

**Acceptance Criteria:**
- Capital gains can be entered
- The domain model keeps capital gains separate from ordinary income
- The tax engine can identify capital gains independently

**Testing:**
Test:
- Zero
- Positive value
- Invalid input

---

### TAX-008 — Create Other Income Input

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-007

**Description:**  
Allow the user to enter other taxable income.

**Acceptance Criteria:**
- User can enter other income
- Input is validated
- Value is available to the tax engine

---

## Status Tracking

Update the status of each requirement as it progresses:

- TODO: Not started
- IN_PROGRESS: Work has started
- BLOCKED: Cannot proceed (must specify reason)
- IMPLEMENTED: Code is complete
- TESTED: All tests pass
- REVIEWED: Code review approved
- DONE: Fully complete and merged

Requirements must be processed in dependency order and by priority.
