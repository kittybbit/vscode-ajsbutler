# UC: Show Unit Definition

## Goal

Show unit-definition details and command text for a selected JP1/AJS unit
without coupling the dialog content directly to parser-adjacent wrapper
objects.

## Trigger

- the user clicks the unit-definition action in the table view
- the user clicks the unit-definition action in the flow view

## Inputs

- selected unit identity
- normalized unit data needed to render raw parameter text and command text

## Outputs

- dialog DTO containing raw parameter text
- dialog DTO containing command text derived from the selected unit path

## Rules

- the dialog input should not require `UnitEntity` or other wrapper-specific
  objects when a stable application DTO is sufficient
- table and flow views should be able to open the same definition content for
  the same selected unit
- platform-specific dialog rendering stays in presentation code

## Behavioral Scenarios (Gherkin)

```gherkin
Feature: Show unit definition

Scenario: Table and flow views show the same unit definition
  Given the same selected JP1/AJS unit in table and flow contexts
  When unit-definition details are requested
  Then both viewers receive the same raw parameter text

Scenario: Command text uses the selected unit path
  Given a selected JP1/AJS unit with an absolute path
  When unit-definition details are requested
  Then command text is derived from that selected unit path

Scenario: Opening definition details preserves flow navigation
  Given a selected unit in the flow view
  When unit-definition details are opened
  Then current flow-navigation behavior is unchanged
```

## Acceptance Notes

- unit-definition dialog content can be extracted without forcing a broader
  table or flow rewrite

## Risks Or Edge Cases

- raw parameter text must preserve the current key/value ordering expected by
  users
- legacy wrapper-only semantics may still be needed elsewhere, so this slice
  should extract dialog content without forcing a broader table or flow rewrite
