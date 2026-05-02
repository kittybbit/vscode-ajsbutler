# Feature Tasks: qlty-driven-architecture-refactoring

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` or `docs/specs/roadmap.md` in the same commit
  when branch priorities or repository sequencing change.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

## Tasks

- [x] Impact investigation completed and recorded in PLANS/SPECS/TASKS by
      responsibility
- [x] Qlty check findings analyzed
- [x] Qlty metrics findings analyzed
- [x] Qlty smell findings analyzed
- [ ] Human approval recorded
- [ ] Implementation scope matches approved scope
- [ ] Fix targets tracked to completion
- [ ] Slice-0 repository hygiene completed
- [ ] Slice-1 flow-viewer complexity completed
- [ ] Slice-2 application orchestration completed
- [ ] Slice-3 domain helper simplification completed

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Highest complexity currently exists in `FlowContents.tsx`
- `buildExpandedFlowGraph.ts` shows repeated orchestration complexity
- Application builders show duplication
- Domain helpers contain branch-heavy conditional logic
