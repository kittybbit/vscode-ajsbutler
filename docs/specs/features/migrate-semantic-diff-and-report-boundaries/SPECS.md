# Feature Specification: Migrate Semantic Diff And Report Boundaries

## Purpose

Make semantic comparison consume normalized domain meaning and make report
presentation consume application DTOs while preserving evidence, localization,
and copy behavior.

## Minimal Context

- Current decision: complete the comparison-to-report application boundary.
- Read first: this file, `TASKS.md`, and the two semantic-diff use cases.
- Do not create `CONTEXT.md`.

## Origin

- Source use cases: `uc-build-semantic-diff.md` and
  `uc-present-semantic-diff-report.md`.
- Source: complete migration directive Slice 8.
- JP1/AJS source reference: existing version 13 definition/config and schedule
  scope in durable use cases/domain rules; runtime facts remain unverified unless
  explicit evidence exists.
- Dependencies: normalized domain completion and parser isolation.

## Requirements

- Semantic diff identity, fingerprint, relation, parameter, and supported
  schedule meaning have one domain owner.
- Application owns comparison entry points, changes, confirmation items, report
  input DTOs, and host-neutral errors.
- Presentation owns Markdown display, localization mapping, clipboard actions,
  and host workflow.
- Definition evidence and runtime evidence remain explicitly distinct.
- Existing comparison and report behavior remains unchanged.

## Architecture

- Domain: own semantic identity/fingerprint and comparison rules.
- Application: coordinate diff and produce report-ready DTOs.
- Presentation: render localized Markdown and perform copy/display actions.
- Infrastructure: none unless future runtime evidence is separately approved.

## Impact Analysis

### Dependency Impact

- Affected surface: semantic model/comparator, application diff/report DTOs,
  Markdown/localization/copy adapters, fixtures, and tests.
- Propagation decision: new comparison types and runtime verification remain out
  of scope.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal diff/report DTOs may change.
- VS Code/web extension compatibility: report display and copy remain supported
  where currently available.
- Changed scenarios: none.

### Alternative Considerations

- Keep identity/fingerprint logic in report presentation: rejected as duplicated
  domain meaning.
- Let application construct VS Code Markdown objects: rejected as host coupling.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Comparison, confirmation wording, localization, report, or copy changes
  require replanning and approval.

## Compatibility

- Preserve minimum VS Code version, semantic matches/changes, confirmation
  items, report content, Japanese localization, copy workflow, and desktop/web
  behavior.

## Acceptance Criteria

- Build and Present use cases expose normalized/application contracts without
  wrapper or presentation-owned domain decisions.
- Presentation owns only rendering and host interaction.
- Existing semantic fixtures and report regressions pass.

## Non-Goals

- New comparison types, schedule scope, runtime verification, or report design.

## Open Questions

- Planning must identify any identity/fingerprint duplication outside domain.
