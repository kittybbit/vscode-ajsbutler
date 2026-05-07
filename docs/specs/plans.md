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
- Remaining JP1/AJS v13 parameter-alignment gaps should be grouped by
  user-meaningful job type or parameter family where practical, instead of
  returning to single-parameter micro-slices once a family has shared seams
  and shared regression evidence.
- After the delivered grouped event-host validation for `evhst`, the next
  recommended JP1/AJS v13 slice stayed inside the already-modeled job
  end-judgment family and tackled threshold ordering for explicit `wth` /
  `tho` pairs before expanding to broader new parameter families.
- After the delivered grouped job end-judgment threshold-ordering slice, the
  next recommended JP1/AJS v13 candidate should again be selected from the
  remaining partial or deferred gaps using the same user-meaningful grouping
  rule.
- JP1/AJS v13 parameter alignment remains the active implementation priority
  until the documented diagnostics, validation, and category-level coverage
  gaps are either completed or explicitly re-scoped.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Qlty-driven architecture refactoring remains active but is deferred until
  JP1/AJS v13 parameter alignment is completed or an explicit priority override
  is recorded here.
- Completed feature folders should be removed once their durable requirements
  are represented in `docs/requirements/use-cases/`, `docs/specs/roadmap.md`,
  or `docs/specs/architecture.md`.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Request approval for the next grouped JP1/AJS3 v13 parameter-alignment
   slice selected from the remaining partial or deferred gaps after the
   delivered job end-judgment threshold-ordering diagnostics, keeping the
   grouping by job type or parameter family.
2. Continue JP1/AJS v13 parameter-alignment slices until the feature-local
   coverage matrix no longer has actionable `Partial` or `Deferred` gaps, or
   until a gap is explicitly re-scoped as outside the alignment feature.
3. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
4. Keep compatibility risk visible for every shared or extension-runtime
   change.
5. Defer Qlty-driven architecture refactoring Phase 0 until JP1/AJS v13
   parameter alignment is complete or this plan records an explicit override.

## Current Branch Plan

- Branch: `codex/job-end-threshold-ordering`
- Objective: continue JP1/AJS v13 parameter alignment with a user-meaningful
  grouped slice around job end-judgment threshold-ordering diagnostics for
  UNIX/PC jobs and UNIX/PC custom jobs, rather than opening a broader new job
  family before closing the remaining focused follow-up in the existing
  end-judgment diagnostics seam.
- Status: implemented and validated on `codex/job-end-threshold-ordering`.
- Scope: add focused semantic diagnostics through the existing
  editor-feedback boundary when explicit `wth` / `tho` pairs do not preserve
  the documented warning-to-abnormal threshold ordering, while preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation.
- Out of scope: parser grammar changes, domain default changes, numeric range
  diagnostics already delivered, retry-parameter diagnostics already
  delivered, generated artifacts, dependency changes, `engines.vscode`, and
  non-end-judgment parameter validation.
- Impact summary: the next slice is expected to affect
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`, focused
  job-end-judgment diagnostics tests, the job-end-judgment alignment record,
  the coverage matrix, and the editor-feedback behavior contract if the new
  diagnostics are approved.
- Risks and assumptions: the official JP1/AJS3 v13 end-judgment description is
  interpreted to require a warning threshold below the abnormal threshold so
  that normal, warning, and abnormal outcomes remain distinguishable. If
  implementation investigation finds product behavior that permits an edge
  case such as equal thresholds, stop and re-approve before broadening or
  changing the rule.
- Alternatives considered: switch to a different job type first, viable but
  deferred because job end judgment already has an established diagnostics seam
  and one coherent remaining follow-up; move directly to broader event or
  transfer-parameter validation, rejected for now because that increases scope
  before this narrower family-level gap is closed.

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
  slice: grouped job end-judgment threshold-ordering diagnostics for explicit
  `wth` / `tho` pairs on UNIX/PC jobs and UNIX/PC custom jobs is implemented
  and validated; the next candidate should be selected from the remaining
  partial/deferred gaps using the same user-meaningful grouping rule.
- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.
- `docs/specs/features/qlty-driven-architecture-refactoring/`:
  active maintainability-driven architectural refactoring based on Qlty
  complexity, duplication, and code-smell findings; deferred until JP1/AJS v13
  parameter alignment is complete or explicitly re-prioritized.

Completed feature-local folders were removed after their durable behavior
contracts were compressed into `docs/requirements/use-cases/`.

## Branch Validation

- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when markdown
  structure or links need focused validation
- code changes: follow `docs/specs/README.md`
