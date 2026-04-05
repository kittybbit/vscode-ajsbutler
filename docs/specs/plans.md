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

1. Refresh roadmap and feature task documents so completed slices and remaining
   debt are visible in one place.
2. Continue moving the remaining wrapper-derived parameter semantics that still
   require rule-aware defaults or typed wrapper interpretation out of
   `ParameterFactory` in small slices.
3. Document which remaining semantics should intentionally stay in application
   view adapters instead of the normalized model.
4. Continue reducing activation and webview concentration without changing user
   behavior or breaking web-extension support.

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

Move reusable parameter lookup and simple inheritance traversal from ad hoc
application code into the normalized AJS model.

### Why

`buildUnitListView` still repeated wrapper-era parameter traversal logic even
after table and flow viewers stopped reconstructing `UnitEntity`. Exposing that
lookup from the normalized model is a small slice that reduces duplication
before larger `ParameterFactory` cleanup.

### Scope

- add normalized helper functions for direct parameter lookup
- add normalized helper functions for repeated-value lookup
- add normalized helper functions for first-ancestor inherited lookup
- refactor `buildUnitListView` to consume those helpers
- update normalize docs and tests

### Non-Goals

- replacing `ParameterFactory` wholesale
- changing parser output
- changing user-visible unit list behavior
- changing extension activation, diagnostics, or telemetry

### Constraints

- Keep desktop and browser builds working.
- Keep `domain` and `application` free of direct `vscode` imports.
- Preserve current parser, list, flow, CSV, diagnostics, hover, and telemetry
  behavior.

### Design

#### Use case

Normalize AJS Document.

#### Layers affected

- domain: normalized AJS helper functions
- application: unit-list view mapping
- docs: normalize use case and feature tracking

#### Key decisions

- Put parameter lookup helpers on the normalized model instead of keeping
  application-local lookup helpers in each consumer.
- Limit inheritance support to first-ancestor lookup for this slice and leave
  rule-aware defaults in `ParameterFactory` for later work.

### Acceptance Criteria

- [ ] normalized helpers expose direct, repeated-value, and inherited parameter
      lookup
- [ ] `buildUnitListView` stops defining its own parameter lookup helpers
- [ ] normalize docs and tasks reflect the completed sub-slice

### Test Plan

- run quality checks
- run desktop tests
- run build

### Risks

- inherited lookup could diverge from wrapper semantics if ancestor order or
  first-hit behavior changes
- build-unit-list regressions could hide in priority and schedule field mapping

### Rollback Plan

- revert the helper extraction and return to application-local lookup functions
- keep deeper `ParameterFactory` cleanup in later isolated slices
