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

- After Slice-1B-A, should the next component slice target `Header` or
  `FlowSelector` before deeper expanded-layout helpers?
