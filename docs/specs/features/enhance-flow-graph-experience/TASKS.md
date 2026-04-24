# TASKS: enhance-flow-graph-experience

## Sync Rule

- Update this file in the same commit whenever a durable requirement or
  follow-up decision changes.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Refresh flow-view presentation toward JP1/AJS View without changing the
      graph DTO contract
- [x] Support progressive nested expansion in the current canvas, including
      expand-all and deeper visible descendants
- [x] Keep nested layout stable when expanded panels push sibling nodes
- [x] Keep descendant expansion state predictable across parent collapse and
      recovery-jobnet expansion
- [x] Add current-scope flow search with multi-match reveal and highlighting
- [x] Add explicit bridge navigation between the unit list and flow graph

## Durable Notes

- Keep visual resemblance as the goal; full JP1/AJS View parity remains out of
  scope for this slice.
- Keep viewer-facing behavior compatible with both desktop and web hosts.
- Keep nested expansion behavior documented in terms of visible panel bounds
  and immediate-scope siblings so later refactors do not reintroduce
  historical-delta drift.
- Keep viewport refit behavior tied to the latest rendered graph bounds so
  nested expansion does not leave newly revealed nodes outside fit-to-view.
- Keep broader flow-search follow-ups deferred unless current-scope search
  proves insufficient for real navigation needs.
