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
  Slice-2-N implementation is complete.
- Active slice:
  none; Slice-2-N is complete and the next Slice-2 target is not selected.
- Open follow-up:
  decide whether Slice-2 continues with editor-feedback diagnostic helper
  findings or remaining unit-list helper findings.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  none

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
- [x] Select Slice-1B-I `relayoutExpandedScope` orchestration-helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-I.
- [x] Complete Slice-1B-I `relayoutExpandedScope` orchestration-helper
      extraction.
- [x] Select Slice-1B-J `isDescendantOf` ancestor-traversal helper extraction
      as the next implementation candidate.
- [x] Record human approval for Slice-1B-J.
- [x] Complete Slice-1B-J `isDescendantOf` ancestor-traversal helper
      extraction.
- [x] Select Slice-1B-K `syncAnchoredDescendantOverrides`
      anchored-descendant helper extraction as the next implementation
      candidate.
- [x] Record human approval for Slice-1B-K.
- [x] Complete Slice-1B-K `syncAnchoredDescendantOverrides`
      anchored-descendant helper extraction.
- [x] Select Slice-1B-L `appendExpandedUnitEdges` expanded-edge append helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-L.
- [x] Complete Slice-1B-L `appendExpandedUnitEdges` expanded-edge append
      helper extraction.
- [x] Select Slice-1B-M `revealVisibleNestedUnit` nested reveal helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-M.
- [x] Complete Slice-1B-M `revealVisibleNestedUnit` nested reveal helper
      extraction.
- [x] Select Slice-1B-N `getDisplayPositions` display-position collection
      helper extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-N.
- [x] Complete Slice-1B-N `getDisplayPositions` display-position collection
      helper extraction.
- [x] Select Slice-1B-O `includeNodeBounds` bounds-input helper extraction as
      the next implementation candidate.
- [x] Record human approval for Slice-1B-O.
- [x] Complete Slice-1B-O `includeNodeBounds` bounds-input helper extraction.
- [x] Select Slice-1B-P `addVisibleNode` visible-node input helper extraction
      as the next implementation candidate.
- [x] Record human approval for Slice-1B-P.
- [x] Complete Slice-1B-P `addVisibleNode` visible-node input helper
      extraction.
- [x] Select Slice-1B-Q `ensureVisibleNestedNode` nested-node visibility input
      helper extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-Q.
- [x] Complete Slice-1B-Q `ensureVisibleNestedNode` nested-node visibility
      input helper extraction.
- [x] Select Slice-1B-R `applyGrowthOffsets` growth-offset input helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-R.
- [x] Complete Slice-1B-R `applyGrowthOffsets` growth-offset input helper
      extraction.
- [x] Select Slice-1B-S `buildExpandedPanelBounds` panel-subtree bounds helper
      extraction as the next implementation candidate.
- [x] Record human approval for Slice-1B-S.
- [x] Complete Slice-1B-S `buildExpandedPanelBounds` panel-subtree bounds
      helper extraction.
- [x] Select Slice-1B-T `updateExpandedNodeDecoration` decoration update
      helper extraction as the next implementation candidate.
- [x] Revise Slice-1B-T scope after implementation attempts did not lower
      Qlty total complexity.
- [x] Select Slice-1B-U `resolveSiblingSubtreeCollisions`
      sibling-collision iteration helper extraction as the next implementation
      candidate.
- [x] Record human approval for Slice-1B-U.
- [x] Complete Slice-1B-U `resolveSiblingSubtreeCollisions`
      sibling-collision iteration helper extraction.
- [x] Complete remaining Slice-1B flow-viewer component/layout complexity
      work.
- [x] Select Slice-2-A `buildUnitListLinkedUnits` linked-unit projection helper
      extraction as the next implementation candidate.
- [x] Record Slice-2-A impact investigation.
- [x] Request human approval for the selected Slice-2-A implementation scope.
- [x] Record human approval for Slice-2-A.
- [x] Complete Slice-2-A `buildUnitListLinkedUnits` linked-unit projection
      helper extraction.
- [x] Select Slice-2-B `getPriorityForUnitTypes` priority resolution helper
      extraction as the next implementation candidate.
- [x] Record Slice-2-B impact investigation.
- [x] Request human approval for the selected Slice-2-B implementation scope.
- [x] Record human approval for Slice-2-B.
- [x] Complete Slice-2-B `getPriorityForUnitTypes` priority resolution helper
      extraction.
- [x] Select Slice-2-C `buildUnitListRemainingGroups` group projection helper
      extraction as the next implementation candidate.
- [x] Record Slice-2-C impact investigation.
- [x] Request human approval for the selected Slice-2-C implementation scope.
- [x] Record human approval for Slice-2-C.
- [x] Complete Slice-2-C `buildUnitListRemainingGroups` group projection
      helper extraction.
- [x] Select Slice-2-D `buildUnitListRemainingGroups` default-aware helper
      cleanup as the next implementation candidate.
- [x] Record Slice-2-D impact investigation.
- [x] Request human approval for the selected Slice-2-D implementation scope.
- [x] Record human approval for Slice-2-D.
- [x] Complete Slice-2-D `buildUnitListRemainingGroups` default-aware helper
      cleanup.
- [x] Select Slice-2-E `parseHashEscapedQuotedStringLiteralContent` string
      literal parser helper extraction as the next implementation candidate.
- [x] Record Slice-2-E impact investigation.
- [x] Request human approval for the selected Slice-2-E implementation scope.
- [x] Record human approval for Slice-2-E.
- [x] Complete Slice-2-E `parseHashEscapedQuotedStringLiteralContent` string
      literal parser helper extraction.
- [x] Select Slice-2-F `isValidExplicitEventReceivingTimeoutCondition`
      timeout-condition helper extraction as the next implementation
      candidate.
- [x] Record Slice-2-F impact investigation.
- [x] Request human approval for the selected Slice-2-F implementation scope.
- [x] Record human approval for Slice-2-F.
- [x] Complete Slice-2-F `isValidExplicitEventReceivingTimeoutCondition`
      timeout-condition helper extraction.
- [x] Select Slice-2-G `isValidExplicitEventReceivingFilterReference`
      filter-reference helper extraction as the next implementation candidate.
- [x] Record Slice-2-G impact investigation.
- [x] Request human approval for the selected Slice-2-G implementation scope.
- [x] Record human approval for Slice-2-G.
- [x] Complete Slice-2-G `isValidExplicitEventReceivingFilterReference`
      filter-reference helper extraction.
- [x] Select Slice-2-H `isValidExplicitIpv4Address` IPv4 validator helper
      extraction as the next implementation candidate.
- [x] Record Slice-2-H impact investigation.
- [x] Request human approval for the selected Slice-2-H implementation scope.
- [x] Record human approval for Slice-2-H.
- [x] Complete Slice-2-H `isValidExplicitIpv4Address` IPv4 validator helper
      extraction.
- [x] Select Slice-2-I `hasInvalidWildcardWithShortMonitoringInterval` file
      monitoring helper extraction as the next implementation candidate.
- [x] Record Slice-2-I impact investigation.
- [x] Request human approval for the selected Slice-2-I implementation scope.
- [x] Record human approval for Slice-2-I.
- [x] Complete Slice-2-I `hasInvalidWildcardWithShortMonitoringInterval` file
      monitoring helper extraction.
- [x] Select Slice-2-J `parseExplicitHexadecimalInRange` hexadecimal scalar
      helper extraction as the next implementation candidate.
- [x] Record Slice-2-J impact investigation.
- [x] Request human approval for the selected Slice-2-J implementation scope.
- [x] Record human approval for Slice-2-J.
- [x] Complete Slice-2-J `parseExplicitHexadecimalInRange` hexadecimal scalar
      helper extraction.
- [x] Select Slice-2-K `parseExplicitDecimalInRange` decimal scalar helper
      extraction as the next implementation candidate.
- [x] Record Slice-2-K impact investigation.
- [x] Request human approval for the selected Slice-2-K implementation scope.
- [x] Record human approval for Slice-2-K.
- [x] Complete Slice-2-K `parseExplicitDecimalInRange` decimal scalar helper
      extraction.
- [x] Select Slice-2-L `argumentValue` command-builder helper extraction as
      the next implementation candidate.
- [x] Record Slice-2-L impact investigation.
- [x] Request human approval for the selected Slice-2-L implementation scope.
- [x] Record human approval for Slice-2-L.
- [x] Complete Slice-2-L `argumentValue` command-builder helper extraction.
- [x] Select Slice-2-M `buildCommandLine` token-builder extraction as the next
      implementation candidate.
- [x] Record Slice-2-M impact investigation.
- [x] Request human approval for the selected Slice-2-M implementation scope.
- [x] Record human approval for Slice-2-M.
- [x] Complete Slice-2-M `buildCommandLine` token-builder extraction.
- [x] Select Slice-2-N command-builder unit-type choice extraction as the next
      implementation candidate.
- [x] Record Slice-2-N impact investigation.
- [x] Request human approval for the selected Slice-2-N implementation scope.
- [x] Record human approval for Slice-2-N.
- [x] Complete Slice-2-N command-builder unit-type choice extraction.
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
- Slice-1B-I targets `relayoutExpandedScope` because Qlty reports cognitive
  complexity 13 after Slice-1B-H, the helper is called from
  `buildExpandedFlowGraph` and recursively from itself, and existing
  expanded-flow tests cover recursive expansion, panel dimensions, horizontal
  and vertical growth, lower-panel intrusion, and sibling collision behavior.
- Slice-1B-I must preserve expanded child filtering and ordering, recursive
  reveal/relayout/decorate timing, lower-panel intrusion resolution timing,
  immediate visible child target selection, horizontal and vertical growth
  formulas, growth offset application, final sibling collision resolution,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-I kept expanded-scope relayout behavior inside
  `expandedFlowGraphLayout.ts`, removed the `relayoutExpandedScope`
  high-complexity smell, and left `isDescendantOf` as a separate approval
  candidate.
- Slice-1B-J targets `isDescendantOf` because Qlty reports cognitive
  complexity 10 after Slice-1B-I, the helper is referenced by
  `buildExpandedFlowGraph` descendant filtering and expanded panel bounds
  calculation, and existing expanded-flow tests cover descendant anchoring,
  nested expansion visibility, panel dimensions, and panel containment.
- Slice-1B-J must preserve direct ancestor matching, parent-chain traversal,
  missing-parent termination, reuse of the existing `unitById` map, exported
  helper compatibility for tests, `positionOverrides`, and `nodeDecorations`.
- Slice-1B-J kept descendant detection behavior inside
  `expandedFlowGraphLayout.ts`, removed the `isDescendantOf` high-complexity
  smell, reduced file total complexity from 128 to 122, and left
  `syncAnchoredDescendantOverrides` as a separate approval candidate.
- Slice-1B-K targets `syncAnchoredDescendantOverrides` because Qlty reports
  cognitive complexity 6 after Slice-1B-J, the helper is called from
  `addOffset` and recursively from itself, and existing expanded-flow tests
  cover anchored descendants, sibling movement, panel dimensions,
  `positionOverrides`, and recursive expansion behavior.
- Slice-1B-K must preserve parent-anchor filtering, missing-position skips,
  display position recalculation, recursive anchored descendant updates,
  `positionOverrides`, offsets, and `nodeDecorations`.
- Slice-1B-K kept anchored descendant synchronization behavior inside
  `expandedFlowGraphLayout.ts`, removed the
  `syncAnchoredDescendantOverrides` high-complexity smell, reduced file total
  complexity from 122 to 118, and left `appendExpandedUnitEdges` as a separate
  approval candidate.
- Slice-1B-L targets `appendExpandedUnitEdges` because Qlty reports cognitive
  complexity 6 after Slice-1B-K, the helper is called only from
  `revealVisibleNestedUnit`, and expanded-flow tests cover recursive expansion,
  expanded edge labels, and duplicate-edge avoidance.
- Slice-1B-L must preserve `toEdgeDtos` edge DTO creation, `${source}-${target}`
  edge id generation, duplicate filtering through `context.edgeIds`, edge
  append order, visible edge membership, `positionOverrides`, and
  `nodeDecorations`.
- Slice-1B-L kept expanded edge appending behavior inside
  `expandedFlowGraphLayout.ts`, removed the `appendExpandedUnitEdges`
  high-complexity smell, reduced file total complexity from 118 to 114, and
  left `revealVisibleNestedUnit` as a separate approval candidate.
- Slice-1B-M targets `revealVisibleNestedUnit` because Qlty reports cognitive
  complexity 6 after Slice-1B-L, the helper is called only from
  `relayoutExpandedChildren`, and existing expanded-flow tests cover nested
  reveal timing, recursive expansion, condition node visibility, edge labels,
  duplicate-edge avoidance, `positionOverrides`, and `nodeDecorations`.
- Slice-1B-M must preserve missing-expanded-position skip behavior, non-`rc`
  child visibility, condition child visibility, parent anchor assignment,
  nested position formulas, expanded edge appending, visible node/edge
  membership, `positionOverrides`, and `nodeDecorations`.
- Slice-1B-M kept nested reveal behavior inside
  `expandedFlowGraphLayout.ts`, removed the `revealVisibleNestedUnit`
  high-complexity smell, kept file total complexity at 114, and left
  `getDisplayPositions` as a separate approval candidate.
- Slice-1B-N targets `getDisplayPositions` because Qlty reports cognitive
  complexity 5 after Slice-1B-M, the helper is called only from
  `applyGrowthOffsets`, and existing expanded-flow tests cover position
  overrides, horizontal/vertical growth offsets, panel dimensions, recursive
  expansion, and sibling movement.
- Slice-1B-N must preserve visible-unit iteration order, missing-position
  skips, `getDisplayPosition` precedence, snapshot map insertion order,
  `positionsBeforeOffset` semantics, offset application, `positionOverrides`,
  and `nodeDecorations`.
- Slice-1B-N kept display-position snapshot behavior inside
  `expandedFlowGraphLayout.ts`, removed the `getDisplayPositions`
  high-complexity smell, reduced file total complexity from 114 to 111, and
  left the many-parameter layout helpers as separate approval candidates.
- Slice-1B-O targets `includeNodeBounds` because Qlty reports a
  many-parameter smell after Slice-1B-N, the helper is called only from
  `includePanelBoundsLayoutItem`, and existing expanded-flow tests cover panel
  dimensions, decoration bounds, recursive expansion, and
  `nodeDecorations`.
- Slice-1B-O must preserve min/max bound updates, node width/height usage,
  panel subtree bounds accumulation, decoration bound inclusion,
  `nodeDecorations`, and expanded panel dimensions.
- Slice-1B-O kept node bounds accumulation behavior inside
  `expandedFlowGraphLayout.ts`, removed the `includeNodeBounds`
  many-parameter smell, kept file total complexity at 111, and left
  `addVisibleNode` and `ensureVisibleNestedNode` as separate approval
  candidates.
- Slice-1B-P targets `addVisibleNode` because Qlty reports a many-parameter
  smell after Slice-1B-O, the helper is called only from
  `ensureVisibleNestedNode`, and existing expanded-flow tests cover nested
  reveal, condition nodes, position overrides, recursive expansion, and
  expanded layout offsets.
- Slice-1B-P must preserve grid-vs-condition node DTO creation, `nodeIds`,
  `visibleUnitIds`, `initialPositions`, optional parent anchor registration,
  and final display-position synchronization.
- Slice-1B-P kept visible node registration behavior inside
  `expandedFlowGraphLayout.ts`, removed the `addVisibleNode`
  many-parameter smell, kept file total complexity at 111, and left
  `ensureVisibleNestedNode` as a separate approval candidate.
- Slice-1B-Q targets `ensureVisibleNestedNode` because Qlty reports a
  many-parameter smell after Slice-1B-P, the helper is called from
  `ensureChildNodeVisible` and `ensureConditionNodeVisible`, and existing
  expanded-flow tests cover nested reveal, condition nodes, position
  overrides, parent anchoring, recursive expansion, and expanded layout
  offsets.
- Slice-1B-Q must preserve existing-position reuse, duplicate node skip,
  position calculation timing, `addVisibleNode` registration, `parentAnchorId`
  semantics, returned position/undefined behavior, `positionOverrides`, and
  `nodeDecorations`.
- Slice-1B-Q kept nested node visibility behavior inside
  `expandedFlowGraphLayout.ts`, removed the `ensureVisibleNestedNode`
  many-parameter smell, kept file total complexity at 111, and left
  `applyGrowthOffsets` as a separate approval candidate.
- Slice-1B-R targets `applyGrowthOffsets` because Qlty reports it as the
  remaining many-parameter helper after Slice-1B-Q, the helper is called from
  `applyExpandedChildGrowthOffset`, and existing expanded-flow tests cover
  horizontal/vertical growth, sibling movement, recursive expansion,
  `positionOverrides`, and expanded layout offsets.
- Slice-1B-R must preserve zero-growth no-op behavior, display-position
  snapshot timing, target unit id filtering, horizontal and vertical offset
  formulas, offset application through `addOffset`, `positionOverrides`, and
  `nodeDecorations`.
- Slice-1B-R kept growth offset application behavior inside
  `expandedFlowGraphLayout.ts`, removed the `applyGrowthOffsets`
  many-parameter smell, kept file total complexity at 111, and left total
  complexity reduction as a separate approval candidate.
- Slice-1B-S targets `buildExpandedPanelBounds` because Qlty reports only high
  total complexity after Slice-1B-R, the helper still owns parent-position
  guard plus visible-unit subtree bounds iteration, and existing expanded-flow
  tests cover panel dimensions, decoration bounds, recursive expansion,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-S must preserve missing parent-position skip behavior, visible-unit
  iteration order, expanded panel bounds unit filtering, node and decoration
  bounds accumulation, panel padding formulas, `positionOverrides`, and
  `nodeDecorations`.
- Slice-1B-S kept expanded panel bounds behavior inside
  `expandedFlowGraphLayout.ts`, extracted subtree bounds collection from
  `buildExpandedPanelBounds`, and reduced file total complexity from 111 to 109.
- Slice-1B-T targets `updateExpandedNodeDecoration` because Qlty reports only
  high total complexity after Slice-1B-S, the helper is called from
  `relayoutExpandedChildren`, and existing expanded-flow tests cover expanded
  node decorations, panel dimensions, recursive expansion, and
  `positionOverrides`.
- Slice-1B-T must preserve missing position/panel-bounds skip behavior,
  `buildExpandedPanelBounds` timing, `toDecorationFromBounds` mapping,
  `nodeDecorations` keying by expanded unit id, `positionOverrides`, and
  recursive expansion ordering.
- Slice-1B-T implementation scope needs revision because local helper
  extraction attempts around `updateExpandedNodeDecoration` preserved behavior
  but did not lower Qlty total complexity from 109; no runtime abstraction is
  retained while approval is pending.
- Slice-1B-U targets `resolveSiblingSubtreeCollisions` because Qlty reports
  only high total complexity after Slice-1B-T revision, the helper still owns
  the target-by-target sibling collision iteration, and Serena/code navigation
  found one direct call from `relayoutExpandedScope`.
- Slice-1B-U must preserve visible immediate child order, already-resolved
  fixed sibling semantics, collision movement through
  `resolveTargetSiblingCollisions`, refreshed target layout items,
  `positionOverrides`, and `nodeDecorations`.
- Existing `buildExpandedFlowGraph.test.ts` coverage exercises sibling
  collision and offsets, recursive expansion, expanded panel dimensions,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-U was approved by the user at 2026-05-22 20:40 JST for
  `resolveSiblingSubtreeCollisions` sibling-collision iteration helper
  extraction only.
- Slice-1B-U kept sibling collision behavior inside
  `expandedFlowGraphLayout.ts`, extracted the resolved-item iteration from
  `resolveSiblingSubtreeCollisions`, and reduced file total complexity from
  109 to 107.
- Slice-1B is complete as a flow-viewer component/layout complexity reduction
  slice. Further `expandedFlowGraphLayout.ts` total-complexity reductions are
  deferred unless a future behavior or maintainability need makes a more
  targeted slice worthwhile.
- Slice-2 will start with application orchestration candidate selection. Early
  likely candidates include flow graph builders and unit-list builders under
  `src/application`, with affected tests under `src/test/suite`.
- Slice-2-A targets `buildUnitListLinkedUnits` because Qlty reports duplicated
  previous/next linked-unit projection blocks and cognitive complexity 6 in a
  small application use-case helper.
- Slice-2-A impact is local to
  `src/application/unit-list/buildUnitListLinkedUnits.ts`, with direct
  references from `buildUnitListView` and
  `buildUnitListLinkedUnits.test.ts`.
- Slice-2-A must preserve parent lookup through `findParentAjsUnit`,
  previous-unit filtering by `targetUnitId`, next-unit filtering by
  `sourceUnitId`, relation order, missing related-unit skips, relation type
  projection, and `UnitListLinkedUnitView` shape.
- Existing tests cover direct linked-unit projection through
  `buildUnitListLinkedUnits.test.ts`; `buildUnitListView.test.ts` covers the
  unit-list row integration that consumes previous/next linked units.
- Slice-2-A was approved by the user at 2026-05-22 20:52 JST for
  `buildUnitListLinkedUnits` linked-unit projection helper extraction only.
- Slice-2-A kept linked-unit behavior inside `buildUnitListLinkedUnits.ts`,
  extracted direction-aware relation projection helpers, and removed the
  duplicated previous/next linked-unit projection smell for the target file.
- Slice-2-B targets `getPriorityForUnitTypes` because Qlty reports high
  complexity 24, many returns, and a many-parameter smell in a shared
  unit-list priority helper.
- Slice-2-B impact is local to
  `src/application/unit-list/unitListViewHelpers.ts`, with direct callers from
  `buildUnitListGroup7View`, `buildUnitListGroup11View`, the helper's parent
  priority recursion, and `unitListViewHelpers.test.ts`.
- Slice-2-B must preserve cache lookup and writes through `priorityById`,
  `targetUnitTypes` eligibility, `pr`/`ni` precedence by parameter position,
  `ni` conversion through `toNiPriority`, parent jobnet inheritance for
  `n`/`rn`, fallback priority `1`, and the exported function signature unless
  separate approval is granted.
- Existing tests cover `ni`, `pr` precedence, parent inheritance, and
  queue-job priority conversion through `unitListViewHelpers.test.ts`;
  `buildUnitListPriorityViews.test.ts` and `buildUnitListView.test.ts` cover
  integration through group7/group11 views.
- Slice-2-B was approved by the user at 2026-05-23 14:53 JST for
  `getPriorityForUnitTypes` priority resolution helper extraction only.
- Slice-2-B kept the exported signature and priority behavior intact while
  extracting cache writes, explicit priority resolution, parent-priority
  inheritance, and fallback resolution into local helpers. Qlty metrics for
  `unitListViewHelpers.ts` improved from total complexity 65 to 57, and the
  high-complexity and many-returns smells for `getPriorityForUnitTypes` were
  removed. The remaining many-parameter smell is retained because the exported
  signature was explicitly preserved; `toNiPriority` and other helper smells
  remain future Slice-2 candidates.
- Slice-2-C targets `buildUnitListRemainingGroups` because Qlty reports high
  complexity 27 in a unit-list application projection helper that assembles
  group1, group2, group3, group4, group5, group8, group9, and groups 12
  through 19.
- Slice-2-C impact is local to
  `src/application/unit-list/buildUnitListRemainingGroups.ts`, with one
  production call from `buildUnitListView` and direct regression coverage in
  `buildUnitListRemainingGroups.test.ts`.
- Slice-2-C must preserve the exported function signature, previous/next
  linked-unit passthrough, parent path and layout formatting, unit-type gated
  fields, default-aware group13/group14 values, QUEUE transfer-operation
  hiding, all `UnitListGroup*View` shapes, parser/generated artifacts,
  presentation behavior, VS Code compatibility, web compatibility, and
  `engines.vscode`.
- Existing tests cover broad remaining group projection, group13 default-aware
  timeout/file-monitoring/event timeout behavior, group14 JP1 event sending
  defaults, and group15 QUEUE transfer-operation hiding through
  `buildUnitListRemainingGroups.test.ts`; `buildUnitListView.test.ts` covers
  integration through the full unit-list row builder.
- Slice-2-C was approved by the user at 2026-05-23 15:21 JST for
  `buildUnitListRemainingGroups` group projection helper extraction only.
- Slice-2-C kept the exported signature and remaining group behavior intact
  while extracting group1, group2, group3, group4, group5, group8, group9, and
  group12 through group19 projection builders. Qlty metrics for
  `buildUnitListRemainingGroups.ts` improved from total complexity 31 to 27,
  and the high-complexity smell for `buildUnitListRemainingGroups` was
  removed. The remaining `findDefaultAwareParameterValue` many-parameter smell
  and wait-job unit-type binary-expression smell remain future Slice-2
  candidates.
- Slice-2-D targets the remaining local helper smells in
  `buildUnitListRemainingGroups.ts`: the `findDefaultAwareParameterValue`
  many-parameter smell and the wait-job unit-type binary expression used by
  group13 event timeout action defaults.
- Slice-2-D impact is local to
  `src/application/unit-list/buildUnitListRemainingGroups.ts`. Serena found
  `findDefaultAwareParameterValue` referenced only by default-aware wrappers in
  the same file and `isWaitJobWithGroup13TimeoutAction` referenced only by
  `findGroup13EventTimeoutAction`.
- Slice-2-D must preserve default-aware lookup semantics, fallback defaults
  for group13/group14, wait-job unit-type membership, group13 event timeout
  action output, exported `buildUnitListRemainingGroups` signature, all
  `UnitListGroup*View` shapes, parser/generated artifacts, presentation
  behavior, VS Code compatibility, web compatibility, and `engines.vscode`.
- Existing tests cover group13 execution-interval, file-monitoring, shared
  wait-job timeout-action defaults and group14 event-sending defaults through
  `buildUnitListRemainingGroups.test.ts`; `buildUnitListView.test.ts` covers
  integration through the full unit-list row builder.
- Slice-2-D was approved by the user at 2026-05-23 17:08 JST for
  `buildUnitListRemainingGroups` default-aware helper cleanup only.
- Slice-2-D preserved default-aware group13/group14 behavior while grouping
  default-aware lookup inputs and replacing the group13 wait-job unit-type
  binary expression with a local membership constant. Targeted Qlty smell
  output for `buildUnitListRemainingGroups.ts` is now empty, and cyclomatic
  complexity improved from 69 to 42 while total complexity stayed at 27.
- Slice-2-E targets `parseHashEscapedQuotedStringLiteralContent` because Qlty
  reports high complexity 21 and many returns 4 in a small
  application/editor-feedback helper.
- Slice-2-E impact is local to
  `src/application/editor-feedback/syntaxDiagnosticStringValidators.ts`, with
  direct production references only from
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` for event
  receiving quoted string, optional extended attribute filter, and timeout
  file-name validation.
- Slice-2-E must preserve quote-boundary validation, `#"` and `##` decoding,
  rejection of invalid `#` escapes, rejection of unescaped inner quotes,
  decoded content returned for byte-length checks, parser/generated artifacts,
  diagnostics messages, presentation behavior, VS Code compatibility, web
  compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises event
  receiving valid and invalid string-filter diagnostics, including `evusr`,
  `evgrp`, `evwms`, `evdet`, `evwfr`, and `evtmc` consumers of the helper.
- Slice-2-E was approved by the user at 2026-05-23 17:26 JST for
  `parseHashEscapedQuotedStringLiteralContent` string literal parser helper
  extraction only.
- Slice-2-E preserved hash-escaped quoted string behavior while replacing the
  branch-heavy loop with focused content validation and decode helpers.
  Targeted Qlty smell output for `syntaxDiagnosticStringValidators.ts` is now
  empty; file total complexity improved from 21 to 5 and cyclomatic complexity
  improved from 19 to 4.
- Slice-2-F targets `isValidExplicitEventReceivingTimeoutCondition` because
  Qlty reports high complexity 10 and many returns 5 in a small
  application/editor-feedback helper.
- Slice-2-F impact is local to
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`, with the
  exported helper referenced only by the `evtmc` rule in
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`.
- Slice-2-F must preserve omitted/empty rejection, bare `n` and `a` acceptance,
  colon-separated mode parsing, allowed modes `n`, `a`, `d`, and `b`, quoted
  hash-escaped file-name parsing, decoded file-name byte-length range 1..256,
  diagnostic message text, parser/generated artifacts, presentation behavior,
  VS Code compatibility, web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid
  `evtmc=n:"/tmp/result.txt"` and invalid empty file-name `evtmc=d:""` through
  event receiving string-filter diagnostics.
- Slice-2-F was approved by the user at 2026-05-24 12:49 JST for
  `isValidExplicitEventReceivingTimeoutCondition` timeout-condition helper
  extraction only.
- Slice-2-F preserved event receiving timeout-condition behavior while
  extracting file-condition parsing, mode membership, and quoted file-name
  validation helpers. Targeted Qlty smell output no longer reports
  `isValidExplicitEventReceivingTimeoutCondition`; file total complexity
  improved from 34 to 27.
- Slice-2-G targets `isValidExplicitEventReceivingFilterReference` because
  Qlty reports high complexity 6 in a small application/editor-feedback helper.
- Slice-2-G impact is local to
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`, with the
  exported helper referenced only by the `evwfr` rule in
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`.
- Slice-2-G must preserve omitted/empty rejection, whole-value byte-length
  range 1..2048, first-colon separator behavior, non-empty attribute-name
  requirement, quoted hash-escaped attribute-value validation, diagnostic
  message text, parser/generated artifacts, presentation behavior, VS Code
  compatibility, web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid
  `evwfr=?AJS2.EVENT?:"value"` and invalid `evwfr=attribute:value` through
  event receiving string-filter diagnostics.
- Slice-2-G was approved by the user at 2026-05-24 12:59 JST for
  `isValidExplicitEventReceivingFilterReference` filter-reference helper
  extraction only.
- Slice-2-G preserved event receiving filter-reference behavior while
  extracting filter-reference parsing and quoted attribute-value validation
  helpers. Targeted Qlty smell output no longer reports
  `isValidExplicitEventReceivingFilterReference`; file total complexity
  improved from 27 to 23.
- Slice-2-H targets `isValidExplicitIpv4Address` because Qlty reports high
  complexity 8 in a small application/editor-feedback helper.
- Slice-2-H impact is local to
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`, with the
  exported helper referenced only by the `evipa` rule in
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`.
- Slice-2-H must preserve omitted/empty rejection, dotted-decimal four-octet
  requirement, decimal digits only, numeric range 0..255 for each octet,
  diagnostic message text, parser/generated artifacts, presentation behavior,
  VS Code compatibility, web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid
  `evipa=192.168.0.1`, valid `evipa=255.255.255.255`, and invalid
  `evipa=256.10.0.1` through event receiving diagnostics.
- Slice-2-H was approved by the user at 2026-05-24 13:14 JST for
  `isValidExplicitIpv4Address` IPv4 validator helper extraction only.
- Slice-2-H preserved `evipa` dotted-decimal IPv4 validation while extracting
  octet validation into a local helper. `syntaxDiagnosticEventRules.ts` keeps
  the exported helper signature and diagnostic behavior intact.
- Slice-2-I targets `hasInvalidWildcardWithShortMonitoringInterval` because
  Qlty reports high complexity 5 in a small application/editor-feedback file
  monitoring helper.
- Slice-2-I impact is local to
  `src/application/editor-feedback/syntaxDiagnosticFileMonitoringRules.ts`,
  with the exported helper referenced only by the `flwf` rule in
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`.
- Slice-2-I must preserve wildcard detection for monitored file names,
  effective `flwi` lookup with `DEFAULTS.Flwi` fallback, decimal-only interval
  parsing, short interval range 1..9, diagnostic message text,
  parser/generated artifacts, presentation behavior, VS Code compatibility,
  web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid wildcard
  file monitoring with `flwi=10` and invalid wildcard file monitoring with
  `flwi=9`.
- Slice-2-I was approved by the user at 2026-05-24 19:42 JST for
  `hasInvalidWildcardWithShortMonitoringInterval` file monitoring helper
  extraction only.
- Slice-2-I preserved `flwf` wildcard/short-interval validation while
  extracting effective monitoring interval parsing and short-interval checks
  into local helpers. `syntaxDiagnosticFileMonitoringRules.ts` keeps the
  exported helper signature and diagnostic behavior intact.
- Slice-2-J targets `parseExplicitHexadecimalInRange` because Qlty reports
  high complexity 6 in a small shared application/editor-feedback scalar
  helper.
- Slice-2-J impact is local to
  `src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts`, with
  direct production references from
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` for
  colon-separated hexadecimal event ids and from
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts` for `evsid`
  event sending ranges.
- Slice-2-J must preserve omitted/empty rejection, 1..8 hexadecimal digit
  validation, case-insensitive hexadecimal parsing, inclusive minimum/maximum
  range checks, returned numeric value for valid input, `undefined` for invalid
  input, diagnostic message text, parser/generated artifacts, presentation
  behavior, VS Code compatibility, web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid
  `evsid=1fff`, valid `evsid=7fff8000`, invalid `evsid=ACT-1`, and invalid
  `evsid=00002000`.
- Slice-2-J was approved by the user at 2026-05-24 20:18 JST for
  `parseExplicitHexadecimalInRange` hexadecimal scalar helper extraction only.
- Slice-2-J preserved hexadecimal scalar validation while extracting explicit
  hexadecimal value detection and inclusive range checks into local helpers.
  `syntaxDiagnosticScalarValidators.ts` keeps the exported helper signature
  and diagnostic behavior intact.
- Slice-2-K targets `parseExplicitDecimalInRange` because Qlty reports high
  complexity 8 and a many-parameter smell in a shared
  application/editor-feedback scalar helper.
- Slice-2-K impact is local to
  `src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts`, with
  direct production references from `buildExplicitDecimalRangeRule`,
  `hasInvalidExplicitThresholdOrdering`,
  `isValidExplicitEventReceivingTimeoutSeconds`, and
  `isValidExplicitFileMonitoringInterval`.
- Slice-2-K must preserve omitted/empty rejection, decimal digit validation,
  optional negative sign behavior when `allowNegative` is true, inclusive
  minimum/maximum range checks, returned numeric value for valid input,
  `undefined` for invalid input, all diagnostic message text,
  parser/generated artifacts, presentation behavior, VS Code compatibility,
  web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises end-judgment
  range diagnostics (`wth=2147483648`, `tho=-1`), threshold ordering, file
  monitoring interval `flwi=601`, and event receiving numeric identifiers
  including invalid `evpid=abc`.
- Slice-2-K was approved by the user at 2026-05-24 20:36 JST for
  `parseExplicitDecimalInRange` decimal scalar helper extraction only.
- Slice-2-K preserved shared decimal scalar validation while extracting
  explicit decimal value detection, decimal pattern selection, and inclusive
  range checks into local helpers. `syntaxDiagnosticScalarValidators.ts` keeps
  the exported helper signature and diagnostic behavior intact.
- Slice-2-L targets `argumentValue` because Qlty reports high complexity 5 in
  a local command-builder helper, while the larger `buildCommandLine`
  complexity 27 remains a later possible slice.
- Slice-2-L impact is local to
  `src/application/unit-definition/buildAjsCommands.ts`; Serena found
  `argumentValue` is referenced only by the `buildCommandLine` field
  iteration callback.
- Slice-2-L must preserve lookup by `argumentFieldId`, non-text or missing
  argument-field fallback to `""`, `fieldValue` semantics for explicit
  values and defaults, trimming behavior, optional argument token omission
  when the resolved value is empty, `formatArgument` quoting/spacing behavior,
  command token order, exported DTO shapes, parser/generated artifacts,
  presentation behavior, VS Code compatibility, web compatibility, and
  `engines.vscode`.
- Existing `buildUnitDefinition.test.ts` coverage exercises command builder
  output through `buildCommandLine` and `buildUnitDefinition`, including
  argument-field based command generation.
- Slice-2-L was approved by the user at 2026-05-25 08:03 JST for
  `argumentValue` command-builder helper extraction only.
- Slice-2-L preserved command-builder argument resolution while extracting
  text-field lookup and trimmed text value resolution into local helpers.
  Targeted Qlty smell output no longer reports `argumentValue`; remaining
  command-builder findings include `buildCommandLine` complexity and duplicate
  select-option blocks.
- Slice-2-M targets `buildCommandLine` because Qlty reports high complexity
  27 and many returns in a command-builder application helper.
- Slice-2-M impact is local to
  `src/application/unit-definition/buildAjsCommands.ts`, with production
  callers from `buildAjsCommands` and `UnitEntityDialog`.
- Slice-2-M must preserve exported `buildCommandLine` signature, default
  values handling, checkbox option emission, independent text option and
  argument emission, select choice lookup, select choice token order,
  argument-field token emission, target token emission, `formatArgument`
  quoting/escaping behavior, output token order, command builder DTO shapes,
  parser/generated artifacts, presentation behavior, VS Code compatibility,
  web compatibility, and `engines.vscode`.
- Existing `buildUnitDefinition.test.ts` coverage exercises default command
  lines, user-selected builder values, generated command DTOs, and
  `buildUnitDefinitionByPath` command builders.
- Slice-2-M was approved by the user at 2026-05-25 08:24 JST for
  `buildCommandLine` token-builder extraction only.
- Slice-2-M preserved command-builder output while extracting checkbox,
  independent text, select choice, and target token composition into local
  helpers. Targeted Qlty smell output no longer reports `buildCommandLine`;
  remaining command-builder findings are duplicate select-option blocks.
- Slice-2-N targets the duplicate command-builder unit-type select choices
  because Qlty reports duplicate 24-line blocks in
  `src/application/unit-definition/buildAjsCommands.ts`.
- Slice-2-N impact is local to
  `src/application/unit-definition/buildAjsCommands.ts`; the duplicated
  choices feed `buildAjsCommandBuilders`, `buildAjsCommands`,
  `buildCommandLine`, and `UnitEntityDialog` command previews through existing
  DTOs.
- Slice-2-N must preserve ajsshow unit-type choices `all`, `jobnet`, and
  `job`; ajsprint unit-type choices `all`, `job`, `jobnet`, and `jobGroup`;
  choice order, value ids, label keys, emitted tokens, default values,
  command-builder DTO shapes, generated command text, parser/generated
  artifacts, presentation behavior, VS Code compatibility, web compatibility,
  and `engines.vscode`.
- Existing `buildUnitDefinition.test.ts` coverage exercises command-builder
  defaults and selected `ajsprint` unit-type output through `buildCommandLine`;
  add focused coverage only if extraction reveals an untested choice branch.
- Slice-2-N was approved by the user at 2026-05-25 08:43 JST for
  command-builder unit-type choice extraction only.
- Slice-2-N preserved unit-type choice order and command output while
  extracting common unit-type and ajsprint job-group choice construction into
  local helpers. Targeted Qlty smell output for `buildAjsCommands.ts` is now
  empty.
- Domain helpers still contain branch-heavy conditional logic.
