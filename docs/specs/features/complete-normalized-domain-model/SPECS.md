# Feature Specification: Complete Normalized Domain Model

## Purpose

Make the normalized AJS document model the stable domain input for application
use cases by owning shared identity, hierarchy, relation, schedule, parameter
evidence, and unsupported-state semantics without transitional wrappers.

## Minimal Context

- Current decision: define the reusable JP1/AJS concepts required by downstream
  application pipelines.
- Read first: this file, `TASKS.md`, and inventory/parser traceability.
- Do not create `CONTEXT.md`.

## Origin

- Source: `docs/specs/architecture.md` Model Layers and domain-rule documents.
- Source use cases: all durable use cases that interpret normalized units.
- JP1/AJS source reference: JP1/AJS3 version 13 definition/config semantics
  already recorded in durable domain rules and use cases; repository-observed
  wrapper behavior remains compatibility evidence where undocumented.
- Dependencies: inventory and parser-boundary features.

## Requirements

- Represent document, stable unit identity, parent/child hierarchy, job groups,
  root/nested jobnets, relations, source evidence, raw/effective parameters,
  schedule context, and unsupported states as focused domain concepts.
- Move wrapper-owned semantics reused across consumers into domain entities,
  values, or services with explicit invariants.
- Keep presentation formatting and one-consumer projection choices outside the
  domain.
- Maintain one raw-to-normalized mapping path.
- Preserve existing JP1/AJS interpretation and identity compatibility unless a
  separately approved behavior change is required.

## Architecture

- Domain: own normalized concepts, shared rules, traversal, and domain errors.
- Application: orchestrate and project the model without redefining domain
  meaning.
- Presentation: no direct ownership of shared JP1/AJS semantics.
- Infrastructure: supply parser/import boundary data to the normalizer.

## Impact Analysis

### Dependency Impact

- Affected surface: `AjsDocument`, `AjsUnit`, normalizer, wrapper semantics,
  domain rules, and all later application migration features.
- Propagation decision: consumer-specific DTO migration stays in downstream
  features.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal domain contracts may evolve.
- VS Code/web extension compatibility: model must remain host-neutral and safe
  for both application paths.
- Changed scenarios: none unless existing behavior conflicts with durable rules.

### Alternative Considerations

- Preserve getter-only wrappers as the domain API: rejected because their
  invariants and ownership remain implicit.
- One giant normalized DTO: rejected because it obscures domain concepts.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Changes to identity, schedule, parameter, or relation meaning require
  replanning and explicit approval.

## Compatibility

- Preserve minimum VS Code version, desktop/web behavior, JP1/AJS3 version 13
  interpretation, source evidence, and large/malformed document handling.

## Acceptance Criteria

- Downstream application features can operate without raw `Unit` or legacy
  wrappers.
- Shared rules have one domain owner and focused tests.
- The model has no host, UI, generated-parser, SDK, network, or filesystem
  dependencies.

## Non-Goals

- New JP1/AJS rule coverage, application DTO design, or presentation changes.

## Open Questions

- Inventory must determine which wrapper semantics are shared domain rules and
  which belong to projections or presentation.
