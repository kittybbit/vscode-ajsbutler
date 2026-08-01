# UC: Explore Flow Graph

## Goal

Let users reveal, search, select, and focus JP1/AJS units within the current
flow scope while preserving predictable navigation and viewport state.

## Trigger

- the user expands or collapses a nested jobnet
- the user enters an N or RC unit's internal flow or returns to its containing
  flow scope
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
- active N or RC flow scope and a meaningful scope-entry or scope-return focus
  destination
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
- visible root-jobnet scope rows outside the active scope remain focusable in
  the flow tree but are not selectable; Alt+Enter explicitly opens the focused
  eligible scope
- visible first-level group rows outside the active scope remain focusable for
  sibling-tree navigation but are not selectable or graph scopes
- flow-tree and graph selection and hover remain synchronized
- synchronized selection or hover does not implicitly change graph scope
- relationship focus preserves unrelated nodes and edges with weaker emphasis
  instead of removing them
- supporting tree and detail panels may collapse responsively or explicitly
  without clearing selection, hiding access to their actions, or overlaying the
  graph
- keyboard interaction can move to the center-to-center nearest rendered node
  above, below, left, or right of the current node without depending on
  predecessor or successor relationships; equal distances prefer the upper
  then left candidate
- Enter on a focused N or RC node with internal units opens that unit as the
  active flow scope; it does not select a child by parser or rendered order
- Escape from a nested N or RC flow scope returns to the nearest containing N
  or RC scope; a root-jobnet scope has no Escape target
- after Enter, the opened scope's rendered root node is selected and focused;
  after Escape, the scope that was left is selected and focused in its
  containing scope
- Enter and Escape use the existing flow-scope transition behavior, while
  Shift+Down and Shift+Up remain same-scope inline nested-jobnet expansion and
  collapse operations
- root-jobnet scope selection, detail inspection, and return preserve a
  meaningful selected node and focus destination
- from a focused graph node, unmodified D focuses its detail pane and
  unmodified L focuses the flow selector at the current scope root, falling
  back to the first eligible root jobnet
- from an enabled in-scope flow-tree row, unmodified Enter selects and focuses
  the corresponding graph node without opening a scope; Space remains
  selection-only and Alt+Enter remains the explicit scope action
- from the flow selector, unmodified Escape returns focus to the saved graph
  node without changing scope; from the detail pane, unmodified R returns
  focus without closing it and Escape closes the pane or first closes its
  definition dialog
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

Scenario: Flow-tree navigation opens a sibling scope explicitly
  Given the active root-jobnet and another visible eligible root-jobnet scope
  When the user moves focus to the sibling scope with Up, Down, Home, or End
  Then the sibling row remains disabled for selection
  When the user presses Alt+Enter
  Then the sibling root-jobnet becomes the active flow scope
  And its graph is rendered and focused after the scope is ready

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

Scenario: Keyboard navigation follows rendered spatial direction
  Given a selected flow node and other rendered flow nodes
  When the user presses an unmodified arrow key
  Then the nearest node in that rendered direction is selected and focused
  And equal center-to-center distances prefer the upper then left node
  And an unavailable direction leaves selection and focus unchanged

Scenario: Keyboard navigation enters an internal flow scope
  Given a focused N or RC node with internal units
  When the user presses Enter
  Then that unit becomes the active flow scope
  And its rendered root node is selected and focused after the graph is ready

Scenario: Keyboard navigation returns to a containing flow scope
  Given an active nested N or RC flow scope
  When the user presses Escape from a focused graph node
  Then the nearest containing N or RC scope becomes active
  And the scope that was left is selected and focused

Scenario: Flow detail and selector shortcuts preserve graph focus
  Given a focused graph node and its current flow scope
  When the user presses D or L
  Then D focuses the selected node detail heading or first enabled action
  And L focuses the current scope root in the flow selector
  When the user presses R in details
  Then focus returns to the saved graph node without closing details
  When the user presses Escape in details or the selector
  Then the active region closes or returns focus without changing graph scope

Scenario: Flow tree and graph focus handoffs match list-view semantics
  Given a focused flow graph node and its unit-tree row
  When the user presses unmodified L from the graph or Enter from an enabled
    in-scope tree row
  Then focus moves between the graph node and the flow selector's defined
    target row without changing the selected unit or flow scope
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
- Enter and Escape can race asynchronous scope rendering unless focus targets
  are resolved only after the destination graph is ready
