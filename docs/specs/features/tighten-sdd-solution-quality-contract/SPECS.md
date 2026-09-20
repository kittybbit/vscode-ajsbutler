# Feature Specification: Tighten SDD Solution Quality Contract

## Purpose

Correct the durable `Solution Shape` contract so every implementation slice
owns deterministic evidence and qlty regression comparison is strict,
comparable, and non-mutating.

## Minimal Context

- Current decision: correct exactly three findings from the PR #319 review
  without reopening the broader Solution Shape design.
- Feature kind: transient corrective branch feature selected on
  `codex/strengthen-sdd-solution-quality-gates`; it is not roadmap work.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs the cross-surface mapping.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD lifecycle,
  approval, validation, document-role, and Feature Exit policy.

## Origin

- Source: user review of PR #319 with exactly three corrective findings.
- Prior-feature relationship: corrective successor to the closed
  `strengthen-sdd-solution-quality-gates` feature. The prior feature remains
  closed; this feature changes only the defective durable contract it left.
- JP1/AJS reference basis: not applicable; this is repository-policy work with
  no JP1/AJS or extension behavior change.
- Roadmap relationship: none; no product work, ordering, or entry condition
  changes.
- Existing-feature overlap: inherited product feature folders remain outside
  this selected feature.
- Implementation-slice plan: `TASKS.md` (to be authored in Planning Mode).

## Requirements

### R1: Strict Comparable-Finding Disposition

- A new qlty finding or a comparable worsening of an existing finding's
  measured severity or metric must be an actionable Finding and an NG result
  for the slice.
- Comparison must use a stable finding identity, including rule, path, and
  symbol or location where available, plus the comparable measured value or
  severity needed to detect worsening.
- Only metric movement that cannot be mapped reliably to a specific comparable
  finding remains a review signal rather than an automatic Finding.
- Unchanged, unrelated baseline findings remain outside the slice scope; this
  correction must not require their cleanup.

### R2: Non-Mutating Comparable Observation

- Pre-edit baseline and comparable final observation must use the same
  non-mutating command set, configuration, scope, and finding identity.
- The non-mutating observation must run `qlty check` and
  `qlty smells --no-snippets`, or an equivalent pair that cannot change the
  worktree.
- `rtk pnpm run qlty`, including its formatting step, remains required as
  separate final validation and must not serve as either comparable
  observation.
- The comparable final observation must describe the final reviewed diff; if
  final validation changes files, the non-mutating observation must be
  repeated afterward.

### R3: Per-Slice Solution Shape Evidence

- The reusable `TASKS.md` template must place `Solution Shape Evidence` inside
  each implementation slice rather than once at feature-plan scope.
- Each slice must own the evidence for its approved semantic ownership,
  abstractions, framework decision, qlty comparison when applicable, and
  Replanning trigger check.
- Planning, plan review, implementation, and implementation review must read
  and update the evidence for the selected slice, without treating another
  slice's evidence as authorization.

### R4: Contract-Preserving Correction

- The correction must preserve the existing meaning of semantic ownership,
  meaningful ports/adapters, abstraction responsibility, framework-first
  decisions, outer-layer framework limits, and unrelated-baseline scope.
- The SDD lifecycle, role ownership, Human Approval, Completion Approval,
  Closure Approval, approval-gated commits, Replanning, and Feature Exit must
  remain unchanged.
- No new skill, role, coordinator, validation wrapper, or parallel evidence
  store may be introduced.

## Architecture

- Domain: none; no product code or domain meaning changes.
- Application: none; existing host-neutral use cases and ports are unchanged.
- Presentation: none; host and framework boundaries are unchanged.
- Infrastructure: none; adapters and external integrations are unchanged.
- Bootstrap: none; composition and lifecycle ownership are unchanged.

## Impact Analysis

### Dependency Impact

- Durable correction surfaces are the current Solution Shape contract in
  `AGENTS.md`, `docs/specs/architecture.md`,
  `docs/specs/features/_templates/TASKS.template.md`, and the existing
  `.agents/skills/sdd-plan-task/SKILL.md`,
  `.agents/skills/sdd-review-plan/SKILL.md`,
  `.agents/skills/sdd-implement-task/SKILL.md`, and
  `.agents/skills/sdd-review-implementation/SKILL.md` procedures.
- `docs/specs/README.md` is a consistency surface only for R1 because its
  current metrics-only guidance must not contradict the strict disposition;
  its lifecycle and document-role ownership remain unchanged.
- Propagation decision: the durable surfaces must agree on comparable finding
  identity and outcome, non-mutating observation versus final validation, and
  slice-local evidence ownership. Planning will determine the smallest
  cohesive approved edit; intake does not sequence or edit those surfaces.
- Intake boundary: only this temporary feature folder is created now.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none; runtime and packaging surfaces
  are unchanged.
- Changed scenarios: none; repository process policy is not a behavior-contract
  use case and does not warrant Gherkin.

### Alternative Considerations

- Keep all metric movement advisory: rejected because a severity or measured
  value worsening on the same comparable finding is a deterministic
  regression.
- Use `rtk pnpm run qlty` for baseline and comparison: rejected because its
  formatting phase can mutate the observed worktree.
- Keep one feature-global evidence block: rejected because evidence and
  approval belong to individual implementation slices.
- Add a comparison script, skill, role, coordinator, or qlty threshold:
  rejected; the correction belongs in the existing documentation contract and
  lifecycle procedures.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the unchanged lifecycle gate.
- Scope changes requiring re-approval: any fourth review finding, lifecycle or
  role change, new automation or wrapper, qlty configuration or threshold
  change, `engines.vscode` change, or runtime, test, package, generated, or
  product-behavior change.

## Compatibility

- VS Code compatibility follows the unchanged `package.json`
  `engines.vscode` contract.
- Web extension compatibility: unchanged; only repository process
  documentation is in scope.
- Desktop extension compatibility: unchanged; only repository process
  documentation is in scope.
- JP1/AJS and definition-file compatibility: not applicable and unchanged.
- Model, Serena, or agent choice does not change this contract or any SDD gate.

## Acceptance Criteria

- All durable Solution Shape surfaces classify a comparable increase in an
  existing finding's severity or measured metric as a Finding/NG, alongside
  new findings.
- Only movement that cannot be mapped reliably to a comparable finding remains
  an advisory review signal, while unchanged unrelated baseline findings stay
  out of scope.
- Baseline and comparable final evidence use the same non-mutating `qlty check`
  plus `qlty smells --no-snippets` observation, or an equivalent non-mutating
  pair, against the final reviewed diff.
- `rtk pnpm run qlty` remains separate final validation and is never described
  as the pre-edit baseline or comparable final observation.
- The reusable task template locates a complete `Solution Shape Evidence`
  block inside each implementation slice, and each lifecycle procedure uses
  the selected slice's evidence.
- The three corrections are mutually consistent without changing the broader
  Solution Shape rules, lifecycle, approvals, Feature Exit, role ownership,
  desktop/web behavior, or `engines.vscode`.
- No runtime, tests, packages, generated artifacts, configuration, `.qlty`
  thresholds, skills, roles, coordinators, or validation wrappers are added or
  changed.

## Non-Goals

- Reopening semantic-ownership, port/adapter, abstraction-responsibility, or
  framework-boundary decisions from the closed predecessor feature.
- Changing JP1/AJS parsing, semantics, commands, UI, runtime behavior, tests,
  packages, or durable use cases.
- Redesigning SDD lifecycle, approval, commit, Replanning, or Feature Exit
  behavior.
- Automating qlty comparison or changing `.qlty` configuration or thresholds.
- Fixing unrelated pre-existing qlty findings.
- Adding this transient correction to `docs/specs/roadmap.md`.

## Open Questions

- None for intake. Planning must map exactly these three findings to the
  smallest cohesive correction without expanding the contract.
