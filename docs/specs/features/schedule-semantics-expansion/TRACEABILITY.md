# Requirements Traceability: Schedule Semantics Expansion

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                                                             | SPECS.md owner                                                       | Implementation slice                 | Test or validation                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uc-build-semantic-diff`: supported, uncalculated, and valid zero-run schedules                                    | `SCH-RESULT-001`; Acceptance Criteria                                | Slice 1                              | Domain-only status mapping; complete supported no-runs retain exactly one `confirm:schedule-zero-runs:<unit.id>` item; unsupported-only/partial/missing-context suppress it; removed-run coexistence and Flow-highlight regression                                                                                                                                                                |
| R-3 interpreter, projector, and differ responsibilities                                                            | `SCH-BOUNDARY-001`, `SCH-COMPARE-001`                                | Slice 1                              | Direct boundary tests plus facade golden regressions                                                                                                                                                                                                                                                                                                                                              |
| Existing direct `sd` / `st`, half-open period, ordering, and canonical paths                                       | `SCH-REGRESSION-001`                                                 | Slice 1                              | `semanticDiffScheduleRules.test.ts` and `semanticDiffSchedule.test.ts`                                                                                                                                                                                                                                                                                                                            |
| Correct `jc` calendar key and removal of false `sc` schedule classification                                        | `SCH-KEY-001`; Impact Analysis                                       | Slices 1 and 3                       | Structural `sc`/`jc` category tests; schedule detection tests; normalized `jc` resolver tests                                                                                                                                                                                                                                                                                                     |
| Existing output mapping with internal status and raw evidence                                                      | `SCH-RESULT-001`; Result Model                                       | Slices 1–5                           | Complete form-condition mapping in `SPECS.md`; legacy reason/message/item-ID and internal-evidence assertions; no DTO extension; unchanged review-risk/Flow policy                                                                                                                                                                                                                                |
| Every schedule form condition (`jc`, base duplicates/conflicts, `ud`, `sd`, `st`, `sh`, `shd`, `cy`, `ln`, `cftd`) | `SCH-RESULT-001`, `SCH-KEY-001`, `SCH-CALENDAR-001`, `SCH-SHIFT-001` | Slices 1–5                           | `semanticDiffScheduleRules.test.ts` and `semanticDiffSchedule.test.ts` cover each mapping row, exact legacy message/ID, raw parameter, rule number, and internal evidence ID                                                                                                                                                                                                                      |
| Raw evidence and stable v13 rule identities                                                                        | `SCH-EVIDENCE-001`, `SCH-RESULT-001`                                 | Slices 1–5                           | Per-rule status/evidence assertions and durable source-rule review                                                                                                                                                                                                                                                                                                                                |
| Fully qualified month-start, explicit day, month-end, and weekday forms                                            | `SCH-CALENDAR-001`; Planning Decisions                               | Slice 2                              | Projector normal/boundary/invalid/missing matrix with `JP1-PARAM-SCHEDULE-MONTH-END-001` and `JP1-PARAM-SCHEDULE-WEEKDAY-001`; existing start-date diagnostics accept supported absolute weekdays; `ScheduleDateRules.ts` and focused diagnostic tests; `sd`-filtered assertions and explicit 31-day month-end coverage; rule-zero `0,ud` coverage is owned by Slice 1 and is not duplicated here |
| Calendar/base source selection and relative operational-month projection                                           | `SCH-CALENDAR-001`; Calendar Source And Precedence                   | Slice 3                              | `JP1-PARAM-SCHEDULE-RELATIVE-001`; `jc`, ancestor/default base settings, `md`, normal/boundary/invalid/missing and side-isolation tests                                                                                                                                                                                                                                                           |
| Fully qualified open/closed/business-day projection                                                                | `SCH-CALENDAR-001`; Supported Expansion                              | Slice 4                              | `JP1-PARAM-SCHEDULE-OPEN-CLOSED-001`; normal/boundary/invalid/missing calendar matrix                                                                                                                                                                                                                                                                                                             |
| Deterministic explicit closed-day substitution and shift limit                                                     | `SCH-SHIFT-001`; Supported Expansion                                 | Slice 5                              | `JP1-PARAM-SCHEDULE-SHIFT-001`; `be`, `af`, `ca`, `no`, `shd`, normal/boundary/invalid/missing matrix                                                                                                                                                                                                                                                                                             |
| Bounded period and long/repeated input                                                                             | `SCH-PERFORMANCE-001`                                                | Slices 1–5                           | 144-rule ten-year case, exact candidate bounds, and bounded 31-day lookaround evidence                                                                                                                                                                                                                                                                                                            |
| Desktop/web parity without timezone or host calendars                                                              | Compatibility; Time And Date Model                                   | Slices 1–5                           | Browser-safe dependency review, desktop/web tests, and production build                                                                                                                                                                                                                                                                                                                           |
| Parent generation / `ln` association                                                                               | `SCH-INHERITANCE-001`; Deferred Follow-Up Entry Conditions           | Unfinished follow-up owned here      | Entry gate: neutral generation-date versus start-time contract and complete parent context; replan or scope decision before Exit                                                                                                                                                                                                                                                                  |
| Start times after `24:00` and 48-hour mode                                                                         | `SCH-48H-001`; Deferred Follow-Up Entry Conditions                   | Unfinished follow-up owned here      | Entry gate: explicit scheduler 24/48-hour mode and effective base-time source; replan or scope decision before Exit                                                                                                                                                                                                                                                                               |
| Cycle schedules                                                                                                    | `SCH-CYCLE-001`; Deferred Follow-Up Entry Conditions                 | Unfinished follow-up owned here      | Entry gate: registration anchor/mode, valid term, first recurrence, and period-boundary evidence; replan or scope decision before Exit                                                                                                                                                                                                                                                            |
| `cftd` days-from-start                                                                                             | Non-Goals; Deferred Follow-Up Entry Conditions                       | Deferred separate intake             | Entry gate: stable cycle and substitution contracts plus explicit product approval                                                                                                                                                                                                                                                                                                                |
| Omitted-`sh` Cancel default                                                                                        | `SCH-REGRESSION-001`; Supported Expansion                            | Unfinished follow-up owned here      | Entry gate: explicit scheduler-service calendar source and approved baseline migration; replan or scope decision before Exit                                                                                                                                                                                                                                                                      |
| Durable JP1/AJS3 v13 meaning                                                                                       | Durable Documentation Impact; Normative Planning Sources             | Same slice as each supported meaning | Stable `JP1-PARAM-*` rules, source citation review, use-case sync, and Markdown validation                                                                                                                                                                                                                                                                                                        |

<!-- markdownlint-enable MD013 MD060 -->

## Source Basis

- [Command Reference 5.2.3, job group definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0218.HTM)
  defines normalized job-group `op`, `cl`, `sdd`, `md`, and `stt` calendar
  parameters and their upper-group defaults (v13 web page 219/376).
- [Command Reference 5.2.4, jobnet definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM)
  defines `sd` month-end, weekday, relative, open/closed forms and `sd=0,ud`
  on web page 220/376, plus `st`, `sh`, `shd`, `ln`, `cy`, `cftd`, `de`, and
  `jc`.
- [JP1/AJS3 version 13 Overview section 3.3](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4200e/H03L4200.PDF)
  establishes operational schedule date calculation, rule order, closed-day
  substitution, parent association, and the distinct 24/48-hour modes.
- [JP1/AJS3 version 13 Definition Assistant, schedule and calendar sections](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF)
  `§4.5.1(3)`, Table 4-10 (PDF pp.137–139) covers month-end, weekday,
  relative, open-day, and closed-day forms; `§5(6)`–`§5(7)` (PDF
  pp.166–168) covers base-day/month/time, standard week, and exact calendar
  entries; `§5(8)` (PDF p.173) covers `sh` and `shd`, including defaults and
  bounds. These pages establish explicit-date precedence over standard-week
  values and closest-upper-group defaults.
- Existing diagnostic rule IDs establish syntax and ranges only. Slice 2 must
  keep the existing start-date validator aligned with the newly calculated
  absolute weekday syntax; it adds no diagnostic ID or message body. New
  projector semantics are added to `interpret-jp1-parameters.md` with stable
  IDs in their implementation slice; diagnostic bodies are not duplicated.

## Stable Rule And Test Evidence

The six stable IDs and the required normal/boundary/invalid/missing-context
cases are defined in the [Normative Coverage Matrix in `SPECS.md`](./SPECS.md#normative-coverage-matrix).
Each implementation slice must add or update the corresponding durable rule
and tests before it can pass its completion review.

## Dependency And Ownership Trace

- `semantic-diff-review-risk-rules` consumes schedule facts and owns new
  confirmation levels or review recommendations. Complete supported valid
  no-runs, including `0,ud`, retain the existing zero-run confirmation, while
  unsupported-only, partial, and missing-context projections suppress it.
  Supported-before to `ud`-after keeps the existing removed-run facts alongside
  one confirmation. This plan changes neither review-risk nor Flow policy.
- `semantic-diff-structured-outputs` owns JSON and report-mode contracts. This
  plan preserves the current application DTO and maps richer internal statuses
  to existing supported/uncalculated surfaces.
- `schedule-impact-calendar` owns calendar/timeline presentation. This plan has
  no presentation slice.
- `semantic-diff-comparison-workflow` supplies period and comparison sources.
  This plan accepts the existing period and does not add command input.
- Parent inheritance remains unfinished follow-up owned by this feature. Its
  entry condition is retained in `TASKS.md` and the roadmap item; Replanning or
  an explicit scope decision is required before Feature Exit, with coordination
  with the structured-output owner before a nested execution generation can be
  represented without claiming an exact start time.

## Slice 1 Implementation Evidence

- Status: Slice 1 complete; implementation review Ready with no findings;
  Completion Approval granted 2026-09-05; completion commit `4a3b846d`.
- Changed runtime boundaries: `interpretSchedule`, `projectScheduleRuns`, and
  `compareScheduleRuns` are separate pure domain responsibilities. The
  `evaluateSemanticDiffSchedule` facade preserves the existing compatibility
  view and output mapping.
- Result evidence: per-rule results retain status, rule identity, stable
  evidence IDs, and raw parameters inside the domain. Complete supported
  no-runs (including `0,ud`) produce the existing
  `confirm:schedule-zero-runs:<unit.id>` item exactly once. Unsupported-only,
  partial, and missing-context projections suppress that item while preserving
  existing uncalculated items. Existing removed-run confirmation behavior is
  retained, including the before-run to after-`0,ud` transition.
- Structural evidence: `sc` is not schedule detection evidence and remains
  `execution-definition`; at the Slice 1 boundary, `jc` was classified as a
  `schedule` attribute but its resolution was intentionally deferred. Slice 3
  now resolves its normalized calendar context.
- Ownership note: rule-zero `0,ud` interpretation, evidence, and legacy
  application mapping belong to Slice 1; Slice 2 adds calendar-independent
  date forms and does not reimplement that behavior.
- Date/start-time evidence: explicit date validity is checked before matching
  `st`; invalid-calendar-day and invalid-start-time remain separate outcomes,
  while only an absent matching `st` produces missing-start-time. Malformed
  `sd` preserves unsupported-schedule-date with raw evidence, and unpaired
  `st` keeps its parsed rule identity in the existing item detail.
- Baseline: `pnpm run test:prepare` and the desktop extension test run passed.
  The baseline and post-change desktop run both passed. The full-test desktop
  portion passes; Web execution remains blocked by the unchanged host
  Chromium `MachPortRendezvousServer` permission failure before tests load.
- Validation: Green after the implementation-review finding fix:
  `pnpm run test:compile`, `pnpm run qlty`, `pnpm run lint:md`,
  `git diff --check`, `pnpm run build`, focused schedule/structural tests, and
  desktop extension tests passed. The production build kept the repository's
  existing bundle-size warnings.
- Approval evidence: the implementation-reviewer verdict is Ready with no
  findings. Completion Approval was automatically granted on 2026-09-05 under
  the user's explicit per-slice instruction; the exact approved path set is
  recorded in `TASKS.md`. Feature-level final/closure approval remains pending
  until all slices complete for one bulk human approval.
- Compatibility impact: no VS Code engine, public/neutral DTO, presentation,
  command, telemetry, Node built-in, or host-calendar behavior changed. The
  new modules are browser-safe and deterministic.
- Review evidence: duplicate start-time selection, zero-run suppression, and
  canonical before-path matching were independently reviewed and covered by
  focused tests with no actionable findings.
- Unresolved risks: the planned calendar-dependent relative/open/closed,
  inheritance, 48-hour, cycle, and substitution slices remain unimplemented.

## Slice 2 Implementation Evidence

- Status: Slice 2 implementation complete and committed as `23dfdcea`; focused
  replan approved and replan commit `cb17d26a`; implementation-reviewer Ready
  with no findings; Completion Approval granted 2026-09-06 automatically under
  the user's explicit per-slice instruction.
- Changed behavior: fully qualified `YYYY/MM/b` and `YYYY/MM/b-DD` values now
  calculate Gregorian month ends with zero-based offsets. Fully qualified
  absolute weekdays now calculate first, nth, and last occurrences. A valid
  missing fifth occurrence is a complete supported no-runs result; invalid
  offsets and invalid occurrences remain invalid evidence.
- Stable evidence: month-end uses `JP1-PARAM-SCHEDULE-MONTH-END-001` and
  weekday uses `JP1-PARAM-SCHEDULE-WEEKDAY-001`. Existing direct date forms,
  omitted-component behavior, half-open periods, and `0,ud` ownership remain
  unchanged. Relative and calendar-dependent forms remain uncalculated.
- Correction evidence: `ScheduleDateRules.ts` now accepts fully qualified
  absolute weekdays while preserving `+`-prefixed relative and
  omitted-component boundaries. Focused diagnostic tests cover first/nth/last,
  invalid occurrences, and those boundaries. Schedule projector assertions are
  filtered to `parameter.key === "sd"`; 31-day month-end tests cover `b-00`,
  `b-30`, and invalid `b-31`.
- Application evidence: newly calculated forms use the existing schedule run,
  unsupported-item, and zero-run confirmation shapes. No public/neutral DTO,
  confirmation policy, presentation, command, or calendar-context contract
  changed.
- Validation: focused schedule tests and application schedule tests,
  `pnpm run test:compile`, desktop extension tests, `pnpm run qlty`,
  `pnpm run lint:md`, `pnpm run build`, and `git diff --check` are green. In
  `pnpm run test:full`, the desktop portion passes. Web execution remains
  blocked before tests load by the unchanged host Chromium
  `MachPortRendezvousServer` permission failure.
- Compatibility and production readiness: Gregorian arithmetic is deterministic
  and browser-safe, with no host locale/timezone/clock or external calendar
  input. Malformed offsets and occurrences retain recoverable invalid status;
  valid no-runs remains distinct. README and CHANGELOG now state the expanded
  observable support. Future calendar-dependent, relative, open/closed,
  inheritance, 48-hour, cycle, and substitution work remains deferred.
- Review findings and replan: the approved correction synchronizes
  `ScheduleDateRules.ts` with calculated absolute weekdays, filters schedule
  assertions to `sd`, and adds explicit 31-day month-end coverage. No new
  diagnostic ID, schedule form, or public/neutral DTO is introduced.
- Replan approval: Human Approval was recorded on 2026-09-05 after the
  `plan-reviewer` returned Ready with no findings. The exact approved correction
  scope is `src/domain/services/diagnostics/ScheduleDateRules.ts`,
  `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts` limited to `sd`-only
  assertion filtering and 31-day month-end coverage, plus synchronized
  `docs/specs/features/schedule-semantics-expansion/TASKS.md` and
  `docs/specs/features/schedule-semantics-expansion/TRACEABILITY.md` evidence.
  Replan commit is `cb17d26a`.
- Completion approval: the implementation-reviewer returned Ready with no
  findings, and Completion Approval was automatically granted on 2026-09-06
  under the user's explicit per-slice instruction. The exact approved current
  diff paths are `CHANGELOG.md`, `README.md`,
  `docs/requirements/domain-rules/interpret-jp1-parameters.md`,
  `docs/requirements/use-cases/uc-build-semantic-diff.md`,
  `docs/specs/features/schedule-semantics-expansion/TASKS.md`,
  `docs/specs/features/schedule-semantics-expansion/TRACEABILITY.md`,
  `src/domain/services/diagnostics/ScheduleDateRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`, and
  `src/test/suite/semanticDiffScheduleRules.test.ts`.
- Carried-forward implementation: the Slice 2 interpreter/projector,
  application, documentation, and integration-test changes remain preserved
  without broadening. Slice 2 Completion Approval was granted and the exact
  completion commit is `23dfdcea`; feature-level final/closure approval remains
  pending until the remaining Slices 4–5 are complete for the requested bulk
  human approval.
- Recommended route: send the exact approved Slice 3 diff to
  approval-committer for the completion commit.

## Slice 3 Implementation Evidence

- Status: Slice 3 implementation complete; implementation-reviewer Ready with
  no findings; Completion Approval granted automatically on 2026-09-06 under
  the user's explicit per-slice instruction; completion commit pending.
- Context evidence: each side resolves an absolute `jc` target or nearest
  containing job group from the full normalized document. Closest explicit
  `sdd`, `md`, and `stt` values and defaults 1, `th`, and `00:00` are retained
  as domain evidence; duplicate, malformed, cyclic, and ambiguous contexts are
  recoverable.
- Projection evidence: fully qualified relative day and weekday forms project
  from `md=th` or `md=ne` operational-month intervals. Missing or invalid
  context, impossible base boundaries, and non-zero base time remain explicit
  `calendar-selection` evidence. Existing run, unsupported-item, zero-run, and
  public/neutral DTO shapes remain unchanged.
- Condition evidence: only fully qualified, syntactically valid relative dates
  reach calendar-context resolution. Omitted-year/month forms retain
  `unsupported-schedule-date`; invalid relative offsets or weekday occurrences
  retain `invalid-calendar-day` even when context is absent.
- Evidence preservation: duplicate `sdd`, `md`, and `stt` values are all
  retained in domain raw evidence; application detail remains the existing
  single-parameter shape.
- Application evidence: full before/after normalized documents are supplied
  only for context resolution; the scoped unit lists still define the compared
  change set, so out-of-scope `jc` groups do not widen the result.
- Scaling evidence: one iterative document index is reused per side across
  units. A 144-rule ten-year schedule and 512 unrelated groups verify bounded
  target runs without per-unit full-document rescans.
- Application mapping evidence: focused cases assert existing dynamic IDs,
  reason codes, legacy messages, and raw parameter detail for invalid/missing
  `jc`, duplicate base, hierarchy-cycle, impossible-boundary, and non-zero
  `stt` conditions.
- Validation evidence: focused calendar-context, relative-projection, and
  application scope tests, `pnpm run test:compile`, desktop extension tests,
  `pnpm run qlty`, `pnpm run lint:md`, `pnpm run build`, and `git diff --check`
  are green. In `pnpm run test:full`, the desktop portion passes; Web execution
  remains blocked before tests load by the unchanged host Chromium
  `MachPortRendezvousServer` permission failure.
- Compatibility and production readiness: the resolver and projector use pure,
  browser-safe Gregorian arithmetic without host locale, timezone, clock,
  filesystem, network, WebAPI, or external calendar acquisition. Future
  open/closed, substitution, inheritance, 48-hour, cycle, and related work
  remains deferred to later planned slices.
- Changed paths: `src/domain/services/semantic-diff/semanticDiffScheduleCalendarContext.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/application/semantic-diff/compareScheduleDiff.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`, `README.md`,
  `CHANGELOG.md`, `docs/requirements/domain-rules/interpret-jp1-parameters.md`,
  `docs/requirements/use-cases/uc-build-semantic-diff.md`,
  `docs/specs/features/schedule-semantics-expansion/TASKS.md`, and
  `docs/specs/features/schedule-semantics-expansion/TRACEABILITY.md`.
- Completion gate: implementation-reviewer returned Ready with no findings.
  Completion Approval was automatically granted on 2026-09-06 under the
  user's explicit per-slice instruction. The exact 15-path Slice 3 diff is
  approved for the completion commit; feature-level final/closure approval
  remains pending until Slices 4–5 complete for the requested bulk human
  approval.
- Recommended route: send the exact approved Slice 3 diff to
  approval-committer for the completion commit.
