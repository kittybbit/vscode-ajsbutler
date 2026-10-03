# Feature Tasks: Semantic Diff Schedule Facade

## Agent Brief

- Purpose: thin schedule compatibility orchestration with unchanged results.
- Active or approved slice: S1 product implementation retained; five-failure
  bounded baseline investigation approved; replan commit pending.
- Read: [SPECS](SPECS.md), this plan, [TRACEABILITY](TRACEABILITY.md), and
  discovery/validation references below.
- Constraints: preserve facade exports, ordering, optional-property presence,
  legacy low-year rejection, calendars, completeness and duplicate pairing.
  No application projection restructuring or deferred semantics.
- Next route: focused approved baseline-investigation replan commit.
  No host launch or correction before that commit.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: commit approved bounded same-host baseline
  characterization. Five failures remain unresolved and block readiness until
  baseline investigation and a separate explicit gate decision are completed.
  Inherited classification alone cannot unblock a failed required check.
- Selected feature: `semantic-diff-schedule-facade`.
- Branch: `codex/semantic-diff-schedule-facade`.
- Fixed base: `fbe562b201ca780d6e0a2add8dff90fa55900d8f`.
- Prerequisites: ownership `49765418` and shared primitives `cdc84f2a` merged.
- Gate evidence: intake, plan documentation and independent Ready review below.
  Human Approval recorded below; planning commit complete; S1 implementation
  retained from IMPLEMENTING. First validation repair was approved; the new
  bounded five-failure baseline investigation is approved;
  completion/closure approval has not been granted.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-03).
- Approved scope: reviewed S1 plan, R1–R6 and exact implementation boundary;
  planning commit and implementation authorized. Completion/closure not approved.
- Approved runtime/test paths:
  - `src/domain/schedule/ScheduleInterpretation.ts`
  - `src/domain/schedule/ScheduleProjection.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
  - `src/test/suite/semanticDiffSchedule.test.ts`
  - `src/test/suite/ScheduleProjectionUnits.test.ts`
- Approved planning/metadata paths:
  - `docs/specs/features/semantic-diff-schedule-facade/SPECS.md`
  - `docs/specs/features/semantic-diff-schedule-facade/TASKS.md`
  - `docs/specs/features/semantic-diff-schedule-facade/TRACEABILITY.md`

## Validation Replan Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-03).
- Approved scope: reviewed validation-only replan; bounded baseline/final UI
  failure isolation, conditional 15-suite in-host coverage, and complete smells
  inventories. Focused replan commit and validation execution authorized;
  completion and closure not approved.
- Approved replan commit paths:
  - `docs/specs/features/semantic-diff-schedule-facade/TASKS.md`
  - `docs/specs/features/semantic-diff-schedule-facade/TRACEABILITY.md`
- Original Human Approval and plan commit remain historical gate facts for the
  unchanged seven-path product boundary. Renewed approval above covers this revision.
- Independent review Ready and renewed approval substantiated through Main;
  focused replan commit `f1096747d38bfead7dae104fd296dcf314999550` preceded
  validation repair.
  Previous implementation review/completion evidence: none to invalidate.

## Five-Failure Replan Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-03).
- Approved scope: one bounded same-host baseline run of all 14 existing suites
  against ca122e02, exact-five failure and common-outcome comparison against
  retained final results. Investigation only; no failed-gate exception, product
  repair, readiness, completion or closure approval.
- Approved replan commit paths:
  - `docs/specs/features/semantic-diff-schedule-facade/TASKS.md`
  - `docs/specs/features/semantic-diff-schedule-facade/TRACEABILITY.md`
- Preserve original seven-path approval and first validation approval/commit
  `f1096747` exactly. Neither authorizes this new validation boundary.
- Changed validation requires independent plan review, renewed human approval
  through Main and a focused replan commit before execution. Previous product
  evidence remains valid; no implementation review exists to invalidate.

## Plan and approval boundary

One cohesive implementation slice S1 covers R1–R6. Selection, document-backed
projection and facade wiring must move together: a separate unused helper slice
would not deliver an independent outcome. Characterization precedes runtime
changes within S1; it is part of the same reviewable completion, not a separate
approval gate. No completed slices or inherited approvals exist to preserve.

### S1: Reuse semantic owners and retain compatibility assembly

- Lifecycle state: PLAN_APPROVED
- Value: the facade delegates reusable schedule selection and context/projection
  work to existing schedule owners and run correspondence to the existing
  differ, while callers receive the exact current compatibility result.
- Dependencies: merged prerequisites above; Ready plan review, explicit Human
  Approval for this boundary and planning commit before implementation.
- Implementation order: characterize missing facade invariants; add owner APIs
  and boundary tests; wire facade and delete displaced local logic; validate.
- Completion boundary: one independent implementation review plus a second
  independent review for shared domain contract/architecture risk, both reusing
  the same evidence; explicit Completion Approval and focused commit.

Exact runtime paths:

- `src/domain/schedule/ScheduleInterpretation.ts`
- `src/domain/schedule/ScheduleProjection.ts`
- `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`

Exact test paths (modify only for identified coverage gaps):

- `src/test/suite/semanticDiffScheduleRules.test.ts`
- `src/test/suite/semanticDiffScheduleCalendar.test.ts`
- `src/test/suite/semanticDiffSchedule.test.ts`
- `src/test/suite/ScheduleProjectionUnits.test.ts` (new owner-boundary tests)

Decision/evidence metadata paths: this feature's `SPECS.md`, `TASKS.md` and
`TRACEABILITY.md`; retained validation artifacts outside repository inputs.
Exclude all other product, tests, generated and configuration paths, especially
`compareScheduleDiff.ts`, application DTO/projection modules, Comparison,
SchedulePeriod, ScheduleCalendar, bootstrap, presentation, parser, dependency
files, architecture catalog, README and CHANGELOG. A required extra path or
changed contract/owner returns through Main for Replanning.

Acceptance:

- Preserve all facade exported types and `evaluateSemanticDiffSchedule` input
  and discriminated result shapes. Preserve `period` values, optional status
  and scheduleRule absence versus presence, unit/parameter evidence identity,
  before-then-after unsupported ordering and match-order pair evaluations.
- Preserve direct eligibility for `n`, `rn`, `rm`, `rr` with one of `sd`, `st`,
  `cy`, `sh`, `shd`, `jc`, `ln`, `cftd`; exclude sc-only units, groups, jobs and
  inherited-only schedules. Do not infer eligibility from projected runs.
- Preserve independent document context and outside-scope calendar lookup,
  missing/invalid/ambiguous evidence, relative-date and substitution behavior.
  Build one reusable context index per supplied document per side invocation;
  never traverse the entire document again per selected unit.
- Preserve rule-zero ineffective-failure suppression, supported-pair counts,
  supported/mixed/unsupported-only categories, complete-only zero-run lists
  and after-side alias. Raw interpretation evidence remains intact.
- Preserve canonicalized before run paths, duplicate multiplicity, stable
  decisions, paired unit references, and compatibility run ordering. Delegate
  canonicalization through the differ's existing third argument.
- Preserve strict Gregorian half-open periods and legacy low-year rejection at
  the facade; keep the shared projector's canonical low-year support.
- Application facts, removed-run review gating, report/JSON and schedule-impact
  counts/order remain unchanged. No new behavior or architecture exception.
- Independent review establishes thin orchestration: facade owns only consumer
  guard, calls to semantic owners and compatibility assembly, with no duplicated
  calendar-resolution or canonical-run mapping implementation.

## Solution Shape

All changed owners remain in domain; application continues to import the same
facade. No layer direction or public application contract changes.

- `ScheduleInterpretation` owns direct-schedule eligibility. Export
  `isDirectScheduleJobnet(unit: AjsUnit): boolean` from its existing module.
  It centralizes JP1/AJS unit-type and direct-parameter recognition, rather than
  assuming any interpreted/projection output implies eligibility. Preserve
  `interpretSchedule` inputs/output and all current interpretations.
- `ScheduleProjection` owns document-backed batch projection. Export
  `projectDirectScheduleUnits(input: ScheduleUnitsProjectionInput):
ScheduleUnitProjection[]`. The explicitly exported input has `units:
AjsUnit[]`, `period: ScheduleProjectionPeriod`, and optional `document:
AjsDocument`; each result has `interpretation: ScheduleInterpretation` and
  `projection: ScheduleProjection`. Preserve selected input-unit order and
  duplicates; no aggregate compatibility counts, side labels or sorting here.
  It selects eligible units, interprets each, shares one Calendar index,
  resolves context only for fully qualified relative dates or `sh`, and calls
  existing `projectScheduleRuns`. Without document it supplies no context.
  Invalid-period behavior follows existing projector semantics, including its
  early invalid check before rule zero; the facade guards its own period first.
  This boundary earns batch context ownership and reusable business workflow,
  rather than a same-request forwarding wrapper. Test it directly with the new
  owner-boundary suite and the existing calendar regressions.
- `ScheduleCalendar` retains normalized context resolution/index ownership;
  `SchedulePeriod` retains Gregorian validation. Reuse their APIs unchanged.
  Projection already depends on Calendar; its new value imports and the
  Projection-to-Interpretation value dependency stay within domain. Inspect
  transitive imports for cycles before wiring; introduce no reverse dependency.
- `semanticDiffScheduleComparison.compareScheduleRuns` retains deterministic
  duplicate grouping and mapping. Pass the existing before-to-after path map as
  its third argument; no differ edit or new identity module is planned.
- `semanticDiffScheduleRules` retains all exported compatibility contracts,
  legacy period policy, side evidence translation, ordering, complete-only
  zero-run selection, and pair assembly. Compatibility evidence names/counts
  are consumer-specific and must not pollute the neutral Projection contract.
  Local assembly helpers may remain cohesive in this file; do not extract new
  modules merely to reduce its line count.
- Ports: none added or changed; no inversion/host contract is required.
- Adapters: none added or changed; no host translation/lifecycle gap exists.
- Retained application factories: unchanged and outside scope; no new forwarding
  factory is justified. Application projection is roadmap item 2.
- Existing capability: Interpretation, Projection, Calendar, Period and differ
  provide all algorithms. The concrete gap is cohesive document-backed batch
  projection and misplaced eligibility, addressed inside existing owners; no
  framework/library or speculative mechanism is needed.

Architecture dependency tests mechanically enforce their catalog. Semantic
owner choice, batch-boundary value, thinness and qlty disposition are independent
review judgments, not claims established by that test.

## Impact, characterization and risks

Direct consumer: application `compareScheduleDiff.ts`; transitive consumers:
comparison facts, confirmation items, report/JSON, schedule-impact and Flow.
No consumer migration is planned. Existing suites already characterize period,
low years, duplicate pairing, rule zero, mixed evidence and both-side no-runs.
Before runtime changes add only missing assertions for optional own-property
presence, multi-unit ordering, moved/renamed duplicate paths and alias identity;
retain the existing comprehensive fixtures rather than mirror helper code.
The new owner tests establish direct selection, ordered duplicate inputs,
independent documents, shared index behavior and no-calendar/invalid-period
behavior against current semantics.

- Projection may become too concentrated or add a qlty finding. Keep its batch
  operation cohesive and small; do not hide warnings by moving unrelated code.
  New findings or reliably mapped adverse movements block completion.
- The differ avoids copying unchanged paths while the old facade always copied
  runs. Preserve exposed values and nonmutation; characterize any observable
  reference contract before rewiring. No caller may receive mutated inputs.
- Unit/unsupported order is source order, aggregate run order uses the current
  facade comparator, and differ decisions use its comparator. Do not unify them
  opportunistically or use unstable Map pairing for duplicate units.
- Partial/missing projections remain explicit; empty runs alone are insufficient
  for zero-run conclusions. Calendar failure fallback stays unchanged.
- Large/deep and malformed calendar fixtures remain the failure/performance
  boundary. No new host clock, external lookup, locale fallback or exceptions.
- VS Code baseline remains `^1.75.0`; host-neutral domain remains browser-safe.
  Desktop/web builds and host smoke evidence are required below.
- README/CHANGELOG: no entry because internal cleanup preserves observable
  behavior. A discovered user-facing change blocks this plan boundary.

## Required validation for S1

Use the nearest host-neutral tests after compilation, then host coverage. Run
from an exact final substantive snapshot and retain command outputs/exits:

```sh
rtk pnpm run test:compile
rtk pnpm exec mocha --ui tdd \
  out/test/suite/ScheduleProjectionUnits.test.js \
  out/test/suite/semanticDiffScheduleRules.test.js \
  out/test/suite/semanticDiffScheduleCalendar.test.js \
  out/test/suite/semanticDiffSchedule.test.js \
  out/test/suite/SchedulePeriod.test.js \
  out/test/suite/architectureDependencyRules.test.js
rtk pnpm exec mocha --ui tdd \
  out/test/suite/semanticDiffJson.test.js \
  out/test/suite/semanticDiffMarkdownProjections.test.js \
  out/test/suite/renderSemanticDiffMarkdown.test.js \
  out/test/suite/semanticDiffScheduleImpact.test.js \
  out/test/suite/semanticDiffFlowHighlights.test.js
rtk pnpm run test:prepare:desktop
rtk pnpm run test:prepare:web
rtk pnpm run test:web:run
rtk pnpm run build
```

The original full desktop invocation is replaced only under the conditional
validation repair below. Its failure remains explicit; no full-suite pass is
claimed. The web runner bundles existing `webSmoke.ts`, which exercises browser
semantic comparison/calendar and schedule-impact. Matching completed owner,
web and build results are reused; phase changes do not justify reruns.
The five downstream host-neutral tests remain required, but their failed load
is replaced by actual in-host execution of those same suites below.

### Validation repair: desktop baseline and selective in-host coverage

Product paths, contracts, Solution Shape, risks and acceptance are unchanged.
Do not edit the repository runner, UI, dependencies, aliases or configuration.
Temporary validation runners/wrappers and isolated host profiles live under
`/private/tmp/ajsbutler-semantic-diff-schedule-facade/validation-repair/` and are
hashed in evidence. Retain the original CLI exit-0/no-tests and terminated
full-suite logs; neither is a successful desktop gate.

1. Reconstruct an exact disposable approved-plan baseline `ca122e02`, with
   matching dependency/configuration identities and its own compiled outputs.
   Use the same VS Code 1.140.0 Code executable, alias translations and
   `DEVELOPMENT=true` as final6. A temporary Mocha in-host runner uses the
   existing tdd mode and loads baseline test files in the same recorded order;
   select only the `Table shell integration` suite for execution. First recover
   the observed final6 file/load order or record an explicit deterministic order
   identically for baseline and final. Repeat the same isolated selection on
   final code because importing a full suite can affect DOM global setup.
2. Bound each isolated run to 60 seconds with an external watchdog. Stop the
   uniquely profiled test app on the first matching TypeError plus repeated
   React depth loop; retain exact signature, test name/line, host/wrapper,
   definition fixture, loaded-path identities, partial output and termination
   status. No success summary means failure, including watchdog termination.
   The planner has not run or predicted a baseline result.
3. Conditional disposition: only matching baseline/final failure signatures,
   with inspected failing fixture/runtime import paths showing no changed
   schedule dependency, establish this as inherited/out-of-scope for S1.
   Main assigns the full-runner execution problem to test-harness maintainers
   and table-shell failure/React loop to unit-list/webview test maintainers as
   explicit follow-ups before readiness. Keep their evidence and ownership in
   this feature until closure routes durable roadmap records; planner has no
   authority to edit roadmap or waive those failures.
4. Execute an isolated actual VS Code in-host runner for these exact suites:
   `ScheduleProjectionUnits`, `semanticDiffScheduleRules`,
   `semanticDiffScheduleCalendar`, `semanticDiffSchedule`, `SchedulePeriod`,
   `architectureDependencyRules`, `semanticDiffJson`,
   `semanticDiffMarkdownProjections`, `renderSemanticDiffMarkdown`,
   `semanticDiffScheduleImpact`, `semanticDiffFlowHighlights`,
   `compareSemanticDiff`, `compareSemanticDiffWithArtifacts`,
   `semanticDiffCommandScheduleImpact`, `semanticDiffWiring` (all `.test.js`
   under `out/test/suite`). Use existing Mocha tdd API, explicit file list and
   nonzero failure propagation, the same alias/define wrapper and real Code
   executable. Do not mock VS Code or replace assertions. Record expected and
   loaded suites, nonzero assertion counts, a complete Mocha summary,
   exits and profile identities. Use at most 60-second waits and a five-minute
   external run limit; missing summary/loop is unresolved, never pass. The
   completed five-failure result stays failed. Baseline evidence alone cannot
   resolve its readiness consequence; the separate gate decision below applies.
5. If baseline failure differs, cannot be reproduced, uses materially different
   execution inputs, or the failure involves changed schedule code, stop:
   return evidence through Main for a separate scoped runner/UI repair decision
   or S1 correction. Do not automatically broaden S1 or drop another suite.

The SDD risk-based policy allows targeted host coverage for this unchanged
shared-domain boundary; this reviewed, renewed approval condition replaces the
original complete desktop suite requirement. It does not declare the complete
suite healthy. Actual in-host downstream coverage plus matching baseline
failure evidence is mandatory before implementation review. Second independent
implementation review remains required. Known expanded-Flow golden follow-up
stays with Flow test maintainers; do not alter that golden in this feature.

### Five-failure characterization and conditional disposition

Trigger: approved actual-host 15 suites completed 182 assertions, 177 passing,
5 failing, exit 1, without watchdog termination. Preserve every assertion,
suite, raw failure and nonzero exit. Do not repeat selective pruning, update
expected strings/goldens, bypass QuickPick or claim the gate passed.

The only new execution is one bounded approved-plan baseline host run. Use
`ca122e02` and its own compiled/generated outputs, matching Code 1.140.0,
dependency/configuration identities, alias translations, DEVELOPMENT define,
Mocha tdd options and file order from retained `suites-loader.cjs`. Use the same
15-list contract: record that `ScheduleProjectionUnits.test.js` did not exist
at baseline and omit only that absent new owner suite from baseline execution.
All other 14 suites and every baseline assertion execute; do not grep failures
or add final S1 tests to the baseline. Newly added characterization assertions
in existing final suites are final-only coverage and are not baseline failures.
Use an external five-minute limit, fresh uniquely profiled host, waits at most
60 seconds, explicit loaded paths/counts and complete Mocha summary/exits.
Do not overwrite an existing profile or symlink. Retain wrapper and fixture,
runtime dependency and generated-input manifests outside repository inputs.

Compare baseline with the retained immutable `suites-final-approved.log` and
status. Reuse final result only if test inputs, wrapper behavior/order and host
conditions match; no final rerun is authorized by default. If a necessary
wrapper/input change invalidates it, stop and return to Main for exact paired
execution authorization rather than silently refreshing or changing coverage.

Required comparison covers each exact failed assertion:

- `semanticDiffMarkdownProjections`: renders calculated schedule removal from
  typed before values in Full; missing beforeValues text, compiled line 472.
- Same suite: preserves immutable baseline bytes and digests across Markdown
  locales; 3610 versus 3617, compiled line 502.
- `renderSemanticDiffMarkdown`: renders job-group path and type in exact
  identity evidence; missing key text, compiled line 441.
- `compareSemanticDiff`: copies path/type exact evidence for repeated g and mg
  job groups; extra root empty jobGroupPath, compiled line 126.
- `semanticDiffCommandScheduleImpact`: invokes the adapter and schedule-aware
  opener once with one context; cancelled versus explorer-opened, line 128.

Record names, expected/actual values, assertion locations, failure categories
and common-test pass/fail identities. Equal failure counts alone are inadequate.
Main's static findings are hypotheses: first three build/render supplied result
objects; fourth compares a no-period fixture; fifth has showQuickPick returning
undefined and a stub artifact builder. They suggest unexercised schedule paths,
but do not establish inherited behavior. Establish their unchanged fixture and
applicable runtime paths with matching baseline/final content identities and
confirm no changed schedule invocation contributes to each failure. Dynamic
state/order/host differences remain explicit unresolved facts if not excluded.

Conditional investigation result and required return to Main:

- Only if all five exact failures match baseline, all common assertions have no
  new/adverse failures, all S1-specific owner tests pass, and dependency/
  invocation evidence excludes S1 influence may Main record inherited behavior
  and no-regression evidence. This is an investigation result, not readiness.
  The host command and five assertions remain FAILED and block readiness under
  the SDD policy: an unavailable or failed required check blocks readiness.
- Return the completed investigation to Main before implementation review or
  readiness. Main must select a separately scoped repair with exact paths and
  passing validation, or seek an expressly authorized exception/revised
  validation contract. The latter must identify each exact failed assertion,
  accepted compatibility/behavior risk, owner and replacement coverage, and
  receive independent review and explicit renewed human authorization. It is
  an exception or changed contract, not ordinary policy compliance. No such
  decision, authorization or replacement passing gate is granted by this plan.
- Assign the first three report/bytes failures to semantic-diff report test and
  presentation maintainers; the exact job-group fixture to semantic-diff
  identity/comparison maintainers; the cancellation fixture to semantic-diff
  command test maintainers. Investigation/repair must preserve durable use-case
  behavior and independently decide actual product versus fixture mismatch.
  Do not prescribe weakened assertions or bless current output as correct.
  Keep exact failure evidence/owners until Main routes durable follow-up records
  at Exit; unchanged product scope grants no repair authority for those paths.
- If any failure does not match, a common assertion newly fails, actual changed
  schedule code contributes, baseline lacks a complete summary, or identities
  cannot be matched, readiness remains blocked. Return through Main: an actual
  S1 regression may be corrected only within existing seven paths and reviewed
  acceptance; a report/comparison/command fixture or runtime repair requires
  separately scoped intake/replan and exact path approval. No new repair slice
  or configuration/test path is authorized by this conditional plan.

This is one bounded missing-evidence investigation, not repeated trial runs.
All 15 final suites remain required and their failures preserved. Original
owner102/web/build and repaired qlty evidence remain reusable. The previous
validation review is superseded only for this new failed-gate disposition and
baseline command coverage; both original approval records remain preserved.
Two independent implementation reviews and completion/closure gates remain.

For S1 qlty, use exact disposable baseline (approved plan commit) and final
substantive snapshots, full-repository selection and matching configuration:

```sh
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
```

Require qlty >=0.645.0, complete official SARIF 2.1.0, nonzero analyzed-path
inventories, all four SARIF files and raw exits. Compare identities/severity/
values/direction by policy; no new or mapped adverse finding. Run
`rtk pnpm run qlty` only in the final snapshot and require pass. If it formats
approved code, sync only allowed paths, rebuild snapshot and repeat affected
observations/aggregate until stable. No custom collector/comparator. Record
Node-import/layer/export/import changes, unchanged engines, dependencies,
ignored generated build/test inputs, snapshot manifests and any unrelated
inputs explicitly. Keep output/cache outside inspected inputs.

### Validation repair: complete smells analyzed-path inventory

The existing smells counts and result paths do not satisfy complete-input
inventory. Retain existing check SARIF/inventories and final aggregate when
identities match; refresh only missing smells coverage in both preserved exact
snapshots, using qlty 0.645.0 and unchanged full-repository selection/config:

```sh
QLTY_LOG=qlty_analysis=trace QLTY_LOG_STDERR=1 \
  rtk pnpm exec qlty smells --all --sarif --no-snippets
```

Capture stdout as official SARIF and stderr as raw trace/log, outside analyzed
inputs. Request normal tooling permission for qlty's existing global log write
if required; never repurpose HOME or change scan configuration to avoid it.
Official v0.645.0 `workspace_entry_finder.rs` emits every accepted File workspace
entry at TRACE; `logging.rs` supplies these environment filters and stderr
routing. Both structure and duplication use `files_for_qlty` with all-files,
exclude-tests selection. Retain official source/version references in evidence.
Manually reconcile accepted path sets and their distinct nonzero counts against
both structure and duplication counts, including duplicate selection passes,
skips and processing errors. Retain full raw trace plus plain path inventories;
no custom collector, SARIF parser or textual findings comparator.

Before reuse, prove retained baseline/final contents and configuration match
original scans, and outputs/logs/caches remain excluded. Compare refreshed
complete official smells SARIF to the matching originals and counterpart under
the existing policy. If source/path selection changes, logging is incomplete,
counts cannot reconcile, trace exposes processing failures, or a new/adverse
finding appears, readiness is blocked. Return through Main; do not substitute
finding paths or repository file lists for analyzed inputs or waive the gate.
A tools feature or a supported tool upgrade with matching two-snapshot scans
requires a separate explicit decision if this bounded inventory repair fails.

For changed feature Markdown use targeted markdownlint-cli2, local links,
structure, traceability/provenance inspection and `rtk git diff --check`.
Current-head Qlty Cloud must pass before Feature Exit. Missing/failed required
checks block readiness; reuse matching evidence across reviewers and gates.

## Validation index

- Intake: `schedule-facade-intake-v1`; pass for its immutable intake documents;
  [record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/intake/record.md).
  Discovery is reused; superseded planning-document hashes are not final-plan
  validation.
- Plan: `schedule-facade-plan-v1`; documentation pass;
  [record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/plan/record.md)
  with exact input manifest and raw outputs. Coverage: three feature Markdown
  files, local links/structure, R1–R6 mapping, scope and approval provenance.
- Code: owner/architecture, web, build and original check/aggregate retained.
  Smells inventory repair complete; isolated baseline/final match (0 passing,
  7 failing each, exit 1); conditional 15-suite host run: 177 passing, 5 failing,
  exit 1. No passing host gate or readiness claim.
  [Repair record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/validation-repair/record.md)
  retains raw references and the approval rejection. No host rerun in this
  metadata handoff.
- Plan review: independent `plan-reviewer`, Ready with no Findings; reviewed
  identity `e8ea041e284c78091dae9c2fa9ef24ae0c98b4ee083aead9f644e325cb3c17d7`.
  Handoff returned in the current conversation; unchanged plan evidence reused.
- Approval: original S1 approved in current conversation; revised validation
  scope explicitly approved in current conversation.
- Planning commit: `ca122e02efa0d6fa675caa7a688a4dad4a56018c`; exact
  three planning paths; staged scope and whitespace checks passed.

## S1 implementation handoff

- Prior implementation handoff state was `IMPLEMENTING`; current feature/S1
  validation replan is `PLAN_APPROVED`. Approved product changes remain
  uncommitted and
  uncommitted. Solution Shape and original seven-path boundary are unchanged.
  Interpretation owns eligibility; Projection owns indexed batch projection;
  the facade retains compatibility assembly and delegates run correspondence.
  No ports/adapters, application factories, dependency or engine changes.
- Retained passes: compile; owner/architecture 102 passing, zero architecture
  violations; web WEB-7–13; production desktop/web build; final qlty aggregate.
  Original full desktop invocation remains failed/hung, never a pass.
- Smells repair: qlty 0.645.0 TRACE refresh exit 0 in both exact preserved
  snapshots; each has 866 accepted File rows across two passes, 433 distinct
  paths matching structure/duplication counts. Path sets match; no processing
  errors. Complete official refreshed SARIF has 151 findings per snapshot,
  matching counterpart records. No new/reliably mapped adverse finding;
  unchanged localization similar-code measurement orientation is advisory.
- Paired isolation: actual Code 1.140.0, same common 185-file load order,
  aliases/development wrapper and fresh profile; baseline/final both completed
  with 0 passing / 7 failing, exit 1. First missing label `1 / 1`, six missing
  root rows, separate null-tag TypeError; no repeated depth-loop termination.
  Failing fixture and 140 emitted runtime dependencies match exactly and reach
  none of the changed schedule modules. Main assigned inherited follow-ups below.
- Previous paired launch rejection was resolved by explicit human approval;
  paired final then ran once. Original rejection remains historical evidence;
  no bypass or repeat. Historical full final6 remains failed/unproven.
- Conditional in-host gate: exact approved 15 files loaded; 15 suites, 182 tests,
  177 passing, 5 failing, 3593 ms, exit 1, no watchdog termination. Failures:
  Markdown typed before-values and immutable locale golden bytes; rendered
  job-group exact key; comparison extra root job-group evidence; command adapter
  cancellation versus successful opener. Raw logs/lines are in the repair record.
  No failure waived, inherited classification inferred, rerun or fix attempted.
  Main investigation/scoped decision required; prior handoff was `IMPLEMENTING`.
- [Original S1 evidence](/private/tmp/ajsbutler-semantic-diff-schedule-facade/implementation-evidence.md),
  [repair record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/validation-repair/record.md),
  and [replan record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/replan/record.md)
  bind retained substantive identities separately from this metadata patch.
- Procedural exception: previous runner preparation used `ln -sfn /tmp/s1r`
  without proving absence. Prior link state is unknown; current link points to
  approved repair storage. Left untouched; no guessed restoration attempted.
- Both independent implementation reviews, current-head Cloud at Exit,
  completion/closure approvals and commits remain pending. Readiness is blocked.

## Readiness and exit ownership

Planning is reviewable; implementation readiness is gated. S1 completes only
when R1–R6, failure/compatibility boundaries and required checks pass, both
independent reviews are Ready, and human completion approval/commit succeed.
At Exit, feature-closer consumes matching slice evidence and current-head gates.
Main routes roadmap item 1 removal and reassesses item 2 entry condition under
closure approval; neither roadmap nor durable-document edits are in S1.
Reusable layering rules already have architecture ownership, so no duplicate
durable narration is needed. Preserve unrelated/inherited feature folders.

## Validation replan review gate

- Independent plan-reviewer: Ready; no Findings, current conversation.
- Reviewed substantive identity:
  `6340dad031653a3ffd306e0fa0d0e9e64a8299220142347ba7abe9f08e709092`.
- Replan evidence reused; renewed approval recorded above.

## Validation replan commit gate

- Commit: `f1096747d38bfead7dae104fd296dcf314999550`.
- Exact paths: selected TASKS.md and TRACEABILITY.md; staged scope and
  whitespace checks passed. Product code remains uncommitted.

## Paired-final host action approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-03).
- Approved scope: one final Table shell integration isolation, same seven tests,
  common 185-file load order, VS Code, aliases and DEVELOPMENT value as baseline,
  fresh isolated profile and 60-second limit. This explicitly approves the
  previously auto-review-rejected action. No completion or closure approval.
- The committed validation replan retains its conditional 15-suite gate;
  results and unchanged-dependency evidence must substantiate that condition.
- Implementer model/effort: gpt-6.1-sol / medium, explicitly requested by user.

## Paired disposition and follow-up ownership

- Main disposition: matching baseline/final seven-test failure signatures,
  same host/load inputs and exit 1; neither run terminated by watchdog.
- Failing fixture and 140 repository runtime dependency modules have identical
  paths/hashes; none of the three changed schedule modules is reached.
- Evidence: validation-repair/table-final-approved.log and status, paired
  baseline log, and validation-repair/paired-import-inspection.json in the
  retained evidence root. The full desktop suite remains unhealthy/unproven.
- Owner: test-harness maintainers for desktop executable/alias/define bootstrap
  limitations; unit-list/webview test maintainers for inherited paired table
  failures and the unresolved historical full-suite React depth loop.
- Preserve these follow-ups through readiness and route durable roadmap entries
  at Feature Exit; no claim that the historical depth loop was reproduced.
- Conditional 15-suite validation was executed once and failed; Main routes
  the five failed assertions for investigation before further implementation.

## Five-failure replan evidence

- [Replan record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/replan-five/revision2/record.md)
  retains the trigger, changed planning inputs, preservation and checks.
- No baseline or host execution occurred in replanning; classifications and
  follow-up assignments for these five are conditional proposals, not findings.
- No Solution Shape, public contract, product dependency or seven-path approval
  boundary changes. Only missing validation evidence/disposition is revised.

## Five-failure investigation review gate

- Independent plan-reviewer: Ready; F1/F2 resolved, no Findings.
- Reviewed substantive identity:
  `53bb94597d5abe49a8e6e586331ce0634e02e5ee6e356a20c812e4587930b324`.
- Investigation approved in current conversation; failed-gate exception not
  authorized.
