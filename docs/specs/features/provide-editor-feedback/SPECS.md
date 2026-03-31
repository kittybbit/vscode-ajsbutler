# UC: Provide Editor Feedback

## Goal

Provide diagnostics and hover information for JP1/AJS documents without
embedding VS Code object construction inside parser-adjacent business logic.

## Trigger

- a JP1/AJS document is opened or changed
- the user requests hover information over a JP1/AJS token

## Inputs

- raw JP1/AJS document text
- current editor language for localized hover content
- hovered token text

## Outputs

- application-level diagnostic DTOs with positions and messages
- application-level hover DTOs with symbol and syntax information

## Rules

- domain and application layers must not construct `vscode.Diagnostic`,
  `vscode.Hover`, `vscode.Range`, or `vscode.MarkdownString`
- VS Code adapters map DTOs into editor-specific objects
- existing diagnostic messages and hover syntax content must remain unchanged

## Acceptance Notes

- invalid JP1/AJS text still produces diagnostics in the editor
- parameter hover still shows the same syntax information as before
- desktop and web extension entry points continue to share the same
  application logic for diagnostics and hover decisions

## Risks Or Edge Cases

- parser error positions must remain 1-based in application DTOs until
  the VS Code adapter maps them to 0-based positions
- hover behavior still depends on the active UI language passed in from
  the VS Code environment
