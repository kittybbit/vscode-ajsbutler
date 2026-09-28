# SPECS: sdd-instruction-simplification

## Purpose and Origin

Make the repository's SDD and agent instructions concise enough to guide each
role without redundant reading or output, while preserving their decisions and
gates. This is a transient branch feature from the user's request and approved
rewrite plan. The rewrite basis is the user-supplied `rewrite-prompts` skill
and [OpenAI model
guidance](https://developers.openai.com/api/docs/guides/latest-model).

## Requirements

- Rewrite instruction text reachable from `AGENTS.md`, including SDD policy,
  role contracts, skills, invocation adapters, templates, Copilot entry
  points, and release guidance. Keep filenames and locations stable, and
  preserve each instruction's meaning, normative strength, authority, scope,
  output contract, and acceptance condition.
- Assign each SDD rule one clear owner: `AGENTS.md` for repository constraints
  and routing, `docs/specs/README.md` for SDD policy and document roles, role
  definitions for authority and handoffs, and skills for role-specific
  procedure. Remove repeated instructions, unnecessary process-only steps,
  examples, and tool prescriptions where their removal does not change a
  required result or gate. Keep cross-references valid.
- Make feature templates and the existing WebAPI feature documents
  decision-focused. `SPECS.md` owns purpose, requirements, acceptance, and
  necessary boundaries; `TASKS.md` owns current plan, approval and slice
  state, risks, and validation; `TRACEABILITY.md` maps requirements to slices
  and validation. Remove duplicate records and routine empty fields without
  losing feature-specific decisions, unresolved questions, or evidence needed
  for the next role.
- Keep plan, completion, and closure approvals distinguishable by state, exact
  scope and paths, and required review verdict. Preserve the Solution Shape,
  compatibility, risk, and validation facts needed to make and review each
  decision without copying the same explanation across documents.
- Correct confirmed stale role references, including `.agent.md` references to
  roles absent from the current catalog, without changing role authority or
  lifecycle routing.

## Boundaries and Compatibility

- This is a documentation and prompt rewrite. No product behavior, runtime
  code, tests, generated artifacts, configuration, public API, or VS Code
  engine contract changes are intended.
- JP1/AJS3 reference basis is the existing repository policy and use cases; no
  new JP1/AJS3 behavior is inferred. Preserve desktop and web expectations and
  the read-only WebAPI beta restrictions, including its real-environment
  evidence and feedback gate.
- The inherited WebAPI feature folder is an explicitly requested rewrite
  surface, not the selected feature or the owner of this branch's plan. Its
  pending work and approval state remain its own.
- The production architecture layers have no new responsibilities; only their
  documented constraints and ownership descriptions may be clarified.

## Acceptance Criteria

- An agent can identify the selected feature, next role, approval status,
  allowed scope, stopping condition, and required validation from the relevant
  owning documents without consulting duplicate policy text.
- The revised templates and representative WebAPI documents contain the
  minimum facts required for intake, planning, review, implementation, and
  Feature Exit; they do not require filler such as routine `none` entries or
  duplicate approval narratives.
- Required and forbidden actions, approval order, role boundaries,
  compatibility and WebAPI beta conditions, and feature-specific unresolved
  decisions retain their original strength and meaning.
- Referenced files and sections resolve; edited TOML, YAML, and Markdown
  remain valid under the applicable repository checks.

## Non-Goals

- Changing extension functionality, JP1/AJS behavior, the SDD approval model,
  or release behavior.
- Closing the inherited WebAPI feature, deciding beta exit, or answering its
  environment-dependent questions.
- Renaming or relocating documents.
