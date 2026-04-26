# PLANS: build-unit-list

## Objective

Maintain the delivered build-unit-list use case and the presentation-local
list-search behavior.

## Scope

- Preserve unit-list construction behavior.
- Keep parameter value and `key=value` search modes in presentation code until
  another consumer needs shared semantics.
- Revisit shared search only if another non-table consumer needs it.

## Milestones

1. Preserve current unit-list construction.
2. Add parameter key/value search in the table presentation path.
3. Revisit `uc-search-domain-unification.md` only when justified.

## Status

- 2026-04-26: value and `key=value` search modes are implemented in the table
  global-filter path while preserving rendered-cell fuzzy matching in value
  mode.
- 2026-04-26: filtered rows now highlight matching cells to identify the
  matching column without changing the presentation-local search boundary.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
