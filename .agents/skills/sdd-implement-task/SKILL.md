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

Return the blocker to the parent Main orchestrator for planning-procedure
routing when a new slice, scope change, design decision, wider impact, changed
approval boundary, or untestable approved scope is discovered. Do not silently
edit `TASKS.md` into a new plan or invoke another lifecycle role.

## Baseline Check

Before editing, record enough evidence to distinguish new regressions from
existing problems:

- target slice and approval boundary
- nearest relevant tests and fast validation command
- known risks from SDD documents and related use cases
- visible quality issues in the touched area
- direct and transitive references, including desktop and web entry points

Do not expand scope to fix unrelated baseline issues.

## Solution Shape Gate

Before editing, resolve the selected slice and read only its `#### Solution
Shape Evidence` block in `TASKS.md`; another slice's evidence cannot authorize
or satisfy the selected slice. Preserve the approved `Solution Shape` for
every material new or retained abstraction: semantic owner and package/layer;
concrete
responsibility and boundary value; public names, contracts, dependency
direction, and tests where applicable; and the relevant framework, library,
platform, or established repository capability. Use the material-abstraction
definition in `AGENTS.md`. Assess ports for dependency inversion and/or a
host-neutral contract, adapters for applicable isolation, translation, error
normalization, lifecycle, compatibility, or test-boundary responsibility, and
retained application factories separately for composition or use-case-boundary
responsibility. Reject a same-request/same-response forwarding wrapper without
port-contract value. Justify a custom gap only when a custom mechanism is
proposed, and keep framework use at the outer boundary. Record automatic
architecture-test evidence separately from reviewer judgments.

For code slices, capture the same non-mutating `rtk pnpm exec qlty check` and
`rtk pnpm exec qlty smells --no-snippets` observations in exact disposable
snapshots using identical verified qlty configuration and analyzed scope. Keep
qlty runtime artifacts snapshot-local and run formatting-capable `rtk pnpm run
qlty` only as separate final validation in the disposable final snapshot. If
aggregate formatting changes analyzed source or evidence, synchronize only
approved paths, rebuild the final snapshot, and repeat the check/smells pair
plus aggregate until stable. Record each comparable finding's
identity, explicit severity ordering, baseline/final severity, measured values,
and higher-is-worse or lower-is-worse direction. A new finding or reliably
mapped adverse movement is Finding/NG; only unmappable identity or direction is
advisory, and unchanged unrelated findings stay out of scope. If the
owner/package, contract/dependency direction, framework-versus-custom
decision, abstraction/responsibility, affected surface, risk, validation, or
approval boundary changes, stop and return for Replanning.

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
# In each disposable snapshot:
rtk pnpm exec qlty check
rtk pnpm exec qlty smells --no-snippets
# In the disposable final snapshot only:
rtk pnpm run qlty
# In the reviewed primary state:
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
authorize a commit. Return the implementation evidence and recommended review
route to Main. Keep `TASKS.md` `Completion Approval` pending until the human
explicitly approves the exact completed slice. Main may then delegate
`approval-committer` with gate type `completion`; do not stage or commit before
that approval. If another slice remains, Main begins it only after the
completion commit succeeds. This procedure does not invoke or spawn another
lifecycle role.

## Rules

- implement one approved slice only
- do not stage or commit before explicit Completion Approval
- do not plan new work during implementation
- preserve `engines.vscode`, desktop/web behavior, and architecture boundaries
- keep diffs minimal and readable
- prefer `rtk` for inspection, search, tests, builds, and validation
