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

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Provide editor feedback

Scenario: Invalid JP1/AJS text produces diagnostics
  Given a JP1/AJS document containing invalid syntax
  When editor feedback is requested
  Then application-level diagnostic DTOs are returned

Scenario: Parameter hover returns syntax information
  Given a JP1/AJS document with a recognized parameter token
  When hover information is requested for that token
  Then application-level hover DTOs include the same syntax information

Scenario: VS Code objects stay outside application output
  Given JP1/AJS editor feedback output
  When diagnostics and hover data are produced
  Then the application output does not construct VS Code API objects
```

## Acceptance Notes

- desktop and web extension entry points continue to share the same
  application logic for diagnostics and hover decisions

## Risks Or Edge Cases

- parser error positions must remain 1-based in application DTOs until
  the VS Code adapter maps them to 0-based positions
- hover behavior still depends on the active UI language passed in from
  the VS Code environment
