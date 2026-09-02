# Feature Tasks: Semantic Diff Structured Outputs

## Agent Brief

- Purpose: expose one neutral Semantic Diff result as summary, full, audit, and
  JSON outputs without changing comparison meaning.
- Approved or active slice: Slice 2; implementation review is `Ready` with no
  Findings and the completion gate is approved.
- Do not: change identity matching or identity-evidence generation.
- Do not: change confirmation-required rules, schedule semantics, comparison
  sources, runtime code, tests, generated artifacts, or configuration before
  an approved slice is committed.
- Read first: `SPECS.md`, this file, and the two Semantic Diff use cases named
  in `SPECS.md`.
- Read `TRACEABILITY.md` when defining slice-to-requirement coverage.
- Validate intake with `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: delegate Slice 3 planning/implementation after this focused
  completion commit.

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

- Status: Slice 2 implementation review Ready; completion gate approved
- Planning scope: complete four-slice plan covering the neutral result
  boundary, purpose-specific Markdown, locale-neutral JSON version 1, and VS
  Code mode selection/display/save integration.
- Review status: `Ready`
- Human approval: Approved for Slice 2 implementation and, when the independent
  review has no Findings, its completion in the current conversation.
- Active implementation slice: Slice 2 (completion commit pending)

## Human Approval

- Status: Approved
- Approved at: 2026-09-03 (explicit user approval in current conversation)
- Approved scope: Completed Slice 2 Markdown projections, validation evidence,
  and current-state/traceability updates within the existing Slice 2 Approval
  Boundary. Later slices remain deferred.
- Approved paths:
  - `docs/specs/features/semantic-diff-structured-outputs/TASKS.md`

The approved Slice 2 implementation scope is recorded above. Approval of the
complete plan does not permit parallel implementation: Main delegates and
completes one approved slice at a time in the order below.

## Completion Approval

- Status: Approved
- Approved at: 2026-09-03 (automatic per-slice completion approval explicitly
  authorized by the user when independent review has no Findings)
- Approved scope: Completed Slice 2 Markdown projections, validation evidence,
  and the Slice 2 current-state and traceability updates within the documented
  Approval Boundary.
- Approved paths:
  - `docs/specs/features/semantic-diff-structured-outputs/TASKS.md`
  - `docs/specs/features/semantic-diff-structured-outputs/TRACEABILITY.md`
  - `src/presentation/semantic-diff/renderSemanticDiffMarkdown.ts`
  - `src/presentation/semantic-diff/semanticDiffMarkdownLocalization.ts`
  - `src/presentation/semantic-diff/renderSemanticDiffAuditMarkdown.ts`
  - `src/presentation/semantic-diff/renderSemanticDiffSummaryMarkdown.ts`
  - `src/presentation/semantic-diff/semanticDiffMarkdownTypes.ts`
  - `src/resource/i18n/message_en.ts`
  - `src/resource/i18n/message_ja.ts`
  - `src/test/suite/semanticDiffMarkdownProjections.test.ts`
  - `src/test/suite/renderSemanticDiffMarkdown.test.ts`
- Implementation review verdict: Ready (no Findings)
- Commit status: Eligible for the completion gate

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Design Decisions

### Neutral Application Result

- Rename the successful application payload to `SemanticDiffResult`; retain a
  temporary `SemanticDiffChangeSet` type alias only while in-repository
  consumers migrate in Slice 1, and remove the alias before that slice is
  reviewed.
- `SemanticDiffResult` owns only host-neutral facts: input scopes, changes,
  required `identityDecisions`, confirmation-required items, unsupported
  items, limitations, and optional schedule comparison. Remove
  `reportSections` because section selection is a presentation projection.
- Remove display prose from semantic records: `summary`, `rationale`,
  `changeContent`, and `message` do not remain semantic fields. Presentation
  derives wording from existing fact fields and exported reason/constraint
  codes. Schedule changes likewise retain kind, path, date, and before/after
  runs rather than an English summary.
- The prose removal follows the field-by-field structured mapping in
  `SPECS.md` §Structured Fact Contract And Full Parity. No detail may be
  inferred by parsing a legacy sentence. Full Markdown must retain the current
  golden output for structural, attribute, confirmation, unsupported,
  limitation, schedule, empty, and warning-present/absent fixtures. Optional
  warning metadata carries a stable code, structured details, and optional
  fallback text; it is never silently dropped, counted, or used for matching.
- Transport existing and downstream review-risk decisions through one exported
  closed reason-code union. This feature owns the union, its neutral record
  shape, and presentation/serializer mappings; it does not select or generate
  confirmation records and does not change comparison meaning. Rule generation
  remains owned by `semantic-diff-review-risk-rules`.
- The reason-code values are exhaustive: confirmation uses exactly these nine
  values:
  `conditional-relation-removed`, `wait-release-source-changed`,
  `timeout-removed`, `condition-judgment-changed`, `wait-target-changed`, and
  `no-calculated-schedule-run`, `calculated-schedule-run-removed`,
  `execution-user-type-changed`, and `jp1-resource-group-changed`; unsupported
  records use the existing
  `uninterpretable-file-monitoring-condition` or one of the eleven schedule
  reasons `cycle-schedule`, `closed-day-substitution`, `shift-days`,
  `calendar-selection`, `inherited-parent-rule`, `days-from-start`,
  `invalid-start-time`, `unpaired-start-time`, `unsupported-schedule-date`,
  `missing-start-time`, and `invalid-calendar-day`; an invalid-period
  limitation keeps its existing `invalid_schedule_comparison_period` code;
  invalid-period unsupported records use the separate fixed reasonCode
  `invalid-schedule-comparison-period`.
  The current English unsupported/limitation messages are fallback text only;
  known codes map to localized templates and unknown warning codes retain
  their code plus optional fallback text without being used as semantics.
- `execution-user-type-changed` is intentional rather than
  `execution-user-changed`: the normalized `eu` parameter is the AJS execution
  user type (`ent|def`), as reflected by the existing parameter contract and
  Japanese table label. The downstream review-risk plan must emit exactly
  `execution-user-type-changed`; its prior `execution-user-changed` spelling is
  superseded and must be replanned before implementation. No compatibility
  alias is accepted in the closed union.
- The three downstream-owned reason mappings are fixed for both Full and Audit
  Markdown. English uses the following content and rationale; Japanese uses
  the existing generic confirmation and rationale keys/values; all raw dates,
  times, parameter keys, and values remain unchanged:

  <!-- markdownlint-disable MD013 MD060 -->

  | Reason code                       | English content                                        | English rationale                                                                | Japanese Full/Audit content and rationale                                                                                                                              | Unsupported display-language fallback |
  | --------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
  | `calculated-schedule-run-removed` | `<unit> calculated schedule run <date> <time> removed` | `a previously calculated execution opportunity is absent in the compared period` | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` → `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` | English content/rationale             |
  | `execution-user-type-changed`     | `<unit> execution user type changed`                   | `execution prerequisites may differ after the definition change`                 | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` → `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` | English content/rationale             |
  | `jp1-resource-group-changed`      | `<unit> JP1 resource group changed`                    | `resource availability and contention may differ after the definition change`    | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` → `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` | English content/rationale             |

  <!-- markdownlint-enable MD013 MD060 -->

  Existing six reason mappings remain those fixed in `SPECS.md`. Known
  unsupported and limitation records retain their current raw English fallback
  in Japanese Full/Audit. An unknown confirmation reason fails mapping and
  serializer validation; it never falls through to a new rule or prose.

- Relation evidence is projected only after the identity correspondence
  contract has selected before/after units. The neutral
  `SemanticDiffChange` DTO explicitly declares `relationPair` on every change:
  the structural relation change record carries a non-null neutral
  `relationPair`, while every non-relation change carries `relationPair:
null`. The neutral `relationPair` keeps
  a typed correspondence-resolved `canonicalPair` plus both nullable real
  endpoint tuples; the canonical pair is the stable path-independent
  `{sourceUnitId, targetUnitId, type}` identity and the endpoints retain the
  actual before/after relation records. The legacy display source, target,
  and pair are deterministic projections of those facts. Compatibility
  `pairKey` is projected exactly as
  `<correspondedSourceUnitId>-><correspondedTargetUnitId>` (before IDs use the
  selected correspondence, after IDs are used as-is), never re-derived in a
  renderer or compared as a localized string. Structural
  `added`/`removed` and conditional confirmation lines use the exact English
  forms and existing Japanese generic keys/values in `SPECS.md`; the
  cross-slice parity gate includes a fingerprint correspondence with remapped
  before/after IDs as a Full English/Japanese and JSON golden so the neutral
  and JSON change payloads contain the mapped `canonicalPair`, original real
  before/after endpoint IDs, relation-level `identityDecisionId: null`, and
  the corresponding unit/jobnet change's imported `identityDecisionId`. ID
  remapping cannot change endpoint display or identity evidence.
- Confirmation rendering uses all nine closed reason codes and the fixed
  English-rationale/Japanese-key table in `SPECS.md` plus the three additive
  mappings above. Japanese Full keeps the existing byte output for the six
  baseline reasons: every reason uses the generic
  `semanticDiff.generated.confirmation` and
  `semanticDiff.generated.confirmationRationale` keys with their exact current
  values; the three additive reasons use those same generic Japanese values,
  and known unsupported/limitation records retain their current raw English
  message fallback. A reason's typed
  parameter/raw/removed-source detail is required by the neutral result; an
  unknown code fails validation rather than falling through to a new rule,
  while an unsupported display language uses the English pattern.
- Transport current constraints with exported codes for the JP1/AJS3 v13 rule
  basis, runtime state not verified, external state not verified, and the
  comparison period. Structured scalar details carry period, parameter key,
  schedule rule, and raw parameter value when relevant.
- Reuse the schedule evaluator's existing unsupported-reason union and
  normalization warning codes. Unsupported and limitation records carry codes
  plus structured raw details, never translated prose as semantic meaning.
- Consume the identity-evidence type produced by
  `semantic-diff-identity-confidence` documented at
  `docs/specs/features/semantic-diff-identity-confidence/TASKS.md`. Slice 1
  must start from that feature's completed Slices 1-3 commits and preserve its
  evidence verbatim; this feature may
  project or serialize it but must not add fingerprint fields, choose matches,
  or create a competing identity-evidence type. The dependency contract is
  exact: `identityDecisions` is required and uses `[]` for no units; every
  decision has `before`/`after` arrays (empty, never `undefined`, for a
  non-applicable side); decisions and candidate references keep the identity
  contract's ordinal status/reference-tuple ordering (`exact`,
  `fingerprint-confirmed`, `candidate`, `removed`, `added`, then
  strategy/rule and complete `(absolutePath, unitType, name, id)` reference
  tuples); and
  `identityDecisionId` is required only on unit/jobnet structural or attribute
  changes and absent on relation/job-group/confirmation/unsupported/limitation/
  schedule records. The JSON projection emits relation
  `identityDecisionId: null`; its canonicalPair points to correspondence-
  resolved units, while the corresponding unit/jobnet change carries the
  imported decision ID. Change targets remain optional in the neutral DTO and
  are emitted as JSON `null`; this distinction must not be collapsed.
- `BuildSemanticDiffReportDataResult` remains the parse-versus-success
  boundary: `ok: true` returns `result: SemanticDiffResult`; `ok: false`
  returns before/after parser errors and cannot be passed to any output
  renderer or JSON serializer. Migration is atomic for this internal contract:
  all in-repository call sites move from `changeSet` to `result` in Slice 1,
  no dual property or compatibility alias remains after Slice 1 review, and
  parser errors keep their existing discriminated shape.

### Reusable Summary Contract

- The application layer exports the host-neutral `SemanticDiffSummary` type and
  the pure `buildSemanticDiffSummary(result: SemanticDiffResult)` function.
  The builder is the only owner of summary aggregation; it consumes one
  successful result and never invokes comparison, identity matching, schedule
  interpretation, or presentation code.
- The application layer also exports the host-neutral
  `SemanticDiffOutputContext` type and the pure
  `buildSemanticDiffOutputContext(result: SemanticDiffResult)` builder:

  ```ts
  export type SemanticDiffOutputContext = {
    readonly result: SemanticDiffResult;
    readonly summary: SemanticDiffSummary;
  };
  export function buildSemanticDiffOutputContext(
    result: SemanticDiffResult,
  ): SemanticDiffOutputContext;
  ```

  `buildSemanticDiffOutputContext` is the only context-construction API and is
  pure application logic. Slice 1 owns its type and builder; the successful-
  comparison orchestration wired in Slice 4 is its sole caller and invokes it
  exactly once after a successful comparison. It invokes
  `buildSemanticDiffSummary` once, stores the original successful result
  unchanged, and returns the pair as one immutable context. Parse failures
  never create a context. The command, output session, and later Explorer
  retain and pass this same context for its lifetime; no consumer clones,
  mutates, re-aggregates, or rebuilds it during mode selection, rendering,
  Flow navigation, or output actions. Tests spy on both builder calls and
  assert one context identity is shared by all four modes and Explorer
  handoff.

- The exported contract is fixed as:

  ```ts
  export type SemanticDiffSummary = {
    changeCountsByKind: Record<SemanticDiffChangeKind, number>;
    changeCountsByElementKind: Record<SemanticDiffElementKind, number>;
    changeCountsByAttributeCategory: Record<
      SemanticDiffAttributeCategory,
      number
    >;
    unsupportedCountsByKind: Record<SemanticDiffUnsupportedKind, number>;
    confirmationRequiredCount: number;
    limitationCount: number;
    scheduleRunChangeCount: number;
    hasUncalculated: boolean;
    hasFindings: boolean;
  };
  export function buildSemanticDiffSummary(
    result: SemanticDiffResult,
  ): SemanticDiffSummary;
  ```

  The maps are exhaustive and zero-inclusive; no optional summary field or
  presentation-only field is added.

- `SemanticDiffSummary` has exactly these fields:
  `changeCountsByKind`, `changeCountsByElementKind`,
  `changeCountsByAttributeCategory`, `unsupportedCountsByKind`,
  `confirmationRequiredCount`, `limitationCount`,
  `scheduleRunChangeCount`, `hasUncalculated`, and `hasFindings`. The three
  change-count maps contain every member of their closed union, and
  `unsupportedCountsByKind` contains every `SemanticDiffUnsupportedKind`
  member; every absent bucket is materialized as numeric zero. The count maps
  and their keys use the declared repository union order, not display-language
  or host insertion order.
- The builder counts result records, retaining duplicate records and IDs; it
  does not deduplicate, coalesce, or sort semantic records. For
  `confirmationRequiredCount`, count every confirmation-required record and
  every change leaf at the confirmation-required level, then sum both totals;
  duplicate records and duplicate IDs are retained and counted independently.
  This combined leaf total is the canonical value consumed by Summary, JSON,
  and Explorer cards/filtering. Any ordering of summary keys remains the
  repository's UTF-16 code-unit ordinal order, with no `localeCompare`,
  `Intl.Collator`, or locale-aware
  normalization. Markdown and JSON may format the returned value, but neither
  may recalculate its fields.
- The predicates are fixed and shared by every consumer: `hasUncalculated` is
  true exactly when an unsupported item or limitation has kind
  `uncalculated`; `hasFindings` is true exactly when changes,
  confirmation-required items, unsupported items, limitations, or schedule run
  changes are non-empty. Identity decisions alone, including an identity-only
  result with no change/confirmation/unsupported/limitation/run records, and a
  present schedule with zero run changes do not set `hasFindings`.
- Empty results and identity-only results return all-zero buckets and both flags
  false. A missing schedule and a present schedule with zero run changes both
  return `scheduleRunChangeCount: 0`; non-empty run changes increment the count
  and set `hasFindings`. An uncalculated unsupported item or limitation sets
  `hasUncalculated` and, because the record is non-empty, `hasFindings`.
- `semantic-diff-explorer` consumes `context.summary` as its sole summary
  source and retains `context.result` as the immutable fact source. Explorer
  projection, cards, and filtering never recompute counts or predicates.
  Explorer fixtures must assert that the confirmation filter and its card use
  the same combined confirmation-record plus confirmation-level change-leaf
  total, including duplicate records. Explorer owns destination UX (panel
  actions, Markdown handoff, source/Flow destinations, focus, and failure
  presentation); this feature continues to own the four output modes, the
  common picker, and their dispatcher.

### Output Contract

- Export `SemanticDiffOutputMode = "summary" | "full" | "audit" | "json"` as
  the host-neutral mode request. Mode is never an input to comparison.
- Presentation exports `presentSemanticDiffOutput(context, mode)` as the
  reusable four-mode dispatcher and `pickSemanticDiffOutputMode` as its common
  four-mode picker. The dispatcher accepts an already-built immutable
  `SemanticDiffOutputContext` and mode (with display language supplied by the
  presentation context), and returns an output document with `mode`,
  `languageId` (`markdown` or `json`), suggested file extension, media type,
  and content. Markdown uses `text/markdown; charset=utf-8`; JSON uses
  `application/json; charset=utf-8`. Slice 4 owns this common picker and
  dispatcher; the Markdown and JSON slices provide only their respective
  projections and consume the context supplied by the dispatcher.
- Summary Markdown consumes `context.summary` and contains
  before/after scope, comparison period when present, zero-inclusive counts for
  every supported change kind, element kind, and attribute category, one count
  for each unsupported kind
  (`unsupported`, `uninterpretable`, `uncalculated`), confirmation-required
  count, limitation count, schedule run-change count when a schedule is
  present, and overall findings status. It does not enumerate individual
  changes, evidence, constraints, or raw values.
- The status predicates are fixed: `hasUncalculated` is true when an
  `unsupportedItems` record has kind `uncalculated` or a limitation has kind
  `uncalculated`; `hasFindings` is true when changes, confirmation-required
  items, unsupported items, limitations, or schedule run changes are non-empty.
  Identity decisions by themselves, including unchanged exact decisions, and
  a present schedule with zero run changes do not set `hasFindings`.
- Full Markdown is the current detailed report contract and remains the
  default human-readable mode. Its sections, localization, empty state,
  explicit copy behavior, raw JP1/AJS values, unsupported/uncalculated
  visibility, and schedule period remain regression-compatible.
- Audit Markdown contains the Full facts plus every available identity
  evidence field, reason code, constraint, unsupported reason, structured raw
  detail, limitation code, and comparison period. It labels evidence as
  definition-derived and never claims runtime, external-state, permission,
  resource-contention, history, or branch outcomes were verified.
- Full and Audit render all nine confirmation reason codes from the closed
  union. The three review-risk additions use the fixed English/Japanese and
  unsupported-language fallback mappings above; their detail and constraints
  are rendered without selecting or regenerating the rule. Existing Japanese
  Full bytes for the six baseline codes remain unchanged.
- English and Japanese wording applies only to Markdown. Unsupported display
  languages fall back to English. Identifiers, paths, parameter keys, reason
  codes, constraint codes, and raw JP1/AJS values are never translated.

### JSON Version 1

- The JSON document is an intentionally versioned export format, not a dump of
  internal TypeScript objects. Its top level is
  `{ "schema": "ajsbutler.semantic-diff", "schemaVersion": 1,
"summary": ..., "result": ... }`.
- `summary` uses numeric counts and boolean status only. Its complete key order
  is `changeCountsByKind`, `changeCountsByElementKind`,
  `changeCountsByAttributeCategory`, `unsupportedCountsByKind`,
  `confirmationRequiredCount`, `limitationCount`, `scheduleRunChangeCount`,
  `hasUncalculated`, `hasFindings`. `result` is always emitted in this exact
  key order: `inputs`, `identityDecisions`, `changes`,
  `confirmationRequired`, `unsupportedItems`, `limitations`, `schedule`;
  `schedule` is the final key and is `null` when no schedule was requested.
  `inputs` is `{before, after}` and each scope keeps the key order
  `{side, jobGroupPath, unitIds, relations}`.
- The summary keys are fixed as
  `changeCountsByKind`, `changeCountsByElementKind`,
  `changeCountsByAttributeCategory`, `unsupportedCountsByKind`,
  `confirmationRequiredCount`, `limitationCount`, `scheduleRunChangeCount`,
  `hasUncalculated`, and `hasFindings`. The three change maps contain every
  closed-union member with zero values; `unsupportedCountsByKind` contains all
  three `SemanticDiffUnsupportedKind` members with zero values. Schedule run
  count is zero when schedule is absent, while `result.schedule` is `null`.
  `hasUncalculated` follows the predicate above, including an uncalculated
  limitation for an invalid comparison period; `hasFindings` does not become
  true from identity decisions alone or from an empty schedule projection.
- JSON `summary` serializes the exact `context.summary` value returned by the
  shared output-context builder. It has no independent aggregation path; its
  explicit key order and deterministic UTF-16 ordinal serialization remain
  unchanged.
- Collections are always present where the v1 wire shape requires them and are
  sorted by the complete collection contract below. Optional before/after
  targets, optional target/side, optional job-group paths, and absent schedule
  data are emitted as explicit `null`; JSON never depends on omitted
  `undefined` properties. `reportSections` is removed from the neutral result
  and is forbidden in JSON; diagnostics/Problems fields and collections are
  also outside the v1 shape and must not be emitted; presentation section
  selection is not a serializable collection.
- Semantic values use lowercase locale-neutral string codes. Raw JP1/AJS
  identifiers, paths, parameter keys, parameter values, dates, and times are
  preserved exactly. Markdown sentences and localized labels are excluded.
- `confirmationRequired[*].reasonCode` is the exact nine-member closed union
  defined above, including `calculated-schedule-run-removed`,
  `execution-user-type-changed`, and `jp1-resource-group-changed`. JSON v1
  emits each code verbatim and remains locale-neutral; it does not serialize
  English/Japanese prose or accept the superseded
  `execution-user-changed` spelling.
- Serialization constructs the version 1 object explicitly in schema order,
  sorts unordered collections deterministically, uses two-space indentation,
  and ends with one newline. The same result therefore produces byte-identical
  JSON for English, Japanese, desktop, and web hosts. Output metadata uses
  media type `application/json; charset=utf-8` (Markdown uses
  `text/markdown; charset=utf-8`).
- The version 1 object is constructed with an explicit key list at every
  nesting level: top-level `schema`, `schemaVersion`, `summary`, `result`;
  summary count maps; input scopes and relation references; change identity and
  typed nullable targets; identity decisions/evidence and their fields;
  confirmation items, related targets, constraints and warnings; unsupported
  items; limitations and warnings; schedule period, run changes, and nullable
  runs. No object spread or incidental TypeScript property order is permitted.
  Required collections are always `[]`; every optional nested field is
  explicitly `null`, including absent targets, sides, paths, parameter values,
  warning fallback text, schedule, and run sides.
- The nested wire shapes and key order are fixed as follows: each scope is
  `{side, jobGroupPath, unitIds, relations}`; each unit reference is
  `{id, name, absolutePath, unitType}`; each relation is
  `{sourceUnitId, targetUnitId, type, sourceUnitPath, targetUnitPath}`;
  targets use variant order `{kind, path}` for job groups,
  `{kind, unit}` for jobnets/units, `{kind, relation}` for relations, and
  `{kind, unit, parameterKey, category, values}` for attributes; each change
  is `{id, kind, elementKind, confirmationLevel, identityDecisionId, before,
after, relationPair, attributeCategory}`; `relationPair` is non-null only
  for structural relation changes and is `null` for every non-relation change;
  the Full renderer receives this change-level field directly as its relation
  input. Identity decisions are
  `{id, status, rule, before, after, evidence}`; exact-key evidence is
  `{kind, key}`, fingerprint evidence is
  `{kind, strategyId, unitType, fields}`, and each field is
  `{key, presence, values}`. Confirmation records are
  `{id, reasonCode, target, relatedTargets, detail, constraints, warning}`;
  unsupported records are `{id, kind, side, reasonCode, target, detail,
warning}`; limitations are `{code, kind, side, unitPath, detail, warning}`;
  warnings are `{code, detail, fallbackText}`; detail objects use the key
  order `{unitPath, parameterKey, relationPair, scheduleRule, period,
beforeValues, afterValues, rawValues, removedSources}`, relation pairs use
  `{canonicalPair, before, after}`, canonical pairs use
  `{sourceUnitId, targetUnitId, type}`, and real relation endpoints use
  `{sourceUnitPath, sourceUnitId, targetUnitPath, targetUnitId, type}`;
  schedules are
  `{period, runChanges}`, periods are `{from, to}`, run changes are
  `{id, kind, unitPath, date, before, after}`, and runs are
  `{unitPath, unitName, rule, date, time}`. `null` fills absent optional
  scalar/object fields, while required arrays remain `[]`; no extra or
  omitted nested key is allowed in v1.
- The complete v1 detail types are fixed and are not open-ended records:
  `Detail` is `{unitPath, parameterKey, relationPair, scheduleRule, period,
beforeValues, afterValues, rawValues, removedSources}`;
  `relationPair` is `{canonicalPair, before, after}` or `null`, and its
  `canonicalPair` is `{sourceUnitId, targetUnitId, type}` while each real
  endpoint is
  `{sourceUnitPath, sourceUnitId, targetUnitPath, targetUnitId, type}` or
  `null`; the endpoint objects are actual before/after relation facts and
  `canonicalPair` contains their correspondence-resolved IDs, not a localized
  string key. A relation change always has JSON `identityDecisionId: null`;
  only its corresponding unit/jobnet change carries the imported
  `identityDecisionId`, and the ID-remap golden asserts both sides. Relation
  changes and `conditional-relation-removed` confirmations require a non-null
  `relationPair`; all other detail records use `relationPair: null`.
  Every `Detail` object is present and non-null on confirmation, constraint,
  warning, unsupported, and limitation records; non-applicable nullable
  scalars/sides are `null` and non-applicable collections are `[]`.
  `Constraint` is `{code, detail, warning}` with `detail: Detail` and
  `warning: Warning | null`; `Warning` is
  `{code, detail, fallbackText}` with `detail: Detail` and
  `fallbackText: string | null`. Thus `detail` is the only wire spelling;
  `details` is forbidden at every depth, and a missing warning is represented
  by `warning: null` rather than an omitted key. `Constraint.code` is the
  closed union
  `jp1-ajs3-v13-rule-basis`, `runtime-state-not-verified`,
  `external-state-not-verified`, or `comparison-period`; warning codes retain
  the existing normalization-warning code as an opaque string so a future
  parser warning cannot be silently discarded. `period` is `{from, to}` or
  `null`;
  `unitPath`, `parameterKey`, `scheduleRule`, and `fallbackText`
  are nullable scalars; `beforeValues`, `afterValues`, `rawValues`, and
  `removedSources` are always arrays (empty when not applicable). A
  confirmation record is exactly
  `{id, reasonCode, target, relatedTargets, detail, constraints, warning}`;
  unsupported records are exactly
  `{id, kind, side, reasonCode, target, detail, warning}` and limitations are
  exactly `{code, kind, side, unitPath, detail, warning}`; all three record
  types use the same non-null `Detail` and nullable `Warning` contract.
  Its `detail` preserves the reason's `parameterKey`, before/after/raw values,
  removed sources, relation pair, schedule rule, period, and unit path; its
  `constraints` preserve each existing constraint as a typed code/detail, not a
  prose-only string. Unsupported and limitation records use the same typed
  `detail`/`warning` shapes. No `Record<string, unknown>` or untyped JSON
  spread is permitted.
- `change.identityDecisionId` is always emitted as a key in JSON: it contains
  the opaque identity ID for the identity-contract-eligible change kinds and
  is explicit `null` for relation, job-group-only, confirmation-required,
  unsupported, limitation, and schedule-run records. This does not alter the
  neutral TypeScript union, where the field is absent for ineligible records.
- Summary bucket order and identity-contract order remain their declared
  orders; every other unordered result collection uses an explicit
  record-specific projection. The following collection rules cover all v1
  arrays, including `changes`, `schedule.runChanges`, `identityDecisions`,
  inputs, targets, and nested detail arrays. No generic or cross-record sort
  tuple may be applied. Tuple names used below are row-local shorthand for
  nested wire-order projections:
  `detailTuple` is `(unitPath, parameterKey, relationPairTuple, scheduleRule,
periodTuple, beforeValuesTuple, afterValuesTuple, rawValuesTuple,
removedSourcesTuple)`; `relationPairTuple` is
  `(canonicalPairTuple, beforeEndpointTuple, afterEndpointTuple)`;
  `canonicalPairTuple` is `(sourceUnitId, targetUnitId, type)`;
  `endpointTuple` is `(sourceUnitPath, sourceUnitId, targetUnitPath,
targetUnitId, type)`; `periodTuple` is `(from, to)`; a warning tuple is
  `(code, detailTuple, fallbackText)`; and a target tuple includes its
  declared variant kind and every variant field in wire order. These shorthands
  do not define an additional ordering rule outside the row that names them.

<!-- markdownlint-disable MD013 MD060 -->

| Collection                                                                              | Complete sort tuple, in order                                                                                                                                                              | Null/empty, ties, and duplicates                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputs[*].unitIds`                                                                     | `(id)`                                                                                                                                                                                     | No null IDs; ordinal scalar order; duplicates retained.                                                                                                                                                                            |
| `inputs[*].relations`                                                                   | `(sourceUnitId, targetUnitId, type, sourceUnitPath, targetUnitPath)`                                                                                                                       | Nullable paths sort null first; scalar ties use the remaining tuple fields; duplicate relations retained.                                                                                                                          |
| `changes`                                                                               | `(id, kind, elementKind, confirmationLevel, identityDecisionId, beforeTargetTuple, afterTargetTuple, relationPairTuple, attributeCategory)` plus every nested wire field in declared order | Nullable IDs/targets/pairs/categories and nested slots sort null first; arrays sort `[]` first; the complete recursive wire tuple is the final tie-breaker and duplicate change records are retained.                              |
| `identityDecisions`                                                                     | Imported identity-contract tuple: status ordinal, strategy/rule, complete before/after reference tuples, complete evidence/field tuples, and decision ID in the contract's declared order  | Decision sides and nested arrays are always present (`[]` when empty); nullable nested values sort null first; contract-order ties retain duplicate decisions. Presentation sorting must not replace this declared identity order. |
| `identityDecisions[*].before`, `identityDecisions[*].after`, candidate/reference arrays | `(absolutePath, unitType, name, id)` followed by the imported evidence tuple                                                                                                               | Empty arrays sort before non-empty arrays; nullable fields sort null first; duplicate references remain duplicated.                                                                                                                |
| `schedule.runChanges`                                                                   | `(id, kind, unitPath, date, beforeRunTuple, afterRunTuple)`                                                                                                                                | Nullable run sides sort null first; nested nullable run slots sort null first; duplicate run changes are retained.                                                                                                                 |
| `confirmationRequired`, `unsupportedItems`, `limitations`, warnings, and constraints    | Their complete record-specific tuples in the table below                                                                                                                                   | Apply recursive null/empty rules at every nested level; duplicate records remain present.                                                                                                                                          |
| `relatedTargets` and target/reference collections                                       | Declared variant kind, then every variant field and nested reference in wire order                                                                                                         | `[]` sorts before non-empty; nullable variant fields sort null first; duplicate targets remain present.                                                                                                                            |
| `beforeValues`, `afterValues`, `rawValues`, `removedSources`                            | UTF-16 ordinal array tuple, with each value's complete wire representation                                                                                                                 | `[]` sorts before non-empty; duplicate values remain present; array length is the final tie-breaker.                                                                                                                               |
| `constraints`, `warnings`, and nested warning collections                               | Complete nested wire tuple in declared key order                                                                                                                                           | Empty arrays sort first; missing warning is `null` and sorts before a present warning; duplicate entries remain present.                                                                                                           |
| `reportSections`                                                                        | Not applicable                                                                                                                                                                             | Forbidden: the field is not part of `SemanticDiffResult` or JSON v1 and no presentation-only section collection is serialized.                                                                                                     |

<!-- markdownlint-enable MD013 MD060 -->

The record-specific table below is the sole normative rule for sorting
confirmation, unsupported, limitation, warning, and constraint records. It
completes the collection table; it does not override the identity contract
order. Every listed tuple is compared left-to-right recursively, so null,
empty, tie, and duplicate behavior is defined at every depth.

<!-- markdownlint-disable MD013 MD060 -->

| Record       | Complete sort tuple, in order                                                                     | Null/empty ordering                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Confirmation | `(id, reasonCode, targetTuple, relatedTargetsTuple, detailTuple, constraintsTuple, warningTuple)` | `targetTuple` and `warningTuple` null first; all nullable slots inside `detailTuple` and endpoint/period tuples null first; arrays use `[]` before non-empty and retain duplicates. |
| Unsupported  | `(id, kind, side, reasonCode, targetTuple, detailTuple, warningTuple)`                            | `side`, target, detail nullable slots, and warning null first; `reasonCode` is non-null for all v1 records, including `invalid-schedule-comparison-period`.                         |
| Limitation   | `(code, kind, side, unitPath, detailTuple, warningTuple)`                                         | `side`, `unitPath`, detail nullable slots, and warning null first; `code` remains the existing non-null limitation code.                                                            |
| Warning      | `(code, detailTuple, fallbackText)`                                                               | `fallbackText: null` sorts before a present value; detail nullable slots null first; value arrays use `[]` first.                                                                   |
| Constraint   | `(code, detailTuple, warningTuple)`                                                               | Constraint `detail` is non-null; warning is null first; nullable slots and arrays inside the detail use the same rule.                                                              |

<!-- markdownlint-enable MD013 MD060 -->

`null` is always less than a present scalar/object, and `[]` is less than a
non-empty array; present values then use UTF-16 ordinal comparison and
lexicographic array comparison with length as the final tie-breaker. Within
each row, compare the listed tuple left-to-right, recursively applying these
rules to its nested components; no ordering from a generic record tuple is
applied.

- Unordered runtime arrays (`unitIds`, input relations, `changes`,
  `schedule.runChanges`, target/reference collections, related targets,
  confirmation/unsupported/limitation records, constraint arrays, warning
  arrays, and raw/before/after/removed value arrays) use the complete named
  tuple for that collection, with null before present, `[]` before non-empty,
  complete nested tuple tie-breakers, and duplicates retained. Identity
  evidence `fields` remain in identity strategy-table order and identity
  decision/reference arrays remain in the imported identity contract order;
  these declared orders are not replaced by presentation sorting. No
  `reportSections` array is accepted or emitted.
- Every runtime comparator uses a pure locale-independent ordinal comparison
  over UTF-16 code units (and lexicographic array comparison with array length
  as the final tie-breaker). `localeCompare`, `Intl.Collator`, locale-aware
  case folding, and environment-dependent collation are forbidden in the
  serializer and its helpers. Tests run the same fixture under different
  runtime locale settings and include characters whose locale order differs;
  output must remain byte-identical.
- The JSON v1 byte fixture serializes the same populated result twice with
  English and Japanese display languages, shuffled source collections, every
  nested optional field both present and absent, explicit `null`s, empty
  collections, identity evidence/candidate sets, all count buckets and
  unsupported kinds, schedule present/absent, and warning present/absent. It
  asserts byte equality, exact key order, media type, stable raw Japanese and
  JP1/AJS values, valid `JSON.parse`, and no mutation of the input result.
- Version 1 is the only accepted version in this feature. Future additive
  optional data may remain version 1; removing, renaming, changing meaning or
  type, changing nullability, or changing a code requires a new schema version
  and Replanning. This feature does not promise compatibility with an unknown
  future schema version or publish a network API.
- Parse failures have no JSON representation. Rendering/serialization accepts
  only `SemanticDiffResult`, so an invalid definition cannot become an empty
  successful report.

### VS Code Selection And Output Lifecycle

- Keep `ajsbutler.compareSemanticDiff` and its existing enablement. After the
  active editor check and before file selection or comparison, show one
  QuickPick for Summary, Full, Audit, and JSON; Full is the first item and is
  labelled as the default. Cancelling returns the existing `cancelled` result
  without reading or comparing inputs.
- Run parsing and comparison exactly once after selection, then render the
  selected mode from the returned result. Mode changes never call the parser,
  comparator, evidence evaluator, or schedule evaluator again.
- Generalize the current virtual report document to store output metadata and
  use `.md` for Summary/Full/Audit and `.json` for JSON. Markdown documents
  retain the existing explicit `Copy Semantic Diff Markdown` action; the copy
  action rejects JSON documents without changing or losing their content.
- Add `ajsbutler.saveSemanticDiffOutput`, available on semantic-diff virtual
  documents. It uses `showSaveDialog` and `workspace.fs.writeFile` with
  `TextEncoder`, suggests `semantic-diff-summary.md`, `semantic-diff-full.md`,
  `semantic-diff-audit.md`, or `semantic-diff.json`, and never saves
  implicitly. Cancellation is not an error; picker/write failures return a
  host-safe message without exposing content or discarding the open output.
- The virtual report provider owns bounded content lifetime. It exposes
  `dispose()` that clears every stored document, clears recency metadata, and
  prevents later reads/writes; disposal is idempotent and any registered
  subscription is disposed by bootstrap. The provider's default cache limit is
  exactly 32 documents (constructor-injectable for tests, not user
  configuration). On the 33rd open it evicts the least-recently-used inactive
  entry; opening or reading content refreshes recency, ties break by creation
  sequence, and the just-opened entry is protected until its open operation
  completes. The provider does not track editor focus: "active" means only
  the URI protected during the current open operation, so every older entry is
  eligible after that operation. Evicted or disposed URIs return empty content
  and safe copy/save errors; no document content is written to logs or
  telemetry. Tests cover limit-1, limit, limit+1, recency refresh, eviction,
  dispose, and repeated dispose.
- Every `openReport` invocation allocates a unique immutable URI and a
  provisional in-flight entry. The entry commits to the bounded cache only
  after both `openTextDocument` and `showTextDocument` succeed. A failure in
  either operation removes only that invocation's provisional URI and leaves
  committed entries, recency, and the cache limit exactly unchanged; this is
  the rollback boundary. Pending entries can serve content only for their own
  in-flight URI and are not eligible for eviction. There is no same-URI
  update, token replacement, or same-URI supersession contract. Each
  invocation has an independent token; only the provider-wide disposal epoch
  invalidates pending tokens. Thus a late completion cannot commit after
  `dispose()`, while independent unique URIs may still commit if the provider
  has not been disposed. Disposal clears pending and committed entries and is
  idempotent. Successful commits are serialized in creation order, and
  eviction occurs at commit time (not before an open attempt), so concurrent
  successful opens retain at most the limit while a failed or disposed open
  never evicts an older report. Tests use deferred host promises for unique
  concurrent opens, open failure, in-flight disposal, late-completion
  suppression, commit-time eviction, and rollback.

  The token contract is fixed by this expectation table:

  <!-- markdownlint-disable MD013 MD060 -->

  | Deferred scenario                 | Expected result                                                                                                                                                                              |
  | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Unique URIs: open A and B overlap | Each invocation has an independent immutable URI/token; either can complete in host order, both successful URIs commit in serialized creation order, and one failure rolls back only itself. |
  | `dispose()` while A is in flight  | The disposal epoch invalidates A, clears cache/recency/pending state, and A's late success or failure cannot resurrect content or show a document.                                           |
  | Open after disposal               | The provider is permanently disposed; the attempt fails safely without allocating a token, cache entry, or host document.                                                                    |

  <!-- markdownlint-enable MD013 MD060 -->

  Deferred tests must cover unique concurrent URIs, disposal during
  `openTextDocument` and during `showTextDocument`, failure rollback,
  serialized successful commits, commit-time eviction, late completion after
  disposal, and idempotent repeated disposal. They assert independent
  invocation outcomes, no stale display call, and no resurrection after
  disposal; same-URI token/supersession tests are intentionally absent because
  same-URI update is not supported.

- Use only VS Code 1.75-compatible APIs and injected host capabilities. Shared
  application and presentation serializers remain free of `vscode` and Node
  built-ins; bootstrap alone wires QuickPick, virtual documents, clipboard,
  save dialog, and `workspace.fs` for both desktop and web.

## Implementation Slices

### Slice 1: Establish The Neutral Result Boundary And Summary Builder

- Status: Implemented; completion gate approved
- Scope: replace prose-bearing report DTO fields and `reportSections` with the
  neutral `SemanticDiffResult`, the nine-member confirmation reason union,
  reason/constraint codes, structured details, and inherited identity evidence;
  migrate the application comparison, schedule projection, and report-data
  result boundary; and export the pure `SemanticDiffSummary`/
  `buildSemanticDiffSummary(result)` builder plus
  `buildSemanticDiffOutputContext(result)`, which creates the immutable
  `SemanticDiffOutputContext` at comparison completion.
  Presentation consumers receive only the compile-safe neutral contract needed
  by later slices. The three
  additive reason values are transport contracts; their rule generation remains
  out of scope and is owned by `semantic-diff-review-risk-rules`.
- User / Domain Value: every downstream projection receives one trustworthy,
  host-neutral set of facts, one canonical summary aggregate, and one shared
  comparison-completion context without changing comparison meaning.
- Cohesive Change Group: application Semantic Diff DTO/build/compare/schedule
  modules, report-data result migration, the summary and output-context
  builders, and their pure contract tests, reusing the completed
  identity-confidence Slice 3 typed-evidence baseline and its golden fixtures.
  Presentation parity and host UX are verified by later slices and the
  cross-slice gate.
- Acceptance: successful output contains no display sections or prose as
  semantic meaning; parse failures remain distinct;
  `BuildSemanticDiffReportDataResult.ok === true` exposes only
  `result: SemanticDiffResult` and every in-repository consumer uses `result`;
  no `changeSet` compatibility property remains after this slice. Identity
  evidence is consumed from the completed identity-confidence contract
  unchanged; `identityDecisions` is always an array, decision sides are arrays
  with `[]` rather than `undefined`, optional change targets remain distinct
  and later serialize as `null`, and identity decision/reference ordering and
  `identityDecisionId` eligibility are preserved exactly. The field-by-field
  prose mapping in `SPECS.md` is represented in the neutral facts. Structural
  relation changes expose a non-null change-level `relationPair`, while
  non-relation changes expose `null`; relation facts are derived after
  correspondence and preserve legacy display endpoints and pair projection.
  The fingerprint ID-remap fixture proves a changed before/after unit ID does
  not change the canonical relation pair and that the corresponding
  unit/jobnet change retains its imported `identityDecisionId` in the neutral
  result. Markdown and JSON rendering parity is verified in their owning
  slices and the cross-slice gate.
- Acceptance also requires `buildSemanticDiffSummary` to return the fixed
  nine-field `SemanticDiffSummary` with exhaustive zero-inclusive buckets,
  duplicate-preserving record counts, the combined confirmation-record plus
  confirmation-level change-leaf total, fixed predicates, and the empty,
  identity-only, schedule-absent, zero-run, run-change, and uncalculated edge
  cases above. The builder is the only aggregation owner, and
  `buildSemanticDiffOutputContext` invokes it exactly once per supplied
  successful result; Slice 4 verifies the comparison-completion orchestration
  calls the context builder exactly once. Markdown, JSON, picker/dispatcher,
  and Explorer consumers use the same context's `summary` and original
  `result` without recomputation, cloning, or mutation.
- Acceptance also requires the context builder to accept only a successful
  `SemanticDiffResult`, expose only `{result, summary}` as readonly fields, and
  retain the original result without mutation. Slice 4 fixes the
  comparison-completion/session lifetime and proves that the same context
  identity reaches every output mode and the later Explorer handoff. Mode
  changes and Flow navigation must not create a second context or summary.
- Acceptance also requires the neutral confirmation contract to accept exactly
  the nine reason codes and preserve each new code's typed detail, target,
  constraints, and warning without classifying or creating a record. The
  review-risk producer must be able to consume these exact codes, including
  `execution-user-type-changed`, before its rule-emitting slices are
  implemented.
- Validation: update and run only the application contract,
  `buildSemanticDiffReportData`, comparison, and schedule suites needed for the
  neutral boundary; add contract tests for every removed prose field's
  code/detail mapping, warning-present/absent cases, exact identity
  union/nullability/order, the complete nine-member confirmation reason union
  and typed-detail contract (including the three downstream additions), atomic
  `changeSet` to `result` migration, and correspondence-first relation facts.
  Add pure summary-builder tests for exhaustive bucket keys and zero values,
  one-count-per-record behavior including duplicate IDs, the combined
  confirmation-record plus confirmation-level change-leaf count, fixed
  `hasFindings`/`hasUncalculated` predicates, identity-only and empty results,
  absent/present zero-run schedules, schedule run changes, and uncalculated
  unsupported/limitation records. Add output-context builder tests proving one
  summary-builder call per supplied result, preservation of the original result
  identity, readonly behavior, and one shared context shape. Slice 4 tests
  prove one context call per successful comparison and no context on parse
  failure. Reuse identity Slice 3
  typed-evidence fixtures and do not create a second identity fixture set or
  modify that feature. Run focused compiled checks, `rtk pnpm run qlty`, and
  `rtk pnpm run build`; Markdown/JSON/host parity belongs to later slices and
  the cross-slice gate.
- Production Readiness: confirm deterministic builder output, one summary scan
  per successful comparison, no repeated whole-set scans are added for large
  job groups, malformed input still exits through parser errors, duplicate/
  empty/null distinctions survive the neutral boundary, the retained context
  and result are not mutated by any consumer, identity matching is not rerun,
  and shared code has no host or Node dependency.
- Approval Boundary: the neutral result types, reusable
  `SemanticDiffSummary`/`buildSemanticDiffSummary` contract,
  `SemanticDiffOutputContext`/`buildSemanticDiffOutputContext` contract,
  nine-member confirmation reason union and typed-detail transport contract,
  comparison-to-result mapping,
  application consumer migration, and named builder/context/contract tests
  only. Markdown, JSON, dispatcher, picker, host commands, and Explorer
  handoff are later slices or gates. Rule selection or
  generation for the three additive reasons remains owned by review-risk; any
  tenth code, new matching strategy, evidence generation, other risk rule, or
  schedule interpretation requires Replanning in its owning feature.
- Dependencies: completed and committed `semantic-diff-identity-confidence`
  Slices 1-3, including its Slice 3 typed-evidence renderer baseline and
  golden fixtures; current parser, comparison, Flow highlight, and
  localization baselines. Before review-risk implementation begins, its plan
  must cite this Slice 1 contract and replace `execution-user-changed` with
  `execution-user-type-changed`; no rule-generation implementation is a
  dependency of this slice.
- Risks: removing prose can accidentally lose a rationale, structured detail,
  or optional parser warning; identity evidence may have changed consumer
  shapes; a broad DTO rename can conceal a semantic change; optional arrays and
  targets can be collapsed incorrectly; the confirmation leaf total can drift
  from Explorer; a consumer may rebuild or mutate the shared context; or
  review-risk may retain the superseded `execution-user-changed` spelling.
  Neutral-contract, summary-builder, and context-lifetime fixtures are the
  slice gate; projection parity is a separate cross-slice gate.
- Out of Scope: comparison-completion invocation/session retention, Summary
  Markdown formatting, Audit, JSON formatting, mode UI, source selection,
  Explorer UI/destination UX, diagnostics/Problems, and durable-document
  propagation.
  Summary aggregation and pure output-context construction are in scope only
  as the reusable application contracts described above.

- Implementation Evidence: Slice 1 implementation and the first
  implementation-review findings are addressed and ready for independent
  re-review. The application boundary now exposes `SemanticDiffResult` with
  typed detail, reason, constraint, warning, and correspondence-first
  relation facts; report-data success is `result` only; Flow and existing
  Markdown consumers use the migrated neutral contract; and the pure
  summary/context builders materialize exhaustive zero-inclusive buckets and
  the combined confirmation leaf count. Focused contract evidence covers the
  exhaustive nine-reason transport (including downstream reason codes),
  warning-present/absent states, former prose-to-detail mappings, schedule
  missing/empty/changed/unsupported cases, one summary-builder invocation,
  and the readonly context lifetime. Full Markdown fixtures cover Japanese
  after-before attribute precedence, English move parent derivation, and
  relation-pair-only side rendering with conflicting generic targets.
  Validation passed with `rtk pnpm run test:compile`, 69 focused semantic-diff tests,
  desktop tests, `rtk pnpm run qlty`, `rtk pnpm run build`, and
  `rtk pnpm run lint:md`; the web bundle build passed, while the web smoke
  run was blocked by the host Chromium Mach-port permission error. No new
  JP1/AJS interpretation, identity matching, host API, Node dependency,
  telemetry, or user documentation behavior was introduced.

### Slice 2: Add Summary And Audit Markdown Projections

- Status: Implemented; completion gate approved
- Scope: introduce pure Summary, Full, and Audit Markdown projections over the
  immutable `SemanticDiffOutputContext`; have Summary consume `context.summary`
  and Full/Audit consume `context.result`; keep Full delegated to the parity
  renderer and add presentation-owned localized wording for all nine
  confirmation reason codes, including the three downstream review-risk
  additions. The four-mode dispatcher and picker are owned by Slice 4 and are
  not introduced here.
- User / Domain Value: PR reviewers get a compact overview while change
  managers and auditors can request complete evidence and constraints from the
  same comparison facts.
- Cohesive Change Group: presentation Markdown output types, Summary/Full/Audit
  renderers, Semantic Diff report text/localization, and Markdown fixtures and
  contract tests. Summary aggregation is not reimplemented in this slice.
- Acceptance: Summary contains zero-inclusive counts for every supported
  `SemanticDiffChangeKind`, `SemanticDiffElementKind`, and
  `SemanticDiffAttributeCategory`, plus separate counts for each
  `SemanticDiffUnsupportedKind`, confirmation-required count, limitation
  count, uncalculated status, and overall findings status, without item detail;
  the confirmation count is the shared context's builder-produced sum of
  confirmation records
  and confirmation-level change leaves with duplicates retained. Audit contains
  every available identity evidence field, constraint,
  unsupported reason, structured raw detail, optional warning, limitation, and
  period; Full output remains byte-for-byte stable for existing English and
  Japanese fixtures, including warning-present/absent and empty fixtures; all
  Markdown modes consume the same context and share change IDs and decision
  statuses without invoking comparison or aggregation; relation lines use the
  canonical pair and before/after endpoint tuples; confirmation lines preserve
  parameter keys, raw values, removed
  sources, and the complete nine-code reason-code-to-English-rationale/
  Japanese-key mappings; the three downstream additions use the fixed
  `calculated-schedule-run-removed`, `execution-user-type-changed`, and
  `jp1-resource-group-changed` mappings without generating a record; relation
  added, removed, and conditional lines use the fixed
  endpoint/pair projection and localization forms; Japanese Full remains
  byte-for-byte compatible by using the existing generic confirmation content
  and rationale keys/values, existing relationAdded/relationRemoved values,
  and current raw English unsupported/limitation fallback; unsupported
  languages use the English pattern. No JSON or VS Code mode/picker behavior is
  asserted in this slice.
- The Summary renderer receives `context.summary` from the already-built
  `SemanticDiffOutputContext` and only formats it; it does not count records,
  infer predicates, or apply a second bucket/order policy. Full and Audit
  receive the same context and read reason detail only from `context.result`.
- Validation: add Summary renderer contract tests that consume a supplied
  `SemanticDiffOutputContext` and verify each change kind, element kind, attribute
  category, unsupported kind, zero bucket, combined confirmation-record plus
  confirmation-level change-leaf count, and status is displayed without
  recomputation. Use context-produced Markdown fixtures for an empty result,
  unchanged exact identity decisions only, candidate identity changes, schedule
  absent, schedule present with zero run changes, schedule run changes, an
  uncalculated unsupported item, an invalid-period uncalculated limitation, and
  duplicate confirmation records/change leaves; assert renderer output reflects
  `context.summary.hasUncalculated` and `context.summary.hasFindings` values.
  Assert that all Markdown modes receive the same context identity and do not
  invoke the summary or output-context builder. Add
  audit/localization, empty-result, schedule-present/absent, identity-edge,
  warning-present/absent, large-result, Full golden, fingerprint ID-remap
  relation, and all-nine-reason Markdown fixtures, including the fixed English
  rationale, Japanese key/value, raw detail, and rejection of the superseded
  `execution-user-changed` spelling. Assert Markdown projections do not call
  comparison or aggregation. Run `rtk pnpm run qlty` and
  `rtk pnpm run build`; cross-mode, JSON, Explorer, and host checks belong to
  the cross-slice gate.
- Production Readiness: keep rendering deterministic and linearithmic at
  worst because of stable sorting; explicitly cover absent evidence, empty
  arrays, malformed-looking raw Markdown characters, unsupported reason codes,
  and unavailable runtime evidence wording.
- Approval Boundary: Markdown output types, Summary/Audit/Full renderers,
  Summary consumption of the approved context summary and Full/Audit
  consumption of its original result, localization
  resources, the complete nine-code reason mapping, and focused Markdown tests.
  This slice may render downstream-owned records but may not select or generate
  them. The four-mode dispatcher/picker, JSON, and VS Code commands are outside
  this boundary. Changes to neutral facts, identity decisions, confirmation
  selection, or host integration require Replanning.
- Dependencies: Slice 1 neutral result, reusable summary contract, and
  immutable output-context contract. Full report parity is established here,
  not a prerequisite from Slice 1.
- Risks: Summary formatting may hide a category or unsupported kind, or
  accidentally reintroduce its own aggregation/predicate logic; the combined
  confirmation count may diverge from the builder; Audit may overstate
  evidence, optional warnings may disappear, a downstream reason may be
  localized with the wrong fallback, or localized templates may corrupt raw
  values. Context identity, builder contract, renderer, nine-code golden, and
  locale tests must compare codes/IDs/details before and after projection.
- Out of Scope: JSON, four-mode dispatcher/picker, VS Code
  selection/display/save behavior, Explorer, and new comparison semantics.

- Implementation Evidence: Slice 2 Markdown projections are implemented and
  ready for independent implementation review. Summary consumes only the
  supplied context summary for counts and predicates, while Full and Audit
  consume the same context result; no comparison or context construction is
  performed by the presentation projections. Full context/result parity is
  covered by the existing golden renderer suite. Audit fixtures cover exact
  and fingerprint identity evidence, all nine confirmation reasons (including
  the three downstream codes), typed details, relation pairs, constraints,
  warning-present/absent states, unsupported and limitation facts, raw values,
  and schedule periods/runs. Japanese Audit labels and the definition-derived
  evidence non-assertion are covered, and Summary distinguishes an absent
  schedule from a present zero-run schedule. Focused compiled semantic-diff
  tests pass (75 tests), as do test compilation and qlty. Full/build, desktop,
  web preparation, Markdown lint, and web smoke validation are recorded in
  TRACEABILITY.md after final validation; the web smoke runner may remain
  host-blocked when Chromium Mach-port access is unavailable. JSON, the mode
  dispatcher/picker, VS Code host integration, and Explorer remain out of
  scope.

### Slice 3: Add Deterministic Locale-Neutral JSON Version 1

- Status: Planned; blocked on Slice 1 completion and approval.
- Scope: define explicit version 1 JSON DTOs and a pure serializer over the
  immutable `SemanticDiffOutputContext`, serializing `context.summary` and
  `context.result` without creating a second aggregation path. Document schema
  evolution rules in code comments and tests without exposing internal object
  layout. The four-mode dispatcher and picker are owned by Slice 4 and are not
  introduced here.
- User / Domain Value: CI, review automation, and external tooling can consume
  deterministic structured facts without parsing localized Markdown.
- Cohesive Change Group: presentation JSON contract, schema projection and
  serializer, and JSON fixtures/contract tests. Cross-mode and host
  consistency are verified by the cross-slice gate.
- Acceptance: output has the fixed schema identifier and version; its `summary`
  is exactly `context.summary` from the shared output context and its `result`
  is exactly the context's original result;
  every nested
  field, required `[]`, optional `null`, code, raw value, summary count bucket,
  identity decision/evidence member, warning member, and schedule member follows
  the explicit v1 contract above; collection order uses the named ordinal
  comparators and all tie-breakers; identical results produce byte-identical
  output across locales and hosts; output metadata reports
  `application/json; charset=utf-8`; JSON retains the IDs, decisions, evidence,
  period, unsupported facts, limitation codes, all nine confirmation reason
  codes (including `calculated-schedule-run-removed`,
  `execution-user-type-changed`, and `jp1-resource-group-changed`), and warning
  details; `detail` is the only nested spelling (never `details`),
  every Constraint/Detail/Warning/unsupported/limitation/confirmation record
  uses the fixed type and key order, and the complete result key order is
  asserted; relation detail includes typed correspondence-resolved
  `canonicalPair` before real nullable endpoints and relation changes emit
  `identityDecisionId: null`; parse failures cannot be serialized.
- JSON acceptance is limited to this v1 wire contract. The serializer consumes
  the supplied context without invoking either builder or mutating its result.
  Equality of facts with Markdown modes, mode dispatch, Explorer consumption,
  and host display/save is verified by the cross-slice gate.
- Validation: add serializer unit tests for populated and empty results,
  schedule absent/present, identity evidence present/absent, every optional
  target/side/path/value/warning combination, all nested key orders, complete
  collection sort/tie-breaker cases for `changes`, `schedule.runChanges`,
  `identityDecisions`, inputs, targets, and every nested collection in the v1
  wire shape, plus forbidden `reportSections`, including explicit null/empty
  ordering and retained duplicates, raw
  Japanese/escaping, shuffled input ordering, locale changes, media type,
  ordinal array comparisons, record-specific nested sort projections,
  `detail`/`warning` nullability and absent-versus-null combinations, all nine
  confirmation reason codes and rejection of unknown or superseded codes, and
  one large fixture; assert the complete confirmation/unsupported/limitation/
  warning/constraint sort tuples and `null < present` ordering from the
  table, the canonicalPair/real-endpoint relationship and relation
  `identityDecisionId: null`, and the serializer
  source and runtime path do not use `localeCompare`/`Intl.Collator`; parse
  emitted text with `JSON.parse` and compare it to the version 1 contract;
  spy or inject the output context to prove JSON consumes its supplied summary
  and original result without invoking either builder or independent
  count/predicate logic; run
  `rtk pnpm run qlty` and `rtk pnpm run build`. Summary/Explorer equivalence
  and host checks belong to the cross-slice gate.
- Production Readiness: avoid recursive domain objects, file contents,
  credentials, source paths beyond existing semantic unit paths, localized
  prose, non-finite values, and implicit `undefined` omission; verify
  serialization does not mutate the neutral result, has memory proportional to
  output size, and is independent of host locale and insertion order.
- Approval Boundary: version 1 JSON DTO/projection/serializer, serialization of
  the reusable summary contract, the complete nine-code confirmation union,
  explicit collection ordering/nullability rules, and JSON tests. The
  four-mode dispatcher/picker and VS Code integration are outside this
  boundary. Publishing a JSON Schema file, network API, telemetry, rule
  generation, new fields from other feature owners, or another schema version
  requires Replanning.
- Dependencies: Slice 1 reusable summary and immutable output-context contracts
  and the completed identity-evidence shape. Slice 3 does not depend on
  Markdown or its dispatcher.
- Risks: accidental serialization of internal/prose fields, unstable nested
  key or array order, incomplete tie-breakers, silent omission of undefined
  values/warnings, a missing downstream reason or superseded spelling,
  incorrect media type, an ambiguous versioning promise, or context mutation.
  Explicit construction, nulls, complete nine-code byte fixtures, and
  context-identity/schema tests are the gate.
- Out of Scope: Markdown projections, four-mode dispatcher/picker, VS Code
  command UX, file-source metadata, Git/WebAPI comparison, and guarantees for
  unknown future schema versions.

### Slice 4: Integrate VS Code Mode Selection, Display, Copy, And Explicit Save

- Status: Planned; blocked on Slice 3 completion and approval.
- Scope: after a successful existing comparison, create the one
  `SemanticDiffOutputContext`, show the common four-mode picker, and call the
  exported `presentSemanticDiffOutput(context, mode)` dispatcher; generalize
  semantic-diff virtual documents for Markdown/JSON, preserve explicit
  Markdown copy, add explicit output save, register command/menu
  contributions, and cover host failure paths. This feature owns the picker
  and dispatcher. The later Explorer feature may replace the
  successful-comparison destination, but its `Output` action must call this
  same picker/dispatcher with the stored immutable context.
- User / Domain Value: users can choose the output suited to PR review, change
  management, audit, or CI and explicitly save `semantic-diff.json` without
  changing the compared facts.
- Cohesive Change Group: VS Code compare command and result types; report
  document provider; bootstrap wiring; command/menu contributions; command,
  document, subscription, desktop/web, and package contract tests.
- Acceptance: Full is labelled/default and the current command ID remains
  stable; the picker is shown only after the active-editor check and before
  input reading/comparison; cancellation happens before reading/comparison;
  parsing/comparison runs once; successful comparison completion creates one
  `SemanticDiffOutputContext`, and `presentSemanticDiffOutput(context, mode)`
  is called with that same context and selected mode for every output; each
  mode opens with the correct extension/language and media type; Markdown copy
  is explicit and unchanged; JSON is never copied as Markdown; save is
  explicit, uses the selected content and suggested filename, handles
  cancellation and host failures safely, and works through `workspace.fs` on
  desktop and web. Mode selection does not invoke comparison, summary
  aggregation, identity matching, schedule evaluation, review-risk generation,
  or context construction again. Cross-mode fact parity and the later Explorer
  handoff are separate gates below.
- Acceptance also requires the virtual report provider to expose idempotent
  `dispose()`, clear content and recency state on disposal, enforce a
  constructor-injectable default limit of 32 documents, evict the least
  recently used inactive entry on overflow with creation-sequence tie-breaker,
  refresh recency on open/read, protect the just-opened entry until open
  completes, allocate a unique immutable URI for every `openReport` call, and
  return safe empty-content/copy/save failures for evicted or disposed URIs.
  Same-URI update or token supersession is not supported. The limit is internal
  and not a new user configuration.
- Validation: extend `semanticDiffCommand`, `semanticDiffReportDocument`,
  bootstrap/subscription, and package-contribution tests for the four modes,
  Full-first common picker/cancellation, one-context dispatcher call,
  comparison-completion context creation and builder spies,
  parse/render/display/copy/save failures, and no implicit clipboard/write side
  effect; add virtual-document tests at limits 31, 32, and 33, recency refresh,
  equal-recency tie-breaking, commit-time eviction,
  openTextDocument/showTextDocument failure rollback, unique concurrent URIs,
  in-flight open and dispose, late completion after disposal, concurrent
  success/failure opens, and repeated dispose. Do not add same-URI token or
  supersession tests. Run `rtk pnpm run qlty` and `rtk pnpm run build`;
  repository-wide desktop/web and cross-mode checks belong to the cross-slice
  gate.
- Production Readiness: preserve VS Code `^1.75.0`, use browser-safe
  `TextEncoder` and `workspace.fs`, avoid Node built-ins, keep definition
  contents out of errors/telemetry, retain open content after copy/save
  failures, make disposal idempotent and bounded, prevent active-document
  eviction during open, and verify large output remains displayable and
  explicitly saveable on both hosts.
- Approval Boundary: post-comparison common four-mode picker, exported
  `presentSemanticDiffOutput(context, mode)` dispatcher integration,
  output-context pass-through and lifetime, output-document metadata, Markdown
  copy guard, explicit save command,
  bootstrap/package contributions, virtual-document lifecycle, and named VS
  Code/host tests. Explorer destination replacement is a later cross-feature
  gate. New comparison sources, period UX, WebAPI/Git integration, Explorer UI
  implementation, diagnostics/Problems, or command renaming requires
  Replanning.
- Dependencies: Slices 1-3 and the immutable output-context contract; existing
  compare and copy command IDs; existing report virtual-document scheme; VS
  Code 1.75 host capabilities.
- Risks: the added picker changes command interaction, virtual JSON may be
  mistaken for Markdown, web save behavior may diverge, package activation may
  omit the new command, unique URI allocation may leak or collide, or bounded
  virtual-document retention may leak report content. Command, cache-limit,
  unique-URI concurrency, disposal, and host-failure tests are the slice gate;
  cross-mode and Explorer-transition checks are separate.
- Out of Scope: automatic saving/copying, persisted mode preference, a fifth
  output mode, comparison-source or period selection, Explorer UI or its
  successful-comparison destination switch, and Feature Exit propagation.

## Cross-Slice And Cross-Feature Validation Gate

- These checks are feature-level integration gates, not acceptance or
  validation requirements for an individual slice. Run them only after the
  relevant slice commits are present and before Feature Exit.
- The same successful immutable `SemanticDiffOutputContext` must flow through
  Summary, Full, Audit, and JSON via `presentSemanticDiffOutput(context, mode)`
  without a second comparison, identity match, schedule evaluation,
  aggregation pass, review-risk generation, or context construction. Assert
  that Summary and JSON consume the exact `context.summary` produced by the
  one comparison-completion builder, including the combined confirmation-record
  plus confirmation-level change-leaf count, and that all modes retain the
  original `context.result`.
- Cross-feature Explorer verification must use fixtures containing duplicate
  confirmation records and confirmation-level change leaves. Explorer's
  confirmation card and filter total must equal `context.summary` and must not
  aggregate independently. Once Explorer is implemented, a successful
  comparison replaces the Slice 4 report destination with Explorer; Explorer's
  `Output` action invokes this feature's same exported
  `pickSemanticDiffOutputMode` and `presentSemanticDiffOutput` dispatcher with
  the stored immutable context. Explorer must not copy the four-mode list,
  picker, dispatcher, summary builder, or output serializers. No comparison is
  rerun and all four modes remain reachable. This Explorer-side synchronization
  is a cross-feature gate between the two feature plans, not an Explorer
  implementation task here.
- Flow integration must project and transport only its existing IDs and state;
  Flow DTOs and wire messages must not add `reasonCode` or duplicate reason
  detail. The Explorer/session keeps `context.result` immutable and resolves
  confirmation and change details by `confirmationIds` and `changeIds` when it
  needs reason detail for navigation or presentation. Tests assert the IDs
  resolve to the original records, missing IDs fail safely, and no reason data
  is reconstructed in Flow.
- The final JSON integration fixture must prove deterministic byte output for
  every v1 collection (`changes`, `schedule.runChanges`, `identityDecisions`,
  inputs, targets, and nested details), explicit null/empty order,
  complete tie-breakers, duplicate retention, and the absence of
  `reportSections` and diagnostics/Problems fields, across locales, hosts, and
  shuffled source insertion. Diagnostics/Problems are not a v1 collection and
  have no ordering or serialization contract.
- Virtual-document integration must prove unique immutable URIs for concurrent
  opens, per-invocation rollback, disposal-epoch invalidation, late-completion
  suppression, and bounded commit-time eviction. It must not assert or expose a
  same-URI update/supersession behavior.

- Run each focused suite before the repository-wide checks; do not approve a
  slice with unexplained failures or new qlty smells.
- Final implementation evidence must include `rtk pnpm run qlty`,
  `rtk pnpm run build`, `rtk pnpm test`, and
  `rtk pnpm run test:web` because shared DTOs, bootstrap, package
  contributions, and both extension hosts change.
- Perform desktop and web smoke checks for Full default selection, Summary and
  Audit display, JSON display/save, explicit Markdown copy, cancelled pickers,
  write failure, virtual-document cache eviction, and provider disposal. Do
  not require a real JP1/AJS runtime because this feature interprets
  definition-only results and changes no JP1/AJS rules.
- Use representative empty, malformed, schedule-present, unsupported,
  identity-evidence, Japanese raw-value, and large job-group fixtures. Parse
  failure is tested separately and must never yield an output document.
- Preserve all architecture dependency tests with zero exceptions. No
  application module may import presentation, VS Code, Node built-ins, or a UI
  framework; presentation must consume application DTOs only.
- Compatibility review must confirm unchanged matching, confirmation, schedule
  and Flow highlight outcomes; Flow carries only its existing IDs/state and no
  reason code. Within this feature the expected user-visible
  workflow change is explicit mode selection and save availability. The later
  Explorer transition is reviewed at the cross-feature gate. Review must also confirm
  the identity contract's optional/required array distinction and that the
  JSON byte fixture is identical across locales, hosts, and insertion order.
  It must additionally confirm that all nine confirmation reason codes are
  preserved across neutral, Full, Audit, and JSON projections, and that
  Markdown reads them from the immutable original result, while Flow remains
  limited to existing IDs/state and record generation remains exclusively
  review-risk-owned.
- Cross-feature review must verify that Explorer imports and consumes only
  `SemanticDiffOutputContext`, that its confirmation card and filter use
  `context.summary`, and that destination UX stays in the Explorer feature.
  Its session retains `context.result` and resolves reason details by
  `confirmationIds`/`changeIds`; Flow remains IDs/state-only with no
  `reasonCode`. After Explorer adoption, its `Output` action calls the same
  `pickSemanticDiffOutputMode` and `presentSemanticDiffOutput(context, mode)`
  dispatcher with the stored context. This feature continues to own the
  summary/context contracts, picker, and four output modes/dispatcher.

## Planning Inputs

- Preserve full localized Markdown as the default existing workflow.
- Establish the neutral application result before adapting or adding
  presentation outputs.
- Keep summary, full, audit, and JSON projections consistent with the same
  comparison facts and decision statuses by passing one immutable
  `SemanticDiffOutputContext`.
- Expose one application `SemanticDiffSummary`/
  `buildSemanticDiffSummary` source and one
  `buildSemanticDiffOutputContext` result for Summary, JSON, and the downstream
  Explorer; do not duplicate aggregation or context construction in any
  presentation feature.
- Keep Flow projection and wire transport limited to existing IDs/state. The
  Explorer/session resolves reason detail through `confirmationIds` and
  `changeIds` against the immutable original context result instead of adding
  `reasonCode` to Flow.
- Consume identity evidence from `semantic-diff-identity-confidence`; do not
  duplicate its generation or matching decisions.
- Treat new risk classifications, schedule semantics, Explorer UI, comparison
  sources, and diagnostics/Problems integration as out of scope.
- Planning decisions are recorded above for internal type names, JSON version
  and nullability, exhaustive collection ordering, confirmation leaf-count
  semantics, mode-selection UX, the unique-URI lifecycle, Explorer transition,
  migration order, focused tests, and approval boundaries.

## Traceability

- TRACEABILITY.md required: yes.
- Reason: the roadmap feature combines an application boundary change with
  four observable output purposes and depends on an earlier identity-evidence
  owner; explicit use-case, requirement, slice, and validation correspondence
  is required.

## Feature Exit

- Definition of Done status: not started; all four slices must be independently
  reviewed, completion-approved, and committed before Feature Exit.
- Durable documentation updates: propagate the neutral result boundary to
  `docs/requirements/use-cases/uc-build-semantic-diff.md`; update
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md` for the four
  purposes, selection, copy, and save; update architecture wording only if the
  implemented boundary is not already covered.
- User documentation: README must describe Summary, Full, Audit, JSON,
  Full-as-default, explicit Markdown copy, and explicit save. CHANGELOG is
  required because modes, command interaction, and JSON save are externally
  observable.
- Roadmap: no update expected; change it only if ordering, entry conditions, or
  unfinished repository-level work changes.
- Open risks at exit: identity-evidence dependency drift; prose-to-fact or
  warning loss in Full parity; nine-code confirmation-union drift with
  review-risk; schema determinism and versioning; summary
  category/unsupported-kind omission; audit overstatement; large results;
  desktop/web QuickPick, display, clipboard, save, and virtual-document cache
  lifecycle behavior including unique-URI concurrency and disposal;
  summary-builder drift, confirmation leaf-count mismatch, or downstream
  recomputation; and the Explorer destination/output handoff.

## Validation

- [x] Intake scope and overlap checked against the roadmap, current Semantic
      Diff DTO/report pipeline, related durable use cases, commands, tests,
      desktop/web wiring, and the source proposal.
- [x] Complete dependency-ordered implementation-slice plan created.
- [x] Every requirement and acceptance criterion maps to a slice and
      validation in `TRACEABILITY.md`.
- [x] Feature documents contain no template placeholders and no `CONTEXT.md`.
- [x] Independent plan review returns `Ready`.
- [ ] Human Approval and focused plan commit completed before implementation.
- [ ] Each approved slice has focused validation, independent implementation
      review, Completion Approval, and a focused completion commit.
- [ ] README, CHANGELOG, use-case, architecture, and roadmap impact evaluated
      at Feature Exit.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for planning, approval state, validation, risk, and Feature
  Exit readiness only.
- Four slices are the smallest complete set: Slice 1 establishes the neutral
  result, reusable summary builder, and immutable output context; Slice 2 owns
  Markdown projections, Slice 3 owns JSON v1, and Slice 4 owns VS Code
  mode/picker/dispatcher and save UX. Cross-slice parity and the later Explorer
  transition are integration gates, not extra slice scope.
- Any implementation discovery that requires a reason code outside this
  nine-member union, a new semantic fact, fifth mode, identity/risk/schedule
  rule, source metadata, or different host persistence boundary returns to Main
  for Replanning.
- Any Explorer-side summary aggregation or context reconstruction, a second
  summary schema, a change to the four output modes/dispatcher, a Flow
  `reasonCode`/reason-detail field, or a request for same-URI report updates is
  a Replanning trigger. Explorer must consume the exported context contract,
  use the combined confirmation leaf count, resolve details from the original
  result by `confirmationIds`/`changeIds`, and retain its own destination UX
  while calling this feature's common picker/dispatcher for `Output`.
