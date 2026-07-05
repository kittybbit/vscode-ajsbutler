# Traceability: Semantic Diff

## Purpose

Map semantic job-group comparison requirements to feature sections,
implementation slices, and validation plans.

### Comparison Contracts

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: expose host-neutral semantic diff inputs, outputs,
  limitations, and report-ready result categories.
- SPECS.md Section: Requirements, Architecture, Compatibility
- Implementation Slice: Slice 1, Comparison Contracts And Normalized Input
  Scope
- Test File Or Validation Plan: contract tests, architecture dependency tests,
  and build validation when production module exports change.
- Validation Result: `src/test/suite/semanticDiffContracts.test.ts` added;
  `rtk pnpm run qlty`, `rtk pnpm test`, and `rtk pnpm run build` passed during
  Slice 1 implementation. Production build still reports the existing webpack
  asset-size warnings.

### Comparison Scope And Ordering

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: compare definitions at job-group scope and ignore order-only
  changes.
- SPECS.md Section: Requirements, Acceptance Criteria
- Implementation Slice: Slice 2, Structural Diff And Deterministic Identity
  Matching
- Test File Or Validation Plan: application use-case tests with same-meaning
  reordered fixtures.
- Validation Result: `src/test/suite/compareSemanticDiff.test.ts` added for
  order-only comparisons, exact identity matching, fingerprint rename
  confirmation, ambiguous candidates, relation correspondence, execution
  attribute categories, fingerprint-changing rename delete/add behavior, and
  normalization warning limitations; `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build` passed during Slice 2
  implementation. Production build still reports existing webpack asset-size
  warnings.

### Deterministic Identity

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: confirm identity deterministically without persistent JP1/AJS
  IDs.
- SPECS.md Section: Requirements, Behavioral Scenarios, Acceptance Criteria
- Implementation Slice: Slice 2, Structural Diff And Deterministic Identity
  Matching
- Test File Or Validation Plan: unit tests for jobnet, unit, relation, and
  fingerprint matching rules.

### Rename And Move Rationale

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: distinguish confirmed rename or move results from ambiguous
  candidates and show rationale.
- SPECS.md Section: Requirements, Acceptance Criteria
- Implementation Slice: Slice 2, Structural Diff And Deterministic Identity
  Matching
- Test File Or Validation Plan: matching-rationale DTO tests and Markdown
  report tests.

### Attribute Categories

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: display execution attribute changes in user-facing categories.
- SPECS.md Section: Requirements, Acceptance Criteria
- Implementation Slice: Slice 2, Structural Diff And Deterministic Identity
  Matching
- Test File Or Validation Plan: attribute-category mapping tests and report
  rendering tests.

### Markdown Report

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: export a reviewable Markdown report.
- SPECS.md Section: Requirements, Acceptance Criteria
- Implementation Slice: Slice 3, Markdown Report Renderer
- Test File Or Validation Plan: report snapshot or approval-style tests for
  no-change, structural-change, rename/move, ambiguous, and limitation cases.
- Validation Result: `src/test/suite/renderSemanticDiffMarkdown.test.ts`
  added for deterministic no-change output and report sections covering
  structural changes, ambiguous candidates, attribute categories, matching
  rationale, confirmation-required constraints, unsupported items, and
  limitations; `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`,
  and `rtk pnpm run build` passed during Slice 3 implementation. Production
  build still reports existing webpack asset-size warnings.

### Command And Export Workflow

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: allow users to request semantic comparison from the active
  after-definition editor, select a before definition through a VS Code file
  picker, and obtain a Markdown report through extension-safe host adapters.
- SPECS.md Section: Architecture, Compatibility, Acceptance Criteria
- Implementation Slice: Slice 4, VS Code Command And Report Export Surface
- Test File Or Validation Plan: command, package manifest command and
  activation-event checks, extension subscription, desktop, web, and build
  validation.
- Validation Result: `src/test/suite/semanticDiffCommand.test.ts` added for
  active-editor after input, before-file picker cancellation, parse-failure
  handling, clipboard copy, and save behavior;
  `src/test/suite/buildSemanticDiffReport.test.ts` added for parser,
  normalization, comparison, and renderer orchestration; package manifest,
  extension subscription, extension activation, README, and CHANGELOG checks
  were updated; `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build` passed during Slice 4
  implementation. Production build still reports existing webpack asset-size
  warnings.

### Start And Wait Confirmation

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: detect start-condition strictness, wait-condition changes,
  release-source disappearance, and timeout removal as confirmation-required
  items.
- SPECS.md Section: Requirements, Behavioral Scenarios, Acceptance Criteria
- Implementation Slice: Slice 5, Start And Wait Confirmation Checks
- Test File Or Validation Plan: condition-rule tests, confirmation-required
  DTO tests, negative tests, and report wording tests.
- Validation Result: `src/test/suite/semanticDiffConditions.test.ts` added for
  conditional relation confirmation, non-problem plain predecessor removal,
  wait release-source changes, timeout removal, supported end-judgment changes,
  file/event wait target changes, external constraint report wording, and
  uninterpretable file-monitoring condition handling. README and CHANGELOG
  were updated because command report output gains user-visible
  confirmation-required notes.
- Supported Rule Basis: JP1/AJS3 v13 unit definition parameters for `ar`
  relation type, `eun` wait release source, `jd`/`wth`/`tho`/`jdf` job end
  judgment, `flwf`/`flwc`/`fd` file monitoring, and
  `evwid`/`evwfr`/`evhst`/`evwms`/`evdet`/`evusr`/`evgrp`/`evuid`/`evgid`/
  `evpid`/`evipa`/`evesc`/`etm` event receiving. The implementation reports
  runtime, external file, and external event facts as unverified constraints.

### Non-Problem Structures

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: avoid problem judgments for missing predecessors, missing
  successors, disconnected relations, or external systems by themselves.
- SPECS.md Section: Requirements, Non-Goals, Acceptance Criteria
- Implementation Slice: Slice 5, Start And Wait Confirmation Checks
- Test File Or Validation Plan: negative tests for non-problem structures and
  external-constraint messaging.

### Flow Highlighting

- Use Case: docs/requirements/use-cases/uc-build-flow-graph.md
- Requirement: highlight after-definition semantic condition changes in the
  existing flow presentation without moving comparison logic into UI code;
  before-only deletions and ambiguous candidates stay report-only.
- SPECS.md Section: Architecture, Acceptance Criteria
- Implementation Slice: Slice 6, Flow Diff Highlighting Hooks
- Test File Or Validation Plan: flow DTO/view-model tests and presentation
  tests for changed-node, changed-edge, and confirmation-required states.
- Validation Result: `src/test/suite/semanticDiffFlowHighlights.test.ts`
  added for mapping semantic diff DTOs to after-side flow node and edge
  highlights while keeping before-only removals and ambiguous candidates
  report-only. `src/test/suite/buildFlowGraph.test.ts`,
  `src/test/suite/flowGraphView.test.ts`, and
  `src/test/suite/flowMiniMap.test.ts` were updated for highlight DTO
  propagation and presentation states.

### Schedule Diff

- Use Case: docs/requirements/use-cases/uc-compare-semantic-diff.md
- Requirement: compare run schedules for a specified period and report zero or
  uncalculated schedules.
- SPECS.md Section: Requirements, Acceptance Criteria
- Implementation Slice: Slice 7, Schedule Diff
- Test File Or Validation Plan: schedule-rule tests with supported JP1/AJS3
  fixtures and report tests for unsupported or uncalculated cases.

### Normalized Inputs

- Use Case: docs/requirements/use-cases/uc-normalize-ajs-document.md
- Requirement: reuse normalized unit and relation semantics without leaking
  parser internals.
- SPECS.md Section: Architecture, Compatibility
- Implementation Slice: Slice 1 and Slice 2
- Test File Or Validation Plan: boundary tests and application tests that use
  normalized inputs.

## Validation Expectations

- Every slice must run `rtk pnpm run qlty`.
- Code slices must add or update focused tests before feature behavior is
  considered complete.
- `rtk pnpm test` is expected for every code slice.
- `rtk pnpm run test:web` is required when shared modules, command behavior,
  or webview presentation can affect web extension execution.
- `rtk pnpm run build` is required when command contributions, production
  exports, bundling, or webview presentation change.
- JP1/AJS3 manual references must be recorded before approving rule logic that
  depends on specific parameter, relation, wait, event, or schedule semantics.
