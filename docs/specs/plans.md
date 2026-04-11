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
   Use `docs/...` only when the slice changes files that `Verify` treats as
   docs-only: `docs/**`, `README.md`, `.codex/**/*.md`, and
   `.github/**/*.md`.
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
- `npm run lint:md` is sufficient
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
- Reserve `docs/...` branch names for slices that stay within the docs-only
  file set used by `.github/workflows/verify.yml`:
  `docs/**`, `README.md`, `.codex/**/*.md`, and `.github/**/*.md`.
- Do not `git push` until `npm run qlty`, `npm test`, `npm run test:web`,
  and `npm run build` have all passed locally in that order for code changes.
- For docs-only changes, markdown lint is sufficient and repository `Verify`
  is not a required gate.
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
- [ ] docs-only slices use `npm run lint:md` and do not rely on repository
      `Verify` as a required gate
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

Align docs-only verification rules, branch naming rules, and stale use-case
paths with the actual `Verify` workflow behavior.

### Why

The repo now has explicit docs-only branch naming guidance, but the
implementation and documents drifted in two places:
the `Verify` workflow did not yet treat `.codex/**/*.md` as docs-only, and
some docs still implied broader docs-only validation or referenced the old
use-case path.

### Scope

- update `.github/workflows/verify.yml` so docs-only detection includes
  `.codex/**/*.md`
- align central docs and repo guidance with that docs-only file set
- correct stale `docs/use-cases/` references to
  `docs/requirements/use-cases/`
- align docs-only validation wording so markdown lint is the required check
  for docs-only slices

### Non-Goals

- changing runtime code behavior
- changing parser, flow, list, CSV, diagnostics, hover, or telemetry behavior
- adding automation tooling beyond explicit repository guidance
- touching unrelated local modifications outside the docs and verify workflow

### Constraints

- Keep the docs aligned with actual merged code, not with an aspirational but
  stale intermediate state.
- Do not edit unrelated local worktree changes.
- For docs-only updates, prefer docs-focused validation and skip build.

### Design

#### Use case

Repository-level SDD workflow maintenance and verification-rule alignment.

#### Layers affected

- docs: central SDD workflow guidance, root guidance, skill guidance
- workflow: docs-only verification filter

#### Key decisions

- Treat `.codex/**/*.md` as docs-only for verification because those files are
  documentation, not runtime code.
- Keep docs-only required validation minimal: markdown lint only.

### Acceptance Criteria

- [ ] `Verify` docs-only detection includes `.codex/**/*.md`
- [ ] central docs describe the same docs-only file set and branch naming rule
- [ ] stale use-case path references are removed
- [ ] docs-only validation wording is consistent

### Test Plan

- run `npm run qlty`
- run `npm test`
- run `npm run test:web`
- run `npm run build`

### Risks

- docs and workflow rules could drift again if the docs-only file set changes
  in the workflow but not in the docs
- expanding docs-only too broadly could hide non-doc changes, so the rule
  stays scoped to `.codex/**/*.md`

### Rollback Plan

- revert the workflow filter and matching docs changes together
- narrow the docs-only file set if future `.codex` content stops being purely
  documentation
