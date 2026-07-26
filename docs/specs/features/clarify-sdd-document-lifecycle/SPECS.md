# Feature Specification: Clarify SDD Document Ownership and Lifecycle

## Purpose

Define one coherent SDD document ownership and lifecycle model in which
feature-local documents manage temporary change work, durable documents retain
only current reusable knowledge, and Feature Exit removes the completed feature
folder after required knowledge propagation.

## Minimal Context

- Current decision: clarify which SDD document owns feature planning, durable
  policy, repository-level future work, and Feature Exit records.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when planning or
  validating requirement coverage.
- Use `docs/specs/README.md` as the SDD process and document-role SSOT; do not
  create another branch-level planning document.

## Origin

- Source: user-provided feature creation directive, "SDD 文書体系の整理と
  ライフサイクル明確化".
- Source use case: none; this feature changes repository operating
  documentation rather than an observable extension behavior contract.
- Repository risk: overlapping SDD document responsibilities can cause branch
  conflicts, stale completed-work records, and policy drift.
- JP1/AJS source reference:
  - Command reference: none.
  - Definition/config reference: none.
  - Undocumented or inferred behavior: none; the feature does not depend on or
    change JP1/AJS behavior.

## Requirements

- R1: `docs/specs/README.md` is the single source of truth for the SDD process,
  document responsibilities, Human Approval, validation and review selection,
  Feature Exit, durable-document propagation, and feature-folder removal.
- R2: Feature `SPECS.md`, `TASKS.md`, and optional `TRACEABILITY.md` are defined
  as temporary change-management documents that are removed together after an
  approved Feature Exit.
- R3: A feature `TASKS.md` is the sole owner of that feature's plan, current
  state, approval, validation, risks, production readiness, and exit readiness.
  When the feature is selected by the current branch, its `TASKS.md` also owns
  the branch's active implementation plan; root `PLANS.md`,
  `docs/specs/plans.md`, and legacy feature-local `PLANS.md` files remain
  retired without replacement after their reusable or unfinished information
  is assigned through the Durable Documentation Gate.
- R4: `docs/specs/roadmap.md` contains only unfinished repository-level future
  work, ordering, entry conditions, and unresolved product concerns; completed
  results, active branch state, and current architecture descriptions are
  removed or propagated to the proper durable owner.
- R5: Durable information is routed by responsibility to use cases, repository
  README, CHANGELOG, architecture, context map, glossary, or roadmap, while
  implementation history, resolved findings, investigation logs, and review
  conversations remain in Git and pull-request history.
- R6: Templates, active feature documents, agent instructions, skills, and
  repository guidance no longer require or link to retired planning files.
- R7: One feature branch owns exactly one branch-selected feature, while other
  unfinished feature folders inherited from the base branch may remain in the
  working tree without becoming active or branch-owned. Policy-only
  compatibility edits to an inherited feature do not transfer selection or
  branch ownership.
- R8: Planning, review, implementation, and Feature Exit resolve the same
  selected feature deterministically from explicit user selection,
  a single branch-created folder, a single branch-changed folder, or an
  unambiguous branch-name match; folder existence alone is never selection
  evidence, and ambiguous or unresolved-base selection stops the workflow.
- R9: Once selected for an agent run, the active feature cannot change
  implicitly. Feature Exit evaluates and removes only the selected feature
  folder and ignores another inherited feature's pending work unless the
  current feature would damage or invalidate it.
- R10: Each SDD artifact is synchronized only when its owned information
  becomes stale; completing a slice does not by itself require a roadmap
  update.

## Ownership Terms

- Feature folder: temporary SDD documents under
  `docs/specs/features/<feature>/`; unfinished folders may be inherited from a
  base branch.
- Selected feature: the feature explicitly or deterministically selected for
  the current branch work.
- Branch-owned feature: the one selected feature that the current branch adds,
  changes, implements, or closes.
- Active feature: the selected feature for the current agent run. Mere folder
  presence does not make a feature active.

## Architecture

- Domain: no runtime responsibility or dependency-boundary change.
- Application: no runtime responsibility or dependency-boundary change.
- Presentation: no runtime responsibility or dependency-boundary change.
- Infrastructure: no runtime responsibility or dependency-boundary change.
- Repository documentation: `docs/specs/README.md` owns SDD lifecycle policy;
  each feature `TASKS.md` owns its feature plan, and the selected feature's
  `TASKS.md` owns the branch's active implementation plan; durable documents
  own only their current reusable contracts and decisions.

## Impact Analysis

### Dependency Impact

- Affected documentation may include root and SDD guidance, feature templates,
  active feature documents, use-case guidance, roadmap entries, agent
  instructions, and SDD skills that refer to the current planning model.
- Runtime source, tests, generated artifacts, package configuration, and
  extension manifests are intentionally unchanged.
- The full reference inventory and per-file disposition must be established by
  `sdd-plan-task` before implementation approval.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none.
- Repository workflow: intentional removal of two redundant planning files and
  reassignment of their valid responsibilities, plus deterministic
  branch-selected feature ownership when inherited feature folders coexist.
- Changed behavior scenarios: none.

### Alternative Considerations

- Keep `docs/specs/plans.md` as a shared branch index: rejected because it
  cannot accurately represent unmerged feature branches and creates avoidable
  cross-branch conflicts.
- Preserve completed feature folders as a feature catalog: rejected because
  durable behavior and design knowledge have dedicated owners, while Git and
  pull requests retain history.
- Copy detailed document roles into `AGENTS.md`: rejected because it would
  recreate multiple policy sources and future drift.
- Treat every existing feature folder as active: rejected because inherited
  unfinished folders can coexist and do not identify the feature selected by
  the current branch.
- Reintroduce a shared active-feature index: rejected because deterministic
  branch context is sufficient and a shared index would recreate the retired
  conflict-prone planning surface.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: runtime, test, generated-artifact, or
  configuration edits; architecture-boundary changes; user-visible behavior
  changes; a new planning system outside the documented SDD files; or changing
  the selected-feature resolution order or branch-ownership model.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` and is
  unchanged.
- Web extension compatibility: no runtime or build changes are permitted.
- Desktop extension compatibility: no runtime or build changes are permitted.
- JP1/AJS definition-file and command compatibility: unchanged.
- SDD tools and agent instructions must remain usable after the retired file
  references are removed or redirected to their correct owners.

## Acceptance Criteria

- Root `PLANS.md` and `docs/specs/plans.md` are deleted, no effective rule
  depends on them, and no replacement branch-level plan is introduced.
- Legacy feature-local `PLANS.md` content is assessed through the Durable
  Documentation Gate, any reusable or unfinished information is assigned to
  its proper owner, and the redundant plan file is removed.
- `docs/specs/README.md` defines the authoritative SDD document roles and the
  lifecycle from feature intake through approved Feature Exit.
- A feature `TASKS.md` is defined as the only plan and current-state document
  for its feature, and only the selected feature's `TASKS.md` owns the current
  branch's active implementation plan.
- Feature documents are explicitly temporary, and the complete feature folder
  is removed only after required durable knowledge propagation, validation,
  risk disposition, and approved Feature Exit.
- Durable-document destinations and exclusions are explicit without
  duplicating their detailed responsibilities across repository guidance.
- The roadmap contains unfinished repository-level future work only; each
  removed or moved entry has a documented planning-time disposition.
- Templates, active feature documents, skills, and agent guidance do not rely
  on retired planning files.
- Feature folder, selected feature, branch-owned feature, and active feature
  are distinguished; multiple inherited unfinished feature folders may coexist
  without becoming branch-owned, and a policy-only compatibility edit does not
  transfer their ownership.
- Selected-feature resolution follows one deterministic priority order and
  stops for explicit selection when the evidence or comparison base is
  ambiguous.
- Planning, review, implementation, and Feature Exit keep the same selected
  feature; Feature Exit removes only its folder and does not treat unrelated
  inherited work as a closure blocker.
- Sync guidance updates each artifact only when its owned information becomes
  stale and does not make slice completion alone a roadmap-update trigger.
- Markdown quality and focused reference checks pass, or every remaining match
  is explained as consistent with the new ownership model.
- The change remains docs-only and preserves runtime, build, desktop, web,
  VS Code, and JP1/AJS compatibility.

## Non-Goals

- Changing runtime source, tests, generated artifacts, or configuration.
- Changing UI, commands, parser semantics, or architecture boundaries.
- Introducing a feature-management tool or designing GitHub project tracking.
- Preserving completed feature history in a replacement document.
- Redesigning use-case content, all agent routing, or the complete
  `AGENTS.md`.
- Expanding scope when investigation finds unrelated documentation debt; such
  work must become a separately considered feature.

## Open Questions

- None at intake. The implementation plan must still inventory references and
  assign a keep, move, rewrite, or delete disposition to each affected roadmap
  item and planning-file dependency.
