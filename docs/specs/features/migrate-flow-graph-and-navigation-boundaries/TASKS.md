# Feature Tasks: Migrate Flow Graph And Navigation Boundaries

## Agent Brief

- Purpose: complete one normalized flow graph, exploration, and navigation
  boundary without changing visible behavior.
- Approved or active slice: Slices 1-3 are complete; Slice 4 is active. All
  four reviewed slices were human-approved on 2026-07-21.
- Implement in order: serialized flow document/base graph, flow exploration DTO
  consumers, expanded placement constraints, then cross-view navigation.
- Do not change nodes, edges, layout, expansion, search, selection, zoom, or
  navigation behavior.
- Keep XyFlow, pixel geometry, viewport, and interaction state in presentation.
- Preserve semantic-diff highlights and flow/navigation telemetry.
- Remove each exact architecture allowance with the production import it owns.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the three source use
  cases.
- Validate every code slice with `rtk pnpm run qlty` and its risk-based checks.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: implement approved Slice 4 with `sdd-implement-task`.

## Plan Status

- Status: In Progress
- Planning scope: the serialized flow document, deterministic base and expanded
  graph contracts, placement constraints, presentation DTO consumption, and
  list/flow navigation target resolution.
- Review status: revised four-slice plan reviewed and found Ready for approval
  on 2026-07-21.
- Human approval: Approved on 2026-07-21 for all four slices.
- Active implementation slice: Slice 4.

## Human Approval

- Status: Approved
- Approved at: 2026-07-21
- Approved scope: all four reviewed implementation slices and their recorded
  approval boundaries, to be implemented one slice at a time in dependency
  order.

## Planning Gate

- Active feature folder:
  `docs/specs/features/migrate-flow-graph-and-navigation-boundaries/`.
- Requirements and acceptance: all six requirements R1-R6 and all four
  acceptance criteria AC1-AC4 in `SPECS.md` are covered by Slices 1-4.
- Slice list: serialized flow document/base graph, flow exploration DTO
  consumers and allowance removal, expanded graph placement constraints, and
  stable cross-view navigation.
- Implementation order: Slice 1, Slice 2, Slice 3, Slice 4.
- Baseline evidence: `rtk pnpm run qlty` passed on 2026-07-21. Current flow
  presentation has 25 exact owned presentation-domain allowances; the only
  other allowances are two Node-boundary entries owned by the later
  serialization/composition feature.
- Branch requirement: runtime implementation must start on a dedicated
  non-doc branch such as `codex/migrate-flow-graph-navigation-boundaries`.
  The current branch name belongs to the completed unit-information feature and
  is not an approved implementation branch for this feature.
- User-visible behavior: none changes. Existing graph, exploration, and
  navigation scenarios are compatibility evidence.
- JP1/AJS command/config reference impact: none. Existing normalized hierarchy,
  relation, unit-type, layout `h`/`v`, and JP1/AJS3 version 13 meaning are
  preserved; no new manual-derived rule is introduced.
- Breaking-change risk: internal DTO/type ownership may change, but the posted
  document fields and webview navigation event shape remain compatible.
- Undocumented behavior preserved: expanded-set-based deterministic layout,
  latest pending reveal wins, zoom-preserving search/tree centering, stable
  descendant root-jobnet resolution for job groups, and direct condition scope.
- Failure contract: invalid document identity/hierarchy/layout is unavailable;
  malformed relations are omitted with issues while valid content remains;
  invalid active scope is unavailable; invalid requested visible IDs are
  omitted with issues; unavailable navigation returns typed no-target without
  changing viewer state.
- Desktop/web risk: the same plain DTO and application decisions run in both
  hosts; no Node-only API may enter shared or webview code.
- Qlty evidence for every code slice: run `rtk pnpm run qlty`, resolve new smell
  findings, and use metric changes only when they identify a concrete graph,
  geometry, state, or navigation responsibility.

## Implementation Slices

### Slice 1: Establish A Serializable Flow Document And Base Graph Contract

- Status: Complete
- Completion approved: 2026-07-22.
- Scope: introduce an application-owned, plain `FlowGraphDocumentDto` and
  `FlowGraphUnitDto` projection/validation boundary for the existing serialized
  root-unit tree. Keep the current posted field shape while moving its type,
  validation, indexing, issue results, and flow-scope lookup responsibility out
  of the unit-list/presentation boundary. Make the base graph entry point consume
  this application contract and preserve a temporary adapter for presentation
  consumers that are migrated in Slice 2.
- User / Domain Value: desktop and web share one validated, deterministic flow
  identity/tree/base-graph contract that can be reviewed without changing the
  exploration UI.
- Smallest Useful Slice: document validation, indexing, typed results, and base
  graph construction form one application responsibility. They can be tested
  and committed independently while the temporary existing presentation adapter
  keeps the viewer usable until Slice 2.
- Cohesive Change Group:
  - `src/application/flow-graph/` flow document DTO, validation, indexing,
    issue/result types, scope lookup, and base graph entry point
  - `src/application/unit-list/unitListDocument.ts` only where the existing
    posted document composes the flow DTO without changing its wire fields
  - temporary adapter wiring needed to keep current presentation consumers
    working without adding a second serialized payload
  - flow-document serialization/validation and deterministic base graph tests
- Acceptance:
  - normalized input produces the same serialized unit identities, hierarchy,
    relations, layout values, semantic-diff highlights, and base graph nodes and
    edges
  - JSON round-trip input is validated into a plain flow document/index without
    exposing parser, React, XyFlow, VS Code, Map, Set, callback, or class
    instances in the transport DTO
  - duplicate identity/path, inconsistent parent/child hierarchy, parent cycle,
    or invalid layout makes the document and graph unavailable with issue
    evidence; presentation cannot render or retain a plausible partial graph
  - a malformed relation is omitted and reported while otherwise valid graph
    content remains available; no replacement or inferred edge is fabricated
  - a missing or invalid active scope returns an unavailable graph result
  - current desktop/web graph output and existing posted wire fields remain
    compatible; temporary domain-backed presentation consumers do not expand
    beyond their existing allowlist entries
- Validation:
  - extend `buildFlowGraphUseCase.test.ts` and `buildFlowGraph.test.ts` for DTO
    projection, deterministic base output, missing/invalid scope, malformed
    relation isolation, issues, highlights, and JSON round-trip behavior
  - add focused flow-document tests for duplicate identity/path, parent/child
    inconsistency, parent cycles, relation endpoint/type, invalid layout, and
    representative large/deep trees
  - verify fatal document errors return unavailable, malformed relations retain
    valid nodes while omitting only invalid edges, and no stale graph is retained
  - preserve `performance.flow_graph_build.completed` names, properties,
    buckets, and emission behavior
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
- Production Readiness:
  - Failure mode: fatal document structure/layout errors and invalid active
    scope return unavailable with issues; malformed relations are isolated with
    issues and cannot create plausible edges
  - JP1/AJS compatibility: preserve stable absolute-path identity, hierarchy,
    root-jobnet and condition scope rules, relation types, recovery jobnets,
    `h`/`v`, comments, schedule/wait flags, and existing graph content
  - Large or malformed input risk: validate and index once per document change,
    avoid repeated full-tree reconstruction, and cover representative large/deep
    input without a brittle duration threshold
  - Desktop/web impact: DTO validation and lookup are browser-safe and shared;
    no filesystem, process, or host API enters application/webview code
  - README/docs impact: none expected because visible workflow and payload shape
    remain unchanged
  - CHANGELOG impact: none for behavior-compatible internal refactoring; a
    visible graph or failure behavior change requires replanning
- Approval Boundary: approve only the plain serialized flow document contract,
  typed issue/result behavior, existing-payload composition/validation, base
  graph entry point, and minimal compatibility adapter. Do not approve
  presentation consumer migration, allowance removal, new wire fields, XyFlow
  or geometry movement, graph behavior changes, or serialization redesign.
- Dependencies: completed normalized-domain and unit-information features.
- Traceability: Build Flow Graph use case; `SPECS.md` R1, R4, and R6,
  Architecture, Failure Result Classification, Compatibility, and AC1 and AC3;
  document/result/base-graph validation above.
- Risks: the serialized root tree is shared with the table projection. DTO
  composition must preserve wire identity/order, and the temporary adapter must
  not become a second long-lived document model.
- Out of Scope: flow exploration consumer migration, allowance removal,
  localization, expanded placement constraints, navigation, wire redesign, and
  semantic-diff/report ownership migration.

### Slice 2: Migrate Flow Exploration Consumers To Application DTOs

- Status: Complete
- Completion approved: 2026-07-22
- Scope: make flow tree, search, detail, selection, expansion state,
  controller/effects, nodes, React graph mapping, and shared
  `UnitTreeSelector` consume the Slice 1 flow document/index instead of
  reconstructing `AjsDocument` or importing `AjsUnit`. Reuse
  presentation-owned resource localization for flow unit labels. Remove
  `toAjsDocument` after its final production/test consumer is migrated and
  remove all 25 exact presentation-domain allowances owned by this feature with
  their production imports.
- User / Domain Value: flow exploration uses the same application-facing DTO
  throughout presentation, eliminating parser-adjacent reconstruction and raw
  domain objects at the webview boundary.
- Smallest Useful Slice: all remaining exploration consumers and the shared tree
  form one boundary-closing responsibility. Migrating only a subset would keep
  reconstruction and allowances alive, while Slice 1 already provides the
  independently validated input contract needed for this migration.
- Cohesive Change Group:
  - flow tree, search, detail, selection, expansion, controller/effect, node,
    graph-view, and shared `UnitTreeSelector` presentation consumers
  - presentation-local unit-type localization backed by existing resources
  - final `toAjsDocument` production/test removal
  - flow search/detail/tree, unit-list shared-tree, localization, telemetry, and
    architecture dependency tests
  - this feature's 25 exact entries in
    `src/test/fixtures/architecture/dependencyAllowlist.ts`
- Acceptance:
  - current-scope search, selected/hovered tree synchronization, node detail,
    nested expandability, semantic-diff highlights, and English/Japanese/fallback
    unit labels remain unchanged
  - flow presentation and shared unit-tree presentation have zero direct domain
    imports and do not reconstruct `AjsDocument`
  - no allowance owned by this feature remains; the exact catalog is complete,
    unique, and stale-free, while the two later Node-boundary allowances remain
  - table use of the shared unit tree, unit-list projection, graph rendering,
    selection, search, viewport, and navigation behavior remain unchanged
- Validation:
  - update `flowSearch.test.ts`, `flowSelector.test.ts`,
    `flowNodeDetail.test.ts`, `flowGraphView.test.ts`, expansion state tests,
    shared unit-tree tests, and flow node display tests to use application DTOs
  - cover current scope, search matching/order, selection/hover sync, detail,
    nested expandability, localization fallback, and table shared-tree behavior
  - preserve `performance.flow_graph_build.completed`,
    `performance.flow_render.ready`, search, definition-action, and other flow
    telemetry names/properties/buckets/emission points in focused tests
  - run the architecture dependency suite after removing all 25 owned entries;
    verify only the two later Node-boundary allowances remain
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
- Production Readiness:
  - Failure mode: unavailable Slice 1 document/graph results leave presentation
    stable and empty without reconstructing a fallback domain object
  - JP1/AJS compatibility: preserve unit-type, hierarchy, recovery-jobnet,
    condition, relation, comments, schedule/wait flags, and label semantics
  - Large or malformed input risk: reuse the Slice 1 index across consumers and
    avoid per-component full-tree reconstruction or duplicate indexes
  - Desktop/web impact: all consumed DTOs remain plain and browser-safe; no
    Node-only or VS Code API enters webview/application code
  - README/docs impact: none expected because exploration behavior is unchanged
  - CHANGELOG impact: none unless label, graph, search, selection, or failure
    behavior changes, which requires replanning
- Approval Boundary: approve only migration of existing flow/shared-tree
  consumers to Slice 1 DTOs, presentation-local localization, final
  `toAjsDocument` removal, and the 25 exact allowance removals paired with their
  production imports. Do not approve expanded constraint extraction, navigation
  routing, search redesign, table behavior changes, wire changes, or later
  Node-boundary allowance removal.
- Dependencies: Slice 1.
- Traceability: Build Flow Graph and Explore Flow Graph use cases; `SPECS.md`
  R2 and R4, Architecture, Compatibility, and AC1-AC4; exploration, telemetry,
  table regression, and architecture validation above.
- Risks: `UnitTreeSelector` is shared by table and flow viewers; narrowing its
  input type must preserve table identity/order and callback behavior. Removing
  allowances before every matching import is gone would make the catalog
  incomplete.
- Implementation Feedback: retaining the complete validated Slice 1 document
  and index in the flow controller removed duplicate presentation indexes and
  gives Slice 3 one reusable input for base and expanded graph work. The slice
  boundary was appropriate; this handoff is feature-specific and does not
  require durable documentation outside the feature artifacts.
- Out of Scope: expanded placement constraints, host navigation routing,
  semantic-diff/report migration, repository-wide localization, serialization
  redesign, and removal of normalized fields needed by later features.

### Slice 3: Expose Deterministic Expanded-Graph Placement Constraints

- Status: Complete
- Completion approved: 2026-07-22.
- Scope: make the application graph builder accept the active scope and complete
  visible nested-unit set, then return deterministic expanded nodes/edges plus
  plain containment, stable sibling order, placement-constraint, and affected-
  subtree data. Move nested graph structure, relation selection, scope
  membership, and expansion-order decisions into application. Split the current
  presentation `buildExpandedFlowGraph` so presentation consumes those
  constraints and retains all font-relative metrics, coordinates, dimensions,
  bounds, panel decoration, collision realization, viewport fit, centering,
  zoom, and XyFlow conversion.
- User / Domain Value: the same scope and visible nested set define the same
  graph meaning and placement obligations regardless of expansion action order,
  while the renderer remains free to realize geometry.
- Smallest Useful Slice: expanded graph content and its structural constraints
  must move together; moving only node creation or only constraint metadata
  would leave duplicated placement decisions across application and
  presentation.
- Cohesive Change Group:
  - application expanded graph input/result and placement-constraint DTOs under
    `src/application/flow-graph/`
  - current expanded graph structural helpers migrated or replaced in the
    application boundary
  - presentation geometry/layout helpers renamed or narrowed to realize the
    application constraints into coordinates, bounds, and decorations
  - expanded graph, geometry, viewport, render, and performance telemetry tests
- Acceptance:
  - identical flow document, active scope, visible nested set, and highlights
    produce identical expanded nodes, edges, containment, sibling order,
    constraints, and affected-subtree membership independent of action order
  - only valid nested jobnets inside the active root-jobnet scope are expanded;
    missing, duplicate, or out-of-scope requested IDs are omitted with issue
    evidence and cannot enter the normalized visible set
  - an invalid active scope returns unavailable; a valid scope always receives
    one complete constraint set for the normalized valid visible set, never a
    plausible partial constraint set
  - expanded sibling subtrees remain non-overlapping after presentation
    realization; unrelated upper-left regions and internal relative positions
    remain stable under nested growth
  - recovery jobnets, condition nodes, relations, semantic-diff highlights,
    panel decorations, and exact existing rendered coordinate fixtures remain
    compatible
  - application output contains no pixels, bounds, renderer values, XyFlow,
    React, host types, or callbacks; presentation does not recompute graph
    identity, relation, scope, containment, sibling order, or affected scope
- Validation:
  - add application tests for visible-set normalization, nested structure,
    deterministic sibling order, placement constraints, affected scope,
    malformed/missing/out-of-scope IDs, recovery jobnets, relations, highlights,
    deep nesting, and expanded sibling sets
  - split/update `buildExpandedFlowGraph.test.ts` so application assertions cover
    graph meaning and presentation assertions preserve existing coordinate,
    bounds, panel-intrusion, sibling-collision, and no-overlap fixtures
  - preserve `flowGraphView.test.ts`, `flowViewportFocus.test.ts`, flow render
    tests, and flow graph/render telemetry buckets and emission behavior
  - add a representative large/deep expanded graph assertion without a brittle
    duration threshold and review allocation/recomputation risk
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
- Production Readiness:
  - Failure mode: invalid active scope returns unavailable; missing, duplicate,
    or out-of-scope visible IDs are omitted with issues before the complete
    constraint set is built; geometry never receives constraints for an invalid
    scope or a partially validated visible set
  - JP1/AJS compatibility: preserve normalized relation, hierarchy, recovery
    jobnet, condition, and layout meaning; no new command/config rule
  - Large or malformed input risk: avoid rebuilding document indexes per nested
    node, keep expansion work bounded by the active scope/visible set where
    practical, and retain guarded cycle/unknown-ID behavior
  - Desktop/web impact: application output is plain and renderer-independent;
    the same presentation geometry path remains browser-safe in both hosts
  - README/docs impact: none expected because graph visuals and exploration
    behavior are unchanged
  - CHANGELOG impact: none unless coordinates, viewport behavior, expansion,
    or graph content change, which requires replanning
- Approval Boundary: approve only application ownership of expanded graph
  structure/constraints and presentation realization of those constraints with
  regression-preserving helper moves or replacements. Do not approve visual
  redesign, new layout optimization goals, new expansion features, search/state
  movement, XyFlow in application, or coordinate fixture changes without a
  separately reviewed compatibility decision.
- Dependencies: Slice 2, which closes presentation DTO consumption on top of the
  Slice 1 document/index contract.
- Traceability: Build Flow Graph and Explore Flow Graph use cases;
  `SPECS.md` R1, R2, R5, and R6, Layout Responsibility Classification,
  Failure Result Classification, Compatibility, and AC1-AC3; structural,
  failure-result, and geometry validation above.
- Risks: the current geometry pipeline interleaves structure, growth offsets,
  panel intrusion, and collision phases. The split must preserve phase ordering
  while preventing either side from silently redefining the other's contract.
- Implementation Feedback: application-owned containment ranges and separate
  horizontal/vertical affected-sibling memberships allowed presentation to
  preserve the existing geometry phase order without recomputing structural
  scope from rendered coordinates. The original all-sibling candidate contract
  was rejected during independent review because it left membership ownership
  in presentation; the corrected directional contract passed the focused
  re-review and unchanged exact-coordinate regressions. This is feature-local
  implementation evidence and requires no durable documentation update.
- Out of Scope: alternative layout engines, layout optimization for its own
  sake, persistence of viewport/expansion state, shared search semantics,
  navigation routing, and semantic-diff ownership changes.

### Slice 4: Stabilize Cross-View Navigation And Reveal Contracts

- Status: Approved
- Scope: introduce an application-owned plain navigation request/target result
  for stable absolute-path identity, active flow scope, revealed unit, required
  expanded ancestors, and unavailable results. Move flow reveal target
  resolution out of `presentation/webview/editor/revealUnit.ts`. Keep webview
  message encoding, counterpart panel lookup/open/reveal, readiness queueing,
  focus, and VS Code APIs in shared/presentation/bootstrap adapters. Preserve the
  current `{ targetView, absolutePath }` navigate event and
  `{ absolutePath }` reveal event shapes unless review proves an additive
  backward-safe field necessary.
- User / Domain Value: list and flow viewers resolve the same stable unit into a
  predictable counterpart scope without importing each other's component state
  or reconstructing graph/domain objects.
- Smallest Useful Slice: semantic target resolution, webview event adaptation,
  host counterpart routing, and reveal consumption must be validated together
  to prove existing open/focus/deferred-reveal behavior end to end.
- Cohesive Change Group:
  - application navigation DTOs and target-resolution use case
  - table and flow navigation adapters and reveal subscriptions
  - shared webview navigation/reveal event types only where they adapt the
    application contract without changing the wire shape
  - `viewerWiring.ts`, viewer factory/message routing, pending reveal handling,
    and focused telemetry-preservation tests
  - reveal, table navigation, viewer event bridge/routing/factory/wiring, flow
    tree/search selection, and desktop/web tests
- Acceptance:
  - table-to-flow and flow-to-table requests use stable absolute-path identity
    and preserve the current event payloads
  - job groups resolve to the first descendant root jobnet in stable tree order
    while retaining the original revealed unit when possible; direct condition
    parents and nearest jobnet ancestors preserve current scope behavior
  - required nested ancestors are returned deterministically for a reveal
    without changing search, selection, zoom, or active scope implicitly
  - an existing counterpart panel is revealed immediately; a missing panel is
    opened and receives the latest pending reveal after readiness
  - missing path, invalid payload, unavailable factory/context, or job group
    without a meaningful flow scope leaves the current viewer stable and fails
    predictably without throwing
  - `viewer.table.navigate_to_flow`, `viewer.flow.navigate_to_table`, viewer
    open/ready source attribution, and all telemetry privacy constraints remain
    unchanged
- Validation:
  - move/extend `revealUnit.test.ts` for application request/result, root-jobnet,
    condition, nested ancestors, stable ordering, invalid path, unavailable
    scope, cycle, and JSON-safe contract coverage
  - preserve/extend `tableNavigation.test.ts`, `viewerEventBridge.test.ts`,
    `viewerMessageRouting.test.ts`, `viewerFactory.test.ts`, and
    `viewerWiring.test.ts` for existing/missing counterpart panels, latest
    pending reveal, readiness ordering, invalid events, and unavailable targets
  - preserve flow search/tree selection, viewport focus, viewer telemetry, and
    viewer action telemetry regression tests
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
- Production Readiness:
  - Failure mode: invalid/unavailable navigation resolves to a typed no-target or
    no-op; current viewer state remains unchanged and no misleading target is
    posted
  - JP1/AJS compatibility: stable absolute paths, hierarchy, root-jobnet,
    condition, and nested ancestor semantics remain unchanged
  - Large or malformed input risk: resolve through the validated Slice 1 index,
    guard parent cycles, and avoid repeated full-tree scans per reveal
  - Desktop/web impact: semantic resolution is host-neutral; VS Code panel and
    readiness behavior remains in the outer adapter and works in both hosts
  - README/docs impact: none expected because commands and workflows are
    unchanged; durable use cases already state the contract
  - CHANGELOG impact: none for wire- and behavior-compatible refactoring; any
    user-visible failure, focus, or navigation workflow change requires
    replanning
- Approval Boundary: approve only stable navigation request/result DTOs,
  semantic target resolution, existing event adaptation, counterpart routing,
  reveal consumption, and exact regression/telemetry tests. Do not approve new
  commands/actions, cross-document navigation, event format replacement, new
  error UI, selection/search redesign, or host/composition standardization.
- Dependencies: Slice 1. Slices 2 and 3 are independent of navigation after the
  Slice 1 document/index contract exists, but planned implementation order
  completes the graph boundary before host navigation and all must complete
  before Feature Exit.
- Traceability: Navigate Between Unit List And Flow Graph use case;
  `SPECS.md` R3, R4, and R6, Failure Result Classification, Compatibility, and
  AC1-AC3; navigation, host, no-target, telemetry, desktop, and web validation
  above.
- Risks: readiness timing and WeakMap pending state encode latest-request
  behavior; changing event ownership without preserving adapter order can drop
  or duplicate reveal requests.
- Out of Scope: new navigation UI, cross-document targets, persisted navigation
  history, new diagnostics, host lifecycle redesign, and removal of the two
  Node-boundary allowances owned by the serialization/composition feature.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: three behavior-rich use cases, four dependent slices, serialized and
  navigation contracts, geometry responsibility, host parity, telemetry, and
  25 exact architecture allowances require explicit correspondence.
- Status: planned mappings cover all feature requirements and acceptance
  criteria; implementation evidence is pending.

## Cross-Slice Dependencies

- Slice 1 establishes the validated plain flow document/index, typed failure
  results, and base graph contract while a temporary adapter preserves current
  presentation consumers.
- Slice 2 consumes Slice 1 DTOs across flow/shared-tree presentation, removes
  the temporary reconstruction path, and removes all 25 feature-owned
  allowances.
- Slice 3 consumes the closed Slice 2 presentation boundary to separate
  application expanded structure/constraints from presentation geometry.
- Slice 4 consumes Slice 1 identity/index and is independent of Slices 2 and 3
  after that contract exists, but planned order completes graph behavior before
  host navigation.
- Any need to change visible graph/geometry/search/selection/zoom/navigation,
  add wire fields that are not proven backward-safe, alter telemetry, or move
  XyFlow/host state inward requires Replanning Mode and renewed review/approval.

## Feature-Level Risks

- The posted document is shared by table and flow viewers; flow DTO ownership
  changes must preserve table validation, shared tree behavior, definition
  lookup, JSON serialization, desktop decoding, and web behavior.
- Existing expanded layout mixes semantic structure with pixel geometry across
  several helpers. Incorrect splitting can preserve types while changing
  coordinates, overlap avoidance, unaffected regions, or phase ordering.
- Absolute path is both stable identity and navigation payload. Duplicate or
  inconsistent identity must fail closed rather than select a plausible unit.
- Flow search remains presentation-local and must not become an unplanned shared
  search domain contract.
- Semantic-diff highlight metadata is consumed by flow nodes/edges but semantic
  diff ownership is a separate roadmap feature.
- Flow graph build/render, search, definition action, viewer navigation, open,
  and ready telemetry schemas and emission points are observable compatibility
  surfaces and must remain privacy-safe.
- Large/deep definitions can regress through repeated flattening, index rebuilds,
  recursive expansion, geometry recomputation, or duplicate transport data.
- No dependency addition or `engines.vscode` change is planned or approved.

## Out Of Scope

- New graph nodes, edges, features, visuals, search semantics, interaction
  behavior, layout goals, navigation UI, commands, configuration, or errors.
- Parser grammar, normalization meaning, JP1/AJS command/config rules, semantic
  diff/report boundaries, diagnostics/hover, WebAPI, or telemetry adapter
  migration.
- Repository-wide serialization/composition convergence, wire format replacement,
  service containers, Node-boundary allowance removal, and minimum VS Code
  version changes.

## Use-Case Back-Propagation

- The three source use cases already state the intended durable behavior and
  responsibility split.
- Update them only if implementation proves a reusable statement inaccurate or
  incomplete; do not record file layout, migration history, or review notes.
- No README, architecture, roadmap, or CHANGELOG update is currently required.
  Re-evaluate after each slice and during Feature Exit using the Durable
  Documentation Gate and CHANGELOG criteria.

## Feature Exit

- Definition of Done status: not started.
- Required evidence: all four slices Complete; requirements and acceptance
  criteria satisfied; all 25 feature-owned allowances removed; graph,
  expansion, geometry, search, selection, reveal, navigation, telemetry,
  large/malformed, desktop, and web validation recorded; traceability current;
  durable-doc/CHANGELOG decisions re-evaluated; risks resolved, accepted, or
  propagated.
- Closure requires Feature Exit Mode and explicit human approval.
