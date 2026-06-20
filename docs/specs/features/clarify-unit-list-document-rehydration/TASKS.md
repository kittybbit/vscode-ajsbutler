# Feature Tasks: Clarify Unit-List Document Rehydration

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status: not started
- Active slice: investigate and document the production rehydration boundary
- Open follow-up: decide whether `toRootUnits` needs production visibility

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the human approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [ ] Complete reference and call-site analysis for `toRootUnits`,
      `toAjsDocument`, and `UnitListDocumentDto`.
- [ ] Confirm why table and flow viewers require DTO rehydration and whether
      that responsibility remains at the application boundary.
- [ ] Propose the smallest visibility or documentation change that preserves
      production behavior.
- [ ] Record implementation impact and request human approval.
- [ ] After approval, update focused tests for the retained boundary.

## Validation

- [ ] Run `rtk pnpm run qlty`.
- [ ] Run relevant unit tests.
- [ ] Run `rtk pnpm run test:web` and `rtk pnpm run build` because both viewer
      hosts consume the shared DTO boundary.

## Notes

- Initial search confirms production `toAjsDocument` consumers in both table
  and flow-viewer presentation paths; it must not be moved wholesale to test
  support.
- No use-case contract update is expected while DTO shape and observable
  behavior remain unchanged.
