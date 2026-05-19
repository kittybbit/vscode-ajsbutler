# Roadmap

## Principles

- Preserve behavior first.
- Refactor in small vertical slices.
- Prefer one use case per extraction.
- Keep parser internals away from UI-facing components.
- Keep active feature docs concise; remove completed feature-local folders
  after durable requirements are represented in use cases, architecture, or
  roadmap.

## Current Roadmap

1. Re-base parameter interpretation on JP1/Automatic Job Management System 3
   version 13 Definition File Reference.

   - Start from the documented audit of current shared parameter-semantics
     seams.
   - Add traceability from JP1/AJS v13 manual sections to supported parameter
     keys, parser behavior, normalized model fields, use cases, and regression
     tests.
   - Parameter value parsing must be verified by category against the official
     format before a category is marked aligned; avoid one-key-at-a-time slices
     when a shared helper boundary can cover the category.
   - The first category-level parser alignment pattern has been applied to the
     schedule-rule parameter family: `sd`, `ln`, `st`, `cy`, `sh`, `shd`,
     `cftd`, `sy`, `ey`, `wc`, and `wt`.
   - The next completed focused slices extracted transfer-operation `top1` to
     `top4` defaults and aligned the job end-judgment `jd` default for
     UNIX/PC jobs and UNIX/PC custom jobs.
   - Continue applying the same audit, helper-boundary, and regression-test
     workflow to other parameter families instead of checking isolated keys one
     by one.
   - Unit-list group 10 projection now consumes effective schedule-rule
     `wc` / `wt` start-condition monitoring values after the domain-only
     pairing API was implemented.
   - The first focused parameter semantic diagnostic reports job end-judgment
     `jd` / `abr` invalid combinations for UNIX/PC jobs and UNIX/PC custom
     jobs while preserving raw parameter data.
   - The job end-judgment automatic-retry enablement diagnostic now reports
     explicit `rjs`, `rje`, `rec`, or `rei` values when effective `jd=cod`
     but effective `abr` is not `y`.
   - JP1 event sending job `evhst` requiredness is now aligned through
     editor-feedback when explicit `evsrt=y` omits `evhst`, while preserving
     raw parameter data and avoiding broader event-job validation in the same
     slice.
   - JP1 event sending job `evspl` / `evsrc` range diagnostics are now aligned
     through editor-feedback while preserving raw parameter data.
   - JP1 event sending job `evsid` hexadecimal diagnostics are now aligned
     through editor-feedback while preserving raw parameter data.
   - Continue with documented deferred diagnostics and range-validation gaps
     only as focused, approval-gated slices while they still form one
     repository-supported shared rule family.
   - The shared wait-job execution-time (`fd`) diagnostics and the shared
     wait-job `eventTimeoutAction` default-projection reconciliation slices
     are now delivered.
   - The remaining feature-local gaps were ultimately re-scoped out of the
     active feature when they narrowed to platform-specific transfer-path
     interpretation and broader cross-parameter invalidation.
   - Schedule-rule year-range handling is already settled for this feature
     with the fixed default `SCHEDULELIMIT=2036`; site-specific override
     support is outside the active JP1/AJS v13 alignment feature scope.
   - The current JP1/AJS v13 alignment feature is therefore complete for the
     repository-supported scope captured in the feature docs and coverage
     matrix.
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

3. Maintain normalized-model convergence.

   - Prefer stable `AjsDocument` / `AjsUnit` contracts for application-facing
     behavior.
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

   - Track active implementation under
     `docs/specs/features/qlty-driven-architecture-refactoring/`.
   - Phase 0 removes repository noise before structural changes.
   - Phase 1 targets flow-viewer complexity.
   - Phase 2 targets application orchestration duplication.
   - Phase 3 targets domain conditional complexity.
   - `flow-refactor` completed the concrete repository-native slice plan for
     those phases, bundling diagnostics modularization, expanded-flow graph
     separation, `FlowContents.tsx` composition cleanup, and final
     naming/export cleanup behind ordered PR-sized slices.
   - Every slice must preserve desktop and web extension behavior.

6. Make expanded flow layout deterministic.

   - Track active implementation under
     `docs/specs/features/flow-layout-determinism/`.
   - The first deterministic expanded-flow layout implementation slice is
     delivered with occupied-box collision resolution and order-independent
     regression coverage.
   - The React Flow standard `fitView` follow-up is delivered by
     representing expanded panel bounds as transparent React Flow group
     nodes.
   - The same selected scope and expanded-unit set must yield the same layout
     regardless of expansion order.
   - Expanded sibling subtrees must not overlap by node or panel occupancy.
   - Collision resolution should push only the affected right/down scope and
     keep unrelated upper-left regions fixed.
   - Search, reveal, and fitView behavior must remain intact.

## Deferred / Optional Slices

1. Build/test performance Slice-6 output directory ownership cleanup is
   deferred until packaging, caching, or stale output issues make it a concrete
   blocker. PR #222 delivered the other build/test performance slices.
2. Introduce a shared search use case only if list, flow, or another non-table
   consumer needs common query semantics.
3. Extend JP1/AJS WebAPI support beyond read-only import only after the initial
   boundary, authentication model, and beta feedback are stable.
4. Revisit viewer-specific bundle-size reductions only if a future
   compatibility, startup, or payload target creates stronger pressure.
5. Replace the custom `UnitEntity` hash implementation only after identity and
   compatibility checks are refreshed.
6. Consolidate i18n translation files only when duplication is high enough to
   justify a targeted cleanup.
7. Add deeper JP1/AJS View interaction parity only after the current visual
   refresh and nested expansion behavior settle.
8. Revisit directory structure under `src/extension/webview/` only if the
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
- Completed feature folders are removed when they no longer carry active
  requirements, durable boundary decisions, or useful follow-up.
