# Create Repository-Native SDD Documents

Create concise, reviewable SDD documents for this goal.

Feature: {{Feature name}}
Goal: {{Feature goal}}
Source use case: {{Use-case path, if any}}

Use the roadmap, relevant use case, and templates in this folder. Create the
feature under `docs/specs/features/{{feature-slug}}/`.

- Put purpose, requirements, acceptance, compatibility, boundaries, and
  unresolved decisions in `SPECS.md`.
- Put the current plan, slice status, approval state, validation, risks, and
  readiness in `TASKS.md`.
- Add `ADR.md` only for a material decision and `TRACEABILITY.md` only when a
  requirement-to-slice validation map is useful.
- Update a use case only when the durable behavior contract changes; use its
  existing template. Use Gherkin only when it clarifies observable behavior.
- Apply DDD and Clean Architecture, preserve `package.json`
  `engines.vscode` compatibility when relevant, and prefer evolutionary
  changes.
- Follow the SDD roles and approval gates in
  [`docs/specs/README.md`](../../README.md).

Return the created or changed paths, key decisions, and unresolved questions.
