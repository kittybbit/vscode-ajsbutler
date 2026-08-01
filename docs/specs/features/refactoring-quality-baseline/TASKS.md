# Feature Tasks: Refactoring Quality Baseline

## Agent Brief

- Purpose: create a reproducible, auditable ranking of refactoring hotspots.
- Approved or active slice: Slice 1 complete; Slice 2 remains blocked by the
  recorded architecture evidence condition.
- Do not: edit production code, tests, generated sources, Qlty configuration,
  package scripts, or CI in this feature.
- Do not: treat metric reduction alone as evidence of better design.
- Read first: `SPECS.md`, this file, and `docs/specs/architecture.md`.
- Read `TRACEABILITY.md` before validating a slice; read `BASELINE.md` after
  Slice 1 creates it.
- Validate: the slice-specific evidence, then docs-only Qlty and Markdown lint.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: review the complete plan with `sdd-review-plan`.

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
- Replanning trigger: `sdd-review-plan` identified under-specified production
  roots, measurement commands, quintile/tie handling, business-criticality
  rubric, generated-output handling, and concrete use-case traceability.

## Plan Status

- Status: In Progress
- Planning scope: capture reproducible structural evidence, rank hotspots with
  fixed Git history and cited business criticality, then turn the results into
  bounded follow-on feature intake and durable roadmap sequencing.
- Review status: Approved after re-review.
- Human approval: Approved for all planned slices; Slice 1 completion approval
  has been received. The plan approval for Slices 2–3 remains unchanged and
  does not authorize their implementation.
- Active implementation slice: None; Slice 2 remains blocked by the recorded
  architecture evidence condition.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: No active implementation approval remains. Slice 1 completion
  was approved; the next slice requires a separate implementation instruction.

Implementation instruction was received for Slice 1, and completion approval
was received in the current conversation. No implementation instruction has
been received for Slice 2. The plan approval for Slices 2–3 remains unchanged
and does not authorize their implementation.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

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
  `pnpm run test:compile` passed. The architecture suite remains incomplete
  at 8 passing / 5 failing because its existing helper scans absent
  `src/shared`; this baseline condition is recorded in `BASELINE.md` and no
  out-of-scope test or source change was made.
- Completion state: human completion approval was received; Slice 2 remains
  blocked by the incomplete architecture evidence.
- Implementation feedback: this environment requires approved writable access
  for Qlty's user log when using the `rtk` wrapper; the exact installed Qlty
  version and direct-command fallback are recorded in `BASELINE.md`. Qlty's
  parallel human-readable block order is not stable, so re-run validation uses
  canonical path/function/numeric row comparison.
- Out of Scope: Git change ranking, business criticality, new tooling,
  automated report generation, quality gates, or production refactoring.

### Slice 2: Auditable Refactoring Priority

- Status: Approved
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
  - For N measured files, assign each available dimension with
    `ceil(5 * (N - rank + 1) / N)` after descending raw-value sort and stable
    path tie-breaking. Omit missing dimensions; require at least one available
    dimension for every candidate. Include the number of measured files and
    every boundary tie in `BASELINE.md`.

- User / Domain Value: the repository addresses frequently changed, important,
  risky responsibilities before stable or low-impact complexity.
- Smallest Useful Slice: it delivers one independently reviewable decision
  mechanism and ranked output. It consumes Slice 1 evidence but does not yet
  decide the scope or design of any later refactoring feature.
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
  - Missing history or evidence remains explicit and blocks unsupported
    ranking rather than defaulting to low risk.
- Validation:
  - Re-run the recorded Git command and independently verify the commit count,
    baseline endpoint, merge exclusion, and a sample of per-file touch counts.
  - Recalculate every top-ranked item and every cutoff tie from the published
    raw factors; verify the quintile formula and deterministic stable-path
    ordering for remaining ties.
  - Cross-check layer classification against `docs/specs/architecture.md` and
    criticality citations against the referenced use cases or repository rules.
  - Run `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Production Readiness:
  - Failure mode: shallow history, rename ambiguity, missing criticality
    rationale, unsupported metric, or inconsistent factor calculation blocks
    completion and is not silently normalized.
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
- Dependencies: Slice 1 complete with reproducible structural evidence.
- Traceability: R3-R8; Acceptance Criteria 2-4 and 6; V2-V5 in
  `TRACEABILITY.md`.
- Risks:
  - First-parent file history does not follow renames automatically.
  - Repository-relative quintiles describe prioritization, not absolute code
    quality or a mandatory refactor threshold.
  - Business criticality remains human judgment; citations and rationale make
    it reviewable but do not turn it into a measured fact.
- Out of Scope: changes to selected hotspots, characterization tests, detailed
  implementation designs, cross-feature approval, or quality-gate automation.

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
- Dependencies: Slice 2 complete with a reviewed ranked candidate set.
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
- Slice 2 consumes only completed Slice 1 evidence and produces the ranked
  candidate set without selecting implementation designs.
- Slice 3 consumes the reviewed ranking and propagates only bounded future work
  that passes the Durable Documentation Gate.
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

- Definition of Done status: Not assessed; no slice is implemented.
- Durable documentation updates: Slice 3 may update only durable unfinished
  roadmap sequencing and entry conditions. Reusable measurement commands may
  be propagated only if they pass the Durable Documentation Gate.
- Open risks: Qlty format drift, unavailable measurements, history limitations,
  business-criticality judgment, and temporary evidence ownership must be
  resolved, accepted, or propagated before exit.

## Validation

- [ ] Slice 1 reproducibility and architecture evidence complete.
- [ ] Slice 2 raw factors, ranking calculation, citations, and ties verified.
- [ ] Slice 3 target traceability and durable roadmap propagation verified.
- [ ] No tracked production, test, generated, configuration, package, or CI
      change is included.
- [ ] `rtk pnpm run qlty` passes for every docs-only slice.
- [ ] `rtk pnpm run lint:md` passes for Markdown structure and links.

## Notes

- Keep requirements and measurement boundary decisions in `SPECS.md`.
- Keep temporary baseline and intake evidence in `BASELINE.md` after Slice 1.
- Keep plan state, approval, validation, risks, and Feature Exit readiness here.
