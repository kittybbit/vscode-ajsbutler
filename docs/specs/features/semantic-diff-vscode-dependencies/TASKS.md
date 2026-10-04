# Feature Tasks: Semantic Diff VS Code Dependencies

## Agent Brief

- Purpose: narrow command collaborator contracts and move flow-source freshness
  policy from bootstrap to VS Code presentation, preserving behavior.
- Active or approved slice: S1 then S2 approved; S1 awaits planning commit.
- Read first: [SPECS.md](SPECS.md), [TRACEABILITY.md](TRACEABILITY.md),
  [SDD policy](../../README.md), [architecture](../../architecture.md), and
  discovery/evidence references below.
- Next operation: Main routes the approved planning commit. No runtime/test/
  configuration edits
  before that gate.
- Prohibitions: no dependency upgrades, new behavior, application/domain/parser
  changes, architecture exceptions, calendar consolidation, or host-harness fix.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: approved planning commit, then S1 implementation.
- Gate evidence: independent plan review Ready; explicit Human Approval in the
  current conversation; planning commit pending.
- Selection / base: explicit user choice; branch
  `codex/semantic-diff-vscode-dependencies`; base `main` at
  `b00da4f378b0e4a578d7563f69a81efbe32c83d2`.
- Preserved slices: none completed; inherited features and subsequent roadmap
  items retain their scope and approvals.

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

## Slice order and gate boundaries

<!-- markdownlint-disable MD013 MD060 -->

| Slice | Value | Dependency | Lifecycle state |
| ----- | ----- | ---------- | --------------- |
| S1 | Command collaborators expose responsibility-sized dependencies | Plan commit | PLANNED |
| S2 | Presentation owns live flow-source freshness and host translation | S1 focused completion commit | PLANNED |

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

## S2: Move flow-source host policy into presentation

- Acceptance: R2/R3 and remaining R4/R5. Bootstrap contains composition rather
  than snapshot/freshness policy; the adapter follows all freshness cases above.
- Exact production paths: `src/bootstrap/extension/semanticDiffWiring.ts` and
  new `src/presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost.ts`.
- Exact test paths: new `src/test/suite/semanticDiffFlowSourceHost.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/webSmoke.ts`.
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
  commit pending. Code evidence: pending implementation.
- Missing facts: no blocking planning fact; required host outcome/disposition is
  evaluated during implementation as described above.
