# UC: Build Unit List

## Goal

Parse JP1/AJS definitions and return a stable unit-list document DTO for table
presentation without exposing parser-adjacent structures to the UI.

## Trigger

- the user opens or refreshes the JP1/AJS table viewer
- another application slice needs deterministic unit-list-oriented document data

## Inputs

- raw JP1/AJS document text

## Outputs

- `UnitListDocumentDto` containing root units and nested children
- parser errors when the source is invalid

## Rules

- parsing stays behind the use case boundary
- the returned DTO must not expose raw `Unit`, `UnitEntity`, or webview-specific
  types
- normalized AJS semantics should be reused when practical so list and flow
  slices share the same business interpretation

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Build unit list

Scenario: Valid JP1/AJS input produces deterministic unit-list data
  Given valid JP1/AJS document text
  When the unit-list document DTO is built
  Then root units and nested children are returned in deterministic order

Scenario: Invalid JP1/AJS input reports parser errors
  Given invalid JP1/AJS document text
  When the unit-list document DTO is built
  Then parser errors are returned without constructing a partial UI document

Scenario: Encoded sample definitions remain supported
  Given a representative UTF-8 or Shift_JIS JP1/AJS sample definition
  When the unit-list document DTO is built
  Then the output preserves the expected unit-list content

Scenario: Start-condition monitoring projection uses effective schedule pairs
  Given a jobnet schedule rule has paired start-condition monitoring values
  When either the `wc` count or `wt` time disables monitoring for that pair
  Then the unit-list schedule definition output shows empty effective values
  for both start-condition monitoring columns
```

## Acceptance Notes

- desktop and web table viewers can consume the same DTO shape
- representative fixtures in `sample/` should be reusable for regression tests,
  especially UTF-8, Shift_JIS, and large-definition coverage
- raw parameter preservation and effective schedule-rule display can differ
  when the JP1/AJS3 reference defines cross-parameter interpretation

## Risks Or Edge Cases

- normalization can drift from legacy wrapper semantics if unit attributes or
  parameters are mapped inconsistently
- large definitions must continue to build list DTOs without introducing
  presentation-specific filtering behavior into the use case
