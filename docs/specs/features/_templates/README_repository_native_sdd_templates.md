# Repository-Native SDD Templates

Use these templates when a slice needs feature-local SDD documents.

```text
docs/specs/features/_templates/
  PLANS.template.md
  SPECS.template.md
  TASKS.template.md
  ADR.template.md
  TRACEABILITY.template.md
  CODEX_SDD_PROMPT.template.md
  CODEX_IMPLEMENTATION_PROMPT.template.md
```

Keep repository-level behavior contracts in:

```text
docs/requirements/use-cases/_template.md
```

## Workflow

1. Start from roadmap.md.
2. Create or update a use case only when the behavior contract changes.
3. Create feature-specific SDD files from these templates under
   `docs/specs/features/<feature-slug>/`.
4. Use CODEX_SDD_PROMPT.template.md to generate SDD documents.
5. Use CODEX_IMPLEMENTATION_PROMPT.template.md to implement from approved SDD.

Feature docs should be concise and decision-oriented. Completed refactor-only
slices should be compressed into `docs/specs/roadmap.md` or
`docs/specs/plans.md` instead of staying as long-lived feature folders.
