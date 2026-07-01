# Feature Tasks: {{Feature Name}}

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on the implementation-slice plan, approval state,
  validation, risk, and feature exit readiness. Do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Plan Status

- Status: Proposed | Review Needed | Pending Approval | Approved | In Progress | Replan Required | Complete
- Planning scope:
- Review status:
- Human approval:
- Active implementation slice:

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

## Implementation Slices

### Slice 1: {{slice name}}

- Status: Proposed | Approved | In Progress | Complete | Blocked | Replan Required
- Scope:
- User / Domain Value:
- Cohesive Change Group:
- Acceptance:
- Validation:
- Production Readiness:
  - Failure mode:
  - JP1/AJS compatibility:
  - Large or malformed input risk:
  - Desktop/web impact:
  - README/docs impact:
  - CHANGELOG impact:
- Approval Boundary:
- Dependencies:
- Risks:
- Out of Scope:

## Traceability

- TRACEABILITY.md required: yes | no
- Reason:

## Feature Exit

- Definition of Done status:
- Durable documentation updates:
- Open risks:

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Keep feature requirements and boundary decisions in SPECS.md.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
