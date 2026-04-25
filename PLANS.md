# PLANS.md

The active SDD plan index lives in `docs/specs/plans.md`.

Use the documents as follows:

- `docs/specs/plans.md`: branch status, current task, workflow rules, and
  branch-level planning notes
- `docs/specs/roadmap.md`: medium-term extraction order and deferred slices
- `docs/specs/features/<feature>/SPECS.md`: per-feature requirements
- `docs/specs/features/<feature>/PLANS.md`: feature-local design and
  milestones
- `docs/specs/features/<feature>/TASKS.md`: execution checklist for the
  current slice

Keep this root file as a pointer only. When branch direction changes, update
`docs/specs/plans.md` first, then refresh feature docs and roadmap only where
the change affects them.
