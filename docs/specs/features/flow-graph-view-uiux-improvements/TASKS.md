# Flow Graph View UI/UX Improvements Tasks

## Current Task

- Status: None
- Scope: use `sdd-plan-task` to approve the remaining left-panel and header
  refinement slice.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Decision Notes

- The remaining layout uses a full-width header as the first row and three
  panes below it: FlowSelector on the left, flow graph in the center, and
  selected-node details on the right.
- FlowSelector must use the same in-layout `Paper` panel language as the right
  detail panel, including manual collapse/expand, compact rail, and automatic
  collapse below the MUI `md` breakpoint. It must not remain a persistent
  `Drawer`, overlay the graph, or sit beside the header.
- The later header refinement places search first, removes the redundant
  single-item hamburger and breadcrumb hierarchy, and retains a concise current
  scope label.

## Remaining Risks

- The web smoke runner could not reach the VS Code distribution endpoint in
  two attempts; web compilation and production web bundling succeeded.
- Direct Mocha execution exposes an existing `flowSearchState` assertion
  mismatch around an explicit `undefined` property; the zoom-preservation
  change does not touch search-state transitions.
- Production builds retain the repository's existing bundle-size warnings.

## Use-Case Back-Propagation

- `uc-build-flow-graph.md` now requires search-result centering to preserve zoom
  and records the remaining responsive left-panel behavior.
