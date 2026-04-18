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
4. Profile the current shared webview bundle and choose the first shrinking
   refactor after the highest-value dependency and payload simplifications are
   identified
5. Add or update compatibility and regression checks
6. Close each sub-slice with explicit docs sync

## Validation

- code changes after `pnpm` migration lands:
  `pnpm run qlty`, `pnpm test`, `pnpm run test:web`, `pnpm run build`
- docs-only changes: `pnpm run lint:md`

## This Slice

- Reframe bundle-size work as payload-shrinking refactors, not only growth
  control
- Record the current reduction target after the `flatted` cleanup and `pnpm`
  migration:
  the shared viewer bundle `out/index.js` is 9,166,525 bytes raw and
  2,362,382 bytes gzip because one webview entry currently imports both
  `AjsTableViewerApp` and `AjsFlowViewerApp`
- Name the first refactor candidate explicitly:
  split the current single viewer entry so table and flow webviews stop
  shipping each other's code by default
- Keep the measurement commands only as evidence for shrinking work:
  `pnpm run build` for production output byte counts and
  `pnpm run build -- --env analyzer=true` for static analyzer reports in
  `report/`
- Treat follow-up candidates as code-removal work, not budget bureaucracy:
  trim flow-only libraries from the table path, reduce MUI icon fan-out, and
  isolate browser fallbacks like `os-browserify` to the paths that still need
  them
