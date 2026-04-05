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
- repeatable web-extension verification exists via `npm run test:web`.

### Next Priority Tasks

1. Continue moving the remaining wrapper-derived parameter semantics that still
   require typed wrapper interpretation or other unit-type-specific defaults
   out of `ParameterFactory` in small slices, with priority on any helpers
   still coupled to wrapper-specific `params(...)` calls.
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

Identify the next small slice of wrapper-derived parameter semantics that can
move out of `ParameterFactory` after removal of the final private
`#checkAndGet` wrappers.

### Why

The factory now uses shared helper entry points consistently for simple lookup
paths. The next value comes from targeting the remaining behavior that still
depends on wrapper-specific interpretation or type-local defaults.

### Scope

- inspect the remaining `ParameterFactory` methods that still depend on
  wrapper-local `params(...)` interpretation
- choose one small, behavior-preserving extraction slice
- update specs before implementing that next slice

### Non-Goals

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

Plan the next parameter-helper extraction slice.

#### Layers affected

- domain: identify the next extraction target
- docs: plan tracking for the next slice

#### Key decisions

- Keep slices behavior-preserving and small enough to review.
- Prefer extracting semantics that can be tested outside `ParameterFactory`.

### Acceptance Criteria

- [ ] the next extraction target is explicitly identified
- [ ] scope stays within one small behavior-preserving slice
- [ ] local quality, test, build, and web checks pass after implementation

### Test Plan

- inspect remaining wrapper-derived parameter methods
- choose the next slice
- run quality checks
- run desktop tests
- run build
- run web tests

### Risks

- the remaining methods may look similar while hiding different defaulting
  rules
- a too-large slice could blur review boundaries

### Rollback Plan

- restore the private wrapper methods and the two direct call sites if behavior
  changes
- keep broader wrapper-derived semantic moves separate from this extraction
  step
