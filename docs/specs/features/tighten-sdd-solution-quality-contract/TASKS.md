# Feature Tasks: Tighten SDD Solution Quality Contract

## Agent Brief

- Purpose: correct exactly three PR #319 findings in the existing Solution
  Shape contract without reopening its broader design.
- Approved or active slice: Slice 1, approved for implementation after the
  focused planning-package commit succeeds.
- Do not edit runtime, tests, packages, generated artifacts, configuration,
  `.qlty`, `package.json`, or `engines.vscode`.
- Do not add a skill, role, coordinator, wrapper, or evidence store.
- Read first: `SPECS.md`, this file, and the durable surface being corrected.
- Read `TRACEABILITY.md` only to verify cross-surface coverage.
- Validate with non-mutating qlty observations, final qlty, focused Markdown
  lint, architecture and full Verify evidence, and repeated path/status plus
  deterministic content-hash checks. Status equality alone is not evidence of
  non-mutation.
- Approval and document-role policy: see `docs/specs/README.md`.
- Next decision: commit the approved planning package, then implement Slice 1.

## Sync Rule

- Update this file in the same commit whenever the slice is completed,
  re-scoped, or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Other
  feature folders inherited from the base branch remain out of scope.
- Update `docs/specs/roadmap.md` only if unfinished repository-level work,
  ordering, entry conditions, or unresolved product concerns change.
- Keep current approval, validation, risk, production-readiness, and Feature
  Exit evidence; remove obsolete work-log detail.

## Plan Status

- Status: Approved
- Planning scope: one policy-correction slice covering the three findings and
  their required consistency propagation.
- Review status: Ready for approval; independent review completed with no
  findings
- Human approval: Approved
- Active implementation slice: Slice 1

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1, `Correct The Per-Slice Quality Evidence Contract`,
  within the reviewed approval boundary below.
- Approved paths:
  - Plan package:
    `docs/specs/features/tighten-sdd-solution-quality-contract/SPECS.md`,
    `docs/specs/features/tighten-sdd-solution-quality-contract/TASKS.md`, and
    `docs/specs/features/tighten-sdd-solution-quality-contract/TRACEABILITY.md`.
  - Durable Slice 1 targets: `AGENTS.md`, `docs/specs/README.md`,
    `docs/specs/architecture.md`,
    `docs/specs/features/_templates/TASKS.template.md`,
    `.agents/skills/sdd-plan-task/SKILL.md`,
    `.agents/skills/sdd-review-plan/SKILL.md`,
    `.agents/skills/sdd-implement-task/SKILL.md`, and
    `.agents/skills/sdd-review-implementation/SKILL.md`.
  - Slice 1 evidence-only updates:
    `docs/specs/features/tighten-sdd-solution-quality-contract/TASKS.md` and
    `docs/specs/features/tighten-sdd-solution-quality-contract/TRACEABILITY.md`.

Implementation must not start while Status is Pending. A plan-reviewer
`Ready` verdict is not Human Approval. After explicit approval, the focused
planning package must be committed by `approval-committer` before Slice 1.

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

### Slice 1: Correct The Per-Slice Quality Evidence Contract

- Status: Approved
- Scope:
  - Correct the durable qlty disposition everywhere it appears: a new finding
    or a reliably comparable worsening of an existing finding under its
    recorded severity ordering and measured-metric direction is an actionable
    Finding and NG for the slice. For every comparable finding, record the
    concrete severity ordering and whether higher or lower measured values are
    worse; do not use an unstated “increase” shorthand. Only identity or
    direction that cannot be mapped reliably to a specific finding stays
    advisory; unchanged unrelated findings stay out of scope.
  - Define the pre-edit baseline and comparable final as the same non-mutating
    observations: `rtk pnpm exec qlty check` and
    `rtk pnpm exec qlty smells --no-snippets`, or a verified equivalent pair
    using the same configuration, scope, identity, severity, and measured
    value. Before and after each observation, capture both
    `git status --short --untracked-files=all` and a deterministic content-hash
    manifest that expands the complete untracked file set. Apply the same pair
    around the formatting-capable `rtk pnpm run qlty` final validation. If that
    aggregate run mutates any reviewed path, rerun both non-mutating commands
    with their before/after pair and use only the repeated result for final
    comparison. A new or mutated path outside the approved allowlist blocks the
    slice and requires Replanning.
  - Move the complete `Solution Shape Evidence` block in
    `TASKS.template.md` from plan scope into every `### Slice N` section. Make
    planning create, plan review assess, implementation read/update, and
    implementation review judge only the selected slice's block; another
    slice's evidence cannot authorize or satisfy the selected slice.
  - Preserve the prior semantic-owner/package, material-abstraction,
    port/adapter/factory, framework-first, outer-layer, automatic architecture
    evidence, and Replanning rules without broadening them.
- User / Domain Value: every approved slice has deterministic, non-mutating
  quality evidence, and an objectively worsened qlty finding cannot be waived
  as a generic metric signal or hidden in another slice's evidence.
- Cohesive Change Group: the three findings form one evidence contract shared
  by the concise repository rule, lifecycle SSOT consistency sentence, durable
  architecture rationale, reusable template, and four lifecycle procedures.
  Splitting them would leave baseline collection, disposition, or slice
  ownership internally contradictory.

#### Solution Shape Evidence

- Semantic owner and package/layer: `TASKS.md` owns evidence per implementation
  slice; `docs/specs/README.md` retains lifecycle, validation, document-role,
  approval, and Feature Exit ownership; `AGENTS.md` owns concise agent-facing
  rules; `docs/specs/architecture.md` owns durable Solution Shape rationale;
  each existing skill owns its role procedure.
- Material abstraction and boundary value: no product or validation wrapper is
  introduced. The existing `Solution Shape Evidence` record remains the
  approved per-slice contract and moves inside each slice so authorization and
  evidence share one boundary.
- Public names, contracts, dependencies, and tests: retain `Solution Shape`,
  `Solution Shape Evidence`, existing role names, lifecycle dependencies, and
  architecture-test boundaries. Correct only qlty observation/disposition and
  selected-slice evidence consumption.
- Relevant capability and custom-gap decision: use the existing qlty CLI
  subcommands directly for non-mutating observations and the existing package
  aggregate for final validation; no custom comparison script or wrapper is
  justified or proposed.
- Automatic evidence versus reviewer judgment: qlty supplies observations and
  the architecture suite enforces only its existing catalog. Stable-identity
  comparability, reliable metric mapping, semantic ownership, abstraction
  value, and correct selected-slice use remain reviewer judgments.
- qlty baseline/final: this policy-only slice does not change code. Its
  implementation must nevertheless verify the proposed commands are
  non-mutating by comparing exact `git status --short --untracked-files=all`
  snapshots and a deterministic content-hash manifest before and after each
  observation. The manifest command must expand all tracked and complete
  non-ignored untracked paths. Use this exact command: `git ls-files --cached
  --others --exclude-standard -z` piped to `xargs -0 -n1 shasum -a 256`, then
  to `LC_ALL=C sort`.
  Compare content for every approved/evidence path and every initially
  dirty/untracked path, not status equality alone. A path first appearing or
  changing outside the approved allowlist is a blocker/Replanning trigger.
  Future code slices record each finding's identity, explicit severity ordering,
  measured baseline/final values, and explicit higher-is-worse or
  lower-is-worse direction in their own evidence block.
- Replanning trigger check: stop if correction requires a fourth finding,
  changed lifecycle/document role, new automation, changed qlty configuration,
  changed runtime/test/package surface, or any broader semantic ownership,
  port/adapter, framework, approval, or compatibility decision.

- Acceptance:
  - All durable surfaces distinguish reliably finding-mapped worsening
    (Finding/NG) from movement that cannot be mapped reliably (advisory) and
    keep unchanged unrelated findings outside cleanup scope. Every comparable
    finding records its explicit severity ordering, baseline/final severity,
    measured values, and whether higher or lower measured values are worse;
    worsening follows that comparator, including lower-is-worse metrics.
  - Baseline and comparable final use the same non-mutating check/smells pair;
    final `rtk pnpm run qlty` is separate and triggers a repeated final
    observation whenever its before/after status or content-hash evidence shows
    mutation of any reviewed path. Status equality alone is insufficient.
    Every observation covers all approved/evidence paths and every initially
    dirty/untracked path, and a new or mutated path outside the allowlist is a
    blocker/Replanning trigger.
  - The template contains no plan-global Solution Shape evidence block. Every
    `### Slice N` carries the complete compact block, including semantic owner,
    material abstraction, public contracts/dependencies/tests, relevant
    capability/custom gap, automatic-versus-reviewer evidence, code-slice qlty
    comparison, and Replanning check.
  - Each of the four skills explicitly resolves the selected slice and uses
    only that slice's Solution Shape evidence for planning, review,
    implementation, or implementation review.
  - `docs/specs/README.md` changes only its contradictory metrics-only sentence
    and related qlty evidence wording needed for R1/R2 consistency; lifecycle,
    approval, validation ownership, document roles, and Feature Exit do not
    change.
  - The predecessor's semantic ownership, meaningful port/adapter and factory
    treatment, framework-first decision, outer-layer framework limit,
    architecture-test boundary, and Replanning triggers retain their meaning.
- Validation:

  - Before edits, save the exact `git status --short --untracked-files=all`
    output and a deterministic content-hash manifest for the complete tracked
    and non-ignored untracked set. Generate the manifest without adding a repo
    script or wrapper, using the same command every time: `git ls-files
    --cached --others --exclude-standard -z` piped to `xargs -0 -n1 shasum
    -a 256`, then to `LC_ALL=C sort`.
    The before/after evidence must cover every approved/evidence path and every
    initially dirty/untracked path, including untracked files expanded from
    directories. Run `rtk pnpm exec qlty check` and
    `rtk pnpm exec qlty smells --no-snippets` separately; capture status and
    manifest immediately before and after each command. Content or path
    mutation, not status equality alone, determines non-mutation. A newly
    created or mutated path outside the eight durable/two evidence-path
    allowlist is a blocker and Replanning trigger.
  - After edits and other potentially mutating validation, repeat the same two
    non-mutating commands with identical configuration and scope, with the same
    before/after status and content-hash pair around each command. Compare rule,
    path, symbol/location when available, and record for each comparable
    finding the explicit severity ordering, baseline/final severity, measured
    values, and higher-is-worse or lower-is-worse metric direction. Any new or
    adverse movement under that comparator is Finding/NG. Record only identity
    or direction that cannot be mapped reliably as advisory, and do not absorb
    unchanged unrelated findings.
  - Run `rtk pnpm run qlty` as separate formatting-capable final validation,
    with the same status and content-hash capture immediately before and after
    the aggregate run. If it mutates any reviewed path, inspect the exact
    mutation; if it mutates a path outside the allowlist, block and request
    Replanning. Otherwise rerun both non-mutating check/smells commands with
    their own before/after status and manifest pair, and use only that repeated
    observation for final comparison. Record the comparator with the final
    baseline/final evidence.
  - Run focused Markdown lint over the exact Markdown scope with this command:

    ```bash
    correction=docs/specs/features/tighten-sdd-solution-quality-contract
    rtk pnpm exec markdownlint-cli2 \
      AGENTS.md \
      docs/specs/README.md \
      docs/specs/architecture.md \
      docs/specs/features/_templates/TASKS.template.md \
      "$correction/TASKS.md" \
      "$correction/TRACEABILITY.md" \
      .agents/skills/sdd-plan-task/SKILL.md \
      .agents/skills/sdd-review-plan/SKILL.md \
      .agents/skills/sdd-implement-task/SKILL.md \
      .agents/skills/sdd-review-implementation/SKILL.md
    ```

  - Because `AGENTS.md` and `.agents/skills/**` are outside the Verify
    docs-only allowlist, reproduce full Verify evidence in workflow order:
    `rtk pnpm run lint:md`, `rtk pnpm run build`,
    `rtk pnpm run test:compile`, `rtk pnpm run test:desktop:run`, and
    `rtk pnpm run test:web:run`.
  - After test compilation, run the focused existing architecture suite:
    `rtk node ./node_modules/mocha/bin/mocha --ui tdd out/test/suite/architectureDependencyRules.test.js`.
  - Run `rtk git diff --check`; compare final
    `git status --short --untracked-files=all`, deterministic content-hash
    manifest, and changed-path output with the approved durable/evidence-only
    allowlists and the initial dirty/untracked path set. Confirm
    `.qlty/qlty.toml`, `package.json`, and `engines.vscode` are unchanged and
    no generated validation output is included. A new or mutated path outside
    the allowlist blocks the slice and requires Replanning.
  - Dry-run the revised template as a two-slice feature. Slice A owns an
    application WebAPI port and infrastructure adapter with fetch/credential
    isolation, translation, error normalization, timeout lifecycle, and its
    own qlty identities. Slice B owns a VS Code presentation command using the
    platform API at the outer boundary and a different qlty comparison. Select
    Slice B in each skill and verify that Slice A's ownership, adapter
    justification, baseline/final findings, or approval cannot satisfy or
    authorize Slice B; then select Slice A and verify the inverse. Confirm a
    same-request/same-response wrapper without port-contract value is still
    rejected and the legitimate adapter remains accepted.

- Production Readiness:
  - Failure mode: ambiguous “metric movement” could still waive a deterministic
    regression; a mutating baseline could invalidate comparison; or global
    evidence could authorize the wrong slice. Exact wording, status snapshots,
    and the two-slice dry run address these risks.
  - JP1/AJS compatibility: unchanged; no parser, definition, or semantic path
    changes.
  - Large or malformed input risk: none; no runtime data path changes.
  - Desktop/web impact: none; full Verify evidence is required because the
    branch is non-doc-classified, not because product behavior changes.
  - README/docs impact: the eight named durable policy surfaces change;
    product README, use cases, roadmap, context map, and glossary remain
    unchanged.
  - CHANGELOG impact: none under the repository criteria because observable
    extension behavior and documented user workflow do not change.
- Approval Boundary: one policy-correction slice limited to the eight durable
  paths and two evidence-only feature paths listed under Dependencies. Approval
  does not authorize runtime, test, package, generated, qlty-configuration,
  threshold, product, roadmap, or unrelated baseline cleanup changes.
- Dependencies:
  - Durable paths:
    - `AGENTS.md`
    - `docs/specs/README.md`
    - `docs/specs/architecture.md`
    - `docs/specs/features/_templates/TASKS.template.md`
    - `.agents/skills/sdd-plan-task/SKILL.md`
    - `.agents/skills/sdd-review-plan/SKILL.md`
    - `.agents/skills/sdd-implement-task/SKILL.md`
    - `.agents/skills/sdd-review-implementation/SKILL.md`
  - Evidence-only paths:
    - `docs/specs/features/tighten-sdd-solution-quality-contract/TASKS.md`
    - `docs/specs/features/tighten-sdd-solution-quality-contract/TRACEABILITY.md`
  - Read-only contracts: `package.json`, `.qlty/qlty.toml`,
    `.github/workflows/verify.yml`, and
    `src/test/suite/architectureDependencyRules.test.ts`.
- Risks: broad edits to `docs/specs/README.md` could disturb lifecycle
  ownership; repeated qlty wording could drift; “equivalent” could admit a
  mutating command; status equality could overlook content mutation or
  untracked artifacts; a missing severity ordering or wrong metric direction
  could misclassify a regression (including a lower-is-worse metric); and
  multi-slice tools could still read the nearest global evidence. Mitigate with
  a sentence-level SSOT correction, exact default commands, repeated
  before/after status plus deterministic content-hash manifests, explicit
  per-finding comparators, allowlisted paths, and selected-slice dry-run
  evidence.
- Out of Scope: a fourth PR finding; changes to lifecycle, roles, approvals,
  commits, Replanning, Feature Exit, document roles, runtime, tests, packages,
  generated artifacts, configuration, `.qlty`, thresholds, `engines.vscode`,
  product behavior, use cases, roadmap, inherited features, new automation or
  wrappers, and unrelated qlty cleanup.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the three findings must map exactly to one slice while eight durable
  surfaces and four lifecycle consumers remain mutually consistent.

## Feature Exit

- Definition of Done status: Not started; plan review, Human Approval, plan
  commit, Slice 1 implementation/review, Completion Approval/commit,
  independent Feature Exit, Closure Approval, and closure commit remain.
- Durable documentation updates: Slice 1 is the approved correction to the
  smallest existing policy surfaces; Feature Exit must verify no reusable
  correction remains only in this temporary feature folder.
- Open risks: exact command non-mutation and selected-slice isolation remain to
  be demonstrated during implementation and independently reviewed.

## Validation

- [x] Independent plan review returned `Ready` with no actionable finding.
- [x] Explicit Human Approval records the exact Slice 1 boundary.
- [ ] Record non-mutating baseline status evidence before implementation.
- [ ] Complete the Slice 1 validation sequence and two-slice dry run.
- [ ] Record final comparison and validation results in `TRACEABILITY.md`
      before implementation review.

## Notes

- Selection is fixed by the explicit task and the branch-created corrective
  feature folder; the closed predecessor feature is not reopened.
- One slice is the smallest useful unit because observation, disposition, and
  evidence locality are one contract, not independent file outcomes.
- This Planning Mode update grants no approval and makes no durable change.
