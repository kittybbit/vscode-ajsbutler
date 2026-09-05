# Feature Tasks: Semantic Diff Review-Risk Rules

## Agent Brief

- Purpose: expand evidence-based review recommendations without presenting
  definition changes as verified runtime failures.
- Approved or active slice: Slice 3; Slices 1 and 2 are completion-committed,
  and the selected Slice 3 implementation scope is approved for the next
  implementation handoff.
- Do not: add cycle or terminal-reachability analysis, schedule-semantics
  expansion, runtime or external probes, identity rules, a new confirmation
  level, or a competing structured-result DTO.
- Read first: `SPECS.md`, this file,
  `docs/requirements/use-cases/uc-build-semantic-diff.md`, and the completed
  `semantic-diff-structured-outputs` neutral-result contract.
- Read `TRACEABILITY.md` when implementing or reviewing a slice.
- Validate planning with `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: delegate Slice 3 implementation to `implementer` after this
  focused approval-state commit.

## Replanning Record

- Trigger: plan review found an obsolete execution-user reason code and
  unclear ownership of the nine-value structured contract; schedule evidence
  did not distinguish supported zero evaluation from unsupported-only or
  mixed evidence; `eu`/resource-group semantics lacked v13 applicability,
  default, invalid, inheritance, and raw/effective boundaries; and final
  neutral-result ordering had no single owner.
- Revision: consume the exact structured-output nine-member union and
  Full/Audit/JSON contract, with this feature limited to rule generation;
  classify schedule evidence before generating zero-run or removed-run
  decisions; fix the v13-backed environment semantics and deliberate raw-value
  comparison; and delegate final UTF-16 ordinal ordering to the structured
  serializer.
- Trigger: Slice 2 implementation review found a P1 in the dependency-owned
  English Full renderer: `calculated-schedule-run-removed` reads
  `detail.rawValues`, while the approved schedule record stores its date/time
  in `detail.beforeValues` and intentionally leaves `rawValues` empty. The
  user-visible Full report therefore omits the removed run's date/time.
- Revision: authorize the existing reason-specific English Full renderer
  mapping to read the structured `beforeValues` date/time for this reason;
  add a Full regression fixture; and verify Audit and JSON preserve the exact
  `beforeValues` date/time and empty `rawValues`. Keep the neutral detail
  schema, application mapping, Audit/JSON ownership, and all other reason
  mappings unchanged.
- Ownership exception: the dependency-owned structured-output feature remains
  the owner of the result schema, all report mappings except this one existing
  English mapping, all Japanese renderings, Audit, and JSON. The revised
  boundary grants this feature one narrow exception only for the existing
  English `calculated-schedule-run-removed` Full mapping, so it can extract the
  already-recorded schedule date/time from `beforeValues`; no other renderer or
  output ownership moves.
- Follow-up plan-review finding: the first replan package left the validation
  checklist's historical `Ready`/approval/`806d2abd` entries looking current,
  omitted `TRACEABILITY.md` from the planning-document commit scope, and did
  not make the ownership exception or exact Full extraction/assertions narrow
  enough. This revision separates historical state, revised gates, and
  post-approval implementation paths and records the exact contract below.
- Preserved: the four existing dependency-ordered slices, current evidence
  and report boundaries, approval gates, and all exclusions remain in force.
  No new implementation slice, schema, or report mode was introduced, and only
  one existing reason-specific mapping was corrected.
- Route: independent plan re-review returned `Ready`, and Human Approval covers
  the revised renderer mapping/test boundary. Replan commit `718c0919` and
  Slice 2 completion commit `3ad7c0a6` satisfy that route.

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
  production readiness, and Feature Exit readiness. Do not retain historical
  logs, prior approvals, or long validation diaries once they stop being
  actionable.

## Plan Status

- Status: Slice 3 approved for implementation.
- Planning scope: revised complete four-slice plan covering supported
  start-condition evidence, supported-versus-unsupported calculated schedule
  opportunity loss, external wait constraints, and v13-backed non-assertive
  execution-user-type/resource-group recommendations, with the localized
  Slice 2 Full projection correction recorded below.
- Review status: `Ready`; independent revised-plan review complete.
- Human approval: Approved for Slice 3 implementation under the user's current
  conversation direction to continue all planned slices in order and apply
  conditional Completion Approval when independent review returns no findings.
- Active implementation slice: Slice 3.

## Human Approval

- Status: Approved
- Approved at: 2026-09-05, explicit user approval in current conversation
- Approved scope: Slice 3 — existing supported wait-release, timeout, file,
  and event evidence details and constraints across established output modes,
  plus the named tests within the Slice 3 Approval Boundary.
- Approved paths:
  - `docs/specs/features/semantic-diff-review-risk-rules/TASKS.md`

The approved Slice 3 implementation scope is recorded above. Main delegates
and completes one slice at a time in the order below. The user's standing
direction permits Main to record Completion Approval after an independent
`Ready` review with no findings and then activate the next planned slice. Any
finding, scope change, or replan trigger pauses that automatic continuation.

## Completion Approval

- Status: Approved
- Approved at: 2026-09-05, conditional approval granted by the user and applied
  after the final independent implementation review returned `Ready` with no
  findings
- Approved scope: Slice 3 — supported wait-release, timeout, file, and event
  evidence selection, exact structured details and constraints, complete
  focused validation coverage, and implementation/traceability evidence.
- Approved paths:
  - `docs/specs/features/semantic-diff-review-risk-rules/TASKS.md`
  - `docs/specs/features/semantic-diff-review-risk-rules/TRACEABILITY.md`
  - `src/domain/services/semantic-diff/semanticDiffEvidenceRules.ts`
  - `src/test/suite/semanticDiffConditions.test.ts`
  - `src/test/suite/semanticDiffEvidenceRules.test.ts`
- Implementation review verdict: `Ready`; final review found no remaining
  findings after the coverage and evidence updates
- Commit status: Eligible for the focused Slice 3 completion commit

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Design Decisions

### Structured-Output Dependency

- Implementation starts only after the completed and committed
  `semantic-diff-structured-outputs` Slice 1 neutral-result contract is
  available. The implementation consumes its exact nine-member confirmation
  reason union, typed `Detail`, `Constraint`, `Warning`, target, Full/Audit,
  JSON v1, and serializer-ordering contracts.
- This feature owns only domain/application rule generation. It does not
  define the reason union, confirmation levels, Full/Audit/JSON mappings,
  detail keys, or serializer. The only new reason values generated here are
  `calculated-schedule-run-removed`, `execution-user-type-changed`, and
  `jp1-resource-group-changed`; the structured-output feature owns their
  closed-union and output mappings.
- Existing reason codes remain stable:
  `conditional-relation-removed`, `wait-release-source-changed`,
  `timeout-removed`, `condition-judgment-changed`, `wait-target-changed`,
  `no-calculated-schedule-run`, plus the three values above, are the exact
  nine-member union consumed by this feature. Existing Full output remains
  byte-compatible for unchanged fixtures. Summary counts, Audit, JSON version
  1, and Flow highlights consume added records without evaluating rules again.
- Every new confirmation uses the existing shape
  `{id, reasonCode, target, relatedTargets, detail, constraints, warning}`.
  `Detail`, target variants, constraint codes, warning rules, JSON key order,
  nullability, array ordering, and confirmation sort order are fixed by that
  contract and are not changed here. If adequate evidence cannot be
  represented in those fields, stop for
  Replanning rather than adding a field or changing schema meaning.
- The new reason codes are additive values in the existing confirmation reason
  union and JSON version 1. Removing, renaming, or changing their meaning, or
  changing any record field, requires Replanning with the structured-output
  owner.

The structured-output contract's renderer mapping is a dependency reference,
not an implementation surface owned by this feature:

<!-- markdownlint-disable MD013 MD060 -->

| Reason code                       | English content                                        | English rationale                                                                | Japanese Full/Audit content and rationale                                                             |
| --------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `calculated-schedule-run-removed` | `<unit> calculated schedule run <date> <time> removed` | `a previously calculated execution opportunity is absent in the compared period` | Existing generic values `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `execution-user-type-changed`     | `<unit> execution user type changed`                   | `execution prerequisites may differ after the definition change`                 | Existing generic values `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `jp1-resource-group-changed`      | `<unit> JP1 resource group changed`                    | `resource availability and contention may differ after the definition change`    | Existing generic values `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |

<!-- markdownlint-enable MD013 MD060 -->

### Evidence And Constraint Policy

- Domain rules inspect only normalized before/after definition facts and
  supported schedule projections. Application mapping attaches typed details
  and constraints. Presentation renders those facts but cannot select a rule,
  add severity, or strengthen a recommendation into a failure.
- Every confirmation carries `jp1-ajs3-v13-rule-basis`. Condition, branch,
  wait, schedule, and environment recommendations carry
  `runtime-state-not-verified`. Timeout removal, file/event wait targets, and
  execution-environment recommendations additionally carry
  `external-state-not-verified`; schedule recommendations additionally carry
  `comparison-period` with the exact half-open period.
- Unsupported, uninterpretable, or uncalculated facts stay in their existing
  result collections. They are never used as proof of no start, no release,
  missing permissions, unavailable accounts, or resource failure.
- IDs use the existing deterministic `confirm:<reason>:<target/evidence>`
  convention. Domain/application rules do not impose final record ordering or
  sort localized prose; the structured-output serializer is the sole owner of
  record and nested-collection ordering using its pure UTF-16 ordinal,
  insertion-independent contract. Duplicates remain where the source
  contract retains them.

### Start And Branch Evidence

- Preserve current confirmation selection for removed conditional relations,
  changed within-job-group wait-release sources, removed explicit wait
  timeouts, and the supported `cond`, `jd`, `ej`, `ejc`, `ejf`, `jdf`,
  `wth`, `tho`, and `evtmc` parameter changes.
- `conditional-relation-removed` is the supported directional start-path
  rule: it recommends review only when a normalized `con` relation present
  before is absent after for correspondence-resolved endpoints. Added
  conditional relations and added/removed ordinary `seq` relations do not
  create a confirmation.
- `condition-judgment-changed` remains a review recommendation when a matched
  unit's supported raw values differ. Its typed detail contains the parameter
  key plus the exact before/after raw values; the structured serializer applies
  the contract's UTF-16 ordinal array ordering. Its wording remains
  conditional: a previously established start, end, or branch path _may_ no
  longer be
  available. This feature does not parse boolean strength, prove a condition
  is stricter, or classify runtime reachability.
- `eun` remains owned by the wait-release rule rather than the generic
  condition rule. Normalized `ar` relations remain owned by structural
  relation comparison. Missing predecessors, missing successors,
  disconnection, jobnet-start parallelism, cycles, cyclic waits, and terminal
  reachability never create a recommendation here.

### Schedule-Loss Evidence

- Preserve `no-calculated-schedule-run` for an after-side directly scheduled
  jobnet whose supported projection contains zero runs in the requested
  period. It describes only the calculated result and never says the jobnet
  cannot start.
- Add `calculated-schedule-run-removed` for each deterministic `removed`
  schedule-run decision produced by the existing supported projector. A
  changed-time decision is not a removed opportunity, and an added run is not
  review-recommended. Only correspondence-matched jobnets produce this
  confirmation; a before-only removed jobnet remains represented by its
  structural removal rather than a duplicate schedule warning. The target is
  the correspondence-resolved after jobnet. Detail uses `parameterKey: null`,
  `relationPair: null`, the removed run's `scheduleRule`, the comparison
  `period`, `beforeValues` of `date=<YYYY-MM-DD>` and
  `time=<HH:MM>`, and empty `afterValues`, `rawValues`, and
  `removedSources`. The application mapper does not rerun schedule
  interpretation.
- A removed-run confirmation may coexist with explicit unsupported or
  uncalculated records for the same jobnet, but its rationale is limited to
  the one supported projected run. Unsupported evidence cannot generate a
  removed-run or zero-run confirmation by itself.
- Before emitting a schedule confirmation, the domain decision must classify
  each matched jobnet's schedule evidence as `supported`, `mixed`, or
  `unsupported-or-uncalculated-only`, retaining the supported-pair count and
  limitation records. A zero-run confirmation requires a supported after-side
  pair evaluation with zero calculated runs. A removed-run confirmation
  requires supported pair evaluations on both sides and a removed run in that
  supported projection. Unsupported-only evidence on either side emits
  neither zero-run nor removed-run confirmation. Mixed evidence may emit only
  the supported decision while preserving its unsupported records.
- No calendar, inheritance, 48-hour, cycle, shift, closed-day, or other new
  interpretation enters this feature. Invalid periods retain their existing
  unsupported/limitation result and create no confirmation.

### Wait And Execution-Environment Evidence

- Preserve wait-release-source, timeout-removal, and supported file/event
  wait-target selection. File monitoring remains limited to `flwf` and
  `flwc`; event receiving remains limited to `evwid`, `evwfr`, `evhst`,
  `evwms`, `evdet`, `evusr`, `evgrp`, `evuid`, `evgid`, `evpid`,
  `evipa`, and `evesc` on the already supported wait unit types.
- Wait details retain parameter key and exact before/after raw values; the
  structured serializer applies its UTF-16 ordinal ordering. Removed
  within-job-group release sources retain their contract ordering where
  applicable. File/event
  target records always state that external files, events, hosts,
  permissions, and runtime history were not inspected. The rule never probes
  or resolves any external input.
- Add `execution-user-type-changed` only for valid raw normalized `eu` values
  (`ent` or `def`) on v13-applicable Job common-attribute unit types, and add
  `jp1-resource-group-changed` only for the normalized scalar
  `AjsUnit.jp1ResourceGroup` where the v13 unit-common attribute applies.
  Detail uses `parameterKey: "eu"` or `parameterKey: "rg"` and the exact raw
  before/after values required by the structured contract, with absent values
  represented by its existing empty-array convention.
- For `eu`, v13 defines `ent` as the registering JP1 user and `def` as the
  owning JP1 user. Slice 4 uses a closed v13 applicability table over all
  `TySymbol` codes: standard, action, custom, flexible, and HTTP connection
  job rows are evaluated; event-job, jobnet/group, judgment/OR, connector,
  and unknown rows are ignored. The ordinary applicable rows use effective
  default `ent`; `htpj`/`rhtpj` use effective default `def` for the
  ajsprint-oriented input contract, matching the existing
  `Defaults.HttpConnectionJobEu` helper. This preserves the official HTTP
  View `ent` default as external context rather than rewriting it and avoids
  a uniform `ent` assertion.
- The `eu` selector compares effective values using that matrix while
  preserving raw absent/explicit/invalid values in detail. An absent value and
  an explicit value equal to the applicable unit-type default produce no
  confirmation; an explicit effective `ent`/`def` change can produce one.
  Invalid values, unresolved absent sides, and inapplicable unit types produce
  no confirmation. The rule does not resolve either JP1 identity, user
  mapping, effective execution account, or upper-unit fixing profile.
- For `jp1ResourceGroup`, undefined raw means the GR attribute is absent and
  an explicit empty string means a blank raw group. Both are retained as
  distinct raw evidence. Upper-unit inheritance/profile resolution and
  effective group synthesis are out of scope, so no parent traversal occurs;
  the v13 authorization meaning of a blank group is context only.
- The environment rule does not include `rg` (retained generation count),
  `un` (target user name), `qu`, `jp1Username`, host, permission, queue, or
  other execution-environment-category changes. Those changes remain ordinary
  Semantic Diff attributes unless a separately approved feature expands the
  evidence basis.
- Environment wording recommends review of the definition change and states
  that host configuration, permissions, account existence, resource
  availability, contention, and execution history are not verified. It never
  asserts failure or adds runtime/environment probes.

## Impact Investigation

- Domain symbols: `SemanticDiffConfirmationEvidenceDecision` and
  `evaluateSemanticDiffEvidence` in
  `semanticDiffEvidenceRules.ts`; schedule evaluation output in
  `semanticDiffScheduleRules.ts` only as needed to expose already calculated
  removed-run evidence and supported-pair classification without changing
  projection semantics.
- Application symbols: `createEvidenceConfirmation`, `compareScheduleDiff`,
  and the imported neutral Semantic Diff reason/detail/constraint contracts.
- Presentation consumers: Full and Audit reason rendering/localization and the
  existing JSON serializer/validation tables consume the three additive
  records already defined by the structured-output contract; this feature does
  not edit those mappings. Summary and Flow consumers remain generic and must
  not gain rule logic. The serializer remains the sole final-ordering owner;
  this feature supplies unordered rule decisions only.
- Focused tests: `semanticDiffEvidenceRules`, `semanticDiffConditions`,
  `compareSemanticDiff`, `semanticDiffScheduleRules`, `semanticDiffSchedule`,
  structured contract/JSON tests, Full/Audit Markdown tests, and existing Flow
  highlight regressions.
- Related durable docs: evaluate
  `docs/requirements/use-cases/uc-build-semantic-diff.md`, README, and
  CHANGELOG at Feature Exit. Update only delivered durable behavior; roadmap
  sequencing is unchanged.
- Architecture: pure v13 definition evidence remains in domain; mapping stays
  in application; localized wording and final serialization stay in their
  existing owners; infrastructure and bootstrap gain no dependency, adapter,
  probe, or host-specific branch.

## Implementation Slices

### Slice 1: Bound Start-Condition And Branch Recommendations

- Status: Complete; independently reviewed `Ready`, completion-approved, and
  committed in `3abbfb02`.
- Scope: preserve the supported condition/judgment baseline, make
  before/after evidence explicit, and lock the removed-conditional-relation
  rule as the only directional topology-based start-path recommendation.
- User / Domain Value: reviewers see definition-backed start, end, or branch
  changes while ordinary DAG edits are not mislabeled as likely failures.
- Cohesive Change Group: domain condition/relation evidence selection;
  application mapping to the imported reason/detail/constraint types; focused
  domain, comparison, contract-consumption, and report tests. Existing
  Full/Audit mappings are dependency fixtures, not edits in this feature.
- Acceptance: existing supported parameter changes still produce
  `condition-judgment-changed` with parameter key and exact before/after values
  that serialize in contract order; removed `con` relations produce
  `conditional-relation-removed`; added `con`, ordinary `seq` changes,
  disconnected topology, and cycle/reachability-only fixtures produce no new
  confirmation; wording and constraints remain non-assertive; identical input
  produces identical ordered records.
- Validation: update and run `semanticDiffEvidenceRules`,
  `semanticDiffConditions`, `compareSemanticDiff`, structured contract, Full,
  and Audit focused suites; include positive changed-condition and removed
  conditional-relation fixtures plus all listed negative topology fixtures;
  run `rtk pnpm run qlty` and `rtk pnpm run build`.
- Production Readiness: preserve current confirmation IDs and unchanged Full
  bytes; avoid graph traversals or repeated whole-job-group scans; keep raw
  JP1/AJS values intact; malformed definitions remain parse failures; desktop
  and web receive identical facts. Do not add a local result comparator;
  insertion-independent final ordering is delegated to the structured
  serializer.
- Approval Boundary: supported parameter evidence and conditional-relation
  selection/mapping plus named tests and render mappings only. Any boolean
  condition interpreter, new parameter rule, cycle/reachability analysis, or
  confirmation-level change requires Replanning.
- Dependencies: completed and committed structured-output Slice 1; current
  unit correspondence, relation-pair, and v13 evidence baselines.
- Risks: retaining the broad legacy reason may be mistaken for proof that a
  condition tightened; tests must assert conditional wording and typed raw
  evidence rather than a runtime conclusion.
- Out of Scope: schedule decisions, wait rules, execution environment,
  identity, diagnostics, Explorer, and durable-document propagation.

### Slice 2: Recommend Review For Supported Schedule Opportunity Loss

- Status: Complete; independently reviewed `Ready`, completion-approved, and
  committed in `3ad7c0a6`.
- Scope: preserve explicit after-side zero-run review and add one
  `calculated-schedule-run-removed` record for each removed run already emitted
  by the supported schedule comparison, after classifying supported,
  mixed, and unsupported-or-uncalculated-only evidence.
- User / Domain Value: reviewers can identify a concrete previously calculated
  execution opportunity that disappeared within the chosen period without
  interpreting uncalculated schedules as proof of no start.
- Cohesive Change Group: existing schedule-evaluation evidence projection;
  application confirmation mapping; the existing reason-specific English Full
  renderer mapping; structured-contract consumption and validation; focused
  domain, application, renderer, Audit, JSON, and serializer tests.
- Acceptance: a supported before run absent after emits a deterministic record
  targeted at the matched after jobnet with the exact fixed detail projection,
  v13, runtime, and comparison-period evidence; changed-time, added-run, and
  before-only removed-jobnet decisions do not emit this reason; existing after
  zero-run behavior remains only when a supported after pair was evaluated;
  unsupported-only schedules emit neither zero-run nor removed-run
  confirmation; mixed schedules derive confirmations only from supported pairs
  and preserve their unsupported records; invalid periods remain limitations;
  Full renders a removed run's date/time from the item's structured
  `beforeValues` even when `rawValues` is empty. For the existing English Full
  mapping, extract the entries `date=YYYY-MM-DD` and `time=HH:MM` from
  `detail.beforeValues` without changing their stored values, strip only those
  field prefixes for the human-readable line, and render exactly
  `<unit-name> calculated schedule run YYYY-MM-DD HH:MM removed`. Audit retains
  the exact `beforeValues` entries and `rawValues: []`; JSON retains both
  fields unchanged.
- Validation: update and run `semanticDiffScheduleRules`,
  `semanticDiffSchedule`, `semanticDiffMarkdownProjections`, structured
  contract/JSON, Summary, Full, and Audit focused suites; cover removed,
  changed-time, added, zero-run,
  unsupported-only, mixed-supported/unsupported, invalid-period, ID ordering,
  and locale/host-neutral serialization fixtures, including unsupported-only,
  supported-before/unsupported-after, unsupported-before/supported-after, and
  mixed zero/removed cases. Add a Full regression with
  `beforeValues: ["date=2026-04-11", "time=10:00"]` and `rawValues: []` that
  asserts the exact output string
  `- schedule-job calculated schedule run 2026-04-11 10:00 removed`, asserts
  the source `beforeValues` remain unchanged, and asserts no empty-date/time
  rendering occurs. Verify Audit includes
  `beforeValues: [date=2026-04-11, time=10:00]` and `rawValues: []`; verify JSON
  deep-equals the same two arrays. Run
  `rtk pnpm run qlty`, `rtk pnpm run build`, and the relevant compiled desktop
  suite.
- Production Readiness: reuse the single existing projection, bound work to
  emitted run decisions, preserve half-open period semantics, retain all
  limitations, avoid date/time locale conversion, and verify representative
  large-period behavior does not add a second projection or quadratic join;
  the Full mapping reads only the existing structured `beforeValues` and never
  repurposes or populates `rawValues`.
- Approval Boundary: mapping existing supported removed-run decisions and
  zero-run evidence into the established structured-result/output contracts,
  plus the one ownership exception for the existing English
  `calculated-schedule-run-removed` Full mapping in
  `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`. That
  mapping may extract `date=YYYY-MM-DD` and `time=HH:MM` from unchanged
  `beforeValues` to render the exact English line described above; it must not
  read, populate, or reinterpret `rawValues`. The named domain/application/
  Full regression tests and Audit/JSON detail-preservation assertions are
  included; Audit/JSON assertions are verification-only and require no
  production or schema edit. All other renderer mappings, the structured
  schema, Japanese, Audit, and JSON remain dependency-owned. New schedule
  interpretation, a new detail field, a schema change, or any other ownership
  exception requires Replanning.
- Dependencies: approved and completed Slice 1; structured-output Full/Audit/
  JSON consumers available for the additive reason code; existing schedule
  projector and comparison-period contract; current uncommitted pre-replan
  Slice 2 implementation remains the baseline for the renderer correction.
- Risks: duplicate confirmations, changed-time misclassification, unmatched
  before-only jobnets with no valid after target, unsupported evidence being
  mistaken for a zero-run conclusion, or the Full renderer reading the wrong
  detail field and silently omitting date/time. Explicit supported-pair
  classification, exact target/deduplication, unsupported-only/mixed negative
  fixtures, and cross-projection detail assertions are the gate.
- Out of Scope: calendar, inheritance, 48-hour, cycle, shift, closed-day, and
  other schedule-semantics expansion; Schedule Impact Calendar.

### Slice 3: Make External Wait Constraints Complete And Structured

- Status: Complete; independently reviewed `Ready`, Completion Approval
  recorded, and focused completion commit pending.
- Scope: preserve supported wait-release, timeout, file, and event selections
  while completing their typed before/after evidence and mandatory runtime or
  external-state constraints across every output mode.
- User / Domain Value: reviewers know which wait definition changed and which
  external facts still need human verification, without a false claim that the
  wait will fail or remain unresolved.
- Cohesive Change Group: wait evidence details in domain; application mapping
  to existing reason/constraint types; Full/Audit/JSON rendering and focused
  wait regression/contract tests.
- Acceptance: supported wait target changes carry exact parameter and raw
  sides; removed release sources remain sorted and related targets resolve only
  within the matched job group; removed explicit timeout remains review
  recommended; file/event target records always carry runtime and external
  constraints; uninterpretable `flwc` remains unsupported and does not itself
  create a confirmation; no probe or new target key is added.
- Validation: update and run `semanticDiffEvidenceRules`,
  `semanticDiffConditions`, structured contract/JSON, Full, and Audit focused
  suites; cover every supported file/event key, value addition/removal/change,
  absent related unit, timeout retention/removal, uninterpretable `flwc`, exact
  constraint codes/detail, deterministic ordering, and English/Japanese
  output; run `rtk pnpm run qlty` and `rtk pnpm run build`.
- Production Readiness: preserve raw quoted paths, event filters, duplicate
  values, warnings, and browser-safe pure evaluation; do not expose file
  content or paths through telemetry; verify large value collections are
  sorted once and do not cause host access.
- Approval Boundary: existing supported wait evidence/detail/constraints and
  named output/test updates only. New wait types, parameter semantics,
  filesystem/event probes, diagnostics, or runtime checks require Replanning.
- Dependencies: approved and completed Slice 2; structured constraint/detail
  contract and current wait evidence rules.
- Risks: omission of external constraints in one output mode, sensitive raw
  values being mishandled, or an unsupported condition producing a false
  recommendation. Cross-mode contract fixtures are the gate.
- Out of Scope: cyclic waits, runtime history, external files/events/hosts,
  diagnostics, telemetry changes, and schedule behavior.

### Slice 4: Recommend Review For Execution User Type And Resource Group Changes

- Status: Planned; blocked on Slice 3 completion and approval.
- Scope: generate definition-only recommendations for valid raw normalized
  `eu` execution user type and `jp1ResourceGroup` changes on their v13-
  applicable unit types, using the imported reason/detail/constraint contract;
  apply only the closed unit-type-aware effective defaults described below.
  Output mappings, confirmation levels, and final ordering remain owned by
  the structured-output feature.
- User / Domain Value: release reviewers are prompted to verify operational
  prerequisites when execution ownership changes, without being told that an
  account, permission, host, or resource failure exists.
- Cohesive Change Group: domain environment evidence selectors and v13
  applicability predicate; application mapping to the imported confirmation
  contract; generic Full/Audit/JSON/Flow consumer regressions; focused domain,
  comparison, contract, report, and serialization tests.
- Acceptance: on correspondence-matched units, valid `eu` changes between
  `ent` and `def`, and raw `eu` add/remove where the closed v13 allowlist
  permits the attribute, produce `execution-user-type-changed` with
  `parameterKey: "eu"` only when the effective value changes. Ordinary
  applicable rows default absent `eu` to `ent`; `htpj`/`rhtpj` default absent
  `eu` to `def` for the ajsprint-oriented input contract, preserving the
  existing `Defaults.HttpConnectionJobEu` behavior. The official HTTP View
  `ent` default is not substituted. Equal default/explicit pairs therefore
  produce no confirmation, while raw values remain in detail; invalid values,
  unresolved absent sides, and event/jobnet/judgment/other ignored unit types
  produce no confirmation, and no user or OS-account identity is resolved.
  Raw `jp1ResourceGroup` changes, including undefined versus explicit empty,
  produce `jp1-resource-group-changed` with `parameterKey: "rg"` where the
  unit-common attribute applies; upper-unit inheritance/profile resolution is
  not performed. Unchanged values produce no item; `rg` retained-generation
  count, `un`, `qu`, `jp1Username`, host, permission, queue, and other
  environment attributes remain ordinary changes only. Generated records carry
  the exact imported nine-value reason union and non-assertive
  v13/runtime/external constraints; Full/Audit/JSON consume the structured
  mappings and serializer ordering, while Flow remains generic. The
  domain/application layer passes raw evidence without a competing value or
  record comparator.
- Validation: update and run `semanticDiffEvidenceRules`,
  `compareSemanticDiff`, `semanticDiffConditions`, structured contract/JSON,
  Full, Audit, and Flow highlight focused suites; test valid explicit `ent`/
  `def` changes, omitted/default-equal and omitted/default-different `eu`
  transitions, `htpj`/`rhtpj` default handling, invalid values, every row of
  the v13 applicability/ignored table, mixed applicable/ignored/invalid/absent
  units, raw resource-group undefined/empty/value changes, excluded similarly
  named keys, unchanged inputs, insertion-shuffled inputs, exact IDs/details,
  English/Japanese rendering, and desktop/web result equivalence; run
  `rtk pnpm run qlty`, `rtk pnpm run build`,
  `rtk pnpm test`, and `rtk pnpm run test:web`.
- Production Readiness: keep evaluation pure and linear over matched units;
  preserve `^1.75.0`, browser safety, raw JP1/AJS values, parser failure
  behavior, and privacy; verify no telemetry, adapter, filesystem, process, or
  host dependency is introduced.
- Approval Boundary: the two explicit raw environment selectors, the closed
  v13 unit-applicability/default/invalid/ignored predicates, rule-owned
  evidence and constraints, generic Flow consumption, and named tests.
  Structured-output union/mappings and final ordering are dependencies, not
  owned changes.
  Adding any other environment key, effective inheritance/profile resolution,
  runtime validation, severity, diagnostic, automatic gate, or DTO field
  requires Replanning.
- Dependencies: approved and completed Slice 3; completed structured-output
  nine-value union, Full/Audit/JSON detail mappings, and serializer ordering;
  normalized `AjsUnit` raw fields and attribute-comparison baseline; v13
  `EU`/`GR` applicability and authorization-context references; existing
  `Defaults.Eu`/`Defaults.HttpConnectionJobEu` and the HTTP default helper.
- Risks: confusing the `GR` header with retained-generation `rg`, treating
  `jp1Username` as execution user, collapsing undefined and empty group raw
  evidence, applying `eu` to an invalid or ignored unit type, collapsing the
  ordinary `ent` and HTTP `def` defaults, leaking environment values, or
  presenting a recommendation as a verified failure. Applicability/default,
  excluded-key, privacy, exact-text, and insertion-order fixtures are the gate.
- Out of Scope: host/user/resource probes, environment diagnostics, telemetry,
  new confirmation levels, comparison sources, or viewer workflows.

## Cross-Slice Validation And Production Readiness

- Run the nearest focused suite during each slice, then the named qlty/build
  checks. Slice 4 performs the integrated compiled desktop and web suites; do
  not repeat an unchanged full-suite result merely because a later lifecycle
  stage begins.
- Preserve architecture dependency tests with zero exceptions. Domain and
  application remain free of `vscode`, UI frameworks, infrastructure, Node
  built-ins, filesystem/process assumptions, and runtime probes.
- Verify deterministic IDs, record contents, related-target contents, raw-value
  preservation, JSON key order, null/empty conventions, and byte-identical
  JSON across supported locales and desktop/web hosts. The structured-output
  serializer is the single owner of final record and nested-collection order;
  feature domain/application tests must prove insertion-independent bytes and
  must not introduce `localeCompare`, `Intl.Collator`, or a competing
  comparator.
- Preserve parser failure as a distinct failure result. Malformed or partially
  unsupported input must not become an empty successful result or a definitive
  risk claim.
- Use representative large job groups, wait-value collections, and schedule
  run sets to detect repeated scans, duplicate output, or a second schedule
  projection. No performance telemetry is added.
- Preserve existing user-visible confirmations and Full output for unchanged
  fixtures. Additive review recommendations require a CHANGELOG entry because
  they change user-visible review behavior; evaluate README wording at Feature
  Exit and update only if it describes the supported rule set.
- JP1/AJS compatibility stays on the recorded version 13 definition basis.
  Any unreferenced parameter semantics remain ordinary changes or explicit
  unsupported facts rather than inferred risk.

## Feature Exit

- Definition of Done status: not started; all four slices must be independently
  reviewed, completion-approved, and committed before Feature Exit.
- Durable documentation: review and update
  `docs/requirements/use-cases/uc-build-semantic-diff.md` only if the delivered
  reusable behavior is not already complete there; update CHANGELOG for the
  externally visible recommendations and README only when its user-facing
  feature description needs the new boundary. No roadmap update is expected.
- Exit evidence: traceability is complete; all positive and negative rule
  scenarios pass; Full/Audit/JSON facts agree; desktop/web outputs match;
  architecture, qlty, build, malformed/large input, privacy, and compatibility
  checks pass; no external probe, new schema, or out-of-scope rule entered.
- Open risks at exit: over-reporting ordinary topology, treating unsupported
  schedule evidence as no-start proof, omitting an external constraint,
  confusing environment keys or v13 applicability, collapsing raw and
  effective resource-group meaning, or changing the structured-output
  contract.

## Validation Checklist

- [x] Complete dependency-ordered implementation-slice plan created.
- [x] Every requirement and acceptance criterion mapped in
      `TRACEABILITY.md`.
- [x] Production readiness, compatibility, approval boundaries, risks, and
      out-of-scope work recorded for every slice.
- [x] Historical baseline plan review returned `Ready` before the current Slice
      2 replan; this verdict is superseded for the revised boundary.
- [x] Historical baseline Human Approval was recorded and focused plan commit
      `806d2abd` was created before the current Slice 2 replan; it does not
      approve the revised renderer exception.
- [x] Revised Slice 2 replan receives an independent plan-review `Ready`
      verdict.
- [x] Revised Slice 2 replan receives Human Approval for its exact boundary.
- [ ] Revised planning documents (`TASKS.md` and `TRACEABILITY.md`) are
      committed through the approval-committer plan/replan gate.
- [ ] Slices 1-4 implemented, reviewed, completion-approved, and committed in
      order.
- [ ] Feature Exit and durable-document propagation completed.

## Slice 1 Implementation Evidence

- Status: Implementation complete; independent implementation review `Ready`.
- Changed files are limited to the Slice 1 domain evidence selector and its
  focused domain/comparison tests. No structured-output contract, renderer,
  schedule, wait, execution-environment, parser, adapter, or configuration
  files were changed.
- Conditional-relation evidence now requires both relation endpoints to be
  correspondence-resolved on the before side. Removed-unit topology stays
  represented by structural changes and is not upgraded to a second start-path
  confirmation, even when an after fingerprint match reuses the removed
  endpoint's ID. Added `con` and unchanged/removed `seq` relations remain free
  of confirmation-required records.
- Reviewer finding resolved: added domain and application regression fixtures
  for ID reuse by a fingerprint-matched after unit; neither emits
  `conditional-relation-removed`.
- Validation: `rtk pnpm run test:prepare:desktop` and the resulting desktop
  test run passed; `rtk pnpm run build`, `rtk pnpm run qlty`, and
  `rtk git diff --check` passed. Production build emitted only the existing
  webpack asset-size recommendations.
- Compatibility: the change remains in pure domain evidence evaluation and
  browser-safe comparison data; VS Code engine, desktop/web entry points,
  parser behavior, telemetry, and structured output contracts are unchanged.
- Documentation/release: no README, use-case, or CHANGELOG update is needed
  for this internal rule-boundary/test slice; user-facing documentation is
  evaluated at Feature Exit after all slices.
- Unresolved risks: none. Independent re-review confirmed the endpoint
  correspondence guard matches the approved relation evidence boundary and no
  additional topology or condition interpretation entered the slice.

## Slice 2 Implementation Evidence

- Status: Implementation complete for the approved revised Slice 2 boundary;
  pending independent implementation review and Completion Approval.
- Changed files include the existing schedule domain projector, application
  confirmation mapper, the approved existing English Full renderer mapping,
  and focused schedule/domain, Full/Audit, and JSON verification tests. No
  schedule interpretation, structured-output schema, parser, adapter, or
  configuration surface was added.
- Schedule evaluation now records per-jobnet supported-pair counts and
  supported/mixed/unsupported-only evidence using the existing single run
  projection. Zero-run candidates require a supported after-side pair;
  removed-run confirmations require supported pairs on both correspondence-
  matched sides, target the after jobnet, and use the fixed rule/date/time
  detail with v13, runtime, and comparison-period constraints. Unsupported
  records remain present, while changed-time, added, and before-only removed
  jobnets do not gain this confirmation. Duplicate confirmation IDs are
  collapsed without changing the underlying run comparison.
- Focused coverage includes supported removed/changed/added runs, zero-run,
  unsupported-only, supported-before/unsupported-after,
  unsupported-before/supported-after, mixed zero-plus-removed evidence,
  before-only removal, invalid periods, evidence classification, target/detail
- projection, deterministic confirmation ordering, and the revised renderer
  contract. The Full fixture uses `schedule-job` with
  `beforeValues: ["date=2026-04-11", "time=10:00"]` and `rawValues: []`.
- Renderer evidence: English Full asserts the exact line
  `- schedule-job calculated schedule run 2026-04-11 10:00 removed`; Audit
  retains `beforeValues: [date=2026-04-11, time=10:00]` and `rawValues: []`;
  JSON deep-equals the same arrays. Japanese output, other reason mappings,
  and the schema remain unchanged.
- Validation: `rtk pnpm run test:compile`, focused schedule suites (14
  passing), focused JSON suite (15 passing), `rtk pnpm run
test:prepare:desktop` plus the compiled desktop suite (including Full and
  Audit), `rtk pnpm run build`, `rtk pnpm run qlty`, `rtk pnpm run lint:md`,
  and `rtk git diff --check` all passed. Direct raw-mocha Markdown projection
  launch remains blocked by the repository's existing
  `@resource/i18n/message` alias resolution; the compiled desktop runner
  covers the same Full/Audit tests successfully. Build output contains only
  the existing webpack asset-size recommendations.
- Compatibility: the change remains pure, browser-safe domain/application
  evaluation plus the approved existing English presentation projection over
  the same result. Half-open period handling, VS Code engine compatibility,
  desktop/web contracts, parser behavior, telemetry, and unsupported schedule
  limitations remain unchanged.
- Documentation/release: no README, use-case, or CHANGELOG update is needed
  before Feature Exit; user-facing recommendation propagation remains owned by
  the Feature Exit review.
- Unresolved risks: none requiring replanning. The independent implementation
  reviewer should verify that Full reads only the existing structured
  `beforeValues`, while Audit/JSON retain the exact arrays and all other
  reason/Japanese/schema mappings remain untouched.

## Slice 3 Implementation Evidence

- Status: Implementation complete for the approved Slice 3 boundary; pending
  independent implementation review and Completion Approval.
- Changed files are limited to the existing wait evidence selector and named
  wait/condition, Full/Audit/JSON, and focused contract tests. No new wait
  type, target key, structured field, diagnostic, runtime probe, filesystem
  access, event access, telemetry, or host adapter was added.
- Wait-release decisions remain limited to supported file/event wait pairs;
  removed source values stay sorted with duplicates preserved, and related
  targets resolve only through the matched after-side job group. Explicit
  `etm`/`fd` removal remains review-recommended with its existing timeout
  detail.
- All supported file target keys (`flwf`, `flwc`) and event target keys
  (`evwid`, `evwfr`, `evhst`, `evwms`, `evdet`, `evusr`, `evgrp`, `evuid`,
  `evgid`, `evpid`, `evipa`, `evesc`) retain exact before/after values. File
  and event confirmations carry `jp1-ajs3-v13-rule-basis`,
  `runtime-state-not-verified`, and `external-state-not-verified` in the
  existing structured result. Parameterized replacement, before-only, and
  after-only cases cover every supported key through the Full, Audit, and JSON
  projections. Uninterpretable `flwc` remains unsupported and does not create
  a `wait-target-changed` confirmation; independent supported `flwf` evidence
  remains reviewable.
- Explicit event (`etm`) and file (`fd`) timeouts are covered in both retained
  and removed cases. Retained values produce no timeout confirmation, while
  removed values preserve exact details and the existing basis/runtime/external
  constraints through the application and Full/Audit/JSON output paths.
- Cross-mode evidence asserts the exact wait details and constraint codes in
  Full, Audit, and JSON, including English/Japanese output. Raw quoted paths,
  event values, duplicate release values, warnings, and browser-safe pure
  evaluation remain unchanged.
- Validation evidence from the implementer:

  - `rtk pnpm run test:compile` exited 0.
  - Focused command:

    ```text
    rtk pnpm exec mocha --ui tdd \
      out/test/suite/semanticDiffEvidenceRules.test.js \
      out/test/suite/semanticDiffContracts.test.js \
      out/test/suite/semanticDiffJson.test.js
    ```

    It exited 0 with 32 passing tests.

  - `rtk pnpm run test:prepare:desktop` and `node ./out/test/runTest.js` both
    exited 0.
  - `rtk pnpm run test:prepare:web` and `node ./out/test/runWebTest.js` both
    exited 0, with transient EPIPE/premature-close teardown logs after the web
    assertions.
  - `rtk pnpm run qlty` exited 0 (`qlty fmt` and `qlty check`).
  - `rtk pnpm run build`, `rtk pnpm run lint:md`, and `rtk git diff --check`
    exited 0. The production build emitted only the existing webpack
    asset-size recommendations. Direct raw-mocha Markdown/condition launches
    retain the repository's existing `@resource/i18n/message` alias caveat;
    the compiled desktop suite covers the same Full/Audit paths successfully.

- Independent-reviewer environment caveats are not validation passes: the
  reviewer's `node ./out/test/runWebTest.js` rerun was blocked before suite
  assertions by Chromium MachPort permission, and the reviewer's
  `rtk pnpm run qlty` rerun was blocked before the check by qlty rolling-log
  permission. The implementer reran qlty successfully in the capable
  environment as recorded above.
- Compatibility: domain and application evaluation remain pure and
  browser-safe; established output schemas, report modes, VS Code engine,
  desktop/web contracts, parser behavior, and telemetry remain unchanged.
- Documentation/release: no README, use-case, or CHANGELOG update is needed
  before Feature Exit; user-facing recommendation propagation remains owned by
  the Feature Exit review.
- Unresolved risks: none requiring replanning. Independent review should verify
  that unsupported `flwc` evidence remains separate from supported target
  changes and that constraint/detail parity holds across Full, Audit, and JSON.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
