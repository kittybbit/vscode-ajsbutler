# UC: Normalize AJS Document

## Goal

Convert parsed JP1/AJS definitions into a stable normalized model that is
independent from parser tree mechanics, VS Code APIs, and UI-library types.

## Trigger

- an application use case needs stable unit and dependency semantics
- parsed raw `Unit` trees must be interpreted consistently across multiple
  use cases

## Inputs

- parsed raw `Unit` root tree
- current interpreter/wrapper semantics derived from `UnitEntity` classes

## Outputs

- `AjsDocument`
- `AjsUnit`
- `AjsRelation`
- optional normalization warnings

## Rules

- raw `Unit` remains the parser-adjacent model
- `UnitEntity` wrappers remain interpreter helpers during migration, but are not
  the final application-facing model
- normalized model names should reflect product concepts, not wrapper class
  names such as `G`, `N`, or `Rc`
- normalized output must be deterministic and suitable for unit list, flow
  graph, CSV, and future reuse

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Normalize AJS document

Scenario: Parsed units become deterministic normalized units
  Given a parsed raw Unit root tree
  When the AJS document is normalized
  Then normalized units are produced with deterministic identity and structure

Scenario: Common navigation semantics are reusable
  Given a normalized AJS document with nested units
  When parent, ancestor, or root jobnet lookup is requested
  Then the normalized model provides reusable navigation semantics

Scenario: Shared parameter lookup stays consistent
  Given a normalized AJS document with inherited parameter values
  When direct, repeated, or first-ancestor parameter lookup is requested
  Then consumers receive consistent parameter semantics
```

## Acceptance Notes

- `BuildUnitList` can derive its DTOs from the normalized model
- `BuildFlowGraph` can derive its graph inputs from the normalized model
- remaining wrapper-derived semantics should move into the normalized model
  only when the same rule is still duplicated across multiple normalized or
  application consumers
- user-visible behavior remains unchanged while use cases stop depending on raw
  or wrapper-oriented structures directly
- normalization tests should prefer shared fixtures in `sample/` for UTF-8,
  Shift_JIS, and large-definition regression coverage

## Risks Or Edge Cases

- semantic mismatches can appear if wrapper-derived behaviors such as root
  jobnet detection or dependency interpretation are not preserved exactly
- normalization should capture enough metadata for current safe consumers
  without overcommitting to all future semantics at once
- encoding-sensitive regressions can be missed if only inline UTF-8 snippets
  are used in tests
