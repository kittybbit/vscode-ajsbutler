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
2. Before approval, only investigate and update SDD documents.
3. Before approval, do not edit runtime code, tests, generated artifacts, or
   configuration.
4. Before approval, do not create implementation branches, implementation
   commits, implementation refactors, or incidental fixes.
5. Stop for clear human approval before implementation.
6. After approval, enumerate all affected references and track the complete fix.
7. Follow TASKS.md in small safe steps.
8. Do not rewrite unrelated code.
9. Preserve existing behavior unless SPECS.md explicitly changes it.
10. Respect DDD and Clean Architecture boundaries.
11. Keep UI, application, domain, and infrastructure responsibilities separate.
12. Preserve VS Code compatibility declared in `package.json`.
13. Add or update tests for every behavior change.
14. Update documentation if implementation decisions differ from the spec.

Approval definition, approval evidence, and re-approval rules are centralized
in `docs/specs/README.md` `Implementation Change Gate`.

Before editing:

- Search affected functions, classes, components, commands, and DTOs.
- List changed areas, affected features, affected tests, related docs, and
  breaking-change risk.
- When behavior scenarios exist, list changed, added, or removed scenarios and
  affected tests.
- Record branch scope and risks in PLANS.md.
- Record durable impact, propagation, alternatives, and boundary decisions in
  SPECS.md.
- Record investigation, implementation, test, and follow-up tasks in TASKS.md.
- Record the TASKS.md `Human Approval` section with `Status: Pending`.
- Report only this approval request, then wait for approval:

```md
## Impact Investigation Summary

- Planned change:
- Affected files:
- Affected functions/classes/components:
- Affected features:
- Affected tests:
- Related docs:
- Breaking-change risk:
- Alternatives:

## Approval Request

Please approve implementation before I edit runtime code, tests,
generated artifacts, or configuration.

Implementation will not proceed until approval is given.
```

After approval:

- Record `Status: Approved`, the human approver, approval time, exact approval
  text, and approved scope in TASKS.md before implementation.
- Do not implement if TASKS.md does not contain `Status: Approved` and
  `Approval text`.
- Inspect existing files and naming conventions.
- Confirm every affected reference is either fixed or explicitly left
  unchanged in SPECS.md.
- Implement one coherent block at a time.
- Compile or run the closest fast check after meaningful changes.
- If required changes exceed the approved scope, stop, update the impact
  record, and request additional clear approval before editing those areas.

After editing:

- Run available build/test commands.
- Summarize changed files.
- Summarize behavior compatibility.
- List follow-up tasks.
