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
- Parameter-reference alignment was completed for the current repository-
  supported JP1/AJS v13 feature scope using small slices with explicit manual
  coverage. The feature-local coverage matrix tracks the investigated
  categories without claiming repository-wide coverage. Remaining
  platform-specific, environment-specific, or broader cross-parameter topics
  were explicitly re-scoped out instead of being treated as unfinished work in
  the same feature.
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
- After the delivered grouped shared wait-job execution-time (`fd`) and
  wait-job `eventTimeoutAction` default-projection slices, the next
  recommended JP1/AJS v13 candidate should be re-selected from the remaining
  partial or deferred gaps using the same user-meaningful grouping rule,
  rather than defaulting immediately to platform-specific transfer-path or
  broader deferred cross-parameter work.
- JP1/AJS v13 parameter alignment is complete for the current repository-
  supported feature scope. Platform-specific transfer-path interpretation,
  non-default `SCHEDULELIMIT` handling, and broader cross-parameter
  invalidation are explicitly outside that completed scope unless a future
  feature re-introduces them with fresh approval.
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

1. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
2. Keep compatibility risk visible for every shared or extension-runtime
   change.
3. Keep deterministic expanded-flow layout and fit-to-view regression coverage
   visible while real nested-layout examples accumulate.
4. Investigate and approve `flow-refactor` PR1 characterization tests before
   starting the planned diagnostics, expanded-flow, and flow-viewer refactor
   slices.

## Current Branch Plan

- Branch: `codex/flow-layout-determinism`
- Objective: implement the approved deterministic expanded-flow layout slice
  and its React Flow standard `fitView` follow-up.
- Status: implementation and validation are complete for the approved slices.
- Scope: expanded-flow layout collision resolution, React Flow standard
  `fitView` bounds support, regression tests, and SDD task/plan sync for
  `flow-layout-determinism`.
- Out of scope: DTO shape changes, dependency changes, `engines.vscode`
  changes, and search/reveal/fitView behavior changes.
- Impact summary: expanded-flow layout already removes active expansion order
  from collision decisions, computes occupied boxes for visible sibling
  subtrees, and keeps sibling layout stable by pushing affected right/down
  scopes. The fit-to-view follow-up represents expanded nested panel bounds as
  transparent React Flow group nodes so the standard `fitView` calculation can
  include them after expansion.
- Risks and assumptions: real-world nested layouts may reveal additional
  collision or refit cases, but the current slices preserve desktop and web
  extension behavior under the existing test suite and do not change graph DTO
  shape.
- Alternatives considered: preserving active-expanded-unit collision behavior
  was rejected because it keeps layout dependent on expansion order.

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
  completed JP1/AJS3 version 13 alignment records for the current repository-
  supported feature scope. The feature-local docs still hold durable boundary
  decisions and the coverage matrix, while excluded platform-specific and
  broader cross-parameter follow-ups are no longer active work here.
- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.
- `docs/specs/features/flow-refactor/`:
  active repository-native maintainability feature for diagnostics,
  expanded-flow layout, and flow-viewer composition separation using the
  agreed five-PR slice order.
- `docs/specs/features/flow-layout-determinism/`:
  active repository-native feature for deterministic, non-overlapping nested
  expansion layout in the flow viewer.
- `docs/specs/features/qlty-driven-architecture-refactoring/`:
  active maintainability-driven architectural refactoring based on Qlty
  complexity, duplication, and code-smell findings; now eligible to resume as
  the next implementation priority.

Completed feature-local folders were removed after their durable behavior
contracts were compressed into `docs/requirements/use-cases/`.

## Branch Validation

- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when markdown
  structure or links need focused validation
- code changes: follow `docs/specs/README.md`
