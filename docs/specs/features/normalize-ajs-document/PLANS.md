# PLANS: normalize-ajs-document

## Objective

Maintain the normalized AJS document boundary and the wrapper/shared/local
semantics split.

## Scope

- Preserve normalized DTO behavior for application and presentation slices.
- Keep new shared helpers limited to rules with real repeated consumers.
- Keep wrapper-local JP1/AJS semantics on the owning wrapper.

## Milestones

1. Preserve current normalization behavior.
2. Add helper or wrapper tests when semantics move.
3. Keep extraction criteria aligned with `docs/specs/plans.md`.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
