# Feature Specification: Refactoring Characterization Safety Net

## Purpose

Protect the observable contracts of the baseline-selected high-risk
responsibility boundaries before their internal structure is refactored. This
feature adds no product behavior and does not approve a structural refactor;
it defines the evidence that later features must preserve.

## Minimal Context

- Current decision: establish separate, approval-ready characterization
  boundaries for the first refactoring targets identified by the shared
  baseline.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when validating
  a slice or reviewing its evidence.
- Shared evidence: `docs/specs/features/BASELINE.md`.
- Do not create `CONTEXT.md`; SDD policy is defined by `docs/specs/README.md`.

## Origin

- Source roadmap item: `docs/specs/roadmap.md`, Ordered Refactoring Features,
  item 3.
- Source baseline: `docs/specs/features/BASELINE.md`, Bounded follow-on feature
  intake, groups 1-14.
- Source use cases: the use cases and domain rules mapped in
  `TRACEABILITY.md`.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1. Each selected responsibility boundary has characterization evidence for
  its current observable output, error behavior, and relevant edge cases before
  any later structural change.
- R2. Parser, application, presentation, host, telemetry, and JP1/AJS rule
  behavior are characterized separately when they do not share one approval
  boundary.
- R3. Evidence covers representative valid, malformed, encoded, nested, and
  large definitions where the boundary handles those inputs. A malformed
  result must not be recorded as a successful complete projection.
- R4. Characterization preserves desktop and browser-extension behavior and
  does not introduce Node, VS Code, UI-framework, parser-generated, or
  telemetry-SDK dependencies across the existing architecture boundaries.
- R5. Existing JP1/AJS version 13 schedule interpretation, raw/effective value
  distinctions, diagnostics, list/CSV rows, flow DTOs, and telemetry privacy
  contracts remain the baseline semantics.
- R6. Later refactoring features consume the evidence as a compatibility gate;
  this feature does not approve those later refactors or introduce repository-
  wide quality thresholds.

## Architecture

- Domain: characterize the JP1/AJS schedule-rule helper without moving parser,
  UI state, or host concerns into the domain.
- Application: characterize the normalized parser port, syntax diagnostics,
  flow-graph DTO construction, and unit-list projection contracts.
- Presentation: characterize flow rendering and interaction state, table
  presentation/navigation, shared header search, and flow-tree selection.
- Infrastructure/bootstrap/host: characterize viewer composition, VS Code
  viewer transport, parser adapter behavior, and the validated telemetry
  contract without changing their ownership.

## Impact Analysis

### Dependency Impact

- The baseline-selected targets are the application diagnostics, flow, list,
  parser, and schedule boundaries; flow and table webview boundaries; viewer
  composition and VS Code transport; and telemetry builders.
- Existing tests and fixtures are extended only as needed to record current
  behavior. Existing use cases remain the durable behavior owners.
- Characterization slices must be reviewed and committed independently. A
  later extraction, presentation separation, infrastructure cleanup, or domain
  restructuring feature depends on the relevant completed slice.
- Semantic diff and WebAPI behavior are not selected by the baseline cutoff;
  they remain separate future intake candidates unless new evidence selects a
  concrete boundary.

### Breaking Change Analysis

- User-visible behavior: none intended; the feature is a safety net.
- API/DTO/schema compatibility: current contracts are captured, not changed.
- VS Code/web extension compatibility: both desktop and browser paths are
  included in the validation plan; no minimum VS Code version change is
  allowed.
- Changed scenarios: none intended. Existing scenarios receive explicit
  characterization coverage where a boundary lacks a stable fixture.

### Alternative Considerations

- One repository-wide snapshot suite: rejected because parser, application,
  presentation, desktop, web, and telemetry failures have different owners and
  approval boundaries.
- A structural refactor before characterization: rejected because it would
  make behavior changes difficult to distinguish from intentional movement.
- New global complexity or coverage thresholds: rejected because the baseline
  records evidence but does not justify a repository-wide gate.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: new behavior, changed message/span/
  DTO/telemetry semantics, new JP1/AJS support, a new host boundary, a new
  feature folder, or any structural refactor outside the active slice.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`).
- Web extension compatibility: shared application and webview behavior must
  remain equivalent in browser-hosted execution.
- Desktop extension compatibility: VS Code panel lifecycle, diagnostics,
  transport, and telemetry fallback must remain equivalent.
- JP1/AJS compatibility: existing definition-file normalization, version 13
  schedule semantics, diagnostic spans/severity, list/CSV row identity, and
  flow nesting/order remain unchanged.
- No command reference or configuration schema is added. Existing domain-rule
  documents are the source for schedule and diagnostic semantics; unknown
  vendor behavior remains explicitly inferred where those documents do not
  define it.

## Acceptance Criteria

- AC1. Every implementation slice recorded in `TASKS.md` has a reviewable
  boundary, dependency, validation plan, production-readiness risks, and
  approval boundary.
- AC2. Characterization evidence records stable output and failure behavior for
  the normalized parser port, diagnostics, flow graph, list projections,
  schedule rule, telemetry, viewer lifecycle, and each selected webview
  interaction boundary.
- AC3. Valid, malformed, encoded, nested, and large-input cases are covered
  where applicable, including no-partial-result behavior.
- AC4. Desktop and browser-hosted validation plans cover shared contracts and
  host-specific lifecycle/capability behavior.
- AC5. The evidence does not change user-visible behavior, parser grammar,
  generated-parser ownership, telemetry privacy policy, or `engines.vscode`.
- AC6. `TRACEABILITY.md` maps every slice to a durable use case or rule and a
  concrete test or validation plan.
- AC7. Later feature intake can cite a completed characterization slice as its
  entry condition without relying on undocumented implementation history.

## Non-Goals

- Refactoring production code or changing architecture dependencies.
- Adding new JP1/AJS commands, parameters, grammar support, diagnostic rules,
  semantic-diff behavior, or WebAPI capabilities.
- Changing user-facing messages, source spans, DTO fields, CSV meaning,
  telemetry event names/properties, or view interaction semantics.
- Creating a shared search domain contract.
- Introducing a repository-wide coverage, complexity, smell, or duplication
  threshold.
- Planning or implementing the downstream Application Use Case Extraction,
  Domain Model Restructuring, Webview Presentation Separation, Infrastructure
  Boundary Cleanup, or Quality Gate Strengthening features.

## Open Questions

- None for feature intake. Any missing fixture or newly discovered boundary is
  a replan decision owned by `TASKS.md` before implementation.
