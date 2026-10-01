# TASKS: import-definition-via-webapi

## Agent Brief

- Purpose: record real-environment evidence for the delivered WebAPI beta.
- State: Blocked; no usable JP1/AJS3 WebAPI environment or evidence is
  available.
- Constraints: keep beta and read-only scope; do not treat generated mocks as
  real smoke evidence or edit runtime code, tests, generated artifacts, or
  configuration for this evidence task.
- Next: record smoke results and enough user feedback to assess beta exit.
  Broader or beta-exit implementation requires new approval.

## Current task

- Status: Blocked
- Scope: document real-environment smoke verification for the delivered
  read-only desktop import beta.
- Acceptance: record product/version, scenario, observed result, host limits,
  and whether `searchTarget=DEFINITION` returns enough attributes. Keep beta
  labels and current scope.
- Validation: `rtk pnpm run qlty` for evidence-document changes.

## Human Approval

- Status: Pending

## Progress

- Done: record the supported read-only endpoint, OpenAPI contract, generated
  artifacts, application port, and desktop adapter flow.
- Blocked: real-environment smoke verification; no usable environment or
  evidence is available.
- Pending: record enough user feedback to assess beta exit. Obtain new approval
  before beta-exit or broader WebAPI implementation.

## Follow-up

Before correcting the stale checked-in Prism artifact reported by
`rtk pnpm run openapi:check`, define and review a focused generated-artifact
reproducibility slice in Replanning Mode. This note does not approve that work
or change the blocked real-environment evidence task.
