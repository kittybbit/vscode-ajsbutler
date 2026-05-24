# Feature Plan: qlty-driven-architecture-refactoring

## Objective

Reduce architectural complexity, duplication, and maintainability risk by
converting Qlty findings into small, behavior-preserving refactoring slices.

The current Qlty findings should become architectural feedback instead of
remaining passive metrics.

## Scope

- Qlty check findings
- Qlty metrics findings
- Qlty smell findings
- UI orchestration boundaries
- Application orchestration boundaries
- Domain helper boundaries

## Out Of Scope

- Product behavior changes
- Parser grammar changes
- Generated parser changes
- Dependency upgrades
- Raising `engines.vscode`

## Impact Summary

- Change targets:
  `src/ui-component`, `src/application`, `src/domain`, and SDD documents
- Affected features:
  flow viewer, unit-list projection, command builders, helper orchestration
- Affected tests:
  desktop extension tests, web extension tests, build validation
- Related docs:
  `docs/specs/plans.md`, `docs/specs/roadmap.md`
- Breaking-change risk:
  medium; behavior-preserving refactoring across runtime boundaries

## Approval Scope Summary

- Approval status:
  see TASKS.md `Human Approval`
- Approved scope:
  none while approval is pending
- Scope guard:
  stop and request additional approval before changing anything outside the
  approved scope

## Milestones

1. Slice-0 repository hygiene and baseline cleanup
2. Slice-1A flow-viewer controller responsibility split
3. Slice-1B flow-viewer layout/component complexity reduction
4. Slice-2 application orchestration reduction
5. Slice-3 domain helper simplification

## Completed Slices

Slice-1A, Slice-1B-A, Slice-1B-B, Slice-1B-C, Slice-1B-D, Slice-1B-E,
Slice-1B-F, Slice-1B-G, Slice-1B-H, Slice-1B-I, Slice-1B-J, Slice-1B-K,
Slice-1B-L, Slice-1B-M, Slice-1B-N, Slice-1B-O, Slice-1B-P, Slice-1B-Q,
Slice-1B-R, Slice-1B-S, Slice-1B-U, Slice-2-A, Slice-2-B, Slice-2-C,
Slice-2-D, Slice-2-E, Slice-2-F, Slice-2-G, Slice-2-H, Slice-2-I,
Slice-2-J, Slice-2-K, and Slice-2-L are complete. Slice-1B is complete.

- Target:
  extract `AjsNode` styling decisions from `buildNodeSxProps` into
  presentation-local helpers without changing flow-viewer behavior.
- Reason:
  targeted Qlty smells identify `buildNodeSxProps` as the highest complexity
  node-component function, and it is referenced only by flow node components.
- Boundary:
  keep parser, generated artifacts, application flow graph DTOs, node data
  shape, VS Code compatibility, and `engines.vscode` unchanged.
- Expected impact:
  lower Qlty complexity for `AjsNode.tsx` while preserving the Slice-1A
  controller split.
- Status:
  `buildNodeSxProps` remains exported through `AjsNode.tsx`, with styling
  decisions extracted to presentation-local helpers in
  `src/ui-component/editor/ajsFlow/nodes/nodeSxProps.ts`.
  Slice-1B-B kept `Header` consumed only by `FlowContents`, with breadcrumbs,
  search field state/shortcut handling, expand-all labels, and current-unit
  badge decisions extracted into presentation-local helpers/subcomponents in
  `Header.tsx`.
  Slice-1B-C kept `FlowSelector` consumed only by `FlowContents`, with
  ancestor matching, drawer width observation, drawer toolbar, and unit tree
  rendering extracted into presentation-local helpers/subcomponents in
  `FlowSelector.tsx`.
  Slice-1B-D kept `expandedFlowGraphLayout` behavior intact while extracting
  `applyGrowthOffsets` target eligibility and offset calculations into focused
  layout helpers.
  Slice-1B-E kept sibling collision behavior intact while extracting
  `resolveSiblingSubtreeCollisions` overlap, right/down movement, and target
  refresh logic into focused layout helpers.
  Slice-1B-F kept lower-panel intrusion behavior intact while extracting
  `resolveLowerExpandedPanelIntrusions` panel eligibility, horizontal overlap,
  and vertical push calculation into focused layout helpers.
  Slice-1B-G kept expanded panel bounds behavior intact while extracting parent
  panel bounds initialization, visible descendant filtering, and node and
  decoration bounds accumulation into focused layout helpers.
  Slice-1B-H kept upper panel max-right behavior intact while extracting
  candidate bounds lookup, upper-candidate filtering, and max-right aggregation
  into focused layout helpers.
  Slice-1B-I kept expanded-scope relayout behavior intact while extracting
  expanded child discovery, recursive child relayout/decorate sequencing,
  growth target selection, and per-child growth application into focused
  layout helpers.
  Slice-1B-J kept descendant detection behavior intact while extracting parent
  lookup, parent-chain collection, and ancestor matching into focused helpers.
  Slice-1B-K kept anchored descendant synchronization behavior intact while
  extracting anchored child discovery, anchored child synchronization, and
  recursive traversal helpers.
  Slice-1B-L kept expanded edge appending behavior intact while extracting
  edge id creation, duplicate-edge filtering, and append/record helpers.
  Slice-1B-M kept nested reveal behavior intact while extracting reveal
  eligibility, visible child discovery, condition discovery, and child reveal
  helpers.
  Slice-1B-N kept display-position snapshot behavior intact while extracting
  visible-unit display-position entry resolution and collection.
  Slice-1B-O kept node bounds accumulation behavior intact while grouping node
  bounds inputs for `includeNodeBounds`.
  Slice-1B-P kept visible node registration behavior intact while grouping
  visible node inputs for `addVisibleNode`.
  Slice-1B-Q kept nested node visibility behavior intact while grouping
  nested visibility inputs for `ensureVisibleNestedNode`.
  Slice-1B-R kept growth offset application behavior intact while grouping
  growth offset inputs for `applyGrowthOffsets`.
  Slice-1B-S kept expanded panel bounds behavior intact while extracting
  visible-unit subtree bounds collection from `buildExpandedPanelBounds`.
  Slice-1B-T implementation scope was revised after local helper extraction
  attempts around `updateExpandedNodeDecoration` preserved behavior but did
  not lower Qlty total complexity from 109.
  Slice-1B-U kept sibling collision behavior intact while extracting resolved
  sibling item iteration from `resolveSiblingSubtreeCollisions`.
  Slice-2-A kept linked-unit projection behavior intact while extracting
  direction-aware relation projection helpers from
  `buildUnitListLinkedUnits`.
  Slice-2-B kept unit-list priority behavior intact while extracting explicit
  priority resolution, cache writes, parent inheritance, and fallback
  resolution from `getPriorityForUnitTypes`.
  Slice-2-C kept remaining group projection behavior intact while extracting
  group-specific projection builders from `buildUnitListRemainingGroups`.
  Slice-2-D kept default-aware group13/group14 projection behavior intact
  while grouping default-aware lookup inputs and replacing group13 wait-job
  type checks with a local membership constant.

## Current Slice Candidate

No current runtime slice is selected. Slice-2 should next choose between
`buildCommandLine`, command-builder duplication, remaining editor-feedback
diagnostic helper findings, or remaining unit-list helper findings, then
request separate approval before runtime work starts.

- Recent result:
  Slice-2-L preserved command-builder argument resolution while extracting
  text-field lookup and trimmed text value resolution into local helpers.
  Targeted Qlty smell output no longer reports `argumentValue`; remaining
  command-builder findings include `buildCommandLine` complexity and duplicate
  select-option blocks.

## Risks To Control

- Over-extraction may reduce readability
- Complexity reduction may accidentally change runtime behavior
- Qlty optimization may diverge from architectural clarity

## Validation

- code changes:
  `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, `rtk pnpm run build`
- docs-only changes:
  `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when useful
