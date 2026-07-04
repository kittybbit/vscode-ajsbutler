# Feature Tasks: Architecture Boundaries And Normalized AJS Model

## Plan Status

- Status: In Progress
- Planning scope:
  strengthen normalized-model application boundaries for the unit-list and CSV
  path first, then add a scoped dependency-rule test that is enforced by the
  existing non-doc Verify workflow.
- Review status:
  reviewed by `sdd-review-plan`; ready for approved slice implementation
- Human approval:
  Approved for all proposed implementation slices
- Active implementation slice:
  Slice 2 CSV Export Uses Application-Facing Row Input

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope:
  Slice 1 Unit-List Serialization Uses Normalized DTOs, plus remaining
  proposed implementation slices in this plan:
  Slice 2 CSV Export Uses Application-Facing Row Input;
  Slice 3 Scoped Architecture Dependency Rule Test.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Implementation Slices

### Slice 1: Unit-List Serialization Uses Normalized DTOs

- Status: Complete
- Scope:
  replace the webview-facing unit-list document rehydration path that rebuilds
  raw `Unit` trees with a serializable normalized-document DTO path.
- User / Domain Value:
  preserves table and flow document behavior while removing a raw-`Unit`
  round trip from the application/webview boundary.
- Smallest Useful Slice:
  the DTO shape, serializer/deserializer, document posting, table document
  parsing, flow document parsing, and tests must change together because the
  webview payload is one shared contract.
- Cohesive Change Group:
  - `src/application/unit-list/unitListDocument.ts`
  - `src/application/unit-list/buildUnitList.ts`
  - `src/presentation/webview/editor/ajsTable/TableContents.tsx`
  - `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`
  - `src/presentation/vscode/webview/ajsDocument.ts`
  - `src/test/suite/buildUnitList.test.ts`
  - `src/test/suite/AjsDocument.test.ts`
  - table and flow document parsing tests when existing coverage is not enough
- Acceptance:
  - `UnitListDocumentDto` remains JSON-serializable and carries normalized
    identity, hierarchy, parameters, layout, relation, and warning data needed
    by table and flow viewers.
  - `toAjsDocument(...)` restores an `AjsDocument` without constructing raw
    `Unit` objects.
  - Parser errors still produce no document payload.
  - Existing table and flow viewer document subscription behavior is preserved.
- Validation:
  - update `src/test/suite/buildUnitList.test.ts` and
    `src/test/suite/AjsDocument.test.ts`
  - add or update table/flow document parsing tests if existing coverage is not
    enough
  - `rtk pnpm test`
  - `rtk pnpm run qlty`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode:
    malformed webview document payloads continue to fall back to empty table or
    flow state rather than crashing the viewer.
  - JP1/AJS compatibility:
    no JP1/AJS semantic change; normalized values must match current
    `normalizeAjsDocument(...)` output for existing parser results.
  - Large or malformed input risk:
    avoid adding extra full-tree normalization passes in the webview; payload
    conversion should be linear in unit count.
  - Desktop/web impact:
    both hosts use the same serialized DTO payload; run web smoke because the
    table and flow webview entry points consume the contract.
  - README/docs impact:
    no README or user-doc change expected.
  - CHANGELOG impact:
    no CHANGELOG update expected because behavior is internal and
    behavior-preserving.
- Approval Boundary:
  limited to the shared unit-list document DTO contract, its normalized
  serialization/rehydration helpers, existing table/flow document consumers,
  and tests proving behavior preservation.
- Dependencies:
  existing `AjsDocument` / `AjsUnit` model and `normalizeAjsDocument(...)`.
- Risks:
  omitting normalized relation, layout, warning, or parent fields could break
  flow rendering or reveal behavior even when table rows still render.
- Out of Scope:
  parser grammar changes, wrapper deletion, table column behavior changes, CSV
  export refactor, dependency-rule automation, and webview message type
  redesign beyond the existing document payload.
- Implementation Feedback:
  the slice boundary was appropriate. The shared DTO contract, table/flow
  rehydration, and focused tests changed together without needing replanning or
  additional durable documentation before feature exit.

### Slice 2: CSV Export Uses Application-Facing Row Input

- Status: Approved
- Scope:
  move CSV export input construction away from direct TanStack table traversal
  by introducing an application-facing export input built from visible
  `UnitListRowView` data and presentation-supplied visible column metadata.
- User / Domain Value:
  copy and save continue producing the same CSV while export logic depends on
  stable unit-list row data rather than React Table internals.
- Smallest Useful Slice:
  row/column export DTOs, presentation column adaptation, CSV tests, and header
  integration must be reviewed together because column order, hidden columns,
  placeholders, and cell stringification define one user-visible CSV behavior.
- Cohesive Change Group:
  - `src/application/unit-list/exportUnitListCsv.ts`
  - `src/presentation/webview/editor/ajsTable/exportCsvView.ts`
  - `src/presentation/webview/editor/ajsTable/Header.tsx`
  - `src/presentation/webview/editor/ajsTable/tableColumnDef.tsx`
  - `src/presentation/webview/editor/ajsTable/columnDefs/*` only if column
    metadata must expose stable export accessors
  - `src/test/suite/exportUnitListCsv.test.ts`
  - `src/test/suite/exportCsvView.test.ts`
  - `src/test/suite/tableColumnDef.test.ts` if column metadata changes
- Acceptance:
  - copy and save CSV output remains byte-for-byte compatible for existing
    covered cases.
  - hidden columns remain excluded.
  - header rows preserve current placeholder and colspan behavior.
  - `exportUnitListCsv(...)` does not depend on TanStack, React, VS Code, or
    webview APIs.
  - presentation code may still read visible table state, but only to build a
    small export DTO for the application CSV function.
- Validation:
  - update `src/test/suite/exportUnitListCsv.test.ts`
  - update `src/test/suite/exportCsvView.test.ts`
  - update `src/test/suite/tableColumnDef.test.ts` if column metadata changes
  - `rtk pnpm test`
  - `rtk pnpm run qlty`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode:
    unsupported or missing cell values stringify to the same empty or string
    values as today.
  - JP1/AJS compatibility:
    no JP1/AJS interpretation change; CSV projects already-built row values.
  - Large or malformed input risk:
    export remains linear in visible rows and visible columns.
  - Desktop/web impact:
    CSV copy/save runs in webview code for both desktop and web extension
    hosts; web smoke is required.
  - README/docs impact:
    no README or user-doc change expected unless behavior changes during
    review.
  - CHANGELOG impact:
    no CHANGELOG update expected if CSV output is preserved.
- Approval Boundary:
  limited to CSV export DTO construction, CSV export application helpers, table
  header integration, and tests around existing CSV behavior.
- Dependencies:
  Slice 1 is not strictly required, but completing Slice 1 first reduces
  serialization uncertainty and confirms the row DTO source.
- Risks:
  React Table header placeholders and column visibility can regress subtly if
  the adapter does not preserve current header traversal behavior.
- Out of Scope:
  changing CSV format, changing telemetry event names or payloads, changing
  table search/filter semantics, and moving table-specific formatting into
  domain.

### Slice 3: Scoped Architecture Dependency Rule Test

- Status: Approved
- Scope:
  add a focused dependency-rule test that scans production `src` imports for
  the current high-value architecture constraints and runs under the existing
  desktop test command in CI.
- User / Domain Value:
  makes the boundary rules mechanically checkable without adding a new tool or
  broad CI workflow change.
- Smallest Useful Slice:
  the scanner/test, baseline rule set, and documentation of enforcement scope
  form one architecture responsibility and can be reviewed independently.
- Cohesive Change Group:
  - `src/test/suite/architectureDependencyRules.test.ts` or equivalent
  - `docs/specs/features/architecture-boundaries-normalized-ajs-model/TRACEABILITY.md`
  - `docs/specs/architecture.md` only if the implemented rule scope becomes a
    durable repository policy clarification
- Acceptance:
  - `src/domain` imports no `vscode`, React, MUI, XyFlow, webview modules, or
    generated parser modules.
  - `src/application` imports no `src/presentation` or `src/infrastructure`
    modules.
  - production `src/presentation` modules do not import generated ANTLR parser
    modules directly.
  - the test reports actionable file/import pairs for violations.
  - CI enforcement is through existing `pnpm run test:desktop:run` in the
    Verify workflow; no workflow change is required unless review requests one.
- Validation:
  - add `src/test/suite/architectureDependencyRules.test.ts` or equivalent
  - `rtk pnpm test`
  - `rtk pnpm run qlty`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode:
    violations fail tests with readable import and rule information.
  - JP1/AJS compatibility:
    no JP1/AJS behavior change.
  - Large or malformed input risk:
    not applicable; source scan should stay fast and bounded to production
    TypeScript files.
  - Desktop/web impact:
    no runtime impact; protects both hosts by preventing shared boundary leaks.
  - README/docs impact:
    update durable architecture docs only if the final enforced scope differs
    from existing documented policy.
  - CHANGELOG impact:
    not required; this is internal validation only.
- Approval Boundary:
  limited to adding the dependency-rule test and updating traceability or
  durable architecture docs for the enforced scope.
- Dependencies:
  can run after Slice 1 and Slice 2 so the first check reflects the tightened
  unit-list/CSV boundary; may be moved earlier by review if no violations are
  expected.
- Risks:
  path aliases, type-only imports, or test files can create false positives if
  the scanner is too broad; the initial rule must target production `src`
  modules only.
- Out of Scope:
  adding third-party architecture tooling, changing CI workflow files, fixing
  unrelated legacy violations, or blocking on broad dependency rules not
  covered by this feature.

## Cross-Slice Dependencies

- Slice 1 should be first because it removes the remaining raw-`Unit`
  serialization round trip on the shared table/flow document path.
- Slice 2 should follow Slice 1 because it builds on stable unit-list row data
  and focuses only on CSV export boundaries.
- Slice 3 should follow the boundary migrations unless review prefers earlier
  enforcement; its initial scope should avoid forcing unrelated refactors.

## Traceability

- TRACEABILITY.md required: yes
- Reason:
  this feature spans multiple use cases, affects JP1/AJS definition-file
  interpretation boundaries, and is split into multiple implementation slices.
- Status:
  updated for Planning Mode and ready for review.

## Feature-Level Risks

- `UnitEntity` wrapper behavior remains a migration source; behavior must be
  preserved through tests when normalized DTOs replace wrapper-adjacent paths.
- Webview serialization changes can affect both table and flow viewers even
  when parser behavior is unchanged.
- CSV output is user-visible, so behavior-preserving changes need byte-level
  regression assertions.
- Dependency-rule tests can become noisy if they try to enforce all future
  architecture goals at once.

## Use-Case Back-Propagation

- No durable use-case updates are required before implementation.
- After Slice 1, consider updating `uc-build-unit-list.md` and
  `uc-normalize-ajs-document.md` only if the serialized normalized DTO contract
  becomes durable beyond this feature.
- After Slice 2, update `uc-export-unit-list-csv.md` only if the stable export
  input shape becomes a durable behavior contract.
- After Slice 3, update `docs/specs/architecture.md` only if the enforced rule
  set or CI mechanism clarifies repository policy beyond the existing text.

## Feature Exit

- Definition of Done status:
  not ready; implementation slices are proposed and require review plus clear
  human approval before implementation.
- Durable documentation updates:
  pending slice outcomes and the Durable Documentation Gate.
- Open risks:
  normalized DTO completeness, CSV output compatibility, and dependency-rule
  false positives.

## Validation

- [x] Review the plan with `sdd-review-plan`.
- [x] Obtain clear human approval for implementation slices before editing
      runtime code, tests, generated artifacts, or configuration.
- [x] Run the slice-specific validation listed above during implementation.
