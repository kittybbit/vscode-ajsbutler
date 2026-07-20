# Feature Specification: Complete Normalized Domain Model

## Purpose

Make the normalized AJS document model the stable domain input for application
use cases by owning shared identity, hierarchy, relation, schedule, parameter
evidence, and unsupported-state semantics without transitional wrappers.

## Minimal Context

- Current decision: define the reusable JP1/AJS concepts required by downstream
  application pipelines.
- Read first: this file, `TASKS.md`, the wrapper entries in
  `src/test/fixtures/architecture/dependencyAllowlist.ts`, and parser-feature
  traceability when available.
- Do not create `CONTEXT.md`.

## Origin

- Source: `docs/specs/architecture.md` Model Layers and domain-rule documents.
- Source use cases: all durable use cases that interpret normalized units.
- JP1/AJS source reference: JP1/AJS3 version 13 definition/config semantics
  already recorded in durable domain rules and use cases; repository-observed
  wrapper behavior remains compatibility evidence where undocumented.
- Dependencies: completed guardrail baseline and the parser-boundary feature.

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
- Remove the obsolete presentation fallback to legacy `Parameter` objects only
  after the primitive `UnitListRowView` contract proves that fallback is
  unreachable; preserve table rendering, search, and CSV behavior.
- Remove all 88 exact `legacy-wrapper-dependency` edges owned by this feature
  without adding replacement wildcard allowances or compatibility shims. The
  baseline consists of 86 recorded allowances plus two previously unallowlisted
  `LegacyUnitSource` edges that must be registered exactly before later removal.

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
- Boundary clarification: the table pipeline already consumes primitive
  `UnitListRowView` values. Removing its obsolete `Parameter` class fallback is
  prerequisite cleanup for retiring the wrapper graph, not a DTO migration or
  presentation behavior change. Broader table, CSV, and definition boundary work
  remains in `migrate-unit-information-boundaries`.

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
- Table rendering, search, and CSV no longer import legacy `Parameter`, while
  their current output remains unchanged; the primitive row DTO carries no
  reachable default/inherited styling metadata to remove.
- Architecture validation reports zero remaining allowances owned by this
  feature and no stale or replacement wildcard entry.

## Non-Goals

- New JP1/AJS rule coverage, application DTO design, or presentation changes.

## Open Questions

- Resolved by replanning: the eight normalizer-to-unit-helper allowances carry
  shared normalized domain meaning. Two previously unallowlisted
  `LegacyUnitSource` imports also belong to the wrapper-only graph. After
  Slice 1 removes the eight normalizer edges and registers those two exact baseline
  edges, the remaining 80 owned allowances form a wrapper-only graph with no
  production consumer outside that graph and are removable after the obsolete
  table `Parameter` fallback is removed.
