# Feature Specification: JP1/AJS3 v13 Runtime Diagnostic Conformance

## Purpose

Make the runtime semantic diagnostics for the currently supported parameter
rules conform to the authoritative JP1/AJS3 version 13 rules, including the
confirmed implementation gaps recorded in the repository roadmap.

## Minimal Context

- Current decision: align runtime diagnostic decisions with the existing
  durable diagnostic parameter contract without expanding diagnostic coverage
  to every JP1/AJS3 parameter.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Source use case:
  `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`
- Normative domain rule:
  `docs/requirements/domain-rules/jp1-diagnostic-parameter-rules.md`
- Roadmap source: `docs/specs/roadmap.md`, runtime diagnostic conformance for
  JP1/AJS3 version 13
- Branch plan: `docs/specs/plans.md`
- Implementation-slice plan: `TASKS.md`
- JP1/AJS source reference:
  - Command reference: JP1 Version 13 JP1/Automatic Job Management System 3
    Command Reference, sections 5.2.4, 5.2.6, 5.2.7, 5.2.9, 5.2.10,
    5.2.16, 5.2.17, and 5.2.24, as linked by the normative domain rule.
  - Definition/config reference: none; the supported diagnostic contract is
    based on the command-reference parameter definitions.
  - Undocumented or inferred behavior: none.

## Requirements

- Runtime semantic diagnostics must enforce every rule ID currently promised
  by `uc-diagnose-ajs-definition.md` according to its unique normative body in
  `jp1-diagnostic-parameter-rules.md`.
- Yearly schedule cycle `cy=(n,y)` must accept `1..9` and reject values outside
  that range; diagnostic text must not advertise `1..10`.
- Repeated `evwfr` definitions must be evaluated against their aggregate
  2,048-byte limit in canonical `evwfr=<raw-value>;` form, including the
  parameter key, `=`, and terminating `;`, but excluding indentation and line
  endings.
- Transfer-file macro-variable validity must account for unit class and
  effective queuing context: UNIX/PC and recovery UNIX/PC jobs require
  effective `jty=q`, QUEUE and recovery QUEUE jobs allow the supported form,
  UNIX custom and recovery UNIX custom jobs allow it, and custom PC jobs do
  not support transfer-file parameters.
- End-judgment and automatic-retry diagnostics must include QUEUE and recovery
  QUEUE jobs in the supported target set.
- File-monitoring condition `flwc` must enforce the complete
  `c[:d[:{s|m}]]` form, not only the mutual exclusion of `s` and `m`.
- File-monitoring and transfer-file byte-length checks must measure the
  parameter content governed by the official limit, excluding serialization
  quotation marks.
- Diagnostic evaluation must preserve raw parameter evidence and source
  positions and must return host-neutral application diagnostics shared by
  desktop and web entry points.
- Implementation behavior and diagnostic messages must be corrected from the
  durable rule contract; the contract must not be weakened to preserve an
  incorrect runtime value.

## Behavioral Scenarios

```gherkin
Feature: Conform runtime diagnostics to supported JP1/AJS3 version 13 rules

Scenario: A supported parameter rule is evaluated according to version 13
  Given a syntactically valid JP1/AJS3 definition
  And its parameter is covered by a supported JP1-PARAM rule
  When runtime semantic diagnostics are evaluated
  Then validity follows the normative version 13 rule
  And any violation produces a focused host-neutral diagnostic

Scenario: Repeated event filters use the aggregate byte limit
  Given an event-reception job with repeated evwfr definitions
  When their combined canonical evwfr=<raw-value>; forms exceed 2048 bytes
  Then runtime semantic diagnostics report the aggregate-limit violation

Scenario: Transfer-file macro validity uses job context
  Given a supported transfer-file macro-variable form
  When runtime semantic diagnostics are evaluated for its unit class and jty
  Then the form is accepted only in the contexts allowed by the normative rule

Scenario: Governed byte limits exclude serialization quotes
  Given a quoted file-monitoring or transfer-file parameter at its content limit
  When runtime semantic diagnostics measure its byte length
  Then the quotation marks do not count toward the governed content length

Scenario: File-monitoring conditions use the complete version 13 form
  Given a file-monitoring job with an explicit flwc value
  When runtime semantic diagnostics are evaluated
  Then only the c[:d[:{s|m}]] forms are accepted
```

## Architecture

- Domain: retain the versioned parameter rules and normalized unit/parameter
  context as host-neutral concepts; do not import `vscode` or UI concerns.
- Application: evaluate supported diagnostic rule IDs against normalized
  parameter evidence, including aggregate and context-sensitive decisions, and
  emit host-neutral diagnostics.
- Presentation: continue mapping application diagnostics to VS Code editor
  diagnostics without reinterpreting JP1/AJS parameter meaning.
- Infrastructure: no new parameter semantics; preserve the existing parser
  adapter boundary and raw evidence supplied to the application layer.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: semantic
  diagnostic rule sets/builders and target classification under
  `src/application/editor-feedback/`, focused diagnostic tests under
  `src/test/suite/`, the diagnosis use case, feature traceability, branch plan,
  roadmap, and likely `CHANGELOG.md` during implementation because observable
  diagnostics change.
- Propagation decision: change the application diagnostic decisions and their
  focused tests together; keep parser grammar, hover, list, flow, and
  presentation mapping contracts unchanged.

### Breaking Change Analysis

- User-visible behavior: false negatives and false positives in supported
  semantic diagnostics will change to match JP1/AJS3 version 13; affected
  diagnostic messages may also change.
- API/DTO/schema compatibility: no change expected to diagnostic DTO shape or
  parser output.
- VS Code/web extension compatibility: both hosts must receive the same changed
  decisions through the existing host-neutral application result.
- Changed scenarios: the four conformance scenarios in this specification are
  added; existing syntax-diagnostic and host-neutral scenarios remain.

### Alternative Considerations

- Expand diagnostics to every version 13 parameter: rejected because it adds
  unsupported rule families and is broader than this feature's single purpose.
- Preserve current runtime behavior by changing the durable rules: rejected
  because the official version 13 reference and existing normative contract
  are authoritative.
- Correct only the first `cy` range defect: rejected because other confirmed
  gaps affect the same runtime-conformance boundary and the requested scope is
  all currently supported rules.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval: adding new diagnostic rule IDs or
  parameter families, parser or normalized-model changes, DTO/schema changes,
  presentation behavior beyond message mapping, or changes to hover, list,
  flow, or syntax parsing.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; this feature
  must not raise the minimum supported version or require a newer VS Code API.
- Web extension compatibility: preserve browser-safe shared code and apply the
  same host-neutral diagnostic decisions as desktop.
- Desktop extension compatibility: preserve activation, parser integration,
  source positions, and diagnostic DTO-to-editor mapping while correcting the
  supported semantic decisions.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Focused tests demonstrate conformance for every confirmed gap and preserve
  valid boundary values.
- Existing supported `JP1-PARAM-*` diagnostic families are audited against
  their normative bodies, with each discovered runtime difference corrected
  or explicitly returned to replanning if it changes the approved boundary.
- The yearly `cy` diagnostic range and message use `1..9`, and `flwc` accepts
  only the complete supported condition forms.
- Aggregate `evwfr`, transfer-file context, QUEUE/recovery QUEUE job-end rules,
  and governed-content byte lengths behave as specified.
- Diagnostic DTO shape, raw parameter evidence, source positions, syntax
  diagnostics, and desktop/web decision parity are preserved.
- Relevant focused tests, desktop/web checks selected by risk, and
  `rtk pnpm run qlty` pass before feature completion.

## Non-Goals

- Complete diagnostic coverage for every JP1/AJS3 version 13 parameter.
- Parser grammar, syntax-diagnostic, or raw parsing changes.
- Parameter hover, unit-list, flow-view, CSV, semantic-diff, or unit-definition
  behavior changes.
- Support for another JP1/AJS version or compatible-ISAM-specific rules.
- Redesigning diagnostic DTOs, VS Code presentation mapping, or extension
  activation.

## Open Questions

- None.
