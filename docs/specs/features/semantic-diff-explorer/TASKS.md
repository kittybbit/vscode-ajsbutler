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
  unformatted by the full qlty gate. Slice 9A completed its approved
  formatter-only reconciliation and is focused-committed as `d19a38ce` after
  final independent implementation review `Ready` with no findings and
  automatic Completion Approval. Slice 10 completed and focused-committed as
  `9acfb577` after final `Ready`/no-findings review and automatic Completion
  Approval. Slice 11 is complete, independently reviewed `Ready` with no
  findings, automatically completion-approved, and focused-committed as
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`. Slice 12 is complete,
  independently reviewed `Ready` with no findings, automatically
  completion-approved, and focused-committed as
  `a7905e8fdd905c506627a83d6c86ed1246255298`. A narrow Slice 13 replan
  authorizes the backward-compatible canonical MUI theme factory. It received
  final independent `Ready`/no-findings review and Human Approval on
  2026-09-08; its focused replan commit `d0cc7815` is present. Slice 13
  implementation is complete, independently reviewed, and focused-committed.
  Feature Exit returned `Close`, but closure was paused by a reproduced runtime
  regression in the Explorer source-capture handoff. Slice 14 repaired that
  boundary, was independently reviewed `Ready` with no findings, automatically
  completion-approved, and focused-committed as `6cce14b7`. The final Feature
  Exit rerun returned `Close`. Slice 15 then repaired the reported
  theme-mode/default-color regression and completed with its own `Close`
  review. The user-approved presentation/composition assessment now
  supersedes that review and adds the narrow Slice 16/17 replan below.
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
- Next route: `approval-committer` may create the focused Slice 15 plan-gate
  commit after the independent `Ready` review and automatic Human Approval
  recorded below. Aggregate human approval and explicit Closure Approval for
  the final six durable paths plus selected feature-folder removal remain
  paused; the six closure drafts stay excluded from implementation slices.

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
- Slice 9A was a narrow formatter-only reconciliation triggered by the full
  qlty gate reporting the already committed
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
  unformatted. Its existing Slice 9 behavior, tests, qlty assignments, and
  completion commit remain preserved; the formatter-only completion commit is
  `d19a38ce`, and Slice 10 may now activate.
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
  unformatted. Slice 9A completed its formatter-only implementation and is
  focused-committed as `d19a38ce`; Slice 10 then completed and focused-
  committed as `9acfb577`; Slice 11 completed and focused-committed as
  `628cc9333ed10d540665cb23329a8e7e3c6af6df` after independent `Ready`/
  no-findings review and automatic Completion Approval. Slice 12 then
  completed and focused-committed as
  `a7905e8fdd905c506627a83d6c86ed1246255298`; Slice 13's narrow canonical-
  theme replan is present as `d0cc7815`, and its implementation is complete,
  independently reviewed, and focused-committed. Slice 14 is complete and its
  post-repair Feature Exit returned `Close`; the Slice 15 color/theme
  regression replan now pauses closure.

## Plan Status

- Status: Slices 1-12 and Slice 7A complete and focused-committed; Feature Exit
  reopened; replan commit `54ca4005` and narrow Slice 6 replan commit
  `1ede39bb` are
  reviewed and approved. Slice 9A is complete and focused-committed as
  `d19a38ce`; Slice 10 is complete and focused-committed as `9acfb577`; Slice
  11 is complete and focused-committed as
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`; Slice 12 is complete and
  focused-committed as
  `a7905e8fdd905c506627a83d6c86ed1246255298`; Slice 13's narrow replan is
  independently reviewed `Ready` with no findings, Human Approval recorded,
  and focused-committed. Slice 14 was the regression-fix replan; its
  independent plan review is `Ready` with no findings and Human Approval was
  automatically recorded under the standing proceed-through-slices policy.
  Slice 14 is complete and focused-committed as `6cce14b7`; Slice 15 is
  complete and focused-committed as `80645ffa`; the post-Slice-15 Feature Exit
  returned `Close` and is now superseded by the user-approved Slice 16/17
  replan.
- Planning scope: preserve EXP-1 through EXP-11, all completed slice
  evidence, and the six protected closure drafts while moving production
  allocator construction to Bootstrap and organizing only the VS Code
  Semantic Diff adapter. `presentation/semantic-diff` and
  `presentation/webview/semantic-diff` remain in place.
- Review status: Existing four-slice plan review `Ready` for commit `067d2189`;
  final independent review of this replan returned `Ready` with no findings,
  followed by reviewed/approved commit `54ca4005`. The narrow Slice 13 theme
  API replan received final independent plan review `Ready` with no findings
  on 2026-09-08; its focused replan commit is `d0cc7815`. Slice 14's
  independent plan review also returned `Ready` with no findings, and its
  Human Approval is automatically recorded under the user's explicit
  no-findings auto-approval policy; its plan-gate commit is `6f1f262d` and
  focused completion commit is `6cce14b7`. The post-repair Feature Exit
  returned `Close`; the Slice 16/17 replan received independent Plan Review
  `Ready` with no findings on 2026-09-10. The user's explicit message
  `PLEASE IMPLEMENT THIS PLAN` records Human Approval for the exact Slice
  16/17 boundary; the focused plan-gate commit is the next route.
- Human approval: the historical approvals below are limited to Slices 1-4
  only and are superseded as the active gate. Replanning Human Approval was
  granted on 2026-09-07 under the user's explicit MUI/WCAG/qlty/filter request.
  Narrow Slice 9A Human Approval was granted on 2026-09-08 through the trusted
  user messages `承認します。` and `継続して。`.
  Narrow Slice 13 theme API Human Approval was granted on 2026-09-08 through
  the trusted messages `承認します。` and repeated `継続して。`.
- Active gate: Slice 16/17 presentation and composition replan — the user
  approved the exact two-slice scope on 2026-09-10. Independent Plan Review is
  `Ready` with no findings, and Human Approval is recorded from the explicit
  user message `PLEASE IMPLEMENT THIS PLAN` on 2026-09-10. The focused
  plan-gate commit is the next route; no runtime, test, generated-artifact, or
  configuration changes are authorized before that commit.
- Slice order: Slices 1-15, Slice 7A, and Slice 9A remain complete and
  committed. Slice 16 (Bootstrap allocator injection and composition-root
  detection) must complete and be independently reviewed/committed before
  Slice 17 (VS Code Semantic Diff adapter placement and constants) starts.
  Each new slice
  has an
  independent review and the recorded automatic Completion Approval rule
  applies only when that review is `Ready` with no findings.

## Current Narrow Replan Boundary (Slice 13)

- Trigger: plan review found that Flow/Table consumers need a mode-aware
  canonical MUI theme API, while Slice 5's existing Explorer theme export must
  remain backward-compatible. This is a narrow ownership/API clarification,
  not a broad visual redesign or a new renderer.
- Planned change: extend the existing
  `src/presentation/webview/shared/muiTheme.ts` with a canonical
  `createSemanticDiffTheme(options)` factory and typed mode options for Flow
  and Table consumers. Preserve the current `semanticDiffExplorerTheme`
  export and behavior exactly; the factory reuses the same VS Code token,
  forced-colors, focus, contrast, target-size, and WCAG policy.
- Approved replan boundary: Slice 13's existing Flow/Table presentation paths,
  the existing canonical `muiTheme.ts`, and focused theme/Explorer evidence
  only. No second theme, token redefinition, public Explorer API break,
  transport/schema change, qlty suppression/configuration edit, or broad
  design change is authorized.
- Exact focused theme evidence: add
  `src/test/suite/muiTheme.test.ts` for the mode-aware factory and
  backward-compatible export, and extend
  `src/test/suite/semanticDiffExplorerDom.test.tsx` only for unchanged Explorer
  MUI/WCAG behavior. The existing Flow/Table/architecture tests remain the
  regression evidence for Slice 13.
- Gate: final independent plan review returned `Ready` with no findings and
  Human Approval was granted on 2026-09-08 under the trusted messages
  `承認します。` and repeated `継続して。`. The focused replan commit is
  `d0cc7815`; Slice 13 implementation is complete and awaits independent
  review. The exact replan commit paths were only `TASKS.md` and
  `TRACEABILITY.md`; closure drafts remain excluded.

### Narrow Slice 13 Theme API Replan Human Approval — Eligible/Pending Commit

- Status: Human Approved; final independent plan review returned `Ready` with
  no findings; focused replan commit `d0cc7815` is present and implementation
  is complete pending independent review.
- Approved at: 2026-09-08.
- Human Approval evidence: the trusted user messages `承認します。` and
  repeated `継続して。` approve the narrow backward-compatible mode-aware
  canonical MUI theme API replan under the existing proceed-through-slices
  policy.
- Approved scope: extend the existing
  `src/presentation/webview/shared/muiTheme.ts` with the typed
  `createSemanticDiffTheme(options)` factory/options API, preserve the
  `semanticDiffExplorerTheme` export and behavior, and add focused theme
  evidence at `src/test/suite/muiTheme.test.ts` while preserving the existing
  Explorer DOM/WCAG test contract. Slice 13's Flow/Table paths remain exactly
  as listed below; no second theme, transport/schema change, design expansion,
  qlty suppression/configuration change, or closure-draft path is approved.
- Exact replan paths: only
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`.
- Commit status: the reviewed and Human-Approved focused replan commit is
  eligible and pending. No stage or commit operation was performed in this
  update. Implementation remains blocked until that commit is present;
  closure drafts remain excluded and untouched.

## Current Narrow Replan Boundary (Slice 14)

- Trigger: Feature Exit investigation reproduced the reported runtime failure.
  `createSourceDescriptors` creates presentation-owned descriptors that carry
  `uri`, then `beginSourceCapture` passes those objects unchanged to the
  application capture factory. The application guard requires the exact
  `{ side, sourceHandleId, text, version }` key set and throws
  `TypeError: Malformed semantic diff source descriptor.` The command catches
  that setup exception as `parse-failed`, producing the misleading message
  `Semantic diff could not parse one or both JP1/AJS definitions.` This blocks
  closure because valid URI-bearing definitions cannot open the Explorer.
- Planned change: keep URI-bearing descriptors in `request.sourceDescriptors`
  for presentation registration, but construct a URI-free application capture
  input at the command/application boundary before invoking
  `beginSemanticDiffSourceCapture`. Preserve side, opaque handle, text, and
  version values exactly; do not widen the application DTO or relax its exact-
  key guard. Isolate source-capture setup from report/parser execution so an
  unexpected setup exception is reported as `display-failed` with the existing
  source-capture message, while parser/report failures retain `parse-failed`.
- Approved replan boundary: the command build path
  `src/presentation/vscode/commands/semanticDiffCommandBuild.ts` and its
  command-level regression coverage in
  `src/test/suite/semanticDiffCommand.test.ts`. The test uses the concrete
  `createBeginSemanticDiffSourceCapture` factory with the real parser behavior
  (or an equivalent concrete parser factory already used by the command) and
  proves that valid URI-bearing before/after sources reach `openExplorer`,
  while the capture input has no URI and the registration descriptors retain
  both URIs. A second assertion proves an arbitrary capture-setup exception
  is not labeled as a syntax/parse failure and that release/registration
  cleanup remains safe.
- Validation boundary: run the focused compiled semantic-diff command,
  source-capture, and parser/report suites; verify the exact success path,
  application DTO key set, retained presentation URI identity, Explorer open
  result, setup-failure error code/message, and no leaked capture registration.
  Run `rtk pnpm run test:compile`, relevant desktop/web preparation or build
  checks for the changed command boundary, targeted qlty smells, full qlty
  check, Markdown lint, and `rtk git diff --check` as applicable. Re-run the
  desktop command path because the regression is VS Code host-owned; retain
  web-build evidence for shared browser-safe contracts and confirm no
  production Node built-in is introduced.
- Production readiness: JP1/AJS parsing, normalization, comparison, source
  index generation, opaque IDs, source snapshots, Explorer session identity,
  and source/Flow/report behavior remain unchanged. Valid malformed-parser
  results still fail as `parse-failed`; only capture setup failures move to
  the display/setup error. Before/after source order, URI registration,
  version freshness, duplicate IDs, UTF-16/CRLF/Unicode ranges, desktop/web
  compatibility, CSP, and telemetry privacy remain covered by existing
  contracts. The `url.parse()` DEP0169 startup warning is explicitly out of
  scope: investigation found it predates this regression and no feature-owned
  Semantic Diff source path calls `url.parse`; changing dependencies,
  telemetry, or startup wiring requires a separate finding/replan.
- Approval boundary: one independently reviewable regression-fix slice only;
  no parser grammar/domain change, source-index contract change, transport or
  Explorer UI change, report-mode change, qlty suppression/configuration
  change, durable-document propagation, or closure-folder removal.
- Dependencies: completed Slices 3, 8, and 11 command/capture boundaries;
  completed Slice 13 and the existing Feature Exit evidence. Slice 14's plan
  review and Human Approval are complete; its approved plan must be committed,
  then implemented, independently reviewed, automatically completion-approved
  when `Ready` with no findings, and focused-committed before Feature Exit is
  run again.
- Risks: descriptor projection could accidentally drop or regenerate an
  opaque handle, URI registration could diverge from capture input, or a broad
  catch could hide parser failures as display failures. Exact-key assertions,
  identity checks, concrete-parser command coverage, and separate setup/report
  error tests are required. The pre-existing `url.parse()` warning remains an
  external/dependency risk and is not evidence against this slice.
- Out of Scope: fixing DEP0169, dependency upgrades, parser/ANTLR changes,
  URL API migration, telemetry changes, new user-facing diagnostics, or any
  closure-draft path.

### Slice 14: Repair URI-Bearing Source Capture And Error Classification

- Status: Independent plan review returned `Ready` with no findings, Human
  Approval is automatically recorded under the user's explicit no-findings
  auto-approval policy, and the approved plan-gate commit `6f1f262d` is
  present. Implementation review returned `Ready` with no findings on
  2026-09-09; Completion Approval is automatically recorded under the
  standing no-findings policy. Focused completion commit `6cce14b7` is
  present.
- Scope: strip only the host-only `uri` field before calling the application
  capture factory, retain the original URI-bearing descriptors for host
  registration, and separate capture setup exception handling from parser/
  report execution in `semanticDiffCommandBuild.ts`. Add command-level
  regression tests in `semanticDiffCommand.test.ts` using the concrete capture
  factory and parser behavior, plus setup-failure classification and cleanup
  assertions.
- User / Domain Value: valid JP1/AJS before/after definitions open the
  Semantic Diff Explorer again, and users receive an honest source/display
  failure when capture setup—not parsing—is the failing boundary.
- Cohesive Change Group: one presentation-to-application DTO projection,
  one command error-boundary correction, and the focused command/capture/
  parser regression evidence needed to prove the full Explorer path.
- Acceptance: URI-bearing valid sources complete comparison, retain URI
  identity for registration, invoke the application factory with exactly the
  four allowed descriptor keys, bind/register without a malformed-descriptor
  exception, and reach `openExplorer`. Parser error results and report/parser
  exceptions remain `parse-failed`; arbitrary source-capture setup exceptions
  are `display-failed` with the existing source-capture message. Capture
  release/registry cleanup is exactly-once and no source registration leaks.
- Validation: focused compiled `semanticDiffCommand`, source-capture, parser,
  and report suites; real command test with concrete capture/parser; exact-key
  and URI-retention assertions; setup-vs-parser failure assertions; desktop
  preparation/smoke, relevant web build/preparation, `rtk pnpm run
test:compile`, targeted qlty smells, full qlty check, Markdown lint, and
  `rtk git diff --check`.
- Production Readiness: preserve the application exact-key contract, source
  handle/version identity, same-pass source index and normalized document,
  malformed-input diagnostics, desktop/web composition, VS Code `^1.75.0`,
  browser-safe imports, CSP, and privacy-preserving telemetry. The known
  DEP0169 warning remains recorded as out-of-scope dependency/startup noise.
- Approval Boundary: exactly the two implementation paths named above plus
  their focused test changes; no durable docs or closure propagation.
- Dependencies: completed Slices 3, 8, 11, and 13; the closure drafts remain
  uncommitted and excluded.
- Risks: broad exception classification, accidental URI loss, source handle
  mismatch, and capture leak; all are covered by the acceptance and exact
  identity/cleanup assertions above.
- Out of Scope: `url.parse()` migration, dependency changes, parser grammar,
  semantic comparison rules, Explorer UI/MUI/WCAG work, Flow/report protocol,
  telemetry, README/CHANGELOG/use-case/roadmap propagation, and feature-folder
  removal.

### Slice 14 Implementation Evidence (2026-09-09)

- `semanticDiffCommandBuild.ts` now keeps URI-bearing descriptors on
  `request.sourceDescriptors` for host registration while projecting exact
  `{side, sourceHandleId, text, version}` objects into the application capture
  factory. Capture setup is isolated from report/parser execution, so an
  unexpected factory exception is `display-failed`; parser result failures and
  report/parser exceptions remain `parse-failed`.
- `semanticDiffCommand.test.ts` adds concrete `AntlrAjsParser` and
  `createBeginSemanticDiffSourceCapture` command coverage for successful
  URI-bearing sources, exact application keys, retained URI and opaque-handle
  identity, Explorer opening, registry cleanup, setup-failure classification,
  and concrete parser-failure classification with exactly-once release.
- Validation passed `rtk pnpm run test:compile`, the compiled desktop runner
  (`node ./out/test/runTest.js`, exit 0), `rtk pnpm run test:prepare:web`,
  `rtk pnpm run build` (desktop/web production bundles; existing asset-size
  warnings only),
  targeted `qlty smells --no-snippets` for the two approved paths (zero
  findings), `rtk pnpm run qlty:check` (`No issues`), `rtk pnpm run lint:md`,
  and `git diff --check`.
  `qlty fmt` was limited to the assigned command test and this traceability
  evidence; no qlty policy, suppression, allowlist, or threshold changed.
- Compatibility impact is none by design: VS Code `^1.75.0`, desktop/web
  composition, browser-safe contracts, parser/source-index behavior, source
  snapshots, Explorer identity, and telemetry remain unchanged. The known
  `url.parse()` DEP0169 startup warning is unrelated dependency/startup noise
  and remains outside Slice 14. The six closure-draft paths remain untouched.
- Production readiness is positive for valid JP1/AJS Explorer opening,
  malformed-parser diagnostics, exact source handle/version preservation,
  registration cleanup, and desktop/web bundle preparation. Browser smoke
  remains an environment-owned caveat; the focused completion commit is
  `6cce14b7`.
- Independent implementation review returned `Ready` with no findings on
  2026-09-09. Under the user's standing proceed-through-slices policy,
  Completion Approval is automatically approved; focused completion commit
  `6cce14b7` is recorded.

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
  untouched; Slice 8 completion is recorded, Slice 9A is complete, Slice 10
  is complete and focused-committed as `9acfb577`, and Slice 11 is now the
  active next slice; Slices 12-13 remain blocked; aggregate
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
- Next route (historical): Main delegated Slice 9. Slice 9A and Slice 10 are
  now complete and focused-committed; Slice 11 is the current active route.
  Slices 12-13 remain blocked and closure drafts remain excluded.

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
  Slice 9A is complete and focused-committed as `d19a38ce` after final
  `Ready`/no-findings review and automatic Completion Approval. Slice 10 is
  complete and focused-committed as `9acfb577`; Slice 11 is now the sole
  active implementation-approved slice. Slices 12-13 remain planned and
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
  proceed-through-slices policy. Slice 10 is now complete and focused-
  committed as `9acfb577`; Slice 11 may now activate.
- Next route: Main delegates exactly Slice 11 to `implementer`. Slices 12-13
  remain blocked until Slice 11 is complete, independently reviewed, and
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
- Slice 9A is complete and focused-committed as `d19a38ce` after final
  independent implementation review `Ready` with no findings and automatic
  Completion Approval. Slice 10 is complete and focused-committed as
  `9acfb577`; Slice 11 is now the sole active implementation-approved slice;
  Slices 12-13 remain blocked until their predecessors complete and are
  focused-committed;
  Slices 11-13 remain blocked until their predecessors complete and are
  focused-committed;
  aggregate human approval, Feature Exit, and Closure Approval remain
  pending until all approved slices are complete and committed.

### Slice 9A: Reconcile Slice 9 Flow Highlight Formatting

- Status: Human Approved; final independent plan review is `Ready` with no
  findings; focused docs-only replan commit `5185ec18` is present. The
  formatter-only implementation is complete, independently reviewed `Ready`
  with no findings on 2026-09-08, automatically completion-approved, and
  focused-committed as `d19a38ce`.
- Approved at: 2026-09-08 under the trusted user messages `承認します。` and
  `継続して。`, using the existing proceed-through-slices policy.
- Exact approved replan paths: `docs/specs/features/semantic-diff-explorer/TASKS.md`
  and `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md` only.
- Trigger: the full `rtk pnpm run qlty:check` after Slice 9's focused commit
  `52166c1aef52dca4510bf6e374ba0923317c7135` reported the exact committed
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
  unformatted. Slice 9A completed the formatter gate with focused commit
  `d19a38ce`; Slice 10 may now activate.
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
  `52166c1aef52dca4510bf6e374ba0923317c7135` and Slice 9A focused completion
  commit `d19a38ce`; Slice 10 may now activate. The six closure drafts remain
  excluded and untouched.
- Risks: a formatter-only diff could accidentally change grouping,
  parenthesization, or literal text; AST equivalence and targeted graph/
  highlight regressions are mandatory. A remaining full-qlty finding blocks
  Slice 10 and must not be hidden by configuration.
- Out of Scope: all other runtime/test files, graph/highlight behavior,
  overlay/document validation, host/wiring, MUI presentation, configuration,
  suppression/allowlisting, and durable closure documents.

### Slice 9A Implementation Evidence (2026-09-08)

- Status: Implementation complete; independent implementation review returned
  `Ready` with no findings on 2026-09-08. Completion Approval was automatic
  under the recorded proceed-through-slices policy. Focused completion commit
  `d19a38ce` is recorded; this documentation update does not stage or commit
  any path.
- The repository formatter changed exactly one approved runtime path:
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`. The diff
  is a single callback-call wrapping change; no tests, exports, DTOs, IDs,
  ordering, highlight logic, configuration, or qlty policy changed.
- AST semantic-equivalence comparison against the Slice 9 committed blob
  passed while ignoring source positions, trivia, and parenthesized-expression
  wrappers. Targeted `qlty smells --no-snippets` returned zero findings, full
  `qlty check --no-fix` passed with formatters enabled, and `git diff --check`
  passed.
- `pnpm run test:compile`, desktop test preparation and compiled desktop
  runner (`node ./out/test/runTest.js`, exit 0), web test preparation, and
  production desktop/web build passed. Existing bundle-size warnings are
  unchanged; no browser-smoke claim is added.
- Compatibility impact is none by design. Slice 9 Flow IDs, occurrence
  ordinals, side mapping, relation-edge non-focusability, deterministic
  ordering, ordinary Flow output, desktop/web composition, and VS Code
  `^1.75.0` compatibility remain unchanged.
- The six closure drafts remain excluded and untouched. Slice 10 is complete;
  Slice 11 may now activate. Slices 12-13 remain dependency-blocked, and
  aggregate human
  approval, Feature Exit, and Closure Approval remain pending until the
  approved slices are complete and committed.

### Slice 9A Completion Gate (2026-09-08)

- Independent implementation review: `Ready` with no findings on 2026-09-08.
- Completion Approval: automatically approved on 2026-09-08 because the
  independent review returned `Ready` with no findings.
- Exact focused completion paths (3):
  `docs/specs/features/semantic-diff-explorer/TASKS.md`;
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`; and
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`.
- `buildFlowGraphCore.ts` and all focused graph/highlight tests are unchanged;
  they remain validation-only because the review found no required contract
  or assertion changes. The formatter-only source diff is AST-equivalent to
  the Slice 9 committed blob.
- Targeted qlty smells returned zero findings. Full qlty check, TypeScript
  compilation, focused graph/highlight and normal Flow coverage through the
  desktop runner, desktop/web preparation, production desktop/web builds,
  Markdown lint, and `git diff --check` passed. Existing bundle-size warnings
  are unchanged; browser smoke remains unclaimed.
- Completion status: focused completion commit `d19a38ce` is recorded; this
  gate update does not stage or commit any path. The six closure drafts remain
  excluded and untouched. Slice 10 is complete and focused-committed as
  `9acfb577`; Slice 11 is now the sole active implementation-approved slice;
  Slices 12-13 remain blocked, and aggregate human approval,
  Feature Exit, and Closure Approval remain pending.

### Slice 10: Simplify Flow Overlay, Document Validation, And Viewer Messages

- Status: Implementation complete; independently reviewed `Ready` with no
  findings, automatically completion-approved, and focused-committed as
  `9acfb577` after Slice 9A focused completion commit `d19a38ce`.
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

### Slice 10 Implementation Approval — Completed

- Status: Implementation complete; independent implementation review returned
  `Ready` with no findings on 2026-09-08. Completion Approval was automatically
  granted under the recorded proceed-through-slices policy. Focused completion
  commit `9acfb577` is recorded; this documentation update does not stage or
  commit any path.
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
  `52166c1aef52dca4510bf6e374ba0923317c7135` and Slice 9A focused completion
  commit `d19a38ce` are present. Slice 10 implementation review is `Ready` with
  no findings, so the recorded automatic Completion Approval applies; focused
  completion commit `9acfb577` is recorded.
- Exact completion-gate paths: `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/application/flow-graph/buildSemanticDiffFlowOverlay.ts`,
  `src/application/flow-graph/flowGraphDocument.ts`,
  `src/presentation/webview/viewerHostMessages.ts`,
  `src/application/flow-graph/flowGraphDocumentOverlay.ts`,
  `src/application/flow-graph/flowGraphDocumentProjection.ts`,
  `src/application/flow-graph/flowGraphDocumentTreeReader.ts`,
  `src/application/flow-graph/flowGraphDocumentUnitReader.ts`,
  `src/application/flow-graph/flowGraphDocumentUnitValidation.ts`, and
  `src/application/flow-graph/flowGraphDocumentValidation.ts`. The approved
  `src/application/unit-list/unitListDocument.ts` remains unchanged because
  its baseline smell assignment was zero.
- Next route: Main delegates exactly active Slice 11 to `implementer`.
  Slices 12-13 remain dependency-blocked until Slice 11 is complete, reviewed,
  and focused-committed; closure drafts remain excluded and untouched.

### Slice 10 Completion Gate — Ready; Automatic Completion Approval

- Review result: independent implementation review `Ready` with no findings,
  recorded on 2026-09-08.
- Completion Approval: automatically approved under the user's explicit
  proceed-through-slices policy because the review was `Ready` with no
  findings. Focused completion commit `9acfb577` is recorded; this update does
  not stage or commit any path.
- Evidence: the targeted Slice 10 smell scan returned zero findings; the full
  qlty check passed; `unitListDocument.ts` remains unchanged; and the
  implementation evidence above records compile, desktop, web preparation,
  build, and diff validation. The managed Chromium smoke limitation remains
  environment-owned and does not change the review verdict.
- Scope guard: only the 11 paths listed in the Slice 10 completion-gate
  boundary are recorded in its focused commit. Slices 12-13 remain blocked,
  and the six closure-draft documents remain excluded.

### Slice 10 Implementation Evidence (2026-09-08)

- The approved validator/overlay/message boundary is implemented without a new
  wire variant, host lifecycle, UI field, reason/detail field, renderer, or
  qlty configuration change. `unitListDocument.ts` had no assigned baseline
  smell and remains behaviorally unchanged.
- `buildSemanticDiffFlowOverlay.ts` now isolates relation-tuple expansion,
  occurrence collection, deterministic entry ordering, and entry copying.
  `flowGraphDocument.ts` remains the public type/export boundary while
  same-boundary projection, overlay, unit/tree, and document-validation
  helpers perform the extracted checks. `viewerHostMessages.ts` now uses
  closed parser dispatch and separate document/resource shape validation.
- Exact overlay keys and entry keys remain enforced. Node IDs and formal edge
  IDs are checked against the current graph with cross-kind rejection. Absent,
  null, and replacement overlays retain their existing semantics; malformed,
  stale, missing, oversized, or extra-key payloads are rejected before viewer
  state mutation, while ordinary viewer messages remain compatible.
- Targeted `qlty smells --no-snippets` over the approved paths and their
  same-boundary helpers returned zero findings. The repository-wide smell scan
  reports only pre-existing findings outside this Slice 10 boundary; no
  suppression, allowlist, threshold, generated-ignore, or configuration edit
  was made. `qlty check` and `git diff --check` passed, and qlty formatted all
  changed code paths.
- Validation passed `pnpm run test:compile`, desktop test preparation and the
  compiled Electron runner (`node ./out/test/runTest.js`, exit 0), web test
  preparation, and the production desktop/web build. Existing bundle-size
  warnings remain unchanged. Web browser smoke remains blocked before test
  execution by the managed Chromium
  `bootstrap_check_in ... Permission denied (1100)` environment failure.
- Compatibility impact is none by design: VS Code `^1.75.0`, desktop/web
  composition, normal Flow behavior, browser-safe DTOs, architecture
  boundaries, and telemetry privacy remain unchanged. The six closure drafts
  remain excluded and untouched.
- Review package: the independent implementation reviewer verified the exact
  changed boundary, including focused Flow document, viewer-host-message,
  normal Flow, malformed/extra-key, cross-kind, and overlay replacement/clear
  suites. The review returned `Ready` with no findings; Completion Approval
  was automatic. Slice 11 is now the next approved route.

### Slice 11: Simplify Explorer Host Lifecycle And Action Adapters

- Status: Implementation complete; independently reviewed `Ready` with no
  findings and automatically completion-approved. Eligible for the focused
  completion commit; pending `approval-committer` execution.
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

### Slice 11 Implementation Approval — Completed; Focused Committed

- Status: Implementation complete under the approved boundary; independent
  implementation review returned `Ready` with no findings on 2026-09-08,
  Completion Approval was automatic under the user's proceed-through-slices
  policy, and the exact completion paths were focused-committed as
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`.
- Approved scope: Slice 11 — Simplify Explorer Host Lifecycle And Action
  Adapters, exactly as specified above. Preserve the one-argument opener,
  same-context report handoff, exact source reveal and source revalidation,
  session/action correlation, stale/disposed epochs, payload-size failure,
  context/action registry ownership, unregister-before-release ordering,
  four-mode output identity, display-failed mapping, idempotent disposal, and
  VS Code `^1.75.0` desktop behavior. No new command, wire variant, raw URI/
  content transport, Flow bridge, webview UI, or telemetry behavior is
  authorized.
- Approved paths: `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerReportAction.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerSourceAction.ts`,
  and `src/presentation/vscode/commands/semanticDiffCommand.ts`, with focused
  existing tests `src/test/suite/semanticDiffExplorerPanel.test.ts`,
  `src/test/suite/semanticDiffExplorerRegistry.test.ts`,
  `src/test/suite/semanticDiffExplorerReportAction.test.ts`,
  `src/test/suite/semanticDiffExplorerSourceAction.test.ts`, and
  `src/test/suite/semanticDiffCommand.test.ts`. No Flow wiring, viewer UI,
  configuration, or durable-document path is approved.
- Qlty boundary: resolve only the recorded baseline findings through cohesive
  extraction; no suppression, allowlisting, threshold relaxation,
  generated-ignore edit, or qlty configuration change. Exact assignments are
  `semanticDiffExplorerPanel.ts`: `manyParameters=3`, `manyReturns=2`,
  `functionComplexity=7`, `totalComplexity=1`, `complexBinary=1`,
  `nestedControlFlow=1`; `semanticDiffExplorerRegistry.ts`:
  `functionComplexity=1`; `semanticDiffExplorerReportAction.ts`:
  `manyReturns=1`, `functionComplexity=1`; `semanticDiffExplorerSourceAction.ts`:
  `manyReturns=2`, `functionComplexity=2`; and `semanticDiffCommand.ts`:
  `manyReturns=1`, `functionComplexity=4`, `totalComplexity=1`. Other recorded
  rule families are zero for these files.
- Gate condition: Slice 10 focused completion commit `9acfb577` was present;
  Slice 11's independent `Ready`/no-findings review and automatic Completion
  Approval are recorded below. The exact Slice 11 paths are now focused-
  committed as `628cc9333ed10d540665cb23329a8e7e3c6af6df`.
- Completion commit: `628cc9333ed10d540665cb23329a8e7e3c6af6df` is present.
  Aggregate human approval and Feature Exit approval remain pending, and
  closure drafts remain excluded.
- Next route: Slice 12 is complete and focused-committed; Main delegates
  Slice 13 implementation review after its completed implementation.

### Slice 11 Implementation Evidence (2026-09-08)

- The approved host boundary was implemented without changing the Explorer
  wire, UI, command, Flow, telemetry, or VS Code compatibility contracts.
  Panel installation, transport, request handling, action dispatch, lifecycle
  disposal, HTML generation, report execution, and source execution are
  cohesive same-boundary helpers. The comparison command now delegates its
  editor/read/selection/step/build helpers while preserving its public
  dependency and one-argument opener seams.
- Registry metadata still uses exact session/action membership and record
  occurrence identity. Report actions preserve the same immutable context and
  all four output modes. Source actions preserve pre-open and post-open
  document/version revalidation and reveal behavior. Panel cleanup remains
  idempotent, unregisters borrowed context/action entries before releasing
  source lifetime, advances stale epochs, and suppresses late post/focus.
  Request validation explicitly remains the first gate, including the fixed
  payload-size failure mapping.
- Same-boundary extraction helpers added for auditability are
  `semanticDiffExplorerPanelActions.ts`, `semanticDiffExplorerPanelHtml.ts`,
  `semanticDiffExplorerPanelInstall.ts`,
  `semanticDiffExplorerPanelLifecycle.ts`,
  `semanticDiffExplorerPanelRequests.ts`,
  `semanticDiffExplorerPanelTransport.ts`,
  `semanticDiffExplorerReportActionRunner.ts`,
  `semanticDiffExplorerSourceActionRunner.ts`,
  `semanticDiffCommandBuild.ts`, `semanticDiffCommandEditor.ts`,
  `semanticDiffCommandReading.ts`, `semanticDiffCommandSelection.ts`, and
  `semanticDiffCommandSteps.ts`. No focused test file was changed.
- `pnpm run test:compile`, targeted `pnpm exec qlty smells --no-snippets`
  over all Slice 11 paths and same-boundary helpers, `pnpm exec qlty check`,
  `pnpm run build` (desktop and web production bundles),
  `pnpm run test:desktop:run`, `pnpm run test:web:run`,
  `pnpm run lint:md`, and `git diff --check` passed. The web runner exited
  successfully under the approved host escalation; it emitted transient
  stream-close warnings after the browser smoke completed. Existing webpack
  bundle-size warnings remain unchanged. The repository-wide smell report
  retains only findings in out-of-scope Slice 12-13 files; Slice 11's targeted
  smell result is empty, with no suppression or qlty configuration change.
- Production readiness: desktop/web builds, VS Code `^1.75.0`, browser-safe
  transport, source privacy, action correlation, lifecycle ownership, and
  telemetry boundaries remain unchanged. The six closure drafts remain
  excluded and untouched. Independent implementation review returned `Ready`
  with no findings; the focused completion commit is
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`.

### Slice 11 Completion Gate — Ready; Automatic Completion Approval; Focused Committed

- Review result: independent implementation review returned `Ready` with no
  findings on 2026-09-08.
- Completion Approval: automatically approved under the user's explicit
  proceed-through-slices policy because the implementation review was `Ready`
  with no findings. The focused completion commit is
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`; this update records no stage or
  commit operation.
- Evidence: the targeted Slice 11 smell scan returned zero findings; full
  `qlty check`, TypeScript compilation, desktop/web production builds,
  desktop/web runners, Markdown lint, and diff checks passed. Existing
  webpack bundle-size warnings and repository-wide smells outside Slice 11
  remain unchanged and are assigned to later slices.
- Exact completed paths (20), excluding the six closure drafts, are:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerReportAction.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerSourceAction.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandBuild.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandEditor.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandReading.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSelection.ts`,
  `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelActions.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelHtml.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelInstall.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelLifecycle.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelRequests.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelTransport.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerReportActionRunner.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerSourceActionRunner.ts`.
- Scope guard: no focused tests, Flow/wiring paths, UI paths, configuration,
  telemetry, or closure-draft path was included in this completion commit.
  Slice 12 was the next route and is now complete; Slice 13 implementation is
  complete and awaits independent review. Aggregate human approval and Feature
  Exit approval remain pending.

### Slice 12: Simplify Flow Host Wiring And Viewer Lifecycle Adapters

- Status: Complete; independently reviewed `Ready` with no findings,
  automatically completion-approved, and focused-committed as
  `a7905e8fdd905c506627a83d6c86ed1246255298`.
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

### Slice 12 Implementation Approval — Completed; Focused Committed

- Status: Slice 12 was implementation-approved under the reviewed replan and
  the user's proceed-through-slices policy. Its independent implementation
  review returned `Ready` with no findings, Completion Approval was automatic,
  and the exact completion boundary was focused-committed as
  `a7905e8fdd905c506627a83d6c86ed1246255298`. Slice 13's narrow replan is
  pending independent plan review and a focused replan commit; implementation
  is blocked.
- Approved implementation paths: `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts`,
  `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`,
  `src/bootstrap/extension/semanticDiffWiring.ts`,
  `src/bootstrap/extension/viewerWiring.ts`,
  `src/bootstrap/extension/extensionDependencies.ts`, and
  `src/presentation/vscode/webview/ajsDocument.ts`. Approved focused test
  evidence remains `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/flowViewerController.test.ts`,
  `src/test/suite/flowViewerEffects.test.ts`,
  `src/test/suite/viewerWiring.test.ts`,
  `src/test/suite/AjsDocument.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`. No Slice 13
  presentation path, configuration, or closure-draft path is approved.
- Qlty boundary: resolve only the recorded baseline findings through cohesive
  extraction, with no suppression, allowlist, threshold, generated-ignore, or
  qlty configuration change. Exact assignments are
  `semanticDiffExplorerFlow.ts`: `manyParameters=1`, `manyReturns=5`,
  `functionComplexity=7`, `totalComplexity=1`, `complexBinary=1`;
  `semanticDiffFlowViewerBridge.ts`: `functionComplexity=3`;
  `semanticDiffWiring.ts`: `manyParameters=1`, `manyReturns=1`,
  `functionComplexity=2`, `complexBinary=1`; `viewerWiring.ts`:
  `manyReturns=1`,
  `functionComplexity=4`; `extensionDependencies.ts`:
  `functionComplexity=1`; and `ajsDocument.ts`: `manyParameters=2`,
  `manyReturns=2`, `functionComplexity=4`. Other recorded rule families are
  zero for these files.
- Preserve composition and source freshness exactly: concrete infrastructure
  is constructed only in bootstrap; `semanticDiffFlowViewerBridge.ts` remains
  the sole overlay owner with one overlay per URI; current-source checks,
  owner-token/operation guards, ready/focus/reveal, stale-source,
  supersession/late-clear, unregister-before-release, and normal viewer wiring
  remain unchanged. Parser performance telemetry stays privacy-preserving.
  Desktop/web parity and browser-safe imports remain mandatory; no new viewer
  message variant or architecture exception is authorized.
- Validation gate: focused Flow host/wiring/viewer lifecycle suites,
  architecture dependency rules, desktop smoke, web preparation/build,
  targeted qlty smells, full qlty check, and diff checks. Completion Approval
  is conditionally automatic only after independent implementation review
  returns `Ready` with no findings. This gate was satisfied by the completion
  review and commit recorded above. Main delegates exactly active Slice 13
  next.

### Slice 12 Implementation Evidence (2026-09-08)

- The approved Flow host/wiring boundary was implemented and focused-committed
  after independent review. The public Flow action types remain in
  `semanticDiffExplorerFlow.ts`; same-boundary helpers now own target
  resolution, action preparation, overlay ownership, freshness checks, and
  post/reveal sequencing without adding a message variant or architecture
  exception. The Flow viewer bridge is a bootstrap-owned controller with the
  existing ready/reveal/error behavior and panel/document identity.
- `semanticDiffWiring.ts` now isolates source snapshots, source/document
  freshness, Flow opening, report providers, Explorer composition, and command
  registration. `viewerWiring.ts` preserves the shared WebviewStore, normal
  table/Flow factory lifecycle, pending reveal, navigation telemetry, and
  Flow bridge callbacks. `extensionDependencies.ts` keeps parser-performance
  telemetry application-catalog-only. `ajsDocument.ts` keeps debounce,
  panel-disposal cancellation, callback disposal, and posted-document
  behavior while using an internal lifecycle state object.
- Same-boundary extraction helpers added for qlty remediation are
  `semanticDiffExplorerFlowAction.ts`,
  `semanticDiffExplorerFlowActionPreparation.ts`,
  `semanticDiffExplorerFlowOverlayRegistry.ts`, and
  `semanticDiffExplorerFlowTargets.ts`. The focused Flow test updates registry
  calls to the cohesive options form and adds the reviewed stale-after-ready
  regression; no new test protocol or wire contract was introduced.
- The implementation-review freshness finding is resolved: the Flow action
  passes its source-freshness guard into `openReadyFlowTarget`, which checks
  immediately after `panel.ready` before relation/target validation. A stale
  source therefore returns `flow-not-ready` even when the ready document also
  lacks the target; the existing final pre-overlay freshness guard remains.
  `semanticDiffExplorerFlow.test.ts` covers this stale-after-ready plus
  missing-target race and asserts no messages are posted.
- Targeted `pnpm exec qlty smells --no-snippets` over all six approved files,
  same-boundary helpers, and the focused Flow test returned zero findings.
  `pnpm exec qlty check` returned `No issues`; no qlty suppression,
  allowlist, threshold, generated-ignore, configuration, or architecture
  exception was changed. The repository-wide smell scan retains only the
  pre-existing Flow webview findings outside Slice 12's approved boundary.
- Validation passed `rtk pnpm run test:compile`, desktop preparation and the
  compiled desktop runner (exit 0), web preparation, the escalated web runner
  (exit 0), production `rtk pnpm run build`, and `git diff --check`. The web
  runner emitted transient stream-close warnings after smoke; existing
  webpack bundle-size warnings remain unchanged. Every changed runtime,
  helper, and focused-test path was formatted with `qlty fmt`.
- Production-readiness evidence remains positive for VS Code `^1.75.0`,
  desktop/web bundles, browser-safe imports, bootstrap-only concrete
  construction, one-overlay-per-URI ownership, owner/operation stale guards,
  source freshness, unregister-before-release, normal viewer wiring, and
  privacy-preserving telemetry. The lifecycle/concurrency matrix and shared
  WebviewStore identity were verified by the independent review. No unresolved
  scope or design change was discovered; focused completion commit
  `a7905e8fdd905c506627a83d6c86ed1246255298` is recorded.

### Slice 12 Completion Gate — Ready; Automatic Completion Approval; Focused Committed

- Independent implementation review returned `Ready` with no findings on
  2026-09-08. Under the user's explicit proceed-through-slices policy,
  Completion Approval is automatically approved for this slice. The exact
  completion boundary is the following 13 paths only:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/bootstrap/extension/extensionDependencies.ts`,
  `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`,
  `src/bootstrap/extension/semanticDiffWiring.ts`,
  `src/bootstrap/extension/viewerWiring.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts`,
  `src/presentation/vscode/webview/ajsDocument.ts`,
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlowAction.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlowActionPreparation.ts`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlowOverlayRegistry.ts`,
  and
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlowTargets.ts`.
- Completion evidence is recorded above: targeted qlty smells returned zero
  findings, full `qlty check` returned `No issues`, TypeScript compilation,
  desktop runner, web preparation/build, escalated web runner, Markdown lint,
  formatting, and `git diff --check` passed. The freshness review finding is
  closed by the post-`panel.ready` guard and its stale-after-ready plus
  missing-target regression; the final pre-overlay freshness guard remains.
- The focused completion commit is
  `a7905e8fdd905c506627a83d6c86ed1246255298`; this update performs no stage or
  commit operation. Slice 13 implementation is complete and awaits independent
  review. Closure drafts remain
  excluded and untouched; aggregate human approval and Feature Exit approval
  remain pending.

### Slice 13: Simplify Flow/Shared MUI Presentation Components

- Status: Implementation review returned `Ready` with no findings on
  2026-09-08, and Completion Approval is automatic under the user's
  proceed-through-slices policy. The exact focused completion commit is
  eligible and pending; no completion commit has been created. The narrow
  canonical-theme replan commit is `d0cc7815`, and Slice 12's focused
  completion commit `a7905e8fdd905c506627a83d6c86ed1246255298` is present.
- Scope: resolve remaining qlty smells in `FlowContents.tsx`,
  `FlowGraphCanvas.tsx`, `flowGraphView.ts`, `flowMiniMap.ts`,
  `AjsNode.tsx`, and the related `TableContents.tsx` duplication by extracting
  cohesive render/state helpers and by extending the existing canonical
  `src/presentation/webview/shared/muiTheme.ts` with a backward-compatible,
  mode-aware factory/options API. Preserve the existing
  `semanticDiffExplorerTheme` export and behavior; Flow/Table consume the same
  tokens and policy without a second theme. Preserve Flow keyboard/focus,
  node/edge semantics, high-contrast/pattern/legend states, MiniMap behavior,
  ordinary table rendering, and the new Explorer accessibility baseline.
- User / Domain Value: existing Flow/table surfaces remain readable and
  accessible while feature-touched presentation code has no qlty smells or
  duplicated theme logic.
- Cohesive Change Group: webview Flow/table presentation helpers, the
  canonical MUI theme API extension, focused theme/Explorer tests, and Flow
  view/node/component tests.
- Acceptance: qlty reports no smell or duplication findings for the touched
  Flow/table/theme files; `createSemanticDiffTheme(options)` supports the
  approved light/dark mode options while `semanticDiffExplorerTheme` remains
  backward-compatible. All Flow state labels, patterns, badges, relation
  non-focusability, keyboard navigation, high contrast, MiniMap colors,
  Explorer `確認が必要` filtering, tree semantics, WCAG 2.2 AA behavior, and
  table regressions remain unchanged. Shared MUI helpers do not import host or
  parser contracts.
- Validation: Flow component/view/accessibility/axe tests, table regression
  tests, manual keyboard/focus/forced-colors checks, desktop/web bundles and
  smoke, `pnpm run qlty:smells`, qlty check, and diff checks. Evidence is
  recorded in `TRACEABILITY.md`; no completion commit has been created.
- Production Readiness: no color-only state, no unbounded render work, no
  bundle/CSP regression, and unchanged non-diff Flow/table behavior.
- Approval Boundary: webview presentation/refactoring and the backward-
  compatible canonical MUI theme API extension only. No semantic model,
  viewer wire, layout/search redesign, second theme, or telemetry change.
- Dependencies: Slices 5 and 12 plus completed Flow overlay/document work.
- Risks: mode-aware theme factory extraction can alter existing table/Flow
  tokens or accidentally break the Explorer export; render helper boundaries
  can change focus timing. Existing Flow/table DOM/axe, focused theme, and
  desktop/web tests are the gate.
- Out of Scope: new product behavior, source/report actions, comparison rules,
  qlty suppression/allowlisting, and durable docs.

### Slice 13 Implementation Approval — Plan Approved; Focused Replan Commit Present

- Status: The narrow Slice 13 plan replan returned final independent `Ready`
  with no findings and Human Approval was granted on 2026-09-08 under the
  trusted messages `承認します。` and repeated `継続して。`. Focused replan
  commit `d0cc7815` is present; implementation review returned `Ready` with no
  findings on 2026-09-08 and Completion Approval is automatic. The focused
  completion commit is eligible and pending; aggregate human approval and
  Feature Exit approval remain pending; the six closure drafts remain excluded
  and untouched.
- Approved implementation paths are exactly
  `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`,
  `src/presentation/webview/editor/ajsFlow/FlowGraphCanvas.tsx`,
  `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`,
  `src/presentation/webview/editor/ajsFlow/flowMiniMap.ts`,
  `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`, and
  `src/presentation/webview/editor/ajsTable/TableContents.tsx`, and
  `src/presentation/webview/shared/muiTheme.ts` as the Slice-5-owned
  canonical theme API path. Focused theme evidence is
  `src/test/suite/muiTheme.test.ts` (new focused factory/export tests), while
  `src/test/suite/semanticDiffExplorerDom.test.tsx` remains the Explorer
  regression. Existing Flow/Table evidence remains
  `src/test/suite/flowGraphView.test.ts`,
  `src/test/suite/flowMiniMap.test.ts`,
  `src/test/suite/ajsTableGlobalFilter.test.ts`,
  `src/test/suite/ajsTableHeader.test.ts`,
  `src/test/suite/semanticDiffExplorerDom.test.tsx`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- Qlty boundary: resolve only the recorded Flow/shared-presentation findings
  through cohesive render/state/style extraction. The baseline assignments
  are `FlowContents.tsx`: `manyReturns=2`, `functionComplexity=3`,
  `totalComplexity=1`, `D=1`; `FlowGraphCanvas.tsx`:
  `functionComplexity=2`; `flowGraphView.ts`: `manyReturns=1`,
  `functionComplexity=3`; `AjsNode.tsx`: `functionComplexity=4`; and no
  standalone baseline finding is recorded for `flowMiniMap.ts` or
  `TableContents.tsx` (their touched-delta duplication/style checks remain
  mandatory). `muiTheme.ts` has no historical baseline count; its new factory
  and all touched-delta files must be qlty-clean. No suppression, allowlist,
  threshold, generated-ignore, or qlty configuration change is authorized.
- Preserve the existing MUI/WCAG and Explorer contracts: consume, do not
  duplicate or redefine, `muiTheme.ts`; retain Explorer localization,
  `確認が必要` tree filtering, stable row/record attributes, latent-selection
  restoration, cards, zero-match status, keyboard/focus semantics, and the
  complete WCAG 2.2 AA evidence. Preserve Flow node/edge semantics,
  relation non-focusability, state labels, patterns, legend/high-contrast and
  forced-colors behavior, MiniMap colors, ordinary table rendering, and
  localization. No viewer wire, semantic model, layout/search redesign,
  telemetry, or architecture exception is authorized.
- Validation gate: Flow component/view, Explorer DOM/axe, table regression,
  architecture dependency, manual keyboard/focus/forced-colors/contrast,
  target-size, reflow, status, and WCAG checks, MUI/Emotion bundle and static
  CSP smoke, desktop/web bundles and smoke, targeted qlty smells, full qlty
  check, and diff checks. Completion Approval is conditionally automatic only
  after the implementation review returns `Ready` with no findings. The
  focused replan commit paths were only
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`; no completion
  commit has been created.

### Slice 13 Completion Gate — Ready; Automatic Approval; Commit Pending

- Independent implementation review returned `Ready` with no findings on
  2026-09-08. Under the user's explicit proceed-through-slices policy,
  Completion Approval is automatically approved for Slice 13. The focused
  completion commit is eligible and pending; this update performs no stage or
  commit operation.
- The exact nine completion paths are only:
  `docs/specs/features/semantic-diff-explorer/TASKS.md`,
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`,
  `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`,
  `src/presentation/webview/editor/ajsFlow/FlowGraphCanvas.tsx`,
  `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`,
  `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`,
  `src/presentation/webview/editor/ajsTable/TableContents.tsx`,
  `src/presentation/webview/shared/muiTheme.ts`, and
  `src/test/suite/muiTheme.test.ts`. `flowMiniMap.ts` was reviewed but is
  unchanged and is therefore excluded from the focused completion commit.
- Evidence is complete: targeted qlty smells found no findings, full qlty
  check returned `No issues`, the changed paths were formatted, and targeted
  ESLint, TypeScript compilation, Markdown lint, and `git diff --check` passed.
  Focused Flow/theme coverage passed 48 tests and the isolated Explorer
  DOM/axe suite passed 13 tests, including actual-session `確認が必要`
  filtering, zero-match status, latent selection restoration, tree semantics,
  reflow, contrast, and focus contracts. The shared theme factory/export,
  MUI/WCAG 2.2 behavior, Flow accessibility/high-contrast behavior, and
  desktop/web production builds remain verified. Existing table follow-up
  mismatches and web-runner stream warnings remain documented as pre-existing
  risks and are outside this completion cleanup.
- The six closure drafts remain excluded and untouched. Aggregate human
  approval and Feature Exit approval remain pending; the next route is the
  exact focused completion commit through `approval-committer`.

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

## Feature Exit Superseded By Slice 16/17 Presentation And Composition Replan

The post-Slice-15 `Close` recommendation is retained as historical evidence
for Slices 1-15 only. The user's presentation-placement assessment identified
two remaining architecture/composition-root violations and duplicated
Semantic Diff/Viewer ownership in the VS Code adapter. This is an explicit
replanning trigger within the feature purpose: improve the already-delivered
Explorer implementation without changing comparison semantics or moving the
host-independent report and webview surfaces. Feature Exit is temporarily
reopened; the six uncommitted closure-draft paths remain protected and
excluded until Slices 16 and 17 are complete and the exit review is rerun.

## Current Replanning Boundary (Slices 16-17)

- Trigger: the Feature Exit evidence still records the source-index allocator
  constructed inside `AntlrAjsParser`, the source-handle allocator fallback in
  the Semantic Diff command path, and the Explorer panel's module-scoped
  session/action allocators plus its manually reserved `1_000_000_000` output
  action range. The same assessment found that the VS Code Semantic Diff
  adapter mixes panel, Flow, report, source, registry, and HTML concerns at
  one directory level, duplicates Explorer bundle constants beside the generic
  Flow/Table viewer constants, and leaves an unused Explorer branch in the
  generic viewer bundle resolver.
- Planned change: add Slice 16 for Bootstrap-owned allocator construction,
  explicit injection, and composition-root detection through direct and
  re-exported application factories; add Slice 17 for category-based internal
  placement and Explorer-specific constant ownership. Keep
  `src/presentation/semantic-diff` and
  `src/presentation/webview/semantic-diff` in their current locations and
  responsibilities.
- Approved plan boundary: only the allocator/composition paths, VS Code
  Semantic Diff adapter paths, the architecture-rule helper/tests, affected
  import-path tests, and focused build/qlty evidence listed by Slices 16-17.
  No comparison rule, parser grammar, source-index DTO, capture protocol,
  Explorer message, report schema, Flow wire variant, UI renderer, MUI theme,
  telemetry, dependency, engine-floor, or durable-document behavior changes.
- Dependencies: Slices 1-15 and formatter reconciliations 7A/9A remain
  complete and focused-committed. Slice 16 is independently reviewable and
  must be completed and committed before Slice 17 begins; Slice 17 then
  restores the final Feature Exit entry condition.
- Approval boundary: the user-provided plan explicitly approves this exact
  two-slice replan on 2026-09-10. Independent Plan Review returned `Ready`
  with no findings, and the user's explicit message
  `PLEASE IMPLEMENT THIS PLAN` records Human Approval for this exact boundary.
  The focused plan-gate commit remains required before implementation. Each
  implementation slice receives an independent review; a
  `Ready`/no-findings result permits the standing automatic Completion Approval
  policy, while Findings suspend
  that slice and route remediation through Main.
- Protected paths: do not modify, stage, or commit `CHANGELOG.md`,
  `README.en.md`, `README.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, or
  `docs/specs/roadmap.md` during either slice. Their existing Feature Exit
  draft changes remain intact for the later aggregate Closure Approval.

### Slice 16/17 Plan Review And Human Approval (2026-09-10)

- Independent Plan Review: `Ready`; Findings: none.
- Human Approval: the trusted user message `PLEASE IMPLEMENT THIS PLAN`
  approves the exact Slice 16/17 replan boundary.
- Exact plan-gate paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`.
- The focused plan-gate commit is still pending. This record does not
  authorize implementation outside the reviewed boundary and does not modify,
  stage, or commit the six closure drafts.

### Slice 16: Bootstrap Allocator Injection And Composition-Root Detection

- Status: Implemented; independent implementation review and Completion
  Approval remain pending. The implementation stays within the approved
  Slice 16 boundary and has not been staged or committed.
- Scope: construct one extension-lifetime source-index allocator,
  source-handle allocator, capture-scope allocator, Explorer session
  allocator, and Explorer action allocator in Bootstrap. Inject the
  source-index allocator into every production `AntlrAjsParser` construction,
  the source-handle allocator into the Semantic Diff command dependencies,
  the capture-scope allocator into the source-capture factory, and the
  session/action allocators into the Explorer opener/panel dependencies. The
  injected action allocator supplies both leaf actions and the Markdown/
  output action; remove the panel module globals and the `1_000_000_000`
  manual range. Make all production allocator dependencies explicit: remove
  parser, command, source-capture, and application-projection fallbacks and
  require the production session/action allocator options. Application tests
  create and pass explicit allocators for every projection/capture/parser
  fixture; every production host call passes the Bootstrap-owned allocators.
- Scope details: update
  `src/bootstrap/extension/extensionDependencies.ts` and
  `semanticDiffWiring.ts`, `src/application/semantic-diff/
semanticDiffExplorerProjection.ts`,
  `src/application/semantic-diff/semanticDiffSourceCapture.ts`,
  `src/infrastructure/parser/AntlrAjsParser.ts`,
  `src/presentation/vscode/commands/semanticDiffCommand.ts` and
  `semanticDiffCommandBuild.ts`, and
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`.
  Update constructor/dependency fixtures in the parser, command, projection,
  source-capture, and panel suites without changing DTOs, message shapes,
  persistence, or the `AjsParserPort.parse(content)` compatibility seam.
- Production allocator call-site inventory: the only permitted allocator
  construction calls after this slice are the five Bootstrap calls in
  `src/bootstrap/extension/extensionDependencies.ts`:
  `createSemanticDiffSourceIndexIdAllocator()`,
  `createSemanticDiffSourceHandleIdAllocator()`,
  `createSemanticDiffCaptureScopeIdAllocator()`,
  `createSemanticDiffExplorerSessionIdAllocator()`, and
  `createSemanticDiffExplorerActionIdAllocator()`.
  `semanticDiffWiring.ts` only forwards those values. The current calls to
  `createSemanticDiffCaptureScopeIdAllocator()` in
  `semanticDiffSourceCapture.ts`, `createSemanticDiffSourceIndexIdAllocator()`
  in `AntlrAjsParser.ts`, `createSemanticDiffSourceHandleIdAllocator()` in
  `semanticDiffCommandBuild.ts`, and the session/action allocator calls in
  `semanticDiffExplorerPanel.ts` and
  `semanticDiffExplorerProjection.ts` are all removed; no other production
  `create*Allocator()` call site is permitted outside Bootstrap.
- Application/test allocator fixtures: update
  `src/test/suite/semanticDiffExplorerProjection.test.ts`,
  `semanticDiffSourceCapture.test.ts`,
  `semanticDiffExplorerRegistry.test.ts`,
  `semanticDiffExplorerSourceAction.test.ts`, and the semantic-diff command/
  parser/panel suites plus `src/test/support/parseAjs.ts` so each creates and
  passes the allocator it needs explicitly. Tests must not rely on a removed
  production default or module-scoped allocator.
- Architecture guard: extend
  `src/test/support/architectureDependencyRules.ts` so imported application
  factory calls resolve direct imports, named aliases, namespace imports, and
  transitive `export { ... } from`/`export * from` re-exports with cycle-safe
  resolution. Add fixture assertions in
  `src/test/suite/architectureDependencyRules.test.ts`, including a static
  production scan that fails when any non-Bootstrap source calls an imported
  `create*Allocator()` factory. Require the full production dependency suite
  to report zero composition-root violations; do not add an allowlist or
  exception.
- User / Domain Value: every concurrent Explorer session and action receives
  a unique extension-owned opaque ID, parser/source-index IDs remain unique
  across parser instances, and concrete construction is visible at the
  composition root. Semantic Diff behavior, source capture, report output,
  and Flow handoff remain unchanged.
- Acceptance: no production source-index/source-handle/capture-scope/session/
  action allocator is constructed outside Bootstrap; no parser/command/
  source-capture/projection/panel fallback or manual output range remains;
  production session/action APIs require explicit allocators; two concurrently
  opened Explorer sessions have pairwise-distinct session/action IDs,
  including output actions; the full architecture dependency suite reports
  zero composition-root violations, detects a re-exported factory, and fails
  for a non-Bootstrap `create*Allocator()` call in its static regression
  fixture; Application tests pass explicit allocator instances; existing
  parser diagnostics, source capture/release, command error classification,
  Explorer lifecycle, report, source, and Flow tests remain green.
- Validation: run focused parser, source-capture, command, projection, panel,
  and architecture suites; `rtk pnpm run test:compile`; the compiled desktop
  runner; web preparation and production build because bootstrap/entry wiring
  is shared; targeted and full `rtk pnpm run qlty`/smells; Markdown lint and
  `rtk git diff --check`. Browser smoke remains claimable only on a host that
  passes the known Chromium bootstrap permission gate.
- Production Readiness: VS Code `^1.75.0`, Node `>=20`, desktop/web parity,
  browser-safe production imports, JP1/AJS parsing/normalization and malformed
  input diagnostics, opaque ID brands/prefixes, action-time no-reparse,
  telemetry privacy, CSP, and cleanup/idempotency remain unchanged. No
  `url.parse()` migration or dependency update is included.
- Approval Boundary: exactly Bootstrap construction/injection, production
  dependency requiredness, panel output-action allocation, architecture
  re-export detection, and their focused tests. No Slice 17 file relocation,
  generic viewer constant change, durable-document propagation, or
  feature-folder removal is part of Slice 16.
- Risks: shared allocator lifetime could reset on repeated wiring, a parser
  instance could receive a different namespace, capture scopes could collide,
  action allocation could omit output actions, or re-export/allocator
  traversal could create false positives or cycles. Extension-lifetime
  construction, prefix/membership assertions, explicit test allocators,
  concurrent opener tests, and cycle-safe static fixtures are required.
- Out of Scope: `src/presentation/semantic-diff`,
  `src/presentation/webview/semantic-diff`, comparison/parser grammar/domain
  rules, transport/report schemas, Flow rendering, UI/theme changes, generic
  viewer placement, telemetry, dependencies, README/CHANGELOG/use-case/
  roadmap changes, and closure-folder removal.

### Slice 16 Implementation Result (2026-09-10)

- Bootstrap now creates one extension-lifetime allocator for each source
  index, source handle, capture scope, Explorer session, and Explorer action,
  then forwards those exact instances through Semantic Diff wiring. Parser,
  command, source capture, projection, and Explorer panel production APIs no
  longer create module/default/fallback allocators; output actions use the
  same injected action allocator as leaf actions.
- Application test fixtures now pass explicit parser, capture, session, and
  action allocators. The architecture collector resolves named aliases,
  namespace bindings, transitive `export { ... } from`/`export * from`
  chains, and cyclic re-exports safely. Its production scan rejects
  non-Bootstrap imported `create*Allocator()` calls and reports zero
  composition-root violations for the current production graph.
- Acceptance evidence: compiled desktop tests exit 0; `rtk pnpm run
test:compile`, `rtk pnpm run test:prepare:desktop`, `rtk pnpm run
test:prepare:web`, and `rtk pnpm run build` pass. `rtk pnpm run qlty:check`
  reports `No issues`; `rtk pnpm run qlty:smells` completes with zero
  findings; Markdown lint and `rtk git diff --check` pass. Web browser smoke
  remains environment-gated by the known Chromium bootstrap permission
  restriction and was not claimed.
- Review handoff: return the exact runtime/test/documentation diff and this
  evidence to `implementation-reviewer`; no completion commit is authorized
  until an independent `Ready` result and the standing no-findings approval
  gate are recorded.

### Slice 16 Review Remediation (P3, 2026-09-10)

- Finding: the `beginSemanticDiffSourceCapture` JSDoc described an optional
  parser even though Slice 16 requires explicit parser and capture-scope
  allocator injection.
- Remediation: corrected the JSDoc to state that both dependencies are
  required; runtime behavior and the approved Slice 16 boundary are
  unchanged.

### Slice 16 Completion Approval (2026-09-10)

- Independent implementation review returned `Ready` with no findings after
  the P3 JSDoc remediation. Under the user's standing no-findings policy,
  Completion Approval is automatically recorded for the exact Slice 16
  boundary.
- Final validation remains green: `rtk pnpm run test:compile`, compiled
  desktop runner (exit 0), `rtk pnpm run qlty:check` (`No issues`), `rtk
pnpm run qlty:smells` (zero findings), and `rtk git diff --check` passed.
  The known managed Chromium bootstrap permission restriction remains the
  only unclaimed web-smoke boundary.
- Exact completion paths are limited to the Slice 16 runtime files under
  `src/application/semantic-diff/`, `src/bootstrap/extension/`,
  `src/infrastructure/parser/`, and
  `src/presentation/vscode/{commands,semantic-diff}/`; the updated parser,
  command, source-capture, Explorer, extension, and architecture tests under
  `src/test/`; and this feature's `TASKS.md` and `TRACEABILITY.md`. Slice 17
  files and the six protected closure drafts are excluded.
- Slice 16 is completion-approved and eligible for its focused completion
  commit; no commit or staging was performed in this handoff.

### Slice 17: VS Code Semantic Diff Adapter Placement And Constant Ownership

- Status: Implemented after Slice 16's focused completion commit. Implementation
  review identified P1 tracking loss for the three new `report` files; this
  narrow replan preserves the implementation and is pending independent plan
  re-review before Completion Approval. No commit or staging was performed for
  Slice 17.
- Scope: keep `src/presentation/vscode/semantic-diff` as the public adapter
  boundary while placing implementation modules under `panel`, `flow`,
  `report`, and `source`. `panel` owns panel lifecycle, requests, transport,
  HTML, actions, and the context/action registry; `flow` owns Flow action,
  target, preparation, and overlay modules; `report` owns report document and
  Explorer report action modules; `source` owns source action modules.
  Exactly three root files remain public facades:
  `semanticDiffExplorerPanel.ts`, `semanticDiffExplorerFlow.ts`, and
  `semanticDiffExplorerRegistry.ts`. They may only re-export their category
  implementations (the Panel facade also re-exports panel constants). Update
  report/source consumers and tests to category paths; no old flat
  implementation file may be imported directly.
- Constant ownership: place the dedicated Explorer constants module at
  `src/presentation/vscode/semantic-diff/panel/
semanticDiffExplorerConstants.ts`; Panel creation and Explorer HTML
  generation must use it, and the Panel facade re-exports its public values.
  Remove the Explorer constants and Explorer switch branch from
  `src/presentation/vscode/webview/constant.ts`; the generic resolver and
  `mountViewerPanel` remain Flow/Table-only. Webpack entry names and the
  Explorer bundle URI remain unchanged.
- Tracking boundary: preserve the general `.gitignore` `report/` exclusion and
  add only the exact source-directory negations
  `!src/presentation/vscode/semantic-diff/report/` and
  `!src/presentation/vscode/semantic-diff/report/**`. The three report
  implementation files are therefore normal Git candidates without unignoring
  any other report output directory.
- User / Domain Value: maintainable VS Code host code makes panel/Flow/report/
  source ownership visible, and one Explorer constant source prevents panel/
  HTML/bundle drift without moving the host-independent report or React/MUI
  surfaces.
- Acceptance: all existing external Panel/Flow/Registry imports resolve
  through exactly the three named root facades; every other root import of a
  former flat implementation path is zero; category-local imports resolve
  without cycles; report/source tests and Bootstrap wiring use the classified
  paths; the generic viewer constants expose only Flow/Table and reject an
  Explorer view type; Explorer panel HTML still emits the same CSP, nonce,
  session/action attributes, and bundle URI; Flow/Table panel creation and
  bundle resolution are behaviorally unchanged; webpack desktop/web entries
  remain unchanged. The three new report files
  `src/presentation/vscode/semantic-diff/report/semanticDiffExplorerReportAction.ts`,
  `src/presentation/vscode/semantic-diff/report/semanticDiffExplorerReportActionRunner.ts`,
  and `src/presentation/vscode/semantic-diff/report/semanticDiffReportDocument.ts`
  appear in status and are addable; no unrelated report directory becomes
  unignored. The Slice 17 completion staged manifest contains those three
  additions together with the corresponding old-flat report deletions.
- Validation: run focused Explorer panel/Flow/report/source, viewer-bundle,
  wiring, and architecture suites; `rtk pnpm run test:compile`; desktop
  preparation and compiled runner; web preparation and production build;
  targeted/full qlty checks and smells; Markdown lint and
  `rtk git diff --check`. Extend
  `src/test/suite/architectureDependencyRules.test.ts` with executable static
  placement checks that assert the root file set is exactly the three facades,
  permit old-root imports only for those facades, report zero direct imports
  of moved flat implementations, and traverse the
  `panel`/`flow`/`report`/`source` module graph with zero cycles.
  Add a Git tracking check that confirms `git check-ignore` no longer matches
  the three exact source files, the generic `report/` exclusion still matches
  non-source report output, and the path-scoped command
  `git status --short --untracked-files=all --
  src/presentation/vscode/semantic-diff/report/` exposes exactly those three
  new files. Verify the completion staged manifest
  contains the old-flat report deletions and these three additions. Retain
  CSP/no-remote-asset assertions. Browser smoke remains explicitly
  environment-bounded when Chromium cannot pass bootstrap check-in.
- Production Readiness: no change to Explorer data/session/action contracts,
  Flow graph or message protocol, MUI/WCAG behavior, report modes, source
  validation, desktop/web compatibility, CSP, or privacy telemetry. The two
  host-independent presentation directories remain untouched and no durable
  user documentation or CHANGELOG update is needed for this internal
  placement refactor.
- Approval Boundary: exactly the four VS Code adapter category directories,
  root facades, Explorer constants, generic Flow/Table constant cleanup,
  affected import/test paths, `.gitignore`, and the three report files listed
  above. The only `.gitignore` additions are the two exact source-directory
  negations. No allocator construction, application/parser behavior,
  report/output semantics, or closure-draft propagation is part of Slice 17.
- Risks: an incomplete one of the three facade exports, stale relative
  import, hidden old-root import, accidental category cycle, or generic viewer
  constant removal could break desktop/web loading. Facade export parity,
  exact bundle URI/CSP assertions, fixed root/old-path/cycle architecture
  checks, and Flow/Table regression tests are required.
- Out of Scope: moving `src/presentation/semantic-diff` or
  `src/presentation/webview/semantic-diff`, Composition Root allocator work
  from Slice 16, comparison/parser/domain/transport changes, MUI redesign,
  dependency/engine changes, durable-doc edits, and feature-folder removal.

### Slice 17 Implementation Result (2026-09-10)

- Moved VS Code Semantic Diff host implementations into the approved
  `panel`, `flow`, `report`, and `source` categories. The three root files
  remain facades only; Explorer constants are centralized under
  `panel/semanticDiffExplorerConstants.ts` and are shared by Panel creation
  and Explorer HTML. Generic Flow/Table viewer constants no longer contain an
  Explorer branch.
- Updated Bootstrap, tests, and internal category imports while preserving
  external facade imports, Explorer CSP/nonce/session/action attributes,
  bundle URI, Flow/Table behavior, and the two protected host-independent
  presentation directories.
- Architecture regression tests now assert the exact root facade set, zero
  direct imports of moved flat modules, and zero category import cycles.
- Validation passed desktop/web preparation, the compiled desktop runner
  (exit 0), production build, `rtk pnpm run test:compile`, `rtk pnpm run
qlty:check` (`No issues`), `rtk pnpm run qlty:smells` (zero findings), and
  `rtk git diff --check`. Existing webpack asset-size warnings remain
  informational. Browser smoke remains environment-gated by the known
  Chromium bootstrap permission restriction.
- Review handoff: implementation review is the next route; no completion
  commit is authorized until the P1 narrow replan receives independent plan
  re-review, then implementation re-review returns `Ready` and the recorded
  approval gate is satisfied.

### Slice 17 Review Remediation (P1, 2026-09-10)

- Finding: the existing `.gitignore` `report/` rule also ignores the three new
  source files under `src/presentation/vscode/semantic-diff/report/`, so the
  Slice 17 completion manifest cannot carry their additions.
- Narrow replan: retain the general `report/` output exclusion and add only
  `!src/presentation/vscode/semantic-diff/report/` plus
  `!src/presentation/vscode/semantic-diff/report/**`. Preserve all existing
  Slice 17 placement, facade, constant, bundle, and runtime behavior.
- Approved paths: `.gitignore`; the three new report files
  `src/presentation/vscode/semantic-diff/report/semanticDiffExplorerReportAction.ts`,
  `src/presentation/vscode/semantic-diff/report/semanticDiffExplorerReportActionRunner.ts`,
  and `src/presentation/vscode/semantic-diff/report/semanticDiffReportDocument.ts`;
  the corresponding old-flat report deletions already in the Slice 17
  completion manifest; and the Slice 17 tests/architecture evidence. The six
  closure drafts remain excluded.
- Re-review evidence: prove the three files are visible to normal Git status
  and `git add`, no unrelated report path is unignored, and the completion
  staged manifest contains both the old-flat deletions and all three new
  additions. No `.gitignore` implementation, runtime, staging, or commit is
  performed by this replan handoff.

### Slice 17 P1 Narrow Replan Approval (2026-09-10)

- Independent Plan Review: `Ready`; Findings: none.
- Human Approval: the user's explicit implementation instruction
  `PLEASE IMPLEMENT THIS PLAN` includes the approved `report` classification;
  making that exact source directory Git-trackable is the minimum scope
  correction required to deliver the approved Slice 17 plan, not a new design
  or behavior change.
- Standing proceed-through-slices intent: the user's standing instruction
  automatically permits the next slice approval when its independent review
  has no findings. That intent is recorded as supporting this no-findings
  remediation route only; it does not broaden the exact `.gitignore` and
  report-file boundary or remove the subsequent implementation review gate.
- Exact plan-gate paths:
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`.
- The plan-gate commit remains pending. No `.gitignore`, runtime, test,
  generated-artifact, staging, or commit change is made here, and the six
  closure drafts remain protected.

## Slice 16/17 Exit Route

After both focused completion commits, rerun Feature Exit against Slices 1-17.
The exit must include zero composition-root violations, direct/re-export
factory detection evidence, facade/import-cycle evidence, unchanged Flow/Table
and Explorer bundle behavior, qlty/build/desktop/web checks, and the existing
WCAG/filter/source/Flow/report readiness evidence. Only a renewed `Close`
recommendation may return the feature to Main for the single aggregate human
approval and explicit Closure Approval covering the six protected durable
paths plus selected feature-folder removal. No closure propagation is part of
this replan.

## Feature Exit Superseded By Slice 15 Color Regression Replan

The post-Slice-14 `Close` recommendation is retained as historical evidence
for completed Slices 1-14 only. The reported Explorer color regression
reopens the feature because the shared factory applies fixed dark colors in
light mode, the Explorer uses a fixed singleton in loading and loaded views,
and Explorer surfaces override MUI with VS Code/custom colors. Slice 15 is
the smallest presentation/theme repair. Its implementation and completion
gates must pass before Feature Exit is rerun; the six uncommitted
closure-draft paths remain protected and excluded.

## Current Narrow Replan Boundary (Slice 15)

- Trigger: post-Slice-14 Feature Exit investigation found a user-visible color
  regression in Semantic Diff Explorer. `createSemanticDiffTheme({ mode:
"light" })` currently applies a fixed dark palette after selecting the mode,
  and both loading and loaded Explorer views use the singleton light theme.
  Explorer global styles, panel HTML, card borders, and selected tree rows
  also override MUI with VS Code token/custom colors. The result is a light
  theme with dark surfaces/text and mismatched MUI/body colors; the same
  standard-MUI rule applies to every supported theme, including dark and
  high-contrast/forced-colors modes.
- Planned change: make the shared factory use MUI's standard light/dark
  palette by default, removing non-essential custom palette, background, text,
  component color, and VS Code token overrides from the Explorer path. Retain
  only WCAG necessities: 44px primary targets, 2px visible focus, and
  forced-colors system colors. Explorer loading and loaded providers must use
  the resolved mode instead of the fixed singleton. Add a browser-safe mode
  resolver that follows available host signals (standard theme class/data
  attributes and `prefers-color-scheme`) and observes feasible live changes;
  do not add a semantic comparison or session-protocol dependency merely to
  transport theme state.
- Approved replan boundary: `src/presentation/webview/shared/muiTheme.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx`,
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanelHtml.ts`,
  `src/presentation/webview/semantic-diff/semanticDiffExplorerThemeMode.ts`,
  and focused `muiTheme`, `semanticDiffExplorerThemeMode`, Explorer DOM/axe,
  and panel tests. Existing Flow/Table consumers remain on the same shared
  factory and receive regression coverage; application/domain/host capture,
  comparison,
  transport, and session contracts are unchanged.
- Validation boundary: verify light and dark themes retain MUI standard
  palette values, Explorer follows mode changes when the host exposes a
  supported signal, and high-contrast/forced-colors retains system colors.
  Prove no non-essential VS Code color tokens or fixed dark values remain in
  the Explorer theme/global/panel/tree/card paths. Test text/background,
  selection, border, and focus contrast/perceivability, 44px target sizing,
  2px focus visibility, WCAG non-color state cues, reflow, CSP, desktop/web
  bundles, focused DOM/axe behavior, Flow/Table regressions, qlty, Markdown,
  and diff checks.
- Production readiness: preserve MUI 7, Emotion/CSP/no-remote-assets,
  VS Code `^1.75.0`, desktop/web parity, keyboard/focus behavior, semantic
  state labels, high-contrast/forced-colors behavior, and all Explorer data,
  action, filter, report, source, and Flow contracts. If no live host mode
  signal is available in a target webview, the resolver must fall back
  deterministically without claiming unsupported live-follow behavior.
- Approval boundary: one independently reviewable presentation/theme slice;
  no application/domain/parser change, semantic-diff protocol change, source
  capture change, new renderer, dependency/engine change, qlty suppression,
  telemetry change, or closure-draft propagation.
- Dependencies: completed Slices 5, 12, 13, and 14 plus the existing WCAG and
  actual-session filter evidence. Slice 15's independent plan review is
  `Ready` with no findings and Human Approval is automatically recorded under
  the user's standing policy; its focused plan-gate commit is the next route.
  After that commit, Slice 15 must pass implementation review and automatic
  Completion Approval when `Ready` with no findings before Feature Exit is
  rerun.
- Risks: a theme-mode observer could miss a host signal or cause stale theme
  state; removing custom colors could regress contrast, selection, Flow/Table
  surfaces, or forced-colors behavior. Standard MUI palette assertions,
  simulated class/media changes, numeric contrast tests, DOM/axe checks, and
  desktop/web evidence are required. Host protocol expansion is a replan
  trigger, not an implicit fallback.
- Out of Scope: parser/comparison/source/Flow/report behavior, session and
  transport schemas, URL/dependency warnings, telemetry, remote assets,
  engine-floor changes, broad visual redesign, and closure-folder removal.

### Slice 15: Restore MUI Standard Colors And Explorer Theme-Mode Following

- Status: Plan reviewed `Ready` with no findings; Human Approval is
  automatically recorded under the user's standing no-findings policy on
  2026-09-09. Focused plan-gate commit `d879a160` is recorded. Implementation
  is complete. Independent implementation review returned `Ready` with no
  findings on 2026-09-09; under the user's standing no-findings policy,
  Completion Approval is automatically recorded. Focused completion commit
  `80645ffa7cd1f3bde484d21087ee3ee680a06956` is recorded.
- Scope: simplify `createSemanticDiffTheme` to MUI-standard light/dark palette
  defaults, retain only WCAG-required target/focus/forced-colors overrides,
  remove Explorer-specific VS Code/custom color overrides from shared theme,
  panel HTML, global styles, cards, and tree selection, and make loading and
  loaded Explorer providers consume the resolved mode. Add a small
  browser-safe mode resolver/observer in
  `semanticDiffExplorerThemeMode.ts` for host theme changes.
- User / Domain Value: light and dark Semantic Diff Explorer sessions look
  like their selected MUI theme instead of inheriting a fixed dark palette,
  while selected states and focus remain perceivable and accessible in normal,
  high-contrast, and forced-colors environments.
- Cohesive Change Group: shared MUI theme policy, Explorer provider/mode
  resolution, Explorer surface/tree color cleanup, panel bootstrap color
  cleanup, and focused theme/DOM/panel regression evidence.
- Acceptance: light and dark factory outputs use the corresponding MUI
  standard palette; no fixed dark background/text or non-essential VS Code
  color token overrides remain in Explorer paths; loading and loaded views
  render the same resolved mode; feasible host class/data/media changes update
  the mode; high-contrast/forced-colors keeps Canvas/CanvasText,
  ButtonFace/ButtonText, and Highlight semantics; selection, borders, text,
  and focus meet the recorded WCAG contrast/perceivability checks; 44px
  controls, 2px focus, keyboard operation, filter behavior, cards, state
  labels, CSP, Flow/Table behavior, and desktop/web parity remain unchanged.
- Validation: `muiTheme.test.ts`, Explorer DOM/axe and mode-change tests,
  panel HTML/CSP assertions, existing Flow/Table/theme suites, compiled
  desktop runner, web preparation/build/smoke where available, targeted and
  full qlty checks, Markdown lint, and `rtk git diff --check`.
- Production Readiness: no application/domain/host protocol change; preserve
  browser-safe imports, MUI/Emotion CSP, standard palette derivation,
  read-only behavior, source/Flow/report actions, and WCAG manual/host
  evidence boundaries. Unsupported live host-mode signals fall back without
  corrupting the Explorer session.
- Approval Boundary: exactly the shared theme, Explorer presentation/mode
  helper, panel bootstrap color cleanup, and focused test paths listed above;
  no durable docs or closure propagation.
- Dependencies: completed Slices 5, 12, 13, and 14; protected closure drafts
  remain uncommitted and excluded.
- Risks: light/dark palette inversion, stale host-mode state, loss of
  selection/focus contrast, forced-colors regression, and accidental Flow/Table
  color drift. Existing mode, accessibility, Flow/Table, and bundle tests plus
  numeric contrast evidence are the gates.
- Out of Scope: `url.parse()`/dependency changes, parser/semantic rules,
  Explorer data/transport, source capture, Flow graph logic, telemetry,
  remote assets, and feature-folder removal.

### Slice 15 Implementation Evidence (2026-09-09)

- Implemented the approved presentation boundary. The shared theme now uses
  MUI-standard light/dark palette derivation; global styles resolve palette
  values through the active theme callback; only the approved 44px targets,
  2px focus indicator, forced-colors system colors, and a 4px theme-primary
  leading marker for selected rows remain explicit. The Explorer
  loading/loaded providers follow host theme classes/data attributes and
  `prefers-color-scheme`; card, tree, surface, and panel color overrides now
  preserve MUI ownership while retaining high-contrast semantics. Selected
  rows use `primary.main` with numeric >=3:1 contrast in light/dark themes and
  `Highlight` under forced-colors. The measured marker contrast is about
  4.60:1 for light (`#1976d2` on `#fff`) and 10.71:1 for dark (`#90caf9` on
  `#121212`).
- Added focused `muiTheme`, theme-mode, Explorer DOM/axe, and panel/CSP
  regression coverage. The DOM suite verifies generated stylesheet and
  `getComputedStyle` values for resolved light colors, host mode changes across
  loading and loaded states, selected-row marker width/color and
  light/dark/forced-colors contrast contracts, target/focus/reflow/status/tree
  contracts, and existing semantic filter behavior.
- Validation passed `rtk pnpm run test:compile`, 20 focused theme/mode/DOM
  tests, `rtk pnpm run qlty` (including zero smell findings and `No issues`),
  `rtk pnpm run test:prepare:desktop`, compiled desktop runner (exit 0),
  `rtk pnpm run test:prepare:web`, production `rtk pnpm run build`, and the
  existing `rtk git diff --check` boundary. The direct panel Mocha invocation
  is not a valid VS Code test environment (`Cannot find module 'vscode'`);
  panel coverage remains part of the compiled desktop suite. The managed web
  smoke is blocked before execution by Chromium's host
  `bootstrap_check_in ... Permission denied (1100)` restriction.
- Compatibility remains positive for VS Code `^1.75.0`, desktop/web parity,
  browser-safe imports, MUI/Emotion CSP/no-remote-assets, Flow/Table shared
  theme consumers, and unchanged Explorer/application/transport contracts.
  Existing webpack asset-size warnings and the unrelated `url.parse()`
  `DEP0169` startup warning remain outside this slice. The six closure-draft
  files remain untouched. Independent implementation review is `Ready` with
  no findings and Completion Approval is automatic; focused completion commit
  `80645ffa7cd1f3bde484d21087ee3ee680a06956` is recorded.

The aggregate is `P=23`, `R=50`, `F=134`, `T=12`, `B=55`, `N=2`, and
`D=9`. Slice 5's Explorer files are intentionally included in this baseline;
the new `src/presentation/webview/shared/muiTheme.ts` is included in the
post-slice clean check even though it did not exist in the baseline. The exit
definition is zero qlty-smell findings in every feature-delta file (including
new helpers and any file touched by Slices 5-15), a passing `qlty check`, and
no suppression, allowlist, threshold, generated-ignore, or metrics-only
waiver change. If a repository-baseline finding is outside this feature delta,
the final report must identify it by path and prove zero new findings in the
changed delta; it may not be hidden.

## Cross-Slice Readiness And Approval Boundaries

- Slices 1-4 remain complete and focused-committed. Slices 5-15 each require
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
  requests one aggregate human approval only after Slices 5-17 are complete
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
  qlty-smell remediation, compatibility, readiness, durable follow-up, the
  URI-bearing capture regression, the MUI color/theme regression, and the
  presentation/composition follow-up to Slices 1-17.
- Exit now requires the original four plus the reviewed/approved/committed
  remediation slices, MUI/WCAG 2.2 AA evidence, actual-session filter
  evidence, a clean qlty-smell report without suppression, desktop/web/a11y
  evidence, durable-document review, final traceability, Slice 14's
  command-level regression proof, and Slice 15's light/dark/default-color
  regression proof. The post-Slice-15 `Close` recommendation is superseded
  by the approved Slice 16/17 plan; closure remains paused until both slices
  are complete and Feature Exit is rerun.

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
- [x] Slice 9 Flow graph/highlight qlty remediation complete; focused
      completion commit `52166c1aef52dca4510bf6e374ba0923317c7135` recorded
- [x] Slice 10 Flow overlay/document/message qlty remediation complete;
      focused completion commit `9acfb577` recorded
- [x] Slice 11 Explorer host/action qlty remediation implementation and review
      complete (`Ready`/no findings; automatic approval recorded); focused
      completion commit `628cc9333ed10d540665cb23329a8e7e3c6af6df` recorded
- [x] Slice 12 Flow host/wiring qlty remediation complete; independently
      reviewed `Ready` with no findings, automatic approval recorded, focused
      completion commit `a7905e8fdd905c506627a83d6c86ed1246255298` recorded
- [x] Slice 13 Flow/shared MUI presentation qlty remediation implementation
      and review complete; `Ready`/no findings and automatic Completion
      Approval recorded; focused completion commit `9229f299` recorded
- [x] Slice 14 URI-bearing source-capture regression fix implemented within
      the approved two-path boundary; focused tests/checks pass, independent
      review is `Ready`/no findings, and Completion Approval is automatic;
      focused completion commit `6cce14b7` recorded
- [x] Slice 15 MUI standard colors and Explorer theme-mode following
      implementation is complete; independent review is `Ready`/no findings,
      Completion Approval is automatic under the standing user policy, focused
      plan-gate commit `d879a160` and focused completion commit
      `80645ffa7cd1f3bde484d21087ee3ee680a06956` are recorded
- [x] README, CHANGELOG, durable use cases, roadmap, and final traceability
      revalidated at the reopened Feature Exit; the six durable paths remain
      uncommitted until Slice 15 completes and aggregate human and Closure
      Approval are obtained

## Final Feature Exit Review (2026-09-08)

- Feature: `semantic-diff-explorer`.
- Completed slices: original Slices 1-4 and the approved replan Slices 5-13,
  including formatter reconciliations 7A and 9A. Focused implementation
  commits are `e85d012a`, `01349376`, `a25d674c`, `aa972a29`, `ee76722d`,
  `6af753e7`, `b7c537d3`, `c9b97b0d`, `792842b9`, `52166c1a`, `d19a38ce`,
  `9acfb577`, `628cc933`, `a7905e8f`, and `9229f299`; the approved replan
  commits are `54ca4005`, `1ede39bb`, `aa13b73e`, `5185ec18`, and
  `d0cc7815`. Every implementation slice has an independent `Ready` review
  with no findings and automatic Completion Approval under the recorded user
  policy.
- Acceptance: EXP-1 through EXP-11, N-1, and E-4 are satisfied. The Explorer
  retains one immutable comparison context, remains read-only, preserves
  exact source and side-specific Flow targets, and uses the canonical MUI 7
  theme with mode-aware light/dark support. The WCAG 2.2 AA matrix is
  complete with explicit N/A rationale, MUI focus/target/reflow/contrast and
  forced-colors contracts, non-color state cues, keyboard semantics, and
  `axe-core`/DOM evidence. jsdom evidence does not claim computed contrast or
  screen-reader behavior; those host/manual rows remain explicitly bounded
  in `SPECS.md`.
- Confirmation filter: the real host session ID is passed through
  `createSemanticDiffExplorerSessionMessage` to the actual MUI App. The
  `確認が必要` selection removes ordinary records, retains confirmation
  records and confirmation-required changes, keeps canonical cards unchanged,
  announces zero matches, and restores latent selection after clearing the
  filter. This is covered by the compiled Explorer DOM/axe suite and the
  desktop runner.
- Validation: `rtk pnpm run qlty:smells` analyzed 96 files and returned zero
  findings; `rtk pnpm run qlty:check` returned `No issues`; TypeScript test
  compilation, production desktop/web build, desktop/web preparation,
  desktop smoke (exit 0), Markdown lint (44 files), and `git diff --check`
  passed. Focused Flow/theme, Explorer DOM/axe, host lifecycle, source,
  overlay, and transport suites passed. A permissive-host web smoke retry
  started Chromium and the VS Code web extension and exited 0; it emitted
  only the existing EPIPE/premature-close stream warnings. The unprivileged
  retry's macOS `bootstrap_check_in ... Permission denied (1100)` is an
  environment caveat, not a source failure. Existing webpack asset-size
  warnings and the known expanded-graph golden/architecture baseline issues
  remain unchanged.
- Traceability: `TRACEABILITY.md` now records all replan slices, final commit
  state, EXP-11/WCAG evidence, qlty remediation, actual-session filter proof,
  compatibility, and closure validation. No architecture, glossary, or
  neutral comparison use-case update is required.
- Durable documentation: `README.md`, `README.en.md`, `CHANGELOG.md`,
  `uc-present-semantic-diff-report.md`, `uc-explore-flow-graph.md`, and
  `docs/specs/roadmap.md` now reflect the delivered Explorer behavior. The
  roadmap retains explicit owners and entry conditions for the two unrelated
  repository follow-ups: composition-root cleanup and expanded Flow golden
  alignment. These six paths are the only uncommitted closure propagation.
- Production readiness: VS Code `^1.75.0`, Node `>=20`, MUI 7.3.x, desktop
  and web bundles, browser-safe production imports, static CSP/no-remote-asset
  checks, Flow/table behavior, and privacy-preserving telemetry remain intact.
- Remaining risks: the two existing architecture composition-root violations
  and one expanded-Flow node-order golden mismatch are explicitly owned in
  `docs/specs/roadmap.md`. Browser/assistive-technology manual evidence is
  host-dependent and remains bounded by the WCAG matrix; the permissive-host
  smoke completed with only stream warnings. No new design, scope, or
  compatibility decision is required.
- Closure recommendation: `Close`. Aggregate human approval and explicit
  Closure Approval are still required; this review performs no commit or
  feature-folder deletion.

## Feature Exit Superseded By Slice 14 Regression Replan

The 2026-09-08 `Close` recommendation remains historical evidence for the
completed Slices 1-13, but it is superseded for lifecycle purposes. The
reported valid-definition failure was reproduced at the URI-bearing
presentation descriptor to application capture boundary, and the command
misclassified the resulting setup exception as `parse-failed`. Slice 14 is
the smallest repair plan. Its implementation and completion gates must pass
before Feature Exit is rerun; the six uncommitted closure-draft paths remain
protected and outside the replan.

<!-- markdownlint-disable MD013 -->

## Final Feature Exit Review After Slice 14 (2026-09-09)

- Feature: `semantic-diff-explorer`.
- Completed slices: Slices 1-13, formatter reconciliations 7A/9A, and Slice 14. Slice 14 plan-gate commit is `6f1f262d`; its focused completion commit
  is `6cce14b7`. Every implementation slice has an independent `Ready` review
  with no findings and automatic Completion Approval under the recorded user
  policy.
- Regression acceptance: `src/presentation/vscode/commands/
semanticDiffCommandBuild.ts` now projects URI-bearing host descriptors into
  the exact application capture shape
  `{side, sourceHandleId, text, version}` while retaining the original URI
  descriptors for source registration. The concrete command test uses
  `AntlrAjsParser` and `createBeginSemanticDiffSourceCapture`, proves valid
  before/after sources reach `openExplorer`, verifies URI and opaque-handle
  identity, and confirms cleanup. Setup exceptions are `display-failed`;
  concrete parser failures remain `parse-failed` with exactly-once release.
  The reproduced malformed-descriptor failure is therefore fixed without
  widening the application DTO or changing parser/source-index contracts.
- Original acceptance remains satisfied: EXP-1 through EXP-11, N-1, and E-4;
  immutable read-only Explorer session; exact source/Flow targets; canonical
  MUI 7 mode-aware theme; WCAG 2.2 AA matrix with explicit N/A and
  host/manual boundaries; and actual-session `確認が必要` filtering with
  ordinary exclusion, confirmation retention, unchanged cards, zero-match
  status, and latent-selection restoration.
- Validation: `rtk pnpm run test:compile`, compiled desktop extension runner
  (exit 0), production desktop/web build, web preparation, permissive-host
  web smoke (Chromium and VS Code web extension started, exit 0), targeted
  Slice 14 `qlty smells` (zero findings), full `qlty smells` (96 files,
  zero findings), full `qlty check` (`No issues`), Markdown lint, and
  `git diff --check` passed. Web smoke emitted existing ECONNRESET/EPIPE/
  premature-close stream warnings after the app initialized; the ordinary
  managed-host `bootstrap_check_in ... Permission denied (1100)` remains an
  environment caveat, not a source failure. Existing webpack asset-size
  warnings and the known architecture/golden baseline follow-ups are
  unchanged.
- Traceability and durable documentation: `TRACEABILITY.md` records Slice 14
  command/capture/parser proof and the complete EXP-1 through EXP-11 matrix.
  The six existing closure paths remain the only uncommitted durable
  propagation: `README.md`, `README.en.md`, `CHANGELOG.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`, and
  `docs/specs/roadmap.md`. No architecture, glossary, context, or neutral
  comparison use-case update is required.
- Production readiness: VS Code `^1.75.0`, Node `>=20`, desktop/web parity,
  browser-safe imports, static CSP/no-remote-asset policy, Flow/table
  behavior, parser diagnostics, source lifecycle cleanup, and
  privacy-preserving telemetry remain intact. The unrelated `url.parse()`
  DEP0169 warning remains outside scope.
- Remaining risks: the two existing architecture composition-root violations
  and expanded-Flow node-order golden mismatch remain assigned in
  `docs/specs/roadmap.md`; web stream warnings and host-dependent manual
  assistive-technology rows remain explicitly bounded in the evidence. No
  new design, scope, or compatibility decision is required.
- Closure recommendation: `Close`. Aggregate human approval and explicit
  Closure Approval are still required; this review performs no commit or
  feature-folder deletion.

<!-- markdownlint-enable MD013 -->

## Final Feature Exit Review After Slice 15 (2026-09-09)

- Feature: `semantic-diff-explorer`.
- Completed slices: Slices 1-15, including formatter reconciliations 7A and
  9A. Every implementation slice has an independent `Ready` review with no
  findings, conditional automatic Completion Approval under the recorded user
  policy, and a focused completion commit. Slice 15 is committed as
  `80645ffa7cd1f3bde484d21087ee3ee680a06956`; its approved plan-gate commit
  is `d879a160802db6257b56c857521282f001191712`.
- Acceptance status: EXP-1 through EXP-11, N-1, and E-4 are satisfied. The
  Explorer remains read-only, keeps one immutable comparison session, exposes
  exact source and Flow targets, and preserves the actual-session
  `確認が必要` filter behavior. The shared MUI theme now follows standard
  light/dark palettes for every theme; only WCAG-required focus, target-size,
  forced-colors, and selected-row marker rules remain explicit. Selection
  remains perceivable at approximately 4.60:1 in light mode and 10.71:1 in
  dark mode, with `Highlight` in forced colors.
- Validation: independent recheck passed `rtk pnpm run qlty:check` (`No
issues`), `rtk pnpm run qlty:smells` (zero findings across 97 files),
  `rtk pnpm run test:compile`, the focused MUI/theme-mode/Explorer DOM suite
  (20 passing), `rtk pnpm run lint:md`, and `rtk git diff --check`. Recorded
  Slice 15 evidence also includes desktop preparation and smoke (exit 0), web
  preparation, and production desktop/web build. Managed Chromium web smoke
  remains blocked before execution by the host
  `bootstrap_check_in ... Permission denied (1100)` restriction.
- Traceability: `TRACEABILITY.md` maps EXP-1 through EXP-11, N-1, E-4, the
  actual-session filter, qlty remediation, URI-bearing capture regression,
  MUI standard-color/theme following, compatibility, production readiness,
  and durable propagation through Slice 15. The Slice 15 completion commit is
  recorded and no implementation evidence remains only in an uncommitted
  state.
- Production readiness: VS Code `^1.75.0`, Node `>=20`, desktop/web parity,
  browser-safe imports, MUI/Emotion CSP/no-remote-assets, parser diagnostics,
  source lifecycle cleanup, Flow/Table behavior, and privacy-preserving
  telemetry remain intact. Existing webpack asset-size warnings, the two
  architecture composition-root baseline violations, the expanded-Flow node
  order golden mismatch, and the unrelated `url.parse()` `DEP0169` warning
  remain explicitly bounded; the first two follow-ups are owned in
  `docs/specs/roadmap.md`.
- Durable documentation: the six existing closure paths remain the exact
  durable propagation surface: `README.md`, `README.en.md`, `CHANGELOG.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`,
  `docs/requirements/use-cases/uc-explore-flow-graph.md`, and
  `docs/specs/roadmap.md`. They reflect the user-visible Explorer workflow,
  confirmation filtering, Flow/report handoff, accessibility behavior, and
  assigned follow-ups. No architecture, glossary, context, or neutral
  comparison use-case update is required. These paths remain uncommitted until
  Closure Approval.
- Remaining risks: managed-host browser smoke and host-dependent manual
  assistive-technology evidence remain environment-bounded; the existing
  architecture and Flow golden follow-ups are explicitly owned in the
  roadmap. No unresolved feature risk, reusable knowledge, or unfinished
  repository work remains only in this feature folder.
- Closure recommendation: `Close`. Aggregate human approval and explicit
  Closure Approval remain required; the proposed closure scope is the six
  durable paths above plus removal of
  `docs/specs/features/semantic-diff-explorer/`. This review performs no
  staging, commit, or feature-folder deletion.

## Current Replan Superseding Final Feature Exit Review

The preceding Slice 15 `Close` review is historical and is superseded by the
user-approved Slice 16/17 replan recorded above. The current route is
independent plan review, the focused plan-gate commit, sequential completion
of Slices 16 and 17 with their review/approval gates, and a fresh Feature Exit
review before aggregate Closure Approval. The six protected closure drafts
remain unmodified and outside all implementation commits.
