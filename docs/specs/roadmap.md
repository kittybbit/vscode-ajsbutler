# Roadmap

## Principles

- Preserve behavior first.
- Refactor in small vertical slices.
- Prefer one use case per extraction.
- Keep parser internals away from UI-facing components.
- Keep active feature docs concise; remove completed feature-local folders after
  durable requirements are represented in use cases, architecture, or roadmap.

## Current Roadmap

1. Maintain the completed unit-list usability improvements.

   - Completed: align the unit-list header with the established flow-view visual
     language, move controls into the header, use an internal table scroll
     region, share the unit-tree pane, and add flow-style presentation search
     navigation.
   - Completed: add discoverable list-to-flow navigation through the existing
     stable-unit bridge contract, including deferred reveal for a newly opened
     flow panel.
   - Completed: add a shared right-side selected-unit detail pane using
     application-provided definition content, move list-to-flow navigation into
     that pane, and remove duplicated row-level dialog/cross-link actions.
   - The feature-local folder has been closed because no next implementation
     slice is apparent.
   - Introduce shared application or domain search semantics only if the
     search-domain use-case trigger is satisfied and separately approved.

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
   - JP1/AJS3 version 13 remains the normative product target for future
     parameter and command semantics; future manual-alignment work should start
     as a focused feature when new supported scope is introduced.
   - Semantic diagnostics now consume normalized `AjsDocument` / `AjsUnit`
     inputs while preserving existing diagnostic behavior and source positions.

4. Introduce stricter parser/infrastructure boundaries.

   - The application-facing parser port and host-neutral infrastructure ANTLR
     adapter are implemented for unit-list and syntax-diagnostic consumers.
   - Raw `Unit` and repository-owned parser-error behavior remain the initial
     seam; generated ANTLR artifacts and mechanics stay outside application and
     domain production modules.
   - Defer normalized-only parsing to a later single-purpose feature if a
     concrete consumer requires it.

5. Maintain the explicit extension composition root.

   - Concrete application and infrastructure dependencies are constructed by one
     typed bootstrap owner and injected into VS Code-facing adapters.
   - Preserve lifecycle, disposal, desktop, and web behavior without adding a
     service container.

6. Maintain the explicit React viewer bridge routing boundary.

   - Browser message validation and callback routing now live in a focused,
     presentation-local viewer event bridge.
   - React bootstrap retains VS Code API acquisition, global bridge exposure,
     listener installation, and application mounting.
   - Focused tests preserve viewer event-routing branches without changing
     shared event contracts, bundle topology, or viewer behavior.
   - Treat declarative component shape metrics as non-actionable unless they
     expose a separate responsibility or maintenance risk.

7. Use Qlty findings as architectural feedback when they expose a clear
   responsibility or boundary concern.

   - The qlty-driven architecture refactoring feature is complete through the
     focused flow-viewer, application orchestration, domain helper,
     command-building, diagnostic-builder, and unit-list helper slices.
   - Remaining shape-only duplication and parameter-helper findings should not
     drive implementation by themselves.
   - Open a new focused feature only when a future Qlty finding maps to a
     meaningful JP1/AJS concept, application use case, adapter boundary, or
     maintainability risk.

## Deferred / Optional Slices

1. Build/test output-directory ownership cleanup is deferred until packaging,
   caching, or stale output issues make it a concrete blocker.
2. Introduce a shared search use case only if list, flow, or another non-table
   consumer needs common query semantics.
3. Extend JP1/AJS WebAPI support beyond read-only import only after the initial
   boundary, authentication model, and beta feedback are stable.
4. Revisit viewer-specific bundle-size reductions only if a future
   compatibility, startup, or payload target creates stronger pressure.
5. Revisit broader i18n translation-file consolidation only if future
   translation-resource maintenance creates a concrete blocker.
6. Add deeper JP1/AJS View interaction parity only when a concrete parity
   requirement outside the active unit-list usability feature is identified.
7. Add more expanded-flow layout regression fixtures only if real-world nested
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
