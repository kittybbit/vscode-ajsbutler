# Feature Tasks: Clarify Main-Agent SDD Delegation

## Agent Brief

- Purpose: make formal SDD execution role-delegated while preserving direct
  main-agent handling of ad-hoc repository work.
- Approved or active slice: Slice 1 approved; implementation has not started.
- Do not change lifecycle, approval, role, model/effort, runtime, or product
  behavior.
- Read first: `SPECS.md`, this file, and the source correction directive.
- Read `TRACEABILITY.md` when checking requirement coverage.
- The implementation slice is an atomic repository-orchestration contract;
  do not leave routing, role, procedure, or adapter wording inconsistent.
- Before implementation, move this work from the current `docs/...` branch to
  a dedicated non-`docs/...` feature branch.
- Validate with the routing matrix, contradiction searches, the seven SDD
  skill-adapter audit, `rtk pnpm run qlty`, and `rtk pnpm run lint:md`.
- Approval policy and document roles remain owned by `docs/specs/README.md`.
- Other feature folders, including `import-definition-via-webapi`, remain out
  of scope.

## Sync Rule

- Update this file when plan, approval, validation, risk, or Feature Exit state
  changes.
- This file is the sole plan and current-state owner for this selected feature.
- Folder presence does not select inherited feature work.
- Update `docs/specs/roadmap.md` only if unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep implementation history and review transcripts out of this file.

## Plan Status

- Status: Complete; Ready for implementation after the plan-gate commit
- Planning scope: the full `clarify-main-agent-sdd-delegation` feature.
- Selection evidence: explicitly selected by the user; the folder is also the
  only untracked feature folder on `docs/roadmap-backlog-pruning`.
- Review status: Ready; independent plan-reviewer verdict recorded
- Human approval: Approved
- Active implementation slice: Slice 1 (approved; implementation not started)
- Slice count and order: one atomic slice, Slice 1 only.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 — Establish the Main-to-Role Orchestration Contract
- Approved paths: `AGENTS.md`, `.agent.md`,
  `.github/copilot-instructions.md`, all eight `.codex/agents/*.toml` role
  definitions, `.agents/skills/sdd-plan-task/SKILL.md`,
  `.agents/skills/sdd-review-plan/SKILL.md`,
  `.agents/skills/sdd-implement-task/SKILL.md`,
  `.agents/skills/sdd-review-implementation/SKILL.md`,
  `.agents/skills/sdd-feature-exit/SKILL.md`, `docs/specs/README.md`, and
  this selected feature's `TASKS.md`/`TRACEABILITY.md` evidence

Implementation must not start until the approved planning package receives
its approval-gate commit. The plan-gate commit must contain only the approved
paths above.

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

### Slice 1: Establish the Main-to-Role Orchestration Contract

- Status: Approved; blocked by the plan-gate commit and migration to a
  dedicated non-`docs/...` branch; implementation has not started.
- Scope: align the repository routing SSOT, every SDD custom-role contract,
  only the reusable procedures whose handoff wording permits child chaining,
  and both lightweight entrypoint adapters so that formal lifecycle work is
  always `Main -> Child -> Main`, while ad-hoc work stays with Main.
- User / Domain Value: chat requests are classified by operation intent;
  users retain direct access to Main for discussion and investigation, while
  formal SDD work consistently receives the designated role's authority,
  model/effort, procedure, stop conditions, and approval safeguards.
- Cohesive Change Group:
  - revise `AGENTS.md` with the main-agent boundary, allowed direct work,
    discussion-versus-execution distinction, routing precedence, concise
    role-only lifecycle overview, stage-by-stage deterministic delegation,
    and a location-only Agent Entrypoints map;
  - update all eight `.codex/agents/*.toml` role definitions to identify the
    canonical procedure, limit the child to its delegated operation, prohibit
    starting or invoking another lifecycle role, and require return of the
    result plus recommended route to the parent orchestrator;
  - correct only the contradictory next-stage handoff wording in
    `sdd-plan-task`, `sdd-review-plan`, `sdd-implement-task`,
    `sdd-review-implementation`, and `sdd-feature-exit` so each procedure
    returns recommendations/evidence to Main instead of directing a child to
    another role or lifecycle skill;
  - narrowly synchronize `docs/specs/README.md`: preserve every lifecycle and
    approval rule, but distinguish optional ad-hoc subagent delegation from
    mandatory formal role delegation and remove the claim that the
    coordinating Main agent itself owns role-owned artifact edits;
  - update `.agent.md` and `.github/copilot-instructions.md` only where their
    current summaries imply direct Codex lifecycle execution, direct skill
    discovery, child-to-child sequencing, or an inaccurate count of the seven
    lifecycle roles plus the approval-committer gate role;
  - audit the seven SDD skill adapters under
    `.agents/skills/*/agents/openai.yaml` as non-Main-facing invocation
    adapters; targeted inspection found no Main-facing contradiction, so
    preserve all seven unchanged. If later implementation evidence contradicts
    this classification, stop and replan before editing an adapter;
- Acceptance:
  - the external correction directive §22 criteria 1–20 are explicitly
    cross-mapped in `TRACEABILITY.md` to SPECS acceptance criteria AC1–AC10;
    the directive's C1–C20 numbering and the feature specification's AC1–AC10
    numbering remain distinct and complete;
  - Main is the default chat entrypoint and may directly perform the listed
    ad-hoc activities, including informal SDD discussion;
  - every formal stage (feature intake, planning, plan review, plan revision,
    implementation, implementation review, approval commit, and Feature Exit)
    has activation, delegate, Main responsibility, expected result, return
    route, and stop condition;
  - `AGENTS.md` contains no formal-routing instruction for Main to invoke an
    `$sdd-*` skill or select a procedure path;
  - the seven SDD skill adapters are classified as non-Main-facing and remain
    unchanged; a contradictory implementation finding would require Replanning
    Mode rather than an unapproved sidecar edit;
  - every role owns exactly its existing canonical procedure and returns to
    Main without invoking or spawning the next lifecycle role;
  - explicit user routing preference and trivial-change handling remain
    subordinate only to safety, approval gates, and role ownership;
  - SDD lifecycle, roles, fixed model/effort, Human/Completion/Closure
    Approval gates, and release exception semantics remain unchanged.
- Validation:
  - manually evaluate all ten routing requests in the source directive and
    record expected route versus actual route in the evidence matrix, adding
    explicit-role requests, Main-specified investigation, safety/approval
    override, and trivial-change direct handling cases;
  - record expected versus actual routes for all eight formal stages:
    feature-author intake, plan-author planning, plan-reviewer review,
    plan-reviser replanning, implementer execution,
    implementation-reviewer review, approval-committer gate handling, and
    feature-closer Feature Exit; show approval-committer separately for plan,
    completion, and closure gates, with Main between every child;
  - answer all twelve final-confirmation questions in the source directive
    from the resulting repository text without relying on unstated intent;
  - search `AGENTS.md`, `.agent.md`, `.github/copilot-instructions.md`, and
    applicable `docs/specs/README.md` routing text for a no-direct-Main path:
    `$sdd-*`, reusable-procedure paths, direct lifecycle execution, or role
    impersonation; manually classify role-owned references and legitimate
    parent-return wording rather than treating every textual match as a
    contradiction;
  - inspect every `.codex/agents/*.toml` for its canonical procedure, delegated
    operation boundary, no-next-role rule, and parent-return contract;
  - inspect all seven SDD `.agents/skills/*/agents/openai.yaml` sidecars,
    excluding the intentional release adapter; record the observed
    non-Main-facing classification and preserve them unchanged;
  - re-count and classify `.agent.md`'s role summary as seven lifecycle roles
    plus `approval-committer`, with release outside the SDD lifecycle;
  - verify that the feature-author's synchronized `SPECS.md` names the
    revised `TASKS.md` plan and records no remaining Open Questions;
  - search role definitions and the five changed SDD procedures for wording
    that instructs a child to send, hand off, start, spawn, or invoke a next
    lifecycle role/skill; manually classify any remaining match;
  - compare `docs/specs/README.md` lifecycle stages, gate prerequisites, commit
    scope, and feature-close rules before and after the change; expect no
    semantic policy change;
  - confirm changed paths contain no runtime source, tests, generated
    artifacts, configuration, product docs, use cases, README, CHANGELOG, or
    unrelated feature folders; the seven sidecars remain unchanged because the
    targeted audit found no direct Main-facing contradiction;
  - run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
    `rtk git diff --check`.
- Production Readiness:
  - failure mode: ambiguous activation could over-delegate discussion or let
    Main execute formal work; cover both directions with the ten-case review;
  - failure mode: partial synchronization could preserve child chaining;
    treat the listed change group as one atomic review and commit boundary;
  - JP1/AJS and large/malformed-input compatibility: unchanged because no
    extension behavior or input processing changes;
  - desktop/web and VS Code compatibility: unchanged; preserve
    `package.json` and all extension/runtime configuration surfaces; the
    `.codex/agents/*.toml` files are repository routing definitions in scope,
    not extension/runtime configuration;
  - README/user docs and CHANGELOG: no update, because this is internal
    repository orchestration with no externally observable extension change;
  - rollback: revert the single focused completion commit if routing tools
    misinterpret the clarified contract; no data or runtime migration exists.
- Approval Boundary:
  - implementation may change only `AGENTS.md`, `.agent.md`,
    `.github/copilot-instructions.md`, `docs/specs/README.md`,
    `.codex/agents/approval-committer.toml`,
    `.codex/agents/feature-author.toml`,
    `.codex/agents/feature-closer.toml`,
    `.codex/agents/implementation-reviewer.toml`,
    `.codex/agents/implementer.toml`, `.codex/agents/plan-author.toml`,
    `.codex/agents/plan-reviewer.toml`,
    `.codex/agents/plan-reviser.toml`,
    `.agents/skills/sdd-feature-exit/SKILL.md`,
    `.agents/skills/sdd-implement-task/SKILL.md`,
    `.agents/skills/sdd-plan-task/SKILL.md`,
    `.agents/skills/sdd-review-implementation/SKILL.md`,
    `.agents/skills/sdd-review-plan/SKILL.md`, and this selected feature's
    `TASKS.md`/`TRACEABILITY.md` evidence; the seven SDD sidecars are
    inspection-only and are not approved paths;
  - no role addition/removal, model/effort change, lifecycle or approval
    policy change, or expansion to another procedure is authorized;
  - because `AGENTS.md`, `.agent.md`, and `.agents/**` are outside the Verify
    docs-only allowlist, implementation must not occur on
    `docs/roadmap-backlog-pruning`; rename it or start a dedicated
    non-`docs/...` feature branch after the approved plan commit and before
    implementation edits.
- Dependencies: feature intake complete; independent plan review returned Ready,
  Human Approval identifies the exact scope and paths, the planning package
  still requires its approval-gate commit, and the branch must satisfy the
  non-doc naming policy. There is no later implementation slice.
- Risks:
  - duplicating SDD policy in routing or adapters could create competing SSOTs;
  - broad prohibition wording could turn Main into a dispatcher or block
    informal analysis;
  - narrow wording could leave a main-to-skill or child-to-child path;
  - changing procedure semantics instead of only return routing could alter
    lifecycle or approval behavior;
  - generic `handoff` search terms can produce legitimate parent-return
    matches, so textual search requires manual contextual review.
- Out of Scope: extension/runtime code, tests, generated artifacts,
  extension/runtime configuration, product/JP1/AJS behavior, DDD/Clean
  Architecture, lifecycle redesign,
  approval changes, role/model changes, wholesale procedure rewrites,
  release execution, `release-extension` changes, use cases, roadmap, README,
  CHANGELOG, and `import-definition-via-webapi`.

  `.codex/agents/*.toml` agent-routing definitions are explicitly in scope;
  they are repository orchestration metadata, not extension/runtime
  configuration.

## Impact Investigation

- Required durable surface: `AGENTS.md`; it currently puts role names and
  direct skill invocations at the same level and lacks the requested
  main-agent activation boundary.
- Required role surface: all eight `.codex/agents/*.toml`; each selects its
  procedure today, but none states the complete delegated-child contract and
  several direct work to a next child or gate instead of returning to Main.
- Required procedure surface: the five procedures named in Slice 1 contain a
  concrete direct next-role/next-skill handoff contradiction. The intake and
  commit procedures do not need implementation edits; the release procedure
  remains an intentional non-SDD direct-skill exception because no dedicated
  release role exists.
- Required adapter surface: `.agent.md` presents lifecycle roles as a direct
  chain and requires an accurate seven-lifecycle-role plus
  `approval-committer` count; `.github/copilot-instructions.md` describes
  Codex/direct skill discovery without the formal delegation boundary. The
  seven SDD skill sidecars require a separate non-Main-facing classification
  audit; the release adapter is an intentional non-SDD exception.
- Sidecar audit result: `sdd-commit-gate`, `sdd-create-feature`,
  `sdd-feature-exit`, `sdd-implement-task`, `sdd-plan-task`,
  `sdd-review-implementation`, and `sdd-review-plan` each name a delegated
  role and canonical skill, with no instruction authorizing Main to execute a
  formal operation or to chain to another role; all seven remain unchanged.
- Required SDD SSOT surface: `docs/specs/README.md` retains policy ownership,
  but its generic bounded-delegation rule currently says the coordinator alone
  owns SDD artifact updates, conflicting with mandatory role-owned formal
  operations. Only that conflict and immediately related workflow wording may
  be synchronized.
- Feature-document synchronization is complete: `SPECS.md` names the revised
  `TASKS.md` plan, maps the directive's C1–C20 criteria to AC1–AC10 through
  `TRACEABILITY.md`, and records no remaining Open Questions.
- No use-case, roadmap, architecture, source symbol, test, README, or CHANGELOG
  impact was found.

## Traceability

- `TRACEABILITY.md` required: yes
- Reason: this non-trivial policy feature spans Main routing, seven lifecycle
  roles plus the approval-committer gate, five contradictory procedure
  handoffs, two lightweight adapters, seven skill-adapter classifications,
  approval preservation, and repository-wide textual validation.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates: `AGENTS.md` and the narrow SDD policy wording
  in `docs/specs/README.md`; role/procedure/adapter contracts are configuration
  and reusable operational guidance rather than product documentation.
- Roadmap update: not required; no unfinished product work, ordering, entry
  condition, or unresolved product concern changes.
- Open risks: independent review must confirm that the one-slice atomic scope
  is minimal and that no wording changes lifecycle or approval semantics.

## Validation

- [x] Intake documents contain no template placeholders.
- [x] Selected feature and branch evidence confirmed.
- [x] Roadmap and repository use-case impact evaluated: no update required.
- [x] Conditional role, procedure, adapter, and SDD SSOT impact recorded;
      sidecar classification is complete and feature-author synchronization of
      `SPECS.md` is confirmed.
- [x] Complete slice-level validation and production-readiness plan defined.
- [x] Planning validation passed: `rtk pnpm run qlty` and
      `rtk pnpm run lint:md`.
      The first qlty attempt could not create its external rolling log in the
      sandbox; an approved retry passed with no issues.
- [x] Lightweight feature structure check passed: every feature `TASKS.md`
      has an Agent Brief and no feature `CONTEXT.md` exists.
- [x] Plan-review Findings addressed for sidecars, no-direct-Main search
      coverage, route evidence, criteria-source mapping, synchronized SPECS
      state, and `.agent.md` role-count accuracy.
- [x] Independent plan review completed with Ready verdict.
- [x] Human Approval recorded for the exact implementation boundary.
- [ ] Approved planning package committed.
- [ ] Dedicated non-`docs/...` feature branch established before implementation.
- [ ] Slice 1 routing and contradiction validation completed.
- [ ] `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
      `rtk git diff --check` pass for implementation.

## Risks

- The single slice is intentionally broad in file count but indivisible in
  responsibility: a partial commit would leave the orchestration contract
  internally contradictory and cannot satisfy the acceptance criteria.
- Approval is recorded; implementation remains blocked until the plan-gate
  commit succeeds.
- The current branch name is unsuitable for the planned non-allowlisted paths.

## Production Readiness

- Failure modes: over-delegation, under-delegation, role impersonation, direct
  lifecycle-skill execution, child chaining, or approval bypass.
- Adapter failure mode: a skill sidecar could be mistaken for a Main-facing
  lifecycle entrypoint; targeted inspection found the seven SDD sidecars are
  role-facing adapters, and any contradictory implementation evidence must
  return to Replanning Mode before an adapter path is added.
- JP1/AJS compatibility: unchanged.
- Large or malformed input risk: none.
- Desktop/web and VS Code compatibility: unchanged.
- README/user-doc impact: none.
- CHANGELOG impact: none.
