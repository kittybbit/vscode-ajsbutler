# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before
implementation.

This file is the branch-level planning summary for the per-feature plan
structure in `docs/specs/features/<feature>/`.

## Branch Status

### Completed In This Branch

- JP1/AJS3 version 13 alignment now has an explicit audit baseline:
  `docs/specs/features/align-jp1-v13-parameter-and-command-reference/AUDIT.md`
  records the current shared parameter-semantics seams, the current
  command-generation coupling inside `buildUnitDefinition.ts`, the first
  preserved supported command set (`ajsshow`, `ajsprint`), and the rule for
  tracking manual mismatches incrementally.
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
  code-change slices now use the serial baseline `pnpm run qlty`,
  `pnpm test`, `pnpm run test:web`, and `pnpm run build`, while docs-only
  slices can stay on markdown or docs-focused validation and should not
  depend on repository `Verify`.
- Package management has been migrated to `pnpm` with an explicit pinned
  `packageManager` version, committed `pnpm-lock.yaml`, and matching CI plus
  contributor workflow updates.
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
- Unit model wrapper duplication is reduced selectively:
  shared wait-state and priority getter boilerplate now lives in focused
  capability base classes, while `G` and `N` keep their unit-local planning,
  schedule, and connector-control semantics with regression coverage.
- Runtime-boundary modernization has advanced in two concrete steps:
  stale `flatted` transport assumptions were removed from manifests and docs,
  and package management now uses pinned `pnpm` metadata plus
  `pnpm-lock.yaml` with matching CI and contributor workflow updates.
- Runtime-boundary modernization now has an explicit bundle-reduction target:
  the shared viewer bundle `out/index.js` is the first shrinking seam, its
  2026-04-18 baseline is recorded for evidence, and the next concrete refactor
  is to stop shipping table and flow viewer code through one entry by default.
- The first bundle-splitting refactor is now in place:
  webpack emits dedicated `tableViewer.js` and `flowViewer.js` webview
  bundles, and panel mounting resolves the bundle from the viewer `viewType`
  instead of loading one shared entry.
- Post-split production evidence is recorded:
  `out/tableViewer.js` is 737,279 bytes raw / 219,019 bytes gzip and
  `out/flowViewer.js` is 711,195 bytes raw / 217,051 bytes gzip, so the next
  bundle-size slice should profile each viewer separately rather than treating
  the webview payload as one monolith.
- Post-split profiling evidence is now explicit:
  `@mui/*` is the largest remaining shared contributor in both viewer bundles,
  while `@tanstack/table-core` plus `react-virtuoso` dominate the table-only
  remainder and `@xyflow/react` plus `@xyflow/system` dominate the flow-only
  remainder.
- The next concrete shrinking slice is narrower than a broad library swap:
  first replace viewer-side `@mui/material` barrel imports with path imports,
  then re-measure before choosing whether table virtualization or flow-graph
  libraries deserve the next targeted reduction.
- Viewer-side `@mui/material` import narrowing is now complete:
  table and flow components use path imports instead of the shared barrel, but
  the resulting production build still measures `out/tableViewer.js` at
  737,279 bytes raw / 218,908 bytes gzip and `out/flowViewer.js` at
  711,123 bytes raw / 216,983 bytes gzip, so the next bundle-size slice
  should target viewer-specific dependencies instead of more MUI import-shape
  work.
- Viewer-specific dependency comparison is now explicit:
  despite the similar emitted bundle sizes, current analyzer evidence still
  shows flow-side `@xyflow/react` + `@xyflow/system` outweighing table-side
  `react-virtuoso` + `@tanstack/table-core`, so the next shrinking slice
  should target flow dependencies first.
- A concrete flow-side shrinking experiment has now been tried and rejected:
  deferring minimap-centered flow chrome behind an async seam slightly
  increased the initial flow bundle instead of shrinking it enough to justify
  the extra complexity, so that source change was reverted and should be kept
  only as recorded evidence, not as the new baseline.
- Hash-replacement prerequisites are now explicit:
  current `UnitEntity.id` usage stays inside in-memory UI identity paths
  rather than persisted extension or webview state, and the next eventual hash
  slice should preserve normalized `absolutePath`-based DTO contracts while
  refreshing focused selection and anchor regressions.
- The first flow-view search slice is now in place:
  the flow header can search within the current scope subtree, reveal the
  collapsed nested-jobnet hierarchy required to show the first match, and
  visually emphasize that match without changing the base `currentUnitId`
  scope contract.
- Explicit list/flow bridge navigation is now in place:
  table rows can request the matching flow scope and flow nodes can request the
  matching table row through shared `absolutePath`-based navigation events and
  local reveal helpers, without either viewer importing the other's internal
  component state.

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

1. Align parameter parsing and `ajs` command generation with
   JP1/Automatic Job Management System 3 version 13 reference manuals by
   using the new audit baseline to extract the current `ajsshow` and
   `ajsprint` generation logic from `buildUnitDefinition.ts` into a dedicated
   application-facing seam.
2. Define a read-only JP1/AJS WebAPI import boundary with clear application
   and infrastructure responsibilities.
3. Continue treating desktop and web compatibility as an explicit acceptance
   criterion whenever bootstrap, preview, parsing, shared adapters, or package
   runtime behavior change.
4. Keep feature follow-up verification evidence concrete:
   prefer automated smoke or regression coverage where practical, and reserve
   manual smoke debt for behavior that still lacks a reliable test seam.
5. Revisit viewer bundle-size work only when a clearer reduction seam or
   stronger product need appears.
6. Extend list-view search on the current presentation path so parameter key
   and value queries can complement the existing partial-match behavior, while
   still revisiting a dedicated application use case only if another
   non-table consumer needs the same matching semantics.

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
    changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
    `pnpm run build`.
11. Run any additional task-specific checks after that serial baseline when
    needed.
12. Summarize compatibility risks and follow-up work.

Package-manager note:

- the repository now treats `pnpm` as the live toolchain
- keep `packageManager`, `pnpm-lock.yaml`, CI setup, and contributor docs in
  sync whenever package-manager behavior changes

Docs-only exception:

- `pnpm run build` is not required
- `pnpm run lint:md` is sufficient
- do not require the repository `Verify` workflow for docs-only slices

Use-case note:

- `docs/requirements/use-cases/` is for behavior contracts that should survive
  refactors
- `docs/specs/` is for implementation decisions, branch planning, and task
  execution

## Confirmed Assumptions For Upcoming Slices

- JP1 manual alignment targets JP1/Automatic Job Management System 3 version 13
- normative parameter source:
  [Definition File Reference](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0211.HTM)
- normative command source:
  [Command Reference](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0067.HTM)
- JP1/AJS WebAPI scope is read-only import at first
- flow-graph refresh targets visual resemblance to JP1/AJS View, not full
  interaction parity in one slice
- nested graph expansion should support both incremental reveal and one-click
  expand-all behavior
- unit-list and flow-graph integration currently targets explicit navigation
  when the counterpart view exists
- dependency freshness follows the "keep current when practical, document
  compatibility holds when necessary" rule
