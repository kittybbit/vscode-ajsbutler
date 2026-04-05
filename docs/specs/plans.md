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
- repeatable web-extension verification exists via `npm run test:web`.

### Next Priority Tasks

1. Continue moving the remaining wrapper-derived parameter semantics that still
   require rule-aware defaults or typed wrapper interpretation out of
   `ParameterFactory` in small slices.
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

Centralize root-jobnet-specific parameter defaults so the remaining
wrapper-derived semantics stop being split across `N` and `ParameterFactory`.

### Why

Root-jobnet defaults currently live in two places: `ParameterFactory` decides
them for `rg` and `sd`, while `N` decides them for `ncl`, `ncs`, and `ncex`.
That split makes the remaining semantic cleanup harder to reason about.

### Scope

- centralize root-jobnet default raw values behind one helper
- switch `ParameterFactory` root-jobnet defaults to the shared helper
- switch `N` connector default behavior to the shared helper
- add focused tests for the centralized default behavior

### Non-Goals

- changing parser output
- changing user-visible unit list, flow, or CSV behavior
- rewriting all parameter semantics at once
- changing non-root-jobnet defaults
- changing extension activation, diagnostics, or telemetry

### Constraints

- Keep desktop and browser builds working.
- Keep `domain` and `application` free of direct `vscode` imports.
- Preserve current parser, list, flow, CSV, diagnostics, hover, and telemetry
  behavior.

### Design

#### Use case

Root-jobnet parameter default consolidation.

#### Layers affected

- domain: root-jobnet default helper usage
- docs: plan tracking for the consolidation slice

#### Key decisions

- Keep semantic behavior identical and only centralize where the default values
  are decided.
- Limit this slice to root-jobnet defaults and leave broader rule-aware
  semantics for later work.

### Acceptance Criteria

- [ ] root-jobnet defaults for `rg`, `sd`, `ncl`, `ncs`, and `ncex` are
      decided in one helper
- [ ] `ParameterFactory` and `N` delegate to the shared root-jobnet helper
- [ ] focused tests cover the centralized default behavior

### Test Plan

- run quality checks
- run desktop tests
- run build
- run web tests

### Risks

- centralized defaults could accidentally change root-vs-non-root behavior
- inherited `rg` behavior could accidentally change if root defaults move in
  the wrong order

### Rollback Plan

- revert the centralized-default helper usage in `N` and `ParameterFactory`
- keep broader rule-aware semantic moves separate from this consolidation step
