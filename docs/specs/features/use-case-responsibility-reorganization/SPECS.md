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
  ownership and references.
- Keep relative links and the requirements index consistent after moves,
  renames, splits, and consolidations.

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

- User-visible behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none.
- Changed scenarios: none; scenarios may move between documents without
  changing their behavioral meaning.

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
- JP1/AJS source reference: none; no JP1/AJS rule or supported behavior is
  changed.

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

## Non-Goals

- Changing extension behavior, JP1/AJS interpretation, diagnostics, viewers,
  report output, telemetry collection, or WebAPI import.
- Refactoring runtime modules to match the new documentation taxonomy.
- Adding new search, command-generation, semantic-diff, or telemetry behavior.
- Rewriting unrelated durable documentation.

## Open Questions

- The implementation-slice plan must decide whether command generation remains
  a separately indexed domain rule or is documented only as part of unit
  definition display while preserving its reusable contract.
- The implementation-slice plan must select the smallest durable home for the
  search-unification decision without creating a broader architecture taxonomy
  than this feature needs.
