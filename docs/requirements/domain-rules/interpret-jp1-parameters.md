# Domain Rule: Interpret JP1 Parameters

## Purpose

Provide the single normative contract for JP1/AJS parameter syntax, defaults,
inheritance, effective values, dependencies, and context-sensitive validity.

## Applies When

- an application or presentation workflow needs parameter meaning for display,
  validation, navigation, comparison, or command generation
- multiple consumers need the same parameter rule

## Inputs

- raw parsed or normalized parameter values
- normalized unit type, hierarchy, schedule, and related parameter context
- JP1/Automatic Job Management System 3 version 13 parameter rules

## Outputs

- effective parameter values
- default and inheritance results
- contextual validity or invalidity
- stable interpretation metadata and rule identifiers

## Normative Ownership

- this document is the single normative owner for shared parameter meaning
- consumer use cases state what they do with interpretation results and refer
  to rule IDs instead of redefining values or conditions
- a consumer-specific presentation rule may remain in its use case only when it
  does not redefine JP1/AJS parameter meaning
- new shared rules use stable identifiers in the form
  `JP1-PARAM-<AREA>-<MEANING>-<NUMBER>`

## Rules

- JP1/Automatic Job Management System 3 version 13 Definition File Reference is
  the normative product source
- effective values may depend on unit type, hierarchy, inheritance, schedule
  context, or combinations of parameters
- omitted values receive defaults only in their documented unit and parameter
  context
- interpretation never overwrites or discards the raw value retained by the
  normalized document
- manual-aligned semantics must not be duplicated independently in viewers,
  diagnostics, hover providers, adapters, or reports

Specific shared rules and their stable IDs are recorded here as consumer
documents are consolidated. A rule ID identifies meaning, not presentation
wording or a diagnostic message.

## Supported Shared Rules

### `JP1-PARAM-SCHEDULE-WC-WT-001`

- Applies to: each schedule-rule-number pair of `wc` and `wt` in a jobnet
  definition.
- Raw values: `wc={no|1..999|un}` and
  `wt={no|00:00..47:59|1..2879|un}`; omission defaults each parameter to `no`.
- Effective display rule: if either member is omitted or is `no`, both display
  values are empty. Otherwise, the explicit count and time remain effective.
- Raw values remain available even when the effective display pair is empty.
- Source: [Command Reference 5.2.4, `wc` and `wt`](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM).

### `JP1-PARAM-WAIT-ETS-DEFAULT-001`

- Applies to `ets` on file-monitoring (`flwj`, `rflwj`), execution-interval
  control (`tmwj`, `rtmwj`), log-file (`lfwj`, `rlfwj`), email-reception
  (`mlwj`, `rmlwj`), message-queue (`mqwj`, `rmqwj`), MSMQ (`mswj`, `rmswj`),
  and Windows-event-log (`ntwj`, `rntwj`) monitoring jobs.
- When omitted, the effective timeout action is `kl`. An explicit supported
  value in `{kl|nr|wr|an}` remains effective.
- Other unit types receive no default from this rule.
- Source: [Command Reference 5.2 definition index](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0001.HTM).

### `JP1-PARAM-EVENT-ARRIVAL-DEFAULT-001`

- Applies to JP1 event sending jobs (`evsj`, `revsj`).
- When omitted, effective values are `evssv=no`, `evsrt=n`, `evspl=10`, and
  `evsrc=10`. Explicit values remain effective.
- Other unit types receive no default from this rule.
- Source: [Command Reference 5.2.17, JP1 event sending job definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0232.HTM).

### `JP1-PARAM-FILE-MONITOR-DEFAULT-001`

- Applies to file-monitoring jobs (`flwj`, `rflwj`).
- When omitted, effective values are `flwc=c`, `flco=n`, and `flwi=60`.
  Explicit values remain effective.
- Other unit types receive no default from this rule.
- Source: [Command Reference 5.2.10, file monitoring job definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM).

### `JP1-PARAM-INTERVAL-CONTROL-DEFAULT-001`

- Applies to execution-interval control jobs (`tmwj`, `rtmwj`).
- When omitted, effective values are `tmitv=10` and `etn=n`. Explicit values
  remain effective.
- Other unit types receive no default from this rule.
- Source: [Command Reference 5.2.16, execution-interval control job definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0231.HTM).

### `JP1-PARAM-SCHEDULE-UD-001`

- Applies to a jobnet schedule rule whose effective schedule date is
  `sd=0,ud`.
- `0,ud` is an intentional undefined schedule and therefore produces no
  execution dates. It is a valid complete no-runs result, including when an
  `st` value or other schedule parameters are present; those raw values remain
  evidence but do not override the rule-zero result.
- `ud` attached to a non-zero schedule rule is not a valid rule-zero form and
  remains contextually invalid for schedule comparison.
- Interpretation retains the raw `sd` and contributing schedule parameters;
  application consumers map a complete no-runs result through the existing
  schedule confirmation shape rather than exposing an additional status field.
- Source: [Command Reference 5.2.4, `sd=0,ud`](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM).

### `JP1-PARAM-SCHEDULE-MONTH-END-001`

- Applies to fully qualified Gregorian jobnet schedule dates in the forms
  `YYYY/MM/b` and `YYYY/MM/b-DD`.
- `b` selects the last calendar day of the specified month. `b-00` is the
  same value, and each additional offset selects the preceding calendar day.
  Leap years use Gregorian rules, including the 400-year century boundary.
- An offset outside the specified month's calendar-day range, or an
  impossible year/month, is invalid. This meaning is calendar-independent and
  does not require a normalized operational calendar or host locale.
- Omitted-year or omitted-month forms such as `MM/b` and `b` remain
  uncalculated; existing direct `YYYY/MM/DD`, `MM/DD`, and `DD` behavior is
  unchanged.
- Source: [Command Reference 5.2.4, `sd`](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF).

### `JP1-PARAM-SCHEDULE-WEEKDAY-001`

- Applies to fully qualified Gregorian jobnet schedule dates in the forms
  `YYYY/MM/{su|mo|tu|we|th|fr|sa}`, `YYYY/MM/{weekday}:n`, and
  `YYYY/MM/{weekday}:b`.
- An omitted occurrence selects the first matching weekday. `:n` selects the
  nth matching weekday (`1` through `5`), and `:b` selects the last matching
  weekday in the specified month. A valid fifth occurrence that is absent is a
  valid no-runs result for that period.
- Occurrence `0` or an occurrence above `5`, an impossible year/month, and
  prefixed relative weekday forms are not calendar-independent supported
  values. Omitted-year or omitted-month weekday forms remain uncalculated.
- This meaning uses only proleptic Gregorian date arithmetic and does not
  consult an operational calendar, host locale, timezone, or current clock.
- Source: [Command Reference 5.2.4, `sd`](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF).

### `JP1-PARAM-SCHEDULE-RELATIVE-001`

- Applies to fully qualified Gregorian jobnet schedule dates in the forms
  `YYYY/MM/+DD`, `YYYY/MM/+b`, `YYYY/MM/+b-DD`, and
  `YYYY/MM/+{su|mo|tu|we|th|fr|sa}` with optional `:n` or `:b`.
- The calendar source is the exact normalized job group named by one absolute
  `jc` value, or the nearest `unitType=g` ancestor when `jc` is omitted. A
  missing or non-group `jc` target, a non-absolute or duplicated `jc`, and an
  ambiguous normalized hierarchy remain explicit context errors.
- The closest explicit `sdd`, `md`, and `stt` values in the selected group and
  its group ancestors are effective. Defaults are `sdd=1`, `md=th`, and
  `stt=00:00`. Duplicate or invalid base values are invalid; a non-zero valid
  `stt` is missing context until a clock-context rule is available.
- With `md=th`, an operational month starts on its base day in the named month
  and ends immediately before the same base day in the next month. With
  `md=ne`, it starts on the base day in the previous month and ends immediately
  before the base day in the named month. Numeric or weekday base days must
  exist at both boundaries and are never clamped.
- `+DD` counts inclusively from the operational-month start, `+b` and
  `+b-DD` count backward from its final calendar day, and relative weekdays
  select the first, nth, or last matching weekday in the interval. An absent
  valid occurrence is a no-run result; an out-of-range count or impossible
  base boundary is invalid.
- Omitted-year/month relative forms, non-zero base time, relative or omitted
  `st`, day-crossing start times, and unresolved scheduler-service calendar
  data remain uncalculated. The rule uses proleptic Gregorian arithmetic and
  does not consult host locale, timezone, clock, or external calendar data.
- Source: [Command Reference 5.2.3, job group definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0218.HTM); [Command Reference 5.2.4, `sd` and `jc`](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF).

### `JP1-PARAM-SCHEDULE-OPEN-CLOSED-001`

- Applies to fully qualified Gregorian jobnet schedule dates in the forms
  `YYYY/MM/*DD`, `YYYY/MM/@DD`, `YYYY/MM/*b[-DD]`, and
  `YYYY/MM/@b[-DD]`. `*` counts open days and `@` counts closed days.
- The calendar source is the exact normalized job group named by one absolute
  `jc` value, or the nearest containing group followed through its group
  ancestors when `jc` is omitted. `op` entries are open and `cl` entries are
  closed. The closest exact-date selector overrides the closest weekday
  selector for a concrete date. Identical duplicate values are idempotent;
  contradictory open/closed values for one selector in the same group are
  invalid.
- `*DD` and `@DD` count the `DD`th qualifying day inclusively from the
  operational-month start (`DD` is `01` through `35`). `*b` and `@b` select
  the last qualifying day, and `*b-DD` and `@b-DD` select the `DD`th
  zero-based qualifying offset backward from the operational-month end
  (`DD` is `00` through `34`). Every inspected date must have an explicit
  `op` or `cl` classification. A missing qualifying date is a valid no-runs
  result; incomplete classification is missing context, and invalid counts,
  contradictory selectors, or impossible base settings remain invalid.
- Omitted-year/month forms and unsupported substitution behavior remain
  uncalculated. The rule uses only normalized definition data and proleptic
  Gregorian arithmetic; it does not consult host locale, timezone, current
  clock, filesystem, network, WebAPI, or external calendar data. Existing
  application mapping and DTO shapes are unchanged.
- Source: [Command Reference 5.2.3, job group definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0218.HTM); [Command Reference 5.2.4, `sd` and `jc`](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM); [Definition Assistant §4.5.1(3), Table 4-10 and §5(7)](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L5200e/H03L5200.PDF).

## Diagnostic Interpretation Rules

The unique normative bodies for all diagnostic rule IDs are in
[JP1 Diagnostic Parameters](./jp1-diagnostic-parameter-rules.md). Diagnostic
use cases decide how violations are reported without redefining those rules.

## Behavioral Scenarios

```gherkin
Feature: Interpret JP1 parameters

Scenario: Parameter interpretation follows the named product version
  Given raw or normalized JP1/AJS parameter data
  And JP1/AJS3 version 13 parameter rules
  When parameter interpretation is requested
  Then the result follows JP1/AJS3 version 13 semantics

Scenario: Shared consumers reuse one interpretation result
  Given a parameter rule used by more than one consumer
  When list, flow, hover, diagnostics, definition, or comparison needs it
  Then each consumer uses the same normative interpretation

Scenario: Context-sensitive rules remain explicit
  Given a rule that depends on unit type, hierarchy, inheritance, or schedule
  When the parameter is interpreted
  Then the context affecting its effective value and validity is identified

Scenario: Raw and effective values remain distinguishable
  Given an omitted, inherited, defaulted, or contextually disabled parameter
  When the parameter is interpreted
  Then the raw normalized value remains available
  And the effective value records the applicable interpretation rule
```

## Acceptance Notes

- current JP1/AJS3 version 13 behavior remains unchanged while normative
  ownership is centralized
- future manual-alignment work starts as a focused feature when it adds a
  parameter family, consumer, or supported product version

## Risks Or Edge Cases

- wrapper-specific shortcuts might not map cleanly to the manual wording
- platform-specific transfer-path interpretation, non-default
  `SCHEDULELIMIT`, and broader cross-parameter invalidation remain outside the
  currently supported interpretation contract
- stable rule IDs must not encode UI labels, translations, or implementation
  names
