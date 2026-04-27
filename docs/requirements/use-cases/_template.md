# UC: Use Case Name

## Goal

<!-- What user or system outcome this use case enables. -->

## Trigger

<!-- What starts the use case. -->

## Inputs

-

## Outputs

-

## Rules

<!--
Invariant constraints, boundaries, must-not statements, compatibility
requirements, and policy decisions that apply across scenarios.
-->

-

## Behavioral Scenarios (Gherkin)

Use scenarios only for behavior contracts that benefit from Given / When /
Then clarity. Keep one behavior per scenario, use domain language, and avoid
implementation details or long UI operation scripts.

```gherkin
Feature: Flow graph rendering

Scenario: Hidden jobs are excluded by filter
  Given a definition containing hidden jobs
  When a hidden-job filter is applied
  Then hidden jobs are not displayed
```

## Acceptance Notes

<!--
Supplemental acceptance or validation notes that are not already expressed by
Behavioral Scenarios, such as fixture strategy, migration caveats, or
cross-host checks.
-->

-

## Risks Or Edge Cases

<!-- Unresolved hazards, rare inputs, or focused future verification needs. -->

-
