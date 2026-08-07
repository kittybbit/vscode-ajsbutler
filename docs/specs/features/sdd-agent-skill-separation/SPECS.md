# SPECS: sdd-agent-skill-separation

## Purpose

Define and plan a repository-wide boundary that separates agent role,
authority, lifecycle handoff, and stop conditions from reusable SDD skill
procedures. The resulting design will make `.agents/skills` the canonical
repository-wide skill location, place Codex-specific role definitions under
`.codex/agents`, and make `AGENTS.md` the deterministic SDD routing
orchestrator while preserving the existing SDD approval gate.

This is a transient branch feature. Its first deliverable is an
approval-ready implementation-slice plan; runtime implementation and
configuration changes remain out of scope until the plan is reviewed and
human-approved.

## Minimal Context

- Current decision: establish the responsibility and authority boundary
  between repository policy, agent definitions, and reusable procedures.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when checking
  requirement-to-slice correspondence.
- Do not create `CONTEXT.md`; repository-wide SDD policy remains in
  `docs/specs/README.md`.

## Origin

- Source use case: none; this is a repository operating-policy and branch-goal
  feature based on the user-provided Feature作成指示書.
- Implementation-slice plan: `TASKS.md`.
- Related repository policy: `AGENTS.md`, `docs/specs/README.md`, `.agent.md`,
  and `.github/copilot-instructions.md`.

## JP1/AJS Source Reference

- Command reference: none; this feature does not change JP1/AJS commands.
- Definition/config reference: none; this feature does not change
  JP1/AJS3 definition-file interpretation or configuration.
- Undocumented or inferred behavior: not applicable. Any agent or packaging
  behavior discovered during implementation must be recorded as repository
  evidence, not presented as JP1/AJS behavior.

## Requirements

- R1. The design must classify each current `.codex/skills` procedure as agent
  responsibility, reusable procedure, or repository policy / SSOT content
  before migration or rewriting.
- R2. `.agents/skills` must be the canonical repository-wide location for
  reusable skills. Codex, Copilot, and other agent entry points must reach the
  shared skills through product-specific adapters or references rather than
  copying the same policy.
- R3. `.codex/agents` must define exactly the seven initial SDD roles:
  `feature-author`, `plan-author`, `plan-reviewer`, `plan-reviser`,
  `implementer`, `implementation-reviewer`, and `feature-closer`. Each role
  definition must state its fixed model, reasoning effort, authority,
  allowed input state, forbidden actions, output contract, next handoff, and
  stop or escalation condition.
- R4. The model and reasoning assignments must be deterministic: `Sol / medium`
  for `feature-author` and `plan-author`, and `Luna / xhigh` for the other
  five SDD roles. The separate `release-extension` Codex adapter must use
  `Luna / medium`; it is not an eighth SDD role. Workload-based dynamic model
  switching must not be part of the basic design.
- R5. `AGENTS.md` must route requests deterministically by triviality, SDD
  lifecycle stage, role, and handoff condition. It must remain concise and
  reference `docs/specs/README.md` for SDD policy instead of duplicating it.
- R6. Plan review and implementation review must be independent read-only
  responsibilities. Reviewers return `Ready` or actionable `Findings` and
  do not modify the plan or runtime implementation themselves.
- R7. `feature-closer` must be independent from planning and own Feature Exit
  checks, durable knowledge propagation, and guardrail synchronization. It
  may only propagate approved, implemented, and validated knowledge and must
  return the feature to planning when a new design decision is required.
- R8. Existing human approval boundaries, DDD / Clean Architecture rules,
  desktop and web compatibility expectations, and JP1/AJS compatibility
  safeguards must remain unchanged unless a separate approved specification
  explicitly changes them.
- R9. Existing SDD skills and agent-specific entry points must be migrated or
  adapted without losing useful rules. The plan must account for references
  in `.codex/skills`, `.agent.md`, `.github/copilot-instructions.md`, and
  related documentation.
- R10. The implementation plan must include docs-only validation, Markdown
  structure checks where useful, and a packaging/CI review. The current
  `.vscodeignore` excludes `.codex/` and `docs/` but not `.agents/`; the plan
  must decide whether shared skills should be packaged and keep the result
  intentional.

## Architecture

- Domain: none; no product domain model or JP1/AJS interpretation changes.
- Application: none; no application use case or DTO changes.
- Presentation: none; no VS Code command, webview, or user-facing behavior
  changes.
- Infrastructure: none; no parser, host adapter, filesystem, network, or
  telemetry changes.
- Repository coordination: agent definitions own role authority and handoff;
  reusable skills own procedures; `docs/specs/README.md` owns SDD policy;
  `AGENTS.md` owns deterministic repository routing; product-specific entry
  points own only the adapter needed to reach those sources.

## Impact Analysis

### Dependency Impact

- Affected coordination surfaces: `.codex/skills/`, new `.agents/skills/`,
  new `.codex/agents/`, `AGENTS.md`, `.agent.md`,
  `.github/copilot-instructions.md`, `docs/specs/README.md` if a durable SDD
  policy reference must change, and `.vscodeignore` if packaging policy
  requires it.
- Existing product features and use cases are intentionally unchanged.
- Propagation decision: keep feature-local decomposition and migration detail
  in `TASKS.md`; propagate only durable role, policy, routing, or guardrail
  decisions during Feature Exit after evidence and human approval.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: none intended.
- VS Code/web extension compatibility: runtime behavior and
  `engines.vscode` remain unchanged. Packaging must be checked because the
  new `.agents/` path is not currently excluded by `.vscodeignore`.
- Changed scenarios: none; this feature changes repository coordination
  boundaries, not JP1/AJS behavior.

### Alternative Considerations

- Keep `.codex/skills` as the shared SSOT: rejected because it makes a Codex
  product directory the repository-wide source and mixes role authority with
  procedures.
- Add a generic repository-wide agent directory: rejected for the initial
  scope because the requested role definitions are Codex-specific; other
  products should use adapters to the shared skills.
- Keep implementation review inside `implementer`: rejected because it weakens
  independent scope, regression, and production-readiness review.
- Put Feature Exit in `plan-author`: rejected because durable knowledge
  propagation and guardrail synchronization need an independent completion
  authority.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: changing the seven-role baseline,
  altering the SDD human-approval gate, changing product/runtime behavior,
  changing JP1/AJS compatibility policy, or adding unrelated agent roles.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; this feature
  must not raise the minimum version.
- Desktop extension compatibility: no runtime behavior change; verify that
  coordination files do not accidentally alter desktop packaging or startup.
- Web extension compatibility: no runtime behavior change; shared skill and
  agent references must not introduce Node-only production imports or web-host
  assumptions.
- Packaging compatibility: evaluate `.vscodeignore`, VSIX contents, and CI
  docs-only classification after the target directories are introduced.
- Model, Serena, or agent choice does not change product behavior or bypass
  the SDD approval gate.

## Acceptance Criteria

- The existing five `.codex/skills` entries are classified with explicit
  decisions about responsibility, procedure, and SSOT ownership.
- The proposed seven-role model has independent authority, handoff, and stop
  conditions, including read-only `plan-reviewer` and
  `implementation-reviewer`, and independent `feature-closer` ownership.
- The plan defines how Codex and non-Codex entry points reach shared skills
  without copying repository or SDD policy.
- `AGENTS.md` routing responsibilities and `docs/specs/README.md` policy
  responsibilities are non-overlapping and remain discoverable from the
  existing entry points.
- The plan explicitly validates `.vscodeignore`, docs-only CI assumptions,
  Markdown structure, and references after migration.
- The `release-extension` adapter has fixed `Luna / medium` metadata while
  remaining separate from the seven-role SDD lifecycle.
- No runtime code, tests, generated artifacts, or configuration are changed
  before the reviewed plan and implementation slice receive clear human
  approval.
- The feature can be closed only after durable knowledge and guardrails are
  synchronized, remaining risks have owners, and Feature Exit is approved.

## Non-Goals

- Redesigning SDD policy wholesale.
- Changing DDD / Clean Architecture boundaries or dependency rules.
- Raising the minimum VS Code version.
- Changing extension behavior, JP1/AJS analysis, parser semantics, or WebAPI
  behavior.
- Performing an unrelated runtime refactor.
- Introducing a generalized agent framework or speculative future roles.
- Treating `.agents/skills` as automatically detected by every AI product.

## Open Questions

None for feature intake. Planning proposes migrating the four SDD procedures
into the shared skill model, retaining `release-extension` as a reusable
repository procedure without adding a corresponding SDD role, updating only
the Feature Exit lifecycle references in `docs/specs/README.md`, excluding
`.agents/` from VSIX packaging, and keeping `.agent.md` and
`.github/copilot-instructions.md` as thin adapters. These decisions remain
subject to plan review and Human Approval before implementation.
