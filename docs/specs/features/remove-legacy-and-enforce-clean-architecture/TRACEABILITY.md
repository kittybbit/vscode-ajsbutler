# Traceability: Remove Legacy And Enforce Clean Architecture

## Feature Requirements

| Requirement          | Spec           | Slice | Proof |
| -------------------- | -------------- | ----- | ----- |
| Superseded artifacts | Req; Accept    | 1     | F1    |
| Zero exceptions      | Req; Arch      | 2     | F2    |
| Complete rule gate   | Req; Accept    | 2     | F2    |
| Compatibility proof  | Compat; Accept | 3     | F3    |
| Verified policy      | Req; Accept    | 4     | F4    |

## Migration Predecessors

| Predecessor     | Boundary               | Spec         | Slice | Proof |
| --------------- | ---------------------- | ------------ | ----- | ----- |
| P1: inventory   | Owned baseline         | Req; Accept  | 2-3   | P1    |
| P2: parser      | Raw/parser isolation   | Arch; Compat | 2-3   | P2    |
| P3: domain      | One normalized model   | Arch; Compat | 2-3   | P3    |
| P4: unit info   | List/CSV/definition    | Compat       | 3     | P4    |
| P5: flow/nav    | Graph DTO/navigation   | Compat       | 3     | P5    |
| P6: diag/hover  | Host-neutral feedback  | Compat       | 3     | P6    |
| P7: WebAPI      | Port/adapter/root      | Compat       | 3     | P7    |
| P8: diff/report | Domain diff/report DTO | Compat       | 3     | P8    |
| P9: telemetry   | Port/privacy/SDK       | Compat       | 2-3   | P9    |
| P10: transport  | JSON/composition       | Arch; Compat | 2-3   | P10   |

## Durable Use Cases

| Use Case         | Requirement            | Spec   | Slice | Proof |
| ---------------- | ---------------------- | ------ | ----- | ----- |
| U1: list         | Stable list DTO        | Compat | 3     | U1    |
| U2: graph        | Host-neutral graph     | Compat | 3     | U2    |
| U3: explore      | Stable interaction     | Compat | 3     | U3    |
| U4: definition   | Shared definition DTO  | Compat | 3     | U4    |
| U5: CSV          | Plain ordered export   | Compat | 3     | U5    |
| U6: diagnostics  | Host-neutral results   | Compat | 3     | U6    |
| U7: hover        | Host-neutral results   | Compat | 3     | U7    |
| U8: navigation   | Stable identity        | Compat | 3     | U8    |
| U9: WebAPI       | Port and host fallback | Compat | 3     | U9    |
| U10: diff        | Domain and scalar DTOs | Compat | 3     | U10   |
| U11: diff report | Localized copy flow    | Compat | 3     | U11   |

## Planned Boundary Evidence

- U1: `createBuildUnitList` and `buildUnitListView` receive parsed
  `AjsDocument` results through `AjsParserPort`; table presentation consumes the
  unit-list document and row DTOs.
- U2: application `buildFlowGraphResult` and
  `buildExpandedFlowGraphResult` consume normalized flow documents; webview
  presentation alone maps graph DTOs to renderer geometry.
- U3: this presentation use case has no separate application port. The flow
  viewer consumes application graph DTOs while presentation-local modules own
  expansion, search, selection, focus, and viewport state.
- U4: `buildUnitDefinitionByPath` and `toUnitDefinitionByPath` consume
  normalized unit data and expose definition/command DTOs to the shared dialog
  used by table and flow presentation.
- U5: `exportUnitListCsv` consumes plain visible-row input; the table export
  adapter and VS Code message handler own presentation and file interaction.
- U6: `createBuildSyntaxDiagnostics` consumes `AjsParserPort` and domain-rule
  evidence; `registerDiagnostics` maps host-neutral results to VS Code.
- U7: `createFindParameterHover` consumes `ParameterSyntaxLookupPort`; the
  infrastructure resource adapter supplies syntax and `registerHoverProvider`
  maps the result to VS Code Markdown.
- U8: `resolveFlowNavigationTarget` consumes validated flow-graph DTO identity;
  viewer messages and VS Code panel routing coordinate table/flow reveal.
- U9: `createImportAjsDefinitionViaWebApi` consumes
  `ImportAjsDefinitionViaWebApiPort`; infrastructure owns SC-009 transport and
  credentials, bootstrap selects capability, and the command delegates.
- U10: `createBuildSemanticDiffReportData` consumes `AjsParserPort` and
  normalized documents, while domain/application comparison produces the
  scalar semantic-diff DTO used by presentation.
- U11: `executeCompareSemanticDiffCommand`, `renderSemanticDiffMarkdown`, and
  `SemanticDiffReportDocumentProvider` consume semantic-diff report data and own
  localization, display, and explicit copy behavior.

## Cross-Cutting Compatibility

| Requirement              | Spec              | Slice | Proof |
| ------------------------ | ----------------- | ----- | ----- |
| Parser compatibility     | Arch; Compat      | 2-3   | C1    |
| Telemetry compatibility  | Compat; Non-Goals | 3     | C2    |
| Host and VS Code minimum | Compat; Accept    | 3     | C3    |
| WebAPI beta ownership    | Impact; Compat    | 3-4   | C4    |

## Validation Plans

- Table abbreviations: Req = Requirements, Arch = Architecture,
  Compat = Compatibility, and Accept = Acceptance Criteria.
- F1 (passed 2026-07-26): zero-reference scans confirmed removal of the
  presentation-local `UnitEntityDialog`, `prevUnitEntityId`,
  `AjsRawUnit.createFromJSON`, its private recursive helper, and stale
  legacy-wrapper test wording. No superseded production compatibility adapter
  remained; compatibility-preserving `legacy*` telemetry identifiers were
  retained. Desktop tests, web smoke, production build, and qlty passed.
- F2 (passed 2026-07-26): the allowlist fixture, allowance ownership and
  validation APIs, and transitional three-rule subset have zero references.
  `architectureDependencyRules.test.ts` directly reports zero production
  violations across all twelve rule families, rejects every representative
  intentional violation, reports retired-wrapper reintroduction as forbidden,
  preserves composition-root pass/fail checks, and remains in the standard
  desktop test path. Desktop tests, Markdown lint, and qlty passed.
- F3: complete P1 through P10, U1 through U11, and C1 through C4; run
  `test:full`, build, qlty, Markdown lint, and diff checks.
- F4: cross-check every durable invariant against F2 and F3; run Markdown lint,
  qlty, diff, Agent Brief, and no-`CONTEXT.md` checks.
- P1 (`architecture-inventory-and-guardrails`): full rule-catalog source scan,
  intentional-violation fixtures, and zero production violations.
- P2 (`isolate-parser-boundary`): parser/raw rules, `AjsParserPort`,
  `AntlrAjsParser.test.ts`, and normalization suites.
- P3 (`complete-normalized-domain-model`): retired-wrapper rule,
  `AjsDocument.test.ts`, `AjsUnitState.test.ts`, and downstream use-case rows.
- P4 (`migrate-unit-information-boundaries`): U1, U4, U5, unit-information
  localization, and serialized unit-document tests.
- P5 (`migrate-flow-graph-and-navigation-boundaries`): U2, U3, U8, graph DTO,
  expanded-layout, and viewer-routing tests.
- P6 (`migrate-diagnostics-and-hover-boundaries`): U6, U7, diagnostic mapping,
  hover provider, and localization adapter tests.
- P7 (`complete-webapi-infrastructure-boundaries`): U9, WebAPI boundary/wiring,
  structured-error, credential, and host-capability tests.
- P8 (`migrate-semantic-diff-and-report-boundaries`): U10, U11, semantic DTO,
  report localization, display, and explicit-copy tests.
- P9 (`isolate-telemetry-adapter-boundary`): C2, telemetry port/catalog,
  privacy, adapter-failure, and SDK architecture-rule tests.
- P10 (`standardize-serialization-and-composition-root`): plain viewer message
  contracts, host resolution, bootstrap construction, lifecycle, desktop/web,
  and composition-root rule tests.
- U1 (`uc-view-unit-list`): `buildUnitList.test.ts`,
  `buildUnitListView.test.ts`, `unitListEncoding.test.ts`,
  `tableViewerData.test.ts`, and desktop/web runs.
- U2 (`uc-build-flow-graph`): `buildFlowGraph.test.ts`,
  `buildFlowGraphUseCase.test.ts`, and
  `buildExpandedFlowGraphUseCase.test.ts`.
- U3 (`uc-explore-flow-graph`): `nestedExpansion.test.ts`,
  `flowSearch.test.ts`, `flowViewportFocus.test.ts`, focused flow-view suites,
  and desktop/web runs.
- U4 (`uc-show-unit-definition`): `buildUnitDefinition.test.ts`,
  `unitDefinitionDocumentState.test.ts`, and
  `showUnitDefinitionInteraction.test.ts`.
- U5 (`uc-export-unit-list-csv`): `exportUnitListCsv.test.ts`,
  `exportCsvView.test.ts`, and `csvExportTelemetry.test.ts`.
- U6 (`uc-diagnose-ajs-definition`): `buildSyntaxDiagnostics.test.ts`,
  diagnostic-rule suites, `registerDiagnostics.test.ts`, and desktop/web runs.
- U7 (`uc-show-parameter-hover`): `findParameterHover.test.ts`,
  `registerHoverProvider.test.ts`, and `nls.test.ts`.
- U8 (`uc-navigate-between-unit-list-and-flow-graph`): `revealUnit.test.ts`,
  `tableNavigation.test.ts`, `viewerMessageRouting.test.ts`, and
  `viewerWiring.test.ts`.
- U9 (`uc-import-ajs-definition-via-webapi`):
  `importAjsDefinitionViaWebApi.test.ts`,
  `Jp1Ajs3WebApiImportAdapter.test.ts`, `webapiImportBoundary.test.ts`,
  `webapiImportWiring.test.ts`, and desktop/web runs.
- U10 (`uc-build-semantic-diff`): `compareSemanticDiff.test.ts` plus the
  semantic-diff contract, structural, condition, evidence, and schedule suites.
- U11 (`uc-present-semantic-diff-report`):
  `renderSemanticDiffMarkdown.test.ts`, `semanticDiffReportDocument.test.ts`,
  `semanticDiffCommand.test.ts`, and desktop/web runs.
- C1: architecture rules, parser/normalization suites, and representative
  malformed and encoding fixtures.
- C2: `telemetryEvent.test.ts`, `telemetryAdapter.test.ts`, telemetry workflow
  suites, and the architecture SDK rule.
- C3: `test:full`, build, `packageManifest.test.ts`, the host/Node architecture
  rules, and confirmation that `engines.vscode` remains `^1.75.0`.
- C4: cross-check the active `import-definition-via-webapi` tasks, plans, and
  roadmap without claiming unavailable live-environment evidence.

## Evidence Recording Rule

- During implementation, replace planned validation wording with concise pass
  evidence or a justified non-applicability decision.
- A failing or missing row makes the affected slice `Replan Required`; it may
  not be deferred merely to complete this migration.
- Feature Exit must confirm every row before recommending closure.
