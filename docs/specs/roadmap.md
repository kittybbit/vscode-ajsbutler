# Roadmap

This roadmap contains only unfinished repository-level future work and the
entry conditions that make planning each item useful.

## Shared Refactoring Evidence

The `refactoring-quality-baseline` feature is complete. Its detailed evidence
remains in `features/BASELINE.md` for the dependent refactoring features and
will be removed only when the large-scale refactoring effort is complete.

## Ordered Refactoring Features

These are committed roadmap features, not optional candidates. Create and
approve one branch-owned feature at a time. The quality baseline owns target
evidence and ordering inputs; it does not approve implementation in any later
feature.

### 2. Architecture Boundary Protection

- Purpose: close only protection gaps demonstrated by the baseline while
  preserving the existing zero-exception architecture catalog.
- Entry condition: the baseline identifies a concrete dependency, cycle, or
  enforcement gap not already covered by the current architecture test.
- Dependency: Refactoring Quality Baseline.

### 7. Webview Presentation Separation

This roadmap area is decomposed into independent branch-owned features. Create,
plan, review, approve, and close one feature before selecting the next unless a
recorded dependency requires a different order.

#### 7.1 Flow-graph Rendering and Detail Presentation Separation

- Purpose: separate graph rendering, detail actions, and visual state from
  application-owned graph meaning.
- Entry condition: graph DTO and exploration characterization evidence identify
  the exact renderer and detail-presentation boundary.
- Dependency: completed flow-graph characterization and the preserved
  Application flow-graph contract.

#### 7.3 Unit-list Table Presentation and Keyboard Navigation Separation

- Purpose: separate table rendering, column actions, virtualization, and
  keyboard focus state from application list DTOs.
- Entry condition: visible-column, export, navigation, sorting, detail, and
  focus behavior are characterized for large lists.
- Dependency: completed unit-list characterization and the preserved
  Application unit-list contract.

#### 7.4 Shared Webview Header Search Control Separation

- Purpose: make shared header-search state and accessibility behavior explicit
  without creating a shared search domain contract.
- Entry condition: table and flow helper text, shortcuts, result counts,
  localization, focus, and query privacy are characterized.
- Dependency: completed header-search characterization; table and flow matching
  semantics remain presentation-local.

#### 7.5 Flow-tree Selector Interaction Separation

- Purpose: isolate tree selection, focus, keyboard navigation, and scope-row
  state while preserving stable list/flow identity.
- Entry condition: enabled and disabled rows, focus movement, selection, scope
  opening, reveal, and return-focus behavior are characterized.
- Dependency: completed flow-tree characterization and stable cross-view
  navigation identity; remains separate from 7.3.

### 8. Infrastructure Boundary Cleanup

- Purpose: isolate one selected ANTLR, WebAPI, VS Code, file, localization, or
  telemetry detail behind an existing or justified application port.
- Entry condition: generated-model, technical-error, or host-specific leakage
  is demonstrated at an exact boundary with compatibility evidence.
- Dependency: completed characterization evidence and any required Application
  Use Case Extraction.

### 9. Refactoring Quality Gate Strengthening

- Purpose: prevent recurrence using approved differential gates derived from
  measured, stable evidence rather than preselected repository-wide limits.
- Entry condition: the baseline is reproducible and at least one bounded
  refactoring feature supplies before/after evidence for a stable gate.
- Dependency: Refactoring Quality Baseline and evidence from completed bounded
  refactoring features.

## Baseline-Derived Refactoring Intake Ordering

The completed `refactoring-quality-baseline` identifies bounded responsibility
groups for later feature intake. These are sequencing inputs, not approvals to
create later feature folders or change runtime behavior.

Detailed target files/functions, evidence, compatibility notes, and measurable
success signals are maintained in `features/BASELINE.md` for shared use by the
dependent features. This shared evidence is temporary at the large-scale
refactoring level and is removed only after that effort is complete.

- Completed characterization evidence is the first dependency for every
  selected boundary. Keep diagnostics, application flow construction, flow
  webview rendering/state, unit-list projections, table presentation, viewer
  composition, viewer transport, parser contracts, telemetry, and the schedule
  rule as separate characterization boundaries when their observable behavior
  differs.
- Application Use Case Extraction follows characterization for the syntax
  diagnostics, flow-graph construction, unit-list projection, CSV, stable
  cross-view navigation, parser/error, selected VS Code/file-I/O, viewer
  transport/composition, and selected webview boundaries. Each remains a
  separate implementation slice with its own approval and validation.
- Webview Presentation Separation features 7.1 through 7.5 contain only their
  selected flow rendering, flow interaction state, unit-list table interaction,
  header search, or flow-tree selector boundary not selected by Feature 4.
  They do not create a shared search domain contract.
- Infrastructure Boundary Cleanup contains only VS Code `ViewerFactory`, the
  normalized `AjsParserPort`, file/host adapters, or the validated telemetry
  contract that Feature 4 leaves unselected, and only after host, parser,
  privacy, and failure behavior are characterized.
- Architecture Boundary Protection remains behind its existing evidence gate:
  the composition-root candidate is not treated as a dependency violation
  without a concrete gap, cycle, or enforcement failure.
- Refactoring Quality Gate Strengthening remains last. It opens only after a
  bounded refactoring supplies stable before/after evidence suitable for a
  differential gate; no repository-wide threshold is introduced here.

This ordering preserves the existing desktop/web, parser, telemetry, and
JP1/AJS compatibility contracts. Later feature intake must cite the relevant
use case or architecture responsibility and record its own approval boundary.

## Product Decisions

### WebAPI Import Beta Exit

- Entry condition: usable smoke-verification evidence from a real JP1/AJS3
  WebAPI environment and enough user feedback are available.
- Decide whether the delivered read-only import can exit beta after the owning
  feature records product and version context, tested scenarios, observed
  results, host constraints, and the sufficiency of
  `searchTarget=DEFINITION`.
- Keep broader WebAPI behavior outside this decision.

### Telemetry Product Learning

- Entry condition: analytics usage, product reporting, or an approved feature
  creates a concrete product question that existing evidence cannot answer.
- Decide dashboard compatibility, exact performance and size buckets,
  diagnostic rule identifiers, and observable abandonment semantics only when
  a concrete consumer requires them.
- Add runtime telemetry only with the corresponding approved feature behavior,
  using `docs/requirements/cross-cutting/telemetry.md` as the durable privacy
  and operational contract.

## Deferred Candidates

### Build And Test Output Ownership

- Entry condition: packaging, caching, or stale-output behavior becomes a
  concrete blocker.
- Candidate: assign clearer ownership to build and test output directories.

### Shared Search Use Case

- Entry condition: at least two non-table consumers require equivalent
  matching or result-navigation semantics.
- Candidate: define a shared search contract while leaving renderer-specific
  camera and ranking behavior with its presentation owners.

### Broader WebAPI Support

- Entry condition: the read-only import boundary, authentication model, and
  beta feedback are stable enough to define one concrete extension safely.
- Candidate: plan one focused WebAPI capability beyond read-only import.

### Viewer Bundle-Size Reduction

- Entry condition: a concrete compatibility, startup-time, or payload-size
  target makes viewer bundle size a product or operational constraint.
- Candidate: plan viewer-specific bundle reduction against that target.

### Translation-Resource Consolidation

- Entry condition: translation-resource maintenance becomes a concrete
  blocker.
- Candidate: consolidate only the affected i18n resources.

### JP1/AJS View Interaction Parity

- Entry condition: a concrete missing interaction is identified against the
  supported JP1/AJS View behavior.
- Candidate: define and implement that interaction as a focused feature.

### Expanded-Flow Layout Fixtures

- Entry condition: real-world nested layouts expose an additional collision or
  refit gap.
- Candidate: add focused regression fixtures for the observed layout case.
