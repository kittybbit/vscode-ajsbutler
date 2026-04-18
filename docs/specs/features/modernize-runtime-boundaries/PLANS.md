# PLANS: modernize-runtime-boundaries

## Objective

Deliver the modernization slices for package management, viewer serialization,
hashing internals, and bundle-size reduction while preserving behavior.

## Scope

- Plan `npm` to `pnpm` migration
- Remove `flatted`-based payload assumptions
- Reduce webview bundle size
- Replace custom `UnitEntity` hashing with a common algorithm when safe

## Milestones

1. Document current and target runtime/tooling boundaries
2. Split serialization cleanup from package-manager migration where useful
3. Sequence bundle-size work after the highest-value dependency and payload
   simplifications are identified
4. Add or update compatibility and regression checks
5. Close each sub-slice with explicit docs sync

## Validation

- code changes before `pnpm` migration lands:
  `npm run qlty`, `npm test`, `npm run test:web`, `npm run build`
- docs-only changes: `npm run lint:md`
- after `pnpm` migration lands, update this section in the same commit
