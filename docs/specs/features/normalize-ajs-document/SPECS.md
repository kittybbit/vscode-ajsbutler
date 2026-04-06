# SPECS: normalize-ajs-document

## Purpose

Implement the use case: UC: Normalize AJS Document.

## Origin

Source use case: docs/requirements/use-cases/uc-normalize-ajs-document.md

## Acceptance Criteria

- All criteria in the source use case are satisfied.
- Behavior is stable across desktop/web builds.
- Tests cover normal and edge cases.

## Implementation Notes

- Keep domain/application/infrastructure boundaries clear.
- Avoid direct vscode imports in domain layers.
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
