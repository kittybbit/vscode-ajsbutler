# Repository-Native SDD Templates

Use these templates for feature documents under
`docs/specs/features/<feature-slug>/`:

- `SPECS.md` for purpose, requirements, acceptance, and material boundaries.
- `TASKS.md` for the current plan, slice, approval, and evidence.
- `ADR.md` only when a material decision needs a durable record.
- `TRACEABILITY.md` when requirement-to-slice validation mapping is useful.
- `CODEX_SDD_PROMPT.template.md` and
  `CODEX_IMPLEMENTATION_PROMPT.template.md` for the corresponding task.

Keep repository-level behavior contracts in
[`docs/requirements/use-cases/_template.md`](../../../requirements/use-cases/_template.md).
The SDD policy, role ownership, approval gates, and commit procedure are owned
by [`docs/specs/README.md`](../../README.md).

Templates describe reviewable outcomes, not a second lifecycle procedure.
Keep policy and role rules with their owners; only feature-specific scope,
approval and evidence references belong in generated feature documents.
