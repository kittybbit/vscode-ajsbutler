# Flow Graph View UI/UX Improvements Tasks

## Current Task

- Status: Proposed
- Scope: use `sdd-plan-task` to investigate and select the next smallest
  vertical slice; no runtime implementation is currently approved.
- Acceptance: the next slice must preserve completed multi-result search,
  selected-node details, explicit definition/scope actions, external reveal,
  nested expansion, and desktop/web behavior.
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
- Selected-node details are complete. React Flow's `selected` mapping now
  represents `selectedUnitId`; the current search result has a separate visual
  flag and both states can coexist.
- `FlowNodeDetailPanel` remains limited to graph context and opens the existing
  `UnitEntityDialog` only through an explicit action.
- Direct and transitive relationship summaries use one presentation-local edge
  index with visited-set traversal. The later focus-mode slice can reuse this
  calculation without moving XyFlow types into application or domain.
- Eligible scope actions retain the existing jobnet/condition behavior and do
  not make selection itself change `currentUnitId`.
- Tree selection/hover synchronization, focus-mode styling, MiniMap state,
  card redesign, and `hoveredUnitId` remain later slices.
- Automated desktop/web tests passed. Interactive in-app browser smoke was not
  completed because the browser connector rejected the session's sandbox
  metadata; repeat selection, close, search coexistence, dialog, and scope-open
  smoke verification when that connector is available.
- Existing production bundle-size warnings remain unrelated to this feature.

## Use-Case Back-Propagation

- The completed search behavior is already represented in
  `docs/requirements/use-cases/uc-build-flow-graph.md`.
- Selected-node graph context and explicit definition/scope behavior are already
  represented in `docs/requirements/use-cases/uc-build-flow-graph.md`; no
  additional use-case update was required.
- Back-propagate later only if scope eligibility, search/reveal semantics, or the
  boundary between graph context and definition details changes.
