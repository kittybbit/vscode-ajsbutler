---
name: sdd-implement-task
description: Implement exactly one reviewed and approved SDD slice with traceable validation and readiness evidence.
---

# SDD Implement Task

Implement exactly one reviewed slice from the selected feature's TASKS.md.
Do not plan or change its approval boundary.

## Entry and stop conditions

Confirm the selected feature, slice status, human approval and exact approved
paths, dependencies, acceptance, risks, and baseline evidence using the
repository SDD policy. If the feature, base, approval, dependency, or scope is
ambiguous, stop before editing.

Return to Main for Replanning if implementation requires a new slice, scope,
design, dependency, impact, compatibility decision, validation approach, or
approval boundary. Do not silently revise the plan.

## Preserve Solution Shape

Use only this slice's Solution Shape Evidence. For every material abstraction,
preserve its semantic owner and layer, responsibility and boundary value,
public names/contracts/dependency direction/tests where applicable, and the
relevant established framework or capability. Assess ports, adapters, and
retained application factories by their recorded responsibilities; do not add
a forwarding wrapper without port-contract value or a custom mechanism without
a concrete gap. Keep automatic architecture-test facts separate from reviewer
judgments. Use docs/specs/architecture.md#solution-shape and qlty evidence
rules in
docs/specs/README.md. Stop if the approved Solution Shape, affected surface,
risk, validation, or boundary changes.

## Implementation and evidence

Establish the approved surface, nearby checks, references, risks, and desktop
and web entry points before edits. Implement only approved paths and add or
update tests required by the accepted behavior or boundary. Run checks required
for the changed surface and recorded risks under docs/specs/README.md. Record
results through sdd-evidence.

Assess failure modes and errors/fallbacks, JP1/AJS compatibility, large or
malformed inputs, desktop/web and VS Code compatibility, architecture, Node
assumptions, telemetry privacy, qlty, complexity, performance, dependencies,
readability, diff scope, and README/CHANGELOG impact. Record only feedback
useful to future planning or implementation. Update TRACEABILITY.md with the
validation result before recording completion, or state why no update is
required. Apply the Durable Documentation Gate to long-lived documents.

Before returning, record changed paths, acceptance, required checks, compatibility,
production readiness, traceability, useful feedback, and unresolved risks in
the selected feature evidence. Return the final diff and review package to Main.

## Completion boundary

Do not stage or commit before explicit Completion Approval. A reviewer Ready
verdict does not grant that approval. Keep Completion Approval pending until
the human approves the exact completed slice. Main routes Findings and may
start a dependent slice only after the focused completion commit succeeds.
Do not invoke or spawn another lifecycle role.
