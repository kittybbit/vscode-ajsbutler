---
name: sdd-plan-task
description: Use when creating or revising the full implementation-slice plan for an active vscode-ajsbutler SDD feature, including mode-selecting Planning/Replanning/Feature Exit work, decomposing the feature into approval-ready implementation slices, ordering dependencies, updating feature TASKS.md and TRACEABILITY.md, deciding whether replanning is required, performing Feature Exit Review, applying the Feature Definition of Done, moving durable completed feature knowledge into use cases or other long-lived docs, removing completed feature docs, or proposing the next feature from roadmap.md and plans.md. This planning skill stops before runtime code, tests, generated artifacts, or configuration changes.
---

# sdd-plan-task

## Purpose

Create or revise the full implementation plan for one active SDD feature, or
run Feature Exit when implementation is complete. Use exactly one explicit
mode per run: Planning Mode, Replanning Mode, or Feature Exit Mode.

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

## SDD Workflow

Default flow:

```md
sdd-create-feature -> sdd-plan-task -> sdd-review-plan -> Human Approval -> sdd-implement-task -> sdd-implement-task -> Feature Complete
```

Do not return to `sdd-plan-task` during normal implementation progress.
Replan only when:

- a new implementation slice is needed
- scope changes
- a new design decision is needed
- the approval boundary changes
- the impact is wider than planned
- feature completion must be evaluated

## Mode Selection

Use this skill in exactly one mode:

- Planning Mode: create the initial feature implementation-slice plan
- Replanning Mode: revise the implementation-slice plan after a discovered gap
- Feature Exit Mode: apply the Feature Definition of Done and prepare closure

Do not mix Planning Mode, Replanning Mode, and Feature Exit Mode in one run.

## Planning Mode

Use Planning Mode to create the initial full feature implementation plan.

1. Identify the active feature from the user request, `docs/specs/plans.md`,
   or feature folders under `docs/specs/features/`.
2. Compare feature `SPECS.md`, feature `TASKS.md`, related use cases,
   `roadmap.md`, and `plans.md`.
3. Decompose the whole feature into implementation slices that cover the
   feature-level requirements and acceptance criteria.
4. Order slices by dependency and value. Prefer early slices that reduce
   uncertainty, confirm boundary decisions, or unlock later implementation.
5. Investigate impact enough to make each slice concrete:
   - affected files, symbols, commands, components, docs, and tests
   - desktop and web extension impact
   - failure modes and user-facing error or diagnostic behavior
   - parser, application, presentation, infrastructure, and telemetry
     boundaries
   - JP1/AJS command/config reference impact
   - definition-file compatibility risk
   - large or malformed input risk
   - README or user docs impact
   - CHANGELOG update need using `docs/specs/README.md`
   - undocumented behavior or assumption
   - changed, added, or removed behavior scenarios when scenarios exist
   - breaking-change and VS Code compatibility risk
6. Update feature `TASKS.md` with the full implementation-slice plan,
   dependency order, approval boundaries, validation methods, risks, and
   out-of-scope changes.
7. Create or update `TRACEABILITY.md` when required.
8. Keep feature `SPECS.md` focused on feature-level functional requirements,
   compatibility requirements, acceptance criteria, and non-goals.
9. Update `docs/specs/plans.md` only when the active feature set, branch-wide
   assumptions, or repository sequencing changes.
10. Update `docs/specs/roadmap.md` only when repository-level ordering,
    remaining debt, or deferred work changes.
11. Hand off the completed plan to `sdd-review-plan` before implementation
    approval.

## Replanning Mode

Use Replanning Mode only after implementation or review discovers a gap.

1. Identify the approved plan, affected slice, and discovered gap.
2. Record why the current plan cannot continue unchanged.
3. Revise the smallest necessary part of the implementation-slice plan.
4. Update slice dependencies, approval boundaries, validation, production
   readiness risks, and traceability only where the gap affects them.
5. Preserve completed slices and unrelated approved slices.
6. Send the revised plan to `sdd-review-plan` when slice boundaries,
   dependencies, production readiness, or approval boundaries changed.

Do not use Replanning Mode to redesign the whole feature unless the discovered
gap invalidates the whole plan.

## Feature Exit Mode

Use Feature Exit Mode only when implementation slices appear complete.

1. Run the Feature Exit Review.
2. Apply the Feature Definition of Done as the only completion standard.
3. Confirm required `TRACEABILITY.md` updates are complete.
4. Apply the Durable Documentation Gate before updating long-lived docs.
5. Summarize evidence from `SPECS.md`, `TASKS.md`, `TRACEABILITY.md` when
   present, use cases, plans, and roadmap.
6. Report the Feature Exit Review using the standard output template in
   `docs/specs/README.md`.
7. Ask for explicit approval to close the feature.
8. After approval, close the feature as described below.

Do not perform Planning Mode or Replanning Mode work during Feature Exit Mode.

## Smallest Useful Implementation Slice

A task is not required to minimize edit volume. It must be the smallest useful
implementation slice.

A slice must satisfy one of:

- one user value
- one domain meaning
- one architecture responsibility

A slice must also be independently:

- reviewable
- testable
- committable
- approvable

Slices may touch multiple files when those files must change together to
deliver the value, domain meaning, or architecture responsibility.

Do not split a slice by file, layer, or mechanical edit when the resulting
pieces cannot be validated meaningfully or do not provide standalone value.

## Planning Gate

Before updating `TASKS.md`, explicitly establish:

- active feature folder
- feature-level requirements and acceptance criteria covered by the plan
- implementation slice list
- implementation order
- slice dependencies
- why each slice is the smallest useful slice
- user-visible, domain, or architecture value for each slice
- cohesive component group for each slice
- approval boundary for each slice
- validation method for each slice
- traceability mapping for each slice:
  - corresponding use case or requirement
  - `SPECS.md` requirement or acceptance criterion
  - test file or validation plan
- production readiness for each slice:
  - failure mode
  - JP1/AJS compatibility
  - large or malformed input risk
  - desktop/web impact
  - README or user docs impact
  - CHANGELOG update need using `docs/specs/README.md`
- risks and unresolved assumptions
- out-of-scope changes

## Slice Sizing Rules

A slice is too small when:

- it only changes one file but cannot be validated alone
- it leaves the feature in a knowingly broken or unusable intermediate state
- it separates tests from the behavior they prove
- it splits tightly coupled components that must be reviewed together
- it is only a layer-level or mechanical edit with no standalone value

A slice is too large when:

- it contains multiple independent user outcomes
- it mixes unrelated refactors with behavior changes
- it changes parser, UI, export, telemetry, and docs for different reasons
- it cannot be summarized as one approval boundary
- it cannot be reviewed, tested, committed, or approved independently

## TASKS.md Shape

Keep `TASKS.md` focused on the feature's implementation-slice plan. Prefer
these sections:

```md
# <Feature> Tasks

## Plan Status

- Status: Proposed | Review Needed | Pending Approval | Approved | In Progress | Replan Required | Complete
- Planning scope:
- Review status:
- Human approval:
- Active implementation slice:

## Implementation Slices

### Slice 1: <name>

- Status: Proposed | Approved | In Progress | Complete | Blocked | Replan Required
- Scope:
- User / Domain Value:
- Cohesive Change Group:
- Acceptance:
- Validation:
- Production Readiness:
  - Failure mode:
  - JP1/AJS compatibility:
  - Large or malformed input risk:
  - Desktop/web impact:
  - README/docs impact:
  - CHANGELOG impact:
- Approval Boundary:
- Dependencies:
- Risks:
- Out of Scope:

## Traceability

- TRACEABILITY.md required: yes | no
- Reason:

## Cross-Slice Dependencies

- ...

## Feature-Level Risks

- ...

## Use-Case Back-Propagation

- ...
```

Remove completed task history once it no longer affects approval, unresolved
risk, validation, or use-case back-propagation. Keep completed slice status and
any remaining dependencies that affect later slices.

## Traceability

Create or update `docs/specs/features/<feature>/TRACEABILITY.md` when the
feature is non-trivial, changes user-visible behavior, affects JP1/AJS
definition-file interpretation or compatibility, splits into multiple slices,
or needs explicit use-case correspondence.

`TRACEABILITY.md` must map:

- Use Case
- Requirement
- `SPECS.md` section
- Implementation Slice
- Test file or validation plan

During Planning Mode and Replanning Mode, ensure each slice states:

- which use case or requirement it supports
- which `SPECS.md` requirement or acceptance criterion it implements
- which test or validation will prove it

During Feature Exit Mode, verify required traceability is updated. Do not
create unnecessary traceability records for minor docs-only or temporary
investigation work.

## No Remaining Feature Tasks

When all planned slices appear complete, switch to Feature Exit Mode:

1. Run the Feature Exit Review.
2. Apply the Feature Definition of Done as the only completion standard.
3. Summarize the evidence from `SPECS.md`, `TASKS.md`, use cases, plans, and
   roadmap.
4. Report the Feature Exit Review using the standard output template in
   `docs/specs/README.md`.
5. Ask for explicit approval to close the feature.
6. Do not remove the feature folder before approval.

## Feature Definition of Done

A feature is complete only when all of these are true:

- every implementation slice is `Complete`
- feature acceptance criteria are satisfied
- feature requirements are satisfied
- required validation is complete
- non-functional quality is preserved or justified
- durable use-case updates are complete
- required `TRACEABILITY.md` updates are complete, or not required with a clear
  reason
- `docs/specs/plans.md` is updated
- `docs/specs/roadmap.md` is updated when repository-level sequencing,
  remaining debt, or deferred work changed
- unresolved risks are resolved, accepted, or recorded as follow-up

Do not close a feature by partial evidence, elapsed effort, or lack of obvious
next tasks. Use this Definition of Done as the sole completion criterion.

## Feature Exit Review

Before closing a feature, verify:

- all implementation slices are complete
- feature acceptance criteria are met
- feature requirements are met
- validation is complete
- non-functional quality is preserved
- unresolved risks are organized
- use-case propagation is complete
- required `TRACEABILITY.md` is updated
- `plans.md` propagation is complete
- `roadmap.md` propagation is complete when needed
- the feature folder can be removed without losing active requirements,
  approval decisions, unresolved risks, or reusable knowledge

Feature Close may happen only after this review passes and the human approves
closure.

## Durable Documentation Gate

Before moving feature knowledge into use cases, `plans.md`, `roadmap.md`,
README, AGENTS, design guides, development guides, or other long-lived docs,
verify the information:

- is reusable beyond this feature
- describes durable behavior, specification, design policy, or repository
  operating policy
- helps future planning or implementation
- does not duplicate another durable document
- is not a temporary investigation result
- is not implementation history
- is not review commentary
- is not a record of a resolved issue

Update only the smallest necessary durable document surface. Leave
feature-specific work notes in feature docs until closure, then remove them
with the feature folder.

After approval to close the feature:

1. Move only knowledge that passes the Durable Documentation Gate into the
   relevant durable docs.
2. Move repository-level sequencing, remaining debt, or deferred work into
   `roadmap.md` or `plans.md` only when it passes the gate.
3. Remove the completed feature folder when it no longer carries active
   requirements, active task decisions, unresolved risk, or useful follow-up.
4. Re-read `roadmap.md` and `plans.md`, then propose the next feature.

## Approval Boundary

This skill may update SDD documents, record investigation, organize
alternatives, and ask for plan review or human approval. It must not edit
runtime code, tests, generated artifacts, configuration, implementation
branches, implementation commits, implementation refactors, or incidental
fixes.

Before handing off to review or approval, report:

```md
## Feature Implementation Plan Summary

- Feature:
- Planning scope:
- Slice count:
- Implementation order:
- Cross-slice dependencies:
- JP1/AJS command/config reference impact:
- Definition-file compatibility risk:
- Undocumented behavior or assumption:
- Desktop/web compatibility risk:
- TRACEABILITY.md required:
- TRACEABILITY.md status:
- Out of scope:

## Slices

- Slice:
  - User / Domain Value:
  - Cohesive Change Group:
  - Approval Boundary:
  - Validation:
  - Traceability:
  - Production Readiness:
  - Dependencies:
  - Risks:

## Next Step

Use `sdd-review-plan` to review the full plan before human approval and
implementation.
```

## Rules

- Preserve `engines.vscode` unless explicitly approved.
- Preserve desktop and web extension behavior.
- Prefer KISS and YAGNI before adding abstractions.
- Document assumptions instead of hiding them.
- Keep use cases and other durable docs concise, reusable, and free of
  implementation history.
- Apply the Durable Documentation Gate before updating long-lived docs.
- Use `docs/specs/README.md` as the Single Source of Truth for Feature Exit
  Review output and CHANGELOG update criteria.
- Plan the feature as a whole; do not plan only the next edit unless
  replanning is explicitly scoped to one discovered gap.
- Do not decompose by file, layer, or mechanical edit without standalone
  value.
- Treat Serena or equivalent semantic tooling as supplemental evidence, not as
  proof that a change is safe.
- Run docs-only validation through `rtk` before finishing; use
  `rtk pnpm run qlty`, and add `rtk pnpm run lint:md` when markdown scope
  benefits from it.
