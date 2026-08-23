# Copilot Instructions

These instructions apply to all AI agents working in this repository.

## General Coding

- Use modern JavaScript.
- Prefer ES modules.
- Prefer simple solutions.
- Keep functions small.
- Use meaningful names.
- Avoid unnecessary dependencies.
- Avoid unrelated changes.

## Architecture

- Keep UI separate from business logic.
- Keep tax calculations independent from DOM manipulation.
- Keep financial-year-specific rules separate.
- Do not introduce a backend unless explicitly requested.

## Tax

- Never invent tax rules.
- Never assume tax rules between financial years.
- Do not scatter tax rates throughout the code.
- Keep tax rules separate from algorithms.
- Document important assumptions.
- Verify tax rules against authoritative sources.

## Testing

- Tax-related changes must include tests.
- Tests should cover:
  - zero income
  - normal income
  - boundary values
  - just below tax slab boundaries
  - exactly at boundaries
  - just above boundaries
  - deductions
  - rebates
  - cess
  - surcharge
  - Old Regime
  - New Regime

## Security

- Never commit:
  - AWS credentials
  - API keys
  - passwords
  - tokens
  - private keys
- Use least-privilege permissions.

## Agent Behavior

Future agents may have separate responsibilities:

- Planner → plans
- Developer → implements
- Tester → tests
- Reviewer → reviews
- Builder → builds
- Deployer → deploys
- Orchestrator → coordinates

Agents must:

- follow repository instructions
- read relevant documentation
- stay within their responsibility
- not invent requirements
- report uncertainty
- not silently change requirements
