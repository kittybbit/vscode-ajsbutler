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
   slice: job end-judgment numeric range diagnostics for `wth`, `tho`, `rjs`,
   `rje`, `rec`, and `rei` on UNIX/PC jobs and UNIX/PC custom jobs.
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

- Branch: `codex/job-end-judgment-range-diagnostics`
- Objective: continue JP1/AJS v13 parameter alignment with a user-meaningful
  grouped slice around job end-judgment numeric ranges for UNIX/PC jobs and
  UNIX/PC custom jobs, instead of returning to one-parameter micro-slices.
- Status: approved, implemented, and validated on
  `codex/job-end-judgment-range-diagnostics`.
- Scope: add application-level semantic diagnostics for explicit `j` / `cj`
  parameters where `wth` or `tho` is outside `0..2147483647`, `rjs` or `rje`
  is outside `1..4294967295`, `rec` is outside `1..12`, or `rei` is outside
  `1..10`; preserve raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, and command generation.
- Out of scope: parser grammar changes, raw parser/domain/normalized value
  changes, unit-list projection changes, flow projection changes, command
  generation changes, generated artifacts, dependency changes,
  `engines.vscode`, retry threshold ordering, byte-length validation, and
  broad parameter validation.
- Impact summary: the slice would affect
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`, focused
  `buildSyntaxDiagnostics` tests, the existing VS Code diagnostics adapter
  through DTO mapping, the job end-judgment alignment record, and the
  editor-feedback use-case contract.
- Risks and assumptions: the change would be user-visible in desktop and web
  diagnostics for syntactically valid documents. Existing parsed parameter
  source-location metadata should be enough to point at explicit `wth`, `tho`,
  `rjs`, `rje`, `rec`, and `rei`, so no parser or DTO shape change is
  expected. Omitted values remain non-diagnostic. Raw values remain
  inspectable by downstream consumers, and the existing unit-list raw
  projection evidence should stay unchanged outside diagnostics.
- Alternatives considered: keep invalid numeric values silent and leave the
  gap visible; move these validations into domain wrappers, rejected for this
  slice because current diagnostics policy keeps raw manual-invalid values
  inspectable; include retry threshold ordering now, deferred because it adds
  cross-parameter rule coupling beyond a single grouped numeric-range slice.

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
  slice: job end-judgment grouped numeric range diagnostics is implemented
  after delivered event reception `evwid` / `evipa` validation; next step is
  required validation.
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
