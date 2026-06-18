# Feature Tasks: Relocate React Webview Presentation

## Sync Rule

- Update this file with task decisions, `plans.md` when active features change,
  and `roadmap.md` when repository sequencing changes.
- Keep only current approval, risk, validation, and next-decision state.

## Current Status

- Runtime status: not started; implementation approval is pending.
- Active slice: plan the presentation subtree and path relocation.
- Open follow-up: none before detailed reference inventory.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Active Tasks

- [x] Feature boundary and initial impact recorded.
- [ ] Use `sdd-plan-task` to inventory source, test, alias, and webpack paths.
- [ ] Obtain implementation approval for the exact relocation map.
- [ ] Verify every affected reference after approval.
- [ ] Relocate presentation files without logic changes.

## Validation

- [ ] Confirm no stale imports or production files remain in `src/ui-component`.
- [ ] Run `rtk pnpm run qlty`, desktop tests, web tests, and build.

## Notes

- Docs approval permits a docs-only PR, not runtime implementation.
- No durable behavior-contract change is expected.
