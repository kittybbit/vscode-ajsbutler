---
name: sdd-feature-exit
description: Run the Feature Exit review for one complete vscode-ajsbutler SDD feature, propagate durable knowledge, and prepare closure evidence.
---

# SDD Feature Exit

## Purpose

Evaluate one selected feature after all implementation slices are complete.
Apply the Feature Definition of Done, propagate only durable knowledge, and
prepare a closure recommendation. This procedure does not plan or implement
new work.

## Minimum Context

Read `AGENTS.md`, `docs/specs/README.md`, the selected feature's `SPECS.md`,
`TASKS.md`, and `TRACEABILITY.md`. Read related use cases, `roadmap.md`,
architecture, glossary, README, or CHANGELOG only when feature evidence shows
that durable propagation may be required.

Resolve the selected feature with the repository SSOT and keep it fixed. Stop
when selection, slice state, approval evidence, or comparison base is
ambiguous.

## Feature Exit Review

1. Confirm every implementation slice is `Complete`, has its focused
   completion-approval commit, and its acceptance, validation, traceability,
   production-readiness, and unresolved-risk evidence is present.
2. Apply the Feature Definition of Done in `docs/specs/README.md` as the only
   completion standard.
3. Check that behavior contracts, architecture decisions, terminology,
   routing, and guardrails that must survive the feature folder have a durable
   owner.
4. Apply the Durable Documentation Gate before updating any long-lived
   document. Move only reusable behavior, specification, design policy,
   repository policy, or explicitly owned unfinished work.
5. Evaluate README and CHANGELOG impact using the repository SSOT.
6. Decide whether unfinished repository-level work, ordering, entry conditions,
   or unresolved product concerns changed. Update `roadmap.md` when the
   Durable Documentation Gate is met; otherwise record that no roadmap update
   is required.
7. Confirm no reusable knowledge, unresolved risk, or unfinished repository
   work exists only in the temporary feature folder.
8. Return a new design or scope decision to Main for Planning or Replanning
   routing instead of inventing a resolution during Feature Exit.

## Closure Evidence

Report:

```md
## Feature Exit Review

- Feature:
- Completed slices:
- Acceptance status:
- Validation:
- Traceability:
- Production readiness:
- Durable documentation:
- Roadmap propagation:
- Remaining risks:
- Closure recommendation: Close | Do not close | Human decision needed
```

Use `Close` only when the Feature Definition of Done is satisfied. A complete
review still requires the repository's explicit closure approval before the
selected feature folder is removed.

## Closure Approval Handoff

`Close` is a recommendation, not Closure Approval and not commit
authorization. Return the recommendation and evidence to Main. After explicit
human Closure Approval records the exact durable-document propagation, closure
evidence, and selected feature-folder removal, Main may delegate
`approval-committer` with gate type `closure`. Feature Close follows only after
that focused closure commit succeeds. This procedure does not invoke or spawn
another lifecycle role.

## Rules

- do not modify runtime code, tests, generated artifacts, or configuration
- do not create a new implementation slice or design decision
- update only the smallest durable-document surface that passes the Durable
  Documentation Gate
- preserve inherited feature folders and unrelated roadmap work
- use `rtk` for inspection and validation
