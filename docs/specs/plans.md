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

1. Continue build/test performance after Slice-8 CI feedback is reviewed,
   selecting any remaining follow-up only after updating the feature SDD and
   recording approval.
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
- Status: Slice-1, Slice-2, Slice-3, Slice-4, Slice-5, and Slice-7 are
  implemented in draft PR #222. CI completed successfully through Slice-7 per
  human confirmation, and Slice-3 CI also completed successfully per human
  confirmation. Slice-8 Playwright browser cache completed successfully with
  cache-miss and cache-hit CI evidence per human confirmation.
- Scope: keep changes focused on validation performance command ownership,
  ANTLR generation freshness, webpack development speed, type-check ownership,
  CI rebuild reduction, and cache behavior as described by the feature docs.
- Out of scope: product behavior changes, parser grammar changes, generated
  parser semantic changes, dependency modernization unrelated to validation
  performance, and raising `engines.vscode`.
- Impact summary: Slice-8 affects `.github/workflows/verify.yml` only, adding
  a conservative Playwright browser cache while preserving pnpm dependency
  caching and the existing Playwright install command.
- Risks and assumptions: performance reductions are hypotheses until measured.
  Slice-8 cache risk is controlled by keeping cache misses first-class and
  deferring VS Code test binary caching until the VS Code binary version input
  is explicit.

## Build/Test Performance SDD

- Feature docs:
  `docs/specs/features/build-test-performance/`
- Use case:
  `docs/requirements/use-cases/uc-improve-build-test-performance.md`
- Completed implementation slices:
  Slice-1, separate test execution from build preparation; Slice-2, manual
  ANTLR generation; Slice-3, split webpack targets; Slice-4, development build
  optimization; Slice-5, type-check responsibility; Slice-7, CI rebuild
  reduction; Slice-8, Playwright browser cache.
- Next implementation slice:
  none selected.
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
