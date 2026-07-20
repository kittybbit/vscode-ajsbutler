# Traceability: Architecture Inventory And Guardrails

## Requirement And Slice Mapping

| Scope                | Req    | Spec           | Slice | Test or validation |
| -------------------- | ------ | -------------- | ----- | ------------------ |
| Import collector     | R1/R4  | Requirements   | S1    | Passed             |
| Current rules        | R4     | Requirements   | S1    | Passed             |
| Dependency inventory | R1/R2  | Requirements   | S2    | Passed             |
| Use-case inventory   | R3/AC1 | Req/Acceptance | S2    | Passed             |
| Rule catalog         | R4/AC2 | Req/Acceptance | S3    | Passed             |
| Temporary entries    | R5/AC3 | Req/Acceptance | S3    | Passed             |
| Host coverage        | AC1    | Compatibility  | S2/S3 | Map/smoke passed   |

Slice 1 evidence:

- `src/test/support/architectureDependencyRules.ts` collects and normalizes all
  planned TypeScript dependency forms and production roots.
- `src/test/suite/architectureDependencyRules.test.ts` proves syntax coverage,
  alias/relative resolution, deterministic root collection, intentional current
  rule violations, and preservation of the existing production rules.
- `rtk pnpm test`, `rtk pnpm run test:compile`, and `rtk pnpm run qlty` passed.

Slice 2 evidence:

- The compiled Slice 1 collector returned 1,152 production dependency
  references. Category totals below overlap and therefore are not additive.
- Targeted checks reconciled 11 raw `Unit`, 86 wrapper, 9 generated-parser or
  ANTLR, 295 host/framework, 57 presentation-to-domain, 41 bootstrap
  cross-layer composition, 62 total bootstrap-owned, and 9 neutral
  entry/resource/shared references.
- The explicit forbidden-direction query returned zero references.
- The eleven durable use cases and their cited regression tests were reviewed.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `git diff --check` passed.

## Inventory Method And Classification

Counts are reproducible after `rtk pnpm run test:compile` by loading
`out/test/support/architectureDependencyRules.js`, calling
`collectProductionImportReferences(process.cwd())`, and filtering the normalized
`file`, `specifier`, `resolvedPath`, and `kind` fields. Targeted `rtk rg` checks
cover raw/wrapper symbols, generated/parser imports, external packages, layer
roots, bootstrap construction, `extension.ts`, `shared`, and `resource`.

Classification terms used below:

- **Legitimate**: the dependency is owned by an allowed adapter, composition,
  presentation, domain-internal, or neutral boundary. The named owner retains
  or reconfirms it.
- **Migration**: the dependency is currently supported but must be removed or
  replaced to reach the target architecture. It receives exactly one owner.
- **Compatibility risk**: the dependency is at an outer boundary but its
  desktop/web treatment must be made explicit by the named owner.

## Raw Unit Inventory

All 11 references target `src/domain/values/Unit.ts` and are owned by
`isolate-parser-boundary`. Five are **migration** findings. Removal means raw
`Unit` no longer crosses the application port/use-case boundary or supports
legacy helpers outside the parser/normalizer seam:

- `src/application/parsing/AjsParserPort.ts` (`import type`).
- `src/application/unit-list/buildUnitList.ts` (`import`).
- `src/domain/models/units/UnitEntity.ts` (`import`).
- `src/domain/utils/TyUtils.ts` (`import`).
- `src/domain/values/unitParameterLookupHelpers.ts` (`import`).

Six are **legitimate** parser/normalizer implementation dependencies and are
retained while they remain confined to that seam:

- `src/domain/models/ajs/normalize/relations.ts` (`import`).
- `src/domain/models/ajs/normalize/unit.ts` (`import`).
- `src/domain/models/ajs/normalize/unitBuilder.ts` (`import`).
- `src/domain/models/ajs/normalize/unitTree.ts` (`import`).
- `src/domain/models/ajs/normalizeAjsDocument.ts` (`import`).
- `src/infrastructure/parser/AjsEvaluator.ts` (`import`).

Slice 3 validates all exact source/target pairs, allowlists only the five
migration findings, and rejects raw references outside the retained seam.

## Wrapper Inventory

All 86 references are domain-internal and none occur in application or
presentation. They are a transitional **migration** category owned by
`complete-normalized-domain-model`. Removal means shared JP1/AJS meaning is
represented by the normalized model and remaining wrapper helpers are either
explicitly retained as domain implementation details or removed. Slice 3
validates the exact current set and rejects new outward wrapper dependencies.

The following grouped ledger enumerates every source. Parentheses contain every
imported wrapper target; repeated targets indicate distinct import forms.

- `src/domain/models/ajs/normalize/unit.ts`
  (`unitGroupStateHelpers`, `unitJobnetStateHelpers`, `unitLayoutHelpers`,
  `unitLayoutHelpers` type import, `unitScheduleStateHelpers`,
  `unitWaitStateHelpers`).
- `src/domain/models/ajs/normalize/unitBuilder.ts`
  (`unitDepthHelpers`, `unitTypeHelpers`).
- `src/domain/models/units/parameters/optionalArrayParameterBuilders.ts`
  (`UnitEntity`).
- `src/domain/models/units/parameters/optionalScalarParameterBuilders.ts`
  (`N`, `UnitEntity`).
- `src/domain/models/units/parameters/Parameter.ts` (`UnitEntity`).
- `src/domain/models/units/parameters/parameter.types.d.ts` (`UnitEntity`).
- `src/domain/models/units/parameters/requiredScalarParameterBuilders.ts`
  (`UnitEntity`).
- `src/domain/models/units/parameters/ruleParameterBuilders.ts`
  (`N`, `UnitEntity`).
- `src/domain/models/units/parameters/transferOperationParameterBuilders.ts`
  (`Cj`, `J`).
- Each of `Cj`, `Cmsj`, `Cpj`, `Evsj`, `Evwj`, `Flwj`, `Fxj`, `Htpj`, `J`,
  `Lfwj`, `Mlsj`, `Mlwj`, `Mqsj`, `Mqwj`, `Mssj`, `Mswj`, `Nc`, `Ntwj`,
  `Pwlj`, `Pwrj`, `Qj`, and `Tmwj` imports `unitCapabilityEntities` in its
  same-named file under `src/domain/models/units/`.
- `src/domain/models/units/G.ts`
  (`UnitEntity`, `unitGroupStateHelpers`).
- Each of `Jdj`, `Mg`, `Orj`, and `Rc` imports `UnitEntity` in its same-named
  file under `src/domain/models/units/`.
- `src/domain/models/units/N.ts`
  (`unitCapabilityEntities`, `unitJobnetStateHelpers`,
  `unitScheduleStateHelpers`).
- `src/domain/models/units/unitCapabilityEntities.ts`
  (`UnitEntity`, `unitPriorityHelpers`, `unitWaitStateHelpers`).
- `src/domain/models/units/UnitEntity.ts`
  (`unitDepthHelpers`, `unitTypeHelpers`).
- `src/domain/models/units/unitPriorityHelpers.ts`
  (`N` type import, `UnitEntity` type import).
- `src/domain/models/units/unitRelationHelpers.ts` (`UnitEntity` type import).
- `src/domain/utils/TyUtils.ts` imports `Cj`, `Cmsj`, `Cpj`, `Evsj`, `Evwj`,
  `Flwj`, `Fxj`, `G`, `Htpj`, `J`, `Jdj`, `Lfwj`, `Mg`, `Mlsj`, `Mlwj`,
  `Mqsj`, `Mqwj`, `Mssj`, `Mswj`, `N`, `Nc`, `Ntwj`, `Orj`, `Pwlj`, `Pwrj`,
  `Qj`, `Rc`, `Tmwj`, and `UnitEntity`.

## Generated Parser And ANTLR Inventory

All nine references are **legitimate** infrastructure ownership and are
retained behind the parser adapter. `isolate-parser-boundary` owns validation
that no generated or ANTLR dependency moves outward.

- `src/infrastructure/parser/AjsEvaluator.ts` imports generated `AjsParser` and
  `AjsParserListener`.
- `src/infrastructure/parser/AntlrAjsParser.ts` imports generated `AjsLexer` and
  `AjsParser`, plus `CharStreams`, `CommonTokenStream`, and `ParseTreeWalker`
  from `antlr4ts`.
- `src/infrastructure/parser/SyntaxErrorListener.ts` imports
  `ANTLRErrorListener` and `Recognizer` from `antlr4ts`.

## Host, Framework, SDK, And Outer-Layer Inventory

The family predicate and exact source ledger below account for all 295
host/framework references. Slice 3 reuses these predicates and exact normalized
references, so an unlisted source fails instead of joining a wildcard exception.

- `antlr4ts`: 5, only the three infrastructure parser files listed above;
  **legitimate**, retained by `isolate-parser-boundary`.
- `@vscode/extension-telemetry`: 1, only
  `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`; **legitimate** SDK
  adapter ownership, retained and isolated by
  `isolate-telemetry-adapter-boundary`.
- `vscode`: 25. Eight are under `src/bootstrap/extension/`, one is
  `src/extension.ts`, one is
  `src/infrastructure/webapi/VscodeWebApiCredentialStore.ts`, and 15 are under
  `src/presentation/vscode/`; **legitimate** host ownership. The WebAPI adapter
  is retained by `complete-webapi-infrastructure-boundaries`; bootstrap and
  presentation placement is reconfirmed by
  `standardize-serialization-and-composition-root`.
- `os`: 1 in `src/presentation/vscode/webview/messageHandlers.ts`; and `path`:
  1 in `src/presentation/vscode/webview/ViewerFactory.ts`. These are
  **compatibility risks** owned by
  `standardize-serialization-and-composition-root`; removal or retention
  requires an explicit browser-safe host-adapter decision and web smoke.
- `react` and `react-virtuoso`: 49, only
  `src/presentation/webview/editor/**`; **legitimate** presentation ownership
  and retained.
- `@mui/**`: 161, only `src/presentation/webview/editor/**`; **legitimate**
  presentation ownership and retained.
- `@xyflow/**`: 14, only flow files under
  `src/presentation/webview/editor/ajsFlow/**`; **legitimate** presentation
  ownership and retained.
- `@tanstack/**`: 36, only table files under
  `src/presentation/webview/editor/ajsTable/**`; **legitimate** presentation
  ownership and retained.
- `classnames`: 2, only `JobGroupNode.tsx` and `JobNetNode.tsx` under the flow
  presentation; **legitimate** presentation ownership and retained.

No domain or application source imports VS Code, Node built-ins, the telemetry
SDK, React, MUI, XyFlow, TanStack, `classnames`, or ANTLR/generated code.

The explicit layer-direction query found zero domain-to-outer,
application-to-infrastructure/presentation/bootstrap,
infrastructure-to-presentation/bootstrap, or
presentation-to-infrastructure imports. It also found zero concrete
infrastructure imports outside bootstrap or infrastructure.

Bootstrap owns 62 **legitimate** references across ten files: 41 cross-layer
composition imports, 12 bootstrap-internal imports, eight `vscode` imports, and
one shared-contract import.

- `activateExtension.ts` owns the activation entry and assembles the bootstrap
  lifecycle.
- `createTelemetry.ts` composes `TelemetryPort` with `NoopTelemetryAdapter` or
  `VscodeTelemetryAdapter`.
- `extensionDependencies.ts` composes parser, WebAPI, telemetry, unit-list, and
  presentation dependencies.
- `extensionLifecycle.ts`, `extensionRuntime.ts`,
  `extensionSubscriptions.ts`, and `MyExtension.ts` own runtime lifecycle and
  subscriptions.
- `semanticDiffWiring.ts`, `viewerWiring.ts`, and `webapiImportWiring.ts` own
  their vertical composition.

`standardize-serialization-and-composition-root` retains these imports while
validating that concrete construction remains at the composition boundary.

## Neutral Shared, Resource, And Entry Inventory

All nine references are **legitimate** and retained:

- `src/extension.ts` imports `vscode` and bootstrap `activateExtension` as the
  desktop/web extension entry.
- The `resource/i18n` barrels contain six locale re-exports: English and
  Japanese resources for columns, messages, and parameters.
- `src/shared/webviewEvents.ts` imports the neutral `MyAppResource` type.

`standardize-serialization-and-composition-root` reconfirms that shared events
remain plain transport contracts and that resource imports do not acquire host
or parser dependencies.

## Presentation-To-Domain Migration Inventory

The collector found 57 direct domain imports in presentation. None targets raw
`Unit`, `UnitEntity`, or a unit wrapper. They instead expose normalized model,
type, parameter, or localization responsibilities across the application DTO
boundary and are therefore **migration** findings.

`migrate-flow-graph-and-navigation-boundaries` owns these flow/navigation
sources under `src/presentation/webview/editor/`:

- `ajsFlow/buildExpandedFlowGraph.ts`,
  `expandedFlowGraphGrowthOffsets.ts`, `expandedFlowGraphLayout.ts`,
  `expandedFlowGraphNodes.ts`, `expandedFlowGraphPanelIntrusion.ts`,
  `expandedFlowGraphReveal.ts`, `expandedFlowGraphTypes.ts`,
  `flowGraphView.ts`, `flowNodeDetail.ts`, `FlowNodeDetailPanel.tsx`,
  `flowSearch.ts`, `FlowSelector.tsx`, `flowTreeSelection.ts`, `Header.tsx`,
  `nestedExpansion.ts`, `nodes/AjsNode.tsx`, `useFlowGraphState.ts`,
  `useFlowSearchState.ts`, `useFlowViewerController.ts`,
  `useFlowViewerEffects.ts`, and `useNestedExpansionState.ts`.
- `shared/unitTreeSelection.ts` and `shared/UnitTreeSelector.tsx`.

`migrate-unit-information-boundaries` owns these table/definition sources:

- `ajsTable/columnDefs/common.tsx`, `group1.tsx`, `group3.tsx`, `group4.ts`,
  `group5.tsx`, `group6.tsx`, `group7.tsx`, `group8.ts`, `group9.ts`,
  `group11.tsx` through `group20.tsx`, `DisplayColumnSelector.tsx`,
  `exportCsvView.ts`, `globalFilter.ts`, `Header.tsx`, `navigation.ts`,
  `tableColumnDef.tsx`, `TableContents.tsx`, `tableViewerData.ts`, and
  `UnitListDetailPanel.tsx`.
- `UnitEntityDialog.tsx`.

Removal means presentation consumes application DTOs/view models and
presentation-owned localization or formatting contracts rather than domain
objects directly. Slice 3 records exact source/target/rule entries; each owner
validates its paths with existing flow, navigation, list, definition, and CSV
tests.

## Eleven Use-Case Boundary Map

### T1: Import JP1/AJS Definition Via WebAPI

- Application boundary: `ImportAjsDefinitionViaWebApiPort` and
  `buildDefinitionOnlyUnitListRequest` in
  `src/application/webapi-import/importAjsDefinitionViaWebApi.ts`.
- Input/output: host-neutral request and imported definition DTOs; no raw or
  wrapper dependency.
- Adapter/presentation: `Jp1Ajs3WebApiImportAdapter` and
  `VscodeWebApiCredentialStore` are constructed in bootstrap and invoked by
  `importAjsDefinitionViaWebApiCommand.ts`.
- Hosts/risk: desktop performs the import; web reports the existing unsupported
  host result. Real JP1/AJS3 environment smoke remains pending in its beta
  feature.
- Owner/validation: `complete-webapi-infrastructure-boundaries`;
  `importAjsDefinitionViaWebApi.test.ts` plus adapter, boundary, command, and
  host tests.

### T2: View Unit List

- Application boundary: `createBuildUnitList` and `BuildUnitListResult` in
  `src/application/unit-list/buildUnitList.ts`.
- Input/output: definition text becomes `UnitListDocumentDto` or syntax errors.
  The parser port/raw `Unit` intermediary is the T2 raw-boundary finding.
- Adapter/presentation: `AntlrAjsParser` is injected by bootstrap; table
  presentation consumes the DTO but retains the direct-domain findings above.
- Hosts/risk: the same host-neutral use case feeds desktop and web viewers;
  malformed and large input behavior remains covered by parser/list tests.
- Owner/validation: `migrate-unit-information-boundaries` for the use-case and
  presentation boundary; raw parser ownership stays with
  `isolate-parser-boundary`; `buildUnitList.test.ts` and unit-list view tests.

### T3: Build Flow Graph

- Application boundary: `buildFlowGraph` in
  `src/application/flow-graph/buildFlowGraph.ts`.
- Input/output: normalized `AjsDocument`, selection, and highlights become a
  host-neutral `FlowGraphDto`; no raw or wrapper dependency.
- Adapter/presentation: flow presentation invokes the use case but also retains
  the direct normalized-model imports listed above.
- Hosts/risk: DTO transport is shared by desktop and web; large nested graphs
  retain the existing layout and expansion test coverage.
- Owner/validation: `migrate-flow-graph-and-navigation-boundaries`;
  `buildFlowGraph.test.ts`, `buildFlowGraphUseCase.test.ts`, and flow view tests.

### T4: Explore Flow Graph

- Application boundary: no single exploration use case currently exists.
  Presentation controllers combine `buildFlowGraph`, normalized documents,
  XyFlow state, expansion, focus, search, and selection.
- Input/output: domain model plus UI state becomes presentation-local graph
  state; no raw or wrapper dependency.
- Adapter/presentation: browser presentation owns interaction; VS Code viewer
  routing transports events.
- Hosts/risk: shared webview behavior runs in both extension hosts; deep/large
  graph interaction remains an existing performance risk, not changed here.
- Owner/validation: `migrate-flow-graph-and-navigation-boundaries`; flow view,
  expansion, focus, search, and selection tests.

### T5: Show Unit Definition

- Application boundary: `buildUnitDefinition` and
  `buildUnitDefinitionByPath` in
  `src/application/unit-definition/buildUnitDefinition.ts`.
- Input/output: normalized unit/document input becomes
  `UnitDefinitionDialogDto`; no raw or wrapper dependency.
- Adapter/presentation: table and flow detail components consume the DTO but
  their model/localization imports remain migration findings.
- Hosts/risk: host-neutral construction is shared by desktop and web viewers;
  missing paths retain the current undefined/fallback behavior.
- Owner/validation: `migrate-unit-information-boundaries`;
  `buildUnitDefinition.test.ts` and unit-definition interaction tests.

### T6: Export Unit List CSV

- Application boundary: `buildExportUnitListCsvInput`, `exportUnitListCsv`, and
  `exportUnitListCsvRows` under `src/application/unit-list/`.
- Input/output: application row/column input becomes CSV rows or text; no raw
  or wrapper dependency.
- Adapter/presentation: table presentation selects visible columns and invokes
  the exporter; `exportCsvView.ts` directly imports domain `Parameter`.
- Hosts/risk: browser-created CSV content is shared across hosts; escaping,
  column order, and large row sets retain existing tests.
- Owner/validation: `migrate-unit-information-boundaries`;
  `exportUnitListCsv.test.ts` and `exportCsvView.test.ts`.

### T7: Diagnose AJS

- Application boundary: `createBuildSyntaxDiagnostics` in
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`.
- Input/output: definition text and options become `SyntaxDiagnosticDto[]`.
  Raw `Unit` remains internal to the injected parser/normalizer path.
- Adapter/presentation: bootstrap injects `AntlrAjsParser`;
  `registerDiagnostics.ts` maps DTOs to VS Code diagnostics.
- Hosts/risk: VS Code presentation owns host APIs; malformed definitions are
  the primary expected input and retain current diagnostic fallback behavior.
- Owner/validation: `migrate-diagnostics-and-hover-boundaries`, with the raw
  parser seam owned by `isolate-parser-boundary`;
  `buildSyntaxDiagnostics.test.ts` and VS Code adapter tests.

### T8: Find Parameter Hover

- Application boundary: `findParameterHover` in
  `src/application/editor-feedback/findParameterHover.ts`.
- Input/output: word/language input becomes `ParameterHoverDto` or undefined;
  no raw or wrapper dependency.
- Adapter/presentation: `registerHoverProvider.ts` owns VS Code registration and
  `MarkdownString` mapping.
- Hosts/risk: host API use is presentation-only; unknown parameters retain the
  no-hover result in desktop and web extension hosts.
- Owner/validation: `migrate-diagnostics-and-hover-boundaries`;
  `findParameterHover.test.ts` and hover-provider tests.

### T9: Navigate Between List And Flow

- Application boundary: no standalone navigation use case exists. Stable unit
  identifiers and `src/shared/webviewEvents.ts` form the neutral transport;
  table `navigation.ts`, reveal helpers, and viewer routing coordinate it.
- Input/output: normalized identity plus plain event payloads become selection
  and reveal actions; no raw or wrapper dependency.
- Adapter/presentation: webview presentation owns selection; VS Code viewer
  routing owns panel/event delivery.
- Hosts/risk: serialization and panel delivery differ at the outer host seam;
  both hosts require event-contract and web smoke coverage.
- Owner/validation: `migrate-flow-graph-and-navigation-boundaries`;
  `revealUnit.test.ts`, table navigation, and viewer routing tests.

### T10: Build Semantic Diff

- Application boundary: `compareSemanticDiff` in
  `src/application/semantic-diff/compareSemanticDiff.ts`.
- Input/output: normalized before/after `AjsDocument` values become a
  host-neutral `SemanticDiffChangeSet`; no raw or wrapper dependency.
- Adapter/presentation: the application report builder and VS Code command own
  parsing orchestration and host interaction respectively.
- Hosts/risk: comparison is host-neutral; large documents and JP1/AJS semantic
  compatibility retain semantic fixture coverage.
- Owner/validation: `migrate-semantic-diff-and-report-boundaries`;
  `compareSemanticDiff.test.ts` and semantic fixture tests.

### T11: Present Semantic Diff Report

- Application boundary: `createBuildSemanticDiffReport` under
  `src/application/semantic-diff/`.
- Input/output: definition contents and language become Markdown report output
  or syntax errors. Raw parser results are normalized inside the use-case path.
- Adapter/presentation: bootstrap injects the parser; VS Code command, virtual
  document, copy command, and localization adapters present the report.
- Hosts/risk: VS Code presentation owns host APIs; Markdown escaping,
  localization, malformed input, and document lifecycle retain current tests.
- Owner/validation: `migrate-semantic-diff-and-report-boundaries`, with raw
  parser isolation owned by `isolate-parser-boundary`; report builder,
  Markdown, localization, document, and copy tests.

## Downstream Handoff And Removal Conditions

Each migration or compatibility finding has exactly one primary owner in its
inventory section. Cross-references in the use-case map identify affected
pipelines without changing that ownership.

- `isolate-parser-boundary` owns raw `Unit` and generated/ANTLR isolation. Exit
  requires no raw outward seam plus parser tests.
- `complete-normalized-domain-model` owns the domain wrapper graph. Exit requires
  each wrapper dependency to be retained or removed explicitly.
- `migrate-unit-information-boundaries` owns list, CSV, and definition
  presentation-to-domain imports. Exit requires a DTO-only presentation
  boundary plus the use-case tests.
- `migrate-flow-graph-and-navigation-boundaries` owns flow and navigation
  presentation-to-domain imports. Exit requires DTO/event-only boundaries plus
  the interaction tests.
- `migrate-diagnostics-and-hover-boundaries` owns diagnostics and hover use-case
  boundaries. Exit requires host-mapping and application tests.
- `complete-webapi-infrastructure-boundaries` owns WebAPI adapter and credential
  ownership. Exit requires desktop/web and real-environment evidence.
- `migrate-semantic-diff-and-report-boundaries` owns diff and report boundaries.
  Exit requires semantic and report tests.
- `isolate-telemetry-adapter-boundary` owns the telemetry SDK adapter. Exit
  requires the SDK to remain infrastructure-only.
- `standardize-serialization-and-composition-root` owns composition, transport,
  and Node compatibility. Exit requires a sole construction boundary and web
  smoke.
- `remove-legacy-and-enforce-clean-architecture` owns final allowlist removal.
  Exit requires an empty allowlist and full guardrail pass.

## Slice 3 Guardrail Baseline

`architectureRuleIds` defines these 12 stable rule IDs:

- `domain-outer-dependency`
- `application-outer-dependency`
- `presentation-outer-implementation`
- `infrastructure-outer-dependency`
- `concrete-infrastructure-outside-composition`
- `generated-parser-outside-infrastructure`
- `raw-unit-outside-parser-normalizer`
- `legacy-wrapper-dependency`
- `presentation-domain-dependency`
- `host-framework-outside-presentation`
- `node-builtin-browser-boundary`
- `telemetry-sdk-outside-adapter`

In-memory fixtures prove every rule family detects a representative violation.
The pre-existing high-value checks remain as a filtered view of the same full
catalog and still report zero production violations.

The exact typed allowlist contains 150 literal source/target/kind/rule entries:

- 5 raw-`Unit` entries owned by `isolate-parser-boundary`.
- 86 wrapper entries owned by `complete-normalized-domain-model`.
- 25 flow/navigation presentation entries owned by
  `migrate-flow-graph-and-navigation-boundaries`.
- 32 list/CSV/definition presentation entries owned by
  `migrate-unit-information-boundaries`.
- 2 Node/browser entries owned by
  `standardize-serialization-and-composition-root`.

Owners are restricted to the ten named downstream features by a TypeScript
union. Validation rejects unexplained violations, stale or duplicate entries,
missing ownership/removal conditions, wildcard paths, and import-kind drift.
Legitimate dependencies use explicit permitted-boundary predicates and are not
allowlisted.

Slice 3 validation evidence:

- Production reconciliation: 150 violations, 150 exact allowances, zero
  unexplained or stale entries.
- `rtk pnpm test` passed the desktop build, test compilation, architecture
  checks, and complete desktop suite.
- `rtk pnpm run test:web` passed the web build and browser smoke suite.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `git diff --check` passed.
