# Requirements Traceability: Schedule Impact Calendar

<!-- markdownlint-disable MD013 MD060 -->

| Requirement                                                                                                              | `SPECS.md` basis                                                                                          | Slice                           | Test / validation evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CAL-FACTS-001`: consume one immutable comparison snapshot; perform identity and schedule evaluation once                | Requirements: CAL-FACTS-001; Architecture; Acceptance Criteria                                            | Slices 1 and 2                  | `compareSemanticDiffWithArtifacts.test.ts`, `semanticDiffPresentationArtifacts.test.ts`, `buildSemanticDiffPresentationArtifactsAdapter.test.ts`: parsed input, facts union, exact adapter call graph, one-pass spies, public `.result` and context compatibility                                                                                                                                                                                                                                     |
| `CAL-PERIOD-001`: preserve the half-open period and gate the public action on workflow period-bearing context            | Requirements: CAL-PERIOD-001; Exposure Boundary; Acceptance Criteria                                      | Slices 1–3                      | facts-union period cases; Slice 2 omitted-options/selected-period forwarding tests; completed workflow `semanticDiffCommand.test.ts` period picker/forwarding/cancellation coverage; Slice 3 evaluated-artifact enablement and no-period ordinary-Explorer/unavailable behavior; invalid workflow input failure before comparison/open; existing `compareSemanticDiffWithArtifacts.test.ts` direct adapter invalid-period fixture; no timezone or `Date` conversion                                   |
| `CAL-RUNS-001`: retain supported before/after runs and distinguish unchanged, added, removed, and changed-time effects   | Requirements: CAL-RUNS-001; Normative Calendar Data Contract; Acceptance Criteria                         | Slice 1                         | `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and `compareSemanticDiffWithArtifacts.test.ts`: real differ duplicate/count-mismatch changed-time pairing, rule/source-unit grouping, same-pass before/after runs and valid-no-runs metadata, closed root predicate, root/non-root correspondence, rename/move, excluded ambiguous candidates, and shuffled deterministic order                                                    |
| `CAL-CHANGES-001`: preserve exact source-change references and deterministic effect identity                             | Requirements: CAL-CHANGES-001; Stable IDs, Foreign References, And Duplicate Pairing; Acceptance Criteria | Slice 1                         | `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and `compareSemanticDiffWithArtifacts.test.ts`: actual upstream `runChanges` `(id, occurrenceOrdinal)` resolution for duplicate/count-mismatch effects, source-unit isolation, root-scope one-sided refs, allowed same-effect sharing, cross-effect rejection, and stable detail/timeline/rule order                                                                               |
| `CAL-ZERO-001`: distinguish explicit valid no-runs from partial, unsupported, invalid, and uncalculated outcomes         | Requirements: CAL-ZERO-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria             | Slices 1 and 3                  | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: both-side valid-no-runs metadata from one pass; supported/partial plus invalid, `missing-context`, unsupported, and legacy `missing-start-time`→`uncalculated` status matrix; null-side, zero-only, mixed, malformed, and candidate-root exclusion cases                                                                                                                                                                |
| `CAL-UNKNOWN-001`: keep unsupported and uncalculated schedule portions visible with stable evidence                      | Requirements: CAL-UNKNOWN-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria          | Slices 1 and 3                  | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: carried status applies only to calendar-selection/closed-day-substitution; corrected missing-context fixture; issue-kind ordinal grouping, issue-code/detail preservation, side/root references, uncalculated section, no prose inference                                                                                                                                                                               |
| `CAL-PRESENT-001`: provide a deterministic date-grouped linear timeline with keyboard and screen-reader semantics        | Requirements: CAL-PRESENT-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 3, 4, 11, 12, 13, 14, and 15 | projection/view tests, extracted MUI component behavior, shared result primitives, one-row key/value alignment, comparison layout, internal-ID presentation policy, shared opaque surfaces, anchored filter menus, keyboard and focus recovery, live-region announcements, desktop/web and reflow checks |
| `CAL-FILTER-001`: keep root, root-outcome, and run-state filtering separate and conjunctive                              | Requirements: CAL-FILTER-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria           | Slices 3 and 4                  | independent selector and no-match cases; extracted MUI filter controls; global versus visible totals; unchanged source facts and order                                                                                                                                                                                                                                                                                                                                                                |
| `CAL-SESSION-001`: reuse one comparison, isolate child lifecycle, and keep the sidecar host-private                      | Requirements: CAL-SESSION-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 2 and 3                  | registry identity, exact-once Explorer open, atomic rollback, parent-only release, child reopen, stale/late work, closed envelopes; completed workflow `semanticDiffCommand.test.ts`/`semanticDiffCommandScheduleImpact.test.ts` handoff guards; Slice 3 `semanticDiffExplorerRegistry.test.ts`/`semanticDiffExplorerPanel.test.ts` compatible action registration/validation, private callback dispatch, exact-context sidecar resolution, and child-panel lifecycle tests                           |
| `CAL-A11Y-001`: expose textual state and preserve desktop/web accessibility                                              | Requirements: CAL-A11Y-001; Display Language And Compatibility; Acceptance Criteria                       | Slices 3, 4, 11, 12, 13, 14, and 15 | accessibility and localization tests for names, paths, target values, internal-ID omission from rows, accessible names, `aria-label`, and live announcements, keyboard selection/focus, one-row `<dl>/<dt>/<dd>` label/value semantics, shared semantic headings/label-value/status/empty/comparison roles, MUI filter/listbox roles, high contrast, zoom, reduced motion, responsive wrapping, and fallback language |
| `CAL-SCALE-001`: bound rendering and enforce the inclusive 8 MiB encoded-message limit without loss                      | Requirements: CAL-SCALE-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria      | Slices 1–4, 11, 12, and 13      | exact/over-limit message tests, no partial state, deterministic large-result projection, shared-card wrapping, one-row long-value bounds, comparison long-value bounds, extracted virtualization and DOM-size checks                                                                                                                                                                                                                                                                                  |
| `CAL-PRIVACY-001`: keep content, paths, run lists, and host handles out of telemetry and transport                       | Requirements: CAL-PRIVACY-001; Impact Analysis; Non-Goals                                                 | Slices 1–3                      | DTO/message inspection, telemetry guard, architecture and desktop/web checks                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Architecture and compatibility boundaries remain unchanged                                                               | Architecture; Compatibility; Breaking Change Analysis                                                     | Slices 1–15                     | path-scoped review, architecture checks, manifest/output-bundle guard, existing report/JSON/Explorer/Flow/source regressions, MUI component/package checks, host/browser location guard, shared-resource/context checks, placement-policy/import inventory, Presentation-report/VS Code-report package guard, shared result and comparison import guard, browser-safe detail helper guard, internal-ID presentation review, shared MUI surface/filter import guard, quality checks |
| Presentation package organization remains aligned with table/Flow webviews without changing behavior                     | Architecture; Compatibility; Acceptance Criteria                                                          | Slices 4–12 and 15              | calendar/Explorer component-boundary tests, host/browser package-location/import assertions, shared `MyAppContextProvider`/resource tests, Semantic Diff category/facade guards, Presentation-report/VS Code-report ownership checks, thin-browser-entry checks, shared result/comparison import guard, shared MUI surface/filter import guard, existing calendar suites, Explorer DOM/theme/projection/messages/Flow/source/report/action suites, desktop/web builds, MUI role/label/focus/reflow checks |
| Explorer theme and locale use the canonical viewer resource mechanism                                                    | Compatibility; Acceptance Criteria                                                                        | Slice 7                         | `MyContexts` provider/resource integration, `viewerHostMessages`/`viewerEventBridge` parser coverage, Explorer DOM/component theme and locale fixtures, `semanticDiffExplorerPanel.test.ts` common-resource pre-dispatch and malformed-request coverage, desktop/web host checks                                                                                                                                                                                                                      |
| Calendar theme and locale use the canonical viewer resource mechanism                                                    | Compatibility; Acceptance Criteria                                                                        | Slice 8                         | Calendar provider/resource integration, shared viewer parser/event-bridge coverage, Calendar DOM/component palette and locale fixtures, `scheduleImpactCalendarPanelRuntime.test.ts` common-resource pre-dispatch and malformed-request coverage, desktop/web host checks                                                                                                                                                                                                                             |
| Explorer and Calendar use one readable, accessible result-presentation vocabulary                                        | CAL-PRESENT-001; CAL-A11Y-001; Acceptance Criteria                                                        | Slice 11                        | `sharedResultPresentation.test.tsx`, Explorer component/DOM/theme suites, Calendar component/view/accessibility/theme suites, architecture shared-import guard, compile/build/desktop/web host, large/malformed-value and reflow checks                                                                                                                                                                                                                                                               |
| User-visible result readability is recorded in the Unreleased changelog                                                  | CHANGELOG Impact; CAL-PRESENT-001; Acceptance Criteria                                                    | Slice 11                        | `CHANGELOG.md` exact Unreleased entry naming the shared Explorer/Calendar readability improvement; Markdown lint, diff check, and review proving no unrelated changelog edits                                                                                                                                                                                                                                                                                                                         |
| Explorer and Calendar use one localized range formatter and before/after comparison layout                               | CAL-PRESENT-001; CAL-A11Y-001; Acceptance Criteria                                                        | Slice 12                        | `formatLocalizedDateRange.ts`, `ResultComparison.tsx`, shared result tests, Calendar component/view/accessibility/localization suites, Explorer component/DOM suites, architecture guard, compile/build/desktop/web host, long-value and responsive-order checks                                                                                                                                                                                                                                      |
| The Slice 12 visible range/comparison improvement is recorded in the Unreleased changelog                                | CHANGELOG Impact; CAL-PRESENT-001; Acceptance Criteria                                                    | Slice 12                        | `CHANGELOG.md` one concise additional Unreleased entry for localized ranges and before/after comparison; Markdown lint, diff check, and review proving no unrelated changelog edits                                                                                                                                                                                                                                                                                                                   |
| Explorer and Calendar key/value details use one aligned row per item, and Slice 11/12 smell regressions are removed      | CAL-PRESENT-001; CAL-A11Y-001; Architecture; Acceptance Criteria                                          | Slice 13                        | `ResultKeyValueList.tsx`, browser-safe Explorer detail helper, shared/Calendar/Explorer row and comparison tests, architecture guard, qlty baseline diff proving no new target findings and no suppression/config change, compile/build/desktop/web host, Markdown lint, and diff check                                                                                                                                                                                                               |
| The Slice 13 one-row readability improvement is recorded in the Unreleased changelog                                     | CHANGELOG Impact; CAL-PRESENT-001; Acceptance Criteria                                                    | Slice 13                        | `CHANGELOG.md` one concise additional Unreleased entry for aligned per-item result rows; Markdown lint, diff check, and review proving no unrelated changelog edits                                                                                                                                                                                                                                                                                                                                   |
| Calendar omits internal identifiers from user-facing result details while preserving AJS names, paths, and target values | CAL-PRESENT-001; CAL-A11Y-001; Compatibility; Acceptance Criteria                                         | Slice 14                        | Calendar Sections/Timeline/Model presentation and English/Japanese label updates; component/view/accessibility/localization/projection assertions prove no stable sidecar, run, candidate, issue, decision, unit, or source-reference IDs appear in rows, accessible names, `aria-label`, or live announcements while data attributes, focus keys, DTOs, and target IDs remain; keyboard selection and candidate semantic labels; compile/build/host, qlty smell delta, Markdown lint, and diff check |
| The Slice 14 internal-ID presentation cleanup is recorded in the Unreleased changelog                                    | CHANGELOG Impact; CAL-PRESENT-001; Acceptance Criteria                                                    | Slice 14                        | `CHANGELOG.md` one concise entry if implementation is approved; Markdown lint, diff check, and review proving no unrelated changelog edits                                                                                                                                                                                                                                                                                                                                                            |
| Explorer and Calendar share readable MUI surfaces and filter controls across themes and viewport sizes                     | CAL-PRESENT-001; CAL-A11Y-001; Compatibility; Acceptance Criteria                                         | Slice 15                        | Shared sticky/panel surface and `ViewerFilterSelect` coverage; Explorer header/tree and Calendar header/filter component, DOM, theme-context, accessibility, and shared-select tests; light/dark/forced-colors, long-label, narrow-viewport, focus/keyboard, no-overflow, desktop/web, compile/build, qlty, Markdown lint, and diff checks |
| Slice 15's user-visible MUI consistency improvement is recorded in the Unreleased changelog                               | CHANGELOG Impact; CAL-PRESENT-001; Acceptance Criteria                                                    | Slice 15                        | `CHANGELOG.md` one concise Unreleased entry for opaque sticky surfaces, anchored filter menus, localized headings, and responsive wrapping; Markdown lint, diff check, and review proving no unrelated changelog edits |
| Durable user documentation is added only when the public view is observable                                              | Durable Documentation Impact; Acceptance Criteria                                                         | Slice 3                         | `uc-present-schedule-impact.md` and index validation; `rtk pnpm run lint:md`; README/CHANGELOG impact review                                                                                                                                                                                                                                                                                                                                                                                          |

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
  remains batched after all eight slices; no approval is asserted here.
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
  Implementation review is `Ready` with no Findings, automatic no-findings
  Completion Approval is recorded, and completion commit `8c555139` is complete.

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
  Markdown lint (0 errors), and `git diff --check`.

## Slice 8 Replanning Evidence

- Trigger: after Slice 7 made Explorer use the shared viewer resource/context
  mechanism, the user reported that the Schedule Impact Calendar still does
  not appear to receive the MUI theme and requested the same common mechanism.
  Investigation confirms Calendar production still owns explicit `themeMode`
  and DOM-language fallback, while its custom panel runtime accepts only
  `ready`/`refresh` and rejects the valid common `resource` request.
- Revised boundary: Slice 8 moves Calendar production to
  `MyAppContextProvider` with `scrollType="window"`, derives MUI mode and
  display language from validated `isDarkMode`/`lang`, and preserves the
  explicit supplied-sidecar View seam. Calendar host runtime reuses
  `parseViewerRequest` and `postResourceMessage` before custom session
  validation. Calendar closed session envelopes, sidecar/schedule DTOs,
  public resource schema, and lifecycle remain unchanged.
- Validation mapping: new Calendar context/theme and panel-runtime tests plus
  existing View/component, shared resource/parser/event-bridge, Calendar
  lifecycle/transport, architecture, compile, desktop, and web checks prove
  resource-gated rendering, palette/locale propagation, fail-closed malformed
  requests, unchanged ready/refresh behavior, and browser/host compatibility.
- Dependency/approval delta: Slice 8 follows completion-committed Slice 7
  `8c555139`; independent `plan-reviewer` returned `Ready for approval` with
  no Findings and no Replanning required, and Human Plan Approval was recorded
  on 2026-09-19 under the user's automatic no-findings instruction. Focused
  plan commit `16f09c72` is complete; implementation review returned `Ready`
  with no Findings, automatic Completion Approval was recorded on 2026-09-19,
  and focused completion commit `fe042fb0` is complete. Slice 9
  placement-policy relocation is independently reviewed and completion-committed
  at `bb8d7305`; the later Slice 10 replan is recorded below, so Feature Exit
  remains deferred.

## Slice 8 Implementation Evidence

- Approved boundary: focused Slice 8 plan commit `16f09c72` authorizes the
  Calendar shared viewer-resource/theme correction. The production Calendar
  App now wraps its inner session/content surface in
  `MyAppContextProvider scrollType="window"`, derives MUI mode and display
  language from validated `isDarkMode`/`lang`, and owns one production theme
  shell using the existing shared theme/global styles.
- The direct `ScheduleImpactCalendarView` retains explicit `language` and
  `themeMode` inputs for supplied-sidecar callers and tests. Production no
  longer reads the document language or uses the removed
  `ScheduleImpactCalendarTheme` wrapper. The Calendar panel runtime routes a
  valid common `resource` request through `parseViewerRequest` and
  `postResourceMessage` before Calendar session validation; malformed common
  requests remain fail-closed, while ready/refresh request IDs, envelopes,
  sidecar, schedule facts, and disposal behavior remain unchanged.
- Tests cover resource-gated loading, the `window` request, light/dark palette
  updates, Japanese and fallback labels, direct View rendering, valid and
  malformed resource dispatch, unchanged ready request identity, and disposed
  panels. Existing Calendar and shared viewer suites remain regression
  coverage.
- Validation completed: direct Calendar/shared-resource matrix (`26 passing`)
  and architecture suite (`26 passing`), `test:compile`, production and
  desktop/web development builds, desktop extension host exit 0, web smoke
  exit 0 with WEB-7 through WEB-10 passed, qlty `No issues`, Markdown lint
  (`37 files, 0 errors`), and `git diff --check`.
- Compatibility impact: no schedule meaning, sidecar/session DTO, public
  resource schema, request/envelope ID, CSP, bundle name, VS Code engine, or
  telemetry behavior changed. The only startup change is the intended wait
  for the shared resource before Calendar production renders.
- Implementation feedback: the common resource dispatch must stay ahead of
  each closed viewer's custom validator when adopting `MyAppContextProvider`;
  preserving the direct View seam keeps focused DOM tests independent of host
  resource delivery.
- Implementation review: independent `implementation-reviewer` returned
  `Ready` with no Findings. Main recorded automatic Completion Approval on
  2026-09-19 under the user's standing no-findings instruction.

## Slice 8 Completion Approval

- Status: Approved
- Approved at: 2026-09-19; approved in the current conversation
- Basis: independent `implementation-reviewer` final verdict `Ready`; Findings
  none. Main applies the user's existing automatic no-findings Completion
  Approval instruction. Final batch human Closure Approval remains pending.
- Approved paths (exact completed diff):
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarPanelRuntime.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`
  - `src/test/suite/scheduleImpactCalendarPanelRuntime.test.ts`
  - `src/test/suite/scheduleImpactCalendarThemeContext.test.tsx`
- Validation: direct Calendar/shared-resource matrix (`26 passing`),
  architecture suite (`26 passing`), test compile, production and desktop/web
  development builds, desktop extension host exit 0, web smoke `WEB-7` through
  `WEB-10`, qlty `No issues`, Markdown lint (`37 files, 0 errors`), and
  `git diff --check` passed.
- Commit status: Complete; focused completed Slice 8 commit `fe042fb0`.
- Next stage: `approval-committer` for the focused Slice 9 plan commit; Feature
  Exit and final batch human Closure Approval remain deferred.

## Slice 9 Replanning Evidence

- Trigger: after Slice 8 completion, the user asked whether the
  `presentation/semantic-diff`, `presentation/vscode/semantic-diff`, Calendar
  host, and browser entrypoint locations follow the Flow/Unit List policy.
  Investigation confirms that the browser entries already use the common
  `webview/editor` thin-bootstrap shape, while the five feature-specific
  Calendar host modules remain under generic `vscode/webview` and three
  Semantic Diff host root files forward into category packages.
- Revised boundary: keep host-neutral output/JSON/Markdown projection under
  `src/presentation/semantic-diff`; move Calendar host modules into
  `src/presentation/vscode/semantic-diff/calendar`; remove the root
  `semanticDiffExplorerPanel.ts`, `semanticDiffExplorerRegistry.ts`, and
  `semanticDiffExplorerFlow.ts` forwarding facades; and canonicalize all
  imports/tests to category owners. Keep the four browser entrypoints under
  `src/presentation/webview/editor`, the generic Flow/Table host infrastructure,
  webpack entry/output names, and every runtime contract unchanged.
- Validation mapping: architecture/location guards prove canonical host and
  browser placement, no stale imports or facades, host-neutral output imports,
  thin bootstrap entries, and browser-safe dependencies. Compile, affected
  Semantic Diff/Calendar/bridge/session/transport suites, web smoke, desktop/
  web builds and hosts, quality, Markdown lint, and diff checks prove behavior
  and packaging parity.
- Dependency/approval delta: Slice 9 follows completion-committed Slice 8
  `fe042fb0`. Independent `plan-reviewer` returned `Ready for approval` with
  no Findings and `Replanning required: No`; Human Plan Approval was recorded
  on 2026-09-19 under the user's automatic no-findings instruction for the
  exact paths recorded in `TASKS.md`. Focused plan commit `65f123ee` is
  complete; implementation review is `Ready` with no Findings, automatic
  Completion Approval is recorded below, and focused completion commit
  `bb8d7305` is complete. Slice 10 plan review and Human Plan Approval are
  recorded below; focused plan commit `0aef43d2`, implementation review,
  automatic Completion Approval, and focused completion commit `0a5cdd31` are
  complete. Feature Exit is ready for final explicit human Closure Approval.

## Slice 9 Plan Review And Human Approval

- Plan-reviewer result: `Ready for approval`; Findings none; Replanning
  required: No.
- Human Plan Approval: Approved on 2026-09-19 in the current conversation under
  the user's standing automatic no-findings slice approval instruction.
- Approved boundary: the exact Calendar host move from
  `src/presentation/vscode/webview/scheduleImpactCalendar/` to
  `src/presentation/vscode/semantic-diff/calendar/`, removal of the three
  Semantic Diff root forwarding facades, canonical import/test updates, and
  architecture/location guards. The browser editor entrypoints, webpack
  entry/output names, host-neutral semantic output, generic Flow/Table host
  infrastructure, and all runtime contracts remain preserved.
- Approved paths: the complete production, moved/deleted host, and affected
  test paths are listed in the Slice 9 Human Approval record in `TASKS.md`;
  no path outside that record is approved. `webpack.config.js` is validation
  evidence only and is not an implementation path.
- Next stage: Completion Approval is recorded below; `approval-committer` owns
  the focused Slice 9 completion commit.

## Slice 9 Implementation Evidence

- Status: Implementation complete on 2026-09-19 under focused plan commit
  `65f123ee`; independent `implementation-reviewer` returned `Ready` with no
  Findings. Automatic Completion Approval is recorded below and focused
  completion commit `bb8d7305` is complete.
- Changed paths: the five Calendar host modules now live only under
  `src/presentation/vscode/semantic-diff/calendar/`; the three root Semantic
  Diff forwarding facades were removed; listed production and test imports were
  canonicalized; and the architecture guard now checks category placement,
  stale paths/facades, host-neutral output imports, and thin browser entries.
  Its TypeScript symbol check rejects actual DOM-library references while
  permitting local identifiers such as `document`. `docs/specs/roadmap.md`
  remains excluded from the implementation diff.
- Acceptance evidence: the old generic Calendar host folder is absent, all
  affected consumers resolve to canonical `panel/`, `flow/`, and `calendar/`
  owners, `src/presentation/semantic-diff` remains free of host/UI imports,
  browser entries retain their thin `bootstrapViewer` shape, and webpack entry
  and output names remain unchanged. DTOs, protocols, sessions, transport, CSP,
  lifecycle, and Flow/Table infrastructure are unchanged.
- Validation evidence: `rtk pnpm run test:compile` passed; the desktop
  extension-host suite exited 0; architecture passed 27 tests; Calendar
  bridge/session/transport focused suites passed 14 tests; the web test bundle
  compiled and extension-host smoke passed `WEB-7` through `WEB-10`; production
  and desktop/web development builds compiled successfully; full qlty completed
  with `qlty check: No issues`; Markdown lint passed for 37 files with 0
  errors; and `git diff --check` passed.
- Compatibility/readiness: the relocation keeps VS Code `^1.75.0`, browser-safe
  entries, bundle names, host-neutral JSON/report/Markdown output, and existing
  Flow/Table behavior. Existing macOS codesign and webpack-size warnings remain
  documented observations.

## Slice 9 Completion Approval

- Status: Approved
- Approved at: 2026-09-19 in the current conversation under the user's
  standing automatic no-findings Completion Approval instruction.
- Basis: independent `implementation-reviewer` final verdict `Ready`; Findings
none. The completed diff matches the reviewed placement/import/facade and
architecture/location guard boundary.
<!-- markdownlint-disable MD013 -->
- Approved paths (exact completed diff):
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarJson.ts` (deleted)
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarPanel.ts` (deleted)
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarPanelRuntime.ts` (deleted)
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarSessionRegistry.ts` (deleted)
  - `src/presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarTransport.ts` (deleted)
  - `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarJson.ts`
  - `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanel.ts`
  - `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanelRuntime.ts`
  - `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarSessionRegistry.ts`
  - `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarTransport.ts`
  - `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts` (deleted)
  - `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts` (deleted)
  - `src/presentation/vscode/semantic-diff/semanticDiffExplorerRegistry.ts` (deleted)
  - `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`
  - `src/bootstrap/extension/semanticDiffWiring.ts`
  - `src/presentation/vscode/commands/semanticDiffCommand.ts`
  - `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`
  - `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelActions.ts`
  - `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarBridge.ts`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `src/test/suite/scheduleImpactCalendarBridge.test.ts`
  - `src/test/suite/scheduleImpactCalendarPanelRuntime.test.ts`
  - `src/test/suite/scheduleImpactCalendarSession.test.ts`
  - `src/test/suite/scheduleImpactCalendarTransport.test.ts`
  - `src/test/suite/semanticDiffCommand.test.ts`
  - `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffExplorerFlow.test.ts`
  - `src/test/suite/semanticDiffExplorerPanel.test.ts`
  - `src/test/suite/semanticDiffExplorerRegistry.test.ts`
  - `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffExplorerSourceAction.test.ts`
  - `src/test/suite/semanticDiffWiring.test.ts`
  - `src/test/suite/webSmoke.ts`
  <!-- markdownlint-enable MD013 -->
- Commit status: Complete; focused completion commit `bb8d7305`.
- Next stage: independent Feature Exit review and final batch human Closure
  Approval.

## Slice 10 Replanning Evidence

- Trigger: after Slice 9 completion, the user requested that the contents of
  `src/presentation/semantic-diff` follow the Flow/Unit List responsibility
  structure. The fourteen-file package currently combines host-neutral
  Markdown/JSON report transformations with a VS Code output-mode chooser and
  output-document aggregation.
- Finding addressed: the earlier application/report destination conflicted
  with `docs/specs/architecture.md:106-113`, which assigns localization,
  Summary/Full/Audit/JSON projections, and mode selection to Presentation. The
  revised report destination stays within Presentation; the durable
  architecture file is unchanged.
- Canonical boundary: move the twelve host-neutral report files into
  `src/presentation/semantic-diff/report/`; keep the VS Code picker and report
  document/action adapters under
  `src/presentation/vscode/semantic-diff/report/`; delete the two obsolete
  `pickSemanticDiffOutputMode.ts` and `presentSemanticDiffOutput.ts` facades;
  and remove only the unused `SemanticDiffExplorerApp` re-exports from
  `src/presentation/webview/editor/semanticDiffExplorer.tsx` while retaining
  its `bootstrapViewer` entry. That browser edit is a future approved
  implementation path; the current replan diff has no runtime entrypoint edit.
- Import and test impact: canonicalize the bootstrap, command, panel, and
  report adapter imports; update the existing report, JSON, Markdown, command,
  document, sample, and architecture suites; and add focused picker tests.
  The architecture guard will enforce Presentation-report host neutrality,
  inward VS Code/report dependencies, absence of the old package/facades, and
  the browser entry's bootstrap-only shape.
- Acceptance and validation: all fourteen legacy files are accounted for as
  twelve Presentation-report moves (with the picker extracted from
  `semanticDiffOutput.ts`) and two facade deletions. Report Markdown/JSON
  bytes, JSON version 1, locale fallback, mode ordering, picker cancellation,
  report document lifecycle, Explorer report actions, browser bootstrap, and
  bundle entry/output names remain unchanged. Compile, affected report/command/
  Explorer suites, architecture/location guards, desktop/web builds and host
  checks, quality, Markdown lint, and `git diff --check` provide evidence.
- Dependency and approval boundary: Slice 10 depends on completion-committed
  Slice 9 `bb8d7305`. It is a Presentation package ownership replan only and
  does not change report semantics, public output APIs, JSON schema, viewer
  protocols, session behavior, webpack configuration, roadmap, or Feature Exit
  closure. Independent plan review returned `Ready for approval` with no
  Findings and `Replanning required: No`; Human Plan Approval was recorded on
  2026-09-19. Focused plan commit `0aef43d2` is complete and the runtime
  implementation is complete; independent implementation review returned
  `Ready` with no Findings and Completion Approval is recorded below.

## Slice 10 Plan Review And Human Approval

- Plan-reviewer result: `Ready for approval`; Findings none; `Replanning
required: No`.
- Human Plan Approval: Approved on 2026-09-19 in the current conversation under
  the user's standing automatic no-findings slice approval instruction.
- Approved boundary: move the twelve host-neutral Semantic Diff report files
  into `src/presentation/semantic-diff/report/`, extract the VS Code picker
  into `src/presentation/vscode/semantic-diff/report/`, delete the two old
  root facades, canonicalize the listed imports/tests/architecture guards, and
  remove the unused browser App re-exports in the approved implementation
  diff. Preserve report bytes, JSON version 1, mode ordering, document
  lifecycle, protocols, bundle names, and the durable Presentation ownership.
- Approved paths: the exact complete path list is recorded in the Slice 10
  Human Approval record in `TASKS.md`; no path outside that record is approved.
  The current replan diff contains only TASKS/TRACEABILITY changes, and
  `docs/specs/architecture.md`, `docs/specs/roadmap.md`, and runtime files are
  unchanged.
- Next stage: Completion Approval is recorded below; `approval-committer` owns
  the focused Slice 10 completion commit.

## Slice 10 Implementation Evidence

- Approved boundary: focused plan commit `0aef43d2` authorizes the
  Presentation-report and VS Code/report package split. Twelve pure
  Markdown/JSON/localization/document-dispatch modules now live under
  `src/presentation/semantic-diff/report/`; the VS Code picker lives under
  `src/presentation/vscode/semantic-diff/report/`; the two obsolete root
  facades are deleted; and the Explorer browser entry retains only its
  `bootstrapViewer(SemanticDiffExplorerApp)` call.
- Traceability paths: the bootstrap, five Semantic Diff command consumers,
  Explorer panel/report adapters, report document adapter, the architecture
  guard, ten affected report/command/projection/document/sample suites, and
  focused `semanticDiffOutputModePicker.test.ts` were updated. The moved
  report modules preserve report bytes, JSON version 1, locale fallback, mode
  order, document lifecycle, and existing application DTO boundaries. The
  mode picker preserves `full`, `summary`, `audit`, `json` ordering and
  cancellation. `docs/specs/roadmap.md` remains outside this slice and its
  pre-existing closure proposal is untouched.
- Acceptance result: architecture checks prove exactly twelve files under the
  Presentation report package, no old facades or stale imports, host-neutral
  report dependencies, inward VS Code/report dependencies, and a
  bootstrap-only Explorer entry. Webpack entry/output names and report/action
  consumers remain unchanged.
- Validation result: `rtk pnpm run test:compile` passed; the architecture suite
  passed 28 tests; the focused picker suite passed 2 tests; production,
  desktop-development, and web-development builds compiled successfully; the
  desktop extension host exited 0; the web extension host exited 0 with
  `WEB-7`–`WEB-10` passing; full qlty completed with `qlty check: No issues`;
  Markdown lint passed for 37 files with 0 errors; and `rtk git diff --check`
  passed. Plain Node/Mocha report loading remains extension-host-only because
  the existing `@resource/i18n/message` webpack alias is unavailable in Node;
  the same report consumers are covered by desktop/web host validation.
- Compatibility and production readiness: this is a package/import relocation
  with no report semantics, DTO, protocol, session, transport, CSP,
  dependency, telemetry, or webpack configuration change. VS Code `^1.75.0`,
  desktop/web entrypoints, and browser-safe Presentation dependencies remain
  preserved. Existing macOS codesign, web-stream cleanup, webpack-size, and
  advisory smell findings remain documented observations.

## Slice 10 Completion Approval

- Status: Approved
- Approved at: 2026-09-19 in the current conversation under the user's
  standing automatic no-findings Completion Approval instruction.
- Basis: independent `implementation-reviewer` final verdict `Ready`; Findings
  none. The completed diff matches the approved Presentation-report/VS
  Code-report package boundary, import inventory, facade removal, architecture
  guard, picker, test, and browser-entry scope.
- Approved paths: the exact complete path list is recorded in the Slice 10
  Completion Approval record in `TASKS.md`, including old/new report files,
  picker, facade deletions, import consumers, tests, architecture guard,
  browser entry, TASKS, and TRACEABILITY. No path outside that record is
  approved. `docs/specs/roadmap.md` is excluded.
- Validation: compile, architecture 28-test, picker 2-test,
  production/desktop/web builds, desktop/web hosts, qlty, Markdown lint, and
  diff checks passed; the existing plain Node/Mocha resource-alias limitation
  remains documented.
- Commit status: Complete; focused Slice 10 completion commit `0a5cdd31`.
- Next stage: independent Feature Exit review and final batch human Closure
  Approval.

## Slice 11 Replanning Evidence

- Trigger: after Slice 10, the user requested a consistent readable result
  presentation for Semantic Diff Explorer and Schedule Impact Calendar because
  the current output is difficult to scan as long strings.
- Investigation: Explorer already composes MUI `SummaryCards`, a status area,
  and a virtualized `ExplorerTreePanel`; Calendar already uses MUI `Paper`,
  `Alert`, `List`, and `Chip` in `ScheduleImpactCalendarSections` and
  `ScheduleImpactCalendarTimeline`. Both still duplicate view-specific
  section/card/label-value/status/empty markup, and Calendar joins important
  identifiers and details with `·`. Both Apps already use the shared
  `MyAppContextProvider`, `createSemanticDiffTheme`, and viewer global styles.
- Canonical package: generic result primitives are planned only under
  `src/presentation/webview/editor/shared/result/`. They accept generic
  labels, status tones, and `ReactNode` values; they contain no schedule or
  semantic-diff formatting and no application/domain/host imports. Existing
  theme/context and focus styles remain the only source of palette and viewer
  behavior.
- Adoption paths: Explorer `SemanticDiffExplorerContents.tsx`, `SummaryCards.tsx`,
  `ExplorerTreePanel.tsx`, and `semanticDiffExplorerTree.tsx`; Calendar
  `ScheduleImpactCalendarContents.tsx`, `ScheduleImpactCalendarHeader.tsx`,
  `ScheduleImpactCalendarSections.tsx`, and
  `ScheduleImpactCalendarTimeline.tsx`. `ScheduleImpactCalendarBoundedList.tsx`
  remains the existing virtualization and keyboard boundary.
- Acceptance mapping: `ResultSection` provides semantic heading/region
  structure; `ResultCard` provides responsive outlined grouping and wrapping;
  `ResultKeyValueList` provides `dl` metadata/detail rows;
  `ResultStatusChip` provides generic theme-aware status tones; and
  `ResultEmptyState` provides localized empty/unavailable/malformed-state
  presentation. Both views retain their labels, ordering, filters, actions,
  announcements, tree/list semantics, and large-result bounds.
- Validation mapping: add `src/test/suite/sharedResultPresentation.test.tsx`;
  extend `semanticDiffExplorerComponents.test.tsx`,
  `semanticDiffExplorerDom.test.tsx`,
  `scheduleImpactCalendarComponents.test.tsx`,
  `scheduleImpactCalendarView.test.tsx`,
  `scheduleImpactCalendarAccessibility.test.tsx`, and the two existing theme
  context suites. Update `architectureDependencyRules.test.ts` to enforce
  presentation-only shared imports and both canonical consumers. Compile,
  production/desktop/web builds, host checks, quality, Markdown lint, and
  diff checks are required after implementation.
- User-visible documentation mapping: the implementation must add exactly one
  concise `Unreleased` bullet to `CHANGELOG.md`: "Improved Semantic Diff
  Explorer and Schedule Impact Calendar result readability with shared MUI
  sections, metadata, status, and empty-state presentation." Review checks
  that the entry is user-facing, contains no internal file names, and introduces
  no unrelated changelog edits.
- Dependency and approval boundary: Slice 11 depends on completion-committed
  Slice 10 `0a5cdd31`. It is a presentation-only readability slice with plan
  commit `56cab973` complete and implementation complete under the approved
  paths. Its plan-reviewer result is `Ready for approval` with no Findings and
  `Replanning required: No`; Human Plan Approval was recorded on 2026-09-20.
  Implementation review returned `Ready` with no Findings, automatic Completion
  Approval is recorded below, and focused completion commit `644161ca` is
  complete. Feature Exit is ready for final explicit human Closure Approval.

## Slice 11 Implementation Evidence

- Status: Implementation complete on 2026-09-20 under focused plan commit
  `56cab973`; implementation review returned `Ready` with no Findings,
  automatic Completion Approval is recorded below, and focused completion
  commit `644161ca` is complete.
- Changed paths: the five browser-safe shared result primitives, the four
  Explorer and four Calendar presentation adapters, the actual focused tests
  and architecture suite, `CHANGELOG.md`, and the Slice 11 task and
  traceability records. The pre-existing dirty roadmap closure proposal is
  outside the approved slice and remains unchanged.
- Acceptance: Explorer and Calendar now share semantic sections, outlined
  result cards, individual localized label/value metadata rows, status chips,
  and localized empty states. Root sides, issues, timeline rule/occurrence
  facts, and Explorer detail fields no longer concatenate semantic fields into
  delimiter-separated prose. Existing labels, facts, DTOs, filters, actions,
  announcements, tree/list semantics, theme/resource context, virtualization,
  keyboard focus, and desktop/web contracts remain owned by their existing
  adapters.
- Focused validation: shared primitives 1 passing; Explorer component/DOM
  suites 17 passing; Calendar component/accessibility/theme suites 4 passing;
  Calendar normal and paired/root-scope view tests 2 passing; Explorer shared
  theme context 2 passing; architecture dependency suite 29 passing. Test
  compilation passed after the final implementation edits.
- Known validation boundary: the large issue-list End-focus assertion reaches
  the same `issue-99` boundary against the pre-Slice 11 HEAD implementation;
  `ScheduleImpactCalendarBoundedList.tsx` is explicitly outside this slice.
  This baseline limitation is reported for independent review rather than
  changed by the result-presentation extraction.
- Final validation: `pnpm run build` passed with the repository's existing
  webpack size warnings; `pnpm run test:compile` and the desktop preparation
  passed, and `pnpm run test:desktop:run` exited 0. The web smoke bundle and
  `pnpm run test:web:run` exited 0 with WEB-7, WEB-8, WEB-9, and WEB-10 passed.
  `pnpm run qlty:check` reported no issues after formatting, Markdown lint
  reported 0 errors across 37 files, and `git diff --check` passed.

## Slice 11 Plan Review And Human Approval

- Plan-reviewer result: `Ready for approval`; Findings none; `Replanning
required: No`.
- Human Plan Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings slice approval instruction.
- Approved scope: shared browser-safe result primitives, the listed Explorer and
Calendar presentation adapters, focused shared/view accessibility/theme and
architecture coverage, and exactly one concise user-facing `Unreleased`
entry in `CHANGELOG.md`. Facts, labels, DTOs, filters, actions, messages,
sessions, common theme/resource handling, virtualization, and desktop/web
behavior remain unchanged.
<!-- markdownlint-disable MD013 -->
- Approved paths (exact Slice 11 plan scope):
  - `src/presentation/webview/editor/shared/result/ResultSection.tsx`
  - `src/presentation/webview/editor/shared/result/ResultCard.tsx`
  - `src/presentation/webview/editor/shared/result/ResultKeyValueList.tsx`
  - `src/presentation/webview/editor/shared/result/ResultStatusChip.tsx`
  - `src/presentation/webview/editor/shared/result/ResultEmptyState.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SummaryCards.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/semanticDiffExplorerThemeContext.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarThemeContext.test.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `CHANGELOG.md` (one exact `Unreleased` readability entry only)
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Next stage: `approval-committer` for the focused Slice 11 completion commit.
  No roadmap edit is included in this approval record.

## Slice 11 Completion Approval

- Status: Approved
- Approved at: 2026-09-20 under the user's standing automatic no-findings
  Completion Approval instruction.
- Basis: independent `implementation-reviewer` final verdict `Ready`; Findings
none. The actual completed diff matches the approved shared result,
Explorer/Calendar presentation, test, architecture, changelog, and feature
documentation boundary.
<!-- markdownlint-disable MD013 -->
- Completed paths (exact actual Slice 11 diff):
  - `CHANGELOG.md`
  - `src/presentation/webview/editor/shared/result/ResultCard.tsx`
  - `src/presentation/webview/editor/shared/result/ResultEmptyState.tsx`
  - `src/presentation/webview/editor/shared/result/ResultKeyValueList.tsx`
  - `src/presentation/webview/editor/shared/result/ResultSection.tsx`
  - `src/presentation/webview/editor/shared/result/ResultStatusChip.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SummaryCards.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Commit status: Complete; focused Slice 11 completion commit `644161ca`.
- Next stage: independent Feature Exit review and final batch human Closure
  Approval. `docs/specs/roadmap.md` remains outside the implementation diff.

## Slice 12 Replanning Evidence

- Trigger: after Slice 11, the user requested a readable localized range
  separator for both views and a left-to-right before/after comparison layout
  for Schedule Impact Calendar, consistent across Semantic Diff Explorer and
  Calendar.
- Investigation: Calendar currently prints its half-open header period with a
  comma-separated range and renders root/no-run/candidate/timeline before and
  after content through independent rows or stacks. Explorer interpolates its
  period detail separately and keeps before/after detail values in a flat
  key/value list. Slice 12 therefore adds one generic browser-safe date-range
  formatter and one shared MUI comparison shell under the existing result
  package, with view-owned labels and mapping retained at each consumer.
- Canonical paths: new
  `src/presentation/webview/editor/shared/result/formatLocalizedDateRange.ts`
  and `ResultComparison.tsx`; Calendar consumers are
  `ScheduleImpactCalendarContents.tsx`, `ScheduleImpactCalendarHeader.tsx`,
  `ScheduleImpactCalendarSections.tsx`, and
  `ScheduleImpactCalendarTimeline.tsx`; Explorer consumers are
  `SemanticDiffExplorerContents.tsx`, `ExplorerTreePanel.tsx`, and
  `semanticDiffExplorerTree.tsx`.
- Display contract: English uses spaces around an en dash and Japanese uses
  `〜`; existing date strings, endpoint order, and Calendar's half-open period
  remain unchanged. The comparison shell places before first/left and after
  second/right at wide widths, then stacks in that order on narrow widths, with
  visible localized side labels, wrapping, semantic grouping, and no new tab
  stops. Existing virtualization, focus, announcements, actions, theme, and
  desktop/web boundaries remain unchanged.
- Planned focused validation covers the formatter and comparison primitive in
  `sharedResultPresentation.test.tsx`, Calendar component/view/accessibility/
  localization suites, Explorer component/DOM suites, the shared-import
  architecture guard, compile/build/desktop/web host checks, responsive order,
  long values, one-sided data, and exact additional `CHANGELOG.md` entry.
- Dependency and approval boundary: Slice 12 depends on completion-committed
  Slice 11 `644161ca`. This is a presentation-only replan whose plan review was
  `Ready for approval` with no Findings and whose Human Plan Approval is
  recorded for the exact paths below. Focused plan commit `b25e38d5` is
  complete; implementation is complete under the approved paths, independent
  implementation review returned `Ready` with no Findings, automatic
  Completion Approval is recorded, and focused completion commit `2fb18daa`
  is complete. Feature Exit was ready for closure before the Slice 13 replan;
  `docs/specs/roadmap.md` remains outside the Slice 12 scope.

## Slice 12 Plan Review And Human Approval

- Plan-reviewer result: `Ready for approval`; Findings none; `Replanning
required: No`.
- Human Plan Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings slice approval instruction.
- Approved boundary: the shared localized date-range formatter and generic
before/after comparison shell, the listed Calendar and Explorer presentation
consumers, focused localization/accessibility/responsive and architecture
coverage, and one additional user-facing `Unreleased` entry in
`CHANGELOG.md`. Raw date values, half-open period semantics, facts, DTOs,
filters, actions, messages, sessions, common theme/resource handling,
virtualization, and desktop/web behavior remain unchanged.
<!-- markdownlint-disable MD013 -->
- Approved paths (exact Slice 12 plan scope):
  - `src/presentation/webview/editor/shared/result/formatLocalizedDateRange.ts`
  - `src/presentation/webview/editor/shared/result/ResultComparison.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `CHANGELOG.md` (one additional exact `Unreleased` entry only)
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Plan gate status: complete; focused Slice 12 plan commit `b25e38d5`.
  Implementation review returned `Ready` with no Findings, Completion
  Approval is recorded below, and focused completion commit `2fb18daa` is
  complete. Next stage was independent Feature Exit review; Slice 13 now
  reopens and defers Feature Exit.

## Slice 12 Implementation Evidence

- Status: Implementation complete on 2026-09-20 under focused plan commit
  `b25e38d5`; independent implementation review returned `Ready` with no
  Findings, and automatic Completion Approval is recorded below. The
  implementation is limited to the approved shared formatter,
  comparison primitive, Calendar/Explorer consumers, focused tests,
  architecture guard, and one `CHANGELOG.md` entry.
- Acceptance evidence: `formatLocalizedDateRange` preserves the raw half-open
  endpoints while using `from – to` for English and `from〜to` for Japanese.
  `ResultComparison` presents localized before/after headings in left-to-right
  order, stacks them in the same order at narrow widths, wraps long values,
  and renders an explicit empty value. Calendar Header, root/no-run/candidate/
  timeline sections, and Explorer detail use the shared formatter/comparison
  presentation without changing facts, DTOs, filters, actions, messages,
  sessions, virtualization, keyboard focus, or resource/theme handling.
- Changed paths: the two new shared result modules; four Calendar consumers;
  three Explorer consumers; shared, Calendar, Explorer, localization, view,
  accessibility, and architecture tests; `CHANGELOG.md`; and the two feature
  evidence documents. `docs/specs/roadmap.md` remains an existing dirty path
  outside this Slice 12 implementation diff.
- Validation evidence: shared result/localization checks pass with 6 tests;
  Explorer component/DOM checks pass with 17 tests; Calendar component,
  accessibility, and view checks pass with 6 tests, including the bounded
  repeated-section case; the architecture suite passes 29 tests; and
  `test:compile` passes. Production `build` and desktop preparation compile
  the Calendar and Explorer bundles; the desktop extension host exits 0 and
  web smoke passes WEB-7 through WEB-10. `qlty:check` reports `No issues`,
  Markdown lint passes 37 files with 0 errors, and `git diff --check` passes.
  Existing macOS codesign, web stream-cleanup, and webpack-size warnings are
  documented observations.
- Compatibility/readiness: no public DTO, protocol, session, transport,
  action, bundle name, VS Code engine, schedule meaning, or theme/resource
  mechanism changed. Existing macOS codesign, web-stream cleanup,
  webpack-size, and advisory smell findings remain compatibility observations.
- Implementation feedback: keeping the comparison shell's visible localized
  headings independent of repeated accessible landmarks avoids duplicate
  landmark names while preserving semantic before/after order for assistive
  technology.
- Review correction evidence: `ResultComparison` now exposes the supplied
  comparison label through the actual `aria-label` while retaining the test
  data attribute. Calendar root/no-run/timeline comparisons and Explorer leaf
  comparisons include stable root, item, or row identities so repeated groups
  remain uniquely named. The responsive grid uses the shared MUI `xs` stacked /
  `md` two-column breakpoint; shared DOM coverage asserts the generated
  `min-width:900px` rule and Calendar/Explorer coverage asserts the unique
  localized labels.

## Slice 12 Completion Approval

- Status: Approved
- Approved at: 2026-09-20 under the user's standing automatic no-findings
  Completion Approval instruction.
- Basis: independent `implementation-reviewer` final verdict `Ready`; Findings
none. The completed diff matches the approved formatter, comparison,
Calendar/Explorer presentation, focused test, architecture, changelog, and
feature-documentation boundary.
<!-- markdownlint-disable MD013 -->
- Completed paths (exact actual Slice 12 diff):
  - `CHANGELOG.md`
  - `src/presentation/webview/editor/shared/result/ResultComparison.tsx`
  - `src/presentation/webview/editor/shared/result/formatLocalizedDateRange.ts`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Commit status: Complete; focused Slice 12 completion commit `2fb18daa`.
- Next stage: Slice 13 plan review and Human Approval; Feature Exit and final
  batch human Closure Approval remain deferred until Slice 13 completes and a
  renewed independent Feature Exit review is performed.

## Slice 13 Replanning Evidence

- Replanning trigger: the user requested that repeated `label value label
value` output become one independent label/value row per item in both the
  Schedule Impact Calendar and Semantic Diff Explorer, including dense nested
  values inside the shared `ResultComparison` sides. The current
  `ResultKeyValueList` uses flex-wrap for dense values and a parent grid whose
  item containers can place adjacent pairs on one visual line.
- Baseline smell inventory: `qlty smells --no-snippets` was captured against
  `origin/main` at Slice 10 commit `0a5cdd31`, Slice 11 commit `644161ca`, and
  Slice 12 commit `2fb18daa`. Slice 11 added findings in
  `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  (function complexity 5) and
  `src/presentation/webview/editor/shared/result/ResultKeyValueList.tsx`
  (function complexity 10). Slice 12 added findings in
  `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  (total complexity 58, `detailItems` complexity 5, `scheduleDetails`
  complexity 9). Calendar host/panel, Calendar model/view, and locale
  duplication findings were already present at the Slice 10 baseline and are
  excluded from this targeted cleanup. No qlty suppression or configuration
  change is part of the replan.
- Proposed response: make every shared key/value item an independent aligned
  grid row while retaining `<dl>/<dt>/<dd>`, wrapping, responsive reflow,
  dense spacing, comparison side order, and focus/source order. Extract the
  Explorer status presentation and move pure detail/comparison builders into
  a browser-safe `semanticDiffExplorerDetails.ts` module so the five new
  Slice 11/12 findings across three modules are removed without changing view
  facts or lifecycle.
- Exact approved paths:
  - `src/presentation/webview/editor/shared/result/ResultKeyValueList.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerDetails.ts`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `CHANGELOG.md` (one additional exact `Unreleased` entry)
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Validation boundary: focused shared/Calendar/Explorer presentation and
  accessibility suites, architecture browser-safe import guard,
  `rtk pnpm run test:compile`, desktop/web production builds and host checks,
  `rtk pnpm run qlty`, qlty smell comparison with the Slice 10 inventory,
  Markdown lint, and `git diff --check`. Acceptance requires no new findings
  in the three targeted modules, with pre-Slice 11 baseline findings
  explicitly preserved and no suppression/config edits.
- Plan review: `Ready for approval`; Findings none; `Replanning required: No`.
- Human Plan Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings slice approval instruction.
- Approval boundary: this is a new presentation and quality slice after the
  completion-committed Slice 12. The exact approved paths above are committed
  through the `approval-committer` plan gate before implementation. Feature
  Exit is reopened and deferred until Slice 13 is implemented, reviewed,
  Completion-approved, and focused-committed.

## Slice 13 Plan Review And Human Approval

- Plan-reviewer result: `Ready for approval`; Findings none; `Replanning
required: No`.
- Human Plan Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings slice approval instruction.
- Approved boundary: the shared one-row key/value layout, named Explorer
composition/detail helper extraction, focused Calendar/Explorer tests,
browser-safe architecture guard, one additional `CHANGELOG.md` entry, and
the two feature evidence documents. DTOs, protocols, host lifecycle,
theme/resource handling, virtualization, qlty configuration, roadmap, and
Feature Exit remain outside the approved implementation scope.
<!-- markdownlint-disable MD013 -->
- Approved paths (exact Slice 13 plan scope):
  - `src/presentation/webview/editor/shared/result/ResultKeyValueList.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerDetails.ts`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `CHANGELOG.md` (one additional exact `Unreleased` entry)
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Plan gate status: reviewed and Human-approved; focused Slice 13 plan commit
  `a314dc54` is complete.
- Next stage: independent Feature Exit review is complete; final batch human
  Closure Approval is the sole remaining gate.

## Slice 13 Implementation Evidence

- Status: Implementation complete on 2026-09-20 under focused plan commit
  `a314dc54`; independent implementation review returned `Ready` with no
  Findings, and Completion Approval is recorded below. The implementation is
  limited to the approved shared row primitive, Explorer status/detail
  extraction, focused tests, architecture guard, `CHANGELOG.md`, and feature
  evidence documents.
- Acceptance evidence: `ResultKeyValueList` keeps normal and dense items in
  independent full-width grid rows while preserving `<dl>/<dt>/<dd>` order,
  long-value wrapping, narrow reflow, and dense spacing as the only density
  difference. Calendar nested source-change details and Explorer summary/tree
  details use the same one-label/one-value row invariant. Explorer status
  presentation is separated from the main composition, and pure detail,
  comparison, localized period, schedule timestamp, constraint, and warning
  builders now live in the browser-safe `semanticDiffExplorerDetails.ts`.
- Quality evidence: the Slice 11/12 target findings are absent from the post-
  change `qlty smells --no-snippets` inventory: ResultKeyValueList complexity,
  SemanticDiffExplorerContents complexity, semanticDiffExplorerTree total
  complexity, `detailItems`, and `scheduleDetails`. Existing Calendar host,
  Calendar model/view, locale duplication, and other Slice 10-baseline findings
  remain unchanged; no qlty suppression or configuration change was made.
- Validation evidence: shared result tests pass 4; Calendar
  component/view/accessibility tests pass 6; Explorer component/DOM tests pass
  17; the architecture suite passes 29; and `test:compile` passes. Production
  and desktop development builds compile successfully, the desktop extension
  host exits 0, and web smoke passes WEB-7 through WEB-10. Final qlty,
  Markdown lint, and diff checks are recorded after the last formatting edit.
- Compatibility/readiness: DTOs, facts, filters, result/report/JSON contracts,
  actions, messages, sessions, transport, theme/resource handling,
  virtualization, focus recovery, bundle names, and desktop/web behavior are
  unchanged. Existing macOS codesign, web stream-cleanup, webpack-size, and
  advisory baseline smell findings remain compatibility observations.
- Implementation feedback: nested key/value lists are validated through the
  direct row children so nested source-change metadata retains its own semantic
  rows without being mistaken for one outer row.

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
- Slice 8 depends on completion-committed Slice 7 `8c555139` and owns only
  Calendar production provider/theme wiring plus generic `resource`
  pre-dispatch in `scheduleImpactCalendarPanelRuntime.ts`. It reuses the
  existing viewer parser and `postResourceMessage`, preserves the closed
  Calendar session validator/envelopes and explicit View test seam, and adds
  no new resource schema or schedule meaning. Its focused Calendar context,
  runtime, DOM, shared-resource, architecture, compile, desktop, and web
  tests are the acceptance evidence.
- Slice 9 depends on completion-committed Slice 8 `fe042fb0` and owns only
  placement of feature-specific host modules, removal of Semantic Diff root
  forwarding facades, canonical import/test updates, and architecture/location
  guards. It preserves host-neutral `presentation/semantic-diff` output,
  browser `webview/editor` entries, generic Flow/Table ViewerFactory lifecycle,
  webpack entry/output names, and all Calendar/Explorer contracts. Its
  architecture, compile, affected regression, desktop, web, and package
  checks are the acceptance evidence.
- Slice 10 depends on completion-committed Slice 9 `bb8d7305` and owns only
  the Presentation-report versus VS Code/report package split, obsolete facade
  deletion, canonical report imports/tests, Presentation-report and VS Code/report
  architecture guards, and the unused browser-entry re-export deletion. It
  preserves report Markdown/JSON bytes, JSON version 1, mode ordering, report
  document lifecycle, Explorer/Calendar protocols, browser bundle names, and
  existing viewer behavior. Its report/document/action, architecture, compile,
  desktop, web, quality, lint, and diff checks are the acceptance evidence.
- Slice 11 depends on completion-committed Slice 10 `0a5cdd31` and owns only
  shared browser-safe result primitives, Explorer/Calendar presentation
  adapters, focused readability/accessibility coverage, and the shared-import
  architecture guard. It preserves localized view mapping, facts, DTOs,
  filters, actions, report/JSON behavior, public messages, host/session
  lifecycle, common theme/resource handling, virtualization, and bundle names.
  Its focused shared/Explorer/Calendar UI suites, accessibility and theme
  suites, architecture guard, compile/build/host, quality, lint, and diff
  checks are the acceptance evidence.
- Slice 12 depends on completion-committed Slice 11 `644161ca` and owns only
  the shared localized date-range formatter, shared before/after comparison
  shell, Calendar/Explorer presentation adoption, focused localization/
  accessibility/responsive coverage, the shared-import architecture guard,
  and one additional user-facing `CHANGELOG.md` entry. It preserves raw date
  values, half-open period semantics, facts, DTOs, filters, actions, messages,
  sessions, common theme/resource handling, virtualization, and bundle names.
  Its plan review was `Ready for approval` with no Findings, Human Plan
  Approval is recorded for the exact paths below, and focused plan commit
  `b25e38d5` is complete. Implementation is complete under the approved paths;
  independent implementation review returned `Ready` with no Findings,
  automatic Completion Approval is recorded, and focused completion commit
  `2fb18daa` is complete.
- Slice 13 depends on completion-committed Slice 12 `2fb18daa` and owns only
  the shared one-row key/value layout, the named browser-safe Explorer detail
  helper extraction, focused Calendar/Explorer readability and accessibility
  coverage, the architecture guard for the new helper, one additional
  user-facing `CHANGELOG.md` entry, and the qlty smell delta validation. It
  preserves Calendar/Explorer facts, DTOs, result/report/JSON contracts,
  filters, actions, messages, sessions, transport, theme/resource handling,
  virtualization, bundle names, and desktop/web behavior. Slice 13 plan review
  is `Ready for approval` with no Findings, Human Plan Approval is recorded on
  2026-09-20, focused plan commit `a314dc54` is complete, and implementation
  is complete under the approved paths. Independent implementation review
  returned `Ready` with no Findings and Completion Approval is recorded below;
  focused completion commit `b8d9a667` is complete.

## Slice 13 Completion Approval

- Implementation-reviewer final verdict: `Ready`; Findings none.
- Completion Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings Completion Approval instruction.
- Completed boundary: the shared one-row key/value presentation, Explorer
status/detail extraction, focused Calendar/Explorer tests, browser-safe
architecture guard, the one additional `CHANGELOG.md` entry, and the two
feature evidence documents. DTOs, protocols, host lifecycle,
theme/resource handling, virtualization, qlty configuration, and roadmap
remain unchanged.
<!-- markdownlint-disable MD013 -->
- Completed paths (exact Slice 13 diff):
  - `src/presentation/webview/editor/shared/result/ResultKeyValueList.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerDetails.ts`
  - `src/test/suite/sharedResultPresentation.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/architectureDependencyRules.test.ts`
  - `CHANGELOG.md`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Completion gate status: implementation review and Completion Approval are
  complete; focused completion commit `b8d9a667` contains the exact completed
  paths above.
- Next stage: independent Feature Exit review is complete; final batch human
  Closure Approval is the sole remaining gate.

## Slice 14 Replanning Evidence

- Replanning trigger: the user questioned whether Schedule Impact Calendar's
  visible `ID` fields are necessary because they appear to be internal
  identifiers and the other views present names and paths instead. This is a
  presentation-only change after completion-committed Slice 13; Feature Exit
  is reopened and deferred.
- Evidence: parser normalization assigns `AjsUnit.id` from `absolutePath`, so
  Calendar's `Source unit ID` duplicates the already visible source path.
  Stable root, timeline, run, candidate, group, and issue IDs plus
  `identityDecisionId` and `sourceChangeRef.id` are sidecar/comparison keys
  used for matching, validation, sorting, focus, DOM attributes, and
  diagnostics. `unitName`, `unitPath`, and issue `targetId` remain user-facing
  facts. Flow, Unit List, and Explorer similarly keep IDs for interaction and
  rendering identity while presenting names/paths.
- Proposed boundary: remove only internal-ID rows and user-facing ID-bearing
  labels from Calendar Sections, Timeline, model-generated accessible names,
  `aria-label` values, and `aria-live` announcements. Replace Timeline
  Enter/Space `labels.selected(itemId)` with localized path/name/target/
  occurrence context or a generic localized selected message, and replace
  candidate before/after bounded-list labels that include `group.id` with
  localized semantic context. Retain sidecar fields, DTOs, filters, model
  keys, data attributes, focus selectors, virtualization, diagnostics, target
  IDs, names, paths, outcomes, and occurrences. Remove unused
  English/Japanese internal-ID labels. No shared/domain/application contract
  changes are required.
- Current qlty inventory: `rtk pnpm run qlty` passes `qlty check`; smells remain
  advisory in Calendar host/panel, panel requests, Calendar App/BoundedList/
  Filters/Sections/Timeline/model, and English/Japanese locale duplication.
  These are existing baseline observations. Slice 14 accepts no new smell
  findings and adds no suppression or quality configuration change.
- Exact proposed paths:
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel.ts`
  - `src/resource/i18n/scheduleImpactCalendar_en.ts`
  - `src/resource/i18n/scheduleImpactCalendar_ja.ts`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/scheduleImpactCalendarProjection.test.ts`
  - `CHANGELOG.md` (one concise `Unreleased` entry if implementation is approved)
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Validation boundary: focused Calendar component/view/accessibility/localization/
  projection tests for absent IDs in rendered rows, accessible names,
  `aria-label` values, live-region announcements, Enter/Space selection,
  keyboard focus recovery, duplicate names, one-sided roots, and candidate
  before/after semantic labels; compile, desktop/web builds and host checks,
  qlty check and smell delta against the Slice 13/origin-main inventory,
  Markdown lint, and `git diff --check`. No implementation or approval is
  recorded here.

## Slice 14 Plan Review And Human Approval

- Plan-reviewer result: `Ready`; Findings none; `Replanning required: No`.
- Human Plan Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings slice approval instruction.
- Approved boundary: Calendar-only presentation removal of internal IDs from
rows, card/comparison labels, accessible names, `aria-label`, and live
announcements; localized semantic keyboard/candidate context; focused
Calendar tests; one planned Unreleased changelog entry; and these feature
documents. DTOs, protocols, model/filter/focus keys, data attributes,
virtualization, schedule meaning, and other views remain unchanged.
<!-- markdownlint-disable MD013 -->
- Approved paths (exact Slice 14 plan scope):
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel.ts`
  - `src/resource/i18n/scheduleImpactCalendar_en.ts`
  - `src/resource/i18n/scheduleImpactCalendar_ja.ts`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/scheduleImpactCalendarProjection.test.ts`
  - `CHANGELOG.md` (one concise `Unreleased` entry if implementation is approved)
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
  <!-- markdownlint-enable MD013 -->
- Plan gate status: reviewed and Human-approved; focused Slice 14 plan commit
  `9a0bd721` is complete. Implementation, independent implementation review,
  and Completion Approval are complete under the approved paths; focused
  completion commit `52ede211` is complete.
- Next stage: independent plan review and Human Approval for Slice 15; its
  implementation and completion gates must precede renewed Feature Exit review
  and final batch human Closure Approval.

## Slice 14 Implementation Evidence

- Status: Implementation complete on 2026-09-20 under focused plan commit
  `9a0bd721`; independent implementation review returned `Ready` with no
  Findings, Completion Approval is recorded below, and focused completion
  commit `52ede211` is complete.
- Changed presentation: Calendar Sections remove internal root, candidate,
  issue, unit, identity-decision, and source-reference rows. Cards and before/
  after comparisons use paths, outcomes, semantic candidate ordinals, issue
  kind/target/occurrence, and localized labels. Timeline details retain side,
  unit name/path, date/time, rule, and occurrence while its accessible model
  labels, `aria-label` values, and Enter/Space live announcements contain no
  internal item/run/root/source-reference IDs. Structured issue detail redacts
  internal relation/source keys at the presentation boundary.
- Preserved contracts: sidecar/DTO fields, model/filter IDs, data attributes,
  DOM focus IDs, virtualization, keyboard focus recovery, target IDs, AJS
  names/paths, schedule outcomes, and occurrence facts are unchanged.
- Changed files are the exact approved Slice 14 paths: Calendar Sections,
  Timeline, model, English/Japanese labels, five focused Calendar suites,
  `CHANGELOG.md`, and these feature documents. Existing `docs/specs/roadmap.md`
  worktree changes are unrelated and remain outside this implementation.
- Direct focused result: Calendar accessibility, components, localization,
  projection, and view suites pass 14 tests. `test:compile` passes.
- Quality result: `qlty check` passes with no issues. `qlty smells --no-snippets`
  retains only the documented pre-existing Calendar/host/panel/model/locale
  advisory inventory; no new finding or suppression/configuration change was
  introduced. Production build, desktop development bundle/compile, and
  desktop host exit 0. Web smoke reports WEB-7, WEB-8, WEB-9, and WEB-10
  passed; its server shutdown emits the existing ECONNRESET/Premature close
  cleanup log. Markdown lint covers 37 files with 0 errors and the whitespace
  diff check passes.

## Slice 14 Completion Approval

- Implementation-reviewer final verdict: `Ready`; Findings none.
- Completion Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings Completion Approval instruction.
- Completed boundary: Calendar-only removal of internal IDs from result rows,
  card/comparison labels, accessible names, `aria-label`, and live
  announcements; localized semantic keyboard/candidate context; focused
  Calendar coverage; the user-facing Unreleased entry; and these feature
  documents. DTOs, protocols, model/filter/focus keys, data attributes,
  virtualization, schedule meaning, and other views remain unchanged.
<!-- markdownlint-disable MD013 -->
- Completed paths (exact Slice 14 diff):
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarSections.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel.ts`
  - `src/resource/i18n/scheduleImpactCalendar_en.ts`
  - `src/resource/i18n/scheduleImpactCalendar_ja.ts`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
  - `src/test/suite/scheduleImpactCalendarProjection.test.ts`
  - `CHANGELOG.md`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
<!-- markdownlint-enable MD013 -->
- Completion gate status: implementation review and Completion Approval are
  complete; focused completion commit `52ede211` contains the exact completed
  paths above.
- Next stage: independent plan review and Human Approval for Slice 15; its
  implementation and completion gates must precede renewed Feature Exit review
  and final batch human Closure Approval.

## Slice 15 Replanning Evidence

- Replanning trigger: after completion-committed Slice 14, the user requested
  a full UI audit of Semantic Diff Explorer and Schedule Impact Calendar for
  transparent/sticky surface bleed, inconsistent trigger/menu/list sizing,
  missing in-menu headings, MUI control consistency, spacing/surface/
  elevation/border/z-index, responsive overflow, long labels, theme modes,
  keyboard/focus, and screen-reader behavior. Feature Exit is reopened and
  deferred while this presentation-only slice completes its implementation
  gates.
- Evidence inventory: Explorer `Header.tsx` uses a transparent sticky AppBar
  and a native filter; Explorer `ExplorerTreePanel.tsx` uses a transparent
  Paper. Calendar's header is opaque but needs the shared surface rule, and
  `ScheduleImpactCalendarFilters.tsx` has three independently sized native
  selects. The contents shells, shared ResultCard/ResultSection/
  ResultComparison/ResultKeyValueList, bounded lists, and Flow/Table surface
  already provide useful MUI baselines; they are regression-audited and only
  edited if a concrete defect in this slice's classes is reproduced. Unit
  Definition's form-control conventions are a reference, not a changed
  dependency.
- Proposed implementation: add browser-safe `ViewerFilterSelect.tsx` with
  MUI FormControl/InputLabel/Select/ListSubheader/MenuItem composition,
  trigger-anchored `autoWidth={false}` menus, viewport-bounded Paper, wrapped
  long labels, and a non-selectable localized heading. Add one theme-aware
  opaque sticky surface style in `muiTheme.ts`, apply it to both headers and
  the Explorer tree Paper, and migrate Explorer's filter plus Calendar's root,
  outcome, and run-state filters. Reuse existing EN/JA field labels,
  announcements, values, option ordering, focus callbacks, and common
  resource/theme context; no custom theme detection or menu positioning.
- Exact proposed paths:
  - `src/presentation/webview/shared/muiTheme.ts`
  - `src/presentation/webview/editor/shared/ViewerFilterSelect.tsx` (new)
  - `src/presentation/webview/editor/semanticDiffExplorer/Header.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarFilters.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarFocus.ts`
  - `src/test/suite/viewerFilterSelect.test.tsx` (new)
  - `src/test/suite/muiTheme.test.ts`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/semanticDiffExplorerThemeContext.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarThemeContext.test.tsx`
  - `CHANGELOG.md`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Acceptance boundary: both sticky headers and the Explorer tree remain
  readable above scrolling content in light, dark, high-contrast, and forced
  colors. Every filter keeps its existing ID, value, order, announcement, and
  focus restoration; each menu is trigger-width anchored, viewport-bounded,
  wraps long EN/JA labels, and starts with a non-selectable localized heading
  excluded from keyboard selection. Narrow layouts have no horizontal
  overflow, and Escape/Enter/Home/End, focus, accessible names, reduced
  motion, result counts, no-match behavior, comparison order, and virtualization
  remain intact. No business facts, DTOs, IDs, data attributes, protocol,
  host lifecycle, or common resource/theme mechanism changes.
- Validation boundary: focused shared-select, Explorer component/DOM/theme,
  Calendar component/view/accessibility/theme, shared-result, architecture,
  compile, production build, desktop/web build and host/smoke checks; light/
  dark/forced-colors, EN/JA, narrow viewport, long/malformed result,
  keyboard/focus/screen-reader checks; qlty and `qlty smells --no-snippets`
  delta against Slice 14/origin-main with no suppression/config change;
  Markdown lint and `git diff --check`.
- Quality delta: this replan adds no runtime or test code. Slice 14's baseline
  `qlty check` passed with only documented advisory smells and no new finding;
  Slice 15 implementation must compare `qlty smells --no-snippets` with that
  baseline and add no suppression or quality configuration.
- Plan review and approval: independent plan review returned `Ready` with
  Findings none and `Replanning required: No`. Human Plan Approval was
  recorded on 2026-09-20 under the user's automatic no-findings instruction.
  The focused plan commit is pending `approval-committer`; implementation is
  not authorized before that commit.
- Dependencies and risks: Slice 15 depends on completion commit `52ede211`.
  NativeSelect-to-MUI-Select changes the DOM/menu implementation, so the
  focused role, heading exclusion, keyboard, and focus tests are required.
  Sticky opaque surfaces may obscure top content or fail forced-colors rules,
  so border/z-index/Canvas assertions are required. Any domain, protocol,
  theme/resource, host, virtualization, unrelated smell, or shared result
  redesign request returns to Main for Replanning. No implementation,
  Completion Approval, or completion commit is recorded here.

## Slice 15 Plan Review And Human Approval

- Plan-reviewer result: `Ready`; Findings none; `Replanning required: No`.
- Human Plan Approval: Approved on 2026-09-20 under the user's standing
  automatic no-findings slice approval instruction.
- Approved boundary: the shared browser-safe MUI surface/filter composition,
  Explorer and Calendar consumers, focused shared/Explorer/Calendar
  theme/responsive/keyboard/accessibility coverage, one Unreleased changelog
  entry, and these feature documents. No business facts, filter semantics,
  DTOs, IDs, protocols, host lifecycle, virtualization, or common resource
  mechanism changes.
- Approved paths (exact Slice 15 plan scope):
  - `src/presentation/webview/shared/muiTheme.ts`
  - `src/presentation/webview/editor/shared/ViewerFilterSelect.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/Header.tsx`
  - `src/presentation/webview/editor/semanticDiffExplorer/ExplorerTreePanel.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarFilters.tsx`
  - `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarFocus.ts`
  - `src/test/suite/viewerFilterSelect.test.tsx`
  - `src/test/suite/muiTheme.test.ts`
  - `src/test/suite/semanticDiffExplorerComponents.test.tsx`
  - `src/test/suite/semanticDiffExplorerDom.test.tsx`
  - `src/test/suite/semanticDiffExplorerThemeContext.test.tsx`
  - `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
  - `src/test/suite/scheduleImpactCalendarView.test.tsx`
  - `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
  - `src/test/suite/scheduleImpactCalendarThemeContext.test.tsx`
  - `CHANGELOG.md`
  - `docs/specs/features/schedule-impact-calendar/TASKS.md`
  - `docs/specs/features/schedule-impact-calendar/TRACEABILITY.md`
- Plan gate status: reviewed and Human-approved; focused plan commit is
  pending `approval-committer`. Next stage is `approval-committer` for the
  exact approved paths above; implementation and completion approval remain
  pending.

## Feature Exit Evidence

- All fourteen predecessor slices are independently reviewed `Ready` with no
  Findings and automatically Completion-approved under the user's no-findings
  instruction. Slice 15 is a reviewed and Human-approved presentation-only
  replan; its focused plan commit is pending `approval-committer`, and its
  implementation, implementation review, Completion Approval, and focused
  completion commit are not recorded.
  Slice 14 is a presentation-only replan whose plan review is `Ready` with no
  Findings and whose Human Plan Approval is recorded; focused
  plan commit `9a0bd721`, implementation, independent implementation review,
  Completion Approval, and focused completion commit `52ede211` are complete.
  Slice 10's plan is independently `Ready` and Human-approved,
  its focused plan commit `0aef43d2` is complete, its implementation review is
  `Ready` with no Findings, and Completion Approval is recorded above. Slices
  1–12 are focused-commit complete:
  Slice 1 `51a8ae4a`, Slice 2
  `b9cee633`, Slice 3 `ffb92f1e`, format-only correction `09148de4`, Slice 4
  `d4344a26`, Slice 5 `f47edeb0`, Slice 6 `c36ee1cf`, Slice 7 `8c555139`,
  Slice 8 `fe042fb0`, Slice 9 `bb8d7305`, Slice 10 `0a5cdd31`, Slice 11
  `644161ca`, Slice 12 `2fb18daa`, Slice 13 `b8d9a667`, and Slice 14
  `52ede211`.
  Slice 11 plan review is `Ready for approval` with no Findings and Human Plan
  Approval is recorded; focused plan commit `56cab973` and implementation are
  complete under the approved paths. Implementation review returned `Ready`
  with no Findings, automatic Completion Approval is recorded, and focused
  completion commit `644161ca` is complete. Slice 12 is implemented in a
  reopened Replanning Mode under focused plan commit `b25e38d5`; its plan review
  is `Ready for approval` with no Findings and Human Plan Approval is recorded.
  Independent implementation review returned `Ready` with no Findings,
  automatic Completion Approval is recorded, and focused completion commit
  `2fb18daa` is complete. Slice 13's plan review is `Ready for approval` with
  no Findings and Human Plan Approval is recorded on 2026-09-20; focused plan
  commit `a314dc54` and implementation are complete under the approved paths.
  Independent implementation review returned `Ready` with no Findings,
  Completion Approval is recorded, and focused completion commit `b8d9a667` is
  complete. Slice 14's internal-ID presentation cleanup is independently
  reviewed `Ready` with no Findings, Completion-approved, and focused
  completion commit `52ede211` is complete. Final batch human Closure Approval
  remains pending.
- Acceptance and validation evidence covers the complete requirement table,
  including the evaluated-period workflow gate, exact sidecar/context
  lifecycle, root and run outcomes, identity candidates, deterministic
  ordering, localization, accessibility, bounded rendering, and preservation
  of existing result/report/JSON, Explorer, Flow, source, telemetry, and
  desktop/web contracts. Slice 7's shared viewer-resource theme/context
  correction and Slice 8's Calendar correction preserve the common Table/Flow
  mechanism. Slice 9 placement/import implementation is complete and its
  independent review and Completion Approval are complete. Slice 10's
  report-package implementation, independent review, Completion Approval, and
  focused completion commit `0a5cdd31` are complete. Slice 11's shared result
  presentation implementation is complete under its approved paths. Slice 12's
  localized range/comparison implementation is complete, reviewed, and
  Completion-approved under focused commit `2fb18daa`. Slice 13's one-row
  result alignment and targeted smell cleanup are implemented under focused
  plan commit `a314dc54`; independent implementation review returned `Ready`
  with no Findings and Completion Approval is recorded. Focused completion
  commit `b8d9a667` is complete.
- Durable propagation is complete for the observable use case, use-case index,
  README, prior CHANGELOG entries, and the Slice 11 readability entry. Slice
  12's additional user-visible entry is applied; Slice 13's one-row readability
  entry is applied and its independent implementation review and Completion
  Approval are recorded. Slice 12's focused completion commit `2fb18daa` and
  Slice 13's focused completion commit `b8d9a667` are complete. Slice 14's
  internal-ID presentation entry is applied. Slice 15's MUI consistency entry
  is planned but not applied. Architecture and glossary updates are not
  required.
- Roadmap propagation remains a deferred closure proposal in
  `docs/specs/roadmap.md`; no Slice 15 implementation or closure propagation
  is recorded here. After Slice 15 completion and explicit Closure Approval,
  remove only `docs/specs/features/schedule-impact-calendar/`; inherited
  feature folders remain preserved.
- Remaining risks: Slice 15's focused plan commit is pending
  `approval-committer`; implementation review, Completion Approval, and
  focused completion commit remain pending.
  Native-select-to-MUI-select behavior and sticky-surface/forced-colors
  regressions are covered by the planned focused tests. Existing macOS
  codesign, web-stream cleanup, webpack-size, and Slice 10-baseline advisory
  smell findings remain compatibility observations.
- Closure recommendation: Defer until Slice 15 is independently reviewed,
  approved, implemented, Completion-approved, and committed, then repeat
  Feature Exit and obtain final explicit human Closure Approval.
