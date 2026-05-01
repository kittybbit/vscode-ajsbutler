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
  `wc` / `wt` effective-value pairing is aligned in the domain boundary and
  unit-list projection.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Completed feature folders should be removed once their durable requirements
  are represented in `docs/requirements/use-cases/`, `docs/specs/roadmap.md`,
  or `docs/specs/architecture.md`.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Prepare QUEUE job unit-list group 15 projection as the next focused
   parameter-alignment behavior contract, then record approval before
   implementation.
2. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Current Branch Plan

- Branch: `codex/queue-group15-projection`.
- Objective: continue the JP1/AJS3 v13 parameter alignment feature with a
  focused implementation of QUEUE job group 15 transfer-file projection.
- Status: execution-interval control job defaults are merged in PR #226. The
  current slice is approved and implemented locally.
- Scope: hide `top1` to `top4` transfer-operation projection on QUEUE jobs
  (`qj` / `rq`) while preserving explicit `ts1` to `ts4` and `td1` to `td4`
  projection.
- Out of scope: parser grammar changes, command generation, diagnostics,
  generated artifacts, dependency changes, `engines.vscode`, byte-length
  validation, macro-variable validation, invalid-combination diagnostics, and
  broader raw projection policy changes.
- Impact summary: the candidate affects
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  `src/application/unit-list/buildUnitListView.ts` DTO fields only if helper
  typing requires it, focused unit-list regression tests, and the QUEUE job
  SDD documents. Existing `Qj` / `Rq` wrapper behavior already avoids `topN`;
  the approval-sensitive boundary is user-visible group 15 projection.
- Risks and assumptions: behavior changes are user-visible in the table viewer
  because raw `topN` values on QUEUE jobs would no longer appear in group 15
  transfer-operation columns. Raw parser output and normalized parameter
  storage remain preserved.

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
  slice: QUEUE job unit-list group 15 unit-type-aware projection.
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
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-05-01: `pnpm run test:compile`
- 2026-05-01: `npm test`
- 2026-05-01: `pnpm run qlty`
- 2026-05-01: `npm run test:web` completed with exit code 0 and existing
  localhost dev-extension `package.nls.json` 404 noise
- 2026-05-01: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run test:compile`
- 2026-05-01: `npm test`
- 2026-05-01: `pnpm run qlty`
- 2026-05-01: `npm run test:web` completed with exit code 0 and existing
  localhost dev-extension `package.nls.json` 404 noise
- 2026-05-01: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-05-01: `pnpm run test:compile`
- 2026-05-01: `pnpm run qlty`
- 2026-05-01: `npm test`
- 2026-05-01: `npm run test:web` completed with exit code 0 and shutdown-time
  `ECONNRESET` / premature-close noise
- 2026-05-01: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `pnpm run test:compile`
- 2026-04-29: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-04-29: `npm test`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run lint:md`
