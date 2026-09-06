# Requirements Traceability: Schedule Semantics Qlty Hardening

## Requirement And Slice Coverage

### QH-1 And QH-2: Clear All 65 Blockers

- Slice 1 owns QH-001 through QH-006.
- Slice 2 owns QH-007 through QH-026.
- Slice 3 owns QH-027 through QH-038 and QH-063 through QH-065.
- Slice 4 owns QH-039 through QH-048 and may only prepare the projector
  complexity reduction.
- Slice 5 exclusively owns QH-049 through QH-062, including the final
  projector file-complexity clearance.
- Evidence: repository Markdown lint, direct Markdown lint for the domain-rule
  file omitted by the `lint:md` glob, focused tests, differential smells, and
  a fresh Qlty Cloud result at the exact PR head.

### Baseline And PR Verification

- `68ea29bd` is an intentional user-authored pre-feature baseline that adds
  `qlty:smells` to local quality checks. Preserve it as an ancestor and keep
  its `package.json` change outside this feature's remediation paths.
- The finding annotations refer to PR #315 at source head `23112667`; the
  remediation plan starts from the preserved `68ea29bd` descendant. Record the
  PR base/head and the explicit decision about whether the baseline is already
  included before implementation or push.
- Before pushing, verify the PR base is `main`, `68ea29bd` remains an ancestor,
  and the remediation diff excludes `package.json`. After pushing, verify the
  remote PR head exactly matches the recorded local remediation HEAD. A base,
  head, or ancestry mismatch returns to Main rather than being folded into a
  slice.
- If aggregate Qlty formatting transiently adds the missing final newline to
  `package.json`, restore the exact baseline before staging. Use path-scoped
  checks for the remediation documents so this user-authored formatting detail
  is not silently committed as feature work.

### Plan Review And Human Approval

- Plan-reviewer verdict: Ready; no findings. All five planned behavior-
  preserving slice scopes are approved.
- Human Approval: Approved on 2026-09-06 for the complete reviewed plan. The
  user instructed Main to proceed through feature completion within this
  approved scope.
- Plan-gate commit: `f8823220` (`docs: approve schedule semantics qlty
hardening plan`).
- Approved path union (shared paths listed once):
  - `docs/requirements/domain-rules/interpret-jp1-parameters.md`
  - `src/domain/services/diagnostics/ScheduleDateRules.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarContext.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarIndex.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarSelectors.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleOperationalMonth.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRelativeDate.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCandidateTypes.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`
  - `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
  - `src/test/suite/semanticDiffSchedule.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
- Completion review gates: Slice 1 is Ready with no findings and has Human
  Completion Approval; its completion commit is pending. Slice 2 is Ready
  with no findings and has Completion Approval granted on 2026-09-06 under
  the user's explicit approval of all slices; its completion commit is
  pending. Slice 3 is Ready with no findings and has Completion Approval
  granted on 2026-09-06 under the user's explicit approval of all slices; its
  completion commit is pending. Slice 4 is Ready with no findings and has
  Completion Approval granted on 2026-09-06 under the user's explicit
  approval of all slices; its completion commit is pending. Slice 5 is Ready
  with no findings; its Completion Approval was granted on 2026-09-06 under
  the user's all-slices approval, and its completion commit remains pending.

### QH-3: Preserve Schedule Outcomes

- Slices: 1 through 5.
- Evidence: existing diagnostic, calendar, schedule-rules, and end-to-end
  schedule expectations.

### QH-4: Preserve Architecture And Contracts

- Slices: 2 through 5.
- Evidence: architecture suite, TypeScript compilation, build, and diff review.

### QH-5: Preserve Desktop And Web Results

- Slices: 1 through 5.
- Evidence: desktop tests, web compilation/build, and applicable web tests.

### QH-6: Reconcile Local And Cloud Analysis

- Slice: 5.
- Evidence: local gates plus fresh PR-head `qlty check` success.

## Finding-To-Symbol Traceability

### Slice 1

- QH-001 through QH-005: MD013 at reported domain-rule lines 130, 146, 175,
  202, and 224. Verify with Markdown lint and a wording/link diff.
- QH-006: complexity in `isWeekdayScheduleDateDayToken`. Verify with
  `evaluateScheduleDiagnosticViolations.test.ts`.
- Implementation result: the weekday prefix and occurrence decisions are
  named pure predicates, preserving accepted and rejected boundaries. The
  diagnostic characterization matrix now includes malformed prefixes and an
  impossible month; all five source-reference lines are wrapped with wording
  and link targets unchanged.
- Validation result: `rtk pnpm run test:compile`, the focused diagnostic suite
  (7 passing tests), `rtk git diff --check`, direct Markdown lint for the
  domain-rule file, repository Markdown lint (47 files, 0 errors), and the
  aggregate local Qlty gate passed. The edited diagnostic source is absent
  from the remaining smell report.
- Compatibility result: no parser, message, reason ID, public contract,
  host API, Node built-in, desktop/web entry point, or schedule outcome
  changed. Implementation review is Ready with no findings. Human Completion
  Approval was granted on 2026-09-06 under the user's explicit approval of all
  slices; route next to `approval-committer` for the Slice 1 completion gate.
- Completion paths are exactly the three implementation paths above plus
  `docs/specs/features/schedule-semantics-qlty-hardening/TASKS.md` and
  `docs/specs/features/schedule-semantics-qlty-hardening/TRACEABILITY.md`.
  `package.json` is excluded and later slices remain pending.

### Slice 2

- QH-007 through QH-018: complexity in calendar indexing, hierarchy,
  selectors, context resolution, operational months, classification, and
  relative validity. Verify with `semanticDiffScheduleCalendar.test.ts`.
- QH-019 and QH-020: return count in context resolution and relative validity.
  Verify invalid, missing, cyclic, and relative-date cases.
- QH-021: `boolean-logic` at line 197 in `parseCalendarSelector`.
- QH-022: `boolean-logic` at line 508 in `resolveOperationalMonth`.
- QH-023 and QH-024: `boolean-logic` at lines 631 and 636 in
  `relativeScheduleDateRequiresContext`.
- QH-025: `boolean-logic` at line 683 in
  `isFullyQualifiedRelativeScheduleDate`.
  Verify boundary and malformed-context cases.
- QH-026: calendar-context file complexity. Verify every extracted module with
  differential smells and the complete calendar suite.
- Implementation result: `semanticDiffScheduleCalendarContext.ts` remains a
  compatibility facade while the approved types, bounded hierarchy index,
  selector/classification, operational-month, relative-date, and Gregorian
  date-math responsibilities are isolated in the six approved modules.
  Typed intermediate results preserve selector precedence, evidence order,
  closest-group and `jc` resolution, duplicate/conflict/cycle handling, and
  the public facade exports.
- Validation result: `rtk pnpm run test:compile`; the focused calendar,
  schedule, and schedule-rules suites (53 passing); the architecture suite
  (18 passing); `rtk pnpm run build`; desktop and web preparation builds;
  desktop test run (exit code 0); aggregate local `rtk pnpm run qlty`; and
  differential `qlty smells --upstream main --no-snippets` all completed.
  The retained facade and all six extracted modules are absent from the
  differential smell findings; remaining output is pre-existing work owned by
  later slices.
- Compatibility result: no parser, message, reason ID, application DTO,
  public contract, host API, Node built-in, configuration, or package change
  was made. Domain imports remain browser-safe, index construction remains
  bounded, and the added century-boundary characterization preserves
  Gregorian behavior. Implementation review is Ready with no findings, and
  Completion Approval was granted on 2026-09-06 under the user's explicit
  approval of all slices. The completion commit remains pending; no commit or
  staging was performed.
- Exact current completion paths for Slice 2 are the eight approved
  implementation and test paths listed in its TASKS block plus
  `docs/specs/features/schedule-semantics-qlty-hardening/TASKS.md` and
  `docs/specs/features/schedule-semantics-qlty-hardening/TRACEABILITY.md`.
  `package.json` remains excluded and Slices 3 through 5 remain pending.

### Slice 3

- QH-027: duplicate run-decision union in the differ and schedule-rules
  facade. Verify boundary exports and run comparison.
- QH-028 through QH-033: interpreter complexity in evidence, result, date,
  time, and unsupported handlers. Verify schedule-rules and end-to-end tests.
- QH-034 and QH-035: return count in calendar-independent evidence and date
  interpretation. Verify interpreter boundary scenarios.
- QH-036: nested unsupported-parameter dispatch. Verify token categories and
  rule associations.
- QH-037: parameter count in interpreter `evidence`. Verify IDs, raw order,
  and rule numbers.
- QH-038: interpreter file complexity. Verify every module with differential
  smells and boundary tests.
- QH-063: complexity in `collectScheduleUnit`. Verify schedule collection and
  context integration.
- QH-064 and QH-065: parameter count in `collectScheduleUnit` and
  `collectScheduleSide`. Verify before/after documents and context indexes.

- Implementation result: evidence construction and per-parameter
  interpretation now live in dedicated domain collaborators. Unsupported
  parameter parsing uses keyed handlers, the interpreter facade retains its
  public overload, the differ owns the single run-decision union, and
  collection uses object contexts with a separate calendar-context decision.
  Evidence IDs, raw order, statuses, rule association, canonical sorting, and
  result shapes are unchanged.
- Validation result: `rtk pnpm run test:compile`; focused calendar, schedule,
  and schedule-rules suites (54 passing); architecture suite (18 passing);
  `rtk pnpm run build`; desktop and web preparation builds; desktop test run
  (exit code 0); aggregate local `rtk pnpm run qlty`; and differential smell
  analysis all completed. The assigned QH-027 through QH-038 and QH-063
  through QH-065 findings are absent from the differential output; remaining
  entries are pre-existing findings assigned to later slices.
- Compatibility result: no parser, message, reason ID, application DTO,
  projection algorithm, host API, Node built-in, configuration, or package
  change was made. Domain imports remain browser-safe and document context
  indexing remains bounded. Implementation review is Ready with no findings;
  Completion Approval was granted on 2026-09-06 under the user's explicit
  approval of all slices. No commit or staging was performed.
- Exact changed Slice 3 paths are
  `src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`, this
  `TRACEABILITY.md`, and the feature `TASKS.md`. The approved
  `semanticDiffScheduleDiffer.ts` type boundary and
  `src/test/suite/semanticDiffSchedule.test.ts` were reviewed and validated
  without content changes and were not staged. `package.json` is excluded;
  Slices 4 and 5 remain pending.

### Slice 4

- QH-039 through QH-042: complexity in UTC parsing, Gregorian month length,
  relative candidates, and the date candidate router. Verify Gregorian,
  absolute, and calendar-relative cases.
- QH-043 and QH-044: return count in relative and routed candidates. Verify
  invalid, deferred, and valid-empty results.
- QH-045: `nested-control-flow` at line 181 in `relativeDateCandidates`.
- QH-046: `nested-control-flow` at line 198 in `relativeDateCandidates`.
- QH-047: `nested-control-flow` at line 229 in `relativeDateCandidates`.
- QH-048: `nested-control-flow` at line 245 in `relativeDateCandidates`.
  Verify first/nth/last and classified-day cases. Slice 4 may reduce the
  surrounding date-generation complexity as preparation only; it does not
  own the projector file-complexity finding.

- Implementation result: the projector retains its overloads and final
  substitution/orchestration flow while pure candidate projection is split
  into canonical date math, typed candidate results, absolute Gregorian,
  operational-month, and definition-classified day modules. Existing tests
  and public imports remain unchanged; the two approved schedule test paths
  were reviewed and run without content changes.
- Validation result: `rtk pnpm run test:compile`; focused calendar, schedule,
  and schedule-rules suites (54 passing); architecture suite (18 passing);
  production build; desktop and web preparation builds; desktop test run
  (exit code 0); repository Markdown lint (47 files, 0 errors); direct domain
  rule Markdown lint (0 errors); aggregate local Qlty; and differential
  `rtk pnpm exec qlty smells --upstream main --no-snippets` all completed.
  QH-039 through QH-048 are absent from the differential output. The
  remaining projector findings are QH-049 through QH-062 and remain Slice 5
  scope; unrelated baseline findings remain outside this feature.
- Compatibility result: candidate outputs, order, status distinctions,
  Gregorian and operational-month boundaries, bounded classification scans,
  and host-neutral domain behavior are preserved. No parser, message, reason
  ID, public contract, application, configuration, package, or desktop/web
  entry-point change was made. `package.json` remains excluded.
- Implementation review is Ready with no findings, and Completion Approval
  was granted on 2026-09-06 under the user's explicit approval of all slices.
  The exact changed Slice 4 production paths are
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleCandidateTypes.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts`,
  and
  `src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts`.
  The approved `semanticDiffScheduleCalendar.test.ts` and
  `semanticDiffScheduleRules.test.ts` paths were run without content changes.
  The SDD evidence paths are this `TRACEABILITY.md` and `TASKS.md`; no commit
  or staging was performed. Route to `approval-committer` for the completion
  gate. Slice 5 remains pending.

### Slice 5

- QH-050 through QH-053: complexity in substitution resolution, substitution
  analysis, completeness, and final projection.
- QH-054 through QH-057: return count in the same four functions.
- QH-058: `nested-control-flow` at line 503 in
  `resolveSubstitutedCandidates`.
- QH-059: `nested-control-flow` at line 512 in
  `resolveSubstitutedCandidates`.
- QH-060: `nested-control-flow` at line 523 in
  `resolveSubstitutedCandidates`.
- QH-061: `nested-control-flow` at line 533 in
  `resolveSubstitutedCandidates`.
- QH-062: planned `nested-control-flow` at line 1191 in
  `projectScheduleRuns`.
- Verify these findings with substitution, status, shift, period-crossing,
  unresolved-rule, and end-to-end schedule scenarios.

- Implementation result: the projector facade now delegates typed substitution
  association/state analysis, bounded candidate resolution, per-rule date
  projection, and final summary calculation to the approved collaborators.
  The overloads, candidate order and bounds, short-circuit behavior, status
  distinctions, raw evidence order, duplicate/conflict handling, unresolved
  whole-rule blocking, and 31-day lookaround remain unchanged. Malformed `shd`
  state keeps the baseline rule-number evidence ID for explicit prefixes and
  the raw-value evidence ID only when the prefix is absent.
- Validation result: `rtk pnpm run test:compile`; direct focused schedule,
  calendar, schedule-rules, diagnostics, and architecture suites passed with
  80 tests, and the desktop runner exited with code 0. Production build and
  desktop/web preparation builds passed. The unprivileged web runner stopped
  before Chromium startup with the known macOS `bootstrap_check_in ...
Permission denied`; the same runner under the required host permission
  exited with code 0 after its existing `EPIPE`/`Premature close` logs. `rtk
pnpm run qlty` passed formatting and `qlty:check`; differential `qlty smells
--upstream main --no-snippets` contains no Slice 5 module or QH-049 through
  QH-062 finding. QH-001 through QH-065 are absent locally. Its only six
  remaining entries are excluded pre-existing baseline smells outside this
  feature: `unsupportedScheduleMessage` and `toScheduleRunChange` in
  `compareScheduleDiff.ts`, `createFingerprintMatchChanges` and
  `createRelationChanges` in `compareSemanticDiff.ts`, `toUtcDate` in
  `semanticDiffScheduleRules.ts`, and `matchFingerprintUnits` in
  `semanticDiffStructuralRules.ts`.
- Compatibility result: only the four approved domain collaborator paths were
  changed, plus the approved calendar schedule regression path. The other two
  approved schedule test paths were run without content changes. No parser,
  message, reason ID, public DTO, application,
  configuration, package, host API, Node built-in, or desktop/web entry-point
  change was made. Intentional package commits `68ea29bd` and `3008489c` are
  preserved; their `package.json` baseline remains excluded and byte-for-byte
  unchanged.
- Exact current Slice 5 implementation paths are
  `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`,
  plus the approved schedule test paths
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`, and
  `src/test/suite/semanticDiffSchedule.test.ts` (only the calendar path
  changed), and these SDD evidence files.
  Implementation review is Ready with no findings. Completion Approval was
  granted on 2026-09-06 under the user's all-slices approval. The completion
  commit remains pending; route this exact boundary to `approval-committer`.
  No commit or staging was performed.

## Acceptance-Criterion Evidence

- Original blockers are zero: inventory reconciliation, local differential
  smells, and a fresh Cloud status.
- Markdown evidence includes both `rtk pnpm run lint:md` and the direct
  `rtk pnpm exec markdownlint-cli2
docs/requirements/domain-rules/interpret-jp1-parameters.md` check, because
  the repository script omits `docs/requirements/domain-rules/**`.
- No suppression or weakening: diff excludes `.qlty/`, ignores, and baselines;
  `package.json` is also excluded from remediation edits.
- Schedule behavior is unchanged: all four focused regression suites pass
  without changed prior expectations.
- Architecture and compilation pass: architecture suite, TypeScript, and
  production build.
- Desktop and web stay compatible: desktop suite and web evidence pass.
- Public contracts stay unchanged: export, signature, DTO, and schema review.
- Durable claims stay unchanged: README, CHANGELOG, roadmap, and use-case
  no-change review.

## Inventory Reconciliation

- Markdown line length: 5, QH-001 through QH-005.
- Function complexity: 28, QH-006 through QH-018, QH-028 through QH-033,
  QH-039 through QH-042, QH-050 through QH-053, and QH-063.
- Return count: 10, QH-019 through QH-020, QH-034 through QH-035,
  QH-043 through QH-044, and QH-054 through QH-057.
- Nested flow: 10, QH-036, QH-045 through QH-048, and QH-058 through QH-062.
- Boolean expression: 5, QH-021 through QH-025.
- File complexity: 3, QH-026, QH-038, and QH-049.
- Parameter count: 3, QH-037, QH-064, and QH-065.
- Identical code: 1, QH-027.
- Total: 65, QH-001 through QH-065.
