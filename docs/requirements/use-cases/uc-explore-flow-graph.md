# UC: Explore Flow Graph

## Goal

Let users reveal, search, select, and focus JP1/AJS units within the current
flow scope while preserving predictable navigation and viewport state.

## Trigger

- the user expands or collapses a nested jobnet
- the user searches within the current flow scope
- the user selects or hovers a graph or flow-tree unit
- the user changes relationship focus or collapses supporting panels

## Inputs

- graph data for the active root-jobnet scope
- current nested expansion set
- current query, selected unit, hovered unit, and relationship-focus state
- current viewport position and zoom

## Outputs

- visible nested-jobnet state
- current search matches and active result
- selected, hovered, and relationship-focused units
- reveal or centering requests that preserve the current graph scope

## Rules

- expansion reveals nested jobnets in the same viewer and active graph scope
- after expansion, the viewer can include newly visible graph bounds
- current-scope search uses case-insensitive contiguous partial matching across
  unit name, comment, and path
- search may reveal collapsed ancestors required to display a matching unit
- all visible matches are highlighted and one current result is distinct
- next and previous navigation traverse all current-scope matches predictably
- moving to a search result centers it without changing the current zoom
- scope, selected unit, active search result, and hovered unit remain distinct
  concepts
- selecting a node exposes lightweight relationship and status context without
  automatically opening unit-definition details
- selecting an in-scope flow-tree row centers the unit without changing zoom
- flow-tree and graph selection and hover remain synchronized
- synchronized selection or hover does not implicitly change graph scope
- relationship focus preserves unrelated nodes and edges with weaker emphasis
  instead of removing them
- supporting tree and detail panels may collapse responsively or explicitly
  without clearing selection, hiding access to their actions, or overlaying the
  graph
- this presentation-local search behavior does not create a shared search
  domain contract

## Behavioral Scenarios

```gherkin
Feature: Explore flow graph

Scenario: Nested jobnet expands in the current scope
  Given a visible nested jobnet
  When the user expands it
  Then its graph is revealed without changing the active root-jobnet scope
  And the viewer can include the newly visible bounds

Scenario: Search reveals a collapsed descendant match
  Given a matching unit below collapsed ancestor jobnets
  When current-scope search is performed
  Then the required ancestors are revealed
  And all visible matches are highlighted

Scenario: Search navigation preserves zoom and scope
  Given multiple matches and a user-selected zoom level
  When the user moves to the next or previous result
  Then the current result is distinct and centered
  And zoom and active graph scope remain unchanged

Scenario: Selected node exposes context without opening definition
  Given a visible graph node
  When the user selects it
  Then relationship and status context is available
  And unit-definition details remain closed until explicitly requested

Scenario: Flow-tree selection preserves zoom
  Given an in-scope flow-tree row and a rendered graph unit
  When the user selects the row
  Then the graph centers the corresponding unit
  And the zoom level remains unchanged

Scenario: Graph and flow tree synchronize interaction
  Given the graph and flow tree are visible
  When the user selects or hovers a unit in either surface
  Then the corresponding unit is emphasized in the other surface
  And active scope changes only through an explicit scope action

Scenario: Relationship focus preserves the graph
  Given a selected unit with related and unrelated graph elements
  When relationship focus is enabled
  Then upstream and downstream elements are distinguishable
  And unrelated elements remain visible with weaker emphasis

Scenario: Supporting panels collapse without losing state
  Given a selected unit and visible supporting panels
  When the viewport narrows or the user collapses a panel
  Then its actions remain accessible without overlaying the graph
  And the selected unit remains selected
```

## Acceptance Notes

- desktop and web viewers preserve the same exploration semantics
- expansion, search, selection, hover, and focus remain predictable without
  requiring a shared search implementation

## Risks Or Edge Cases

- a scope-root match can obscure a more useful descendant match unless current-
  result selection remains predictable
- very deep expansion can require viewport refitting while preserving user zoom
  during later navigation
- selection synchronization can cause accidental scope changes unless scope
  actions remain explicit
