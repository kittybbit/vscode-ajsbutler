# Feature Tasks: Schedule Impact Calendar Cohesion

## Agent Brief

- Purpose: co-locate calendar presentation with its semantic owner and preserve
  the read-only workflow.
- Active slice: S2 independently reviewed Ready; S1 completion committed.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, linked discovery and
  planning evidence, and the Present Schedule Impact use case.
- Constraints: preserve the committed S1 boundary and implement only approved
  S2 paths.
- Next operation: approved S2 completion commit by `approval-committer`.

## Current state

- Lifecycle state: SLICE_APPROVED
- Next decision: S2 completion commit; explicit Completion Approval recorded.
  S1 was Ready, Completion Approved and committed as
  `14b8751d3986d88521e391f59ea0ef271fed6ce7`.
- Focus replan commit: `205f16fa1d38865cf66b6db089664b7a8612cb09`.
- Selected feature: `schedule-impact-calendar-cohesion`, roadmap item 1.
- Source/base: `30b3f689af6d236ec8dcc427f7ea7789ce12888b`.
- Branch: `codex/schedule-impact-calendar-cohesion`.
- Gate evidence: independent plan review Ready; Human Approval recorded;
  planning commit `550bcb46a80cf96488a6e5d1bb407b199a4b2bbf`.
- Approved implementation scope: original S1 and S2, expectation-only
  Localization correction, and reviewed S1 focus extension below.
  S1 completion committed; S2 implementation is complete under its original
  Human Approval.

## S1 Completion Approval

- Completion commit: `14b8751d3986d88521e391f59ea0ef271fed6ce7`;
  exact 13-path gate committed; staged check passed; worktree clean at commit.

- Status: Approved.
- Approved at: approved in current conversation.
- Provenance: human approved Main's explicit S1 completion-commit request after
  independent implementation review Ready; no Closure or S2 Completion approval.
- Approved scope: exact reviewed S1 completed implementation, tests, CHANGELOG,
  selected-feature evidence/state records and separate gate metadata.
- Review: `calendar_s1_review` Ready, no actionable Findings.
- Reviewed substantive patch SHA256:
  `41b84c3aaf2858b0e084b9d1c503fbdf504fa63de7ad964cab732970fd3dee24`.
- Completion commit paths, exactly:
  - `CHANGELOG.md`
  - `docs/specs/features/schedule-impact-calendar-cohesion/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar-cohesion/TRACEABILITY.md`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarCandidates.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarIssues.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarResultSection.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarRootSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSectionBody.tsx`
    (delete)
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
    (delete)
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
- Main approval/state metadata is separate from the reviewed substantive
  snapshot. No product/test/CHANGELOG, scope, or validation changes were made.

## S2 Completion Approval

- Status: Approved.
- Approved at: approved in current conversation.
- Provenance: human approved Main's explicit S2 completion-commit request after
  independent implementation review Ready. Closure Approval is not included.
- Approved scope: exact reviewed S2 implementation, test and selected-feature
  evidence/state records, including separate Main review/approval metadata.
- Review: `calendar_s2_review` Ready, no actionable Findings.
- Reviewed patch SHA256:
  `c618825734643b1ef9bc4490754a65ebcb95fecb0811b5e456ae89e7604693a5`.
- Completion commit paths, exactly:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarBoundedList.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarBoundedListHelpers.tsx`
    (delete)
  - `src/test/suite/scheduleImpactCalendarBoundedList.test.tsx`
  - `docs/specs/features/schedule-impact-calendar-cohesion/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar-cohesion/TRACEABILITY.md`
- Product/test content and approved scope remain unchanged from review.
- Separate Main metadata validation: [Ready metadata](/private/tmp/calendar-s2-ready/evidence.json)
  and [approval metadata](/private/tmp/calendar-s2-completion-approved/evidence.json).

## S2 implementation review

- Review: `calendar_s2_review` returned Ready, no actionable Findings.
- Reviewed base: `14b8751d3986d88521e391f59ea0ef271fed6ce7`.
- Reviewed patch SHA256:
  `c618825734643b1ef9bc4490754a65ebcb95fecb0811b5e456ae89e7604693a5`.
- Reviewed content manifest SHA256:
  `46cae686a4057632d08a30d59f5db76641bd03a0479759aab5be305e727e0b4f`.
- Approved five-path scope and acceptance matched. Public props, helper bodies,
  hook/component boundaries, focus lifecycle and virtualization are preserved.
- Existing validation reused: 18 calendar tests, 29 architecture checks,
  TypeScript, test compilation, desktop/web/webview build and document checks.
  All official SARIF result records match baseline, including severity and
  measured values; no new or adverse findings. Final aggregate passed.
- Evidence: [S2 implementation](/private/tmp/calendar-s2-evidence/evidence.json)
  and [mechanical details](/private/tmp/calendar-s2-evidence/evidence-details.json).
- Main state/review entries are separate metadata. Reviewed product/test,
  scope, acceptance and validation are unchanged. Completion Approval recorded.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: original reviewed S1 and S2 consolidation plan; excludes the
  proposed S1 focus repair, View-test edits and CHANGELOG described below.
- Approved paths: original S1 Contents, Sections (delete), ResultSection,
  SectionBody (delete), and Components test; unchanged S2 runtime/test paths;
  selected feature `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md` for gate records.
- Provenance: human approval in response to Main's explicit S1/S2 plan approval
  request; applies to planning and implementation, not Completion or Closure.
- Plan commit paths, exactly:
  - `docs/specs/features/schedule-impact-calendar-cohesion/SPECS.md`
  - `docs/specs/features/schedule-impact-calendar-cohesion/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar-cohesion/TRACEABILITY.md`

## S1 renewed approval and review

- Review: `calendar_replan_review` returned Ready, no Findings.
- Reviewed substantive identity: TASKS SHA256
  `2a637486bab04eaab9fcb53a8dad909e71ee5e5e3e4af9fdebaaff30abc33edc`;
  TRACEABILITY SHA256
  `e0f6f1e38e135739c50a502a4364387fd7e80fd9d400c60ca81858f0a6011a95`.
- Replan commit: `ccdbc6af46d4511e2c55e79f54654e3d84f16ce5`; focused
  planning gate completed; S1 implementation remains uncommitted.
- Status: Approved.
- Approved at: approved in current conversation.
- Approved scope: exact expectation-only English colon removal described below
  in `src/test/suite/scheduleImpactCalendarLocalization.test.ts`, plus the
  selected feature records. Original S1/S2 scope remains approved.
- Provenance: human explicitly authorized wording-difference test fixes after
  Main reported the English announcement colon mismatch. Review confirms this
  exact correction fits that authorization. No new approval question needed.
- Replan commit paths, exactly: selected feature `TASKS.md` and
  `TRACEABILITY.md`. Existing S1 runtime/test changes are intentionally retained
  unstaged and excluded from this planning commit; their partial identity and
  path manifest are in the linked S1 evidence. No Completion Approval granted.
- These state/review/approval entries are separate gate metadata; substantive
  replan and required large-test coverage are unchanged.

## S1 replan outcome and validation blocker

- Replan commit: `ccdbc6af46d4511e2c55e79f54654e3d84f16ce5`; independent
  review returned Ready with no Findings and Main recorded renewed Human
  Approval. The exact additional path is
  `src/test/suite/scheduleImpactCalendarLocalization.test.ts`.
- Applied only the approved English `selectedItem` expectation correction:
  removed the colon after `Selected schedule impact`; date, path, occurrence,
  final period, Japanese assertions, resources and runtime formatting are
  unchanged. Test compilation and all three Localization tests pass.
- The required View test `keeps every repeated section bounded and
keyboard-reachable` remains unchanged and was SIGKILLed on both base and final
  snapshots. Main's retained diagnosis below identifies a real focus failure
  and expensive DOM assertion diffing; neither termination is a passing result.
  No coverage waiver or View change is approved. Required coverage stays intact.
- Complete command outputs, SARIF, snapshot identities, reused check references
  and missing facts are linked in the S1 implementation evidence artifact.

## Reviewed S1 focus-contract extension

- Trigger and identity: Main read-only diagnosis at HEAD
  `ccdbc6af46d4511e2c55e79f54654e3d84f16ce5`, with original S1 code comparison
  base `550bcb46a80cf96488a6e5d1bb407b199a4b2bbf` and the partial S1 patch
  retained. [Diagnosis evidence](/private/tmp/calendar-large-diagnosis/evidence.json)
  records exact inspected inputs, profile and compact-failure logs.
- Cause: BoundedList clones `tabIndex`, ref, `onFocus`, `onKeyDown`,
  `aria-posinset`, `aria-setsize` and bounded index onto custom row elements.
  CandidateGroupCard, CandidateDetails, IssueCard, RootStatusCard and
  ValidNoRunsCard drop those props instead of forwarding to their DOM root.
  The candidate article cannot receive focus; the last timeline item remains
  active. A failed strict DOM-object comparison spends over 12 seconds in
  Node's assertion diff at about 1.3 GB memory before termination. A diagnostic
  scalar assertion preserving the identity predicate reveals the failure in
  about one second. This is discovery, not replacement validation or a pass.
- Main design decision: restore forwarding at existing row owners only;
  preserve ResultCard article and ListItem li roots, labels, facts and styles.
  CandidateGroupCard must invoke injected outer `onFocus`/`onKeyDown` only for
  `event.target === event.currentTarget`, leaving nested candidate events with
  their inner list. Do not change BoundedList, its helper algorithms or Timeline.
- Slice decision: keep the minimum repair in S1 because it restores R3's
  required contract for the very result sections being consolidated and
  unblocks their mandatory integrated acceptance. A separate independent fix
  slice would leave the existing S1 acceptance knowingly broken or require
  shelving the partial patch and changing sequencing. No umbrella redesign.
- Renewal: prior review/approval remains valid for original consolidation,
  exact colon-only correction and unchanged S2, but does not cover these
  additions. The focus extension received its own Ready review, explicit Human
  Approval and focused replan commit; integrated S1 readiness and Completion
  Approval remain pending. Existing partial code is retained; no completed
  slice or commit is revoked.
- New Human Approval: Approved; approved at approved in current conversation.
  Provenance: human approved Main's explicit added focus-repair/View/CHANGELOG
  boundary request after independent Ready review. This authorization covers
  implementation and planning only, not Completion Approval or Closure.
- Approved added paths, exactly:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarCandidates.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarIssues.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarRootSections.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `CHANGELOG.md`
  - Selected feature `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`.
- Approved scope: reviewed forwarding and outer-self event design, compact test
  failure reporting with intact 10,000-item coverage, extended regressions,
  one Unreleased entry, and all required validation; no other scope additions.
- Replan commit boundary: exactly selected feature SPECS, TASKS and TRACEABILITY
  after review and approval; leave existing runtime/test changes unstaged.

## Solution Shape and candidate decisions

All changed production modules remain in `src/presentation/webview`, consume
application DTOs and calendar view models, and use existing React, MUI and
React Virtuoso. No layer, public host contract, framework, or dependency
selection changes. No new custom mechanism is needed.

- **Sections into Contents (S1):** remove the single-consumer, stateless
  `ScheduleImpactCalendarSections` forwarding component. Contents already owns
  page composition. Place its existing `Stack spacing={1.5}` and ordered
  RootStatus, ValidNoRuns, Candidates, Issues, Legend children directly there.
  Preserve that Stack and every child component identity, prop and order.
  A separate file or exported component adds no state, reuse, interaction,
  accessibility, lifecycle or complexity boundary for these five child calls.
- **SectionBody into calendar ResultSection (S1):** calendar ResultSection owns
  titled result regions, global/visible count attributes and the empty-versus-
  bounded-list contract. Move the existing rows-length conditional into that
  component and remove `ScheduleImpactCalendarSectionBody`. Preserve the alert
  role for empty results and the title as the list's accessible name. Retain
  `ScheduleImpactCalendarResultSection` and its existing props: candidate,
  issue, root-status and valid-no-runs sections reuse that contract. Shared
  `ResultSection` and `ResultEmptyState` keep their reusable result rendering
  responsibilities within presentation.
- **Bounded-list helpers into BoundedList (S2):** preserve the exported
  `ScheduleImpactCalendarBoundedList({ items, ariaLabel })` component as the
  reusable focus/virtualization boundary. Co-locate all declarations from
  `scheduleImpactCalendarBoundedListHelpers.tsx` in its module; make
  `BoundedListFocusModel`, `useBoundedListFocus` and `BoundedListContent` private.
  Keep named local hooks/components and their bodies, call order, state,
  effects, refs, handler chaining, list semantics, thresholds, overscan and
  Virtuoso configuration unchanged. These lifecycle responsibilities earn
  internal React boundaries, but their current file/export split has one
  production consumer and no separate test or contract consumer. The cohesive
  module has about 270 lines; no flattening of hook/component responsibilities
  or algorithm rewrite is authorized.
- **Custom row contract repair (S1):** Candidates, Issues and RootSections stay
  their existing presentation semantic owners. Their five private row
  components retain separate semantic rendering responsibilities and pass
  BoundedList's already-existing DOM contract to their current root. Use
  React's existing typed ref forwarding capability (`React.forwardRef`, already
  used by ResultCard) with HTMLAttributes and the actual root element type;
  ResultCard roots follow its current HTMLDivElement ref contract and ListItem
  roots use HTMLLIElement. Exclude conflicting semantic `title`/children props
  where needed; preserve semantic props and deliberate markup/style precedence.
  Do not leak DTO/labels props onto DOM, add public exports, wrappers, a shared
  prop adapter, new hook, dependency, or custom focus mechanism. React 19,
  ResultCard and MUI already provide the required ref/attribute forwarding.
  Guard only the outer candidate article's focus/key callbacks against nested
  events, invoking its injected callback once for an article-self event.
  View boundary tests own real-row focus/aria/nested integration; S2's unchanged
  public BoundedList suite owns its algorithm and generic handler chaining.
- **Retain Timeline and TimelineHelpers:** Timeline owns the accessible region,
  navigation hook invocation and empty fallback. Its roughly 470-line helper
  module separates run details, navigation state/ref lifecycle, standard date
  grouping, virtualized rendering and timeline-item interaction. This is an
  earned complexity and state/navigation boundary; merging it would concentrate
  a substantially larger concern without new value. Retain its public names
  and contracts without cleanup of incidental exports.
- **Retain remaining candidates:** Header owns period/count presentation;
  Filters owns independent controls; Candidates, Issues, RootSections and
  Legend own distinct result semantics/markup and reuse result primitives.
  App/bridge own theme, session and host lifecycle; model owns projection and
  filters; accessibility/focus utilities own accessible naming and retry.
  Their reuse, interaction, lifecycle or semantic responsibilities are not
  forwarding-only boundaries. No relocation or extraction is planned.
- Ports and adapters: none changed or introduced; existing transport and host
  adapters remain excluded. Application factories: none changed, removed or
  newly retained by this plan; application/bootstrap composition is excluded.

Architecture-test pass is mechanical evidence for the existing zero-exception
catalog. Independent reviewers separately judge the ownership and boundary
value above; no test result constitutes that semantic judgment.

## Implementation slices

Each slice is one independently testable, reviewable and committable result
preserving the specified behavior contract. Execute S1 first. S2 starts after
S1 is independently Ready, explicitly Completion Approved and committed;
its baseline is that
commit. There is no external feature dependency or cross-layer migration.

### S1: Co-locate result sections and restore their bounded-row focus contract

- Lifecycle state: SLICE_COMMITTED; completion committed as `14b8751d3986d88521e391f59ea0ef271fed6ce7`.
- Value: page ordering lives with Contents; each result region owns its body
  choice. Remove two forwarding boundaries and restore the existing keyboard
  contract for their custom result rows without changing displayed facts.
- Runtime paths, exactly:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
    (delete)
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarResultSection.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSectionBody.tsx`
    (delete)
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarCandidates.tsx`
    (approved: CandidateGroupCard/CandidateDetails DOM forwarding and outer
    article event ownership only)
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarIssues.tsx`
    (approved: IssueCard DOM forwarding only)
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarRootSections.tsx`
    (approved: RootStatusCard/ValidNoRunsCard DOM forwarding only)
- Test paths, exactly:
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
    (existing approved section characterization)
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
    (existing approved colon-only expectation correction)
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
    (approved: compact DOM identity failures and real-row keyboard boundaries)
- Document path: `CHANGELOG.md` (approved: one Unreleased keyboard-fix entry).
- Acceptance: R1 removes the two exports/files and obsolete imports with no
  remaining consumer. R2/R3 preserve period, the five-section order before
  timeline, count attributes and labels, empty alert versus bounded list, and
  unchanged populated sections after filter changes. R4 preserves the existing
  calendar ResultSection props and dependency direction.
- Extended R3 acceptance: all five custom row types attach the cloned ref,
  roving tab index, bounded index, position/set size and focus/key handlers to
  their existing DOM root. Small and virtualized lists permit ArrowUp/Down and
  Home/End within the owning list. Nested before/after candidate navigation
  cannot change outer-group focus/active index; outer-group-self navigation
  still works. Preserve data/labels/counts/DOM size and all 10,000-item assertions.
- Characterize before restructuring: strengthen the existing component test to
  assert ordered semantic regions/legend/timeline, and populated-to-empty-to-
  populated filter transitions with unchanged global counts, correct visible
  counts, accessible list names and alert labels. Test observable rendering,
  not module count or private helper calls. Run these against pre-refactor code.
- Repair characterization: in the existing View suite, first replace only DOM
  object identity assertions with the same strict identity boolean predicate
  and compact context; no fixture, timeout, equality rule, retry, selector or
  covered assertion is weakened. Record the 10,000-item test's inherited
  compact failure before repair. Add small-list integration coverage of all
  five row types and virtualized coverage of previously untested roots,
  valid-no-runs and nested before/after candidates using threshold-plus-one
  fixtures and existing VirtuosoMockContext/DOM setup. Retain existing 10,000
  candidate-group/issue/timeline coverage unchanged except compact reporting.
  Exercise ArrowDown/Up and End/Home, actual activeElement identity, roving
  tabIndex, position/set size, bounded count and render limits. Include two
  groups with multiple before/after candidates: inner navigation stays inside
  its side, does not activate/navigate the parent group, and outer-self keys
  still move groups. Record red boundary failures before the repair and green
  results after. Keep helpers local to this suite; no shared harness/module.
- Validation: common code checks below, including existing view coverage for
  root outcomes, one-sided/scope facts, independent filters, timeline semantics
  and large results. No bounded-list implementation edits in this slice.
- Risk: removing a stateless parent can alter reconciliation position. Preserve
  markup and child keys/types; rerender tests must catch state/visibility loss.
- Repair risks: wrong ref/root types or prop ordering can lose DOM registration
  or semantic attributes; nested event bubbling can move both list owners.
  Use existing roots and explicit typed forwarding, guard outer-self events,
  and verify both nesting and virtualization. Observable keyboard repair is a
  compatible bug fix; no VS Code API, package, host or source-fact changes.
- Pre-repair characterization: `/opt/homebrew/bin/rtk pnpm exec mocha --ui
tdd --grep 'forwards bounded focus behavior|keeps nested candidate focus
and keyboard events|focuses virtualized root'
out/test/suite/scheduleImpactCalendarView.test.js` exited 3 (0 passing, 3
  failing) before any row source edit. The small-row test found the candidate
  article at `tabIndex=-1`; nested candidate focus found the outer row at
  `tabIndex=-1`; virtualized root End could not render/focus the final row.
  Compact raw output:
  `/private/tmp/calendar-s1-focus-red.log`, SHA256
  `258dc4aa0849e0134463a10271ab51a86d50cc38ff48289b4b7c96b0a4fb0602`.
- Implementation: original approved S1 partial source/test changes and the
  replan-authorized Localization expectation are retained. Approved View
  characterization now adds all five row types, nested side ownership and
  threshold-plus-one virtualized roots/no-runs/candidate sides; the existing
  10,000-item assertions retain their strict identity predicate with compact
  context. No S2 or other runtime path changed.
- Validation evidence: [focused S1 implementation evidence](/private/tmp/calendar-s1-implementation-evidence.json)
  records the exact final snapshot, approved paths, check outputs, qlty
  comparison and documentation-metadata validation. The earlier S1 evidence
  remains historical for its narrower pre-focus input set.
- Readiness: SLICE_COMMITTED; independent review Ready, no actionable Findings.
  Completion Approval and completion commit recorded. TypeScript, test compile,
  architecture (29/29), all five calendar suites (14 passing, including the
  10,000-item case), desktop/web/webview build, required documentation checks
  and qlty aggregate passed. Official qlty observations contain only mapped
  baseline findings; details and retained SARIF are in the evidence artifact.
  Completion commit is recorded below.
- Completion Approval: Approved; approved at approved in current conversation;
  scope exact reviewed S1 completion and metadata below;
  commit `14b8751d3986d88521e391f59ea0ef271fed6ce7`.

### S2: Co-locate bounded rendering with its focus lifecycle

- Lifecycle state: SLICE_APPROVED
- Depends on: S1 completion commit and matching review/approval evidence.
- Value: one component module owns the bounded-list contract and its private
  lifecycle/rendering implementation instead of exposing a one-consumer model.
- Runtime paths, exactly:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarBoundedList.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarBoundedListHelpers.tsx`
    (delete)
- Test path: `src/test/suite/scheduleImpactCalendarBoundedList.test.tsx` (new).
- Acceptance: R1 removes helper module/import and private helper exports while
  retaining named internal boundaries. R2/R3 preserve ordering, counts, list
  names, aria position/set size, roving tab index, original focus/key handlers,
  ArrowUp/Down/Home/End, active-index clamping after shrink, and access to items
  outside the rendered viewport. R4 retains the public component signature and
  browser-safe imports. Threshold, overscan, list height and algorithms stay
  byte-for-byte equivalent except import/export/co-location formatting.
- Acceptance result: Pass. The public component props and all bounded-list
  lifecycle, list semantics, handler chaining, threshold and focus behavior
  remain unchanged; the new suite passes all four approved cases.
- Characterize before moving: add boundary tests through the public BoundedList
  component for small-list semantics and handler chaining, rerender with a
  shorter nonempty list, threshold and threshold-plus-one rendering, and
  virtualized End/Home focus with `VirtuosoMockContext`. Use the existing view
  DOM/scroll setup pattern locally; do not introduce a shared harness. Run the
  new tests against pre-refactor code. Existing 10,000-item view test must still
  pass for candidate, issue and timeline keyboard access and bounded DOM size.
- Validation: common code checks below plus the new test. Keep architecture
  dependency checks separate from ownership review.
- Risk: hook, ref or component identity changes can lose focus or active state.
  Move declarations at module scope, retain hook execution under BoundedList,
  and do not change forwardRef placement or ref registration/cleanup.
- Validation result: TypeScript, test compilation, 29 architecture rules, all
  18 calendar tests, desktop/web/webview build, feature Markdown lint, diff
  check, qlty SARIF comparison and final aggregate pass under the evidence
  artifact below. No qlty findings map to changed paths.
- Implementation evidence: [S2 evidence](/private/tmp/calendar-s2-evidence/evidence.json).
- Changed paths: the two runtime paths and new test path above, plus this
  feature's `TASKS.md` and `TRACEABILITY.md` gate/result records. The artifact
  retains their exact final identity and complete command outputs.
- Readiness: SLICE_APPROVED; `calendar_s2_review` returned Ready, no actionable
  Findings. Completion Approval recorded; completion commit pending.
- Completion Approval: Approved; approved at approved in current conversation;
  scope exact reviewed S2 completion and separate gate metadata; commit pending.

## Approval boundaries and exclusions

Renewed Human Approval named the S1 additions, exact production, View-test and
CHANGELOG paths, nested-event design and intact validation above. Original
approvals and the S2 boundary remain recorded separately; they do not authorize
new S1 paths. Selected feature documents carry gate/evidence updates.
The focused plan commit includes only this feature's three Markdown documents
and explicit approval metadata. Each slice commit includes only its listed
runtime/test/document paths and necessary selected-feature records.

All other paths are excluded: Timeline/TimelineHelpers, Legend, Header, Filters,
model, accessibility/focus utilities,
App/bridge, shared results, i18n, application/domain/infrastructure/bootstrap,
host calendar/Explorer, transport, parser/generated artifacts, architecture
rules/tests, dependencies/configuration, README, roadmap and the
inherited WebAPI feature. Required check failures, new tests needing another
path, a qlty Finding needing a design change, or a contract/behavior change
return through Main; no widening or silently deferred required check.

Material alternatives: keep all files (preserves behavior but leaves the
selected unearned boundaries), or merge every helper (would concentrate
Timeline complexity and obscure lifecycle ownership). The selected scope keeps
internal React ownership while removing only three unnecessary file boundaries.
For the blocker, changing BoundedList algorithms, adding DOM wrappers, weakening
the fixture/assertions, or merely raising test timeout are rejected: existing
row-owner forwarding closes the concrete contract gap with the smallest scope.

## Required implementation validation and evidence

For each slice, implementer owns a retained artifact outside inspected inputs.
Record the approved manifest, before/after identities including tests/deletions,
config/dependency/tool hashes, command logs and exits, exact coverage and missing
facts under the Evidence Contract. S1 starts from the focused planning commit;
S2 starts from S1's completion commit. Keep S1's original code comparison base
`550bcb46a80cf96488a6e5d1bb407b199a4b2bbf` and retain its matching baseline
artifact; the renewed replan commit authorizes implementation but does not
silently replace that comparison. Characterization test results identify
the temporary test-only content separately from the approved final snapshot.

Required commands, from the exact slice snapshot:

```sh
rtk pnpm exec tsc --noEmit
rtk pnpm run test:compile
rtk pnpm exec mocha --ui tdd out/test/suite/architectureDependencyRules.test.js
rtk pnpm exec mocha --ui tdd \
  out/test/suite/scheduleImpactCalendarComponents.test.js \
  out/test/suite/scheduleImpactCalendarView.test.js \
  out/test/suite/scheduleImpactCalendarAccessibility.test.js \
  out/test/suite/scheduleImpactCalendarThemeContext.test.js \
  out/test/suite/scheduleImpactCalendarLocalization.test.js
rtk pnpm run build
rtk pnpm exec markdownlint-cli2 'docs/specs/features/schedule-impact-calendar-cohesion/*.md'
rtk git diff --check
```

For S1, additionally lint `CHANGELOG.md` explicitly with
`rtk pnpm exec markdownlint-cli2 CHANGELOG.md`; validate changed local links and
document structure in all four Markdown paths. Run the complete View suite,
including the existing 10,000-item test, after repair; a compact red failure
is characterization only, never acceptance. S2 retains its existing command set.

Evidence renewal: changed View tests and row source invalidate affected calendar
test, TypeScript/test-compilation and build inputs, so renew those results and
architecture dependency validation for the new forwarding paths. Full-repository
final qlty inputs change (source/tests/docs/CHANGELOG); renew both final official
observations and aggregate, reusing the original baseline only when base,
full input inventory, tools/config/dependencies and required scan selection
match. Do not reinterpret an old final scan as having inspected these additions.
Matching untouched targeted results, historical characterization and gate proof
remain reusable; record each reuse and its coverage explicitly.

S2 additionally runs:

```sh
rtk pnpm exec mocha --ui tdd out/test/suite/scheduleImpactCalendarBoundedList.test.js
```

The targeted compiled tests use Mocha's existing TDD API and JSDOM; they do not
need the inherited full desktop host harness or unrelated table/flow suites.
`build` validates the desktop, web and webview production bundles. This isolated
webview refactor changes no shared DTO, bootstrap, entry point or host contract;
desktop/web host suites are not required for this boundary. A newly discovered
host or shared-contract impact requires Replanning and explicit host coverage.
These builds do not claim an interactive VS Code accessibility smoke test;
existing theme/localization and DOM tests remain the nearest regression checks.

Code-tier qlty is required for both slices: qlty 0.645.0 or newer, exact disposable
baseline/final snapshots, same full-repository selection/configuration and
nonzero analyzed inventories. Run and retain complete official SARIF 2.1.0,
logs/status and identities for both commands in both snapshots:

```sh
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
```

In the disposable final snapshot only, run `rtk pnpm run qlty` and require pass.
Compare all reliably mapped identities, severity, values and adverse directions;
new or mapped adverse findings are NG. Unreliable mapping is advisory. No custom
SARIF comparator. If aggregate formatting changes approved paths, synchronize
only those paths and rebuild/repeat until stable. Preserve per-slice evidence
through review, approval, commit and Feature Exit; request refresh only for
changed inputs/coverage/base/tools or a specific Finding. Feature Exit also
requires current-head Qlty Cloud success.

## Validation index

- Discovery reused:
  [intake evidence](/private/tmp/ajsbutler-calendar-intake-30b3f689/evidence.json),
  identity `f6d5478083e832634388a3c67a737f001c14552e686901cd8d079f780dabc41c`.
- Additional discovery: exact consumers and helper responsibilities at selected
  base; see planning artifact for input hashes and observations. No product
  baseline scans or product tests were run to plan.
- Planning documentation evidence:
  [planning evidence](/private/tmp/ajsbutler-calendar-plan-30b3f689/evidence.json).
  Coverage: three Markdown paths, local links, structure, approval provenance,
  traceability, scope and whitespace. Exact identity/results live in artifact.
- Plan review: `calendar_plan_review` returned Ready with no Findings; reviewed
  substantive identity
  `7e419204798d11477b165db6b154d351eedfb1f9cf1f22027c25d007126b70a2`.
  Discovery and planning evidence matched; existing documentation validation
  reused. Main's state/gate annotations are separate metadata, not a new plan.
- Minimal replan and implementation evidence:
  [S1 evidence artifact](/private/tmp/calendar-s1-final-evidence.json). It
  retains original and replan gate references, exact patch identity, commands,
  raw logs, qlty observations, comparison facts and explicit evidence gaps.
  S1's completion gate and commit are recorded above; S2 uses that commit as
  its fresh comparison base.
- Focus-contract discovery:
  [Main diagnosis](/private/tmp/calendar-large-diagnosis/evidence.json), plus its
  `compact-failure.log` and `profile-test.log`; not an implementation pass.
- Focus replan documentation evidence:
  [replan evidence](/private/tmp/calendar-focus-replan/evidence.json).
  Covers exactly the three changed selected-feature Markdown files, link and
  structure checks, traceability, approval provenance, and whitespace. No
  production/check baseline was collected for this planning operation.

- Focus S1 implementation: [implementation evidence](/private/tmp/calendar-s1-implementation-evidence.json).
  Approved-manifest implementation is complete at source HEAD
  `205f16fa1d38865cf66b6db089664b7a8612cb09`, compared with code base
  `550bcb46a80cf96488a6e5d1bb407b199a4b2bbf`. TypeScript, test compilation,
  architecture, calendar integration (including all 10,000 items), production
  build and documentation checks pass. Final qlty official check is
  finding-triggered with three unchanged baseline identities and no findings on
  changed paths; smells inventory retains 151 results with none on changed
  calendar paths. The required aggregate passes. The final implementation
  snapshot and exact separate documentation-evidence metadata checks are linked
  in the artifact. S1 awaits independent implementation review; no Completion
  Approval or commit has been recorded.

- Focus extension review: `calendar_focus_plan_review` returned Ready, no
  actionable Findings; reviewed planning patch SHA256
  `4f61bf9a8e18ab9609ccd8563a59eed3f53d575160050415506c3f28b711f5ed`.
  Per-document hashes are retained in focus replan evidence. Discovery and
  documentation checks matched and were reused. New Human Approval is Approved.
  Main state/review entries are separate metadata; proposed scope unchanged.

- S1 implementation review: `calendar_s1_review` returned Ready, no actionable
  Findings. Reviewed patch SHA256
  `41b84c3aaf2858b0e084b9d1c503fbdf504fa63de7ad964cab732970fd3dee24`
  at HEAD `205f16fa1d38865cf66b6db089664b7a8612cb09`, comparison base
  `550bcb46a80cf96488a6e5d1bb407b199a4b2bbf`. Approved paths and evidence
  matched. Baseline/final SARIF findings and mapped values were compared;
  no new or adverse findings. Documentation links and structure checked.
  Existing validation reused; no product scans repeated for review.
- Main state/review entries are separate gate metadata; reviewed product, test,
  CHANGELOG, acceptance and required validation are unchanged. S1 Completion
  Approval and its commit are recorded above; S2 started from that commit.

## Production readiness and document impact

Preserve immutable projection, half-open period and source times without host
conversion; no new schedule evaluation or JP1/AJS semantics. Preserve
`engines.vscode` `^1.75.0` and browser-safe imports. Large, empty and filtered
results must remain bounded/understandable; raw values stay React text. Unknown
language still falls back to English; theme/high contrast, reduced motion and
zoom styling remain unchanged. Session failures and host lifecycle remain
existing owners. Telemetry and other extension workflows are excluded.

CHANGELOG evaluation: the repair changes observable keyboard accessibility and
therefore requires one concise Unreleased entry stating that keyboard navigation
is restored for calendar result rows, including nested candidates. The durable
gate is satisfied by reusable product behavior, without diagnosis, memory/profile
facts, branch status or module history. Main explicitly allowed this document in
the proposed plan; implementation still awaits renewed Human Approval. No README
or durable use-case change is needed: existing use-case acceptance already owns
the keyboard/bounded-rendering contract. No other durable updates are authorized.
Feature Exit evaluates completion of roadmap item 1 and durable propagation
under its separate scope/gate; do not remove the roadmap item prematurely.
Existing desktop harness, table and graph-golden follow-ups retain their owners;
this implementation does not resolve or waive them. S1 focus extension has its
own Ready review and explicit Human Approval; all approved S1 acceptance checks
now pass, including the 10,000-item View test. S1 still needs independent
implementation review, Completion Approval and the completion commit before S2
can begin. Original S1/S2 approval and matching evidence remain recorded.
