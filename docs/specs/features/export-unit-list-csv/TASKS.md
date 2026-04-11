# TASKS: export-unit-list-csv

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-export-unit-list-csv.md
- [x] Confirm SPECS.md
- [x] Implement `ExportUnitListCsv` use case
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [x] Remove the remaining table-to-CSV dependency on
      `UnitEntity`-typed presentation rows
- [x] Record current verification evidence for CSV export behavior

## Notes

- 2026-04-11: CSV export verification is covered by automated evidence:
  `exportUnitListCsv.test.ts` preserves CSV escaping rules,
  `exportCsvView.test.ts` verifies table-view export values, and the shared
  viewer routing tests cover `copy.csv` and save-message handling.
