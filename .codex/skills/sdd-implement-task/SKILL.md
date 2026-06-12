---
name: sdd-implement-task
description: Use when implementing an approved vscode-ajsbutler SDD task from docs/specs/features/<feature>/TASKS.md, including confirming approved scope, completing code and tests, running three independent self-reviews, applying review fixes, updating TASKS.md after human completion approval, committing the work, and confirming a clean workspace.
---

# sdd-implement-task

## Purpose

Implement one approved task from feature `TASKS.md`, validate it, review it
independently three times, apply necessary fixes, and finish with a commit and
clean workspace after human completion approval.

## Preconditions

Read these first:

1. `AGENTS.md`
2. `package.json`
3. `docs/specs/README.md`
4. `docs/specs/plans.md`
5. the relevant feature `SPECS.md`
6. the relevant feature `TASKS.md`
7. the relevant use-case files under `docs/requirements/use-cases/`

Implementation may start only when feature `TASKS.md` records:

```md
## Human Approval

- Status: Approved
- Approved at: <approval result>
- Approved scope: <human-approved boundary>
```

If approval is missing, stale, ambiguous, or narrower than the required work,
stop and use `sdd-plan-task` to refresh investigation and request approval.

## Implementation Workflow

1. Confirm the current task, approved scope, acceptance criteria, validation
   plan, unresolved risks, and use-case back-propagation notes from
   `TASKS.md`.
2. Enumerate affected references before editing:
   - direct files, symbols, commands, components, adapters, tests, and docs
   - desktop and web entry points
   - parser, application, presentation, infrastructure, and telemetry
     boundaries
   - transitive references when a public type, DTO, command, or use case
     changes
3. Implement in small meaningful blocks.
4. Run the closest useful check after each block when practical.
5. Add or update tests when touching parser, list, flow, CSV, adapter,
   diagnostics, hover, telemetry, or user-visible behavior.
6. Stop for re-approval before editing outside the approved scope or making a
   new specification, compatibility, destructive, or design decision.
7. Run the required validation through `rtk` before review.

For code changes, default validation order is:

```bash
rtk pnpm run qlty
rtk pnpm test
rtk pnpm run test:web
rtk pnpm run build
```

For docs-only changes, run `rtk pnpm run qlty`; add `rtk pnpm run lint:md`
when markdown structure or links need focused validation.

## Independent Reviews

After implementation and initial validation, review the work three times.
Each review must be independent:

1. Review pass 1: inspect the final diff against the approved scope,
   acceptance criteria, and architecture rules.
2. Review pass 2: start fresh from `TASKS.md`, related specs, and the final
   diff; do not refer to pass 1 results while finding issues.
3. Review pass 3: start fresh again; do not refer to pass 1 or pass 2 results
   while finding issues.

For each pass, look for:

- behavior regressions
- missing tests or weak validation
- desktop or web compatibility risk
- `engines.vscode` drift or unsupported VS Code API usage
- Node-only assumptions in shared or web paths
- parser internals leaking into UI components
- direct `vscode` imports outside extension, presentation, or infrastructure
  boundaries
- telemetry privacy issues
- out-of-scope changes

After all three passes, merge duplicate findings, apply required fixes, and
rerun the relevant validation.

## Completion Workflow

When implementation, reviews, fixes, and validation are complete:

1. Summarize changed files, validation, compatibility risk, and any remaining
   follow-up.
2. Ask the human to approve task completion before rewriting `TASKS.md` for
   the next decision.
3. After completion approval, update `TASKS.md`:
   - clear the current task
   - reset active approval to `Status: Pending` unless another approved task
     remains active
   - keep only follow-up, risk, validation caveat, and use-case
     back-propagation notes needed for later decisions
   - remove work-log details that no longer affect future decisions
4. Commit the approved work with a focused message.
5. Confirm `git status --short --branch` is clean.

## Rules

- Do not implement without recorded `TASKS.md` approval.
- Do not broaden approved scope silently.
- Preserve `engines.vscode` unless explicitly approved.
- Preserve desktop and web extension behavior.
- Keep domain independent of `vscode`, React, MUI, XyFlow, and webview code.
- Keep UI components consuming DTOs or view models, not parser internals.
- Keep telemetry minimal and free of file content, file paths, and personal
  identifiers.
- Prefer `rtk` for file inspection, search, git, GitHub, package scripts,
  tests, builds, and type checks.
- Use native commands only when `rtk` has no suitable proxy, exact raw output
  is required, or an `rtk` proxy fails.
