# Feature Tasks: Clarify Unit-List Document Rehydration

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Task

- Status: Proposed
- Scope: no implementation task remains; decide whether to close this
  transient feature.
- Acceptance: confirm no active requirement, unresolved risk, or use-case
  back-propagation remains before removing the feature folder.
- Validation: re-read `plans.md` and `roadmap.md` during feature closure.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the human approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Decision Notes

- `toRootUnits` is private to `unitListDocument.ts`; `toAjsDocument` is the
  documented public rehydration boundary used by both viewers.
- `UnitListDocumentDto`, normalization semantics, production consumers, and
  desktop/web behavior remain unchanged.
- No unresolved implementation or compatibility risk remains.

## Use-Case Back-Propagation

- None. DTO shape, normalization semantics, and observable build-list and
  flow-graph scenarios did not change.
