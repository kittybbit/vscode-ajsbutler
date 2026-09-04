# Feature Tasks: Semantic Diff Qlty Remediation

## Agent Brief

- Purpose: remove the 56 Qlty blockers on PR #313 without observable change.
- Approved or active slice: Slice 1 is complete and published at `29f34008`;
  its structural cloud gate is satisfied at 46 and the published `qlty fmt`
  gate is clean. Slice 2's correction is runtime-complete and published at
  `9e2c45a4`: the structural cloud gate is 35 and Verify/CodeQL pass, but
  `qlty fmt` reports exactly two unformatted feature-document paths,
  `TASKS.md` and `TRACEABILITY.md`. Runtime is complete and must not be
  reopened; the Slice 2 format-only reconciliation is active and Slices 3-5
  remain queued behind it.
- Do not: change Semantic Diff meaning, output contracts, localization, or
  command/report behavior.
- Do not: change Qlty policy, VS Code compatibility, or desktop/web support.
- Read first: `SPECS.md`, this file, and the two source use cases.
- Read `TRACEABILITY.md` only when mapping the planned slices and validation.
- Validate each slice against its focused regression contracts; require full
  desktop/web and zero-blocker local/cloud evidence before Feature Exit.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: route the format-only Slice 2 reconciliation to independent
  `plan-reviewer`. The existing format-only Human Approval covers exactly the
  two feature-document paths because the reconciliation changes no runtime,
  behavior, design, or approval boundary. After `Ready`, Main applies that
  approval and `approval-committer` commits the exact two-file replan package;
  only then may the format-only execution run. Runtime files, including
  `semanticDiffMarkdownLocalization.ts`, must not be reopened.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs, prior approvals, or long validation diaries once they stop being
  actionable.

## Intake Status

- Status: Complete
- Feature kind: transient branch feature
- Selected feature: `semantic-diff-qlty-remediation`
- Source: Qlty review for PR #313 at
  `4fc386413d6eb84aaeefe13e0b6847bc3963cb94`
- Overlap decision: follow-up to the closed
  `semantic-diff-structured-outputs` feature; no roadmap or inherited feature
  scope is absorbed.
- Durable-document impact: none expected because behavior, architecture
  policy, and unfinished roadmap work remain unchanged.

## Plan Status

- Status: Replanning approved; Slice 2 runtime correction is complete at
  `9e2c45a4`, but its two-file `qlty fmt` gate is pending and runtime must not
  be reopened
- Planning scope: five ordered, behavior-preserving refactor slices covering
  every reported blocker in all eight production files.
- Review status: Format-only replan independently reviewed `Ready` with no
  Findings; the published `qlty fmt` trigger is limited to the two
  feature-document paths while the runtime correction is already complete. The
  prior runtime replan review remains separate and is not reused as this
  package's review.
- Independent plan review: `Ready` with no Findings; this review verifies the
  two-version formatter gate and exact document-only boundary
- Replan approval: `Approved`; Main applied the existing format-only Human
  Approval to exactly the two feature-document paths because no runtime,
  behavior, design, compatibility, or approval-boundary scope is introduced
- Replan commit: Pending `approval-committer`; exact paths are
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`. No
  format-only execution or later slice may start before this focused commit
- Human approval: Existing approval covers the original five slice scopes and
  the exact two-file format-only reconciliation; Main applied it to this
  reviewed replan. No new file, design, behavior, or approval-boundary scope
  is introduced, and this document does not grant a new approval.
- Active implementation slice: Slice 2 format-only reconciliation. Slice 1
  published head `29f34008` records 46 structural blockers, zero formatting
  blockers, and no replacement finding; `9e2c45a4` records 35 structural
  blockers with Verify/CodeQL pass and exactly two unformatted feature-document
  paths. Runtime correction is complete and must not be reopened.

## Human Approval

- Status: Approved for the original five slice scopes; the Slice 2 correction
  remains within that approved scope, while Slices 3-5 remain approved and
  unchanged
- Approved at: approved in current conversation
- Approved scope: the original five slice scopes and Slice 1 correction 2
  production implementation remain approved in mandatory order. The
  authoritative `6b6e4df5` reconciliation accepts Slice 1's structural gate at
  46, and published head `29f34008` confirms the clean format gate. The
  original Slice 2 implementation is published at `75add547`; its cloud gate
  is 36 because one hidden `function-complexity` aggregate remains on
  `renderSummary` (complexity count 8). The correction is limited to the
  already approved `semanticDiffMarkdownLocalization.ts` file, does not
  expand feature purpose or observable behavior, and does not change any
  later-slice scope.
- Approved paths (unchanged original implementation scopes):
  - Slice 1: `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
    `src/application/semantic-diff/compareSemanticDiff.ts`, and
    `src/test/suite/compareSemanticDiff.test.ts`,
    `src/test/suite/semanticDiffContracts.test.ts`,
    `src/test/suite/semanticDiffConditions.test.ts`,
    `src/test/suite/semanticDiffSchedule.test.ts`,
    `src/test/suite/semanticDiffFlowHighlights.test.ts`
  - Slice 2: `src/presentation/semantic-diff/renderSemanticDiffAuditMarkdown.ts`,
    `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`,
    `src/presentation/semantic-diff/semanticDiffOutput.ts`,
    `src/test/suite/renderSemanticDiffMarkdown.test.ts`,
    `src/test/suite/semanticDiffMarkdownProjections.test.ts`,
    `src/test/suite/semanticDiffOutput.test.ts`
  - Slice 3: `src/presentation/semantic-diff/serializeSemanticDiffJson.ts`,
    optional private modules
    `src/presentation/semantic-diff/semanticDiffJsonOrdering.ts`,
    `src/presentation/semantic-diff/semanticDiffJsonProjection.ts`,
    `src/presentation/semantic-diff/semanticDiffJsonValidation.ts`, and
    `src/test/suite/semanticDiffJson.test.ts`
  - Slice 4: `src/presentation/vscode/commands/semanticDiffCommand.ts` and
    `src/test/suite/semanticDiffCommand.test.ts`
  - Slice 5: `src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts`,
    optional private module
    `src/presentation/vscode/semantic-diff/semanticDiffReportDocumentState.ts`,
    and `src/test/suite/semanticDiffReportDocument.test.ts`
- Prior correction implementation paths remain completed history and are not
  reopened: `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and the feature
  artifacts used by those correction gates. No current Slice 1 path is
  authorized by this replan.
- Approved format-only closure package paths:
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`.
- Corrected Slice 2 implementation path (exact, implemented after replan
  commit `cef0abfe` and published at `9e2c45a4`):
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`.
  `renderSummary` is the only corrected function. The existing
  `src/test/suite/semanticDiffMarkdownProjections.test.ts` is validation-only;
  no test update is authorized unless the implementer demonstrates that a
  characterization update is necessary, which would require a further replan.

The existing Human Approval is retained because the correction is a local
execution adjustment inside the exact approved Slice 2 production boundary.
Main applied that approval to the runtime replan after the independent plan
review returned `Ready` with no Findings. The corrected implementation review
also returned `Ready` with no Findings, and the runtime completion was published
at `9e2c45a4` with structural Qlty 35 and Verify/CodeQL passing. The remaining
format-only replan covers the already approved two feature-document paths; this
document records the rationale and does not grant approvals itself.

The format-only closure package was published at `29f34008`. `Approved at`
records the approval result only, such as `none` or `approved in current
conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Format-only Reconciliation Package Approval Boundary

- Status: Complete; published at `29f34008` with independent plan review
  `Ready` and no Findings
- Purpose: record the completed format-only inventory reconciliation; it did
  not authorize runtime, test, generated-artifact, or configuration changes.
- Approval-committer paths (exactly):
  - `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`
  - `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`
- The Slice 1 Format-only Closure Gate below is a separate planning/completion
  boundary. The published head `29f34008` changed only these two planning
  paths and records `qlty fmt` pass with no formatting issues; the published
  `qlty check` remains at 46 structural blockers with no Slice 1 replacement.
  Verify and CodeQL also pass. Slice 1 is closed without reopening production.

## Completion Approval

- Status: Approved conditionally for corrected Slice 2 runtime completion;
  final Slice 2 gate is pending the format-only document reconciliation
- Approved at: existing user all-slice conditional authorization, activated
  after the corrected implementation review returned `Ready` with no Findings
- Approved scope: the exact corrected implementation path and the two feature
  artifacts used for completion evidence
- Approved paths (exactly):
  - `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`
  - `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`
  - `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`
- Original Slice 2 implementation review: `Ready`; Findings: none, published
  at `75add547`; its completion gate is superseded by the unexpected 36-blocker
  cloud result and must not be committed independently.
- Corrected implementation review verdict: `Ready`; Findings: none
- Commit status: Runtime completion published at `9e2c45a4`; the exact
  two-file format-only replan commit remains pending `approval-committer`

The Slice 1-specific conditional clean-review authorization was consumed by its
completed package. Separately, the user's one-time conditional authorization
for all approved slices when each independent implementation review is `Ready`
with no Findings remains applicable to the corrected Slice 2 and later slices;
it is not activated for a slice until that slice's review and published Qlty
gates are clean. The authoritative `6b6e4df5` reconciliation and published
head `29f34008` accept 46 structural blockers for the completed Slice 1 scope:
45 active inline instances plus one hidden `function-complexity` aggregate on
`renderSummary` owned by Slice 2. Published `qlty fmt` is clean, and there is no
Slice 1 replacement. A different formatting result or a new S1 rule/function/file
finding requires Replanning; it does not reopen the completed Slice 1
production implementation.

Slice 2's original implementation cleared the ten active findings assigned to
its three production files, but the published head `75add547` still reported
one hidden `function-complexity` aggregate on `renderSummary` in
`semanticDiffMarkdownLocalization.ts` (complexity count 8). The previous
`localizedUnitChange` aggregate attribution was incorrect and is removed from
the current plan. The corrected runtime was published at `9e2c45a4` with 35
structural blockers and Verify/CodeQL passing; `qlty fmt` still reports exactly
the two feature-document paths as unformatted, so the final Slice 2 gate is
pending the format-only reconciliation.

For this corrected Slice 2 and each later approved slice, the user's
all-slice conditional authorization applies only when the independent
implementation review returns `Ready` with no Findings and the published
Qlty gates are clean. The corrected Slice 2 review and structural cloud gate
are complete; its two-file format-only gate remains mandatory before the next
slice starts.

Completion Approval was activated by the corrected independent implementation
review returning `Ready` with no Findings and is consumed by the runtime
completion published at `9e2c45a4`. The remaining format-only package is a
separate planning/replanning gate on the two feature-document paths; its
approval-committer commit must complete before another slice or Feature Exit
starts.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

Closure Approval is a separate human gate after `feature-closer` returns
`Close`. It authorizes only the recorded durable-document propagation, closure
evidence, and selected feature-folder removal. The approval-committer must
create the focused closure commit before the feature is closed.

## Implementation Slices

- Slice order is mandatory. A later slice may start only after its dependencies
  have an implementation-review verdict of `Ready`, Completion Approval, and a
  focused completion commit. Slice 1's format-only closure gate is complete;
  Slice 2's original and corrected implementation reviews are complete, and
  conditional Completion Approval is recorded; its runtime correction is
  published at `9e2c45a4`, but its two-file format-only gate remains required
  before Slice 3 starts.
- Every slice must run `qlty fmt` and pass Qlty locally. For the format-only
  closure package's global `rtk pnpm run qlty:fmt` invocation, capture immutable
  pre-format snapshots of `git status --short --untracked-files=all`,
  `git diff --name-only`, and the working-tree content digest for each listed
  path. Capture the same snapshots and digests after the command and compare
  them. The only paths the formatter may change in that package are
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`; runtime,
  test, generated, configuration, and every other path are forbidden formatter
  changes. If any forbidden path or digest change
  appears, stop without staging or committing and return to Main for
  Replanning. A path-scoped Qlty formatter may replace the global command only
  after support is verified for the repository's Qlty version; this plan
  assumes no such command. After each focused completion
  commit is pushed to PR #313, wait for the published `qlty check` and
  `qlty fmt` results on that exact head to reach terminal states (record the
  head SHA, conclusions, and blocking counts). The observed cloud inventory
  must equal the expected later-slice inventory below; the changed slice must
  remove all of its assigned findings and introduce no replacement blocker. A
  different rule, function, file, format check, or count is a blocker for Main
  and requires Replanning before the next slice.
  Expected published-cloud inventory, assuming no replacement findings:

- Baseline `4fc38641`: 56 (`function-complexity` 23,
  `return-statements` 12, `boolean-logic` 11,
  `function-parameters` 4, `similar-code` 2,
  `nested-control-flow` 2, `file-complexity` 2).
- Published Slice 1 head `fdd152be`: 47 structural blockers
  (`function-complexity` 22, `return-statements` 11,
  `boolean-logic` 10, `nested-control-flow` 2,
  `file-complexity` 2) plus two `qlty fmt` blockers on `TASKS.md`; Slice 1
  completion is not accepted.
- Published Slice 1 correction head `94081121`: 46 structural blockers and
  one Prettier formatting blocker on `TASKS.md`; `countChange`,
  `toRelationPair`, and the other first-correction anchors are resolved, but
  the original `buildSemanticDiffSummary` function-complexity finding remains.
  The old aggregate attribution to `createEvidenceConfirmation` is not
  retained as Slice 1 ownership. This is preserved as implementation
  history, not the current gate.
- Published Slice 1 correction 2 head `6b6e4df5`: 46 structural blockers,
  comprising 45 active inline instances plus one hidden
  `function-complexity` aggregate on `renderSummary` owned by Slice 2; the
  Slice 1 structural gate is satisfied and no S1 replacement finding remains.
  One Prettier blocker remains on `TASKS.md` (thread `3926429642`).
- After the Slice 1 format-only closure gate: 46 structural blockers
  (`function-complexity` 21,
  `return-statements` 11, `boolean-logic` 10,
  `nested-control-flow` 2, `file-complexity` 2) and zero `qlty fmt`
  blockers; Slice 1 is complete and the hidden `renderSummary` aggregate
  remains assigned to Slice 2.
- Published Slice 2 implementation head `75add547`: 36 structural blockers
  (`function-complexity` 16, `return-statements` 8,
  `boolean-logic` 10, `file-complexity` 2), with 35 active inline
  later-slice instances and one hidden `function-complexity` aggregate on
  `renderSummary` (complexity count 8); Verify, CodeQL, and `qlty fmt` pass.
  The original Slice 2 implementation is not complete until the correction
  clears this remaining blocker.
- Published Slice 2 correction head `9e2c45a4`: 35 structural blockers
  (`function-complexity` 15, `return-statements` 8,
  `boolean-logic` 10, `file-complexity` 2); Verify and CodeQL pass, but
  `qlty fmt` reports exactly `TASKS.md` and `TRACEABILITY.md` as unformatted.
  Runtime is complete and must not be reopened.
- After the Slice 2 format-only reconciliation: 35 structural blockers,
  zero format blockers, and no replacement finding.
- After Slice 3: 11 (`function-complexity` 6,
  `return-statements` 4, `file-complexity` 1).
- After Slice 4: 10 (`function-complexity` 6,
  `return-statements` 3, `file-complexity` 1).
- After Slice 5 / Feature Exit: 0; no replacement blocker.

- The terminal cloud check is authoritative for the final zero-blocker gate;
  local Qlty success does not substitute for the published result. Do not
  suppress findings or change `.qlty/`, thresholds, baselines, or plugins.

### Slice 1: Preserve Comparison Facts And Canonical Summary

- Status: Complete and published at `29f34008`; correction 2 review is
  complete, the structural gate is satisfied at 46, and the published
  `qlty fmt` gate is clean with no Slice 1 replacement
- Scope: simplify summary aggregation and comparison projection in
  `buildSemanticDiffSummary.ts` and `compareSemanticDiff.ts`. Replace complex
  boolean accumulation with named predicates or data-driven checks; reduce all
  four parameter-count anchors with one typed input object per helper:
  `toRelationPair` receives relation/kind/unit maps/correspondence as one
  context, `createRelationChanges` receives decisions plus the relation-pair
  context as one input, `parameterDetail` receives before/after/key/overrides
  as one input, and `createEvidenceConfirmation` receives decision plus the
  relation-pair context as one input. Consolidate duplicated
  evidence-confirmation construction without changing decision branches.
- User / Domain Value: the same JP1/AJS comparison produces the same summary,
  identity decisions, canonical relation pairs, schedule facts, changes,
  confirmation items, limitations, and deterministic order through code that
  clears its assigned Qlty findings.
- Cohesive Change Group: Slice 1 owns exactly 10 baseline blockers. The first
  correction and correction 2 resolved its comparison, summary, parameter,
  boolean, similarity, and complexity findings. The authoritative GraphQL
  reconciliation at `6b6e4df5` reports 45 active inline instances plus one
  hidden `function-complexity` aggregate on `renderSummary`; that aggregate
  belongs to Slice 2, so the Slice 1 structural gate is correctly satisfied at
  46 with no S1 replacement.
- Acceptance: public types and exported function signatures remain unchanged;
  exact/fingerprint/candidate/add/remove identity meaning and relation
  correspondence are unchanged; confirmation reason/detail/constraint values
  and zero-inclusive summary buckets are unchanged; no repeated comparison or
  summary pass is introduced.
- Validation: S1 owns all scenarios in `compareSemanticDiff.test.ts`,
  `semanticDiffContracts.test.ts`, `semanticDiffConditions.test.ts`,
  `semanticDiffSchedule.test.ts`, and `semanticDiffFlowHighlights.test.ts`;
  later slices do not edit these files. The fdd152be implementation passed
  local focused tests and implementation review, but its published cloud
  result was not a valid completion gate. The first correction and correction
  2 reran these behavior scenarios and passed the recorded local checks,
  summary/output-context byte comparison, and 400-case deterministic
  differential corpus. The published `29f34008` result confirms the expected
  46 structural blockers for the post-S1 state; `qlty fmt` reports no
  formatting issues and no Slice 1 replacement is active.
- Production Readiness: retain deterministic behavior for reordered, malformed,
  ambiguous, large, unsupported, and uncalculated inputs; do not add I/O, host,
  parser, telemetry, or Node dependencies.
- Approval Boundary: only
  `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and the five focused
  test files named above. Test edits may strengthen characterization only and
  must not change expected semantics.
- Dependencies: the correction 2 implementation is published at `6b6e4df5`
  and independently reviewed. The format-only closure package completed at
  published head `29f34008`; Slice 2 is now active.
- Risks: a superficially equivalent helper can change relation ID remapping,
  ordering, truth-table precedence, or the combined confirmation count.
- Out of Scope: DTO/schema changes, domain identity or risk rules, schedule
  interpretation, Markdown/JSON/presentation work, and performance redesign.

#### Slice 1 Correction 2 Gate: Reduce Summary Builder Complexity And Formatting

- Status: Complete and published at `29f34008`; independent implementation
  review `Ready` with no Findings; structural gate accepted at 46 and
  published `qlty fmt` is clean.
- Trigger and reconciliation: correction 2 was implemented from the historical
  `94081121` evidence and is preserved in history. Its published head
  `6b6e4df5` reports 45 active inline rule instances plus one non-inline
  `function-complexity` aggregate on `renderSummary` in Slice 2.
  Therefore 46 structural blockers is the correct post-S1 cloud result, not an
  S1 excess or replacement. The prior Prettier finding on feature `TASKS.md`
  (thread `3926429642`) is resolved by the published format-only gate.
- Scope completed: reduce `buildSemanticDiffSummary` complexity by making its
  orchestration a straight-through composition of small, typed private
  helpers for derived counts, schedule count, uncalculated state, findings
  state, and final summary projection. Preserve the exported summary and
  output-context APIs, exact result values, zero-inclusive buckets, boolean
  precedence, property order, and every format that consumes the summary.
  No further runtime change to `compareSemanticDiff.ts` is authorized.
- User / Domain Value: Slice 1 production completion is retained with the
  same JP1/AJS comparison facts, canonical summary, output-context meaning,
  and repository quality policy. The format-only gate reconciles the cloud
  count and removes the remaining planning-artifact blocker without reopening
  production.
- Behavior Tests: rerun the exact five existing Slice 1 test files named above;
  no test file is added and no expectation is weakened. Compare pre- and
  post-correction summary/output-context bytes for the existing fixtures and
  run the existing deterministic differential corpus across reordered,
  malformed, ambiguous, large, unsupported, and uncalculated inputs. The
  correction is not complete if any focused scenario, summary field, ordering,
  or serialized byte changes.
- Approval Boundary: only
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` and
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`; the five
  existing Slice 1 test files are validation-only and remain under the
  original Slice 1 boundary. `compareSemanticDiff.ts` and `TRACEABILITY.md`
  are excluded from correction 2. If evidence requires either excluded path,
  stop and return to Main for Replanning.
- Validation: correction 2's existing focused suites, summary/output-context
  byte comparison, 400-case differential corpus, compile, desktop/web, and
  local Qlty evidence remain recorded below. The separate format-only gate
  completed at published head `29f34008`: Cloud-compatible Prettier 3.6.2,
  Markdown lint, and diff checks passed; published `qlty fmt` is clean, the
  structural result is 46, and no S1 replacement is active.
- Production Readiness: retain all original Slice 1 malformed, ambiguous,
  reordered, large, unsupported, and uncalculated input coverage; preserve
  summary consumers and bytes; add no host, parser, telemetry, I/O, Node, VS
  Code, or configuration dependency.
- Dependencies: correction 2 implementation is published at `6b6e4df5` and
  independently reviewed. The format-only closure package completed at
  `29f34008`. Slice 2 owns 11 findings: ten active findings cleared by the
  original implementation and one hidden `function-complexity` aggregate on
  `renderSummary` requiring correction.
- Risks: the completed runtime refactor's behavior evidence must not be
  invalidated by a documentation-only reconciliation; global formatting can
  rewrite unrelated files; stale inventory attribution can incorrectly reopen
  production or omit Slice 2's hidden aggregate. Formatter snapshots, exact
  cloud inventory, and explicit S2 ownership are mandatory.
- Out of Scope: `compareSemanticDiff.ts`, all S2-S5 production files and tests,
  `TRACEABILITY.md` in the correction 2 production commit, Qlty configuration,
  suppressions, thresholds, baselines, and any observable behavior or durable
  documentation change.

#### Slice 1 Format-only Closure Gate: Reconcile Inventory And Format Docs

- Status: Complete; published at `29f34008`; qlty format gate passed with no
  formatting issues
- Trigger: authoritative GraphQL review-thread reconciliation at published
  head `6b6e4df5` reports 45 active inline rule instances and one hidden
  `function-complexity` aggregate on `renderSummary` owned by Slice 2. The
  resulting 46 structural blockers satisfy Slice 1's corrected inventory. The cloud
  Prettier finding on `TASKS.md` (thread `3926429642`) is resolved at published
  head `29f34008`, with no active Slice 1 replacement thread.
- Scope: update only the planning reconciliation in `TASKS.md` and
  `TRACEABILITY.md`, then run the approved guarded global Qlty formatter. Do
  not reopen or modify `buildSemanticDiffSummary.ts`, `compareSemanticDiff.ts`,
  any test, configuration, generated artifact, or production boundary.
- Acceptance: the exact two-file planning package is formatted and published;
  pre/post snapshots prove that the global formatter changed no path outside
  those two package paths; published `qlty fmt` is clean on head `29f34008`;
  published `qlty check` remains at structural 46 with no S1 replacement.
  Slice 1 is complete and Slice 2 begins under its existing exact boundary.
- Approval Boundary: exactly
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md` for
  the replan package. The package authorizes no runtime, test, generated,
  configuration, or other documentation path.
- Validation: immutable status, changed-path, and content-digest snapshots
  proved that only the two listed planning paths changed; Cloud-compatible
  Prettier 3.6.2, `rtk pnpm run lint:md`, and `git diff --check` passed.
  Published head `29f34008` reports `qlty fmt` pass with no formatting issues,
  `qlty check` at structural 46, and no S1 replacement. Production tests and
  source Qlty were not rerun for this format-only gate; correction 2's
  completed evidence remains authoritative.
- Completion Decision: Yes. The exact format-only planning package is
  published at `29f34008` with a clean formatter check. Slice 1 is complete
  for this feature. The accepted structural count is 46, not 45, because the
  extra `renderSummary` aggregate belongs to Slice 2; no production
  implementation is reopened.
- Dependencies: correction 2 implementation commit `6b6e4df5`, its `Ready`
  implementation review, and Completion Approval are preserved. This package
  has independent plan review `Ready` with no Findings and Human Approval;
  Slice 2's original implementation is published under its original boundary;
  its corrected hidden finding is implemented, reviewed, and published at
  `9e2c45a4` with structural 35 and Verify/CodeQL passing; the exact two-file
  format-only gate remains pending.
- Out of Scope: all runtime, test, generated-artifact, configuration,
  suppression, threshold, baseline, and Qlty policy changes; all S2-S5
  production and test paths.

### Slice 2: Preserve Markdown Projection And Mode Dispatch

- Status: Runtime correction complete and published at `9e2c45a4`; structural
  cloud gate is 35 and Verify/CodeQL pass. The two-file format-only gate is
  pending and runtime must not be reopened
- Published target after the Slice 2 format-only reconciliation: 35 structural
  blockers, zero format blockers, and no replacement finding
- Scope: the original implementation simplified Audit relation/section
  assembly, localization target and confirmation formatting, constraint
  selection, and Markdown output dispatch in
  `renderSemanticDiffAuditMarkdown.ts`,
  `semanticDiffMarkdownLocalization.ts`, and `semanticDiffOutput.ts`. The
  correction is limited to reducing `renderSummary` complexity in
  `semanticDiffMarkdownLocalization.ts`; it must retain the current generated
  strings and section order.
- User / Domain Value: Summary, Full, and Audit remain byte-for-byte compatible
  for existing fixtures in English, Japanese, regional Japanese, and English
  fallback, while all assigned Markdown Qlty blockers are removed.
- Cohesive Change Group: the original implementation cleared ten active
  findings in the three production files at `75add547`. The remaining eleventh
  Slice 2 finding is one hidden aggregate `function-complexity` on
  `renderSummary` at `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts:159`
  (complexity count 8). The previous `localizedUnitChange` aggregate and
  `return-statements` attribution was incorrect and is not part of the current
  plan.
- Acceptance: Full Markdown bytes are unchanged; Summary and Audit fixture
  bytes and meaning are unchanged; raw identifiers, paths, parameter keys, and
  JP1/AJS values are preserved; null/missing evidence, empty states, all nine
  confirmation reasons, limitations, schedule period/runs, and language
  fallback render exactly as before; the supplied immutable context is reused.
- Validation: the original S2 implementation owns the Full projection,
  localization, escaping, and newline scenarios in
  `renderSemanticDiffMarkdown.test.ts`; the Summary and Audit projection,
  context-reuse, fallback, all-nine-reason, constraint, warning, limitation,
  and schedule scenarios in `semanticDiffMarkdownProjections.test.ts`; and
  every mode-dispatch/picker scenario in `semanticDiffOutput.test.ts`. The
  correction reruns the affected Summary projection and immutable byte/digest
  cases; the test file remains validation-only. S3 and S4 must not edit or
  claim these scenarios. Before the correction, the original implementation
  captured immutable baseline bytes and
  SHA-256 digests from commit
  `4fc386413d6eb84aaeefe13e0b6847bc3963cb94` for the empty and populated
  Summary/Full/Audit fixtures under `undefined`, `en`, `ja`, `ja-JP`, and
  unsupported `fr` fallback where each mode is supported. Include one
  populated corpus containing Japanese text, Markdown-special identifiers
  (`*`, `_`, `[`, `]`, backslash), and literal embedded newlines; store the
  captured bytes and digests as immutable test constants keyed by
  mode/fixture/language and assert both exact bytes and digest after the
  refactor. Do not regenerate or update those constants from the changed
  implementation. The original S2 implementation passed the compile, desktop,
  build, web, Markdown lint, diff, and focused Qlty checks. The correction must
  rerun the affected projection suite, `rtk pnpm run test:compile`,
  `rtk pnpm run test:desktop:run`, and the relevant Qlty check before review.
  After its focused correction commit is pushed, wait for the published PR
  `qlty check` and `qlty fmt` to terminate, and record that the hidden
  `renderSummary` blocker is gone, the remaining inventory is exactly 35, and
  no replacement finding is present.
- Production Readiness: escaping and raw-value preservation remain safe for
  Japanese and Markdown-special text; no UI framework, VS Code, host, or Node
  dependency enters the host-neutral presentation modules.
- Approval Boundary: the original implementation boundary is the three
  production files and three focused test files named in this slice. The
  corrected implementation boundary is exactly
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`, with
  `renderSummary` as the only target; `semanticDiffMarkdownProjections.test.ts`
  is validation-only. Same-directory pure helper extraction is allowed only
  inside the target file; a new module or test expectation requires Replanning.
- Dependencies: Slice 1 production correction commit `6b6e4df5`, the completed
  format-only closure package at published head `29f34008`, and the original
  Slice 2 implementation/review at `75add547`. The runtime correction passed
  independent replan review, application of the existing Human Approval, the
  approval-committer replan commit, corrected implementation review, and
  Completion Approval before publication at `9e2c45a4`. The two-file
  format-only reconciliation is the remaining gate.
- Risks: table-driven rendering can silently change fallback precedence,
  Markdown punctuation/newlines, section ordering, or missing-evidence output;
  a complexity-only helper extraction can accidentally alter closure capture or
  summary byte order.
- Out of Scope: wording/localization additions, mode behavior, JSON, commands,
  report-provider lifecycle, resource strings, README, and CHANGELOG.

#### Slice 2 Correction Gate: Reduce `renderSummary` Complexity

- Status: Runtime correction complete and published at `9e2c45a4`; structural
  cloud gate is 35 and Verify/CodeQL pass. The format-only document gate is
  pending; runtime must not be reopened
- Trigger: the published Slice 2 head `75add547` reports 36 structural Qlty
  blockers instead of the expected 35. The PR summary is
  `function-complexity` 16, `boolean-logic` 10, `return-statements` 8, and
  `file-complexity` 2. GraphQL reconciliation confirms 35 active inline
  later-slice instances plus one hidden `function-complexity` aggregate with
  complexity count 8 on `renderSummary` at line 159 of
  `semanticDiffMarkdownLocalization.ts`. The former `localizedUnitChange`
  aggregate attribution was incorrect; no `return-statements` aggregate is
  assigned to Slice 2.
- Scope: extract or table-drive only the private branches needed to reduce
  `renderSummary` complexity, preserving its localization lookup, fallback
  precedence, output strings, section ordering, special-character escaping,
  embedded-newline handling, and supplied-context reuse. Do not reopen the ten
  findings cleared by the original implementation.
- User / Domain Value: the existing Summary/Full/Audit Markdown output remains
  byte-for-byte unchanged while the final Slice 2 Qlty blocker is removed.
- Acceptance: the hidden `renderSummary` aggregate is absent from the
  published result and the exact structural inventory is 35 with no
  replacement finding at `9e2c45a4`; the format-only reconciliation must make
  the two feature-document paths pass both formatter versions and cloud
  `qlty fmt` without changing runtime or expected Markdown bytes.
- Validation: rerun the affected Summary projection and digest cases, then
  `rtk pnpm run test:compile`, `rtk pnpm run test:desktop:run`, and the
  relevant Qlty checks. The existing Slice 2 build/web evidence remains
  authoritative unless the implementation reviewer requests a targeted rerun.
  The pushed `9e2c45a4` head records terminal Verify, CodeQL, and structural
  `qlty check`; its `qlty fmt` result is the two-document failure handled by
  the separate format-only replan below. Record the corrected format-only head
  and terminal `qlty fmt` result before starting Slice 3.
- Production Readiness: no new host, UI framework, Node, parser, telemetry,
  I/O, VS Code engine, desktop, web, JP1/AJS, or durable-document dependency;
  malformed, empty, localized, special-character, and large-result behavior
  remains covered by the existing S2 corpus.
- Approval Boundary: exactly
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`; the
  existing Markdown projection test is validation-only. Completion evidence
  may update this feature's `TASKS.md` and `TRACEABILITY.md` only after the
  corrected implementation review and under the completion gate.
- Dependencies: independent replan review `Ready`, the existing Human
  Approval for the unchanged Slice 2 boundary, focused replan commit
  `cef0abfe`, then implementer, independent implementation review `Ready`,
  conditional Completion Approval, and the approval-committer correction commit
  in that order; these runtime gates are complete at `9e2c45a4`. The separate
  format-only replan review, existing format-only approval, and exact two-file
  approval-committer commit remain pending.
- Risks: helper extraction may change closure capture, localization fallback,
  or exact bytes; an unexpected test, production file, or behavior change is a
  Replanning stop and cannot be absorbed into this correction.
- Out of Scope: `localizedUnitChange`, all other S2 functions/files, all S1
  paths, test expectation changes, JSON, commands, provider behavior, Qlty
  configuration, suppressions, thresholds, baselines, and documentation
  outside this feature folder.

#### Slice 2 Format-only Reconciliation Gate: Stabilize Feature Documents

- Status: Approved replan; independent review `Ready` with no Findings and
  Main's existing format-only Human Approval applied. Execution is pending the
  exact two-file `approval-committer` replan/format commit.
- Trigger: published runtime head `9e2c45a4` has structural Qlty 35 with
  Verify/CodeQL passing, but cloud `qlty fmt` reports exactly the two feature
  documents `TASKS.md` and `TRACEABILITY.md` as unformatted. Read-only
  reproduction shows `pnpm dlx prettier@3.6.2 --check` rejects only
  `TRACEABILITY.md`, while explicit local Qlty `--no-fix` on the three relevant
  paths reports the two feature documents' Prettier findings and a clean
  `semanticDiffMarkdownLocalization.ts` source path. The known local Qlty
  Prettier 3.3.3 versus cloud Prettier 3.6.2 difference is the gate mismatch;
  runtime is complete and must not be reopened.
- Scope: format only
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`.
  Structure-preserving Markdown cleanup, including clarifying ambiguous nested
  lists, is allowed only when it changes no requirement, traceability mapping,
  approval evidence, or slice meaning. No production, test, configuration,
  Qlty policy, suppression, threshold, baseline, or other documentation path is
  authorized.
- User / Domain Value: the published runtime correction remains intact while
  the feature's required quality gate becomes stable across the local and
  cloud formatter versions.
- Acceptance: both documents pass the cloud-compatible Prettier 3.6.2 check,
  the repository-local Qlty formatter/check using Prettier 3.3.3, and
  `rtk pnpm run lint:md`; `rtk git diff --check` passes; only the two approved
  documents change; and the source-path digest for
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts` is
  unchanged. Published structural Qlty remains 35 with no replacement, and
  Verify/CodeQL remain passing.
- Validation: capture immutable pre/post `git status --short
--untracked-files=all`, `git diff --name-only`, and SHA-256 content digests
  for both approved documents and the read-only source guard. Run the
  Cloud-compatible `pnpm dlx prettier@3.6.2` check/write path, then verify the
  repository-local Qlty/Prettier 3.3.3 result, Markdown lint, and diff check.
  If either formatter rewrites a non-approved path or the two versions cannot
  agree without changing meaning, stop and return to Main for Replanning.
  After the exact two-file commit is pushed, wait for terminal cloud `qlty fmt`
  and confirm structural 35, no replacement, Verify, and CodeQL before Slice 3.
- Production Readiness: this is a documentation-only formatting correction;
  no runtime, JP1/AJS, VS Code, desktop, web, parser, host, or Node behavior
  changes. The format-only package must not reopen or amend the published
  runtime correction.
- Approval Boundary: exactly
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`.
  `semanticDiffMarkdownLocalization.ts` is a read-only digest guard, not a
  change target.
- Dependencies: independent format-only replan review `Ready`, Main's applied
  existing format-only Human Approval, and the exact two-file
  `approval-committer` replan/format commit before Slice 3. No implementation
  slice or runtime review is reopened.
- Risks: formatter-version differences can reintroduce blank-line or nested
  list churn; any semantic Markdown change, unexpected path, or source digest
  change is a Replanning stop.
- Out of Scope: all runtime/test paths, generated artifacts, configuration,
  Qlty rules or thresholds, suppressions, baselines, and all product behavior.

### Slice 3: Preserve The Exact JSON V1 Wire Contract

- Status: Approved; queued behind Slice 2 completion gate
- Scope: decompose `serializeSemanticDiffJson.ts` by its existing
  responsibilities: primitive validation/ordering, relation and target
  projection, identity projection/order, and result projection/order. Keep the
  public serializer module as the entry point and extract only private,
  presentation-layer helpers needed to reduce total and function complexity.
- User / Domain Value: automation receives the identical locale-neutral JSON
  v1 bytes, field names, key order, null/empty representation, record order,
  error behavior, media type, and trailing newline with all JSON Qlty blockers
  removed.
- Cohesive Change Group: all 24 inline Qlty anchors in the serializer, including
  file complexity, nullable/array comparison, undefined validation, relation
  pair and target projection/order, identity evidence/order, change projection,
  return-count, and boolean-chain findings. No S3 finding is hidden by the
  reconciliation; the one hidden aggregate is the Slice 2
  `renderSummary` correction described above.
- Acceptance: `buildSemanticDiffJsonV1`, `serializeSemanticDiffJson`, and
  `renderSemanticDiffJson` signatures and results are unchanged; schema and
  schemaVersion stay fixed; JSON serialization does not use locale-dependent
  ordering or mutate input; unknown reason, undefined required field, cycle,
  and non-finite-number handling remain unchanged.
- Validation: S3 owns every scenario in `semanticDiffJson.test.ts`, including
  empty and fully populated exact shapes, all nested fields/reasons,
  tie-breakers, insertion-order byte identity, UTF-16 ordering,
  undefined/non-finite errors, raw Japanese/JSON-special values, and the
  large-result case. `semanticDiffOutput.test.ts` is owned by S2 and is not
  edited by S3. Before editing, capture the immutable empty-v1 and
  populated-v1 serialized bytes and SHA-256 digests produced at commit
  `4fc386413d6eb84aaeefe13e0b6847bc3963cb94`; store the two byte strings and
  digests as immutable constants in `semanticDiffJson.test.ts`, and assert
  exact bytes plus digest after decomposition. The baseline must retain the
  trailing newline, explicit null/empty fields, key order, deterministic
  nested ordering, Japanese/escaped values, and any literal newline in the
  populated corpus; do not regenerate or update constants from the changed
  implementation. Run `rtk pnpm run test:compile` first, then
  `rtk pnpm run test:desktop:run`, then `rtk pnpm run qlty:check`. Push the
  focused completion head, wait for the published PR `qlty check` to
  terminate, and record that the 24 S3 blockers are gone and only the
  expected 11 later-slice blockers remain.
- Production Readiness: preserve linear/bounded behavior for large results,
  explicit cyclic-object handling, and browser-safe standard APIs; avoid a
  generic abstraction that obscures the v1 key construction order.
- Approval Boundary: only
  `src/presentation/semantic-diff/serializeSemanticDiffJson.ts`,
  new private modules
  `semanticDiffJsonOrdering.ts`, `semanticDiffJsonProjection.ts`, and
  `semanticDiffJsonValidation.ts` when extraction is necessary, plus
  `src/test/suite/semanticDiffJson.test.ts`. No change to
  `semanticDiffJson.ts` wire types is authorized.
- Dependencies: Slices 1 and 2 completion commits, fixing source facts and
  cross-mode presentation expectations before serializer decomposition.
- Risks: helper boundaries can alter object-literal key insertion order,
  comparator tie-breakers, explicit nulls, duplicates, exceptions, or bytes;
  splitting files can also create forbidden layer imports.
- Out of Scope: JSON v2, schema/type changes, serialization libraries, locale
  options, loss of validation, and Qlty suppression or threshold changes.

### Slice 4: Preserve Semantic Diff Command Orchestration

- Status: Approved; queued behind Slice 3 completion gate
- Scope: replace the return-heavy command workflow in
  `semanticDiffCommand.ts` with typed phase helpers or one explicit command
  outcome pipeline, preserving the current dependency interface and operation
  order.
- User / Domain Value: mode selection, before-file selection, parsing,
  one-context rendering, display, cancellation, and safe error reporting remain
  identical while the command's assigned Qlty blocker is removed.
- Cohesive Change Group: the one inline return-count anchor on
  `executeCompareSemanticDiffCommand`; helper extraction remains in the same
  command module so the host adapter boundary does not move.
- Acceptance: command ID and result union are unchanged; picker cancellation
  occurs before reading/comparing; active-editor, picker, read, parse, render,
  and display failures keep their exact result codes/messages and notification
  behavior; comparison and summary run once; the report is displayed without
  implicit clipboard or save mutation.
- Validation: S4 owns every scenario in `semanticDiffCommand.test.ts`,
  including command ID, mode selection, before-file selection, cancellation,
  active-editor/read/parse/render/display failure mapping, notification
  failure containment, one-context dispatch, and display-before-copy
  behavior. Mode-picker and output-dispatch scenarios in
  `semanticDiffOutput.test.ts` are owned by S2; S4 must not edit or claim
  them. Run `rtk pnpm run test:compile` first, then
  `rtk pnpm run test:desktop:run`, then `rtk pnpm run qlty:check`. Push the
  focused completion head, wait for the published PR `qlty check` to
  terminate, and record that the one S4 blocker is gone and only the
  expected 10 Slice 5 blockers remain.
- Production Readiness: thrown VS Code host operations and notification failure
  remain contained; definition contents, paths, and errors are not leaked; the
  adapter remains compatible with desktop and web hosts and VS Code `^1.75.0`.
- Approval Boundary: only
  `src/presentation/vscode/commands/semanticDiffCommand.ts` and
  `src/test/suite/semanticDiffCommand.test.ts`.
- Dependencies: Slices 1-3 completion commits, fixing all pure application and
  output projections consumed by the command.
- Risks: flattening branches can reorder prompts, read an active editor after
  cancellation, notify on cancellation, or map an exception to the wrong code.
- Out of Scope: command/menu/manifest/wiring changes, new UX, telemetry,
  clipboard/save behavior, and changes to host dependency contracts.

### Slice 5: Preserve Report Provider Concurrency And Lifetime

- Status: Approved; queued behind Slice 4 completion gate
- Scope: decompose the report-document provider's filename selection, content
  lookup, open/commit state transition, copy/save workflows, commit draining,
  and report resolution in `semanticDiffReportDocument.ts`. Keep one provider
  owner and its current state model; extract private same-file helpers or a
  private same-directory state helper only when it makes transitions explicit.
- User / Domain Value: displayed reports, explicit Markdown copy, explicit save,
  bounded LRU retention, concurrent-open ordering, rollback, and disposal remain
  unchanged while the final provider and file-complexity blockers are removed.
- Cohesive Change Group: all 10 inline provider anchors: file complexity,
  filename return count, content/open/copy/save/drain/resolve complexity, and
  copy/save return counts; final local and cloud reconciliation must clear the
  authoritative full set of 56 blockers with no replacement findings.
- Acceptance: URI scheme, extension, query, preview behavior, default and
  injected limits, LRU access/tie ordering, creation-order commit, pending
  content, selective failed-open rollback, idempotent disposal, stale operation
  invalidation, JSON copy rejection, UTF-8 save bytes, messages, and boolean or
  rejected-promise outcomes are unchanged.
- Validation: S5 owns every scenario in `semanticDiffReportDocument.test.ts`,
  including limits 31/32/33, concurrent success/failure, disposal races,
  copy/save cancellation/failure, explicit URI, JSON-copy rejection, UTF-8
  bytes, and metadata. Command orchestration remains owned by S4;
  `semanticDiffCommand.test.ts` is not edited or claimed by S5. Run
  `rtk pnpm run test:compile` before the compiled desktop suite, then
  `rtk pnpm run test:desktop:run`, and run `rtk pnpm run qlty:check`. Push the
  focused completion head, wait for the published PR `qlty check` to
  terminate, and record that the 10 S5 blockers are gone with zero remaining
  blockers and no replacement finding. Only then run the final full sequence:
  `rtk pnpm run qlty`, `rtk pnpm run build`,
  `rtk pnpm run test:compile`, `rtk pnpm run test:desktop:run`, and
  `rtk pnpm run test:web:run`.
- Production Readiness: verify no hung or double-settled promise, stale display,
  eviction of the protected entry, cache growth beyond the configured bound,
  or host exception escape; retain browser-safe `TextEncoder`, no Node built-in,
  and VS Code `^1.75.0` APIs.
- Approval Boundary: only
  `src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts`, optional
  new private module
  `src/presentation/vscode/semantic-diff/semanticDiffReportDocumentState.ts`,
  and `src/test/suite/semanticDiffReportDocument.test.ts`.
- Dependencies: Slice 4 completion commit.
- Risks: state-machine decomposition can reorder commits, settle a promise
  twice, retain failed entries, mutate LRU recency at a different point, or
  permit stale copy/save/open completion after disposal.
- Out of Scope: cache-policy or limit changes, persisted reports, background
  storage, command registration, wording, output-mode semantics, and new host
  capabilities.

## Planning Inputs

- Finding inventory: the authoritative baseline Qlty PR summary reports 56
  blockers: 23 function-complexity, 12 return-count, 11 boolean-logic, 4
  parameter-count, 2 similar-code, 2 nested-control-flow, and 2
  file-complexity findings. The authoritative GraphQL reconciliation at
  published head `6b6e4df5` reports 45 active inline rule instances plus one
  non-inline aggregate, for 46 structural blockers. That aggregate is
  `function-complexity` on `renderSummary` in
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts:159`
  and belongs to Slice 2; no hidden `return-statements` finding is assigned to
  Slice 2, and it is not a `createEvidenceConfirmation` finding in Slice 1.
  Exact baseline
  ownership is S1=10, S2=11, S3=24, S4=1, and S5=10, summing to 56.
- Reported files: the eight production-code files listed in `SPECS.md`.
- Baseline evidence at `4fc386413d6eb84aaeefe13e0b6847bc3963cb94`:
  GitHub Verify, CodeQL, and both analysis jobs pass; Qlty formatting passes;
  the cloud Qlty check alone fails with 56 blockers. The published Qlty
  summary and inline comment inventory are the source/rule evidence for the
  aggregate assignment above. Local `rtk pnpm run qlty` passes only when
  its rolling-log directory is writable; local success does not replace the
  required cloud PR zero-blocker evidence.
- Slice 1 publication evidence at
  `fdd152befcc7573328337dfd82f88c0eeb880b75`: the cloud `qlty check` reports
  47 structural blockers (`function-complexity` 22,
  `return-statements` 11, `boolean-logic` 10, `nested-control-flow` 2,
  `file-complexity` 2), and the separate `qlty fmt` check reports two
  formatting blockers on `TASKS.md` (markdownlint and Prettier). Verify,
  CodeQL, and both analysis jobs pass. This historical publication blocked
  Slice 1 completion under the then-current 45-count expectation; the later
  GraphQL reconciliation supersedes that expectation with the accepted 46
  post-S1 structural count.
- Historical Slice 1 publication evidence at `94081121` recorded 46
  structural blockers and one Prettier blocker while the original
  `buildSemanticDiffSummary` function-complexity finding remained. Correction
  2 resolved that runtime finding and is preserved at `6b6e4df5`. Published
  head `29f34008` confirms 46 structural blockers: 45 active inline instances
  plus the hidden Slice 2 aggregate described above. No S1 replacement remains;
  the Prettier finding on feature `TASKS.md` (thread `3926429642`) is resolved.
- Slice ownership after reconciliation is fixed at S1=10, S2=11, S3=24, S4=1,
  and S5=10. The published progression is `56 → 46 → 35 → 11 → 10 → 0`;
  the first 46 is the accepted post-S1 structural count, and the completed
  format-only gate did not reopen production. Slice 2's next target is 35
  structural blockers, zero format blockers, and no replacement finding.
- Regression boundary: exact JSON v1 serialization; Summary, Full, and Audit
  Markdown and localization; comparison, identity, schedule, and risk meaning;
  commands; report documents; desktop and web behavior.
- Acceptance boundary: zero Qlty PR blockers plus focused and full regression
  evidence.
- Stop condition: any required behavior, contract, compatibility, Qlty policy,
  or out-of-scope production change requires return to Main for a new decision.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the remediation spans application and presentation files and needs
  explicit mapping from unchanged use-case contracts to planned slices and
  regression evidence.

## Slice 1 Implementation Evidence

- The first correction's production implementation paths were limited to
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` and
  `src/application/semantic-diff/compareSemanticDiff.ts`; this evidence is
  recorded in `TASKS.md` and `TRACEABILITY.md`. No public DTO, exported
  function signature, test expectation, configuration, or documentation
  contract changed. Correction 2 narrows the implementation path to
  `buildSemanticDiffSummary.ts` and the formatter-approved `TASKS.md` target.
- Comparison and summary behavior is preserved by named summary predicates,
  one-pass count aggregation, typed relation-pair contexts, and a typed
  confirmation-spec table. Relation correspondence remapping, deterministic
  sorting, confirmation details/reasons/constraints, and zero-inclusive
  buckets remain unchanged.
- Validation succeeded in order with `rtk pnpm run test:compile` and
  `rtk pnpm run test:desktop:run`; `rtk pnpm run build` succeeded for desktop
  and web bundles; the compiled `rtk pnpm run test:web:run` succeeded; and
  the explicit Slice 1 Qlty check returned `✔ No issues`.
- A full `qlty check --all` still reports seven pre-existing findings outside
  this slice (one unrelated formatting finding and six unrelated lint or
  Markdown findings); none are in the two changed application files.
- First correction validation covered the exact five Slice 1 suites, 400
  deterministic differential inputs, and summary edge cases. Compilation,
  compiled desktop tests, desktop/web builds, and the compiled web test passed.
  The changed `countChange` and `toRelationPair` anchors have no local Qlty
  findings; the no-cache repository check reports only seven pre-existing
  findings outside this slice. The global formatter status/path/content-digest
  guard was unchanged for every forbidden path and made no change outside the
  approved `TASKS.md` target.
- Correction 2 implementation is limited to exactly
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` and this
  `TASKS.md`; no test, `TRACEABILITY.md`, comparison, configuration, or
  presentation path changed. The five existing Slice 1 suites pass with 33
  tests, and the deterministic summary/output-context differential corpus
  passes all 400 cases with identical serialized bytes and property order.
- Correction 2 validation passed `rtk pnpm run test:compile`, the desktop
  suite, the compiled web smoke test, and the desktop/web production build.
  The local cached source Qlty check and changed-file Qlty gate report
  `No issues`; the required `qlty check --no-cache` source attempt was
  blocked by the environment's source-exfiltration safety policy before it
  could execute, so the published Qlty check remains authoritative.
- The final global `rtk pnpm run qlty:fmt` guard preserved status, changed
  paths, and SHA-256 digests for every approved and excluded path; the Qlty
  bot formatting commit `ce9a3960` removed the one approved blank line in
  `TASKS.md` and is present in local history via merge `e80ddaa0`.
- Post-commit published Qlty evidence for correction 2 is reconciled at head
  `29f34008`: 46 structural blockers consist of 45 active inline instances
  plus one hidden `renderSummary` aggregate assigned to Slice 2. This satisfies
  the Slice 1 structural gate and leaves no S1 replacement. Published `qlty fmt`
  passes
  with no formatting issues; Verify and CodeQL also pass.
- Independent implementation review of correction 2 returned `Ready` with no
  Findings. The authoritative `6b6e4df5` reconciliation and published
  `29f34008` evidence preserve the completed production result. The original
  Slice 2 implementation review also returned `Ready` with no Findings at
  `75add547`, but its cloud result is 36 because the hidden `renderSummary`
  aggregate remained. The corrected implementation review returned `Ready` with
  no Findings and activated conditional Completion Approval; the target remains
  35 structural blockers, zero format blockers, and no replacement.
- Production readiness: no Node, host, parser, telemetry, I/O, dependency,
  VS Code engine, desktop, or web compatibility surface is planned to change.

- Implementation result: the ten active Slice 2 Markdown/output-mode Qlty
  findings assigned to the original implementation were removed through
  behavior-preserving helpers and typed lookup tables. Only the three
  production paths above and `semanticDiffMarkdownProjections.test.ts` changed;
  no JSON, command, provider, comparison, configuration, suppression, or
  threshold path changed. The remaining hidden `renderSummary` aggregate is
  the separate correction target.
- Review and byte evidence: the original implementation review returned
  `Ready` with no Findings. The immutable baseline differential harness
  compared 17 existing Markdown projection byte cases against commit
  `4fc386413d6eb84aaeefe13e0b6847bc3963cb94` with zero mismatches. The focused
  digest gate additionally asserts immutable UTF-8 byte lengths and SHA-256
  digests for empty and populated Summary, Full, and Audit fixtures in English
  and Japanese, including `undefined`, `en`, `ja`, `ja-JP`, unsupported `fr`
  fallback, Markdown-special identifiers, and literal embedded newlines.
- Validation evidence for the original implementation: `rtk pnpm run test:compile`,
  `rtk pnpm run test:desktop:run`, `rtk pnpm run build`,
  `rtk pnpm run test:web:run`, `rtk pnpm run lint:md`,
  `rtk git diff --check`, and the focused four-path Qlty check all pass.
  Cloud-compatible formatting was checked without changing Qlty policy or
  using a conflicting local formatter. The original implementation's published
  Qlty result is 36; the corrected runtime completion is published at
  `9e2c45a4` with structural 35 and Verify/CodeQL passing. The remaining
  terminal gate is format-only on the two feature documents.
- Correction implementation result: `renderSummary` now delegates input
  normalization, scope/count lines, schedule lines, and result status to
  private same-file helpers. Its public signature, localization fallback,
  section order, and generated Markdown remain unchanged. Only
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts` was
  changed; `semanticDiffMarkdownProjections.test.ts` remained validation-only.
- Correction validation evidence: `rtk pnpm run test:compile`,
  `rtk pnpm run test:desktop:run`, `rtk pnpm run build`, and the compiled web
  smoke test passed. The target-file Qlty check and target-file formatter check
  reported no issues, and `rtk git diff --check` passed. The corrected
  implementation review is `Ready` with no Findings and conditional Completion
  Approval is recorded; runtime completion is published at `9e2c45a4` with
  structural 35 and Verify/CodeQL passing. The exact two-file format-only gate
  remains pending.

## Feature Exit

- Definition of Done status: Slice 2's original and corrected implementation
  reviews are complete, and conditional Completion Approval is recorded; its
  runtime correction is published at `9e2c45a4` with structural 35 and
  Verify/CodeQL passing. The exact two-file format-only gate remains before
  later slices and Feature Exit. Slice 1's production correction review,
  completion approval, and format-only published gate remain complete at 46
  structural blockers with zero formatting blockers and no replacement.
- Durable documentation updates: none expected; re-evaluate only if an actual
  durable behavior or architecture decision changes.
- Required exit evidence: five focused completion commits; every requirement
  and acceptance row mapped in `TRACEABILITY.md`; zero blockers in local Qlty
  and the Qlty PR check on the published remediated head; zero formatting
  blockers from `qlty fmt`; full build, architecture dependency coverage,
  desktop tests, web tests, and successful PR Verify/CodeQL; no unexplained
  check failure.
- Durable-document gate: confirm README, README.en, CHANGELOG, the two use cases,
  architecture, and roadmap remain unchanged because the remediation has no
  observable or durable-policy effect. Any required edit is a Replanning stop.
- Open risks: deterministic bytes/order/nullability, Markdown wording/fallback,
  comparison identity/relation meaning, command control flow, provider
  concurrency/LRU/disposal, or desktop/web compatibility can regress despite a
  type-correct refactor; the slice-specific tests and final cross-host checks
  are mandatory.

## Validation

- [ ] Qlty PR blocking count is zero for the remediated head.
- [ ] Local `rtk pnpm run qlty` passes with no suppression, baseline,
      configuration, or threshold change.
- [x] Slice 1 format-only closure package is published at `29f34008` with a
      clean Cloud-compatible Prettier 3.6.2 check and published `qlty fmt`
      terminal result; Markdown lint and `git diff --check` pass. Published
      `qlty check` remains at the accepted 46 structural blockers (45 active
      inline plus the Slice 2 hidden `renderSummary` aggregate), with no S1 replacement
      finding. Correction 2's local source, uncached-attempt, and summary
      byte/differential evidence are recorded; no production code was reopened.
- [ ] Slices 2-5 have published `qlty check` terminal results recorded on
      their exact pushed heads, with observed remaining structural inventory
      matching 35, 11, 10, and 0 respectively; any replacement or unexpected
      rule/function/file/format check is routed to Main for Replanning.
- [ ] Focused Semantic Diff regression tests pass.
- [ ] Exact JSON and Markdown output regressions pass.
- [ ] Immutable baseline bytes and SHA-256 digests from commit `4fc38641` are
      asserted for JSON empty/populated and Markdown Summary/Full/Audit
      locale/fallback/escaping/newline corpora.
- [ ] Command and report-document tests pass.
- [ ] Each slice runs `rtk pnpm run test:compile` before its compiled desktop
      tests; final `rtk pnpm run build`, desktop tests, and web tests pass;
      `architectureDependencyRules.test.ts` retains the complete
      zero-exception rule catalog.
- [ ] Published PR Verify, CodeQL, and Qlty checks pass on the same head.
- [ ] README, CHANGELOG, durable use cases, architecture, and roadmap are
      confirmed unchanged because behavior and policy do not change.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
- Do not resolve a finding by disabling a rule, adding an ignore/suppression,
  changing a threshold or generated baseline, or weakening a regression test.
- Any need to touch a production or configuration path outside a slice's exact
  Approval Boundary, or to change observable bytes/meaning, returns to Main for
  Replanning and new approval.
