# Feature Tasks: Establish Extension Composition Root

## Sync Rule

- Update this file with task decisions, `plans.md` when active features change,
  and `roadmap.md` when repository sequencing changes.
- Keep only current approval, risk, validation, and next-decision state.

## Current Status

- Runtime status: not started; implementation approval is pending.
- Active slice: plan explicit dependency construction and injection.
- Open follow-up: choose the smallest dependency bundle during planning.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Active Tasks

- [x] Feature boundary and initial impact recorded.
- [ ] Use `sdd-plan-task` to map construction, injection, and disposal owners.
- [ ] Obtain implementation approval for the planned slice.
- [ ] Verify every affected reference after approval.
- [ ] Implement only the approved composition-root slice.

## Validation

- [ ] Add or update bootstrap and fake-dependency adapter tests.
- [ ] Run `rtk pnpm run qlty`, desktop tests, web tests, and build.

## Notes

- Docs approval permits a docs-only PR, not runtime implementation.
- No durable behavior-contract change is expected.
