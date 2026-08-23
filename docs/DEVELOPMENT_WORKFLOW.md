# Development Workflow

This project uses an AI-native workflow where human requirements are refined into plans, implemented, tested, built, and deployed in a controlled sequence.

## Workflow

1. The human provides a requirement.
2. The Orchestrator receives the requirement and determines whether clarification is needed.
3. The Planner creates an implementation plan.
4. The human reviews the plan when appropriate.
5. The Developer implements the approved plan.
6. The Tester validates the implementation.
7. The Developer fixes issues found by Tester.
8. The Tester retests the changes.
9. The Builder creates and verifies the production build.
10. The Deployer deploys the validated static build.
11. The deployment is verified.

## Workflow Diagram

```text
Requirement
    |
    v
Orchestrator
    |
    v
Planner
    |
    v
Plan
    |
    v
Developer
    |
    v
Tester
    |
    +---- FAIL ----> Developer
    |
    v
Builder
    |
    +---- FAIL ----> Developer
    |
    v
Deployer
    |
    v
AWS
```

## Agent Responsibilities

### Orchestrator

- Coordinates the workflow.
- Decides when clarification is needed.
- Ensures stages happen in the correct order.
- Routes failures back to the responsible agent.

### Planner

- Reads the requirement and supporting documentation.
- Inspects the current implementation.
- Produces an implementation plan.
- Identifies affected files, tasks, tests, risks, and acceptance criteria.

### Developer

- Implements only the approved plan.
- Reads the PRD, architecture, instructions, and relevant skills.
- Updates code and tests as needed.
- Reports files changed and assumptions.

### Tester

- Validates the implementation.
- Runs tests and checks normal, boundary, invalid, and regression scenarios.
- Reports failures honestly.
- Identifies missing tests.

### Builder

- Verifies the project can be built and packaged for production.
- Runs tests and lint if configured.
- Confirms production artifacts are generated correctly.

### Deployer

- Deploys only validated static builds.
- Verifies tests, build output, AWS configuration, identity, bucket, and permissions before deployment.
- Uses least privilege.
- Verifies deployment after completion.

## Human Approval Points

Human approval is required or recommended when:

- the requirement is ambiguous
- tax rules are uncertain
- the plan introduces a meaningful design choice
- security-sensitive changes are proposed
- destructive operations are proposed
- deployment approval is needed

## Responsibility Boundaries

Agents must stay within their role:

- The Planner does not implement code.
- The Developer does not silently change requirements.
- The Tester does not hide failures.
- The Builder does not deploy.
- The Deployer does not deploy unvalidated builds.
- The Orchestrator coordinates, but does not replace specialized agents.

## Long-Term Context

Repository documentation, skills, and instructions are the durable context for the project.

- `docs/PRD.md` defines what the product should do.
- `docs/ARCHITECTURE.md` defines the intended technical shape.
- `docs/DEVELOPMENT_WORKFLOW.md` defines the AI-native delivery process.
- `.github/instructions/` contains repository-wide Copilot instructions.
- `.github/skills/` contains reusable skill guidance for domain-specific work.
- `.github/agents/` contains role-specific agent definitions.

These files should be kept consistent so future agents can understand the project without re-deriving the workflow each time.
