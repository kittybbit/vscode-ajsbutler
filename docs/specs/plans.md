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

1. Implement Slice-2 of build/test performance only after approval is recorded
   in `docs/specs/features/build-test-performance/TASKS.md`.
2. Continue category-level parameter parsing alignment by selecting the next
   focused behavior contract and recording approval before implementation.
3. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
4. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Current Branch Plan

- Branch: `codex/build-test-performance`.
- Objective: complete the build/test performance feature in one PR-sized
  feature branch by repeating SDD investigation, approval, implementation,
  validation, push, and CI review per slice.
- Status: Slice-1 is implemented and pushed in draft PR #222. CI completed
  successfully per human confirmation. Slice-2 manual ANTLR generation is
  implemented locally and pending push/CI review.
- Scope: keep changes focused on validation performance command ownership,
  ANTLR generation freshness, webpack development speed, type-check ownership,
  CI rebuild reduction, and cache behavior as described by the feature docs.
- Out of scope: product behavior changes, parser grammar changes, generated
  parser semantic changes, dependency modernization unrelated to validation
  performance, and raising `engines.vscode`.
- Impact summary: Slice-2 affects `package.json` scripts and contributor
  documentation; it preserves `src/antlr/*.g4`, `src/generate/parser`, parser
  imports, desktop tests, web tests, and production build behavior.
- Risks and assumptions: performance reductions are hypotheses until measured.
  Slice-2 stale-output risk is controlled by explicit contributor
  responsibility and parser-dependent validation rather than hidden build
  metadata.

## Build/Test Performance SDD

- Feature docs:
  `docs/specs/features/build-test-performance/`
- Use case:
  `docs/requirements/use-cases/uc-improve-build-test-performance.md`
- Completed implementation slice:
  Slice-1, separate test execution from build preparation.
- Next implementation slice:
  Slice-2, manual ANTLR generation.
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
