# Feature Tasks: Semantic Diff Explorer

## Agent Brief

- Purpose: turn one completed Semantic Diff result into an accessible,
  read-only review workspace.
- Approved or active slice: the original four implementation slices are
  complete, independently reviewed `Ready`, automatically
  completion-approved under the recorded user policy, and focused-committed.
  The 2026-09-07 user requirements reopened Feature Exit and require a
  replanned quality/accessibility/filter verification sequence before closure.
  Slices 1-7, Slice 7A, and Slice 8 are complete, independently reviewed
  `Ready` with no findings, automatically completion-approved under the
  recorded user policy, and focused-committed. Slice 9 is complete and
  focused-committed as `52166c1aef52dca4510bf6e374ba0923317c7135`. A reviewer
  found that the committed Slice 9 Flow-highlight file is still reported as
  unformatted by the full qlty gate, so Slice 9A is now the sole active narrow
  replan; its final independent plan review is `Ready` with no findings and
  Human Approval was granted on 2026-09-08. The focused replan commit is
  eligible and pending; implementation remains gated. Slice 10 is held and
  Slices 11-13 remain planned and
  dependency-blocked.
- Do not own comparison sources/periods, upstream rules, report modes,
  schedule-calendar behavior, definition editing, or review persistence.
- Reuse the existing Flow graph, nesting, search, navigation, focus, and
  semantic-highlight foundation; do not add a second renderer.
- Consume the reviewed identity, structured-output, and review-risk contracts
  without recreating their facts, counts, ordering, or wording.
- Keep the single immutable `SemanticDiffOutputContext` in the host-private
  session; transport only validated browser-safe DTOs and opaque IDs.
- Keep source-index IDs, source-handle IDs, capture-scope IDs, session IDs,
  and action IDs as pairwise-distinct opaque brands; a Flow node ID is the
  actual existing `FlowGraphNodeDto["id"]` value, not an allocated opaque
  handle.
- Keep Explorer `changeIds` as the actual
  `SemanticDiffChange["id"]` values and `confirmationIds` as the actual
  `SemanticDiffConfirmationRequiredItem["id"]` values from the retained
  `SemanticDiffOutputContext.result`; do not allocate replacement IDs. Their
  `(kind, id)` membership is validated against that exact context, and
  duplicate records/IDs remain distinct occurrences.
- Apply the closed record/reason target-side table, map relation canonical pairs
  to side-specific Flow edge IDs, and keep Flow relation edges non-focusable.
- Generate the application-owned source index in the same ANTLR parse that
  produces each normalized document; retain only the browser-safe index and
  immutable host snapshot needed by later source actions. Preserve UTF-16,
  CRLF, Unicode, duplicate, and malformed-input behavior without parsing on
  an action or keeping a global last-parse cache.
- Define closed request/reply/host unions, explicit nulls, error codes,
  correlation/session/action IDs, strict extra-key rejection, and the fixed
  serialized payload limit.
- Preserve VS Code `^1.75.0`, desktop/web parity, and the keyboard,
  accessibility, and high-contrast baseline.
- Read first: `SPECS.md`, this file, the three predecessor contracts, and
  `TRACEABILITY.md`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next route: Main sends the approved Slice 9A plan to `approval-committer`
  for its focused docs-only replan commit. No implementation starts before
  that commit. After Slice 9A is implemented, independently reviewed `Ready`,
  and focused-committed, Slice 10 may resume its existing approval boundary.
  Slices 11-13 remain blocked; the six closure drafts remain excluded.

## Sync Rule

- This file is the sole plan and current-state owner for this feature.
- Update it only when a slice, dependency, approval boundary, validation need,
  risk, or production-readiness decision changes.
- Other feature folders remain outside this feature. The completed Wave 3
  Explorer item is removed from `roadmap.md`; the remaining comparison-workflow
  and schedule entries retain their existing ordering and entry conditions.

## Current Replanning Boundary

- Preserve Slices 1-4, their commits, user values, Flow/transport/source
  contracts, and the existing `AjsParserPort.parse(content)` compatibility
  surface. Their implementation evidence remains historical and is not
  reopened unless a new slice finds a regression.
- The 2026-09-07 user requirements are an explicit replanning trigger because
  the existing Feature Exit evidence does not establish an MUI-based Explorer,
  WCAG 2.2 AA evidence, clean qlty-smell output, or actual-session proof that
  the `変更を絞り込む` → `確認が必要` path removes ordinary leaves while
  retaining confirmation records and confirmation-required changes.
- The new plan adds only the smallest bounded work needed to close those gaps:
  MUI/WCAG surface work, real-session filter verification, application and
  host/Flow complexity refactors that preserve behavior, and corresponding
  qlty/test evidence. No comparison rule, source/period input, report schema,
  Flow wire variant, renderer replacement, persistence, editing, or telemetry
  behavior is added.
- `@mui/material` and `@mui/icons-material` 7.3.5 plus Emotion are already
  declared. The plan does not add or upgrade them, raise `engines.vscode`, or
  change desktop/web entry compatibility. MUI styling must remain compatible
  with the existing webview CSP and use no remote assets.
- The prior Feature Exit `Close` recommendation is superseded for now. The
  closure-draft durable documents remain uncommitted and are preserved; no
  feature-folder removal or durable-doc closure commit is authorized by this
  replan.
- Slice 9A is a narrow formatter-only reconciliation triggered by the full
  qlty gate reporting the already committed
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
  unformatted. The existing Slice 9 behavior, tests, qlty assignments, and
  completion commit remain preserved; Slice 10 cannot activate until this
  mechanical formatting gate is independently reviewed, approved, and
  focused-committed.
- Slice 3 owns the application plain
  `AjsParserWithSourceIndexPort` result and scoped capture contract. Bootstrap
  first injects the scoped parser into the current file command's existing
  output-context/comparison builder, so Explorer source navigation works
  independently of the calendar/workflow feature. A future calendar/workflow
  callback may replace that per-command builder only after its own approval;
  Explorer has no reverse dependency on it.
- The capture scope performs fixed before-then-after enriched parses, retains
  both indexes and source snapshots, binds them to the exact successful
  context, and remains their sole owner until release. Registry entries are
  borrowed references. Composite cleanup unregisters the context entry before
  releasing the scope exactly once; all direct, cancelled, failed, and late
  paths are stale-safe and idempotent.
- Feature Exit route: independent review is complete; Main owns aggregate
  human approval and Closure Approval, and `approval-committer` owns the later
  approved closure commit.
- Current-state route: the reviewed and approved replan commit `54ca4005`
  activated Slice 5. Slice 5 is independently reviewed `Ready` with no
  findings, automatically completion-approved, and focused-committed as
  `ee76722d0628d2d4e223f6faf13751a7a16a3a35`. The narrow Slice 6 replan was
  focused-committed as `1ede39bb`; Slice 6 is independently reviewed `Ready`
  with no findings, automatically completion-approved, and focused-committed
  as `6af753e7`. Slice 7 is independently reviewed `Ready` with no findings,
  automatically completion-approved, and focused-committed as
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484`. Full `qlty check` then
  reported 14 committed Slice 7 files as unformatted; Slice 7A is complete and
  focused-committed as `c9b97b0d`. Slice 8 is implementation complete and
  focused-committed as
  `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`. Slice 9 then completed its
  independent review and focused completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135`. The full qlty gate then
  reported `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
  unformatted. Slice 9A is now the sole active narrow replan; its final
  independent plan review is `Ready` with no findings and Human Approval was
  granted on 2026-09-08. The focused replan commit is eligible and pending;
  Slice 10 is held, and Slices 11-13 remain blocked until their predecessor
  gates are focused-committed.

## Plan Status

- Status: Slices 1-9 and Slice 7A complete and focused-committed; Feature Exit reopened;
  replan commit `54ca4005` and narrow Slice 6 replan commit `1ede39bb` are
  reviewed and approved. Slice 9A is the sole active narrow replan with final
  plan review `Ready` and Human Approval recorded on 2026-09-08; its focused
  replan commit is eligible and pending. Slice 10 is held, and Slices 11-13 are
  planned and blocked.
- Planning scope: preserve EXP-1 through EXP-10 while adding the MUI/WCAG 2.2
  AA surface contract, actual-session confirmation-filter proof, and qlty-smell
  remediation across the changed application, parser, host, Flow, and webview
  files.
- Review status: Existing four-slice plan review `Ready` for commit `067d2189`;
  final independent review of this replan returned `Ready` with no findings,
  followed by reviewed/approved commit `54ca4005`.
- Human approval: the historical approvals below are limited to Slices 1-4
  only and are superseded as the active gate. Replanning Human Approval was
  granted on 2026-09-07 under the user's explicit MUI/WCAG/qlty/filter request.
  Narrow Slice 9A Human Approval was granted on 2026-09-08 through the trusted
  user messages `承認します。` and `継続して。`.
- Active replan slice: Slice 9A — Reconcile Slice 9 Flow Highlight Formatting;
  final independent plan review is `Ready` with no findings, Human Approval is
  recorded, and the focused docs-only replan commit is eligible and pending.
- Slice order: Slices 1-9 and Slice 7A remain complete and committed; Slice 9A
  is the active replan; Slice 10 is held; Slices 11-13 remain dependency-blocked
  in order. Each new slice
  has an
  independent review and the recorded automatic Completion Approval rule
  applies only when that review is `Ready` with no findings.

## Historical Human Approval (Slices 1-4 Only; Superseded)

- Status: Approved
- Approved at: 2026-08-31 (explicit user approval in Codex)
- Approved scope: the complete four-slice Semantic Diff Explorer planning
  package, limited to docs-only planning and its recorded validation.
- Approved paths: `docs/specs/features/semantic-diff-explorer/SPECS.md`,
  `docs/specs/features/semantic-diff-explorer/TASKS.md`, and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`.
- Current gate meaning: this approval authorized only the original Slices 1-4
  plan and is superseded for current work. It does not authorize Slices 5-13,
  implementation, or the replan commit.

This approval authorizes only the plan-gate commit. Implementation remains
blocked until an individual implementation slice receives its own approval
after the plan-gate commit; Completion Approval and Closure Approval remain
separate gates.

### Slice 1 Implementation Approval

- Status: Approved
- Approved at: 2026-09-06 (explicit user instruction in the current Codex
  conversation)
- Approved scope: Slice 1 — Project The Immutable Explorer Session, limited to
  the application projection/filter/message contracts and named tests in its
  recorded scope; no UI, host registry, source/Flow/report execution,
  telemetry, or durable-document work.
- Approved paths: the Slice 1 application projection/transport files and pure
  tests named by the Slice 1 implementation plan; exact runtime and test paths
  are selected by `implementer` within that boundary.
- Gate condition: implementation starts only after this revised planning
  package receives independent `plan-reviewer` `Ready` and the focused replan
  commit. Completion approval for this exact slice is pre-authorized only if
  `implementation-reviewer` returns `Ready`; Findings keep it pending and
  return the slice to Main for remediation.

### Slice 2 Implementation Approval

- Status: Approved
- Approved at: 2026-09-06 (explicit user instruction in the current Codex
  conversation)
- Approved scope: Slice 2 — Open And Operate The Accessible Explorer, limited
  to the dedicated panel and bundle, existing command success handoff,
  cards/tree/filter/actions, UI state and virtualization, same-session
  four-mode Output handoff, host-owned registries, panel lifecycle, and the
  named tests in its recorded scope; no source/Flow execution,
  Git/WebAPI/period input, persistence, or durable-document work.
- Approved paths: the command/bootstrap, panel/session, React/localization,
  report-action, webpack-entry, and focused test files named by the Slice 2
  implementation plan; exact runtime and test paths are selected by
  `implementer` within that boundary.
- Gate condition: implementation starts only after this current-state plan
  update is focused-committed. Completion approval for this exact slice is
  pre-authorized only if `implementation-reviewer` returns `Ready`; Findings
  keep it pending and return the slice to Main for remediation.

### Slice 3 Implementation Approval

- Status: Approved
- Approved at: 2026-09-07 (explicit user instruction in the current Codex
  conversation)
- Approved scope: Slice 3 — Reveal Exact Before And After Source Targets,
  limited to the application-owned browser-safe source-index DTO/port, the
  same-pass enriched parser result and scoped capture state machine, ANTLR
  locator adapter, private lookup API, source registry/snapshot verification,
  VS Code reveal, typed outcomes, action completion/focus, and named tests;
  no Flow, editing, diagnostics, arbitrary sources, or durable-document work.
- Approved paths: the application source-index/capture contracts, parser
  adapter, VS Code/source-navigation wiring, Explorer routing, and focused
  parser/navigation tests named by the Slice 3 implementation plan; exact
  runtime and test paths are selected by `implementer` within that boundary.
- Gate condition: implementation starts only after this current-state plan
  update is focused-committed. Completion approval for this exact slice is
  pre-authorized only if `implementation-reviewer` returns `Ready`; Findings
  keep it pending and return the slice to Main for remediation.

### Slice 4 Implementation Approval

- Status: Approved
- Approved at: 2026-09-06 (explicit user instruction in the current Codex
  conversation)
- Approved scope: Slice 4 — Focus Existing Flow Views With Semantic Overlays,
  limited to the formal stable `FlowGraphEdgeDto.id` and semantic-diff key,
  additive before/after highlight states, canonical-pair to side-specific
  edge IDs, optional `semanticDiffOverlay` augmentation in the existing
  `changeDocument` data, existing `revealUnit`/`ready` Flow integration,
  `useFlowDocumentSubscription` → controller → `useFlowGraphState` handoff,
  one-overlay-per-Flow-URI ownership, exact-side panel ready/scope/reveal,
  accessible Flow labels, and the named tests; no new Flow overlay wire
  variant, renderer, layout, search, reverse report, editing, telemetry,
  comparison, reason/detail wire fields, or synthetic-ID behavior.
- Approved paths: the existing Flow graph/highlight/message/controller/
  presentation files and focused tests named by the Slice 4 implementation
  plan; exact runtime and test paths are selected by `implementer` within
  that boundary.
- Gate condition: implementation starts only after this current-state plan
  update is focused-committed. Completion approval for this exact slice is
  pre-authorized only if `implementation-reviewer` returns `Ready`; Findings
  keep it pending and return the slice to Main for remediation.

## Replanning Human Approval (Approved and Committed)

- Status: Approved and committed
- Approved at: 2026-09-07
- Plan-review verdict: `Ready` with no findings from the final independent
  `plan-reviewer` review.
- Approved scope: the revised MUI/WCAG, confirmation-filter verification, and
  qlty-smell remediation slices 5-13 described below, approved by the user's
  explicit request for an MUI Semantic Explorer, WCAG 2.2 coverage, qlty
  smells resolution, and confirmation-required filter verification under the
  existing proceed-through-slices policy.
- Approved paths: `docs/specs/features/semantic-diff-explorer/SPECS.md`,
  `docs/specs/features/semantic-diff-explorer/TASKS.md`, and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md` only. No
  runtime, test, or configuration path is authorized by this replan approval.
- Activation result: this approval authorized the reviewed replan; Slices 1-7
  are complete and committed, the formatter-only Slice 7A reconciliation is
  complete and focused-committed as `c9b97b0d`, and Slice 8 is complete and
  focused-committed as `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`. Slice 9 is
  complete and focused-committed as
  `52166c1aef52dca4510bf6e374ba0923317c7135`; Slice 9A is now the sole active
  narrow replan with final plan review `Ready` and Human Approval recorded on
  2026-09-08. Its focused docs-only replan commit is eligible and pending;
  Slice 10 is held. The historical Slices
  1-4 approval and
  completion approval below do not authorize any later slice.
- Replan commit scope: only `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`.
  The uncommitted Feature Exit drafts
  (`CHANGELOG.md`, `README.en.md`, `README.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, and
  `docs/specs/roadmap.md`) are preserved and explicitly excluded; no feature
  folder removal is part of this gate.
- Commit status: reviewed/approved focused replan commit `54ca4005`; the
  closure-draft documents listed above were excluded, and no feature-folder
  removal was part of that commit.
- Gate condition: the narrow Slice 7A plan review, Human Approval,
  implementation review, automatic Completion Approval, and focused completion
  commit `c9b97b0d` are complete; Slice 8 completion commit
  `792842b9d82dfa728f7742fc1ea1fb11e4623bc9` is also present. Slice 9's
  focused completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135` is present, and Slice 10 may
  begin within its approval below; Slices 11-13 remain blocked by predecessor
  completion.
- Automatic completion policy: a new slice's Completion Approval is
  automatically approved only after its independent implementation review is
  `Ready` with no findings. Actionable Findings suspend that slice and require
  Main to route remediation or another replan; they never silently grant
  approval.

### Slice 5 Completion Gate — Ready, Automatically Approved; Focused Committed

- Status: Implementation complete; independent review `Ready` with no
  findings; Completion Approval automatically approved; focused-committed
- Approved at: 2026-09-07 under the user's explicit MUI Semantic Explorer,
  WCAG 2.2 coverage, qlty-smell remediation, and confirmation-required filter
  verification request, using the existing proceed-through-slices policy.
- Approved scope: Slice 5 — Adopt The MUI Explorer Surface And WCAG 2.2 AA
  Baseline, exactly as specified below. This includes the canonical
  `src/presentation/webview/shared/muiTheme.ts` owner, the Explorer MUI
  presentation migration, the complete applicable WCAG matrix and explicit
  N/A rationale, static CSP assertions, and the named accessibility/bundle
  evidence. It does not authorize Slice 6 filtering changes or Slices 7-13
  qlty refactors.
- Approved paths: the Slice 5 cohesive change group and named tests below:
  `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerLocalization.ts`,
  `src/presentation/webview/shared/muiTheme.ts`,
  `src/test/suite/semanticDiffExplorerDom.test.tsx`, and
  `src/test/suite/semanticDiffExplorerPanel.test.ts`. Optional Explorer
  tree/state helpers remain inside the same presentation boundary; the panel
  HTML/CSP seam may change only if the approved static CSP evidence requires
  it. No durable-document, closure-draft, feature-folder, engine, dependency,
  transport, or Flow-renderer paths are approved.
- Gate condition: replan commit `54ca4005` is present and reviewed/approved;
  Slice 5 implementation is complete within the approved boundary.
- Independent implementation review: `Ready` with no findings on 2026-09-07.
- Completion Approval: automatically approved on 2026-09-07 under the recorded
  user policy because the independent implementation review was `Ready` with no
  findings.
- Exact approved completion paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerLocalization.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`,
  `src/test/suite/semanticDiffExplorerDom.test.tsx`,
  `src/test/suite/semanticDiffExplorerPanel.test.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerFocus.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerHostMessageState.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerHostState.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerKeyboard.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTreeData.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerViewState.ts`,
  and `src/presentation/webview/shared/muiTheme.ts`.
- Explicitly excluded closure drafts: `CHANGELOG.md`, `README.en.md`,
  `README.md`, `docs/requirements/use-cases/uc-explore-flow-graph.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, and
  `docs/specs/roadmap.md`.
- Completion commit status: focused commit
  `ee76722d0628d2d4e223f6faf13751a7a16a3a35` is complete. Slice 6 is now
  eligible for activation under the existing approval policy.
- Validation follow-up: real-browser Chromium and screen-reader checks remain
  `blocked-before-execution` on the managed host because of the known
  `bootstrap_check_in ... Permission denied (1100)` failure; the
  permissive-host owner must rerun them before those manual rows can be
  claimed. Aggregate human approval and Closure Approval remain pending until
  Slices 5-13 are complete and committed.
- Next route: Slice 5 is focused-committed; Main delegates exactly Slice 6 to
  `implementer`. No closure-draft path is part of the Slice 6 gate.

### Slice 6 Implementation Approval — Completed

- Status: Approved; implementation complete and focused-committed
- Approved at: 2026-09-07 under the user's explicit MUI Semantic Explorer,
  WCAG 2.2 coverage, qlty-smell remediation, and confirmation-required filter
  verification request, using the existing proceed-through-slices policy.
- Approved scope: Slice 6 — Prove Confirmation Filtering In A Real Explorer
  Session, exactly as specified below. Both evidence seams are mandatory:
  6A proves exact host `SemanticDiffOutputContext` and session identity; 6B
  sends the same session ID through `createSemanticDiffExplorerSessionMessage`
  to the actual MUI `SemanticDiffExplorerApp` and DOM. The scope preserves
  canonical summary cards, visible zero-match status, latent selection
  restoration, and exact ordinary/confirmation record behavior.
- Approved paths: `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`,
  `src/test/suite/semanticDiffExplorerPanel.test.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerHostState.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerViewState.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjection.ts`, and
  `src/test/suite/semanticDiffExplorerProjection.test.ts` plus
  `src/test/suite/semanticDiffExplorerDom.test.tsx`. Stable row attributes
  are `data-row-id`, `data-record-kind`, `data-record-id`, and group
  `data-row-kind="group"`; no comparison or summary-builder paths are
  approved.
- Gate condition: Slice 5 completion commit
  `ee76722d0628d2d4e223f6faf13751a7a16a3a35` was present; Slice 6 completed
  within the approved boundary. Its independent implementation review was
  `Ready` with no findings and Completion Approval was automatically approved.
- Completion commit: focused completion commit `6af753e7` is recorded; the
  exact completion paths and evidence remain below. Closure drafts remain
  excluded.

### Slice 6 Narrow Replanning Trigger — Resolved

- Trigger: the Slice 6 implementation correctly requires
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx` to
  render the already-approved stable `data-row-id`, `data-record-kind`,
  `data-record-id`, and group `data-row-kind="group"` semantics, but that
  exact path was omitted from the Slice 6 Approved paths list.
- Narrow revision: add only that existing presentation path to Slice 6's
  cohesive and approved scope and traceability. Behavior, design, evidence
  criteria, dependencies, slice order, canonical cards, zero-match feedback,
  latent selection restoration, and 6A/6B boundaries do not change.
- Current state: the uncommitted Slice 6 implementation is preserved; no
  runtime or test file was edited by this replanning update. Final plan review
  and Human Approval were recorded, and the focused replan commit
  `1ede39bb` resolved the omitted-path gate. Independent implementation review
  is complete with no findings.
- Exclusions: the six uncommitted Feature Exit drafts remain untouched and
  excluded (`CHANGELOG.md`, both READMEs, the two semantic-diff/Flow use cases,
  and `docs/specs/roadmap.md`). No closure propagation, feature-folder
  removal, or Slice 8-13 activation is authorized by this historical Slice 6
  gate.

### Narrow Slice 6 Replan Human Approval — Focused Committed

- Status: Approved and focused-committed; Slice 6 completion committed
- Approved at: 2026-09-07
- Final plan-review verdict: `Ready` with no findings from the independent
  `plan-reviewer` review.
- Human Approval evidence: the user's trusted explicit approvals
  `承認します。` and subsequent `継続して。` authorize this path-only replan
  under the existing proceed-through-slices policy.
- Approved scope: add only the omitted
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx` path
  to Slice 6's already-approved stable row/group semantics. This changes no
  behavior, design, evidence criteria, dependencies, or slice order; it does
  not alter `SPECS.md`.
- Exact approved replan paths: `docs/specs/features/semantic-diff-explorer/TASKS.md`
  and `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md` only.
- Commit status: focused replan commit `1ede39bb` is complete. The
  uncommitted implementation and six closure drafts remain preserved and
  excluded; no staging or commit is performed here.
- Gate condition: satisfied. The preserved Slice 6 implementation was routed
  to `implementation-reviewer`, whose `Ready`/no-findings verdict authorizes
  the automatic Completion Approval recorded below.

### Slice 6 Completion Gate — Ready, Automatically Approved; Focused Committed

- Status: Implementation complete; independent implementation review `Ready`
  with no findings; Completion Approval automatically approved on 2026-09-07
  under the recorded proceed-through-slices policy; focused-committed.
- Approved scope: the exact Slice 6 scope above: host context/session identity,
  actual `createSemanticDiffExplorerSessionMessage` → MUI App/DOM filtering,
  stable record/group attributes, canonical cards, visible zero-match status,
  and latent selection restoration. The review confirmed that the existing
  projection predicate was correct and the perceived no-op came from
  unchanged canonical cards and missing record-level actual-session evidence.
- Review evidence: `semanticDiffExplorerPanel.test.ts` proves exact
  `SemanticDiffOutputContext` identity and session correlation;
  `semanticDiffExplorerDom.test.tsx` proves exact record tuples, ordinary
  exclusion, confirmation retention, canonical cards, zero-match status, and
  selection restoration through the actual MUI App/session message path.
- Exact approved completion paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx`,
  `src/test/suite/semanticDiffExplorerDom.test.tsx`, and
  `src/test/suite/semanticDiffExplorerPanel.test.ts`.
- Validation evidence: desktop/web preparation, compiled Electron runner,
  `test:compile`, focused qlty/formatter checks, Markdown lint, and diff
  checks passed. Chromium smoke remains blocked before execution by the known
  managed-host `bootstrap_check_in ... Permission denied (1100)` condition.
- Excluded closure drafts: `CHANGELOG.md`, `README.md`, `README.en.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, and
  `docs/specs/roadmap.md`; no closure propagation or feature-folder removal is
  authorized by this gate.
- Completion commit status: focused completion commit `6af753e7` is complete.
  Slices 7-13 remain planned and dependency-blocked; aggregate human approval
  and Closure Approval remain pending until all new slices are complete and
  committed.
- Next route: Main delegates exactly active Slice 9 to `implementer`; no
  closure-draft path is part of the Slice 9 gate.

### Slice 7 Implementation Approval — Completed

- Status: Implementation complete; independently reviewed `Ready` with no
  findings; Completion Approval automatically approved on 2026-09-07; focused
  completion commit `b7c537d3410b2a05fae0487df3fd92fbb6b8f484` recorded.
- Approved at: 2026-09-07 under the user's explicit MUI Semantic Explorer,
  WCAG 2.2 coverage, qlty-smell remediation, and confirmation-required filter
  verification request, using the existing proceed-through-slices policy.
- Approved scope: Slice 7 — Decompose Explorer Application Projection And
  Transport, exactly as specified below. Preserve the auditable qlty baseline
  assignments, all closed DTO/message unions, strict validation, immutable
  context/session behavior, canonical cards, and the Slice 6 exact filter
  evidence. No behavior, schema, comparison, summary, or UI redesign is
  authorized.
- Approved paths and exact current completion package: feature evidence
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`; production
  `src/application/semantic-diff/semanticDiffExplorerMessages.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjection.ts`,
  `src/application/semantic-diff/semanticDiffRecordOccurrence.ts`,
  `src/application/semantic-diff/semanticDiffExplorerLeafGuards.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessageParsers.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessagePrimitives.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessageValidation.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionLeaves.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionPaths.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionSupport.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionTree.ts`,
  `src/application/semantic-diff/semanticDiffExplorerRecordGuards.ts`,
  `src/application/semantic-diff/semanticDiffExplorerViewGuards.ts`; and
  tests `src/test/suite/semanticDiffExplorerMessages.test.ts` and
  `src/test/suite/semanticDiffExplorerProjection.test.ts`. No host, webview,
  parser, Flow, configuration, closure-draft, or Feature Exit paths are
  approved.
- Qlty boundary: resolve the exact baseline rule families assigned to these
  files (`manyParameters`, `manyReturns`, `functionComplexity`,
  `totalComplexity`, and `complexBinary`) through cohesive extraction only;
  do not suppress, allowlist, relax thresholds, change generated ignores, or
  alter qlty configuration. Preserve behavior and DTO/message compatibility.
- Gate result: Slice 6 completion commit `6af753e7` was present; the Slice 7
  independent implementation review returned `Ready` with no findings, so
  Completion Approval was automatically approved on 2026-09-07. Focused
  completion commit `b7c537d3410b2a05fae0487df3fd92fbb6b8f484` is recorded.
- Next route: Main delegates exactly active Slice 7A to `implementer`.
  Slice 8 and Slices 9-13 remain blocked; closure drafts and Feature Exit
  remain excluded, and aggregate final approval remains pending.

## Historical Completion Approval (Slices 1-4 Only; Superseded)

- Status: Historical Approved for Slices 1-4 only; superseded as the active
  gate
- Approved at: 2026-09-07 (automatic under the explicit user policy after each
  independent implementation review returned `Ready` with no findings)
- Approved scope: the exact reviewed implementation scope of Slices 1-4
- Approved paths: each slice's focused runtime/test/evidence paths recorded in
  its completion section
- Implementation review verdict: `Ready` with no findings for Slices 1-4
- Commit status: focused completion commits recorded as
  `e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`,
  `01349376da1a76fa0c91a0311b3ab1659f5dc521`,
  `a25d674c67b3e6a9fb03c89a12a745a579bfd655`, and
  `aa972a293e34f645d3580fee6234d606e161602b`
- Aggregate human approval is still required before Closure Approval; this
  section does not authorize closure propagation or deletion.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: previous `Close` recommendation is superseded by the
  reopened Feature Exit; Closure Approval remains pending and is ineligible
  until Slice 7A and Slices 5-13 complete.
- Commit status: Not eligible

## Feature Exit Review (2026-09-07)

- Feature: Semantic Diff Explorer
- Completed slices: Slices 1-4 are complete, independently reviewed `Ready`
  with no findings, automatically completion-approved under the recorded user
  policy, and focused-committed in `e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`,
  `01349376da1a76fa0c91a0311b3ab1659f5dc521`,
  `a25d674c67b3e6a9fb03c89a12a745a579bfd655`, and
  `aa972a293e34f645d3580fee6234d606e161602b`.
- Acceptance status: EXP-1 through EXP-10, N-1, and E-4 are satisfied by the
  recorded implementation and traceability evidence. The Explorer is
  read-only, preserves one immutable comparison context, and keeps source,
  Flow, report, keyboard, accessibility, and strict-transport boundaries.
- Validation: focused projection, transport, DOM/axe, source-index, capture,
  Flow, overlay, duplicate-ID, and host lifecycle suites passed; TypeScript
  checks, `rtk pnpm run test:compile`, `rtk pnpm run qlty:check`, build,
  desktop preparation and smoke, web preparation, Markdown lint, and diff
  checks passed. Direct Chromium web smoke remains blocked before test
  execution by the managed environment's
  `bootstrap_check_in ... Permission denied (1100)` failure; desktop smoke and
  both production bundles passed.
- Traceability: `TRACEABILITY.md` maps every requirement, predecessor,
  compatibility, lifecycle, and durable-document obligation to slices and
  validation, with this exit evidence added.
- Production readiness: failure, stale/disposed, malformed, large, duplicate,
  accessibility, desktop/web, VS Code `^1.75.0`, JP1/AJS compatibility, and
  telemetry-privacy evidence is complete. Existing Flow behavior remains
  unchanged without a diff session.
- Durable documentation: updated the report and Flow use cases, Japanese and
  English README product guidance, `CHANGELOG.md`, and removed the completed
  Explorer item from `docs/specs/roadmap.md`. `uc-build-semantic-diff.md` and
  architecture/glossary/context documents required no update because their
  neutral comparison and boundary contracts remain current.
- Roadmap propagation: updated; the completed Wave 3 Explorer item is no
  longer unfinished roadmap work, and the two repository-level verification
  follow-ups have explicit owners and entry conditions. Remaining workflow and
  schedule entries are unchanged.
- Remaining risks: (1) managed Chromium web smoke is an environment-owned
  rerun follow-up for the CI/host owner; (2) the existing expanded-graph
  node-order golden mismatch remains with the Flow graph test owner; and (3)
  the architecture aggregate still reports the two documented
  Slice-3-originating composition-root violations, owned by
  architecture/bootstrap maintainers. These are recorded follow-ups in
  `docs/specs/roadmap.md`, were not broadened by Slice 4, and require no new
  feature design or scope decision.
- Closure recommendation: `Close`

This recommendation is not Closure Approval. After aggregate human approval
and explicit Closure Approval, the proposed focused closure commit scope is
the durable propagation paths `docs/requirements/use-cases/uc-present-semantic-
diff-report.md`, `docs/requirements/use-cases/uc-explore-flow-graph.md`,
`README.md`, `README.en.md`, `CHANGELOG.md`, and `docs/specs/roadmap.md`, plus
the selected feature-folder evidence/removal under
`docs/specs/features/semantic-diff-explorer/`.

## Feature Exit Reopened (2026-09-07)

- Trigger: the user requires an MUI-based Semantic Explorer with WCAG 2.2 AA
  coverage, elimination of the fresh qlty-smell findings, and verification of
  the `変更を絞り込む` → `確認が必要` behavior.
- Gap: existing DOM coverage asserted only that a filtered tree had at least
  one row; it did not assert ordinary record exclusion, confirmation-record
  retention, confirmation-level change retention, zero-match status, or the
  actual host session message path. Existing cards intentionally remain
  canonical, so unchanged card counts can make a working filter appear
  inactive.
- Required evidence: Slice 5 supplies MUI/CSP/theme/WCAG 2.2 AA evidence;
  Slice 6 supplies exact record-level actual-session DOM evidence; Slices 7-13
  plus the formatter-only Slice 7A reconciliation remove the qlty smell report
  across the changed application, parser, host, Flow, and webview surfaces
  without suppression.
- Status: `Close` recommendation superseded; closure-draft durable documents
  remain uncommitted and the feature folder remains. A new Feature Exit review
  is required after Slice 7A and Slices 5-13 are independently reviewed and
  committed.

## Predecessor Contract Decisions

- `semantic-diff-identity-confidence` supplies stable identity decisions and
  `identityDecisionId` links. Explorer never matches or ranks candidates.
- `semantic-diff-structured-outputs` supplies `SemanticDiffResult`, typed
  details, canonical summary aggregation and ordering, output modes, and the
  virtual report provider. Explorer consumes its summary aggregate and output
  dispatcher; it never parses Markdown or JSON.
- `semantic-diff-review-risk-rules` supplies confirmation records and the
  closed nine-member reason union. Explorer filters and labels records but
  never decides whether confirmation is required.
- Implementation is blocked until the completion commits establishing those
  contracts exist. A missing reusable summary aggregate, stable record ID,
  typed target/detail, or reason code triggers Replanning rather than a
  presentation-side reconstruction.
- `semantic-diff-comparison-workflow` is a later consumer of this feature's
  source-capture contract. Slice 3 first composes its scoped parser into the
  current file command's existing output-context/comparison builder and binds
  the result only after that builder returns the successful immutable context.
  A later calendar/workflow adapter can use the same injected callback after
  its own approval; Explorer Slice 3 does not depend on that feature's
  completion, and neither feature changes the neutral `SemanticDiffOutputContext`
  or JSON result shape here.

### Same-Pass Source Capture Contract

- Slice 3 owns the application-only contracts in
  `src/application/parsing/AjsParserWithSourceIndexPort.ts` and
  `src/application/semantic-diff/semanticDiffSourceCapture.ts`. The first
  exports `AjsParserWithSourceIndexPort` with
  `parseWithSourceIndex(content: string): ParseAjsWithSourceIndexResult`.
  `ParseAjsWithSourceIndexResult` is the existing parser-error union on
  failure and, on success, exactly `{ ok: true, document: AjsDocument,
sourceIndex: SemanticDiffSourceIndex }`; it contains no URI, `TextDocument`,
  snapshot, parser node, generated-parser type, or domain wrapper. The second
  exports the host-neutral capture port and opaque descriptor/handle types;
  it imports only application contracts and has no VS Code or Node types.
- The capture API is an explicit state machine, not an implicit cache:
  `beginSemanticDiffSourceCapture({ before: ImmutableSourceDescriptor,
after: ImmutableSourceDescriptor })` starts in `collecting` and returns a
  scoped object with `parser: AjsParserPort`,
  `bind(context: SemanticDiffOutputContext): SemanticDiffSourceCaptureBindResult`,
  and idempotent `release(): void`. A descriptor contains only a fixed side,
  a `SemanticDiffSourceHandleId`, and the immutable decoded text/version facts
  required to verify the two parser inputs; host URI and `TextDocument` remain
  outside the application contract. The capture parser accepts exactly two
  calls in before-then-after order, verifies each call against its descriptor,
  stores each successful same-pass index privately, and throws a typed
  `SemanticDiffSourceCaptureError` for a wrong-order content mismatch, extra
  call, or post-release call. A parser error is returned through the existing
  `ParseAjsResult` for that side and does not prevent the second fixed-order
  parse, so the current builder preserves separate before/after parser errors;
  the scope cannot bind unless both parses succeeded. The first and second
  call ordinals define the sides even when text is identical; distinct text in
  the opposite order throws `capture-order-invalid` while preserving the
  unchanged parser result path. An extra/post-release parser call never
  invokes the enriched parser. Bootstrap catches only this typed exception
  and maps it to the caller's `source-capture-failed` outcome; it never
  fabricates a syntax error for a capture contract violation.
- The capture scope is the sole owner of both retained source indexes and
  immutable source-snapshot references from `collecting` through `released`.
  Successful `bind` moves it to `bound` and returns a borrowed binding; it
  never transfers ownership. The host context registry stores only that
  borrowed binding and moves the scope to `registered`; it never disposes the
  indexes or snapshots. A host-private composite disposer is the normal
  lifetime boundary and performs `unregister(context, scope)` first, then
  `scope.release()` exactly once. Repeated disposal is a no-op. Direct scope
  release, stale epoch, partial registration, panel creation failure,
  cancellation, parser/artifact/bind failure, and late completion invalidate
  borrowed registry lookups and release all scope-owned resources without
  dereference or cross-command leakage.
- `SemanticDiffSourceCaptureBindResult` is a closed plain union: success is
  `{ ok: true, context, before: { sourceIndex, sourceHandleId }, after: {
sourceIndex, sourceHandleId } }`; failure is `{ ok: false, code }`, where
  `code` is exactly `capture-parser-failed | capture-incomplete |
  capture-already-bound | capture-released`. The typed exception's closed
  `code` union is exactly `capture-order-invalid | capture-input-mismatch |
  capture-extra-parse | capture-released`. Binding is atomic and changes the
  scope to `bound` only on success; the binding is borrowed and cannot release
  the scope-owned resources. Registration accepts only the exact bound
  context/scope pair and changes the lifecycle to `registered`; release
  changes it to `released`, clears indexes, and makes subsequent parse/bind/
  registry lookup unavailable. The returned binding is handed to the
  bootstrap host registry only as a borrowed reference and is never
  serialized to the webview.
- Bootstrap composes the concrete adapter in the existing
  `src/bootstrap/extension/semanticDiffWiring.ts`. Its factory invocation is
  bootstrap-only: it injects the enriched
  `AjsParserWithSourceIndexPort` implementation into the scoped wrapper and
  passes the current file command an injected per-command
  `beginSemanticDiffSourceCapture` capability. The existing
  `createBuildSemanticDiffReportData(parser)` path (and the bootstrap callback
  that creates its output context) receives the scoped `AjsParserPort`, so
  this feature is independently usable before calendar/workflow delivery.
  A future calendar/workflow adapter may replace that callback after its own
  approval, but is not a prerequisite and is never invoked by Explorer.
  The wrapper preserves the existing `AjsParserPort` interface and every
  existing consumer (`parse(content)` remains unchanged), invokes
  `parseWithSourceIndex` exactly once for each side, returns only the existing
  `ParseAjsResult` to the current builder, and retains the plain indexes in
  the scope. No global `lastParse`, cross-command map, or action-time index
  regeneration is permitted.
- The parser-infrastructure implementation is
  `src/infrastructure/parser/AntlrAjsParser.ts` plus its existing raw-parser
  seam. Its enriched path walks one ANTLR tree, derives the normalized
  `AjsDocument`, and builds the source index before discarding raw parser
  objects. Index unit keys are the actual normalized IDs produced by
  `src/infrastructure/parser/normalization/normalize/unitBuilder.ts`
  (`unit.absolutePath()`); duplicate absolute paths are marked ambiguous and
  return unavailable rather than choosing by occurrence ordinal. The index
  allocator and mapper remain private to the adapter; only plain DTOs leave
  infrastructure.
- The current file command calls the injected capture capability with both
  immutable source descriptors before the existing report/output-context
  builder, then invokes that builder with the scoped parser. A future
  calendar/workflow command may call the same capability and its own approved
  artifact callback, but must not become a Slice 3 dependency. The host binds
  `{ beforeIndex, afterIndex }` exactly once to the successful context after
  the current/future builder returns; `OpenSemanticDiffExplorer(context)`
  remains one argument. Bootstrap resolves that same context-keyed registry
  entry and supplies private handles to the Explorer session. Capture,
  registration, and Explorer creation are one composite transaction: parser
  failure, artifact failure, bind failure, panel creation/cancellation, or
  partial side registration runs unregister-before-release cleanup for every
  acquired index, snapshot, and handle. Concurrent captures are isolated by
  scope identity; disposal and stale epochs make later lookup/reveal
  unavailable.
- Source lookup/reveal uses the retained side index and immutable snapshot
  only. It never invokes a parser, reconstructs an index, searches another
  side, or selects a duplicate normalized ID. The existing application
  `lookup({ sourceIndexId, unitId, targetKind, parameterKey? })` contract and
  all UTF-16/range/fallback rules remain unchanged.

## Design Decisions

### Immutable Session And Messages

- One successful existing file comparison creates exactly one immutable
  `SemanticDiffOutputContext` upstream and one
  `SemanticDiffExplorerSession` retaining that same object identity: opaque
  session ID, context, display language, and host-private before/after source
  handles. Explorer is the default successful destination; no automatic output
  document is opened first. The before/after source indexes are captured by
  the scoped same-pass parser session before this context exists and are
  attached only by the exact-context bind after comparison success.
- The host retains URIs, compared text snapshots, document versions when
  available, result/report objects, and action lookup. The webview receives a
  plain `SemanticDiffExplorerViewModel`; its action descriptors contain only
  opaque action IDs, never arbitrary URI/path/content or highlight payload.
- The host-only opener has one argument and one asynchronous concrete return
  type. `SemanticDiffExplorerSessionHandle` is exactly
  `{ sessionId: SemanticDiffExplorerSessionId; panel: WebviewPanel;
dispose(): void }`, where `WebviewPanel` is the VS Code presentation/host
  type and is never imported by application or webview code. The opener type
  is `OpenSemanticDiffExplorer(context: SemanticDiffOutputContext):
Promise<SemanticDiffExplorerSessionHandle>`; it has no second argument.
- Requests, replies, and host messages use closed discriminated unions. Request
  kinds are exactly `ready`, `refresh`, and `action`; every request has exactly
  `sessionId: SemanticDiffExplorerSessionId`, monotonic finite `requestId`, and
  `actionId: SemanticDiffExplorerActionId | null` (`null` for the first two,
  registered non-empty ID for `action`). Reply kinds are exactly
  `ready`, `refreshed`, and `action`; every reply echoes those three fields and
  has exactly `ok`, `payload`, and `error`, with successful `error: null` and
  failed `payload: null`. Host kinds are exactly `session`, `action-result`,
  `failure`, and `close`, using the same correlation fields and explicit
  nullable payload/error fields. Unknown discriminators, missing/extra keys,
  non-finite IDs, wrong sessions, and non-session-derived payloads are
  rejected atomically.
- The closed error-code union is `invalid-request`, `unknown-session`,
  `unknown-action`, `stale-request`, `superseded-session`,
  `disposed-session`, `record-not-found`, `unavailable-target`,
  `stale-source`, `source-lookup-failed`, `flow-not-ready`,
  `flow-target-missing`, `output-failed`, `payload-too-large`, and
  `host-disposed`. Error detail is the following typed, nullable shape; no
  generic opaque target type, action/record target ID, localized prose, URI,
  content, parser object, or raw host identity is transported:

  ```ts
  type SemanticDiffExplorerErrorDetail = Readonly<{
    side: SemanticDiffSide | null;
    targetId: SemanticDiffUnitReference["id"] | null;
  }>;
  ```

  `targetId` is only the exact semantic unit ID from the retained context;
  action IDs and record IDs are carried only by their existing action/request
  fields and are never copied into error detail. Missing or malformed target
  records use `targetId: null`. Source and Flow failures use the unit ID only
  when the context contains that exact unit; request, session, action, record,
  host, and payload failures otherwise use `targetId: null`.

- Exact envelope key sets are fixed: `ready`/`refresh` requests have only
  `{type, sessionId, requestId, actionId: null}`; `action` requests have only
  `{type, sessionId, requestId, actionId}`; `ready`/`refreshed` replies have
  `{type, sessionId, requestId, actionId: null, ok, payload, error}`;
  `action` replies have the same keys with a non-null
  `SemanticDiffExplorerActionId`;
  `session` host messages have `{type, sessionId, requestId: null,
actionId: null, ok: true, payload, error: null}`; `action-result` has the
  action reply keys; `failure` has `{type, sessionId:
SemanticDiffExplorerSessionId | null, requestId: finite positive integer | null,
actionId: SemanticDiffExplorerActionId | null,
ok: false, payload: null, error}`; and `close` has
  `{type, sessionId, requestId: null, actionId: null, ok: true, payload: null,
error: null}`. Success always has non-null payload/error null; failure always
  has payload null/error non-null. No missing or extra key is accepted.
- Serialized Explorer messages have a fixed 8 MiB UTF-8 limit measured before
  posting. An oversized session/action returns only `payload-too-large`, does
  not install partial state, truncate, or fall back, and leaves later valid
  sessions/actions independent.
- Each panel owns one session. Ready/refresh replays the same view model;
  disposal increments its `disposeEpoch`, removes action handles, releases
  source snapshots, report references, and the retained context. The returned
  handle's `dispose()` is idempotent, and `panel.onDidDispose` invokes the same
  host-private composite disposer. Slice 2 initializes its source-lifetime
  release hook as a no-op; Slice 3 attaches the capture composite to that
  hook without changing the public handle. Independent panels and late async
  completions cannot update, focus, post, or recreate state.
- Parse/comparison failures occur before panel creation. Explorer-open failure
  rejects the asynchronous opener only after partial registry/scope cleanup;
  the current file command maps that rejection to its existing
  `display-failed` outcome and a future workflow caller maps it to
  `explorer-open-failed`. Later source, Flow, and report failures are isolated
  action results and preserve the session.
- Definition content, source URIs, host paths beyond existing semantic target
  paths, and parser objects are never sent to telemetry.

### Summary, Hierarchy, And Filter

- Seven fixed cards consume `context.summary` as their sole summary source:
  Changes (five kind
  subcounts), Elements, Attributes, Confirmation Required, Unsupported (three
  kind subcounts), Limitations, and Schedule Run Changes. Zero buckets remain
  visible and filtering never changes counts.
- The tree has one leaf for every upstream change, confirmation record,
  unsupported record, limitation, and schedule run change. Records are not
  target-coalesced because the neutral contract does not define that link.
- Primary placement is removed-before; other changes after-then-before;
  confirmation target; unsupported declared side/target; limitation
  `unitPath`; schedule `unitPath`. Relations use the longest common parent of
  real endpoint paths. No-path records use a final `Comparison-level findings`
  group. Rename/move appears once under after and retains before as metadata.
- Only required path ancestors are materialized as job-group/unit hierarchy.
  Sibling paths use locale-neutral UTF-16 ordinal order. Leaves use fixed kind
  order change, confirmation, unsupported, limitation, schedule, then the
  upstream canonical ID/code order. Localization never affects order.
- Discriminated leaves expose record ID/kind, change or confirmation state,
  target, typed rationale/detail/constraints, and explicit source/Flow action
  availability. Presentation localizes codes and escapes raw values without
  reconstructing rules.
- `All` is default. `Confirmation required` retains confirmation records and
  changes whose upstream level is `confirmation-required`, pruning empty
  ancestors, and uses the exact combined count already present in the summary.
  It never infers state from prose, constraints, color, or target, and never
  recalculates a summary or predicate.
- Expansion and selection are panel-local. Filtering keeps a hidden selection
  latent, moves focus to the filter, exposes no false `aria-selected`, and
  restores selection/ancestors when cleared.
- No findings shows zero-inclusive cards, a distinct empty status, no rows,
  and enabled Markdown. Filter-no-match is a separate status and does not
  replace the unfiltered session.

### Explorer Interaction And Scale

- Use a dedicated `ajsbutler.semanticDiffExplorer` webview panel and browser
  bundle opened by the existing comparison command. No command ID,
  contribution, source choice, or period input changes.
- Success opens Explorer instead of automatic Full Markdown. Its `Output`
  action invokes the structured-output feature's common four-mode picker and
  `presentSemanticDiffOutput(context, mode)` with the exact retained context;
  it does not copy the mode list, re-run comparison, rebuild context, or
  re-aggregate summary. Clipboard writes remain only in the explicit copy
  command.
- Cards are descriptive, not tab stops. Native toolbar/filter controls and a
  roving-tab-stop tree implement `tree`/`treeitem`, level/expanded/selected/
  position metadata, Arrow navigation/expansion, Home/End, Enter selection,
  and Tab access to row actions.
- MUI supplies the Explorer visual primitives, spacing, typography, controls,
  cards, status/feedback, and theme provider. The theme maps to VS Code CSS
  variables and explicitly handles `forced-colors: active`; it must preserve
  visible focus, AA contrast, 44 CSS-pixel targets where applicable, 200%
  zoom/reflow, and status semantics without depending on color or hover.
  Emotion style insertion is checked against the existing panel CSP and both
  production bundles.
- Visible focus, text/icon labels, and a live status announce filtering,
  progress, success, failure, and unavailability. Color, position, animation,
  and hover are never sole signals; forced colors/high contrast are explicit.
- Flattened visible rows use existing `react-virtuoso` above 200 rows with
  20-row overscan. Stable IDs and tree metadata survive virtualization.
  Projection is memoized and no action rebuilds comparison or Flow data.
- A 10,000-leaf fixture keeps bounded DOM, deterministic order/counts, and
  keyboard first/last/filter access without truncating records.
- The confirmation filter is validated through the actual host session
  message path. The DOM assertions identify ordinary leaves, confirmation
  records, and confirmation-required change leaves by stable record IDs; they
  also assert canonical card counts, explicit zero-match status, visible MUI
  feedback, and exact latent-selection restoration after clearing the filter.
- Failed actions refocus the invoking button. Successful source, Flow, or
  report actions focus their destination. Refresh restores a visible selected
  row, otherwise tree root, otherwise filter. The focused Explorer leaf and
  an `aria-live` status announce endpoints and state.

### Source Navigation

- Source actions use the exhaustive record/reason target-side table in
  `SPECS.md`: `added` is after, `removed` is before, `changed`/`renamed`/`moved`
  are after, `conditional-relation-removed` is before, and the other eight
  confirmation reasons are after. Unsupported/limitation/schedule records
  use only an explicit upstream side. Other records expose an action only with
  an unambiguous declared side and exact target.
- Unit/jobnet/job-group selects the unit declaration name token. Attribute
  selects every occurrence of the exact parameter key in that unit, with the
  first source-order occurrence primary. Relation/global/unsupported locators
  remain unavailable instead of selecting approximately.
- `SemanticDiffSourceLocatorPort` and `SemanticDiffSourceIndex` are
  application-owned browser-safe contracts with branded opaque IDs. The ANTLR
  infrastructure adapter is the only index producer: during the same ANTLR
  invocation that returns the normalized `AjsDocument`, it generates an
  opaque `sourceIndexId` through the application-provided allocator, then
  emits the unit declaration header/name range and every exact parameter-key
  occurrence range in source order. The index's `unitId` is the actual
  normalized `AjsUnit.id`/`absolutePath()` from
  `src/infrastructure/parser/normalization/normalize/unitBuilder.ts`;
  duplicate paths are ambiguous and unavailable. `sourceIndexId`, source
  handles, and action handles are opaque; the normalized `unitId` remains the
  semantic lookup key and never adds URI or content encoding beyond the
  existing normalized path value. It returns no URI,
  `TextDocument`, snapshot, parser node, generated type, or domain `AjsUnit`.
- The source-index DTO shapes are fixed and contain no host fields:

  ```ts
  type SemanticDiffSourceIndexId = string & {
    readonly __semanticDiffSourceIndexId: unique symbol;
  };
  type SemanticDiffSourceHandleId = string & {
    readonly __semanticDiffSourceHandleId: unique symbol;
  };
  type SemanticDiffCaptureScopeId = string & {
    readonly __semanticDiffCaptureScopeId: unique symbol;
  };
  type SemanticDiffExplorerSessionId = string & {
    readonly __semanticDiffExplorerSessionId: unique symbol;
  };
  type SemanticDiffExplorerActionId = string & {
    readonly __semanticDiffExplorerActionId: unique symbol;
  };
  type SemanticDiffSourcePosition = Readonly<{
    line: number;
    character: number;
  }>;
  type SemanticDiffSourceRange = Readonly<{
    start: SemanticDiffSourcePosition;
    end: SemanticDiffSourcePosition;
  }>;
  type SemanticDiffSourceParameterOccurrence = Readonly<{
    parameterKey: string;
    occurrenceOrdinal: number;
    range: SemanticDiffSourceRange;
  }>;
  type SemanticDiffSourceUnitEntry = Readonly<{
    unitId: string;
    headerRange: SemanticDiffSourceRange;
    nameRange: SemanticDiffSourceRange | null;
    parameterOccurrences: readonly SemanticDiffSourceParameterOccurrence[];
  }>;
  type SemanticDiffSourceIndex = Readonly<{
    sourceIndexId: SemanticDiffSourceIndexId;
    unitEntries: readonly SemanticDiffSourceUnitEntry[];
  }>;
  ```

  Allocators return the corresponding brand and never derive an ID from a
  URI, path, content, or another brand. Since TypeScript brands are erased at
  runtime, each allocator also uses a kind-specific host namespace prefix and
  monotonic per-kind sequence, and the owning registry validates both that
  prefix and membership before accepting an ID. Validators reject empty,
  malformed, unknown, expired, or cross-kind IDs. Range positions and
  occurrence ordinals are finite non-negative integers; ranges are ordered
  half-open positions. `FlowGraphNodeDto["id"]` and
  `FlowGraphEdgeDto["id"]` remain existing graph values and are not replaced
  by these opaque handles.

- The index validator accepts exactly those DTO keys, validates every nested
  position/range and occurrence ordinal, requires the `sourceIndexId` to be
  registered for the capture scope, and preserves unit-entry/parameter
  occurrence order. It does not require ranges to be globally disjoint,
  because parameter tokens may lie within a declaration header range; it does
  reject reversed ranges, non-finite values, negative values, extra keys, and
  unregistered IDs before the index enters the host registry.
- The private lookup contract is fixed to
  `lookup({ sourceIndexId, unitId, targetKind, parameterKey? })` with no extra
  keys. `targetKind` is `unit | jobnet | jobgroup | attribute`; the first three
  omit `parameterKey`, while `attribute` requires it. Success returns exactly
  `{ primaryRange, occurrences }`. Unit/jobnet/jobgroup return the declaration
  name as `primaryRange` and `occurrences: []`; attribute returns the first
  source-order exact-key range as primary plus every matching occurrence in
  source order. Missing source-index, missing or ambiguous normalized unit,
  missing key/occurrence, unsupported kind, malformed source, stale source,
  and expired index use the fixed failure codes in `SPECS.md`; an ambiguous
  normalized unit maps to the existing `unit-missing` code and never selects
  an occurrence.
- The lookup types are fixed to the following closed shapes. The first union
  member must not contain `parameterKey`; the second must contain it and no
  other key. Success has only `primaryRange` and `occurrences`; failure has
  only the fixed `code`.

  ```ts
  type SemanticDiffSourceLookupRequest =
    | Readonly<{
        sourceIndexId: SemanticDiffSourceIndexId;
        unitId: string;
        targetKind: "unit" | "jobnet" | "jobgroup";
      }>
    | Readonly<{
        sourceIndexId: SemanticDiffSourceIndexId;
        unitId: string;
        targetKind: "attribute";
        parameterKey: string;
      }>;
  type SemanticDiffSourceLookupResult =
    | Readonly<{
        primaryRange: SemanticDiffSourceRange;
        occurrences: readonly SemanticDiffSourceRange[];
      }>
    | Readonly<{
        code:
          | "source-index-missing"
          | "unit-missing"
          | "parameter-key-missing"
          | "parameter-occurrence-missing"
          | "unsupported-target-kind"
          | "malformed-source"
          | "stale-source"
          | "expired-source-index";
      }>;
  ```

  Duplicate entries with the same normalized `unitId` are retained in the
  index for evidence but make lookup return `unit-missing`; no occurrence
  ordinal or similarly named unit may resolve the ambiguity.

- The lookup validator enforces the runtime namespace/membership check for
  `sourceIndexId`, exact request keys, the closed `targetKind` union, and the
  presence/absence of `parameterKey` shown above before any lookup. It never
  treats a source handle, session ID, action ID, Flow node ID, or Flow edge ID
  as a source-index ID.
- Ranges are zero-based half-open UTF-16 line/character positions; CRLF is one
  line break and surrogate pairs count as two code units. Duplicate keys keep
  every occurrence and the first is primary. Malformed/incomplete parse is a
  closed unavailable result. Immediately before source reveal the host
  revalidates session epoch, source index, current decoded document text, and
  document version when available; stale, missing, unparsable, ambiguous,
  unavailable, or expired sources never search another side or similarly named
  unit. File sources are reopened with the injected
  `openTextDocument(uri).getText()` path for this check, preserving VS Code's
  configured decoding including Shift_JIS and BOM behavior; independently
  decoding `workspace.fs` bytes is not an identity check.
- The same-pass parser adapter derives the full unit header range from the
  ANTLR `unitAttribute` context (`UNIT_KEY` through `SEMI`), the name
  subrange from its `TEXT` value token before the first comma, and parameter
  occurrences from each `unitParameter` `PARAMETER_KEY` token/context.
  Empty names, malformed name fields within an otherwise indexed unit, or
  non-unique names fall back to the header range; malformed/incomplete source
  parsing returns unavailable and never performs fuzzy text search. The
  normalized domain is unchanged, and no source action invokes this parser
  path again.
- Desktop/web use injected decoded-document and navigation capabilities;
  shared code imports no Node or VS Code type. File and Git source selection
  remain workflow-owned. For a Git HEAD source the workflow supplies a
  read-only `GitImmutableSourceProvider`/opaque source handle and the decoded
  immutable content used by the same-pass capture; Explorer does not call Git,
  inspect `.git`, or reconstruct a HEAD snapshot. The provider is revalidated
  through its immutable revision/content contract before reveal.

### Flow Reuse, Overlay, And Focus

- Extend the existing `buildSemanticDiffFlowHighlights` foundation to return
  before/after sets. Added maps after, removed before, and renderable changed/
  renamed/moved facts after. Missing real targets have no action/highlight.
  Relation `canonicalPair` maps to the exact side-specific
  `FlowGraphEdgeDto.id` from the corresponding graph; no display-string,
  localized-pair, or session-generated synthetic edge ID is allowed.
- Add the explicit stable `FlowGraphEdgeDto.id` to every graph producer and
  make `flowGraphEdgeSemanticDiffKey` return that same ID. Encode the ordered
  `(source, target, type, occurrenceOrdinal)` tuple with UTF-16-code-unit
  length prefixes. `occurrenceOrdinal` is the zero-based deterministic ordinal
  for that exact tuple in the owning source unit's relation list, so delimiter-
  containing and supplementary-Unicode IDs cannot collide and same-type
  duplicates remain distinct. `seq` and `con` edges with equal endpoints remain
  distinct; expanded, before, and after graphs retain real IDs, and a remapped
  before endpoint gets its own before ID. Update existing graph builders,
  semantic-diff highlight lookup, document validation, React Flow projection,
  and their tests/approval paths to consume the formal ID; React Flow `id` is
  exactly the DTO ID.
- Additive kinds are `added`, `removed`, `changed`, and
  `confirmation-required`. Overlay `changeIds` are the existing
  `SemanticDiffResult["changes"][number]["id"]` string values and
  `confirmationIds` are the existing
  `SemanticDiffResult["confirmationRequired"][number]["id"]` string values.
  The host validates each ID against the exact retained context result before
  applying the overlay; no new allocator or opaque record brand is used, and
  duplicate records/IDs remain retained. Precedence is confirmation-required,
  removed, added, changed without discarding associated IDs.
- A Flow action applies the target-side table, resolves the exact existing Flow
  scope, and immediately before opening/ready/focus revalidates session epoch,
  scope, target, snapshot/version, and overlay ownership. It then builds one
  normal `UnitListDocumentDto` plus the optional `semanticDiffOverlay`
  augmentation defined in `SPECS.md` and sends it through the existing viewer
  host message. There is no new Flow overlay variant: the exact apply/clear
  envelope is `{ type: "changeDocument", data }`, where `data` is the existing
  validated document with a non-null augmentation for apply, the same base
  document with `semanticDiffOverlay: null` to clear only the overlay, or
  `null` to clear the document and overlay. An omitted augmentation means
  ordinary base data and no overlay. Supersession validates the new owner
  first, posts the new complete document once, and a late old-owner clear posts
  nothing.
- Focus reuses the existing viewer host message
  `{ type: "revealUnit", data: { absolutePath } }` and the Flow webview's
  existing `{ type: "ready" }` request/host `onReady` sequence. These viewer
  messages have no new reply envelope: parser/validator rejection is atomic
  and leaves the current document unchanged; ready/onReady failure follows
  the existing viewer failure notification and maps the Explorer action to
  `flow-not-ready`, while an absent/invalid target maps to
  `flow-target-missing`. Successful or failed Flow actions still use the
  existing Explorer `action-result` reply envelope from Slice 1. The exact
  Explorer session/action/owner fields remain host-private, and the 8 MiB
  limit applies only to Explorer wire messages, not existing viewer messages.
- The existing viewer parser accepts only `{type, data}` for
  `changeDocument`/`revealUnit`; the Flow document validator retains the
  optional `semanticDiffOverlay` and rejects extra fields, invalid IDs/states,
  or malformed base documents before state mutation. Overlay node entries
  must use an actual current `FlowGraphNodeDto["id"]` value (never a source,
  session, action, or other opaque handle); relation entries must use the
  actual current `FlowGraphEdgeDto["id"]`. The validated
  augmentation flows through `useFlowDocumentSubscription` to the existing
  Flow controller and `useFlowGraphState`. Overlay apply, clear, and
  supersession therefore reuse the current viewer validation and ready/focus
  failure paths rather than adding a second transport contract.
- Each Flow URI has one active overlay session. A newer session supersedes the
  prior owner. Clear requires `(flowUri, sessionId, disposeEpoch)`; a late
  clear from a superseded/disposed owner is a no-op and cannot clear the newer
  overlay.
- Feed the overlay through existing `useFlowGraphState`, expanded graph, and
  React Flow projection. Reuse nesting, reveal, graph/viewport focus, search,
  and keyboard controllers. Normal Flow sessions have no overlay and no
  behavior change.
- Nodes show a localized state badge and accessible state name. Highlighted
  relations retain non-color patterns, DOM state, and a visible legend; the
  Explorer focused leaf and `aria-live` status describe endpoint/state and the
  matching duplicate relation count. Flow relations remain non-focusable and
  ordinary edge keyboard behavior is unchanged. Selection/focus remain distinct
  from semantic state.
- Stale side source, unavailable scope/target, disposed panel, missing result
  ID, or rejected overlay returns a closed failure, preserves unrelated
  panels/overlays, and refocuses/announces in Explorer. The optional Flow
  augmentation contains IDs/state only; the base viewer document remains the
  normal `UnitListDocumentDto`. Reason code/detail is resolved from
  `context.result` by IDs. Missing IDs return `record-not-found` safely and
  never add reason/detail fields to the Flow wire.

## Impact Investigation

- Application: consume `SemanticDiffOutputContext`/canonical summary; add
  explorer session/view/action projection, filter, source-index port/outcomes;
  extend the existing Flow highlight builder to side-specific additive states.
  Context identity and summary are consumed, never rebuilt or re-aggregated.
- Infrastructure parser: add the enriched same-pass path beside the existing
  `AjsParserPort` implementation. One ANTLR invocation returns the normalized
  document and application-owned browser-safe source-index DTO built from raw
  unit header/name and parameter-occurrence token ranges; no raw tree escapes
  parser infrastructure, and no grammar/generated/domain meaning changes.
- VS Code/bootstrap/presentation host: migrate
  `executeCompareSemanticDiffCommand` success to the default Explorer, manage
  the session/strict actions, compose the per-command capture adapter before
  the current file report/output-context builder, own URI/TextDocument/
  snapshot/report/action and overlay registries, reuse the report provider,
  open exact sources from the retained index, and integrate existing
  `ViewerFactory`/`WebviewStore` Flow. A future calendar/workflow adapter may
  be injected at this bootstrap seam after its own approval; it is not a
  prerequisite for this feature. The workflow owns source selection and its
  immutable Git provider; Explorer owns the capture/index contract and
  source-action lookup.
- Webview: add Explorer bundle/components/localization and closed Explorer
  messages; reuse the existing Flow `changeDocument`, `revealUnit`, and
  `ready`/`onReady` host contract for highlighted documents and focus; render
  the Explorer with the existing MUI/Emotion foundation and a VS Code-aware
  theme; extend overlay controller state, badges/status, legend, patterns, DOM
  semantics, and high contrast without adding a Flow wire variant or reason
  details.
- Configuration: add only the Explorer webpack entry/bundle. Keep
  `package.json` commands, activation, custom editors, and engine unchanged.
- Tests: add explorer projection/filter/message/DOM/accessibility/scale and
  source locator/navigation; add actual-session filter assertions and WCAG
  2.2 AA manual/axe/reflow/contrast/target-size evidence; update
  command/report, Flow highlight/message/controller/view/accessibility, viewer
  wiring, bundle, architecture, and desktop/web regressions. Every qlty-smell
  slice retains focused behavior tests and runs the smell report to ensure
  findings are removed rather than suppressed.
- Durable docs: at Feature Exit update semantic report and Flow exploration
  use cases, README, and CHANGELOG; update build-semantic-diff only if its
  consumer wording becomes stale. No architecture/glossary/context/roadmap
  change is planned.

## Implementation Slices

### Slice 1: Project The Immutable Explorer Session

- Status: Slice 1 implementation complete; independent review Ready with no
  findings; completion-approved automatically on 2026-09-06 under the explicit
  user policy and committed in `e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`.
- Scope: application session/view/action types referencing one immutable
  `SemanticDiffOutputContext`, canonical cards, hierarchy, closed target-side
  mapping, availability, confirmation filter, and strict plain message
  contracts; no UI or host registry.
- User / Domain Value: one trustworthy model exposes every upstream fact and
  prevents counts or rules drifting in presentation.
- Cohesive Change Group: application projection/transport and pure tests.
- Acceptance: every neutral variant occurs once; grouping/order, rename/move,
  no-path, zero/empty, filter pruning, all five change-kind side mappings,
  all nine reason-side mappings, action availability, pairwise-distinct opaque
  ID brands, immutable context identity, and malformed/extra-key rejection
  match Design Decisions. Flow node IDs remain the actual
  `FlowGraphNodeDto["id"]` values when represented by a later overlay;
  comparison, summary, schedule, identity, and output renderers are never
  invoked.
- Validation: empty/mixed/before/after/relation/unsupported/limitation/
  schedule/candidate/all-nine-reason/shuffled fixtures; duplicate confirmation
  records plus confirmation-level change leaves; context identity and
  no-recalculation spies; closed request/reply/host union, null, correlation,
  wrong-session, non-finite, extra-key, and payload-limit tests; determinism/
  property tests; focused compiled suite, `rtk pnpm run qlty`, and build.
- Production Readiness: linearithmic worst case, raw values preserved, no
  localized comparator or host-content leak, validate before state mutation.
- Approval Boundary: Explorer application projection/filter/messages and
  named tests. Any neutral field/reason/summary/comparison/output change replans.
- Dependencies: completed predecessor contracts and canonical summary/order.
- Risks: record coalescing, second summary semantics, localized order, leaked
  handles, cross-brand ID confusion, inferred side fallback, and transport
  drift. Exact coverage, context-identity spies, strict opaque-handle
  validators, closed-union tests, and no-recalculation spies are the gate.
- Implementation evidence (2026-09-06): application projection, immutable
  session identity, deterministic UTF-16 hierarchy, closed target-side
  mapping, action availability, confirmation filtering, and strict plain
  request/reply/host message validators are implemented in the Slice 1
  application files. Focused projection and transport tests cover all five
  change kinds, all nine confirmation reasons across all target kinds,
  candidate changes, uncalculated unsupported findings, true duplicate IDs
  with different facts, deterministic same-ID tie-breaking under shuffle,
  UTF-16 ordering, zero/filter-empty behavior, identity preservation, exact
  nested contracts, correlation validation, malformed host lifecycle cases,
  and payloads near the fixed 8 MiB limit. The session action registry is an
  encapsulated immutable lookup;
  card totals, tree leaf counts, status/filter invariants, and relationPair
  endpoint hierarchy placement, top-level root shape, target-side consistency,
  dense arrays, and no-recalculation access are covered by malformed and
  side-mismatch fixtures. The `test:compile` command, 15 focused compiled
  tests, `qlty`, and `git diff --check` passed; the production build also
  passed. Existing semantic comparison and host wiring remain untouched; the
  build retains the desktop/web bundles. Qlty smell output reports complexity
  metrics for the new closed validators as a review signal; `qlty check` is
  clean.
- Production readiness status: complete for Slice 1; source/Flow/report
  execution, host registry, UI, telemetry, and durable user-document changes
  remain explicitly deferred to later slices or Feature Exit.
- Independent implementation review (2026-09-06): Ready; no findings.
- Slice 1 Completion Approval (2026-09-06): Automatically Approved under the
  explicit 2026-09-06 user policy because the independent review was Ready
  with no findings. This approves only the Slice 1 completion scope recorded
  above; aggregate final human approval remains pending until all four slices
  are complete.
- Completion commit status: committed as
  `e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`.
- Exact completion-commit scope and paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/application/semantic-diff/semanticDiffExplorer.ts`,
  `src/application/semantic-diff/semanticDiffExplorerDto.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessages.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjection.ts`,
  `src/test/suite/semanticDiffExplorerMessages.test.ts`, and
  `src/test/suite/semanticDiffExplorerProjection.test.ts`.
- Out of Scope: panel, source/Flow/report execution, telemetry, durable docs.

### Slice 2: Open And Operate The Accessible Explorer

- Status: Slice 2 implementation complete; independent review Ready with no
  findings; completion-approved automatically on 2026-09-07 under the explicit
  user policy and committed as
  `01349376da1a76fa0c91a0311b3ab1659f5dc521`.
- Scope: panel/bundle, command success migration to the default Explorer,
  cards/tree/filter/actions, UI state/virtualization, same-session four-mode
  Output handoff, host-owned registries, and panel lifecycle.
- User / Domain Value: reviewers scan, filter, and keyboard-navigate before
  choosing detailed Markdown.
- Cohesive Change Group: command/bootstrap, panel/session, React/localization,
  report action, webpack entry, and focused tests.
- Acceptance: successful comparison opens Explorer only and retains the exact
  context identity; failures open none; `Output` calls the shared picker and
  `presentSemanticDiffOutput(context, mode)` for all four modes with no
  re-comparison/re-aggregation; empty/filter/strict session, explicit
  Markdown/no implicit copy, keyboard/focus/live/high-contrast, payload-limit,
  and 10,000-leaf behavior match Design Decisions. The host opener accepts
  only `SemanticDiffOutputContext` and resolves
  `Promise<SemanticDiffExplorerSessionHandle>` with the exact session ID,
  `WebviewPanel`, and idempotent `dispose()` contract; panel disposal invokes
  the same composite cleanup.
- Validation: command/wiring/report, four-mode call/context identity,
  lifecycle/correlation/disposal, borrowed-registry release,
  unregister-before-release ordering, dispose-epoch/late completion and
  supersession tests; opener resolution/rejection and panel
  `onDidDispose`/idempotent-dispose tests; closed host message and oversized
  payload tests; React
  DOM, keyboard/focus/localization/aria-live/axe/forced-colors/scale; focused
  compiled tests, qlty, build, desktop Semantic Diff, web bundle smoke.
- Production Readiness: dispose all listeners/requests/snapshots/report/action
  handles/context, suppress late focus/post/recreation, enforce the 8 MiB
  limit without partial state or fallback, escape raw values, preserve provider
  cache/concurrency and host parity. The source-lifetime hook is private and a
  no-op until Slice 3 attaches a capture disposer; it never changes the public
  session-handle shape.
- Approval Boundary: Explorer panel and existing command success handoff,
  Full report action, localization/bundle/tests. New command/mode/input/copy/
  persistence replans.
- Dependencies: completed Slice 1 (`e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`)
  and structured report dispatcher/provider.
- Risks: virtual tree semantics, stale focus, explicit-copy regression, context
  cloning, oversized initial payload, borrowed-registry lifetime, and close
  races. Identity/lifecycle, unregister-order, and payload-boundary tests are
  the gate.
- Out of Scope: source/Flow execution, Git/WebAPI/period, persistence, docs.

Implementation evidence (2026-09-07): Slice 2 implementation is complete and
was independently reviewed with no findings. The existing comparison command
now hands the single retained output context to the default Explorer opener;
the shared report provider remains the output document provider. The dedicated
desktop and web Explorer bundle renders cards, an expandable accessible tree,
confirmation filtering, four-mode Output selection, keyboard/focus/live-region
feedback, separate localized change-kind/confirmation/unsupported-kind facts,
and a virtualized path for large trees. The webview uses a reliable
session-ID-in-HTML ready handshake, and virtualized Home/End/arrow navigation
scrolls before restoring focus and announcing the newly selected leaf.
Host-owned context/action registries enforce session ownership and
unregister-before-release panel cleanup; disposal epochs suppress late output
operations/posts, and the private source-lifetime hook remains a no-op until
Slice 3. Focused tests cover same-context four-mode Output handoff,
registry identity/release, ready/session handshake, strict unknown-action
correlation, oversized initial-session nullable failure, panel
lifecycle/supersession, disposal during Output, DOM/ARIA, keyboard semantics,
localization/axe, initial host-failure status/live announcement, the single
tree tab stop with `aria-activedescendant`, confirmation-filter latent
selection with visible `aria-selected` kept empty until the latent item is
visible again, Virtuoso `scrollToIndex`, offscreen focus restoration, and
10,000-leaf scale. Validation passed full `tsc --noEmit`,
`rtk pnpm run test:compile`, the focused DOM Mocha suite (7/7),
`rtk pnpm run build`, `rtk pnpm run test:prepare:desktop` plus compiled
desktop smoke, `rtk pnpm run test:prepare:web`, `rtk pnpm run qlty`,
`rtk pnpm run lint:md`, and `rtk git diff --check`. The web launcher reached
the Chromium startup boundary but was blocked by
`bootstrap_check_in ... Permission denied (1100)` in the managed environment;
see TRACEABILITY.md. Slice 2 Completion Approval was automatically approved
under the explicit 2026-09-06 user policy because the independent review was
Ready with no findings, and the focused completion commit is
`01349376da1a76fa0c91a0311b3ab1659f5dc521`. Aggregate final human approval
remains pending until all four slices are complete.

- Exact completion-commit scope and paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/bootstrap/extension/extensionSubscriptions.ts`,
  `src/bootstrap/extension/semanticDiffWiring.ts`,
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/webview/constant.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerReportAction.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerLocalization.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerEntry.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`,
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffExplorerDom.test.tsx`,
  `src/test/suite/semanticDiffExplorerPanel.test.ts`,
  `src/test/suite/semanticDiffExplorerRegistry.test.ts`,
  `src/test/suite/semanticDiffExplorerReportAction.test.ts`, and
  `webpack.config.js`.

### Slice 3: Reveal Exact Before And After Source Targets

- Status: Implementation complete; independent review Ready with no findings,
  Completion Approval automatically approved on 2026-09-07, and focused
  completion commit `a25d674c67b3e6a9fb03c89a12a745a579bfd655` recorded.
- Scope: application-owned browser-safe source-index DTO/port, the explicit
  same-pass `AjsParserWithSourceIndexPort` result and scoped capture state
  machine, ANTLR adapter from `unitAttribute`/`unitParameter` token ranges,
  fixed private lookup API, side registry/snapshot verification, VS Code
  reveal, typed outcomes, action completion/focus, and tests. The parser
  capture is composed as an `AjsParserPort` adapter for the current file
  command's existing `createBuildSemanticDiffReportData`/output-context
  callback; a future calendar/workflow artifact callback can use the same seam
  after its own approval. No calendar result, OutputContext, or JSON contract
  changes are owned here.
- User / Domain Value: jump to the exact compared unit/parameter on the correct
  side without selecting a similarly named or changed document.
- Cohesive Change Group: application source contract, parser locator, VS Code
  adapter/wiring, Explorer routing, parser/navigation tests.
- Acceptance (source index):
  `src/application/parsing/AjsParserWithSourceIndexPort.ts` exports
  `AjsParserWithSourceIndexPort` and `ParseAjsWithSourceIndexResult`; success
  is exactly `{ ok: true, document, sourceIndex }` and failure is the existing
  `ParseAjsResult` parser-error union. The source capture contract in
  `src/application/semantic-diff/semanticDiffSourceCapture.ts` exports
  `beginSemanticDiffSourceCapture({ before, after })`; its scoped result
  exposes only `parser: AjsParserPort`,
  `bind(context: SemanticDiffOutputContext): SemanticDiffSourceCaptureBindResult`,
  and idempotent `release(): void`. The capture parser invokes the enriched
  parser exactly once for before and once for after in that order, returns the
  existing `ParseAjsResult` to the current file comparison builder, and retains
  the two indexes privately until bind/release. A wrong-order content mismatch,
  extra parse, or post-release call throws the typed
  `SemanticDiffSourceCaptureError`; bootstrap maps it to
  `source-capture-failed` without fabricating a parser syntax error. A
  bind-before-two or second bind returns the closed bind result. A parser
  error is returned through the existing result for that side and does not
  prevent the second fixed-order parse, so the current builder preserves its
  separate before/after parser-error union; a future calendar/workflow
  callback must preserve the same seam after its own approval.
- Acceptance (DTO and runtime validation): the exact
  `SemanticDiffSourceIndexId`, `SemanticDiffSourceHandleId`,
  `SemanticDiffCaptureScopeId`, `SemanticDiffExplorerSessionId`, and
  `SemanticDiffExplorerActionId` brands and the exact
  `SemanticDiffSourcePosition`, `SemanticDiffSourceRange`,
  `SemanticDiffSourceParameterOccurrence`, `SemanticDiffSourceUnitEntry`, and
  `SemanticDiffSourceIndex` shapes defined in Source Navigation are the only
  application index forms. Kind-specific namespace/sequence allocators and
  owner-registry membership checks provide runtime separation after TypeScript
  brands are erased. Index validators reject extra keys, non-finite or
  negative positions/ordinals, reversed ranges, unknown/expired IDs, and
  unregistered source indexes; nested parameter/header ranges are allowed.
- Acceptance (lookup): the exact request is
  `lookup({ sourceIndexId, unitId, targetKind, parameterKey? })`, with no extra
  keys; `targetKind` is `unit | jobnet | jobgroup | attribute`; and success is
  exactly `{ primaryRange, occurrences }`. Unit/jobnet/jobgroup return the
  declaration name range plus no occurrences; attribute returns the first
  exact-key occurrence as primary plus all matching occurrences in source
  order. The full header range is the fallback for empty, malformed, or
  non-unique names within an otherwise indexed unit. Fixed missing/stale/
  malformed/unavailable/expired outcomes, UTF-16/CRLF/Unicode ranges, and
  closed-table sides are preserved; no cross-side fallback or parser/VS Code
  DTO leakage is allowed.
- Acceptance (workflow/host binding): the workflow starts capture with both
  immutable before/after snapshot descriptors before invoking the current
  file report/output-context builder, passes the scoped `parser` to that
  builder, and calls `bind(context)` exactly once only after successful
  context construction. A future calendar/workflow callback may replace this
  injected builder after its own approval, but it is not a Slice 3 dependency
  and creates no reverse import. Bootstrap binds the captured indexes and
  opaque side handles to the exact context object, then awaits the unchanged
  one-argument `OpenSemanticDiffExplorer(context)` Promise. The resolved
  `SemanticDiffExplorerSessionHandle` has exactly
  `{ sessionId: SemanticDiffExplorerSessionId; panel: WebviewPanel;
dispose(): void }`; `WebviewPanel` remains host-only. Slice 2's private
  source-lifetime hook starts as a no-op, and Slice 3 attaches the capture's
  composite disposer to it before registration completes. Explicit handle
  disposal and `panel.onDidDispose` call that composite once. The capture
  scope remains
  sole owner across `collecting`, `bound`, `registered`, and `released`; bind
  transfers no ownership, and the context registry stores borrowed refs only.
  Parse, artifact, bind, panel-creation, cancellation, and partial-side
  failures use one composite disposer that unregisters the context mapping
  before calling `scope.release()` exactly once, then rejects the opener
  Promise; direct release and repeated disposal are idempotent. Current file
  command maps that rejection to `display-failed`; a future workflow maps it
  to `explorer-open-failed`. Concurrent scopes are isolated; stale/disposed
  epochs make borrowed lookups/actions unavailable. Source actions use only
  the retained index and decoded immutable snapshot and never parse or
  regenerate an index.
- Validation: nested `unitAttribute`/`unitParameter` header, empty-name,
  malformed-name, no-unique-name, duplicate-key, quoted-value, CRLF, Unicode,
  and malformed/incomplete fixtures; strict lookup keys/target kinds/parameter
  requirements, opaque source-index IDs, UTF-16 surrogate-pair offsets, source-order
  ordinals, missing-code matrix, before/after/dirty/missing/unavailable/
  disposed and immediate pre-reveal decoded `openTextDocument().getText()`
  revalidation/focus tests, including Shift_JIS and BOM; immutable Git HEAD
  provider/revision tests; same-pass
  normalized-document/index identity, exactly two enriched-parser calls,
  before/after order, equal-text deterministic assignment, content mismatch,
  extra-call, parser-error with second-side continuation, bind-order,
  second-bind, collecting/bound/registered/released transitions, direct
  release, unregister-before-release ordering, partial registration, panel
  creation failure, cancellation, concurrent scope, stale epoch, disposal,
  late completion, and no-action-parse spies; current file-builder call count,
  exact context identity, one-argument Promise-returning Explorer opener,
  resolved session handle, rejection-to-command-failure mapping, no-op-to-
  attached source-lifetime hook, future callback seam, and host registry
  borrowed-reference resolution tests; source-index DTO
  exact-key/brand-prefix/membership/range/ordinal validator tests; architecture,
  focused compiled suites, qlty, and build.
- Production Readiness: construct the index alongside the normalized
  document, retain immutable decoded source snapshots before reveal, revalidate
  session/index/scope and decoded `openTextDocument(uri).getText()` content/
  version immediately before host reveal, bind to the actual normalized
  `AjsUnit.id` without choosing duplicate paths, preserve VS Code Unicode
  columns and Shift_JIS/BOM decoding, isolate host failures, and keep the
  private lookup result browser-safe with no URI/TextDocument/snapshot/parser/
  domain object. The workflow-owned `GitImmutableSourceProvider` supplies
  read-only HEAD snapshots without Explorer Git or `.git` access. All capture,
  registry, and provider resources are scoped, bounded, idempotently released,
  and safe under direct release, cancellation, panel failure, stale epochs,
  and late completion.
- Approval Boundary: application source-index DTO/port, explicit enriched
  parser result, capture begin/parse/bind/release state machine, exact private
  lookup, same-pass raw locator metadata/ANTLR adapter, context-keyed source
  handles/navigation, action results, rollback/concurrency/disposal behavior,
  and named tests. Workflow source selection/Git, calendar public action,
  grammar/generated-parser redesign, normalized-domain meaning, fuzzy or
  relation matching, editing, and a changed public Explorer signature replan.
- Dependencies: completed Slice 2 (`01349376da1a76fa0c91a0311b3ab1659f5dc521`)
  and existing raw parser/workspace APIs.
  The current file command supplies the scoped-parser/output-context seam, so
  Slice 3 does not depend on calendar/workflow completion. A later workflow
  implementation may consume this contract after the Explorer completion
  commit; its calendar callback is an explicit integration gate, not a
  prerequisite or reverse dependency.
- Risks: token/context range conversion, empty or non-unique names, duplicate
  occurrence ordering, unsaved documents, Shift_JIS/BOM decoding, identical
  side paths, parser DTO leakage, erased brand confusion, stale index races,
  wrong-side capture, partial binding, borrowed-reference leaks, direct
  release ordering, and concurrent scope cross-talk. Exact DTO/validator,
  lookup/range, call-order, ownership/rollback, context-identity, provider,
  and revalidation matrices are the gate.
- Out of Scope: Flow, editing, diagnostics, arbitrary sources, durable docs.

Implementation evidence (2026-09-07): Slice 3 adds the browser-safe source
index and same-pass capture contracts, ANTLR token-derived UTF-16 ranges,
context-keyed host source bindings, exact-side VS Code reveal with decoded
snapshot/version revalidation, and idempotent unregister-before-release
cleanup. The current file command injects the scoped parser into the existing
report builder and binds only after the retained output context is built; no
calendar/workflow dependency, global last-parse cache, action-time parse, or
Flow overlay was introduced. Focused tests cover fixed before/after capture
ordering, exact enriched-index validation and capture-scope membership,
parser-error continuation, immutable index/binding/host snapshots,
bind/release lifecycle, duplicate IDs and parameter occurrences,
CRLF/Unicode ranges, foreign/unregistered/stale lookups, source-capture
registration failure mapping, retained-range source actions with
stale/pre-reveal revalidation, direct-release invalidation, panel-creation
rollback, partial-registration insert-then-throw rollback ordering with stale
lookup absence, and exact command/registry seams. Validation passed TypeScript,
compiled tests, the full desktop extension smoke suite, desktop and web
production/build preparation, qlty, markdown lint, and diff checks. Source
bind/registration and Explorer-open exceptions are classified as current
command `display-failed`; registration rejects released bindings and the host
registry drops direct-release entries immediately. A direct web browser smoke
remains blocked by the managed Chromium
`bootstrap_check_in ... Permission denied (1100)` environment failure; the
desktop runner and both bundle validations passed. Independent implementation
review was Ready with no findings; Completion Approval was automatically
approved on 2026-09-07 under the recorded user policy. The focused completion
commit is `a25d674c67b3e6a9fb03c89a12a745a579bfd655`. Aggregate final human
approval remains pending until all four slices are complete.

- Exact completion-commit scope and paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/application/parsing/AjsParserWithSourceIndexPort.ts`,
  `src/application/semantic-diff/buildSemanticDiffReportData.ts`,
  `src/application/semantic-diff/semanticDiffSourceCapture.ts`,
  `src/application/semantic-diff/semanticDiffSourceIndex.ts`,
  `src/bootstrap/extension/extensionDependencies.ts`,
  `src/bootstrap/extension/semanticDiffWiring.ts`,
  `src/infrastructure/parser/AjsEvaluator.ts`,
  `src/infrastructure/parser/AntlrAjsParser.ts`,
  `src/infrastructure/parser/raw/AjsRawUnit.ts`,
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerSourceAction.ts`,
  `src/test/suite/AntlrAjsParser.test.ts`,
  `src/test/suite/semanticDiffCommand.test.ts`,
  `src/test/suite/semanticDiffExplorerPanel.test.ts`,
  `src/test/suite/semanticDiffExplorerRegistry.test.ts`,
  `src/test/suite/semanticDiffExplorerSourceAction.test.ts`, and
  `src/test/suite/semanticDiffSourceCapture.test.ts`.

### Slice 4: Focus Existing Flow Views With Semantic Overlays

- Status: Complete; independently reviewed `Ready`, automatically
  completion-approved, and committed as
  `aa972a293e34f645d3580fee6234d606e161602b`.
- Scope: explicit stable `FlowGraphEdgeDto.id` and shared semantic-diff key,
  before/after additive highlight states, canonicalPair-to-side-specific edge
  IDs, the optional `semanticDiffOverlay` augmentation in the existing
  `changeDocument` data, `revealUnit`/`ready` Flow host integration,
  `useFlowDocumentSubscription` → controller → `useFlowGraphState` handoff,
  one-overlay-per-Flow-URI ownership, exact-side panel ready/scope/reveal, and
  accessible Flow labels. No new Flow overlay wire variant is in scope.
- User / Domain Value: jump into the existing Flow Viewer and understand the
  selected state without color-only cues or a duplicate graph.
- Cohesive Change Group: highlight mapper, current Flow messages/lifecycle/
  controller/renderer, exact-side wiring, tests.
- Acceptance: the stable edge ID is the collision-free UTF-16 length-prefixed
  encoding of the ordered `(source, target, type, occurrenceOrdinal)` tuple
  and is used by every existing graph producer, semantic-diff lookup,
  validator, and React Flow edge (`id` exactly equals the DTO ID).
  `occurrenceOrdinal` is the zero-based deterministic ordinal for an identical
  tuple in its owning source relation list. Closed-table side mapping/
  precedence, canonicalPair-to-all-matching before/after IDs, lowest-ordinal
  focus, duplicate-count `aria-live`, existing graph reuse, nested focus,
  immediate pre-ready revalidation, and atomic malformed/stale/missing-record
  failure hold. Overlay apply/clear/supersede use only the exact existing
  `{ type: "changeDocument", data }` message. `data` is normal base document
  plus a non-null exact-key `semanticDiffOverlay` for apply,
  `semanticDiffOverlay: null` to clear only the overlay, omission for ordinary
  base data/no overlay, or `null` to clear the document and overlay. Focus uses
  `{ type: "revealUnit", data: { absolutePath } }`, and readiness uses the
  existing `{ type: "ready" }`/`onReady` path; no new response or overlay
  variant is introduced. One active overlay per Flow URI, owner-token
  late-clear safety, textual/pattern/legend/DOM/high-contrast states,
  non-focusable relations, and unchanged normal Flow search/navigation/
  keyboard/rendering are required.
- Overlay node entries use the actual corresponding
  `FlowGraphNodeDto["id"]` value from the active graph; they are not source
  index, source-handle, capture-scope, session, or action IDs. Overlay
  relation entries use the actual `FlowGraphEdgeDto["id"]` value. The active
  graph validator checks membership and rejects arbitrary or cross-kind IDs
  before mutating Flow state.
- Validation: stable-ID collision/UTF-16/length-prefix tests including seq/con
  parallel edges, same-type duplicate and reordering stability, delimiter and
  supplementary-Unicode identifiers, expanded graphs, before/after endpoint
  remapping, and React Flow IDs; graph/highlight/validator/existing-consumer
  regressions; exact `semanticDiffOverlay` keys, null/absent/base-data clear
  semantics, actual `FlowGraphNodeDto["id"]`/`FlowGraphEdgeDto["id"]` graph
  membership and cross-kind rejection, validator retention,
  `useFlowDocumentSubscription` → controller → `useFlowGraphState` propagation,
  apply/clear/supersede replacement tests;
  exact viewer message key, acceptance/rejection, no-reply, ready failure, and
  Explorer action-result mapping tests; controller/effects/view/node/minimap/
  focus/accessibility/high-contrast/`aria-live` duplicate-count tests; all
  state pairs, canonical-pair all-duplicate highlighting, relation
  non-focusable DOM/axe, nested/disposed/not-ready/malformed/
  oversized-Explorer-wire/replacement/late-clear/owner-token/normal goldens;
  qlty, build, desktop and web suites.
- Production Readiness: build/serialize overlays once, no graph rebuild per
  selection, validate actual graph node/edge membership and `context.result`
  IDs before mutation,
  preserve formal ID/state-only application data and existing viewer wire,
  isolate disposal/supersession, keep 8 MiB enforcement Explorer-only, and
  keep desktop/web and VS Code 1.75 compatibility.
- Approval Boundary: formal edge IDs, additive states/side mapping, existing
  Flow `changeDocument`/`revealUnit`/`ready` integration, owner lifecycle,
  accessibility, and named tests. A new Flow message variant, renderer/layout/
  search/reverse-report/edit/telemetry/comparison behavior, or synthetic ID
  scheme replans.
- Dependencies: completed Slice 3
  (`a25d674c67b3e6a9fb03c89a12a745a579bfd655`) and existing
  highlight/Flow/focus/a11y base.
- Risks: side ID mismatch, scope races, lost IDs, inaccessible relations,
  overlay leakage, stale ready, and a late old-owner clear removing a new
  overlay. Side/lifecycle/a11y/host matrix is the gate.
- Out of Scope: reverse Flow-to-Markdown, layout/search, calendar, editing.

Implementation evidence (2026-09-07): Slice 4 implements formal graph-edge
IDs, before/after state mapping, exact graph-membership validation for the
state-only overlay, existing Flow message/readiness/reveal integration, URI
overlay ownership with stale-clear protection, and accessible node/relation
states. Added focused coverage includes delimiter/supplementary-Unicode and
duplicate IDs, all matching canonical relation occurrences, overlay
null/absent/cross-kind semantics, viewer message round trips, host apply and
reveal, stale session/owner behavior, relation non-focusability, MiniMap,
high-contrast/pattern/legend labels, duplicate relation announcements, and
Explorer axe/DOM behavior. `rtk pnpm run test:compile`, `rtk pnpm run qlty`,
`rtk git diff --check`, `rtk pnpm run build`, desktop preparation/runner, and
web preparation passed. The managed Chromium web smoke launcher remains
environment-blocked at `bootstrap_check_in ... Permission denied (1100)`;
desktop smoke exited successfully. The architecture suite retains two
pre-existing composition-root violations: `src/infrastructure/parser/AntlrAjsParser.ts`
calls the existing source-index allocator and
`src/presentation/vscode/commands/semanticDiffCommand.ts` calls the existing
source-handle allocator outside bootstrap; this slice does not alter either
boundary. One existing expanded-graph node-order golden mismatch remains
outside this slice's runtime scope and is provided to independent review.
Completion Approval is still pending; no commit was created.

Finding remediation evidence (2026-09-07): nested expanded nodes and formal
relations now retain semantic highlights; canonical relation endpoints are
checked against the active graph's formal edge IDs before lowest-ordinal
reveal; host-private `(kind, id, occurrence, target)` metadata is validated
in source order; retained source snapshots are rechecked before Flow host
operations; ordinary Flow replacement updates the clear base; and per-URI
operation IDs prevent late same-owner clears. The focused host/Flow/a11y run
passed 25 tests. The expanded-graph suite passed 8 tests with the same
pre-existing node-order golden mismatch. The architecture suite reports the
two pre-existing composition-root violations named above.

P1 occurrence remediation evidence (2026-09-07): a shared application helper
assigns duplicate ordinals in source order before presentation sorting, and
the same ordinal plus exact target is carried through projection, panel
metadata, registry extraction, Flow action resolution, and canonical relation
lookup for changes, confirmations, and unsupported findings. The reversed
same-ID relation regression passed in the 35-test focused projection/Flow/
graph/highlight/host run. Final `rtk pnpm run build`, desktop/web preparation,
and desktop smoke passed; web smoke remains blocked before test execution by
the managed Chromium `bootstrap_check_in ... Permission denied (1100)`
environment failure. `rtk pnpm run qlty:check`, `rtk git diff --check`, and
`rtk pnpm run lint:md` also passed.

## Slice 4 Completion-Gate Evidence (2026-09-07)

- Independent implementation review: `Ready`, with no findings.
- Completion Approval: automatically approved under the explicit user policy
  after the `Ready` verdict on 2026-09-07.
- Approved scope: formal collision-free Flow edge IDs and semantic-diff
  states; actual graph node/edge membership and canonical side-specific
  relation mapping; existing `changeDocument`, `revealUnit`, and `ready` Flow
  paths; one-overlay-per-URI owner and stale-clear lifecycle; nested
  highlight propagation; source-order duplicate occurrence/target metadata;
  Flow badges, tooltips, legend, patterns, high-contrast, MiniMap,
  accessibility, duplicate announcements, and non-focusable relation edges;
  focused host/Flow/a11y tests and production-readiness evidence. No new Flow
  wire variant, renderer, layout/search, comparison/edit, reason/detail
  fields, synthetic IDs, or telemetry changes.
- Baseline evidence is unchanged from Slice 3: one pre-existing expanded
  node-order golden aggregate failure and one architecture aggregate failure
  containing two pre-existing composition-root violations. Chromium web smoke
  remains environment-blocked at
  `bootstrap_check_in ... Permission denied (1100)`.
- Completion commit status: focused completion commit recorded as
  `aa972a293e34f645d3580fee6234d606e161602b`; this historical Slice 4 gate is
  complete. No new implementation scope is authorized by that commit.
- Exact current paths from `git status --porcelain=v1` (36 paths):

  ```text
  docs/specs/features/semantic-diff-explorer/TASKS.md
  docs/specs/features/semantic-diff-explorer/TRACEABILITY.md
  src/application/flow-graph/buildExpandedFlowGraph.ts
  src/application/flow-graph/buildFlowGraph.ts
  src/application/flow-graph/buildFlowGraphCore.ts
  src/application/flow-graph/buildSemanticDiffFlowHighlights.ts
  src/application/flow-graph/flowGraphDocument.ts
  src/application/semantic-diff/semanticDiffExplorerProjection.ts
  src/application/unit-list/unitListDocument.ts
  src/bootstrap/extension/extensionSubscriptions.ts
  src/bootstrap/extension/semanticDiffWiring.ts
  src/bootstrap/extension/viewerWiring.ts
  src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts
  src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts
  src/presentation/vscode/webview/ajsDocument.ts
  src/presentation/webview/editor/ajsFlow/FlowContents.tsx
  src/presentation/webview/editor/ajsFlow/FlowGraphCanvas.tsx
  src/presentation/webview/editor/ajsFlow/flowGraphView.ts
  src/presentation/webview/editor/ajsFlow/flowMiniMap.ts
  src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx
  src/presentation/webview/editor/ajsFlow/useFlowGraphState.ts
  src/presentation/webview/viewerHostMessages.ts
  src/resource/i18n/message_en.ts
  src/resource/i18n/message_ja.ts
  src/test/suite/buildExpandedFlowGraphUseCase.test.ts
  src/test/suite/buildFlowGraph.test.ts
  src/test/suite/flowGraphDocument.test.ts
  src/test/suite/flowGraphView.test.ts
  src/test/suite/semanticDiffExplorerProjection.test.ts
  src/test/suite/semanticDiffFlowHighlights.test.ts
  src/test/suite/viewerHostMessages.test.ts
  src/application/flow-graph/buildSemanticDiffFlowOverlay.ts
  src/application/semantic-diff/semanticDiffRecordOccurrence.ts
  src/bootstrap/extension/semanticDiffFlowViewerBridge.ts
  src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts
  src/test/suite/semanticDiffExplorerFlow.test.ts
  ```

### Slice 5: Adopt The MUI Explorer Surface And WCAG 2.2 AA Baseline

- Status: Implementation complete; independently reviewed `Ready` with no
  findings; Completion Approval automatically approved and focused-committed
  as `ee76722d0628d2d4e223f6faf13751a7a16a3a35` after reviewed replan commit
  `54ca4005`.
- Scope: replace the Explorer's ad-hoc HTML controls/layout with MUI 7
  components and a VS Code-aware theme; split the Explorer app/view into
  cohesive presentational and host-message helpers; deduplicate localized
  label construction without dropping Japanese/English facts; preserve the
  existing tree roles, action IDs, transport, and desktop/web bundle entry.
  Slice 5 owns the canonical helper
  `src/presentation/webview/shared/muiTheme.ts` and its public theme tokens,
  `ThemeProvider`, `GlobalStyles`, focus-ring, forced-colors, and target-size
  policy. Slice 13 may consume that helper but may not create a second theme,
  redefine its tokens, or change its API.
  The panel HTML/CSP is adjusted only as needed for Emotion/MUI style
  injection, with no remote assets or new wire data.
- User / Domain Value: reviewers receive a consistent MUI design that remains
  readable and operable in VS Code light/dark, high-contrast, forced-colors,
  keyboard, zoom, and narrow/reflowed layouts.
- Cohesive Change Group: `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerLocalization.ts`,
  `src/presentation/webview/shared/muiTheme.ts` (new canonical owner), the
  optional `semanticDiffExplorerTree.tsx`/`semanticDiffExplorerHostState.ts`
  presentation helpers, the panel HTML/CSP seam only if required, and
  `src/test/suite/semanticDiffExplorerDom.test.tsx` plus
  `src/test/suite/semanticDiffExplorerPanel.test.ts`.
- Acceptance: MUI `ThemeProvider`/components render the cards, filter,
  status, tree rows, and actions; theme values use VS Code CSS variables and
  do not assume a fixed light palette. The complete applicable WCAG 2.2 AA
  matrix in `SPECS.md` (1.1.1, 1.3.1, 1.3.2, 1.3.4, 1.4.1, 1.4.3,
  1.4.4, 1.4.10, 1.4.11, 1.4.12, 2.1.1, 2.1.2, 2.4.1, 2.4.2, 2.4.3,
  2.4.6, 2.4.7, 2.4.11, 2.4.13, 2.5.2, 2.5.3, 2.5.7, 2.5.8, 3.1.1,
  3.1.2, 3.2.1, 3.2.2, 3.2.4, 3.3.1, 3.3.2, 4.1.2, and 4.1.3) is
  evidenced by automated assertions plus the specified manual checks; the
  matrix's explicit N/A rationale remains part of the contract. Primary
  controls target 44 by 44 CSS px; every smaller control is at least 24 by 24
  CSS px and records an allowed WCAG exception. The existing strict Explorer
  transport and Flow message contract are unchanged.
- Validation: focused compiled DOM tests with real MUI controls; `axe-core`
  with color-contrast limitations documented for jsdom; manual keyboard,
  focus-visible, target-size, contrast, forced-colors, 200% text resize,
  400% reflow at the 320 CSS px equivalent, text-spacing, focus-obscured,
  status-announcement, meaningful-sequence, label-in-name, and error-state
  checks against every matrix row; MUI/Emotion production bundle and CSP
  smoke for desktop and web;
  `rtk pnpm run test:compile`, focused DOM tests, `rtk pnpm run qlty`,
  `rtk pnpm run build`, and `rtk git diff --check`.
- Production Readiness: no external fonts/assets/eval, no Node built-ins in
  webview code, no CSP weakening beyond the existing style policy, bounded
  rendering for the 10,000-leaf path, preserved panel disposal, localized
  status/error text, and no contrast or focus regression in existing Flow/
  table viewers.
- Approval Boundary: Explorer MUI/theme/layout/accessibility and its tests;
  no semantic filtering correction, Flow renderer redesign, transport change,
  engine change, or dependency upgrade.
- Dependencies: completed Slice 4 and existing MUI/Emotion dependencies in
  `package.json`.
- Risks: Emotion styles blocked by CSP, VS Code CSS variable contrast drift,
  nested MUI interactive semantics, focus loss during virtualization, and
  bundle-size regression. Mandatory static CSP assertions must prove
  `default-src 'none'`, nonce-bound scripts, the existing `cspSource`/inline
  style policy only, no remote origins/fonts/connect/eval, and no weakened
  policy. The CSP/bundle/axe/manual matrix is the gate; a required CSP policy
  change triggers Replanning rather than silent weakening.
- Implementation evidence (2026-09-07): Slice 5 presentation implementation
  is complete; its independent implementation review is `Ready` with no
  findings and Completion Approval is automatically approved. The focused
  commit remains pending. The
  canonical MUI theme is in `src/presentation/webview/shared/muiTheme.ts`;
  the Explorer surface uses MUI cards, controls, status/tree semantics,
  VS Code tokens, 44px primary targets, stricter `:focus-visible`, and
  forced-colors styles. Host message handling, tree data/keyboard/focus, and
  view state were split into presentation-only helpers without transport or
  DTO changes. The DOM suite has 11 passing tests including axe structure,
  keyboard/tree semantics, 10,000-leaf virtualization, focus restoration,
  filter selection, computed 4.5:1/3:1 fallback contrast arithmetic,
  system-color forced-colors assertions, focus/name-role-value/status checks,
  and 200%/400%/320px responsive assertions. Static panel CSP assertions
  cover nonce-bound scripts, the existing inline-style policy, and absence of
  remote assets/eval. `pnpm run test:compile`, desktop preparation,
  production build, targeted qlty smells, and the compiled Electron runner
  (`node ./out/test/runTest.js`, exit 0) pass; the managed web Chromium
  runner remains environment-blocked before execution by its known
  `bootstrap_check_in` permission failure. Manual WCAG matrix rows requiring a
  real browser/screen reader remain reviewer/CI evidence, not claimed here.
- Full repository `qlty check --all --no-fix --no-formatters` was also run. It
  reports four unrelated baseline findings in `.github/ISSUE_TEMPLATE`,
  `CHANGELOG.md`, `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  and `src/test/suite/index.ts`; none is in the Slice 5 delta, and those files
  were intentionally left unchanged.
- Implementation boundary: no Slice 6 filter correction, application or
  transport change, Flow/table migration, dependency update, or closure-draft
  edit was made. The changed Explorer production files are qlty-smell clean
  without suppressions or threshold changes.
- Out of Scope: changing semantic facts, confirmation predicates, source or
  Flow actions, qlty refactors outside Explorer presentation, and durable docs.

### Slice 6: Prove Confirmation Filtering In A Real Explorer Session

- Status: Implementation complete; independent implementation review `Ready`
  with no findings; Completion Approval automatically approved on 2026-09-07;
  focused completion commit `6af753e7` recorded.
- Scope: verify and, only where the actual-session path requires it, correct
  `変更を絞り込む` → `確認が必要` behavior across the projected session,
  host session message, MUI filter control, tree, status, and latent selection.
  Keep canonical summary cards unchanged while the tree is filtered.
- Evidence is split into two independently asserted seams:
  - **6A host exact context/session identity:**
    `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts` and
    `src/test/suite/semanticDiffExplorerPanel.test.ts` prove that the exact
    `SemanticDiffOutputContext` object is handed to the session, the retained
    registry entry is the same context, and the emitted `session.sessionId`
    is the one used by the host message. Tests must reject a cloned/rebuilt
    context or a mismatched session ID.
  - **6B real session-message App/DOM:**
    `src/test/suite/semanticDiffExplorerDom.test.tsx` sends
    `createSemanticDiffExplorerSessionMessage` with that same session ID to
    the actual `SemanticDiffExplorerApp`, selects the localized MUI option,
    and asserts the rendered record contract rather than only row counts.
- Every rendered record row has stable test semantics: unique
  `data-row-id` occurrence ID, `data-record-kind` in
  `change|confirmation|unsupported|limitation|schedule`, and
  `data-record-id` equal to the upstream record ID. Group rows expose
  `data-row-kind="group"`; duplicate upstream IDs remain distinguishable by
  occurrence row ID. Tests query exact `(data-record-kind, data-record-id)`
  tuples.
- User / Domain Value: selecting `確認が必要` visibly removes ordinary
  confirmed leaves while retaining confirmation records and changes whose
  `confirmationLevel` is `confirmation-required`; reviewers can trust and
  reverse the filter in the same session.
- Cohesive Change Group: the panel-local filter path in
  `semanticDiffExplorerProjection.ts`, Explorer app/view/tree state in
  `semanticDiffExplorerTree.tsx`, and focused projection/DOM integration
  tests. No comparison or summary builder changes.
- Acceptance: a real `SemanticDiffOutputContext` containing ordinary changes,
  confirmation records, and confirmation-required changes is projected and
  delivered through the actual Explorer session message. After selecting the
  localized MUI filter option, ordinary leaves are absent by exact record ID,
  both confirmation categories remain, cards retain canonical counts, and
  the same session/context identity is preserved. A zero-match fixture shows
  an explicit visible MUI status/live feedback while retaining the filter
  control. Clearing the filter restores the original tree and latent
  `aria-activedescendant`/`aria-selected` selection; repeated toggles do not
  accumulate stale tree state.
- Validation: compiled projection tests for ordinary/confirmation/zero-match
  fixtures; 6A host assertions and 6B `semanticDiffExplorerDom.test.tsx`
  integration through `createSemanticDiffExplorerSessionMessage` and the
  actual app; assertions by exact row tuples, canonical card counts, status
  role/live region, active descendant, same session ID, and exact context
  identity; focused qlty and diff checks. Add a regression for the Japanese
  labels `変更を絞り込む` and `確認が必要`.
- Production Readiness: filter remains read-only and O(n) over the already
  projected tree, does not reparse/recompare/reaggregate, keeps action IDs
  scoped to the same session, and fails visibly rather than presenting stale
  ordinary rows.
- Approval Boundary: confirmation filter projection/UI behavior and exact
  integration evidence. New filters, changed summary semantics, persistence,
  or review-decision mutation replans.
- Dependencies: Slice 5 MUI controls and the completed Slice 1/2 projection
  and session contracts.
- Risks: cards appearing unchanged may mask a correct tree filter, stale
  `viewModel.filter` state may rehydrate ordinary rows, latent selection may
  select an invisible row, and a zero-match view may look like loading. Exact
  record-level DOM assertions and visible status feedback are the gate.
- Out of Scope: qlty decomposition of the large application validators (Slice
  7), report/source/Flow actions, and durable docs.

#### Slice 6 Implementation Evidence (2026-09-07)

- 6A host evidence is covered by `semanticDiffExplorerPanel.test.ts`: the
  retained registry entry, session, result, and summary all retain the exact
  `SemanticDiffOutputContext` object, and the emitted session message uses the
  same session ID with a structurally identical view model.
- 6B actual-session evidence is covered by `semanticDiffExplorerDom.test.tsx`:
  `createSemanticDiffExplorerSessionMessage` is delivered to the real
  `SemanticDiffExplorerApp`, exact `(data-record-kind,data-record-id,
data-row-id)` tuples prove ordinary-leaf removal and retention of both
  confirmation categories, cards remain canonical, zero-match status is
  visible, and latent selection is restored after clearing the filter.
- The Explorer tree now exposes `data-row-kind="group"` on groups and stable
  `data-record-kind`/`data-record-id` attributes on leaves; these are test
  hooks and do not change accessibility semantics or transport contracts.
- `rtk pnpm run test:compile`, `rtk pnpm run test:prepare:desktop`,
  `rtk pnpm run test:prepare:web`, `rtk node ./out/test/runTest.js`, focused
  `qlty check --no-fix --no-formatters`, formatter checks, and `rtk git diff
--check` pass. Focused `qlty smells` still reports only the pre-existing
  projection/panel complexity baseline assigned to later Slice 7/11 work;
  no suppression or threshold change was introduced.
- Review follow-up: the zero-match assertion now targets the explicit
  `p[role="status"]`; it no longer relies on an ambiguous `status` role that
  can also match MUI summary output elements. Runtime and design are unchanged.
- Real Chromium smoke remains `blocked-before-execution` by the known managed
  host `bootstrap_check_in ... Permission denied (1100)` condition. No browser
  pass is claimed; desktop smoke and both bundles pass.
- Implementation feedback: exact record tuples are required because unchanged
  summary cards are intentionally canonical and can make a correct tree filter
  appear ineffective. The existing projection predicate was correct; the
  missing proof was the actual App/session-message path and record-level DOM
  evidence, not a comparison-rule defect. The session/context identity
  assertions also keep the proof from silently falling back to a rebuilt
  fixture.
- Remaining risk: the independent reviewer must confirm the approved-path
  interpretation of the presentation tree attribute additions and retain the
  qlty smell findings for the planned application/host decomposition slices.

### Slice 7: Decompose Explorer Application Projection And Transport

- Status: Implementation complete; independently reviewed `Ready` with no
  findings. Completion Approval was automatically approved on 2026-09-07;
  Slice 7 is eligible for its focused completion commit, which remains
  pending through the approval-committer gate.
- Scope: eliminate qlty smells in `semanticDiffExplorerMessages.ts`,
  `semanticDiffExplorerProjection.ts`, and
  `semanticDiffRecordOccurrence.ts` through cohesive table-driven guards,
  small closed-union decoders, record-occurrence helpers, and action/leaf
  builders. Preserve every exact key/nullability/brand/payload limit and the
  filter behavior proven by Slice 6.
- User / Domain Value: application contracts remain easier to audit and less
  likely to drift while exposing the same immutable semantic facts.
- Cohesive Change Group: application projection/transport/occurrence helpers
  and their pure tests; no host or UI framework imports.
- Acceptance: `qlty smells` reports no function/file complexity, boolean,
  return-count, parameter-count, nested-control-flow, or duplication finding
  in the touched application files. All closed unions reject the same
  malformed, extra-key, wrong-session, non-finite, and oversized payloads;
  target-side/reason mappings, deterministic order, duplicate records, and
  zero/confirmation filtering remain byte-for-byte behavior compatible.
- Validation: existing focused message/projection suites plus exact malformed
  matrix and property/determinism tests; `rtk pnpm run test:compile`, focused
  compiled Mocha, `rtk pnpm run qlty:smells`, `rtk pnpm run qlty:check`,
  `rtk pnpm run build`, and `rtk git diff --check`.
- Production Readiness: no localized comparator or host-content leakage,
  no new allocation of semantic IDs, linear/linearithmic projection behavior,
  and validation before state mutation.
- Approval Boundary: only application projection/transport/occurrence
  refactoring and tests. Any contract, schema, summary, comparison, or UI
  behavior change replans.
- Dependencies: Slices 5-6 for preserved UI/filter evidence; completed
  Slice 1 contracts and predecessor DTOs.
- Risks: table-driven validation may accidentally widen a closed union, action
  lookup may lose duplicate occurrence identity, and filter refactoring may
  reaggregate cards. Existing contract tests and Slice 6 exact DOM evidence
  are required.
- Out of Scope: source capture/parser, host lifecycle, Flow graph/document,
  MUI styling, and durable docs.

#### Slice 7 Implementation Evidence (2026-09-07)

- The application projection and transport paths were decomposed into cohesive
  browser-safe helpers: strict message primitives/validation/parsers and
  record/leaf/view guards, projection support/paths/tree/leaves, and the
  existing occurrence module. The public `semanticDiffExplorerMessages.ts`,
  `semanticDiffExplorerProjection.ts`, and `semanticDiffRecordOccurrence.ts`
  entry points retain their existing exports.
- Exact message keys, closed unions, branded IDs, nullable payload/error
  pairing, wrong-session/action/stale-request rejection, JSON/dense-array
  checks, and the fixed 8 MiB UTF-8 boundary remain unchanged. Summary cards
  still read only `context.summary`; tree order, source-order duplicate
  ordinals, target-side/reason mappings, action availability, and the
  panel-local confirmation filter remain unchanged. No DTO, comparison,
  summary, host, UI, parser, Flow, or configuration contract changed.
- Focused compiled Mocha coverage passed: message strict/malformed/8 MiB
  tests, projection deterministic/duplicate/filter tests, actual-session DOM
  and accessibility tests, and Flow/occurrence regression tests (42 passing).
  The review finding for prototype-looking dispatch keys is covered by
  regressions proving target/card/message/leaf/path/side lookups fail closed
  without throwing for `toString`, `constructor`, and `__proto__`; all
  extracted dispatch tables now use `Map` lookups, and relation-side indexing
  validates the closed `before`/`after` union before property access.
  `rtk pnpm run test:compile`, `rtk pnpm run test:prepare:desktop`,
  `rtk pnpm run test:prepare:web`, `rtk pnpm run build`, compiled Electron
  smoke (`node ./out/test/runTest.js`, exit 0), and `rtk git diff --check`
  passed. Targeted `qlty smells --no-snippets` is clean across all 13 changed
  application paths, and `qlty check --no-fix --no-formatters` reports no
  issues; no suppression, allowlist, threshold, or generated-ignore change
  was made.
- Web Chromium smoke was attempted after web preparation but remains
  `blocked-before-execution` by the managed host's
  `bootstrap_check_in ... Permission denied (1100)` failure. No browser-smoke
  pass is claimed; desktop smoke, web preparation/build, DOM/axe evidence, and
  strict transport tests provide the available alternatives.
- Implementation feedback: splitting transport guards from projection
  builders keeps each closed-union validator auditable while preserving exact
  malformed-payload behavior. Source-order occurrence assignment remains
  before presentation sorting, and host lookup remains a linear filter over
  the retained source records.
- Remaining risk: Slice 8 source/parser extraction must preserve same-pass
  capture, parser compatibility, and source-index ownership. Slices 9-13
  remain blocked.

#### Slice 7 Completion Gate (2026-09-07)

- Independent implementation review: `Ready`; no findings.
- Completion Approval: automatically approved on 2026-09-07 under the
  explicit automatic-approval policy. This gate approves only the Slice 7
  application projection/transport/occurrence scope; aggregate final approval
  remains pending until all approved slices and Feature Exit are complete.
- Focused completion-commit package (exact current paths):
  - Feature traceability: `docs/specs/features/semantic-diff-explorer/TASKS.md`
    and `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`.
  - Production: `src/application/semantic-diff/semanticDiffExplorerMessages.ts`,
    `src/application/semantic-diff/semanticDiffExplorerProjection.ts`,
    `src/application/semantic-diff/semanticDiffRecordOccurrence.ts`, and the
    new `semanticDiffExplorerLeafGuards.ts`,
    `semanticDiffExplorerMessageParsers.ts`,
    `semanticDiffExplorerMessagePrimitives.ts`,
    `semanticDiffExplorerMessageValidation.ts`,
    `semanticDiffExplorerProjectionLeaves.ts`,
    `semanticDiffExplorerProjectionPaths.ts`,
    `semanticDiffExplorerProjectionSupport.ts`,
    `semanticDiffExplorerProjectionTree.ts`,
    `semanticDiffExplorerRecordGuards.ts`, and
    `semanticDiffExplorerViewGuards.ts`.
  - Tests: `src/test/suite/semanticDiffExplorerMessages.test.ts` and
    `src/test/suite/semanticDiffExplorerProjection.test.ts`.
- Commit status: focused completion commit
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484` is recorded; no staging or
  commit is performed by the implementer. Closure drafts and Feature Exit
  artifacts are excluded; Slice 8 activation is recorded below and Slices
  9-13 remain blocked.

### Slice 8: Simplify Source Capture And Parser Locator Boundaries

- Status: Implementation-approved; active after Slice 7A completion commit
  `c9b97b0d`.
- Scope: remove qlty smells from `AjsParserWithSourceIndexPort.ts`,
  `semanticDiffSourceCapture.ts`, `AntlrAjsParser.ts`, and
  `buildSemanticDiffReportData.ts` by extracting closed validators, explicit
  capture state transitions, target-kind lookup strategies, token-range
  mapping helpers, and report-data side steps. Preserve the existing
  enriched-parser result, same-pass capture, binding, ownership, and
  `AjsParserPort.parse(content)` compatibility contracts.
- User / Domain Value: exact source navigation remains safe while parser and
  capture lifecycle code is reviewable and maintainable.
- Cohesive Change Group: application source-index/capture contracts, parser
  infrastructure adapter, report-data composition seam, and existing parser/
  capture tests.
- Acceptance: `qlty smells` is clear for the touched source/parser files;
  before/after still parse exactly once in fixed order, both parser errors are
  preserved, exact context binding and unregister-before-release ownership are
  unchanged, lookup remains strict/UTF-16/CRLF/duplicate-safe, and no parser,
  URI, TextDocument, snapshot, or Node type crosses the application boundary.
- Validation: all Slice 3 parser/source/capture/command suites, malformed and
  stale revalidation matrices, architecture dependency tests, desktop/web
  builds, `rtk pnpm run qlty:smells`, `rtk pnpm run qlty:check`, and diff
  checks. No action-time parse or global last-parse cache regression.
- Production Readiness: parser performance remains one enriched pass per
  side, source snapshots remain bounded/immutable, rollback/idempotent release
  paths are explicit, and malformed JP1/AJS input fails closed.
- Approval Boundary: application source-index/capture and parser/report-data
  refactoring only. Any normalized-domain, grammar, encoding policy, or
  workflow source-selection change replans.
- Dependencies: completed Slice 3 and Slice 7's shared occurrence helpers.
- Risks: state-machine helpers can accept an invalid transition, token range
  fallback can select a wrong unit, and report-data extraction can alter error
  ordering. Existing identity/range/capture call-count tests are the gate.
- Out of Scope: panel/UI, Flow, comparison semantics, WebAPI/Git sources, and
  durable docs.

### Slice 8 Implementation Evidence (2026-09-07)

- The four approved entry points are refactored without changing their public
  contracts. Source-index validation, lookup, freezing, capture guards,
  capture registry, and capture state transitions now live in cohesive
  application helpers; parser range construction is split into small
  infrastructure helpers; report-data parsing keeps the existing fixed
  before-then-after error ordering.
- The enriched parser still performs one raw ANTLR pass per side and returns
  the normalized document plus browser-safe index. Capture still rejects
  wrong-order, mismatched, extra, and post-release calls; continues after a
  parser error; binds the exact context; and unregisters borrowed bindings
  before releasing owned indexes and snapshots. UTF-16/CRLF/Unicode,
  duplicate-unit, duplicate-parameter, malformed, and `AjsParserPort.parse`
  compatibility behavior remain covered by the existing suites.
- Validation passed `pnpm run test:compile`, the compiled desktop suite
  (`pnpm run test:prepare:desktop` and `node ./out/test/runTest.js`, exit 0),
  web preparation, production desktop/web build, `qlty check
--no-fix --no-formatters`, targeted `qlty smells --no-snippets` for every
  Slice 8 entry point and helper (zero findings), and `git diff --check`.
  No qlty suppression, allowlist, threshold, generated-ignore, or
  configuration change was introduced.
- No parser, grammar, domain, URI, `TextDocument`, snapshot, Flow, workflow,
  report-schema, or UI behavior was added. Browser smoke is not claimed for
  this parser/application slice; existing managed Chromium host limitations
  remain an environment-only risk for the broader feature.
- Status: implementation complete; independent implementation review is
  `Ready` with no findings; Completion Approval was automatically approved on
  2026-09-07. The focused completion commit is eligible and pending; no
  commit was created by the implementer.
- Review follow-up: the repository formatter was applied only to the exact ten
  Slice 8 runtime files assigned by review (four source-index helpers, the
  capture facade and four capture helpers, and `AntlrAjsParser.ts`). The diff
  is formatter-only; no source, test, DTO, lifecycle, or configuration
  behavior changed. Final targeted smells are zero, full `qlty check` is
  clean, and desktop/web preparation, build, compile, smoke, Markdown lint,
  and diff checks remain passing.

### Slice 7A Implementation Approval — Completed

- Status: Approved; implementation complete, independently reviewed `Ready`
  with no findings, automatically completion-approved, and focused-committed
- Approved at: 2026-09-07 under the existing user MUI Semantic Explorer,
  WCAG 2.2, qlty-smell, and confirmation-filter approval/proceed-through-
  slices policy, as a narrow reconciliation required by the plan-review
  finding.
- Trigger: full `rtk pnpm run qlty:check` after the committed Slice 7
  implementation reported exactly 14 committed Slice 7 files as unformatted
  by `prettier:fmt`. Slice 8 activation was held until this gate was resolved.
- Approved scope: formatter-only reconciliation of the exact 14 paths below.
  Formatting must be mechanical and behavior-neutral; no runtime, test
  assertion, export, DTO/message, parser, host, UI, architecture, qlty
  policy, or configuration change is authorized.
- Exact approved paths:
  `src/application/semantic-diff/semanticDiffExplorerLeafGuards.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessageParsers.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessagePrimitives.ts`,
  `src/application/semantic-diff/semanticDiffExplorerMessages.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjection.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionLeaves.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionPaths.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionSupport.ts`,
  `src/application/semantic-diff/semanticDiffExplorerProjectionTree.ts`,
  `src/application/semantic-diff/semanticDiffExplorerRecordGuards.ts`,
  `src/application/semantic-diff/semanticDiffRecordOccurrence.ts`,
  `src/application/semantic-diff/semanticDiffExplorerViewGuards.ts`,
  `src/test/suite/semanticDiffExplorerMessages.test.ts`, and
  `src/test/suite/semanticDiffExplorerProjection.test.ts`.
- Required evidence: diff review proves only formatter/mechanical changes on
  these committed Slice 7 paths; full `rtk pnpm run qlty:check` passes;
  targeted `qlty smells` and the Slice 7 message/projection/DOM/Flow tests
  remain passing. No suppression, exclusion, threshold, generated-ignore, or
  qlty configuration change is permitted.
- Gate result: Slice 7 completion commit
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484` is present, and its independent
  review/automatic Completion Approval remain recorded. The Slice 7A replan
  had independent plan review `Ready` with no findings and Human Approval.
  The formatter-only implementation review was `Ready` with no findings,
  Completion Approval was automatic, and focused completion commit `c9b97b0d`
  is recorded. Slice 8 may now activate; Slices 9-13 remain blocked and
  closure drafts stay excluded.

### Narrow Slice 7A Replan Human Approval — Focused Committed

- Status: Human Approved; focused replan commit and Slice 7A completion
  committed
- Approved at: 2026-09-07
- Final independent plan-review verdict: `Ready` with no findings.
- Human Approval evidence: the trusted user messages `承認します。` and
  `継続して。` approve this narrow mechanical replan under the existing
  proceed-through-slices policy.
- Approved scope: only the formatter-only Slice 7A scope and its exact 14
  committed Slice 7 paths already listed above. No behavior, implementation,
  test assertion, DTO/message, qlty policy, suppression, exclusion, threshold,
  generated-ignore, or configuration change is approved.
- Exact approved replan commit paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md` only.
- Commit status: focused docs-only replan commit `aa13b73e` and focused Slice
  7A completion commit `c9b97b0d` are present. The six closure drafts remain
  excluded and untouched; no staging or commit is performed here.
- Next route: Main delegates exactly active Slice 8 to `implementer`.

### Slice 7A Implementation Evidence (2026-09-07)

- `qlty fmt` was run against exactly the 14 approved Slice 7 application/test
  paths listed above. Diff inspection found only mechanical formatter changes:
  import grouping, line wrapping, trailing commas, and equivalent
  parenthesization. No behavior, assertion, export, DTO/message/schema, or
  qlty policy/configuration change was made.
- Validation passed: full `qlty check --no-fix --no-formatters`, targeted
  `qlty smells --no-snippets` across the 14 paths, `rtk pnpm run test:compile`,
  production desktop/web `rtk pnpm run build`, the focused messages/
  projection/DOM/Flow suites (42 passing), compiled desktop smoke
  (`node ./out/test/runTest.js`, exit 0), `rtk git diff --check`, and
  `rtk pnpm run lint:md`.
- Production/build output retains the existing bundle-size warnings only.
  The six closure drafts remain untouched; Slice 8 is now eligible to activate,
  and Slices 9-13 remain blocked.
- Status: implementation complete; independent implementation review is
  `Ready` with no findings; Completion Approval was automatic and focused
  completion commit `c9b97b0d` is recorded.

### Slice 7A Completion Gate (2026-09-07)

- Independent implementation review: `Ready`; no findings.
- Completion Approval: automatically approved on 2026-09-07 under the
  approved proceed-through-slices policy.
- AST semantic-equivalence evidence: TypeScript AST fingerprints matched before
  and after formatter output for all 14 implementation/test paths. The
  comparison ignored source positions, trivia, formatter-only parentheses, and
  trailing-comma metadata while retaining node kinds, semantic child order,
  literal text, identifier names, and relevant type-only/multiline flags.
- Full `rtk pnpm run qlty:check` passed with no issues; targeted smells,
  focused tests, compilation, desktop/web builds, smoke, diff, and Markdown
  lint evidence remain passing as recorded above.
- Exact completion commit paths (16):
  `docs/specs/features/semantic-diff-explorer/TASKS.md`;
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`;
  `src/application/semantic-diff/semanticDiffExplorerLeafGuards.ts`;
  `src/application/semantic-diff/semanticDiffExplorerMessageParsers.ts`;
  `src/application/semantic-diff/semanticDiffExplorerMessagePrimitives.ts`;
  `src/application/semantic-diff/semanticDiffExplorerMessages.ts`;
  `src/application/semantic-diff/semanticDiffExplorerProjection.ts`;
  `src/application/semantic-diff/semanticDiffExplorerProjectionLeaves.ts`;
  `src/application/semantic-diff/semanticDiffExplorerProjectionPaths.ts`;
  `src/application/semantic-diff/semanticDiffExplorerProjectionSupport.ts`;
  `src/application/semantic-diff/semanticDiffExplorerProjectionTree.ts`;
  `src/application/semantic-diff/semanticDiffExplorerRecordGuards.ts`;
  `src/application/semantic-diff/semanticDiffRecordOccurrence.ts`;
  `src/application/semantic-diff/semanticDiffExplorerViewGuards.ts`;
  `src/test/suite/semanticDiffExplorerMessages.test.ts`;
  `src/test/suite/semanticDiffExplorerProjection.test.ts`.
- Commit status: focused completion commit `c9b97b0d` is recorded; this
  documentation update does not stage or commit any path.
- Scope exclusions remain explicit: the six closure drafts are excluded and
  untouched; Slice 8 completion is recorded, Slice 9 is complete, and Slice
  10 is now the active next slice; Slices 11-13 remain blocked; aggregate
  approval and Feature Exit
  remain pending.

### Slice 8 Implementation Approval — Completed

- Status: Approved; implementation complete; independent review `Ready` with
  no findings; Completion Approval automatically approved; focused completion
  commit `792842b9d82dfa728f7742fc1ea1fb11e4623bc9` recorded
- Approved at: 2026-09-07 under the user's explicit MUI Semantic Explorer,
  WCAG 2.2 coverage, qlty-smell remediation, and confirmation-required filter
  verification request, using the existing proceed-through-slices policy.
- Approved scope: Slice 8 — Simplify Source Capture And Parser Locator
  Boundaries, exactly as specified above. Preserve the enriched-parser result,
  same-pass before/after capture, exact context binding, unregister-before-
  release ownership, strict UTF-16/CRLF/Unicode/duplicate/malformed lookup,
  parser errors and ordering, browser-safe DTOs, and the compatible
  `AjsParserPort.parse(content)` seam. No grammar, normalized-domain,
  comparison, source-selection, report-schema, UI, Flow, or workflow change is
  authorized.
- Approved paths: `src/application/parsing/AjsParserWithSourceIndexPort.ts`,
  `src/application/semantic-diff/semanticDiffSourceCapture.ts`,
  `src/infrastructure/parser/AntlrAjsParser.ts`,
  `src/application/semantic-diff/buildSemanticDiffReportData.ts`, and the
  focused existing tests `src/test/suite/semanticDiffSourceCapture.test.ts`,
  `src/test/suite/AntlrAjsParser.test.ts`,
  `src/test/suite/buildSemanticDiffReportData.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`. No host, webview,
  Flow, command, configuration, or durable-document paths are approved.
- Qlty boundary: resolve only the assigned baseline findings without
  suppression, allowlisting, threshold relaxation, generated-ignore edits, or
  qlty configuration changes. The exact assignment is
  `AjsParserWithSourceIndexPort.ts`: `manyReturns=3`,
  `functionComplexity=4`, `totalComplexity=1`, `complexBinary=4`;
  `semanticDiffSourceCapture.ts`: `manyReturns=3`,
  `functionComplexity=4`, `totalComplexity=1`, `complexBinary=2`;
  `AntlrAjsParser.ts`: `functionComplexity=1`; and
  `buildSemanticDiffReportData.ts`: `functionComplexity=1`.
- Gate result: Slice 7 completion commit
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484` and Slice 7A completion commit
  `c9b97b0d` are present; Slice 7A has independent `Ready`/no-findings review
  and automatic Completion Approval. Slice 8 implementation is complete and
  its independent review is `Ready` with no findings; the automatic
  Completion Approval is recorded in the gate below.
- Next route (historical): Main delegated Slice 9. That slice is now complete
  and focused-committed; the Slice 9A formatter-only replan is the current
  active route and Slice 10 is held. Slices 11-13 remain blocked and closure
  drafts remain excluded.

### Slice 8 Completion Gate (2026-09-07)

- Independent implementation review: `Ready`; no findings.
- Completion Approval: automatically approved on 2026-09-07 under the
  explicit automatic-approval policy because the independent implementation
  review returned `Ready` with no findings.
- Exact completion paths (15):
  `docs/specs/features/semantic-diff-explorer/TASKS.md`;
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`;
  `src/application/parsing/AjsParserWithSourceIndexPort.ts`;
  `src/application/semantic-diff/buildSemanticDiffReportData.ts`;
  `src/application/semantic-diff/semanticDiffSourceCapture.ts`;
  `src/infrastructure/parser/AntlrAjsParser.ts`;
  `src/application/parsing/semanticDiffSourceIndexGuards.ts`;
  `src/application/parsing/semanticDiffSourceIndexLookup.ts`;
  `src/application/parsing/semanticDiffSourceIndexPrimitives.ts`;
  `src/application/parsing/semanticDiffSourceIndexRequestGuards.ts`;
  `src/application/parsing/semanticDiffSourceIndexValueGuards.ts`;
  `src/application/semantic-diff/semanticDiffSourceCaptureGuards.ts`;
  `src/application/semantic-diff/semanticDiffSourceCaptureParsing.ts`;
  `src/application/semantic-diff/semanticDiffSourceCaptureRegistry.ts`;
  `src/application/semantic-diff/semanticDiffSourceCaptureScope.ts`.
- Validation: full `qlty check` passed with no issues; targeted
  `qlty smells --no-snippets` across all Slice 8 production paths returned no
  findings; `pnpm run lint:md` passed with zero errors; and `git diff --check`
  passed. The existing compile, desktop suite, web preparation, and desktop/
  web build evidence remains passing.
- Completion commit status: focused completion commit
  `792842b9d82dfa728f7742fc1ea1fb11e4623bc9` is recorded; no staging or
  commit was performed by this documentation update.
- Scope exclusions: the six closure drafts remain excluded and untouched:
  `CHANGELOG.md`, `README.en.md`, `README.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, and
  `docs/specs/roadmap.md`.
- Slice 9 was the next implementation-approved slice and is now complete;
  Slice 9A is the sole active narrow replan with final plan review `Ready` and
  Human Approval recorded on 2026-09-08. Its focused docs-only replan commit
  is eligible and pending; Slice 10 is held. Slices 11-13 remain planned and
  dependency-blocked.
  Aggregate human approval, Feature
  Exit, and Closure Approval remain pending until all approved slices are
  complete and committed.

### Slice 9: Simplify Flow Graph Construction And Highlight Projection

- Status: Implementation complete; independently reviewed `Ready` with no
  findings, automatically completion-approved, and focused-committed as
  `52166c1aef52dca4510bf6e374ba0923317c7135` after Slice 8 completion commit
  `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`.
- Scope: resolve qlty smells in `buildExpandedFlowGraph.ts`,
  `buildFlowGraph.ts`, `buildFlowGraphCore.ts`, and
  `buildSemanticDiffFlowHighlights.ts` using traversal contexts, small
  relation/node projection helpers, and explicit option objects. Preserve
  formal edge IDs, occurrence ordinals, expanded/nested graph ordering, target
  side mapping, duplicate highlighting, and normal Flow graph output.
- User / Domain Value: Flow focus/highlight remains correct and the existing
  graph foundation is easier to verify without a second renderer.
- Cohesive Change Group: application graph builders/highlight projection and
  their focused graph/use-case/highlight tests.
- Acceptance: qlty reports no smell findings for the graph/highlight files;
  all existing node/edge IDs, relation order, expanded graph boundaries,
  canonical-pair duplicate mapping, and semantic state precedence are stable.
  No new Flow message or renderer is introduced.
- Validation: compiled graph, expanded-graph, highlight, and Explorer Flow
  suites; representative large/nested graphs; existing golden comparison with
  its documented baseline distinction; `rtk pnpm run qlty:smells`, qlty check,
  build, desktop/web preparation, and diff checks.
- Production Readiness: no quadratic relation lookup or per-selection graph
  rebuild, bounded nested traversal, deterministic output, and unchanged
  ordinary Flow behavior without a diff overlay.
- Approval Boundary: graph builders and semantic highlight projection only.
  Overlay wire/document validation, host lifecycle, and renderer changes are
  separate slices.
- Dependencies: Slice 8 and completed Slice 4 graph contracts.
- Risks: helper extraction may change deterministic ordering or duplicate
  ordinal assignment; graph golden, ID, and large-fixture tests are required.
- Out of Scope: overlay transport/document validation, Flow host adapters,
  MUI webview presentation, and durable docs.

### Slice 9 Implementation Approval — Completed

- Status: Approved; implementation complete, independently reviewed `Ready`
  with no findings, automatically completion-approved, and focused-committed
  as `52166c1aef52dca4510bf6e374ba0923317c7135`
- Approved at: 2026-09-07 under the user's explicit MUI Semantic Explorer,
  WCAG 2.2 coverage, qlty-smell remediation, and confirmation-required filter
  verification request, using the existing proceed-through-slices policy.
- Approved scope: Slice 9 — Simplify Flow Graph Construction And Highlight
  Projection, exactly as specified above. Preserve formal Flow node/edge IDs,
  duplicate occurrence ordinals, deterministic expanded/nested ordering,
  side-specific target mapping, canonical-pair highlight mapping, relation
  edge non-focusability, large-graph bounds, and ordinary Flow output. No new
  Flow message, renderer, overlay wire, document validation, host lifecycle,
  or UI behavior is authorized.
- Approved paths: `src/application/flow-graph/buildExpandedFlowGraph.ts`,
  `src/application/flow-graph/buildFlowGraph.ts`,
  `src/application/flow-graph/buildFlowGraphCore.ts`,
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`, and the
  focused existing tests `src/test/suite/buildExpandedFlowGraph.test.ts`,
  `src/test/suite/buildExpandedFlowGraphUseCase.test.ts`,
  `src/test/suite/buildFlowGraph.test.ts`,
  `src/test/suite/buildFlowGraphUseCase.test.ts`, and
  `src/test/suite/semanticDiffFlowHighlights.test.ts`. No overlay/document,
  host/wiring, webview, configuration, or durable-document paths are approved.
- Qlty boundary: resolve only the assigned baseline findings through cohesive
  extraction; no suppression, allowlisting, threshold relaxation,
  generated-ignore edit, or qlty configuration change. Exact baseline
  assignments are `buildExpandedFlowGraph.ts`: `manyParameters=1`,
  `functionComplexity=6`, `totalComplexity=1`; `buildFlowGraph.ts`:
  `functionComplexity=2`; `buildFlowGraphCore.ts`: no baseline smell finding
  (zero assigned findings); and `buildSemanticDiffFlowHighlights.ts`:
  `manyParameters=2`, `functionComplexity=3`. Other rule families are zero
  for these files in the recorded baseline.
- Gate condition: Slice 8 completion commit
  `792842b9d82dfa728f7742fc1ea1fb11e4623bc9` is present and Slice 8 has
  independent review `Ready` with no findings and automatic Completion
  Approval. Slice 9's independent implementation review returned `Ready` with
  no findings, so Completion Approval was automatic under the recorded
  proceed-through-slices policy. Slice 10 may now activate.
- Next route: Main delegates exactly Slice 10 to `implementer`. Slices 11-13
  remain blocked until Slice 10 is complete, independently reviewed, and
  focused-committed; closure drafts remain excluded.

### Slice 9 Implementation Evidence (2026-09-08)

- Status: Implementation complete; independent implementation review is
  `Ready` with no findings; Completion Approval was automatic; focused
  completion commit `52166c1aef52dca4510bf6e374ba0923317c7135` is recorded.
- The four approved Flow application paths were refactored with explicit
  traversal/constraint contexts, node/edge append helpers, scope validation
  helpers, and side-specific highlight projection helpers. Public contracts,
  formal node/edge IDs, duplicate relation ordinals, canonical-pair mapping,
  relation-edge non-focusability, confirmation precedence, deterministic
  nested ordering, bounded traversal, and ordinary Flow output remain fixed.
- Targeted `qlty smells --no-snippets` over all four approved production
  paths returned zero findings. No suppression, allowlist, threshold,
  generated-ignore, or qlty configuration change was made. The approved
  production paths were formatted and `git diff --check` passed.
- `pnpm run test:compile`, desktop test preparation, the compiled desktop
  runner (`node ./out/test/runTest.js`, exit 0), web test preparation, and the
  production desktop/web build passed. Existing bundle-size warnings are
  unchanged. Direct browser smoke was not claimed.
- The focused graph/highlight tests are included in the passing desktop
  runner. A standalone raw-Node attempt that bypassed the VS Code runner
  remains unsuitable as gate evidence because the repository's parser uses
  its existing build-time `DEVELOPMENT` and `@generate/parser/*` setup; no
  source or test workaround was added.
- Compatibility impact is none by design: VS Code `^1.75.0`, desktop/web
  composition, application-layer boundaries, browser-safe contracts, and
  telemetry behavior remain unchanged. Overlay/document validation, host
  lifecycle, renderer, UI, and durable closure drafts were not touched.
- Review package: the independent implementation reviewer inspected the four
  approved Flow files and the existing graph, expanded-graph, use-case, and
  highlight suites, verifying ID/order and canonical-pair duplicate behavior
  against Slice 4 contracts. The review returned `Ready` with no findings;
  Completion Approval was automatic under the recorded policy.

### Slice 9 Completion Gate (2026-09-08)

- Independent implementation review: `Ready`; no findings.
- Completion Approval: automatically approved on 2026-09-08 under the
  explicit automatic-approval policy because the independent implementation
  review returned `Ready` with no findings.
- Exact focused completion paths (5):
  `docs/specs/features/semantic-diff-explorer/TASKS.md`;
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`;
  `src/application/flow-graph/buildExpandedFlowGraph.ts`;
  `src/application/flow-graph/buildFlowGraph.ts`; and
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`.
- `buildFlowGraphCore.ts` and all focused tests are unchanged because the
  review found no required changes to their contracts or assertions.
- Targeted `qlty smells --no-snippets` returned zero findings. Validation
  passed TypeScript compilation, focused graph/highlight and normal Flow
  coverage through the desktop runner, desktop/web preparation, production
  desktop/web builds, full `qlty check`, Markdown lint, and `git diff --check`.
  Existing bundle-size warnings are unchanged; browser smoke remains
  unclaimed.
- Completion status: focused completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135` is present; this documentation
  update does not stage or commit any path.
- Scope exclusions: the six closure drafts remain excluded and untouched:
  `CHANGELOG.md`, `README.en.md`, `README.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, and
  `docs/specs/roadmap.md`.
- Slice 9A is now the sole active narrow replan, with final independent plan
  review `Ready` and Human Approval recorded on 2026-09-08. Its focused
  docs-only replan commit is eligible and pending. Slice 10 is held until
  Slice 9A completes and is focused-committed;
  Slices 11-13 remain blocked until their predecessors complete and are
  focused-committed;
  aggregate human approval, Feature Exit, and Closure Approval remain
  pending until all approved slices are complete and committed.

### Slice 9A: Reconcile Slice 9 Flow Highlight Formatting

- Status: Human Approved; final independent plan review is `Ready` with no
  findings; focused docs-only replan commit is eligible and pending. No
  implementation, formatting, staging, or runtime commit is authorized yet.
- Approved at: 2026-09-08 under the trusted user messages `承認します。` and
  `継続して。`, using the existing proceed-through-slices policy.
- Exact approved replan paths: `docs/specs/features/semantic-diff-explorer/TASKS.md`
  and `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md` only.
- Trigger: the full `rtk pnpm run qlty:check` after Slice 9's focused commit
  `52166c1aef52dca4510bf6e374ba0923317c7135` reports the exact committed
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
  unformatted. Slice 10 is held until this formatter gate is complete.
- Scope: formatter-only reconciliation of exactly
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` using the
  repository formatter. No runtime behavior, tests, exports, DTO/message
  schema, Flow ID/order/highlight logic, qlty policy, suppression,
  allowlist, threshold, generated-ignore, configuration, or slice-order
  change is authorized.
- User / Domain Value: the already completed Slice 9 has a clean repository
  formatting gate without reopening its graph/highlight design or behavior.
- Cohesive Change Group: one committed Flow-highlight application file and
  its existing graph/highlight validation surface; no test file is edited.
- Acceptance: diff inspection proves mechanical formatter output only; an AST
  comparison proves semantic equivalence while ignoring source positions,
  trivia, formatter-only parentheses, and trailing-comma metadata; targeted
  qlty smells are clean; focused graph/highlight and normal Flow tests pass;
  and the full `rtk pnpm run qlty:check` passes with formatters enabled.
- Validation: formatter-only diff review, AST semantic-equivalence evidence,
  `rtk pnpm run qlty:smells` for the exact path, the existing compiled graph,
  expanded-graph, use-case, highlight, and normal Flow suites, full
  `rtk pnpm run qlty:check`, `rtk git diff --check`, and relevant compile/
  desktop-web preparation checks. No browser-smoke claim is added.
- Production Readiness: the formatter must not alter formal IDs, occurrence
  ordinals, side mapping, relation-edge non-focusability, deterministic
  ordering, ordinary Flow output, desktop/web composition, or VS Code
  `^1.75.0` compatibility. The focused commit must contain only the exact
  formatter output plus the approved plan documents.
- Approval Boundary: exactly the one committed Flow-highlight source path for
  formatter output; existing tests are validation-only. Slice 10 application
  overlay/document/message paths, host lifecycle, renderer, UI, configuration,
  and closure drafts are outside this replan.
- Dependencies: Slice 9 completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135`; Slice 10 remains held until
  Slice 9A is independently reviewed, approved, implemented, reviewed, and
  focused-committed. The six closure drafts remain excluded and untouched.
- Risks: a formatter-only diff could accidentally change grouping,
  parenthesization, or literal text; AST equivalence and targeted graph/
  highlight regressions are mandatory. A remaining full-qlty finding blocks
  Slice 10 and must not be hidden by configuration.
- Out of Scope: all other runtime/test files, graph/highlight behavior,
  overlay/document validation, host/wiring, MUI presentation, configuration,
  suppression/allowlisting, and durable closure documents.

### Slice 10: Simplify Flow Overlay, Document Validation, And Viewer Messages

- Status: Previously approved but held; blocked by the Slice 9A replan until
  its formatter-only gate is reviewed, approved, and focused-committed.
- Scope: resolve qlty smells in `buildSemanticDiffFlowOverlay.ts`,
  `flowGraphDocument.ts`, `unitListDocument.ts`, and
  `viewerHostMessages.ts` by splitting exact-key readers, overlay membership
  validation, relation expansion, base-document clearing, and closed viewer
  message parsing. Preserve `{ type: "changeDocument", data }`,
  `{ type: "revealUnit", data }`, ready/onReady, null/absent overlay
  semantics, and atomic rejection.
- User / Domain Value: Flow overlays remain state-only and fail closed without
  corrupting an ordinary viewer document.
- Cohesive Change Group: application Flow document/overlay validators and the
  existing viewer transport tests.
- Acceptance: qlty is clear for the touched validator/overlay files; exact
  keys, actual graph node/edge membership, cross-kind rejection, stale/missing
  record errors, overlay replacement/clear semantics, and existing normal
  viewer message compatibility remain unchanged.
- Validation: overlay/document/viewer-host-message suites, malformed/extra-key/
  cross-kind/oversized tests, normal Flow goldens, desktop/web build and smoke
  preparation, qlty smells/check, and diff checks.
- Production Readiness: validate before mutation, no reason/detail wire fields,
  no new Flow response variant, bounded overlay serialization, and safe base
  restore under late/failed operations.
- Approval Boundary: Flow overlay/document/viewer message application code and
  tests only. Host ownership and Flow UI are separate.
- Dependencies: Slice 9 and Slice 4 overlay contract.
- Risks: validator decomposition can permit extra keys or clear a newer base;
  atomic malformed-message and owner-supersession tests are the gate.
- Out of Scope: Explorer panel, source/report actions, Flow renderer styling,
  comparison semantics, and durable docs.

### Slice 10 Implementation Approval — Held

- Status: Previously approved under the reviewed replan; implementation held
  while the approved Slice 9A formatter-only replan is implemented, reviewed,
  and focused-committed.
- Approved scope: Slice 10 — Simplify Flow Overlay, Document Validation, And
  Viewer Messages, exactly as specified above. Preserve the existing
  `{ type: "changeDocument", data }` and `{ type: "revealUnit", data }`
  messages, ready/onReady behavior, strict extra-key rejection, exact overlay
  node/edge membership and cross-kind validation, null/absent/replace/clear
  semantics, atomic rejection before mutation, and normal Flow behavior when
  no semantic-diff overlay is present. No new wire variant, reason/detail
  field, renderer, host lifecycle, or UI behavior is authorized.
- Approved paths: `src/application/flow-graph/buildSemanticDiffFlowOverlay.ts`,
  `src/application/flow-graph/flowGraphDocument.ts`,
  `src/application/unit-list/unitListDocument.ts`,
  `src/presentation/webview/viewerHostMessages.ts`, and the focused existing
  tests `src/test/suite/flowGraphDocument.test.ts` and
  `src/test/suite/viewerHostMessages.test.ts`. Normal Flow compatibility is
  also checked through the existing compiled Flow/document suites; no host,
  Explorer, renderer, configuration, or durable-document path is approved.
- Qlty boundary: resolve only the recorded baseline findings through cohesive
  extraction; no suppression, allowlisting, threshold relaxation,
  generated-ignore edit, or qlty configuration change. Exact assignments are
  `buildSemanticDiffFlowOverlay.ts`: `manyParameters=1`,
  `functionComplexity=3`; `flowGraphDocument.ts`: `manyParameters=1`,
  `manyReturns=3`, `functionComplexity=8`, `totalComplexity=1`,
  `complexBinary=2`; `unitListDocument.ts`: zero baseline smell findings;
  and `viewerHostMessages.ts`: `functionComplexity=4`,
  `complexBinary=1`. Other recorded rule families are zero for these files.
- Gate condition: Slice 9 completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135` remains present, but Slice 9A
  must first receive independent plan review and Human Approval, complete its
  formatter-only implementation/review, and be focused-committed. Completion
  Approval for Slice 10 remains conditionally automatic only after its
  independent implementation review returns `Ready` with no findings.
- Next route: Main routes Slice 9A through independent plan review. Slice 10
  may resume only after the Slice 9A gate; Slices 11-13 remain
  dependency-blocked and closure drafts remain excluded.

### Slice 11: Simplify Explorer Host Lifecycle And Action Adapters

- Status: Planned; blocked until Slice 10 is complete and reviewed.
- Scope: resolve qlty smells in `semanticDiffExplorerPanel.ts`,
  `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerReportAction.ts`,
  `semanticDiffExplorerSourceAction.ts`, and
  `semanticDiffCommand.ts` by extracting lifecycle guards, request/action
  dispatchers, strict record lookup, disposal phases, and command steps. Keep
  the one-argument opener, same-context report handoff, exact source reveal,
  action correlation, and unregister-before-release ordering.
- User / Domain Value: panel close, report, source, and command failures stay
  predictable while host code becomes auditable and qlty-clean.
- Cohesive Change Group: VS Code Explorer host panel/registry/action adapters,
  comparison command seam, and their panel/command/report/source tests.
- Acceptance: qlty reports no findings in these host files; all existing
  action outcomes, stale/disposed epochs, payload-size failure, context/action
  registry ownership, source revalidation, four-mode output identity, and
  display-failed mapping remain behavior-compatible.
- Validation: focused compiled panel/registry/report/source/command suites,
  disposal/supersession/late completion tests, desktop smoke, web build,
  qlty smells/check, and diff checks.
- Production Readiness: no resource leak or late focus/post, no raw URI/content
  transport, idempotent cleanup, and unchanged VS Code `^1.75.0` behavior.
- Approval Boundary: Explorer host lifecycle and source/report/command action
  refactoring. Flow bridge/wiring and webview presentation are separate.
- Dependencies: Slices 7-10 contracts and completed Slices 2-3.
- Risks: extraction may change error mapping or disposal order; exact action
  correlation and release-order tests are mandatory.
- Out of Scope: MUI surface, Flow overlay graph/document logic, telemetry,
  new commands, and durable docs.

### Slice 12: Simplify Flow Host Wiring And Viewer Lifecycle Adapters

- Status: Planned; blocked until Slice 11 is complete and reviewed.
- Scope: resolve qlty smells in `semanticDiffExplorerFlow.ts`,
  `semanticDiffFlowViewerBridge.ts`, `semanticDiffWiring.ts`,
  `viewerWiring.ts`, `extensionDependencies.ts`, and `ajsDocument.ts` by
  splitting host factories, source-current checks, operation ownership,
  readiness/reveal steps, and panel disposal helpers. Preserve composition
  boundaries, one overlay per URI, operation guards, normal viewer wiring,
  parser performance telemetry privacy, and desktop/web parity.
- User / Domain Value: Explorer-to-Flow navigation remains side-correct and
  lifecycle-safe without making the host adapter a second Flow protocol.
- Cohesive Change Group: bootstrap/presentation host adapters and their Flow,
  wiring, lifecycle, and integration tests.
- Acceptance: qlty is clear for the touched host/wiring files; all existing
  ready/focus/reveal, stale source, supersession/late clear, unregister/
  release, normal viewer wiring, and telemetry privacy tests pass. No new
  viewer message variant or architecture exception appears.
- Validation: focused Flow host/wiring/viewer lifecycle suites, architecture
  dependency test, desktop smoke, web preparation/build, qlty smells/check,
  and diff checks.
- Production Readiness: concrete infrastructure remains composed only in
  bootstrap, host resources are scoped/idempotent, late operations cannot
  mutate newer sessions, and web code remains browser-safe.
- Approval Boundary: bootstrap/presentation Flow host and viewer lifecycle
  refactoring only. Flow UI components and durable docs are separate.
- Dependencies: Slice 11 and Slice 10 viewer contracts.
- Risks: factory extraction may move a concrete dependency across an
  architecture boundary or weaken owner-token checks; architecture and late
  operation tests are the gate.
- Out of Scope: parser/domain changes, MUI Explorer, graph algorithms, Flow
  component styling, and release/closure docs.

### Slice 13: Simplify Flow/Shared MUI Presentation Components

- Status: Planned; blocked until Slice 12 is complete and reviewed.
- Scope: resolve remaining qlty smells in `FlowContents.tsx`,
  `FlowGraphCanvas.tsx`, `flowGraphView.ts`, `flowMiniMap.ts`,
  `AjsNode.tsx`, and the related `TableContents.tsx` duplication by extracting
  cohesive render/state helpers and shared MUI theme/style utilities. Preserve
  Flow keyboard/focus, node/edge semantics, high-contrast/pattern/legend
  states, MiniMap behavior, ordinary table rendering, and the new Explorer
  accessibility baseline.
- User / Domain Value: existing Flow/table surfaces remain readable and
  accessible while feature-touched presentation code has no qlty smells or
  duplicated theme logic.
- Cohesive Change Group: webview Flow/table presentation helpers, shared MUI
  theme/style helper, and Flow view/node/component tests.
- Acceptance: qlty reports no smell or duplication findings for the touched
  Flow/table components; all Flow state labels, patterns, badges, relation
  non-focusability, keyboard navigation, high contrast, MiniMap colors, and
  table regressions remain unchanged. Shared MUI helpers do not import host or
  parser contracts.
- Validation: Flow component/view/accessibility/axe tests, table regression
  tests, manual keyboard/focus/forced-colors checks, desktop/web bundles and
  smoke, `rtk pnpm run qlty:smells`, qlty check, and diff checks.
- Production Readiness: no color-only state, no unbounded render work, no
  bundle/CSP regression, and unchanged non-diff Flow/table behavior.
- Approval Boundary: webview presentation/refactoring and shared MUI style
  helpers only. No semantic model, viewer wire, layout/search redesign, or
  telemetry change.
- Dependencies: Slices 5 and 12 plus completed Flow overlay/document work.
- Risks: shared style extraction can alter existing table/Flow theme tokens,
  and render helper boundaries can change focus timing; existing Flow/table
  DOM/axe and desktop/web tests are the gate.
- Out of Scope: new product behavior, source/report actions, comparison rules,
  qlty suppression/allowlisting, and durable docs.

## Auditable qlty Smell Baseline (2026-09-07)

The replanning baseline was captured from Main's successful escalated run of
`rtk pnpm run qlty:smells` against `origin/main`. The installed tool reported
`qlty 0.500.0 macos-arm64 (5945e00 2025-03-18)`. It analyzed 45 files and
reported findings in 31 files. The repository qlty configuration and all
thresholds are unchanged. In the table, `P` = many parameters, `R` = many
returns, `F` = function complexity, `T` = total/file complexity, `B` = complex
binary logic, `N` = nested control flow, and `D` = duplication; omitted cells
are zero findings. Counts are findings, not a suppression or a score.

<!-- markdownlint-disable MD013 -->

| Baseline file                                                                |   P |   R |   F |   T |   B |   N |   D |
| ---------------------------------------------------------------------------- | --: | --: | --: | --: | --: | --: | --: |
| `src/application/flow-graph/buildExpandedFlowGraph.ts`                       |   1 |   0 |   6 |   1 |   0 |   0 |   0 |
| `src/application/flow-graph/buildFlowGraph.ts`                               |   0 |   0 |   2 |   0 |   0 |   0 |   0 |
| `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`              |   2 |   0 |   3 |   0 |   0 |   0 |   0 |
| `src/application/flow-graph/buildSemanticDiffFlowOverlay.ts`                 |   1 |   0 |   3 |   0 |   0 |   0 |   0 |
| `src/application/flow-graph/flowGraphDocument.ts`                            |   1 |   3 |   8 |   1 |   2 |   0 |   0 |
| `src/application/parsing/AjsParserWithSourceIndexPort.ts`                    |   0 |   3 |   4 |   1 |   4 |   0 |   0 |
| `src/application/semantic-diff/buildSemanticDiffReportData.ts`               |   0 |   0 |   1 |   0 |   0 |   0 |   0 |
| `src/application/semantic-diff/semanticDiffExplorerMessages.ts`              |   6 |  11 |  19 |   1 |  42 |   0 |   0 |
| `src/application/semantic-diff/semanticDiffExplorerProjection.ts`            |   2 |   7 |  14 |   1 |   1 |   0 |   0 |
| `src/application/semantic-diff/semanticDiffRecordOccurrence.ts`              |   0 |   0 |   2 |   0 |   0 |   0 |   0 |
| `src/application/semantic-diff/semanticDiffSourceCapture.ts`                 |   0 |   3 |   4 |   1 |   2 |   0 |   0 |
| `src/bootstrap/extension/extensionDependencies.ts`                           |   0 |   0 |   1 |   0 |   0 |   0 |   0 |
| `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`                    |   0 |   0 |   3 |   0 |   0 |   0 |   0 |
| `src/bootstrap/extension/semanticDiffWiring.ts`                              |   1 |   1 |   2 |   0 |   1 |   0 |   0 |
| `src/bootstrap/extension/viewerWiring.ts`                                    |   0 |   1 |   4 |   0 |   0 |   0 |   0 |
| `src/infrastructure/parser/AntlrAjsParser.ts`                                |   0 |   0 |   1 |   0 |   0 |   0 |   0 |
| `src/presentation/vscode/commands/semanticDiffCommand.ts`                    |   0 |   1 |   4 |   1 |   0 |   0 |   0 |
| `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts`          |   1 |   5 |   7 |   1 |   1 |   0 |   0 |
| `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`         |   3 |   2 |   7 |   1 |   1 |   1 |   0 |
| `src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts`      |   0 |   0 |   1 |   0 |   0 |   0 |   0 |
| `src/presentation/vscode/semantic-diff/semanticDiffExplorerReportAction.ts`  |   0 |   1 |   1 |   0 |   0 |   0 |   0 |
| `src/presentation/vscode/semantic-diff/semanticDiffExplorerSourceAction.ts`  |   0 |   2 |   2 |   0 |   0 |   0 |   0 |
| `src/presentation/vscode/webview/ajsDocument.ts`                             |   2 |   2 |   4 |   0 |   0 |   0 |   0 |
| `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`                   |   0 |   2 |   3 |   1 |   0 |   0 |   1 |
| `src/presentation/webview/editor/ajsFlow/FlowGraphCanvas.tsx`                |   0 |   0 |   2 |   0 |   0 |   0 |   0 |
| `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`                   |   0 |   1 |   3 |   0 |   0 |   0 |   0 |
| `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`                  |   0 |   0 |   4 |   0 |   0 |   0 |   0 |
| `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`            |   0 |   1 |   3 |   1 |   0 |   1 |   0 |
| `src/presentation/webview/semantic-diff/semanticDiffExplorerLocalization.ts` |   0 |   0 |   0 |   0 |   0 |   0 |   8 |
| `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`        |   3 |   4 |  12 |   1 |   0 |   0 |   0 |
| `src/presentation/webview/viewerHostMessages.ts`                             |   0 |   0 |   4 |   0 |   1 |   0 |   0 |

<!-- markdownlint-enable MD013 -->

The aggregate is `P=23`, `R=50`, `F=134`, `T=12`, `B=55`, `N=2`, and
`D=9`. Slice 5's Explorer files are intentionally included in this baseline;
the new `src/presentation/webview/shared/muiTheme.ts` is included in the
post-slice clean check even though it did not exist in the baseline. The exit
definition is zero qlty-smell findings in every feature-delta file (including
new helpers and any file touched by Slices 5-13), a passing `qlty check`, and
no suppression, allowlist, threshold, generated-ignore, or metrics-only
waiver change. If a repository-baseline finding is outside this feature delta,
the final report must identify it by path and prove zero new findings in the
changed delta; it may not be hidden.

## Cross-Slice Readiness And Approval Boundaries

- Slices 1-4 remain complete and focused-committed. Slices 5-13 each require
  focused tests, qlty smell/check evidence, and a build whenever the changed
  surface affects compilation/bundling; parser, host, Flow, and webview slices
  add the relevant desktop/web/architecture checks.
- Slice 5 and every later webview slice require mandatory static CSP assertions
  in `semanticDiffExplorerPanel.test.ts`: the generated Explorer HTML keeps
  `default-src 'none'`, nonce-bound scripts, the existing `cspSource` plus
  inline-style policy only, and no remote origin, font, `connect-src`, `eval`,
  or new relaxation. The assertion also checks that MUI/Emotion does not emit
  an external asset dependency. A policy change is a Replanning trigger.
- Cross-platform smoke ownership is explicit: the implementation reviewer
  owns the desktop Electron/webview smoke entry after
  `rtk pnpm run test:prepare:desktop` and the compiled desktop runner
  `node ./out/test/runTest.js`; the web bundle owner runs
  `rtk pnpm run test:prepare:web` and `rtk pnpm run build`, then inspects the
  browser-safe bundle and CSP. A real Chromium/browser smoke is claimable only
  when the CI/permissive-host owner has a Chromium host whose
  `bootstrap_check_in` permission succeeds and the app starts with the same
  session-message fixture. Until that entry condition is met, the evidence is
  explicitly `blocked-before-execution` and desktop smoke, web build, static
  CSP, and DOM evidence must not be reported as browser-smoke success.
- The qlty baseline is explicit: the fresh 2026-09-07 smell report found
  complexity, return-count, parameter-count, nested-control-flow, boolean,
  and duplication findings across the changed Explorer application/parser,
  host/wiring, Flow graph/overlay, and webview files. The new slices must
  remove those findings by extracting cohesive behavior and preserving tests;
  no suppression, allowlist, threshold relaxation, or metrics-only waiver is
  permitted.
- Every new slice still receives an independent implementation review. Under
  the explicit user policy, a `Ready` verdict with no findings conditionally
  authorizes that slice's Completion Approval automatically; actionable
  Findings suspend the slice and require Main to route remediation. Main
  requests one aggregate human approval only after Slices 5-13 are complete
  and committed, then reopens Feature Exit for the final closure review.
- Domain gains no responsibility; application imports no VS Code/UI/
  infrastructure; ANTLR stays in parser infrastructure; presentation consumes
  DTOs; bootstrap/presentation compose concrete adapters and own URI,
  `TextDocument`, snapshot, report, action, source-index, and Flow-overlay
  registries. The capture scope remains sole owner of source indexes and
  snapshots; context registry entries are borrowed and composite cleanup
  unregisters before scope release. The application capture port is plain and
  the enriched parser result crosses into it only as normalized document plus
  browser-safe index. The existing `AjsParserPort` remains the compatibility
  seam for unrelated consumers and the current/future builder injection.
- Parser, comparison, identity, risk, structured output, normal Flow, report,
  clipboard, desktop, and web regressions remain passing. The managed
  Chromium startup limitation remains an environment risk and must be recorded
  for any slice whose web smoke cannot run; it is not silently treated as
  source evidence.
- JP1/AJS syntax/normalization/identity/schedule/risk meaning is unchanged.
  Malformed input fails before Explorer; unsupported/uncalculated remains
  visible and non-assertive.
- Large validation covers 10,000 leaves and representative overlays without
  quadratic joins, unbounded DOM, repeated comparison parsing, action-time
  parser/index regeneration, per-selection rebuilds, or payloads above the
  fixed 8 MiB UTF-8 limit. Oversized payloads fail closed without truncation
  or partial state.
- Explorer requests, replies, and host messages reject unknown/extra/missing/
  non-finite/wrong-session/conflicting or non-session-derived data; exact
  nullable fields and the closed error-code union are tested. Existing Flow
  viewer host messages retain the exact `{type, data}` union and reject invalid
  or extra-key document/navigation data before mutation; their optional Flow
  augmentation carries IDs/state only while base data remains normal. Reason
  details resolve from `context.result` and a missing ID returns a safe error.
  Shared production code has no Node built-ins.
- Source reveal and Flow ready/focus each revalidate the session epoch,
  target/index/scope and decoded snapshot/version immediately before the host
  action. File revalidation uses `openTextDocument(uri).getText()` so VS Code
  encoding, including Shift_JIS and BOM handling, remains authoritative; Git
  HEAD revalidation uses the workflow-owned immutable provider.
  Panel close releases snapshots, report/action handles, context, and only
  overlays owned by its exact token; late completion and late clear tests prove
  that a superseded/newer overlay is not disturbed.
- Replanning is required for predecessor contract changes, a missing or
  incompatible `AjsParserWithSourceIndexPort`/capture binding, missing target
  evidence, source/period/command/calendar/persistence/edit/fuzzy mapping,
  grammar/domain expansion, reverse Flow-report, telemetry, replacement
  renderer, engine/dependency-floor increase, or any qlty remediation that
  changes behavior or an approval boundary. Unverifiable actions become
  unavailable.

## Traceability And Feature Exit

- `TRACEABILITY.md` maps EXP-1 through EXP-11, N-1, E-4, filter verification,
  qlty-smell remediation, compatibility, readiness, and durable follow-up to
  Slices 1-13.
- Exit now requires the original four plus nine reviewed/approved/committed
  remediation slices, MUI/WCAG 2.2 AA evidence, actual-session filter evidence,
  a clean qlty-smell report without suppression, desktop/web/a11y evidence,
  durable-document review, and final traceability. The prior `Close`
  recommendation is reopened until those conditions are met.

## Validation

- [x] Slice 1 tests and checks complete
- [x] Slice 2 tests and checks complete
- [x] Slice 3 tests and checks complete
- [x] Slice 4 tests and checks complete
- [x] Slice 5 MUI/WCAG 2.2 AA implementation and evidence complete; focused
      completion commit `ee76722d0628d2d4e223f6faf13751a7a16a3a35` recorded
- [x] Slice 6 actual-session confirmation-filter proof complete; independent
      review `Ready` with no findings and automatic Completion Approval
      recorded; focused completion commit `6af753e7` recorded
- [x] Slice 7 application projection/transport qlty remediation complete;
      independently reviewed `Ready` with no findings, Completion Approval
      automatically approved on 2026-09-07, focused commit
      `b7c537d3410b2a05fae0487df3fd92fbb6b8f484` recorded
- [x] Slice 7A formatter-only reconciliation complete; exact 14 committed
      Slice 7 paths mechanically formatted, full qlty check and targeted
      smells/tests passing; focused completion commit `c9b97b0d` recorded
- [x] Slice 8 source capture/parser qlty remediation complete; independent
      review `Ready` with no findings, Completion Approval automatically
      approved, focused completion commit
      `792842b9d82dfa728f7742fc1ea1fb11e4623bc9` recorded
- [ ] Slice 9 Flow graph/highlight qlty remediation complete
- [ ] Slice 10 Flow overlay/document/message qlty remediation complete
- [ ] Slice 11 Explorer host/action qlty remediation complete
- [ ] Slice 12 Flow host/wiring qlty remediation complete
- [ ] Slice 13 Flow/shared MUI presentation qlty remediation complete
- [ ] README, CHANGELOG, durable use cases, roadmap, and final traceability
      revalidated at the reopened Feature Exit
