# Feature Tasks: Retire Current-State Snapshot

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Status

- Runtime status: documentation intake only; no runtime change planned
- Active slice: plan relocation of current guidance before deleting the stale
  snapshot
- Open follow-up: decide the durable home for shared fixture guidance

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

- [ ] Inventory each section of `current-state.md` as retain, relocate, or
      discard because it is stale or duplicated.
- [ ] Confirm exact destination documents and link impact.
- [ ] Record the docs-only implementation impact and request human approval.
- [ ] After approval, relocate current guidance and remove the stale snapshot.
- [ ] Remove reading-order and document-role references to the snapshot.

## Validation

- [ ] Run `rtk pnpm run qlty`.
- [ ] Run `rtk pnpm run lint:md` for Markdown structure and link validation.
- [ ] Confirm the change remains within the repository's docs-only file set.

## Notes

- This transient feature should be removed after the snapshot is retired and
  all durable guidance has reached its responsible document.
- The `unitListDocument.ts` conversion-export finding is a separate potential
  implementation feature and is outside this feature's approval boundary.
