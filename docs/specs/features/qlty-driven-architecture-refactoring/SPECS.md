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
  `nodeDecorations` semantics.

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
  `nodeDecorations`.

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

- After Slice-1B-C, should the next slice target deeper
  `expandedFlowGraphLayout` helpers?
