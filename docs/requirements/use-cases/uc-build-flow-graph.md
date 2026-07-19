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
- stable containment and sibling ordering
- deterministic placement constraints and the affected-subtree scope to which
  those constraints apply
- malformed or unsupported relation information that can be reported without
  presentation-specific workarounds

## Responsibility Boundary

| Owner              | Owns                                               |
| ------------------ | -------------------------------------------------- |
| Build Flow Graph   | Structure, ordering, constraints, affected scope   |
| Presentation       | Coordinates, bounds, dimensions, renderer values   |
| Explore Flow Graph | Expansion, viewport fitting, centering, zoom state |

Build Flow Graph defines what placement results must satisfy, but it does not
calculate presentation geometry. Explore Flow Graph consumes the rendered
result without redefining graph placement constraints.

## Rules

- graph construction remains independent of parser structures and presentation-
  framework types
- the same normalized input, resolved scope, and visible nested set produce the
  same graph content, ordering, placement constraints, and affected-subtree
  scope
- graph nodes and relations use stable JP1/AJS identity and hierarchy
- a job group may appear in scope-selection context but is not an active flow
  scope
- selecting a job group resolves graph scope to a descendant root jobnet when
  one exists
- visible nested jobnets remain inside the current root-jobnet scope
- placement constraints preserve containment and stable sibling order, separate
  expanded sibling subtrees, and identify the smallest affected subtree that
  may be repositioned after nested growth
- an expanded subtree is one placement unit containing its owning node and all
  visible nested descendants
- the affected-subtree scope excludes unrelated upper-left regions, and
  placement constraints require each affected subtree to retain its internal
  relative positions
- presentation realizes the constraints as absolute coordinates, rendered
  bounds, and dimensions so expanded subtrees do not overlap
- presentation geometry must not change graph identity, relations, scope,
  containment, ordering, or affected-subtree membership
- full JP1/AJS View feature parity is not required

## Behavioral Scenarios

```gherkin
Feature: Build flow graph

Scenario: Selected scope produces deterministic graph content
  Given normalized units and relations for a selected root-jobnet scope
  When the flow graph is built
  Then the same input produces the same nodes, edges, and nesting information

Scenario: Parser and presentation internals stay outside graph output
  Given normalized units and relations
  When the flow graph is built
  Then its output contains neither parser structures nor presentation geometry

Scenario: Malformed relations remain an application concern
  Given normalized relation information containing a malformed link
  When the flow graph is built
  Then the malformed relation can be reported without a presentation workaround

Scenario: Nested visibility produces deterministic placement constraints
  Given the same root-jobnet scope and visible nested-jobnet set
  When graph data is rebuilt after different expansion orders
  Then containment and sibling ordering are identical
  And placement constraints and affected-subtree scope are identical

Scenario: Placement constraints define non-overlapping realization
  Given visible expanded sibling subtrees in one graph container
  When graph placement constraints are built
  Then the constraints require separation between the sibling subtrees
  And presentation geometry realizes them without overlap

Scenario: Nested growth preserves unaffected and relative positions
  Given a nested subtree grows after expansion
  When placement constraints and the affected-subtree scope are rebuilt
  Then the affected scope excludes unrelated upper-left regions
  And presentation leaves those unrelated regions fixed
  And presentation preserves relative positions within each repositioned
    subtree

Scenario: Job groups resolve to root-jobnet scope
  Given scope-selection context containing a job group and root jobnets
  When graph scope is requested from the job group
  Then a descendant root jobnet is used when one exists
  And the job group itself is not used as the active flow scope
```

## Acceptance Notes

- desktop and web presentation layers can map the same graph result into their
  rendering structures
- presentation implementations satisfy the same placement constraints even
  when their coordinate and bounds calculations differ
- representative graph fixtures should cover nested, malformed, large, and
  encoded definitions

## Risks Or Edge Cases

- a job group without a descendant root jobnet has no meaningful flow scope
- malformed relations must not be silently converted into plausible edges
- deep nesting can enlarge presentation-owned ancestor bounds and must preserve
  the application-owned placement constraints and observable stability rules
- large definitions must not require presentation-only graph shortcuts
