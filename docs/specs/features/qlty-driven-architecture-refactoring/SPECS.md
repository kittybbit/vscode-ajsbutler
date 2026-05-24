# Feature Specification: qlty-driven-architecture-refactoring

## Purpose

Use Qlty maintainability findings as architectural feedback and convert them
into phased, behavior-preserving refactoring slices.

## Origin

- Source use case:
  none; repository-native refactoring slice
- Related plan:
  `PLANS.md`

## Requirements

- Qlty findings must be converted into approval-gated slices
- Runtime behavior must remain unchanged
- Desktop and web extension compatibility must remain explicit
- Complexity and duplication reductions must be measurable

## Behavioral Scenarios (optional)

No user-visible behavior scenarios are introduced.

## Architecture

- Domain:
  simplify branch-heavy helper logic
- Application:
  reduce orchestration duplication
- Presentation:
  reduce flow-viewer complexity
- Infrastructure:
  no changes intended

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  flow viewer components, application builders, domain helpers, tests, and SDD
  documents
- Propagation decision:
  keep parser, generated artifacts, and user-facing behavior unchanged
- Slice-1A result:
  `useFlowViewerController` remains consumed only by `FlowContents`, and the
  controller responsibility split stayed within `src/ui-component` without
  application/domain propagation.
- Slice-1B-A result:
  `buildNodeSxProps` is consumed by `JobNode`, `JobNetNode`, `JobGroupNode`,
  and `ConditionNode`; styling helper extraction stayed inside
  `src/ui-component/editor/ajsFlow/nodes` and did not change node data mapping.
- Slice-1B-B result:
  `Header` is consumed only by `FlowContents`; header helper extraction can
  stay inside `src/ui-component/editor/ajsFlow` without changing controller
  state, current-scope search semantics, expanded nested unit state, graph DTOs,
  or ReactFlow node/edge construction.
- Slice-1B-C result:
  `FlowSelector` is consumed only by `FlowContents`; drawer/tree helper
  extraction stayed inside `src/ui-component/editor/ajsFlow` without changing
  current unit selection, drawer width state, root unit input, or ancestor
  expansion semantics.
- Slice-1B-D target:
  `expandedFlowGraphLayout` is consumed through `buildExpandedFlowGraph`;
  `applyGrowthOffsets` helper extraction must preserve the
  `buildExpandedFlowGraph` result contract, expanded-unit ordering, horizontal
  and vertical growth offsets, occupied layout items, collision resolution,
  panel bounds, and `positionOverrides`/`nodeDecorations` semantics.
- Slice-1B-D result:
  `applyGrowthOffsets` remains internal to `expandedFlowGraphLayout`, with
  growth target eligibility and horizontal/vertical offset formulas extracted
  into focused helpers without changing DTOs, node data, or panel behavior.
- Slice-1B-E target:
  `resolveSiblingSubtreeCollisions` is the next layout candidate; helper
  extraction must preserve sibling subtree movement, collision direction,
  visible-unit membership, occupied bounds, `positionOverrides`, and
  `nodeDecorations` semantics. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is referenced only by
  `relayoutExpandedScope`, and its behavior flows outward through
  `buildExpandedFlowGraph` results and existing expanded-flow graph tests.
- Slice-1B-E result:
  `resolveSiblingSubtreeCollisions` remains internal to
  `expandedFlowGraphLayout`, with overlap detection, right/down movement, target
  subtree movement, and refreshed occupied layout item calculation extracted
  into focused helpers without changing DTOs, node data, or panel behavior.
- Slice-1B-F target:
  `resolveLowerExpandedPanelIntrusions` is the next layout candidate; helper
  extraction must preserve upper/lower expanded panel filtering, horizontal
  overlap checks, lower panel vertical movement, and
  `positionOverrides`/`nodeDecorations` semantics. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is referenced only by
  `relayoutExpandedScope`, and its behavior flows outward through
  `buildExpandedFlowGraph` results and existing expanded-flow graph tests.
- Slice-1B-F result:
  `resolveLowerExpandedPanelIntrusions` remains internal to
  `expandedFlowGraphLayout`, with expanded panel item construction, lower-panel
  candidate selection, horizontal overlap checks, and vertical push calculation
  extracted into focused helpers without changing DTOs, node data, or panel
  behavior.
- Slice-1B-G target:
  `buildExpandedPanelBounds` is the next layout candidate; helper extraction
  must preserve subtree bounds accumulation, parent panel anchoring, panel
  offsets, panel width/height calculation, and `nodeDecorations` semantics.
  Impact is local to `expandedFlowGraphLayout.ts`: the helper is referenced
  only by `updateExpandedNodeDecoration`, and its behavior flows outward through
  `nodeDecorations` in `buildExpandedFlowGraph` results and existing
  expanded-flow graph tests.
- Slice-1B-G result:
  `buildExpandedPanelBounds` remains internal to `expandedFlowGraphLayout`,
  with parent panel bounds initialization, visible descendant filtering, and
  node and decoration bounds accumulation extracted into focused helpers
  without changing DTOs, node data, or panel behavior.
- Slice-1B-H target:
  `getUpperExpandedPanelMaxRight` is the next layout candidate; helper
  extraction must preserve upper expanded panel filtering, max-right
  calculation, expansion-order behavior, panel bounds lookup, and growth offset
  semantics. Impact is local to `expandedFlowGraphLayout.ts`: the helper is
  referenced by `relayoutExpandedScope`, and its behavior flows outward
  through existing expanded-flow graph layout results and tests.
- Slice-1B-H investigation:
  `getUpperExpandedPanelMaxRight` is referenced only by `relayoutExpandedScope`
  in `expandedFlowGraphLayout.ts`. It reads display positions and expanded
  panel bounds for expanded siblings above the current expanded child, then
  returns the greatest upper panel right edge used by horizontal growth
  calculation. Existing tests in `buildExpandedFlowGraph.test.ts` cover the
  upper panel covering lower width, lower panel exceeding upper width, and
  lower expansion after upper scenarios.
- Slice-1B-H result:
  `getUpperExpandedPanelMaxRight` remains internal to
  `expandedFlowGraphLayout`, with candidate bounds lookup, upper-candidate
  filtering, and max-right aggregation extracted into focused helpers without
  changing DTOs, node data, or panel behavior.
- Slice-1B-I target:
  `relayoutExpandedScope` is the next layout candidate; helper extraction must
  preserve recursive child reveal/relayout order, decoration refresh timing,
  lower expanded panel intrusion resolution, immediate visible child target
  selection, horizontal and vertical growth offset formulas, and final sibling
  subtree collision resolution. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is called from
  `buildExpandedFlowGraph` and recursively from itself, and behavior flows
  outward through existing expanded-flow graph layout results and tests.
- Slice-1B-I investigation:
  `relayoutExpandedScope` is called once from `buildExpandedFlowGraph` and once
  recursively from itself. It filters expanded nested jobnet children, reveals
  and recursively relayouts each expanded child, refreshes expanded node
  decorations, resolves lower expanded panel intrusions, calculates
  per-expanded-child growth offsets against immediate visible siblings, applies
  those offsets, and finally resolves sibling subtree collisions. Existing
  tests in `buildExpandedFlowGraph.test.ts` cover recursive expansion,
  descendant anchoring, panel dimensions, horizontal/vertical growth,
  lower-panel intrusion, and sibling collision behavior.
- Slice-1B-I result:
  `relayoutExpandedScope` remains exported from `expandedFlowGraphLayout`,
  with expanded child discovery, recursive child relayout/decorate sequencing,
  growth target selection, and per-child growth application extracted into
  focused helpers without changing DTOs, node data, or panel behavior.
- Slice-1B-J target:
  `isDescendantOf` is the next layout candidate; helper extraction must
  preserve direct ancestor matching, parent-chain traversal, missing-parent
  termination, and use of the existing `unitById` map. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is exported for tests and used by
  descendant anchoring and expanded panel bounds logic.
- Slice-1B-J investigation:
  `isDescendantOf` is exported from `expandedFlowGraphLayout.ts`, imported by
  `buildExpandedFlowGraph.ts`, and also called inside expanded panel bounds
  logic. It walks a unit's parent chain through the existing `unitById` map,
  returns true when any parent matches the requested ancestor id, and returns
  false when the chain ends or a parent lookup is missing. Existing tests in
  `buildExpandedFlowGraph.test.ts` cover nested expansion visibility,
  descendant anchoring, panel dimensions, panel containment, and recursive
  expansion behavior.
- Slice-1B-J result:
  `isDescendantOf` remains exported from `expandedFlowGraphLayout`, with
  parent lookup, parent-chain collection, and ancestor matching extracted into
  focused helpers without changing DTOs, node data, or panel behavior.
- Slice-1B-K target:
  `syncAnchoredDescendantOverrides` is the next layout candidate; helper
  extraction must preserve parent-anchor filtering, missing-position skips,
  nested child/condition position recalculation, position override writes, and
  recursive anchored descendant synchronization. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is called when visible nodes are
  offset or anchored descendants need to follow a moved parent.
- Slice-1B-K investigation:
  `syncAnchoredDescendantOverrides` is called from `addOffset` after a moved
  unit's own display position is synchronized, then recursively walks visible
  units whose `parentAnchors` point at the moved unit. For each anchored
  descendant it recalculates display position via existing position helpers and
  writes `positionOverrides`. Existing tests in
  `buildExpandedFlowGraph.test.ts` cover anchored descendants, sibling
  movement, panel dimensions, `positionOverrides`, and recursive expansion
  behavior.
- Slice-1B-K result:
  `syncAnchoredDescendantOverrides` remains internal to
  `expandedFlowGraphLayout`, with anchored child discovery, anchored child
  synchronization, and recursive traversal extracted into focused helpers
  without changing DTOs, node data, or panel behavior.
- Slice-1B-L target:
  `appendExpandedUnitEdges` is the next layout candidate; helper extraction
  must preserve edge DTO creation through `toEdgeDtos`, `${source}-${target}`
  edge id generation, duplicate-edge skipping through `edgeIds`, and append
  order. Impact is local to `expandedFlowGraphLayout.ts`: the helper is called
  when expanded units reveal nested flow edges.
- Slice-1B-L investigation:
  `appendExpandedUnitEdges` is called only from `revealVisibleNestedUnit` in
  `expandedFlowGraphLayout.ts`. It converts the expanded nested unit's
  relations through `toEdgeDtos`, derives the existing edge identity as
  `${source}-${target}`, skips duplicates already tracked in `context.edgeIds`,
  appends new edge DTOs to `context.edges`, and records their ids for later
  expansions. The initial `edgeIds` set is seeded in `buildExpandedFlowGraph`
  from the base graph using the same identity formula. Existing
  `buildExpandedFlowGraph.test.ts` coverage asserts recursive expansion,
  expanded edge labels, and no duplicate expanded edges.
- Slice-1B-L result:
  `appendExpandedUnitEdges` remains internal to `expandedFlowGraphLayout`,
  with edge id creation, duplicate-edge filtering, and append/record behavior
  extracted into focused helpers without changing DTOs, node data, edge
  membership, or panel behavior.
- Slice-1B-M target:
  `revealVisibleNestedUnit` is the next layout candidate; helper extraction
  must preserve the missing-position guard, non-condition child reveal,
  condition child reveal, parent anchors, nested position calculation, and
  expanded edge append timing. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is called only while
  `relayoutExpandedChildren` processes expanded nested jobnet children.
- Slice-1B-M investigation:
  `revealVisibleNestedUnit` is called only from `relayoutExpandedChildren`,
  immediately before recursive `relayoutExpandedScope` and decoration refresh.
  It skips when the expanded unit has no display position, reveals all
  non-`rc` children via `ensureChildNodeVisible`, reveals the first `rc`
  condition child via `ensureConditionNodeVisible`, and then calls
  `appendExpandedUnitEdges`. Existing `buildExpandedFlowGraph.test.ts`
  coverage exercises nested reveal timing, recursive expansion, condition node
  visibility, expanded edge labels, duplicate-edge avoidance,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-M result:
  `revealVisibleNestedUnit` remains internal to `expandedFlowGraphLayout`,
  with reveal eligibility, visible child discovery, condition discovery,
  non-condition child reveal, and condition reveal extracted into focused
  helpers without changing DTOs, node data, edge membership, parent anchors,
  position overrides, or panel behavior.
- Slice-1B-N target:
  `getDisplayPositions` is the next layout candidate; helper extraction must
  preserve visible-unit iteration order, missing-position skips,
  `getDisplayPosition` precedence, and the `positionsBeforeOffset` snapshot
  consumed by growth-offset calculation. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is called only from
  `applyGrowthOffsets` before `getTargetGrowthOffsets` and
  `applyUnitGrowthOffsets`.
- Slice-1B-N investigation:
  `getDisplayPositions` iterates `context.visibleUnitIds`, resolves each
  display position via `getDisplayPosition`, skips units without a display
  position, inserts found positions into a new `Map`, and returns that snapshot
  for growth-offset decisions. Existing `buildExpandedFlowGraph.test.ts`
  coverage exercises `positionOverrides`, horizontal and vertical growth
  offsets, panel dimensions, recursive expansion, sibling movement, and
  expanded layout offsets.
- Slice-1B-N result:
  `getDisplayPositions` remains internal to `expandedFlowGraphLayout`, with
  display-position entry resolution extracted into a focused helper and map
  construction expressed as a visible-unit collection pipeline without changing
  position override precedence, visible-unit order, offset behavior,
  `positionOverrides`, or `nodeDecorations`.
- Slice-1B-O target:
  `includeNodeBounds` is the next layout candidate; helper extraction must
  remove the many-parameter pressure while preserving min/max bounds updates,
  node width and height usage, and subtree bounds accumulation. Impact is local
  to `expandedFlowGraphLayout.ts`: the helper is called only from
  `includePanelBoundsLayoutItem` before optional decoration bounds inclusion.
- Slice-1B-O investigation:
  `includeNodeBounds` mutates a `FlowGraphBounds` accumulator by including the
  node rectangle at `position.x`, `position.y`, `position.x + width`, and
  `position.y + height`. `includePanelBoundsLayoutItem` passes
  `context.metrics.width` and `context.metrics.height`, then includes expanded
  decoration bounds when present. Existing `buildExpandedFlowGraph.test.ts`
  coverage exercises panel dimensions, recursive expansion, decoration bounds,
  and `nodeDecorations`.
- Slice-1B-O result:
  `includeNodeBounds` remains internal to `expandedFlowGraphLayout`, with node
  bounds inputs grouped into a local object without changing min/max formulas,
  node metric sources, decoration bounds inclusion, panel dimensions, or
  `nodeDecorations`.
- Slice-1B-P target:
  `addVisibleNode` is the next layout candidate; helper extraction must remove
  the many-parameter pressure while preserving visible node registration,
  initial position registration, optional parent-anchor registration, and final
  display-position synchronization. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is called only from
  `ensureVisibleNestedNode` after duplicate/known-position guards.
- Slice-1B-P investigation:
  `addVisibleNode` creates either a condition or grid node DTO based on
  `unit.unitType`, appends it to `context.nodes`, records `nodeIds` and
  `visibleUnitIds`, stores the `initialPosition`, conditionally records a
  `parentAnchorId`, and calls `syncDisplayPosition`. Existing
  `buildExpandedFlowGraph.test.ts` coverage exercises nested reveal,
  condition-node visibility, recursive expansion, `positionOverrides`, parent
  anchoring, and expanded layout offsets.
- Slice-1B-P result:
  `addVisibleNode` remains internal to `expandedFlowGraphLayout`, with visible
  node registration inputs grouped into a local object without changing node
  DTO mapping, node order, visible-unit membership, initial position storage,
  parent anchors, display-position synchronization, `positionOverrides`, or
  `nodeDecorations`.
- Slice-1B-Q target:
  `ensureVisibleNestedNode` is the next layout candidate; helper extraction
  must remove the many-parameter pressure while preserving existing-position
  reuse, duplicate-node skip behavior, position calculation timing,
  `addVisibleNode` registration, parent anchors, and return semantics. Impact
  is local to `expandedFlowGraphLayout.ts`: the helper is called by child and
  condition reveal helpers during expanded nested unit visibility.
- Slice-1B-Q investigation:
  `ensureVisibleNestedNode` is called from `ensureChildNodeVisible` and
  `ensureConditionNodeVisible` in `expandedFlowGraphLayout.ts`. It first
  reuses any existing initial position, then skips already-visible nodes,
  calculates the nested position only when a new visible node is needed,
  registers the node through `addVisibleNode`, and returns the calculated
  position. Existing `buildExpandedFlowGraph.test.ts` coverage exercises nested
  reveal, condition-node visibility, recursive expansion, `positionOverrides`,
  parent anchoring, and expanded layout offsets.
- Slice-1B-Q result:
  `ensureVisibleNestedNode` remains internal to `expandedFlowGraphLayout`, with
  nested visibility inputs grouped into a local object without changing
  existing-position reuse, duplicate-node skip behavior, position calculation
  timing, child/condition position formulas, parent anchors, returned
  position/undefined behavior, `positionOverrides`, or `nodeDecorations`.
- Slice-1B-R target:
  `applyGrowthOffsets` is the next layout candidate; helper extraction must
  remove the remaining many-parameter pressure while preserving zero-growth
  no-op behavior, display-position snapshot timing, target-unit filtering,
  horizontal and vertical offset formulas, and `addOffset` propagation. Impact
  is local to `expandedFlowGraphLayout.ts`: the helper is called from
  `applyExpandedChildGrowthOffset` after expanded-panel growth is calculated.
- Slice-1B-R investigation:
  `applyGrowthOffsets` currently takes `context`, `expandedUnitPosition`,
  `horizontalGrowth`, `verticalGrowth`, and `targetUnitIds`. It first returns
  false when both growth dimensions are zero, otherwise snapshots display
  positions with `getDisplayPositions`, builds target offsets through
  `getTargetGrowthOffsets`, and applies them through `applyUnitGrowthOffsets`.
  Existing `buildExpandedFlowGraph.test.ts` coverage exercises horizontal and
  vertical growth offsets, sibling movement, recursive expansion,
  `positionOverrides`, panel dimensions, and expanded layout offsets.
- Slice-1B-R result:
  `applyGrowthOffsets` remains internal to `expandedFlowGraphLayout`, with
  growth offset application inputs grouped into a local object without changing
  zero-growth no-op behavior, display-position snapshot timing, target unit
  filtering, horizontal or vertical offset formulas, offset application through
  `addOffset`, `positionOverrides`, or `nodeDecorations`.
- Slice-1B-S target:
  `buildExpandedPanelBounds` is the next total-complexity candidate; helper
  extraction must preserve the missing parent-position guard, visible-unit
  subtree bounds iteration, expanded-panel bounds filtering, node and
  decoration bounds accumulation, and panel padding formulas. Impact is local
  to `expandedFlowGraphLayout.ts`: the helper is called while expanded child
  growth bounds and node decorations are calculated.
- Slice-1B-S investigation:
  `buildExpandedPanelBounds` reads the expanded unit's current
  `positionOverrides` entry, returns undefined when the parent position is
  missing, initializes subtree bounds with `buildInitialPanelSubtreeBounds`,
  iterates `context.visibleUnitIds`, delegates each candidate to
  `includeExpandedPanelUnitBounds`, and converts the subtree bounds to final
  panel bounds through `buildPanelBoundsFromSubtreeBounds`. Serena found one
  direct call path through `getExpandedChildGrowthBounds` and
  `updateExpandedNodeDecoration`. Existing `buildExpandedFlowGraph.test.ts`
  coverage exercises panel dimensions, decoration bounds, recursive expansion,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-S result:
  `buildExpandedPanelBounds` remains internal to `expandedFlowGraphLayout`,
  with visible-unit subtree bounds collection extracted into a focused helper
  without changing missing parent-position skip behavior, visible-unit
  iteration order, expanded panel bounds filtering, node or decoration bounds
  inclusion, panel padding formulas, `positionOverrides`, or
  `nodeDecorations`.
- Slice-1B-T target:
  `updateExpandedNodeDecoration` is the next total-complexity candidate;
  helper extraction must preserve expanded unit position lookup, panel bounds
  calculation timing, missing position/panel-bounds skip behavior,
  `toDecorationFromBounds` mapping, and `nodeDecorations` writes. Impact is
  local to `expandedFlowGraphLayout.ts`: the helper is called during recursive
  expanded child relayout before lower-panel intrusion and growth offsets are
  processed.
- Slice-1B-T investigation:
  `updateExpandedNodeDecoration` reads `context.positionOverrides` for the
  expanded unit id, calls `buildExpandedPanelBounds`, skips when either value
  is unavailable, and stores the decoration under the expanded unit id.
  Serena found one direct call from `relayoutExpandedChildren`. Existing
  `buildExpandedFlowGraph.test.ts` coverage exercises expanded node
  decorations, panel dimensions, recursive expansion, `positionOverrides`, and
  `nodeDecorations`.
- Slice-1B-T revision:
  local helper extraction attempts around `updateExpandedNodeDecoration`
  preserved behavior but did not lower Qlty total complexity from 109, so no
  runtime abstraction is retained and the implementation scope is revised.
- Slice-1B-U target:
  `resolveSiblingSubtreeCollisions` is the next total-complexity candidate;
  helper extraction must preserve visible immediate child ordering, the
  already-resolved fixed sibling set, target refresh semantics, collision
  movement, and `positionOverrides`/`nodeDecorations`. Impact is local to
  `expandedFlowGraphLayout.ts`: the helper is called from
  `relayoutExpandedScope` after growth offsets are applied.
- Slice-1B-U investigation:
  `resolveSiblingSubtreeCollisions` builds visible immediate child layout
  items, walks them target-by-target, passes the already resolved items to
  `resolveTargetSiblingCollisions`, and replaces each target with the resolved
  layout item. Serena found one direct call from `relayoutExpandedScope`.
  Existing `buildExpandedFlowGraph.test.ts` coverage exercises sibling
  collision and offsets, recursive expansion, expanded panel dimensions,
  `positionOverrides`, and `nodeDecorations`.
- Slice-1B-U result:
  `resolveSiblingSubtreeCollisions` remains internal to
  `expandedFlowGraphLayout`, with resolved sibling item iteration extracted
  into a focused helper without changing target ordering, fixed sibling
  semantics, subtree movement, DTOs, node data, or panel behavior.
- Slice-1B completion decision:
  flow-viewer component/layout complexity reduction is complete through
  Slice-1B-U. Remaining `expandedFlowGraphLayout.ts` total-complexity work is
  deferred unless a future targeted need appears. The next task moves to
  Slice-2 application orchestration investigation.
- Slice-2 next-task impact:
  candidate selection starts in the application layer, especially
  `src/application/flow-graph` and `src/application/unit-list`. No runtime
  implementation is approved yet. A concrete Slice-2 candidate must identify
  affected callers, DTO contracts, tests, and desktop/web compatibility before
  implementation approval.
- Slice-2-A target:
  `buildUnitListLinkedUnits` is the first application orchestration candidate;
  helper extraction must preserve previous and next linked-unit projection from
  parent relations without changing `UnitListLinkedUnitView` or
  `UnitListRowView`.
- Slice-2-A investigation:
  Qlty reports duplicated previous/next projection blocks and cognitive
  complexity 6 in
  `src/application/unit-list/buildUnitListLinkedUnits.ts`. Serena found direct
  production use from `buildUnitListView` and direct test use from
  `buildUnitListLinkedUnits.test.ts`. The helper reads parent relations through
  `findParentAjsUnit`, filters incoming links by `targetUnitId`, filters
  outgoing links by `sourceUnitId`, skips missing related units, and projects
  id, name, absolute path, and relation type. Existing tests cover direct
  linked-unit projection and unit-list row integration.
- Slice-2-A result:
  `buildUnitListLinkedUnits` remains the application helper consumed by
  `buildUnitListView`, with direction-aware linked-unit projection extracted
  locally. The implementation keeps parent lookup, previous/next relation
  direction, relation order, missing-unit skip behavior, DTO shapes, and
  presentation behavior unchanged.
- Slice-2-B target:
  `getPriorityForUnitTypes` is the next unit-list application orchestration
  candidate; helper extraction must preserve priority resolution for group7
  and group11 unit-list views without changing exported DTO shapes or
  presentation behavior.
- Slice-2-B investigation:
  Qlty reports high complexity 24, many returns, and a many-parameter smell in
  `src/application/unit-list/unitListViewHelpers.ts`. Serena found direct
  production callers from `buildUnitListGroup7View` and
  `buildUnitListGroup11View`, recursive parent-priority lookup from
  `getPriorityForUnitTypes` itself, and direct test coverage in
  `unitListViewHelpers.test.ts`. The helper resolves cached priority, skips
  unsupported target unit types, reads explicit `pr` and `ni` parameters,
  chooses explicit precedence by parameter position, inherits from parent
  jobnets of type `n`/`rn`, caches resolved values, and falls back to priority
  `1`.
- Slice-2-B result:
  `getPriorityForUnitTypes` remains the exported application helper consumed
  by group7 and group11 priority builders. Explicit priority resolution,
  cache writes, parent-priority inheritance, and fallback resolution were
  extracted locally while preserving cache lookup/write semantics,
  `targetUnitTypes` filtering, `pr`/`ni` precedence, `toNiPriority`
  conversion, parent jobnet inheritance, fallback priority `1`, DTO shapes,
  and presentation behavior.
- Slice-2-C target:
  `buildUnitListRemainingGroups` is the next unit-list application
  orchestration candidate; helper extraction must preserve remaining group
  projection for full unit-list rows without changing exported DTO shapes or
  presentation behavior.
- Slice-2-C investigation:
  Qlty reports high complexity 27 in
  `src/application/unit-list/buildUnitListRemainingGroups.ts`. Serena found
  one production caller from `buildUnitListView`, direct test coverage in
  `buildUnitListRemainingGroups.test.ts`, and no additional production
  callers. The helper assembles group1, group2, group3, group4, group5,
  group8, group9, and groups 12 through 19, including previous/next
  linked-unit passthrough, parent path formatting, unit-type gated fields,
  default-aware group13/group14 values, and QUEUE transfer-operation hiding.
- Slice-2-C result:
  `buildUnitListRemainingGroups` remains the exported application helper
  consumed by `buildUnitListView`. Remaining group projection was extracted
  into local group-specific builders while preserving previous/next
  linked-unit passthrough, parent path formatting, layout formatting,
  unit-type gated fields, default-aware group13/group14 values, QUEUE
  transfer-operation hiding, DTO shapes, and presentation behavior.
- Slice-2-D target:
  `buildUnitListRemainingGroups` still has local helper smells after Slice-2-C;
  default-aware lookup input grouping and wait-job unit-type membership
  extraction must preserve group13/group14 default-aware projection behavior.
- Slice-2-D investigation:
  Qlty reports a many-parameter smell in
  `findDefaultAwareParameterValue` and a complex binary expression in
  `isWaitJobWithGroup13TimeoutAction`. Serena found
  `findDefaultAwareParameterValue` referenced only by local default-aware
  wrappers and `isWaitJobWithGroup13TimeoutAction` referenced only by
  `findGroup13EventTimeoutAction`. The behavior flows outward through
  group13 timeout interval, event timeout, file monitoring defaults, wait-job
  event timeout action defaults, and group14 event-sending defaults.
- Slice-2-D result:
  `buildUnitListRemainingGroups` keeps its exported signature and local
  group13/group14 projection behavior. Default-aware parameter lookup inputs
  were grouped into a local input type, and group13 wait-job timeout-action
  eligibility now uses a local unit-type membership constant while preserving
  the same unit-type set and fallback defaults.
- Slice-2-E target:
  `parseHashEscapedQuotedStringLiteralContent` is the next application
  editor-feedback helper candidate; string literal parsing helper extraction
  must preserve event receiving quoted string validation without changing
  diagnostic behavior.
- Slice-2-E investigation:
  Qlty reports high complexity 21 and many returns 4 in
  `src/application/editor-feedback/syntaxDiagnosticStringValidators.ts`.
  Serena found direct production references only from
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`, where the
  helper validates event receiving quoted strings, optional extended attribute
  filter values, and timeout condition file names. The behavior flows outward
  through existing diagnostics for `evusr`, `evgrp`, `evwms`, `evdet`,
  `evwfr`, and `evtmc`.
- Slice-2-E result:
  `parseHashEscapedQuotedStringLiteralContent` keeps its exported signature
  and event receiving diagnostic behavior. The branch-heavy loop was replaced
  with content validation and decode helpers that preserve quote-boundary
  validation, `#"` and `##` decoding, trailing `#` before the closing quote,
  invalid escape rejection, and unescaped inner quote rejection.
- Slice-2-F target:
  `isValidExplicitEventReceivingTimeoutCondition` is the next application
  editor-feedback helper candidate; timeout-condition helper extraction must
  preserve `evtmc` validation without changing diagnostic behavior.
- Slice-2-F investigation:
  Qlty reports high complexity 10 and many returns 5 in
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`. Serena
  found the exported helper referenced only from the `evtmc` diagnostic rule
  in `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`. The
  behavior flows outward through existing event receiving diagnostics for bare
  `n`/`a` timeout conditions and mode-prefixed file-name conditions.
- Slice-2-F result:
  `isValidExplicitEventReceivingTimeoutCondition` keeps its exported
  signature and `evtmc` diagnostic behavior. The branch-heavy validation was
  replaced with local helpers for file-condition parsing, mode membership, and
  quoted file-name byte-length validation while preserving bare `n`/`a`
  handling and allowed file modes `n`, `a`, `d`, and `b`.
- Slice-2-G target:
  `isValidExplicitEventReceivingFilterReference` is the next application
  editor-feedback helper candidate; filter-reference helper extraction must
  preserve `evwfr` validation without changing diagnostic behavior.
- Slice-2-G investigation:
  Qlty reports high complexity 6 in
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`. Serena
  found the exported helper referenced only from the `evwfr` diagnostic rule
  in `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`. The
  behavior flows outward through existing event receiving diagnostics for
  optional extended attribute filters in
  `optional-extended-attribute-name:"value"` form.
- Slice-2-G result:
  `isValidExplicitEventReceivingFilterReference` keeps its exported signature
  and `evwfr` diagnostic behavior. The branch-heavy validation was replaced
  with local helpers for first-colon filter-reference parsing and quoted
  hash-escaped attribute-value validation while preserving whole-value
  byte-length and non-empty attribute-name requirements.
- Slice-2-H target:
  `isValidExplicitIpv4Address` is the next application editor-feedback helper
  candidate; IPv4 validator helper extraction must preserve `evipa`
  validation without changing diagnostic behavior.
- Slice-2-H investigation:
  Qlty reports high complexity 8 in
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`. Serena
  found the exported helper referenced only from the `evipa` diagnostic rule
  in `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`. The
  behavior flows outward through existing event receiving diagnostics for
  dotted-decimal IPv4 values.
- Slice-2-H result:
  `isValidExplicitIpv4Address` keeps its exported signature and `evipa`
  diagnostic behavior. Octet validation was extracted into a local helper
  while preserving omitted/empty rejection, four-octet parsing, decimal-digit
  requirements, and octet range checks.
- Slice-2-I target:
  `hasInvalidWildcardWithShortMonitoringInterval` is the next application
  editor-feedback helper candidate; file monitoring wildcard/interval helper
  extraction must preserve `flwf` validation without changing diagnostic
  behavior.
- Slice-2-I investigation:
  Qlty reports high complexity 5 in
  `src/application/editor-feedback/syntaxDiagnosticFileMonitoringRules.ts`.
  Serena found the exported helper referenced only from the `flwf` diagnostic
  rule in `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`. The
  behavior flows outward through existing file monitoring diagnostics for
  wildcard monitored file names and effective monitoring intervals.
- Slice-2-I result:
  `hasInvalidWildcardWithShortMonitoringInterval` keeps its exported signature
  and `flwf` diagnostic behavior. Effective `flwi` parsing and short-interval
  checks were extracted into local helpers while preserving wildcard detection,
  `DEFAULTS.Flwi` fallback, decimal-only parsing, and short interval range
  1..9.
- Slice-2-J target:
  `parseExplicitHexadecimalInRange` is the next application editor-feedback
  helper candidate; hexadecimal scalar helper extraction must preserve event
  sending `evsid` range validation and event receiving colon-separated
  hexadecimal event id validation.
- Slice-2-J investigation:
  Qlty reports high complexity 6 in
  `src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts`.
  Serena found direct production references from
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` for
  colon-separated hexadecimal event ids and from
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts` for `evsid`
  event sending ranges. The behavior flows outward through existing event
  sending and event receiving diagnostics.
- Slice-2-J result:
  `parseExplicitHexadecimalInRange` keeps its exported signature and event
  sending/event receiving diagnostic behavior. Explicit hexadecimal value
  detection and inclusive range checks were extracted into local helpers while
  preserving 1..8 digit validation, case-insensitive parsing, and
  `undefined` for invalid input.
- Slice-2-K target:
  `parseExplicitDecimalInRange` is the next application editor-feedback helper
  candidate; decimal scalar helper extraction must preserve shared decimal
  diagnostics for range rules, threshold ordering, event receiving timeout
  seconds, and file monitoring interval validation.
- Slice-2-K investigation:
  Qlty reports high complexity 8 and a many-parameter smell in
  `src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts`.
  Serena found direct production references from
  `src/application/editor-feedback/syntaxDiagnosticCore.ts`,
  `src/application/editor-feedback/syntaxDiagnosticJobEndRules.ts`,
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`, and
  `src/application/editor-feedback/syntaxDiagnosticFileMonitoringRules.ts`.
  The behavior flows outward through existing syntax diagnostics that use
  explicit decimal ranges and optional signed decimal ranges.
- Slice-2-K result:
  `parseExplicitDecimalInRange` keeps its exported signature and shared
  decimal diagnostic behavior. Explicit decimal value detection, decimal
  pattern selection, and inclusive range checks were extracted into local
  helpers while preserving optional signed decimal validation and `undefined`
  for invalid input.
- Slice-2-L target:
  `argumentValue` is the next application command-builder helper candidate;
  helper extraction must preserve `buildCommandLine` command output for
  select choices that require an argument field.
- Slice-2-L investigation:
  Qlty reports high complexity 5 in
  `src/application/unit-definition/buildAjsCommands.ts`. Serena found
  `argumentValue` is a local helper referenced only by the
  `buildCommandLine` field iteration callback. Existing command-builder tests
  exercise command output through `buildCommandLine` and
  `buildUnitDefinition`.
- Slice-2-L result:
  `buildCommandLine` keeps its exported signature and command output behavior.
  `argumentValue` now delegates to local text-field lookup and trimmed text
  value helpers while preserving missing/non-text fallback, default value
  resolution, trimming, and empty argument omission.
- Slice-2-M target:
  `buildCommandLine` is the next application command-builder helper
  candidate; token-builder extraction must preserve command output for
  checkbox, independent text, select choice, select argument, and target
  tokens.
- Slice-2-M investigation:
  Qlty reports high complexity 27 and many returns in
  `src/application/unit-definition/buildAjsCommands.ts`. Serena found
  production references from `buildAjsCommands` and
  `src/ui-component/editor/UnitEntityDialog.tsx`, plus direct test coverage in
  `src/test/suite/buildUnitDefinition.test.ts`. The behavior flows outward to
  generated command DTOs and dialog command preview text.
- Slice-2-M result:
  `buildCommandLine` keeps its exported signature and generated command text
  behavior. Field token composition now delegates to local checkbox,
  independent-text, and select-choice helpers while preserving token order,
  default field values, argument resolution, and target formatting.

### Breaking Change Analysis

- User-visible behavior:
  none intended
- API/DTO/schema compatibility:
  none intended
- VS Code/web extension compatibility:
  must remain unchanged
- Changed scenarios:
  none

### Alternative Considerations

- Ignore Qlty findings:
  rejected because technical debt is measurable
- Large single refactor:
  rejected because reviewability drops

### Approval Impact Decisions

- Approval evidence owner:
  TASKS.md `Human Approval`
- Scope changes requiring re-approval:
  runtime behavior changes, parser changes, dependency upgrades, or
  `engines.vscode` changes
- Slice-1A boundary decision:
  split controller orchestration only; do not introduce presenters, change
  graph DTO contracts, or move layout rules across the application boundary.
- Slice-1B-A boundary decision:
  extract visual-state/style helpers only; do not change rendered actions,
  node data flags, expanded nested panel dimensions, search highlighting, or
  ReactFlow node/edge construction.
- Slice-1B-B boundary decision:
  extract header presentation helpers or subcomponents only; do not change menu
  state, drawer width behavior, breadcrumb navigation, `Cmd/Ctrl+F` focus
  behavior, search submit/clear timing, expand-all enablement, or current-unit
  label semantics.
- Slice-1B-C boundary decision:
  extract drawer/tree presentation helpers or subcomponents only; do not change
  `menuItem1` open/close behavior, ResizeObserver drawer-width updates,
  selected-current-unit updates, ancestor detection, root-unit filtering, or
  group/root-jobnet rendering semantics.
- Slice-1B-D boundary decision:
  extract growth-offset calculation helpers only; do not change visible
  node/edge membership, expanded nested unit processing order, target unit
  selection, offset formulas, collision direction, panel dimensions,
  `positionOverrides`, or `nodeDecorations`.
- Slice-1B-E boundary decision:
  extract sibling-subtree collision helpers only; do not change subtree
  movement rules, same-container sibling filtering, right/down offset behavior,
  occupied item updates, panel dimensions, `positionOverrides`, or
  `nodeDecorations`. Do not change parser/generated artifacts, graph DTOs,
  ReactFlow node data shape, dependencies, or VS Code compatibility.
- Slice-1B-F boundary decision:
  extract lower expanded panel intrusion helpers only; do not change upper/lower
  child ordering, panel bound calculations, horizontal overlap behavior,
  vertical push distance, `positionOverrides`, or `nodeDecorations`. Do not
  change parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-G boundary decision:
  extract expanded panel bounds helpers only; do not change visible unit
  filtering, descendant containment, panel offset constants, panel dimension
  calculations, `positionOverrides`, or `nodeDecorations`. Do not change
  parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-H boundary decision:
  extract upper panel max-right helpers only; do not change expanded child
  ordering, panel bound calculations, horizontal growth offset formulas,
  `positionOverrides`, or `nodeDecorations`. Do not change parser/generated
  artifacts, graph DTOs, ReactFlow node data shape, dependencies, or VS Code
  compatibility.
- Slice-1B-H approval-sensitive scope:
  implementation may reduce parameter count and split upper panel candidate
  eligibility or aggregation helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, or `engines.vscode`
  requires separate approval.
- Slice-1B-I boundary decision:
  extract `relayoutExpandedScope` orchestration helpers only; do not change
  recursive expansion ordering, panel bound calculations, growth offset
  formulas, collision direction, `positionOverrides`, or `nodeDecorations`. Do
  not change parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-I approval-sensitive scope:
  implementation may extract expanded child discovery, recursive child
  relayout/decorate sequencing, growth target id selection, and
  per-expanded-child growth application helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, growth offset formulas, or
  `engines.vscode` requires separate approval.
- Slice-1B-J boundary decision:
  extract `isDescendantOf` parent-chain traversal helpers only; do not change
  ancestor matching semantics, missing-parent behavior, visible unit filtering,
  panel bound calculations, `positionOverrides`, or `nodeDecorations`. Do not
  change parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-J approval-sensitive scope:
  implementation may extract parent lookup, parent-chain advancement, and
  ancestor matching helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts` while keeping
  `isDescendantOf` exported with the same signature. Any change to generated
  parser artifacts, application flow graph DTOs, ReactFlow node data shape,
  dependency versions, VS Code compatibility, panel bound calculations,
  position override behavior, or `engines.vscode` requires separate approval.
- Slice-1B-K boundary decision:
  extract anchored descendant synchronization helpers only; do not change
  parent-anchor semantics, nested position formulas, offset behavior,
  `positionOverrides`, or `nodeDecorations`. Do not change parser/generated
  artifacts, graph DTOs, ReactFlow node data shape, dependencies, or VS Code
  compatibility.
- Slice-1B-K approval-sensitive scope:
  implementation may extract anchored child discovery, anchored child
  synchronization, and recursive traversal helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, nested position formulas,
  offset accumulation, or `engines.vscode` requires separate approval.
- Slice-1B-L boundary decision:
  extract expanded-edge append helpers only; do not change edge DTO shape,
  edge id generation, duplicate filtering, visible edge membership,
  `positionOverrides`, or `nodeDecorations`. Do not change parser/generated
  artifacts, graph DTOs, ReactFlow node data shape, dependencies, or VS Code
  compatibility.
- Slice-1B-L approval-sensitive scope:
  implementation may extract edge id creation, duplicate-edge checks, and
  append/record helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  `toEdgeDtos`, generated parser artifacts, application flow graph DTOs,
  ReactFlow node data shape, dependency versions, VS Code compatibility,
  visible node/edge membership, position override behavior, or
  `engines.vscode` requires separate approval.
- Slice-1B-M boundary decision:
  extract nested reveal orchestration helpers only; do not change missing
  expanded-position skip behavior, child filtering, condition selection,
  parent anchor semantics, nested position formulas, expanded edge append
  timing, visible node/edge membership, `positionOverrides`, or
  `nodeDecorations`. Do not change parser/generated artifacts, graph DTOs,
  ReactFlow node data shape, dependencies, or VS Code compatibility.
- Slice-1B-M approval-sensitive scope:
  implementation may extract display-position guard, visible child discovery,
  condition discovery, and child/condition reveal helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, nested position formulas,
  expanded edge append order, visible node/edge membership, or
  `engines.vscode` requires separate approval.
- Slice-1B-N boundary decision:
  extract display-position collection helpers only; do not change
  `getDisplayPosition`, visible-unit membership or ordering, missing-position
  skip behavior, `positionsBeforeOffset` snapshot semantics, offset formulas,
  `positionOverrides`, or `nodeDecorations`. Do not change parser/generated
  artifacts, graph DTOs, ReactFlow node data shape, dependencies, or VS Code
  compatibility.
- Slice-1B-N approval-sensitive scope:
  implementation may extract visible-unit display-position resolution and map
  insertion helpers inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, visible node/edge
  membership, offset formulas, position override precedence, or
  `engines.vscode` requires separate approval.
- Slice-1B-O boundary decision:
  extract `includeNodeBounds` input grouping only; do not change bound
  min/max formulas, node width/height source, decoration bounds inclusion,
  panel offset constants, panel dimension calculations, `positionOverrides`,
  or `nodeDecorations`. Do not change parser/generated artifacts, graph DTOs,
  ReactFlow node data shape, dependencies, or VS Code compatibility.
- Slice-1B-O approval-sensitive scope:
  implementation may introduce a local input object/type for node bounds and
  update the single `includePanelBoundsLayoutItem` call site inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, bounds formulas, panel
  dimensions, visible node/edge membership, or `engines.vscode` requires
  separate approval.
- Slice-1B-P boundary decision:
  extract `addVisibleNode` input grouping only; do not change node DTO
  creation, node ordering, visible-unit membership, initial position storage,
  parent anchor semantics, display-position synchronization,
  `positionOverrides`, or `nodeDecorations`. Do not change parser/generated
  artifacts, graph DTOs, ReactFlow node data shape, dependencies, or VS Code
  compatibility.
- Slice-1B-P approval-sensitive scope:
  implementation may introduce a local input object/type for visible node
  registration and update the single `ensureVisibleNestedNode` call site inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, node DTO mapping, visible
  node/edge membership, parent anchor behavior, position override behavior, or
  `engines.vscode` requires separate approval.
- Slice-1B-Q boundary decision:
  extract `ensureVisibleNestedNode` input grouping only; do not change
  existing-position reuse, duplicate-node skip behavior, position calculation
  timing, child/condition position formulas, visible-node registration, parent
  anchors, `positionOverrides`, or `nodeDecorations`. Do not change
  parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-Q approval-sensitive scope:
  implementation may introduce a local input object/type for nested visibility
  and update `ensureChildNodeVisible` and `ensureConditionNodeVisible` call
  sites inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any change to
  generated parser artifacts, application flow graph DTOs, ReactFlow node data
  shape, dependency versions, VS Code compatibility, nested position formulas,
  visible node/edge membership, parent anchor behavior, position override
  behavior, or `engines.vscode` requires separate approval.
- Slice-1B-R boundary decision:
  extract `applyGrowthOffsets` input grouping only; do not change zero-growth
  no-op behavior, display-position snapshot timing, target unit selection,
  horizontal or vertical growth formulas, offset application through
  `addOffset`, `positionOverrides`, or `nodeDecorations`. Do not change
  parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-R approval-sensitive scope:
  implementation may introduce a local input object/type for growth offset
  application and update the single `applyExpandedChildGrowthOffset` call site
  inside `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts`. Any
  change to generated parser artifacts, application flow graph DTOs, ReactFlow
  node data shape, dependency versions, VS Code compatibility, growth
  calculations, visible node/edge membership, position override behavior, or
  `engines.vscode` requires separate approval.
- Slice-1B-S boundary decision:
  extract panel-subtree bounds collection helpers only; do not change missing
  parent-position skip behavior, visible-unit iteration order, expanded panel
  bounds unit filtering, node or decoration bounds inclusion, panel padding
  formulas, `positionOverrides`, or `nodeDecorations`. Do not change
  parser/generated artifacts, graph DTOs, ReactFlow node data shape,
  dependencies, or VS Code compatibility.
- Slice-1B-S approval-sensitive scope:
  implementation may extract helper(s) used by `buildExpandedPanelBounds`
  inside `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts` to reduce
  total complexity. Any change to generated parser artifacts, application flow
  graph DTOs, ReactFlow node data shape, dependency versions, VS Code
  compatibility, panel bound formulas, visible node/edge membership,
  position override behavior, or `engines.vscode` requires separate approval.
- Slice-1B-T boundary decision:
  extract expanded node decoration update helper(s) only; do not change
  expanded unit position lookup, panel bounds calculation timing, missing
  position/panel-bounds skip behavior, decoration mapping formulas,
  `nodeDecorations` keying, `positionOverrides`, or recursive expansion
  ordering. Do not change parser/generated artifacts, graph DTOs, ReactFlow
  node data shape, dependencies, or VS Code compatibility.
- Slice-1B-T approval-sensitive scope:
  implementation may extract helper(s) used by `updateExpandedNodeDecoration`
  inside `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts` to reduce
  total complexity. Any change to generated parser artifacts, application flow
  graph DTOs, ReactFlow node data shape, dependency versions, VS Code
  compatibility, panel bound formulas, visible node/edge membership,
  `positionOverrides`, `nodeDecorations`, or `engines.vscode` requires
  separate approval.
- Slice-1B-U boundary decision:
  extract sibling-collision iteration helper(s) only; do not change visible
  immediate child selection, target ordering, fixed sibling semantics, movement
  direction, offset magnitude, subtree movement through `addOffset`,
  `positionOverrides`, or `nodeDecorations`. Do not change parser/generated
  artifacts, graph DTOs, ReactFlow node data shape, dependencies, or VS Code
  compatibility.
- Slice-1B-U approval-sensitive scope:
  implementation may extract helper(s) used by
  `resolveSiblingSubtreeCollisions` inside
  `src/ui-component/editor/ajsFlow/expandedFlowGraphLayout.ts` to reduce total
  complexity. Any change to generated parser artifacts, application flow graph
  DTOs, ReactFlow node data shape, dependency versions, VS Code compatibility,
  collision formulas, visible node/edge membership, `positionOverrides`,
  `nodeDecorations`, or `engines.vscode` requires separate approval.
- Slice-2 boundary decision:
  investigation may inspect application orchestration in
  `src/application/flow-graph` and `src/application/unit-list`, but runtime
  implementation requires a fresh approval gate with one concrete target.
  Parser/generated artifacts, presentation behavior, DTO contracts,
  dependencies, VS Code compatibility, web compatibility, and `engines.vscode`
  must remain unchanged unless separately approved.
- Slice-2-A boundary decision:
  extract linked-unit projection helper(s) only; do not change parent lookup,
  relation filtering direction, relation order, missing related-unit skip
  behavior, relation type projection, `UnitListLinkedUnitView`,
  `UnitListRowView`, parser/generated artifacts, presentation components,
  dependencies, VS Code compatibility, web compatibility, or
  `engines.vscode`.
- Slice-2-A approval-sensitive scope:
  implementation may add local helper(s) in
  `src/application/unit-list/buildUnitListLinkedUnits.ts` and adjust only the
  internal implementation of `buildUnitListLinkedUnits`. Any change to
  exported DTO shapes, callers outside the existing function signature,
  parser/generated artifacts, presentation behavior, dependency versions, VS
  Code compatibility, web compatibility, or `engines.vscode` requires separate
  approval.
- Slice-2-B boundary decision:
  extract priority resolution helper(s) only; do not change cache lookup/write
  semantics, supported target unit filtering, `pr`/`ni` parsing and precedence,
  `toNiPriority` conversion, parent jobnet inheritance, fallback value,
  exported DTO shapes, parser/generated artifacts, presentation behavior,
  dependencies, VS Code compatibility, web compatibility, or
  `engines.vscode`.
- Slice-2-B approval-sensitive scope:
  implementation may add local helper(s) or local input types inside
  `src/application/unit-list/unitListViewHelpers.ts` while preserving
  `getPriorityForUnitTypes` exported signature and its callers. Any change to
  `buildUnitListGroup7View`, `buildUnitListGroup11View`, exported DTO shapes,
  parser/generated artifacts, presentation behavior, dependency versions, VS
  Code compatibility, web compatibility, or `engines.vscode` requires separate
  approval.
- Slice-2-C boundary decision:
  extract group projection helper(s) only; do not change previous/next
  linked-unit passthrough, parent path and layout formatting, unit-type gated
  fields, default-aware group13/group14 values, QUEUE transfer-operation
  hiding, `UnitListRowView`, `UnitListGroup*View`, parser/generated artifacts,
  presentation behavior, dependencies, VS Code compatibility, web
  compatibility, or `engines.vscode`.
- Slice-2-C approval-sensitive scope:
  implementation may add local helper(s) or local input types inside
  `src/application/unit-list/buildUnitListRemainingGroups.ts` while preserving
  `buildUnitListRemainingGroups` exported signature and its callers. Any
  change to `buildUnitListView`, exported DTO shapes, parser/generated
  artifacts, presentation behavior, dependency versions, VS Code
  compatibility, web compatibility, or `engines.vscode` requires separate
  approval.
- Slice-2-D boundary decision:
  clean up default-aware helper inputs and group13 wait-job unit-type
  membership only; do not change default-aware lookup semantics, fallback
  defaults, wait-job unit-type membership, group13/group14 output,
  `UnitListRowView`, `UnitListGroup*View`, parser/generated artifacts,
  presentation behavior, dependencies, VS Code compatibility, web
  compatibility, or `engines.vscode`.
- Slice-2-D approval-sensitive scope:
  implementation may add local helper(s), local constants, or local input
  types inside `src/application/unit-list/buildUnitListRemainingGroups.ts`
  while preserving `buildUnitListRemainingGroups` exported signature and its
  callers. Any change to `buildUnitListView`, exported DTO shapes,
  parser/generated artifacts, presentation behavior, dependency versions, VS
  Code compatibility, web compatibility, or `engines.vscode` requires separate
  approval.
- Slice-2-E boundary decision:
  extract string literal parsing helper(s) only; do not change quote-boundary
  validation, `#"` and `##` decoding, invalid `#` escape rejection, unescaped
  inner quote rejection, returned decoded content, diagnostic messages,
  parser/generated artifacts, presentation behavior, dependencies, VS Code
  compatibility, web compatibility, or `engines.vscode`.
- Slice-2-E approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside
  `src/application/editor-feedback/syntaxDiagnosticStringValidators.ts` while
  preserving the exported `parseHashEscapedQuotedStringLiteralContent`
  signature and its callers. Any change to
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`, diagnostic
  message text, parser/generated artifacts, presentation behavior, dependency
  versions, VS Code compatibility, web compatibility, or `engines.vscode`
  requires separate approval.
- Slice-2-F boundary decision:
  extract event receiving timeout-condition helper(s) only; do not change
  omitted/empty rejection, bare `n` and `a` acceptance, colon-separated mode
  parsing, allowed modes `n`, `a`, `d`, and `b`, quoted hash-escaped file-name
  parsing, decoded file-name byte-length range 1..256, diagnostic messages,
  parser/generated artifacts, presentation behavior, dependencies, VS Code
  compatibility, web compatibility, or `engines.vscode`.
- Slice-2-F approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` while
  preserving the exported `isValidExplicitEventReceivingTimeoutCondition`
  signature and its caller. Any change to
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`, diagnostic
  message text, parser/generated artifacts, presentation behavior, dependency
  versions, VS Code compatibility, web compatibility, or `engines.vscode`
  requires separate approval.
- Slice-2-G boundary decision:
  extract event receiving filter-reference helper(s) only; do not change
  omitted/empty rejection, whole-value byte-length range 1..2048, first-colon
  separator behavior, non-empty attribute-name requirement, quoted
  hash-escaped attribute-value validation, diagnostic messages,
  parser/generated artifacts, presentation behavior, dependencies, VS Code
  compatibility, web compatibility, or `engines.vscode`.
- Slice-2-G approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` while
  preserving the exported `isValidExplicitEventReceivingFilterReference`
  signature and its caller. Any change to
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`, diagnostic
  message text, parser/generated artifacts, presentation behavior, dependency
  versions, VS Code compatibility, web compatibility, or `engines.vscode`
  requires separate approval.
- Slice-2-H boundary decision:
  extract IPv4 validation helper(s) only; do not change omitted/empty
  rejection, dotted-decimal four-octet requirement, decimal digits only,
  numeric range 0..255 for each octet, diagnostic messages, parser/generated
  artifacts, presentation behavior, dependencies, VS Code compatibility, web
  compatibility, or `engines.vscode`.
- Slice-2-H approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside `src/application/editor-feedback/syntaxDiagnosticEventRules.ts` while
  preserving the exported `isValidExplicitIpv4Address` signature and its
  caller. Any change to
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`, diagnostic
  message text, parser/generated artifacts, presentation behavior, dependency
  versions, VS Code compatibility, web compatibility, or `engines.vscode`
  requires separate approval.
- Slice-2-I boundary decision:
  extract file monitoring wildcard/interval helper(s) only; do not change
  wildcard detection, effective `flwi` lookup with `DEFAULTS.Flwi` fallback,
  decimal-only interval parsing, short interval range 1..9, diagnostic
  messages, parser/generated artifacts, presentation behavior, dependencies,
  VS Code compatibility, web compatibility, or `engines.vscode`.
- Slice-2-I approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside
  `src/application/editor-feedback/syntaxDiagnosticFileMonitoringRules.ts`
  while preserving the exported
  `hasInvalidWildcardWithShortMonitoringInterval` signature and its caller.
  Any change to `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`,
  diagnostic message text, parser/generated artifacts, presentation behavior,
  dependency versions, VS Code compatibility, web compatibility, or
  `engines.vscode` requires separate approval.
- Slice-2-J boundary decision:
  extract hexadecimal scalar validation helper(s) only; do not change
  omitted/empty rejection, 1..8 hexadecimal digit validation, case-insensitive
  parsing, inclusive minimum/maximum range checks, returned numeric value for
  valid input, `undefined` for invalid input, diagnostic messages,
  parser/generated artifacts, presentation behavior, dependencies, VS Code
  compatibility, web compatibility, or `engines.vscode`.
- Slice-2-J approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside
  `src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts` while
  preserving the exported `parseExplicitHexadecimalInRange` signature and its
  callers. Any change to
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`,
  `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`, diagnostic
  message text, parser/generated artifacts, presentation behavior, dependency
  versions, VS Code compatibility, web compatibility, or `engines.vscode`
  requires separate approval.
- Slice-2-K boundary decision:
  extract decimal scalar validation helper(s) only; do not change
  omitted/empty rejection, decimal digit validation, optional negative sign
  behavior when `allowNegative` is true, inclusive minimum/maximum range
  checks, returned numeric value for valid input, `undefined` for invalid
  input, diagnostic messages, parser/generated artifacts, presentation
  behavior, dependencies, VS Code compatibility, web compatibility, or
  `engines.vscode`.
- Slice-2-K approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside
  `src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts` while
  preserving the exported `parseExplicitDecimalInRange` signature and its
  callers. Any change to
  `src/application/editor-feedback/syntaxDiagnosticCore.ts`,
  `src/application/editor-feedback/syntaxDiagnosticJobEndRules.ts`,
  `src/application/editor-feedback/syntaxDiagnosticEventRules.ts`,
  `src/application/editor-feedback/syntaxDiagnosticFileMonitoringRules.ts`,
  diagnostic message text, parser/generated artifacts, presentation behavior,
  dependency versions, VS Code compatibility, web compatibility, or
  `engines.vscode` requires separate approval.
- Slice-2-L boundary decision:
  extract command argument resolution helper(s) only; do not change
  `argumentFieldId` lookup, missing or non-text argument-field fallback,
  `fieldValue` explicit/default value semantics, value trimming, empty
  argument omission, `formatArgument` quoting/spacing, command token order,
  exported DTO shapes, parser/generated artifacts, presentation behavior,
  dependencies, VS Code compatibility, web compatibility, or
  `engines.vscode`.
- Slice-2-L approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside `src/application/unit-definition/buildAjsCommands.ts` while
  preserving exported `buildCommandLine` and
  `UnitDefinitionCommandBuilderDto` contracts. Any change to
  `src/application/unit-definition/buildUnitDefinition.ts`,
  `src/ui-component/editor/UnitEntityDialog.tsx`, parser/generated artifacts,
  presentation behavior, dependency versions, VS Code compatibility, web
  compatibility, or `engines.vscode` requires separate approval.
- Slice-2-M boundary decision:
  extract command-line token construction helper(s) only; do not change
  exported `buildCommandLine` signature, default field value resolution,
  checkbox option emission, independent text option and argument emission,
  select choice lookup, select token emission order, argument-field token
  emission, target token emission, `formatArgument` quoting/escaping,
  command-builder DTO shapes, parser/generated artifacts, presentation
  behavior, dependencies, VS Code compatibility, web compatibility, or
  `engines.vscode`.
- Slice-2-M approval-sensitive scope:
  implementation may add local helper(s), local constants, or local types
  inside `src/application/unit-definition/buildAjsCommands.ts` while
  preserving exported `buildCommandLine` and
  `UnitDefinitionCommandBuilderDto` contracts. Any change to
  `src/application/unit-definition/buildUnitDefinition.ts`,
  `src/ui-component/editor/UnitEntityDialog.tsx`, command output text,
  parser/generated artifacts, presentation behavior, dependency versions, VS
  Code compatibility, web compatibility, or `engines.vscode` requires separate
  approval.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility:
  every slice must preserve browser execution
- Desktop extension compatibility:
  every slice must preserve desktop execution

## Acceptance Criteria

- Target files show lower Qlty complexity or smell counts after each slice
- All required tests remain green
- No observable product behavior changes

## Non-Goals

- Feature additions
- Runtime redesign
- Parser modernization

## Open Questions

- After Slice-2-M, should Slice-2 continue with command-builder duplication,
  editor-feedback diagnostic helper findings, or remaining unit-list helper
  findings?
