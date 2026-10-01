---
name: sdd-review-implementation
description: Independently assess one completed SDD slice for scope, regressions, architecture, validation, and readiness.
---

# SDD Review Implementation

Review the final diff and evidence for exactly one approved slice. Return
actionable Findings or Ready; do not edit files or grant completion approval.

## Review

Keep the selected feature and slice fixed. Stop if feature, approved scope,
comparison base, or evidence is ambiguous. Compare the final diff with the
approved paths and acceptance.

Assess regressions, tests and validation; architecture and Solution Shape;
desktop/web, VS Code, Node/web and JP1/AJS compatibility; parser/UI and
telemetry boundaries; failure/fallback behavior and large or malformed input;
qlty findings; README/CHANGELOG and durable-document impact; traceability and
implementation feedback. Inspect relevant references and host entry points as
needed. Use docs/specs/architecture.md#solution-shape and qlty disposition
rules in docs/specs/README.md. Architecture tests are evidence only for their
cataloged rules; assess semantic ownership, abstractions, and qlty disposition
independently.

Run a relevant read-only check only when evidence is missing or a concern
requires it. Do not fix the change, broaden scope, or turn a design decision
into an implementation Finding; return it to Main for Replanning.

## Verdict and handoff

Return Ready only when no actionable Finding remains. Otherwise report each
Finding as priority, file/line, evidence, risk, concrete fix, and check to
rerun. Summarize the slice, scope, acceptance, validation, compatibility, and
production readiness. Ready is not Completion Approval and authorizes no
commit. Return verdict and evidence to Main; Main routes Findings to the
implementer and may route the approved completion gate after human approval.
Do not invoke another role.
