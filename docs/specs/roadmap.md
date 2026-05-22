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

1. Keep read-only JP1/AJS WebAPI import in beta while feedback is limited.

   - Keep transport, authentication, and endpoint details in infrastructure.
   - Keep generated OpenAPI mocks and stubs reproducible from repository-local
     contracts.
   - Keep WebAPI import read-only until the initial boundary and tests are
     stable.
   - Offer the feature as beta until smoke verification against a real JP1/AJS3
     environment and enough user feedback are recorded.

2. Maintain normalized-model convergence.

   - Prefer stable `AjsDocument` / `AjsUnit` contracts for application-facing
     behavior.
   - Keep unit-local JP1/AJS behavior on wrappers when it is not reused across
     consumers.
   - Promote only cross-consumer semantics into normalized helpers.
   - JP1/AJS3 version 13 remains the normative product target for future
     parameter and command semantics; future manual-alignment work should start
     as a focused feature when new supported scope is introduced.

3. Introduce stricter parser/infrastructure boundaries.

   - Define an application-facing parser or document-loading port.
   - Move concrete parser orchestration behind an adapter boundary when
     practical.
   - Keep generated ANTLR artifacts and parser-specific mechanics out of
     application use cases.
   - Preserve current desktop and web extension behavior while migrating.

4. Use Qlty findings as architectural feedback.

   - Track active implementation under
     `docs/specs/features/qlty-driven-architecture-refactoring/`.
   - Phase 0 removes repository noise before structural changes.
   - Phase 1 flow-viewer complexity work is complete through the current
     Slice-1B refactor.
   - Phase 2 targets application orchestration duplication next.
   - Phase 3 targets domain conditional complexity.
   - Every slice must preserve desktop and web extension behavior.

## Deferred / Optional Slices

1. Build/test output-directory ownership cleanup is deferred until packaging,
   caching, or stale output issues make it a concrete blocker.
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
9. Add more expanded-flow layout regression fixtures only if real-world nested
   layout examples expose additional collision or refit gaps.

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
