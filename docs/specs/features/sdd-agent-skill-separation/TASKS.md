# TASKS: sdd-agent-skill-separation

## Agent Brief

- Purpose: separate agent authority and lifecycle routing from reusable SDD
  procedures while preserving the existing repository gates.
- Approved or active slice: Slices 1–5 are complete; Slice 6 is in progress.
- Do not: edit runtime code, tests, generated artifacts, or routing/role
  definitions in Slice 6.
- Do not: broaden the feature into SDD policy replacement, product behavior,
  JP1/AJS changes, or speculative roles.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, `AGENTS.md`,
  `docs/specs/README.md`, `.agent.md`, `.github/copilot-instructions.md`, and
  the current `.codex/skills/*/SKILL.md` files.
- Validate: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` and targeted
  Markdown/reference checks for the new shared skill paths.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: complete independent review of Slice 1, then continue with
  the next approved slice when no actionable finding remains.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  this selected feature owns active branch implementation work.
- Inherited feature folders remain outside this feature's scope.
- Update `docs/specs/roadmap.md` only if Feature Exit identifies unfinished
  repository-level future work or ordering that must survive this transient
  feature.
- Keep this file focused on slices, approval, validation, risks, production
  readiness, and Feature Exit readiness; do not turn it into a work log.

## Plan Status

- Status: In Progress
- Planning scope: define the reusable-skill canonical location, Codex role
  contracts, deterministic SDD routing, independent implementation review,
  Feature Exit ownership, entry-point adapters, and packaging/validation
  integrity.
- Review status: Reviewed (`sdd-review-plan`)
- Human approval: Approved
- Active implementation slice: Slice 6 — Packaging, CI Classification, and
  Final Integrity Validation

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: All six implementation slices (Slices 1–6) as recorded in
  this file.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

## Role / Skill / Adapter Mapping

This table is the binding implementation mapping. Codex role files are loaded
by the routing decision in `AGENTS.md`; Codex skill adapters are retained for
the existing `$skill-name` invocation surface and explicitly point to the
canonical repository-relative procedure. No automatic discovery of
`.agents/skills` is assumed.

<!-- markdownlint-disable MD013 -->

| Role                      | Codex role definition                      | Canonical reusable skill                            | Codex invocation adapter                                                          | Handoff                                  |
| ------------------------- | ------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| `feature-author`          | `.codex/agents/feature-author.md`          | `.agents/skills/sdd-feature-intake/SKILL.md`        | `.codex/skills/sdd-create-feature/SKILL.md` / `$sdd-create-feature`               | `plan-author`                            |
| `plan-author`             | `.codex/agents/plan-author.md`             | `.agents/skills/sdd-plan-task/SKILL.md`             | `.codex/skills/sdd-plan-task/SKILL.md` / `$sdd-plan-task`                         | `plan-reviewer`                          |
| `plan-reviewer`           | `.codex/agents/plan-reviewer.md`           | `.agents/skills/sdd-review-plan/SKILL.md`           | `.codex/skills/sdd-review-plan/SKILL.md` / `$sdd-review-plan`                     | `plan-reviser` or Human Approval         |
| `plan-reviser`            | `.codex/agents/plan-reviser.md`            | `.agents/skills/sdd-plan-task/SKILL.md`             | `.codex/skills/sdd-plan-task/SKILL.md` / `$sdd-plan-task` in Replanning Mode      | `plan-reviewer`                          |
| `implementer`             | `.codex/agents/implementer.md`             | `.agents/skills/sdd-implement-task/SKILL.md`        | `.codex/skills/sdd-implement-task/SKILL.md` / `$sdd-implement-task`               | `implementation-reviewer`                |
| `implementation-reviewer` | `.codex/agents/implementation-reviewer.md` | `.agents/skills/sdd-review-implementation/SKILL.md` | `.codex/skills/sdd-review-implementation/SKILL.md` / `$sdd-review-implementation` | `implementer` or completion approval     |
| `feature-closer`          | `.codex/agents/feature-closer.md`          | `.agents/skills/sdd-feature-exit/SKILL.md`          | `.codex/skills/sdd-feature-exit/SKILL.md` / `$sdd-feature-exit`                   | Human feature-close approval or planning |

`release-extension` is intentionally outside this role table. Its canonical
procedure is `.agents/skills/release-extension/SKILL.md`, and its existing
Codex adapter remains `$release-extension` without an SDD lifecycle role. Its
fixed adapter metadata is `Luna / medium`; it does not require a
`.codex/agents/release-extension.md` role definition.

<!-- markdownlint-enable MD013 -->

## Implementation Slices

### Slice 1: Shared Skill Procedure Canonicalization

- Status: Complete
- Scope: classify all five current `.codex/skills` entries and separate
  reusable procedure content from role authority and repository policy. Create
  the canonical shared procedures under `.agents/skills` without mechanically
  copying agent responsibilities. Keep `release-extension` as a reusable
  repository release procedure; do not create an SDD role for it.
- Affected files and references:
  - New `.agents/skills/sdd-feature-intake/SKILL.md` derived from
    `.codex/skills/sdd-create-feature/SKILL.md`.
  - New `.agents/skills/sdd-plan-task/SKILL.md` derived from the Planning and
    Replanning procedure in `.codex/skills/sdd-plan-task/SKILL.md`.
  - New `.agents/skills/sdd-review-plan/SKILL.md` derived from
    `.codex/skills/sdd-review-plan/SKILL.md`.
  - New `.agents/skills/sdd-implement-task/SKILL.md` derived from the
    implementation procedure in `.codex/skills/sdd-implement-task/SKILL.md`.
  - New `.agents/skills/release-extension/SKILL.md` derived from
    `.codex/skills/release-extension/SKILL.md`.
  - Every existing `.codex/skills/*/SKILL.md` path is retained as a thin
    Codex adapter with an explicit canonical procedure reference; no current
    `$sdd-*` invocation is removed.
- Existing `.codex/skills/*/agents/openai.yaml` remains invocation metadata,
  not a role-authority source. The release adapter metadata records
  `Luna / medium`.
  - `.codex/skills/release-extension/agents/openai.yaml` is the exact adapter
    metadata owner for the fixed `Luna / medium` assignment.
- User / Domain Value: gives Codex and non-Codex agents one canonical,
  reusable procedure source while preserving existing skill behavior.
- Cohesive Change Group: skill classification, procedure extraction,
  canonical paths, and stale-reference prevention.
- Acceptance:
  - All five current skills have an explicit classification and disposition.
  - Shared procedures contain workflow, investigation, checklist, validation,
    and repository technical knowledge, but not model assignment, role
    authority, human approval, or lifecycle ownership.
  - `release-extension` remains available as a reusable procedure and is not
    treated as one of the seven SDD roles.
  - The `$release-extension` adapter has fixed `Luna / medium` metadata and
    does not participate in SDD lifecycle handoffs.
  - Every retained `.codex/skills` entry points to the exact canonical path in
    the Role / Skill / Adapter Mapping; no conditional adapter is left for a
    later slice.
- Validation: targeted old/new path search; direct Markdown lint for
  `.agents/skills/**/*.md` and `.codex/skills/**/*.md`; `rtk pnpm run qlty`;
  release adapter metadata syntax/key check using the existing
  `interface.default_prompt` schema and exact `Luna / medium` text; manual
  invocation reachability check for each retained `$sdd-*` and
  `$release-extension` adapter.
- Production Readiness:
  - Failure mode: an agent silently follows stale, duplicated, or missing
    procedure text.
  - JP1/AJS compatibility: not applicable; no parser or definition-file
    interpretation changes.
  - Large or malformed input risk: not applicable.
  - Desktop/web impact: no extension runtime impact; confirm shared files do
    not enter production imports.
  - README/docs impact: update only references that become stale; durable
    routing changes belong to Slice 5.
  - CHANGELOG impact: none expected; internal repository process only.
- Approval Boundary: responsibility classification and reusable procedure
  extraction only; role definitions and routing remain later slices.
- Dependencies: intake requirements and current skill/entry-point inventory.
- Risks: Codex may require a local adapter format that cannot directly include
  a repository-relative shared skill; validate the adapter mechanism before
  choosing a symlink or duplicated procedure.
- Out of Scope: generic automatic skill discovery, product behavior, and
  runtime source changes.
- Traceability: repository operating-policy goal (no product use case);
  `SPECS.md` Requirements R1–R2, R4, and R9, Architecture, Compatibility,
  and Acceptance Criteria; prove with the five-skill inventory, exact adapter
  mapping, fixed model/effort search, stale-path search, and Markdown/qlty
  validation.

### Slice 2: Planning Lifecycle Role Definitions

- Status: Complete
- Scope: add Codex role definitions for `feature-author`, `plan-author`,
  `plan-reviewer`, and `plan-reviser`. Each definition must contain fixed
  model/effort, allowed input state, responsibility, authority, forbidden
  actions, output contract, next handoff, and stop/escalation condition.
- Affected files and references:
  - New `.codex/agents/feature-author.md` using the shared feature-intake
    procedure from Slice 1.
  - New `.codex/agents/plan-author.md` using the shared planning procedure.
  - New `.codex/agents/plan-reviewer.md` using the shared plan-review
    procedure; read-only and verdict-owning.
  - New `.codex/agents/plan-reviser.md` using the shared replanning
    procedure; Findings-driven and not a plan reviewer.
  - `AGENTS.md` and product entry points are not edited until Slice 5, except
    for a reference needed to validate the role contract.
- User / Domain Value: makes intake, planning, independent plan review, and
  Findings-driven revision deterministic and independently handoffable.
- Cohesive Change Group: planning-stage role contracts and their shared skill
  references.
- Acceptance:
  - `feature-author` owns intake and initial feature artifacts only.
  - `plan-author` owns initial slice decomposition and ordering only.
  - `plan-reviewer` is read-only and returns `Ready` or actionable `Findings`.
  - `plan-reviser` changes the plan only in response to Findings or an
    explicitly identified replanning trigger.
  - `feature-author` and `plan-author` specify `Sol / medium`; the two review
    roles specify `Luna / xhigh`.
  - None of the four roles grants Human Approval or edits runtime code.
- Validation: role-contract checklist; fixed model/effort search; forbidden
  action and handoff review; exact role-to-skill mapping check; Markdown lint;
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: a planning role crosses the approval boundary or review
    authority is confused with plan authorship.
  - JP1/AJS compatibility: not applicable; preserve current compatibility
    policy by reference only.
  - Large or malformed input risk: not applicable.
  - Desktop/web impact: no extension runtime impact.
  - README/docs impact: entry-point changes are deferred to Slice 5.
  - CHANGELOG impact: none expected.
- Approval Boundary: planning role contracts only; no routing or runtime
  implementation.
- Dependencies: Slice 1.
- Risks: role definitions may duplicate `docs/specs/README.md`; keep policy
  links and role-specific authority separate.
- Out of Scope: implementer, implementation-reviewer, feature-closer, and
  human approval.
- Traceability: repository operating-policy goal (no product use case);
  `SPECS.md` Requirements R3–R5, Architecture, and Acceptance Criteria; prove
  with the four role files, fixed model/effort search, authority/handoff
  review, and Markdown/qlty validation.

### Slice 3: Implementation and Independent Review Role Definitions

- Status: Complete
- Scope: add Codex role definitions for `implementer` and
  `implementation-reviewer`, and define the Findings-to-implementer handoff
  without allowing the reviewer to edit runtime files.
- Affected files and references:
  - New `.codex/agents/implementer.md` using the shared implementation
    procedure from Slice 1.
  - New `.codex/agents/implementation-reviewer.md` using a new reusable
    procedure extracted from the review portions of the current
    `.codex/skills/sdd-implement-task/SKILL.md`.
  - New `.agents/skills/sdd-review-implementation/SKILL.md` for the reusable
    implementation-review checklist and validation procedure.
  - New `.codex/skills/sdd-review-implementation/SKILL.md` and
    `.codex/skills/sdd-review-implementation/agents/openai.yaml` as the
    mandatory `$sdd-review-implementation` Codex adapter.
- User / Domain Value: separates approved-slice execution from independent
  scope, regression, architecture, compatibility, privacy, and production
  readiness review.
- Cohesive Change Group: implementation authority, read-only review authority,
  and the Findings handoff between them.
- Acceptance:
  - `implementer` accepts only a reviewed and human-approved slice and returns
    to planning when scope or design changes.
  - `implementation-reviewer` is read-only and returns `Ready` or actionable
    `Findings`.
  - Findings return to `implementer`; they do not silently change the plan or
    approval boundary.
  - `implementer` and `implementation-reviewer` specify `Luna / xhigh`.
  - Review procedure retains desktop/web, VS Code, parser/UI boundary,
    telemetry privacy, Node-only assumption, validation, and diff-minimality
    checks from the current implementation skill.
- Validation: role/skill cross-reference review; read-only and handoff checks;
  exact adapter reachability check; Markdown lint; `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: implementation is accepted without an independent review,
    or a scope change bypasses replanning and re-approval.
  - JP1/AJS compatibility: preserve existing parser, definition-file, and
    host compatibility gates by reference; no JP1/AJS behavior change.
  - Large or malformed input risk: retain the existing production-readiness
    review points for future code slices.
  - Desktop/web impact: the reviewer must retain both host checks for every
    future shared-code slice.
  - README/docs impact: role references are synchronized in Slice 5.
  - CHANGELOG impact: none expected.
- Approval Boundary: implementation and independent-review role contracts;
  no runtime implementation.
- Dependencies: Slice 1 and the planning-role terminology from Slice 2.
- Risks: current `sdd-implement-task` combines implementation and final
  review; extraction must preserve all review coverage without duplicating it.
- Out of Scope: changing validation policy or implementing a slice.
- Traceability: repository operating-policy goal (no product use case);
  `SPECS.md` Requirements R3–R6 and R8, Architecture, Compatibility, and
  Acceptance Criteria; prove with the two role files, mandatory review adapter,
  read-only/Findings-handoff review, and Markdown/qlty validation.

### Slice 4: Feature Exit and Durable Knowledge Role

- Status: Complete
- Scope: add the independent `feature-closer`, extract a reusable Feature Exit
  procedure, and update the SDD lifecycle reference so Feature Exit is no
  longer owned by `sdd-plan-task`.
- Affected files and references:
  - New `.codex/agents/feature-closer.md` specifying `Luna / xhigh`.
  - New `.agents/skills/sdd-feature-exit/SKILL.md` extracted from the current
    Feature Exit sections of `.codex/skills/sdd-plan-task/SKILL.md`.
  - New `.codex/skills/sdd-feature-exit/SKILL.md` and
    `.codex/skills/sdd-feature-exit/agents/openai.yaml` as the mandatory
    `$sdd-feature-exit` Codex adapter.
  - Remove Feature Exit procedure ownership from the shared
    `sdd-plan-task` skill created in Slice 1.
  - Update `docs/specs/README.md` lifecycle diagram, workflow references, and
    Feature Exit ownership while keeping its policy as the SDD SSOT.
  - Search and resolve every remaining `sdd-plan-task` Feature Exit ownership
    claim in the canonical shared skill and retained Codex planning adapter;
    route any `AGENTS.md` or entry-point routing claim to Slice 5 for the
    same final stale-authority audit.
- User / Domain Value: prevents temporary feature knowledge and repository
  invariants from being lost when a feature folder is closed.
- Cohesive Change Group: Feature Exit authority, durable propagation, guardrail
  synchronization, and lifecycle policy reference.
- Acceptance:
  - `feature-closer` verifies the Feature Definition of Done and required
    traceability before closure.
  - It evaluates durable knowledge and guardrail synchronization, but only
    propagates approved, implemented, and validated knowledge.
  - A new design decision returns to planning/replanning; it is not invented
    by the closer.
  - Human feature-close approval remains required.
  - `docs/specs/README.md`, the canonical `sdd-plan-task` procedure, and the
    retained `.codex/skills/sdd-plan-task/SKILL.md` adapter contain no claim
    that planning owns Feature Exit.
  - Slice 5 receives an explicit list of any remaining routing-only claims in
    `AGENTS.md`, `.agent.md`, `.github/copilot-instructions.md`, or `README.md`
    and resolves them before the feature can pass its final integrity check.
- Validation: lifecycle reference search; Feature Definition of Done and
  Durable Documentation Gate cross-check; exact canonical/adapter stale-claim
  search; Markdown lint; `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: a feature closes while reusable knowledge, an unfinished
    owner, or a required guardrail exists only in temporary docs.
  - JP1/AJS compatibility: preserve the existing durable-document gate for
    any future feature that affects JP1/AJS behavior.
  - Large or malformed input risk: not applicable to this coordination slice.
  - Desktop/web impact: no runtime impact.
  - README/docs impact: `docs/specs/README.md` lifecycle references change;
    README user behavior remains unchanged.
  - CHANGELOG impact: none expected for internal process policy.
- Approval Boundary: Feature Exit responsibility and durable propagation
  procedure only; do not close this feature in the same slice.
- Dependencies: Slices 1 and 2; align review handoffs with Slice 3.
- Risks: Feature Exit policy may be duplicated in the role definition instead
  of referenced from `docs/specs/README.md`.
- Out of Scope: closing the feature, deleting its folder, or changing product
  behavior.
- Traceability: repository operating-policy goal (no product use case);
  `SPECS.md` Requirements R3, R7–R8, Architecture, Compatibility, and
  Acceptance Criteria; prove with lifecycle reference search, canonical and
  retained-adapter stale-claim search, and Markdown/qlty validation.

### Slice 5: AGENTS Master Orchestrator and Entry-Point Adapters

- Status: Complete
- Scope: revise deterministic SDD routing and synchronize all current
  agent-specific entry points as thin adapters to the shared skills and
  Codex role definitions.
- Affected files and references:
  - `AGENTS.md` AI Agent Routing Guide, SDD workflow routing, role-to-stage
    mapping, allowed handoffs, and stop conditions.
  - `.agent.md` lightweight index from generic entry point to `AGENTS.md`,
    `.codex/agents`, and `.agents/skills`.
  - `.github/copilot-instructions.md` Copilot entry-point references and
    routing instructions.
  - `README.md` development links currently pointing to `.codex/skills/`.
  - Existing `.codex/skills/*/agents/openai.yaml` prompts updated to invoke
    the correct role plus shared procedure, without becoming policy SSOT.
- User / Domain Value: gives all supported agents one discoverable,
  deterministic routing path without copying SDD policy.
- Cohesive Change Group: routing algorithm, role/stage handoff map, and
  product-specific entry-point adapters.
- Acceptance:
  - Routing distinguishes trivial change, intake, planning, plan review,
    plan revision, approved implementation, implementation review, Findings,
    Feature Exit, and closure approval.
  - All seven roles have one routing owner and explicit next handoff.
  - `AGENTS.md` remains concise and links to `docs/specs/README.md` instead of
    duplicating policy.
  - `.agent.md`, Copilot instructions, README, and Codex metadata contain no
    stale authoritative `.codex/skills` reference and no stale Feature Exit
    routing claim.
- Validation: targeted reference search; routing table review against all
  seven role definitions; Markdown lint; `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: an agent selects the wrong lifecycle stage, follows a stale
    adapter, or bypasses Human Approval.
  - JP1/AJS compatibility: no product behavior or definition-file change.
  - Large or malformed input risk: not applicable.
  - Desktop/web impact: no runtime impact.
  - README/docs impact: update only durable entry-point links and routing.
  - CHANGELOG impact: none expected.
- Approval Boundary: repository routing and agent-specific adapter text only.
- Dependencies: Slices 1 through 4.
- Risks: three entry points can drift unless `AGENTS.md` remains the only
  routing SSOT.
- Out of Scope: integrations for agent products not represented in the
  repository and runtime code.
- Traceability: repository operating-policy goal (no product use case);
  `SPECS.md` Requirements R3–R5 and R9, Dependency Impact, Compatibility, and
  Acceptance Criteria; prove with the seven-role routing matrix, entry-point
  reference audit, and Markdown/qlty validation.

### Slice 6: Packaging, CI Classification, and Final Integrity Validation

- Status: Approved
- Scope: make repository coordination files intentional at packaging and CI
  boundaries, then validate the complete migration and references.
- Affected files and references:
  - `.vscodeignore`: exclude `.agents/` from the VSIX, matching the existing
    exclusion of `.codex/`, because shared skills are repository coordination
    assets rather than extension runtime assets.
  - `.github/workflows/verify.yml`: inspect the existing docs-only allowlist;
    keep `.agents/` outside that allowlist unless implementation evidence
    justifies a separately approved CI policy change. This ensures skill
    migration changes receive the full Verify workflow by default.
  - `package.json`: extend the `lint:md` script to lint
    `'.agents/skills/**/*.md'` and `'.codex/**/*.md'`, so Verify's existing
    Markdown step covers shared skills and Codex role/adapter files.
  - New/retained `.agents/skills`, `.codex/agents`, and entry-point files:
    final stale-path, placeholder, and duplicate-policy checks.
- User / Domain Value: prevents agent coordination content from leaking into
  the extension package and ensures CI treats the new boundary intentionally.
- Cohesive Change Group: VSIX exclusion, CI classification decision, and
  end-to-end integrity checks.
- Acceptance:
  - VSIX inspection confirms `.agents/`, `.codex/`, `docs/`, source, and local
    coordination files are excluded as intended.
  - The existing Verify workflow's full-check behavior for `.agents/` changes
    is documented and remains intentional, unless a separately approved
    allowlist change is required.
  - `package.json`'s `lint:md` script covers both the canonical shared skill
    Markdown and retained Codex Markdown adapters/role definitions.
  - No stale `.codex/skills` SSOT claim, role duplication, template
    placeholder, or unresolved reference remains.
  - No runtime file, test, parser, host, telemetry, or product behavior has
    changed accidentally.
- Validation: `rtk pnpm run qlty`; `rtk pnpm run lint:md`; direct Markdown lint
  for `.agents/skills/**/*.md` and `.codex/**/*.md` before the package script
  change is available; lightweight feature
  structure checks; `rtk pnpm run build`; desktop and web tests; and
  `rtk pnpm exec vsce package --no-dependencies --out /private/tmp/vscode-ajsbutler-agent-skill-separation.vsix`
  followed by VSIX contents inspection.
- Production Readiness:
  - Failure mode: coordination files are accidentally packaged, CI skips a
    required check, or a stale reference reaches a release branch.
  - JP1/AJS compatibility: unchanged; confirm no product files were touched.
  - Large or malformed input risk: not applicable; run existing product tests
    because packaging and workflow boundaries are repository configuration.
  - Desktop/web impact: build and both host test suites provide regression
    evidence for the unchanged extension runtime.
  - README/docs impact: only required durable links and validation notes.
  - CHANGELOG impact: none expected unless a separately approved observable
    development workflow change is documented.
- Approval Boundary: packaging and validation integrity only; any new routing,
  policy, or role design decision returns to planning.
- Dependencies: Slices 1 through 5.
- Risks: `.vscodeignore` and Verify workflow encode release assumptions that
  are easy to miss in a documentation-focused refactor.
- Out of Scope: unrelated CI optimization, release publication, or runtime
  refactoring.

- Traceability: repository operating-policy goal (no product use case);
  `SPECS.md` Requirements R8 and R10, Compatibility, and Acceptance Criteria;
  prove with `.vscodeignore`, `package.json`, Verify classification, VSIX
  contents inspection, build, desktop/web tests, and Markdown/qlty validation.

## Cross-Slice Dependencies

- Slice 1 is the foundation: role definitions and adapters must reference
  canonical procedures rather than current mixed-responsibility skill files.
- Slices 2 and 3 may proceed independently after Slice 1, but Slice 3 uses
  the planning terminology and approval states established by Slice 2.
- Slice 4 depends on the lifecycle terminology and shared procedure boundary
  from Slice 1 and must align its handoff with the review roles in Slices 2–3.
- Slice 5 depends on all role contracts and lifecycle ownership being stable;
  it is the only slice that synchronizes repository routing and entry points.
- Slice 6 depends on the final paths from Slices 1–5 and is the final release
  surface check before any implementation slice is considered complete.

## Feature-Level Risks

- The Codex adapter mechanism may not support direct repository-relative
  inclusion; confirm the supported mechanism before choosing wrappers,
  generated links, or duplicated front matter.
- Moving Feature Exit out of `sdd-plan-task` changes durable SDD lifecycle
  references and must not weaken the existing Human Approval or Feature
  Definition of Done gates.
- `.agents/` is not currently excluded by `.vscodeignore`, and `.agents/` is
  not in the Verify docs-only allowlist.
- Fixed model names and reasoning effort are role metadata; they must not be
  copied into reusable skills or turned into dynamic routing logic.
- No product use case, JP1/AJS reference, runtime source, or test contract is
  being changed; any such discovery is a replanning trigger.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature has multiple architecture-responsibility slices and
  changes repository-wide coordination boundaries without a product use case.

## Use-Case Back-Propagation

- Product use cases: none; no `docs/requirements/use-cases/` update is
  planned.
- Durable SDD policy: Slice 4 updates only lifecycle ownership references in
  `docs/specs/README.md`; it does not copy role contracts there.
- Durable agent routing: Slice 5 updates `AGENTS.md` and keeps `.agent.md`,
  `.github/copilot-instructions.md`, and README links consistent.
- Feature Exit decides whether any remaining role terminology or guardrail
  belongs in durable docs. Do not propagate implementation history.

## Feature Exit

- Definition of Done status: Not started; not eligible for Feature Exit.
- Durable documentation updates: planned candidates are `AGENTS.md`, the
  limited lifecycle references in `docs/specs/README.md`, `.agent.md`,
  `.github/copilot-instructions.md`, and README development links.
- Open risks: adapter reachability, policy duplication, packaging exclusion,
  CI classification, and preservation of the approval gate.

## Validation

- [x] Plan reviewed independently with `sdd-review-plan`.
- [x] Human Approval is recorded before implementation files change.
- [ ] Shared skill and role paths are checked for stale references and
      duplicated SSOT content.
- [ ] `rtk pnpm run qlty` passes for each documentation/configuration slice.
- [ ] Markdown lint covers the new `.agents/skills` and retained Codex files.
- [ ] Packaging and CI classification impact is explicitly validated.
- [ ] Build and desktop/web tests pass for the final configuration/package
      boundary slice.
- [ ] Durable documentation and guardrail propagation are complete before
      Feature Exit.

## Notes

- Scope split considered: the feature remains one boundary because shared
  skill ownership, role definitions, routing, independent review, and Feature
  Exit all implement the same Agent/Skill responsibility separation. Six
  slices are used because each has one architecture responsibility and an
  independent approval and validation boundary.
- The proposed implementation changes are documentation, agent-definition,
  skill, packaging, and CI coordination files only. No domain, application,
  presentation, infrastructure, parser, telemetry, or product behavior file
  is in scope.
- No roadmap update is required because this is transient branch work and does
  not add unfinished repository-level product work.
