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
- Documented `UnitEntity.id` compatibility checks before any future hash swap
  and confirmed normalized AJS selection currently uses absolute-path ids.

## Current Decision

Do not keep forcing viewer bundle-size work while measured wins are marginal.
Resume only when a clearer reduction seam or stronger compatibility,
startup-time, or payload requirement appears.

Do not propose a `UnitEntity` hash implementation replacement only for cleanup.
The current wrapper hash is isolated from normalized AJS DTO identity in the
reviewed selection, navigation, table, flow, reveal, and test paths. Revisit
only when there is a concrete compatibility, dependency, or maintenance reason
and a new implementation approval gate.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
