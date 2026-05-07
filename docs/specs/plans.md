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
  recommended JP1/AJS v13 slice should again be selected from the remaining
  partial or deferred gaps using the same user-meaningful job type or
  parameter-family grouping rule.
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
   delivered grouped event-host validation, keeping the grouping by job type
   or parameter family.
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

- Branch: `codex/file-monitoring-target-pattern-validation`
- Objective: continue JP1/AJS v13 parameter alignment with a user-meaningful
  grouped slice around file-monitoring target-pattern validation for
  `Flwj` / `Rflwj`, rather than reopening the feature through another
  single-parameter fix.
- Status: implemented and validated on
  `codex/file-monitoring-target-pattern-validation`.
- Scope: add focused file-monitoring semantic diagnostics for explicit
  monitored-file and monitoring-interval constraints through the existing
  editor-feedback boundary, covering `flwf` byte-length, `flwi` numeric range,
  and wildcard-with-short-interval invalid combinations while preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation.
- Out of scope: parser grammar changes, domain default changes, unit-list
  projection changes, `flwc` / `flco` diagnostics already delivered, `ets`
  timeout behavior, generated artifacts, dependency changes,
  `engines.vscode`, and non-file-monitoring parameter validation.
- Impact summary: the next slice is expected to affect
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`, focused
  file-monitoring diagnostics tests, the file-monitoring alignment record, and
  the editor-feedback behavior contract if the new diagnostics are approved.
- Risks and assumptions: the file-monitoring manual couples `flwf` wildcard
  usage and `flwi` short intervals, so the remaining work is best treated as a
  single parameter-family validation slice instead of separate key-level
  checks. Existing parameter source-location metadata is assumed to be
  sufficient to point diagnostics at explicit `flwf` / `flwi` parameters
  without parser or DTO changes.
- Alternatives considered: switch to another job type first, viable but
  deferred because file monitoring still has a coherent deferred validation
  family after its delivered defaults and invalid-combination diagnostics;
  split `flwf` and `flwi` into micro-slices, rejected because the manual
  defines a shared wildcard/interval rule across those parameters.

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
  slice: grouped event-host validation for `evhst` is implemented and
  validated; the next candidate should be selected from the remaining
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
