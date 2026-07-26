# Feature Specification: Remove Legacy And Enforce Clean Architecture

## Purpose

Remove the superseded raw/wrapper/compatibility paths, eliminate all temporary
architecture exceptions, and establish the completed DDD/Clean Architecture
boundaries as tested repository invariants and accurate durable documentation.

## Minimal Context

- Current decision: provide the final zero-legacy, zero-exception migration exit.
- Read first: this file, `TASKS.md`,
  `src/test/support/architectureDependencyRules.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Do not create `CONTEXT.md`.

## Origin

- Source: complete migration directive Slice 11 and Feature Exit criteria.
- Source use cases: all eleven durable use cases as preserved by predecessor
  features.
- JP1/AJS source reference: no new semantics; final compatibility evidence comes
  from approved predecessor tests and existing version 13 contracts.
- Dependencies: every other feature in this roadmap migration sequence.

## Requirements

- Remove legacy wrapper production code, unused raw helpers, superseded
  compatibility adapters, and obsolete migration-only paths after all consumers
  are migrated.
- Remove every temporary architecture allowlist entry; no permanent exception is
  accepted as feature completion.
- Enforce final Domain, Application, Presentation, Infrastructure, Bootstrap,
  parser/raw, serialization, SDK, host, and composition rules automatically.
- Demonstrate that representative intentional violations fail the guardrails.
- Update `docs/specs/architecture.md` to describe only the established current
  structure and update `AGENTS.md` to state the boundaries as invariants.
- Remove completed migration history from durable documents and close feature
  folders only through Feature Exit review.

## Architecture

- Domain: no outer framework, host, generated parser, infrastructure,
  presentation, or bootstrap dependencies.
- Application: depend only inward and expose host-neutral use cases/ports/DTOs.
- Presentation: depend on application contracts without raw/parser/wrapper/
  infrastructure/SDK leakage.
- Infrastructure: implement application ports without presentation/bootstrap
  dependencies.
- Bootstrap: sole concrete composition and lifecycle owner.

## Impact Analysis

### Dependency Impact

- Affected surface: legacy files/imports, architecture tests, CI validation,
  `architecture.md`, `AGENTS.md`, roadmap/plans, and predecessor traceability.
- Propagation decision: this feature removes only artifacts proven superseded;
  missing migrations return to the owning predecessor feature.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: legacy internal APIs are removed only after zero
  production consumers and approved replacements are verified.
- VS Code/web extension compatibility: final validation covers both hosts and
  preserves `engines.vscode`.
- Changed scenarios: none.

### Alternative Considerations

- Leave deprecated wrappers or permanent allowlists: rejected because the target
  invariant would remain optional.
- Rewrite durable docs before code evidence: rejected because documentation must
  describe established current state.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Any behavior fix, unresolved migration, compatibility exception, or deferred
  legacy reference requires returning to the owning feature and re-approval.

## Compatibility

- Preserve parser, list, graph, CSV, definition, diagnostics, hover, navigation,
  semantic diff/report, telemetry privacy, desktop/web behavior, and minimum VS
  Code version.

## Acceptance Criteria

- Legacy wrapper production references, unauthorized raw references, obsolete
  compatibility adapters, and temporary allowlists are zero.
- Final architecture tests cover every layer and detect intentional violations.
- All required tests, qlty, web tests, build, Markdown lint, and diff checks pass.
- Durable architecture and agent policy describe current invariants with no
  remaining migration language.
- Every predecessor feature requirement and all eleven use cases have final
  validation evidence or an explicit non-applicability decision.

## Non-Goals

- New user features, behavior changes, dependency modernization, UI redesign,
  performance-only rewrites, or deferring unfinished migration to another
  roadmap item.

## Open Questions

- None at intake; implementation may start only after all dependencies satisfy
  their exit criteria and this feature is planned, reviewed, and approved.
