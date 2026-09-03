# Feature Tasks: Semantic Diff Qlty Remediation

## Agent Brief

- Purpose: remove the 56 Qlty blockers on PR #313 without observable change.
- Approved or active slice: Slice 1 production implementation and review are
  complete; its structural cloud gate is satisfied at 46 because one hidden
  aggregate belongs to Slice 2. A format-only planning-package gate remains;
  Slices 2-5 remain approved and unchanged, queued behind that gate.
- Do not: change Semantic Diff meaning, output contracts, localization, or
  command/report behavior.
- Do not: change Qlty policy, VS Code compatibility, or desktop/web support.
- Read first: `SPECS.md`, this file, and the two source use cases.
- Read `TRACEABILITY.md` only when mapping the planned slices and validation.
- Validate each slice against its focused regression contracts; require full
  desktop/web and zero-blocker local/cloud evidence before Feature Exit.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: delegate the exact two-file inventory-reconciliation package
  to `approval-committer`. Independent review and Human Approval are complete;
  a published clean `qlty fmt` result on that package closes Slice 1 without
  reopening production and permits Slice 2 to start with 35 expected remaining
  structural blockers after its 11 findings.

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

- Status: Ready for approval-committer; format-only Slice 1 closure package
  reviewed and approved
- Planning scope: five ordered, behavior-preserving refactor slices covering
  every reported blocker in all eight production files.
- Review status: Ready for approval; Findings: none
- Independent plan review: Ready for approval; Findings: none; the authoritative
  GraphQL reconciliation and Slice 1 completion gate are confirmed
- Human approval: Approved for the format-only closure package; Slice 1
  production completion and Slices 2-5 remain otherwise approved
- Active implementation slice: Slice 1 — Preserve Comparison Facts And
  Canonical Summary; production correction is complete, with the approved
  format-only planning package pending focused commit and published checks

## Human Approval

- Status: Approved for the format-only closure package; Slice 1 production
  correction and Slices 2-5 remain approved and unchanged
- Approved at: approved in current conversation
- Approved scope: the original five slice scopes and Slice 1 correction 2
  production implementation remain approved in mandatory order. The
  authoritative `6b6e4df5` reconciliation accepts Slice 1's structural gate at
  46; the exact format-only closure package below is approved for commit.
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
- Prior correction implementation paths, now superseded by this replan:
  `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`.
- Approved correction 2 implementation paths:
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` and
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`. The existing
  Slice 1 behavior-test files remain validation-only and are not expanded.
  `compareSemanticDiff.ts` is excluded unless new evidence proves that the
  current finding cannot be resolved within the summary-builder boundary;
  that case is a Replanning stop.
- Approved format-only closure package paths:
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`.

The format-only closure package is eligible for the focused
`approval-committer` commit. `Approved at` records the approval result only,
such as `none` or `approved in current conversation`; do not copy the approval
message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Format-only Reconciliation Package Approval Boundary

- Status: Ready for approval-committer; independent plan review `Ready` with no
  Findings and Human Approval approved
- Purpose: authorize one focused format-only commit of this inventory
  reconciliation package; it does not authorize runtime, test,
  generated-artifact, or configuration changes.
- Approval-committer paths (exactly):
  - `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`
  - `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`
- The Slice 1 Format-only Closure Gate below is a separate planning/completion
  boundary. The approved guarded global formatter may change only these two
  planning paths; no runtime, test, generated-artifact, or configuration path
  may change. The independent plan review and Human Approval gates are
  satisfied, so the approval-committer is eligible to create this package
  commit. A clean
  published `qlty fmt` result on that exact head closes Slice 1 without
  reopening production.

## Completion Approval

- Status: Approved for Slice 1 production completion and the format-only
  closure package; published formatter gate pending
- Approved at: approved in current conversation
- Approved scope: Slice 1 correction 2 production completion, limited to the
  exact two implementation paths below; its structural cloud gate is accepted
  at 46 because the additional aggregate finding belongs to Slice 2
- Approved paths:
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` and
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`
- Implementation review verdict: Ready; Findings: none
- Commit status: The exact format-only planning package is eligible for the
  focused approval-committer commit; published `qlty fmt` and `qlty check`
  terminal results remain pending

The prior conditional clean-review authorization remains applied to correction
2 because its independent implementation review returned `Ready` with no
Findings. The authoritative `6b6e4df5` cloud reconciliation accepts 46
structural blockers for the completed Slice 1 production scope: 45 active
inline instances plus one hidden aggregate `function-complexity` finding
owned by Slice 2. The approval-committer must preserve the exact two-file
package and verify on its published head that `qlty fmt` is clean and the
structural result remains 46 with no S1 replacement. A different formatting
result or a new S1 rule/function/file finding requires Replanning; it does not
reopen the completed Slice 1 production implementation.

After that exact two-file planning package is committed and its published
`qlty fmt` check is clean, Slice 1 may be marked complete and Slice 2 may start
with both `localizedUnitChange` aggregate findings included in its 11-finding
scope.

For the corrected Slice 1 and each later approved slice, the user's prior
conditional clean-review authorization applies only when the independent
implementation review returns `Ready` with no Findings and the published
Qlty gates are clean. The focused completion commit remains mandatory before
the next slice starts.

Completion Approval is a separate human gate after the independent
implementation review returns `Ready`. It authorizes only the exact completed
slice recorded here. The approval-committer must create the focused slice
commit before another slice or Feature Exit starts.

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
  focused completion commit. Slice 1's format-only closure gate must pass
  before Slice 2 can start.
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
- Expected published-cloud inventory, assuming no replacement findings:

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
    comprising 45 active inline instances plus one hidden aggregate owned by
    Slice 2; the Slice 1 structural gate is satisfied and no S1 replacement
    finding remains. One Prettier blocker remains on `TASKS.md` (thread
    `3926429642`).
  - After the Slice 1 format-only closure gate: 46 structural blockers
    (`function-complexity` 21,
    `return-statements` 11, `boolean-logic` 10,
    `nested-control-flow` 2, `file-complexity` 2) and zero `qlty fmt`
    blockers; Slice 1 is complete and the hidden aggregate remains assigned
    to Slice 2.
  - After Slice 2: 35 (`function-complexity` 15,
    `return-statements` 8, `boolean-logic` 10,
    `file-complexity` 2).
  - After Slice 3: 11 (`function-complexity` 6,
    `return-statements` 4, `file-complexity` 1).
  - After Slice 4: 10 (`function-complexity` 6,
    `return-statements` 3, `file-complexity` 1).
  - After Slice 5 / Feature Exit: 0; no replacement blocker.

- The terminal cloud check is authoritative for the final zero-blocker gate;
  local Qlty success does not substitute for the published result. Do not
  suppress findings or change `.qlty/`, thresholds, baselines, or plugins.

### Slice 1: Preserve Comparison Facts And Canonical Summary

- Status: Production implementation and correction 2 review complete; the
  Slice 1 structural gate is satisfied at 46, with only the format-only
  closure package and published `qlty fmt` gate pending
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
  hidden aggregate finding; that aggregate belongs to Slice 2, so the Slice 1
  structural gate is correctly satisfied at 46 with no S1 replacement.
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
  differential corpus. The published `6b6e4df5` result confirms the expected
  46 structural blockers for the post-S1 state; only the planning-artifact
  Prettier gate remains.
- Production Readiness: retain deterministic behavior for reordered, malformed,
  ambiguous, large, unsupported, and uncalculated inputs; do not add I/O, host,
  parser, telemetry, or Node dependencies.
- Approval Boundary: only
  `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and the five focused
  test files named above. Test edits may strengthen characterization only and
  must not change expected semantics.
- Dependencies: the correction 2 implementation is published at `6b6e4df5`
  and independently reviewed. The format-only closure package below must be
  reviewed, approved, and committed by `approval-committer` before Slice 2.
- Risks: a superficially equivalent helper can change relation ID remapping,
  ordering, truth-table precedence, or the combined confirmation count.
- Out of Scope: DTO/schema changes, domain identity or risk rules, schedule
  interpretation, Markdown/JSON/presentation work, and performance redesign.

#### Slice 1 Correction 2 Gate: Reduce Summary Builder Complexity And Formatting

- Status: Complete for production; independent implementation review `Ready`
  with no Findings; structural gate accepted at 46. Only the format-only
  planning package and its published `qlty fmt` check remain.
- Trigger and reconciliation: correction 2 was implemented from the historical
  `94081121` evidence and is preserved in history. Its published head
  `6b6e4df5` reports 45 active inline rule instances plus one non-inline
  aggregate `function-complexity` finding on `localizedUnitChange` in Slice 2.
  Therefore 46 structural blockers is the correct post-S1 cloud result, not an
  S1 excess or replacement. The only remaining cloud issue is one Prettier
  finding on feature `TASKS.md` (thread `3926429642`), handled by the separate
  format-only closure gate below.
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
  uses the approved guarded global `rtk pnpm run qlty:fmt`: capture immutable
  pre/post status, changed-path, and content-digest snapshots and allow only
  the two planning package paths to change. Run `rtk pnpm run lint:md` and a
  Prettier check, push the exact two-file package, and wait for published
  `qlty fmt` and `qlty check` terminal results. Accept structural 46 as the
  correct post-S1 result, zero formatting blockers, and no new S1 replacement;
  a formatting change outside the package or a new S1 rule/function/file
  finding stops for Replanning.
- Production Readiness: retain all original Slice 1 malformed, ambiguous,
  reordered, large, unsupported, and uncalculated input coverage; preserve
  summary consumers and bytes; add no host, parser, telemetry, I/O, Node, VS
  Code, or configuration dependency.
- Dependencies: correction 2 implementation is published at `6b6e4df5` and
  independently reviewed. The format-only closure package requires a fresh
  plan review, Human Approval, and focused package commit. Slices 2-5 remain
  unchanged; Slice 2 owns 11 findings including both `localizedUnitChange`
  aggregate findings.
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

- Status: Approved; ready for approval-committer; published format gate
  pending
- Trigger: authoritative GraphQL review-thread reconciliation at published
  head `6b6e4df5` reports 45 active inline rule instances and one hidden
  aggregate `function-complexity` finding owned by Slice 2. The resulting 46
  structural blockers satisfy Slice 1's corrected inventory; only the cloud
  Prettier finding on `TASKS.md` (thread `3926429642`) remains for this gate.
- Scope: update only the planning reconciliation in `TASKS.md` and
  `TRACEABILITY.md`, then run the approved guarded global Qlty formatter. Do
  not reopen or modify `buildSemanticDiffSummary.ts`, `compareSemanticDiff.ts`,
  any test, configuration, generated artifact, or production boundary.
- Acceptance: the exact two-file planning package is formatted and committed;
  pre/post snapshots prove that the global formatter changed no path outside
  those two package paths; published `qlty fmt` is clean on the exact package
  head; published `qlty check` remains at structural 46 with no new S1
  replacement. At that point Slice 1 is marked complete and Slice 2 may begin.
- Approval Boundary: exactly
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md` and
  `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md` for
  the replan package. The package authorizes no runtime, test, generated,
  configuration, or other documentation path.
- Validation: capture immutable `git status --short --untracked-files=all`,
  `git diff --name-only`, and content digests for every listed path; run the
  approved global `rtk pnpm run qlty:fmt`; compare the same snapshots and
  digests afterward; run `rtk pnpm run lint:md`, a Prettier check, and
  `git diff --check`; push the exact package head and wait for published
  `qlty fmt` and `qlty check` terminal results. Do not rerun production tests
  or source Qlty for this format-only gate; correction 2's completed evidence
  remains authoritative.
- Completion Decision: Yes. After the exact format-only planning package
  commit and clean published formatter check, Slice 1 is complete for this
  feature. The accepted structural count is 46, not 45, because the extra
  aggregate belongs to Slice 2; no production implementation is reopened.
- Dependencies: correction 2 implementation commit `6b6e4df5`, its `Ready`
  implementation review, and Completion Approval are preserved. This package
  has independent plan review `Ready` with no Findings and Human Approval;
  Slice 2 remains queued until the focused commit and its published checks
  pass.
- Out of Scope: all runtime, test, generated-artifact, configuration,
  suppression, threshold, baseline, and Qlty policy changes; all S2-S5
  production and test paths.

### Slice 2: Preserve Markdown Projection And Mode Dispatch

- Status: Approved; queued behind the Slice 1 format-only closure package
- Scope: simplify Audit relation/section assembly, localization target and
  confirmation formatting, constraint selection, and Markdown output dispatch
  in `renderSemanticDiffAuditMarkdown.ts`,
  `semanticDiffMarkdownLocalization.ts`, and `semanticDiffOutput.ts`. Prefer
  typed lookup tables and small pure render helpers while retaining the current
  generated strings and section order.
- User / Domain Value: Summary, Full, and Audit remain byte-for-byte compatible
  for existing fixtures in English, Japanese, regional Japanese, and English
  fallback, while all assigned Markdown Qlty blockers are removed.
- Cohesive Change Group: the nine inline anchors in these three files plus both
  aggregate-only findings on `localizedUnitChange` at
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts:159`:
  `function-complexity` and `return-statements`. The authoritative
  reconciliation assigns S2 exactly 11 blockers; the hidden complexity and
  return findings are one cohesive helper boundary and remain within the same
  three production-file boundary.
- Acceptance: Full Markdown bytes are unchanged; Summary and Audit fixture
  bytes and meaning are unchanged; raw identifiers, paths, parameter keys, and
  JP1/AJS values are preserved; null/missing evidence, empty states, all nine
  confirmation reasons, limitations, schedule period/runs, and language
  fallback render exactly as before; the supplied immutable context is reused.
- Validation: S2 owns the Full projection, localization, escaping, and
  newline scenarios in `renderSemanticDiffMarkdown.test.ts`; the Summary and
  Audit projection, context-reuse, fallback, all-nine-reason, constraint,
  warning, limitation, and schedule scenarios in
  `semanticDiffMarkdownProjections.test.ts`; and every mode-dispatch/picker
  scenario in `semanticDiffOutput.test.ts`. S3 and S4 must not edit or claim
  those scenarios. Before editing, capture immutable baseline bytes and
  SHA-256 digests from commit
  `4fc386413d6eb84aaeefe13e0b6847bc3963cb94` for the empty and populated
  Summary/Full/Audit fixtures under `undefined`, `en`, `ja`, `ja-JP`, and
  unsupported `fr` fallback where each mode is supported. Include one
  populated corpus containing Japanese text, Markdown-special identifiers
  (`*`, `_`, `[`, `]`, backslash), and literal embedded newlines; store the
  captured bytes and digests as immutable test constants keyed by
  mode/fixture/language and assert both exact bytes and digest after the
  refactor. Do not regenerate or update those constants from the changed
  implementation. Run `rtk pnpm run test:compile` first, then
  `rtk pnpm run test:desktop:run`, then `rtk pnpm run qlty:check`. Push the
  focused completion head, wait for the published PR `qlty check` to
  terminate, and record that the 11 S2 blockers are gone and only the
  expected 35 later-slice blockers remain.
- Production Readiness: escaping and raw-value preservation remain safe for
  Japanese and Markdown-special text; no UI framework, VS Code, host, or Node
  dependency enters the host-neutral presentation modules.
- Approval Boundary: only the three production files and three focused test
  files named in this slice. Same-directory pure helper extraction is allowed
  only inside those existing files; a new module requires Replanning.
- Dependencies: Slice 1 production correction commit `6b6e4df5` plus the
  format-only closure package and its clean published checks, so the shared
  comparison context is a fixed regression baseline.
- Risks: table-driven rendering can silently change fallback precedence,
  Markdown punctuation/newlines, section ordering, or missing-evidence output.
- Out of Scope: wording/localization additions, mode behavior, JSON, commands,
  report-provider lifecycle, resource strings, README, and CHANGELOG.

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
  aggregate reconciliation: the two aggregate-only findings are explicitly
  assigned to S1 and S2 above.
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
  `function-complexity` on `localizedUnitChange` in
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts:159`
  and belongs to Slice 2 alongside its aggregate `return-statements` finding;
  it is not a `createEvidenceConfirmation` finding in Slice 1. Exact baseline
  ownership is S1=10, S2=11, S3=24, S4=1, and S5=10, summing to 56.
- Reported files: the eight production-code files listed in `SPECS.md`.
- Baseline evidence at `4fc386413d6eb84aaeefe13e0b6847bc3963cb94`:
  GitHub Verify, CodeQL, and both analysis jobs pass; Qlty formatting passes;
  the cloud Qlty check alone fails with 56 blockers. The published Qlty
  summary and inline comment inventory are the source/rule evidence for the
  two aggregate assignments above. Local `rtk pnpm run qlty` passes only when
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
  2 resolved that runtime finding and is preserved at `6b6e4df5`. The current
  GraphQL reconciliation at that head is 46 structural blockers: 45 active
  inline instances plus the hidden Slice 2 aggregate described above. No S1
  replacement remains; the only open cloud issue is the Prettier finding on
  feature `TASKS.md` (thread `3926429642`).
- Slice ownership after reconciliation is fixed at S1=10, S2=11, S3=24, S4=1,
  and S5=10. The published progression is `56 → 46 → 35 → 11 → 10 → 0`;
  the first 46 is the accepted post-S1 structural count and the remaining
  format-only gate must not reopen production.
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
  `6b6e4df5`: 46 structural blockers consist of 45 active inline instances
  plus one hidden aggregate assigned to Slice 2. This satisfies the Slice 1
  structural gate and leaves no S1 replacement; the one remaining cloud issue
  is the planning-artifact Prettier finding on `TASKS.md` (thread
  `3926429642`). A format-only two-file planning package and its published
  clean `qlty fmt` result remain pending.
- Independent implementation review of correction 2 returned `Ready` with no
  Findings. The authoritative `6b6e4df5` reconciliation satisfies the S1
  structural gate at 46 and preserves the completed production evidence. The
  active gate is the format-only planning package review, Human Approval,
  focused commit, and published clean `qlty fmt`; it must not reopen runtime
  code or tests. Slice 2 remains blocked only until that format-only cloud gate
  is confirmed, then starts with both `localizedUnitChange` aggregate findings
  in its 11-finding scope.
- Production readiness: no Node, host, parser, telemetry, I/O, dependency,
  VS Code engine, desktop, or web compatibility surface is planned to change.

## Feature Exit

- Definition of Done status: not started; Slice 1 production correction review
  and conditional Completion Approval are complete, and its structural gate is
  accepted at 46. The format-only planning package and published formatter
  gate remain before Slice 1 is closed; all later implementation, review,
  completion-commit, and Feature Exit gates remain.
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
- [ ] Slice 1 format-only closure package has an approved focused commit and
      published `qlty fmt` terminal result on its exact pushed head, with zero
      formatting blockers; published `qlty check` remains at the accepted 46
      structural blockers (45 active inline plus the Slice 2 hidden aggregate),
      with no S1 replacement finding. Correction 2's local source,
      uncached-attempt, and summary byte/differential evidence are recorded;
      no production code is reopened for the format-only gate.
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
