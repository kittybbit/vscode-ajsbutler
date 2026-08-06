# Feature Specification: Webview Flow-graph Presentation Separation

## Purpose

Separate flow-graph rendering, detail actions, and visual state from
application-owned graph meaning at the selected React/webview boundary without
changing observable flow-viewer behavior.

## Minimal Context

- Current decision: define a presentation-only boundary that consumes the
  existing flow-graph DTO and owns XyFlow rendering, detail presentation, and
  visual-state mapping while leaving flow interaction state, shared search,
  table presentation, and flow-tree interaction to roadmap features 7.2
  through 7.5.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy and
  `../BASELINE.md` Intake group 3 for shared evidence.

## Origin

- Roadmap item: `docs/specs/roadmap.md` 7.1 Flow-graph Rendering and Detail
  Presentation Separation.
- Source use cases:
  - `docs/requirements/use-cases/uc-build-flow-graph.md`
  - `docs/requirements/use-cases/uc-explore-flow-graph.md`
  - `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`
- Shared evidence: `docs/specs/features/BASELINE.md` Intake group 3.
- JP1/AJS source reference: not applicable. This feature does not change JP1/AJS
  commands or definition/config interpretation; its behavior basis is the
  existing repository use cases and characterization evidence.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: Preserve application-owned flow-graph identity, ordering, containment,
  relationship meaning, and placement constraints.
- R2: Keep conversion from application flow-graph DTOs to XyFlow nodes, edges,
  coordinates, bounds, styles, and rendered dimensions in presentation.
- R3: Keep node detail rows, detail actions, relationship-focus controls, and
  other display decisions in presentation without importing domain, parser, or
  infrastructure types.
- R4: Preserve graph node and edge realization, nested-panel bounds,
  non-overlap, unaffected-region stability, selection, focus, and relationship
  emphasis for existing scenarios.
- R5: Preserve explicit unit-definition, scope-opening, and flow-to-unit-list
  actions without changing their application-facing navigation contracts or
  user-visible triggers.
- R6: Keep the selected boundary browser-safe and behaviorally equivalent in
  desktop and web extension hosts.
- R7: Record measurable before/after evidence for the selected responsibility
  without treating repository-wide complexity thresholds as acceptance gates.

## Architecture

- Domain: unchanged; continues to own reusable JP1/AJS business meaning and
  must not acquire rendering concepts.
- Application: continues to own host-neutral flow-graph DTOs, stable identity,
  relationship meaning, ordering, containment, and placement constraints.
- Presentation: owns DTO-to-renderer mapping, coordinates, bounds, styling,
  detail presentation, visual emphasis, and direct React/XyFlow rendering and
  DOM realization. Slice 1 creates one presentation-owned
  `FlowNodePresentationModel` as the DTO-derived renderer projection and
  derived visual-state shape. It excludes React state setters, UI callbacks,
  and controller side effects; those cross the renderer boundary through the
  typed `FlowNodeInteractionProps` composition contract. Existing hooks retain
  flow interaction state and side-effect ownership. Slice 3 defines an
  explicit typed canvas seam: the adapter realizes ReactFlow and invokes typed
  renderer callbacks, while the graph interaction region retains callback
  adaptation, keyboard, focus, and scope-transition decisions. Flow scope,
  search, selection-source, reveal, viewport, and focus-transition state remain
  outside this feature even though Presentation continues to own them at the
  broader architecture level.
- Infrastructure: unchanged; no parser, WebAPI, file, telemetry, or host
  implementation enters this boundary.

## Impact Analysis

### Dependency Impact

- Affected production components and helpers remain within the selected
  `src/presentation/webview/editor/ajsFlow` boundary: `FlowContents.tsx`,
  `flowGraphView.ts`, the new `flowNodePresentationModel.ts`,
  `FlowNodeDetailPanel.tsx`, `Header.tsx`, `flowNodeDetail.ts`,
  `useFlowGraphState.ts`, `useFlowViewerController.ts`,
  `flowGraphSelection.ts`, `flowGraphHover.ts`, `flowRelationshipFocus.ts`,
  `flowMiniMap.ts`, `nodes/AjsNode.tsx`, `nodes/nodeSxProps.ts`, node variants,
  and node utilities, plus focused presentation tests. No application, domain,
  infrastructure, transport, or host implementation is in scope.
- Existing callers continue to provide application DTOs. Application, domain,
  parser, viewer transport, flow search/controller state, table presentation,
  shared header search, and flow-tree selector boundaries remain unchanged.

### Neighboring Roadmap Boundary Alignment

- Roadmap 7.2 continues to own flow scope, selection-source, search, reveal,
  viewport, and focus-transition state in `useFlowSearchState.ts`,
  `useFlowViewerController.ts`, and `useFlowViewerEffects.ts`. This feature may
  preserve or rewire renderer callbacks but must not extract or redesign those
  state transitions.
- Roadmap 7.3 continues to own unit-list table rendering, column actions,
  virtualization, and table keyboard focus. No `ajsTable` component or table
  DTO consumer is part of this feature.
- Roadmap 7.4 continues to own `HeaderSearchField.tsx`, shared header-search
  state, shortcuts, helper text, result counts, focus, localization, and query
  privacy. This feature may change only non-search flow-header display helpers.
- Roadmap 7.5 continues to own `UnitTreeSelector.tsx` selection, row state,
  focus, keyboard navigation, scope-row actions, reveal, and return-focus
  behavior. `FlowSelector` props, callbacks, and interaction ownership remain
  unchanged.
- `FlowContents.tsx` is shared evidence across these responsibilities. File
  location alone does not broaden this feature: only renderer-model mapping,
  direct XyFlow realization, and existing callback wiring at the canvas seam
  are in scope.

### Breaking Change Analysis

- User-visible behavior: none; this is a behavior-preserving separation.
- API/DTO/schema compatibility: existing application flow-graph and viewer
  message contracts remain unchanged.
- VS Code/web extension compatibility: both hosts retain the same shared
  browser webview behavior; no Node built-ins or newer VS Code APIs are added.
- Changed scenarios: none; existing Build Flow Graph and Explore Flow Graph
  and Navigate Between Unit List And Flow Graph scenarios are preserved.

### Alternative Considerations

- One feature containing all webview presentation targets: rejected because
  flow rendering, flow interaction state, table interaction, shared search,
  and tree selection have independent behavior and approval boundaries.
- Move renderer mapping or graph geometry into Application: rejected because
  renderer types, coordinates, bounds, and direct viewport realization are
  presentation responsibilities; viewport state transitions remain outside
  this feature under roadmap 7.2.
- Rewrite the flow viewer broadly: rejected in favor of bounded,
  behavior-preserving extraction within the selected responsibility group.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: application DTO changes, user-visible
  interaction changes, flow search/controller changes, shared control changes,
  flow-tree changes, table changes, transport changes, or new dependencies
  outside the selected presentation boundary.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; the minimum
  supported version must not change.
- Web extension compatibility: preserve browser-safe imports, shared rendering
  behavior, focus, layout, detail and flow-to-unit-list actions, and large/deep
  graph handling.
- Desktop extension compatibility: preserve the same viewer message contract,
  rendering, focus, layout, and detail actions as the web host.
- JP1/AJS definition compatibility: parsing and interpretation are unchanged;
  existing valid, malformed, encoded, large, and deeply nested definition
  behavior remains owned by existing contracts.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The selected components consume application DTOs or presentation-owned
  models only and introduce no domain, parser, infrastructure, `vscode`, or
  Node-built-in dependency. `FlowNodePresentationModel` is the only
  DTO-derived renderer model; `FlowNodeInteractionProps` carries existing
  callback/state wiring separately.
- Existing focused tests preserve node/edge realization, nested bounds,
  relationship focus, detail rows/actions, flow-to-unit-list action behavior,
  visual state, and accessibility.
- Host-neutral component and DOM characterization preserves rendering and
  interaction behavior for representative large and deeply nested flow
  graphs; desktop integration plus production bundling and web-host smoke
  confirm that both hosts deliver the same browser-safe presentation path.
- Web-host smoke is compatibility evidence only and is not treated as direct
  proof of graph interaction behavior.
- The application flow-graph DTO and viewer message schemas remain unchanged.
- Relevant quality checks pass, and before/after evidence demonstrates a
  clearer selected responsibility without a broad rewrite.

## Non-Goals

- Change graph identity, ordering, containment, placement constraints, or
  localization meaning.
- Change search, selection orchestration, viewport transition, keyboard
  binding, flow-tree, table, or shared header-search behavior.
- Refactor `useFlowSearchState`, `useFlowViewerController`,
  `useFlowViewerEffects`, `HeaderSearchField`, or `UnitTreeSelector`; those
  responsibilities remain with roadmap features 7.2, 7.4, and 7.5.
- Change unit-definition, scope-opening, viewer transport, parser, or JP1/AJS
  definition semantics.
- Create a shared search domain contract or introduce a new UI framework.

## Open Questions

- None. The revised implementation-slice plan is recorded in `TASKS.md` and
  remains subject to `sdd-review-plan` and human approval.
