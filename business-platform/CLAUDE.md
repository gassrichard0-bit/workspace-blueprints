# Business Platform

This workspace is for designing and building the platform that will run the business: strategy, product definition, software implementation, and business operations.

## Folder Structure

```text
business-platform/
├── CLAUDE.md
├── CONTEXT.md
├── strategy/
│   ├── CONTEXT.md
│   ├── docs/
│   ├── vision/
│   └── roadmap/
├── product/
│   ├── CONTEXT.md
│   ├── docs/
│   └── workflows/
│       ├── 01-briefs/
│       ├── 02-specs/
│       ├── 03-builds/
│       └── 04-output/
├── platform/
│   ├── CONTEXT.md
│   ├── docs/
│   ├── src/
│   └── tests/
└── operations/
    ├── CONTEXT.md
    ├── docs/
    ├── sops/
    └── templates/
```

## Quick Navigation

| Want to... | Go here |
|------------|---------|
| Define the business model or platform vision | `strategy/CONTEXT.md` |
| Turn an idea into a product requirement | `product/CONTEXT.md` |
| Build software for the platform | `platform/CONTEXT.md` |
| Design workflows, SOPs, and internal operations | `operations/CONTEXT.md` |

## Cross-Workspace Flow

```text
strategy (business goals, offer design, priorities)
    ↓
product (briefs, specs, feature decisions)
    ↓
platform (implementation)
    ↓
operations (real business workflow adoption, SOPs, templates, feedback)

operations feedback loops back into strategy and product.
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Vision doc | `[topic]-vision.md` | `business-platform-vision.md` |
| Roadmap item | `[quarter]-[initiative].md` | `2026-q2-client-portal.md` |
| Product brief | `[slug].md` | `client-operating-system.md` |
| Product spec | `[slug]-spec.md` | `client-operating-system-spec.md` |
| Build folder | `[slug]/` | `client-operating-system/` |
| SOP | `[team]-[process].md` | `sales-lead-intake.md` |
| Template | `[purpose]-template.md` | `client-onboarding-template.md` |

## File Placement Rules

- Strategy concepts live in `strategy/vision/`.
- Business reference docs live in `strategy/docs/`.
- Product ideas start in `product/workflows/01-briefs/`.
- Approved specs live in `product/workflows/02-specs/`.
- Active software work lives in `product/workflows/03-builds/` and `platform/src/`.
- Finalized implementation artifacts or handoff docs live in `product/workflows/04-output/`.
- Operating procedures live in `operations/sops/`.
- Reusable business documents live in `operations/templates/`.

## Skills & Tools Overview

| Tool | Used In |
|------|---------|
| Web Search | strategy research, product validation |
| documents / docx | operations templates, formal documents |
| presentations / pptx | sales decks, planning decks |
| spreadsheets / xlsx | metrics, planning models, operations trackers |
| browser tools | testing the platform once UI exists |

Keep this file lean. Detailed instructions live in each workspace `CONTEXT.md`.
