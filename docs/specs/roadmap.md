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

### Wave 4: Schedule Impact Presentation

#### Add A Schedule Impact Calendar

- Origin: proposal N-3.
- Present added, removed, changed-time, zero-run, and uncalculated schedule
  effects for a selected comparison period.
- Entry condition: schedule interpretation and run-projection contracts are
  stable. Internal artifact and session support precedes the comparison
  workflow; the public calendar action follows the completed period-bearing
  workflow and Explorer handoff.

### Deferred Schedule Semantics

- Sequencing: complete Wave 3, then Wave 4, before selectively pursuing these
  follow-ups. The completed schedule interpretation and projection contracts
  are prerequisites; no new numbered wave is created by this section.
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
