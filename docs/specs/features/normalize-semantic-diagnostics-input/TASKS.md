# Feature Tasks: Normalize Semantic Diagnostics Input

## Sync Rule

- Update this file with task decisions, `plans.md` when active features change,
  and `roadmap.md` when repository sequencing changes.
- Keep only current approval, risk, validation, and next-decision state.

## Current Status

- Runtime status: not started; implementation approval is pending.
- Active slice: plan normalized source-location and diagnostic-rule migration.
- Open follow-up: decide required versus optional normalized location fields.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Active Tasks

- [x] Feature boundary and initial impact recorded.
- [ ] Use `sdd-plan-task` to inventory every raw-unit diagnostic dependency.
- [ ] Obtain implementation approval for the complete migration slice.
- [ ] Verify all rule, helper, and test references after approval.
- [ ] Implement only the approved normalized-input migration.

## Validation

- [ ] Add normalized position and diagnostic parity tests.
- [ ] Run `rtk pnpm run qlty`, desktop tests, web tests, and build.

## Notes

- Docs approval permits a docs-only PR, not runtime implementation.
- Existing editor-feedback use-case scenarios remain the behavior contract.
