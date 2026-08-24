# Tax Calculator — Requirements

**Project:** Tax Calculator  
**Type:** Static website  
**Purpose:** Calculate and compare Indian income tax under Old Tax Regime and New Tax Regime.

> **AUTHORITATIVE UI REFERENCE:** The supplied Figma screenshot is the visual specification for the website. Store it at `docs/design/tax-calculator-figma.png`.
>
> The UI implementation must reproduce the reference as closely as technically possible. Do not treat it as general inspiration. Match the layout, proportions, spacing, typography, colors, gradients, cards, controls, icons, footer and responsive behavior. Functionality and accessibility take precedence only where they conflict with the image.

---

## 1. Source of Truth

Use:

- `docs/REQUIREMENTS.md`
- `docs/BACKLOG.md`
- existing architecture documentation
- agent instructions
- agent skills
- project guardrails
- `docs/design/tax-calculator-figma.png` for UI

Do not invent tax rules. Tax rules must be verified and financial-year-specific.

---

## 2. Existing Completed Requirements

| ID | Requirement | Status |
|---|---|---|
| TAX-001 | Static Website Foundation | DONE |
| TAX-002 | Application Header | DONE |
| TAX-003 | Financial Year Selection | DONE |
| TAX-004 | Salary Income Input | DONE |
| TAX-005 | House Property Income Input | DONE |
| TAX-006 | Business/Professional Income Input | DONE |
| TAX-007 | Capital Gains Input | DONE |
| TAX-008 | Other Income Input | DONE |

The generic Capital Gains field must be replaced/restructured by the detailed capital-gain requirements below.

---

## 3. Remaining Requirements

| ID | Title | Priority | Status | Dependencies |
|---|---|---|---|---|
| TAX-009 | Regime Selection & Dynamic Form | P0 | DONE | TAX-003 |
| TAX-010 | Complete Income & Deduction Form | P0 | DONE | TAX-009 |
| TAX-011 | Figma UI Implementation | P0 | TODO | TAX-009, TAX-012 |
| TAX-012 | Tax Calculation Engine | P0 | TODO | TAX-010 |
| TAX-013 | Tax Comparison & Results | P0 | TODO | TAX-011 |
| TAX-014 | Validation & Comprehensive Testing | P0 | TODO | TAX-012, TAX-013 |
| TAX-015 | Production Build & Quality Review | P0 | TODO | TAX-014 |
| TAX-016 | AWS S3/CloudFront Deployment | P1 | TODO | TAX-015 |

---

# 4. TAX-009 — Regime Selection & Dynamic Form

The user must select:

- Old Tax Regime
- New Tax Regime
- Compare Both

Regime selection must appear before detailed income/deduction entry.

### Old Regime

Display all applicable income, exemption and deduction sections.

### New Regime

Display only sections applicable to the selected financial year and New Regime.

### Compare Both

Display all fields required to calculate both regimes and clearly identify regime-specific deductions.

Changing regime must dynamically update the form without page reload.

Hidden/disabled fields must never accidentally contribute to calculations.

---

# 5. TAX-010 — Complete Income & Deduction Form

Provide separate inputs for:

- Salary Income
- House Property Income/Loss
- Home Loan Interest where applicable
- Business Income
- Professional Income
- Business/Professional Loss where applicable
- Short-Term Capital Gains (STCG)
- Long-Term Capital Gains (LTCG)
- Speculative Gains/Losses
- Futures & Options (F&O) Gains/Losses
- Interest Income
- Dividend Income
- Other Taxable Income

Do not use one generic Capital Gains field.

Conceptual model:

```text
Income
├── Salary
├── House Property
├── Business / Professional
├── STCG
├── LTCG
├── Speculative Gains
├── F&O Gains
└── Other Income
```

Support applicable deductions, according to verified financial-year rules, including where permitted:

- Standard Deduction
- 80C
- 80CCD(1B)
- 80D
- 80E
- 80G
- 80TTA
- 80TTB
- Home Loan Interest
- HRA where applicable
- other applicable deductions

Use structured data models. The tax engine must not read values directly from DOM elements.

---

# 6. TAX-011 — Figma MCP Design Fetch & Exact Webpage Implementation

**Priority:** P0  
**Status:** DONE  
**Dependencies:** TAX-010

## Objective

Fetch the actual webpage/design from **Figma using the configured Figma MCP server** and implement the website to match the Figma design as closely as possible.

The Figma MCP source is the authoritative UI source.

The local screenshot is only a visual reference/fallback:

```text
docs/design/tax-calculator-figma.png
```

## Mandatory Figma MCP Workflow

The agent must:

1. Use the configured Figma MCP server.
2. Fetch the relevant Figma file/page/frame/node.
3. Inspect the actual Figma design structure.
4. Inspect component hierarchy.
5. Inspect dimensions and layout.
6. Inspect typography.
7. Inspect colors.
8. Inspect gradients.
9. Inspect borders and radius.
10. Inspect shadows.
11. Inspect icons/assets.
12. Inspect responsive/layout information where available.
13. Implement the webpage using the existing project technology.
14. Reuse appropriate Figma assets where possible.
15. Run the website locally.
16. Compare the implementation with the Figma design.
17. Fix visual differences.
18. Repeat until the implementation closely matches the Figma design.

## Important Rule

Do not recreate the UI from memory or from a textual description when Figma MCP is available.

Do not replace the Figma design with a generic UI.

The implementation should reproduce the actual Figma webpage/design, including:

- header
- navigation
- hero
- typography
- step indicator
- calculator form
- regime cards
- financial-year selector
- income fields
- deductions
- tax summary
- comparison
- tax breakdown
- savings
- information cards
- feature cards
- footer
- icons
- spacing
- colors
- gradients
- borders
- shadows
- responsive layout

## Figma MCP Failure Handling

If Figma MCP cannot access the design:

- Do not invent the design.
- Do not mark TAX-013 as DONE.
- Mark TAX-013 as `BLOCKED`.
- Report the exact MCP/Figma access problem.

The screenshot may be used only for comparison/fallback after the MCP source has been exhausted or where an MCP response does not expose a visual detail.

## Visual Acceptance Criteria

TAX-011 is complete only when:

- The actual Figma design was fetched through MCP.
- The webpage has been implemented.
- The rendered webpage closely matches the Figma design.
- Major layout differences are corrected.
- Typography and spacing are consistent.
- Colors and gradients are consistent.
- Cards and controls match the design.
- Footer and navigation match the design.
- Responsive behavior is implemented.
- The functionality from TAX-009 through TAX-012 remains intact.


---

# 7. TAX-012 — Tax Calculation Engine

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-011

## Objective

Implement a standalone, testable tax calculation engine for the selected financial year and regime.

The UI must not contain tax calculation logic.

## Requirements

The engine must:

- Calculate Old Regime tax.
- Calculate New Regime tax.
- Calculate both regimes when Compare Both is selected.
- Apply verified financial-year-specific tax slabs and rules.
- Calculate normal slab-rate income separately from special-rate income.
- Handle STCG separately.
- Handle LTCG separately.
- Handle speculative gains/losses according to applicable rules.
- Handle F&O gains/losses according to applicable rules.
- Apply eligible deductions.
- Apply applicable rebate.
- Apply surcharge where applicable.
- Apply Health & Education Cess where applicable.
- Produce a detailed calculation breakdown.
- Produce the final tax payable.

## Data-driven Rules

Tax rules must be maintained separately from calculation logic.

Conceptually:

```text
financialYear
├── oldRegime
│   ├── slabs
│   ├── deductions
│   ├── rebates
│   ├── surcharge
│   └── specialRates
└── newRegime
    ├── slabs
    ├── deductions
    ├── rebates
    ├── surcharge
    └── specialRates
```

Never guess tax rules.

If a required rule cannot be verified, mark the requirement `BLOCKED`.

## Acceptance Criteria

- Calculation engine is independently testable.
- UI does not contain tax calculation logic.
- Normal and special-rate income are handled separately.
- Financial-year-specific rules are used.
- Calculation produces a structured result suitable for the UI.
- Old and New regime calculations can be compared.

---

# 8. TAX-013 — Tax Comparison & Results

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-012

## Objective

Display a clear and understandable tax result.

## Requirements

Show:

- Gross Total Income
- Total Exemptions
- Total Deductions
- Taxable Income
- Normal Income Tax
- Special-Rate Tax
- Rebate
- Surcharge
- Health & Education Cess
- Total Tax Payable

When both regimes are calculated, show:

| Component | Old Regime | New Regime |
|---|---:|---:|
| Taxable Income | ₹ | ₹ |
| Income Tax | ₹ | ₹ |
| Special-Rate Tax | ₹ | ₹ |
| Rebate | ₹ | ₹ |
| Surcharge | ₹ | ₹ |
| Cess | ₹ | ₹ |
| Total Tax | ₹ | ₹ |

Clearly show:

- lower-tax regime
- tax payable under each regime
- estimated savings
- detailed breakdown

If both are equal, state that both regimes result in the same estimated tax.

## Acceptance Criteria

- Results update correctly after calculation.
- Old and New values are clearly distinguishable.
- Savings are calculated correctly.
- Detailed breakdown is available.
- No calculation is performed directly inside presentation components.

---

# 9. TAX-014 — Validation & Comprehensive Testing

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-013

## Objective

Validate the complete application after the Figma implementation.

## Test

- Financial Year selection
- Old Regime
- New Regime
- Compare Both
- Dynamic fields
- Salary
- House Property
- Business/Professional Income
- STCG
- LTCG
- Speculative Gains
- F&O Gains/Losses
- Other Income
- Deductions
- Tax calculation
- Tax comparison
- Savings
- Tax breakdown

## Edge Cases

Test:

- zero income
- slab boundaries
- deduction boundaries
- rebate thresholds
- surcharge thresholds
- valid losses
- invalid values
- empty values
- very large values

## UI Testing

Verify:

- desktop
- tablet
- mobile
- responsive layout
- keyboard navigation
- validation messages
- focus states
- no horizontal scrolling
- no blocking browser console errors
- visual regression against the Figma design

## Acceptance Criteria

All tests pass.

No CRITICAL or HIGH defects remain.

---

# 10. TAX-015 — Production Build & Quality Review

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-014

## Objective

Create and validate the final production build.

## Requirements

The Build Agent must:

1. Install/verify dependencies.
2. Run tests.
3. Run lint.
4. Run the production build.
5. Verify generated static assets.
6. Verify there are no secrets in source or build output.
7. Verify there are no AWS credentials in source or build output.
8. Verify the application can run from the generated static files.
9. Verify the final UI.
10. Verify tax calculation functionality.

Do not proceed to deployment if the production build fails.

## Acceptance Criteria

- Tests pass.
- Lint passes.
- Production build succeeds.
- Build artifacts are valid.
- No secrets are present.
- Final application is ready for deployment.

---

# 11. TAX-016 — Deploy Website to AWS

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-015

## Objective

Deploy the final static website to Amazon S3, with CloudFront if configured.

## Deployment Requirements

The Deploy Agent must:

1. Verify AWS credentials/configuration without exposing secrets.
2. Verify the AWS account.
3. Verify the target S3 bucket.
4. Verify CloudFront configuration if applicable.
5. Verify the production build.
6. Prepare the deployment.
7. Ask the user for explicit approval.
8. Deploy only after explicit approval.
9. Upload the production static assets.
10. Apply CloudFront invalidation if configured.
11. Verify the deployed website.
12. Run production smoke tests.

## Mandatory Human Approval

The Deploy Agent must **STOP before the actual AWS deployment** and request explicit approval.

Example:

```text
Production build is ready.

AWS deployment target:
S3: <bucket>
CloudFront: <distribution if configured>

Approve deployment to AWS?
```

Do not interpret unrelated messages as approval.

Deployment may start only after explicit approval such as:

- APPROVE
- YES
- DEPLOY
- PROCEED

## AWS Safety

Never:

- expose AWS credentials
- commit credentials
- deploy to an unverified account
- delete unrelated S3 resources
- modify unrelated AWS resources
- deploy an untested build

## Acceptance Criteria

- Deployment succeeds.
- Static assets are accessible.
- Website loads successfully.
- CSS and JavaScript load.
- Tax calculator works in production.
- Regime selection works.
- Tax calculation works.
- Old vs New comparison works.
- Production smoke tests pass.

---

# 12. Final Workflow

The Orchestrator must process the requirements in dependency order:

```text
TAX-009
   ↓
TAX-010
   ↓
TAX-011
   ↓
TAX-012
   ↓
TAX-013
   ↓
TAX-014
   ↓
TAX-015
   ↓
TAX-016
```

For each requirement:

```text
Planner
   ↓
Developer
   ↓
Tester
   ↓
Reviewer
```

If tests fail:

```text
Developer → Tester
```

If review fails:

```text
Developer → Tester → Reviewer
```

The Orchestrator must continue automatically until the requirement is approved.

Do not ask the user for approval between normal development agents.

The final AWS deployment is the human approval gate.

```text
All requirements complete
        ↓
Production Build
        ↓
Build PASS
        ↓
Deploy Agent
        ↓
Prepare AWS Deployment
        ↓
WAIT FOR HUMAN APPROVAL
        ↓
AWS Deployment
        ↓
Production Smoke Test
        ↓
DONE
```

---

# 13. Final Product Vision

The final website should feel like a modern financial product rather than an internal developer tool.

User journey:

```text
Open Tax Calculator
       ↓
Select Financial Year
       ↓
Select Regime
       ↓
Enter Income
       ↓
Enter Applicable Deductions
       ↓
Calculate Tax
       ↓
View Old vs New
       ↓
See Savings
       ↓
Inspect Tax Breakdown
       ↓
Production Website
```

The primary goal is:

**Make Indian tax comparison simple, understandable, visually attractive and maintainable while keeping tax calculation rules accurate and financial-year-specific.**

---

# 14. New Requirements (Added 2026-08-24)

The following requirements are to be implemented after the current tasks are complete.

---

# TAX-017 — Remove Compare Both Option

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-013

## Objective

Remove the "Compare Both" regime selection option. Users must explicitly choose either Old Regime or New Regime.

## Requirements

1. Remove the "Compare Both" radio button option from the regime selection.
2. Update the regime selection to have only two options:
   - Old Regime
   - New Regime
3. Default selection should be "New Regime" (as it's the default regime from FY 2023-24).
4. Update all related calculation logic to work with single regime selection.
5. Results display should show calculation for the selected regime only.
6. Optionally show a comparison note suggesting the user can switch regimes to compare.

## Acceptance Criteria

- Only "Old Regime" and "New Regime" options are visible.
- "Compare Both" option is removed.
- Default selection is "New Regime".
- Calculation works correctly for single regime.
- No references to "compare" mode in UI or logic.

---

# TAX-018 — Collapsible Input Sections

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-017

## Objective

Implement collapsible/accordion-style input sections for better organization and reduced visual clutter.

## Requirements

1. Create collapsible sections for income input groups:
   - **Income Sources** (collapsed by default, expand on click)
     - Salary Income
     - House Property Income
     - Business/Professional Income
   - **Capital Gains** (collapsed by default)
     - STCG (Equity)
     - STCG (Other)
     - LTCG (Equity)
     - LTCG (Other)
   - **Speculative & F&O** (collapsed by default)
     - Speculative Gains/Losses
     - F&O Gains/Losses
   - **Other Income** (collapsed by default)
     - Interest Income
     - Dividend Income
     - Other Taxable Income

2. Each section should have:
   - Section header with title
   - Expand/collapse indicator (chevron icon)
   - Smooth animation on expand/collapse
   - Click anywhere on header to toggle

3. Accessibility requirements:
   - Use proper ARIA attributes (`aria-expanded`, `aria-controls`)
   - Keyboard accessible (Enter/Space to toggle)
   - Screen reader announcements for state changes

## Acceptance Criteria

- All input sections are collapsible.
- Sections are collapsed by default.
- Expand/collapse animations are smooth.
- Keyboard navigation works.
- Screen readers announce state changes.

---

# TAX-019 — Enhanced UI Design with Footer

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-018

## Objective

Enhance the overall UI with improved colors, visual hierarchy, and add a professional footer section.

## UI Reference

Use `docs/design/footer-reference.png` as the visual specification for the footer and feature section.

## Requirements

### 1. Color Scheme Enhancement

Apply a professional, cohesive color scheme:
- Primary: Deep blue (#1a365d or similar)
- Secondary: Vibrant blue (#667eea)
- Accent: Orange/Yellow for highlights
- Background: Light gray/white gradients
- Text: Dark gray for readability

### 2. Feature Section ("Why Use Our Tax Calculator?")

Add a feature highlight section above the footer with cards:

| Feature | Icon | Description |
|---------|------|-------------|
| 100% Secure | Shield/Check | Your data stays private and is not stored anywhere |
| Instant Results | Lightning | Get instant tax calculation and comparison |
| Accurate Calculation | Target/Check | Based on latest tax slabs and rules |
| Mobile Friendly | Device | Works perfectly on all devices |
| Free to Use | Checkmark | No hidden charges, completely free |

### 3. Footer Section

Implement a dark-themed footer with:

**Column 1 - Branding:**
- Tax Calculator logo
- Description: "Smart tax calculation and comparison tool for Indian taxpayers."
- Social media icons (Facebook, Twitter, LinkedIn, Instagram)

**Column 2 - Quick Links:**
- Calculator
- Old vs New Regime
- Tax Guide
- About Us
- Disclaimer

**Column 3 - Important Info:**
- Income Tax Department (link)
- Tax E-Filing Portal (link)
- CBDT Notifications (link)
- Budget 2024-25 (link)

**Column 4 - Contact Developer:**
- Developer: Rajesh Jaiswal
- Email: jaiswal058009@gmail.com
- Phone: +919632101040

**Footer Bottom:**
- Copyright: "© 2025 Tax Calculator. All rights reserved."
- Tagline: "Made with ❤️ for Indian Taxpayers"

### 4. Visual Improvements

- Add subtle gradients and shadows to cards
- Improve button styling with hover states
- Add visual separation between sections
- Ensure consistent spacing and alignment
- Add loading states with animations

## Acceptance Criteria

- Color scheme is cohesive and professional.
- Feature section displays correctly.
- Footer contains all required sections.
- Footer links are functional (external links open in new tab).
- Social media icons are present.
- Footer is responsive on all devices.
- Visual appearance matches the reference image.

---

# TAX-020 — Financial Year Update (2025-26 and 2026-27)

**Priority:** P0  
**Status:** TODO  
**Dependencies:** TAX-017

## Objective

Replace FY 2024-25 with FY 2025-26 as the default year, and add FY 2026-27 with updated tax rules.

## Requirements

### 1. Remove FY 2024-25

- Remove 2024-25 from the financial year dropdown.
- Remove or archive the FY 2024-25 rules file.

### 2. Add FY 2025-26 (Default)

Create `src/domain/rules/financial-years/fy-2025-26.js` with:

**New Regime Tax Slabs (FY 2025-26 Budget Updates):**
| Income Range | Rate |
|--------------|------|
| Up to ₹4,00,000 | 0% |
| ₹4,00,001 - ₹8,00,000 | 5% |
| ₹8,00,001 - ₹12,00,000 | 10% |
| ₹12,00,001 - ₹16,00,000 | 15% |
| ₹16,00,001 - ₹20,00,000 | 20% |
| ₹20,00,001 - ₹24,00,000 | 25% |
| Above ₹24,00,000 | 30% |

**Old Regime Tax Slabs:** (unchanged from 2024-25)
| Income Range | Rate |
|--------------|------|
| Up to ₹2,50,000 | 0% |
| ₹2,50,001 - ₹5,00,000 | 5% |
| ₹5,00,001 - ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Standard Deduction:**
- New Regime: ₹75,000
- Old Regime: ₹50,000

**Section 87A Rebate:**
- New Regime: Full rebate for taxable income ≤ ₹12,00,000
- Old Regime: Full rebate for taxable income ≤ ₹5,00,000

**Surcharge:** (unchanged)
**Cess:** 4% (unchanged)

### 3. Add FY 2026-27

Create `src/domain/rules/financial-years/fy-2026-27.js`:

**Note:** Use FY 2025-26 rules as a baseline. Update slabs if new budget announcements are available, otherwise use same as 2025-26.

### 4. Update Default Selection

- Default financial year should be 2025-26.
- Dropdown should show: 2025-26, 2026-27.
- Update header to show current selection.

### 5. Update Tests

- Update all existing tests to use FY 2025-26 rules.
- Add new tests for FY 2026-27.
- Update boundary tests for new slab limits.
- Update rebate tests for ₹12L threshold.

## Acceptance Criteria

- FY 2024-25 is removed from dropdown.
- FY 2025-26 is the default selection.
- FY 2026-27 is available.
- New regime slabs are correct per 2025 budget.
- Rebate threshold is ₹12L for new regime.
- All tests pass with updated rules.

---

# TAX-021 — Separate Deductions Tab

**Priority:** P1  
**Status:** TODO  
**Dependencies:** TAX-018

## Objective

Create a separate tab/section for deductions input, separate from income inputs.

## Requirements

### 1. Tab Structure

Implement a tabbed interface with two main tabs:
- **Income** (default active tab)
- **Deductions**

### 2. Income Tab

Contains all income input sections:
- Income Sources
- Capital Gains
- Speculative & F&O
- Other Income

### 3. Deductions Tab

Contains all deduction inputs (only enabled when Old Regime is selected):

**Section 80C (Max ₹1,50,000):**
- PPF/EPF/VPF
- Life Insurance Premium
- ELSS Mutual Funds
- NSC/Tax Saver FD
- Tuition Fees
- Home Loan Principal

**Section 80CCD(1B) (Additional ₹50,000):**
- NPS Contribution

**Section 80D (Health Insurance):**
- Self & Family Premium
- Parents Premium
- Preventive Health Checkup

**Section 80E:**
- Education Loan Interest

**Section 80G:**
- Donations

**Other Deductions:**
- HRA Exemption
- LTA Exemption
- Home Loan Interest (Section 24)
- Other Deductions

### 4. Regime-based Visibility

- **New Regime:** Deductions tab shows a message: "Deductions not applicable under New Regime. Only Standard Deduction of ₹75,000 is automatically applied."
- **Old Regime:** All deduction fields are enabled and editable.

### 5. Tab Styling

- Active tab should be visually distinct.
- Smooth transition between tabs.
- Tab indicator animation.
- Keyboard accessible (arrow keys to switch tabs).

## Acceptance Criteria

- Two tabs are visible: Income and Deductions.
- Income tab is active by default.
- Deductions tab shows fields only for Old Regime.
- Deductions tab shows message for New Regime.
- Tab switching is smooth.
- Keyboard navigation works.
- All deduction fields are properly grouped.
- Deduction limits are enforced.

---

## Updated Requirements Summary Table

| ID | Title | Priority | Status | Dependencies |
|---|---|---|---|---|
| TAX-017 | Remove Compare Both Option | P1 | TODO | TAX-013 |
| TAX-018 | Collapsible Input Sections | P1 | TODO | TAX-017 |
| TAX-019 | Enhanced UI Design with Footer | P1 | TODO | TAX-018 |
| TAX-020 | Financial Year Update (2025-26 & 2026-27) | P0 | TODO | TAX-017 |
| TAX-021 | Separate Deductions Tab | P1 | TODO | TAX-018 |
