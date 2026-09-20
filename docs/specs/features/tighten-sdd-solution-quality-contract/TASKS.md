# Feature Tasks: Tighten SDD Solution Quality Contract

## Agent Brief

- Purpose: correct exactly three PR #319 findings in the existing Solution
  Shape contract without reopening its broader design.
- Approved or active slice: Slice 1, including the reviewed disposable-
  snapshot observation procedure, approved for implementation after the
  focused replan commit succeeds.
- Do not edit runtime, tests, packages, generated artifacts, configuration,
  `.qlty`, `package.json`, or `engines.vscode`.
- Do not add a skill, role, coordinator, wrapper, or evidence store.
- Read first: `SPECS.md`, this file, and the durable surface being corrected.
- Read `TRACEABILITY.md` only to verify cross-surface coverage.
- Validate with disposable-snapshot qlty check/smells observations and the
  aggregate final qlty run, focused Markdown lint, architecture and full Verify
  evidence, and repeated primary-worktree path/status plus complete deterministic
  path-and-hash manifests. Status equality alone is not evidence of
  non-mutation.
- Approval and document-role policy: see `docs/specs/README.md`.
- Next decision: commit the approved replan package, then resume Slice 1.

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
- Review status: Targeted replan review Ready with no actionable findings
- Human approval: Approved, including the targeted disposable-snapshot replan
- Active implementation slice: Slice 1 after the focused replan commit
- Replanning trigger: the approved baseline procedure proved invalid because
  `rtk pnpm exec qlty check` created `.qlty/plugin_cachedir` and
  `.qlty/results` in the primary worktree outside the allowlist. This replan
  moves both comparable and aggregate qlty observations into disposable
  snapshots; the three findings, one slice, eight durable/two evidence paths,
  and lifecycle remain unchanged.

## Human Approval

- Status: Approved
- Approved at: original scope and targeted replan approved in current
  conversation
- Approved scope: Slice 1, `Correct The Per-Slice Quality Evidence Contract`,
  within the reviewed approval boundary below, including the disposable-
  snapshot comparable and aggregate qlty procedure.
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

The focused replan package must be committed by `approval-committer` before
Slice 1 resumes.

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
    observations, executed inside exact disposable filesystem/worktree
    snapshots rather than the primary worktree: `rtk pnpm exec qlty check` and
    `rtk pnpm exec qlty smells --no-snippets`, using the same configuration,
    scope, identity, severity, and measured value. The baseline snapshot must
    represent the approved plan-commit state. The final snapshot must represent
    the exact reviewed final state, including approved tracked and untracked
    edits and deletions. Run the entire aggregate `rtk pnpm run qlty` inside
    the disposable final snapshot, never on the primary worktree. Qlty caches,
    results, logs, and other runtime artifacts may be created only inside the
    disposable snapshot and are discarded with it; none are synchronized back.
    No persistent script, wrapper, config change, cleanup exception, or new
    tool is added. During snapshot preparation and every qlty run, capture
    `git status --short --untracked-files=all` plus the complete deterministic
    path-and-hash manifest; the primary worktree must remain identical and any
    primary mutation is a blocker. If snapshot qlty formatting
    changes analyzed source or evidence content, inspect the snapshot diff and
    synchronize only approved/evidence paths as an intentional implementation
    edit after separate allowlist analysis. Any outside-allowlist change blocks
    and requires Replanning. After an approved sync, rebuild the exact final
    snapshot from the updated primary and rerun the check/smells pair plus the
    aggregate until the aggregate causes no analyzed source/evidence change;
    only that stable final snapshot is final evidence.
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
  aggregate inside the disposable final snapshot; no custom comparison script
  or wrapper is justified or proposed.
- Automatic evidence versus reviewer judgment: qlty supplies observations and
  the architecture suite enforces only its existing catalog. Stable-identity
  comparability, reliable metric mapping, semantic ownership, abstraction
  value, and correct selected-slice use remain reviewer judgments.
- qlty baseline/final: this policy-only slice does not change code. Its
  implementation must nevertheless run the comparable pair and the entire
  aggregate `rtk pnpm run qlty` only inside exact disposable snapshots. The
  baseline snapshot represents the approved plan-commit state; the final
  snapshot represents the exact reviewed final state, including approved
  tracked/untracked edits and deletions. Ensure each snapshot has local
  disposable qlty cache/result/log destinations rather than inherited links to
  the primary worktree or user cache, then discard it; snapshot-local artifacts
  are never synchronized. Verify snapshot fidelity with a manifest of every
  analyzed source/config path, excluding only declared qlty runtime artifacts
  inside the snapshot. During snapshot preparation and each qlty run, capture
  `git status --short --untracked-files=all` plus the complete deterministic
  path-and-hash manifest of all tracked and
  non-ignored untracked files, including clean tracked paths, additions,
  deletions, and every file expanded from untracked directories. Record an
  explicit absence/deletion entry for a path missing at that state. Use the
  exact path enumeration command `git ls-files --cached --others
  --exclude-standard -z` piped to `xargs -0 -n1 shasum -a 256`, then to
  `LC_ALL=C sort`, with deterministic absence entries for missing paths. Compare
  this complete manifest before and after snapshot preparation and each qlty
  run; analyze the approved/evidence allowlist separately and never substitute
  that subset comparison for the complete manifest. A new or mutated primary
  path outside the allowlist is a blocker/Replanning trigger. If aggregate
  formatting changes analyzed source/evidence content, inspect the snapshot
  diff, synchronize only approved/evidence paths as an intentional
  implementation edit, rebuild the exact final snapshot, and repeat the pair
  plus aggregate until no analyzed source/evidence change remains. Future code
  slices record each finding's identity, explicit severity ordering, measured
  baseline/final values, and explicit higher-is-worse or lower-is-worse
  direction in their own evidence block.
- Replanning trigger check: stop if correction requires a fourth finding,
  changed lifecycle/document role, new automation, changed qlty configuration,
  changed runtime/test/package surface, or any broader semantic ownership,
  port/adapter, framework, approval, or compatibility decision. Also stop for
  any unexpected primary-worktree mutation, qlty runtime output outside the
  disposable snapshot, snapshot source/config fidelity mismatch, or new or
  mutated path outside the approved allowlist.

- Acceptance:
  - All durable surfaces distinguish reliably finding-mapped worsening
    (Finding/NG) from movement that cannot be mapped reliably (advisory) and
    keep unchanged unrelated findings outside cleanup scope. Every comparable
    finding records its explicit severity ordering, baseline/final severity,
    measured values, and whether higher or lower measured values are worse;
    worsening follows that comparator, including lower-is-worse metrics.
  - Baseline and comparable final use the same non-mutating check/smells pair
    inside exact disposable snapshots; the baseline snapshot is the approved
    plan-commit state and the final snapshot is the exact reviewed final state,
    including approved tracked/untracked edits and deletions. Run the entire
    aggregate `rtk pnpm run qlty` in the disposable final snapshot, never on
    primary. Qlty runtime artifacts are created only inside and discarded with
    the snapshot. Verify snapshot fidelity with a source/config manifest
    excluding only declared qlty runtime artifacts. During snapshot preparation
    and each qlty run, capture before/after primary status plus complete
    deterministic path-and-hash manifests over all tracked and non-ignored
    untracked files, including clean
    tracked paths, additions, deletions, and full untracked expansion; perform
    allowlist analysis separately. If snapshot formatting changes analyzed
    source/evidence content, inspect the diff and synchronize only approved or
    evidence paths as an intentional implementation edit. Rebuild the exact
    final snapshot after sync and repeat the pair plus aggregate until aggregate
    causes no analyzed source/evidence change; only the stable snapshot is final
    evidence. Primary state must remain identical during preparation and qlty
    execution. Any outside-allowlist or unexpected primary mutation is a
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

  - Prepare two exact disposable filesystem/worktree snapshots without adding
    a repo script, wrapper, config, cleanup exception, or new tool. The baseline
    snapshot represents the approved plan-commit state. The final snapshot
    represents the exact reviewed final state, including approved tracked and
    untracked edits and deletions. Before and after each snapshot preparation,
    capture `git status --short --untracked-files=all` plus the complete
    deterministic path-and-hash manifest of all tracked and non-ignored
    untracked files, including clean tracked paths, additions,
    deletions, and every file expanded from untracked directories. Record
    explicit absence/deletion entries. Keep primary state identical during
    preparation; any mutation is a blocker/Replanning trigger. Perform
    allowlist analysis separately rather than substituting a subset comparison.
  - In each disposable snapshot, materialize local qlty runtime destinations
    rather than inherited links to the primary worktree or user cache. Run
    `rtk pnpm exec qlty check` and `rtk pnpm exec qlty smells --no-snippets`
    separately in the snapshot with the same configuration and scope, then run
    the entire aggregate `rtk pnpm run qlty` in the disposable final snapshot,
    never on primary. Capture the primary status command
    (`git status --short --untracked-files=all`) and the complete path-and-hash
    manifest immediately before and after each qlty run and once after snapshot
    discard; primary state must remain identical during preparation and
    execution.
    Qlty caches, results, logs, and other runtime artifacts may exist only
    inside the disposable snapshot. Verify snapshot fidelity with a manifest of
    every analyzed source/config path, including `.qlty/qlty.toml`, package
    manifests, and lockfiles; exclude only the declared snapshot-local qlty
    runtime paths `.qlty/plugin_cachedir/**`, `.qlty/results/**`,
    `.qlty/logs/**`, and `.qlty/out/**`. If snapshot formatting changes
    analyzed source/evidence content, inspect the snapshot diff and synchronize
    only approved/evidence paths as an intentional implementation edit; any
    outside-allowlist change blocks/Replans. Rebuild the exact final snapshot
    from the updated primary and repeat the pair plus aggregate until aggregate
    causes no analyzed source/evidence change; discard all snapshot-local
    artifacts without synchronization.
  - Compare rule, path, symbol/location when available, and record for each
    comparable finding the explicit severity ordering, baseline/final severity,
    measured values, and higher-is-worse or lower-is-worse metric direction.
    Any new or adverse movement under that comparator is Finding/NG. Record
    only identity or direction that cannot be mapped reliably as advisory, and
    do not absorb unchanged unrelated findings.
  - Run the aggregate `rtk pnpm run qlty` only in the disposable final
    snapshot, never on the primary worktree. If snapshot formatting changes
    analyzed source/evidence content, inspect the snapshot diff; only approved
    or evidence paths may be deliberately synchronized as an implementation
    edit after separate allowlist analysis. Any outside-allowlist change blocks
    and requests Replanning. Rebuild the exact final snapshot from the updated
    primary and rerun check, smells, and aggregate until the aggregate causes no
    analyzed source/evidence change; use only that stable final snapshot for
    final evidence. Snapshot-local qlty artifacts are discarded and never
    synchronized.
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
  - Run `rtk git diff --check`; compare final primary complete path-and-hash
    manifest and changed-path output with the approved durable/evidence-only
    allowlists and the initial complete manifest. This comparison includes all
    clean tracked paths, additions, deletions, and fully expanded non-ignored
    untracked files; allowlist analysis is separate and cannot replace it.
    Verify each snapshot's analyzed source/config manifest against its expected
    baseline or final state, with only the declared snapshot-local qlty runtime
    paths excluded. Confirm `.qlty/qlty.toml`, `package.json`, and
    `engines.vscode` are unchanged and no generated validation output is
    included in the primary worktree. A new or mutated path outside the
    allowlist blocks the slice and requires Replanning.
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
  ownership; repeated qlty wording could drift; a mutating aggregate could
  alter reviewed content or contaminate primary state; status equality could
  overlook content mutation, deletions, or untracked artifacts; snapshot
  fidelity could omit a reviewed source path; a missing severity ordering or
  wrong metric direction could misclassify a regression (including a
  lower-is-worse metric); and multi-slice tools could still read the nearest
  global evidence. Mitigate with exact disposable snapshots, snapshot-local
  qlty runtime paths, complete path-and-hash manifests, separate allowlist
  analysis, explicit approved-sync convergence, per-finding comparators,
  allowlisted paths, and selected-slice dry-run evidence.
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
