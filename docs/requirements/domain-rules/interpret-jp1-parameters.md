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
