# Feature Tasks: Clarify SDD Document Ownership and Lifecycle

## Agent Brief

- Purpose: establish unambiguous SDD document ownership, selected-feature
  resolution, and exit lifecycle.
- Approved or active slice: all three slices are complete.
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

- Status: Complete
- Planning scope: replace the shared branch-plan model with feature-owned
  `TASKS.md` state, define branch-selected feature ownership, clarify temporary
  and durable document lifecycles, and normalize the roadmap to unfinished
  repository-level future work.
- Review status: Reviewed; Slice 3 approved with no blocking findings
- Human approval: no active implementation approval; Slice 3 completion
  approved
- Active implementation slice: none; Feature Exit Review required

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

All three slices are complete. Slice 3 was reviewed, approved, implemented,
validated, and completion-approved before the implementation approval was reset.

## Replanning Record

- Mode: Replanning Mode.
- Selected feature: `clarify-sdd-document-lifecycle`.
- Selection evidence:
  - the user explicitly requested that this feature absorb the attached review
    finding
  - branch `codex/clarify-sdd-document-lifecycle` unambiguously matches the
    feature slug
  - comparison with `origin/main` shows this feature folder was added by the
    current branch
- Inherited feature outside current scope:
  `import-definition-via-webapi` exists on `origin/main`; its folder presence
  does not make it selected or active on this branch.
- Discovered gap:
  the approved R7 and implemented guidance equated one feature branch with one
  physically present active feature folder. A base branch may already contain
  another unfinished feature folder, so folder count cannot identify branch
  ownership or active work.
- Plan-review gap:
  the first Slice 3 proposal omitted the inherited WebAPI feature's legacy
  `PLANS.md`, even though R3 makes `TASKS.md` the sole feature-plan owner. The
  approval boundary must include its Durable Documentation Gate assessment and
  removal, and selection validation must cover unresolved comparison bases and
  policy-only compatibility edits to inherited features.
- Why the approved plan cannot continue unchanged:
  the gap changes a feature requirement, the ownership design, validation V7,
  skill behavior, affected files, and approval boundaries. Feature Exit must
  not run until the correction is reviewed, approved, implemented, and
  validated.
- Preserved work:
  Slice 1 and Slice 2 remain complete; their plan-file retirement, lifecycle,
  durable-document, and roadmap results are unchanged except where Slice 3
  corrects selected-feature terminology.

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

### Legacy WebAPI `PLANS.md` Information Disposition

- `docs/specs/features/import-definition-via-webapi/PLANS.md` is a legacy
  feature-local plan that conflicts with `TASKS.md` sole ownership.
- Its durable scope, host constraints, error policy, OpenAPI boundary, and beta
  exit conditions are already owned by the WebAPI `SPECS.md`.
- Its normative API traceability, endpoint decision, compatibility notes, and
  open questions are already owned by the WebAPI `TRACEABILITY.md`.
- Its remaining real-environment evidence, beta feedback, generated-artifact
  replanning need, Blocked status, and approval state are already owned by the
  WebAPI `TASKS.md`.
- Command, generated-artifact, DTO, adapter, and milestone descriptions record
  delivered implementation detail or completed history; they do not pass the
  Durable Documentation Gate for duplication into another long-lived document.
- Disposition: delete the legacy WebAPI `PLANS.md` in Slice 3 after verifying
  the three owning feature documents still retain the durable and unfinished
  information above. Do not change WebAPI scope, status, approval, or behavior.

## Roadmap Disposition

### Current Roadmap Items

1. Completed unit-list usability: remove. Current behavior is already in
   README, CHANGELOG, and the view, definition, and navigation use cases.
   Preserve the separate shared-search entry condition in deferred item 2.
2. WebAPI import beta: keep as a concise unfinished beta-exit item and leave
   evidence state in the owning WebAPI feature. Do not expand this SDD
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

## Branch-Selected Feature Ownership Impact

### Selection Evidence And Terminology

- `docs/specs/README.md` must be the SSOT for feature folder, selected feature,
  branch-owned feature, and active feature.
- Selection priority must be:
  1. a feature explicitly named by the user
  2. the single feature folder created by the current branch
  3. the single feature folder changed by the current branch
  4. an unambiguous match between branch purpose or name and feature name
- Branch-created or branch-changed evidence is evaluated against a
  user-specified base when present, otherwise the repository default branch's
  merge-base. If the base or a single candidate cannot be resolved, this
  evidence cannot select the feature.
- Folder existence alone is never selection evidence. Multiple remaining
  candidates stop planning, review, implementation, or Feature Exit until the
  user selects one.
- Once selected for an agent run, the feature remains fixed. A change requires
  Replanning Mode, separation into another feature branch, or deferral without
  changing the current feature.

### Selected-Feature Reference Groups

- SDD SSOT and concise repository guidance:
  - `docs/specs/README.md`
  - `AGENTS.md`
  - `docs/requirements/use-cases/README.md`
  - Change policy: define ownership and resolution only in the SSOT; other
    guidance names the selected feature and links to the SSOT.
- SDD skills:
  - `.codex/skills/sdd-create-feature/SKILL.md`
  - `.codex/skills/sdd-plan-task/SKILL.md`
  - `.codex/skills/sdd-review-plan/SKILL.md`
  - `.codex/skills/sdd-implement-task/SKILL.md`
  - Change policy: resolve or preserve the selected feature before acting,
    exclude inherited folders from scope, and never switch because another
    folder has a pending or approved task.
- Repository-native templates:
  - `docs/specs/features/_templates/README_repository_native_sdd_templates.md`
  - `docs/specs/features/_templates/TASKS.template.md`
  - `docs/specs/features/_templates/ADR.template.md`
  - `docs/specs/features/_templates/CODEX_IMPLEMENTATION_PROMPT.template.md`
  - Change policy: each `TASKS.md` owns its feature; only a selected feature's
    `TASKS.md` owns active branch work; Feature Exit removes only that folder.
- Agent and review entry points:
  - `.github/copilot-instructions.md`
  - `.github/ISSUE_TEMPLATE/pull_request_template.md`
  - Change policy: use concise selected-feature wording and ensure closure
    checks do not imply deleting inherited folders.
- Existing feature:
  - `docs/specs/features/import-definition-via-webapi/TASKS.md`
  - Change policy: say the file owns only its feature plan. Preserve its
    Blocked state, scope, approval, tasks, risks, and generated-artifact note.
- Selected feature artifacts:
  - `docs/specs/features/clarify-sdd-document-lifecycle/SPECS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/TASKS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/TRACEABILITY.md`
  - Change policy: replace the invalid physical-folder ownership requirement,
    add selected-feature resolution and closure requirements, and supersede V7
    without erasing completed Slice 1 or Slice 2 evidence.

### Confirmed No-Change Surfaces

- `docs/specs/roadmap.md`: the review changes workflow ownership, not
  unfinished repository-level future work.
- Root README, CHANGELOG, architecture, context map, glossary, use cases other
  than their directory guidance, and cross-cutting requirements already own
  different durable responsibilities.
- Runtime source, tests, generated artifacts, package/build configuration,
  `.vscodeignore`, and WebAPI implementation behavior remain out of scope.

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
  - R1, R2, R5, and R6 are satisfied.
  - R3 and R7 ownership wording is superseded by the review finding and must
    be completed through Slice 3.
  - No effective agent, skill, template, feature, or durable-guidance rule
    depends on either retired plan file.
  - The shared branch plan is retired; Slice 3 clarifies when a feature
    `TASKS.md` becomes the selected branch's active implementation plan.
  - Feature Exit propagates only durable knowledge and removes the full feature
    folder after completion evidence and human approval; Slice 3 clarifies that
    this applies only to the selected feature.
  - The WebAPI feature retains real-environment evidence and generated-
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

### Slice 3: Define Branch-Selected Feature Ownership

- Status: Complete
- Scope:
  - Replace physical feature-folder-count ownership with selected-feature and
    branch-owned-feature terminology in the SDD SSOT.
  - Define one deterministic selection order, branch-diff evidence, ambiguity
    stop behavior, and selection locking for an agent run.
  - Make each `TASKS.md` own only its feature; only the selected feature's
    `TASKS.md` owns the current branch's active implementation plan.
  - Apply the Durable Documentation Gate to the inherited WebAPI feature's
    legacy `PLANS.md` and remove that redundant plan without changing its
    Blocked state or unfinished work.
  - Align Planning, Review, Implementation, and Feature Exit so they use the
    same selected feature and do not mix inherited feature state.
  - Make Feature Exit delete only the selected feature folder and stop only
    when the current feature would damage or invalidate another feature.
  - Clarify that slice completion alone does not trigger a roadmap update.
  - Correct the current feature requirements and traceability without
    reopening or erasing completed Slice 1 and Slice 2 evidence.
- User / Domain Value:
  maintainers and agents can work deterministically on one branch-owned feature
  even when the base branch contributes other unfinished feature folders.
- Cohesive Change Group:
  - `docs/specs/README.md`
  - `AGENTS.md`
  - `docs/requirements/use-cases/README.md`
  - `.codex/skills/sdd-create-feature/SKILL.md`
  - `.codex/skills/sdd-plan-task/SKILL.md`
  - `.codex/skills/sdd-review-plan/SKILL.md`
  - `.codex/skills/sdd-implement-task/SKILL.md`
  - `.github/copilot-instructions.md`
  - `.github/ISSUE_TEMPLATE/pull_request_template.md`
  - `docs/specs/features/_templates/README_repository_native_sdd_templates.md`
  - `docs/specs/features/_templates/TASKS.template.md`
  - `docs/specs/features/_templates/ADR.template.md`
  - `docs/specs/features/_templates/CODEX_IMPLEMENTATION_PROMPT.template.md`
  - `docs/specs/features/import-definition-via-webapi/PLANS.md`
  - `docs/specs/features/import-definition-via-webapi/TASKS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/SPECS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/TASKS.md`
  - `docs/specs/features/clarify-sdd-document-lifecycle/TRACEABILITY.md`
- Smallest Useful Slice:
  selection, ownership, skill routing, templates, sync cadence, and Feature
  Exit must change atomically. Splitting them would leave a workflow that can
  select one feature but review, implement, or delete another.
- Acceptance:
  - R3 and R7–R10 are satisfied.
  - Feature folder, selected feature, branch-owned feature, and active feature
    have distinct definitions in the SSOT.
  - One feature branch owns one selected feature while inherited unfinished
    feature folders may coexist without becoming active.
  - Selection uses the approved priority and branch-base evidence, never folder
    existence alone; ambiguity stops the workflow without repeated questions
    when the user has already selected a feature.
  - An unresolved comparison base cannot select a feature, and a policy-only
    compatibility edit to an inherited feature does not transfer selection or
    branch ownership.
  - The selected feature is fixed for the agent run across planning, review,
    implementation, and Feature Exit.
  - Each `TASKS.md` owns its feature; only the selected feature's `TASKS.md`
    owns active implementation planning for the current branch.
  - The legacy WebAPI `PLANS.md` is removed after confirming its durable and
    unfinished information remains in the WebAPI `SPECS.md`, `TASKS.md`, and
    `TRACEABILITY.md`; no replacement feature plan is created.
  - Feature Exit evaluates and removes only the selected feature folder,
    preserves inherited feature folders, and ignores their pending state unless
    the current feature would invalidate them.
  - `import-definition-via-webapi` remains Blocked with unchanged scope,
    approval, tasks, risks, and generated-artifact replanning need.
  - Slice completion alone is not a roadmap-update trigger, and no shared plan
    or active-feature index is reintroduced.
- Validation:
  - `rtk pnpm run qlty`
  - `rtk pnpm run lint:md`
  - run the six focused searches from the review instruction for old ownership,
    branch-plan, folder-selection, active-feature, and roadmap-sync wording
  - verify explicit-user, single-created-folder, single-changed-folder,
    branch-name-match, ambiguous-candidate, unresolved-base, policy-only
    inherited-feature edit, selection-lock, and selected-only Feature Exit
    scenarios by manual policy review
  - compare feature folders with the repository default branch to confirm
    `clarify-sdd-document-lifecycle` is branch-created and
    `import-definition-via-webapi` is inherited
  - compare the WebAPI `PLANS.md` disposition with its `SPECS.md`, `TASKS.md`,
    and `TRACEABILITY.md`; confirm its deletion loses no durable or unfinished
    information, creates no replacement plan, and leaves Blocked state, pending
    work, approval, scope, risks, and generated-artifact note intact
  - confirm no shared plan/index, runtime, test, generated-artifact,
    configuration, roadmap, root README, CHANGELOG, architecture, or behavior
    change
  - `rtk git diff --check`
- Traceability:
  - R3 and R7 map to corrected V7.
  - R8 maps to V8 selected-feature resolution, unresolved-base, and inherited
    policy-edit scenarios.
  - R9 maps to V9 selection-lock and selected-only Feature Exit scenarios.
  - R10 maps to V10 sync-cadence searches and roadmap non-change.
- Production Readiness:
  - Failure mode: an inherited folder is selected, implemented, or deleted by
    mistake; prevent through deterministic resolution, ambiguity stops,
    selection locking, and selected-only Feature Exit.
  - Diagnostics / user-facing errors: no extension-facing change; ambiguous
    agent selection produces a concise request for the feature name.
  - JP1/AJS compatibility: no command, definition, interpretation, or product-
    version change.
  - Large or malformed input risk: none; no runtime input path changes.
  - Desktop/web impact: no runtime, bundle, host, or API change.
  - README/docs impact: developer SDD guidance changes; root README remains
    unchanged because user-visible extension behavior does not change.
  - CHANGELOG impact: no entry; the correction changes internal repository
    workflow policy, not externally observable extension behavior.
- Approval Boundary:
  only the Markdown files listed in the Cohesive Change Group. Do not edit the
  roadmap, root README, CHANGELOG, architecture, context map, glossary,
  unrelated use cases, runtime code, tests, generated artifacts,
  `.vscodeignore`, package/build configuration, or WebAPI behavior and state.
- Dependencies:
  Slice 1 and Slice 2 remain complete. Slice 3 must be reviewed and newly
  approved before implementation; Feature Exit depends on Slice 3 completion.
- Risks:
  - The four SDD skills are self-hosting this correction and must all reference
    one SSOT without copying divergent resolution rules.
  - Branch-created and branch-changed evidence can be ambiguous on stacked
    branches or without a resolvable base; explicit user selection must remain
    the highest-priority and safest evidence.
  - Removing the legacy WebAPI plan can lose information if its disposition is
    not checked against all three owning feature documents in the same slice.
  - Over-short wording can blur selected feature and active feature, while
    overlong duplicated wording can recreate policy drift.
- Out of Scope:
  a shared registry or plan, GitHub Projects or Issues as required state,
  deleting or moving an entire inherited feature folder, changing WebAPI scope
  or status, implementing deferred roadmap work, and any runtime or
  configuration change.

## Cross-Slice Dependencies

- Slice 1 establishes the document ownership rules and removes the shared
  branch-plan model.
- Slice 2 applies the new roadmap responsibility to all existing roadmap
  entries.
- Slice 3 corrects the selected-feature ownership gap discovered after Slice 1
  and Slice 2 completion; Feature Exit cannot proceed until Slice 3 completes.
- Each slice remains independently reviewable, approvable, testable, and
  committable. Slice 2 follows Slice 1, and Slice 3 follows both completed
  slices.

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
- Folder existence can be mistaken for selection evidence when inherited
  feature folders coexist; Slice 3 must validate all resolution paths and
  selected-only Feature Exit.
- Branch-diff selection can be ambiguous on stacked branches or when the base
  cannot be resolved; the workflow must stop rather than guess.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: this non-trivial feature has three dependent slices and explicit
  requirement-to-validation and disposition coverage.

## Use-Case Back-Propagation

- No use-case behavior contract changes are planned.
- `docs/requirements/use-cases/README.md` needs selected-feature terminology
  only; individual use-case contracts remain unchanged.
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

## Replanning Validation

- Selected-feature evidence: the user request and branch name identify
  `clarify-sdd-document-lifecycle`; `origin/main` contains
  `import-definition-via-webapi`, while the current branch adds this feature
  folder.
- Impact inventory: 18 Markdown files form the proposed atomic ownership
  correction, including deletion of the inherited WebAPI feature's redundant
  `PLANS.md`; roadmap, runtime, tests, generated artifacts, configuration, and
  WebAPI behavior remain outside the approval boundary.
- Legacy WebAPI plan disposition: its reusable and unfinished information is
  already assigned across WebAPI `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`;
  its remaining content is delivered implementation detail or completed
  history and does not warrant propagation.
- `rtk pnpm run qlty`: passed.
- `rtk pnpm run lint:md`: passed with zero errors after correcting one duplicate
  planning-document heading.
- Feature Agent Brief check: one per current feature `TASKS.md`.
- Feature `CONTEXT.md` check: no files found, as expected.
- Non-template placeholder and whitespace checks: passed.
- `rtk git diff --check`: passed.

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

## Slice 3 Implementation Validation

- V7 passed: each `TASKS.md` owns only its feature, only the selected feature
  owns active branch implementation work, and the redundant WebAPI `PLANS.md`
  was removed after its durable and unfinished information was confirmed in
  WebAPI `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`.
- V8 passed: the SSOT defines explicit-user, single-created-folder,
  single-changed-folder, and unambiguous branch-name selection in priority
  order; folder-only, ambiguous, unresolved-base, and policy-only inherited
  edits cannot select a feature.
- V9 passed: planning, review, implementation, and Feature Exit keep one
  selected feature fixed; Feature Exit removes only that folder and does not
  treat inherited pending tasks or risks as completion conditions.
- V10 passed: each artifact is updated only when owned information becomes
  stale, and slice completion alone does not require a roadmap update.
- The six review-instruction searches passed after classifying the remaining
  matches as the new SSOT terminology, feature-local requirements or findings,
  or valid duplicate-scope inspection.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
  `rtk git diff --check` passed.
- Structure checks found one Agent Brief per feature `TASKS.md`, no
  `CONTEXT.md`, and no remaining feature-local `PLANS.md`.

## Slice 3 Implementation Feedback

- The 18-file boundary was appropriate because the SSOT, concise entry points,
  four workflow skills, templates, inherited feature wording, and legacy-plan
  removal had to change together to keep selection and Feature Exit coherent.
- Repository-wide feature-local plan inventory should be part of ownership
  impact investigation; it found the legacy WebAPI `PLANS.md` missed by the
  first replan.
- No runtime dependency, JP1/AJS knowledge, VS Code API difference,
  desktop/web difference, or additional validation layer was discovered.
- The durable selected-feature policy is fully propagated through the SSOT and
  concise repository entry points; no additional use-case, roadmap, root
  README, CHANGELOG, architecture, context-map, or glossary update is needed.

## Feature Exit

- Definition of Done status: all slices and slice completion approvals are
  complete; Feature Exit Review remains
- Durable documentation updates:
  - SDD lifecycle and document roles in `docs/specs/README.md`
  - concise agent routing in `AGENTS.md`
  - unfinished repository work in `docs/specs/roadmap.md`
- Open risks:
  - none identified by Slice 3 implementation; Feature Exit Review is still
    required
- Closure rule:
  after all three slices are complete, validation and traceability are current,
  and the human approves Feature Exit for the selected feature, remove only
  this feature folder. Do not remove the inherited WebAPI feature folder or
  preserve this feature's implementation history in another document.
