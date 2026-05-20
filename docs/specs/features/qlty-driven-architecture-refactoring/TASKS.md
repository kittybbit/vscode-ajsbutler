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
  Slice-1B-H implementation is complete.
- Active slice:
  none; remaining Slice-1B layout candidates require separate approval.
- Open follow-up:
  select and approve the next Slice-1B layout complexity target.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:
  none while approval is pending.

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
- [x] Select Slice-1B-D `applyGrowthOffsets` layout-helper extraction as the
      next implementation candidate.
- [x] Record human approval for Slice-1B-D.
- [x] Complete Slice-1B-D `applyGrowthOffsets` layout-helper extraction.
- [x] Select Slice-1B-E `resolveSiblingSubtreeCollisions` layout-helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-E.
- [x] Complete Slice-1B-E `resolveSiblingSubtreeCollisions` layout-helper
      extraction.
- [x] Select Slice-1B-F `resolveLowerExpandedPanelIntrusions` layout-helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-F.
- [x] Complete Slice-1B-F `resolveLowerExpandedPanelIntrusions` layout-helper
      extraction.
- [x] Select Slice-1B-G `buildExpandedPanelBounds` layout-helper extraction as
      the next implementation candidate.
- [x] Record human approval for Slice-1B-G.
- [x] Complete Slice-1B-G `buildExpandedPanelBounds` layout-helper extraction.
- [x] Select Slice-1B-H `getUpperExpandedPanelMaxRight` layout-helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-H.
- [x] Complete Slice-1B-H `getUpperExpandedPanelMaxRight` layout-helper
      extraction.
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
- Slice-1B-D targets `applyGrowthOffsets` first because Qlty reports cognitive
  complexity 24, and existing tests cover horizontal/vertical growth behavior
  directly.
- Slice-1B-D must preserve target unit selection, horizontal offset
  conditions, vertical offset conditions, existing-y-offset subtraction,
  subtree movement through `addOffset`, `positionOverrides`, and
  `nodeDecorations`.
- Slice-1B-D kept growth offset behavior inside
  `expandedFlowGraphLayout.ts`, lowered `applyGrowthOffsets` cognitive
  complexity from 24 to 3, and left remaining collision/layout helpers as
  separate approval candidates.
- `resolveSiblingSubtreeCollisions`, `resolveLowerExpandedPanelIntrusions`,
  `relayoutExpandedScope`, and `buildExpandedPanelBounds` remain later layout
  candidates.
- Slice-1B-E targets `resolveSiblingSubtreeCollisions` because Qlty reports
  cognitive complexity 24 after Slice-1B-D, the helper is called only from
  `relayoutExpandedScope`, and existing expanded-flow tests cover sibling
  panel collision, descendant anchoring, and parent-row propagation behavior.
- Slice-1B-E must preserve same-container sibling ordering, occupied-box
  overlap detection, right/down movement calculation, subtree offset
  propagation through `addOffset`, refreshed target layout items, and
  `positionOverrides`/`nodeDecorations`.
- Slice-1B-E kept sibling collision behavior inside
  `expandedFlowGraphLayout.ts`, lowered `resolveSiblingSubtreeCollisions`
  cognitive complexity from 24 to 2, and left lower-panel intrusion and panel
  bounds helpers as separate approval candidates.
- Slice-1B-F targets `resolveLowerExpandedPanelIntrusions` because Qlty reports
  cognitive complexity 20 after Slice-1B-E, the helper is called only from
  `relayoutExpandedScope`, and existing expanded-flow tests cover upper/lower
  expanded panel overlap, vertical panel separation, and expansion-order
  consistency.
- Slice-1B-F must preserve upper/lower expanded-child comparison, missing
  position/panel-bound skips, horizontal overlap filtering, vertical push
  distance, subtree offset propagation through `addOffset`, and
  `positionOverrides`/`nodeDecorations`.
- Slice-1B-F kept lower-panel intrusion behavior inside
  `expandedFlowGraphLayout.ts`, lowered `resolveLowerExpandedPanelIntrusions`
  cognitive complexity from 20 to 2, and left `relayoutExpandedScope` and
  panel bounds helpers as separate approval candidates.
- Slice-1B-G targets `buildExpandedPanelBounds` because Qlty reports cognitive
  complexity 17 after Slice-1B-F, the helper is called only from
  `updateExpandedNodeDecoration`, and existing expanded-flow tests cover panel
  dimensions, descendant containment, panel origin anchoring, and snapshot
  decoration output.
- Slice-1B-G must preserve parent-position missing skips, visible-unit
  filtering, descendant containment checks, node and decoration bounds
  accumulation, panel offset constants, panel dimension calculation, and
  `nodeDecorations`.
- Slice-1B-G kept panel bounds behavior inside
  `expandedFlowGraphLayout.ts`, lowered `buildExpandedPanelBounds` cognitive
  complexity from 17 to 4, and left `getUpperExpandedPanelMaxRight` and
  `relayoutExpandedScope` as separate approval candidates.
- Slice-1B-H targets `getUpperExpandedPanelMaxRight` because Qlty reports
  cognitive complexity 14 and many parameters after Slice-1B-G, the helper is
  referenced only by `relayoutExpandedScope`, and existing expanded-flow tests
  cover upper/lower panel horizontal growth and expansion-order behavior.
- Slice-1B-H must preserve upper-candidate iteration order, current expanded
  child skips, missing position/panel-bound skips, upper-vs-current y filtering,
  max-right aggregation, horizontal growth offset formulas,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-H kept upper panel max-right behavior inside
  `expandedFlowGraphLayout.ts`, removed the `getUpperExpandedPanelMaxRight`
  high-complexity and many-parameters smells, reduced file total complexity
  from 138 to 129, and left `relayoutExpandedScope` as a separate approval
  candidate.
- `buildExpandedFlowGraph.ts` shows repeated orchestration complexity.
- Domain helpers still contain branch-heavy conditional logic.
