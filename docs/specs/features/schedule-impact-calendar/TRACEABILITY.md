# Requirements Traceability: Schedule Impact Calendar

<!-- markdownlint-disable MD013 MD060 -->

| Requirement                                                                                                            | `SPECS.md` basis                                                                                          | Slice          | Test / validation evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CAL-FACTS-001`: consume one immutable comparison snapshot; perform identity and schedule evaluation once              | Requirements: CAL-FACTS-001; Architecture; Acceptance Criteria                                            | Slices 1 and 2 | `compareSemanticDiffWithArtifacts.test.ts`, `semanticDiffPresentationArtifacts.test.ts`, `buildSemanticDiffPresentationArtifactsAdapter.test.ts`: parsed input, facts union, exact adapter call graph, one-pass spies, public `.result` and context compatibility                                                                                                                                                                                                           |
| `CAL-PERIOD-001`: preserve the half-open period and gate the public action on workflow period-bearing context          | Requirements: CAL-PERIOD-001; Exposure Boundary; Acceptance Criteria                                      | Slices 1–3     | facts-union period cases; Slice 2 omitted-options/selected-period forwarding tests; completed workflow `semanticDiffCommand.test.ts` period picker/forwarding/cancellation coverage; Slice 3 evaluated-artifact enablement and no-period ordinary-Explorer/unavailable behavior; invalid workflow input failure before comparison/open; existing `compareSemanticDiffWithArtifacts.test.ts` direct adapter invalid-period fixture; no timezone or `Date` conversion         |
| `CAL-RUNS-001`: retain supported before/after runs and distinguish unchanged, added, removed, and changed-time effects | Requirements: CAL-RUNS-001; Normative Calendar Data Contract; Acceptance Criteria                         | Slice 1        | `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and `compareSemanticDiffWithArtifacts.test.ts`: real differ duplicate/count-mismatch changed-time pairing, rule/source-unit grouping, same-pass before/after runs and valid-no-runs metadata, closed root predicate, root/non-root correspondence, rename/move, excluded ambiguous candidates, and shuffled deterministic order                          |
| `CAL-CHANGES-001`: preserve exact source-change references and deterministic effect identity                           | Requirements: CAL-CHANGES-001; Stable IDs, Foreign References, And Duplicate Pairing; Acceptance Criteria | Slice 1        | `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and `compareSemanticDiffWithArtifacts.test.ts`: actual upstream `runChanges` `(id, occurrenceOrdinal)` resolution for duplicate/count-mismatch effects, source-unit isolation, root-scope one-sided refs, allowed same-effect sharing, cross-effect rejection, and stable detail/timeline/rule order                                                     |
| `CAL-ZERO-001`: distinguish explicit valid no-runs from partial, unsupported, invalid, and uncalculated outcomes       | Requirements: CAL-ZERO-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria             | Slices 1 and 3 | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: both-side valid-no-runs metadata from one pass; supported/partial plus invalid, `missing-context`, unsupported, and legacy `missing-start-time`→`uncalculated` status matrix; null-side, zero-only, mixed, malformed, and candidate-root exclusion cases                                                                                                                                      |
| `CAL-UNKNOWN-001`: keep unsupported and uncalculated schedule portions visible with stable evidence                    | Requirements: CAL-UNKNOWN-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria          | Slices 1 and 3 | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: carried status applies only to calendar-selection/closed-day-substitution; corrected missing-context fixture; issue-kind ordinal grouping, issue-code/detail preservation, side/root references, uncalculated section, no prose inference                                                                                                                                                     |
| `CAL-PRESENT-001`: provide a deterministic date-grouped linear timeline with keyboard and screen-reader semantics      | Requirements: CAL-PRESENT-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 3 and 4 | projection/view tests, extracted MUI component behavior, keyboard and focus recovery, live-region announcements, desktop/web and reflow checks                                                                                                                                                                                                                                                                                                                              |
| `CAL-FILTER-001`: keep root, root-outcome, and run-state filtering separate and conjunctive                            | Requirements: CAL-FILTER-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria           | Slices 3 and 4 | independent selector and no-match cases; extracted MUI filter controls; global versus visible totals; unchanged source facts and order                                                                                                                                                                                                                                                                                                                                      |
| `CAL-SESSION-001`: reuse one comparison, isolate child lifecycle, and keep the sidecar host-private                    | Requirements: CAL-SESSION-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 2 and 3 | registry identity, exact-once Explorer open, atomic rollback, parent-only release, child reopen, stale/late work, closed envelopes; completed workflow `semanticDiffCommand.test.ts`/`semanticDiffCommandScheduleImpact.test.ts` handoff guards; Slice 3 `semanticDiffExplorerRegistry.test.ts`/`semanticDiffExplorerPanel.test.ts` compatible action registration/validation, private callback dispatch, exact-context sidecar resolution, and child-panel lifecycle tests |
| `CAL-A11Y-001`: expose textual state and preserve desktop/web accessibility                                            | Requirements: CAL-A11Y-001; Display Language And Compatibility; Acceptance Criteria                       | Slices 3 and 4 | accessibility and localization tests for names, focus, announcements, MUI roles, high contrast, zoom, reduced motion, and fallback language                                                                                                                                                                                                                                                                                                                                 |
| `CAL-SCALE-001`: bound rendering and enforce the inclusive 8 MiB encoded-message limit without loss                    | Requirements: CAL-SCALE-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria      | Slices 1–4     | exact/over-limit message tests, no partial state, deterministic large-result projection, extracted virtualization and DOM-size checks                                                                                                                                                                                                                                                                                                                                       |
| `CAL-PRIVACY-001`: keep content, paths, run lists, and host handles out of telemetry and transport                     | Requirements: CAL-PRIVACY-001; Impact Analysis; Non-Goals                                                 | Slices 1–3     | DTO/message inspection, telemetry guard, architecture and desktop/web checks                                                                                                                                                                                                                                                                                                                                                                                                |
| Architecture and compatibility boundaries remain unchanged                                                             | Architecture; Compatibility; Breaking Change Analysis                                                     | Slices 1–7     | path-scoped review, architecture checks, manifest/output-bundle guard, existing report/JSON/Explorer/Flow/source regressions, MUI component/package checks, host/browser location guard, shared-resource/context checks, quality checks                                                                                                                                                                                                                                     |
| Presentation package organization remains aligned with table/Flow webviews without changing behavior                   | Architecture; Compatibility; Acceptance Criteria                                                          | Slices 4–7     | new calendar/Explorer component-boundary tests, host/browser package-location/import assertions, shared `MyAppContextProvider`/resource tests, existing calendar suites, Explorer DOM/theme/projection/messages/Flow/source/report/action suites, desktop/web builds, MUI role/label/focus/reflow checks                                                                                                                                                                    |
| Explorer theme and locale use the canonical viewer resource mechanism                                                  | Compatibility; Acceptance Criteria                                                                        | Slice 7        | `MyContexts` provider/resource integration, `viewerHostMessages`/`viewerEventBridge` parser coverage, Explorer DOM/component theme and locale fixtures, `semanticDiffExplorerPanel.test.ts` common-resource pre-dispatch and malformed-request coverage, desktop/web host checks                                                                                                                                                                                            |
| Durable user documentation is added only when the public view is observable                                            | Durable Documentation Impact; Acceptance Criteria                                                         | Slice 3        | `uc-present-schedule-impact.md` and index validation; `rtk pnpm run lint:md`; README/CHANGELOG impact review                                                                                                                                                                                                                                                                                                                                                                |

<!-- markdownlint-enable MD013 MD060 -->

## Slice 1 Implementation Evidence

- Approved boundary: the third targeted replan is committed in `11615026`;
  Slice 1 implementation is complete and completion-committed at `51a8ae4a`.
  Independent implementation review was `Ready` with no Findings and
  Completion Approval was recorded under the user's automatic no-findings
  instruction.
- Runtime evidence: the internal schedule differ groups by canonical source
  path/date/rule, pairs duplicate occurrences deterministically, and emits
  changed-time plus unmatched rows without changing the public run-change
  DTO. The sidecar pairs by source identity/date/rule, prevents nested
  cross-pairing, resolves actual upstream `(id, occurrenceOrdinal)` references,
  and fails closed when an eligible row is absent. The real parsed-document
  end-to-end fixture covers duplicate/count-mismatch output and exact sidecar
  references; deterministic issue, timeline, and rule expectations are
  asserted.
- Validation rerun: `rtk pnpm run test:compile`; focused schedule/sidecar/
  artifact/calendar Mocha suites (67 passing); JSON/contract/schedule/Explorer
  pure regression Mocha suites (54 passing); report and host-bound Explorer
  regressions in the desktop extension-host run (exit 0 with the existing
  macOS codesign warning); desktop and web webpack builds; and web
  extension-host tests (exit 0 with existing EPIPE/Premature-close
  stream-cleanup warnings). `rtk pnpm run qlty:check`
  passed with no issues; `rtk pnpm run qlty:smells` completed with advisory
  complexity/duplication findings only; markdown lint passed with 0 errors;
  and `git diff --check` passed.
- Compatibility/readiness: no command, bootstrap, Explorer, UI, manifest,
  telemetry, parser, Node-built-in, public result/report/JSON, or public action
  boundary changed. Shared code remains browser-safe and host-neutral. Slice 1
  is complete and committed, and Slice 2 is complete and committed at
  `b9cee633`; completed workflow commit `8e6922f8` now supplies the public
  Slice 3 artifact handoff.

## Slice 2 Implementation Evidence

- Approved boundary: Slice 2 is complete after completion-committed Slice 1
  `51a8ae4a`; implementation review is `Ready`, Completion Approval is
  recorded, and the focused completion commit is `b9cee633`.
- Runtime evidence: the source-text presentation adapter parses both sides
  once, forwards only the exact optional schedule period, invokes comparison
  and the pure builder once, and preserves the existing parser-error union.
  Bootstrap owns exact-context sidecar registration and the calendar-aware
  companion opens the existing Explorer once for both impact states. Internal
  calendar session IDs, epochs, closed transport envelopes, byte limits,
  recursive JSON validation, normalized language, panel/listener cascade, late
  callback guards, request-envelope validation-result preservation, panel
  shell, and browser bridge are isolated from the public Explorer wire.
- Validation rerun: `rtk pnpm run test:compile`; focused
  transport/session/sidecar/adapter Mocha tests (11 passing); Slice 1
  regression Mocha tests (67 passing); desktop and web webpack builds; desktop
  extension-host tests (exit 0 with the existing macOS codesign warning); web
  extension-host tests (exit 0 after the permitted rerun, with existing
  EPIPE/Premature-close stream-cleanup warnings);
  `rtk pnpm run qlty:check` passed with no issues; `rtk pnpm run qlty:smells`
  completed with advisory complexity/duplication findings; markdown lint and
  `git diff --check` passed. The initial sandbox web run was blocked by
  Chromium Mach rendezvous permission and is superseded by the permitted
  rerun.
- Compatibility/readiness: `package.json`, command contributions, activation
  events, custom editors, VS Code engine, public result/report/JSON contracts,
  Explorer transport, Flow/source behavior, and telemetry remain unchanged.
  Shared browser-safe code has no Node-built-in dependency. Completion
  Approval and completion commit `b9cee633` are recorded; comparison workflow
  commit `8e6922f8` is now the consumed public Slice 3 dependency.

## Slice 3 Implementation Evidence

- Approved boundary: public Slice 3 implementation follows focused approved
  plan commit `70ff7da7`; Slices 1 and 2 and the completed workflow at
  `8e6922f8` remain preserved. Independent implementation review is `Ready`
  with no Findings, Completion Approval is recorded, and focused completion
  commit `ffb92f1e` plus format correction `09148de4` are complete. Explicit
  Closure Approval remains pending.
- Runtime evidence: the available evaluated artifact receives one compatible
  `sde-action-*` Explorer trigger. The host validates it through the existing
  session-scoped action lookup, handles the private calendar callback before
  normal report/source/Flow dispatch, resolves the sidecar by exact immutable
  context identity, and returns the unchanged action-result envelope. The
  child calendar transport keeps its `sdc-calendar-action-*` ID outside the
  Explorer membership and parent disposal releases child/session resources.
  The browser-safe view sorts immutable timeline facts deterministically,
  groups by date, exposes separate conjunctive root/outcome/run-state filters,
  preserves root-scope transitions, candidates, and issues, and applies
  localized EN/JA fallback with accessible labels, focus recovery, CSP, and
  bounded rendering. The review correction pass also exposes every
  timeline/run/candidate/issue identity and structured detail, filters root
  statuses/no-runs/issues with global counts preserved, adds a localized
  text/icon/pattern legend, implements roving keyboard focus with live
  announcements, removes disposed panel handles from both caches, and bounds
  every repeated section for large results. The second review correction adds
  root and valid-no-runs rows with stable root IDs, localized before/after
  side facts, explicit absent-side wording, and root-scope transition identity
  decision IDs. Virtualized timeline, candidate, and issue lists now use
  imperative scrolling with deferred post-mount focus recovery so keyboard
  End/Arrow navigation reaches offscreen last entries.
- Changed paths: approved Explorer/panel/bootstrap/webview/resource/webpack
  paths, calendar helper directory, named Slice 3 tests, and durable
  use-case/index/README/CHANGELOG/evidence files. No unlisted localization
  helper was changed; package contributions and public message contracts are
  unchanged.
- Validation evidence after the correction pass: `rtk pnpm run test:compile`;
  projection/localization/accessibility/view tests covering metadata,
  paired/one-sided/root-scope facts, root/outcome no-match matrices, keyboard
  navigation, legend patterns, and a 10,000-entry DOM bound plus first/last
  focus reachability for timeline, candidates, and issues; focused Explorer
  action and repeated panel lifecycle coverage compiled for the extension-host
  run; production and desktop/web development builds; desktop and web
  extension-host tests;
  `qlty:check` (no issues); `qlty:smells` (advisory complexity/duplication
  findings only); markdown lint; and `git diff --check`. Desktop retains the
  existing macOS codesign warning and web retains the existing
  EPIPE/Premature-close stream-cleanup warnings.
- Compatibility/readiness: no new Node or VS Code dependency enters shared
  webview code. The calendar panel uses a nonce-bound CSP and
  `asWebviewUri`; inherited display language controls EN/JA fallback; raw
  values are React-escaped; no telemetry or public result/report/JSON/Explorer
  transport change is introduced.
- Unresolved risk: no implementation or product risk remains. Existing macOS
  codesign, web stream-cleanup, webpack-size, and advisory smell findings are
  documented observations.
- Historical route at Slice 3 completion: Feature Exit was ready for explicit
  Closure Approval; subsequent user requests reopened planning for the
  presentation-only Slice 4 calendar MUI decomposition and Slice 5 Explorer
  package/component alignment. That historical closure proposal is now
  superseded by the completed five-slice Feature Exit evidence below.

## Slice 3 Replanning Evidence

- Trigger addressed: current `main` commit `8e6922f8` completion-committed the
  comparison workflow and removed its feature folder. The former
  dependency-run-only state for public Slice 3 no longer reflects the
  repository base.
- Consumed workflow contract: production wiring supplies
  `showWorkflowQuickPick`, `showInputBox`, and
  `buildSemanticDiffPresentationArtifacts`, so `commandExecution` selects
  `runFileComparisonWorkflow`. That workflow selects file or Git HEAD,
  validates an optional half-open period with `selectWorkflowPeriodStep`.
  `not-requested` continues through `buildWorkflowArtifacts`, binds source
  capture, and calls `openScheduleAwareExplorerSession` once, yielding the
  ordinary Explorer with `scheduleImpact.kind === "unavailable"` and reason
  `not-requested`. Invalid input returns a failed step at
  `selectWorkflowPeriodStep` after releasing the source reservation and before
  artifact building or Explorer opening. A valid period continues through
  `buildWorkflowArtifacts` and `openScheduleAwareExplorerSession` and yields
  `scheduleImpact.kind === "available"`.
- Revised boundary: Slice 3 consumes the exact evaluated artifact and existing
  parent/child session foundation, and adds only the host-private Explorer
  action, calendar presentation, bundle, localization, accessibility, tests,
  and durable user documentation. The host integration is scoped to
  `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerPanel.ts`,
  `semanticDiffExplorerPanelLifecycle.ts`, `semanticDiffExplorerPanelActions.ts`,
  `semanticDiffExplorerPanelRequests.ts`,
  `semanticDiffExplorerPanelTransport.ts`, and their panel/webview action
  plumbing. The Explorer trigger allocates an existing `sde-action-*` ID,
  registers it only for an available sidecar, and enters the existing
  session-scoped validator; its private callback runs before normal
  source/flow/output metadata dispatch, resolves the sidecar by exact
  immutable context identity, and opens/reveals the child. The child
  `sdc-calendar-action-*` ID stays outside the Explorer membership. The
  existing action-result envelope and public message union remain unchanged;
  the completed workflow and package contributions are not modified.
- Preserved slices: Slice 1 remains completion-committed at `51a8ae4a` and
  Slice 2 remains completion-committed at `b9cee633`; their approval, runtime,
  transport, and validation evidence is unchanged.
- Validation delta: `semanticDiffExplorerRegistry.test.ts` and
  `semanticDiffExplorerPanel.test.ts` must assert `sde-action-*` allocation,
  available-only membership, rejection of `sdc-calendar-action-*` by the
  Explorer validator, private-before-normal dispatch, exact context-identity
  sidecar resolution, unchanged action-result envelope, and dispose/reopen/
  stale/failure/unavailable behavior.
- Review route: return this targeted plan revision to Main for independent
  `plan-reviewer` review. No new Human Approval is asserted by this document.

## Slice 4 Replanning Evidence

- Trigger addressed: after the three implementation slices were complete, the
  user requested an MUI schedule-impact calendar organized like the existing
  table and Flow webviews. The current calendar is behaviorally complete and
  already imports MUI, but `ScheduleImpactCalendarApp.tsx` combines session
  state, model/filter composition, theme ownership, timeline virtualization,
  and every root/no-run/candidate/issue/legend section in one roughly
  1,000-line module.
- Revised boundary: Slice 4 is presentation-only. The thin
  `editor/scheduleImpactCalendar.tsx` entry, sidecar DTO, bridge/session
  transport, model semantics, accessibility/focus helpers, localization
  resources, workflow/action integration, and bundle wiring remain unchanged.
  The new calendar package modules own only App/Contents/Header/Filters,
  Sections, Timeline, and the shared bounded-list extraction, using the
  existing shared MUI theme/style modules. `MyContexts` and parser data remain
  outside the calendar presenter.
- Planned paths: `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`,
  new `ScheduleImpactCalendarContents.tsx`,
  `ScheduleImpactCalendarHeader.tsx`,
  `ScheduleImpactCalendarFilters.tsx`,
  `ScheduleImpactCalendarSections.tsx`,
  `ScheduleImpactCalendarTimeline.tsx`, and
  `ScheduleImpactCalendarBoundedList.tsx`, plus new focused
  `src/test/suite/scheduleImpactCalendarComponents.test.tsx` and only
  boundary-driven updates to the ten existing calendar/Explorer suites listed
  in `TASKS.md`.
- Acceptance and validation delta: preserve stable calendar IDs, labels,
  counts, filter conjunction, focus/recovery, timeline ordering, Virtuoso
  bounds, explicit empty/error states, EN/JA fallback, high contrast, reduced
  motion, reflow, CSP, and desktop/web behavior. Validate MUI roles/control
  labels and component composition in addition to the existing projection,
  accessibility, lifecycle, transport, action, and scale matrices; run test
  compile, production and desktop/web builds, full qlty, Markdown lint, and
  `git diff --check` after implementation.
- Preserved state: Slice 3 completion `ffb92f1e`, format correction `09148de4`,
  its implementation review and automatic no-findings Completion Approval, and
  the proposed roadmap/feature-folder closure package remain preserved. The
  combined Slice 4/5 plan was approved and committed at `271c6027`.
- Planning review: the combined Slice 4/5 package received independent
  `plan-reviewer` `Ready` review with no Findings before implementation.

## Slice 4 Implementation Evidence

- Implemented on 2026-09-15 within the approved presentation-only boundary.
  `ScheduleImpactCalendarApp` now owns session fallback and the single theme
  surface; `ScheduleImpactCalendarContents` owns model/filter/announcement
  composition; Header, Filters, Sections, Timeline, and BoundedList are
  explicit MUI component modules. The existing thin entry, DTO, bridge,
  lifecycle, localization resources, and bundle wiring remain unchanged.
- The new component test verifies the composed MUI landmarks and controls,
  stable timeline/candidate/issue IDs, ordered sections, and outcome filter
  behavior. Existing focused calendar tests continue to cover localization,
  side metadata, live semantics, conjunctive filters, roving focus, deferred
  virtualized focus, 10,000-entry bounds, and explicit states.
- Final validation: `rtk pnpm run test:compile`; focused component plus
  calendar view/accessibility/localization/projection Mocha run (`11 passing`);
  production build; desktop and web development builds; desktop extension-host
  run (exit 0); permitted web extension-host run (exit 0, WEB-7 through WEB-10
  passed); full `rtk pnpm run qlty:check` (`No issues`); Markdown lint (0
  errors); and `git diff --check`.
- Compatibility and readiness: no schedule meaning, application contract,
  session transport, Explorer action, workflow gate, package contribution,
  resource key, CSP, or telemetry behavior changed. Desktop/web compilation
  succeeds and the shared code remains browser-safe. Existing bundle-size,
  desktop codesign, and web stream-cleanup warnings remain documented
  observations.
- Implementation review: independent `implementation-reviewer` returned
  `Ready` with no Findings. Main recorded automatic no-findings Completion
  Approval under the user's instruction, and focused completion commit
  `d4344a26` is complete.

## Slice 5 Replanning Evidence

- Trigger addressed: the user additionally requested that the Semantic Diff
  Explorer's component and package structure follow the existing Flow and
  Unit List webview pattern. Actual references are the thin
  `editor/flowViewer.tsx`/`editor/tableViewer.tsx` entries and their
  `ajsFlow`/`ajsTable` App → Contents → Header/body modules. Current Explorer
  rendering instead has its bundle entry in
  `semantic-diff/semanticDiffExplorerEntry.tsx`, a host App in
  `semanticDiffExplorer.tsx`, and a large combined loaded view in
  `semanticDiffExplorerView.tsx`.
- Revised boundary: Slice 5 moves only the webview package/entry and React/MUI
  composition. New editor-package App/Contents/Header/SummaryCards/
  ExplorerTreePanel modules consume the existing host-state, view-state,
  keyboard, focus, tree-data, row/detail, localization, and theme-mode
  helpers. Compatibility facades preserve imports from
  `semantic-diff/semanticDiffExplorer.tsx`,
  `semantic-diff/semanticDiffExplorerView.tsx`, and
  `semantic-diff/semanticDiffExplorerEntry.tsx`; the host protocol, action
  IDs, calendar callback, Explorer hierarchy, Flow/source/report actions,
  application DTOs/messages, and lifecycle remain unchanged.
- Planned paths: new
  `src/presentation/webview/editor/semanticDiffExplorer.tsx` thin bundle entry;
  new `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp.tsx`,
  `SemanticDiffExplorerContents.tsx`, `Header.tsx`, `SummaryCards.tsx`, and
  `ExplorerTreePanel.tsx`; compatibility updates to
  `src/presentation/webview/semantic-diff/semanticDiffExplorer.tsx`,
  `semanticDiffExplorerView.tsx`, and `semanticDiffExplorerEntry.tsx`; exact
  `webpack.config.js` entry path update retaining the `semanticDiffExplorer`
  output name; and new focused
  `src/test/suite/semanticDiffExplorerComponents.test.tsx` with boundary-driven
  updates to the existing Explorer DOM/theme/projection/messages/Flow/source/
  report/action/session suites listed in `TASKS.md`.
- SPECS boundary check: the feature specification's non-goal against
  reimplementing the Explorer hierarchy, Flow graph, diff overlays, source
  navigation, and public transport remains satisfied because this plan keeps
  those owners and moves only existing rendering behind compatible props. No
  normative `SPECS.md` amendment or feature-author decision is required at
  planning time; any discovered behavior, hierarchy, action, message, or
  contract change must return to Main for Replanning.
- Acceptance and validation delta: the new editor entry mounts one themed App
  with the same ready/loading/failure/theme behavior, App delegates to
  Contents, Header preserves output/calendar/filter controls and originating
  button elements, SummaryCards preserves counts and accessible names, and
  ExplorerTreePanel preserves tree roles, IDs, keyboard navigation, deferred
  virtualized focus, leaf details, action availability, localization,
  high-contrast/reflow/reduced-motion behavior, and desktop/web parity. Run
  focused component and existing Explorer/calendar/session regressions, test
  compile, production and desktop/web builds, qlty, Markdown lint, and
  `git diff --check`.
- Dependency and approval delta: Slice 5 follows Slice 4's completion commit
  and has its own independent review, plan gate, implementation review, and
  automatic no-findings Completion Approval boundary. The final human approval
  remains batched after all seven slices; no approval is asserted here.
- Review route: return the combined Slice 4/5 package to Main for independent
  `plan-reviewer` review. No implementation or closure verdict is asserted by
  this section.

## Slice 5 Implementation Evidence

- Status: Complete on 2026-09-15; independent `implementation-reviewer`
  review is `Ready` with no Findings, automatic no-findings Completion Approval
  is recorded, and focused completion commit `f47edeb0` is complete.
- Changed paths: new editor package entry and App/Contents/Header/
  SummaryCards/ExplorerTreePanel modules; semantic-diff App/View/entry
  compatibility facades; `webpack.config.js`; and the focused Explorer
  component test. No DTO, message, action, session, transport, workflow,
  bootstrap, calendar, Flow/source/report, manifest, resource, or user-doc
  paths changed.
- Acceptance evidence: the editor entry mounts the extracted App; the App
  preserves host loading/failure and single theme ownership; Contents keeps
  filtering, selection, announcements, tree expansion, and virtualization;
  Header forwards originating action elements; SummaryCards preserves IDs,
  counts, details, and accessible names; ExplorerTreePanel delegates existing
  row/detail/keyboard/focus behavior without reinterpreting facts. The focused
  test covers compatibility App identity, ready/loading behavior, MUI roles,
  sticky header, status/live regions, output/calendar element forwarding, and
  stable row IDs. Existing Explorer/calendar UI regressions are green.
- Validation: `rtk pnpm run test:compile`; direct focused component and
  Explorer/calendar UI suites (`62 passing`); production and desktop/web
  development builds; desktop/web extension-host checks; full qlty check
  (`No issues`); Markdown lint; and diff check all pass.
- Compatibility/readiness: webpack keeps the `semanticDiffExplorer` output
  name while consuming the editor entry. Legacy imports remain available, the
  production App has one MUI theme/global-style boundary, and shared imports
  remain browser-safe. No external behavior, public contract, telemetry, or
  compatibility-floor change was introduced.
- Implementation review: independent `implementation-reviewer` returned
  `Ready` with no Findings. Main recorded automatic no-findings Completion
  Approval under the user's instruction, and focused completion commit
  `f47edeb0` is complete. Feature Exit and the final human Closure Approval
  were the next-stage gates at Slice 5 completion; Slice 6 subsequently
  completed the requested placement cleanup.

## Slice 6 Replanning Evidence

- Trigger addressed: after Slice 5 completion, the user asked for the
  remaining `presentation/vscode/webview/scheduleImpactCalendar*` host files,
  the calendar bridge, and the remaining `presentation/webview/semantic-diff`
  browser modules to follow the existing Flow and Unit List placement.
- Revised boundary: Slice 6 is a package/import relocation only. The calendar
  host's five feature-specific files move into
  `src/presentation/vscode/webview/scheduleImpactCalendar/`; the browser
  bridge moves into the existing
  `src/presentation/webview/editor/scheduleImpactCalendar/` package; and the
  ten remaining Explorer browser modules move into
  `src/presentation/webview/editor/semanticDiffExplorer/`. The two obsolete
  old browser facades/entry are removed after canonical imports are updated.
  Shared ViewerFactory/WebviewMediator/WebviewStore/mounting and the existing
  semantic-diff host category packages remain in place. No transport, DTO,
  action, lifecycle, CSP, bundle-name, or user-visible behavior changes.
- Planned paths: the five moved calendar host files
  (`scheduleImpactCalendarJson.ts`, `scheduleImpactCalendarPanel.ts`,
  `scheduleImpactCalendarPanelRuntime.ts`,
  `scheduleImpactCalendarSessionRegistry.ts`, and
  `scheduleImpactCalendarTransport.ts`); moved
  `scheduleImpactCalendarBridge.ts`; moved Explorer helpers/tree/View
  (`semanticDiffExplorerFocus.ts`, `semanticDiffExplorerHostMessageState.ts`,
  `semanticDiffExplorerHostState.ts`, `semanticDiffExplorerKeyboard.ts`,
  `semanticDiffExplorerLocalization.ts`,
  `semanticDiffExplorerThemeMode.ts`, `semanticDiffExplorerTree.tsx`,
  `semanticDiffExplorerTreeData.ts`, `semanticDiffExplorerView.tsx`, and
  `semanticDiffExplorerViewState.ts`); removal of the old
  `semanticDiffExplorer.tsx` and `semanticDiffExplorerEntry.tsx` facades; all
  internal consumers listed in `TASKS.md`; replacement of the old-facade
  identity assertion in `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  with the canonical editor-package App identity assertion while retaining its
  composition and callback coverage; and the focused location assertions in
  `src/test/suite/architectureDependencyRules.test.ts`.
- Consumer/validation delta: canonicalize imports in the calendar App/bridge,
  Explorer App/Contents/Header/TreePanel, bootstrap semantic-diff wiring,
  semantic-diff panel action/type modules, calendar session/transport/bridge
  tests, Explorer component/DOM/theme/projection/messages/Flow/source/report/
  action/panel/registry tests, calendar UI regressions, and `webSmoke.ts`. The
  architecture test must assert the one host subpackage, one browser Explorer
  package, no removed browser folder or stale imports, and the unchanged
  editor webpack entries. Run compile, production and desktop/web builds,
  desktop/web extension-host tests, CSP/output-name guards, qlty, Markdown
  lint, and `git diff --check`.
- Preserved state: Slices 1–5 remain completion-committed and independently
  reviewed with no Findings; their automatic Completion Approval and focused
  commits remain unchanged. Slice 6 plan/replan commit `e51d6def` is also
  complete and its implementation evidence is recorded below.
- SPECS boundary check: the request changes source placement only and leaves
  the Explorer hierarchy, Flow/source/report behavior, public messages,
  application DTOs, schedule semantics, and host lifecycle owners unchanged.
  No normative `SPECS.md` amendment or feature-author decision is required;
  any discovered behavior, contract, or architecture-rule change must return
  to Main for Replanning.
- Planning review: the bounded Slice 6 replan received independent
  `plan-reviewer` `Ready` review with no Findings and was committed at
  `e51d6def`.

## Slice 6 Implementation Evidence

- Status: Complete on 2026-09-15; independent `implementation-reviewer`
  review is `Ready` with no Findings, automatic no-findings Completion Approval
  is recorded, and focused completion commit `c36ee1cf` is complete.
- Changed paths: five Calendar host/session/JSON/transport files moved into
  `presentation/vscode/webview/scheduleImpactCalendar/`; the browser bridge
  moved into `editor/scheduleImpactCalendar/`; ten Explorer browser modules
  moved into `editor/semanticDiffExplorer/`; obsolete browser facades/entry
  removed; listed consumers/tests canonicalized; architecture/location test
  expanded; and selected feature evidence updated.
- Acceptance evidence: one canonical Calendar host package and one canonical
  Explorer browser package are enforced by filesystem assertions; stale flat
  imports and the removed browser folder are absent; webpack still targets the
  editor entries; moved browser modules have no VS Code/Node imports; and the
  canonical component test verifies editor App identity plus existing MUI,
  status/live-region, focus/action callback, and stable-ID behavior. Existing
  Explorer, Calendar, host-session, transport, Flow/source/report, and web
  smoke regressions remain green.
- Validation: direct canonical Explorer/Calendar matrix (`74 passing`),
  architecture/location suite, test compile, production and desktop/web
  development builds, desktop and web extension-host runs, full qlty, Markdown
  lint, and diff check all pass. Existing macOS codesign, web stream-cleanup,
  and webpack-size warnings remain environmental observations.
- Compatibility/readiness: module exports, public messages/actions/DTOs,
  session/transport lifecycle, CSP, `asWebviewUri` paths, bundle filenames,
  desktop/web support, and VS Code compatibility remain unchanged. The
  relocation introduces no user-visible behavior or telemetry change.
- Implementation review: independent `implementation-reviewer` returned
  `Ready` with no Findings. Main recorded automatic no-findings Completion
  Approval under the user's instruction, and focused completion commit
  `c36ee1cf` is complete.

## Slice 7 Replanning Evidence

- Trigger: the user reported that the Semantic Diff Explorer MUI theme is not
  applied and requested the same mechanism used by the other webviews.
  Investigation confirmed that Explorer uses the bespoke DOM/class/
  `matchMedia` listener in
  `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerThemeMode.ts`,
  while `MyAppContextProvider` is the shared resource/context mechanism. The
  Explorer host currently rejects the provider's valid `resource` request
  before custom semantic validation, so the plan adds a narrow generic
  resource pre-dispatch.
- Revised boundary: Slice 7 updates
  `src/presentation/webview/editor/MyContexts.tsx`, the Explorer App/Contents/
  View in `src/presentation/webview/editor/semanticDiffExplorer/`, and the
  Explorer panel request/install/type path to reuse `parseViewerRequest` and
  `postResourceMessage` before the existing semantic validator. It deletes the
  bespoke theme module and replaces its listener tests with shared-context
  integration coverage. The direct View seam keeps explicit test-injected
  theme/language props. No Explorer public union, custom session transport,
  action ID, calendar callback, schedule fact, DTO, or shared resource schema
  changes.
- Validation mapping: context/resource/event-bridge coverage and the focused
  Explorer theme/DOM/component/panel suites prove valid resource delivery,
  palette and locale propagation, loading until resource availability,
  malformed fail-closed behavior, custom message compatibility, and disposal;
  compile, architecture, desktop/web builds, host/smoke checks, quality,
  Markdown lint, and diff checks cover browser safety and packaging.
- Dependency/approval delta: Slice 7 follows completion-committed Slice 6
  `c36ee1cf`; its independent plan-review returned `Ready` with no Findings,
  Human Approval was recorded, and focused plan commit `0b914f48` is complete.
  Implementation is complete and awaits independent implementation review and
  automatic no-findings Completion Approval under the user's standing
  instruction. Feature Exit is deferred until Slice 7 is complete.

## Slice 7 Implementation Evidence

- Implementation date: 2026-09-15. The shared `MyAppContextProvider` accepts
  an optional `scrollType` and preserves the existing `table` default. The
  Explorer entry uses `window`, waits for the validated common resource, and
  derives one MUI theme shell and display language from `isDarkMode` and `lang`.
- The direct View/Contents seam continues to accept explicit theme/language
  values for tests. The bespoke Explorer theme listener/module and test were
  removed. The Explorer host handles valid common `resource` requests with
  `parseViewerRequest` and `postResourceMessage` before custom semantic
  validation, while malformed requests, custom IDs/envelopes, session/action
  behavior, and disposal remain unchanged.
- Evidence covers provider table/window request behavior, dynamic light/dark
  and EN/JA resource updates, resource-gated loading, MUI palette/global
  styles, localized DOM labels, direct View injection, common-resource host
  dispatch, malformed fail-closed behavior, semantic request identity,
  disposal/reopen, and removal of DOM/theme detection from the Explorer
  package.
- Validation completed: focused shared resource/Explorer/Calendar/viewer
  matrix (`87 passing`), architecture/dependency suite (`26 passing`), test
  compile, production and desktop/web development builds, desktop host (exit
  0), web host (WEB-7 through WEB-10 passed), full qlty check (No issues),
  Markdown lint (0 errors), and `git diff --check`. No Slice 7 Completion
  Approval or Feature Exit verdict is asserted here.

## Dependency And Approval Trace

- Slice 1 uses the schedule-semantics predecessor evaluation and the
  structured-output contract. The `schedule-semantics-expansion` predecessor
  owner must provide the additive, evaluation-only carrier for the already
  computed status of `calendar-selection` and
  `closed-day-substitution` decisions, plus both before/after valid-no-runs
  metadata from that same evaluation pass. The domain differ owner must
  preserve the internal `compareScheduleRuns` decision contract while pairing
  duplicate/count-mismatch runs by source identity/date/rule and emitting real
  changed-time rows; the sidecar owner must include source unit identity in
  pairing, resolve those actual `runChanges` references, exclude ambiguous
  candidate-root issues, and reconcile root-scope one-sided references
  without synthetic cross-side pairs. `SPECS.md` must state the same
  source-unit-identity/date/rule pairing rule while retaining root/side
  semantics and deterministic duplicate handling. This additive
  evaluation/differ/sidecar/normative-document delta has a separate plan
  review and Human Approval boundary before implementation. `SemanticDiffResult`,
  reports, JSON version 1, and the public result/report/JSON boundaries remain
  unchanged. The SPECS edit requires an authorized normative-document owner.
- Slice 2 depends on Slice 1 and the completion-committed Explorer session
  contract. It owns command/bootstrap integration, the host-private registry,
  the exact source-text/options adapter contract, and the internal calendar
  child transport without exposing a public action. Its additive
  `BuildSemanticDiffPresentationArtifactsInput` accepts optional
  `options.scheduleComparisonPeriod`; selected values are forwarded unchanged
  to `CompareSemanticDiffInput.options.scheduleComparisonPeriod`, while an
  omitted period omits both `options` and the field. The completion-committed
  Slice 2 contract is consumed by the comparison workflow; it does not depend
  on the workflow or on public calendar Slice 3.
- Slice 3 depends on Slice 2 and completed workflow commit `8e6922f8`. It
  consumes the workflow's valid evaluated-period artifact and owns the public
  action, localized timeline, accessibility, bundle, and durable user
  documentation. No-period opens the ordinary Explorer with unavailable/
  not-requested impact and no calendar action/panel; invalid workflow input
  fails before comparison/artifact/open. Direct adapter invalid-period
  fixtures remain separate evidence for unavailable impact.
- Slice 4 depends on the completion-committed Slice 3 presentation and owns
  only the calendar's browser-safe MUI package decomposition:
  `ScheduleImpactCalendarApp`, `ScheduleImpactCalendarContents`, Header,
  Filters, Sections, Timeline, and the shared bounded-list module under
  `src/presentation/webview/editor/scheduleImpactCalendar/`. It preserves the
  existing sidecar, bridge, model, focus/accessibility helpers, session
  lifecycle, bundle, localization, and all calendar IDs/filters.
- Slice 5 depends on Slice 4 and owns only the Explorer webview's package
  alignment: the new thin `editor/semanticDiffExplorer.tsx` entry, the
  `editor/semanticDiffExplorer/` App/Contents/Header/SummaryCards/
  ExplorerTreePanel modules, compatibility facades in the existing
  `webview/semantic-diff/` modules, and the exact `webpack.config.js` entry
  path update. It preserves the host-state/message bridge, Explorer action
  IDs, hierarchy/row details, source/Flow/report/calendar callbacks,
  localization, keyboard/focus, and bundle output. This structural move stays
  within the `SPECS.md` non-goal boundary and needs no normative amendment.
- Slice 6 depends on Slice 5 and owns only feature-owned package placement:
  the five calendar host/session/transport/JSON files under
  `src/presentation/vscode/webview/scheduleImpactCalendar/`, the browser
  calendar bridge under `src/presentation/webview/editor/scheduleImpactCalendar/`,
  and the ten remaining Explorer browser helpers/tree/View modules under
  `src/presentation/webview/editor/semanticDiffExplorer/`. It updates internal
  consumers and removes only the obsolete browser facades/entry. Shared host
  ViewerFactory/Mediator/Store/mounting, semantic-diff host category packages,
  public exports, bundle filenames, CSP, transport behavior, DTOs, messages,
  actions, lifecycle, and all viewer meaning remain unchanged.
- Slice 7 depends on completion-committed Slice 6 `c36ee1cf` and owns the
  shared `MyAppContextProvider` theme/locale wiring for Explorer plus the
  narrow generic `resource` request pre-dispatch in the existing Explorer
  panel adapter. It reuses `parseViewerRequest` and `postResourceMessage`,
  deletes the bespoke theme listener/module and its tests, and keeps the
  custom Explorer request union, session transport, action IDs, calendar
  callback, and public resource schema unchanged. Its focused context,
  resource, DOM, component, panel, architecture, compile, desktop, and web
  tests are the acceptance evidence.
- Each slice is independently approvable and must pass its scoped validation
  before implementation review and Completion Approval. Human Approval remains
  separate from plan review; no slice is approved by this document.
- The immutable `{ result, summary }` context, existing Explorer transport,
  schedule semantics, report/JSON contracts, package manifest, and compatibility
  floor remain predecessor-owned. Slice 7's generic resource side channel is
  an additive adapter reuse and does not change the custom Explorer transport.
  A change to any predecessor boundary or the shared resource schema requires
  Replanning.

## Feature Exit Evidence

- All six prior slices are complete, independently reviewed `Ready` with no
  Findings, automatically Completion-approved under the user's no-findings
  instruction, and focused-commit complete: Slice 1 `51a8ae4a`, Slice 2
  `b9cee633`, Slice 3 `ffb92f1e`, format-only correction `09148de4`, Slice 4
  `d4344a26`, Slice 5 `f47edeb0`, and Slice 6 `c36ee1cf`.
- Acceptance and validation evidence covers the complete requirement table,
  including the evaluated-period workflow gate, exact sidecar/context
  lifecycle, root and run outcomes, identity candidates, deterministic
  ordering, localization, accessibility, bounded rendering, and preservation
  of existing result/report/JSON, Explorer, Flow, source, telemetry, and
  desktop/web contracts. Slice 7 implementation is complete and awaits
  independent implementation review and Completion Approval.
- Durable propagation is complete for the observable use case, use-case index,
  README, and CHANGELOG. Architecture and glossary updates are not required.
- Roadmap propagation is prepared in `docs/specs/roadmap.md`: remove the
  completed Wave 4 calendar entry while preserving the deferred schedule-
  semantics follow-ups. After explicit Closure Approval, remove only
  `docs/specs/features/schedule-impact-calendar/`; inherited feature folders
  remain preserved.
- Remaining risks: independent review must confirm fail-closed custom
  validation while accepting the generic resource request, resource-gated
  startup, and one production theme boundary across desktop/web. Existing
  macOS codesign, web-stream cleanup, webpack-size, and advisory smell
  findings remain documented compatibility observations.
- Closure recommendation: defer Feature Exit until Slice 7 receives its
  implementation review and completion gates; then rerun independent Feature
  Exit and request the final batch human Closure Approval.
