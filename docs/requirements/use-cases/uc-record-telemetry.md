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

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Record telemetry

Scenario: Activation and deactivation events are submitted
  Given the extension activates or deactivates
  When telemetry is recorded through the application-facing contract
  Then the existing lifecycle event is submitted through the adapter

Scenario: Preview and webview operation events are submitted
  Given a preview command or webview-originated operation occurs
  When telemetry is recorded through the application-facing contract
  Then the existing event name and basic payload behavior are preserved

Scenario: Telemetry payload remains privacy-conscious
  Given telemetry event payload properties
  When an event is submitted
  Then file content, file paths, and personal identifiers are not added
```

## Acceptance Notes

- desktop and web entry points share the same telemetry contract

## Risks Or Edge Cases

- browser execution still depends on the current telemetry SDK package behavior
- lifecycle cleanup must continue to dispose the telemetry adapter correctly
