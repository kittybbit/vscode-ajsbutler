# Requirements Traceability: Semantic Diff Quality Remediation

<!-- markdownlint-disable MD013 -->

| Use case / requirement                     | SPECS.md section                                  | Slice    | Test or validation                                                                                                                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Structural identity and deterministic diff | Requirements; Compatibility                       | 1        | `semanticDiffStructuralRules.test.ts`, `compareSemanticDiff.test.ts`, `semanticDiffSampleCoverage.test.ts`, `semanticDiffJson.test.ts`; reorder, `sample1_large_utf8`, duplicate identity, relation, order                                                                                 |
| Supported/unsupported schedule comparison  | Requirements; Compatibility                       | 2        | `semanticDiffScheduleRules.test.ts`, `semanticDiffSchedule.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`, `semanticDiffScheduleImpact.test.ts`; periods, reasons, zero-runs, changed time, malformed input                                                                          |
| Schedule-impact root and issue model       | Requirements; Architecture                        | 3        | `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`; IDs, candidates, issue maps, side roots, duplication, freeze                                                                                                     |
| Schedule-impact timeline and sidecar       | Requirements; Architecture                        | 4        | `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, `semanticDiffPresentationArtifacts.test.ts`, `compareSemanticDiffWithArtifacts.test.ts`; matching, timeline, source references, validation, large/duplicate input                                            |
| Report, JSON, and presentation artifacts   | Requirements; Compatibility                       | 5        | Artifact, report, Markdown, and JSON suites listed in `TASKS.md`; exact localization, projection, ordering, omission, parser failures                                                                                                                                                      |
| Formatting-only release-note repair        | Acceptance Criteria; Durable Documentation Impact | 5        | `rtk pnpm run lint:md`, Qlty format, `rtk git diff --check`, wording-preservation review                                                                                                                                                                                                   |
| Immutable Git HEAD and snapshot source     | Requirements; Compatibility                       | 6        | `vscodeGitHeadDefinitionSourceAdapter.test.ts`; complete adapter/provider suite on desktop; web validation limited to the final production build and WEB-7 through WEB-10 smoke, with no Git adapter/provider execution claim; HEAD, path/rename, decoded content, failures, cache/release |
| Command source selection/cancellation      | Requirements; Compatibility                       | 7        | `semanticDiffCommand.test.ts`, `parseSemanticDiffComparisonPeriod.test.ts`, `semanticDiffSourceCapture.test.ts`, Git adapter suite, and `webSmoke.ts` `WEB-7`; one read, cancellation, failures, size, privacy, web activation/registration/no-active-editor guard                         |
| Explorer/report workflow and cleanup       | Requirements; Compatibility                       | 8        | Command, schedule adapter, Explorer/Flow, highlight, and wiring suites listed in `TASKS.md`, plus `webSmoke.ts` `WEB-8`; one comparison/open, rollback, cleanup, actions, telemetry, web in-memory finalization                                                                            |
| Calendar transport and bridge              | Requirements; Overlap Decision                    | 9        | `scheduleImpactCalendarTransport.test.ts`, new narrow `scheduleImpactCalendarBridge.test.ts`, and `webSmoke.ts` `WEB-9`; envelope, JSON, bytes, IDs, stale/session, listener/dispose, controlled web-host lifecycle                                                                        |
| Calendar host session and parent lifetime  | Requirements; Overlap Decision                    | 10       | Session, Explorer panel, bootstrap session, sidecar, subscription, and wiring suites listed in `TASKS.md`, plus `webSmoke.ts` `WEB-10`; failure, reveal, ordering, rollback, one-time release, controlled web-host composition                                                             |
| PR #317 local Qlty gate                    | Requirements; Acceptance Criteria                 | 1-10     | Per-slice ownership; final `rtk pnpm run qlty`; no suppression, ignore, threshold, baseline, architecture, dependency, or generated change                                                                                                                                                 |
| PR #317 remote Qlty gate                   | Requirements; Acceptance Criteria                 | After 10 | Publish committed slices; `rtk gh pr checks 317`; remote `qlty check` and `qlty fmt` successful                                                                                                                                                                                            |
| Desktop/web and VS Code `^1.75.0`          | Compatibility                                     | 1-10     | Focused desktop suites; `rtk pnpm run test:web` executes only `src/test/suite/webSmoke.ts` and must report `WEB-7` through `WEB-10` as defined in `TASKS.md`; final `rtk pnpm test`, `rtk pnpm run build`, architecture and package-manifest tests                                         |
| Preserve excluded work                     | Overlap Decision; Non-Goals                       | 1-10     | Diff confirms Dependabot docs/patch/dependencies, Calendar Slice 3, parser/generated, Qlty config, README/use cases/roadmap, and `FlowContents.tsx` unchanged by this feature                                                                                                              |

<!-- markdownlint-enable MD013 -->

## Slice Dependency Chain

Slices 1 through 10 run in numeric order, followed by integrated local
validation, the remote PR gate, and Feature Exit.

Every arrow is a committed approval boundary. Slices 3-4 revisit
`semanticDiffScheduleImpact.ts`, and Slices 7-8 revisit
`semanticDiffCommand.ts`; each later slice uses its committed predecessor as
the review base.

## Approval Record

- Independent plan review: `Ready`; no findings.
- Human Approval: `Approved` on 2026-09-12 for the complete ten-slice plan and
  the exact Slice 1 scope as the next slice.
- Implementation sequencing: one slice at a time, with independent review and
  completion approval/commit before advancing.
- Plan commit gate: complete; focused plan commit `d3693d76`.
- Exact planning-package commit paths: this feature's `SPECS.md`, `TASKS.md`,
  and `TRACEABILITY.md` only.
- Exact Slice 1 paths: `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`,
  `src/test/suite/semanticDiffStructuralRules.test.ts`,
  `src/test/suite/compareSemanticDiff.test.ts`,
  `src/test/suite/semanticDiffSampleCoverage.test.ts`, and
  `src/test/suite/semanticDiffJson.test.ts`.
- `CHANGELOG.md` remains assigned to Slice 5 by the approved plan and is not
  part of Slice 1.

## Slice 1 Implementation Evidence

- Status: implementation complete; independent implementation review is
  `Ready` with no findings and Completion Approval is approved on 2026-09-12.
- Approved paths changed: `src/domain/services/semantic-diff/semanticDiffStructuralRules.ts`
  and `src/application/semantic-diff/compareSemanticDiff.ts`. The four
  approved test paths were unchanged because existing characterization tests
  cover the refactored branches.
- Behavior preserved: fingerprint grouping/classification, exact and
  fingerprint precedence, rename/move change order, relation target shape,
  relation pair canonicalization, identity decision IDs, and deterministic
  ordering.
- Qlty evidence: explicit six-path `qlty check` and `qlty smells
  --no-snippets` both pass with zero issues. The three Slice 1 baseline smells
  were `matchFingerprintUnits`, `createFingerprintMatchChanges`, and
  `createRelationChanges`; no suppression, ignore, baseline, threshold,
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
- Completion commit: eligible and pending `approval-committer`; this agent
  did not stage or commit.

## Web Smoke Scenario Traceability

The web command is not a suite discovery mechanism. `src/test/runWebTest.ts`
passes only `src/test/suite/webSmoke.ts` as `extensionTestsPath`. These
scenarios are the exact web-host evidence for the affected slices:

<!-- markdownlint-disable MD013 -->

| Scenario | Slice | Evidence                                                                                                                                                                               | Not claimed                                                                                                                                                                                              |
| -------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WEB-7`  | 7     | Extension activation and Semantic Diff/copy/save command registration; command-core no-active-editor guard with no read/report/session side effect.                                    | Interactive Quick Pick, file/Git dialogs, and their full source-selection matrix; those remain desktop-focused evidence.                                                                                 |
| `WEB-8`  | 8     | Deterministic in-memory command artifact/report/Explorer finalization and one cleanup path through controlled host doubles.                                                            | Registered-command interactive UI or Explorer Webview DOM execution.                                                                                                                                     |
| `WEB-9`  | 9     | Controlled bridge port/target lifecycle covering request numbering, accepted session/failure messages, malformed/cross-session/stale rejection, unsubscribe, and disposal suppression. | A real `window.vscode` or Calendar Webview DOM handshake; exhaustive transport/bridge behavior remains in focused tests.                                                                                 |
| `WEB-10` | 10    | Controlled schedule-aware Explorer session composition covering sidecar registration, successful parent disposal, open failure rollback, and idempotent release.                       | Real Calendar `WebviewPanel` DOM/message lifecycle is not claimed because no public Calendar panel action is wired and Calendar Slice 3 is excluded; it remains an explicit host-boundary residual risk. |

<!-- markdownlint-enable MD013 -->

The web scenarios are additive characterization coverage in an existing test
file and require no production, configuration, test-runner, public-schema,
Calendar Slice 3, or Dependabot change.

## Refactor Helper Ownership

<!-- markdownlint-disable MD013 -->

| Concern                                | Slice | Allowed owner/location                                                        | Prohibited movement                                              |
| -------------------------------------- | ----- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Structural matching/grouping           | 1     | Private pure helpers in domain structural rules                               | No application/presentation identity policy                      |
| Schedule interpretation/run comparison | 2     | Domain schedule services; projection only in `compareScheduleDiff.ts`         | No host calendar/locale or presentation policy                   |
| Root/candidate/issue side mapping      | 3     | Private contexts and side mappers in `semanticDiffScheduleImpact.ts`          | No new public DTO or cross-layer helper                          |
| Run/timeline/source phases             | 4     | Private matching, projection, validation helpers in the same application file | No weakened validation/schema change                             |
| Report line assembly                   | 5     | Private helpers in `semanticDiffMarkdownLocalization.ts`                      | No domain decisions in presentation                              |
| Git path/object/cache                  | 6     | Private guards in existing adapter/provider                                   | No filesystem, Git executable, `.git`, Node built-in             |
| Command error/source/output workflow   | 7-8   | Private types, contexts, continuations in existing command files              | No `FlowContents.tsx`, telemetry, or public command change       |
| Calendar message validation            | 9     | Private validator helpers in transport; bridge state stays in bridge          | No trust relaxation or domain import into bridge                 |
| Panel/session/parent lifetime          | 10    | Private panel/session helpers; concrete composition in bootstrap              | No presentation object in application/domain or Calendar Slice 3 |

<!-- markdownlint-enable MD013 -->

## Acceptance Coverage Notes

- Existing expected values are the compatibility baseline. Changing them
  requires Replanning.
- The new bridge test in Slice 9 is the only planned new test file. Other test
  changes, including `WEB-7` through `WEB-10` in the existing `webSmoke.ts`,
  are conditional characterization additions in listed files.
- Earlier slices may leave only findings explicitly owned by later slices.
  Complete local success is mandatory after Slice 10.
- `rtk pnpm run test:web` runs only `webSmoke.ts`; it does not prove that every
  focused desktop suite runs in a web host. The concrete Webview panel DOM and
  in-panel script boundary therefore remains an explicit host-boundary
  residual risk; desktop session/wiring suites remain the planned evidence for
  observable host composition.
- Remote confirmation occurs after all approved commits are published. It does
  not replace local validation or independent per-slice review.
