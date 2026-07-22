# Feature Tasks: Migrate Diagnostics And Hover Boundaries

## Agent Brief

- Purpose: complete host-neutral diagnostic and hover application boundaries.
- Approved or active slice: Slices 1-5 are complete; Slice 6 is active;
  Slices 6-7 remain approved.
- Do not change messages, positions, severity, localization, rule coverage,
  telemetry payloads, or host availability.
- Do not expose VS Code, ANTLR, or raw parser types in domain/application APIs.
- Read first: `SPECS.md`, this file, and the two source use cases.
- Read `TRACEABILITY.md` for slice acceptance and validation correspondence.
- Validate every code slice with `rtk pnpm test` and `rtk pnpm run qlty`.
- Final host validation also runs `rtk pnpm run test:web` and
  `rtk pnpm run build`.
- Approval policy and document roles: see `docs/specs/README.md`.
- Next decision: implement approved Slice 6 without changing its approval
  boundary.

## Sync Rule

- Update this file in the same commit whenever a slice is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes an
  active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on the implementation-slice plan, approval state,
  validation, risk, and feature exit readiness.

## Plan Status

- Status: In Progress
- Planning scope: host-neutral diagnostic contracts, domain-owned diagnostic
  rule families, application mapping, hover localization port/adapter, VS Code
  adapters, composition, and regression coverage.
- Review status: reviewed, human-approved, and in implementation; no blocking
  findings.
- Replanning reason: reviews found that the shared domain result contract needed
  the correct dependency owner and a typed violation-reason discriminator, two
  diagnostic slices contained independent domain meanings, the shared macro/
  regular-expression rule needed cross-slice traceability, hover adapter
  ownership was ambiguous, and final boundary validation was not explicit
  enough for approval.
- Human approval: all seven slices approved in the current conversation.
- Active implementation slice: Slice 6.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: full seven-slice implementation plan and Slices 1-7 within
  each recorded approval boundary, dependency order, validation plan, risks,
  and out-of-scope constraints.

Implementation may proceed only within the recorded approved scope.
Only clear human approval can change or expand that scope.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Implementation Slices

### Slice 1: Establish Shared Diagnostic Boundary Contracts

- Status: Complete
- Scope: establish a domain violation contract carrying a stable rule ID, a
  typed non-localized reason discriminator, and normalized parameter/source
  evidence; define the application source-range, severity, category, rule-
  reference, and parser-error mapping contracts; adapt the VS Code diagnostic
  mapper without changing rendered diagnostics.
- User / Domain Value: every diagnostic family can move independently through
  one domain-to-application contract while editor highlighting stays precise and
  host neutral.
- Cohesive Change Group: new shared types under
  `src/domain/services/diagnostics/**`, application DTO and entry-point contracts
  under `src/application/editor-feedback/**`,
  `src/application/parsing/AjsParserPort.ts` only where repository error/range
  alignment is required,
  `src/presentation/vscode/diagnostics/registerDiagnostics.ts`, unchanged-
  payload telemetry type references, the diagnostic use case coordinate text,
  and focused tests/support.
- Acceptance: the domain contract contains no English message, severity,
  telemetry, parser, or VS Code type; its typed reason distinguishes multiple
  failures under the same rule and parameter, including separate `evwfr` shape
  and aggregate failures and separate retry dependency failures; application
  maps `(ruleId, reason, evidence)` without repeating domain predicates; parser
  failures and semantic violations map to the same application DTO; message,
  severity, category, ordering, one-based line, zero-based column, length
  fallback, VS Code highlighting, and telemetry events/properties remain
  unchanged.
- Validation: contract and parser-port cases in
  `buildSyntaxDiagnostics.test.ts`, focused domain contract tests for distinct
  same-rule reasons, DTO/range and telemetry cases in
  `registerDiagnostics.test.ts` and `editorFeedbackTelemetry.test.ts`,
  `architectureDependencyRules.test.ts`, `rtk pnpm test`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: malformed input still returns complete parser diagnostics and
    never presents partial semantic results.
  - JP1/AJS compatibility: no grammar, normalized parameter, rule, or message
    change; existing definition fixtures remain authoritative.
  - Large or malformed input risk: contract mapping remains linear in
    diagnostic count and preserves parser short-circuit behavior.
  - Desktop/web impact: contracts contain only repository-owned serializable
    values; no Node or host API is introduced.
  - README/docs impact: update only the durable diagnostic coordinate rule
    already identified during review; no user guide change.
  - CHANGELOG impact: none under repository criteria because observable behavior
    is unchanged.
- Approval Boundary: shared domain violation with typed reasons, application
  diagnostic contracts and reason-to-message mapping shape, parser-error
  mapping, VS Code diagnostic mapping, coordinate use-case clarification, and
  tests only.
- Dependencies: none.
- Risks: treating both coordinates as one-based would shift highlights; adding
  rule IDs to telemetry would exceed the approval boundary.
- Out of Scope: moving concrete semantic rule families, new severities/messages,
  telemetry payload changes, hover work, and parser replacement.

### Slice 2: Move Schedule Diagnostic Meaning Into Domain

- Status: Complete
- Scope: move schedule range, weekly-day, and start-date validation meaning to
  domain services using the shared violation contract; retain application-owned
  diagnostic message/category/range mapping.
- User / Domain Value: JP1/AJS schedule validation has one domain owner aligned
  with the documented `JP1-PARAM-SCHEDULE-*` contracts.
- Cohesive Change Group: schedule diagnostic rules, scalar/date helpers needed
  only by those rules, application message mapping, and schedule-focused domain
  and application regression tests.
- Acceptance: the three schedule rule IDs are emitted from domain evaluation;
  `scheduleLimitYear`, diagnostic order, messages, source spans, allowed forms,
  and current schedule fixtures produce unchanged application diagnostics.
- Validation: schedule range, weekly-cycle, and date cases in
  `buildSyntaxDiagnostics.test.ts`, focused domain rule tests,
  `architectureDependencyRules.test.ts`, `rtk pnpm test`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: invalid dates and ranges remain focused on the same parameter;
    missing evidence keeps the current fallback behavior.
  - JP1/AJS compatibility: preserve version 13 schedule rules and default
    `SCHEDULELIMIT=2036`; no new supported forms.
  - Large or malformed input risk: preserve one traversal of applicable units
    and avoid reparsing source text.
  - Desktop/web impact: pure domain/application code only; no Node or host API.
  - README/docs impact: none unless a durable rule discrepancy is found, which
    requires replanning.
  - CHANGELOG impact: none; architecture-only migration.
- Approval Boundary: the schedule rule family, necessary pure helpers,
  application mapping, and tests move together.
- Dependencies: Slice 1.
- Risks: start-date parsing and weekly-cycle cross-parameter checks are tightly
  coupled; diagnostic order must remain unchanged.
- Out of Scope: schedule coverage expansion, message/localization changes, and
  non-schedule rules.

### Slice 3: Move Job-End And Retry Diagnostic Meaning Into Domain

- Status: Complete
- Scope: move automatic-retry dependencies, job-end numeric ranges, and
  threshold ordering to domain services using the shared violation contract.
- User / Domain Value: the related `jd`, `abr`, retry, and threshold semantics
  have one domain owner and one independently approvable behavior boundary.
- Cohesive Change Group: job-end/retry evaluators, applicable unit-type sets,
  defaults and parameter lookup helpers used by that family, application
  message mapping, and focused tests.
- Acceptance: `JP1-PARAM-RETRY-ABR-DEPENDENCY-001`,
  `JP1-PARAM-JOB-END-RANGE-001`, and
  `JP1-PARAM-JOB-END-THRESHOLD-001` are emitted from domain evaluation; valid,
  invalid, defaulted, and threshold-ordering cases retain identical diagnostic
  messages, order, categories, and spans.
- Validation: job-end/retry cases in `buildSyntaxDiagnostics.test.ts`, focused
  domain rule tests, `architectureDependencyRules.test.ts`, `rtk pnpm test`,
  and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing companion parameters and invalid numeric values retain
    current dependency and focused-diagnostic outcomes.
  - JP1/AJS compatibility: preserve version 13 defaults, unit-type applicability,
    ranges, and strict threshold ordering.
  - Large or malformed input risk: reuse normalized parameters and avoid whole-
    document rescans.
  - Desktop/web impact: pure domain/application code and serializable results.
  - README/docs impact: none expected.
  - CHANGELOG impact: none; no observable change.
- Approval Boundary: only job-end/retry meaning, its genuinely family-local
  helpers, application mapping, and tests.
- Dependencies: Slice 1; independent of Slice 2.
- Risks: current rule builders mix messages and predicates and can emit multiple
  diagnostics for one parameter; extraction must preserve both behavior and
  ordering.
- Out of Scope: monitoring, wait, schedule, event, transfer, and hover behavior.

### Slice 4: Move Monitoring And Wait-Control Diagnostic Meaning Into Domain

- Status: Complete
- Scope: move file-monitoring, wait execution-time/action, and execution-
  interval-control rules to domain services using the shared violation contract.
- User / Domain Value: monitoring defaults, wait values, and start-condition
  restrictions share one domain owner where their parameters and context rules
  overlap.
- Cohesive Change Group: file-monitoring, shared wait, and execution-interval
  evaluators; their unit-type/default/lookup helpers; application message
  mapping; and focused tests.
- Acceptance: the file-monitoring, string-family, wait, and interval-control
  rule IDs mapped to Slice 4 in `TRACEABILITY.md` are emitted from domain
  evaluation; current valid, invalid, defaulted, wildcard, and start-condition
  cases retain identical diagnostics.
- Validation: file-monitoring, wait, and interval-control cases in
  `buildSyntaxDiagnostics.test.ts`, focused domain rule tests,
  `architectureDependencyRules.test.ts`, `rtk pnpm test`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing companion parameters, unsupported unit types, and
    missing source evidence retain current outcomes and fallbacks.
  - JP1/AJS compatibility: preserve version 13 defaults, byte/range limits,
    wildcard behavior, and start-condition restrictions.
  - Large or malformed input risk: keep checks bounded to normalized applicable
    units and parameters without source reparsing.
  - Desktop/web impact: pure domain/application code with browser-safe helpers.
  - README/docs impact: none expected.
  - CHANGELOG impact: none; no observable change.
- Approval Boundary: the monitoring/wait/interval family, shared helpers that
  serve only this meaning, application mapping, and tests.
- Dependencies: Slice 1; independent of Slices 2 and 3.
- Risks: effective defaults and shared `ets`/`fd` behavior cross multiple unit
  types; family scope and diagnostic ordering must remain explicit.
- Out of Scope: job-end, schedule, event, transfer, hover, and new rules.

### Slice 5: Move JP1 Event Diagnostic Meaning Into Domain

- Status: Complete
- Scope: move event sending/receiving, host, filter, identifier, timeout, and
  repeated-filter aggregate validation to domain services using the shared
  violation contract.
- User / Domain Value: all supported JP1 event diagnostic meaning has one domain
  owner aligned with the version 13 event rule contracts.
- Cohesive Change Group: event evaluators, event-specific byte/string/aggregate
  helpers, applicable unit types, application message mapping, and event-focused
  tests.
- Acceptance: every event rule ID mapped to Slice 5 in `TRACEABILITY.md` is
  emitted from domain evaluation; sending/receiving dependencies, ranges,
  formats, multibyte limits, repeated `evwfr`, regular-expression allowances,
  including the event portion of `JP1-PARAM-STRING-MACRO-ALLOWANCE-001`, timeout
  context, messages, order, and spans remain unchanged.
- Validation: event cases in `buildSyntaxDiagnostics.test.ts` and
  `syntaxDiagnosticEventRules.test.ts`, focused domain rule tests,
  `architectureDependencyRules.test.ts`, `rtk pnpm test`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: malformed values remain recoverable focused diagnostics and
    raw definition content is not added to errors or telemetry.
  - JP1/AJS compatibility: preserve version 13 host/ID/filter/timeout forms,
    byte limits, repeated-filter aggregation, and exclusions.
  - Large or malformed input risk: retain bounded per-parameter checks and one
    aggregate pass per applicable unit.
  - Desktop/web impact: UTF-8/string helpers stay browser safe; no Node built-in.
  - README/docs impact: none unless a rule discrepancy requires replanning.
  - CHANGELOG impact: none while output is unchanged.
- Approval Boundary: event sending/receiving meaning, event-local helpers,
  application mapping, and tests only.
- Dependencies: Slice 1; independent of Slices 2-4.
- Risks: multibyte counting, repeated-filter crossing points, regular-expression
  allowances, and multi-diagnostic ordering are regression-prone.
- Out of Scope: transfer paths/macros, compatible-ISAM, semantic hover, and
  telemetry changes.

### Slice 6: Move Transfer Diagnostic Meaning Into Domain

- Status: Approved
- Scope: move transfer-file form/path, QUEUE applicability, macro allowance,
  and transfer byte-length validation to domain services; remove only the
  application diagnostic rule modules superseded after Slices 2-6 are complete.
- User / Domain Value: supported transfer and macro meaning has one domain owner,
  completing the semantic diagnostic boundary without coupling it to event
  validation.
- Cohesive Change Group: transfer evaluators, path/macro/byte helpers, target-
  type and transfer-index sets, application message mapping, final obsolete-rule
  cleanup, and transfer-focused tests.
- Acceptance: `JP1-PARAM-TRANSFER-FILE-FORM-001`,
  `JP1-PARAM-TRANSFER-FILE-PATH-001`, and
  the transfer portion of `JP1-PARAM-STRING-MACRO-ALLOWANCE-001` are emitted
  from domain evaluation; quoted paths, Windows/UNIX roots, macro allowances,
  QUEUE/custom-PC scope, matching parameter dependencies, messages, order, and
  spans remain unchanged; no application-owned semantic predicate remains.
- Validation: transfer and macro cases in `buildSyntaxDiagnostics.test.ts` and
  `syntaxDiagnosticStringValidators.test.ts`, focused domain rule tests, full
  diagnostic regression, `architectureDependencyRules.test.ts`,
  `rtk pnpm test`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: malformed and missing paired parameters remain recoverable
    focused diagnostics.
  - JP1/AJS compatibility: preserve version 13 byte limits, Windows/UNIX path
    forms, macro exceptions, target-unit applicability, and exclusions.
  - Large or malformed input risk: retain bounded transfer-index loops and avoid
    repeated whole-document encoding or traversal.
  - Desktop/web impact: byte/path helpers remain browser safe and host neutral.
  - README/docs impact: none expected; discrepancies require replanning.
  - CHANGELOG impact: none while output is unchanged.
- Approval Boundary: transfer meaning, transfer-local helpers, application
  mapping, cleanup of now-unused application semantic rule modules, and tests.
- Dependencies: Slice 1 and completed Slices 2-5 before final obsolete-rule
  cleanup; transfer evaluation itself is independent after Slice 1 and shares
  only the stable macro/regular-expression rule ID, not an evaluator, with
  Slice 5.
- Risks: Windows/UNIX path distinctions, UTF-8 byte counting, macro syntax,
  custom-PC exclusions, and cleanup of shared legacy helpers.
- Out of Scope: event rules, broader manual alignment, parser changes, hover,
  and telemetry changes.

### Slice 7: Isolate Parameter Hover Localization And Complete Composition

- Status: Approved
- Scope: define an application-owned parameter-syntax lookup port, implement it
  as a browser-safe infrastructure resource adapter, construct it in bootstrap,
  keep parameter-symbol recognition and hover decisions in application, and
  preserve VS Code Markdown construction in presentation.
- User / Domain Value: localized parameter hover remains identical while
  application no longer reaches into domain presentation resources.
- Cohesive Change Group: `findParameterHover` and its application port/DTO, a
  focused adapter under `src/infrastructure/i18n/**`,
  `src/bootstrap/extension/extensionDependencies.ts`, extension subscriptions,
  the VS Code hover provider, and application/adapter/composition and focused
  dependency tests.
- Acceptance: recognized/unknown token behavior, English/Japanese fallback,
  symbol/syntax output, Markdown, telemetry outcomes, provider registration,
  and desktop/web composition remain unchanged; application imports neither VS
  Code/Markdown nor domain i18n/resource implementation types; a focused import
  assertion covers `src/application/editor-feedback/**` because the current
  repository-wide architecture rules do not enforce that narrower boundary.
- Validation: `findParameterHover.test.ts`, `nls.test.ts`,
  `registerHoverProvider.test.ts`, `extensionDependencies.test.ts`,
  `extensionSubscriptions.test.ts`, editor-feedback telemetry and architecture
  tests including the focused editor-feedback import assertion, `rtk pnpm test`,
  `rtk pnpm run test:web`,
  `rtk pnpm run build`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: unknown tokens and missing locale entries still return no
    hover or existing English fallback without throwing.
  - JP1/AJS compatibility: parameter symbols and syntax text are unchanged.
  - Large or malformed input risk: lookup stays bounded to the hovered token;
    no document parsing is added.
  - Desktop/web impact: infrastructure adapter imports browser-bundled resource
    data only; final desktop/web tests and production build verify composition.
  - README/docs impact: no user-facing documentation change; update durable
    architecture text only if Feature Exit confirms a reusable new boundary.
  - CHANGELOG impact: none if content and workflow remain unchanged.
- Approval Boundary: application lookup port, one browser-safe infrastructure
  resource adapter, bootstrap wiring, VS Code presentation mapping, and tests;
  focused editor-feedback dependency assertion included, with no broader i18n
  migration or new repository-wide architecture rule.
- Dependencies: none; implemented last for integrated host validation, not
  because it depends on diagnostic contracts.
- Risks: language fallback, resource typing, Markdown escaping, bootstrap
  serialization, and browser bundle compatibility must not drift.
- Out of Scope: semantic hover, effective values, new content/UI, unrelated
  localization services, provider renaming, and telemetry schema changes.

## Traceability

- TRACEABILITY.md required: yes.
- Reason: the feature has seven slices, changes internal architecture behind two
  user-visible editor behaviors, and must prove unchanged messages, positions,
  localization, rule coverage, and desktop/web behavior.

## Cross-Slice Dependencies

- Slice 1 establishes the domain violation and application diagnostic contracts
  required by every semantic diagnostic slice.
- Slices 2-5 migrate independent rule families after Slice 1 and can each be
  approved, implemented, reviewed, validated, and committed independently.
- Slice 6 transfer evaluation depends only on Slice 1, but its final obsolete-
  rule cleanup waits for Slices 2-5 so no still-live application rule is removed.
- Slice 7 has no diagnostic dependency and runs last only so its required
  desktop/web tests and production build validate the integrated feature.
- Any change to rule coverage, wording, severity, localization output, telemetry
  payload, parser behavior, or host availability requires replanning.

## Feature-Level Risks

- Current tests characterize messages and locations but do not attach every
  stable rule ID to every diagnostic; each family slice must close its mapping
  without changing output or telemetry.
- Stable rule IDs alone do not select messages when one rule and parameter can
  produce multiple failures; typed non-localized reasons preserve that
  distinction without moving presentation wording into domain.
- Parser and normalized evidence use one-based lines and zero-based columns;
  this durable coordinate contract is now explicit in the diagnostic use case.
- Moving files without separating domain violations from application wording
  would relocate rather than remove coupling.
- The current branch is `codex/migrate-flow-graph-navigation-boundaries`.
  Implementation must occur on a dedicated non-doc feature branch before any
  runtime, test, configuration, or generated-artifact edits.
- `engines.vscode` remains `^1.75.0`; no newer VS Code API is planned.
- Every code slice must resolve new Qlty smells or record an approved actionable
  follow-up. Metrics-only movement is a review signal and is recorded only when
  it identifies a concrete responsibility, boundary, compatibility, or user-
  visible risk.

## Use-Case Back-Propagation

- `uc-diagnose-ajs-definition.md` now states the verified one-based-line, zero-
  based-column, current-length convention.
- No scenario addition, change, or removal is planned for either use case.
- At Feature Exit, update durable architecture or use-case text only for
  reusable boundary facts that pass the Durable Documentation Gate.

## Feature Exit

- Definition of Done status: not started; all seven slices, validation,
  traceability, and durable-document decisions remain open.
- Durable documentation updates: coordinate clarification is complete; other
  updates depend on implemented reusable facts.
- Open risks: source-coordinate drift, diagnostic order/message drift,
  localization fallback drift, incomplete rule-ID mapping, and desktop/web
  composition regressions.

## Validation

- [ ] Every slice adds or updates the focused domain/application/adapter tests
      named in its validation plan.
- [ ] `rtk pnpm test` and architecture dependency tests pass for every slice.
- [ ] `rtk pnpm run qlty` passes for every slice; new smells are resolved or
      receive an approved actionable follow-up, while metrics-only movement is
      acted on only when tied to a concrete risk.
- [ ] Slice 7 runs `rtk pnpm run test:web` and `rtk pnpm run build` for final
      desktop/web and bundle evidence.
- [ ] README and CHANGELOG remain unchanged unless behavior evidence triggers
      replanning under repository criteria.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
