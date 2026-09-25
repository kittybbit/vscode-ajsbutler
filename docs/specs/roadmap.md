# Roadmap

This roadmap contains only unfinished repository-level future work and the
entry conditions that make planning each item useful.

## Product Decisions

### WebAPI Import Beta Exit

- Entry condition: usable smoke-verification evidence from a real JP1/AJS3
  WebAPI environment and enough user feedback are available.
- Decide whether the delivered read-only import can exit beta after the owning
  feature records product and version context, tested scenarios, observed
  results, host constraints, and the sufficiency of
  `searchTarget=DEFINITION`.
- Keep broader WebAPI behavior outside this decision.

## Verification Follow-ups

### Planner Custom-Agent Discovery

- Owner: SDD harness maintainers.
- Scope: in a fresh Codex session, verify that `planner` is selectable for
  explicit Planning and Replanning requests and that `plan-author` and
  `plan-reviser` are no longer selectable. Static TOML parsing in the
  implementation session did not verify runtime discovery.
- Entry condition for the next SDD harness optimization feature: record the
  discovery result; route any failure through a scoped SDD fix before relying
  on the new role.

### SDD Harness Optimization Sequence

- Source: the user's SDD harness improvement brief. Treat each item as a
  separate SDD feature with its own plan, independent review, human approval,
  and completion evidence. The shared deterministic evidence skill is available;
  the remaining items are not approved implementation scope.
- Measure token use, elapsed time, agent invocations, review findings,
  retries, routing consistency, and approval violations before claiming an
  efficiency or quality improvement.

1. `sdd-deterministic-commit-gate`: evaluate and, only if authorization can be
   verified without inference, migrate the approval-committer's mechanical
   checks and focused commit operation to a fail-closed tool. Keep every human
   approval and independent review gate. A `TASKS.md` status field alone is
   insufficient proof of human approval; first establish an authoritative,
   machine-verifiable approval source or retain the existing gate role.
2. `sdd-execution-profiles`: define model-independent `standard` and `deep`
   classification and record the profile in slice artifacts. The classifier
   may consume reviewed declarations about semantic owner, contracts, and
   material abstractions, but must not pretend those judgments can be
   inferred from a path scan. Resolve unknown risk to `deep`; do not select a
   model at runtime.
3. `sdd-profile-agent-routing`: evaluate fixed-runtime variants for only the
   implementer and implementation reviewer, and route by the recorded profile.
   Add variants only when the measured quality and cost justify maintenance;
   verify the new agent definitions are actually discoverable before routing.
4. `sdd-feature-exit-responsibilities`: after prior changes are measured,
   evaluate read-only exit review and approved durable-document propagation as
   separate responsibilities.

- Entry condition for each remaining item: its preceding evidence or routing
  dependency is complete and the existing lifecycle's quality and approval
  boundaries can be maintained. Do not create placeholder feature folders.

### Expanded Flow Graph Golden Alignment

- Owner: Flow graph test maintainers.
- Current baseline: the representative expanded-graph use-case suite retains
  one node-order golden mismatch while the implementation's deterministic
  ordering remains unchanged for Semantic Diff Explorer behavior.
- Entry condition: reconcile the existing golden with the verified graph-order
  contract in a separately scoped test-maintenance slice.

### Dependabot Post-Publication Verification

- Owner: Security/tooling maintainers.
- Scope: re-query GitHub Dependabot after the completed dependency graph is
  published to the default branch, covering the affected, current, and newly
  opened alert set.
- Done condition: record the complete published-graph alert result and its
  explicit disposition. Route any unresolved or new affected alert to the
  security owner or Replanning; do not dismiss, waive, or claim an alert was
  already resolved.

### WebAPI Generated Fixture Reproducibility

- Owner: Existing WebAPI maintainer.
- Scope: verify reproducibility of
  `src/test/fixtures/webapi/generated/jp1Ajs3WebApi.prism.generated.yaml`.
- Done condition: `pnpm run openapi:check` exits 0 and the exact fixture
  matches generator output. No runtime or generator edit is implied.

## Semantic Diff Roadmap

### Internal Architecture Refactoring Sequence

- Purpose: maintain the verified Clean Architecture and DDD boundaries while
  reducing internal over-fragmentation, duplication, and responsibility
  concentration. Prefer existing semantic owners and cohesive modules over new
  abstractions.
- Sequencing: treat the items below as separate SDD features with independent
  plans, reviews, approvals, and completion evidence. Do not create one umbrella
  implementation feature; this roadmap section is the coordination record.

1. `schedule-primitives-and-document-index`: establish one canonical
   date/period implementation and one reusable AJS document index after schedule
   ownership is stable.
2. `semantic-diff-schedule-facade`: return the compatibility facade to thin
   orchestration after schedule ownership and shared primitives are settled.
3. `semantic-diff-application-projection`: separate the schedule-impact DTO,
   build orchestration, identity, and timeline responsibilities without
   recreating domain-level over-fragmentation.
4. `semantic-diff-vscode-dependencies`: narrow command dependency groups and
   move source-freshness behavior out of bootstrap while retaining bootstrap as
   the composition root.
5. `schedule-impact-calendar-cohesion`: co-locate or merge presentation-only
   wrappers and single-consumer helpers that do not earn an independent React,
   interaction, accessibility, state, reuse, test, or complexity boundary.
6. `domain-model-readonly`: migrate normalized domain model parts to readonly
   contracts incrementally after mutation impact is characterized.
7. `architecture-test-cohesion`: split the architecture-test implementation
   only when its size or change pressure justifies the boundary; do not build a
   speculative static-analysis framework.

- Entry condition for each later item: the preceding dependency that affects
  its semantic owner or public contract is complete, and intake confirms that
  the item still represents one independently valuable outcome. Unrelated
  later items may be reconsidered or reordered through their own intake when
  evidence shows no dependency.

### Deferred Schedule Semantics

- Sequencing: Waves 3 and 4 are complete. Before selectively pursuing these
  follow-ups, retain the completed schedule interpretation and projection
  contracts as prerequisites; no new numbered wave is created by this section.
- Parent schedule inheritance and `ln`: retain explicit uncalculated evidence.
  Entry condition: a reviewed neutral contract distinguishes an inherited
  execution-generation date from a guaranteed nested-jobnet start time, with
  complete normalized parent context and explicit missing-parent and cycle
  behavior. Coordinate with the structured-output owner before representing
  inherited execution without claiming an exact start.
- 48-hour and day-crossing start times: retain explicit uncalculated evidence.
  Entry condition: normalized 24/48-hour mode and effective scheduler base-time
  context are available. Any new adapter, timezone conversion, or comparison
  option is a planning boundary.
- Cycle schedules: retain explicit uncalculated evidence. Entry condition:
  normalized execution-registration anchor and mode, valid term, first
  recurrence, and comparison-period boundary semantics are source-backed.
- `cftd` days-from-start: retain explicit uncalculated evidence and require a
  separate product intake after cycle and substitution contracts are stable.
- Omitted-`sh` Cancel default: preserve the current no-substitution behavior.
  Entry condition: an explicit scheduler-service calendar source and an
  approved compatibility migration establish the baseline; host or implicit
  calendar fallback is not allowed.
- Registration-relative `en` and generalized omitted-year/month schedule
  forms: retain explicit uncalculated evidence. Entry condition: a
  source-backed registration-date contract is available; comparison-period
  start and host clock must not be used as a substitute.
