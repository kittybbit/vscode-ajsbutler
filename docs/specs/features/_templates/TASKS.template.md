# Feature Tasks: {{Feature name}}

## Agent Brief

- Purpose: {{outcome}}
- Active or approved slice: {{slice and status}}
- Read first: `SPECS.md` and this file; add only needed supporting docs.
- Validate: use the active slice's checks below.
- Constraints / next decision: {{scope boundary and next gate}}

## Current state

- Plan: Proposed | Review Needed | Pending Approval | Approved | In Progress |
  Replan Required | Complete
- Plan review: Pending | Ready | Findings

## Human Approval

- Status: Pending | Approved
- Approved at: {{none or approval result}}
- Approved scope: {{exact slice boundary}}
- Approved paths: {{exact paths}}

Add Completion Approval only after implementation review; add Closure Approval
only after Feature Exit. Each record contains its status, exact scope and paths,
review verdict, approval result, and commit status. Keep only the active gate
and current state; approval messages and superseded history do not belong here.

## Implementation Slices

### Slice 1: {{slice name}}

- Status: Proposed | Approved | In Progress | Implemented | Complete | Blocked |
  Replan Required
- Scope and value: {{cohesive change and user/domain value}}
- Acceptance: {{observable or reviewable result}}
- Dependencies / risks / stop conditions: {{only material items}}
- Validation: {{required checks, results, and evidence link}}
- Production readiness: {{relevant failure, JP1/AJS, input-size,
  desktop/web/VS Code, and documentation impact}}
- Approval boundary: {{exact paths and excluded work}}

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
