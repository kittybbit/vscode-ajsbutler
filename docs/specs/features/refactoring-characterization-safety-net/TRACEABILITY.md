# Requirements Traceability: Refactoring Characterization Safety Net

<!-- markdownlint-disable MD013 -->

Validation keys are defined in `TASKS.md`: `V-Q` qlty, `V-D` desktop,
`V-W` browser-hosted, `V-DW` both hosts, and `V-B` production build. Each row
also names the concrete test files that prove the slice contract.

| Use case / requirement                                                                                             | SPECS.md section                                   | Implementation slice                                                           | Test or validation                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uc-view-unit-list.md`; `uc-build-flow-graph.md`; `uc-diagnose-ajs-definition.md`; R1, R3-R5                       | Requirements; Compatibility; AC2-AC5               | Slice 1: Normalized parser application-port characterization                   | `AntlrAjsParser.test.ts`, `normalizeAjsDocument.test.ts`, `buildSyntaxDiagnostics.test.ts`, `buildFlowGraphUseCase.test.ts`, `buildUnitList.test.ts`; valid, malformed, encoded, bounded-large fixtures; V-DW, V-B, V-Q                                                                                                                                                   |
| `interpret-jp1-parameters.md`; `jp1-diagnostic-parameter-rules.md`; R5                                             | Requirements; Compatibility; AC2-AC5               | Slice 2: JP1/AJS schedule-rule characterization                                | `scheduleRuleHelpers.test.ts`, `evaluateScheduleDiagnosticViolations.test.ts`, `buildSyntaxDiagnostics.test.ts`, `buildUnitList.test.ts`, `buildUnitListRemainingGroups.test.ts`; default/inherited/invalid/version-13 matrix; V-DW, V-Q                                                                                                                                  |
| `uc-diagnose-ajs-definition.md`; `jp1-diagnostic-parameter-rules.md`; R1, R3-R5                                    | Requirements; Acceptance Criteria; AC2-AC6         | Slice 3: Application syntax and semantic diagnostics characterization          | `buildSyntaxDiagnostics.test.ts`, `evaluateEventDiagnosticViolations.test.ts`, `evaluateJobEndDiagnosticViolations.test.ts`, `evaluateMonitoringWaitDiagnosticViolations.test.ts`, `evaluateScheduleDiagnosticViolations.test.ts`, `evaluateTransferDiagnosticViolations.test.ts`, `mapDiagnosticViolation.test.ts`, `syntaxDiagnosticEventRules.test.ts`; V-DW, V-B, V-Q |
| `uc-build-flow-graph.md`; R1, R3-R5                                                                                | Requirements; Compatibility; AC2-AC5               | Slice 4: Application flow-graph construction characterization                  | `buildFlowGraph.test.ts`, `buildFlowGraphUseCase.test.ts`, `flowGraphDocument.test.ts`, `buildExpandedFlowGraph.test.ts`, `buildExpandedFlowGraphUseCase.test.ts`; malformed relations and bounded deep nesting; V-DW, V-B, V-Q                                                                                                                                           |
| `uc-view-unit-list.md`; `uc-export-unit-list-csv.md`; R1, R3-R5                                                    | Requirements; Acceptance Criteria; AC2-AC5         | Slice 5: Unit-list group projection characterization                           | `buildUnitListRemainingGroups.test.ts`, `buildUnitList.test.ts`, `buildUnitListView.test.ts`, `exportUnitListCsv.test.ts`; group 13/17/18 and large/encoded row fixtures; V-DW, V-B, V-Q                                                                                                                                                                                  |
| `uc-view-unit-list.md`; `uc-export-unit-list-csv.md`; R1, R3-R5                                                    | Requirements; Acceptance Criteria; AC2-AC5         | Slice 6: Unit-list document validation and projection characterization         | `buildUnitList.test.ts`, `tableViewerData.test.ts`, `unitDefinitionDocumentState.test.ts`, `unitListEncoding.test.ts`; malformed root/row, identity mismatch, and bounded-large projection cases; V-DW, V-B, V-Q                                                                                                                                                          |
| `uc-build-flow-graph.md`; `uc-explore-flow-graph.md`; R1, R3-R4                                                    | Architecture; Compatibility; AC2-AC5               | Slice 7: Flow rendering and detail presentation characterization               | `flowGraphView.test.ts`, `flowNodeDetail.test.ts`, `flowNodeDetailPanelCollapse.test.ts`, `flowRelationshipFocus.test.ts`, `flowNodeDisplay.test.ts`, `flowHeader.test.ts`, `nodeSxProps.test.ts`, `flowAccessibility.test.ts`; V-DW, V-Q                                                                                                                                 |
| `uc-explore-flow-graph.md`; `uc-navigate-between-unit-list-and-flow-graph.md`; R1, R3-R4                           | Architecture; Compatibility; AC2-AC5               | Slice 8: Flow search and viewer interaction-state characterization             | `flowSearch.test.ts`, `flowSearchState.test.ts`, `flowKeyboardNavigation.test.ts`, `flowViewerShortcuts.test.ts`, `flowViewportFocus.test.ts`, `revealUnit.test.ts`; V-DW, V-Q                                                                                                                                                                                            |
| `uc-view-unit-list.md`; `uc-export-unit-list-csv.md`; `uc-navigate-between-unit-list-and-flow-graph.md`; R1, R3-R4 | Architecture; Compatibility; AC2-AC5               | Slice 9: Unit-list table presentation and keyboard navigation characterization | `ajsTableHeader.test.ts`, `tableColumnDef.test.ts`, `tableNavigation.test.ts`, `tableSearchState.test.ts`, `tableViewerData.test.ts`, `exportCsvView.test.ts`, `accessibilityDom.test.tsx`; V-DW, V-Q                                                                                                                                                                     |
| `architecture.md` composition boundary; `uc-navigate-between-unit-list-and-flow-graph.md`; R1, R4                  | Architecture; Impact Analysis; AC4-AC5             | Slice 10: Viewer composition wiring characterization                           | `viewerWiring.test.ts`, `viewerBundle.test.ts`, `extensionLifecycle.test.ts`, `extensionDependencies.test.ts`, `architectureDependencyRules.test.ts`; V-DW, V-B, V-Q                                                                                                                                                                                                      |
| `architecture.md` transport boundary; `uc-view-unit-list.md`; `uc-build-flow-graph.md`; R1, R4                     | Architecture; Compatibility; AC4-AC5               | Slice 11: VS Code viewer factory and plain transport characterization          | `viewerFactory.test.ts`, `viewerHostMessages.test.ts`, `viewerMessageRouting.test.ts`, `viewerRequestMessages.test.ts`, `reportWebviewOperation.test.ts`; V-DW, V-B, V-Q                                                                                                                                                                                                  |
| `uc-explore-flow-graph.md`; `uc-view-unit-list.md`; R1, R4                                                         | Architecture; Compatibility; AC2-AC5               | Slice 12: Shared webview header search characterization                        | `headerSearchField.test.ts`, `flowSearch.test.ts`, `tableSearchState.test.ts`, `accessibilityDom.test.tsx`; empty/long query and focus/shortcut cases; V-DW, V-Q                                                                                                                                                                                                          |
| `uc-explore-flow-graph.md`; `uc-navigate-between-unit-list-and-flow-graph.md`; R1, R4                              | Architecture; Compatibility; AC2-AC5               | Slice 13: Flow tree selector characterization                                  | `unitTreeSelector.test.ts`, `accessibilityDom.test.tsx`, `flowSelector.test.ts`, `flowKeyboardNavigation.test.ts`; disabled/deep-tree and keyboard cases; V-DW, V-Q                                                                                                                                                                                                       |
| `telemetry.md`; `architecture.md` telemetry boundary; R1, R4-R5                                                    | Requirements; Architecture; Compatibility; AC2-AC5 | Slice 14: Validated telemetry contract and event-builder characterization      | `telemetryBuckets.test.ts`, `telemetryEvent.test.ts`, `performanceTelemetry.test.ts`, `searchTelemetry.test.ts`, `viewerActionTelemetry.test.ts`, `viewerTelemetry.test.ts`, `telemetryAdapter.test.ts`, `createTelemetry.test.ts`; forbidden-input, bounded-bucket, no-op/failure, disposal, and browser-port cases; V-DW, V-B, V-Q                                      |
| Feature entry condition; R6; AC1 and AC7                                                                           | Requirements; Non-Goals; Feature Exit              | Feature-level approval and downstream entry gate                               | Revised `TASKS.md` slice boundaries/dependencies, this traceability table, qlty evidence, and Feature Exit propagation; no repository-wide threshold or downstream implementation approval                                                                                                                                                                                |

<!-- markdownlint-enable MD013 -->

## Slice 1 implementation evidence

- The application parser port remains a complete-result-or-owned-errors
  contract. The adapter test does not expose generated parser types or
  `AjsRawUnit` through the normalized document.
- `rtk pnpm run test:desktop:run`: passed after desktop build and test compile.
- `rtk pnpm run test:web:run`: passed after web build and test compile; the
  bundled Chromium required sandbox-external execution on this host.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run build`: passed as the production build evidence.

## Slice 2 implementation evidence

- `scheduleRuleHelpers.test.ts` characterizes omitted/default and explicit
  schedule-rule numbers, all `cftd` modes, mode-specific defaults, malformed
  shapes, and effective `wc`/`wt` pairs including `no`, `un`, and invalid input.
- `evaluateScheduleDiagnosticViolations.test.ts` and
  `buildSyntaxDiagnostics.test.ts` characterize the JP1/AJS3 version-13
  boundaries, including rule `144`, schedule-limit year `2036`, day/time/count
  maxima, all `cftd` modes, and just-outside malformed values.
- `buildUnitList.test.ts` verifies that raw schedule parameter values remain
  available while the effective group-10 projection retains current display
  values. `buildUnitListRemainingGroups.test.ts` remains passing as the
  read-only list projection regression evidence named by the slice plan.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/EPIPE logs but exited 0.
- `rtk pnpm run qlty`: passed with no issues.

## Slice 3 implementation evidence

- `buildSyntaxDiagnostics.test.ts` now records stable application-level rule
  IDs alongside category, severity, message, and source spans for a mixed
  parser/semantic result, and verifies that a bounded 128-child valid
  definition remains diagnostic-free.
- `mapDiagnosticViolation.test.ts` records the current line-1/column-0/key-
  length fallback when normalized parameter evidence omits source metadata.
- The existing event, job-end, monitoring/wait, schedule, transfer, and event
  rule suites remain the read-only semantic violation and allowed-form evidence
  named by this slice; no diagnostic rule IDs, messages, spans, or runtime
  behavior were changed.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/EPIPE logs but exited 0.
- `rtk pnpm run build`: passed with the existing webpack asset-size warnings.
- `rtk pnpm run qlty`: passed with no issues.

## Slice 4 implementation evidence

- `buildFlowGraphUseCase.test.ts` records stable node identity/order and the
  ancestor/current layout contract when a root jobnet is selected beneath a
  job group, and verifies that a missing relation target is reported without
  becoming a plausible edge.
- `flowGraphDocument.test.ts` records the malformed relation-container
  fallback: the graph remains available with no edges and an explicit
  `invalid_relation` issue.
- `buildExpandedFlowGraphUseCase.test.ts` retains the existing deterministic
  visible-scope, containment, affected-subtree, malformed-request, recovery,
  condition, and deep-nesting evidence, and adds a bounded 500-child scope
  completeness/determinism check. Renderer geometry remains outside this
  slice.
- The existing `buildFlowGraph.test.ts` and `buildExpandedFlowGraph.test.ts`
  suites remain read-only evidence for core DTO mapping and presentation
  realization; no renderer behavior or application implementation changed.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/EPIPE logs but exited 0.
- `rtk pnpm run build`: passed with the existing webpack asset-size warnings.
- `rtk pnpm run qlty`: passed with no issues.

## Slice 5 implementation evidence

- `buildUnitListRemainingGroups.test.ts` records Group 13 effective/raw values,
  Group 17 `cpj`/`rcpj` type gating, and Group 18 `fxj`/`rfxj` type gating,
  including encoded parameter values and non-custom/non-flexible fallbacks.
- `buildUnitList.test.ts` records a bounded 128-child mixed projection with
  stable row identity, ordering, metadata, encoded values, and repeated-result
  determinism. `buildUnitListView.test.ts` records row/unit metadata ordering
  and optional group-field absence for a regular job.
- `exportUnitListCsv.test.ts` records that projected unit identity and order
  reach CSV data rows. CSV escaping and visible-column formatting remain
  covered only by their existing tests and are outside this slice.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/EPIPE logs but exited 0.
- `rtk pnpm run build`: passed with the existing webpack asset-size warnings.
- `rtk pnpm run qlty`: passed with no issues.

## Slice 6 implementation evidence

- `buildUnitList.test.ts` records rejection of malformed root/row records and
  direct row identity mismatch, while the bounded 500-child serialized
  projection is accepted with complete row count and ordering.
- `tableViewerData.test.ts` records that a malformed serialized row produces
  an empty safe viewer state. `unitDefinitionDocumentState.test.ts` records
  that an identity-mismatched list fails closed while the flow state remains
  available.
- `unitListEncoding.test.ts` records that UTF-8 and Shift_JIS definitions
  remain equivalent after the decoded projection passes list-document
  validation.
- No runtime, generated-parser, configuration, or architecture dependency
  changed; CSV meaning and user-visible behavior remain outside this slice.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted EPIPE/Premature close logs but exited 0.
- `rtk pnpm run build`: passed with the existing webpack asset-size warnings.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run lint:md`: passed.

## Slice 7 implementation evidence

- `flowGraphView.test.ts` records application DTO identity, node ordering and
  positions for a bounded 128-node graph, unchanged/conditional edge markers,
  semantic-diff stroke and width, and deterministic repeated projection.
- `flowNodeDetail.test.ts` records lightweight detail output, missing
  comment/parent fallbacks, Japanese detail labels, focus-mode action labels,
  and action callback retention. Existing expectations now include the current
  definition-availability flag.
- `flowRelationshipFocus.test.ts` records relationship role decoration while
  preserving synthetic nested-panel opacity and unrelated-node state.
  `flowHeader.test.ts`, `flowNodeDisplay.test.ts`,
  `flowNodeDetailPanelCollapse.test.ts`, `nodeSxProps.test.ts`, and
  `flowAccessibility.test.ts` retain the header, node-state, responsive-panel,
  visual-priority, nested-bound, and accessibility evidence named by the slice.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Graph DTO meaning, JP1/AJS definition compatibility, and
  user-visible behavior remain unchanged.
- The slice boundary remained appropriate: semantic invariants were added
  without brittle full geometry snapshots or broad renderer refactoring. The
  focused Mocha suite is useful alongside host smoke checks for detecting stale
  presentation expectations.
- `rtk pnpm run test:prepare:desktop`: passed.
- Focused flow presentation suite: 36 tests passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/EPIPE logs but exited 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run lint:md`: passed.

## Slice 8 implementation evidence

- `flowSearch.test.ts` records current-scope matching, collapsed-ancestor
  expansion, and deterministic order for a bounded 2,048-result fixture.
  `flowSearchState.test.ts` records cyclic next/previous navigation across the
  same result bound and safe recovery when the searched unit is stale.
- `flowKeyboardNavigation.test.ts` retains Enter/Escape scope transitions,
  modifier handling, rendered-node focus restoration, stale-node graph-entry
  fallback, and a bounded 10,000-node navigation case. `flowViewerShortcuts.test.ts`
  retains case-insensitive detail/selector shortcuts and modifier rejection.
- `flowViewportFocus.test.ts` records search-over-selection priority,
  zoom-preserving center actions, pending-render waits, stale-target fail-safe
  behavior, layout fallback, and keyboard-expansion viewport preservation.
  `revealUnit.test.ts` retains stable scope selection, collapsed ancestor
  reveal, malformed/cyclic fallback, and bounded deep-hierarchy behavior.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Flow scope identity, keyboard bindings, viewport meaning,
  and desktop/web user-visible behavior remain unchanged.
- The slice boundary remained appropriate: deterministic state and fallback
  evidence was added without exposing private hooks or introducing a shared
  search contract. No additional durable documentation or CHANGELOG update is
  required.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted EPIPE/ECONNRESET/Premature close logs but
  exited 0.
- `rtk pnpm run qlty`: passed with no issues.

## Slice 9 implementation evidence

- `tableColumnDef.test.ts` records the utility column and all 20 JP1/AJS
  column groups in stable order, while retaining localized labels, nested
  schedule-column order, and primitive accessor output checks.
- `tableNavigation.test.ts` records stable entry/restoration focus, bounded
  10,000-row paging, header/cell boundary clamping, grid shortcuts, sticky
  column reveal, row selection, detail focus requests, and flow counterpart
  navigation. `tableSearchState.test.ts` records current row order, hidden
  parameter/path matches, a bounded 2,048-row result set, wrapping, and empty
  result safety.
- `tableViewerData.test.ts` records a bounded 500-child viewer projection with
  complete row/unit identity and retains malformed-row fail-closed behavior.
  `exportCsvView.test.ts` records visible-column order and multi-row CSV output
  for copy/save interactions. `ajsTableHeader.test.ts` retains header sorting,
  display-column visibility, search helper, and non-color focus cues.
- `accessibilityDom.test.tsx` records a 128-row virtualized grid's ARIA row/
  column counts, roving cell focus, keyboard movement, grouped display-column
  expansion, and leaf visibility updates. Existing detail-pane accessibility
  checks remain in the same suite.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Unit identity, visible-column semantics, search behavior,
  CSV meaning, keyboard behavior, and desktop/web user-visible behavior remain
  unchanged.
- The slice boundary remained appropriate: behavior-level assertions and a
  bounded DOM fixture characterize private table presentation paths without
  exporting test seams or refactoring the webview implementation. No durable
  documentation or CHANGELOG update is required.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/Premature close logs but
  exited 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run lint:md`: passed.

## Slice 10 implementation evidence

- `viewerWiring.test.ts` records command-versus-navigation readiness source,
  one-time pending-reveal consumption, immediate counterpart reveal, latest
  pending-path replacement, unavailable target fallback, and safe fallback
  when existing-panel lookup or panel creation fails.
- `viewerBundle.test.ts`, `extensionLifecycle.test.ts`,
  `extensionDependencies.test.ts`, and `architectureDependencyRules.test.ts`
  retain viewer bundle selection, activation/disposal, desktop/browser
  capability selection, and zero architecture violations as read-only
  compatibility evidence.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Viewer lifecycle, counterpart identity, telemetry meaning,
  JP1/AJS behavior, and desktop/web user-visible behavior remain unchanged.
- `rtk pnpm run test:full`: passed; browser-hosted Chromium required
  sandbox-external execution and emitted the existing EPIPE/Premature close
  teardown logs before exiting 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run build`: attempted for `V-B` but remains blocked by the
  pre-existing `src/test/suite/accessibilityDom.test.tsx:182` type error
  (`UnitListRowView` has no `name` property); this file is unchanged by Slice
  10 and the issue is recorded as a follow-up before feature exit.
- `rtk pnpm run lint:md`: passed after this traceability update.

## Slice 11 implementation evidence

- `viewerFactory.test.ts` records filename-equivalent and URI-fallback titles,
  existing-panel reuse, new-panel creation, standard message customization,
  readiness, navigation, save, and disposal behavior.
- `viewerHostMessages.test.ts` records every host-message builder and parser,
  explicit null handling, malformed-envelope rejection, and a bounded
  500-child document payload that remains plain JSON through serialization and
  parsing without losing root, row, or unit counts.
- `viewerMessageRouting.test.ts` and `viewerRequestMessages.test.ts` retain
  request routing, invalid-save diagnostics, disposal cleanup, request
  round-trips, optional telemetry-field omission, and malformed-input
  rejection. `reportWebviewOperation.test.ts` remains read-only evidence for
  the existing operation bridge; telemetry event meaning is owned by Slice 14.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Panel lifecycle, plain DTO transport, JP1/AJS behavior,
  and desktop/web user-visible behavior remain unchanged.
- The slice boundary remained appropriate: the large-payload assertion fits
  the host-message contract without exporting test seams or changing the
  viewer factory implementation. No durable documentation or CHANGELOG update
  is required.
- `rtk pnpm run test:full`: passed; browser-hosted Chromium required
  sandbox-external execution and emitted the existing EPIPE/Premature close
  teardown logs before exiting 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run build`: attempted for `V-B` but remains blocked by the
  pre-existing `src/test/suite/accessibilityDom.test.tsx:182` type error
  (`UnitListRowView` has no `name` property); that file is unchanged by Slice
  11 and the issue remains a follow-up before feature exit.

## Slice 12 implementation evidence

- `headerSearchField.test.ts` records platform shortcut matching, helper-text
  precedence for idle/matched/no-result states, and placeholder formatting.
  `accessibilityDom.test.tsx` characterizes the shared control through its DOM
  for localized helper/navigation labels, result counts, bounded long query
  input, Enter/Shift+Enter navigation, blur submission, clear-and-refocus, and
  document-level search shortcut focus.
- `flowSearch.test.ts` and `tableSearchState.test.ts` retain blank-query and
  bounded long-query behavior, deterministic matching/order, result positions,
  and empty-result navigation safety for the two existing consumers.
- No runtime, generated-parser, configuration, dependency, telemetry, or
  architecture boundary changed. Search matching semantics, localization,
  focus behavior, JP1/AJS behavior, and desktop/browser user-visible behavior
  remain unchanged.
- The slice boundary remained appropriate: the shared control is observed
  through its existing callbacks and DOM without exporting hook test seams or
  defining a shared search domain contract. No durable documentation or
  CHANGELOG update is required.
- `rtk pnpm run test:full`: passed; browser-hosted Chromium required
  sandbox-external execution and emitted the existing EPIPE/ECONNRESET/
  Premature close teardown logs before exiting 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run lint:md`: passed after this traceability update.

## Slice 13 implementation evidence

- `unitTreeSelector.test.ts` records enabled/disabled row navigation, Enter/
  Space/Alt+Enter action resolution, and a bounded 512-level expanded tree's
  visible order and focus targets.
- `accessibilityDom.test.tsx` records disabled-row ARIA state and selection
  suppression, focus-request reveal of a nested row, scope-open and Escape
  callbacks, and a bounded 128-level rendered tree with one active row.
  `flowSelector.test.ts` and `flowKeyboardNavigation.test.ts` remain
  read-only evidence for flow-scope identity, ancestor selection, and keyboard
  focus transitions consumed by the selector integration.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Unit identity, scope selection, reveal behavior, keyboard
  semantics, focus management, JP1/AJS behavior, and desktop/browser
  user-visible behavior remain unchanged.
- The slice boundary remained appropriate: selector behavior is characterized
  through existing navigation results and DOM callbacks without exporting test
  seams or changing flow scope resolution, layout, unit identity, or
  counterpart opening semantics. No durable documentation or CHANGELOG update
  is required.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted ECONNRESET/Premature close logs but
  exited 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run lint:md`: passed after this traceability update.

## Slice 14 implementation evidence

- `telemetryEvent.test.ts` records the complete 47-event name catalog and the
  complete forbidden content/path/identifier/error property set. Existing
  allowlisted payload filtering remains immutable and string-normalized.
- `telemetryBuckets.test.ts` records duration/count/HTTP boundary behavior,
  invalid numeric fallbacks, fractional count flooring, and the accepted
  duration/count vocabulary.
- `performanceTelemetry.test.ts`, `searchTelemetry.test.ts`,
  `viewerActionTelemetry.test.ts`, and `viewerTelemetry.test.ts` record every
  supported builder mapping, stable payload meaning, failure/cancelled results,
  legacy viewer events, and unknown-viewer fallbacks. The existing
  `telemetryAdapter.test.ts` and `createTelemetry.test.ts` remain read-only
  evidence for report/initialization/disposal failure isolation, no-op fallback,
  and the browser telemetry port contract.
- No runtime, generated-parser, configuration, dependency, or architecture
  boundary changed. Telemetry privacy, event meaning, JP1/AJS behavior, and
  desktop/browser user-visible behavior remain unchanged.
- The slice boundary remained appropriate: complete catalog and builder
  characterization was added without importing the SDK into application code,
  changing collection policy, or adding test-only runtime seams. No durable
  documentation or CHANGELOG update is required.
- `rtk pnpm run test:prepare:desktop`: passed.
- `rtk pnpm run test:desktop:run`: passed.
- `rtk pnpm run test:prepare:web`: passed.
- `rtk pnpm run test:web:run`: passed with sandbox-external Chromium; the
  existing web test teardown emitted EPIPE/ECONNRESET/Premature close logs but
  exited 0.
- `rtk pnpm run qlty`: passed with no issues.
- `rtk pnpm run build`: remains blocked by the pre-existing
  `src/test/suite/accessibilityDom.test.tsx` type errors (`UnitListRowView.name`
  and `HTMLElement.disabled`); no build-production source or that test was
  changed by Slice 14.
