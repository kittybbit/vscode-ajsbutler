# UC: Present Semantic Diff Report

## Goal

Present a semantic comparison as reviewable Markdown, show its rationale and
limitations, and let the user copy it explicitly.

## Trigger

- semantic comparison completes and a user-facing report is requested
- the user requests copying from the displayed report

## Inputs

- semantic change set, identity decisions, confirmation-required items,
  unsupported or uncalculated information, and comparison constraints
- report language derived from the host display language

## Outputs

- localized Markdown suitable for pull requests, change-control records, and
  release approval material
- displayed report surface in VS Code
- copied Markdown only after an explicit user action

## Rules

- Markdown preserves enough rationale to review identity decisions, changes,
  confirmation-required items, unsupported data, and limitations
- report headings, labels, summaries, rationale, schedule sections,
  confirmation wording, limitation notes, and empty states use the selected
  report language
- semantic identifiers, paths, parameter keys, and raw JP1/AJS values are not
  translated
- unsupported report languages fall back to English
- the report includes the schedule comparison period when schedule comparison
  was requested
- report presentation does not change semantic comparison meaning
- completing comparison displays the report before any copy action
- completion never overwrites the clipboard implicitly
- copying Markdown is an explicit user action from the displayed report
- standard VS Code editor, document, command, and menu surfaces are preferred
  while they satisfy the report workflow
- desktop and web hosts consume the same semantic report data through
  host-appropriate presentation adapters

## Behavioral Scenarios

```gherkin
Feature: Present semantic diff report

Scenario: Report is displayed before explicit copy
  Given semantic diff results have been rendered as Markdown
  When report generation completes
  Then the report is displayed in VS Code
  And the clipboard remains unchanged
  When the user requests Markdown copy from the report
  Then the displayed Markdown is copied to the clipboard

Scenario: Japanese display language produces a Japanese report
  Given the host display language is Japanese
  When the semantic diff report is generated
  Then headings, labels, changes, rationale, limitations, confirmation items,
    schedule wording, and empty states are in Japanese
  And identifiers, paths, parameter keys, and raw JP1/AJS values are unchanged

Scenario: Unsupported report language falls back to English
  Given the host display language has no supported report localization
  When the semantic diff report is generated
  Then report wording uses English

Scenario: Unsupported and uncalculated areas remain visible
  Given semantic diff results contain unsupported or uncalculated information
  When the report is generated
  Then each affected area and its reason are included

Scenario: Empty comparison remains explicit
  Given semantic diff finds no semantic changes
  When the report is generated
  Then the localized empty state states that no semantic changes were found
```

## Acceptance Notes

- report localization remains a presentation concern and does not alter
  comparison data
- copy behavior remains discoverable without making clipboard mutation an
  implicit side effect

## Risks Or Edge Cases

- omitting rationale or limitations can make a technically correct report
  unsafe for review decisions
- raw identifiers or values can be corrupted if they are passed through
  translation
- host-specific display or clipboard failure must not change the semantic
  comparison result
