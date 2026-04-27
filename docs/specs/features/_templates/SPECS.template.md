# Feature Specification: {{Feature Name}}

## Purpose

{{What behavior or implementation boundary this feature defines.}}

## Origin

- Source use case: {{docs/requirements/use-cases/uc-*.md}}
- Related plan: {{PLANS.md}}

## Requirements

- {{requirement}}

## Behavioral Scenarios (optional)

Use Gherkin only for behavior contracts, regression-prone behavior, domain
rules, or bug recurrence prevention. Do not convert architecture, layering,
dependency design, refactor plans, or internal algorithms into scenarios.
When scenarios cover an acceptance note, keep the scenario and remove the
duplicate note.

```gherkin
Feature: {{behavior area}}

Scenario: {{one observable behavior}}
  Given {{domain precondition}}
  When {{domain event or request}}
  Then {{observable outcome}}
```

## Architecture

- Domain: {{responsibility or "none"}}
- Application: {{responsibility or "none"}}
- Presentation: {{responsibility or "none"}}
- Infrastructure: {{responsibility or "none"}}

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  {{impact summary}}
- Propagation decision: {{what must change together and what is intentionally
  unchanged}}

### Breaking Change Analysis

- User-visible behavior: {{none or impact}}
- API/DTO/schema compatibility: {{none or impact}}
- VS Code/web extension compatibility: {{none or impact}}
- Changed scenarios: {{scenario IDs added, changed, removed, or "none"}}

### Alternative Considerations

- {{alternative}}: {{reason accepted or rejected}}

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: {{impact}}
- Desktop extension compatibility: {{impact}}

## Acceptance Criteria

- {{criterion}}

## Non-Goals

- {{non-goal}}

## Open Questions

- {{question or "None"}}
