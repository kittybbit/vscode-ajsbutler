# PLANS: enhance-flow-graph-experience

## Objective

Deliver a clearer and more navigable flow-graph experience in focused slices.

## Scope

- visual refresh toward JP1/AJS View
- nested graph expansion inside one screen
- jump actions between list and flow viewers

## Milestones

1. Confirm viewer-facing requirements and stable navigation identity
2. Document the visual refresh target and its non-goals
3. Add progressive nested-expansion behavior
4. Add explicit list-to-flow and flow-to-list navigation actions
5. Validate desktop and web viewer behavior

## Current Slice

- 2026-04-18 implementation result:
  the flow viewer now gives the active node, ancestor chain, and root jobnet a
  stronger visual hierarchy while keeping the existing graph DTOs, selection
  state, and dialog-open actions unchanged.
- 2026-04-18 validation focus:
  preserve the DTO-to-node identity mapping in `flowGraphView.test.ts`, then
  confirm both desktop and web preview hosts still open and render the updated
  flow view through the standard serial quality baseline.
- 2026-04-19 next slice decision:
  move to progressive nested expansion while keeping flow DTO construction,
  current-unit selection, and desktop/web host behavior unchanged until the
  interaction seam is proven.
- 2026-04-19 expand-all decision:
  do not force one-click expand-all into the first incremental-expansion
  implementation; instead, keep that control as the immediate follow-up so the
  first behavior slice can validate identity, rendering, and host compatibility
  with less UI and state-synchronization risk.
- 2026-04-19 navigation fallback decision:
  when a counterpart list or flow view is unavailable, keep the current viewer
  state stable and make the jump action fail predictably through hidden or
  disabled affordances plus a no-op command path, rather than changing
  selection opportunistically.
- 2026-04-19 implementation focus:
  start with user-driven incremental reveal of nested jobnets in one screen,
  preserve the existing `currentUnitId`-driven selection contract, and leave
  cross-view jump actions as the next slice once nested expansion semantics are
  established.
- 2026-04-19 implementation result:
  child jobnets in the flow canvas can now reveal their nested scope in place
  without replacing the current viewer scope; the existing "open jobnet" action
  still re-scopes the viewer, while a separate expand/collapse affordance adds
  or removes nested children progressively.
- 2026-04-19 validation result:
  focused regression coverage now verifies that nested descendants appear only
  after their visible parent jobnet is expanded, keyboard and click handling
  toggle the nested reveal affordance predictably, and the standard desktop,
  web, and production-build baseline still passes.
- 2026-04-19 next slice:
  keep one-click expand-all as the immediate follow-up before cross-view
  navigation so the newly introduced nested-expansion state model can be reused
  instead of replaced.
- 2026-04-19 implementation result:
  the flow header now exposes a one-click nested-scope control that expands
  every expandable descendant jobnet in the current scope and collapses the
  same scope back to baseline once everything is open, while keeping the
  existing `currentUnitId`-driven selection contract unchanged.
- 2026-04-19 validation result:
  focused helper coverage now verifies which nested jobnets qualify for the
  scope-wide action and when the current scope should be treated as fully
  expanded, alongside the existing graph expansion regression coverage and the
  standard desktop, web, and build baseline.
- 2026-04-19 next slice:
  move from scope-wide expansion to deeper nested reveal and search behavior,
  reusing the same expansion-state model rather than replacing it for each
  follow-up interaction.
- 2026-04-19 implementation result:
  visible nested jobnets are no longer limited to direct-child expansion
  controls. Once a nested jobnet appears in the current canvas and has nested
  children of its own, the same inline expand/collapse affordance can reveal
  the next level without requiring a separate scope change.
- 2026-04-19 validation result:
  the flow-view mapping regression now verifies that expandable deeper nested
  jobnets keep their inline toggle affordance once visible, alongside the
  existing expanded-graph layout coverage and the standard desktop, web, and
  build baseline.
- 2026-04-19 next slice:
  move from deeper nested reveal to flow-view search, then layer explicit
  list/flow navigation on top of the established expansion-state model.
- 2026-04-19 maintenance slice:
  keep the new deeper nested-expansion behavior, but refactor
  `buildExpandedFlowGraph.ts` so expansion, panel sizing, and sibling
  re-layout steps are separated into focused helpers before adding more
  interaction on top.
- 2026-04-19 search slice decision:
  start with search inside the current flow scope only, keep
  `currentUnitId` as the stable base scope, reveal collapsed ancestor jobnets
  through the existing nested-expansion state, and use a presentation-local
  visual focus marker for the first match instead of changing the graph DTO
  contract or adding cross-scope camera navigation in the same slice.
- 2026-04-19 implementation result:
  the flow header now exposes a search box for the current scope; submitting a
  query finds the first matching unit by visible JP1/AJS labels and paths,
  expands the collapsed ancestor jobnets needed to reveal it in the current
  canvas, and visually highlights the matching node without re-scoping the
  viewer away from the current unit.
- 2026-04-19 validation result:
  focused helper coverage now verifies current-scope search matching and
  ancestor expansion decisions, flow-node mapping coverage verifies the new
  search-match decoration path, and the standard desktop, web, and build
  baseline should continue to validate host compatibility.
- 2026-04-19 next slice:
  keep the first flow-view search slice as the stable baseline, defer broader
  search behavior for now, and move next to explicit unit-list and flow-graph
  navigation on top of the same identity and expansion-state model.
- 2026-04-19 next slice decision:
  do not add multi-match stepping, explicit camera centering, or cross-scope
  search before cross-view navigation. Those search follow-ups stay deferred
  until a later slice shows that the first current-scope search behavior is
  insufficient for real navigation needs.
- 2026-04-19 navigation implementation focus:
  use stable normalized identity that already exists in both viewers
  (`absolutePath` for unit-list rows and the flow viewer's current-unit scope
  contract) to open or focus the counterpart viewer without importing the
  other viewer's internal component state. Keep unavailable-counterpart paths
  as hidden, disabled, or no-op behaviors rather than mutating the current
  viewer opportunistically.
- 2026-04-19 navigation validation focus:
  add focused regression coverage for list-to-flow target resolution and
  flow-to-list target resolution, then re-run the standard desktop, web, and
  production-build baseline to confirm the navigation wiring behaves the same
  in both hosts.
- 2026-04-19 navigation implementation result:
  explicit bridge actions now connect the table and flow viewers through shared
  navigation events keyed by normalized `absolutePath`. The table can request
  the matching flow scope, and flow nodes can request the matching table row,
  while each viewer keeps ownership of its own local selection state.
- 2026-04-19 navigation validation result:
  shared viewer-message routing coverage now exercises navigation events,
  reveal-helper coverage verifies flow target and table row resolution by
  stable path, and viewer-factory coverage confirms the injected navigation
  handler receives the expected target view plus absolute path.
- 2026-04-19 follow-up decision:
  keep broader flow-search behavior deferred for now and move the next active
  SDD slice to JP1/AJS3 version 13 parameter and command-reference alignment.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
