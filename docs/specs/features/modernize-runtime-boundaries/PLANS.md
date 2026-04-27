# PLANS: modernize-runtime-boundaries

## Objective

Maintain runtime and tooling boundaries without changing extension behavior.

## Scope

- Package management and validation workflow.
- Viewer serialization and DTO payload assumptions.
- Webview bundle entry points and measured payload evidence.
- `UnitEntity` identity and hash-change readiness.

## Delivered

- Removed stale `flatted` assumptions from manifests and docs.
- Migrated package management from `npm` to pinned `pnpm`.
- Split the shared webview entry into dedicated table and flow bundles.
- Recorded post-split bundle evidence and rejected a complexity-increasing
  async flow-chrome experiment.
- Documented `UnitEntity.id` persistence checks before any future hash swap.

## Current Decision

Do not keep forcing viewer bundle-size work while measured wins are marginal.
Resume only when a clearer reduction seam or stronger compatibility,
startup-time, or payload requirement appears.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
