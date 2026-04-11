# TASKS: show-unit-definition

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-show-unit-definition.md
- [x] Confirm SPECS.md
- [x] Implement application DTO for unit-definition dialog content
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [x] Remove any remaining dialog-opening paths that still assume
      wrapper-backed UI state
- [x] Record current verification evidence for table and flow
      dialog behavior

## Notes

- 2026-04-11: table and flow viewers now share the same normalized
  `absolutePath -> UnitDefinitionDialogDto` mapping path.
- 2026-04-11: automated verification now covers both dialog trigger paths:
  table actions forward the selected `absolutePath`, flow-node actions open the
  shared `UnitDefinitionDialogDto`, and existing DTO mapping tests preserve the
  dialog content itself.
