# Feature Tasks: SDD Planner Consolidation

## Agent Brief

- Purpose: consolidate initial planning and replanning into one explicit-mode
  `planner` role.
- Active slice: Slice 1, approved for implementation.
- Keep review, human approval, and commit gates intact.
- Leave execution profiles and extension code outside this feature.
- Read first: `SPECS.md`, this file, and `AGENTS.md`.
- Validate: reference scan, agent discovery, Markdown lint, and the docs-only
  qlty procedure in `docs/specs/README.md`.
- Next decision: implement Slice 1, then independent implementation review.

## Plan Status

- Status: Approved
- Planning scope: entire selected roadmap feature.
- Review status: human independent review accepted in the current conversation
  as a one-time exception to the `plan-reviewer` role; no agent verdict claimed.
- Human approval: Approved in the current conversation.
- Active implementation slice: Slice 1, approved.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1, one mode-aware `planner` role and the direct routing
  and skill references listed below. The same approval accepts human plan
  review in place of a `plan-reviewer` subagent for this slice only.
- Approved paths: `.codex/agents/plan-author.toml`,
  `.codex/agents/plan-reviser.toml`, `.codex/agents/planner.toml`,
  `.codex/agents/feature-author.toml`, `.codex/agents/plan-reviewer.toml`,
  `.agents/skills/sdd-plan-task/SKILL.md`,
  `.agents/skills/sdd-plan-task/agents/openai.yaml`, `AGENTS.md`,
  `docs/specs/README.md`, and
  `docs/specs/features/sdd-planner-consolidation/{SPECS,TASKS,TRACEABILITY}.md`.

## Completion Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: One mode-aware planner role

- Status: Approved
- Scope: replace `plan-author` and `plan-reviser` with one fixed-runtime
  `planner`; align all active routing references and mode contracts.
- User / Domain Value: one unambiguous planning role for the SDD harness.
- Cohesive Change Group: planning agent definitions, their direct handoffs,
  the skill entrypoint, and routing policy must change together to avoid a
  broken planning path.
- Acceptance: all criteria in `SPECS.md`.
- Dependencies: the shared `sdd-evidence` skill is already available; no
  dependency on later roadmap features.

#### Solution Shape Evidence

- Semantic owner: `.codex/agents/planner.toml` owns one custom-agent contract
  and fixed runtime settings (`gpt-6-sol`, medium reasoning, inherited from
  `plan-author`). The skill keeps Planning and Replanning
  procedures. Main's routing policy names the role and passes an explicit mode.
- Material abstraction: the `planner` role replaces two existing role
  contracts. It earns a boundary as the sole writer of plans while
  `plan-reviewer` remains the independent read-only reviewer.
- Public name and contract: `planner`; input must identify a selected feature
  and `planning` or `replanning`. Replanning additionally requires a Finding
  or explicit trigger and the approved plan context. Output returns the plan
  or minimal revision to Main without review or approval.
- Dependency direction: Main invokes planner; planner consumes the shared
  skill and evidence; reviewer and approval-committer remain separate. No
  extension-layer dependency changes.
- Existing capability: Codex custom-agent definitions and the current
  `sdd-plan-task` two-mode procedure suffice; no new framework or script.
- Automatic evidence: reference scan and agent discovery check the role name;
  reviewer judges mode boundaries, independence, and stop conditions.
- Replanning trigger: any change to reviewer independence, approval sequence,
  role ownership, mode contract, or affected surface requires a revised plan.

- Validation:
  - Check TOML syntax and verify the `planner` definition is discoverable.
  - Scan `AGENTS.md`, `docs/specs/README.md`, `.codex/agents`, and
    `.agents/skills` for active references to removed names.
  - Confirm both mode-specific input, output, and stop conditions against the
    prior role contracts and `sdd-plan-task` procedure.
  - Run `rtk pnpm run lint:md` and docs-only qlty evidence in disposable
    baseline/final snapshots per `docs/specs/README.md`.
- Production Readiness:
  - Failure mode: an undiscoverable agent or stale route stops planning;
    verify both before completion.
  - JP1/AJS compatibility: no definition or product code change.
  - Large or malformed input risk: none for extension input; long feature
    plans retain the existing planning procedure.
  - Desktop/web impact: no extension host change.
  - README/docs impact: update durable SDD routing policy; product README is
    unaffected.
  - CHANGELOG impact: none under the internal-harness criterion.
- Approval Boundary: after an independent `plan-reviewer` Ready verdict and
  human approval, one focused plan commit precedes agent/configuration edits.
  The completed slice needs an independent implementation review and separate
  Completion Approval before its focused commit.
- Risks: a new agent definition may not be discoverable; merging contracts
  can accidentally weaken the narrow Replanning scope or independent review.
- Out of Scope: other roadmap items, extension source, approval changes,
  model selection by Main, and new role variants.
- Expected implementation paths: `.codex/agents/plan-author.toml`,
  `.codex/agents/plan-reviser.toml`, `.codex/agents/planner.toml`,
  `.codex/agents/feature-author.toml`, `.codex/agents/plan-reviewer.toml`,
  `.agents/skills/sdd-plan-task/SKILL.md`,
  `.agents/skills/sdd-plan-task/agents/openai.yaml`, `AGENTS.md`,
  `docs/specs/README.md`, and this feature's `TASKS.md` and
  `TRACEABILITY.md`.

## Traceability

- `TRACEABILITY.md` required: yes; it maps the role and gate requirements to
  the single slice and its validation.

## Feature Exit

- Definition of Done status: pending slice implementation, independent review,
  completion commit, and Feature Exit.
- Durable documentation updates: routing policy in `AGENTS.md` and
  `docs/specs/README.md` belongs to Slice 1; evaluate roadmap state at exit.
- Open risks: agent discovery; a separate independent implementation review
  and Completion Approval remain required after implementation.
