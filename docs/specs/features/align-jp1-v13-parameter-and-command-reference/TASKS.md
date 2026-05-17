# TASKS: align-jp1-v13-parameter-and-command-reference

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
  the latest approved runtime slice, grouped shared wait-job
  `eventTimeoutAction` default projection, is delivered and validated.
- Schedule-rule status:
  `sd` year-range diagnostics are settled for this feature with the fixed
  default `SCHEDULELIMIT=2036`; site-specific override support is outside this
  feature scope.
- Feature status:
  this feature is re-scoped as complete for the current repository-supported
  JP1/AJS v13 alignment scope. Remaining platform-specific,
  environment-specific, and broader cross-parameter topics are excluded from
  this feature.
  Investigation also confirmed that no additional runtime slice remains here
  for work that shares a manual-backed rule family, uses an existing shared
  seam, and closes under repository-supported interpretation.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Sync the delivered wait-job `eventTimeoutAction` slice into feature and
      repository-level SDD documents.
- [x] Settle schedule-rule year validation for this feature with fixed
      `SCHEDULELIMIT=2036`.
- [x] Re-scope the remaining backlog out of the active feature where it no
      longer forms a user-meaningful shared alignment slice.
- [x] Close this feature for the current repository-supported scope.
- [ ] If desired, perform docs-only closure cleanup such as removing stale
      unresolved wording or compressing/replacing the feature folder once its
      durable decisions are preserved elsewhere.

## Validation

- [x] Docs-only quality check completed for the current SDD refresh.
- [x] Docs-only markdown lint completed for the current SDD refresh.

## Notes

- Use `PARAMETER_COVERAGE_MATRIX.md` for current category status.
- Use `SPECS.md` for durable boundary decisions and backlog framing.
- Open future work should start as a separate feature or follow-up slice, not
  by re-opening this completed feature by default.
