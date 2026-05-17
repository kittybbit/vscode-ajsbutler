# TASKS: modernize-runtime-boundaries

## Sync Rule

- Update this file in the same commit whenever a durable requirement or
  follow-up decision changes.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
  the currently approved modernization slices are delivered.
- Active slice:
  none.
- Open follow-up:
  replace the custom `UnitEntity` hash implementation only after identity and
  compatibility checks are refreshed.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Record delivered runtime-boundary modernization outcomes in durable SDD
      documents.
- [ ] Refresh identity and compatibility checks before proposing a hash
      replacement slice.
- [ ] Request new approval before any `UnitEntity` hash implementation change.

## Notes

- Current DTO transport does not require cyclic serialization.
- Bundle-size follow-up remains deferred until a clearer shrinking seam or
  stronger product requirement appears.
