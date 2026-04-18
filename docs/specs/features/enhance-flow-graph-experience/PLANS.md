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

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
