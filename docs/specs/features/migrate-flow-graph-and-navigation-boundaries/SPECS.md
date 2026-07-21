# Feature Specification: Migrate Flow Graph And Navigation Boundaries

## Purpose

Make flow building, exploration, and list/flow navigation share normalized
identity and application graph contracts while keeping viewport, geometry, and
interaction state in presentation.

## Minimal Context

- Current decision: plan one stable graph/exploration/navigation boundary after
  the normalized domain and unit-information contracts were completed.
- Read first: this file, `TASKS.md`, and the three related use cases.
- Do not create `CONTEXT.md`.

## Origin

- Source use cases: `uc-build-flow-graph.md`, `uc-explore-flow-graph.md`, and
  `uc-navigate-between-unit-list-and-flow-graph.md`.
- Source: complete migration directive Slice 5.
- JP1/AJS source reference: existing definition relation/hierarchy behavior and
  durable use cases; undocumented layout behavior is repository-observed
  presentation compatibility evidence.
- Dependencies: completed normalized domain model and unit-information identity
  contract.

## Requirements

- R1. Build Flow Graph consumes normalized domain inputs and produces a host-neutral
  application graph DTO.
- R2. Explore Flow Graph separates application graph decisions from presentation
  selection, viewport, zoom, expansion, and geometry state.
- R3. Cross-view navigation uses one stable identity contract.
- R4. Graph, tree, and list paths do not exchange raw models, wrappers, or private
  presentation state.
- R5. Layout constraints remain application data where they express
  shared meaning; concrete geometry remains presentation-owned.
- R6. Invalid serialized graph data or unresolved scope/navigation targets fail
  closed without fabricating graph content or changing the current viewer.

## Architecture

- Domain: own normalized stable identity, hierarchy, relation facts, and their
  reusable invariants.
- Application: own graph construction, shared structural placement constraints,
  issue/result DTOs, and navigation contracts derived from domain facts.
- Presentation: own XyFlow types, layout geometry, viewport, selection, search
  interaction, and host routing.
- Infrastructure: none.

### Layout Responsibility Classification

- Shared graph meaning: stable identity, hierarchy, relations, active scope,
  visible nested set, containment, sibling order, placement constraints, and
  affected-subtree membership.
- Presentation geometry: font-relative metrics, X/Y coordinates, node and
  panel dimensions, rendered bounds, collision realization, viewport fitting,
  centering, and zoom.
- Presentation interaction: search query/result state, selection, hover,
  relationship focus, panel state, and expansion controls. The visible nested
  set is passed to the application graph builder without moving those controls
  inward.

### Failure Result Classification

- Duplicate identity/path, inconsistent parent/child hierarchy, parent cycles,
  or invalid layout values make the serialized flow document unavailable. The
  application returns issue evidence and presentation must not retain or render
  a plausible partial graph.
- A malformed relation is isolated: the invalid edge is omitted and reported,
  while otherwise valid document content remains available. No replacement or
  inferred edge is fabricated.
- A missing or invalid active graph scope returns an unavailable graph result.
- Missing, duplicate, or out-of-scope IDs in the requested visible nested set
  are omitted with issue evidence; constraints are built from the complete
  normalized valid set and are never returned partially for an invalid scope.
- Invalid or unavailable navigation input returns a typed no-target result and
  does not change, clear, or refocus the current viewer.

## Impact Analysis

### Dependency Impact

- Affected surface: serialized viewer document projection and validation, graph
  DTO builder, expanded graph structure and presentation geometry, shared unit
  tree, flow search/detail/selection consumers, viewer bridge, list/flow
  navigation, selection/reveal routing, localization, architecture allowances,
  telemetry-preservation tests, and graph/navigation regression tests.
- Propagation decision: serialization mechanics stay in the serialization
  feature while payload shape must remain compatible.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal graph and navigation DTOs may change.
- VS Code/web extension compatibility: both viewer hosts and reveal flows must
  remain supported.
- Changed scenarios: none.
- Undocumented compatibility evidence: expanded layout is determined by the
  complete expanded-unit set rather than the last expansion action; pending
  counterpart reveals use the latest requested path; search/tree centering
  preserves zoom; job-group reveal resolves to the first descendant root
  jobnet in stable tree order; a direct condition parent is a valid scope.

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
- Preserve semantic-diff highlight metadata, tree/graph synchronization,
  navigation telemetry, flow build/render telemetry, and serialized wire field
  names unless a reviewed slice proves a backward-safe additive field is
  required.

## Acceptance Criteria

- AC1. All three use cases have explicit application entry points/contracts.
- AC2. Presentation consumes graph/navigation DTOs without raw or wrapper access.
- AC3. Existing graph and navigation regression scenarios pass on desktop and
  web.
- AC4. All 25 exact presentation-domain allowances owned by this feature are removed
  with their production imports; allowances owned by later features remain.

## Non-Goals

- New graph features, visual redesign, or layout optimization for its own sake.

## Open Questions

- None. Planning classifies structural placement requirements as application
  constraints and all pixel/bounds/collision realization as presentation
  geometry.
