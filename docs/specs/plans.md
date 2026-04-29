# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local details live under
`docs/specs/features/<feature>/`; repository-level behavior contracts live
under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- Parameter-reference alignment should proceed in small JP1/AJS v13 slices
  with explicit manual coverage. For each parameter category, verify value
  parsing against the official format before claiming the category aligned. A
  feature-local parameter coverage matrix now tracks the investigated
  categories without claiming repository-wide coverage. Schedule-rule
  `wc` / `wt` effective-value pairing is aligned in the domain boundary while
  unit-list projection remains raw.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Completed feature folders should be removed once their durable requirements
  are represented in `docs/requirements/use-cases/`, `docs/specs/roadmap.md`,
  or `docs/specs/architecture.md`.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Implement Slice-1 of build/test performance only after approval is recorded
   in `docs/specs/features/build-test-performance/TASKS.md`.
2. Continue category-level parameter parsing alignment by selecting the next
   focused behavior contract and recording approval before implementation.
3. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
4. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Current Branch Plan

- Branch: current docs-only SDD planning branch.
- Objective: keep the branch focused on build/test performance SDD while also
  pruning completed SDD feature folders whose durable requirements now live in
  use cases.
- Status: docs-only SDD drafting and cleanup in progress; implementation
  approval remains pending.
- Scope: document Slice-1 in detail; document Slices 2 through 8 at draft
  level; create the related use case, feature spec, feature plan, task list,
  prioritized roadmap, and remove completed feature-local logs after preserving
  useful requirement content in use cases.
- Out of scope: runtime code edits, test edits, generated parser edits,
  package-script edits, workflow edits, dependency updates, and implementation
  commits.
- Impact summary: future implementation will affect `package.json` scripts,
  `webpack.config.js`, `.github/workflows/verify.yml`, TypeScript output
  ownership, ANTLR generation behavior, and validation documentation.
  Completed feature folders for list, flow, CSV, normalization, editor
  feedback, telemetry, and unit definition are removed from active SDD tracking
  after their durable behavior contracts are kept in use cases. This docs-only
  task does not change extension behavior.
- Risks and assumptions: performance reductions are hypotheses until measured.
  Slice-1 is fixed as the first implementation target to avoid broad CI/build
  rewrites before command ownership is explicit. Feature-folder deletion is
  limited to completed folders with no active follow-up.

## Build/Test Performance SDD

- Feature docs:
  `docs/specs/features/build-test-performance/`
- Use case:
  `docs/requirements/use-cases/uc-improve-build-test-performance.md`
- First implementation slice:
  Slice-1, separate test execution from build preparation.
- Roadmap:
  Phase 1 covers Slice-1, Slice-2, and Slice-4; Phase 2 covers Slice-5 and
  Slice-7; Phase 3 covers Slice-3, Slice-6, and Slice-8.
- Required approval:
  `docs/specs/features/build-test-performance/TASKS.md` must record
  `Status: Approved` before any runtime, test, generated artifact,
  configuration, package-script, or workflow implementation starts.

## Active Feature Specs

- `docs/specs/features/build-test-performance/`:
  active SDD for staged validation performance work.
- `docs/specs/features/align-jp1-v13-parameter-and-command-reference/`:
  active JP1/AJS3 version 13 alignment records and coverage matrix.
- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.

Completed feature-local folders were removed after their durable behavior
contracts were compressed into `docs/requirements/use-cases/`.

## Branch Validation

- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when markdown
  structure or links need focused validation
- code changes: follow `docs/specs/README.md`

Current branch checks:

- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `pnpm run lint:md`
