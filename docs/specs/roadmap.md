# Roadmap

## Principles

- preserve behavior first
- refactor in small vertical slices
- prefer one use case per extraction
- keep parser internals away from UI-facing components

## Completed Slices

1. Build unit list use case
2. Build unit list view adapter for table-oriented presentation
3. Export unit list CSV use case
4. Normalize AJS document into an application-facing model
5. Build flow graph DTO use case
6. Show unit definition via application DTO
7. Isolate diagnostics and hover adapters
8. Wrap telemetry behind an application port
9. Consolidate wrapper-derived semantics into shared helpers and focused
   capability interfaces
10. Reduce activation/bootstrap concentration into explicit runtime,
    lifecycle, subscription, and viewer wiring slices
11. Simplify webview preview wiring, store cleanup, and factory or mediator
    contracts without changing viewer behavior
12. Keep wrapper-domain cleanup selective:
    move only cross-unit or normalization-shared semantics into helpers, and
    avoid abstracting unit-local JP1/AJS rules prematurely.
13. Record current manual smoke-test results for completed viewer-facing slices
    so remaining verification debt is explicit instead of implicit.
14. Keep validating desktop and web extension compatibility while managing
    bundle-size and shared-runtime risk.
15. Make verification evidence explicit for completed features:
    close follow-ups with automated coverage when a reliable smoke seam
    already exists, and keep manual smoke debt only where it is still needed.
16. Revisit a dedicated filter/search use case only if a second non-table
    consumer appears and needs the same matching semantics.
17. Decompose `ParameterFactory.ts` into focused builder modules while keeping
    `ParamFactory` as the stable thin facade for existing callers.
18. Decompose `buildUnitListView.ts` into focused projection helpers:
    extracted `group6` calendar, `group7`/`group11` priority, `group10`
    schedule, and linked-unit projections with consolidated remaining groups
    in a dedicated helper module.
19. Refactor unit model classes selectively:
    shared wait-state and priority boilerplate now lives in focused capability
    base classes, while unit-local JP1/AJS semantics stay on the owning
    wrappers.
20. Remove stale `flatted` assumptions from viewer payload docs and manifests
    so the transport contract is explicitly DTO-based rather than implicitly
    cyclic.
21. Migrate package management from `npm` to `pnpm` with a pinned
    `packageManager`, committed `pnpm-lock.yaml`, and matching CI plus
    contributor workflow updates.
22. Reframe bundle-size work around webview-payload reduction:
    record the current shared viewer baseline as evidence, then target
    concrete shrinking refactors instead of only guarding against regressions.
23. Split the shared webview entry into dedicated table and flow bundles so
    each viewer stops shipping the other viewer tree by default.

## Current Roadmap

1. Narrow viewer-side `@mui/material` imports away from barrel imports and
   re-measure both webview bundles before deeper dependency changes.
2. Revisit table-side `react-virtuoso` and TanStack payload cost after the
   shared MUI import shape is narrowed.
3. Revisit flow-side `@xyflow/*` payload cost after the shared MUI import
   shape is narrowed.
4. Refresh the flow-graph presentation so its visual design is closer to
   JP1/AJS View while preserving current desktop and web compatibility.
5. Add progressive nested-graph expansion in the flow view, with both
   user-driven incremental expansion and a one-click expand-all path.
6. Add explicit navigation between unit-list and flow-graph units when the
   counterpart view for the selected unit is available.
7. Re-base parameter interpretation on JP1/Automatic Job Management System 3
   version 13 Definition File Reference.
8. Separate `ajs` command generation from `buildUnitDefinition.ts` and align
   generated commands with JP1/Automatic Job Management System 3 version 13
   Command Reference.
9. Add a read-only JP1/AJS WebAPI import path for loading server-side
   definition data.
10. Replace the custom `UnitEntity` hash implementation with a common
    algorithm once identity and compatibility checks are explicit.
11. Consolidate i18n translation files to reduce duplication between language
    variants.

## Deferred / Optional Slices

1. Add a dedicated filter/search unit-list use case only if matching semantics
   need to be shared outside the table presentation layer.
2. Revisit directory structure under `src/extension/webview/` only if the
   remaining files stop reading as one cohesive viewer module.
3. Add deeper JP1/AJS View interaction parity only after the visual refresh
   and nested expansion slices settle.
4. Extend JP1/AJS WebAPI support beyond read-only import only after the
   initial boundary and authentication model are stable.

## Done Criteria For A Slice

- use case is documented
- affected boundaries are named explicitly
- tests cover the behavior being preserved
- compatibility impact is stated for desktop and web
- remaining debt is listed instead of hidden
- feature `TASKS.md` is updated in the same commit that closes, reframes, or
  drops a task
- branch-level docs are updated in the same commit when the slice changes
  roadmap priorities
- open task lists prefer actionable remaining work over evergreen policy or
  maintenance reminders
- when a slice depends on a JP1/AJS manual or API reference, the target
  product version and source document are named explicitly
