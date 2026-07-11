# TASKS: import-definition-via-webapi

## Agent Brief

- Purpose: record real-environment evidence for the delivered WebAPI beta.
- Active slice: blocked pending usable JP1/AJS3 WebAPI evidence.
- Do not remove beta labeling or broaden WebAPI scope.
- Do not invent smoke results from generated mocks.
- Do not edit runtime code, tests, generated artifacts, or configuration.
- Read first: `SPECS.md`, this file, and `TRACEABILITY.md`.
- Read OpenAPI notes only when the evidence concerns the supported endpoint.
- Validate evidence records with `rtk pnpm run qlty`.
- Approval policy and feature exit: see `docs/specs/README.md`.
- Next decision: obtain real-environment evidence or keep the task blocked.

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Task

- Status: Blocked
- Scope:
  record real JP1/AJS3 environment smoke verification evidence for the
  delivered read-only desktop WebAPI import beta.
- Acceptance:
  document the product/version context, tested scenario, observed result,
  host constraints, and whether `searchTarget=DEFINITION` returns enough
  definition attributes for the current beta scope. Do not remove beta
  labeling or broaden WebAPI scope in this task.
- Validation:
  docs-only evidence recording requires `rtk pnpm run qlty`.

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
- The next task depends on externally supplied real JP1/AJS3 environment
  smoke evidence or explicit access to such an environment; do not invent
  verification results from generated mocks.
- Real-environment smoke verification is currently blocked because no usable
  JP1/AJS3 WebAPI environment or evidence is available.
