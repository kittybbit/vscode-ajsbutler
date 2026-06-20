# Flow Graph View UI/UX Improvements Tasks

## Current Task

- Status: None
- Scope: select the next slice through `sdd-plan-task`; standard MiniMap state
  and visibility improvements are the next feature-local candidate.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Decision Notes

- Current-scope multi-result search, selected-node details, tree/graph selection
  and hover synchronization, zoom-preserving tree selection, and responsive or
  manual detail-panel collapse are complete. Relationship focus mode is also
  complete with Header/detail controls, cycle-safe role calculation, and
  non-destructive node/edge emphasis.
- Preserve source-aware hover transitions: graph-origin hover uses native CSS
  without changing React Flow node data, while tree-origin hover decorates only
  the matching graph node. This avoids enter/leave feedback loops and flicker.
- Preserve source-aware hover behavior: focus decoration must not add graph
  enter/leave state updates or recreate the prior flicker loop.
- Focus roles remain in presentation node data for the standard MiniMap slice;
  card redesign remains later.
- Interactive in-app browser smoke was not
  completed because the browser connector rejected the session's sandbox
  metadata; repeat selection, close, search coexistence, dialog, and scope-open
  smoke verification when that connector is available.
- Existing production bundle-size warnings remain unrelated to this feature.
