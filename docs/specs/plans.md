# PLANS.md

## Purpose

This is the branch-level SDD work plan. It records the feature folders active
on this branch and branch-wide decisions that apply across those features.
Feature-local slice tasks live in `docs/specs/features/<feature>/TASKS.md`;
repository-level behavior contracts live under `docs/requirements/use-cases/`.

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
2. Continue Qlty-driven architecture refactoring only when a candidate has
   meaningful responsibility, boundary, or use-case value.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Active Feature Specs

- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.
- `docs/specs/features/qlty-driven-architecture-refactoring/`:
  active maintainability-driven architectural refactoring. Current slice state
  lives in that feature's `TASKS.md`.

Completed feature-local folders should be removed after their durable behavior
contracts, active decisions, and unresolved risks have been moved to the
appropriate use cases, roadmap, or planning index.

## Branch Validation

- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  markdown structure or links need focused validation
- code changes: follow `docs/specs/README.md`
