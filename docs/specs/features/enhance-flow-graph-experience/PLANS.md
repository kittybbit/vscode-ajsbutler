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

- Define the first visual-refresh slice as a presentation-only pass that keeps
  flow DTO construction and current selection semantics unchanged.
- Prioritize a JP1/AJS View-like feel through clearer current-node emphasis,
  stronger ancestor readability, more intentional graph chrome, and a minimap
  or overview treatment that does not dominate the primary canvas.
- Keep nested expansion and cross-view navigation as follow-up slices so the
  visual refresh remains reviewable and compatibility-focused.
- 2026-04-18 implementation result:
  the flow viewer now gives the active node, ancestor chain, and root jobnet a
  stronger visual hierarchy while keeping the existing graph DTOs, selection
  state, and dialog-open actions unchanged.
- 2026-04-18 validation focus:
  preserve the DTO-to-node identity mapping in `flowGraphView.test.ts`, then
  confirm both desktop and web preview hosts still open and render the updated
  flow view through the standard serial quality baseline.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
