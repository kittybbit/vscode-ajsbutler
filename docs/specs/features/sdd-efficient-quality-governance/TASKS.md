# TASKS: sdd-efficient-quality-governance

## Agent Brief

- Purpose: reduce SDD reading cost and remove redundant validation or review.
- Approved slices: 1–5; implement exactly one at a time.
- Do not create feature `CONTEXT.md` files or duplicate SSOT policy.
- Treat new Qlty smells as fix-or-record decisions, never as silent metrics.
- Treat metrics-only movement as a review signal, not an automatic blocker.
- Start with the nearest validation; add checks only for the changed surface.
- Keep plan review and Feature Exit; use one final implementation review by default.
- Delegate only bounded, independent work; retain approval and integration.
- Do not edit extension runtime code, tests, generated artifacts,
  configuration, or CI.
- Do not close `import-definition-via-webapi` without its own Feature Exit
  approval.
- Read first: `docs/specs/README.md`, this `TASKS.md`, and `SPECS.md`.
- Read `TRACEABILITY.md` only when a slice requires traceability.
- Validate docs with `rtk pnpm run qlty` and `rtk pnpm run lint:md`.

## Plan Status

- Status: In Progress
- Planning scope: docs-only SDD context, quality-evidence, risk-based
  validation, review timing, template, and lightweight-check policy.
- Review status: Reviewed
- Human approval: Approved
- Active implementation slice: Slice 4

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slices 1–5, implemented one slice at a time

## Implementation Slices

### Slice 1: Define compact feature-document structure

- Status: Complete
- Scope: update the SDD SSOT and feature templates with minimal-context and
  table-first traceability guidance.
- User / Domain Value: future work begins with decisions needed now rather
  than a broad documentation scan.
- Cohesive Change Group: `docs/specs/README.md` and feature document templates.
- Acceptance: requirements 1–3 are met without introducing a `CONTEXT.md`.
- Validation: markdown lint and the documented structure check.
- Production Readiness:
  - Failure mode: duplicate policy; prevent by linking to SSOT.
  - JP1/AJS compatibility: none.
  - Large or malformed input risk: none.
  - Desktop/web impact: none.
  - README/docs impact: internal SDD documentation only.
  - CHANGELOG impact: none.
- Approval Boundary: SDD SSOT and templates only.
- Dependencies: none.
- Risks: existing feature-specific technical notes remain unchanged.
- Out of Scope: runtime, test, configuration, CI, and feature closure changes.

### Slice 2: Add phase-specific context and quality evidence

- Status: Complete
- Scope: update SDD skills and the active feature's `TASKS.md` to use compact
  briefs, phase-specific reading sets, and proportionate Qlty evidence.
- User / Domain Value: agents avoid broad reading while making smell and metric
  decisions visible before code-quality debt is silently accepted.
- Cohesive Change Group: four SDD skills and active feature task entry point.
- Acceptance: requirements 4–5 are met; the active feature exposes an Agent
  Brief; code slices name Qlty check, smell, and metric evidence when relevant.
- Validation: markdown lint and manual comparison against the SSOT.
- Production Readiness:
  - Failure mode: noisy historical metrics block work; metrics stay review-only.
  - JP1/AJS compatibility: none.
  - Large or malformed input risk: none.
  - Desktop/web impact: none.
  - README/docs impact: internal SDD documentation only.
  - CHANGELOG impact: none.
- Approval Boundary: `.codex/skills/sdd-*/SKILL.md` and active feature task brief.
- Dependencies: Slice 1.
- Risks: Qlty CLI evidence complements, but does not replace, human judgment.
- Out of Scope: changing Qlty configuration, package scripts, CI, or thresholds.

### Slice 3: Streamline validation and review timing

- Status: Complete
- Scope: define one risk-based validation ladder and one integrated final
  implementation review; align SDD skills and agent-facing guidance to it.
  The ladder distinguishes docs-only work, isolated code, and changes to
  parser/shared contracts, extension hosts, entry points, generated artifacts,
  or configuration. Replace the current `sdd-implement-task` three-pass review
  rule with this risk-based review depth.
- User / Domain Value: remove duplicate checks while retaining evidence for
  changed code, hosts, compatibility, and production risks.
- Cohesive Change Group: SSOT validation/review policy and SDD skill workflow.
- Acceptance: requirements 6–7 are met; docs-only work uses docs checks,
  isolated code uses nearest tests and qlty, and the higher-risk category adds
  relevant desktop/web tests and build evidence. Plan review, human approval,
  and Feature Exit remain distinct and mandatory.
- Validation: markdown lint; manual trace from changed-surface categories to
  required checks and review depth.
- Production Readiness:
  - Failure mode: a risky change omits a needed check; require explicit surface
    and risk justification in the slice plan.
  - JP1/AJS compatibility: none.
  - Large or malformed input risk: triggers relevant test selection.
  - Desktop/web impact: web checks remain required when shared or web paths change.
  - README/docs impact: internal SDD documentation only.
  - CHANGELOG impact: none.
- Approval Boundary: SDD SSOT, AGENTS summary, and SDD skill workflow only.
- Dependencies: Slices 1 and 2.
- Risks: concise policy must not be interpreted as permission to skip evidence;
  a second review is required for the higher-risk category or a discovered
  concern.
- Out of Scope: removing required tests or changing runtime test coverage.

### Slice 4: Define bounded subagent delegation

- Status: Approved
- Scope: document when independent investigation, review, or approved
  mechanical work may use a subagent, its concise input/output contract, and
  work retained by the coordinating agent.
- User / Domain Value: focused parallel work reduces context pollution without
  creating conflicting edits, hidden scope changes, or diluted accountability.
- Cohesive Change Group: SSOT model/agent guidance and SDD skill delegation rules.
- Acceptance: requirement 8 is met; subagent prompts have a bounded question,
  target files or symbols, constraints, concise evidence output, and no-change
  rule unless the approved task explicitly delegates a mechanical edit.
- Validation: markdown lint; manual trace to the existing SDD approval gate.
- Production Readiness:
  - Failure mode: a delegate broadens scope or edits conflicting files; retain
    ownership and forbid such work in the delegated brief.
  - JP1/AJS compatibility: none.
  - Large or malformed input risk: use focused investigation when relevant.
  - Desktop/web impact: host-impact review may be delegated read-only.
  - README/docs impact: internal SDD documentation only.
  - CHANGELOG impact: none.
- Approval Boundary: SSOT and SDD skill delegation guidance only.
- Dependencies: Slices 1–2.
- Risks: delegation overhead can exceed its benefit for local work.
- Out of Scope: autonomous approvals, unbounded agent swarms, or external actions.

### Slice 5: Document lightweight SDD checks

- Status: Approved
- Scope: add documented `rtk` checks for Agent Brief presence and `CONTEXT.md`
  absence; run docs-only validation.
- User / Domain Value: documentation-structure drift is caught cheaply before
  review; Qlty evidence remains a Slice 2–3 manual review responsibility.
- Cohesive Change Group: SSOT structure-check instructions and validation record.
- Acceptance: requirement 9 is met without a new package script or CI change.
- Validation: documented check, `rtk pnpm run qlty`, and `rtk pnpm run lint:md`.
- Production Readiness:
  - Failure mode: check is not a CI gate; state this explicitly.
  - JP1/AJS compatibility: none.
  - Large or malformed input risk: none.
  - Desktop/web impact: none.
  - README/docs impact: internal SDD documentation only.
  - CHANGELOG impact: none.
- Approval Boundary: docs-only check guidance and validation record.
- Dependencies: Slices 1–2.
- Risks: automatic quality enforcement remains a separately approved feature.
- Out of Scope: CI workflow, package scripts, Qlty configuration, and custom tooling.

## Traceability

- TRACEABILITY.md required: yes.
- Reason: this feature has multiple independent documentation slices.

## Cross-Slice Dependencies

- Slice 1 defines the structure used by Slice 2. Slices 3–5 proceed in
  parallel after Slice 2.

## Feature-Level Risks

- Briefs and quality summaries must point to the SSOT, not become policy copies.

## Use-Case Back-Propagation

- Not required: no observable extension behavior changes.
