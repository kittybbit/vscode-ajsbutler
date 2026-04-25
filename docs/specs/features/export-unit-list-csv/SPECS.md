# SPECS: export-unit-list-csv

## Purpose

Define CSV export behavior for unit-list view data.

## Origin

Source use case: docs/requirements/use-cases/uc-export-unit-list-csv.md

## Acceptance Criteria

- CSV export consumes application-facing row data.
- Escaping and value formatting remain stable.
- Desktop and web save/copy paths preserve current behavior.

## Implementation Notes

- Keep file-system or clipboard behavior near extension/presentation
  adapters.
