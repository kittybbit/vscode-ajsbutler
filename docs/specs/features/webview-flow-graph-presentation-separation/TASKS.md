# Feature Tasks: Webview Flow-graph Presentation Separation

## Agent Brief

- Purpose: separate flow rendering, detail actions, and visual state from
  application-owned graph meaning without changing viewer behavior.
- Approved or active slice: none; all three planned slices are complete within
  their independently approved boundaries. Feature Exit review remains.
- Do not change Application DTOs, graph meaning, or viewer message contracts.
- Do not redesign search, keyboard rules, viewport transitions, flow-tree,
  table, shared header search, or telemetry semantics.
- Keep roadmap 7.2 state hooks, 7.3 table components, 7.4 shared search, and
  7.5 flow-tree selector ownership unchanged.
- Read first: `SPECS.md`, this file, and `../BASELINE.md` Intake group 3.
- Read `TRACEABILITY.md` for slice-to-test mapping during review.
- Validate each code slice with focused tests and `rtk pnpm run qlty`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: implement Slice 1, then continue through the approved slices.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs, prior approvals, or long validation diaries once they stop being
  actionable.

## Plan Status

- Status: Approved
- Planning scope: the complete flow-graph rendering and detail-presentation
  boundary identified as Intake group 3 in `../BASELINE.md`.
- Review status: Reviewed
- Human approval: Approved
- Active implementation slice: None

## Replanning Decision

- Mode: Replanning Mode after pre-approval plan review.
- Gap: web smoke was described as interaction evidence even though it observes
  only web-host loading; Slice 3 did not state which renderer effects remain in
  the graph interaction region; Slice 2 had an unnecessary Slice 1 dependency.
  Re-review also found an ambiguous renderer-model source of truth, missing
  per-slice web preparation, incomplete focused-test inventory, and missing
  cross-view navigation traceability. The next review found stale SPECS impact
  scope, an incomplete model/interaction-props contract, and an insufficiently
  explicit flow-to-unit-list regression scenario.
- Revision: distinguish host-neutral behavior evidence from web-host
  compatibility evidence; name and bound the presentation model; define the
  canvas callback seam; require web preparation for every shared-webview slice;
  add the placement, integration, detail-collapse, focus, and bundle tests; and
  map the preserved flow-to-list action to its owning durable use case. The
  final revision synchronizes SPECS impact scope, fixes R5, separates
  `FlowNodePresentationModel` from `FlowNodeInteractionProps`, and names the
  cross-view success/fallback test scenario.
- Approval impact: no slice was approved or implemented. The complete revised
  plan requires `sdd-review-plan` before human approval.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1, Slice 2, and Slice 3 within the boundaries recorded
  above; each slice is to be implemented, validated, reviewed, and committed
  independently.

Implementation may proceed for the approved slices within the recorded
boundaries. Any scope, design, impact, or approval-boundary change still
requires replanning and new approval.

## Impact Investigation

- Current boundary: `FlowContents.tsx` combines viewer composition with the
  ReactFlow canvas, DOM focus effects, and presentation callbacks;
  `flowGraphView.ts` maps Application DTOs into component-owned `AjsNode` data;
  detail and non-search header display decisions live inside React components.
- Primary production targets:
  `FlowContents.tsx`, `flowGraphView.ts`, `FlowNodeDetailPanel.tsx`,
  `Header.tsx`, `nodes/AjsNode.tsx`, and `nodes/nodeSxProps.ts`.
- Confirmed dependent presentation consumers: `useFlowGraphState`,
  `useFlowViewerController`, `flowGraphSelection`, `flowGraphHover`,
  `flowRelationshipFocus`, `flowMiniMap`, `flowNodeDetail`, `FlowContents`,
  node variants/utilities, and `nodeSxProps`. They must import one model source
  rather than a component-owned type.
- Confirmed focused tests: `flowGraphView.test.ts`, `flowNodeDisplay.test.ts`,
  `nodeSxProps.test.ts`, `flowMiniMap.test.ts`,
  `flowRelationshipFocus.test.ts`, `flowNodeDetail.test.ts`,
  `flowHeader.test.ts`, `showUnitDefinitionInteraction.test.ts`,
  `flowNodeDetailPanelCollapse.test.ts`, `flowContentsIntegration.test.ts`,
  `flowViewportFocus.test.ts`, `flowViewerEffects.test.ts`,
  `buildExpandedFlowGraph.test.ts`, `buildExpandedFlowGraphUseCase.test.ts`,
  `viewerBundle.test.ts`, and `accessibilityDom.test.tsx`.
- Architecture check: `architectureDependencyRules.test.ts` must remain at zero
  violations; presentation may consume Application DTOs but must not import
  Domain, Infrastructure, Bootstrap, generated parser code, `vscode`, or Node
  built-ins.
- Scenario impact: no use-case scenario is added, changed, or removed. Existing
  Build Flow Graph, Explore Flow Graph, and Navigate Between Unit List And Flow
  Graph behavior is characterization evidence; flow-to-list navigation keeps
  its stable application-facing identity and predictable unavailable-viewer
  fallback.
- JP1/AJS reference impact: none; no command or definition/config semantics are
  changed.
- Neighboring roadmap impact: 7.2 retains flow scope, selection-source, search,
  reveal, viewport, and focus-transition state; 7.3 retains all table
  presentation; 7.4 retains shared header search; 7.5 retains flow-tree row,
  focus, keyboard, reveal, and scope-action behavior.
- Web evidence limit: the existing web smoke opens the flow viewer but does not
  inspect its internal graph interactions. Host-neutral component/DOM tests
  therefore prove behavior, while production bundling and web smoke prove that
  the same browser-safe path loads in the web extension host.

## Implementation Slices

### Slice 1: Establish the renderer-owned flow-node presentation model

- Status: Complete
- Scope:
  - Introduce `FlowNodePresentationModel` outside the React node component and
    make `flowGraphView.ts` the sole mapper from existing Application
    flow-graph and unit-definition DTOs into renderer data and derived visual
    flags.
  - Make the new model the single type source for renderer consumers. Remove
    the component-owned `AjsNode` type as a source of truth; `AjsNode.tsx` and
    its consumers import the new model instead of maintaining a compatibility
    type or re-export that could diverge.
  - Export `FlowNodeInteractionProps` beside the model as the only typed
    composition contract for existing callbacks and state setters. Keep
    interaction state and side-effect ownership in the existing hooks and
    controller; do not place React setters, UI callbacks, search, selection,
    scope, dialog, or telemetry decisions in `FlowNodePresentationModel`.
  - Keep XyFlow node/edge creation, position, bounds, semantic-diff styling,
    nested expansion decoration, and visual-state precedence deterministic.
- User / Domain Value: establishes one explicit architecture responsibility:
  Application owns graph meaning and Presentation owns the renderer model.
- Cohesive Change Group:
  - `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`
  - a new `flowNodePresentationModel.ts` module under `ajsFlow`
  - `nodes/AjsNode.tsx`, `nodes/nodeSxProps.ts`, and node variants/utilities
  - `useFlowGraphState.ts`, `useFlowViewerController.ts`,
    `flowGraphSelection.ts`, `flowGraphHover.ts`,
    `flowRelationshipFocus.ts`, `flowMiniMap.ts`, `flowNodeDetail.ts`, and the
    typed renderer props in `FlowContents.tsx`
  - focused mapping, style, display, relationship, MiniMap, and accessibility
    tests
- Acceptance:
  - Node renderer components and decorators consume the presentation-owned
    model rather than owning the Application DTO projection shape, and no
    component-local model type remains.
  - `FlowNodePresentationModel` contains no React state setters or UI
    callbacks. `FlowNodeInteractionProps` is composed at the ReactFlow node
    boundary, preserving existing callback identity and behavior without
    becoming a second DTO-derived model.
  - `flowGraphView.ts` produces the same node IDs, edge IDs, positions, bounds,
    metadata, selection/search flags, semantic-diff styles, and callback
    eligibility; existing hooks and controller retain callback identity and
    side-effect ownership.
  - No Application DTO or viewer message schema changes.
  - No new outer-layer, host, parser, or Node-built-in dependency.
- Validation:
  - Extend `flowGraphView.test.ts` to lock the model mapping, deterministic deep
    graph output, nested bounds, and edge realization.
  - Preserve `flowNodeDisplay.test.ts`, `nodeSxProps.test.ts`,
    `flowMiniMap.test.ts`, `flowRelationshipFocus.test.ts`, and relevant
    `accessibilityDom.test.tsx` coverage.
  - Preserve `buildExpandedFlowGraph.test.ts` and
    `buildExpandedFlowGraphUseCase.test.ts` as the placement-constraint and
    nested-panel safety net; preserve `flowContentsIntegration.test.ts` for
    renderer wiring.
  - Run the desktop test suite, `architectureDependencyRules.test.ts` through
    that suite, TypeScript compilation, `rtk pnpm run test:prepare:web`, and
    `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing model fields could silently remove actions, labels,
    selection state, or nested bounds; mapping tests must compare every
    behavior-bearing field.
  - JP1/AJS compatibility: parser and definition interpretation are unchanged;
    preserve representative unit types, nested jobnets, and semantic-diff
    decoration.
  - Large or malformed input risk: mapping remains linear over existing graph
    nodes and edges; bounded deep-graph determinism must remain covered.
  - Desktop/web impact: the shared browser webview model is used by both hosts;
    keep browser-safe imports, prove web preparation in this slice, and defer
    only final web-host smoke validation to Slice 3 integration.
  - README/docs impact: none expected because behavior and public architecture
    policy remain unchanged.
  - CHANGELOG impact: not required under the repository criteria unless an
    observable behavior change is discovered, which requires replanning.
- Qlty Evidence: compare the changed target functions against the shared
  baseline, run `rtk pnpm run qlty`, and resolve any new smell finding; metric
  movement is evidence, not a repository-wide gate.
- Approval Boundary: presentation-owned model introduction, import migration,
  mapper refactoring, explicit renderer interaction props, and tests proving
  unchanged renderer data only. It excludes interaction-state, callback,
  telemetry, and message-contract redesign.
- Dependencies: none; this is the foundation for Slice 3. Slice 2 remains
  independent.
- Risks: broad type-reference migration, accidental callback identity changes,
  visual-state precedence drift, and hidden coupling to `AjsNode.tsx` exports.
- Out of Scope: change DTO fields, graph layout constraints, search matching,
  selection rules, relationship traversal, scope behavior, or UI appearance.
  Type-only consumer migration needed to adopt the new model is in scope;
  behavioral changes to those responsibilities are not.
- Smallest Useful Slice: the model, mapper, consumers, and tests must change
  together to produce a compilable and independently enforceable boundary.
- Implementation Feedback: the recorded boundary remained appropriate. The
  model and interaction contract were separated without changing application
  DTOs, node data values, callback ownership, or desktop/web behavior.
- Validation Result: `rtk pnpm test`, `rtk pnpm run test:compile`,
  `rtk pnpm run test:prepare:web`, `rtk pnpm run qlty`, and `git diff --check`
  passed. The architecture dependency suite ran through the desktop suite.
- Human Completion Approval: Approved in the current conversation per the
  user's instruction to treat each completed implementation as approved.

### Slice 2: Separate detail and non-search header display decisions

- Status: Complete
- Scope:
  - Move flow-node detail row, chip, and action-availability decisions into a
    presentation helper/model consumed by `FlowNodeDetailPanel.tsx`; keep React
    icons and injected callbacks at the component boundary.
  - Move current-scope badge and non-search control label/state decisions into
    a presentation helper/model consumed by `Header.tsx`.
  - Preserve the existing shared detail pane, localization source, callbacks,
    action order, enabled state, focus-return contract, and cross-view
    navigation contract.
- User / Domain Value: React components render explicit presentation models
  while domain/application meaning and side-effect callbacks remain outside
  display-decision helpers.
- Cohesive Change Group:
  - `src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx`
  - `src/presentation/webview/editor/ajsFlow/Header.tsx`
  - focused presentation-helper modules under `ajsFlow`
  - `flowNodeDetail.test.ts`, `flowHeader.test.ts`,
    `showUnitDefinitionInteraction.test.ts`, and relevant accessibility tests
- Acceptance:
  - Detail rows, chips, action order, action availability, localized labels,
    current-unit badge, expand control, relationship-focus control, and
    MiniMap control remain unchanged.
  - Unit-definition, unit-list, scope-opening, relationship-focus, close, and
    focus-return callbacks fire once with existing eligibility rules.
  - The flow-to-unit-list action retains stable unit identity and the existing
    predictable unavailable-viewer fallback; no counterpart-viewer contract is
    changed. `flowContentsIntegration.test.ts` adds explicit success and
    unavailable-viewer scenarios for this action.
  - Shared header search rendering and search state remain unchanged in place.
- Validation:
  - Extend `flowNodeDetail.test.ts` and `flowHeader.test.ts` around the extracted
    models, missing context, localization, eligibility, and control state.
  - Preserve `showUnitDefinitionInteraction.test.ts` and relevant
    `accessibilityDom.test.tsx` callback/focus coverage, plus
    `flowNodeDetailPanelCollapse.test.ts` and `flowContentsIntegration.test.ts`
    for detail-panel and cross-view action wiring.
  - Run the desktop test suite, TypeScript compilation,
    `rtk pnpm run test:prepare:web`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: wrong action availability or callback wiring could hide or
    double-trigger user actions; explicit action-order and one-shot callback
    tests are required.
  - JP1/AJS compatibility: unit types and current/root-jobnet labels remain
    projections of existing DTO fields; no command/config behavior changes.
  - Large or malformed input risk: detail/header mapping is bounded by the
    selected unit and control state; missing parent or definition context must
    continue to render safe fallbacks.
  - Desktop/web impact: shared React components and localization run in both
    hosts; no host-only dependency may be introduced, and this slice must pass
    web preparation before the final Slice 3 smoke test.
  - README/docs impact: none expected because visible labels, controls, and
    workflow remain unchanged.
  - CHANGELOG impact: not required unless observable behavior changes, which
    requires replanning and approval.
- Qlty Evidence: compare `FlowNodeDetailPanel.tsx`, `Header.tsx`, and extracted
  helpers with the shared baseline; run `rtk pnpm run qlty` and resolve new
  smells without creating a shared search abstraction.
- Approval Boundary: detail and non-search header presentation helpers,
  component wiring, and focused behavior-preservation tests only.
- Dependencies: none. `FlowNodeDetailPanel.tsx` consumes the existing
  `FlowNodeDetail` model and the non-search header helpers are independent of
  the renderer-model migration in Slice 1.
- Risks: accidental inclusion of roadmap feature 7.4, localization drift,
  callback identity changes, and over-generalization with table components.
- Out of Scope: shared search control, query matching/order, search state,
  table header consolidation, new shared component abstractions, or visual
  redesign.
- Smallest Useful Slice: detail and non-search header decisions form one
  reviewable display-model responsibility while search remains explicitly
  excluded.
- Implementation Feedback: the helper boundary kept localization and
  availability decisions host-neutral while icons and injected callbacks
  remained at the React boundary. Existing counterpart-view success and
  unavailable fallback behavior required no contract change.
- Validation Result: `rtk pnpm test`, `rtk pnpm run test:compile`,
  `rtk pnpm run test:prepare:web`, `rtk pnpm run qlty`, and `git diff --check`
  passed. Existing flow integration and viewer-wiring success/fallback tests
  passed in the desktop suite.
- Human Completion Approval: Approved in the current conversation per the
  user's instruction to treat each completed implementation as approved.

### Slice 3: Isolate the ReactFlow canvas from viewer composition

- Status: Complete
- Scope:
  - Extract a typed ReactFlow canvas adapter from `FlowGraphPanelComponent`
    containing ReactFlow nodes, edges, node types, background, controls,
    MiniMap, renderer initialization, and XyFlow-internal selected-state
    synchronization.
  - Define the adapter prop contract explicitly: it receives renderer data,
    styles, MiniMap visibility, and typed renderer-event callbacks for node
    click, hover, and renderer readiness; it realizes ReactFlow and
    selected-state synchronization but does not translate user actions into
    controller, telemetry, or focus decisions. Graph keyboard events remain on
    `FlowGraphPanelComponent` and are not passed to the canvas adapter.
    Renderer readiness is reported through a typed callback without changing
    ref ownership.
  - Keep `FlowGraphPanelComponent` as the graph interaction region that owns
    the graph-entry DOM ref, keyboard capture, already-characterized focus
    request handling, spatial navigation invocation, scope-transition
    callbacks, and hover/selection callback adaptation.
  - Keep `FlowViewerBody` and `FlowContents` as the existing selector/detail
    shell and top-level controller, announcement, telemetry, and focus-request
    composition. Change their wiring only where the new canvas prop seam
    requires it.
- User / Domain Value: isolates direct UI-framework rendering and XyFlow
  side effects from the graph interaction region, making the renderer boundary
  independently testable without moving behavior into Application or Domain.
- Cohesive Change Group:
  - `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`
  - a new typed canvas adapter component under `ajsFlow`
  - direct renderer-model wiring adjustments required by Slice 1
  - focused graph rendering, selected-state synchronization, callback,
    accessibility, desktop, and web compatibility tests
- Acceptance:
  - The extracted canvas owns only direct ReactFlow realization: nodes, edges,
    node types, background, controls, MiniMap, renderer initialization, and
    XyFlow-internal selected-state synchronization.
  - `FlowGraphPanelComponent` adapts node click, hover, and renderer-ready
    events before passing typed callbacks to the canvas; it retains keyboard
    capture and keyboard-originated controller decisions. The canvas invokes
    its renderer callbacks once and does not add controller, telemetry, or
    announcement behavior.
  - `FlowGraphPanelComponent` continues to own graph-entry keyboard and focus
    orchestration; `FlowViewerBody` continues to own selector/detail shell
    composition; `FlowContents` continues to own controller, telemetry,
    announcement, and focus-request state.
  - Selection, hover, focus restoration, spatial navigation, nested
    expand/collapse, scope entry/return, detail/selector focus handoff, MiniMap,
    telemetry, and announcements remain behaviorally unchanged.
  - No search, keyboard, viewport, tree, telemetry, DTO, or message-contract
    decision is redesigned.
  - `useFlowSearchState`, `useFlowViewerController`, `useFlowViewerEffects`,
    `HeaderSearchField`, `FlowSelector`, and `UnitTreeSelector` retain their
    existing responsibilities and public contracts.
  - Desktop and web bundles consume the same browser-safe presentation path.
- Validation:
  - Add focused component/DOM coverage for canvas configuration, selection
    synchronization, single-fire callbacks, MiniMap visibility, and render
    seam composition where current tests do not observe the seam.
  - Use representative nested and bounded-deep graph fixtures in the
    host-neutral mapping/component/DOM tests; do not claim that web smoke
    directly exercises those interactions.
  - Preserve `flowGraphView.test.ts`, `flowNodeDisplay.test.ts`,
    `flowMiniMap.test.ts`, `flowNodeDetail.test.ts`, flow keyboard/navigation
    suites, `flowViewerController.test.ts`, `viewerActionTelemetry.test.ts`,
    `flowContentsIntegration.test.ts`, `flowViewportFocus.test.ts`,
    `flowViewerEffects.test.ts`, `viewerBundle.test.ts`, and
    `accessibilityDom.test.tsx`.
  - Run the full desktop test suite, web smoke suite, production build,
    TypeScript compilation, architecture dependency tests, and
    `rtk pnpm run qlty`.
  - Capture final targeted Qlty metrics/smells with the baseline command and
    compare `FlowGraphPanelComponent`, `FlowContents`,
    `useSyncSelectedFlowNode`, `FlowViewerBody`, and all Intake group 3 files.
- Production Readiness:
  - Failure mode: moved renderer initialization or selected-state sync can fail
    to initialize XyFlow or leave stale selection; callback seam mistakes can
    duplicate user actions, telemetry, or announcements even though their
    ownership remains outside the canvas. DOM and callback-count tests must
    cover these paths.
  - JP1/AJS compatibility: no parsing, graph meaning, unit identity, or
    definition/config behavior changes; representative nested and deep graphs
    remain required fixtures.
  - Large or malformed input risk: rendering complexity and node/edge counts
    must not increase asymptotically; preserve bounded deep-graph tests and
    existing empty/missing-data fallback behavior.
  - Desktop/web impact: highest-risk integration surface; both desktop tests
    and host-neutral DOM characterization prove behavior, while web smoke and
    production bundling prove browser-host delivery of the shared path.
  - README/docs impact: no user documentation change expected; evaluate durable
    architecture wording at Feature Exit only if a reusable boundary decision
    is not already covered by `docs/specs/architecture.md`.
  - CHANGELOG impact: not required for behavior-preserving internal refactoring;
    any visible interaction or compatibility change requires replanning.
- Qlty Evidence: run `rtk pnpm run qlty`, reject new smells in changed source,
  and record targeted before/after metrics against `../BASELINE.md` without
  introducing a repository-wide threshold.
- Approval Boundary: ReactFlow canvas-adapter extraction, XyFlow-internal
  selected-state synchronization, unchanged interaction-region callbacks, and
  focused host-neutral plus dual-host compatibility validation only.
- Dependencies: Slice 1 supplies the renderer-owned node model consumed by the
  canvas adapter. Slice 2 is independent and is not required for this slice.
- Risks: effect ordering, stale closures, memoization changes, focus races,
  accidental interaction-state redesign, web bundling drift, and mechanical
  movement that does not improve the responsibility boundary.
- Out of Scope: extract or behaviorally change `useFlowSearchState`,
  `useFlowViewerController`, `useFlowViewerEffects`, keyboard or scope/focus
  decision helpers, `FlowViewerBody`, `FlowSelector`, `UnitTreeSelector`,
  shared header search, transport, telemetry catalog, or Application
  contracts. Type-only imports required by Slice 1 remain part of Slice 1.
- Smallest Useful Slice: canvas adapter, renderer initialization,
  XyFlow-internal selected-state synchronization, callback seam, and
  compatibility validation must change together to leave a usable viewer and
  one reviewable UI-framework adapter boundary.
- Implementation Feedback: the adapter moved only direct ReactFlow realization
  and selected-state synchronization. Graph-entry focus, keyboard navigation,
  scope transitions, callbacks, telemetry, and announcement ownership stayed
  in their recorded owners; no new boundary issue was found.
- Validation Result: `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run test:compile`, `rtk pnpm run build`, `rtk pnpm run qlty`, and
  `git diff --check` passed. The desktop suite included architecture
  dependency checks. Production build emitted only the existing bundle-size
  recommendations, and Web smoke exited successfully with existing browser
  shutdown `ECONNRESET` logs.
- Human Completion Approval: Approved in the current conversation per the
  user's instruction to treat each completed implementation as approved.

## Cross-Slice Dependencies

1. Slice 1 establishes the presentation model and mapper used by the renderer
   and Slice 3 canvas adapter.
2. Slice 2 is independent of Slice 1 and isolates bounded detail and non-search
   header display decisions while leaving roadmap 7.4 shared search untouched.
3. Slice 3 depends only on Slice 1 and extracts the direct ReactFlow canvas
   adapter without moving roadmap 7.2 state transitions or roadmap 7.5 tree
   interaction. Slices 1 and 2 each prove web preparation; Slice 3 supplies
   final production-bundle and web-host-smoke compatibility evidence.
4. Each slice requires separate human approval before implementation unless
   the reviewed plan is explicitly approved as one multi-slice scope.
5. Discovery of a required Application DTO, message schema, interaction-state,
   layout-constraint, search, tree, or telemetry change triggers Replanning
   Mode and new approval before edits continue.

## Feature-Level Risks

- Presentation-model extraction can become a rename-only abstraction unless it
  creates a single explicit DTO-to-renderer mapping seam.
- Existing XyFlow and DOM effects are order-sensitive; moving them can change
  selection, focus, initialization, or callback counts without type errors.
- Header and detail duplication with table components may tempt an out-of-scope
  shared abstraction; KISS and the selected flow boundary take precedence.
- Baseline complexity improvement is evidence of responsibility separation,
  not permission to change behavior or pursue a repository-wide metric target.
- Desktop tests alone cannot prove browser-host bundling and smoke behavior;
  every shared-webview slice runs web preparation, while Slice 3 combines
  host-neutral behavior evidence with final production bundling and smoke
  evidence and does not describe smoke as interaction coverage.
- `FlowContents.tsx` contains responsibilities relevant to later roadmap
  features; implementation must follow the recorded symbol/behavior boundary
  rather than treating the whole file as 7.1 scope.

## Use-Case Back-Propagation

- `uc-build-flow-graph.md`, `uc-explore-flow-graph.md`, and
  `uc-navigate-between-unit-list-and-flow-graph.md` already own the durable
  behavior contracts; no change is planned because scenarios remain unchanged.
- If implementation changes an observable scenario, stop, enter Replanning
  Mode, update the owning use case, evaluate README and CHANGELOG impact, and
  obtain new approval.
- At Feature Exit, update durable architecture documentation only if the final
  reusable boundary decision is not already expressed in
  `docs/specs/architecture.md`.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this non-trivial boundary change spans three implementation slices,
  three durable use cases, shared desktop/web rendering, and multiple focused
  validation suites.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates: no use-case, README, or CHANGELOG change is
  currently planned; reevaluate architecture wording and roadmap state after
  all slices pass.
- Open risks: model-seam usefulness, large/deep graph rendering drift,
  focus/selection races, action callback regressions, Qlty evidence, and
  desktop/web divergence.

## Validation

- [x] Review the full plan with `sdd-review-plan`.
- [x] Obtain clear human approval for the reviewed implementation scope.
- [x] Add or update focused tests inside every approved code slice.
- [x] Run `rtk pnpm run qlty` for every code slice completed so far.
- [x] Run `rtk pnpm run test:prepare:web` for every shared-webview slice
      completed so far.
- [x] Complete host-neutral behavior, desktop integration, web smoke, build,
      architecture, and final Qlty evidence in Slice 3.
- [ ] Evaluate durable docs, README, CHANGELOG, and roadmap impact at Feature
      Exit.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
