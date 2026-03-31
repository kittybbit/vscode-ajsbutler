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

1. update or create the relevant use-case spec in `docs/requirements/use-cases/` and/or `docs/specs/features/<feature>/SPECS.md`
2. update or create corresponding plans in `docs/specs/features/<feature>/PLANS.md`
3. track execution tasks in `docs/specs/features/<feature>/TASKS.md`
4. document assumptions explicitly
5. implement in small vertical slices
6. run the most relevant checks before finishing

## Document Roles

- `vision.md`: product purpose and values
- `glossary.md`: shared terms
- `context-map.md`: boundaries and external systems
- `architecture.md`: target layering and dependency direction
- `current-state.md`: present-day repository shape and tensions
- `roadmap.md`: preferred incremental extraction order
