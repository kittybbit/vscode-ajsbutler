---
name: sdd-commit-gate
description: Commit one exact plan, completion, or closure gate after its required human approval.
---

# SDD Approval-Gated Commit

Commit one already-approved SDD gate. A reviewer verdict is evidence, not
human approval.

## Required evidence

The selected feature and gate are clear. TASKS.md records the gate's exact
approved paths, matching reviewer result, and human approval with status,
approval time/result, and scope:

- Plan: plan-reviewer Ready and Human Approval Approved.
- Completion: implementation-reviewer Ready and Completion Approval Approved.
- Closure: feature-closer Close and Closure Approval Approved.

Do not infer approval from prior gates, a verdict, an agent recommendation,
changed files, or an approval field without human evidence.

## Commit

Inspect status and the final diff. Before staging, stop if any change is
unrelated, outside the approved paths, ambiguous, or part of another gate.
Stage only the exact approved paths, run git diff --cached --check, inspect
the staged patch for scope and accidental content, then create one
gate-specific commit.

Never edit files or approval evidence, stage broad globs, hide unrelated work,
amend, reset, checkout, force-push, push, publish, or open a PR. If a check
fails, leave the index unchanged when possible and stop without committing.

Return gate, review and approval evidence, commit hash/message/paths, staged
validation, blockers, and next route to Main. Do not invoke another role.
Do not rerun product checks solely because a commit gate began; use owning-role
evidence unless scope or evidence is incomplete.
