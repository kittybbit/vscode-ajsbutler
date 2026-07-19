# Feature Specification: Use-Case Responsibility Reorganization

## Purpose

Reclassify the durable requirements documentation so that user/application use
cases, shared domain rules, cross-cutting requirements, implementation
specifications, and future design decisions each have one clear document home.

## Minimal Context

- Current decision: reorganize documentation responsibilities without changing
  JP1/AJS behavior, extension behavior, or runtime ownership.
- Read first: this file, `TASKS.md`, and
  `docs/requirements/use-cases/README.md`.
- Read `TRACEABILITY.md` only when checking the affected document mapping.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` as the SDD policy
  source.

## Origin

- Source: human review of the current `docs/requirements/use-cases/` taxonomy
  and responsibility boundaries.
- Branch plan: `docs/specs/plans.md`
- Implementation-slice plan: `TASKS.md`

## Requirements

- Keep only stable user-visible or application-visible behavior contracts in
  `docs/requirements/use-cases/`.
- Move shared domain capabilities, cross-cutting requirements, implementation
  details, and future design decisions to their appropriate durable or
  feature-local document categories.
- Consolidate or split use cases when the current files reflect internal
  processing stages instead of one user/application purpose.
- Make JP1 parameter interpretation the single normative source for shared
  parameter semantics and remove duplicated normative ownership from
  consumers.
- Preserve all currently documented observable behavior while reorganizing its
  ownership and references, except where an official version 13 source proves
  a provisional parameter value incorrect; correct that durable requirement
  and defer runtime conformance explicitly.
- Keep relative links and the requirements index consistent after moves,
  renames, splits, and consolidations.
- Make every published `JP1-PARAM-*` rule deterministic by stating its exact
  target parameters and unit types, preconditions, effective values, defaults,
  ranges or allowed forms, exclusions, and official JP1/AJS3 version 13 source.
- Make each consumer enumerate the exact rule IDs it consumes, or explicitly
  state that it has no current rule-ID dependency.
- Define the flow layout boundary so application-owned constraints and
  presentation-owned coordinates, bounds, and dimensions cannot be confused.
- Preserve requirement-level migration evidence and reproducible final
  validation until the transient feature is approved for closure.
- Treat the official Hitachi JP1/AJS3 version 13 manual as authoritative when
  durable parameter requirements and the current implementation disagree.
- Record each discovered implementation mismatch as actionable deferred work
  for an independent conformance feature without changing runtime behavior in
  this docs-only feature.

## Architecture

- Domain: no runtime change; documentation may classify normalization,
  parameter interpretation, and command generation as shared domain rules.
- Application: no runtime change; use-case documents remain organized around
  stable application purposes.
- Presentation: no runtime change; viewer and report presentation behavior is
  separated from graph/diff construction where the contract warrants it.
- Infrastructure: no runtime change; the existing WebAPI boundary remains
  unchanged.

## Impact Analysis

### Dependency Impact

- Affected docs: the requirements index, current use-case files, newly created
  domain-rule and cross-cutting requirement files, the search design-decision
  document, and feature-local SDD artifacts.
- Propagation decision: update all repository-local Markdown references to
  moved or consolidated documents; leave runtime code, tests, configuration,
  and generated artifacts unchanged.

### Breaking Change Analysis

- User-visible runtime behavior: none.
- Durable requirement correction: parameter meaning follows the official
  version 13 manual even when the current implementation does not yet conform.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none.
- Changed scenarios: none; scenarios may move between documents without
  changing their behavioral meaning, except that an incorrect provisional
  value is corrected to the official version 13 contract and its runtime gap is
  deferred explicitly.

### Alternative Considerations

- Keep the current file layout and only clarify the index: rejected because it
  leaves implementation detail, future decisions, and cross-cutting policy in
  the use-case category.
- Reorganize every requirement area at once: rejected; this feature is limited
  to the concrete files and responsibility problems identified by the source
  review.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: runtime, test, configuration, generated
  artifact, or user-visible behavior changes; new requirement categories beyond
  those needed by the reviewed document set.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` and is not
  changed.
- Web extension compatibility: unchanged because this is documentation-only.
- Desktop extension compatibility: unchanged because this is
  documentation-only.
- JP1/AJS source reference: official Hitachi JP1/AJS3 version 13 manual pages
  are authoritative for deterministic requirements. Runtime behavior and
  product-version scope are unchanged in this feature; implementation gaps are
  deferred to independent conformance features.

## Acceptance Criteria

- Each affected requirement has one clear normative document owner.
- Use-case files describe stable user/application purposes rather than file or
  module ownership.
- Implementation paths, classes, migration steps, and algorithm ownership are
  absent from durable use-case contracts.
- Search unification, telemetry, and shared domain capabilities are classified
  outside user/application use cases.
- Unit-list, editor-feedback, flow, and semantic-diff responsibilities follow
  the reviewed consolidation or split boundaries.
- Repository-local Markdown references resolve after the reorganization.
- Required docs-only validation passes.
- Every defined rule ID has one deterministic normative body and every
  referenced rule ID resolves to it.
- Diagnostics guarantee only violations of explicitly supported diagnostic
  rule IDs and do not imply complete JP1/AJS3 manual coverage.
- Flow construction owns deterministic structure and placement constraints;
  presentation owns absolute coordinates, rendered bounds, panel dimensions,
  and UI-library layout values.
- Every old scenario and rule maps to a new owner or an explained intentional
  removal, with zero unmapped requirements.
- Final validation records the commit, commands, mapping totals, stale-link
  count, and undefined or unreferenced rule-ID counts.
- Every implementation/manual mismatch discovered during rule completion is
  traceable to an actionable independent-feature entry and is not normalized
  into the durable requirement as if the implementation were authoritative.

## Non-Goals

- Changing extension behavior, JP1/AJS interpretation, diagnostics, viewers,
  report output, telemetry collection, or WebAPI import.
- Refactoring runtime modules to match the new documentation taxonomy.
- Correcting runtime diagnostics or tests to conform to the official manual.
- Adding new search, command-generation, semantic-diff, or telemetry behavior.
- Rewriting unrelated durable documentation.

## Open Questions

- None. Command generation remains a shared domain rule, the future shared-
  search trigger is owned by `docs/specs/roadmap.md`, and official Hitachi
  JP1/AJS3 version 13 Command Reference pages are the source basis for
  parameter-rule completion.
