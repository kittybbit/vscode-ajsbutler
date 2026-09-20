# Feature Tasks: Strengthen SDD Solution Quality Gates

## Agent Brief

- Purpose: make solution shape and final-diff quality explicit at the existing
  SDD gates without changing the lifecycle.
- Feature kind: repository-policy documentation on the existing non-doc
  workflow branch. `AGENTS.md` and `.agents/skills/**/*.md` are outside the
  Verify docs-only allowlist, so this slice must use the full Verify evidence
  path even though it changes no product code.
- Approved or active slice: Slice 1, approved for implementation after the
  focused planning-package commit succeeds.
- Do not edit runtime, tests, generated artifacts, configuration, `.qlty`, or
  `package.json`.
- Keep this feature's `SPECS.md` read-only for Slice 1; an edit requires
  Replanning and a new approval boundary.
- Do not add a role, skill, coordinator, wrapper, or approval path.
- Read first: `SPECS.md`, this file, and the named durable target surface.
- Read `TRACEABILITY.md` only to verify cross-surface coverage.
- Treat `TASKS.md` as the plan/current-state record and `TRACEABILITY.md` as
  the requirement-to-validation evidence record; keep both current in the
  same planning or implementation commit.
- Validate with the full non-doc Verify sequence, targeted Markdown lint,
  qlty, diff check, the existing architecture dependency test, and the
  recorded dry run. Do not label this slice docs-only.
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
- Planning scope: one repository-policy documentation responsibility slice
  propagating a consistent `Solution Shape` gate across the seven durable
  surfaces named below. The branch is intentionally on the non-doc workflow:
  `AGENTS.md` and `.agents/skills/**/*.md` fall outside the Verify docs-only
  allowlist, so full Verify validation is required.
- Review status: Ready for approval; independent review completed with no
  findings
- Human approval: Approved
- Active implementation slice: Slice 1

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1, `Propagate The Solution Shape Quality Gate`, within
  the reviewed approval boundary below.
- Approved paths:
  - Plan package:
    `docs/specs/features/strengthen-sdd-solution-quality-gates/SPECS.md`,
    `docs/specs/features/strengthen-sdd-solution-quality-gates/TASKS.md`, and
    `docs/specs/features/strengthen-sdd-solution-quality-gates/TRACEABILITY.md`.
  - Durable Slice 1 targets: `AGENTS.md`, `docs/specs/architecture.md`,
    `docs/specs/features/_templates/TASKS.template.md`,
    `.agents/skills/sdd-plan-task/SKILL.md`,
    `.agents/skills/sdd-review-plan/SKILL.md`,
    `.agents/skills/sdd-implement-task/SKILL.md`, and
    `.agents/skills/sdd-review-implementation/SKILL.md`.
  - Slice 1 evidence-only updates:
    `docs/specs/features/strengthen-sdd-solution-quality-gates/TASKS.md` and
    `docs/specs/features/strengthen-sdd-solution-quality-gates/TRACEABILITY.md`.

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

### Slice 1: Propagate The Solution Shape Quality Gate

- Status: Approved
- Scope:
  - Add concise agent-facing obligations to `AGENTS.md` while retaining
    `docs/specs/README.md` as the lifecycle, approval, validation, document-role,
    and Feature Exit SSOT.
  - Add durable `Solution Shape` guidance to `docs/specs/architecture.md`:
    assign each material decision, invariant, translation, lifecycle, public
    name, contract, dependency, and test (where applicable) to a semantic
    owner and package/layer; require every material new or retained abstraction
    to state its responsibility; distinguish legitimate dependency-inverting
    ports from adapters that earn their boundary through applicable isolation,
    translation, error normalization, lifecycle, compatibility, or
    test-boundary responsibility; consider only the relevant framework,
    library, platform, or established repository capability; justify a custom
    mechanism only when one is actually proposed; and keep framework use at an
    outer boundary rather than coupling inner layers to it.
  - Replace generic task-template ceremony with compact evidence prompts under
    `Solution Shape`: owner/package and responsibility; material new or
    retained abstraction and why it earns its boundary; public names,
    contracts, dependency direction, and tests where applicable; relevant
    capability considered and any applicable custom-gap justification;
    automated architecture evidence; reviewer-only judgments; and comparable
    qlty evidence for code slices.
  - Make the same evidence flow executable in the four existing procedures:
    planning records it for every material new or retained abstraction, plan
    review challenges it, implementation preserves it and captures qlty
    baseline/final evidence, and implementation review compares the final diff
    to it, including the names, contracts, dependencies, and tests where
    applicable.
  - Define a material new or retained abstraction compactly for this gate as
    an exported or layer-crossing abstraction, port or adapter, contract-
    bearing wrapper, lifecycle owner, or abstraction that changes dependency
    direction or semantic ownership. Ordinary local helpers and type aliases
    are excluded unless they play one of those roles.
- User / Domain Value: maintainers can reject misplaced semantics, thin
  wrappers, avoidable custom mechanisms, and quality regressions before they
  become durable code while retaining legitimate Clean Architecture ports and
  adapters.
- Cohesive Change Group: one repository-policy documentation responsibility
  spanning the concise rule surface, durable architecture rationale, reusable
  task prompt, and the four role-owned enforcement points. Splitting by file or
  lifecycle stage would leave contradictory gates and is not independently
  useful.
- Acceptance:
  - All seven surfaces use `Solution Shape` consistently and agree on semantic
    owner/package placement; public names, contracts, dependency direction,
    and tests where applicable; abstraction responsibility; framework-first
    consideration; qlty comparison; and Replanning triggers.
  - A port may be valid because it owns dependency inversion and/or a
    host-neutral contract; it is not required to also own an adapter’s
    isolation or translation responsibility. An adapter earns validity through
    one or more applicable isolation, translation, error normalization,
    lifecycle, compatibility, or test-boundary responsibilities. A wrapper or
    abstraction that merely forwards the same request and response, with none
    of those responsibilities and no port contract value, fails.
  - Every planned prompt and review evaluates material new or retained
    abstractions using the definition in Scope. The retained-application-
    factory check is recorded separately from the port/adapter check so a
    factory’s composition or use-case-boundary role is not conflated with a
    port or adapter responsibility.
  - Framework-first means checking only a capability relevant to the proposed
    responsibility. It does not require framework adoption, speculative tool
    surveys, or inner-layer framework imports. A custom-gap justification is
    required only when the approved shape proposes a custom mechanism for a job
    a relevant existing capability could perform.
  - The architecture dependency test remains automatic evidence for import,
    construction, parser, telemetry, and layer rules already in its catalog.
    Semantic ownership, whether an abstraction earns its existence, framework
    sufficiency, custom-gap credibility, and qlty-delta disposition remain
    explicit reviewer judgments; the docs must not claim those are statically
    enforced.
  - Each future code slice captures a pre-edit qlty baseline and a final result
    in `TASKS.md` and `TRACEABILITY.md` with the identical qlty command and
    configuration, and a comparable finding identity (rule, path, and
    symbol/location where available). Review rejects new findings and
    worsening in approved scope, including occurrence or severity growth;
    new/worsened findings are listed separately from unchanged, unrelated
    baseline findings. Metric-only movement is recorded as a review signal.
    Unchanged, unrelated baseline findings neither fail the slice nor enter its
    scope.
  - Planning and implementation stop for Replanning when the approved solution
    shape changes: semantic owner or package/layer, contract or dependency
    direction, selected framework-versus-custom decision, abstraction or
    responsibility, affected surface, risk, validation, or approval boundary.
  - Human Approval, Completion Approval, Closure Approval, approval-gated
    commits, role ownership, Replanning, and Feature Exit remain unchanged.
- Validation:
  - Run the existing Markdown scope with `rtk pnpm run lint:md`, then run
    targeted Markdown validation for the omitted policy files with
    `rtk pnpm exec markdownlint-cli2 AGENTS.md docs/specs/architecture.md`.
    Also run `rtk pnpm run qlty` and `rtk git diff --check`.
  - Use the full non-doc Verify evidence sequence: `rtk pnpm run build`,
    `rtk pnpm run test:compile`, `rtk pnpm run test:desktop:run`, and
    `rtk pnpm run test:web:run`. Record the desktop and web results even though
    no runtime source is in the approved scope.
  - Compile and run the focused existing architecture suite with
    `rtk node ./node_modules/mocha/bin/mocha --ui tdd out/test/suite/architectureDependencyRules.test.js`.
  - Review the diff against the seven-path allowlist and confirm
    `.qlty/qlty.toml` and `package.json` (especially `engines.vscode`) are
    unchanged. The allowlist is the seven durable target paths plus
    evidence-only updates to this feature's `TASKS.md` and `TRACEABILITY.md`;
    no other feature-folder file, especially `SPECS.md`, may change.
  - Dry-run the resulting prompts against the existing WebAPI import boundary
    with separate cases: (a) accept `ImportAjsDefinitionViaWebApiPort` because
    the application owns a host-neutral dependency-inversion contract, without
    requiring adapter responsibilities; (b) accept
    `Jp1Ajs3WebApiImportAdapter` only because its infrastructure placement owns
    applicable credential/HTTP isolation, external-to-neutral translation,
    error normalization, and timeout lifecycle; (c) reject a newly proposed
    application wrapper whose only behavior is identical request/response
    forwarding; and (d) assess the retained
    `createImportAjsDefinitionViaWebApi` application factory separately,
    accepting it because its defensive connection/scope DTO copies preserve
    the application boundary before invoking the port, as proven by
    `src/test/suite/importAjsDefinitionViaWebApi.test.ts` (`copies request DTOs
    before invoking the port`). Do not leave this case as a pass/fail fork: if
    a later implementation contradicts that evidence, implementation review
    records the contradiction as a finding.
  - In the same WebAPI dry run, consider the relevant existing capabilities:
    `globalThis.fetch`, `AbortController`, the repository’s generated OpenAPI
    operation/contract, and the existing credential provider. Record a concrete
    custom gap if a custom mechanism is proposed (none is proposed in the
    baseline dry run), and verify any HTTP/framework wrapper remains in the
    outer infrastructure layer. Confirm `TASKS.md` and `TRACEABILITY.md`
    capture the exact qlty command/configuration, rule/path/symbol-location
    identity where available, separated new/worsened versus unchanged baseline
    findings, and no unrelated baseline cleanup is approved.
- Production Readiness:
  - Failure mode: inconsistent or over-broad wording could reject valid
    adapters, encourage framework leakage, or silently expand quality cleanup;
    cross-surface review and the dry run must catch these outcomes.
  - JP1/AJS compatibility: no parser, definition semantics, or supported-version
    behavior changes.
  - Large or malformed input risk: none; no runtime data path changes.
  - Desktop/web impact: production source, entry points, bundles, and manifest
    remain unchanged, but the non-doc branch classification requires recorded
    desktop and web Verify evidence.
  - README/docs impact: only the seven named durable policy surfaces change,
    with evidence-only updates permitted in this feature's `TASKS.md` and
    `TRACEABILITY.md`; `SPECS.md` remains read-only unless Replanning.
    `docs/specs/README.md`, use cases, README, roadmap, glossary, and context
    map remain unchanged because their owned responsibilities do not change.
  - CHANGELOG impact: none under the repository criteria because extension
    behavior and documented user workflow do not change.
- Approval Boundary: approve one repository-policy documentation slice limited
  to these seven durable target paths:
  `AGENTS.md`, `docs/specs/architecture.md`,
  `docs/specs/features/_templates/TASKS.template.md`,
  `.agents/skills/sdd-plan-task/SKILL.md`,
  `.agents/skills/sdd-review-plan/SKILL.md`,
  `.agents/skills/sdd-implement-task/SKILL.md`, and
  `.agents/skills/sdd-review-implementation/SKILL.md`. The boundary also
  permits evidence-only implementation updates to this selected feature's
  `TASKS.md` and `TRACEABILITY.md` for approval, status, validation, qlty, and
  dry-run records. It does not authorize edits to `SPECS.md` unless Replanning,
  or runtime, tests, generated artifacts, configuration, new skills, or
  baseline cleanup.
- Dependencies:
  - `AGENTS.md`
  - `docs/specs/architecture.md`
  - `docs/specs/features/_templates/TASKS.template.md`
  - `.agents/skills/sdd-plan-task/SKILL.md`
  - `.agents/skills/sdd-review-plan/SKILL.md`
  - `.agents/skills/sdd-implement-task/SKILL.md`
  - `.agents/skills/sdd-review-implementation/SKILL.md`
  - Existing policy in `docs/specs/README.md`, existing qlty configuration, and
    `src/test/suite/architectureDependencyRules.test.ts` are read-only inputs.
- Risks: duplicated language could drift; compact template prompts could become
  boilerplate; valid ports could be mistaken for adapters or rejected for not
  owning adapter responsibilities; retained factories could be conflated with
  port/adapter decisions; subjective review could be misstated as automatic
  enforcement; “framework-first” could be overread as framework coupling; the
  branch could be misclassified as docs-only; and a qlty baseline could become
  a cleanup mandate. Mitigate with one term, responsibility-based wording,
  explicit automatic/judgment boundaries, targeted Markdown checks, the full
  Verify evidence path, and the separate WebAPI dry-run cases.
- Out of Scope: edits to lifecycle policy or document roles in
  `docs/specs/README.md`; runtime/tests/generated/configuration; `.qlty`
  thresholds; `package.json` or `engines.vscode`; new roles, skills,
  coordinators, wrapper layers, or automated enforcement; product behavior;
  inherited feature folders; edits to this feature's `SPECS.md` unless
  Replanning; unrelated qlty findings; roadmap work.

## Traceability

- TRACEABILITY.md required: yes
- Reason: one policy slice must cover five requirements consistently across
  seven durable surfaces and preserve explicit automatic-versus-reviewer
  boundaries.

## Feature Exit

- Definition of Done status: Not started; plan review, Human Approval, the plan
  commit, Slice 1 implementation/review, Completion Approval/commit, independent
  Feature Exit, Closure Approval, and closure commit remain required.
- Durable documentation updates: Slice 1 is itself the approved
  repository-policy propagation to the smallest existing durable policy
  surfaces; Feature Exit must verify no reusable knowledge remains only in this
  temporary feature folder.
- Open risks: implementation review must confirm the approved wording and dry
  run outcomes; Human Approval does not waive the Completion or Closure gates.

## Validation

- [x] Independent plan review returned `Ready` with no actionable finding.
- [x] Explicit Human Approval records the exact Slice 1 boundary.
- [ ] Run the Slice 1 full non-doc Verify validation set after implementation,
      including build, test compilation, desktop tests, web tests, qlty, and
      targeted Markdown validation.
- [ ] Record changed paths, exact commands/configuration, qlty finding identity,
      separated new/worsened versus unchanged baseline findings, and all
      separate dry-run outcomes in `TASKS.md` and `TRACEABILITY.md` before
      implementation review.

## Notes

- The selected feature is established by the explicit task, matching branch,
  and branch-created feature folder.
- One slice is the smallest useful unit because the value is consistency across
  the existing gates; the seven files are not seven independent outcomes.
- Human Approval covers only the reviewed Slice 1 boundary; the planning
  package must be committed before any durable target changes begin.
