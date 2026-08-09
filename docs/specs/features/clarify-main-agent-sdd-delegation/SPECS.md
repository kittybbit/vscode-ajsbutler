# Feature Specification: Clarify Main-Agent SDD Delegation

## Purpose

Define one repository orchestration boundary in which the main Codex agent
remains the default chat entrypoint for ad-hoc work but delegates every formal,
role-owned SDD lifecycle operation to the designated custom subagent.

## Minimal Context

- Current decision: separate direct main-agent work from formal SDD lifecycle
  execution without changing lifecycle or approval policy.
- Read first: this file, `TASKS.md`, and the user-provided correction directive.
- Read `TRACEABILITY.md` only when checking requirement coverage.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` as the SDD policy SSOT.

## Origin

- Source: user correction directive `Main Agent Orchestration と SDD Subagent
Delegation の明確化`, supplied at
  `/Users/jconee/.codex/attachments/d73a453d-1009-4aa8-853b-4102db258715/pasted-text.txt`.
- Source use case: none; this is repository agent-routing policy, not an
  extension behavior use case.
- JP1/AJS reference basis: none required; the directive explicitly preserves
  JP1/AJS and product behavior.
- Implementation-slice plan: the revised one-slice plan in `TASKS.md`, pending
  independent re-review and Human Approval.

## Requirements

- `AGENTS.md` must identify the main Codex agent as the default chat entrypoint
  and repository orchestrator.
- The main agent must be allowed to perform ad-hoc discussion, exploration,
  read-only investigation, analysis, troubleshooting, scope clarification,
  brainstorming, informal feedback, and routing classification directly.
- Discussion about an SDD stage must not activate a lifecycle role unless the
  requested operation or an active formal workflow requires that role-owned
  operation.
- Formal SDD lifecycle execution must be delegated to its designated custom
  subagent; the main agent must not execute the lifecycle skill directly,
  impersonate the lifecycle role, or edit the role-owned artifacts in place of
  delegation.
- Deterministic routing must state activation conditions, delegated role,
  main-agent responsibility, expected result, return route, and stop condition
  for feature intake, planning, plan review, plan revision, implementation,
  implementation review, approval commit, and Feature Exit.
- Formal SDD routing in `AGENTS.md` must describe role delegation without
  `$sdd-*` invocations or procedure-path selection instructions.
- Each SDD role definition must own its canonical procedure selection and
  state that it performs only the delegated operation, returns its result and
  recommended route to the parent orchestrator, and neither starts nor invokes
  the next lifecycle role.
- Handoffs must follow `Main -> Child -> Main -> Child`; child output may
  recommend a next role but must return control to the main orchestrator.
- Explicit user routing preferences must be honored when compatible with
  repository safety, approval gates, and role ownership; those constraints
  take precedence over user routing preference and default routing.
- Trivial changes permitted by the SDD SSOT must remain directly executable by
  the main agent unless another repository rule requires delegation.
- `Agent Entrypoints` must remain a configuration-location map, not a table
  instructing the main agent to select or invoke lifecycle skills.
- Release work must remain outside the SDD lifecycle, with any direct-skill
  exception made explicit only if no dedicated release role owns it.
- Changes must be limited to files required to make the orchestration boundary
  unambiguous and consistent; `docs/specs/README.md`, shared procedures, and
  lightweight adapters change only when inspection proves they are stale or
  contradictory.

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: none.
- Repository orchestration: `AGENTS.md` owns classification and routing;
  `.codex/agents/*.toml` own role authority and procedure selection;
  `.agents/skills/*/SKILL.md` remain reusable procedures; and
  `docs/specs/README.md` remains the SDD policy and approval-gate SSOT.

## Impact Analysis

### Dependency Impact

- Expected affected surfaces: `AGENTS.md` and the existing SDD role definitions
  under `.codex/agents/`.
- Conditional surfaces to inspect before planning: `.agent.md`,
  `.github/copilot-instructions.md`, `.agents/skills/*/SKILL.md`, and
  `docs/specs/README.md`; edit only a surface that contradicts or fails to
  propagate the selected boundary.
- Propagation decision: align main-agent routing and role parent/child
  contracts together while preserving the existing lifecycle stages, role
  catalog, procedures, and approval policy.

### Breaking Change Analysis

- User-visible extension behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none; no runtime or configuration
  change is permitted.
- JP1/AJS compatibility: unchanged.
- Changed scenarios: repository chat routing examples only; no product
  behavior scenario changes.

### Alternative Considerations

- Require delegation for all repository work: rejected because it would
  over-delegate ad-hoc discussion and investigation and reduce the main agent
  to a dispatcher.
- Let the main agent invoke lifecycle skills directly: rejected because it
  bypasses custom-role authority, model/effort, stop conditions, and the
  required parent/child boundary.
- Encode role-to-skill execution mapping in `AGENTS.md`: rejected because
  procedure selection belongs to each custom role definition.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`, following `docs/specs/README.md`.
- Scope changes requiring re-approval: changing lifecycle stages, role catalog,
  model or reasoning effort, Human Approval boundaries, implementation-slice
  policy, runtime/product behavior, or the direct-work/formal-operation
  boundary beyond the supplied directive.
- Approval boundary: unchanged; this feature clarifies routing only.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` unchanged.
- Web extension compatibility: unchanged; no production source is in scope.
- Desktop extension compatibility: unchanged; no production source is in
  scope.
- JP1/AJS definition compatibility: unchanged.
- Existing Human Approval, Completion Approval, and Closure Approval gates
  remain unchanged.

## Acceptance Criteria

The ten criteria below are AC1–AC10. The source directive's §22 criteria use a
separate C1–C20 numbering and are cross-mapped to AC1–AC10 in
`TRACEABILITY.md`; no AC11 is defined by this specification.

- The main agent is unambiguously the default chat entrypoint and may directly
  perform the listed ad-hoc work.
- SDD subject matter alone does not trigger delegation; formal operation intent
  does.
- Every formal SDD lifecycle stage routes from the main agent to the designated
  role and returns to the main agent before any next role is delegated.
- Main-agent direct lifecycle-skill execution and lifecycle-role impersonation
  are explicitly prohibited.
- Formal routing contains no `$sdd-*` invocation or reusable-procedure path as
  a main-agent execution instruction.
- Existing custom roles select their own canonical procedures and explicitly
  prohibit child-to-child lifecycle chaining.
- Explicit user routing is respected without bypassing safety, approval, or
  role ownership.
- Trivial-change direct handling and the existing approval boundaries remain
  intact.
- Routing review produces the expected result for all ten chat requests in the
  source directive, and repository search finds no remaining text that lets the
  main agent perform a formal role-owned SDD operation directly.
- `rtk pnpm run qlty` and Markdown lint pass for the implemented documentation
  scope.

## Non-Goals

- Redesigning the SDD lifecycle or approval gates.
- Adding or removing agent roles.
- Changing any role's model or reasoning effort.
- Changing implementation-slice policy, DDD, or Clean Architecture.
- Changing runtime code, tests, generated artifacts, configuration, product
  behavior, or JP1/AJS behavior.
- Rewriting shared skill procedures wholesale.
- Forcing all repository work through subagents.
- Reducing the main agent to a simple dispatcher.
- Selecting, modifying, or unblocking `import-definition-via-webapi`.

## Open Questions

- None. Targeted inspection classified the seven SDD skill sidecars as
  non-Main-facing and unchanged, and implementation must move to a dedicated
  non-`docs/...` feature branch before editing non-allowlisted paths.
