# Feature Tasks: Flow Search and Viewer Interaction State Separation

## Agent Brief

- Purpose: isolate flow search and viewer interaction state from graph
  rendering without changing exploration behavior.
- Approved or active slice: Slice 3; Slices 1-2 are complete and Slice 3 remains
  approved for implementation.
- Do not change Application DTOs, parser behavior, viewer messages, telemetry
  vocabulary, matching semantics, or the VS Code compatibility floor.
- Do not absorb graph rendering/detail, shared header search, or flow-tree
  internal interaction work from roadmap items 7.1, 7.4, or 7.5.
- Read first: `SPECS.md`, this file, and
  `docs/requirements/use-cases/uc-explore-flow-graph.md`.
- Read `TRACEABILITY.md` during review and implementation validation.
- Validate each code slice with focused tests, web preparation, and
  `rtk pnpm run qlty`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: complete Slice 1 and record its validation before moving to
  Slice 2.

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

- Status: In Progress
- Planning mode: Planning Mode.
- Selected feature: `flow-search-viewer-interaction-state-separation`.
- Selection evidence: the user explicitly selected this feature in the
  current conversation after its feature intake was created.
- Planning scope: the complete roadmap 7.2 boundary for flow scope,
  selection-source, search, reveal, focus-transition, and viewport state.
- Review status: Complete; no outstanding findings.
- Human approval: Approved.
- Active implementation slice: Slice 3.
- Branch condition: dedicated branch
  `codex/flow-search-viewer-interaction-state-separation` created for this
  feature.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slices 1-3 as defined below, implemented sequentially; a
  completed test/validation set constitutes completion approval for that slice.

Implementation may start because the reviewed plan and all three slices have
clear human approval.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Impact Investigation

- Current search/reveal boundary: `useFlowSearchState.ts` coordinates search
  state, expansion, scope changes, focus versions, telemetry, and a mutable
  preserve-next-scope-change ref across multiple React setters.
- Current scope reset boundary: `useFlowViewerEffects.ts` clears expansion and
  conditionally resets search after scope or document changes; the one-shot
  preservation intent is not represented in the semantic state.
- Current selection/focus boundary: `useSelectedFlowNodeState.ts` owns graph
  selection, `flowTreeSelection.ts` separately owns a viewport-focus request,
  and `FlowContents.tsx` owns graph/detail/selector focus request revisions and
  the saved graph focus target.
- Current viewport boundary: `useFlowViewerController.ts` owns a ReactFlow
  instance ref, `useFlowViewerEffects.ts` decides and executes fit/center
  effects, and `FlowGraphPanelComponent` directly centers keyboard targets and
  performs DOM focus restoration.
- Primary production targets:
  `flowSearchState.ts`, `useFlowSearchState.ts`,
  `useFlowViewerController.ts`, `useFlowViewerEffects.ts`,
  `useSelectedFlowNodeState.ts`, `flowTreeSelection.ts`,
  `flowViewportFocus.ts`, `FlowContents.tsx`, and `FlowGraphCanvas.tsx`, plus
  focused new presentation-local state/controller or effect-adapter modules.
  The affected symbols include `FlowGraphPanelComponent`, `FlowViewerBody`,
  `FlowContents`, `useSyncSelectedFlowNode`, and the existing
  `reactFlowInstanceRef`/`onRendererReady` wiring.
- Confirmed dependent wiring consumers: `useNestedExpansionState.ts` and
  `useFlowGraphState.ts` consume current scope or expansion setters and may
  require type/wiring-only adaptation. `useHoveredFlowNodeState.ts` already
  keeps hover distinct and remains behaviorally unchanged.
- Confirmed focused tests: `flowSearch.test.ts`, `flowSearchState.test.ts`,
  `flowSearchController.test.ts`, `flowScopeState.test.ts`,
  `flowViewerController.test.ts`, `flowViewerEffects.test.ts`,
  `flowViewportFocus.test.ts`, `flowTreeSelection.test.ts`,
  `flowKeyboardNavigation.test.ts`, `flowViewerShortcuts.test.ts`,
  `flowContentsIntegration.test.ts`, `flowAccessibility.test.ts`,
  `architectureDependencyRules.test.ts`, `searchTelemetry.test.ts`,
  `viewerSearchTelemetry.test.ts`, `viewerActionTelemetry.test.ts`,
  `viewerAnnouncements.test.ts`, `flowInteractionController.test.ts`,
  `flowViewportAdapter.test.ts`, and `viewerBundle.test.ts`.
- Architecture evidence: presentation owns React state, viewport behavior,
  search, selection, and expansion. Application flow-graph DTOs, navigation
  identity, and validated telemetry contracts remain unchanged; Domain and
  Infrastructure have no planned changes.
- Baseline evidence: `FlowContents.tsx`, `useFlowSearchState.ts`,
  `useFlowViewerController.ts`, `useFlowViewerEffects.ts`, and
  `flowViewportFocus.ts` are recorded flow-webview responsibility targets in
  `../BASELINE.md`. Metrics guide responsibility review but are not thresholds.
- Scenario impact: no Explore Flow Graph or cross-view navigation scenario is
  added, changed, or removed. Current-scope matching, ancestor reveal, zoom
  preservation, explicit scope changes, selection synchronization, and focus
  fallbacks are regression contracts.
- JP1/AJS reference impact: none; no command or definition/config semantics are
  changed.
- Viewer transport and telemetry impact: no message schema, event name,
  property, privacy rule, or operation outcome change is planned.
- Roadmap boundary: item 7.1 renderer/detail presentation is complete; item 7.4
  retains shared header-search rendering/state; item 7.5 retains tree-row
  enablement, keyboard navigation, scope-row focus, and selector-internal
  interaction behavior.
- Web evidence limit: host-neutral unit/component tests prove the interactions;
  web preparation and final smoke prove browser-safe delivery but do not by
  themselves prove internal interaction semantics.
- Boundary vocabulary: the new presentation-local interaction controller owns
  plain-ID state and pure transitions only; its planned module is
  `flowInteractionController.ts` and its tests must not import ReactFlow or
  renderer objects. `useFlowViewerController.ts`
  remains the viewer composition hook and may continue to compose graph data;
  it must not own a ReactFlow instance after Slice 3. `FlowContents.tsx` and
  `FlowGraphPanelComponent` remain presentation adapters for DOM focus,
  announcements, localization, and operation reporting. `FlowGraphCanvas.tsx`
  remains the renderer/selection-visual-sync surface. The viewport adapter is
  the sole owner of ReactFlow viewport calls and viewport-request execution;
  renderer selection sync must not become a second viewport owner.

## Implementation Slices

### Slice 1: Make search, external reveal, and scope-reset transitions atomic

- Status: Complete
- Scope:
  - Introduce one presentation-local state/reducer boundary for active flow
    scope, expanded nested units, search query/results, and the one-shot search
    preservation intent used by an external reveal.
  - Represent query submit, result navigation, clear, external reveal,
    document change, explicit scope change, and expansion reset as explicit
    actions that produce one deterministic next state.
  - Refactor `useFlowSearchState.ts`, the scope-reset portion of
    `useFlowViewerEffects.ts`, and `useFlowViewerController.ts` to consume the
    transition boundary instead of coordinating independent setters and
    `preserveSearchOnNextScopeChange`.
  - Keep matching/ranking in `flowSearch.ts`, application navigation-target
    resolution, event subscriptions, and telemetry emission at their existing
    boundaries. Telemetry is emitted once for the same user action and never
    includes query text.
- User / Domain Value: search, reveal, and scope changes cannot expose an
  inconsistent intermediate semantic state, while existing current-scope
  behavior remains predictable and testable without ReactFlow.
- Cohesive Change Group:
  - `flowSearchState.ts`, `useFlowSearchState.ts`,
    `useFlowViewerController.ts`, and the scope-reset functions in
    `useFlowViewerEffects.ts`
  - setter/type wiring in `useNestedExpansionState.ts` and
    `useFlowGraphState.ts` only where required to consume the new owner
  - the new `flowInteractionController.ts` state/reducer module under
    `ajsFlow`
  - `flowSearch.test.ts`, `flowSearchState.test.ts`,
    `flowSearchController.test.ts`, `flowScopeState.test.ts`,
    `flowViewerEffects.test.ts`, `searchTelemetry.test.ts`, and
    `viewerSearchTelemetry.test.ts`
- Acceptance:
  - Search submit, navigate, clear, and external reveal each produce one
    deterministic transition for scope, expansion, search result, and focus
    request version.
  - External reveal atomically applies the resolved scope, required expanded
    ancestor IDs, and its synthetic revealed target through the required scope
    change exactly once; the required ancestors remain visible after the scope
    reset. Ordinary scope or document changes clear query/results and expansion
    as before.
  - Current-scope matching, descendant preference, ancestor expansion, cyclic
    result navigation, empty/stale results, and bounded large-result behavior
    remain unchanged.
  - Search/reveal transition tests do not require ReactFlow types or renderer
    instances, and no mutable preserve-search ref remains.
  - The interaction controller is the single semantic owner of scope and
    expansion state; `useNestedExpansionState.ts` is only an action/derived
    state facade and no competing scope or `expandedUnitIds` state owner is
    introduced.
  - Search telemetry names, result counts, duration behavior, scope, and query
    privacy remain unchanged.
- Validation:
  - Extend pure transition tests for submit, navigation, clear, external
    reveal, ordinary scope change, document change, stale targets, and the
    one-shot preservation rule, including required ancestor expansion after a
    scope reset; cover the document/reveal wiring in the existing controller
    and integration tests.
  - Preserve `flowSearch.test.ts`, `flowSearchState.test.ts`,
    `flowSearchController.test.ts`, `flowScopeState.test.ts`,
    `flowViewerEffects.test.ts`, `searchTelemetry.test.ts`, and
    `viewerSearchTelemetry.test.ts` coverage.
  - Run the nearest focused tests, then `rtk pnpm test` (desktop preparation,
    compilation, and architecture dependency suite),
    `rtk pnpm run test:prepare:web`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: a lost or repeated transition could clear a reveal target,
    retain stale matches, double-report telemetry, or open the wrong scope;
    action-sequence tests must cover each path.
  - JP1/AJS compatibility: parsing, unit identity, absolute paths, and graph
    meaning are unchanged; representative nested jobnets remain fixtures.
  - Large or malformed input risk: search remains linear over the current
    scope and transition updates remain bounded by the matched/expanded ID
    lists; preserve the 2,048-result and long-query cases.
  - Desktop/web impact: shared React/webview state runs in both hosts; keep
    browser-safe imports and pass web preparation.
  - README/docs impact: none expected because visible behavior and controls do
    not change.
  - CHANGELOG impact: not required for a behavior-preserving internal refactor;
    any observable change requires replanning.
- Qlty Evidence: run `rtk pnpm run qlty`, resolve every new smell in changed
  source, and compare responsibility/complexity movement for the affected
  baseline targets without treating metrics as a repository-wide gate.
- Completion Evidence: desktop preparation and suite passed; web preparation
  and TypeScript compilation passed; `rtk pnpm run qlty` reported no issues;
  `git diff --check` passed.
- Implementation Feedback: the slice boundary was appropriate. Moving scope,
  expansion, search, and reveal preservation together removed the hidden
  coordination without changing matching, telemetry, or host contracts. The
  next slice should consume the same controller rather than introduce another
  viewer-level state owner.
- Approval Boundary: presentation-local search/scope/expansion state actions,
  removal of the preserve-search ref, hook/controller wiring, and focused
  behavior-preservation tests only.
- Dependencies: none.
- Risks: React batching assumptions, stale closures, action-order drift,
  duplicate telemetry, and over-generalizing the reducer beyond flow viewer
  interaction state.
- Out of Scope: new matching semantics, shared search UI/domain contracts,
  selection/focus handoff ownership, viewport execution, renderer changes,
  application navigation changes, or telemetry contract changes.
- Smallest Useful Slice: scope, expansion, search, and the one-shot reveal
  preservation intent must move together because the current behavior is one
  transition and separating them would retain the hidden coordination ref.

### Slice 2: Centralize selection and cross-region focus intents

- Status: Complete
- Scope:
  - Extend the presentation-local interaction controller from Slice 1 to own
    selected unit identity and renderer-neutral graph, detail, and selector
    focus-request revisions plus the saved graph return-focus target.
  - Move viewer-level request state and state-changing transition orchestration
    out of `FlowContents.tsx`; compose selection, scope entry/return, detail
    focus/close/return, selector focus/return, and tree-originated graph
    selection through explicit controller actions. External reveal remains the
    Slice 1 transition owner and is consumed here without a second owner.
  - Move the selection-origin viewport request now stored by
    `useFlowTreeSelectionState` into the viewer interaction controller while
    preserving `resolveFlowTreeSelectionTarget` and all selector-internal row,
    focus, keyboard, and scope-action behavior for roadmap item 7.5.
  - Keep DOM focus execution, ReactFlow centering/fitting, announcements,
    localization, and telemetry side effects outside the pure transition
    model; callbacks may be injected at the hook boundary.
- User / Domain Value: scope, selection, search result, and focus destination
  become explicit distinct concepts with one viewer-level transition owner,
  preventing synchronized selection or focus handoff from changing scope
  implicitly.
- Cohesive Change Group:
  - the Slice 1 interaction state/controller module
  - `useSelectedFlowNodeState.ts`, `flowTreeSelection.ts`,
    `useFlowViewerController.ts`, `flowViewportFocus.ts`, and the viewer-level
    interaction composition in `FlowContents.tsx`
  - focused new controller tests plus `flowTreeSelection.test.ts`,
    `flowInteractionController.test.ts`,
    `flowViewerController.test.ts`, `flowViewerShortcuts.test.ts`,
    `flowKeyboardNavigation.test.ts`, and `flowContentsIntegration.test.ts`
- Acceptance:
  - Selected unit, active scope, current search result, graph focus request,
    detail/selector focus request, and saved return target remain distinct
    fields with explicit actions and version ordering; hover remains separately
    owned by `useHoveredFlowNodeState.ts`.
  - Graph click, tree selection, external reveal, explicit scope open/return,
    detail close/return, and selector return preserve existing selection,
    focus, telemetry, and announcement behavior.
  - Scope changes occur only through existing explicit scope actions or
    external navigation resolution; selection/hover/focus synchronization does
    not change scope.
  - Rerender and asynchronous scope readiness keep the current wait, cancel,
    node-target, and graph-entry fallback decisions.
  - `FlowSelector` and shared `UnitTreeSelector` internal state, row enablement,
    keyboard navigation, and focus mechanics remain unchanged.
  - The pure controller does not emit telemetry, announcements, localization,
    or DOM focus. Existing presentation callbacks remain the single side-effect
    boundary and are invoked once for each selection, scope, detail, and
    selector handoff action; no wrapper is duplicated during rewiring.
- Validation:
  - Add pure action-sequence coverage for graph/tree selection, explicit scope
    transitions, stale request revisions, detail/selector handoff, clear, and
    document/scope reset.
  - Preserve `flowTreeSelection.test.ts`, `flowViewerController.test.ts`,
    `flowViewerShortcuts.test.ts`, `flowKeyboardNavigation.test.ts`,
    `flowViewportFocus.test.ts`, `flowContentsIntegration.test.ts`,
    `flowAccessibility.test.ts`, `viewerActionTelemetry.test.ts`,
    `viewerAnnouncements.test.ts`, and viewer-operation callback-count
    coverage.
- Run the nearest focused tests, then `rtk pnpm test` (desktop preparation,
    compilation, and architecture dependency suite),
    `rtk pnpm run test:prepare:web`, and `rtk pnpm run qlty`.
- Completion Evidence: desktop preparation and suite passed; web preparation
  and TypeScript compilation passed; `rtk pnpm run qlty` reported no issues;
  `git diff --check` passed.
- Implementation Feedback: the existing keyboard DOM focus pending request was
  kept as the sole readiness/fallback executor, while controller graph-focus
  revisions serve tree/detail/selector handoffs. This avoids duplicate focus
  effects and should remain an explicit boundary in the viewport slice.
- Production Readiness:
  - Failure mode: stale or reordered focus intents can select the wrong node,
    lose keyboard focus, double-fire telemetry/announcements, or race a scope
    rerender; transition and integration tests must cover readiness ordering.
  - JP1/AJS compatibility: stable DTO unit IDs and paths remain the identity
    source; no parsing or definition interpretation changes.
  - Large or malformed input risk: transitions are constant-time apart from
    existing ancestor/lookup operations; cyclic or missing targets retain safe
    cancellation/fallback behavior.
  - Desktop/web impact: shared browser-safe controller logic is common to both
    hosts; DOM focus behavior remains covered by host-neutral tests and web
    preparation.
  - README/docs impact: none expected because shortcuts, selection semantics,
    focus order, and visible behavior remain unchanged.
  - CHANGELOG impact: not required unless an observable interaction changes,
    which requires replanning.
- Qlty Evidence: run `rtk pnpm run qlty`; review changed baseline targets for
  real responsibility reduction and reject a rename-only abstraction or new
  smell.
- Approval Boundary: viewer-level selection and focus-intent state/actions,
  existing callback rewiring, and focused regression tests only.
- Dependencies: Slice 1 provides the core interaction-state boundary and scope
  actions extended by this slice.
- Risks: accidental overlap with roadmap item 7.5, effect-order changes,
  callback identity changes, and mixing telemetry/announcement side effects
  into the pure state model.
- Out of Scope: selector-internal focus/keyboard/row state, matching logic,
  header search controls, graph rendering/model/detail presentation, new
  shortcuts, new announcements, or telemetry vocabulary changes.
- Smallest Useful Slice: selection source and cross-region focus requests must
  move together so one controller can preserve their ordering and return-focus
  invariants without leaving duplicate request owners in `FlowContents.tsx`.

### Slice 3: Separate viewport intent from ReactFlow effect execution

- Status: Approved
- Scope:
  - Define renderer-neutral viewport intent/state for search result centering,
    tree-originated selection centering, keyboard spatial navigation,
    expansion viewport preservation, and layout fitting.
  - Move ReactFlow instance ownership and fit/center execution out of
    `useFlowViewerController.ts` into the graph interaction/renderer adapter
    boundary established by roadmap item 7.1.
  - Include the `FlowGraphCanvas.tsx` wiring (`FlowGraphCanvasProps`,
    `useSyncSelectedFlowNode`, and `onRendererReady`) in this extraction: the
    adapter owns the instance capability needed for viewport execution while
    renderer-local selected-node visual synchronization remains unchanged.
  - Split the viewport-specific part of `useFlowViewerEffects.ts` into the
    focused browser-safe `useFlowViewportAdapter.ts` that receives plain
    intents and rendered unit IDs, resolves readiness/priority through
    `flowViewportFocus.ts`, and alone calls ReactFlow bounds, zoom, center,
    and fit APIs.
  - Replace direct keyboard `setCenter` calls in `FlowGraphPanelComponent` with
    controller-issued viewport intents while leaving DOM focus and keyboard
    decision helpers in Presentation.
  - Keep document/reveal subscriptions and overflow handling separate from the
    viewport adapter; do not move them into the renderer.
- User / Domain Value: search, selection, scope, and keyboard actions describe
  viewport intent without depending on ReactFlow, while one adapter preserves
  zoom, fitting, readiness, and cancellation behavior.
- Cohesive Change Group:
  - `flowViewportFocus.ts`, the viewport portion of
    `useFlowViewerEffects.ts`, `useFlowViewerController.ts`, and
    `FlowContents.tsx`, `FlowGraphCanvas.tsx`, and the
    `FlowGraphPanelComponent`/`FlowViewerBody` wiring
  - a focused ReactFlow viewport-effect adapter under `ajsFlow`
    (`useFlowViewportAdapter.ts`)
  - `flowViewportFocus.test.ts`, `flowViewerEffects.test.ts`,
    `flowViewportAdapter.test.ts`,
    `flowKeyboardNavigation.test.ts`, `flowViewerController.test.ts`, and
    `flowContentsIntegration.test.ts`
- Acceptance:
  - The interaction controller and its tests contain no ReactFlow instance,
    node-bounds, or renderer API dependency.
  - Exactly one adapter owns `getNodesBounds`, `getZoom`, `setCenter`,
    `fitView`, animation-frame scheduling/cancellation, and handled-request
    bookkeeping for viewport requests. `FlowContents.tsx`,
    `FlowGraphPanelComponent`, and
    `FlowGraphCanvas.tsx` contain no competing imperative viewport API call;
    the renderer's existing declarative initial `fitView` configuration may
    remain. Renderer-local selection visual synchronization is not treated as
    viewport execution.
  - Search and selection center the target at the current zoom; normal layout
    changes fit the graph; keyboard expansion preserves viewport; missing or
    not-yet-rendered targets retain current wait/fallback behavior.
  - Search intent keeps priority over selection and layout, stale requests do
    not reveal removed units, and a cleared pending target allows the next
    valid layout fit.
  - Graph DOM focus, keyboard scope entry/return, telemetry, announcements,
    renderer data, and viewer message contracts remain unchanged.
- Validation:
  - Extend pure viewport-decision tests for intent priority, stale and missing
    targets, handled versions, layout identity, expansion preservation, and
    current-zoom centering.
  - Add `flowViewportAdapter.test.ts` coverage for single execution,
    animation-frame cancellation,
    renderer readiness, bounds/zoom use, and unmount cleanup.
  - Preserve `flowViewportFocus.test.ts`, `flowViewerEffects.test.ts`,
    `flowKeyboardNavigation.test.ts`, `flowViewerController.test.ts`,
    `flowContentsIntegration.test.ts`, accessibility DOM coverage, and
    `viewerBundle.test.ts`.
  - Run the focused adapter and integration tests, `rtk pnpm test`,
    `rtk pnpm run test:prepare:web`, `rtk pnpm test:web`,
    `rtk pnpm run build`, `rtk pnpm run qlty`, and `git diff --check`.
- Production Readiness:
  - Failure mode: duplicate frames, stale handled versions, missing renderer
    readiness, or changed priority can cause jumps, zoom loss, or focus races;
    adapter lifecycle and sequence tests are required.
  - JP1/AJS compatibility: graph identity and placement constraints are
    unchanged; preserve nested/deep graph fixtures and empty graph fallback.
  - Large or malformed input risk: intent resolution remains set/ID based and
    renderer work remains the existing bounds/fit operation; no additional
    graph traversal or asymptotic cost is permitted.
  - Desktop/web impact: highest-risk integration slice because it moves shared
    renderer effects; require host-neutral behavior tests, production bundle,
    desktop suite, and web smoke while not treating smoke as interaction proof.
  - README/docs impact: none expected; evaluate architecture wording at Feature
    Exit only if the reusable adapter boundary is not already captured.
  - CHANGELOG impact: not required for unchanged interaction behavior; any
    visible viewport or compatibility change requires replanning.
- Qlty Evidence: run `rtk pnpm run qlty`, reject new smells in changed source,
  and compare `FlowContents.tsx`, `useFlowViewerController.ts`,
  `useFlowViewerEffects.ts`, and `flowViewportFocus.ts` against the shared
  baseline as evidence of a useful responsibility boundary.
- Approval Boundary: renderer-neutral viewport intents, ReactFlow adapter
  extraction, graph-panel wiring, and focused dual-host validation only.
- Dependencies: Slice 1 supplies search/scope intent; Slice 2 supplies
  selection and focus-request intent.
- Risks: React effect ordering, stale closures, animation-frame cleanup,
  duplicate renderer calls, accidental movement of DOM focus into ReactFlow,
  and web bundling drift.
- Out of Scope: layout algorithm or graph constraint changes, visual redesign,
  renderer-model changes, parser/application DTO changes, tree internals,
  shared search, or transport/telemetry changes.
- Smallest Useful Slice: viewport decisions, renderer instance ownership,
  execution, cleanup, and their tests must move together to leave one usable
  adapter and no competing ReactFlow effect owner.

## Cross-Slice Dependencies

1. Slice 1 establishes atomic scope/search/reveal state and removes the hidden
   one-shot preservation ref.
2. Slice 2 depends on Slice 1 and extends that boundary with selection source
   and cross-region focus intents while leaving renderer execution unchanged.
3. Slice 3 depends on Slices 1 and 2, consumes their renderer-neutral intents,
   and becomes the sole ReactFlow viewport effect adapter.
4. Each slice is independently testable, reviewable, committable, and
   approvable; implementation proceeds in order and each completed slice must
   leave the viewer usable.
5. A required user-visible behavior, Application DTO, message schema,
   telemetry contract, parser, graph placement, shared search, or tree-internal
   change triggers Replanning Mode and new approval before edits continue.
6. The pure interaction controller, viewer composition hook, graph DOM-focus
   adapter, renderer selection sync, and viewport adapter remain separate
   owners; a slice cannot satisfy this plan by moving ReactFlow calls into a
   different existing hook without removing the duplicate owner.

## Feature-Level Risks

- A unified state boundary can become an oversized generic reducer. Keep it
  flow-viewer-specific and expose only transitions needed by the durable use
  case.
- React state/effect ordering currently supplies implicit coordination; pure
  transition tests and integration tests must replace that hidden assumption.
- Search, selection, graph DOM focus, and viewport requests have different
  lifetimes. Do not collapse them into one ambiguous `focusedUnitId`.
- `FlowContents.tsx` and `flowTreeSelection.ts` contain responsibilities owned
  by roadmap items 7.4 and 7.5. Follow the recorded symbol/behavior boundary,
  not the whole-file surface.
- Desktop tests prove host-neutral interactions; web preparation, build, and
  smoke prove browser-safe delivery but do not substitute for focused behavior
  coverage.
- Baseline complexity improvement is supporting evidence, not permission for
  unrelated cleanup or a repository-wide threshold.

## Use-Case Back-Propagation

- `uc-explore-flow-graph.md` and
  `uc-navigate-between-unit-list-and-flow-graph.md` already own the durable
  behavior contracts; no scenario change is planned.
- If implementation changes matching, scope, selection, reveal, focus,
  viewport, cross-view navigation, accessibility, or failure behavior, stop,
  enter Replanning Mode, update the owning use case, evaluate README and
  CHANGELOG impact, and obtain new approval.
- At Feature Exit, update durable architecture documentation only if the final
  reusable presentation boundary is not already expressed in
  `docs/specs/architecture.md`.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this non-trivial behavior-preserving boundary refactor spans three
  dependent slices, user-visible interaction scenarios, and shared desktop/web
  presentation code.

## Feature Exit

- Definition of Done status: Not started.
- Durable documentation updates: no use-case, README, or CHANGELOG change is
  planned; reevaluate architecture wording and roadmap item 7.2 after all
  slices pass.
- Open risks: transition ordering, stale focus/viewport requests, exact 7.5
  boundary, telemetry duplication, large-result behavior, Qlty evidence, and
  desktop/web divergence.

## Validation

- [x] Review the full plan with `sdd-review-plan`.
- [x] Obtain clear human approval for the reviewed implementation scope.
- [ ] Add or update focused tests inside every approved code slice.
- [ ] Run `rtk pnpm run qlty` for every code slice.
- [ ] Run `rtk pnpm run test:prepare:web` for every shared-webview slice.
- [ ] Complete full desktop, production build, web smoke, architecture, and
      final Qlty evidence in Slice 3.
- [ ] Evaluate durable docs, README, CHANGELOG, and roadmap impact at Feature
      Exit.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
