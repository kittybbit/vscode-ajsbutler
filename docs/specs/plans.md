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
- `ShowUnitDefinition` follow-up wiring is now shared:
  table and flow viewers consume the same normalized
  `absolutePath -> UnitDefinitionDialogDto` mapping path instead of
  rebuilding equivalent dialog DTO maps separately.
- Feature-local `TASKS.md` files now distinguish actionable follow-up debt
  from standing policy or maintenance notes, so open task lists stay aligned
  with real remaining work.
- Viewer bootstrap seams are narrower:
  `createViewerSubscriptions(...)` and
  `createExtensionSubscriptions(...)` now take explicit `context` and
  `telemetry` inputs instead of the full `MyExtension` runtime.

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

1. Record current manual smoke-test results for viewer-facing completed slices,
   starting with `show-unit-definition`, so feature TASKS stop carrying
   stale verification debt.
2. Keep wrapper refactoring selective:
   extract only semantics that are cross-unit or shared with normalization,
   and keep unit-local JP1/AJS rules on the owning wrapper when abstraction
   would be artificial.
3. Verify browser-hosted telemetry behavior and fallback handling so the
   telemetry follow-up does not remain purely assumption-based.
4. Continue treating desktop and web compatibility as an explicit acceptance
   criterion whenever bootstrap, preview, parsing, or shared adapters change.
5. Decide whether unit-list filtering/search has enough cross-surface behavior
   to justify a dedicated application use case.

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

Narrow the remaining viewer wiring seam so bootstrap subscription wiring stops
passing the full `MyExtension` runtime where only `context` and `telemetry`
are actually required.

### Why

`ViewerFactory` and `WebviewMediator` already consume narrower constructor
surfaces, but `createViewerSubscriptions(...)` and
`createExtensionSubscriptions(...)` still accept `MyExtension`. That keeps the
bootstrap seam wider than the actual dependency surface and makes tests depend
on runtime construction they do not need.

### Scope

- change viewer wiring to accept explicit `context` and `telemetry`
- change extension subscription wiring to pass only those dependencies
- update focused regression tests for the narrowed seams
- sync branch-level planning docs for the active slice

### Non-Goals

- changing viewer behavior, command ids, or mount timing
- introducing a new application or infrastructure layer without repeated need
- widening any adapter dependency back to `MyExtension`

### Constraints

- Keep desktop and web extension behavior unchanged.
- Keep the slice small and bootstrap-focused.
- Narrow dependencies only where the consumed surface is already clear.

### Design

#### Use case

Remaining activation and viewer wiring cleanup.

#### Layers affected

- extension/bootstrap: subscription composition
- extension/webview: viewer wiring dependency flow
- tests: wiring seam regression coverage
- docs/specs: branch-level planning sync

#### Key decisions

- `createViewerSubscriptions(...)` should depend on explicit viewer wiring
  needs, not the full extension runtime.
- `createExtensionSubscriptions(...)` should pass only the subset of runtime
  state that viewer wiring actually consumes.

### Acceptance Criteria

- [x] viewer wiring no longer accepts `MyExtension`
- [x] extension subscription wiring no longer accepts `MyExtension`
- [x] focused tests construct the wiring seam without creating `MyExtension`

### Test Plan

- run `npm run qlty`
- run `npm test`
- run `npm run test:web`
- run `npm run build`

### Risks

- bootstrap code could still hide an unnecessary runtime dependency after the
  viewer adapters were already narrowed
- tests could keep constructing `MyExtension`, masking whether the seam is
  actually narrower

### Rollback Plan

- restore the previous `MyExtension`-based wiring if a hidden dependency turns
  out to be real
- keep any further seam extraction separate if this slice starts touching
  viewer behavior
