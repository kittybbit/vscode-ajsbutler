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

Analyze repository boundaries and document the first clean-architecture slice without refactoring code.

### Why

The repository already mixes parser, VS Code, and webview responsibilities, and the next refactoring step needs an explicit architectural readout before implementation work starts.

### Scope

- inspect parser-related modules
- inspect VS Code-facing modules
- inspect shared desktop/web extension entry points
- update `docs/sdd/architecture.md`
- record a short no-refactor plan in `PLANS.md`

### Non-Goals

- parser changes
- UI behavior changes
- moving files
- dependency updates
- `engines.vscode` changes

### Constraints

- Keep runtime behavior unchanged.
- Do not alter desktop or web extension execution paths.
- Do not refactor in this task.

### Design

#### Use case

Architectural analysis for the next specification-driven vertical slice.

#### Layers affected

- domain: none
- application: none
- infrastructure: none
- presentation: none
- docs: updated

#### Key decisions

- Treat parser orchestration returning `Unit[]` as the strongest current extraction seam.
- Recommend `Build Unit List` as the first vertical slice instead of starting with a broader parser rewrite.

### Acceptance Criteria

- [ ] parser boundaries are identified
- [ ] VS Code API boundaries are identified
- [ ] web extension risks are documented
- [ ] first vertical slice is named with rationale
- [ ] runtime source files remain unchanged

### Test Plan

- inspect referenced modules and entry points
- inspect diff to confirm documentation-only changes

### Risks

- architectural observations may become stale as the repository evolves
- undocumented edge cases may remain in browser-hosted extension execution

### Rollback Plan

- revert documentation-only edits
- re-run analysis when the next refactoring task starts
