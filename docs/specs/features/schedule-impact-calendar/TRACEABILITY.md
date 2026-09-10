# Requirements Traceability: Schedule Impact Calendar

<!-- markdownlint-disable MD013 MD060 -->

| Requirement                                                                                                            | `SPECS.md` basis                                                                                          | Slice          | Test / validation evidence                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CAL-FACTS-001`: consume one immutable comparison snapshot; perform identity and schedule evaluation once              | Requirements: CAL-FACTS-001; Architecture; Acceptance Criteria                                            | Slices 1 and 2 | `compareSemanticDiffWithArtifacts.test.ts`, `semanticDiffPresentationArtifacts.test.ts`, `buildSemanticDiffPresentationArtifactsAdapter.test.ts`: parsed input, facts union, exact adapter call graph, one-pass spies, public `.result` and context compatibility                                                              |
| `CAL-PERIOD-001`: preserve the half-open period and gate the public action on workflow period-bearing context          | Requirements: CAL-PERIOD-001; Exposure Boundary; Acceptance Criteria                                      | Slices 1–3     | facts-union period cases; Slice 2 omitted-options/selected-period forwarding tests; workflow action-gating tests for absent, invalid, and valid periods; no timezone or `Date` conversion                                                                                                                                      |
| `CAL-RUNS-001`: retain supported before/after runs and distinguish unchanged, added, removed, and changed-time effects | Requirements: CAL-RUNS-001; Normative Calendar Data Contract; Acceptance Criteria                         | Slice 1        | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: same-pass before/after runs and valid-no-runs metadata, closed root predicate, root/non-root correspondence, rename/move, excluded ambiguous candidates, duplicate/count-mismatch and shuffled inputs |
| `CAL-CHANGES-001`: preserve exact source-change references and deterministic effect identity                           | Requirements: CAL-CHANGES-001; Stable IDs, Foreign References, And Duplicate Pairing; Acceptance Criteria | Slice 1        | `semanticDiffScheduleImpact.test.ts`: composite `(id, occurrenceOrdinal)` resolution against upstream `runChanges`, duplicate changed-time/count-mismatch cases, root-scope one-sided refs, allowed same-effect sharing, cross-effect rejection |
| `CAL-ZERO-001`: distinguish explicit valid no-runs from partial, unsupported, invalid, and uncalculated outcomes       | Requirements: CAL-ZERO-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria             | Slices 1 and 3 | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: both-side valid-no-runs metadata from one pass; supported/partial plus invalid, `missing-context`, unsupported, and legacy `missing-start-time`→`uncalculated` status matrix; null-side, zero-only, mixed, malformed, and candidate-root exclusion cases |
| `CAL-UNKNOWN-001`: keep unsupported and uncalculated schedule portions visible with stable evidence                    | Requirements: CAL-UNKNOWN-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria          | Slices 1 and 3 | `semanticDiffScheduleRules.test.ts` and `semanticDiffScheduleImpact.test.ts`: carried status applies only to calendar-selection/closed-day-substitution; corrected missing-context fixture; issue-kind ordinal grouping, issue-code/detail preservation, side/root references, uncalculated section, no prose inference |
| `CAL-PRESENT-001`: provide a deterministic date-grouped linear timeline with keyboard and screen-reader semantics      | Requirements: CAL-PRESENT-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slice 3        | projection/view tests, keyboard and focus recovery, live-region announcements, desktop/web and reflow checks                                                                                                                                                                                                                   |
| `CAL-FILTER-001`: keep root, root-outcome, and run-state filtering separate and conjunctive                            | Requirements: CAL-FILTER-001; Root Outcomes, Timeline, Issues, And Filters; Acceptance Criteria           | Slice 3        | independent selector and no-match cases; global versus visible totals; unchanged source facts and order                                                                                                                                                                                                                        |
| `CAL-SESSION-001`: reuse one comparison, isolate child lifecycle, and keep the sidecar host-private                    | Requirements: CAL-SESSION-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria    | Slices 2 and 3 | registry identity, exact-once Explorer open, atomic rollback, parent-only release, child reopen, stale/late work, closed envelopes                                                                                                                                                                                             |
| `CAL-A11Y-001`: expose textual state and preserve desktop/web accessibility                                            | Requirements: CAL-A11Y-001; Display Language And Compatibility; Acceptance Criteria                       | Slice 3        | accessibility and localization tests for names, focus, announcements, high contrast, zoom, reduced motion, and fallback language                                                                                                                                                                                               |
| `CAL-SCALE-001`: bound rendering and enforce the inclusive 8 MiB encoded-message limit without loss                    | Requirements: CAL-SCALE-001; Host-Private Calendar Session And Closed Transport; Acceptance Criteria      | Slices 1–3     | exact/over-limit message tests, no partial state, deterministic large-result projection, virtualization and DOM-size checks                                                                                                                                                                                                    |
| `CAL-PRIVACY-001`: keep content, paths, run lists, and host handles out of telemetry and transport                     | Requirements: CAL-PRIVACY-001; Impact Analysis; Non-Goals                                                 | Slices 1–3     | DTO/message inspection, telemetry guard, architecture and desktop/web checks                                                                                                                                                                                                                                                   |
| Architecture and compatibility boundaries remain unchanged                                                             | Architecture; Compatibility; Breaking Change Analysis                                                     | Slices 1–3     | path-scoped review, architecture checks, manifest no-change guard, existing report/JSON/Explorer/Flow/source regressions, quality checks                                                                                                                                                                                       |
| Durable user documentation is added only when the public view is observable                                            | Durable Documentation Impact; Acceptance Criteria                                                         | Slice 3        | `uc-present-schedule-impact.md` and index validation; `rtk pnpm run lint:md`; README/CHANGELOG impact review                                                                                                                                                                                                                   |

<!-- markdownlint-enable MD013 MD060 -->

## Dependency And Approval Trace

- Slice 1 uses the schedule-semantics predecessor evaluation and the
  structured-output contract. The `schedule-semantics-expansion` predecessor
  owner must provide the additive, evaluation-only carrier for the already
  computed status of `calendar-selection` and
  `closed-day-substitution` decisions, plus both before/after valid-no-runs
  metadata from that same evaluation pass. The sidecar owner must preserve
  legacy mappings for other reasons, resolve duplicate/count-mismatch
  `runChanges` references, exclude ambiguous candidate-root issues, and
  reconcile root-scope one-sided references without synthetic cross-side
  pairs. A separate predecessor-owner decision and Human Approval are
  required for this latest replan before implementation. `SemanticDiffResult`,
  reports, and JSON version 1 remain unchanged.
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
