# Feature Tasks: {{Feature name}}

## Agent Brief

- Purpose: {{intended observable result and slice acceptance reference}}
- Active or approved slice: {{slice and lifecycle state}}
- Decision context: {{relevant SPECS/TASKS sections for the approved scope,
  behavior contract and reusable evidence; add supporting sections only as needed}}
- Validate: use the active slice's checks below.
- Constraints / next decision: {{scope boundary and next gate}}

## Current state

- Lifecycle state: {{state from the SDD Lifecycle State Contract}}
- Next decision / blocker: {{next gate or missing decision; none if absent}}
- Gate evidence: {{review verdict and identity, approval and commit references}}

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Feature PRs / target: {{ordered slice PR references and target branch}}
- Final feature identity: {{complete head and closure patch reference}}
- Closure / merge evidence: {{retained approval/review/validation references,
  closure commit and each PR's actual merge result/commit identity}}

Apply [native stacks](../../README.md#github-standard-stacked-pull-requests).
Keep these as references in the existing plan, not a separate stack state.

## Human Approval

- Status: Pending | Approved
- Approved at: {{none or approval result}}
- Approved scope: {{exact slice boundary}}
- Approved paths: {{explicit product paths and needed validation-support paths}}

Apply [Human Approval](../../README.md#human-approval) and the
[approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Implementation Slices

### Slice 1: {{slice name}}

- Lifecycle state: {{substantiated slice state from the Lifecycle State Contract}}
- Scope and value: {{cohesive change and user/domain value}}
- Acceptance: {{observable or reviewable result}}
- Dependencies / risks / stop conditions: {{only material items}}
- Stack layer: {{order, PR URL/publication update, target and predecessor
  branches, base and current PR-head identities}}
- Validation: {{local evidence and exact PR-head GitHub/CI and applicable Cloud
  gate results; predecessor readiness reference before dependent work}}
- Production readiness: {{relevant failure, JP1/AJS, input-size,
  desktop/web/VS Code, and documentation impact}}
- Approval boundary: {{concrete product and validation-support paths; excluded work}}

#### Validation index

- Identity / result: {{validated content reference; Pass, Not Applicable with
  reason, Missing, or Failed}}
- Coverage: {{changed surfaces, required checks and coverage; omitted checks
  with non-applicability reasons, never reported as Pass}}
- Evidence artifact: {{retained manifest, mechanical detail, and raw outputs}}
- Review / approval / commit: {{exact patch and gate evidence references;
  sole commit executor under the core policy}}
- Missing facts / refresh or exception: {{decision-relevant reason/reference;
  omit when absent}}

Apply the [Evidence Contract](../../evidence.md#evidence-contract) and
[Correction Loop](../../validation.md#correction-loop-for-deterministic-failures).

#### Solution Shape (when material)

- Owner and package/layer for decisions, contracts, dependencies, and tests:
- Material abstractions and boundary value; relevant existing capability or
  custom-gap reason:
- Public names, contract, dependency direction, and applicable tests:
- Automatic architecture evidence versus reviewer judgments:
- Replan trigger check: owner, contract, capability/custom choice, abstraction,
  affected surface, material risk, validation requirements/coverage/strategy,
  or approval boundary requiring a new decision:

Apply [Solution Shape](../../architecture.md#solution-shape) when material.
Use one section per independently reviewable slice. Record exit results under
[Feature Exit Review Output](../../README.md#feature-exit-review-output).
