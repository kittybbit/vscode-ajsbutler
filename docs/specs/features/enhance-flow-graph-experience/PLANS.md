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

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
