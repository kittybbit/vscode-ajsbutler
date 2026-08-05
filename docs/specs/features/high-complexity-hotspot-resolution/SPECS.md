# Feature Specification: High-Complexity Hotspot Resolution

## Purpose

Decompose the validation and table-data projection responsibilities in
`src/application/unit-list/unitListDocument.ts` so that its measured complexity
is reduced without changing the unit-list document contract or observable list
and CSV behavior.

## Minimal Context

- Current decision: define a behavior-preserving decomposition boundary for
  unit-list document validation and projection.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Shared evidence: `../BASELINE.md`, intake group 6.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap item: `High-Complexity Hotspot Resolution` in
  `docs/specs/roadmap.md`.
- Source use cases: `docs/requirements/use-cases/uc-view-unit-list.md` and
  `docs/requirements/use-cases/uc-export-unit-list-csv.md`.
- JP1/AJS source reference: no external command or definition/config reference
  is selected; compatibility expectations are inferred from the existing use
  cases, characterization tests, and shared baseline and must not be expanded
  into new JP1/AJS semantics.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- HR-1: Preserve acceptance and rejection results for valid and malformed
  values supplied to `toUnitListTableData`, specifically the `rootUnits` and
  `unitList.rows` / `unitList.units` projection portion of a
  `UnitListDocumentDto`, including the rule that inconsistent input does not
  produce a partial table-data result.
- HR-2: Preserve root, row, and metadata identity correspondence, row ordering,
  projected field values, and optional-field handling.
- HR-3: Preserve the exported unit-list document and table-data contracts used
  by list rendering, related viewer actions, and CSV export.
- HR-4: Decompose validation and projection into cohesive application-layer
  responsibilities without introducing dependencies on parser internals,
  presentation frameworks, VS Code APIs, or host-specific capabilities.
- HR-5: Record reproducible before/after complexity evidence using Qlty
  function-level `Cyclo` as the primary metric over the five baseline hotspot
  functions and every extracted responsibility function. The final maximum
  function `Cyclo` must be lower than the pre-Slice-1 maximum, the residual
  `unitListDocument.ts` file `Cyclo` must be lower at feature completion, no
  extracted replacement may equal or exceed its mapped pre-Slice-1 function,
  and no new Qlty smell may be introduced. Cognitive complexity, file
  `Complex`, LOC, and directory metrics remain reported secondary signals.
- HR-6: Preserve behavior for representative valid, malformed, encoded, and
  large definitions in both desktop and web consumption paths.

## Architecture

- Domain: unchanged; normalized unit meaning and parameter interpretation stay
  in existing domain responsibilities.
- Application: owns validation of the serialized table-data projection,
  identity consistency, and projection to stable table data; any extracted
  collaborators remain application-layer and browser-safe. Pure domain value
  helpers such as `isTySymbol` remain permitted dependencies; parser,
  presentation, VS Code, Node, host, and telemetry dependencies remain out of
  scope.
- Presentation: unchanged; desktop and webview consumers continue to receive
  the same application-facing document and table-data shapes.
- Infrastructure: unchanged; parsing, encoding, and host adapters remain behind
  existing boundaries and do not leak into unit-list validation or projection.

### Planning Boundary Decision

- First isolate structural validation of serialized root units, row groups,
  and unit metadata behind one application-owned shape-validation boundary.
- Then isolate tree, row, and metadata identity correspondence behind one
  application-owned consistency boundary while keeping
  `toUnitListTableData` as the existing public conversion entry point.
- Preserve the current input boundary: the conversion validates only the
  required root and table projection fields, continues to accept the current
  record and numeric semantics, ignores unrelated top-level fields, and does
  not become a stricter plain-JSON or finite-number validator.
- Keep `UnitListRootDto`, `UnitListRowView`, and `UnitListUnitMetadataDto`
  ownership and existing public import paths stable. Extracted helpers may use
  type-only application imports and pure domain value helpers, but must not
  add a new public conversion API.
- Do not introduce a separate orchestration use case. Current callers invoke
  the single conversion entry point and do not duplicate application
  orchestration. Wider call-site changes require Replanning Mode.

## Impact Analysis

### Dependency Impact

- Affected boundary: `src/application/unit-list/unitListDocument.ts`, especially
  `isUnitListRowRecord`, `hasMatchingProjectionIdentity`, `isUnitListRootDto`,
  `isUnitListUnitMetadata`, and `toUnitListTableData`.
- Direct production call site for `toUnitListTableData`:
  `src/presentation/webview/editor/ajsTable/TableContents.tsx`.
  `src/presentation/webview/editor/ajsTable/tableViewerData.ts` consumes its
  result. `buildUnitList.ts` produces `UnitListDocumentDto` through
  `toUnitListDocumentDto`, while `viewerHostMessages.ts` owns transport and
  flow-document validation; these remain regression boundaries rather than
  direct conversion callers.
- Related regression boundaries include unit-list building, viewer host
  messages, table rendering, flow navigation, and CSV projection consumers.
- Characterization and application tests must change together only as needed to
  lock the existing contract; presentation, parser, CSV semantics, and host
  adapters are intentionally unchanged.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: no exported shape or semantic change.
- VS Code/web extension compatibility: no minimum-version or host-capability
  change.
- Changed scenarios: none; existing unit-list and CSV scenarios remain the
  contract.

### Alternative Considerations

- Keep the current file unchanged: rejected because the baseline identifies a
  ranked, high-change, high-risk responsibility hotspot with measurable
  complexity.
- Combine unit-list construction, presentation, or CSV refactors: rejected
  because each is a separate responsibility and approval boundary.
- Replace runtime checks with parser- or framework-specific types: rejected
  because it would violate the application boundary and desktop/web contract.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: any observable behavior change; DTO or
  schema change; parser, CSV, presentation, infrastructure, or domain change;
  new JP1/AJS interpretation; or expansion beyond the selected validation and
  projection boundary.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; this feature
  must not raise the minimum version or adopt a newer API.
- Web extension compatibility: extracted application code must remain
  browser-safe and preserve the shared table-data result.
- Desktop extension compatibility: existing list, navigation, and CSV consumers
  must continue to consume the same result.
- Host validation distinction: desktop encoding coverage verifies UTF-8 and
  Shift_JIS file decoding; shared application tests verify the serialized
  application-facing projection; web build and smoke coverage verify that the
  browser host can load and open the viewers using the browser-safe application
  code. Web coverage does not re-run desktop filesystem decoding or assert
  byte-level encoding equivalence.
- JP1/AJS compatibility: preserve supported definition interpretation,
  encoding behavior, stable identity and ordering, metadata, and rejection of
  malformed or inconsistent documents without partial results.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Existing characterization tests pass without changing expected unit-list or
  CSV outputs.
- Focused tests cover valid documents and malformed or identity-inconsistent
  documents across the decomposed validation and projection responsibilities.
- Focused tests preserve empty valid projections, unrelated top-level fields,
  current optional-field handling, and current numeric/record acceptance
  semantics at the `toUnitListTableData` boundary.
- Exported DTO and table-data shapes and all known consumer call sites remain
  compatible.
- Identity rejection is proven to flow to the existing empty viewer safe state,
  not only to an `undefined` conversion result.
- Desktop and web builds consume browser-safe application code with no new
  host-specific or outer-layer imports.
- Reproducible evidence uses the recorded Qlty version/configuration and exact
  function, file, directory, and smell commands, with before/after snapshots
  for the full extracted responsibility rather than only the residual file.
- Relevant quality, architecture, unit, desktop, and web checks selected by the
  risk-based validation policy pass.

## Non-Goals

- Changing parser normalization or JP1/AJS parameter interpretation.
- Changing unit-list row meaning, identity, ordering, metadata, error policy,
  or partial-result behavior.
- Changing CSV escaping, column behavior, or payload semantics.
- Refactoring unit-list construction, table presentation, viewer transport, or
  host adapters outside changes strictly required to preserve the selected
  application contract.
- Introducing a repository-wide complexity threshold.

## Open Questions

- None. Planning resolved the decomposition and found no current evidence for
  a separate orchestration extraction.
