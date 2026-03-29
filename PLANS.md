# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before implementation.

## Default Workflow

1. Read the relevant documents in `docs/sdd/`.
2. Update or create the related use-case spec in `docs/use-cases/`.
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

Extract the first clean-architecture unit-list use case without changing table behavior.

### Why

The table viewer currently depends on parser invocation and serialization flow that bypass a clear application boundary.

### Scope

- add an application use case for unit-list document generation
- update the table viewer message path to use the new use case
- keep flow viewer behavior unchanged in this slice
- add or update tests for the use case
- update `docs/sdd/architecture.md`
- update `PLANS.md`

### Non-Goals

- parser changes
- UI behavior changes
- dependency updates
- `engines.vscode` changes
- flow viewer refactor

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not expose parser internals in UI-facing DTOs.

### Design

#### Use case

Build unit list extraction.

#### Layers affected

- domain: reused
- application: added
- infrastructure: updated
- presentation: updated
- docs: updated

#### Key decisions

- Introduce an application DTO built from normalized `Unit` values rather than parser internals.
- Change only the table viewer path in this slice to keep the refactor reviewable.

### Acceptance Criteria

- [ ] application use case exists for unit-list generation
- [ ] table viewer consumes the new DTO path
- [ ] parser internals are not exposed in the UI-facing DTO
- [ ] relevant tests pass
- [ ] runtime source files remain unchanged

### Test Plan

- run build
- run relevant tests
- inspect diff for the intended slice only

### Risks

- DTO conversion can drift from existing table assumptions if behavior coverage is thin
- browser-hosted extension behavior still depends on existing webview and save-dialog constraints

### Rollback Plan

- revert the table viewer adapter to the previous message path
- fall back to the existing shared document change helpers if regressions appear
