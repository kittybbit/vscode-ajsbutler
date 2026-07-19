# Domain Rule: Normalize AJS Document

## Purpose

Convert parsed JP1/AJS definitions into a stable normalized model that is
independent of parser tree mechanics, VS Code APIs, and UI-library types.

## Applies When

- an application use case needs stable unit and dependency semantics
- parsed definition structures must be interpreted consistently across
  multiple use cases

## Inputs

- parsed JP1/AJS unit structure
- parser-independent source positions when available
- raw parameter values and their unit context

## Outputs

- normalized document, unit, and relation structures
- raw normalized parameter values and interpretation context
- optional normalization warnings

## Rules

- parser-adjacent structures stay outside the normalized contract
- normalized names reflect JP1/AJS product concepts rather than parser,
  wrapper, adapter, or UI class names
- output is deterministic and suitable for the unit list, flow graph, CSV
  export, diagnostics, semantic diff, and future application consumers
- normalized parameters preserve available parser-independent source line,
  column, and length data without inventing positions when source data is absent
- normalization preserves raw values and the context needed for semantic
  interpretation
- [Interpret JP1 Parameters](./interpret-jp1-parameters.md) is the normative
  owner of effective values, defaults, inheritance results, and contextual
  validity
- normalization may expose stable structural navigation such as parent,
  ancestor, child, absolute-path, and root-jobnet relationships
- normalization must not embed presentation formatting or viewer behavior

## Behavioral Scenarios

```gherkin
Feature: Normalize AJS document

Scenario: Parsed units become deterministic normalized units
  Given a parsed JP1/AJS definition
  When the AJS document is normalized
  Then normalized units are produced with deterministic identity and structure

Scenario: Common navigation semantics are reusable
  Given a normalized AJS document with nested units
  When parent, ancestor, or root jobnet lookup is requested
  Then the normalized model provides reusable navigation semantics

Scenario: Parameter evidence remains available for interpretation
  Given parsed parameter values and their unit context
  When the AJS document is normalized
  Then raw values and interpretation context remain available
  And effective values are determined by the parameter interpretation contract
```

## Acceptance Notes

- user-visible behavior remains unchanged when consumers stop depending on
  parser-adjacent structures directly
- representative fixtures should cover UTF-8, Shift_JIS, and large definitions
- new normalized fields should be added only for a concrete shared consumer or
  stable domain meaning

## Risks Or Edge Cases

- relation, path, root-jobnet, or dependency meaning can drift if structural
  semantics are not preserved exactly
- missing source data must remain absent rather than being synthesized
- normalization should not precompute presentation-specific values
