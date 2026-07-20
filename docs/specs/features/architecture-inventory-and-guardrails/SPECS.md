# Feature Specification: Architecture Inventory And Guardrails

## Purpose

Create one verified inventory of production dependency violations and make the
current-to-target Clean Architecture gap executable as guardrails without
hiding existing violations.

## Minimal Context

- Current decision: establish the evidence and enforcement baseline required by
  every later migration feature.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when classifying
  dependencies or reviewing downstream coverage.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Source: `docs/specs/architecture.md` transitional and remaining-migration
  sections, plus the complete Clean Architecture migration directive.
- Source use cases: all durable use cases under
  `docs/requirements/use-cases/`.
- JP1/AJS source reference: no new product semantics; preserve the existing
  JP1/AJS3 version 13 behavior contracts and classify undocumented behavior as
  repository-observed compatibility evidence.
- Branch plan: `docs/specs/plans.md`.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: Inventory every production import of raw `Unit`, `UnitEntity`, unit wrappers,
  generated parser artifacts, host frameworks, telemetry SDKs, and outer-layer
  implementations relevant to the target dependency rules.
- R2: Classify every finding by legitimate layer ownership or named migration
  violation, with a downstream feature and validation target.
- R3: Record the current boundary state for all eleven durable use cases.
- R4: Extend architecture guardrails so rules can be introduced without weakening
  detection or silently exempting violations.
- R5: Any temporary allowlist must name its owner feature and removal condition
  and must be empty before final enforcement exits.

## Architecture

- Domain: inventory domain imports and prohibited outer dependencies; no new
  domain behavior.
- Application: inventory use-case entry points, DTOs, ports, raw/wrapper
  dependencies, and prohibited outer dependencies.
- Presentation: inventory parser, raw model, wrapper, infrastructure, SDK, and
  shared-domain-rule dependencies.
- Infrastructure: inventory adapter ownership and prohibited presentation or
  bootstrap dependencies.
- Bootstrap: inventory every concrete dependency composition site.

## Impact Analysis

### Dependency Impact

- Affected surface: all production TypeScript imports, architecture dependency
  tests, feature traceability, and migration sequencing.
- Propagation decision: this feature records and guards violations; later
  features own their removal.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: none during inventory.
- VS Code/web extension compatibility: both hosts must be represented in the
  inventory and guardrails.
- Changed scenarios: none.

### Alternative Considerations

- One umbrella implementation feature: rejected because it combines independent
  migration outcomes and approval boundaries.
- Ad hoc searches in each later feature: rejected because coverage and final
  zero-violation evidence would not have one owner.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Re-approval is required if this feature starts removing violations instead of
  only inventorying and enforcing their visibility.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: browser entry points and shared import chains
  must be inventoried.
- Desktop extension compatibility: desktop adapters and Node-only dependencies
  must be inventoried without changing behavior.

## Acceptance Criteria

- AC1: Every required dependency category and all eleven use cases have a recorded
  current state, target feature, and validation plan.
- AC2: Guardrails detect representative intentional violations.
- AC3: Existing violations remain visible and are not converted into permanent
  exceptions.

## Non-Goals

- Removing production violations, changing JP1/AJS semantics, or changing user
  behavior.

## Open Questions

- None. `TASKS.md` records the planned exact-match temporary allowlist and its
  ownership/removal requirements.
