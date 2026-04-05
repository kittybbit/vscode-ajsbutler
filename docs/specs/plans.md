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
- repeatable web-extension verification exists via `npm run test:web`.

### Next Priority Tasks

1. Continue moving the remaining wrapper-derived parameter semantics that still
   require typed wrapper interpretation or other unit-type-specific defaults
   out of `ParameterFactory` in small slices.
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

Extract a reusable optional-scalar builder so the simplest `ParameterFactory`
methods stop repeating `checkAndGet(...)` plus `new Xxx(...)` wiring.

### Why

`ParameterFactory` still contains many trivial scalar builders that differ only
by parameter name, default value, and wrapper constructor. A shared helper can
remove that boilerplate without changing behavior.

### Scope

- add a shared helper for optional scalar parameter building
- switch the simple optional scalar builders that only wrap one resolved
  parameter to the shared helper across `ParameterFactory`
- keep public parameter behavior unchanged while reducing repeated builder
  wiring
- add focused tests for the optional-scalar helper behavior

### Non-Goals

- changing parser output
- changing user-visible unit list, flow, or CSV behavior
- rewriting all parameter semantics at once
- changing inherited, root-jobnet, or rule-array parameter behavior
- changing extension activation, diagnostics, or telemetry

### Constraints

- Keep desktop and browser builds working.
- Keep `domain` and `application` free of direct `vscode` imports.
- Preserve current parser, list, flow, CSV, diagnostics, hover, and telemetry
  behavior.

### Design

#### Use case

Optional-scalar builder extraction.

#### Layers affected

- domain: optional-scalar helper usage
- docs: plan tracking for the extraction slice

#### Key decisions

- Keep semantic behavior identical and only centralize the simplest optional
  scalar builder wiring.
- Limit this slice to plain optional scalar methods and leave array,
  inherited, root-jobnet, and extra-argument builders untouched.

### Acceptance Criteria

- [ ] shared helper exists for optional scalar parameter building
- [ ] simple `ParameterFactory` scalar methods delegate to the helper
- [ ] focused tests cover optional-scalar helper behavior

### Test Plan

- run quality checks
- run desktop tests
- run build
- run web tests

### Risks

- helper extraction could accidentally change explicit-vs-default precedence
- the helper could be widened too far and obscure where more complex semantics
  should remain explicit

### Rollback Plan

- revert optional-scalar helper usage in the affected `ParameterFactory`
  methods
- keep broader wrapper-derived semantic moves separate from this extraction
  step
