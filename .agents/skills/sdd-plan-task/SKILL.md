---
name: sdd-plan-task
description: Create or minimally revise the complete implementation-slice plan for one selected feature in explicit mode.
---

# SDD Plan Task

Plan one selected feature or minimally revise its plan. Main must name exactly
one mode for the run: Planning or Replanning. Never infer mode from files or
approval state. Stop before product code, tests, generated artifacts, or
configuration changes.

## Inputs

Resolve the selected feature and branch-owned plan from the SDD policy and
keep them fixed. Use SPECS.md, TASKS.md, package.json when compatibility or
dependencies matter, related use cases, roadmap, concrete references, and
sdd-evidence only as needed to substantiate the plan. Do not mix inherited
feature state into it.

Planning requires a concrete feature purpose and intake documents. Replanning
requires the existing plan, affected slice, actionable Finding or trigger, and
approved context from Main.

## Planning Mode

Plan the whole feature so every requirement and acceptance criterion is
covered. Define independently reviewable, testable, committable, and
approvable slices with value, cohesive scope, order, dependencies, acceptance,
validation, approval boundaries, risks, readiness, and out-of-scope work.
Prefer resolving uncertainty and boundary risks early. Do not split coupled
work without standalone value or leave a slice knowingly broken.

Investigate only the references needed to establish affected files, symbols,
tests, docs, architecture, JP1/AJS, desktop/web and failure risks, assumptions,
and README/CHANGELOG impact. Keep SPECS.md at feature-level requirements and
acceptance. Update durable docs only when they pass the Durable Documentation
Gate.

## Replanning Mode

Use only when a Finding or explicit trigger prevents the plan continuing
unchanged. Revise the smallest affected area; preserve completed and unrelated
approved slices. Update dependencies, approval boundaries, validation, risks,
and traceability only where affected. Recommend another plan review when
boundaries, dependencies, readiness, or approval scope changed. Do not redesign
the feature unless the trigger invalidates it.

## Solution Shape

Record the approved Solution Shape for every material abstraction: semantic
owner/layer for decisions, invariants, translations, lifecycles, names,
contracts, dependencies, and applicable tests; concrete responsibility and
boundary value; public names, contracts, dependency direction, and tests; and
the relevant existing framework or capability. Apply the architecture
definition for materiality. Assess ports, adapters, and retained application
factories separately. A custom-gap justification is needed only for a
proposed custom mechanism. Keep architecture-test facts separate from
reviewer judgments. For code slices, plan sdd-evidence inputs and qlty SARIF
evidence under docs/specs/README.md. Use the Solution Shape definition in
docs/specs/architecture.md. Replan if the owner, layer, contract, direction,
framework/custom choice, abstraction, surface, risk, validation, or approval
boundary changes.

## Return and stop

Keep TASKS.md limited to current state and decision fields required by the SDD
document roles. For each slice record scope/value, order/dependencies,
acceptance, validation, approval boundary, risks, production readiness, and
out of scope. Keep TRACEABILITY.md compact and map requirements to slices and tests
or validation.

Return the complete plan or exact revisions, dependencies/boundaries changed,
validation, traceability, risks, preserved slices, and recommended route to
Main. In Planning, recommend review only when the feature plan is complete.
Human Approval and the focused planning commit precede implementation. Do not
stage or commit, change approval evidence, review the plan, or invoke another
role.

Stop for ambiguous selection, missing design/impact evidence, an untestable
slice, or a new scope, design, dependency, or approval decision.
