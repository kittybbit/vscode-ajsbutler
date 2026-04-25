# PLANS: build-unit-list

## Objective

Maintain the delivered build-unit-list use case and track the next list-search
presentation enhancement.

## Scope

- Preserve unit-list construction behavior.
- Extend parameter key/value search in presentation code first.
- Revisit shared search only if another non-table consumer needs it.

## Milestones

1. Preserve current unit-list construction.
2. Add parameter key/value search in the table presentation path.
3. Revisit `uc-search-domain-unification.md` only when justified.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
