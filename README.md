# Indian Income Tax Calculator

A static web application that compares income tax liability between the **Old** and **New** Indian tax regimes across multiple financial years — fully built end-to-end using an AI-agent development workflow.

**Status**: ✅ **Project Complete** — Live at [https://d1mbvedtrmbqg.cloudfront.net](https://d1mbvedtrmbqg.cloudfront.net)

---

## 🤖 How This Project Was Built with AI Agents

This entire project — architecture, code, tests, docs, and AWS deployment — was developed using an **AI-native development workflow**. Instead of one general-purpose assistant doing everything, the work was split across specialized agents, each with a narrow responsibility, so that plans were reviewed before code was written, code was tested before it was built, and builds were validated before they were deployed.

### The Agent Team

| Agent | Responsibility | Definition |
|-------|-----------------|------------|
| **Orchestrator** | Coordinates the full lifecycle, decides when human clarification is needed, and routes failures back to the right agent | [`.github/agents/orchestrator.agent.md`](.github/agents/orchestrator.agent.md) |
| **Planner** | Reads requirements + existing code, then produces an implementation plan (files, tasks, tests, risks, acceptance criteria) before any code is touched | [`.github/agents/planner.agent.md`](.github/agents/planner.agent.md) |
| **Developer** | Implements only the approved plan — writes code and tests, reports assumptions | [`.github/agents/developer.agent.md`](.github/agents/developer.agent.md) |
| **Tester** | Independently validates the implementation against normal, boundary, invalid, and regression scenarios; reports failures honestly | [`.github/agents/tester.agent.md`](.github/agents/tester.agent.md) |
| **Builder** | Verifies the project builds and packages cleanly for production | [`.github/agents/builder.agent.md`](.github/agents/builder.agent.md) |
| **Deployer** | Deploys only validated builds to AWS (S3 + CloudFront), using least-privilege checks and post-deploy verification | [`.github/agents/deployer.agent.md`](.github/agents/deployer.agent.md) |

### The Workflow

```text
Requirement
    |
    v
Orchestrator  --  decides if clarification is needed
    |
    v
Planner  --  produces implementation plan
    |
    v
Plan  --  reviewed by human when the change is significant
    |
    v
Developer  --  implements the approved plan
    |
    v
Tester  --  runs the test suite + edge cases
    |
    +---- FAIL ----> back to Developer
    |
    v
Builder  --  produces & verifies the production build
    |
    +---- FAIL ----> back to Developer
    |
    v
Deployer  --  ships the validated build to AWS
    |
    v
Live on AWS (S3 + CloudFront)
```

Full detail: [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md)

### Domain Skills Given to the Agents

Rather than relying on general knowledge alone, the agents were equipped with reusable, project-specific **skills** that encode domain rules so results stay consistent across sessions:

- [`tax-calculation`](.github/skills/tax-calculation) — Indian tax slab/regime rules, per-financial-year data, deduction limits
- [`frontend-development`](.github/skills/frontend-development) — vanilla JS/HTML/CSS conventions used across the UI
- [`testing`](.github/skills/testing) — how calculations, rules, and UI behavior are expected to be tested
- [`accessibility`](.github/skills/accessibility) — WCAG expectations for form inputs and results
- [`security-review`](.github/skills/security-review) — client-side and dependency risk checks
- [`aws-deployment`](.github/skills/aws-deployment) — least-privilege S3 + CloudFront deployment steps

### What Using AI Agents Achieved

- **Every feature (TAX-001 → TAX-022) was planned before it was coded** — plans live in [docs/plans/](docs/plans/) so the reasoning behind each change is preserved.
- **540 automated tests** were generated and continually run by the Tester agent, catching regressions immediately (e.g. capital gains/special-income inclusion bugs were caught and fixed via `Developer → Tester` loops — see the fix commits in `git log`, e.g. `725752c` and `ec7fc0a`).
- **Architectural decisions were recorded**, not just implemented — see [ADR-001](docs/decisions/ADR-001-use-plain-javascript.md) for why plain JavaScript was chosen over a framework.
- **Deployment to AWS (S3 + CloudFront) was automated** by the Deployer agent using [`deploy-to-aws.sh`](deploy-to-aws.sh), only after the Builder agent verified a clean production build.
- **A full project history was kept as durable context** ([docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)) specifically so a *new* AI session or human developer, even much later, can resume work without re-deriving prior decisions.

If you (human or AI) are picking this project up in the future, read the [Coming Back After a Long Break](#-coming-back-after-a-long-break) section below first.

---

## ✅ Project Functionality (Completed)

The calculator is feature-complete for individual taxpayers comparing the Old vs. New regime.

### Financial Years Supported
- FY 2024-25
- FY 2025-26 *(default)*
- FY 2026-27

New years are added purely as data — see [Adding a New Financial Year](#adding-a-new-financial-year).

### Income Types Captured
- Salary income
- House property income (supports negative values for home-loan-interest loss)
- Business / professional income
- Capital gains — STCG (equity & other), LTCG (equity & other)
- Trading income — speculative gains/losses, F&O gains/losses
- Other income — interest income, dividend income, other taxable income

### Deductions & Exemptions (Old Regime)
- Standard deduction (auto-applied)
- Section 80C, 80CCD(1B), 80D, 80E, 80G, 80TTA, 80TTB
- HRA, LTA, home loan interest (Section 24), other deductions

### Tax Engine
- Full Old Regime calculation: slabs, standard deduction, all Chapter VI-A deductions, rebate u/s 87A, surcharge, health & education cess
- Full New Regime calculation: revised slabs, rebate u/s 87A, surcharge, cess
- Regime selector (auto-compare, or pick Old/New explicitly)
- Side-by-side comparison with tax difference and recommended regime

### UI / UX
- Responsive, Material-Design-inspired layout with collapsible income/deduction sections
- Dynamic financial-year-aware header
- Form validation with inline error messages
- "Clear" button that fully resets the form and state
- **Download Tax Report as PDF** — generates a full, professional PDF (via browser print) with income, deductions, both regimes' calculations, and the recommendation
- Mobile-friendly

### Quality
- **540 automated tests passing** across validators, normalizers, formatters, tax rules, calculation engine, and UI components
- ESLint clean
- Deployed and live on AWS (S3 origin + CloudFront CDN)

### Known Limitations
- Individual resident taxpayers only (no NRI / senior-citizen-specific UI toggle, though senior citizen rule data exists in the domain layer)
- No PDF export beyond the browser print-to-PDF flow (no server-side PDF generation)
- No backend — nothing is stored; every calculation happens client-side

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Run the full test suite (540 tests)
npm test

# Start the local dev server
npm run serve
# Open http://localhost:8080
```

### Other useful commands

```bash
npm run test:watch     # Re-run tests on file change
npm run test:coverage  # Generate coverage report
npm run lint           # Check code style
npm run lint:fix       # Auto-fix lint issues
```

---

## Project Structure

```
src/
  app/        - Application layer: state, validation, normalization, tax orchestration
  domain/     - Domain layer: tax types, calculation engine, per-financial-year rules
  shared/     - Shared constants, formatting, helpers
  ui/         - UI layer: components, views, styles
tests/        - Unit & integration tests (540 tests)
docs/         - Architecture, requirements, plans, decisions, project history
.github/
  agents/     - AI agent role definitions (Orchestrator, Planner, Developer, Tester, Builder, Deployer)
  skills/     - Reusable domain skills the agents draw on
index.html    - Application entry point
deploy-to-aws.sh - Deployer agent's AWS deployment script (S3 + CloudFront)
```

Full architecture detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md)

### Adding a New Financial Year

1. Create `src/domain/rules/financial-years/fy-YYYY-YY.js`
2. Define `oldRegimeRules`, `newRegimeRules` (and `seniorCitizenRules` if applicable) as plain data
3. Register it in [`src/domain/rules/financial-years/index.js`](src/domain/rules/financial-years/index.js)
4. Add the year to `SUPPORTED_YEARS` in [`src/shared/constants/financial-years.js`](src/shared/constants/financial-years.js)
5. Add tests under `tests/` mirroring an existing year's test file
6. Run `npm test` and `npm run lint`

---

## Deployment

The site is a static build deployed to **AWS S3 + CloudFront**:

- S3 (HTTP): `http://indian-tax-calculator-1787591375571.s3-website-us-east-1.amazonaws.com`
- CloudFront (HTTPS): `https://d1mbvedtrmbqg.cloudfront.net`

Redeploying (after Builder verifies the build):

```bash
./deploy-to-aws.sh
```

This syncs `dist/` to S3 and invalidates the CloudFront cache. See [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) for how the Deployer agent gates this step behind test + build validation.

---

## Security & Privacy

- **No backend** — all calculations run in the browser
- **No data collection** — no tracking, analytics, or network transmission of user data
- **No external tax-rule fetching** — all rules are versioned in source code per financial year
- Open source and auditable

---

## 🔮 Coming Back After a Long Break

If you (a human or a new AI session) are returning to this project after a year — or any long gap — here is the fastest path back to full context, in order:

1. **Read [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)** — the complete narrative of every session, decision, and issue encountered, written specifically so no prior context is assumed.
2. **Read [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)** — the full TAX-001 → TAX-022 requirement index with status, so you know exactly what exists.
3. **Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** and [docs/FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md) — the current system design.
4. **Skim `git log --oneline`** for what changed and when — commit messages capture each fix and feature in sequence.
5. **Run `npm install && npm test`** — confirm the 540 tests still pass on your machine before changing anything. If dependencies feel stale, check `package.json` engine expectations first.
6. **Check whether tax law has changed.** Indian tax slabs/rules typically change every Union Budget (~February). Before trusting any calculation:
   - Compare `src/domain/rules/financial-years/*` against the latest official rules at [incometaxindia.gov.in](https://incometaxindia.gov.in/pages/i-am/individual.aspx).
   - If a new financial year needs support, follow [Adding a New Financial Year](#adding-a-new-financial-year) — do **not** edit past years' rule files.
7. **Reuse the AI agent workflow** described above ([docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md)) rather than making ad-hoc changes: start with the Planner agent for anything beyond a trivial fix, so a plan and rationale get recorded for the *next* person who comes back after a year.
8. **Verify the live deployment** at `https://d1mbvedtrmbqg.cloudfront.net` still matches `main`/`develop` before assuming production is current — CloudFront/S3 credentials or the distribution ID in [`deploy-to-aws.sh`](deploy-to-aws.sh) may need to be reconfirmed if AWS account access has changed.
9. **Update this README and [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)** once you've made changes, the same way this update was made — so the project stays self-explanatory for whoever (or whatever) opens it next.

---

## Documentation Index

- [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md) — Complete development history
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) — Requirement index (built vs. pending)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) / [docs/FOUNDATION_ARCHITECTURE.md](docs/FOUNDATION_ARCHITECTURE.md) — System design
- [docs/PRD.md](docs/PRD.md) — Product requirements
- [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) — AI agent workflow
- [docs/BACKLOG.md](docs/BACKLOG.md) — Future/backlog items
- [docs/plans/](docs/plans/) — Per-feature implementation plans
- [docs/decisions/](docs/decisions/) — Architectural decision records
- `git log` — Version history and notable bug fixes (each commit message documents the change)

## Support

For issues or suggestions:
1. Check [docs/](docs/) for existing context first
2. Review `tests/` for expected behavior/usage examples
3. Check the browser console for runtime errors

## License

MIT

## Version

1.0.0 — Feature Complete
