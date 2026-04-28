# UC: Interpret JP1 Parameters

## Goal

Interpret JP1/AJS parameters in a way that is explicitly aligned with the
target product reference so multiple features can rely on the same semantics.

## Trigger

- an application or presentation path needs parameter syntax, defaults,
  inheritance, or value interpretation
- a feature needs parameter information for display, validation, navigation,
  or command generation

## Inputs

- parsed or normalized unit parameter data
- the target JP1/Automatic Job Management System 3 version 13 parameter rules

## Outputs

- reusable parameter interpretation results
- stable metadata that downstream features can use without depending directly
  on one-off manual parsing logic

## Rules

- JP1/Automatic Job Management System 3 version 13 Definition File Reference is
  the normative source for parameter interpretation
- interpretation logic should be reusable across hover, unit definition,
  flow/list presentation, and future import or generation features when they
  need the same rule
- manual-aligned semantics should not be duplicated independently in multiple
  viewers or adapters

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Interpret JP1 parameters

Scenario: Parameter interpretation follows the named product version
  Given parsed or normalized JP1/AJS parameter data
  And JP1/AJS3 version 13 parameter rules
  When parameter interpretation is requested
  Then results are described against JP1/AJS3 version 13 semantics

Scenario: Shared consumers reuse interpretation results
  Given parameter interpretation results for a JP1/AJS unit
  When hover, unit definition, flow, or list presentation needs the same rule
  Then consumers reuse the shared interpretation instead of re-deriving it

Scenario: Context-sensitive rules remain explicit
  Given a parameter rule that depends on unit type, inheritance, or schedule
  When the parameter is interpreted
  Then the context that affects the result is visible in the interpretation

Scenario: Unit-specific defaults are applied only in their documented context
  Given a JP1/AJS parameter default that differs by unit family
  When the parameter is interpreted for a specific unit type
  Then only the documented unit family receives that default
  And other unit families keep their documented behavior
```

## Acceptance Notes

- existing behavior can be preserved incrementally while mismatches against the
  chosen manual are made explicit and corrected in focused slices

## Risks Or Edge Cases

- the current implementation might rely on wrapper-specific shortcuts that do
  not map cleanly to the manual wording
- some manual rules can be context-sensitive by unit type, inheritance, or
  schedule-rule alignment
- version-specific manual behavior must remain visible in docs so future
  upgrades do not silently reinterpret parameters
