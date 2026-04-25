# Codex Prompt: Implement Feature from Repository-Native SDD

You are implementing a feature from repository-native SDD documents.

Feature:
{{Feature Name}}

Read these documents first:

- docs/requirements/use-cases/{{use-case-file}}.md
- docs/specs/features/{{feature-slug}}/PLANS.md
- docs/specs/features/{{feature-slug}}/SPECS.md
- docs/specs/features/{{feature-slug}}/TASKS.md
- docs/specs/features/{{feature-slug}}/ADR.md if present
- docs/specs/features/{{feature-slug}}/TRACEABILITY.md if present

Implementation rules:

1. Follow TASKS.md in small safe steps.
2. Do not rewrite unrelated code.
3. Preserve existing behavior unless SPECS.md explicitly changes it.
4. Respect DDD and Clean Architecture boundaries.
5. Keep UI, application, domain, and infrastructure responsibilities separate.
6. Preserve VS Code 1.75 compatibility.
7. Add or update tests for every behavior change.
8. Update documentation if implementation decisions differ from the spec.

Before editing:

- Inspect existing files and naming conventions.
- Identify relevant tests and fixtures.
- Confirm expected behavior.

After editing:

- Run available build/test commands.
- Summarize changed files.
- Summarize behavior compatibility.
- List follow-up tasks.
