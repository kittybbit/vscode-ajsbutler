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
- viewport fitting, reveal, or centering requests that preserve the current
  graph scope

## Rules

- expansion reveals nested jobnets in the same viewer and active graph scope
- expansion supplies the new visible nested set to Build Flow Graph; it does
  not redefine graph placement constraints
- presentation maps those constraints to absolute coordinates, rendered
  bounds, and rendered-surface dimensions while preserving non-overlap,
  unaffected-region stability, and relative positions within repositioned
  subtrees
- after expansion geometry is available, the viewer can fit the viewport to
  include newly visible rendered bounds
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
- keyboard and non-visual interaction can traverse predecessor, successor,
  parent, and child relationships using existing graph meaning rather than
  visual position alone
- root-jobnet scope selection, detail inspection, and return preserve a
  meaningful selected node and focus destination
- selection, relationship, search-result, and scope state remain available
  without relying only on graph lines, position, hover, color, or tooltip
  content
- necessary graph state and operation outcomes are exposed semantically and
  follow the current localization context
- graph rerendering or scope changes restore focus to the corresponding unit or
  a defined meaningful fallback
- this presentation-local search behavior does not create a shared search
  domain contract

## Behavioral Scenarios

```gherkin
Feature: Explore flow graph

Scenario: Nested jobnet expands in the current scope
  Given a visible nested jobnet
  When the user expands it
  Then its graph is revealed without changing the active root-jobnet scope
  And presentation realizes the graph placement constraints without overlap
  And the viewer can include the newly visible rendered bounds

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

Scenario: Non-visual navigation follows flow relationships
  Given a selected flow node with known JP1/AJS relationships
  When a user traverses the graph without relying on its visual layout
  Then predecessor, successor, parent, and child targets can be selected
  And the selected target and relationship are exposed semantically
```

## Acceptance Notes

- desktop and web viewers preserve the same exploration semantics
- expansion, search, selection, hover, and focus remain predictable without
  requiring a shared search implementation
- viewport behavior uses presentation-computed geometry and does not own graph
  placement constraints
- keyboard behavior, semantic state, and meaningful focus restoration remain
  usable in supported desktop and web viewers and in high-contrast themes

## Risks Or Edge Cases

- a scope-root match can obscure a more useful descendant match unless current-
  result selection remains predictable
- very deep expansion can require viewport refitting while preserving user zoom
  during later navigation
- selection synchronization can cause accidental scope changes unless scope
  actions remain explicit
- graph rerendering or scope changes can lose focus unless stable unit identity
  and a defined fallback are preserved
