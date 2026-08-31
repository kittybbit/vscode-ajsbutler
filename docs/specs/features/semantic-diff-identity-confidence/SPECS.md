# Feature Specification: Semantic Diff Identity Confidence

## Purpose

Improve Semantic Diff rename and move confidence by deriving deterministic,
unit-type-specific identity fingerprints and carrying reviewable evidence for
every identity decision without weakening the existing ambiguity safeguards.

## Minimal Context

- Current decision: define the identity-strategy and evidence boundary that
  makes exact, fingerprint, candidate, added, and removed decisions
  explainable and safer to extend.
- Feature kind: roadmap feature.
- Selected feature folder:
  `docs/specs/features/semantic-diff-identity-confidence/`.
- Read first: this file, `TASKS.md`, and
  `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- Read `TRACEABILITY.md` when checking requirement, slice, and validation
  coverage.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap item: `Strengthen Semantic Diff Identity Confidence`, Wave 1 of
  `docs/specs/roadmap.md`.
- Proposal sources: R-1, separate the current monolithic fingerprint into an
  identity-fingerprint factory; E-1, use unit-type-specific fingerprints and
  expose their decision evidence while preserving conservative matching.
- Source use case:
  `docs/requirements/use-cases/uc-build-semantic-diff.md`.
- Report consumer use case:
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`.
- JP1/AJS reference basis: the repository's normative JP1/AJS3 version 13
  Definition File Reference basis. The current normalized parameter contract,
  unit-list projections, and diagnostic rules establish repository evidence
  for command jobs (`te` versus `sc` plus `prm`), JP1 event reception jobs
  (`evwj` and `revwj`), and file-monitoring jobs (`flwj` and `rflwj`). Planning
  must verify the exact strategy field sets and effective-value treatment
  against the normative version 13 definitions before plan review.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- R1: Identity fingerprint construction must select an explicit strategy from
  the normalized unit type and supported definition form rather than
  serializing nearly every unit parameter into one opaque string.
- R2: The first supported strategy set must distinguish command-text jobs,
  executable-file-plus-arguments jobs, JP1 event reception-monitoring jobs,
  and file-monitoring jobs. Recovery counterparts must use the same semantic
  strategy as their corresponding ordinary unit type while retaining unit
  type as identity evidence.
- R3: Each fingerprint decision must provide deterministic structured evidence
  containing the strategy identifier, unit type, canonical field identifiers,
  and canonical field values used by matching. Definition order must not
  affect this evidence.
- R4: Exact identity matching remains the first matching stage and keeps the
  existing jobnet-relative-path and parent-jobnet/name/type rules. Fingerprint
  matching applies only to units left unmatched by exact identity.
- R5: Automatic rename or move confirmation requires exactly one unmatched
  unit on each side with the same unit type, strategy, and canonical
  fingerprint fields. Similarity or partial-field agreement must not confirm
  identity.
- R6: When multiple units share matching fingerprint evidence, the result must
  retain all applicable candidates and the ambiguity evidence without
  selecting one automatically.
- R7: A rename or move that changes its selected fingerprint evidence remains
  a removal and addition. Manual correspondence and similarity-based recovery
  are not introduced by this feature.
- R8: The neutral Semantic Diff result must identify the rule and evidence
  behind exact, confirmed fingerprint, candidate, added, and removed outcomes.
  Presentation may localize labels and explanations but must not reconstruct
  identity rules or change their meaning.
- R9: Unsupported unit types or definition forms must follow an explicit,
  conservative fallback established during Planning. The fallback must not
  increase automatic matches compared with the current behavior without
  reference-backed evidence and separate acceptance coverage.
- R10: Identity evidence must remain host-neutral and serializable, must not be
  emitted through telemetry, and must avoid parser-internal or VS Code types.

## Behavioral Scenarios

```gherkin
Feature: Explainable Semantic Diff identity matching

Scenario: Command definition forms use distinct fingerprint strategies
  Given one job uses command text and another uses an executable file and arguments
  When identity fingerprint evidence is created
  Then each job uses the strategy for its definition form
  And its evidence contains only that strategy's canonical identity fields

Scenario: One-to-one strategy evidence confirms a rename or move
  Given one unmatched unit on each side has the same unit type and fingerprint evidence
  When Semantic Diff determines correspondence
  Then the rename or move is confirmed
  And the result includes the strategy, matched fields, rule, and confirmed status

Scenario: Multiple strategy matches remain candidates
  Given multiple unmatched units share the same fingerprint evidence
  When Semantic Diff determines correspondence
  Then no candidate is automatically selected
  And the result includes the ambiguity and applicable evidence

Scenario: Fingerprint evidence changes during a rename
  Given a unit name changes together with an identity-bearing strategy field
  When Semantic Diff determines correspondence
  Then the before unit is removed
  And the after unit is added
```

## Architecture

- Domain: own strategy selection, canonical fingerprint fields, deterministic
  matching rules, and identity-decision evidence using normalized JP1/AJS
  concepts.
- Application: project domain decisions into host-neutral Semantic Diff DTOs
  without adding presentation wording or reimplementing correspondence.
- Presentation: render or localize identity rationale supplied by the
  application; no identity rule belongs in Markdown or VS Code adapters.
- Infrastructure: no new identity responsibility. Parsing continues to
  normalize definition data through the existing parser boundary.

## Impact Analysis

### Dependency Impact

- Current ownership is concentrated in
  `semanticDiffStructuralRules.ts`, `compareSemanticDiff.ts`, the Semantic Diff
  domain model and DTO, report-data/Markdown projections, and their structural,
  comparison, contract, and report tests.
- The normalized `AjsUnit` parameter evidence is sufficient for the proposed
  boundary; parser changes are not expected. Planning must stop and replan if
  a strategy requires parser-adjacent data or a new normalized semantic field.
- Propagation decision: change strategy creation, correspondence, neutral
  evidence DTOs, and existing report rationale together. Keep schedule,
  confirmation-risk, relation, command workflow, and Flow Viewer behavior
  unchanged except for consuming the same enriched change result.

### Breaking Change Analysis

- User-visible behavior: rename, move, candidate, added, and removed results
  may change where the current broad fingerprint over-matches or under-matches;
  each change must be covered by reference-backed fixtures and visible
  rationale.
- API/DTO/schema compatibility: internal Semantic Diff DTOs will be extended
  with structured identity evidence. Existing fields and meanings should be
  preserved unless Planning proves an atomic migration is required.
- VS Code/web extension compatibility: the same host-neutral result and report
  meaning must be available on desktop and web; no host API is required.
- Changed scenarios: command-form strategy selection, event/file wait strategy
  selection, one-to-one confirmation evidence, candidate ambiguity evidence,
  and fingerprint-changing rename/add-remove behavior.

### Alternative Considerations

- Keep the current all-parameter string and only rename the function: rejected
  because it does not provide unit-type semantics or reviewable evidence.
- Use similarity scoring to recover changed fingerprints: rejected because it
  weakens the durable requirement that similarity cannot confirm identity.
- Add manual correspondence in this feature: rejected because it is a
  separate user workflow and approval boundary.
- Redesign all Semantic Diff output/report modes together: rejected; this
  feature owns identity-decision evidence only. General structured outputs,
  JSON, and report modes belong to the later roadmap feature.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  and `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: manual matching, similarity scoring,
  a parser or normalized-model expansion, schedule or confirmation-risk rule
  changes, new commands or UI, a public JSON/report-mode contract, telemetry,
  or a VS Code compatibility change.

## Compatibility

- VS Code compatibility remains the `package.json` `engines.vscode` contract;
  this feature must not raise the minimum version or depend on a new host API.
- Web extension compatibility: strategy creation and evidence projection must
  remain browser-safe, deterministic, and free of Node built-ins.
- Desktop extension compatibility: desktop uses the same comparison result and
  must not gain desktop-only matching behavior.
- JP1/AJS compatibility: JP1/AJS3 version 13 remains normative. Existing exact
  matches, reorder-insensitivity, one-to-one-only confirmation, ambiguous
  candidates, and add/remove fallback remain compatible unless an explicitly
  reference-backed strategy scenario replaces a current false match.
- Existing definition files remain accepted; this feature changes comparison
  interpretation only and does not change parsing or definition validation.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- A version 13 reference-backed strategy table covers the approved command,
  event-wait, and file-wait unit types and identifies every canonical field,
  effective-value rule, and conservative fallback used by matching.
- Tests demonstrate deterministic evidence and stable matching across
  parameter and definition ordering.
- Tests distinguish command text from executable-file-plus-arguments identity
  and cover ordinary and recovery event/file monitoring unit types.
- Exact matches retain precedence; one-to-one strategy matches confirm rename
  or move; ambiguous matches remain candidates; changed fingerprint evidence
  remains addition and removal.
- Exact, confirmed fingerprint, candidate, added, and removed results expose
  enough structured evidence for existing report presentation without
  re-running identity logic.
- Existing Semantic Diff structural, contract, report, schedule,
  confirmation-risk, Flow Viewer highlight, desktop, and web behavior remains
  compatible outside the approved identity scenarios.
- No Node built-in, parser-internal type, VS Code type, or telemetry field is
  introduced into identity evidence.

## Durable Document Impact

- `docs/requirements/use-cases/uc-build-semantic-diff.md`: expected Feature
  Exit update if the implemented strategy table makes the durable identity
  rules more precise than the current fingerprint contract.
- `docs/requirements/use-cases/uc-present-semantic-diff-report.md`: update only
  if the observable report evidence contract changes; formatting detail stays
  outside durable identity rules.
- `docs/specs/roadmap.md`: no intake update; the selected Wave 1 item and its
  dependency on current regression evidence are already recorded.
- Architecture, context map, glossary, and vision: no update expected because
  the existing domain/application/presentation responsibility split remains.
- README and CHANGELOG: evaluate during Planning and Feature Exit. A CHANGELOG
  entry is expected if user-visible correspondence results or report evidence
  change; README changes are needed only if documented workflow changes.

## Non-Goals

- Manual correspondence, similarity scoring, or interactive candidate choice.
- General Semantic Diff DTO redesign, JSON export, CI output, or Summary/Full/
  Audit report modes.
- Confirmation-required rule expansion, schedule interpretation, or comparison
  source/workflow changes.
- Semantic Diff Explorer or new Flow Viewer interactions.
- Parser changes, JP1/AJS definition-file syntax changes, or support claims for
  product versions other than the repository's normative version 13 target.
- Runtime/environment verification of commands, files, events, hosts, users,
  permissions, or execution history.

## Open Questions

- None blocking Planning. The exact version 13 strategy field table and
  conservative fallback are plan-author decisions that require documented
  reference evidence and independent plan review before approval.
