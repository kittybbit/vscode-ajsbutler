# Feature Tasks: Isolate Parser Boundary

## Agent Brief

- Purpose: isolate parser mechanics and raw data behind one normalized parser
  port.
- Approved or active slice: Slices 1-2 are complete; approved Slice 3 is next.
- Implement slices in order; each slice is a separate approval and commit
  boundary.
- Do not change grammar, evaluator meaning, JP1/AJS interpretation, normalized
  semantics, source positions, or malformed-input behavior.
- Do not fill normalized-model gaps with raw fields or migrate the full legacy
  wrapper graph.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, the raw/parser
  allowances, and the parser-boundary section of `docs/specs/architecture.md`.
- Before runtime implementation, use a dedicated non-doc feature branch rather
  than continuing on the completed inventory feature branch.
- Approval policy and document roles: `docs/specs/README.md`.

## Plan Status

- Status: In Progress
- Planning scope: the entire `isolate-parser-boundary` feature.
- Review status: repeat review passed; ready plan approved.
- Human approval: approved for the full plan and all three slices.
- Active implementation slice: Slice 3.

## Human Approval

- Status: Complete
- Approved at: approved in current conversation
- Approved scope: the full feature plan and Slices 1-3, including each recorded
  approval boundary, validation plan, production-readiness gate, and ordered
  dependency.

## Implementation Slices

### Slice 1: Decouple Legacy Wrapper Inputs From Raw Parser Unit

- Status: Approved
- Scope: replace the direct concrete `Unit` dependency in `UnitEntity`,
  `TyUtils`, and parameter lookup helpers with the smallest domain-local
  structural inputs required by those responsibilities; update focused wrapper
  tests and remove the three corresponding exact raw-unit allowances.
- User / Domain Value: removes the legacy-domain dependency that would
  otherwise force the raw parser model to remain in the domain or make domain
  depend on infrastructure.
- Cohesive Change Group:
  - add a narrowly named legacy wrapper input contract under
    `src/domain/models/units/`
  - update `src/domain/models/units/UnitEntity.ts`,
    `src/domain/utils/TyUtils.ts`, and
    `src/domain/values/unitParameterLookupHelpers.ts`
  - update focused unit-wrapper/parameter tests
  - remove exactly the owned allowances for those three sources and adjust
    architecture-rule evidence
- Acceptance:
  - `UnitEntity`, `TyUtils`, and parameter lookup behavior is unchanged
  - the new input shape contains only fields/methods already consumed by those
    responsibilities and is not exported as an application parser contract
  - three raw-unit allowances become stale and are removed; the 86
    `complete-normalized-domain-model` wrapper allowances are unchanged
  - R2, R4, and AC1 prerequisite coverage is complete
- Validation:
  - focused `UnitEntity`, group/jobnet entity, parameter factory/lookup, and
    normalizer tests
  - architecture dependency-rule tests and exact allowlist assertions
  - `rtk pnpm run qlty`
  - resolve any new qlty smell in the slice or record an explicit, approved,
    actionable follow-up; treat metrics-only movement as a review signal only
    when it maps to a concrete responsibility or risk
- Production Readiness:
  - Failure mode: an incomplete structural input could change wrapper
    construction or parameter lookup; focused behavior and type tests must fail
    before merge
  - JP1/AJS compatibility: no grammar, parameter value, command, or evaluator
    change
  - Large or malformed input risk: none beyond preserving existing recursive
    wrapper construction behavior
  - Desktop/web impact: pure TypeScript domain types; no host API or Node API
    introduced
  - README/docs impact: none; this is an internal prerequisite
  - CHANGELOG impact: none under the behavior-neutral internal-refactor rule
- Approval Boundary: domain-local input typing, the three named consumers,
  their focused tests, and the three exact raw-unit allowance removals only.
- Dependencies: architecture inventory and guardrails complete.
- Risks: a broad shape could become a second raw parser model; review must keep
  it wrapper-specific and temporary.
- Out of Scope: wrapper semantic migration, wrapper allowance cleanup, raw
  model relocation, parser-port changes, application consumers.
- Completion Evidence: TypeScript compilation, the full desktop suite,
  architecture exact-allowlist validation, and qlty passed. Raw-unit violations
  fell from five to two and the exact allowlist fell from 150 to 147 while all
  86 normalized-domain wrapper allowances remained unchanged.
- Implementation Feedback: the slice boundary was sufficient and exposed no
  missing dependency or reusable knowledge requiring durable propagation.

### Slice 2: Cut Application Consumers Over To The Normalized Parser Port

- Status: Complete
- Scope: make `AjsParserPort` return an explicit normalized-document success or
  repository-owned syntax-error failure; split raw ANTLR evaluation into an
  infrastructure-internal parser seam; normalize exactly once in
  `AntlrAjsParser`; migrate unit-list, diagnostics, semantic-diff report, and
  bootstrap telemetry decoration; clarify the durable diagnostic use case; and
  remove the two remaining application raw-unit allowances.
- User / Domain Value: every production parsing workflow receives a complete
  normalized document or a clear syntax failure, preventing raw parser objects
  from escaping into general application use cases.
- Cohesive Change Group:
  - evolve `src/application/parsing/AjsParserPort.ts` to a discriminated result
  - extract an infrastructure-internal raw parser from
    `src/infrastructure/parser/AntlrAjsParser.ts` and keep the public adapter
    normalized
  - update `buildUnitList`, `buildSyntaxDiagnostics`,
    `buildSemanticDiffReport`, and `extensionDependencies`
  - preserve test-only access to the raw seam for normalization fixtures while
    parser-port tests assert normalized results; keep the current `parseAjs`
    raw helper behavior only as a temporary compatibility step so this slice
    does not mix the 24-suite test migration with the parser-port cutover
  - update the affected application/bootstrap/parser tests and
    `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`
  - remove the application parser-port and unit-list raw-unit allowances and
    update exact architecture counts
- Acceptance:
  - valid input returns one normalized `AjsDocument`; invalid input returns the
    same repository-owned syntax errors and no partial document
  - unit-list, semantic diagnostics, semantic-diff report, and telemetry retain
    their outputs, warnings, error categorization, and source positions
  - normalization runs once per parse and general application production code
    has zero raw `Unit` imports
  - diagnostic durable wording preserves normalized parameter/source evidence
    without promising raw-object availability
  - R3, R5, AC2, and the application portion of AC1 are complete
- Validation:
  - `AntlrAjsParser.test.ts`, `buildUnitList.test.ts`,
    `buildSyntaxDiagnostics.test.ts`, `buildSemanticDiffReport.test.ts`, and
    `extensionDependencies.test.ts`
  - parser golden/malformed-input and normalization evidence
  - architecture dependency-rule and stale-allowlist tests
  - desktop extension tests, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
  - resolve any new qlty smell in the slice or record an explicit, approved,
    actionable follow-up; treat metrics-only movement as a review signal only
    when it maps to a concrete responsibility or risk
- Production Readiness:
  - Failure mode: syntax failures must not be treated as valid partial
    documents; before/after semantic-diff errors must remain distinguishable
  - JP1/AJS compatibility: evaluator output, syntax messages, source positions,
    normalized warnings, and supported v13 definition behavior are preserved
  - Large or malformed input risk: avoid double normalization and preserve the
    existing failure path for malformed input
  - Desktop/web impact: the shared adapter stays browser-safe; both entry points
    use the same port and are validated
  - README/docs impact: only the contradictory durable diagnostic statement is
    corrected; no user instruction changes
  - CHANGELOG impact: none unless implementation exposes an observable behavior
    change, which requires replanning
- Approval Boundary: the one parser port, its infrastructure adapter/internal
  raw seam, the three current application consumers, bootstrap parser telemetry
  decoration, their tests/test support including the temporary raw-helper
  compatibility wiring, the diagnostic use case, and the two exact allowance
  removals. Broad test-helper caller migration remains in Slice 3.
- Dependencies: Slice 1 complete.
- Risks: discriminated-result handling could drop errors, normalized warnings,
  source evidence, or telemetry classification; consumer tests must cover every
  branch.
- Out of Scope: raw model/normalizer relocation, grammar/evaluator changes, new
  consumers, diagnostic-rule changes, presentation migration.
- Completion Evidence: TypeScript compilation, full desktop and web tests,
  production build, architecture exact-allowlist validation, Markdown lint,
  and qlty passed. General application raw/normalizer imports and all five
  feature-owned raw allowances are now zero; normalized warnings, independent
  semantic-diff failures, syntax positions, and telemetry counts are covered.
- Implementation Feedback: one direct semantic-diff sample consumer required
  normalized-result migration with the port cutover, reducing Slice 3's
  remaining direct parse-then-normalize baseline without changing its approval
  boundary. Explicit `ok === false` checks are required for reliable narrowing
  under the repository TypeScript configuration.

### Slice 3: Move Raw Model And Normalization Into Infrastructure

- Status: Approved
- Scope: relocate the concrete raw unit tree and raw-to-normalized mapping from
  domain paths into `src/infrastructure/parser/raw/` and
  `src/infrastructure/parser/normalization/`; update evaluator/parser and
  classify and migrate all test parser-helper callers; tighten the parser/raw
  architecture rule to the new infrastructure seam; delete superseded domain
  paths; and update the durable architecture description.
- User / Domain Value: makes infrastructure the sole physical owner of parser
  mechanics and boundary data, leaving the domain and downstream code with
  normalized concepts only.
- Cohesive Change Group:
  - move/rename `src/domain/values/Unit.ts` to an explicitly raw
    infrastructure type
  - move `src/domain/models/ajs/normalizeAjsDocument.ts`, its `normalize/`
    collaborators, and the now parser-only parameter lookup helper into the
    infrastructure normalization seam
  - update `AjsEvaluator`, the internal raw parser, `AntlrAjsParser`, imports,
    and test support without changing behavior
  - replace the temporary raw `parseAjs` test helper with two explicit paths:
    a normalized document helper for downstream application/presentation/flow
    behavior tests and a clearly named raw helper only for parser/normalizer and
    legacy-wrapper tests
  - migrate the current 91 helper call sites across 24 suites; the remaining 45
    direct normalization calls across 11 suites are the baseline for removing
    redundant parse-then-normalize usage where the normalizer itself is not the
    subject under test
  - keep raw access only in parser/normalizer suites and wrapper-focused suites
    such as entity, parameter factory/lookup, priority, and relation tests;
    verify the exact raw-helper importer set with a repository scan rather than
    a wildcard test exception
  - update `architectureDependencyRules.ts`, its fixtures/tests, and
    `docs/specs/architecture.md` to describe and enforce the verified boundary
- Acceptance:
  - generated parser, ANTLR, raw unit, and raw normalization references are
    confined to `src/infrastructure/parser/**` in production
  - domain, general application, and presentation have zero raw/generated/ANTLR
    references; all five feature-owned raw allowances are gone
  - test-only raw access is named as internal support and cannot be mistaken for
    an application port; downstream behavior tests use the normalized helper
    and do not import the infrastructure normalizer directly
  - normalized identities, parameters, parent/child relationships, relations,
    warnings, and source positions match the existing normalization suite
  - R1, R2, R4, AC1, and AC3 are complete
- Validation:
  - parser golden and `normalizeAjsDocument` suites, including nested relations,
    parameters, warnings, malformed input, and source evidence
  - architecture collector/rule tests, repository raw/generated/ANTLR scans,
    exact stale-allowlist checks, and an exact scan of test-only raw-helper
    importers
  - full desktop tests, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`
  - resolve any new qlty smell in the slice or record an explicit, approved,
    actionable follow-up; treat metrics-only movement as a review signal only
    when it maps to a concrete responsibility or risk
- Production Readiness:
  - Failure mode: a mechanical move can silently omit a normalizer collaborator
    or create a forbidden inward dependency; full normalization and architecture
    tests are mandatory
  - JP1/AJS compatibility: grammar, evaluator branches, definition parsing,
    relations, parameters, errors, and source evidence are unchanged
  - Large or malformed input risk: no extra tree copy or traversal may be added;
    existing malformed-input behavior remains the baseline
  - Desktop/web impact: infrastructure parsing stays host-neutral and uses no
    new Node-only API; desktop, web, and bundle validation are mandatory
  - README/docs impact: update only the durable parser-boundary facts in
    `docs/specs/architecture.md`; README unchanged
  - CHANGELOG impact: none for the verified behavior-neutral internal move
- Approval Boundary: the raw model, normalizer and direct collaborators,
  evaluator/parser imports, `src/test/support/parseAjs.ts`, all 24 current
  parser-helper consumer suites, the exact intentionally raw test set,
  parser/raw architecture enforcement, and the smallest durable architecture
  update. Semantic-diff sample normalization was completed with Slice 2.
- Dependencies: Slices 1 and 2 complete.
- Risks: import-path churn across tests can hide accidental API exposure;
  architecture tests must distinguish test-only access from production rules.
- Out of Scope: normalized model completion, legacy wrapper migration,
  presentation boundaries, serialization/composition cleanup, grammar changes.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: this non-trivial parser compatibility feature has three slices and
  affects four parsing use cases, shared desktop/web execution, and explicit
  architecture acceptance criteria.

## Cross-Slice Dependencies

- Slice 1 removes the domain dependency that would otherwise point inward to
  the raw type after relocation.
- Slice 2 removes raw data from the application contract while the existing
  normalizer path still provides a behavior baseline.
- Slice 3 may then relocate the raw type and normalizer without creating a
  temporary domain-to-infrastructure dependency or a parallel raw application
  port.
- Every slice must leave the repository buildable and must remove only the
  exact allowances made stale by that slice.

## Feature-Level Risks

- A normalized parser success must not coexist with syntax errors or represent
  a partial malformed document.
- Source positions and raw parameter evidence must survive normalization even
  though raw parser objects no longer escape.
- Moving normalization must not add a second traversal for large definitions.
- Test-only raw fixtures must not become a supported production boundary.
- The temporary legacy wrapper input must not absorb work owned by
  `complete-normalized-domain-model`.
- New qlty smells must be resolved or carried only as an explicit, approved,
  actionable follow-up. Metrics-only movement does not expand slice scope
  unless it identifies a concrete responsibility or production risk.

## Use-Case Back-Propagation

- `uc-view-unit-list.md`: no behavioral wording change expected; validation
  proves equivalent normalized input and error behavior.
- `uc-diagnose-ajs-definition.md`: Slice 2 replaces the contradictory promise
  that raw parser output remains available with the durable requirement that
  normalized parameter/source evidence remains available and unchanged.
- `uc-build-semantic-diff.md`: no behavioral wording change expected; Slice 2
  proves that before/after definitions reach comparison as equivalent
  normalized documents and retain independent parser failures.
- `uc-present-semantic-diff-report.md`: no behavioral wording change expected;
  validation proves before/after parse failures and report content remain
  equivalent.
- `docs/specs/architecture.md`: Slice 3 replaces the temporary raw-domain seam
  description with the verified infrastructure-only invariant.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: diagnostic evidence wording in Slice 2 and
  verified parser-boundary facts in Slice 3.
- Open risks: all feature-level risks above remain open until their owning
  slice validation is complete.
