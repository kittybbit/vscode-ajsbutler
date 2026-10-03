# Feature Tasks: Semantic Diff Schedule Facade

## Agent Brief

- Purpose: thin schedule compatibility orchestration with unchanged results.
- Active or approved slice: S1 product implementation retained; validation-only
  validation replan approved; replan commit pending.
- Read: [SPECS](SPECS.md), this plan, [TRACEABILITY](TRACEABILITY.md), and
  discovery/validation references below.
- Constraints: preserve facade exports, ordering, optional-property presence,
  legacy low-year rejection, calendars, completeness and duplicate pairing.
  No application projection restructuring or deferred semantics.
- Next route: focused approved replan commit. Completion/closure remain pending.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: approved validation-only replan commit; no review Findings.
  Desktop baseline isolation and complete smells inventories remain required
  evidence, with hard stop conditions below.
- Selected feature: `semantic-diff-schedule-facade`.
- Branch: `codex/semantic-diff-schedule-facade`.
- Fixed base: `fbe562b201ca780d6e0a2add8dff90fa55900d8f`.
- Prerequisites: ownership `49765418` and shared primitives `cdc84f2a` merged.
- Gate evidence: intake, plan documentation and independent Ready review below.
  Human Approval recorded below; planning commit complete; S1 implementation
  retained from IMPLEMENTING. Changed validation scope is approved;
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
  focused replan commit is required before executing the changed validation.
  Previous implementation review/completion evidence: none to invalidate.

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
   loaded suites, nonzero assertion counts, a complete passing Mocha summary,
   exits and profile identities. Use at most 60-second waits and a five-minute
   external run limit; no summary/failing test/loop is unresolved, never pass.
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
- Code: owner/architecture, web and build results retained as below; downstream
  in-host results and desktop baseline disposition pending validation repair.
  Implementer retains the original check/aggregate and supplies only missing
  smells inventory coverage. No product baseline was run during replanning.
- Plan review: independent `plan-reviewer`, Ready with no Findings; reviewed
  identity `e8ea041e284c78091dae9c2fa9ef24ae0c98b4ee083aead9f644e325cb3c17d7`.
  Handoff returned in the current conversation; unchanged plan evidence reused.
- Approval: original S1 approved in current conversation; revised validation
  scope explicitly approved in current conversation.
- Planning commit: `ca122e02efa0d6fa675caa7a688a4dad4a56018c`; exact
  three planning paths; staged scope and whitespace checks passed.

## S1 implementation handoff

- Implementation diff covers the approved schedule interpretation/projection
  and semantic-diff facade paths, plus their characterization/boundary tests.
  Prior S1 state was `IMPLEMENTING`; retained code/evidence is unchanged.
  The changed validation plan is approved `PLAN_APPROVED`; no completion claim.
- Passed: `test:compile`; required host-neutral owner and architecture suites
  (102 passing); web smoke WEB-7 through WEB-13; production desktop/web build.
  Architecture dependency tests report zero violations.
- Desktop gate is unresolved and blocks readiness. The actual isolated VS Code
  1.140.0 run loaded assertions after using a temporary runner wrapper for the
  existing tsconfig aliases and `DEVELOPMENT=true` (the development build's
  existing DefinePlugin value). `tableShellIntegration.test.js:206` raised
  `TypeError: Cannot read properties of null (reading 'tag')`, followed by a
  runaway React “Maximum update depth exceeded” loop. No Mocha completion
  summary was emitted; only the disposable test app was terminated. Main must
  decide the validation repair through replanning before review routing.
- Qlty baseline/final observations report no new mapped findings; the final
  aggregate passed. Full snapshot identities, inventories, statuses, SARIF,
  logs, desktop execution exception, and generated-input manifests are in the
  [S1 evidence record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/implementation-evidence.md).
- Smells complete clean-input path inventories are explicitly unavailable in
  the original evidence; counts and finding paths alone cannot pass this gate.
- Replan evidence: [validation repair plan record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/replan/record.md).
  Original reviewed plan and `ca122e02` commit remain preserved; the previous
  plan review no longer covers changed desktop coverage/evidence commands.
- Current-head Qlty Cloud, independent implementation review, replan commit,
  completion approval, and completion commit remain pending.

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
