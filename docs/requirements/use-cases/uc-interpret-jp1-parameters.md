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

## Acceptance Notes

- parameter parsing behavior is described against one named product version
- shared consumers can reuse the same parameter interpretation results instead
  of re-deriving semantics ad hoc
- existing behavior can be preserved incrementally while mismatches against the
  chosen manual are made explicit and corrected in focused slices

## Risks Or Edge Cases

- the current implementation might rely on wrapper-specific shortcuts that do
  not map cleanly to the manual wording
- some manual rules can be context-sensitive by unit type, inheritance, or
  schedule-rule alignment
- version-specific manual behavior must remain visible in docs so future
  upgrades do not silently reinterpret parameters
