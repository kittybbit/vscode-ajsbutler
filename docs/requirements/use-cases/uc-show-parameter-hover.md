# UC: Show Parameter Hover

## Goal

Show localized JP1/AJS syntax and parameter meaning when the user hovers over a
recognized token.

## Trigger

- the user requests hover information over a JP1/AJS token

## Inputs

- hovered token and its definition context
- current editor language

## Outputs

- application-facing hover content containing the symbol and localized syntax

## Rules

- application output remains independent of `vscode.Hover`, `vscode.Range`,
  `vscode.MarkdownString`, and other VS Code API objects
- the VS Code adapter maps application hover content into editor objects
- existing recognized-token syntax content remains unchanged
- localized content uses the current editor language supplied by the host
- current hover has no `JP1-PARAM-*` rule-ID dependency and does not return
  effective values, defaults, ranges, dependencies, or contextual validity
- desktop and web entry points share the same hover decisions

## Behavioral Scenarios

```gherkin
Feature: Show parameter hover

Scenario: Recognized parameter returns syntax information
  Given a JP1/AJS definition with a recognized parameter token
  When hover information is requested for that token
  Then application-facing hover content includes the existing syntax information

Scenario: Hover content follows the editor language
  Given a supported editor language
  When hover information is requested
  Then the returned content uses that localization context

Scenario: Application hover remains host neutral
  Given hover content for a recognized token
  When application output is produced
  Then it does not construct VS Code API objects
```

## Risks Or Edge Cases

- unknown tokens may have no hover content
- missing or unsupported localization falls back according to existing host
  behavior
- adding semantic hover content in the future requires an explicit dependency
  on the applicable domain-rule IDs
