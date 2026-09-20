# Feature Tasks: Schedule Impact Calendar Qlty Cleanup

## Agent Brief

- Purpose: remove PR #318's 36 qlty blocking issues while preserving the
  completed Schedule Impact Calendar and related viewer behavior.
- Approved or active slice: none. The complete one-slice plan is ready for
  independent review; implementation remains unapproved.
- Do not: suppress findings or modify qlty, markdownlint, compiler, test, or
  build configuration.
- Do not: change product behavior, schedule semantics, DTO/transport
  contracts, localization meaning, accessibility contracts, or public APIs.
- Read first: `SPECS.md`, this file, PR #318's live qlty issue list, and the
  affected source files listed under Slice 1.
- Read `TRACEABILITY.md` when checking requirement or validation coverage.
- Approval policy: see `docs/specs/README.md`.
- Next decision: independent plan review by `plan-reviewer`.

## Sync Rule

- Update this file in the same commit whenever the slice is completed,
  re-scoped, or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Other
  feature folders inherited from the base branch remain outside its scope.
- Update `docs/specs/roadmap.md` only if unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation scope, approval, validation, risk,
  production readiness, and Feature Exit readiness.

## Plan Status

- Status: Approved; pending plan-gate commit
- Planning scope: all 36 blocking findings reported on PR #318: 23
  high-complexity findings, five duplication findings, three excessive-return
  findings, two Markdown line-length findings, and one finding each for
  excessive parameters, high total complexity, and a complex binary
  expression.
- Review status: Ready on 2026-09-20; Findings: none
- Human approval: Approved on 2026-09-20 under the user's established
  automatic per-slice approval instruction after a review with no Findings.
- Active implementation slice: Slice 1, pending plan-gate commit

## Planning Evidence

- PR evidence: the qlty comment on PR #318 reports 36 blocking issues and the
  `qlty check` status is failing while the repository Verify and CodeQL checks
  pass.
- Local reproduction: `rtk pnpm run qlty` conservatively listed 43 structural
  and duplication smells against `origin/main`. The hosted PR summary blocks
  on 34 of those locations; its two additional Markdown findings were
  reproduced with
  `rtk pnpm exec markdownlint-cli2 CHANGELOG.md` at lines 5 and 12.
- Live source reconciliation: all 43 locally listed qlty smells map to the
  exact files and functions recorded in Slice 1, covering the hosted 34-smell
  subset. No live finding requires domain,
  application, infrastructure, DTO, transport, configuration, or generated
  artifact changes.
- Slice decision: one slice is the smallest independently valuable boundary.
  Partial groups would leave the PR gate failing, while several findings need
  coordinated internal extraction within Calendar and shared viewer code.
- Durable documentation decision: no roadmap, architecture, README, or use
  case update is warranted because observable behavior and repository policy
  remain unchanged. `CHANGELOG.md` receives line wrapping only.
- Independent plan review: `plan-reviewer` returned `Ready` on 2026-09-20
  with no Findings for the complete one-slice plan, approval boundary,
  validation, traceability, and production-readiness coverage.

## Human Approval

- Status: Approved
- Approved at: approved in the current conversation on 2026-09-20 under the
  user's established automatic per-slice approval instruction after
  `plan-reviewer` returned `Ready` with no Findings
- Approved scope: Slice 1 only: remove PR #318's 36 hosted blockers and all 43
  locally listed qlty smell locations through behavior-neutral internal
  refactoring and changelog line wrapping, with the acceptance, validation,
  production-readiness, and stop boundaries recorded below.
- Approved paths:
  - Planning package:
    `docs/specs/features/schedule-impact-calendar-qlty-cleanup/SPECS.md`,
    `TASKS.md`, and `TRACEABILITY.md`.
  - `CHANGELOG.md` for wrap-only edits to the two reported lines.
  - Calendar host:
    `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanel.ts`
    and `scheduleImpactCalendarPanelRuntime.ts`.
  - Explorer host:
    `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelRequests.ts`.
  - Table UI:
    `src/presentation/webview/editor/ajsTable/TableHeader.tsx`.
  - Calendar UI/model:
    `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`,
    `ScheduleImpactCalendarBoundedList.tsx`,
    `ScheduleImpactCalendarSections.tsx`,
    `ScheduleImpactCalendarTimeline.tsx`, and
    `scheduleImpactCalendarModel.ts`.
  - Shared UI:
    `src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx` and
    `UnitTreeSelector.tsx`.
  - Localization: `src/resource/i18n/scheduleImpactCalendar.ts`,
    `scheduleImpactCalendar_en.ts`, and `scheduleImpactCalendar_ja.ts`.
  - Focused tests under `src/test/suite/`:
    `scheduleImpactCalendarPanelRuntime.test.ts`,
    `scheduleImpactCalendarSession.test.ts`,
    `semanticDiffExplorerPanel.test.ts`,
    `semanticDiffExplorerMessages.test.ts`,
    `semanticDiffExplorerScheduleImpact.test.ts`,
    `scheduleImpactCalendarComponents.test.tsx`,
    `scheduleImpactCalendarView.test.tsx`,
    `scheduleImpactCalendarProjection.test.ts`,
    `scheduleImpactCalendarAccessibility.test.tsx`,
    `scheduleImpactCalendarLocalization.test.ts`,
    `scheduleImpactCalendarThemeContext.test.tsx`, `ajsTableHeader.test.ts`,
    `tableShellIntegration.test.ts`, `unitTreeSelector.test.ts`,
    `accessibilityDom.test.tsx`, `showUnitDefinitionInteraction.test.ts`,
    `flowNodeDetail.test.ts`, and `architectureDependencyRules.test.ts`.
  - New internal helper files may be created only beside an approved owner in
    the Calendar host, Explorer panel, Table UI, Calendar UI/model, or shared
    UI directories above; each must be imported only by approved owners and
    must directly replace an enumerated finding. Existing non-enumerated files
    in those directories are excluded.

Implementation may start only after `approval-committer` creates the focused
plan-gate commit for the approved planning package.

## Completion Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Clear the PR #318 qlty gate without behavior changes

- Status: Approved; pending plan-gate commit before implementation.
- Scope:
  - Reconcile the implementation result with the same 36-item live PR report;
    every listed location must either disappear from qlty output through a
    behavior-neutral refactor or be shown to have moved without leaving an
    equivalent blocking finding.
  - Decompose panel opening, runtime shell construction, message dispatch, and
    Explorer request dispatch into named internal responsibilities while
    preserving panel reuse, reveal, disposal, registry cleanup, request
    validation, resource delivery, failure messages, and thrown-error cleanup.
  - Decompose Calendar session/view, bounded list, section, timeline, and model
    control flow while preserving ordering, conjunctive filtering, visible and
    global counts, bounded rendering, overscan, empty states, keyboard focus,
    announcements, accessible names, and localized before/after content.
  - Extract repeated Calendar section presentation and shared localization
    structure only where the live duplication findings require it. English
    and Japanese strings and fallback behavior must remain equivalent at their
    exported contract.
  - Simplify the reported Table header, shared detail pane, and unit-tree
    control flow without changing sort semantics, rendered MUI structure,
    focus/keyboard behavior, responsive collapse, action availability, or
    accessibility state.
  - Wrap the two blocking `CHANGELOG.md` lines without changing their words or
    release-note meaning.
- Live finding inventory:
  - `scheduleImpactCalendarPanel.ts`: high complexity in
    `openScheduleImpactCalendarPanel` and
    `createScheduleImpactCalendarPanel`.
  - `scheduleImpactCalendarPanelRuntime.ts`: excessive parameters in
    `buildCalendarShell`; high complexity in `handleCalendarMessage`.
  - `semanticDiffExplorerPanelRequests.ts`: high complexity in
    `processCommonResourceRequest`, `processCalendarAction`, `processRequest`,
    and `handleSemanticDiffExplorerRequest`.
  - `ajsTable/TableHeader.tsx`: high complexity in
    `getTableHeaderAriaSort`, `renderSortableHeaderContent`, and
    `renderHeaderCell`.
  - `ScheduleImpactCalendarApp.tsx`: high complexity in `useCalendarSession`
    and `ScheduleImpactCalendarInnerApp`.
  - `ScheduleImpactCalendarBoundedList.tsx`: excessive returns and high
    complexity in `ScheduleImpactCalendarBoundedList`; high complexity in
    `handleKeyDown` and `itemWithFocus`.
  - `ScheduleImpactCalendarSections.tsx`: high total complexity; high
    complexity in `RootStatus`, both current `outcomeLabel` functions,
    `ValidNoRuns`, and `Candidates`; three same-file duplication locations.
  - `ScheduleImpactCalendarTimeline.tsx`: excessive returns and high
    complexity in `ScheduleImpactCalendarTimeline`; high complexity in
    `focusItem`, `handleItemKeyDown`, and `renderItem`.
  - `scheduleImpactCalendarModel.ts`: complex binary expression; excessive
    returns and high complexity in `rootOutcome`; high complexity in
    `normalizeScheduleImpactCalendarFilters`.
  - `SharedUnitDetailPane.tsx`: excessive returns and high complexity in
    `SharedUnitDetailPane`; high complexity in `resolveDetailPaneShortcut`,
    `StateChip`, and `handleKeyDown`.
  - `UnitTreeSelector.tsx`: high complexity in `UnitTreeRowFrame` and
    `UnitTreeSelectorUnit`.
  - `scheduleImpactCalendar_en.ts` and `scheduleImpactCalendar_ja.ts`: the
    reported two-file localization duplication.
  - `CHANGELOG.md`: the two line-length findings at current lines 5 and 12.
- Expected production paths:
  - `CHANGELOG.md`
  - `src/presentation/vscode/semantic-diff/calendar/` limited to
    `scheduleImpactCalendarPanel.ts`,
    `scheduleImpactCalendarPanelRuntime.ts`, and narrowly scoped new internal
    helper modules beside those owners if extraction is required.
  - `src/presentation/vscode/semantic-diff/panel/` limited to
    `semanticDiffExplorerPanelRequests.ts` and narrowly scoped new internal
    request helpers if required.
  - `src/presentation/webview/editor/ajsTable/TableHeader.tsx` and narrowly
    scoped internal Table header helpers if required.
  - `src/presentation/webview/editor/scheduleImpactCalendar/` limited to the
    five reported files: `ScheduleImpactCalendarApp.tsx`,
    `ScheduleImpactCalendarBoundedList.tsx`,
    `ScheduleImpactCalendarSections.tsx`,
    `ScheduleImpactCalendarTimeline.tsx`, and
    `scheduleImpactCalendarModel.ts`, plus narrowly scoped internal
    component/helper modules needed to reduce total file complexity.
  - `src/presentation/webview/editor/shared/SharedUnitDetailPane.tsx` and
    `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`, plus
    narrowly scoped internal helpers beside those owners if required.
  - `src/resource/i18n/scheduleImpactCalendar.ts`,
    `scheduleImpactCalendar_en.ts`, and `scheduleImpactCalendar_ja.ts` only as
    needed to centralize shared localization shape while preserving exports
    and values.
- Expected test paths: update existing assertions only when an internal
  extraction requires it, and add focused regression cases only for a real
  uncovered branch. The approved test surface is limited to:
  - Calendar host and request behavior:
    `scheduleImpactCalendarPanelRuntime.test.ts`,
    `scheduleImpactCalendarSession.test.ts`,
    `semanticDiffExplorerPanel.test.ts`,
    `semanticDiffExplorerMessages.test.ts`, and
    `semanticDiffExplorerScheduleImpact.test.ts`.
  - Calendar UI/model/a11y/localization:
    `scheduleImpactCalendarComponents.test.tsx`,
    `scheduleImpactCalendarView.test.tsx`,
    `scheduleImpactCalendarProjection.test.ts`,
    `scheduleImpactCalendarAccessibility.test.tsx`,
    `scheduleImpactCalendarLocalization.test.ts`, and
    `scheduleImpactCalendarThemeContext.test.tsx`.
  - Shared UI and Table behavior: `ajsTableHeader.test.ts`,
    `tableShellIntegration.test.ts`, `unitTreeSelector.test.ts`,
    `accessibilityDom.test.tsx`, `showUnitDefinitionInteraction.test.ts`, and
    `flowNodeDetail.test.ts`.
  - Architecture: `architectureDependencyRules.test.ts` only if new internal
    files require an existing architecture assertion to recognize their
    canonical placement; no rule exception or allowlist is permitted.
- User / Domain Value: PR #318 becomes mergeable under the existing quality
  policy without changing the delivered Calendar, Explorer, Flow, Table, or
  unit-detail experience or any JP1/AJS interpretation.
- Cohesive Change Group: all edits remove the single reported PR quality
  blocker set. Host, view, shared control, localization, and Markdown changes
  are reviewed together because qlty evaluates their aggregate PR diff and
  because the Calendar extractions must retain one end-to-end behavior
  contract.
- Acceptance:
  - All 36 originating findings are absent from the final PR-equivalent
    analysis and no new blocking finding is introduced in the changed diff.
  - No suppression, ignore annotation, threshold adjustment, qlty or lint
    configuration edit, architecture exception, generated change, or broad
    formatting churn is present.
  - Panel/session reuse, reveal, disposal, rollback, resource requests,
    invalid-message handling, and error behavior match the existing tests.
  - Calendar facts, periods, order, filters, counts, bounded rendering,
    focus/keyboard behavior, visible text, accessible names, empty states,
    before/after details, localization, and theme behavior are unchanged.
  - Table header sorting and shared unit detail/tree behavior remain unchanged
    in Flow, Table, and Semantic Diff consumers.
  - Public exports, DTOs, transport schemas, commands, telemetry, and
    `engines.vscode` remain unchanged.
  - The two `CHANGELOG.md` entries retain their exact wording after wrapping.
- Validation:
  1. Before editing, retain the hosted 36-blocker baseline, the conservative
     43-smell local baseline, and the two-line Markdown reproduction; after
     editing, compare every original location with the final qlty output and
     diff.
  2. Run `rtk pnpm run test:compile`, then the focused compiled suites for the
     affected Calendar UI/model/accessibility/localization, Table header,
     shared unit tree/detail, panel/runtime, and Explorer request behavior.
     Where a suite requires the VS Code host, cover it in the desktop host run
     rather than weakening or bypassing its environment.
  3. Run `rtk pnpm run qlty`; require zero blocking smells in the PR diff and
     no formatter-produced unintended edits. Also run
     `rtk pnpm exec markdownlint-cli2 CHANGELOG.md` because the repository
     `lint:md` script does not include the changelog.
  4. Run `rtk pnpm run lint:md` for the feature and durable Markdown scopes.
  5. Run `rtk pnpm run build` for the production bundle, plus
     `rtk pnpm run development:desktop` and
     `rtk pnpm run development:web` to exercise the explicit desktop and web
     webpack graphs.
  6. Run `rtk pnpm run test:desktop:run` and
     `rtk pnpm run test:web:run`; confirm the web WEB-7 through WEB-10
     schedule-aware Explorer/bridge/session scenarios still pass.
  7. Run the architecture dependency suite and `rtk git diff --check
origin/main`; review `rtk git diff --stat origin/main` and the exact diff
     to confirm no configuration, generated artifact, public contract,
     localization value, or unrelated file changed.
  8. After publishing the completion commit, require PR #318's remote `qlty
check` to pass; this is the authoritative PR-diff confirmation.
- Production Readiness:
  - Failure modes: preserve cleanup on panel creation, HTML assignment,
    resource posting, disposal, stale session, invalid request, and explicit
    open failure. Refactoring must not catch, swallow, duplicate, or reorder
    existing errors and failure messages.
  - Large input: preserve virtualized/bounded Calendar rendering, overscan,
    stable IDs, exact visible/global counts, and focus restoration. Do not
    replace bounded paths with eager rendering or add repeated full-list work.
  - Malformed input: retain transport validation and current failure behavior;
    render all raw values through React text nodes without markup
    interpretation.
  - JP1/AJS compatibility: no schedule calculation, projection, date/time,
    partial/uncalculated evidence, scope transition, occurrence, or ordering
    logic changes.
  - Desktop/web: preserve browser-safe shared code and VS Code 1.75-compatible
    APIs. Validate both host bundles and host tests because the refactor
    touches panel/request boundaries and webview code.
  - Documentation: README, roadmap, architecture, and the schedule-impact use
    case remain unchanged. The changelog receives line wrapping only.
- Approval Boundary:
  - Human Approval covers only the production, test, and changelog paths
    listed above, including narrowly scoped adjacent internal helper files
    whose sole purpose is to remove an enumerated live finding.
  - Completion Approval covers the final behavior-neutral implementation diff,
    updated Slice 1 evidence, and no other feature or cleanup.
  - Any observable UI/accessibility change, string-value change, DTO/transport
    change, exported API break, schedule-semantic change, qlty/configuration
    change, architecture exception, unrelated finding, or path outside this
    boundary stops implementation and returns to Main for Replanning Mode.
- Dependencies: the feature-intake artifacts and closed Schedule Impact
  Calendar implementation at `744fed91` are present; plan-reviewer `Ready` and
  Human Approval are satisfied. The remaining dependency is an
  approval-committer plan-gate commit before implementation.
- Risks:
  - Helper extraction can change early-return ordering, hook dependencies,
    stale closure behavior, disposal registration, or exception cleanup.
  - Component decomposition can change DOM order, MUI semantics, React keys,
    focus refs, virtualization timing, responsive behavior, or announcements.
  - Localization deduplication can accidentally collapse legitimate English
    and Japanese differences or alter the exported label object shape.
  - A local zero-smell result can differ from the hosted PR comparison base;
    the remote PR qlty rerun is therefore a completion requirement.
- Out of Scope:
  - New Calendar or Semantic Diff behavior, visual redesign, new abstractions
    unrelated to a live finding, schedule semantics, DTO/schema changes,
    command/telemetry changes, dependency upgrades, generated files, qlty or
    lint configuration, suppression, and cleanup of non-blocking legacy
    findings.

## Traceability

- `TRACEABILITY.md` is required and maps every requirement and live finding
  group to Slice 1 and its regression or validation evidence.

## Feature Exit

- Definition of Done status: not started. Slice 1 must be independently
  reviewed, explicitly completion-approved, and committed; the remote PR qlty
  check and all planned validation must pass before Feature Exit.
- Durable documentation updates: none expected; behavior and repository policy
  do not change.
- Open risks: the implementation reviewer must compare the final DOM,
  lifecycle, localization values, public exports, and qlty issue inventory,
  with special attention to helper extractions and host cleanup behavior.

## Validation Checklist

- [x] Reconciled all 36 hosted PR blockers and all 43 locally listed smell
      locations into Slice 1.
- [ ] Focused Calendar host/runtime, component, model, accessibility,
      localization, shared UI, and Table regression suites pass.
- [ ] TypeScript test compilation passes.
- [ ] `rtk pnpm run qlty` reports no blocking issue for the PR diff.
- [ ] Direct `CHANGELOG.md` Markdown lint and repository `lint:md` pass.
- [ ] Production, desktop, and web builds pass.
- [ ] Desktop and web host tests, including WEB-7 through WEB-10, pass.
- [ ] Architecture dependency test and diff checks pass.
- [ ] PR #318's hosted qlty check passes after the completion commit is pushed.
