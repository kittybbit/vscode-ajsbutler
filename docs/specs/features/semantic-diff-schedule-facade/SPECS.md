# Feature Specification: Semantic Diff Schedule Facade

## Purpose

Return the Semantic Diff schedule compatibility facade to thin orchestration
while preserving all existing schedule comparison results. Reuse the settled
domain schedule owners instead of concentrating reusable schedule decisions
or duplicating primitives in the facade.

## Source

- Kind: roadmap feature; slug: `semantic-diff-schedule-facade`.
- User-selected feature, on `codex/semantic-diff-schedule-facade`.
- [Roadmap](../../roadmap.md#internal-architecture-refactoring-sequence), item 1.
- Prerequisites merged into base `fbe562b2`: schedule ownership consolidation
  `49765418` and shared schedule period/document indexes `cdc84f2a`.
- [Build Semantic Diff](../../../requirements/use-cases/uc-build-semantic-diff.md)
  supplies the observable behavior contract; JP1/AJS3 version 13 remains its
  normative basis. This feature introduces no new JP1/AJS interpretation.
- [Architecture](../../architecture.md) supplies semantic ownership and
  desktop/web constraints.

## Requirements and acceptance

- R1: `evaluateSemanticDiffSchedule` remains a compatibility entry point with
  the same exported input/evaluation types, discriminants, optional fields,
  ordering, and result meaning. It orchestrates settled semantic owners and
  compatibility assembly; reusable schedule meaning belongs to domain
  schedule owners, and run correspondence belongs to the existing differ.
- R2: Preserve `not-requested` and `invalid-period` outcomes, strict Gregorian
  half-open periods, and the facade's legacy rejection of years 0000–0099.
  The shared projector's supported low-year behavior remains distinct.
- R3: Preserve direct-schedule jobnet selection (`n`, `rn`, `rm`, `rr`),
  independent before/after calendar context, context outside comparison scope
  without adding its units, and explicit unsupported/missing/invalid evidence.
- R4: Preserve completeness-based zero-run selection, both side lists, the
  after-side compatibility alias, supported-pair counts, evidence categories,
  and rule-zero `sd=0,ud` suppression of ineffective parameter failures.
  Partial or unresolved schedules must never become valid zero-run conclusions.
- R5: Preserve matched-path canonicalization, duplicate-run correspondence,
  deterministic run decisions and pair evaluations. Removed-run review policy,
  report/JSON meaning, schedule-impact projection, and Flow policy stay stable.
- R6: Reduce responsibility concentration without introducing speculative
  wrappers or reversing dependencies. Independent review must establish the
  facade's thin orchestration and each retained or added boundary's value.

## Decisions and impact

The current facade is
`src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`. Its settled
collaborators are `ScheduleInterpretation`, `ScheduleProjection`,
`ScheduleCalendar`, `SchedulePeriod`, and `semanticDiffScheduleComparison`.
Direct-schedule eligibility belongs to `ScheduleInterpretation`; document-backed
unit-group projection belongs to `ScheduleProjection`. The facade retains
consumer-specific period rejection and compatibility evidence assembly. It uses
the existing differ canonical-path argument rather than duplicating run mapping.
No new module, port, adapter, framework, or application factory is needed.

Direct consumers include application `compareScheduleDiff.ts` and domain
boundary tests. Transitive consumers include semantic comparison facts,
confirmation-required items, report/JSON output and schedule-impact views.
Application translation and DTO/projection restructuring remain owned by the
next roadmap feature. Existing use cases remain the behavior contracts and
need no intake edits. No externally observable change is intended, so no
README or CHANGELOG update is expected unless planning discovers a change.

## Compatibility

- Preserve JP1/AJS3 version 13 supported forms and explicit deferred evidence;
  no scheduler-service, external calendar, host clock, or locale fallback.
- Preserve application-facing facade imports and contracts without consumer
  migration. Keep domain host-neutral and browser-safe with no Node built-ins.
- Keep `engines.vscode` at `^1.75.0`, and preserve desktop and web behavior.
- Preserve parser, diagnostics, list, flow, CSV, unit-definition, navigation,
  WebAPI beta, and telemetry behavior; these are outside the intended change.

## Non-goals

- New schedule support, parent inheritance, 48-hour/day-crossing times, cycles,
  `cftd`, registration-relative dates, or omitted-`sh` default migration.
- Application schedule-impact DTO/build/identity/timeline restructuring,
  command/bootstrap dependency changes, presentation calendar cohesion,
  readonly model migration, or architecture-test framework refactoring.
- New public options, runtime verification, telemetry collection, architecture
  exceptions, dependency modernization, or VS Code minimum-version changes.

## Open questions

None. The implementation boundary and validation are recorded in TASKS.
