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
