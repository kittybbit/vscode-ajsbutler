# Feature Specification: Complete WebAPI Infrastructure Boundaries

## Purpose

Confine JP1/AJS WebAPI transport, authentication, response mapping, and
host-specific adapter selection to infrastructure/bootstrap behind an
application-owned import port and DTO boundary.

## Minimal Context

- Current decision: complete architecture ownership for the already delivered
  read-only WebAPI import path.
- Read first: this file, `TASKS.md`, the import use case, and the existing
  `import-definition-via-webapi` feature.
- Do not create `CONTEXT.md`.

## Origin

- Source use case: `uc-import-ajs-definition-via-webapi.md`.
- Related feature: `docs/specs/features/import-definition-via-webapi/` owns beta
  behavior, real-environment evidence, and endpoint scope.
- Source: complete migration directive Slice 7.
- JP1/AJS source reference: JP1 Version 13 WebAPI Command Reference, manual
  3021-3-L49-20(E), Part 3 API, as mapped by the existing feature.
- Dependencies: inventory, parser boundary, and normalized domain model.

## Requirements

- Infrastructure owns WebAPI transport, authentication, generated client or
  response types, and server-response mapping.
- Application owns the import use case, port, DTOs, and host-neutral errors.
- Presentation never receives raw server responses or constructs adapters.
- Bootstrap selects and injects desktop/web-safe adapters and feature
  availability.
- Node-only dependencies do not enter shared web execution paths.
- Existing read-only beta behavior, privacy, and supported endpoint scope remain
  governed by the related feature and unchanged here.

## Architecture

- Domain: receive normalized imported definitions only.
- Application: own import coordination, port, DTOs, and errors.
- Presentation: collect input and present results/errors through application.
- Infrastructure: own HTTP, authentication, generated schemas, and mapping.
- Bootstrap: select and inject supported host adapters.

## Impact Analysis

### Dependency Impact

- Affected surface: import use case/port, WebAPI adapters, authentication,
  bootstrap availability, presentation command, generated boundary types, and
  desktop/web tests.
- Propagation decision: endpoint/beta changes stay in the existing feature.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal import contracts may change.
- VS Code/web extension compatibility: unsupported/supported host behavior must
  remain explicit and browser-safe.
- Changed scenarios: none.

### Alternative Considerations

- Extend the existing beta-evidence feature: rejected because that feature is
  blocked on external evidence and owns a different completion decision.
- Pass generated response objects through application: rejected as
  infrastructure leakage.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Endpoint, authentication behavior, beta labeling, or supported-host changes
  require coordination and re-approval with the related feature.

## Compatibility

- Preserve minimum VS Code version, read-only scope, privacy constraints,
  desktop beta behavior, current web availability decision, and response/error
  semantics.

## Acceptance Criteria

- Import crosses application only through repository-owned ports, DTOs, and
  errors.
- Transport/generated/authentication types remain in infrastructure.
- Adapter construction and host choice occur only in bootstrap.
- Existing WebAPI contract, mock, desktop/web, and privacy tests pass.

## Non-Goals

- New endpoints, write operations, beta exit, or invented real-environment
  evidence.

## Open Questions

- The guardrail baseline found no WebAPI-owned import violation. Planning must
  still confirm whether raw server response semantics leak across the adapter.
