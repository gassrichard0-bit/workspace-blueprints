# Operations

This workspace translates the platform into real business process: SOPs, templates, operating rules, and team usage.

## What to Load

| Task | Load These | Skip These |
|------|-----------|------------|
| Write an SOP | `docs/operating-model.md`, relevant files in `sops/` | platform implementation docs |
| Create a business template | `docs/operating-model.md`, relevant templates | technical architecture |
| Define workflow adoption rules | `docs/operating-model.md`, relevant strategy docs | low-level source code |

## Folder Structure

```text
operations/
├── CONTEXT.md
├── docs/
├── sops/
└── templates/
```

## The Process

1. Identify the real-world workflow that must run consistently.
2. Define the SOP or template.
3. Make sure the platform can support that workflow.
4. Feed operational gaps back to product and strategy.

## Skills & Tools

| Tool | When | Purpose |
|------|------|---------|
| documents / docx | Formal SOPs or handbooks | Generate polished operational documents |
| spreadsheets / xlsx | Track metrics or process adherence | Create trackers and scorecards |
| presentations / pptx | Training or team rollout | Turn operations into teaching material |

## What NOT to Do

- Do not write vague SOPs with no owner or trigger.
- Do not define processes that the platform cannot support.
- Do not duplicate product specs here.
