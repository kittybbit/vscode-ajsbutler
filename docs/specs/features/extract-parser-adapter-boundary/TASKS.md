# Feature Tasks: Extract Parser Adapter Boundary

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes an
  active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status: not started; implementation approval is pending.
- Active slice: investigate and plan the parser port plus ANTLR adapter
  extraction.
- Open follow-up: choose injection and test-helper boundaries during
  `sdd-plan-task` planning.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only; do not copy the approval
message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Impact investigation completed and recorded in SPECS/TASKS by
      responsibility.
- [ ] Human approval recorded.
- [ ] Use `sdd-plan-task` to choose the exact parser port, adapter, composition,
      test-helper, and file-move scope.
- [ ] Verify references and call sites after approval before implementation.
- [ ] Implement only the approved parser adapter boundary slice.
- [ ] Update architecture/current-state/roadmap records after implementation
      changes the repository state.

## Validation

- [ ] Add infrastructure adapter contract tests for valid nested input and
      invalid-input position/message preservation.
- [ ] Add or update application use-case tests using a fake parser port.
- [ ] Confirm direct parser consumers and test imports use the approved
      production or test boundary.
- [ ] Run `rtk pnpm run qlty`.
- [ ] Run `rtk pnpm test`.
- [ ] Run `rtk pnpm run test:web`.
- [ ] Run `rtk pnpm run build`.

## Notes

- Existing use-case behavior is preserved; no durable observable scenario
  change is currently expected.
- Approval of these feature documents permits a docs-only pull request; it does
  not approve runtime implementation. Implementation approval remains pending
  until `sdd-plan-task` records the exact implementation scope and a human
  approves that scope.
- Re-approval boundaries are listed in SPECS.md.
