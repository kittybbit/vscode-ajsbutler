# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local requirements and
task decisions live under `docs/specs/features/<feature>/`; repository-level
behavior contracts live under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- JP1/AJS3 version 13 is the current normative target for new parameter and
  command semantics.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded.
- Qlty-driven architecture refactoring uses Qlty findings as candidate signals
  for behavior-preserving refactors. A candidate should improve a meaningful
  responsibility or boundary concern; shape-only cleanup is not enough by
  itself.
- Feature `SPECS.md` files carry feature requirements. Feature `TASKS.md`
  files carry only current task state and the minimum record needed to decide
  whether behavior must be reflected back into use cases.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
2. Select the next Qlty-driven architecture refactoring candidate only if it
   has meaningful responsibility, boundary, or use-case value.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Active Feature Specs

- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.
- `docs/specs/features/qlty-driven-architecture-refactoring/`:
  active maintainability-driven architectural refactoring. Slice-1, Slice-2,
  Slice-3, Slice-4-A, Slice-4-B, Slice-4-C, and Slice-4-D completed
  behavior-preserving refactors and currently require no use-case updates.

Completed feature-local folders should be removed after their durable behavior
contracts, active decisions, and unresolved risks have been moved to the
appropriate use cases, roadmap, or planning index.

## Branch Validation

- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  markdown structure or links need focused validation
- code changes: follow `docs/specs/README.md`
