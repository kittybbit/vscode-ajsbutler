# SPECS: build-flow-graph

## Purpose

Define the application-facing flow graph DTO used by the flow viewer.

## Origin

Source use case: docs/requirements/use-cases/uc-build-flow-graph.md

## Acceptance Criteria

- Graph construction consumes normalized AJS data instead of parser internals.
- Flow presentation can render desktop and web views from stable DTOs.
- Tests preserve graph shape, relation mapping, and important edge cases.

## Implementation Notes

- Keep React Flow-specific styling and interaction state in presentation code.
- Do not reconstruct `UnitEntity` in the flow viewer.
