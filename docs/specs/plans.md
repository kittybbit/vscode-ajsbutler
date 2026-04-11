# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before
implementation.

This file is the branch-level planning summary for the per-feature plan
structure in `docs/specs/features/<feature>/`.

## Branch Status

### Completed In This Branch

- Core application slices are in place and covered:
  `BuildUnitList`, `BuildUnitListView`, `ExportUnitListCsv`,
  `BuildFlowGraph`, `ShowUnitDefinition`, normalized AJS mapping,
  editor feedback, and telemetry-port extraction all exist with focused tests.
- Wrapper-derived semantics have been consolidated where reuse is real:
  parameter lookup and defaulting helpers, relation parsing, layout, recovery,
  wait state, schedule detection, root-jobnet detection, group-state,
  priorities, depth, encoded strings, and relation normalization now live in
  shared helpers instead of duplicated wrapper or normalization logic.
- The normalized AJS model is now the stable integration surface for
  application and presentation slices:
  unit, relation, warning, builder, and tree concerns are grouped under
  `src/domain/models/ajs/normalize/`, and flow/list consumers no longer
  reconstruct wrapper behavior ad hoc.
- Wrapper boundaries are clearer:
  `WaitableUnit` and `PrioritizableUnit` remain explicit capabilities,
  `G` and `N` keep their unit-local semantics, and `UnitEntity` has shed
  debug and dead compatibility APIs that were no longer part of the supported
  domain surface.
- Extension bootstrap and webview wiring have been reduced in small slices:
  runtime creation, lifecycle handling, diagnostics and hover registration,
  viewer wiring, preview command execution, store cleanup, and
  mediator/factory contracts now have narrower responsibilities and focused
  regression tests.
- Validation flow is explicit and repeatable:
  code-change slices use the serial baseline `npm run qlty`, `npm test`,
  `npm run test:web`, and `npm run build`, while docs-only slices can stay on
  markdown or docs-focused validation and should not depend on repository
  `Verify`.

### How To Maintain This Section

- Record branch-level outcomes, not every micro-refactor.
- Prefer grouped milestones by concern:
  domain semantics, normalized model, wrapper boundaries, extension/bootstrap,
  and validation workflow.
- When a detailed bullet no longer affects branch planning, compress it into a
  grouped outcome instead of appending another one-line completion note.
- Move still-open detail into `### Next Priority Tasks` or a feature-local
  `docs/specs/features/<feature>/TASKS.md` file.

### Next Priority Tasks

1. Close the remaining activation and webview concentration by deciding which
   pieces should stay as local wiring in `viewerWiring.ts` and which deserve
   a stable application or infrastructure boundary.
2. Audit feature-local SDD files under `docs/specs/features/` and remove stale
   tasks that no longer match what has already merged to `main`.
3. Keep wrapper refactoring selective:
   extract only semantics that are cross-unit or shared with normalization,
   and keep unit-local JP1/AJS rules on the owning wrapper when abstraction
   would be artificial.
4. Continue treating desktop and web compatibility as an explicit acceptance
   criterion whenever bootstrap, preview, parsing, or shared adapters change.

## Wrapper Semantics Matrix

Use this matrix when deciding whether a JP1/AJS rule belongs in a
capability, shared helper, unit-local wrapper method, or the normalized
model.

- Capability interface + helper: `WaitableUnit`, `PrioritizableUnit`
  Use when a JP1/AJS concept spans multiple wrapper families and should be
  visible in type declarations without forcing inheritance.
- Shared helper reused by wrapper and normalized model: relation parsing,
  layout, recovery, root-jobnet, depth, encoded string, schedule detection
  Use when the same rule must stay identical across wrapper and normalized
  DTO paths.
- Unit-local wrapper semantics: `G` planning and weekday behavior, `N`
  schedule ownership
  Keep behavior on the wrapper when it belongs to one unit family only and
  would become artificial if lifted into a cross-unit abstraction.
- Audit result after `G` and `N`: no additional strong unit-local semantics
  were found in the remaining wrappers
  Treat most remaining wrapper members as typed parameter accessors unless a
  new cross-unit rule or genuinely unit-local behavior is identified.
- `UnitEntity` core responsibilities: identity, tree structure, children,
  parent, ancestors, `depth`, recovery, raw metadata, common JP1 getters
  Keep only stable base-wrapper concerns here. This includes constructor-bound
  identity derivation and basic tree mechanics, but not debug helpers, dead
  compatibility APIs, or wrapper-specific business rules.

## Default Workflow

1. Create a dedicated git branch before implementation work starts.
2. Read the relevant documents in `docs/specs/`.
3. Update or create the related use-case spec in
   `docs/requirements/use-cases/`.
4. Create or update corresponding feature docs in
   `docs/specs/features/<feature>/`:
   - `SPECS.md` for implementation requirements
   - `PLANS.md` for planning and milestones
   - `TASKS.md` for execution items
5. Update the owning `TASKS.md` in the same commit whenever one task or
   follow-up is completed, re-scoped, or intentionally dropped.
6. Fill in assumptions explicitly when requirements are ambiguous.
7. Implement only after acceptance criteria are clear.
8. Refresh `docs/specs/plans.md` in the same commit when the active slice or
   branch-level priorities change materially.
9. Refresh `docs/specs/roadmap.md` in the same commit when a completed slice
   changes repository-level ordering, remaining debt, or deferred work.
10. Before `git push`, run local validation serially in this order for code
    changes: `npm run qlty`, `npm test`, `npm run test:web`, `npm run build`.
11. Run any additional task-specific checks after that serial baseline when
    needed.
12. Summarize compatibility risks and follow-up work.

Docs-only exception:

- `npm run build` is not required
- prefer `npm run lint:md` as the main validation step
- do not require the repository `Verify` workflow for docs-only slices

Use-case note:

- `docs/requirements/use-cases/` is for behavior contracts that should survive
  refactors
- `docs/specs/` is for implementation decisions, branch planning, and task
  execution

## Task Template

### Task

<!-- A single sentence describing what will be changed. -->

### Why

<!-- Why this change is necessary. -->

### Scope

<!-- Target files, modules, or use cases for the change. -->

### Non-Goals

<!-- What is out of scope for this task. -->

### Constraints

- Keep `engines.vscode` compatibility unless explicitly approved.
- Keep desktop and web extension behavior intact.
- Avoid direct `vscode` dependency in domain.
- Avoid anemic domain models: move only broadly reusable or cross-unit
  semantics into helpers/interfaces, and keep entity identity plus
  unit-local JP1/AJS behavior in the entity when it is part of that concept.
- Start implementation from a dedicated git branch, not directly on `main`.
- Do not `git push` until `npm run qlty`, `npm test`, `npm run test:web`,
  and `npm run build` have all passed locally in that order for code changes.
- For docs-only changes, `npm run build` is not required; use markdown-focused
  validation instead and do not treat repository `Verify` as a required gate.
- Keep `Completed In This Branch` concise enough to function as a planning
  summary rather than a chronological changelog.
- Treat `docs/specs/features/<feature>/TASKS.md`, `docs/specs/plans.md`, and
  `docs/specs/roadmap.md` as sync targets that should be updated at the time a
  task outcome becomes known, not in a later cleanup pass.

### Design

#### Use case

<!-- Which use case(s) will be addressed. -->

#### Layers affected

- domain:
- application:
- infrastructure:
- presentation:

#### Key decisions

-
-

### Acceptance Criteria

- [ ] build passes
- [ ] quality/lint passes
- [ ] tests updated
- [ ] `git push` happens only after local `npm run qlty`, `npm test`,
      `npm run test:web`, and `npm run build` pass for code changes
- [ ] docs-only slices may use `npm run lint:md` instead of `npm run build`
      and may skip repository `Verify`
- [ ] desktop behavior preserved
- [ ] web behavior preserved if affected

### Test Plan

-
-

### Risks

-
-

### Rollback Plan

-
-

## Current Task

### Task

Audit feature-local SDD task files and add a same-commit sync rule for task,
plan, and roadmap updates.

### Why

The branch-level docs are now in better shape, but the feature-local
`TASKS.md` files still contain stale follow-up notes and no explicit rule
about when to sync task, plan, and roadmap documents. Without a tighter
cadence, the repo drifts back toward catch-up documentation.

### Scope

- audit `docs/specs/features/*/TASKS.md` against the current merged state
- remove or reclassify follow-up notes that are already satisfied
- add a shared operating rule that task completion should trigger same-commit
  updates to feature tasks and, when applicable, branch plans and roadmap docs
- keep the rule visible in both central SDD guidance and feature task files

### Non-Goals

- changing runtime code behavior
- reopening already-settled wrapper-capability decisions
- adding automation tooling beyond explicit repository guidance
- touching unrelated local modifications outside the SDD docs

### Constraints

- Keep the docs aligned with actual merged code, not with an aspirational but
  stale intermediate state.
- Do not edit unrelated local worktree changes.
- For docs-only updates, prefer docs-focused validation and skip build.

### Design

#### Use case

Repository-level SDD workflow maintenance and feature-task sync discipline.

#### Layers affected

- docs: central SDD workflow guidance, branch-level plan summary, roadmap
  guidance, feature task files

#### Key decisions

- Treat `TASKS.md`, `plans.md`, and `roadmap.md` as same-commit sync targets
  once a task outcome becomes known.
- Remove obviously stale follow-up items instead of carrying them as passive
  reminders forever.

### Acceptance Criteria

- [ ] feature-local task files no longer carry obviously stale follow-up notes
- [ ] central SDD docs define when task, plan, and roadmap files must be
      updated together
- [ ] feature task files carry a visible sync rule
- [ ] docs-only validation passes

### Test Plan

- run `npm run lint:md`
- run `npm run qlty`

### Risks

- the sync rule could be too heavy if written like a bureaucratic checklist
- some feature follow-up items may look stale without being fully closed in
  code, so each removal must stay conservative

### Rollback Plan

- restore removed follow-up notes if a task was closed prematurely
- narrow the sync rule wording if it proves too rigid in practice
