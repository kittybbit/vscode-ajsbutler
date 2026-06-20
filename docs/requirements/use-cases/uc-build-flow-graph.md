# UC: Build Flow Graph

## Goal

Transform normalized unit relationships into flow graph data and viewer behavior
that can be rendered consistently in desktop and web hosts.

## Trigger

The user opens or refreshes a flow-oriented view for a selected unit scope.

## Inputs

- selected normalized unit scope
- ancestor chain for the selected scope
- relation data between visible units

## Outputs

- graph DTO with nodes and edges
- no XyFlow-specific types in use case output
- visible graph state for the selected scope, including expanded nested jobnets
  when the viewer requests them
- search match metadata that presentation layers can use to reveal and focus
  matching units inside the current scope

## Rules

- graph construction logic must be testable without webview runtime
- layout intent may be expressed in DTO metadata, but UI-library-specific
  coordinates stay outside the use case when practical
- parser internals must not be exposed in the graph DTO
- visual resemblance to JP1/AJS View is a product direction, but full JP1/AJS
  View feature parity is not required
- nested jobnets may be revealed progressively in the same viewer without
  changing the selected document
- nested panels should stay anchored to the expanded unit that owns them and
  should not require reconstructing `UnitEntity` in presentation code
- expanded nested layout must be recomputed from the selected scope and the full
  expanded-unit set so the same expanded set always yields the same final
  placement
- expanded nested units must be processed in stable order by `depth`,
  `layout.v`, `layout.h`, `absolutePath`
- each expanded unit must be treated as one occupied rectangle covering the
  visible node, its expanded panel, and expanded descendant panels that remain
  inside that subtree
- sibling subtrees inside the same container must not overlap by occupied
  rectangle after expanded layout is resolved
- collision resolution for nested expansion may push layout only to the right or
  downward and must keep unaffected upper-left areas fixed
- collision resolution must move whole subtrees rather than isolated nodes so
  descendant relative positions stay stable
- when nested expansion changes visible graph bounds, the viewer must be able to
  refit the current view to include newly visible nodes
- current-scope flow search uses case-insensitive contiguous partial matching
  across unit name, comment, and path
- current-scope flow search may reveal collapsed ancestor jobnets needed to show
  matching units before focusing them
- when multiple visible units match, every visible match can be highlighted
  while focus remains anchored to a predictable first match
- users can move predictably among all current-scope search matches and return
  to previous matches without changing the active graph scope
- graph scope, selected node, current search result, and hovered node are
  distinct viewer concepts even when they temporarily reference the same unit
- selecting a graph node may expose lightweight relationship and status context
  without automatically opening unit-definition details
- the flow selector and graph may synchronize selection and hover while keeping
  scope changes explicit
- relationship focus keeps unrelated nodes and edges visible and weakens them
  visually rather than removing them
- the standard React Flow MiniMap remains optional viewer chrome and may reflect
  selection, search, and relationship-focus states
- node presentation may become card-based, but node dimensions must remain
  compatible with deterministic positioning and expanded nested layout
- flow selector entries may show job groups, but the active flow graph scope
  must resolve to a root jobnet rather than a job group

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Build flow graph

Scenario: Selected scope produces deterministic graph content
  Given normalized unit relationships for a selected unit scope
  When the flow graph DTO is built for that scope
  Then the graph contains deterministic nodes and edges for the same input

Scenario: Parser internals are hidden from graph output
  Given normalized unit relationships for visible units
  When the flow graph DTO is built
  Then the graph output does not expose parser-internal structures

Scenario: Malformed relationships stay outside presentation workarounds
  Given normalized unit relationships that include malformed links
  When the flow graph DTO is built
  Then the use case reports graph content without requiring UI-library types

Scenario: Nested jobnets can expand in the current graph
  Given a visible flow graph with a nested jobnet
  When the nested jobnet is expanded
  Then the nested graph is revealed in the same viewer scope
  And the parent graph can still be fit into view

Scenario: Expanded layout is deterministic for the same expanded set
  Given a visible flow graph with two expandable nested jobnets
  When the first layout is built after expanding A then B
  And the second layout is built for the same expanded set after
    expanding B then A
  Then `positionOverrides` are identical
  And `nodeDecorations` are identical

Scenario: Expanded sibling panels and visible nodes do not overlap
  Given a visible flow graph with expanded sibling subtrees in one container
  When the expanded layout is built
  Then expanded panels do not overlap each other
  And expanded panels do not overlap visible nodes from sibling subtrees

Scenario: Expanded layout moves only the affected right/down scope
  Given a visible flow graph with a deep nested expansion
  When the parent panel grows because of the expanded descendant
  Then collision resolution propagates to the affected parent-level scope
  And unrelated upper-left nodes do not move

Scenario: Current-scope search reveals matches
  Given a visible flow graph with collapsed ancestor jobnets
  When current-scope flow search matches a descendant unit
  Then the ancestors needed to show the matching unit are revealed
  And all visible matches are highlighted

Scenario: Current-scope search traverses multiple matches
  Given multiple units in the current flow scope match the search query
  When the user moves to the next or previous result
  Then the current result is visually distinct from the other matches
  And the viewport reveals the current result
  And the active graph scope remains unchanged

Scenario: Selected node exposes graph context
  Given a visible flow graph node
  When the user selects that node
  Then lightweight relationship and status context is available
  And unit-definition details remain closed until explicitly requested

Scenario: Relationship focus preserves the whole graph
  Given a selected node with upstream, downstream, and unrelated elements
  When relationship focus is enabled
  Then upstream and downstream elements are distinguishable
  And unrelated elements remain visible with weaker emphasis

Scenario: Tree and graph interaction stay synchronized
  Given the flow selector and graph are visible
  When the user selects or hovers a unit in either surface
  Then the corresponding unit is emphasized in the other surface
  And the active graph scope changes only through an explicit scope action

Scenario: Job groups remain visible but are not flow scopes
  Given the flow selector contains job groups and root jobnets
  When the user selects a visible job group entry
  Then the job group is not used as the active flow graph scope
  And selectable flow scopes remain root jobnets
```

## Acceptance Notes

- desktop and web presentation layers can convert the DTO into their own graph
  structures without requiring `UnitEntity` reconstruction
- flow rendering behavior remains unchanged after DTO to XyFlow mapping
- the completed flow-viewer maintainability refactor kept diagnostics,
  expanded-flow graph/layout orchestration, `FlowContents` composition, and
  presentation-local naming/export cleanup inside existing behavior contracts
- `src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts` owns
  presentation-local expanded layout orchestration, including stable expansion
  ordering, occupied-box calculation, subtree movement, and collision
  resolution, while preserving the use-case output contract
- representative graph-oriented fixtures in `sample/` should be reusable for
  regression coverage instead of rebuilding large inline definitions
- layout details that depend on rendered node bounds stay presentation-local,
  but the behavior contract must keep expansion, search, and focus predictable
  for users

## Risks Or Edge Cases

- selected scope changes must preserve current-node and ancestor rendering
  semantics
- large sample definitions should continue to build graph DTOs without
  presentation-layer shortcuts
- deep expansion can enlarge an ancestor panel, so collision propagation must be
  checked at each affected container level
- search behavior can feel inert if the scope root matches before a more visible
  descendant, so descendant matches may need priority when that produces clearer
  focus behavior
- explicit job-group flow layout support would require a separate behavior
  decision because job groups can contain multiple root jobnets without display
  coordinates for a single job-group-scoped graph
