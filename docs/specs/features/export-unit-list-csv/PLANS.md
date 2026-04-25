# PLANS: export-unit-list-csv

## Objective

Maintain delivered CSV export behavior.

## Scope

- Preserve CSV generation and escaping rules.
- Keep table-to-CSV mapping on application-facing row data.
- Update this feature only when export semantics change.

## Milestones

1. Preserve CSV generation behavior.
2. Add focused tests for any export semantics change.
3. Keep adapter-specific save behavior outside the use case.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
