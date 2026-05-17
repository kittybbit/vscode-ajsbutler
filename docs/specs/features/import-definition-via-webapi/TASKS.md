# TASKS: import-definition-via-webapi

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
  the first read-only desktop WebAPI import slice is delivered and remains
  beta.
- Active slice:
  none.
- Open follow-up:
  record real JP1/AJS3 environment smoke verification and sufficient user
  feedback before removing the beta framing.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Record the first supported read-only import boundary, OpenAPI contract,
      generated artifacts, application port, and desktop adapter flow.
- [ ] Record real-environment smoke verification.
- [ ] Record enough user feedback to decide whether beta exit is appropriate.
- [ ] Request new approval before any beta-exit or broader WebAPI scope
      implementation work.

## Validation

- [x] Reproducibility and feature-validation expectations are documented in the
      feature specs.

## Notes

- Keep traceability details in `TRACEABILITY.md`.
- Keep durable scope and host-boundary decisions in `SPECS.md`.
