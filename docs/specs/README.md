# SDD Overview

This directory is the entry point for Specification-Driven Development in this repository.

## Goals

- keep behavior stable while refactoring incrementally
- make use cases explicit before structural changes
- preserve desktop and web extension compatibility
- support migration toward clearer domain, application, infrastructure, and presentation boundaries

## Recommended Reading Order

1. [Vision](./vision.md)
2. [Glossary](./glossary.md)
3. [Context Map](./context-map.md)
4. [Architecture](./architecture.md)
5. [Current State](./current-state.md)
6. [Roadmap](./roadmap.md)

## Working Agreement

For non-trivial changes:

1. create a dedicated git branch before implementation work starts
2. update or create the relevant use-case spec in `docs/requirements/use-cases/` and/or `docs/specs/features/<feature>/SPECS.md`
3. update or create corresponding plans in `docs/specs/features/<feature>/PLANS.md`
4. track execution tasks in `docs/specs/features/<feature>/TASKS.md`
5. document assumptions explicitly
6. implement in small vertical slices
7. before `git push`, confirm `npm run qlty`, `npm test`, and `npm run build` all pass
8. run any additional task-specific checks before finishing

## Document Roles

- `vision.md`: product purpose and values
- `glossary.md`: shared terms
- `context-map.md`: boundaries and external systems
- `architecture.md`: target layering and dependency direction
- `current-state.md`: present-day repository shape and tensions
- `roadmap.md`: preferred incremental extraction order
