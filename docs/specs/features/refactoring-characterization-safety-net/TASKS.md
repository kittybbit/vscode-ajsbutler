# Feature Tasks: Refactoring Characterization Safety Net

## Agent Brief

- Purpose: establish independently reviewable characterization contracts for
  the baseline-selected refactoring boundaries.
- Approved or active slice: all 14 slices are approved; implement one slice at
  a time.
- Do not: change runtime behavior, refactor production structure, or add new
  JP1/AJS capabilities.
- Do not: combine parser, application, presentation, host, and telemetry
  boundaries into one approval decision.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the baseline group
  evidence in `docs/specs/features/BASELINE.md`.
- Read `TRACEABILITY.md` when preparing or reviewing any slice.
- Validate: the slice-specific tests listed below, relevant desktop/web smoke
  checks, and `rtk pnpm run qlty` for code changes.
- Approval policy: see `docs/specs/README.md`; implementation is prohibited
  while Human Approval is Pending.
- Document roles: see `docs/specs/README.md`.
- Next decision: begin `sdd-implement-task` with one approved slice at a time.

## Sync Rule

- Update this file in the same commit whenever a slice is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Later
  feature folders remain separate even though the refactoring effort is
  sequential.
- Update `docs/specs/roadmap.md` only when repository-level ordering, entry
  conditions, or unresolved concerns change. The existing roadmap item is
  sufficient for this plan.
- Keep this file focused on approval-ready slices, validation, risks, and
  feature-exit readiness; do not use it as a work log.

## Plan Status

- Status: In Progress
- Planning scope: Feature 3, Refactoring Characterization Safety Net, based on
  baseline intake groups 1-14.
- Review status: `sdd-review-plan` passed; Human Approval recorded on
  2026-08-02.
- Human approval: Approved for all 14 slices; implementation remains one slice
  at a time.
- Active implementation slice: Slice 11: VS Code viewer factory and plain
  transport characterization.

## Replanning Decision

- Trigger: `sdd-review-plan` found ambiguous cross-slice ownership, overly broad
  failure-language, non-concrete host/qlty validation, and incomplete impact
  evidence.
- Decision: retain the 14 baseline responsibility groups and revise only their
  target symbols, dependencies, approval boundaries, failure contracts, and
  validation evidence. No new product or refactoring scope is added.
- Current state: Plan approved after `sdd-review-plan`; implementation may
  begin only within the approved slice boundaries.
- Implementation assumption: characterization work may change tests and
  fixtures only. Any runtime, generated-parser, configuration, or architecture
  dependency change requires Replanning Mode and new approval.

## Validation Conventions

- `V-Q`: run `rtk pnpm run qlty`; the result must pass, and any new actionable
  smell must be resolved or recorded as an approved follow-up. Metrics-only
  movement is recorded as a risk signal, not a new threshold.
- `V-D`: run `rtk pnpm run test:prepare:desktop`, then
  `rtk pnpm run test:desktop:run`.
- `V-W`: run `rtk pnpm run test:prepare:web`, then
  `rtk pnpm run test:web:run`.
- `V-DW`: run `rtk pnpm run test:full`; use this for shared contracts,
  extension entry points, host adapters, and webview boundaries.
- `V-B`: run `rtk pnpm run build` when the slice changes or characterizes
  bundling, extension entry points, or host transport.
- The named test files below are the slice evidence set. The repository's
  current runners execute the compiled suite; unrelated failures must not be
  accepted as characterization evidence without an explicit follow-up.
- Large-input evidence records the actual unit, row, node, query, and nesting
  bounds in the fixture/test name or assertion. Use bounded fixtures, not
  unbounded snapshots.
- `rtk pnpm run lint:md` is required after these Markdown documents change.

## Human Approval

- Status: Approved
- Approved at: 2026-08-02
- Approved scope: Slices 1-14 as currently defined in this file. Characterization
  work may change tests and fixtures only; runtime, generated-parser,
  configuration, or architecture dependency changes require Replanning Mode
  and new approval.

Implementation must proceed one approved slice at a time and remain within the
approved boundaries.

## Implementation Slices

### Slice 1: Normalized parser application-port characterization

- Status: Complete
- Scope: Characterize `src/application/parsing/AjsParserPort.ts` and its
  normalized document/error contract for valid, malformed, encoded, and large
  JP1/AJS definitions.
- Target symbols: `AjsParserPort.parse`, `ParseAjsResult`, and
  `AjsParserError`; `AntlrAjsParser` and normalization are observed only as
  the infrastructure implementation of this port.
- User / Domain Value: Later parser-boundary changes can prove that normalized
  model output and owned failures remain stable.
- Cohesive Change Group: Port contract assertions and parser/normalization
  golden fixtures; consumer tests are read-only compatibility checks.
- Acceptance: `{ok: true, document}` and `{ok: false, errors}` remain the
  current complete-result and owned-error alternatives, including fallback
  spans. No partial normalized document is recorded. Generated parser types and
  `AjsRawUnit` remain in parser infrastructure.
- Validation: `src/test/suite/AntlrAjsParser.test.ts`,
  `normalizeAjsDocument.test.ts`, `buildSyntaxDiagnostics.test.ts`,
  `buildFlowGraphUseCase.test.ts`, and `buildUnitList.test.ts`, covering valid,
  malformed/truncated, encoded-parameter, and bounded-large definitions;
  `V-DW`, `V-B`, and `V-Q`.
- Production Readiness:
  - Failure mode: malformed or encoded input must return the existing owned
    error/fallback contract, not a false complete document.
  - JP1/AJS compatibility: preserve existing normalization and parser-error
    semantics.
  - Large or malformed input risk: record the fixture unit count and parser
    completion result; reject partial normalization rather than broad snapshots.
  - Desktop/web impact: shared port behavior is checked in both entry paths.
  - README/docs impact: none; existing parser use cases remain current.
  - CHANGELOG impact: none; no user-visible behavior change.
- Approval Boundary: parser port contract and its evidence only.
- Dependencies: baseline commit; no other characterization slice.
- Risks: fixture shape may accidentally assert generated-parser internals or
  make the port contract depend on adapter implementation details.
- Out of Scope: grammar changes, generated code changes, parser refactoring.

### Slice 2: JP1/AJS schedule-rule characterization

- Status: Complete
- Scope: Characterize `scheduleRuleHelpers.ts` for omitted, explicit,
  inherited, invalid, and boundary version-13 schedule values.
- Target symbols: `resolveEffectiveStartConditionMonitoringPair`,
  `parseRuleValue`, `parseScheduleDateValue`,
  `resolveScheduleByDaysFromStart`, and `resolveMaxShiftableDays`.
- User / Domain Value: All consumers retain one normative schedule
  interpretation before domain restructuring.
- Cohesive Change Group: Schedule-rule helper cases and consumer assertions.
- Acceptance: Raw/effective values, start-condition monitoring pairs, day
  shifts, and max shiftable days remain unchanged for existing consumers.
- Validation: `src/test/suite/scheduleRuleHelpers.test.ts`,
  `evaluateScheduleDiagnosticViolations.test.ts`, `buildSyntaxDiagnostics.test.ts`,
  `buildUnitList.test.ts`, and `buildUnitListRemainingGroups.test.ts`, covering
  omitted/default, explicit, inherited, invalid, encoded, and boundary version
  13 values; `V-DW` and `V-Q`. Semantic-diff tests are not part of this slice;
  any read-only regression check is recorded separately without changing that
  feature's behavior.
- Production Readiness:
  - Failure mode: invalid or omitted values retain existing fallback/error
    behavior and do not silently become valid schedules.
  - JP1/AJS compatibility: preserve documented version-13 semantics in
    `interpret-jp1-parameters.md`.
  - Large or malformed input risk: cover repeated/encoded parameter values
    without changing normalization cost or result determinism.
  - Desktop/web impact: domain output is host-neutral and consumed by both.
  - README/docs impact: no user documentation change.
  - CHANGELOG impact: none; characterization only.
- Approval Boundary: schedule-rule meaning and compatibility matrix only.
- Dependencies: baseline commit only. This domain helper is independently
  approvable; Slice 3 and Slice 5 consume its completed evidence.
- Risks: undocumented vendor edge cases may require explicit follow-up rather
  than inferred semantics.
- Out of Scope: new schedule rules, defaults, or domain restructuring.

### Slice 3: Application syntax and semantic diagnostics characterization

- Status: Complete
- Scope: Characterize syntax parsing, supported semantic violations,
  diagnostic category/severity/message, and 1-based line/0-based column spans.
- Target symbols: `createBuildSyntaxDiagnostics`,
  `mapParserErrorToSyntaxDiagnostic`, `buildSemanticSyntaxDiagnostics`,
  `withDiagnosticCategory`, `buildJobEndJudgmentDiagnostics`, `staticMessage`,
  and `buildScheduleRuleDiagnostics`.
- User / Domain Value: Refactoring diagnostic orchestration can be verified
  without changing editor feedback.
- Cohesive Change Group: `editor-feedback` builders, diagnostic rule fixtures,
  and host-neutral diagnostic mapping assertions.
- Acceptance: valid input retains the current empty-result behavior; parser
  failures retain their current application diagnostic mapping; supported rule
  violations retain category, severity, message, rule identity, and
  1-based-line/0-based-column spans. Do not generalize this as a new partial
  result policy.
- Validation: `src/test/suite/buildSyntaxDiagnostics.test.ts`,
  `evaluateEventDiagnosticViolations.test.ts`,
  `evaluateJobEndDiagnosticViolations.test.ts`,
  `evaluateMonitoringWaitDiagnosticViolations.test.ts`,
  `evaluateScheduleDiagnosticViolations.test.ts`,
  `evaluateTransferDiagnosticViolations.test.ts`, `mapDiagnosticViolation.test.ts`,
  and `syntaxDiagnosticEventRules.test.ts`, covering valid, malformed,
  supported-rule, and bounded-large definitions; `V-DW`, `V-B`, and `V-Q`.
- Production Readiness:
  - Failure mode: malformed definitions retain the current parser-diagnostic
    mapping and do not acquire semantic-success claims from partial input.
  - JP1/AJS compatibility: preserve the diagnostic rule documents and current
    message/severity semantics.
  - Large or malformed input risk: include malformed and large definitions and
    assert bounded, deterministic diagnostic output.
  - Desktop/web impact: application decisions remain identical across hosts;
    VS Code mapping stays in presentation.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: application diagnostic decision contract only.
- Dependencies: Slices 1 and 2 for parser and schedule evidence.
- Risks: snapshotting message text can obscure the semantic rule being tested.
- Out of Scope: new diagnostic rule IDs, wording, spans, or VS Code mapping.

### Slice 4: Application flow-graph construction characterization

- Status: Complete
- Scope: Characterize deterministic nodes, edges, ordering, containment,
  visible nested scope, job-group resolution, and malformed relations in
  `buildFlowGraph.ts`.
- Target symbols: `buildFlowGraphFromValidatedDocument`, `toInput`,
  `toAncestorNodes`, `buildFlowGraphResult`, and `toEdgeDtos`.
- User / Domain Value: Later flow application extraction preserves graph
  identity and scope semantics.
- Cohesive Change Group: Flow graph builder, DTO fixtures, and relation/error
  cases.
- Acceptance: identical normalized input and visible scope produce identical
  graph DTO identity, ordering, relation/containment semantics, and
  affected-subtree scope. A missing or malformed relation retains the current
  unavailable/error result; this slice does not assert renderer geometry.
- Validation: `src/test/suite/buildFlowGraph.test.ts`,
  `buildFlowGraphUseCase.test.ts`, `flowGraphDocument.test.ts`,
  `buildExpandedFlowGraph.test.ts`, and `buildExpandedFlowGraphUseCase.test.ts`,
  covering malformed relations, job groups, and bounded deep nesting;
  `V-DW`, `V-B`, and `V-Q`.
- Production Readiness:
  - Failure mode: malformed relations retain current fallback/error behavior.
  - JP1/AJS compatibility: preserve unit identity, nesting, and job-group
    semantics from normalized definitions.
  - Large or malformed input risk: include deeply nested and large graphs;
    assert no accidental partial graph result.
  - Desktop/web impact: application DTO is shared by both viewers.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: application graph meaning and DTO contract only.
- Dependencies: Slice 1 for the normalized document contract.
- Risks: geometry assertions could leak presentation concerns into this slice.
- Out of Scope: coordinates, renderer behavior, or webview layout changes.

### Slice 5: Unit-list group projection characterization

- Status: Complete
- Scope: Characterize remaining JP1/AJS group-to-row mapping in
  `buildUnitListRemainingGroups.ts`, including effective parameters, row
  metadata, stable ordering, and CSV-facing identity.
- Target symbols: `buildGroup17View`, `isCustomJob`, `isFlexibleJob`,
  `buildGroup18View`, and `buildGroup13View` in
  `buildUnitListRemainingGroups.ts`.
- User / Domain Value: Unit-list and CSV consumers retain the same rows while
  application orchestration is later changed.
- Cohesive Change Group: Group 13/17/18 projections, representative unit
  fixtures, and list/CSV assertions.
- Acceptance: representative group types, custom/flexible jobs, effective
  values, row identity, and ordering remain unchanged.
- Validation: `src/test/suite/buildUnitListRemainingGroups.test.ts`,
  `buildUnitList.test.ts`, `buildUnitListView.test.ts`, and
  `exportUnitListCsv.test.ts`, covering group 13/17/18, custom/flexible jobs,
  encoded values, bounded-large lists, row identity, and ordering; `V-DW`,
  `V-B`, and `V-Q`. CSV escaping and visible-column formatting remain outside
  this slice.
- Production Readiness:
  - Failure mode: unsupported or malformed units do not become partial rows.
  - JP1/AJS compatibility: preserve group semantics and effective parameter
    interpretation.
  - Large or malformed input risk: cover large lists and encoded values while
    retaining deterministic ordering.
  - Desktop/web impact: shared list and CSV DTOs are checked in both hosts.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: application group projection and row contract only.
- Dependencies: Slices 1 and 2 for normalized input and schedule semantics.
- Risks: CSV tests may accidentally cover unrelated table formatting.
- Out of Scope: group semantics, visible columns, CSV escaping, or UI code.

### Slice 6: Unit-list document validation and projection characterization

- Status: Complete
- Scope: Characterize validation and projection in `unitListDocument.ts`,
  including valid, malformed, encoded, and large documents.
- Target symbols: `isUnitListRowRecord`, `hasMatchingProjectionIdentity`,
  `isUnitListRootDto`, `isUnitListUnitMetadata`, and `toUnitListTableData`.
- User / Domain Value: The high-complexity list boundary has a stable before
  state for later decomposition.
- Cohesive Change Group: Projection identity validation, root/unit metadata,
  row data, and no-partial-list fixtures.
- Acceptance: valid input returns the current root/row/unit projection;
  malformed serialized input or projection-identity mismatch retains the
  current `undefined`/safe-state behavior; incomplete data is not presented as
  a complete list.
- Validation: `src/test/suite/buildUnitList.test.ts`, `tableViewerData.test.ts`,
  `unitDefinitionDocumentState.test.ts`, and `unitListEncoding.test.ts`,
  covering malformed root/row records, identity mismatch, encoded values, and
  the existing bounded-large projection scenario; `V-DW`, `V-B`, and `V-Q`.
- Production Readiness:
  - Failure mode: invalid root or row records preserve current rejection or
    fallback behavior.
  - JP1/AJS compatibility: preserve normalized unit/list semantics.
  - Large or malformed input risk: include large row counts and malformed
    projections without avoidable crashes.
  - Desktop/web impact: application projection remains host-neutral.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: list-document validation/projection contract only.
- Dependencies: Slices 1, 2, and 5 for normalized input, schedule semantics,
  and group projection evidence.
- Risks: complexity metrics may be mistaken for behavior evidence.
- Out of Scope: decomposition, parser normalization, or CSV meaning changes.

### Slice 7: Flow rendering and detail presentation characterization

- Status: Complete
- Scope: Characterize graph rendering, node/edge realization, nested bounds,
  relationship focus, detail rows/actions, and visual state in the flow
  webview.
- Target symbols: `FlowGraphPanelComponent`, `FlowContents`,
  `useSyncSelectedFlowNode`, `syncSelectedNode`, and `FlowViewerBody` in
  `FlowContents.tsx`; `toEdge`, `edgeStrokeColor`, `toNodeData`, `toEdgeStyle`,
  and `toNestedPanelBoundsNode` in `flowGraphView.ts`;
  `buildFlowNodeDetailRows`, `buildRelationshipFocusAction`,
  `buildOpenScopeActions`, `buildOpenDefinitionActions`,
  `RelationshipFocusButton`, `CurrentUnitBadge`, `MiniMapButton`,
  `ExpandAllNestedUnitsButton`, `NodeStatusIndicators`, `FlowNodeCard`,
  `NodeNameAndComment`, `ActionIcon`, `getFlowNodeHeaderItemKinds`,
  `resolveNodeBorderStyle`, `buildNodeSxProps`, `nestedPanelSxProps`,
  `buildNodeHoverDecoration`, and `resolveVisualKind`.
- User / Domain Value: Flow exploration remains visually and behaviorally
  stable during later presentation separation.
- Cohesive Change Group: `FlowContents`, `flowGraphView`, detail panel, header,
  node card, and node style behavior.
- Acceptance: rendered nodes and edges preserve application DTO identity;
  selection, focus, non-overlap, nested bounds, detail actions, and
  unaffected-region stability retain current behavior. Graph DTO meaning and
  application placement remain Slice 4 ownership.
- Validation: `src/test/suite/flowGraphView.test.ts`,
  `flowNodeDetail.test.ts`, `flowNodeDetailPanelCollapse.test.ts`,
  `flowRelationshipFocus.test.ts`, `flowNodeDisplay.test.ts`,
  `flowHeader.test.ts`, `nodeSxProps.test.ts`, and `flowAccessibility.test.ts`,
  including existing large/deep graph cases and explicit detail/header
  fallback assertions; `V-DW`, `V-Q`.
- Production Readiness:
  - Failure mode: missing detail or relation data keeps current fallback and
    focus behavior.
  - JP1/AJS compatibility: preserve graph identity and localized unit data.
  - Large or malformed input risk: cover deeply nested/large graphs and avoid
    unstable layout or render crashes.
  - Desktop/web impact: shared browser webview path is exercised from both
    hosts.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: flow rendering/detail presentation only.
- Dependencies: Slice 4 for graph DTO identity and scope semantics.
- Risks: geometry snapshots may become brittle; assert semantic invariants too.
- Out of Scope: graph DTO meaning, parser imports, or application placement.

### Slice 8: Flow search and viewer interaction-state characterization

- Status: Complete
- Scope: Characterize current-scope search, collapsed-ancestor reveal,
  selection, Enter/Escape transitions, focus restoration, and viewport effects.
- Target symbols: `useSearchSubmitHandler`, `useFlowSearchState`,
  `useRevealUnitHandler`, `applyFlowSearchSubmission`,
  `resolveFlowSearchSubmission`, `useOpenSelectedNodeScope`,
  `useFlowTreeSelectionState`, `useFlowViewerLifecycle`,
  `mergeExpandedUnitIds`, `useOpenSelectedNodeDefinition`,
  `resolveNextCurrentUnitId`, `runFlowViewerFitViewEffect`,
  `updateHandledViewportFocus`, `resolveFlowDocumentChange`, and
  `useRevealUnitSubscription`.
- User / Domain Value: Flow navigation state remains predictable during hook
  and controller separation.
- Cohesive Change Group: `useFlowSearchState`, `useFlowViewerController`, and
  `useFlowViewerEffects` scenarios.
- Acceptance: the same fixtures yield the same active scope, selected unit,
  result navigation, viewport request, zoom, and focus destination.
- Validation: `src/test/suite/flowSearch.test.ts`, `flowSearchState.test.ts`,
  `flowKeyboardNavigation.test.ts`, `flowViewerShortcuts.test.ts`,
  `flowViewportFocus.test.ts`, and `revealUnit.test.ts`, covering current-scope
  matching, collapsed ancestors, stale selections, Enter/Escape, large result
  sets, and zoom-preserving focus; `V-DW` and `V-Q`.
- Production Readiness:
  - Failure mode: unavailable scope or stale selection retains current safe
    fallback and does not reveal an invalid unit.
  - JP1/AJS compatibility: preserve unit identity and scope relationships.
  - Large or malformed input risk: cover large result sets and nested scopes.
  - Desktop/web impact: browser-hosted hooks are shared by both extension
    hosts.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: flow interaction state transitions only.
- Dependencies: Slice 4 for graph scope/identity and Slice 7 only for the
  rendered-state evidence used by viewport assertions. The state contract
  remains independently approvable with deterministic event fixtures.
- Risks: interaction timing can be host-sensitive; use deterministic event
  fixtures and a host smoke check.
- Out of Scope: shared search domain semantics or keyboard-binding changes.

### Slice 9: Unit-list table presentation and keyboard navigation characterization

- Status: Complete
- Scope: Characterize columns, virtualization, sorting/search display,
  keyboard focus movement, detail inspection, visible-column export, and
  counterpart navigation.
- Target symbols: `ColumnDetail`, `ColumnDetailItem`,
  `DisplayColumnSelector`, `NestedColumnGroup`,
  `createColumnVisibilityUpdate`, `Header`, `moveCellFocus`,
  `moveHeaderFocus`, `resolveUnitListGridShortcut`, `resolveTableGridFocus`,
  `TableContents`, `VirtualizedTable`, `revealGridFocusElement`, and
  `renderVisibleTableCell`.
- User / Domain Value: Large unit lists remain usable while table presentation
  is separated from application DTOs.
- Cohesive Change Group: Table header/contents, column selector, navigation,
  virtualized table, and table search presentation.
- Acceptance: selected unit, visible columns, focus destination, sorting/search
  display, and virtualization behavior remain unchanged. The application CSV
  row meaning is Slice 5 ownership; this slice checks only the presentation's
  visible-column request and export interaction.
- Validation: `src/test/suite/ajsTableHeader.test.ts`, `tableColumnDef.test.ts`,
  `tableNavigation.test.ts`, `tableSearchState.test.ts`, `tableViewerData.test.ts`,
  `exportCsvView.test.ts`, and `accessibilityDom.test.tsx`, using the existing
  large-list virtualization/focus cases and explicit missing-row fallback;
  `V-DW`, `V-Q`.
- Production Readiness:
  - Failure mode: missing rows or focus targets retain current fallback and do
    not corrupt CSV output.
  - JP1/AJS compatibility: preserve row fields, unit identity, and CSV meaning.
  - Large or malformed input risk: exercise virtualization and large lists.
  - Desktop/web impact: shared table webview behavior is checked in both hosts.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: table presentation and keyboard navigation only.
- Dependencies: Slices 5 and 6 for row identity and projection evidence.
- Risks: framework snapshots can hide keyboard semantics; retain behavior-level
  assertions.
- Out of Scope: list DTO fields, CSV domain meaning, or cross-view contract.

### Slice 10: Viewer composition wiring characterization

- Status: Complete
- Scope: Characterize activation, dependency wiring, readiness, counterpart
  navigation, unavailable-view fallback, disposal, and desktop/browser
  capability selection in `viewerWiring.ts`.
- Target symbols: `revealCounterpartPanel`, `createViewerBundle`,
  `createViewerReadyHandler`, `resolveTargetViewType`, and
  `createViewerSubscriptions`.
- User / Domain Value: Later composition changes preserve viewer lifecycle and
  navigation without adding a service container or architecture exception.
- Cohesive Change Group: Viewer bundle creation, ready handlers, target view
  resolution, and counterpart reveal.
- Acceptance: the current architecture result remains 13 passing / 0 failing;
  viewer lifecycle, readiness, counterpart navigation, fallback, and disposal
  remain unchanged on both hosts. Telemetry payload meaning is Slice 14
  ownership and is stubbed here.
- Validation: `src/test/suite/viewerWiring.test.ts`, `viewerBundle.test.ts`,
  `extensionLifecycle.test.ts`, `extensionDependencies.test.ts`, and
  `architectureDependencyRules.test.ts`; `V-DW`, `V-B`, and `V-Q`.
- Production Readiness:
  - Failure mode: unavailable panel or failed capability retains safe fallback
    and disposal behavior.
  - JP1/AJS compatibility: preserve viewer commands and counterpart identity.
  - Large or malformed input risk: wiring must not bypass existing parser or
    projection failure handling.
  - Desktop/web impact: validate capability selection independently for both.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: bootstrap composition responsibility only.
- Dependencies: Slices 4, 6, 7, 9, and 11. Slice 11 is ordered first because
  the current composition root constructs the concrete `ViewerFactory`.
  Feature 2 remains evidence-gated and is not implemented by this slice.
- Risks: treating complexity as an architecture violation would expand scope.
- Out of Scope: service-container introduction or architecture allowlists.

### Slice 11: VS Code viewer factory and plain transport characterization

- Status: Approved
- Scope: Characterize panel creation/reuse, titles, readiness, disposal, and
  serialized plain-message transport in `ViewerFactory.ts`.
- Target symbols: `resolveViewerPanelTitle`, `getPanel`, `getExistingPanel`,
  `registerStandardViewerCustomize`, `createAndStorePanel`, and the
  `ViewerFactory` constructor.
- User / Domain Value: Later infrastructure cleanup preserves host lifecycle
  while keeping application-facing transport plain.
- Cohesive Change Group: VS Code viewer factory and its panel/transport tests.
- Acceptance: table/flow panel lifecycle, title selection, reuse, disposal,
  readiness, and JSON-safe plain message serialization remain unchanged.
  Telemetry event names and payload meaning are validated only by Slice 14.
- Validation: `src/test/suite/viewerFactory.test.ts`,
  `viewerHostMessages.test.ts`, `viewerMessageRouting.test.ts`,
  `viewerRequestMessages.test.ts`, and `reportWebviewOperation.test.ts`,
  covering create/reuse/dispose and large plain payload handling; `V-DW`,
  `V-B`, and `V-Q`.
- Production Readiness:
  - Failure mode: panel creation or message failure keeps current disposal and
    fallback behavior.
  - JP1/AJS compatibility: preserve viewer commands and plain DTO payloads.
  - Large or malformed input risk: transport must not serialize parser internals
    or crash on large payloads.
  - Desktop/web impact: desktop panel APIs and browser capabilities are checked
    separately.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: host adapter lifecycle and plain transport only.
- Dependencies: baseline transport contract only; no dependency on Slice 10.
  Slice 10 consumes this factory evidence.
- Risks: VS Code APIs are version-sensitive; retain `^1.75.0` compatibility.
- Out of Scope: panel title/message changes or Node-only shared behavior.

### Slice 12: Shared webview header search characterization

- Status: Approved
- Scope: Characterize empty/non-empty queries, shortcut handling, helper text,
  result counts, localization, and focus in the shared header control.
- Target symbols: `resolveHeaderSearchHelperText`, `isHeaderSearchShortcut`,
  `HeaderSearchField`, `HeaderSearchControl`, and
  `useHeaderSearchControlState`.
- User / Domain Value: Table and flow users retain current presentation-local
  search behavior during UI separation.
- Cohesive Change Group: `HeaderSearchField.tsx` control and state behavior in
  both table and flow consumers.
- Acceptance: helper text, shortcuts, matching presentation, result counts,
  focus, and localization remain unchanged. The control forwards query input to
  its existing callbacks and does not define telemetry privacy behavior.
- Validation: `src/test/suite/headerSearchField.test.ts`,
  `flowSearch.test.ts`, `tableSearchState.test.ts`, and
  `accessibilityDom.test.tsx`, covering empty/long queries and focus/shortcut
  behavior; `V-DW` and `V-Q`.
- Production Readiness:
  - Failure mode: empty or invalid query input keeps current no-result/focus
    behavior; query privacy is validated by Slice 14, not this control slice.
  - JP1/AJS compatibility: no domain interpretation is introduced.
  - Large or malformed input risk: long query and large result counts remain
    responsive and deterministic.
  - Desktop/web impact: shared webview control is checked in both hosts.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: shared header control behavior only.
- Dependencies: existing flow/table callback contracts only; no implementation
  dependency on Slices 7-9. Consumer integration is read-only evidence.
- Risks: accidentally unifying flow/table matching semantics.
- Out of Scope: shared search domain contract, query telemetry, or result-order
  changes.

### Slice 13: Flow tree selector characterization

- Status: Approved
- Scope: Characterize enabled/disabled rows, focus movement, Enter/Space/
  Alt+Enter behavior, scope selection, reveal, and return focus.
- Target symbols: `UnitTreeSelector`, `UnitTreeSelectorUnit`,
  `UnitTreeRowFrame`, `isTreeNavigationKey`, and `resolveUnitTreeRowState`.
- User / Domain Value: Nested flow trees retain stable selection and keyboard
  interaction during presentation separation.
- Cohesive Change Group: `UnitTreeSelector.tsx` rows, focus state, and tree
  navigation behavior.
- Acceptance: row state, selected unit, active scope, reveal target, and focus
  destination remain unchanged for large and nested trees.
- Validation: `src/test/suite/unitTreeSelector.test.ts`,
  `accessibilityDom.test.tsx`, `flowSelector.test.ts`, and
  `flowKeyboardNavigation.test.ts`, covering disabled rows, nested/deep trees,
  Enter/Space/Alt+Enter, reveal, and return focus; `V-DW` and `V-Q`.
- Production Readiness:
  - Failure mode: unavailable/disabled rows remain non-selectable and retain
    current focus fallback.
  - JP1/AJS compatibility: preserve normalized unit identity and scope rules.
  - Large or malformed input risk: cover large/deep trees without recursion or
    focus crashes.
  - Desktop/web impact: shared flow-tree control is checked in both hosts.
  - README/docs impact: none.
  - CHANGELOG impact: none.
- Approval Boundary: tree selector interaction only.
- Dependencies: existing stable-path and focus contracts only; no
  implementation dependency on Slices 7-8. Flow integration is read-only
  evidence.
- Risks: visual state can obscure keyboard behavior; assert state transitions.
- Out of Scope: graph scope resolution, layout, unit identity, or counterpart
  opening semantics.

### Slice 14: Validated telemetry contract and event-builder characterization

- Status: Approved
- Scope: Characterize event names, allowlisted properties, duration/count/HTTP
  buckets, viewer/search/performance builders, no-op fallback, and disposal.
- Target symbols: `createPerformanceTelemetryEvent`,
  `createSearchTelemetryEvent`, bucket validators/converters,
  `allowTelemetryProperties`, `createTelemetryEvent`, viewer action builders,
  `createViewerNavigationActionEvent`, `findViewerActionDefinition`,
  `resolveViewerActionView`, `createViewerActionEvent`,
  `createLegacyViewerOpenedEvent`, `resolveViewerTelemetryKind`,
  `getViewerEventDefinition`, `createViewerEvent`, and
  `createViewerReadyEvent`.
- User / Domain Value: Later telemetry infrastructure cleanup cannot change
  privacy or interrupt user workflows.
- Cohesive Change Group: The single cross-layer telemetry contract: application
  event catalog/builders plus the infrastructure adapter and bootstrap no-op
  selection. It does not become a general application/infrastructure refactor.
- Acceptance: existing event names and payload meaning remain stable; prohibited
  content, paths, queries, identifiers, and raw errors are absent; failures do
  not block workflows.
- Validation: `src/test/suite/telemetryBuckets.test.ts`,
  `telemetryEvent.test.ts`, `performanceTelemetry.test.ts`,
  `searchTelemetry.test.ts`, `viewerActionTelemetry.test.ts`,
  `viewerTelemetry.test.ts`, `telemetryAdapter.test.ts`, and
  `createTelemetry.test.ts`, covering forbidden content/path/query/identifier
  inputs, bounded buckets, initialization/report/disposal failures, and the
  browser port contract; `V-DW`, `V-B`, and `V-Q`. Workflow call-site checks
  are read-only integration evidence from Slices 3, 8, 9, 10, 11, and 12.
- Production Readiness:
  - Failure mode: telemetry initialization/report/disposal failure falls back
    to the existing no-op behavior and never blocks a workflow.
  - JP1/AJS compatibility: event semantics remain tied to existing workflows;
    no new JP1/AJS data is collected.
  - Large or malformed input risk: buckets remain bounded and raw input is not
    retained.
  - Desktop/web impact: validated contract and no-op fallback are shared.
  - README/docs impact: no user-facing change; privacy contract remains the
    durable owner.
  - CHANGELOG impact: none.
- Approval Boundary: validated event contract and privacy behavior only.
- Dependencies: the telemetry contract is independently approvable. Call-site
  integration evidence may reference Slices 3, 8, 9, 10, 11, and 12 after
  those contracts are characterized, but does not expand this slice's scope.
- Risks: adding snapshot data could accidentally capture personal or file data.
- Out of Scope: new events, SDK imports in application code, or collection policy
  changes.

## Traceability

- TRACEABILITY.md required: yes.
- Reason: this is a non-trivial multi-slice feature affecting user-visible
  behavior preservation, JP1/AJS compatibility, desktop/web boundaries, and
  later feature entry conditions.

## Cross-Slice Dependencies

- Slices 1 and 2 are independent first contracts. Slice 1 protects the
  normalized parser port; Slice 2 protects the domain schedule-rule helper.
- Slice 3 depends on Slices 1 and 2. Slice 4 depends on Slice 1. Slice 5
  depends on Slices 1 and 2. Slice 6 depends on Slices 1, 2, and 5.
- Slice 7 depends on Slice 4. Slice 8 uses Slice 4 graph identity and Slice 7
  rendered-state evidence, while retaining an independently testable state
  boundary. Slice 9 depends on Slices 5 and 6.
- Slice 11 is independent of Slice 10 and is ordered first when composition
  tests use the current concrete `ViewerFactory`. Slice 10 depends on Slices
  4, 6, 7, 9, and 11. Feature 2 remains separately evidence-gated.
- Slices 12 and 13 are presentation-local contracts. Their consumer checks may
  reference flow/table evidence, but they have no implementation dependency on
  Slices 7-9.
- Slice 14 is an independently approvable cross-layer telemetry contract.
  Workflow integration checks may consume completed evidence from Slices 3,
  8-12 without expanding the telemetry scope.
- Downstream Features 4-8 may start only after their relevant slices are
  complete and reviewed; Feature 9 remains last and evidence-gated.

## Feature-Level Risks

- Existing tests may assert implementation details instead of observable
  contracts; convert only the minimum necessary assertions to stable fixtures.
- Large or malformed definitions may make broad snapshots slow or misleading;
  use bounded representative cases with recorded counts/depths and explicit
  per-boundary failure assertions.
- Desktop and web paths can diverge despite shared TypeScript; every host-bound
  slice includes both-host validation.
- JP1/AJS vendor behavior not covered by the durable rules must be recorded as
  an explicit unresolved assumption, not silently generalized.
- Characterization fixtures can accidentally preserve prohibited telemetry or
  parser-internal data; review fixture contents and architecture boundaries.
- Qlty output is evidence for responsibility and regression risk, not a new
  threshold or approval to refactor.
- Target symbols and current failure alternatives must remain traceable to the
  baseline group; discovering a different owner or runtime contract requires
  Replanning Mode before implementation.

## Use-Case Back-Propagation

- No durable use-case behavior changes are planned. If characterization
  reveals an undocumented current contract that should survive feature-folder
  removal, update only the owning use case during Feature Exit.
- Architecture or privacy policy changes are out of scope; propagate only
  reusable decisions that pass the Durable Documentation Gate.
- The roadmap already records the sequential dependencies and needs no update
  for this initial plan.

## Feature Exit

- Definition of Done status: Not started; all slices are Proposed.
- Durable documentation updates: none currently required.
- Open risks: the risks above must be resolved, accepted, or assigned before
  closure.

## Validation

- [ ] Slice-specific tests added or updated after approval.
- [ ] Desktop and browser-hosted validation completed for affected boundaries.
- [ ] `V-Q` (`rtk pnpm run qlty`) recorded for every code slice, with new smells
      resolved or explicitly approved as follow-up.
- [ ] `V-D`, `V-W`, `V-DW`, and `V-B` evidence recorded wherever the slice
      validation above requires them.
- [ ] `rtk pnpm run lint:md` run after markdown changes.
- [ ] Traceability updated with implementation evidence.
- [ ] README/CHANGELOG impact evaluated; no update currently expected.

## Implementation Feedback

- Slice 1's boundary was appropriate: the new evidence fits the existing
  infrastructure adapter suite, while the listed application and consumer
  suites remain read-only compatibility evidence.
- A bounded 500-child flat definition was sufficient to record parser
  completion and normalized unit count without a broad snapshot. No new
  dependency, parser implementation issue, or desktop/web contract difference
  was discovered.
- Web smoke validation requires sandbox-external Chromium execution on this
  host; retain that as a validation prerequisite for later shared-boundary
  slices.
- Slice 2's boundary remained appropriate: helper parsing, schedule diagnostic
  range validation, and the unit-list projection can be characterized without
  changing runtime code or semantic-diff behavior.
- The helper boundary intentionally preserves explicit rule numbers and raw
  values, while v13 range validity remains owned by schedule diagnostics; the
  matrix tests record that distinction for later domain restructuring.
- Browser-hosted validation again required sandbox-external Chromium; no
  desktop/web contract difference or new dependency was discovered.
- Slice 3's boundary remained appropriate: application mapping assertions and
  existing rule-family suites provide the diagnostic contract without changing
  runtime orchestration or diagnostic meaning.
- A bounded 128-child valid definition plus missing-position fallback evidence
  was sufficient to cover large-input and source-span risks without broad
  snapshots or a new partial-result policy.
- Browser-hosted validation again required sandbox-external Chromium; no
  desktop/web contract difference or new dependency was discovered.
- Slice 4's boundary remained appropriate: flow graph DTO construction,
  document validation, and expanded-scope constraints were characterized
  without changing application or renderer implementation.
- The relation evidence confirms malformed relation targets and malformed
  relation containers are reported explicitly and never converted into
  plausible edges; valid relations remain available in the same graph result.
- A bounded 500-child scope plus the existing deep-nesting and visible-scope
  cases was sufficient to record complete deterministic output without a broad
  graph snapshot. No new dependency, JP1/AJS compatibility issue, or
  desktop/web contract difference was discovered.
- Browser-hosted validation again required sandbox-external Chromium; the
  existing teardown ECONNRESET/EPIPE logs did not affect the passing result.
- Slice 5's boundary remained appropriate: Group 13/17/18 projection cases,
  row metadata, and CSV identity can be characterized without changing list
  orchestration, visible columns, or CSV formatting.
- A bounded 128-child mixed list was sufficient to record type-gated fields,
  encoded values, stable identity/order, and repeated projection determinism.
  No runtime change, new dependency, JP1/AJS compatibility issue, or
  desktop/web contract difference was discovered.
- Browser-hosted validation again required sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/EPIPE logs but exited 0.
- Slice 6's boundary remained appropriate: root/row validation, projection
  identity, and consumer safe-state behavior were characterized in the named
  suites without changing list projection or presentation runtime code.
- A bounded 500-child serialized projection and host-decoded Shift_JIS rows
  were sufficient to exercise validator acceptance without broad snapshots.
  No new dependency, JP1/AJS compatibility issue, or desktop/web contract
  difference was discovered.
- Browser-hosted validation again required sandbox-external Chromium; the
  existing web test teardown emitted EPIPE/Premature close logs but exited 0.
- Slice 10's boundary remained appropriate: readiness source, pending reveal
  consumption, and counterpart lookup failure fit the existing viewer wiring
  suite without exporting new runtime seams or changing bootstrap composition.
- Desktop/browser host selection and viewer disposal remain covered by the
  existing extension dependency, lifecycle, bundle, and architecture suites;
  no host-specific contract difference or new dependency was discovered.
- The required production build check remains blocked by a pre-existing type
  error in `src/test/suite/accessibilityDom.test.tsx:182` (`UnitListRowView`
  has no `name` property). The error is outside Slice 10 and was not changed;
  it remains a follow-up before feature exit.

## Notes

- The 14 slices are deliberately boundary-sized, not file-sized. Each can be
  reviewed, validated, committed, and approved independently.
- This feature is the first branch in a continuous refactoring sequence. The
  sequence does not merge approval boundaries or authorize downstream feature
  implementation.
