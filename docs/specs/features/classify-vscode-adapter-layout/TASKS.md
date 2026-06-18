# Feature Tasks: Classify VS Code Adapter Layout

## Sync Rule

- Update this file with task decisions, `plans.md` when active features change,
  and `roadmap.md` when repository sequencing changes.
- Keep only current approval, risk, validation, and next-decision state.

## Current Status

- Runtime status: not started; implementation approval is pending.
- Active slice: classify current extension modules and plan relocation.
- Open follow-up: record the destination of every module before approval.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Active Tasks

- [x] Feature boundary and initial impact recorded.
- [ ] Use `sdd-plan-task` to classify every `src/extension` module.
- [ ] Obtain implementation approval for the exact relocation map.
- [ ] Verify production, test, webpack, and TypeScript references.
- [ ] Relocate modules without logic changes.

## Validation

- [ ] Confirm no stale imports or production files remain in the
      `src/extension/` directory while `src/extension.ts` remains resolvable.
- [ ] Run `rtk pnpm run qlty`, desktop tests, web tests, and build.

## Notes

- Docs approval permits a docs-only PR, not runtime implementation.
- Relocation must preserve git history where practical and remain reviewable.
