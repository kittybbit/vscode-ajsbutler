# TASKS: flow-layout-determinism

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
  deterministic expanded-flow layout and fit-to-view follow-up implementation
  are complete.
- Active slice:
  none.
- Open follow-up:
  watch for real-world nested layout examples that need additional collision or
  refit coverage.

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
- [x] Record human approval for runtime implementation of deterministic
      expanded-flow layout.
- [x] Add `LayoutBox`, `LayoutItem`, and occupied-box calculation in the
      approved implementation slice.
- [x] Remove `activeExpandedUnitId`-dependent collision resolution in the
      approved implementation slice.
- [x] Add container-level collision resolution for sibling subtree occupied
      boxes in the approved implementation slice.
- [x] Move subtrees by one delta so descendant relative positions remain
      stable in the approved implementation slice.
- [x] Add regression tests for order-independent layout, panel/node
      non-overlap, and minimal right/down collision push in the approved
      implementation slice.
- [x] Record human approval for the fit-to-view follow-up slice.
- [x] Include expanded nested panel bounds when the flow viewer refits after
      expansion.
- [x] Add regression coverage for manual fit-to-view after nested expansion.

## Validation

- [x] Add or update tests where a slice changes behavior or ownership.
- [x] README update not required; behavior contract is covered by the
      flow-graph use case and this feature spec.
- [x] Run relevant validation for the approved slice.

## Notes

- This feature intentionally changes the documented layout contract while
  preserving search, reveal, and fitView behavior.
