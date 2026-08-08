# Feature Specification: Infrastructure Boundary Cleanup

## Purpose

Isolate VS Code viewer-panel lifecycle and plain viewer transport at the
`src/presentation/vscode/webview/ViewerFactory.ts` boundary, so
application-facing viewer behavior remains host-neutral while panel behavior
stays compatible on desktop and web extension hosts.

## Minimal Context

- Current decision: select the VS Code `ViewerFactory` boundary as the single
  Infrastructure Boundary Cleanup target.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when planning
  or validating the selected slice.
- Do not create `CONTEXT.md`; the SDD policy and document roles are owned by
  `docs/specs/README.md`.

## Origin

- Feature kind: roadmap feature, ordered refactoring Feature 8.
- Source roadmap item: `docs/specs/roadmap.md`, “Infrastructure Boundary
  Cleanup”.
- Source baseline evidence: `docs/specs/features/BASELINE.md`, “Intake group
  9: VS Code viewer factory boundary”.
- Source use cases:
  `docs/requirements/use-cases/uc-view-unit-list.md` and
  `docs/requirements/use-cases/uc-build-flow-graph.md`.
- Related compatibility contract:
  `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`.
- JP1/AJS basis: repository-owned use-case contracts for normalized JP1/AJS
  list and flow results. This feature introduces no new JP1/AJS syntax or
  product semantics and has no additional external JP1/AJS manual reference.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- Keep VS Code panel creation, reuse, title selection, message reception,
  readiness, navigation forwarding, save forwarding, and disposal inside the
  VS Code presentation boundary.
- Keep application-facing viewer callbacks, telemetry usage, and transport
  data neutral; they must not expose VS Code panel objects, parser structures,
  generated ANTLR types, domain wrappers, or UI-framework types.
- Preserve the existing direction-specific plain viewer message contracts and
  their validation and failure behavior while the boundary is reorganized.
- Preserve one-panel-per-document reuse, active-panel checks, setup cleanup,
  lifecycle disposal, and predictable setup failures.
- Preserve the existing zero-exception architecture catalog. Do not add an
  architecture allowlist entry or a service container.
- Keep shared contracts safe for both desktop and browser extension bundles;
  production source must not gain Node built-ins or filesystem assumptions.

## Architecture

- Domain: none; normalized JP1/AJS meaning and domain models remain
  unchanged.
- Application: retain only host-neutral viewer contracts and existing ports;
  no VS Code types or panel lifecycle ownership is added.
- Presentation: own `ViewerFactory`, VS Code panel APIs, panel lifecycle,
  display-title selection, and the host-side message bridge.
- Infrastructure: none for this selected boundary; parser, WebAPI, file/host,
  localization, and telemetry adapter candidates remain outside this feature.

## Impact Analysis

### Dependency Impact

- Affected boundary and callers: `ViewerFactory`, its viewer message helpers,
  `src/bootstrap/extension/viewerWiring.ts`, and the preview command adapter.
- Affected validation: `src/test/suite/viewerFactory.test.ts`,
  `src/test/suite/viewerWiring.test.ts`, and any desktop/web boundary checks
  required by the approved slice.
- Propagation decision: preserve the current plain transport and callback
  contracts; change only the selected host-boundary responsibility. Parser,
  domain, application use-case behavior, webview rendering, and unrelated
  refactoring feature folders remain unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended; viewer opening, reuse, readiness,
  navigation, save, resource handling, and disposal must remain stable.
- API/DTO/schema compatibility: no message-schema or application-DTO change
  is intended. Any required contract change is a replan decision.
- VS Code/web extension compatibility: panel lifecycle and plain transport
  must remain compatible on both desktop and browser hosts, with host impact
  validated separately.
- Changed scenarios: none; the existing unit-list, flow-graph, and
  cross-view navigation scenarios remain the compatibility contract.

### Alternative Considerations

- Leave `ViewerFactory` unchanged: rejected because the baseline identifies
  its host lifecycle and transport responsibility as a bounded cleanup target.
- Move panel lifecycle into application or domain: rejected because it would
  violate the repository dependency direction and expose host concerns
  inward.
- Move the factory into infrastructure: rejected for this intake because
  panel rendering and VS Code lifecycle are presentation responsibilities.
- Introduce a service container or change viewer message schemas: rejected as
  unnecessary scope and incompatible with the current architecture policy.

### Approval Impact Decisions

- Approval evidence owner: the `TASKS.md` sections named `Human Approval`,
  `Completion Approval`, or `Closure Approval`, according to the lifecycle
  gate.
- Scope changes requiring re-approval: any change to application ports,
  viewer message schemas, user-visible lifecycle behavior, parser/domain
  contracts, host compatibility, or any boundary outside `ViewerFactory`.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; it must not
  be raised by this feature.
- Web extension compatibility: browser-safe shared contracts and the same
  viewer lifecycle semantics remain available without Node-only APIs.
- Desktop extension compatibility: VS Code panel APIs, telemetry forwarding,
  save/resource handling, reuse, disposal, and setup failure behavior remain
  stable.
- JP1/AJS compatibility: list and flow results for supported definition
  files, including large or malformed input handling owned by their use
  cases, are unaffected by this host-boundary cleanup.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The approved implementation keeps VS Code-specific lifecycle details out of
  application and domain code and keeps parser/generated/UI-framework types
  out of the viewer boundary.
- Existing viewer factory and viewer wiring tests cover panel creation,
  reuse, readiness, navigation, serialized message handling, disposal, setup
  cleanup, and failure behavior.
- Desktop and browser extension validation demonstrates preserved panel and
  plain-transport compatibility for the affected viewer paths.
- The architecture dependency test remains zero-exception and no new
  allowlist entry is added.
- `uc-view-unit-list`, `uc-build-flow-graph`, and the related cross-view
  navigation contract remain behaviorally unchanged.
- No `CHANGELOG.md` update is required unless planning or implementation
  identifies an externally observable behavior change; that decision is
  recorded in `TASKS.md`.

## Non-Goals

- Moving or redesigning parser, ANTLR, normalized-model, WebAPI, file/host,
  localization, or telemetry boundaries.
- Changing panel titles, viewer message schemas, webview rendering, graph or
  table behavior, commands, or user workflows.
- Adding a service container, architecture exception, Node built-in, or
  desktop-only assumption to shared code.
- Raising the minimum supported VS Code version.
- Implementing any runtime change before a reviewed plan and explicit Human
  Approval.

## Open Questions

- Resolved in Planning: the existing neutral viewer request/host-message
  contracts are sufficient. The cleanup uses an injected VS Code panel
  registration bridge and introduces no new application port or message
  schema.
