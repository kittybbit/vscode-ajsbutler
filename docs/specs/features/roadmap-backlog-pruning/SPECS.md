# Feature Specification: Roadmap Backlog Pruning

## Purpose

Keep `docs/specs/roadmap.md` limited to evidence-backed unfinished
repository-level work by removing obsolete or speculative entries without
changing product behavior.

## Minimal Context

- Current decision: retain only roadmap entries with a concrete unresolved
  concern and a distinct repository-level owner.
- Read first: this file, `TASKS.md`, `docs/specs/roadmap.md`, and the current
  `import-definition-via-webapi/TASKS.md` state.
- Do not create `CONTEXT.md`; approval and document roles remain owned by
  `docs/specs/README.md`.

## Origin

- Source: the current conversation's request to reassess deferred and
  unstarted roadmap entries.
- Feature kind: transient branch feature.
- JP1/AJS reference basis: repository-planning maintenance only; no JP1/AJS
  behavior or manual interpretation changes.
- Implementation-slice plan: `TASKS.md` after Planning Mode.

## Requirements

- Remove `Architecture Boundary Protection` because the shared baseline does
  not demonstrate a concrete dependency, cycle, or enforcement gap and the
  current architecture suite remains green.
- Remove `Telemetry Product Learning` because no concrete product question,
  analytics consumer, or approved feature currently requires a telemetry
  contract change.
- Remove deferred candidates whose entry conditions are not met and which do
  not own concrete unfinished work.
- Do not promote `Build And Test Output Ownership` as a separate feature: the
  verified stale OpenAPI artifact is already owned by the existing
  `import-definition-via-webapi` feature's Replanning note.
- Retain `WebAPI Import Beta Exit` because real-environment verification and
  user feedback remain concrete unfinished product evidence owned by the
  existing blocked feature.
- Remove refactoring-program ordering text and shared-baseline retention text
  when no unfinished dependent refactoring feature remains.
- Remove `docs/specs/features/BASELINE.md` with the roadmap cleanup because its
  documented retention condition ends when the last dependent refactoring
  candidate is removed.
- Remove the now-inapplicable `BASELINE.md` ownership and retention references
  from `docs/specs/README.md` so the SDD SSOT does not point to deleted
  temporary evidence.

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: none.
- Durable documentation: `roadmap.md` continues to own only unfinished
  repository-level work; temporary shared baseline evidence is removed after
  its consumers are complete or pruned.

## Impact Analysis

### Dependency Impact

- Affected docs: `docs/specs/roadmap.md`, `docs/specs/README.md`, and
  `docs/specs/features/BASELINE.md`.
- Existing `import-definition-via-webapi` feature documents remain unchanged
  and continue to own beta evidence and the stale generated-artifact replan.
- Runtime code, tests, generated artifacts, configuration, README, and
  CHANGELOG remain unchanged.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none.
- Changed scenarios: none.

### Alternative Considerations

- Promote every deferred candidate: rejected because none has both a met entry
  condition and a distinct unowned implementation scope.
- Keep evidence-gated placeholders indefinitely: rejected because the roadmap
  explicitly excludes speculative work without a current entry condition.
- Promote the stale OpenAPI artifact as a new output-ownership feature:
  rejected because the existing WebAPI feature already owns the required
  replan and separate ownership would duplicate scope.
- Keep `BASELINE.md` after removing its last dependent candidate: rejected
  because its own retention policy ends with the large-scale refactoring
  effort.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` lifecycle sections.
- Scope changes requiring re-approval: changing runtime, tests, generated
  artifacts, configuration, the WebAPI feature documents, or adding a new
  roadmap item not covered by this disposition.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` unchanged.
- Web extension compatibility: unchanged; documentation-only cleanup.
- Desktop extension compatibility: unchanged; documentation-only cleanup.

## Acceptance Criteria

- `roadmap.md` contains no Architecture Boundary Protection, Telemetry Product
  Learning, baseline-derived ordering, or deferred-candidate placeholders.
- `roadmap.md` retains WebAPI Import Beta Exit and its entry condition.
- `BASELINE.md` is removed only with evidence that all concrete dependent
  refactoring work is complete or intentionally pruned, and its stale SDD SSOT
  references are removed with it.
- The existing blocked WebAPI feature remains untouched and selected-feature
  ownership does not change.
- Docs-only validation passes.

## Non-Goals

- Fixing the stale OpenAPI generated artifact.
- Exiting the WebAPI beta or changing its runtime scope.
- Adding telemetry, search, bundle, localization, interaction, or layout
  behavior.
- Changing architecture rules or tests.

## Open Questions

- None.
