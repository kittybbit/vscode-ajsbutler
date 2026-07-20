# Feature Specification: Isolate Telemetry Adapter Boundary

## Purpose

Confine telemetry SDK usage and event translation to infrastructure while all
callers use a privacy-preserving repository-owned port whose failures cannot
change use-case behavior.

## Minimal Context

- Current decision: establish one telemetry ownership and failure boundary.
- Read first: this file, `TASKS.md`, and telemetry sections of architecture and
  roadmap.
- Do not create `CONTEXT.md`.

## Origin

- Source: `docs/specs/architecture.md` Telemetry Boundary and roadmap telemetry
  privacy policy.
- Source use cases: cross-cutting operational reporting only; no telemetry is a
  domain behavior contract.
- JP1/AJS source reference: none; telemetry must not collect definition content,
  paths, credentials, or personal identifiers.
- Dependencies: architecture inventory.

## Requirements

- Telemetry SDK imports exist only in infrastructure adapters.
- Application and presentation callers depend on repository-owned ports or
  host-neutral operation reporting contracts.
- Event-name/schema ownership is explicit and does not expose SDK types.
- Bootstrap creates and injects the adapter.
- Telemetry failure never changes parser, viewer, import, diagnostics, hover,
  navigation, diff, or report behavior.
- Existing event meaning and privacy restrictions remain unchanged.

## Architecture

- Domain: no telemetry dependency.
- Application: optional host-neutral operation reporting port where needed.
- Presentation: report allowed events through injected contracts only.
- Infrastructure: own SDK adapter and translation.
- Bootstrap: select, construct, and inject telemetry implementation.

## Impact Analysis

### Dependency Impact

- Affected surface: telemetry port/schema, SDK adapter, bootstrap, callers, and
  privacy/failure tests.
- Propagation decision: new analytics events or product questions are out of
  scope.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: internal telemetry contract may change while
  emitted meaning remains stable.
- VS Code/web extension compatibility: adapter selection and failure behavior
  must remain safe on both hosts.
- Changed scenarios: none.

### Alternative Considerations

- Allow direct SDK calls in presentation: rejected as concrete infrastructure
  coupling.
- Move event schema into domain: rejected because telemetry is not domain
  meaning.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- New events, properties, bucket semantics, or privacy scope require separate
  planning and approval.

## Compatibility

- Preserve `engines.vscode`, desktop/web behavior, event meaning, no-op/failure
  behavior, and all privacy constraints.

## Acceptance Criteria

- SDK production imports are limited to infrastructure.
- All construction occurs in bootstrap and callers use injected contracts.
- Failure-isolation and privacy tests cover representative workflows.

## Non-Goals

- Adding telemetry, changing dashboards, or collecting new data.

## Open Questions

- Inventory must establish whether event schemas are currently duplicated or
  owned implicitly by callers.
