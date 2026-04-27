# UC: Export Unit List CSV

## Goal

Convert visible unit-list data into CSV text without coupling CSV generation to
React table internals or webview event handling.

## Trigger

- the user copies unit-list data as CSV
- the user saves unit-list data as CSV

## Inputs

- the visible unit-list rows to export
- the visible column definitions in display order

## Outputs

- CSV text ready for clipboard copy or save

## Rules

- CSV generation belongs to an application-facing use case rather than a React
  component
- export logic must not depend on VS Code APIs, clipboard APIs, or save-dialog
  APIs
- CSV escaping and column ordering must preserve current user-visible behavior

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Export unit list CSV

Scenario: Copy and save produce the same CSV payload
  Given the same visible unit-list rows and visible columns
  When CSV text is requested for copy and save operations
  Then both operations receive the same CSV payload

Scenario: Hidden columns are excluded
  Given visible unit-list rows with hidden columns
  When CSV text is generated
  Then hidden columns are not included in the CSV output

Scenario: Escaped values preserve current CSV behavior
  Given visible unit-list rows containing quotes or multi-line values
  When CSV text is generated
  Then embedded quotes and line breaks are escaped as users expect
```

## Acceptance Notes

- desktop and web viewers can request the same CSV payload shape before their
  platform-specific save/copy steps

## Risks Or Edge Cases

- the current implementation depends on React Table structures, so extracting a
  stable export input DTO must avoid accidental column-order regressions
