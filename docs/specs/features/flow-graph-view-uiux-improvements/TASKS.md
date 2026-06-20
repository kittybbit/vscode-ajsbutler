# Flow Graph View UI/UX Improvements Tasks

## Current Task

- Status: None
- Scope: select the next slice through `sdd-plan-task`; card-based node
  presentation is the next feature-local candidate.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Decision Notes

- Standard MiniMap improvements are complete: viewer-local visibility toggling,
  selection/search/focus state colors, non-scaling semantic outlines, hidden
  layout-boundary suppression, and bottom-right placement retain the standard
  React Flow component.
- Controlled graph nodes now receive the existing card size as initial
  dimensions so React Flow creates MiniMap node rectangles. The viewport
  minimum zoom is `0.02` so deeply expanded bounds can fit on the canvas.
- Manual verification confirmed MiniMap node rendering and whole-canvas
  zoom-out behavior after the dimension and minimum-zoom fixes.
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
- Focus roles remain in presentation node data for the later card redesign.
- Existing production bundle-size warnings remain unrelated to this feature.
