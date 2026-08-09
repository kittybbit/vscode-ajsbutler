# Feature Specification: Refactoring Quality Gate Strengthening

## Purpose

Strengthen the existing Qlty Cloud quality gate by reviewing the committed
Qlty analysis configuration and its Cloud gate semantics against measured
refactoring evidence. Keep Qlty Cloud and its GitHub App as the single owner
of Qlty execution and status reporting; do not add a second local or Actions
quality gate.

## Minimal Context

- Current decision: determine whether the committed Qlty configuration and
  the Qlty Cloud gate are actually blocking newly introduced or reopened
  maintainability regressions, then make only a narrow evidence-backed
  configuration change if a gap is confirmed.
- Feature kind: roadmap feature.
- Selected slug: `refactoring-quality-gate-strengthening`.
- Read first: this file, `TASKS.md`, `docs/specs/README.md`,
  `docs/specs/roadmap.md`, and `docs/specs/features/BASELINE.md`.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Source roadmap item: `docs/specs/roadmap.md`, “9. Refactoring Quality Gate
  Strengthening”.
- Source evidence: `docs/specs/features/BASELINE.md`, including the recorded
  Qlty reproduction identity, stable smell/metric inventory, and completed
  bounded refactoring evidence from the parser, telemetry, viewer, and related
  boundaries.
- JP1/AJS reference basis: no JP1/AJS vendor behavior is changed by this
  repository-quality feature. Compatibility is inherited from the existing
  JP1/AJS3 v13 use-case and architecture contracts, especially
  `docs/requirements/use-cases/uc-view-unit-list.md`,
  `docs/requirements/use-cases/uc-build-flow-graph.md`, and
  `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`. This is an
  explicit repository-policy basis, not an inferred JP1/AJS rule.
- Implementation-slice plan: `TASKS.md` after Planning Mode.

## Requirements

- Qlty Cloud and the registered `qltysh` GitHub App MUST remain the single
  repository-connected owner of Qlty analysis and pull-request status
  reporting.
- The review MUST inspect `.qlty/qlty.toml` exclusions, enabled checks,
  thresholds, modes, and plugin versions together with the effective Qlty
  Cloud Quality Gate settings.
- The resulting gate MUST identify a newly introduced or reopened regression
  rather than judging the whole existing backlog as a failure.
- Any changed configuration MUST be justified by the reproducible baseline
  and stable before/after evidence supplied by at least one completed bounded
  refactoring feature.
- If the existing configuration and Cloud settings already cover the
  approved signal, the feature MUST record a no-change decision rather than
  add a duplicate evaluator.
- The gate MUST NOT introduce a repository-wide absolute threshold unless a
  later approved plan records evidence that makes that threshold stable and
  appropriate.
- The gate MUST preserve the zero-exception architecture catalog, docs-only
  workflow classification, and required desktop/web validation paths. A
  Qlty configuration change is allowed only when an approved slice records
  the exact setting, evidence, and impact.
- A gate failure MUST identify the affected scope and quality signal clearly
  enough for a contributor to decide whether to fix the regression or request
  re-planning.
- The feature MUST NOT change production runtime behavior, parser semantics,
  JP1/AJS definition compatibility, telemetry privacy behavior, or VS Code
  engine compatibility.

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: no production infrastructure change is intended; the
  feature belongs to repository automation and CI policy. Any helper must stay
  outside production source and must not import runtime modules.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: the
  expected change surface is `.qlty/qlty.toml` and feature-local evidence,
  plus any explicitly required Cloud Project Settings change. The existing
  Actions workflow, package scripts, production callers, parser code,
  generated artifacts, extension entry points, and UI components are
  intentionally unchanged.
- Propagation decision: the approved Qlty setting, Cloud gate behavior,
  comparison semantics, and evidence record must agree. A Cloud-only setting
  that cannot be represented in the repository must be recorded as an
  external prerequisite; it must not be replaced with a duplicate local
  evaluator.

### Breaking Change Analysis

- User-visible behavior: none intended; contributor-facing CI diagnostics may
  become stricter for newly introduced quality regressions.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: no runtime or host behavior change;
  desktop and browser extension compatibility remains covered by the existing
  verification workflow.
- Changed scenarios: none; this feature strengthens repository validation and
  does not change an application use-case contract.

### Alternative Considerations

- Keep the existing advisory Qlty output only: rejected if the effective Cloud
  gate does not block the approved new-regression signal; the review must
  distinguish comments from a merge-blocking status.
- Add a local Qlty CLI evaluator or a second Actions installation: rejected
  because Qlty Cloud already owns repository-connected analysis and status
  reporting.
- Add repository-wide complexity or smell limits: rejected because the shared
  baseline explicitly records current thresholds as measurement configuration,
  not as approved acceptance limits.
- Add a runtime quality check to the extension: rejected because quality
  enforcement belongs to repository automation and would risk product
  behavior and desktop/web compatibility.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  and `Closure Approval` sections according to the SDD lifecycle.
- Scope changes requiring re-approval: changing the approved differential
  signal, comparison scope, CI trigger/classification, Qlty configuration,
  architecture catalog, production source, tests outside the approved gate,
  or any runtime/host behavior requires Replanning Mode.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; the feature
  does not raise or otherwise change that contract.
- Web extension compatibility: unchanged; shared verification remains
  responsible for browser-host checks whenever the gate change touches the
  verification workflow.
- Desktop extension compatibility: unchanged; shared verification remains
  responsible for desktop-host checks whenever the gate change touches the
  verification workflow.
- JP1/AJS compatibility: unchanged; supported definitions, normalized parser
  results, diagnostics, flow/list projections, and telemetry privacy behavior
  remain outside the gate's implementation scope.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The effective Qlty Cloud gate and the committed Qlty configuration are
  both recorded, including whether maintainability findings are comments,
  monitoring results, or merge-blocking issues.
- An approved quality signal is selected from reproducible baseline and
  bounded-refactoring before/after evidence, or a no-change decision is
  recorded with its rationale.
- No second Qlty CLI evaluator, install action, or workflow quality step is
  introduced.
- An unchanged baseline with pre-existing findings remains explainable and
  does not fail solely because those findings already existed.
- A deliberately introduced regression in the selected scope is detected by
  the existing Qlty Cloud gate or the focused configuration validation used
  to demonstrate that behavior.
- Docs-only pull requests retain their existing validation classification.
- Existing production build, desktop, and web compatibility checks remain
  available and no runtime behavior or supported JP1/AJS definition changes.
- Required documentation, traceability, validation, and Feature Exit evidence
  are complete before closure.

## Non-Goals

- Refactoring production code to improve current metrics.
- Introducing a repository-wide target for complexity, smells, duplication,
  coverage, technical debt, or dependency degree without new evidence.
- Reimplementing Qlty Cloud's analysis, pull-request status, or differential
  comparison in a repository helper or GitHub Actions step.
- Replacing the existing architecture dependency catalog or adding an
  exception.
- Changing parser grammar/generated code, UI behavior, telemetry collection,
  VS Code compatibility, or desktop/web runtime composition.
- Adding new product behavior, commands, configuration settings, or user-facing
  documentation beyond what a verified CI workflow change requires.
- Treating unavailable baseline measurements as zero or inventing substitute
  metrics without a new approved feature.

## Open Questions

- Does the Qlty Cloud Project have the Qlty Gate enabled, and is it configured
  to fail on new maintainability issues rather than only comment on them?
- Which issue levels, smell categories, and changed-file scope are included in
  the effective gate, and is the resulting GitHub status required for merge?
- Does the current `[smells] mode = "comment"` in `.qlty/qlty.toml` match the
  intended gate, or should an approved change use a blocking mode? The answer
  must be validated against the baseline and bounded-refactoring evidence;
  no threshold change is preselected.
