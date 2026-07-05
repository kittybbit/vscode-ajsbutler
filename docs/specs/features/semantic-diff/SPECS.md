# Feature Specification: Semantic Diff

## Purpose

Compare two JP1/AJS3 job-group definitions as semantic jobnet, unit,
relation, condition, and schedule changes instead of raw text differences.

## Origin

- Source use case:
  docs/requirements/use-cases/uc-compare-job-group-semantic-diff.md
- Roadmap item: semantic definition comparison
- Branch plan: docs/specs/plans.md
- Implementation-slice plan: TASKS.md
- Source instruction: user-provided semantic diff implementation guidance

## Requirements

- Compare definitions at job-group scope.
- Ignore definition-file order differences that do not change JP1/AJS meaning.
- Detect added, removed, renamed, moved, and changed jobnets and units.
- Detect added, removed, and changed relations after unit correspondence has
  been determined.
- Match jobnets, units, and relations deterministically without assuming a
  persistent JP1/AJS unique identifier.
- Separate automatically confirmed rename or move matches from ambiguous
  candidates.
- Display matching rationale for confirmed or candidate rename and move
  results, including matched attributes, changed attributes, and decision
  status.
- Group execution attribute changes into user-facing categories:
  execution environment, execution definition, start condition, end control,
  abnormal-end control, wait condition, external integration, and schedule.
- Detect confirmation-required candidates only when a change may prevent an
  expected start, remove a previously available wait release, make wait
  unbounded, or change a previously established branch path.
- State analysis constraints instead of asserting runtime failure when real
  environment data is outside the compared definitions.
- Display unsupported attributes, uninterpretable conditions, and schedule
  calculation limitations.
- Export a Markdown report at a reviewable granularity for pull requests,
  change-control records, and release approval material.

## Behavioral Scenarios

```gherkin
Feature: Semantic job-group comparison

Scenario: Order-only changes produce no semantic diff
  Given two JP1/AJS3 job-group definitions with the same jobnets, units,
    relations, and attributes
  And only the definition-file order differs
  When semantic comparison is requested
  Then the result contains no semantic changes

Scenario: Stable unit identity is confirmed by parent jobnet, name, and type
  Given a unit exists in both definitions with the same parent jobnet path,
    unit name, and unit type
  When semantic comparison is requested
  Then the unit is treated as the same semantic unit
  And execution attributes are compared as changeable attributes

Scenario: Ambiguous rename candidates are not auto-selected
  Given unmatched before and after units share the same identity fingerprint
  And more than one candidate exists on either side
  When semantic comparison is requested
  Then no single candidate is automatically confirmed
  And the result explains the ambiguity

Scenario: Wait timeout removal requires confirmation
  Given a wait unit has a timeout in the before definition
  And the corresponding after unit removes the timeout
  When semantic comparison is requested
  Then the result includes a confirmation-required item for possible
    unbounded wait
  And the result states that the comparison does not verify external runtime
    conditions
```

## Architecture

- Domain: own semantic comparison concepts, deterministic identity matching,
  change categories, confirmation-required result types, and rule evaluation
  that is independent from VS Code, Git, Webview, React, and UI-library types.
- Application: expose a job-group comparison use case that accepts normalized
  definition inputs and comparison options and returns semantic change DTOs,
  risk/constraint DTOs, unsupported item DTOs, and report-ready structures.
- Presentation: provide commands, views, flow highlighting, and report actions
  using application DTOs without parsing raw AJS grammar output directly.
- Infrastructure: adapt local files or imported definition sources into
  normalized inputs, provide Markdown report writing or copy/save integration,
  and isolate any host-specific desktop/web capabilities.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  new comparison command/view/report surfaces, normalized definition consumers,
  flow highlighting integration, parser/normalization fixtures, application
  use-case tests, and desktop/web host adapters.
- Propagation decision: semantic comparison should build on normalized
  JP1/AJS document boundaries when practical; existing list, flow, CSV,
  diagnostics, hover, WebAPI import, and telemetry behavior remain unchanged
  unless a later approved slice explicitly integrates with them.

### Breaking Change Analysis

- User-visible behavior: adds new semantic diff behavior; existing viewers and
  parser behavior must remain compatible.
- API/DTO/schema compatibility: new comparison DTOs are expected; existing DTOs
  should not be repurposed in a breaking way.
- VS Code/web extension compatibility: shared comparison logic must avoid
  direct `vscode`, filesystem, process, and Node-only imports; host-specific
  report persistence must be isolated.
- Changed scenarios: adds semantic comparison scenarios in
  docs/requirements/use-cases/uc-compare-job-group-semantic-diff.md.

### Alternative Considerations

- Text diff only: rejected because textual ordering changes can obscure the
  JP1/AJS meaning and miss semantic execution-risk changes.
- Similarity-score automatic matching: rejected because deterministic,
  explainable matching must distinguish confirmed matches from candidates.
- Implement all phases in one slice: rejected because structure matching,
  condition analysis, and schedule calculation carry different risk and should
  be approved independently.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval: adding AI advice, manual match
  persistence, real-environment validation, cyclic-dependency detection,
  write/update behavior, changing existing parser semantics, or raising VS
  Code compatibility.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: domain and application comparison logic must be
  host-neutral; web-host report export must not assume Node-only filesystem or
  process APIs.
- Desktop extension compatibility: desktop commands and report save flows may
  use VS Code-facing adapters, with raw host APIs isolated outside domain and
  application code.
- JP1/AJS compatibility: JP1/AJS3 version 13 remains the normative target for
  new parameter and command semantics unless the implementation plan records a
  narrower manual reference.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Structure comparison ignores order-only changes.
- Exact matching confirms jobnets by job-group-relative full path and type.
- Exact matching confirms units by parent jobnet full path, unit name, and
  unit type.
- Unit name alone never confirms identity.
- Relation comparison uses matched unit correspondence before evaluating
  relation changes.
- Identity fingerprints are deterministic and include only attributes expected
  to remain stable for rename or move detection.
- A rename or move is auto-confirmed only when both sides have a single
  unmatched unit for the same fingerprint and unit type.
- Ambiguous candidates are displayed without automatic selection.
- Rename plus fingerprint-changing execution-definition changes are initially
  treated as deletion and addition.
- Confirmation-required items include target, change content, rationale,
  related elements where available, and analysis constraints.
- Missing predecessor units, missing successor units, or disconnected relations
  alone are not reported as problems.
- Execution user and resource group changes are displayed as execution
  environment changes without asserting target-host existence, permission, or
  resource contention failures.
- Schedule comparison, when implemented, displays the comparison period,
  added/deleted/changed run schedules, root jobnets with no calculated run
  schedules, and calculation-failure reasons.
- Unsupported attributes and uncalculated schedules are summarized in the
  comparison result and report.
- Markdown reports include semantic changes, confirmation-required items,
  matching rationale, unsupported items, calculation constraints, and the
  comparison period when schedule comparison is in scope.

## Non-Goals

- AI-generated advice, remediation, or risk scoring.
- Detecting relation cycles, cyclic waits, or reachability problems solely
  because a terminal unit is unreachable.
- Verifying real environment state such as users, permissions, resource-group
  existence, resource contention, external files, external events, hosts, or
  runtime history.
- Persisted manual correspondence mapping in the initial implementation.
- Updating JP1/AJS definitions or writing changes back to an external system.
- Raising the minimum supported VS Code version.

## Open Questions

- Which exact JP1/AJS3 version 13 manual sections should be cited as normative
  references for relation conditions, wait units, event units, and schedule
  calculation?
- Which later command or UI surfaces, beyond the initial active-editor plus
  before-file picker workflow, should be considered after Phase 1?
- Should Phase 1 Markdown report export be copy-only, save-to-file, or both
  for desktop and web hosts?
- Which schedule elements are supported in the first schedule-comparison slice,
  and which are explicitly reported as uncalculated?
