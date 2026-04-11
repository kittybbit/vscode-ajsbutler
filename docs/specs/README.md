# SDD Overview

This directory is the entry point for Specification-Driven Development in this
repository.

## Goals

- keep behavior stable while refactoring incrementally
- make use cases explicit before structural changes
- preserve desktop and web extension compatibility
- support migration toward clearer domain, application, infrastructure, and
  presentation boundaries

## Recommended Reading Order

1. [Vision](./vision.md)
2. [Glossary](./glossary.md)
3. [Context Map](./context-map.md)
4. [Architecture](./architecture.md)
5. [Current State](./current-state.md)
6. [Roadmap](./roadmap.md)
7. [Requirements Use Cases](../requirements/use-cases/README.md)

## Working Agreement

For non-trivial changes:

1. create a dedicated git branch before implementation work starts
2. update or create the relevant use-case spec in
   `docs/requirements/use-cases/` and/or
   `docs/specs/features/<feature>/SPECS.md`
3. update or create corresponding plans in
   `docs/specs/features/<feature>/PLANS.md`
4. track execution tasks in `docs/specs/features/<feature>/TASKS.md`
   and update that file in the same commit whenever a task is completed,
   reframed, or dropped
5. document assumptions explicitly
6. implement in small vertical slices
7. refresh `docs/specs/plans.md` in the same commit if the active slice or
   branch priorities change materially
8. refresh `docs/specs/roadmap.md` in the same commit if a completed slice
   changes repository-level ordering, remaining debt, or deferred work
9. before `git push`, run local validation serially in this order for code
   changes: `npm run qlty`, `npm test`, `npm run test:web`, `npm run build`
10. run any additional task-specific checks before finishing
11. avoid anemic domain models: extract only cross-unit or cross-layer
    semantics into helpers/interfaces, and keep entity identity plus
    unit-local behavior in the entity when that behavior is part of the
    JP1/AJS concept itself

For docs-only changes:

- `npm run build` is not required
- prefer markdown-focused validation such as `npm run lint:md`
- `npm run qlty` is still recommended when docs formatting or repository-wide
  quality rules may be affected
- repository `Verify` workflow should not be relied on as a required gate

## When To Use `docs/requirements/use-cases/`

Use `docs/requirements/use-cases/` for repository-level behavior contracts.
These files should remain meaningful even if modules, adapters, or file layout
change.

Good fit:

- application use cases such as build list, build flow graph, normalize
  document, export CSV, or show definition
- cross-feature behavior that multiple implementations or adapters rely on

Poor fit:

- branch task sequencing
- implementation notes tied to the current refactor
- file-by-file execution checklists

Those belong under `docs/specs/`.

## Sync Cadence

Treat the following docs as required sync artifacts, not optional catch-up
notes:

- `docs/specs/features/<feature>/TASKS.md`
  Update immediately when one task or follow-up is completed, re-scoped, or
  intentionally dropped.
- `docs/specs/plans.md`
  Update when that task completion changes the branch summary or next priority.
- `docs/specs/roadmap.md`
  Update when that completion changes repository-level sequence, remaining
  debt, or deferred work.

Prefer the smallest useful cadence:
one completed task or one resolved follow-up is enough reason to sync the
docs in the same commit.

## Document Roles

- `vision.md`: product purpose and values
- `glossary.md`: shared terms
- `context-map.md`: boundaries and external systems
- `architecture.md`: target layering and dependency direction
- `current-state.md`: present-day repository shape and tensions
- `roadmap.md`: preferred incremental extraction order
