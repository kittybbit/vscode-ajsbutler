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

Create SDD and planning scaffolding plus repo-local Codex skills without changing runtime behavior.

### Why

The repository already references SDD and incremental architectural migration, but the supporting docs and local agent workflow need a clearer default shape.

### Scope

- `docs/sdd/` scaffolding and navigation
- `docs/use-cases/` template support
- `PLANS.md` planning template
- `.codex/skills/` additions for SDD and planning work

### Non-Goals

- parser changes
- UI behavior changes
- dependency updates
- `engines.vscode` changes

### Constraints

- Keep `package.json` runtime behavior unchanged.
- Do not alter desktop or web extension execution paths.
- Keep all additions documentation-only.

### Design

#### Use case

Repository scaffolding for specification-driven changes.

#### Layers affected

- domain: none
- application: none
- infrastructure: none
- presentation: none
- docs/tooling guidance: updated

#### Key decisions

- Add index/template documents instead of broad rewrites of existing specs.
- Add small repo-local skills that mirror the existing simple skill format.

### Acceptance Criteria

- [ ] build impact is none or verified safe
- [ ] runtime source files remain unchanged
- [ ] docs provide an obvious SDD entry point
- [ ] plan template is reusable for future tasks
- [ ] local skills support SDD and plan-oriented work

### Test Plan

- inspect diff to confirm documentation-only changes
- run relevant quality check if documentation tooling is affected

### Risks

- new scaffolding can drift if future changes do not keep docs updated
- additional skills may overlap unless their purposes stay narrowly defined

### Rollback Plan

- remove the added scaffolding files
- revert documentation-only edits
