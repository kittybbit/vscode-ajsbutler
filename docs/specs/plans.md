# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before
implementation.

This file is the high-level index for the per-feature plan structure in
`docs/specs/features/<feature>/`.

## Branch Status

### Completed In This Branch

- `BuildUnitList` use case exists and is covered by
  `src/test/suite/buildUnitList.test.ts`.
- `BuildUnitListView` exists and the table column groups now read application
  view data for `group1` to `group19`, and the table presentation now consumes
  `UnitListRowView` end to end.
- `ExportUnitListCsv` use case exists and is covered by
  `src/test/suite/exportUnitListCsv.test.ts`.
- `BuildFlowGraph` use case exists and is covered by
  `src/test/suite/buildFlowGraphUseCase.test.ts`, and the flow presentation
  no longer reconstructs `UnitEntity` to render, navigate, or open dialog data.
- `ShowUnitDefinition` now uses an application DTO instead of passing
  `UnitEntity` directly into the dialog.
- editor feedback extraction exists and is covered by
  `src/test/suite/buildSyntaxDiagnostics.test.ts` and
  `src/test/suite/findParameterHover.test.ts`.
- telemetry port extraction exists and is covered by
  `src/test/suite/reportWebviewOperation.test.ts`.
- normalized AJS model exists and is covered by
  `src/test/suite/normalizeAjsDocument.test.ts`.
- normalized AJS navigation helpers now expose parent lookup, ancestor lookup,
  and root jobnet lookup without reusing wrapper traversal in consumers.
- normalized AJS helpers now expose direct parameter lookup, repeated-value
  lookup, and first-ancestor inherited parameter lookup so application slices
  stop repeating wrapper-era parameter traversal logic.
- shared parameter helpers now expose `top1` to `top4` transfer-operation
  default derivation so wrapper-only fallback rules are testable outside
  `ParameterFactory`.
- shared parameter helpers now expose reusable sorted rule-parameter mapping so
  `ln` and `sd` no longer sort rule arrays directly inside `ParameterFactory`.
- shared parameter helpers now expose connector-control default resolution so
  `G` and `N` stop deciding `ncl`, `ncs`, and `ncex` fallback values with
  wrapper-local literals and branching.
- shared parameter helpers now expose inherited scalar and array builders so
  selected `ParameterFactory` methods stop repeating `inherit: true` lookup
  wiring.
- shared parameter helpers now expose optional scalar builders so the simplest
  `checkAndGet(...)` plus `new Xxx(...)` parameter methods stop repeating in
  `ParameterFactory`.
- shared parameter helpers now expose optional array builders so the plain
  `checkAndGetArray(...)` plus `params.map((param) => new Xxx(param))`
  parameter methods stop repeating in `ParameterFactory`.
- shared parameter helpers now expose defaultable scalar builders so `ncl`,
  `ncs`, and `ncex` stop forwarding caller-supplied defaults inline in
  `ParameterFactory`.
- shared parameter helpers now expose sd-aligned empty-rule builders so `cy`,
  `ey`, `sh`, and `sy` stop constructing `${rule},` fallbacks inline in
  `ParameterFactory`.
- shared parameter helpers now expose sd-aligned default-rule builders so
  `cftd`, `shd`, `st`, `wc`, and `wt` stop constructing
  `${rule},<default>` fallbacks inline in `ParameterFactory`.
- `ParameterFactory` no longer keeps private `#checkAndGet` and
  `#checkAndGetArray` wrappers now that `ln` and `unit` delegate to shared
  helper paths directly.
- shared parameter helpers now resolve `sd` through root-jobnet-aware helper
  logic so sd-aligned builders stop calling `unit.params("sd")` directly in
  `ParameterFactory`.
- shared unit-relation helpers now resolve sibling `ar` links so `UnitEntity`
  stops duplicating previous/next relation lookup and relation-to-unit mapping
  logic inline.
- shared unit-type helpers now resolve recovery semantics so `UnitEntity` and
  normalized AJS mapping stop maintaining duplicate `isRecovery` rules.
- shared unit-layout helpers now resolve `el`-based coordinates so `UnitEntity`
  and normalized AJS mapping stop maintaining duplicate layout parsing rules.
- shared unit-parameter helpers now resolve defined parameter names so wrapper
  prototype inspection no longer lives only inside `UnitEntity`.
- shared unit wait-state helpers now resolve `eun`-based wait detection so
  wrapper classes stop duplicating `hasWaitedFor` checks inline.
- shared unit jobnet-state helpers now resolve root-jobnet detection so
  wrapper and normalized-model logic stop maintaining duplicate parent-type
  checks.
- shared unit schedule-state helpers now resolve effective schedule detection
  so wrapper and normalized-model logic stop maintaining duplicate `sd`
  interpretation rules.
- shared unit group-state helpers now resolve `gty` interpretation so wrapper
  and normalized-model logic stop maintaining duplicate group/planning checks.
- shared group-week helpers now resolve `op` and `cl` weekday interpretation so
  `G` stops duplicating the same open/close calendar precedence logic across
  weekday getters.
- shared priority helpers now resolve wrapper priority fallback rules so `J`,
  `N`, and `Qj` stop routing the same semantics through a misc utility module.
- shared depth helpers now resolve absolute-path-based depth so wrapper and
  normalized-model logic stop maintaining separate depth calculation rules.
- normalized-model mapping now reuses the shared wait-state helper so wrapper
  and normalized-model wait detection fully share the same `eun` rule.
- normalized-model mapping now reuses the shared encoded-string helper so
  wrapper and normalized-model comment decoding fully share the same quoting
  and escape rules.
- normalized-model mapping now reuses the shared dependency parsing helper so
  wrapper and normalized-model `ar` interpretation fully share the same source,
  target, and relation parsing rule.
- normalized-model mapping now reuses shared raw unit-parameter lookup helpers
  so simple key/value filtering no longer lives only inside normalization.
- normalized-model layout mapping now reuses shared raw unit-parameter lookup
  helpers so parent `el` lookup no longer filters parameters inline.
- repeatable web-extension verification exists via `npm run test:web`.

### Next Priority Tasks

1. Continue moving the remaining wrapper-derived semantics that still require
   typed wrapper interpretation or other unit-type-specific defaults into
   shared helpers in small slices, with priority on repeated logic still kept
   inside wrapper classes or normalized-model local helpers.
2. Continue reducing activation and webview concentration without changing user
   behavior or breaking web-extension support.
3. Keep roadmap and feature task files aligned with merged slices so remaining
   debt stays explicit.

## Default Workflow

1. Create a dedicated git branch before implementation work starts.
2. Read the relevant documents in `docs/specs/`.
3. Update or create the related use-case spec in
   `docs/requirements/use-cases/`.
4. Create or update corresponding feature docs in
   `docs/specs/features/<feature>/`:
   - `SPECS.md` for implementation requirements
   - `PLANS.md` for planning and milestones
   - `TASKS.md` for execution items
5. Fill in assumptions explicitly when requirements are ambiguous.
6. Implement only after acceptance criteria are clear.
7. Before `git push`, confirm `npm run qlty`, `npm test`, and
   `npm run build` all pass.
8. Run any additional task-specific checks such as `npm run test:web`.
9. Summarize compatibility risks and follow-up work.

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
- Start implementation from a dedicated git branch, not directly on `main`.
- Do not `git push` until `npm run qlty`, `npm test`, and `npm run build`
  have all passed locally.

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
- [ ] `git push` happens only after local `npm run qlty`, `npm test`, and
      `npm run build` pass
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

Reuse shared raw unit-parameter lookup helpers in normalized layout mapping so
parent `el` lookup is not reimplemented inline.

### Why

After extracting raw unit-parameter lookup helpers, normalized layout mapping
still filters parent `el` parameters directly. Switching that last call site to
the shared helper keeps raw parameter walking in one place.

### Scope

- switch normalized layout lookup to `findUnitParameterValues(...)`
- update normalize planning docs for the completed sub-slice
- keep the existing layout behavior unchanged

### Non-Goals

- introducing a new layout helper
- changing layout coordinate parsing or fallback behavior

- changing parser output
- changing user-visible unit list, flow, or CSV behavior
- rewriting all remaining parameter semantics at once
- changing extension activation, diagnostics, or telemetry

### Constraints

- Keep desktop and browser builds working.
- Keep `domain` and `application` free of direct `vscode` imports.
- Preserve current parser, list, flow, CSV, diagnostics, hover, and telemetry
  behavior.

### Design

#### Use case

Shared wait-state helper reuse.

#### Layers affected

- domain: shared wait-state helper reuse across wrapper and normalized-model code
- docs: plan tracking for the extraction slice

#### Key decisions

- Keep wait detection behavior identical to existing wrapper and normalized
  behavior.
- Limit the slice to unifying the wait-state helper call path only.

### Acceptance Criteria

- [ ] shared wait-state helper accepts normalized-model inputs
- [ ] normalized-model wait detection delegates to the shared helper
- [ ] local quality, test, build, and web checks pass after implementation

### Test Plan

- add helper coverage for string-based wait-state resolution
- run quality checks
- run desktop tests
- run build
- run web tests

### Risks

- helper generalization could accidentally change wrapper wait detection
- normalized-model mapping could still keep a separate wait check if a call
  site is missed

### Rollback Plan

- restore the local normalized-model wait check if behavior changes
- keep broader wrapper-derived semantic moves separate from this extraction
  step
