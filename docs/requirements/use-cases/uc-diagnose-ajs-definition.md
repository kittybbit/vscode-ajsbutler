# UC: Diagnose AJS Definition

## Goal

Continuously identify syntax and supported JP1/AJS semantic violations in an
opened definition and provide precise, host-neutral diagnostic information.

## Trigger

- a JP1/AJS document is opened or changed

## Inputs

- raw JP1/AJS document text
- normalized parameter evidence and source positions when syntax is valid

## Outputs

- diagnostic severity, message, and source position in an application-facing
  form
- syntax diagnostics for invalid source text
- semantic diagnostics for supported parameter-rule violations

## Rules

- application output remains independent of `vscode.Diagnostic`,
  `vscode.Range`, and other VS Code API objects
- the VS Code adapter maps application diagnostics into editor objects
- existing parser syntax messages remain unchanged
- semantic diagnostics preserve raw parsed data and do not rewrite parser
  output
- shared JP1/AJS meaning comes from
  [Interpret JP1 Parameters](../domain-rules/interpret-jp1-parameters.md)
- each supported semantic diagnostic refers to a stable `JP1-PARAM-*` rule ID
  from that contract
- diagnostic positions remain 1-based until a host adapter maps them to the
  coordinate convention required by the editor
- desktop and web entry points share the same diagnostic decisions

## Consumed Domain Rules

- `JP1-PARAM-FILE-MONITOR-CONDITION-001`
- `JP1-PARAM-FILE-MONITOR-OUTPUT-001`
- `JP1-PARAM-RETRY-ABR-DEPENDENCY-001`
- `JP1-PARAM-JOB-END-RANGE-001`
- `JP1-PARAM-JOB-END-THRESHOLD-001`
- `JP1-PARAM-SCHEDULE-RANGE-001`
- `JP1-PARAM-SCHEDULE-WEEKLY-DAY-001`
- `JP1-PARAM-SCHEDULE-START-DATE-001`
- `JP1-PARAM-EVENT-ARRIVAL-HOST-001`
- `JP1-PARAM-EVENT-ARRIVAL-RANGE-001`
- `JP1-PARAM-EVENT-SEND-ID-RANGE-001`
- `JP1-PARAM-EVENT-RECEIVE-SCOPE-001`
- `JP1-PARAM-EVENT-RECEIVE-FORMAT-001`
- `JP1-PARAM-EVENT-RECEIVE-NUMERIC-ID-001`
- `JP1-PARAM-EVENT-RECEIVE-FILTER-001`
- `JP1-PARAM-EVENT-RECEIVE-TIMEOUT-001`
- `JP1-PARAM-EVENT-HOST-LENGTH-001`
- `JP1-PARAM-WAIT-ETS-VALUE-001`
- `JP1-PARAM-WAIT-FD-CONTEXT-001`
- `JP1-PARAM-INTERVAL-CONTROL-RANGE-001`
- `JP1-PARAM-INTERVAL-CONTROL-END-CONTEXT-001`
- `JP1-PARAM-STRING-FAMILY-CONSTRAINT-001`
- `JP1-PARAM-TRANSFER-FILE-FORM-001`
- `JP1-PARAM-TRANSFER-FILE-PATH-001`
- `JP1-PARAM-STRING-MACRO-ALLOWANCE-001`

## Behavioral Scenarios

```gherkin
Feature: Diagnose AJS definition

Scenario: Invalid syntax produces diagnostics
  Given a JP1/AJS definition containing invalid syntax
  When diagnostics are evaluated
  Then application-facing syntax diagnostics are returned

Scenario: A supported semantic violation produces a focused diagnostic
  Given a syntactically valid JP1/AJS definition
  And a parameter violates a supported JP1-PARAM rule
  When diagnostics are evaluated
  Then a diagnostic identifies that semantic violation
  And raw parser output remains available to downstream consumers

Scenario: Allowed explicit forms do not produce false positives
  Given a macro-variable or regular-expression form allowed by its parameter rule
  When diagnostics are evaluated
  Then the value is not rejected merely because it uses that allowed form

Scenario: Application diagnostics remain host neutral
  Given syntax or semantic diagnostics
  When application output is produced
  Then it does not construct VS Code API objects
```

## Supported Semantic Rule Families

Diagnostics cover the rule IDs listed under `Diagnostic Interpretation Rules`
in the shared parameter contract and enumerated above, including:

- file-monitoring conditions and output dependencies
- automatic-retry dependencies, ranges, and threshold ordering
- schedule ranges, weekly-day combinations, and start-date limits
- JP1 event sending and reception formats, ranges, filters, and dependencies
- wait and execution-interval values and start-condition restrictions
- filename-like, host-like, transfer-file, macro-variable, and regular-
  expression forms

## Acceptance Notes

- every violation of a supported diagnostic rule ID is reported without
  changing normalized or raw evidence
- the Use Case does not guarantee diagnostics for every JP1/AJS3 manual rule
- absence of a diagnostic for an unsupported rule does not establish that the
  definition is valid under that rule
- compatible-ISAM-specific diagnostics remain outside the supported scope

## Risks Or Edge Cases

- inaccurate source positions can highlight the wrong parameter
- large or malformed definitions must not cause a partial result to be
  presented as complete diagnostics
- diagnostic text must not become a second normative copy of parameter meaning
