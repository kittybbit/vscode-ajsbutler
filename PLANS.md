# PLANS.md

The active SDD plan index lives in `docs/specs/plans.md`.

Current active planning topic:
`docs/specs/plans.md`.

Use the documents as follows:

- `docs/specs/plans.md`: active feature folders, branch-wide decisions, and
  repository sequencing that applies across features
- `docs/specs/roadmap.md`: medium-term extraction order and deferred slices
- `docs/specs/features/<feature>/SPECS.md`: per-feature requirements
- `docs/specs/features/<feature>/TASKS.md`: implementation-slice plan,
  approval state, validation, risks, and feature exit readiness
- `docs/specs/features/<feature>/TRACEABILITY.md`: requirement-to-validation
  mapping when required

Keep this root file as a pointer only. When branch direction changes, update
`docs/specs/plans.md` first, then refresh feature docs and roadmap only where
the change affects them.
