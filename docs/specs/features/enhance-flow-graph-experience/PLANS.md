# PLANS: enhance-flow-graph-experience

## Objective

Deliver a clearer and more navigable flow-graph experience in focused slices.

## Scope

- visual refresh toward JP1/AJS View
- nested graph expansion inside one screen
- jump actions between list and flow viewers

## Current Design

- flow styling keeps the existing graph DTO, current-unit selection contract,
  and dialog-open behavior intact.
- nested jobnets can expand progressively in the current canvas, including
  deeper visible descendants and a scope-wide expand-all path.
- nested expansion layout uses display positions plus accumulated offsets so
  sibling panels can push nearby units without rebuilding the base graph DTO.
- revealed descendants keep parent-relative anchors, so if a later sibling
  expansion moves their parent jobnet they move with it instead of staying at
  stale absolute coordinates.
- each nested panel remains anchored to its expanded unit and grows only
  rightward and downward from that visible origin.
- sibling panel push rules are resolved from the currently visible panel
  bounds in the same immediate scope:
  horizontal growth uses only the amount that exceeds the maximum right edge
  already occupied by expanded panels above, and vertical growth uses only the
  missing downward distance a target still needs.
- when an upper panel newly intrudes into a lower expanded panel, the lower
  panel origin may be pushed downward, but the inverse case of opening the
  lower panel itself does not trigger that same downward correction.
- collapsing a parent jobnet clears descendant expansion state so reopening the
  same branch returns to the expected one-level reveal.
- recovery jobnet variants that render as flow `jobnet` nodes stay expandable
  when they have nested children.
- flow search stays within the current scope, performs case-insensitive
  contiguous partial matching across unit name, comment, and path, prefers a
  descendant over the scope root when both match, highlights every visible
  match, and expands the combined ancestor set needed to reveal them.
- list/flow bridge navigation uses stable `absolutePath` identity and keeps
  missing-counterpart paths as hidden, disabled, or no-op behavior.
- when nested expansion or collapse changes visible bounds, the viewer refits
  the current React Flow viewport to the latest rendered nodes instead of
  relying on initial mount-time `fitView` behavior.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
