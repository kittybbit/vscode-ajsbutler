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

## Current Roadmap

1. Finish the remaining activation and webview boundary decisions:
   keep simple composition local in `viewerWiring.ts`, but extract stable
   seams when a dependency stops being wiring-only.
2. Keep wrapper-domain cleanup selective:
   move only cross-unit or normalization-shared semantics into helpers, and
   avoid abstracting unit-local JP1/AJS rules prematurely.
3. Bring feature-local SDD files back in sync with the current merged state so
   task lists stop describing already-finished slices.
4. Record current manual smoke-test results for completed viewer-facing slices
   so remaining verification debt is explicit instead of implicit.
5. Keep validating desktop and web extension compatibility while managing
   bundle-size and shared-runtime risk.

## Deferred / Optional Slices

1. Add a dedicated filter/search unit-list use case if table filtering needs to
   move out of presentation logic.
2. Reduce bundle size for webview and browser targets if compatibility work is
   complete and performance becomes a stronger priority.
3. Revisit directory structure under `src/extension/webview/` only if the
   remaining files stop reading as one cohesive viewer module.

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
