# Tech Stack Recommendation

This is the recommended first-build stack for the business platform.

## Recommendation

- frontend: Next.js with TypeScript
- UI: React
- styling: Tailwind CSS or a similarly fast utility-first system
- backend: Next.js server routes or server actions for early speed
- database: PostgreSQL
- ORM: Prisma or Drizzle
- auth: simple admin/internal auth first
- deployment: Vercel for app, managed Postgres for database

## Why This Stack

- fast iteration
- one codebase
- strong ecosystem
- straightforward admin-style interface development
- easy path to internal tools and customer-facing surfaces later

## Architectural Guidance

Prefer a modular monolith:

- one app
- one primary database
- clear domain modules inside the codebase

Avoid premature microservices.

## First Domain Modules

- dashboard
- leads
- pipeline
- clients
- onboarding
- delivery
- reporting

## Early Non-Functional Priorities

- reliability of core CRUD flows
- easy schema evolution
- simple audit trail for key updates
- clean internal navigation
