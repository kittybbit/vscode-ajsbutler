---
name: sdd-commit-gate
description: Create one focused commit after an explicit SDD plan, completion, or closure approval gate.
---

# SDD Approval-Gated Commit

## Purpose

Commit exactly one repository state that has just passed an explicit human SDD
approval gate. This procedure is shared by plan/replan, implementation
completion, and Feature Exit closure commits.

The approval-committer is not an approver. A review verdict is evidence for the
human gate, not a substitute for it.

## Minimum Context

Read first:

1. `AGENTS.md` and `docs/specs/README.md`
2. the selected feature's `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md` when
   present
3. the gate-specific final diff and the exact paths listed in `TASKS.md`

The caller must provide one gate type:

- `plan`: plan-reviewer `Ready` plus `Human Approval: Approved`
- `completion`: implementation-reviewer `Ready` plus `Completion Approval:
Approved`
- `closure`: feature-closer `Close` plus `Closure Approval: Approved`

## Preconditions

Before staging, verify:

- the selected feature is fixed using the repository SSOT
- the required reviewer verdict is present and matches the gate type
- the matching human approval has `Status: Approved`, `Approved at`, and
  `Approved scope`
- `Approved paths` lists the exact files or folders allowed in this commit
- the requested commit is one gate only, not a combined lifecycle transition

No approval may be inferred from a review verdict, an agent's recommendation,
the presence of a changed file, or the user's earlier approval of another gate.

## Commit Workflow

1. Inspect `git status` and the final diff without changing the worktree.
2. Compare every changed path with the gate's `Approved paths`.
3. Stop before staging if unrelated, out-of-scope, or ambiguous dirty work is
   present. Ask the coordinator to isolate it or obtain a new approval.
4. Stage only the explicitly approved paths.
5. Run `rtk git diff --cached --check`.
6. Inspect the staged summary and patch for scope, minimality, and accidental
   secrets or generated output.
7. Create one focused commit with a gate-specific message.
8. Report the commit hash, message, paths, validation, and next handoff.

## Safety Rules

- Never stage or commit before the matching human approval.
- Never stage broad globs or the whole worktree as a shortcut.
- Never edit approval evidence during commit preparation.
- Never amend, reset, checkout, force-push, push, publish, or open a PR.
- Never hide unrelated work with stash, discard, or destructive cleanup.
- If a check fails or the scope is ambiguous, leave the index unchanged when
  possible and stop without committing.

## Output Contract

```md
## Approval-Gated Commit

- Gate: plan | completion | closure
- Required review: <verdict>
- Human approval: <evidence>
- Commit: <hash and message>
- Paths: <committed paths>
- Validation: <staged diff checks>
- Next step: <handoff>
```

## Validation

The minimum commit-time check is:

```bash
rtk git diff --cached --check
```

Do not repeat product tests solely because the commit gate has begun. Use the
implementation or Feature Exit evidence already recorded by the owning role;
rerun a check only when the staged scope or gate evidence is incomplete.
