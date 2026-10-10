# Feature Specification: Schedule Projection Facts Cohesion

## Purpose

Separate distinct reasons for change within Application schedule projection
facts while preserving the existing comparison and schedule-impact contracts.
The outcome is clearer semantic ownership and bounded change impact, measured
by responsibility and contract review rather than file count or line count.

## Source

- Kind: repository roadmap feature candidate.
- Slug: `semantic-diff-schedule-projection-facts-cohesion`.
- User-supplied “AJS Butler Repository-wide Architecture 再評価”,
  2026-10-10, sections 2, 9 and 10 (P1), evaluated at
  `7713435dc0d4aece4604f88722dbb51d30315104`.
- Preserve [Build Semantic Diff](../../../requirements/use-cases/uc-build-semantic-diff.md),
  [Present Schedule Impact](../../../requirements/use-cases/uc-present-schedule-impact.md)
  and [Present Semantic Diff Report](../../../requirements/use-cases/uc-present-semantic-diff-report.md).
- JP1/AJS basis: existing supported schedule meanings in
  [Interpret JP1 Parameters](../../../requirements/domain-rules/interpret-jp1-parameters.md)
  and the JP1/AJS3 version 13 target in
  [Architecture](../../architecture.md#parser-and-model-boundary).
  This feature introduces no new parameter or scheduler interpretation.

## Requirements and acceptance

- R1: Separate independently meaningful reasons for change in Run Projection,
  Issue Projection and Root Correspondence where an explicit semantic contract
  supports the boundary. Each chosen boundary must own a meaningful decision;
  merely forwarding the same request/response is prohibited. Acceptance is a
  reviewable ownership/dependency explanation supported by contract tests.
- R2: Preserve the public facts builder, DTO shapes, existing export aliases,
  stable ID encoding, deterministic ordering, side-local last-hit lookup,
  candidate exclusions, duplicate occurrence identity and run pairing.
  Equivalent inputs must retain the existing outputs and references.
- R3: Preserve all not-requested, invalid-period and evaluated facts states,
  supported-runs, valid-no-runs, partial and uncalculated outcomes, root-scope
  transitions, nested issue ownership, and explicit unsupported evidence.
- R4: Preserve exact source-change composite references and fail-closed behavior
  when a supporting comparison row is missing. Build facts from the existing
  single schedule evaluation; do not rerun comparison or schedule evaluation.
- R5: Preserve deeply immutable output, cloned evidence details, host-neutral
  types, desktop/web execution and the existing architecture dependency rules.
- R6: Accept structural changes only where the intake dependency facts and
  existing behavior tests support meaningful separation. Closely coupled
  assembly may remain together; arbitrary three-way or size-based splitting
  does not satisfy acceptance.

## Decisions and impact

- Selected scope is P1 only: Application schedule projection facts and its
  contract verification. `buildScheduleProjectionFacts` remains the final
  Application orchestration entry. Exact module boundaries and affected paths
  are recorded in [TASKS](TASKS.md).
- Run indexing uses root identity and source-key context; issue classification
  and evidence use root ownership and candidate exclusions. Root outcomes use
  both runs and issues; final issue IDs require completed root correspondence.
  Preserve this dependency ordering and final issue/root consistency.
- Identity, DTO and timeline owners are existing supporting contracts, not
  permission to redesign them. The final impact builder also consumes
  `deepFreeze` and `cloneDetail` from the facts module.
- Existing [Semantic Diff Roadmap](../../roadmap.md#semantic-diff-roadmap)
  items concern deferred schedule semantics with external context and product
  prerequisites. This feature preserves their explicit uncalculated behavior;
  it neither fulfills nor absorbs those items. Combining them would conflate
  a structural change with new domain behavior and different entry conditions.
- The only inherited feature is read-only WebAPI import; it has no overlapping
  outcome. No feature consolidation is warranted by the inspected repository.
- All roadmap items were also checked for purpose, prerequisites and done
  conditions; none shares P1’s structural outcome. Related verification gates
  remain independent, as indexed in TASKS.
- Report a new P1 roadmap candidate to Main. Durable use-case/domain documents
  and README require no change for the intended behavior-preserving outcome;
  no changelog entry is expected under the SDD policy.

## Compatibility

- Keep `engines.vscode` at `^1.75.0`, supporting VS Code 1.75 and newer.
- Keep shared Application code browser-safe and usable on desktop and web;
  no Node, VS Code, parser-internal, infrastructure or UI-framework dependency.
- Preserve the existing JP1/AJS3 version 13 schedule interpretation boundary,
  raw dates/times, half-open periods and unsupported/uncalculated evidence.
- Do not change DTOs, encoded IDs, ordering, pairing or references consumed by
  existing Semantic Diff reports, Explorer and Schedule Impact presentation.

## Non-goals

- P2 Timeline naming/ownership, P3 document traversal and P4 bootstrap cleanup.
- Deferred schedule semantics, new calendars or scheduler context, manual
  correspondence, timezone conversion or new supported JP1 parameter forms.
- Domain Schedule, Unit List, parser, normalized model, architecture-test or
  repository-wide redesign; extra DTO/ID/timeline abstractions for their own sake.
- File/line-count targets, forwarding wrappers, new dependency packages,
  architecture exceptions, or modifying the inherited WebAPI feature.
