# Implement an Approved SDD Slice

Implement exactly one Human Approved slice in the selected feature's
`TASKS.md`.

Feature: {{Feature name}}
Slice: {{Slice name}}

Read the relevant use case, `SPECS.md`, and `TASKS.md`. Read `ADR.md` or
`TRACEABILITY.md` only when they affect this slice. Follow the assigned role,
the SDD policy in [`docs/specs/README.md`](../../README.md), and architecture
boundaries in [`docs/specs/architecture.md`](../../architecture.md).

- Start only after the approved plan commit and explicit slice approval.
- Preserve behavior and compatibility; implement no unrelated work.
- Add or update relevant tests and run checks for the changed surface.
- Stop and return to Main if work needs a new design, scope, dependency, or
  approval decision.

Return changed paths, acceptance, checks, compatibility and production
readiness, traceability, follow-up work, and unresolved risks.
