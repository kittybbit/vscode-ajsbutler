---
name: sdd-review-plan
description: Use when reviewing a prepared vscode-ajsbutler SDD feature implementation plan before human approval or implementation, especially to assess implementation-slice granularity, slice ordering, dependencies, cohesion, independence, cross-slice architectural consistency, approval boundaries, impact investigation, TRACEABILITY.md quality, traceability to SPECS/TASKS/use cases, production readiness outlook, acceptance criteria, validation plans, and whether replanning is required. This review skill does not create plans, approve work, or edit runtime code.
---

# sdd-review-plan

## Purpose

Review a prepared feature implementation plan before human approval and
implementation. Use this skill after `sdd-plan-task` creates or revises the
full slice plan, and before `sdd-implement-task` implements any slice.

## Minimum Context

Read first:

1. `AGENTS.md`, `docs/specs/README.md`, and `docs/specs/plans.md`
2. the active feature's `SPECS.md` and `TASKS.md`

Read only when needed:

- related use cases for observable behavior contracts
- `TRACEABILITY.md` when the feature requires it
- concrete code references needed to verify a plan claim

Inspect referenced code symbols, components, adapters, commands, tests, or docs
only enough to validate the plan's claims. Do not edit runtime code, tests,
generated artifacts, configuration, or implementation branches.

## Review Criteria

Evaluate at least these dimensions:

- Value: every slice has one user-visible value, domain meaning, or
  architecture responsibility
- Cohesion: each slice groups files and components around one coherent intent
- Independence: each slice can be approved, implemented, reviewed, validated,
  and committed independently
- Testability: acceptance criteria and validation can prove each slice
- Approval Boundary: in-scope and out-of-scope work are explicit for each
  slice and for the feature plan
- Risk: desktop/web compatibility, VS Code compatibility, JP1/AJS definition
  compatibility, parser/UI boundary, and telemetry risks are addressed
- Traceability: required `TRACEABILITY.md` maps use cases, requirements,
  `SPECS.md` sections, implementation slices, and tests or validation plans
- Production Readiness: failure modes, diagnostics, JP1/AJS compatibility,
  large or malformed input risk, desktop/web readiness, README/docs impact,
  and CHANGELOG impact can be evaluated using `docs/specs/README.md`
- Quality Evidence: code slices name the required qlty result and distinguish
  actionable new smells from metrics-only review signals
- Cross-Slice Architectural Consistency: naming, DTOs, view models, entities,
  public interfaces, layer responsibilities, dependencies, and architecture
  boundaries remain consistent across the whole feature

## Review Workflow

1. Identify the active feature and full implementation-slice plan from
   `TASKS.md`.
2. Check whether the plan covers the feature requirements and acceptance
   criteria without unrelated scope.
3. Evaluate slice granularity:
   - propose merging slices that are too small
   - propose splitting slices that are too large
   - propose moving slices when ordering or dependency direction is wrong
4. Evaluate cross-slice architectural consistency:
   - naming conventions are consistent
   - DTO, ViewModel, and Entity responsibilities align
   - layer responsibilities stay consistent
   - public interfaces are coherent across slices
   - slice dependencies are justified and ordered correctly
   - architecture boundaries hold across the whole feature
5. Confirm each slice records:
   - scope
   - user/domain value or architecture responsibility
   - cohesive change group
   - acceptance
   - validation
   - traceability to use case or requirement
   - production readiness risks and validation
   - approval boundary
   - dependencies
   - risks
   - out of scope
6. Check impact investigation coverage:
   - affected files, symbols, commands, components, docs, and tests
   - desktop and web extension impact
   - failure mode validation plan
   - parser, application, presentation, infrastructure, and telemetry
     boundaries
   - JP1/AJS command/config reference impact
   - definition-file compatibility risk
   - large or malformed input validation need
   - README or user docs impact
   - CHANGELOG update need using `docs/specs/README.md`
   - undocumented behavior or assumptions
   - breaking-change and VS Code compatibility risk
7. Check traceability artifact quality:
   - required `TRACEABILITY.md` exists or has a clear not-required reason
   - slices map to use cases or requirements
   - slices map to `SPECS.md` requirements or acceptance criteria
   - tests or validation plans are explicit
   - unnecessary traceability records are not created for trivial work
8. Repeat review recommendations until the plan is ready for human approval,
   or clearly report why it remains blocked.
9. Report findings without rewriting the plan unless the user explicitly asks
   for edits.

## Sizing Rules

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

## Output

Report:

```md
## Plan Review

- Verdict: Ready for approval | Needs revision | Split recommended | Replan required
- Value:
- Cohesion:
- Independence:
- Testability:
- Approval Boundary:
- Risk:
- Traceability:
- Production Readiness:
- Cross-Slice Architectural Consistency:

## Slice Review

- Slice:
  - Verdict:
  - Notes:

## Findings

- ...

## Recommended Changes

- Merge:
- Split:
- Reorder:
- Add validation:
- Adjust approval boundary:
- Update traceability:
- Adjust production readiness:

## Next Step

If ready, request human approval for the reviewed plan. Use
`sdd-implement-task` only after `TASKS.md` records the approved plan and
approved slice scope.
```

## Rules

- Do not implement the plan.
- Do not approve on behalf of the user.
- Do not broaden scope silently.
- Prefer concrete revision recommendations over vague critique.
- Preserve desktop and web extension compatibility expectations.
- Preserve `engines.vscode` unless explicitly approved.
- Keep the review focused on plan quality, not code style.
- Send unclear or changed scope back to `sdd-plan-task`.
- Use `docs/specs/README.md` as the Single Source of Truth for CHANGELOG
  update criteria and trivial-change classification.
