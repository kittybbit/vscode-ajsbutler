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

## Acceptance Notes

- the same selected unit shows the same raw parameter text in table and flow
  views
- command text remains based on the selected unit absolute path
- opening the dialog does not change current flow-navigation behavior

## Risks Or Edge Cases

- raw parameter text must preserve the current key/value ordering expected by
  users
- legacy wrapper-only semantics may still be needed elsewhere, so this slice
  should extract dialog content without forcing a broader table or flow rewrite
