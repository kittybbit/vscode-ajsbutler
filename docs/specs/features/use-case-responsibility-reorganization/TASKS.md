# Feature Tasks: Use-Case Responsibility Reorganization

## Agent Brief

- Purpose: reorganize requirement documents by stable responsibility without
  changing observable behavior.
- Approved or active slice: none; the full plan is awaiting review and human
  approval.
- Do not: edit runtime code, tests, configuration, or generated artifacts.
- Do not: change existing JP1/AJS or extension behavior while moving text.
- Read first: `SPECS.md`, this file, and
  `docs/requirements/use-cases/README.md`.
- Read `TRACEABILITY.md` when checking slice coverage and moved references.
- Validate each slice with targeted reference checks and docs lint; run the
  full docs-only validation before feature exit.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: plan review, then human approval of one or more slices.

## Sync Rule

- Update this file in the same commit whenever a slice is completed,
  re-scoped, or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes an
  active feature.
- Update `docs/specs/roadmap.md` only when repository-level sequencing or a
  durable future decision changes.
- Keep this file focused on the implementation-slice plan, approval state,
  validation, risk, and feature exit readiness.

## Plan Status

- Status: In Progress
- Planning scope: reclassify non-use-case requirements, consolidate or split
  the identified use cases, establish one normative owner for JP1 parameter
  semantics, and repair repository-local references.
- Review status: Reviewed
- Human approval: Approved
- Active implementation slice: Slice 3

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slices 1 through 5 as reviewed; each slice remains limited to
  its recorded docs-only approval boundary.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

## Implementation Slices

### Slice 1: Classify Shared And Cross-Cutting Requirements

- Status: Complete
- Scope:
  - create focused indexes under `docs/requirements/domain-rules/` and
    `docs/requirements/cross-cutting/`
  - move normalization, JP1 parameter interpretation, and AJS command
    generation from `use-cases/` to `domain-rules/`
  - move telemetry from `use-cases/` to `cross-cutting/`
  - remove the redundant search-unification use case and retain its future
    trigger as a roadmap decision
  - remove migration-specific class ownership from the normalization contract
  - define the normalization/interpretation boundary as raw normalized values
    plus context being input to the normative interpretation contract, which
    owns effective values, defaults, inheritance, and contextual validity
  - update direct references, including unit-definition command generation
- User / Domain Value: each non-user-facing requirement has one durable,
  correctly classified normative owner.
- Cohesive Change Group: requirements taxonomy, the three shared domain-rule
  documents, telemetry, the search roadmap decision, and their direct links.
- Acceptance:
  - no domain capability or cross-cutting policy remains indexed as a user
    use case
  - normalization contains no file, class, constructor, or migration ownership
  - command generation remains reusable but is not presented as an independent
    user operation
  - search unification has one future-decision owner and no duplicate use case
- Validation:
  - targeted search for old document paths and implementation names
  - `rtk pnpm run lint:md`
  - `rtk git diff --check`
- Traceability: current normalization, parameter, command, telemetry, and search
  documents to SPECS Requirements 1, 2, 4, 5, and 6; proven by path, content,
  and docs-lint checks.
- Production Readiness:
  - Failure mode: lost requirements or broken links after file moves
  - JP1/AJS compatibility: no rule values or supported version change
  - Large or malformed input risk: none; documentation-only
  - Desktop/web impact: none
  - README/docs impact: requirements indexes and references change
  - CHANGELOG impact: none under the documentation-maintenance criteria
- Approval Boundary: only durable requirements taxonomy, moved document text,
  direct Markdown references, `roadmap.md`, and feature SDD artifacts.
- Dependencies: none
- Risks: accidental loss of normative text while removing implementation notes;
  ambiguity if raw and effective parameter ownership is not explicit.
- Implementation Feedback: the slice boundary was appropriate; direct
  reference impact was smaller than expected, no new dependency was found, and
  full telemetry scenario comparison prevented over-compression during
  reclassification.
- Out of Scope: runtime domain model, telemetry implementation, search
  implementation, or command behavior changes.

### Slice 2: Consolidate The Unit-List Use Case

- Status: Complete
- Scope:
  - replace `uc-build-unit-list.md` and `uc-build-unit-list-view.md` with
    `uc-view-unit-list.md`
  - express raw input, parse/normalize failure, visible rows, definition and
    export metadata, deterministic ordering, and desktop/web behavior as one
    user purpose
  - move shared defaults and cross-parameter meaning into the parameter domain
    rule and reference stable rule IDs from the unit-list contract
  - keep table-framework formatting, filtering, DTO stage ownership, wrapper
    migration, and column implementation details out of the use case
- User / Domain Value: one stable contract describes what users receive when
  opening the unit list, independent of internal DTO stages.
- Cohesive Change Group: both existing unit-list use cases, the unit-list index
  entry, direct references, and the shared parameter rules they consume.
- Acceptance:
  - one unit-list use case covers the current observable scenarios
  - parse/normalize/document/row stages are not separate user purposes
  - shared parameter meaning is normative only in the parameter domain rule
  - CSV export and definition display references remain valid
- Validation:
  - scenario-by-scenario preservation review
  - targeted search for both removed filenames
  - `rtk pnpm run lint:md`
  - `rtk git diff --check`
- Traceability: both current unit-list use cases to SPECS Requirements 3 through
  6; proven by scenario preservation, rule-reference, path, and docs-lint
  checks.
- Production Readiness:
  - Failure mode: dropping list behavior or metadata during consolidation
  - JP1/AJS compatibility: existing defaults and projections preserved by rule
    reference
  - Large or malformed input risk: existing documented constraint preserved
  - Desktop/web impact: shared behavior remains explicit and unchanged
  - README/docs impact: requirements index and direct references change
  - CHANGELOG impact: none; no observable behavior changes
- Approval Boundary: unit-list requirement files, direct references, parameter
  rule references, and feature traceability only.
- Dependencies: Slice 1
- Risks: losing a table-visible scenario or leaving internal model names as
  normative outputs.
- Implementation Feedback: the two-stage document/view split consolidated
  cleanly around one trigger; preserving every projection scenario required six
  stable parameter rule IDs, but no new requirement or dependency was needed.
- Out of Scope: list runtime code, DTO schemas, columns, filtering, CSV logic,
  or viewer UI.

### Slice 3: Split Diagnostics From Parameter Hover

- Status: Approved
- Scope:
  - replace `uc-provide-editor-feedback.md` with
    `uc-diagnose-ajs-definition.md` and `uc-show-parameter-hover.md`
  - preserve their distinct triggers, outputs, error behavior, localization,
    and desktop/web-neutral application contracts
  - move shared JP1 defaults, dependencies, and parameter-combination meaning
    to the parameter domain rule with stable rule IDs
  - keep diagnostics responsible for reporting violations and hover responsible
    for presenting interpreted syntax/meaning
- User / Domain Value: diagnostics and hover each have a focused, independently
  understandable behavior contract while sharing one semantic rule source.
- Cohesive Change Group: the combined editor-feedback use case, the two new
  use cases, shared parameter rules, index entries, and direct references.
- Acceptance:
  - every existing diagnostic and hover scenario is retained or represented by
    an explicit referenced rule
  - diagnosis and hover no longer share a file solely because both use editor
    data
  - parameter-family files are not introduced as separate use cases
- Validation:
  - scenario and rule-ID coverage review
  - targeted search for the removed filename and duplicated normative values
  - `rtk pnpm run lint:md`
  - `rtk git diff --check`
- Traceability: the current editor-feedback use case to SPECS Requirements 3
  through 6; proven by scenario, rule-ID, stale-path, and docs-lint checks.
- Production Readiness:
  - Failure mode: losing a diagnostic family or hover localization constraint
  - JP1/AJS compatibility: v13 semantics preserved in the domain-rule owner
  - Large or malformed input risk: existing diagnostic safety notes preserved
  - Desktop/web impact: no adapter or host behavior change
  - README/docs impact: requirements index and direct references change
  - CHANGELOG impact: none; no observable behavior changes
- Approval Boundary: editor-feedback requirement files, parameter domain-rule
  text, direct Markdown references, and feature traceability only.
- Dependencies: Slice 1
- Risks: incomplete migration of the large diagnostic rule set; overloading
  rule IDs with presentation-specific wording.
- Out of Scope: diagnostic or hover runtime logic, new validation rules, VS
  Code adapters, localization resources, or executable specifications.

### Slice 4: Separate Flow Construction From Exploration

- Status: Approved
- Scope:
  - narrow `uc-build-flow-graph.md` to scope resolution, deterministic graph
    content, nodes, edges, nesting information, and observable layout
    invariants
  - create `uc-explore-flow-graph.md` for expansion, search navigation,
    selection, hover, focus, zoom preservation, and tree synchronization
  - remove file paths, class/module ownership, migration history, React Flow
    chrome, card-row structure, rail details, and algorithm ownership from use
    cases
  - preserve the job-group/root-jobnet scope contract and navigation links
- User / Domain Value: graph construction and interactive exploration have
  distinct stable contracts without exposing viewer implementation details.
- Cohesive Change Group: flow construction, flow exploration, navigation
  references, requirements index, and feature traceability.
- Acceptance:
  - graph content and scope remain deterministic and consistent with list-to-
    flow navigation
  - observable non-overlap, stable placement, and relative-subtree invariants
    remain documented without naming an owning implementation file
  - viewer interactions are documented outside graph construction
  - optional UI chrome and layout algorithm details are absent from use cases
- Validation:
  - content comparison against every existing flow scenario and rule
  - targeted search for source paths, implementation owners, MiniMap, and
    removed details in use cases
  - `rtk pnpm run lint:md`
  - `rtk git diff --check`
- Traceability: the current flow use case to SPECS Requirements 2, 3, 5, and 6;
  proven by scenario, implementation-detail, path, and docs-lint checks.
- Production Readiness:
  - Failure mode: losing a scope, interaction, or layout invariant
  - JP1/AJS compatibility: job-group and root-jobnet meaning unchanged
  - Large or malformed input risk: existing large-graph constraints preserved
  - Desktop/web impact: shared viewer behavior remains unchanged
  - README/docs impact: requirements index and navigation references change
  - CHANGELOG impact: none; no observable behavior changes
- Approval Boundary: flow requirement files, navigation references,
  requirements index, and feature traceability only.
- Dependencies: Slice 1
- Risks: misclassifying an observable interaction as removable UI detail;
  duplicating search semantics with the deferred search decision.
- Out of Scope: graph DTOs, layout code, React components, search runtime,
  viewer styling, or new interaction behavior.

### Slice 5: Separate Semantic Comparison From Report Presentation

- Status: Approved
- Scope:
  - rename `uc-compare-semantic-diff.md` to
    `uc-build-semantic-diff.md` for identity matching, differences,
    confirmation findings, schedule scope, and uncomputed information
  - create `uc-present-semantic-diff-report.md` for Markdown generation,
    localization, VS Code display, explicit copy, empty states, and limitations
  - retain schedule comparison inside semantic diff for the current supported
    scope
  - finalize the requirements index, repository-local references, and
    traceability mapping for all reorganized documents
- User / Domain Value: semantic comparison is reusable independently of its
  current report surface, while the report workflow remains an explicit user
  purpose.
- Cohesive Change Group: semantic-diff construction, report presentation,
  command-facing documentation references, final taxonomy, and traceability.
- Acceptance:
  - comparison and report responsibilities are not mixed
  - all existing scenarios, DAG assumptions, copy behavior, localization, and
    limitations remain represented
  - the title and filename consistently use `Build Semantic Diff`
  - no stale reference to a moved, removed, consolidated, or renamed
    requirement file remains
- Validation:
  - scenario-by-scenario preservation review
  - targeted repository search for every old path and stale title
  - `rtk pnpm run qlty`
  - `rtk pnpm run lint:md`
  - `rtk git diff --check`
- Traceability: the current semantic-diff use case and all reorganized paths to
  SPECS Requirements 3, 5, and 6; proven by scenario, stale-reference, qlty,
  docs-lint, and diff checks.
- Production Readiness:
  - Failure mode: dropping a comparison limitation or explicit-copy safeguard
  - JP1/AJS compatibility: semantic and schedule comparison scope unchanged
  - Large or malformed input risk: existing comparison constraints preserved
  - Desktop/web impact: report and comparison behavior remain host-compatible
  - README/docs impact: final requirements indexes and links updated
  - CHANGELOG impact: none; documentation taxonomy changes only
- Approval Boundary: semantic-diff requirement files, repository-local
  Markdown references, requirements indexes, feature traceability, and final
  docs-only validation fixes.
- Dependencies: Slices 1 through 4
- Risks: losing report-specific safeguards during extraction; overlooking a
  stale repository-local link.
- Out of Scope: semantic-diff implementation, report renderer, commands,
  clipboard behavior, schedule support expansion, CLI, GitHub Action, or
  Webview additions.

## Traceability

- TRACEABILITY.md required: yes
- Reason: five slices move, consolidate, or split durable requirement contracts
  and need an explicit old-to-new document and validation mapping.

## Cross-Slice Dependencies

- Slice 1 establishes the destination taxonomy and normative domain-rule
  ownership used by all later consumer documents.
- Slices 2, 3, and 4 are independent after Slice 1 and may be approved
  separately, but should be implemented sequentially to keep reference review
  simple.
- Slice 5 performs the final repository-wide stale-reference and taxonomy check
  after all preceding document paths are settled.

## Feature-Level Risks

- Normative JP1 parameter meaning could be lost or duplicated during moves.
- An observable viewer or report behavior could be mistaken for an
  implementation detail.
- Markdown links or plain-text document references could remain stale.
- A docs-only branch must not acquire runtime, test, configuration, or
  generated-artifact changes.

## Use-Case Back-Propagation

- This feature's implementation is the durable documentation update itself.
- Feature Exit must confirm that no reusable taxonomy decision remains only in
  the feature folder.
- `docs/specs/roadmap.md` changes only to retain the shared-search trigger as a
  future decision; repository sequencing otherwise remains unchanged.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates: Planned in Slices 1 through 5
- Open risks: requirement loss, semantic duplication, misclassification, and
  stale references.

## Validation

- [ ] Run targeted old-path and implementation-detail searches per slice.
- [ ] Run `rtk pnpm run qlty` after the final slice.
- [ ] Run `rtk pnpm run lint:md` per slice and after the final slice.
- [ ] Run `rtk git diff --check` per slice and after the final slice.
- [ ] Confirm only docs-only paths changed.

## Notes

- No runtime tests or builds are required because the approved scope is
  documentation-only.
- Keep temporary migration notes in this feature folder and out of durable
  requirement documents.
