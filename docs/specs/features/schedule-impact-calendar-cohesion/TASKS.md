# Feature Tasks: Schedule Impact Calendar Cohesion

## Agent Brief

- Purpose: co-locate calendar presentation with its semantic owner and preserve
  the read-only workflow.
- Active or approved slice: S1 first; S1 and S2 plans Human Approved.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, linked discovery and
  planning evidence, and the Present Schedule Impact use case.
- Constraints: no runtime, test, generated, or configuration edits until the
  reviewed plan has explicit Human Approval and its focused planning commit.
- Next operation: focused planning commit; Main owns approval and routing.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: focused planning commit, then S1 implementation.
- Selected feature: `schedule-impact-calendar-cohesion`, roadmap item 1.
- Source/base: `30b3f689af6d236ec8dcc427f7ea7789ce12888b`.
- Branch: `codex/schedule-impact-calendar-cohesion`.
- Gate evidence: independent plan review Ready; Human Approval recorded; no commit.
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

- Lifecycle state: PLANNED
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
- Readiness: proposed, no review/approval/validation of implementation yet.
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
- Implementation evidence, implementation reviews, approvals and commits: none.

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
this plan does not resolve or waive them. No prior slices or inherited approvals
are invalidated. No unresolved new scope/design decision remains.
