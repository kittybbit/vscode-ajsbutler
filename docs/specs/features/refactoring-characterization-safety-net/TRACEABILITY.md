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
