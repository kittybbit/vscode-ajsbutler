# Feature Specification: Semantic Diff Qlty Remediation

## Purpose

Eliminate the 56 Qlty blocking findings reported on PR #313 through
behavior-preserving refactoring of the Semantic Diff implementation added or
expanded by that pull request.

## Minimal Context

- Current decision: define the exact quality-remediation boundary before
  planning any implementation slices.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.
- Feature kind: transient branch feature for PR-blocking remediation.

## Origin

- Source: Qlty review on PR #313 at commit
  `4fc386413d6eb84aaeefe13e0b6847bc3963cb94`.
- Pull request title: `Add structured Semantic Diff outputs and report modes`.
- Source finding: 56 blocking issues across function and file complexity,
  return count, boolean logic, parameter count, nested control flow, and two
  similar-code findings.
- Source use cases:
  `docs/requirements/use-cases/uc-build-semantic-diff.md` and
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`.
- Dependency: the completed `semantic-diff-structured-outputs` feature on the
  current branch; its closed feature folder must not be restored.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- R1: Resolve all 56 Qlty blocking findings reported for PR #313 without
  changing Qlty configuration, thresholds, or suppression policy.
- R2: Preserve Semantic Diff comparison, summary, identity, schedule, and
  confirmation-risk meaning for the same inputs.
- R3: Preserve the JSON v1 wire contract, including schema shape, values,
  explicit null and empty fields, deterministic ordering, and serialized
  bytes for existing regression fixtures.
- R4: Preserve Summary, Full, and Audit Markdown content and localization for
  existing regression fixtures; in particular, Full Markdown bytes and
  language fallback behavior must remain unchanged.
- R5: Preserve output-mode selection and the existing display, copy, save,
  cancellation, and host-failure behavior of the Semantic Diff commands and
  report document.
- R6: Keep the refactoring within the current Clean Architecture boundaries
  and retain desktop and web extension support at the VS Code engine declared
  in `package.json`.
- R7: Demonstrate zero Qlty PR blockers for the remediated head together with
  focused Semantic Diff regression tests and the repository's full required
  validation.

## Architecture

- Domain: unchanged; no domain rule or JP1/AJS meaning may change.
- Application: behavior-preserving decomposition of summary and comparison
  helpers only where required by the reported findings.
- Presentation: behavior-preserving decomposition of Markdown localization,
  output serialization, command orchestration, and report-document helpers.
- Infrastructure: none.

## Impact Analysis

### Dependency Impact

- Reported production-code surface:
  `buildSemanticDiffSummary.ts`, `compareSemanticDiff.ts`,
  `renderSemanticDiffAuditMarkdown.ts`,
  `semanticDiffMarkdownLocalization.ts`, `semanticDiffOutput.ts`,
  `serializeSemanticDiffJson.ts`, `semanticDiffCommand.ts`, and
  `semanticDiffReportDocument.ts`.
- Affected callers and tests: Semantic Diff comparison and projection callers,
  focused output, JSON, Markdown, command, report-document, schedule,
  condition, contract, and flow-highlight tests, plus desktop/web regression
  validation.
- Propagation decision: internal helper extraction or file decomposition may
  move responsibilities within their existing layer, but public DTOs, schema,
  commands, output modes, localized text, host behavior, and domain meaning
  remain unchanged.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: no change; JSON schema v1 and application DTO
  contracts remain exact.
- VS Code/web extension compatibility: no change; preserve the declared engine
  and browser-safe production code.
- Changed scenarios: none; all scenarios in the two source use cases are
  regression contracts.

### Alternative Considerations

- Reopen the completed structured-output feature: rejected because Feature
  Exit already propagated its durable behavior and removed its temporary
  folder; this is an independent PR quality-gate follow-up.
- Suppress findings or relax Qlty configuration: rejected because it would not
  remediate the reported maintainability problems.
- Combine the remediation with Semantic Diff roadmap enhancements: rejected
  because review-risk rules, schedule semantics, Explorer, comparison
  workflow, and calendar outcomes are independent product work.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: any observable behavior, output bytes,
  schema/DTO, JP1/AJS interpretation, command, host behavior, compatibility,
  Qlty policy, or additional production surface beyond the reviewed plan.

## Compatibility

- JP1/AJS reference basis: the existing version 13 normative basis and the
  behavior contracts in the two source use cases; no new JP1/AJS behavior or
  undocumented runtime assumption is introduced.
- VS Code compatibility follows `package.json` `engines.vscode` without a
  minimum-version change.
- Web extension compatibility: preserve browser-safe code and existing web
  command/report behavior.
- Desktop extension compatibility: preserve existing command, editor,
  clipboard, and save behavior.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The Qlty check for the PR head reports zero blocking issues attributable to
  the 56 findings in scope and introduces no replacement blockers.
- Focused Semantic Diff tests prove unchanged comparison facts, summary facts,
  identity decisions, schedule effects, and confirmation-risk results.
- Existing JSON v1 fixtures serialize to the same deterministic bytes and
  ordering.
- Existing Summary, Full, and Audit Markdown fixtures, localization, and
  English fallback remain unchanged.
- Command and report-document tests preserve selection, display, explicit
  copy/save, cancellation, and failure behavior.
- Repository quality, build, architecture, and relevant desktop/web test
  suites pass.
- No durable documentation update is needed because externally observable
  behavior and repository architecture policy do not change.

## Non-Goals

- Changing Semantic Diff product behavior or adding output modes.
- Changing JSON v1 schema, field ordering, serialization, or versioning.
- Changing Markdown wording, localization, formatting, or mode semantics.
- Changing identity matching, schedule interpretation, confirmation-risk
  rules, or JP1/AJS compatibility.
- Changing commands, menus, report workflow, host behavior, telemetry, VS Code
  engine compatibility, or desktop/web support.
- Changing Qlty configuration, thresholds, generated baselines, or suppressing
  findings.
- Implementing any unfinished Semantic Diff roadmap item.
- Updating README, CHANGELOG, requirements use cases, architecture, or roadmap
  unless planning discovers an actual contract change, which requires a stop
  and replan rather than silent expansion.

## Open Questions

- None.
