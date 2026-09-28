# Feature Tasks: Schedule Domain Ownership

## Agent Brief

- Purpose: preserve the completed schedule ownership refactor and its JP1/AJS,
  Semantic Diff, Unit List, diagnostics, desktop, and web behavior while
  removing all six blocking Qlty findings on PR #321.
- Active work: one remedial code slice, **R1**, after the focused planning
  commit. Implementation has not started.
- Read: this file, `SPECS.md`, `TRACEABILITY.md`,
  `docs/specs/README.md`, and `docs/specs/architecture.md`.
- Do not: implement F2/F3 or later roadmap work; change schedule semantics,
  application DTOs, quality thresholds, VS Code minimum, or the original
  feature's semantic owner.

## Current State And Decision

- Selected feature and branch: `schedule-domain-ownership` on
  `codex/schedule-domain-ownership`; PR #321 is the target.
- Completed original slices 1–4 and their focused commits remain preserved.
  Their ownership and behavior outcome is the baseline, not re-opened work.
  The prior Feature Exit `Close` and closure commit `72cc461b` are historical
  evidence; the current PR check failure prevents a new closure conclusion.
- Trigger: the 2026-09-24 Qlty Cloud summary reports six blocking issues and
  the current PR head `cc959a99` reports `qlty check: FAILURE`. Inline
  comments identify file complexity 136/86/156 and function complexity 10;
  the summary additionally identifies `interpretScheduleDateDay` complexity
  24 and return count 9.
- Plan review: independent plan-reviewer returned `Ready for approval` with
  zero Findings after two revision rounds. The user's conditional Human
  Approval is recorded below for the exact reviewed R1 boundary.

## Replan Impact And Alternatives

- Direct paths: `ScheduleDate.ts`, `ScheduleCalendar.ts`,
  `ScheduleCandidateResolver.ts`, and `ScheduleProjection.ts` in
  `src/domain/schedule`; their private collaborators and nearest schedule
  boundary tests listed in R1.
- Transitive behavior: schedule interpretation and projection feed Semantic
  Diff, schedule impact, diagnostics, and Unit List. Calendar hierarchy,
  selection precedence, operational months, candidate ordering, substitutions,
  statuses, evidence IDs/raw parameters, and half-open periods are regression
  risks. Shared domain code must remain Node-free and desktop/web safe.
- Rejected: accepting unchanged metrics as advisory, suppressing Qlty rules,
  increasing thresholds, excluding files, or rewriting Qlty configuration.
  The current Cloud check is blocking, and the user requires all six resolved.
- Rejected: moving generic date/period parsing into a new primitive or
  simplifying the Semantic Diff facade; these belong to F2/F3 and would
  enlarge the feature.
- Chosen: retain all current public exports at their current paths; extract
  only the cohesive private decisions mapped below. Eight new internal
  modules are justified below. Calendar partitions its
  measured 136 complexity among four files, candidates partition 86 among
  two, and projection partitions 156 among five. These are capacity
  estimates, not waivers: every analyzed final file must stay below the
  blocking file threshold 55. Reduce branching in both date interpreter
  functions using direct token decoding while preserving all outputs.
  Introduce no host/framework capability, port, adapter, application
  factory, service wrapper, or forwarding facade. If a planned module
  cannot pass without a new boundary, stop for Replanning.
- Compatibility: no public DTO, JSON, command, report, diagnostic, user
  workflow, JP1/AJS3 v13 meaning, or `engines.vscode` change is authorized.
  No README, durable use-case, architecture, or CHANGELOG edit is expected
  because output remains unchanged; a discovered observable change requires
  Replanning and a new documentation decision.

## R1: Resolve Six Qlty Findings

- Value: restore a passing PR Qlty gate and a reviewable, behavior-preserving
  schedule domain package. This single integrated code slice is necessary
  because every code slice must finish with a passing qlty result and the six
  current blocking findings span the same schedule call path. Internal
  checkpoints may aid review but are not separate approval/completion gates.
- Order/dependency: follows the four completed ownership slices. No dependent
  new slice starts until R1 has implementation review `Ready`, Completion
  Approval, and a focused completion commit.
- Owner and Solution Shape:
  - `ScheduleDate.ts` owns date grammar and the existing
    `ScheduleDateInterpretation` contract. Keep
    `interpretScheduleDateValue` public and day decoding private; retain
    rule defaults, explicit-rule flag, year/month/day parsing, malformed
    behavior, and UTC helpers. Reduce both function complexity findings and
    the day decoder return-count finding without changing grammar.
  - Calendar context/index/source, entry selection and classification,
    base/operational month, and relative-date context rules remain domain
    schedule decisions. The calendar's public contracts stay in
    `ScheduleCalendar.ts`; private collaborator boundaries below are based
    on distinct invariants. The caller creates/reuses the index; resolution
    must not mutate it.
  - Candidate resolution remains the domain owner of absolute and operational
    date candidates. The existing `ScheduleDateCandidateResult` and
    `resolveScheduleDateCandidates` contract, deferred/invalid/context flags,
    order, and bounded scans remain intact. Internal files divide absolute
    versus operational candidate rules.
  - Projection remains the domain owner of runs, status, evidence, and closed
    day substitutions over a half-open period. Its public contracts remain
    in `ScheduleProjection.ts`. Semantic Diff keeps comparison-only period
    guarding and decisions; no schedule-to-Semantic Diff dependency is
    introduced.
  - Internal cross-file exports are implementation details used only inside
    `domain/schedule`. The existing public functions keep their decision
    logic and call private collaborators; they do not become forwarding
    wrappers. No pass-through class, same-input/output wrapper, new public
    barrel, port, adapter, or factory is justified. The existing
    TypeScript/Date/RegExp/Map capabilities suffice.

### Exact symbol ownership and complexity design

All names below refer to current source symbols; the private-range mapping
includes every function in its cited contiguous range. The new files have
one domain reason to change each. Complexity estimates assume branch-bearing
logic moves with its owner; final SARIF, not these estimates, decides pass.

<!-- markdownlint-disable MD013 MD060 -->

| File after R1 | Current symbols moved or retained | Cohesive reason and expected effect |
| --- | --- | --- |
| `ScheduleDate.ts` (existing) | Retain all exports; refactor private `interpretScheduleDateDay` and exported `interpretScheduleDateValue` in place | Date token grammar/default rule is one owner. Target both functions below complexity threshold 5 and the day function below return threshold 4 without a new file. |
| `ScheduleCalendarIndex.ts` (new) | Move private `appendChildren` through `ancestorsOf` and `selectionEvidence` through `resolveScheduleCalendarSource` | Document identity, ancestor uniqueness/cycles, and `jc` source selection share the hierarchy invariant. Removes roughly the index/source portion of calendar complexity; no generic F2 document index. |
| `ScheduleCalendarEntries.ts` (new) | Move private `isInvalidExactSelector` through `classifyCalendarSelector`, plus `calendarParameters` currently beside the base-setting helpers | `op`/`cl` selector parsing, conflict detection, and exact-before-weekday classification change together. Removes the entry/classification portion; `classifyScheduleCalendarDay` remains public and decision-bearing in the existing file. |
| `ScheduleOperationalCalendar.ts` (new) | Move private `baseParameterResult` through `createOperationalMonth`, except `calendarParameters` assigned to Entries | `sdd`/`md`/`stt` base settings and operational-month bounds share the operational calendar invariant. Removes the largest remaining calendar block while keeping public month functions in the existing file. |
| `ScheduleCalendar.ts` (existing) | Retain all exports; keep `createScheduleCalendarContextIndex`, `classifyScheduleCalendarDay`, `resolveOperationalMonth`, `isWithinOperationalMonth`, `operationalMonthLength`, `operationalMonthDate`, relative-date validators, and `resolveScheduleCalendarContext` decision-bearing | Owns the public calendar contract and context orchestration. Three extracted areas should leave less than 55 file complexity; no forwarding export. |
| `ScheduleOperationalCandidates.ts` (new) | Move private `classificationFailure` through `classifiedDayCandidates`, then `dateCandidateAt` through `operationalDateCandidates`, with associated private types | Classified and relative/weekday candidates within an operational month share the context and month-bound invariant. Moving both source regions balances the 86 total so both resulting files can be below 55. |
| `ScheduleCandidateResolver.ts` (existing) | Retain both exports; keep result constructors, `absoluteBackwardCandidate` through `relativeCandidates`, and the public `resolveScheduleDateCandidates` decision | Owns absolute candidates and the public absolute-versus-operational decision. Its residual complexity must be below 55; avoid splitting by individual calculation step. |
| `ScheduleProjectionRules.ts` (new) | Move private `cloneRule` through `projectScheduleRules`, except substitution-specific `updateSubstitutionContextState` and `invalidAssociation` through `substitutionResolution`; include `RuleProjectionInput`, `ProjectedRule`, `ProjectedRules`, and `CandidateProjectionInput` | Candidate-to-run ordering, rule association, and projected evidence are one per-rule projection invariant. Removes the rule-generation portion of projection complexity. |
| `ScheduleSubstitutionAnalysis.ts` (new) | Move private `substitutionState` through `recordSubstitutionStates`, plus `createSubstitutionAnalysis` and `hasScheduleSubstitution`; associated private types | `sh`/`shd` association validity, default shift, and evidence grouping share the substitution-definition invariant. Removes the analysis portion; no independent public service. |
| `ScheduleSubstitutionResolution.ts` (new) | Move private `updateSubstitutionContextState`, `invalidAssociation` through `substitutionResolution`, `contextFailure` through `resolveSubstitutionCandidate`, and `isInvalidSubstitutionAssociation` through `resolveSubstitutedCandidates`; associated private types | Closed-day cancel/before/after search, mode choice, and bounded shift behavior share the substitution-resolution invariant. Removes the search portion. |
| `ScheduleProjectionOutcomes.ts` (new) | Move private `cloneSubstitutionRule` through `datePreflight`; associated private types | Rule status precedence and exact raw/evidence outcomes for invalid, missing, unsupported, or ready dates are one decision. Removes the outcome/preflight portion; not a pipeline wrapper. |
| `ScheduleProjection.ts` (existing) | Retain all exports; keep private period/status/summary helpers through `projectValidatedSchedule`, early outcomes, and `projectScheduleRuns` | Owns the half-open projection contract and aggregate status. Four extracted areas should leave less than 55 file complexity; no public API move. |

<!-- markdownlint-enable MD013 MD060 -->

Private helpers between the cited ranges that are used by two semantic
owners may remain in the current file or move to the owner of their invariant
within these exact paths; record each such choice and verify the resulting
dependency graph has no runtime cycle. The index-specific `AncestorResult`
and source-resolution private types move with `ScheduleCalendarIndex.ts`;
the private substitution association/state types move with
`ScheduleSubstitutionAnalysis.ts`; private resolution/context types move
with `ScheduleSubstitutionResolution.ts`. No new file, outward import, or
public contract is authorized by that limited placement choice.

The permitted runtime direction is
`ScheduleCalendar.ts -> {ScheduleCalendarIndex, ScheduleCalendarEntries,
ScheduleOperationalCalendar}.ts` (their imports back to calendar are
type-only), `ScheduleCandidateResolver.ts ->
ScheduleOperationalCandidates.ts`, and `ScheduleProjection.ts ->
{ScheduleProjectionRules, ScheduleSubstitutionAnalysis}.ts`.
`ScheduleProjectionRules.ts` may use substitution analysis/resolution and
projection outcomes; resolution may use analysis types. None of the new
modules imports its public owner at runtime. Remove the existing private
`createScheduleCalendarContext` identity helper during extraction rather
than create a same-input/output cross-file wrapper. These directions and the
same-path public exports are architecture review conditions.

### Public export and import boundary

Every currently exported symbol of the four affected files stays exported
from the **same file** with the **same name, type, signature, and behavior**.
The list is exhaustive:

- `ScheduleDate.ts`: `ScheduleDateWeekday`, `ScheduleDateDay`,
  `ScheduleDateInterpretation`, `interpretScheduleDateValue`,
  `daysInGregorianMonth`, `isInvalidCalendarMonth`,
  `isInvalidCalendarDay`, `isImpossibleYearDay`, `createScheduleDate`,
  `toUtcDate`, `formatScheduleDate`,
  `daysInGregorianMonthOrUndefined`.
- `ScheduleCalendar.ts`: `ScheduleCalendarContextStatus`,
  `ScheduleCalendarBaseDay`, `ScheduleCalendarDayClassification`,
  `ScheduleCalendarSelector`, `ScheduleCalendarEntry`,
  `ScheduleCalendarGroup`, `ScheduleCalendarSelection`,
  `ScheduleCalendarContext`, `ScheduleCalendarContextIndex`,
  `ScheduleCalendarDayResult`, `createScheduleCalendarContextIndex`,
  `classifyScheduleCalendarDay`, `resolveOperationalMonth`,
  `ScheduleOperationalMonth`, `isWithinOperationalMonth`,
  `operationalMonthLength`, `operationalMonthDate`,
  `relativeScheduleDateRequiresContext`,
  `isSyntacticallyInvalidRelativeScheduleDate`,
  `isFullyQualifiedRelativeScheduleDate`,
  `resolveScheduleCalendarContext`.
- `ScheduleCandidateResolver.ts`: `ScheduleDateCandidateResult`,
  `resolveScheduleDateCandidates`.
- `ScheduleProjection.ts`: `ScheduleProjectionPeriod`,
  `ScheduleProjectionInput`, `ScheduleRun`, `ScheduleProjection`,
  `projectScheduleRuns`.

Current external production import consumers remain **validation-only**
because no public symbol or source path moves:

<!-- markdownlint-disable MD013 MD060 -->

| Exact existing path | Imported symbols to retain |
| --- | --- |
| `src/domain/schedule/ScheduleInterpretation.ts` | `interpretScheduleDateValue`, `ScheduleDateDay` |
| `src/domain/services/diagnostics/ScheduleDateRules.ts` | `interpretScheduleDateValue`, `ScheduleDateDay` |
| `src/application/unit-list/unitListScheduleValueHelpers.ts` | `interpretScheduleDateValue`, `ScheduleDateDay`, `ScheduleDateInterpretation` |
| `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts` | `projectScheduleRuns`, `ScheduleProjection`, `ScheduleProjectionPeriod`, `ScheduleRun`, `createScheduleCalendarContextIndex`, `isFullyQualifiedRelativeScheduleDate`, `resolveScheduleCalendarContext`, `ScheduleCalendarContextIndex` |
| `src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts` | `ScheduleRun` |
| `src/application/semantic-diff/compareScheduleDiff.ts` | `ScheduleRun` |
| `src/test/suite/scheduleRuleHelpers.test.ts` | `interpretScheduleDateValue` |
| `src/test/suite/semanticDiffScheduleCalendar.test.ts` | `classifyScheduleCalendarDay`, `createScheduleCalendarContextIndex`, `resolveOperationalMonth`, `resolveScheduleCalendarContext`, `projectScheduleRuns` |
| `src/test/suite/semanticDiffScheduleRules.test.ts` | `ScheduleRun`, `projectScheduleRuns` |

<!-- markdownlint-enable MD013 MD060 -->

The edited four production files retain their present imports from one
another as well: `ScheduleCalendar.ts` uses date helpers;
`ScheduleCandidateResolver.ts` uses date helpers and calendar classification,
operational month, context, and relative-date rules; `ScheduleProjection.ts`
uses date helpers, the candidate resolver, calendar classification/context
rules, and their current types. Test direct imports in editable suites may
change only for new private collaborator assertions; existing public imports
must remain. Editing any external production consumer or changing any public
import requires Replanning.
- **Exact editable production paths:** existing
  `src/domain/schedule/ScheduleDate.ts`,
  `src/domain/schedule/ScheduleCalendar.ts`,
  `src/domain/schedule/ScheduleCandidateResolver.ts`,
  `src/domain/schedule/ScheduleProjection.ts`; new
  `src/domain/schedule/ScheduleCalendarIndex.ts`,
  `src/domain/schedule/ScheduleCalendarEntries.ts`,
  `src/domain/schedule/ScheduleOperationalCalendar.ts`,
  `src/domain/schedule/ScheduleOperationalCandidates.ts`,
  `src/domain/schedule/ScheduleProjectionRules.ts`,
  `src/domain/schedule/ScheduleSubstitutionAnalysis.ts`,
  `src/domain/schedule/ScheduleSubstitutionResolution.ts`,
  `src/domain/schedule/ScheduleProjectionOutcomes.ts`.
  All other production paths are validation-only; no external import edits
  are anticipated or approved.
- **Exact editable test paths:**
  `src/test/suite/scheduleRuleHelpers.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`, and
  `src/test/suite/scheduleImpactCalendarProjection.test.ts`.
  Add focused cases only for uncovered branch combinations: date tokens and
  malformed values; duplicate/cyclic hierarchy and reused index;
  exact/weekday selector precedence and conflicting evidence; operational
  month boundaries and candidate order; substitution modes, shifts, invalid
  periods, partial/no-runs statuses and preserved evidence. Existing scenario
  expectations must not be relaxed. A new test path is a Replanning trigger.
- **Validation-only paths:** `src/test/suite/semanticDiffSchedule.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/semanticDiffContracts.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`,
  `src/test/suite/unitListViewHelpers.test.ts`,
  `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `src/domain/schedule/ScheduleInterpretation.ts`,
  `src/domain/services/diagnostics/ScheduleDateRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`,
  `src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts`,
  `src/application/unit-list/unitListScheduleValueHelpers.ts`,
  `src/application/semantic-diff/compareScheduleDiff.ts`,
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`.
  Audit all `src` imports/references for changed public symbols; any needed
  edit outside the exact boundary requires Replanning.
- Acceptance:
  1. All six identified findings are absent in final official Qlty SARIF and
     the current-head Qlty Cloud `qlty check` passes with no blockers.
     No replacement file/function/return-count blocker may be introduced.
     Qlty configuration and rules are unchanged.
  2. Existing exported types, function signatures, output shapes, evidence,
     ordering, calendar-index lifecycle, period semantics, and exception/
     fallback behavior are unchanged.
  3. Focused and transitive schedule, Unit List, diagnostics, architecture,
     desktop, and web validations pass; no old Semantic Diff owner or
     architecture exception is restored.
- Local evidence: use `sdd-evidence` on exact disposable baseline (current
  approved code before R1) and final snapshots, with qlty >=0.645.0,
  identical analyzed paths/configuration hash, snapshot-local caches, complete
  SARIF 2.1.0 from `rtk pnpm exec qlty check --sarif --no-fix` and
  `rtk pnpm exec qlty smells --sarif --no-snippets`, command output/status,
  stable finding identity and severity/value/direction comparison, then
  `rtk pnpm run qlty` in the final snapshot. A failed, mismatched, malformed,
  missing, new, or adversely moved result is NG; no advisory waiver resolves
  one of the six. If formatting edits approved content, sync approved paths,
  rebuild, and repeat until stable.
- Functional/build evidence: `rtk pnpm exec tsc --noEmit -p tsconfig.json`,
  `rtk pnpm run build`, ordered
  `rtk pnpm run test:prepare:desktop` then
  `rtk pnpm run test:desktop:run`, and `rtk pnpm run test:web`
  after the final build. Record the named editable and validation-only
  suites' pass results from the full desktop runner; the repository has no
  focused suite selector. Run `git diff --check` and an all-`src` import
  audit. Validate current PR head's Qlty Cloud status after publish before
  Feature Exit; local success alone is not closure evidence.
- Production readiness: guard large/malformed inputs, deterministic scans,
  unsupported and missing-context evidence, caller-controlled index
  reuse/non-mutation, no silent fallback, browser-safe shared source, and
  VS Code `^1.75.0`. An inability to retain any of these blocks completion.
- Out of scope: F2/F3/F4–F8, parser and generated code, application contracts,
  UI, bootstrap, telemetry, `.qlty/qlty.toml`, package scripts, and generic
  abstraction or API redesign.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation after independent plan review
  returned `Ready for approval` with zero Findings
- Approved scope: the exact reviewed R1 slice, including its production and
  test edit manifests, behavior and compatibility boundaries, validation,
  and completion/Feature Exit gates recorded above. This approval authorizes
  the focused planning commit and subsequent R1 implementation only.
- Approved plan-commit paths:
  - `docs/specs/features/schedule-domain-ownership/SPECS.md`
  - `docs/specs/features/schedule-domain-ownership/TASKS.md`
  - `docs/specs/features/schedule-domain-ownership/TRACEABILITY.md`

## Completion And Feature Exit Gates

- R1 status: Planned; no implementation or completion approval recorded.
- Implementation review: required after R1 local evidence and behavior tests.
  Given the shared domain schedule surface, the SDD policy also requires an
  independent second review of the integrated result.
- Completion Approval: Pending; R1 cannot be committed before review
  `Ready` and explicit approval.
- Feature Exit: reassess only after R1 completion commit and current-head
  Qlty Cloud `qlty check` success. Review requirement coverage, traceability,
  behavior, desktop/web compatibility, quality, user-doc/CHANGELOG impact,
  production risks, and PR claims. The previous `Close` does not substitute
  for this reassessment or Closure Approval.
- New owner/contract/semantics, test or production path, dependency,
  configuration, validation method, or approval scope requires Replanning.
