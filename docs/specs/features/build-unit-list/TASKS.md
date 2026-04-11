# TASKS: build-unit-list

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-build-unit-list.md
- [x] Confirm SPECS.md
- [x] Implement `BuildUnitList` on top of normalized AJS inputs
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [x] Decide whether filtering/search should become a separate application use case

## Notes

- 2026-04-11: keep filtering/search in presentation for now. The current
  behavior depends on TanStack Table row access, presentation column accessors,
  and `rankItem`-based fuzzy matching over rendered row values rather than on a
  stable cross-surface application rule.
- Revisit a dedicated application use case only if filtering/search needs to be
  shared across table, CSV, commands, or another non-table consumer.
- Fixture guidance and manual verification notes are maintenance concerns.
  Keep them current when that evidence changes, but do not track them as an
  always-open slice task.
