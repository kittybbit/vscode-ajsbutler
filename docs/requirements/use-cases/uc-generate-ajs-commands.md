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

- generated `ajs` command text or structured command-generation results

## Rules

- JP1/Automatic Job Management System 3 version 13 Command Reference is the
  normative source for generated command behavior
- command generation must be isolated from view-specific dialog assembly so it
  can be reused outside `buildUnitDefinition.ts`
- generation logic should depend on stable application-facing data instead of
  webview component state

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
