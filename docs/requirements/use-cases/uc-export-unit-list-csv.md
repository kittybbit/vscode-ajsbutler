# UC: Export Unit List CSV

## Goal

Convert visible unit-list data into CSV text that desktop and web hosts can copy
or save without changing its contents.

## Trigger

- the user copies unit-list data as CSV
- the user saves unit-list data as CSV

## Inputs

- the visible unit-list rows to export
- the visible column definitions in display order

## Outputs

- CSV text ready for clipboard copy or save

## Rules

- CSV generation uses stable application-facing rows and visible-column
  metadata
- export logic remains independent of host clipboard and save mechanisms
- CSV escaping and column ordering must preserve current user-visible behavior
- export input does not expose parser-adjacent, presentation-framework, or
  host-specific objects

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
- automated regression coverage should preserve escaping rules, visible-column
  behavior, and application-row input shape

## Risks Or Edge Cases

- column-order or visibility drift can change the exported payload even when
  the underlying unit data is unchanged
