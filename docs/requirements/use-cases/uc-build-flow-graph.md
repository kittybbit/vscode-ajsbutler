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

## Acceptance Notes

- the same selected unit scope produces deterministic graph DTO content
- desktop and web presentation layers can convert the DTO into their own graph
  structures without requiring `UnitEntity` reconstruction
- flow rendering behavior remains unchanged after DTO to XyFlow mapping
- representative graph-oriented fixtures in `sample/` should be reusable for
  regression coverage instead of rebuilding large inline definitions

## Risks Or Edge Cases

- cyclic or malformed relationships must not force
  UI-library-specific workarounds into the use case
- selected scope changes must preserve current-node and ancestor rendering semantics
- large sample definitions should continue to build graph DTOs without
  presentation-layer shortcuts
