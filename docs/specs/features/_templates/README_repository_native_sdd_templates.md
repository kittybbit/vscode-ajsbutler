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

## Use

1. Start from a roadmap item or concrete feature goal; keep one feature
   selected for the work.
2. Update a use case only when its durable behavior contract changes.
3. Create only the feature documents needed to make its requirements and
   current implementation plan reviewable.
4. At Feature Exit, propagate reusable knowledge and close the selected
   feature only under the SDD policy.

Keep feature documents concise and decision-focused. Do not copy lifecycle
policy into them.
