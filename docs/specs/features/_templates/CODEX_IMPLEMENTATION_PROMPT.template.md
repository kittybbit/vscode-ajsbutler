# Implement an Approved SDD Slice

Main: delegate exactly one Human Approved slice in the selected feature's
`TASKS.md` to `implementer`. Use its `.codex/agents/implementer.toml` procedure
directly; no lifecycle Skill invocation.

Feature: {{Feature name}}
Slice: {{Slice name}}

Read the relevant use case, `SPECS.md`, and `TASKS.md`. Read `ADR.md` or
`TRACEABILITY.md` only when they affect this slice. Follow the assigned role,
the core SDD contract in [`docs/specs/README.md`](../../README.md), and architecture
boundaries in [`docs/specs/architecture.md`](../../architecture.md).
Use the role's conditional loading rules for
[validation](../../validation.md) and [evidence](../../evidence.md).

- Start only after the approved plan commit and explicit slice approval.
- Preserve behavior and compatibility; implement no unrelated work.
- Add or update relevant tests and run checks for the changed surface.
- Produce the slice's reusable validation record under the Evidence Contract;
  reuse matching evidence and record reasons for affected reruns.
- Stop and return to Main if work needs a new design, scope, dependency, or
  approval decision.

Return the policy handoff record with changed paths, acceptance, validation
identity/references, compatibility and production readiness, traceability,
follow-up work, and unresolved risks. Main routes independent review and human
gates; implementer does not invoke the next role.
