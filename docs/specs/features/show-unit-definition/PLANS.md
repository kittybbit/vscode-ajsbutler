# PLANS: show-unit-definition

## Objective

Maintain delivered unit-definition dialog behavior.

## Scope

- Preserve shared dialog DTO mapping for table and flow viewers.
- Keep command-generation expansion in
  `align-jp1-v13-parameter-and-command-reference`.
- Update this feature only when dialog behavior changes.

## Milestones

1. Preserve dialog DTO behavior.
2. Add tests when dialog content or trigger behavior changes.
3. Keep command-generation ownership in the application layer.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
