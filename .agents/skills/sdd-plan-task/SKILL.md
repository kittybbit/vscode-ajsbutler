---
name: sdd-plan-task
description: Create or revise the complete implementation-slice plan for one selected vscode-ajsbutler SDD feature in Planning or Replanning Mode.
---

# SDD Plan Task

## Purpose

Create or revise the full implementation plan for one selected SDD feature.
This procedure stops before runtime code, tests, generated artifacts, and
configuration changes.

Use exactly one mode per run:

- Planning Mode: create the initial implementation-slice plan
- Replanning Mode: revise the smallest affected part after a discovered gap

## Minimum Context

Read first:

1. `AGENTS.md`, `package.json`, and `docs/specs/README.md`
2. the selected feature's `SPECS.md` and `TASKS.md`
3. `docs/specs/roadmap.md` when repository sequencing is relevant

Read related use cases, `TRACEABILITY.md`, and concrete symbols only when
needed to confirm a plan claim. Resolve the selected feature once using the
repository SSOT and do not mix inherited feature state into the plan.

## Planning Mode

1. Confirm the selected feature owns the plan and the current branch's active
   implementation work.
2. Compare `SPECS.md`, `TASKS.md`, related use cases, and `roadmap.md` when
   repository-level sequencing matters.
3. Decompose the whole feature into slices covering every requirement and
   acceptance criterion.
4. Order slices by dependency and value, preferring early uncertainty and
   boundary decisions.
5. Investigate affected files, symbols, commands, components, docs, tests,
   desktop/web impact, failure modes, architecture boundaries, JP1/AJS
   compatibility, malformed-input risk, README/CHANGELOG impact, and
   undocumented assumptions.
6. Update `TASKS.md` with scope, order, dependencies, approval boundaries,
   validation, risks, production readiness, and out-of-scope work.
7. Create or update `TRACEABILITY.md` when required.
8. Keep `SPECS.md` focused on feature-level requirements and acceptance.
9. Update durable docs only when the Durable Documentation Gate is met.

## Replanning Mode

Use only when implementation or review discovers a gap that prevents the
approved plan from continuing unchanged.

1. Identify the approved plan, affected slice, and discovered gap.
2. Record why the current plan cannot continue unchanged.
3. Revise the smallest necessary part of the plan.
4. Update dependencies, approval boundaries, validation, risks, and
   traceability only where the gap reaches them.
5. Preserve completed and unrelated approved slices.
6. Request another plan review when boundaries, dependencies, production
   readiness, or approval scope changed.

Do not use Replanning Mode to redesign the feature unless the discovered gap
invalidates the whole plan.

## Smallest Useful Slice

Each slice must deliver one user value, domain meaning, or architecture
responsibility and be independently reviewable, testable, committable, and
approvable. Do not split tightly coupled work by file or layer when the pieces
have no standalone value.

A slice is too large when it combines independent outcomes or unrelated
refactors. It is too small when it cannot be validated alone or leaves the
feature knowingly broken.

## Planning Gate

Before updating `TASKS.md`, establish:

- selected feature and selection evidence
- requirements and acceptance criteria covered
- slice list, order, and dependencies
- value and cohesive change group for every slice
- explicit approval boundary and out-of-scope work
- validation and traceability for every slice
- production readiness: failure mode, JP1/AJS compatibility, malformed or
  large input risk, desktop/web impact, README/docs, and CHANGELOG impact
- unresolved assumptions and risks

## Approval-Commit Handoff

Plan or Replanning Mode ends before implementation. After the independent plan
review returns `Ready` and the human records `Human Approval: Approved` for the
exact next-slice scope, hand off to `sdd-commit-gate` with gate type `plan`.
The approved planning package must be committed before implementation starts.
Do not stage or commit while Human Approval is pending.

## TASKS.md Shape

Keep `TASKS.md` focused on the current plan:

```md
## Plan Status

- Status:
- Planning scope:
- Review status:
- Human approval:
- Active implementation slice:

## Implementation Slices

### Slice 1: <name>

- Status:
- Scope:
- User / Domain Value:
- Cohesive Change Group:
- Acceptance:
- Validation:
- Production Readiness:
- Approval Boundary:
- Dependencies:
- Risks:
- Out of Scope:
```

Keep completed status and unresolved dependencies that affect later slices;
remove obsolete work-log history.

## Traceability

For a non-trivial or multi-slice feature, map each slice to:

- Use Case or requirement
- `SPECS.md` requirement or acceptance criterion
- test file or validation result

## Durable Documentation Gate

Before updating a long-lived document, confirm the information is reusable
beyond this feature, describes durable behavior or repository policy, helps
future work, is not duplicated, and is not implementation history or review
commentary. Update the smallest necessary durable surface.

## Rules

- preserve `engines.vscode` and desktop/web compatibility expectations
- do not plan only the next edit; plan the feature as a whole
- do not edit runtime code, tests, generated artifacts, configuration, or
  implementation branches in Planning or Replanning Mode
- use `docs/specs/README.md` as the SSOT for approval and lifecycle policy
- use `rtk pnpm run qlty` and `rtk pnpm run lint:md` as appropriate
- return to planning when a new design decision, scope, impact, or approval
  boundary appears
