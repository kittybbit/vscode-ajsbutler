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

1. Record and approve the next grouped JP1/AJS3 v13 parameter-alignment
   slice around shared filename-like, byte-length, macro-variable, and
   invalid-combination rules in the existing editor-feedback boundary.
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

- Branch: `codex/generic-parameter-rules`
- Objective: prepare the next JP1/AJS v13 parameter-alignment slice by
  regrouping the remaining generic validation gaps around shared
  filename-like, byte-length, macro-variable, and invalid-combination rules
  instead of continuing job-type-by-job-type follow-ups.
- Status: approved for implementation and in progress on
  `codex/generic-parameter-rules`; implementation and validation are now
  complete in the approved scope.
- Scope: update SDD artifacts for the planned shared editor-feedback slice
  that would consolidate duplicated explicit-value validation patterns in
  `buildSyntaxDiagnostics.ts`, include the small refactoring needed so the new
  rules remain on that existing generic-rule path, and then extend the same
  boundary to remaining deferred transfer/QUEUE-style generic rules without
  changing parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, command generation, generated
  artifacts, dependency versions, or `engines.vscode`.
- Out of scope: runtime implementation before approval, parser grammar
  changes, domain default changes, list/flow projection changes, command
  generation changes, dependency changes, and any product-decision rule that
  requires behavior beyond the documented generic validation categories.
- Impact summary: the approved implementation candidate would affect
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`, focused
  `buildSyntaxDiagnostics` regression tests, the parameter-alignment feature
  docs, the parameter coverage matrix, and the editor-feedback behavior
  contract.
- Risks and assumptions: this regrouping assumes the remaining deferred rules
  can stay in the shared application editor-feedback boundary without pushing
  validation into parser or domain layers. Macro-variable allowance still
  varies by parameter family, so any helper extraction must keep per-family
  policy explicit instead of collapsing all string-shape checks into one rule.
- Alternatives considered: continue picking one job type at a time, rejected
  because the remaining gaps now cluster more strongly by validation rule than
  by unit family; broaden the slice to all remaining parameter gaps, rejected
  because that would mix generic-rule cleanup with unrelated category-specific
  semantics.

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
  slice: grouped generic parameter-rule diagnostics are implemented for shared
  transfer/QUEUE byte-length and invalid-combination rules through the
  existing editor-feedback boundary; remaining deferred gaps should be
  re-selected from the updated coverage matrix.
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
