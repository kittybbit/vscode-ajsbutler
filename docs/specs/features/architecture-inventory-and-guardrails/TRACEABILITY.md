# Traceability: Architecture Inventory And Guardrails

## Requirement And Slice Mapping

| Scope                | Req    | Spec           | Slice | Test or validation |
| -------------------- | ------ | -------------- | ----- | ------------------ |
| Import collector     | R1/R4  | Requirements   | S1    | Collector fixtures |
| Current rules        | R4     | Requirements   | S1    | Architecture test  |
| Dependency inventory | R1/R2  | Requirements   | S2    | Scan and `rtk rg`  |
| Use-case inventory   | R3/AC1 | Req/Acceptance | S2    | UC/test review     |
| Rule catalog         | R4/AC2 | Req/Acceptance | S3    | Violation fixtures |
| Temporary entries    | R5/AC3 | Req/Acceptance | S3    | Exact/stale checks |
| Host coverage        | AC1    | Compatibility  | S2/S3 | Host map/web smoke |

S1 changes the architecture test and new test support. S2 records inventory in
this file. S3 changes the same test/support, adds the typed allowlist fixture,
and completes the guardrail evidence here.

## Use-Case Mapping Plan

| UC                  | Req    | Spec         | Slice | Test ID |
| ------------------- | ------ | ------------ | ----- | ------- |
| Import WebAPI       | R3/AC1 | Requirements | S2    | T1      |
| View Unit List      | R3/AC1 | Requirements | S2    | T2      |
| Build Flow Graph    | R3/AC1 | Requirements | S2    | T3      |
| Explore Flow Graph  | R3/AC1 | Requirements | S2    | T4      |
| Show Definition     | R3/AC1 | Requirements | S2    | T5      |
| Export CSV          | R3/AC1 | Requirements | S2    | T6      |
| Diagnose AJS        | R3/AC1 | Requirements | S2    | T7      |
| Parameter Hover     | R3/AC1 | Requirements | S2    | T8      |
| List/flow Navigate  | R3/AC1 | Requirements | S2    | T9      |
| Build Semantic Diff | R3/AC1 | Requirements | S2    | T10     |
| Present Diff Report | R3/AC1 | Requirements | S2    | T11     |

Test evidence to inspect during S2:

- T1: `importAjsDefinitionViaWebApi.test.ts` and boundary/command tests.
- T2: `buildUnitList.test.ts` and unit-list view tests.
- T3: `buildFlowGraph.test.ts` and `buildFlowGraphUseCase.test.ts`.
- T4: flow graph view, expansion, focus, search, and selection tests.
- T5: `buildUnitDefinition.test.ts` and interaction tests.
- T6: `exportUnitListCsv.test.ts` and `exportCsvView.test.ts`.
- T7: `buildSyntaxDiagnostics.test.ts` and VS Code adapter tests.
- T8: `findParameterHover.test.ts` and hover-provider tests.
- T9: `revealUnit.test.ts`, table navigation, and viewer routing tests.
- T10: `compareSemanticDiff.test.ts` and semantic fixture tests.
- T11: report builder, Markdown, localization, document, and copy tests.

## Downstream Ownership

S2 must assign findings to exactly one of these owners:

- parser/generated/raw boundary: `isolate-parser-boundary`
- normalized meaning/wrappers: `complete-normalized-domain-model`
- list/CSV/definition: `migrate-unit-information-boundaries`
- flow/navigation: `migrate-flow-graph-and-navigation-boundaries`
- diagnostics/hover: `migrate-diagnostics-and-hover-boundaries`
- WebAPI: `complete-webapi-infrastructure-boundaries`
- semantic diff/report: `migrate-semantic-diff-and-report-boundaries`
- telemetry SDK/port: `isolate-telemetry-adapter-boundary`
- transport/composition: `standardize-serialization-and-composition-root`
- final legacy/allowlist removal:
  `remove-legacy-and-enforce-clean-architecture`

## Inventory Record Shape

Each S2 finding must record source, target, dependency category, current
classification, evidence, downstream owner, removal or retention decision, and
validation. Each S3 temporary entry must additionally record an exact rule ID
and removal condition. Grouping is allowed only when every underlying import is
enumerated and the collector total remains reproducible.
