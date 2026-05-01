# UC: Build Unit List View

## Goal

Project normalized JP1/AJS units into a table-oriented view model that can be
rendered without binding the table presentation directly to `UnitEntity`
wrappers.

## Trigger

- the user opens or refreshes the JP1/AJS table viewer
- the table viewer needs row data, dialog-opening metadata, or export-ready
  values for the current document

## Inputs

- normalized `AjsDocument`
- current localization context where column labels or value formatting depend on
  language

## Outputs

- table row view models with stable row identity and unit metadata
- enough structured values to support table rendering, dialog opening, and CSV
  export without reconstructing wrapper objects in the UI layer

## Rules

- the use case output should not require `UnitEntity`, `tyFactory`, or
  `flattenChildren`
- wrapper-only semantics may still be reused internally during migration, but
  the UI should not depend on wrapper classes directly
- migration should be incremental, starting with the smallest set of columns
  that can move behind a stable row/view adapter
- row groups and field names must remain stable for table rendering and CSV
  export consumers unless a separate behavior change is approved
- table-specific formatting, filtering, and TanStack integration stay in
  presentation code

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Build unit list view

Scenario: Same document produces the same visible rows
  Given a normalized JP1/AJS document
  When table row view models are built
  Then the visible rows and unit ordering match current behavior

Scenario: Row view models support definition actions
  Given table row view models for a normalized JP1/AJS document
  When a viewer requests dialog-opening metadata for a row
  Then the row provides stable unit metadata for that action

Scenario: Desktop and web viewers share the row shape
  Given a normalized JP1/AJS document
  When table row view models are built
  Then desktop and web viewers can consume the same row shape

Scenario: JP1 event sending job arrival-check defaults are projected
  Given a normalized JP1/AJS document with a JP1 event sending job
  When table row view models are built
  Then omitted group 14 arrival-check values display their JP1/AJS defaults
  And explicit group 14 arrival-check values remain visible

Scenario: File monitoring job defaults are projected
  Given a normalized JP1/AJS document with a file monitoring job
  When table row view models are built
  Then omitted group 13 file monitoring values display their JP1/AJS defaults
  And explicit group 13 file monitoring values remain visible

Scenario: Execution-interval control job defaults are projected
  Given a normalized JP1/AJS document with an execution-interval control job
  When table row view models are built
  Then omitted group 13 execution-interval control values display JP1/AJS defaults
  And explicit group 13 execution-interval control values remain visible
```

## Acceptance Notes

- dialog opening, jump behavior, filtering, and CSV export continue to work
  from the application row/view adapter path

## Risks Or Edge Cases

- current column groups derive many values through `UnitEntity.params(...)`, so
  moving all columns at once is high risk
- some display behaviors may still depend on wrapper-derived semantics until
  those are made explicit in the normalized model or application view adapter
