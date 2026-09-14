# Feature Tasks: Schedule Impact Calendar

## Agent Brief

- Purpose: present one completed Semantic Diff comparison's supported schedule
  runs and explicit schedule outcomes as an accessible, read-only,
  date-grouped timeline.
- Mode: Replanning Mode after all five implementation slices completed on the
  current `main`. Slice 1 is completion-committed at `51a8ae4a`, Slice 2 at
  `b9cee633`, Slice 3 at `ffb92f1e`, the format-only correction at `09148de4`,
  Slice 4 at `d4344a26`, and Slice 5 at `f47edeb0`.
- Approved or active slice: none. All five completed slices have independent
  `Ready` reviews with no Findings, automatic no-findings Completion Approval,
  and focused completion commits. The new placement replan is Slice 6;
  Feature Exit and the prior Closure Approval proposal are deferred until it
  completes.
- Do not recalculate schedules, infer outcomes from empty arrays, merge
  ambiguous identity candidates, change the Explorer contract, or change
  `SemanticDiffResult`, the immutable `{ result, summary }`
  `SemanticDiffOutputContext`, the public `compareSemanticDiff(input)` result
  contract, JSON version 1, report modes, or existing Flow/source behavior.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the reviewed
  `schedule-semantics-expansion`, `semantic-diff-structured-outputs`, and
  `semantic-diff-explorer` plans.
- Final evidence is recorded below for the exact approved paths. Durable
  roadmap propagation is prepared for the closure commit; the selected feature
  folder remains until explicit Closure Approval.

## Current Plan Basis

- This plan retains the third targeted Replanning Mode revision for Slice 1
  after the implementation-review Findings. The feature contract and rationale
  remain in `SPECS.md`; this file owns the executable slice plan and current
  gate state. The earlier replan approval commits `6622953f` and `ebf8bf3d`
  remain historical and their implementation changes are preserved; the third
  delta was authorized by focused commit `11615026` and is included in the
  completion-committed Slice 1 at `51a8ae4a`.
- The prior Findings remain remediated and preserved: carried status is
  reason-scoped; before and after valid-no-runs metadata is retained in one
  evaluation; duplicate/count-mismatch effects have strict reference rules;
  candidate-root issues are excluded; issue ordinals group by `issueKind`;
  the missing-context fixture is genuine; root-scope one-sided effects use
  upstream references; and validation text is evidence-based. The new local
  Findings are that the real `semanticDiffScheduleDiffer` currently emits
  duplicate/count-mismatch rows as added/removed, so sidecar references cannot
  be proven against the actual upstream output; sidecar pairing groups only by
  date/rule and can cross-pair nested source units; focused expected detail,
  timeline, and rule order needs to follow the approved deterministic
  comparators; prior validation claims were reset to historical evidence and
  are superseded by the current rerun evidence below.
- The required revision remains an evaluation-only predecessor carrier,
  internal differ, and application sidecar projection change, plus one narrow
  normative documentation clarification. No new schedule meaning, public
  surface, Slice 2/3 work, or UI is introduced. The third replan includes the
  prepared and validated `SPECS.md` clarification for source-unit-aware
  duplicate pairing; it requires no result/report/JSON schema change.
- Replanning trigger: current `main` commit `8e6922f8` completed the
  `semantic-diff-comparison-workflow` feature and its dependency remediation.
  The old dependency-run-only Slice 3 state is stale: production workflow now
  selects file or Git HEAD and an optional half-open period in
  `runFileComparisonWorkflow`, builds `SemanticDiffPresentationArtifacts` in
  `buildWorkflowArtifacts`, and opens the parent through
  `openScheduleAwareExplorerSession`. Slice 3 must consume that completed
  artifact handoff instead of treating the workflow as unfinished.
- Replanning trigger: after Slice 3 completed, the user explicitly requested
  that the schedule-impact calendar be created with MUI and organized like
  the other webviews. The current calendar view is behaviorally complete and
  already uses some MUI primitives, but its session/view state and all
  timeline, filter, root, no-run, candidate, issue, and legend sections remain
  in one roughly 1,000-line component. This is a presentation-only structural
  refactor within the selected feature purpose; it does not add schedule
  meaning or change the sidecar/session contract.
- Replanning trigger: the user then additionally requested that the Semantic
  Diff Explorer's component and package structure follow the existing Flow and
  Unit List webview pattern. The current Explorer uses a separate
  `webview/semantic-diff` entry and combines loaded view composition in one
  module, while its host-state, view-state, tree-data, row/detail, and action
  helpers are already separable. Slice 5 moves only that presentation package
  into `editor/semanticDiffExplorer` and keeps compatibility facades, the
  host protocol, hierarchy, callbacks, and bundle output. This satisfies the
  `SPECS.md` non-goal by preserving Explorer behavior; no normative SPECS
  amendment is required.
- Replanning trigger: after Slice 5, the user explicitly requested that the
  remaining `presentation/vscode/webview/scheduleImpactCalendar*` host files,
  the calendar bridge, and the remaining `presentation/webview/semantic-diff`
  browser modules be placed like the existing Flow and Unit List packages.
  Slice 6 therefore co-locates the feature-owned host/session files and the
  browser helpers under their canonical viewer packages, updates every internal
  consumer, and removes obsolete browser facades without changing behavior.
  Shared `ViewerFactory`, `mountViewerPanel`, `WebviewMediator`, and
  `WebviewStore` remain in their existing host-wide location because the
  calendar child is not a document-URI viewer and must not be forced into that
  store lifecycle. No normative SPECS amendment is required.
- The plan now has six slices: pure comparison artifacts and sidecar
  projection; internal command/bootstrap session and transport foundation;
  the public accessible timeline and documentation; the MUI webview
  component decomposition and layout refinement requested after Slice 3; the
  requested presentation-only Explorer composition alignment; and the
  feature-owned host/browser package relocation requested after Slice 5.
- Current boundaries remain: one identity pass and one schedule evaluation,
  immutable `{ result, summary }` context, host-private sidecar, no Explorer
  transport change, and no schedule recalculation or candidate merging.
- Public calendar exposure is gated by the workflow's successful evaluated-
  period artifact (`scheduleImpact.kind === "available"`) and the completed
  Slice 3 implementation. Slices 1 through 5 are complete and committed on
  this branch: `51a8ae4a`, `b9cee633`, `ffb92f1e`, `09148de4`, `d4344a26`, and
  `f47edeb0`; Slice 6 is the only planned implementation work.
- The original plan, replans, and Slice 4/5 combined package have independent
  `Ready` verdicts with no Findings. The focused Slice 4/5 plan/replan commit
  `271c6027` is complete. Slice 4 and Slice 5 implementation reviews are also
  `Ready` with no Findings; automatic Completion Approval and focused commits
  `d4344a26` and `f47edeb0` are complete. Slice 6 is pending independent
  replan review.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Other
  feature folders inherited from the base branch remain outside this feature's
  scope.
- `docs/specs/roadmap.md` closure propagation remains a deferred proposal: it
  removes the completed Wave 4 calendar item while preserving the deferred
  schedule-semantics follow-ups. The dependency chain is
  internal Calendar Slices 1–2 → completed workflow → public Calendar Slice 3
  → presentation-only MUI Slice 4 → presentation-only Explorer Slice 5 →
  feature-owned host/browser package relocation Slice 6.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness.

## Plan Status

- Status: Slice 1 implementation is complete under approved third-replan
  commit `11615026` and completion-committed at `51a8ae4a`; Slice 2
  implementation is complete and completion-committed at `b9cee633` under
  the approved full-plan gate. Slice 3 implementation is complete under the
  focused approved plan commit `70ff7da7`, reviewed `Ready` with no Findings,
  and completion-committed at `ffb92f1e` plus format correction `09148de4`.
  The explicit MUI/component-organization request reopened planning for Slice
  4 and Slice 5; both presentation-only slices are now complete. The new
  placement request reopens planning for Slice 6, so Feature Exit is deferred.
- Planning scope: the internal application comparison-artifact contract and
  immutable sidecar projection, exact root and candidate correspondence,
  private calendar session transport, atomic Explorer handoff, accessible
  timeline, outcome/run filtering, localization, bounded rendering, workflow
  period-bearing action gating, calendar MUI component organization, Explorer
  editor-package component organization, validation, and durable user
  documentation.
- Review status: all prior plan/replan packages and all five implementation
  slices are independently `Ready` with no Findings. Slice 6 is pending
  independent `plan-reviewer` review.
- Human approval: The reviewed three-slice package, original internal Slice 1
  boundary, first four-path status-carrier delta, second five-path Replanning
  delta, and third seven-path Replanning delta are approved. The focused
  plan/replan commit `11615026` is complete; implementation review is `Ready`
  with no Findings, Completion Approval is recorded, and the focused
  completion commit `51a8ae4a` is complete. The revised Slice 3 activation
  scope is approved in focused plan commit `70ff7da7`; the combined Slice 4/5
  replan is approved in `271c6027`. Automatic no-findings Completion Approval
  and focused completion commits `d4344a26` and `f47edeb0` are recorded below.
  No Human Approval is asserted for Slice 6 by this replan; the final batch
  human Closure Approval remains deferred until it completes.
- Active implementation slice: none; Slices 1–5 are complete, reviewed,
  automatically Completion-approved, and committed. Slice 6 is planned and
  waiting for independent plan review and the replan plan gate. Feature Exit
  is deferred until Slice 6 is complete and committed.
- Slice order: Slice 1, Slice 2, Slice 3, Slice 4, Slice 5, then Slice 6. Each slice
  requires its own implementation review, Completion Approval, and focused
  commit after the plan gate; Feature Exit follows Slice 6.

## Human Approval

- Status: Approved for the original Slice 1 boundary, the independently
  reviewed first and second Replanning deltas, and the independently reviewed
  third targeted Replanning delta.
- Approved at: 2026-09-10; approved in current conversation
- Basis: independent `plan-reviewer` final verdict `Ready`; Findings none; the
  user's automatic no-findings slice-level approval instruction.
- Approved scope: the application-only internal Slice 1 implementation:
  `compareSemanticDiffWithArtifacts`, `semanticDiffScheduleImpact`,
  `buildSemanticDiffPresentationArtifactsFromComparison`, and the named pure
  application tests, plus the evaluation-only predecessor status carrier and
  sidecar status-consumption Replanning delta. No command, bootstrap, Explorer,
  UI, or public action.
- Approved paths:
  - `src/application/semantic-diff/compareSemanticDiff.ts`
  - `src/application/semantic-diff/compareScheduleDiff.ts`
  - `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  - `src/application/semantic-diff/buildSemanticDiffOutputContext.ts`
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`
  - `src/test/suite/semanticDiffPresentationArtifacts.test.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
  - `src/test/suite/semanticDiffSchedule.test.ts`
  - `src/test/suite/semanticDiffContracts.test.ts`
- Newly approved Replanning delta paths:

  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`

- Third targeted Replanning delta paths (independently reviewed, Human
  Approved, and committed in focused plan/replan commit `11615026`):
  - `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`: add a
    minimal internal run-differ contract that groups by canonical source-unit
    path, date, and rule; uses stable source facts as tie-breaks; pairs
    duplicate occurrences deterministically; and emits one changed-time fact
    per paired time difference plus only unmatched added/removed extras without
    changing the public `runChanges` DTO.
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`: pair
    sidecar runs only within a complete source-unit identity/date/rule key,
    preserve deterministic duplicate ordinals, and resolve references against
    the real upstream rows without cross-pairing nested units.
  - `src/test/suite/semanticDiffScheduleRules.test.ts`: cover the real differ
    contract for duplicate equal runs, count mismatches, changed-time pairing,
    rule grouping, and deterministic decision order.
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`: cover nested source
    unit isolation, duplicate sidecar pairing, deterministic timeline/rule
    order, and exact references for upstream added/removed/changed-time rows.
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`: add
    end-to-end parsed-document coverage proving the actual differ output feeds
    the sidecar for duplicate/count-mismatch effects while public result,
    report, and JSON boundaries remain unchanged.
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`: correct only the
    focused detail/run/rule expectations to the approved deterministic order;
    retain the existing calendar semantics and no public-contract change.
  - `docs/specs/features/schedule-impact-calendar/SPECS.md`: the prepared
    normative duplicate-pairing clarification includes source-unit identity
    plus date/rule, preserves root/side semantics and deterministic duplicate
    handling, and leaves public result/report/JSON contracts unchanged. The
    authorized feature-author has prepared and validated this clarification.

The second-Replanning approval covers the same-pass before/after valid-no-runs
carrier, reason-scoped status consumption, duplicate/count-mismatch
source-reference handling, candidate-root issue exclusion, issue-kind
occurrence grouping, root-scope/upstream reference reconciliation, and the
corrected fixture and validation evidence. Main's automatic Human Approval
also covers the independently reviewed third targeted delta above.

This approval authorizes implementation within the listed original Slice 1
boundary and all listed Replanning delta paths, including the independently
reviewed third targeted paths above. The focused plan/replan commit
`11615026` is complete. Independent implementation review is `Ready` with no
Findings and Completion Approval is recorded above; focused completion commit
`51a8ae4a` is complete.

### Slice 3 Replan Human Approval

- Status: Approved
- Approved at: 2026-09-14; approved in current conversation
- Basis: independent `plan-reviewer` re-review verdict `Ready for approval`;
  Findings none. Main applies the user's current automatic no-findings
  slice approval authorization. Explicit Closure Approval remains pending.
- Approved scope: exactly Slice 3, including the corrected workflow guards and
  additive host-private Explorer action adapter described in its planned
  paths and approval scope. Slices 1 and 2 and upstream remediation remain
  preserved. No public message union, result/report/JSON schema, schedule
  meaning, workflow input, package contribution, or compatibility change.
- Slice name: `Expose The Accessible Localized Schedule-Impact Timeline`.
- Approved paths for this focused plan/replan commit:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Implementation paths: only the exact paths and calendar helper directory
  listed under Slice 3 `Planned paths and approval scope`, plus these selected
  feature evidence files. No unlisted runtime/test/config changes.
- Review status: Ready; both prior Findings resolved; no remaining Findings.
- Plan commit status: Complete at `70ff7da7`.
- Active implementation slice: none; Slice 3 implementation review is
  `Ready` with no Findings and its completion commit is `ffb92f1e`.

### Slice 4 Replan Human Approval

- Status: Approved
- Approved at: 2026-09-14; approved in current conversation
- Basis: independent `plan-reviewer` combined Slice 4/5 verdict
  Ready for approval; Findings none. Main applies the user's persistent
  automatic no-findings slice approval instruction and explicit MUI/component/
  package organization requests. Final batch human closure approval is pending.
- Approved scope: exactly Slice 4 planned paths, presentation component
  boundaries and validation below. Preserve completed slices and behavior,
  DTOs, messages, actions, session lifecycle and compatibility.
- Approved paths for this combined focused replan commit:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Implementation paths: only the exact Slice 4 planned paths below and
  selected feature evidence documents.
- Commit status: Complete; focused combined replan commit `271c6027`.
  Slice 4 precedes Slice 5 and each has completed its independent review,
  Completion Approval, and focused commit.
- Deferred roadmap closure proposal: preserved separately for final Feature
  Exit; excluded from this replan and both implementation slices.

### Slice 5 Replan Human Approval

- Status: Approved
- Approved at: 2026-09-14; approved in current conversation
- Basis: independent `plan-reviewer` combined Slice 4/5 verdict
  Ready for approval; Findings none. Main applies the user's persistent
  automatic no-findings slice approval instruction and explicit MUI/component/
  package organization requests. Final batch human closure approval is pending.
- Approved scope: exactly Slice 5 planned paths, presentation component
  boundaries and validation below. Preserve completed slices and behavior,
  DTOs, messages, actions, session lifecycle and compatibility.
- Approved paths for this combined focused replan commit:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Implementation paths: only the exact Slice 5 planned paths below and
  selected feature evidence documents.
- Commit status: Complete; focused combined replan commit `271c6027`.
  Slice 4 precedes Slice 5 and each has completed its independent review,
  Completion Approval, and focused commit.
- Deferred roadmap closure proposal: preserved separately for final Feature
  Exit; excluded from this replan and both implementation slices.

### Slice 6 Replan Human Approval

- Status: Pending independent plan review and explicit replan plan gate.
- Trigger: the user explicitly requested that the remaining calendar host files,
  calendar bridge, and browser-side Semantic Diff Explorer modules be placed
  like the existing Flow and Unit List viewer packages. This is a package and
  import relocation only; all five completed slices and the deferred closure
  proposal remain preserved.
- Proposed scope: the exact host subpackage moves, editor package moves,
  obsolete facade removal, consumer import updates, and location/architecture
  checks listed below. No Human Approval is asserted by this document.
- Review route: Main should send this targeted Slice 6 replan to the
  independent `plan-reviewer`; only a `Ready` result can reopen the plan gate.

### Slice 6 Replan Human Approval Result

- Status: Approved
- Approved at: 2026-09-15; approved in current conversation
- Basis: independent `plan-reviewer` final verdict Ready for approval;
  Findings none. Main applies the user's persistent automatic no-findings
  slice approval instruction and explicit placement cleanup request.
- Approved scope: exactly Slice 6 canonical host/browser package moves,
  obsolete facade removal, listed consumer/test import updates, placement
  assertions and validation below. Preserve all earlier behavior/contracts.
- Approved paths for this focused replan commit:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Implementation paths: exactly Slice 6 listed paths and selected evidence.
- Commit status: Pending; implement only after focused replan commit.
- Deferred roadmap closure proposal: preserved separately and excluded from
  this replan and implementation. Final batch human closure approval pending.

## Completion Approval

- Status: Approved
- Approved at: 2026-09-10; approved in current conversation
- Basis: independent `implementation-reviewer` verdict `Ready`; Findings none;
  the user's automatic no-findings slice-level approval instruction.
- Approved scope: the completed Slice 1 immutable schedule-impact sidecar,
  including its one-pass comparison-artifact contract, evaluation-only
  predecessor carriers, internal source-aware differ and sidecar pairing,
  exact upstream reference validation, pure artifact builder, focused tests,
  deterministic ordering, and current validation evidence. Slice 2 is now
  completion-committed at `b9cee633`, and public Slice 3 remains out of scope.
- Approved paths:
  - `src/application/semantic-diff/compareScheduleDiff.ts`
  - `src/application/semantic-diff/compareSemanticDiff.ts`
  - `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts`
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`
  - `src/test/suite/semanticDiffPresentationArtifacts.test.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
- Implementation review verdict: `Ready`; Findings none. The review package
  covers the exact completed paths above, duplicate/count-mismatch pairing,
  source-unit isolation, root-scope/reference fail-closed behavior, status and
  no-run preservation, public run-change ordering compatibility, report/JSON
  and Explorer regressions, desktop/web checks, and quality evidence recorded
  in this task.
- Commit status: Complete; focused Slice 1 completion commit `51a8ae4a`.

### Slice 2 Completion Approval

- Status: Approved
- Approved at: 2026-09-10; approved in current conversation
- Basis: independent `implementation-reviewer` verdict `Ready`; Findings none;
  the user's automatic no-findings slice approval instruction.
- Approved scope: the completed Slice 2 internal command/application adapter,
  bootstrap composition, exact-context sidecar registry, calendar-aware
  Explorer companion, internal calendar session/panel/transport foundation,
  browser-safe bridge, lifecycle and transport tests, and current validation
  evidence. Slice 3 was not active and remained out of scope at that
  completion gate; its dependency is now reconciled below.
- Approved paths:
  - `src/bootstrap/extension/scheduleImpactSidecarRegistry.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`
  - `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  - `src/presentation/vscode/commands/semanticDiffCommand.ts`
  - `src/bootstrap/extension/semanticDiffWiring.ts`
  - `src/bootstrap/extension/extensionDependencies.ts`
  - `src/test/suite/scheduleImpactSidecarRegistry.test.ts`
  - `src/test/suite/buildSemanticDiffPresentationArtifactsAdapter.test.ts`
  - `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`
  - `src/test/suite/createScheduleAwareExplorerSession.test.ts`
  - `src/test/suite/scheduleImpactCalendarTransport.test.ts`
  - `src/test/suite/scheduleImpactCalendarSession.test.ts`
  - `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`
- Implementation review verdict: `Ready`; Findings none. The review package
  covers exact adapter call shape and identity, command/bootstrap wiring,
  parent/child lifecycle and panel-listener cascade, strict calendar transport,
  stale/late work suppression, normalized language, public-contract guards,
  and desktop/web plus quality evidence recorded in this task.
- Commit status: Complete; focused Slice 2 completion commit `b9cee633`.

### Slice 3 Completion Approval

- Status: Approved
- Approved at: 2026-09-14; approved in current conversation
- Basis: independent `implementation-reviewer` final verdict `Ready`;
  Findings none. Main applies the user's explicit automatic no-findings
  slice approval instruction. Final batch human approval remains pending.
- Approved scope: exact completed Slice 3 public calendar, private compatible
  Explorer action, sidecar/panel lifecycle, full raw metadata, conjunctive
  filters, localized legend, accessible virtualized navigation, bounded lists,
  tests, user documentation, and selected feature evidence below.
- Validation: direct calendar view/accessibility/projection/localization suites
  10 passing; compile, desktop/web extension-host checks, production and
  desktop/web development builds, quality checks, Markdown lint and diff checks
  passed. Prior review Findings are resolved. Existing host cleanup and bundle
  size warnings remain; no compatibility-floor or public-contract change.
- Implementation review verdict: Ready; Findings none.
- Commit status: Complete; focused Slice 3 completion commit `ffb92f1e`.
- Approved paths:
  - `CHANGELOG.md`
  - `README.md`
  - `docs/requirements/use-cases/README.md`
  - `docs/requirements/use-cases/uc-present-schedule-impact.md`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  - `src/bootstrap/extension/semanticDiffWiring.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelActions.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelHtml.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelInstall.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelLifecycle.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelRequests.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanelRuntime.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarAccessibility.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarFocus.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerHostMessageState.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerHostState.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`
  - `src/resource/i18n/scheduleImpactCalendar.ts`
  - `src/resource/i18n/scheduleImpactCalendar_en.ts`
  - `src/resource/i18n/scheduleImpactCalendar_ja.ts`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/scheduleImpactCalendarProjection.test.ts`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/semanticDiffExplorerPanel.test.ts`
  - `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`
  - `webpack.config.js`

### Slice 3 Formatting Correction Completion Approval

- Status: Approved
- Approved at: 2026-09-14; approved in current conversation
- Basis: independent `implementation-reviewer` verdict Ready; Findings none;
  Main applies the user's automatic no-findings slice approval instruction.
- Approved scope: format-only final view test correction identified by Feature
  Exit, with its approval evidence. No assertions, fixtures or behavior change;
  whitespace-insensitive diff is empty. Preserve completion commit `ffb92f1e`.
- Validation: full `rtk pnpm run qlty:check` reports No issues; diff check passed.
- Approved paths:
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
- Commit status: Complete; focused format correction commit `09148de4`.

### Slice 4 Completion Approval

- Status: Approved
- Approved at: 2026-09-15; approved in current conversation
- Basis: independent `implementation-reviewer` verdict Ready; Findings none.
  Main applies the user's persistent automatic no-findings slice approval.
- Approved scope: exactly completed Slice 4 calendar MUI/component extraction
  and its focused component test/evidence; preserve all earlier behavior.
- Validation: direct focused suites 11 passing, compile, production and
  desktop/web development builds, desktop/web host checks, full qlty check
  No issues, Markdown lint and diff checks pass.
- Approved paths:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarBoundedList.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarFilters.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
- Commit status: Complete; focused completed Slice 4 commit `d4344a26`.
- Next stage: Slice 5 is complete; Feature Exit follows the final batch human
  Closure Approval.

### Slice 5 Completion Approval

- Status: Approved
- Approved at: 2026-09-15; approved in current conversation
- Basis: independent `implementation-reviewer` verdict Ready; Findings none.
  Main applies the user's persistent automatic no-findings slice approval.
- Approved scope: exactly completed Slice 5 Explorer editor package, thin
  entry, component extraction, legacy compatibility facades, webpack entry
  path, component test and selected feature evidence below.
- Validation: direct UI/calendar regression 62 passing, compile, production
  and desktop/web development builds, desktop/web host tests, qlty check
  No issues, Markdown lint and diff checks pass. Public contracts preserved.
- Approved paths:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  - `src/presentation/webview/editor/semanticDiffExplorer.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/Header.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SummaryCards.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerEntry.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `webpack.config.js`
- Commit status: Complete; focused completed Slice 5 commit `f47edeb0`.
- Next stage: independent Feature Exit; final batch human Closure Approval.

### Slice 6 Completion Approval

- Status: Approved
- Approved at: 2026-09-15; approved in current conversation
- Basis: independent `implementation-reviewer` final verdict Ready; Findings
  none. Main applies the user's persistent automatic no-findings slice approval.
- Approved scope: exact completed Slice 6 canonical package moves, obsolete
  source removals, listed consumer/test import updates, placement assertions
  and selected feature evidence below. No behavior or contract changes.
- Validation: complete direct regression matrix 74 passing; architecture/
  location suite 26 passing; independent UI subset 56 passing; compile,
  production/dev builds, desktop/web hosts, quality No issues, Markdown lint
  and diff checks pass. Existing architecture catalog remains unchanged.
- Approved paths:
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  - `src/bootstrap/extension/semanticDiffWiring.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelActions.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarJson.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarPanel.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarPanelRuntime.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarSessionRegistry.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarTransport.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarJson.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanelRuntime.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarSessionRegistry.ts`
  - `src/presentation/vscode/webview/scheduleImpactCalendarTransport.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarBridge.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/Header.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SummaryCards.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerFocus.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerHostMessageState.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerHostState.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerKeyboard.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerLocalization.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerThemeMode.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTreeData.ts`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerView.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerViewState.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerEntry.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerFocus.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerHostMessageState.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerHostState.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerKeyboard.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerLocalization.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerThemeMode.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerTreeData.ts`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerViewState.ts`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `src/test/suite/scheduleImpactCalendarBridge.test.ts`
  - `src/test/suite/scheduleImpactCalendarSession.test.ts`
  - `src/test/suite/scheduleImpactCalendarTransport.test.ts`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/semanticDiffExplorerPanel.test.ts`
  - `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffExplorerThemeMode.test.ts`
  - `src/test/suite/webSmoke.ts`
- Commit status: Pending; focused Slice 6 completion commit.
- Next stage: independent Feature Exit, then final batch human closure approval.

## Closure Approval

- Status: Deferred pending Slice 6 completion and a new independent Feature
  Exit review
- Approved at: none
- Approved scope: none
- Approved paths: none
- Prior Feature Exit `Close` evidence is superseded by the user's new
  placement request; no current Feature Exit verdict or Closure Approval is
  asserted.
- Commit status: Not eligible until Slice 6 is complete, Feature Exit is
  independently reviewed, and explicit Closure Approval is recorded.
- Deferred closure proposal: remove the completed Wave 4 calendar entry from
  `docs/specs/roadmap.md`, then delete only
  `docs/specs/features/schedule-impact-calendar/` after Closure Approval;
  inherited feature folders remain preserved.

## Planning Inputs And Boundaries

- Selected feature: `schedule-impact-calendar`, the Wave 4 roadmap feature
  from proposal N-3.
- Purpose boundary: present existing schedule comparison facts for one
  selected period in one accessible, read-only, date-grouped timeline. This
  feature does not add JP1/AJS schedule meaning.
- Required predecessor: the completion-committed
  `schedule-semantics-expansion` contract owns schedule interpretation,
  supported run projection, completeness, valid no-runs, partial/unresolved
  outcomes, and schedule issue evidence.
- Required predecessor: the completion-committed
  `semantic-diff-structured-outputs` contract owns neutral comparison facts,
  stable reason/detail records, summary, report modes, and JSON version 1.
- Integration predecessor: the completion-committed
  `semantic-diff-explorer` contract owns the general Explorer session and
  action/message transport. This feature uses the existing Explorer session
  creation contract through a calendar-owned companion adapter, and adds one
  host-private schedule action and child panel without changing the Explorer
  predecessor or adding a new public hook, message union member, or existing
  action. A host-private callback adapter is part of this Slice 3 integration.
  The Explorer trigger uses the existing `SemanticDiffExplorerActionId`
  allocator and `sde-action-*` validation namespace; the child calendar's
  `sdc-calendar-action-*` handle remains private to calendar transport and
  never enters the Explorer request/response validation set.
- Required predecessor for the public action: completed workflow commit
  `8e6922f8` supplies comparison sources, period input, source capture, and
  default Explorer handoff. In production its
  `runFileComparisonWorkflow`/`buildWorkflowArtifacts` path yields an
  evaluated `SemanticDiffPresentationArtifacts` only after a valid period.
  A no-period selection continues through comparison and opens the ordinary
  Explorer with `scheduleImpact.kind === "unavailable"` and reason
  `not-requested`; invalid workflow input fails in
  `selectWorkflowPeriodStep` before artifact building or Explorer opening.
  Slice 3 consumes the evaluated handoff and does not change the workflow.
- Dependency gate: Slice 1 requires the schedule-semantics and
  structured-output completion commits; Slice 2 additionally requires the
  Explorer session creation contract; Slice 3 additionally consumes the
  completion-committed workflow at `8e6922f8` and its successful evaluated
  period artifact. If any consumed predecessor contract changes, Main must
  route another Replanning before implementation.
- Compatibility boundary: preserve VS Code `^1.75.0`, browser-safe shared
  code, JP1/AJS3 v13 evidence limits, JSON version 1, existing reports,
  Explorer, Flow, source, copy behavior, and desktop/web parity.

## Design Decisions

### Sidecar Source, Root Correspondence, And Candidate Groups

- `SemanticDiffOutputContext` remains the immutable `{ result, summary }`
  object from the structured-output predecessor. The calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` accepts
  parsed documents, invokes identity comparison and schedule evaluation exactly
  once each, and returns `{ result, scheduleProjectionFacts }`.
  `ScheduleProjectionFacts` is the union `not-requested` without a period,
  `invalid` with `{ period, issues }`, or `evaluated` with `{ period, before:
{ rootProjections, statuses, issues }, after: { rootProjections, statuses,
issues }, correspondence }`. The existing `compareSemanticDiff(input)` public
  contract remains unchanged by returning `.result`.
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
  scheduleProjectionFacts })` is a pure calendar artifact builder that calls
  `buildSemanticDiffOutputContext(result)` exactly once and returns
  `{ context, scheduleImpact }`; not-requested/invalid map to unavailable
  impact, while evaluated maps to available sidecar. The command adapter owns
  the source-text/parser-error union. The sidecar is not a field in
  `SemanticDiffResult`, `SemanticDiffOutputContext`, a report DTO, or JSON
  version 1, and no presentation code may recalculate it.
- Bootstrap owns a host-private `ScheduleImpactSidecarRegistry` with the exact
  API `register(context, sidecar)`, `resolve(context)`, and `release(context)`.
  Registration uses the immutable context object identity. A successful
  completed comparison may register; comparison failure or cancellation must
  not. Explorer session creation resolves with the same context object and
  never receives the sidecar through its public wire. `release(context)` is
  called only for parent Explorer session disposal; child close destroys only
  the child registry entry, epoch, and action handles, retaining the
  context/sidecar for parent-alive reopen.
- The compare-success block and all builder injection/wiring are Slice 2
  integration. The existing `BuildSemanticDiffReportDataInput` remains
  unchanged. The calendar-owned adapter uses the additive input type
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }` for
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)`.
  The adapter parses each source once, forwards the same selected period value
  as `CompareSemanticDiffInput.options.scheduleComparisonPeriod`, invokes
  comparison and the pure builder once, and is itself invoked exactly once by
  the command. When `options` or `scheduleComparisonPeriod` is not supplied,
  the adapter omits `options` and that field from the comparison input; it does
  not pass an `undefined` placeholder or invent a `period` alias.
  Bootstrap wires that adapter and the
  calendar-owned `createScheduleAwareExplorerSession` companion through
  `src/bootstrap/extension/semanticDiffWiring.ts` and
  `src/bootstrap/extension/extensionDependencies.ts`. The companion invokes
  `OpenSemanticDiffExplorer(context)` exactly once for both impact states using
  the same context object; available impact performs register → Explorer
  session/panel creation → parent `onDidDispose` release, while unavailable
  impact skips registry/action and still returns the normal parent handle.
  Child close does not release the parent sidecar. The Explorer predecessor is
  not modified with a new hook.
- The sidecar's available payload contains `period`, `roots`,
  `candidateGroups`, `timelineItems`, and `issues`. An invalid requested
  period contains only the exact period, stable invalid-period reason code,
  and structured detail; a not-requested period has no sidecar/action. A
  valid period remains available even when all collections are empty.
- Root selection is closed to `isRootJobnet(unit) =
unit.unitType === "n" && unit.isRootJobnet === true`. No path, depth,
  parent, truthy flag, or general jobnet-type inference may add a root.
- Evaluate correspondence with the closed root matrix. Both sides must
  satisfy `unit.unitType === "n" && unit.isRootJobnet === true` for an exact or
  one-to-one fingerprint pair; retain both real `unitPath` values and use the
  after path as `canonicalPath` when present. A root rename or move remains a
  two-sided root pair. A before-root to after-non-root correspondence becomes a
  one-sided `removed-root-scope` entry, and a before-non-root to after-root
  correspondence becomes a one-sided `added-root-scope` entry. A
  non-root/non-root correspondence is excluded. Ordinary added and removed
  root sets remain one-sided `added`/`removed` entries with no fabricated
  counterpart.
- Scope-transition entries carry the real counterpart path and
  `identityDecisionId` only as `scopeTransition` metadata. The absent root side
  is `null`; it is not a valid no-runs or uncalculated outcome, and no
  cross-side run pairing is created for the transition. The metadata itself
  has no source-change reference; real one-sided run/timeline effects still
  resolve their exact upstream reference when a corresponding `runChanges`
  entry exists.
- Fingerprint candidate groups are never matched, merged, diffed, or assigned
  to a root. A `candidateGroup` has its own stable group ID plus separate,
  sorted `before` and `after` candidate arrays containing each candidate's
  real unit ID, name, and path. Candidate groups are displayed in a separate
  before/after section and are not included in root, run, issue, or timeline
  counts. Candidates must not fall through into added/removed roots.
- A non-null root side is exactly a real side record with `side`, `unitId`,
  `unitPath`, `unitName`, upstream-owned `outcome`, `runs`, and `issueIds`.
  The only outcomes are `supported-runs`, `valid-no-runs`, `partial`, and
  `uncalculated`. The predecessor classification is authoritative: an empty
  array alone never means valid no-runs; `partial` means supported runs plus
  explicit issues; no supported runs plus explicit unresolved issues is
  `uncalculated`.
- The schedule predecessor carries valid-no-runs metadata for both `before`
  and `after` sides from the same evaluation pass through an additive,
  evaluation-only `zeroRunCandidatesBySide: { before: AjsUnit[]; after:
AjsUnit[] }` carrier. The existing after-side `zeroRunCandidates` view used
  by `compareScheduleDiff` remains unchanged. Slice 1 consumes the per-side
  carrier only for authoritative roots; it never infers no-runs from an empty
  array, a missing side, or a second evaluation.
- A one-sided scope-transition root carries
  `scopeTransition: { kind: "removed-root-scope" | "added-root-scope";
counterpartPath: string; identityDecisionId: string }`. Ordinary added or
  removed roots and two-sided root pairs carry no scope-transition metadata.
  This metadata is descriptive only and never pairs runs across sides.
- The sidecar retains complete supported before/after projected run arrays
  from that one upstream pass. It does not re-project, parse parameters,
  reconstruct unchanged runs from change rows, or derive issues from prose.

### Collision-Free Sidecar Identity And Pairing

- Define one closed encoder for all sidecar IDs:
  `lp(value) = <decimal UTF-8 byte length>:<UTF-8 value>` and
  `encode(kind, side, root, date, time, rule, occurrenceOrdinal) =
lp(kind) + lp(side) + lp(root) + lp(date) + lp(time) + lp(rule) +
lp(String(occurrenceOrdinal))`. Components are concatenated without a
  delimiter; lengths are measured in UTF-8 bytes and values are not
  normalized, localized, or truncated. `occurrenceOrdinal` is a finite
  non-negative integer rendered in base 10.
- `root.id` uses `kind=root`, `side=pair` for a matched root or the actual
  `before`/`after` side for a one-sided root, `root=canonicalPath`, empty date
  and time, `rule=matchKind`, and ordinal `0`.
- `candidateGroup.id` uses the same encoder with `kind=candidate-group`,
  `side=pair`, `root=canonical candidate path` (after first, otherwise
  before), empty date and time, `rule=fingerprint`, and ordinal `0`. It is a
  display key only and is never a root or a `sourceChangeRef`.
- `run.id` uses `kind=run`, the run side, `root=root.id`, the private
  source-unit identity key, exact ISO date, exact JP1/AJS wall-clock time,
  decimal rule, and the deterministic ordinal for that source/side/date/rule
  group. The time component keeps different times distinct, while equal runs
  receive consecutive ordinals. The source-unit identity component prevents
  nested runs with identical date/time/rule facts from colliding; it is a
  sidecar-only value and is not added to `SemanticDiffScheduleRun` or public
  `runChanges`. A run also carries `sourceChangeRef: { id: string;
occurrenceOrdinal: number } | null`; it is `null` only for unchanged runs.
- `issue.id` uses `kind=issue`, issue side, `root=root.id`, empty date and
  time, and a collision-free target key containing the issue kind,
  `reasonCode`, `targetKind`, exact `targetId` or target path, and
  `parameterKey` or an explicit `null` token. Every component is length
  prefixed; target ID/path and parameter key are never flattened into an
  ambiguous string. The final ordinal is assigned within the complete
  root/side/kind/reason/target-key group. The issue record carries that
  ordinal, stable kind/reason code, target key, and structured detail.
- `timelineItem.id` uses `kind=timeline`, effect side (`pair` for
  changed-time), `root=root.id`, the private source-unit identity key, exact
  effect date, an exact time key (the single side time for unchanged/added/
  removed, and a length-prefixed pair of before and after times for
  changed-time), effect rule, and the pair ordinal. A timeline item carries
  independent before/after run IDs and the same upstream `sourceChangeRef`
  for a changed/added/removed effect.
- `sourceChangeRef` is a foreign composite reference, not an ID alias. Its
  `id` and `occurrenceOrdinal` resolve together against the stable
  `context.result.scheduleComparison.runChanges` array, where the ordinal is
  the zero-based occurrence among entries with that `id`. Missing,
  out-of-range, or sidecar-ID references fail validation. There is no blanket
  duplicate-reference prohibition: an added/removed effect may share the same
  reference between its one side's run and its same-effect timeline item; a
  changed-time effect may share it between its before run, after run, and
  same-effect timeline item. Reuse across different sidecar effect IDs is
  rejected. Unchanged runs have no source-change reference. A real one-sided
  effect under a root-scope transition follows the same exact reference rule;
  scope-transition metadata does not suppress or invent that reference.
- Occurrences are assigned from the already captured side arrays. The builder
  derives a private source-unit identity for each run: an exact or
  fingerprint-confirmed identity decision ID plus the canonical source-unit
  path for matched sides, or a side-qualified exact unit ID and path for a
  one-sided source. For each root and side, group by source identity/date/rule,
  sort by exact time then unit path, unit ID, unit name, and the predecessor's
  stable source ordinal when present, and assign zero-based ordinals; equal
  records receive consecutive ordinals. Pair before and after entries by the
  shared source identity/date/rule/ordinal. Equal times are unchanged;
  differing times are one changed-time item; an unmatched entry is added or
  removed. The source identity is used for pairing and collision-free sidecar
  IDs but is not exposed in the public result/report/JSON schema. The same
  ordinal is used by the run and paired timeline identity; the time component
  keeps distinct times collision-free. This retains duplicate equal runs and
  makes shuffled-input output deterministic without a second projection. Equal
  records remain equivalent when their input order changes. Source-change
  occurrence ordinals are resolved independently from the stable upstream
  `runChanges` array and are never inferred from sidecar array order. Candidate
  changes are matched by the complete effect signature (kind, path, date, rule,
  and before/after times), consumed once, and then addressed by the upstream
  `(id, occurrenceOrdinal)` composite. Duplicate changed-time entries remain
  distinct; count mismatches become the appropriate added/removed effects when
  a matching upstream row exists, and an unmatched eligible effect fails
  closed rather than receiving a guessed or null reference.
- Issues are copied once from the same side collections, sorted by root, side,
  `issueKind`, reason code, `targetKind`, exact target ID/path,
  `parameterKey` or the explicit null token, structured detail key, and source
  ordinal before
  assigning duplicate ordinals. The occurrence group includes `issueKind`, so
  a same-reason decision with different carried statuses has an independent
  ordinal sequence. Ambiguous candidate-root decisions are excluded before
  root ownership/remapping; their issues do not become null-root sidecar
  issues or contribute to counts. These target-key components are encoded
  individually so target ID/path and parameter-key combinations cannot
  collide. No issue or run is silently merged. All references are validated
  exactly once against the same root and side before the snapshot is exposed.
- Root and candidate display order uses canonical path (after first,
  otherwise before), then the length-prefixed ID. Run and timeline ordering is
  locale-neutral UTF-16 order over date, time, root, side, source-unit
  identity, rule, and ordinal; the source identity is the final tie-break
  needed when nested units share all visible schedule facts. Issue ordering is
  root, side, kind precedence, code, and ID. No
  `localeCompare`, host timezone, JavaScript `Date`, current clock, or locale
  formatting participates in identity, sorting, or period membership.

### Root Outcomes, Timeline, Issues, And Filters

- Supported runs are rendered only in the date-grouped linear timeline. A
  partial root displays its supported runs there and its explicit issues in
  the separate `Uncalculated schedule portions` section. An uncalculated root
  displays issues without fabricated runs. A valid no-runs root appears in a
  dedicated `Valid no runs` section. A null side is announced as not present
  on that side and is never relabelled as an outcome.
- The root outcome badge/filter dimension is independent from the run-state
  dimension. Root outcome options are exactly `All`, `Supported runs`, `Valid
no runs`, `Partial`, and `Uncalculated`. Run-state options are exactly
  `All`, `Unchanged`, `Added`, `Removed`, and `Changed time`. A root selector
  remains a separate native selector. Run-state filtering changes only
  timeline visibility; root-outcome filtering changes only matching root
  status/issues and their associated timeline items. The dimensions combine
  conjunctively and do not mutate source facts, counts, order, period, or
  session.
- Issue kind is rendered as text (`invalid`, `missing-context`, `unsupported`,
  or `uncalculated`) in the uncalculated section; it is not inferred from a
  run state. The carried predecessor status is consulted only when the
  reason is `calendar-selection` or `closed-day-substitution`. Legacy
  reason mappings remain authoritative for every other reason, including
  `missing-start-time` → `uncalculated`, even when an internal projection
  status is present. Global and visible totals remain distinct, including filter
  no-match, candidate groups, zero-only, partial, uncalculated-only, and
  mixed data.
- The fixed legend has separate run-state and root-outcome labels, with text,
  icon, and pattern. Color, position, shape, hover, and animation are never
  the sole state signal. A month/week grid remains out of scope.

### Host-Private Calendar Session And Closed Transport

- `ScheduleImpactSidecarRegistry` is bootstrap-owned and host-private. Its
  exact API is `register(context, sidecar)`, `resolve(context)`, and
  `release(context)`, keyed by immutable context object identity. The
  calendar-owned bootstrap companion
  `createScheduleAwareExplorerSession` always invokes the existing
  `OpenSemanticDiffExplorer(context)` exactly once for available and
  unavailable impact and returns the normal Explorer parent handle. Available
  impact uses the atomic sequence register(context, sidecar) → Explorer
  creation → parent composite `onDidDispose` release; unavailable impact skips
  registration and calendar action but still opens/returns the normal parent.
  Creation failure or cancellation rolls back available registration and all
  partial/normal Explorer resources before returning the existing error. Child
  panel/session close destroys only the child registry entry, epoch, and action
  handles; it retains the registered context/sidecar while the parent is alive,
  so reopen resolves the same immutable pair without rerunning comparison or
  schedule projection. Late child work after close is ignored. The sidecar is
  not copied through or added to the Explorer transport.
- The available calendar action allocates a compatible Explorer trigger ID
  from the existing `sde-action-*` allocator, registers it in the parent
  action membership only when the sidecar is available, and dispatches its
  host-private callback before normal metadata actions. The callback resolves
  the sidecar through the host-private parent Explorer registry by exact
  context identity and creates or reveals one child calendar session from the
  parent session. An unavailable artifact input creates no calendar action or
  panel while the ordinary Explorer parent remains available; invalid workflow
  input never reaches this registration/open path.
- Parent and child identities are separate: the existing immutable Explorer
  `parentSessionId` and parent `disposeEpoch` remain Explorer-owned; the
  calendar registry allocates a fresh opaque `calendarSessionId`, a private
  child `calendarActionId` (`sdc-calendar-action-*`), and a child
  `calendarEpoch`. The Explorer trigger remains an `sde-action-*` action in
  the existing public action request shape, while the callback and child
  IDs remain host-private and the child ID is never accepted by the Explorer
  action membership. A parent owns its child IDs; the calendar registry owns
  child epoch and request state; neither registry may mutate the other's
  epoch.
- Calendar transport is a closed union separate from Explorer transport.
  Requests are exactly `{type: "ready" | "refresh", sessionId,
requestId}`. Host `session` is exactly `{type, sessionId, requestId, ok:
true, payload, error: null}`; `failure` is exactly `{type, sessionId:
string | null, requestId: number | null, ok: false, payload: null, error}`;
  `close` is exactly `{type, sessionId, requestId: null, ok: true, payload:
null, error: null}`. Request IDs are finite positive integers, monotonic
  within the child session, and stale/wrong-session requests fail atomically.
- Calendar error codes are exactly `invalid-request`, `unknown-session`,
  `stale-request`, `disposed-session`, `payload-too-large`, and
  `host-disposed`. Error details are typed and nullable, contain no localized
  prose or host identity, and unknown types, missing/extra keys, non-finite
  IDs, and conflicting nullable fields are rejected before state mutation.
- Before every calendar message is posted, serialize that individual message
  and measure its UTF-8 byte length. The fixed limit is 8 MiB inclusive per
  encoded calendar message, including session, failure, and close envelopes.
  An over-limit payload yields only `payload-too-large`, installs no partial
  state, and leaves the parent session usable for a narrower workflow-owned
  rerun. Explorer's limit and calendar's limit remain separately tested.
- One open panel maps to one child session. Repeated action reveals that panel
  and may issue a new child request without creating another identity. Closing
  the child removes its registry entry and invalidates its epoch; invoking the
  action again while the parent remains alive creates a new panel with a new
  child session/action identity. Disposing the parent cascades close and
  invalidation to every child. Late requests, replies, reveal callbacks, and
  disposal completions from an old epoch are ignored and cannot resurrect or
  clear a newer session.
- Ready/refresh replays the same immutable snapshot. Initial failure leaves
  no partial facts; refresh failure preserves the last valid snapshot and
  announces the error. No restoration, persistence, execution history,
  external calendar, WebAPI, or new command/contribution is introduced.

### Display Language And Compatibility

- The parent Explorer session captures an immutable normalized
  `displayLanguage`; the child calendar session inherits the exact value and
  cannot override it from a request, browser locale, or host callback.
  Normalize `ja`/`ja-*` to `ja`, `en`/`en-*` to `en`, and all other values to
  `en` as the explicit English fallback.
- Add calendar-specific English and Japanese resource maps and a common
  lookup with English fallback. Resources contain labels, badges, issue
  explanations, live announcements, and error text only; raw paths, dates,
  wall-clock strings, IDs, reason codes, and structured detail remain
  unlocalized values.
- The chosen language never changes period membership, date text, sort order,
  ID encoding, filter semantics, or desktop/web output. Existing Explorer,
  Flow, report, and normal viewer language behavior is untouched.

### Impact Inventory

- Application: add the calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` contract
  over parsed documents. It performs identity comparison and schedule
  evaluation once each and returns `{ result, scheduleProjectionFacts }`.
  `ScheduleProjectionFacts` is a discriminated union: `not-requested` has no
  period, `invalid` has `{ period, issues }`, and `evaluated` has `{ period,
before: { rootProjections, statuses, issues }, after: { rootProjections,
statuses, issues }, correspondence }`. The existing
  `compareSemanticDiff(input)` remains a public `.result` wrapper.
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }`. Keep the context
  exactly `{ result, summary }` and consume predecessor facts without changing
  its result, run-change, report, or JSON contract.
- Presentation host: add the calendar panel, private child-session registry,
  closed calendar transport, and lifecycle handling. Presentation webview owns
  timeline/list projection, filters, keyboard, accessibility, virtualization,
  and localized labels.
- Bootstrap: own and compose the host-private
  `ScheduleImpactSidecarRegistry` and calendar-owned
  `createScheduleAwareExplorerSession` companion in
  `semanticDiffWiring.ts` and `extensionDependencies.ts`. The companion opens
  the normal Explorer exactly once for either impact state; available impact
  owns register → Explorer session/panel creation → parent composite
  `onDidDispose` release, while unavailable impact skips registry/action. Both
  paths use atomic rollback on failure/cancel, and child close has no sidecar
  release. Slice 2 owns command caller/injection/wiring and exactly-once
  integration; do not change the Explorer public
  message contract or add a predecessor hook.
- Configuration: add only the calendar web bundle entry in webpack. Keep
  `package.json` commands, activation events, custom editors, menu/command
  contributions, and VS Code engine unchanged; the manifest path is a
  no-change guard covered by tests.
- Documentation: add the durable schedule-impact use case, index it, update
  README and CHANGELOG only when Slice 3 makes the view observable, and run
  Markdown lint. The closure package removes the completed Wave 4 roadmap
  entry while retaining the deferred schedule-semantics follow-ups.

## Implementation Slices

### Slice 1: Capture And Validate The Immutable Schedule-Impact Sidecar

- Status: Slice 1 implementation is complete under approved third targeted
  replan commit `11615026` and completion-committed at `51a8ae4a`; the prior
  implementation and approved predecessor-status deltas remain preserved.
- Scope: create the calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` contract
  over parsed documents. Invoke identity comparison and schedule evaluation
  once each, returning `{ result, scheduleProjectionFacts }` on success. The
  discriminated facts union is `not-requested` without a period, `invalid` with
  `{ period, issues }`, or `evaluated` with `{ period, before: {
rootProjections, statuses, issues }, after: { rootProjections, statuses,
issues }, correspondence }`. Keep `compareSemanticDiff(input)` unchanged as
  the public `.result` wrapper. Build the pure calendar-owned
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })`; it calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }`, mapping only
  evaluated facts to `kind: "available"` and not-requested/invalid facts to
  `kind: "unavailable"`. Project exact root/candidate correspondence,
  root/non-root scope
  transitions, root outcomes, occurrence-aware runs/timeline/issues,
  length-prefixed IDs, `sourceChangeRef` composite references, canonical/side
  paths, strict validation, ordering, and the closed calendar DTO. Keep the
  existing output context, result, report, and JSON untouched.
- User / Domain Value: later presentation receives trustworthy complete facts,
  duplicate records, valid no-runs, partial outcomes, and ambiguous candidates
  without rerunning or guessing schedule meaning.
- Cohesive Change Group: application comparison-artifact contract, the
  internal schedule differ/sidecar pairing boundary, sidecar
  types/projection/validator, and pure application unit tests. Command caller,
  injection, bootstrap wiring, and Explorer lifecycle are Slice 2 concerns.
- Planned paths and approval scope:
  - `src/application/semantic-diff/compareSemanticDiff.ts` (keep the public
    `compareSemanticDiff(input)` contract as the internal result's `.result`
    wrapper).
  - `src/application/semantic-diff/compareScheduleDiff.ts` (reuse the
    existing schedule comparison/evaluation operation once in the internal
    artifact contract).
  - `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts` (new
    parsed-document internal contract with one identity pass, one schedule
    evaluation pass, and `scheduleProjectionFacts`).
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts` (new
    sidecar types, ID encoder, projection, pairing, validation, and ordering).
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
    (pure builder
    `buildSemanticDiffPresentationArtifactsFromComparison`; it calls the
    predecessor `buildSemanticDiffOutputContext(result)` exactly once; no
    comparison, schedule evaluation, predecessor, or JSON contract change).
  - `src/application/semantic-diff/buildSemanticDiffOutputContext.ts`
    (existing structured-output predecessor symbol consumed without changing
    its `{ result, summary }` contract; if its actual symbol/path differs,
    stop at the implementation gate and replan).
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts` (parsed-document
    contract, one identity pass, one schedule evaluation, all facts-union
    states, and public `.result` compatibility).
  - `src/test/suite/semanticDiffPresentationArtifacts.test.ts` (pure artifact
    builder, context identity, and existing error-union tests), plus focused
    updates to
    `src/test/suite/semanticDiffScheduleImpact.test.ts` (new exhaustive
    contract/property tests), plus focused updates to
    `src/test/suite/compareSemanticDiff.test.ts`,
    `src/test/suite/semanticDiffSchedule.test.ts`, and
    `src/test/suite/semanticDiffContracts.test.ts`.
- First Replanning delta paths covered by the separate owner decision and
  recorded Human Approval:
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`: carry
    the already computed `SemanticDiffScheduleStatus` only for
    `calendar-selection` and `closed-day-substitution` decisions, while
    retaining each existing reason code.
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`: classify
    `missing-context` from that carried status and preserve the existing
    reason code/detail without a second evaluation.
  - `src/test/suite/semanticDiffScheduleRules.test.ts`: prove that calendar
    selection and closed-day substitution retain `missing-context`, `invalid`,
    and `unsupported` statuses from the same projection.
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`: prove that identical
    calendar reason codes retain distinct issue kinds and that no recalculation
    or result-contract change is introduced.
    No change to `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`
    is required; its existing `SemanticDiffScheduleStatus` union is reused.
- Latest second-Replanning delta paths covered by the independent review and
  Human Approval recorded above:
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`: retain
    both before/after valid-no-runs metadata from the same evaluation pass,
    while keeping the existing after-side compatibility projection used by
    `compareScheduleDiff` and restricting the status-carrier contract to
    calendar-selection and closed-day-substitution decisions.
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`: consume
    per-side no-run metadata without empty-array inference; apply carried
    status only to the two calendar reasons; exclude ambiguous candidate-root
    issues; group issue ordinals by issue kind; and resolve duplicate,
    changed-time, count-mismatch, and root-scope one-sided effects against
    exact upstream `runChanges` references.
  - `src/test/suite/semanticDiffScheduleRules.test.ts`: cover both-side
    valid-no-runs preservation, status-carrier reason scoping, legacy
    `missing-start-time` mapping, and a real missing-context fixture.
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`: cover duplicate
    changed-time runs, count mismatches, shuffled upstream `runChanges`,
    candidate-root issue exclusion, issue-kind ordinal grouping, root-scope
    reference resolution, missing-reference fail-closed behavior, and the
    complete status/no-run matrix.
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`: preserve the
    predecessor's existing after-side zero-run confirmation behavior while
    proving that the new before/after evaluation metadata is additive and
    evaluation-only.
- Third targeted Replanning paths (independently reviewed, Human Approved, and
  committed in focused plan/replan commit `11615026`):
  `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`,
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`, and
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`, plus
  `docs/specs/features/schedule-impact-calendar/SPECS.md`. The domain differ
  change is internal; the application/test changes prove source-unit
  isolation, deterministic duplicate pairing, real upstream references, and
  unchanged public result/report/JSON boundaries. The authorized
  feature-author has prepared and validated the normative source-unit pairing
  clarification in SPECS.
- Third targeted Replanning delta (reviewed `Ready` with no Findings, Human
  Approved, and committed in focused plan/replan commit `11615026`): the real
  upstream differ and the sidecar must share a minimal internal pairing
  contract. `compareScheduleRuns` groups by canonical source-unit path, exact
  date, and rule; sorts each side by exact time and stable source facts;
  pairs the minimum duplicate count by ordinal; emits one changed-time row for
  each paired time difference; and emits only the unmatched added/removed
  extras. Equal duplicate runs remain distinct and unchanged. The final
  decision order is an explicit locale-neutral comparator over source identity,
  date, rule, effect kind, times, and ordinal. The contract is internal to
  `semanticDiffScheduleDiffer.ts`; `SemanticDiffScheduleRunChange`, its IDs,
  and the public result/report/JSON remain unchanged.
  The sidecar builder derives a private composite source-unit key from the
  exact/fingerprint-confirmed identity decision ID plus canonical source path
  for matched sides, or from side plus exact source `unitId` and path for a
  one-sided source; date and rule are additional key components. It never
  pairs nested units merely because date/rule match, and this key is not
  exposed in the public result/report/JSON or sidecar run DTO.
  Duplicate equal records receive stable consecutive ordinals after sorting by
  exact time and source facts; shuffled input and duplicate/count-mismatch
  cases must produce the same timeline and rule order. Source references are
  resolved one-to-one against the actual `runChanges` emitted by that differ;
  no synthetic changed-time row, sidecar alias, or guessed occurrence is
  accepted.
- Acceptance: root inclusion uses only the closed predicate; the full
  root/non-root correspondence matrix yields both-root pairs, one-sided
  `removed-root-scope`/`added-root-scope` entries, ordinary one-sided
  `removed`/`added` roots, non-root exclusion, and separate ambiguous
  candidates. Root rename/move retains a pair, while scope-transition
  counterpart paths and `identityDecisionId` stay metadata and create no
  cross-side run pairing. All four side outcomes, supported
  runs, issues, all effects, duplicate equal runs/issues/changed times,
  shuffled inputs, exact composite source-change references, valid
  added/removed and changed-time same-effect sharing, cross-effect reference
  rejection, invalid/empty/not-requested periods, and no-recalculation spies
  pass. The internal contract invokes identity comparison and schedule
  evaluation once each, and the artifact builder performs no re-evaluation.
  Existing `compareSemanticDiff(input)` `.result` behavior and
  `{ result, summary }` context/result/JSON snapshots remain unchanged.
  The first replan's status carrier is now narrowed by contract: the sidecar
  consults carried projection status only for `calendar-selection` and
  `closed-day-substitution`, retaining each reason/detail while distinguishing
  `missing-context`, `invalid`, and `unsupported`. Legacy mappings for all
  other reasons remain unchanged, including `missing-start-time` →
  `uncalculated`, even if the predecessor carries a projection status. The
  predecessor preserves both before and after valid-no-runs metadata through
  the same evaluation pass; the existing after-side result/confirmation view
  remains compatible. The sidecar consumes only this authoritative per-side
  metadata and must not infer it from reason codes, details, empty runs, or a
  second schedule calculation.
  Duplicate runs are paired by stable side-array occurrence and duplicate
  changed-time/count-mismatch effects resolve one-to-one by complete effect
  signature to upstream `runChanges` composites. Missing eligible references
  fail closed; no sidecar ID or guessed ordinal is accepted. Ambiguous
  candidate-root issues are excluded before root ownership and do not affect
  counts. Issue ordinals are grouped by `issueKind`. Root-scope metadata never
  creates a cross-side run pair, but every real one-sided effect uses the same
  exact upstream reference rule as other added/removed effects; the scope
  transition itself never receives a synthetic reference.
- The upstream differ contract is part of this Slice 1 replan: duplicate
  equal runs are not deduplicated; duplicate/count-mismatch groups pair by
  source-unit identity/date/rule and stable ordinal; each paired time change
  is emitted as one `changed-time` decision; and unmatched records alone emit
  `added`/`removed`. Different rules or nested source units cannot be paired
  by date alone. The sidecar consumes those real rows and resolves every
  eligible effect by the exact `(id, occurrenceOrdinal)` composite. Public
  `SemanticDiffResult`, report, JSON version 1, and `runChanges` shape remain
  unchanged.
- Sidecar source identity is explicit and deterministic: for matched sides the
  pairing key uses the exact/fingerprint-confirmed identity-decision key plus
  canonical source path; for one-sided units it uses side plus exact `unitId`
  and path. Exact date and rule are additional key components. Duplicate
  records are paired only within that key, and nested units with equal
  date/rule cannot cross-pair. Focused detail, timeline, and rule assertions
  are updated to the approved locale-neutral comparator order. The prepared
  normative `SPECS.md` duplicate-pairing sentence now uses
  source-unit-identity/date/rule grouping while retaining root/side ownership,
  duplicate ordinals, and deterministic handling. This clarification is
  prepared and validated by the authorized feature-author; no code,
  result/report/JSON, or schedule meaning is broadened.
- The exact normative rule is: within each root and side, retain duplicate
  runs and group them by source-unit identity, date, and rule; sort by exact
  time and stable source facts; assign consecutive ordinals; pair before and
  after records only when source identity/date/rule/ordinal agree; classify
  equal times as unchanged, differing times as changed-time, and unmatched
  records as added/removed. Root and side ownership remains authoritative,
  and identity/pairing/order remains locale- and timezone-independent.
- Validation: exact-key/union/foreign-reference tests;
  `ScheduleProjectionFacts` not-requested-without-period,
  invalid-period-with-issues, and evaluated before/after/correspondence
  fixtures; unavailable/available mapping and exactly-one
  `buildSemanticDiffOutputContext(result)` spy; UTF-8 length-prefix
  collision tests with delimiters and supplementary Unicode; occurrence and
  duplicate pairing properties; root/candidate/root-scope correspondence
  matrices; counterpart metadata and no-cross-side-pairing fixtures;
  period/outcome/issue matrices; collision-free issue target-key fixtures;
  stable run-change `(id, occurrenceOrdinal)` resolution; valid added/removed
  one-side-plus-timeline and changed-time before/after-plus-timeline
  shared-reference fixtures; cross-effect duplicate rejection; stable ordering
  under shuffled input; internal-contract one-identity/one-schedule-pass,
  public `.result` compatibility, pure builder/context-identity, existing
  error-union, and no-recalculation tests; application architecture and
  focused compiled tests after implementation. The latest replan adds
  predecessor fixtures proving both-side valid-no-runs metadata in one pass,
  reason-scoped status propagation, and the correct missing-context paths:
  missing explicit calendar source, missing containing group, incomplete and
  invalid calendar context, and genuinely unsupported calendar/substitution
  input. Sidecar fixtures must retain each reason code while distinguishing
  `missing-context`, `invalid`, and `unsupported`, preserve
  `missing-start-time` as `uncalculated`, exclude candidate-root issues,
  group duplicate issue ordinals by issue kind, resolve duplicate/count-mismatch
  changed-time references against shuffled upstream rows, and resolve real
  one-sided scope-transition effects without synthetic references. Existing
  result/report/JSON compatibility tests must remain green. Until the revised
  implementation is approved and these checks are rerun successfully, this
  plan records no new validation result.
- The third replan adds direct `compareScheduleRuns` fixtures proving that
  duplicate/count-mismatch inputs produce real changed-time plus unmatched
  rows, that rule changes do not cross-pair, and that shuffled inputs preserve
  the approved decision order. Sidecar fixtures prove source-unit identity
  isolation for nested units and deterministic duplicate pairing. The
  `compareSemanticDiffWithArtifacts.test.ts` end-to-end fixture must invoke
  the real comparison path, inspect its emitted `runChanges`, build the
  sidecar, and assert exact references for each effect; synthetic
  hand-authored changed-time rows are insufficient. Focused expectations must
  match the approved detail/timeline/rule comparator order. The scoped tests
  and compile/quality checks now pass, with their current results recorded in
  the implementation evidence below.
- Documentation validation confirms that `SPECS.md` contains the
  source-unit-identity/date/rule rule above and that its root/side, duplicate,
  deterministic-order, and public-contract constraints remain intact. The
  authorized feature-author prepared and validated this clarification.
- Production Readiness: one identity comparison and one schedule evaluation,
  followed by one pure artifact projection, explicit
  validation before exposure, no localized or host-time ordering, no schedule
  recalculation, no candidate merge, no silent truncation, exact composite
  references for every non-unchanged effect, explicit effect-scoped sharing,
  collision-free issue target keys, candidate-root issue exclusion, and no
  sensitive content or host handles in the sidecar. A duplicate/count
  mismatch or missing upstream row fails closed rather than weakening the
  reference contract. The differ's duplicate pairing is deterministic and
  internal, and the sidecar's source-unit key prevents nested-unit leakage
  without widening any public DTO or schedule meaning.
- Approval Boundary: only the application comparison-artifact contract,
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })`, its exactly-one output-context call, the internal
  `compareScheduleRuns` differ grouping/pairing contract, sidecar projection
  and validation, the named pure application/domain tests above, and the
  exact normative duplicate-pairing clarification in
  `docs/specs/features/schedule-impact-calendar/SPECS.md`. The authorized
  feature-author has prepared and validated the SPECS clarification. The
  differ refinement is evaluation-only and must keep
  `SemanticDiffScheduleRunChange` and its `runChanges` mapping unchanged.
  `SemanticDiffOutputContext` remains exactly immutable `{ result, summary }`; a
  predecessor schedule/result/run-change/report/JSON change, a new
  command-level builder call or wiring change, new schedule meaning, or
  different candidate/root/scope-transition policy requires Replanning with
  that owner.
- Replanning approval boundary: the first status-carrier delta remains covered
  by the earlier Human Approval and focused commit `6622953f`; the second
  same-pass before/after metadata, reason-scoped status, duplicate/reference,
  candidate exclusion, ordinal, fixture, and root-scope reconciliation delta
  remains covered by Human Approval and focused commit `ebf8bf3d`. The third
  differ/source-identity/order/E2E plus normative-SPECS delta has final
  independent `plan-reviewer` `Ready` review with no Findings and Main's
  automatic Human Approval recorded for its exact paths. Its focused
  plan/replan commit `11615026` is complete. Implementation review is `Ready`
  with no Findings and Completion Approval is recorded; focused completion
  commit `51a8ae4a` is complete.
- Dependencies: completion-committed `schedule-semantics-expansion`,
  `semantic-diff-structured-outputs`, and the predecessor's stable parsed
  `CompareSemanticDiffInput`, result/context, and
  `BuildSemanticDiffReportDataInput` parser-error contracts; the sidecar
  consumes their facts but does not modify them. To preserve status without
  recalculation, the predecessor evaluation must expose the already computed
  `SemanticDiffScheduleStatus` only as a supported carrier for
  `calendar-selection` and `closed-day-substitution`, plus the additive
  `zeroRunCandidatesBySide` valid-no-runs metadata for both sides from that
  same pass. The existing
  after-side compatibility projection remains available to
  `compareScheduleDiff`; `SemanticDiffResult`, reports, JSON, and public
  `.result` remain unchanged. If the predecessor cannot provide both side
  facts without a second evaluation or a public-schema change, stop and
  return that owner decision to Main.
  The third replan also depends on the existing domain differ owner exposing
  duplicate pairing through the internal `compareScheduleRuns` decision
  contract. The differ may refine only its internal grouping/order/pairing;
  `compareScheduleDiff` continues to map the same decision union to the
  unchanged `scheduleComparison.runChanges` DTO. If satisfying the real
  duplicate/count-mismatch output requires changing that public DTO, report,
  JSON, or a second schedule evaluation, stop for a new owner decision.
  The additive
  `BuildSemanticDiffPresentationArtifactsInput` source-text input type is
  introduced by Slice 2 for the workflow predecessor contract; it is not
  required for this pure application slice. The workflow dependency is not
  required for this pure application slice.
- Risks: second schedule pass, context/sidecar identity drift, unstable
  duplicate ordinals, duplicate/count-mismatch reference aliasing,
  wrong effect-scoped sharing, false zero-run, candidate-root leakage,
  non-root inclusion, incorrect root-scope metadata, path collision, sidecar
  reference repair, or losing the distinction between an unsupported calendar
  rule and a missing calendar context. The status field and both-side no-run
  metadata must be copied from the existing projection decision path exactly
  once; any status inference, missing-reference fallback, or predecessor
  result/JSON exposure is out of scope and returns to Main. The exact-key,
  same-pass, foreign-reference, root/candidate/scope matrix, allowed-sharing,
  shuffled-input, issue-kind ordinal, legacy-reason, and status/no-run tests
  are the gate.
  New risks are false changed-time pairing caused by deduplicated or rule-blind
  differ groups, nested-unit cross-pairing caused by date/rule-only sidecar
  keys, and synthetic references that pass unit tests but do not match real
  upstream `runChanges`; the end-to-end fixture and deterministic-order
  assertions are required controls. Any public DTO, report/JSON,
  schedule-meaning, identity-policy, or normative-SPECS change outside this
  exact clarification returns to Main.
- Out of Scope: command caller/injection/wiring, calendar panel, Explorer
  action, webview, bootstrap registry/companion, webpack, package manifest,
  localization resources, telemetry, workflow integration, README/CHANGELOG,
  and public user documentation. The selected `SPECS.md` normative
  clarification is included as the narrow third-delta documentation scope.

### Slice 1 Implementation Evidence

- Status: Slice 1 implementation is complete and committed at `51a8ae4a` under
  approved third-replan commit `11615026`; independent implementation review
  is `Ready` with no Findings and Completion Approval is approved.
- Changed paths: the prior Slice 1 comparison-artifact and presentation
  builder paths, the evaluation-only schedule carrier, and the approved third
  delta paths including the internal differ, source-identity sidecar pairing,
  deterministic-order fixtures, and real end-to-end comparison fixture.
- Acceptance evidence: the internal comparison performs one identity pass and
  one schedule evaluation; the public `.result` and `{ result, summary }`
  context remain unchanged; and the pure builder projects available versus
  unavailable facts without recalculation. The sidecar retains closed-root
  correspondence, scoped roots, root-owned issues, explicit outcomes,
  duplicate-aware IDs and ordinals, and exact composite source references.
  Real differ fixtures prove duplicate/count-mismatch changed-time rows and
  unmatched extras. Nested source-unit fixtures prove no cross-pairing, and
  the end-to-end fixture resolves actual `runChanges` rows. Missing eligible
  references fail closed; candidate-root issues remain excluded; issue
  ordinals remain issue-kind scoped; and calendar status is reason-scoped.
- Validation completed for this implementation: `rtk pnpm run test:compile`;
  focused schedule/sidecar/artifact/calendar Mocha suites (67 passing);
  JSON/contract/schedule/Explorer pure regression Mocha suites (54 passing);
  report and host-bound Explorer regressions are covered by the desktop
  extension-host run (exit 0, with the existing macOS codesign warning);
  desktop and web webpack builds; and web extension-host tests (exit 0, with
  existing EPIPE/Premature-close stream-cleanup warnings).
  `rtk pnpm run qlty:check` passed with no issues; `rtk pnpm run qlty:smells`
  completed with advisory complexity/duplication findings only; markdown lint
  passed with 0 errors; and `git diff --check` passed.
- Compatibility and readiness: no manifest, public action, telemetry, parser,
  Node-built-in, public result/report/JSON, or public UI changes were made in
  Slice 1. Shared code remains host-neutral and browser-safe. Production
  readiness evidence covers deterministic source-local pairing, fail-closed
  reference validation, immutable facts, and no schedule recalculation.
- Unresolved risks: no public Slice 3, public UI, or public documentation work
  is included. A public
  DTO/result/report/JSON, schedule-meaning,
  identity-policy, or scope change remains a Main-owned Replanning trigger.
- Recommended route: Slices 1 and 2 are completion-committed. The comparison
  workflow dependency is now complete at `8e6922f8`; Main may route the
  revised public Slice 3 plan through independent review and the plan gate.

### Slice 2: Build The Internal Calendar Session And Transport Foundation

- Status: Implementation and completion are complete under the approved
  full-plan gate; dependency Slice 1 is completion-committed at `51a8ae4a`.
  Independent implementation review is `Ready` with no Findings, Completion
  Approval is recorded above, and the focused completion commit is
  `b9cee633`.
- Scope: move the command caller, injected builder dependency, and bootstrap
  composition into this integration slice. The existing
  `BuildSemanticDiffReportDataInput` remains unchanged. The calendar-owned
  adapter uses the additive input type
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }` for
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)`.
  The adapter parses before and after exactly once, preserves the existing
  side-specific parser-error union, and invokes comparison plus the pure
  builder once. When a period is selected, it forwards that same
  `SemanticDiffComparisonPeriod` value to
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`; when no period
  is selected, the command omits `options` and the adapter omits both
  `options` and `scheduleComparisonPeriod` from the comparison input. No
  `period`/`options.period` alias or `undefined` placeholder is allowed. The
  compare-success block invokes this injected adapter exactly once and hands
  both available and unavailable artifacts to the bootstrap calendar-owned
  `createScheduleAwareExplorerSession` companion. The companion always opens
  the normal Explorer once; only available `scheduleImpact` registers a sidecar
  and exposes the calendar action. Create the browser-safe
  calendar panel/transport and child-session registry; add the bootstrap-owned
  `ScheduleImpactSidecarRegistry` with `register(context, sidecar)`,
  `resolve(context)`, and `release(context)`. The companion always invokes
  `OpenSemanticDiffExplorer(context)` exactly once using the exact same context
  object; available impact owns register → Explorer session/panel creation →
  parent composite `onDidDispose` release, while unavailable impact skips
  registration/action and still returns the normal parent handle.
  Creation failure or cancellation rolls back registration and partial child
  resources. Child panel/session close destroys only child registry/epoch/action
  handles and retains the sidecar/context while the parent is alive. Enforce
  separate parent/child IDs,
  action/request correlation, registry and epoch ownership, immutable
  display-language inheritance, strict messages, per-message 8 MiB encoding
  limits, refresh/reopen/dispose behavior, and browser-safe mounting. This
  slice deliberately does not expose a public Explorer action or visible
  calendar UI.
- User / Domain Value: one comparison has one safe internal calendar
  destination whose malformed, stale, oversized, or late traffic cannot
  replace or resurrect facts.
- Cohesive Change Group: presentation VS Code calendar host/session/transport,
  browser-safe bridge, bootstrap composition, and lifecycle/transport tests.
- Planned paths and approval scope:
  - `src/bootstrap/extension/scheduleImpactSidecarRegistry.ts` (bootstrap-owned
    host-private registry API and exact context-identity lifecycle).
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`,
    `scheduleImpactCalendarSessionRegistry.ts`, and
    `scheduleImpactCalendarTransport.ts` (panel, registry, closed calendar
    envelope, byte-limit and epoch ownership).
  - `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`
    (calendar-owned companion that opens the existing Explorer exactly once for
    either impact state; available path owns register → session/panel creation
    → parent composite `onDidDispose` release, unavailable path skips registry
    and action; atomic rollback and no child sidecar release).
  - `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts` (plain
    browser-safe ready/refresh/host-message bridge only; no visible action or
    timeline yet).
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
    (command-facing `createBuildSemanticDiffPresentationArtifacts` adapter
    with the additive `BuildSemanticDiffPresentationArtifactsInput` and
    exact comparison-forwarding contract over the existing parser/error union,
    plus the pure builder contract).
  - `src/presentation/vscode/commands/semanticDiffCommand.ts` (inject the
    command-facing adapter into the compare-success block and invoke it
    exactly once; delegate available lifecycle to the companion).
  - `src/bootstrap/extension/semanticDiffWiring.ts` (wire the injected
    builder, companion, private resolver, and parent/child lifecycle
    composition) and
    `src/bootstrap/extension/extensionDependencies.ts` (construct and inject
    the sole parser/comparison/pure-builder adapter, registry, and companion)
    and
    `src/test/suite/scheduleImpactSidecarRegistry.test.ts`, plus
    `src/test/suite/buildSemanticDiffPresentationArtifactsAdapter.test.ts`,
    plus
    `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`, plus
    `src/test/suite/createScheduleAwareExplorerSession.test.ts`, plus
    `src/test/suite/scheduleImpactCalendarTransport.test.ts`,
    `src/test/suite/scheduleImpactCalendarSession.test.ts`,
    `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`.
  - `package.json` and `src/test/suite/packageManifest.test.ts` are explicit
    no-change guard paths: no command, menu, activation event, custom editor,
    or engine change is permitted in Slice 2.
- Acceptance: the existing `BuildSemanticDiffReportDataInput` remains
  unchanged and the command-facing adapter accepts the additive
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }`;
  the command omits `options` when no period is selected; the adapter omits
  `options` and `scheduleComparisonPeriod` from the comparison input in that
  case; and a selected period is forwarded as the same value under exactly
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`. It accepts no
  `period` or `options.period` alias and never sends an `undefined` placeholder.
  The adapter parses each source text once, invokes
  `compareSemanticDiffWithArtifacts` once and
  `buildSemanticDiffPresentationArtifactsFromComparison` once, while the
  compare-success block invokes the injected adapter exactly once. Parser
  failure/cancellation returns the existing error union and performs no
  registration. `not-requested` and `invalid` facts return
  `scheduleImpact.kind === "unavailable"`, preserve the invalid period in the
  existing result, and create no registry entry or calendar action. Evaluated
  facts return `kind === "available"`; both impact states are handed to
  `createScheduleAwareExplorerSession`, which invokes the existing injected
  `OpenSemanticDiffExplorer(context)` exactly once and receives
  `{ sessionId: string, panel: WebviewPanel, dispose(): void }`. Only the
  available path registers by exact context identity and exposes the calendar
  action; both paths attach one parent composite `onDidDispose` release for the
  normal Explorer handle. Comparison failure, cancellation, or session/panel
  creation failure never leaves a registration or partial child. Only parent
  Explorer disposal releases the sidecar; child close destroys only child
  registry/epoch/action handles. Parent-alive retained-artifact reopen resolves
  without recalculation, and late child work cannot mutate or resurrect a
  session.
  Host action resolution never sends the sidecar through the Explorer wire;
  parent/child IDs and internal calendar action/request IDs are distinct;
  owner registries enforce epochs; exact closed
  request/host/failure/close envelopes reject extra/missing/wrong/non-finite
  fields; every encoded calendar message
  is checked at and over 8 MiB; one open panel is reused; child disposal
  permits reopen with new identity; parent disposal cascades; stale and late
  work cannot affect a newer child; initial/refresh failure behavior preserves
  the specified snapshot semantics; no public action is available from the
  Explorer in this slice.
- Validation: registry register/resolve/release identity and failure/cancel
  matrix; exact adapter input-shape tests for omitted options, omitted period
  field, and selected-period forwarding by object identity to
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`; parser-
  before/after exactly-once, compare-once, pure-builder-once, and
  command-adapter-once call graph; side-specific parser-error preservation;
  facts-union unavailable/available
  mapping and invalid-result preservation; companion available and unavailable
  call-count tests proving exactly one `OpenSemanticDiffExplorer(context)` and
  a normal Explorer parent handle in both paths; available register → Explorer
  creation → panel `onDidDispose` parent release ordering; unavailable no
  registry/action; atomic rollback on creation failure/cancel; exact
  same-context Explorer creation; parent-only release; child close with
  retained sidecar/context; parent-alive reopen; and late-work tests; full
  envelope/error/parser matrix;
  action/parent/child/registry/epoch ownership; byte-limit
  exact-boundary tests for every message kind; reveal/reopen/new-identity/
  concurrent-session/disposal tests; immutable sidecar/context/display-language
  identity tests; browser-safe bridge and CSP checks; Explorer/report/source/
  Flow regressions; architecture, desktop/web, `rtk pnpm run qlty`, focused
  compiled tests, and build after implementation.
- Production Readiness: validate before mutation, release every child listener,
  child registry entry, epoch, and panel/action handle on child close; release
  the sidecar registry only on parent disposal; isolate child failure, reject
  partial/oversized payloads, suppress late posts/focus/recreation, preserve
  parent state, and use only VS Code `^1.75.0` and browser-safe APIs.
- Approval Boundary: only the listed command caller/injected
  `createBuildSemanticDiffPresentationArtifacts` adapter integration, including
  its additive `BuildSemanticDiffPresentationArtifactsInput` and
  `options.scheduleComparisonPeriod` forwarding/omission contract, pure
  application-builder dependency wiring, internal panel, child-session transport,
  bootstrap-owned sidecar registry,
  `createScheduleAwareExplorerSession` companion,
  `semanticDiffWiring.ts`/`extensionDependencies.ts`, bridge, parent-only
  release lifecycle, tests, and manifest no-change guard. The immutable
  `{ result, summary }`
  context and existing error-union wrapper output remain unchanged by
  predecessor code. No Explorer predecessor hook is added. A visible/public
  Explorer action, timeline/filter UI, new public command/contribution,
  persistent state, telemetry, workflow input/default, sidecar registry
  ownership/API change, or Explorer transport change requires Replanning.
- Dependencies: completion-committed Slice 1 and the existing Explorer host
  registry/session creation contract, including the injected
  `OpenSemanticDiffExplorer` dependency and concrete
  `SemanticDiffExplorerSessionHandle`; if the predecessor exposes a different
  symbol or handle shape, stop at the implementation gate and route Replanning
  before changing this boundary. No predecessor hook change is required.
  Its completed source-text/options adapter contract is consumed by the
  comparison workflow; Slice 2 itself does not depend on that workflow. Slice
  2 is not a user-visible feature and does not make the action reachable.
- Risks: parent/child identity collision, sidecar registry ownership inversion,
  context identity drift, duplicate builder invocation, registration after
  failure/cancel, non-atomic companion rollback, premature parent release,
  accidental child release, resurrection after disposal/reopen, stale request
  acceptance, byte-count mismatch, display-language override, or accidental
  manifest exposure.
  Call-graph, registry lifecycle, exact-envelope, identity, and limit matrices
  are the gate.
- Implementation evidence: the approved command/application adapter,
  bootstrap composition and exact-context sidecar registry, Explorer
  companion, internal calendar panel/session/transport, browser-safe bridge,
  and the seven approved Slice 2 test paths are implemented and committed in
  `b9cee633`. The latest review remediation adds a valid immutable
  context fixture, parent-to-child panel/listener disposal cascade, disposed
  and stale callback/post guards, recursive strict JSON validation, and
  normalized session-language title/HTML assertions, request-envelope result
  preservation for stale ready/refresh messages, and unchanged-message late
  callback assertions. `rtk pnpm exec tsc -p
tsconfig.json --noEmit`, `rtk pnpm run test:compile`, focused transport/
  session/sidecar/adapter Mocha tests (11 passing), Slice 1 regression Mocha
  tests (67 passing), desktop/web webpack builds, desktop extension-host
  tests, web extension-host tests (with existing stream-cleanup warnings),
  `rtk pnpm run qlty:check`, `rtk pnpm run qlty:smells` (advisory
  complexity/duplication findings), markdown lint, and `git diff --check` are
  the current validation evidence.
  Completion Approval and the focused completion commit are recorded above;
  the completed comparison workflow is now the dependency consumed by public
  Slice 3.
- Out of Scope: public Explorer action, candidate/root UI, timeline/filter/
  legend, React rendering, documentation, package contributions, Flow/source
  changes, persistence, and schedule calculation.

### Slice 3: Expose The Accessible Localized Schedule-Impact Timeline

- Status: Implementation complete under focused approved plan commit
  `70ff7da7`; Slice 1 and Slice 2 are complete, and the
  `semantic-diff-comparison-workflow` dependency is satisfied by `8e6922f8`.
  Independent implementation review is `Ready` with no Findings, and
  Completion Approval is recorded. The focused completion commit is
  `ffb92f1e`; the format-only correction is completion-committed at
  `09148de4`. Explicit Closure Approval remains pending.
- Scope: consume the completed workflow's successful evaluated-period
  `SemanticDiffPresentationArtifacts` through the existing
  `openScheduleAwareExplorerSession` companion, then expose one additive
  `Schedule impact` action from the existing Explorer surface. Resolve the
  host-private sidecar into a child calendar session; add localized accessible
  timeline/status sections, separate root outcome and run-state filters,
  explicit root-scope transition labels in the filters/legend without treating
  them as run states, candidate before/after display, bounded virtualization,
  desktop/web parity, webpack bundle wiring, and durable user documentation.
  A no-period workflow selection opens the ordinary Explorer with unavailable/
  not-requested impact and no calendar action or panel. Invalid workflow input
  fails before comparison, artifact construction, or Explorer opening. Direct
  adapter invalid-period fixtures remain separate evidence for unavailable
  impact. Explorer's existing public message contract remains unchanged.
- User / Domain Value: reviewers can inspect exact supported schedule effects,
  valid no-runs, partial roots, explicit uncalculated issues, and ambiguous
  candidates in the selected period without confusing them or losing facts.
- Cohesive Change Group: Explorer action adapter, calendar React UI/model/
  accessibility, localization resources, webpack entry, integration/a11y/
  scale tests, and user-facing documentation.
- Planned paths and approval scope:
  - `src/presentation/webview/editor/scheduleImpactCalendar.tsx`,
    `src/presentation/webview/editor/scheduleImpactCalendar/`
    (`ScheduleImpactCalendarApp.tsx`, `scheduleImpactCalendarModel.ts`,
    `scheduleImpactCalendarAccessibility.ts`, and filter/focus helpers) for
    canonical timeline, candidate section, outcome/issue sections, filters,
    keyboard, announcements, high contrast, reflow, and virtualization.
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts`,
    `semanticDiffExplorerPanelTypes.ts`, `semanticDiffExplorerPanelHtml.ts`,
    `semanticDiffExplorerPanelInstall.ts`, `semanticDiffExplorerPanelActions.ts`,
    and `semanticDiffExplorerPanelRequests.ts`,
    `semanticDiffExplorerPanelTransport.ts`,
    `semanticDiffExplorerRegistry.ts`, and
    `semanticDiffExplorerPanelLifecycle.ts`, plus
    `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
    `semanticDiffExplorerHostState.ts`, `semanticDiffExplorerHostMessageState.ts`,
    and `semanticDiffExplorerView.tsx` for the host-private action ID,
    button, callback, focus recovery, and announcement. Allocate the trigger
    with the existing `actionIdAllocator` (`sde-action-*`), register it only
    for an available sidecar in the host action membership/registry, validate
    it through the existing session-scoped `actionIds`, and dispatch the private
    calendar callback before normal source/flow/output metadata dispatch.
    Resolve the sidecar by the immutable context object, open or reveal the
    child through `openScheduleImpactCalendarPanel`, and preserve the existing
    Explorer message union and action-result envelope. The calendar session's
    `sdc-calendar-action-*` ID must remain outside this membership.
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts` and
    `scheduleImpactCalendarPanelRuntime.ts` to mount the calendar bundle while
    retaining the existing child-session/transport lifecycle.
  - `src/resource/i18n/scheduleImpactCalendar.ts`,
    `src/resource/i18n/scheduleImpactCalendar_en.ts`, and
    `src/resource/i18n/scheduleImpactCalendar_ja.ts` for labels, badges,
    errors, and English fallback; `displayLanguage` comes only from the
    immutable parent session.
  - `src/bootstrap/extension/semanticDiffWiring.ts` and
    `src/bootstrap/extension/createScheduleAwareExplorerSession.ts` for the
    existing Explorer action adapter, evaluated-artifact gate, and
    host-private sidecar/panel resolution. No change to the completed
    comparison workflow is planned in this feature; `8e6922f8` is an explicit
    dependency guard.
    `webpack.config.js` for the additive `scheduleImpactCalendar` web entry.
    `package.json` remains unchanged and is checked by
    `src/test/suite/packageManifest.test.ts` for no command/menu/activation/
    custom-editor/engine drift.
  - `src/test/suite/scheduleImpactCalendarProjection.test.ts`,
    `src/test/suite/scheduleImpactCalendarView.test.tsx`,
    `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`,
    `src/test/suite/scheduleImpactCalendarLocalization.test.ts`, and
    `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
    `src/test/suite/semanticDiffExplorerRegistry.test.ts`, and
    `src/test/suite/semanticDiffExplorerPanel.test.ts` for projection,
    DOM/keyboard/a11y/locale/action/session/desktop-web coverage, compatible
    `sde-action-*` registration/validation, private-before-normal dispatch,
    and lifecycle cleanup; extend
    `src/test/suite/semanticDiffCommand.test.ts` and
    `src/test/suite/semanticDiffCommandScheduleImpact.test.ts` only as
    workflow-consumption guards for exact evaluated artifact, no-period
    ordinary-Explorer/unavailable behavior, invalid-input pre-comparison
    failure, and direct adapter invalid-period states.
    `src/test/suite/semanticDiffWiring.test.ts` and
    `src/test/suite/createScheduleAwareExplorerSession.test.ts` cover the
    completed workflow handoff and exact immutable-context sidecar/parent/
    child action lifecycle, including dispose, reopen, stale, failure, and
    unavailable cases.
  - `docs/requirements/use-cases/uc-present-schedule-impact.md` (new durable
    use case), `docs/requirements/use-cases/README.md` (index), `README.md`,
    and `CHANGELOG.md` when externally observable behavior is delivered.
- Acceptance: with the completed workflow at `8e6922f8`, a successful
  `runFileComparisonWorkflow` valid-period selection produces an evaluated
  artifact, registers one compatible `sde-action-*` trigger for that parent,
  and one click opens or reveals one child session without re-running. The
  trigger is accepted by the existing session-scoped Explorer validator and
  is handled by the private calendar callback before source/flow/output
  metadata dispatch; its result uses the existing action-result envelope.
  With a no-period selection, the workflow continues through comparison and
  opens the ordinary Explorer with unavailable/not-requested impact, without
  registering or exposing a calendar trigger or creating a calendar panel.
  With invalid workflow input, `selectWorkflowPeriodStep` fails before
  comparison, artifact construction, or Explorer opening; direct adapter
  invalid-period fixtures remain separate evidence for unavailable impact.
  The available action resolves the retained sidecar by exact immutable
  context identity through the Slice 2 companion and opens/reveals the child.
  Exact period, paths, IDs, side states, duplicate occurrences, candidate
  groups, composite source-change references, timeline effects, `Valid no
runs`, and `Uncalculated schedule portions` are rendered. Partial roots show
  both their supported timeline runs and issue section. Both-root pairs,
  root rename/move pairs, and one-sided `removed-root-scope`/
  `added-root-scope` transitions render with counterpart metadata and no
  cross-side run pairing. Root-outcome and run-state selectors are separate
  and conjunctive; scope-transition labels remain outside run-state options;
  global/visible totals and filter no-match remain correct. Immutable inherited
  `displayLanguage` selects Japanese or English and unknown locale falls back
  to English without changing sort/date/IDs. Empty, zero-only, mixed, invalid,
  malformed, stale, oversized, disposed, reopened, candidate-only, and
  10,000-entry cases have explicit accessible outcomes with no silent
  merge/truncation. Existing workflow tests prove source/period selection,
  exact `options.scheduleComparisonPeriod` forwarding, cancellation before
  comparison, and the single artifact/Explorer handoff; Slice 3 does not
  alter those flows.
- Validation: pure projection/filter/ordering/ID-display tests; root
  correspondence matrix and scope-transition metadata fixtures; React DOM,
  keyboard/focus/live-region, root-outcome/run-state/scope-transition filter
  and legend tests, candidate and issue-section matrix including target-key
  collision fixtures; axe, forced colors,
  200%/400% reflow, reduced motion;
  virtualization threshold/20-row overscan/first-last/count tests; locale and
  timezone parity; completed workflow source/period/evaluated-artifact guards,
  no-period ordinary-Explorer/unavailable behavior, invalid-input failure
  before comparison/open, and direct adapter invalid-period fixtures;
  `sde-action-*` allocation/registration/session validation, private-before-
  normal dispatch, exact-context sidecar resolution, and action/parent-child
  session/reopen/dispose/stale/failure/unavailable tests;
  bundle/CSP/manifest and architecture checks; report/JSON/Flow/source/copy/
  schedule regressions; desktop and web suites; `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- Production Readiness: memoize projection/filtering, bound DOM to fewer than
  300 item nodes for the 10,000-entry fixed viewport, preserve stable IDs and
  exact counts/order, escape raw values, keep error snapshots isolated, clean
  up handles, avoid sensitive/new telemetry, and maintain VS Code `^1.75.0`
  desktop/web parity.
- Approval Boundary: only the additive Explorer action adapter, calendar
  webview/resources/bundle, named tests, use-case/index, README, and required
  CHANGELOG entry. A visual month/week grid, schedule meaning, JSON/report/
  Flow/source contract, new command or activation, comparison workflow input,
  persistence, telemetry, editing, or predecessor change requires Replanning.
- Dependencies: completion-committed Slice 2 and completed workflow commit
  `8e6922f8`, including `runFileComparisonWorkflow`,
  `selectWorkflowPeriodStep`, `buildWorkflowArtifacts`, exact period
  forwarding, and `openScheduleAwareExplorerSession`. A valid evaluated
  artifact is required for the action; no-period continues to the ordinary
  Explorer with unavailable/not-requested impact, while invalid workflow
  input fails before comparison/artifact/open. Direct adapter invalid-period
  fixtures remain distinct. The Explorer trigger uses `sde-action-*` from the
  existing allocator and session validation; `sdc-calendar-action-*` stays
  child-transport-private. Slice 3 does not alter the workflow, Explorer
  message union, or action-result envelope; it adds only the host-private
  action and visible calendar integration. The completed Wave 4 calendar item
  is removed from the roadmap during closure.
- Risks: action ID allocation/registry drift, private callback ordering,
  hidden focus, screen-reader gaps, locale leakage,
  root/run filter conflation, timezone conversion, large DOM, candidate
  misclassification, or stale child identity. A11y, locale, root/candidate,
  lifecycle, scale, and predecessor regression matrices are the gate.
- Out of Scope: schedule calculation, month/week grid, runtime history,
  external calendars, WebAPI comparison, Flow/source redesign, JSON/report
  changes, editing, persistence, new telemetry, and package contributions.

### Slice 3 Implementation Evidence

- Status: Slice 3 implementation is complete under focused approved plan
  commit `70ff7da7`; independent implementation review is `Ready` with no
  Findings, Completion Approval is recorded, and the focused completion commit
  is `ffb92f1e`. The format-only correction is completion-committed at
  `09148de4`; explicit Closure Approval remains pending.
- Changed paths: the host-private Explorer calendar action adapter and
  lifecycle plumbing; the browser-safe calendar entry, model, filters,
  accessibility/focus helpers, view, and localized resources; the calendar
  panel CSP/bundle shell; webpack entry; integration/projection/view/
  localization/accessibility tests; and the approved use-case/index,
  README, CHANGELOG, and feature evidence updates. The unlisted semantic-diff
  localization helper was not changed.
- Acceptance evidence: available sidecars allocate one `sde-action-*` ID,
  register it only in the parent Explorer membership, validate it through the
  existing session request gate, and dispatch the private calendar callback
  before normal report handling. The callback resolves the sidecar with the
  exact immutable context, opens/reveals the child through the existing panel
  factory, and returns the existing action-result envelope. Calendar transport
  IDs remain outside Explorer membership. The view preserves the half-open
  period, deterministic date/time/rule/occurrence ordering, separate
  conjunctive root/outcome/run-state filters, root-scope transition metadata,
  candidate and issue sections, localized EN/JA fallback, accessible names,
  focus recovery, reduced-motion styles, and bounded virtualization. The
  review correction pass also exposes every timeline/run/candidate/issue
  identity and structured detail, filters root statuses/no-runs/issues with
  global counts preserved, adds a text/icon/pattern legend, implements roving
  keyboard focus with live announcements, removes disposed panel handles from
  both caches, and bounds every repeated section for large results.
- The second review correction adds root and valid-no-runs rows with stable
  root IDs, localized before/after side facts, explicit absent-side wording,
  and root-scope transition identity decision IDs. Virtualized timeline,
  candidate, and issue lists now use imperative scrolling with deferred
  post-mount focus recovery so keyboard End/Arrow navigation reaches
  offscreen last entries.
- Validation completed after the correction pass: `rtk pnpm run
test:compile`; projection/localization/accessibility/view tests covering
  metadata, paired/one-sided/root-scope facts, root/outcome no-match
  matrices, keyboard navigation, legend patterns, and a 10,000-entry DOM
  bound plus first/last focus reachability for timeline, candidates, and
  issues; the focused host action and repeated panel lifecycle tests are
  compiled and included in the
  extension-host run; production and desktop/web development builds; desktop
  extension-host tests; web extension-host tests; `rtk pnpm run qlty:check`
  (no issues); `rtk pnpm run qlty:smells` (advisory complexity/duplication
  findings only); `rtk pnpm run lint:md`; and `git diff --check`. Desktop
  retains the existing macOS codesign warning; web retains the existing
  EPIPE/Premature-close stream-cleanup warnings.
- Compatibility/readiness: package contributions, VS Code `^1.75.0`, public
  Explorer message union/action-result envelope, result/report/JSON contracts,
  workflow input, schedule calculation, Flow/source behavior, and telemetry
  remain unchanged. Shared calendar code has no Node built-in dependency;
  the panel uses a nonce-bound CSP and the bundle is loaded through
  `asWebviewUri` for desktop/web parity. Raw values are rendered as React text
  nodes and lifecycle disposal remains parent-owned.
- Unresolved risks: no implementation or product risks remain. Quality smell
  findings are advisory and limited to the newly added UI/adapter complexity
  and duplicated locale shape. Existing desktop codesign, web stream-cleanup,
  and webpack size warnings remain documented compatibility observations.
- Historical route at Slice 3 completion: Feature Exit was ready for explicit
  Closure Approval; subsequent user requests reopened planning for the
  presentation-only Slice 4 calendar MUI decomposition and Slice 5 Explorer
  package/component alignment. That historical closure proposal is now
  superseded by the completed five-slice Feature Exit evidence below.

### Slice 4: Organize The Calendar Webview With MUI Components

- Status: Complete on 2026-09-15 under approved plan/replan commit
  `271c6027`; independent implementation review is `Ready` with no Findings,
  automatic no-findings Completion Approval is recorded, and focused completion
  commit `d4344a26` is complete. Slice 5 followed this slice and is complete.
- Scope: refactor the browser-safe calendar presentation into the same
  entry-to-contents composition used by the table and Flow webviews. Keep the
  thin `scheduleImpactCalendar.tsx` bootstrap entry, move session loading and
  theme/global-style ownership into a lean `ScheduleImpactCalendarApp`, and
  move model/filter/announcement composition into
  `ScheduleImpactCalendarContents`. Organize the visible view around MUI
  `AppBar`/`Toolbar`, `Box`, `Stack`, `Paper`, `List`/`ListItem`, `Chip`,
  `Alert`, `Typography`, and MUI form controls. Preserve all existing facts,
  filters, focus behavior, virtualization, lifecycle messages, and localized
  labels while making the component boundaries explicit.
- User / Domain Value: the schedule-impact calendar is maintainable and
  visually consistent with the existing table and Flow webviews, with MUI
  layout and control semantics that continue to support accessible inspection
  of the completed comparison.
- Cohesive Change Group: presentation-only component extraction and MUI shell
  refinement. No application/domain meaning, bridge/session protocol,
  Explorer action, or calendar sidecar change is part of this slice.
- Planned paths and approval scope:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`:
    retain the session hook and provided-sidecar test seam, own
    `ThemeProvider`, `CssBaseline`, `GlobalStyles` (including the shared
    `viewerThemeGlobalStyles` and semantic-diff global styles), and render
    loading/error states or `ScheduleImpactCalendarContents`. Preserve the
    existing `ScheduleImpactCalendarView` export from this path for current
    view tests while delegating its composition to the new contents module.
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`:
    own labels, model/filter state, live announcements, the 100vh MUI
    `Stack`/`Box` surface, and the ordered child composition. The contents
    component consumes the calendar sidecar DTO and the inherited language;
    it does not read `MyContexts` or parser data.
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`:
    render the sticky MUI `AppBar`/`Toolbar` title, half-open period, and
    global/visible result `Chip`/status text using the existing localized
    labels and accessible title identity.
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarFilters.tsx`:
    extract the existing root, outcome, and run-state selectors into MUI
    `Stack`, `FormControl`, `InputLabel`, and `NativeSelect` controls. Keep
    the three independent conjunctive filter values, option IDs, focus
    restoration, scope-transition labels, and filter-change announcement.
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`:
    group the root-status, valid-no-runs, candidate, issue, and legend
    sections. Use MUI `Box`, `Stack`, `Paper`, `List`/`ListItem`, `Chip`, and
    `Alert` for the existing explicit states and empty/no-result messages;
    retain stable section labels, global/visible counts, root/candidate/issue
    IDs, structured details, and localized absent-side wording.
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`:
    extract the date-grouped timeline, timeline item/run detail rendering,
    and timeline-specific imperative focus/virtualization handling. Keep
    `Virtuoso`, overscan, threshold, stable item IDs, date grouping, roving
    keyboard navigation, deferred focus recovery, `Paper` cards, and the
    existing accessible names unchanged.
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarBoundedList.tsx`:
    extract the shared bounded repeated-section list and its private
    `useScheduleImpactCalendarBoundedList` focus/virtualization helper for
    root, no-run, candidate, and issue rows. Reuse the current numeric
    position/set-size and first/last focus behavior; do not introduce a
    generic dependency or merge it with the timeline's identity-keyed focus
    state when their contracts differ.
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx` (new focused
    component test): assert the App → Contents → Header/Filters/Sections/
    Timeline composition, MUI semantic roles and control labels, sticky
    layout/status/empty-state rendering, and preservation of stable IDs and
    filter behavior without snapshots that couple to incidental MUI markup.
    Extend the existing calendar view/accessibility tests only where the
    extracted component boundary requires it.
  - Existing direct regression scope remains the ten suites
    `scheduleImpactCalendarAccessibility.test.tsx`,
    `scheduleImpactCalendarBridge.test.ts`,
    `scheduleImpactCalendarLocalization.test.ts`,
    `scheduleImpactCalendarProjection.test.ts`,
    `scheduleImpactCalendarSession.test.ts`,
    `scheduleImpactCalendarTransport.test.ts`,
    `scheduleImpactCalendarView.test.tsx`,
    `semanticDiffExplorerPanel.test.ts`,
    `semanticDiffExplorerRegistry.test.ts`, and
    `semanticDiffExplorerScheduleImpact.test.ts`; their existing lifecycle,
    action, transport, DTO, a11y, locale, scale, and desktop/web assertions
    remain in the Slice 4 validation set.
- Acceptance: the unchanged thin calendar entry mounts a lean App that
  supplies the existing theme and global styles, handles missing/failing
  sessions, and delegates a supplied sidecar to Contents. Contents renders a
  table/Flow-style 100vh MUI shell with a sticky Header, MUI filters, and
  ordered root/no-run/candidate/issue/legend/timeline sections. The Header
  preserves the title, half-open period, result counts, and accessible status;
  Filters preserve independent conjunctive root/outcome/run-state behavior,
  option IDs, focus recovery, and scope-transition wording; Sections preserve
  all root, no-run, candidate, issue, legend, stable identity, count, and
  explicit empty/error text; Timeline preserves date/time/rule/occurrence
  ordering, side details, virtualization, roving focus, live announcements,
  and 10,000-entry bounded rendering. MUI `Alert` is used only to present an
  existing explicit empty/error/no-result state and does not invent a new
  schedule status. EN/JA/fallback labels, high contrast, reduced motion,
  200%/400% reflow, CSP, desktop/web behavior, and the calendar session
  lifecycle remain unchanged.
- Validation: run the new component behavior test and the ten existing
  calendar/Explorer regression suites; `rtk pnpm run test:compile`;
  production `rtk pnpm run build`; desktop and web development builds via
  `rtk pnpm run development:desktop` and `rtk pnpm run development:web`;
  desktop and web extension-host coverage through the repository's full test
  preparation/run path; MUI role/label, filter, focus, live-region,
  forced-colors, reduced-motion, reflow, localization, stable-ID, and
  virtualization/DOM-bound checks; `rtk pnpm run qlty`; `rtk pnpm run
lint:md`; and `git diff --check`.
- Production Readiness: keep all shared code browser-safe and below the
  existing architecture boundaries; preserve nonce-bound CSP and existing
  bundle loading; retain stable DOM IDs, label keys, focus targets, counts,
  and virtualization thresholds; ensure MUI layout works at high contrast,
  forced colors, reduced motion, narrow widths, and large result sets; avoid
  extra renders by keeping model derivation and callbacks in Contents; and
  record no README/CHANGELOG change because this is an internal presentation
  refactor with no new observable behavior.
- Approval Boundary: only the calendar presentation App, the seven named
  calendar component/helper files, and the focused component/regression test
  updates listed above. `scheduleImpactCalendar.tsx` remains the existing
  thin entry. The sidecar/application DTO and model contract, session bridge
  and transport, Explorer registry/action IDs, bootstrap/panel lifecycle,
  workflow period gate, `webpack.config.js`, package contributions, resource
  keys, `MyContexts`, table/Flow components, schedule calculation, telemetry,
  result/report/JSON contracts, and user-facing documentation are outside
  this slice.
- Dependencies: Slice 3 completion commit `ffb92f1e` plus format correction
  `09148de4`; the completed workflow dependency `8e6922f8`; and the existing
  shared MUI theme/style modules. Slice 4 has no dependency on the deferred
  roadmap/feature-folder closure proposal. Implementation may start only
  after independent plan review, the replan plan commit, and the normal
  per-slice implementation gate; the user's automatic no-findings approval
  applies after a clean independent implementation review, with the final
  human approval still batched after all five slices.
- Risks: moving state or refs can change filter reset, focus recovery, or
  virtualized offscreen navigation; MUI semantic wrappers can change list and
  label relationships; sticky/nested scrolling can regress narrow/reflow
  behavior; extraction can introduce import cycles or duplicate theme roots;
  and an over-eager shared hook can mix numeric section positions with
  identity-keyed timeline focus. Tests must exercise lifecycle reopen/failure,
  keyboard first/last and deferred focus, high contrast/reflow, all explicit
  empty states, large lists, and unchanged DTO/bridge behavior.
- Out of Scope: schedule recalculation or meaning, sidecar/model/DTO changes,
  Explorer action/registry/transport changes, command/workflow/bootstrap/panel
  changes, parser or `MyContexts` integration, table/Flow redesign, visual
  month/week grid, external calendars, persistence, telemetry, new packages,
  manifest/webpack/activation changes, and README/CHANGELOG changes.

### Slice 4 Implementation Evidence

- Status: Complete on 2026-09-15; independent `implementation-reviewer`
  review is `Ready` with no Findings, automatic no-findings Completion Approval
  is recorded, and focused completion commit `d4344a26` is complete. Slice 5
  follows and is also complete.
- Changed paths: the approved calendar App, Contents, Header, Filters,
  Sections, Timeline, and BoundedList modules under
  `src/presentation/webview/editor/scheduleImpactCalendar/`, plus the focused
  `src/test/suite/scheduleImpactCalendarComponents.test.tsx`.
- Implementation result: the thin calendar entry and session seam remain
  unchanged. App owns the session fallback, one ThemeProvider, CssBaseline,
  and both viewer and semantic-diff global styles. Contents owns model/filter
  state, live announcements, and the 100vh Stack shell. Header, Filters,
  Sections, Timeline, and BoundedList own their planned presentation and focus
  boundaries. MUI AppBar/Toolbar/Chip, Stack/Box, List/ListItem, Paper, and
  Alert primitives provide the table/Flow-style composition while preserving
  stable IDs, labels, side metadata, counts, filters, localization, explicit
  empty/error states, and bounded virtualized navigation.
- Acceptance evidence: the focused component test covers the App → Contents →
  Header/Filters/Sections/Timeline composition, MUI landmarks and controls,
  stable timeline/candidate/issue IDs, and conjunctive outcome filtering.
  Existing calendar view/accessibility/projection/localization tests remain
  green with the extracted boundaries and retain the 10,000-entry bound and
  first/last keyboard reachability.
- Validation completed after the final Slice 4 diff: `rtk pnpm run
test:compile`; direct calendar component, view, accessibility,
  localization, and projection Mocha run (`11 passing`); production
  `rtk pnpm run build`; `rtk pnpm run development:desktop`; `rtk pnpm run
development:web`; desktop `rtk node ./out/test/runTest.js` (exit 0);
  permitted web `rtk pnpm run test:web:run` (exit 0, WEB-7 through WEB-10
  passed); full `rtk pnpm run qlty:check` (`No issues`); `rtk pnpm run
lint:md` (0 errors); and `git diff --check`.
- Compatibility/readiness: no application/domain/DTO, bridge/session
  transport, Explorer, action, workflow, package contribution, resource key,
  CSP, or telemetry behavior changed. Shared calendar code remains
  browser-safe and desktop/web bundles compile. Existing webpack size
  warnings, desktop macOS codesign warning, and web stream-cleanup warnings
  remain environmental observations and do not change the Slice 4 result.
- Unresolved risks: no known implementation risks remain. Existing bundle-size,
  desktop codesign, web stream-cleanup, and advisory smell findings remain
  documented observations.
- Implementation review: independent `implementation-reviewer` returned
  `Ready` with no Findings. Main recorded automatic no-findings Completion
  Approval under the user's instruction, and focused completion commit
  `d4344a26` is complete.

### Slice 5: Organize The Semantic Diff Explorer Webview Components

- Status: Complete on 2026-09-15 after the user-requested presentation-only
  package alignment. Slice 5 followed the calendar MUI refactor in Slice 4;
  its independent plan/review, Completion Approval, and focused completion
  commit are recorded below.
- Scope: preserve the existing Explorer host bridge while moving its webview
  entry and components into an `editor/semanticDiffExplorer` package shaped
  like `editor/ajsFlow` and `editor/ajsTable`. Separate the current loaded view
  into a lean App, Contents/controller, Header/filter, summary-card, and
  tree-panel composition. Use the existing MUI
  `ThemeProvider`, `CssBaseline`, `GlobalStyles`, `Stack`, `Box`, `AppBar`,
  `Toolbar`, `Paper`, `Card`, `Chip`, `Button`, and form-control patterns used
  by the table and Flow webviews. Keep the Explorer hierarchy, row/detail
  rendering, filter meaning, selection/focus state, output/source/Flow actions,
  calendar action, host announcements, localization, theme-mode behavior, and
  virtualization unchanged.
- User / Domain Value: the existing Semantic Diff Explorer becomes easier to
  maintain and consistent with the table/Flow webview composition without
  changing the comparison facts or the actions reviewers use to inspect them.
- Cohesive Change Group: presentation-only extraction of existing Explorer
  React composition and MUI shell ownership. This slice does not reimplement
  the Explorer hierarchy, alter application DTOs/messages, or change the
  calendar action adapter.
- Boundary check: `SPECS.md`'s non-goal against reimplementing the Explorer
  hierarchy, Flow graph, diff overlays, source navigation, or public transport
  remains satisfied because this slice only relocates existing rendering and
  handlers behind compatible component props. No normative `SPECS.md` change
  is required. A behavior, hierarchy, action, message, or public-contract
  change discovered during implementation must return to Replanning and may
  require a feature-author decision.
- Planned paths and approval scope:
  - `src/presentation/webview/editor/semanticDiffExplorer.tsx` (new thin
    bundle entry): mirror `editor/flowViewer.tsx` and `editor/tableViewer.tsx`
    by calling `bootstrapViewer` with the package App. Update the
    `semanticDiffExplorer` entry in `webpack.config.js` to this path while
    retaining the existing output bundle name and host HTML URL.
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp.tsx`
    (new): own `useSemanticDiffExplorerHost`, theme-mode observation,
    normalized labels, loading/failure rendering, and the single MUI theme/
    global-style shell. Pass the existing view model, action IDs/callbacks,
    host announcement, language, and theme mode to Contents. Preserve the
    ready message, session filtering, stale/closed behavior, and pending
    action element used for focus restoration.
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
    (new): own filter, tree-expansion, selection, and local announcement
    controller composition. Render the table/Flow-style 100vh `Stack` shell,
    semantic viewer surface, status/live region, and ordered Header, summary,
    and tree-panel children. Keep the current `SemanticDiffExplorerViewProps`
    action callback signatures and `virtualizedScrollToIndex` seam.
  - `src/presentation/webview/editor/semanticDiffExplorer/Header.tsx` (new):
    extract the
    existing output and optional schedule-impact buttons and the
    confirmation-required filter into a sticky MUI `AppBar`/`Toolbar` with
    `Button`, `FormControl`, `InputLabel`, and `NativeSelect`. Preserve action
    element forwarding for focus recovery, filter focus/announcement,
    disabled/unavailable semantics, localized labels, and the existing
    `sde-action-*` caller behavior.
  - `src/presentation/webview/editor/semanticDiffExplorer/SummaryCards.tsx`
    (new): extract
    the summary card grid using MUI `Card`, `CardContent`, `Typography`, and
    `Chip`-compatible facts while preserving card IDs, counts, accessible
    names, responsive min-width, and detail values.
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
    (new):
    extract the tree container, row handlers, `Virtuoso` threshold/overscan,
    `aria-activedescendant` ownership, keyboard routing, row registration,
    and action callback plumbing. Continue to consume the existing
    `ExplorerRowView`/row-detail implementation from
    `semanticDiffExplorerTree.tsx`; do not duplicate or reinterpret its leaf
    facts, action availability, or detail formatting.
  - `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`:
    preserve the current module as a compatibility facade that exports the
    new editor-package App as its default and keeps `applyExplorerFilter`
    available to existing callers and tests. Keep
    `src/presentation/webview/semantic-diff/semanticDiffExplorerEntry.tsx` as
    a compatibility entry forwarding to the new editor package so old test or
    host references remain valid; webpack uses the new editor entry.
  - `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`:
    preserve the current `SemanticDiffExplorerView` export and its direct
    test-facing theme-mode API as a compatibility wrapper around the editor
    package Contents;
    retain the existing flatten/focus helper exports and `applyExplorerFilter`
    re-export. The production App owns the one theme shell; direct View
    callers continue to receive the current theme/global-style behavior.
    Existing host, message, view-state, keyboard, focus, tree-data, row/detail,
    localization, and theme-mode modules remain behavior owners and are not
    redesigned.
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx` (new focused
    component test): assert entry-compatible App loading/loaded composition,
    Contents-to-Header/SummaryCards/ExplorerTreePanel boundaries, MUI roles
    and labels, sticky layout, status/live-region behavior, output/calendar
    callback element forwarding, and preservation of existing IDs without
    snapshot coupling to incidental MUI markup.
  - Existing Explorer regression scope remains
    `src/test/suite/semanticDiffExplorerDom.test.tsx`,
    `src/test/suite/semanticDiffExplorerThemeMode.test.ts`,
    `src/test/suite/semanticDiffExplorerProjection.test.ts`,
    `src/test/suite/semanticDiffExplorerMessages.test.ts`,
    `src/test/suite/semanticDiffExplorerFlow.test.ts`,
    `src/test/suite/semanticDiffExplorerSourceAction.test.ts`,
    `src/test/suite/semanticDiffExplorerReportAction.test.ts`,
    `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`,
    `src/test/suite/semanticDiffExplorerPanel.test.ts`,
    `src/test/suite/semanticDiffExplorerRegistry.test.ts`, and
    `src/test/suite/muiTheme.test.ts`; run these unchanged except for import
    compatibility assertions required by the extracted modules.
- Acceptance: the existing Explorer bundle entry still mounts the new App;
  App sends the same ready request, renders the same loading/failure state,
  observes the same theme mode, and supplies one MUI theme/global-style
  boundary to loaded Contents. Contents preserves the existing filter,
  expanded-tree, latent-selection, status, announcement, and virtualization
  behavior. Header preserves output, optional schedule-impact, and filter
  controls, including callback element identity and unavailable action
  semantics. SummaryCards preserve count/detail labels and responsive
  layout. ExplorerTreePanel preserves tree roles, row IDs/levels/positions,
  leaf detail/action buttons, keyboard navigation, deferred virtualized focus,
  and source/Flow/report/calendar action routing. Existing localization,
  high-contrast/forced-colors, reduced-motion, 200%/400% reflow, desktop/web,
  session close/reopen, and stale/failure handling remain unchanged. No new
  control or user workflow is added.
- Validation: run the focused component test and all listed Explorer,
  calendar-action, host-session, MUI-theme, flow/source/report regression
  suites; `rtk pnpm run test:compile`; production `rtk pnpm run build`;
  `rtk pnpm run development:desktop`; `rtk pnpm run development:web`;
  desktop and web extension-host coverage through the repository's full test
  preparation/run path; DOM/axe, role/label, action element-forwarding,
  keyboard/focus, virtualized 10,000-row, theme-mode, forced-colors,
  reduced-motion, localization, and reflow checks; `rtk pnpm run qlty`;
  `rtk pnpm run lint:md`; and `git diff --check`.
- Production Readiness: keep webview imports browser-safe and inside the
  presentation boundary; keep the existing nonce-bound CSP and bundle URL;
  avoid duplicate ThemeProviders in production; preserve target-size and
  focus styles, row identity, virtualized DOM bounds, and callback lifecycles;
  verify that App/Contents extraction does not change render timing or host
  session cleanup; and make no README/CHANGELOG update because this is an
  internal composition refactor with no new observable behavior.
- Approval Boundary: only the new editor package App, Contents, Header,
  SummaryCards, ExplorerTreePanel, and thin package entry; the two existing
  compatibility facades/entry; the exact `webpack.config.js` entry path update;
  and the focused component/regression test updates listed above. The
  application DTO/message union, host bridge/session lifecycle, action
  registry/transport, calendar sidecar, workflow, bootstrap/panel, bundle
  output name, package contributions, parser data, Flow/source/report
  behavior, and public contracts are outside this slice.
- Dependencies: Slice 4's completion commit and the completed Slice 3
  Explorer/calendar integration, plus the existing MUI theme and Explorer
  host/view-state modules. Slice 5 is independent of the deferred roadmap and
  feature-folder closure proposal. Implementation requires independent plan
  review and the replan plan commit; the user's automatic no-findings
  approval applies only after a clean implementation review, with the final
  human approval still batched after all five slices.
- Risks: moving theme ownership can change direct View test behavior or inject
  duplicate global styles; splitting callbacks can lose the originating
  button element used for focus restoration; tree ref/selection state can
  drift across filter and virtualized updates; sticky/nested scrolling can
  regress reflow or high contrast; and compatibility facades can create
  cycles. Validate loading/loaded themes, stale/closed sessions, action
  failures, hidden selection, first/last virtualized focus, all locales, and
  DOM bounds before completion approval.
- Out of Scope: Explorer hierarchy or leaf/detail meaning, Flow graph/source
  navigation/report behavior, application/domain DTOs, public messages/action
  envelopes, calendar session/sidecar/transport, host registry/bootstrap,
  workflow/input/period logic, new controls, new actions, schedule semantics,
  parser/MyContexts integration, package manifest/activation/contribution
  changes, bundle output changes,
  persistence, telemetry, and README/CHANGELOG changes.

### Slice 5 Implementation Evidence

- Status: Complete on 2026-09-15; independent `implementation-reviewer`
  review is `Ready` with no Findings, automatic no-findings Completion Approval
  is recorded, and focused completion commit `f47edeb0` is complete. No Slice 5
  behavior or contract changes were introduced.
- Changed paths: the new editor `semanticDiffExplorer.tsx` bundle entry and
  `editor/semanticDiffExplorer/` App, Contents, Header, SummaryCards, and
  ExplorerTreePanel modules; the existing semantic-diff App, View, and entry
  compatibility facades; `webpack.config.js`; and the focused
  `semanticDiffExplorerComponents.test.tsx`.
- Implementation result: the editor package now owns the Explorer App,
  loading/failure/theme shell, 100vh Stack composition, sticky AppBar/Toolbar
  controls, summary cards, and the existing tree/row/keyboard/virtualization
  surface. Host-state/message, view-state, keyboard/focus, tree-data,
  row/detail, localization, theme-mode, action, and session modules remain
  behavior owners. The legacy webview facade and entry still resolve the same
  App/View/filter exports, while webpack preserves the `semanticDiffExplorer`
  output name and host HTML URL.
- Acceptance evidence: the new component test covers the legacy/editor App
  identity, ready/loading composition, MUI landmarks, sticky header, status
  and live regions, callback element forwarding for output/calendar actions,
  summary/tree boundaries, and stable row IDs. Existing Explorer and calendar
  UI suites remain green after extraction, including DOM/axe, localization,
  theme, focus, keyboard, virtualization-bound, and calendar regressions.
- Validation completed after the Slice 5 diff: `rtk pnpm run test:compile`;
  direct component, Explorer DOM/theme/projection/messages/Flow/MUI-theme,
  and calendar component/accessibility/localization/projection/view Mocha
  suites (`62 passing`); production and desktop/web development builds;
  extension-host coverage; full qlty check (`No issues`); Markdown lint; and
  diff check all pass.
- Compatibility/readiness: no application/domain/DTO, public message/action,
  host session/transport, calendar sidecar, workflow, package contribution,
  resource, CSP, telemetry, Flow/source/report behavior, or VS Code engine
  change was made. The new shared webview path uses browser-safe imports only.
- Unresolved risks: no known implementation or scope risk remains. Existing
  bundle-size, desktop codesign, web stream-cleanup, and advisory smell
  findings remain documented observations.
- Implementation review: independent `implementation-reviewer` returned
  `Ready` with no Findings. Main recorded automatic no-findings Completion
  Approval under the user's instruction, and focused completion commit
  `f47edeb0` is complete. Feature Exit and the final human Closure Approval
  were the next-stage gates at Slice 5 completion; the later placement request
  now defers them until Slice 6 completes.

### Slice 6: Co-locate Calendar Host And Explorer Browser Packages

- Status: Planned in Replanning Mode after Slice 5 completion commit
  `f47edeb0`; pending independent plan review, the replan plan gate,
  implementation review, Completion Approval, and a focused completion commit.
  Feature Exit and the deferred roadmap/feature-folder closure proposal remain
  postponed until this slice completes.
- Trigger: the user explicitly asked whether the remaining
  `presentation/vscode/webview/scheduleImpactCalendar*` files and
  `presentation/webview/semantic-diff` modules can follow the Flow and Unit
  List placement. Slice 4/5 already established the browser editor packages;
  this slice finishes the feature-owned placement and removes duplicate
  compatibility paths.
- Scope: keep shared host-wide viewer infrastructure in
  `src/presentation/vscode/webview/` and move only calendar-specific host
  implementation into a `scheduleImpactCalendar/` subpackage. Move the
  browser calendar bridge into its existing
  `editor/scheduleImpactCalendar/` package. Move the remaining Explorer
  browser helpers and canonical View into `editor/semanticDiffExplorer/`,
  update all internal imports and tests to those canonical paths, and remove
  the obsolete `webview/semantic-diff` browser folder. Preserve exported symbol
  names and both bundle filenames.
- User / Domain Value: calendar and Explorer source ownership is discoverable
  from the same editor-package shape used by Flow and Unit List, while the
  private calendar host/session adapter is grouped without coupling it to the
  document-URI `ViewerFactory` lifecycle.
- Cohesive Change Group: feature-owned host/browser file relocation, canonical
  import cleanup, and package-location architecture coverage. No schedule
  meaning, DTO, message, action, session, transport behavior, or UI behavior
  changes.
- Planned paths and approval scope:
  - Move the five calendar host files into
    `src/presentation/vscode/webview/scheduleImpactCalendar/`:
    `scheduleImpactCalendarJson.ts`, `scheduleImpactCalendarPanel.ts`,
    `scheduleImpactCalendarPanelRuntime.ts`,
    `scheduleImpactCalendarSessionRegistry.ts`, and
    `scheduleImpactCalendarTransport.ts`. Update their sibling imports and the
    existing consumers in
    `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts`,
    `semanticDiffExplorerPanelActions.ts`,
    `semanticDiffExplorerPanelTypes.ts`, and
    `src/bootstrap/extension/semanticDiffWiring.ts`.
  - Move `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts`
    into `src/presentation/webview/editor/scheduleImpactCalendar/` and update
    `ScheduleImpactCalendarApp.tsx`, its bridge test, and `webSmoke.ts` to use
    the package-local bridge. The bridge continues consuming the same
    browser-safe transport contract from the host subpackage.
  - Move these ten canonical browser modules from
    `src/presentation/webview/semantic-diff/` into
    `src/presentation/webview/editor/semanticDiffExplorer/`, preserving their
    existing symbol names and behavior: `semanticDiffExplorerFocus.ts`,
    `semanticDiffExplorerHostMessageState.ts`,
    `semanticDiffExplorerHostState.ts`, `semanticDiffExplorerKeyboard.ts`,
    `semanticDiffExplorerLocalization.ts`,
    `semanticDiffExplorerThemeMode.ts`, `semanticDiffExplorerTree.tsx`,
    `semanticDiffExplorerTreeData.ts`, `semanticDiffExplorerView.tsx`, and
    `semanticDiffExplorerViewState.ts`. Update the App, Contents, Header,
    ExplorerTreePanel, and all browser/test imports to the canonical package.
    In `src/test/suite/semanticDiffExplorerComponents.test.tsx`, replace the
    old-facade identity assertion with the canonical editor-package App identity
    assertion while preserving its composition, MUI, status, and callback
    forwarding coverage.
  - Remove the two obsolete old-path facades/entry files after all consumers
    are updated: `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`
    and `src/presentation/webview/semantic-diff/semanticDiffExplorerEntry.tsx`.
    The existing `src/presentation/webview/editor/semanticDiffExplorer.tsx`
    remains the sole thin bundle entry; `webpack.config.js` already points to
    it and its `semanticDiffExplorer` output name remains unchanged.
  - Update `src/test/suite/architectureDependencyRules.test.ts` with a focused
    package-layout assertion: the five host files exist only under the calendar
    host subpackage, the browser modules exist only under the editor Explorer
    package, the obsolete browser folder/facades and stale imports are absent,
    and the canonical editor entries remain the webpack targets. This is a
    location/architecture guard rather than a snapshot of implementation
    details.
  - Canonical-import regression scope includes
    `src/test/suite/scheduleImpactCalendarBridge.test.ts`,
    `scheduleImpactCalendarSession.test.ts`,
    `scheduleImpactCalendarTransport.test.ts`,
    `semanticDiffExplorerDom.test.tsx`,
    `semanticDiffExplorerComponents.test.tsx`,
    `semanticDiffExplorerThemeMode.test.ts`,
    `semanticDiffExplorerProjection.test.ts`,
    `semanticDiffExplorerMessages.test.ts`,
    `semanticDiffExplorerFlow.test.ts`,
    `semanticDiffExplorerSourceAction.test.ts`,
    `semanticDiffExplorerReportAction.test.ts`,
    `semanticDiffExplorerScheduleImpact.test.ts`,
    `semanticDiffExplorerPanel.test.ts`,
    `semanticDiffExplorerRegistry.test.ts`, `muiTheme.test.ts`, and
    `webSmoke.ts`. Existing calendar component/accessibility/localization/
    projection/view suites remain regression coverage.
- Acceptance: the browser tree has one thin editor entry per viewer and all
  Explorer rendering, state, keyboard, focus, localization, and tree helpers
  resolve from `editor/semanticDiffExplorer/`; the calendar bridge and
  presentation helpers resolve from `editor/scheduleImpactCalendar/`; and
  calendar host/session/JSON/transport files resolve from their one host
  subpackage. No stale import points at the removed browser folder. The host
  continues to render the same nonce-bound calendar CSP with
  `asWebviewUri(.../out/scheduleImpactCalendar.js)`, Explorer HTML continues
  to load `./out/semanticDiffExplorer.js`, and webpack entry/output names remain
  unchanged. Public exports, action IDs, message envelopes, DTOs, lifecycle,
  desktop/web behavior, and all user-visible facts remain unchanged.
- Validation: run the package-layout/architecture test and all listed host,
  browser, calendar, and `webSmoke` regressions; `rtk pnpm run test:compile`;
  production `rtk pnpm run build`; desktop and web development builds;
  desktop and web extension-host coverage; webpack entry/output and CSP
  assertions; browser-safe import checks; `rtk pnpm run qlty`; `rtk pnpm run
lint:md`; and `git diff --check`.
- Production Readiness: keep shared ViewerFactory, mount, mediator, store,
  constants, and message-routing modules unchanged; preserve the existing
  `presentation/vscode/semantic-diff/{panel,flow,report,source}` host package
  ownership; keep moved browser helpers free of VS Code/Node imports; preserve
  `asWebviewUri`, nonce, bundle names, action element focus recovery, and
  desktop/web compilation; and record no README/CHANGELOG change because this
  is an internal package relocation.
- Approval Boundary: only the five moved calendar host files, the moved
  calendar bridge, the ten moved canonical Explorer browser modules, the two
  removed old browser facades/entry files, the listed internal consumer import
  updates, the focused architecture/location test, and the listed regression
  import updates. Shared viewer infrastructure, semantic-diff host panel/
  flow/report/source adapters, bootstrap behavior beyond import paths,
  `webpack.config.js` semantics, bundle output names, package contributions,
  application/domain contracts, schedule calculation, lifecycle behavior,
  resources, telemetry, and user documentation are outside this slice.
- Dependencies: Slice 5 completion commit `f47edeb0` and its approved editor
  Explorer package; the existing calendar MUI package and host/session
  contract; and the completed workflow/public integration. Implementation may
  start only after independent plan review and the replan plan commit. The
  user's automatic no-findings approval applies after a clean independent
  implementation review; final human approval remains batched after all six
  slices.
- Risks: relative imports can accidentally cross host/browser ownership;
  deleting facades can miss a test or hidden bundle consumer; moving the
  bridge/transport can make a browser bundle pull an unintended host module;
  path-sensitive architecture checks can become stale; and package relocation
  can conceal a CSP or output-name regression. The layout test, full compile,
  desktop/web builds, extension-host checks, and unchanged lifecycle/action
  matrices must catch these failures.
- Out of Scope: shared ViewerFactory/WebviewMediator/WebviewStore/mounting or
  message routing, semantic-diff host panel/flow/report/source relocation,
  application/domain/parser changes, DTO/message/action/session/transport
  behavior, workflow or bootstrap semantics, webpack output/activation/
  contribution changes, schedule meaning, UI redesign, persistence,
  telemetry, and README/CHANGELOG changes.

### Slice 6 Implementation Evidence

- Status: Implemented on 2026-09-15; pending independent
  `implementation-reviewer` review, automatic no-findings Completion Approval,
  and the focused completion commit. No Slice6 behavior or contract changes
  were introduced.
- Changed paths: the five calendar host files now under
  `src/presentation/vscode/webview/scheduleImpactCalendar/`; the browser
  bridge now under
  `src/presentation/webview/editor/scheduleImpactCalendar/`; the ten
  Explorer browser helpers/tree/View modules now under
  `src/presentation/webview/editor/semanticDiffExplorer/`; removal of the two
  obsolete `webview/semantic-diff` browser facades/entry; canonical import
  updates in listed host/browser/test consumers; the focused architecture
  location assertion; and Slice6 evidence in this feature record.
- Implementation result: feature-owned host/session/JSON/transport ownership
  is co-located without changing exported symbols or lifecycle. Calendar UI
  consumes the package-local bridge, Explorer App/Contents/components and
  compatibility View consume package-local helpers, and the editor entry is
  the sole Explorer bundle entry. Shared ViewerFactory, mediator/store,
  semantic-diff host category packages, workflow, bootstrap semantics, CSP,
  bundle names, DTOs, messages, actions, and user-visible facts remain
  unchanged.
- Acceptance evidence: the architecture/location test verifies one Calendar
  host package, one Explorer browser package, absence of stale flat imports and
  the removed browser folder, canonical webpack entries, and no VS Code/Node
  imports in moved browser modules. The focused Explorer component test now
  asserts the canonical editor App identity while retaining MUI composition,
  status/live-region, sticky-header, action-element, and stable-ID coverage.
- Validation completed after the Slice6 diff: `rtk pnpm run test:compile`;
  direct canonical Explorer/calendar/host/browser regression Mocha matrix
  (`74 passing`); architecture/location suite; production
  `rtk pnpm run build`; `rtk pnpm run development:desktop`; `rtk pnpm run
development:web`; desktop host run (exit 0); permitted web host run (exit 0,
  WEB-7 through WEB-10 passed); full `rtk pnpm run qlty:check` (No issues);
  Markdown lint (0 errors); and `rtk git diff --check`.
- Compatibility/readiness: public exports, action IDs, message envelopes,
  DTOs, session/transport behavior, nonce-bound CSP, `asWebviewUri` bundle
  URLs, output filenames, desktop/web support, and VS Code compatibility are
  preserved. Moved browser modules remain browser-safe and no
  README/CHANGELOG update is required for this internal relocation.
- Unresolved risks: no known implementation or scope risk remains. Independent
  review should verify canonical ownership, deleted facades, relative import
  boundaries, and unchanged CSP/output behavior.
- Review route: return this Slice6 diff and evidence to Main for independent
  `implementation-reviewer` review, then the normal automatic no-findings
  Completion Approval and focused completion commit.

## Cross-Slice Approval And Production Readiness

- Implement, independently review, Completion-approve, and commit exactly one
  slice before starting the next. No slice is implementation-authorized by
  this replan alone.
- The dependency chain is strict: schedule/structured-output predecessor
  contracts → Slice 1 pure comparison artifacts/sidecar → Slice 2 command and
  bootstrap integration plus internal calendar foundation → completed workflow
  commit `8e6922f8` with its evaluated-period artifact handoff → Slice 3 public
  action and visible timeline → Slice 4 calendar MUI composition → Slice 5
  Explorer MUI composition → Slice 6 host/browser package relocation. Slice 2
  must not expose a user-reachable action; Slice 3 remains the first public
  surface and Slices 4–6 preserve it.
- Every slice preserves the existing Explorer public message union,
  immutable `SemanticDiffOutputContext` shape `{ result, summary }`, stable
  `scheduleComparison.runChanges` ID/order semantics, JSON version 1, report
  modes, Flow/source/viewer messages, VS Code `^1.75.0`, zero-exception
  architecture rules, JP1/AJS3 v13 limits, privacy, and desktop/web behavior.
- The internal application contract
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` performs
  identity comparison and schedule evaluation once each and returns
  `{ result, scheduleProjectionFacts }`. `ScheduleProjectionFacts` is
  `not-requested` without a period, `invalid` with `{ period, issues }`, or
  `evaluated` with `{ period, before: { rootProjections, statuses, issues },
after: { rootProjections, statuses, issues }, correspondence }`. Existing
  `compareSemanticDiff(input)` remains the public `.result` wrapper. Slice 1's
  pure `buildSemanticDiffPresentationArtifactsFromComparison({ result,
  scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and creates `{ context, scheduleImpact }` without
  re-evaluation. In Slice 2, the existing
  `BuildSemanticDiffReportDataInput` remains unchanged and
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
  builder)` accepts the additive
  `BuildSemanticDiffPresentationArtifactsInput =
  BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
  "scheduleComparisonPeriod"> }`; it parses each source exactly once,
  forwards a selected period under the exact
  `options.scheduleComparisonPeriod` field, omits `options`/the field when no
  period is supplied, and is invoked by the
  compare-success block exactly once; the bootstrap-owned
  `createScheduleAwareExplorerSession` companion consumes both impact states
  and invokes `OpenSemanticDiffExplorer(context)` exactly once, returning
  `SemanticDiffExplorerSessionHandle` → parent composite `onDidDispose`
  release. Only available impact owns register/action; unavailable impact skips
  both while still returning the normal parent handle. Creation failure/cancel
  rolls back available registration and disposes normal/partial resources;
  child close never releases the sidecar; parent disposal does.
- Root correspondence remains the closed matrix: both-root pair,
  root-to-non-root `removed-root-scope`/`added-root-scope` one-sided metadata,
  non-root exclusion, rename/move pair, and separate ambiguous candidates.
  Scope-transition metadata never creates cross-side run pairing, and Slice 3
  filters/legend distinguish it from run-state effects. Slices 4–6 only
  reorganize presentation components/packages and do not alter this matrix.
- No calendar sidecar, transport, or UI path may import parser internals,
  infrastructure, Node built-ins, VS Code, or UI frameworks across the
  documented architecture boundaries. Concrete host construction remains in
  bootstrap/presentation adapters; webview consumes plain DTOs.
- All invalid references, malformed messages, stale IDs/epochs, oversized
  encoded messages, and unsupported/uncalculated facts fail closed without
  partial mutation. No locale, host clock, timezone, or browser locale may
  change facts or ordering.
- Replanning is required for any predecessor contract/JSON/report/Explorer
  message change, new schedule or risk meaning, new comparison input,
  candidate policy, root correspondence or scope-transition meaning,
  application wrapper output, sidecar registry ownership/API, action/command/
  contribution, persistence, external data, Flow/source redesign, visual
  calendar grid, or compatibility-floor increase. A change from the Slice 4–6
  presentation/package-only boundaries into Explorer hierarchy, action,
  message, or model behavior also requires Replanning and may require a new
  feature-author decision.

## Traceability

- `TRACEABILITY.md` is required and maps CAL requirements to the six slices,
  concrete approval paths, tests, and durable documentation.
- The sidecar identity, composite source-change resolution, root matrix,
  internal artifact contract, and pure application builder are Slice 1-owned;
  command caller/injection, bootstrap registry, same-context Explorer
  resolution, companion atomic lifecycle, transport, and lifecycle are Slice
  2-owned; public action, completed-workflow artifact gate, presentation,
  filters/legend, localization, and durable use-case documentation are Slice
  3-owned; calendar MUI component organization is Slice 4-owned; Explorer MUI
  component organization is Slice 5-owned; and feature-owned host/browser
  package relocation is Slice 6-owned. No requirement is left to an
  unassigned slice.

## Feature Exit

- Definition of Done status: Deferred while Slice 6 is planned. Slices 1–5
  are complete, independently reviewed `Ready` with no Findings,
  automatically Completion-approved under the user's instruction, and
  focused-commit complete: Slice 1 `51a8ae4a`, Slice 2 `b9cee633`, Slice 3
  `ffb92f1e`, format correction `09148de4`, Slice 4 `d4344a26`, and Slice 5
  `f47edeb0`. Slice 6 must complete its independent review, automatic
  no-findings Completion Approval, and focused commit before Feature Exit
  resumes for final batch human Closure Approval.
- Durable documentation: `uc-present-schedule-impact.md`, its index entry,
  README, and CHANGELOG updates are complete. Architecture and glossary
  propagation are not required. The closure package removes the completed
  Wave 4 calendar item from `docs/specs/roadmap.md`.
- Production readiness: desktop and web checks, compatibility guards,
  accessibility, bounded rendering, lifecycle cleanup, privacy, and public
  contract preservation are evidenced above. Existing macOS codesign,
  web-stream cleanup, webpack-size, and advisory smell findings remain
  documented observations.
- Remaining risks: Slice 6 package ownership, canonical-import, facade removal,
  and CSP/output-path checks remain open. Existing macOS codesign, web
  stream-cleanup, webpack-size, and advisory smell findings remain documented
  compatibility observations. Closure Approval is deferred until Slice 6 is
  complete.
- Proposed closure scope remains deferred: update `docs/specs/roadmap.md` as
  above, then remove only `docs/specs/features/schedule-impact-calendar/`;
  inherited feature folders remain preserved.

## Validation

- [x] The original plan and first Replanning package received independent
      `plan-reviewer` `Ready` verdicts with no Findings (historical evidence).
- [x] The latest second-Replanning package receives an independent
      `plan-reviewer` `Ready` verdict with no Findings.
- [x] Human Approval is recorded for the original Slice 1, first and second
      Replanning, and third targeted Replanning delta paths; the focused third
      plan/replan commit `11615026` is complete.
- [x] Slice 1 proves exact root/candidate selection, the full root/non-root
      correspondence matrix, `scopeTransition` metadata and no-cross-side
      pairing, one identity comparison and one schedule evaluation in
      `compareSemanticDiffWithArtifacts`, public `.result` compatibility, the
      `ScheduleProjectionFacts` not-requested/invalid/evaluated union, pure
      `buildSemanticDiffPresentationArtifactsFromComparison` artifact identity,
      exactly one `buildSemanticDiffOutputContext(result)` call, unchanged
      `{ result, summary }` context, complete outcome/issues,
      length-prefixed IDs, occurrence pairing, composite source-change
      resolution, issue target-key collision safety, allowed added/removed and
      changed-time same-effect shared references, cross-effect rejection, strict
      validation, and deterministic ordering. Slice 1 has no command caller or
      bootstrap wiring.
- [x] Third targeted Replanning delta received independent `plan-reviewer`
      `Ready` review with no Findings and Main's Human Approval for the exact
      differ, sidecar, focused-rule, focused-impact, end-to-end
      comparison-artifact, calendar, and normative-SPECS paths; its focused
      plan/replan commit is `11615026`.
- [x] Third delta proves the real `semanticDiffScheduleDiffer` preserves
      duplicate records, pairs duplicate/count-mismatch occurrences into real
      changed-time rows plus unmatched extras, groups by source identity/date/
      rule, and emits approved deterministic detail/timeline/rule order; the
      sidecar isolates nested source units and the end-to-end comparison path
      resolves every reference against its actual upstream `runChanges`.
- [x] Independent `implementation-reviewer` review of the exact completed
      Slice 1 paths returned `Ready` with no Findings, including public
      run-change ordering compatibility, source-aware pairing, exact
      references, report/JSON and Explorer regressions, and desktop/web
      validation evidence.
- [x] Main recorded automatic Completion Approval for Slice 1 on 2026-09-10
      in the current conversation under the user's no-findings instruction;
      the exact completion paths and evidence are recorded above, and focused
      completion commit `51a8ae4a` is complete.
- [x] Slice 2 proves the additive
      `BuildSemanticDiffPresentationArtifactsInput` shape, omitted
      `options`/period-field behavior, and selected-period forwarding under
      `CompareSemanticDiffInput.options.scheduleComparisonPeriod`; it proves
      the parser/comparison/pure-builder command adapter and its injected
      command call are each exactly once, returning the existing
      parser-error union on failure/cancel; not-requested/invalid produce
      unavailable impact with no registry/action while invalid result output is
      preserved; evaluated produces available impact; the companion invokes
      `OpenSemanticDiffExplorer(context)` exactly once and returns the normal
      parent handle for both states; only available uses atomic register →
      Explorer creation → panel `onDidDispose` parent composite release,
      unavailable skips registry/action; rollback on creation failure/cancel;
      bootstrap
      registry register/resolve/release by exact context identity; parent-only
      sidecar release; child close handle/epoch disposal with retained
      sidecar/context; parent-alive reopen; late-work suppression; separate
      parent/child IDs and closed calendar transport; registry/epoch ownership;
      per-message 8 MiB enforcement; immutable language inheritance; and
      reopen/new identity while keeping the action unavailable.
- [x] Slice 2 received independent `implementation-reviewer` `Ready` review
      with no Findings, and Main recorded automatic Completion Approval on
      2026-09-10 under the user's no-findings instruction. The exact completed
      paths and evidence are recorded above; its focused completion commit is
      complete at `b9cee633`.
- [x] Risk-based validation for the current Slice 2 implementation completed:
      focused transport/session/sidecar/adapter Mocha tests (11 passing), Slice
      1 regression Mocha tests (67 passing), TypeScript and test compile,
      desktop/web builds, desktop and web extension-host tests, quality checks,
      markdown lint, and `git diff --check`. Desktop exited 0 with the known
      macOS codesign warning; web exited 0 with known EPIPE/Premature-close
      stream-cleanup warnings; quality smells remained advisory only.
- [x] Slice 3 proves separate root-outcome/run-state filters, scope-transition
      filters/legend, partial/timeline/issue sections, candidate groups,
      English/Japanese/fallback resources, consumption of the completed
      workflow's evaluated-period artifact, no-period ordinary-Explorer/
      unavailable behavior, invalid-input failure before comparison/open,
      direct adapter invalid-period fixtures, compatible `sde-action-*`
      registration/validation, private-before-normal dispatch, exact-context
      sidecar resolution, accessible keyboard/desktop/web behavior, bounded
      rendering, and durable use-case/index/docs lint. The completed workflow
      guards cover source/period selection, exact forwarding, cancellation,
      and one artifact/Explorer handoff; this slice does not modify them.
- [x] Slice 3 received independent `implementation-reviewer` `Ready` review
      with no Findings. Main recorded automatic Completion Approval under the
      user's no-findings instruction; focused implementation commit `ffb92f1e`
      and format correction commit `09148de4` are complete.
- [x] The combined Slice 4/5 replan received independent `plan-reviewer`
      `Ready` review with no Findings and was approved in focused commit
      `271c6027`.
- [x] Slice 4 received independent `implementation-reviewer` `Ready` review
      with no Findings. Main recorded automatic Completion Approval under the
      user's no-findings instruction; focused implementation commit `d4344a26`
      is complete. Its component, accessibility, localization, projection,
      compile, build, host, quality, Markdown lint, and diff checks pass.
- [x] Slice 5 received independent `implementation-reviewer` `Ready` review
      with no Findings. Main recorded automatic Completion Approval under the
      user's no-findings instruction; focused implementation commit `f47edeb0`
      is complete. Its direct 62-test UI/calendar matrix, compile, build, host,
      quality, Markdown lint, and diff checks pass.
- [ ] Slice 6 package-relocation replan is pending independent `plan-reviewer`
      review and the replan plan gate. Its host/browser path moves, canonical
      import updates, obsolete facade removal, location guard, CSP/output-name
      checks, and full validation are planned above; no implementation or
      approval evidence is asserted yet.
- [x] Existing Semantic Diff result/context, JSON/report, Explorer, Flow,
      source, copy, schedule, and normal viewer regressions remain passing.
- [x] Risk-based validation for the current Slice 1 implementation completed:
      compile, focused 67-test Mocha run, JSON/contract/schedule/Explorer pure
      regression Mocha run (54 passing), report and host-bound Explorer
      coverage in the desktop extension-host run, desktop/web builds, and
      desktop/web extension-host tests. Desktop exited 0 with the existing
      macOS codesign warning; web exited 0 with existing EPIPE/Premature-close
      stream-cleanup warnings. `qlty:check` passed with no issues;
      `qlty:smells` completed with advisory complexity/duplication findings
      only; markdown lint passed with 0 errors; and `git diff --check` passed.
- [x] The authorized feature-author prepared and validated the `SPECS.md`
      source-unit-identity/date/rule normative pairing rule with preserved
      root/side semantics and deterministic duplicate handling.
- [x] Replanning trigger verified against current `main` commit `8e6922f8`:
      comparison workflow completion, source/period selection, evaluated
      artifact production, and schedule-aware Explorer handoff are present;
      the old dependency-run-only Slice 3 gate is removed from the active plan.
- [x] Independent `plan-reviewer` review of this targeted Slice 3 dependency
      reconciliation returned `Ready` with no Findings before implementation.

## Notes

- Keep durable behavior and boundary decisions in `SPECS.md`; this replan is
  limited to implementation slices, approval boundaries, validation, and
  traceability in `TASKS.md` and `TRACEABILITY.md`.
- The sidecar's `sourceChangeRef` is a composite foreign reference to the
  predecessor's stable `scheduleComparison.runChanges` array; resolve by
  `(id, occurrenceOrdinal)` and never use a sidecar ID as a replacement or
  modify the predecessor schema to accommodate it. Shared references are
  valid only within one sidecar effect ID: one side run plus its added/removed
  timeline item, or before/after runs plus their changed-time timeline item;
  cross-effect reuse is rejected by the fixtures.
- Keep `SemanticDiffOutputContext` exactly immutable `{ result, summary }`.
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` owns one
  identity comparison and one schedule evaluation and returns
  `{ result, scheduleProjectionFacts }`; the facts union explicitly represents
  not-requested, invalid, and evaluated states. The pure
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  once. Slice 2's `createBuildSemanticDiffPresentationArtifacts` adapter
  accepts the additive `BuildSemanticDiffPresentationArtifactsInput` type,
  omits `options`/the field when absent, forwards a selected period under the
  exact `options.scheduleComparisonPeriod` field, parses each source once,
  and the command calls it once, then
  `createScheduleAwareExplorerSession` owns registration,
  `OpenSemanticDiffExplorer(context)` and its concrete session handle, panel
  disposal subscription, and parent `onDidDispose` release. Failure/cancel
  must roll back atomically; child close retains the sidecar/context; reopen
  and late-work tests must prove reuse without recalculation.
- The public action is exposed only for a successful evaluated-period artifact
  from the completed workflow commit `8e6922f8`. A no-period selection opens
  the ordinary Explorer with unavailable/not-requested impact and no calendar
  action or panel; invalid workflow input fails before comparison, artifact,
  or Explorer opening. Direct adapter invalid-period fixtures separately prove
  unavailable impact. The Wave 4 roadmap entry and the internal Calendar
  Slices 1–2 → completed workflow → public Slice 3 → MUI Slice 4 → Explorer
  package Slice 5 → host/browser package relocation Slice 6 dependency chain
  are synchronized. Feature Exit remains deferred until Slice 6 completes.
