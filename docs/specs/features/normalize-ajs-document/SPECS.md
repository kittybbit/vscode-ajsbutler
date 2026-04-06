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
- Keep `UnitEntity` focused on stable base-wrapper concerns, not debug helpers
  or dead compatibility APIs.
