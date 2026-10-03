# Feature Specification: semantic-diff-application-projection

## Purpose

Keep schedule-impact projection a cohesive, host-neutral application capability
while separating its DTO, build orchestration, identity, and timeline
responsibilities. Reduce responsibility concentration without recreating
domain-level over-fragmentation or changing observable comparison behavior.

## Source

- Kind: roadmap feature.
- Origin: user-selected `semantic-diff-application-projection`, item 1 of the
  [internal architecture refactoring sequence](../../roadmap.md#internal-architecture-refactoring-sequence).
- Prerequisite: the schedule facade is available at branch base
  `c144d089e6c6acf7470d3c044cc60d0292c064ea`.
- Existing contracts: [Build Semantic Diff](../../../requirements/use-cases/uc-build-semantic-diff.md),
  [Present Schedule Impact](../../../requirements/use-cases/uc-present-schedule-impact.md),
  and [Interpret JP1 Parameters](../../../requirements/domain-rules/interpret-jp1-parameters.md).
- Ownership: [Architecture](../../architecture.md#solution-shape).

## Requirements and acceptance

- R1: Give schedule-impact DTOs, build orchestration, identity, and timeline
  projection explicit, cohesive application ownership. Each material boundary
  must earn its responsibility under Solution Shape; a file-per-helper split
  or same-request/same-response wrapper is not an acceptable outcome by itself.
- R2: Reuse the comparison's retained schedule evaluation and immutable facts.
  Projection must not repeat comparison, identity matching, schedule
  evaluation, or risk evaluation. Preserve not-requested, invalid-period, and
  evaluated states, including an evaluated period containing no runs.
- R3: Preserve DTO field meaning, immutable snapshots, IDs, deterministic
  ordering, occurrence ordinals, candidate ambiguity, root correspondence,
  scope transitions, and side-local source ownership. Duplicate and nested
  inputs retain their current identity and one-to-one changed-time pairing.
- R4: Preserve exact source-change references and existing fail-closed behavior
  when a projected effect cannot resolve its upstream comparison row. Keep
  supported, valid-no-runs, partial, uncalculated, and missing-context evidence
  distinct; an empty run list must not imply a complete no-run conclusion.
- R5: Preserve ordinary Explorer and schedule-impact availability, serialized
  payload meaning, report output, localization-independent facts, filtering,
  counts, ordering, and host/session behavior for all existing consumers.
- R6: Preserve architecture dependency rules, JP1/AJS semantics, desktop/web
  operation, and the minimum supported VS Code version. Nearest boundary tests
  and required cross-host validation must demonstrate compatibility after
  restructuring.

## Decisions and impact

- Intake confirms one independently valuable outcome: the application
  schedule-impact projection becomes easier to understand and maintain while
  returning the same facts to its existing consumers. DTO, identity, timeline,
  and orchestration responsibilities support that outcome rather than separate
  product features.
- `src/application/semantic-diff/semanticDiffScheduleImpact.ts` currently owns
  the DTOs, UTF-8 length-prefixed IDs, root/issue/candidate assembly, timeline
  source-reference resolution, and public builders. The plan retains this
  module as the public builder and compatibility
  entry point, with cohesive application DTO, identity, facts, and timeline
  owners behind it.
- Domain schedule interpretation and evaluation remain domain-owned. The
  existing `semanticDiffScheduleRules` facade and retained evaluation are the
  prerequisite, not targets for another domain decomposition.
- Direct consumers include comparison/presentation-artifact builders and
  schedule-impact presentation contracts. Transitive consumers include VS Code
  panels, calendar transport/view models, and bootstrap sidecar/session wiring.
  Existing consumer import paths remain supported by direct re-exports;
  no presentation or bootstrap migration is required.
- Existing WebAPI intake is independent. Later roadmap items own VS Code
  dependency groups/source freshness, presentation calendar cohesion, domain
  readonly migration, and architecture-test decomposition.

## Compatibility

- JP1/AJS3 version 13 remains normative through the existing use-case and
  domain-rule contracts. This feature introduces no new schedule syntax,
  calendar assumptions, runtime claims, or external JP1/AJS evidence needs.
- Preserve half-open periods and source date/time representation without host
  timezone conversion. Deferred schedule semantics remain explicit.
- `package.json` `engines.vscode` remains `^1.75.0`; desktop and browser entry
  points remain supported. Shared code stays browser-safe without Node, VS Code,
  parser-internal, or UI-framework dependencies.
- Preserve externally consumed DTO/data meaning and existing exported builder
  and ID semantics. Planning may relocate imports but must account for every
  consumer and alias; removal or contract change requires a separate decision.

## Non-goals

- New schedule support, domain schedule-rule changes, manual correspondence,
  different identity/pairing rules, or new comparison/report behavior.
- VS Code dependency narrowing, source-freshness relocation, bootstrap lifecycle
  changes, calendar component cohesion, or new presentation interactions.
- Readonly domain-model migration, architecture-test decomposition or exceptions,
  parser/generated changes, dependency modernization, telemetry collection,
  WebAPI beta exit, or unrelated roadmap verification repairs.
- Speculative generic projection frameworks, registries, ports, or abstractions.

## Open questions

No unresolved product or design decision blocks the plan. The selected module
shape and exact slice boundary are recorded in `TASKS.md`; independent review
and explicit Human Approval remain required before implementation.
