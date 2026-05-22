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
  Slice-1B-S implementation is complete.
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
- `buildExpandedFlowGraph.ts` shows repeated orchestration complexity.
- Domain helpers still contain branch-heavy conditional logic.
