# SPECS: limit-flow-selector-to-root-jobnets

## Purpose

Temporarily limit flow selector selection to root jobnets while the selector may
still display both job groups and root jobnets.

## Origin

- Feature kind: transient branch feature
- Source:
  user-reported flow selector behavior risk: selecting a job group can display
  root jobnets that do not have display coordinates on top of each other.
- Source use cases:
  docs/requirements/use-cases/uc-build-flow-graph.md and
  docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md
- Related plan: docs/specs/plans.md

## Requirements

- The flow selector may continue to show job groups and root jobnets.
- Only root jobnets are valid selectable flow scopes for this temporary
  feature.
- Job groups must not be selectable as flow scopes while selecting them would
  render coordinate-less root jobnets overlapping each other.
- The change must preserve existing root-jobnet selection behavior.
- The implementation must not introduce parser-internal coupling into UI
  components.

## Behavioral Scenarios

```gherkin
Feature: Flow selector root-jobnet selection boundary

Scenario: Root jobnets remain selectable
  Given the flow selector contains job groups and root jobnets
  When the user selects a root jobnet
  Then the flow graph opens or focuses that root-jobnet scope

Scenario: Job groups are not valid flow scopes
  Given the flow selector contains a job group
  When the user attempts to use that job group as a flow scope
  Then the flow graph does not render coordinate-less root jobnets as
    overlapping nodes
```

## Architecture

- Domain: none expected for the temporary selector boundary.
- Application:
  should remain the preferred place for stable selectable-scope DTO rules if
  implementation investigation shows the selector already consumes an
  application-facing view model.
- Presentation:
  may enforce the temporary root-jobnet-only selectable state at the selector
  boundary without parsing raw AJS grammar output.
- Infrastructure: none expected.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  flow selector presentation, any flow-scope DTO/view-model mapping that feeds
  the selector, flow graph opening/focusing behavior, and related selector or
  graph tests.
- Propagation decision:
  keep graph rendering, nested expansion, list view, CSV export, diagnostics,
  hover, and telemetry behavior unchanged unless implementation investigation
  proves they are directly affected.

### Breaking Change Analysis

- User-visible behavior:
  job groups remain visible in the selector but are not valid selectable flow
  scopes for this temporary feature.
- API/DTO/schema compatibility:
  no public API or persisted schema change expected; any DTO change requires
  impact investigation and approval before implementation.
- VS Code/web extension compatibility:
  desktop and web hosts must keep the same selector behavior.
- Changed scenarios:
  temporary flow selector root-jobnet-only selection scenarios added in this
  feature spec; durable use-case updates are deferred until the final selector
  behavior is decided.

### Alternative Considerations

- Hide job groups from the selector:
  rejected for this temporary feature because the stated behavior keeps job
  groups visible while only root jobnets are selectable.
- Generate or infer coordinates for root jobnets under a selected job group:
  deferred because that is a larger flow layout behavior change.
- Allow job groups and repair overlapping at render time:
  deferred because it broadens the behavior beyond the immediate selector
  boundary.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval:
  hiding job groups, adding inferred coordinates, changing graph layout rules,
  changing parser/domain models, changing persisted DTO schemas, or changing
  behavior outside flow selector selection.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility:
  the selector boundary must work without Node-only APIs and must preserve web
  extension behavior.
- Desktop extension compatibility:
  desktop behavior must match web behavior for visible and selectable selector
  entries.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- A root jobnet remains selectable from the flow selector.
- A job group is not accepted as the active flow graph scope.
- Attempting to use a job group does not produce overlapping coordinate-less
  root jobnets.
- Existing root-jobnet flow rendering remains unchanged.
- Relevant tests or focused verification cover both selectable and
  non-selectable selector entries.
- Desktop and web compatibility impact is reported before implementation.

## Non-Goals

- Redesign the flow selector.
- Hide job groups from the selector.
- Add layout coordinates for root jobnets under a selected job group.
- Change parser output, normalized domain models, CSV export, diagnostics,
  hover, telemetry, or WebAPI import behavior.
- Make a durable repository roadmap commitment before the temporary boundary is
  validated.

## Open Questions

- None for feature intake.
