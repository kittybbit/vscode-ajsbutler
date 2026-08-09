# Feature Tasks: Refactoring Quality Gate Strengthening

## Agent Brief

- Purpose: strengthen the existing Qlty Cloud quality gate with one
  evidence-backed configuration decision for bounded refactoring regressions.
- Approved or active slice: Slice 1 is approved and awaits the focused plan
  commit before implementation.
- Do not: introduce repository-wide absolute quality thresholds or duplicate
  Qlty Cloud in a local helper or GitHub Actions step.
- Do not: edit production runtime behavior or supported JP1/AJS semantics.
- Read first: `SPECS.md`, this file, `docs/specs/README.md`, and
  `docs/specs/features/BASELINE.md`.
- Read `TRACEABILITY.md` when preparing or reviewing the implementation plan.
- Validate: `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and the focused plan
  evidence required by the selected gate.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: create the focused approval-gated plan commit, then implement
  Slice 1 within its exact approved paths.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation-slice planning, approval,
  validation, risk, production readiness, and Feature Exit readiness. Do not
  retain historical work logs.

## Plan Status

- Status: Plan Approved
- Planning scope: replace the suspended two-slice Qlty CLI/evaluator plan with
  a single configuration-alignment slice. Qlty Cloud and the registered
  GitHub App remain the Qlty execution and status owner; no duplicate workflow
  or local evaluator is planned.
- Review status: Ready; the revised one-slice plan is cohesive, traceable,
  bounded to Qlty configuration, and preserves the existing Cloud/Actions
  owner and runtime verification paths.
- Human approval: Approved at `2026-08-09 09:58 JST`; implementation may begin
  only within the approved configuration-alignment scope.
- Active implementation slice: Slice 1, pending the required plan commit.

## Replan Trigger

- User evidence: Qlty Cloud checking is already integrated into Actions, and
  `qltysh` is registered as a GitHub App for the repository.
- Impact: the proposed local Qlty CLI installation, version pin, upstream
  smell check, and differential `Cyclo` evaluator duplicate an existing
  repository-connected quality owner. The remaining candidate is a narrow
  review of the committed Qlty configuration and the Cloud Quality Gate
  semantics.
- Repository evidence: the checked-in `.qlty/qlty.toml` explicitly serves both
  Qlty CLI and Qlty Cloud; the current checkout's `.github/workflows` contains
  `verify.yml` and CodeQL, but Cloud configuration may be managed outside this
  repository and the user's statement is authoritative for the replan.
- Required decision: confirm the effective Cloud gate settings and whether
  `smells.mode = "comment"` prevents the committed configuration from acting
  as a blocking quality gate. The revised candidate is to change only that
  mode to `block`, with the Cloud gate configured to fail on new issues; if
  the effective gate already blocks the approved signal, record a no-change
  decision. Existing Verify continues to own architecture/build/desktop/web
  checks.

## Human Approval

- Status: Approved
- Approved at: `2026-08-09 09:58 JST`
- Approved scope: Inspect the effective Qlty Cloud gate and committed
  `.qlty/qlty.toml`; if the existing `comment` mode does not block newly
  introduced maintainability issues, change only `[smells] mode` to `block`
  and record that the Cloud gate evaluates new issues only. Do not add a
  local evaluator, Qlty Actions installation, package script, workflow job,
  threshold change, or runtime change.
- Approved paths: `.qlty/qlty.toml`,
  `docs/specs/features/refactoring-quality-gate-strengthening/SPECS.md`,
  `docs/specs/features/refactoring-quality-gate-strengthening/TASKS.md`,
  `docs/specs/features/refactoring-quality-gate-strengthening/TRACEABILITY.md`

Implementation must not start while Status is Pending.

## Completion Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Align the existing Qlty Cloud quality gate configuration

- Status: Approved; pending plan commit
- Scope: Record the effective Qlty Cloud Project Settings and the
  repository's `.qlty/qlty.toml` behavior, then apply one narrow repository
  configuration change only if the evidence confirms a gate gap. The
  concrete candidate is changing `[smells] mode = "comment"` to
  `[smells] mode = "block"`, while configuring the existing Cloud Quality
  Gate to fail only on newly introduced issues at the approved issue levels.
  If the Cloud gate already blocks the approved signal, make no configuration
  change and record the no-change decision. Do not add a Qlty action, package
  script, local evaluator, or new workflow job.
- User / Domain Value: pull requests retain one authoritative Qlty status and
  can block newly introduced maintainability regressions without treating the
  existing backlog as a new failure.
- Cohesive Change Group: `.qlty/qlty.toml` only when the reviewed mode change
  is required, plus the feature-local evidence and traceability documents.
  Cloud Project Settings are an external prerequisite/evidence source; they
  are not silently replaced by repository automation.
- Acceptance:
  - The evidence records whether the Qlty GitHub App has access to this
    repository, whether Qlty Gate is enabled, which new-issue levels and
    maintainability signals it evaluates, and whether its GitHub status is
    required for merge.
  - The committed configuration review records the current exclusions,
    enabled smell checks, thresholds, modes, and pinned plugin versions.
  - The approved result is either the exact one-setting `comment` to `block`
    change or an explicit no-change decision; threshold changes require a
    separate evidence-backed replan.
  - Existing Qlty Cloud remains the only Qlty quality owner. The checked-in
    Verify workflow, package scripts, docs-only classification, architecture
    checks, build, desktop tests, and web tests remain unchanged.
  - The effective gate is differential: pre-existing findings remain
    explainable and only newly introduced or reopened findings can block.
- Validation:
  - Run the Qlty configuration validation for the committed file and record
    the effective mode.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
    `rtk git diff --check`.
  - Use a Qlty Cloud pull-request result or an approved controlled test to
    show that the selected new-issue condition produces the expected status;
    do not introduce a deliberately bad production change into this branch.
- Production Readiness:
  - Failure mode: invalid Qlty TOML, unsupported mode, missing Cloud status,
    or a gate that fails on the pre-existing backlog blocks completion with
    the setting and evidence context.
  - JP1/AJS compatibility: no parser, normalized model, definition-file,
    diagnostic, or telemetry behavior is executed or changed by the slice.
  - Desktop/web impact: none; existing host validation remains owned by
    Verify and is not duplicated.
  - README/docs impact: no user-facing documentation change is expected;
    feature-local evidence records the contributor-facing policy.
  - CHANGELOG impact: none; no extension behavior changes.
- Approval Boundary: exactly the reviewed one-setting `.qlty/qlty.toml`
  change, if required, and feature-local evidence. No workflow, package
  script, production source, architecture catalog, or second Qlty evaluator
  may change.
- Dependencies: the shared baseline, completed bounded refactoring evidence,
  and evidence of the effective Qlty Cloud Project Settings.
- Risks: Cloud settings are externally managed; Qlty mode semantics or
  default issue levels may drift; and threshold changes could convert a
  measurement baseline into an unsupported absolute target. Replan if any of
  these are unresolved.
- Out of Scope: installing Qlty in Actions, adding a differential helper,
  changing package scripts, changing repository-wide smell thresholds,
  coverage gates, runtime code, architecture rules, or docs-only workflow
  policy.

## Superseded Implementation Plan

The following two-slice Qlty CLI/evaluator plan is retained only to make the
replan boundary explicit. It is not active, approved, or eligible for
implementation or commit.

### Slice 1: Build the differential quality evaluator

- Status: Replan Required
- Scope: Add a repository-only helper under `scripts/quality/` that accepts a
  base revision (or resolves `git merge-base HEAD main` only when the local
  `--base` argument is omitted), identifies comparable changed production
  files under the seven recorded production roots, asserts the recorded Qlty
  CLI version
  `0.500.0`, runs the recorded Qlty configuration, and reports function-level
  `Cyclo` increases plus Qlty smells introduced since the base. Add
  deterministic fixture tests for parsing, unchanged/decreased metrics,
  increased metrics, new smells, added/deleted/renamed files, missing base
  revisions, malformed Qlty output, and command failures. Add one package
  script for the local entry point and one script for the focused fixture
  tests. Do not change `.qlty/qlty.toml`. This entire slice is suspended until
  the Cloud overlap decision is resolved.
- User / Domain Value: contributors receive the same actionable differential
  quality decision locally and in CI, while existing baseline findings remain
  explainable and non-blocking.
- Cohesive Change Group: `scripts/quality/differentialQualityGate.mjs`, its
  fixture test module, and the corresponding `package.json` scripts. The
  helper may use repository automation capabilities such as Git and temporary
  worktrees; it is not production source and must not be imported by the
  extension.
- Acceptance:
  - A supplied base revision is validated before analysis; missing or
    ambiguous base state fails closed with an actionable message.
  - Local fallback is deterministic: it uses the repository default branch
    `main`; if that ref is unavailable, the command requires an explicit
    `--base` value instead of guessing.
  - Qlty version output must contain `0.500.0`, matching the shared baseline;
    any version drift fails closed and requires an explicit plan revision.
  - Only comparable existing functions in changed production files are used
    for the `Cyclo` comparison. A current value greater than its base value is
    a failure with path, function, base value, and head value. New functions
    without a base counterpart are reported as review information, not judged
    by a new absolute repository threshold.
  - `qlty smells --no-snippets --quiet --upstream <base>` is treated as a
    differential smell gate: empty output passes, any parsed finding fails,
    and Qlty execution/format errors fail closed.
  - Docs-only or non-production changes skip the quality analysis with a
    successful no-op result; changes to the approved Qlty configuration are
    not silently treated as a production-only no-op.
  - Fixture tests prove a deliberate `Cyclo` increase and deliberate new smell
    are detected, while unchanged and decreased results pass.
- Validation:
  - Run the focused fixture test script with its mock Qlty/Git command runner.
  - Run the evaluator against the feature branch creation base
    `e7572e27efd7d66fcde27cf7a067e3ed78e0b820` with no production changes and
    confirm a successful no-op result.
  - Confirm local `pnpm exec qlty --no-upgrade-check version` reports Qlty
    `0.500.0` before the evaluator run.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
    `rtk git diff --check`.
- Production Readiness:
  - Failure mode: missing base, unavailable Qlty, non-zero Qlty command,
    malformed table output, or failed temporary-worktree cleanup returns a
    non-zero result with the failed operation and comparison context.
  - JP1/AJS compatibility: no parser, normalized model, definition-file, or
    diagnostic behavior is executed or changed by the helper.
  - Large or malformed input risk: the helper analyzes only changed
    production paths for metrics; smell analysis uses Qlty's upstream mode.
    Temporary worktrees are always removed, including failure paths.
  - Desktop/web impact: none in runtime; the helper remains host-neutral and
    does not import `vscode`, UI frameworks, or production modules.
  - README/docs impact: no user documentation change is expected; the local
    package script and failure output are contributor-facing.
  - CHANGELOG impact: none; this is internal repository validation.
- Approval Boundary: exactly the new repository helper, its fixture tests, the
  two package scripts, and feature-local planning evidence. No workflow,
  production source, test harness, Qlty configuration, or durable policy file
  outside this list may change.
- Dependencies: completed baseline and the completed bounded refactoring
  evidence recorded in the baseline history; no dependency on Slice 2.
- Risks: Qlty human-readable output may drift; function identity may be
  ambiguous after rename; new files have no comparable base; and temporary
  worktrees may behave differently on local and CI Git versions. Fail closed
  and record a replan trigger for unsupported output or boundary cases.
- Out of Scope: changing Qlty thresholds/configuration, repository-wide
  absolute limits, runtime code, architecture rules, the GitHub workflow, and
  existing application tests.

### Slice 2: Integrate the gate into Verify

- Status: Replan Required
- Scope: Install Qlty through the exact action ref
  `qltysh/qlty-action/install@v2.2.0` in `.github/workflows/verify.yml`, assert
  that the installed CLI reports version `0.500.0`, and make the checkout
  available to the exact pull request base SHA, pass that SHA to
  the Slice 1 helper, and add the quality-gate step only to the existing
  non-docs `verify` path. Preserve the current `changes` / `decide`
  docs-only classification and all existing build, desktop, and web checks.
  This slice is suspended; adding a second Qlty CLI check is not authorized.
- User / Domain Value: pull requests with a new refactoring-quality regression
  fail the same verification job that protects extension compatibility, while
  docs-only work keeps its existing fast path.
- Cohesive Change Group: `.github/workflows/verify.yml` only, plus the
  feature-local evidence update. The workflow will use the maintained Qlty
  install action and the exact base SHA provided by the pull request event;
  no Qlty configuration change is part of the slice.
- Acceptance:
  - Verify has the Qlty CLI before the differential gate runs and uses the
    recorded Qlty configuration/version contract; a CLI version other than
    `0.500.0` fails the job before analysis.
  - The gate receives `github.event.pull_request.base.sha` (or the equivalent
    exact PR base) and does not silently compare against the historical
    baseline commit or an arbitrary runner branch.
  - The quality step is skipped with the existing `should_verify=false` path
    for docs-only changes and runs for production changes.
  - Existing Markdown, build, test compilation, desktop, and web checks remain
    present and ordered so the workflow still protects both extension hosts.
- Validation:
  - Validate the workflow structure and changed-file classification with
    focused static checks and the local helper fixture tests.
  - Run the helper against the current feature base and run the existing
    `rtk pnpm run build`, `rtk pnpm run test:compile`, desktop test, and web
    test commands because the shared verification entry point changes.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
    `rtk git diff --check`.
- Production Readiness:
  - Failure mode: Qlty installation or differential analysis failure blocks
    code verification with the command output; docs-only changes do not invoke
    the step.
  - JP1/AJS compatibility: the workflow only adds repository validation; all
    supported JP1/AJS definition behavior is still covered by the unchanged
    desktop and web suites.
  - Large or malformed input risk: existing build and host tests remain the
    primary runtime evidence; the quality step does not parse user definition
    files.
  - Desktop/web impact: both existing host checks remain required in the same
    non-docs verification job.
  - README/docs impact: no README or user documentation update is expected.
  - CHANGELOG impact: none; no extension behavior changes.
- Approval Boundary: exactly `.github/workflows/verify.yml` and the feature
  evidence paths required to record its validation. Any action-source change,
  Qlty configuration change, permission expansion, runtime change, or workflow
  restructuring requires Replanning Mode and new approval.
- Dependencies: Slice 1 must be complete and committed; the workflow invokes
  its package entry point and relies on its base/ref/error semantics.
- Risks: action release drift despite the reviewed `v2.2.0` ref, shallow
  checkout state, pull requests based on inherited feature branches, and
  differences between local Qlty installation and the pinned CI installation.
  The exact action version and base-ref fallback remain part of implementation
  review.
- Out of Scope: Qlty Cloud, coverage, technical-debt thresholds, user-facing
  product behavior, runtime code, and changes to docs-only workflow policy.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this is a non-trivial repository-quality feature with a roadmap
  source, shared baseline evidence, an approval-gated implementation, and
  explicit validation semantics.

## Feature Exit

- Definition of Done status: Pending the revised configuration slice (or a
  reviewed no-change decision), independent implementation review,
  Completion Approval, focused commit, and Feature Exit.
- Durable documentation updates: None identified during Intake; Feature Exit
  must apply the Durable Documentation Gate before retaining any policy change.
- Open risks: the effective Cloud gate settings are externally managed, the
  `block` mode must be validated against Qlty Cloud's new-issue behavior, and
  the current baseline thresholds must not be tightened without evidence.

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Feature Intake established the roadmap origin, evidence gate, one-purpose
  boundary, compatibility expectations, and non-goals.
- Plan review verdict: Ready. The revised slice has one owner, one bounded
  configuration decision, explicit external Cloud evidence, and no runtime or
  workflow impact.
- Replanning identified the existing `[smells] mode = "comment"` setting as
  the concrete configuration gap candidate: Qlty documents comment mode as
  producing review comments without failing the Quality Gate. The revised
  plan must verify this against the Cloud project before changing it to
  `block`.
- Planning must use `docs/specs/features/BASELINE.md` as shared evidence and
  must not copy its detailed measurements into this feature folder.
- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
