# UC: Record Telemetry

## Goal

Record existing extension telemetry events through a narrow contract without
exposing telemetry SDK types outside the outer adapter layer.

## Trigger

- extension activation and deactivation
- preview commands for table and flow views
- webview-originated operation tracking

## Inputs

- event name
- existing string payload properties for the event

## Outputs

- telemetry event submission through an adapter implementation
- no SDK-specific types outside the telemetry adapter

## Rules

- application-facing callers depend on a small telemetry port only
- event names and basic payload behavior stay unchanged in this refactor
- telemetry scope must remain minimal and privacy-conscious

## Acceptance Notes

- activation and deactivation events still fire
- existing preview and webview operation telemetry still fires
- desktop and web entry points share the same telemetry contract

## Risks Or Edge Cases

- browser execution still depends on the current telemetry SDK package behavior
- lifecycle cleanup must continue to dispose the telemetry adapter correctly
