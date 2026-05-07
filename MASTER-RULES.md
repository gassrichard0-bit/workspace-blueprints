# Master Rules for Agent-Native Workspaces

This document is the operating standard for how we design projects so an AI agent can enter, understand the work quickly, and produce consistent output without needing the full business explained again every time.

The goal is not "better file organization." The goal is better context delivery, cleaner routing, stronger handoffs, and more reliable execution.

## Core Principle

The workspace is a system for controlling:

- what the agent sees
- when it sees it
- what it ignores
- what tools it should use
- where work should go next

If the structure is good, the agent performs better with less prompting.

## The 3-Layer Architecture

Every serious project should use these three layers.

### 1. `CLAUDE.md` = The Map

This file is always loaded. It must stay lean.

It should contain:

- the top-level folder structure
- quick task-to-workspace navigation
- naming conventions
- file placement rules
- cross-workspace flow
- a high-level list of available skills and tools

It should not contain:

- detailed workflow instructions
- long process explanations
- voice guides
- design systems
- deep technical standards
- anything that only matters in one workspace

Rule: if it does not apply across the whole project, it probably does not belong in `CLAUDE.md`.

### 2. Root `CONTEXT.md` = The Router

This file routes the agent to the correct workspace.

It should answer:

- what kind of task is this
- where should the agent go
- what extra cross-workspace files should also be loaded

It should be short and operational. It is not a second map and not a detailed guide.

### 3. Workspace `CONTEXT.md` = The Operating Instructions

Each workspace gets its own `CONTEXT.md`.

This is where the real instructions live:

- what this workspace is for
- what to load for each task
- what to skip
- folder structure for this workspace only
- how work happens here
- what tools or skills trigger here
- what not to do

Rule: each workspace should be self-contained enough that an agent can work there without reading the entire project.

## Workspaces Must Represent Work, Not Storage

Do not create workspaces based on vague storage categories.

Bad examples:

- `assets/`
- `misc/`
- `stuff/`
- `resources/`

Better examples:

- `writing/`
- `production/`
- `distribution/`
- `planning/`
- `engineering/`
- `client-delivery/`
- `research/`

Rule: a workspace should represent a distinct type of work that needs its own context.

## Context Is a Budget

The system must deliberately control what the agent loads.

Every workspace `CONTEXT.md` should include a `What to Load` table with:

- task
- load these
- skip these

The skip column is mandatory. It is one of the most important parts of the system.

Reason:

- loading the right files helps quality
- not loading the wrong files prevents confusion and wasted tokens

Rule: never tell the agent to "load everything just in case."

## Docs and Workflow Are Not the Same

Stable knowledge belongs in `docs/`.
Moving work belongs in workflow folders.

Examples of stable knowledge:

- voice guide
- style guide
- audience notes
- design system
- tech standards
- platform rules
- component library

Examples of moving work:

- briefs
- drafts
- specs
- builds
- output files
- deliverables

Rule: if the information should stay stable across many tasks, it belongs in `docs/`, not in `CONTEXT.md`.

## Naming Conventions Are State Tracking

File names and folder placement should communicate progress.

Examples:

- `topic-draft.md`
- `topic-review.md`
- `topic-final.md`
- `project-spec.md`
- `2026-04-25-newsletter.md`
- `twitter-launch-post.md`

Pipeline example:

- `01-briefs/`
- `02-specs/`
- `03-builds/`
- `04-output/`

Rule: someone should be able to glance at the workspace and understand the current state of work.

## Cross-Workspace Flow Must Be Explicit

If work moves from one workspace to another, that handoff must be documented.

Example:

- writing creates final drafts
- production receives those drafts as briefs
- community repurposes writing and production outputs

Each side should know the handoff:

- upstream workspace says where output goes next
- downstream workspace says where input comes from

Rule: if a handoff exists in reality, it must exist in the workspace instructions.

## Specs Are Contracts

When using a staged pipeline, the spec should define:

- what is being built
- what done looks like
- scope
- constraints
- dependencies
- acceptance criteria

The spec should not define:

- every implementation detail
- line-by-line code
- unnecessary pixel-level instructions unless truly required

Rule: the spec defines the contract; the builder keeps creative and technical freedom within that contract.

## Skills and Tools Must Have Triggers

A skill is not useful just because it exists.

Skills and tools must be wired into the workflow with clear trigger conditions.

Good trigger examples:

- before any draft moves to `final/`
- when creating an event deck
- during spec creation when current documentation is needed
- before anything moves to output

Bad trigger examples:

- available if needed
- optional tools
- can be used here

Rule: every important skill should have a clear "when to use it" condition.

## The Main Trigger Patterns

We should use the trigger pattern that matches the workspace.

### 1. Stage-Specific

Use when the workspace has a pipeline.

Examples:

- research tools during spec stage
- build tools during implementation stage
- testing tools before output stage

### 2. Format-Specific

Use when one workspace creates multiple output formats.

Examples:

- `/pptx` for slide decks
- `/pdf` for downloadable guides
- `/humanizer` for public-facing written content

### 3. Always-On Reference

Use when a file or tool should be loaded for nearly every task in a workspace.

Examples:

- `voice.md` for all writing
- `tech-standards.md` for all engineering work

### 4. Cross-Workspace Skill

Use when the same tool is triggered differently in multiple workspaces.

Example:

- `/humanizer` before final in writing
- `/humanizer` before publish in community

Rule: tools should feel embedded in the workflow, not bolted on afterward.

## MCPs Follow the Same Rule

MCPs are capabilities, not just references.

They should be wired into specific moments such as:

- web search during research
- documentation lookup during specs
- browser testing during verification
- document generation when creating artifacts

Rule: do not expose MCPs as a generic tool list without telling the agent when to use them.

## Recommended Workspace `CONTEXT.md` Structure

Every workspace `CONTEXT.md` should usually include:

1. `What This Workspace Is`
2. `What to Load`
3. `Folder Structure`
4. `The Process`
5. `Skills & Tools`
6. `What NOT to Do`

Guidelines:

- too short means missing context
- too long means reference material is leaking into routing

Target size:

- about 25 to 80 lines of real content

Rule: `CONTEXT.md` should route and operationalize, not become an encyclopedia.

## Recommended Root `CLAUDE.md` Structure

The root `CLAUDE.md` should usually include:

1. what the project is
2. top-level folder structure
3. quick navigation table
4. cross-workspace flow
5. naming conventions
6. file placement rules
7. high-level skills and tools map

Guideline:

- keep it compact enough that it deserves to be always loaded

## The Two Main Workspace Shapes

There are two major patterns we should use.

### Pipeline Workspace

Use when work moves through clear stages.

Example:

- brief
- spec
- build
- output

Best for:

- production
- engineering delivery
- formal client work
- sequential review systems

### Multi-Format Hub

Use when one source becomes many output types.

Example:

- newsletter
- social post
- event deck
- template

Best for:

- distribution
- community
- repurposing content
- publishing systems

Rule: not every workspace needs a strict pipeline.

## Start Minimal, Then Earn Complexity

Do not overbuild the system before doing real work.

Start with:

- one `CLAUDE.md`
- one root `CONTEXT.md`
- one or two workspaces
- one or two important docs
- one or two wired skills

Then improve based on failures.

If the agent repeatedly:

- writes in the wrong voice
- puts files in the wrong place
- loads too much
- skips an important tool
- misses a handoff

that is a signal to improve the workspace design.

Rule: fix routing and documentation before blaming the agent.

## Common Mistakes We Must Avoid

### Giant `CLAUDE.md`

Problem:

- wastes tokens in every conversation
- buries the important map under too much detail

Fix:

- keep `CLAUDE.md` to global rules only

### No Skip Column

Problem:

- the agent over-loads context

Fix:

- explicitly state what not to read for each task

### Skills Listed Without Triggers

Problem:

- tools exist but do not become part of execution

Fix:

- wire each key tool to a stage, format, or gate

### `CONTEXT.md` Becoming a Reference Library

Problem:

- slow to read
- hard to route from

Fix:

- move stable knowledge into `docs/`

### Missing Handoffs

Problem:

- outputs get lost
- downstream work duplicates upstream work

Fix:

- define handoff rules in both connected workspaces

### Building Too Much Too Early

Problem:

- lots of theoretical structure
- weak practical usefulness

Fix:

- begin small and evolve from real usage

## Our Default Build Rules Going Forward

Unless there is a strong reason to do otherwise, future projects should follow these defaults:

- create a lean root `CLAUDE.md`
- create a short root `CONTEXT.md`
- split major types of work into separate workspaces
- give each workspace its own `CONTEXT.md`
- keep stable guidance in `docs/`
- keep active work in dedicated workflow folders
- define naming conventions that reveal status
- document cross-workspace handoffs
- wire tools to moments, not just locations
- avoid giant global instruction files

## Final Standard

A good agent-native workspace should let an agent:

- identify the task quickly
- route itself to the correct workspace
- load only the right files
- use the correct tools at the correct moment
- place output in the correct location
- hand work off cleanly to the next stage

If the workspace does that, the system is working.
If it does not, the structure needs improvement.
