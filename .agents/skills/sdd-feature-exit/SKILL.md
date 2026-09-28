---
name: sdd-feature-exit
description: Independently assess one complete SDD feature and prepare closure evidence.
---

# SDD Feature Exit

Review one selected feature after all implementation slices and their focused
completion commits are complete. Apply the Feature Definition of Done in the
SDD policy; do not plan or implement new work.

## Review

Confirm slice status and evidence for acceptance, validation, traceability,
production readiness, and unresolved risks. Use sdd-evidence for missing or
stale mechanical facts. Keep the selected feature fixed; stop if its selection,
slice state, approval evidence, or comparison base is unclear.

Check that required reusable behavior, specifications, design decisions,
terminology, routing, and guardrails have a durable owner. Apply the Durable
Documentation Gate before changing long-lived files; update the smallest
eligible surface. Evaluate README and CHANGELOG need under the SDD policy.
Decide whether unfinished repository-level work, ordering, entry conditions,
or unresolved product concerns changed. Update roadmap.md when the Durable
Documentation Gate is met; otherwise record that no roadmap update is required.
No reusable knowledge, unowned unresolved risk, or valuable unfinished work
may exist only in the temporary feature folder.

Return new design or scope decisions to Main. Do not remove the feature folder,
commit, grant approval, change compatibility decisions, edit runtime/tests/
generated/configuration, or change inherited features.

## Result

Return completed slices, acceptance, validation, traceability, production
readiness, durable and roadmap propagation, remaining risks, and exactly one
recommendation: Close, Do not close, or Human decision needed.

Close is a recommendation only. After explicit Closure Approval records exact
propagation and folder-removal paths, Main may route the closure gate to
approval-committer. Feature Close follows that commit. Return the evidence and
recommended route to Main; do not invoke another role.

Stop when any slice or evidence is incomplete, reusable knowledge has no owner,
any remaining risk is neither resolved, explicitly accepted, nor assigned an
owner, or closure needs a new design or scope decision.
