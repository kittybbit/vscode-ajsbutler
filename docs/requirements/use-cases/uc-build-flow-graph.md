# UC: Build Flow Graph

## Goal

Build deterministic flow-graph content for a selected JP1/AJS root-jobnet scope
from normalized units and relationships.

## Trigger

- a flow-oriented view needs graph data for a selected scope
- graph data must be rebuilt after the selected scope or visible nested set
  changes

## Inputs

- selected normalized unit and ancestor context
- normalized units and relations within the resolved root-jobnet scope
- nested jobnets currently requested as visible

## Outputs

- stable graph nodes and edges
- stable unit identity, hierarchy, and nesting information needed by a viewer
- malformed or unsupported relation information that can be reported without
  presentation-specific workarounds
- graph metadata needed to preserve observable layout invariants

## Rules

- graph construction remains independent of parser structures, webview runtime,
  and UI-library types
- the same normalized input, resolved scope, and visible nested set produce the
  same graph content and placement intent
- graph nodes and relations use stable JP1/AJS identity and hierarchy
- a job group may appear in scope-selection context but is not an active flow
  scope
- selecting a job group resolves graph scope to a descendant root jobnet when
  one exists
- visible nested jobnets remain inside the current root-jobnet scope
- expanded panels and visible sibling subtrees do not overlap
- unrelated upper-left graph regions remain fixed when a nested area expands
- moving an affected subtree preserves relative positions within that subtree
- rendered bounds may be recalculated by presentation, but doing so must not
  change graph identity, relations, or scope
- full JP1/AJS View feature parity is not required

## Behavioral Scenarios

```gherkin
Feature: Build flow graph

Scenario: Selected scope produces deterministic graph content
  Given normalized units and relations for a selected root-jobnet scope
  When the flow graph is built
  Then the same input produces the same nodes, edges, and nesting information

Scenario: Parser and UI internals stay outside graph output
  Given normalized units and relations
  When the flow graph is built
  Then its output contains neither parser structures nor UI-library types

Scenario: Malformed relations remain an application concern
  Given normalized relation information containing a malformed link
  When the flow graph is built
  Then the malformed relation can be reported without a presentation workaround

Scenario: Nested visibility produces deterministic placement
  Given the same root-jobnet scope and visible nested-jobnet set
  When graph data is rebuilt after different expansion orders
  Then final placement intent is identical

Scenario: Expanded sibling subtrees do not overlap
  Given visible expanded sibling subtrees in one graph container
  When graph placement is resolved
  Then their visible occupied regions do not overlap

Scenario: Nested growth preserves unaffected and relative positions
  Given a nested subtree grows after expansion
  When affected graph regions are repositioned
  Then unrelated upper-left regions do not move
  And relative positions within each moved subtree remain stable

Scenario: Job groups resolve to root-jobnet scope
  Given scope-selection context containing a job group and root jobnets
  When graph scope is requested from the job group
  Then a descendant root jobnet is used when one exists
  And the job group itself is not used as the active flow scope
```

## Acceptance Notes

- desktop and web presentation layers can map the same graph result into their
  rendering structures
- representative graph fixtures should cover nested, malformed, large, and
  encoded definitions

## Risks Or Edge Cases

- a job group without a descendant root jobnet has no meaningful flow scope
- malformed relations must not be silently converted into plausible edges
- deep nesting can enlarge ancestor bounds and must preserve the observable
  non-overlap and stability rules
- large definitions must not require presentation-only graph shortcuts
