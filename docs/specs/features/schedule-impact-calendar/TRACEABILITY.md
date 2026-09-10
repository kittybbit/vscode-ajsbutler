# Requirements Traceability: Schedule Impact Calendar

<!-- markdownlint-disable MD013 MD060 -->

| Requirement                                                                                                            | `SPECS.md` basis                                                                                          | Slice          | Test / validation evidence                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CAL-FACTS-001`: consume one immutable comparison snapshot; perform identity and schedule evaluation once              | Requirements: CAL-FACTS-001; Architecture; Acceptance Criteria                                            | Slices 1 and 2 | `compareSemanticDiffWithArtifacts.test.ts`, `semanticDiffPresentationArtifacts.test.ts`, `buildSemanticDiffPresentationArtifactsAdapter.test.ts`: parsed input, facts union, exact adapter call graph, one-pass spies, public `.result` and context compatibility                                                                                                                                                                                  |
| `CAL-PERIOD-001`: preserve the half-open period and gate the public action on workflow period-bearing context          | Requirements: CAL-PERIOD-001; Exposure Boundary; Acceptance Criteria                                      | Slices 1–3     | facts-union period cases; Slice 2 omitted-options/selected-period forwarding tests; workflow action-gating tests for absent, invalid, and valid periods; no timezone or `Date` conversion                                                                                                                                                                                                                                                          |
| `CAL-RUNS-001`: retain supported before/after runs and distinguish unchanged, added, removed, and changed-time effects | Requirements: CAL-RUNS-001; Normative Calendar Data Contract; Acceptance Criteria                         | Slice 1        | `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and `compareSemanticDiffWithArtifacts.test.ts`: real differ duplicate/count-mismatch changed-time pairing, rule/source-unit grouping, same-pass before/after runs and valid-no-runs metadata, closed root predicate, root/non-root correspondence, rename/move, excluded ambiguous candidates, and shuffled deterministic order |
| `CAL-CHANGES-001`: preserve exact source-change references and deterministic effect identity                           | Requirements: CAL-CHANGES-001; Stable IDs, Foreign References, And Duplicate Pairing; Acceptance Criteria | Slice 1        | `semanticDiffScheduleRules.test.ts`, `semanticDiffScheduleImpact.test.ts`, `semanticDiffScheduleCalendar.test.ts`, and `compareSemanticDiffWithArtifacts.test.ts`: actual upstream `runChanges` `(id, occurrenceOrdinal)` resolution for duplicate/count-mismatch effects, source-unit isolation, root-scope one-sided refs, allowed same-effect sharing, cross-effect rejection, and stable detail/timeline/rule order                            |
| `CAL-ZERO-001`: distinguish explicit valid no-runs from partial, unsupported, invalid, and uncalculated outcomes       | Requirements: CAL-ZERO-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria             | Slices 1 and 3 | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: both-side valid-no-runs metadata from one pass; supported/partial plus invalid, `missing-context`, unsupported, and legacy `missing-start-time`→`uncalculated` status matrix; null-side, zero-only, mixed, malformed, and candidate-root exclusion cases                                                                                                             |
| `CAL-UNKNOWN-001`: keep unsupported and uncalculated schedule portions visible with stable evidence                    | Requirements: CAL-UNKNOWN-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria          | Slices 1 and 3 | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: carried status applies only to calendar-selection/closed-day-substitution; corrected missing-context fixture; issue-kind ordinal grouping, issue-code/detail preservation, side/root references, uncalculated section, no prose inference                                                                                                                            |
| `CAL-PRESENT-001`: provide a deterministic date-grouped linear timeline with keyboard and screen-reader semantics      | Requirements: CAL-PRESENT-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slice 3        | projection/view tests, keyboard and focus recovery, live-region announcements, desktop/web and reflow checks                                                                                                                                                                                                                                                                                                                                       |
| `CAL-FILTER-001`: keep root, root-outcome, and run-state filtering separate and conjunctive                            | Requirements: CAL-FILTER-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria           | Slice 3        | independent selector and no-match cases; global versus visible totals; unchanged source facts and order                                                                                                                                                                                                                                                                                                                                            |
| `CAL-SESSION-001`: reuse one comparison, isolate child lifecycle, and keep the sidecar host-private                    | Requirements: CAL-SESSION-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 2 and 3 | registry identity, exact-once Explorer open, atomic rollback, parent-only release, child reopen, stale/late work, closed envelopes                                                                                                                                                                                                                                                                                                                 |
| `CAL-A11Y-001`: expose textual state and preserve desktop/web accessibility                                            | Requirements: CAL-A11Y-001; Display Language And Compatibility; Acceptance Criteria                       | Slice 3        | accessibility and localization tests for names, focus, announcements, high contrast, zoom, reduced motion, and fallback language                                                                                                                                                                                                                                                                                                                   |
| `CAL-SCALE-001`: bound rendering and enforce the inclusive 8 MiB encoded-message limit without loss                    | Requirements: CAL-SCALE-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria      | Slices 1–3     | exact/over-limit message tests, no partial state, deterministic large-result projection, virtualization and DOM-size checks                                                                                                                                                                                                                                                                                                                        |
| `CAL-PRIVACY-001`: keep content, paths, run lists, and host handles out of telemetry and transport                     | Requirements: CAL-PRIVACY-001; Impact Analysis; Non-Goals                                                 | Slices 1–3     | DTO/message inspection, telemetry guard, architecture and desktop/web checks                                                                                                                                                                                                                                                                                                                                                                       |
| Architecture and compatibility boundaries remain unchanged                                                             | Architecture; Compatibility; Breaking Change Analysis                                                     | Slices 1–3     | path-scoped review, architecture checks, manifest no-change guard, existing report/JSON/Explorer/Flow/source regressions, quality checks                                                                                                                                                                                                                                                                                                           |
| Durable user documentation is added only when the public view is observable                                            | Durable Documentation Impact; Acceptance Criteria                                                         | Slice 3        | `uc-present-schedule-impact.md` and index validation; `rtk pnpm run lint:md`; README/CHANGELOG impact review                                                                                                                                                                                                                                                                                                                                       |

<!-- markdownlint-enable MD013 MD060 -->

## Slice 1 Implementation Evidence

- Approved boundary: the third targeted replan is committed in `11615026`;
  Slice 1 implementation is complete in the uncommitted working tree and is
  pending independent implementation review and Completion Approval.
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
  boundary changed. Shared code remains browser-safe and host-neutral. The
  independent implementation-reviewer is the next required route; no
  Completion Approval or completion commit is claimed here.

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
- Slice 3 depends on Slice 2, the completion-committed comparison workflow, and
  a period-bearing context. It owns the public action, localized timeline,
  accessibility, bundle, and durable user documentation.
- Each slice is independently approvable and must pass its scoped validation
  before implementation review and Completion Approval. Human Approval remains
  separate from plan review; no slice is approved by this document.
- The immutable `{ result, summary }` context, existing Explorer transport,
  schedule semantics, report/JSON contracts, package manifest, and compatibility
  floor remain predecessor-owned. A change to any of those boundaries requires
  Replanning.
