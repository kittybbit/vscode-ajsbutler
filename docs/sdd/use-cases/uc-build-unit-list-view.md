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

## Acceptance Notes

- table view still renders the same visible rows and unit-ordering for the same
  input document
- dialog opening, jump behavior, and CSV export continue to work from the new
  row/view adapter path
- desktop and web viewers consume the same row/view model shape

## Risks Or Edge Cases

- current column groups derive many values through `UnitEntity.params(...)`, so
  moving all columns at once is high risk
- some display behaviors may still depend on wrapper-derived semantics until
  those are made explicit in the normalized model or application view adapter
