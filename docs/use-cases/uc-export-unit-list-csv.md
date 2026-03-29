# UC: Export Unit List CSV

## Goal

Export the currently relevant unit list as CSV.

## Trigger

The user requests CSV export for the current unit list context.

## Inputs

- normalized unit rows
- selected columns
- current filter context if applicable

## Outputs

- CSV text or stream-ready content

## Rules

- CSV generation belongs to application or infrastructure boundary, not UI rendering
- output must be deterministic
- escaping rules must be tested

## Acceptance Notes

- the same visible unit list state produces the same CSV content
- exported data is independent from React, VS Code, or webview component types

## Risks Or Edge Cases

- delimiters, quotes, and line breaks must be escaped consistently
- filtered or reordered columns must preserve the intended exported shape
