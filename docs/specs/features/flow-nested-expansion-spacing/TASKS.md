# Feature Tasks: Flow nested expansion spacing

## Agent Brief

- Improve [inline expansion](SPECS.md#requirements-and-acceptance) with one
  slice for panel spacing and overlapping siblings.
- Keep rendered placement in the shared Flow webview. Use the geometry and
  renderer checks below.
- Review the revised collision precedence against the committed replan and
  the retained implementation evidence.

## Current state

- Lifecycle state: `SLICE_APPROVED`
- Next step: commit the approved Slice 1 patch and publish its PR.
- Approved replan commit: `616cdf7e26be83066eba1f9f13835ce05e860fbf`.
- Independent replan review: `PLAN_READY` in the current conversation for
  [the reviewed manifest](/private/tmp/ajsbutler-flow-replan-review.lw99IOuO/manifest.sha256).
- Previous independent plan review: `PLAN_READY` in the current conversation for
  [the reviewed manifest](/private/tmp/ajsbutler-flow-plan-review.d2kVn2XD/manifest.sha256).
- Gate evidence: [intake](/private/tmp/ajsbutler-flow-intake.E5272k51/intake.md)
  and [plan validation](/private/tmp/ajsbutler-flow-plan-review.d2kVn2XD/plan.md).
- Previous approved plan commit: `7bc2a9e0211d6bd88e22feebdc1a1f6d939d293d`.
- Replan evidence: [scope and validation](/private/tmp/ajsbutler-flow-replan-review.lw99IOuO/plan.md).

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
- Approved at: approved in the current conversation on 2026-11-26.
- Approved scope: revised Slice 1 and its exact path list below, as
  independently reviewed. Feature Exit has a separate approval gate.
- Previous approval: the human approved the original Slice 1 scope in the
  current conversation on 2026-11-25. It is recorded on the previous approved
  plan commit.

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
- Keep the existing panel intrusion pass and ordinary row and column
  growth constraints before resolving sibling collisions. Keep ordinary
  sibling spacing. Classify precedence as needed using the positions
  after ordinary sibling spacing and before the final collision phase
  moves panels or propagates displacement. A preceding axis has a
  strictly smaller ordinary sibling origin than the panel owner.
  Use current occupied rectangles to test contact and measure clearance.
- For a panel that contacts a preceding ordinary sibling, move the
  panel's owning unit and whole anchored subtree along the preceding
  axis. This means right for a left sibling on the same row, and down
  for an upper sibling in the same column. In a mixed-axis contact, the
  preceding axis determines the clearance direction. When both axes
  precede, choose the smaller positive clearance, preferring right on
  a tie. Keep precedence stable as positions change during resolution.
- Process panels in the existing stable order. Clear each moving panel
  against the preceding ordinary obstacles it actually reaches and
  earlier resolved panels. Resolve a preceding ordinary sibling's
  existing overlap with a panel before ordinary displacement starts,
  including when multiple expanded panels are present. For later ordinary
  siblings, preserve the existing rightward and downward directions. If both
  origins initially coincide, treat the ordinary sibling as the movable
  target and choose the shorter clearance when there is no eligible
  axis, preferring right on a tie.
- After panel clearance, resolve affected ordinary targets against the
  updated panel and sibling bounds in stable order. Once an affected
  ordinary unit moves, it remains the moving target if its displacement
  creates a new overlap with any other settled expanded panel. Keep that
  panel fixed through the rest of the displacement, even if the ordinary
  unit's earlier origin precedes the panel's on the collision axis.
  Apply the same rule to an ordinary unit moved by the resulting chain.
  Keep unrelated units in place. Recheck each affected target along its
  displacement and avoid touching-edge retriggers. Preserve monotone,
  bounded obstacle scanning and a single committed subtree translation
  per moved target. Use current rectangles for collision checks.
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
- Risks are touching-box rounding, secondary collisions, reclassifying
  precedence after a shift, and accumulating offsets in dense or deep graphs.
  Architecture automation proves its cataloged rules. Review judges the
  ownership, framework boundary, layout invariants, and cost separately.
  Route required changes to the approved paths, algorithm boundary, or
  validation coverage through Main before editing outside this scope.

### Preserved implementation evidence

- The existing anchor initializer shifts direct children at every expanded
  level. The bottom-up bounds builder encloses owner and descendant rectangles
  and inner frames, with one `basePx` of clearance on each side. Frame offsets
  still feed the existing XYFlow fit nodes.
- Under the previous plan, the collision phase gave panels priority over
  ordinary siblings. Its optimized scan plans movement with local rectangles,
  discards permanently passed obstacles, and applies the total offset once
  per target. Retain that performance property for the revised precedence.
- The prior corrected patch received `SLICE_READY` in the current
  conversation. The changed behavior supersedes that review for readiness.
  Preserve the patch during Replanning. Revalidate and independently review
  the revised patch after the new plan is approved and committed.

### Revised implementation shape

- Ordinary grid spacing precedes panel clearance. Each panel classifies
  preceding ordinary units against its starting position and applies one
  anchored translation after clearing their occupied rectangles and earlier
  panels. Same-origin or later ordinary siblings clear the settled frames.
- A moving ordinary target clears any frame it reaches. The ordered scan
  keeps the established clearance directions and permanently removes passed
  obstacles before applying the accumulated translation once per target.
- The tests link both acceptance themes to occupied geometry, fit bounds,
  and realized smoothstep segments. The revised slice records that mapping
  here.

### Validation

- Compile and run the expanded Flow geometry and Flow Graph View suites.
  Cover same-row left, same-column above, both preceding axes including a
  clearance tie, mixed-axis precedence, and coincident origins. Compare
  with collapse to show that the preceding sibling stays in place and all
  descendants translate with the owning unit. Verify blockers reached by
  horizontal and vertical panel displacement, final clearance, an
  unrelated unit, and existing right/below and two-panel behavior.
- Cover a same-row collision chain with frame A at x `[0, 12]`,
  ordinary unit U at x `[6, 11]`, and frame B at x `[14, 23]`, or an
  equivalent scaled fixture. Choose vertical clearance greater than
  horizontal clearance. A first moves U into B's range. U then clears
  B to x `[23, 28]`. Assert both frame positions stay fixed, all pairs
  clear, results are repeatable, and a distant unit stays fixed. Add
  the direct-overlap control with U initially at x `[13, 18]`: B moves
  to x `[18, 27]` while U and A stay fixed.
- Retain shared underlying X and Y alignment at two graph font sizes,
  layering of frame bounds, the level inset, subtree stability, repeated
  and reordered expansion, collapse, and existing well-separated placement.
- Retain the corrected dense-sibling regression and the recorded 800- and
  1,200-sibling diagnostic probe sizes. Exercise both a preceding dense
  group that stays put and a downstream group that must clear in stable
  order. Preserve deterministic geometry and unrelated positions.
  Compare the downstream probe against the prior corrected scan on the
  same layout and runner. Record any timings as diagnostics, with geometry
  assertions in the test and no wall-clock test threshold.
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

### Previous implementation results

- [Validation and correction evidence](/private/tmp/ajsbutler-flow-correction.2IiAnhap/validation.md)
  retains the approved scope, final patch identity, dense probe results,
  desktop and web builds, test and architecture results, and Qlty records
  for the preserved patch.
- No completion commit or published layer exists. Repeat final validation
  for the revised patch, followed by independent implementation review and
  Completion Approval. Required host suites, Verify and Qlty Cloud follow
  publication on the exact PR head.

### Revised implementation results

- [Validation evidence](/private/tmp/ajsbutler-flow-revised.0Gt2BUBP/validation.md)
  records the final patch, approved paths, and check results for this revision.
- Desktop and web production bundles, compilation, 34 Flow tests, 17
  architecture tests, Markdown and scope checks, and the Qlty aggregate and
  comparison passed. Both full Qlty scans retain their baseline findings.
  Webpack reported bundle-size warnings.
- Geometry checks cover fixed preceding units, movement of the owner and its
  anchored contents, downstream displacement past settled panels, and nested
  spacing and connections. The dense probes confirm fixed preceding positions
  and matching downstream geometry at 800 and 1,200 siblings.
- Independent implementation review returned `SLICE_READY` in the current
  conversation for the [reviewed patch](/private/tmp/ajsbutler-flow-revised.0Gt2BUBP/final.patch).
- Completion Approval: the human approved the reviewed revised Slice 1 patch
  in the current conversation on 2026-11-26. Required host suites, Verify,
  and Qlty Cloud follow publication at the exact PR head.
