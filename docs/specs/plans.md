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

1. Select the next focused JP1/AJS3 v13 parameter-alignment gap from the
   documented deferred diagnostics, range-validation, byte-length validation,
   macro-variable validation, wildcard restriction, and requiredness candidates.
2. Prepare that selected parameter-alignment slice as an approval-gated
   behavior contract before implementation, keeping parser grammar, generated
   artifacts, normalized raw storage, projections, command generation,
   dependency versions, and `engines.vscode` out of scope unless explicitly
   approved.
3. Continue JP1/AJS v13 parameter-alignment slices until the feature-local
   coverage matrix no longer has actionable `Partial` or `Deferred` gaps, or
   until a gap is explicitly re-scoped as outside the alignment feature.
4. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
5. Keep compatibility risk visible for every shared or extension-runtime
   change.
6. Defer Qlty-driven architecture refactoring Phase 0 until JP1/AJS v13
   parameter alignment is complete or this plan records an explicit override.

## Current Branch Plan

- Branch: `codex/prioritize-parameter-alignment-before-qlty`.
- Objective: correct branch-level sequencing so JP1/AJS v13 parameter
  alignment remains the active implementation priority before Qlty-driven
  architecture refactoring.
- Status: docs-only planning correction.
- Scope: update `docs/specs/plans.md` to make the parameter-alignment-first
  order explicit, preserve WebAPI beta tracking as deferred, and defer Qlty
  Phase 0 until parameter alignment is complete or explicitly overridden.
- Out of scope: runtime code changes, parser grammar changes, generated
  artifacts, dependency changes, `engines.vscode`, test/build script changes,
  and changing the roadmap content without a separate priority decision.
- Impact summary: this change affects branch sequencing only. It does not alter
  delivered job end-judgment retry diagnostics or any user-visible extension
  behavior.
- Risks and assumptions: JP1/AJS v13 parameter alignment still has documented
  actionable gaps in the feature-local coverage matrix. Treat Qlty refactoring
  as valuable but not the next implementation priority until alignment is
  finished or explicitly re-prioritized.

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
  next slice: select the next unresolved diagnostics or validation gap before
  implementation approval.
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
