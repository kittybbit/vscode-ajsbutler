# PLANS.md

## Purpose

This is the branch-level SDD work plan. It records the feature folders active on
this branch and branch-wide decisions that apply across those features.
Feature-local slice tasks live in `docs/specs/features/<feature>/TASKS.md`;
repository-level behavior contracts live under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- Temporary qlty parity work against `v1.15.1` is closed. Broad upstream qlty
  smell comparison reports no smells after the final unit-type i18n resource
  slice; remaining metrics deltas are not currently tied to a concrete
  responsibility, boundary, compatibility, or user-visible regression.
- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- JP1/AJS3 version 13 is the current normative target for new parameter and
  command semantics.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded.
- Qlty findings remain candidate signals for future behavior-preserving
  refactors, but completed qlty-driven cleanup no longer has an active feature
  folder. A new feature should be opened only when a finding maps to a
  meaningful responsibility or boundary concern.
- Feature `SPECS.md` files carry feature requirements. Feature `TASKS.md` files
  carry implementation-slice plans, approval state, validation, risk, and
  feature exit readiness. Feature `TRACEABILITY.md` files carry
  requirement-to-validation mapping when required.
- Desktop and web compatibility must stay explicit whenever bootstrap, preview,
  parsing, shared adapters, or runtime behavior change.
- `semantic-diff` is a roadmap feature for semantic JP1/AJS3
  job-group comparison; implementation must start with reviewed slice planning
  before runtime code, tests, generated artifacts, or configuration change.

## Next Priority Tasks

1. Keep WebAPI import beta feedback and real-environment smoke evidence tracked
   when a real JP1/AJS3 WebAPI environment or evidence becomes available.
2. Keep compatibility risk visible for every shared or extension-runtime change.
3. Review `semantic-diff` with `sdd-review-plan`, then obtain human
   approval before any implementation slice starts.

## Active Feature Specs

- `docs/specs/features/import-definition-via-webapi/`: active beta feature with
  real-environment smoke verification still pending.
- `docs/specs/features/semantic-diff/`: roadmap feature intake for
  semantic JP1/AJS3 job-group comparison; implementation-slice plan is ready
  for review.

Completed feature-local folders should be removed after their durable behavior
contracts, active decisions, and unresolved risks have been moved to the
appropriate use cases, roadmap, or planning index.

## Branch Validation

- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  markdown structure or links need focused validation
- code changes: follow `docs/specs/README.md`
