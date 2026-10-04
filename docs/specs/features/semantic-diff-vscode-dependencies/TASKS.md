# Feature Tasks: Semantic Diff VS Code Dependencies

## Agent Brief

- Purpose: narrow command collaborator contracts and move flow-source freshness
  policy from bootstrap to VS Code presentation, preserving behavior.
- Active slice: S2 affected replan is PLAN_APPROVED; the added single-assertion
  boundary is approved by the user's explicit correction instruction.
- Read first: [SPECS.md](SPECS.md), [TRACEABILITY.md](TRACEABILITY.md),
  [SDD policy](../../README.md), [architecture](../../architecture.md), and
  discovery/evidence references below.
- Next operation: focused replan commit before the assertion correction.
  Two affected implementation reviews and Completion Approval follow.
- Prohibitions: no dependency upgrades, new behavior, application/domain/parser
  changes, architecture exceptions, calendar consolidation, or host-harness fix.

## Current state

- Lifecycle state: PLAN_APPROVED (affected S2 boundary only)
- Readiness: the prior two S2 Ready reviews are retained for unchanged facts,
  but their completion candidate is superseded by the added assertion path.
  Product-input identity Finding F1 remains resolved for its recorded inputs.
- Next decision / blocker: focused replan commit. No implementation, S2
  Completion Approval, completion commit or closure approval is implied.
- Gate evidence: independent plan review Ready; explicit Human Approval in the
  current conversation; planning commit
  `c535a718c86e44b8e39f4771ca932f76c6bd654d` succeeded.
- Selection / base: explicit user choice; branch
  `codex/semantic-diff-vscode-dependencies`; base `main` at
  `b00da4f378b0e4a578d7563f69a81efbe32c83d2`.
- Preserved slices: S1 completed and committed at
  `95e4ab7927e8663b985b73fb5c448f0e97bb6d1c`; inherited features and subsequent
  roadmap items retain their scope and approvals.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: reviewed complete S1/S2 plan, its planning commit, and exact
  implementation boundaries and validation below. Completion and closure
  approvals remain separate gates.
- Approved paths: S1 and S2 exact production/test paths in their sections below,
  plus selected-feature SPECS.md, TASKS.md and TRACEABILITY.md for coordination.
- Planning commit paths: `docs/specs/features/semantic-diff-vscode-dependencies/SPECS.md`,
  `docs/specs/features/semantic-diff-vscode-dependencies/TASKS.md`,
  `docs/specs/features/semantic-diff-vscode-dependencies/TRACEABILITY.md`.

## S2 assertion replan approval

- Status: Approved
- Approved at: approved in current conversation
- Provenance: the user's explicit instruction to correct the known wording
  mismatch and pass the test authorizes the exact correction described below.
- Approved scope: reviewed eight-path S2 boundary, adding only the one
  command-test expectation correction; existing production behavior, remaining
  assertions, fixtures and test-harness/configuration boundaries are preserved.
- Replan commit paths: only
  `docs/specs/features/semantic-diff-vscode-dependencies/TASKS.md`.
  The existing six S2 production/test working-tree paths are related approved
  work and must remain unstaged by this planning commit.
- Independent plan review: Ready, no Findings; reviewed TASKS SHA-256
  `37f338e90473817bc755b04e5b5e1702384377a25bcc55500a51a66fec3ea212`,
  planning patch SHA-256
  `bbdbdf8d3a39e37b2c9906da1fa72d2bf8e9aea7d0029601b7ac538f79f6ffb3`.
- Gate: this approval permits the focused replan commit and correction after
  that commit. S2 Completion Approval and Closure Approval remain separate.

## S1 Completion Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: reviewed S1 implementation, its evidence and focused
  completion commit; S2 implementation then proceeds under the existing plan
  approval. No S2 completion or feature closure approval is implied.
- Approved paths: exactly the 16 S1 paths in the implementation evidence's
  `identity.changedPaths` (14 command modules, the command test and TASKS.md).
- Candidate scope: reviewed S1 implementation and evidence, with exactly the
  16 changed paths in the implementation evidence's `identity.changedPaths`.
- Review: independent implementation-reviewer Ready, no actionable Findings;
  substantive identity `6c150254f0cffd25f2b18a92450f3ea9f9b454a03470feb295d2df2ccd7569d0`,
  plus separately inspected producer/Main gate metadata.
- Review record: [S1 Ready handoff](/tmp/semantic-diff-vscode-dependencies-evidence/refreshed/review-s1-ready.json).
- Completion commit: `95e4ab7927e8663b985b73fb5c448f0e97bb6d1c`, exactly the
  16 approved paths; staged scope/hash checks and diff check passed.

## S2 Completion Approval

- Status: Pending
- Approved at: none
- Candidate scope: pending revision to the exact eight paths below: two
  production files, five test files and selected-feature TASKS.md. The added
  command-test path permits only the one specified expectation correction.
- Prior reviewed substantive identity:
  `a174fd0e9bedf34f19342d46872c3375d53b02dedcf0ce4c1d61a708d4d26c0f`.
- Prior reviews: [first independent Ready](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/review-a-ready.json)
  and [second independent Ready](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/review-b-ready.json).
  Both require affected re-review after implementation; neither approves the
  added test path or the revised completion candidate.
- Retained validation: [implementation evidence](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/evidence.json)
  and [check-specific input identities](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/product/product-check-identities.json).
  Reuse only check-specific matching inputs under the replan below.
- Residual limits: formal full desktop-suite and minimum-version host execution
  remain unproven. The inherited assertion is targeted for resolution in S2;
  its previous failure is retained as historical evidence, not a current pass.

## Main validation disposition: S1

- Decision: the refreshed, named VS Code diagnostic coverage is sufficient
  equivalent desktop evidence for S1 under this plan's explicit Main decision
  boundary. The formal command was attempted; its exit 0 remains an unproven
  full-suite result, not a claimed test pass.
- Basis: all 10 relevant command, schedule, capture, registration, source,
  panel and report suites executed on the final compiled inputs: 117 pass,
  one baseline-matched assertion failure. Architecture passed 29/29, web
  WEB-7 through WEB-13 passed, and both production bundles built. Exact
  source/generated/runtime identities and outcomes are in the linked
  implementation evidence's `refreshed/check-inputs-and-outcomes.json`.
- Failure disposition: retain the one registration-error assertion as an
  inherited test discrepancy, not a passing assertion. Its baseline inputs
  and actual error match; S1 changes dependency types and preserves that
  runtime path. Do not change behavior or the assertion in this slice.
- Follow-up owners: Test-harness maintainers retain the roadmap-owned desktop
  launcher issue. Semantic Diff command-test maintainers own the inherited
  error-message assertion alignment; Feature Exit must preserve that ownership.
- Limits: S1 only, with the approved paths and acceptance unchanged. No full
  desktop suite, minimum-version host run, or S2 validation is claimed. S2
  needs its own coverage and review. No harness/configuration edit or quality
  exception is authorized.
- Gate: independent reviewer must assess this disposition and refreshed
  evidence before Ready; explicit Completion Approval remains required.

## Main validation disposition: S2

- Decision: the named real VS Code diagnostic coverage is sufficient
  equivalent desktop coverage for S2 under the approved plan's explicit Main
  contingency, subject to independent verification of exact check inputs.
  The formal command was attempted; its launcher-only exit 0 is not a
  full-suite pass.
- Basis: the retained 16-suite run includes the adapter, wiring, real-adapter
  flow actions, source/panel/registry/capture/report, lifecycle/subscriptions,
  command/schedule regressions and architecture. It records 175 passes and
  the one inherited registration-error assertion failure. Web WEB-7 through
  WEB-15 and both production builds are separately recorded.
- Revised assertion disposition: resolve the inherited message mismatch with
  the single expectation change below and require the named suite to pass.
  Earlier 175-pass/one-failure evidence remains historical; S1's disposition
  and committed validation are unchanged. Semantic Diff command-test follow-up
  ownership may be discharged only after refreshed evidence and review.
- Limits: S2 only. No full-suite or minimum-version host pass, harness fix,
  quality exception or production message change is implied. Test-harness
  maintainers retain the roadmap-owned desktop launcher follow-up. A new
  failure or needed change outside the exact boundary returns through Main.
- Quality gate: the aggregate exits 0 but its check step selects zero files.
  It is not accepted as coverage. The full-snapshot SARIF and explicit-path
  checks are separate evidence. Both independent reviewers accepted the full
  scan coverage and aggregate exit with no quality Finding; no waiver was made.
- Evidence: [S2 implementation record](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/evidence.json).
  This disposition is a separately recorded metadata patch; it was not
  inspected by earlier product or quality runs.

## Slice order and gate boundaries

<!-- markdownlint-disable MD013 MD060 -->

| Slice | Value                                                             | Dependency                   | Lifecycle state |
| ----- | ----------------------------------------------------------------- | ---------------------------- | --------------- |
| S1    | Command collaborators expose responsibility-sized dependencies    | Plan commit                  | SLICE_COMMITTED |
| S2    | Presentation owns live flow-source freshness and host translation | S1 focused completion commit | PLAN_APPROVED   |

<!-- markdownlint-enable MD013 MD060 -->

S1 is independently usable and testable with existing bootstrap and flow host.
S2 finishes the roadmap outcome without changing the command contract shape.
Each slice receives implementation review, explicit Completion Approval, and
its own focused commit before the next dependent slice. S2 requires a second
independent implementation review because it changes bootstrap/host behavior.
Changed scope, owner, contract, validation, or approval boundary returns to
Main for Replanning and renewed independent plan review and Human Approval.

## Solution Shape and current impact

### Command contracts

Semantic ownership remains `src/presentation/vscode/commands`: host prompts,
acquisition coordination, optional runner selection, and output/session opening.
`SemanticDiffCommandDeps` remains the compatible flat composition contract at
`executeCompareSemanticDiffCommand`; bootstrap and existing callers need no
nested-object migration. Individual collaborators use local named `Pick`
contracts or direct capability parameters, preserving property types and
optionality. These type-only subsets constrain access; they introduce no
runtime wrappers, factories, service container, or new lifecycle owner.

Narrow each function to its direct capabilities plus the capabilities required
by functions it actually calls. Orchestrators receive intersections of their
runner/stage contracts; only the top-level composition/runner selection may
require the complete command contract. Do not replace leaf signatures with a
renamed full dependency object. Existing TypeScript structural typing and
`Pick` are sufficient; no custom injection mechanism or new package is needed.

Responsibility groups and exact member limits:

- Editor: `getActiveEditor` (`semanticDiffCommandEditor`, workflow input).
- File reading: `openTextDocument?`, `readFile` (reading); file selection adds
  `showOpenDialog`; mode selection only `showQuickPick` (selection).
- Prompt selection: `showWorkflowQuickPick?`, fallback `showQuickPick`;
  period selection additionally `showInputBox?` (workflow selection/period).
- Source acquisition/capture: `showOpenDialog`, `openTextDocument?`,
  `readGitHeadDefinition?`, `gitHeadSnapshotProvider?`,
  `beginSemanticDiffSourceCapture?`, `sourceHandleIdAllocator`, and the existing
  `buildSemanticDiffPresentationArtifacts?` capability gate (workflow source).
  Individual source/capture helpers need only their own subset.
- Report comparison: `buildSemanticDiffReportData`,
  `beginSemanticDiffSourceCapture?`, `sourceHandleIdAllocator`, and existing
  `openExplorer?` capture gate (build).
- Source registration/rollback: `registerSemanticDiffSourceCapture?`,
  `unregisterSemanticDiffSourceCapture?` (source binding).
- Output rendering: `buildSemanticDiffOutputContext?`,
  `presentSemanticDiffOutput?`, `language?`; display: `openReport`;
  notification/finalization: `showErrorMessage`, `language?` (command/steps).
- Explorer and artifact orchestrators combine only acquisition, capture,
  registration, comparison/artifact creation, `buildSemanticDiffOutputContext?`,
  session opening, `scheduleComparisonPeriod?`, and `language?` as used by their
  paths. Workflow runner selection retains exactly the existing tests for
  artifact builder plus schedule opener, prompted versus compatibility path,
  Explorer fallback, and legacy report fallback.

Existing application ports/use cases retain their names, inputs, optional
parser injection, outputs, and application-to-domain direction. In particular,
`SemanticDiffSourceCaptureFactory`, report/presentation builders, output-context
builder, and Git reader remain host-neutral capabilities. Retained application
factories keep their existing use-case/composition purpose and invocation sites;
this plan adds or wraps none. Source capture and Git reservation release remain
with command/registry owners; narrower signatures must preserve rollback.

### Flow-source presentation adapter

Add `createSemanticDiffFlowSourceHost` and its exported explicit
`SemanticDiffFlowSourceHostDeps` in
`src/presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost.ts`.
The factory returns the existing `SemanticDiffFlowHost`. Its injected inputs:

- `sourceCapture`: the `sourceCapture` method contract of the existing
  presentation context registry, receiving a `SemanticDiffOutputContext`;
- `getOpenTextDocuments`: returns the current readonly VS Code text documents;
- `openFlow`: `(uri: vscode.Uri, targetUnitId: string)` returning the existing
  `Promise<SemanticDiffFlowPanel>`.

The adapter owns conversion from captured URI/document data to
`SemanticDiffFlowSourceSnapshot`, live snapshot/document identity and freshness,
and opening the captured source URI. This boundary earns its place by host
translation, freshness policy isolation, and direct testability. It has no
cache, independent disposable, new application port, or capture ownership.
It consumes application DTOs and existing presentation source/flow contracts;
it never imports bootstrap's `SemanticDiffFlowViewerBridge`. Bootstrap injects
closures over the registry, `vscode.workspace.textDocuments`, and bridge `open`.
The adapter's `getSourceSnapshot` is also the getter used by Explorer wiring.

Move `createSourceSnapshotGetter`, identity/version/text/document predicates,
`isSourceCurrent`, `openFlowSource`, and `createFlowHost` responsibilities from
`semanticDiffWiring.ts` into this one cohesive module. Local predicates stay
private. Bootstrap constructs the adapter once per subscription composition and
continues constructing registries/providers/actions, selecting the optional
flow bridge, registering commands, and returning the same disposables.
When the bridge is absent, preserve the absent flow action and available source
snapshot lookup; an unused `openFlow` closure must not create a mandatory host
capability. Preserve the existing unavailable-source error and propagated
bridge failure behavior.

Freshness is checked against current injected documents on every call, without
opening a missing document or refreshing immutable capture. Require matching
handle and URI, exact text in both retained capture and open document, and
captured non-null version in both. Null snapshot version imposes no version
equality condition. Missing capture/document, replaced capture identity, edited
text, or changed required version is stale. Existing flow action owns rechecks
before open and after asynchronous readiness, overlay disposal, and stale
failure normalization; do not move or change those responsibilities.

Architecture-test facts and reviewer judgments are separate: the zero-exception
catalog checks imports, construction, parser/telemetry rules and layer layout;
review assesses these owners, subset usefulness, adapter value, unchanged
optional behavior and sufficiency of existing platform capabilities.

## S1: Narrow command collaborator dependencies

- Acceptance: R1 and command-related R4/R5. Every leaf dependency signature
  exposes its useful subset, orchestrators include required transitive inputs,
  and no optional capability becomes required. The public aggregate, command
  IDs/results and fallback selection remain compatible.
- Exact production paths (all under `src/presentation/vscode/commands/`):
  `semanticDiffCommand.ts`, `semanticDiffCommandBuild.ts`,
  `semanticDiffCommandEditor.ts`, `semanticDiffCommandExplorerWorkflow.ts`,
  `semanticDiffCommandReading.ts`, `semanticDiffCommandSelection.ts`,
  `semanticDiffCommandSourceBinding.ts`, `semanticDiffCommandSteps.ts`,
  `semanticDiffCommandWorkflowArtifacts.ts`,
  `semanticDiffCommandWorkflowExecution.ts`,
  `semanticDiffCommandWorkflowInput.ts`, `semanticDiffCommandWorkflowPeriod.ts`,
  `semanticDiffCommandWorkflowSelection.ts`, `semanticDiffCommandWorkflowSource.ts`.
- Exact test paths: `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`.
- Add meaningful contract-boundary coverage using minimal collaborator objects
  checked by TypeScript and exercised through acquisition/selection/registration
  helpers. Retain regression cases for report-only, Explorer, calendar
  compatibility, prompted file/Git, missing Git/optional prompt/document-reader
  fallback, cancellation, parse/build/open failure, exactly-once rollback and
  immutable after snapshot. Reuse existing cases when they already cover these.
- Exclusions: bootstrap, flow/source host, application/domain, localization
  resources, report rendering, providers, generated code/configuration and all
  paths not listed above, except selected feature coordination docs.
- Validation: common code evidence below plus nearest command/schedule suites,
  report/source capture/registry/report action regressions, desktop/web host runs
  (existing WEB-7/8 compatibility scenarios) and desktop/web builds.
- Readiness: no new persistence, telemetry, user workflow or JP1/AJS semantic
  source; errors and optional fallback remain the existing behavior.

### S1 implementation handoff

- Solution Shape: command ownership stays in `presentation/vscode/commands`;
  the flat `SemanticDiffCommandDeps` composition contract and runtime behavior
  are unchanged. Leaf signatures use local named capability subsets. The
  orchestrators compose the existing source/stage capability types, including
  `WorkflowSourcePreparationDeps`, `WorkflowArtifactBuildDeps`,
  `WorkflowArtifactOpenDeps`, and `PresentationArtifactBuildDeps`. No runtime
  wrapper, new module, or stronger optional requirement was added.
- Changed scope: the 14 approved production paths above, the approved command
  test, and this coordination record. No bootstrap, flow-source, report,
  application, domain, config, README, or CHANGELOG paths changed. R1/R4/R5
  remain mapped to S1 in `TRACEABILITY.md`; the mapping was checked and needs no
  edit.
- Compatibility: `engines.vscode` remains `^1.75.0`; command IDs/results and
  report, Explorer, prompted file/Git, calendar-compatibility, and fallback
  selection remain unchanged. No new production Node built-in import was added.
- Validation (refreshed against final substantive tracked manifest
  `6c150254f0cffd25f2b18a92450f3ea9f9b454a03470feb295d2df2ccd7569d0`): test
  compilation passed; `architectureDependencyRules` passed 29/29; desktop and
  web preparation passed; `pnpm run build` emitted both production bundles.
  The formal web host passed WEB-7 through WEB-13 with exit 0; its log also
  records ECONNRESET/EPIPE/stream-close diagnostics after those cases. The
  formal desktop host exited 0 but did not demonstrate named suite execution.
  The retained nearest-suite diagnostic ran 117 tests successfully and failed
  one assertion; the same assertion failure is recorded on baseline. The
  refreshed per-check inputs, generated output manifests, tool/runtime
  identities, raw logs and statuses are in the linked implementation evidence.
  F1's stale product evidence is resolved. F2 remains pending Main's explicit
  disposition of formal desktop coverage and the baseline-matched assertion;
  readiness remains blocked until then. Production webpack emitted its usual
  performance recommendations for the existing large webview and web bundles.
- Qlty: exact complete 754-path baseline/final inventories and the final
  check/smells SARIF comparison, aggregate status, command logs, and distinct
  snapshot caches are retained in the linked implementation evidence. A prior
  clone-based final snapshot omitted 12 baseline files and is explicitly
  invalidated there; it is excluded from the disposition.
- Independent review route: Main routes the evidence disposition and then an
  implementation reviewer. This handoff does not grant `Ready`, completion
  approval, or the S2 dependency gate.

## S2: Move flow-source host policy into presentation

- Acceptance: R2/R3 and remaining R4/R5. Bootstrap contains composition rather
  than snapshot/freshness policy; the adapter follows all freshness cases above.
- Exact production paths: `src/bootstrap/extension/semanticDiffWiring.ts` and
  new `src/presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost.ts`.
- Exact test paths: new `src/test/suite/semanticDiffFlowSourceHost.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/webSmoke.ts`, and `src/test/suite/semanticDiffCommand.test.ts`
  limited to the expectation in the assertion replan below.
- Add direct adapter tests for both sides, matching source, changed handle/URI,
  retained/open text mismatch, non-null version mismatch, null-version acceptance,
  missing capture/document, live document changes between calls, captured-URI
  open translation, missing-source error, and propagated open failure.
- Extend wiring tests for configured/absent bridge and snapshot/host injection;
  retain source registrar/provider/command/disposal assertions. Exercise the
  real adapter through flow action tests for edits during asynchronous readiness
  and stale overlays, instead of testing only a stubbed freshness boolean.
- Add browser smoke coverage using the adapter and browser-safe injected source,
  document and flow-open capabilities for fresh and stale/null-version behavior.
  Keep existing web scenarios unchanged.
- Exclusions: flow viewer bridge, flow action algorithms, overlay registry,
  Explorer/calendar lifecycle implementations, application/domain, report and
  navigation algorithms, test harness/configuration, and all other paths except
  selected feature coordination docs.
- Validation: common code evidence plus adapter/wiring/flow suites and source
  action, panel, registry, capture, report/provider and extension lifecycle/
  subscriptions regressions; desktop/web host runs and desktop/web builds.
- Readiness: preserve optional bridge, source availability errors, immutable
  capture ownership, session disposal and privacy; no new event listener/cache.

### Prior S2 implementation handoff (unchanged seven-path evidence)

- Solution Shape: `presentation/vscode/semantic-diff/flow` owns captured URI
  projection, source identity/text/version freshness against current open
  documents, and opening the captured source. The exported
  `createSemanticDiffFlowSourceHost` returns the existing
  `SemanticDiffFlowHost`; its required dependencies are the registry's
  `sourceCapture` capability, a current readonly document getter, and
  `openFlow`. It adds no cache, capture ownership, independent disposable,
  application port, or bridge import. Bootstrap remains the composition and
  disposal owner and supplies closures. Without a bridge, flow action remains
  absent while snapshot lookup remains available; the required unused
  `openFlow` closure preserves the existing unavailable-bridge failure. Flow
  action freshness rechecks, readiness handling and overlay disposal remain in
  their existing owner.
- Acceptance: direct adapter tests cover both source sides, changed identity,
  text and non-null versions, null versions, missing capture/document, live
  document changes, captured-URI opening, missing-source and bridge errors.
  Wiring tests cover the adapter's registry snapshot and optional bridge;
  Explorer flow tests use the real host for stale readiness and overlay cases.
  Browser WEB-14 and WEB-15 cover fresh/stale URI opening and null-version
  compatibility. Existing application, parser, JP1/AJS and telemetry
  contracts remain unchanged.
- Changed paths: exactly the approved bootstrap file, new flow-source host,
  four approved suites (`semanticDiffFlowSourceHost.test.ts`,
  `semanticDiffWiring.test.ts`, `semanticDiffExplorerFlow.test.ts`,
  `webSmoke.ts`), and this coordination file. `TRACEABILITY.md` already maps
  R2/R3/R4/R5 to these suites and validations, so its mapping needed no edit.
  No bridge, flow-action algorithm, application/domain/parser, configuration,
  test harness, README or CHANGELOG path changed. The S1 commit-metadata patch
  present before S2 is separately identified in the linked evidence overlay.
- Compatibility: `engines.vscode` remains `^1.75.0`; no production Node
  built-in import, telemetry change, new persistence, listener or cache was
  introduced. Snapshot freshness retains exact text and captured non-null
  version checks, and URI serialization handles the registry's immutable
  frozen URI value.
- Validation: final compile and desktop/web preparation passed; browser smoke
  passed WEB-7 through WEB-15. Both production bundles built. The required
  desktop command exited 0 but did not demonstrate named suite invocation. A
  retained temporary runner invoked 16 named suites: 175 tests passed, 1
  failed, 0 pending; the only failure is the baseline-matched
  `semanticDiffCommand.test.ts` source-registration error-message assertion
  recorded for S1. `architectureDependencyRules.test.ts` passed 29/29 in that
  run. Main must record an S2-specific disposition of the formal desktop gap
  and inherited assertion before reviews; this handoff does not infer that
  disposition. Raw logs, suite results, launcher/runtime identities, generated
  input identities, qlty SARIF/invocations, source manifests and commands are
  retained in
  [`s2/evidence.json`](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/evidence.json).
- Prior review result: both independent reviewers returned Ready, no remaining
  Findings. The first review's product-input identity Finding was resolved by
  refreshing only affected product checks and recording generated inputs,
  outputs and common configuration/dependency/tool/runtime identities. The
  substantive source and quality observations were reused unchanged. Review
  and approval references are indexed above; those Ready results require
  affected renewal under the assertion replan before Completion Approval.

## S2 assertion replan

- Trigger: Main relayed the user's explicit request to correct a wording
  mismatch and pass the tests. This extends only uncommitted S2; no new
  feature/intake or change to completed S1 is needed. Main owns approval
  provenance after independent plan review; this record grants no approval.
- Exact completion boundary: `src/bootstrap/extension/semanticDiffWiring.ts`,
  `src/presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost.ts`,
  `src/test/suite/semanticDiffFlowSourceHost.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/webSmoke.ts`, `src/test/suite/semanticDiffCommand.test.ts`,
  and `docs/specs/features/semantic-diff-vscode-dependencies/TASKS.md`.
- Added change: in `releases without unregister when source registration is
  unavailable` (currently line 1797), replace only the expected message
  `Semantic diff source targets could not be registered.` with
  `Semantic diff source capture could not be established.`. Preserve the
  `source-capture-failed` code, fixture, release-only event assertion and all
  other expectations. No production/localization/error-path change, harness,
  configuration, unrelated failing test or other path is authorized.
- Discovery: the fixture removes `registerSemanticDiffSourceCapture`;
  `registerWorkflowSource` returns `missing`, and
  `openRegisteredWorkflowCapture` releases the capture and returns
  `localization.sourceCaptureFailed` before opening a registered session.
  Its established English text is the new expectation. Registration-failure
  messages on other paths remain distinct. References and hashes are in the
  [replan evidence](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/assertion-replan/evidence.json).
- Solution Shape: unchanged production semantic owners, factory/contracts,
  dependency direction, adapter responsibilities and lifecycle. The added
  test asserts existing command failure normalization and exactly-once release;
  it adds no abstraction, port, adapter or custom mechanism. R4's existing
  S1/S2 command/capture/rollback mapping in TRACEABILITY already covers this
  case and needs no mapping edit; R1-R5 acceptance remains unchanged.
- Dependency/order: S1 commit `95e4ab7927e8663b985b73fb5c448f0e97bb6d1c`
  remains the S2 comparison base and prerequisite. Independent replan review,
  renewed scope approval recorded by Main and focused replan commit precede
  the assertion edit. Refresh affected evidence, obtain two independent
  affected implementation reviews, then request separate Completion Approval.
  Preserve unchanged semantic-shape judgments instead of redoing those reviews.
- Affected validation: run `rtk pnpm run test:compile`, then the retained
  `node /private/tmp/semantic-diff-vscode-dependencies-evidence/s2/product/run-targeted-desktop.js`
  real VS Code runner covering the same 16 named suites. Expected result is
  176 passed, zero failed/pending, including architecture 29/29. Retain the
  runner/suite definitions and logs/results/status. Bind current source,
  config/dependency/tool identities and actual generated `out` and VS Code
  runtime inputs immediately before execution; compare relevant generated
  hashes afterward. Compilation changes only tests; unchanged development
  bundles need no rebuild. No historical suite failure becomes a pass by edit
  alone. Any unexpected failure returns to Main rather than broadening scope.
- Quality refresh: preserve the matching complete S1-commit baseline check and
  smells SARIF, configuration/version/selection and inventories. Build an exact
  disposable final snapshot for the revised eight-path S2 scope and substantive
  docs, then run the same full-repository `qlty check --all --sarif --no-fix`
  and `qlty smells --all --sarif --no-snippets` commands through `rtk pnpm exec`;
  run `rtk pnpm run qlty` only there. Retain final official SARIF, nonzero path
  inventories, comparison and aggregate status. Added/changed test-path
  findings count as new; mapped adverse movement is NG. If formatter changes
  more than the authorized expectation, stop through Main. Refresh observations
  until stable for authorized content; no new baseline scan or waiver.
- Evidence reuse: refreshed compile/named desktop results and final qlty replace
  only their affected observations. Preserve prior web WEB-7 through WEB-15,
  production builds, formal-launcher limitation and other matching product
  checks when their own input/config/tool/generated manifests still match.
  The dedicated web smoke bundle and production bundles do not consume this
  desktop assertion; record the excluded input and matching relevant hashes.
  A changed broad `out` inventory alone does not invalidate a narrower web or
  production check. No automatic web/build/formal-launcher rerun is required.
- Risks/readiness: regression risk is an incorrectly aligned expected message;
  concrete fixture/runtime inspection and the unchanged error/event assertions
  constrain it. JP1/AJS, desktop/web behavior, engine `^1.75.0`, telemetry and
  production Solution Shape are unchanged. README/CHANGELOG and durable docs
  need no update. Historical S1 failure remains recorded; full desktop suite
  and minimum-version execution remain unproven with existing follow-up owners.
- Invalidation: prior S2 Ready/completion candidate does not cover the new
  boundary; affected re-review and scope approval must be renewed. Prior Human
  Approval remains historical for the original scope, not approval of this
  extension. S1 approval/commit/evidence and matching unchanged S2 product facts
  remain valid. New plan review is required; no human approval is rewritten.

## Validation and evidence requirements

No implementation baseline is collected during planning. For each slice the
implementer records exact baseline/final content manifests, approved/change/
untracked/rename/delete paths, check inputs and configuration/dependency/tool
identities, raw command output/status, coverage and missing facts outside
inspected snapshots. S1 baseline is the planning commit; S2 baseline is the S1
completion commit. Include generated/ignored build inputs actually consumed.
Record metadata patches separately; never claim prior scans inspected them.

Required commands for each code slice:

```sh
rtk pnpm run test:prepare:desktop
rtk pnpm run test:desktop:run
rtk pnpm run test:prepare:web
rtk pnpm run test:web:run
rtk pnpm run build
rtk pnpm exec markdownlint-cli2 'docs/specs/features/semantic-diff-vscode-dependencies/*.md'
rtk git diff --check
```

The preparation/type compilation and full desktop suite cover the named nearest
suites and `architectureDependencyRules.test.ts`; record their results
individually, not just an aggregate exit. Web uses its existing dedicated smoke
bundle, so the desktop suites alone cannot stand in for browser coverage.
`build` emits both production bundles. Record engine before/after (`^1.75.0`),
changed import/export/layer candidates, and a production Node-import inspection
with any unresolved cases alongside the separate architecture-test result.

In exact disposable baseline and final snapshots, with qlty >= 0.645.0, run:

```sh
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
```

Retain all four complete official SARIF 2.1.0 artifacts, status/logs, qlty version,
matching full-repository selection/configuration hashes, nonzero analyzed-path
inventories/counts and snapshot identities. Compare findings by stable identity,
explicit severity and metric direction under the SDD policy: new findings or
reliably mapped adverse movement are NG; unreliable mapping/direction is
advisory, and unchanged unrelated findings stay outside slice disposition.
Run `rtk pnpm run qlty` only in the disposable final snapshot and require a pass.
If formatting changes approved paths, sync them and rebuild/reobserve until
stable. No configuration change or quality exception is authorized.

Known desktop launcher, table-shell and expanded-flow golden issues are owned
by [roadmap verification follow-ups](../../roadmap.md#verification-follow-ups).
Attempt the supported required commands and record actual outcomes. If blocked,
Main must explicitly decide sufficient equivalent coverage and disposition;
do not quietly skip the host run, invent a pass, edit the harness, or accept a
failure. Any temporary runner used for targeted investigation must be retained
in evidence with executable/alias/define identities and exact coverage; it does
not automatically replace the required desktop host command. Unavailable
required evidence blocks slice readiness pending that decision.

Documentation-only planning validation: changed feature Markdown lint, local
links/anchors, structure/traceability/state/approval/scope inspection and diff
check. Full-repository qlty is not required for this planning patch. Reuse intake
discovery with matching manifests; the changed docs need fresh validation.

## Risks, documentation and exit readiness

- Optional runner predicates and the legacy byte-reader fallback are compatibility
  contracts. Avoid discriminated capability redesign or strengthening `?`.
- Forwarded dependencies must include the actual called-stage requirements;
  direct property lists alone are insufficient. Compilation and minimal-input
  boundary cases guard this; semantic review checks subset usefulness.
- URI/handle replacement, null versions and asynchronous changes can reopen stale
  sources. Direct adapter and integrated action coverage guard these cases.
- Bootstrap presentation injection must not import the bridge type in presentation
  or transfer registry/provider/disposable ownership.
- JP1/AJS large/malformed/encoded sources keep existing byte limits, decoded
  document behavior, parse errors and comparison result semantics.
- README/CHANGELOG: internal-only, unchanged externally observable behavior;
  neither is an approved edit. Existing durable comparison/report use cases and
  architecture already describe the owners. Feature Exit reassesses whether
  reusable new knowledge needs the smallest durable update.
- Roadmap item 1 stays until Feature Exit; later calendar, readonly-domain and
  architecture-test outcomes remain separate. Main routes closure propagation.
- Exit readiness: pending both committed slices, acceptance/traceability and
  implementation reviews; current-head Qlty Cloud must pass before Feature Exit.

## Validation index

- Discovery: [intake evidence](/tmp/semantic-diff-vscode-dependencies-intake/evidence.json),
  identity `0d21071648821cc43062deb7c5456b93042ecbf818233a31f36926f0d9516072`;
  selected code/policy references are supplemented in planning evidence.
- Planning docs: [planning evidence](/tmp/semantic-diff-vscode-dependencies-planning/evidence.json),
  identity `planning-docs-v1`; content manifest and command results retained there.
- Coverage: selected SPECS/TASKS/TRACEABILITY, links, structure, R1-R5 to slices,
  exact path/exclusion/gate boundaries and human approval provenance.
- Review: independent `plan-reviewer`, Ready for approval, no Findings;
  reviewed substantive identity
  `7ca2c810f703c69dc76c76f6585e49b63e9063af19c85bf08251e341f492533f`
  in the linked planning evidence. Main records this verdict as gate metadata;
  it does not grant Human Approval or invalidate substantive validation.
- Approval: reviewed S1/S2 plan approved in current conversation. Planning
  commit `c535a718c86e44b8e39f4771ca932f76c6bd654d`;
  staged checks and approved manifest passed. Implementation evidence:
  [/tmp/semantic-diff-vscode-dependencies-evidence/evidence.json](/tmp/semantic-diff-vscode-dependencies-evidence/evidence.json).
- Residual limitation: formal full desktop-suite execution remains unproven;
  the inherited assertion remains failing in the retained S1 run. Main's
  S1-only equivalent-coverage
  disposition above was accepted by independent re-review. S1 is Ready;
  completion approval is recorded above. Product checks bind to the
  exact substantive manifest above. This TASKS update is a separate metadata
  revision made after those runs; the evidence records its hash separately and
  does not claim earlier scans inspected this revision. Qlty baseline/final
  SARIF and aggregate remain attached to their original matched manifests.

- Assertion replan: [documentation/discovery evidence](/private/tmp/semantic-diff-vscode-dependencies-evidence/s2/assertion-replan/evidence.json).
  Only TASKS.md changes in this planning revision. SPECS and TRACEABILITY
  retain their requirements and mapping. Documentation checks cover the final
  substantive plan; product/quality refresh belongs to implementation after
  the renewed plan gate.
