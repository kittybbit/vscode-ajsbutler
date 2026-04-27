# UC: Build Flow Graph

## Goal

Transform normalized unit relationships into a UI-independent flow graph DTO.

## Trigger

The user opens or refreshes a flow-oriented view for a selected unit scope.

## Inputs

- selected normalized unit scope
- ancestor chain for the selected scope
- relation data between visible units

## Outputs

- graph DTO with nodes and edges
- no XyFlow-specific types in use case output

## Rules

- graph construction logic must be testable without webview runtime
- layout intent may be expressed in DTO metadata,
  but UI-library-specific coordinates stay outside the use case
  when practical
- parser internals must not be exposed in the graph DTO

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
```

## Acceptance Notes

- desktop and web presentation layers can convert the DTO into their own graph
  structures without requiring `UnitEntity` reconstruction
- flow rendering behavior remains unchanged after DTO to XyFlow mapping
- representative graph-oriented fixtures in `sample/` should be reusable for
  regression coverage instead of rebuilding large inline definitions

## Risks Or Edge Cases

- selected scope changes must preserve current-node and ancestor rendering semantics
- large sample definitions should continue to build graph DTOs without
  presentation-layer shortcuts
