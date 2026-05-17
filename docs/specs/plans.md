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
- After re-checking the remaining partial and deferred gaps, the next
  recommended JP1/AJS v13 candidate should re-group the deferred
  filename-like, byte-length, macro-variable, and invalid-combination rules
  into one shared parameter-family slice, instead of returning to isolated
  job-type micro-slices that duplicate the same editor-feedback logic.
- After the delivered grouped generic parameter-rule slice, the next
  recommended JP1/AJS v13 candidate should return to the already-modeled
  schedule-rule family and align explicit `sd` rule/day diagnostics before
  revisiting smaller default-only gaps such as HTTP Connection `eu` or
  file-monitoring `ets`.
- After the delivered grouped schedule-rule `sd` explicit date/rule
  diagnostics slice, the next recommended JP1/AJS v13 candidate should return
  to the remaining transfer-related generic backlog and align explicit
  transfer-file value shapes before revisiting smaller default-only gaps such
  as HTTP Connection `eu`, file-monitoring `ets`, or broader wait-job
  reconciliation.
- After the delivered grouped transfer-file explicit value-shape slice, the
  next recommended JP1/AJS v13 candidate should be re-selected from the
  remaining partial or deferred gaps using the same user-meaningful grouping
  rule, instead of defaulting immediately to smaller default-only follow-ups.
- After the delivered grouped execution-interval control job `tmitv` / `etn`
  diagnostics slice, the next recommended JP1/AJS v13 candidate should be
  re-selected from the remaining partial or deferred gaps using the same
  user-meaningful grouping rule, instead of defaulting immediately to smaller
  default-only follow-ups.
- After re-checking the updated matrix and feature-local deferred notes, the
  next recommended JP1/AJS v13 candidate should group the remaining
  transfer-file filename/path semantics across UNIX/PC, UNIX/PC custom, and
  QUEUE-family jobs, because those rows share the same `tsN` / `tdN`
  parameter family, the same editor-feedback rule arrays, and the same
  refactoring seam inside `buildSyntaxDiagnostics.ts`.
- After the delivered grouped transfer-file filename/path slice, the next
  recommended JP1/AJS v13 candidate should be re-selected from the remaining
  partial or deferred gaps using the same user-meaningful grouping rule,
  rather than broadening immediately into platform-specific path semantics or
  unrelated default-only follow-ups.
- After the delivered grouped execution-interval control start-condition
  diagnostics slice, the next recommended JP1/AJS v13 candidate should again
  be re-selected from the remaining partial or deferred gaps using the same
  user-meaningful grouping rule, rather than broadening immediately into
  unsupported compatible-ISAM-specific behavior.
- After re-checking the remaining actionable JP1/AJS v13 gaps again, the next
  recommended candidate should group the still-inconsistent wait-job
  `eventTimeoutAction` default projection across the currently modeled
  `ets`-bearing wait-job families, because the domain wrapper default already
  exists, the user-visible table concept is shared in group 13, and the
  remaining work is better framed as one projection-reconciliation/refactor
  slice than as job-by-job cleanup.
- After re-checking the remaining actionable gaps again, the next recommended
  JP1/AJS v13 candidate should move to the remaining event-reception
  monitoring filter family and group the still-raw string-filter parameters
  (`evusr`, `evgrp`, `evwms`, `evdet`, `evwfr`, and `evtmc`) instead of
  jumping to smaller default-only cleanup or environment-sensitive work.
- After the delivered grouped JP1 event reception monitoring string-filter
  diagnostics slice, the next recommended JP1/AJS v13 candidate should stay
  within the same `evwj` / `revwj` job definition and align the remaining
  numeric identifier parameters (`evuid`, `evgid`, and `evpid`) together,
  because they share one manual section, one editor-feedback seam, one
  signed-decimal validation shape, and one regression-test file.
- After the delivered grouped JP1 event reception monitoring numeric-
  identifier slice, the next recommended JP1/AJS v13 candidate should stay
  within the same `evwj` / `revwj` job definition and group the remaining
  timeout-control parameters (`etm`, `ha`, and `ets`), because they share one
  manual section, one editor-feedback seam, one existing start-condition
  context helper, and one existing `ets` helper seam.
- After the delivered grouped JP1 event reception monitoring timeout-control
  slice, the next recommended JP1/AJS v13 candidate should move to the
  shared wait-job execution-time (`fd`) family across file monitoring,
  execution-interval control, and JP1 event reception monitoring jobs,
  because those families now share one parameter name, one numeric-range
  rule, one start-condition-disabled rule, and existing diagnostic seams in
  `buildSyntaxDiagnostics.ts`, while still avoiding unsupported
  compatible-ISAM-specific behavior.
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

1. Record and approval-gate the grouped shared wait-job
   `eventTimeoutAction` default-projection reconciliation slice across the
   currently modeled `ets`-bearing wait-job families.
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

- Branch: `main`; a dedicated implementation branch was attempted but could
  not be created from the sandboxed session after approval
- Objective: deliver the approved grouped shared wait-job
  `eventTimeoutAction` default-projection reconciliation slice after the
  delivered shared wait-job execution-time (`fd`) and execution-interval
  `etn=y` start-condition diagnostics.
- Status: implementation and validation are complete in the recorded scope.
- Scope: grouped unit-list projection reconciliation for omitted `ets` on the
  currently modeled wait-job families `lfwj` / `rlfwj`,
  `mlwj` / `rmlwj`, `mqwj` / `rmqwj`, `mswj` / `rmswj`, and
  `ntwj` / `rntwj`, limited to group 13 `eventTimeoutAction` plus only the
  smallest helper refactor needed to replace the current family-specific
  projection seam with one shared default-aware path.
- Out of scope: parser grammar changes, editor-feedback diagnostics, domain
  wrapper default behavior, normalized parameter storage, flow projection,
  command generation, generated artifacts, dependency changes, configuration,
  and `engines.vscode`.
- Impact summary: the implemented scope affected
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  `src/test/suite/buildUnitListRemainingGroups.test.ts`,
  `src/test/suite/buildUnitListView.test.ts`, the parameter-alignment feature
  docs, and the build-unit-list behavior contract for omitted `ets` display.
- Risks and assumptions: this slice stays presentation-facing and assumes the
  existing shared `ParamFactory.ets` default already expresses the intended
  JP1/AJS3 v13 semantics for the approved wait-job families. It must not
  broaden into other wait-condition parameters, event-receiving projection, or
  unsupported compatible-ISAM behavior.
- Alternatives considered: transfer-file macro-variable tightening remains a
  viable later candidate, but the delivered wait-job projection slice closed a
  clearer user-visible inconsistency with a smaller refactor seam.

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
  slice: grouped shared wait-job `eventTimeoutAction` default projection
  reconciliation is implemented and validated across the approved currently
  modeled `ets`-bearing wait-job families, after the delivered shared
  wait-job execution-time (`fd`) and execution-interval `etn=y`
  start-condition diagnostics. Compatible-ISAM-sensitive work remains
  intentionally unsupported.
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
