# Architecture

This document captures the current conceptual architecture for the business platform.

## Product Shape

The platform should be built as one coherent application with modular areas:

- dashboard
- CRM
- pipeline
- clients
- onboarding
- delivery
- reporting
- SOP/library access

## Early Architecture Bias

Prefer a simple modular monolith for the first version unless a stronger reason emerges.

Why:

- faster iteration
- easier operational overhead
- one source of truth
- lower integration complexity early on

## Core Domain Objects

- lead
- opportunity
- client
- onboarding item
- service engagement
- deliverable
- task
- note
- user

## Integration Direction

Likely future integrations:

- email
- calendar
- forms
- file storage
- payments or invoicing

Integrations should be layered in after the internal operating flow is clear.
