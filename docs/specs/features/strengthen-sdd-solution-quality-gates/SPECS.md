# Feature Specification: Strengthen SDD Solution Quality Gates

## Purpose

Strengthen the existing SDD planning, review, and implementation gates so a
proposed solution and its final diff demonstrate real semantic ownership,
purposeful abstractions, framework-first decisions, and no new or worsened
qlty smells without absorbing unrelated baseline cleanup.

## Minimal Context

- Current decision: define the policy outcomes that later Planning must map to
  the existing SDD surfaces without changing the lifecycle or product behavior.
- Feature kind: transient branch feature selected for
  `codex/strengthen-sdd-solution-quality-gates`; it is not roadmap work.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs the cross-surface mapping.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD lifecycle,
  approval, validation, document-role, and Feature Exit policy.

## Origin

- Source: branch goal to close solution-quality gaps in the existing SDD
  planning/review/implementation process.
- JP1/AJS reference basis: not applicable; this feature changes repository
  policy and process only, with no JP1/AJS or extension behavior change.
- Roadmap relationship: none; no unfinished product work, sequencing, or entry
  condition changes.
- Existing-feature overlap: none; inherited product feature folders remain
  outside this selected feature.
- Implementation-slice plan: `TASKS.md` (to be authored in Planning Mode).

## Requirements

### R1: Semantic Ownership Evidence

- Planning must identify the component or layer that owns each material piece
  of solution meaning, including its decisions, invariants, translations, and
  lifecycle responsibility where applicable.
- Plan review and implementation review must reject ownership that is merely
  named or relocated while the real semantic decision remains elsewhere or is
  left ambiguous.
- Implementation evidence must show that names, contracts, dependencies, and
  tests agree with the approved ownership decision.

### R2: Meaningful Abstraction Responsibility

- Every introduced or retained abstraction in approved scope must have a
  concrete responsibility beyond forwarding the same request and response.
- Pure delegation or responsibility laundering must be rejected when it adds
  no policy, translation, validation, lifecycle, compatibility, or boundary
  value.
- Legitimate ports and adapters must remain supported when they preserve
  dependency direction, isolate an external concern, translate a neutral
  contract, or own another explicit boundary responsibility.

### R3: Framework-First Decisions And Wrapper Limits

- Planning must evaluate an available framework, platform, or established
  repository capability before proposing a custom mechanism for the same job.
- A custom mechanism must record the concrete gap or repository constraint
  that makes the framework-first option insufficient.
- Framework wrappers must stay at an outer-layer boundary and must earn their
  existence through translation, isolation, lifecycle, error normalization,
  compatibility, or test-boundary responsibility; generic pass-through
  wrappers are not an acceptable default.
- These rules must preserve the current dependency direction and the existing
  application-port and infrastructure/presentation-adapter model.

### R4: qlty Baseline-To-Final Delta

- Each code slice must record comparable qlty evidence before implementation
  and after the final diff.
- The final diff must introduce zero new smells and worsen zero existing
  smells in the approved scope.
- Unrelated pre-existing findings remain baseline evidence, not implicit slice
  scope; resolving them requires separately approved scope.
- Metrics-only movement remains a review signal under the existing policy and
  does not become an automatic unrelated refactor mandate.

### R5: Lifecycle-Preserving Integration

- The strengthened gates must integrate into the current Planning, plan
  review, implementation, and implementation-review responsibilities.
- Human Approval, Completion Approval, Closure Approval, approval-gated
  commits, Replanning, and Feature Exit must remain unchanged.
- Policy ownership must remain in the existing repository documents and four
  existing SDD skills; no new skill, wrapper, coordinator, or parallel
  lifecycle may be introduced.

## Architecture

- Domain: no product-code change; future plans must identify genuine domain
  meaning when domain ownership is claimed.
- Application: no product-code change; legitimate host-neutral use cases and
  ports remain valid when they own policy or dependency-boundary meaning.
- Presentation: no product-code change; host and UI framework integration and
  any justified framework wrapper remain outer-layer concerns.
- Infrastructure: no product-code change; adapters remain legitimate when
  they translate or isolate external systems behind application-owned ports.
- Bootstrap: no product-code change; existing composition and lifecycle
  ownership remain unchanged.

## Impact Analysis

### Dependency Impact

- Durable target surfaces for later Planning are `AGENTS.md`,
  `docs/specs/architecture.md`,
  `docs/specs/features/_templates/TASKS.template.md`, and the existing
  `.agents/skills/sdd-plan-task/SKILL.md`,
  `.agents/skills/sdd-review-plan/SKILL.md`,
  `.agents/skills/sdd-implement-task/SKILL.md`, and
  `.agents/skills/sdd-review-implementation/SKILL.md` procedures.
- Propagation decision: those surfaces must express one consistent gate from
  solution design through final review. `docs/specs/README.md` remains the SDD
  lifecycle, approval, validation, document-role, and Feature Exit SSOT and is
  not an intake edit target.
- Intake boundary: this feature creation changes only this temporary feature
  folder. It does not edit or sequence the durable target surfaces.

### Breaking Change Analysis

- User-visible behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none; runtime and packaging surfaces
  are unchanged.
- Changed scenarios: none; architecture and process policy are a poor fit for
  Gherkin behavior scenarios.

### Alternative Considerations

- Rely on general KISS/SOLID wording: rejected because it does not require
  ownership evidence, expose responsibility laundering, or compare quality
  findings across a slice.
- Ban wrappers or delegation categorically: rejected because ports and
  adapters are required to preserve dependency direction and external-system
  isolation.
- Require cleanup of every baseline qlty issue: rejected because it would
  silently expand approved scope and undermine slice reviewability.
- Add a new quality role, coordinator, skill, or qlty threshold: rejected;
  the branch goal is to strengthen the existing gates and preserve their
  ownership and configuration.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the existing lifecycle gate.
- Scope changes requiring re-approval: adding another lifecycle role or skill,
  changing approval/commit/Feature Exit semantics, changing qlty configuration
  or thresholds, changing `engines.vscode`, or changing runtime, test,
  generated, packaging, or product behavior.

## Compatibility

- VS Code compatibility continues to follow the unchanged `package.json`
  `engines.vscode` contract.
- Web extension compatibility: unchanged; the feature is repository policy
  and process documentation only.
- Desktop extension compatibility: unchanged; the feature is repository
  policy and process documentation only.
- JP1/AJS and definition-file compatibility: not applicable and unchanged.
- Model, Serena, or agent choice does not change these policy outcomes or the
  SDD approval gate.

## Acceptance Criteria

- The existing SDD planning and review gates require explicit, testable
  semantic-ownership decisions for material solution responsibilities.
- The gates distinguish meaningful ports/adapters and boundary abstractions
  from pure delegation or responsibility laundering.
- The gates require a framework-first decision and constrain framework
  wrappers to justified outer-layer responsibilities.
- Code-slice evidence compares qlty baseline and final results and accepts zero
  new or worsened smells without pulling unrelated baseline findings into
  scope.
- `AGENTS.md`, architecture guidance, the task template, and the four existing
  SDD skills remain mutually consistent after implementation.
- The current lifecycle, role ownership, all three human approval gates,
  approval-gated commits, Replanning, Feature Exit, desktop/web compatibility,
  and `engines.vscode` are preserved.
- No new skill, wrapper, coordinator, qlty threshold, product behavior, test
  expectation, generated artifact, or configuration change is introduced.

## Non-Goals

- Changing JP1/AJS parsing, semantics, commands, UI, runtime behavior, or
  durable use cases.
- Redesigning the SDD lifecycle, role catalog, approval gates, commit gates,
  or Feature Exit.
- Adding tools, automated enforcement code, new skills, new coordinators, or
  repository-specific wrapper layers.
- Changing `.qlty` configuration, quality thresholds, `package.json`, or
  `engines.vscode`.
- Fixing unrelated pre-existing qlty findings.
- Adding this transient policy change to `docs/specs/roadmap.md`.

## Open Questions

- None for intake. Planning must decide the smallest cohesive propagation
  across the named durable surfaces without changing the approved purpose.
