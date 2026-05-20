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

- After Slice-1B-J, should the next slice target
  `syncAnchoredDescendantOverrides` before the remaining low-complexity helper
  cleanup?
