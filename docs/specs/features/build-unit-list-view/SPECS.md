# SPECS: build-unit-list-view

## Purpose

Define the table-oriented application view model consumed by list
presentation and CSV export paths.

## Origin

Source use case: docs/requirements/use-cases/uc-build-unit-list-view.md

## Acceptance Criteria

- Table rows consume application view data, not parser or wrapper internals.
- Existing row groups and field names remain stable for presentation and CSV
  consumers.
- Tests preserve row projection behavior across representative unit types.

## Implementation Notes

- Keep UI formatting and TanStack-specific filtering in presentation code.
- Prefer focused projection helpers over widening the coordinator file.
