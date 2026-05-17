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
  investigation is recorded, but implementation has not started.
- Active slice:
  docs-only specification update for deterministic expanded-flow layout.
- Open follow-up:
  request implementation approval after the deterministic layout scope and
  test expectations are accepted.

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
- [ ] Record human approval for runtime implementation of deterministic
      expanded-flow layout.
- [ ] Add `LayoutBox`, `LayoutItem`, and occupied-box calculation in the
      approved implementation slice.
- [ ] Remove `activeExpandedUnitId`-dependent collision resolution in the
      approved implementation slice.
- [ ] Add container-level collision resolution for sibling subtree occupied
      boxes in the approved implementation slice.
- [ ] Move subtrees by one delta so descendant relative positions remain
      stable in the approved implementation slice.
- [ ] Add regression tests for order-independent layout, panel/node
      non-overlap, and minimal right/down collision push in the approved
      implementation slice.

## Validation

- [ ] Add or update tests where a slice changes behavior or ownership.
- [ ] Update README or user documentation if user-facing behavior changes.
- [ ] Run relevant validation for the approved slice.

## Notes

- This feature intentionally changes the documented layout contract while
  preserving search, reveal, and fitView behavior.
