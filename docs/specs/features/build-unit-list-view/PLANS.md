# PLANS: build-unit-list-view

## Objective

Maintain the delivered table-view projection boundary.

## Scope

- Preserve the `UnitListRowView` contract.
- Keep table-only filtering and UI state outside the application use case.
- Update this feature only when row DTO behavior changes.

## Milestones

1. Preserve current row projection.
2. Add focused tests when DTO semantics change.
3. Keep completed decomposition history in roadmap/plans.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
