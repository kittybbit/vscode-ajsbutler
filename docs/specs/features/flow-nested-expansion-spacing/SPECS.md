# Flow nested expansion spacing

## Purpose

Keep neighboring units clear of expanded JP1/AJS jobnet panels in the current
Flow scope. Give successive nested panels enough space to distinguish their
borders and follow the connections between units.

## Source

- User report of a unit immediately above or to the left intruding into an
  expanded jobnet panel and coincident nested borders and connection lines.
- [Explore Flow Graph](../../../requirements/use-cases/uc-explore-flow-graph.md)
  and [Build Flow Graph](../../../requirements/use-cases/uc-build-flow-graph.md).

## Requirements and acceptance

- When an adjacent sibling's displayed rectangle overlaps the expanded panel,
  move it far enough to the right, down, or both to clear the panel. Cover
  siblings whose origins sit slightly left of or above the expanded jobnet,
  including one that starts both left and above. Determine intrusion from the
  occupied rectangles. Preserve the relative positions within moved subtrees
  and keep units outside affected regions stable.
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
- Layout risks include shifting an intruding unit into another sibling and
  clipping the expanded frame when padding extends past the previous surface
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
