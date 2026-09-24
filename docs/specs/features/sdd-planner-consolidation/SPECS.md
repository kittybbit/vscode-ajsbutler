# Feature Specification: SDD Planner Consolidation

## Purpose

Use one `planner` custom agent for both initial planning and review-driven
replanning, with an explicit mode for each operation.

## Minimal Context

- Current decision: replace the two planning agent definitions and their
  routing references with one mode-aware role.
- Read first: this file and `TASKS.md`.
- SDD lifecycle and approval policy remain in `docs/specs/README.md`.

## Origin

- Source: `docs/specs/roadmap.md` SDD Harness Optimization Sequence item 1 and
  the user's SDD harness improvement brief, section 7.
- Feature kind: roadmap feature.
- JP1/AJS basis: not applicable; this changes the development harness only.
- Implementation-slice plan: `TASKS.md`.

## Requirements

1. A single discoverable `planner` agent supports explicit Planning and
   Replanning modes through the existing `sdd-plan-task` procedure.
2. Planning produces a complete feature slice plan. Replanning changes the
   smallest affected plan area and preserves completed and unrelated approved
   slices.
3. Main routes both operations to `planner` and supplies the mode and its
   required inputs. Review Findings return through Main to `planner` in
   Replanning mode.
4. Independent `plan-reviewer` review, human approval, and the focused plan
   commit remain required before implementation.
5. Agent discovery, routing documentation, and the skill entrypoint agree on
   the single role name and mode contract. No stale active references route to
   `plan-author` or `plan-reviser`.

## Architecture

- Domain, application, presentation, infrastructure: no extension code change.
- Harness owner: `.codex/agents/planner.toml` owns agent runtime configuration
  and role contract; `.agents/skills/sdd-plan-task/SKILL.md` owns the shared
  planning procedure; `AGENTS.md` and `docs/specs/README.md` own routing and
  lifecycle policy.
- Evidence collection continues to use the existing `sdd-evidence` skill.

## Impact Analysis

### Dependency Impact

- Affected: the two existing planning agent definitions, `feature-author` and
  `plan-reviewer` handoffs, `AGENTS.md`, `docs/specs/README.md`, and the
  `sdd-plan-task` entrypoint and procedure where mode wording requires it.
- Propagation: update all active routing references together; leave other SDD
  roles, approval gates, and extension source untouched.

### Breaking Change Analysis

- Existing agent name invocations must change from `plan-author` and
  `plan-reviser` to `planner`; this is an intentional harness interface change.
- No extension API, DTO, schema, user-visible behavior, VS Code minimum,
  desktop host, web host, parser, or telemetry change.

### Alternatives

- Keep two agents using the same skill: rejected because their duplicated
  contracts and handoffs are the target of this feature.
- Add separate mode-specific skills: rejected because the existing procedure
  already owns both modes and the review boundary is unchanged.

## Compatibility

- Preserve `package.json` `engines.vscode` and both extension hosts without
  touching extension code.
- Preserve the independent review and all human approval gates.
- Do not depend on Main selecting a model or reasoning level at spawn time;
  `planner` has its own fixed runtime configuration. Start with the existing
  `plan-author` setting (`gpt-6-sol`, medium reasoning); changing that setting
  is a separate runtime-tuning decision, not a planning mode decision.

## Acceptance Criteria

1. Agent discovery recognizes exactly one planning writer role named
   `planner`, and both modes are usable with explicit input conditions.
2. A repository reference scan finds no active route to the removed agent
   names; historical Git content and temporary feature records are excluded.
3. Planning and Replanning requirements retain their distinct scope and stop
   conditions, and `plan-reviewer` remains independent and read-only.
4. The documented path from review to human approval to focused plan commit is
   unchanged except for the planning role name.
5. Relevant Markdown, agent-definition, and repository quality checks pass.

## Non-Goals

- Deterministic approval commits, execution profiles, deep agent variants,
  Feature Exit role changes, or a new evidence implementation.
- Extension runtime or test behavior changes.
- Relaxing independent review or any human approval boundary.

## Open Questions

- None for the proposed role contract. Actual implementation remains subject
  to independent plan review and human approval.
