# Feature Tasks: Schedule Primitives and Document Index

## Current state

- Mode: S3 implementation validation. Replan commit
  `73a63ab6148eecf2a861d37e126e2765f820c88c` approved only the formatter's
  table-width normalization in `.agent.md` and `docs/specs/README.md`.
  Formatting and affected quality checks are complete; targeted documentation
  validation is recorded below.
  S2 completed two independent Ready reviews and the counter-record repair.
  S1's two independent reviewers returned Ready with no actionable Findings.
- S1 final quality: full check retains the same three inherited findings;
  smells retains 151 findings without new issues; aggregate passed. The
  final post-sync evidence supersedes the historical pending note below:
  `/private/tmp/ajs-s1-evidence-oy97lf2l/metadata.json`.
- Active slice: S3 is implemented on the renewed approved scope and returned to
  Main for independent implementation review; the original implementation
  remains within its recorded approval boundary;
  predecessors S1 and S2 are `SLICE_COMMITTED`. S3 comparison base:
  `573847284dc5885a7552eda0e36358b005146c55`.
- S2 completion commit: `573847284dc5885a7552eda0e36358b005146c55`;
  exact eight-path commit, staged checks passed; no product checks rerun.
- S2 approval provenance: the recorded Human Approval covers the complete
  reviewed plan; S2's exact production/test paths are the S2 boundary below.
- S2 review identity: substantive tree
  `610ee04de33b4b1009e2b245c0163cd450805ee3`; validation and counter repair:
  `/private/tmp/ajs-s2-evidence-20261002/metadata.json`. Current-state and
  dispatch-counter annotations are separate metadata, outside the full scans.
- S1 completion commit: `259113106e70ec8c201a9687987b6526bed9bd7d`;
  focused ten-path commit, staged checks passed. Integration quality evidence:
  `/private/tmp/ajs-s1-integration-refresh-20261002/metadata.json`.
- Original plan review: Ready for approval, confirmed by independent
  plan-reviewer in the current conversation. It remains applicable to unchanged
  scope; it does not cover the two added S3 formatting paths.
- Original approved slices: S1, S2, S3 in the recorded order. The focused planning
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

## S3 Formatting Replan And Implementation Handoff

- Independent plan review: Ready for approval, no actionable Findings. Reviewed
  substantive plan patch SHA-256:
  `4251009cebf8671086ad1b90681ba50062b6772b4dc1296a22060f7ef3a99809`.
  Reviewed metadata patch SHA-256:
  `bc717ac93d218efb05d08c75795d4642f2da3d721abb34d96dec0c4d1d7329da`.
  This plan verdict does not clear the S3 implementation quality gate.

- Approved scope: retain the original S3 production/test and feature-document
  boundary; add only formatter-produced table column width normalization in
  `.agent.md` and `docs/specs/README.md`. No wording, policy, semantic, link,
  heading, directive, configuration or behavior change is authorized by this
  replan. Renewed Human Approval: Approved in this conversation
  (2026-10-03, Asia/Tokyo), user message: "承認します。".
- Existing Human Approval above remains the original provenance for S1–S3.
  It does not authorize these two added paths. S1 and S2 completion approvals,
  commits, and matching evidence are preserved. Do not rewrite their approvals.
- The original plan Ready/approval/commit did not cover the widened S3 boundary.
  Independent plan review, renewed Human Approval and the focused replan commit
  are now recorded above. The two S3 implementation reviews accepted the
  existing semantic/compatibility work but returned qlty P2 Findings on their
  inspected inputs. Preserve those judgments; neither reviewed the added paths.
  Return the integrated S3 slice for independent implementation review after
  this formatting repair and affected quality refresh, reusing matching
  semantic/compatibility judgments and product evidence.
- No S3 Completion Approval or completion commit exists. They and Feature Exit
  remain later gates; this replan neither grants approval nor clears the P2.

### S3 replan documentation evidence

- Record: `/private/tmp/ajs-s3-format-replan/metadata.json`. Only TASKS.md and
  TRACEABILITY.md changed in this replan; SPECS.md, all existing S3 code/tests,
  and both added durable paths were preserved. Before-doc copies and exact
  replan-only diffs are retained there; input patch identity is recorded above.
- Substantive final full-repository manifest SHA-256:
  `cdac3803c40f1e18ef00df92b02c91d4926010c731578a50f05cec95f006af46`.
  It differs from the retained paired final only in these two planning docs.
  Qlty 0.645.0, configuration/lock hashes and full selection remain unchanged;
  matching inventories (check 712, smells 433 paths) and baseline records are
  retained, not regenerated. Product and smells inspected inputs still match.
- Affected final full check completed with six official SARIF results, exit 1
  due to findings: the five retained paired-baseline findings plus one new
  `markdownlint:fmt` on `.agent.md`. No planning-path finding exists. This does
  not supersede the controlled paired reproduction's two new formatter records
  or clear strict quality: both exact pending repairs remain proposed above.
  Final disposable aggregate passed, exit 0, and changed no tracked input.
  Aggregate success is not a clean full-check result or an approval substitute.
- Documentation checks passed: `rtk pnpm run lint:md` (30 files, zero errors)
  and `rtk git diff --check`. One initial MD013 line-length failure was repaired.
  This evidence/status annotation is a separate metadata patch after the
  immutable substantive manifest; validate it with targeted non-mutating lint
  and diff/scope checks, without claiming full scans covered the annotation.
- Planner executions: full check one completed plus one sandbox log-appender
  startup failure, final aggregate one, full smells zero (matching reuse),
  product tests/builds zero, Markdown lint two before this annotation; baseline
  recreations zero. Annotation validation adds one lint and one diff check.
  Exact Git status/diff inspection total is unknown; replan patch/scope and
  unchanged product hashes are recorded in the evidence. Main owns dispatch,
  human gate and review counters. No implementation, staging or commit occurred.

### S3 Post-repair Validation

- Status: `SLICE_APPROVED`; two independent implementation reviewers returned
  Ready with no actionable Findings. Explicit S3 Completion Approval is recorded
  below; its focused completion commit is pending.
- Reviewed base-to-worktree patch SHA-256:
  `f3853cf10135a85c669f78f447138b08aea278953e3579c99bf198d4c33f9cf5`.
  Review covers the ten-path cumulative S3 diff plus validated gate metadata.
- Both reviewers accepted the metadata exception: post-scan TASKS delta is
  approval/status/evidence only; no scope, acceptance, command or risk change.
  Independent derived delta SHA-256:
  `8b431e2caddb0a75920496095fa6ecae19771dfaaa3bfcf37d2048bfbf1aa96e`.
- Main counters: three implementer dispatches; four implementation-review
  dispatches; one planner, one plan-reviewer and one replan-committer dispatch.
  One renewed Human Approval and one replan commit; one S3 Completion
  Approval, one completion-committer dispatch and zero completion commits.
  Main ran no product checks or full scans.
  This Ready annotation adds one targeted Markdown lint and diff check.
- The formatting output is byte-identical to the retained official qlty
  formatter copies. Before hashes: `.agent.md`
  `71501e949a4afc40ff7a0d976fd4fd3d7730d7b6484f221e0b382b8505c41255` and
  `docs/specs/README.md`
  `37472dce5811d1703da9c4c29c9e887d0cf5aa3b5d901a87d2c68cb73a42e2da`.
  Formatted hashes: `.agent.md`
  `9e919e9f31d3830d6f2664d94f5b09996af9695789c7c5021015d0d947866282` and
  README `cfefc612b8830607e5ae6bc833bdaa70d937202931baaa8da56c45b64c39b28f`.
  The diff is one table in `.agent.md` and two tables in README; cell text,
  links, ordering, surrounding content and document topology are unchanged.
- Final qlty `check --all --sarif --no-fix` completed with three results and
  exit 1: the three retained exact-base records. It removes the two baseline
  `prettier:fmt` records, and neither of the paired-final `markdownlint:fmt`
  records remains. No new SARIF result is present. Baseline/final raw SARIF,
  final manifest, command outputs and aggregate logs are in
  `/private/tmp/ajs-s3-format-final-evidence/`; the retained paired evidence is
  under `/private/tmp/ajs-s3-implementation-evidence/paired/`.
- Qlty version is `0.645.0 macos-arm64 (70886ba 2026-09-23)`, markdownlint
  plugin `0.41.0`; configuration SHA-256
  `f551fa47da3ac111a3e29857ff0f431abb0e0a20c17a8c794660c255f4dfb4c2`, lock
  SHA-256 `c4e91db0c1ab2176f06484a970dd735b6bb87654213c2dba612805144b6f1de8`.
  Full `--all` selection and 712-path check inventory match the retained
  evidence. The scanned pre-annotation snapshot has 749 files and manifest
  SHA-256
  `07a718e3951fa587cbba218e02d5178144cec8d7202ddd46544fb93676e22b72`.
- The disposable final aggregate passed with exit 0 and changed no tracked
  files. Prior 148 focused tests, desktop and web suites, and desktop/web builds
  remain valid because runtime and test inputs did not change. VS Code minimum
  remains `^1.75.0`; no user-facing behavior, changelog, or traceability mapping
  changed. Final documentation validation passed: `rtk pnpm run lint:md`
  checked 30 files; targeted markdownlint checked four files; the diff check
  from the S2 comparison base passed.
- Repair execution counters: two full-check attempts (one startup failure,
  exit 99; one completed finding-triggered check, exit 1); one aggregate pass;
  two Markdown lint commands passed; one base diff check passed. No product
  test/build or baseline recreation was needed.

## S3 Completion Approval

- Status: Approved
- Provenance: user message "承認します。" in this conversation
  (2026-10-03, Asia/Tokyo), responding to the exact S3 completion request.
- Scope: the complete S3 implementation and approved formatter-only repairs,
  reviewed Ready by both independent reviewers; no feature closure is implied.
- Reviewed cumulative patch SHA-256:
  `f3853cf10135a85c669f78f447138b08aea278953e3579c99bf198d4c33f9cf5`.
- Evidence: `/private/tmp/ajs-s3-format-final-evidence/metadata.json` plus
  separately validated Main Ready and Completion Approval metadata patches.
- Exact completion commit paths: `.agent.md`, `docs/specs/README.md`, this
  TASKS.md, `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  `src/domain/models/ajs/AjsDocumentIndex.ts`,
  `src/test/suite/AjsDocumentIndex.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`, and
  `src/test/suite/webSmoke.ts`. TRACEABILITY.md is already in the replan commit.
- This approval annotation adds two targeted Markdown lint and diff checks,
  including one line-length correction. No product checks or full scans rerun.

## S1 Completion Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-02, Asia/Tokyo)
- Approved scope: the exact S1 implementation reviewed Ready by both
  independent implementation reviewers, including its ten changed paths and
  validation evidence. No S2 implementation or closure approval is implied.
- Reviewed identity: `/private/tmp/ajs-s1-evidence-oy97lf2l/metadata.json`;
  review gate annotations are separate metadata under the Evidence Contract.

## S2 Completion Approval

- Status: Approved
- Approved at: approved in current conversation (2026-10-03, Asia/Tokyo)
- Approved scope: the exact eight-path S2 implementation reviewed Ready by
  both independent reviewers, including the targeted counter-record repair.
  S3 implementation remains within the existing plan approval; its completion
  and feature closure remain separate gates.
- Reviewed identity: substantive tree
  `610ee04de33b4b1009e2b245c0163cd450805ee3`, with separately validated counter
  and Main gate annotations in `/private/tmp/ajs-s2-evidence-20261002/`.

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
- For the widened S3 scope, implement only the two exact table-format diffs
  below after renewed gates. Preserve all other content and existing S3 work.

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
  The proposed formatting addition below is pending renewed approval.

### S3 formatting addition and affected evidence

- Trigger/value: strict any-new-SARIF policy blocks S3 completion on two
  `markdownlint:fmt` records. Normalize the existing table widths so required
  final quality observations can stabilize without changing durable policy.
  Keep this correction within S3; it has no product dependency or design change.
- Exact added surfaces: `.agent.md` Concern/Owner table (one hunk);
  `docs/specs/README.md` Lifecycle State Contract Input state/Operation/Output
  table and Evidence Contract Record/Producer/Consumers table (two hunks).
  Use only the official formatter outputs in
  `/private/tmp/ajs-s3-implementation-evidence/paired/final/agent-format.diff`
  and `readme-format.diff`. Padding spaces and separator dash widths may change;
  preserve cell text, order, links, row count, and surrounding Markdown exactly.
  No other durable path or table, README.md, CHANGELOG.md, product, test,
  configuration, dependency or generated edit is added.
- Complete proposed S3 boundary: the six production/test paths enumerated above,
  the three selected feature documents, and only the specified tables in
  `.agent.md` and `docs/specs/README.md`. Actual original S3 implementation has
  eight modified paths (six production/test paths, TASKS.md, TRACEABILITY.md);
  SPECS.md stays unchanged. Only the two formatting paths are new work.
- Solution Shape: all approved domain/application owners, occurrence/index
  contracts, dependency directions, tests and per-call lifecycle remain as
  recorded. No material abstraction, port, adapter, retained application
  factory, framework choice or custom gap changes. Existing markdownlint
  formatting is sufficient. Automatic architecture-test facts and reviewers'
  semantic ownership judgments remain separate retained evidence.
- Durable Documentation Gate: both documents retain existing reusable
  repository routing/policy. The smallest necessary table surfaces change
  only formatting; no new content, duplicated policy, feature history or
  investigation narrative is propagated. No README.md/CHANGELOG/use-case,
  architecture or roadmap update is needed for this correction.
- Discovery identity: fixed S3 base
  `573847284dc5885a7552eda0e36358b005146c55`; preserved pre-replan eight-path
  annotation patch SHA-256
  `878dd5fa1c969637ae7af0a7930e0a55abee4849093d54d17af5d4812dc25001`.
  Complete evidence: `/private/tmp/ajs-s3-implementation-evidence/metadata.json`;
  controlled `paired/baseline/check.sarif` and `paired/final/check.sarif`.
  One fresh-cache paired full check used qlty 0.645.0, markdownlint 0.41.0,
  identical configuration/lock and full 712-path selection: baseline five,
  final seven findings, adding these two formatter records. Identical source
  hashes or a passing prior aggregate do not dispose of the new findings.
- Acceptance: exact approved formatter hunks only; no non-format content or
  rendering structure change; neither formatter record remains new in the
  refreshed official full-check comparison; no other new/adverse finding;
  final aggregate passes and final observed content remains stable.
- Validation after renewed approval: preserve the matching paired baseline;
  refresh final `rtk pnpm exec qlty check --all --sarif --no-fix` and final
  disposable `rtk pnpm run qlty`, with complete official SARIF/log/status,
  full selection/inventory, configuration/version and exact final manifest.
  Observe before aggregate; if aggregate changes inspected content, sync only
  approved paths and refresh affected observations until stable. Refresh final
  check for substantive planning-doc inputs as well; do not claim old full
  scans cover the new plan or widened approved path set.
- Reuse individual tests, desktop/web/build, architecture and smells evidence
  only when their own inspected inputs, coverage, commands, tool/configuration
  remain matching. The two Markdown formatting paths and plan changes do not
  change product or code-smells inputs; bind reuse explicitly to those input
  sets and the original substantive identity. Update path-set/scope metadata
  separately; do not claim the original record approved or scanned new docs.
  No product test/build or smells rerun is required solely for this docs change.
- Focused documentation checks: run non-mutating Markdown validation covering
  both added files and selected feature docs, plus `rtk pnpm run lint:md` and
  `rtk git diff --check`; inspect exact diff and before/after table cell content.
  Record separate replan and later implementation patch identities/counters.
- Readiness/risk: renewed review and Human Approval must precede writes to added
  paths. Stop if formatter output changes wording, table topology or any other
  surface; return to Main rather than broaden silently. S1/S2 order and commits
  are unchanged. New strict quality findings still block completion.

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

## S2 Implementation Evidence

- Changed paths are exactly the approved S2 implementation boundary plus its
  feature evidence records: new `src/domain/models/ajs/AjsDocumentIndex.ts`,
  `src/domain/schedule/ScheduleCalendarIndex.ts`,
  `src/domain/schedule/ScheduleCalendar.ts`, new
  `src/test/suite/AjsDocumentIndex.test.ts`,
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`,
  `src/test/suite/webSmoke.ts`, this file, and `TRACEABILITY.md`. `SPECS.md`
  remains unchanged. No parser/model helpers, application consumers,
  architecture catalog, configuration, package manifest, README, or CHANGELOG
  changed.
- Implementation Solution Shape: `AjsDocumentIndex` in normalized-model domain
  owns the existing iterative, root-first unique-object preorder collector and
  duplicate-preserving ID/path buckets over an already selected sequence.
  It retains the same stack/`Set` traversal, `Map` insertion order, unit
  references, and per-call arrays/maps. `ScheduleCalendarContextIndex` reuses
  that index and adds its existing duplicate-path fact. Calendar ambiguity,
  parent resolution, source selection and evidence remain calendar-owned;
  `ancestorsOf` and `resolveScheduleCalendarSource` are unchanged. Existing
  `collectUnits`/`indexUnits` exports are direct re-export aliases, not wrappers.
  No port, adapter, factory, cache, dependency, or custom mechanism was added.
- Acceptance: pre-move characterization passed unchanged after integration.
  `AjsDocumentIndex.test.ts` covers empty input, multi-root root-first preorder,
  shared objects, self/mutual cycles, exact object references, distinct
  duplicate IDs/paths, key and bucket order, a 4,096-child duplicate-heavy graph,
  and a 20,001-node hierarchy. Calendar tests retain explicit-versus-containing
  `jc`, hierarchy/ambiguity failures, evidence and duplicate-path behavior, and
  assert distinct duplicate matches remain in encounter order.
- Validation: `rtk pnpm run test:compile` passed. Focused index, calendar,
  schedule, schedule-rule and architecture dependency suites passed (99 tests).
  `rtk pnpm run test` passed on VS Code 1.140.0. `rtk pnpm run test:web`
  passed WEB-12's actual browser document/calendar-index scenario and WEB-7
  through WEB-10. Web teardown logged EPIPE and
  ERR_STREAM_PREMATURE_CLOSE after all scenarios passed, matching the previous
  S1 harness behavior. `rtk pnpm run build` passed for desktop and web with
  existing webpack asset/entrypoint-size recommendations. `engines.vscode`
  remains `^1.75.0`.
- Compatibility and risks: changed production source imports only normalized
  domain types and uses no Node, VS Code, UI, parser, application DTO or
  telemetry capability. Large/deep and malformed calendar selection behavior
  remains consumer-owned and covered; unique traversal terminates object cycles
  while distinct objects with matching keys remain separate. Schedule-impact
  occurrence traversal and its stack-limited cycle behavior remain for S3.
  No observable behavior, API selection policy, user workflow, dependency or
  support target changed. Existing architecture ownership is sufficient, so no
  README/CHANGELOG or other durable-document update is needed.
- qlty 0.645.0 exact-snapshot comparison used the same full-repository
  selection/configuration (`f551fa47da3ac111a3e29857ff0f431abb0e0a20c17a8c794660c255f4dfb4c2`):
  baseline check 6 results/710 paths (exit 1, findings-triggered), final check
  5 results/712 paths (exit 1). All five final results match baseline; one
  baseline Markdown formatter note on unchanged `docs/specs/README.md` is
  absent, and there is no new result.
  Baseline/final smells each have 151 results, with 432/433 paths respectively
  (both exit 0; no new or mapped adverse finding). The final aggregate passed.
  Complete SARIF, logs, inventories, snapshot identities, and cache/output
  records are under `/private/tmp/ajs-s2-evidence-20261002/metadata.json`.
- Review/readiness: implementation is limited to S2 and is ready for the
  independent implementation review. The shared-domain contract is a higher-
  risk surface; Main routes the required independent reviews. Completion Approval
  and the S2 commit remain separate gates.

### S2 Workflow Counters

- Main-owned gates and delegations: one inherited Human Approval applies to
  the complete plan and all slices; two S2 implementer dispatches (initial
  implementation and this Finding repair); three review dispatches (two
  independent reviews and one targeted counter-repair review); one Completion
  Approval, one completion-committer dispatch and one successful completion
  commit (`573847284dc5885a7552eda0e36358b005146c55`).
- Producer test/build executions in retained evidence: test compilation 2
  (initial and after formatting sync), focused/architecture suite 1 (99 tests),
  desktop suite 1, web suite 1, build 1. Markdown lint has three earlier logs;
  this metadata-only repair adds one targeted lint run. Exact producer Git
  status/diff inspection counts are unknown; no history-collection pass was
  added. The repair adds one targeted `git diff --check` execution.
- Main executions during S2: zero product tests, builds or qlty runs; six Git
  status/diff inspections (initial diff check, post-handoff status and final
  gate-annotation diff check, approval-entry status and approval-annotation
  diff checks including an annotation correction), one additional Git HEAD
  inspection, and four Markdown-lint runs (initial state, final gate annotation,
  Completion Approval and its annotation correction).
- qlty executions: baseline check 1 and smells 1; final full check 4 and smells
  3; one captured final aggregate success, with one status-capture retry. The
  baseline was reused, not recreated. Check exit 1 is findings-triggered; it
  is not an execution failure. Superseded changed-files-mode and preflight
  attempts are listed in the evidence metadata.
- Evidence refresh reasons: baseline scans were reused (zero recreations); one
  test-compilation rerun followed approved formatting sync. Four final full
  checks and three final full smells observations are recorded, including
  refreshes for formatter sync and the corrected full-repository invocation;
  the final check also covered its evidence-note edit. The final smells input
  set was unchanged by that Markdown-only edit and reused. No product test,
  build, or full scan was rerun after this counter repair. The complete
  reason/count record is in `/private/tmp/ajs-s2-evidence-20261002/metadata.json`.
- S2 rollup: producer and Main counts above are separated by owner; feature-wide
  aggregation awaits Feature Exit after the remaining slices.

## S3 Implementation Evidence

- Changed paths are exactly the approved S3 implementation boundary plus its
  feature evidence records: `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  `src/domain/models/ajs/AjsDocumentIndex.ts`, `src/test/suite/AjsDocumentIndex.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`,
  `src/test/suite/webSmoke.ts`, this file, and `TRACEABILITY.md`. `SPECS.md`
  remains unchanged. No parser/model helper, DTO, presentation, report, adapter,
  architecture catalog, configuration, package manifest, README, or CHANGELOG
  changed.
- Solution Shape: normalized-model domain owns `collectAjsUnitOccurrences` as
  the existing recursive root-first push traversal, retaining repeated object
  occurrences and its stack-limited `RangeError` cycle behavior. Impact builds
  one occurrence list and `AjsDocumentIndex` per before/after document. The
  application converts duplicate-preserving ID/path buckets to last-match maps,
  retaining first-key insertion order; root filtering and path sorting remain
  application-owned. S2's unique traversal, index contracts, and calendar
  source policy are unchanged. No port, adapter, factory, cache, dependency, or
  custom mechanism was added. Architecture test facts are recorded separately
  from the independent review of semantic ownership and abstraction value.
- Acceptance: pre-integration characterization passed unchanged after impact
  integration. Tests assert occurrence and root order, shared references,
  ID/path disagreement, last-hit source identity on each side, duplicate-ID
  candidate selection, model-mutation rebuild, run IDs and references, and
  exact counts. The occurrence helper has a 4,096-child wide case, a bounded
  128-level deep case, and a self-cycle `RangeError` assertion without depending
  on its message or stack. `WEB-13` compares actual browser-produced schedule
  changes and presentation artifacts against expected IDs, times, and source
  references.
- Validation: baseline characterization compiled and passed 31 focused tests;
  its first run exposed and corrected an expected fixture path, then the same
  characterization passed. `test:web` passed WEB-13 before impact integration.
  Post-integration `test:compile`, 148 host-neutral focused tests including the
  architecture dependency suite, the full desktop suite, elevated VS Code Web
  suite, and desktop/web production build passed; compilation, desktop, browser,
  and build checks were repeated after qlty formatting and after the local
  last-hit helper simplification. Direct Mocha attempts for suites requiring
  the VS Code host or resource aliases failed as expected outside their host;
  the desktop harness passed. Default browser attempts failed before scenarios
  (first asset-fetch `ETIMEDOUT`, later macOS Chromium Mach-port permission);
  elevated retries passed. Build emitted webpack bundle-size recommendations
  without errors. Raw outputs are under
  `/private/tmp/ajs-s3-implementation-evidence/`.
- Compatibility and readiness: `engines.vscode` remains `^1.75.0`. New imports
  point only to normalized domain code; no Node built-in, VS Code, UI, parser,
  application DTO, or telemetry dependency entered domain. The recursive
  collector keeps one result-array push per occurrence and no growing-array
  copies; ID/path indexing is per-call and retains input references. Deep input
  remains stack-limited by design. No schedule facts, no-runs, partial or
  uncalculated outcomes, report JSON, IDs, source references, telemetry, or
  user workflow changed. README and CHANGELOG changes are outside the current
  S3 approval. The independent review found no semantic, scope, or compatibility
  issue; its qlty P2 is reproduced below. Main directed preparation of a
  minimal S3 replan for formatter-produced table-width normalization in
  `.agent.md` and `docs/specs/README.md`, without policy/content changes,
  pending independent plan review and renewed Human Approval. No such
  out-of-boundary edit was made. Completion Approval and commit remain pending.
- qlty `0.645.0` used configuration SHA-256
  `f551fa47da3ac111a3e29857ff0f431abb0e0a20c17a8c794660c255f4dfb4c2`,
  dependency lock SHA-256
  `c4e91db0c1ab2176f06484a970dd735b6bb87654213c2dba612805144b6f1de8`, and
  full-repository `--all` selection. Exact S3 baseline is commit
  `573847284dc5885a7552eda0e36358b005146c55`, tree
  `5a45c8143e2aa69e6350e3a3687749f8bf4e46b7`; its check was reproduced once
  after the final scan showed a formatter note on an unchanged path. Final
  scans used that same HEAD plus the eight-path implementation patch, whose
  pre-evidence-note binary diff SHA-256 was
  `25833b8e0d18605c804909b3e45f6fa0adf97217341604c026f9a6e934477b8b`.
  Check/smells inventories were 712/433 paths in both snapshots; path lists
  are reused from S2 because S3 has no path additions, deletions or renames.
  The earlier exact-base check had six results and final had seven. One
  controlled paired reproduction then used fresh snapshot-local caches with
  the same qlty `0.645.0`, markdownlint `0.41.0`, config/lock hashes, and full
  `--all` selection: baseline had five results and final had seven. The final
  adds official `markdownlint:fmt` records on unchanged `.agent.md` and
  `docs/specs/README.md`; the baseline has neither. Both records have no SARIF
  region, and all five baseline records also appear in final. Source hashes
  match across snapshots. Qlty's formatter driver ran `markdownlint --fix` on
  both files in temporary copies; read-only diffs show table-width changes on
  both baseline and final copies. No repository file outside S3's approved
  paths was written. The strict new-finding rule blocks this slice; Main owns
  the separately scoped replan. No S3-path check finding exists. Full smells
  returned 151 baseline-reused/final results with no impact-module finding; an
  earlier final complexity warning was removed by the local helper
  simplification and rechecked. The previously completed final disposable
  aggregate exited 0, but does not clear the full-check gate. Paired SARIF,
  invocation/plugin/cache records, formatter diffs, source hashes, inventories,
  counters, and post-scan metadata validation are in
  `/private/tmp/ajs-s3-implementation-evidence/metadata.json`.

### S3 Workflow Counters

- Main-owned current counts: one inherited plan Human Approval; two S3
  implementer dispatches and two review dispatches; zero Completion Approvals,
  successful commits, or Main-run product checks. Main recorded two
  status/diff inspections, one HEAD inspection, and one documentation lint.
- Producer attempts, including failures: test compilation 5; focused Mocha 6
  (one initial fixture expectation failure, two direct-host/resource failures,
  and passing characterization/focused suites); desktop suite 3; browser suite
  6 (two default pre-scenario host/network failures and four elevated passes);
  builds 3; Markdown lint 5; targeted diff checks 5. Full qlty `check` ran 6
  times (four final observations, one exact-base formatter-note reproduction,
  and one controlled paired baseline/final reproduction); full qlty `smells`
  ran twice after matching final-input changes; the final aggregate command
  was attempted 3 times (one sandbox cache/log permission failure, two
  successful disposable-snapshot runs).
  Qlty baseline smells and inventories were reused where their content, tool,
  configuration, selection and path set matched; one current-base check and
  one controlled paired full-check reproduction were run solely for the
  unchanged-file formatter records. Git status/diff command
  totals were not tracked exactly during normal execution and remain unknown;
  no retrospective collection pass was run. Regenerations followed approved
  formatter sync, the targeted qlty complexity finding, and this formatter-note
  reproduction. Raw failed attempts and successful outputs are
  retained under `/private/tmp/ajs-s3-implementation-evidence/`.
- Main routing after the formatter blocker: one Replanning dispatch and one
  independent plan-review dispatch; revised plan Ready. One renewed Human
  Approval recorded; one replan-committer dispatch follows this annotation.
  Main ran no product checks or full scans. Earlier gate metadata added two
  targeted lint and diff checks. Approval metadata adds four lint and diff
  checks, including three line-length corrections. Routine policy/document
  reads were not counted exactly; no historical collection pass was added.
  Feature-wide counters await remaining lifecycle gates.

## Risks, production readiness and deferred work

- No user behavior, dependencies, APIs, configurations or support targets change.
  Maintain `engines.vscode: ^1.75.0` and host-neutral production imports.
- Preserve parser/list/flow/CSV/definition/diagnostics/hover/navigation/WebAPI,
  comparison/report and telemetry behavior. No content/path telemetry is added.
- Large and malformed inputs retain existing consumer-specific behavior;
  schedule-impact occurrence recursion remains stack-limited and calendar's
  unique collector remains iterative and cycle-safe. Improving failure
  behavior is deferred.
- Product README, CHANGELOG, use cases, architecture and roadmap require no
  edit for
  this internal behavior-preserving foundation; existing durable ownership rules
  already cover it. The two routing/policy formatting surfaces above are the
  only proposed durable-document addition. Reassess at review/exit.
  Any observable behavior correction
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

## Original planning validation and gate readiness

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
