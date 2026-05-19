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
  PR5 cleanup, naming review, and unnecessary export reduction is implemented
  and validated.
- Active slice:
  none; the five planned `flow-refactor` slices are complete.
- Open follow-up:
  none for the current five-slice flow-refactor plan.

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
- [x] Confirm current entry point is PR1 `tests only`, not a runtime flow
      refactor.
- [x] Record human approval for PR1 `tests only`.
- [x] Add characterization coverage for syntax diagnostics using existing
      sample definitions and snapshot or equivalent fixed expectations for
      message, line, column, and count.
- [x] Add expanded-flow coverage for no expansion, one-level expansion,
      multi-level expansion, upper/lower panel interference, and duplicate
      edge prevention.
- [x] Complete PR2 diagnostics rule-set extraction after PR1 lands.
- [x] Complete PR2 support-module decomposition follow-up.
- [x] Complete PR3 expanded-flow graph/layout extraction after PR2 lands.
- [x] Refresh PR4 impact investigation for `FlowContents.tsx`
      hook/presentation extraction and direct type/import dependents.
- [x] Record human approval for PR4 before creating an implementation branch
      or editing runtime code/tests/configuration.
- [x] Complete PR4 `FlowContents.tsx` hook/presentation extraction after PR3
      lands and PR4 approval is recorded.
- [x] Fix PR4 flow-node display regression where identical name/comment values
      rendered duplicate text below expandable nodes.
- [x] Refresh PR5 impact investigation for cleanup, naming review, and
      unnecessary export reduction.
- [x] Record human approval for PR5 before creating an implementation branch
      or editing runtime code/tests/configuration.
- [x] Complete PR5 cleanup, naming review, and unnecessary export reduction
      after PR4 lands.

## Validation

- [x] Confirm PR1 characterization tests cover the preserved diagnostics
      behavior for PR2.
- [x] Confirm README or user documentation does not need updates because PR2
      changes internal structure only.
- [x] Run relevant validation for the approved slice.
- [x] Confirm PR4 preserved desktop and web flow-viewer build/test paths.
- [x] Confirm duplicate name/comment display regression coverage and
      validation.
- [x] Confirm PR5 cleanup preserved desktop and web flow-viewer build/test
      paths.

## Notes

- This feature is repository-native refactoring work and does not add a new
  repository-level behavior contract.
- Related behavior contracts remain in the existing editor-feedback and
  flow-graph use cases.
