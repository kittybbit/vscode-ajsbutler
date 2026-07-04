# Traceability: Architecture Boundaries And Normalized AJS Model

## Purpose

Map normalized-model boundary requirements to use cases, implementation slices,
and validation expectations.

## Reference Basis

- JP1/AJS source reference:
  - Command reference:
    JP1/AJS3 version 13 command semantics are relevant only if an approved
    slice changes command generation or command-related parameter
    interpretation.
  - Definition/config reference:
    existing JP1/AJS definition-file behavior is represented by parser,
    normalization, unit-list, flow-graph, CSV, diagnostics, hover, and
    unit-definition use cases plus sample definitions.
  - Undocumented or inferred behavior:
    legacy wrapper behavior in `UnitEntity` and related classes is treated as
    migration-source behavior until a slice traces it to JP1/AJS3 version 13
    documentation or preserves it explicitly through regression tests.

## Use Case Matrix

### `uc-normalize-ajs-document.md`

- Requirement:
  stable normalized model should support shared unit and dependency semantics
  without exposing parser mechanics.
- SPECS.md section:
  Requirements, Architecture, Boundary Rules, Acceptance Criteria.
- Implementation slice:
  Slice 1: Unit-List Serialization Uses Normalized DTOs.
- Test file or validation plan:
  `src/test/suite/buildUnitList.test.ts`,
  `src/test/suite/AjsDocument.test.ts`, table/flow document parsing tests if
  needed, `rtk pnpm run test:web`, and `rtk pnpm run build`.

### `uc-build-unit-list.md`

- Requirement:
  unit-list DTO output must not expose raw `Unit`, `UnitEntity`, or
  webview-specific types.
- SPECS.md section:
  Requirements, Boundary Rules, Acceptance Criteria.
- Implementation slice:
  Slice 1: Unit-List Serialization Uses Normalized DTOs.
- Test file or validation plan:
  `src/test/suite/buildUnitList.test.ts`, `src/test/suite/AjsDocument.test.ts`,
  `rtk pnpm run qlty`, `rtk pnpm run test:web`, and `rtk pnpm run build`.

### `uc-build-unit-list-view.md`

- Requirement:
  table row view models should not require `UnitEntity`, `tyFactory`, or
  `flattenChildren`.
- SPECS.md section:
  Requirements, Boundary Rules, Impact Analysis.
- Implementation slice:
  Slice 1 for document serialization; Slice 2 for CSV row export input.
- Test file or validation plan:
  `src/test/suite/buildUnitListView.test.ts` if row mapping changes,
  `src/test/suite/exportCsvView.test.ts`, and table viewer smoke validation via
  `rtk pnpm run test:web`.

### `uc-export-unit-list-csv.md`

- Requirement:
  CSV export input should use application-facing row data rather than
  `UnitEntity`-typed table rows or React Table internals.
- SPECS.md section:
  Requirements, Impact Analysis, Acceptance Criteria.
- Implementation slice:
  Slice 2: CSV Export Uses Application-Facing Row Input.
- Test file or validation plan:
  `src/test/suite/exportUnitListCsv.test.ts`,
  `src/test/suite/exportCsvView.test.ts`,
  `src/test/suite/tableColumnDef.test.ts` if column metadata changes,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

### `uc-build-flow-graph.md`

- Requirement:
  graph DTO output must not expose parser internals or UI-library types.
- SPECS.md section:
  Requirements, Architecture, Compatibility.
- Implementation slice:
  Slice 1 only for the shared serialized normalized document consumed by flow;
  deeper flow graph migration is out of this feature's first implementation
  plan.
- Test file or validation plan:
  existing flow document parsing or web smoke validation through
  `rtk pnpm run test:web`; focused flow tests only if Slice 1 changes flow
  behavior.

### `uc-show-unit-definition.md`

- Requirement:
  definition presentation should not require wrapper-specific objects when
  stable DTOs are enough.
- SPECS.md section:
  Acceptance Criteria, Non-Goals.
- Implementation slice:
  no planned implementation slice; preserve existing behavior and keep deeper
  definition migration out of scope.
- Test file or validation plan:
  existing unit-definition tests if touched; otherwise no targeted validation
  beyond qlty/build/web smoke for affected slices.

### `uc-provide-editor-feedback.md`

- Requirement:
  diagnostics and hover should preserve normalized boundaries and parser-error
  behavior.
- SPECS.md section:
  Acceptance Criteria, Compatibility.
- Implementation slice:
  no planned implementation slice; preserve existing diagnostics and hover
  behavior.
- Test file or validation plan:
  existing diagnostics and hover tests only if a slice unexpectedly touches
  those paths.

### `uc-record-telemetry.md`

- Requirement:
  telemetry boundaries must remain privacy-preserving and adapter-owned.
- SPECS.md section:
  Compatibility, Non-Goals.
- Implementation slice:
  Slice 1 and Slice 2 preserve existing performance and action telemetry
  payloads; no telemetry expansion is planned.
- Test file or validation plan:
  existing telemetry tests only if event names or payloads are touched; no
  telemetry payload changes are expected.

### Architecture Dependency Rules

- Requirement:
  dependency rules should be mechanically checkable in CI for the highest-value
  domain, application, and presentation boundaries.
- SPECS.md section:
  Requirements, Boundary Rules, Acceptance Criteria.
- Implementation slice:
  Slice 3: Scoped Architecture Dependency Rule Test.
- Test file or validation plan:
  `src/test/suite/architectureDependencyRules.test.ts` or equivalent,
  `rtk pnpm test`, `rtk pnpm run qlty`, and `rtk pnpm run build`.

## Slice Traceability

### Slice 1: Unit-List Serialization Uses Normalized DTOs

- Requirements:
  reduce raw `Unit` exposure at the webview/application document boundary,
  preserve table and flow document behavior, and keep webview payloads plain
  and JSON-serializable.
- SPECS sections:
  Requirements, Architecture, Boundary Rules, Acceptance Criteria.
- Validation plan:
  targeted unit-list and document-posting tests, web smoke, qlty, and build.
- Validation result:
  `rtk pnpm test`, `rtk pnpm run qlty`, `rtk pnpm run test:web`, and
  `rtk pnpm run build` passed for the Slice 1 implementation. The build
  reported existing webpack bundle-size warnings, but compilation succeeded.
- Manual traceability:
  no new JP1/AJS3 manual section is required because the slice preserves
  current normalized interpretation.

### Slice 2: CSV Export Uses Application-Facing Row Input

- Requirements:
  keep CSV escaping and visible-column behavior while moving export input away
  from React Table internals and toward stable row/column export DTOs.
- SPECS sections:
  Requirements, Impact Analysis, Acceptance Criteria.
- Validation plan:
  targeted CSV export tests, table column metadata tests if needed, web smoke,
  qlty, and build.
- Validation result:
  `rtk pnpm test`, `rtk pnpm run qlty`, `rtk pnpm run lint:md`,
  `rtk pnpm run test:web`, and `rtk pnpm run build` passed for the Slice 2
  implementation. The build reported existing webpack bundle-size warnings,
  but compilation succeeded.
- Manual traceability:
  no JP1/AJS3 manual section is required because CSV exports already-projected
  display values.

### Slice 3: Scoped Architecture Dependency Rule Test

- Requirements:
  mechanically check domain, application, and presentation dependency rules
  through the existing CI test path without adding broad new tooling.
- SPECS sections:
  Requirements, Boundary Rules, Acceptance Criteria.
- Validation plan:
  focused architecture dependency test, qlty, and build.
- Manual traceability:
  not applicable; this slice affects repository architecture validation rather
  than JP1/AJS semantics.

## Compatibility Mapping

- Desktop:
  table, CSV, flow, definition, diagnostics, hover, and telemetry behavior must
  stay unchanged for paths outside the approved slice.
- Web:
  shared imports and browser bundle assumptions must be checked for Slice 1 and
  Slice 2 with `rtk pnpm run test:web`.
- VS Code:
  no slice may raise `engines.vscode` without a separate compatibility decision
  and approval.
- Parser:
  grammar and generated parser behavior stay out of scope for this feature.

## Open Traceability Gaps

- Exact implementation details remain pending human approval and
  `sdd-implement-task`.
- Dependency-rule test implementation may discover an existing violation; if
  so, use Replanning Mode before broadening the approved scope.
