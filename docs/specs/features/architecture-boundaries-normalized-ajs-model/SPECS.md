# Feature Specification: Architecture Boundaries And Normalized AJS Model

## Purpose

Strengthen application-facing AJS boundaries so new or changed use cases prefer
the normalized `AjsDocument` / `AjsUnit` model over parser-adjacent `Unit` trees
or `UnitEntity` wrappers.

## Origin

- Source use cases:
  - `docs/requirements/use-cases/uc-normalize-ajs-document.md`
  - `docs/requirements/use-cases/uc-build-unit-list.md`
  - `docs/requirements/use-cases/uc-build-unit-list-view.md`
  - `docs/requirements/use-cases/uc-export-unit-list-csv.md`
  - `docs/requirements/use-cases/uc-build-flow-graph.md`
  - `docs/requirements/use-cases/uc-show-unit-definition.md`
- Branch plan: `docs/specs/plans.md`
- Roadmap: `docs/specs/roadmap.md` normalized-model convergence and stricter
  parser/infrastructure boundaries
- Implementation-slice plan: `TASKS.md`

## Requirements

- Inventory application and presentation paths that still consume raw `Unit` or
  `UnitEntity` directly.
- Select implementation slices that reduce or prevent additional exposure of
  raw `Unit` and `UnitEntity` at application-facing boundaries.
- Preserve current parser, unit list, flow graph, CSV export, unit-definition,
  diagnostics, hover, and telemetry behavior unless a separate approved feature
  changes observable behavior.
- Keep reusable JP1/AJS semantics in domain or application helpers when they
  are shared across consumers; keep table, CSV, and webview display formatting
  in application DTO projection or presentation code as appropriate.
- Decide how dependency rules are checked mechanically and whether the first
  CI integration should be advisory, scoped, or blocking.
- Keep desktop and web extension compatibility explicit for each approved
  implementation slice.

## Architecture

- Domain:
  Owns stable JP1/AJS concepts, value objects, normalized model helpers, and
  reusable interpretation rules that are not presentation-specific.
- Application:
  Owns use cases, DTOs, ports, and normalized-model projection into stable
  list, CSV, graph, definition, diagnostic, or hover outputs.
- Presentation:
  Owns VS Code/webview/React integration, table and graph rendering, visible
  formatting, host-specific copy/save/open actions, and UI-library adapters.
- Infrastructure:
  Owns parser adapters, generated ANTLR mechanics, host-neutral parser ports,
  WebAPI or file adapters, telemetry SDK adapters, and other concrete services.
- Bootstrap:
  Owns composition of concrete dependencies for desktop and web extension
  execution without leaking adapter mechanics into domain or application code.

## Boundary Rules

- `src/domain` must not import `vscode`, React, MUI, XyFlow, webview modules, or
  generated parser mechanics.
- `src/application` may depend on `src/domain` but must not import
  presentation or infrastructure modules.
- Presentation code must not parse raw AJS grammar output directly when an
  application use case exists for the behavior.
- UI components should consume DTOs or view models rather than raw `Unit`,
  `UnitEntity`, parser contexts, or generated ANTLR types.
- Shared code used by web extension execution must not gain unguarded Node-only
  imports.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  application use cases and presentation adapters that build unit-list rows,
  CSV export payloads, flow graph DTOs, unit-definition content, hover content,
  diagnostics, or telemetry-relevant operation metadata.
- Propagation decision:
  move one use-case path at a time behind normalized DTO boundaries, preserve
  wrapper behavior where it is still the migration source, and avoid broad
  wrapper deletion in this feature.

### Breaking Change Analysis

- User-visible behavior: none intended; this is a behavior-preserving boundary
  migration unless a later slice receives explicit approval for a visible
  change.
- API/DTO/schema compatibility:
  application DTOs may gain normalized-model input paths, but webview message
  payload shape changes require explicit slice approval and regression tests.
- VS Code/web extension compatibility:
  no minimum VS Code version change is allowed; web-compatible shared imports
  must stay free of unguarded Node-only behavior.
- Changed scenarios: none at feature intake; impacted use-case scenarios are
  tracked in `TRACEABILITY.md`.

### Alternative Considerations

- Migrate all wrapper consumers in one pass:
  rejected because it is too broad and risks losing wrapper-held semantics.
- Start with dependency-rule static checks only:
  deferred as a possible early slice, but it may expose many existing
  violations before any consumer boundary is clarified.
- Start with Unit List / CSV Export path:
  preferred first candidate because related use cases and tests already exist,
  behavior can be checked in desktop and web paths, and the scope is narrower
  than a flow-graph rewrite.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval:
  parser grammar changes, JP1/AJS semantic changes, webview payload schema
  changes, CI policy changes from advisory to blocking, VS Code minimum version
  changes, telemetry payload changes, or migration of additional use cases
  beyond the approved slice.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; this feature
  must not casually raise the minimum version.
- Web extension compatibility:
  every approved slice must verify shared imports and browser build assumptions
  for the touched path.
- Desktop extension compatibility:
  existing parser, preview, diagnostics, hover, CSV, flow, and telemetry paths
  must remain compatible unless separately approved.
- JP1/AJS compatibility:
  JP1/AJS3 version 13 remains the normative target for new or changed command
  and parameter semantics. Pure boundary migration should preserve existing
  interpretation.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The selected implementation slice identifies existing raw `Unit` and
  `UnitEntity` exposure on its application/presentation path.
- The selected implementation slice reduces exposure or explicitly prevents
  new exposure of raw `Unit` and `UnitEntity` at the targeted application
  boundary.
- Reusable JP1/AJS semantics and display formatting responsibilities are named
  for the targeted path.
- Dependency-rule verification is evaluated and a CI integration decision is
  recorded before feature exit.
- Desktop and web validation expectations are recorded for each implementation
  slice.
- Existing parser, unit list, flow graph, CSV export, diagnostics, hover, and
  telemetry behavior remains preserved for untouched paths.
- Any JP1/AJS3 version 13 semantic addition or change records the manual basis
  in `TRACEABILITY.md`.

## Non-Goals

- Remove every wrapper or `UnitEntity` consumer in one broad rewrite.
- Change parser grammar or parser output semantics.
- Expand JP1/AJS3 WebAPI behavior.
- Raise the minimum supported VS Code version.
- Redesign table or flow UI.
- Remove existing user-visible behavior.
- Add telemetry containing file content, file paths, personal identifiers, or
  raw definition content.

## Resolved Planning Decisions

- The first implementation slice targets unit-list document serialization
  through normalized DTOs before CSV export or dependency-rule enforcement.
- Dependency-rule checking should start as a scoped test enforced by the
  existing non-doc Verify workflow through desktop tests, not as a new CI
  workflow or broad third-party architecture tool.
- Wrapper semantics should stay migration-source behavior during the first
  slices unless a specific shared rule needs promotion into normalized helpers
  and is covered by tests plus approval.

## Open Questions

- None before plan review.
