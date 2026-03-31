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

1. update or create the relevant use-case spec in `docs/specs/use-cases/`
2. update `PLANS.md`
3. document assumptions explicitly
4. implement in small vertical slices
5. run the most relevant checks before finishing

## Document Roles

- `vision.md`: product purpose and values
- `glossary.md`: shared terms
- `context-map.md`: boundaries and external systems
- `architecture.md`: target layering and dependency direction
- `current-state.md`: present-day repository shape and tensions
- `roadmap.md`: preferred incremental extraction order
