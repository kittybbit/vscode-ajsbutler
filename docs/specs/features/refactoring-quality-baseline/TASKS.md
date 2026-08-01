# Feature Tasks: Refactoring Quality Baseline

## Agent Brief

- Purpose: create a reproducible, auditable ranking of refactoring hotspots.
- Approved or active slice: Slice 1A (architecture evidence) is approved for
  implementation. Slice 2 evidence remains implemented under the approved
  zero-versus-missing change-frequency decision and awaits its completion gate.
- Do not: edit production code, generated sources, Qlty configuration, package
  scripts, or CI in this feature. The approved architecture evidence slice may
  update the existing architecture-test helper and its in-memory fixture.
- Do not: treat metric reduction alone as evidence of better design.
- Read first: `SPECS.md`, this file, and `docs/specs/architecture.md`.
- Read `TRACEABILITY.md` before validating a slice; read `BASELINE.md` after
  Slice 1 creates it.
- Validate: the slice-specific evidence, then docs-only Qlty and Markdown lint.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: implement and validate Slice 1A before requesting its
  completion approval and then Slice 2 completion approval; Slice 3 remains
  outside the implementation approval boundary.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature and the
  current branch's active implementation plan.
- The inherited `import-definition-via-webapi` feature remains outside this
  feature's scope and approval boundary.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness.

## Selection Evidence

- Mode: Replanning Mode.
- Selected feature: `docs/specs/features/refactoring-quality-baseline/`.
- Selection basis: the user explicitly invoked `sdd-plan-task` after creating
  and discussing `refactoring-quality-baseline`.
- Comparison base: `origin/main` merge-base
  `14d94fa3602fc4f6f467eccac35bc588ee44b9bb`, which equals the current `HEAD`
  before the uncommitted feature-intake documents.
- Branch ownership: this newly created feature is the only selected feature;
  existing feature folders do not contribute tasks or approval state.
- Original planning trigger: `sdd-review-plan` identified under-specified
  production roots, measurement commands, quintile/tie handling,
  business-criticality rubric, generated-output handling, and concrete
  use-case traceability.
- Current replanning trigger: the compiled architecture suite still reports
  8 passing / 5 failing because the existing helper scans absent `src/shared`.
  The approved Slice 2 evidence is complete, but its architecture validation
  gate cannot pass until the stale production-root catalog is reconciled.

## Plan Status

- Status: In Progress
- Planning scope: capture reproducible structural evidence, rank hotspots with
  fixed Git history and cited business criticality, then turn the results into
  bounded follow-on feature intake and durable roadmap sequencing.
- Review status: Reviewed; Slice 1A is complete and Slice 2 remains active.
- Human approval: Slice 1A completion was approved in the current
  conversation. The revised Slice 2 implementation approval remains recorded,
  Slice 1 completion approval remains recorded, and Slice 3 remains
  unauthorized for implementation.
- Active implementation slice: Slice 2 (completion review).

## Human Approval

- Status: Slice 1A completion approved; Slice 2 implementation approved
- Approved at: approved in current conversation
- Approved scope: Slice 1A only: reconcile the durable and agent-facing
  production-root catalogs, the architecture-test root enumeration, and its
  synthetic fixture so the existing architecture suite runs against actual
  roots. No new root, contract relocation, dependency-rule change, allowlist,
  runtime refactor, or CI gate is approved.

- Prior approved scope for Slice 2: feature-local `BASELINE.md` ranking evidence
  using the fixed first-parent Git window, all measured baseline paths,
  zero-versus-missing change-frequency handling, structural and
  change-frequency quintiles, cited business-criticality classifications,
  architecture-layer/responsibility classification, deterministic scoring and
  tie handling, plus the corresponding `TRACEABILITY.md` validation result and
  Slice 2 state update. No refactor target, feature folder,
  runtime/test/configuration change, new collector, automated threshold, CI
  gate, or architecture-rule change is approved.

Slice 1 completion approval remains recorded. Slice 3's prior plan approval,
if any, does not authorize implementation and its dependency is updated below
to consume the revised zero-versus-missing measurement.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

The current-conversation Slice 1A approval records the fresh approval required
because it changes the durable architecture catalog and the architecture-test
evidence boundary. The prior Slice 2 approval does not authorize Slice 1A.

Reset this section to Pending only when the approved Slice 2 implementation is
complete and no active implementation approval remains.

## Replanning Record

- Mode: Replanning Mode.
- Affected slice: Slice 2, `Auditable Refactoring Priority`.
- Discovered gap: four candidates are in the structural/smell candidate union,
  but the fixed current-path history query yields no path record for them. A
  path-limited history query can still find older commits outside the approved
  window, so absence from the aggregate output must be interpreted against the
  precomputed fixed commit set.
- Revised decision: preserve the fixed 100-commit first-parent window and the
  no-fabricated-zero rule. First prove baseline path existence and enumerate the
  fixed commit set. A candidate with no current-path touch in that set has an
  observed count of zero and participates in the normal change-frequency tier;
  a candidate whose path or query cannot be reliably observed remains
  explicitly unranked.
- Current four-candidate outcome: all four paths exist at the baseline commit,
  so they are planned to receive observed touch count 0, change-frequency Tier
  1, and a recalculated priority. Older commits and rename history remain
  explanatory evidence only and do not enter the score.
- Deliberately rejected: widening the history window, changing the baseline
  commit, silently merging rename history with current paths, or assigning
  zero solely because a path is absent without first proving the fixed-window
  population and baseline existence.
- Completion impact: Slice 2 can satisfy the history-gap acceptance condition
  after all 130 candidates are recalculated with the four observed zeros and
  any genuinely unavailable factor remains explicit. The existing incomplete
  architecture-suite result remains a separate caveat and is not resolved by
  this replan.

### Architecture evidence replanning record

- Mode: Replanning Mode.
- Affected slices: Slice 1 validation and Slice 2 completion gate.
- Discovered gap: the existing architecture helper includes `shared` in its
  production roots, but `src/shared` does not exist. Five suite cases fail
  during directory enumeration with `ENOENT`, so they do not represent five
  independent architecture violations and the production scan does not run.
- Approved design direction for review: remove `src/shared` from the durable
  source-layout definition in `docs/specs/architecture.md` and the concise
  architecture catalog in `AGENTS.md`; remove `shared` from the helper's
  production root list; and change the in-memory cross-layer fixture from
  `src/shared/example.ts` to the existing `src/resource/example.ts`.
- Preserved rules: no dependency-rule exception, allowlist, new root,
  contract relocation, or production-source change. The existing rule catalog
  remains zero-exception over the actual production roots.
- Completion impact: Slice 1A restores a runnable architecture evidence
  baseline, with the exact suite reporting 13 passing / 0 failing. Slice 2
  remains pending completion approval; Slice 3 remains dependent on Slice 2
  completion.
- Roadmap impact: none. This is a repository architecture-catalog correction
  needed to validate the current feature, not new repository-level sequencing
  or product work.

## Implementation Slices

### Slice 1: Reproducible Structural Baseline

- Status: Complete
- Scope:

  - Create feature-local `BASELINE.md` with the full baseline commit, installed
    Qlty version, relevant configuration hash, production paths, exclusions,
    exact commands, architecture-test result, and structural evidence tables.
  - Capture file and function cyclomatic/cognitive complexity, lines/LOC,
    available LCOM, Qlty smells, duplication evidence, and architecture-rule
    status at the finest reliable CLI granularity.
  - Record Technical Debt, coverage, dependency degree, or other requested
    measures as unavailable when no repository command produces a reproducible
    value. Do not derive substitutes silently.
  - Treat `.qlty/qlty.toml`, `package.json`,
    `src/test/suite/architectureDependencyRules.test.ts`, and
    `src/test/support/architectureDependencyRules.ts` as read-only evidence.
  - Use these exact current production roots, omitting only roots absent at the
    baseline commit: `src/domain`, `src/application`, `src/infrastructure`,
    `src/presentation`, `src/bootstrap`, `src/resource`, and
    `src/extension.ts`.
  - Record the portable repository hash from
    `git hash-object .qlty/qlty.toml` and run the installed version with
    `qlty --no-upgrade-check version`.
  - Record the exact Qlty commands:

    <!-- markdownlint-disable MD013 -->

    ```text
    qlty --no-upgrade-check metrics --exclude-tests --functions --sort complexity --quiet \
      src/domain src/application src/infrastructure src/presentation \
      src/bootstrap src/resource src/extension.ts
    qlty --no-upgrade-check metrics --exclude-tests --dirs --max-depth 4 --sort complexity --quiet \
      src/domain src/application src/infrastructure src/presentation \
      src/bootstrap src/resource src/extension.ts
    qlty --no-upgrade-check smells --no-snippets --quiet \
      src/domain src/application src/infrastructure src/presentation \
      src/bootstrap src/resource src/extension.ts
    ```

    <!-- markdownlint-enable MD013 -->

- User / Domain Value: later refactoring decisions can be checked against the
  same source state and measurement contract instead of relying on impressions.
- Smallest Useful Slice: it delivers one independently reviewable architecture
  responsibility: reproducible structural evidence. Ranking would be invalid
  without this stable input and therefore remains in Slice 2.
- Cohesive Change Group: feature-local `BASELINE.md`, `TASKS.md`, and
  `TRACEABILITY.md`; read-only Qlty configuration and architecture-test inputs.
- Acceptance:
  - The report names the exact commit and every command, version, path,
    exclusion, threshold, and missing metric needed to interpret the evidence.
  - Re-running the recorded commands at that commit produces equivalent source
    metrics, smell findings, and zero-exception architecture status.
  - File-level and function-level evidence can be connected without guessing
    ownership from truncated names.
- Validation:
  - Re-run the recorded Qlty `metrics` and `smells` commands with
    `--no-upgrade-check` and explicit production roots.
  - Run `pnpm run test:compile`, then run the compiled
    `architectureDependencyRules.test.js` suite directly with
    `pnpm exec mocha --ui tdd out/test/suite/architectureDependencyRules.test.js`;
    do not require a desktop extension host for this host-neutral architecture
    check. `out/` is validation-only and must not be committed.
  - Verify the working tree contains no tracked runtime, test, generated,
    configuration, package, or CI change from the slice.
  - Run `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Production Readiness:
  - Failure mode: unsupported output, missing paths, CLI-version drift, or an
    architecture-test failure is reported as incomplete evidence and blocks
    Slice 2; missing metrics never become zero.
  - JP1/AJS compatibility: no command, parameter, definition, parser, or model
    semantics change.
  - Large or malformed input risk: no runtime input path changes; existing risk
    evidence may be recorded only when an existing test or use case supports it.
  - Desktop/web impact: none; analysis tooling is not imported by either bundle.
  - README/docs impact: only feature-local evidence is added; README remains
    unchanged because user workflow does not change.
  - CHANGELOG impact: none under the repository CHANGELOG criteria.
- Approval Boundary: docs-only evidence capture and read-only validation. No
  Qlty threshold, script, package command, test, production source, generated
  artifact, architecture rule, or CI change is approved.
- Dependencies: current `SPECS.md`, `.qlty/qlty.toml`, `package.json`, and the
  existing zero-exception architecture test.
- Traceability: R1-R3, R5, R6, and R8; Acceptance Criteria 1, 2, 4, and 6; V1-V3
  and V5 in `TRACEABILITY.md`.
- Risks:
  - Qlty 0.500.0 exposes human-readable tables rather than a documented
    machine-readable metrics format.
  - The repository has no configured coverage or Technical Debt command.
  - Qlty output can vary after a tool upgrade, so the version is part of the
    evidence identity.
- Current implementation state: `BASELINE.md` captures the recorded commit,
  Qlty identity, exact commands, file/function/directory evidence, smells,
  duplication, LCOM, and unavailable measurements.
- Current validation: Qlty measurements, file-level metrics, and
  `pnpm run test:compile` passed at the recorded baseline. The historical
  architecture result remains recorded as 8 passing / 5 failing in
  `BASELINE.md`; Slice 1A now provides the corrected 13 passing / 0 failing
  architecture evidence without changing the baseline metrics.
- Completion state: human completion approval was received; Slice 1A is
  validated and awaits completion approval, while Slice 2 remains pending its
  completion approval.
- Implementation feedback: this environment requires approved writable access
  for Qlty's user log when using the `rtk` wrapper; the exact installed Qlty
  version and direct-command fallback are recorded in `BASELINE.md`. Qlty's
  parallel human-readable block order is not stable, so re-run validation uses
  canonical path/function/numeric row comparison.
- Out of Scope: Git change ranking, business criticality, new tooling,
  automated report generation, quality gates, or production refactoring.

### Slice 1A: Reconcile Architecture Production Roots

- Status: Complete
- Scope:

  - Remove the absent `src/shared` entry from the durable source layout in
    `docs/specs/architecture.md` and the agent-facing production-root catalog
    in `AGENTS.md`.
  - Remove `shared` from `productionSourceDirs` in
    `src/test/support/architectureDependencyRules.ts`.
  - Change the in-memory cross-layer detection fixture in
    `src/test/suite/architectureDependencyRules.test.ts` to use the existing
    `src/resource` production root.
  - Update the feature-local architecture evidence and traceability after
    validation; do not create `src/shared` or move any production contract.

- User / Domain Value: architecture evidence scans the actual production
  source layout and distinguishes a stale catalog entry from a real
  dependency-rule violation.
- Smallest Useful Slice: it delivers one architecture responsibility: a
  synchronized, runnable production-root catalog. It is independently
  reviewable through the existing architecture suite and does not alter
  runtime behavior or the dependency rules themselves.
- Cohesive Change Group: durable architecture catalog, agent-facing catalog,
  architecture-test root enumeration, synthetic rule fixture, and the related
  feature evidence/status updates.
- Acceptance:
  - No durable architecture catalog or architecture helper enumerates
    `src/shared` as a production root.
  - The architecture helper walks only existing production roots and no longer
    fails with `ENOENT` during collection.
  - The synthetic cross-layer fixture still detects concrete infrastructure
    construction outside composition using `src/resource/example.ts`.
  - The exact compiled architecture suite completes with 13 passing and 0
    failing tests, with no allowlist or exception added.
  - No production source directory, runtime contract, dependency rule, or
    desktop/web behavior is added, removed, or relocated.
- Validation:
  - Run `pnpm run test:compile`, then run the compiled
    `architectureDependencyRules.test.js` suite directly with
    `pnpm exec mocha --ui tdd out/test/suite/architectureDependencyRules.test.js`.
  - Verify the suite's root collection and every architecture rule family run
    against the actual production roots; confirm the five prior `ENOENT`
    failures are gone.
  - Run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `git diff --check`.
  - Verify no source, generated, package, configuration, CI, or roadmap change
    is included beyond the approved architecture evidence boundary.
- Production Readiness:
  - Failure mode: a stale or missing root, fixture drift, or a changed rule
    result blocks completion; no missing directory is silently treated as an
    empty production layer.
  - JP1/AJS compatibility: no parser, definition, command, configuration, or
    domain semantics change.
  - Large or malformed input risk: none; the slice changes only static source
    enumeration and in-memory architecture fixtures.
  - Desktop/web impact: none; test support and documentation are not bundled
    into either extension host.
  - README/docs impact: update only the durable architecture catalog and
    feature-local evidence; README and use cases remain unchanged.
  - CHANGELOG impact: none under the repository CHANGELOG criteria.
- Approval Boundary: architecture documentation and test-harness root
  reconciliation only. No new `src/shared` layer, contract relocation,
  dependency-rule change, allowlist, runtime refactor, or CI gate is approved.
- Dependencies: Slice 1 evidence and the existing architecture rule suite;
  Slice 2 completion and Slice 3 intake remain downstream.
- Traceability: R5 and R8; Acceptance Criteria 2 and 6; V3 and V5 in
  `TRACEABILITY.md`.
- Risks:
  - A future host-neutral contract may still need an explicitly planned owner;
    this slice does not pre-assign one or create a shared layer.
  - The agent-facing catalog and durable architecture document can drift again
    unless future root additions update both the helper and the docs together.
- Out of Scope: adding or deleting production modules, relocating contracts,
  changing dependency rules, changing Qlty configuration, selecting a
  refactor target, or updating roadmap sequencing.
- Current validation: `pnpm run test:compile`, the direct compiled
  architecture suite (13 passing / 0 failing), `rtk pnpm run qlty`,
  `rtk pnpm run lint:md`, and `git diff --check` passed. The catalogs and
  helper no longer enumerate the absent `src/shared` root, and no out-of-scope
  production, package, configuration, CI, or roadmap change was included.
- Implementation feedback: the Slice 1A boundary was sufficient. Keeping the
  historical baseline result separate from the corrected current architecture
  result preserves baseline identity while making the evidence gate usable.
- Completion approval: approved in current conversation.

### Slice 2: Auditable Refactoring Priority

- Status: In Progress
- Scope:

  - Extend `BASELINE.md` with the fixed 100 non-merge first-parent commit
    window ending at the baseline commit and count distinct file touches within
    that window. Use the following command and record it exactly, including the
    roots that existed at the baseline:

    <!-- markdownlint-disable MD013 -->

    ```text
    git log --first-parent --no-merges --format='%H' --name-only -n 100 \
      <BASELINE_COMMIT> -- src/domain src/application src/infrastructure \
      src/presentation src/bootstrap src/resource src/extension.ts
    ```

    <!-- markdownlint-enable MD013 -->

  - Form the candidate set from production files with a Qlty smell or a
    top-quintile value in an available structural dimension; attach reported
    function evidence to each file candidate.
  - Assign structural and change-frequency quintiles using the decisions in
    `SPECS.md`.
  - Assign business criticality using this required rubric, with a cited source
    and written rationale:
    - 5: JP1/AJS interpretation, normalized model, or shared application
      contract used by multiple core workflows or both hosts.
    - 4: one core user workflow or a shared contract spanning two workflows or
      a desktop/web boundary.
    - 3: one durable user workflow or one host adapter with an explicit,
      tested fallback.
    - 2: supporting presentation, infrastructure, or resource code for one
      workflow without direct JP1/AJS meaning.
    - 1: incidental non-user-path support with no direct compatibility or
      workflow responsibility.
  - Calculate the specified priority product, preserve all raw factors, apply
    stable tie-breaking, classify every candidate by the current architecture
    layer and responsibility, and publish the ranked result.
  - Add an explicit zero-versus-missing check: for the four current candidates,
    verify baseline path existence and the absence of a current-path touch in
    the precomputed fixed commit set, record observed touch count 0, assign
    change-frequency Tier 1, and recalculate their priority. Reserve explicit
    `unranked` disposition for a path or query that cannot be reliably
    observed.
  - For N measured files, assign each available dimension with
    `ceil(5 * (N - rank + 1) / N)` after descending raw-value sort and stable
    path tie-breaking. Omit missing dimensions; require at least one available
    dimension for every candidate. Include the number of measured files and
    every boundary tie in `BASELINE.md`.

- User / Domain Value: the repository addresses frequently changed, important,
  risky responsibilities before stable or low-impact complexity.
- Smallest Useful Slice: it delivers one independently reviewable candidate
  measurement and ranking mechanism. It consumes Slice 1 evidence, separates
  observed zero from unavailable history, and does not decide the scope or
  design of any later refactoring feature.
- Cohesive Change Group: the change-history manifest, criticality rationale,
  architecture classification, scoring rules, and ranked tables within
  feature-local `BASELINE.md` plus traceability/status updates.
- Acceptance:
  - The Git window is anchored to the baseline commit and includes exactly the
    recorded first-parent commits or all available commits when fewer than 100.
  - Every ranked candidate shows structural inputs, file-touch count,
    criticality source and rationale, layer, responsibility, factor scores,
    product score, and tie-break result.
  - The highest-risk functions and files remain discoverable independently of
    their final priority score.
  - All 130 candidates are ranked when their factors are observable. The four
    current candidates show baseline existence, observed touch count 0,
    change-frequency Tier 1, and a recalculated priority. A genuinely missing
    factor remains explicitly unranked and receives no score rather than being
    fabricated as zero.
  - Missing history or evidence remains explicit and blocks unsupported
    ranking rather than defaulting to low risk.
- Validation:
  - Build the fixed 100-commit set once from the approved aggregate command;
    do not derive the window with a path-limited `git log -n 100`, because that
    applies the cap after path filtering and can include older commits.
  - Re-run the recorded Git command and independently verify the commit count,
    baseline endpoint, merge exclusion, and a sample of per-file touch counts.
  - Recalculate every top-ranked item and every cutoff tie from the published
    raw factors; verify the quintile formula and deterministic stable-path
    ordering for remaining ties.
  - For each of the four candidates, verify that the path exists at the
    baseline commit, the precomputed fixed commit set has no current-path touch,
    and the report records observed count 0 and Tier 1. Verify that older
    commits and any `--follow` or prior-path inspection are explanatory only and
    are not merged into the priority calculation.
  - Recalculate the change-frequency population and all affected tiers using
    every measured baseline path with a reliable fixed-window observation; for
    this baseline, the measured population is 253 files. Verify that all 130
    candidates are represented in the recalculated ranking.
  - Cross-check layer classification against `docs/specs/architecture.md` and
    criticality citations against the referenced use cases or repository rules.
  - Run `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Production Readiness:
  - Failure mode: shallow history, rename ambiguity, missing criticality
    rationale, unsupported metric, inconsistent factor calculation, or
    confusing an observed zero with an unavailable factor blocks completion and
    is not silently normalized.
  - JP1/AJS compatibility: no semantics change; JP1/AJS-criticality claims cite
    an existing behavior contract or product constraint.
  - Large or malformed input risk: it can raise criticality only when an
    existing use case or test identifies the risk; it does not invent coverage.
  - Desktop/web impact: host-neutral and host-specific responsibilities are
    distinguished; ranking does not alter either host.
  - README/docs impact: no README or use-case behavior update; `BASELINE.md` is
    temporary feature evidence.
  - CHANGELOG impact: none under the repository CHANGELOG criteria.
- Approval Boundary: feature-local ranking evidence only. No refactor target,
  behavior change, feature folder, runtime/test/configuration edit, new metric
  collector, automated threshold, or CI gate is approved.
- Dependencies: Slice 1 and Slice 1A complete with reproducible structural and
  architecture evidence; revised Slice 2 plan reviewed and approved in the
  current conversation.
- Traceability: R3-R8; Acceptance Criteria 2-4 and 6; V2-V5 in
  `TRACEABILITY.md`.
- Risks:
  - First-parent file history does not follow renames automatically.
  - Repository-relative quintiles describe prioritization, not absolute code
    quality or a mandatory refactor threshold.
  - Business criticality remains human judgment; citations and rationale make
    it reviewable but do not turn it into a measured fact.
  - An explicitly unranked candidate remains visible but cannot be compared to
    ranked candidates or selected by Slice 3 until a later evidence decision
    changes the approved measurement contract. This exception does not apply to
    the four current candidates once their observed zero is verified.
- Current implementation state: `BASELINE.md` records the fixed 100-commit
  window, all 253 measured-path touch counts, 130 recalculated ranked
  candidates, the four observed zero-touch candidates at change-frequency Tier
  1, the raw-factor table, function evidence cross-reference, criticality
  basis, layer/responsibility classification, and deterministic tie handling.
- Current validation: the approved Git command produced 100 commits; 245 of
  253 measured paths have one or more touches and 8 have observed zero. The
  four approved candidates are baseline-present with zero current-path touches
  and Tier 1. Sample counts include 31 for
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts` and 8 for
  `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`. V3 is satisfied
  by Slice 1A's corrected 13 passing / 0 failing architecture-suite result;
  V4 has cited criticality bases; `rtk pnpm run qlty` and `rtk pnpm run lint:md`
  passed.
- Implementation feedback: the fixed commit set must be built once from the
  approved aggregate command. A path-limited `git log -n 100` applies the cap
  after filtering and can incorrectly include commits outside the approved
  window; this was recorded as a validation guard. The Slice 2 boundary was
  sufficient after distinguishing observed zero from unavailable history.
- Out of Scope: widening the history window, changing the baseline commit,
  silently following renames for scoring, treating path absence as zero without
  baseline proof, changes to selected hotspots, characterization tests,
  detailed implementation designs, cross-feature approval, or quality-gate
  automation.

### Slice 3: Bounded Follow-on Feature Intake

- Status: Approved
- Scope:
  - Group the top 10 ranked candidates, including every tie at the tenth rank,
    by one shared responsibility and change reason; never group candidates only
    because their code shape or metric is similar.
  - For each responsibility group, record exact files/functions, evidence,
    related use-case file or an explicit `no behavior use case` source, intended
    roadmap feature 2-9, dependency order, one concrete purpose, non-goals,
    compatibility risks, required characterization safety net, and a measurable
    success signal.
  - Update `docs/specs/roadmap.md` only with durable target ordering, entry
    conditions, dependencies, and unresolved product concerns supported by the
    ranking. Preserve roadmap features 2-9 even when current evidence does not
    yet open their intake gate.
  - Keep detailed baseline evidence in feature-local `BASELINE.md`; do not
    create or select another feature folder in this slice.
- User / Domain Value: later feature intake starts from an exact responsibility
  boundary and evidence package instead of repeating broad repository analysis.
- Smallest Useful Slice: it delivers one architecture value: converting ranked
  evidence into bounded approval inputs. It does not mix those inputs with
  characterization tests, refactoring, or later feature planning.
- Cohesive Change Group: follow-on intake matrix in `BASELINE.md`, durable
  sequencing changes in `docs/specs/roadmap.md`, and traceability/status updates.
- Acceptance:
  - Every selected group has one concrete purpose, exact targets, source
    evidence, dependency order, acceptance signal, compatibility notes, and
    non-goals.
  - Independent responsibilities are split even when they belong to the same
    roadmap feature family.
  - Roadmap updates contain only durable unfinished work and do not copy raw
    metric tables, temporary investigation, or review commentary.
  - Feature 2-9 entries are confirmed, narrowed, reordered, or left behind an
    explicit evidence-dependent entry condition; none is treated as optional.
- Validation:
  - Trace every selected group back to ranked raw factors and its cited use case
    or architecture responsibility. A group without a concrete use-case file
    must cite the branch goal and explain why no behavior contract changes.
  - Apply the `sdd-create-feature` intake and scope gates as a dry review; any
    group that would still require guessing is not marked ready for intake.
  - Verify the roadmap diff passes the Durable Documentation Gate and does not
    modify unrelated WebAPI beta or deferred-candidate decisions.
  - Run `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Production Readiness:
  - Failure mode: ambiguous ownership, multiple purposes, missing compatibility
    evidence, or an unsupported success signal keeps the target behind its
    roadmap entry condition.
  - JP1/AJS compatibility: each dependent target records its command,
    definition/config, domain-rule, or explicit undocumented-behavior basis
    before later feature creation.
  - Large or malformed input risk: propagated only to the relevant target and
    required safety-net intake.
  - Desktop/web impact: every target records whether it affects desktop, web,
    both hosts, or neither; shared contracts require both-host consideration.
  - README/docs impact: only durable unfinished sequencing enters the roadmap;
    user docs remain unchanged.
  - CHANGELOG impact: none for this planning evidence; later user-visible
    changes evaluate their own CHANGELOG need.
- Approval Boundary: feature-local intake evidence and the smallest durable
  roadmap update only. No later feature folder, plan, test, production source,
  generated artifact, configuration, branch, or implementation approval is
  included.
- Dependencies: Slice 2 complete with a reviewed ranked candidate set; any
  genuinely unranked candidate remains outside Slice 3 selection.
- Traceability: R4-R8; Acceptance Criteria 3-6; V3-V6 in `TRACEABILITY.md`.
- Risks:
  - A top-ranked file may contain multiple change reasons and require more than
    one follow-on feature.
  - Some roadmap features may remain intentionally gated when the baseline
    finds no exact target or prerequisite evidence.
  - Raw baseline evidence is temporary; every reusable target decision must be
    propagated before Feature Exit.
- Out of Scope: creating feature 2-9 folders, planning their slices, adding
  characterization tests, editing runtime code, or enforcing quality gates.

## Cross-Slice Dependencies

- Slice 1 freezes evidence identity and structural inputs before any scoring.
- Slice 1A reconciles the architecture production-root catalog before the
  architecture result can be used as complete evidence.
- Slice 2 consumes completed Slice 1 and Slice 1A evidence and produces a complete
  candidate measurement and ranking without selecting implementation designs.
- Slice 3 consumes the reviewed ranked candidate set; any genuinely unranked
  candidate remains an explicit exclusion and is not selected as follow-on
  work.
- Each slice is independently approvable and committable. Human Approval must
  name the specific slice; completing one slice does not approve the next.

## Feature-Level Risks

- Qlty output format and metric availability are version-specific.
- No repository command currently supplies reproducible Technical Debt or code
  coverage values; unavailable evidence must remain visible.
- The fixed 100 non-merge first-parent window is reproducible but may
  underrepresent stable, compatibility-critical code and does not automatically
  follow renames.
- Business criticality requires human review, a rubric category, and a cited
  rationale.
- Quintile output is repository-relative and uses deterministic path tie-breaks;
  it is not an absolute quality threshold.
- Metrics can identify risky code but cannot prove a responsibility boundary or
  justify mechanical function splitting.
- The feature-local baseline becomes stale after its recorded commit by design;
  later work must retain exact commit traceability.
- A stale architecture root is not an architecture violation; it is an
  evidence-collection defect that blocks completion until the catalog and
  helper agree on existing production roots.
- An observed zero-touch count within the approved window is not a low-risk
  claim; it is only a repository-relative change-frequency input. Genuine
  missing history remains unranked and explicit.

## Use-Case Back-Propagation

- No use-case behavior changes are planned. Existing use cases are read-only
  criticality and compatibility evidence; `BASELINE.md` must name the exact
  `docs/requirements/use-cases/uc-*.md` file when one is cited.
- Do not update a use case merely to record a hotspot, metric, implementation
  target, or refactoring history.
- Slice 3 may cite use cases in roadmap intake evidence; only a later feature
  with an approved behavior-contract change may edit those use cases.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this non-trivial feature has three dependent slices and must map
  repository-quality requirements to reproducibility and intake validation.

## Feature Exit

- Definition of Done status: Not assessed; Slice 1 and Slice 1A are complete,
  Slice 2 is evidence-complete with its architecture gate restored and awaits
  completion approval, and Slice 3 is not implemented.
- Durable documentation updates: Slice 3 may update only durable unfinished
  roadmap sequencing and entry conditions. Reusable measurement commands may
  be propagated only if they pass the Durable Documentation Gate.
- Open risks: Qlty format drift, unavailable measurements, history limitations,
  business-criticality judgment, and temporary evidence ownership must be
  resolved, accepted, or propagated before exit.

## Validation

- [x] Slice 1 reproducibility and Slice 1A architecture evidence complete.
- [ ] Slice 2 raw factors, ranking calculation, citations, ties, and the
      zero-versus-missing candidate measurement verified.
- [ ] Slice 3 target traceability and durable roadmap propagation verified.
- [ ] No tracked production, test, generated, configuration, package, or CI
      change is included.
- [ ] `rtk pnpm run qlty` passes for every docs-only slice.
- [ ] `rtk pnpm run lint:md` passes for Markdown structure and links.

## Notes

- Keep requirements and measurement boundary decisions in `SPECS.md`.
- Keep temporary baseline and intake evidence in `BASELINE.md` after Slice 1.
- Keep plan state, approval, validation, risks, and Feature Exit readiness here.
