# Feature Tasks: Semantic Diff Schedule Facade

## Agent Brief

- Purpose: thin schedule compatibility orchestration with unchanged results.
- Active or approved slice: S1 approved; awaiting planning commit.
- Read: [SPECS](SPECS.md), this plan, [TRACEABILITY](TRACEABILITY.md), and
  discovery/validation references below.
- Constraints: preserve facade exports, ordering, optional-property presence,
  legacy low-year rejection, calendars, completeness and duplicate pairing.
  No application projection restructuring or deferred semantics.
- Next route: approved planning commit. Runtime/tests/configuration edits require
  exact Human Approval and a focused planning commit first.

## Current state

- Lifecycle state: PLAN_APPROVED
- Next decision / blocker: approved planning commit; no review Findings.
- Selected feature: `semantic-diff-schedule-facade`.
- Branch: `codex/semantic-diff-schedule-facade`.
- Fixed base: `fbe562b201ca780d6e0a2add8dff90fa55900d8f`.
- Prerequisites: ownership `49765418` and shared primitives `cdc84f2a` merged.
- Gate evidence: intake, plan documentation and independent Ready review below.
  Human Approval recorded below; no planning commit or completion yet.

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
rtk pnpm run test:desktop:run
rtk pnpm run test:prepare:web
rtk pnpm run test:web:run
rtk pnpm run build
```

The desktop runner covers its complete suite; the web runner bundles existing
`webSmoke.ts`, which exercises browser semantic comparison/calendar and
schedule-impact. Host smoke does not substitute for the owner regressions.
If a host-free downstream suite actually requires VS Code, use its same suite
in the required desktop run and record the coverage correction through Main;
do not silently report a failed standalone invocation as a pass. Known roadmap
expanded-Flow golden mismatch is not waived: a required failing suite blocks
readiness until Main records a permitted resolution/replan or external owner.

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
- Code: not executed; S1 required coverage above. No baseline scans performed
  for planning. Implementer owns one baseline/final set retained through Exit.
- Plan review: independent `plan-reviewer`, Ready with no Findings; reviewed
  identity `e8ea041e284c78091dae9c2fa9ef24ae0c98b4ee083aead9f644e325cb3c17d7`.
  Handoff returned in the current conversation; unchanged plan evidence reused.
- Approval: S1 approved in current conversation; planning commit pending.

## Readiness and exit ownership

Planning is reviewable; implementation readiness is gated. S1 completes only
when R1–R6, failure/compatibility boundaries and required checks pass, both
independent reviews are Ready, and human completion approval/commit succeed.
At Exit, feature-closer consumes matching slice evidence and current-head gates.
Main routes roadmap item 1 removal and reassesses item 2 entry condition under
closure approval; neither roadmap nor durable-document edits are in S1.
Reusable layering rules already have architecture ownership, so no duplicate
durable narration is needed. Preserve unrelated/inherited feature folders.
