# SDD Validation Policy

This file owns validation, Correction Loop, and qlty details. Use the
[core SDD contract](README.md#lifecycle-and-approval-gates) before the operation
and the [Evidence Contract](evidence.md#evidence-contract) when producing or
consuming evidence. Load the sections needed for the changed surface; load
qlty execution details only when the selected validation tier requires them.

## Risk-Based Validation And Review

Choose checks for the changed surface, beginning with the nearest useful
check. Reuse matching evidence under the Evidence Contract. Do not rerun
unchanged checks only because the workflow or reviewer has changed. Intake and
planning need discovery facts and validation of their documentation changes;
they do not require implementation baseline/final scans for proposed code.

Assess only risks relevant to the changed surface: failure modes, errors and
fallbacks; JP1/AJS semantics and compatibility; large, malformed and edge input;
desktop/web behavior, VS Code compatibility and Node assumptions; architecture
and telemetry privacy; qlty/complexity, performance, dependencies and
readability; user-document and README/CHANGELOG impact. Apply the Solution
Shape contract for material design decisions. These categories do not require
unrelated investigation and do not waive any required boundary, compatibility,
privacy, architecture, or host checks below.

### Correction Loop For Deterministic Failures

Deterministic check failure is not itself a Replanning trigger. For a slice
of an approved, committed plan, `implementer` diagnoses the failure against
the existing approved contract: `SPECS.md`, `TASKS.md`, use cases, acceptance,
architecture rules, and validation requirements. Preserve the failed command,
diagnostics, and affected paths; determine whether production, tests, fixtures,
harness, or generated outputs violate that contract before editing.

Correction is authorized only within explicitly approved product and
validation-support paths, with unchanged acceptance, external behavior,
public contracts, JP1/AJS and VS Code compatibility, Solution Shape,
dependency direction, and required validation coverage. Size, a test-only
change, or an automated suggestion does not establish authorization.

- Lint, formatting, whitespace, import order, and type/build errors may be
  corrected when the existing contract uniquely determines the fix.
- Architecture violations may be corrected when existing rules determine the
  owner, layer, and dependency direction without a new abstraction decision.
- Fix production when it violates the approved observable behavior. Fix
  tests, fixtures, assertions, aliases, mocks, or harness when their expected
  behavior or configuration violates that contract, retaining meaningful
  valid, error, edge, privacy, and compatibility coverage.
- Compare snapshot/golden differences with the approved expected behavior;
  never automatically accept outputs. Regenerate inconsistent artifacts only
  using the established procedure with unchanged source, settings, contracts,
  and approved paths.
- Classify pre-existing, environment-dependent, and flaky failures with
  baseline evidence; do not silently count an unavailable or failed required
  check as passed.

Do not delete or skip tests, remove or weaken assertions, relax coverage, or
make expected outputs follow incorrect production merely to obtain green
checks. If the expected behavior is ambiguous, the correct fix needs an
unapproved path, or scope, contract, ownership, design, dependency,
compatibility, validation requirements/coverage/strategy, or approval needs a
new decision, stop before editing and return a decision request to Main.
Main routes a material decision delta for affected-scope Replanning,
independent plan review, and new Human Approval.

During correction, rerun the nearest affected check and relevant boundary
tests; refresh only affected evidence and reuse matching baseline/check
results under the Evidence Contract. After stabilization, satisfy the
approved final validation set, including required tests, qlty, architecture,
and desktop/web checks, and record the final snapshot identity and evidence.

Run this loop within `IMPLEMENTING`, without review, approval, or commit at
each attempt. The independent `implementation-reviewer` reviews the entire
final patch and its rationale. Review Findings classified as `correction`
return through Main to `implementer` in `IMPLEMENTED` pending revision,
followed by correction, affected validation, and independent re-review.
`decision-required` Findings return to Main for the missing decision and
Replanning when required. These classifications are not lifecycle states.
Completion continues the original sequence: `Ready`, explicit Completion
Approval, and a focused commit by `approval-committer`, followed by the
existing Feature Exit gates.

### Test Organization and Repair

Organize tests around use-case-defined observable behavior, the complete
architecture rule catalog, and general component/public-contract behavior.
Retain distinct valid, error, edge, privacy, and compatibility coverage. Remove
redundant identical assertions, incidental implementation-text mirrors, and
unjustified synthetic permutations or stress cases; retain purposeful
architecture and declared-configuration checks. Physically delete excess tests
and dedicated test support, recording how retained contracts remain covered.

Test common behavior once. Split desktop and web suites only when a genuine host
capability, different behavior, or adapter boundary requires it. Keep necessary
host smoke checks, shared-contract and build compatibility, and the zero-exception
architecture gate. After cleanup, repair retained tests against their contracts;
failures are not deletion evidence. A production mismatch with an existing
approved contract follows the Correction Loop; changing that contract requires
scope or design review. Test removal or coverage changes require their own
approved boundary and are not incidental corrections.

### Validation By Changed Surface

- **SDD coordination/specification docs only:** for feature intake, plans,
  replans, `SPECS.md`, `TASKS.md`, `TRACEABILITY.md`, and their templates, run
  Markdown lint covering every changed Markdown path, validate local links
  and document structure, and run `rtk git diff --check`. Inspect scope,
  traceability, state transitions, and approval provenance as applicable.
  `rtk pnpm run lint:md` covers feature/use-case Markdown; pass other changed
  paths explicitly to markdownlint-cli2. Full-repository qlty baseline/final
  scans and the aggregate are not required for this surface.
- **Repository-wide durable or configuration-sensitive docs:** policy,
  architecture, agent routing/procedures, and documentation that affects check
  commands or configuration retain non-mutating qlty check/smells comparisons
  in exact disposable baseline/final snapshots and the formatting-capable
  aggregate in the final snapshot only. Add targeted Markdown/link/structure
  and diff checks. For mixed documentation changes, use this broader tier.
  Docs-only work needs no product build; the repository `Verify` workflow is
  not a required local documentation gate.
- **Isolated code:** run relevant tests and the same qlty observations and final
  aggregate; build when compilation, bundling, packaging, or final confidence
  requires it.
- **Parser, shared contract, extension host, entry point, generated artifact,
  or configuration:** add the relevant desktop or web tests and build
  evidence.

For code slices, qlty must pass. Compare every reliably mapped finding by
identity, explicit severity ordering, baseline/final severity, measured values,
and whether higher or lower values are worse. A new finding or mapped adverse
movement is Finding/NG. Treat identity or direction that cannot be mapped
reliably as advisory; unchanged unrelated findings stay out of scope. Metric
movement is a review signal only when no mapped adverse finding exists.

### qlty Evidence Format

The owning producer records mechanical facts under the Evidence Contract;
those facts neither approve work nor replace semantic review. When the
validation tier requires qlty, use `0.645.0` or newer with official SARIF
output for both `check` and `smells`. In exact disposable baseline and final
snapshots, run these same commands with the same full-repository selection and
configuration:

```sh
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
```

Save each complete SARIF 2.1.0 file, command output, and exit status. Record
the version, nonzero analyzed-path inventory and count for each command in
each snapshot, configuration hash, snapshot revisions, and commands. The
selection is the full repository in both snapshots; match baseline paths
against final paths, and treat findings on paths added in the final snapshot
as new findings. Keep qlty cache and output local to each snapshot. Zero
analyzed files, missing or malformed SARIF, an incomplete scan, version or
configuration or selection mismatch, or missing results cannot pass. A
nonzero `check` exit caused by findings from a completed scan is a
finding-triggered status, not a command execution failure: retain the raw
status and complete SARIF and evaluate the findings. A command that cannot
start or complete is an execution failure and cannot pass. Compare official
SARIF records; do not create a repository-specific parser or textual-output
comparator. Any new SARIF finding is NG regardless of severity. Compare
reliably mapped findings using explicit severity ordering, measured values,
and whether higher or lower is worse; any mapped adverse movement is NG.
Run `rtk pnpm run qlty` only in the disposable final snapshot, and require
that final aggregate to pass. The current-head Qlty Cloud check must also
pass before Feature Exit. If formatting changes approved content, sync those
paths, rebuild that snapshot, and repeat both observations and the aggregate
until stable.

### Independent Review

The plan review is the pre-approval scope gate. The independent
`implementation-reviewer` makes the integrated review of scope, acceptance,
quality, and production readiness after validation. Add a second independent
review for the higher-risk surfaces above or when the first review finds a
concern, reusing the same valid evidence. Feature Exit is the separate aggregate
review defined below, rather than another per-slice implementation review.
