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
- repeatable web-extension verification exists via `npm run test:web`.

### Next Priority Tasks

1. Refresh roadmap and feature task documents so completed slices and remaining
   debt are visible in one place.
2. Decide which wrapper-derived semantics belong in the normalized model versus
   staying in application view adapters.
3. Continue reducing activation and webview concentration without changing user
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

Bring SDD planning documents up to date and define the next cleanup slice
around residual `UnitEntity` dependencies.

### Why

The repository has already completed several vertical slices, but the roadmap
and per-feature task files still read like pre-implementation templates. That
makes the remaining migration work harder to prioritize and review.

### Scope

- update roadmap and feature task documents to reflect completed slices
- identify the highest-value remaining boundary problems
- define the next implementation slice around table and flow cleanup

### Non-Goals

- parser grammar changes
- UI behavior changes
- dependency updates
- `engines.vscode` changes

### Constraints

- Keep desktop and browser builds working.
- Keep `domain` and `application` free of direct `vscode` imports.
- Preserve current parser, list, flow, CSV, diagnostics, hover, and telemetry
  behavior.

### Design

#### Use case

Documentation alignment and next-slice planning.

#### Layers affected

- docs: roadmap, plans, and per-feature task tracking
- application: next slice expected around unit-list and flow DTO boundaries
- presentation: next slice expected around table and flow cleanup

#### Key decisions

- Treat unit-list, flow-graph, normalize, editor-feedback, telemetry, and
  unit-definition slices as completed and track only their remaining follow-up
  debt.
- Prioritize removal of residual `UnitEntity` dependencies before broader
  structural refactors.

### Acceptance Criteria

- [ ] roadmap reflects completed and upcoming slices
- [ ] feature task files distinguish completed work from remaining follow-up
- [ ] next implementation slice is explicit about boundary debt and validation

### Test Plan

- run build
- run desktop tests
- run web tests when the environment can complete them reliably

### Risks

- documentation can drift again if future slices are merged without updating
  task files
- flow and table cleanup can surface subtle wrapper-derived behavior
  differences

### Rollback Plan

- revert the documentation updates if they misrepresent repository state
- keep follow-up slices small so behavior regressions are easy to isolate
