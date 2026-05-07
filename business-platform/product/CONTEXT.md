# Product

This workspace turns business needs into product briefs, specs, and build-ready definitions.

## What to Load

| Task | Load These | Skip These |
|------|-----------|------------|
| Create a brief | relevant strategy docs, `docs/product-principles.md` | platform source code |
| Create a spec | brief from `workflows/01-briefs/`, `docs/product-principles.md` | unrelated operations docs |
| Review a feature scope | brief or spec in progress | platform implementation details unless required |

## Folder Structure

```text
product/
├── CONTEXT.md
├── docs/
└── workflows/
    ├── 01-briefs/
    ├── 02-specs/
    ├── 03-builds/
    └── 04-output/
```

## The Process

1. Strategy creates or refines a business need.
2. Product writes a brief in `01-briefs/`.
3. Product turns the brief into a spec in `02-specs/`.
4. Approved specs hand off to platform for implementation.
5. Outputs and decisions are stored in `04-output/`.

## Skills & Tools

| Tool | When | Purpose |
|------|------|---------|
| Web Search | Validation or workflow research | Check current patterns and expectations |
| spreadsheets / xlsx | Feature prioritization | Scoring and roadmap analysis |
| documents / docx | Formal requirements packs | Export polished product documents |

## What NOT to Do

- Do not start implementation in product docs.
- Do not skip the brief stage for major features.
- Do not create specs without a clear business outcome.
