---
name: sdd-review-plan
description: Independently review one complete SDD feature plan before Human Approval.
---

# SDD Review Plan

Review the full plan for one selected feature. Return a verdict; do not revise
it, implement work, or approve it for the human.

## Review

Keep the feature fixed and stop if selection, comparison base, or material-risk
evidence is ambiguous. Check whole-feature requirement/acceptance coverage;
slice value, cohesion, size, order, dependencies, reviewability and testability;
exact in/out-of-scope and approval boundaries; traceability; production
readiness; and validation.

Assess architecture, Solution Shape, public contracts, dependency direction,
relevant capabilities, desktop/web, VS Code, JP1/AJS, parser/UI and telemetry
risks, failure modes, large/malformed input, and README/CHANGELOG impact. Use
the approved slice's Solution Shape Evidence and
docs/specs/architecture.md#solution-shape.
Separate automatic architecture-test facts from reviewer judgment. Assess ports,
adapters, and retained application factories separately. For code slices,
challenge sdd-evidence scope and qlty disposition under the SDD policy.

Recommend merge, split, reorder, or revision when needed. Route changes to
owner/layer, contract/direction, framework/custom choice, abstraction, affected
surface, risk, validation, or approval boundary to Main for Replanning.

## Verdict and handoff

Verdict: Ready for approval, Needs revision, Split recommended, or Replan
required. Use Ready only when no actionable Finding remains. Otherwise return
the affected slice, evidence, and concrete revision; state whether Replanning
is needed. Main receives the review and decides
whether to route Findings or, after Human Approval, request the focused plan
commit. Ready is not Human Approval. Do not edit, grant approval, or invoke
another role.
