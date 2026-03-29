# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before implementation.

## Branch Status

### Completed In This Branch

- `BuildUnitList` use case exists and is covered by
  `src/test/suite/buildUnitList.test.ts`.
- `ExportUnitListCsv` use case exists and is covered by
  `src/test/suite/exportUnitListCsv.test.ts`.
- `BuildFlowGraph` use case exists and is covered by
  `src/test/suite/buildFlowGraphUseCase.test.ts`.
- `ShowUnitDefinition` is documented and now uses an application DTO instead of
  passing `UnitEntity` directly into the dialog.
- editor feedback extraction exists and is covered by
  `src/test/suite/buildSyntaxDiagnostics.test.ts` and
  `src/test/suite/findParameterHover.test.ts`.
- telemetry port extraction exists and is covered by
  `src/test/suite/reportWebviewOperation.test.ts`.
- normalized AJS model exists and is covered by
  `src/test/suite/normalizeAjsDocument.test.ts`.
- repeatable web-extension verification now exists via `npm run test:web` and
  GitHub Actions workflow automation.

### Next Priority Tasks

1. Introduce a normalized-model-backed table row/view adapter so the table view
   stops depending directly on `UnitEntity` and `tyFactory`.
2. Start that migration with the lowest-risk table columns, likely current
   `group3` and the non-relational subset of `group1`, before attempting link-
   heavy groups such as `group2`.
3. Revisit whether remaining wrapper-derived semantics belong in the normalized
   model or in application view adapters.

## Default Workflow

1. Read the relevant documents in `docs/sdd/`.
2. Update or create the related use-case spec in `docs/sdd/use-cases/`.
3. Copy the task template below for the current change.
4. Fill in assumptions explicitly when requirements are ambiguous.
5. Implement only after acceptance criteria are clear.
6. Run build, quality checks, and relevant tests.
7. Summarize compatibility risks and follow-up work.

## Task Template

### Task

<!-- A single sentence describing what will be changed. -->

### Why

<!-- Why this change is necessary. -->

### Scope

<!-- Target files, modules, or use cases for the change. -->

### Non-Goals

<!-- What is out of scope for this task. -->

### Constraints

- Keep `engines.vscode` compatibility unless explicitly approved.
- Keep desktop and web extension behavior intact.
- Avoid direct `vscode` dependency in domain.

### Design

#### Use case

<!-- Which use case(s) will be addressed. -->

#### Layers affected

- domain:
- application:
- infrastructure:
- presentation:

#### Key decisions

-
-

### Acceptance Criteria

- [ ] build passes
- [ ] quality/lint passes
- [ ] tests updated
- [ ] desktop behavior preserved
- [ ] web behavior preserved if affected

### Test Plan

-
-

### Risks

-
-

### Rollback Plan

-
-

## Current Task

### Task

Extract flow graph generation into a clean-architecture use case without changing flow behavior.

### Why

The flow view still builds graph data directly inside presentation code and mixes graph construction with XyFlow concerns.

### Scope

- add a `BuildFlowGraph` use case
- define a UI-independent flow graph DTO
- move graph construction logic out of XyFlow-facing presentation code
- keep flow rendering and VS Code activation behavior unchanged
- add or update tests for graph construction
- update SDD docs and `PLANS.md`

### Non-Goals

- parser changes
- UI behavior changes
- dependency updates
- `engines.vscode` changes
- VS Code command changes
- activation/bootstrap refactor beyond this slice

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not expose parser internals or XyFlow types in application DTOs.
- Do not add `vscode` imports to domain or application.

### Design

#### Use case

Build flow graph extraction.

#### Layers affected

- domain: reused
- application: added
- infrastructure: updated
- presentation: updated
- docs: updated

#### Key decisions

- Introduce a pure flow graph DTO with node and edge metadata independent from XyFlow.
- Keep XyFlow conversion in presentation and reuse normalized unit reconstruction where possible.

### Acceptance Criteria

- [ ] `BuildFlowGraph` use case exists
- [ ] flow view consumes the DTO via a presentation-layer mapper
- [ ] application DTO does not expose parser internals or XyFlow types
- [ ] flow rendering remains behaviorally unchanged
- [ ] relevant tests pass
- [ ] desktop and web builds pass

### Test Plan

- run build
- run relevant tests
- inspect diff for the intended slice only

### Risks

- DTO conversion can drift from current flow-node rendering assumptions if metadata is incomplete
- browser-hosted extension behavior still depends on existing webview constraints and bundle assumptions

### Rollback Plan

- revert the flow viewer adapter to the previous message path
- fall back to the previous presentation-side graph builder if regressions appear

## Task

Refactor VS Code integration points toward adapter boundaries without changing
user-visible behavior.

### Why

Diagnostics, hover, commands, and activation wiring are still correct
behaviorally, but the repository benefits from clearer application-vs-adapter
seams and a more explicit composition root.

### Scope

- extract testable application logic for diagnostics and hover
- move VS Code-coupled webview event helpers out of domain
- clarify command registration ownership in the VS Code-facing layer
- reduce extension activation concentration with an explicit bootstrap module
- update SDD docs and tests for the new seams

### Non-Goals

- parser grammar changes
- list or flow behavior changes
- command ID changes
- `engines.vscode` changes
- broad folder-structure rewrites beyond this adapter slice

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not add `vscode` imports to domain or application.
- Preserve existing diagnostics, hover content, command IDs, and telemetry flow.

### Design

#### Use case

Provide editor feedback and isolate VS Code adapters.

#### Layers affected

- domain: remove legacy VS Code-coupled helpers
- application: add diagnostics and hover decision use cases
- infrastructure: none
- presentation: keep UI/event translation at extension/webview boundaries
- docs: update architecture and add an editor-feedback use case

#### Key decisions

- Put syntax-diagnostic and parameter-hover decisions in application DTO use cases.
- Make `src/extension/bootstrap/activateExtension.ts` the explicit composition root.

### Acceptance Criteria

- [ ] domain and application contain no direct `vscode` imports
- [ ] diagnostics and hover adapters depend on application DTO logic
- [ ] command registration remains unchanged from the user perspective
- [ ] activation wiring is easier to follow from a single composition module
- [ ] build passes
- [ ] tests pass

### Test Plan

- run build
- run tests
- add unit tests for extracted application logic
- add extension integration checks for command registration, diagnostics, and hover

### Risks

- diagnostics and hover integration tests can be timing-sensitive in VS Code
- webview adapter refactor can still regress browser behavior if shared message
  contracts drift

### Rollback Plan

- restore the previous extension activation wiring
- revert diagnostics and hover adapters to direct parser/domain access
- restore legacy webview event helpers if adapter migration regresses behavior

## Task

Refactor telemetry integration behind an adapter boundary without changing
telemetry event behavior.

### Why

Telemetry SDK usage is still referenced directly from runtime and webview
adapter code, which makes ownership less clear and keeps outer-layer details
visible to callers.

### Scope

- introduce a small application-facing telemetry port
- add an extension-side adapter for the current telemetry SDK
- refactor activation, commands, and webview telemetry callers to use the port
- document the telemetry boundary in SDD docs
- add tests where telemetry payload preservation becomes easy to verify

### Non-Goals

- changing telemetry event scope
- changing event names
- changing payload semantics beyond adapter translation
- changing `engines.vscode`
- redesigning unrelated extension runtime structure

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not import telemetry SDK types into domain or application.
- Keep telemetry minimal and privacy-conscious.

### Design

#### Use case

Record telemetry through a small port.

#### Layers affected

- domain: unchanged
- application: add telemetry port
- infrastructure: none
- presentation/extension: add telemetry adapter and inject it from bootstrap
- docs: update architecture and add a telemetry design note

#### Key decisions

- Expose only `trackEvent` and `dispose` on the telemetry port.
- Keep event names and payload property shapes unchanged during this slice.

### Acceptance Criteria

- [ ] application/domain contain no telemetry SDK imports
- [ ] telemetry SDK usage exists only in outer adapter modules
- [ ] existing telemetry-triggering flows call the new port
- [ ] build passes
- [ ] tests pass

### Test Plan

- run build
- run tests
- add a targeted test for telemetry payload translation where practical

### Risks

- web extension compatibility still depends on the current telemetry SDK package
- telemetry lifecycle cleanup can regress if disposal wiring changes

### Rollback Plan

- restore direct telemetry SDK calls in the extension runtime and handlers
- remove the telemetry adapter and port if regressions appear

## Task

Introduce a normalized AJS model and normalization step without changing
user-visible behavior.

### Why

`Unit` is still a parser-adjacent raw tree and `UnitEntity` still acts as an
interpreter/wrapper layer. Application use cases need a more stable model for
shared product semantics.

### Scope

- add normalized model types such as `AjsDocument`, `AjsUnit`, and
  `AjsDependency`
- add a normalizer from raw parsed units into the normalized model
- migrate `BuildUnitList` and `BuildFlowGraph` through the normalized model
- keep raw `Unit` and existing `UnitEntity` wrappers for now
- update SDD docs and add normalization tests

### Non-Goals

- removing the raw `Unit` model
- deleting `UnitEntity` classes
- rewriting every use case to normalized model in one step
- changing user-visible list or flow behavior
- changing `engines.vscode`

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not add `vscode` imports to domain or application.
- Keep the refactor small and reviewable.

### Design

#### Use case

Normalize parsed AJS definitions into a stable application-facing model.

#### Layers affected

- domain: add normalized model and normalizer while preserving raw/interpreter layers
- application: migrate selected use cases to consume normalized model
- infrastructure: none
- presentation: minimal adaptation where selected use cases now expect normalized data
- docs: update architecture and add normalization design note

#### Key decisions

- Keep normalization incremental by deriving normalized semantics from the current wrapper layer.
- Migrate only `BuildUnitList` and `BuildFlowGraph` in this slice.

### Acceptance Criteria

- [ ] normalized model exists with stable business-oriented names
- [ ] normalizer converts parsed definitions into normalized units and dependencies
- [ ] `BuildUnitList` uses normalized model internally
- [ ] `BuildFlowGraph` uses normalized model internally
- [ ] build passes
- [ ] tests pass

### Test Plan

- run build
- run tests
- add normalization tests
- verify existing unit-list and flow-graph tests still pass effectively

### Risks

- normalization can subtly drift from existing wrapper semantics
- flow graph behavior can regress if dependency or layout metadata is not preserved exactly

### Rollback Plan

- restore direct raw `Unit` / `UnitEntity` usage in affected use cases
- remove the normalizer from migrated use cases if semantic regressions appear

## Task

Extend `BuildUnitListView` to cover additional low-risk table column groups.

### Why

The table adapter already covers groups 1 to 3, but `group4`, `group5`,
`group8`, and `group9` still read `UnitEntity.params(...)` directly in the UI
layer even though they are simple type-gated projections.

### Scope

- extend `buildUnitListView` with stable data for manager, job-group,
  jobnet-connector, and start-condition columns
- migrate `group4`, `group5`, `group8`, and `group9` to read only the row view
  adapter
- add or update tests for the new row view fields

### Non-Goals

- migrating the more complex calendar, jobnet, or schedule groups in the same
  slice
- changing visible table rendering semantics
- changing parser or normalized model behavior beyond view projection

### Acceptance Criteria

- [ ] `group4`, `group5`, `group8`, and `group9` no longer call
      `UnitEntity.params(...)`
- [ ] the new row view fields stay type-gated to the same unit kinds as today
- [ ] build passes
- [ ] tests pass

## Task

Extend `BuildUnitListView` to cover calendar columns in `group6`.

### Why

`group6` still depends on wrapper-only week-judgement logic in `G`, but the
actual behavior is a projection of `op` and `cl` parameter values that can be
made explicit in the application adapter.

### Scope

- project calendar weekday state for `g` units into the row view adapter
- project non-week `op` and `cl` values into stable table view data
- migrate `group6` to consume only the row view adapter
- add or update tests for calendar projection

### Non-Goals

- migrating jobnet priority logic in `group7`
- changing calendar rendering semantics

### Acceptance Criteria

- [ ] `group6` no longer depends on `G` or `row.params(...)`
- [ ] weekday icons still follow the same open/close precedence
- [ ] non-week `op` and `cl` entries still render in order
- [ ] build passes
- [ ] tests pass

## Task

Expose parameter order in the normalized/unit-list adapter path and migrate
`group7`.

### Why

`group7` mostly projects simple jobnet parameters, but priority depends on the
relative order of `pr` and `ni`, plus parent-jobnet inheritance. That behavior
cannot be reproduced reliably unless parameter position survives normalization.

### Scope

- preserve parameter position from parser output through normalization and
  unit-list DTO mapping
- project `group7` fields from `BuildUnitListView`
- migrate `group7` to consume only the row view adapter
- add or update tests for priority ordering and inheritance

### Non-Goals

- migrating schedule-heavy `group10` in the same slice
- changing jobnet priority semantics

### Acceptance Criteria

- [ ] normalized parameters preserve source order
- [ ] `group7` no longer depends on `UnitEntity` priority or `params(...)`
- [ ] `pr`/`ni` order and parent inheritance still produce the same priority
- [ ] build passes
- [ ] tests pass

## Task

Extend `BuildUnitListView` to cover schedule columns in `group10`.

### Why

`group10` still depends on wrapper parsing for rule-based schedule parameters,
but the table only needs display-oriented fields such as parsed date parts,
times, cycles, and rule references.

### Scope

- project schedule-related parameter values into stable row view data
- migrate `group10` to consume only the row view adapter
- add or update tests for representative schedule fields

### Non-Goals

- changing schedule rendering semantics
- migrating unrelated remaining column groups in the same slice

### Acceptance Criteria

- [ ] `group10` no longer depends on `defaultAccessorFn(...)`
- [ ] parsed schedule fields preserve current visible table values
- [ ] build passes
- [ ] tests pass
