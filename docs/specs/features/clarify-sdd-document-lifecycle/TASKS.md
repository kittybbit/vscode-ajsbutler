# Feature Tasks: Clarify SDD Document Ownership and Lifecycle

## Agent Brief

- Purpose: establish one unambiguous SDD document ownership and exit lifecycle.
- Approved or active slice: all approved slices are complete.
- Do not edit runtime code, tests, generated artifacts, or configuration.
- Do not create a replacement branch-level plan or preserve completed-work
  history in durable documents.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and
  `docs/specs/README.md`.
- Preserve unresolved WebAPI beta and generated-artifact decisions in its
  owning feature.
- Treat historical and non-effective references separately from active rules.
- Validate with qlty, Markdown lint, structure checks, and focused searches.
- Approval policy and document roles: see `docs/specs/README.md`.
- Next decision: run Feature Exit Review with `sdd-plan-task`.

## Plan Status

- Status: In Progress
- Planning scope: replace the shared branch-plan model with feature-owned
  `TASKS.md` state, clarify temporary and durable document lifecycles, and
  normalize the roadmap to unfinished repository-level future work.
- Review status: Reviewed; ready for implementation
- Human approval: Approved
- Active implementation slice: none; Feature Exit Review required

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: full reviewed plan, including Slice 1 and Slice 2

Implementation must proceed one approved slice at a time through
`sdd-implement-task`, beginning with Slice 1.

## Impact Investigation

### Active And Retired Planning Artifacts

- `PLANS.md`
  - Current role: pointer to `docs/specs/plans.md`.
  - Disposition: delete; it has no independent responsibility.
  - Risk: none after every effective target reference is migrated.
- `docs/specs/plans.md`
  - Current role: shared branch decisions, priorities, and active-feature
    index.
  - Disposition: delete after current actionable information is assigned to
    the owning feature, durable policy, or roadmap.
  - Risk: losing the WebAPI generated-artifact replanning decision.
- `docs/specs/features/_templates/PLANS.template.md`
  - Current role: creates an additional branch-level plan.
  - Disposition: delete because the feature `TASKS.md` becomes the only branch
    plan.
  - Risk: template guidance becomes inconsistent if its index is not updated
    in the same slice.

### Effective Reference Groups

- SDD policy and durable guidance:
  - `AGENTS.md`
  - `docs/specs/README.md`
  - `docs/requirements/use-cases/README.md`
  - Change policy: point to the SDD SSOT and feature `TASKS.md`; remove the
    retired planning-file role without duplicating detailed responsibilities.
- SDD skills:
  - `.codex/skills/sdd-create-feature/SKILL.md`
  - `.codex/skills/sdd-plan-task/SKILL.md`
  - `.codex/skills/sdd-review-plan/SKILL.md`
  - `.codex/skills/sdd-implement-task/SKILL.md`
  - Change policy: discover active work from the user request or feature
    folders, keep branch state in the feature `TASKS.md`, and perform Feature
    Exit without a shared plans file.
- Repository-native templates:
  - `docs/specs/features/_templates/README_repository_native_sdd_templates.md`
  - `docs/specs/features/_templates/SPECS.template.md`
  - `docs/specs/features/_templates/TASKS.template.md`
  - `docs/specs/features/_templates/ADR.template.md`
  - `docs/specs/features/_templates/CODEX_IMPLEMENTATION_PROMPT.template.md`
  - Change policy: remove branch-plan assumptions and make temporary
    feature-folder removal explicit.
  - `CODEX_SDD_PROMPT.template.md` and `TRACEABILITY.template.md` need no
    change because they do not require the retired files or permanent feature
    retention.
- Agent and review entry points:
  - `.github/copilot-instructions.md`
  - `.github/ISSUE_TEMPLATE/pull_request_template.md`
  - Change policy: route planning to feature `TASKS.md` and make durable
    propagation plus feature-folder removal visible at Feature Exit.
  - `.agent.md` needs no change because it already delegates SDD policy to the
    repository SSOT.
- Active feature:
  - `docs/specs/features/import-definition-via-webapi/TASKS.md`
  - Change policy: remove its shared-plan sync rule and preserve the stale
    Prism artifact as a Replanning Mode decision before any correction.
  - Risk: do not invent a new WebAPI implementation slice or change its
    blocked real-environment evidence status in this feature.

### Non-Effective Or Out-Of-Scope Matches

- `CHANGELOG.md` keeps the historical `PLANS.md` reference under version
  `1.11.4`; release history is not an active workflow dependency.
- `.vscodeignore` keeps its `PLANS.md` exclusion. After `PLANS.md` is deleted,
  the entry has no packaging effect. Editing it would cross the explicit
  configuration non-goal.
- This feature's `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md` may name retired
  files while defining and validating their removal; the folder is removed
  only during approved Feature Exit.
- Runtime source, tests, generated artifacts, `package.json`, build files, and
  extension configuration have no planned changes.

### `docs/specs/plans.md` Information Disposition

- Closed qlty parity results: delete with the plans file; they are completed
  history and do not pass the Durable Documentation Gate.
- Presentation-local list search: current boundary already exists in
  `docs/specs/architecture.md`; its future promotion trigger remains in the
  roadmap deferred search item.
- JP1/AJS3 version 13 target: already durable in
  `docs/specs/architecture.md` and relevant domain/use-case requirements.
- WebAPI beta status: already owned by the WebAPI feature,
  `docs/specs/architecture.md`, and the future beta-exit roadmap item.
- Qlty future-selection policy: already owned by
  `docs/specs/README.md` risk-based quality guidance.
- Feature document roles and desktop/web compatibility: move only missing
  lifecycle detail to `docs/specs/README.md`; architecture and agent rules
  already own compatibility.
- Stale Prism artifact: add a concise unresolved next-decision note to the
  WebAPI feature `TASKS.md`; require its own Replanning Mode before correction.
- Active-feature index: remove without replacement. Each feature folder and
  its `TASKS.md` own their active state.

## Roadmap Disposition

### Current Roadmap Items

1. Completed unit-list usability: remove. Current behavior is already in
   README, CHANGELOG, and the view, definition, and navigation use cases.
   Preserve the separate shared-search entry condition in deferred item 2.
2. WebAPI import beta: keep as a concise unfinished beta-exit item and leave
   evidence state in the active WebAPI feature. Do not expand this SDD
   lifecycle feature into WebAPI user guidance.
3. Normalized-model convergence: remove. Current boundaries are already in
   architecture and `normalize-ajs-document.md`; no concrete unfinished
   feature remains.
4. Parser and infrastructure boundaries: remove. They are current architecture
   policy, not future work.
5. Extension composition root: remove. It is current architecture policy.
6. React viewer bridge routing: remove. It is current transport and
   presentation architecture with no concrete unfinished feature.
7. Qlty architectural feedback: remove. Completed parity history is not
   durable, and future work starts only from a concrete concern under the
   existing quality policy.
8. Telemetry product capability: keep only unfinished product-learning and
   decision work. Current telemetry behavior and privacy constraints remain in
   README, architecture, and the telemetry cross-cutting requirement.
9. Semantic diff: remove. Current behavior is already in README, CHANGELOG,
   and semantic-diff use cases.
10. DDD/Clean Architecture baseline: remove. It is already enforced and
    documented in `AGENTS.md` and `docs/specs/architecture.md`.

### Deferred Items

- Keep all seven deferred candidates because each has a concrete trigger or
  entry condition.
- Remove duplicated context already covered by retained roadmap items or
  durable docs.
- Rewrite the JP1/AJS View parity item so it no longer refers to a closed
  active unit-list feature.
- Keep deferred items as future candidates, not as active slices or completed
  history.

### Roadmap Framing

- Remove process principles and slice done criteria that duplicate
  `docs/specs/README.md` or `AGENTS.md`.
- Add only a concise statement that the roadmap contains unfinished
  repository-level future work and entry conditions.
- Do not add completion markers, active feature progress, architecture
  catalogs, or release history.

## Implementation Slices

### Slice 1: Switch SDD Lifecycle Ownership And Retire Shared Plans

- Status: Complete
- Scope:
  - Make `docs/specs/README.md` the complete lifecycle and document-role SSOT,
    including temporary feature artifacts, feature `TASKS.md` branch
    ownership, durable propagation, and approved folder removal.
  - Simplify `AGENTS.md` and use-case guidance to point to that SSOT.
  - Delete root `PLANS.md`, `docs/specs/plans.md`, and
    `PLANS.template.md`.
  - Update all effective skill, template, Copilot, PR checklist, and active
    WebAPI references identified above.
  - Preserve the WebAPI stale generated-artifact decision as a pending
    replanning need without planning or implementing that work.
- User / Domain Value:
  maintainers and agents get one conflict-resistant plan owner per feature and
  one authoritative SDD lifecycle without losing unresolved work.
- Cohesive Change Group:
  - `AGENTS.md`
  - `PLANS.md` (delete)
  - `docs/specs/README.md`
  - `docs/specs/plans.md` (delete)
  - `docs/requirements/use-cases/README.md`
  - `.codex/skills/sdd-create-feature/SKILL.md`
  - `.codex/skills/sdd-plan-task/SKILL.md`
  - `.codex/skills/sdd-review-plan/SKILL.md`
  - `.codex/skills/sdd-implement-task/SKILL.md`
  - `.github/copilot-instructions.md`
  - `.github/ISSUE_TEMPLATE/pull_request_template.md`
  - `docs/specs/features/_templates/README_repository_native_sdd_templates.md`
  - `docs/specs/features/_templates/PLANS.template.md` (delete)
  - `docs/specs/features/_templates/SPECS.template.md`
  - `docs/specs/features/_templates/TASKS.template.md`
  - `docs/specs/features/_templates/ADR.template.md`
  - `docs/specs/features/_templates/CODEX_IMPLEMENTATION_PROMPT.template.md`
  - `docs/specs/features/import-definition-via-webapi/TASKS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/TASKS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/TRACEABILITY.md`
- Smallest Useful Slice:
  these references must change atomically with file retirement; splitting
  policy, skills, templates, and deletion would leave an intermediate workflow
  with broken links or contradictory ownership.
- Acceptance:
  - R1, R2, R3, R5, R6, and R7 are satisfied.
  - No effective agent, skill, template, feature, or durable-guidance rule
    depends on either retired plan file.
  - Feature `TASKS.md` is the only feature branch plan and current-state owner.
  - Feature Exit propagates only durable knowledge and removes the full feature
    folder after completion evidence and human approval.
  - The active WebAPI feature retains real-environment evidence and generated-
    artifact replanning needs.
- Validation:
  - `rtk pnpm run qlty`
  - `rtk pnpm run lint:md`
  - feature Agent Brief and `CONTEXT.md` structure checks from the SDD SSOT
  - focused searches for `PLANS.md`, `docs/specs/plans.md`, generic
    `plans.md`, branch-level plan ownership, and completed-folder retention
  - manually classify remaining matches as historical, feature-local removal
    requirements, or the out-of-scope `.vscodeignore` entry
  - `rtk git diff --check`
- Production Readiness:
  - Failure mode: broken skill/template links or loss of active WebAPI
    decisions; prevent through atomic edits and focused searches.
  - JP1/AJS compatibility: no command, definition, or interpretation change.
  - Large or malformed input risk: none; no runtime input path changes.
  - Desktop/web impact: no runtime, bundle, host, or API change.
  - README/docs impact: SDD developer guidance changes; root README does not
    need a lifecycle edit because it already points to the SSOT.
  - CHANGELOG impact: no update; this is internal documentation maintenance
    with no externally observable extension behavior change.
- Approval Boundary:
  only the Markdown files listed in the Cohesive Change Group, including this
  feature's status and traceability records, and deletion of the three
  obsolete Markdown plan artifacts. Do not edit `.vscodeignore`, runtime code,
  tests, generated artifacts, package/build configuration, or unrelated
  guidance.
- Dependencies:
  no slice dependency. After the reviewed plan receives Human Approval and
  before Slice 1 edits begin, create or switch to a dedicated non-`docs/`
  feature branch because the approved scope includes root Markdown files
  outside the Verify workflow's docs-only path allowlist.
- Risks:
  - The current skills are self-hosting the migration; final wording must still
    support Planning, Review, Implementation, and Feature Exit without the
    shared plan.
  - Root `PLANS.md` and `AGENTS.md` fall outside the Verify workflow's
    docs-only path allowlist. Use a non-`docs/` feature branch even though the
    content change remains documentation-only.
- Out of Scope:
  roadmap normalization, WebAPI artifact correction, WebAPI beta exit, and
  configuration cleanup.

### Slice 2: Normalize Roadmap To Unfinished Future Work

- Status: Complete
- Scope:
  - Rewrite `docs/specs/roadmap.md` to contain only the retained unfinished
    WebAPI, telemetry, and deferred future candidates described above.
  - Remove completed results, current architecture catalogs, active branch
    state, process rules, and slice done criteria.
  - Leave README, architecture, context map, glossary, use cases,
    cross-cutting requirements, and CHANGELOG unchanged because this feature
    does not change their user-facing, behavior, design, terminology, or
    release-history responsibilities.
- User / Domain Value:
  maintainers can identify genuine repository-level future work without
  reading completed history or current architecture catalogs.
- Cohesive Change Group:
  - `docs/specs/roadmap.md`
- Smallest Useful Slice:
  all current roadmap entries must be classified and rewritten together so
  the result is internally consistent and no unfinished trigger is discarded.
- Acceptance:
  - R4 and the roadmap portion of R5 are satisfied.
  - Every existing roadmap item has the recorded keep, move, or delete
    disposition.
  - The roadmap contains no completion history, active slice, current
    architecture catalog, or branch progress.
  - Retained items have future value and a concrete trigger or entry
    condition.
- Validation:
  - `rtk pnpm run qlty`
  - `rtk pnpm run lint:md`
  - focused roadmap searches for `completed`, `complete`, `maintain`,
    `active feature`, `active slice`, `current branch`, and slice status
  - manual comparison against the disposition list and durable source docs
  - `rtk git diff --check`
- Production Readiness:
  - Failure mode: loss of unfinished future work or overstating beta support;
    prevent through item-by-item disposition and source comparison.
  - JP1/AJS compatibility: documentation only; Version 13 reference basis is
    unchanged.
  - Large or malformed input risk: none.
  - Desktop/web impact: none; user guidance and host behavior are unchanged.
  - README/docs impact: roadmap cleanup only; README remains unchanged.
  - CHANGELOG impact: no new entry; versions 1.14.0 and 1.15.0 already record
    WebAPI beta delivery and constraints.
- Approval Boundary:
  only `docs/specs/roadmap.md`, plus required status and validation updates in
  this feature's `TASKS.md` and `TRACEABILITY.md`.
- Dependencies: Slice 1, because the new roadmap role must be authoritative
  before applying its disposition rules.
- Risks:
  - Conditional deferred candidates can become vague if their triggers are
    shortened too aggressively.
  - Telemetry roadmap text must not duplicate the durable privacy contract.
- Out of Scope:
  roadmap feature implementation, telemetry changes, WebAPI behavior changes,
  and edits to already-sufficient durable architecture or use-case documents.

## Cross-Slice Dependencies

- Slice 1 establishes the document ownership rules and removes the shared
  branch-plan model.
- Slice 2 applies the new roadmap responsibility to all existing roadmap
  entries.
- Each slice is independently reviewable, approvable, testable, and
  committable, but Slice 2 must follow Slice 1.

## Feature-Level Risks

- An effective reference outside the searched Markdown, skill, template, or
  agent surfaces could be missed; run both focused and repository-wide searches
  before completing Slice 1.
- Removing `docs/specs/plans.md` can lose a current decision unless its
  disposition is completed in the same slice.
- The package-ignore match can be mistaken for an active dependency; keep it
  explicitly classified rather than expanding into configuration scope.
- Roadmap normalization can erase a future trigger if item-level disposition
  is not reviewed against the source and current durable documents.
- The implementation branch must not use a `docs/` prefix because the planned
  root Markdown changes fall outside the Verify docs-only allowlist.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: this non-trivial feature has two dependent slices and explicit
  requirement-to-validation and disposition coverage.

## Use-Case Back-Propagation

- No use-case behavior contract changes are planned.
- Unit-list, semantic-diff, normalized-model, and telemetry behavior already
  has durable use-case, domain-rule, or cross-cutting coverage.
- Root README, architecture, context map, glossary, and CHANGELOG need no
  implementation change based on the completed investigation.

## Planning Validation

- `rtk pnpm run qlty`: passed.
- `rtk pnpm run lint:md`: passed with zero errors.
- Feature Agent Brief check: one per current feature `TASKS.md`.
- Feature `CONTEXT.md` check: no files found, as expected.
- Template placeholder and whitespace checks: passed.

## Slice 1 Implementation Feedback

- The approval boundary was appropriate: policy, skills, templates, active
  references, and file deletion needed one atomic documentation slice.
- Focused searches must distinguish effective rules from historical,
  feature-local removal requirements, and non-effective configuration matches.
- No additional dependency, design decision, JP1/AJS knowledge, or validation
  layer was discovered.

## Slice 2 Implementation Feedback

- The single-roadmap-file boundary was appropriate because every existing item
  needed one consistent future-work classification.
- Item-by-item disposition plus positive entry-condition counting was more
  reliable than keyword searches alone for detecting lost deferred work.
- No additional dependency, design decision, JP1/AJS knowledge, or durable
  documentation update was discovered.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates:
  - SDD lifecycle and document roles in `docs/specs/README.md`
  - concise agent routing in `AGENTS.md`
  - unfinished repository work in `docs/specs/roadmap.md`
- Open risks:
  - none identified by Slice 1 or Slice 2 implementation; Feature Exit review
    is still required
- Closure rule:
  after both slices are complete, validation and traceability are current, and
  the human approves Feature Exit, remove this entire feature folder. Do not
  preserve its implementation history in another document.
