# Flow Graph View UI/UX Improvements Tasks

## Current Task

- Status: Proposed
- Scope: use `sdd-plan-task` to investigate and select the next smallest
  vertical slice; tree/graph hover synchronization is the next candidate.
- Acceptance: the next slice must preserve completed search, node details,
  tree/graph selection, explicit scope navigation, external reveal, nested
  expansion, and desktop/web behavior.
- Validation: define task-specific tests and retain the standard code-change
  validation sequence.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Decision Notes

- Current-scope multi-result search, selected-node details, and tree/graph
  selection synchronization are complete.
- `hoveredUnitId` and hover synchronization are deferred to the immediately
  following slice so high-frequency hover state does not complicate the tree
  expansion/selection state machine. Focus mode, MiniMap state, and card redesign
  also remain later slices.
- Interactive in-app browser smoke was not
  completed because the browser connector rejected the session's sandbox
  metadata; repeat selection, close, search coexistence, dialog, and scope-open
  smoke verification when that connector is available.
- Existing production bundle-size warnings remain unrelated to this feature.

## Use-Case Back-Propagation

- Completed search, node-detail, tree/graph selection, and explicit scope
  behavior are already represented in
  `docs/requirements/use-cases/uc-build-flow-graph.md`; no use-case update is
  pending.
