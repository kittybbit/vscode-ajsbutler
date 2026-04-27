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

1. Start with impact investigation.
2. Stop for explicit human approval before implementation.
3. After approval, enumerate all affected references and track the complete fix.
4. Follow TASKS.md in small safe steps.
5. Do not rewrite unrelated code.
6. Preserve existing behavior unless SPECS.md explicitly changes it.
7. Respect DDD and Clean Architecture boundaries.
8. Keep UI, application, domain, and infrastructure responsibilities separate.
9. Preserve VS Code compatibility declared in `package.json`.
10. Add or update tests for every behavior change.
11. Update documentation if implementation decisions differ from the spec.

Before editing:

- Search affected functions, classes, components, commands, and DTOs.
- List changed areas, affected features, affected tests, related docs, and
  breaking-change risk.
- When behavior scenarios exist, list changed, added, or removed scenarios and
  affected tests.
- Record branch scope and risks in PLANS.md.
- Record durable impact, propagation, alternatives, and boundary decisions in
  SPECS.md.
- Record investigation, approval, implementation, test, and follow-up tasks in
  TASKS.md.
- Report the plan, affected files, tests, risks, and alternatives to the human
  reviewer, then wait for approval.

After approval:

- Inspect existing files and naming conventions.
- Confirm every affected reference is either fixed or explicitly left
  unchanged in SPECS.md.
- Implement one coherent block at a time.
- Compile or run the closest fast check after meaningful changes.

After editing:

- Run available build/test commands.
- Summarize changed files.
- Summarize behavior compatibility.
- List follow-up tasks.
