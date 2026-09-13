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
| Remote quality-gate completion remediation | Requirements; Acceptance Criteria                 | 11       | `scheduleImpactCalendarTransport.test.ts`, unchanged Bridge regression suite, pinned Prettier `3.6.2` default-config fallback validation for this feature's `TASKS.md`/`TRACEABILITY.md` and `docs/specs/features/schedule-impact-calendar/TASKS.md`, followed by authoritative remote Cloud Qlty `fmt`, plus focused compile/Qlty/security/remote PR gates; direct closed-discriminant dispatch with strict JSON/protocol compatibility                                                     |
| PR #317 local Qlty gate                    | Requirements; Acceptance Criteria                 | 1-11     | Per-slice ownership; final `rtk pnpm run qlty` after Slice 11; no suppression, ignore, threshold, baseline, architecture, dependency, or generated change                                                                                                                                                                                                                                                                                                                                    |
| PR #317 remote Qlty/security gate          | Requirements; Acceptance Criteria                 | After 11 | Publish committed slices; remote Verify, `qlty check`, `qlty fmt`, and CodeQL all successful; authenticated Cloud evidence for build `01a0989c-5572-7169-87b4-43f4728ad729` is recorded in Slice 11                                                                                                                                                                                                                                                                                          |
| Desktop/web and VS Code `^1.75.0`          | Compatibility                                     | 1-11     | Focused Transport/Bridge regression suites; final desktop runner and production build; bundle-backed `rtk pnpm run test:web` must report WEB-7 through WEB-10 as defined in `TASKS.md`; architecture and package-manifest tests                                                                                                                                                                                                                                                              |
| Preserve excluded work                     | Overlap Decision; Non-Goals                       | 1-11     | Diff confirms Dependabot docs/patch/dependencies, Calendar Slice 3, parser/generated, Qlty config, README/use cases/roadmap, `FlowContents.tsx`, `pnpm-lock.yaml`, and all paths outside Slice 11's exact production/test/formatter boundary unchanged by this feature                                                                                                                                                                                                                       |

<!-- markdownlint-enable MD013 -->

## Slice Dependency Chain

Slices 1 through 10 run in numeric order, followed by Slice 11's bounded
remote quality-gate correction, integrated local validation, the remote PR
gate, and Feature Exit.

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
  replan/state commit `814d8481` is complete; independent implementation
  review is `Ready` with no findings, Completion Approval is `Approved`, and
  completion commit `483216a1` is complete.
- Slice 8 replan approval gate: Human Approval is `Approved` on 2026-09-13
  for the exact nine production paths, seven test/validation paths, and the
  two evidence docs recorded below; focused replan/state commit `814d8481` and
  completion commit `483216a1` are complete.
- Slice 9 prior activation gate: initial two-path approval/state commit
  `77bc1889` is superseded for the production-path boundary because partial
  Transport work left file complexity at `95` against the hard threshold
  `55`. The partial Transport diff remains preserved.
- Slice 9 current replan gate: independent replan review
  `slice9_replan_review` is `Ready` with no findings, and the revised
  three-production-path boundary is Human Approved on 2026-09-13 in the
  current conversation. Its focused replan/state commit `f0217e2f` and
  completion commit `85d2e520` are complete. Slice 9 implementation and
  independent implementation review are complete with no findings; Completion
  Approval is `Approved` under the standing automatic no-findings policy on
  2026-09-13. The partial Transport diff is preserved within the completed
  implementation.
- Slice 10 current replan gate: the existing Panel/Registry/Bootstrap paths
  were measured before activation; Panel file complexity is `73` against the
  hard threshold `55`, with `openScheduleImpactCalendarPanel` at `64` and
  `12` returns. A minimal internal Panel runtime seam is therefore required;
  independent replan review `slice10_replan_review` is `Ready` with no
  findings, and Human Approval is `Approved` on 2026-09-13. Its focused
  replan/state commit `f83b379a`, implementation, independent implementation
  review, Completion Approval, and completion commit `089b3825` are complete.
- Slice 10 completion gate: independent implementation review was `Ready` with
  no findings, Completion Approval was `Approved` under the standing
  automatic no-findings policy, and completion commit `089b3825` is complete.
- Feature Exit gate: the post-ten-slice Feature Exit verdict is `DoNotClose`
  because authenticated remote evidence still reports the Transport CodeQL
  finding and exactly three Qlty formatter paths. Slice 11 independent plan
  review is `Ready` with no findings and prior Human Approval is `Approved` on
  2026-09-13; focused planning-state commit `3358e5f0` is complete. The
  formatter-validation fallback is independently reviewed `Ready` and Human
  Approved at `2026-09-13T15:57:35+09:00`; the runtime/test implementation
  remains uncommitted.
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

Slice 9's revised ownership moves the strict JSON policy to the planned
`scheduleImpactCalendarJson.ts` helper while protocol validators remain in
Transport and mutable bridge state/lifecycle remains in Bridge.

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

  | File                | Owned proxy |           Allowance | Target / margin |
  | ------------------- | ----------: | ------------------: | --------------: |
  | WorkflowInput       |          27 |                  +2 |       <=29 / 26 |
  | WorkflowSelection   |          18 |                  +4 |       <=25 / 30 |
  | WorkflowPeriod      |          36 |                  +6 |       <=42 / 13 |
  | WorkflowSource      |          45 |                  +4 |        <=50 / 5 |
  | SourceBinding       |       48-51 | simplification only |        <=50 / 5 |
  | WorkflowArtifacts   |       48-49 |    replacement only |        <=50 / 5 |
  | ExplorerWorkflow    |       46-47 |    replacement only |        <=50 / 5 |
  | WorkflowExecution   |          12 |                  +3 |       <=15 / 40 |
  | Retained command.ts |          22 |                  +4 |       <=26 / 29 |

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
  findings, Completion Approval is `Approved`, and completion commit
  `483216a1` is complete.
- Recommended next route: activate the exact approved Slice 9 transport and
  bridge paths under the unchanged reviewed plan.

## Slice 8 Implementation Evidence (2026-09-13)

- Status: implementation complete under the approved revised boundary;
  independent implementation review is `Ready` with no findings and
  Completion Approval is `Approved`; completion commit `483216a1` is complete.
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
- Commit status: complete; exact Slice 8 completion commit `483216a1`.
- Preserved boundary: Slice 9 is activated below under its reviewed and
  Human Approved revised scope; Slice 10 remains unapproved.
- Recommended next route: delegate the exact approved Slice 9 replan paths
  below to `approval-committer` for one focused replan/state commit.

## Slice 9 Activation And Approval (2026-09-13)

- Status: Superseded by the Slice 9 validation-boundary replan below.
- Basis: initial activation commit `77bc1889` recorded the two existing
  production paths before partial Transport implementation exposed an
  unresolved file-level Qlty blocker.
- Prior approved production paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts` and
  `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`.
- Prior approved test paths:
  `src/test/suite/scheduleImpactCalendarTransport.test.ts`,
  `src/test/suite/scheduleImpactCalendarBridge.test.ts`, and
  `src/test/suite/webSmoke.ts` for `WEB-9`.
- Prior approved boundary: simplify existing transport/bridge behavior without
  message, API, or UI changes. The new JSON helper module was not included.
- State commit gate: superseded and not eligible. The partial Transport
  implementation remains preserved; revised plan review and new Human Approval
  are required before further implementation or a state commit.

## Slice 9 Replanning (2026-09-13)

- Trigger and evidence: after activation commit `77bc1889`, partial Transport
  extraction reduced file total complexity from `113` to `95`, while the hard
  Qlty file threshold remains `55`. The Bridge and WEB-9 scenario are
  untouched; test compilation passed for the partial Transport change, but no
  completion review or completion commit exists.
- Why the plan cannot continue unchanged: same-file helper movement leaves the
  measured Transport total above the gate across strict JSON traversal/size
  policy and protocol envelope/field/error decisions. Suppression, ignore
  rules, baseline manipulation, threshold relaxation, and trust weakening are
  prohibited.
- Smallest revised boundary: add one command-owned browser-safe JSON helper
  module and simplify the retained Transport and Bridge in their existing
  ownership paths. This is an internal responsibility move only; public
  message types, constructors, parser/serializer results, bridge API,
  Calendar Slice 3, and production webpack remain unchanged.
- Revised exact production paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`, new
  `src/presentation/vscode/webview/scheduleImpactCalendarJson.ts`, and
  `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`.
- Exact function ownership, with each responsibility assigned once:
  - `scheduleImpactCalendarJson.ts`: `JsonNodeKind`, scalar-kind dispatch,
    `classifyJsonNode`, `hasOnlyJsonArrayKeys`, `allChecksPass`,
    `hasJsonArrayElements`, `isJsonArray`, `isJsonObject`, `isJsonValue`, and
    `encodedJsonBytes`. The classifier uses table-driven scalar/container
    decisions; array traversal keeps sparse-array detection and recursive
    ancestor tracking; object traversal keeps plain-prototype, symbol,
    `toJSON`, and cycle rejection.
  - `scheduleImpactCalendarTransport.ts`: public transport types/constants and
    constructors; `ownKeys`, `isPlainRecord`, `isSessionId`, `isRequestId`,
    `matchesSession`, `matchesRequestId`, `matchesRequestOptions`,
    `invalidResult`, `validResult`, `withMessageSize`, `isRequestType`,
    `requestEnvelope`, `messageSizeError`, `validateRequestShape`,
    `validateRequest`, `errorCodes`, `isErrorDetail`, `validateError`,
    `hostEnvelope`, `hasCloseFields`, `validateClose`, `hasSessionFields`,
    `validateSession`, `hasFailureFields`, `validateFailure`, the host
    validator table, `validateHostShape`, `validateHostMessage`, public
    parse/validate predicates, and serialization. Ordered protocol field
    predicates and separate session/request error helpers preserve invalid,
    unknown-session, stale-request, and payload-too-large precedence.
  - `scheduleImpactCalendarBridge.ts`: retain
    `createScheduleImpactCalendarBridge` as the public factory; extract the
    closed-state request sender, host-message acceptance, listener
    registration/removal, and idempotent disposal operations as private
    closure-owned helpers. The bridge alone owns request numbering,
    `latestResponseId`, listener state, and post-dispose suppression.
- Required complexity simplification: current Qlty findings
  `classifyJsonNode` (`10`), `hasJsonArrayElements` (`7`), `isJsonValue` (`11`
  and five returns), `messageSizeError` (`5`), `validateRequestShape` (`7`),
  `isErrorDetail` (`6`), and `validateFailure` (`11`) must each be rewritten
  through ordered decision data, pure guards, or result builders without
  protocol precedence change. Bridge findings are
  `createScheduleImpactCalendarBridge` (`26` and five returns) and
  `onWindowMessage` (`10`); extracted helpers must leave the public factory
  and callback at no more than four complexity and four returns.
- Sizing evidence and hard targets (targets are not passing evidence):

  <!-- markdownlint-disable MD013 -->

  | Revised file                         | Current evidence                                                                                                                |                                              Target |
  | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------: |
  | `scheduleImpactCalendarJson.ts`      | JSON classifier/recursive group includes measured `10`, `7`, and `11` findings; helper contribution must be measured after move | file `<=50`, each function `<=4` complexity/returns |
  | `scheduleImpactCalendarTransport.ts` | current total `95`, including JSON group and measured protocol findings `5`, `7`, `6`, `11`                                     |                        file `<=50`, no mapped smell |
  | `scheduleImpactCalendarBridge.ts`    | factory `26`/five returns; callback `10`                                                                                        |                        file `<=45`, no mapped smell |

  <!-- markdownlint-enable MD013 -->

  Every revised file requires an actual scoped Qlty `fmt`, `check`, and
  `smells --no-snippets` result. The hard gate remains `<=55`; if any revised
  file or named function exceeds its target or retains a mapped smell,
  implementation stops and returns the smallest further seam for another
  replan. No fabricated module total, suppression, or acceptance exception is
  allowed.

- Preserved JSON and protocol behavior: strict plain JSON only; finite numbers,
  null, strings, and booleans remain accepted; undefined, functions, symbols,
  bigint, non-plain prototypes, own symbols, own `toJSON`, sparse arrays,
  cycles, getter/serialization failures, and oversized encoded payloads remain
  rejected with the existing result codes. Branded/session/request IDs,
  malformed envelope rejection, error detail shape, session matching, stale
  ordering, and serialization byte limits remain exact.
- Revised validation: add transport edge-case characterization in the existing
  transport test path for prototypes, symbols, `toJSON`, sparse arrays,
  circular values, non-finite numbers, byte boundaries, and error precedence;
  add the planned direct Bridge lifecycle test; execute WEB-9 through the
  committed bundle-backed `test:web` route using controlled post-message port
  and event-target doubles. Run test compile, focused desktop tests, the
  desktop runner, production build, architecture dependency checks, scoped
  Qlty format/check/smells, Markdown lint, and `git diff --check`. Real
  Calendar Webview DOM and `window.vscode` handshake remain unclaimed.
- Approval boundary: the prior `77bc1889` two-path activation is superseded
  for its production-path assumption. The new JSON module, its import edge,
  and revised function ownership require independent plan review and new
  Human Approval. No implementation, test, generated artifact, configuration,
  dependency, public message type, Calendar Slice 3 UI, or Slice 10 change is
  authorized by this replan alone.
- Dependencies: Slice 8 completion commit `483216a1` and committed web-harness
  replan `800612e4`; partial Transport work remains the review base.

## Slice 9 Replan Human Approval (2026-09-13)

- Status: Human Approved for the revised three-production-path
  validation-boundary replan; focused replan/state commit `f0217e2f` is
  complete. Implementation and independent implementation review are
  complete; the review is `Ready` with no findings and Completion Approval is
  `Approved` under the standing automatic no-findings policy on 2026-09-13.
- Approved at: 2026-09-13 in the current conversation, after the user's
  explicit `承認します`.
- Independent review: `slice9_replan_review` is `Ready` with no findings.
- Approved production paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarJson.ts`, and
  `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`.
- Approved test and validation paths:
  `src/test/suite/scheduleImpactCalendarTransport.test.ts`,
  `src/test/suite/scheduleImpactCalendarBridge.test.ts`, and
  `src/test/suite/webSmoke.ts` for `WEB-9`.
- Approved evidence paths: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Boundary: the JSON helper remains internal and adds no public API, message
  type, dependency, configuration, Calendar Slice 3 UI, or Slice 10 scope;
  the partial Transport implementation remains preserved. Completion Approval
  is recorded; the completion commit gate is the next operation.
- Next route: delegate the exact Slice 9 changed paths to the independent
  implementation reviewer. No stage or commit was performed by this
  implementation handoff.

## Slice 9 Implementation Evidence (2026-09-13)

- Status: Implementation complete under the approved revised boundary;
  independent implementation review is `Ready` with no findings and
  Completion Approval is `Approved` under the standing automatic no-findings
  policy on 2026-09-13; completion commit `85d2e520` is complete.
- Review base and state gate: revised plan/state commit `f0217e2f`, with
  independent replan review `Ready` and Human Approval `Approved`.
- Requirement mapping: strict browser-safe JSON validation and encoded-byte
  policy remain transport-owned through the internal JSON helper; public
  transport constructors and result types remain unchanged. The browser
  bridge keeps request numbering, response cursor filtering, listener
  registration/removal, and idempotent disposal in closure-owned state.
- Changed production paths: `scheduleImpactCalendarTransport.ts`, new
  `scheduleImpactCalendarJson.ts`, and
  `scheduleImpactCalendarBridge.ts`. Changed test paths:
  `scheduleImpactCalendarTransport.test.ts`,
  `scheduleImpactCalendarBridge.test.ts`, and `webSmoke.ts` for WEB-9.
- Review correction: host validator dispatch uses a `Map` instead of a
  prototype-bearing object lookup, so reserved malformed types (`__proto__`,
  `valueOf`, and `constructor`) safely reject as `invalid-request`; focused
  Transport and Bridge tests cover the regression.
- Compatibility evidence: branded IDs, monotonic request IDs, session matching,
  stale detection, failure details, strict rejection of non-finite values,
  non-plain prototypes, symbols, toJSON, sparse arrays, cycles, and
  serialization failures, default/custom byte limits, listener cleanup, and
  post-dispose suppression remain covered. No public message type, command,
  Calendar Slice 3 UI, VS Code engine, Node dependency, telemetry payload, or
  production webpack entry changed.
- Validation evidence: `rtk pnpm run test:compile` passed; direct Transport
  and Bridge suites passed with `8 passing`; desktop preparation and the full
  VS Code runner exited `0`, including architecture dependency checks.
  Production `rtk pnpm run build` exited `0` with only existing bundle-size
  warnings. Scoped Qlty `fmt`, `check`, and `smells --no-snippets` over all
  three production paths reported no issues. Markdown lint and
  `git diff --check` passed.
- Web evidence: the prepared isolated test bundle and real Chromium WebWorker
  runner exited `0` under required host permission. It reported `WEB-7 passed:
browser=1 sourceReads=0 reports=0 sessions=0`, `WEB-8 passed:
bindings=2 registrations=2 opened=1 rollbacks=1`, and `WEB-9 passed:
requests=2 accepted=2 adds=1 removes=1`. The initial unprivileged Chromium
  launch failed at MachPort startup and was not counted. Known non-failing
  `ECONNRESET`/`EPIPE`/`ERR_STREAM_PREMATURE_CLOSE` stream diagnostics remain
  after scenario completion.
- Production readiness: input remains distrusted and bounded by the existing
  traversal and encoded-byte limit; bridge disposal is idempotent and removes
  its listener once. Real Calendar Webview DOM and `window.vscode` handshake
  execution remain explicitly unclaimed by WEB-9.
- Documentation impact: only this feature's `TASKS.md` and `TRACEABILITY.md`
  evidence paths changed; no README, CHANGELOG, dependency, or durable product
  specification update is required.
- Implementation feedback: decision data and typed result builders preserve
  invalid/unknown/stale/too-large precedence, while closure-owned Bridge state
  keeps the browser contract narrow and prevents post-dispose activity.
- Unresolved risk: concrete Calendar Webview DOM integration remains outside
  this slice and is retained for the unapproved Calendar host/session work in
  Slice 10.
- Recommended route: delegate the exact approved paths to the
  approval-committer for the completion commit gate. Slice 10 remains
  unapproved.

## Slice 9 Completion Approval (2026-09-13)

- Status: Approved under the user's explicit standing automatic no-findings
  slice-approval policy.
- Approved at: 2026-09-13 in the current conversation.
- Basis: independent implementation review is `Ready` with no findings;
  review base and approved replan/state commit are `f0217e2f`.
- Exact approved changed paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarJson.ts`,
  `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`,
  `src/test/suite/scheduleImpactCalendarTransport.test.ts`,
  `src/test/suite/scheduleImpactCalendarBridge.test.ts`,
  `src/test/suite/webSmoke.ts`, this `TASKS.md`, and `TRACEABILITY.md`.
- Completion evidence: strict transport validation and reserved-type lookup
  correction, focused Transport/Bridge tests, WEB-7/WEB-8/WEB-9, desktop and
  architecture checks, production build, scoped Qlty, Markdown lint, and diff
  checks are recorded above.
- Commit status: completion commit `85d2e520` is complete for the exact
  approved paths.
- Preserved boundary: Slice 10 remains unapproved and no Calendar Slice 3 or
  unrelated production scope is authorized.

## Slice 10 Replanning (2026-09-13)

- Trigger/evidence: the existing reviewed three-path Slice 10 plan was checked
  against `.qlty/qlty.toml`, whose file-complexity threshold is `55`.
  `scheduleImpactCalendarPanel.ts` reports file total `73`,
  `openScheduleImpactCalendarPanel` complexity `64` with `12` returns,
  nested `post` complexity `10`, and factory complexity `7`.
  `scheduleImpactCalendarSessionRegistry.ts` reports `open` with five
  parameters and complexity `5`, and `acceptRequest` complexity `5`.
  `createScheduleAwareExplorerSession.ts` reports factory complexity `28` and
  `release` complexity `6`.
- Replan reason: the Panel file already exceeds the hard gate, and private
  helper movement within that file cannot be treated as evidence that its
  total or nested callback complexity will clear. The smallest cohesive seam
  is one private Panel runtime module; Registry overload/context normalization
  and Bootstrap once-only release remain in their existing owners.
- Revised exact production paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`, new
  `src/presentation/vscode/webview/scheduleImpactCalendarPanelRuntime.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`,
  and `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`.
- Runtime helper ownership: panel creation and preparation, strict shell/CSP
  assignment, one shared live-session guard, serialization/error fallback,
  request validation/ready-refresh filtering, listener registration/removal,
  child/panel disposal, registration failure, and rollback. The helper keeps
  `disposed`, `childCleaned`, receive-disposable, and panel-dispose-disposable
  closure state; it returns only `{ panel, dispose }` to the existing Panel
  public composition.
- Existing-path ownership: Panel retains public exports, cache/reuse,
  Registry session creation, runtime invocation, outer rollback, and factory
  handle decoration. Registry retains public overload signatures and session
  identity; its implementation may use a single rest-tuple argument and pure
  input normalization without changing exported call forms. Bootstrap retains
  Explorer opening and sidecar/context composition; once-only release,
  parent-disposal attachment, and handle decoration are private helpers.
- Conservative budgets (not passing evidence): Panel file `<=40`, open
  `<=12` complexity/4 returns, factory `<=4`; new runtime file `<=45` with
  each helper `<=4` and composer `<=8`; Registry file `<=45`, open/accept
  `<=4` and no many-parameters finding; Bootstrap file `<=40`, factory
  `<=12`, release `<=4`. Every revised file must receive actual scoped Qlty
  `fmt`, `check`, and `smells --no-snippets` results; any file above `55` or
  mapped smell is a gate failure and requires another smallest-seam replan.
- Preserved behavior: public exports and overload compatibility, title/CSP
  shell, source capture/privacy, sidecar identity, session filtering, request
  monotonicity, failure messages, parent/child disposal, rollback, listener
  removal, and idempotent release. No Node built-in, new dependency, public
  Calendar action, Calendar Slice 3 UI, or production webpack change is
  included.
- Revised validation paths: existing
  `scheduleImpactCalendarSession.test.ts`,
  `semanticDiffExplorerScheduleImpact.test.ts`,
  `createScheduleAwareExplorerSession.test.ts`,
  `scheduleImpactSidecarRegistry.test.ts`, `extensionSubscriptions.test.ts`,
  `semanticDiffWiring.test.ts`, and `webSmoke.ts`. Add characterization for
  Panel preparation/message rejection/failure post/creation rollback, Registry
  object and legacy overload forms/current-session reuse/stale epoch cleanup,
  and Bootstrap sidecar registration, open failure, parent disposal, explicit
  dispose, and repeated release. `WEB-10` uses controlled sidecar, Explorer,
  panel, and parent handles to assert registration-before-open, successful and
  parent disposal release, open-failure rollback, and one-time release.
  Re-run WEB-7/WEB-8/WEB-9 unchanged to guard prior command, artifact, and
  transport/bridge behavior. Run compile, focused desktop tests, desktop
  runner, production build, architecture checks, scoped Qlty, Markdown lint,
  and `git diff --check`; real Calendar Webview DOM and `window.vscode`
  handshake remain unclaimed.
- Approval boundary: Slice 9 completion commit `85d2e520` is preserved. This
  new runtime module/import edge is a plan-revision change requiring
  independent review and new Human Approval; current Human Approval is
  `Pending`. No runtime/test/config/generated edit or implementation may begin
  from this replan alone.
- Dependencies: Slice 9 completion commit `85d2e520` and committed
  web-harness replan `800612e4`.
- Unresolved risks: panel creation failure cleanup, callback ordering,
  validation/error precedence, stale-session rejection, listener leaks, and
  double release remain explicit implementation-review gates.

## Slice 10 Replan Human Approval (2026-09-13)

- Status: Human Approved for the revised four-production-path boundary;
  focused replan/state commit is pending.
- Approved at: 2026-09-13 in the current conversation after the user's
  explicit `承認します`.
- Independent review: `slice10_replan_review` is `Ready` with no findings.
- Approved production paths:
  `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarPanelRuntime.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`,
  and `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`.
- Approved test and validation paths:
  `src/test/suite/scheduleImpactCalendarSession.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/createScheduleAwareExplorerSession.test.ts`,
  `src/test/suite/scheduleImpactSidecarRegistry.test.ts`,
  `src/test/suite/extensionSubscriptions.test.ts`,
  `src/test/suite/semanticDiffWiring.test.ts`, and
  `src/test/suite/webSmoke.ts` for controlled `WEB-10` and WEB-7/WEB-8/WEB-9
  regression.
- Approved evidence paths: this feature's `TASKS.md` and `TRACEABILITY.md`.
- Boundary: the Panel runtime module is private and preserves existing public
  exports/import layers, Registry overload forms, Bootstrap composition,
  source/privacy behavior, session filtering, rollback, listener cleanup, and
  idempotent release. No Calendar Slice 3, public Calendar action,
  dependency, configuration, production webpack, or new behavior is included.
- Commit gate: `approval-committer` may create one focused replan/state commit
  for these exact docs; implementation and completion review remain later
  gates. No stage or commit was performed here.

## Slice 10 Implementation Evidence (2026-09-13)

- Status: implementation complete under the approved revised four-production-
  path boundary. Independent implementation review and Completion Approval
  remain pending; no completion commit has been made.
- Review base: approved replan/state commit `f83b379a`; independent replan
  review `Ready` with no findings and Human Approval `Approved`.
- Requirement mapping: Panel retains public exports/cache/reuse and delegates
  private panel preparation, strict CSP shell, message serialization/failure
  fallback, request validation and monotonic acceptance, listener cleanup,
  registration rollback, and child/panel disposal to the private runtime
  module. Registry keeps both object and legacy positional `open` calls,
  session identity, epoch semantics, and stale-request rejection. Bootstrap
  keeps sidecar identity and the sole Explorer composition while separating
  registration, once-only release, parent disposal, failure cleanup, and
  returned-handle decoration.
- Changed paths: production
  `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarPanelRuntime.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`,
  and `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`; tests
  `src/test/suite/scheduleImpactCalendarSession.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/createScheduleAwareExplorerSession.test.ts`, and
  `src/test/suite/webSmoke.ts`. The other approved test paths were executed as
  unchanged integration coverage.
- Validation: test compile, desktop preparation, full desktop runner with
  architecture dependency checks, production build, scoped Qlty format/check/
  smells, Markdown lint, and diff checks all passed. Qlty reported no issues
  over all four production paths and four changed test paths; no suppression,
  threshold relaxation, baseline change, or architecture exception was used.
- Web validation: real Chromium WebWorker execution passed WEB-7, WEB-8,
  WEB-9, and WEB-10. WEB-10 verified registration-before-open, successful
  release on parent disposal and repeated explicit disposal, open-failure
  rollback, and one-time release. The known non-failing stream diagnostics
  after viewer activity remain; real Calendar DOM and `window.vscode`
  handshake execution are not claimed.
- Compatibility and readiness: no public message/schema, command, dependency,
  Node built-in, production webpack entry, telemetry payload, VS Code engine,
  Calendar Slice 3 UI, or unrelated feature path changed. Existing titles,
  CSP, language normalization, source/privacy behavior, stale filtering,
  failure ordering, rollback, disposal, and sidecar/Explorer composition are
  preserved.
- Implementation feedback: using shared context objects for private runtime
  helpers and pure Registry/Bootstrap transforms cleared the configured Qlty
  complexity and parameter gates while keeping lifecycle state closure-owned.
  The added failure characterization should remain a regression guard for
  panel-create and listener-registration failures.
- Unresolved risk: real Calendar Webview DOM integration and
  `window.vscode` handshake remain outside this slice and require the
  unapproved Calendar host/session work. No other implementation blocker was
  found.
- Recommended route: independent implementation review of the exact approved
  production/test/evidence paths, followed by the completion commit gate only
  after review `Ready` and Completion Approval.

## Slice 10 Review Correction (2026-09-13)

- Review finding: when `panel.onDidDispose` throws after the receive listener
  has been installed, rollback must dispose that listener and mark the child
  runtime cleaned before rethrowing the original registration error. The
  runtime now routes this failure through the shared child cleanup; Registry
  close and safe panel disposal remain idempotent outer safeguards.
- Added test evidence covers receive-listener disposal for listener
  registration failure and direct `createWebviewPanel` failure with original
  error preservation and an empty Registry. The public panel/Registry/
  Bootstrap contracts remain unchanged.
- Revalidation passed: test compile, desktop preparation/full runner,
  bundle-backed Chromium WEB-7/WEB-8/WEB-9/WEB-10, production build, scoped
  Qlty, Markdown lint, and diff checks. Completion Approval remains pending
  independent re-review.

## Slice 10 Completion Approval (2026-09-13)

- Status: Complete under the user's explicit standing automatic no-findings
  slice-approval policy after independent implementation review `Ready` with
  no findings; completion commit `089b3825` is complete.
- Approved at: 2026-09-13 in the current conversation under the user's
  standing automatic no-findings policy.
- Review base: Slice 10 replan/state commit `f83b379a`; the review included the
  listener-registration cleanup correction and direct panel-creation rollback
  characterization.
- Exact approved changed paths for the completion gate:
  `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarPanelRuntime.ts`,
  `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`,
  `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`,
  `src/test/suite/scheduleImpactCalendarSession.test.ts`,
  `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
  `src/test/suite/createScheduleAwareExplorerSession.test.ts`,
  `src/test/suite/webSmoke.ts`, and this feature's `TASKS.md` and
  `TRACEABILITY.md`.
- Completion evidence: compile, desktop runner, architecture checks,
  production build, Chromium WEB-7/WEB-8/WEB-9/WEB-10, scoped Qlty,
  Markdown lint, and diff checks are recorded above. The latest correction
  preserves original listener/panel errors while cleaning the receive
  listener and Registry state.
- Commit status: completion commit `089b3825` is complete.
- Recommended route: Feature Exit was attempted after all ten slices were
  committed and returned `DoNotClose` because the remote quality gate still
  has the findings recorded in Slice 11 below.

## Slice 11 Replanning (2026-09-13)

- Trigger: Feature Exit returned `DoNotClose` after all ten slices were
  committed at `089b3825`. Authenticated remote evidence shows Verify and
  Qlty check with no blocking issues, but CodeQL reports
  `scheduleImpactCalendarTransport.ts:354` (`Unvalidated dynamic method call`)
  at the host-validator dispatch. Remote Qlty formatting reports exactly
  `docs/specs/features/schedule-impact-calendar/TASKS.md`, this feature's
  `TASKS.md`, and this feature's `TRACEABILITY.md`.
- Why the current plan cannot continue unchanged: the completed Slice 9
  Transport behavior still blocks the remote security gate, and the three
  documentation paths need bounded formatter validation before Feature Exit
  acceptance can be met. The earlier Cloud-equivalent-output criterion is
  historical and superseded by the formatter-validation fallback below. No
  third remote path is inferred: the
  repository's Qlty configuration excludes `pnpm-lock.yaml` for the base/head
  comparison, so it remains out of scope.
- Smallest revised slice: retain one existing production path,
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`, and
  change host validation to a closed `type` discriminant using strict equality
  with exactly three direct branches: `close` calls `validateClose`, `session`
  calls `validateSession`, and `failure` calls `validateFailure`. No
  `String(...)` coercion, map lookup, computed invocation, or arbitrary
  callable value is permitted. Add or adjust only the focused
  `src/test/suite/scheduleImpactCalendarTransport.test.ts` regression needed
  to exercise all three valid branches and call
  `validateScheduleImpactCalendarMessage` for unknown, reserved,
  non-string, and object discriminants, each returning `invalid-request`
  without coercion. Preserve oversized-payload, unknown-session, stale-request,
  and strict-JSON error priority. Re-run
  `src/test/suite/scheduleImpactCalendarBridge.test.ts` unchanged for Bridge
  compatibility.
- Exact formatter paths:
  `docs/specs/features/semantic-diff-quality-remediation/TASKS.md`,
  `docs/specs/features/semantic-diff-quality-remediation/TRACEABILITY.md`, and
  `docs/specs/features/schedule-impact-calendar/TASKS.md`. The Calendar plan
  is a formatting-only mechanical path; lifecycle, content, and status state
  must not change. Authoritative authenticated Cloud evidence is build
  `01a0989c-5572-7169-87b4-43f4728ad729` at HEAD `089b3825`, using Qlty
  `0.644.0` on `linux-x64`, Node `22.23.1`, and Prettier `3.6.2`. The Cloud
  formatter command is literally `sh -c "prettier --config  -w <absolute
target paths>"`; its config display is blank and no `prose-wrap` flag is
  present. Invocation `U6leZO` targeted Calendar TASKS plus this feature's
  TRACEABILITY and exited `0` with 2 issues; invocation `hu2e7x` targeted this
  feature's TASKS and exited `0` with 1 issue. The authenticated formatter
  detail is [Cloud invocation hu2e7x](https://qlty.sh/gh/kittybbit/projects/vscode-ajsbutler/builds/01a0989c-5572-7169-87b4-43f4728ad729/invocations/hu2e7x).
  No repository Prettier configuration is present, and `.qlty/qlty.toml`
  leaves the Prettier plugin unpinned; the blank Cloud config display does not
  establish hidden configuration contents. Cloud byte parity therefore cannot
  be established locally, and no `prose-wrap` behavior may be inferred. The
  bounded local fallback below uses pinned Prettier `3.6.2` defaults; remote
  Cloud Qlty `fmt` remains authoritative.
- Bounded formatter commands after Completion Approval, using a transient
  pinned Prettier `3.6.2` executable and no repository dependency or lockfile
  change, are:

  ```text
  pnpm dlx --package prettier@3.6.2 prettier --write \
    docs/specs/features/schedule-impact-calendar/TASKS.md \
    docs/specs/features/semantic-diff-quality-remediation/TASKS.md \
    docs/specs/features/semantic-diff-quality-remediation/TRACEABILITY.md
  pnpm dlx --package prettier@3.6.2 prettier --check \
    docs/specs/features/schedule-impact-calendar/TASKS.md \
    docs/specs/features/semantic-diff-quality-remediation/TASKS.md \
    docs/specs/features/semantic-diff-quality-remediation/TRACEABILITY.md
  ```

  The expected local check is exit `0` for exactly these three paths. It is
  bounded local validation, not a claim of Cloud byte parity: semantic
  Markdown equivalence and scope checks are required, while the post-push
  remote Cloud Qlty `fmt` result is the acceptance authority. Do not infer
  hidden config or `prose-wrap` behavior.

- Preserved behavior and boundaries: strict plain-JSON validation and byte
  limits, malformed/reserved discriminant rejection, protocol error
  precedence, message types, branded IDs, Bridge listener/disposal behavior,
  browser-safe imports, desktop/web behavior, and VS Code `^1.75.0` remain
  unchanged. No Qlty suppression, dismissal, ignore, baseline, threshold,
  config, dependency, generated, Calendar Slice 3, or public-contract change
  is permitted.
- Validation boundary: focused Transport and unchanged Bridge suites, test
  compile, full desktop runner, bundle-backed WEB-7 through WEB-10, production
  build, architecture dependency checks, scoped Qlty `fmt`/`check`/`smells`,
  Markdown lint, and `git diff --check`; then the exact three-path pinned
  Prettier `3.6.2` default-config fallback `--write`/`--check` after
  Completion Approval as the final documentation mutation, followed by
  authoritative remote PR #317 Verify, Qlty `check`/`fmt`, and CodeQL. Final
  WEB-7 through WEB-10 are required evidence;
  the web runner must report each scenario, not merely exit successfully.
  Real Calendar Webview DOM and `window.vscode` handshake remain unclaimed.
- Gate order: focused replan/state commit; Transport correction and focused
  test/evidence updates; independent implementation review `Ready`; Completion
  Approval; explicit approval for the exact three formatter paths; formatter
  `--write` on only those paths as the final mutation; then non-mutating
  three-path `--check`, diff/scope checks, and the completion commit. If a
  later evidence write touches TASKS or TRACEABILITY, repeat the explicitly
  approved path-only formatter pass before the next gate. Remote updates must
  not alter files outside the three formatter paths after that pass, and
  Completion Approval cannot precede implementation review.
- Approval boundary: all ten completion commits, including `089b3825`, are
  preserved. Independent plan review is `Ready` with no findings and new Human
  Approval is recorded below; one focused replan/state commit remains required
  before any runtime, test, or formatter edit. The Calendar TASKS path has
  only the explicit formatting-only authorization; `pnpm-lock.yaml` and all
  other paths are excluded.
- Unresolved risks: an indirect validator call could leave CodeQL's finding;
  local and Cloud formatter options could diverge; and prose wrapping could
  alter Markdown semantics or approval evidence. Any extra path, behavior,
  design, or approval-boundary change returns to Main for Replanning.
- Recommended route: send this exact Slice 11 replan to `plan-reviewer`.
  Plan review is complete and Human Approval is recorded below; route the
  approved planning docs to `approval-committer` for the focused replan/state
  commit. Implementation and Feature Exit remain subsequent stages.

## Slice 11 Human Approval (2026-09-13)

- Status: Prior approval remains valid for the exact reviewed runtime/test
  boundary; planning-state commit `3358e5f0` is complete and the implementation
  diff is preserved for review. The formatter-validation fallback below
  supersedes only that validation criterion; its separate approval is recorded
  below. No formatter mutation or Completion Approval is recorded.
- Approved at: 2026-09-13 in the current conversation, after independent
  plan review `Ready` with no findings; the user explicitly replied
  `進めてください。`.
- Approved production path:
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`.
- Approved test boundary:
  `src/test/suite/scheduleImpactCalendarTransport.test.ts` may receive only
  the direct-dispatch/non-coercion regression; the existing
  `src/test/suite/scheduleImpactCalendarBridge.test.ts` is unchanged
  regression validation.
- Approved formatter paths, reserved for the post-Completion-Approval final
  mutation:
  `docs/specs/features/semantic-diff-quality-remediation/TASKS.md`,
  `docs/specs/features/semantic-diff-quality-remediation/TRACEABILITY.md`,
  and `docs/specs/features/schedule-impact-calendar/TASKS.md`. The Calendar
  path is formatting-only and may not change lifecycle, content, or status
  state. Any later evidence write to the two feature documents requires the
  same approved path-only formatter pass before the next gate.
- Preserved boundary: all ten completion commits through `089b3825`, strict
  JSON/protocol behavior, message/error precedence, Bridge behavior,
  desktop/web compatibility, Qlty policy, `pnpm-lock.yaml`, Calendar Slice 3,
  Dependabot work, and all paths not listed above.
- Recommended next route: delegate the exact approved planning-document paths
  to `approval-committer` for one focused formatter-validation replan/state
  commit. Completion review and the final formatter mutation remain separate
  gates.

## Slice 11 Formatter-Validation Replanning (2026-09-13)

- Trigger/evidence: implementation completed under the previously approved
  Transport/test boundary after planning-state commit `3358e5f0`; only
  `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts` and
  `src/test/suite/scheduleImpactCalendarTransport.test.ts` are dirty. The
  focused Transport suite reports 7 passing, unchanged Bridge regression 2
  passing, desktop exits `0`, architecture reports 25 passing, scoped Qlty
  reports no issues/smells, and WEB-7 through WEB-10 counters are present.
  The pinned Prettier `3.6.2` read-only check still reports the exact three
  Cloud-flagged documentation paths as unformatted.
- Why the prior plan cannot continue unchanged: the authenticated Cloud
  formatter run exposes no config artifact or value beyond a blank
  `--config` display, so Cloud/local byte parity cannot be established before
  mutation. No new runtime, test, or documentation path is required; the
  completed runtime/test boundary remains preserved and Completion Approval is
  not recorded.
- Smallest revised boundary: replace the impossible pre-Cloud-parity
  criterion with a bounded fallback using transient pinned Prettier `3.6.2`
  and its default local configuration on exactly the three approved paths.
  Verify semantic Markdown equivalence—headings, list/table text, links,
  code spans/fences, approval records, lifecycle and status statements—before
  and after the formatting mutation, then run a path-only read-only formatter
  check, Markdown lint, and diff/scope checks. This does not claim Cloud byte
  parity. The actual remote Cloud Qlty `fmt` result after the normal PR push is
  authoritative; if it fails, return to Main for another bounded replan with
  no broad formatting or configuration change.
- Exact formatter paths:
  `docs/specs/features/semantic-diff-quality-remediation/TASKS.md`,
  `docs/specs/features/semantic-diff-quality-remediation/TRACEABILITY.md`, and
  `docs/specs/features/schedule-impact-calendar/TASKS.md`. The Calendar path
  is formatting-only and may not change lifecycle, content, or status state.
  No `pnpm-lock.yaml` or other path is included.
- Gate order: preserve the dirty runtime/test implementation while the
  formatter-validation replan is independently reviewed and newly Human
  Approved; isolate the two planning-document updates for their focused state
  commit; complete implementation review and record Completion Approval for
  the runtime/test scope; obtain explicit approval for the exact three-path
  formatter; run pinned default-config `--write` only on those paths as the
  final documentation mutation; perform semantic equivalence, path-only
  `--check`, Markdown lint, and diff/scope checks; then commit and push through
  the normal PR flow for authoritative remote Verify, Qlty `check`/`fmt`, and
  CodeQL. Any later TASKS/TRACEABILITY evidence write requires repeating the
  approved three-path formatting pass before the next gate. Completion Approval
  cannot precede implementation review.
- Worktree safety: because the original worktree has uncommitted runtime/test
  files, the planning-state update must be prepared in a dedicated temporary
  worktree from `3358e5f0`. Verify HEAD and hashes of both dirty runtime/test
  paths before and after transferring the two planning-document changes; create
  only the focused docs-state commit there, then fast-forward the original
  branch only after re-verifying those hashes. No runtime/test/Calendar edit,
  broad formatter, stage, or commit is performed by this replan.
- Approval boundary: prior runtime/test approval and implementation evidence
  remain unchanged; this replan changes only formatter validation and is
  independently reviewed `Ready` and Human Approved below. The final formatter
  mutation remains reserved for after Completion Approval, and the remote Cloud
  result—not local default formatting—is the acceptance authority.
- Recommended route: route only the selected feature planning docs to
  `approval-committer` for the isolated state commit. Implementation review,
  Completion Approval, and the final three-path formatter remain separate
  gates.

## Slice 11 Formatter-Validation Replan Human Approval (2026-09-13)

- Status: `Approved` for the exact formatter-validation fallback replan after
  independent plan review `Ready` with no findings. This approval does not
  grant Completion Approval or authorize formatter mutation.
- Approved at: `2026-09-13T15:57:35+09:00`; the user explicitly replied
  `承認します。`.
- Approved planning/state paths for the next isolated plan commit:
  `docs/specs/features/semantic-diff-quality-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-quality-remediation/TRACEABILITY.md`.
- Approved formatter execution paths, reserved for after implementation
  review `Ready`, Completion Approval, and explicit final formatter approval:
  these two planning documents plus
  `docs/specs/features/schedule-impact-calendar/TASKS.md`. The Calendar path
  is formatting-only and may not change lifecycle, content, or status state.
- Preserved boundary: the approved Transport/test implementation, all ten
  completion commits through `089b3825`, strict JSON/protocol behavior,
  message/error precedence, Bridge behavior, desktop/web compatibility,
  Qlty policy, `pnpm-lock.yaml`, Calendar Slice 3, Dependabot work, and all
  paths outside the listed boundaries remain unchanged.
- Recommended next route: `approval-committer` may prepare one isolated
  plan/state commit containing only the two approved planning documents after
  verifying the dirty Transport/test hashes; implementation review,
  Completion Approval, and the final three-path formatter remain separate
  gates.

## Slice 11 Implementation Review and Completion Approval (2026-09-13)

- Independent implementation review: `Ready` with no findings. Review and
  approval evidence were recorded at `2026-09-13T16:11:49+09:00` for the
  exact approved runtime/test diff.
- Completion Approval: `Approved` under the standing user instruction to
  auto-approve slices with an independent no-findings review. The user's
  explicit `承認します。` also approves the reviewed formatter-validation
  fallback and its exact three documentation paths. This is not Closure
  Approval.
- Exact completed/approved paths: `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`,
  `src/test/suite/scheduleImpactCalendarTransport.test.ts`, this feature's
  `TASKS.md`, this feature's `TRACEABILITY.md`, and
  `docs/specs/features/schedule-impact-calendar/TASKS.md`. The first two
  contain the implementation diff; the last three are limited to the
  approved formatter mutation, with the Calendar path formatting-only.
- Traceability result: the direct closed-discriminant validator preserves
  strict JSON distrust, byte limits, malformed/reserved rejection, stable
  error precedence, session/request IDs, and Bridge compatibility. Unknown,
  reserved, non-string, and object discriminants return `invalid-request`
  without coercion or arbitrary invocation.
- Validation result: Transport 7 passing, unchanged Bridge 2 passing, test
  compilation, desktop runner exit 0, architecture 25 passing with zero
  violations, production/web builds, scoped Qlty check/smells, and
  `git diff --check` passed. Chromium reported WEB-7
  `browser=1 sourceReads=0 reports=0 sessions=0`, WEB-8
  `bindings=2 registrations=2 opened=1 rollbacks=1`, WEB-9
  `requests=2 accepted=2 adds=1 removes=1`, and WEB-10
  `registered=1 releases=1 rollback=1`.
- Final formatter gate: run transient pinned Prettier `3.6.2` with its
  default configuration on exactly the three paths above, prove semantic
  Markdown equivalence before/after, then run path-only `--check`, Markdown
  lint, diff checks, and the remote Cloud gates. No later evidence write may
  occur without repeating that exact formatter pass.
- Commit/closure status: the approved implementation and formatter result
  remain uncommitted pending the exact completion commit gate. Feature Exit
  and closure approval remain separate subsequent lifecycle stages.
