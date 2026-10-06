# Feature Tasks: domain-model-readonly

## Agent Brief

- Purpose: publish readonly normalized AJS contracts without behavior changes.
- Active or approved slice: S1 Completion Approved; focused commit pending.
  S2 follows that commit. Reviewed S1–S3 scope is Human Approved.
- Read first: [SPECS](./SPECS.md), [traceability](./TRACEABILITY.md), Solution
  Shape and boundaries below, and the [SDD policy](../../README.md).
- Validate: S1 acceptance and full validation evidence are recorded below and
  in the linked evidence artifact; later slices use the required gates below.
- Prohibitions: no runtime freezing, mutation bypass, DTO/result-wide migration,
  raw/generated parser rewrite, architecture exceptions, or unrelated repairs.

## Current state

- Lifecycle state: SLICE_APPROVED
- Next decision / blocker: focused S1 completion commit, then S2.
- Selected feature: `docs/specs/features/domain-model-readonly`.
- Branch: `codex/domain-model-readonly`.
- Comparison base: `121583496bbf8653a0950ecf16b929aecfadb380` (fixed).
- Gate evidence: independent plan review Ready, no Findings; Human Approval
  received in the current conversation on 2026-10-07. Planning commit
  `2817260eb3338e82185cf1ec9253fa4f1da91553` succeeded.
- Preserved slices: none completed; no inherited approval changed.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-10-07
- Approved scope: exact reviewed S1, S2 and S3 boundaries in this plan, substantive
  identity `54ce103a0f293709125f3c268c10f90d55bac3c0dc99479177d67e15e338a011`.
  This authorizes the focused planning commit and dependent implementation
  sequence; Completion and Closure Approvals remain separate.
- Approved planning paths:
  - `docs/specs/features/domain-model-readonly/SPECS.md`
  - `docs/specs/features/domain-model-readonly/TASKS.md`
  - `docs/specs/features/domain-model-readonly/TRACEABILITY.md`
- Approved implementation paths: exact per-slice runtime/test paths below,
  plus the three selected feature documents for evidence/gate annotations only.
  Exclusions and dependency gates remain in force.
- Approval metadata evidence:
  `/private/tmp/domain-model-readonly-approval-12158349/evidence.json`.

## Discovery and impact

- Intake evidence remains at
  `/private/tmp/domain-model-readonly-intake-12158349/evidence.json`.
  Its immutable intake document identity is
  `e57e9d47887d606a1602ce1ebe5a0a57f0ec45ab49544e85ed3ad8e0f6bbf176`.
- Planning discovery and reference hashes are retained in
  `/private/tmp/domain-model-readonly-plan-12158349/evidence.json`.
  Inspection covers normalized exports, direct typed references and collection
  signatures, mutations, parser construction, schedule/calendar aliases,
  Semantic Diff correspondence/projection, DTO copying, relevant test fixtures,
  use cases, architecture, roadmap, package scripts, and check configuration.
- `AjsDocument.ts` owns all normalized leaf and recursive types. Its helpers
  allocate new traversal/filter/value/ancestor arrays; no returned helper array
  is the document's root/child/parameter array. Keep those fresh result arrays
  mutable and their elements readonly; change collection inputs to readonly.
- `normalizeAjsDocument`, `normalizeUnitTree`, `buildNormalizedUnit`, and relation
  normalization build objects and arrays before publication. Warning arrays
  append immutable warning values; generated/raw parser values are separate.
  No producer redesign or deep mutable production model is needed.
- `AjsDocumentIndex.ts` has owned pending/visited/output buffers and mutable
  Map/bucket construction. Its published `byId`, `byPath`, and `indexAjsUnits`
  results expose those buckets; S3 changes only their TypeScript view.
- Schedule interpretation retains the unit and parameter elements; calendar
  selection/evidence uses fresh filtered arrays, substitution copies evidence,
  and ancestor traversal builds its own array. These containers need no blanket
  conversion: model elements become readonly through their existing types.
  `ScheduleCalendarContextIndex` inherits `AjsDocumentIndex`; its unique-group
  predicate currently requires a mutable bucket and must accept readonly.
- Semantic Diff retains normalized references in correspondence/evaluation.
  Its grouping and sorting operate on owned arrays. Schedule projection's
  `lastUnitByKey` already accepts `ReadonlyMap<string, readonly AjsUnit[]>`;
  no new projection adapter or result-contract conversion is needed.
- Flow projection copies leaf values, layout and children into DTOs; Flow
  validation appends DTO relations. Flow parameter/relation types alias the
  normalized leaf types and inherit their readonly fields in S1; DTO arrays,
  hierarchy, layout and UI state retain current mutability. List warnings copy
  normalized warnings. Preserve JSON fields/ordering and current copy behavior.
- Production mutation inspection found owned normalizer warning buffers and
  copied DTO mutation, with no normalized consumer write requiring redesign.
  Fixture writes in S2 are normalized AJS values, chiefly Semantic Diff and
  cyclic/deep index/calendar construction. Flow/List, Explorer transport, and
  webview fixture mutations are separate DTO scenarios and stay unchanged.
- Transitive behavior coverage includes list/CSV/definition, flow/expansion,
  diagnostics/hover/navigation, schedule/semantic comparison/report, WebAPI
  import and telemetry. Ports/host wiring keep their names and shapes; readonly
  domain types propagate through parser-port results without adapter changes.
- `engines.vscode` remains `^1.75.0`. JP1/AJS3 v13 semantics, error/fallback
  handling, source positions, input encodings, ordering and privacy stay fixed.
- README, README.en, CONTRIBUTING, CHANGELOG, use cases and domain rules need
  no planned edit: this internal type contract changes no user workflow or
  observable compatibility. Feature Exit may propagate verified reusable
  readonly ownership to architecture and remove the roadmap item through its
  separate closure gate; this plan authorizes no durable edit.

## Solution Shape

<!-- markdownlint-disable MD013 MD060 -->

| Owner / package / layer                                                    | Public contract and responsibility                                                                                                                                                                                                          | Boundary value and dependency direction                                                                                                                    | Applicable validation                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Normalized AJS model / `src/domain/models/ajs` / domain                    | Existing `AjsDocument`, `AjsUnit`, `AjsParameter`, `AjsRelation`, `AjsNormalizationWarning`, `AjsUnitLayout` and navigation helpers; readonly published values, accepting readonly collections; fresh helper result arrays retain ownership | Stable JP1 identity, structure and raw evidence; no host/parser mechanics. Domain remains independent; parser infrastructure and application depend inward | Compile-only contract examples, normalizer/parser and behavior boundary suites           |
| Normalized lookup / same domain package                                    | Existing `AjsDocumentIndex`, `createAjsDocumentIndex`, `indexAjsUnits`; readonly Map properties, Maps and buckets; local mutable construction                                                                                               | Duplicate-preserving shared lookup, reference/order preservation; no new wrapper/service or changed traversal algorithm                                    | Contract checks; index deep/wide/duplicate/shared/cycle cases; schedule/projection tests |
| Normalization / `src/infrastructure/parser/normalization` / infrastructure | Existing builders return domain types; retain owned warning/children/relation construction buffers                                                                                                                                          | Translation from parser-only `AjsRawUnit` to normalized domain values; imports point inward                                                                | Existing normalized tree/relation/warning/source evidence and parser tests               |
| Parser ports / `src/application/parsing` / application                     | Existing `AjsParserPort`, `AjsParserWithSourceIndexPort` publish the same result containing readonly domain values                                                                                                                          | Existing host-neutral parser contract earns inversion boundary; no port added or signature shape/failure changed                                           | Parser boundary, list/flow/editor/WebAPI use-case tests and type checks                  |
| Consumer projections / application and domain owners                       | Schedule and Semantic Diff keep existing derived-output ownership; Flow/List copy normalized values into their existing DTOs                                                                                                                | Model reference types propagate readonly; no DTO migration, new capability, or layer crossing                                                              | Schedule/semantic suites, DTO serialization and list/flow/CSV/definition boundary tests  |

<!-- markdownlint-enable MD013 MD060 -->

Use TypeScript readonly properties, readonly arrays and `ReadonlyMap`; existing
TypeScript 5.9 and collection capabilities cover the outcome. No custom deep
readonly framework, immutable library, runtime freezer, port, or adapter is
proposed. Existing parser/WebAPI/telemetry adapters keep translation, errors,
compatibility and lifecycle responsibilities; no adapter is added or removed.
Retained application factories keep their existing use-case/composition
responsibilities and invocation sites; no factory is introduced or relocated.
The architecture dependency test checks its import/construction/parser/
telemetry/layer catalog only. Ownership and boundary value above remain
independent reviewer judgments, not claims established by that test.

## Slice order and gates

S1 -> S2 -> S3. Each slice provides a complete compilable contract improvement.
Its dependent slice starts only after independent implementation review,
explicit Completion Approval, and the preceding focused completion commit.
Human Approval covers each exact path/symbol boundary below; it authorizes no
implementation until the reviewed plan is committed. Each shared-contract
slice requires two independent implementation reviews using the same evidence.
Every slice may update these three selected feature documents only for its
acceptance, validation and gate index. New scope, dependency, design, affected
paths or failed-check disposition returns through Main for Replanning.

### S1: Readonly normalized leaf values

- Lifecycle state: SLICE_APPROVED
- Value: prevent edits to parameter evidence, relations, warnings and layout
  through normalized values and existing aliases, independently of hierarchy.
- Dependency: focused approved planning commit.
- Exact runtime path: `src/domain/models/ajs/AjsDocument.ts`, only properties
  of `AjsParameter`, `AjsRelation`, `AjsNormalizationWarning`, `AjsUnitLayout`.
- Exact test path: new `src/test/suite/AjsReadonlyContracts.test.ts`; compile-only
  negative examples in uncalled functions and positive producer assignments.
- Exclusions: document/unit readonly fields/arrays, helper signatures, index,
  parser builders, consumer/DTO fields, fixtures and any configuration.
- Acceptance: every required and optional leaf property rejects assignment;
  nested unit leaf writes and Flow parameter/relation alias field writes reject;
  literal construction, mapping/copies, warning buffer appends and reads compile.
  All 14 properties in the four approved leaf types are covered. Parser/
  normalization, DTO serialization and behavior remain identical. PASS.
- Solution Shape result: existing normalized leaf contracts remain owned by
  the domain model; only TypeScript property modifiers changed. Producers keep
  local mutable construction and Flow aliases inherit the published readonly
  fields. No port, adapter, wrapper, new capability or dependency direction
  changed. The compile-only test checks consumer assignments and producer use.
- Validation: all required commands below PASS in the exact disposable S1
  snapshot. Production and test TypeScript checks include all negative and
  positive contracts. Desktop run includes parser/normalization,
  `flowGraphDocument`, `buildUnitList`, `AjsDocument` and `unitEdgeHelpers`; the
  architecture dependency catalog passes. Web preparation and Chromium smoke
  pass, as do production desktop/web builds. Final qlty aggregate PASS; full
  qlty findings map only to unchanged baseline issues after the selected task
  document was formatted. Detailed outputs, host retry and input identities:
  `/private/tmp/domain-model-readonly-s1-evidence/evidence.json`.
- Traceability: existing S1 mapping already names the compile-only contract
  test and required checks; no mapping or result row changed.
- Risks/readiness: TypeScript permits some structural assignment aliases;
  readonly is a published consumer view, never a runtime guarantee. Existing
  Flow leaf aliases intentionally inherit readonly properties; their copied
  containers remain mutable. `engines.vscode` remains `^1.75.0`; no shared host,
  parser, generated code, user documentation or changelog changed. Two
  independent reviews are Ready; Completion Approval received, commit pending.
- Review/Completion Approval/commit: two independent Ready verdicts / Approved /
  pending.

### S2: Readonly normalized document and unit graph

- Lifecycle state: PLAN_APPROVED
- Value: prevent hierarchy, identity, flags and nested collection mutation;
  permit readonly consumer inputs while preserving every existing read operation.
- Dependency: S1 committed.
- Exact runtime path: `src/domain/models/ajs/AjsDocument.ts`; all `AjsDocument`
  and `AjsUnit` properties readonly, nested collections readonly, and helper
  collection inputs readonly. Fresh helper output collections remain mutable.
- Exact test paths under `src/test/suite/`:
  `AjsReadonlyContracts.test.ts`, new `AjsDocumentModel.test.ts`,
  `AjsDocumentIndex.test.ts`,
  `semanticDiffScheduleCalendar.test.ts`, `semanticDiffScheduleImpact.test.ts`,
  `semanticDiffEvidenceRules.test.ts`, `semanticDiffStructuralRules.test.ts`,
  `semanticDiffContracts.test.ts`, `semanticDiffConditions.test.ts`,
  `compareSemanticDiff.test.ts`, `semanticDiffFlowHighlights.test.ts`.
  Only normalized fixture construction and contract/regression assertions change.
- Fixture approach: constructor overrides for changed fields/relations;
  explicit owned mutable child arrays for shared/cyclic/deep graph preparation.
  Retain original input identities, malformed/duplicate scenarios and assertions,
  including deliberate retained-producer alias scenarios. No consumer mutation
  casts, broad recursive mutable types, shared builder framework, or assertion
  deletion. DTO fixture mutation needs no adaptation.
- Exclusions: index publication (S3), helper result ownership, runtime algorithms,
  parser raw/generated code, all other production paths, DTO/SemanticDiff/
  schedule output-wide readonly changes, host/configuration and fixture files.
- Acceptance: property reassignment, nested parameter/relation/warning writes,
  children/root/warning/parameter/relation array writes and mutators reject;
  optional identity/context fields reject writes. Parser-result, helper-result,
  schedule interpretation/calendar aliases expose readonly model elements.
  Readonly collection inputs compile; legitimate owned result-array mutation
  remains valid. Identity, hierarchy, repeated values, raw/source evidence,
  normalization warnings, parent/ancestor/root lookup and all consumer results
  retain their existing meaning/order. Unique traversal remains cycle-aware;
  occurrence traversal retains occurrences and its existing cycle failure.
- Validation: common commands; complete desktop suite covers changed fixture
  suites, 20,000-level unique traversal, 4,096-child ordering/duplicate buckets,
  bounded recursive occurrence cases and existing parser/normalizer/list/flow/
  CSV/definition/diagnostic/hover/navigation/semantic/schedule/WebAPI/telemetry
  boundaries. `AjsDocumentModel` adds focused parent/ancestor/root-jobnet,
  first-hit/repeated-parameter, traversal reference/order and fresh-result-array
  ownership assertions absent from the current helper-specific coverage.
  Web smoke exercises common host behavior. Existing assertions are
  preserved; add only missing contract/identity characterization needed here.
- Risks/readiness: losing fixture identity or changing occurrence/unique traversal
  would alter schedule impact. Do not fix cycles, recursion or inherited golden
  failures in this migration. A newly discovered consumer requiring another
  production path is a scope Finding requiring Replanning, not permission to
  expand this list. No user documentation or changelog change.
- Review/Completion Approval/commit: pending / none / none.

### S3: Readonly published normalized indexes

- Lifecycle state: PLAN_APPROVED
- Value: close Map/bucket mutation through normalized lookup exposure while
  retaining duplicate matches and efficient local construction.
- Dependency: S2 committed.
- Exact runtime paths: `src/domain/models/ajs/AjsDocumentIndex.ts` and
  `src/domain/schedule/ScheduleCalendarIndex.ts`.
- Exact runtime symbols: `AjsDocumentIndex.byId/byPath` readonly properties
  with `ReadonlyMap<string, readonly AjsUnit[]>`; `indexAjsUnits` publishes that
  Map view; `isUniqueCalendarGroup` accepts readonly arrays and narrows to a
  readonly singleton tuple. Local Map/bucket appends and pending/visited/output
  arrays remain mutable. No traversal implementation change.
- Exact test paths: `src/test/suite/AjsReadonlyContracts.test.ts`,
  `src/test/suite/AjsDocumentIndex.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`.
- Exclusions: `ScheduleCalendarContextIndex.duplicatePath` and schedule outputs,
  semantic projection implementation (its lookup input is already readonly),
  all other paths, runtime freezing/copying and new index abstraction.
- Acceptance: index-property replacement, Map set/delete/clear, bucket index
  assignment/mutators and nested unit writes reject through both model and
  schedule indexes and the `indexUnits` re-export. Mutable builder Maps still
  compile; encounter/key order, duplicate bucket contents and reference identity
  match existing tests. Calendar conflict/cycle/missing-parent resolution and
  semantic schedule occurrence/last-key projection behavior remain unchanged.
- Validation: common commands; desktop run must include index, calendar,
  schedule-impact and presentation-artifact suites with duplicate/ambiguous,
  shared-reference, deep/wide and source-occurrence coverage; web smoke/build
  compatibility. Record complete feature acceptance against S1/S2/S3 evidence.
- Risks/readiness: mutable Map values under `ReadonlyMap` alone would leave a
  hole, so buckets must be readonly too. A readonly Map is the existing Map
  object and retains identity/cost. No user documentation or changelog change.
- Review/Completion Approval/commit: pending / none / none.

## Required implementation validation and evidence

The implementer owns one exact disposable baseline/final evidence set per slice.
Planning performs no product baseline. Baseline uses the committed predecessor
(planning commit for S1, previous slice commit for S2/S3); final includes only
that slice's changes and explicitly identified metadata. Record inspected
tracked/untracked/deleted/renamed and relevant ignored generated inputs,
configuration/dependency/tool hashes, approved/actual paths, commands, exits,
raw outputs and exact content identities outside inspected inputs. Reuse matching
results; a failure or missing result cannot establish readiness.

Required commands for each slice, in the applicable exact snapshot:

```sh
rtk pnpm exec tsc -p tsconfig.json --noEmit
rtk pnpm exec tsc -p tsconfig.test.json --noEmit
rtk pnpm run test:prepare:desktop
rtk pnpm run test:desktop:run
rtk pnpm run test:prepare:web
rtk pnpm run test:web:run
rtk pnpm run build
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
rtk pnpm run qlty
rtk pnpm exec markdownlint-cli2 \
  docs/specs/features/domain-model-readonly/SPECS.md \
  docs/specs/features/domain-model-readonly/TASKS.md \
  docs/specs/features/domain-model-readonly/TRACEABILITY.md
rtk git diff --check
```

- TypeScript checks include the compile-only rejected writes, positive producer
  inputs and all transitive consumers. Use `@ts-expect-error` per meaningful
  invalid operation, never `@ts-ignore` or casts erasing the type under test.
- Desktop suite is the existing full Mocha selection and includes
  `architectureDependencyRules.test.ts`. Record its catalog result separately
  from semantic Solution Shape judgments. Web command runs existing Chromium
  extension-host smoke; preparation and production build cover both targets.
- qlty observations run in both exact disposable baseline and final snapshots
  with >=0.645.0, same configuration and full repository selection, all four
  official SARIF 2.1.0 files and nonzero analyzed-path inventories/counts. Run
  the formatting aggregate only in final; it must pass. Apply policy identity,
  severity and metric-direction comparison: new or mapped adverse findings
  are NG; unmatchable signals advisory; unchanged unrelated findings out of
  scope. Do not build a custom parser/comparator. If formatting changes approved
  paths, stabilize/sync and repeat affected observations as policy requires.
- Record `engines.vscode` before/after, touched shared/parser/host surfaces,
  imports/exports/layers, Node-import scan and unresolved cases. Run the scan
  below and classify matches (a no-match search exit is expected). The architecture
  suite retains its full zero-exception catalog.

```sh
rtk rg -n 'node:|from ["\x27](fs|path|os|crypto|buffer|stream|util)["\x27]' \
  src/domain src/application src/infrastructure src/bootstrap src/presentation
```

- Documentation link/structure/scope/traceability and approval-provenance checks
  accompany changed feature docs. Retain evidence through all subsequent gates.
- Inherited roadmap failures are verification risks, not waivers: desktop host
  bootstrap, Table shell, expanded-flow golden, WebAPI fixture reproducibility.
  Before editing each slice, its implementer establishes the relevant current
  baseline and reports any required-check execution failure to Main. Do not use
  a temporary host wrapper as the supported-command PASS or repair harness,
  golden or generated fixtures here. If required commands fail or cannot launch,
  readiness is blocked until Main resolves a separately reviewed prerequisite
  or routes a replan with explicit disposition. No failure is pre-approved.
  `openapi:check` is not required here because no WebAPI generated input changes.
- Current-head Qlty Cloud PASS is required before Feature Exit; earlier commit
  CI cannot stand in for that gate. Exit consumes committed slice evidence and
  refreshes only specifically missing/stale integration coverage.

## Validation index

- Intake: `domain-model-readonly-intake-v1`, documentation PASS; artifact above
  retains its inspected identity and corrected search-command exception.
- Plan: `domain-model-readonly-plan-v1`, selected documentation PASS; coverage is
  all three selected feature files, local links/structure, scope, lifecycle,
  traceability and pending approval provenance. Artifact:
  `/private/tmp/domain-model-readonly-plan-12158349/evidence.json`.
- Review: `plan-reviewer` returned Ready for approval with no Findings, reviewing
  substantive document identity
  `54ce103a0f293709125f3c268c10f90d55bac3c0dc99479177d67e15e338a011`.
  Review and separately validated Main gate metadata are retained in
  `/private/tmp/domain-model-readonly-plan-gate-12158349/review.md` and
  `/private/tmp/domain-model-readonly-plan-gate-12158349/evidence.json`.
  Planning validation remains bound to its original substantive identity;
  gate metadata grants no approval and changes no scope or validation command.
- Planning commit: `2817260eb3338e82185cf1ec9253fa4f1da91553`; only the three
  approved planning paths committed; staged checks PASS, worktree clean at
  commit. Main commit-state metadata validation:
  `/private/tmp/domain-model-readonly-plan-committed/evidence.json`.
- Implementation: S1 SLICE_READY; exact S1 paths, acceptance, compatibility,
  Solution Shape result, traceability disposition and review gate are recorded
  above. Reusable validation artifact:
  `/private/tmp/domain-model-readonly-s1-evidence/evidence.json`.
- Product/architecture/qlty checks: required S1 commands PASS; architecture
  dependency test passes its catalog. qlty check has only unchanged baseline
  findings, and the required final aggregate passes. The evidence artifact
  records full-snapshot SARIF, analyzed inputs, output references and the host
  permission retry.
- Blocking decisions: focused S1 completion commit pending.
  Both required independent implementation reviews returned Ready with no
  actionable Findings; S2 remains gated.

## S1 review and Completion Approval

- Review: two independent `implementation-reviewer` Ready verdicts, no
  actionable Findings; exact substantive patch and validation identities are
  retained in `/private/tmp/domain-model-readonly-s1-review-gate/reviews.json`.
- Status: Approved
- Approved at: approved in current conversation on 2026-10-07
- Approved scope: exact reviewed S1 completion and evidence; substantive tracked
  patch `adabea52232bfa6e4c3f4eca529fd41b0e4f3552e8bffb741c81a52959a95029`
  plus separately validated review and approval gate metadata.
- Approved completion paths: `src/domain/models/ajs/AjsDocument.ts`,
  `src/test/suite/AjsReadonlyContracts.test.ts`, and
  `docs/specs/features/domain-model-readonly/TASKS.md` (S1 evidence and gates).
- Gate metadata validation:
  `/private/tmp/domain-model-readonly-s1-review-gate/evidence.json`.
- This state/review/approval metadata is separate from the immutable substantive
  snapshot reviewed and validated by the implementation roles. It changes no
  scope, specification, acceptance, risk, command or product input.
- Completion Approval metadata evidence:
  `/private/tmp/domain-model-readonly-s1-completion-approval/evidence.json`.
