# Feature Specification: Standardize Serialization And Composition Root

## Purpose

Make every extension-host/webview payload a plain neutral data contract and
make bootstrap the only place that constructs and connects concrete adapters,
application use cases, and presentation registrations.

## Minimal Context

- Current decision: complete the outer runtime boundary shared by desktop and
  web hosts.
- Read first: this file, `TASKS.md`, inventory traceability, and architecture
  serialization/bootstrap sections.
- Do not create `CONTEXT.md`.

## Origin

- Source: `docs/specs/architecture.md` Serialization Boundary, explicit
  composition root, and Web Extension Risks.
- Source use cases: all viewer and extension workflows that cross host or
  webview boundaries.
- JP1/AJS source reference: none beyond preserving existing definition-derived
  identity, hierarchy, relation, and content in neutral DTOs.
- Dependencies: application-boundary migration features and telemetry/WebAPI
  adapter boundaries.

## Requirements

- Webview and host payloads are standard-JSON round-trippable plain data with no
  class instances, methods, circular pointers, raw units, wrappers, VS Code
  objects, or infrastructure responses.
- Neutral contract types own explicit IDs for identity, hierarchy, and relations
  without reconstructing domain objects in presentation.
- Bootstrap alone constructs infrastructure adapters and application use cases,
  injects ports, registers presentation, selects desktop/web implementations,
  and manages lifecycle.
- Presentation and use cases do not construct concrete adapters.
- Existing activation, lifecycle, message routing, viewer behavior, desktop, and
  web behavior remain unchanged.

## Architecture

- Domain: no serialization, host, or composition responsibility.
- Application: own host-neutral DTO/contracts and use-case factories as needed.
- Presentation: serialize/consume DTOs and own host/webview interaction.
- Infrastructure: provide concrete adapters without presentation dependencies.
- Bootstrap: sole composition root and lifecycle owner.

## Impact Analysis

### Dependency Impact

- Affected surface: webview documents/messages, viewer bridge, panel factories,
  activation/bootstrap, adapter/use-case factories, lifecycle, tests, and bundles.
- Propagation decision: application DTO meaning is owned by upstream use-case
  features; this feature owns transport and construction only.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal message contracts and factories may
  change atomically with both endpoints.
- VS Code/web extension compatibility: this feature explicitly spans both and
  must preserve current availability and lifecycle.
- Changed scenarios: none.

### Alternative Considerations

- Serialize class graphs with custom circular-reference tooling: rejected
  because it preserves leaky domain/raw boundaries.
- Compose dependencies inside commands or use cases: rejected because ownership
  and host selection become distributed.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Payload meaning, message behavior, host availability, activation, or lifecycle
  changes require replanning and approval.

## Compatibility

- Preserve minimum VS Code version, standard browser bundling, activation,
  disposal, viewer events/state, and desktop/web behavior.

## Acceptance Criteria

- Every cross-host/webview payload passes standard JSON round-trip tests.
- Raw, wrapper, class, circular, VS Code, and infrastructure payload references
  are zero.
- Bootstrap is the only concrete application/infrastructure composition site.
- Desktop/web integration and build validation pass.

## Non-Goals

- New messages, UI behavior, service containers, bundle optimization, or host
  availability changes.

## Open Questions

- Inventory must identify every payload and construction site before planning.
