# TASKS: record-telemetry

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-record-telemetry.md
- [x] Confirm SPECS.md
- [x] Implement telemetry port and VS Code adapter
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [x] Continue verifying browser-hosted telemetry behavior and fallback handling

## Notes

- Privacy constraints are ongoing policy, not a standing open slice task.
  Keep them explicit in follow-on telemetry work per `AGENTS.md`.
- 2026-04-11: desktop and browser bundles continue to share `src/extension.ts`
  as the entry point, so both hosts exercise the same `TelemetryPort`
  contract.
- 2026-04-11: `createTelemetry` tests now verify both noop fallback behavior
  and browser-hosted event forwarding through the same port shape, so this
  follow-up is covered by automated verification rather than assumption.
