# Feature Tasks: {{Feature name}}

## Agent Brief

- Purpose: {{outcome}}
- Active or approved slice: {{slice and lifecycle state}}
- Read first: `SPECS.md` and this file; add only needed supporting docs.
- Validate: use the active slice's checks below.
- Constraints / next decision: {{scope boundary and next gate}}

## Current state

- Lifecycle state: {{state from the SDD Lifecycle State Contract}}
- Next decision / blocker: {{next gate or missing decision; none if absent}}
- Gate evidence: {{review verdict and identity, approval and commit references}}

Use Lifecycle state as the sole state field for new features. Keep review and
approval results as gate evidence. Preserve inherited status vocabulary only
under the policy's legacy mapping rule; a field never grants approval.

## Human Approval

- Status: Pending | Approved
- Approved at: {{none or approval result}}
- Approved scope: {{exact slice boundary}}
- Approved paths: {{exact paths}}

Add Completion Approval only after implementation review; add Closure Approval
only after Feature Exit. Each record contains its status, exact scope and paths,
review verdict, approval result, and commit status. Keep the active gate near
the top and compact references for completed slice gates through Feature Exit;
approval messages and superseded narrative do not belong here.

## Implementation Slices

### Slice 1: {{slice name}}

- Lifecycle state: {{substantiated slice state from the Lifecycle State Contract}}
- Scope and value: {{cohesive change and user/domain value}}
- Acceptance: {{observable or reviewable result}}
- Dependencies / risks / stop conditions: {{only material items}}
- Validation: {{required checks, results, and evidence link}}
- Production readiness: {{relevant failure, JP1/AJS, input-size,
  desktop/web/VS Code, and documentation impact}}
- Approval boundary: {{exact paths and excluded work}}

#### Validation index

- Identity / result: {{validated content reference; pass, fail, or unknown}}
- Coverage: {{required checks and covered surfaces}}
- Evidence artifact: {{retained manifest, mechanical detail, and raw outputs}}
- Review / approval / commit: {{exact patch and gate evidence references}}
- Missing facts / refresh or exception: {{decision-relevant reason/reference,
  or none}}

Apply the Evidence Contract in [`SDD policy`](../../README.md#evidence-contract).
The linked artifact owns producer/version, base/final identities, detailed path
manifest, configuration/dependency/tool identities, command exits, raw outputs,
and unexpected reruns/regenerations/extra reviews. Add inventories, four SARIF
files and aggregate result only when the validation tier requires qlty. Keep
artifacts outside inspected inputs, readable and retained through Feature Exit.
A later role consumes matching evidence without copying details or creating
another validation package.

#### Solution Shape (when material)

- Owner and package/layer for decisions, contracts, dependencies, and tests:
- Material abstractions and boundary value; relevant existing capability or
  custom-gap reason:
- Public names, contract, dependency direction, and applicable tests:
- Automatic architecture evidence versus reviewer judgments:
- Replan trigger check: owner, contract, capability/custom choice, abstraction,
  affected surface, risk, validation, or approval boundary:

Record this only for material abstractions and decisions defined in
[`architecture.md`](../../architecture.md#solution-shape). Follow qlty evidence
and production-readiness policy in [`docs/specs/README.md`](../../README.md).

Use one slice section per independently reviewable approval boundary. After all
slices complete, record the Feature Exit result, acceptance, validation and
traceability, readiness, durable/roadmap updates, and unresolved or assigned
risks. Follow the exit criteria in the SDD policy.
