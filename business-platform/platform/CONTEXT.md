# Platform

This workspace is where the business platform gets implemented in code and system design.

## What to Load

| Task | Load These | Skip These |
|------|-----------|------------|
| Design architecture | relevant spec from `../product/workflows/02-specs/`, `docs/architecture.md` | strategy docs unless needed |
| Build features | relevant spec, `docs/architecture.md`, `docs/implementation-standards.md` | unrelated ops templates |
| Test behavior | relevant spec, affected source files | strategy and vision docs |

## Folder Structure

```text
platform/
├── CONTEXT.md
├── docs/
├── src/
└── tests/
```

## The Process

1. Read the active spec before implementation.
2. Build only what the current spec requires.
3. Keep architecture and code decisions aligned with platform standards.
4. Test changes before calling work ready.

## Skills & Tools

| Tool | When | Purpose |
|------|------|---------|
| Web Search | Current library or implementation research | Validate current best practices |
| browser tools | Once UI exists | Verify app behavior in the browser |
| spreadsheets / xlsx | Data import/export tasks | Model data transformations if needed |

## What NOT to Do

- Do not build from vision docs alone.
- Do not ignore the product spec.
- Do not introduce major architectural changes without recording them in docs.
