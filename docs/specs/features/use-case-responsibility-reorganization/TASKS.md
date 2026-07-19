# Feature Tasks: Use-Case Responsibility Reorganization

## Agent Brief

- Purpose: reorganize requirement documents by stable responsibility without
  changing runtime behavior, while correcting durable parameter requirements
  to the authoritative version 13 manual.
- Approved or active slice: Slices 1 through 9 are complete; Slice 10 is
  approved and active.
- Do not: edit runtime code, tests, configuration, or generated artifacts.
- Do not: change existing JP1/AJS runtime or extension behavior; implementation
  conformance is independent follow-up.
- Read first: `SPECS.md`, this file, and
  `docs/requirements/use-cases/README.md`.
- Read `TRACEABILITY.md` when checking slice coverage and moved references.
- Validate each slice with targeted reference checks and docs lint; run the
  full docs-only validation before feature exit.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Review state: an additional review reopened Feature Exit because a Unit List
  projection rule is incorrectly owned as a shared Domain Rule.
- Next decision: implement Slice 10 with `sdd-implement-task`.

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

- Status: Approved
- Planning scope: preserve completed Slices 1 through 9 and correct the
  additional QUEUE transfer-projection ownership finding without changing
  runtime behavior or JP1/AJS interpretation.
- Review status: Reviewed for proposed Slice 10
- Human approval: Approved for Slice 10
- Active implementation slice: Slice 10

## Human Approval

- Status: Approved
- Approved at: Slice 10 approved in the current conversation
- Approved scope: Slice 10 within its recorded approval boundary; Slices 1
  through 9 remain complete.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

## Replanning Trigger

- Source: `Use-Case Responsibility Reorganization レビュー修正指示書`
- Finding labels: RF1 through RF7 refer to that review document; R1 through
  R10 in `TRACEABILITY.md` refer to feature requirements in `SPECS.md`.
- Gap: the initial Feature Exit evidence did not prove deterministic rule
  meaning, exact consumer dependencies, flow layout ownership, or
  requirement-level migration completeness.
- Decision: reopen Feature Exit and add only the four correction slices below;
  preserve completed Slices 1 through 5 unchanged.
- Slice 7 discovery: the official version 13 Command Reference defines the
  yearly `cy=(n,y)` range as `1..9`, while current diagnostics accept and report
  `1..10`.
- Human decision: official version 13 requirements are authoritative. Durable
  rules must state the official value; every implementation mismatch is
  deferred to an independent conformance feature rather than fixed here.
- Additional source: `Use-Case Responsibility Reorganization
追加レビュー修正指示書`.
- Additional gap: `JP1-PARAM-TRANSFER-QUEUE-OPERATION-001` describes only the
  Unit List field projection and therefore violates the shared-meaning Domain
  Rule boundary established by Slice 1 and Slice 6.
- Replanning decision: add one docs-only ownership-correction slice, preserve
  completed Slices 1 through 9, and rerun Feature Exit only after the revised
  rule-ID totals and migration evidence are complete.

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

- Status: Complete
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
- Implementation Feedback: separating the triggers was straightforward, but
  preserving the large semantic set required explicit domain-rule IDs. The
  planned family-level grouping was sufficient and did not require separate
  use cases or a scope change.
- Out of Scope: diagnostic or hover runtime logic, new validation rules, VS
  Code adapters, localization resources, or executable specifications.

### Slice 4: Separate Flow Construction From Exploration

- Status: Complete
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
- Implementation Feedback: construction and exploration separated without
  ambiguity once observable layout invariants stayed with graph construction.
  Responsive collapse remained a user interaction while rail and card details
  were safely removed as presentation specifications.
- Out of Scope: graph DTOs, layout code, React components, search runtime,
  viewer styling, or new interaction behavior.

### Slice 5: Separate Semantic Comparison From Report Presentation

- Status: Complete
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
- Implementation Feedback: comparison and report scenarios separated cleanly.
  Adding explicit English fallback, unsupported-content, and empty-state report
  scenarios made the existing presentation rules easier to verify without
  expanding runtime behavior.
- Out of Scope: semantic-diff implementation, report renderer, commands,
  clipboard behavior, schedule support expansion, CLI, GitHub Action, or
  Webview additions.

### Slice 6: Complete Unit-List Parameter Contracts

- Status: Complete
- Scope:
  - make the six Unit List projection rule IDs deterministic with exact
    parameters, unit types, applicability, exclusions, raw/effective behavior,
    defaults or supported fields, and official JP1/AJS3 version 13 references
  - add an explicit `Consumed Domain Rules` list to `uc-view-unit-list.md`
  - remove generic event, file-monitoring, and interval-control rule references
    from Unit List scenarios without duplicating normative values
  - correct `uc-show-parameter-hover.md` to state that current hover returns
    localized syntax and consumes no `JP1-PARAM-*` effective-value rule IDs
- User / Domain Value: list projections have deterministic, reviewable JP1/AJS
  meaning, while Hover no longer claims a semantic dependency it does not use.
- Cohesive Change Group: the six list-related rules, Unit List consumption, and
  the current Hover boundary.
- Acceptance:
  - `JP1-PARAM-SCHEDULE-WC-WT-001`,
    `JP1-PARAM-WAIT-ETS-DEFAULT-001`,
    `JP1-PARAM-EVENT-ARRIVAL-DEFAULT-001`,
    `JP1-PARAM-FILE-MONITOR-DEFAULT-001`,
    `JP1-PARAM-INTERVAL-CONTROL-DEFAULT-001`, and
    `JP1-PARAM-TRANSFER-QUEUE-OPERATION-001` are self-contained and source-backed
  - Unit List explicitly references all six IDs and redefines none of them
  - Hover explicitly records no current rule-ID dependency
- Validation:
  - compare each rule with the official Hitachi JP1/AJS3 version 13 Command
    Reference and current repository behavior evidence
  - verify all six definitions and Unit List references by exact-ID search
  - verify Hover implementation and tests remain syntax-only by read-only
    inspection
  - `rtk pnpm run lint:md`; `rtk git diff --check`
- Traceability: review RF1 and RF4 to SPECS deterministic-rule and explicit-
  consumer requirements; proven by six rule records, source links, and exact-ID
  reference checks.
- Production Readiness:
  - Failure mode: documenting a value or unit family broader than current
    behavior or the official manual
  - JP1/AJS compatibility: documentation must preserve current v13 behavior;
    any source/implementation mismatch stops the slice for human decision
  - Large or malformed input risk: none; documentation-only
  - Desktop/web impact: none
  - README/docs impact: domain rule, Unit List, Hover, and traceability only
  - CHANGELOG impact: none unless review discovers an actual behavior mismatch
- Approval Boundary: the six named rule records, `uc-view-unit-list.md`,
  `uc-show-parameter-hover.md`, and feature traceability/evidence.
- Dependencies: completed Slices 1 through 5
- Risks: official wording may distinguish unit families more narrowly than
  current generalized rule IDs.
- Implementation Feedback: the six-rule boundary matched the Unit List's
  current default-aware projections. Read-only implementation inspection also
  confirmed that Hover is syntax-only, so recording no current rule-ID
  dependency avoided inventing a semantic consumer.
- Out of Scope: runtime defaults, list projection code, hover code, tests,
  additional parameter families, or behavior correction.

### Slice 7: Complete Supported Diagnostic Contracts

- Status: Complete
- Scope:
  - make all 25 IDs under `Diagnostic Interpretation Rules` deterministic using
    exact unit families, parameters, conditions, values, ranges, byte lengths,
    exceptions, and official JP1/AJS3 version 13 references
  - split the durable parameter rule into family files only if needed for
    readability while preserving one ID-to-body owner and one index
  - add an explicit consumed-ID inventory to
    `uc-diagnose-ajs-definition.md`
  - limit diagnostic guarantees to supported rule IDs, state that unsupported
    rules are not validated, and preserve compatible-ISAM exclusions
  - use the official version 13 manual as the normative source when current
    diagnostics differ
  - record every discovered implementation mismatch, beginning with yearly
    `cy=(n,y)` accepting `1..10` instead of official `1..9`, as an actionable
    independent-feature entry in `docs/specs/roadmap.md`
- User / Domain Value: every supported diagnostic has one deterministic JP1/AJS
  rule, and the diagnostic guarantee cannot be mistaken for full manual
  coverage.
- Cohesive Change Group: the complete supported diagnostic rule registry and
  the Use Case that reports those violations.
- Acceptance:
  - all 25 diagnostic IDs have one source-backed normative body
  - every diagnostic ID is explicitly referenced by the Diagnose Use Case
  - no `documented range`, `supported family`, or equivalent placeholder is
    left without exact content or a direct normative subdocument reference
  - Goal, Outputs, Rules, scenarios, supported families, and acceptance notes
    consistently limit coverage to supported rule IDs
  - durable rule values match the official version 13 source even when current
    runtime behavior differs
  - every discovered runtime mismatch names the parameter, official rule,
    current implementation evidence, and independent-feature outcome
- Validation:
  - compare each ID first against official v13 manual sections, then inspect
    existing diagnostic rules/tests to inventory conformance gaps
  - exact-ID checks for defined, referenced, duplicate, and undefined IDs
  - content review for concrete values, unit types, exceptions, and sources
  - `rtk pnpm run lint:md`; `rtk git diff --check`
- Traceability: review RF1, RF3, and RF4 to SPECS deterministic-rule, diagnostic-
  scope, and explicit-consumer requirements; proven by the 25-ID inventory and
  diagnostic mapping.
- Production Readiness:
  - Failure mode: allowing current implementation behavior to override the
    official contract, or discovering a mismatch without recording follow-up
  - JP1/AJS compatibility: requirements target official version 13; runtime is
    unchanged here, and each mismatch becomes independent conformance work
  - Large or malformed input risk: existing diagnostic safety wording remains
  - Desktop/web impact: none
  - README/docs impact: parameter rule files/index, Diagnose Use Case, and
    traceability only
  - CHANGELOG impact: none in this docs-only slice; the independent runtime-
    conformance feature evaluates its user-visible diagnostic correction
- Approval Boundary: the 25 existing diagnostic rule IDs, optional family
  files and their index under `docs/requirements/domain-rules/`, Diagnose Use
  Case, the minimum actionable conformance entry in `docs/specs/roadmap.md`,
  and feature traceability/evidence.
- Dependencies: Slice 6 establishes the deterministic rule format
- Risks: manual sections may reveal additional implementation mismatches or
  that one current rule ID combines multiple unit-specific meanings. Each
  mismatch must be recorded, and any documentation-only ID split still
  requires review when the approved boundary no longer covers it.
- Implementation Feedback: separating the 25 diagnostic rules into one family-
  organized normative file kept rule IDs uniquely owned without overloading the
  shared interpretation overview. Official-first comparison exposed the yearly
  cycle mismatch early and made the independent conformance boundary explicit.
- Out of Scope: new diagnostics, changed diagnostic behavior or messages,
  runtime code, tests, compatible-ISAM support, or new product-version scope.

### Slice 8: Define Flow Layout Ownership

- Status: Complete
- Scope:
  - adopt ownership Policy A in `uc-build-flow-graph.md`
  - define application-owned stable graph structure, containment, ordering,
    placement constraints, and affected-subtree scope
  - define presentation-owned absolute coordinates, rendered bounds, panel
    dimensions, viewport fitting, and UI-library layout values
  - keep non-overlap, unaffected-region stability, and subtree-relative-
    position behavior observable without duplicating exploration ownership
  - adjust `uc-explore-flow-graph.md` only where viewport ownership must be
    cross-referenced
- User / Domain Value: implementers can place layout logic at the correct
  boundary without weakening user-visible expansion stability.
- Cohesive Change Group: Flow construction constraints and the corresponding
  exploration/viewer obligations.
- Acceptance:
  - application and presentation ownership are explicit and non-overlapping
  - no UI library, DOM, component, or implementation-file ownership appears
  - observable non-overlap and position stability remain intact
  - Explore owns user interaction and viewport behavior, not graph constraints
- Validation:
  - responsibility matrix review across both Flow use cases
  - targeted search for UI-library, DOM, component, and file-path details
  - scenario comparison against the pre-reorganization Flow contract
  - `rtk pnpm run lint:md`; `rtk git diff --check`
- Traceability: review RF2 to SPECS flow-boundary requirement; proven by the
  ownership matrix and preserved scenario mapping.
- Production Readiness:
  - Failure mode: assigning the same layout guarantee to both layers or dropping
    a user-visible invariant
  - JP1/AJS compatibility: no definition or scope behavior change
  - Large or malformed input risk: existing large/deep graph constraints remain
  - Desktop/web impact: the same boundary applies to both hosts
  - README/docs impact: two Flow use cases and traceability only
  - CHANGELOG impact: none; responsibility clarification only
- Approval Boundary: `uc-build-flow-graph.md`, the minimum corresponding
  `uc-explore-flow-graph.md` text, and feature evidence.
- Dependencies: completed Slice 4
- Risks: placement constraints must stay abstract enough to avoid restating the
  current presentation algorithm.
- Implementation Feedback: the three-owner matrix was sufficient to preserve
  the old expansion invariants while separating application constraints from
  presentation geometry and exploration-owned viewport behavior. No additional
  Viewer specification or approval boundary was needed.
- Out of Scope: graph DTO/code changes, layout implementation, tests, viewer
  behavior, coordinates, styling, or new graph capabilities.

### Slice 9: Prove Requirement Migration And Final Validation

- Status: Complete
- Scope:
  - replace file-level migration evidence with requirement-level mappings for
    Unit List, Editor Feedback, Flow Graph, Semantic Diff, and Parameter
    Interpretation
  - classify each old scenario/rule/detail as Equivalent, Moved, Consolidated,
    Split, Reworded without semantic change, Intentionally removed as
    implementation detail, or Deferred as a future design decision
  - define the counting unit and record old requirements reviewed, migrated,
    intentionally removed, and unmapped totals
  - record the validated candidate commit SHA, validation commands/results,
    stale-link/path count, undefined referenced rule IDs, unreferenced defined
    rule IDs, and duplicate normative rule owners
  - permit one evidence-only commit after the validated candidate; that commit
    may change only feature-local evidence and state, and must identify the
    candidate SHA it records
  - synchronize Agent Brief, plan state, and Feature Exit readiness
- User / Domain Value: reviewers can reproduce the claim that reorganization
  preserved behavior and left no orphaned or ambiguous requirement.
- Cohesive Change Group: transient migration matrix, reproducible validation
  evidence, and current SDD state.
- Acceptance:
  - every old scenario and rule has exactly one disposition and owner
  - intentional removals and deferrals include reasons
  - unmapped requirements, broken durable links, undefined referenced IDs, and
    duplicate normative owners are zero
  - validation evidence names the exact validated candidate commit and counting
    method; any later evidence-only commit is explicitly distinguished
  - TASKS current-state sections agree
- Validation:
  - compare baseline commit `1fc23fed` with the final branch documents
  - distinguish responsibility-preserving moves from official-contract
    corrections and their deferred runtime conformance entries
  - run exact old-path, link-target, rule-ID definition/reference, and duplicate-
    owner checks
  - `rtk pnpm run qlty`; `rtk pnpm run lint:md`; `rtk git diff --check`
  - confirm `git diff --name-only main...HEAD` stays docs-only
- Traceability: review RF5, RF6, and RF7 to SPECS migration-evidence and
  reproducible-validation requirements; proven by the completed matrix and
  validation record.
- Production Readiness:
  - Failure mode: false completion caused by an undefined counting unit or
    stale validation target
  - JP1/AJS compatibility: the migration matrix must distinguish unchanged
    semantics from official-contract corrections and link every runtime gap to
    deferred conformance work
  - Large or malformed input risk: none; documentation-only
  - Desktop/web impact: zero runtime impact confirmed by docs-only diff
  - README/docs impact: feature-local evidence and any final link corrections
  - CHANGELOG impact: none unless a preceding slice discovers behavior drift
- Approval Boundary: feature-local SDD evidence/state, an evidence-only commit
  after the validated candidate, and minimal durable-link corrections required
  to reach zero unresolved references.
- Dependencies: Slices 6 through 8
- Risks: a previously missed requirement or source mismatch triggers another
  focused replan rather than being forced into an incorrect mapping.
- Implementation Feedback: defining the counting unit before classification
  made the migration total reproducible and separated responsibility-preserving
  moves from official-contract corrections. The existing Slice 8 commit was a
  sufficient validation candidate, so Slice 9 required only feature-local
  evidence and no durable-link correction.
- Out of Scope: permanent migration-history documentation, runtime code/tests,
  generated artifacts, configuration, or unrelated wording cleanup.

### Slice 10: Correct QUEUE Transfer Projection Ownership

- Status: Approved
- Scope:
  - remove `JP1-PARAM-TRANSFER-QUEUE-OPERATION-001` and its presentation-only
    normative body from `interpret-jp1-parameters.md`
  - remove that ID from the Unit List consumed-rule list and scenario
  - state the unchanged QUEUE and recovery QUEUE source/destination inclusion
    and transfer-operation exclusion as Unit List projection rules
  - preserve the existing QUEUE projection scenario without a shared rule-ID
    dependency
  - split the `ULV-S07` migration evidence from its grouped matrix row so Unit
    List is the explicit consumer-specific owner
  - refresh the Unit List consumer count from six IDs to five and the complete
    Domain Rule count from 31 to 30
  - mark the Slice 9 candidate evidence superseded; Feature Exit must validate
    the post-Slice-10 commit SHA
- User / Domain Value: shared Domain Rules contain only reusable JP1/AJS
  meaning, while Unit List owns its consumer-specific display projection.
- Cohesive Change Group: the obsolete Domain Rule definition, its sole consumer
  reference, the preserved Unit List projection contract, and evidence proving
  unique ownership and zero orphaned IDs.
- Acceptance:
  - the deleted ID has zero definitions and zero consumer references in durable
    requirements; feature-local review history is excluded from the rule set
  - Unit List rules and the existing scenario explicitly preserve source and
    destination display while excluding transfer-operation display for `qj`
    and `rq`
  - no new Domain Rule is created solely for display-column inclusion
  - Unit List consumes exactly five shared Domain Rule IDs and the complete
    defined/reference set contains exactly 30 IDs
  - undefined, duplicate-owner, and unreferenced Domain Rule IDs are zero
  - `ULV-S07` has an explicit Consolidated or Moved mapping to Unit List and
    total migrated, removed, deferred, and unmapped counts remain consistent
  - prior candidate evidence is not presented as final after durable docs
    change
- Validation:
  - exact search for the deleted ID across durable Domain Rules and Use Cases
  - exact definition/reference/duplicate/unreferenced rule-ID set comparison
  - targeted review of Unit List rules and QUEUE scenario for `qj` and `rq`
  - migration-matrix row and total comparison, including zero unmapped items
  - repository-local Markdown link-target check
  - `rtk pnpm run qlty`; `rtk pnpm run lint:md`; `rtk git diff --check`
  - confirm the branch diff remains docs-only
- Traceability: additional review R1-R6 to SPECS normative-owner, shared-
  semantic, consumer-reference, behavior-preservation, and reproducible-
  evidence requirements; proven by Unit List text, zero deleted-ID references,
  rule-ID set equality, and updated `ULV-S07` mapping.
- Production Readiness:
  - Failure mode: removing the ID without preserving the projection contract,
    or leaving stale evidence and references
  - JP1/AJS compatibility: no meaning changes; transfer syntax, validity,
    dependency, and diagnostic rules remain untouched
  - Large or malformed input risk: none; documentation-only
  - Desktop/web impact: none; both hosts retain the same documented projection
  - README/docs impact: two durable requirement documents and feature-local
    evidence/state only
  - CHANGELOG impact: none; observable behavior and documented output remain
    unchanged
- Approval Boundary: `interpret-jp1-parameters.md`, `uc-view-unit-list.md`,
  feature `TASKS.md` and `TRACEABILITY.md`, and only minimal reference/evidence
  corrections required to reach zero integrity failures.
- Dependencies: completed Slices 6 and 9
- Risks: removing one ID changes the recorded definition/reference totals and
  invalidates the prior final-candidate SHA even though behavior is unchanged.
- Out of Scope: runtime code, DTOs, tests, columns, parser behavior, transfer
  validity-rule design, diagnostics, official-manual conformance fixes, new
  Domain Rule IDs, or changes to visible values.

## Traceability

- TRACEABILITY.md required: yes
- Reason: completed Slices 1 through 5 moved, consolidated, or split durable
  contracts; review findings require requirement-level mapping and
  reproducible evidence through proposed Slice 10.

## Cross-Slice Dependencies

- Slice 1 establishes the destination taxonomy and normative domain-rule
  ownership used by all later consumer documents.
- Slices 2, 3, and 4 are independent after Slice 1 and may be approved
  separately, but should be implemented sequentially to keep reference review
  simple.
- Slice 5 performs the final repository-wide stale-reference and taxonomy check
  after all preceding document paths are settled.
- Slice 6 establishes the deterministic rule-record format and corrects Unit
  List and Hover consumer boundaries.
- Slice 7 completes the diagnostic rule registry using the Slice 6 format.
- Slice 8 is independent of parameter work after completed Slice 4, but runs
  before final evidence so its ownership mapping is included.
- Slice 9 depends on Slices 6 through 8 and is the only slice that may restore
  Feature Exit readiness before the additional review.
- Slice 10 depends on the Slice 6 ownership boundary and Slice 9 migration
  evidence; it must complete before Feature Exit is rerun.

## Feature-Level Risks

- Normative JP1 parameter meaning could be lost or duplicated during moves.
- An observable viewer or report behavior could be mistaken for an
  implementation detail.
- Markdown links or plain-text document references could remain stale.
- A docs-only branch must not acquire runtime, test, configuration, or
  generated-artifact changes.
- Official manual wording may expose a mismatch between current implementation
  and the provisional durable rule. The official rule remains normative; each
  implementation gap must be made actionable as independent follow-up rather
  than concealed or fixed inside this docs-only feature.
- Migration totals are meaningless unless Slice 9 defines the counting unit
  before recording results.
- Removing the presentation-only rule ID without refreshing exact-set evidence
  could leave Feature Exit relying on a stale candidate and stale totals.

## Use-Case Back-Propagation

- This feature's implementation is the durable documentation update itself.
- Deterministic parameter meaning and Flow ownership remain durable; migration
  history and validation counts remain transient until closure.
- QUEUE transfer column inclusion and exclusion are consumer-specific Unit List
  behavior, not shared parameter meaning.
- `docs/specs/roadmap.md` retains the shared-search trigger and records
  independent runtime-conformance work discovered while making official
  parameter requirements deterministic.

## Feature Exit

- Definition of Done status: not satisfied; proposed Slice 10 requires review,
  approval, implementation, and completion approval
- Durable documentation updates: Slices 1 through 9 complete; Slice 10 pending
- Open risk: stale QUEUE projection ownership and final-validation evidence

## Validation

- [ ] Complete deterministic definitions and exact consumer references.
- [ ] Complete Flow ownership clarification.
- [ ] Complete requirement-level migration mapping.
- [ ] Record reproducible final validation evidence for the final commit.
- [ ] Correct QUEUE projection ownership and refresh final evidence in Slice 10.
- [ ] Re-run Feature Exit after Slice 10 completes.

## Notes

- No runtime tests or builds are required because the approved scope is
  documentation-only.
- Keep temporary migration notes in this feature folder and out of durable
  requirement documents.
