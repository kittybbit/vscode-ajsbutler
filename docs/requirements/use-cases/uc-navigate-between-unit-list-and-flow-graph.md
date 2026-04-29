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
- navigation may be offered only when the counterpart view exists for the same
  document context
- if navigation changes the visible graph bounds or selected row, the target
  viewer should preserve its normal focus and fit behavior

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Navigate between unit list and flow graph

Scenario: Jump from unit list to matching flow scope
  Given a selected unit in the unit-list viewer
  And a flow graph can be built for the same document context
  When the user invokes jump to flow graph
  Then the flow graph opens or focuses the matching unit scope

Scenario: Jump from flow graph to matching unit row
  Given a selected unit in the flow-graph viewer
  And a unit-list view can be built for the same document context
  When the user invokes jump to unit list
  Then the unit-list viewer opens or focuses the matching unit row

Scenario: Counterpart viewer is unavailable
  Given a selected unit in one viewer
  And the counterpart viewer cannot be opened for that context
  When the user invokes cross-view navigation
  Then the current viewer state remains stable
  And the action fails predictably
```

## Acceptance Notes

- the action does not require `UnitEntity` reconstruction in the presentation
  layer if stable normalized or DTO identity is sufficient

## Risks Or Edge Cases

- some units might not have a meaningful flow scope or list row under the same
  presentation rules
- navigation semantics can drift if unit identity differs between list and flow
  DTO mappings
