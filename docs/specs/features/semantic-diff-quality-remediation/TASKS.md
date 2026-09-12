# Feature Tasks: Semantic Diff Quality Remediation

## Agent Brief

- Purpose: remove PR #317 Qlty blockers without observable behavior change.
- Approved or active slice: Slices 1-4 are complete at `fa933763`, `ecea8714`,
  `6441de1e`, and `e89e6cab`; Slice 5 is complete at `a69fcd12` after focused
  state commit `4f3119d7`; Slice 6 replan is complete at `3af9494d`; Slice 7
  implementation is complete at `b0095565`; its prior approval is superseded by
  the reviewed and Human Approved web-harness replan below.
- Do not suppress, ignore, disable, or manipulate the Qlty baseline.
- Do not edit inherited Dependabot documents or Calendar Slice 3 scope.
- Read `SPECS.md`, this file, and the two source use cases first.
- Web-harness replan/state commit `800612e4` is complete; the approved Slice 7
  implementation and completion commit `b0095565` are complete under the
  recorded boundary.
- Next decision: delegate the exact approved Slice 8 paths below to
  `approval-committer` for its focused state commit. Slice 8 may then proceed
  to implementation and independent review under the existing plan.

## Sync Rule

- Update this file in the same commit whenever a task is completed,
  re-scoped, or intentionally dropped.
- This file is the sole plan and current-state owner for this feature.
- Update `roadmap.md` only if repository-level future work changes.

## Plan Status

- Status: Replanned; Slices 1-7 complete; Slice 8 active under the approved
  ten-slice plan; web-harness replan for Slices 7-10 approved and focused
  replan/state commit `800612e4` complete
- Planning scope: all 99 remote Qlty blockers represented by the 18-file local
  inventory, plus the one `CHANGELOG.md` formatting failure and the revised
  Slice 6 private helper paths required by this replan.
- Review status: Original and revised plan review, including the web-harness
  delta, Ready with no findings.
- Human approval: Prior Slice 7 approval is superseded; the exact web-harness
  delta and existing Slice 7 production/test scope were Approved in the
  current conversation on 2026-09-12.
- Active implementation slice: Slice 8 artifact, Explorer, and finalization
  workflow; exact scope is Human Approved below and its focused state commit
  is pending.
- Slice count and order: ten slices in the dependency order below.

## Replanning Finding

- Finding: `src/test/runWebTest.ts` passes only the compiled
  `src/test/suite/webSmoke.ts` module to `@vscode/test-web`. Its WebWorker
  extension host supplies a fake `require` for `vscode` only; relative
  requires for imported Semantic Diff command/transport/bridge/panel/session
  dependencies fail. The WEB-7 import code was removed to preserve the
  baseline, so the prior passing web run is not evidence that WEB-7 executed.
- Why the plan could not continue unchanged: Slices 7-10 had browser scenario
  claims without an executable bundled dependency graph, so `test:web` could
  not prove the injected scenarios and must not be reported as a skipped
  success.
- Smallest revision: add a test-only WebWorker bundle entry and isolated
  webpack configuration, wire the preparation script and `runWebTest.ts` to
  that bundle, and make `webSmoke.ts` the explicit scenario orchestrator.
  Preserve the production web bundle, extension behavior, Qlty policy, and
  existing desktop validation. Calendar Slice 3 and Dependabot scope remain
  unchanged.

## Human Approval

- Status: Approved for the Slices 7-10 web-harness delta and existing Slice 7
  production/test scope; focused replan/state commit `800612e4` complete.
- Approved at: 2026-09-12 in the current conversation.
- Approval basis: final independent web-harness plan review `Ready` with no
  findings, followed by the user's explicit approval.
- Superseded approval: the prior pre-harness Slice 7 approval for the three
  command production files and five test paths is superseded for web
  validation; it does not authorize the new harness paths.
- Approved scope: the existing Slice 7 production files and tests recorded in
  the prior activation record below, plus `package.json` test-only scripts,
  `webpack.web-test.config.js`, `src/test/suite/webSmokeWebEntry.ts`,
  `src/test/runWebTest.ts`, and existing `src/test/suite/webSmoke.ts`
  orchestration. `pnpm-lock.yaml` remains unchanged.
- Preserved boundaries: Slice 6 completion `3af9494d`, production behavior,
  desktop tests, `webpack.config.js` production targets, `SPECS.md`,
  `CHANGELOG.md`, Calendar Slice 3, and Dependabot scope remain unchanged.

The approved web-harness delta is recorded in focused replan/state commit
`800612e4`; Slice 7 implementation and WEB-7 execution claims may proceed
under the approved boundary.

## Slices 7-10 Web Harness Replanning (2026-09-12)

- Trigger evidence: `src/test/runWebTest.ts` passes the compiled
  `src/test/suite/webSmoke.ts` path to `@vscode/test-web`, which runs it in a
  WebWorker extension host. That host's fake `require` resolves `vscode` only;
  relative requires for imported Semantic Diff command, transport, bridge,
  panel, session, and bootstrap dependencies fail. The attempted WEB-7
  import was removed to preserve the baseline, so the prior passing web run
  is not a skipped-success claim for WEB-7.
- Selected option: an isolated test-only webpack bundle, because it supplies a
  browser-safe dependency graph to the real extension host without adding
  test modules to the production `web` entry or weakening the host's loader.
  Extending the fake `require` or changing production bundling is rejected.
- Exact revised harness/config paths:
  - `package.json` (add `test:prepare:web:bundle` as
    `webpack --config webpack.web-test.config.js --mode production`; make
    `test:prepare:web` run `development:web`, `test:compile`, and that bundle
    step; make `test:web:run` run
    `pnpm run test:prepare:web:bundle && node ./out/test/runWebTest.js`)
  - `webpack.web-test.config.js` (new test-only config)
  - `src/test/suite/webSmokeWebEntry.ts` (new bundle entry exporting `run`)
  - `src/test/runWebTest.ts` (points `extensionTestsPath` to the bundle)
  - `src/test/suite/webSmoke.ts` (explicit WEB-7 through WEB-10 scenario
    imports/orchestration)
    `pnpm-lock.yaml` is unchanged because no dependency is added.
- Bundle wiring: after the existing production `development:web` build and
  `test:compile`, run the exact `test:prepare:web:bundle` command to emit
  `out/test/suite/webSmoke.bundle.js`. The test-only config derives the
  existing `webpack.config.js` web target and changes only the entry to
  `./src/test/suite/webSmokeWebEntry.ts`, the output path/filename to
  `out/test/suite/webSmoke.bundle.js`, and its cache name; it retains
  `target: webworker`, `vscode` as `commonjs vscode` external for the host
  fake, browser condition names and fallbacks, and the `process` browser
  provider. Production mode keeps `devtool: false` for CSP-safe worker
  execution and emits the CommonJS2 module shape required by the `run`
  contract. `webSmokeWebEntry.ts` re-exports `run` from `webSmoke.ts`, and
  `runWebTest.ts` resolves `./suite/webSmoke.bundle.js` from `out/test`.
  `test:web` continues to use its existing `pretest:web` preparation path;
  the direct `test:web:run` path independently invokes only
  `test:prepare:web:bundle` immediately before `runWebTest.js`, so
  `test:full` cannot bypass the bundle and no script calls `test:web` or
  `test:web:run` recursively.
- Exact scenario imports and feasibility:
  - `WEB-7` imports the approved command/localization/steps seams through
    `webSmoke.ts`, activates the extension, verifies registration, and invokes
    the injected no-active-editor command core. This is feasible once the
    bundled graph resolves all relative imports; interactive pickers and
    file/Git dialogs remain unclaimed.
  - `WEB-8` imports the future Slice 8 command/artifact/Explorer seams through
    the same entry and uses deterministic in-memory doubles for finalization
    and cleanup. It is feasible as host composition, not registered-command
    UI or Explorer DOM automation; bundle compilation is a prerequisite.
  - `WEB-9` imports the transport/bridge seams from the future Slice 9 paths
    and drives controlled browser-safe `postMessage` ports and targets. It is
    feasible without a real Calendar Webview DOM; exhaustive protocol cases
    remain in focused desktop tests.
  - `WEB-10` imports the future Slice 10 session/panel/bootstrap seams and
    composes controlled sidecar and parent-disposal handles. It is feasible
    only as host-side composition; a real `WebviewPanel` DOM/message flow is
    not claimed. Any unresolved Node-only or VS Code-only dependency blocks
    the scenario claim and is recorded as residual risk rather than skipped.
- Required acceptance: bundle build succeeds with no unhandled relative
  imports, `runWebTest.ts` loads the emitted module and invokes its exported
  `run`, and the real web host reports WEB-7 through WEB-10 only when each
  scenario executes. A bundle/build failure is a gate failure, not a passing
  or skipped scenario. From a clean checkout, validate the direct route as
  `pnpm run test:prepare && pnpm run test:web:run`; the first command supplies
  `out/web.js` and `out/test/runWebTest.js`, and the second command must emit
  the test bundle immediately before running the web host. The `test:full`
  sequence must exercise the same direct `test:web:run` path. Production
  `webpack.config.js` output and extension behavior remain unchanged.
- Approval boundary delta: the prior Slice 7 three-production-file/five-test
  approval is superseded for the web-harness delta. Revised Slice 7 adds the
  exact `package.json`, `webpack.web-test.config.js`,
  `src/test/suite/webSmokeWebEntry.ts`, and `src/test/runWebTest.ts` paths;
  existing `src/test/suite/webSmoke.ts` remains the scenario source. Slices
  8-10 reuse this harness but retain their exact production scopes. Independent
  plan re-review is `Ready` with no findings and Human Approval is `Approved`
  on 2026-09-12; focused replan/state commit `800612e4` is complete and the
  delta has been implemented within the approved boundary.
- Preserved partial work and exclusions: current Slice 7 command production
  changes remain untouched; no runtime behavior, production webpack entry,
  Qlty configuration, dependency, Calendar Slice 3, Dependabot document, or
  public API change is authorized by this replan alone.

## Plan Commit Gate

- Status: Complete; focused plan commit `d3693d76`.
- Basis: independent plan review `Ready` with no findings and Human Approval
  for the complete ten-slice plan plus the exact Slice 1 scope.
- Exact commit paths: this feature's `SPECS.md`, `TASKS.md`, and
  `TRACEABILITY.md` only.
- Prohibited in this commit: runtime, test, generated, configuration,
  dependency, `CHANGELOG.md`, Calendar Slice 3, and Dependabot changes.

## Replan Commit Gate

- Status: Complete; focused replan/state commit `2734813c`.
- Basis: revised independent plan review `Ready` with no findings and Human
  Approval `Approved` in the current conversation on 2026-09-12.
- Exact commit paths: this feature's `TASKS.md` and `TRACEABILITY.md` only;
  the already-committed `SPECS.md` remains unchanged.
- Approved boundary: the five exact Slice 6 production paths and four exact
  Slice 6 test paths recorded above, with no implementation changes included.
- Prohibited in this commit: runtime, test, generated, configuration,
  dependency, `CHANGELOG.md`, Calendar Slice 3, and Dependabot changes.
- Implementation proceeded only after this focused replan/state commit was
  complete. No runtime or test changes were included in that state commit.

## Web Harness Replan Gate

- Status: Complete after independent plan review `Ready` with no findings;
  focused replan/state commit `800612e4` is complete.
- Trigger: the previous Slice 7 approval assumed direct `webSmoke.ts` imports
  would execute in the web host, but the WebWorker fake `require` resolves
  `vscode` only and fails imported relative production dependencies.
- Approved exact delta: `package.json` (including the direct
  `test:web:run` bundle prerequisite), new
  `webpack.web-test.config.js`, new
  `src/test/suite/webSmokeWebEntry.ts`, `src/test/runWebTest.ts`, and the
  existing `src/test/suite/webSmoke.ts` scenario imports/orchestration.
- Boundary: test-only bundle and runner wiring; existing production
  `webpack.config.js` entries, extension behavior, and Slices 7-10 production
  scopes remain unchanged. No dependency or lockfile update is planned.
- Required gate: this delta has independent plan review `Ready`, Human
  Approval `Approved`, and focused replan/state commit `800612e4` complete;
  WEB-7 execution and Slice 7 implementation may continue. WEB-8 through
  WEB-10 remain later slices with their own completion gates.

## Completion Approval

- Status: Complete for Slices 6-7; Slice 7 Completion Approval is `Approved`
  under the user's standing automatic no-findings slice-approval instruction
  after independent implementation review `Ready` with no findings.
- Approved at: 2026-09-12
- Approved scope: the five revised production paths, three new focused test
  paths, the unchanged integration test as validation evidence, and this
  feature's `TASKS.md` and `TRACEABILITY.md`.
- Approved paths: `src/infrastructure/git/VscodeGitHeadContentProvider.ts`,
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`,
  `src/infrastructure/git/VscodeGitHeadApiResolution.ts`,
  `src/infrastructure/git/VscodeGitHeadPathGuards.ts`,
  `src/infrastructure/git/VscodeGitHeadObjectPipeline.ts`,
  `src/test/suite/vscodeGitHeadApiResolution.test.ts`,
  `src/test/suite/vscodeGitHeadPathGuards.test.ts`,
  `src/test/suite/vscodeGitHeadObjectPipeline.test.ts`, and the two evidence
  docs. `vscodeGitHeadDefinitionSourceAdapter.test.ts` is unchanged and
  remains integration validation only.
- Implementation review verdict: `Ready`; no findings
- Commit status: Complete; exact Slice 6 completion commit `3af9494d`

Each slice requires independent review and Completion Approval before its
exact implementation and evidence are committed.

## Slice 1 Implementation Evidence (2026-09-12)

- Approved boundary: Slice 1 exact production and test paths from the approved
  plan; no test expectation or public contract changed.
- Changed production files: `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  and `src/application/semantic-diff/compareSemanticDiff.ts`.
- Structural matching was decomposed into fingerprint grouping, group
  classification, and deterministic result sorting helpers. Fingerprint
  rename/move and relation change creation were decomposed into typed
  decision/target helpers. Exact/fingerprint/candidate precedence, identity
  decision IDs, relation pairs, and change ordering remain unchanged.
- Existing characterization tests were sufficient; no test file required a
  behavior or expectation update.
- Scoped `qlty check` and `qlty smells --no-snippets` over the six approved
  paths pass with zero issues. The pre-change slice baseline had three mapped
  smells: `matchFingerprintUnits`, `createFingerprintMatchChanges`, and
  `createRelationChanges`.
- Validation passed: `rtk pnpm run test:compile`; structural rules Mocha
  suite (20 passing); desktop preparation and `test:desktop:run` (exit 0);
  web preparation and `test:web:run` (exit 0); production `rtk pnpm run build`
  (exit 0, existing asset-size warnings); architecture dependency suite;
  package manifest suite (5 passing); `rtk pnpm run lint:md`; and
  `rtk git diff --check`.
- `qlty smells --no-snippets --upstream origin/main` still reports findings
  assigned to later approved slices only; the Slice 1 explicit-path check is
  clean. No Qlty suppression, ignore, baseline, threshold, configuration,
  dependency, generated, or architecture change was made.
- Compatibility and production readiness: domain/application layers remain
  host-neutral and browser-safe; no parser, VS Code API, desktop/web entry
  point, telemetry, JSON/report contract, or JP1/AJS meaning changed. The
  existing large, duplicate, malformed, reordered, rename/move, relation, and
  `sample1_large_utf8` characterization coverage remains active.
- Traceability: the Slice 1 structural identity row and validation evidence
  are updated in `TRACEABILITY.md`.
- Independent implementation review: `Ready`; Findings none.
- Completion Approval: approved on 2026-09-12 under the user's automatic
  no-findings approval instruction. Completion commit `fa933763` is complete.

## Slice 2 Completion Evidence (2026-09-12)

- Status: Complete; independent implementation review `Ready` with no
  findings; Completion Approval `Approved` on 2026-09-12 under the user's
  automatic no-findings slice approval policy; completion commit `ecea8714`.
- Approved production paths: `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`, and
  `src/application/semantic-diff/compareScheduleDiff.ts`.
- Approved test paths: `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`, and
  `src/test/suite/semanticDiffScheduleImpact.test.ts`; they were unchanged.
- Completion commit `ecea8714` is complete; this state synchronization does not
  stage or commit files. Dependabot documents remain outside the slice.

## Slice 3 Completion Evidence (2026-09-12)

- Status: Complete; focused state commit `d3e895e7`; implementation complete;
  independent implementation review `Ready` with no Findings; Completion
  Approval `Approved` on 2026-09-12; completion commit `6441de1e`.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and the user's automatic no-findings slice approval instruction.
- Approved production path: `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Approved test paths: `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`, and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`.
- Approved evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Approved boundary: refactor the schedule-impact indexing, issue, and root
  assembly paths through `createRootStatuses`; run matching, timeline, and
  final assembly remain out of scope.
- State commit gate: complete; focused state commit `d3e895e7`; completion
  commit `6441de1e` is complete. No runtime, test, configuration, generated,
  dependency, `CHANGELOG.md`, Calendar Slice 3, or Dependabot change was
  included in those commits.

## Slice 3 Implementation Evidence (2026-09-12)

- Status: implementation complete; independent implementation review `Ready`
  with no Findings; Completion Approval `Approved` on 2026-09-12 under the
  user's automatic no-findings slice approval policy.
- Approved production path changed:
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Approved test paths were unchanged because the existing characterization
  suites cover IDs, candidate ordering, issue details and ownership, root
  correspondence and scope transitions, no-run outcomes, and deep freezing.
- Implementation: split the identity index and source-key projection into
  private typed helpers; shared the before/after candidate mapping and
  root-side construction; separated schedule-issue sorting, exclusion,
  metadata, occurrence, and object construction; and shared root issue and
  root ID map construction. Encoded IDs, ordering, side-specific fields,
  issue details, scope transitions, no-run flags, and immutable outputs remain
  unchanged.
- Validation evidence: `rtk pnpm run test:compile`, the three approved
  focused suites (51 passing), `rtk pnpm exec eslint
src/application/semantic-diff/semanticDiffScheduleImpact.ts`, and
  `rtk git diff --check` passed. Scoped `rtk qlty check` returned `No issues`.
  Slice 3-owned Qlty smell findings are clear; the whole-file smell inventory
  remains non-empty with residual findings outside this boundary. The current
  residual inventory is `scheduleRunsBySide`, `outcomeFor`, `matchRuns`,
  `sourceChangeRefForTimelineItem`, `attachSourceChangeReferences`,
  `validateSourceChangeReferences`, `createRoots`, `evaluatedFacts`,
  `buildSemanticDiffScheduleImpact`, and `makeInput`/`rootIdForPath` within
  the later root assembly, plus shared utility complexity in `compareOrdinal`,
  `encodeSemanticDiffScheduleImpactId`, `rootUnits`, `visit`, `cloneDetail`,
  and the two existing complex binary expressions in detail lookup and
  timeline sorting. These residuals are retained for later approved slices.
  The desktop test run passed with exit code 0; the final Web smoke run passed
  with exit code 0 under host permissions. Production build and Markdown lint
  passed; the build retained existing bundle-size warnings.
- Compatibility and production readiness: application ownership and
  host-neutral/browser-safe dependencies are unchanged; no parser, VS Code
  API, public DTO/schema, schedule meaning, telemetry, desktop/web entry
  point, or Dependabot/Calendar Slice 3 scope changed. Existing malformed,
  duplicate, no-run, nested, and large-input characterization paths remain
  covered.
- Implementation feedback: nested before/after side mapping is a reusable
  private boundary for future application refactors; retaining the original
  global unsupported-decision sort before side partitioning preserves
  occurrence ordinals and deterministic IDs.
- Unresolved risks: no behavior or scope risk was found in the completed
  validation.

## Slice 4 Activation And Approval (2026-09-12)

- Status: Human Approved; active next slice, pending focused state commit.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and the user's automatic no-findings slice approval instruction.
- Approved production path: `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Approved test paths: `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffPresentationArtifacts.test.ts`, and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`.
- Approved evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Approved boundary: simplify `matchRuns`, timeline/source-reference
  attachment and validation, `createRoots`, `evaluatedFacts`, and final
  assembly. Acceptance retains exact match kinds, ordinals, timeline order,
  source references, validation errors, frozen output, and facts, with zero
  remaining mapped smell in this file.
- State commit gate: eligible; pending `approval-committer`. No runtime, test,
  configuration, generated, dependency, `CHANGELOG.md`, Calendar Slice 3, or
  Dependabot change is included in that state commit.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Intake Inventory

Remote PR evidence for commit `57c2a8fa`:

- `qlty check`: failed with 99 blocking issues.
- `qlty fmt`: failed for `CHANGELOG.md:334`.
- GitHub Verify, Analyze, and CodeQL checks passed.

The local `qlty smells --no-snippets` inventory analyzed 28 branch-diff files
and assigned findings to these 18 originally inventoried production files. The
Slice 6 replan adds three private infrastructure helper paths below solely to
remove the discovered adapter file-complexity smell; they are not new Qlty
inventory surfaces or a change to any other slice's boundary.

<!-- markdownlint-disable MD013 -->

| Surface                  | Flagged files                                                                                                                                      | Finding classes                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Comparison and artifacts | `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`, `compareScheduleDiff.ts`, `compareSemanticDiff.ts`                      | high complexity, many returns                                                    |
| Schedule-impact model    | `src/application/semantic-diff/semanticDiffScheduleImpact.ts`                                                                                      | high/total complexity, many returns/parameters, boolean expressions, duplication |
| Domain rules             | `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`, `semanticDiffScheduleRules.ts`, `semanticDiffStructuralRules.ts`                | high complexity, boolean expressions                                             |
| Bootstrap                | `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`                                                                                    | high complexity                                                                  |
| Git infrastructure       | `src/infrastructure/git/VscodeGitHeadContentProvider.ts`, `VscodeGitHeadDefinitionSourceAdapter.ts`                                                | high/total complexity, many returns/parameters, boolean expressions              |
| Report                   | `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`                                                                               | high/total complexity                                                            |
| Command                  | `src/presentation/vscode/commands/semanticDiffCommand.ts`, `semanticDiffCommandLocalization.ts`, `semanticDiffCommandSteps.ts`                     | high/total complexity, many returns/parameters, duplication                      |
| Calendar host            | `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`, `scheduleImpactCalendarSessionRegistry.ts`, `scheduleImpactCalendarTransport.ts` | high/total complexity, many returns/parameters, boolean expressions              |
| Calendar bridge          | `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`                                                                                  | high complexity, many returns                                                    |
| Markdown                 | `CHANGELOG.md:334`                                                                                                                                 | formatting-only wrap                                                             |

<!-- markdownlint-enable MD013 -->

## Planning Decisions

- The 18 inventoried production files were the original production edit
  boundary. Slice 6 is now explicitly replanned to add only the three listed
  private Git infrastructure seams; any other new production file or path is a
  replan trigger.
- Private helpers stay in the file and architecture layer that owns the
  decision. No metric-only layer, policy object, or public abstraction is
  planned.
- `semanticDiffScheduleImpact.ts` and `semanticDiffCommand.ts` each use two
  sequential slices because one review boundary would be too broad. Each
  first slice must leave a compiling, complete implementation.
- Existing tests are characterization authority. Listed test paths may change
  only to cover an unobserved branch; expected meaning must not change.
- Per-slice Qlty evidence requires zero findings in the functions owned by the
  slice and no new finding in its diff. Findings assigned to later slices may
  remain until their turn; complete `rtk pnpm run qlty` must pass after Slice 10.
- The duplication between `semanticDiffCommand.ts:116` and
  `FlowContents.tsx` is removed from the command side with a command-owned
  private error-code type or local reshaping. `FlowContents.tsx` is untouched.
- Schedule-impact before/after duplication is owned by application-local side
  mappers. Transport validators remain presentation-owned, and Git guards
  remain infrastructure-owned.
- The web gate remains host-specific: `package.json` routes `test:web` through
  `src/test/runWebTest.ts`, but direct `webSmoke.ts` imports cannot resolve
  relative production dependencies in the WebWorker fake-`require` host. The
  web-harness replan adds an isolated test-only bundle and makes only bundled
  WEB-7 through WEB-10 scenarios executable claims; it does not discover the
  desktop-focused suite or alter production webpack entries.
- A real Calendar Webview DOM and its in-panel JavaScript are not claimed by
  this gate. The current Calendar foundation has no public panel action, and
  Calendar Slice 3 remains out of scope. Web smoke covers browser-safe
  transport/bridge lifecycle and host-side session composition with controlled
  ports, targets, and in-memory handles. Concrete `WebviewPanel` DOM and
  in-panel script behavior remain an explicit host-boundary residual risk; the
  listed desktop session/wiring tests are the planned evidence for observable
  host composition.
- Parser, generated files, dependencies, Qlty configuration, architecture,
  README, use cases, public DTO/schema, production webpack entries, and
  behavior do not change. The replan's test-only webpack config and runner
  wiring are an explicitly approved configuration boundary, not production
  bundling.

## Implementation Slices

### Slice 1: Structural correspondence and comparison decomposition

- Status: Complete; independent review `Ready`; completion commit `fa933763`.
- Scope: simplify structural fingerprint matching and structural change
  creation while preserving deterministic identity, relation, and ordering.
- User / Domain Value: preserves the completed Semantic Diff and job-group
  identity behavior while making it mergeable.
- Cohesive Change Group: extract pure decision/append helpers from
  `matchFingerprintUnits`, `createFingerprintMatchChanges`, and
  `createRelationChanges`; keep exact/fingerprint/candidate precedence.
- Exact Production Paths:
  `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts` and
  `src/application/semantic-diff/compareSemanticDiff.ts`.
- Allowed Test Paths: `src/test/suite/semanticDiffStructuralRules.test.ts`,
  `src/test/suite/compareSemanticDiff.test.ts`,
  `src/test/suite/semanticDiffSampleCoverage.test.ts`, and
  `src/test/suite/semanticDiffJson.test.ts`.
- Acceptance: assigned functions clear thresholds; reordered definitions,
  `sample1_large_utf8` reflexivity, exact job-group identity, duplicate-path
  ambiguity, rename/move, relation pairs, IDs, and order are unchanged.
- Validation: listed suites through the desktop harness and scoped Qlty.
- Production Readiness: retain single-pass grouping and current sort keys;
  malformed or unsupported forms remain conservative.
- Approval Boundary: exact production and allowed test paths above, plus this
  feature's `TASKS.md` and `TRACEABILITY.md`.
- Dependencies: approved and committed plan only.
- Risks: changed match precedence, non-null assumptions, or ordering.
- Out of Scope: schedule evaluation and presentation/schema changes.

### Slice 2: Schedule evaluation and run-diff decomposition

- Status: Complete; Completion Approval approved; focused completion commit
  `ecea8714`.
- Scope: simplify supported/unsupported schedule decisions and canonical run
  comparison without changing JP1/AJS meaning.
- User / Domain Value: preserves calculated, unsupported, and uncalculated
  schedule differences.
- Cohesive Change Group: use a total typed unsupported-reason lookup or small
  helpers; extract grouping, sorting, and changed/added/removed projection
  from `addRuns`, `compareDecisions`, `compareScheduleRuns`, and
  `toScheduleRunChange`; keep `toUtcDate` and `unsupportedDecision` in domain.
- Exact Production Paths:
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`, and
  `src/application/semantic-diff/compareScheduleDiff.ts`.
- Allowed Test Paths: `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffSchedule.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`, and
  `src/test/suite/semanticDiffScheduleImpact.test.ts`.
- Acceptance: period bounds, run IDs, nullability, reasons, raw evidence,
  zero-runs, calendar results, and ordering are deep-equal compatible.
- Validation: listed schedule/artifact/impact suites and scoped Qlty.
- Production Readiness: no host calendar, locale, time zone, or extra
  period-wide scan; invalid and unsupported evidence remains explicit.
- Approval Boundary: exact production/tests plus feature evidence documents.
- Dependencies: Slice 1 committed.
- Risks: guard reordering could create a false supported no-run or alter run
  pairing; validation retained the existing ordering and guard characterization.
- Out of Scope: wider schedule support or period changes.
- Independent implementation review: `Ready`; no findings.
- Completion Approval: `Approved` on 2026-09-12 under the user's automatic
  no-findings slice approval policy.
- Exact completion scope: the three production paths above plus this feature's
  `TASKS.md` and `TRACEABILITY.md`; the four allowed test paths were unchanged.
- Completion commit: `ecea8714`; completion is committed and this agent did not
  stage or commit it.

### Slice 3: Schedule-impact indexing, issues, and root assembly

- Status: Complete; focused state commit `d3e895e7` and completion commit
  `6441de1e` complete; independent implementation review `Ready` with no
  Findings; Completion Approval `Approved` on 2026-09-12.
- Scope: simplify identity indexing, candidates, run/issue indexing,
  root-side construction, and root maps through `createRootStatuses`.
- User / Domain Value: retains the same calendar sidecar roots and issues.
- Cohesive Change Group: introduce private input contexts; extract shared
  before/after candidate and `sideRoot` builders for both duplication groups;
  split sort/predicate chains; decompose `createSourceKeyForRun`,
  `candidateGroups`, `scheduleIssues`, `makeRoot`, `rootIssueMaps`, and
  `rootIdMaps` without exported-type changes.
- Exact Production Path:
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Allowed Test Paths: `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`, and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`.
- Acceptance: encoded IDs, candidate order, issue detail, root
  correspondence, scope transitions, no-run flags, and deep freeze remain
  unchanged; findings through `createRootStatuses` and both duplicates clear.
- Validation: listed impact/calendar/artifact suites, fixture equality, and
  scoped Qlty.
- Production Readiness: reuse current maps; no retained document copy or new
  recursion.
- Approval Boundary: exact file/tests plus evidence documents. Later
  functions may change only where a private signature must compile.
- Dependencies: Slice 2 committed.
- Risks: side helpers could erase side-specific IDs, nulls, or ordinals.
- Out of Scope: run matching, timeline, source references, final assembly.
- Independent implementation review: `Ready`; no Findings.
- Completion Approval: `Approved` on 2026-09-12 under the user's automatic
  no-findings slice approval policy.
- Exact completion scope: the runtime path, three allowed test paths above
  (unchanged), and this feature's `TASKS.md` and `TRACEABILITY.md`.
- Qlty result: Slice 3-owned findings are clear; residual whole-file findings
  in later-boundary functions and shared utility complexity remain assigned to
  later approved slices and are not claimed as Slice 3 success.
- Completion commit: `6441de1e`; completion is committed and this state
  synchronization did not stage or commit it.

### Slice 4: Schedule-impact matching, timeline, and final assembly

- Status: Complete; independent implementation review `Ready` with no
  findings; Completion Approval `Approved` on 2026-09-12; focused completion
  commit `e89e6cab`.
- Scope: simplify `matchRuns` through the exported sidecar/fact builders.
- User / Domain Value: preserves the final calendar sidecar and references.
- Cohesive Change Group: extract match classification/append helpers; use
  typed root inputs; split `sourceChangeRefForTimelineItem`, attachment and
  validation, `createRoots`, `evaluatedFacts`, and final assembly into pure
  phases in the same file.
- Exact Production Path:
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Allowed Test Paths: `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffPresentationArtifacts.test.ts`, and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`.
- Acceptance: match kinds, ordinals, timeline order, source references,
  validation errors, frozen output, and facts retain exact outcomes; this file
  has no remaining mapped smell.
- Validation: full impact tests including large, duplicate, malformed,
  unsupported, removed-run, and invalid-reference cases; scoped Qlty.
- Production Readiness: keep map-based matching and defensive validation; no
  preventable quadratic scan.
- Approval Boundary: exact file/tests plus evidence documents.
- Dependencies: Slice 3 committed.
- Risks: changed winning source reference, throw timing, or stable ordering.
- Out of Scope: report, JSON schema, and calendar transport.

#### Slice 4 Implementation Evidence (2026-09-12)

- Approved production path changed:
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Approved test paths were unchanged; the full Desktop suite covers the four
  approved impact, calendar, presentation-artifact, and artifact-comparison
  suites.
- Implementation: decomposed run classification/append, source-reference
  lookup, timeline attachment and defensive validation, root creation,
  evaluated facts, and final assembly into private pure phases. Existing
  Slice 3 helpers, map-based validation, and all public exports remain in
  place.
- Review-fix: corrected source-change owner conflict polarity to throw only
  when a reference is already owned by a different effect, restored lazy
  comparator evaluation, and restored run-present outcome precedence.
- Behavior evidence: match kinds and ordinals, timeline order, winning source
  references, validation errors, deep-frozen output, and schedule facts remain
  characterized without expectation changes. Invalid target IDs remain
  limited to jobnet/unit targets.
- Qlty evidence: scoped `qlty smells --no-snippets` and `qlty check` pass with
  zero issues. No suppression, ignore, baseline, threshold, configuration,
  dependency, or architecture exception was added.
- Validation evidence: direct Mocha counts are impact 11/11, calendar 30/30,
  presentation artifacts 2/2, and comparison artifacts 10/10 (53/53 total).
  Test compile, target ESLint, full Desktop runner, Web smoke after Web
  preparation, production build, Markdown lint, and `git diff --check` pass.
  The production build retains its existing bundle-size warnings; host
  runners also retain their existing Electron/stream diagnostic logs while
  exiting successfully.
- Large-input evidence: the targeted `sample1_large_utf8` self-comparison
  passes 1/1 with `changes=0`, `identityDecisions=868`, and
  `exactJobGroups=48`. The unapproved sample category-coverage test is not
  claimed as Slice 4 acceptance; its existing `end-control` category
  assertion remains outside this slice.
- Compatibility and readiness: no DTO/schema, parser, VS Code API,
  desktop/web entry point, telemetry, calendar transport, or JP1/AJS schedule
  meaning changed. The implementation is ready for independent review.
- Review route: independent implementation review completed with `Ready`; the
  exact completion scope is now routed to `approval-committer`. This
  implementation did not stage or commit.
- Review result: independent `implementation-reviewer` returned `Ready` with
  no findings. Completion Approval is `Approved` on 2026-09-12 under the
  user's automatic no-findings slice approval policy.
- Exact completion scope: `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  this feature's `TASKS.md`, and this feature's `TRACEABILITY.md`. The four
  approved test paths remain unchanged and are validation evidence only.
- Completion commit: `e89e6cab`; completion is committed and this state
  synchronization did not stage or commit. No Slice 4 blocker is known; the
  unapproved sample category assertion remains a separate follow-up, and
  inherited Dependabot documentation edits are preserved outside this slice.

## Slice 5 Completion Evidence (2026-09-12)

- Status: Complete; focused state commit `4f3119d7`; independent implementation
  review `Ready` with no findings; Completion Approval `Approved` on 2026-09-12
  under the user's automatic no-findings slice approval policy; completion
  commit `a69fcd12`.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and the user's automatic no-findings slice approval instruction.
- Approved production paths: `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  and `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`.
- Approved documentation path: the reported `CHANGELOG.md` sentence wrapping
  only; release-note wording remains unchanged.
- Approved test paths:
  `src/test/suite/buildSemanticDiffPresentationArtifactsAdapter.test.ts`,
  `src/test/suite/semanticDiffPresentationArtifacts.test.ts`,
  `src/test/suite/renderSemanticDiffMarkdown.test.ts`,
  `src/test/suite/semanticDiffMarkdownProjections.test.ts`,
  `src/test/suite/buildSemanticDiffReportData.test.ts`, and
  `src/test/suite/semanticDiffJson.test.ts`.
- Approved evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Approved boundary: preserve parse errors/count, period omission, sidecar
  availability, localized text/order/escape, report and JSON facts, and exact
  release-note wording while clearing the assigned presentation findings.
- State commit gate: complete; focused state commit `4f3119d7`; completion
  commit `a69fcd12` is complete. No other runtime, test, configuration,
  generated, dependency, Calendar Slice 3, or Dependabot change was included
  in those commits.

### Slice 5: Presentation artifacts, report rendering, and format repair

- Status: Complete; focused state commit `4f3119d7` and completion commit
  `a69fcd12` complete; independent review `Ready`; Completion Approval
  `Approved` on 2026-09-12.
- Scope: simplify artifact construction and Markdown localization and wrap
  only the reported `CHANGELOG.md` sentence.
- User / Domain Value: preserves Summary/Full/Audit output and parse failures
  while making formatting compliant.
- Cohesive Change Group: split parse-result and optional-period handling from
  `createBuildSemanticDiffPresentationArtifacts`; extract target-side,
  identity, schedule-summary, and line assembly helpers from
  `renderChangeDetails`, `renderAttributeChanges`, and
  `renderScheduleRunChange`; wrap the 1.1.0 sentence without wording change.
- Exact Production And Documentation Paths:
  `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`,
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`, and
  `CHANGELOG.md`.
- Allowed Test Paths:
  `src/test/suite/buildSemanticDiffPresentationArtifactsAdapter.test.ts`,
  `src/test/suite/semanticDiffPresentationArtifacts.test.ts`,
  `src/test/suite/renderSemanticDiffMarkdown.test.ts`,
  `src/test/suite/semanticDiffMarkdownProjections.test.ts`,
  `src/test/suite/buildSemanticDiffReportData.test.ts`, and
  `src/test/suite/semanticDiffJson.test.ts`.
- Acceptance: parse errors/count, period omission, sidecar availability,
  localized text/order/escape, report and JSON facts remain unchanged;
  formatting passes with identical release-note wording.
- Validation: listed artifact/report/JSON tests, exact-string output,
  `rtk pnpm run lint:md`, Qlty format and scoped smells.
- Production Readiness: no comparison rerun or retained result copy; English
  and Japanese omission/fallback rules remain exact.
- Approval Boundary: exact files/tests plus feature evidence documents.
- Dependencies: Slice 4 committed.
- Risks: blank lines, escaping, localization fallback, parse precedence, or
  JSON omission could change.
- Out of Scope: new release content, locale, or schema version.

### Slice 5 Implementation Evidence (2026-09-12)

- Status: implementation complete; independent implementation review `Ready`
  with no findings; Completion Approval `Approved` on 2026-09-12 under the
  user's automatic no-findings slice approval policy; completion commit
  `a69fcd12` is complete.
- Exact implementation scope: the two approved production paths,
  `CHANGELOG.md` sentence wrapping, and this feature's evidence documents.
- Artifact construction now separates source parsing, parser-error projection,
  period-aware comparison input construction, and comparison-result artifact
  assembly. Each source is still parsed exactly once, parse-error side/count
  precedence is unchanged, and schedule sidecars are still built only from
  supplied evaluated facts.
- Markdown localization now uses dedicated target-side, identity-evidence,
  attribute-category, schedule-summary, and schedule-side renderers. Existing
  English/Japanese text, fallback selection, Markdown escaping, ordering,
  omission, report facts, and JSON inputs remain unchanged.
- The only CHANGELOG edit wraps the existing 1.1.0 sentence at the reported
  formatting boundary; its wording is unchanged.
- Scoped Qlty `smells --no-snippets` and `check` over both approved production
  files report zero issues. No suppression, ignore, baseline, threshold,
  configuration, dependency, or architecture exception was added.
- Validation passed: `rtk pnpm run test:compile`, target ESLint, scoped Qlty,
  `rtk pnpm run lint:md`, `rtk git diff --check`, production build, desktop
  test runner, and web test runner. The production build retains the existing
  bundle-size warnings, and the web runner retains its existing Chromium
  `EPIPE`/premature-close diagnostics while exiting successfully.
- The six approved focused files ran through direct TDD Mocha with
  `42 passing` and `3 failing`, exactly matching the pre-Slice-5 HEAD
  baseline. The current and baseline outputs also have byte parity (the
  populated Full Markdown snapshot is 3610 bytes in both runs, while the
  existing expectation is 3617), and the three failures reproduce against
  the pre-Slice-5 HEAD implementation and are retained as baseline findings:
  the job-group exact-key Markdown assertion, the typed schedule-removal
  audit substring assertion, and the populated Full Markdown byte snapshot.
  No changed Slice 5 path introduced a new focused failure in the direct
  baseline comparison.
- Compatibility evidence: no public DTO/schema, parser, comparison meaning,
  schedule facts, VS Code API, desktop/web entry point, telemetry, or
  Dependabot/Calendar Slice 3 scope changed. No README, durable specification,
  or new release content was added.
- Production readiness: completion commit `a69fcd12` is complete, with the three
  pre-existing focused baseline failures explicitly unresolved and outside the
  approved behavior-preserving refactor.

## Slice 6 Prior Approval Superseded (2026-09-12)

- Status: Superseded by Replanning; no active implementation approval.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and the user's automatic no-findings slice approval instruction.
- Prior approved production paths: `src/infrastructure/git/VscodeGitHeadContentProvider.ts`
  and `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`.
- Prior approved test path:
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`.
- Approved evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Prior approved validation boundary: complete adapter/provider suite on
  desktop; Slice 6 web validation is limited to the final production build and
  baseline `webSmoke.ts`, with no Git adapter/provider execution claim. WEB-7
  through WEB-10 are future Slice 7-10 scenarios and were not executed here.
- State commit gate: superseded and not eligible. No runtime, test,
  configuration, generated, dependency, `CHANGELOG.md`, Calendar Slice 3, or
  Dependabot change is included in the preserved partial diff.

## Slice 6 Replanning (2026-09-12)

- Trigger: the existing Git two-file implementation completed compile, build,
  desktop, web, lint, diff, and scoped checks; function-level Qlty smells are
  zero, but whole-file complexity remains 98 for
  `VscodeGitHeadDefinitionSourceAdapter.ts` against the repository threshold
  of 55. The approved two-file boundary cannot remove that genuine
  infrastructure responsibility without a new module seam.
- Replan decision: keep the current partial Git diff and split the smallest
  cohesive private infrastructure responsibilities into API/context
  resolution, path/rename guards, and object/content reading. No Qlty
  suppression, ignore, threshold relaxation, baseline manipulation, or
  acceptance exception is permitted.
- Revised exact production paths:
  - `src/infrastructure/git/VscodeGitHeadContentProvider.ts`
  - `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`
  - `src/infrastructure/git/VscodeGitHeadApiResolution.ts`
  - `src/infrastructure/git/VscodeGitHeadPathGuards.ts`
  - `src/infrastructure/git/VscodeGitHeadObjectPipeline.ts`
- Proposed seam ownership:
  - `VscodeGitHeadApiResolution.ts`: Git extension/API discovery, activation
    and enabled-state guards, repository and document-URI resolution, HEAD
    and read-capability context construction.
  - `VscodeGitHeadPathGuards.ts`: normalized file/root URI checks, traversal
    and path-prefix guards, active rename status selection, and unambiguous
    candidate construction.
  - `VscodeGitHeadObjectPipeline.ts`: object mode/type and MIME/encoding
    guards, binary/NUL/decoded-byte validation, and source-content read failure
    classification.
    These are infrastructure-internal exports for focused tests only; they are
    not re-exported through the application port or public package API.
- Compatibility boundary: retain the same infrastructure layer and concrete
  composition construction, adapter class/factory and provider public APIs,
  receiver semantics, guard precedence, captured HEAD, path/rename policy,
  object/content failure reasons, byte limits, cache lifetime, and idempotent
  release behavior. No Git executable, filesystem, `.git`, or Node built-in
  access may be introduced. Calendar Slice 3 and Dependabot work remain out
  of scope.
- Revised exact test paths:
  - `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`
  - `src/test/suite/vscodeGitHeadApiResolution.test.ts`
  - `src/test/suite/vscodeGitHeadPathGuards.test.ts`
  - `src/test/suite/vscodeGitHeadObjectPipeline.test.ts`
- Focused test responsibilities: API/repository/context unavailable and
  activation cases; URI/root/traversal and rename candidate policy; object,
  MIME/encoding, binary/NUL, read-failure, and decoded-byte-limit guards; and
  the existing adapter/provider integration coverage for receiver semantics,
  guard precedence, captured HEAD, cache bounds, and idempotent release.
- Validation: compile; all four listed desktop test files; targeted ESLint;
  scoped Qlty `fmt`, `check`, and `smells --no-snippets`; `lint:md`; and
  `git diff --check`. Run the complete desktop adapter/provider suite and
  production build. Run `rtk pnpm run test:web` only as the baseline
  `src/test/suite/webSmoke.ts` plus production web-build check. WEB-7 through
  WEB-10 are future Slice 7-10 scenarios and were not executed for Slice 6;
  no Git adapter/provider web execution is claimed. Whole-file Qlty must
  clear the mapped smell, including reducing the adapter complexity to at
  most 55, without a threshold or acceptance exception.
- Approval boundary delta: the prior two-production-file/one-test approval is
  superseded. The revised boundary is the five exact production paths, four
  exact test paths, and this feature's `TASKS.md` and `TRACEABILITY.md`; the
  already-committed `SPECS.md` remains unchanged. Independent plan review is
  `Ready` and the revised Human Approval is `Approved`; focused replan/state
  commit `2734813c` is complete.
- Validation and evidence must preserve the current partial Git diff and the
  unrelated dirty Dependabot documents; no code, test, configuration,
  generated, dependency, `CHANGELOG.md`, or other feature scope is authorized
  by this replan document alone.

### Slice 6: Git HEAD source and snapshot cache decomposition

- Status: Replanned; implementation complete; independent plan review Ready and
  revised Human Approval Approved; focused replan/state commit `2734813c`
  complete; implementation review pending.
- Scope: simplify optional Git API discovery, rename/path selection, object
  validation, source reading, and cache lifetime.
- User / Domain Value: preserves reliable immutable `HEAD` comparison on
  desktop and web.
- Cohesive Change Group: retain the current behavior-preserving adapter/provider
  refactor, then extract the three private infrastructure seams for API/context
  resolution, path/rename guards, and object/content pipeline. Keep
  `sourcePathFor`, `resolveApiOnce`, `inspectPath`, and `readSelectedPath`
  ordered by capability/repository/path/content phases; extract reserve
  eviction/release without exposing cache state.
- Exact Production Paths:
  `src/infrastructure/git/VscodeGitHeadContentProvider.ts`,
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`,
  `src/infrastructure/git/VscodeGitHeadApiResolution.ts`,
  `src/infrastructure/git/VscodeGitHeadPathGuards.ts`, and
  `src/infrastructure/git/VscodeGitHeadObjectPipeline.ts`.
- Allowed Test Paths:
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`,
  `src/test/suite/vscodeGitHeadApiResolution.test.ts`,
  `src/test/suite/vscodeGitHeadPathGuards.test.ts`, and
  `src/test/suite/vscodeGitHeadObjectPipeline.test.ts`.
- Acceptance: captured HEAD, active path first, unambiguous rename only,
  decoded/textconv content, unavailable reasons, binary/size rejection, cache
  bound, URI lookup, and idempotent release are unchanged.
- Validation: compile, the four listed tests, targeted ESLint, scoped Qlty
  format/check/smells, `lint:md`, and `git diff --check`; complete
  adapter/provider suite and production build on desktop; baseline
  `webSmoke.ts` plus production web-build check only. WEB-7 through WEB-10
  are future Slice 7-10 scenarios and were not executed for Slice 6, with no
  Git adapter/provider web execution claim. Whole-file complexity must be at
  most 55 with no suppression or acceptance exception.
- Production Readiness: no Git executable, filesystem, `.git`, or Node
  built-in access; release large cached content on existing paths.
- Approval Boundary: revised five production paths, four test paths, and
  evidence documents; the prior two-file approval is superseded and the
  revised replan boundary is approved.
- Dependencies: Slice 5 committed; revised Slice 6 plan independently
  reviewed and Human Approved; focused replan/state commit `2734813c` complete.
- Risks: moving types or imports across private infrastructure seams could
  change guard precedence or misclassify untracked, binary, unavailable,
  rename, or oversized content; direct helper tests must not become public API.
- Out of Scope: index/working-tree fallback or telemetry.

## Slice 6 Prior Implementation Handoff (superseded, 2026-09-12)

- Status: Partial implementation evidence preserved; no completion approval or
  implementation commit has been made. The prior two-file approval cannot
  continue unchanged because of the remaining whole-file complexity smell.
- Existing uncommitted production changes remain limited to the two originally
  approved Git infrastructure paths. The three helper modules and three new
  helper tests are proposed replan paths, not implemented by this handoff. The
  inherited Dependabot document changes remain untouched and excluded.
- Behavior evidence: the adapter keeps one captured HEAD commit, checks the
  active path before the unambiguous rename fallback, preserves object/text
  and decoded-byte guards, and keeps snapshot release idempotent. The approved
  test file contains 13 adapter/provider tests; the complete desktop runner
  exited 0.
- Validation evidence: `rtk pnpm run test:compile`, production `rtk pnpm run
build`, baseline `rtk pnpm run test:web` (exit 0), desktop `node
./out/test/runTest.js` (exit 0), `rtk qlty check` for both production paths,
  and `rtk git diff --check` passed. Production builds retain existing bundle
  size warnings; Slice 6 web evidence is limited to the production web build
  and baseline `webSmoke.ts`. WEB-7 through WEB-10 are future Slice 7-10
  evidence and were not executed; no Git adapter/provider web execution is
  claimed.
- Qlty evidence: individual function, formatting, and lint findings are
  clear, but `qlty smells --no-snippets` reports file complexity 98 for
  `VscodeGitHeadDefinitionSourceAdapter.ts` against the repository threshold
  of 55. The approved exact production-path boundary did not include a new
  helper module, so reducing this remaining file-level smell requires the
  revised planning/re-approval decision recorded above rather than a silent
  scope expansion.
- Compatibility and production readiness: no Git executable, filesystem,
  `.git`, Node built-in, parser, public DTO, telemetry, VS Code API, or
  desktop/web entry-point change was introduced. No README, CHANGELOG, or
  durable specification update is required for this behavior-preserving
  refactor.
- Recommended route: delegate the eligible focused replan/state commit for the
  approved five-file/four-test boundary; only after it completes may
  implementation resume and later independent implementation review proceed.

## Slice 7 Prior Activation And Approval Superseded (2026-09-12)

- Status: Superseded by the Slices 7-10 web-harness replan; no active
  implementation approval.
- Basis: Slice 6 completion commit `3af9494d`, the approved ten-slice plan,
  independent plan review `Ready` with no findings, and the user's automatic
  no-findings slice approval policy.
- Approved production paths: `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`, and
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`.
- Approved test paths: `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`,
  `src/test/suite/semanticDiffSourceCapture.test.ts`,
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`, and
  `src/test/suite/webSmoke.ts` (WEB-7).
- Approved boundary: simplify source acquisition, period selection, prepared
  before/after reads, and Git failure localization while preserving one-read,
  cancellation, error code/reason/retryability, source bytes, and captured
  HEAD behavior. Artifact/Explorer finalization is out of scope except for
  private signature changes required for compilation.
- Web validation: `rtk pnpm run test:web` scenario WEB-7 only, covering
  activation/registration and the injected no-active-editor command-core
  guard; interactive pickers and file/Git dialogs remain desktop evidence.
- Evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md` only. The
  prior state-commit gate is superseded; no runtime, test, configuration,
  generated, dependency, `CHANGELOG.md`, Calendar Slice 3, or Dependabot
  change is included in the preserved partial production diff.

### Slice 7: Command source acquisition and selection workflow

- Status: Replanned and Human Approved; Slice 7 implementation complete;
  focused replan/state commit `800612e4` complete.
- Scope: simplify active capture through source/period selection and prepared
  before/after source, including Git failure localization.
- User / Domain Value: preserves cancellation and source-selection behavior.
- Cohesive Change Group: add command-private contexts/result-code aliases;
  decompose `sourceTextFailure`, `parseFailureMessage`,
  `readWorkflowAfterSnapshot`, selection, before/file/Git reads, and
  `prepareWorkflowSource`; remove the reported duplicated error union from the
  command side; make Git localization total; reduce `failedStep` parameters.
- Exact Production Paths:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`, and
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`.
- Allowed Test Paths: `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`,
  `src/test/suite/semanticDiffSourceCapture.test.ts`, and
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`, plus
  `src/test/suite/webSmoke.ts`.
- Acceptance: active editor read once; cancellation creates no partial
  session; errors retain code/reason/retryability/localization; source bytes
  and HEAD remain exact; first-phase findings clear.
- Validation: listed command/source/Git tests on desktop; after the approved
  test-only bundle preparation, `rtk pnpm run test:web` must load
  `out/test/suite/webSmoke.bundle.js` and execute WEB-7 from
  `src/test/suite/webSmoke.ts`; a bundle/import failure is a gate failure, not
  a skipped success. WEB-7 asserts activation and command registration, then
  invokes the command core with an injected no-active-editor dependency to
  preserve the source-acquisition failure and confirm no read, report, or
  partial session is created.
- Production Readiness: telemetry receives no content/path/ref/exception;
  size/non-text rejection precedes parse; Git stays optional.
- Approval Boundary: revised exact command, harness/config, runner, and test
  paths recorded in the web-harness replan; the prior Slice 7 approval is
  superseded. Later command functions may change only for compiling private
  signatures.
- Dependencies: Slice 6 completion commit `3af9494d` committed; the
  Slices 7-10 web-harness replan is independently reviewed and approved; its
  focused replan/state commit `800612e4` is complete.
- Risks: extra prompt/read, changed cancellation, or error classification.
- Out of Scope: artifact/Explorer phase and `FlowContents.tsx`.

### Slice 8: Command artifact, Explorer, and finalization workflow

- Status: Human Approved; active next slice, pending focused state commit.
- Scope: simplify artifact building, source binding, Explorer/report opening,
  compatibility flow, and final result handling.
- User / Domain Value: preserves one successful read-only Explorer session and
  explicit output actions.
- Cohesive Change Group: use private context objects for `workflowFailure` and
  `buildWorkflowArtifacts`; extract typed continuations from artifact/open,
  file workflow, Explorer context/open, and final execute functions; retain
  rollback/release and telemetry at the command boundary.
- Exact Production Path:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`.
- Allowed Test Paths: `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/semanticDiffFlowHighlights.test.ts`, and
  `src/test/suite/semanticDiffWiring.test.ts`, plus
  `src/test/suite/webSmoke.ts`.
- Acceptance: comparison/open counts, binding/rollback, Explorer default,
  copy/save, Flow focus/highlights, sidecar context, result codes, and
  telemetry outcomes are unchanged; command file has no mapped smell.
- Validation: listed command/Explorer/Flow/wiring tests on desktop; web
  `rtk pnpm run test:web` smoke scenario `WEB-8` in `webSmoke.ts`; scoped
  Qlty. `WEB-8` runs the command core with deterministic in-memory source,
  artifact, report/open, and Explorer/session doubles, asserting one successful
  finalization and one cleanup path without relying on interactive Quick Pick,
  file-dialog, or Webview DOM automation.
- Production Readiness: all failures release resources; cancellation opens
  nothing; no VS Code API newer than `^1.75.0`.
- Approval Boundary: exact production, test, web-harness scenario, and
  evidence paths listed above; no new module path, public contract, or
  production configuration is included.
- Dependencies: Slice 7 completion commit `b0095565` and the committed
  test-only web-harness replan `800612e4`.
- Risks: double disposal, source leak, duplicate telemetry, or false success.
- Out of Scope: UI files and public commands/actions/DTOs.

### Slice 9: Calendar transport validation and webview bridge

- Status: Proposed.
- Scope: simplify strict message validation/serialization and the webview
  request-response bridge without relaxing protocol behavior.
- User / Domain Value: preserves rejection of malformed, stale,
  cross-session, and oversized messages.
- Cohesive Change Group: decompose `isJsonValue`, request/error/host validators
  into envelope, field, options, and size predicates with one typed result
  builder; extract bridge send, acceptance, listener, and disposal operations
  while keeping state in its closure.
- Exact Production Paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts` and
  `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`.
- Allowed Test Paths:
  `src/test/suite/scheduleImpactCalendarTransport.test.ts` and new narrow
  `src/test/suite/scheduleImpactCalendarBridge.test.ts`, because the bridge
  lacks direct lifecycle characterization, plus `src/test/suite/webSmoke.ts`.
- Acceptance: branded IDs, monotonicity, session matching, stale detection,
  error details, JSON rules, byte cap, request numbering, notifications, and
  idempotent disposal remain exact.
- Validation: exhaustive transport tests and direct bridge lifecycle tests on
  desktop; web `rtk pnpm run test:web` smoke scenario `WEB-9` in `webSmoke.ts`;
  scoped Qlty. `WEB-9` uses a controlled post-message port and event target to
  assert ready/refresh numbering, accepted session/failure delivery,
  malformed/cross-session/stale rejection, listener removal, and post-dispose
  suppression. It does not claim execution inside a real Calendar Webview.
- Production Readiness: retain payload limit and input distrust; no Node
  dependency or unbounded new traversal.
- Approval Boundary: exact files/tests plus evidence documents.
- Dependencies: Slice 8 committed.
- Risks: changed error precedence among invalid, unknown, stale, and too-large.
- Out of Scope: message types and Calendar Slice 3 UI.

### Slice 10: Calendar host sessions, panel, and bootstrap lifetime

- Status: Proposed.
- Scope: simplify panel/session orchestration and Explorer-sidecar lifetime
  composition without exposing new calendar behavior.
- User / Domain Value: preserves the completed internal calendar foundation
  and clears the final merge blockers.
- Cohesive Change Group: separate panel creation, request dispatch, post,
  error, and disposal; split registry `open`/`acceptRequest` into lookup,
  monotonic request handling, message, and cleanup helpers; extract bootstrap
  registration, listener attachment, and release phases.
- Exact Production Paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`,
  and `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`.
- Allowed Test Paths:
  `src/test/suite/scheduleImpactCalendarSession.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/createScheduleAwareExplorerSession.test.ts`,
  `src/test/suite/scheduleImpactSidecarRegistry.test.ts`,
  `src/test/suite/extensionSubscriptions.test.ts`, and
  `src/test/suite/semanticDiffWiring.test.ts`, plus
  `src/test/suite/webSmoke.ts`.
- Acceptance: one panel/session, reveal, request ordering, sidecar identity,
  failure post, parent/child disposal, rollback, and one-time release remain
  exact; all 18 originally inventoried production files and the three Slice 6
  private helper paths have zero mapped smells.
- Validation: listed session/panel/bootstrap/wiring tests on desktop; web
  `rtk pnpm run test:web` smoke scenario `WEB-10` in `webSmoke.ts`; scoped
  Qlty. `WEB-10` composes `createScheduleAwareExplorerSession` with controlled
  Explorer, sidecar, and parent-disposal handles and exercises success,
  parent disposal, open failure rollback, and one-time release. The concrete
  `WebviewPanel` DOM/message lifecycle is not exercised by web smoke because
  no public Calendar panel action is wired in this scope; it remains an
  explicit host-boundary residual risk, with the listed desktop
  session/wiring tests as the planned observable-composition evidence.
- Production Readiness: no panel/session/sidecar leak; concrete VS Code
  composition remains outside application/domain.
- Approval Boundary: exact files/tests plus evidence documents.
- Dependencies: Slice 9 committed.
- Risks: early release, missed rollback, retained listener, or double dispose.
- Out of Scope: Calendar Slice 3, calendar UI, and new commands.

## Web Extension Smoke Scope

`rtk pnpm run test:web` executes `src/test/runWebTest.ts`. After the web-harness
replan, `test:prepare:web` must emit the test-only
`out/test/suite/webSmoke.bundle.js`, and `runWebTest.ts` must pass that bundle as
`extensionTestsPath`; the source `src/test/suite/webSmoke.ts` is bundled rather
than loaded directly. No desktop-focused suite is discovered by this command.
The following scenarios are the complete browser claims after the bundle gate
is implemented and passes:

<!-- markdownlint-disable MD013 -->

| Scenario | Slice | Web-host assertion                                                                                                                                                                                                                                      | Explicit limitation                                                                                                                                                                                                               |
| -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WEB-7`  | 7     | Activate the extension, verify Semantic Diff/copy/save command registration, and run the command core with an injected absent active editor; assert the typed `no-active-editor` failure and no source read/report/session side effect.                 | Interactive source/mode pickers and Git/file dialogs are not automated here; focused desktop command/source tests cover them.                                                                                                     |
| `WEB-8`  | 8     | Run the command core with deterministic in-memory source/artifact and Explorer/report doubles; assert one successful finalization, expected source/period result, and one cleanup path.                                                                 | This is host composition, not a claim that the registered command's interactive UI or Explorer Webview DOM is driven by the web runner.                                                                                           |
| `WEB-9`  | 9     | Drive the browser-safe bridge with a controlled `postMessage` port and message target; assert ready/refresh request IDs, accepted session/failure delivery, malformed/cross-session/stale rejection, unsubscribe/dispose, and no post-dispose activity. | The test does not replace a real `window.vscode` or Calendar Webview DOM; transport and bridge unit tests remain authoritative for exhaustive cases.                                                                              |
| `WEB-10` | 10    | Compose the schedule-aware Explorer session with controlled sidecar and parent handles; assert registration before open, success disposal release, open-failure rollback, and idempotent release.                                                       | No public Calendar panel action exists in this scope, so real `WebviewPanel` DOM/message lifecycle is not a web-smoke claim; it remains a host-boundary residual risk covered only by the listed desktop session/wiring evidence. |

<!-- markdownlint-enable MD013 -->

The four scenarios remain additive characterization checks in the existing
`webSmoke.ts` file; the new bundle entry/config and runner/script wiring are
test-only and must not change production web output, public behavior, Calendar
Slice 3, or dependencies. Until the replan gate is reviewed, approved,
committed, and executed, WEB-7 through WEB-10 remain planned claims rather than
validation evidence.

## Integrated Validation And Remote Gate

After Slice 10 is reviewed, approved, and committed:

1. `rtk pnpm run qlty` must pass format, check, and smells without config or
   baseline changes.
2. Run `rtk pnpm run lint:md` and `rtk git diff --check`.
3. Run `rtk pnpm test`, the web preparation plus `rtk pnpm run test:web`, and
   `rtk pnpm run build`.
   Web preparation must emit `out/test/suite/webSmoke.bundle.js`, and the web
   command must load that bundle and report `WEB-7` (command
   activation/source guard), `WEB-8` (in-memory command artifact/Explorer
   finalization), `WEB-9` (transport/bridge lifecycle), and `WEB-10`
   (schedule-aware session/sidecar success and rollback). It must not be
   represented as a full rerun of the desktop suite or as direct Calendar
   Webview DOM coverage.
4. Confirm `architectureDependencyRules.test.ts` and
   `packageManifest.test.ts` pass with zero exception and VS Code `^1.75.0`.
5. Review `origin/main...HEAD` for no suppression, dependency, generated,
   public-schema, Calendar Slice 3, or attributed Dependabot-doc change.
6. Main publishes the fully committed branch under the existing user
   authorization and confirms PR #317 `qlty check` and `qlty fmt` success with
   `rtk gh pr checks 317`. Remote success is final acceptance, not a substitute
   for local validation.
7. An unmapped path, behavior change, or widened approval boundary returns to
   Main for Replanning.

## Production Readiness Summary

- Preserve guard precedence, cancellation, errors, cleanup, fallback,
  localization, malformed-input rejection, and validation timing.
- Preserve JP1/AJS3 version 13 structural and schedule meaning.
- Retain map/index comparison, bounded cache/calendar lookaround, message byte
  caps, and memory release points for large input.
- Keep shared code host-neutral and validate desktop and web.
- Preserve DTOs, JSON/report facts, closed unions, IDs, order, localization,
  transport envelopes, Explorer, Flow, and Git behavior.
- Only the existing CHANGELOG sentence is formatted; no durable behavior doc
  update is justified.
- Dependabot feature documents/patch/dependency work and Calendar Slice 3 are
  outside every approval and commit.

## Replan Triggers

- Production code outside the 18 originally inventoried paths or the three
  explicitly approved Slice 6 private helper paths.
- Observable behavior, public type/schema, command, transport, localization,
  telemetry, schedule meaning, or expected-test change.
- Qlty config/suppression/ignore/threshold/baseline, dependency, generated
  artifact, parser, architecture exception, or VS Code minimum change.
- Web-harness paths outside the explicitly approved `package.json`,
  `webpack.web-test.config.js`, `src/test/suite/webSmokeWebEntry.ts`,
  `src/test/runWebTest.ts`, and existing `src/test/suite/webSmoke.ts` delta.
- Calendar Slice 3, Dependabot scope, or a slice that cannot compile and
  validate independently.

## Feature Exit

- Definition of Done status: Not started.
- Durable updates: none expected beyond Slice 5 formatting.
- Closure evidence: integrated local validation, remote PR Qlty success, exact
  scope review, and all ten committed slice approvals.

## Validation Checklist

- [x] Complete ten-slice plan covers all 18 originally inventoried production
      files and CHANGELOG; the revised Slice 6 boundary adds three named
      private helper paths.
- [x] Exact paths, seams, dependencies, approvals, validation, risks, and
      replan triggers are recorded.
- [x] Independent plan review returns `Ready` with no findings.
- [x] Obtain Human Approval and focused plan commit.
- [x] Complete, review, approve, and commit Slice 1.
- [x] Complete, review, approve, and commit Slice 2.
- [x] Complete, review, approve, and commit Slice 3.
- [x] Complete, review, approve, and commit Slice 4.
- [x] Complete, review, approve, and commit Slice 5.
- [x] Complete, review, approve, and commit Slice 6.
- [ ] Complete, review, approve, and commit Slices 7-10 in order.
- [ ] Pass integrated local and remote gates.
- [ ] Perform Feature Exit and approved closure commit.

## Slice 6 Implementation Evidence (2026-09-12)

- Status: Complete; independent implementation review `Ready` with no
  findings; Completion Approval `Approved` on 2026-09-12 under the user's
  automatic no-findings slice approval policy; completion commit `3af9494d`.
- Basis: revised Slice 6 plan review `Ready`, explicit Human Approval, and
  focused replan/state commit `2734813c`.
- Changed production paths: the existing
  `VscodeGitHeadContentProvider.ts` and
  `VscodeGitHeadDefinitionSourceAdapter.ts`, plus the three approved private
  infrastructure seams `VscodeGitHeadApiResolution.ts`,
  `VscodeGitHeadPathGuards.ts`, and `VscodeGitHeadObjectPipeline.ts`.
- Changed test paths: `vscodeGitHeadApiResolution.test.ts`,
  `vscodeGitHeadPathGuards.test.ts`, and
  `vscodeGitHeadObjectPipeline.test.ts`. The existing adapter/provider test
  file remains unchanged and is the integration characterization suite.
- The API seam owns extension activation, enabled-state, repository, URI,
  captured-HEAD, and capability guards. The path seam owns normalized file
  paths, traversal/prefix checks, and active unambiguous rename candidates.
  The object seam owns object mode/type, MIME/encoding, binary/NUL, decoded
  byte limits, and read-failure classification. These are infrastructure-
  internal exports only and are not re-exported through the application port.
- API characterization covers throwing host accessors at their original
  boundaries: `enabled` and `getAPI` accessor failures remain
  `activation-failed`, while a returned API's `getRepository` accessor failure
  remains `api-unavailable`.
- Direct TDD execution of the four approved files passed `26` tests: existing
  adapter/provider `13`, API seam `6`, path seam `3`, and object seam `4`.
  The full desktop runner exited `0`; no existing expectation changed.
- Validation passed: `rtk pnpm run test:compile`, targeted ESLint, scoped
  Qlty `fmt`, `check`, and `smells --no-snippets` across all 11 approved
  production/test/evidence paths, `rtk pnpm run lint:md`,
  `rtk git diff --check`, and the architecture dependency suite (`25`
  passing). Production `rtk pnpm run build` passed with only existing asset
  size warnings.
- `rtk pnpm run test:web` passed with exit `0`. Slice 6 evidence is limited to
  the production web build and baseline `webSmoke.ts` run. WEB-7 through
  WEB-10 are future Slice 7-10 scenarios and were not executed; no Git
  adapter/provider web execution is claimed. The runner retained its existing
  `ERR_STREAM_PREMATURE_CLOSE` diagnostic.
- Compatibility and production readiness: public adapter/provider classes
  and factories, receiver semantics, guard precedence, captured HEAD,
  rename/path selection, unavailable reasons, textconv/decoded-byte limits,
  cache bounds, and idempotent release remain unchanged. No Node built-in,
  filesystem, `.git`, Git executable, telemetry, public schema, web entry
  point, dependency, configuration, generated artifact, Calendar Slice 3, or
  Dependabot change was introduced.
- Qlty file complexity `98` is cleared by the genuine module split; no
  suppression, threshold, baseline, or acceptance exception was added.
- Traceability is updated by this evidence entry. Recommended next route is
  activation of the exact approved Slice 7 scope and its eligible focused
  state commit. The dirty Dependabot documents remain preserved and excluded.

## Slice 7 Implementation Evidence (2026-09-12)

- Status: Implementation complete; independent implementation review `Ready`
  with no findings; Completion Approval `Approved`. No completion commit has
  been made.
- Review base: approved web-harness replan/state commit `800612e4`.
- Changed paths: the three approved command production files; the approved
  `package.json` test scripts, `webpack.web-test.config.js`,
  `src/test/suite/webSmokeWebEntry.ts`, `src/test/runWebTest.ts`, and
  `src/test/suite/webSmoke.ts` harness/scenario path.
- Command implementation decomposes active-editor, source, period, prepared
  before/after, file, Git, and Git-failure localization phases through private
  typed continuations. One-read behavior, cancellation without partial
  sessions, error codes/reasons/retryability/localization, exact source bytes,
  captured HEAD, cleanup, and telemetry privacy remain unchanged.
- Web harness uses an isolated production-mode WebWorker bundle derived from
  the existing web target. It changes only the test entry/output/cache and
  keeps `commonjs vscode`, browser fallbacks, and CSP-safe `devtool: false`;
  production webpack entries, extension behavior, engines, dependencies, and
  lockfile are unchanged. The runner resolves the emitted `.bundle.js`
  explicitly because the WebWorker loader does not append `.js` to a path
  whose extension is `.bundle`.
- WEB-7 executed in the real Chromium host during
  `pnpm run test:prepare && pnpm run test:web:run` and reported
  `browser=1 sourceReads=0 reports=0 sessions=0`; the command registration and
  injected `no-active-editor` guard passed. The route exited `0`. Existing
  later webSmoke viewer activity still emits the known stream
  `EPIPE`/`ERR_STREAM_PREMATURE_CLOSE` diagnostics; no WEB-8 through WEB-10
  execution or success is claimed, and interactive/Webview DOM coverage
  remains out of scope.
- Desktop validation passed with `pnpm test` exit `0`; the approved Slice 7
  test files contribute 68 passing cases in the full runner (43 command, 5
  period, 7 source capture, 13 Git adapter). `pnpm run build` exited `0` with
  only existing bundle-size warnings. Scoped Qlty `check` returned `No
issues`; Slice 7-owned smell findings are clear.
- Remaining Qlty inventory is Slice 8-owned artifact/Explorer and finalization
  work: `buildWorkflowArtifacts`, `openWorkflowArtifacts`,
  `runFileComparisonWorkflow`, `buildPresentationArtifactsStep`,
  `openExplorerStep`, `registerSourceBinding`, `beginWorkflowCapture`,
  `beginPresentationSourceCapture`, `buildExplorerContextStep`,
  `executeCompareSemanticDiffCommand`, and whole-file complexity. These are
  retained for the approved later slice.
- `pnpm run test:compile`, scoped Qlty check/smells, Markdown lint, and
  `git diff --check` passed. No suppression, baseline, threshold, dependency,
  generated artifact, public schema, telemetry, Calendar Slice 3, or
  Dependabot change was introduced. The feature evidence docs are the only
  documentation changes.
- Completion Approval: `Approved` on 2026-09-12 under the user's standing
  automatic no-findings slice-approval instruction, after independent review
  verdict `Ready` with no findings.
- Exact changed paths approved for the completion commit:
  `package.json`, `webpack.web-test.config.js`,
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`,
  `src/test/runWebTest.ts`, `src/test/suite/webSmoke.ts`,
  `src/test/suite/webSmokeWebEntry.ts`, and this feature's `TASKS.md` and
  `TRACEABILITY.md`. The command, period, source-capture, and Git adapter test
  files remain unchanged validation-only paths.
- Recommended route: delegate this exact approved path set to
  `approval-committer` for the Slice 7 completion commit. No stage/commit was
  performed by this implementation handoff; Slice 8 remains unapproved for
  implementation here.

## Slice 8 Activation And Approval (2026-09-13)

- Status: Human Approved; active next slice, pending focused state commit.
- Basis: the complete ten-slice plan and independent plan review `Ready` with
  no findings; Slice 7 implementation review `Ready` with no findings and
  completion commit `b0095565`; the user's standing automatic no-findings
  slice-approval instruction and current authorization to continue the
  approved slices.
- Approved production path:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`.
- Approved test paths:
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/semanticDiffFlowHighlights.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`, and
  `src/test/suite/webSmoke.ts` for the actual WEB-8 scenario through the
  already approved test-only web harness.
- Approved evidence paths: this feature's `TASKS.md` and
  `TRACEABILITY.md`.
- Approved boundary: simplify artifact building, source binding,
  Explorer/report opening, compatibility flow, and final result handling;
  preserve comparison/open counts, binding/rollback, Explorer defaults,
  copy/save actions, Flow focus/highlights, sidecar context, result codes,
  telemetry, and cleanup. Private signature changes are allowed only when
  required for this slice to compile. No new module path, public command,
  action, DTO, UI file, or design decision is approved.
- Web validation boundary: execute WEB-8 through the committed bundle-backed
  `test:web` route with deterministic in-memory source, artifact, report/open,
  Explorer, and session doubles. This does not claim interactive picker,
  file-dialog, registered-command UI, or Explorer Webview DOM execution.
- State commit gate: eligible; pending `approval-committer`. No runtime,
  test, generated artifact, configuration, dependency, `CHANGELOG.md`,
  Calendar Slice 3, Dependabot, or Slice 9-10 change is included in this
  state commit.
- Replan trigger: if Qlty total/file complexity cannot be cleared within
  the exact approved production path and its private helpers, or if a new
  module path, architecture boundary, behavior, public contract, or test
  expectation is required, stop and return the smallest affected scope to
  Main for Replanning Mode. Do not enlarge this slice silently.
