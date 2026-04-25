# SPECS: normalize-ajs-document

## Purpose

Define normalized AJS document construction and shared semantics between
wrappers and application-facing DTO paths.

## Origin

Source use case: docs/requirements/use-cases/uc-normalize-ajs-document.md

## Acceptance Criteria

- Normalization consumes parsed AJS data and produces stable domain DTOs.
- Shared JP1/AJS semantics are centralized only when reused across wrappers
  and normalized paths.
- Unit-local semantics remain on their owning wrappers.

## Implementation Notes

- Prefer `interface + helper` for cross-unit JP1/AJS capabilities.
- Keep unit-local semantics on the owning wrapper when they do not span
  multiple wrapper families.
- After `WaitableUnit`, `PrioritizableUnit`, `G`, and `N`, treat remaining
  wrapper members as typed parameter-access surfaces unless a new cross-unit
  rule or clearly unit-local behavior is identified.
- Do not extract additional normalized-model helpers unless the same wrapper
  rule is still duplicated across multiple normalized or application paths.
- Keep `UnitEntity` focused on stable base-wrapper concerns, not debug helpers
  or dead compatibility APIs.
- Treat `UnitEntity` as the owner of wrapper identity and tree mechanics:
  deterministic ID derivation, absolute path, parent/ancestor/child links,
  raw unit metadata, and common JP1 getters such as `ty`, `cm`, `el`, and `sz`.
- Do not move constructor-bound identity logic or basic tree traversal out of
  `UnitEntity` unless multiple consumers require a separate abstraction with
  real semantic value.
