# Feature Specification: Flow Search and Viewer Interaction State Separation

## Purpose

Isolate flow scope, selection, current-scope search, reveal, focus restoration,
and viewport state transitions from graph rendering while preserving the
observable Explore Flow Graph behavior.

## Minimal Context

- Current decision: define one presentation-owned interaction-state boundary
  that can evolve independently from the flow graph renderer.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap source: `docs/specs/roadmap.md` item 7.2, Flow Search and Viewer
  Interaction State Separation.
- Source use case:
  `docs/requirements/use-cases/uc-explore-flow-graph.md`.
- Related use case:
  `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`.
- Shared evidence: `docs/specs/features/BASELINE.md` flow webview targets.
- JP1/AJS source reference: not applicable. This feature preserves existing
  presentation-local viewer behavior and does not interpret a JP1/AJS command
  or definition/configuration format.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: Flow scope, selected unit, active search result, hovered unit, pending
  reveal/focus request, and viewport intent remain explicit and distinct state
  concepts.
- R2: Current-scope search preserves case-insensitive contiguous partial
  matching across unit name, comment, and path, including revealing collapsed
  ancestors needed to display a match.
- R3: Search-result navigation preserves the active flow scope and zoom while
  centering the current result and distinguishing it from other matches.
- R4: Explicit scope transitions preserve the defined selection and focus
  destination after the destination graph is ready; synchronized selection,
  hover, or reveal must not implicitly change scope.
- R5: Graph rerendering, expansion, panel changes, and cross-view reveal
  requests preserve or restore meaningful selection, focus, and viewport
  behavior using stable unit identity and defined fallbacks.
- R6: Interaction-state transitions are presentation-owned and can be tested
  without depending on ReactFlow rendering objects or parser internals.
- R7: Existing search, viewer-operation, and privacy-safe telemetry outcomes
  remain unchanged unless a later approved slice explicitly identifies a
  contract correction.

## Architecture

- Domain: none; no JP1/AJS model or rule changes.
- Application: preserve the existing flow-graph DTO, stable navigation
  identity, and telemetry contracts; do not move presentation interaction
  state into an application use case.
- Presentation: own flow interaction state and transitions behind an explicit
  presentation-local boundary; keep the graph renderer responsible only for
  rendering input and executing presentation viewport/focus effects.
- Infrastructure: none; no host, parser, storage, or telemetry-adapter changes
  are part of this feature.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: expected
  targets include `FlowContents.tsx`, `useFlowSearchState.ts`,
  `useFlowViewerController.ts`, `useFlowViewerEffects.ts`,
  `flowViewportFocus.ts`, their focused tests, and the Explore Flow Graph use
  case only if implementation reveals a durable behavior clarification.
- Propagation decision: interaction-state transitions and their renderer-facing
  effects may change together; the application flow-graph contract, graph
  geometry constraints, VS Code message transport, and parser behavior remain
  unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended; this is a behavior-preserving boundary
  separation.
- API/DTO/schema compatibility: existing application DTOs and viewer message
  schemas remain unchanged.
- VS Code/web extension compatibility: no minimum VS Code change and no
  Node-specific production dependency.
- Changed scenarios: none intended; existing Explore Flow Graph scenarios are
  regression contracts.

### Alternative Considerations

- Keep state transitions distributed across renderer-facing React hooks:
  rejected because scope, search, reveal, focus, and viewport coordination
  cannot then be validated independently from rendering.
- Create a shared table/flow search domain contract: rejected because roadmap
  item 7.4 and the deferred Shared Search Use Case own those separate decisions.
- Combine renderer and detail separation from roadmap item 7.1: rejected
  because rendering and interaction state have independent approval and
  regression boundaries.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: user-visible matching or navigation
  changes, application DTO or telemetry contract changes, viewer message
  schema changes, shared header-search extraction, flow-tree interaction work,
  or graph rendering/detail refactors.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: preserve browser-safe presentation code and the
  existing flow exploration behavior without Node built-ins.
- Desktop extension compatibility: preserve the same search, reveal, focus,
  scope-transition, and viewport semantics as the web extension.
- Existing JP1/AJS definition files remain compatible because parsing and
  flow-graph meaning do not change.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Each state concept in R1 has a single explicit presentation owner and a
  documented transition boundary.
- Search, result navigation, ancestor reveal, scope transition, focus
  restoration, selection synchronization, and viewport intent can be tested
  independently from ReactFlow rendering objects.
- Existing focused flow-search, scope, viewer-effect, viewport-focus,
  integration, accessibility, and telemetry tests continue to pass or are
  updated only to express the same observable behavior through the new
  boundary.
- Application flow-graph DTOs, parser behavior, viewer transport schemas, and
  the declared VS Code compatibility floor remain unchanged.
- Desktop and web builds preserve equivalent interaction semantics and no
  production source imports Node built-ins.

## Non-Goals

- graph rendering, node presentation, or detail-action separation owned by
  roadmap item 7.1
- shared header-search control extraction owned by roadmap item 7.4
- flow-tree selector keyboard and row-state separation owned by roadmap item
  7.5
- a shared table/flow search domain contract or new matching semantics
- changes to JP1/AJS parsing, flow-graph meaning, graph placement constraints,
  viewer transport, telemetry vocabulary, or user-visible behavior

## Open Questions

- None. The implementation plan separates atomic scope/search/reveal state,
  viewer-level selection/focus intent, and ReactFlow viewport execution into
  three dependent slices while preserving the independent 7.1, 7.4, and 7.5
  roadmap scopes.
