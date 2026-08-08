---
name: sdd-review-plan
description: Review a prepared vscode-ajsbutler SDD implementation-slice plan for value, cohesion, independence, traceability, risk, and production readiness.
---

# SDD Review Plan

## Purpose

Review a prepared feature implementation plan before implementation. The
procedure evaluates the plan and reports a verdict; it does not create a new
plan or edit runtime files.

## Minimum Context

Read first:

1. `AGENTS.md` and `docs/specs/README.md`
2. the selected feature's `SPECS.md` and `TASKS.md`

Read related use cases, `TRACEABILITY.md`, and concrete symbols only when
needed to validate a plan claim. Keep the selected feature fixed and stop if
selection evidence is ambiguous.

## Review Criteria

Evaluate every slice and the plan as a whole for:

- one user-visible value, domain meaning, or architecture responsibility
- cohesive files and components
- independent implementation, review, validation, and commit
- acceptance criteria and validation that can prove the slice
- explicit in-scope, out-of-scope, and approval boundaries
- desktop/web, VS Code, JP1/AJS definition, parser/UI, and telemetry risks
- failure modes, diagnostics, large/malformed input, and production readiness
- README/docs and CHANGELOG impact using the repository SSOT
- complete `TRACEABILITY.md` mappings
- consistent naming, DTO/view-model/entity responsibilities, layers, public
  interfaces, dependencies, and architecture boundaries
- actionable qlty evidence for code slices

## Review Workflow

1. Resolve the selected feature and read the complete implementation plan.
2. Check coverage of requirements and acceptance criteria without unrelated
   scope.
3. Propose merging, splitting, or reordering when slice sizing or dependency
   direction is wrong.
4. Check every slice for scope, value, change group, acceptance, validation,
   traceability, production readiness, dependencies, risks, and out-of-scope
   work.
5. Inspect only the concrete repository references needed to confirm impact.
6. Repeat review after revisions until the plan is ready or clearly blocked.

## Output

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

## Findings

- ...

## Recommended Changes

- ...
```

Use `Ready for approval` only when no actionable finding remains. Send changed
scope or a required plan revision back to the planning procedure.

## Approval-Commit Handoff

`Ready for approval` is not Human Approval and does not authorize a commit.
After explicit Human Approval records the exact plan or replan scope, hand off
to `sdd-commit-gate` with gate type `plan`. Implementation starts only after
that focused planning commit succeeds.

## Rules

- do not broaden scope silently
- prefer concrete, actionable findings
- preserve `engines.vscode` and desktop/web compatibility expectations
- use `docs/specs/README.md` as the SSOT for lifecycle and CHANGELOG policy
