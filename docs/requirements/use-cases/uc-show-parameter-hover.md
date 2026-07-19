# UC: Show Parameter Hover

## Goal

Show localized JP1/AJS syntax and parameter meaning when the user hovers over a
recognized token.

## Trigger

- the user requests hover information over a JP1/AJS token

## Inputs

- hovered token and its definition context
- current editor language
- shared parameter interpretation metadata when the token has supported
  semantic meaning

## Outputs

- application-facing hover content containing symbol, syntax, and supported
  parameter information

## Rules

- application output remains independent of `vscode.Hover`, `vscode.Range`,
  `vscode.MarkdownString`, and other VS Code API objects
- the VS Code adapter maps application hover content into editor objects
- existing recognized-token syntax content remains unchanged
- localized content uses the current editor language supplied by the host
- shared parameter meaning comes from
  [Interpret JP1 Parameters](../domain-rules/interpret-jp1-parameters.md)
- hover presentation does not redefine defaults, ranges, dependencies, or
  contextual validity
- desktop and web entry points share the same hover decisions

## Behavioral Scenarios

```gherkin
Feature: Show parameter hover

Scenario: Recognized parameter returns syntax information
  Given a JP1/AJS definition with a recognized parameter token
  When hover information is requested for that token
  Then application-facing hover content includes the existing syntax information

Scenario: Parameter meaning uses the shared interpretation
  Given a recognized token governed by a supported JP1-PARAM rule
  When hover information includes semantic meaning
  Then it uses the shared interpretation instead of deriving another rule

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
- semantic hover wording must not drift from the normative parameter rule
