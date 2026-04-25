# TASKS: show-unit-definition

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Review use case: docs/requirements/use-cases/uc-show-unit-definition.md
- [x] Implement application DTO for unit-definition dialog content
- [x] Share normalized dialog DTO mapping between table and flow viewers
- [x] Cover table and flow dialog trigger paths

## Follow-up

- [ ] None.

## Notes

- 2026-04-11: table and flow viewers now share the same normalized
  `absolutePath -> UnitDefinitionDialogDto` mapping path.
- 2026-04-11: automated verification now covers both dialog trigger paths:
  table actions forward the selected `absolutePath`, flow-node actions open the
  shared `UnitDefinitionDialogDto`, and existing DTO mapping tests preserve the
  dialog content itself.
