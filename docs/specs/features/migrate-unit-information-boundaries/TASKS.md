# Feature Tasks: Migrate Unit Information Boundaries

## Agent Brief

- Purpose: complete one normalized application boundary for unit list, CSV,
  and unit definition without changing visible behavior.
- Approved or active slice: Slices 1-4 are complete; no implementation slice
  remains active.
- Implement in order: Definition DTO, Unit List projection, CSV contract, then
  presentation dependency closure.
- Do not change columns, ordering, formatting, commands, copy/save behavior,
  telemetry schemas, or flow navigation.
- Do not absorb flow-graph projection or navigation migration.
- Preserve the normalized transport needed by the flow viewer until its own
  feature replaces that dependency.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the three source use
  cases.
- Validate every code slice with `rtk pnpm run qlty` plus its risk-based checks.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: run Feature Exit Review with `sdd-plan-task`.

## Plan Status

- Status: In Progress
- Planning scope: the complete unit-list, CSV-export, and unit-definition
  domain-to-application-DTO boundary, including its table and definition
  presentation consumers.
- Review status: Reviewed; final plan review completed 2026-07-20 with no
  blocking findings.
- Human approval: received 2026-07-20 for the reviewed plan and all four slice
  approval boundaries.
- Active implementation slice: none; all approved slices are complete and the
  feature awaits Feature Exit Review.

## Human Approval

- Status: Approved
- Approved at: 2026-07-20
- Approval evidence:
  - user response `approved.` following the final `sdd-review-plan` request
    approved the reviewed plan and Slice 1 implementation boundary
  - user response `sliceを全部承認します。` approved implementation of the
    remaining reviewed Slices 2-4
- Approved scope: implementation of Slices 1-4 exactly within each recorded
  Approval Boundary and dependency order.
- Not approved: scope expansion, visible behavior changes, or work outside the
  recorded feature and slice boundaries.

## Replanning Decision

- Trigger: plan review found that the former Unit List slice removed table-side
  domain reconstruction before a replacement definition DTO existed, so that
  slice could not preserve Unit Definition behavior independently.
- Ordering correction: establish an additive, serializable definition contract
  first; then switch the table to the application-owned list projection.
- Ownership correction: final locale resolution and label formatting remain in
  a presentation-local adapter. Application DTOs own semantic values and label
  keys, not localized presentation strings.
- Validation correction: preserve existing unit-list, table-render, CSV, and
  definition-action telemetry; add explicit UTF-8, Shift_JIS, and representative
  large-definition evidence.
- Allowlist correction: remove each exact architecture allowance in the same
  slice that removes its production dependency; do not leave stale entries for
  a later closure slice.
- Branch correction: implementation must occur on a dedicated feature branch.
  The current `codex/ddd-clean-architecture-migration` branch may carry this
  planning revision, but no runtime/test/configuration edit starts until the
  branch requirement is resolved.
- Scope impact: no feature requirement, non-goal, user-visible behavior, or
  slice count changes.

## Planning Gate

- Active feature folder:
  `docs/specs/features/migrate-unit-information-boundaries/`.
- Covered feature requirements: normalized application-owned list rows;
  application-facing CSV rows and columns; shared unit-definition DTOs; zero
  raw, wrapper, parser, and table-framework dependencies in application
  decisions; equivalent desktop and web decisions.
- Covered acceptance criteria: explicit host-neutral entry points and outputs
  for all three use cases, zero prohibited production dependencies in these
  pipelines, and preserved list, CSV, and definition regression behavior.
- Implementation order: Slice 1 establishes the additive definition contract;
  Slice 2 switches table list behavior to an application projection; Slice 3
  stabilizes CSV input on those rows; Slice 4 removes the remaining direct
  unit-information presentation-to-domain dependencies.
- Slice dependencies: Slice 1 has no feature-local dependency; Slice 2 depends
  on Slice 1; Slice 3 depends on Slice 2; Slice 4 depends on Slices 1 and 2.
  Slice 3 and Slice 4 are independent after Slice 2, but the planned order keeps
  the user-facing pipelines complete before the architecture closure gate.
- Boundary assumption: the current normalized document fields remain available
  to the flow-graph pipeline until
  `migrate-flow-graph-and-navigation-boundaries`; additions must be plain and
  backward-safe for existing consumers.
- Localization assumption: application DTOs may expose semantic unit types and
  command label keys. Presentation-local code resolves those values through
  existing resource data and preserves English, Japanese, and fallback text.
- Host assumption: VS Code supplies decoded `TextDocument` content to the
  application. Encoding evidence therefore verifies representative UTF-8 and
  Shift_JIS documents through the host path rather than adding decoding to the
  use case.

## Implementation Slices

### Slice 1: Project Shared Unit-Definition Content

- Status: Complete
- Completion approval: received 2026-07-20 through the user response
  `approved.` after implementation, validation, and final review.
- Scope: extend the existing document payload additively with a plain,
  serializable collection of application-owned unit-definition DTOs keyed by
  stable unit identity/path. Make table and flow definition actions consume
  those DTOs while both viewers retain their existing normalized document input
  for all other behavior. Preserve raw parameter order and text, command text,
  command-builder choices/defaults, dialog behavior, and flow navigation.
- User / Domain Value: the same selected unit shows the same application-provided
  definition and supported JP1/AJS command content in table and flow contexts.
- Smallest Useful Slice: the additive definition projection and both consumers
  form one observable consistency guarantee and can be delivered without
  changing list or graph projection.
- Cohesive Change Group:
  - `src/application/unit-definition/*`, `buildUnitList.ts`, and the current
    serialized document DTO only where needed to carry definitions additively
  - `src/presentation/vscode/webview/ajsDocument.ts` only where it posts the
    extended plain payload
  - table definition lookup/detail/dialog integration and the flow
    controller/effect/state path only where it receives or opens definitions
  - definition, command-builder, host-posting, table/flow interaction,
    serialization, and viewer-action telemetry tests
- Acceptance:
  - raw parameter text preserves source key/value order and newline behavior
  - command text uses the selected absolute path and supported builder
    defaults/options remain unchanged
  - table and flow resolve the same plain DTO for the same stable identity/path
  - missing or malformed definition entries fail safely without breaking list
    or graph rendering
  - existing normalized `rootUnits` and `warnings` remain consumable by both
    viewers; list and graph behavior are unchanged
  - table and flow `definition.open` operation events keep their current names,
    view attribution, allowlisted properties, and emission points
- Validation:
  - update `buildUnitDefinition.test.ts` and command-builder tests for plain DTO
    construction, path lookup, raw ordering, and defaults
  - update `AjsDocument.test.ts` for additive host posting and JSON round-trip
    compatibility with existing normalized fields
  - update `showUnitDefinitionInteraction.test.ts`, `flowGraphView.test.ts`, and
    focused flow controller/state tests for shared DTO consumption
  - add missing-unit and malformed-definition safe-state tests
  - preserve table/flow definition telemetry with
    `viewerActionTelemetry.test.ts` and focused interaction/message tests
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
  - review new qlty smells; use metric movement only when it identifies a
    concrete definition/command responsibility or compatibility risk
- Production Readiness:
  - Failure mode: absent or malformed definition data disables or omits the
    action without crashing; it does not expose partial misleading content
  - JP1/AJS compatibility: preserve raw evidence and JP1/AJS3 version 13
    `ajsshow` / `ajsprint` command-reference behavior
  - Large or malformed input risk: projection remains linear in units and
    parameters and avoids repeated full-document traversal per selection
  - Desktop/web impact: both viewers and hosts consume the same plain DTO; no
    host-specific or Node-only dependency enters application/shared code
  - README/docs impact: none expected; update the definition use case only if a
    durable boundary statement becomes inaccurate
  - CHANGELOG impact: none for behavior-preserving refactoring; any visible
    definition, command, dialog, or telemetry change requires replanning and a
    fresh decision
- Approval Boundary: approve the additive definition DTO contract, host posting,
  and minimum table/flow definition consumers. Do not approve list/graph DTO
  replacement, commands/options, dialog redesign, telemetry schema changes, or
  navigation changes.
- Dependencies: normalized-domain and parser-boundary features are complete;
  no feature-local dependency.
- Traceability: `uc-show-unit-definition.md`; `SPECS.md` Requirements 3-5 and
  Acceptance Criteria 1-3; definition, command, serialization, interaction,
  telemetry, desktop, and web validation above.
- Risks: the shared payload must remain backward-safe for current flow parsing;
  structured builders and label keys must remain serializable and semantically
  identical.
- Out of Scope: list/graph projection changes, JP1/AJS command expansion,
  command-reference realignment, dialog redesign, and flow navigation.

### Slice 2: Deliver A Serializable Unit-List Projection

- Status: Complete
- Completion approval: received 2026-07-21 through the user response
  `approved.` after implementation, validation, and final review.
- Scope: extend the application unit-list entry point so one successful parse
  produces deterministic plain row data and the unit identity, hierarchy,
  parameter-search, and selection metadata required by the table viewer. Switch
  table document state to consume that projection and the Slice 1 definitions
  directly. Preserve normalized document fields for the flow viewer, but remove
  table-side `toAjsDocument`, `AjsDocument`, `AjsUnit`, `AjsParameter`, and
  domain traversal dependencies. Reject malformed list projection data without
  presenting a partial complete list.
- User / Domain Value: View Unit List receives one host-neutral application
  result with stable identity, ordering, metadata, and errors rather than
  rebuilding application decisions in React.
- Smallest Useful Slice: producer, serialization contract, host adapter, and
  table consumer must change together to deliver a usable list; Slice 1 already
  supplies definition content needed to preserve all table actions.
- Cohesive Change Group:
  - `src/application/unit-list/buildUnitList.ts`, `unitListDocument.ts`,
    `buildUnitListView.ts`, and focused projection/DTO modules
  - `src/presentation/vscode/webview/ajsDocument.ts` and the shared
    `changeDocument` payload only as needed to carry the projection
  - table document state, `TableContents.tsx`, `tableViewerData.ts`,
    `globalFilter.ts`, `navigation.ts`, and table-side tree/selection adapters
    currently requiring normalized domain objects
  - the exact `globalFilter.ts`, `navigation.ts`, `TableContents.tsx`, and
    `tableViewerData.ts` entries in
    `src/test/fixtures/architecture/dependencyAllowlist.ts`
  - unit-list, serialization, table search/navigation/reveal, host-posting,
    encoding, representative large-definition, and telemetry tests
- Acceptance:
  - valid local or imported content produces deterministic application-owned
    rows and metadata in a JSON-serializable payload
  - invalid parser input or malformed payload yields errors or an empty safe
    state, never a partial list presented as complete
  - table code no longer restores or traverses `AjsDocument` / `AjsUnit`
  - definition, CSV, search, selection, tree, and list-to-flow behavior remains
    available without visible changes
  - flow continues to consume its existing normalized fields
  - representative UTF-8 and Shift_JIS documents produce equivalent expected
    rows through the supported host path
  - a representative large definition preserves row count, identity, and order
    without table-side full-tree reconstruction
  - `performance.unit_list_build.completed` and table-render performance events
    preserve names, properties, result/row-count buckets, and emission points
  - the four exact allowances for table document/search/navigation domain
    imports are removed with their production dependencies, and the allowance
    catalog remains complete, unique, and stale-free
- Validation:
  - update `buildUnitList.test.ts`, `buildUnitListView.test.ts`,
    `AjsDocument.test.ts`, and replacement serialization tests as needed
  - update table global-filter, search-state, navigation, reveal, and viewer-data
    tests for DTO-only inputs
  - add malformed-payload and JSON round-trip coverage
  - add representative UTF-8 and Shift_JIS host-path fixture coverage; if the
    automated host cannot select encoding, record the exact desktop smoke
    procedure and evidence rather than testing decoding inside application code
  - add a generated or fixture-backed large-definition regression that checks
    deterministic row count/order without a brittle time threshold
  - preserve unit-list build telemetry in `AjsDocument.test.ts` and table-render
    event/bucket behavior in focused table tests
  - run the architecture dependency suite after synchronously removing the four
    exact allowances and verify there are no unexplained or stale entries
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
  - review new qlty smells; use metric movement only for a concrete projection,
    compatibility, or large-input responsibility
- Production Readiness:
  - Failure mode: payload validation fails closed and keeps parse errors or an
    empty state understandable; serialization loss does not crash React
  - JP1/AJS compatibility: preserve encoding behavior, unit ordering, effective
    values, raw evidence, QUEUE transfer fields, and JP1/AJS3 version 13 rules
  - Large or malformed input risk: keep projection linear, avoid duplicate
    table reconstruction, and validate malformed and representative large data
  - Desktop/web impact: shared plain DTO affects both hosts and stays browser
    safe; desktop encoding evidence is recorded where host selection requires it
  - README/docs impact: none expected because behavior and commands are
    unchanged; update durable use cases only if boundary wording changes
  - CHANGELOG impact: none for internal refactoring; any observable list,
    encoding, compatibility, or telemetry change requires replanning and a new
    decision
- Approval Boundary: approve the list projection schema and table/host
  adaptations needed to consume it, plus removal of the four exact allowances
  whose production imports this slice removes. Do not approve flow graph
  DTO/layout, navigation behavior, new list fields, other allowances, telemetry
  schema changes, or UI changes.
- Dependencies: Slice 1.
- Traceability: `uc-view-unit-list.md`; `SPECS.md` Requirements 1, 4, and 5 and
  Acceptance Criteria 1-3; list, serialization, encoding, large-input,
  telemetry, desktop, and web validation above.
- Risks: shared payload compatibility and incomplete projection metadata can
  break flow, search, definition, CSV, tree, or navigation behavior even when
  cells render correctly. Deferring the matching allowance edits would make the
  architecture catalog stale and prevent this slice from validating alone.
- Out of Scope: flow graph/node projection, flow layout, flow navigation
  semantics, filtering redesign, decoding logic, or transport standardization
  beyond fields required by this feature.

### Slice 3: Stabilize The Plain CSV Export Contract

- Status: Complete
- Completion approval: received 2026-07-21 through the user response
  `approved.` after implementation, validation, and final review.
- Scope: replace the callback-bearing generic CSV input with an explicit plain
  visible-row/visible-column value contract derived from Slice 2 rows. Keep
  TanStack visibility, ordering, header extraction, and cell stringification in
  presentation; keep row numbering, quoting, escaping, and CSV assembly in the
  application use case. Copy and save continue to receive the same string.
- User / Domain Value: visible unit-list data exports deterministically through
  a host-neutral use case without leaking framework objects or functions.
- Smallest Useful Slice: the table adapter and CSV use-case contract must change
  together to preserve the exact payload.
- Cohesive Change Group:
  - `src/application/unit-list/exportUnitListCsv.ts` and its DTO types
  - `src/presentation/webview/editor/ajsTable/exportCsvView.ts`, `Header.tsx`,
    and copy/save callers only where they adapt or report CSV operations
  - application CSV, table export, message-routing, performance telemetry, and
    copy/save action tests
- Acceptance:
  - only visible columns are exported in display order
  - header placeholders, numbering, arrays/newlines, quotes, empty values, and
    multiline values remain byte-for-byte compatible
  - copy and save receive identical CSV text
  - application input contains only plain data and no callbacks, React,
    TanStack, VS Code, parser, wrapper, or normalized-domain types
  - `copy.csv`, `save.csv`, and `performance.csv_export.completed` preserve
    names, properties, row-count/duration buckets, and emission points
- Validation:
  - extend `exportUnitListCsv.test.ts` for plain input, ordering, numbering,
    escaping, empty values, and multiline content
  - extend `exportCsvView.test.ts` for hidden/reordered columns, placeholders,
    arrays, and Slice 2 rows
  - preserve routing/schema behavior in `viewerMessageRouting.test.ts` and
    `viewerActionTelemetry.test.ts`
  - add a representative large row/visible-column export assertion without a
    brittle duration threshold
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
  - review new qlty smells; use metric movement only for a concrete export or
    memory-risk responsibility
- Production Readiness:
  - Failure mode: absent rows/columns produce the current empty/header-only
    payload; unsupported cells are stringified only in presentation
  - JP1/AJS compatibility: preserve current cell strings and column meaning;
    no definition interpretation changes
  - Large or malformed input risk: output memory remains proportional to
    visible rows/columns with no extra domain-tree traversal
  - Desktop/web impact: CSV generation is shared; clipboard/save mechanisms
    remain host/presentation-owned and equivalent
  - README/docs impact: none expected because workflow and format are unchanged
  - CHANGELOG impact: none for byte-compatible refactoring; any output,
    workflow, or telemetry change requires replanning and a new decision
- Approval Boundary: approve only the plain CSV contract, table adapter,
  telemetry-preservation assertions, and exact regression tests. Do not approve
  fields, delimiter/encoding changes, export UI, host save/copy redesign, or
  telemetry schema changes.
- Dependencies: Slice 2.
- Traceability: `uc-export-unit-list-csv.md`; `SPECS.md` Requirements 2, 4, and
  5 and Acceptance Criteria 1-3; CSV, copy/save, large-input, telemetry,
  desktop, and web validation above.
- Risks: TanStack header groups and accessors encode visible behavior; careless
  flattening can change placeholders, order, or array newline rendering.
- Out of Scope: export formats, configurable delimiters, encoding changes,
  column redesign, search/filter semantics, and telemetry changes.

### Slice 4: Close Unit-Information Presentation Dependencies

- Status: Complete
- Completion approval: received 2026-07-21 through the user response
  `approved.` after implementation, validation, and final review.
- Scope: introduce focused presentation-local unit-information localization
  adapters and presentation-owned label value types backed directly by existing
  resource data. Application DTOs continue to expose semantic values and label
  keys only. Replace remaining unit-information presentation imports from
  `domain/services/i18n/nls` and `domain/values/AjsType`, remove the remaining
  localization-related exact allowances owned by this feature, and keep
  allowances owned by later features.
- User / Domain Value: unit-information presentation consumes stable application
  DTOs while final labels remain a presentation responsibility, completing the
  architecture boundary without changing displayed text.
- Smallest Useful Slice: the presentation localization adapter, all affected
  consumers, and remaining localization-related allowlist entries must move
  together so the architecture gate proves the boundary rather than relocating
  individual imports.
- Cohesive Change Group:
  - focused localization modules under the unit-information presentation
    boundary, backed by `src/resource/i18n/*`
  - table header, display-column selector, unit detail, column definitions,
    shared column label types, and `UnitEntityDialog.tsx`
  - this feature's remaining localization-related entries in
    `src/test/fixtures/architecture/dependencyAllowlist.ts`
  - localization, column, detail/dialog, and architecture dependency tests
- Acceptance:
  - English, Japanese, and fallback labels remain unchanged for headers, unit
    types, controls, parameter descriptions, and definition dialog text
  - unit-information presentation has zero direct imports from `src/domain`
  - all allowances still owned by this feature after Slice 2 are removed and
    the exact catalog is complete, unique, and stale-free
  - application does not own final localized strings or presentation formatting
  - unrelated flow, semantic-diff, hover, diagnostics, and repository-wide
    localization remain unchanged
- Validation:
  - add/update focused English, Japanese, fallback, column-definition,
    display-column, list-detail, and definition-dialog tests
  - run the architecture dependency suite and verify no allowance owned by
    `migrate-unit-information-boundaries` remains
  - preserve definition action and other unit-information telemetry tests; no
    schema or emission change is expected
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
  - review new qlty smells; use metric movement only for a concrete localization
    ownership or dependency risk
- Production Readiness:
  - Failure mode: unknown locale/key fallback remains equivalent and does not
    blank labels or crash column/dialog construction
  - JP1/AJS compatibility: unit-type and parameter labels preserve meaning; no
    parameter or command semantics change
  - Large or malformed input risk: label lookup is independent of definition
    size and adds no per-row resource reconstruction
  - Desktop/web impact: browser-safe presentation adapters are shared by both
    hosts; no host or Node API is introduced
  - README/docs impact: none expected; update architecture docs only if their
    durable description becomes inaccurate
  - CHANGELOG impact: none for label-compatible refactoring; any wording,
    fallback, or telemetry change requires replanning and a new decision
- Approval Boundary: approve only presentation-local unit-list/unit-definition
  localization adapters, their consumers, and removal of this feature's
  remaining localization-related exact allowances. Do not approve repository-
  wide resource relocation, application-owned final formatting, or allowances
  owned by other features.
- Dependencies: Slices 1 and 2. Slice 3 must also be complete before Feature
  Exit but does not provide a localization prerequisite.
- Traceability: View Unit List and Show Unit Definition use cases;
  `SPECS.md` Requirements 1, 3-5 and Acceptance Criteria 1-3; localization and
  architecture validation above.
- Risks: copying domain localization logic wholesale would create duplicate
  semantic ownership; presentation adapters must format application values and
  existing resource data without reimplementing JP1/AJS rules.
- Out of Scope: repository-wide resource relocation, semantic-diff/hover/
  diagnostics localization, flow node labels, and text changes.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: the feature spans three user-visible use cases, four slices, a shared
  serialized contract, compatibility evidence, and architecture allowances.
- Status: implementation evidence is recorded for Slices 1-4.

## Cross-Slice Dependencies

- Slice 1 adds definition DTOs without removing normalized fields, so it is
  independently usable and backward-safe for both viewers.
- Slice 2 consumes Slice 1 definitions while replacing table-side list
  reconstruction with application-projected rows and metadata, and removes the
  four exact allowances made stale by those dependency removals.
- Slice 3 consumes Slice 2 rows through a plain CSV input contract.
- Slice 4 depends on the DTO boundaries from Slices 1 and 2 and closes the exact
  localization-related presentation-domain allowances still owned by this
  feature.
- Any need to remove or redesign normalized fields for flow, alter visible
  behavior or telemetry, or move repository-wide localization requires another
  Replanning Mode run and renewed review/approval.

## Feature-Level Risks

- The serialized document feeds table and flow; all additions remain plain and
  existing normalized fields remain intact until the flow migration feature.
- List metadata supports definition, CSV, search, tree, and navigation; missing
  fields can cause subtle interaction regressions.
- Raw parameter order, effective/default evidence, command defaults, CSV
  placeholders, array newlines, localization fallback, and telemetry attribution
  are observable compatibility surfaces.
- Large definitions can regress through duplicate reconstruction, repeated
  traversal, or excessive serialized duplication.
- Host decoding, not the application use case, owns source encoding; validation
  must not introduce application-level filesystem/encoding behavior.
- DTO filenames may vary within the approved responsibilities, but plain-data
  semantics, consumers, and compatibility guarantees are fixed boundaries.
- No change to `engines.vscode` is planned or approved.
- Before implementation, use a dedicated feature branch and confirm unrelated
  active feature changes are not included in the implementation diff.

## Out Of Scope

- Flow graph DTOs, layout, nodes, nested expansion, and navigation behavior.
- New columns, filters, search semantics, definition actions, commands/options,
  CSV fields/formats, telemetry events/properties, or UI design.
- Parser grammar, normalization rules, decoding, JP1/AJS reference expansion,
  WebAPI transport, or repository-wide serialization/composition convergence.
- Raising the minimum VS Code version or adding Node-only shared code.

## Use-Case Back-Propagation

- The three source use cases already state the intended durable boundaries and
  behavior.
- Update them only if implementation proves a durable statement inaccurate or
  incomplete; do not record implementation history.
- No README, roadmap, architecture, or CHANGELOG update is currently required.
  Re-evaluate at slice completion and Feature Exit.

## Feature Exit

- Definition of Done status: not started.
- Required evidence: every slice Complete; requirements and acceptance criteria
  satisfied; risk-based and telemetry-preservation validation recorded;
  encoding/large-input evidence recorded; owned allowances removed;
  traceability current; durable-doc and CHANGELOG decisions re-evaluated; risks
  resolved, accepted, or propagated.
- Closure requires Feature Exit Mode and explicit human approval.
