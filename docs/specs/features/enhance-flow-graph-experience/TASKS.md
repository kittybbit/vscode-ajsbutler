# TASKS: enhance-flow-graph-experience

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Record the new SDD scope for flow-graph visual refresh, nested expansion,
      and list/flow navigation

## Remaining Follow-up

- [x] Define the visual cues that most matter for JP1/AJS View resemblance
- [ ] Decide whether expand-all ships in the same slice as incremental
      expansion or immediately after
- [ ] Document the target behavior when a counterpart list or flow view is not
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
