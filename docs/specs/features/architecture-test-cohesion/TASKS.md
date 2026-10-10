# Feature Tasks: Architecture Test Cohesion

## Agent Brief

- Purpose: reduce concentration of existing architecture-test responsibilities
  while preserving the complete zero-exception gate.
- Active or approved slice: S1 approved; S2 approved and dependent on S1.
- Read first: [SPECS.md](SPECS.md), this file, and
  [architecture](../../architecture.md#solution-shape).
- Validate: coordination-document checks below; no code baseline required
  for intake.
- Constraints / next decision: focused S1 completion commit, then S2.
  Solution Shape, coverage, and approval boundaries are recorded below. No runtime,
  test, generated, or configuration edits before the implementation gate.

## Current state

- Lifecycle state: SLICE_APPROVED
- Next decision / blocker: focused S1 completion commit;
  S2 remains unstarted until the commit succeeds.
- Gate evidence: renewed plan review Ready, Human Approval, and focused plan commit.
- Selection/base: user-selected `architecture-test-cohesion`, branch
  `codex/architecture-test-cohesion`, base
  `cafc9c219dacdc3924c2ca992dedb9038911448d`.

## Independent plan review

- Verdict: Ready for approval; no Findings.
- Reviewer: independent `plan-reviewer`, current conversation.
- Reviewed substantive identity:
  `009d21ff6637a8aca190d6b73d784de2d21d83861d1675084be233d514e15703`.
- Review evidence: [Main gate record](/private/tmp/architecture-test-cohesion-main/plan-review.md).
- Review covers both slices, exact paths, Solution Shape, retained coverage,
  traceability, and required validation. Ready does not grant Human Approval.
- This gate annotation is a separate metadata patch; substantive planning
  validation remains bound to its original inspected identity.

## Replanning: include existing agent configuration edits

- Trigger: Main relayed the user's explicit approval of the original plan and
  instruction to manage the two existing agent-file changes with this feature.
  Main owns approval provenance and renewed gate annotation after review;
  this replan neither grants approval nor replaces the Human Approval fields.
- Affected scope: S1 only, adding the exact user-authored setting edits below.
  S2 design, paths, coverage, validation, and dependency on committed S1 remain
  unchanged. No completed slices or commits exist.
- Original independent review and planning identity remain preserved above.
  That review supports the unchanged test design; it does not cover the added
  agent scope. Renew independent review before the renewed approval gate.
- Plan commit boundary: only the three selected-feature Markdown files and
  Main's approval/gate annotations. The two agent TOML files remain unstaged
  as explicitly related S1 changes until its Completion Approval and commit.
  Include them in scope manifests; do not hide them as unrelated dirty files
  or accidentally stage them into the plan commit.
- Validation identity: the original planning artifact remains historical;
  [replanning record](/private/tmp/architecture-test-cohesion-replan/evidence.json)
  identifies revised documentation and the two read-only inspected configs.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation, 2026-10-10 (Asia/Tokyo).
- Approved scope: reviewed S1 and S2, including the exact pre-existing two-file
  agent model/effort patch expressly added by the user in the same approval.
- Approved paths: exact S1 and S2 implementation/feature-record paths below.
  Planning commit: selected-feature `SPECS.md`, `TASKS.md`, `TRACEABILITY.md`
  only; agent TOML edits remain related S1 work until its completion gate.
- Reviewed identity: `74ee4b837e0e764b75c4a379fbec1157d8109fd8701f198ba967d5892c5019c0`.
- Renewed review: Ready, no Findings; independent `plan-reviewer`.
- Review/approval evidence:
  [renewed Main gate record](/private/tmp/architecture-test-cohesion-main/renewed-plan-gate.json).
- Approval authorizes implementation scope and plan commit, not future
  Completion Approval or Closure Approval.

## Plan commit

- Commit: `afec6acac051cff8c10e1d9e5cb69e0a9731782f`.
- Message: `docs(sdd): approve architecture test cohesion plan`.
- Gate: approval-committer confirmed exact three feature Markdown paths and
  staged diff check passed. Related two-file S1 agent patch remains unstaged.
- Evidence: [Main commit record](/private/tmp/architecture-test-cohesion-main/plan-commit.json).
- Post-commit state annotations are separate metadata, not a new substantive
  planning or product-validation identity.

## Discovery and impact

- Roadmap kind; source is Internal Architecture Refactoring Sequence item 1.
- Existing support combines filesystem discovery, AST syntax collection,
  import/re-export resolution, construction analysis, catalog evaluation,
  special parser/telemetry/composition gates, and formatting.
- Existing suite combines extractor fixtures with repository-wide gates and
  feature-specific ownership assertions. Calendar/Explorer additions changed
  the same suite, supporting the roadmap entry condition.
- No overlap in outcome with inherited `import-definition-via-webapi`; its
  beta exit and fixture reproducibility remain separate. Existing durable use
  cases describe preserved behavior, not architecture-test layout.
- Read-only discovery includes suite discovery in `src/test/suite/index.ts`.
  The glob selects compiled `*.test.js`; a split must preserve actual execution.
- No durable use-case, architecture-policy, README, or CHANGELOG update is
  indicated. Main owns eventual roadmap disposition at Feature Exit.

## Risks and assumptions

- A mechanical move can omit a gate, alter source paths/order, or leave a suite
  undiscovered. Planning must map all retained tests and support contracts.
- Refactoring re-export/cycle resolution can change detection semantics.
  Preserve existing fixture contracts before any structural change.
- Smaller files do not alone prove cohesive ownership. Planner must justify
  each boundary against the existing responsibility and avoid wrappers that
  only forward the same request and response.
- Known desktop host-bootstrap and unrelated shell/flow failures are roadmap
  follow-ups. They are not deletion evidence or implicitly accepted failures;
  V1 defines a bounded architecture check route without absorbing their repair.
- No implementation test result or quality baseline is claimed at intake.

## Required validation and planning follow-up

- Intake/plan documentation: Markdown lint for every changed Markdown path,
  local link and structure validation, scope/state/traceability/approval
  inspection, and `rtk git diff --check`.
- V1 requires the architecture catalog and fixture suite, test compilation,
  full title/assertion mapping, deterministic collector equality, and actual
  compiled-suite discovery/execution.
- Code validation must include exact disposable baseline/final qlty check and
  smells SARIF comparisons and the final aggregate under the Evidence Contract.
- S1 and S2 below define the complete implementation scope; Human Approval
  remains pending. No code changes have started.

## Validation index

- Identity / result: intake documentation validation recorded in the artifact
  below; its content manifest identifies the inspected working tree.
- Coverage: three selected-feature documents, references and configuration
  inputs; discovery facts at the stated base.
- Evidence artifact:
  [intake record](/private/tmp/architecture-test-cohesion-intake/evidence.json).
- Review / approval / commit: none.
- Missing facts / refresh or exception: implementation evidence intentionally
  absent at intake; no qlty or product scan required for this document tier.

## Solution Shape

All changed test modules belong to repository architecture verification in
`src/test`; none becomes a production port, adapter, or application factory.
The two `.codex/agents` settings belong to repository agent configuration.
They select model/effort only; they add no contract, abstraction, lifecycle,
or dependency direction, and preserve both role procedures and sandbox modes.
TypeScript AST, filesystem APIs, and Mocha already provide the needed
capabilities. No custom engine, registry, forwarding facade, or new dependency
is justified. Existing function implementations and contract names move with
one owner; consumers import that owner directly.

- `src/test/support/architectureSourceAnalysis.ts` owns dependency syntax,
  alias/relative resolution, imported construction and re-export resolution,
  and function-factory recognition. Move `ImportReferenceKind`,
  `ImportReference`, `ConstructionReferenceKind`,
  `ImportedConstructionReference`, `FunctionFactoryDefinition`,
  `resolveImportPath`, `collectImportReferencesFromSource`,
  `collectImportedConstructionReferencesFromSource`, and
  `collectFunctionFactoryDefinitionsFromSource` with their private helpers.
  Export the existing `withoutSourceExtension` helper for collection loading
  to reuse; do not duplicate its normalization logic. Retain `SourceModuleMap`
  as its local type. Preserve signatures, optional
  source-map defaults, AST traversal order, candidate order, and cycle handling.
  Keeping construction resolution and its mutually dependent binding helpers
  together avoids a separate resolver contract.
- `src/test/support/architectureRepositoryCollection.ts` owns deterministic
  production filesystem discovery and loading. Move
  `collectProductionSourceFiles`, `collectProductionImportReferences`,
  `collectProductionConstructionReferences`, and
  `collectProductionApplicationFactoryDefinitions`, with source roots,
  extension filters, path normalization, comparators, and loading helpers.
  It imports source analysis; source analysis does not import collection.
- `src/test/support/architectureDependencyRules.ts` retains the complete
  evaluation catalog, `architectureRuleIds`, `ArchitectureRuleId`,
  `RuleViolation`, `CompositionRootViolation`, all four `find*Violations`
  functions, and `formatViolation`, with their predicates/messages.
  It imports reference types from source analysis only; it does not read files
  or invoke collection. Repository collection does not import evaluation.
- The three suites below import only the support they use. Semantic Diff
  filesystem, browser-global checker, and category-cycle helpers remain local
  to their ownership suite. Do not create a generic graph or browser-analysis
  support module for their single consumer.

Architecture tests establish catalog facts, not semantic ownership or
abstraction-value verdicts. Independent review assesses this split and the
quality evidence. Production ports/adapters and retained application factories
are unchanged; this plan changes only how their existing gates are verified.

## Slice S1: Separate test responsibilities and retain agent setting edits

- Lifecycle state: SLICE_APPROVED; Human Approval: Approved.
- Value: maintainers can change source syntax handling independently of
  repository traversal and architecture policy evaluation.
- Dependencies: focused reviewed/approved planning commit; no other slice.
- Exact implementation paths:
  - `src/test/support/architectureDependencyRules.ts`
  - `src/test/support/architectureSourceAnalysis.ts` (new)
  - `src/test/support/architectureRepositoryCollection.ts` (new)
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `.codex/agents/implementer.toml` (existing user edit)
  - `.codex/agents/implementation-reviewer.toml` (existing user edit)
- Feature-record paths: this `TASKS.md` and `TRACEABILITY.md` for evidence and
  gate references; `SPECS.md` only if requirements need approved replanning.
- Work: move the existing responsibilities according to Solution Shape,
  update suite imports directly, and preserve all 29 existing test bodies and
  assertions. Add only focused regression assertions for unchanged formatted
  violations and multiple-rule ordering, because empty repository results do
  not exercise these observable contracts. Keep these in the existing suite.
  No re-export compatibility barrel or duplicated implementations. Retain the
  two existing TOML edits exactly: `model = "gpt-6.1-sol"` and
  `model_reasoning_effort = "medium"` replace `gpt-6-luna` and `xhigh`.
  Do not rewrite procedures, descriptions, names, sandbox settings, or other
  fields; no agent-file edits were made by the planner.
- Acceptance: complete catalog, special boundaries, source inventory,
  traversal/resolution semantics, output order, reason IDs, and messages match
  the base. Original suite remains independently executable and passing.
  Both TOML documents parse; only the two stated fields differ from the S1
  baseline and the complete `developer_instructions` strings are identical.
- Validation: V1 below on all support owners and the original suite; retain
  the original 29-title inventory and full assertion/fixture mapping, with
  any added regression titles recorded separately. Compare deterministic
  collected references and factory definitions against the exact S1 baseline
  in disposable snapshots, not just zero-violation outcomes.
- Approval boundary: the four test paths, two agent paths, and record paths
  above; existing test responsibilities and exact stated settings only. Any
  further rule, algorithm, allowlist, configuration,
  dependency, or production change returns to Main for Replanning.

## Slice S2: Separate fixture and Semantic Diff ownership suites

- Lifecycle state: PLAN_APPROVED; Human Approval: Approved.
- Value: keep feature-specific package/browser checks together and separate
  source-analysis fixtures from repository-wide rule gates.
- Dependencies: S1 is Ready, Completion Approved, and committed before S2.
- Exact implementation paths:
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `src/test/suite/architectureSourceAnalysis.test.ts` (new)
  - `src/test/suite/architectureSemanticDiffOwnership.test.ts` (new)
- Feature-record paths: this `TASKS.md` and `TRACEABILITY.md`.
- Work: move all seven source-analysis/discovery tests to the analysis suite,
  all seven Semantic Diff ownership tests plus their local constants/helpers
  to the ownership suite, and retain the remaining 15 tests and S1 regression
  assertions in the original rule suite. Retain test titles, fixtures,
  assertions, and relative repository-root calculation. Each file remains
  directly under `src/test/suite`; choose descriptive suite names.
- Acceptance: every base test is executed exactly once, no skips or relaxed
  assertions, all catalog and special gates retained, and all three files are
  matched by existing compiled-suite discovery. New suite names are allowed;
  no fixture/contract deletion or host-specific duplicate suites.
- Validation: V1 below against all three suites. Record per-file and aggregate
  executed title inventories, compared with S1 and original base. Verify the
  unchanged `**/**.test.js` glob in `src/test/suite/index.ts` discovers all
  three compiled paths. Direct Mocha executes those discovered paths without
  the unrelated desktop host bootstrap or Table/flow suites.
- Approval boundary: the three suite paths and two record paths above.
  Changing support ownership after S1, runner/configuration, production, or
  coverage requires Replanning through Main.

## Retained coverage inventory

Base contains 29 tests; preserve every assertion and fixture variant, not just
counts. Original titles and line references are retained in the planning
artifact. The division is:

- Analysis (7): supported TypeScript syntax; relative and alias resolution;
  imported factory/concrete construction; named/namespace re-export chains;
  cyclic re-exports; exported function factories independent of names;
  deterministic production roots.
- Semantic Diff ownership (7): canonical adapter categories; report ownership;
  moved-flat implementation imports; Calendar/Explorer canonical browser
  packages; shared result primitives; host-neutral report dependencies and
  browser globals; adapter category cycles.
- General gates (15): editor-feedback localization independence; all 12
  production dependency rules; normalized parser port; parser raw-seam
  violations and allowed imports; telemetry internal violations and allowed
  public contracts; raw telemetry calls; 12 rule-family fixtures; retired
  wrappers; production composition root; factory/adapter violations;
  allocator violations and production gate; exact raw-parser-test access.

The 12 catalog IDs remain exactly domain/application/presentation/infrastructure
layer rules, concrete infrastructure, generated parser/ANTLR, raw unit, retired
wrappers, presentation-domain, host/UI frameworks, Node built-ins, and telemetry
SDK. Keep all associated rule strings and append order unchanged. Parser port,
telemetry internal imports, composition/allocator reasons, raw reporting,
package ownership/browser globals/cycles, and test-only parser seams remain
additional gates rather than being reduced to those 12 IDs.

## V1: Required validation for each implementation slice

Run the nearest complete architecture check in exact disposable baseline and
final snapshots. S1 baseline is the plan commit; S2 baseline is the S1 commit.
Evidence belongs to the implementer and follows the Evidence Contract.

1. `rtk pnpm run test:compile`.
2. `rtk pnpm exec mocha --ui tdd --reporter json
'out/test/suite/architecture*.test.js'` (one shell command; joined line).
   Save complete JSON/output and exits outside inspected inputs. Require zero
   failures, pending tests, and missing catalog tests; record titles, per-suite
   execution counts, and fixture/assertion preservation separately. Use a
   clean compiled output or fresh snapshot so stale emitted files cannot hide
   missing discovery. Mocha TDD and Node are existing test dependencies; the
   architecture suites import filesystem/TypeScript support, not VS Code APIs.
3. Record production source-file/reference/factory inventories and exact
   equality of retained collector outputs for S1; use existing exported
   functions in a temporary consumer outside inspected inputs. Confirm full
   29-title base mapping for both slices and S1-added regressions for S2.
4. Record actual glob discovery of the three S2 compiled suites using the
   existing glob dependency and pattern; require each path once. S1 retains
   one original suite. No test-runner code/config changes are needed.
5. Full-repository qlty baseline/final observations, same selection/config:
   `rtk pnpm exec qlty check --all --sarif --no-fix` and
   `rtk pnpm exec qlty smells --all --sarif --no-snippets` with qlty >=0.645.0.
   Retain complete SARIF 2.1.0, statuses, nonzero analyzed-path inventories,
   versions/configuration hashes and rename/path mapping. Every new finding
   or reliably mapped adverse movement is Finding/NG under policy; splitting
   files is not a waiver. Run `rtk pnpm run qlty` only in the final snapshot and
   require pass. If formatting changes approved paths, synchronize and
   recreate/refresh the affected final evidence until stable.
6. For S1, parse both agent TOML files in baseline and final with Python
   standard-library `tomllib` (Python >=3.11). Use the available bundled
   Python at `/Users/jconee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`
   with a temporary script outside inspected inputs; record its exact command,
   version, source/hash, and output. Compare complete parsed mappings after
   removing only `model` and `model_reasoning_effort`; require equality,
   including exact `developer_instructions` string equality. Assert old values
   `gpt-6-luna`/`xhigh` and new values `gpt-6.1-sol`/`medium` for each file.
   Confirm raw diff contains only those setting replacements, and preserve
   the config hashes in baseline/final evidence. No dependency installation
   or agent procedure execution is required. Full-repository V1 qlty applies
   to this configuration-sensitive S1 scope as well as its test changes.
7. Markdown lint on all changed feature records, local link/structure,
   scope/traceability/gate inspection, and `rtk git diff --check`.

Record exact baseline/final identities, approved/changed/untracked/rename path
sets, configuration/dependency hashes, input coverage per command, architecture
rules and assertions exercised, raw output links, and any unavailable evidence.
Do not silently accept a command failure. Existing desktop bootstrap,
Table shell, and flow golden follow-ups stay separately owned; this bounded
route excludes those suites rather than treating their failures as passed.

Desktop/web builds and product host smokes are not required for these slices:
no production input, shared DTO, entry point, bootstrap, parser, product/test
configuration, or dependency changes. Agent model/effort selection changes
repository workflow execution, but does not enter either extension bundle.
The architecture browser-safety gates
and test compilation remain required. Any such surface change is a Replanning
trigger and must add the relevant desktop/web validation. Feature Exit still
requires current-head Qlty Cloud under repository policy.

## Plan readiness and risks

- Both slices are reviewable and independently committable; S1 leaves the
  whole suite working and S2 changes suite ownership after support is stable.
- No completed slices or commits exist. Original review remains valid for
  unchanged design; added S1 scope requires renewed review. Main retains the
  user approval provenance and records the renewed approved boundary.
- Preserve helper implementation order, export signatures, re-export cycle
  fallback, source extension/alias selection, Node built-in detection,
  relative-root depth, and suite-local TypeScript program behavior.
- Risk: lost coverage or stale compiled suites. Mitigation: clean snapshot,
  original title/assertion mapping, JSON execution and glob inventories.
- Risk: a move changes resolver/collector output or formatting/order while
  repository gates remain empty. Mitigation: S1 inventory equality and
  focused non-empty message/order regression assertions.
- Risk: qlty maps moved findings poorly. Retain official SARIF and explicit
  mapping; uncertain identity/direction is advisory, while every new finding
  or mapped adverse movement is NG. No review verdict is claimed here.
- No README/CHANGELOG/durable architecture or use-case changes are indicated;
  existing behavior only. Roadmap disposition belongs to Main at Feature Exit.
- Risk: model/effort selection changes implementation and review execution
  characteristics. Preserve role procedure/sandbox bytes and both independent
  review gates; no correctness or quality verdict follows from model choice.
- Next gate: renewed independent plan review, then Main records approval from
  the existing user instruction; no repeated approval request is needed.
  Approval-committer commits planning records before implementation starts.

## Planning validation index

- Identity/result: documentation validation and exact planning content manifest
  in [planning record](/private/tmp/architecture-test-cohesion-plan/evidence.json).
- Coverage: selected-feature planning documents, required references, complete
  original test-title inventory, support ownership and runner discovery facts.
- Intake facts reused: [intake record](/private/tmp/architecture-test-cohesion-intake/evidence.json).
- Review/approval/commit: none. No implementation baseline or pass is claimed.

## Replanning validation index

- Evidence: [replanning record](/private/tmp/architecture-test-cohesion-replan/evidence.json).
- Coverage: three revised feature docs, S1-only scope addition, exact existing
  two-file config diff/TOML parse and preserved procedures. Prior discovery and
  29-title inventory reused; no implementation baseline scans performed.
- Original planning evidence and review remain historical and unchanged.
  Revised scope review is pending; Main owns human approval annotations.

## S1 implementation and validation index

- Result: SLICE_APPROVED; two independent reviews Ready and explicit
  Completion Approval received. Completion commit pending; S2 is unstarted.
- Changed paths: the four approved S1 test paths, the exact two pre-existing
  agent setting edits, and this file plus `TRACEABILITY.md`.
- Solution Shape: source analysis owns syntax and resolution; repository
  collection owns deterministic discovery/loading; rule evaluation owns the
  unchanged catalog and messages. Consumers import the owner directly.
  Existing TypeScript AST, filesystem and Mocha capabilities suffice. No
  production port, adapter, retained application factory, wrapper or custom
  mechanism changes.
- Acceptance: original 29 test bodies/fixtures/assertions retained; one
  additional focused message/order regression. Baseline 29/29 and final 30/30
  pass with zero failures/pending. Production file, import, construction,
  factory and compiled-suite discovery inventories match exactly. Both TOML
  mappings and procedure strings match after removing only the approved
  model/effort settings; raw patches contain exactly those replacements.
- Validation identity, command exits, hashes, inventories, full outputs and
  official SARIF comparisons: [S1 evidence](/private/tmp/architecture-test-cohesion-s1/evidence.json).
  Baseline is plan commit `afec6acac051cff8c10e1d9e5cb69e0a9731782f`;
  final identity is the stabilized manifest in that artifact. Documentation
  gate metadata is separately identified from product inputs.
- Required validation: V1 compilation, original/discovered architecture suite,
  assertion mapping, inventory equality, configuration check, full-repository
  qlty observations/final aggregate, Markdown/link/structure and diff checks.
  Raw qlty statuses and finding dispositions remain in evidence; unchanged
  unrelated findings are not represented as absent.
- Compatibility/readiness: no production code, dependency, DTO, runner,
  entry point or product configuration change. Desktop/web bundles and
  `engines.vscode` (`^1.75.0`) remain unchanged; planned browser-safety gates
  pass. Test-only Node assumptions and existing AST error/cycle behavior remain
  unchanged. JP1/AJS, large/malformed definitions, errors/fallbacks, parser,
  telemetry event/privacy contracts and performance are unaffected by moving
  identical test functions. No README, CHANGELOG or durable documentation
  change is needed under the Durable Documentation Gate.
- Risks/feedback: unchanged pre-existing qlty findings retain their existing
  owners. Full title/body mapping and direct compiled discovery mitigate lost
  coverage; matching inventories mitigate resolver/traversal drift. Quality and
  semantic ownership judgments belong to independent review. Evidence records
  initial sandbox logging and exit-capture exceptions plus their corrected runs.

## S1 independent review and completion gate

- Reviews: `review_s1` and `review_s1_second`, independent read-only
  implementation-reviewer agents, both Ready with no Findings.
- Reviewed base: `afec6acac051cff8c10e1d9e5cb69e0a9731782f`.
- Reviewed substantive identity:
  `e73dfb896887b8233c828578083d78c38a1308176004075864dbb6501177a0d8`.
- Evidence: [Main S1 review record](/private/tmp/architecture-test-cohesion-main/s1-reviews.json).
  Producer evidence and all matching checks were reused; no reviewer reruns.
- Solution Shape, exact eight-path scope, acceptance, quality disposition,
  compatibility, and production readiness were accepted independently.
- Second review covers the architecture/configuration-sensitive surface.
- Completion Approval: Approved; approved at: approved in current conversation,
  2026-10-10 (Asia/Tokyo); scope: exact reviewed S1 completion below.
- Approved completion scope: exact eight S1 paths and the separately validated
  feature-record gate metadata. Agent model/effort changes are included.
- Gate metadata is separate from the immutable producer snapshot. Full qlty
  evidence remains bound to its recorded substantive manifest; these state and
  review annotations do not change scope, checks, or acceptance.

## S1 Completion Approval evidence

- Human explicitly approved the presented S1 completion in the current
  conversation; this authorizes its focused commit, not S2 Completion Approval.
- Record: [S1 completion approval](/private/tmp/architecture-test-cohesion-main/s1-completion-approval.json).
- Exact commit paths: `src/test/support/architectureDependencyRules.ts`,
  `src/test/support/architectureSourceAnalysis.ts`,
  `src/test/support/architectureRepositoryCollection.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `.codex/agents/implementer.toml`,
  `.codex/agents/implementation-reviewer.toml`, this `TASKS.md`, and
  `TRACEABILITY.md` in this feature folder.
