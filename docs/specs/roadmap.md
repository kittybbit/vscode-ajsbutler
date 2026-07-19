# Roadmap

## Principles

- Preserve behavior first.
- Refactor in meaningful implementation slices that can be reviewed, tested,
  approved, and committed independently.
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
   - Introduce shared application or domain search semantics only when at least
     two non-table consumers require equivalent matching or result-navigation
     behavior and a focused feature is separately approved.

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
   - Completed: unit-list document serialization now crosses the webview
     boundary as a normalized DTO, and CSV export now uses application-facing
     row input before presentation copy/save actions.
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
   - A scoped architecture dependency test now checks high-value domain,
     application, and presentation import boundaries through the existing
     desktop test path.
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

   - The temporary qlty parity feature against `v1.15.1` is complete; the final
     upstream smell comparison reports no smells after the focused unit-type
     i18n resource slice.
   - Remaining metrics-only deltas should not drive implementation by
     themselves.
   - Open a new focused feature only when a future Qlty finding maps to a
     meaningful JP1/AJS concept, application use case, adapter boundary, or
     maintainability risk.

8. Improve telemetry as a privacy-preserving product capability.

   - Design telemetry to answer product-improvement questions rather than only
     usage counts.
   - Preserve the narrow telemetry adapter boundary while adding schema-owned
     event names, allowlisted properties, duration and size buckets, error
     categories, diagnostic categories, and workflow stages.
   - Do not collect job names, unit names, comments, commands, definition
     contents, file paths, search text, user names, organization names,
     credentials, prompts, responses, raw errors, or server identifiers.
   - Use telemetry evidence to support prioritization for current viewers,
     diagnostics, search, WebAPI import, and future roadmap capabilities such
     as unified search, semantic diff, dependency analysis,
     review support, and AI-assisted features.
   - For roadmap capabilities, document event families and privacy constraints
     before implementation pressure appears, but add runtime telemetry only
     with the corresponding approved feature behavior.
   - AI-assisted feature telemetry must remain limited to anonymous
     operational metadata and must never include prompts, responses,
     definition content, generated content, provider account identifiers, raw
     model errors, or stack traces.
   - Revisit telemetry dashboard compatibility, exact bucket boundaries,
     diagnostic rule IDs, and observable abandonment semantics only when
     analytics usage, product reporting, or a future feature makes those
     decisions concrete.

9. Semantic diff for JP1/AJS3 definitions (complete).

   - Compare before and after JP1/AJS3 job-group definitions by semantic
     jobnet, unit, relation, execution-attribute, condition, wait, and
     schedule changes rather than raw text differences.
   - Keep comparison logic in domain/application boundaries and expose
     presentation/report behavior through DTOs so desktop and web hosts remain
     compatible.
   - Implement in reviewed slices: structure and deterministic identity
     matching first, start/wait confirmation checks second, and schedule
     comparison after the supported schedule scope is narrowed.
   - Complete the user workflow with editor-title discoverability, displayed
     Markdown report review, explicit Markdown copy, reusable semantic diff
     sample coverage, and Japanese report wording when VS Code display
     language is Japanese before feature exit.
   - Keep confirmation-required wording constrained to possible definition
     impacts and explicitly state when runtime environment facts are not
     verified.

10. Align runtime diagnostics with authoritative JP1/AJS3 version 13 parameter
    requirements.

    - Limit conformance work to rule IDs already promised by the diagnosis Use
      Case; comprehensive coverage of every version 13 parameter is outside the
      feature.
    - Correct the confirmed yearly schedule, repeated event-filter aggregate,
      transfer-file context, QUEUE/recovery QUEUE target, and governed-content
      byte-length gaps.
    - Keep diagnostic decisions host neutral and shared by desktop and web
      entry points without changing syntax parsing, hover, list, or flow
      behavior.
    - Treat the durable parameter rule as normative when implementation and
      documentation differ; do not weaken the rule to preserve an incorrect
      runtime value.
    - Active feature:
      `docs/specs/features/jp1-v13-runtime-diagnostic-conformance/`.

## Deferred / Optional Slices

1. Build/test output-directory ownership cleanup is deferred until packaging,
   caching, or stale output issues make it a concrete blocker.
2. Introduce a shared search use case only when at least two non-table
   consumers need equivalent matching or result-navigation semantics. Keep
   rendering, React Flow camera behavior, and TanStack ranking outside that
   future contract.
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
