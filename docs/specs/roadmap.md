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

## Current Roadmap

1. Refresh SDD documentation so roadmap, plans, and feature task files reflect
   the migrated state instead of the starting plan.
2. Reconcile wrapper-derived semantics that still live outside the normalized
   model and decide whether they belong in domain normalization or application
   view adapters.
3. Continue reducing activation and webview concentration in
   `src/extension` without changing user-visible behavior.
4. Keep validating desktop and web extension compatibility while managing build
   and bundle-size risk.

## Deferred / Optional Slices

1. Add a dedicated filter/search unit-list use case if table filtering needs to
   move out of presentation logic.
2. Reduce bundle size for webview and browser targets if compatibility work is
   complete and performance becomes a stronger priority.

## Done Criteria For A Slice

- use case is documented
- affected boundaries are named explicitly
- tests cover the behavior being preserved
- compatibility impact is stated for desktop and web
- remaining debt is listed instead of hidden
