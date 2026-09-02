# Requirements Traceability: Semantic Diff Structured Outputs

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                                | SPECS.md section                                                                           | Implementation slice            | Test or validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UC: Build Semantic Diff neutral result; R1, R2, R7                                    | Requirements; Architecture; Structured Fact Contract And Full Parity                       | Slice 1                         | Contract, comparison, schedule, and report-data tests prove that prose/report sections are not semantic inputs, every removed prose field has typed code/detail facts, relation pairs are correspondence-first, identity evidence is transported unchanged, parse failures stay distinct, and all consumers use `result` without a `changeSet` compatibility field.                                                                                                                                                           |
| Reusable summary builder and immutable output context for Summary, JSON, and Explorer | Reusable Summary Contract; Output Contract                                                 | Slices 1 and 4                  | Pure builder/context and command integration tests assert exactly the nine summary fields, exhaustive zero-inclusive buckets, duplicate-preserving counts, `confirmationRequiredCount` as confirmation records plus confirmation-level change leaves, fixed predicates, declared key order, empty/identity-only/schedule edge cases, one context per successful comparison, no context on parse failure, original-result identity, and readonly lifetime. No renderer or Explorer aggregation is involved.                    |
| Identity evidence is transported but not generated                                    | Overlap Decision; Identity Evidence Dependency Contract                                    | Slices 1-3                      | Slice 1 consumes the committed identity-confidence contract; Markdown and JSON projections preserve required arrays, optional targets versus JSON `null`, decision IDs, status/reference order, evidence, and ID-remap relation facts without matching or ranking candidates. The shared context retains the original evidence for all projections.                                                                                                                                                                           |
| Existing Full Markdown and default human-readable report; R4                          | Requirements; Compatibility; Acceptance Criteria; Structured Fact Contract And Full Parity | Slice 2                         | Markdown fixtures retain current English/Japanese Full bytes, empty state, schedule/unsupported visibility, warning-present/absent data, relation projections, nine reason mappings, raw fallback behavior, and no comparison, aggregation, or context rebuild. Full-first/default selection is verified in Slice 4.                                                                                                                                                                                                          |
| Summary Markdown purpose; R3                                                          | Requirements; Behavioral Scenarios; Reusable Summary Contract                              | Slice 2                         | Renderer tests supply the shared immutable output context and verify every zero bucket, combined confirmation count, status, scope/period, compactness, localization, and duplicate fixture without recomputing counts, predicates, or rebuilding the context.                                                                                                                                                                                                                                                                |
| Audit Markdown purpose; R5                                                            | Requirements; Behavioral Scenarios                                                         | Slice 2                         | Audit tests cover identity evidence, all nine reason codes, typed detail/constraints/warnings, unsupported and limitation codes, periods, raw values, localization, and explicit non-assertion of runtime or external evidence.                                                                                                                                                                                                                                                                                               |
| JSON purpose and locale neutrality; R6                                                | Requirements; Compatibility; Acceptance Criteria; JSON Version 1                           | Slice 3                         | Serializer tests consume the shared immutable output context and cover the fixed v1 shape/key order, explicit `[]`/`null`, stable codes/raw values, identity evidence, all nine reason codes, relation canonicalPair/endpoints, warning/constraint/detail shapes, parse-failure rejection, and complete collection tuples for `changes`, `schedule.runChanges`, `identityDecisions`, inputs, targets, and v1 nested arrays without rebuilding the summary. Diagnostics/Problems are outside the v1 shape and are not emitted. |
| JSON collection determinism and `reportSections` exclusion                            | JSON Version 1                                                                             | Slice 3                         | Shuffled-input, locale, null/empty, tie-breaker, duplicate-retention, and byte fixtures assert UTF-16 ordinal ordering for every named collection and nested array; `reportSections` is rejected/not emitted. No generic tuple or incidental object order is used.                                                                                                                                                                                                                                                            |
| Mode selection, display, explicit copy/save                                           | VS Code Selection And Output Lifecycle; Acceptance Criteria                                | Slice 4                         | Command/document/bootstrap/package tests cover the Full-first common Summary/Full/Audit/JSON picker, cancellation before comparison, one comparison-completion context, one call to `presentSemanticDiffOutput(context, mode)` with the same context, media type/extension, Markdown copy guard, explicit save, and host-safe failures.                                                                                                                                                                                       |
| Virtual report lifecycle                                                              | VS Code Selection And Output Lifecycle; Virtual Report Lifecycle Contract                  | Slice 4                         | Provider tests cover limits 31/32/33, recency, commit-time eviction, unique immutable URIs, independent concurrent opens, per-invocation rollback, disposal during either host operation, late completion after disposal, and idempotent disposal. Same-URI update/token-supersession tests are intentionally absent.                                                                                                                                                                                                         |
| Cross-mode consistency and no changed detection; R7                                   | Requirements; Acceptance Criteria                                                          | Cross-slice validation gate     | One successful immutable `SemanticDiffOutputContext` is passed through Summary, Full, Audit, and JSON via `presentSemanticDiffOutput(context, mode)`; spies prove one context/summary build at comparison completion and no second comparison, identity match, schedule evaluation, aggregation, context construction, or rule generation. IDs/evidence/period/reason details remain equal.                                                                                                                                   |
| Explorer summary/filter/card and output handoff                                       | Overlap Decision; Reusable Summary Contract; Output Contract                               | Cross-feature validation gate   | Explorer fixtures with duplicate confirmation records and confirmation-level change leaves assert that cards/filtering use `context.summary`. Its session retains `context.result` and resolves detail by `confirmationIds`/`changeIds`; after Explorer adoption its `Output` action calls the same exported Summary/Full/Audit/JSON picker/dispatcher with the stored context, without rerunning comparison or copying mode logic; all four modes remain reachable.                                                          |
| Flow projection and reason-detail ownership                                           | Overlap Decision; Output Contract; Compatibility                                           | Cross-feature validation gate   | Flow DTOs and wire messages retain only existing IDs/state and add no `reasonCode` or duplicated reason detail. Explorer/session tests resolve confirmation/change detail from the immutable original result by `confirmationIds`/`changeIds`, handle missing IDs safely, and leave Flow responsible only for projection/navigation state.                                                                                                                                                                                    |
| Review-risk ownership boundary                                                        | Overlap Decision; Non-Goals                                                                | Slices 1-3 and cross-slice gate | Neutral, Markdown, and JSON tests transport exactly the nine-member union, including downstream additions, without selecting/generating records; review-risk consumes `execution-user-type-changed` and owns rule generation.                                                                                                                                                                                                                                                                                                 |
| Schedule-semantics ownership boundary                                                 | Requirements; Non-Goals; Compatibility                                                     | Slice 1 and cross-slice gate    | Existing schedule period, run changes, zero-run decisions, unsupported reasons, and limitations migrate unchanged; no new interpretation is introduced and cross-mode projections retain the same facts.                                                                                                                                                                                                                                                                                                                      |
| Desktop/web and VS Code compatibility; R8                                             | Compatibility; Acceptance Criteria                                                         | Slice 4 and cross-slice gate    | Browser-safe shared output/context contracts, `workspace.fs` save, `^1.75.0` APIs, architecture dependency rules, desktop tests, web tests, and smoke checks cover common picker/dispatcher mode display/copy/save, context lifetime, and host failures.                                                                                                                                                                                                                                                                      |
| JP1/AJS compatibility and raw values                                                  | Compatibility; Acceptance Criteria                                                         | Slices 1-3 and cross-slice gate | v13 comparison facts, raw identifiers/paths/parameters, unsupported distinctions, schedules, Japanese characters, and escaping remain unchanged in neutral, Markdown, and JSON fixtures; Flow continues to carry only existing IDs/state.                                                                                                                                                                                                                                                                                     |
| Large and malformed input readiness                                                   | Compatibility; Acceptance Criteria                                                         | Cross-slice validation gate     | Parse failures never produce an output document; representative empty, malformed, warning, unsupported, identity, Japanese, and large-result fixtures verify bounded rendering/serialization and safe failure.                                                                                                                                                                                                                                                                                                                |
| Durable documentation and release communication                                       | Durable Document Impact                                                                    | Feature Exit                    | Feature Exit evaluates updates to both Semantic Diff use cases, architecture wording if needed, README, and CHANGELOG; roadmap changes only if repository-level sequencing changes.                                                                                                                                                                                                                                                                                                                                           |

<!-- markdownlint-enable MD013 MD060 -->

## Slice 1 Implementation Validation

Slice 1 implementation and the first implementation-review findings are
addressed and ready for independent re-review. The neutral application
boundary, typed fact mapping, atomic `result` migration,
correspondence-first relation pairs, and pure summary/context builders are
covered by the application contract, report-data, comparison, schedule,
condition, Flow, and Markdown regression suites. Contract evidence explicitly
covers all nine confirmation reasons (including the three downstream codes),
warning-present/absent records, former prose-to-detail mappings, schedule
missing/empty/changed/unsupported states, exactly one summary-builder call,
and readonly context identity/lifetime. Markdown fixtures prove Japanese
after-before attribute precedence, English move parent derivation, and
relationPair-only Full side rendering when generic targets conflict.
`rtk pnpm run test:compile`, 69 focused semantic-diff tests, desktop tests,
`rtk pnpm run qlty`, `rtk pnpm run build`, and `rtk pnpm run lint:md` passed.
The web bundle build passed; the web smoke runner could not start Chromium
because the host denied its Mach-port rendezvous. Slice 1 does not claim the
later mode-picker, Summary/Audit/JSON projections, Explorer, or cross-mode
orchestration evidence; those remain assigned to later slices. No new
interpretation, identity matching, host API, Node dependency, or telemetry
behavior was introduced.

## Slice 2 Implementation Validation

Slice 2 Markdown projections are implemented and ready for independent
implementation review. Summary formats only the supplied
`SemanticDiffOutputContext.summary` counts and predicates (using the context
result only for scope and an optional schedule period); it does not aggregate
records. Full and Audit receive the same context and read detailed facts from
`context.result`, with Full preserving the existing result-input compatibility
path and context/result output parity. Audit includes definition-derived
identity evidence, all nine closed confirmation reason codes, typed details,
relation pairs, constraints, warning-present/absent states, unsupported and
limitation records, raw values, and schedule period/run facts. Japanese Audit
labels and the explicit statement that runtime and external state were not
verified are covered by focused fixtures. Absent schedules and present
zero-run schedules are distinguished in Summary output; no projection invokes
comparison, summary construction, or output-context construction.

The focused compiled semantic-diff suites pass with 75 tests, including the
new Summary/Full/Audit projection fixtures and existing Full English/Japanese
goldens. `rtk pnpm run test:compile`, `rtk pnpm run qlty`, `rtk pnpm run build`,
desktop preparation/tests, web preparation, and `rtk pnpm run lint:md` pass.
The web smoke runner is host-blocked when Chromium cannot obtain its Mach-port
rendezvous; this is an environment limitation rather than a shared-code
failure. `git diff --check` passes. Slice 2 does not claim JSON, the
mode-picker/dispatcher, VS Code host integration, Explorer, or new semantic
facts.

## Slice 3 Implementation Validation

Slice 3 implements the explicit locale-neutral JSON version 1 DTO and
serializer over the supplied immutable `SemanticDiffOutputContext`. The
projection constructs the schema identifier/version, summary, result, and
every nested object in the declared key order. It emits required arrays as
`[]`, optional targets/sides/paths/run sides/fallback values as `null`, keeps
raw JP1/AJS identifiers, paths, parameter keys, values, dates, and times
unchanged, and excludes prose, `reportSections`, diagnostics, and internal
object layout. Summary values come from the supplied context summary; result
facts come from the supplied context result without summary rebuilding,
re-aggregation, or mutation. Identity evidence and contract reference order,
correspondence-first relation canonical pairs and actual endpoints, typed
details, warnings, constraints, unsupported/limitation facts, schedules, and
all nine confirmation reason codes are preserved. Record-specific complete
tuple comparators use UTF-16 ordinal comparison, explicit nullable/array
ordering, and duplicate retention; identity decisions use the imported
status/evidence-discriminator/rule/reference tuple; neither the serializer nor
its helpers use `localeCompare` or `Intl.Collator`. Unknown and superseded
confirmation reason codes are rejected, required undefined fields are rejected
before serialization, and non-finite schedule rules are rejected rather than
silently producing invalid JSON. Review fixtures cover same-status strategy
and exact key-kind ordering, fingerprint ID-remap canonicalPair/original
endpoints with relation `identityDecisionId: null` and the corresponding unit
decision ID, Japanese/quote/backslash/newline escaping, equal-prefix nested
tie-breakers, and retained duplicates.

The compiled JSON suite passes 13 tests, and the complete focused Semantic Diff
set passes 88 tests. `rtk pnpm run test:compile`, `rtk pnpm run qlty`,
`rtk pnpm run build`, desktop preparation/tests, web preparation,
`rtk pnpm run lint:md`, and `git diff --check` pass. The web smoke runner is
host-blocked when Chromium cannot obtain its Mach-port rendezvous; the shared
browser-safe code and web bundle preparation pass. Slice 3 does not claim the
four-mode picker/dispatcher, VS Code host integration, Explorer, or
cross-mode orchestration, which remain assigned to Slice 4 and the
cross-slice gate. No new semantic interpretation, identity matching, host
API, Node dependency, or telemetry behavior was introduced.

## Slice 4 Implementation Validation

Slice 4 adds the shared Full-first Summary/Full/Audit/JSON picker and the
`presentSemanticDiffOutput(context, mode)` dispatcher. The standalone compare
command checks the active editor before opening the picker, cancels before
reading or comparing, performs one comparison, builds one immutable output
context, and passes that context to the selected output projection. Dispatcher
outputs carry the mode, Markdown/JSON language ID, extension, media type, and
selected content. Summary, Full, Audit, and JSON retain their existing
projection contracts; Markdown copy remains explicit and rejects JSON.

The generalized virtual report provider stores output metadata under unique
immutable URIs, uses bounded commit-time LRU retention with creation-sequence
ties, protects in-flight opens, rolls back only failed invocations, serializes
successful commits by creation order, and invalidates pending and committed
state on idempotent disposal. Save uses injected `workspace.fs` and
`TextEncoder`, mode-specific suggested file names, and safe cancellation and
failure handling. Bootstrap and package contributions register the save
command while preserving the compare and copy IDs and `^1.75.0` compatibility.

Focused command, output, provider, package, and subscription tests cover picker
ordering/cancellation, context identity, mode metadata, JSON copy guard,
explicit save, explicit cache limits 31/32/33, equal-recency
creation-sequence eviction, concurrent successful creation-order commits,
rollback, disposal during `openTextDocument` and `showTextDocument`, late
completion, and repeated disposal. `test:compile`,
qlty, production build/package, desktop preparation/tests, web preparation,
Markdown lint, and diff checks pass. Web smoke is host-blocked when Chromium
cannot obtain its Mach-port rendezvous; shared browser-safe code and web
bundle preparation pass. Slice 4 does not implement Explorer UI or its
destination transition, automatic save/copy, new semantic facts, Node
built-ins, or telemetry.
