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

## Acceptance Notes

- copying and saving produce the same CSV payload for the same visible table
  state
- hidden columns are not exported
- desktop and web viewers can request the same CSV payload shape before their
  platform-specific save/copy steps

## Risks Or Edge Cases

- multi-line parameter values and embedded quotes must remain escaped exactly as
  current users expect
- the current implementation depends on React Table structures, so extracting a
  stable export input DTO must avoid accidental column-order regressions
