# TASKS: normalize-ajs-document

## Sync Rule

- Update this file in the same commit whenever a durable requirement or
  follow-up decision changes.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Implement normalized AJS document model.
- [x] Move repeated wrapper and normalized-model semantics into shared helpers
      where reuse is real.
- [x] Keep group and jobnet-local JP1/AJS behavior on the owning wrappers.
- [x] Document `UnitEntity` identity and tree responsibilities.
- [x] Reorganize normalization helpers under
      `src/domain/models/ajs/normalize/`.
- [x] Cover shared helper and wrapper-local behavior with focused tests.

## Follow-up

- [ ] None.

## Notes

- Revisit normalized-model extraction only when a wrapper rule is both broadly
  reusable and duplicated outside the owning wrapper.
- Prefer fixture-backed normalization coverage for new edge cases instead of
  creating abstractions without repeated consumers.
