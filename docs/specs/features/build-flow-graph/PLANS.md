# PLANS: build-flow-graph

## Objective

Maintain the delivered build-flow-graph use case as a stable application
boundary.

## Scope

- Preserve graph DTO behavior for desktop and web viewers.
- Keep flow presentation changes in `enhance-flow-graph-experience`.
- Update this feature only when the application graph contract changes.

## Milestones

1. Preserve current graph DTO mapping.
2. Add focused tests when graph semantics change.
3. Keep viewer-only behavior out of this feature.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
