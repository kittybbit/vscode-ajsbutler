# Feature Specification: Schedule Primitives and Document Index

## Purpose

Give shared schedule date/period meaning and normalized AJS document traversal
and indexing one reusable domain owner. Remove duplicate implementations used
by schedule evaluation and Semantic Diff while preserving their existing
consumer contracts and results.

## Source

- Kind: roadmap feature; slug: `schedule-primitives-and-document-index`.
- [Internal architecture refactoring sequence](../../roadmap.md#internal-architecture-refactoring-sequence),
  first item, after schedule ownership is stable.
- User request to create a feature from the final turn of
  [DDDとクリーンアーキテクチャ評価](chatgpt-conversation://6a661ac5-1868-83ee-b8f6-c28c161366f0).
  The conversation identifies remaining date/period and document-index
  duplication before facade and application cleanup. Repository evidence,
  rather than the conversation's progress estimates, defines this intake.
- Existing [Semantic Diff](../../../requirements/use-cases/uc-build-semantic-diff.md)
  and [schedule impact](../../../requirements/use-cases/uc-present-schedule-impact.md)
  behavior contracts.
- JP1/AJS basis: the normalized JP1/AJS model and existing schedule
  interpretation/projection contracts. JP1/AJS3 version 13 remains the normative
  target under [architecture](../../architecture.md#parser-and-model-boundary).
  This internal refactor introduces no new parameter or scheduler semantics.

## Requirements and acceptance

- R1: Shared canonical date and period validation has one domain owner.
  Preserve strict `YYYY-MM-DD` validation, Gregorian leap-year and invalid-day
  behavior, UTC calculation, low-year handling, increasing bounds, and the
  half-open interval `[from, to)`. Preserve application invalid-reason
  precedence (`invalid-from`, `invalid-to`, `non-increasing`) and each
  consumer's existing malformed/missing-period result.
- R2: Provide reusable normalized AJS document traversal and ID/path indexing
  for schedule calendar context and schedule-impact document lookup. Preserve
  root/child ordering, duplicate matches, existing lookup precedence and
  source identity. Calendar-specific source selection, ambiguity, hierarchy,
  and evidence rules retain their schedule owner.
- R3: Preserve schedule runs, no-runs, partial/uncalculated results, evidence
  identifiers, root selection, run source references, stable IDs, ordering,
  counts, and comparison/report DTO contracts. Consolidation must not silently
  change a consumer's duplicate, path, malformed-input, or cycle behavior.
- R4: Retain Clean Architecture dependency directions and the zero-exception
  architecture catalog. Domain primitives consume normalized models, remain
  host-neutral, and do not depend on Semantic Diff application DTOs, parser
  internals, VS Code, Node built-ins, or UI frameworks.
- R5: Demonstrate equivalent behavior through relevant existing boundary tests
  and characterization of uncovered date/period and traversal/index edge
  cases. Confirm desktop/web compatibility for affected shared contracts.

## Decisions and impact

- Schedule ownership is already established under `src/domain/schedule`.
  `ScheduleDate.ts` already supplies canonical UTC parsing and Gregorian date
  helpers; reuse this capability rather than replace it speculatively.
- Remaining duplication is evidenced by the Gregorian validator in
  `src/application/semantic-diff/parseSemanticDiffComparisonPeriod.ts` and
  period validation in `ScheduleProjection.ts` and
  `semanticDiffScheduleRules.ts`. Consumer-specific error/result translation
  remains outside shared date/period meaning.
- `ScheduleCalendarIndex.ts` combines reusable traversal/index building with
  calendar-specific ancestor/source policy. `AjsDocument.ts` and
  `semanticDiffScheduleImpact.ts` also traverse normalized units. The calendar
  collector uses object-identity cycle protection; recursive traversals do
  not share that policy. Planning must characterize these differences before
  choosing reusable contracts or migrating consumers.
- This feature establishes the shared foundation only. Roadmap items
  `semantic-diff-schedule-facade` and `semantic-diff-application-projection`
  retain separate purposes, plans, reviews, and approvals after the relevant
  foundation is complete. Later presentation, readonly, and architecture-test
  work remains independently scoped. The existing roadmap already records
  this dependency order, so intake does not update it.
- The inherited `import-definition-via-webapi` feature remains untouched;
  parser/WebAPI acquisition and its beta decision do not overlap this scope.
- Durable use cases and architecture remain valid. No new user-visible
  behavior or changelog entry is expected; planning/exit must reassess any
  discovered observable impact.

## Compatibility

- Preserve `engines.vscode: ^1.75.0`, desktop and browser support, normalized
  model contracts, current public APIs and observable output formats.
- Retain all supported schedule calculations and explicit uncalculated
  evidence for deferred semantics listed in the roadmap. Do not infer parent
  execution, registration anchors, host dates/timezones, or missing calendars.
- Preserve parser, list, flow, CSV, definition, diagnostics, hover, navigation,
  WebAPI import, semantic diff/report, and telemetry behavior transitively
  affected by shared normalized-model utilities.

## Non-goals

- Facade slimming beyond the minimum integration with shared primitives.
- Splitting schedule-impact DTO, orchestration, identity, or timeline owners;
  command/bootstrap rewiring or calendar presentation consolidation.
- Repository-wide migration of every document traversal consumer, domain
  readonly conversion, parser/generated-code changes, or architecture-test
  restructuring.
- New schedule semantics, output modes, user commands, configuration,
  dependencies, caching frameworks, or an extensible indexing framework.
- Predetermined module counts, file names for new owners, or implementation
  slice sequencing; these require planning evidence.

## Open questions

- No unresolved product decision blocks intake. Planning must characterize
  existing consumer differences in traversal repetition/cycles, duplicate
  ID/path lookup, malformed periods, and low-year dates. If consolidation
  requires a behavior change rather than preserving those contracts, return
  the exact compatibility decision to Main before planning approval.
