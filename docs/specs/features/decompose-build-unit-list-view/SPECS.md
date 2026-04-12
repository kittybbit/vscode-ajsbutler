# SPECS: decompose-build-unit-list-view

## Purpose

Reduce the structural risk of
`src/application/unit-list/buildUnitListView.ts` without changing
`UnitListRowView` behavior.

## Origin

This is a behavior-preserving refactor slice under the existing
`build-unit-list-view` feature, not a new end-user use case.

## Acceptance Criteria

- `buildUnitListView(document)` returns the same `UnitListRowView[]`
  shape and values for existing desktop and web extension consumers.
- Table rendering and CSV export can keep consuming the current row/group DTO
  contract without call-site changes.
- Refactoring proceeds in small slices that keep tests readable and localized.
- Extracted helpers stay in the application layer and do not introduce
  `vscode` dependencies or parser-internal coupling.
- Existing schedule-oriented table shaping may remain presentation-facing;
  this slice does not force those semantics into domain normalization.

## Implementation Notes

- Prefer extracting coherent projection helpers over moving fields by
  arbitrary line count.
- Keep `buildUnitListView.ts` as the stable entry point while moving
  internal projection logic into focused modules.
- Start with the areas already identified as safe extractions:
  calendar projection, priority projection, and schedule projection.
- Preserve the current `UnitListRowView` group numbering and property names.
- Avoid combining this refactor with new table features, CSV behavior changes,
  or normalized model redesign.

## Candidate Projection Families

1. Row-level shared context and linked-unit projection
2. Calendar projection for `group6`
3. Priority projection for `group7` and `group11`
4. Schedule projection for `group10`
5. Remaining group projection families grouped by stable DTO concern

## Initial Non-Goals

- Redesigning `UnitListRowView` or table column groups
- Moving schedule value parsing into domain normalization
- Introducing a new application use case for filtering/search
- Changing VS Code compatibility requirements
