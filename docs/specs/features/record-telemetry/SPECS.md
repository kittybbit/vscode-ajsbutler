# SPECS: record-telemetry

## Purpose

Define telemetry behavior through an application-facing port.

## Origin

Source use case: docs/requirements/use-cases/uc-record-telemetry.md

## Acceptance Criteria

- Telemetry is optional and fails safely through a noop fallback.
- Events do not include file content, file paths, or personal identifiers.
- Desktop and browser paths use the same port contract where practical.

## Implementation Notes

- Keep VS Code telemetry APIs behind extension/infrastructure adapters.
