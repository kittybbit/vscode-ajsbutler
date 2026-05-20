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
  Slice-1B-C implementation is complete.
- Active slice:
  none; remaining Slice-1B candidates require separate approval.
- Open follow-up:
  select and approve the next Slice-1B layout complexity target.

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
- [x] Select Slice-1B-A `AjsNode` styling extraction as the next
      implementation candidate.
- [x] Record human approval for Slice-1B-A.
- [x] Complete Slice-1B-A `AjsNode` styling extraction.
- [x] Select Slice-1B-B `Header` presentation extraction as the next
      implementation candidate.
- [x] Record human approval for Slice-1B-B.
- [x] Complete Slice-1B-B `Header` presentation extraction.
- [x] Select Slice-1B-C `FlowSelector` presentation extraction as the next
      implementation candidate.
- [x] Record human approval for Slice-1B-C.
- [x] Complete Slice-1B-C `FlowSelector` presentation extraction.
- [ ] Complete remaining Slice-1B flow-viewer component/layout complexity
      work.
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
- Slice-1B-A targets `AjsNode.tsx` first because `buildNodeSxProps` has high
  Qlty complexity, is presentation-local, and is referenced only by flow node
  components.
- Slice-1B-A kept `buildNodeSxProps` exported from `AjsNode.tsx` and moved the
  visual-state decisions into `nodes/nodeSxProps.ts`.
- `Header`, `FlowSelector`, and `expandedFlowGraphLayout` remain later
  Slice-1B candidates.
- Slice-1B-B targets `Header.tsx` because Qlty reports cognitive complexity
  46 and many returns, it is consumed only by `FlowContents`, and the work can
  stay presentation-local.
- Slice-1B-B must preserve menu toggle, drawer width behavior, expand/collapse
  all behavior, current-scope search submit/clear timing, `Cmd/Ctrl+F` focus,
  breadcrumbs, and current-unit badge semantics.
- Slice-1B-B kept `Header` referenced only by `FlowContents` and extracted
  header presentation decisions into local helpers/subcomponents.
- `FlowSelector` and `expandedFlowGraphLayout` remain later Slice-1B
  candidates.
- Slice-1B-C targets `FlowSelector.tsx` because Qlty reports cognitive
  complexity 38, many returns, and nested `renderUnitEntity` complexity 15; it
  is consumed only by `FlowContents` and can stay presentation-local.
- Slice-1B-C must preserve drawer open/close behavior, ResizeObserver
  drawer-width updates, current-unit selection, ancestor expansion, and
  group/root-jobnet rendering semantics.
- Slice-1B-C kept `FlowSelector` referenced only by `FlowContents` and
  extracted tree rendering, ancestor matching, drawer toolbar, and drawer width
  observation into local helpers/subcomponents.
- `expandedFlowGraphLayout` remains the later high-risk Slice-1B candidate
  because it has higher total complexity and broad layout regression coverage.
- `buildExpandedFlowGraph.ts` shows repeated orchestration complexity.
- Domain helpers still contain branch-heavy conditional logic.
