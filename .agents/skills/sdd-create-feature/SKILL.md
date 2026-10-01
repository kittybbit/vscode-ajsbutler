---
name: sdd-create-feature
description: Record one well-scoped SDD feature intake before planning.
---

# SDD Feature Intake

Create or update intake documents for one concrete feature. Planning and
implementation belong to their own roles.

## Intake decision

Establish one purpose and feature kind (roadmap or transient branch), slug,
source, JP1/AJS basis, expected behavior or boundary decision, compatibility,
and non-goals. Check overlap with existing features, use cases, and roadmap.
Do not infer missing product behavior, feature kind, compatibility, or roadmap
intent; record a clear assumption or return the missing decision to Main.

Keep one purpose per folder. If a request combines independent outcomes,
split them into named features, dependency order, and the first feature to
create. Do not create placeholders or infer a product decision.

## Documents

Use the feature templates and the SDD document roles. Create or update only
the selected feature's SPECS.md, TASKS.md, and TRACEABILITY.md when required.
Keep purpose, origin, requirements, boundaries, compatibility, acceptance, and
non-goals in SPECS.md; record initial state, risks, validation, and planning
follow-up in TASKS.md; map use case/requirements to slices and validation in
TRACEABILITY.md for non-trivial or multi-slice work.

Update roadmap.md only when repository-level future work or ordering changes.
Update durable use cases only when an observable behavior contract changes.
Record approval state from human evidence; do not grant approval.

## Return to Main

Summarize the folder and purpose, kind and source, JP1/AJS basis, overlap,
compatibility and non-goals, document impacts, unresolved decisions, validation,
and recommended planning route.

Stop for unclear purpose or feature kind, an unclear split boundary or
dependency, or missing behavior, compatibility, or roadmap evidence. Validate documentation
under the SDD policy.
