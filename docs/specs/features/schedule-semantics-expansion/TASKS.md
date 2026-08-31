# Feature Tasks: Schedule Semantics Expansion

## Agent Brief

- Purpose: separate schedule interpretation, bounded projection, and comparison,
  then add only source-backed schedule forms with complete normalized context.
- Approved or active slice: none; the complete five-slice planning package is
  human-approved for the plan gate. Implementation remains deferred until a
  separate implementation go-ahead and per-slice completion gates.
- Preserve current direct `sd` / `st`, period, ordering, and canonical-path
  behavior before expanding coverage.
- Do not implement parent inheritance, 48-hour, cycle, `cftd`, UI, risk policy,
  structured output, report modes, or comparison workflow.
- `sc` is never schedule evidence: remove it from schedule detection and
  `scheduleKeys`, keep its structural category `execution-definition`, and
  classify `jc` as `schedule` because it selects schedule calendar context.
- Distinguish `supported`, `no-runs`, `invalid`, `unsupported`, and
  `missing-context` only in domain-internal results. Map them to existing
  `SemanticDiffUnsupportedItem`, `scheduleComparison`, and confirmation paths
  without extending public or neutral DTOs. Complete supported valid no-runs,
  including `0,ud`, retain the existing generic zero-run confirmation;
  unsupported-only, partial, and missing-context projections suppress it. The
  existing review-risk and Flow policies remain unchanged. A supported-before
  to valid after-side `ud` transition keeps the existing removed-run facts and
  exactly one zero-run confirmation, without duplication or re-routing.
- `0,ud` has the stable internal evidence ID
  `JP1-PARAM-SCHEDULE-UD-001`, grounded in Command Reference 5.2.4. The full
  form-condition mapping (existing reason, message, item ID, and internal
  evidence key) is normative in `SPECS.md` and must be covered by tests. Here,
  `ud-only` means one `sd=0,ud` with no `st`, `ud+st` means `sd=0,ud` with an
  `st` present, and `mixed ud` means `sd=0,ud` alongside other schedule
  parameters.
- This `docs/schedule-semantics-expansion` branch is planning-only. After
  approval and merge, implementation starts from updated `main` on
  `codex/schedule-semantics-expansion`, one approved slice and approved path
  set at a time.
- Read first: `SPECS.md`, this file, and `TRACEABILITY.md`.
- Validate every slice with the closest schedule tests, desktop/web coverage,
  `rtk pnpm run qlty`, and the required durable-document checks.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: Main delegates the approved planning package to
  `approval-committer` for the plan gate. No implementation slice is active.

## Sync Rule

- Update this file in the same commit whenever a slice is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Other
  feature folders inherited from the base remain outside its scope.
- Update `TRACEABILITY.md` with slice validation. Update `roadmap.md` only when
  Main separately approves ownership of deferred repository-level work.
- Keep current approval, risk, validation, and Feature Exit information; remove
  obsolete work-log history.

## Plan Status

- Status: Plan Approved; plan-gate commit pending
- Planning scope: complete five-slice plan for boundary separation,
  calendar-independent dates, normalized calendar resolution, operational-day
  projection, and deterministic closed-day substitution
- Review status: Ready (`plan-reviewer`)
- Human approval: Approved
- Active implementation slice: none

## Human Approval

- Status: Approved
- Approved at: 2026-08-31 (explicit user approval in Codex for the reviewed
  seven-feature planning package)
- Approved scope: the complete five-slice schedule-semantics-expansion
  planning package and docs registration; implementation is deferred to the
  separate non-docs branch and later per-slice approval/completion gates.
- Approved paths: `docs/specs/features/schedule-semantics-expansion/SPECS.md`,
  `docs/specs/features/schedule-semantics-expansion/TASKS.md`, and
  `docs/specs/features/schedule-semantics-expansion/TRACEABILITY.md`.

The plan-gate approval authorizes only the focused commit of these three
planning documents. It does not authorize runtime code, tests, generated
artifacts, configuration, or implementation work.

Implementation must not start on this planning branch. It remains deferred
until the approved plan-gate commit, merge to `main`, a separate
implementation go-ahead, and the per-slice completion gates.

## Branch Boundary

- `docs/schedule-semantics-expansion` remains planning-only; this replan may
  change only `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`.
- After approval, the plan gate, and merge into `main`, implementation starts
  from updated `main` on non-docs branch `codex/schedule-semantics-expansion`.
  Each implementer handoff names one approved slice and its exact approved
  paths; code, tests, generated artifacts, and configuration are forbidden on
  this planning branch.

## Completion Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Contract

### Domain Boundaries

- Replace the internals of `evaluateSemanticDiffSchedule` with three explicit
  pure responsibilities while retaining it as the compatibility facade:
  `interpretSchedule`, `projectScheduleRuns`, and `compareScheduleRuns`.
- Put those responsibilities in focused modules beside
  `semanticDiffScheduleRules.ts`; add `scheduleCalendarContext.ts` only when
  Slice 3 supplies normalized calendar context.
- Interpretation operates per unit and rule number. It retains every raw
  contributing parameter, the effective rule number, and stable
  `JP1-PARAM-*` evidence IDs. It does not read a comparison period.
- Projection receives an interpretation, explicit context, and a validated
  half-open `LocalDate` period. It does not compare before and after data.
- Differ receives before and after projections plus the existing matched-unit
  canonical path mapping. It alone emits neutral `added`, `removed`, and
  `changed-time` decisions.

### Result Model

- Represent each interpreted or projected rule with a discriminated status:
  `supported`, `no-runs`, `invalid`, `unsupported`, or `missing-context`.
- `invalid` is reserved for malformed or contradictory normalized input;
  `unsupported` means a recognized v13 form is outside approved calculation;
  `missing-context` means the form is supported only with absent calendar,
  registration, clock, or external data.
- A unit projection is `complete` only when every effective rule is supported
  or validly produces no runs. It is `partial` when supported runs coexist with
  any unresolved rule, and `none` when no rule can be projected.
- Emit a valid unit-level no-runs fact only for a complete projection with at
  least one effective supported rule and no runs, or the explicit valid
  `0,ud` override. Unsupported-only and partial units must not be presented as
  valid no-runs schedules.
- Populate the existing `zeroRunCandidates`/confirmation path only from those
  complete supported valid no-runs facts. Unsupported-only, partial, and
  missing-context units are excluded; the application keeps the existing
  `confirm:schedule-zero-runs:<unit.id>` item and its Flow consumers unchanged.
- Mixed input keeps calculated runs and per-rule issues together; one invalid or
  unsupported rule must not discard another supported rule's runs.
- Preserve raw evidence in domain results, but map it through the existing
  application DTO and existing unsupported-item shape. Adding public JSON,
  report modes, risk levels, or new presentation schemas is forbidden.

### Internal Status To Existing Output Mapping

The status and evidence columns below are internal domain values only. They do
not become fields on `SemanticDiffScheduleRun`, `SemanticDiffScheduleComparison`,
`SemanticDiffUnsupportedItem`, or confirmation items.

<!-- markdownlint-disable MD013 -->

| Domain result                      | Existing application output                                                                     | Mapping and evidence rule                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supported` with one or more runs  | `scheduleComparison.runChanges`                                                                 | The differ emits the existing `added`, `removed`, or `changed-time` decisions; no unsupported item or confirmation is created.                                                                                                                                                                                                                                                           |
| Valid `no-runs` (including `0,ud`) | Existing `confirmationRequired` zero-run item plus any existing `scheduleComparison.runChanges` | A complete supported intentional no-runs side retains exactly one existing `confirm:schedule-zero-runs:<unit.id>` item. Unsupported-only, partial, and missing-context sides do not become zero-run candidates. When supported before-runs become valid after-side no-runs, existing `removed` decisions coexist with that one confirmation; review-risk and Flow routing are unchanged. |
| `invalid`                          | Existing `SemanticDiffUnsupportedItem` (`kind: uncalculated`)                                   | Keep the legacy reason (`invalid-start-time`, `invalid-calendar-day`, or the applicable existing reason), raw parameter, rule number, and stable internal evidence while the application renders the existing message/id.                                                                                                                                                                |
| `unsupported`                      | Existing `SemanticDiffUnsupportedItem` (`kind: uncalculated`)                                   | Keep the legacy reason (`cycle-schedule`, `closed-day-substitution`, `shift-days`, `inherited-parent-rule`, or `days-from-start`) and raw parameter/rule evidence; do not add a status field.                                                                                                                                                                                            |
| `missing-context`                  | Existing `SemanticDiffUnsupportedItem` (`kind: uncalculated`)                                   | Map absent calendar, registration, clock, or external service context to the applicable existing reason (`calendar-selection`, `missing-start-time`, or another approved legacy reason), preserving raw evidence internally.                                                                                                                                                             |

<!-- markdownlint-enable MD013 -->

For a mixed unit, supported runs remain in `scheduleComparison` while every
invalid, unsupported, or missing-context rule produces its own existing
uncalculated item. A unit is complete only when all effective rules are
supported or valid no-runs. Complete supported valid no-runs retain the
existing zero-run confirmation; unresolved-only, partial, and missing-context
units never become zero-run candidates. `0,ud` is a rule-zero override:
`ud`-only, `ud+st`, and mixed `ud` input are complete no-runs with all raw input
retained; `ud` on any non-zero rule is invalid. A before-run to after-`ud`
transition must produce the existing removed-run decision and one, not two,
zero-run confirmations.

The complete per-form reason/message/item-ID/internal-evidence mapping in
`SPECS.md` is normative for implementation and tests; no condition may fall
back to an unspecified "applicable" reason. The existing review-risk and Flow
consumers receive the same shapes and identifiers as before.

### Date, Time, And Ordering

- Model comparison dates as ISO Gregorian local dates and start times as
  JP1/AJS wall-clock values. Do not use host locale, system timezone, DST,
  filesystem, network, or current clock.
- Continue `[from, to)` period semantics and deterministic output sorting.
  Invalid ISO dates or `from >= to` keep the existing invalid-period outcome.
- Preserve first-definition behavior for duplicate `st` values of one rule in
  Slice 1. Interpretation retains duplicates as evidence so a later approved
  feature can change that policy without losing raw input.
- Stop treating `sc` as a schedule or calendar-selection key in both schedule
  detection and the structural `scheduleKeys` set; preserve its
  `execution-definition` attribute category. Treat `jc` as the documented
  job-group calendar selector and classify its structural attribute as
  `schedule`, even before its calendar context is resolved in Slice 3.
- Preserve before-path canonicalization for matched renamed or moved units and
  the existing changed-time rule: use `changed-time` only when each side has
  exactly one run for the canonical unit/date; otherwise emit added/removed
  timestamps.
- Projection work must be `O(number of effective rules + days intersecting the
requested period and an explicitly bounded lookaround)`. It must not enumerate
  years or days outside the requested v13-supported range except Slice 5's
  maximum 31-day substitution lookaround.
- Do not add a comparison-period cap in this feature. Use a 144-rule, ten-year
  representative case to verify linear scaling and stable ordering, and assert
  exact candidate-window bounds in projector tests rather than relying only on
  elapsed-time thresholds.

### Impact Inventory And Interfaces

- Domain implementation surface: replace the mixed responsibilities in
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts` with focused
  interpreter, projector, differ, and (from Slice 3) calendar-context modules;
  reuse the normalized parameter interpreters without moving parser concerns
  into the domain service.
- Application surface: `compareScheduleDiff.ts` and its call from
  `compareSemanticDiff.ts` pass the full before/after `AjsDocument` as context
  while continuing to compare only scoped units. The public
  `CompareSemanticDiffInput`, options, change-set DTO, report sections, command,
  and presentation message contracts do not change.
- Internal interfaces: export explicit interpretation, projection, per-rule
  status/evidence, unit completeness, calendar context, and neutral run-decision
  types. Keep `evaluateSemanticDiffSchedule` as the compatibility facade until
  all in-repository callers and tests use the separated boundaries safely.
- Validation surface: extend `semanticDiffScheduleRules.test.ts`,
  `semanticDiffSchedule.test.ts`, and `scheduleRuleHelpers.test.ts`; add focused
  resolver/projector suites when their responsibility would otherwise be hidden
  in the facade tests. Normalization tests change only if a missing normalized
  hierarchy/parameter preservation case is discovered.
- Durable and user documentation surface: update
  `interpret-jp1-parameters.md`, `uc-build-semantic-diff.md`, README, and
  CHANGELOG in the slice that first changes the corresponding observable rule.
  Architecture documentation is unchanged unless implementation discovers a
  boundary not already covered by the domain/application dependency rules.

## Implementation Slices

### Slice 1: Separate The Schedule Pipeline And Preserve The Baseline

- Status: Planned
- Scope: extract interpreter, bounded projector, and differ responsibilities;
  introduce the per-rule and unit completeness result model; keep
  `evaluateSemanticDiffSchedule` and `compareScheduleDiff` as orchestration
  facades; correct structural schedule classification; retain the existing
  zero-run confirmation for complete supported no-runs; and suppress it only
  for unsupported-only, partial, or missing-context projections.
- User / Domain Value: future schedule forms can be added without conflating
  invalid input, unsupported meaning, missing context, and a valid empty period.
- Cohesive Change Group: domain schedule modules and models, the
  `semanticDiffStructuralRules` classification path, application facade
  mapping, current schedule unit/integration tests, and the durable schedule
  comparison status contract.
- Acceptance:
  - Missing periods remain `not-requested`; malformed or reversed periods remain
    `invalid-period` with the existing application limitation.
  - Direct `sd` / normal absolute `st` pairs preserve current `YYYY/MM/DD`,
    `MM/DD`, and `DD` runs, half-open boundaries, deterministic sort order,
    added/removed/changed-time decisions, first matching `st`, and matched-unit
    before-path canonicalization.
  - Existing `cy`, `sh`, `shd`, `ln`, `cftd`, relative `st`, day-crossing `st`,
    unsupported `sd`, missing pair, and invalid-day evidence remains explicit
    with compatible application messages. `sc` is removed from schedule
    detection and `scheduleKeys`, remains `execution-definition`, and never
    makes an `sc`-only unit schedule-defined. `jc` is classified as `schedule`
    but remains unresolved until Slice 3.
  - Structural tests cover `sc`-only, `sc` plus `sd`/`st`, `jc`, and `sd`/`st`
    changes. Schedule tests prove an `sc`-only unit is not evaluated, while
    `sc` plus a valid `sd`/`st` pair is evaluated only because of that pair.
  - Supported and unresolved rules can coexist without discarding supported
    runs. `supported`, `no-runs`, `invalid`, `unsupported`, and
    `missing-context` remain domain-internal; the existing unsupported-item,
    schedule-comparison, confirmation, and review-risk input paths are used
    without a DTO extension. Complete supported valid no-runs, including
    `0,ud`, keep exactly one existing zero-run confirmation; unsupported-only,
    partial, and missing-context projections do not. Existing review-risk and
    Flow policy is unchanged.
  - Interpreter, projector, differ, and structural-classification tests call
    their boundaries directly; facade tests prove the combined output is
    otherwise unchanged.
- Validation:
  - Extend `semanticDiffStructuralRules.test.ts` with `sc`-only,
    `sc`+`sd`/`st`, `jc`, and `sd`/`st` category/detection regressions.
  - Extend `semanticDiffScheduleRules.test.ts` with golden baseline cases for
    all current reasons, every form-condition row in the SPECS mapping table,
    mixed rules, duplicate rule values, multi-run dates, complete supported
    no-runs, invalid periods, and canonical paths; prove `sc` is excluded from
    schedule detection and `scheduleKeys`, and assert each internal evidence
    ID and preserved raw parameter/rule.
  - Extend `semanticDiffSchedule.test.ts` for existing application mapping,
    supported complete no-runs confirmation, suppression for unsupported-only,
    partial, and missing-context projections, unchanged review-risk/Flow
    inputs, and before-supported to after-`ud` coexistence: one existing
    removed-run decision plus exactly one zero-run confirmation, with no
    duplicate confirmation. Assert every SPECS mapping row's existing reason,
    exact message, dynamic item ID, and domain-only evidence ID, including
    `jc` invalid/duplicate/missing-context, invalid base/conflict, non-zero
    `ud`, and `sh`/`shd` conditions.
  - Keep the existing `semanticDiffFlowHighlights.test.ts` confirmation
    mapping stable: a complete supported no-runs result has the same
    confirmation ID and Flow highlight, while suppressed unresolved results
    have neither a zero-run confirmation nor a duplicate highlight.
  - Update the durable `uc-build-semantic-diff.md` schedule scenario to state
    that complete supported no-runs retain the existing confirmation, while
    unsupported-only/partial/missing-context projections suppress it, and that
    supported-before to `ud`-after produces the existing removed-run facts
    alongside one confirmation without changing review-risk/Flow policy.
  - Run `rtk pnpm run qlty`, `rtk pnpm run test:full`, and
    `rtk pnpm run build`; run `rtk pnpm run lint:md` for durable-doc edits.
- Production Readiness: pure browser-safe functions; no new external input;
  malformed values return statuses rather than throw; desktop and web results
  must match; compare the defined 144-rule, ten-year case without unbounded
  expansion; retain raw status/reason evidence without exposing it in DTOs.
- Approval Boundary: domain/application schedule refactor and internal status
  mapping; `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`;
  `src/test/suite/semanticDiffStructuralRules.test.ts`;
  `src/test/suite/semanticDiffScheduleRules.test.ts`;
  `src/test/suite/semanticDiffSchedule.test.ts`;
  `src/test/suite/semanticDiffFlowHighlights.test.ts`; `uc-build-semantic-diff.md`;
  and shared schedule rule docs. Any public/neutral DTO field, confirmation
  level, or report message-policy change is a replan.
- Dependencies: none.
- Risks: refactoring can silently change duplicate selection, zero-run mapping,
  sort order, renamed-unit paths, or the accidental `sc` classification.
  Golden tests lock the baseline; explicit tests lock `sc` as
  `execution-definition` and `jc` as `schedule`.
- Out of Scope: every new calculated schedule token and all presentation,
  confirmation-policy, and command changes.

### Slice 2: Complete Calendar-Independent Gregorian Dates

- Status: Planned
- Scope: add fully qualified `YYYY/MM/b`, `YYYY/MM/b-DD`, and absolute weekday
  projection, and interpret `0,ud` as an intentional undefined schedule; retain
  current direct date behavior without generalizing registration-relative
  omissions.
- User / Domain Value: Semantic Diff can calculate explicit month-end schedules,
  including leap years and offsets, without requiring an operational calendar.
- Cohesive Change Group: schedule-date interpretation/projector rules, v13 rule
  documentation, domain/application schedule tests, and changed user-facing
  support documentation.
- Acceptance:
  - `YYYY/MM/b` selects the Gregorian last calendar day and `b-DD` subtracts the
    stated zero-based offset; invalid offsets and impossible dates are `invalid`.
  - `YYYY/MM/{weekday}`, `weekday:n`, and `weekday:b` select respectively the
    first, nth, or last matching weekday in that Gregorian month. A nonexistent
    fifth occurrence is a valid no-run result, not an invalid date.
  - Month-start and explicit day remain the existing `YYYY/MM/01` and
    `YYYY/MM/DD` behavior. Results are filtered by the half-open period.
  - `0,ud` produces a complete valid intentional no-runs result and does not
    require `st`; as the documented rule-zero unit-level override it makes
    every other schedule item ineffective while preserving their raw evidence.
    This includes `ud`-only, `ud+st`, and mixed `ud` input. `ud` with a rule
    other than 0 is `invalid`. Its stable internal evidence ID is
    `JP1-PARAM-SCHEDULE-UD-001`, grounded in Command Reference 5.2.4. `en`
    remains `missing-context` because registration date is absent.
  - `ud` no-runs is mapped through the domain-internal status table: a complete
    supported `ud` no-runs projection retains the existing zero-run
    confirmation. Unsupported-only, partial, or missing-context projections
    suppress that confirmation. When before has supported runs and after is
    the valid `ud` no-runs projection, the existing differ emits the `removed`
    run changes alongside exactly one zero-run confirmation; review-risk and
    Flow policy remain unchanged.
  - New support is not applied to `MM/b`, `b`, or other omitted-year/month forms;
    current supported `MM/DD` and `DD` behavior remains unchanged for
    compatibility.
  - The application continues to expose existing run-change and unsupported
    item shapes; only newly calculated forms change observable results.
- Validation:
  - Test month starts, 28/29/30/31-day endings, leap-century boundaries,
    `b-00`, largest valid offset, invalid offset, weekday first/nth/last/missing
    occurrence, period edges, `ud`-only, `ud+st`, mixed `ud`, non-zero-rule
    `ud`, `en`, and mixed supported/unsupported rules. Assert the normative
    coverage matrix's `JP1-PARAM-SCHEDULE-MONTH-END-001`,
    `JP1-PARAM-SCHEDULE-WEEKDAY-001`, and
    `JP1-PARAM-SCHEDULE-UD-001` cases, including one zero-run confirmation for
    complete supported no-runs and none for unresolved-only/partial/missing
    context. Assert `0,ud` keeps the existing confirmation ID and non-zero
    `ud` maps to the existing `unsupported-schedule-date` reason/message and
    dynamic item ID with its internal evidence ID.
  - Run `rtk pnpm run qlty`, `rtk pnpm run test:full`,
    `rtk pnpm run build`, and `rtk pnpm run lint:md`.
- Production Readiness: compute candidates by month rather than scanning
  unrelated dates; preserve recoverable invalid results; update README support
  wording and CHANGELOG because calculated user-visible coverage expands.
- Approval Boundary: calendar-independent projector, tests, README, CHANGELOG,
  `interpret-jp1-parameters.md`, and `uc-build-semantic-diff.md`. Calendar lookup
  or clock context belongs to Slice 3 or Replanning.
- Dependencies: Slice 1 complete and committed.
- Risks: omitted date components have registration-time semantics in v13; the
  slice deliberately adds only fully qualified forms.
- Out of Scope: relative/open/closed days, operational calendar lookup, start
  times with `+` or after `24:00`, inheritance, cycle, and shift.

### Slice 3: Resolve Normalized Calendar Context And Relative Dates

- Status: Planned
- Scope: pass each full normalized `AjsDocument` into schedule orchestration,
  resolve side-specific containing-group or `jc` calendar context, define the
  operational-month interval, and project fully qualified relative-day forms.
- User / Domain Value: reviewers can calculate base-day-relative schedules from
  explicit normalized hierarchy without relying on host dates or hidden
  scheduler state.
- Cohesive Change Group: normalized calendar-context resolver, application
  orchestration input, operational-month and relative-date projection, schedule
  tests, and durable v13 base-setting rules.
- Acceptance:
  - Resolve each side independently. `jc` selects an exact normalized absolute
    group path from the full side document; otherwise use the containing job
    group, meaning the nearest `unitType=g` ancestor rather than an immediate
    nested-jobnet parent. A missing or non-group `jc` target is
    `missing-context`, never a fallback to the containing group.
    A non-absolute `jc` value or more than one `jc` value on the same jobnet is
    `invalid`.
  - Resolve `sdd`, `md`, and `stt` from the closest explicit group value, then
    use documented defaults 1, `th`, and `00:00` when none occurs in the
    normalized chain. An invalid value or more than one occurrence of a
    nominally single-valued base parameter in the selected group is `invalid`,
    not a file-order override or a default.
  - For `md=th`, operational month `YYYY/MM` starts at its resolved base day in
    that Gregorian month and ends immediately before the next operational
    month. For `md=ne`, it starts at the resolved base day in the previous
    Gregorian month and ends immediately before the base day in `YYYY/MM`.
    A numeric or weekday base day that does not exist in a particular boundary
    month makes that context `invalid`; it is never clamped or guessed.
  - `YYYY/MM/+DD` counts calendar days inclusively from the operational-month
    start (`+01` is the start). `+b` and `+b-DD` count backward from its final
    calendar day. `+weekday`, `+weekday:n`, and `+weekday:b` select the
    first/nth/last matching weekday within the operational-month interval.
  - A syntactically valid occurrence absent from the interval is a valid no-run
    result. Out-of-range syntax or an impossible base definition is `invalid`.
  - Require effective base time `00:00` and normal absolute `st < 24:00` for
    projection. Non-zero base time, relative `st`, omitted `st`, and
    day-crossing `st` remain `missing-context` pending a clock-context feature.
  - Before and after contexts may differ. The differ compares the resulting
    neutral runs with existing path canonicalization and DTO shapes.
- Validation:
  - Add resolver tests for containing group, `jc`, missing/non-group target,
    duplicate/non-absolute `jc`, closest ancestor base values, documented
    defaults, invalid or duplicate `sdd`/`md`/`stt` base values, calendar
    conflicts, hierarchy cycles, duplicate paths, and independent before/after
    contexts. Assert the existing `calendar-selection` reason/message and
    dynamic item ID for each invalid or missing-context case.
  - Add projector tests for `md=th`/`ne`, numeric and weekday base days,
    inclusive relative counts, last-day offsets, relative weekday occurrences,
    leap boundaries, invalid input, valid no-run occurrences, and half-open
    period edges.
  - Add application tests proving full-document context does not widen the
    comparison scope and produces identical desktop/web results without a new
    presentation schema.
  - Run `rtk pnpm run qlty`, `rtk pnpm run test:full`,
    `rtk pnpm run build`, and `rtk pnpm run lint:md`.
- Production Readiness: construct only operational months intersecting the
  period; reject hierarchy cycles and duplicate-path ambiguity recoverably;
  avoid host time APIs; update README and CHANGELOG for expanded coverage and
  its explicit-context limitation.
- Approval Boundary: domain calendar/base context and relative projection,
  application access to full normalized documents, schedule tests, README,
  CHANGELOG, `interpret-jp1-parameters.md`, and
  `uc-build-semantic-diff.md`. Loading scheduler-service calendars from
  filesystem, network, WebAPI, or command options is a replan.
- Dependencies: Slices 1 and 2 complete and committed.
- Risks: a `jc` group can sit outside comparison scope but inside the full
  document; orchestration must use it only as context and must not add its units
  to the compared change set.
- Out of Scope: open/closed-day counting, closed-day substitution, calendar UI,
  timezone conversion, non-zero base-time projection, parent schedules, and cycles.

### Slice 4: Project Explicit Open And Closed Days

- Status: Planned
- Scope: resolve a complete normalized operational calendar and project fully
  qualified `YYYY/MM/*...` open-day and `YYYY/MM/@...` closed-day forms.
- User / Domain Value: reviewers can calculate business/open-day and closed-day
  schedules when the compared definition contains sufficient calendar evidence.
- Cohesive Change Group: open/closed calendar resolver, operational-day
  projector rules, domain/application tests, and durable v13 calendar rules.
- Acceptance:
  - Start at the selected group (`jc` or containing group) and walk ancestors.
    A missing `jc` target remains `missing-context`; no fallback is allowed.
  - Resolve each exact-date or weekday selector independently from the closest
    group that defines it. For a concrete date, the closest exact-date
    `op`/`cl` match overrides the closest weekday classification. Repeated
    identical values are idempotent; contradictory open/closed values for the
    same selector in the same group are `invalid` because no reviewed source
    establishes last-write semantics.
  - An absent normalized standard-week source that could fall back to the
    scheduler service is `missing-context`; host weekdays, holidays, and locale
    calendars are never substituted. "Business day" means only a resolved
    JP1/AJS open day.
  - `*DD` and `@DD` count qualifying days inclusively from the operational-month
    start. `*b[-DD]` and `@b[-DD]` count qualifying days backward from the end.
    Every day inspected by a count must be classified; otherwise the rule is
    `missing-context` rather than partially projected.
  - No qualifying nth/last day is a valid no-run outcome. Invalid counts,
    contradictory calendars, and impossible base settings are `invalid`.
- Validation:
  - Test containing group, `jc`, missing target, ancestor selection,
    exact-over-weekday precedence, identical duplicates, contradictory values,
    incomplete calendars, and independent before/after calendars. Assert the
    mapping table's existing `calendar-selection` reason/message/item ID and
    `schedule:calendar:invalid-base-or-conflict:<key>` evidence for calendar
    conflicts.
  - Test first/nth/last open and closed days, leap and operational-month
    boundaries, no qualifying date, invalid input, missing classification, and
    half-open comparison edges.
  - Run `rtk pnpm run qlty`, `rtk pnpm run test:full`,
    `rtk pnpm run build`, and `rtk pnpm run lint:md`.
- Production Readiness: classify only dates inspected by requested rules and
  period; keep incomplete external calendars explicit; update README and
  CHANGELOG with the definition-context limitation.
- Approval Boundary: normalized calendar resolver, operational-day projector,
  existing application mapping, schedule tests, README, CHANGELOG,
  `interpret-jp1-parameters.md`, and `uc-build-semantic-diff.md`. Calendar
  acquisition through filesystem, network, WebAPI, host locale, or command
  options requires Replanning.
- Dependencies: Slices 1 through 3 complete and committed.
- Risks: operational calendars can depend on scheduler-service state absent from
  a definition file; completeness is required before calculation.
- Out of Scope: substitution, omitted-`sh` default application, calendar UI,
  locale holidays, timezone conversion, parent schedules, cycles, and `cftd`.

### Slice 5: Apply Deterministic Closed-Day Substitution

- Status: Planned
- Scope: apply `sh=be`, `sh=af`, and `sh=ca` after a supported base schedule
  date, using effective `shd` and Slice 4 calendar context; integrate final
  bounded-work and compatibility evidence.
- User / Domain Value: Semantic Diff can show when a definition-backed closed
  day moves or removes an otherwise calculated run.
- Cohesive Change Group: rule-associated substitution stage, bounded lookaround,
  schedule tests, durable substitution rules, and final user documentation.
- Acceptance:
  - Associate `sh` and `shd` by schedule-rule number. For `be` or `af`, select
    the nearest open day in that direction within effective `shd`; omission of
    `shd` uses the v13 default of two days.
  - Repeated identical `sh` or `shd` values for one rule are idempotent;
    conflicting values are `invalid`. `shd` without a matching explicit `sh`
    remains an unpaired unresolved parameter and does not alter another rule.
  - An omitted `sh` preserves the existing no-substitution product behavior.
    Do not generalize the Definition Assistant's Cancel UI default because the
    definition lacks the scheduler-service calendar needed to apply it safely.
  - `ca` produces no run when the base schedule day is closed. A base day that
    is open remains unchanged. If no open day exists within a complete search
    window, `be`/`af` validly produces no run.
  - Search at most 31 days before or after a base date and expand the input
    candidate window by at most 31 days so a shift across the requested period
    boundary is included, then filter final runs to `[from, to)`.
  - `sh=no` remains `missing-context` because its result depends on Manager
    service state. Invalid `sh`/`shd`, incomplete calendar days, or missing rule
    associations retain raw evidence and do not throw.
  - A rule containing `cy` or `cftd` remains unresolved as a whole; substitution
    must not project a date from an unsupported predecessor or skip a required
    later stage.
  - Multiple rules shifted to the same date retain rule identity and use the
    existing multi-run added/removed behavior rather than an invented
    changed-time match.
- Validation:
  - Test open base dates, previous/next shifts, default and explicit limits,
    no target within limit, month/year/leap boundaries, period-crossing shifts,
    `ca`, `no`, invalid values, mixed rules, and collisions. Assert the mapped
    `closed-day-substitution`/`shift-days` reason, exact legacy message, item
    ID, and internal `schedule:sh*:*` evidence for each condition.
  - Add representative full-range and repeated-rule checks proving bounded
    work and stable sorting; compare desktop and web outputs for the same
    normalized context.
  - Run `rtk pnpm run qlty`, `rtk pnpm run test:full`,
    `rtk pnpm run build`, and `rtk pnpm run lint:md`.
- Production Readiness: no external calendar or runtime-state assumptions;
  bounded 31-day lookaround; recoverable errors; README and CHANGELOG describe
  newly calculated forms and remaining uncalculated forms.
- Approval Boundary: substitution projector, existing application mapping,
  schedule tests, README, CHANGELOG, `interpret-jp1-parameters.md`, and
  `uc-build-semantic-diff.md`. Cycle, `cftd`, service-state lookup, or risk-rule
  changes require Replanning or another feature.
- Dependencies: Slices 1 through 4 complete and committed.
- Risks: substitution order relative to cycle and `cftd` is significant; rules
  containing either are kept unresolved to prevent partial false precision.
- Out of Scope: `sh=no` execution assertions, applying an omitted-`sh` default,
  cycle interaction, days-from-start, registration-mode behavior, and
  user-facing calendar presentation.

## Deferred Work And Replan Triggers

- Parent inheritance / `ln` is unfinished follow-up owned by this selected
  feature, not a new feature. Replanning may add a slice only after a neutral
  domain contract is approved that distinguishes an inherited generation date
  from a guaranteed nested-jobnet start time, and after its interaction with
  the structured-output owner is resolved. Entry context must include the full
  normalized parent chain and source-backed rule association; cycles and
  missing parents stay explicit.
- 48-hour / day-crossing time is unfinished follow-up owned by this selected
  feature, not a new feature. Replanning requires normalized input or an
  approved port supplying 24/48-hour mode and effective base-time context. A
  new adapter, comparison option, timezone conversion, or DTO timestamp is a
  replan boundary.
- Cycle is unfinished follow-up owned by this selected feature, not a new
  feature. Replanning requires execution-registration anchor, registration
  mode, valid term, and first-recurrence semantics as explicit normalized
  inputs with v13 citations.
- `cftd`: separate intake after cycle and substitution contracts are stable.
- Applying the omitted-`sh` Cancel default to all direct schedules is unfinished
  follow-up owned by this selected feature, not a new feature. Replanning or an
  explicit scope decision requires an explicit scheduler-service calendar
  source; do not silently reinterpret the current direct `sd` / `st` baseline.
- Registration-relative `en` and newly supported omitted-year/month forms need
  an explicit registration-date contract; do not infer it from period start or
  the host clock.
- Keep the parent/`ln`, 48-hour, cycle, and omitted-`sh` entry conditions in
  this `TASKS.md` and the corresponding roadmap item. Before Feature Exit,
  Replanning must either turn each still-valued item into an approved slice or
  record an explicit scope decision; do not create a separate feature
  implicitly. This branch must not edit the roadmap.
- Stop and return to Main for Replanning if implementation needs a public DTO or
  report schema, presentation or command work, new calendar acquisition,
  filesystem/network/host time, another JP1/AJS version, or a rule outside the
  exact forms above.

## Feature Exit

- Definition of Done status: not started
- Durable documentation: each implemented semantic rule is added under stable
  IDs in `interpret-jp1-parameters.md`; observable comparison behavior is
  reflected in `uc-build-semantic-diff.md`; architecture docs change only if an
  implementation discovers a new durable boundary.
- README / CHANGELOG: Slice 1 evaluates impact; Slices 2 through 5 update both
  for externally observable support expansion.
- Exit evidence: all five slices complete, reviewed, approved, and committed;
  traceability and desktop/web validation current; the parent/`ln`, 48-hour,
  cycle, and omitted-`sh` entry conditions have either been sliced through
  Replanning or resolved by an explicit scope decision in this feature and its
  roadmap item; no reusable knowledge remains only in this folder.
- Open compatibility risks: current `MM/DD` and `DD` recurrence is preserved as
  a product baseline despite registration-context limits; external calendars,
  48-hour mode, timezone, and runtime service state remain unverified.

## Validation Checklist

- [ ] Independent plan review returns `Ready`.
- [ ] Human Approval records the exact first-slice scope and paths.
- [ ] Every slice has a focused plan/completion commit and implementation review.
- [ ] Existing direct schedule regression behavior is preserved.
- [ ] Every newly calculated form has v13 durable rules and boundary tests.
- [ ] Invalid, unsupported, missing-context, partial, and valid zero-run results
      are distinct inside the domain and map through existing DTOs; complete
      supported no-runs retain one existing zero-run confirmation, while
      unsupported-only/partial/missing-context projections suppress it.
- [ ] Projection is bounded by the period and approved lookaround.
- [ ] Desktop and web outputs are deterministic and host-neutral.
- [ ] README, CHANGELOG, durable use case, and rule impact is complete.
- [ ] Parent/`ln`, 48-hour, cycle, and omitted-`sh` follow-up has been sliced by
      Replanning or resolved by an explicit scope decision before Feature Exit.
- [ ] Implementation is performed only after merge from this planning branch,
      from `main` on `codex/schedule-semantics-expansion`, within approved paths.
