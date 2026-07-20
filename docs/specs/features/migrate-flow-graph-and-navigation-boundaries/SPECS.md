# Feature Specification: Migrate Flow Graph And Navigation Boundaries

## Purpose

Make flow building, exploration, and list/flow navigation share normalized
identity and application graph contracts while keeping viewport, geometry, and
interaction state in presentation.

## Minimal Context

- Current decision: establish one stable graph/navigation boundary.
- Read first: this file, `TASKS.md`, and the three related use cases.
- Do not create `CONTEXT.md`.

## Origin

- Source use cases: `uc-build-flow-graph.md`, `uc-explore-flow-graph.md`, and
  `uc-navigate-between-unit-list-and-flow-graph.md`.
- Source: complete migration directive Slice 5.
- JP1/AJS source reference: existing definition relation/hierarchy behavior and
  durable use cases; undocumented layout behavior is repository-observed
  presentation compatibility evidence.
- Dependencies: normalized domain model and unit-information identity contract.

## Requirements

- Build Flow Graph consumes normalized domain inputs and produces a host-neutral
  application graph DTO.
- Explore Flow Graph separates application graph decisions from presentation
  selection, viewport, zoom, expansion, and geometry state.
- Cross-view navigation uses one stable identity contract.
- Graph, tree, and list paths do not exchange raw models, wrappers, or private
  presentation state.
- Layout constraints remain application/domain data only where they express
  shared meaning; concrete geometry remains presentation-owned.

## Architecture

- Domain: own stable identity, hierarchy, relations, and shared constraints.
- Application: own graph construction and navigation contracts.
- Presentation: own XyFlow types, layout geometry, viewport, selection, search
  interaction, and host routing.
- Infrastructure: none.

## Impact Analysis

### Dependency Impact

- Affected surface: graph DTO builder, expanded graph presentation, viewer
  bridge, list/flow navigation, selection/reveal routing, and tests.
- Propagation decision: serialization mechanics stay in the serialization
  feature while payload shape must remain compatible.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal graph and navigation DTOs may change.
- VS Code/web extension compatibility: both viewer hosts and reveal flows must
  remain supported.
- Changed scenarios: none.

### Alternative Considerations

- Move XyFlow geometry into application: rejected as presentation coupling.
- Preserve wrapper identity between viewers: rejected in favor of normalized
  stable identity.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Node/edge content, expansion, search, selection, zoom, or navigation behavior
  changes require replanning and approval.

## Compatibility

- Preserve minimum VS Code version and desktop/web graph nodes, edges, scope,
  expansion, search, selection, zoom, and navigation behavior.

## Acceptance Criteria

- All three use cases have explicit application entry points/contracts.
- Presentation consumes graph/navigation DTOs without raw or wrapper access.
- Existing graph and navigation regression scenarios pass on desktop and web.

## Non-Goals

- New graph features, visual redesign, or layout optimization for its own sake.

## Open Questions

- Inventory and planning must classify each current layout constraint as shared
  meaning or presentation geometry.
