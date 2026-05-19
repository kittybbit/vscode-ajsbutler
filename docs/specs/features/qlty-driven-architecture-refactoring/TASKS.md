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
  Slice-1A implementation is complete.
- Active slice:
  none; request approval before starting the next runtime slice.
- Open follow-up:
  choose and approve the next flow-viewer complexity slice.

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
- [x] Select Slice-1A flow-viewer controller responsibility split as the first
      implementation candidate.
- [x] Record human approval for Slice-1A.
- [x] Complete Slice-1A flow-viewer controller responsibility split.
- [ ] Complete Slice-1B flow-viewer component/layout complexity work.
- [ ] Complete Slice-2 application orchestration work.
- [ ] Complete Slice-3 domain helper simplification work.

## Validation

- [x] No test updates required because Slice-1A preserves behavior and keeps
      existing public contracts.
- [x] No README or user documentation update required because user-facing
      behavior is unchanged.
- [x] Run relevant validation for the approved slice.

## Notes

- Current targeted Qlty smell output reports `useFlowViewerController` with
  lower cognitive complexity after Slice-1A.
- Slice-1A kept `useFlowViewerController` referenced only by `FlowContents`
  and split presentation-local state/effects into focused hooks.
- `Header`, `FlowSelector`, `AjsNode`, and `expandedFlowGraphLayout` remain
  later flow-viewer complexity candidates.
- `buildExpandedFlowGraph.ts` shows repeated orchestration complexity.
- Domain helpers still contain branch-heavy conditional logic.
