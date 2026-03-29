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

## Acceptance Notes

- valid JP1/AJS input produces deterministic root-unit ordering and nested unit
  content
- invalid JP1/AJS input reports parser errors without constructing a partial UI
  document
- desktop and web table viewers can consume the same DTO shape

## Risks Or Edge Cases

- normalization can drift from legacy wrapper semantics if unit attributes or
  parameters are mapped inconsistently
- large definitions must continue to build list DTOs without introducing
  presentation-specific filtering behavior into the use case
