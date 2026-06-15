# TASKS: separate-ajs-metadata-from-i18n

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Task

- Status: Proposed
- Scope:
  propose the next behavior-preserving slice for separating AJS table column
  metadata from flat `ajscolumn` resource keys.
- Acceptance:
  impact investigation names the affected table column definitions, column
  label resources, tests, desktop/web compatibility risks, and alternatives
  before runtime code or tests are edited.
- Validation:
  docs-only planning changes require `rtk pnpm run qlty`.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Complete the approved unit type label helper slice.
- [ ] Complete impact investigation for AJS table column metadata and affected
      table column definition consumers.
- [ ] Request human approval for the next implementation slice before editing
      runtime code, tests, generated artifacts, or configuration.

## Validation

- The unit type label helper slice passed `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- Future implementation slices must run relevant unit tests and the required
  code-validation sequence from `docs/specs/README.md` unless the approved
  scope narrows validation with documented rationale.

## Use-Case Back-Propagation

- No durable use-case update is needed while the feature only changes internal
  metadata boundaries and preserves observable labels.
- The completed unit type label helper slice preserves observable labels except
  for the explicitly approved English leading-whitespace data defect
  correction, so no use-case update is needed.
- Update `docs/requirements/use-cases/uc-build-unit-list-view.md` if a future
  slice changes observable column labels or fallback behavior.
