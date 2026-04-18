# PLANS: modernize-runtime-boundaries

## Objective

Deliver the modernization slices for package management, viewer serialization,
hashing internals, and bundle-size reduction while preserving behavior.

## Scope

- Migrate package management from `npm` to `pnpm`
- Remove `flatted`-based payload assumptions
- Reduce webview bundle size
- Replace custom `UnitEntity` hashing with a common algorithm when safe

## Current-State Findings

- No current source file imports `flatted` directly.
- The repository manifest no longer declares `flatted` as a direct runtime
  dependency.
- The extension-to-webview transport currently posts plain event objects via
  `panel.webview.postMessage(...)` and `window.vscode.postMessage(...)`.
- The main document payload seam is
  `buildUnitList(...) -> UnitListDocumentDto -> changeDocument`:
  `src/application/unit-list/buildUnitList.ts` constructs a DTO containing
  only `unitAttribute`, `parameters`, and nested `children`, and both table
  and flow viewers reconstruct normalized state through
  `toAjsDocument(document)`.
- Resource and save events are already string- and object-based contracts:
  `MyAppResource`, operation names, and CSV save bodies do not require custom
  cyclic serialization.

## Ordering Decision

- Review and implement viewer serialization cleanup before the `pnpm`
  migration.
- Treat the first modernization sub-slice as "prove and document that current
  viewer payloads are JSON-safe DTO contracts, then remove the stale
  dependency assumption".
- Start `pnpm` migration only after the repository no longer carries
  ambiguous serialization baggage in docs or manifests; this keeps package
  manager diffs focused on tooling behavior instead of mixed runtime cleanup.

## Milestones

1. Document current and target runtime/tooling boundaries
2. Remove stale `flatted` assumptions from viewer payload docs and manifests
3. Migrate package management from `npm` to `pnpm` with validation parity
4. Define bundle-size measurement and acceptance thresholds after the
   highest-value dependency and payload simplifications are identified
5. Add or update compatibility and regression checks
6. Close each sub-slice with explicit docs sync

## Validation

- code changes after `pnpm` migration lands:
  `pnpm run qlty`, `pnpm test`, `pnpm run test:web`, `pnpm run build`
- docs-only changes: `pnpm run lint:md`

## This Slice

- Document the primary bundle-size seam as the production webview bundle
  `out/index.js`, with `out/web.js` and `out/extension.js` tracked as
  secondary guards when shared runtime imports change
- Standardize the measurement commands:
  `pnpm run build` for production output byte counts and
  `pnpm run build -- --env analyzer=true` for static analyzer reports in
  `report/`
- Record the 2026-04-18 baseline after the `flatted` cleanup and `pnpm`
  migration:
  `out/index.js` = 9,166,525 bytes raw, 2,362,382 bytes gzip
- Set review thresholds for future slices:
  keep routine changes within +5% of the current `out/index.js` raw and gzip
  baseline, and require an explicit SDD note plus analyzer evidence for
  larger increases
- Set escalation thresholds for future slices:
  treat `out/index.js` above 10,000,000 bytes raw or 2,500,000 bytes gzip as
  a stop-and-review condition before merge, even if behavior is otherwise
  correct
