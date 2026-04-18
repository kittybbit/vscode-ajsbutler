# TASKS: align-jp1-v13-parameter-and-command-reference

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Record JP1/AJS3 version 13 as the target reference for parameter parsing
      and command generation
- [x] Record that command generation should be separated from
      `buildUnitDefinition.ts`

## Remaining Follow-up

- [ ] Inventory current parameter semantics that already match the version 13
      definition reference
- [ ] Inventory current command-generation behavior and its coupling to
      show-unit-definition
- [ ] Decide the first supported set of auto-generated `ajs` commands
- [ ] Define how manual mismatches are tracked and closed incrementally

## Notes

- 2026-04-18: normative parameter and command sources were fixed to the user
  supplied JP1/AJS3 version 13 reference documents.
