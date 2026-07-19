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

### `JP1-PARAM-TRANSFER-QUEUE-OPERATION-001`

- Applies to the Unit List projection of transfer parameters `ts1` through
  `ts4`, `td1` through `td4`, and `top1` through `top4`.
- QUEUE and recovery QUEUE jobs (`qj`, `rq`) expose explicit source and
  destination values but no transfer-operation value.
- For other unit types, explicit transfer-operation values remain available;
  this rule supplies no default.
- Source: [Command Reference 5.2.7, QUEUE job definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM) and [5.2.6, UNIX/PC job definition](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM).

## Diagnostic Interpretation Rules

These rules define parameter meaning. Diagnostic use cases decide how a
violation is reported without redefining the rule.

### File Monitoring

- `JP1-PARAM-FILE-MONITOR-CONDITION-001`: `flwc` must not combine size-change
  monitoring with modification-time monitoring.
- `JP1-PARAM-FILE-MONITOR-OUTPUT-001`: `flco` requires effective `flwc` to
  include file-creation monitoring.

### Job End Judgment And Retry

- `JP1-PARAM-RETRY-ABR-DEPENDENCY-001`: `rjs`, `rje`, `rec`, and `rei` require
  effective `abr` to enable automatic retry for a UNIX/PC job.
- `JP1-PARAM-JOB-END-RANGE-001`: explicit `wth` and `tho` are within
  `0..2147483647`; `rjs` and `rje` are within `1..4294967295`; `rec` is within
  `1..12`; and `rei` is within `1..10`.
- `JP1-PARAM-JOB-END-THRESHOLD-001`: when effective `jd` selects threshold
  judgment, explicit `wth` and `tho` preserve the documented warning-to-
  abnormal threshold order.

### Schedule Rules

- `JP1-PARAM-SCHEDULE-RANGE-001`: explicit `ln`, `st`, `cy`, `shd`, `cftd`,
  `sy`, `ey`, `wc`, and `wt` stay within their JP1/AJS3 version 13 ranges.
- `JP1-PARAM-SCHEDULE-WEEKLY-DAY-001`: a weekly `cy=(n,w)` schedule does not
  use open-day or closed-day semantics in its matching `sd` rule.
- `JP1-PARAM-SCHEDULE-START-DATE-001`: `sd` uses a schedule-rule number within
  `1..144`, a documented day form and range, and a year within `1994..2036`.
  The year rule follows the official default `SCHEDULELIMIT=2036`; site-specific
  overrides are outside the supported contract.

### JP1 Event Sending

- `JP1-PARAM-EVENT-ARRIVAL-HOST-001`: when effective `evsrt` enables arrival
  checking, `evhst` is required.
- `JP1-PARAM-EVENT-ARRIVAL-RANGE-001`: explicit `evspl` is within `3..600` and
  explicit `evsrc` is within `0..999`.
- `JP1-PARAM-EVENT-SEND-ID-RANGE-001`: explicit `evsid` is within hexadecimal
  range `00000000..00001FFF` or `7FFF8000..7FFFFFFF`.

### JP1 Event Reception Monitoring

- `JP1-PARAM-EVENT-RECEIVE-SCOPE-001`: explicit `evesc` is `no` or within
  `1..720`.
- `JP1-PARAM-EVENT-RECEIVE-FORMAT-001`: explicit `evwid` follows the
  hexadecimal event-ID format and range `00000000:00000000` through
  `FFFFFFFF:FFFFFFFF`; explicit `evipa` is within IPv4 dotted-decimal range
  `0.0.0.0` through `255.255.255.255`.
- `JP1-PARAM-EVENT-RECEIVE-NUMERIC-ID-001`: explicit `evuid`, `evgid`, and
  `evpid` are within signed-decimal range `-1..9999999999`.
- `JP1-PARAM-EVENT-RECEIVE-FILTER-001`: explicit `evusr`, `evgrp`, `evwms`, and
  `evdet` stay within their documented byte-length ranges; `evwfr` follows the
  `optional-extended-attribute-name:"value"` form and total byte-length range;
  and `evtmc` follows its allowed forms and filename byte-length range.
- `JP1-PARAM-EVENT-RECEIVE-TIMEOUT-001`: explicit `etm` is within `1..1440`,
  `ha` is in `{y|n}`, and `ets` is in `{kl|nr|wr|an}`. Parameters `etm`, `ha`,
  and `ets` are not effective where the version 13 rules disable them in a
  start-condition context.

### Shared Event And Wait Values

- `JP1-PARAM-EVENT-HOST-LENGTH-001`: explicit `evhst` for supported event
  sending and reception-monitoring jobs is within `1..255` bytes.
- `JP1-PARAM-WAIT-ETS-VALUE-001`: explicit `ets` for supported file-monitoring
  and execution-interval control jobs is in `{kl|nr|wr|an}`.
- `JP1-PARAM-WAIT-FD-CONTEXT-001`: explicit `fd` for supported file-monitoring,
  execution-interval control, and event-reception jobs is within `1..1440` and
  is not effective where version 13 disables it in a start-condition context.

### Execution-Interval Control

- `JP1-PARAM-INTERVAL-CONTROL-RANGE-001`: explicit `tmitv` is within `1..1440`
  and explicit `etn` is in `{y|n}`.
- `JP1-PARAM-INTERVAL-CONTROL-END-CONTEXT-001`: explicit `etn=y` follows the
  documented execution-interval and start-condition context restriction.

### Shared String And Transfer-File Forms

- `JP1-PARAM-STRING-FAMILY-CONSTRAINT-001`: filename-like and host-like values
  stay within the byte-length and combination rules documented for their
  parameter family.
- `JP1-PARAM-TRANSFER-FILE-FORM-001`: explicit `tsN` and `tdN` for supported
  UNIX/PC, custom, QUEUE, and recovery QUEUE jobs use a quoted transfer-file
  value or an accepted macro-variable form rather than an unsupported bare
  string.
- `JP1-PARAM-TRANSFER-FILE-PATH-001`: quoted `tsN` and `tdN` values follow the
  shared JP1/AJS3 version 13 filename and path constraints for the supported
  transfer-file families.
- `JP1-PARAM-STRING-MACRO-ALLOWANCE-001`: a value is not invalid merely because
  it uses a macro-variable or regular-expression form explicitly allowed by its
  parameter family.

Compatible-ISAM-specific interpretation is outside this repository's supported
contract because compatible ISAM is limited to legacy migration environments
that the extension does not model explicitly.

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
