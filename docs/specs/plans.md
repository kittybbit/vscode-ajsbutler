# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before
implementation.

This file is the branch-level planning summary for the per-feature plan
structure in `docs/specs/features/<feature>/`.

## Branch Status

### Completed In This Branch

- Decompose `buildUnitListView.ts` into focused projection helpers:
  `group6` calendar, `group7`/`group11` priority, `group10` schedule, and
  linked-unit projections now live in dedicated helper modules with focused
  regression coverage. Remaining groups were consolidated into
  `buildUnitListRemainingGroups.ts` to reduce file width while maintaining
  reviewability.
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
- Telemetry fallback expectations are now explicit:
  automated tests verify both noop fallback handling and browser-hosted event
  forwarding through the shared `TelemetryPort` contract.
- Unit-list filtering and search remain presentation-local by decision:
  the current behavior depends on TanStack Table row access and fuzzy matching
  over view values, so it does not yet justify a separate application use case.
- Editor-feedback smoke coverage is now explicit:
  existing desktop integration tests and the web smoke runner both verify the
  diagnostics and hover path, so that feature no longer depends on an
  unrecorded manual check.
- Table and flow viewer smoke coverage is now explicit:
  existing desktop integration tests and the web smoke runner both verify that
  the preview commands open the corresponding webview tabs in both hosts.
- Show-unit-definition verification evidence is now explicit:
  automated tests cover table and flow dialog-open triggers plus the shared
  normalized DTO mapping, so that feature no longer depends on a separate
  manual smoke note.
- ParameterFactory decomposition follow-ups are closed:
  inherited-builder shape alignment and schedule-rule naming cleanup were
  completed in focused slices, so no immediate ParameterFactory follow-up
  remains on this branch priority list.

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

1. Keep wrapper refactoring selective:
   extract only semantics that are cross-unit or shared with normalization,
   and keep unit-local JP1/AJS rules on the owning wrapper when abstraction
   would be artificial.
2. Continue treating desktop and web compatibility as an explicit acceptance
   criterion whenever bootstrap, preview, parsing, or shared adapters change.
3. Profile webview bundle size and evaluate deferred optimization:
   if compatibility work is stable, consider selective tree-shaking or
   lazy-load of lower-priority viewers.
4. Keep feature follow-up verification evidence concrete:
   prefer automated smoke or regression coverage where practical, and reserve
   manual smoke debt for behavior that still lacks a reliable test seam.
5. Revisit a dedicated filter/search use case only if a second non-table
   consumer appears and needs the same matching semantics.

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
