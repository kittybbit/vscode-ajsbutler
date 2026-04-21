# TASKS: enhance-flow-graph-experience

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Record the new SDD scope for flow-graph visual refresh, nested expansion,
      and list/flow navigation
- [x] Implement the first progressive nested-expansion slice without changing
      the current viewer selection contract:
      child jobnets can now expand or collapse nested content inline while the
      existing scope-changing open action remains available
- [x] Add explicit bridge actions between the unit list and flow graph using
      stable `absolutePath`-based navigation events and reveal helpers:
      the table can request the matching flow scope, and the flow view can
      request the matching table row without importing the other viewer's
      internal state

## Remaining Follow-up

- [x] Add a one-click expand-all path on top of the new nested-expansion state
- [x] Add a deeper nested-expansion slice after the direct-child path is stable:
      reopen support for nested-in-nested jobnets only when the viewer can
      render and re-layout those deeper scopes predictably instead of exposing
      non-working controls
- [x] Refactor `buildExpandedFlowGraph.ts` after the deeper nested-expansion
      fixes so expansion, panel sizing, and sibling collision handling are
      easier to extend without changing behavior
- [x] Add the first flow-view search slice inside the current scope:
      search by unit name, comment, or path from the flow header, reveal the
      collapsed ancestor hierarchy needed to show the first match, and
      visually focus that match without changing the current scope
- [x] Decide whether flow-view search needs follow-up work beyond the first
      current-scope slice:
      broader search behavior is intentionally deferred for now so the next
      viewer-facing slice can focus on explicit list/flow navigation first
- [x] Refine current-scope flow search to support space-separated partial-match
      keywords:
      keep first-match behavior and ancestor reveal semantics, but reduce the
      need for exact contiguous query text
- [x] Define the visual cues that most matter for JP1/AJS View resemblance
- [x] Decide whether expand-all ships in the same slice as incremental
      expansion or immediately after
- [x] Document the target behavior when a counterpart list or flow view is not
      available
- [x] Add focused validation plans for selection, navigation, and nested
      expansion state:
      keep current-selection regression coverage at the flow-graph DTO mapping
      seam, verify both desktop and web preview opening still succeed, and
      reserve nested-expansion plus cross-view navigation behavior for the
      follow-up slices that introduce those interactions

## Notes

- 2026-04-18: user intent is visual resemblance first; full interaction parity
  is explicitly out of scope for the initial slice.
- 2026-04-18: the first visual-refresh slice should prioritize recognizable
  JP1/AJS View cues over broad interaction changes:
  compact graph chrome, clearer current/ancestor emphasis, stronger root-jobnet
  readability, minimap or overview treatment that feels secondary to the main
  graph, and status indicators that stay legible in both desktop and web hosts.
- 2026-04-18: the visual-refresh slice should keep the existing graph DTO
  contract intact and focus on presentation concerns such as node silhouette,
  spacing, contrast, and action affordances rather than reworking graph
  semantics in the same change.
- 2026-04-18: the first implemented visual-refresh pass now emphasizes the
  current node, ancestor chain, and root jobnet more clearly while making the
  selector drawer and canvas chrome feel more secondary to the main graph.
- 2026-04-18: focused validation for this slice stays on identity-preserving
  behavior rather than pixel snapshots:
  `flowGraphView.test.ts` continues to assert current and ancestor metadata
  mapping, desktop `pnpm test` still opens the viewers, and `pnpm run test:web`
  confirms the web preview wiring remains intact after the presentation-only
  restyle.
- 2026-04-19: the next implementation slice is progressive nested expansion
  first; one-click expand-all remains in scope but is intentionally sequenced
  as the immediate follow-up so the first interaction change stays smaller and
  easier to validate across desktop and web hosts.
- 2026-04-19: when a counterpart view is unavailable, navigation must leave the
  current view and selection unchanged; UI affordances should be hidden or
  disabled when availability is known up front, and any remaining command path
  should degrade to a predictable no-op instead of mutating local viewer state.
- 2026-04-19: the first incremental nested-expansion implementation keeps
  `currentUnitId` as the viewer's base scope and layers additional nested
  content on top through separate expand/collapse state, so the follow-up
  expand-all and later navigation slices can reuse the same scope model.
- 2026-04-19: one-click expand-all now reuses the same nested-expansion state
  model instead of introducing a separate graph mode; when every expandable
  nested jobnet in the current scope is already open, the same control
  collapses that scope back to the current baseline.
- 2026-04-19: deeper nested expand/collapse remains intentionally deferred.
  The current UI now hides those controls below the first nested level until
  the viewer can reveal multi-level nested scopes with stable layout and
  collision handling.
- 2026-04-19: deeper nested expand/collapse now reuses the same visible-node
  affordance as the direct-child slice. Once a nested jobnet is revealed in
  the current flow canvas and it has nested children of its own, the same
  expand/collapse control stays available without forcing a scope change back
  through "open jobnet".
- 2026-04-19: flow-view search is a planned usability follow-up. The desired
  behavior is to search units from the flow surface, reveal any collapsed
  ancestors needed to show the match, and then focus the matching unit without
  requiring manual hierarchy expansion first.
- 2026-04-19: the first implemented flow-view search slice intentionally stays
  inside the current flow scope. It searches current-scope descendants by
  unit name, comment, and absolute path, expands any collapsed ancestor
  jobnets needed to reveal the first match, and uses a presentation-local
  focus marker rather than rebasing `currentUnitId` or adding camera control
  in the same change.
- 2026-04-19: after the nested-expansion bug fixes, `buildExpandedFlowGraph.ts`
  should keep the same layout semantics but separate node reveal, panel-bounds
  calculation, and sibling re-layout so the next flow-view interactions do not
  pile more stateful logic into one long function.
- 2026-04-19: broader flow-search follow-up is intentionally deferred after the
  first current-scope slice. Multi-match stepping, explicit camera centering,
  and cross-scope search remain valid future ideas, but the next active
  implementation slice should be explicit unit-list and flow-graph navigation
  because that use case is already specified and benefits from the stable
  `absolutePath` / `currentUnitId` identity seams now in place.
- 2026-04-19: explicit list/flow bridge navigation is now implemented in both
  directions. Table rows post shared navigation events toward the flow viewer,
  flow nodes post the symmetric table-navigation event, and focused helper plus
  routing tests cover the identity-preserving reveal behavior.
- 2026-04-21: current-scope flow search now accepts space-separated keywords as
  case-insensitive partial matches over the existing unit search text. The
  first-match and collapsed-ancestor reveal behavior stay unchanged; only the
  matcher becomes less strict than one contiguous whole-query substring.
