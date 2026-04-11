# TASKS: provide-editor-feedback

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-provide-editor-feedback.md
- [x] Confirm SPECS.md
- [x] Implement diagnostics and hover application logic
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [x] Record a current manual smoke-test result for diagnostics and hover behavior

## Notes

- 2026-04-11: desktop integration coverage in
  `src/test/suite/extension.test.ts` verifies that invalid JP1/AJS documents
  still produce diagnostics and that parameter hover still returns results
  through the VS Code extension surface.
- 2026-04-11: browser-hosted smoke coverage in `src/test/suite/webSmoke.ts`
  verifies the same diagnostics and hover behaviors in the web entry path, so
  this follow-up is covered by automated smoke-style verification.
- Remaining activation/bootstrap concentration around registration wiring is
  tracked as branch-level architecture work in `docs/specs/plans.md`, not as a
  feature-local follow-up for editor feedback alone.
