# Flow nested expansion spacing

## Purpose

Keep neighboring units clear of expanded JP1/AJS jobnet panels in the current
Flow scope. Give successive nested panels enough space to distinguish their
borders and follow the connections between units.

## Source

- User report of a unit immediately above or to the left intruding into an
  expanded jobnet panel and coincident nested borders and connection lines.
- Follow-up to keep the preceding left or upper unit in place and make room
  by moving the expanded jobnet with its contents.
- [Explore Flow Graph](../../../requirements/use-cases/uc-explore-flow-graph.md)
  and [Build Flow Graph](../../../requirements/use-cases/uc-build-flow-graph.md).

## Requirements and acceptance

- When a sibling overlaps an expanded panel from the left or above, keep the
  preceding sibling in place and move the expanded jobnet and its contents
  right or down past it. A sibling that precedes on both axes requires the
  shorter clearance, with right preferred when the distances tie.
- Units in the path of the expanded panel or an affected unit move right or
  down only as required to clear the overlap. If a moved unit reaches
  another expanded frame during displacement, the unit moves past it and
  that frame stays at its settled position. When a sibling already
  overlaps a frame from the left or above before displacement, the frame
  moves to clear it.
  Preserve the relative positions within moved subtrees and keep units
  outside the affected area stable. Keep existing placement behavior for
  siblings to the right or below and deterministic precedence for multiple
  expanded panels.
- Leave about 1 em of clearance between each expanded panel and its enclosed
  rendered content, including the bounds of any inner expanded panel. When
  jobnets at adjacent depths have matching X or Y coordinates, their left or
  top borders remain visibly separate. In a representative aligned graph,
  spacing separates a previously coincident stretch of connections at
  adjacent nesting depths.
- Keep visible expanded bounds available for viewport fitting. Collapsing
  restores the matching layout for the remaining expanded set.

## Decisions and impact

- Flow presentation owns rendered rectangles and spacing. Preserve the JP1/AJS
  unit hierarchy and relation semantics supplied to Flow.
- Existing overlap, multi-level expansion, subtree movement, and fitted bounds
  checks are relevant. Add focused coverage for left and above intrusion,
  aligned nested frames, and stable unaffected siblings. Check spacing and
  representative connections through geometry evidence and applicable
  automated rendered coverage.
- Layout risks include secondary collisions as a panel or affected sibling
  moves, and clipping a frame when padding extends past the previous surface
  minimum. Multiple expanded siblings and deep nesting can compound offsets.
- This feature exercises the non-overlap contract in Build Flow Graph. Explore
  Flow Graph is the durable home for the observable spacing, if documented
  during the feature. The behavior change meets the changelog criteria.

## Compatibility

The desktop and web Flow viewers render the same expansion behavior under the
existing VS Code `^1.75.0` contract. Expansion stays in the current Flow scope.

## Non-goals

- Redesign edge routing, change JP1/AJS definition interpretation, or change
  Flow scope navigation and interaction.
