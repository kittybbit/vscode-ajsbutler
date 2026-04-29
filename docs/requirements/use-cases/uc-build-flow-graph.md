# UC: Build Flow Graph

## Goal

Transform normalized unit relationships into flow graph data and viewer
behavior that can be rendered consistently in desktop and web hosts.

## Trigger

The user opens or refreshes a flow-oriented view for a selected unit scope.

## Inputs

- selected normalized unit scope
- ancestor chain for the selected scope
- relation data between visible units

## Outputs

- graph DTO with nodes and edges
- no XyFlow-specific types in use case output
- visible graph state for the selected scope, including expanded nested
  jobnets when the viewer requests them
- search match metadata that presentation layers can use to reveal and focus
  matching units inside the current scope

## Rules

- graph construction logic must be testable without webview runtime
- layout intent may be expressed in DTO metadata,
  but UI-library-specific coordinates stay outside the use case
  when practical
- parser internals must not be exposed in the graph DTO
- visual resemblance to JP1/AJS View is a product direction, but full
  JP1/AJS View feature parity is not required
- nested jobnets may be revealed progressively in the same viewer without
  changing the selected document
- nested panels should stay anchored to the expanded unit that owns them and
  should not require reconstructing `UnitEntity` in presentation code
- when nested expansion changes visible graph bounds, the viewer must be able
  to refit the current view to include newly visible nodes
- current-scope flow search uses case-insensitive contiguous partial matching
  across unit name, comment, and path
- current-scope flow search may reveal collapsed ancestor jobnets needed to
  show matching units before focusing them
- when multiple visible units match, every visible match can be highlighted
  while focus remains anchored to a predictable first match

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

Scenario: Current-scope search reveals matches
  Given a visible flow graph with collapsed ancestor jobnets
  When current-scope flow search matches a descendant unit
  Then the ancestors needed to show the matching unit are revealed
  And all visible matches are highlighted
```

## Acceptance Notes

- desktop and web presentation layers can convert the DTO into their own graph
  structures without requiring `UnitEntity` reconstruction
- flow rendering behavior remains unchanged after DTO to XyFlow mapping
- representative graph-oriented fixtures in `sample/` should be reusable for
  regression coverage instead of rebuilding large inline definitions
- layout details that depend on rendered node bounds stay presentation-local,
  but the behavior contract must keep expansion, search, and focus predictable
  for users

## Risks Or Edge Cases

- selected scope changes must preserve current-node and ancestor rendering semantics
- large sample definitions should continue to build graph DTOs without
  presentation-layer shortcuts
- expansion ordering can affect layout; presentation state should preserve a
  predictable order rather than deriving it from unordered sets
- search behavior can feel inert if the scope root matches before a more
  visible descendant, so descendant matches may need priority when that
  produces clearer focus behavior
