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
- a one-click expand-all path is considered in the design, even if it lands
  after the first incremental expansion slice
- explicit navigation between unit-list and flow-graph units is defined when
  the counterpart view exists
- desktop and web compatibility remain explicit for all viewer-facing work

## Implementation Notes

- keep graph DTO construction separate from viewer styling and interaction
  controls
- prefer stable unit identity or path when coordinating list/flow navigation
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
