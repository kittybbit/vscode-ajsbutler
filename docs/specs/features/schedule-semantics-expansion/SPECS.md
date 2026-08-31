# Feature Specification: Schedule Semantics Expansion

## Purpose

Separate JP1/AJS schedule interpretation, bounded run projection, and run
comparison, then expand the reference-backed schedule forms that Semantic Diff
can calculate without confusing an unsupported interpretation with a valid
zero-run result.

## Minimal Context

- Current decision: replace the combined schedule evaluator boundary with
  explicit interpreter, projector, and differ responsibilities while preserving
  current results, then add supported semantics only when JP1/AJS3 version 13
  evidence establishes them.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when planning a
  requirement or validating its source basis.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Feature kind: roadmap feature, Wave 2 `Expand Schedule Interpretation And
Supported Semantics`.
- Source proposals: R-3 `ScheduleInterpreter` / `ScheduleDiffer` separation and
  E-3 schedule-diff coverage expansion from the supplied AJS Butler improvement
  proposal.
- Source use case:
  `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- Shared parameter-rule owner:
  `docs/requirements/domain-rules/interpret-jp1-parameters.md`.
- Current durable v13 rules:
  `docs/requirements/domain-rules/jp1-diagnostic-parameter-rules.md`, especially
  `JP1-PARAM-SCHEDULE-RANGE-001`,
  `JP1-PARAM-SCHEDULE-WEEKLY-DAY-001`, and
  `JP1-PARAM-SCHEDULE-START-DATE-001`.
- Normative product source: JP1/AJS3 version 13 Command Reference, section
  5.2.4, job group and jobnet definition
  (<https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM>).
- Implementation-slice plan: `TASKS.md` after Planning Mode completes.

## Requirements

- `SCH-BOUNDARY-001`: schedule handling must expose distinct domain
  responsibilities for interpreting normalized schedule parameters, projecting
  interpreted schedules over a bounded period, and comparing before/after run
  projections.
- `SCH-REGRESSION-001`: boundary separation must preserve the existing behavior
  for valid half-open comparison periods, directly defined jobnet `sd` / `st`
  pairs, explicit `YYYY/MM/DD`, `MM/DD`, and `DD` calendar days, added and
  removed runs, single-time changes, zero-run candidates, and explicit
  uncalculated reasons.
- `SCH-KEY-001`: schedule interpretation must use the documented schedule and
  calendar keys. `jc` selects a job-group calendar; `sc` is a script-file
  parameter and must not be treated as calendar selection or as evidence that a
  jobnet has a schedule. At the structural attribute layer, `jc` is classified
  as `schedule` because changing its calendar reference changes schedule
  context; `sc` remains `execution-definition`.
- `SCH-EVIDENCE-001`: a schedule form becomes calculated only after its syntax,
  default or inheritance context, calendar dependency, and date/time projection
  behavior are traced to JP1/AJS3 version 13 evidence. Syntax range evidence
  alone does not establish execution-date semantics.
- `SCH-RESULT-001`: interpretation and projection results must distinguish
  supported results, valid schedules with no run in the period, invalid input,
  unsupported semantics, and missing external calendar context. Raw parameter
  evidence and applicable rule identifiers must remain available inside the
  domain result. These distinctions are not added to a public or neutral DTO;
  application mapping uses only the existing unsupported-item,
  schedule-comparison, and confirmation shapes.
- `SCH-CALENDAR-001`: month-start, month-end, explicit day, open-day,
  closed-day, and business-day-related calculation may be added in reviewed
  stages. Calendar-dependent calculation must consume explicit normalized
  calendar context and remain uncalculated when that context is absent; it must
  not guess holidays, business days, or closed days.
- `SCH-INHERITANCE-001`: parent schedule-rule inheritance may be calculated only
  from explicit normalized hierarchy and a source-backed rule-resolution
  contract, including missing parents, invalid rule references, and inheritance
  cycles.
- `SCH-48H-001`: `00:00..47:59` start times may be projected only after the
  source-backed relationship between the schedule date and the resulting
  calendar date/time is recorded. Existing day-crossing values remain
  uncalculated until then.
- `SCH-CYCLE-001`: cycle schedules may be calculated only after the applicable
  `cy` unit, rule-association, anchor, recurrence, and period-boundary semantics
  are recorded from the normative source.
- `SCH-SHIFT-001`: shift-day and closed-day substitution behavior may be
  calculated only after the precedence and interaction of `shd`, `sh`, selected
  calendars, and the base schedule day are source-backed. Failure to resolve a
  dependency remains explicit rather than silently falling back.
- `SCH-COMPARE-001`: schedule comparison must consume projections and produce
  neutral added, removed, and changed-time decisions without owning report
  wording, review-risk policy, or calendar UI rendering.
- `SCH-PERFORMANCE-001`: projection must remain bounded by the requested period
  and avoid expansion whose work is unrelated to the period or input size.

## Architecture

- Domain: own pure schedule interpretation, reference-backed effective-rule
  resolution, bounded run projection, and projection comparison. Domain input
  includes normalized units, hierarchy, and explicit calendar context; it does
  not import VS Code, Node built-ins, presentation types, or parser internals.
- Application: orchestrate the before/after schedule pipeline, map domain
  outcomes into the existing Semantic Diff application DTOs, and preserve
  explicit unsupported or uncalculated evidence. The five schedule statuses
  and their raw evidence are domain-internal only; they do not add fields to
  public or neutral DTOs. Expansion of confirmation or review-risk rules
  belongs to its separate roadmap feature.
- Presentation: none in this feature. Existing report consumers continue to
  consume application DTOs; the Schedule Impact Calendar is a later feature.
- Infrastructure: no required implementation ownership is assumed at intake.
  If later planning discovers that calendar data needs a new source adapter,
  that wider dependency and host behavior require replanning before work starts.

## Impact Analysis

### Dependency Impact

- Current implementation boundary:
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts` combines
  period parsing, parameter interpretation, run generation, unsupported
  classification, zero-run selection, and run comparison.
- Current application caller:
  `src/application/semantic-diff/compareScheduleDiff.ts` maps domain decisions
  into comparison, confirmation-required, unsupported, and limitation DTOs.
- Existing parsing support in `scheduleDateInterpreter.ts` and
  `scheduleRuleHelpers.ts` recognizes more schedule token categories than the
  current projector calculates. Recognition does not make those categories
  supported projection semantics.
- The current evaluator incorrectly lists `sc` as a schedule/calendar key even
  though `sc` is the script-file parameter and the documented calendar selector
  is `jc`. Planning treats removal of that false classification as a correctness
  fix, not as a calendar-schema expansion. Slice 1 therefore includes the
  structural classification path in
  `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts` and its
  focused regression suite; `jc` is explicitly a `schedule` attribute while
  `sc` remains an `execution-definition` attribute.
- Affected tests include the current schedule-rule and Semantic Diff schedule
  regression suites. Planning must also identify parameter-interpreter and
  malformed/large-period coverage relevant to each reviewed stage.
- Propagation decision: refactor the schedule pipeline and expand its supported
  outcomes together with tests and durable source rules. Keep Semantic Diff
  report modes, review-risk policy, comparison entry workflow, and calendar UI
  unchanged.

### Overlap Decision

- `semantic-diff-review-risk-rules` owns new confirmation-required or review
  recommendation policy. This feature supplies schedule facts and explicit
  calculation status only.
- `semantic-diff-structured-outputs` owns structured output and report-mode
  contracts. This feature does not create JSON or presentation schemas.
- `schedule-impact-calendar` owns calendar/timeline presentation. It depends on
  this feature's stable interpretation and projection contracts.
- `semantic-diff-comparison-workflow` owns comparison-period input and command
  flow. This feature accepts an already supplied bounded period.
- The overlap is therefore complementary, not duplicate. No split is required:
  every requirement here serves the single purpose of trustworthy schedule run
  calculation and comparison.

### Breaking Change Analysis

- User-visible behavior: current calculated and uncalculated results must remain
  stable during boundary separation. Later reviewed stages intentionally turn
  selected formerly uncalculated schedule forms into calculated outcomes.
- API/DTO/schema compatibility: preserve current application-facing Semantic
  Diff DTO fields during boundary separation and expansion. Status and raw
  evidence remain internal domain values mapped to existing
  `SemanticDiffUnsupportedItem`, `scheduleComparison`, and confirmation paths;
  no public or neutral DTO field is added. Any request to expose a new status or
  evidence field requires Planning or Replanning with the structured-output
  owner checked for overlap.
- VS Code/web extension compatibility: domain and application behavior must be
  host-neutral and deterministic. Do not introduce filesystem, locale, system
  timezone, or platform-calendar dependencies.
- Changed scenarios: extend the schedule scenarios in
  `uc-build-semantic-diff.md` only when a reviewed stage changes the durable
  observable contract.

### Alternative Considerations

- Continue extending `evaluateSemanticDiffSchedule`: rejected because it keeps
  parameter meaning, run projection, and comparison coupled and makes supported
  versus uncalculated evidence harder to preserve.
- Implement all schedule forms in one slice: rejected because the forms have
  different source, calendar, inheritance, and boundary evidence requirements.
- Use host locale or an implicit holiday calendar: rejected because results
  would differ between desktop and web and would assert JP1/AJS behavior without
  explicit definition context.
- Move schedule interpretation into application code: rejected because the
  meaning and deterministic projection rules are domain responsibilities shared
  independently of report presentation.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` according to the lifecycle gate.
- Scope changes requiring re-approval: new presentation or command behavior;
  new JSON/report/review-risk contracts; infrastructure calendar acquisition;
  filesystem, network, locale, or timezone dependencies; support for another
  JP1/AJS version; `cftd` days-from-start calculation; or schedule behavior not
  supported by recorded normative evidence.

### Planning And Implementation Branches

- `docs/schedule-semantics-expansion` is planning-only. This replan changes
  feature documents only and must not implement runtime code, tests, generated
  artifacts, or configuration.
- After the revised plan is reviewed, approved, committed, and merged into
  `main`, implementation starts from updated `main` on the non-docs branch
  `codex/schedule-semantics-expansion`. The implementer may apply only the
  approved paths for one approved slice at a time; any wider path or contract
  is a Replanning trigger.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; no newer VS
  Code API is required by the domain boundary.
- Web extension compatibility: shared interpretation, projection, and
  comparison remain browser-safe and must not use Node built-ins, host timezone,
  or desktop-only calendar sources.
- Desktop extension compatibility: results must match web results for the same
  normalized input, calendar context, and comparison period.
- JP1/AJS compatibility: JP1/AJS3 version 13 is normative. Unsupported or
  missing evidence remains explicit; no runtime execution result is asserted.
- Existing malformed-input behavior remains recoverable and represented as
  invalid, unsupported, or uncalculated rather than throwing from the comparison
  workflow.

## Acceptance Criteria

- Interpreter, projector, and differ boundaries have independently testable
  inputs and outputs and preserve raw evidence and rule identity.
- The existing direct `sd` / `st` regression baseline remains stable after the
  separation, including half-open periods and before-path canonicalization for
  matched units.
- Each newly calculated schedule form has a cited JP1/AJS3 version 13 durable
  rule and tests for normal, boundary, invalid, and missing-context cases.
- Calendar-independent month-end support, explicit normalized calendar
  projection, and deterministic closed-day substitution progress in that order.
  Parent inheritance, 48-hour schedules, and cycles remain explicitly
  uncalculated until the deferred entry conditions below are satisfied.
- A valid zero-run result is distinguished from invalid, unsupported, and
  missing-context outcomes inside domain results, then mapped through the
  existing application shapes. Complete supported valid no-runs, including
  `0,ud`, retain the existing generic zero-run confirmation. The confirmation
  is suppressed only for unsupported-only, partial, or missing-context
  projections. The existing review-risk and Flow policies are unchanged. When
  supported before-runs become valid after-side `ud` no-runs, the existing
  removed-run decisions and exactly one existing zero-run confirmation coexist;
  neither is duplicated or re-routed by this feature.
- Projection work is bounded by the requested comparison period and covered by
  representative long-period and repeated-rule tests before Feature Exit.
- Desktop and web hosts produce the same result for the same explicit inputs.
- Existing consumers continue to receive explicit uncalculated reasons for all
  schedule forms not yet supported by an approved completed stage.

## Existing Reason, Message, And Evidence Mapping

The following table fixes the compatibility mapping for every schedule-form
condition in this feature. Domain status and evidence IDs are internal only.
For an uncalculated item, preserve the existing ID shape
`uncalculated:schedule:<side>:<unit.id>:<parameter.key>:<parameter.value>` and
the complete raw parameter plus rule number; no status or evidence field is
added to a public or neutral DTO. For a zero-run confirmation, preserve the
existing ID `confirm:schedule-zero-runs:<unit.id>` and content/rationale.

<!-- markdownlint-disable MD013 -->

| Form or condition                                                                                                                           | Domain status            | Existing reason             | Existing message or confirmation content                                                                       | Existing output / ID                                                                                              | Domain-only evidence ID                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Supported `sd` + matching normal `st`, with one or more projected runs                                                                      | `supported`              | none                        | none                                                                                                           | Existing `scheduleComparison.runChanges` (`schedule:added:*`, `schedule:removed:*`, or `schedule:changed-time:*`) | `schedule:sd:supported:<rule>` plus raw `sd`/`st`                 |
| Complete supported `sd`/`st` with no run in the requested period, including a valid missing weekday occurrence                              | `no-runs`                | none                        | Existing zero-run confirmation content: `<unit.name> has no calculated runs in the schedule comparison period` | `confirmationRequired`, `confirm:schedule-zero-runs:<unit.id>`                                                    | `schedule:no-runs:<rule>` plus the form's stable `JP1-PARAM-*` ID |
| Rule-zero `0,ud`, including `ud`-only, `ud+st`, or mixed `ud` input                                                                         | `no-runs`                | none                        | Existing zero-run confirmation content; raw ineffective parameters remain internal evidence                    | `confirmationRequired`, `confirm:schedule-zero-runs:<unit.id>`; exactly one per after unit                        | `JP1-PARAM-SCHEDULE-UD-001`                                       |
| `ud` attached to a non-zero rule                                                                                                            | `invalid`                | `unsupported-schedule-date` | `schedule date is not a supported explicit calendar day in YYYY/MM/DD, MM/DD, or DD form`                      | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sd:ud-nonzero-invalid:<rule>`                           |
| Malformed `sd`, registration-relative `en`, omitted-year/month form not in an approved slice, or recognized but not-yet-supported date form | `unsupported`            | `unsupported-schedule-date` | `schedule date is not a supported explicit calendar day in YYYY/MM/DD, MM/DD, or DD form`                      | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sd:unsupported:<rule-or-raw>`                           |
| Impossible Gregorian date, invalid month-end offset, invalid weekday/occurrence, or contradictory date selector                             | `invalid`                | `invalid-calendar-day`      | `schedule date is not a valid calendar day in the comparison period`                                           | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sd:invalid-calendar-day:<rule-or-raw>`                  |
| Supported `sd` whose matching `st` is absent or uncalculated                                                                                | `missing-context`        | `missing-start-time`        | `matching st for schedule rule <rule> is missing or uncalculated`                                              | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sd:missing-start-time:<rule>`                           |
| Malformed, offset-based, day-crossing, `24:00+`, or otherwise non-normal `st`                                                               | `invalid`                | `invalid-start-time`        | `start time is missing, unparsable, offset-based, day-crossing, or outside HH:MM`                              | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:st:invalid:<rule-or-raw>`                               |
| Normal `st` with no matching `sd` rule                                                                                                      | `invalid`                | `unpaired-start-time`       | `matching sd for this start-time rule is missing`                                                              | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:st:unpaired:<rule>`                                     |
| Absolute `jc` resolving to one normalized job-group calendar                                                                                | `supported` or `no-runs` | none                        | Existing run output or existing zero-run confirmation according to the resolved schedule result                | No standalone item                                                                                                | `schedule:jc:resolved:<path>` plus calendar raw evidence          |
| Non-absolute, duplicated, or otherwise invalid `jc`                                                                                         | `invalid`                | `calendar-selection`        | `calendar selection is not calculated in this slice`                                                           | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:jc:invalid:<value>`                                     |
| Missing/non-group `jc` target or absent calendar registration                                                                               | `missing-context`        | `calendar-selection`        | `calendar selection is not calculated in this slice`                                                           | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:jc:missing-context:<value>`                             |
| Duplicate/invalid `sdd`, `md`, or `stt`, or conflicting calendar base/selector values                                                       | `invalid`                | `calendar-selection`        | `calendar selection is not calculated in this slice`                                                           | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:calendar:invalid-base-or-conflict:<key>`                |
| Incomplete calendar context for relative/open/closed projection                                                                             | `missing-context`        | `calendar-selection`        | `calendar selection is not calculated in this slice`                                                           | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:calendar:missing-context:<key>`                         |
| `cy` cycle schedule                                                                                                                         | `unsupported`            | `cycle-schedule`            | `cycle schedules are not calculated in this slice`                                                             | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:cy:unsupported:<rule-or-raw>`                           |
| `ln` inherited parent-rule association                                                                                                      | `unsupported`            | `inherited-parent-rule`     | `inherited parent-rule schedules are not calculated in this slice`                                             | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:ln:unsupported:<rule-or-raw>`                           |
| `cftd` days-from-start schedule                                                                                                             | `unsupported`            | `days-from-start`           | `schedule-by-days-from-start is not calculated in this slice`                                                  | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:cftd:unsupported:<rule-or-raw>`                         |
| Recognized `sh=be`, `sh=af`, or `sh=ca` before its approved substitution slice                                                              | `unsupported`            | `closed-day-substitution`   | `closed-day substitution is not calculated in this slice`                                                      | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sh:unsupported:<rule-or-raw>`                           |
| Invalid, conflicting, or unpaired `sh` value                                                                                                | `invalid`                | `closed-day-substitution`   | `closed-day substitution is not calculated in this slice`                                                      | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sh:invalid:<rule-or-raw>`                               |
| Recognized `shd` before its approved substitution slice                                                                                     | `unsupported`            | `shift-days`                | `shift days are not calculated in this slice`                                                                  | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:shd:unsupported:<rule-or-raw>`                          |
| Invalid, conflicting, or unpaired `shd` value                                                                                               | `invalid`                | `shift-days`                | `shift days are not calculated in this slice`                                                                  | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:shd:invalid:<rule-or-raw>`                              |
| `sh=no`, unresolved Manager service state, or incomplete calendar days required for substitution                                            | `missing-context`        | `closed-day-substitution`   | `closed-day substitution is not calculated in this slice`                                                      | Existing `SemanticDiffUnsupportedItem`, dynamic uncalculated schedule ID                                          | `schedule:sh:missing-context:<rule-or-raw>`                       |
| Missing or reversed comparison period                                                                                                       | `invalid-period`         | none                        | `schedule comparison period is invalid: from=<from>, to=<to>`                                                  | Existing `SemanticDiffUnsupportedItem` ID `uncalculated:schedule:period` plus existing limitation                 | `schedule:period:invalid`                                         |

<!-- markdownlint-enable MD013 -->

For a supported-before to valid after-side `ud` transition, retain both the
existing `removed` run changes and exactly one after-side zero-run
confirmation. Do not create a second confirmation from the removed runs, and
do not change the review-risk or Flow consumers. Unsupported-only, partial, and
missing-context units produce their mapped uncalculated items but no zero-run
confirmation.

## Non-Goals

- Schedule Impact Calendar, timeline, or other UI.
- New confirmation-required, review-risk, or execution-risk rules.
- Structured JSON output, report modes, or report wording changes.
- Comparison command, Git source, or comparison-period input UX.
- Live JP1/AJS execution-history verification or assertions that a job will or
  will not run in an external environment.
- Inferring holidays, business days, closed days, timezones, or calendar
  selection from the local host.
- `cftd` schedule-by-days-from-start calculation in the current feature scope;
  it remains explicitly uncalculated unless Replanning approves it.
- Support for JP1/AJS versions other than version 13.

## Planning Decisions

### Time And Date Model

- A comparison period remains a half-open range of JP1/AJS calendar dates,
  `[from, to)`, rather than a range of UTC instants.
- Interpreted start times remain JP1/AJS wall-clock values. Domain date
  arithmetic must be host-neutral and must not consult the desktop or web host
  timezone, locale, clock, or daylight-saving rules.
- The existing use of UTC date components is an implementation technique for
  deterministic Gregorian arithmetic, not a claim that JP1/AJS schedules run
  in UTC.
- Projection at or after `24:00`, projection with a non-zero calendar base
  time, and conversion to a civil timestamp require an explicit scheduler clock
  context and are deferred below.

### Calendar Source And Precedence

- The normalized `AjsDocument` already retains job-group hierarchy and `op`,
  `cl`, `sdd`, `md`, and `stt` parameters. A jobnet's `jc` value may select a
  different normalized job-group calendar; otherwise its containing job group
  is the source candidate.
- Calendar projection is supported only when the selected source and its
  normalized ancestors determine every required date. Missing `jc` targets or
  an unresolved scheduler-service fallback produce `missing-context`; the
  projector must not assume host holidays or silently treat an unresolved day
  as open.
- Calendar lookup starts at the selected group and walks toward the root.
  Resolve each exact-date or weekday selector from the closest group that
  defines it; for a concrete date, the closest exact-date entry takes precedence
  over the closest weekday entry. Repeated identical classifications are
  idempotent; contradictory `op` and `cl` definitions for the same selector in
  the same group are `invalid` because the reviewed version 13 sources do not
  establish a definition-file-order winner.
- Base day, base month, and base time use the closest explicit normalized group
  value. If none is present in the normalized chain, the documented defaults
  are day 1, `md=th`, and `00:00`; this does not make an absent operational
  open/closed calendar complete.
- This feature interprets a JP1/AJS open day as the only supported meaning of
  "business day". It does not import a national-holiday or locale calendar.

### Supported Expansion In This Feature

- Preserve all currently calculated `YYYY/MM/DD`, `MM/DD`, and `DD` behavior as
  a compatibility baseline, including its bounded-period recurrence behavior.
- Add fully qualified Gregorian month-end forms `YYYY/MM/b` and
  `YYYY/MM/b-DD`, fully qualified absolute weekday forms, and the source-backed
  `0,ud` undefined-schedule result.
- Treat `0,ud` as a valid intentional no-runs result. `ud` alone is a complete
  no-runs projection; `ud` with `st`, or with other schedule parameters, keeps
  the raw parameters as evidence but the rule-zero override makes the unit
  complete and no-runs. `ud` on a non-zero rule is invalid. Complete supported
  no-runs, including these `ud` forms, retain the existing generic zero-run
  confirmation; unsupported-only, partial, and missing-context projections do
  not. The existing review-risk and Flow policy is not changed.
- In the variants below, `ud-only` means one `sd=0,ud` with no `st`, `ud+st`
  means `sd=0,ud` with an `st` parameter present, and `mixed ud` means
  `sd=0,ud` alongside additional schedule parameters. All preserve their raw
  input while using the same `JP1-PARAM-SCHEDULE-UD-001` evidence ID.
- Add only fully qualified `YYYY/MM/...` relative, open-day, and closed-day
  forms when their required normalized calendar context is complete.
  Registration-relative `en` and newly generalized omitted-year or
  omitted-month forms remain uncalculated.
- Add closed-day substitution for `sh=be`, `sh=af`, and `sh=ca` with the
  effective `shd` limit and complete calendar context. `sh=no` remains
  uncalculated because its execution depends on JP1/AJS3 Manager service state.
- A rule containing `cy` or `cftd` is not partially projected through
  substitution. Its unresolved earlier or later schedule stage remains
  explicit.
- Omitted `sh` remains the current no-substitution compatibility behavior in
  this feature. Although the Definition Assistant describes Cancel as its UI
  default, applying it to every existing direct schedule would require a
  complete scheduler-service calendar that definition files do not carry and
  would violate `SCH-REGRESSION-001`. Generalizing the omitted default is a
  separate calendar-acquisition/compatibility decision.

### Deferred Follow-Up Entry Conditions

- Parent schedule inheritance and `ln` association remain unfinished follow-up
  owned by this feature. Replanning may slice them only after a durable domain
  contract distinguishes an inherited execution generation date from a
  guaranteed nested-jobnet start time. The current `SemanticDiffScheduleRun`
  requires a concrete time and must not misrepresent predecessor- or
  upper-generation-controlled execution as an exact start.
- Start times after `24:00` and 48-hour schedules remain unfinished follow-up
  owned by this feature. Replanning requires normalized input or an approved
  application port supplying the scheduler's 24/48-hour mode and effective
  base-time context. Any required infrastructure adapter, timezone conversion,
  or comparison-option change is a replan boundary.
- Cycle schedules remain unfinished follow-up owned by this feature.
  Replanning requires normalized input supplying a source-backed
  execution-registration anchor, registration mode, and valid term needed to
  generate the first recurrence and period boundaries.
- `cftd` stays outside this feature by explicit product scope. Supporting it
  requires its own intake after cycle and substitution projection are stable.
- Before this feature exits, Main must keep the parent/`ln`, 48-hour, cycle,
  and omitted-`sh` entry conditions in this feature's `TASKS.md` and the
  corresponding roadmap item. Each must either be made an implementation slice
  through Replanning or receive an explicit scope decision; no separate feature
  is created implicitly. This planning branch does not edit `roadmap.md`.

## Durable Documentation Impact

- Add each verified shared schedule meaning to
  `docs/requirements/domain-rules/interpret-jp1-parameters.md` under a stable
  `JP1-PARAM-*` rule ID before or with its implementation.
- Keep syntax/range ownership in
  `jp1-diagnostic-parameter-rules.md`; do not duplicate those bodies in this
  temporary feature folder.
- Update `uc-build-semantic-diff.md` only when a completed stage changes the
  durable observable schedule-comparison contract.
- No architecture-policy change is currently expected because the proposed
  responsibilities fit the existing domain/application boundaries.
- The roadmap already records this Wave 2 feature and its dependencies; intake
  requires no roadmap edit.

## Normative Planning Sources

- [Command Reference 5.2.3, job group definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0218.HTM):
  normalized calendar parameters and inherited defaults.
- [Command Reference 5.2.4, jobnet definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM):
  `sd`, including `sd=0,ud`, `st`, `ln`, `cy`, `sh`, `shd`, `cftd`, `de`, and
  `jc` syntax and meanings (v13 web p.220/376).
- [JP1/AJS3 version 13 Overview, section 3.3](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4200e/H03L4200.PDF):
  schedule-rule ordering, calendar-relative date calculation, upper-level rule
  association, 24/48-hour behavior, and closed-day substitution.
- [JP1/AJS3 version 13 Definition Assistant, calendar definition information](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF):
  explicit-date precedence over the standard week and closest-upper-group
  defaults.

### Normative Coverage Matrix

The following IDs are fixed durable-rule identifiers. Implementation must use
these IDs when adding the corresponding entries to
`interpret-jp1-parameters.md`; syntax/range diagnostics keep their existing
IDs. The test matrix is part of the plan and applies to both sides of a
comparison where the form is present.

<!-- markdownlint-disable MD013 -->

| Meaning                               | Stable rule ID                       | JP1/AJS3 v13 source (section/page)                                                                                                                                                                                                                                                    | Normal and boundary tests                                                                                               | Invalid and missing-context tests                                                                                                              |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Gregorian month-end                   | `JP1-PARAM-SCHEDULE-MONTH-END-001`   | [Command Reference §5.2.4, `sd`, web p.220/376](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10, PDF pp.137–138](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF)                               | `YYYY/MM/b`, `b-00`, `b-DD`, 28/29/30/31-day months, leap-century boundary, half-open period edge                       | impossible month/day and offset beyond the source range; no calendar context still calculates (must not become `missing-context`)              |
| Absolute weekday                      | `JP1-PARAM-SCHEDULE-WEEKDAY-001`     | [Command Reference §5.2.4, `sd`, web p.220/376](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10 rows 5–7, PDF p.138](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF)                           | first, nth, and last weekday; month boundary; valid missing fifth occurrence is `no-runs`; half-open edge               | invalid weekday or occurrence 0/6; no calendar context still calculates (must not become `missing-context`)                                    |
| Relative day                          | `JP1-PARAM-SCHEDULE-RELATIVE-001`    | [Command Reference §5.2.4, `sd`, web p.220/376](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10 rows 8–13, PDF p.138](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF)                          | `+DD`, `+b`, `+b-DD`, relative weekday first/nth/last, `md=th`/`ne` operational-month edges                             | out-of-range occurrence or impossible base day is `invalid`; absent `jc` target, incomplete base/calendar context is `missing-context`         |
| Open and closed day                   | `JP1-PARAM-SCHEDULE-OPEN-CLOSED-001` | [Command Reference §5.2.4, `sd`, web p.220/376](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10 rows 14–19, PDF pp.138–139; §5(7), pp.167–168](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF) | `*DD`, `@DD`, first/nth/last, `*b[-DD]`/`@b[-DD]`, exact-date-over-weekday precedence, operational-month edge           | invalid count or contradictory classification is `invalid`; incomplete normalized calendar or unresolved service fallback is `missing-context` |
| Closed-day substitution and shift     | `JP1-PARAM-SCHEDULE-SHIFT-001`       | [Command Reference §5.2.4, `sh`/`shd`, web p.220/376](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §5(8), PDF p.173](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF)                                              | `be`, `af`, `ca`, default `shd=2`, explicit 1/31-day bounds, leap/year and period-crossing shifts, collisions           | invalid `sh`/`shd`, conflicting or unpaired values; `sh=no` and incomplete calendar are `missing-context`                                      |
| Rule-zero undefined schedule (`0,ud`) | `JP1-PARAM-SCHEDULE-UD-001`          | [Command Reference §5.2.4, `sd=0,ud`, web p.220/376](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM)                                                                                                                                                             | `0,ud`; `ud`-only, `ud+st`, mixed `ud`, rule-zero override, period edge, and exactly one existing zero-run confirmation | non-zero-rule `ud` is `invalid`; absent calendar, `st`, or other context is not missing because valid rule-zero `ud` is self-contained         |

<!-- markdownlint-enable MD013 -->

The source pages establish the meaning and permitted forms; implementation
must not promote a syntax-only match to `supported` without the corresponding
context and projection tests above.
