# Feature Tasks: High-Complexity Hotspot Resolution

## Agent Brief

- Purpose: reduce complexity in unit-list document validation and projection
  without changing its contract.
- Approved or active slice: none; Slice 1 and Slice 2 are complete, with
  Feature Exit Review pending.
- Do not: edit runtime code, tests, generated artifacts, or configuration
  before a reviewed slice receives Human Approval.
- Do not: change unit-list, CSV, parser, presentation, or JP1/AJS semantics.
- Read first: `SPECS.md`, this file, and `../BASELINE.md` intake group 6.
- Read `TRACEABILITY.md` when reviewing or implementing a slice.
- Validate: nearest tests, desktop/web checks, Qlty, and targeted metrics.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: record Slice 2 completion approval, then evaluate Feature Exit.

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

- Status: In Progress
- Planning scope: revise the two-slice decomposition of the serialized
  unit-list table-projection boundary while preserving input acceptance, public
  document/table-data contracts, and viewer fail-closed behavior.
- Review status: Reviewed; plan ready for approval
- Human approval: Approved
- Active implementation slice: none; proceed to Feature Exit Review

## Current Planning Decision

- The prior plan cannot proceed to approval unchanged because its domain
  dependency wording conflicted with the application architecture, its direct
  call-site inventory was imprecise, its Qlty reduction gate was not
  reproducible enough, and S2 did not explicitly prove the viewer empty safe
  state after identity rejection.
- Keep two slices and the existing S1 -> S2 dependency. Clarify the input
  boundary, helper type/API ownership, caller classification, metric protocol,
  production-readiness validation, and traceability without adding a new
  runtime slice or widening the approved behavior; focused regression tests
  remain part of the existing slices.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 and Slice 2 as defined in this reviewed plan; implement
  and validate them in order, without changing their approval boundaries.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Impact Investigation

- Selected feature: `high-complexity-hotspot-resolution`, explicitly named by
  the user and matched by the current branch.
- Comparison base: the merge-base with repository default branch
  `origin/main`; inherited branch changes remain outside this feature.
- Baseline dependency: `../BASELINE.md` intake group 6 identifies
  `unitListDocument.ts`, five target functions, rank 9, priority 100, raw
  metrics `224/28/536/509/0`, Qlty smells, and five fixed-window touches.
- Metric identity: use the recorded Qlty version/configuration and capture a
  current-branch pre-Slice-1 snapshot before implementation. The shared
  baseline value remains historical comparison evidence, not a substitute for
  the current pre-slice measurement. The exact metric commands are owned by
  `../BASELINE.md`; `rtk pnpm run qlty` remains the separate required quality
  check.
- Pre-Slice-2 snapshot (`b1082639`): the selected files measure file `Cyclo`
  `58` for `unitListDocument.ts`, `45` for
  `unitListDocumentValidation.ts`, `45` for `unitListRowValidation.ts`, and
  `148` in total. `hasMatchingProjectionIdentity` is function `Cyclo 49`
  with cognitive complexity `7`; `toUnitListTableData` is `Cyclo 4` with
  cognitive complexity `4`. The only target smells are the existing identity
  smell and its complex binary expression in `unitListDocument.ts`.
- Primary metric gate: function-level `Cyclo` over the five baseline hotspot
  functions plus every function in `unitListDocument.ts` and extracted
  responsibility files that implements the selected validation/identity
  boundary. The baseline maximum is `59` for `isUnitListRowRecord`. Slice 1
  must lower the structural-validation subset maximum; Slice 2 must lower the
  final responsibility maximum below the pre-Slice-1 maximum. Each helper
  replacing a mapped baseline function must remain below that function's
  pre-Slice-1 `Cyclo`. The residual `unitListDocument.ts` file `Cyclo` must not
  increase in either slice and must be lower at feature completion than the
  pre-Slice-1 snapshot. New Qlty smells are a hard failure; cognitive
  complexity, file `Complex`, LOC, and directory movement are secondary review
  signals and are not independent failure gates.
- Characterization dependency: existing `buildUnitList.test.ts` and
  `tableViewerData.test.ts` cover malformed shape rejection, identity mismatch,
  large deterministic projections, and presentation fail-closed behavior;
  `unitListEncoding.test.ts` covers UTF-8 and Shift_JIS host decoding, and
  `exportUnitListCsv.test.ts` / `exportCsvView.test.ts` cover CSV input and
  payload behavior.
- Affected public symbols: `UnitListDocumentDto`, `UnitListTableDataDto`,
  `toUnitListDocumentDto`, and `toUnitListTableData`; their signatures and
  semantics remain unchanged.
- Direct production call site for `toUnitListTableData`:
  `TableContents.tsx`. `tableViewerData.ts` consumes the validated result;
  `buildUnitList.ts` produces the document DTO and `viewerHostMessages.ts`
  validates transport/flow payloads. All remain regression boundaries with no
  consumer edit planned.
- Behavior scenarios changed, added, or removed: none.
- Breaking-change and VS Code compatibility risk: none intended; any exported
  shape, behavior, or `engines.vscode` change requires replanning.
- Telemetry impact: none.
- JP1/AJS reference basis: no external command or configuration reference;
  preserve the existing inferred and characterized definition behavior.
- Current input-boundary assumption: preserve `isRecord`, optional-field,
  `typeof number`, extra-key, and empty-projection behavior already accepted by
  `toUnitListTableData`; do not introduce plain-JSON or finite-number
  validation as part of this refactor.

## Implementation Slices

### Slice 1: Isolate Serialized Document Shape Validation

- Status: Complete
- Scope: extract browser-safe application helpers that validate serialized
  root-unit trees, the required table-projection envelope and arrays, all
  unit-list row groups, linked units, and unit metadata; use a single
  validated candidate result from `toUnitListTableData` before identity
  checking. Expected files are
  `src/application/unit-list/unitListDocument.ts`, new
  `src/application/unit-list/unitListDocumentValidation.ts`, new
  `src/application/unit-list/unitListRowValidation.ts`,
  `src/test/suite/buildUnitList.test.ts`, and
  `src/test/suite/tableViewerData.test.ts`.
- User / Domain Value: malformed viewer payloads continue to fail closed as an
  empty safe list, while the validation responsibility becomes independently
  understandable and testable.
- Smallest Useful Slice: structural shape validation has one application
  responsibility, can preserve the existing identity check unchanged, and can
  be reviewed, tested, committed, and approved without the later identity
  decomposition.
- Cohesive Change Group: `isUnitListRowRecord`, `isUnitListRootDto`,
  `isUnitListUnitMetadata`, primitive and group validators, the structural
  branch of `toUnitListTableData`, and their focused characterization tests.
- Acceptance:
  - valid values supplied to `toUnitListTableData` still produce the same
    table-data candidate, including empty projections and unrelated top-level
    fields;
  - malformed root, row-group, linked-unit, array, optional scalar, and unit
    metadata fields return `undefined` without throwing or returning partial
    data;
  - recursive child validation and supported `ty` symbols remain unchanged;
  - current record, optional-field, numeric, and extra-key acceptance semantics
    remain unchanged;
  - exported DTOs and conversion signatures remain unchanged;
  - no parser, presentation, VS Code, Node built-in, host-specific, or
    telemetry dependency enters the extracted application helpers; existing
    pure domain value dependencies remain allowed.
- Validation:
  - add or refine focused characterization in `buildUnitList.test.ts` and
    `tableViewerData.test.ts` before the structural move within this slice;
  - run `rtk pnpm test`, `rtk pnpm run test:web`,
    `rtk pnpm run qlty`, and `rtk pnpm run build`;
  - confirm `architectureDependencyRules.test.ts` passes in desktop tests;
  - run the exact baseline Qlty function, file, directory, and smell commands
    against the recorded production roots, using the recorded version and
    configuration, and compare `unitListDocument.ts` plus every extracted
    responsibility file against the current pre-Slice-1 snapshot;
  - apply the primary function-level `Cyclo` gate: the structural-validation
    subset maximum is lower than the pre-Slice-1 subset maximum, each mapped
    replacement helper is below its pre-Slice-1 function, the residual file
    `Cyclo` does not increase, and no new Qlty smell is found;
  - report cognitive, file `Complex`, LOC, and directory rows as secondary
    signals; metrics-only movement in those fields is a review signal rather
    than an automatic failure.
- Production Readiness:
  - Failure mode: malformed or incomplete serialized data returns `undefined`;
    existing presentation consumers retain their empty safe-state fallback.
  - JP1/AJS compatibility: validation accepts exactly the currently supported
    normalized shapes and adds no command or definition interpretation.
  - Large or malformed input risk: retain recursive validation semantics and
    verify bounded large input plus representative corruption; do not add
    repeated full-tree scans beyond current behavior. Preserve current
    acceptance of empty projections, extra keys, and numeric/record semantics.
  - Desktop/web impact: desktop encoding coverage remains in
    `unitListEncoding.test.ts`; shared application tests verify the serialized
    application-facing projection, while the desktop test run and web
    build/smoke coverage verify host integration and browser-safe application
    loading. Web coverage does not use desktop filesystem APIs or assert
    byte-level encoding equivalence; production helpers remain free of Node and
    VS Code imports.
  - README/docs impact: none because observable behavior is unchanged; reassess
    only if implementation reveals a behavior change.
  - CHANGELOG impact: none under the repository criteria for internal
    refactoring with no externally observable change.
- Approval Boundary: this slice may change only the listed application
  validation files and focused tests. Exported contract changes, consumer
  edits, identity-algorithm changes, behavior changes, or other layers require
  Replanning Mode and new approval.
- Dependencies: completed baseline and existing characterization evidence; no
  dependency on Slice 2.
- Risks: accidentally widening or narrowing accepted optional fields, losing
  recursive validation, cyclic test fixtures that were never valid inputs,
  or mechanically relocating complexity without reducing it.
- Out of Scope: projection identity correspondence, public API redesign,
  parser normalization, list construction, CSV generation, presentation, and
  host behavior.
- Implementation Result:
  - Status: complete; completion approved.
  - Feedback: the slice boundary was appropriate. The structural validators
    needed small responsibility helpers so the Qlty gate measured the
    extracted code rather than only the residual file; no new dependency or
    consumer change was required.
  - Knowledge propagation: none; the result is feature-specific and existing
    durable use cases and architecture documents already describe the stable
    contract and dependency boundary.

### Slice 2: Isolate Projection Identity Consistency

- Status: Complete
- Scope: extract browser-safe application logic that checks tree parentage,
  flattened order, unique identifiers and paths, and root/row/metadata field
  correspondence; leave `toUnitListTableData` as a small public composition
  function returning the unchanged DTO. Expected files are
  `src/application/unit-list/unitListDocument.ts`, new
  `src/application/unit-list/unitListProjectionIdentity.ts`,
  `src/test/suite/buildUnitList.test.ts`,
  `src/test/suite/tableViewerData.test.ts`, and traceability/status evidence in
  this feature folder.
- User / Domain Value: deterministic unit identity, hierarchy, ordering, and
  metadata remain trustworthy for list rendering, navigation, and CSV export,
  while the identity responsibility becomes independently testable.
- Smallest Useful Slice: identity consistency is one application contract and
  depends on structurally validated candidates; combining it with structural
  validation would create a larger approval boundary, while splitting its
  tree, row, and metadata comparisons would leave unprovable partial checks.
- Cohesive Change Group: `flattenUnitListRootDtos`,
  `hasConsistentTreeParentage`, `hasMatchingProjectionIdentity`, the final
  composition in `toUnitListTableData`, and focused identity tests.
- Acceptance:
  - root, row, and metadata counts, order, IDs, absolute paths, names, parent
    IDs and paths, unit types, root-jobnet state, group type, comment, recovery,
    JP1 username, and resource group retain exact correspondence;
  - duplicate IDs or absolute paths, broken parentage, reordered or partial
    projections, and mismatched fields return `undefined` without partial data;
  - valid small, mixed, encoded, and bounded large projections retain the same
    output and deterministic ordering;
  - table rendering, definition actions, list-to-flow navigation, and CSV
    consumers retain the same application-facing rows and metadata;
  - identity rejection is consumed by the existing table-viewer path as the
    empty safe state, with no partial rows or metadata exposed;
  - final Qlty evidence satisfies the primary function-level `Cyclo` gate:
    lower final responsibility maximum, lower residual-file `Cyclo`, no mapped
    equal-or-higher replacement helper, and no new Qlty smell, with secondary
    metrics reported as review signals.
- Validation:
  - add focused identity characterization for duplicate identity, broken tree
    parentage, reorder, missing rows or metadata, and cross-shape mismatches;
  - add a table-viewer assertion that identity rejection produces empty root,
    row, ID, and path maps, not only `undefined` from the conversion function;
  - run `rtk pnpm test`, `rtk pnpm run test:web`,
    `rtk pnpm run qlty`, and `rtk pnpm run build`;
  - confirm unit-list, table-viewer, viewer-message, flow-navigation, and CSV
    regression suites pass in the desktop test run; separately verify the web
    build and browser smoke path;
  - reproduce the baseline Qlty function, file, directory, and smell commands
    with the recorded version/configuration; compare the complete selected
    responsibility against both the current pre-Slice-1 and pre-Slice-2
    snapshots;
  - apply the primary function-level `Cyclo` gate: the final selected
    responsibility maximum is lower than the pre-Slice-1 maximum, each mapped
    replacement helper is below its pre-Slice-1 function, the final residual
    file `Cyclo` is below its pre-Slice-1 snapshot and historical reference
    value 224, and no new Qlty smell is found;
  - report cognitive, file `Complex`, LOC, and directory rows as secondary
    review signals without treating their movement alone as failure.
- Production Readiness:
  - Failure mode: inconsistent identity returns `undefined`; the viewer keeps
    its existing empty safe state and does not present a partial list.
  - JP1/AJS compatibility: stable identity and ordering are preserved without
    new JP1/AJS semantics or parser assumptions.
  - Large or malformed input risk: preserve bounded linear traversal and map or
    set lookup behavior; run existing 500-child and 128 mixed-unit coverage and
    representative malformed cases.
  - Desktop/web impact: desktop encoding remains host-specific; shared
    application tests verify the serialized application-facing DTO, while the
    desktop test run and web build/smoke coverage verify host integration and
    browser-safe application logic. The production build must pass.
  - README/docs impact: none expected; durable use cases already own the stable
    observable contract.
  - CHANGELOG impact: none unless final review finds externally observable
    behavior, in which case stop and replan before documenting it.
- Approval Boundary: this slice may change only the listed identity and public
  composition application files, focused tests, and feature-local evidence.
  Consumer, DTO, parser, CSV, presentation, host, or observable behavior changes
  require Replanning Mode and new approval.
- Dependencies: Slice 1 must be complete so identity checks consume the single
  structurally validated candidate boundary.
- Risks: changing preorder semantics, accepting duplicate identity, confusing
  root `/` parent-path handling, increasing traversal cost, or proving only the
  residual file metric while shifting complexity into extracted helpers.
- Out of Scope: UI behavior, CSV formatting, unit-list field construction,
  parser/error policy, generalized validation libraries, and repository-wide
  complexity gates.
- Implementation Result:
  - Status: complete; completion approved.
  - Feedback: the slice boundary remained cohesive. Grouping the identity
    comparisons into explicit contexts removed parameter-count smells without
    changing the public composition function or its correspondence checks.
    No durable knowledge propagation is required.
  - Validation: desktop tests, web tests, Qlty, build, exact target metrics,
    directory metrics, and smell checks passed. The selected files measure
    `131` total file `Cyclo`; `unitListDocument.ts` is `6`, and the extracted
    identity helper maximum is `12`. No target smell was introduced.

## Cross-Slice Dependencies

- Implement Slice 1 before Slice 2. Slice 1 establishes the validated candidate
  consumed by the identity boundary.
- Each slice is separately reviewable, committable, and approvable. Completion
  of Slice 1 does not authorize Slice 2.
- Record before/after Qlty evidence for each slice; Slice 2 also compares the
  complete selected responsibility against the shared baseline. Capture the
  current pre-Slice-1 snapshot before implementation and a pre-Slice-2 snapshot
  after Slice 1 so each comparison is reproducible. Use function `Cyclo` as the
  primary gate and the other recorded metrics as secondary review signals.
- If Slice 1 requires consumer edits or Slice 2 discovers duplicated
  orchestration, stop and use Replanning Mode rather than widening either
  approval boundary.
- Keep pure domain value imports such as `isTySymbol` within the allowed
  application-to-domain direction; any parser, presentation, host, Node, or
  telemetry dependency remains a replanning trigger.

## Traceability

- `TRACEABILITY.md` required: yes
- Reason: the feature covers two durable use cases, multiple requirements, two
  implementation slices, JP1/AJS compatibility, and explicit validation
  evidence.

## Feature-Level Risks

- Current acceptance rules are inferred from code and characterization rather
  than an external JP1/AJS serialization specification.
- Type guard decomposition can silently change runtime acceptance even when
  TypeScript types still compile.
- Recursive tree validation and flattening can overflow or slow down on
  pathological depth; this feature preserves current behavior and must not
  claim a new unbounded-input guarantee.
- Complexity can be displaced into helper files; measurements must cover the
  whole extracted responsibility rather than only `unitListDocument.ts`, using
  the recorded Qlty commands and current pre-slice snapshots.
- The serialized conversion boundary intentionally differs from the complete
  viewer transport validator; preserve that distinction and do not reuse a
  stricter validator without characterization evidence.
- The branch inherits earlier refactoring work relative to `origin/main`;
  implementation and review must limit their diff to this feature's files.

## Use-Case Back-Propagation

- `uc-view-unit-list.md`: no update planned because stable identity, ordering,
  malformed-input handling, encoding, and desktop/web behavior are unchanged.
- `uc-export-unit-list-csv.md`: no update planned because row meaning, visible
  column input, escaping, and CSV payload behavior are unchanged.
- `docs/specs/roadmap.md`: no planning update; the selected roadmap item and
  ordering remain current until Feature Exit evaluates completion.
- `README.md` and `CHANGELOG.md`: no update planned for an internal refactor
  with no observable behavior change.

## Feature Exit

- Definition of Done status: Not evaluated
- Durable documentation updates: none expected unless implementation discovers
  reusable behavior or architecture knowledge that is not already owned.
- Open risks: preserve the feature-level risks above until validation or an
  approved follow-up resolves them.

## Validation

- [x] Slice 1 focused tests and characterization complete
- [x] Slice 1 desktop, web, build, architecture, Qlty, and metrics pass
- [x] Slice 2 focused tests and characterization complete
- [x] Slice 2 desktop, web, build, architecture, Qlty, and metrics pass
- [x] Exported DTO and consumer compatibility verified
- [x] Current pre-Slice-1 and pre-Slice-2 Qlty snapshots recorded
- [x] Identity rejection reaches the table-viewer empty safe state
- [x] README and user-documentation impact confirmed
- [x] CHANGELOG impact confirmed using repository criteria
- [x] Integrated final review completed before Feature Exit

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for slice planning, approval state, validation, risk, and
  Feature Exit readiness only.
