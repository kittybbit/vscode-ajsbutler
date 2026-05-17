# TASKS: qlty-driven-architecture-refactoring

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
  none until approval is granted.
- Open follow-up:
  choose and approve the first refactoring slice, starting from repository
  hygiene before broader structural work.

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
- [x] Qlty check findings analyzed.
- [x] Qlty metrics findings analyzed.
- [x] Qlty smell findings analyzed.
- [ ] Record human approval for the first implementation slice.
- [ ] Complete Slice-0 repository hygiene.
- [ ] Complete Slice-1 flow-viewer complexity work.
- [ ] Complete Slice-2 application orchestration work.
- [ ] Complete Slice-3 domain helper simplification work.

## Validation

- [ ] Add or update tests where a slice changes behavior or ownership.
- [ ] Update README or user documentation if user-facing behavior changes.
- [ ] Run relevant validation for the approved slice.

## Notes

- Highest complexity currently exists in `FlowContents.tsx`.
- `buildExpandedFlowGraph.ts` shows repeated orchestration complexity.
- Domain helpers still contain branch-heavy conditional logic.
