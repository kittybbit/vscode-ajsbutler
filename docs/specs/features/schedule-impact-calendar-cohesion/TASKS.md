# Feature Tasks: Schedule Impact Calendar Cohesion

## Agent Brief

- Purpose: co-locate calendar presentation with its semantic owner and preserve
  the read-only workflow.
- Active or approved slice: S1 first; S1 and S2 plans Human Approved.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, linked discovery and
  planning evidence, and the Present Schedule Impact use case.
- Constraints: implementation is limited to approved S1 runtime/test paths and
  selected feature records; S2 waits for S1 review, approval, and commit.
- Next operation: focused S1 replan commit; Main owns gate and routing.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: focused commit of the reviewed and Human Approved
  S1 wording-test extension. Main elected to
  preserve the required 10,000-item test unchanged as an implementation-
  readiness blocker; final qlty evidence remains pending.
- Selected feature: `schedule-impact-calendar-cohesion`, roadmap item 1.
- Source/base: `30b3f689af6d236ec8dcc427f7ea7789ce12888b`.
- Branch: `codex/schedule-impact-calendar-cohesion`.
- Gate evidence: independent plan review Ready; Human Approval recorded;
  planning commit `550bcb46a80cf96488a6e5d1bb407b199a4b2bbf`.
- Approved implementation scope: S1 and S2; no completed slices.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: reviewed S1 and S2 plan, including exact implementation,
  acceptance, validation, dependency and exclusion boundaries below.
- Approved paths: S1 and S2 runtime/test paths listed below, plus selected
  feature `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md` for plan and gate records.
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

## S1 minimal replan and preserved validation blocker

- Mode/base: Replanning, S1, planning commit
  `550bcb46a80cf96488a6e5d1bb407b199a4b2bbf`; preserve the existing uncommitted
  S1 implementation patch and the unchanged S2 plan. No completion commit exists.
- Trigger: the required Localization test expects
  `Selected schedule impact: ...`, while the existing English resource prefix
  and formatter produce `Selected schedule impact ...` at both base and final.
- Proposed additional S1 path, exactly:
  `src/test/suite/scheduleImpactCalendarLocalization.test.ts`. Change only the
  English `selectedItem` expected string in
  `does not localize facts in result announcements`, removing its colon.
  Keep its date/path/occurrence facts and final period, all Japanese assertions,
  resource text and runtime formatting unchanged. No other test repair is
  included. This restores the regression assertion to current behavior under
  R3 without changing a public contract or introducing an abstraction.
- Approval provenance: original S1/S2 Human Approval above is preserved. Main
  supplied explicit later human authorization for wording-difference test
  fixes, interpreted as this exact expectation-only correction. It is input
  authorization, not a planner-granted approval or completed replan gate.
  Main must record renewed provenance after independent review of the changed
  S1 boundary; the prior reviewed identity covers only the original scope.
- Review/evidence renewal: the S1 scope extension needs independent plan review
  and a focused replan commit before implementation resumes. Preserve S2's
  design, order, dependency on S1 completion, and approval. Reuse each existing
  passing check only if its own inspected inputs/configuration/tools/coverage
  still match. Refresh Localization and test compilation for the changed test;
  final full-repository qlty must include it and these revised documents.
  Baseline SARIF may be reused only with complete required inventory facts;
  the recorded unknown check analyzed count is not a passing evidence package.
- Unresolved required coverage: the View test
  `keeps every repeated section bounded and keyboard-reachable` constructs
  10,000 candidates, issues and timeline entries and checks fewer than 300 DOM
  entries, global counts, and End-key focus for all three large lists using
  `VirtuosoMockContext`. Both current and baseline commands are SIGKILLed,
  including the baseline isolated run. The retained raw log has no elapsed
  time, RSS, render-stage marker or killer provenance; it establishes identical
  termination, not an OOM, timeout, harness defect or runtime defect diagnosis.
  `.timeout(5000)` cannot interrupt synchronous render work. No View test,
  list algorithm, fixture size, assertion, skip or required coverage change is
  authorized by the wording-fix instruction.
- Main decision: plan only the exact wording expectation correction now.
  Preserve the required 10,000-item test/check unchanged, with no replacement,
  waiver, diagnosis scope or View-test edit. After renewed review/approval/commit,
  resume S1 to complete unaffected required checks and the wording test while
  retaining large-test failure as a blocker to implementation Ready. A concrete
  repair or changed coverage later returns through Main for its own decision.
- Replan readiness: the changed scope is reviewable and no new scope/design or
  validation decision is unresolved. Independent review is required for this
  S1 extension. The existing S1 patch remains paused in IMPLEMENTING until the
  replan gates complete; its required large-test evidence is still not passing.

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

Each slice is one independently testable, reviewable and committable behavior-
preserving result. Execute S1 first. S2 starts only after S1 is independently
Ready, explicitly Completion Approved and committed; its baseline is that
commit. There is no external feature dependency or cross-layer migration.

### S1: Co-locate section composition and empty-state selection

- Lifecycle state: IMPLEMENTING
- Value: page ordering lives with Contents; each result region owns its body
  choice. Remove two forwarding boundaries without changing result children.
- Runtime paths, exactly:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
    (delete)
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarResultSection.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSectionBody.tsx`
    (delete)
- Test path:
  `src/test/suite/scheduleImpactCalendarComponents.test.tsx`.
- Acceptance: R1 removes the two exports/files and obsolete imports with no
  remaining consumer. R2/R3 preserve period, the five-section order before
  timeline, count attributes and labels, empty alert versus bounded list, and
  unchanged populated sections after filter changes. R4 preserves the existing
  calendar ResultSection props and dependency direction.
- Characterize before restructuring: strengthen the existing component test to
  assert ordered semantic regions/legend/timeline, and populated-to-empty-to-
  populated filter transitions with unchanged global counts, correct visible
  counts, accessible list names and alert labels. Test observable rendering,
  not module count or private helper calls. Run these against pre-refactor code.
- Validation: common code checks below, including existing view coverage for
  root outcomes, one-sided/scope facts, independent filters, timeline semantics
  and large results. No bounded-list implementation edits in this slice.
- Risk: removing a stateless parent can alter reconciliation position. Preserve
  markup and child keys/types; rerender tests must catch state/visibility loss.
- Implementation: exact approved S1 runtime and test paths changed; R1 and the
  observable component transitions pass characterization before and after the
  refactor. No S2 or other runtime path changed.
- Validation evidence: see the S1 partial evidence artifact in the Validation
  index. Production TypeScript, test compilation, architecture rules, and build
  pass. Markdown lint and diff check passed before the final outcome annotations
  and need rerunning. The targeted component and non-large view,
  accessibility, theme, and most localization tests pass. Required calendar
  coverage is not Ready: the existing announcement wording assertion fails on
  both S1 and the comparison base, and the existing 10,000-item view test is
  SIGKILLed on both. Final qlty observations and aggregate are deferred until
  Main resolves the scope change.
- Readiness: implementation handoff paused in IMPLEMENTING. User authorized
  fixing the wording mismatch, which is outside the approved paths; Main routes
  minimal replan review, renewed approval provenance and commit before that
  edit. Main preserves the large-test requirement unchanged as a blocker to
  implementation Ready; unaffected checks may resume after the replan gates.
  No completion approval or commit.
- Completion Approval: Pending; approved at none; scope none; commit none.

### S2: Co-locate bounded rendering with its focus lifecycle

- Lifecycle state: PLANNED
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
- Readiness: proposed, no review/approval/validation of implementation yet.
- Completion Approval: Pending; approved at none; scope none; commit none.

## Approval boundaries and exclusions

Human Approval must name S1 and S2, their exact runtime/test paths above, and
selected feature documents used for state, evidence and traceability updates.
The focused plan commit includes only this feature's three Markdown documents
and explicit approval metadata. Each slice commit includes only its listed
runtime/test paths and necessary selected-feature records.

All other paths are excluded: Timeline/TimelineHelpers, Candidates, Issues,
RootSections, Legend, Header, Filters, model, accessibility/focus utilities,
App/bridge, shared results, i18n, application/domain/infrastructure/bootstrap,
host calendar/Explorer, transport, parser/generated artifacts, architecture
rules/tests, dependencies/configuration, README, CHANGELOG, roadmap and the
inherited WebAPI feature. Required check failures, new tests needing another
path, a qlty Finding needing a design change, or a contract/behavior change
return through Main; no widening or silently deferred required check.

Material alternatives: keep all files (preserves behavior but leaves the
selected unearned boundaries), or merge every helper (would concentrate
Timeline complexity and obscure lifecycle ownership). The selected scope keeps
internal React ownership while removing only three unnecessary file boundaries.

## Required implementation validation and evidence

For each slice, implementer owns a retained artifact outside inspected inputs.
Record the approved manifest, before/after identities including tests/deletions,
config/dependency/tool hashes, command logs and exits, exact coverage and missing
facts under the Evidence Contract. S1 starts from the focused planning commit;
S2 starts from S1's completion commit. Characterization test results identify
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
- Minimal replan documentation evidence:
  [replan evidence](/private/tmp/calendar-s1-minimal-replan-evidence.json).
  Expectation-only scope is concrete; Main preserves the unchanged large-test
  requirement as an implementation-readiness blocker. No runtime/test change
  or new approval was produced by the planner.
- S1 implementation evidence (partial; validation findings prevent Ready):
  [evidence artifact](/private/tmp/calendar-s1-pre-replan-evidence.json). It
  retains the implementation patch identity, commands and raw logs, base
  comparisons, and qlty baseline SARIF. S1 implementation review, Completion
  Approval, and slice commit are pending. S2 remains PLANNED.

## Production readiness and document impact

Preserve immutable projection, half-open period and source times without host
conversion; no new schedule evaluation or JP1/AJS semantics. Preserve
`engines.vscode` `^1.75.0` and browser-safe imports. Large, empty and filtered
results must remain bounded/understandable; raw values stay React text. Unknown
language still falls back to English; theme/high contrast, reduced motion and
zoom styling remain unchanged. Session failures and host lifecycle remain
existing owners. Telemetry and other extension workflows are excluded.

No README, CHANGELOG or durable use-case changes are needed for preserved
observable behavior. No durable updates are authorized in implementation.
Feature Exit evaluates completion of roadmap item 1 and durable propagation
under its separate scope/gate; do not remove the roadmap item prematurely.
Existing desktop harness, table and graph-golden follow-ups retain their owners;
this plan does not resolve or waive them. No completed slices exist.
Original approval and matching evidence remain
recorded; the proposed S1 extension needs renewed independent plan review and
approval provenance through Main. Main preserves the required 10,000-item
check as an implementation-readiness blocker; S2 scope and approval are
preserved.
