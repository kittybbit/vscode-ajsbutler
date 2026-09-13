# Requirements Traceability: Semantic Diff Quality Remediation

<!-- markdownlint-disable MD013 -->

| Use case / requirement                     | SPECS.md section                                  | Slice    | Test or validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structural identity and deterministic diff | Requirements; Compatibility                       | 1        | `semanticDiffStructuralRules.test.ts`, `compareSemanticDiff.test.ts`, `semanticDiffSampleCoverage.test.ts`, `semanticDiffJson.test.ts`; reorder, `sample1_large_utf8`, duplicate identity, relation, order                                                                                                                                                                                                                                                                                   |
| Supported/unsupported schedule comparison  | Requirements; Compatibility                       | 2        | `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`, `semanticDiffScheduleImpact.test.ts`; periods, reasons, zero-runs, changed time, malformed input                                                                                                                                                                                                                                                                            |
| Schedule-impact root and issue model       | Requirements; Architecture                        | 3        | `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`; IDs, candidates, issue maps, side roots, duplication, freeze                                                                                                                                                                                                                                                                                                       |
| Schedule-impact timeline and sidecar       | Requirements; Architecture                        | 4        | `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, `semanticDiffPresentationArtifacts.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`; matching, timeline, source references, validation, large/duplicate input                                                                                                                                                                                                                                              |
| Report, JSON, and presentation artifacts   | Requirements; Compatibility                       | 5        | Artifact, report, Markdown, and JSON suites listed in `TASKS.md`; exact localization, projection, ordering, omission, parser failures                                                                                                                                                                                                                                                                                                                                                        |
| Formatting-only release-note repair        | Acceptance Criteria; Durable Documentation Impact | 5        | `rtk pnpm run lint:md`, Qlty format, `rtk git diff --check`, wording-preservation review                                                                                                                                                                                                                                                                                                                                                                                                     |
| Immutable Git HEAD and snapshot source     | Requirements; Compatibility                       | 6        | `vscodeGitHeadDefinitionSourceAdapter.test.ts`, `vscodeGitHeadApiResolution.test.ts`, `vscodeGitHeadPathGuards.test.ts`, `vscodeGitHeadObjectPipeline.test.ts`; complete adapter/provider suite on desktop; web validation limited to production web build and baseline `webSmoke.ts`; WEB-7 through WEB-10 are future Slice 7-10 scenarios and were not executed for Slice 6, with no Git adapter/provider web execution claim; HEAD, path/rename, decoded content, failures, cache/release |
| Command source selection/cancellation      | Requirements; Compatibility                       | 7        | `semanticDiffCommand.test.ts`, `parseSemanticDiffComparisonPeriod.test.ts`, `semanticDiffSourceCapture.test.ts`, Git adapter suite, and `webSmoke.ts` `WEB-7`; one read, cancellation, failures, size, privacy, web activation/registration/no-active-editor guard                                                                                                                                                                                                                           |
| Explorer/report workflow and cleanup       | Requirements; Compatibility                       | 8        | Command, schedule adapter, Explorer/Flow, highlight, and wiring suites listed in `TASKS.md`, plus `webSmoke.ts` `WEB-8`; one comparison/open, rollback, cleanup, actions, telemetry, web in-memory finalization                                                                                                                                                                                                                                                                              |
| Calendar transport and bridge              | Requirements; Overlap Decision                    | 9        | `scheduleImpactCalendarTransport.test.ts`, new narrow `scheduleImpactCalendarBridge.test.ts`, and `webSmoke.ts` `WEB-9`; envelope, JSON, bytes, IDs, stale/session, listener/dispose, controlled web-host lifecycle                                                                                                                                                                                                                                                                          |
| Calendar host session and parent lifetime  | Requirements; Overlap Decision                    | 10       | Session, Explorer panel, bootstrap session, sidecar, subscription, and wiring suites listed in `TASKS.md`, plus `webSmoke.ts` `WEB-10`; failure, reveal, ordering, rollback, one-time release, controlled web-host composition                                                                                                                                                                                                                                                               |
| PR #317 local Qlty gate                    | Requirements; Acceptance Criteria                 | 1-10     | Per-slice ownership; final `rtk pnpm run qlty`; no suppression, ignore, threshold, baseline, architecture, dependency, or generated change                                                                                                                                                                                                                                                                                                                                                   |
| PR #317 remote Qlty gate                   | Requirements; Acceptance Criteria                 | After 10 | Publish committed slices; `rtk gh pr checks 317`; remote `qlty check` and `qlty fmt` successful                                                                                                                                                                                                                                                                                                                                                                                              |
| Desktop/web and VS Code `^1.75.0`          | Compatibility                                     | 1-10     | Focused desktop suites; `rtk pnpm run test:web` executes `src/test/runWebTest.ts`, which loads the test-only bundle sourced from `src/test/suite/webSmoke.ts` and must report `WEB-7` through `WEB-10` as defined in `TASKS.md`; final `rtk pnpm test`, `rtk pnpm run build`, architecture and package-manifest tests                                                                                                                                                                        |
| Preserve excluded work                     | Overlap Decision; Non-Goals                       | 1-10     | Diff confirms Dependabot docs/patch/dependencies, Calendar Slice 3, parser/generated, Qlty config, README/use cases/roadmap, and `FlowContents.tsx` unchanged by this feature                                                                                                                                                                                                                                                                                                                |

<!-- markdownlint-enable MD013 -->

## Slice Dependency Chain

Slices 1 through 10 run in numeric order, followed by integrated local
validation, the remote PR gate, and Feature Exit.

Every arrow is a committed approval boundary. Slices 3-4 revisit
`semanticDiffScheduleImpact.ts`, and Slices 7-8 revisit
`semanticDiffCommand.ts`; each later slice uses its committed predecessor as
the review base. The test-only web-harness replan is a prerequisite for
WEB-7 through WEB-10 claims, but does not alter the production slice order or
desktop evidence boundary.

## Approval Record

- Independent plan review: `Ready`; no findings.
- Plan Human Approval history: `Approved` on 2026-09-12 for the complete
  ten-slice plan and the exact Slice 1 scope as the next slice.
- Prior Human Approval: `Approved` on 2026-09-12 for the exact Slice 2 scope
  as the next slice; its completion commit is `ecea8714`.
- Prior Human Approval: `Approved` on 2026-09-12 for the exact Slice 3 scope
  as the next slice; focused state commit `d3e895e7`, implementation, and
  completion commit `6441de1e` are complete after independent implementation
  review `Ready` with no Findings and Completion Approval `Approved` under the
  user's automatic no-findings slice approval policy.
- Prior Human Approval: `Approved` on 2026-09-12 for the exact Slice 4 scope
  as the next slice; completion commit `e89e6cab` is complete after focused
  state commit `19e60b20`, independent implementation review `Ready` with no
  findings, and Completion Approval `Approved` under the user's automatic
  no-findings slice approval policy.
- Prior Human Approval: `Approved` on 2026-09-12 for the exact Slice 5 scope
  as the next slice; completion commit `a69fcd12` is complete after focused
  state commit `4f3119d7`, independent implementation review `Ready` with no
  findings, and Completion Approval `Approved` under the user's automatic
  no-findings slice approval policy.
- Prior Human Approval: `Approved` on 2026-09-12 for the original exact Slice 6
  scope as the next slice; that two-production-file/one-test approval is
  superseded by the file-complexity replan below.
- Prior Human Approval: `Approved` on 2026-09-12 in the current conversation
  for the revised exact five-production-file/four-test Slice 6 boundary, after
  independent plan review `Ready` with no findings; its completion commit is
  `3af9494d`. The original Slice 6 approval remains superseded.
- Prior Human Approval: `Approved` on 2026-09-12 in the current conversation
  for the exact pre-harness Slice 7 three-production-file/five-test boundary;
  that approval is superseded because direct WebWorker imports cannot resolve
  the required relative production dependencies.
- Current Slice 7-10 status: web-harness replan independently reviewed `Ready`
  with no findings and Human Approved in the current conversation on
  2026-09-12. The approved delta adds
  `package.json`, `webpack.web-test.config.js`,
  `src/test/suite/webSmokeWebEntry.ts`, `src/test/runWebTest.ts`, and the
  existing `src/test/suite/webSmoke.ts` orchestration.
- Slice 6 implementation review: `Ready` with no findings. Completion Approval
  is `Approved` on 2026-09-12 under the user's automatic no-findings slice
  approval policy; completion commit `3af9494d` is complete.
- Slice 7 state commit gate: the pre-harness boundary is superseded; approved
  web-harness replan/state commit `800612e4` is complete.
- Implementation sequencing: one slice at a time, with independent review and
  completion approval/commit before advancing.
- Plan commit gate: complete; focused plan commit `d3693d76`.
- Replan commit gate: complete; focused replan/state commit `2734813c` for the
  revised Slice 6 boundary.
- Web-harness replan commit gate: complete at `800612e4`; exact state paths
  were this feature's `TASKS.md` and `TRACEABILITY.md`, with no runtime, test,
  generated, dependency, or production webpack changes.
- Slice 7 completion gate: independent implementation review `Ready` with no
  findings; Completion Approval is `Approved` under the user's standing
  automatic no-findings slice-approval instruction; exact completion commit
  `b0095565` is complete.
- Slice 8 prior activation: the existing reviewed behavior/test scope was
  Human Approved on 2026-09-13 under the user's standing automatic
  no-findings slice-approval instruction. That approval is superseded only
  for its single-file production-path assumption because Qlty total
  complexity remained `253` against threshold `55` after partial extraction.
- Current Slice 8 replan: the revised independent plan review is `Ready` with
  no findings, and the eight new helper modules and their import topology were
  Human Approved in the current conversation on 2026-09-13. The focused
  replan/state commit is pending; completion review and approval remain
  separate gates.
- Slice 8 replan approval gate: Human Approval is `Approved` on 2026-09-13
  for the exact nine production paths, seven test/validation paths, and the
  two evidence docs recorded below. The focused replan/state commit is
  pending.
- Exact planning-package commit paths: this feature's `SPECS.md`, `TASKS.md`,
  and `TRACEABILITY.md` only.
- Exact Slice 1 paths remain recorded in its implementation evidence below;
  its completion commit is `fa933763`.
- Exact Slice 2 paths and completion evidence remain recorded below; its
  completion commit is `ecea8714`.
- Exact Slice 3 paths and completion evidence remain recorded below; its
  completion commit is `6441de1e`.
- Exact Slice 4 paths and completion evidence remain recorded below; its
  completion commit is `e89e6cab`.
- Exact Slice 5 paths and completion evidence remain recorded below; its
  completion commit is `a69fcd12`.
- Prior exact Slice 6 production paths:
  `src/infrastructure/git/VscodeGitHeadContentProvider.ts` and
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`.
- Revised exact Slice 6 production paths:
  `src/infrastructure/git/VscodeGitHeadContentProvider.ts`,
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`,
  `src/infrastructure/git/VscodeGitHeadApiResolution.ts`,
  `src/infrastructure/git/VscodeGitHeadPathGuards.ts`, and
  `src/infrastructure/git/VscodeGitHeadObjectPipeline.ts`.
- Revised exact Slice 6 test paths:
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`,
  `src/test/suite/vscodeGitHeadApiResolution.test.ts`,
  `src/test/suite/vscodeGitHeadPathGuards.test.ts`, and
  `src/test/suite/vscodeGitHeadObjectPipeline.test.ts`.
- Exact Slice 7 production paths:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`, and
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`.
- Exact Slice 7 test paths:
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`,
  `src/test/suite/semanticDiffSourceCapture.test.ts`,
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`, and
  `src/test/suite/webSmoke.ts` (WEB-7).
- Prior exact Slice 8 production path:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`.
- Revised exact Slice 8 production paths: the prior command path plus
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowInput.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowSelection.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowPeriod.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowSource.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSourceBinding.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`,
  and
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`.
- Exact Slice 8 test paths:
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/semanticDiffFlowHighlights.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`, and
  `src/test/suite/webSmoke.ts` (WEB-8).
- Proposed web-harness delta paths:
  `package.json` (including the exact `test:prepare:web:bundle` script,
  `test:prepare:web` wiring, and direct `test:web:run` bundle prerequisite),
  `webpack.web-test.config.js`,
  `src/test/suite/webSmokeWebEntry.ts`, and `src/test/runWebTest.ts`; the
  existing `src/test/suite/webSmoke.ts` remains the scenario source.
- Slice 6 validation boundary: complete adapter/provider suite on desktop; web
  validation is limited to the final production build and baseline
  `webSmoke.ts` run. WEB-7 through WEB-10 are future Slice 7-10 scenarios and
  were not executed for Slice 6; no Git adapter/provider web execution is
  claimed.
- `CHANGELOG.md` remains limited to the reported Slice 5 sentence wrapping;
  its release-note wording is unchanged.

## Slice 3 Implementation Evidence (2026-09-12)

- Status: complete; focused state commit `d3e895e7`; independent
  implementation review `Ready` with no Findings; Completion Approval is
  `Approved` on 2026-09-12 under the user's automatic no-findings slice
  approval policy; completion commit `6441de1e`.
- The approved production file now uses private typed identity, candidate,
  schedule-issue, root-side, root-issue-map, and root-ID-map helpers. The
  before/after duplication is removed without changing the application
  contract or moving behavior across layers.
- Characterization evidence: the approved impact, calendar, and artifact
  suites pass with 51 tests. Encoded IDs, candidate order, issue details and
  ownership, root correspondence, scope transitions, no-run outcomes, and
  deep-freeze behavior remain covered by the existing expectations.
- Validation evidence: `rtk pnpm run test:compile`, the three approved
  focused suites, targeted ESLint, `rtk git diff --check`, and scoped Qlty
  check passed. Slice 3-owned smell findings are clear. The whole-file Qlty
  smell inventory still reports residual later-boundary findings in
  `scheduleRunsBySide`, `outcomeFor`, `matchRuns`,
  `sourceChangeRefForTimelineItem`, `attachSourceChangeReferences`,
  `validateSourceChangeReferences`, `createRoots`, `evaluatedFacts`,
  `buildSemanticDiffScheduleImpact`, `makeInput`, and `rootIdForPath`, plus
  existing shared utility complexity; these are retained for later approved
  slices and are not claimed as Slice 3 success. The desktop test run, final
  Web smoke run under host permissions, production build, and Markdown lint
  also passed; the build retained existing bundle-size warnings.
- Compatibility evidence: no public DTO/schema, schedule meaning, parser,
  VS Code API, desktop/web entry point, telemetry, Dependabot documents, or
  Calendar Slice 3 path changed.
- Exact completion scope: `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  the unchanged approved test paths `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`, and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`, plus this
  feature's `TASKS.md` and `TRACEABILITY.md`.
- Qlty result: Slice 3-owned findings are clear. Residual whole-file findings
  in later-boundary functions and shared utility complexity remain assigned to
  later approved slices and are not claimed as Slice 3 success.
- Completion commit: `6441de1e`; completion is committed and this state
  synchronization did not stage or commit it.

## Slice 1 Implementation Evidence

- Status: complete; independent implementation review is
  `Ready` with no findings and Completion Approval is approved on 2026-09-12.
- Approved paths changed: `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  and `src/application/semantic-diff/compareSemanticDiff.ts`. The four
  approved test paths were unchanged because existing characterization tests
  cover the refactored branches.
- Behavior preserved: fingerprint grouping/classification, exact and
  fingerprint precedence, rename/move change order, relation target shape,
  relation pair canonicalization, identity decision IDs, and deterministic
  ordering.
- Qlty evidence: explicit six-path checks (`qlty check` and
  `qlty smells --no-snippets`) both pass with zero issues. The three Slice 1
  baseline smells were `matchFingerprintUnits`,
  `createFingerprintMatchChanges`, and `createRelationChanges`; no suppression,
  ignore, baseline, threshold,
  configuration, or architecture exception was added.
- Validation evidence: test compile, structural rules suite (20 passing),
  desktop preparation and test run, web preparation and smoke run, production
  build, architecture dependency suite, package manifest suite (5 passing),
  Markdown lint, and `git diff --check` all passed. The production build kept
  its existing asset-size warnings.
- Compatibility evidence: no parser, public DTO/JSON/report schema, VS Code
  API, desktop/web entry point, telemetry, or JP1/AJS behavior changed; large,
  duplicate, malformed, reordered, rename/move, relation, and
  `sample1_large_utf8` characterization scenarios remain covered.
- Review result: independent `implementation-reviewer` returned `Ready` with
  no findings. Completion Approval is approved under the user's automatic
  no-findings approval instruction.
- Exact completion scope: the two changed production files above plus this
  feature's `TASKS.md` and `TRACEABILITY.md`; the four approved test paths
  remain unchanged and are validation evidence only.
- Completion commit: `fa933763`; completion is committed and this agent did not
  stage or commit it.

## Slice 2 Completion Evidence (2026-09-12)

- Status: complete; independent implementation review `Ready` with no
  findings; Completion Approval `Approved` on 2026-09-12 under the user's
  automatic no-findings slice approval policy; focused completion commit
  `ecea8714`.
- Implementation: extracted the total unsupported-reason message lookup,
  typed UTC-date validation helpers, schedule run grouping/sorting, canonical
  run decision projection, and changed/added/removed application projections.
  The original domain/application ownership and all existing guards remain in
  place.
- Approved production paths changed:
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`, and
  `src/application/semantic-diff/compareScheduleDiff.ts`.
- Approved test paths were unchanged because the existing characterization
  suites cover period bounds, unsupported reasons/raw evidence, zero runs,
  run pairing, calendar outputs, and deterministic ordering.
- Qlty baseline: the three production files had nine mapped smells covering
  unsupported-message branching, UTC-date validation, run grouping/decision
  complexity, and schedule-run projection. Explicit scoped `qlty check` and
  `qlty smells --no-snippets` now pass with zero issues. No suppression,
  ignore, baseline, threshold, configuration, dependency, or architecture
  exception was added.
- Validation evidence: test compile, full desktop test run, Web smoke after
  Web preparation, production build, and scoped Qlty passed. The production
  build retained its pre-existing asset-size warnings. Web smoke required the
  host permission needed by Chromium and then completed successfully.
- Compatibility evidence: period bounds, run IDs, nullability, unsupported
  reasons, raw evidence, zero-run candidates, calendar results, and ordering
  remain deep-equal compatible. No schedule meaning, host calendar, locale,
  timezone, public DTO/schema, VS Code API, parser, or telemetry behavior
  changed; the implementation keeps single-pass run grouping and avoids an
  extra period-wide scan.
- Documentation impact: only this feature's `TASKS.md` and
  `TRACEABILITY.md` evidence changed; no README, CHANGELOG, or durable
  product specification update is required for this behavior-preserving
  refactor.
- Review result: independent `implementation-reviewer` returned `Ready` with
  no findings. Completion Approval is recorded under the user's automatic
  no-findings slice approval policy.
- Exact completion scope: the three approved production paths above plus this
  feature's `TASKS.md` and `TRACEABILITY.md`; the four approved test paths were
  unchanged. Completion commit `ecea8714` is complete, and this state
  synchronization did not stage or commit it.
- No files outside the approved production, test, and evidence paths were
  changed by this slice; inherited Dependabot documentation edits are
  preserved and excluded.

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
- Approved boundary: refactor schedule-impact indexing, issue, and root
  assembly through `createRootStatuses`; run matching, timeline, and final
  assembly are out of scope. Calendar public Slice 3 behavior remains
  excluded.
- State commit gate: complete; focused state commit `d3e895e7`; completion
  commit `6441de1e` is complete. No runtime, test, configuration, generated,
  dependency, `CHANGELOG.md`, Calendar Slice 3, or Dependabot change was
  included in those commits.

## Slice 4 Completion Evidence (2026-09-12)

- Status: Complete; focused state commit `19e60b20`; implementation complete;
  independent implementation review `Ready` with no findings; Completion
  Approval `Approved` on 2026-09-12; focused completion commit `e89e6cab`.
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
- Completion commit: `e89e6cab`; completion is committed. No runtime, test,
  configuration, generated, dependency, `CHANGELOG.md`, Calendar Slice 3, or
  Dependabot change was included beyond the approved implementation scope.

## Slice 4 Implementation Evidence (2026-09-12)

- Status: Complete; focused state commit `19e60b20`; independent implementation
  review `Ready` with no findings; Completion Approval `Approved` on 2026-09-12
  under the user's automatic no-findings slice approval policy; completion
  commit `e89e6cab`.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and Human Approval for this exact Slice 4 boundary.
- Approved production path changed:
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
- Approved test paths:
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffPresentationArtifacts.test.ts`, and
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`; all remain
  unchanged and are covered by the full Desktop run.
- Approved evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Implementation: extracted private pure phases for match classification and
  append, source-change reference selection, timeline attachment and
  defensive validation, root construction, evaluated facts, and final
  assembly. Existing Slice 3 helpers and map-based validation remain intact;
  no DTO, schema, or new public export was introduced.
- Review-fix: corrected source-change owner conflict polarity so only a
  different existing owner throws, restored lazy comparator evaluation, and
  restored the original run-present outcome precedence.
- Acceptance evidence: existing match kinds, ordinals, timeline ordering,
  source-reference precedence, validation errors, frozen output, and facts are
  preserved without test expectation changes. Invalid target IDs are emitted
  only for jobnet/unit targets, matching the prior behavior.
- Qlty evidence: scoped `qlty smells --no-snippets` and `qlty check` both pass
  with zero issues for the production file. No suppression, ignore, baseline,
  threshold, configuration, dependency, or architecture exception was added.
- Validation evidence: direct Mocha results are
  `semanticDiffScheduleImpact.test.ts` 11/11,
  `semanticDiffScheduleCalendar.test.ts` 30/30,
  `semanticDiffPresentationArtifacts.test.ts` 2/2, and
  `compareSemanticDiffWithArtifacts.test.ts` 10/10 (53/53 total).
  `rtk pnpm run test:compile`, target-file ESLint, full Desktop tests,
  `rtk pnpm run test:web` after Web preparation, `rtk pnpm run build`,
  `rtk pnpm run lint:md`, and `rtk git diff --check` all pass. Production
  build output retains the existing bundle-size warnings; host runners retain
  existing Electron/stream diagnostic logs while exiting successfully.
- Large-input evidence: the targeted `sample1_large_utf8` self-comparison
  passes 1/1 with `changes=0`, `identityDecisions=868`, and
  `exactJobGroups=48`. The unapproved sample category-coverage test is not a
  Slice 4 acceptance claim; its existing `end-control` category assertion
  remains outside this slice.
- Compatibility evidence: no parser, public DTO/JSON/report schema, VS Code
  API, desktop/web entry point, telemetry, calendar transport, or JP1/AJS
  schedule meaning changed. Inherited Dependabot documentation edits remain
  untouched and excluded.
- Production readiness: ready for independent implementation re-review; no
  Slice 4 blocker is known. Review should verify source-reference precedence,
  throw timing, and stable ordering against the characterization suites. The
  unapproved sample category assertion is a separate follow-up.
- Review result: `implementation-reviewer` returned `Ready` with no findings;
  the source-reference precedence, validation timing, and ordering findings
  were resolved within Slice 4.
- Exact completion scope for `approval-committer`:
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`, this
  feature's `TASKS.md`, and this feature's `TRACEABILITY.md`. The four
  approved test paths remain unchanged and are validation evidence only.
- Completion commit status: `e89e6cab`; completion is committed and this state
  synchronization made no runtime or test changes and did not stage or commit.
  Dependabot documents remain untouched.

## Slice 5 Completion Evidence (2026-09-12)

- Status: Complete; focused state commit `4f3119d7`; implementation complete;
  independent implementation review `Ready` with no findings; Completion
  Approval `Approved` on 2026-09-12; completion commit `a69fcd12`.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and the user's automatic no-findings slice approval instruction.
- Approved production paths:
  `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
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

## Slice 5 Implementation Evidence (2026-09-12)

- Status: complete; independent implementation review `Ready` with no findings;
  Completion Approval `Approved` on 2026-09-12 under the user's automatic
  no-findings slice approval policy; completion commit `a69fcd12`.
- Exact changed production paths:
  `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  and `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`.
- Exact documentation path changed: `CHANGELOG.md`, with only the reported
  1.1.0 sentence wrapped and no wording change. Evidence paths are this
  feature's `TASKS.md` and `TRACEABILITY.md`.
- Artifact construction is split into source parsing, parser-error projection,
  period-aware comparison-input construction, and comparison-result artifact
  assembly. The adapter still parses before and after once each, preserves
  side-specific parser errors, omits comparison options without a period, and
  forwards the supplied period by identity. Sidecar availability remains
  derived from supplied schedule-projection facts without rerunning comparison.
- Markdown output is assembled through dedicated target-side,
  identity-evidence, attribute-category, schedule-summary, and schedule-side
  helpers. English/Japanese localization, fallback, Markdown escaping,
  ordering, omission, report facts, and JSON source facts remain unchanged.
- Scoped `qlty smells --no-snippets` and `qlty check` over both approved
  production files report zero issues. Target ESLint and
  `rtk git diff --check` pass; no Qlty suppression, ignore, baseline,
  threshold, configuration, dependency, or architecture exception was added.
- Validation results: `rtk pnpm run test:compile`, target ESLint, scoped Qlty,
  `rtk pnpm run lint:md`, production build, desktop test runner, and web test
  runner pass. The production build retains existing bundle-size warnings;
  the web runner retains existing Chromium `EPIPE`/premature-close logs while
  exiting successfully.
- The six approved focused suites were executed directly under the TDD Mocha
  UI: `42 passing`, `3 failing`, exactly matching the pre-Slice-5 HEAD
  baseline. Current and baseline output have byte parity (the populated Full
  Markdown snapshot is 3610 bytes in both runs, against the existing 3617-byte
  expectation). The three failures are the job-group exact-key Markdown
  assertion, the typed schedule-removal audit substring assertion, and that
  populated Full Markdown byte snapshot; they are recorded as baseline
  findings rather than Slice 5 regressions.
- Compatibility and production-readiness evidence: no public DTO/JSON/report
  schema, parser, comparison or schedule meaning, VS Code API, desktop/web
  entry point, telemetry, Dependabot documents, or Calendar Slice 3 path
  changed. No new release content or durable specification update is needed.
- Completion commit: `a69fcd12`; completion is committed. Parse/period
  precedence, identity and target rendering, schedule summary selection, exact
  Markdown escaping/order, and the three reproduced baseline failures were
  independently reviewed with `Ready` and no findings.

## Slice 6 Prior Approval Superseded (2026-09-12)

- Status: Superseded by Replanning; no active implementation approval.
- Basis: the approved ten-slice plan, independent plan review `Ready` with no
  findings, and the user's automatic no-findings slice approval instruction.
- Prior approved production paths:
  `src/infrastructure/git/VscodeGitHeadContentProvider.ts` and
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`.
- Prior approved test path:
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`.
- Approved evidence docs: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Prior approved validation boundary: complete adapter/provider suite on
  desktop; Slice 6 web validation is limited to the final production build and
  baseline `webSmoke.ts`, with no Git adapter/provider web execution claim.
  WEB-7 through WEB-10 are future Slice 7-10 scenarios and were not executed
  here.
- State commit gate: superseded and not eligible. The partial Git diff and
  unrelated dirty Dependabot documents remain untouched.

## Slice 6 Prior Implementation Handoff (superseded, 2026-09-12)

- Status: Partial implementation evidence preserved; completion review and
  completion commit remain pending because the prior two-file boundary cannot
  clear the remaining file-complexity smell.
- Changed production paths remain only the two originally approved files;
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts` was unchanged.
  The three helper modules and three helper tests are proposed replan paths,
  not implementation changes in this handoff.
- The approved test file contains 13 adapter/provider tests. The complete
  desktop runner exited 0, and no test expectation was changed.
- Validation: `rtk pnpm run test:compile`, scoped `rtk qlty check`,
  `rtk git diff --check`, production build, desktop runner, and baseline web
  runner passed. Build bundle-size warnings are pre-existing. Slice 6 web
  evidence is limited to the production web build and baseline `webSmoke.ts`;
  WEB-7 through WEB-10 are future Slice 7-10 scenarios and were not executed.
  No Git adapter/provider web execution is claimed.
- Qlty: scoped formatting, lint, and function-level smell findings are clear;
  file complexity remains 98 versus the configured threshold 55 for
  `VscodeGitHeadDefinitionSourceAdapter.ts`. The exact Slice 6 approval listed
  only the two existing production paths, so a new helper module requires the
  revised planning and approval boundary below.
- Compatibility: captured HEAD/path selection, rename fallback, object/text
  guards, decoded-byte limits, failure reasons, and idempotent snapshot
  release remain characterized. No parser, public schema, telemetry, VS Code
  API, Node built-in, or desktop/web entry-point change was made.
- Recommended route: Main should route this residual to independent plan review
  after recording the revised module seam; no acceptance exception is proposed.

## Slice 6 Replanned Scope (2026-09-12)

- Trigger: the existing two-file Git implementation passed compile, build,
  desktop, web, lint, diff, and scoped checks, with zero function-level Qlty
  smells, but `VscodeGitHeadDefinitionSourceAdapter.ts` remains at whole-file
  complexity 98 against threshold 55. The old approved boundary cannot clear
  this genuine infrastructure responsibility without adding private module
  seams.
- Revised exact production paths:
  `src/infrastructure/git/VscodeGitHeadContentProvider.ts`,
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`,
  `src/infrastructure/git/VscodeGitHeadApiResolution.ts`,
  `src/infrastructure/git/VscodeGitHeadPathGuards.ts`, and
  `src/infrastructure/git/VscodeGitHeadObjectPipeline.ts`.
- Revised exact test paths:
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`,
  `src/test/suite/vscodeGitHeadApiResolution.test.ts`,
  `src/test/suite/vscodeGitHeadPathGuards.test.ts`, and
  `src/test/suite/vscodeGitHeadObjectPipeline.test.ts`.
- Seam mapping: API resolution owns extension discovery/activation, enabled
  state, repository/document-URI resolution, HEAD and capability context;
  path guards own normalized URI/root/traversal checks and active, unambiguous
  rename candidates; the object pipeline owns object mode/type, MIME/encoding,
  binary/NUL/decoded-byte, and read-failure guards. They are
  infrastructure-internal exports for focused tests only, with no application
  port or public package re-export.
- Preserved behavior and boundaries: adapter/provider class and factory,
  infrastructure construction, receiver semantics, guard precedence, captured
  HEAD, path/rename selection, failure reasons, byte limits, cache lifetime,
  and idempotent release remain unchanged. No Git executable, filesystem,
  `.git`, or Node built-in access is allowed; no Qlty suppression, threshold
  relaxation, baseline manipulation, or acceptance exception is allowed.
- Test/validation boundary: helper characterization tests cover each seam;
  the existing adapter/provider suite remains the integration regression for
  receiver semantics and cross-seam precedence. Run compile, all four listed
  tests, targeted ESLint, scoped Qlty format/check/smells, `lint:md`,
  `git diff --check`, complete desktop adapter/provider validation, and the
  production build. `rtk pnpm run test:web` is limited to the baseline
  `src/test/suite/webSmoke.ts` plus production web-build check; WEB-7 through
  WEB-10 are future Slice 7-10 scenarios and make no Git adapter/provider web
  execution claim.
- Gate: the prior Slice 6 approval is superseded. Revised independent plan
  review is `Ready` with no findings, current Human Approval is `Approved` on
  2026-09-12, and focused replan/state commit `2734813c` is complete.

## Slice 6 Replan Approval (2026-09-12)

- Status: Human Approved; focused replan/state commit `2734813c` complete.
- Approval source: current conversation, after independent plan review `Ready`
  with no findings.
- Approved scope: the revised five exact production paths and four exact test
  paths listed above, with the three private infrastructure seams limited to
  API/context resolution, path/rename guards, and object/content pipeline.
- Approved behavior boundary: preserve the adapter/provider public APIs,
  infrastructure construction, receiver semantics, guard precedence, captured
  HEAD, path/rename rules, object/content failure reasons, byte limits, cache
  lifetime, and idempotent release. No Qlty suppression or threshold,
  acceptance, Calendar Slice 3, or Dependabot change is approved.
- Exact state-commit paths: this feature's `TASKS.md` and `TRACEABILITY.md`
  only; runtime, tests, configuration, generated artifacts, and `SPECS.md`
  remain excluded from that commit.

## Slices 7-10 Web Harness Replanning (2026-09-12)

- Trigger evidence: `src/test/runWebTest.ts` passed the compiled
  `src/test/suite/webSmoke.ts` directly to `@vscode/test-web`. The WebWorker
  extension host's fake `require` resolves `vscode` only, so relative imports
  for Semantic Diff command, transport, bridge, panel, session, and bootstrap
  dependencies fail. The attempted WEB-7 import was removed to preserve the
  baseline; the prior passing run therefore did not execute WEB-7.
- Selected option: isolated test-only webpack bundle rather than production
  web-entry pollution or fake-`require` extension. The bundle must derive the
  existing web target's browser fallbacks, `target: webworker`,
  `commonjs vscode` external, and CSP-safe production settings.
- Exact revised harness/config paths:
  `package.json`, new `webpack.web-test.config.js`, new
  `src/test/suite/webSmokeWebEntry.ts`, `src/test/runWebTest.ts`, and existing
  `src/test/suite/webSmoke.ts`. No dependency or `pnpm-lock.yaml` change is
  planned.
- Bundle wiring: the preparation script runs the existing web production
  build and test compilation, then runs the exact
  `test:prepare:web:bundle` webpack command and emits
  `out/test/suite/webSmoke.bundle.js`. The new entry re-exports `run` from
  `webSmoke.ts`; `runWebTest.ts` passes the emitted bundle as
  `extensionTestsPath`. The test-only config derives the production web
  target, retaining `target: webworker`, the `commonjs vscode` external,
  browser fallbacks/condition names, process provider, and production
  `devtool: false`, while changing only test entry/output/cache. The bundle
  must have no unhandled relative imports, and a build/import failure is a
  gate failure, not a skipped scenario. The direct `test:web:run` script must
  run `pnpm run test:prepare:web:bundle && node ./out/test/runWebTest.js`.
  This closes the `test:full` route, which calls `test:web:run` directly after
  its general build/test compilation; it does not call `test:web` or recurse
  into `test:web:run`. Validate that direct route from a clean checkout with
  `pnpm run test:prepare && pnpm run test:web:run`.
- Feasibility boundary: WEB-7 imports the Slice 7 command/localization/steps
  seams and runs activation/registration plus the injected no-active-editor
  command core. WEB-8 uses future Slice 8 command/artifact/Explorer seams with
  in-memory doubles; WEB-9 uses future Slice 9 transport/bridge seams with
  controlled post-message ports; WEB-10 uses future Slice 10
  session/panel/bootstrap seams with controlled sidecar and parent handles.
  WEB-8 and WEB-10 are host-composition claims only, not interactive UI or
  real Calendar Webview DOM claims. Any unresolved Node/VS Code-only import
  blocks the relevant claim and is recorded as residual risk.
- Approval boundary: the prior Slice 7 three-production-file/five-test
  approval is superseded for this delta. Final independent plan review is
  `Ready` with no findings and Human Approval is `Approved` on 2026-09-12 for
  the exact harness/config paths plus the existing Slice 7 production/test
  scope. Focused replan/state commit `800612e4` is complete; current Slice 7
  production changes remain preserved.

## Web Smoke Scenario Traceability

After the web-harness replan was reviewed, approved, committed, and executed,
the bundle-backed scenarios below define the exact web-host evidence for the
affected slices. WEB-7 execution is recorded in the Slice 7 evidence below;
WEB-8 through WEB-10 remain planned claims for later slices:

<!-- markdownlint-disable MD013 -->

| Scenario | Slice | Evidence                                                                                                                                                                               | Not claimed                                                                                                                                                                                              |
| -------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WEB-7`  | 7     | Extension activation and Semantic Diff/copy/save command registration; command-core no-active-editor guard with no read/report/session side effect.                                    | Interactive Quick Pick, file/Git dialogs, and their full source-selection matrix; those remain desktop-focused evidence.                                                                                 |
| `WEB-8`  | 8     | Deterministic in-memory command artifact/report/Explorer finalization and one cleanup path through controlled host doubles.                                                            | Registered-command interactive UI or Explorer Webview DOM execution.                                                                                                                                     |
| `WEB-9`  | 9     | Controlled bridge port/target lifecycle covering request numbering, accepted session/failure messages, malformed/cross-session/stale rejection, unsubscribe, and disposal suppression. | A real `window.vscode` or Calendar Webview DOM handshake; exhaustive transport/bridge behavior remains in focused tests.                                                                                 |
| `WEB-10` | 10    | Controlled schedule-aware Explorer session composition covering sidecar registration, successful parent disposal, open failure rollback, and idempotent release.                       | Real Calendar `WebviewPanel` DOM/message lifecycle is not claimed because no public Calendar panel action is wired and Calendar Slice 3 is excluded; it remains an explicit host-boundary residual risk. |

<!-- markdownlint-enable MD013 -->

The web scenarios remain additive characterization coverage in the existing
test file. The new bundle entry/config and runner/script wiring are test-only;
production web output, public schema, Calendar Slice 3, Dependabot, and
dependencies remain unchanged.

## Slice 6 Implementation Evidence (2026-09-12)

- Status: Complete; independent implementation review `Ready` with no
  findings; Completion Approval `Approved` on 2026-09-12 under the user's
  automatic no-findings slice approval policy; completion commit `3af9494d`.
- Revised plan review is `Ready`, Human Approval is explicit, and focused
  replan/state commit `2734813c` is complete.
- Production paths changed: `VscodeGitHeadContentProvider.ts`,
  `VscodeGitHeadDefinitionSourceAdapter.ts`,
  `VscodeGitHeadApiResolution.ts`, `VscodeGitHeadPathGuards.ts`, and
  `VscodeGitHeadObjectPipeline.ts`. The three new modules are private
  infrastructure seams and are not exposed through the application port.
- Test paths added: `vscodeGitHeadApiResolution.test.ts` (6),
  `vscodeGitHeadPathGuards.test.ts` (3), and
  `vscodeGitHeadObjectPipeline.test.ts` (4). The existing
  `vscodeGitHeadDefinitionSourceAdapter.test.ts` (adapter/provider 13) is
  unchanged. Direct TDD execution passed all `26` tests.
- The API/context, path/rename, and object/content seams preserve captured
  HEAD, active-path-first selection, unambiguous rename fallback, receiver
  semantics, object/text guards, unavailable reasons, decoded-byte limits,
  and source/cache release behavior.
- API characterization covers throwing host accessors at their original
  boundaries: `enabled` and `getAPI` accessor failures remain
  `activation-failed`, while a returned API's `getRepository` accessor failure
  remains `api-unavailable`.
- Validation passed: test compile, targeted ESLint, Qlty formatter/check/
  smells over all 11 approved production/test/evidence paths, Markdown lint,
  diff check, architecture dependency tests (25 passing), production build,
  and the full desktop runner (exit 0). Qlty file complexity 98 is cleared;
  no suppression, threshold, baseline, or acceptance exception was added.
- Web validation `rtk pnpm run test:web` exited `0`. Slice 6 evidence is
  limited to the production web build and baseline `webSmoke.ts` run. WEB-7
  through WEB-10 are future Slice 7-10 scenarios and were not executed; no
  Git adapter/provider web execution is claimed. The existing
  `ERR_STREAM_PREMATURE_CLOSE` diagnostic remains observable in the runner.
- Compatibility impact: no public adapter/provider API, application port,
  DTO/schema, VS Code entry point, Node built-in, filesystem, `.git`, Git
  executable, telemetry, dependency, configuration, generated artifact,
  Calendar Slice 3, or Dependabot behavior changed.
- Recommended next route: activation of the exact approved Slice 7 scope and
  its eligible focused state commit. Dependabot documents remain dirty but
  untouched and excluded.

## Slice 7 Prior Activation And Approval Superseded (2026-09-12)

- Status: Superseded by the Slices 7-10 web-harness replan; no active
  implementation approval.
- Basis: Slice 6 completion commit `3af9494d`, independent plan review `Ready`
  with no findings, and the user's automatic no-findings slice approval policy.
- Approved production paths:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`, and
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`.
- Approved test paths:
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`,
  `src/test/suite/semanticDiffSourceCapture.test.ts`,
  `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`, and
  `src/test/suite/webSmoke.ts` (WEB-7).
- Approved boundary: source acquisition, period selection, prepared
  before/after reads, and Git failure localization. Artifact/Explorer
  finalization is out of scope except for private signature changes required
  for compilation; no public command or behavior change is authorized.
- Web boundary: the old direct `webSmoke.ts` claim is superseded because its
  relative imports failed in the WebWorker host. Interactive pickers,
  file/Git dialogs, and the full source-selection matrix remain desktop-only
  evidence.
- State commit gate: superseded and not eligible. The partial Slice 7 command
  production diff remains preserved; newly proposed bundle/config paths are
  not included in this historical approval.

## Refactor Helper Ownership

<!-- markdownlint-disable MD013 -->

| Concern                                | Slice | Allowed owner/location                                                                                                                                                         | Prohibited movement                                              |
| -------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Structural matching/grouping           | 1     | Private pure helpers in domain structural rules                                                                                                                                | No application/presentation identity policy                      |
| Schedule interpretation/run comparison | 2     | Domain schedule services; projection only in `compareScheduleDiff.ts`                                                                                                          | No host calendar/locale or presentation policy                   |
| Root/candidate/issue side mapping      | 3     | Private contexts and side mappers in `semanticDiffScheduleImpact.ts`                                                                                                           | No new public DTO or cross-layer helper                          |
| Run/timeline/source phases             | 4     | Private matching, projection, validation helpers in the same application file                                                                                                  | No weakened validation/schema change                             |
| Report line assembly                   | 5     | Private helpers in `semanticDiffMarkdownLocalization.ts`                                                                                                                       | No domain decisions in presentation                              |
| Git path/object/cache                  | 6     | Private infrastructure seams in `VscodeGitHeadApiResolution.ts`, `VscodeGitHeadPathGuards.ts`, and `VscodeGitHeadObjectPipeline.ts`, composed by the existing adapter/provider | No filesystem, Git executable, `.git`, Node built-in             |
| Command error/source/output workflow   | 7-8   | Private types, contexts, continuations in existing command files                                                                                                               | No `FlowContents.tsx`, telemetry, or public command change       |
| Calendar message validation            | 9     | Private validator helpers in transport; bridge state stays in bridge                                                                                                           | No trust relaxation or domain import into bridge                 |
| Panel/session/parent lifetime          | 10    | Private panel/session helpers; concrete composition in bootstrap                                                                                                               | No presentation object in application/domain or Calendar Slice 3 |

<!-- markdownlint-enable MD013 -->

## Acceptance Coverage Notes

- Existing expected values are the compatibility baseline. Changing them
  requires Replanning.
- The new bridge test in Slice 9 is the only planned new test file. Other test
  changes, including `WEB-7` through `WEB-10` in the existing `webSmoke.ts`,
  are conditional characterization additions in listed files.
- Earlier slices may leave only findings explicitly owned by later slices.
  Complete local success is mandatory after Slice 10.
- `rtk pnpm run test:web` runs `runWebTest.ts`, which must load the generated
  `webSmoke.bundle.js` after the harness replan; it does not prove that every
  focused desktop suite runs in a web host. The concrete Webview panel DOM and
  in-panel script boundary therefore remains an explicit host-boundary
  residual risk; desktop session/wiring suites remain the planned evidence for
  observable host composition. A bundle/import failure is not a skipped
  success.
- Remote confirmation occurs after all approved commits are published. It does
  not replace local validation or independent per-slice review.

## Slice 7 Implementation Evidence (2026-09-12)

- Status: Implementation complete; independent implementation review and
  Completion Approval are complete. Review base is approved replan/state
  commit `800612e4`; no completion commit was created.
- Production paths: `semanticDiffCommand.ts`,
  `semanticDiffCommandLocalization.ts`, and `semanticDiffCommandSteps.ts`.
  Test/harness paths: `package.json`, `webpack.web-test.config.js`,
  `src/test/suite/webSmokeWebEntry.ts`, `src/test/runWebTest.ts`, and
  `src/test/suite/webSmoke.ts`, all within the revised approval boundary.
- The command workflow now shares private typed continuations for active
  editor, source, period, prepared before/after, file, Git, and localized Git
  failure phases. Existing one-read, cancellation, source-byte, captured-HEAD,
  error-code/reason/retryability, cleanup, and telemetry behavior is preserved;
  no public command, DTO, schema, or host API changed.
- The isolated test-only WebWorker bundle derives the existing web target's
  browser-safe fallbacks, `commonjs vscode` external, and CSP-safe production
  settings. `runWebTest.ts` loads the emitted `webSmoke.bundle.js`, and the
  explicit `.js` suffix is required by the WebWorker loader's extension
  resolution. Production webpack entries and dependencies remain untouched.
- WEB-7 passed in the real Chromium host via the required clean route
  `pnpm run test:prepare && pnpm run test:web:run` (exit `0`), with exact
  observed counts `browser=1`, `sourceReads=0`, `reports=0`, and `sessions=0`.
  Activation, command registration, injected `no-active-editor`, and absence
  of read/report/session side effects were verified. Existing later viewer
  smoke activity retains known `EPIPE`/`ERR_STREAM_PREMATURE_CLOSE` stream
  diagnostics. WEB-8 through WEB-10, interactive pickers/dialogs, and real
  Explorer/Calendar Webview DOM behavior are not claimed.
- Desktop `pnpm test` passed with exit `0`, covering 68 approved Slice 7 test
  cases (43 command, 5 period, 7 source capture, 13 Git adapter). Production
  `pnpm run build` passed with existing bundle-size warnings. `pnpm run
test:compile`, scoped Qlty check (`No issues`), final scoped smell inventory,
  Markdown lint, and `git diff --check` passed.
- Slice 7-owned Qlty findings are clear. The retained smell inventory belongs
  to Slice 8 artifact/Explorer/finalization functions and whole-file
  complexity: `buildWorkflowArtifacts`, `openWorkflowArtifacts`,
  `runFileComparisonWorkflow`, `buildPresentationArtifactsStep`,
  `openExplorerStep`, `registerSourceBinding`, `beginWorkflowCapture`,
  `beginPresentationSourceCapture`, `buildExplorerContextStep`, and
  `executeCompareSemanticDiffCommand`.
- Compatibility and readiness: no VS Code engine change, Node built-in,
  filesystem/Git behavior, dependency, lockfile, telemetry payload, public
  schema, Calendar Slice 3, Dependabot, or production bundle change was
  introduced. The known stream diagnostics and unclaimed Webview DOM boundary
  remain explicit residual risks for later integrated validation.
- Recommended route: independent implementation review, then explicit
  Completion Approval is satisfied by the user's standing automatic
  no-findings slice-approval instruction after reviewer verdict `Ready` with
  no findings. Exact changed paths approved for the completion commit are
  `package.json`, `webpack.web-test.config.js`,
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`,
  `src/test/runWebTest.ts`, `src/test/suite/webSmoke.ts`,
  `src/test/suite/webSmokeWebEntry.ts`, and this feature's `TASKS.md` and
  `TRACEABILITY.md`. The four focused desktop test files remain unchanged
  validation-only paths. WEB-8 through WEB-10 remain later approved slices;
  no stage/commit was performed here.

## Slice 8 Activation And Approval (2026-09-13)

- Status: Superseded by the Slice 8 complexity replan for its single-file
  production boundary; the recorded behavior, test, WEB-8, and exclusion
  scope remains preserved.
- Basis: the complete ten-slice plan and independent plan review `Ready` with
  no findings; Slice 7 implementation review `Ready` with no findings and
  completion commit `b0095565`; the user's standing automatic no-findings
  slice-approval instruction and current authorization to continue the
  approved slices.
- Prior exact production path:
  `src/presentation/vscode/commands/semanticDiffCommand.ts` only.
- Exact test paths:
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/semanticDiffFlowHighlights.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`, and
  `src/test/suite/webSmoke.ts` for WEB-8.
- Exact evidence paths: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Prior scope and acceptance: simplify artifact building, source binding,
  Explorer/report opening, compatibility flow, and final result handling;
  preserve comparison/open counts, binding/rollback, Explorer defaults,
  copy/save actions, Flow focus/highlights, sidecar context, result codes,
  telemetry, and cleanup. Private signature changes are allowed only when
  required for this slice to compile. The prior boundary did not authorize
  new module paths.
- Web validation: run WEB-8 through the committed bundle-backed WebWorker
  harness with deterministic in-memory source, artifact, report/open,
  Explorer, and session doubles. Interactive pickers, file dialogs,
  registered-command UI, and Explorer Webview DOM execution remain
  unclaimed.
- State commit gate: superseded for the single-file boundary; the then-revised
  six-module plan was itself superseded by the current eight-helper plan and
  required independent plan review and new Human Approval before its focused
  state commit. This historical activation does not
  authorize runtime, test, generated artifact, configuration, dependency,
  `CHANGELOG.md`, Calendar Slice 3, Dependabot, or Slice 9-10 changes.

## Slice 8 Complexity Replanning (2026-09-13)

- Finding and evidence: the partial Slice 8 implementation kept the new
  artifact/Explorer helpers in `semanticDiffCommand.ts`. Targeted Qlty measured
  file total complexity `254` before and `253` after extraction, while the
  configured threshold is `55`; the same-file boundary therefore cannot clear
  the merge blocker. Test compilation, relevant desktop checks, test-only web
  bundle/build, and the desktop runner passed for the partial change. WEB-8
  was not implemented or claimed, and no completion review or commit exists.
- Smallest revised boundary: move existing private phases into eight genuine
  command-owned modules while preserving `semanticDiffCommand.ts` as the
  public contract and finalization boundary. The bounded review requires
  separate period orchestration and execution seams in addition to the
  original six. No product behavior, public API, DTO, command/action,
  dependency, or production webpack change is added; Qlty suppression,
  ignores, baseline manipulation, threshold changes, and architecture
  exceptions remain prohibited.
- Revised production paths and ownership:
  - `src/presentation/vscode/commands/semanticDiffCommand.ts`: public command
    types/constants, compatibility re-export, dispatch, report/explorer
    finalization, and public execute delegation.
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowInput.ts`:
    after-editor snapshot, source text/size validation, parse failure message
    selection, and the `MAX_SEMANTIC_DIFF_SOURCE_BYTES` re-export.
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowSelection.ts`:
    source-selection pickers, cancellation, source failure projection, and
    selection-to-step mapping.
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowPeriod.ts`:
    period mode/date input, validation, period result projection, and
    `selectWorkflowPeriodStep`; this is the smallest cohesive seam required to
    keep source Selection below the file threshold.
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowSource.ts`:
    before-file/Git reads, Git result guards, source request preparation, and
    every workflow capture descriptor builder, including the builders formerly
    at lines `1161-1187`.
  - `src/presentation/vscode/commands/semanticDiffCommandSourceBinding.ts`:
    every source bind/register/rollback/unregister/release adapter, including
    workflow binding and Explorer cleanup.
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`:
    artifact input/result/error projection, failure mapping, file/calendar
    compatibility orchestration, and artifact opening after binding helpers
    move out.
  - `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`:
    every presentation descriptor/input builder, including the builders
    formerly at lines `1491-1531`, artifact/result projection, Explorer
    context/request, selection, opening, and orchestration.
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`:
    ordered command runner selection and the `commandExecution` dispatch
    responsibility; the public contract remains in command.ts.
- Exact current function ownership (each private function is assigned once):
  - WorkflowInput: `sourceTextFailureDetail`, `sourceSizeFailureDetail`,
    `sourceValidationFailure`, `sourceTextFailure`, `parseFailureKind`,
    `parseFailureMessage`, `readWorkflowEditor`, `snapshotFromWorkflowEditor`,
    `describeWorkflowAfter`, `validateWorkflowAfterText`,
    `workflowAfterSnapshot`, and `readWorkflowAfterSnapshot`.
  - WorkflowSelection: `workflowQuickPick`, `workflowPickItems`,
    `workflowPickOptions`, `selectWorkflowItem`, `selectWorkflowSelection`,
    `sourceSelectionFromItem`, `selectWorkflowSource`, `workflowCancellation`,
    `workflowSourceFailure`, and `selectionToStep`.
  - WorkflowPeriod: `periodValidationMessage`, `showWorkflowInput`,
    `periodModeFromItem`, `selectWorkflowPeriodMode`,
    `workflowFromDateOptions`, `workflowToDateOptions`, `readWorkflowDate`,
    `periodInputsFromValues`, `readWorkflowPeriodValues`,
    `readWorkflowPeriodInputs`, `periodSelectionFromDates`,
    `periodSelectionFromInputs`, `readWorkflowPeriodDates`,
    `selectWorkflowPeriod`, `workflowPeriodFailure`, and
    `selectWorkflowPeriodStep`.
  - WorkflowSource: `readWorkflowBefore`, `readWorkflowDocument`,
    `describeWorkflowBefore`, `selectWorkflowFile`, `readWorkflowSourceFile`,
    `missingGitHeadReader`, `missingGitHeadProvider`,
    `gitHeadDependencyFailure`, `readGitHeadResult`, `validateGitHeadResult`,
    `workflowFromGitHead`, `readWorkflowGitHead`, `prepareWorkflowSource`,
    `beginWorkflowCapture`, `workflowCaptureDependenciesAvailable`,
    `createWorkflowAfterDescriptor`, and `createWorkflowCaptureInput`.
  - SourceBinding: `sourceBindingFailure`, `rollbackSourceCapture`,
    `prepareSourceBinding`, `prepareAndValidateSourceBinding`,
    `rollbackFailedBinding`, `validateSourceBinding`,
    `registerSourceBinding`, `registerSourceEntry`,
    `bindAndRegisterExplorerSources`, `registerPreparedSourceBinding`,
    `createSourceCaptureRelease`, `unregisterAndReleaseWorkflowCapture`,
    `bindWorkflowCapture`, `workflowSourceEntry`, `registerWorkflowSource`,
    and `cleanupExplorerRequest`.
  - WorkflowArtifacts: `buildWorkflowArtifacts`, `createWorkflowRelease`,
    `createWorkflowArtifactInput`, `workflowArtifactResult`,
    `workflowArtifactError`, `workflowOpenFailure`,
    `openRegisteredWorkflowArtifacts`, `openWorkflowArtifacts`,
    `runFileComparisonWorkflow`, `prepareCalendarCompatibilitySource`, and
    `runCalendarCompatibilityWorkflow`.
  - ExplorerWorkflow: `beginPresentationSourceCapture`,
    `createPresentationSourceDescriptors`, `createPresentationCaptureInput`,
    `presentationArtifactInput`, `presentationParseFailure`,
    `presentationArtifactResult`, `presentationArtifactError`,
    `buildPresentationArtifactsStep`, `createExplorerContextStep`,
    `buildExplorerContextStep`, `explorerContextStep`, `explorerRequestStep`,
    `failedExplorerOpen`, `openScheduleAwareExplorer`, `openDefaultExplorer`,
    `openExplorerStep`, `selectExplorerBefore`, and `runExplorerCommand`.
  - WorkflowExecution: `executeWorkflowCommand`, `executeExplorerCommand`,
    `executeReportCommand`, and `commandExecution`.
  - Retained `semanticDiffCommand.ts`: `renderReportStep`,
    `displayReportStep`, `runSemanticDiffCommand`, `finalizeCommandFailure`,
    `finalizeSemanticDiffCommand`, `finalizeExplorerCommand`,
    `finalizeWorkflowExplorerCommand`, and
    `executeCompareSemanticDiffCommand`.
- `workflowFailure` is only the current `const workflowFailure = failedStep`
  alias, not an additional workflow function or module responsibility. Remove
  the alias and call the existing `failedStep` constructor directly from each
  owning helper. This avoids an unowned runtime alias and adds no public
  export, branch, or behavior.
- Bounded review findings and required transformations:
  - `registerSourceBinding` (complexity 5) belongs to
    `semanticDiffCommandSourceBinding.ts`; replace its options-plus-binding
    arguments with one readonly registration context, a pure missing-source
    guard/entry builder, and a small host-call result adapter. Target one
    context parameter and complexity at most `4`.
  - `workflowArtifactResult` (complexity 5, six parameters) belongs to
    `semanticDiffCommandWorkflowArtifacts.ts`; use one readonly result
    context, separate parse-failure release from the successful artifact
    state builder, and preserve exact source/period state. Target one context
    parameter and complexity at most `3`.
  - `workflowOpenFailure` (four parameters) remains an artifact failure
    projection; unregister/release is delegated to the SourceBinding cleanup
    helper, with one readonly failure context and a pure message selector.
    Target one context parameter and complexity at most `3`.
  - `presentationArtifactResult` (four parameters) belongs to
    `semanticDiffCommandExplorerWorkflow.ts`; use one readonly presentation
    result context, a pure parse-failure guard, and a success builder. Target
    one context parameter and complexity at most `3`.
  - `explorerRequestStep` (four parameters) belongs to ExplorerWorkflow; use
    one readonly request context, a pure binding-failure guard, and a ready
    request builder. Target one context parameter and complexity at most `2`.
  - `commandExecution` (complexity 9) remains the command dispatch
    responsibility but moves to `semanticDiffCommandWorkflowExecution.ts`;
    extract pure calendar-capability and ordered runner selectors while
    preserving calendar compatibility, Explorer, and report fallback
    precedence. Target dispatch complexity at most `4`.
- Planned context/guard/adapter helpers are replacements, not parallel paths:
  `SourceBindingRegistrationContext`, `isMissingSourceRegistration`,
  `buildSourceCaptureEntry`, `invokeSourceRegistration`,
  `WorkflowArtifactResultContext`, `isWorkflowParseFailure`,
  `releaseWorkflowCaptureOnFailure`, `buildWorkflowArtifactState`,
  `WorkflowOpenFailureContext`, `selectWorkflowFailureMessage`,
  `PresentationArtifactResultContext`, `isPresentationParseFailure`,
  `buildPresentationArtifactState`, `ExplorerRequestContext`,
  `isExplorerBindingFailure`, `buildExplorerRequest`, `hasCalendarAdapter`,
  `selectCalendarRunner`, and `selectExecutionRunner`. They are private,
  readonly/pure where stated, and add no read, cleanup, notification,
  telemetry event, or public export.
- The period module is the smallest cohesive seam required because assigning
  `selectionToStep` to WorkflowSelection makes the original selection proxy
  `51 + 3 = 54` before context helpers. Moving the period-only functions and
  `selectWorkflowPeriodStep` keeps source selection and period orchestration
  independently below the threshold with margin.
- Context/result rule: these readonly contexts and pure helpers replace the
  existing branches and parameter lists. They must not add a second read,
  cleanup, notification, telemetry event, or public export. Each named
  function and each revised production file requires an actual Qlty check.
- Sizing evidence and targets use the current function-complexity sums behind
  the measured command-file total (`254` before and `253` after the partial
  extraction), not the rejected `<20` SourceBinding assumption:

  | File | Owned proxy | Allowance | Target / margin |
  | --- | ---: | ---: | ---: |
  | WorkflowInput | 27 | +2 | <=29 / 26 |
  | WorkflowSelection | 18 | +4 | <=25 / 30 |
  | WorkflowPeriod | 36 | +6 | <=42 / 13 |
  | WorkflowSource | 45 | +4 | <=50 / 5 |
  | SourceBinding | 48-51 | simplification only | <=50 / 5 |
  | WorkflowArtifacts | 48-49 | replacement only | <=50 / 5 |
  | ExplorerWorkflow | 46-47 | replacement only | <=50 / 5 |
  | WorkflowExecution | 12 | +3 | <=15 / 40 |
  | Retained command.ts | 22 | +4 | <=26 / 29 |

  The WorkflowSelection proxy is `51` minus the period functions plus
  `selectionToStep` (`3`). WorkflowPeriod is `31` for its other period
  functions plus `selectWorkflowPeriodStep` (`5`), giving `36`. WorkflowSource
  is calculated consistently as `39 - 3 + 2 + 5 + 2 = 45`: remove
  `selectionToStep`, add the two descriptor builders, and add
  `beginWorkflowCapture` (`5`) and
  `workflowCaptureDependenciesAvailable` (`2`) that the prior source table
  omitted. The SourceBinding range is the combined bind/cleanup region,
  including workflow adapters; it is not a `<20` module. WorkflowArtifacts is
  the old `56` less its moved binding/cleanup contribution (`7-8`). Explorer
  is `48 + 3` presentation descriptor-builder contribution minus `4-5`
  cleanup-adapter complexity, or `46-47`; each function is counted once. The
  execution proxy is dispatch complexity `9` plus three one-step selectors.

  Every target retains the hard Qlty file gate of `<=55`; the table targets
  intentionally leave margin below that gate and are not passing evidence.

  These are implementation sizing bounds anchored to current Qlty findings
  and ownership, not passing evidence. Each changed file and named function
  requires an actual scoped Qlty result. If any file exceeds `55`, stop and
  return the smallest cohesive seam for another replan.
- Import topology: command.ts imports all helper entry points, including
  WorkflowExecution. Helpers import command contracts with `import type`, use
  generic step combinators from `semanticDiffCommandSteps.ts`, and remain
  one-way: WorkflowPeriod may consume source-picker primitives from
  WorkflowSelection, but WorkflowSelection never imports WorkflowPeriod;
  WorkflowArtifacts consumes WorkflowInput, WorkflowPeriod, WorkflowSource,
  and SourceBinding; ExplorerWorkflow consumes WorkflowInput, WorkflowSource,
  and SourceBinding plus existing report/selection helpers; WorkflowExecution
  consumes artifact/Explorer runners and command contracts type-only. No helper
  imports a command runtime value. The public
  `MAX_SEMANTIC_DIFF_SOURCE_BYTES` export is preserved through WorkflowInput
  and a command.ts re-export, avoiding a runtime cycle. No domain/application
  dependency or Node built-in is introduced.
- Quality and validation boundary: each revised module, including the
  retained command file, must be at or below Qlty file-complexity threshold
  `55`, with no mapped smell. Run the existing Slice 8 command,
  schedule-impact, Explorer/Flow, wiring, and `webSmoke.ts` tests; assert
  WEB-7 regression and WEB-8 success through the committed bundle-backed
  WebWorker harness; run test compile, desktop suite, direct web preparation
  and runner, production build, architecture checks, scoped Qlty, Markdown
  lint, and diff check. Bundle/import failure is a gate failure, not a skipped
  success; existing non-failing stream diagnostics remain recorded.
- Compatibility boundary: preserve one-shot reads, source bytes, deterministic
  ordering, result codes/localization, cancellation without partial sessions,
  captured Git HEAD, report/Explorer outputs, rollback/release timing, and
  telemetry privacy. WEB-7 remains a regression gate and WEB-8 uses
  deterministic in-memory source/artifact/report/Explorer/session doubles;
  interactive pickers, file dialogs, registered-command UI, and real Explorer
  Webview DOM execution remain unclaimed.
- Approval boundary: the prior Slice 8 approval is retained as historical
  behavior/test/harness intent but superseded for its single-file production
  assumption. The eight new helper paths, including WorkflowPeriod and
  WorkflowExecution, and their import topology require independent plan
  review and new explicit Human Approval. The standing automatic no-findings
  completion authorization does not authorize these new design paths. This
  replanning operation changes TASKS/TRACEABILITY only; it does not authorize
  implementation, test, generated artifact, configuration, or commit changes.
  No new durable specification is required.

## Slice 8 Replan Human Approval (2026-09-13)

- Status: Approved and committed for the revised eight-module
  production-path boundary; focused replan/state commit `814d8481`.
- Approved at: 2026-09-13 in the current conversation.
- Approval basis: the revised Slice 8 plan was independently reviewed as
  `Ready` with no findings, and the user explicitly approved this exact
  replan boundary.
- Approved production paths:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowInput.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowSelection.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowPeriod.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowSource.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSourceBinding.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`,
  and
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`.
- Approved test and evidence paths:
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/semanticDiffFlowHighlights.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`,
  `src/test/suite/webSmoke.ts`, and this feature's `TASKS.md` and
  `TRACEABILITY.md`.
- Approved boundary: move existing private command workflow responsibilities
  into the listed command-owned modules, preserve the public command and
  behavior contracts, and apply only the planned context, guard, result, and
  dispatch transformations. No new product behavior, public API, DTO,
  dependency, production webpack change, or architecture exception is
  approved.
- Preserved scope: completed Slices 1-7, the committed test-only web-harness
  replan `800612e4`, Calendar Slice 3, Dependabot, and Slice 9-10 remain
  otherwise unchanged. Slice 8 implementation review is `Ready` with no
  findings and Completion Approval is recorded below; its focused completion
  commit remains pending.
- Recommended next route: delegate the exact approved Slice 8 completion paths
  to `approval-committer` for one focused completion commit.

## Slice 8 Implementation Evidence (2026-09-13)

- Status: implementation complete under the approved revised boundary;
  independent implementation review is `Ready` with no findings and
  Completion Approval is `Approved` below; the focused completion commit is
  pending.
- Requirement mapping: the command facade and eight command-owned modules
  cover workflow input, source selection, period selection, source/Git
  preparation, capture binding, artifact construction, Explorer opening, and
  ordered command dispatch. The public command/result contracts remain in
  `semanticDiffCommand.ts`.
- Changed production paths: the nine approved command files only. Changed
  test paths: `src/test/suite/semanticDiffCommand.test.ts`, adding the
  missing-registration cleanup characterization, and
  `src/test/suite/webSmoke.ts`, adding WEB-8 deterministic in-memory
  artifact/Explorer success and open-failure rollback assertions.
- Review correction: missing source-registration capability now performs one
  release without optional unregister, while an attempted registration that
  throws still performs unregister plus release. The approved command suite
  covers both outcomes.
- Desktop validation: `pnpm run test:prepare:desktop` and the full desktop
  runner exited `0`; this includes the architecture dependency suite.
- Web validation: the approved isolated bundle compiled and the real
  Chromium WebWorker runner exited `0`. It reported `WEB-7 passed:
  browser=1 sourceReads=0 reports=0 sessions=0` and `WEB-8 passed:
  bindings=2 registrations=2 opened=1 rollbacks=1`. Existing non-failing
  `EPIPE`/`ERR_STREAM_PREMATURE_CLOSE` stream diagnostics remain after the
  successful scenarios.
- Quality/build validation: `pnpm run test:compile`, production `pnpm run
  build`, scoped Qlty `check` and `smells --no-snippets` for the nine
  production paths and `webSmoke.ts`, `pnpm run lint:md`, and `git diff
  --check` passed. Qlty reported no issues, including no function or file
  complexity finding above threshold `55`.
- Compatibility and production readiness: one-shot reads, exact source bytes,
  cancellation, ordering, Git HEAD capture, result codes/localization,
  binding rollback/release, Explorer/report output, telemetry privacy,
  desktop/web entry points, and VS Code/browser compatibility remain intact.
  No dependency, lockfile, production webpack, README, or CHANGELOG update
  was needed.
- Remaining risk: interactive pickers/dialogs and real Explorer Webview DOM
  remain outside the approved WEB-8 host-composition boundary and continue to
  be covered by focused desktop characterization suites.
- Recommended route: independent implementation review is `Ready` with no
  findings and Completion Approval is recorded below; delegate the exact path
  set to `approval-committer` for its focused completion commit.

## Slice 8 Completion Approval (2026-09-13)

- Status: Approved under the user's explicit standing automatic no-findings
  slice-approval policy.
- Approved at: 2026-09-13 in the current conversation.
- Basis: independent implementation review `Ready` with no findings after the
  P2 registration-cleanup correction; review base and approved replan/state
  commit are `814d8481`.
- Exact approved completion paths:
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowInput.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowSelection.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowPeriod.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowSource.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSourceBinding.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`,
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/webSmoke.ts`, this `TASKS.md`, and
  `TRACEABILITY.md`.
- Completion evidence: compile, desktop runner, production build, real
  WEB-7/WEB-8 runner, scoped Qlty, Markdown lint, and diff checks are recorded
  in the implementation evidence above; the P2 regression test confirms a
  missing registration callback releases once without optional unregister.
- Commit status: completion commit is pending the exact
  `approval-committer` gate. No stage or commit was performed by this role.
- Preserved boundary: Slice 9 and later remain unapproved and must not begin
  until this exact completion commit succeeds and a new slice approval gate is
  recorded.
- Recommended next route: delegate the exact approved completion paths to
  `approval-committer` for one focused Slice 8 completion commit.
