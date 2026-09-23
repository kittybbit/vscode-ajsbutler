# Feature Specification: Schedule Domain Ownership

## Purpose

Make the domain schedule package the semantic owner of reusable normalized
JP1/AJS schedule interpretation, calendar, and projection concepts, while
preserving existing behavior and reducing the processing-step fragmentation
currently concentrated under Semantic Diff.

## Minimal Context

- Current decision: move reusable schedule meaning out of the
  `domain/services/semantic-diff` namespace and group code by reason to change,
  without introducing a new bounded context or changing supported semantics.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Feature kind: roadmap feature; this is the first selected feature in the
  ordered internal-architecture refactoring sequence recorded in
  `docs/specs/roadmap.md`.
- Source: the user-provided refactoring proposal dated 2026-09-21, especially
  its Phase 1 and F1 `Schedule Domain package` boundary decision.
- Source use cases:
  `docs/requirements/use-cases/uc-build-semantic-diff.md`,
  `docs/requirements/use-cases/uc-present-schedule-impact.md`,
  `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`, and
  `docs/requirements/use-cases/uc-view-unit-list.md`.
- JP1/AJS reference basis: the existing normalized-model behavior and durable
  use-case contracts, with JP1/AJS3 version 13 remaining normative. The source
  proposal supplies no new JP1/AJS manual citation and authorizes no new
  schedule form or changed schedule meaning.
- Implementation-slice plan: `TASKS.md`; no slice has been authored during
  feature intake.

## Requirements

- Reusable schedule-date, schedule-rule, calendar-context, interpretation, and
  projection meaning must have one semantic owner under a domain schedule
  package rather than appear to be owned by Semantic Diff.
- Semantic Diff must retain only comparison-specific schedule responsibilities,
  including before/after evaluation, run comparison, and comparison decisions.
- Existing reusable behavior in
  `domain/models/parameters/scheduleDateInterpreter.ts`,
  `domain/models/parameters/scheduleRuleHelpers.ts`, and the generic schedule
  parts of `domain/services/semantic-diff/semanticDiffSchedule*` must be
  considered together when defining the schedule package boundary.
- The resulting modules must group concepts that change together. Processing
  steps such as evidence collection, candidate selection, operational-month
  calculation, and projection must not each receive a separate exported
  abstraction unless the approved Solution Shape demonstrates an independent
  contract or semantic owner.
- Prefer consolidation into a small set of schedule concepts such as date,
  rule interpretation, calendar/candidate resolution, and projection. If
  interpretation needs separation, it must remain no deeper than an
  interpreter and a rule interpreter unless replanning approves another
  independently valuable boundary.
- Existing exported or layer-crossing abstractions must be retained only when
  their concrete responsibility earns a boundary. Ordinary co-located helpers
  are preferred over new forwarding wrappers or speculative extension points.
- Diagnostics, unit-list projection, Semantic Diff, and schedule-impact
  projection must continue to consume the same schedule meaning rather than
  acquire consumer-specific interpretations.
- Unsupported, invalid, missing-context, mixed, complete no-runs, and
  calculated-run outcomes must retain their current distinctions and evidence.
- The refactor must not broaden or narrow the currently supported JP1/AJS
  schedule semantics, consult host locale or an external calendar, or change
  the half-open comparison-period contract.

## Architecture

- Domain: own reusable normalized schedule interpretation, calendar, candidate,
  and projection meaning in a schedule package; keep Semantic Diff comparison
  policy in the semantic-diff package.
- Application: retain host-neutral use cases and DTO/view-model projections;
  adapt internal imports only where the approved domain boundary requires it.
- Presentation: no new responsibility and no direct domain import.
- Infrastructure: no change; parser normalization and external adapters remain
  outside the schedule domain package.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: domain
  schedule helpers and Semantic Diff schedule modules; application unit-list
  and Semantic Diff callers; diagnostics; schedule and architecture tests.
  Presentation, bootstrap, parser infrastructure, commands, and transport
  contracts are not expected to change behavior.
- Propagation decision: move and consolidate domain ownership atomically with
  affected imports and nearest tests. Keep application DTOs, presentation
  payloads, and observable use-case results unchanged.

### Breaking Change Analysis

- User-visible behavior: none; this is an internal ownership and cohesion
  refactor.
- API/DTO/schema compatibility: application DTOs and serialized schemas remain
  unchanged. Internal TypeScript module paths and domain exports may change
  together within the approved implementation slice.
- VS Code/web extension compatibility: preserve `engines.vscode` `^1.75.0`,
  browser-safe production code, and both desktop and web bundles.
- Changed scenarios: none. All schedule scenarios in Build Semantic Diff,
  Present Schedule Impact, Diagnose AJS Definition, and View Unit List remain
  behavior contracts.

### Alternative Considerations

- One umbrella feature for all eight proposed refactors: rejected because the
  proposal contains independent outcomes, risks, affected layers, and approval
  boundaries. The roadmap records their ordering without creating a second
  implementation plan.
- Keep reusable schedule meaning under `semantic-diff`: rejected because
  diagnostics and unit-list behavior already consume the same domain helpers,
  and schedule meaning is stable independently of a comparison consumer.
- Introduce value objects, repositories, domain events, or use-case classes:
  rejected as outside the stated problem and unsupported by current behavior.
- Enforce one responsibility per file: rejected. Cohesion and reason to change,
  not function count, determine the boundary.

### Overlap And Split Decision

- This selected feature owns semantic ownership and cohesive package
  reorganization only.
- `schedule-primitives-and-document-index` owns canonical date/period parsing
  and shared AJS document indexing after this package boundary is stable.
- `semantic-diff-schedule-facade` owns later simplification of the compatibility
  facade after schedule ownership and shared primitives are settled.
- Application projection, VS Code dependency/wiring, Calendar webview,
  domain-readonly, and architecture-test changes remain separate roadmap
  features because they can deliver and validate independently.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` lifecycle-gate sections.
- Scope changes requiring re-approval: changed schedule behavior, a new
  supported or unsupported JP1/AJS form, application DTO/schema changes,
  presentation or bootstrap behavior, shared date/period/index work, new
  architecture exceptions, or a material abstraction not covered by the
  reviewed Solution Shape.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` `^1.75.0`.
- Web extension compatibility: production source remains free of Node built-ins
  and host assumptions; the web build and affected host-neutral tests must
  retain current behavior.
- Desktop extension compatibility: commands, comparison results, diagnostics,
  unit-list values, reports, and schedule-impact presentation remain unchanged.
- JP1/AJS compatibility: existing version 13 schedule interpretation and
  explicit unsupported/uncalculated evidence remain unchanged.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- A domain schedule package is the explicit owner of reusable schedule-date,
  schedule-rule, calendar/candidate, interpretation, and projection meaning.
- Remaining schedule code under the Semantic Diff package is specific to
  comparison inputs, outputs, or decisions; reusable schedule semantics are
  not named as Semantic Diff concepts.
- The reviewed Solution Shape accounts for every retained or new exported
  schedule abstraction and rejects processing-step-only boundaries.
- Diagnostics, unit-list, Semantic Diff, and schedule-impact use the same
  domain-owned interpretation without observable behavior changes.
- Existing schedule-rule, schedule-calendar, Semantic Diff schedule,
  schedule-impact projection, unit-list, diagnostics, and architecture tests
  pass with unchanged scenario expectations.
- Desktop and web validation pass, and comparable qlty observations contain no
  new finding or reliably mapped adverse movement.
- No application DTO, serialized schema, command, user workflow, supported
  schedule form, or fallback policy changes.

## Non-Goals

- Deduplicating canonical `YYYY-MM-DD` parsing, period validation, or AJS
  document indexing; those belong to `schedule-primitives-and-document-index`.
- Simplifying the Semantic Diff schedule compatibility facade; that belongs to
  `semantic-diff-schedule-facade` after this feature and shared primitives.
- Reorganizing the Semantic Diff application projection, VS Code command
  dependencies, bootstrap wiring, or Schedule Impact Calendar components.
- Making normalized domain models readonly or restructuring the architecture
  dependency-test implementation.
- Adding JP1/AJS schedule semantics, external calendar access, host-timezone
  behavior, value-object classes for all primitives, repositories, domain
  events, or class-based use cases.
- Changing durable use-case behavior, user documentation, or CHANGELOG-visible
  behavior.

## Open Questions

- None for intake. Exact module names, migration order, retained compatibility
  exports, and independently testable implementation slices are planning
  decisions and must be reviewed before approval.
