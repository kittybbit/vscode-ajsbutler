# UC: Build Unit List

## Goal

Produce a stable tabular representation of AJS units from a definition file.

## Trigger

The user opens or refreshes a unit-list-oriented view of an AJS definition.

## Inputs

- raw AJS definition text

## Outputs

- list of normalized unit rows
- column metadata if needed

## Rules

- output should not depend on React or VS Code APIs
- output should not expose parser-internal structures directly
- filtering and sorting should be separable concerns

## Acceptance Notes

- same input produces deterministic rows
- malformed sections are handled predictably
- unit list can be consumed by desktop and web UI

## Risks Or Edge Cases

- large definitions should not require UI concerns to leak into list-building logic
