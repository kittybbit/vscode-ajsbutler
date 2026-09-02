# Feature Specification: Semantic Diff Structured Outputs

## Purpose

Separate Semantic Diff detection facts from presentation wording and expose the
same comparison result through purpose-specific summary, full, audit, and JSON
outputs without changing the meaning of the comparison.

## Minimal Context

- Current decision: define one host-neutral comparison-result boundary that
  presentation adapters can project at different review densities.
- Feature kind: roadmap feature, Wave 1.
- Selected feature folder:
  `docs/specs/features/semantic-diff-structured-outputs/`.
- Read first: this file, `TASKS.md`,
  `docs/requirements/use-cases/uc-build-semantic-diff.md`, and
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Source: improvement proposals R-2, N-4, and F-3.
- Roadmap item: Wave 1, `Add Structured Semantic Diff Outputs And Report
Modes` in `docs/specs/roadmap.md`.
- Source use cases: `docs/requirements/use-cases/uc-build-semantic-diff.md`
  and `docs/requirements/use-cases/uc-present-semantic-diff-report.md`.
- JP1/AJS reference basis: no new JP1/AJS semantic rule is introduced. The
  output boundary carries facts produced under the existing JP1/AJS3 version
  13 comparison contract. Output-mode purposes come from the repository
  proposal and are product workflow decisions rather than claims from a
  JP1/AJS manual.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- R1: Semantic Diff detection must return host-neutral, structured facts whose
  meaning does not depend on Markdown headings, localized sentences, report
  section titles, or another presentation format.
- R2: Presentation wording and localization must be derived from structured
  facts by presentation adapters. Semantic identifiers, paths, parameter keys,
  raw JP1/AJS values, evidence codes, and limitation codes must remain stable
  across languages and output formats.
- R3: Summary output must provide a compact review overview suitable for a pull
  request description: change counts by each supported change kind, element
  kind, and attribute category; unsupported counts grouped by each
  `SemanticDiffUnsupportedKind`; the presence and count of
  confirmation-required items; and concise uncalculated status without listing
  every detail.
- R4: Full output must remain the default human-readable Markdown report and
  preserve the current detailed review content: structural and attribute
  changes, schedule effects when requested, confirmation-required items,
  unsupported items, limitations, and explicit empty states.
- R5: Audit output must include the full report content plus all available
  structured decision evidence, analysis constraints, unsupported or
  uncalculated reasons, and limitations needed to inspect how the result was
  reached. It must not imply that unavailable external-runtime evidence was
  verified.
- R6: JSON output must deterministically serialize the same neutral comparison
  facts, including summary counts, changes, confirmation-required items,
  unsupported and uncalculated items, limitations, schedule comparison when
  requested, and identity evidence supplied by the identity-confidence
  feature. JSON meaning must not depend on localized prose.
- R7: Selecting an output mode must change only density or representation. It
  must reuse the same immutable output context and must not rerun detection
  with different rules, suppress facts from the neutral result, re-aggregate
  summary data, or change confirmation and identity decisions.
- R8: Output generation must remain usable by both desktop and web extension
  hosts through browser-safe application and presentation contracts.
- R9: Parse failure remains distinct from a successful comparison result and
  must not be serialized or presented as a valid empty Semantic Diff.

## Structured Fact Contract And Full Parity

The following mapping is mandatory when prose fields are removed from the
neutral result. The replacement is structured data owned by the application;
the Full renderer derives the existing English/Japanese sentence from it.
`code` values are closed unions or existing repository codes. `detail` is a
typed object, never a localized sentence; its nullable scalars and nullable
sides are explicit and its collections are explicit arrays.

<!-- markdownlint-disable MD013 MD060 -->

| Removed prose field                                  | Structured code                                                                                                   | Structured detail retained                                                                                                                                                                   | Full renderer parity rule                                                                                                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SemanticDiffChange.summary`                         | `kind`, `elementKind`, `confirmationLevel`                                                                        | `before`, `after`, `relationPair` for relation changes, `null` otherwise, `attributeCategory`, attribute before/after values, and `identityDecisionId` when the identity contract permits it | Recreate the existing structural, rename, move, relation, and attribute lines, including empty optional targets, from facts; never parse the old sentence        |
| `SemanticDiffChange.rationale`                       | identity decision `status`/`rule` via `identityDecisionId`, or no rationale code when no identity decision exists | The referenced decision's exact-key or fingerprint evidence, including all candidate references; no free-form matching rule is generated here                                                | Existing rationale lines remain present when the source carried rationale; missing rationale remains absent; candidate ambiguity is rendered from typed evidence |
| `SemanticDiffConfirmationRequiredItem.changeContent` | the nine-member confirmation reason union defined below                                                           | target, parameter key and raw values where available, related targets, schedule period and run detail where applicable, and constraint codes/typed detail                                    | Recreate the current confirmation line and preserve related-target and constraint lines                                                                          |
| `SemanticDiffConfirmationRequiredItem.rationale`     | the same confirmation reason code                                                                                 | removed sources, target/parameter detail, and constraints                                                                                                                                    | Localized wording comes from the code; an optional source warning is rendered when present                                                                       |
| `SemanticDiffUnsupportedItem.message`                | `kind` plus the existing schedule unsupported-reason or uninterpretable code                                      | side, target, unit path, parameter key, raw parameter value, and schedule rule where available                                                                                               | Recreate the current unsupported/uncalculated line and preserve an optional warning fallback without using it for semantics                                      |
| `SemanticDiffLimitation.message`                     | `kind` plus `code`                                                                                                | side, unit path, comparison period, parameter key, schedule rule, raw value, and optional warning metadata                                                                                   | Every current limitation and normalization warning remains in Full output, including records with absent optional detail                                         |
| `SemanticDiffScheduleRunChange.summary`              | run `kind`                                                                                                        | unit path, date, and explicit nullable `before`/`after` runs                                                                                                                                 | Recreate added, removed, and changed-time lines from run facts and retain the existing period/line ordering                                                      |

<!-- markdownlint-enable MD013 MD060 -->

Relation changes use a canonical pair rather than the legacy prose `pairKey`.
The pair is created after identity correspondence has been applied and is a
neutral fact, not a presentation-side re-match. The structural relation
change record carries a non-null `relationPair`; every non-relation change
record carries `relationPair: null`. The structured `relationPair`
has the key order `{canonicalPair, before, after}`. Its typed `canonicalPair`
is ordered as `{sourceUnitId, targetUnitId, type}` and contains the
correspondence-resolved endpoint IDs used for stable pair identity. `before`
and `after` are explicit nullable real endpoint objects, each ordered as
`{sourceUnitPath, sourceUnitId, targetUnitPath, targetUnitId, type}`. Its
canonical comparison tuple is
`(sourceUnitPath ?? sourceUnitId, targetUnitPath ?? targetUnitId, type,
sourceUnitId, targetUnitId)`. A missing path therefore falls back to the
corresponded unit ID without inventing a new identity. The legacy display
source, target, and pair are pure projections of these endpoint facts using
the same path-then-ID fallback. For compatibility with the old `pairKey`, its
pair projection is exactly
`<correspondedSourceUnitId>-><correspondedTargetUnitId>`: a before endpoint ID
is first mapped through the selected correspondence (including a fingerprint
ID remap), while an after endpoint ID is used as-is; relation `type` remains a
separate endpoint fact. These endpoint and pair projections are fixed neutral
facts so presentation adapters do not reconstruct `pairKey` or compare
localized text. Full output uses that projection and the relation change kind;
the Full relation renderer receives `change.relationPair` as its sole relation
input and never reconstructs endpoints from a generic target. It never
compares or sorts a localized sentence.

The fixed relation display forms are: English `"<pair> relation added"`,
`"<pair> relation removed"`, and `"<pair> conditional relation removed or
changed"`. To preserve existing Japanese Full bytes, structural relation
changes continue to use `semanticDiff.generated.relationAdded` (`関連を追加`)
and `semanticDiff.generated.relationRemoved` (`関連を削除`) without pair
interpolation. The conditional form is represented in Japanese by the
existing generic confirmation key/value in the table below. The added/removed
forms are used for structural relation changes; the conditional form is used
only for the `conditional-relation-removed` confirmation reason. A Slice 3
identity fingerprint ID-remap golden fixture must contain a one-to-one
fingerprint correspondence whose before and after unit IDs differ and assert
that the neutral/JSON change payload has the mapped `canonicalPair`, original
real endpoint IDs, relation-level `identityDecisionId: null`, and the
corresponding unit change's imported ID; English/Japanese Full lines remain
stable after correspondence.

Confirmation records retain `parameterKey`, `beforeValues`, `afterValues`,
`rawValues`, and `removedSources` inside their typed `detail`. A conditional
relation record uses the canonical relation pair and empty value arrays; a
wait-release record retains the removed source values; timeout, condition, and
wait-target records retain the relevant parameter and both raw sides; a
no-calculated-schedule-run record retains its period and schedule detail. A
`calculated-schedule-run-removed` record retains the comparison `period` and
the removed run date and time in `rawValues`; an
`execution-user-type-changed` record retains `parameterKey: "eu"` and the
exact before/after execution-user-type values in `beforeValues` and
`afterValues`; and a `jp1-resource-group-changed` record retains
`parameterKey: "rg"` and the exact before/after JP1 resource-group values in
those arrays. These are transport details only and do not assert the external
runtime effect of any change.

Unsupported `reasonCode` values are the existing closed set: the evidence code
`uninterpretable-file-monitoring-condition`, or the eleven schedule evaluator
values `cycle-schedule`, `closed-day-substitution`, `shift-days`,
`calendar-selection`, `inherited-parent-rule`, `days-from-start`,
`invalid-start-time`, `unpaired-start-time`, `unsupported-schedule-date`,
`missing-start-time`, and `invalid-calendar-day`. Invalid comparison periods
use the separately fixed unsupported `reasonCode`
`invalid-schedule-comparison-period`; the limitation retains its existing
`invalid_schedule_comparison_period` `code`. Known codes select a localized
template where one exists. Known unsupported and limitation records preserve
their current raw English message as the Japanese Full fallback; an unknown
warning code is shown by code and optional `fallbackText`, while an
unsupported reason outside this set is invalid input rather than a new
semantic interpretation.

The existing Full English wording and rationale are mapped from reason code and
structured detail as follows. Japanese Full deliberately keeps the current
byte contract: every reason uses the existing generic content and rationale
keys with the exact values below. No reason-specific Japanese text is added to
Full; unsupported display languages use the English pattern/rationale in the
table.
The closed union has exactly these nine values; an unknown confirmation code is
invalid input and is not silently rendered as a new semantic rule.

<!-- markdownlint-disable MD013 MD060 -->

| Reason code                       | Existing Full English pattern                                     | English rationale                                                                                | Japanese localization keys                                                             | Japanese exact values                                                         |
| --------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `conditional-relation-removed`    | `<pair> conditional relation removed or changed`                  | `a previously conditional branch path may no longer be available`                                | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `wait-release-source-changed`     | `<unit> wait release source changed`                              | `a previously available within-job-group release source may no longer release this wait`         | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `timeout-removed`                 | `<unit> explicit timeout <parameterKey> removed`                  | `removing a previously explicit wait timeout may leave a wait unresolved for longer than before` | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `condition-judgment-changed`      | `<unit> <parameterKey> condition or judgment changed`             | `a previously established start, end, or branch path may no longer be available`                 | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `wait-target-changed`             | `<unit> wait target <parameterKey> changed`                       | `the compared definition now waits for a different file, event, or event filter`                 | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `no-calculated-schedule-run`      | `<unit> has no calculated runs in the schedule comparison period` | `a schedule-defined jobnet may no longer have an execution opportunity in the compared period`   | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `calculated-schedule-run-removed` | `<unit> calculated schedule run <date> <time> removed`            | `a previously calculated execution opportunity is absent in the compared period`                 | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `execution-user-type-changed`     | `<unit> execution user type changed`                              | `execution prerequisites may differ after the definition change`                                 | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |
| `jp1-resource-group-changed`      | `<unit> JP1 resource group changed`                               | `resource availability and contention may differ after the definition change`                    | `semanticDiff.generated.confirmation` / `semanticDiff.generated.confirmationRationale` | `変更内容を確認してください` / `定義比較だけでは実行時の条件を検証できません` |

<!-- markdownlint-enable MD013 MD060 -->

Optional warning metadata is not discarded during neutralization. It is a
plain `warning` object with a stable `code`, typed `detail`, and optional
`fallbackText` used only when no presentation template exists. The renderer
must preserve warning-present and warning-absent cases in Full golden fixtures;
the fallback text is never used for identity, counts, ordering, or detection.
Known warning codes must render from code/detail so localization remains
possible. Unknown warning codes remain visible through their code and optional
fallback text rather than being silently dropped.

Japanese Full keeps the current raw English fallback for every known
unsupported and limitation message: the renderer emits the existing message
value byte-for-byte after escaping, rather than introducing a new localized
sentence. A future localized template may be added only through Replanning;
until then the code/detail remains structured in Audit/JSON while Full parity
uses the raw English fallback.

## Reusable Summary Contract

The application layer exports the host-neutral `SemanticDiffSummary` type and
the pure `buildSemanticDiffSummary(result: SemanticDiffResult)` function. The
builder is the only owner of summary aggregation. It consumes one successful
result and never invokes comparison, identity matching, schedule
interpretation, or presentation code.

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

export type SemanticDiffOutputContext = {
  readonly result: SemanticDiffResult;
  readonly summary: SemanticDiffSummary;
};
export function buildSemanticDiffOutputContext(
  result: SemanticDiffResult,
): SemanticDiffOutputContext;
```

`buildSemanticDiffOutputContext` is the only output-context construction API.
It calls `buildSemanticDiffSummary` exactly once, retains the original
successful `SemanticDiffResult` unchanged, and returns both values as one
immutable context. Successful-comparison orchestration calls the context
builder exactly once after comparison succeeds; parse failures never create a
context. The command, output session, all four output modes, and the downstream
Explorer retain and pass that same context identity for its lifetime. No
consumer may clone, mutate, rebuild, or re-aggregate the context during mode
selection, rendering, output actions, or Flow navigation.

The contract has exactly those nine fields. The three change-count maps
contain every member of their closed union, and `unsupportedCountsByKind`
contains every `SemanticDiffUnsupportedKind` member. Every absent bucket is
materialized as numeric zero. The maps and their keys use the declared
repository union order rather than display-language or host insertion order;
no field is optional and no presentation-only field may be added.

The builder counts result records exactly once and retains duplicate records
and duplicate IDs. It does not deduplicate, coalesce, or sort semantic records.
`confirmationRequiredCount` is the sum of every confirmation-required record
and every change leaf whose level is confirmation-required. Duplicate records
and duplicate IDs remain separate leaves and are counted independently. This
combined leaf total is the canonical value used by Summary, JSON, and Explorer
cards and filtering.

Where ordering is required for summary keys or related diagnostic
collections, it follows the repository's deterministic UTF-16 code-unit
ordinal policy, with no `localeCompare`, `Intl.Collator`, or locale-aware
normalization. Summary Markdown and JSON may format the returned value but
must not recalculate any field.

The predicates are fixed for every consumer:

- `hasUncalculated` is true exactly when an unsupported item or limitation has
  kind `uncalculated`.
- `hasFindings` is true exactly when changes, confirmation-required items,
  unsupported items, limitations, or schedule run changes are non-empty.

An empty result and an identity-only result return all-zero buckets with both
predicates false. Identity decisions alone, including unchanged exact
decisions, never set `hasFindings`. A missing schedule and a present schedule
with zero run changes both return `scheduleRunChangeCount: 0` and do not set
`hasFindings`. Non-empty schedule run changes increment the count and set
`hasFindings`. An uncalculated unsupported item or limitation sets both
`hasUncalculated` and, because the corresponding record is non-empty,
`hasFindings`.

Summary Markdown, Full Markdown, Audit Markdown, JSON, and the downstream
Semantic Diff Explorer consume the same exported `SemanticDiffOutputContext`.
Summary and JSON use `context.summary` as their sole summary source, while all
projections and Explorer detail resolution use the original
`context.result`. None may own a second schema, recompute buckets, counts, or
predicates, or reconstruct a context. This feature owns the four `summary`,
`full`, `audit`, and `json` output modes, their common picker, and their
dispatcher. The Explorer feature owns only its destination UX, including panel
actions, Markdown handoff, source and Flow destinations, focus, and failure
presentation; Explorer UI remains outside this feature.

## Output Contract And Explorer Transition

This feature owns the reusable four-mode picker and
`presentSemanticDiffOutput(context, mode)` dispatcher, where `mode` is the
host-neutral closed union `"summary" | "full" | "audit" | "json"`. The
dispatcher accepts an already-built immutable `SemanticDiffOutputContext` and
returns the mode-specific document metadata and content; it does not compare,
build a summary, or construct a context. Before the Explorer is adopted, the
standalone compare command presents the Full-first picker after the
active-editor check and before input reading or comparison. Cancellation
occurs before comparison. After a selected comparison succeeds, orchestration
builds one context and passes it with the selected mode to the dispatcher.
Selecting or presenting a mode never reruns comparison, identity matching,
schedule evaluation, summary aggregation, context construction, or review-risk
generation.

After `semantic-diff-explorer` becomes the successful-comparison destination,
the Explorer opens by default instead of an output document. Its internal
`Output` action presents this feature's same picker and calls the same
dispatcher with the immutable context already stored by the Explorer session.
All four modes remain available and no comparison, aggregation, or context
construction is rerun. Explorer must call the exported common picker rather
than copying the mode list or selection logic. This feature continues to own
the picker, dispatcher, mode semantics, and output documents; the Explorer
feature owns the destination switch, action placement, panel state, and other
Explorer UI. The transition is a cross-feature validation gate, not Explorer
UI scope for any implementation slice in this feature.

Flow projection remains deliberately narrower than the output context. Flow
DTOs and wire messages retain only their existing identifiers and state; they
must not add `reasonCode` or duplicate confirmation or change detail. The
Explorer session retains the immutable original `context.result` and resolves
details by `confirmationIds` and `changeIds`. Missing IDs fail safely, and
Flow never reconstructs reason data. The output context itself is not copied
onto the Flow wire.

## Virtual Report Lifecycle Contract

Virtual report lifetime is bounded by an internal provider cache of 32
committed documents. Every `openReport` call allocates a unique immutable URI
and provisional entry, then commits it only after both host operations succeed;
any failure rolls back only that invocation's URI. Each unique URI has an
independent token. Same-URI update, token replacement, and supersession are not
supported. A provider-wide disposal epoch invalidates all pending tokens,
clears committed and provisional state, and prevents late completion from
resurrecting content; a provider remains disposed after that point. Successful
commits are serialized in creation order. Eviction happens only at successful
commit, and pending entries are never eviction candidates.

<!-- markdownlint-disable MD013 MD060 -->

| Scenario                        | Required outcome                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Unique concurrent URI opens     | Tokens do not cancel one another; each URI commits or rolls back independently, with successful commits serialized by creation order. |
| One concurrent open fails       | Only that invocation rolls back; another unique URI may still commit and no failed open causes eviction.                              |
| Dispose while an open is active | The disposal epoch rejects every late success/failure and leaves no content, recency, or pending entry.                               |

<!-- markdownlint-enable MD013 MD060 -->

## JSON Collection Determinism Contract

JSON v1 uses an explicit schema and key order at every nesting level. Every
unordered collection has its own record-specific sort projection rather than a
generic tuple or incidental object order. The exhaustive contract covers input
unit IDs and relations, changes, identity decisions and references, targets,
confirmation records, unsupported items, limitations, schedule run changes,
related targets, constraints, warnings, evidence fields, and every nested
before/after/raw/removed-source value collection.

Each projection compares all fields in that record's declared wire order and
continues through complete nested fields as tie-breakers. `null` sorts before a
present scalar or object, `[]` sorts before a non-empty array, arrays compare
lexicographically with length as the final tie-breaker, and duplicates are
retained. Scalars use locale-independent UTF-16 code-unit ordinal order; the
serializer must not use `localeCompare`, `Intl.Collator`, locale-aware case
folding, or host insertion order. Imported identity decision/reference arrays
and identity evidence fields retain the order declared by the identity
contract instead of being re-sorted by presentation code. `reportSections` is
not part of the neutral result and is neither accepted nor emitted by JSON v1.
The complete per-collection projections, nullability, and wire shapes are owned
by `TASKS.md` JSON Version 1 and must be validated with shuffled input,
cross-locale byte equality, complete tie-breakers, and duplicate retention.

## Identity Evidence Dependency Contract

This feature consumes, but does not redefine, the completed
`semantic-diff-identity-confidence` contract in
`docs/specs/features/semantic-diff-identity-confidence/TASKS.md` Design Decisions
(`identityDecisions`, the closed `SemanticDiffIdentityDecision` union, stable
`SemanticDiffIdentityDecisionId`, deterministic candidate ordering, and
`SemanticDiffChange.identityDecisionId`). Slice 1 may begin only after that
feature's approved Slices 1-3 completion commits are available; its Slice 3
typed-evidence renderer and golden fixtures are the Full-report baseline.

- `identityDecisions` is a required array and is `[]` when no units exist.
- Each decision always has `before` and `after` arrays; an empty array is the
  only representation of a non-applicable side. This is distinct from the
  optional `before`/`after` targets on changes, which are projected as JSON
  `null` when absent.
- Decision variants, rule/status unions, evidence discriminants, and the
  opaque `identity:v1:` IDs are imported/projected verbatim. This feature never
  creates a second evidence type, reruns matching, or changes field presence.
- Identity decision arrays and candidate references retain the contract's
  ordinal sorting: decision status order is `exact`,
  `fingerprint-confirmed`, `candidate`, `removed`, `added`, followed by the
  evidence discriminator (`evidence.kind` plus fingerprint strategy/unit type
  or exact key kind), rule, and complete sorted reference tuples; reference
  sides use `(absolutePath, unitType, name, id)`. JSON uses that order rather
  than resorting by localized text.
- `identityDecisionId` is required on unit/jobnet structural and attribute
  changes and absent on relation, job-group-only, confirmation-required,
  unsupported, limitation, and schedule-run records exactly as defined by the
  identity feature. The JSON projection always emits
  `identityDecisionId: null` for relation changes. A relation's
  `canonicalPair` refers to the correspondence-resolved units, while the
  corresponding unit/jobnet change on each side carries the imported
  `identityDecisionId`; the ID-remap golden asserts the relation remains null
  and the unit change carries the expected decision ID. The neutral result
  must not invent an ID for a record that is outside that contract.

## Behavioral Scenarios

```gherkin
Feature: Present one Semantic Diff result for different review purposes

Scenario: Output mode does not change comparison meaning
  Given one neutral Semantic Diff result has been built
  When summary, full, audit, and JSON outputs are produced
  Then every output represents the same changes and decision statuses
  And no output mode reruns or alters detection

Scenario: Summary keeps the review overview compact
  Given a comparison contains changes, confirmation-required items, and an
    uncalculated schedule
  When summary output is produced
  Then it includes their counts and status
  And it does not enumerate every detailed item

Scenario: Full Markdown preserves the existing review contract
  Given a comparison contains detailed changes and limitations
  When full output is produced
  Then the existing detailed Markdown content remains available
  And full is the default human-readable report mode

Scenario: Audit output retains available rationale and constraints
  Given a comparison contains decision evidence and analysis constraints
  When audit output is produced
  Then all available evidence, constraints, unsupported reasons, and
    limitations are included
  And unavailable runtime evidence is not described as verified

Scenario: JSON is locale-independent
  Given the host display language changes
  When JSON output is produced for the same neutral result
  Then its semantic fields, codes, identifiers, and raw JP1/AJS values are
    unchanged
```

## Architecture

- Domain: own only reusable JP1/AJS comparison meaning when such meaning is
  independent of report or host concerns; do not add Markdown, localization,
  JSON, or VS Code responsibilities.
- Application: own the host-neutral Semantic Diff result, structured evidence
  and reason codes, canonical summary aggregation, the immutable
  `SemanticDiffOutputContext`, output-mode request contract, and
  parse-versus-success result boundary.
- Presentation: own mode-specific Markdown and JSON serialization, localized
  human wording, output selection surfaces, display, copy, and save behavior.
- Infrastructure: none expected. File selection or persistence remains behind
  host capabilities and must not enter neutral comparison logic.

## Impact Analysis

### Dependency Impact

- Current `SemanticDiffChangeSet` mixes neutral data with display-oriented
  `summary`, `rationale`, `message`, and `reportSections` fields;
  `BuildSemanticDiffReportData` returns that change set directly through a
  `changeSet` success property; the Markdown renderer selects, sorts,
  localizes, and formats it; the VS Code command always renders and opens one
  detailed Markdown document.
- Likely affected consumers include Semantic Diff comparison tests, report-data
  tests, Markdown/localization tests, the compare command and report document,
  Flow Viewer highlight projection, bootstrap wiring, package contributions,
  README, and the two durable Semantic Diff use cases.
- Propagation decision: establish the neutral application contract and one
  immutable output context before adding output modes, adapt existing Markdown
  to consume that context, and keep Flow highlighting limited to its existing
  IDs/state projection. Flow DTOs and wire messages do not gain reason codes or
  duplicated reason detail. Existing comparison rules and consumer-visible
  meaning remain unchanged. Identity evidence is consumed when available; it
  is not generated or redefined here. The success property migration is atomic
  inside the repository:
  `BuildSemanticDiffReportDataResult.ok === true` exposes only
  `result: SemanticDiffResult`; all application, presentation, command, and
  test call sites migrate in the same Slice 1 boundary change. There is no
  dual `changeSet`/`result` wire shape and no compatibility alias after Slice 1
  review, because this is an internal contract.

### Overlap Decision

- `semantic-diff-identity-confidence` owns identity fingerprint strategies,
  correspondence decisions, and generation of identity evidence. This feature
  owns the neutral transport and presentation of that evidence.
- `semantic-diff-review-risk-rules` owns which changes require confirmation
  and their risk classification, including generation of records for the three
  additive reason codes. This feature owns the exact nine-member reason union,
  its neutral transport, and its mode-specific presentation and serializer
  mappings; it does not select or generate confirmation records.
- `semantic-diff-explorer` owns interactive exploration, filtering, the later
  default destination, and its internal `Output` action placement. It consumes
  this feature's immutable output context, four-mode picker, and dispatcher
  without recomputing counts, rebuilding the context, or rerunning comparison.
  Its session retains `context.result`, resolves detail through
  `confirmationIds` and `changeIds`, and uses `context.summary` for cards and
  filtering. It does not own or redefine the output contract.
- Flow Viewer owns only its existing highlight/navigation identifiers and
  state. It does not transport `reasonCode`, confirmation detail, change
  detail, the output context, or a competing aggregation; Explorer resolves
  those facts from its retained immutable context.
- `semantic-diff-comparison-workflow` owns comparison sources, naming, period
  input, and viewer/output handoff. It may request a mode but does not redefine
  mode semantics.

### Breaking Change Analysis

- User-visible behavior: the standalone command adds a Full-first four-mode
  picker while preserving Full as the default human-readable representation
  and explicit Markdown copy. After Explorer adoption, Explorer becomes the
  default destination and exposes the same picker through its `Output` action.
- API/DTO/schema compatibility: internal application DTOs and renderer
  interfaces are expected to change. The initial JSON contract is new; no
  existing external JSON schema requires migration.
- VS Code/web extension compatibility: no minimum VS Code increase is allowed;
  shared contracts and serializers must remain browser-safe and must not import
  Node built-ins.
- Changed scenarios: extend `UC: Present Semantic Diff Report` from one
  Markdown density to purpose-specific outputs while preserving all existing
  scenarios; `UC: Build Semantic Diff` changes only at the neutral output
  boundary, not in comparison meaning.

### Alternative Considerations

- Add flags directly to the current Markdown renderer: rejected because
  display-oriented fields would remain embedded in the detection DTO and JSON
  would inherit presentation wording.
- Treat JSON as a dump of the current DTO: rejected because localized or
  prose-based semantics would be unstable for CI and external review systems.
- Create separate comparison pipelines per mode: rejected because modes could
  disagree about the same inputs and duplicate detection rules.
- Include diagnostics or Problems output: deferred to a separate feature; the
  source proposal mentions possible future presentation adapters, but this
  feature's one purpose is the four named outputs.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  and `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: changing identity matching, adding or
  changing confirmation-required rules, adding a fifth output mode, changing
  output-context ownership or lifetime, allowing a consumer to re-aggregate or
  rebuild the context, changing picker/dispatcher ownership or the Explorer
  transition boundary, adding reason detail to Flow DTOs/wire messages,
  changing comparison sources, introducing external JSON publication
  guarantees beyond this repository, raising VS Code compatibility, or
  requiring Node-only production behavior.

## Compatibility

- VS Code compatibility remains the `package.json` `engines.vscode` contract.
- Web extension compatibility: summary, full, audit, and JSON projection must
  be browser-safe; host-specific display, clipboard, and save operations use
  injected presentation capabilities.
- Desktop extension compatibility: before Explorer adoption, the existing
  compare command uses the Full-first four-mode picker; after adoption,
  Explorer opens by default and its `Output` action exposes that same picker.
  Explicit Markdown copy remains available in either output path.
- JP1/AJS compatibility: the feature must preserve all existing comparison
  facts, raw values, unsupported/uncalculated distinctions, limitations, and
  version 13 normative scope. It introduces no new interpretation rule.
- Localization compatibility: Full Japanese is explicitly an existing-byte-
  parity mode. It keeps the current generic confirmation keys and exact values,
  current relation-added/removed values, and raw English unsupported/
  limitation fallbacks; it does not introduce reason-specific Japanese prose.
  Full and Audit English follow the structured reason mapping, unsupported
  display languages fall back to English, and JSON semantics are
  locale-independent. Summary human wording follows the same localization
  policy.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- A single successful comparison produces one immutable output context that
  can produce summary, full, audit, and JSON outputs without invoking
  comparison or summary aggregation again.
- Existing full Markdown content, localization, explicit copy behavior, empty
  state, and unsupported/uncalculated visibility remain covered by regression
  tests. Full remains the first/default human-readable mode in the standalone
  picker and remains available through the Explorer's later internal `Output`
  action; the golden output also preserves every structured replacement and
  optional warning when present or absent.
- Summary tests demonstrate compact zero-inclusive counts by change kind,
  element kind, and attribute category, separate counts for every unsupported
  kind, and status without full item enumeration. `hasUncalculated` and
  `hasFindings` follow explicit predicates, including empty schedules and
  unchanged identity decisions as non-findings.
- Audit tests demonstrate complete inclusion of available evidence,
  constraints, unsupported/uncalculated reasons, and limitations.
- JSON tests demonstrate the complete v1 nested field/key-order contract,
  explicit `[]` versus `null`, record-specific ordinal sorting for every
  collection with complete tie-breakers and duplicate retention, media type,
  locale/host/insertion-order byte independence, stable codes and raw values,
  explicit optional-section handling, and rejection of parse failures as valid
  reports.
- Contract tests demonstrate that all four outputs retain the same change IDs,
  decision statuses, and comparison period where applicable. They also prove
  that comparison-completion orchestration constructs exactly one immutable
  `SemanticDiffOutputContext`, that all modes receive the same context identity
  through `presentSemanticDiffOutput(context, mode)`, and that no renderer
  rebuilds or re-aggregates it.
- Standalone command tests prove the Full-first four-mode picker dispatches one
  successful context without rerunning comparison. Cross-feature tests prove
  that, after Explorer adoption, Explorer becomes the default destination and
  its internal `Output` action uses the same picker and dispatcher with its
  stored context while preserving all four modes. Explorer cards and filtering
  consume `context.summary`; its session resolves confirmation and change
  details from the immutable original result by IDs. Flow DTOs and wire
  messages remain limited to existing IDs/state, with no `reasonCode` or
  duplicated reason detail.
- Desktop and web validation confirms shared output contracts remain
  browser-safe, host adapters preserve failure behavior, and virtual report
  documents have unique immutable URIs, bounded commit-time eviction,
  per-invocation open-failure rollback, independent concurrent behavior,
  in-flight disposal safety, late-completion suppression, and idempotent
  disposal; same-URI update and supersession are unsupported.

## Non-Goals

- Defining or changing identity fingerprints, matching confidence, rename/move
  decisions, or identity-evidence generation.
- Defining new confirmation-required or execution-risk rules.
- Adding the interactive Semantic Diff Explorer UI, its default-destination
  switch, Flow Viewer behavior, source navigation, Git HEAD input, WebAPI
  input, or comparison-period UX. The cross-feature handoff contract does not
  authorize those Explorer implementation changes in this feature.
- Adding reason codes or reason detail to Flow DTOs or wire messages, or
  making Flow own Semantic Diff output-session state.
- Adding diagnostics to reports or emitting VS Code Problems.
- Defining new schedule interpretation or run-projection semantics.
- Claiming external-runtime state, execution history, permissions, resource
  contention, or branch outcomes as verified.
- Providing a stable public API or cross-version external JSON compatibility
  guarantee unless Planning explicitly returns that as a new approval decision.

## Durable Document Impact

- `docs/requirements/use-cases/uc-present-semantic-diff-report.md` will require
  Feature Exit propagation for the four output purposes, mode selection, and
  locale-independent structured output.
- `docs/requirements/use-cases/uc-build-semantic-diff.md` may need a minimal
  boundary clarification that its result is neutral and presentation-agnostic;
  comparison rules do not change.
- `docs/specs/architecture.md` requires an update only if implementation
  changes the durable application/presentation responsibility statement; its
  current ownership already supports the intended separation.
- README and CHANGELOG impact must be evaluated for the new user-visible mode
  selection and JSON workflow. Roadmap ordering is already current and needs
  no intake update.

## Open Questions

- None. The internal result migration, structured replacements, summary
  aggregation, JSON v1 wire contract, output metadata, and virtual-document
  lifecycle are fixed in the plan; changing them requires Replanning and a new
  approval decision within R-2/N-4/F-3.
