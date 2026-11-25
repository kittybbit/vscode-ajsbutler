# Feature Tasks: Flow nested expansion spacing

## Agent Brief

- Improve [inline expansion](SPECS.md#requirements-and-acceptance) with one
  slice for panel spacing and overlapping siblings.
- Keep rendered placement in the shared Flow webview. Use the geometry and
  renderer checks below.
- Obtain independent plan review and explicit Human Approval for the listed
  paths, then commit the plan before starting implementation.

## Current state

- Lifecycle state: `PLAN_APPROVED`
- Next step: commit the approved plan before implementation.
- Independent plan review: `PLAN_READY` in the current conversation for
  [the reviewed manifest](</private/tmp/ajsbutler-flow-plan-review.d2kVn2XD/manifest.sha256>).
- Gate evidence: [intake](</private/tmp/ajsbutler-flow-intake.E5272k51/intake.md>)
  and [plan validation](</private/tmp/ajsbutler-flow-plan-review.d2kVn2XD/plan.md>).

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Layer 1 is `codex/flow-nested-expansion-spacing` targeting `main`, with base
  `19b5528ae4ca14583571032a0b52aad18f86e410`. PR and published head are pending.
- The layer contains the complete change. Main records the reviewed slice head,
  required current-head checks, closure commit, and merge in its PR.
- Feature Exit updates
  [Explore Flow Graph](../../../requirements/use-cases/uc-explore-flow-graph.md)
  with the observable overlap and spacing rule, and removes this feature's
  `SPECS.md` and `TASKS.md` through the closure gate. Build Flow Graph already
  states the non-overlap contract and the roadmap needs no change. The slice
  itself records the user-visible fix in `CHANGELOG.md`.

Apply the [native stack contract](../../README.md#github-standard-stacked-pull-requests).

## Human Approval

- Status: Approved
- Approved at: approved in the current conversation on 2026-11-25.
- Approved scope: Slice 1 and its exact path list below, as independently
  reviewed. Feature Exit has a separate approval gate.

Apply [Human Approval](../../README.md#human-approval) and the
[approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Slice 1: Clear expanded panels and space nested frames

### Behavior and implementation

- Calculate each expanded frame from all four extents of its visible subtree,
  including enclosed frames. Apply one graph font unit, measured by the
  existing `basePx`, beyond the union on each side. Keep frame offsets
  relative to the owning node for the existing renderer and viewport fitting.
- Inset direct children of each opened level by one graph font unit right
  and down during the existing initial anchor-relative positioning. Apply
  the same displacement to grid and condition children and let descendants
  inherit the anchor offset. This gives connections at different depths
  different handle coordinates in aligned cases, while preserving the
  relative positions within each level and within a moved subtree.
- Keep the existing growth-phase constraints for ordinary row and column
  offsets. In sibling layout, use current occupied rectangles to clear
  actual collisions with expanded frames, including a regular sibling
  whose origin precedes the frame owner's on either or both axes. For a
  panel and an ordinary sibling, move the ordinary sibling clear of the
  panel. For two frames, preserve deterministic layout precedence.
- Preserve existing eligible rightward and downward directions for a
  collision where the current placement can clear it. Whenever an actual
  panel collision has no eligible direction, move right or down by the
  smaller clearance distance, preferring right on a tie. This includes
  aligned origins on either or both axes. Refresh occupied bounds after
  movement and recheck collisions along the affected path so the moved unit
  clears any additional sibling it reaches. Keep updates monotone and
  bounded, with deterministic results for the same expansion set.
- Preserve relative positions inside moved subtrees through existing anchor
  offsets. Keep unaffected units stable, preserve normal non-expanded
  placement, and regenerate collapsed layout from the remaining expansion
  set. Keep frame extents available to viewport fitting, including negative
  offsets.

### Exact paths proposed for approval

Runtime paths:

- `src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts`
- `src/presentation/webview/editor/ajsFlow/expandedFlowGraphGeometry.ts`
- `src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts`
- `src/presentation/webview/editor/ajsFlow/expandedFlowGraphSiblingCollision.ts`
- `src/presentation/webview/editor/ajsFlow/expandedFlowGraphTypes.ts`

Validation and change record:

- `src/test/suite/buildExpandedFlowGraph.test.ts`
- `src/test/suite/flowGraphView.test.ts`
- `CHANGELOG.md`

The selected `TASKS.md` records gate and evidence updates. Application
placement DTOs, ordinary graph positioning, edge routing, extension host,
test harness, configuration, generated files, and dependencies are excluded.

### Solution Shape and impact

- Flow webview geometry owns the inset, frame dimensions and sibling placement.
  Application retains unit membership, JP1/AJS relationships, and placement
  constraints, without DTO or dependency changes. Build on the current
  bottom-up layout, rectangle helpers, and anchored subtree offsets.
- XYFlow consumes existing positions and fit-bound nodes and routes the
  existing edges. Its renderer does not position anchor-relative children
  or size the enclosing frame before render. Its existing smoothstep helper
  verifies connection geometry. This uses the existing panel decorations,
  renderer boundary, and dependency.
- Direct impact covers expanded frames and affected same-scope siblings.
  Transitive impact covers ancestor frames, descendant movement, edge
  endpoints, and generated fit-bound nodes. Hidden content, navigation,
  search, identifiers, semantics, and VS Code `^1.75.0` stay in the existing
  contracts. The same webview code serves both hosts.
- Risks are touching-box rounding, secondary collisions, alignment across
  multiple expanded siblings, and accumulating offsets in deep graphs.
  Architecture automation proves its cataloged rules. Review judges the
  ownership, framework boundary, layout invariants, and cost separately.
  Route required changes to the approved paths, algorithm boundary, or
  validation coverage through Main before editing outside this scope.

### Validation

- Compile and run the expanded Flow geometry and Flow Graph View suites.
  Cover a sibling starting left in the same row, above in the same column,
  left and above, and at a coincident origin. Cover an unaffected sibling
  and an affected-path collision. Cover shared underlying X and Y alignment
  at two graph font sizes, layering of the frame bounds, the uniform level
  inset, subtree stability, repeated and reordered expansion, collapse,
  and existing well-separated placements. Replace the old fixed
  frame-origin assertion with content enclosure and stable unit anchors.
- Exercise the existing renderer-data boundary with a representative
  connected aligned fixture. Assert fit-bound rectangles reflect the frames
  and relation endpoints retain their IDs. From realized node coordinates,
  build smoothstep paths using the installed XYFlow helper with the
  production right and left handles at mid-height and default path options.
  Demonstrate a horizontal segment in the outer relation that overlaps the
  inner relation without the inset and remains at its Y coordinate when
  the inner relation moves one font unit below it. Assert overlap and
  separation of that particular segment using its coordinates.
  Use the fixture basis in the plan evidence.
- Run `rtk pnpm run test:compile`, then
  `rtk pnpm exec mocha --ui tdd` with the compiled
  `buildExpandedFlowGraph.test.js`, `flowGraphView.test.js`, and
  `architectureDependencyRules.test.js` under `out/test/suite/`.
  Run `rtk pnpm run build` for both bundles. Shared contracts and hosts
  are outside this slice. Full host validation follows the PR's required
  Verify checks, including the automated desktop and web suites.
- Record the [qlty baseline/final and aggregate](../../validation.md#quality-contract),
  `rtk git diff --check`, exact path review, and evidence identities under
  the [Evidence Contract](../../evidence.md#evidence-contract). Record any
  unavailable required run as Missing. Preserve test and check gates for
  the exact published head.
