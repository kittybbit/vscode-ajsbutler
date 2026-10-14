# SDD Validation Policy

This file owns validation coverage, Correction Loop, independent review and
qlty requirements. Approval/state gates belong to the
[core SDD contract](README.md#lifecycle-and-approval-gates); evidence validity
and reuse belong to the [Evidence Contract](evidence.md#evidence-contract).

## Risk-Based Validation And Review

Checks cover the changed surface and its material risks. Intake and
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
validation-support paths, with unchanged approved acceptance, intended
observable behavior,
public contracts, JP1/AJS and VS Code compatibility, Solution Shape,
dependency direction, and required validation coverage. Size, a test-only
change, or an automated suggestion does not establish authorization.
Restoring actual implementation behavior to an already-approved observable
contract is a correction, not a new behavior decision. Changing that approved
contract requires Replanning.

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

Correction continues with the active implementer, without a new role dispatch
or Replanning for deterministic failure alone. Iteration covers the nearest
affected check and relevant boundary tests under Evidence Contract freshness.
Run applicable final qlty/build/required desktop-web
coverage after the final substantive patch stabilizes, not on each attempt.
After stabilization, satisfy the
approved final validation set, including required tests, qlty, architecture,
and desktop/web checks, and record the final snapshot identity and evidence.

Run this loop within `IMPLEMENTING`, without review, approval, or commit at
each attempt. The independent `implementation-reviewer` reviews the entire
final patch and its rationale. Review Findings classified as `correction`
return through Main to `implementer` in `IMPLEMENTED` pending revision,
followed by correction, affected validation, and independent re-review.
`decision-required` Findings return to Main for the missing decision and
Replanning when required. These classifications are not lifecycle states.
Completion remains subject to the core lifecycle gates.

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
- **SDD policy, agent instructions and PR operating documents only:** lint
  every changed Markdown path; parse changed TOML/configuration syntax; validate
  relative links, anchors and document structure; inspect Role Authority,
  routing, lifecycle, approval, stop conditions, Correction Loop and Stack
  Merge through representative static scenarios; run `rtk git diff --check`.
  For stack rules, cover order/layer diffs, reviews, protection, CI, merge and
  closure, checking actual repository settings when accessible. Unknown or
  inaccessible required settings block stack readiness, not documentation
  validation of an explicit stop rule. Full product-repository qlty
  baseline/final comparisons and aggregate are not required when product code,
  analyzed inputs, qlty configuration, dependencies and product build/test
  execution conditions are unaffected. No local product build is required.
- **CI/analysis configuration, commands, coverage or dependencies:** validate
  the changed execution conditions and affected product checks. Record old/new
  comparability, analyzed coverage and effects on existing findings; do not
  weaken quality gates or omit affected inputs. Material changes to qlty inputs,
  configuration or selection require its Quality Contract; a documentation-only
  description cannot hide an execution-condition change.
- **Isolated code:** run relevant tests and the same qlty observations and final
  aggregate; build when compilation, bundling, packaging, or final confidence
  requires it.
- **Parser, shared contract, extension host, entry point, generated artifact,
  or configuration:** add the relevant desktop or web tests and build
  evidence.

Combine requirements for mixed surfaces. Record omitted checks with the changed
surface and a short non-applicability reason; unrun checks are not Pass. Apply
this selection before validation without an extra review or completed cost
measurement as a prerequisite. Ordinary independent reviews and human gates
remain required. GitHub Required Checks, code scanning and branch rules are
separate current-head gates: a local tier never authorizes bypassing them. The
repository `Verify` workflow may run product checks for paths outside its
docs-only allowlist; its classification does not determine local validation.
Architecture or product-contract documents with material product impact require
the affected product coverage, even when no code file changes.

For code slices, qlty must pass under the [Quality Contract](#quality-contract).
Treat identity or direction that cannot be mapped reliably as advisory;
unchanged unrelated findings stay out of scope. Metric movement is a review
signal only when no mapped adverse finding exists.

### qlty Evidence Format

#### Quality Contract

The owning producer records mechanical facts under the Evidence Contract;
those facts neither approve work nor replace semantic review. When the
validation tier requires qlty, use `0.645.0` or newer and complete official
SARIF 2.1.0 output for both `check` and `smells` in baseline and final snapshots.
Both snapshots require the same full-repository selection, tool version and
configuration, nonzero analyzed-path inventories/counts for both commands,
snapshot identities, command logs/status, all four SARIF references, and the
final aggregate result. Evidence identity and reuse follow
[the Evidence Contract](evidence.md#identity-and-required-facts).

Match baseline paths against final paths; findings on added final paths are
new findings. Zero analyzed files, missing/malformed SARIF, incomplete scans,
version/configuration/selection mismatch, or missing results cannot pass.
A nonzero `check` exit caused by findings from a completed scan is a
finding-triggered status: retain the raw status and complete SARIF and evaluate
the findings. A command that cannot start or complete cannot pass.
Compare official SARIF records; do not create a repository-specific parser or
textual-output comparator. Any new SARIF finding is NG regardless of severity.
Compare reliably mapped findings using explicit severity ordering, measured
values, and whether higher or lower is worse; any mapped adverse movement is NG.
The final `rtk pnpm run qlty` aggregate must pass. Current-head Qlty Cloud must
also pass before Feature Exit.

#### Execution Procedure

In exact disposable baseline and final snapshots, run the same commands:

```sh
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
```

Save each complete SARIF file, command output and exit status. Record the
version, analyzed-path inventory/count per command and snapshot, configuration
hash, snapshot revisions and commands required by the Quality Contract.
Keep qlty cache and output local to each snapshot. Run `rtk pnpm run qlty` only
in the disposable final snapshot. If formatting changes approved content,
sync those paths, rebuild that snapshot, and repeat both observations and the
aggregate until stable.

### Independent Review

An independent review verdict is Ready only when no actionable Finding remains.

The plan review is the pre-approval scope gate. The independent
`implementation-reviewer` makes the integrated review of scope, acceptance,
quality, and production readiness after validation. Add a second independent
review only for a relevant high-risk surface (parser, shared contracts, host,
entry points, generated artifacts or material configuration) or a concrete
semantic concern; record the reason and reuse the same valid evidence. Minor
formatting or deterministic Findings alone do not require another reviewer.
Independent re-review of the complete corrected final patch remains mandatory.
For native stacks, review the layer diff using the exact predecessor base and
layer head, preserving lower-layer review records. After cascading rebase,
inspect changed diff identities and GitHub review validity; repeat semantic
review only for changed layers or a specific integration concern. Apply
[evidence freshness](evidence.md#freshness-and-invalidation) to checks; require
current-head GitHub CI for every layer under that contract. A local content
match never substitutes a previous SHA's CI for current-head checks; base or
configuration changes also invalidate the affected local comparisons.
GitHub's native rebase may retain approvals when the layer diff is unchanged;
actual rules and review status determine validity. Feature Exit is an aggregate
review of current-head global gates (including Qlty Cloud) and missing/stale
cross-slice coverage, not another per-slice review. A concrete integration
concern may require a targeted check with its reason recorded. New durable-doc
changes need their own changed-surface validation. Exit output and closure
patch requirements belong to the [core policy](README.md#feature-exit-review-output).
