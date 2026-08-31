# Requirements Traceability: Schedule Semantics Expansion

<!-- markdownlint-disable MD013 -->

| Use case / requirement                                                                                             | SPECS.md owner                                                       | Implementation slice                 | Test or validation                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uc-build-semantic-diff`: supported, uncalculated, and valid zero-run schedules                                    | `SCH-RESULT-001`; Acceptance Criteria                                | Slices 1–2                           | Domain-only status mapping; complete supported no-runs retain exactly one `confirm:schedule-zero-runs:<unit.id>` item; unsupported-only/partial/missing-context suppress it; removed-run coexistence and Flow-highlight regression |
| R-3 interpreter, projector, and differ responsibilities                                                            | `SCH-BOUNDARY-001`, `SCH-COMPARE-001`                                | Slice 1                              | Direct boundary tests plus facade golden regressions                                                                                                                                                                               |
| Existing direct `sd` / `st`, half-open period, ordering, and canonical paths                                       | `SCH-REGRESSION-001`                                                 | Slice 1                              | `semanticDiffScheduleRules.test.ts` and `semanticDiffSchedule.test.ts`                                                                                                                                                             |
| Correct `jc` calendar key and removal of false `sc` schedule classification                                        | `SCH-KEY-001`; Impact Analysis                                       | Slices 1 and 3                       | Structural `sc`/`jc` category tests; schedule detection tests; normalized `jc` resolver tests                                                                                                                                      |
| Existing output mapping with internal status and raw evidence                                                      | `SCH-RESULT-001`; Result Model                                       | Slices 1–5                           | Complete form-condition mapping in `SPECS.md`; legacy reason/message/item-ID and internal-evidence assertions; no DTO extension; unchanged review-risk/Flow policy                                                                 |
| Every schedule form condition (`jc`, base duplicates/conflicts, `ud`, `sd`, `st`, `sh`, `shd`, `cy`, `ln`, `cftd`) | `SCH-RESULT-001`, `SCH-KEY-001`, `SCH-CALENDAR-001`, `SCH-SHIFT-001` | Slices 1–5                           | `semanticDiffScheduleRules.test.ts` and `semanticDiffSchedule.test.ts` cover each mapping row, exact legacy message/ID, raw parameter, rule number, and internal evidence ID                                                       |
| Raw evidence and stable v13 rule identities                                                                        | `SCH-EVIDENCE-001`, `SCH-RESULT-001`                                 | Slices 1–5                           | Per-rule status/evidence assertions and durable source-rule review                                                                                                                                                                 |
| Fully qualified month-start, explicit day, month-end, weekday, and `ud` forms                                      | `SCH-CALENDAR-001`; Planning Decisions                               | Slice 2                              | `JP1-PARAM-SCHEDULE-MONTH-END-001`, `JP1-PARAM-SCHEDULE-WEEKDAY-001`, and `JP1-PARAM-SCHEDULE-UD-001`; normal/boundary/invalid/missing matrix; `ud`-only/`ud+st`/mixed tests                                                       |
| Calendar/base source selection and relative operational-month projection                                           | `SCH-CALENDAR-001`; Calendar Source And Precedence                   | Slice 3                              | `JP1-PARAM-SCHEDULE-RELATIVE-001`; `jc`, ancestor/default base settings, `md`, normal/boundary/invalid/missing and side-isolation tests                                                                                            |
| Fully qualified open/closed/business-day projection                                                                | `SCH-CALENDAR-001`; Supported Expansion                              | Slice 4                              | `JP1-PARAM-SCHEDULE-OPEN-CLOSED-001`; normal/boundary/invalid/missing calendar matrix                                                                                                                                              |
| Deterministic explicit closed-day substitution and shift limit                                                     | `SCH-SHIFT-001`; Supported Expansion                                 | Slice 5                              | `JP1-PARAM-SCHEDULE-SHIFT-001`; `be`, `af`, `ca`, `no`, `shd`, normal/boundary/invalid/missing matrix                                                                                                                              |
| Bounded period and long/repeated input                                                                             | `SCH-PERFORMANCE-001`                                                | Slices 1–5                           | 144-rule ten-year case, exact candidate bounds, and bounded 31-day lookaround evidence                                                                                                                                             |
| Desktop/web parity without timezone or host calendars                                                              | Compatibility; Time And Date Model                                   | Slices 1–5                           | Browser-safe dependency review, desktop/web tests, and production build                                                                                                                                                            |
| Parent generation / `ln` association                                                                               | `SCH-INHERITANCE-001`; Deferred Follow-Up Entry Conditions           | Unfinished follow-up owned here      | Entry gate: neutral generation-date versus start-time contract and complete parent context; replan or scope decision before Exit                                                                                                   |
| Start times after `24:00` and 48-hour mode                                                                         | `SCH-48H-001`; Deferred Follow-Up Entry Conditions                   | Unfinished follow-up owned here      | Entry gate: explicit scheduler 24/48-hour mode and effective base-time source; replan or scope decision before Exit                                                                                                                |
| Cycle schedules                                                                                                    | `SCH-CYCLE-001`; Deferred Follow-Up Entry Conditions                 | Unfinished follow-up owned here      | Entry gate: registration anchor/mode, valid term, first recurrence, and period-boundary evidence; replan or scope decision before Exit                                                                                             |
| `cftd` days-from-start                                                                                             | Non-Goals; Deferred Follow-Up Entry Conditions                       | Deferred separate intake             | Entry gate: stable cycle and substitution contracts plus explicit product approval                                                                                                                                                 |
| Omitted-`sh` Cancel default                                                                                        | `SCH-REGRESSION-001`; Supported Expansion                            | Unfinished follow-up owned here      | Entry gate: explicit scheduler-service calendar source and approved baseline migration; replan or scope decision before Exit                                                                                                       |
| Durable JP1/AJS3 v13 meaning                                                                                       | Durable Documentation Impact; Normative Planning Sources             | Same slice as each supported meaning | Stable `JP1-PARAM-*` rules, source citation review, use-case sync, and Markdown validation                                                                                                                                         |

<!-- markdownlint-enable MD013 -->

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
- Existing diagnostic rule IDs establish syntax and ranges only. New projector
  semantics are added to `interpret-jp1-parameters.md` with stable IDs in their
  implementation slice; diagnostic bodies are not duplicated.

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
