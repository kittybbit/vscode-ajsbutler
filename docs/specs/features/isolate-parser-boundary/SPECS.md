# Feature Specification: Isolate Parser Boundary

## Purpose

Confine ANTLR, generated parser artifacts, and the raw parser boundary model to
the parser/normalization boundary so general application and presentation code
cannot consume parser-adjacent structures.

## Minimal Context

- Current decision: establish the sole raw-to-normalized conversion boundary.
- Read first: this file, `TASKS.md`, the raw/parser allowances in
  `src/test/fixtures/architecture/dependencyAllowlist.ts`, and the rule catalog
  in `src/test/support/architectureDependencyRules.ts`.
- Do not create `CONTEXT.md`.

## Origin

- Source: `docs/specs/architecture.md` Parser Boundaries and Raw parsed model.
- Source use cases: all use cases that parse or import AJS definitions.
- JP1/AJS source reference: existing grammar and parser golden behavior are the
  definition/config reference; no grammar or rule-coverage change is intended.
- Dependency: the architecture inventory and guardrail baseline is complete.

## Requirements

- Generated parser and ANTLR types remain inside infrastructure parser code.
- Raw parser output is explicitly modeled as a boundary type outside the core
  domain model.
- One mapper/normalizer converts parser boundary data into the normalized domain
  model before general application use cases consume it.
- Presentation has no raw parser, generated parser, or ANTLR dependency.
- Parser results, syntax errors, source evidence, and malformed-input behavior
  remain compatible.

## Architecture

- Domain: receive only normalized concepts and host-neutral source evidence.
- Application: own parser-facing ports without exposing raw parser structures to
  general use cases.
- Presentation: consume application outputs only.
- Infrastructure: own ANTLR orchestration, generated parser access, raw boundary
  data, and normalization adapter wiring.

## Impact Analysis

### Dependency Impact

- Affected surface: parser port, evaluator, raw `Unit`, normalizer, parsing
  consumers, parser tests, and desktop/web bundles.
- Propagation decision: normalized model gaps are owned by
  `complete-normalized-domain-model`, not hidden in parser DTOs.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: internal parser port may change.
- VS Code/web extension compatibility: shared parser path must remain browser
  safe and preserve both hosts.
- Changed scenarios: none unless investigation exposes a documented mismatch.

### Alternative Considerations

- Rename raw `Unit` in place: rejected because it does not establish a boundary.
- Return raw data from the application parser port indefinitely: rejected
  because it leaks parser structure to general use cases.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Parser semantics, grammar, or source-position behavior changes require
  replanning and approval.

## Compatibility

- Preserve `engines.vscode`, desktop parsing, web parsing, parser golden output,
  syntax errors, and malformed-input behavior.

## Acceptance Criteria

- Raw/parser imports exist only in approved parser/normalization locations.
- General application and presentation production references are zero.
- Parser, normalization, desktop, and web validation preserve behavior.

## Non-Goals

- Expanding JP1/AJS syntax, changing normalized domain semantics, or migrating
  individual presentation pipelines.

## Open Questions

- Exact raw boundary type location and parser-port return contract require
  planning against the owned raw/parser allowances.
