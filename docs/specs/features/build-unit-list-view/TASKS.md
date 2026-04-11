# TASKS: build-unit-list-view

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-build-unit-list-view.md
- [x] Confirm SPECS.md
- [x] Implement `BuildUnitListView` and migrate table column groups to
      application view data
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [x] Replace `UnitEntity` as the primary table row type in
      presentation
- [x] Update CSV export and table filtering paths to consume
      application-facing row data directly
- [ ] Record a current manual smoke-test result for desktop and
      web viewers in docs
