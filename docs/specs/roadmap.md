# Roadmap

## Principles

- Preserve behavior first.
- Refactor in small vertical slices.
- Prefer one use case per extraction.
- Keep parser internals away from UI-facing components.
- Keep feature docs active and concise.

## Current Roadmap

1. Re-base parameter interpretation on JP1/Automatic Job Management System 3
   version 13 Definition File Reference.

   - Start from the documented audit of current shared parameter-semantics
     seams.
   - Add traceability from JP1/AJS v13 manual sections to supported parameter
     keys, parser behavior, normalized model fields, use cases, and regression
     tests.
   - The active focused slice is the schedule-rule parameter family: `sd`,
     `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`, `wc`, and `wt`; the
     first behavior-changing fix ignores root-jobnet `ln` values, and the next
     fix should come from the remaining partial statuses.
   - Keep behavior-preserving slices separate from behavior-changing manual
     alignment slices.

2. Keep read-only JP1/AJS WebAPI import in beta while feedback is limited.

   - Keep transport, authentication, and endpoint details in infrastructure.
   - Keep generated OpenAPI mocks and stubs reproducible from repository-local
     contracts.
   - Keep WebAPI import read-only until the initial boundary and tests are
     stable.
   - Offer the feature as beta until smoke verification against a real JP1/AJS3
     environment and enough user feedback are recorded.

3. Strengthen normalized-model convergence.

   - Reduce remaining raw `Unit` and wrapper-oriented dependencies in
     application-facing paths where a stable `AjsDocument` / `AjsUnit` contract
     already exists.
   - Keep unit-local JP1/AJS behavior on wrappers when it is not reused across
     consumers.
   - Promote only cross-consumer semantics into normalized helpers.

4. Introduce stricter parser/infrastructure boundaries.

   - Define an application-facing parser or document-loading port.
   - Move concrete parser orchestration behind an adapter boundary when
     practical.
   - Keep generated ANTLR artifacts and parser-specific mechanics out of
     application use cases.
   - Preserve current desktop and web extension behavior while migrating.

5. Use Qlty findings as architectural feedback.

   - Treat recurring duplication, complexity, and nested-control-flow findings
     as prioritized refactoring candidates.
   - Correlate Qlty findings with SDD tasks and technical debt slices.

## Deferred / Optional Slices

1. Introduce a shared search use case only if list, flow, or another non-table
   consumer needs common query semantics.
2. Extend JP1/AJS WebAPI support beyond read-only import only after the initial
   boundary, authentication model, and beta feedback are stable.
3. Revisit viewer-specific bundle-size reductions only if a future
   compatibility, startup, or payload target creates stronger pressure.
4. Replace the custom `UnitEntity` hash implementation only after identity and
   compatibility checks are refreshed.
5. Consolidate i18n translation files only when duplication is high enough to
   justify a targeted cleanup.
6. Add deeper JP1/AJS View interaction parity only after the current visual
   refresh and nested expansion behavior settle.
7. Revisit directory structure under `src/extension/webview/` only if the
   remaining files stop reading as one cohesive viewer module.

## Done Criteria For A Slice

- Use case or feature requirement is documented when behavior or boundary
  decisions change.
- Affected boundaries are named explicitly.
- Tests cover the behavior being preserved or changed.
- Desktop and web compatibility impact is stated.
- Remaining debt is listed only when it is actionable.
- Feature `TASKS.md`, branch plans, and roadmap are updated in the same commit
  when priorities or repository sequencing change.
- JP1/AJS manual-dependent work names the target product version and source
  document.
