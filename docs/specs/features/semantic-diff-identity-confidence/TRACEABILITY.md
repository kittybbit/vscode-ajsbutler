# Requirements Traceability: Semantic Diff Identity Confidence

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                  | SPECS.md coverage                    | Implementation slice                  | Test or validation                                                                                                                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Explicit strategy selection and supported forms                         | R1-R2; first behavioral scenario     | Slice 1                               | Table-driven `semanticDiffStructuralRules.test.ts` enumerates `j`/`rj` `te`, UNIX/PC/QUEUE `sc`/`prm`, event reception, file monitoring, recovery types, and the official v13 references |
| Separate command and executable identity conditions                     | R1-R2, R7; Acceptance Criteria       | Slice 1                               | Independent `te`-change versus `sc`/`prm`-change scenarios; mixed-form and cross-strategy cases remain fallback or addition/removal, never cross-match                                   |
| Deterministic canonical evidence and IDs                                | R3, R10; Acceptance Criteria         | Slice 1, then Slice 2 projection      | Field presence/value/order/default tests; length-prefixed ID uniqueness/stability and plain JSON checks in `semanticDiffContracts.test.ts`                                               |
| Exact identity remains first                                            | R4; Compatibility                    | Slice 1                               | Exact-precedence jobnet/unit scenarios in structural and comparison tests                                                                                                                |
| One-to-one-only confirmation                                            | R5; second behavioral scenario       | Slice 1                               | One-before/one-after tests for every semantic strategy and excluded-attribute/relation regressions                                                                                       |
| Ambiguity retains every sorted candidate                                | R6; third behavioral scenario        | Slices 1-3                            | Multi-side domain grouping, deterministic before/after reference sorting, all-reference DTO assertions, and English/Japanese report assertions                                           |
| Changed fingerprint remains removal plus addition                       | R7; fourth behavioral scenario       | Slices 1-2                            | Separate `te`, `sc`, and `prm` changes, event selectors, `flwf`, and effective-`flwc`; added/removed decisions carry the corresponding unit evidence                                     |
| Every identity outcome exposes typed rule/evidence                      | R8; Acceptance Criteria              | Slices 2-3                            | Complete union/discriminant, required/empty side fields, candidate set, exact-key/fingerprint evidence, and `SemanticDiffChange.identityDecisionId` contract tests                       |
| Unsupported forms remain conservative                                   | R9                                   | Slice 1                               | Every repository `AjsUnitType` plus invalid, missing, duplicate, mixed, and malformed forms use legacy-equivalence tests and no-new-auto-match assertions                                |
| Host-neutral, serializable, privacy-conscious evidence                  | R10; Architecture; Compatibility     | Slices 2-3                            | Serialization/prohibited-object tests, desktop and `rtk pnpm run test:web` host checks, architecture checks, telemetry non-change review, escaping tests, full tests, build, and qlty    |
| Reordering remains semantically unchanged                               | R3-R5; Compatibility                 | Slices 1-3                            | Definition/parameter/repeated-`evwfr` ordering, candidate/reference sorting, stable ID, and deterministic DTO/report ordering tests                                                      |
| Relation, risk, schedule, Flow, command, desktop, and web compatibility | Acceptance Criteria; Impact Analysis | All slices; final evidence in Slice 3 | Relevant Semantic Diff suites, `rtk pnpm run test:full`, web validation in Slice 2, build, and qlty                                                                                      |
| Durable identity/report contract                                        | Durable Document Impact              | Feature Exit                          | Update build use case; conditionally update report use case; confirm CHANGELOG/README decisions                                                                                          |

<!-- markdownlint-enable MD013 MD060 -->

## Slice 1 Implementation Evidence

- Status: Implemented; implementation review Ready, Completion Approval
  granted, and focused completion commit `523301c6` present.
- Changed paths: domain identity strategy types/factory and structural
  correspondence, plus the approved structural and comparison test suites.
- Acceptance evidence: command-text and executable-file forms are distinct;
  event-reception and file-monitoring (including recovery) fields are
  canonicalized with deterministic ordering/default handling; exact-first,
  one-to-one, candidate, added, and removed outcomes retain typed evidence.
  Unsupported and malformed forms use the legacy strategy representation;
  command `te`/`prm` values are limited to 1-1023 bytes and `sc` values to
  1-511 bytes after v13 quoted-string validation. Every repository
  `AjsUnitType` has direct fallback-key coverage, and repeated-candidate,
  selector-boundary, sc/prm-change, and exact/add/remove evidence cases are
  table-driven.
- Implementation-review follow-up: the v13 command value/form checks now
  reject empty, overlong, unquoted, invalid-escape, duplicate, and mixed
  `te`/`sc`/`prm` inputs. The legacy fallback grouping key is centralized in
  the identity factory and is asserted byte-for-byte against the historical
  representation for all repository unit types.
- Validation: `rtk pnpm run test:compile`, compiled desktop runner
  (`rtk pnpm run test:desktop:run`), `rtk git diff --check`, and
  `rtk pnpm run qlty` passed after the follow-up. Direct targeted Mocha
  executed 24 tests, with 22 passing; two pre-existing baseline expectations
  remain outside this slice (relation decision duplicate and
  normalization-warning shape).
- Compatibility: no parser, DTO, presentation, telemetry, host API, Node
  built-in, or configuration changes. Identity code remains pure and
  browser-safe; `engines.vscode` is unchanged.
- Implementation feedback: computing one structured fingerprint per scoped
  unit before grouped matching keeps candidate handling deterministic and
  near-linear while preserving duplicate values. The existing relation and
  normalization baseline mismatches should be assessed independently before
  the feature is closed.

## Slice 2 Implementation Evidence

- Status: Implemented; pending independent implementation review and
  Completion Approval.
- Human Approval: Slice 2 was approved in the current conversation after the
  Slice 1 completion commit `523301c6`. The exact boundary is recorded in
  `TASKS.md`; no presentation, parser, telemetry, command, package, or
  configuration source was changed.
- Changed paths: application Semantic Diff DTO and comparison mapping, plus
  the approved direct DTO/comparison/report-data, command, Flow, extension,
  and Markdown-consumer fixtures/tests. `identityDecisions` is always present
  as an array, including the empty case; all domain decisions are cloned into
  the host-neutral DTO once.
- Acceptance evidence: exact, fingerprint-confirmed, candidate, removed, and
  added decisions project with their typed rule, status, stable ID, required
  empty/non-empty sides, sorted references, and copied fingerprint fields.
  Structural and attribute changes carry their decision ID; relation changes
  do not. Candidate changes retain only before context and no longer expose a
  falsely selected first after target. Existing DTO fields and report/Flow/
  command handoffs remain available.
- Serialization and compatibility: DTO mapping contains only scalar strings,
  arrays, and plain objects. Contract tests reject domain/parser values and
  verify JSON parsing, stable IDs/order, complete candidate sets, and
  unchanged exact outcomes. No telemetry or logging path receives evidence;
  `engines.vscode` remains `^1.75.0` and shared code stays browser-safe.
- Validation: `rtk pnpm run test:compile` passed; focused compiled Mocha passed
  17 tests with one pre-existing normalization-warning expectation outside
  this slice. The compiled desktop suite (`rtk pnpm run test:desktop:run`),
  web suite (`rtk pnpm run test:web`, exit 0; browser teardown emitted benign
  ECONNRESET/premature-close diagnostics), `rtk pnpm run qlty`,
  `rtk pnpm run lint:md`, `rtk git diff --check`, and production
  `rtk pnpm run build` passed. Production build retained existing asset-size
  warnings only.
- Implementation feedback: keeping an application-side decision index keyed
  by domain reference pairs links every generated unit/attribute change to its
  already-computed domain decision without rerunning identity rules. Explicit
  conditional target projection prevents candidate/add/remove changes from
  serializing non-applicable sides.
- Re-review follow-up: the Markdown consumer fixture now mirrors the additive
  candidate contract by omitting its non-applicable after target and aligning
  the synthetic change ID with the before-only context. Presentation source and
  wording remain unchanged.
- Unresolved risks: the known relation-decision duplicate and
  normalization-warning baseline expectations remain outside Slice 2. The
  focused direct Markdown suite also retains three pre-existing expectations
  for blank-line, escaping, and schedule-period output; the candidate-specific
  after-target expectation is corrected. The independent implementation
  reviewer must confirm additive DTO compatibility and that hand-built
  consumers remain within the approved boundary.
