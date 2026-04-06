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
- normalized-model mapping now reuses the shared unit-relation parsing helper
  so wrapper and normalized-model `ar` interpretation fully share the same
  source, target, and relation parsing rule.
- normalized-model mapping now reuses shared raw unit-parameter lookup helpers
  so simple key/value filtering no longer lives only inside normalization.
- normalized-model layout mapping now reuses shared raw unit-parameter lookup
  helpers so parent `el` lookup no longer filters parameters inline.
- normalized-model relation mapping now reuses shared relation-type
  normalization helpers so relation-type coercion no longer lives only inside
  normalization.
- normalized-model mapping now reuses shared normalize-unit helpers so
  type/group/comment/layout/root-jobnet/schedule/wait derivation no longer
  lives only inside `normalizeAjsDocument.ts`.
- normalized-model mapping now reuses shared normalize-relation helpers so
  `ar` relation parsing, child resolution, and warning generation no longer
  live only inside `normalizeAjsDocument.ts`.
- normalized-model mapping now reuses shared normalize-warning helpers so
  warning payload construction no longer lives inline in unit and relation
  normalization helpers.
- normalized-model mapping now reuses a shared normalize-unit builder so
  `AjsUnit` DTO assembly no longer lives inline in `normalizeAjsDocument.ts`.
- normalized-model mapping now reuses a shared normalize-document-tree helper
  so recursive unit traversal no longer lives inline in
  `normalizeAjsDocument.ts`.
- normalized-model relation warnings now use relation terminology so warning
  codes and messages align with the normalized relation model.
- normalized-model helper modules now live under `src/domain/models/ajs/normalize/`
  so unit, relation, warning, builder, and tree concerns share a single
  location and naming scheme.
- wait-capable wrapper units now reuse structural wait-state helpers through
  `UnitEntity` subclasses so `hasWaitedFor` behavior no longer requires a
  dedicated inheritance layer across each `eun`-aware subclass, while
  `hasSchedule` remains local to `N` because no other wrapper shares that
  concept.
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

Evaluate remaining wrapper-derived semantics and prefer composition-oriented
patterns when inheritance would create an unstable class hierarchy.

### Why

JP1/AJS wrapper behavior can overlap in ways that TypeScript single
inheritance does not model cleanly. Future slices should avoid stacking base
classes when interface-plus-helper composition would stay clearer.

### Scope

- review remaining wrapper duplication with a bias toward composition
- avoid adding new inheritance layers unless they model a stable unit family
- replace behavior-only wrapper bases with interface-plus-helper composition
  when JP1/AJS semantics overlap across unrelated unit families
- document the selection rule for future slices

### Non-Goals

- changing normalized-model priority behavior
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

Wrapper semantic selection guidelines.

#### Layers affected

- domain: no new wrapper extraction until the next target is justified
- docs: plan tracking for the selection rule

#### Key decisions

- Prefer interface-plus-helper composition over new inheritance layers when
  JP1/AJS semantics may need to combine across multiple unit families.
- Keep existing helper-based `priority` delegation as-is for now.

### Acceptance Criteria

- [ ] no new inheritance layer is introduced without a stable semantic family
- [ ] wrapper behavior remains unchanged
- [ ] local quality, test, build, and web checks pass after implementation

### Test Plan

- run quality checks
- run quality checks
- run desktop tests
- run build
- run web tests

### Risks

- future slices may still overuse inheritance if the rule is not explicit
- deferring extraction may leave some low-value duplication in place

### Rollback Plan

- revisit the selection rule if a future slice shows composition is insufficient
- keep broader wrapper-derived semantic moves separate from this slice
