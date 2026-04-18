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
- `UnitEntity.id` is still derived from `absolutePath` through a local sync
  hash helper and is consumed mostly as an in-memory UI identity for unit-list
  row ids, flow-graph node ids, current selection, linked-unit references, and
  DOM anchor ids.
- Current extension and webview wiring does not persist that hashed id through
  `workspaceState`, `globalState`, webview serializers, or `vscode.setState`;
  the visible extension-to-webview document contract remains DTO-based and
  rebuilds normalized units from posted data.

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
- 2026-04-18 implementation result:
  `webpack` now emits `out/tableViewer.js` and `out/flowViewer.js` as
  separate editor entries, and `mountViewerPanel(...)` resolves the bundle by
  `viewType` instead of always loading one shared `out/index.js`
- 2026-04-18 production evidence after the split:
  `out/tableViewer.js` is 737,279 bytes raw and 219,019 bytes gzip, while
  `out/flowViewer.js` is 711,195 bytes raw and 217,051 bytes gzip
- Next shrinking slice:
  profile the separated bundles to identify the largest remaining
  table-only and flow-only contributors before choosing another refactor
- 2026-04-18 profiling evidence after the split:
  webpack stats and analyzer output show that the largest remaining shared
  contributor in both viewer bundles is `@mui/*`
  (`tableViewer`: about 1,036,500 parsed bytes inside the concatenated viewer
  module, `flowViewer`: about 853,234), while the largest viewer-specific
  contributors are `@tanstack/table-core` plus `react-virtuoso` for table and
  `@xyflow/react` plus `@xyflow/system` for flow
- 2026-04-18 import-shape finding:
  viewer components still import many controls from the `@mui/material`
  barrel rather than path-specific entry points, so the first follow-up worth
  testing is a focused import-narrowing slice before deeper UI-library
  replacement discussions
- Next concrete shrinking slice after profiling:
  replace viewer-side `@mui/material` barrel imports with path imports,
  re-measure `tableViewer.js` and `flowViewer.js`, then decide whether the
  next target should be table virtualization (`react-virtuoso`) or flow graph
  libraries (`@xyflow/*`)
- 2026-04-18 follow-up decision after re-measuring the MUI import-shape slice:
  keep the next shrinking target on the flow side first because the current
  analyzer evidence still shows `@xyflow/react` + `@xyflow/system`
  outweighing table-side `react-virtuoso` + `@tanstack/table-core` by roughly
  `139053` parsed bytes, while the emitted production bundle sizes remain too
  close to make raw bundle bytes a better prioritization signal.
- First flow-side implementation slice result:
  deferring minimap-centered flow chrome behind an async seam did not produce
  a meaningful reduction, so the experiment was reverted rather than kept as a
  complexity-increasing baseline.
- Current prioritization adjustment:
  do not keep forcing viewer bundle-size work when the measured win is
  marginal; shift the next branch-level attention to flow-graph UX and other
  higher-value slices unless a stronger bundle constraint appears.
- Hash-replacement readiness finding:
  the required pre-change checks are now explicit rather than implicit.
  Any future swap to a common hash algorithm should first re-verify that
  hashed ids still do not cross persistence boundaries, keep webview DTOs on
  stable normalized ids such as `absolutePath`, and refresh focused tests for
  flow selection continuity plus table/graph anchor behavior.
