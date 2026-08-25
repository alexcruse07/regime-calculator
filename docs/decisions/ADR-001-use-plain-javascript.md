# ADR-001: Use Plain JavaScript

## Status

Accepted

## Decision

Use HTML, CSS and modern JavaScript instead of React.

## Context

The application is a static tax calculator.

The initial application does not require:

- complex state management
- routing
- server-side rendering
- large component architecture

## Reason

Plain JavaScript keeps the application simple and allows
the project to focus on tax calculation architecture and
AI-assisted development.

## Consequences

Positive:

- No framework dependency
- Simple static deployment
- Easy S3 deployment
- Smaller application

Negative:

- UI component architecture must be maintained manually
- Large future UI changes may require reconsideration

## Date

2026-08-23
