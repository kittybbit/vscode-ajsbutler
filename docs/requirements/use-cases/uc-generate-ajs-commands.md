# UC: Generate AJS Commands

## Goal

Generate JP1/AJS command text for a selected scope by using a dedicated,
reference-aligned command-generation contract instead of embedding that logic
inside one presentation-specific builder.

## Trigger

- a user requests command text for a selected unit or scope
- another feature needs JP1/AJS command text derived from the current
  definition context

## Inputs

- selected unit or scope identity
- normalized or equivalent application-facing definition data
- JP1/Automatic Job Management System 3 version 13 command rules

## Outputs

- generated `ajs` command text
- structured command builder definitions for presentation surfaces that allow
  users to choose supported command options

## Rules

- JP1/Automatic Job Management System 3 version 13 Command Reference is the
  normative source for generated command behavior
- command generation must be isolated from view-specific dialog assembly so it
  can be reused outside `buildUnitDefinition.ts`
- generation logic should depend on stable application-facing data instead of
  webview component state
- command builder labels and descriptions should keep stable text keys so a
  later i18n layer can translate the presentation without changing command
  semantics
- command reference links should follow the active UI language when a
  language-specific JP1/AJS manual URL is known

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Generate AJS commands

Scenario: Selected scope produces command text
  Given a selected JP1/AJS unit or scope
  And application-facing definition data for that context
  When command text is generated
  Then generated JP1/AJS command text is returned for the selected scope

Scenario: Default command text is preserved
  Given a selected scope supported by existing ajsshow and ajsprint behavior
  When command text is generated
  Then the default ajsshow and ajsprint command text remains unchanged

Scenario: Presentation surfaces receive structured builder definitions
  Given supported command options for a selected scope
  When command builder definitions are requested
  Then presentation surfaces receive structured command option definitions
```

## Acceptance Notes

- command-generation behavior can be tested without opening a viewer dialog
- show-unit-definition and other consumers can obtain command text through the
  same dedicated contract
- command support can expand incrementally across documented JP1/AJS commands
  without rewriting the consumer surface each time

## Risks Or Edge Cases

- some commands may require context not currently present in existing DTOs
- command options can vary by platform or deployment mode
- preserving current user-visible command text while broadening supported
  commands may require explicit compatibility notes
