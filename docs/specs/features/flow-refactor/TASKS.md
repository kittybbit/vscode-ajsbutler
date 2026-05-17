# TASKS: flow-refactor

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
  investigation is recorded, but implementation has not started.
- Active slice:
  PR1 `tests only` characterization coverage for diagnostics and expanded flow
  behavior, pending approval.
- Open follow-up:
  request approval for PR1, then keep the remaining structural refactor slices
  in the agreed PR order.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Impact investigation completed and recorded in PLANS/SPECS/TASKS by
      responsibility.
- [ ] Record human approval for PR1 `tests only`.
- [ ] Add characterization coverage for syntax diagnostics using existing
      sample definitions and snapshot or equivalent fixed expectations for
      message, line, column, and count.
- [ ] Add expanded-flow coverage for no expansion, one-level expansion,
      multi-level expansion, upper/lower panel interference, and duplicate
      edge prevention.
- [ ] Complete PR2 diagnostics rule-set extraction after PR1 lands.
- [ ] Complete PR3 expanded-flow graph/layout extraction after PR2 lands.
- [ ] Complete PR4 `FlowContents.tsx` hook/presentation extraction after PR3
      lands.
- [ ] Complete PR5 cleanup, naming review, and unnecessary export reduction
      after PR4 lands.

## Validation

- [ ] Add or update tests where a slice changes behavior or ownership.
- [ ] Update README or user documentation if user-facing behavior changes.
- [ ] Run relevant validation for the approved slice.

## Notes

- This feature is repository-native refactoring work and does not add a new
  repository-level behavior contract.
- Related behavior contracts remain in the existing editor-feedback and
  flow-graph use cases.
