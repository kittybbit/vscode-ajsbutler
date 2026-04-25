# SPECS: build-unit-list

## Purpose

Define the application use case that builds a normalized unit list independent
of table presentation details.

## Origin

Source use case: docs/requirements/use-cases/uc-build-unit-list.md

## Acceptance Criteria

- Unit-list construction consumes normalized AJS data.
- The use case remains independent of VS Code APIs and UI frameworks.
- Tests preserve normal and edge-case unit traversal behavior.

## Implementation Notes

- Keep current table search presentation-local unless another consumer needs
  shared query semantics.
