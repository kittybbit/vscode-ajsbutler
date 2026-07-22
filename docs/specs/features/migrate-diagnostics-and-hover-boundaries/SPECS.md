# Feature Specification: Migrate Diagnostics And Hover Boundaries

## Purpose

Separate parser evidence, domain rules, application diagnostic/hover decisions,
and VS Code presentation mapping so diagnostics and hover expose only
host-neutral application DTOs across the boundary.

## Minimal Context

- Current decision: complete the editor-feedback application boundary.
- Read first: this file, `TASKS.md`, and the diagnostics/hover use cases.
- Do not create `CONTEXT.md`.

## Origin

- Source use cases: `uc-diagnose-ajs-definition.md` and
  `uc-show-parameter-hover.md`.
- Source: complete migration directive Slice 6.
- JP1/AJS source reference: existing version 13 parameter/domain rules and
  parser source positions; no diagnostic or hover coverage expansion.
- Dependencies: parser isolation and normalized domain completion.

## Requirements

- Application owns diagnostic and hover entry points, DTOs, and host-neutral
  errors.
- Application diagnostic DTOs expose a host-neutral source range with a
  one-based line, zero-based column, and token length; only the VS Code adapter
  converts that range to editor coordinates.
- Domain owns shared JP1/AJS semantic rules used by editor feedback.
- Domain diagnostic evaluation reports stable `JP1-PARAM-*` rule IDs, typed
  non-localized violation reasons, and normalized parameter/source evidence
  without owning diagnostic wording, severity, telemetry, or VS Code objects.
- A shared domain violation contract is established before any diagnostic rule
  family moves so each family slice can depend on the same rule-ID and evidence
  shape independently.
- Presentation owns VS Code `Diagnostic`, `Range`, `Hover`, and Markdown mapping.
- Parser mechanics and VS Code types do not cross into domain/application
  decisions.
- Existing severity, message, position, localization, rule coverage, and hover
  content remain unchanged.

## Architecture

- Domain: own shared parameter and semantic rules.
- Application: combine parser/source evidence and domain rules into diagnostic
  and hover DTOs.
- Presentation: register VS Code providers and map DTOs to host objects.
- Infrastructure: provide parser/source evidence through ports.

## Impact Analysis

### Dependency Impact

- Affected surface: parser adapter, editor-feedback use cases/DTOs, diagnostic
  rule modules, diagnostic registration, hover provider, localization adapter,
  extension composition, telemetry type references, architecture checks, and
  tests.
- Propagation decision: new semantic hover content and diagnostic rules are out
  of scope.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal editor-feedback DTOs may change.
- VS Code/web extension compatibility: provider availability and shared parsing
  must remain compatible in supported hosts.
- Changed scenarios: none.

### Alternative Considerations

- Build VS Code objects in application: rejected as host coupling.
- Duplicate semantic rules in message builders: rejected because domain meaning
  would have multiple owners.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Severity, text, position, localization, supported rule, or hover-content
  changes require replanning and approval.

## Compatibility

- Preserve `engines.vscode`, desktop/web support, malformed-input behavior,
  diagnostic output, hover output, and localization.
- Preserve the existing parser coordinate convention: line numbers are
  one-based, columns are zero-based, and diagnostic lengths continue to cover
  the current parameter key or parser fallback span.

## Acceptance Criteria

- Both use cases return application DTOs without VS Code or parser types.
- VS Code-specific objects are constructed only in presentation adapters.
- Existing diagnostic and hover regression tests pass.

## Non-Goals

- New diagnostic parameters, semantic hover content, or UI changes.

## Planning Decisions

- Use a repository-owned source-range value in the application diagnostic DTO;
  do not expose ANTLR tokens, parser contexts, or VS Code positions.
- Keep parser failures as repository-owned application-port errors and map them
  to the same diagnostic DTO as semantic violations.
- Domain semantic evaluation returns stable rule IDs, typed violation reasons,
  and normalized evidence. The reason discriminates distinct failures under the
  same rule and target without containing display wording. Application mapping
  uses that result to retain the existing English diagnostic messages,
  categories, severity, ordering, and fallback positions without repeating
  domain validation.
- Adding rule IDs to repository-owned results does not add them to telemetry;
  existing telemetry names and payloads remain unchanged.
- Keep the current hover result (`symbol` and localized `syntax`) as the
  application-facing value. Define its lookup port in application, implement a
  browser-safe resource adapter in infrastructure, and construct that adapter
  in bootstrap so application no longer imports the domain localization service
  directly.
- The feature does not relocate unrelated list, semantic-diff, or table
  localization helpers.
