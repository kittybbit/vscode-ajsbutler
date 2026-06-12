---
name: sdd-plan-task
description: Use when choosing the next SDD task for vscode-ajsbutler, investigating an active feature, updating feature TASKS.md, deciding whether a feature has no remaining tasks, moving completed feature notes into use cases, removing completed feature docs, or proposing the next feature from roadmap.md and plans.md. This planning skill stops before runtime code, tests, generated artifacts, or configuration changes.
---

# sdd-plan-task

## Purpose

Decide the next implementation task for an active SDD feature and record only
the planning state needed for the next decision. Use this skill for task
selection, feature completion checks, feature handoff, and repository-level
next-feature proposals.

## Inputs

Read these first:

1. `AGENTS.md`
2. `package.json`
3. `docs/specs/README.md`
4. `docs/specs/plans.md`
5. `docs/specs/roadmap.md`
6. the relevant `docs/specs/features/<feature>/SPECS.md`
7. the relevant `docs/specs/features/<feature>/TASKS.md`
8. the relevant `docs/requirements/use-cases/` files when behavior contracts
   may be affected

Use semantic code navigation from `docs/specs/README.md` only when a concrete
symbol, component, command, adapter, or use case needs impact confirmation.

## Workflow

1. Identify the active feature from the user request, `docs/specs/plans.md`,
   or the feature folders under `docs/specs/features/`.
2. Compare feature `SPECS.md`, feature `TASKS.md`, related use cases,
   `roadmap.md`, and `plans.md`.
3. Decide the smallest useful next task. Prefer a vertical slice that can be
   approved, implemented, reviewed, tested, and committed independently.
4. Investigate impact enough to make the task concrete:
   - affected files, symbols, commands, components, docs, and tests
   - desktop and web extension impact
   - parser, application, presentation, infrastructure, and telemetry
     boundaries
   - changed, added, or removed behavior scenarios when scenarios exist
   - breaking-change and VS Code compatibility risk
5. Update or create feature `TASKS.md` with the current task, approval state,
   unresolved risks, validation expectations, and minimal use-case
   back-propagation notes.
6. Keep feature `SPECS.md` focused on feature-level functional requirements,
   compatibility requirements, acceptance criteria, and non-goals.
7. Update `docs/specs/plans.md` only when the active feature set, branch-wide
   assumptions, or repository sequencing changes.
8. Update `docs/specs/roadmap.md` only when repository-level ordering,
   remaining debt, or deferred work changes.

## No Remaining Feature Tasks

When the active feature appears complete:

1. Report that no next task is apparent inside the feature.
2. Summarize the evidence from `SPECS.md`, `TASKS.md`, use cases, plans, and
   roadmap.
3. Ask for explicit approval to close the feature.
4. Do not remove the feature folder before approval.

After approval to close the feature:

1. Move only durable behavior contracts into the relevant use-case files.
2. Move only repository-level sequencing, remaining debt, or deferred work into
   `roadmap.md` or `plans.md`.
3. Remove the completed feature folder when it no longer carries active
   requirements, active task decisions, unresolved risk, or useful follow-up.
4. Re-read `roadmap.md` and `plans.md`, then propose the next feature.

## TASKS.md Shape

Keep `TASKS.md` short and decision-focused. Prefer these sections:

```md
# <Feature> Tasks

## Current Task

- Status: Proposed | Pending Approval | Approved | In Progress | Blocked
- Scope:
- Acceptance:
- Validation:

## Human Approval

- Status: Pending | Approved
- Approved at:
- Approved scope:

## Decision Notes

- ...

## Use-Case Back-Propagation

- ...
```

Remove completed task history once it no longer affects approval, unresolved
risk, validation, or use-case back-propagation.

## Approval Boundary

This skill may update SDD documents, record investigation, organize
alternatives, and ask for approval. It must not edit runtime code, tests,
generated artifacts, configuration, implementation branches, implementation
commits, implementation refactors, or incidental fixes.

Before handing off to implementation, report:

```md
## Impact Investigation Summary

- Planned change:
- Affected files:
- Affected functions/classes/components:
- Affected features:
- Affected tests:
- Related docs:
- Breaking-change risk:
- Alternatives:

## Approval Request

Please approve implementation before I edit runtime code, tests,
generated artifacts, or configuration.

Implementation will not proceed until approval is given.
```

## Rules

- Preserve `engines.vscode` unless explicitly approved.
- Preserve desktop and web extension behavior.
- Prefer KISS and YAGNI before adding abstractions.
- Document assumptions instead of hiding them.
- Keep use cases durable and feature docs temporary.
- Treat Serena or equivalent semantic tooling as supplemental evidence, not as
  proof that a change is safe.
- Run docs-only validation through `rtk` before finishing; use
  `rtk pnpm run qlty`, and add `rtk pnpm run lint:md` when markdown scope
  benefits from it.
