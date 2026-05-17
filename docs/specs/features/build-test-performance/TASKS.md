# TASKS: build-test-performance

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
  the documented build/test performance slices are delivered through Slice-8.
- Active slice:
  none.
- Open follow-up:
  Slice-6 output-directory ownership cleanup remains deferred until packaging,
  caching, or stale-output behavior becomes a real blocker.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Record completed slice outcomes in durable SDD artifacts.
- [ ] Re-open the feature only if a new measurable performance or workflow
      blocker justifies another approval-gated slice.

## Validation

- [x] Validation expectations are documented in feature-local specs and
      repository SDD guidance.

## Notes

- See feature `SPECS.md` and repository `roadmap.md` for durable delivery and
  deferred-scope context.
