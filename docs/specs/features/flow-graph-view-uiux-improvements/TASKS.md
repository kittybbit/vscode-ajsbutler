# Flow Graph View UI/UX Improvements Tasks

## Current Task

- Status: Proposed
- Scope: use `sdd-plan-task` to investigate and select the next smallest
  vertical slice; no runtime implementation is currently approved.
- Acceptance: the next slice must preserve completed multi-result search,
  external reveal, nested expansion, and desktop/web behavior.
- Validation: define task-specific tests and retain the standard code-change
  validation sequence.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Decision Notes

- Current-scope multi-result search navigation is complete.
- `searchedUnitId` remains the current search result and
  `searchMatchedUnitIds` remains the full ordered match set.
- Search navigation uses the existing depth-first order, descendant-first
  initial focus, cyclic previous/next transitions, and target-specific React
  Flow `fitView`.
- External reveal highlighting remains separate from a submitted search query.
- React Flow's `selected` mapping still represents the current search result;
  the future `selectedUnitId` slice must decouple node selection without
  regressing this visual state.
- Existing production bundle-size warnings remain unrelated to this feature.

## Use-Case Back-Propagation

- The completed search behavior is already represented in
  `docs/requirements/use-cases/uc-build-flow-graph.md`.
- No additional use-case update is required unless a later slice changes search
  order, viewport reveal, graph-scope behavior, or external reveal semantics.
