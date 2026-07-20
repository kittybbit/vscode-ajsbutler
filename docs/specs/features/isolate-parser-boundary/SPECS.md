# Feature Specification: Isolate Parser Boundary

## Purpose

Confine ANTLR, generated parser artifacts, and the raw parser boundary model to
the infrastructure parser/normalization boundary so general application,
domain, and presentation code cannot consume parser-adjacent structures.

## Minimal Context

- Current decision: establish the sole raw-to-normalized conversion boundary.
- Read first: this file, `TASKS.md`, the raw/parser allowances in
  `src/test/fixtures/architecture/dependencyAllowlist.ts`, and the rule catalog
  in `src/test/support/architectureDependencyRules.ts`.
- Do not create `CONTEXT.md`.

## Origin

- Source: `docs/specs/architecture.md` Parser Boundaries and Raw parsed model.
- Source use cases: view unit list, diagnose AJS definition, build semantic
  diff, and present a semantic diff report.
- JP1/AJS source reference: existing grammar and parser golden behavior are the
  definition/config reference; no grammar or rule-coverage change is intended.
- Dependency: the architecture inventory and guardrail baseline is complete.

## Requirements

- R1: Generated parser and ANTLR types remain inside infrastructure parser
  code.
- R2: Raw parser output is an infrastructure-internal boundary type outside the
  core domain model.
- R3: The application parser port returns either a normalized `AjsDocument` or
  repository-owned syntax errors through an explicit success/failure result;
  one infrastructure mapper/normalizer performs the conversion exactly once.
- R4: General application, domain, and presentation production code has no raw
  parser, generated parser, or ANTLR dependency.
- R5: Parser results, syntax errors, normalized source evidence, telemetry
  classification, and malformed-input behavior remain compatible.

## Architecture

- Domain: own normalized concepts and host-neutral source evidence only.
- Application: own a parser-facing port whose success result is an
  `AjsDocument` and whose failure result is repository-owned syntax errors.
- Presentation: consume application outputs only.
- Infrastructure: own ANTLR orchestration, generated parser access, the raw
  unit tree, and raw-to-normalized adapter wiring.
- The internal raw parser and raw normalization entry point are not application
  ports. Tests may exercise them through explicitly test-only support.
- Legacy wrapper construction is decoupled from the concrete raw parser type
  before that type moves. This does not make the temporary wrapper input shape
  a new parser contract or expand wrapper semantics; the wrapper graph remains
  owned by `complete-normalized-domain-model`.

## Impact Analysis

### Dependency Impact

- Affected surface: parser port, evaluator, raw `Unit`, normalizer, unit-list,
  diagnostics, semantic-diff report parsing, bootstrap telemetry decoration,
  parser/normalization test support, architecture guardrails, and desktop/web
  bundles.
- The current test parser helper exposes raw results at 91 call sites across 24
  suites. Replanning classifies these callers: downstream behavior suites move
  to a normalized helper, while parser/normalizer and legacy-wrapper suites use
  a clearly named test-only raw helper.
- Propagation decision: normalized model gaps are owned by
  `complete-normalized-domain-model`, not hidden in parser DTOs.
- The diagnostic use case's existing wording about preserving raw parser output
  means preserving normalized parameter/source evidence, not exposing the raw
  parser object to downstream consumers. The durable use case must be corrected
  in the parser-port cutover slice.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: the internal application parser port changes
  from `Unit[]` plus errors to a discriminated normalized-document/error result.
- VS Code/web extension compatibility: the shared parser path remains browser
  safe and is validated in both hosts.
- Changed scenarios: no product scenario changes; a contradictory diagnostic
  scenario statement is clarified without changing observable behavior.

### Alternative Considerations

- Rename raw `Unit` in place: rejected because it does not establish a
  boundary.
- Put the raw boundary DTO in application or shared code: rejected because it
  would keep a parser-shaped contract available to general consumers.
- Keep parallel raw and normalized application ports: rejected because it
  creates an indefinite bypass around the normalization boundary.
- Migrate the complete legacy wrapper graph here: rejected because it expands
  this feature into normalized-domain-model work.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Parser semantics, grammar, source-position behavior, normalized domain
  semantics, or new application consumers require replanning and approval.

## Compatibility

- Preserve `engines.vscode`, desktop parsing, web parsing, parser golden output,
  syntax errors, source positions, normalized warnings, and malformed-input
  behavior.
- Preserve definition-file encoding handling at its current host boundary; this
  feature receives text and does not change decoding.
- Preserve telemetry privacy and parser success/error classification without
  adding content, paths, unit names, or raw errors.

## Acceptance Criteria

- AC1: Generated/ANTLR/raw parser references exist only in approved
  infrastructure parser/normalization locations, and all five raw `Unit`
  migration allowances are removed without wildcard replacement.
- AC2: Unit-list, diagnostics, and semantic-diff report consumers receive only
  a normalized document or repository-owned syntax errors, with no repeated
  normalization and no raw-object escape.
- AC3: Parser golden, normalization, application consumer, architecture,
  desktop, web, build, and qlty validation preserve behavior.

## Non-Goals

- Expanding JP1/AJS syntax or changing grammar, evaluator, normalized domain, or
  diagnostic-rule semantics.
- Migrating the legacy wrapper graph beyond removing its concrete raw-parser
  type dependency.
- Migrating presentation pipelines, changing serialization formats, raising
  the minimum VS Code version, or changing WebAPI import behavior.
- Adding README guidance or a CHANGELOG entry for an internal, behavior-neutral
  boundary change.

## Open Questions

- None after planning. New parser semantics, source-evidence gaps, or consumers
  discovered during implementation trigger Replanning Mode.
