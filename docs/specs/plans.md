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

1. Continue category-level parameter parsing alignment by selecting the next
   focused behavior contract and recording approval before implementation.
2. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Current Branch Plan

- Branch: not created for implementation while approval is pending.
- Objective: continue the JP1/AJS3 v13 parameter alignment feature with a
  focused unit-list projection slice for schedule-rule `wc` / `wt` effective
  start-condition monitoring values.
- Status: build/test performance PR #222 is merged with successful CI. The
  current slice implements unit-list group 10 projection for the already
  implemented domain effective `wc` / `wt` pairing.
- Scope: update SDD records and request approval for changing unit-list
  projection from raw independent `wc` / `wt` values to paired effective values
  for the group 10 start-condition columns.
- Out of scope: parser grammar changes, command generation, diagnostics,
  generated artifacts, dependency changes, `engines.vscode`, and broader
  schedule-rule range validation.
- Impact summary: the candidate affects
  `src/application/unit-list/buildUnitListGroup10View.ts`,
  `src/application/unit-list/unitListViewHelpers.ts`, group 10 unit-list
  regression tests, and the schedule-rule SDD documents.
- Risks and assumptions: behavior changes are user-visible in the table viewer
  because paired values such as `wc=4` with `wt=no` would display as empty
  effective start-condition monitoring values instead of raw independent
  values. Raw parameter parsing and domain wrapper raw values remain preserved.

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
  none; PR #222 is merged and Slice-6 is deferred as future cleanup.
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
  active JP1/AJS3 version 13 alignment records and coverage matrix. Current
  slice: unit-list group 10 projection for effective schedule-rule `wc` /
  `wt` pairing.
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
- 2026-04-29: `pnpm run test:compile`
- 2026-04-29: `npm test`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run lint:md`
- 2026-04-29: `pnpm run qlty`
