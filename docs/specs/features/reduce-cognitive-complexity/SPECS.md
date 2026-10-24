# Feature Specification: Reduce Cognitive Complexity

## Purpose

Reduce the reasoning needed to maintain existing JP1/AJS viewer operations.
This transient branch feature preserves observable behavior while reducing
actual decision duplication and state-management complexity. It is one quality
outcome across the measured functions, not new independent product features.

## Source

- User request in the current conversation, 2026-10-24: inspect qlty metrics,
  reduce total complexity, use meaningful responsibility boundaries, and bring
  every measured function's cognitive complexity to 14 or below.
- User's subsequent implementation request adopts the proposed behavioral
  boundaries and metric safeguards; exact implementation paths and slices
  still require formal planning, independent review, and Human Approval.
- Existing behavior contracts: [unit list](../../../requirements/use-cases/uc-view-unit-list.md),
  [flow exploration](../../../requirements/use-cases/uc-explore-flow-graph.md),
  and [cross-view navigation](../../../requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md).
- JP1/AJS basis: existing normalized unit identity, hierarchy, job-group and
  jobnet scope semantics. No new JP1/AJS interpretation is introduced.

## Requirements and acceptance

- R1: Every function in the existing full qlty selection has cognitive
  complexity at most 14, including added or moved functions.
- R2: Each approved cohesive improvement and the complete feature strictly
  decrease the full-repository official file-level cognitive aggregate and
  do not increase the corresponding cyclomatic aggregate. Compare equivalent
  snapshots, including all added, moved and deleted paths; do not substitute
  function sums for file aggregates.
- R3: Keep qlty version, configuration, selection, exclusions and thresholds
  identical across comparisons. The discovered tool is qlty 0.645.0. Preserve
  official check/smells SARIF comparisons and the final aggregate gate under
  the [validation policy](../../validation.md#qlty-evidence-format).
- R4: Simplify decisions, duplicated calculations or state transitions.
  Function/file/class extraction alone does not establish acceptance. Any
  extracted responsibility must have meaningful viewer/application ownership;
  explain the eliminated complexity in implementation evidence and review.
- R5: Preserve table cell/header movement, Ctrl and page movement, empty/boundary
  behavior, provisional focus versus committed selection, one Tab entry, and
  focus restoration across virtualization, sorting, hidden columns, document
  changes, detail return and tree/grid handoffs. Keep child controls isolated.
- R6: Preserve tree Escape/modifier handling, current/selected/first-row
  priority, expansion waiting, request revision and DOM focus waiting.
- R7: Preserve registered panel activity guards, deferred SAVE rechecking,
  optional save support, invalid-input notifications, error handling,
  disposal and telemetry. Preserve direct message-handler call semantics.
- R8: Preserve flow-scope resolution order: descendant jobnets of job groups,
  direct judgment-job parents, nearest containing jobnet, self fallback and
  existing cycle-error priority, as applicable to existing input semantics.
- R9: Relevant regression tests, types, zero-exception architecture checks,
  desktop/web tests and builds pass. Add missing meaningful boundary coverage
  before changing its behavior-sensitive implementation.

## Decisions and impact

- Existing owners remain table navigation/focus presentation, shared tree
  presentation, VS Code viewer-message routing and application navigation.
  The plan assigns grid focus lifecycle and keyboard interpretation to
  presentation hooks, keeps tree focus policy in shared presentation, and
  keeps message activity and scope resolution with their existing owners.
- Direct impact is the seven functions discovered above the target and their
  owning files; transitive impact includes list/tree/flow focus, cross-view
  navigation, message routing, definition display and save/export entry points.
- The inherited WebAPI feature remains independently owned and unchanged.
  Imported definitions continue to use the same downstream viewer behavior.
- Roadmap overlap: the existing WebAPI beta-exit and fixture-reproducibility
  items remain unchanged. This branch introduces no new roadmap commitment.
- Durable use cases remain stable because behavior is preserved. No durable
  document or CHANGELOG edit is intended; changed behavior would require Main
  to reassess scope and approval rather than silently adjust these contracts.

## Compatibility

- Preserve public APIs, DTOs, Webview messages and privacy-conscious telemetry.
- Preserve `engines.vscode` at `^1.75.0`, desktop/web support, parser behavior,
  list/flow/CSV/definition/diagnostic/hover/navigation/import/diff behavior.
- Keep existing architecture directions. Shared code remains browser-safe;
  no Node built-ins, parser internals or VS Code APIs cross their boundaries.

## Non-goals

- New viewer features, keyboard meanings, JP1/AJS rules or accessibility design.
- Cosmetic splitting, metric exclusion changes or threshold relaxation.
- Dependency modernization, parser/generated/configuration changes or unrelated
  repairs, test deletion or coverage reduction.
- Inherited-feature edits, WebAPI beta exit, releases or product documentation
  changes unrelated to this behavior-preserving refactor.

## Open questions

No material design decision is missing. Exact paths, slices, validation and
pending approval gates are recorded in [TASKS](TASKS.md).
