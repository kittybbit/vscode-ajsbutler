# Feature Tasks: Semantic Diff Qlty Remediation

## Agent Brief

- Purpose: remove the 56 Qlty blockers on PR #313 without observable change.
- Approved or active slice: the approved Slice 1 correction is active; Slices
  2-5 remain approved and queued behind the corrected Slice 1 completion.
- Do not: change Semantic Diff meaning, output contracts, localization, or
  command/report behavior.
- Do not: change Qlty policy, VS Code compatibility, or desktop/web support.
- Read first: `SPECS.md`, this file, and the two source use cases.
- Read `TRACEABILITY.md` only when mapping the planned slices and validation.
- Validate each slice against its focused regression contracts; require full
  desktop/web and zero-blocker local/cloud evidence before Feature Exit.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: delegate the approved exact two-document replan package to
  `approval-committer`, then implement the active Slice 1 correction.

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

- Status: Approved; Slice 1 correction gate active
- Planning scope: five ordered, behavior-preserving refactor slices covering
  every reported blocker in all eight production files.
- Review status: Ready for approval; no Findings
- Independent plan review: `Ready for approval`; Findings: none; revised
  five-slice plan and exact replan package boundary confirmed
- Human approval: Approved for the revised replan package and active Slice 1
  correction; Slices 2-5 remain unchanged and approved
- Active implementation slice: Slice 1 — Preserve Comparison Facts And
  Canonical Summary; correction active after the replan package commit

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: the unchanged original five slice scopes remain approved in
  mandatory order, and the revised Slice 1 correction is approved as the
  active first slice; Slices 2-5 remain queued behind its completion commit
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
- Approved correction implementation paths:
  `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`. The existing
  Slice 1 behavior-test files remain validation-only for the correction and
  are not expanded.

The Slice 1 correction must not start until this approved replan package is
committed by `approval-committer`. `Approved at` records the approval result
only, such as `none` or `approved in current conversation`; do not copy the
approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Replan Package Approval Boundary

- Status: Ready for approval-committer; independent review Ready with no
  Findings and Human Approval approved
- Purpose: authorize one focused commit of this revised planning package only;
  it does not authorize runtime, test, generated-artifact, or configuration
  changes.
- Approval-committer paths (exactly):
  - `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`
  - `docs/specs/features/semantic-diff-qlty-remediation/TRACEABILITY.md`
- The Slice 1 Correction Gate below is a separate implementation/completion
  boundary. Its formatter target may include `TASKS.md`, but
  `TRACEABILITY.md` is excluded from the correction runtime and completion
  commit. No path outside the two paths above may be included in the replan
  package commit. The approval-committer is eligible to create this package
  commit now; implementation remains limited to the approved correction paths
  after that commit.

## Completion Approval

- Status: Pending; Slice 1 completion is reopened by the published cloud gate
- Approved at: none for the correction scope
- Approved scope: none until the corrected Slice 1 implementation review
- Approved paths: none until the corrected Slice 1 implementation review and
  Completion Approval
- Implementation review verdict: prior `Ready` had no Findings, but is
  superseded for completion by the published Qlty result
- Commit status: Not eligible

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
  focused completion commit. The reopened Slice 1 must pass its correction
  gate before Slice 2 can start.
- Every slice must run `qlty fmt` and pass Qlty locally. For the Slice 1
  correction's global `rtk pnpm run qlty:fmt` invocation, capture immutable
  pre-format snapshots of `git status --short --untracked-files=all`,
  `git diff --name-only`, and the working-tree content digest for each listed
  path. Capture the same snapshots and digests after the command and compare
  them. The only path the formatter may change in that correction is
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`; its
  `TRACEABILITY.md`, runtime, test, generated, configuration, and every other
  path are forbidden formatter changes. If any forbidden path or digest change
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
  - After the Slice 1 correction gate: 45 structural blockers
    (`function-complexity` 20,
    `return-statements` 11, `boolean-logic` 10,
    `nested-control-flow` 2, `file-complexity` 2) and zero `qlty fmt`
    blockers.
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

- Status: Active; correction gate approved, pending replan package commit and
  implementation; completion commit not eligible
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
- Cohesive Change Group: the original 11 assigned Qlty anchors remain the
  Slice 1 ownership. The published `fdd152be` result reconciles them as ten
  resolved findings (summary function complexity, the aggregate
  `createEvidenceConfirmation` complexity, boolean logic, all four parameter
  findings, its return finding, and both similar-code findings), one remaining
  original function finding (`toRelationPair`, current line 445), and one
  replacement function finding (`countChange`, current line 81). The current
  cloud total is therefore two above the expected post-S1 inventory; the
  correction gate below owns exactly those two function-complexity findings.
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
  result is not a valid completion gate. The correction must rerun these same
  behavior scenarios, then run `rtk pnpm run test:compile`, the compiled
  desktop suite with `rtk pnpm run test:desktop:run`, `rtk pnpm run qlty:fmt`,
  and `rtk pnpm run qlty:check` in that order. Push the correction completion
  head, wait for both published checks to terminate, and record 45 remaining
  structural blockers, zero formatting blockers, and no replacement finding.
- Production Readiness: retain deterministic behavior for reordered, malformed,
  ambiguous, large, unsupported, and uncalculated inputs; do not add I/O, host,
  parser, telemetry, or Node dependencies.
- Approval Boundary: only
  `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and the five focused
  test files named above. Test edits may strengthen characterization only and
  must not change expected semantics.
- Dependencies: the fdd152be implementation commit is present but its cloud
  result reopened Slice 1; the approved replan package must be committed by
  `approval-committer` before correction implementation.
- Risks: a superficially equivalent helper can change relation ID remapping,
  ordering, truth-table precedence, or the combined confirmation count.
- Out of Scope: DTO/schema changes, domain identity or risk rules, schedule
  interpretation, Markdown/JSON/presentation work, and performance redesign.

#### Slice 1 Correction Gate: Close Remaining Comparison Findings And Formatting

- Status: Approved; active after the replan package commit
- Scope: reduce the remaining `function-complexity` finding on
  `toRelationPair` in `src/application/semantic-diff/compareSemanticDiff.ts`
  (current line 445) and the replacement `countChange` finding in
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` (current line
  81), while preserving the existing summary, relation correspondence, and
  deterministic output contracts. Run `qlty fmt` for the exact feature
  `TASKS.md` path and retain only formatter-approved Markdown; no other
  documentation path is in this correction.
- User / Domain Value: Slice 1 becomes eligible for completion without
  changing comparison facts, summary meaning, or repository quality policy.
- Behavior Tests: rerun the exact five existing Slice 1 test files named above;
  no new test file is added and no test expectation is weakened. The
  correction is not complete if any focused behavior scenario changes.
- Approval Boundary: only
  `src/application/semantic-diff/buildSemanticDiffSummary.ts`,
  `src/application/semantic-diff/compareSemanticDiff.ts`, and
  `docs/specs/features/semantic-diff-qlty-remediation/TASKS.md`; the five
  existing Slice 1 test files are validation-only and remain under the
  original Slice 1 boundary. `TRACEABILITY.md` is explicitly excluded from
  this runtime/completion boundary and is owned only by the replan package
  boundary above.
- Validation: run `rtk pnpm run test:compile`, then
  `rtk pnpm run test:desktop:run`, `rtk pnpm run qlty:fmt`, and
  `rtk pnpm run qlty:check`. Before the global formatter command, capture the
  mandatory status/path/content-digest snapshots defined above; capture them
  again afterward and verify that only the approved `TASKS.md` formatter
  target changed. If `TRACEABILITY.md` or any other path changes, stop without
  staging/committing and return to Main for Replanning. Verify Qlty reports 45
  structural blockers with the exact later-slice inventory, and the published
  `qlty fmt` check is clean on the pushed correction head.
  Obtain independent implementation review `Ready` with no Findings, apply
  the user's conditional clean-review authorization, and create the focused
  Slice 1 completion commit before Slice 2.
- Production Readiness: retain the original Slice 1 malformed, ambiguous,
  reordered, large, unsupported, and uncalculated input coverage; do not add
  host, parser, telemetry, I/O, Node, VS Code, or configuration dependencies.
- Dependencies: this correction is the approved replan of incomplete Slice 1
  after fdd152be; the replan package must be committed by
  `approval-committer` before implementation.
- Risks: splitting `toRelationPair` or `countChange` can alter relation ID
  remapping, attribute bucket increments, confirmation counts, or output
  ordering; formatting must not rewrite unrelated plan or policy content.
- Out of Scope: all S2-S5 production files and tests, `TRACEABILITY.md`,
  Qlty configuration, suppressions, thresholds, baselines, and any observable
  behavior or durable documentation change.

### Slice 2: Preserve Markdown Projection And Mode Dispatch

- Status: Approved; queued behind the corrected Slice 1 completion commit
- Scope: simplify Audit relation/section assembly, localization target and
  confirmation formatting, constraint selection, and Markdown output dispatch
  in `renderSemanticDiffAuditMarkdown.ts`,
  `semanticDiffMarkdownLocalization.ts`, and `semanticDiffOutput.ts`. Prefer
  typed lookup tables and small pure render helpers while retaining the current
  generated strings and section order.
- User / Domain Value: Summary, Full, and Audit remain byte-for-byte compatible
  for existing fixtures in English, Japanese, regional Japanese, and English
  fallback, while all assigned Markdown Qlty blockers are removed.
- Cohesive Change Group: the nine inline anchors in these three files plus the
  aggregate-only cloud blocker identified by source/rule reconciliation:
  Audit relation/root complexity; localization `unitNames`, nested target
  selection, confirmation return count, and constraint return/complexity;
  output-mode dispatch complexity; and the unmatched
  `return-statements` finding on `localizedUnitChange` at
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts:159`.
  This is 10 assigned blockers.
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
  terminate, and record that the 10 S2 blockers are gone and only the
  expected 35 later-slice blockers remain.
- Production Readiness: escaping and raw-value preservation remain safe for
  Japanese and Markdown-special text; no UI framework, VS Code, host, or Node
  dependency enters the host-neutral presentation modules.
- Approval Boundary: only the three production files and three focused test
  files named in this slice. Same-directory pure helper extraction is allowed
  only inside those existing files; a new module requires Replanning.
- Dependencies: corrected Slice 1 completion commit, so the shared comparison
  context is a fixed regression baseline.
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

- Finding inventory: authoritative Qlty PR summary at the baseline reports 56
  blockers: 23 function-complexity, 12 return-count, 11 boolean-logic, 4
  parameter-count, 2 similar-code, 2 nested-control-flow, and 2
  file-complexity findings. GitHub exposes 54 rule anchors across 48 inline
  comments: 22 function-complexity, 11 return-count, 11 boolean-logic, 4
  parameter-count, 2 similar-code, 2 nested-control-flow, and 2
  file-complexity. The exact category-count reconciliation identifies the two
  aggregate-only blockers rather than leaving them as an unknown allowance:
  `function-complexity` on `createEvidenceConfirmation` at
  `src/application/semantic-diff/compareSemanticDiff.ts:532` is assigned to
  S1, and `return-statements` on `localizedUnitChange` at
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts:159`
  is assigned to S2. S1 therefore owns 11 blockers, S2 10, S3 24, S4 1, and
  S5 10; these counts sum to the authoritative 56 and drive the expected
  published-cloud inventory above.
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
  CodeQL, and both analysis jobs pass. This publication blocks Slice 1
  completion and invalidates the prior expected 45-count gate until the
  correction is independently reviewed and committed.
- Slice 1 function-anchor reconciliation against the original 23
  `function-complexity` findings is exact: `buildSemanticDiffSummary` is now
  a delegating body at current lines 109-143 and its old line-142 comment is
  not part of the current 22-count; `createEvidenceConfirmation` is now a
  two-branch dispatch at current lines 697-703 and its aggregate-only finding
  is resolved; `toRelationPair` remains complex at current line 445; and the
  new `countChange` body is complex at current line 81. Thus the two active
  excess findings over the expected post-S1 inventory are precisely
  `toRelationPair` and `countChange`, both assigned to the Slice 1 correction
  gate. No S2-S5 function/file/rule assignment is changed.
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

- Production implementation paths are limited to
  `src/application/semantic-diff/buildSemanticDiffSummary.ts` and
  `src/application/semantic-diff/compareSemanticDiff.ts`; this evidence is
  recorded in `TASKS.md` and `TRACEABILITY.md`. No public DTO, exported
  function signature, test expectation, configuration, or documentation
  contract changed.
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
- Independent implementation review returned `Ready` with no Findings after
  409 deterministic differential scenarios confirmed unchanged summary,
  comparison, identity, relation, schedule, and confirmation outputs. The
  later published PR result is a separate completion blocker and reopens the
  Slice 1 correction gate.
- Production readiness: no Node, host, parser, telemetry, I/O, dependency,
  VS Code engine, desktop, or web compatibility surface was added. The
  published fdd152be Qlty inventory and TASKS.md formatting blockers mean
  Slice 1 has unresolved completion risk; Slice 2 remains blocked until the
  correction gate passes, is independently reviewed, and is committed.

## Feature Exit

- Definition of Done status: not started; Slice 1 is reopened for its
  correction gate, and all later implementation, review, completion-commit,
  and Feature Exit gates remain.
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
- [ ] Slice 1 correction has published `qlty check` and `qlty fmt` terminal
      results recorded on its exact pushed head, with 45 structural blockers,
      zero formatting blockers, and no replacement finding.
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
