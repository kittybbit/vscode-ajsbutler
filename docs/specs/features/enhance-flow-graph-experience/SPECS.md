# SPECS: enhance-flow-graph-experience

## Purpose

Improve flow-graph usability and presentation by aligning its look more closely
to JP1/AJS View, supporting nested expansion in one screen, and adding
navigation from and to the unit list.

## Origin

- Source use case: docs/requirements/use-cases/uc-build-flow-graph.md
- Source use case:
  docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md

## Acceptance Criteria

- flow-graph presentation goals are described as visual resemblance to
  JP1/AJS View, not full interaction parity in one slice
- nested graphs can be revealed progressively in the same screen
- each revealed nested panel stays anchored to the expanded unit that owns it
  and grows only to the right and downward from that unit
- when a nested panel enlarges its parent scope, sibling offsets are derived
  from current visible panel bounds within the same immediate scope rather
  than by replaying historical expansion deltas
- horizontal offset propagation uses only the portion of a lower panel that
  extends beyond the maximum right edge already occupied by expanded panels
  above it in the same scope
- vertical offset propagation applies only the missing downward distance needed
  to clear the relevant visible panel bounds, so already-offset targets are
  not pushed again unnecessarily
- when an upper panel newly intrudes into a lower expanded panel, the lower
  panel origin may be pushed downward, but reopening the lower panel itself
  does not trigger that same intrusion rule against the lower panel
- flow-view search may stay within the current scope if it reveals collapsed
  ancestors needed to show matching units before visually focusing them
- current-scope flow search supports case-insensitive contiguous partial
  matches across unit name, comment, and path
- a one-click expand-all path is available for the current scope
- when nested expansion changes the visible graph bounds, the viewer recomputes
  the viewport so fit-to-view behavior still reaches the expanded nodes
- explicit navigation between unit-list and flow-graph units is defined when
  the counterpart view exists
- desktop and web compatibility remain explicit for all viewer-facing work

## Implementation Notes

- keep graph DTO construction separate from viewer styling and interaction
  controls
- prefer stable unit identity or path when coordinating list/flow navigation
- reuse the existing nested-expansion state and a presentation-local focus
  marker instead of introducing a second scope-selection model
- keep viewport fitting presentation-local: when visible flow bounds change
  after nested expansion or collapse, recompute the React Flow viewport from
  the latest rendered nodes instead of encoding graph bounds into DTO shape
- when nested expansion layout needs ordering-sensitive behavior, use the
  current expansion order from presentation state instead of reconstructing a
  synthetic order from a set alone
- keep current-scope search matching presentation-local and treat the full
  normalized query as a case-insensitive contiguous partial match
- when more than one unit matches inside the current scope, prefer the first
  descendant match over the scope root itself so search still produces a
  visible focus change
- when more than one unit matches inside the current scope, visually
  highlight every visible match while keeping keyboard focus and ancestor
  expansion decisions anchored to the first chosen match
- when more than one unit matches inside the current scope, expand the union
  of collapsed ancestor jobnets needed to reveal every visible match rather
  than only the first chosen one
- split the work into small viewer-facing slices:
  visual refresh, nested expansion, and cross-view navigation do not need to
  land in one commit
- avoid coupling the flow UI refresh to unrelated parser or command-generation
  changes

## Non-Goals

- full JP1/AJS View feature parity in one slice
- hidden dependence on `UnitEntity` reconstruction in presentation modules
- desktop-only interaction paths that cannot be mirrored or degraded
  predictably in web
