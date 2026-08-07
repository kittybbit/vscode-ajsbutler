# Feature Tasks: Unit-list Table Presentation and Keyboard Navigation Separation

## Agent Brief

- Purpose: separate unit-list table presentation and keyboard focus state behind
  presentation-owned contracts while keeping repeated keyboard movement
  responsive.
- Approved or active slice: Slice 4; Slices 1 through 3 are complete.
- Do not: change Application DTOs, JP1/AJS interpretation, viewer messages, or
  supported desktop/web behavior.
- Do not: add table features, shortcuts, redesigns, shared interaction
  frameworks, or architecture exceptions.
- Read first: `SPECS.md`, this file, `uc-view-unit-list.md`, and the selected
  slice's current production and test files.
- Read `TRACEABILITY.md` when updating the active slice's validation evidence.
- Validate: focused table tests, `rtk pnpm run qlty`, required desktop/web
  tests, and production build as specified by each slice.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: implement Slice 4 and complete its independent implementation
  review.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs, prior approvals, or long validation diaries once they stop being
  actionable.

## Plan Status

- Status: Approved
- Planning scope: the full 7.3 feature plus the discovered keyboard-selection
  side-effect coalescing gap.
- Review status: Reviewed; no outstanding findings after Slice 4 revision
- Human approval: Approved
- Active implementation slice: Slice 4

## Replanning Trigger

- Discovered gap: `VirtualizedTable.handleGridFocus` calls `selectRow` and
  reports `unit.select` for every keyboard-focused row. `TableContents` then
  recomputes the selected unit, detail panel, accessibility announcement, and
  tree selection on every arrow/Page movement.
- Why the current plan cannot continue unchanged: the completed separation
  slices preserve the existing selection timing, but that timing causes an
  unacceptable interaction delay for rapid keyboard movement. A new
  presentation-only behavior slice and renewed approval are required.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 4's coalesced keyboard-selection timing policy and
  presentation-only implementation boundary; Application, Domain,
  Infrastructure, transport, dependency, and unrelated user-visible behavior
  changes remain out of scope.

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved. Reset this section to Pending after an
approved slice completes and no active implementation approval remains.

## Implementation Slices

### Slice 1: Establish the presentation-owned table model

- Status: Complete
- Scope: define the standalone presentation-owned `TableRowView` and
  `TableUnitMetadata` contracts in `tableViewerData.ts`, and map the existing
  Application unit-list DTO to those contracts once at the table viewer
  boundary. `tableViewerData.ts` also owns the document-to-viewer-data adapter,
  so `TableContents.tsx` consumes the mapped result rather than importing
  `UnitListTableDataDto` or calling `toUnitListTableData` itself. The
  presentation row preserves the current primitive/array cell
  values, stable `id`/`absolutePath` identity, and the fields consumed by all
  existing column accessors, search, detail, row reveal, and navigation actions.
  Migrate the direct production consumers together: `TableContents.tsx`,
  `Header.tsx`, `DisplayColumnSelector.tsx`, `TableHeader.tsx`,
  `VirtualizedTable.tsx`, `tableColumnDef.tsx`, `columnDefs/common.tsx`, all
  existing `columnDefs/group1` through `group20` modules, `globalFilter.ts`,
  `tableSearchController.ts`, `tableSearchState.ts`, `tableRowReveal.ts`,
  `unitListDetail.ts`, `exportCsvView.ts`, and the unit-metadata signatures in
  `navigation.ts`. Migrate `parseTableDocumentState`, `useChangeDocument`, and
  the table model setup in `TableContents.tsx` to the mapped viewer data.
  Keep the existing FlowGraph tree DTO used by `UnitTreeSelector` unchanged;
  tree interaction remains outside this slice.
  Application unit-list types may be imported only by the explicit mapping
  adapter, and Application CSV behavior remains called through its existing
  contract.
- User / Domain Value: the table continues to show and export the same JP1/AJS
  units while table-framework decisions no longer leak into or depend directly
  on the Application DTO shape.
- Cohesive Change Group: the presentation table data adapter and all direct
  table-row/table-metadata consumers listed in Scope, plus the focused table
  data, column, search, detail, navigation, shell, and export tests that need
  the new presentation type.
- Acceptance:
  - satisfies R1, R2, R5, AC1, and the data-contract portion of AC4
  - preserves stable row identity, all column IDs/labels/accessor values,
    visibility/order, CSV output, search values, detail metadata, and navigation
    metadata
  - outside the mapping adapter, production table modules no longer import
    `UnitListRowView`, `UnitListUnitMetadataDto`, or `UnitListTableDataDto`
    directly
  - the unit tree continues to consume the same FlowGraph DTO shape and
    retains its current selection and focus behavior
  - Application and viewer transport DTOs remain unchanged
- Validation:
  - update or add `tableViewerData.test.ts`, `tableColumnDef.test.ts`,
    `exportCsvView.test.ts`, `exportUnitListCsv.test.ts`,
    `ajsTableGlobalFilter.test.ts`, `tableSearchState.test.ts`,
    `tableSearchController.test.ts`, `showUnitDefinitionInteraction.test.ts`,
    `tableNavigation.test.ts`, and `tableShellIntegration.test.ts`; these are
    the tests in scope for row/table fixture or type updates, and the existing
    `.test.ts` shell filename must be preserved
  - assert a representative row-family mapping, stable leaf-column IDs and
    labels, primitive accessor values, visible-column CSV projection, search
    values, detail metadata, and navigation metadata
  - run `rtk pnpm run test:compile` and the desktop suite through the repository
    test runner; the runner loads all compiled suites, so the changed suites
    are the focused assertions and the full run is the regression check
  - run `rtk pnpm run qlty` and inspect new smell findings
  - run `rtk pnpm run build` because generic table types and bundling change
- Production Readiness:
  - Failure mode: an incomplete mapping could silently empty a cell or disable
    an action; exhaustive representative mapping and regression assertions must
    fail loudly in tests.
  - JP1/AJS compatibility: projection values, encodings, parameter meaning, and
    ordering are unchanged; representative unit families remain covered.
  - Large or malformed input risk: mapping remains linear, does not duplicate
    full documents unnecessarily, and preserves existing invalid-document
    handling.
  - Desktop/web impact: the same presentation model is built in both hosts from
    the existing plain transport DTO.
  - README/docs impact: none unless implementation reveals an externally
    observable contract change, which requires replanning.
  - CHANGELOG impact: none under the internal-refactoring criteria.
- Approval Boundary: presentation-only data/model adaptation and direct
  consumers; no Application DTO, message schema, behavior, or dependency
  replacement.
- Human approval: Approved in current conversation; implementation review found
  no outstanding findings.
- Dependencies: completed unit-list characterization, preserved Application
  unit-list contract, and approved Slice 1 scope.
- Risks: the large column catalog can hide an accidental accessor or label
  drift; keep stable column tests and primitive-value assertions.
- Out of Scope: focus/controller extraction, virtualization restructuring,
  search semantics, new columns, and Application projection changes.

#### Slice 1 implementation feedback

- Keeping the Application-to-presentation mapping and lookup indexes together
  in `tableViewerData.ts` let `TableContents.tsx` consume one presentation
  contract while leaving the FlowGraph tree DTO unchanged.
- The repository desktop runner executes all compiled suites; later slices
  should continue to use focused assertions plus the full regression run.

### Slice 2: Extract the table keyboard and focus interaction model

- Status: Complete
- Scope: introduce a presentation-local pure interaction model in
  `tableNavigationModel.ts` for current grid focus, saved header-return focus,
  row selection handoff, keyboard command classification, column/sort
  restoration, detail return, and virtualized off-screen target decisions.
  Its state and transition results must express a stable focus target, optional
  selected-row handoff, and optional scroll/focus request without DOM nodes or
  library handles. Split the existing focus logic in `navigation.ts` only as
  needed to keep host/message, React event, and unit-tree adapters outside the
  pure model. Integrate the model into `VirtualizedTable.tsx`,
  `TableHeader.tsx`, and the existing `TableContents.tsx` wiring without doing
  the broader renderer decomposition reserved for Slice 3.
- User / Domain Value: keyboard users retain predictable selection and focus
  across large lists, sorting, column changes, details, and tree/grid handoffs,
  with behavior made independently testable.
- Cohesive Change Group: `tableNavigationModel.ts`, the retained
  `navigation.ts` adapters,
  focus integration in `VirtualizedTable.tsx` and `TableHeader.tsx`, existing
  focus request wiring in `TableContents.tsx`, and the associated navigation,
  virtualization, accessibility, and shell regression tests.
- Acceptance:
  - satisfies R3, R6, AC2, and the interaction-decision portion of AC3
  - the pure model in `tableNavigationModel.ts` has no React, MUI, TanStack,
    Virtuoso, VS Code, or Application
    DTO imports
  - DOM event-target ownership checks, mounted-element registration, scrolling,
    focus application, and actionable-cell activation remain adapter concerns;
    Enter keeps its current adapter-owned action behavior
  - arrows, Home/End, Ctrl+Home/End, PageUp/PageDown, H, L, D, Enter, Escape,
    row selection, and meaningful fallback behavior remain unchanged
  - off-screen targets are expressed as decisions/requests rather than direct
    DOM or Virtuoso operations
- Validation:
  - expand `tableNavigation.test.ts` for model state transitions, no-op
    ownership, boundary rows/columns, saved return focus, shortcut decisions,
    and fallbacks
  - expand `tableVirtualizationFocus.test.ts` for 10,000-row movement, sorting,
    visibility, selection, detail return, off-screen requests, and tree handoff
  - update `ajsTableHeader.test.ts`, `accessibilityDom.test.tsx`, and
    `tableShellIntegration.test.ts` for adapter-level keyboard regressions
  - run `rtk pnpm run test:compile` and the desktop suite through the repository
    test runner, then run `rtk pnpm run qlty` and `rtk pnpm run build` because
    React integration and exported types change
- Production Readiness:
  - Failure mode: stale identity or column state could strand focus; transitions
    must resolve to a visible stable-path cell, a focusable header, or a defined
    empty-grid result.
  - JP1/AJS compatibility: only stable unit identity/path is consumed; no
    definition content or parameter interpretation changes.
  - Large or malformed input risk: movement stays bounded and avoids per-key
    full-object copying; empty and removed-row states remain safe.
  - Desktop/web impact: keyboard decisions use browser-standard event data and
    presentation state shared by both webview hosts.
  - README/docs impact: none because shortcuts and behavior are preserved.
  - CHANGELOG impact: none under the internal-refactoring criteria.
- Approval Boundary: current table keyboard/focus behavior only; no new
  shortcuts, cross-view abstractions, visual redesign, or host API.
- Human approval: Approved in current conversation; implementation review found
  no outstanding findings.
- Dependencies: Slice 1, because interaction state uses presentation-owned row
  and column identity rather than Application DTO types.
- Risks: event ownership inside actionable cells and asynchronous virtualized
  mounting can regress even when pure transitions pass; preserve adapter-level
  regression tests.
- Out of Scope: broad renderer decomposition, shared flow/table interaction,
  header-search behavior, and accessibility copy changes.

#### Slice 2 implementation feedback

- The approved boundary was appropriate: pure focus, shortcut, restoration,
  selection, and off-screen target decisions moved cleanly while DOM ownership,
  mounted-element registration, Virtuoso scrolling, host/tree handoff, and
  Enter activation remained adapter concerns.
- Existing navigation exports were retained as compatibility re-exports for
  current presentation tests; Slice 3 can remove that adapter compatibility
  surface if no longer needed after renderer integration.
- Validation required one retry because Qlty's sandboxed log initialization
  failed after the initial passing run; the escalated rerun passed with no
  findings.

### Slice 3: Separate rendering, column actions, and virtualization adapters

- Status: Complete
- Scope: decompose `TableContents` and `VirtualizedTable` into cohesive
  presentation composition, table/column state, semantic rendering, and
  virtualization/DOM-focus adapters that consume the Slice 1 model and Slice 2
  interaction decisions; preserve header sorting, column visibility, row/cell
  rendering, accessibility, search, detail, navigation, and host events.
- User / Domain Value: the complete table workflow remains usable on desktop
  and web while renderer, column, and virtualization responsibilities become
  independently reviewable and maintainable.
- Cohesive Change Group: `TableContents.tsx`, `VirtualizedTable.tsx`,
  `TableHeader.tsx`, `DisplayColumnSelector.tsx`, and new table-local modules
  only when each module has one of these responsibilities: composition,
  column state/actions, semantic table rendering, or virtualization/DOM-focus
  adaptation. No shared viewer framework or unrelated helper extraction is
  included.
- Acceptance:
  - satisfies R2, R4, R5, R7 and AC3 through AC6
  - table composition does not own low-level mounted-element or Virtuoso handle
    decisions, and render components do not own interaction transitions
  - column visibility and sorting state remain explicit presentation state and
    preserve CSV/search/focus behavior
  - desktop and web viewers retain localized grid semantics, roving focus,
    high-contrast focus indicators, announcements, detail/navigation actions,
    and external reveal behavior
- Validation:
  - update `tableShellIntegration.test.ts`, `accessibilityDom.test.tsx`,
    `ajsTableHeader.test.ts`, `tableRenderTelemetry.test.ts`, and
    `tableColumnDef.test.ts` for the extracted column/render responsibilities
  - rerun the focused Slice 1 and Slice 2 table suites to prove integration
  - run `rtk pnpm run qlty` and resolve or record any new smell finding
  - run `rtk pnpm run build`, `rtk pnpm test`, and `rtk pnpm run test:web`
  - perform manual keyboard smoke verification in a large list for entry,
    navigation, sorting, column hide/show, detail return, tree handoff, and exit
- Production Readiness:
  - Failure mode: composition or effect timing could lose events, selection,
    focus, or readiness reports; shell and accessibility integration tests must
    cover refresh and externally requested reveal.
  - JP1/AJS compatibility: presentation-only change; validate representative
    existing table fixtures without altering projection expectations.
  - Large or malformed input risk: Virtuoso remains the rendering adapter;
    large-list focus scrolling stays bounded and invalid documents keep current
    error behavior.
  - Desktop/web impact: run both host validations and preserve browser-safe
    production imports with no new VS Code API.
  - README/docs impact: none expected; update only if review finds a real
    user-visible workflow change, which requires replanning.
  - CHANGELOG impact: none expected under the internal-refactoring criteria;
    any externally observable change requires replanning and reevaluation.
- Approval Boundary: presentation renderer/controller/adapters and their tests
  only; no Application, Domain, Infrastructure, transport, dependency, or
  user-visible behavior change.
- Human approval: Approved in current conversation.
- Dependencies: Slices 1 and 2.
- Risks: effect ordering, memoization, and virtualization callbacks are tightly
  coupled in the current component; extract along tested behavior seams and
  retain one integrated shell test.
- Out of Scope: shared header search (roadmap 7.4), flow-tree interaction
  (roadmap 7.5), table redesign, new accessibility wording, telemetry catalog
  changes, and dependency upgrades.

#### Slice 3 implementation feedback

- The renderer and Virtuoso component seams were cohesive and could be
  extracted without changing the interaction model or host wiring.
- Keeping column visibility actions in a table-local helper preserved the
  existing selector behavior while making the state update explicit.
- The web smoke runner required browser process permissions in this environment;
  the elevated retry completed with only existing teardown `EPIPE` noise.

### Slice 4: Coalesce keyboard-driven selection side effects

- Status: Approved
- Scope: keep grid focus, roving focus, virtualization, and the focused cell
  moving immediately, while coalescing keyboard-driven `selectRow` and
  `unit.select` side effects in the presentation layer. Commit only the last
  focused row after the proposed 150 ms keyboard-idle interval. Pointer row
  selection, tree selection, external reveal, Enter actions, detail opening,
  and focus handoffs commit immediately. Preserve the final selected unit,
  detail content, tree state, accessibility announcement, and operation
  semantics after the commit.
- User / Domain Value: rapid keyboard movement remains responsive and does not
  repeatedly rebuild the unit tree or detail panel for intermediate rows.
- Cohesive Change Group: `VirtualizedTable.tsx`, `TableContents.tsx`, the
  table-local selection/focus adapter or hook, and focused navigation,
  virtualization, shell, accessibility, and detail tests.
- Acceptance:
  - satisfies R5, R8, AC3, AC5, and AC7
  - arrow, PageUp/PageDown, Home/End, and Ctrl+Home/End movement updates the
    grid focus immediately without synchronously selecting every intermediate
    row in the tree or detail panel
  - one idle commit selects the final focused row, updates the existing tree,
    detail, announcement, and `unit.select` paths once, and preserves stable
    selection/focus semantics
  - pointer selection, tree selection, external reveal, Enter actions, detail
    opening/return, and leaving the grid flush or commit immediately
  - no new shortcut, transport schema, Application DTO, host API, or table
    library dependency is introduced
- Validation:
  - add focused tests with fake timers for repeated ArrowDown/PageDown input,
    intermediate-side-effect suppression, one final commit, and explicit-action
    immediate commits
  - rerun `tableNavigation.test.ts`, `tableVirtualizationFocus.test.ts`,
    `tableShellIntegration.test.ts`, `accessibilityDom.test.tsx`, and detail
    interaction tests
  - run `rtk pnpm run test:compile`, the desktop suite, `rtk pnpm run qlty`,
    `rtk pnpm run build`, and `rtk pnpm run test:web`
  - perform manual keyboard smoke verification in a large list after the
    debounce policy is implemented
- Production Readiness:
  - Failure mode: a pending timer could leave selection stale or update after
    document replacement; cancel and flush pending work on unmount, document
    change, explicit action, and grid exit.
  - JP1/AJS compatibility: only presentation-side timing changes; unit meaning,
    identity, projection, and definition content remain unchanged.
  - Large or malformed input risk: coalescing must remain O(1) per key event,
    preserve bounded focus movement, and safely clear pending paths.
  - Desktop/web impact: use browser-safe timers and preserve both host paths;
    verify desktop and web smoke behavior.
  - README/docs impact: update the source use case only if the approved timing
    policy becomes durable user-facing behavior.
  - CHANGELOG impact: required if the timing change is accepted as an
    externally observable behavior improvement; decide at Feature Exit.
- Approval Boundary: presentation-only keyboard selection timing and its tests;
  no change to Application, Domain, Infrastructure, transport, dependencies,
  shortcuts, or unrelated viewer behavior.
- Human approval: Approved in current conversation.
- Dependencies: Slices 1 through 3; this slice changes only their presentation
  interaction wiring.
- Risks: a debounce interval that is too long can make selection feel stale;
  flushing at explicit boundaries and validating the 150 ms policy are required.
- Out of Scope: changing grid focus movement, row rendering, tree component
  internals, detail content, search semantics, or the Feature Exit manual
  verification requirement.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this non-trivial user-workflow-preserving refactoring spans three
  completed implementation slices plus one behavior-timing replan slice and
  must map behavior, boundary requirements, and desktop/web validation
  explicitly.

## Cross-Slice Dependencies

- Implement in order: Slice 1 -> Slice 2 -> Slice 3 -> Slice 4.
- Slice 1 localizes the Application-to-presentation boundary used by all later
  table components.
- Slice 2 establishes the pure interaction decisions before Slice 3 moves DOM
  and virtualization responsibilities behind adapters.
- Slice 3 integrates the complete boundary and supplies final desktop/web and
  manual workflow evidence.
- Slice 4 addresses the discovered selection-side-effect performance gap after
  the interaction and rendering seams are available.
- Each slice has explicit approval recorded above; completing one slice does not
  approve a changed scope or a new slice.

## Feature-Level Risks

- Accidental column ID, label, visibility, order, or accessor drift can change
  table and CSV behavior.
- Stable-path selection can diverge from mounted-cell focus during sorting,
  document replacement, external reveal, or virtualized remounting.
- Extracting effects without preserving timing can duplicate host events or
  lose viewer-ready, telemetry, search, or focus requests.
- Keyboard focus and committed selection can diverge during a rapid sequence;
  pending selection must be coalesced and flushed at explicit interaction
  boundaries without leaving stale tree/detail state.
- Generic abstractions could widen the feature into shared search or flow
  interaction; keep contracts table-specific.
- Any Application DTO/schema or observable shortcut/workflow change requires
  replanning and renewed approval.

## Use-Case Back-Propagation

- Slice 4 is expected to preserve the existing use-case outcome while changing
  only keyboard-selection timing. Update `uc-view-unit-list.md` at Feature Exit
  if the approved coalescing policy is retained as durable user-facing
  behavior.
- At Feature Exit, update `uc-view-unit-list.md` or another source use case only
  if implementation discovers reusable behavior knowledge not already owned
  there; do not record file layout or implementation history.
- `docs/specs/roadmap.md` already owns item 7.3 and needs no planning update
  unless repository-level sequencing, entry conditions, or unresolved concerns
  change.

## Feature Exit

- Definition of Done status: blocked pending the approved Slice 4 plan and
  implementation, followed by manual large-list keyboard smoke evidence.
- Durable documentation updates: none planned beyond removing or revising the
  completed roadmap item during Feature Exit.
- Open risks: Slice 4 selection timing and the manual large-list keyboard smoke
  evidence remain open.
- Feature Exit determination: Not complete. The newly discovered performance
  gap requires an approved Slice 4 before Feature Exit can resume; the prior
  manual smoke blocker also remains.

## Validation

- [x] Tests added or updated with each approved slice (existing regression
      suites remained sufficient for this behavior-preserving extraction)
- [x] Focused table model, column, export, navigation, virtualization, shell,
      and accessibility tests pass
- [x] `rtk pnpm run qlty` passes for every code slice
- [x] Production build and required desktop/web validation pass
- [ ] Manual large-list keyboard smoke verification is recorded (requires an
      interactive large-list fixture; automated 10,000-row Slice 2 coverage
      passed)
- [ ] Slice 4 selection-side-effect coalescing is implemented, reviewed, and
      validated
- [x] README/user-documentation impact evaluated as none for the proposed
      behavior-preserving scope
- [x] CHANGELOG impact evaluated as none for the proposed internal refactoring

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
