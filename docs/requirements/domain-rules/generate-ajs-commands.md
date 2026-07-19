# Domain Rule: Generate AJS Commands

## Purpose

Generate JP1/AJS command text from stable application-facing definition context
through one reference-aligned contract.

## Applies When

- unit-definition presentation needs command text for a selected unit or scope
- another approved workflow needs the same command semantics

## Inputs

- selected unit or scope identity
- normalized or equivalent application-facing definition data
- JP1/Automatic Job Management System 3 version 13 command rules

## Outputs

- generated `ajs` command text
- structured command option definitions for presentation surfaces that allow
  users to choose supported options

## Rules

- JP1/Automatic Job Management System 3 version 13 Command Reference is the
  normative source for generated command behavior
- generation depends on stable application-facing data, not view state or
  dialog assembly
- command option labels and descriptions use stable text keys so localization
  does not change command semantics
- command reference links follow the active UI language when a supported
  language-specific manual URL is known
- command generation remains a shared domain capability until an independent
  user-triggered command workflow is introduced and approved

## Behavioral Scenarios

```gherkin
Feature: Generate AJS commands

Scenario: Selected scope produces command text
  Given a selected JP1/AJS unit or scope
  And stable definition data for that context
  When command text is generated
  Then JP1/AJS command text is returned for the selected scope

Scenario: Default command text is preserved
  Given a selected scope supported by existing ajsshow and ajsprint behavior
  When command text is generated
  Then the default ajsshow and ajsprint command text remains unchanged

Scenario: Presentation receives structured command options
  Given supported command options for a selected scope
  When command option definitions are requested
  Then structured option definitions are returned without view-specific state
```

## Acceptance Notes

- command behavior can be validated independently of a viewer dialog
- unit-definition display and future approved consumers use the same command
  contract

## Risks Or Edge Cases

- some commands require context not present in existing application data
- command options can vary by platform or deployment mode
- broadening supported commands requires explicit compatibility review
