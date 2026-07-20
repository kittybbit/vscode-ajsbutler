# Feature Tasks: Complete Normalized Domain Model

<!-- markdownlint-disable MD013 -->

## Agent Brief

- Purpose: make normalized AJS concepts the only live domain model.
- Approved or active slice: Slices 1 and 2 are complete; Slice 3 is approved and next.
- Preserve identity, hierarchy, parameters, relations, state, warnings, and UI output.
- Do not recreate wrapper-only APIs without a production consumer or durable rule.
- Consumer DTO migration remains in the named downstream features.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and normalization rules.
- Validate each slice with focused tests, qlty, desktop tests, and web tests.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: implement only Slice 3 with `sdd-implement-task`.

## Plan Status

- Status: In Progress
- Planning scope: smallest necessary revision to account for two unallowlisted
  baseline `LegacyUnitSource` dependencies.
- Review status: Reviewed; revised plan passed with no blocking findings.
- Human approval: Approved on 2026-07-20 for the revised full plan and all three
  implementation slices.
- Active implementation slice: Slice 3 (approved; not started).

## Replanning Reason

- The initial six-slice plan overlapped structural and unit-state ownership.
- It proposed recreating wrapper-only relation and parameter APIs without live
  production consumers.
- It did not classify every owned legacy-wrapper allowance.
- Its final deletion slice conflicted with live table presentation imports of the
  legacy `Parameter` class while declaring consumer migration out of scope.
- The revised plan classifies the exact allowance population, preserves only
  consumer-backed semantics, and isolates the narrow presentation prerequisite.
- The latest review retained all three slices and requested only normative
  Requirement/Acceptance Criteria mappings plus clearer unreachable-styling wording.
- Slice 1 implementation investigation found two pre-existing
  `legacy-wrapper-dependency` violations absent from the 86-entry allowlist:
  `UnitEntity.ts` to `LegacyUnitSource` and `TyUtils.ts` to `LegacyUnitSource`.
- The true baseline is 88 exact dependencies. Slice 1 cannot complete architecture
  validation unless the two unexplained edges are registered exactly; Slice 3 must
  therefore remove 80 remaining allowances rather than 78.

## Human Approval

- Status: Approved
- Approved at: 2026-07-20
- Approved plan: the revised three-slice plan, dependency order, acceptance criteria,
  validation, production-readiness checks, and approval boundaries.
- Approved implementation scope: Slices 1, 2, and 3 within each recorded approval
  boundary. Resume Slice 1 only in the current implementation task.

## Allowance Disposition

The five disjoint source groups below cover every one of the 88
`legacy-wrapper-dependency` edges owned by this feature. The current allowlist
enumerates 86; Slice 1 must add the two exact missing `LegacyUnitSource` entries
before architecture validation can prove a fully explained baseline.

| Exact source group                                               |  Count | Classification             | Disposition                                                                                                                                                                    |
| ---------------------------------------------------------------- | -----: | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/infrastructure/parser/normalization/**`                     |      8 | Shared domain meaning      | Slice 1 moves/reclassifies group, root-jobnet, layout, schedule, wait, depth, and recovery/type decisions under normalized model ownership, then removes the exact allowances. |
| `src/domain/models/parameters/**`                                |     10 | Removable legacy structure | Slice 3 removes wrapper-only parameter classes/builders after Slice 2 removes the stale presentation fallback. Consumer-backed pure parameter rule helpers remain.             |
| `src/domain/models/units/**`, excluding `unitRelationHelpers.ts` |     39 | Removable legacy structure | Slice 3 removes the `UnitEntity` hierarchy, including its exact `LegacyUnitSource` import, capability classes, and wrapper-only priority/state edges.                          |
| `src/domain/models/units/unitRelationHelpers.ts`                 |      1 | Removable legacy structure | Slice 3 deletes unused previous/next wrapper traversal. Existing normalized relation arrays and consumer behavior remain; no replacement API is created.                       |
| `src/domain/utils/TyUtils.ts`                                    |     30 | Removable legacy structure | Slice 3 deletes the wrapper factory/traversal, including its exact `LegacyUnitSource` import, after all wrapper consumers are gone.                                            |
| **Total**                                                        | **88** | Complete classified set    | All 86 recorded allowances and two previously unexplained edges are classified; no owned dependency is deferred.                                                               |

Three `presentation-domain-dependency` allowances currently owned by
`migrate-unit-information-boundaries` are a prerequisite outside the 88 entries:

- `columnDefs/common.tsx` to `Parameter`
- `exportCsvView.ts` to `Parameter`
- `globalFilter.ts` to `Parameter`

Slice 2 removes only these obsolete compatibility branches and their exact
allowances. It does not change the `UnitListRowView` DTO, visible formatting,
search semantics, CSV content, or broader downstream feature ownership.

## Implementation Slices

### Slice 1: Put normalized structure and state under one domain owner

- Status: Complete
- Scope: make the existing `AjsDocument` / `AjsUnit` contract and focused normalized
  domain services own deterministic identity, parent/child hierarchy, parameters and
  source evidence, relations, warnings, group/root-jobnet classification, depth,
  recovery state, layout evidence, schedule presence, and waited-for state. Move or
  reclassify only the pure meanings currently reached through the eight normalizer
  allowances; do not introduce wrapper-shaped entities or speculative APIs.
- User / Domain Value: parser and import adapters produce one complete, host-neutral
  model that list, flow, diagnostics, definition, and diff use cases can consume
  consistently.
- Cohesive Change Group: `AjsDocument` normalized concepts and helpers;
  `normalize/unit.ts`, `unitBuilder.ts`, `unitTree.ts`, relation/warning mapping;
  group/jobnet/layout/schedule/wait/depth/type helper ownership; normalization and
  normalized lookup tests; the exact eight normalizer allowances; the two exact
  missing `LegacyUnitSource` allowance entries and architecture count assertion.
- Acceptance: normalized IDs remain absolute paths; order, parent/ancestor lookup,
  root/nested jobnet detection, state flags, layout evidence, raw parameter order and
  source positions, relation order/types, and warning behavior remain unchanged. The
  normalizer imports no transitional wrapper module after the slice. Architecture
  validation reports exactly 80 fully explained legacy-wrapper dependencies and no
  unexplained or stale entry.
- Validation: update `AjsDocument.test.ts`, `normalizeAjsDocument.test.ts`,
  `normalizeUnit.test.ts`, `normalizeUnitBuilder.test.ts`,
  `normalizeUnitTree.test.ts`, `normalizeRelations.test.ts`, and
  `normalizeWarnings.test.ts`; retain focused helper parity cases under normalized
  ownership; update `architectureDependencyRules.test.ts` to prove the two exact
  baseline entries are explained and that 80 dependencies remain; run
  `rtk pnpm run qlty`, inspect new smells only when they identify a concrete
  responsibility or compatibility risk, ignore metrics-only movement without such
  evidence, run focused desktop tests, `rtk pnpm test`, and `rtk pnpm run test:web`.
- Production Readiness:
  - Failure mode: malformed or missing type/relation/source evidence produces the
    current explicit warning or absent value, never a silently plausible result.
  - JP1/AJS compatibility: preserve repository-observed version 13 group, jobnet,
    recovery, layout, schedule, wait, relation, and source interpretation; add no rule.
  - Large or malformed input risk: avoid new repeated document scans and cover deep
    hierarchy, many relations, missing targets, duplicate parameters, and absent source
    positions with focused fixtures.
  - Desktop/web impact: all values and helpers remain plain, browser-safe domain code
    without VS Code, Node, parser-generated, network, filesystem, or UI dependencies.
  - README/docs impact: no user-doc change expected; update the normalization rule only
    if implementation proves its current durable contract inaccurate.
  - CHANGELOG impact: none under the SSOT because behavior is preserved.
- Approval Boundary: approve the normalized ownership and mapping needed to remove the
  exact eight normalizer allowances, plus exact registration of only
  `UnitEntity.ts` to `LegacyUnitSource` and `TyUtils.ts` to `LegacyUnitSource` under
  this feature for Slice 3 removal. Wildcards, other new allowances, identity changes,
  new warnings, new JP1/AJS meaning, consumer DTO changes, and performance redesign
  require replanning.
- Dependencies: completed parser-boundary feature; no feature-local dependency.
- Risks: moving helpers without changing behavior can expose hidden wrapper-oriented
  names or input shapes; keep public normalized names aligned with JP1/AJS concepts.
- Out of Scope: effective-value expansion, previous/next relation convenience APIs,
  consumer projections, presentation formatting, and application DTO migration.

### Slice 2: Remove obsolete table `Parameter` compatibility

- Status: Complete
- Scope: prove that table accessors receive primitive `UnitListRowView` values or arrays
  and remove the unused `Parameter` union, `instanceof Parameter`, rendering, search,
  and CSV stringification fallbacks from `columnDefs/common.tsx`, `globalFilter.ts`, and
  `exportCsvView.ts`. Remove their three exact presentation-domain allowances.
- User / Domain Value: the table, search, and CSV seams use the application row contract
  they already receive, so the legacy wrapper graph can be retired without changing
  visible behavior.
- Cohesive Change Group: the three table compatibility branches; `AccessorType` and
  primitive conversion helpers; table column, global-filter, CSV, and row-view tests;
  the three exact `Parameter` presentation allowances.
- Acceptance: rendered values, search text/ranking, CSV content/order/escaping, and
  desktop/web table behavior are unchanged; no presentation source imports legacy
  `Parameter`. The primitive `UnitListRowView` contract carries no default/inherited
  metadata, so no currently reachable default/inherited styling is removed.
- Validation: update `tableColumnDef.test.ts`, `ajsTableGlobalFilter.test.ts`,
  `exportCsvView.test.ts`, and `buildUnitListView.test.ts`; add an exact type/runtime
  assertion that supported accessors are primitive or primitive arrays; run
  `rtk pnpm run qlty`, assess new smells only as actionable responsibility evidence and
  disregard metrics-only changes, run focused desktop tests, `rtk pnpm test`, and
  `rtk pnpm run test:web`.
- Production Readiness:
  - Failure mode: an unsupported non-primitive accessor value fails a focused test or is
    rendered/exported by an explicit presentation rule; it is not silently dropped.
  - JP1/AJS compatibility: no definition interpretation changes; normalized raw and
    effective values reaching the row DTO remain unchanged.
  - Large or malformed input risk: conversion remains bounded per visible/exported
    cell; search and CSV regression fixtures preserve large-row behavior.
  - Desktop/web impact: the same React table code runs in both webviews; desktop/web
    tests verify identical primitive rendering, search, and export decisions.
  - README/docs impact: none; no visible workflow or public contract changes.
  - CHANGELOG impact: none under the SSOT because obsolete internal compatibility is
    removed without user-visible change.
- Approval Boundary: approve only removal of the three stale `Parameter` branches and
  exact allowances. Do not change `UnitListRowView`, columns, labels, styling, search
  matching, CSV output, or other presentation-domain dependencies.
- Dependencies: Slice 1 is ordered first for domain ownership clarity, but Slice 2 has
  no code dependency on it.
- Risks: a rarely used column might still return a wrapper-derived object despite the
  current DTO types; the accessor inventory and regression tests must disprove that
  before deletion.
- Out of Scope: list/CSV/definition DTO redesign, broader presentation-domain cleanup,
  i18n movement, new formatting, and navigation behavior.

### Slice 3: Retire the unreachable legacy wrapper graph

- Status: Approved
- Scope: after Slices 1 and 2 remove every live edge, delete the cohesive wrapper graph:
  `UnitEntity`, `LegacyUnitSource`, typed unit/capability classes, wrapper priority and
  relation traversal, `TyUtils`, `ParamFactory`, wrapper-only typed parameter classes
  and builders, exports, and tests. Preserve pure consumer-backed helpers such as
  normalized schedule, relation-edge, encoded-string, default, diagnostic, job-end,
  and transfer-operation rules. Remove the remaining 80 owned allowances.
- User / Domain Value: future application and adapter migrations have one unambiguous
  domain model and cannot accidentally reconstruct the legacy class hierarchy.
- Cohesive Change Group: the strongly connected wrapper/factory/parameter graph;
  wrapper-only tests and exports; retained pure domain-rule helpers; dependency
  allowlist and architecture count assertions; final normalized/application regression
  evidence.
- Acceptance: production and non-parser-boundary tests contain no legacy `Unit`,
  `UnitEntity`, typed unit wrapper, `ParamFactory`, `tyFactory`, or wrapper relation
  traversal dependency; approved parser-normalization tests may retain their raw input
  seam. All 88 owned dependencies are gone; no replacement is created for a wrapper-only
  API; consumer-backed rules and every observable workflow remain unchanged.
- Validation: use `rtk rg` to inventory all wrapper symbols before deletion and prove
  zero remaining imports after deletion; delete wrapper-only suites only after mapping
  any durable/use-case-backed assertion to an existing normalized or application test;
  extend a focused test only when that mapping exposes a real coverage gap; update
  `architectureDependencyRules.test.ts` to prove zero legacy-wrapper violations and no
  stale allowance; run `rtk pnpm run qlty`, review new smells as actionable only when
  tied to a concrete responsibility/risk and ignore metrics-only deltas, run
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- Production Readiness:
  - Failure mode: any remaining production/test import or lost consumer-backed rule
    blocks deletion; it must not be hidden by a new allowance or compatibility shim.
  - JP1/AJS compatibility: wrapper-only behavior with no durable rule or production
    consumer is not recreated; version 13 behavior promised by normalization, list,
    flow, definition, diagnostics, and diff tests remains required.
  - Large or malformed input risk: run representative normalization, list, flow,
    diagnostics, and diff malformed/large fixtures through the surviving model.
  - Desktop/web impact: full desktop/web suites and build verify no deleted import leaks
    into either bundle or extension entry point.
  - README/docs impact: no README change expected; final verified architecture wording
    remains owned by `remove-legacy-and-enforce-clean-architecture`.
  - CHANGELOG impact: none under the SSOT because this is behavior-preserving removal of
    unreachable internal structure.
- Approval Boundary: approve deletion of only the classified 80-entry wrapper graph,
  its obsolete tests/exports, and stale allowlist assertions after Slices 1-2 pass. A
  discovered production consumer, durable undocumented rule, or behavior difference
  requires replanning instead of migration by assumption.
- Dependencies: Slices 1 and 2 complete.
- Risks: wrapper-only tests may encode a durable rule that current use-case tests do not
  cover; classify the assertion, not merely the test file, before deletion.
- Out of Scope: recreating the typed wrapper matrix, later consumer DTO migrations,
  other presentation-domain allowances, telemetry, WebAPI, Node/browser allowances,
  and final zero-allowlist architecture enforcement.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: this non-trivial feature changes shared domain ownership and removes a large
  compatibility graph while preserving several user-visible workflows.
- Status: revised mappings and Slice 1-2 implementation evidence recorded; Slice 3
  evidence remains pending.

## Cross-Slice Dependencies

- Slice 1 removes the eight live normalizer-to-wrapper edges and establishes the final
  normalized domain owner.
- Slice 2 independently removes the three obsolete presentation imports that otherwise
  keep the legacy `Parameter` class reachable.
- Slice 3 requires Slices 1 and 2, then deletes the now-unreachable graph and remaining
  80 owned allowances as one strongly connected responsibility.

## Feature-Level Risks

- Wrapper-only tests are evidence to classify, not an automatic requirement to recreate
  their APIs or every implicit value.
- Normalized absolute-path IDs are the application compatibility contract; legacy UUIDs
  are neither serialized nor retained.
- Large definitions can amplify repeated traversal; no slice may worsen current
  complexity without concrete measurement and approval.
- `engines.vscode` remains `^1.75.0`; no slice may require a newer API.
- Shared domain and webview paths must stay browser-safe, host-neutral, and free of new
  telemetry or privacy impact.

## Out-of-Scope Changes

- New JP1/AJS parameter, relation, schedule, diagnostic, hover, or command semantics.
- Consumer DTO redesigns owned by later unit-information, flow/navigation,
  diagnostics/hover, WebAPI, semantic-diff/report, telemetry, and serialization
  features.
- UI redesign, visible formatting changes, generated parser edits, dependency updates,
  VS Code compatibility changes, and unrelated Qlty cleanup.

## Use-Case Back-Propagation

- No durable use-case update is planned because observable behavior is preserved.
- If a wrapper assertion maps to missing durable behavior, stop and replan before
  updating the smallest relevant rule/use case and before deleting that assertion.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: only if implementation disproves an existing
  normalization or parameter contract; final architecture wording remains downstream.
- Open risks: wrapper-test classification, malformed/large input parity, and final
  desktop/web regression evidence.
