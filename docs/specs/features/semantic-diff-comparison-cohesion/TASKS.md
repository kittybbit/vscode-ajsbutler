# Feature Tasks: Semantic Diff comparison cohesion

## Agent Brief

- Purpose: R1–R6 in [SPECS](SPECS.md#requirements-and-acceptance); Domain owns
  confirmed fingerprint rename/move classification; Application projects it.
- Active slice: S1, implementation and both independent reviews complete (Ready).
- Read: [selected contract](SPECS.md#value-and-boundaries), S1 below,
  [discovery](#discovery), validation and closure boundaries below.
- Next gate: Main completion commit, then Feature Exit.
- Prohibitions: no other responsibility split, schedule restoration, consumer
  migration, generated/configuration changes, stage or commit by planner.

## Current state and gates

- Lifecycle state: SLICE_APPROVED
- Mode: Planning, from INTAKE; selected by Main on 2026-10-15.
- Feature kind: transient branch, internal refactoring.
- Current branch: `codex/semantic-diff-comparison-cohesion`.
- Comparison/discovery base: `cbad1042ab9d5f44487ea6a2c6b9d272d16eb9b9`;
  supplied and verified HEAD, matching Main's verified `origin/main`.
- Plan review: Ready for approval; no remaining Findings.
  Reviewed plan identity:
  `e0aed7041c7b16d69bcd5270102993ddd343c04c0a6cc9b14d133a4086be8371`.
  Review record: `/private/tmp/semantic-diff-comparison-cohesion-plan-review-r1.json`.
- Planning commit: `c2839ed8f33d7240465302f68f27834cb14c3988` (Main).
  Staged scope and diff checks: Pass; record
  `/private/tmp/semantic-diff-comparison-cohesion-plan-commit/record.json`.
  No completion, closure or merge gate is claimed.
- Next operation: Main commits the approved S1 patch, then routes Feature Exit.

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Human Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-10-15.
- Approved scope: reviewed plan identity
  `e0aed7041c7b16d69bcd5270102993ddd343c04c0a6cc9b14d133a4086be8371`,
  planning commit and S1 Domain-owned fingerprint classification.
- Approved product paths:
  - `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  - `src/application/semantic-diff/compareSemanticDiff.ts`
- Approved validation-support paths:
  - `src/test/suite/semanticDiffStructuralRules.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
- Approved planning/evidence paths: this feature's `SPECS.md` and `TASKS.md`.
- Completion, closure, publication and merge approval: not granted by this gate.

Main recorded explicit Human Approval of the reviewed plan and S1 scope, and
renamed the branch to `codex/semantic-diff-comparison-cohesion`. Runtime/test
work starts only after the planning commit.

Apply [Human Approval](../../README.md#human-approval) and the
[approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Completion Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-10-15.
- Slice: S1; both independent implementation reviews Ready.
- Approved scope: reviewed patch identity below, plus Main's separately
  validated review/readiness metadata. Exact commit paths:
  - `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  - `src/application/semantic-diff/compareSemanticDiff.ts`
  - `src/test/suite/semanticDiffStructuralRules.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
  - `docs/specs/features/semantic-diff-comparison-cohesion/TASKS.md`
- Commit: pending; explicit approval authorizes the focused S1 commit.
  Closure, publication and merge approvals remain separate gates.
- Main metadata validation record:
  `/private/tmp/semantic-diff-comparison-cohesion-completion-commit/record.json`.

## Native Stack References

- Trunk: `main`; one implementation layer S1, no custom stack tooling,
  integration branch or integration-only PR.
- Layer branch: `codex/semantic-diff-comparison-cohesion`.
- Layer PR: not published; URL/number unavailable, never assumed created.
- Layer predecessor/base commit: `cbad1042ab9d5f44487ea6a2c6b9d272d16eb9b9`.
  There is no preceding slice. Planning package precedes S1 on this layer.
- Current head commit: `c2839ed8f33d7240465302f68f27834cb14c3988` (plan).
  S1 remains an uncommitted working-tree patch; reviewed identity is below.
  Completion and closure commit identities are pending their gates.
- Main records the actual planning commit, S1 reviewed base/head diff,
  completion commit, PR URL/order, final integration head and closure commit
  here as gates occur. One layer is intentionally the complete native stack.
- Publish and merge authority remains Main's separate decision. After closure,
  explicit Human Merge Approval must name final PR, main target, final head,
  order (S1 only), merge method, closure commit and current GitHub gates.
  Required CI/reviews/protection must pass at that actual head without bypass.
  Observed merge/result commit identities, not publication, establish CLOSED.

Apply [native stacks](../../README.md#github-standard-stacked-pull-requests).

## Implementation Slices

### S1 — Domain-owned fingerprint change classification

- Lifecycle state: SLICE_APPROVED
- Value: a confirmed correspondence has one semantic owner for rename/move;
  report projection no longer decides name/ancestry meaning. This is one
  independently valuable, reviewable and committable ownership correction.
  Separating Domain changes from Application migration would leave split or
  unused ownership; separate test-only/DTO-only slices earn no standalone value.
- Dependencies: approved, independently reviewed and committed plan; no other
  feature, package upgrade, service, new library or prerequisite runtime slice.
- Design: use the specialized fingerprint output contract in
  [SPECS](SPECS.md#value-and-boundaries), keeping generic matches untouched.
- Execution: characterize existing Application outputs first; run the nearest
  tests before relocating predicates, then introduce Domain output and consume
  it in the same slice. Add focused Domain contract assertions and update the
  one old fingerprint-output shape assertion. No intermediate broken commit.

Proposed exact runtime paths:

- `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
- `src/application/semantic-diff/compareSemanticDiff.ts`

Proposed exact validation-support paths:

- `src/test/suite/semanticDiffStructuralRules.test.ts`
- `src/test/suite/compareSemanticDiff.test.ts`

Planning, implementation evidence and gate annotations may update only this
feature's `SPECS.md` and `TASKS.md`. No fixture, snapshot, harness, config,
generated file, DTO, identity/evidence-rule module, architecture exception or
other test is an implicit support path. A newly required edit outside these
paths returns to Main before editing. All inherited features are excluded.

Acceptance for this slice:

1. R1/R2: Domain correspondence returns rename-only, move-only, combined and
   empty `changeKinds` for unique confirmed fingerprint pairs. Both predicates
   use current names and nearest ancestor Jobnet absolute paths with `""`
   fallback; classification order is rename then move.
2. R3: exact matches do not become fingerprint changes; ambiguous/duplicate and
   changed-fingerprint cases retain their existing conservative outcomes.
   Generic matches and all identity/evidence decisions retain shape and order.
3. R4: Application characterization proves unchanged change kinds, targets,
   confirmed level, IDs and identity references for all four combinations.
   Include no-ancestor and one-sided missing-ancestor cases, a Job Group path
   change with neither predicate true, and ancestor absolute-path differences
   (including ancestor rename) rather than relative-path reinterpretation.
   Reuse existing exact/candidate/fingerprint-change assertions without
   repeating the full matching matrix in new tests.
4. R3/R4: existing comparison/evidence/output/integration suites pass unchanged
   except approved internal result assertions. JSON schema v2, baseline bytes,
   sorting, relation remapping, constraints, unsupported items and confirmation
   requirements remain stable. No snapshot regeneration is planned.
5. R5/R6: validation below passes; manual Solution Shape review confirms the
   Application has no fingerprint name/path predicates and Domain has no DTO
   or host imports. Compatibility remains desktop/web and VS Code ^1.75.0.

### Solution Shape and impact

- Decision owner: Domain structural correspondence owns the new fingerprint
  classification contract and predicates, reusing its existing ancestry helper.
  Domain tests own that internal contract; Application tests own output facts.
- Translation owner: Application retains change DTO construction, identity
  index lookup, targets, element kinds, confirmed label, IDs, aggregation and
  sorting. Its existing comparison use-case boundary and caller remain intact.
- Material abstraction: only the specialized match result crosses the existing
  Domain→Application consumption boundary. It earns the contract by carrying
  correspondence meaning; it adds no wrapper, factory, facade, port, strategy
  registry or package. The general match type and evidence inputs stay stable.
- Dependencies: Application continues to import Domain; no dependency reversal,
  new framework or Node built-in. Existing pure functions/maps suffice; custom
  infrastructure or third-party capability has no role in these predicates.
- Direct impact: correspondence's fingerprint output, Application fingerprint
  change projection and the two approved test modules. One existing structural
  deep equality of fingerprint output requires the new field; its generic
  matches assertion must stay unchanged. All other Domain relation/evidence
  consumers use generic matches and require no constructor migration.
- Transitive impact: buildSemanticDiffReportData and bootstrap injection,
  source capture, Explorer/report/JSON/Markdown, Flow highlighting and commands
  read unchanged result contracts. They are validation consumers only.
- Added scenario coverage: predicate combinations and ancestry fallback above.
  Changed/removed observable behavior: none. Attribute/relation/evidence and
  all five other evaluated responsibilities retain their current boundaries.
- Risks: accidental enrichment of generic matches, application-only predicates
  left behind, relative instead of absolute ancestry, empty-kind matches
  discarded from correspondence, widened candidate confirmation, changed IDs
  or sorting. Contract and output tests plus semantic review address these.
  No measured performance improvement is claimed; two current ancestry lookups
  per fingerprint match move layers without changing traversal strategy.
- No parser, telemetry, bootstrap, host API, command, config, persistence or
  schedule behavior is edited. No new privacy/error/fallback mechanism arises;
  existing malformed-input and parser-error regression coverage is retained.
- Independent plan review precedes Human Approval. An independent implementation
  review is mandatory. Because the shared Domain/Application internal contract
  changes, use a second independent implementation review focused on unchanged
  match consumers, output identity and host neutrality, reusing the same evidence.
  Any changed ownership/shape/paths/check coverage returns to Main for Replanning.

## Validation plan

Planning documentation tier: lint both changed feature Markdown files, validate
local links/anchors, structure, selection/state/approval and exact scope; run
`rtk git diff --check`. Product tests/builds and qlty are Not Applicable during
planning because no product or execution inputs change.

S1 requires the shared-contract tier, after approved implementation:

- Characterization cycle: `rtk pnpm run test:compile`, then
  `rtk pnpm exec mocha --ui tdd out/test/suite/semanticDiffStructuralRules.test.js
out/test/suite/compareSemanticDiff.test.js` before and after relocation.
  These two pure suites do not need a VS Code host; retain the before result.
- Stable final patch: `rtk pnpm run test:full` prepares both targets, compiles
  tests, runs the full desktop suite and web smoke. Desktop suite includes the
  complete zero-exception `architectureDependencyRules.test.ts` catalog and
  `architectureSemanticDiffOwnership.test.ts`; record architecture separately
  from the manual Solution Shape judgment. It also runs all discovered
  Semantic Diff comparison, evidence/conditions, contracts, samples, JSON,
  Markdown, report-data, Explorer, source-capture and Flow regression suites.
- Compatibility minimum: `rtk pnpm run test:desktop:min` checks VS Code 1.75.0
  smoke using the existing web-safe bundle. No host harness edits are planned.
- Production bundles: `rtk pnpm run build` validates desktop and web production
  output; retain compile/build statuses and unchanged engine/config identities.
  Scan the two changed production files for Node built-ins/host imports and
  inspect changed exports/imports; architecture rules cannot prove semantics.
- qlty: follow [Quality Contract](../../validation.md#quality-contract) and
  [Execution Procedure](../../validation.md#execution-procedure), using version
  0.645.0 or later and identical full-repository selection/config/version in
  exact disposable baseline and final snapshots. Baseline is the committed plan
  before runtime/test changes; final includes the stable S1 patch. Record each
  repository content identity and dependency/config hashes, nonzero analyzed
  inventories/counts, logs/exits and complete official SARIF 2.1.0 for both
  `rtk pnpm exec qlty check --all --sarif --no-fix` and
  `rtk pnpm exec qlty smells --all --sarif --no-snippets` in both snapshots.
  Compare official findings without custom parsers; no new or reliably mapped
  adverse finding is allowed. Run `rtk pnpm run qlty` only in the disposable
  final snapshot. Any formatter writes must stay in approved paths; rebuild
  final observations after syncing authorized changes. Unapproved paths stop.
- Documentation annotations: lint exact changed feature Markdown paths, local
  links/anchors, scope and `rtk git diff --check`. Keep separately identified
  gate metadata separate from the substantive product snapshot.
- No parser grammar generation, dependency upgrade, fixture regeneration,
  WebAPI network testing or new JP1/AJS environment evidence is applicable:
  those semantics and inputs are untouched. Required GitHub checks and Qlty
  Cloud are additional exact-head gates; local success cannot replace them.

Implementation check status and raw evidence are recorded under S1 below and in
the external implementation evidence record. Missing or failed required
evidence blocks readiness; do not mark an unavailable host/download/qlty run
Not Applicable. Follow the existing Correction Loop inside approved paths,
retaining failure and baseline facts. Reuse matching results; refresh only
invalidated coverage and record unexpected reruns or review advisories.

## Requirement to validation mapping

No separate TRACEABILITY file is needed for this single outcome:

- R1/R2 → S1 Domain contract assertions, Application characterization,
  architecture catalog and manual Solution Shape review.
- R3 → S1 structural/comparison, evidence/conditions, contract/sample and
  relation/identity assertions in existing suites through test:full.
- R4 → S1 JSON immutable baselines/schema, Markdown, Explorer, source capture,
  report-data, Flow and command suites through test:full.
- R5 → S1 before/after characterization plus Domain output assertions; no
  ambiguous/changed-fingerprint confirmation expansion.
- R6 → S1 architecture, import inspection, full desktop/web, minimum host,
  production builds and unchanged engines; qlty protects quality throughout.

## S1 implementation evidence

- Implementation base: reviewed plan commit
  `c2839ed8f33d7240465302f68f27834cb14c3988`; its sole pre-existing working-tree
  change was Main's PLAN_COMMITTED gate metadata above, which is retained.
- Runtime changes: `semanticDiffStructuralRules.ts` now exposes a specialized
  fingerprint match with ordered `changeKinds`; Domain classifies current-name
  difference as `renamed` and nearest Jobnet absolute-path difference as
  `moved`, preserving empty arrays and generic `matches`. The Application now
  projects those kinds into its existing changes and no longer decides name or
  ancestry meaning. DTO construction, IDs, targets, identity references and
  ordering remain in Application.
- Validation-support changes: the Domain suite asserts rename-only, move-only,
  both, empty, and rename-before-move contract behavior. The Application suite
  characterizes unchanged outputs for those combinations, no-ancestor and
  one-sided missing-ancestor cases, and nearest absolute-path changes including
  ancestor rename. Existing `matches` expectations remain unchanged.
- Characterization before relocation: `test:compile` passed and the two
  approved boundary suites passed, 35 tests. After relocation and Domain
  contract assertions, `test:compile` passed and the same suites passed, 36
  tests. Logs and the alias-only temporary test-path mapping are recorded in
  `/private/tmp/semantic-diff-comparison-cohesion-implementation/`;
  the repository runner and assertions were not changed for alias resolution.
- Full desktop/web coverage: the first `test:full` invocation prepared all
  bundles and compiled successfully, then the VS Code UI launch ended with
  SIGABRT. The existing desktop and web recovery commands passed with host
  permission. After the in-scope complexity correction, `test:full` passed
  again: 1034 desktop tests plus WEB-7/8/12/14/15 smoke checks. The harness was
  unchanged; initial, recovery and final logs are in the implementation evidence
  directory.
- Minimum compatibility: `test:desktop:min` passed on VS Code 1.75.0 with
  WEB-7/8/12/14/15 smoke checks. Production `build` passed for desktop and web.
  Logs are `test-desktop-min.log` and `build.log` in the implementation
  evidence directory. `engines.vscode` remains `^1.75.0`.
- Qlty 0.645.0 baseline/final check SARIF contains 7/5 issues respectively;
  the five final issues map to existing baseline findings, while two TASKS
  formatting findings were cleared by Qlty's formatter. Baseline/final smells
  each report 151 warning records. A prior final warning for
  `buildSemanticDiffUnitCorrespondence` (complexity 8, threshold 5) disappeared
  after extracting the local classifier helper. The final aggregate passed and
  formatter output was confined to the approved TASKS, Domain source and Domain
  test paths; `diff -w` showed only wrapping/whitespace changes in those three
  files. The full-repository smell SARIF has unmatched record churn and changed
  similar-code metrics in unrelated paths despite equal counts, so this mapping
  remains an advisory for independent review, not a clean no-new-smell Pass.
  Qlty's smells logs report 382 files at both the structure and duplication
  stages. In the same exact snapshots, official `metrics --all --sort name`
  outputs report parsing and list 382 files per snapshot; these files provide
  the smells selection inventory (`baseline-metrics-all-inventory.log` and
  `final-metrics-all-inventory.log`). For `check`, a supplemental `--no-cache`
  refresh captured the official invocation inventory: each SARIF's 142 unique
  successful invocation IDs exactly match 142 preserved official
  `invoke-*.yaml` records, whose `targetPaths` yield 646 distinct repository-
  relative files per snapshot. The baseline and final inventories are equal.
  The refreshed SARIF is supplemental inventory evidence and does not replace
  the required baseline/final findings comparison. The 683-path Git manifests
  identify snapshot tree contents only, not Qlty's analyzed inputs. Complete
  logs, SARIF, invocation records, path inventories and snapshot identities are
  in
  `/private/tmp/semantic-diff-comparison-cohesion-implementation/record.json`.
- TRACEABILITY remains unnecessary: R1–R6 still map to S1 and its existing
  acceptance/tests; this implementation changed ownership within that mapping
  and did not change a result or requirement relationship.
- Durable Documentation Gate remains satisfied: the implementation adds no
  new reusable or user-visible contract beyond the selected feature record.
  No README, use-case, architecture, roadmap or changelog path changed.
- Independent implementation reviews: both Ready, no actionable Findings.
  First review: `/private/tmp/semantic-diff-comparison-cohesion-implementation-review-r2.json`.
  Second review: `/private/tmp/semantic-diff-comparison-cohesion-second-review.json`.
  Reviewed full patch SHA-256:
  `670c89d39442f508250706b14246c54299946ab05f47a3df1c20fa834d5f5895`.
  Reviewed substantive snapshot SHA-256:
  `2cf59a17051fe7aaf15e74f29044c43394e17e588a53306640a52bd04e634f87`.
  Both reviews accept the inventory supplement and retain unrelated smells
  mapping uncertainty as advisory. These gate annotations do not change the
  reviewed product, tests, acceptance, paths or validation requirements.

## Closure propagation and removal plan

After S1 completion review, Completion Approval and focused commit, Main checks
exit entry and delegates Feature Exit. The closer reuses valid slice evidence,
checks current-head GitHub gates/Qlty Cloud, resolves remaining risks and
prepares an external closure artifact binding acceptance, exact final snapshot,
gates and propagation/removal paths to the single existing layer PR.

Durable Documentation Gate evaluation: existing architecture and the two
Semantic Diff use cases already express these owners and behavior. No new
reusable contract or observable scenario requires duplication there. README,
CHANGELOG, roadmap, architecture and use-case edits are not planned; no durable
propagation paths are authorized. Other five responsibility splits are rejected
scope here, not unfinished deliverables. The inherited WebAPI beta work remains
with its existing owner.

Proposed selected-feature removal paths, only after Close, required closure
patch Ready, explicit Closure Approval and Main's commit gate:

- `docs/specs/features/semantic-diff-comparison-cohesion/SPECS.md`
- `docs/specs/features/semantic-diff-comparison-cohesion/TASKS.md`

Retain closure/gate proof in the PR or accessible external closure artifact;
do not retain removed feature files as history. The closer prepares/reviews the
projected deletion snapshot and document checks. Main applies approved removal
and records closure commit in that existing PR. Any newly needed durable path,
unresolved deliverable or approval change returns to Main before edits. Final
merge approval remains separate; partial or pending merge cannot be CLOSED.

## Discovery

- Producer: feature-author, 2026-10-15; record version 1. All source facts refer
  to the unchanged base above. Coverage: both proposed files, direct production
  callers, DTO, related Domain services, durable use cases and affected tests.
- Method: Serena initial instructions, symbol overviews and targeted symbol
  bodies; `rtk rg` references/imports/test names; targeted `rtk sed` and
  `rtk cat` source/policy reads. No product checks or code writes were needed.
- Core source: `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  and `src/application/semantic-diff/compareSemanticDiff.ts`; exact function
  references and boundary judgments are in SPECS.
- Related Domain services: `semanticDiffIdentity.ts` owns supported form-specific
  fingerprint strategy/default/fallback canonicalization; `semanticDiffEvidenceRules.ts`
  owns confirmation and unsupported decisions and reuses structural parameter
  and relation-pair rules. The proposed narrow change must preserve their
  `SemanticDiffUnitMatch` inputs.
- Caller: `src/application/semantic-diff/buildSemanticDiffReportData.ts:47`
  injects comparison, parses both sides and preserves parse failures. It is
  wired by `src/bootstrap/extension/semanticDiffWiring.ts`; command build uses
  the scoped source-capture parser in `semanticDiffCommandBuild.ts:121`.
- DTO: `src/application/semantic-diff/semanticDiffDto.ts:1` aliases Domain
  identity contracts; change DTOs retain Application kinds/targets/IDs.
  `createSemanticDiffResult` is also consumed by structured-contract tests.
- Transitive consumers: report projections in
  `src/presentation/semantic-diff/report`, Application
  `semanticDiffExplorerProjection.ts`, `buildSemanticDiffOutputContext.ts`,
  `semanticDiffSourceCapture.ts`, and
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` consume stable
  result/reference contracts. They should need no edits or new Domain imports.
- Existing correspondence tests: `semanticDiffStructuralRules.test.ts:80`
  covers canonical Job Group identity and duplicates; lines 301, 343, 439,
  504, 1077, 1127, 1478 cover exact identity, one-to-one/ambiguous matching,
  relation remapping, supported strategies, executable/argument identity,
  deterministic evidence and large ambiguous groups.
- Existing comparison tests: `compareSemanticDiff.test.ts:135`, 164, 203,
  243, 290, 328, 374, 416, 597 and 672 cover order-only changes, exact identity,
  attributes, rename/relation mapping, collisions, candidates, changed
  fingerprints, DTO ordering and reused-ID relation endpoints. The nearest
  Domain moved-Job-Group test (line 266) tests fingerprint correspondence,
  not the Application's move predicate. Explicit move-only, combined and
  neither predicate characterization is needed before ownership relocation.
- Evidence/output safety nets: `semanticDiffEvidenceRules.test.ts`,
  `semanticDiffConditions.test.ts`, `semanticDiffContracts.test.ts`,
  `semanticDiffJson.test.ts` (immutable baseline bytes/digests and insertion
  ordering), `renderSemanticDiffMarkdown.test.ts`,
  `semanticDiffExplorerProjection.test.ts`, `semanticDiffFlowHighlights.test.ts`,
  `semanticDiffSourceCapture.test.ts`, `buildSemanticDiffReportData.test.ts`,
  `semanticDiffSampleCoverage.test.ts` and architecture dependency tests.
- Overlap: the two durable Semantic Diff use cases already own observable
  semantics. `roadmap.md` and the inherited WebAPI feature have no overlapping
  delivery. No durable document was changed.

## Planning discovery and documentation evidence

- Intake discovery reused at unchanged source base: section above and
  SPECS responsibility evaluation. Intake validation record:
  `/private/tmp/semantic-diff-comparison-cohesion-intake-validation/record.json`,
  manifest `20b66a84c7de2f9ecafa140a58be63974247bbcba3716d197c2613d952df3242`.
  Its document pass covers intake only; source discovery remains reusable.
- Planner additions: targeted correspondence return/type and Application
  projection reads; ancestry fallback and moved-Job-Group test inspection;
  exact test inventory, test runners, scripts and policy. No source change
  since base; no need to recollect the other five responsibility findings.
- Planning document record and reproducible content identity:
  `/private/tmp/semantic-diff-comparison-cohesion-plan-validation/record.json`.
  It covers this feature's SPECS/TASKS, Markdown lint, local links/anchors,
  structure, scope/state/approval and diff checks. No runtime edits, stage,
  commit, implementation evidence or human approval is asserted.

Apply the [Evidence Contract](../../evidence.md#evidence-contract).
