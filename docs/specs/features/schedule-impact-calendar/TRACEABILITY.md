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
| `CAL-PRESENT-001`: provide a deterministic date-grouped linear timeline with keyboard and screen-reader semantics      | Requirements: CAL-PRESENT-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slice 3        | projection/view tests, keyboard and focus recovery, live-region announcements, desktop/web and reflow checks                                                                                                                                                                                                                                                                                                                                                                |
| `CAL-FILTER-001`: keep root, root-outcome, and run-state filtering separate and conjunctive                            | Requirements: CAL-FILTER-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria           | Slice 3        | independent selector and no-match cases; global versus visible totals; unchanged source facts and order                                                                                                                                                                                                                                                                                                                                                                     |
| `CAL-SESSION-001`: reuse one comparison, isolate child lifecycle, and keep the sidecar host-private                    | Requirements: CAL-SESSION-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 2 and 3 | registry identity, exact-once Explorer open, atomic rollback, parent-only release, child reopen, stale/late work, closed envelopes; completed workflow `semanticDiffCommand.test.ts`/`semanticDiffCommandScheduleImpact.test.ts` handoff guards; Slice 3 `semanticDiffExplorerRegistry.test.ts`/`semanticDiffExplorerPanel.test.ts` compatible action registration/validation, private callback dispatch, exact-context sidecar resolution, and child-panel lifecycle tests |
| `CAL-A11Y-001`: expose textual state and preserve desktop/web accessibility                                            | Requirements: CAL-A11Y-001; Display Language And Compatibility; Acceptance Criteria                       | Slice 3        | accessibility and localization tests for names, focus, announcements, high contrast, zoom, reduced motion, and fallback language                                                                                                                                                                                                                                                                                                                                            |
| `CAL-SCALE-001`: bound rendering and enforce the inclusive 8 MiB encoded-message limit without loss                    | Requirements: CAL-SCALE-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria      | Slices 1–3     | exact/over-limit message tests, no partial state, deterministic large-result projection, virtualization and DOM-size checks                                                                                                                                                                                                                                                                                                                                                 |
| `CAL-PRIVACY-001`: keep content, paths, run lists, and host handles out of telemetry and transport                     | Requirements: CAL-PRIVACY-001; Impact Analysis; Non-Goals                                                 | Slices 1–3     | DTO/message inspection, telemetry guard, architecture and desktop/web checks                                                                                                                                                                                                                                                                                                                                                                                                |
| Architecture and compatibility boundaries remain unchanged                                                             | Architecture; Compatibility; Breaking Change Analysis                                                     | Slices 1–3     | path-scoped review, architecture checks, manifest no-change guard, existing report/JSON/Explorer/Flow/source regressions, quality checks                                                                                                                                                                                                                                                                                                                                    |
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
  `8e6922f8` remain preserved. Independent implementation review and final
  batch Completion Approval are pending.
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
- Unresolved risk: the independent implementation reviewer must re-check the
  correction pass against the approved acceptance matrix.
- Recommended route: Main routes this corrected diff to the independent
  `implementation-reviewer` for re-review; further Findings return through
  Main to the implementer within the approved Slice 3 paths. Completion
  Approval and commit remain gated.

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
- Each slice is independently approvable and must pass its scoped validation
  before implementation review and Completion Approval. Human Approval remains
  separate from plan review; no slice is approved by this document.
- The immutable `{ result, summary }` context, existing Explorer transport,
  schedule semantics, report/JSON contracts, package manifest, and compatibility
  floor remain predecessor-owned. A change to any of those boundaries requires
  Replanning.
