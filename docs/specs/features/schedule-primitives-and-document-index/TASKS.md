# Feature Tasks: Schedule Primitives and Document Index

## Current state

- Mode: S1 implementation and validation complete; two independent
  implementation reviewers returned Ready with no actionable Findings.
- S1 final quality: full check retains the same three inherited findings;
  smells retains 151 findings without new issues; aggregate passed. The
  final post-sync evidence supersedes the historical pending note below:
  `/private/tmp/ajs-s1-evidence-oy97lf2l/metadata.json`.
- Active slice: S1, `SLICE_APPROVED`. Completion Approval is recorded below;
  S2 waits for S1's focused completion commit.
- Plan review: Ready for approval, confirmed by independent plan-reviewer
  in the current conversation. All findings are resolved; slice scopes,
  order and validation remain unchanged.
- Approved slices: S1, S2, S3 in the recorded order. The focused planning
  commit is `bc914bfa21ad972a66f7893232d27835c25f6586`.
- Feature: `schedule-primitives-and-document-index`; branch:
  `codex/schedule-primitives-and-document-index`.
- Inspected production baseline: `4976541822b1da44a3e8e0cab7501191e7ea214e`.
- S1 exact predecessor: `bc914bfa21ad972a66f7893232d27835c25f6586`.
- Documentation validation: Markdown and full-repository qlty evidence
  accepted by independent review; final aggregate passed. Main captures
  the final gate-record stabilization under the evidence path below.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-02, Asia/Tokyo)
- Approved scope: the complete S1, S2 and S3 implementation plan, including
  recorded Solution Shape, dependencies, compatibility, validation and exact
  slice boundaries. Completion and Closure Approval remain separate gates.
- Approved paths: each slice's enumerated production/test paths and the three
  selected feature documents. Exact planning-commit paths:
  `docs/specs/features/schedule-primitives-and-document-index/SPECS.md`,
  `docs/specs/features/schedule-primitives-and-document-index/TASKS.md`,
  `docs/specs/features/schedule-primitives-and-document-index/TRACEABILITY.md`.

## S1 Completion Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-02, Asia/Tokyo)
- Approved scope: the exact S1 implementation reviewed Ready by both
  independent implementation reviewers, including its ten changed paths and
  validation evidence. No S2 implementation or closure approval is implied.
- Reviewed identity: `/private/tmp/ajs-s1-evidence-oy97lf2l/metadata.json`;
  review gate annotations are separate metadata under the Evidence Contract.

## Agent Brief

- Purpose: share canonical schedule date/period meaning and normalized document
  indexing, with minimal calendar and schedule-impact integration.
- Read `SPECS.md`, this plan, `TRACEABILITY.md`, SDD validation policy and
  architecture Solution Shape rules before implementation or review.
- Preserve the compatibility matrix below. Characterize before changing each
  boundary; a disagreement with the inspected behavior returns to Main.
- Do not implement before plan review, explicit exact-slice Human Approval and
  the focused planning commit. Each dependent slice waits for its predecessor's
  review, Completion Approval and completion commit.
- No facade slimming, application decomposition, parser/UI/bootstrap changes,
  dependencies, model readonly conversion or inherited WebAPI-feature edits.

## Compatibility and impact evidence

### Date and period contracts

- `ScheduleDate.toUtcDate` already validates canonical Gregorian UTC dates with
  `setUTCFullYear`, including years `0000` through `0099`; reuse it unchanged.
- `parseSemanticDiffComparisonPeriod` independently validates Gregorian dates,
  accepts these low years, preserves supplied strings, and chooses
  `invalid-from`, then `invalid-to`, then `non-increasing`.
- `ScheduleProjection.parsePeriod` guards missing/non-string bounds, accepts
  low years through `ScheduleDate`, and returns invalid/none before rule-zero
  no-runs handling. Missing, impossible, equal and reversed periods stay invalid.
- `semanticDiffScheduleRules.parsePeriod` uses `Date.UTC`, whose 0–99 year
  offset makes canonical years `0000`–`0099` invalid here. Omitted/falsy periods
  yield `not-requested`; supplied invalid periods yield `invalid-period` with
  the original input. Retain this existing low-year restriction as a named local
  consumer compatibility check after canonical validation. Do not duplicate
  Gregorian parsing to reproduce it or silently fix it in this feature.
- Half-open bounds remain `[from, to)` throughout projection and comparison;
  candidate widening for substitution remains unchanged. No host timezone use.
- Direct impact: application period parsing, domain projection and the schedule
  comparison facade. Transitive impact: comparison artifacts, report warnings,
  schedule impact, Explorer/calendar availability, diagnostics and list schedule
  helpers consuming `ScheduleDate`. Their contracts remain unchanged.

### Traversal and lookup contracts

- `AjsDocument.flattenAjsUnits` is recursive root-first preorder, preserves every
  occurrence of a shared object, and has no cycle/depth protection.
  `findAjsUnitById` selects the first occurrence. Leave these APIs and bodies
  unchanged; they also serve diagnostics, list, definition and comparison.
- Calendar `collectUnits` is iterative preorder with global object-identity
  visitation: repeats are skipped, child cycles terminate, distinct objects
  with duplicate ID/path remain distinct. `indexUnits` retains every collected
  match in encounter order. Calendar owns duplicate-path invalidity, unique
  parent resolution, ancestor ID/path cycle checks, group selection and evidence.
- Schedule-impact `unitsById`, `unitsByPath` and `flattenUnits` independently
  traverse recursively in preorder. Index maps select the last occurrence;
  root selection preserves occurrences before ordinal path sorting. Its current
  push-based collector accumulates linearly; substituting the spread-based
  `flattenAjsUnits` would introduce growing accumulated-array copies on wide
  inputs. Move that existing push collector instead. ID and path lookups are
  independent. Preserve exact object identity and stable map-key
  insertion order, including duplicates and ID/path disagreement.
- Shared indexing takes an already selected ordered unit sequence. Calendar
  supplies unique-object traversal; impact supplies existing occurrence
  traversal via `collectAjsUnitOccurrences`. No implicit deduplication,
  ambiguity resolution or cycle policy.
- Child cycles in occurrence traversal currently fail through recursive stack
  exhaustion; preserve the existing collector and characterize `RangeError` on
  a small self-cycle without exact message/stack expectations. Deep occurrence
  traversal remains stack-limited; introducing universal cycle safety or an
  iterative occurrence algorithm requires a separate compatibility decision.
- Direct impact: calendar context construction and schedule-impact root/context
  document lookup. Transitive impact: source references, exclusions, root outcomes,
  run IDs/occurrence ordinals, timelines, reports and calendar facts/counts.

## Solution Shape

### Schedule period meaning

- Owner/layer: `src/domain/schedule/SchedulePeriod.ts` owns canonical increasing
  UTC bounds, half-open meaning and deterministic validation precedence.
- Proposed public contract: `SchedulePeriod` is readonly `{ from: string;
to: string }`; `SchedulePeriodInvalidReason` is the three existing reason
  strings; `parseSchedulePeriod({ from, to })` returns a discriminated valid
  result `{ kind: "valid", period, fromDate: Date, toDate: Date }` with
  preserved string bounds, or `{ kind: "invalid", reason }`. Parsed Date
  objects are call-local; types and exported signatures must be explicit.
- Reuse `ScheduleDate.toUtcDate`; do not introduce branded dates, alternate
  calendars, a Date framework, additional factory or port.
- Boundary value: projection and application parsing consume the same invariant
  while their existing DTO/result translation stays with its current owner.
  `ScheduleProjectionPeriod` and application/domain Semantic Diff period public
  types remain compatible; no downstream DTO migration is required.
- Application parser maps shared validation into its unchanged result contract.
  Projection retains malformed-input guarding and early-result precedence.
  Semantic Diff facade retains not-requested handling and its local low-year
  compatibility restriction; all other validity comes from the shared owner.
- Dependency direction: application and domain services to domain schedule;
  SchedulePeriod to ScheduleDate only. Tests: S1 period and consumer suites.

### Normalized document traversal and index

- Owner/layer: `src/domain/models/ajs/AjsDocumentIndex.ts` owns reusable
  unique-object preorder and ordered duplicate-aware ID/path indexes.
- Proposed public contracts: `collectUniqueAjsUnits(document): AjsUnit[]`;
  `AjsDocumentIndex` with `byId`/`byPath` maps of ordered `AjsUnit[]`;
  `createAjsDocumentIndex(units: readonly AjsUnit[]): AjsDocumentIndex`.
  S3 adds `collectAjsUnitOccurrences(document: AjsDocument): AjsUnit[]`, moving
  impact's existing recursive push accumulation unchanged: root-first preorder,
  repeated references retained, no cycle/depth protection, linear accumulation
  in visited occurrences and stack proportional to hierarchy depth. Index
  construction preserves every supplied occurrence and key insertion order.
- Move the existing calendar collector and bucket helper without changing their
  algorithms. Keep helper export compatibility via direct re-export aliases
  `collectUnits` and `indexUnits` from `ScheduleCalendarIndex.ts`; no forwarding
  wrappers. The moved bucket helper may be named `indexAjsUnits` and reused by
  the concrete ID/path index builder.
- Boundary value: index construction carries normalized document identity/order
  meaning, independently of calendar selection or Semantic Diff DTOs. Two
  concrete traversal contracts reflect existing callers; no options framework.
- Established capability: calendar stack/Set, impact's recursive push collector
  and native Map arrays. `flattenAjsUnits` and its existing callers stay unchanged.
  No custom cache, graph library, service/container or port.
- Calendar context retains its exact map types, duplicate-path derivation,
  hierarchy/source resolution and evidence. Impact retains last-match selection
  locally when converting buckets to existing maps; domain does not select it.
- Lifecycle: new arrays/maps per consumer invocation and comparison side;
  original AjsUnit references retained, no cross-call cache or model mutation.
  Rebuild after document mutation; do not create an invalidation protocol.
- Dependency direction: application and schedule domain to normalized-model
  domain only. No parser data, Node, VS Code, UI, application DTO imports in
  domain. No new/changed adapter, port or application factory is proposed.
- Tests: S2 index/calendar suites and S3 impact/report/artifact suites. Existing
  architecture test is mechanical evidence; semantic ownership/value remain
  independent reviewer judgments.

## Slices and approval boundaries

### S1 — Canonical period validation integrated with existing consumers

- Value: remove duplicated Gregorian and increasing-bound validation while
  preserving each consumer's results. No prerequisites; first slice.
- Production paths: new `src/domain/schedule/SchedulePeriod.ts`;
  `src/application/semantic-diff/parseSemanticDiffComparisonPeriod.ts`;
  `src/domain/schedule/ScheduleProjection.ts`;
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`.
- Changed symbols: period parse helpers and their minimal call sites;
  `parseSemanticDiffComparisonPeriod`, `projectScheduleRuns`, and
  `evaluateSemanticDiffSchedule` retain public signatures/results.
- Test paths: new `src/test/suite/SchedulePeriod.test.ts`;
  `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`;
  `src/test/suite/semanticDiffScheduleRules.test.ts`;
  `src/test/suite/semanticDiffSchedule.test.ts`;
  `src/test/suite/webSmoke.ts` for a bounded actual browser period scenario.
- Characterize before integration: `0000`, `0001`, `0099`, `0100`, `1900`,
  `2000`, `2100`, `9999`; leap/non-leap February and invalid month/day;
  padding/whitespace/trailing tokens; both-invalid precedence; equal/reversed
  bounds; missing/null/non-string projection bounds; missing facade period;
  low-year facade rejection versus application/projection acceptance. Use short
  periods for runs, not a multi-millennium schedule expansion.
- Acceptance: exactly one canonical Gregorian/period implementation; original
  strings and DTOs preserved; malformed-result and rule-zero precedence match;
  from-day runs included and to-day runs excluded; schedule evidence unaffected.
- Validation: focused period/schedule suites, existing schedule-rule helpers,
  architecture dependency suite, shared-host checks and qlty protocol below.
- Readiness/risk: low-year compatibility gate must be visible and tested;
  no correction of legacy acceptance. Review original-input retention and invalid
  result before interpreting no-runs. No period limit or scheduler semantics.
- Approval boundary: listed paths/symbols plus selected feature evidence docs.
  `ScheduleDate.ts` is read-only reuse. Stop if changing it or DTO declarations
  is necessary. No facade restructuring, report/presentation implementation,
  dependency/configuration/durable-document changes.

### S2 — Shared normalized index integrated with schedule calendars

- Value: calendar stops owning general document indexing without changing
  source policy. Ordered after S1 for small sequential review; no semantic
  dependency on period changes. S1 must be committed before work begins.
- Production paths: new `src/domain/models/ajs/AjsDocumentIndex.ts`;
  `src/domain/schedule/ScheduleCalendarIndex.ts`;
  `src/domain/schedule/ScheduleCalendar.ts`.
- Changed symbols: moved collector/bucket helper and
  `createScheduleCalendarContextIndex` construction only. Keep `ancestorsOf`
  and `resolveScheduleCalendarSource` semantics/body outside the edit boundary.
- Test paths: new `src/test/suite/AjsDocumentIndex.test.ts`;
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`;
  `src/test/suite/webSmoke.ts` for a bounded browser calendar/index scenario.
- Characterize preorder across multiple roots/children; empty input; distinct
  duplicate IDs/paths; repeated/shared object roots and children; self/mutual
  child cycles; missing/ambiguous parent, ancestor ID/path cycles, explicit `jc`
  versus containing-group selection. Assert exact references, bucket order,
  duplicate-path flag, status, raw parameters and evidence IDs.
- Acceptance: unique collector visits each object once in encounter order and
  terminates cycles; buckets preserve all supplied occurrences; calendar public
  context contract and selection/hierarchy failures remain identical.
- Validation: index/calendar suites, existing schedule and schedule-rule suites,
  architecture dependency suite, shared-host checks and qlty protocol.
- Readiness/risk: different objects sharing keys are not deduplicated; ambiguity
  stays with calendar. Use a substantial synthetic deep hierarchy for iterative
  collector safety and a wide duplicate-heavy graph for order/reference checks;
  no wall-clock performance threshold or new framework.
- Approval boundary: listed production/test paths and feature evidence docs.
  No edits to AjsDocument helpers, normalized model types, calendar parsing or
  selection algorithms, parser, architecture catalog, or unrelated consumers.

### S3 — Reuse document traversal/index in schedule impact

- Value: remove three local document traversals, reuse normalized indexing and
  preserve schedule-impact facts. Depends on committed S1 and S2.
- Production paths: `src/application/semantic-diff/semanticDiffScheduleImpact.ts`;
  `src/domain/models/ajs/AjsDocumentIndex.ts` (add occurrence collector only;
  preserve S2 unique traversal and index contracts).
- Changed symbols: move local `flattenUnits` into the shared owner as
  `collectAjsUnitOccurrences`, retaining recursive push accumulation; remove
  local `unitsById`, `unitsByPath`. Minimally adapt `rootUnits` and
  `createRootsContext` to build one ordered occurrence list/index per before/after
  document. Derive last-match maps from buckets locally, preserving first key
  insertion order. Root filtering/path sorting remains with application.
- Test paths: `src/test/suite/AjsDocumentIndex.test.ts`;
  `src/test/suite/semanticDiffScheduleImpact.test.ts`;
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`;
  `src/test/suite/webSmoke.ts` for actual browser comparison/artifact equivalence.
- Characterize duplicate ID-only/path-only/both, ID/path disagreement, repeated
  shared object occurrences, nested roots, before/after isolation and rebuilding
  after model mutation. Assert last-hit source identity, root sorting/selection,
  occurrence ordinals, run/source/change references and complete counts.
- Acceptance: schedules, no-runs, partial/uncalculated issues, root/run/timeline
  IDs, source references, order and DTO contents remain equal for representative
  before/after fixtures. Independent period/index capabilities now serve both
  required consumers; no obsolete local traversal remains in impact. Collector
  accumulation stays linear without copies of the growing result array;
  root sorting retains its existing cost.
- Validation: impact and artifact suites; existing schedule/calendar,
  `semanticDiffPresentationArtifacts.test.ts`, `buildSemanticDiffReportData.test.ts`,
  `renderSemanticDiffMarkdown.test.ts`, `semanticDiffJson.test.ts`,
  `semanticDiffExplorerScheduleImpact.test.ts`,
  `scheduleImpactCalendarProjection.test.ts` and architecture suite;
  shared-host checks and qlty protocol.
- Readiness/risk: retain recursion/cycle failure by moving the existing push
  collector; do not substitute unique or spread-copy traversal. Characterize
  occurrence-helper self-cycle RangeError, bounded deep hierarchies and wide
  acyclic inputs with exact occurrence order/count/reference assertions. Review
  verifies one result-array push per occurrence and no growing accumulated-array
  copies; no fragile timing thresholds. Avoid extra end-to-end cyclic evaluation
  that could hang unrelated ancestor logic. No cache/mutation.
- Approval boundary: listed production/test paths and feature evidence docs.
  No DTO/identity/timeline/orchestration-owner redesign or application splitting.

## Validation and evidence requirements

- Add characterization tests before the corresponding replacement, then run
  them unchanged after integration. Use baseline results plus exact expected
  outputs/reference identity, not a copy of the implementation as an oracle.
- Nearest checks: `rtk pnpm run test:compile`, then
  `rtk pnpm exec mocha --ui tdd out/test/suite/<suite>.test.js` for host-neutral
  selected suites, including `architectureDependencyRules.test.js`. Suites
  importing VS Code must run through the desktop harness, not plain Node.
- Each slice changes a shared domain/application contract: require
  `rtk pnpm run test` (desktop preparation and harness),
  `rtk pnpm run test:web` (browser preparation and smoke harness), and
  `rtk pnpm run build` (desktop/web production bundles). Add a small browser
  scenario to the existing smoke runner for each slice; browser bundling alone
  does not execute the new domain boundary suites.
- S1 transitive smoke uses existing schedule/list/diagnostics coverage; S2/S3
  retain their scoped boundary suites. Do not change test/configuration runners,
  package manifest, minimum VS Code version or architecture exceptions.
- Every slice must use `sdd-evidence` inputs: exact predecessor baseline and
  final working-tree snapshot, stated approved paths, name-status/untracked
  inventory, changed exports/imports/layers, commands/exits/raw logs,
  `engines.vscode` before/after, host/Node-import signals and architecture result.
- In exact disposable baseline/final snapshots install existing locked
  dependencies, use qlty >= 0.645.0 and identical configuration/full-repository
  selection; run `rtk pnpm exec qlty check --all --sarif --no-fix` and
  `rtk pnpm exec qlty smells --all --sarif --no-snippets` in both. Save complete
  official SARIF 2.1.0, command output/status, analyzed-path inventory/count,
  configuration hash, version and snapshot identities. Keep caches/output local.
- Compare official SARIF identities, explicit severity order, measured values
  and worse-direction; new or reliably mapped adverse findings are NG.
  Unmappable identity/direction is advisory. Final disposable
  `rtk pnpm run qlty` must pass; synchronize only approved formatting changes
  and recreate/recheck snapshots until stable. Missing/incomplete scans are
  execution failures, never a pass. No repository-specific comparator.
- Planning docs require the same docs-only baseline/final observations and
  final aggregate, plus `rtk pnpm run lint:md` and `rtk git diff --check`.
  Baseline is inspected HEAD; final includes all three untracked feature docs.
  Rebuild final after validation-record edits. No runtime build for this plan.
- Review must distinguish architecture-test facts from Solution Shape judgment.
  Independent implementation review must cover the shared-contract risk and
  exact compatibility matrix; Main arranges an additional independent review
  if required by SDD's higher-risk policy.

## S1 Implementation Evidence

- Changed paths are exactly the approved S1 paths: production
  `src/domain/schedule/SchedulePeriod.ts`,
  `src/application/semantic-diff/parseSemanticDiffComparisonPeriod.ts`,
  `src/domain/schedule/ScheduleProjection.ts`, and
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`; tests
  `src/test/suite/SchedulePeriod.test.ts`,
  `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`, and
  `src/test/suite/webSmoke.ts`. S1 does not edit
  `src/test/suite/semanticDiffSchedule.test.ts`; its existing suite is part of
  validation. No `ScheduleDate.ts`, DTO, package, configuration, README,
  CHANGELOG, or durable architecture file changed.
- Implementation Solution Shape: `ScheduleDate.toUtcDate` remains the sole
  canonical Gregorian UTC date parser. `SchedulePeriod` owns readonly string
  bounds, the increasing-range invariant, validation-reason precedence and
  call-local parsed dates. Application parsing maps the shared result to its
  existing DTO; projection keeps its malformed-input guard and invalid-before-
  rule-zero ordering; Semantic Diff retains its named local year-0000–0099
  compatibility check after shared validation. No port, adapter, factory,
  cache, or dependency was added. The new domain owner imports only
  `ScheduleDate`; application and domain-service consumers depend inward on
  `domain/schedule`.
- Acceptance: pre-integration characterization passed before consumer
  replacement. After integration, `rtk pnpm run test:compile` passed;
  `SchedulePeriod`, application period, schedule-rules, semantic-diff schedule,
  and architecture dependency suites passed (69 tests). Coverage includes
  strict Gregorian dates and centuries, years 0000–9999, preserved strings,
  reason precedence, malformed projection bounds, rule-zero ordering,
  low-year consumer compatibility, and half-open run boundaries.
- Shared-host validation against the final parser: `rtk pnpm run test` exited
  0 on VS Code 1.140.0; `rtk pnpm run test:web` exited 0 and logged WEB-11
  plus WEB-7 through WEB-10; `rtk pnpm run build` exited 0 for desktop and web.
  The web harness logged one ECONNRESET and two ERR_STREAM_PREMATURE_CLOSE
  messages during teardown after all scenarios passed. A sandbox browser launch
  initially failed before tests with macOS MachPort permission denied; the
  authorized elevated rerun passed. Webpack emitted asset/entrypoint-size
  recommendations; no build error occurred.
- Compatibility and readiness: `engines.vscode` remains `^1.75.0`; the new
  production code has no Node built-in or host/UI imports. Desktop and web
  bundles and smoke paths passed. No externally observable behavior, user
  workflow, telemetry, dependency, or support target changed, so README and
  CHANGELOG updates are not indicated. Production readiness awaits final qlty
  evidence and independent implementation review; Completion Approval remains
  pending.
- qlty round-4 evidence uses version `0.645.0`, exact predecessor
  `bc914bfa21ad972a66f7893232d27835c25f6586`, baseline tree
  `481d911fef55b97b3f0c21cb49f6adfb8bb1e9cc`, and configuration SHA-256
  `f551fa47da3ac111a3e29857ff0f431abb0e0a20c17a8c794660c255f4dfb4c2`.
  Inventories were 724/726 for check and 431/432 for smells (baseline/final).
  Smells exited 0 in both snapshots with the same 151 findings; no new or
  adverse movement was found. The check scan contained the same three inherited
  findings plus one TRACEABILITY formatting note; the disposable final
  aggregate exited 0 and formatted only that table row. The formatting is synced
  here; Main's post-sync official comparison and aggregate are pending.
- Raw qlty evidence is under `/private/tmp/ajs-s1-evidence-oy97lf2l/`; raw test
  and build outputs are under
  `/private/tmp/ajs-s1-implementation-evidence/`. Main will add the final
  post-sync check result and metadata reference after stabilization.

## Risks, production readiness and deferred work

- No user behavior, dependencies, APIs, configurations or support targets change.
  Maintain `engines.vscode: ^1.75.0` and host-neutral production imports.
- Preserve parser/list/flow/CSV/definition/diagnostics/hover/navigation/WebAPI,
  comparison/report and telemetry behavior. No content/path telemetry is added.
- Large and malformed inputs have the existing consumer-specific failures;
  occurrence recursion remains a known limitation, while calendar collection
  retains its existing iterative safety. Improving failure behavior is deferred.
- README, CHANGELOG, use cases, architecture and roadmap require no edit for
  this internal behavior-preserving foundation; existing durable ownership rules
  already cover it. Reassess at review/exit. Any observable behavior correction
  requires Main's scope decision and replanning, including changelog evaluation.
- Deferred owners remain roadmap `semantic-diff-schedule-facade` and
  `semantic-diff-application-projection`; presentation, readonly and architecture
  restructuring retain their separate roadmap entries. No completed/unrelated
  or inherited feature slice is changed by this plan.
- Before S1 runtime edits, Main must rename/recreate the docs branch as a
  dedicated feature branch outside `docs/...`; docs-only branch allowlist does
  not permit these production/test changes. This is a routing prerequisite,
  not authorization for runtime editing.
- Stop for new semantics, ownership/contracts, files outside the slice,
  framework/dependency/cache decisions, untestable equivalence or invalidated
  compatibility evidence; route exact issue to Main for Replanning.

## Validation state and gate readiness

- Markdown: `rtk pnpm run lint:md` passed with 38 files and zero errors;
  `rtk git diff --check` passed. This evidence follow-up changes only TASKS.md;
  SPECS.md, TRACEABILITY.md, slice boundaries and approval fields are preserved.
- Design review resolved the S3 traversal finding. Independent review accepted
  the exact round 3 content and evidence and returned Ready for approval.
  Final gate-record metadata, raw SARIF, comparison logs, inventories and
  aggregate outputs are under `/private/tmp/ajs-approved-plan-bh6wi1lf/round4/`,
  with `metadata.json` as the evidence entry point.
- Baseline tracked tree exactly matches inspected HEAD tree
  `d30b9dd25d30da2f90091e79d6401c283abe6d50`. Qlty version is 0.645.0;
  baseline/final configuration SHA-256 is
  `f551fa47da3ac111a3e29857ff0f431abb0e0a20c17a8c794660c255f4dfb4c2`.
  Earlier startup and dependency failures are resolved.
- Full check analyzed 721 baseline and 724 final paths: identical original
  paths plus the three feature documents. Both exited 1 due to the same three
  existing findings; official SARIF check comparison is identical.
- Full smells analyzed 431 paths in each snapshot, matching original workspace
  canonical selection; both exited 0 with 151 findings. Identity, severity,
  message, location, mass, threshold and structural hash are unchanged; only
  two measured `actual` values moved favorably from 17 to 15. No new or mapped
  adverse finding was identified by the accepted evidence review.
- Existing inherited `report/` ignore behavior is a canonical-selection advisory,
  not a new exclusion or scope change. Raw inventory and selection diagnostics
  are in the metadata; no configuration modification is proposed.
- Final disposable aggregate exited 0. Logs are `final-aggregate.stdout` and
  `final-aggregate.stderr` in the final evidence directory. Full observations,
  inventories and official comparisons support this result; aggregate success
  is not used alone as proof of quality.
- Plan-review Ready and Human Approval are recorded. Main verifies this final
  gate record against the exact snapshot before routing the planning commit.
  Human Approval covers S1–S3 as recorded above; Completion and Closure Approval
  remain separate pending gates.
- Feature Exit requires all three completion commits, full acceptance evidence,
  qlty local/current-head cloud pass, durable-document/changelog reassessment,
  assigned remaining risks and independent exit review. No exit is performed here.
