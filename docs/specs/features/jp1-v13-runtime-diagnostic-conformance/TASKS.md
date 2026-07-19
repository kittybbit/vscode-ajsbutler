# Feature Tasks: JP1/AJS3 v13 Runtime Diagnostic Conformance

## Agent Brief

- Purpose: make runtime semantic diagnostics conform to the currently
  supported JP1/AJS3 version 13 parameter rules.
- Approved slices: S1-S6; active implementation slice: S3.
- Do not: edit runtime code, tests, generated artifacts, or configuration
  before a reviewed slice receives clear approval.
- Do not: expand coverage to unsupported parameter families or change parser,
  hover, list, flow, CSV, semantic-diff, or unit-definition behavior.
- Read first: `SPECS.md`, this file, and the normative diagnostic parameter
  rules.
- Read `TRACEABILITY.md` when reviewing or implementing a slice.
- Validate each code slice with focused desktop evidence and
  `rtk pnpm run qlty`; run final desktop/web/build validation after Slice 6.
- Approval policy and document roles: see `docs/specs/README.md`.
- Next action: implement Slice 3 with `sdd-implement-task`.

## Sync Rule

- Update this file and `TRACEABILITY.md` with every slice status or validation
  change.
- Update `docs/specs/plans.md` only when the active feature or next branch
  decision changes; update `roadmap.md` only when repository sequencing changes.
- Keep this file focused on the active plan, approval, validation, risks, and
  feature exit readiness rather than implementation history.

## Plan Status

- Status: In Progress
- Planning scope: all supported-rule audit findings and confirmed runtime
  conformance gaps in `SPECS.md`.
- Review status: Reviewed; revised six-slice plan is ready for implementation
- Human approval: Approved for S1-S6
- Active implementation slice: S3

## Human Approval

- Status: Approved
- Approved at: approved in current conversation on 2026-07-20
- Approved scope: S1-S6 exactly as defined under Implementation Slices,
  including each slice's named files, tests, documentation sync, validation,
  dependencies, and Approval Boundary

Implementation may proceed one slice at a time with `sdd-implement-task`,
starting with S1. Changes outside an approved slice boundary require replanning
and fresh approval.

## Replanning Basis

- The prior Slice 5 excluded parameter keys and separators from the repeated
  `evwfr` byte total. Command Reference 5.2.9 instead governs the complete
  repeated `evwfr=optional-extended-attribute-name:"value";` forms.
- File-monitoring form validation and quoted byte semantics were independent
  meanings in one slice; transfer context and quoted byte semantics were also
  combined. The revised plan separates them into six smallest useful slices.
- Conditional helper ownership made approval boundaries ambiguous. Slice 3 now
  names the exact shared helper owners.
- Every revised slice now carries direct use-case, requirement, SPECS, and
  validation traceability.

## Impact Investigation

- Application ownership remains under `src/application/editor-feedback/`; no
  VS Code API, presentation mapping, infrastructure, telemetry, command,
  activation, DTO, parser, or normalized-model change is planned.
- `AjsUnit.parameters` preserves repeated values and source positions.
  `findParameters(...)` supplies every `evwfr`, so canonical aggregate byte
  contributions can be calculated without reconstructing source text.
- Canonical `evwfr` contribution is the UTF-8 byte length of the fixed
  `evwfr=` prefix, the normalized raw parameter value, and the terminating `;`.
  Formatting whitespace and line endings are not part of the official parameter
  form and are excluded.
- Version 13 Command Reference sections 5.2.4, 5.2.6, 5.2.7, 5.2.9, 5.2.10,
  and 5.2.24 constrain the changes. No undocumented JP1/AJS behavior remains.
- User-visible false positives, false negatives, and diagnostic wording change
  intentionally; parser output, DTO shape, coordinates, and VS Code
  `engines.vscode` compatibility remain stable.
- The diagnosis use case remains correct. The durable event-filter rule was
  clarified with the official aggregate format during replanning.

## Implementation Slices

### Slice 1: Conform yearly schedule cycle diagnostics

- Status: Complete
- Scope: change yearly `cy=(n,y)` from `1..10` to `1..9`, update its message,
  add boundary tests, and start one consolidated Unreleased CHANGELOG entry.
- User / Domain Value: invalid yearly cycle 10 is diagnosed while 9 remains
  valid.
- Smallest Useful Slice: one schedule range meaning, message, and regression
  boundary; independently reviewable, testable, committable, and approvable.
- Cohesive Change Group:
  - `syntaxDiagnosticScheduleRules.ts`:
    `maximumExplicitCycleByUnit`, `isValidExplicitCycle`
  - `syntaxDiagnosticScheduleRuleBuilders.ts`: `cy` message
  - `buildSyntaxDiagnostics.test.ts`: schedule boundary cases
  - `CHANGELOG.md`, this file, and `TRACEABILITY.md`
- Acceptance: `cy=(9,y)` is accepted; `cy=(10,y)` produces one diagnostic
  stating `y=1..9`; other schedule semantics and source positions are unchanged.
- Validation: `rtk pnpm test` and `rtk pnpm run qlty`.
- Traceability: `UC-DIAG`; `RULE-SCHEDULE` / `CONF-CY`; SPECS Requirements,
  Scenarios, and Acceptance Criteria; `VAL-CY`.
- Production Readiness:
  - Failure mode: false positive at 9 or false negative at 10; test both sides.
  - JP1/AJS compatibility: Command Reference 5.2.4.
  - Large or malformed input risk: constant-time scalar validation.
  - Desktop/web impact: shared host-neutral application logic only.
  - README/docs impact: no README change; sync feature docs.
  - CHANGELOG impact: required; start the consolidated conformance entry.
  - Qlty evidence: no new smells; metrics-only movement remains a review signal.
- Approval Boundary: named schedule files, focused tests, CHANGELOG, and feature
  sync only. Other schedule rules or `scheduleLimitYear` require replanning.
- Dependencies: none.
- Risks: exact message assertions change with the range.
- Out of Scope: other schedule parameters, parser, and presentation wording.

### Slice 2: Conform file-monitoring condition forms

- Status: Complete
- Scope: validate only the complete `flwc=c[:d[:{s|m}]]` forms, add a focused
  diagnostic message and form matrix, and extend the CHANGELOG entry.
- User / Domain Value: malformed monitoring conditions are identified without
  changing valid file-monitoring behavior.
- Smallest Useful Slice: one `flwc` domain grammar meaning with its diagnostic
  and regression matrix.
- Cohesive Change Group:
  - `syntaxDiagnosticFileMonitoringRules.ts`: explicit `flwc` form validator
  - `syntaxDiagnosticRuleSets.ts`: `flwc` rule and message
  - `buildSyntaxDiagnostics.test.ts`: valid and malformed form matrix
  - `CHANGELOG.md`, this file, and `TRACEABILITY.md`
- Acceptance: `c`, `c:d`, `c:d:s`, and `c:d:m` are accepted; missing,
  reordered, empty, extra, or conflicting segments are rejected; `flco`,
  wildcard, interval, and source-position behavior remains unchanged.
- Validation: `rtk pnpm test` and `rtk pnpm run qlty`.
- Traceability: `UC-DIAG`; `RULE-FILE-MONITOR` / `CONF-FLWC`; SPECS
  Requirements, Scenarios, and Acceptance Criteria; `VAL-FLWC`.
- Production Readiness:
  - Failure mode: incomplete or permissive form matching leaves false negatives.
  - JP1/AJS compatibility: Command Reference 5.2.10.
  - Large or malformed input risk: one anchored, non-backtracking form check per
    explicit parameter.
  - Desktop/web impact: shared pure application validator only.
  - README/docs impact: no README or durable-doc change.
  - CHANGELOG impact: extend the consolidated entry.
  - Qlty evidence: no new smells; metrics-only movement is not a refactor gate.
- Approval Boundary: the named file-monitoring validator, rule wiring, focused
  tests, CHANGELOG, and feature sync. String byte semantics are Slice 3.
- Dependencies: Slice 1 complete for ordered commits; no semantic dependency.
- Risks: preserve omission default and existing `flco` effective-value behavior.
- Out of Scope: byte length, path existence, monitoring runtime, and parser.

### Slice 3: Measure governed quoted-string content bytes

- Status: Approved
- Scope: introduce one exact application helper path that selects quoted
  content or preserves an unquoted raw value, use it for `flwf` and
  `ts1..4`/`td1..4` byte rules, and add exact/multibyte boundaries.
- User / Domain Value: official content limits do not count serialization quote
  characters, while macro and bare-value behavior remains explicit.
- Smallest Useful Slice: one cross-family byte-interpretation responsibility
  used by the two confirmed consumers; it removes duplicated semantics without
  changing unrelated string validation.
- Cohesive Change Group:
  - `syntaxDiagnosticStringValidators.ts`: add a pure quoted-content-or-raw
    selector that removes one syntactic outer quote pair without decoding or
    rewriting the inner escape spelling
  - `syntaxDiagnosticScalarValidators.ts`: add the governed explicit byte-length
    validator using the selector and existing `hasValidByteLength`
  - `syntaxDiagnosticCore.ts`: add the governed byte-length rule builder
  - `syntaxDiagnosticFileMonitoringRules.ts`: use governed bytes for `flwf`
  - `syntaxDiagnosticRuleSets.ts`: use governed bytes for transfer `tsN`/`tdN`
  - `buildSyntaxDiagnostics.test.ts`: `flwf`, `tsN`, and `tdN` boundaries
  - `CHANGELOG.md`, this file, and `TRACEABILITY.md`
- Acceptance: quoted 255-byte `flwf` and 511-byte `tsN`/`tdN` content is
  accepted; one-byte-over and UTF-8 multibyte overages are rejected; quotes do
  not count; unquoted macro values retain raw-byte measurement; raw evidence,
  wildcard, path, value-shape, and dependency behavior remains unchanged.
- Validation: `rtk pnpm test` and `rtk pnpm run qlty`.
- Traceability: `UC-DIAG`; `RULE-BYTES` / `CONF-CONTENT-BYTES`; SPECS
  Requirements, governed-byte Scenario, and Acceptance Criteria; `VAL-BYTES`.
- Production Readiness:
  - Failure mode: quote-inclusive or decoded/rewritten measurement shifts limits
    or changes evidence; exact and multibyte tests guard both.
  - JP1/AJS compatibility: Command Reference 5.2.6, 5.2.7, 5.2.10, and 5.2.24.
  - Large or malformed input risk: one parse and UTF-8 measurement per value;
    no repeated encoding or concatenation.
  - Desktop/web impact: existing `TextEncoder`; no Node path or filesystem API.
  - README/docs impact: no README or additional durable-doc change.
  - CHANGELOG impact: extend the consolidated entry.
  - Qlty evidence: no new smells; helper extraction is justified by two real
    consumers, not speculative reuse.
- Approval Boundary: exactly the named helper owners, two byte-rule consumers,
  focused tests, CHANGELOG, and feature sync. Event-filter aggregate bytes stay
  in Slice 6.
- Dependencies: Slice 2 complete for ordered commits; no semantic dependency.
- Risks: the selector must remove only the syntactic outer quote pair;
  normalized raw values and inner escape spelling remain unchanged.
- Out of Scope: other quoted parameters, encoding-policy changes, path rules,
  macro context, and parser behavior.

### Slice 4: Include QUEUE jobs in end-judgment and retry diagnostics

- Status: Approved
- Scope: add `qj` and `rq` to the existing end-judgment range, dependency,
  retry, and threshold-ordering target set; add target-matrix tests and extend
  the CHANGELOG entry.
- User / Domain Value: invalid QUEUE end and retry settings receive the same
  supported diagnostics as the official job family.
- Smallest Useful Slice: one target-classification correction reusing existing
  rule values and messages.
- Cohesive Change Group:
  - `syntaxDiagnosticTargetTypes.ts`:
    `jobEndJudgmentDiagnosticTargetTypes`
  - `buildSyntaxDiagnostics.test.ts`: `qj` and `rq` matrix
  - `CHANGELOG.md`, this file, and `TRACEABILITY.md`
- Acceptance: both types receive existing numeric, `jd`/`abr`, retry, and
  threshold decisions; valid settings and other target/non-target types remain
  unchanged.
- Validation: `rtk pnpm test` and `rtk pnpm run qlty`.
- Traceability: `UC-DIAG`; `RULE-JOB-END` / `CONF-QUEUE`; SPECS Requirements
  and Acceptance Criteria; `VAL-QUEUE`.
- Production Readiness:
  - Failure mode: missing recovery coverage or overly broad target selection.
  - JP1/AJS compatibility: Command Reference 5.2.6 and 5.2.7.
  - Large or malformed input risk: two types join an existing linear unit scan.
  - Desktop/web impact: host-neutral target set only.
  - README/docs impact: no README or durable-doc change.
  - CHANGELOG impact: extend the consolidated entry.
  - Qlty evidence: no new smells; metrics-only changes are review signals.
- Approval Boundary: target set, focused job-end tests, CHANGELOG, and feature
  sync only. Rule values or categories require replanning.
- Dependencies: Slice 3 complete for ordered commits; no semantic dependency.
- Risks: test both normal and recovery QUEUE explicitly.
- Out of Scope: QUEUE transfer behavior, execution, and new unit types.

### Slice 5: Conform transfer-file job context

- Status: Approved
- Scope: make macro validity depend on unit class and effective `jty`; diagnose
  any `ts1..4`, `td1..4`, or `top1..4` on `cpj`/`rcpj`; preserve QUEUE
  dependency differences; add the complete context matrix and extend CHANGELOG.
- User / Domain Value: transfer parameters and macros are accepted only where
  JP1/AJS3 can use them.
- Smallest Useful Slice: queuing attribute, supported custom/QUEUE classes, and
  prohibited custom PC parameters form one context classification decision;
  byte measurement is already isolated in Slice 3.
- Cohesive Change Group:
  - `syntaxDiagnosticTransferRules.ts`: unit-aware quoted/macro validity
  - `syntaxDiagnosticRuleSets.ts`: transfer context/prohibited rules and messages
  - `syntaxDiagnosticTargetTypes.ts`: explicit supported and prohibited sets
  - `syntaxDiagnosticOtherRuleBuilders.ts`: context and custom-PC collection
  - `buildSyntaxDiagnostics.test.ts`: `jty`, unit-class, recovery, and parameter
    index matrix
  - `CHANGELOG.md`, this file, and `TRACEABILITY.md`
- Acceptance: macros are accepted for `qj`/`rq`, `cj`/`rcj`, and
  `j`/`rj`/`pj`/`rp` with effective `jty=q`, including omitted default; explicit
  `jty=n` rejects macros on UNIX/PC jobs; every `tsN`, `tdN`, and `topN` on
  `cpj`/`rcpj` is diagnosed; quoted paths, dependencies, and byte rules remain.
- Validation: `rtk pnpm test` and `rtk pnpm run qlty`; confirm transfer,
  normalization/source-position, and parameter-factory coverage.
- Traceability: `UC-DIAG`; `RULE-TRANSFER-FORM` /
  `CONF-TRANSFER-CONTEXT`; SPECS Requirements, transfer Scenario, and Acceptance
  Criteria; `VAL-TRANSFER`.
- Production Readiness:
  - Failure mode: incomplete class/index matrix leaves false negatives or rejects
    the documented `jty=q` default.
  - JP1/AJS compatibility: Command Reference 5.2.6, 5.2.7, and 5.2.24.
  - Large or malformed input risk: fixed four indexes and linear unit scans.
  - Desktop/web impact: normalized application data only; no platform APIs.
  - README/docs impact: no README or durable-doc change.
  - CHANGELOG impact: extend the consolidated entry.
  - Qlty evidence: no new smells; no conditional helper extraction remains.
- Approval Boundary: exactly the four named application files, focused tests,
  CHANGELOG, and feature sync. Byte helpers, parser, DTO, or filesystem checks
  require replanning.
- Dependencies: Slice 4 complete for ordered commits; Slice 3 supplies the
  already-complete governed byte semantics.
- Risks: use explicit `jty` or documented default `q`; do not invent inheritance.
- Out of Scope: file existence/transfer, platform path APIs, and other
  parameters or unit types.

### Slice 6: Enforce canonical repeated evwfr aggregate bytes

- Status: Approved
- Scope: keep per-value shape validation separate; linearly sum each canonical
  `evwfr=<raw-value>;` UTF-8 contribution including `evwfr=`, the raw value, and
  `;`; diagnose the first parameter that crosses 2,048 bytes; add boundaries,
  multibyte, malformed, and location cases; complete CHANGELOG and final checks.
- User / Domain Value: individually valid repeated filters that exceed the
  official complete-definition limit are reported at a useful source location.
- Smallest Useful Slice: one repeated event-filter aggregate meaning including
  canonical byte composition, location policy, diagnostic, and regression tests.
- Cohesive Change Group:
  - `syntaxDiagnosticEventRules.ts`: per-value shape validation only
  - `syntaxDiagnosticRuleSets.ts`: per-value rule/message separation
  - `syntaxDiagnosticOtherRuleBuilders.ts`: canonical aggregate and first-crossing
    diagnostic
  - `syntaxDiagnosticScalarValidators.ts`: reuse existing `getByteLength` only;
    no new helper ownership
  - `syntaxDiagnosticEventRules.test.ts`: per-value shape cases
  - `buildSyntaxDiagnostics.test.ts`: canonical repeated aggregate and positions
  - `CHANGELOG.md`, this file, and `TRACEABILITY.md`
- Acceptance: canonical contributions totaling exactly 2,048 bytes are
  accepted; 2,049 bytes produces one aggregate diagnostic on the first crossing
  parameter; prefix, `=`, and `;` count, while indentation/newlines do not;
  malformed values retain shape diagnostics and raw/source evidence is unchanged.
- Validation: `rtk pnpm test`, `rtk pnpm run qlty`, then feature-level
  `rtk pnpm run test:web` and `rtk pnpm run build`; perform one integrated scope,
  acceptance, quality, and production-readiness review.
- Traceability: `UC-DIAG`; `RULE-EVENT` / `CONF-EVWFR`; SPECS Requirements,
  aggregate Scenario, and Acceptance Criteria; `VAL-EVWFR` and `VAL-HOST`.
- Production Readiness:
  - Failure mode: value-only counting, omitted syntax overhead, double reporting,
    or wrong crossing location breaks conformance.
  - JP1/AJS compatibility: Command Reference 5.2.9 canonical repeated format.
  - Large or malformed input risk: one running sum; do not concatenate all
    definitions or rescan prior values.
  - Desktop/web impact: `TextEncoder`, normalized repeated values, and existing
    DTOs are browser-safe; final web/build evidence is required.
  - README/docs impact: no README change; durable rule clarification is complete.
  - CHANGELOG impact: leave one complete Unreleased conformance entry.
  - Qlty evidence: no new smells; metrics-only movement is a review signal.
- Approval Boundary: named event application files, focused tests, final
  desktop/web/build checks, CHANGELOG, and feature sync. Parser, normalized
  model, DTO, UI, or other aggregate parameters require replanning.
- Dependencies: Slice 5 complete for ordered commits; no semantic dependency on
  earlier rules. Owns final feature-level validation.
- Risks: repository byte measurement remains UTF-8 through existing
  `TextEncoder`; changing definition-file encoding semantics is out of scope.
- Out of Scope: `jpoif` or other aggregate limits and event runtime delivery.

## Cross-Slice Dependencies

- Implement S1 through S6 sequentially. S1, S2, S4, and S6 are semantically
  independent; S5 consumes governed byte behavior completed in S3.
- Sequential commits avoid overlapping edits to rule sets, the large diagnostic
  test suite, CHANGELOG, and SDD status. Each slice includes its own tests.
- Every slice runs desktop evidence and qlty. S6 adds final web and production
  build evidence for the shared application path.
- New rule IDs, parser/normalized-model changes, DTO/schema changes, or wider
  impact require Replanning Mode and fresh approval.

## Feature-Level Risks

- Correct false negatives can surface new diagnostics in existing files only
  where version 13 declares the definition invalid.
- Diagnostic wording is user-visible and test-coupled but must not become a
  second normative semantic owner.
- UTF-8 byte boundaries require multibyte tests rather than string length.
- Custom/recovery and desktop/web counterparts require explicit evidence.
- Official `evwfr` aggregate composition is resolved; no undocumented JP1/AJS
  behavior remains. UTF-8 is the existing repository measurement convention.

## Traceability

- TRACEABILITY.md required: yes
- Reason: user-visible JP1/AJS interpretation changes span six slices.
- Status: every slice now states direct use-case, requirement, SPECS, and
  validation mappings; implementation results remain pending.

## Use-Case Back-Propagation

- `uc-diagnose-ajs-definition.md` remains unchanged because it already consumes
  the normative event-filter rule.
- `jp1-diagnostic-parameter-rules.md` now durably clarifies the official full
  `evwfr=...;` aggregate format.
- Any further official-source contradiction requires replanning; never weaken a
  durable rule to preserve current runtime behavior.

## Feature Exit

- Definition of Done status: Not evaluated; all six slices are Approved but
  not yet implemented.
- Durable documentation updates: event-filter aggregate clarification complete;
  CHANGELOG and traceability remain implementation sync work.
- Open risks: implementation must preserve the approved boundaries and produce
  the validation evidence required by each slice.

## Validation

- [x] Replanning impact investigation completed
- [x] Prior review findings mapped to six revised slices
- [x] Official `evwfr=...;` aggregate format recorded in the normative rule
- [x] Revised plan reviewed with `sdd-review-plan`
- [x] Human approval recorded for S1-S6
- [x] Slice 1 focused desktop tests and qlty pass
- [x] Slice 2 focused desktop tests and qlty pass
- [ ] Slices 3-6 focused desktop tests and qlty pass
- [ ] Final web tests and production build pass
- [ ] Integrated implementation review completed
- [ ] TRACEABILITY.md updated with implementation evidence
- [ ] Feature Exit Review completed after all slices
