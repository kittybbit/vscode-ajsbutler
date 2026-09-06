# Feature Tasks: Schedule Semantics Qlty Hardening

## Agent Brief

- Purpose: clear all 65 blocking PR #315 Qlty findings without behavior change.
- Approved or active slice: none; the complete five-slice plan awaits review.
- Do not: change schedule semantics, public DTOs, outputs, or compatibility.
- Do not: suppress findings, weaken Qlty configuration, or do unrelated cleanup.
- Read first: `SPECS.md`, this file, and the PR #315 Qlty finding inventory.
- Read `TRACEABILITY.md` only when required for the planning decision.
- Validate: local quality and regression gates plus Qlty Cloud differential.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: `approval-committer` plan-gate commit, then Slice 1
  implementation within the approved scope.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness.

## Plan Status

- Status: Approved; plan-gate commit pending
- Planning scope: five ordered behavior-preserving slices covering the exact
  65-item Qlty Cloud finding set reported on PR #315 at `23112667`.
- Review status: Ready; plan-reviewer reported no findings
- Human approval: Approved on 2026-09-06
- Active implementation slice: None

## Intake Boundary

- Feature kind: transient branch feature.
- Selected folder: `schedule-semantics-qlty-hardening`.
- Origin: PR #315 blocking Qlty Cloud review after schedule-semantics closure
  commit `23112667`.
- Working baseline: user-authored commit `68ea29bd` (`fix: run Qlty smells in
local quality checks`) intentionally adds `qlty:smells` to the local quality
  script before this feature. Preserve that commit and treat it as outside
  this feature's remediation scope.
- One-purpose scope: behavior-preserving quality hardening until the 65-item
  differential finding set is clear.
- Overlap decision: use the closed feature as a regression baseline only; do
  not reopen its folder, rewrite its commits, or absorb roadmap features.
- Durable-document decision: only the five reported line wraps are allowed.
  Roadmap, use-case meaning, README, and CHANGELOG remain unchanged. The
  domain-rule file also receives a direct Markdown validation because the
  repository `lint:md` glob does not include it; no lint script or config edit
  is in scope.

## Authoritative Finding Inventory

The Qlty summary at PR head `23112667` reports 65 blockers: 28 function
complexity, 10 return-count, 10 nested-flow, five Markdown line-length, five
boolean-expression, three file-complexity, three parameter-count, and one
identical-code finding. GitHub exposes 49 review comments because several
comments group findings and the annotation stream is capped. The inventory
below reconciles the summary with `qlty smells --upstream main` and assigns
each logical finding exactly once.

### Markdown And Diagnostics: QH-001 Through QH-006

- QH-001 through QH-005: `markdownlint:MD013` at lines 130, 146, 175, 202,
  and 224 of `docs/requirements/domain-rules/interpret-jp1-parameters.md` at
  the reported head. Wrap only the five source-reference lines; preserve link
  targets, wording, and durable rule meaning.
- QH-006: `function-complexity` for
  `isWeekdayScheduleDateDayToken` in
  `src/domain/services/diagnostics/ScheduleDateRules.ts`.

### Calendar Context: QH-007 Through QH-026

- QH-007 through QH-018: `function-complexity` for
  `createScheduleCalendarContextIndex`, `ancestorsOf`, `baseParameter`,
  `parseBaseDay`, `parseCalendarSelector`, `resolveCalendarGroups`,
  `selectionEvidence`, `resolveScheduleCalendarContext`, `baseDayNumber`,
  `resolveOperationalMonth`, `classifyCalendarSelector`, and
  `isSyntacticallyInvalidRelativeScheduleDate`.
- QH-019 and QH-020: `return-statements` for
  `resolveScheduleCalendarContext` and
  `isSyntacticallyInvalidRelativeScheduleDate`.
- QH-021 through QH-025: `boolean-logic` at the authoritative PR #315 lines
  197 (`parseCalendarSelector`), 508 (`resolveOperationalMonth`), 631 and
  636 (`relativeScheduleDateRequiresContext`), and 683
  (`isFullyQualifiedRelativeScheduleDate`) of
  `semanticDiffScheduleCalendarContext.ts`.
- QH-026: `file-complexity` for
  `semanticDiffScheduleCalendarContext.ts` (reported count 184).

### Pipeline Interpretation And Collection: QH-027 Through QH-038

- QH-027: `identical-code` for the 20-line
  `SemanticDiffScheduleRunDecision` union duplicated between
  `semanticDiffScheduleDiffer.ts` and `semanticDiffScheduleRules.ts`.
- QH-028 through QH-033: `function-complexity` for
  `calendarIndependentDateEvidence`, `relativeDateEvidence`, `ruleResult`,
  `interpretScheduleDateRule`, `interpretStartTimeRule`, and
  `interpretedUnsupportedParameter` in
  `semanticDiffScheduleInterpreter.ts`.
- QH-034 and QH-035: `return-statements` for
  `calendarIndependentDateEvidence` and `interpretScheduleDateRule`.
- QH-036: `nested-control-flow` in `interpretedUnsupportedParameter`.
- QH-037: `function-parameters` for `evidence`.
- QH-038: `file-complexity` for
  `semanticDiffScheduleInterpreter.ts` (reported count 79).

### Date Projection: QH-039 Through QH-049

- QH-039 through QH-042: `function-complexity` for `toUtcDate`,
  `daysInGregorianMonth`, `relativeDateCandidates`, and `dateCandidates` in
  `semanticDiffScheduleProjector.ts`.
- QH-043 and QH-044: `return-statements` for `relativeDateCandidates` and
  `dateCandidates`.
- QH-045 through QH-048: `nested-control-flow` at the authoritative PR #315
  lines 181, 198, 229, and 245 inside `relativeDateCandidates`.
- QH-049: `file-complexity` for `semanticDiffScheduleProjector.ts` (reported
  count 437). Slice 4 may reduce its date-generation share as preparation;
  Slice 5 exclusively owns final clearance after removing the remaining
  substitution/orchestration share.

### Substitution And Projection Orchestration: QH-050 Through QH-062

- QH-050 through QH-053: `function-complexity` for
  `resolveSubstitutedCandidates`, `createSubstitutionAnalysis`,
  `statusForRules`, and `projectScheduleRuns`.
- QH-054 through QH-057: `return-statements` for the same four functions.
- QH-058 through QH-062: `nested-control-flow` at the authoritative PR #315
  lines 503, 512, 523, and 533 in `resolveSubstitutedCandidates`, plus the
  planned final-projection line 1191 in `projectScheduleRuns`.

### Schedule Collection Facade: QH-063 Through QH-065

- QH-063: `function-complexity` for `collectScheduleUnit` in
  `semanticDiffScheduleRules.ts`.
- QH-064: `function-parameters` for `collectScheduleUnit`.
- QH-065: `function-parameters` for `collectScheduleSide`.

Inventory arithmetic is 5 Markdown + 28 function complexity + 10 returns +
10 nested-flow + 5 boolean expressions + 3 file complexity + 3 parameter
count + 1 identical-code = 65. The locally reported pre-existing
`unsupportedScheduleMessage`, `createFingerprintMatchChanges`,
`createRelationChanges`, `matchFingerprintUnits`, and schedule-rules
`toUtcDate` findings are not in the PR's 65-item Cloud set and are outside
scope. If Cloud identifies one of them as a new blocker after restructuring,
stop and replan rather than absorb unrelated cleanup.

## Design Constraints

- Preserve the existing exports and import paths of the calendar-context,
  interpreter, projector, differ, and schedule-rules modules; new modules are
  internal collaborators.
- Use object inputs for functions flagged for parameter count. Do not change
  public DTOs or application call signatures.
- Use named predicates, small result constructors, lookup tables, and
  domain-named helpers. Do not replace explicit outcomes with exceptions.
- Extract by domain responsibility so every new file remains below the
  configured file-complexity threshold. Moving an unchanged complex function
  to a new file is not acceptance.
- Preserve rule order, raw-parameter order, evidence IDs, reason codes,
  candidate ordering, first-definition precedence, half-open periods, and the
  distinction among invalid, unsupported, missing-context, supported, and
  no-runs.
- Keep all production changes in `src/domain`; no Node built-ins, host clock,
  locale, timezone, filesystem, network, external calendar, or UI dependency.
- No Qlty configuration, suppression, ignore, baseline, generated artifact,
  public schema, README, CHANGELOG, roadmap, or use-case meaning change.
- `package.json` is explicitly excluded from every remediation slice. Preserve
  the intentional user-authored `68ea29bd` baseline and do not amend, revert,
  or fold its `qlty:smells` change into this feature.

## Baseline And PR Verification

- The finding source is PR #315 at `23112667`; the remediation working base is
  the preserved user-authored `68ea29bd` descendant. These commits have
  different roles and must remain distinguishable in the plan and final diff.
- Before implementation, record the local HEAD and inspect PR #315's base and
  head. Confirm the PR base remains `main`, confirm whether `68ea29bd` is
  already an ancestor of the remote head, and record any explicit decision to
  include it in the eventual push. Do not silently mix the baseline with a
  remediation slice.
- Before each push, verify `68ea29bd` remains an ancestor, the remediation
  diff contains no `package.json`, and the PR base is still `main`. After the
  push, verify the remote PR head exactly equals the recorded local remediation
  HEAD before waiting for Qlty Cloud.
- Qlty's formatter may transiently add the missing final newline to the
  preserved `package.json` during an aggregate local run. Restore the exact
  baseline before staging or recording the remediation diff; never commit that
  formatter-only change. Path-scoped checks may be used to validate the
  remediation documents without treating the baseline as feature work.
- If the PR base/head or baseline ancestry differs from the recorded state,
  stop and route the mismatch to Main for a repository-level decision; do not
  compensate with a slice edit.

## Human Approval

- Status: Approved
- Approved at: 2026-09-06
- Approved scope: the complete reviewed five-slice plan; the user explicitly
  instructed Main to proceed through feature completion within this approved
  scope.
- Approved paths (complete union, with paths shared by slices listed once):
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
- Plan-gate commit: Pending `approval-committer` after this recorded approval.

Implementation may start only after the approved plan package is committed by
`approval-committer`. Each slice's completion approval and implementation
review remain Pending until that slice is implemented and independently
reviewed.

## Completion Approval

- Status: Pending for each slice
- Approved at: none
- Approved scope: none; each slice requires its own independent
  implementation review before completion approval.
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible
- Slice completion gates: all five remain Pending until their corresponding
  implementations are reviewed.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Harden Diagnostic Token Classification And Wrap Sources

- Status: Approved; awaiting plan-gate commit
- Finding coverage: QH-001 through QH-006.
- Scope: replace branching in `isWeekdayScheduleDateDayToken` with small named
  token-shape and occurrence checks while preserving every accepted and
  rejected schedule-date boundary. Wrap only the five reported source lines.
- User / Domain Value: the diagnostic grammar stays compatible while its
  weekday rule and durable references clear the smallest isolated blockers.
- Cohesive Change Group: diagnostic validation and the exact schedule-date
  reference lines that describe the same accepted syntax.
- Acceptance: every existing valid absolute weekday and invalid boundary has
  the same diagnostic outcome and order; all five MD013 findings disappear;
  no other prose or schedule meaning changes.
- Editable Paths:
  - `src/domain/services/diagnostics/ScheduleDateRules.ts`
  - `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`
  - `docs/requirements/domain-rules/interpret-jp1-parameters.md`
- Validation: run the diagnostic regression suite, repository Markdown lint,
  and direct
  `rtk pnpm exec markdownlint-cli2 docs/requirements/domain-rules/interpret-jp1-parameters.md`
  (the `lint:md` glob omits this domain-rule file), plus `rtk pnpm run qlty`
  and differential `qlty smells` for the edited source. Do not change the
  lint script or configuration to include the file.
- Production Readiness: cover malformed prefixes, omitted and numeric
  occurrence limits, `:b`, impossible dates, and diagnostic order. This pure
  domain code remains identical on desktop and web.
- Approval Boundary: only the three editable paths above; tests may add
  characterization cases but must not change prior outcomes.
- Dependencies: none.
- Risks: simplified predicates can accept partial matches or reject a valid
  absolute weekday form.
- Out of Scope: parser grammar, messages/reason IDs, interpretation, Qlty
  configuration, and prose changes beyond line wrapping.

### Slice 2: Decompose Calendar Context Resolution

- Status: Approved; awaiting plan-gate commit
- Finding coverage: QH-007 through QH-026.
- Scope: keep `semanticDiffScheduleCalendarContext.ts` as the compatibility
  facade and extract types, hierarchy indexing, selector parsing and
  classification, operational-month arithmetic, relative-date validity, and
  Gregorian helpers. Replace return-heavy selection with typed intermediate
  results.
- User / Domain Value: calendar-relative and definition-backed open/closed
  schedules retain deterministic context and evidence with maintainable
  failure paths.
- Cohesive Change Group: all context acquisition, operational-month, and day
  classification responsibilities currently coupled in one module.
- Acceptance: exported contracts and results remain compatible; closest-group
  precedence, `jc`, defaults, duplicates, conflicts, missing context, cycles,
  and exact/weekday precedence remain observable-equivalent. Every new and
  retained file is below the file threshold and QH-007 through QH-026 clear.
- Editable Paths:
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarContext.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarTypes.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarIndex.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCalendarSelectors.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleOperationalMonth.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRelativeDate.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
- Validation: run calendar tests including long-document index reuse and
  malformed/cyclic context, schedule-rules integration, architecture and
  desktop suites, web compilation/build, local quality, and differential
  smells on every retained and extracted module.
- Production Readiness: preserve bounded indexing, recoverable invalid
  results, Gregorian arithmetic, and absence of host services. Avoid circular
  runtime imports; re-export public types from the existing facade.
- Approval Boundary: only the eight editable paths above. A required caller,
  public type, application, or configuration change triggers replanning.
- Dependencies: Slice 1 committed; no runtime dependency on it.
- Risks: extraction can reorder evidence, alter ancestor precedence, duplicate
  index construction, or create a runtime import cycle.
- Out of Scope: projection, substitution, new calendar semantics, external
  calendars, DTOs, and application/presentation changes.

### Slice 3: Simplify Interpretation And Collection Boundaries

- Status: Approved; awaiting plan-gate commit
- Finding coverage: QH-027 through QH-038 and QH-063 through QH-065.
- Scope: split evidence construction and per-parameter interpretation from the
  interpreter facade; replace nested parser selection with keyed handlers;
  pass internal collection contexts as objects; extract the context decision
  from `collectScheduleUnit`; and re-export the differ's run-decision type as
  the single definition.
- User / Domain Value: normalized rules enter projection with unchanged
  status, evidence, ordering, and association while pipeline seams are clear.
- Cohesive Change Group: interpretation output and the facade that collects,
  projects, compares, and exposes it.
- Acceptance: `interpretSchedule`, `compareScheduleRuns`,
  `evaluateSemanticDiffSchedule`, and exports keep current signatures and
  shapes; evidence, raw order, first-rule behavior, decisions, and unsupported
  output remain unchanged. Assigned findings clear and modules stay below the
  file threshold.
- Editable Paths:
  - `src/domain/services/semantic-diff/semanticDiffScheduleInterpreter.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleEvidence.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleInterpreter.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/test/suite/semanticDiffSchedule.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
- Validation: run pipeline boundary and end-to-end schedule tests,
  architecture and desktop suites, web compilation/build, local quality, and
  differential smells for all edited and new modules.
- Production Readiness: cover invalid/duplicate parameters, rule-zero `ud`,
  unpaired start time, mixed evidence, canonical paths, deterministic sorting,
  and large collections without repeated index construction.
- Approval Boundary: only the seven editable paths above. No application DTO,
  report, message, use-case, or public model edits.
- Dependencies: Slice 2 committed so collection imports the stable facade.
- Risks: handler maps can lose precedence; type deduplication can alter the
  union; object inputs can change optional document/context behavior.
- Out of Scope: projection algorithms, new semantics, output wording,
  application mappings, and pre-existing non-Cloud smells.

### Slice 4: Decompose Schedule Date Candidate Projection

- Status: Approved; awaiting plan-gate commit
- Finding coverage: QH-039 through QH-048. This slice may prepare the
  projector file for the later file-complexity review, but does not own or
  clear QH-049.
- Scope: move candidate result types, absolute Gregorian candidates,
  operational-month numeric/weekday candidates, and definition-classified
  open/closed scans into separate pure modules. Keep projector overloads and
  delegate through a small candidate router. Reuse Slice 2 date math.
- User / Domain Value: supported absolute and relative dates produce the same
  bounded candidates and explicit invalid/deferred/context outcomes.
- Cohesive Change Group: date parsing and candidate generation before
  substitution or final run construction.
- Acceptance: month-end, leap-year, absolute weekday, operational offset,
  backward, open/closed, and relative weekday outputs are unchanged; missing
  occurrences remain no-runs; invalid and missing context remain distinct.
  QH-039 through QH-048 clear and date modules stay below the file threshold.
  File-complexity reduction is preparation only; QH-049 remains reserved for
  Slice 5 acceptance.
- Editable Paths:
  - `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateMath.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleCandidateTypes.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDateCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleOperationalCandidates.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleClassifiedDayCandidates.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
- Validation: run Gregorian, relative, open/closed, invalid, no-run, half-open
  period, and long-period scenarios; run architecture/desktop suites, web
  compilation/build, local quality, and per-module differential smells.
- Production Readiness: keep scans bounded, avoid clock/locale/timezone,
  preserve leap rules, and avoid repeated date/classification work.
- Approval Boundary: only the eight editable paths above. Substitution-state
  and final-rule orchestration changes are reserved for Slice 5.
- Dependencies: Slice 2 date math/facade and Slice 3 interpretation contracts.
- Risks: dispatch can misclassify a token, change candidate order, or collapse
  invalid, deferred, and valid-empty results.
- Out of Scope: `sh`/`shd`, final status, new date forms, registration context,
  QH-049 final clearance, and public API changes.

### Slice 5: Decompose Substitution And Final Projection

- Status: Approved; awaiting plan-gate commit
- Finding coverage: QH-049 through QH-062; Slice 5 exclusively owns QH-049
  final clearance.
- Scope: separate `sh`/`shd` association and state analysis, bounded candidate
  substitution, per-rule projection, and summary calculation from the overload
  facade. Replace nested loops/conditionals with typed single-candidate and
  single-rule results while preserving short-circuit behavior.
- User / Domain Value: closed-day substitution and final outcomes stay
  deterministic and compatible while all remaining PR blockers clear.
- Cohesive Change Group: post-candidate flow from association through runs,
  rule evidence, completeness, and status.
- Acceptance: `be`, `af`, `ca`, `no`, `shd`, conflicts, invalid values,
  incomplete calendars, `cy`/`cftd`, lookaround, zero-run, partial, supported,
  invalid, missing-context, and unsupported results remain unchanged. Assigned
  findings, including the final QH-049 file-complexity check, clear with no new
  differential smell.
- Editable Paths:
  - `src/domain/services/semantic-diff/semanticDiffScheduleProjector.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionAnalysis.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleSubstitutionProjection.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRuleProjection.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
  - `src/test/suite/semanticDiffSchedule.test.ts`
- Validation: run all schedule and diagnostic suites, architecture/full
  desktop tests, production desktop/web build, applicable web tests, the
  repository Markdown lint plus direct
  `rtk pnpm exec markdownlint-cli2 docs/requirements/domain-rules/interpret-jp1-parameters.md`,
  local quality, and `qlty smells --upstream main`. Confirm all 65 are absent
  before Cloud re-evaluation.
- Production Readiness: preserve 31-day lookaround, first start-time value,
  raw evidence order, duplicates/conflicts, unresolved-whole-rule blocking,
  and host-independent deterministic output.
- Approval Boundary: only the seven editable paths above. Any public contract,
  application, configuration, suppression, or semantic change is a replan.
- Dependencies: Slices 1 through 4 committed.
- Risks: state extraction can mutate associations, reorder evidence, treat
  valid-empty as failure, or change unresolved-rule substitution behavior.
- Out of Scope: new semantics, presentation/report work, application messages,
  Qlty policy changes, and unrelated cleanup.

## Cloud Re-evaluation Gate

The preserved `68ea29bd` baseline intentionally makes `qlty:smells` part of
`rtk pnpm run qlty`; the aggregate local gate therefore exercises the known
baseline smells until the slices remediate them. Local evidence is necessary
but not sufficient for the PR differential gate. After Slice 5:

1. Record local HEAD and run `qlty smells --upstream main --no-snippets`.
   Reconcile output against QH-001 through QH-065 and reject any new smell.
2. Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and the direct
   `rtk pnpm exec markdownlint-cli2 docs/requirements/domain-rules/interpret-jp1-parameters.md`
   without configuration, ignore, baseline, threshold, or suppression
   changes. The direct check is required because `lint:md` omits the domain
   rules glob; do not edit the script or config to compensate.
3. Before pushing, verify the PR base is still `main`, `68ea29bd` remains an
   ancestor, and the remediation diff excludes `package.json`. After Main or
   an authorized repository actor pushes all approved completion commits to PR
   #315, verify the remote PR head equals recorded local HEAD.
4. Wait for fresh `qlty check` status on that head. It must be `SUCCESS`, not
   the stale result for `23112667`.
5. Record a zero-blocker refreshed summary. If the check fails or a new blocker
   appears, do not close; route the exact finding to Main for Replanning.

Pushing is not delegated to an implementation role by this plan. It remains a
Main/user repository action under the existing PR authorization boundary.

## Feature-Wide Validation

- [ ] QH-001 through QH-065 are each implemented in their assigned slice.
- [ ] No new Qlty smell appears in any retained or extracted file.
- [ ] `rtk pnpm run qlty` passes without config or suppression changes.
- [ ] `rtk pnpm run lint:md` passes.
- [ ] Direct Markdown lint passes for
      `docs/requirements/domain-rules/interpret-jp1-parameters.md` because it
      is omitted by the repository `lint:md` glob.
- [ ] Diagnostic, calendar, pipeline, and integrated schedule tests pass with
      preserved expectations.
- [ ] Architecture tests, TypeScript compilation, and production build pass.
- [ ] Desktop tests pass; applicable web tests pass, or an unchanged launcher
      limitation is recorded with successful web compilation/build.
- [ ] PR #315's fresh Qlty status succeeds at the exact pushed head and the
      original blocker set is zero.
- [ ] The preserved `68ea29bd` baseline remains attributable and an ancestor;
      PR base/head and push verification are recorded, with no remediation
      change to `package.json`.
- [ ] Diff review confirms no public DTO/schema/reason/evidence/result, README,
      CHANGELOG, roadmap, or use-case meaning change.

## Production Readiness And Compatibility

- Failure modes: preserve invalid, unsupported, missing-context, partial,
  no-runs, and invalid-period results; do not introduce throws.
- JP1/AJS: version 13 rules and unsupported/deferred boundaries are unchanged.
- Malformed input: preserve duplicates, conflicts, partial values, ranges, and
  raw evidence.
- Large input: retain one context index per side and bounded day/shift scans;
  no repeated whole-document traversal.
- Desktop/web: new modules are pure domain TypeScript with no host API or Node
  built-in. The same normalized inputs and period yield the same data.
- VS Code: `engines.vscode` and entry points are untouched.
- README/CHANGELOG: no update because behavior is not externally observable.
- Durable docs: no propagation beyond exact source-line wrapping.

## Replan Triggers

- A finding requires editing outside its slice's editable paths.
- An extraction needs a new public type, DTO, reason, evidence ID, or shape.
- A test expectation must change rather than add characterization coverage.
- A Qlty suppression, threshold, exclusion, baseline, or config edit is needed.
- Analysis identifies a new unrelated blocker or pre-existing excluded smell.
- A browser/desktop difference, new dependency, architecture exception, or
  performance regression appears.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates: none expected; reassess only for a reusable
  behavior or repository-policy decision.
- Open risks: Cloud/local divergence, behavior drift, abstraction churn, and
  incomplete remote clearance.
- Exit evidence: five completion commits or approved equivalent, independent
  reviews, exact remote head, and fresh successful Cloud result.

## Out Of Scope

- New or deferred schedule forms and JP1/AJS interpretation.
- Wave 3, Wave 4, or Deferred Schedule Semantics ordering.
- Semantic diff/report/Explorer/calendar presentation/WebAPI redesign.
- Application/presentation cleanup and pre-existing non-Cloud smells.
- Qlty rule, threshold, exclusion, baseline, config, or suppression.
- Reopening the closed feature, rewriting history, or squashing its commits.
