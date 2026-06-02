# Feature Tasks: {{Feature Name}}

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status:
- Active slice:
- Open follow-up:

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [ ] Impact investigation completed and recorded in PLANS/SPECS/TASKS by
      responsibility
- [ ] Human approval recorded
- [ ] Implementation scope matches approved scope
- [ ] Fix targets tracked to completion
- [ ] {{implementation task}}

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Keep investigation details in PLANS.md or SPECS.md when they describe scope,
  risk, alternatives, or boundary decisions.
- Use this file for current executable tasks and open follow-up tracking only.
