# UC: Navigate Between Unit List And Flow Graph

## Goal

Let users move from a unit in one viewer to the corresponding unit in the
other viewer when that counterpart view is available.

## Trigger

- the user invokes a jump action from the unit-list for a selected unit
- the user invokes a jump action from the flow-graph for a selected unit

## Inputs

- selected unit identity
- current document or definition context
- availability of the counterpart viewer and target unit scope

## Outputs

- the counterpart viewer opens or focuses the corresponding unit
- if the counterpart viewer is unavailable, the current viewer state is kept
  stable and the action fails predictably

## Rules

- navigation must be based on stable unit identity or path, not transient UI
  row or graph-node implementation details
- list and flow viewers should not require direct imports of each other's
  internal component state
- desktop and web hosts should be able to use the same application-facing
  navigation contract

## Acceptance Notes

- a jump from unit-list to flow-graph lands on the matching unit scope when a
  flow view can be built
- a jump from flow-graph to unit-list lands on the matching unit row when a
  list view can be built
- the action does not require `UnitEntity` reconstruction in the presentation
  layer if stable normalized or DTO identity is sufficient

## Risks Or Edge Cases

- target viewers might not already be open
- some units might not have a meaningful flow scope or list row under the same
  presentation rules
- navigation semantics can drift if unit identity differs between list and flow
  DTO mappings
