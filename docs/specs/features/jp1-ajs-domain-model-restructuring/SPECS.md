# Feature Specification: JP1/AJS Domain Model Restructuring

## Purpose

Make JP1/AJS schedule-date (`sd`) interpretation one cohesive Domain
responsibility shared by Unit List, diagnostics, and Semantic Diff, while
preserving the current raw values, effective rule association, supported
value forms, and consumer-visible results.

## Minimal Context

- Current decision: define a behavior-preserving domain boundary for the
  schedule-date interpretation already shared through
  `scheduleRuleHelpers.ts`.
- Read first: this file, `TASKS.md`, and the schedule rules in
  `docs/requirements/domain-rules/jp1-diagnostic-parameter-rules.md`.
- Read `TRACEABILITY.md` when planning or validating consumer coverage.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Roadmap item: `docs/specs/roadmap.md` `JP1/AJS Domain Model Restructuring`
- Shared evidence: `docs/specs/features/BASELINE.md` `Intake group 14:
JP1/AJS schedule-rule helper`
- Domain rule: `docs/requirements/domain-rules/interpret-jp1-parameters.md`
  and `JP1-PARAM-SCHEDULE-START-DATE-001`
- Source use cases:
  - `docs/requirements/use-cases/uc-view-unit-list.md`
  - `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`
  - `docs/requirements/use-cases/uc-build-semantic-diff.md`
- Implementation-slice plan: `TASKS.md`

## Requirements

- Domain owns one schedule-date interpretation responsibility for normalized
  raw `sd` values and their schedule-rule association.
- An omitted schedule-rule number continues to resolve to rule `1`; explicit
  rule numbers and the `sd=0,ud` exception remain available for the existing
  rule-validation boundary to evaluate.
- Supported calendar, relative-day, open-day, closed-day, weekday, `en`, and
  `ud` forms retain their current interpretation. Unsupported or incomplete
  shapes remain uninterpretable rather than being partially accepted.
- Raw normalized values remain distinguishable from interpreted fields and
  consumer-specific effective or presentation values.
- Unit List, diagnostics, and Semantic Diff consume the same Domain meaning
  without copying schedule-date syntax or rule-association decisions.
- Consumer-specific responsibilities remain unchanged: Unit List projects
  display fields, diagnostics evaluates validity and source evidence, and
  Semantic Diff evaluates supported comparison behavior.
- The restructuring introduces no parser representation, application
  orchestration, UI state, host API, or infrastructure dependency into Domain.
- Existing JP1/AJS3 version 13 definition behavior and desktop/web results are
  preserved for equivalent input.
- The focused result contract preserves explicit-rule presence, effective rule
  association, structured calendar fields, and a discriminated schedule-date
  token category for calendar, relative, open, closed, backward, weekday,
  `en`, and `ud` forms. It does not expose diagnostic validity,
  Semantic-Diff reasons, or display labels.

## Architecture

- Domain: own the cohesive schedule-date value interpretation and stable
  repository-owned result types; retain rule validation and semantic-diff
  decisions in their existing Domain responsibilities.
- Application: consume Domain interpretation for Unit List projection without
  redefining schedule-date syntax or Domain validity.
- Presentation: unchanged; continue to display application DTOs and diagnostics
  without importing or reconstructing Domain interpretation objects.
- Infrastructure: unchanged; continue to normalize parser output before Domain
  and Application consumers use it.

## Impact Analysis

### Dependency Impact

- Primary target: `src/domain/models/parameters/scheduleRuleHelpers.ts`,
  especially `parseScheduleDateValue` and its schedule-rule parsing support.
- Direct consumers: `src/application/unit-list/unitListScheduleValueHelpers.ts`,
  `src/domain/services/diagnostics/ScheduleDateRules.ts`, and
  `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`.
- Indirect compatibility consumers to verify: `ScheduleDiagnosticRules.ts`,
  `evaluateScheduleDiagnosticViolations.ts`, `buildUnitListGroup10View.ts`,
  `unitListViewHelpers.ts`, and
  `src/application/semantic-diff/compareScheduleDiff.ts`. These remain
  unchanged unless the focused result contract requires an approved adapter
  update.
- Protective evidence includes `scheduleRuleHelpers.test.ts`,
  `buildUnitListView.test.ts`, `buildSyntaxDiagnostics.test.ts`, and
  `semanticDiffScheduleRules.test.ts`.
- Parser grammar, normalized document shape, application DTOs, diagnostic
  wording, Semantic Diff report schemas, and presentation code remain
  unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: existing consumer outputs and transport shapes
  remain unchanged; any contract change requires replanning and re-approval.
- VS Code/web extension compatibility: shared behavior remains host-neutral and
  browser-safe; the minimum VS Code version remains unchanged.
- Changed scenarios: none; existing use-case and rule scenarios remain the
  compatibility contract.

### Alternative Considerations

- Restructure the entire schedule helper family at once: rejected because
  start time, cycle, wait, substitution, shift, and days-from-start rules have
  separable meanings and consumer sets.
- Move schedule interpretation into Application: rejected because diagnostics
  and Semantic Diff also consume the JP1/AJS meaning and Domain is its durable
  owner.
- Change or expand JP1/AJS rules during restructuring: rejected because manual
  alignment is a separate behavior and compatibility decision.
- Leave the helper unchanged: remains a planning alternative if impact review
  cannot identify a smaller, clearer Domain responsibility without adding
  abstraction or consumer churn.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval: changing supported `sd` forms, rule
  ranges or defaults, `SCHEDULELIMIT` behavior, consumer output, diagnostic
  wording, Semantic Diff decisions, parser normalization, DTO/schema shape,
  desktop/web support, or any schedule parameter outside `sd`.

## Compatibility

- JP1/AJS source reference: JP1/AJS3 version 13 Command Reference 5.2.4, as
  cited by `JP1-PARAM-SCHEDULE-START-DATE-001`.
- Definition/config reference: job-group and jobnet `sd` schedule parameter;
  no command or extension configuration changes are planned.
- Undocumented or inferred behavior: none is intentionally added. Existing
  helper outputs not stated by the durable rule remain compatibility evidence,
  not authority for expanding supported JP1/AJS behavior.
- VS Code compatibility follows `package.json` `engines.vscode`; no minimum
  version increase is allowed.
- Web extension compatibility: preserve browser-safe shared code and current
  Unit List, diagnostics, and Semantic Diff results.
- Desktop extension compatibility: preserve the same results and host-facing
  diagnostics/report behavior as the web-compatible application paths.

## Acceptance Criteria

- One explicit Domain responsibility interprets schedule-date values and rule
  association for all three existing consumers.
- Unit List, diagnostics, and Semantic Diff retain identical observable output
  for representative omitted, explicit, boundary, invalid, and unsupported
  schedule-date inputs.
- Raw normalized evidence remains available and is not overwritten by
  interpreted or presentation values.
- JP1/AJS3 version 13 boundaries, including rule `144`, default rule `1`, and
  `sd=0,ud`, remain protected by focused and consumer-level tests.
- No parser, generated, VS Code, UI-framework, Node.js, or infrastructure
  dependency is introduced into Domain.
- Architecture, focused schedule-rule, desktop/web, build, and quality checks
  selected by the implementation plan pass.

## Non-Goals

- Restructuring schedule parameters other than `sd`.
- Adding or changing JP1/AJS syntax, defaults, validation rules, diagnostics,
  schedule calculation, or Semantic Diff support.
- Replacing the normalized Domain model or exposing parser representations.
- Adding UI state, presentation formatting, application orchestration, a
  generic rule engine, or a service container to Domain.
- Raising the minimum VS Code version or narrowing desktop/web support.

## Planning Decision

- Use a focused, stateless Domain interpreter with a stable repository-owned
  result type for schedule-date meaning. A behaviorful value-object class is
  not justified because the normalized raw string has no identity or lifecycle,
  and a generic rule engine would broaden the feature beyond `sd`.
- Keep raw normalized evidence separate from interpreted rule association and
  date fields. Unsupported or incomplete input continues to produce no
  interpretation; consumer-specific validity, comparison, and presentation
  decisions remain outside the interpreter.
- The approved contract must expose the effective rule number, whether the
  rule number was explicit, structured year/month fields, and a semantic
  schedule-date token category with the fields needed by diagnostics and
  Semantic Diff. Consumers must not recover these distinctions with raw-value
  regexes. The result must preserve syntax-level distinctions without carrying
  diagnostic validity, comparison reasons, or Unit List display labels.
- During ordered consumer migration, the existing schedule helper may delegate
  to the interpreter as a temporary compatibility path. Remove that public
  schedule-date helper contract only after all three consumers use the focused
  responsibility directly.
