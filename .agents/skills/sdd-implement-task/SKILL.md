---
name: sdd-implement-task
description: Implement exactly one reviewed and approved vscode-ajsbutler SDD slice with baseline checks, risk-based validation, traceability, and production-readiness evidence.
---

# SDD Implement Task

## Purpose

Implement exactly one reviewed and approved implementation slice from the
selected feature's `TASKS.md`. This procedure does not plan new slices or
change approval boundaries.

## Minimum Context

Read first:

1. `AGENTS.md`, `package.json`, and `docs/specs/README.md`
2. selected `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md` when present
3. concrete files, symbols, tests, and entry points named by the slice

Confirm the feature is selected using the repository SSOT. Stop when the
selected feature, comparison base, approved slice, or approval evidence is
ambiguous.

## Replanning Boundary

Return to the planning procedure when a new slice, scope change, design
decision, wider impact, changed approval boundary, or untestable approved
scope is discovered. Do not silently edit `TASKS.md` into a new plan.

## Baseline Check

Before editing, record enough evidence to distinguish new regressions from
existing problems:

- target slice and approval boundary
- nearest relevant tests and fast validation command
- known risks from SDD documents and related use cases
- visible quality issues in the touched area
- direct and transitive references, including desktop and web entry points

Do not expand scope to fix unrelated baseline issues.

## Implementation Workflow

1. Select one approved slice and confirm its scope, acceptance, validation,
   dependencies, risks, and out-of-scope work.
2. Enumerate affected files, symbols, commands, adapters, tests, docs, and
   layer boundaries before editing.
3. Implement only the approved slice in small meaningful blocks.
4. Add or update tests required by the approved behavior or boundary.
5. Run nearest useful checks first, then the risk-based checks recorded by the
   repository SSOT.
6. Prepare the final diff and evidence for independent review.

## Quality and Production Readiness

Verify intentionally:

- failure modes and user-facing errors or fallback behavior
- existing JP1/AJS definition compatibility
- large, malformed, and edge-case input behavior
- desktop and web extension behavior
- VS Code engine compatibility and absence of unsupported APIs
- architecture boundaries, Node-only assumptions, and telemetry privacy
- qlty findings, complexity, performance, dependencies, and readability
- diff minimality and absence of incidental changes
- README/docs and CHANGELOG impact using `docs/specs/README.md`

## Traceability and Feedback

Update the implemented slice's `TRACEABILITY.md` validation result before
completion is recorded, or state why no update is required. Capture only
feedback that improves future planning or implementation, such as a better
slice boundary, a discovered dependency, or a validation improvement.

Apply the Durable Documentation Gate before changing long-lived documents.
Propagate only reusable behavior, design, or repository-policy knowledge.

## Validation

Use the nearest relevant check first and add only checks required by the
changed surface and recorded risks. Typical checks include:

```bash
rtk pnpm run qlty
rtk pnpm run lint:md
rtk git diff --check
```

For shared, bootstrap, or packaging changes, consider the desktop build and
web tests required by the repository validation policy.

## Completion Evidence

Before recording completion, confirm:

- acceptance criteria and required tests are satisfied
- validation is complete and its result is traceable
- quality and production readiness are preserved
- the approved scope was not exceeded
- unresolved risks and useful implementation feedback are recorded
- reusable knowledge passed the Durable Documentation Gate

Record the changed files, checks, compatibility impact, desktop/web impact,
documentation impact, and remaining follow-up for the feature task record.

## Completion Approval Handoff

Implementation evidence and an implementation-reviewer `Ready` verdict do not
authorize a commit. Keep `TASKS.md` `Completion Approval` pending until the
human explicitly approves the exact completed slice. Then hand off to
`sdd-commit-gate` with gate type `completion`; do not stage or commit before
that approval. If another slice remains, begin it only after the completion
commit succeeds.

## Rules

- implement one approved slice only
- do not stage or commit before explicit Completion Approval
- do not plan new work during implementation
- preserve `engines.vscode`, desktop/web behavior, and architecture boundaries
- keep diffs minimal and readable
- prefer `rtk` for inspection, search, tests, builds, and validation
